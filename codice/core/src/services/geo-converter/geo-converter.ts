import {Service} from '../service';


export interface GeoConverter extends Service {
	public getPlaceFromCoordinates(lat: float, lon: float): any;
}

/*
var lat = 41.899;
var lon = 13.211;
*/

