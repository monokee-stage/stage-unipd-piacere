import {Request, Response, NextFunction } from "express";
import { checkScopes } from "../utils/check-scope";

export const checkTokenMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    var metadata = res.locals.metaData
    var tokenData = res.locals.tokenData

    // next three lines are just for development and just while I don't have a valid token
    tokenData.scopes = ['get_devices']
    tokenData.active = true
    tokenData.sub = req.params.user_id
    

    var are_scopes_correct = true // checkScopes(req.url, req.method, tokenData.scopes)

    if(tokenData && tokenData.active === true && tokenData.sub === req.params.user_id && are_scopes_correct) {
        console.log('token check passed')
        return next()
    }else{
        if(!tokenData){
            return res.status(401).json({error: 'Unable to get token data'})
        }else if(!tokenData.active){
            return res.status(401).json({error: 'Token not valid'})
        }else if(tokenData.sub !== req.params.user_id){
            return res.status(401).json({error: 'Token owner and specified user are not the same'})
        }else if(!are_scopes_correct){
            return res.status(401).json({error: 'Scopes not correct'})
        }
    }
}