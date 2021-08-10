export class Event {
    id!: string
    user_id!: string
    device_id!: string
    type!: string
    timestamp!: string
    transaction_id!: string
    coordinates!: {
        latitude: string
        longitude: string
    }
    location!: string
    extra_info!: {
        field_name: string
    }
}