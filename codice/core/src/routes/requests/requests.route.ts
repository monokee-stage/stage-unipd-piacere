import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';

import {
	Transaction,
	TransactionRepository
} from 'repositories';

import {TYPES} from 'repositories';

import {injectable, inject} from 'inversify';
import { RedisTransactionRepository } from 'repositories';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { RandomCodeGenerator } from '../../services/random-code-generator/random-code-generator';
import { Hasher } from '../../services/hasher/hasher';
import { Notifier } from '../../services/notifier/notifier';
import { NotificationData } from '../../services/notifier/notification.data';

@injectable()
export class RequestsRoute extends Route {
	constructor(
		@inject(TYPES.TransactionRepository) private transactionRepo: TransactionRepository,
		@inject(UUIDGenerator) private uuidGen: UUIDGenerator,
		@inject(RandomCodeGenerator) private rcGen: RandomCodeGenerator,
		@inject(Hasher) private hasher: Hasher,
		@inject(Notifier) private notifier: Notifier) {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();

		this.router.post(this.basePath + '/target/:target_id', this.requestConfirmation);
		this.router.get(this.basePath + '/operation/:operation_id', this.getStatus);
	}

	/*export class Transaction {
    _id!: string
    user_id!: string
    requester_id!: string
    request_timestamp!: string
    confirmation_code!: string
    status!: string
    ttl!: number
    coordinates?: {
        lat: number
        long: number
    }
    location?: string
    extra_info?: any
}*/
	private requestConfirmation = async (req: Request, res: Response, next: NextFunction) => {
		
		var confCode = this.rcGen.getCode()
		var trans: Transaction = {
			_id: this.uuidGen.getUUID(),
			user_id: req.params.target_id,
			requester_id: req.params.user_id,
			request_timestamp: new Date() as unknown as string,
			confirmation_code: this.hasher.hashText(confCode),
			status: 'pending',
			ttl: 30
		}

		await this.transactionRepo.addTransaction(trans)

		

		var reg_tok = 'fa-ZSy1DLrRGkOnxmbE2Cp:APA91bEF5SEenwjbVZuJqnOLiOx3Mbcii9wzWpRzSKqxcmLgDeZQtLEPS7PVSo3SztMv0G3rNaCMNsBDHZBkVF8NCFVmqHCUmnq0o9JZS-wUKJs8Is3zSuNdZmYqbEuDgfuJaeuVVvfD'
	
		// still have to deal with the case in which some fields are missing
		var notifData: NotificationData = {
			transaction_id: trans._id,
			confirmation_code: confCode,
			location: 'via rossi',
			lat: '14',
			long: '15'
		}
		await this.notifier.sendNotification([reg_tok], notifData)

		res.json({
			result: 'request sent successfully',
			transaction_id: trans._id	
		})
	};

	private getStatus = async (req: Request, res: Response, next: NextFunction) => {
		var trans_id: string = req.params.operation_id;
		var repo = new RedisTransactionRepository();
		var trans: Transaction = await repo.getTransaction(trans_id)
		res.json(trans);

	};
}