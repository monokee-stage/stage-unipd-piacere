import 'reflect-metadata';

import { Router, Request, Response, NextFunction } from 'express';

import {
    DeviceRepository,
    EventRepository,
    Transaction,
    TransactionRepository,
    Event
} from 'repositories';

import { TYPES } from 'repositories';

import { injectable, inject } from 'inversify';
import { RedisTransactionRepository } from 'repositories';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { RandomCodeGenerator } from '../../services/random-code-generator/random-code-generator';
import { Hasher } from '../../services/hasher/hasher';
import { NotificationRepository } from 'repositories';
import { NotificationData } from 'repositories';
import { GeoConverter } from '../../services/geo-converter/geo-converter';
import { coreTYPES } from '../../types';

@injectable()
export class RequestsController {
    constructor(
        @inject(TYPES.TransactionRepository) private transactionRepo: TransactionRepository,
        @inject(TYPES.EventRepository) private eventsRepo: EventRepository,
        @inject(TYPES.DeviceRepository) private devicesRepo: DeviceRepository,
        @inject(UUIDGenerator) private uuidGen: UUIDGenerator,
        @inject(RandomCodeGenerator) private rcGen: RandomCodeGenerator,
        @inject(Hasher) private hasher: Hasher,
        @inject(TYPES.NotificationRepository) private notifier: NotificationRepository,
        @inject(coreTYPES.GeoConverter) private geoConv: GeoConverter) {
    }

    // maybe it'd be better to send a response to the requester before the end of the operations
    public requestConfirmation(user_id: string, target_id: string, data: any): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {

                // generate confirmation code and hash it
                var confCode = RandomCodeGenerator.getCode()
                var hashedConfCode = this.hasher.hashText(confCode)

                var promisesToExecute = []

                var p1: Promise<any> = this.devicesRepo.getDevices(target_id).then((devs): string[] => {
                    let tokens: string[] = []
                    devs.forEach((item) => {
                        tokens.push(item.registration_token)
                    })
                    return tokens
                })
                promisesToExecute.push(p1)

                if (data.coordinates) {
                    var p2: Promise<any> = this.geoConv.getPlaceFromCoordinates(data.coordinates.lat, data.coordinates.lon)
                    promisesToExecute.push(p2)
                }

                // get registration_tokens and convert coordinates to location
                var results = await Promise.all(promisesToExecute)
                var devices_tokens: string[] = results[0]
                var location = undefined;
                if (results.length > 1) {
                    // results[1] is undefined if GeoConverter was unable to do the geocoding
                    // so from now on check location before using it
                    location = results[1]
                }


                // define the transaction
                var trans: Transaction = {
                    _id: UUIDGenerator.getUUID(),
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
                var event: Event = {
                    _id: UUIDGenerator.getUUID(),
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

                // define notification data (what the device will get)
                var notifData: NotificationData = {
                    transaction_id: trans._id,
                    confirmation_code: confCode,
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
                // prima invia notifica e verifica se invio andato a buon fine, poi salva evento e transazione
                await this.notifier.sendNotification(devices_tokens, notifData)

                // myabe check if all the devices where reached

                // save event and transaction
                Promise.all([
                    await this.eventsRepo.addEvent(event),
                    await this.transactionRepo.addTransaction(trans)
                ])

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
                var trans: Transaction = await this.transactionRepo.getTransaction(trans_id)
                if (Object.keys(trans).length === 0) {
                    return reject({ error: 'No transaction with that id' });
                }
                // verify if the one who is asking for the status is the same that issued the request
                if (trans.requester_id === user_id) {
                    return resolve(trans.status);
                } else {
                    return reject({ error: 'You are not the issuer of this request' })
                }
            } catch (err) {
                return reject(err)
            }
        })
    }
}