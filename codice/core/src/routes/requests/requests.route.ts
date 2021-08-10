import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';

import {TransactionModel} from 'repositories';

import {injectable, inject} from 'inversify';
import { RedisTransactionRepository } from 'repositories';

@injectable()
export class RequestsRoute extends Route {
	constructor() {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();

		this.router.post(this.basePath + '/target/:target_id', this.requestConfirmation);
		this.router.get(this.basePath + '/operation/:operation_id', this.getStatus);
	}

	private requestConfirmation = (req: Request, res: Response, next: NextFunction) => {};
	private getStatus = (req: Request, res: Response, next: NextFunction) => {
		var trans_id: string = req.params.operation_id;
		var repo = new RedisTransactionRepository();
		repo.getTransaction(trans_id).then((result: TransactionModel) => {
			res.send(result);
		})

	};
}