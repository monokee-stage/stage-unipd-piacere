import 'reflect-metadata';

import {Container} from 'inversify';

import {Route} from './routes/route';
import {MetadataRoute} from './routes/metadata/metadata.route';
import {DevicesRoute} from './routes/devices/devices.route';
import { RequestsRoute } from './routes/requests/requests.route';
import { ConfirmationRoute } from './routes/confirmations/confirmation.route';

import {Service} from './services/service';
import {TokenConverter} from './services/token-converter/token-converter';

import {Metadata, MetadataRepository, MongoMetadataRepository, RedisMetadataRepository} from 'repositories';


import {TYPES} from 'repositories';

export const container: Container = new Container();

container.bind<MetadataRoute>(MetadataRoute);
container.bind<Route>(DevicesRoute).to(DevicesRoute);
container.bind<Route>(RequestsRoute).to(RequestsRoute);
container.bind<Route>(ConfirmationRoute).to(ConfirmationRoute);

container.bind<MetadataRepository>(TYPES.MetadataRepository).to(MongoMetadataRepository);

container.bind<Service>(TokenConverter).to(TokenConverter);


