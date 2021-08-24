import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';


import {injectable, inject} from 'inversify';
import { RequestsController } from '../../controllers/requests/request.controller';

@injectable()
export class RequestsRoute extends Route {
	constructor(
		@inject(RequestsController) private requestController: RequestsController) {
		super();
		try {
			this.basePath = '/user/:user_id';
			this.router = Router();

			this.router.post(this.basePath + '/target/:target_id', this.requestConfirmation);
			this.router.get(this.basePath + '/operation/:operation_id', this.getStatus);
		} catch(err) {
			throw err
		}
	}

	private requestConfirmation = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const requester_id: string = req.params.user_id
			const target_id: string = req.params.target_id
			const data: any = req.body

			const trans_id: string = await this.requestController.requestConfirmation(requester_id, target_id, data)
			return res.json({transaction_id: trans_id})
		} catch(err) {
			return next(err)
		}
	};

	private getStatus = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user_id: string = req.params.user_id;
			const trans_id: string = req.params.operation_id;
			const status: string = await this.requestController.getStatus(user_id, trans_id)
			return res.json({ status: status });
		} catch(err) {
			return next(err)
		}
	};
}