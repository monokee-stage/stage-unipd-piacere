import {Service} from '../service';
import axios from 'axios';

import {injectable, inject} from 'inversify';
import { TokenData } from './tokendata';
import { Metadata } from '../../../../repository/dist';


@injectable()
export class TokenConverter implements Service{

	public getTokenData(token: string, metadata: Metadata): Promise<TokenData> {
		return new Promise<TokenData>( async (resolve, reject) => {
			
			var authstring = metadata.core.client_id + ':' + metadata.core.
			var auth = 'Basic WnRZUTNWRkgyeXlLTHNjTDpBV1JESExjdzRtTmVKNzJa';
			var postBodyData = 'token=6cf99568-0d15-49d2-ba85-592883206eeb&token_type_hint=access_token';
			return axios({
				method: 'post',
				url: introspectionUrl,
				data: 'token=6cf99568-0d15-49d2-ba85-592883206eeb&token_type_hint=access_token',
				headers: {
					'Authorization': auth
				}
			}).then();
		})
	}
}