import {Request, Response, NextFunction } from "express";
import { MetadataRepository } from "repositories";
import { TYPES } from "repositories";
import { container } from "../ioc_config";

export const getMetadataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var metadataRepo = container.get<MetadataRepository>(TYPES.MetadataRepository)
        var domain_id = req.query.domain_id as string
        if(!domain_id) {
            return res.json({error: 'Domain_id not provided'})
        }
        var metadata = await metadataRepo.getMetadata(domain_id)
        // should check if metadata was retrieved correctly
        res.locals.metaData = metadata
        return next()
    } catch(err) {
        return next(err)
    }
}