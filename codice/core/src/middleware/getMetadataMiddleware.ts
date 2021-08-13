import {Request, Response, NextFunction } from "express";
import { MetadataRepository } from "repositories";
import { TYPES } from "repositories";
import { container } from "../ioc_config";

export const getMetadataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    var metadataRepo = container.get<MetadataRepository>(TYPES.MetadataRepository)
    var domain_id = req.query.domain_id as string
    var metadata = await metadataRepo.getMetadata(domain_id)
    // should check if metadata was retrieved correctly
    res.locals.metadata = metadata
    next()
}