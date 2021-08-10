import { Repository } from "../../repository";
import { Device } from "../model/device.model";

export interface DeviceRepository extends Repository{
    getDevice(device_id: string): Promise<Device>;
    getDevices(user_id: string): Device[];
    addDevice(device: Device): void;
    removeDevice(device_id: string): void;
}