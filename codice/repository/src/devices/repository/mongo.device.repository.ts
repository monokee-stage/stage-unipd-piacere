import { MongoClient } from "mongodb";
import { Device } from "../model/device.model";
import { DeviceRepository } from "./device.repository";
/*
import dotenv from 'dotenv';
dotenv.config();*/

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

    public getDevice(_device_id: string): Promise<Device> {
        return new Promise<Device> (async (resolve, reject) => {
            this.devices.findOne( {device_id: _device_id}).then((dev: any)=> {
                console.log(dev);
                return resolve(new Device('not implemented'));
            })
        })
    }
    public getDevices(user_id: string): Device[] {
        throw new Error("Method not implemented.");
    }
    public addDevice(device: Device): void {
        throw new Error("Method not implemented.");
    }
    public editDevice(): void {
        throw new Error("Method not implemented.");
    }
    public removeDevice(device_id: string): void {
        throw new Error("Method not implemented.");
    }
    
}