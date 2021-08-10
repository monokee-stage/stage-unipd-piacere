import {Service} from '../service';
import axios from 'axios';

import {injectable, inject} from 'inversify';

export class TokenData{
    active!: boolean
    scope!: string[]
    client_id!: string
    token_type!: string
    exp!: number
    iat!: number
    nbf!: number
    sub!: string
}

@injectable()
export class TokenConverter implements Service{

	validateToken(
		token: string,
		token_type_hint: string,
		introspectionUrl: string,
		client_id: string,
		client_secret: string
	): Promise<TokenData> {

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
	}
}