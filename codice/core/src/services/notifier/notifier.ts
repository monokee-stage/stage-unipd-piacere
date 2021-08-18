import { Service } from "../service";
import { NotificationData } from "./notification.data";
import { stringifyNestedFields, unstringifyNestedFields} from 'repositories';

import * as admin from 'firebase-admin';

// sposta in repository
export class Notifier implements Service{

    constructor(serviceAccountPath?: string) {
        var serviceAccount = require(serviceAccountPath || process.env.SERVICE_ACCOUNT_PATH || '')
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
        
    }

    sendNotification(registration_tokens: string[], data: NotificationData): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                var convData = stringifyNestedFields(data)
                
                var message: admin.messaging.MulticastMessage = {
                    data: convData,
                    tokens: registration_tokens
                }
                await admin.messaging().sendMulticast(message)
                return resolve()
            } catch(err) {
                reject(err)
            }
        })
    }
}