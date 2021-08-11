import {Service} from '../service';
import axios from 'axios';

import {injectable, inject} from 'inversify';
import { TokenData } from './tokendata';
import { Metadata } from '../../../../repository/dist';


@injectable()
export class TokenConverter implements Service{

	public getTokenData(token: string, metadata: Metadata): Promise<TokenData> {
		return new Promise<TokenData>( async (resolve, reject) => {
			// in reality the client_secret will be AES encrypted
			var authstring = metadata.core.client_id + ':' + metadata.core.client_secret
			var based = Buffer.from(authstring).toString('base64')
			// var auth = 'Basic WnRZUTNWRkgyeXlLTHNjTDpBV1JESExjdzRtTmVKNzJa';
			return axios({
				method: 'post',
				url: metadata.introspection_endpoint,
				data: `token=${token}&token_type_hint=access_token`,
				headers: {
					'Authorization': 'Basic ' + based
				}
			}).then();
		})
	}
}