import { injectable } from "inversify";
import { DeleteResult, FindCursor, MongoClient, MongoClientOptions, UpdateResult, Document } from "mongodb";
import { BaseRequestFilter } from "../../RequestFilter";
import { applyQueryAndFilter } from "../../utils/applyQueryAndFilter";
import { controlledMongoFindOne } from "../../utils/controlledMongoFindOne";
import { controlledMongoUpdateOne } from "../../utils/controlledMongoUpdateOne";
import { Device, DeviceFields } from "../model/device";
import { DeviceRepository } from "./device.repository";
/*
import dotenv from 'dotenv';
dotenv.config();*/

@injectable()
export class MongoDeviceRepository implements DeviceRepository {
    client!: MongoClient;
    database: any;
    devices: any; 
    
    constructor(_uri?: string, _options?: MongoClientOptions) {
            const uri: string = _uri || process.env.MAIN_MONGODB_URI || ''
            const options: MongoClientOptions = _options || JSON.parse(process.env.MAIN_MONGODB_OPTIONS || '{}') || undefined
            this.client = new MongoClient(uri, options);
            this.client.connect( (err, client) => {
                if (err) {
                    console.log('Unable to connect to devices database')
                } else {
                    console.log('Devices connection succeded')
                }
            });

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
    public getDevices(user_id: string, filter?: BaseRequestFilter, showArchived: boolean = false): Promise<Device[]> {
        return new Promise<Device[]> (async (resolve, reject) => {
            try {
                console.log('repo getDevices received filter')
                console.log(filter)
                if(!filter) {
                    filter = new BaseRequestFilter()
                }
                if ((filter.getFields().includes('archived') && filter.getFieldsInclusion() === true) 
                    || (!filter.getFields().includes('archived') && filter.getFieldsInclusion() === false)) {
                    console.log('before')
                    console.log(filter)
                    filter.setFieldProjection('archived', false)
                    if(filter.getFields().length === 0) {
                        filter.setFieldProjection('archived', false)
                    }
                    console.log('after')
                    console.log(filter)
                }
                

                let query: any = { user_id: user_id }
                if (!showArchived) {
                    query.archived = { $in: [false, null] }
                }

                let cursor: FindCursor<Device> = applyQueryAndFilter<Device>(this.devices, query, filter)
                let devs: Device[] = await cursor.toArray();
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
    // returns whether the number of edited devices is > 0
    public editDevice(device_id: string, user_id: string, device: Partial<Device>): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            try {
                const result: Document|UpdateResult = await controlledMongoUpdateOne(this.devices, { _id: device_id, user_id: user_id }, { $set: device })
                return resolve(result.matchedCount === 1)
            } catch(err) {
                return reject(err)
            }
        })
    }
    /*
    public removeDevice(device_id: string, user_id: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            try {
                const result: DeleteResult = await this.devices.deleteOne({ _id: device_id, user_id: user_id })
                return resolve(result.deletedCount > 0)
            } catch(err) {
                return reject(err)
            }
        })
    }*/

    public archiveDevice(device_id: string, user_id: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            try {
                // const result: UpdateResult = await this.devices.updateOne({ _id: device_id, user_id: user_id }, { $set: { archived: true } })
                const result = await controlledMongoUpdateOne(this.devices, {_id: device_id, user_id: user_id }, { $set: { archived: true } })
                return resolve(result.modifiedCount === 1)
            } catch(err) {
                return reject(err)
            }
        })
    }
    
}