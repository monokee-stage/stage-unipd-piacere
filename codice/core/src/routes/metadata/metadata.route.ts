import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';
import {Metadata, MetadataRepository, TYPES} from 'repositories';

import {injectable, inject} from 'inversify';
import { container } from '../../ioc_config';
import { MetadataController } from '../../controllers/metadata/metadata.controller';
import { CodedError } from '../../coded.error';


@injectable()
export class MetadataRoute extends Route {
	 

	constructor(@inject(MetadataController) private metadataController: MetadataController) {
		super()
		this.basePath = '/metadata/:domain_id';
		this.router = Router();
		this.router.get(this.basePath, this.getMetadata);
	}

	private getMetadata = async (req: Request, res: Response, next: NextFunction) => {
		const domain_id = req.params.domain_id
		if (!domain_id) {
			return next(new CodedError('Domain id not provided', 400))
		}
		try {
			const url: string|undefined = await this.metadataController.getMetadata(domain_id)
			res.status(200).json({ metadata_url: url });
		} catch (err) {
			return next(err)
		}
	}
}