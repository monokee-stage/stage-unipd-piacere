
import {
	Route
} from './routes/route';

import dotenv from 'dotenv';
dotenv.config();

import {container} from "./ioc_config";
import Server from './server'

import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware';
import { checkTokenMiddleware } from './middleware/checkTokenMiddleware';
import { getMetadataMiddleware } from './middleware/getMetadataMiddleware';
import { getTokenDataMiddleware } from './middleware/getTokenDataMiddleware';
import { checkClientPermissionMiddleware } from './middleware/checkClientPermissionMiddleware';
import { checkDeviceIdentityMiddleware } from './middleware/checkDeviceIdentityMiddleware';
import { ConfirmationRoute } from './routes/confirmations/confirmation.route';
import { DevicesRoute } from './routes/devices/devices.route';
import { MetadataRoute } from './routes/metadata/metadata.route';
import { RequestsRoute } from './routes/requests/requests.route';


const server: Server = new Server({port: 3001,host: 'localhost'})

const metadataRoute: Route = container.get<Route>(MetadataRoute);
const deviceRoute: Route = container.get<Route>(DevicesRoute);
const requestRoute: Route = container.get<Route>(RequestsRoute);
const confirmationRoute: Route = container.get<Route>(ConfirmationRoute);




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
