import {Metadata} from '../model/metadata.model'
import {MetadataRepository} from './metadata.repository'
import Redis from 'ioredis'

export class RedisMetadataRepository implements MetadataRepository{
	private redis: Redis.Redis

	constructor() {
		this.redis = new Redis();
	}
	/*
	public getMetadata(domain_id: string): Promise<Metadata> {
		return new Promise<Metadata>(async (resolve,reject) => {
			this.redis.get(domain_id).then((result) => {
				console.log(`domain_id: ${domain_id}`);
				if(result == undefined){
					var met = new Metadata('nope');
				}else{
					var met = new Metadata(result);	
				}
				return resolve(met);
			})
		})
	}*/

	
	public async getMetadata(domain_id: string): Promise<Metadata> {
		var result = await this.redis.get(domain_id);
		console.log(`domain_id: ${domain_id}`);
		if(result == undefined){
			var met: Metadata = {
				_id: '0',
				url: 'none'
			} 
		}else{
			var met: Metadata = {
				_id: '0',
				url: 'yes'
			}
		}
		return met;
	}
}