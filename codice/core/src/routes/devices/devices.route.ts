import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {inject, injectable} from 'inversify';

import {DeviceRepository,
		Device,
		EventRepository,
		Event} from 'repositories';

import {container} from '../../ioc_config';
import {TYPES} from 'repositories';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { requestToFilter } from '../../utils/request-to-filter';

@injectable()
export class DevicesRoute extends Route{
	constructor(
		@inject(TYPES.DeviceRepository) private deviceRepo: DeviceRepository,
		@inject(TYPES.EventRepository) private eventRepo: EventRepository,
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
		this.router.get(this.basePath + '/logs', this.getUserLogs);
		this.router.get(this.basePath + '/device/:device_id/logs', this.getDeviceLogs);
	}

	// the methods below should permit to edit/update/delete only the devices of the user specified in the query

	private getDevices = async (req: Request, res: Response, next: NextFunction) => {
		var user_id = req.params.user_id;
		let filter = requestToFilter(req)
		var devs: Device[] = await this.deviceRepo.getDevices(user_id, filter)
		res.json(devs);
	}

	private getDevice = async (req: Request, res: Response, next: NextFunction) => {
		var user_id = req.params.user_id;
		var device_id = req.params.device_id;
		var dev: Device = await this.deviceRepo.getDevice(device_id, user_id)
		res.json(dev);

	};

	private addDevice = async (req: Request, res: Response, next: NextFunction) => {
		let user_id: string = req.params.user_id
		var device: Device = req.body;
		var dUuid = this.uuidGen.getUUID();
		device._id = dUuid;
		device.user_id = user_id

		let eUuid = this.uuidGen.getUUID()
		let event = {
			_id: eUuid,
			user_id: user_id,
			device_id: dUuid,
			type: 'device addition',
			timestamp: new Date() as unknown as string,
		}
		await Promise.all([await this.deviceRepo.addDevice(device), this.eventRepo.addEvent(event)])
		
		res.json({result: 'Device added successfully'});
	};

	private updateDevice = async (req: Request, res: Response, next: NextFunction) => {
		var device: Device = req.body;
		// it's important to take the next two values from the request params, and not from the device object found in the body, because those two values are verified in the preceding middlewares
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

		let eUuid = this.uuidGen.getUUID()
		let event = {
			_id: eUuid,
			user_id: user_id,
			device_id: device_id,
			type: 'device removal',
			timestamp: new Date() as unknown as string,
		}
		
		// the device is not removed from the database, it's just archived
		await Promise.all([await this.deviceRepo.archiveDevice(device_id, user_id), this.eventRepo.addEvent(event)])

		// maybe I should check if the device to be deleted was actually present. For example by reading the result of the call archiveDevice
		res.json({result: 'Removed successfully'});
	};

	private getUserLogs = async (req: Request, res: Response, next: NextFunction) => {
		var user_id = req.params.user_id
		let filter = requestToFilter(req)
		var events: Event[] = await this.eventRepo.getUserEvents(user_id, filter)
		res.json(events)
	};

	private getDeviceLogs = async (req: Request, res: Response, next: NextFunction) => {
		var user_id = req.params.user_id
		var device_id = req.params.device_id
		let filter = requestToFilter(req)
		var events: Event[] = await this.eventRepo.getDeviceEvents(device_id, user_id, filter)
		res.json(events)
	};
}