import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {inject, injectable} from 'inversify';

import {Service} from '../../services/service';
import {TokenConverter} from '../../services/token-converter/token-converter'

import {DeviceRepository,
		MongoDeviceRepository,
		Device} from 'repositories';

import {container} from '../../ioc_config';
import {TYPES} from 'repositories';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { isThisTypeNode } from 'typescript';

@injectable()
export class DevicesRoute extends Route{
	constructor(
		@inject(TYPES.DeviceRepository) private deviceRepo: DeviceRepository,
		@inject(UUIDGenerator) private uuidGen: UUIDGenerator) {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();
		this.router.get(this.basePath + '/devices', this.getDevices);
		this.router.get(this.basePath + '/device/:device_id', this.getDevice);
		this.router.put(this.basePath + '/device/:device_id', this.updateDevice);
		this.router.patch(this.basePath + '/device/:device_id', this.editDevice);
		this.router.post(this.basePath + '/device', this.addDevice);
		this.router.delete(this.basePath + '/device/:device_id', this.removeDevice);
		// this.router.get(this.basePath + '/logs', this.getUserLogs);
		// this.router.get(this.basePath + '/device/:device_id/logs', this.getDeviceLogs);
	}

	// the methods below should permit to edit/update/delete only the devices of the user specified in the query

	private getDevices = async (req: Request, res: Response, next: NextFunction) => {
		var user_id = req.params.user_id;
		var devs: Device[] = await this.deviceRepo.getDevices(user_id)
		res.json(devs);
	}

	private getDevice = async (req: Request, res: Response, next: NextFunction) => {
		var user_id = req.params.user_id;
		var device_id = req.params.device_id;
		var dev: Device = await this.deviceRepo.getDevice(device_id, user_id)
		res.json(dev);

	};

	private addDevice = async (req: Request, res: Response, next: NextFunction) => {
		var device: Device = req.body;
		var uuid = this.uuidGen.getUUID();
		device._id = uuid;
		await this.deviceRepo.addDevice(device);
		res.json({result: 'Device added successfully'});
	};

	private updateDevice = async (req: Request, res: Response, next: NextFunction) => {
		var device: Device = req.body;
		// it's important to take the next two values from the request params because those values are verified in the preceding middlewares
		var id = req.params._id;
		var user_id = req.params.user_id;
		await this.deviceRepo.editDevice(id, user_id, device);
		res.json({result: 'Updated successfully'});
	};

	// to be fixed so that it accepts a partial device as input
	private editDevice = async (req: Request, res: Response, next: NextFunction) => {
		var device: Device = req.body;
		// it's important to take the next two values from the request params because those values are verified in the preceding middlewares
		var id = req.params._id;
		var user_id = req.params.user_id;
		await this.deviceRepo.editDevice(id, user_id, device);
		res.json({result: 'Edited successfully'});
	};

	private removeDevice = async (req: Request, res: Response, next: NextFunction) => {
		var device_id = req.params.device_id
		var user_id = req.params.user_id;
		await this.deviceRepo.removeDevice(device_id, user_id);
		res.json({result: 'Removed successfully'});
	};

	private getUserLogs = async (req: Request, res: Response, next: NextFunction) => {

	};

	private getDeviceLogs = async (req: Request, res: Response, next: NextFunction) => {
		
	};
}