import {Repository} from '../../repository'
import {Metadata} from '../model/metadata.model'

export interface MetadataRepository extends Repository{
	getMetadata(domain_id: string): Promise<Metadata>;
}