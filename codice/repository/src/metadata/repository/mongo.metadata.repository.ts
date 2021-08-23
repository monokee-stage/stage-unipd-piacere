import { injectable } from "inversify";
import { Collection, Db, MongoClient } from "mongodb";
import { controlledMongoFindOne } from "../../utils/controlledMongoFindOne";
import { Metadata } from "../model/metadata.model";
import { MetadataRepository } from "./metadata.repository";

@injectable()
export class MongoMetadataRepository implements MetadataRepository {

    private client!: MongoClient;
    private metadata: any;

    constructor(){
        try {
            this.client = new MongoClient(process.env.METADATA_MONGODB_URI || '');
            this.client.connect((err, client) => {
                if (err) {
                    console.log('Unable to connect to metadata database')
                } else {
                    console.log('Metadata connection succeded')
                }
            })

            const db: Db = this.client.db(process.env.METADATA_MONGODB_DB_NAME);
            this.metadata = db.collection(process.env.METADATA_MONGODB_COLLECTION_NAME || '')
        } catch(err) {
            throw err
        }
    }   

    getMetadata(domain_id: string): Promise<Metadata | undefined> {
        return new Promise<Metadata | undefined> (async (resolve, reject) => {
            try {
                let met: Metadata | undefined = await controlledMongoFindOne<Metadata>(this.metadata,{ _id: domain_id });
                return resolve(met);
            } catch(err) {
                return reject(err)
            }
        })
    }
    
}