import { config as dotenvConfig } from 'dotenv';
import { Dialect } from 'sequelize';

dotenvConfig();

interface DbConfig {
	username: string;
	password: string;
	database: string;
	host: string;
	dialect: Dialect;
}

type Config = Record<string, DbConfig>;

const config: Config = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: '127.0.0.1',
		dialect: 'postgres',
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: '127.0.0.1',
		dialect: 'postgres',
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: '127.0.0.1',
		dialect: 'postgres',
	},
};

export default config;
