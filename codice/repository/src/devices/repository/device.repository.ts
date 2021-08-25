import { BaseRequestFilter } from "../../RequestFilter";
import { Repository } from "../../repository";
import { Device } from "../model/device";

export interface DeviceRepository extends Repository{
    getDevice(device_id: string, user_id: string): Promise<Device | undefined>;
    getDevices(user_id: string, filter?: BaseRequestFilter): Promise<Device[]>;
    addDevice(device: Device): Promise<void>;
    editDevice(device_id: string, user_id: string, device: Partial<Device>): Promise<boolean>
    // removeDevice(device_id: string, user_id: string): Promise<boolean>;
    archiveDevice(device_id: string, user_id: string): Promise<boolean>;
}