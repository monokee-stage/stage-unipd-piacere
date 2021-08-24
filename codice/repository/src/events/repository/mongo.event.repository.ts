import { inject, injectable } from "inversify";
import { MongoClient, MongoClientOptions } from "mongodb";
import { BaseRequestFilter } from "../../RequestFilter";
import { applyQueryAndFilter } from "../../utils/applyQueryAndFilter";
import { Event } from "../model/event";
import { EventRepository } from "./event.repository";

@injectable()
export class MongoEventRepository implements EventRepository {

    client: MongoClient;
    database: any;
    events: any; 
    

    constructor(_uri?: string, _options?: MongoClientOptions) {
        const uri: string = _uri || process.env.MAIN_MONGODB_URI || ''
        const options: MongoClientOptions = _options || JSON.parse(process.env.MAIN_MONGODB_OPTIONS || '{}') || undefined
        this.client = new MongoClient(uri, options);
        this.client.connect((err, client) => {
            if (err) {
                console.log('Unable to connect to events database')
            } else {
                console.log('Events connection succeded')
            }
        });

        this.database = this.client.db('mfa');
        this.events = this.database.collection('events');
    }

    getUserEvents(user_id: string, filter?: BaseRequestFilter): Promise<Event[]> {
        return new Promise<Event[]> (async (resolve, reject) => {
            try {
                const query = { user_id: user_id }
                let events: Event[] = await applyQueryAndFilter<Event>(this.events, query, filter).toArray()
                return resolve(events)
            } catch(err) {
                return reject(err)
            }
        });
    }
    getDeviceEvents(device_id: string, user_id: string, filter?: BaseRequestFilter): Promise<Event[]> {
        return new Promise<Event[]> (async (resolve, reject) => {
            try {
                const query = { device_id: device_id, user_id: user_id }
                let events: Event[] = await applyQueryAndFilter<Event>(this.events, query, filter).toArray()
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