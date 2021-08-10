import {Router} from 'express';

import {injectable, inject} from 'inversify';

@injectable()
export abstract class Route {
	basePath!: string
	router!: Router
}