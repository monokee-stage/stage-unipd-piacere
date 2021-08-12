import { Service } from "../service";
import { NotificationData } from "./notification.data";
import {stringifyNestedFields} from 'repositories';

import * as admin from 'firebase-admin';

export class Notifier implements Service{

    constructor(serviceAccountPath?: string) {
        var serviceAccount = require(serviceAccountPath || process.env.SERVICE_ACCOUNT_PATH || '')
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
        
    }

    // the data argument should not be of type any but NotificationData
    sendNotification(registration_tokens: string[], data: NotificationData): Promise<void> {
        return new Promise<void>(async (resolve,reject) => {
            var convData = stringifyNestedFields(data)
            var message: admin.messaging.MulticastMessage = {
                data: convData,
                tokens: registration_tokens
            }
            await admin.messaging().sendMulticast(message)
            return resolve()
        })
    }
}