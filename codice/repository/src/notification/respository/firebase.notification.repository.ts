import { NotificationData } from "../model/notification.data";
import * as admin from 'firebase-admin';
import { Repository } from "../../repository";
import { stringifyNestedFields } from "../../utils/stringifyNestedFields";
import { injectable } from "inversify";
import { NotificationRepository } from "./notification.repository";

@injectable()
export class FirebaseNotificationRepository implements NotificationRepository {

    constructor(serviceAccountPath?: string) {
        try {
            let serviceAccount = require(serviceAccountPath || process.env.SERVICE_ACCOUNT_PATH || '')
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            })
        } catch(err) {
            throw err
        }
        
    }
    sendNotification(registration_tokens: string[], data: NotificationData): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                let convData: {[key: string]: string} = stringifyNestedFields(data)
                let message: admin.messaging.MulticastMessage = {
                    data: convData,
                    tokens: registration_tokens
                }
                await admin.messaging().sendMulticast(message)
                return resolve()
            } catch (err) {
                reject(err)
            }
        })
    }
}