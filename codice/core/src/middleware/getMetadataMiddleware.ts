import {Request, Response, NextFunction } from "express";
import { Metadata, MetadataRepository } from "repositories";
import { TYPES } from "repositories";
import { CodedError } from "../coded.error";
import { container } from "../ioc_config";

// gets the metadata of the specified domain and saves them in res.locals.metaData so that thay can be accessed by the following functions
export const getMetadataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const metadataRepo: MetadataRepository = container.get<MetadataRepository>(TYPES.MetadataRepository)
        const domain_id: string = req.query.domain_id as string
        if(!domain_id) {
            return next(new CodedError('Domain_id not provided', 401))
        }
        let metadata: Metadata | undefined = await metadataRepo.getMetadata(domain_id)
        if(metadata) {
            res.locals.metaData = metadata
        }else{
            return next(new CodedError('Metadata not existing for this domain_id', 401))
        }
        return next()
    } catch(err) {
        return next(err)
    }
}