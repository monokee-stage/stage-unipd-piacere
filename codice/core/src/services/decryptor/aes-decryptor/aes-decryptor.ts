import * as crypto from 'crypto';
import { injectable } from 'inversify';
import { Decryptor } from '../decryptor';

@injectable()
export class AESDecryptor implements Decryptor{
	readonly algorithm: string
	readonly key: string
	readonly iv: string

	constructor(algorithm?: string, key?: string, iv?: string) {
		this.algorithm = algorithm || process.env.AES_ALGORITHM || 'aes-128-cbc'
		this.key = key || process.env.AES_KEY || ''
		this.iv = iv || process.env.AES_IV || ''
	}

	public decrypt(text: string, encoding: string = 'base64'): string {
		try {
			let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), Buffer.from(this.iv));
			let encod2: any = encoding;
			let buf = Buffer.from(text, encod2);
			let decr = decipher.update(buf);
			decr = Buffer.concat([decr, decipher.final()]);
			return decr.toString();
		} catch(err) {
			throw err
		}
	}
}