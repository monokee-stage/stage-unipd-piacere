import 'reflect-metadata';

import {Route} from '../route';
import {Router, Request, Response, NextFunction} from 'express';

import {
	DeviceRepository,
	EventRepository,
	Transaction,
	TransactionRepository,
	Event
} from 'repositories';

import {TYPES} from 'repositories';

import {injectable, inject} from 'inversify';
import { RedisTransactionRepository } from 'repositories';
import { UUIDGenerator } from '../../services/uuid-generator/uuid-generator';
import { RandomCodeGenerator } from '../../services/random-code-generator/random-code-generator';
import { Hasher } from '../../services/hasher/hasher';
import { Notifier } from '../../services/notifier/notifier';
import { NotificationData } from '../../services/notifier/notification.data';
import { GeoConverter } from '../../services/geo-converter/geo-converter';
import { coreTYPES } from '../../types';

@injectable()
export class RequestsRoute extends Route {
	constructor(
		@inject(TYPES.TransactionRepository) private transactionRepo: TransactionRepository,
		@inject(TYPES.EventRepository) private eventsRepo: EventRepository,
		@inject(TYPES.DeviceRepository) private devicesRepo: DeviceRepository,
		@inject(UUIDGenerator) private uuidGen: UUIDGenerator,
		@inject(RandomCodeGenerator) private rcGen: RandomCodeGenerator,
		@inject(Hasher) private hasher: Hasher,
		@inject(Notifier) private notifier: Notifier,
		@inject(coreTYPES.GeoConverter) private geoConv: GeoConverter) {
		super();
		this.basePath = '/user/:user_id';
		this.router = Router();

		this.router.post(this.basePath + '/target/:target_id', this.requestConfirmation);
		this.router.get(this.basePath + '/operation/:operation_id', this.getStatus);
	}

	/*export class Transaction {
    _id!: string
    user_id!: string
    requester_id!: string
    request_timestamp!: string
    confirmation_code!: string
    status!: string
    ttl!: number
    coordinates?: {
        lat: number
        long: number
    }
    location?: string
    extra_info?: any
}*/

	// maybe it'd be better to send a response to the requester before the end of the operations
	private requestConfirmation = async (req: Request, res: Response, next: NextFunction) => {
		var requester_id = req.params.user_id
		var target_id = req.params.target_id
		var data = req.body

		// generate confirmation code and hash it
		var confCode = this.rcGen.getCode()
		var hashedConfCode = this.hasher.hashText(confCode)
		
		var promisesToExecute = []

		var p1: Promise<any> =  this.devicesRepo.getDevices(target_id).then( (devs): string[] => {
			let tokens: string[] = []
			devs.forEach((item) => {
				tokens.push(item.registration_token)
			})
			return tokens
		})
		promisesToExecute.push(p1)

		if(data.coordinates){
			console.log(data.coordinates)
			var p2: Promise<any> = this.geoConv.getPlaceFromCoordinates(data.coordinates.lat, data.coordinates.lon)
			promisesToExecute.push(p2)
		}
		
		// get registration_tokens and convert coordinates to location
		var results = await Promise.all(promisesToExecute)
		console.log(results)
		var devices_tokens: string[] = results[0]
		var location = undefined;
		if(results.length > 1) {
			// results[1] is undefined if GeoConverter was unable to do the geocoding
			location = results[1]
		}
		
		// define the event
		var event: Event = {
			_id: this.uuidGen.getUUID(),
			user_id: req.params.target_id,
			type: 'request',
			timestamp: new Date as unknown as string,
		}
		if(data.coordinates){
			event.coordinates = data.coordinates
		}
		if(location){
			event.location = location
		}
		if(data.extra_info){
			event.extra_info = data.extra_info
		}

		// define the transaction
		var trans: Transaction = {
			_id: this.uuidGen.getUUID(),
			user_id: req.params.target_id,
			requester_id: req.params.user_id,
			request_timestamp: new Date() as unknown as string,
			confirmation_code: hashedConfCode,
			status: 'pending',
			ttl: 30
		}
		if(data.coordinates){
			trans.coordinates = data.coordinates
		}
		if(location){
			trans.location = location
		}
		if(data.extra_info){
			trans.extra_info = data.extra_info
		}
		
		// save event and transaction
		Promise.all([
			await this.eventsRepo.addEvent(event),
			await this.transactionRepo.addTransaction(trans)
		])
		
		// define notification data (what the device will get)
		var notifData: NotificationData = {
			transaction_id: trans._id,
			confirmation_code: confCode,
		}
		if(data.coordinates){
			notifData.coordinates = data.coordinates
		}
		if(location){
			notifData.location = location
		}
		if(data.extra_info){
			notifData.extra_info = data.extra_info
		}

		// send notification to the device
		await this.notifier.sendNotification(devices_tokens, notifData)

		// show result to the requester
		res.json({
			result: 'request sent successfully',
			transaction_id: trans._id	
		})
	};

	private getStatus = async (req: Request, res: Response, next: NextFunction) => {
		var trans_id: string = req.params.operation_id;
		var repo = new RedisTransactionRepository();
		var trans: Transaction = await repo.getTransaction(trans_id)
		if(Object.keys(trans).length === 0){
			return res.json({error: 'No transaction with that id'});	
		}
		return res.json({status: trans.status});

	};
}