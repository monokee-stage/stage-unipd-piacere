import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {inject, injectable} from 'inversify';

import {Service} from '../../services/service';
import {TokenConverter} from '../../services/token-converter/token-converter'

import {MongoDeviceRepository} from 'repositories';

import {container} from '../../ioc_config';

@injectable()
export class DevicesRoute extends Route{
	constructor() {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();
		this.router.get(this.basePath + '/devices', this.getDevices);
		this.router.get(this.basePath + '/device/:device_id', this.getDevice);
		this.router.put(this.basePath + '/device/:device_id', this.addDevice);
		this.router.post(this.basePath + '/device/:device_id', this.editDevice);
		this.router.delete(this.basePath + '/device/:device_id', this.removeDevice);
	}

	private getDevices = (req: Request, res: Response, next: NextFunction) => {
		
		var user_id = req.params.user_id;
		res.send(`you (${user_id}) want the devices`);
		console.log(res.locals);
	}

	private getDevice = (req: Request, res: Response, next: NextFunction) => {
		var device_id = req.params.device_id;
		var repo = new MongoDeviceRepository();
		repo.getDevice(device_id).then((result) => {
			res.send(result);
		})

	};

	private addDevice = (req: Request, res: Response, next: NextFunction) => {};
	private editDevice = (req: Request, res: Response, next: NextFunction) => {};
	private removeDevice = (req: Request, res: Response, next: NextFunction) => {};
}