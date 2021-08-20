import {Request, Response, NextFunction } from "express";
import { CodedError } from "../coded.error";
import { checkScopes } from "../utils/check-scope";

export const checkTokenMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try {
        var tokenData = res.locals.tokenData

        // next three lines are just for development and just while I don't have a valid token
        tokenData.active = true
        tokenData.sub = req.params.user_id
        

        var are_scopes_correct = true // checkScopes(req.url, req.method, tokenData.scopes)

        if(tokenData && tokenData.active === true && tokenData.sub === req.params.user_id && are_scopes_correct) {
            console.log('token check passed')
            return next()
        }else{
            if(!tokenData){
                return next(new CodedError('Unable to get token data', 401))
            }else if(!tokenData.active){
                return next(new CodedError('Token not valid', 401))
            }else if(tokenData.sub !== req.params.user_id){
                return next(new CodedError('Token owner and specified user are not the same', 401))
            }else if(!are_scopes_correct){
                return next(new CodedError('Scopes not correct', 401))
            }
        }
    } catch(err) {
        return next(err)
    }
}