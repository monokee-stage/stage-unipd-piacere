export class Device {
    _id!: string
    user_id!: string
    public_key!: string
    registration_token!: string
}
// should find a better way to get the fields of a class
export const device_fields = ['_id', 'user_id', 'public_key', 'registration_token']