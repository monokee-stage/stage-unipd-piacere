import {Request, Response, NextFunction } from "express";
import { MetadataRepository } from "repositories";
import { TYPES } from "repositories";
import { container } from "../ioc_config";
import { TokenConverter } from "../services/token-converter/token-converter";
import { TokenData } from "../services/token-converter/tokendata";

export const getTokenDataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var tokenConverter = container.get<TokenConverter>(TokenConverter)
        var metadata = res.locals.metaData
        var token = req.headers.authorization as string
        console.log(`token: ${token}`)
        var tokenData: TokenData = await tokenConverter.getTokenData(token, metadata)
        // should check if tokenData was retrieved correctly
        res.locals.tokenData = tokenData
        return next()
    } catch(err) {
        return next(err)
    }
    
}