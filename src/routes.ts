import { Router } from 'express';
import ExtraController from './components/extra/ExtraController';
import ProfileController from './components/profile/ProfileController';
import SystemStatusController from './components/system-status/SystemStatusController';
import TransactionController from './components/transactions/TransactionController';
import logger from './lib/logger';
import { RouteDefinition } from './types/RouteDefinition';
import AccountController from './components/account/AccountController';
import CategoryController from './components/category/CategoryController';
import PersonController from './components/person/PersonController';
import StatsController from './components/stats/StatsController';

/**
 *
 * The registerControllerRoutes function creates an Express Router instance and
 * maps route definitions to corresponding HTTP methods
 * such as GET, POST, PUT, PATCH, and DELETE, with their respective handlers.
 * It then returns the configured router.
 * @param routes
 * @returns
 */

function registerControllerRoutes(routes: RouteDefinition[]): Router {
	const controllerRouter = Router();
	routes.forEach((route) => {
		const middlewares = route.middlewares || [];
		switch (route.method) {
			case 'get':
				controllerRouter.get(route.path, ...middlewares, route.handler);
				break;
			case 'post':
				controllerRouter.post(
					route.path,
					...middlewares,
					route.handler,
				);
				break;
			case 'put':
				controllerRouter.put(route.path, ...middlewares, route.handler);
				break;
			case 'patch':
				controllerRouter.put(route.path, ...middlewares, route.handler);
				break;
			case 'delete':
				controllerRouter.delete(
					route.path,
					...middlewares,
					route.handler,
				);
				break;
			default:
				throw new Error(`Unsupported HTTP method: ${route.method}`);
		}
	});
	return controllerRouter;
}

/**
 * Here, you can register routes by instantiating the controller.
 *
 */
export default function registerRoutes(): Router {
	try {
		const router = Router();

		// Define an array of controller objects
		const controllers = [
			new SystemStatusController(),
			new ProfileController(),
			new TransactionController(),
			new ExtraController(),
			new AccountController(),
			new CategoryController(),
			new PersonController(),
			new StatsController(),
		];

		// Dynamically register routes for each controller
		controllers.forEach((controller) => {
			// make sure each controller has basePath attribute and routes() method
			router.use(
				`/v1/${controller.basePath}`,
				registerControllerRoutes(controller.routes()),
			);
		});

		return router;
	} catch (error) {
		logger.error('Unable to register the routes:', error);
	}
}
