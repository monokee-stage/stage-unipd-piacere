export class Device {
    device_id: string
    user_id: string
    public_key: string

    constructor(device_id?: string, user_id?: string, public_key?: string){
        this.device_id = device_id || '';
        this.user_id = user_id || '';
        this.public_key = public_key || '';
    }
}