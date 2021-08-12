import {Request, Response, NextFunction } from "express";
import { checkScopes } from "../utils/check-scope";

export const checkTokenMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    var metadata = res.locals.metadata
    var tokenData = res.locals.tokenData
    var owned_scopes = ['get_devices'] // tokenData.scopes

    var are_scopes_correct = checkScopes(req.url, req.method, owned_scopes)

    if(
        /*tokenData
        && tokenData.active == true
        && tokenData.sub == req.params.user_id
        && */are_scopes_correct) {
        return next()
    }else{
        if(!tokenData){
            return res.status(401).json({error: 'Unable to get token data'})
        }else if(!tokenData.active){
            return res.status(401).json({error: 'Token not valid'})
        }else if(tokenData.sub != req.params.user_id){
            return res.status(401).json({error: 'Token owner and specified user are not the same'})
        }else if(!are_scopes_correct){
            return res.status(401).json({error: 'Scopes not correct'})
        }
    }

}