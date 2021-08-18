import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';

import {injectable, inject} from 'inversify';
import { ConfirmationController } from '../../controllers/confirmations/confirmations.controller';

@injectable()
export class ConfirmationRoute extends Route {
	constructor(
        @inject(ConfirmationController) private confirmationController: ConfirmationController) {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();
		this.router.get(this.basePath + '/transaction/:transaction_id/approve', this.approveTransaction);
        this.router.get(this.basePath + '/transaction/:transaction_id/deny', this.denyTransaction);
	}

    private approveTransaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user_id: string = req.params.user_id
            let trans_id: string = req.params.transaction_id
            let device_id: string = req.query.device_id as string
            let signed_conf_code: string = req.query.signed_conf_code as string
            await this.confirmationController.approveTransaction(user_id, trans_id, device_id, signed_conf_code)
            res.json({result: 'Transaction approved'});
        } catch(err) {
            return next(err)
        }
    };
    private denyTransaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user_id: string = req.params.user_id
            let trans_id: string = req.params.transaction_id
            let device_id: string = req.query.device_id as string
            let signed_conf_code: string = req.query.signed_conf_code as string
            await this.confirmationController.denyTransaction(user_id, trans_id, device_id, signed_conf_code)
            res.json({ result: 'Transaction refused' });
        } catch (err) {
            return next(err)
        }
    };
}