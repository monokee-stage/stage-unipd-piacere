import {Service} from '../service';


export interface GeoConverter extends Service {
	getPlaceFromCoordinates(lat: number, lon: number): Promise<string>;
}

/*
var lat = 41.899;
var lon = 13.211;
*/

