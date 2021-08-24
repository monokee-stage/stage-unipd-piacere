import {Service} from '../service';
import axios, { AxiosPromise } from 'axios';

import {injectable, inject} from 'inversify';
import { TokenData } from './tokendata';
import { Metadata } from '../../../../repository/dist';
import { AESDecryptor } from '../decryptor/aes-decryptor/aes-decryptor';
import { Decryptor } from '../decryptor/decryptor';


@injectable()
export class TokenConverter implements Service{
	@inject(AESDecryptor) private aesDecryptor!: Decryptor

	public getTokenData(token: string, metadata: Metadata): Promise<TokenData|undefined> {
		return new Promise<TokenData | undefined>( async (resolve, reject) => {
			try {
				const enc_secret: string = metadata.core.client_secret
				const dec_secret: string = this.aesDecryptor.decrypt(enc_secret, 'base64')
				const authstring: string = metadata.core.client_id + ':' + dec_secret
				const based: string = Buffer.from(authstring).toString('base64')
				// auth = 'Basic WnRZUTNWRkgyeXlLTHNjTDpBV1JESExjdzRtTmVKNzJa';
			
				let response: any = await axios({
					method: 'post',
					url: metadata.introspection_endpoint,
					data: `token=${token}&token_type_hint=access_token`,
					headers: {
						'Authorization': 'Basic ' + based
					}
				})
				if(response && response.data){
					return resolve(response.data)
				}else{
					return resolve(undefined)
				}
			}catch (err) {
				return reject(err)
			}
		})
	}
}