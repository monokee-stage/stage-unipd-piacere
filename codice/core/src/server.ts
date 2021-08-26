import express, { Express } from 'express';
import { Route } from './routes/route';

export default class Server {
	app: Express
	port: number
	host: string

	constructor(app_init?: {
		port: number,
		host: string
	}) {
		this.app = express();
		this.port = (app_init !== undefined ? app_init.port : undefined) || parseInt(process.env.SERVER_PORT || '3001')
		this.host = (app_init !== undefined ? app_init.host : undefined) || process.env.SERVER_HOST || 'localhost'

		// reads the json data of the requests and puts it in the req.body object
		this.app.use(express.json());
	}

	listen() {
		this.app.listen(this.port, this.host, () => {
			console.log(`listening on http://${this.host}:${this.port}`);
		})
	}

	loadRoute(route: Route) {
		this.app.use('/', route.router);
	}

	loadMiddleware(middleware: any, url?: string, method?: string) {
		if (!url) {
			this.app.use(middleware);
		} else {
			switch (method) {
				case 'GET':
					this.app.get(url, middleware)
					break
				case 'POST':
					this.app.post(url, middleware)
					break
				case 'PUT':
					this.app.put(url, middleware)
					break
				case 'PATCH':
					this.app.patch(url, middleware)
					break
				case 'DELETE':
					this.app.delete(url, middleware)
					break
				default:
					this.app.use(url, middleware)
					break
			}
		}
	}

}