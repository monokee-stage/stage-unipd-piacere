
import axios from 'axios';
import {GeoConverter} from './geo-converter';


export class OSMGeoConverter implements GeoConverter {
	url = 'https://nominatim.openstreetmap.org/reverse.php';

	public async getPlaceFromCoordinates(lat: number, lon: number): Promise<any> {
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
			return result.data.address;
		}catch (err) {
			return err;
		}
	}
}

/*
example
var lat = 41.899;
var lon = 13.211;
*/

