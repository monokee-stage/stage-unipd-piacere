import {Request, Response, NextFunction } from "express";
import { Metadata, MetadataRepository } from "repositories";
import { TYPES } from "repositories";
import { container } from "../ioc_config";
import { TokenConverter } from "../services/token-converter/token-converter";
import { TokenData } from "../services/token-converter/tokendata";

export const getTokenDataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenConverter: TokenConverter = container.get<TokenConverter>(TokenConverter)
        const metadata: Metadata = res.locals.metaData
        const token: string = req.headers.authorization as string
        let tokenData: TokenData = await tokenConverter.getTokenData(token, metadata)
        // should check if tokenData was retrieved correctly
        res.locals.tokenData = tokenData
        return next()
    } catch(err) {
        return next(err)
    }
    
}