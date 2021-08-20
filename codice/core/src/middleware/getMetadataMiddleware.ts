import {Request, Response, NextFunction } from "express";
import { Metadata, MetadataRepository } from "repositories";
import { TYPES } from "repositories";
import { CodedError } from "../coded.error";
import { container } from "../ioc_config";

export const getMetadataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var metadataRepo = container.get<MetadataRepository>(TYPES.MetadataRepository)
        var domain_id = req.query.domain_id as string
        if(!domain_id) {
            return next(new CodedError('Domain_id not provided', 401))
        }
        var metadata: Metadata | undefined = await metadataRepo.getMetadata(domain_id)
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