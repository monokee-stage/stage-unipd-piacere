import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {Metadata, MetadataRepository, TYPES} from 'repositories';

import {injectable, inject} from 'inversify';
import { container } from '../../ioc_config';


@injectable()
export class MetadataRoute extends Route {
	 

	constructor(@inject(TYPES.MetadataRepository) private metadataRepo: MetadataRepository) {
		super()
		this.basePath = '/metadata/:domain_id';
		this.router = Router();
		this.router.get(this.basePath, this.metadata);
	}

	private metadata = async (req: Request, res: Response, next: NextFunction) => {
		var id: string = req.params.domain_id;
		var met = await this.metadataRepo.getMetadata(id);
		res.json({metadata_url: met.metadata_url});
	}
}