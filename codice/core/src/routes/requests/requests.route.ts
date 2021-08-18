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
		this.basePath = '/user/:user_id';
		this.router = Router();

		this.router.post(this.basePath + '/target/:target_id', this.requestConfirmation);
		this.router.get(this.basePath + '/operation/:operation_id', this.getStatus);
	}

	// maybe it'd be better to send a response to the requester before the end of the operations
	private requestConfirmation = async (req: Request, res: Response, next: NextFunction) => {
		try {
			var requester_id = req.params.user_id
			let target_id = req.params.target_id
			let data = req.body

			let trans_id = await this.requestController.requestConfirmation(requester_id, target_id, data)
			return res.json({transaction_id: trans_id})
		} catch(err) {
			return next(err)
		}
	};

	private getStatus = async (req: Request, res: Response, next: NextFunction) => {
		try {
			let user_id: string = req.params.user_id;
			let trans_id: string = req.params.operation_id;
			let status = await this.requestController.getStatus(user_id, trans_id)
			return res.json({ status: status });
		} catch(err) {
			return next(err)
		}
	};
}