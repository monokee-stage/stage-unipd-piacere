import { injectable } from "inversify";
import { Collection, MongoClient } from "mongodb";
import { Metadata } from "../model/metadata.model";
import { MetadataRepository } from "./metadata.repository";

@injectable()
export class MongoMetadataRepository implements MetadataRepository {

    private client: MongoClient;
    private metadata: any;

    constructor(){
        this.client = new MongoClient(process.env.METADATA_MONGODB_URI || '');
        this.client.connect();
        var db = this.client.db(process.env.METADATA_MONGODB_DB_NAME);
        this.metadata = db.collection(process.env.METADATA_MONGODB_COLLECTION_NAME || '')
    }

    getMetadata(domain_id: string): Promise<Metadata> {
        return new Promise<Metadata> (async (resolve, reject) => {
            var met: Metadata = await this.metadata.findOne( {_id: domain_id});
            return resolve(met);
        })
    }
    
}