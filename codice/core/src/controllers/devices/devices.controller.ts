import 'reflect-metadata';


import { inject, injectable } from 'inversify';

import {
    DeviceRepository,
    Device,
    EventRepository,
    Event,
    RequestFilter,
    DeviceFields,
    BaseRequestFilter,
    TypedRequestFilter
} from 'repositories';

import { TYPES } from 'repositories';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { CodedError } from '../../coded.error';
import { container } from '../../ioc_config';

@injectable()
export class DevicesController {
    @inject(TYPES.DeviceRepository) private deviceRepo!: DeviceRepository
    @inject(TYPES.EventRepository) private eventRepo!: EventRepository

    constructor() {
    }

    // the methods below should permit to edit/update/delete only the devices of the user specified in the api query

    public getDevices(user_id: string, filter?: BaseRequestFilter): Promise<Device[]> {
        return new Promise<Device[]>(async (resolve, reject) => {
            try {
                let devs: Device[] = await this.deviceRepo.getDevices(user_id, filter)
                return resolve(devs)
            } catch (err) {
                return reject(err)
            }
        })
    }

    public getDevice(user_id: string, device_id: string): Promise<Device | undefined> {
        return new Promise<Device | undefined>(async (resolve, reject) => {
            try {
                let dev: Device | undefined = await this.deviceRepo.getDevice(device_id, user_id)
                return resolve(dev)
            } catch (err) {
                return reject(err)
            }
        })
        
    }

    public addDevice(user_id: string, device: Device): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                if (!device || !Device.validateDevice(device)){
                    return reject(new CodedError('Device format not valid', 400))
                }
                if(device.user_id !== user_id) {
                    return reject(new CodedError('User ids in device and url don\'t correspond', 400))
                }
                const dUuid: string = UUIDGenerator.getUUID();
                device._id = dUuid;
                device.user_id = user_id

                const eUuid: string = UUIDGenerator.getUUID()
                const event: Event = {
                    _id: eUuid,
                    user_id: user_id,
                    device_id: dUuid,
                    type: 'device addition',
                    timestamp: new Date() as unknown as string,
                }

                await this.deviceRepo.addDevice(device)
                await this.eventRepo.addEvent(event)

                return resolve(dUuid)
            } catch (err) {
                return reject(err)
            }
        })
    }

    public updateDevice(user_id: string, device_id: string, device: Device): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (!device) {
                    return reject(new CodedError('No data received', 401))
                }
                if (!Device.validateDevice(device)) {
                    return reject(new CodedError('Device format not correct', 400))
                }
                if(device._id !== device_id || device.user_id !== user_id) {
                    return reject(new CodedError('User ids or device ids in device and url don\'t correspond', 400))
                }
                // it's important to take the next two values from the request params, and not from the device object found in the body, because those two values are verified in the preceding middlewares
                device.user_id = user_id
                device._id = device_id
                const result: boolean = await this.deviceRepo.editDevice(device_id, user_id, device);
                if (!result) {
                    return reject(new CodedError('Device not found', 404))
                } else {
                    return resolve();
                }
            } catch (err) {
                return reject(err)
            }
        })
    }

    public editDevice(user_id: string, device_id: string, device: Partial<Device>): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (!device) {
                    return reject(new CodedError('No data received', 401))
                }
                if (!Device.validatePartialDevice(device)) {
                    return reject(new CodedError('Device format not correct', 400))
                }
                if ((device._id !== undefined && device._id !== device_id)
                    || (device.user_id !== undefined && device.user_id !== user_id)) {
                    return reject(new CodedError('User ids or device ids in device and url don\'t correspond', 400))
                }
                // it's important to take the next two values from the request params because those values are verified in the preceding middlewares

                if (device._id !== undefined) device._id = device_id
                if (device.user_id !== undefined) device.user_id = user_id
                const result: boolean = await this.deviceRepo.editDevice(device_id, user_id, device);
                if (!result) {
                    return reject(new CodedError('Device not found', 404))
                } else {
                    return resolve();
                }
            } catch (err) {
                return reject(err)
            }
        })   
    }

    public removeDevice(user_id: string, device_id: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const eUuid: string = UUIDGenerator.getUUID()
                const event: Event = {
                    _id: eUuid,
                    user_id: user_id,
                    device_id: device_id,
                    type: 'device removal',
                    timestamp: new Date() as unknown as string,
                }

                // the device is not removed from the database, it's just archived
                const result = await this.deviceRepo.archiveDevice(device_id, user_id)
                if(result){
                    // if the device was archived
                    await this.eventRepo.addEvent(event)

                    return resolve()
                }else{
                    return reject(new CodedError('Device not found', 404))
                }
            } catch (err) {
                return reject(err)
            }
        })
    }

    public getUserLogs(user_id: string, filter?: TypedRequestFilter): Promise<Event[]> {
        return new Promise<Event[]>(async (resolve, reject) => {
            try {
                let events: Event[] = await this.eventRepo.getUserEvents(user_id, filter)
                return resolve(events)
            } catch (err) {
                return reject(err)
            }
        })
    }

    public getDeviceLogs(user_id: string, device_id: string, filter?: TypedRequestFilter): Promise<Event[]> {
        return new Promise<Event[]>(async (resolve, reject) => {
            try {
                let events: Event[] = await this.eventRepo.getDeviceEvents(device_id, user_id, filter)
                return resolve(events)
            } catch (err) {
                return reject(err)
            }
        })
    }
}