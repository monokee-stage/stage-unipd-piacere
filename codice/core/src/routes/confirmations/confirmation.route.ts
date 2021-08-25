import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';

import {injectable, inject} from 'inversify';
import { ConfirmationController } from '../../controllers/confirmations/confirmations.controller';
import { CodedError } from '../../coded.error';

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
            const user_id: string = req.params.user_id
            if(!user_id) {
                return next(new CodedError('User id not provided', 400))
            }
            const trans_id: string = req.params.transaction_id
            if (!trans_id) {
                return next(new CodedError('Transaction id not provided', 400))
            }
            const device_id: string = req.query.device_id as string
            if (!device_id) {
                return next(new CodedError('Device id not provided', 400))
            }
            const signed_conf_code: string = req.query.signed_conf_code as string
            if (!signed_conf_code) {
                return next(new CodedError('Signed confirmation code not provided', 400))
            }

            await this.confirmationController.approveTransaction(user_id, trans_id, device_id, signed_conf_code)
            res.status(200).json({result: 'Transaction approved'});
        } catch(err) {
            return next(err)
        }
    };
    private denyTransaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id: string = req.params.user_id
            if (!user_id) {
                return next(new CodedError('User id not provided', 400))
            }
            const trans_id: string = req.params.transaction_id
            if (!trans_id) {
                return next(new CodedError('Transaction id not provided', 400))
            }
            const device_id: string = req.query.device_id as string
            if (!device_id) {
                return next(new CodedError('Device id not provided', 400))
            }
            const signed_conf_code: string = req.query.signed_conf_code as string
            if (!signed_conf_code) {
                return next(new CodedError('Signed confirmation code not provided', 400))
            }
            await this.confirmationController.denyTransaction(user_id, trans_id, device_id, signed_conf_code)
            res.status(200).json({ result: 'Transaction refused' });
        } catch (err) {
            return next(err)
        }
    };
}