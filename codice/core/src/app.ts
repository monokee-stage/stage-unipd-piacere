
import {
	Route
} from './routes/route';

import dotenv from 'dotenv';
dotenv.config();

import {container} from "./ioc_config";
import Server from './server'
import { coreTYPES } from './types';

import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware';
import { checkTokenMiddleware } from './middleware/checkTokenMiddleware';
import { getMetadataMiddleware } from './middleware/getMetadataMiddleware';
import { getTokenDataMiddleware } from './middleware/getTokenDataMiddleware';
import { checkClientPermissionMiddleware } from './middleware/checkClientPermissionMiddleware';
import { checkDeviceIdentityMiddleware } from './middleware/checkDeviceIdentityMiddleware';

console.log('start');

var server = new Server({port: 3001,host: 'localhost'})

var metadataRoute: Route = container.get<Route>(coreTYPES.MetadataRoute);
var deviceRoute: Route = container.get<Route>(coreTYPES.DevicesRoute);
var requestRoute: Route = container.get<Route>(coreTYPES.RequestsRoute);
var confirmationRoute: Route = container.get<Route>(coreTYPES.ConfirmationRoute);




server.loadRoute(metadataRoute);

server.loadMiddleware(getMetadataMiddleware);
server.loadMiddleware(getTokenDataMiddleware);
server.loadMiddleware(checkTokenMiddleware);

server.loadMiddleware(checkClientPermissionMiddleware);
server.loadMiddleware(checkDeviceIdentityMiddleware, '/user/:user_id/device/:device_id', 'DELETE');

server.loadRoute(deviceRoute);
server.loadRoute(requestRoute);
server.loadRoute(confirmationRoute);





server.loadMiddleware(errorHandlerMiddleware);


server.listen();
