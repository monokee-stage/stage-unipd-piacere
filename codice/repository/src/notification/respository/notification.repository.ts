
import { NotificationData } from "../model/notification.data";

import * as admin from 'firebase-admin';
import { Repository } from "../../repository";

// sposta in repository
export interface NotificationRepository extends Repository {

    sendNotification(registration_tokens: string[], data: NotificationData): Promise<void>
}