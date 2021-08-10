import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {Metadata, MetadataRepository, TYPES} from 'repositories';

import {injectable, inject} from 'inversify';
import { container } from '../../ioc_config';


@injectable()
export class MetadataRoute extends Route {

	
	private metadataRepo: MetadataRepository;

	constructor() {
		super();
		this.basePath = '/metadata/:domain_id';
		this.router = Router();
		this.router.get(this.basePath, this.metadata);

		this.metadataRepo = container.get<MetadataRepository>(TYPES.MetadataRepository);
	}

	private async metadata(req: Request, res: Response, next: NextFunction) {
		var id: string = req.params.domain_id;
		// res.send('temp');
		var met = await this.metadataRepo.getMetadata(id);
		res.json(met);
	}
}