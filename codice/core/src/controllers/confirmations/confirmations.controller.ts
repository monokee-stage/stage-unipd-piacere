import 'reflect-metadata';

import { Router, Request, Response, NextFunction } from 'express';
import {
    Transaction, TransactionRepository,
    Event, EventRepository,
    DeviceRepository
} from 'repositories';
import { TYPES } from 'repositories';

import { injectable, inject } from 'inversify';
import { RSADecryptor } from '../../services/decryptor/rsa-decryptor/rsa-decryptor';
import { Decryptor } from '../../services/decryptor/decryptor';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';

@injectable()
export class ConfirmationController {
    constructor(
        @inject(TYPES.TransactionRepository) private transRepo: TransactionRepository,
        @inject(TYPES.EventRepository) private eventRepo: EventRepository,
        @inject(TYPES.DeviceRepository) private deviceRepo: DeviceRepository,
        @inject(UUIDGenerator) private uuidGen: UUIDGenerator
    ) {
    }

    public approveTransaction(user_id: string, trans_id: string, device_id: string, signed_conf_code: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                let check = await this.checkSignatureAndTime(user_id, trans_id, device_id, signed_conf_code)

                if (check) {
                    let uuid = this.uuidGen.getUUID()
                    let event: Event = {
                        _id: uuid,
                        user_id: user_id,
                        device_id: device_id,
                        type: 'approval',
                        timestamp: new Date() as unknown as string,
                        transaction_id: trans_id,
                    }
                    await Promise.all([await this.transRepo.approveTransaction(trans_id), this.eventRepo.addEvent(event)])

                    return resolve()
                } else {
                    return reject({ error: 'Transaction approval failed' })
                }
            } catch (err) {
                return reject(err)
            }
        })
    }
    public denyTransaction(user_id: string, trans_id: string, device_id: string, signed_conf_code: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                let check = await this.checkSignatureAndTime(user_id, trans_id, device_id, signed_conf_code)
                if (check) {
                    let uuid = this.uuidGen.getUUID()
                    let event: Event = {
                        _id: uuid,
                        user_id: user_id,
                        device_id: device_id,
                        type: 'denial',
                        timestamp: new Date() as unknown as string,
                        transaction_id: trans_id,
                    }
                    await Promise.all([await this.transRepo.refuseTransaction(trans_id), this.eventRepo.addEvent(event)])
                    return resolve()
                } else {
                    return reject({ error: 'Transaction refusal failed' })
                }
            } catch (err) {
                return reject(err)
            }
        })
    }

    private checkSignatureAndTime = async (user_id: string, transaction_id: string, device_id: string, signed_confirmation_code: string): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                var transaction: Transaction = await this.transRepo.getTransaction(transaction_id)
                if (!transaction) {
                    console.log('transaction not found')
                    return resolve(false)
                }
                var ttl = transaction.ttl
                var min_ttl = parseInt(process.env.TRANSACTION_MIN_CONFIRMATION_TTL || '30')

                // set ttl = tt+min_ttl
                if (transaction.status === 'pending' && ttl > min_ttl) {
                    let conf_code = transaction.confirmation_code
                    let device = await this.deviceRepo.getDevice(device_id, user_id)
                    let pub_key = device.public_key
                    let dec: Decryptor = new RSADecryptor(pub_key)
                    let plain_conf_code = dec.decrypt(signed_confirmation_code)

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