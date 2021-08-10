import { Repository } from "../../repository";
import { Event } from "../model/event";

export interface EventRepository extends Repository{
    getUserEvents(user_id: string): Promise<Event[]>;
    getDeviceEvents(device_id: string, user_id: string): Promise<Event[]>;
    addEvent(event: Event): Promise<void>;
}