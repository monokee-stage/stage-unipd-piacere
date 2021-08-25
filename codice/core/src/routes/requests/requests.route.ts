import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';


import {injectable, inject} from 'inversify';
import { RequestsController } from '../../controllers/requests/request.controller';
import { CodedError } from '../../coded.error';

@injectable()
export class RequestsRoute extends Route {
	constructor(
		@inject(RequestsController) private requestController: RequestsController) {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();

		this.router.post(this.basePath + '/target/:target_id', this.requestConfirmation);
		this.router.get(this.basePath + '/operation/:operation_id', this.getStatus);
	}

	private requestConfirmation = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const requester_id: string = req.params.user_id
			if (!requester_id) {
				return next(new CodedError('User id not provided', 400))
			}
			const target_id: string = req.params.target_id
			if (!target_id) {
				return next(new CodedError('Target id not provided', 400))
			}
			const data: any = req.body

			const trans_id: string = await this.requestController.requestConfirmation(requester_id, target_id, data)
			return res.status(200).json({transaction_id: trans_id})
		} catch(err) {
			return next(err)
		}
	};

	private getStatus = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user_id: string = req.params.user_id;
			if (!user_id) {
				return next(new CodedError('User id not provided', 400))
			}
			const trans_id: string = req.params.operation_id;
			if (!trans_id) {
				return next(new CodedError('Transaction id not provided', 400))
			}

			const status: string = await this.requestController.getStatus(user_id, trans_id)
			return res.status(200).json({ status: status });
		} catch(err) {
			return next(err)
		}
	};
}