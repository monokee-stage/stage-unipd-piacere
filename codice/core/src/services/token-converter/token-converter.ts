import {Service} from '../service';
import axios from 'axios';

import {injectable, inject} from 'inversify';
import { TokenData } from './tokendata';
import { Metadata } from '../../../../repository/dist';
import { AESDecryptor } from '../decryptor/aes-decryptor/aes-decryptor';
import { Decryptor } from '../decryptor/decryptor';


@injectable()
export class TokenConverter implements Service{
	
	constructor(
		@inject(AESDecryptor) private aesDecryptor: Decryptor
	) {

	}

	public getTokenData(token: string, metadata: Metadata): Promise<TokenData> {
		return new Promise<TokenData>( async (resolve, reject) => {
			try {
				// in reality the client_secret will be AES encrypted
				var enc_secret = metadata.core.client_secret
				var dec_secret = this.aesDecryptor.decrypt(enc_secret, 'base64')
				console.log(dec_secret)
				var authstring = metadata.core.client_id + ':' + dec_secret
				var based = Buffer.from(authstring).toString('base64')
				// var auth = 'Basic WnRZUTNWRkgyeXlLTHNjTDpBV1JESExjdzRtTmVKNzJa';
			
				var response = await axios({
					method: 'post',
					url: metadata.introspection_endpoint,
					data: `token=${token}&token_type_hint=access_token`,
					headers: {
						'Authorization': 'Basic ' + based
					}
				})

				console.log('response')
				console.log(response.data)
				return resolve(response.data)
			}catch (err) {
				return reject(err)
			}
		})
	}
}