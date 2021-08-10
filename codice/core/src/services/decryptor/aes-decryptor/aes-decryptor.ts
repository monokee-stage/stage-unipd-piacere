import * as crypto from 'crypto';
import { Decryptor } from '../decryptor';

class AESDecryptor implements Decryptor{
	readonly algorithm = process.env.AES_ALGORITHM || 'aes-256-cbc'
	readonly key = process.env.AES_KEY || ''
	readonly iv = process.env.AES_IV || ''
	readonly decipher: any;

	constructor() {
		this.decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), Buffer.from(this.iv));
	}

	public decrypt(text: string, encod: string = 'hex'): string {
		let encod2: any = encod; 
		let buf = Buffer.from(text, encod2);
		let decr = this.decipher.update(buf);
		console.log('ok1');
		decr = Buffer.concat([decr, this.decipher.final()]);
		return decr.toString();
	}
}