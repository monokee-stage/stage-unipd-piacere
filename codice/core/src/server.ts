import express, {Express} from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import {Route} from './routes/route';

import {
	Repository,
	Metadata,
	MetadataRepository,
	RedisMetadataRepository
} from 'repositories';

export default class Server {
	app: Express
	port: number
	host: string

	constructor(app_init: {
		port: number,
		host: string
	}) {
		this.app = express();
		this.port = app_init.port;
		this.host = app_init.host;
	}

	listen() {
		this.app.listen(this.port, this.host, () => {
			console.log(`listening on http://${this.host}:${this.port}`);
			// console.log('http://localhost:8000');
		})
	}

	loadRoute(route: Route) {
		this.app.use('/', route.router);
	}

	loadMiddleware(middleware: any){
		this.app.use(middleware);
	}

}