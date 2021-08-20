import { Request, Response, NextFunction } from 'express';

import { inject } from 'inversify';
import { DeviceRepository, TYPES } from 'repositories';
import { CodedError } from '../coded.error';
import { container } from '../ioc_config';
import { Decryptor } from '../services/decryptor/decryptor';
import { RSADecryptor } from '../services/decryptor/rsa-decryptor/rsa-decryptor';

export const checkDeviceIdentityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // controllo che sia stata attuata la verifica del tipo di client
        if(res.locals.verified_client_type){
            if(res.locals.verified_client_type === 'app'){
                // se la richiesta viene dall'app verifico il dispositivo
                let user_id = req.params.user_id
                if(!user_id) {
                    return next(new CodedError('User id not found', 401))
                }
                let claimed_id = req.params.device_id
                if(!claimed_id) {
                    return next(new CodedError('Claimed id not found', 401))
                }
                let signed_id = req.query.signed_device_id as string
                if(!signed_id) {
                    return next(new CodedError('Signed id not found', 401))
                }
                let deviceRepo = container.get<DeviceRepository>(TYPES.DeviceRepository)
                let deviceData = await deviceRepo.getDevice(claimed_id, user_id)
                if(!deviceData) {
                    return next(new CodedError('Device not found', 401))
                }
                
                let pub_key = deviceData.public_key
                let rsaDecryptor: Decryptor = new RSADecryptor(pub_key)
                let decrypted = rsaDecryptor.decrypt(signed_id)
                if(claimed_id && (decrypted === claimed_id) ){
                    return next()
                }else{
                    return next(new CodedError('The device which requested the action is not the same as the target device', 401))
                }
            }else {
                // client types other than the mobile app don't need device verification
                return next()
            }
        }else{
            return next(new CodedError('The client type is not verified', 401))
        }
    }catch(err) {
        return next(err)
    }
}