import { injectable } from "inversify";
import { MongoClient } from "mongodb";
import { RequestFilter } from "../../filter";
import { applyQueryAndFilter } from "../../utils/applyQueryAndFilter";
import { controlledMongoFindOne } from "../../utils/controlledMongoFindOne";
import { Device, DeviceFields } from "../model/device";
import { DeviceRepository } from "./device.repository";
/*
import dotenv from 'dotenv';
dotenv.config();*/

@injectable()
export class MongoDeviceRepository implements DeviceRepository {
    client: MongoClient;
    database: any;
    devices: any; 
    

    constructor() {
        var uri = process.env.MAIN_MONGODB_URI || '';
        this.client = new MongoClient(uri);
        this.client.connect();

        this.database = this.client.db('mfa');
        this.devices = this.database.collection('devices');
    }

    public getDevice(device_id: string, user_id: string, showArchived: boolean = false): Promise<Device | undefined> {
        return new Promise<Device | undefined> (async (resolve, reject) => {
            try {
                let query: any = { _id: device_id, user_id: user_id }
                if (!showArchived) {
                    query.archived = { $in: [false, null] }
                }
                let dev: Device | undefined = await controlledMongoFindOne<Device>(this.devices, query, { projection: { archived: 0 } })
                return resolve(dev);
            } catch(err) {
                return reject(err)
            }
        })
    }
    public getDevices(user_id: string, filter?: RequestFilter, showArchived: boolean = false): Promise<Device[]> {
        return new Promise<Device[]> (async (resolve, reject) => {
            try {
                console.log('repo getDevices received filter')
                console.log(filter)
                // if filter fields not specified specify all except archived
                if (!filter) {
                    filter = new RequestFilter()
                }
                if (!filter.fields) {
                    filter.fields = []
                }

                // remove archived from the filters, in case the client inserted it 
                filter.fields = filter.fields.filter((i) => {
                    return i !== 'archived'
                })

                if (filter.fields.length === 0) {
                    // select all fields except archived (which is not a field of Device)
                    for (const field in DeviceFields) {
                        if (!filter?.fields?.includes(field)) {
                            filter?.fields?.push(field)
                        }
                    }
                }

                // console.log('filter.fields')
                // console.log(filter.fields)
                let query: any = { user_id: user_id }
                if (!showArchived) {
                    query.archived = { $in: [false, null] }
                }

                var devs: Device[] = await applyQueryAndFilter(this.devices, query, filter).toArray();
                return resolve(devs);
            } catch(err) {
                return reject(err)
            }
        })
    }
    public addDevice(device: Device): Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            try {
                let with_archived: any = device
                with_archived.archived = false
                await this.devices.insertOne(with_archived)
                return resolve()
            } catch(err) {
                return reject(err)
            }
        })
    }
    // returns the number of matched devices
    public editDevice(device_id: string, user_id: string, device: Partial<Device>): Promise<number> {
        return new Promise<number> (async (resolve, reject) => {
            try {
                var result = await this.devices.updateOne({ _id: device_id }, { $set: device })
                return resolve(result.matchedCount)
            } catch(err) {
                return reject(err)
            }
        })
    }
    
    public removeDevice(device_id: string, user_id: string): Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            try {
                await this.devices.deleteOne({ _id: device_id, user_id: user_id })
                return resolve()
            } catch(err) {
                return reject(err)
            }
        })
    }
    public archiveDevice(device_id: string, user_id: string): Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            try {
                await this.devices.updateOne({ _id: device_id, user_id: user_id }, { $set: { archived: true } })
                return resolve()
            } catch(err) {
                return reject(err)
            }
        })
    }
    
}