import {Router} from 'express';

import {injectable, inject} from 'inversify';

@injectable()
export class Route {
	basePath!: string
	router!: Router
}