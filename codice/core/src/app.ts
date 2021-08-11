
import {
	Route
} from './routes/route';

import dotenv from 'dotenv';
dotenv.config();

import {container} from "./ioc_config";
import Server from './server'
import { coreTYPES } from './types';

import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware';

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

server.loadMiddleware(errorHandlerMiddleware);

server.listen();
