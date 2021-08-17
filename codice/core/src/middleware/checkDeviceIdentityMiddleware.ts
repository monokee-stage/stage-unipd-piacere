import { Request, Response, NextFunction } from 'express';

import { inject } from 'inversify';
import { DeviceRepository, TYPES } from 'repositories';
import { container } from '../ioc_config';
import { Decryptor } from '../services/decryptor/decryptor';
import { RSADecryptor } from '../services/decryptor/rsa-decryptor/rsa-decryptor';

export const checkDeviceIdentityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('passing through checkDeviceIdentityMiddleware')
        // controllo che sia stata attuata la verifica del tipo di client
        if(res.locals.verified_client_type){
            if(res.locals.verified_client_type === 'app'){
                // se la richiesta viene dall'app verifico il dispositivo
                let user_id = req.params.user_id
                if(!user_id) {
                    return res.json({error: 'User id not found'})
                }
                let claimed_id = req.params.device_id
                if(!claimed_id) {
                    return res.json({error: 'Claimed id not found'})
                }
                let signed_id = req.query.signed_device_id as string
                if(!signed_id) {
                    return res.json({error: 'Signed id not found'})
                }
                let deviceRepo = container.get<DeviceRepository>(TYPES.DeviceRepository)
                let deviceData = await deviceRepo.getDevice(claimed_id, user_id)
                if(!deviceData) {
                    return res.json({error: 'Device not found'})
                }
                
                let pub_key = deviceData.public_key
                let rsaDecryptor: Decryptor = new RSADecryptor(pub_key)
                let decrypted = rsaDecryptor.decrypt(signed_id)
                if(claimed_id && (decrypted == claimed_id) ){
                    return next()
                }else{
                    return res.status(401).json({error: 'The device which requested the action is not the same as the target device'})
                }
            }else {
                // client types other than the mobile app don't need device verification
                return next()
            }
        }else{
            return res.status(401).json({error: 'The client type is not verified'})
        }
    }catch(err) {
        return next(err)
    }
}