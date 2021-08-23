import {Service} from '../service';


export interface GeoConverter extends Service {
	getPlaceFromCoordinates(lat: number, lon: number): Promise<string>;
}
