import { existsSync, mkdirSync } from 'fs';
import { Logger } from 'winston';
import winston = require('winston');

const logDir = './logs';

if (!existsSync(logDir)) {
	mkdirSync(logDir);
}
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level}]: ${message}`;
});

const logger: Logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.colorize(),
		logFormat,
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: `${logDir}/combined.log` }),
	],
});

export default logger;
