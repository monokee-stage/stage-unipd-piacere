
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


const server: Server = new Server({port: 3001,host: 'localhost'})

const metadataRoute: Route = container.get<Route>(coreTYPES.MetadataRoute);
const deviceRoute: Route = container.get<Route>(coreTYPES.DevicesRoute);
const requestRoute: Route = container.get<Route>(coreTYPES.RequestsRoute);
const confirmationRoute: Route = container.get<Route>(coreTYPES.ConfirmationRoute);




server.loadRoute(metadataRoute);

server.loadMiddleware(getMetadataMiddleware);
server.loadMiddleware(getTokenDataMiddleware);
server.loadMiddleware(checkTokenMiddleware);

server.loadMiddleware(checkClientPermissionMiddleware);
server.loadMiddleware(checkDeviceIdentityMiddleware, '/user/:user_id/device/:device_id', 'DELETE');

try {
	server.loadRoute(deviceRoute);
} catch(err) {
	console.log('error')
}

server.loadRoute(requestRoute);
server.loadRoute(confirmationRoute);

server.loadMiddleware(errorHandlerMiddleware);


server.listen();
