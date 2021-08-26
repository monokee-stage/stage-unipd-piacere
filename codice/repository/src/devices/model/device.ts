export class Device {
    _id!: string
    user_id!: string
    public_key!: string
    registration_token!: string

    public static validateDevice(device: any): boolean {
        if(Object.keys(device).length === Object.keys(DeviceFields).length) {
            for(const key in DeviceFields) {
                if (device[key] === undefined || typeof(device[key]) !== typeof(DeviceFieldsObj[key])){
                    return false
                }
            }
            return true
        }
        return false
    }

    public static validatePartialDevice(device: any): boolean {
        if (Object.keys(device).length <= Object.keys(DeviceFields).length) {
            let count: number = 0
            for (const key in DeviceFields) {
                if (device[key] !== undefined && typeof (device[key]) === typeof (DeviceFieldsObj[key])) {
                    count++
                }
            }
            if (count === Object.keys(device).length){
                return true
            }
        }
        return false
    }
}



export enum DeviceFields {
    _id =  '_id',
    user_id =  'user_id',
    public_key =  'public_key',
    registration_token =  'registration_token',
}

const DeviceFieldsObj: any = {
    _id: '_id',
    user_id: 'user_id',
    public_key: 'public_key',
    registration_token: 'registration_token',
}