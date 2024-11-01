import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import helmet from 'helmet';
import 'dotenv/config';
import database, { AssociableModel } from './database/models';
import registerRoutes from './routes';
import addErrorHandler from './middleware/error-handler';
import logger from './lib/logger';

export default class App {
	public expressApp: Application;
	public httpServer: http.Server;

	constructor() {
		this.expressApp = express(); // Initialize express in the constructor
		this.httpServer = http.createServer(this.expressApp); // Initialize httpServer in the constructor
	}

	public async init(): Promise<void> {
		await this.assertDatabaseConnection();
		this.middleware();
		this.routes();
		this.expressApp.use(addErrorHandler);
	}

	private routes(): void {
		this.expressApp.get('/', this.basePathRoute);
		this.expressApp.use('/api', registerRoutes());
		this.expressApp.get(
			'/web',
			this.parseRequestHeader,
			this.basePathRoute,
		);
	}

	private middleware(): void {
		this.expressApp.use(helmet({ contentSecurityPolicy: false }));
		this.expressApp.use(express.json({ limit: '100mb' }));
		this.expressApp.use(
			express.urlencoded({ limit: '100mb', extended: true }),
		);
		const corsOptions = { origin: '*' };
		this.expressApp.use(cors(corsOptions));
	}

	private parseRequestHeader(
		_req: Request,
		_res: Response,
		next: NextFunction,
	): void {
		next();
	}

	private basePathRoute(_request: Request, response: Response): void {
		response.json({ message: 'base path' });
	}

	private async assertDatabaseConnection(): Promise<void> {
		try {
			logger.info('start connecting to DB');
			await database.sequelize.sync();
			logger.info('Database SYNC successfully.');

			logger.info('Start model association:');
			await Object.keys(database).forEach((modelName) => {
				const model = database[modelName] as AssociableModel;
				if (model.associate) {
					model.associate(database);
				}
			});
			logger.info('Model association successfully');
			logger.info('Connection has been established successfully.');
		} catch (error) {
			console.log('🚀 ~ App ~ assertDatabaseConnection ~ error:', error);
			logger.error('Unable to connect to the database:', error);
		}
	}
}
