export class Transaction {
    _id!: string
    user_id!: string
    requester_id!: string
    request_timestamp!: string
    confirmation_code!: string
    status!: string
    ttl!: number
    coordinates?: {
        lat: number
        long: number
    }
    location?: string
    extra_info?: any
}