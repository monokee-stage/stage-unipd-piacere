import { injectable } from "inversify";
import { MongoClient } from "mongodb";
import { Device } from "../model/device";
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

    public getDevice(device_id: string, user_id: string): Promise<Device> {
        return new Promise<Device> (async (resolve, reject) => {
            var dev: Device = await this.devices.findOne( {_id: device_id, user_id: user_id});
            return resolve(dev);
        })
    }
    public getDevices(user_id: string): Promise<Device[]> {
        return new Promise<Device[]> (async (resolve, reject) => {
            var devs: Device[] = await this.devices.find( {user_id: user_id}).toArray();
            return resolve(devs);
        })
    }
    public addDevice(device: Device): Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            await this.devices.insertOne(device)
            return resolve()
        })
    }
    public editDevice(device_id: string, user_id: string, device: Device): Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            var result = await this.devices.updateOne({_id: device_id}, {$set: device})
            console.log(result)
            return resolve()
        })
    }
    public removeDevice(device_id: string, user_id: string): Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            await this.devices.deleteOne({_id: device_id, user_id: user_id})
            return resolve()
        })
    }
    
}