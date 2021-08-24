import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {Metadata, MetadataRepository, TYPES} from 'repositories';

import {injectable, inject} from 'inversify';
import { container } from '../../ioc_config';
import { MetadataController } from '../../controllers/metadata/metadata.controller';


@injectable()
export class MetadataRoute extends Route {
	 

	constructor(@inject(MetadataController) private metadataController: MetadataController) {
		super()
		try {
			this.basePath = '/metadata/:domain_id';
			this.router = Router();
			this.router.get(this.basePath, this.getMetadata);
		} catch(err) {
			throw err
		}
	}

	private getMetadata = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const url: string|undefined = await this.metadataController.getMetadata(req.params.domain_id)
			res.json({ metadata_url: url });
		} catch (err) {
			return next(err)
		}
	}
}