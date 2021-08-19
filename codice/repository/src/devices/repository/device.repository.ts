import { RequestFilter } from "../../filter";
import { Repository } from "../../repository";
import { Device } from "../model/device";

export interface DeviceRepository extends Repository{
    getDevice(device_id: string, user_id: string): Promise<Device | undefined>;
    getDevices(user_id: string, filter?: RequestFilter): Promise<Device[]>;
    addDevice(device: Device): Promise<void>;
    editDevice(device_id: string, user_id: string, device: Partial<Device>): Promise<number>
    removeDevice(device_id: string, user_id: string): Promise<void>;
    archiveDevice(device_id: string, user_id: string): Promise<void>;
}