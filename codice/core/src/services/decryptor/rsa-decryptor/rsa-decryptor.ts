import { Decryptor } from "../decryptor";
import * as crypto from 'crypto';

export class RSADecryptor implements Decryptor {
    private publicKey: any

    // there's no point in reading the publicKey from a configuration file since the key is different for every device
    constructor(publicKey: string) {
        this.publicKey = publicKey
    }

    decrypt(enc_text: string, encoding: string = 'base64'): string {
        const encod2: any = encoding
        const dec: Buffer = crypto.publicDecrypt(this.publicKey, Buffer.from(enc_text, encod2))
        return dec.toString()
    }
    
}