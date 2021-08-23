import 'reflect-metadata';

import { Router, Request, Response, NextFunction } from 'express';
import {
    Transaction, TransactionRepository,
    Event, EventRepository,
    DeviceRepository,
    Device
} from 'repositories';
import { TYPES } from 'repositories';

import { injectable, inject } from 'inversify';
import { RSADecryptor } from '../../services/decryptor/rsa-decryptor/rsa-decryptor';
import { Decryptor } from '../../services/decryptor/decryptor';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { CodedError } from '../../coded.error';

@injectable()
export class ConfirmationController {
    constructor(
        @inject(TYPES.TransactionRepository) private transRepo: TransactionRepository,
        @inject(TYPES.EventRepository) private eventRepo: EventRepository,
        @inject(TYPES.DeviceRepository) private deviceRepo: DeviceRepository,
    ) {
    }

    public approveTransaction(user_id: string, trans_id: string, device_id: string, signed_conf_code: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const check: boolean = await this.checkSignatureAndTime(user_id, trans_id, device_id, signed_conf_code)

                if (check) {
                    const uuid: string = UUIDGenerator.getUUID()
                    const event: Event = {
                        _id: uuid,
                        user_id: user_id,
                        device_id: device_id,
                        type: 'approval',
                        timestamp: new Date() as unknown as string,
                        transaction_id: trans_id,
                    }
                    const result: boolean = await this.transRepo.approveTransaction(trans_id);
                    if (result) {
                        await this.eventRepo.addEvent(event)
                        return resolve()
                    } else {
                        return reject(new CodedError('Transaction not found', 400))
                    }
                } else {
                    return reject(new CodedError('Transaction approval failed', 401))
                }
            } catch (err) {
                return reject(err)
            }
        })
    }
    public denyTransaction(user_id: string, trans_id: string, device_id: string, signed_conf_code: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const check: boolean = await this.checkSignatureAndTime(user_id, trans_id, device_id, signed_conf_code)
                if (check) {
                    const uuid: string = UUIDGenerator.getUUID()
                    const event: Event = {
                        _id: uuid,
                        user_id: user_id,
                        device_id: device_id,
                        type: 'denial',
                        timestamp: new Date() as unknown as string,
                        transaction_id: trans_id,
                    }
                    const result: boolean = await this.transRepo.refuseTransaction(trans_id);
                    if(result){
                        await this.eventRepo.addEvent(event)
                        return resolve()
                    }else{
                        return reject(new CodedError('Transaction not found', 400))
                    }
                } else {
                    return reject(new CodedError('Transaction refusal failed', 500))
                }
            } catch (err) {
                return reject(err)
            }
        })
    }

    private checkSignatureAndTime = async (user_id: string, transaction_id: string, device_id: string, signed_confirmation_code: string): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const transaction: Transaction = await this.transRepo.getTransaction(transaction_id)
                if (!transaction) {
                    return reject(new CodedError('Transaction not found', 400))
                }
                const ttl: number = transaction.ttl
                const min_ttl: number = parseInt(process.env.TRANSACTION_MIN_CONFIRMATION_TTL || '30')

                if (transaction.status === 'pending' && ttl > min_ttl) {
                    const conf_code: string = transaction.confirmation_code
                    const device: Device | undefined = await this.deviceRepo.getDevice(device_id, user_id)
                    if(!device) {
                        return reject(new CodedError('Device not found', 401))
                    }
                    const pub_key: string = device.public_key
                    const dec: Decryptor = new RSADecryptor(pub_key)
                    const plain_conf_code: string = dec.decrypt(signed_confirmation_code)

                    if (plain_conf_code === conf_code) {
                        return resolve(true)
                    } else {
                        console.log('codes don\'t match')
                        return resolve(false)
                    }
                } else {
                    console.log('time limit reached')
                    return resolve(false)
                }
            } catch (err) {
                reject(err)
            }
        })
    }
}