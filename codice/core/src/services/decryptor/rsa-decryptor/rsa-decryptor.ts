import { Decryptor } from "../decryptor";
import * as crypto from 'crypto';

export class RSADecryptor implements Decryptor {
    private publicKey: string

    constructor(publicKey: string) {
        this.publicKey = publicKey
    }

    // maybe should accept an encoding as parameter
    decrypt(enc_text: string, encoding: string = 'base64'): string {
        let encod2: any = encoding
        let dec = crypto.publicDecrypt(this.publicKey, Buffer.from(enc_text, encod2))
        return dec.toString()
    }
    
}