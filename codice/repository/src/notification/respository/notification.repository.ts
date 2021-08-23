
import { NotificationData } from "../model/notification.data";

import * as admin from 'firebase-admin';
import { Repository } from "../../repository";

export interface NotificationRepository extends Repository {

    sendNotification(registration_tokens: string[], data: NotificationData): Promise<boolean>
}