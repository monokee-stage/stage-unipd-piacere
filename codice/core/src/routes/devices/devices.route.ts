import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {inject, injectable} from 'inversify';

import {DeviceRepository,
		Device,
		EventRepository,
		Event} from 'repositories';


import { requestToFilter } from '../../utils/request-to-filter';
import { DevicesController } from '../../controllers/devices/devices.controller';

@injectable()
export class DevicesRoute extends Route{
	constructor(
		@inject(DevicesController) private deviceController: DevicesController) {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();
		this.router.get(this.basePath + '/devices', this.getDevices);
		this.router.get(this.basePath + '/device/:device_id', this.getDevice);
		this.router.put(this.basePath + '/device/:device_id', this.updateDevice);
		this.router.patch(this.basePath + '/device/:device_id', this.editDevice);
		this.router.post(this.basePath + '/device', this.addDevice);
		this.router.delete(this.basePath + '/device/:device_id', this.removeDevice);
		this.router.get(this.basePath + '/logs', this.getUserLogs);
		this.router.get(this.basePath + '/device/:device_id/logs', this.getDeviceLogs);
	}

	// the methods below should permit to edit/update/delete only the devices of the user specified in the query

	private getDevices = async (req: Request, res: Response, next: NextFunction) => {
		try {
			var user_id = req.params.user_id;
			let filter = requestToFilter(req)
			var devs: Device[] = await this.deviceController.getDevices(user_id, filter)
			res.json(devs);
		} catch(err) {
			return next(err)
		}
	}

	private getDevice = async (req: Request, res: Response, next: NextFunction) => {
		try {
			var user_id = req.params.user_id;
			var device_id = req.params.device_id;
			var dev: Device = await this.deviceController.getDevice(user_id, device_id)
			res.json(dev);
		} catch(err) {
			return next(err)
		}
	};

	private addDevice = async (req: Request, res: Response, next: NextFunction) => {
		try {
			let user_id: string = req.params.user_id
			var device: Device = req.body;
			let device_id = await this.deviceController.addDevice(user_id, device)
			res.json({
				result: 'Device added successfully',
				device_id: device_id
			});
		} catch(err) {
			return next(err)
		}
	};

	private updateDevice = async (req: Request, res: Response, next: NextFunction) => {
		try {
			var device: Device = req.body;
			var device_id = req.params.device_id;
			var user_id = req.params.user_id;
			
			device.user_id = user_id
			device._id = device_id
			let result = await this.deviceController.editDevice(user_id, device_id, device);
			return res.json({ result: 'Edited successfully' })
		} catch(err) {
			return next(err)
		}
	};

	private editDevice = async (req: Request, res: Response, next: NextFunction) => {
		try {
			var device: Partial<Device> = req.body;
			var device_id = req.params.device_id;
			var user_id = req.params.user_id;

			let result = await this.deviceController.editDevice(user_id, device_id, device);
			return res.json({ result: 'Edited successfully' });
		} catch(err) {
			return next(err)
		}
	};

	private removeDevice = async (req: Request, res: Response, next: NextFunction) => {
		try {
			var device_id = req.params.device_id
			var user_id = req.params.user_id;

			let result = await this.deviceController.removeDevice(user_id, device_id)
			res.json({ result: 'Removed successfully' });
		} catch(err) {
			return next(err)
		}
	};

	private getUserLogs = async (req: Request, res: Response, next: NextFunction) => {
		try {
			var user_id = req.params.user_id
			let filter = requestToFilter(req)
			var events: Event[] = await this.deviceController.getUserLogs(user_id, filter)
			res.json(events)
		} catch(err) {
			return next(err)
		}
	};

	private getDeviceLogs = async (req: Request, res: Response, next: NextFunction) => {
		try {
			var user_id = req.params.user_id
			var device_id = req.params.device_id
			let filter = requestToFilter(req)
			var events: Event[] = await this.deviceController.getDeviceLogs(user_id, device_id, filter)
			res.json(events)
		} catch(err) {
			return next(err)
		}
	};
}