
import axios from 'axios';
import { injectable } from 'inversify';
import {GeoConverter} from './geo-converter';

@injectable()
export class OSMGeoConverter implements GeoConverter {
	url: string;

	constructor(url?: string) {
		this.url = url || process.env.OSM_CONV_URL || '';
	}

	public async getPlaceFromCoordinates(lat: number, lon: number): Promise<string> {
		return new Promise<string>(async (resolve, reject) => {
			console.log(`url: ${this.url}`)
			try {
				var result: any = await axios({
					method: 'get',
					url: this.url,
					params: {
						format: 'jsonv2',
						lat: lat,
						lon: lon
					}
				});
				console.log(result)
				return resolve(result.data.display_name);
			}catch (err) {
				return err;
			}
		} )
	}
}

/*
example
var lat = 41.899;
var lon = 13.211;
*/

