import { Decryptor } from "../decryptor";
import * as crypto from 'crypto';

export class RSADecryptor implements Decryptor {
    private publicKey: any

    // there's no point in taking the publicKey from the environment since the key different for every device
    constructor(publicKey: string) {
        this.publicKey = publicKey
    }

    decrypt(enc_text: string, encoding: string = 'base64'): string {
        try {
            const encod2: any = encoding
            const dec: Buffer = crypto.publicDecrypt(this.publicKey, Buffer.from(enc_text, encod2))
            return dec.toString()
        } catch(err) {
            throw err
        }
        
    }
    
}