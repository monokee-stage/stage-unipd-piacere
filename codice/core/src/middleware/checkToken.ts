
import {Router, Request, Response, NextFunction} from 'express';
import {Service} from '../services/service';
import {TokenConverter} from '../services/token-converter/token-converter'

import {container} from '../ioc_config';

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
	var claimed_user_id = req.params.user_id;
	var token = req.headers.authorization;
	console.log(`checkToken: ${claimed_user_id} ${token}`);
	res.locals.claimed_user_id = claimed_user_id;
	res.locals.token = token;

	var tokenValidationService = container.get<Service>(TokenConverter);
	next();
};