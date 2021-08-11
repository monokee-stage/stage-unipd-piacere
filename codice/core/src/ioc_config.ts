import 'reflect-metadata';

import {Container} from 'inversify';

import {Route} from './routes/route';
import {MetadataRoute} from './routes/metadata/metadata.route';
import {DevicesRoute} from './routes/devices/devices.route';
import { RequestsRoute } from './routes/requests/requests.route';
import { ConfirmationRoute } from './routes/confirmations/confirmation.route';

import {Service} from './services/service';
import {TokenConverter} from './services/token-converter/token-converter';
import { UUIDGenerator } from './services/uuid-generator/uuid-generator';
import { RandomCodeGenerator } from './services/random-code-generator/random-code-generator';
import {Hasher} from './services/hasher/hasher';

import {
    DeviceRepository,
    MetadataRepository,
    MongoDeviceRepository,
    MongoMetadataRepository,
    EventRepository,
    MongoEventRepository,
    TransactionRepository,
    RedisTransactionRepository
} from 'repositories';


import {TYPES} from 'repositories';
import { coreTYPES } from './types';


export const container: Container = new Container();

container.bind<UUIDGenerator>(UUIDGenerator).to(UUIDGenerator);
container.bind<RandomCodeGenerator>(RandomCodeGenerator).to(RandomCodeGenerator);
container.bind<TokenConverter>(TokenConverter).to(TokenConverter);
container.bind<Hasher>(Hasher).toConstantValue(new Hasher());

container.bind<MetadataRepository>(TYPES.MetadataRepository).to(MongoMetadataRepository);
container.bind<DeviceRepository>(TYPES.DeviceRepository).to(MongoDeviceRepository);
container.bind<EventRepository>(TYPES.EventRepository).to(MongoEventRepository);
container.bind<TransactionRepository>(TYPES.TransactionRepository).to(RedisTransactionRepository);

container.bind<Route>(coreTYPES.MetadataRoute).to(MetadataRoute)
container.bind<Route>(coreTYPES.DevicesRoute).to(DevicesRoute);
container.bind<Route>(coreTYPES.RequestsRoute).to(RequestsRoute);
container.bind<Route>(coreTYPES.ConfirmationRoute).to(ConfirmationRoute);



