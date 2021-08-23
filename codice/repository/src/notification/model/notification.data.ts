
// todo: maybe a timestamp would be useful
export class NotificationData {
    transaction_id!: string
    confirmation_code!: string
    location?: string
    coordinates?: {
        lat: string
        long: string
    }
    extra_info?: {
        [key: string]: string | number
    }
}