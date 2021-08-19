import { inject, injectable } from "inversify";
import { MongoClient } from "mongodb";
import { RequestFilter } from "../../filter";
import { applyQueryAndFilter } from "../../utils/applyQueryAndFilter";
import { Event } from "../model/event";
import { EventRepository } from "./event.repository";

@injectable()
export class MongoEventRepository implements EventRepository {

    client: MongoClient;
    database: any;
    events: any; 
    

    constructor() {
        var uri = process.env.MAIN_MONGODB_URI || '';
        this.client = new MongoClient(uri);
        this.client.connect();

        this.database = this.client.db('mfa');
        this.events = this.database.collection('events');
    }

    getUserEvents(user_id: string, filter?: RequestFilter): Promise<Event[]> {
        return new Promise<Event[]> (async (resolve, reject) => {
            try {
                let query = { user_id: user_id }
                var events = await applyQueryAndFilter(this.events, query, filter).toArray()
                return resolve(events)
            } catch(err) {
                return reject(err)
            }
        });
    }
    getDeviceEvents(device_id: string, user_id: string, filter?: RequestFilter): Promise<Event[]> {
        return new Promise<Event[]> (async (resolve, reject) => {
            try {
                let query = { device_id: device_id, user_id: user_id }
                var events = await applyQueryAndFilter(this.events, query, filter).toArray()
                return resolve(events)
            } catch(err) {
                return reject(err)
            }
        });
    }
    addEvent(event: Event): Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            try {
                await this.events.insertOne(event)
                return resolve()
            } catch(err) {
                return reject(err)
            }
        });
    }
    
}