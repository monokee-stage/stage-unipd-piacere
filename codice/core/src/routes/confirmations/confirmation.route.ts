import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {Transaction, RedisTransactionRepository, TYPES, TransactionRepository, EventRepository, DeviceRepository} from 'repositories';

import {injectable, inject} from 'inversify';
import { RSADecryptor } from '../../services/decryptor/rsa-decryptor/rsa-decryptor';
import { Decryptor } from '../../services/decryptor/decryptor';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';

@injectable()
export class ConfirmationRoute extends Route {
	constructor(
        @inject(TYPES.TransactionRepository) private transRepo: TransactionRepository,
        @inject(TYPES.EventRepository) private eventRepo: EventRepository,
        @inject(TYPES.DeviceRepository) private deviceRepo: DeviceRepository,
        @inject(UUIDGenerator) private uuidGen: UUIDGenerator
    ) {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();
		this.router.get(this.basePath + '/transaction/:transaction_id/approve', this.approveTransaction);
        this.router.get(this.basePath + '/transaction/:transaction_id/deny', this.denyTransaction);
        
	}

    private approveTransaction = async (req: Request, res: Response, next: NextFunction) => {
        let user_id: string = req.params.user_id
        let trans_id: string = req.params.transaction_id
        let device_id: string = req.query.device_id as string
        let signed_conf_code: string = req.query.signed_conf_code as string
        let target_id: string = req.query.target_id as string
        let check = await this.checkSignatureAndTime(target_id, trans_id, device_id, signed_conf_code)
        if(check){
            // save the event
            this.transRepo.approveTransaction(trans_id)
            res.json({result: 'Transaction approved'});
        }else{
            res.json({error: 'Transaction approval failed'})
        }
    };
    private denyTransaction = async (req: Request, res: Response, next: NextFunction) => {
        let user_id: string = req.params.user_id
        let trans_id: string = req.params.transaction_id
        let device_id: string = req.query.device_id as string
        let signed_conf_code: string = req.query.signed_conf_code as string
        let target_id: string = req.query.target_id as string
        let check = await this.checkSignatureAndTime(target_id, trans_id, device_id, signed_conf_code)
        if(check){
            // save the event
            this.transRepo.refuseTransaction(trans_id)
            res.json({result: 'Transaction refused'});
        }else{
            res.json({error: 'Transaction refusal failed'})
        }
    };

    private checkSignatureAndTime = async (user_id: string, transaction_id: string, device_id: string, signed_confirmation_code: string): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            var transaction: Transaction = await this.transRepo.getTransaction(transaction_id)
            var ttl = transaction.ttl
            
            let conf_code = transaction.confirmation_code
            console.log(`user_id: ${user_id} device_id: ${device_id}`)
            let device = await this.deviceRepo.getDevice(device_id, user_id)
            let pub_key = device.public_key
            let dec: Decryptor = new RSADecryptor(pub_key)
            let plain_conf_code = dec.decrypt(signed_confirmation_code)

            if(plain_conf_code == conf_code) {
                return resolve(true)
            }else{
                return resolve(false)
            }
        })
    }
}