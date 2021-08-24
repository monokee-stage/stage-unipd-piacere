import {Request, Response, NextFunction } from "express";
import { Metadata, MetadataRepository } from "repositories";
import { TYPES } from "repositories";
import { CodedError } from "../coded.error";
import { container } from "../ioc_config";
import { TokenConverter } from "../services/token-converter/token-converter";
import { TokenData } from "../services/token-converter/tokendata";

// gets the token data of the specified token and saves them in res.locals.tokenData so that thay can be accessed by the following functions
export const getTokenDataMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenConverter: TokenConverter = container.get<TokenConverter>(TokenConverter)
        const metadata: Metadata = res.locals.metaData
        const token: string = req.headers.authorization as string
        let tokenData: TokenData|undefined = await tokenConverter.getTokenData(token, metadata)
        if(tokenData) {
            res.locals.tokenData = tokenData
            return next()
        }else{
            return next(new CodedError('No token data found', 400))
        }
        
    } catch(err) {
        return next(err)
    }
    
}