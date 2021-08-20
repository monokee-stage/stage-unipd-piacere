import {Request, Response, NextFunction } from "express"
import { CodedError } from "../coded.error"

export const checkClientPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let tokenData = res.locals.tokenData
        let metaData = res.locals.metaData
        if(!tokenData){
            return res.status(401).json('Token data not available')
        }
        if(!metaData){
            return res.status(401).json('Domain metadata not available')
        }
        let client_id = tokenData.client_id
        // Da un file viene letta una mappa del tipo
        // url: string -> [dispositivi permessi]
        // I dispositivi permessi possono essere app, webapp e software
        let permissions = require(process.env.CLIENT_TYPES_MAP_FILE_PATH || '')
        
        let app_id = metaData.app_mobile ? metaData.app_mobile.client_id : undefined
        let webapp_id = metaData.webapp ? metaData.webapp.client_id : undefined
        let software_id = metaData.software ? metaData.software.client_id : undefined

        let client_type = undefined
        if(client_id === app_id){
            client_type = 'app'
        }else if(client_id === webapp_id){
            client_type = 'webapp'
        }else if(client_id === software_id){
            client_type = 'external_software'
        }

        if(client_type) {
            let currentUrl = req.url
            let admittedClients: string[] = []
            let possible_urls = Object.keys(permissions)
            possible_urls.forEach((item: string) => {
                if(currentUrl.match(item)){
                    admittedClients = permissions[item]
                }
            })

            if(admittedClients.includes(client_type)) {
                res.locals.verified_client_type = client_type
                return next()
            }
        }

        return next(new CodedError('Client type not permitted', 401))
    } catch (err) {
        return next(err)
    }
    
}