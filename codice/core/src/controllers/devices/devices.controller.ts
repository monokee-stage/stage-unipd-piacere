import 'reflect-metadata';


import { inject, injectable } from 'inversify';

import {
    DeviceRepository,
    Device,
    EventRepository,
    Event,
    RequestFilter,
    DeviceFields
} from 'repositories';

import { TYPES } from 'repositories';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { CodedError } from '../../coded.error';

@injectable()
export class DevicesController {
    @inject(TYPES.DeviceRepository) private deviceRepo!: DeviceRepository
    @inject(TYPES.EventRepository) private eventRepo!: EventRepository

    // the methods below should permit to edit/update/delete only the devices of the user specified in the query

    public getDevices(user_id: string, filter?: RequestFilter): Promise<Device[]> {
        return new Promise<Device[]>(async (resolve, reject) => {
            try {
                var devs: Device[] = await this.deviceRepo.getDevices(user_id, filter)
                return resolve(devs)
            } catch (err) {
                return resolve(err)
            }
        })
    }

    public getDevice(user_id: string, device_id: string): Promise<Device | undefined> {
        return new Promise<Device | undefined>(async (resolve, reject) => {
            try {
                var dev: Device | undefined = await this.deviceRepo.getDevice(device_id, user_id)
                return resolve(dev)
            } catch (err) {
                return reject(err)
            }
        })
        
    }

    public addDevice(user_id: string, device: Device): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                // should check if the device is well formed
                var dUuid = UUIDGenerator.getUUID();
                device._id = dUuid;
                device.user_id = user_id

                let eUuid = UUIDGenerator.getUUID()
                let event = {
                    _id: eUuid,
                    user_id: user_id,
                    device_id: dUuid,
                    type: 'device addition',
                    timestamp: new Date() as unknown as string,
                }
                let results = await Promise.all([this.deviceRepo.addDevice(device), this.eventRepo.addEvent(event)])

                return resolve(dUuid)
            } catch (err) {
                return reject(err)
            }
        })
    }

    public updateDevice(user_id: string, device_id: string, device: Device): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                // check that the passed value is actually a device
                if (!device) {
                    return reject(new CodedError('No data received', 401))
                }
                if (Object.keys(device).length !== Object.keys(DeviceFields).length) {
                    return reject(new CodedError('Number of fields not correct', 401))
                }
                for (const field in device) {
                    if (!Object.keys(DeviceFields).includes(field)) {
                        return reject(new CodedError('Fields not correct', 401))
                    }
                }
                // it's important to take the next two values from the request params, and not from the device object found in the body, because those two values are verified in the preceding middlewares
                device.user_id = user_id
                device._id = device_id
                let result = await this.deviceRepo.editDevice(device_id, user_id, device);
                if (result === 0) {
                    return reject({ result: 'Device not found' })
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
                if (Object.keys(device).length > Object.keys(DeviceFields).length) {
                    return reject(new CodedError('Number of fields not correct', 401))
                }
                for (const field in device) {
                    if (!Object.keys(DeviceFields).includes(field)) {
                        return reject(new CodedError('Fields not correct', 401))
                    }
                }
                // it's important to take the next two values from the request params because those values are verified in the preceding middlewares

                if (device._id !== undefined) device._id = device_id
                if (device.user_id !== undefined) device.user_id = user_id
                let result = await this.deviceRepo.editDevice(device_id, user_id, device);
                if (result === 0) {
                    return reject(new CodedError('Device not found', 401))
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
                let eUuid = UUIDGenerator.getUUID()
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
                return resolve()
            } catch (err) {
                return reject(err)
            }
        })
    }

    public getUserLogs(user_id: string, filter?: RequestFilter): Promise<Event[]> {
        return new Promise<Event[]>(async (resolve, reject) => {
            try {
                var events: Event[] = await this.eventRepo.getUserEvents(user_id, filter)
                return resolve(events)
            } catch (err) {
                return reject(err)
            }
        })
    }

    public getDeviceLogs(user_id: string, device_id: string, filter?: RequestFilter): Promise<Event[]> {
        return new Promise<Event[]>(async (resolve, reject) => {
            try {
                var events: Event[] = await this.eventRepo.getDeviceEvents(device_id, user_id, filter)
                return resolve(events)
            } catch (err) {
                return reject(err)
            }
        })
    }
}