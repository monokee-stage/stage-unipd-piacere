
import {
	Repository,
	Metadata,
	MetadataRepository,
	RedisMetadataRepository,
	TransactionModel,
	TransactionRepository,
	RedisTransactionRepository,
	MongoDeviceRepository
} from 'repositories';

import {
	MetadataRoute
} from './routes/metadata/metadata.route';

import {DevicesRoute} from './routes/devices/devices.route';

import {checkToken} from './middleware/checkToken';

import {
	Route
} from './routes/route';

import {
	GeoConverter
} from './services/geo-converter/geo-converter';
import {
	OSMGeoConverter
} from './services/geo-converter/osm-geo-converter';

import dotenv from 'dotenv';
dotenv.config();

import {container} from "./ioc_config";
import Server from './server'
import { RequestsRoute } from './routes/requests/requests.route';
import { ConfirmationRoute } from './routes/confirmations/confirmation.route';
import { coreTYPES } from './types';

import express from 'express';

console.log('start');

var server = new Server({port: 3001,host: 'localhost'})

var route1: Route = container.get<Route>(coreTYPES.MetadataRoute);
var route2: Route = container.get<Route>(coreTYPES.DevicesRoute);
var route3: Route = container.get<Route>(coreTYPES.RequestsRoute);
var route4: Route = container.get<Route>(coreTYPES.ConfirmationRoute);




server.loadRoute(route1);

/*server.loadMiddleware(checkToken);*/

server.loadRoute(route2);
/*server.loadRoute(route3);
server.loadRoute(route4);*/

server.listen();
