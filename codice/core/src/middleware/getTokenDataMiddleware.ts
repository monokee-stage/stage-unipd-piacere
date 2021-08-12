import {Request, Response, NextFunction } from "express";
import { MetadataRepository } from "repositories";
import { TYPES } from "repositories";
import { container } from "../ioc_config";
import { TokenConverter } from "../services/token-converter/token-converter";
import { TokenData } from "../services/token-converter/tokendata";

export const getTokenDataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    var tokenConverter = container.get<TokenConverter>(TokenConverter)
    var metadata = res.locals.metadata
    var token = req.headers.authorization as string
    var tokenData: TokenData = await tokenConverter.getTokenData(token, metadata)
    res.locals.tokenData = tokenData
}