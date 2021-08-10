import { Repository } from "../../repository";
import { Device } from "../model/device";

export interface DeviceRepository extends Repository{
    getDevice(device_id: string, user_id: string): Promise<Device>;
    getDevices(user_id: string): Promise<Device[]>;
    addDevice(device: Device): Promise<void>;
    editDevice(device_id: string, user_id: string, device: Device): Promise<void>
    removeDevice(device_id: string, user_id: string): Promise<void>;
}