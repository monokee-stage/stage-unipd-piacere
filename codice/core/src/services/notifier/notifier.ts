import { Service } from "../service";
import { NotificationData } from "./notification.data";

import * as admin from 'firebase-admin';

export class Notifier implements Service{

    constructor(serviceAccountPath?: string) {
        var serviceAccount = require(serviceAccountPath || process.env.SERVICE_ACCOUNT_PATH || '')
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
        
    }

    // the data argument should not be of type any but NotificationData
    sendNotification(registration_tokens: string[], data: any): Promise<void> {
        return new Promise<void>(async (resolve,reject) => {
            var message: admin.messaging.MulticastMessage = {
                data: data,
                tokens: registration_tokens
            }
            await admin.messaging().sendMulticast(message)
            return resolve()
        })
    }
}