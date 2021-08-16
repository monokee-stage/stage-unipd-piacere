import express, {Express} from 'express';
import {Route} from './routes/route';

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

		// reads the json data of the requests and puts it in the req.body object
		this.app.use(express.json());
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

	// to be expanded by adding a url and a method parameter
	loadMiddleware(middleware: any, url?: string, method?: string){
		if(!url || !method) {
			this.app.use(middleware);
		}else{
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
			}
		}
		
	}

}