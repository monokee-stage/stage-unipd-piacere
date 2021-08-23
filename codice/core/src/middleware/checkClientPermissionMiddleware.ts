import {Request, Response, NextFunction } from "express"
import { Metadata } from "../../../repository/dist"
import { CodedError } from "../coded.error"
import { TokenData } from "../services/token-converter/tokendata"

export const checkClientPermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenData: TokenData = res.locals.tokenData
        const metaData: Metadata = res.locals.metaData
        if(!tokenData){
            return res.status(401).json('Token data not available')
        }
        if(!metaData){
            return res.status(401).json('Domain metadata not available')
        }
        const client_id: any = tokenData.client_id
        // Da un file viene letta una mappa del tipo
        // url: string -> [dispositivi permessi]
        // I dispositivi permessi possono essere app, webapp e software
        const permissions: any = require(process.env.CLIENT_TYPES_MAP_FILE_PATH || '')
        
        const app_id: string|undefined = metaData.app_mobile ? metaData.app_mobile.client_id : undefined
        const webapp_id: string | undefined = metaData.web_app ? metaData.web_app.client_id : undefined
        const software_id: string | undefined = metaData.external_software ? metaData.external_software.client_id : undefined

        let client_type: string|undefined = undefined
        if(client_id === app_id){
            client_type = 'app'
        }else if(client_id === webapp_id){
            client_type = 'webapp'
        }else if(client_id === software_id){
            client_type = 'external_software'
        }

        if(client_type) {
            const currentUrl: string = req.url
            let admittedClients: string[] = []
            const possible_urls: string[] = Object.keys(permissions)
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