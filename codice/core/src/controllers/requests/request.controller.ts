import 'reflect-metadata';

import { Router, Request, Response, NextFunction } from 'express';

import {
    DeviceRepository,
    EventRepository,
    Transaction,
    TransactionRepository,
    Event,
    Device
} from 'repositories';

import { TYPES } from 'repositories';

import { injectable, inject } from 'inversify';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { RandomCodeGenerator } from '../../services/random-code-generator/random-code-generator';
import { Hasher } from '../../services/hasher/hasher';
import { NotificationRepository } from 'repositories';
import { NotificationData } from 'repositories';
import { GeoConverter } from '../../services/geo-converter/geo-converter';
import { coreTYPES } from '../../types';
import { CodedError } from '../../coded.error';

@injectable()
export class RequestsController {
    constructor(
        @inject(TYPES.TransactionRepository) private transactionRepo: TransactionRepository,
        @inject(TYPES.EventRepository) private eventsRepo: EventRepository,
        @inject(TYPES.DeviceRepository) private devicesRepo: DeviceRepository,
        @inject(Hasher) private hasher: Hasher,
        @inject(TYPES.NotificationRepository) private notifier: NotificationRepository,
        @inject(coreTYPES.GeoConverter) private geoConv: GeoConverter) {
    }

    // todo: maybe it'd be better to send a response to the requester before the end of the operations
    public requestConfirmation(user_id: string, target_id: string, data: any): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {

                // generate confirmation code and hash it
                const confCode: string = RandomCodeGenerator.getCode()
                const hashedConfCode: string = this.hasher.hashText(confCode)

                let promisesToExecute: Promise<any>[] = []

                let p1: Promise<string[]> = this.devicesRepo.getDevices(target_id).then((devs): string[] => {
                    let tokens: string[] = []
                    devs.forEach((item) => {
                        if (item.registration_token === undefined) {
                            throw new CodedError('Some of the devices have not a registration token', 418)
                        }
                        tokens.push(item.registration_token)
                    })
                    return tokens
                })
                promisesToExecute.push(p1)

                if (data.coordinates) {
                    let p2: Promise<string> = this.geoConv.getPlaceFromCoordinates(data.coordinates.lat, data.coordinates.lon)
                    promisesToExecute.push(p2)
                }

                // get registration_tokens and convert coordinates to location
                const results: any[] = await Promise.all(promisesToExecute)
                let devices_tokens: string[] = results[0]
                if (devices_tokens.length === 0) {
                    return reject(new CodedError('No available devices found for the selected user', 400));
                }
                let location: any = undefined;
                if (results.length > 1) {
                    // results[1] is undefined if GeoConverter was unable to do the geocoding
                    // so from now on check location before using it
                    location = results[1]
                }

                const tUuid = UUIDGenerator.getUUID()
                const eUuid = UUIDGenerator.getUUID()

                // define notification data (what the devices will get)
                let notifData: NotificationData = {
                    transaction_id: tUuid,
                    confirmation_code: confCode,
                    timestamp: new Date() as unknown as string
                }
                if (data.coordinates) {
                    notifData.coordinates = data.coordinates
                }
                if (location) {
                    notifData.location = location
                }
                if (data.extra_info) {
                    notifData.extra_info = data.extra_info
                }

                // send the notification to the device
                const result = await this.notifier.sendNotification(devices_tokens, notifData)
                if(!result) {
                    return reject(new CodedError('Unable to send the notification to at least one of the user\'s devices', 400));
                }

                // define the transaction
                let trans: Transaction = {
                    _id: tUuid,
                    user_id: target_id,
                    requester_id: user_id,
                    request_timestamp: new Date().toJSON(),
                    confirmation_code: hashedConfCode,
                    status: 'pending',
                    ttl: parseInt(process.env.TRANSACTION_TTL || '30')
                }
                if (data.coordinates) {
                    trans.coordinates = data.coordinates
                }
                if (location) {
                    trans.location = location
                }
                if (data.extra_info) {
                    trans.extra_info = data.extra_info
                }

                // define the event
                let event: Event = {
                    _id: eUuid,
                    user_id: target_id,
                    type: 'request',
                    timestamp: new Date as unknown as string,
                    transaction_id: trans._id
                }
                if (data.coordinates) {
                    event.coordinates = data.coordinates
                }
                if (location) {
                    event.location = location
                }
                if (data.extra_info) {
                    event.extra_info = data.extra_info
                }

                // save event and transaction
                // if the transaction save fails the event is not saved
                await this.transactionRepo.addTransaction(trans)
                await this.eventsRepo.addEvent(event)

                // show result to the requester
                return resolve(trans._id)
            } catch (err) {
                return reject(err)
            }
        })
        
    }

    public getStatus(user_id: string, trans_id: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                let trans: Transaction | undefined = await this.transactionRepo.getTransaction(trans_id)
                if (!trans) {
                    return reject(new CodedError('Transaction not found', 404));
                }
                // verify if the one who is asking for the status is the same that issued the request
                if (trans.requester_id === user_id) {
                    return resolve(trans.status);
                } else {
                    return reject(new CodedError('You are not the issuer of this request', 401))
                }
            } catch (err) {
                return reject(err)
            }
        })
    }
}