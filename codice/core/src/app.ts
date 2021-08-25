
import {
	Route
} from './routes/route';

import dotenv from 'dotenv';
dotenv.config();

import { container } from "./ioc_config";
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



const server: Server = new Server({ port: 3001, host: 'localhost' })

let metadataRoute: Route = container.get<Route>(MetadataRoute);
let deviceRoute: Route = container.get<Route>(DevicesRoute);
let requestRoute: Route = container.get<Route>(RequestsRoute);
let confirmationRoute: Route = container.get<Route>(ConfirmationRoute);


server.loadRoute(metadataRoute);
server.loadMiddleware(getMetadataMiddleware);
server.loadMiddleware(getTokenDataMiddleware);
server.loadMiddleware(checkTokenMiddleware);

server.loadMiddleware(checkClientPermissionMiddleware);
// removed just for development
// server.loadMiddleware(checkDeviceIdentityMiddleware, '/user/:user_id/device/:device_id', 'DELETE');


server.loadRoute(deviceRoute);
server.loadRoute(requestRoute);
server.loadRoute(confirmationRoute);

server.loadMiddleware(errorHandlerMiddleware);


server.listen();




