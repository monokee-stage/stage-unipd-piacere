import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {Transaction, RedisTransactionRepository} from 'repositories';

import {injectable, inject} from 'inversify';

@injectable()
export class ConfirmationRoute extends Route {
	constructor() {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();
		this.router.get(this.basePath + '/transaction/:transaction_id/approve', this.approveTransaction);
        this.router.get(this.basePath + '/transaction/:transaction_id/deny', this.denyTransaction);
        
	}

    private approveTransaction = (req: Request, res: Response, next: NextFunction) => {
        var id: string = req.params.transaction_id;
        var repo = new RedisTransactionRepository();
        repo.approveTransaction(id);
        res.send("approved");
    };
    private denyTransaction = (req: Request, res: Response, next: NextFunction) => {
        var id: string = req.params.transaction_id;
        var repo = new RedisTransactionRepository();
        repo.refuseTransaction(id);
        res.send("denyied");
    };
}