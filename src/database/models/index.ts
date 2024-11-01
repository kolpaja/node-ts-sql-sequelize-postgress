/* eslint-disable @typescript-eslint/no-var-requires */
import { Sequelize, ModelCtor, Model } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
import config from '../config/config.json'; // Adjust the import path if necessary
const envConfig = config[env];
console.log('🚀 ~ envConfig:', envConfig);

interface DbInterface {
	sequelize: Sequelize;
	Sequelize: typeof Sequelize;
	[key: string]: ModelCtor<Model> | Sequelize | typeof Sequelize;
}

export interface AssociableModel extends ModelCtor<Model> {
	associate?: (db: DbInterface) => void;
}

const db: DbInterface = {
	sequelize: undefined as any,
	Sequelize: Sequelize,
};

// eslint-disable-next-line prefer-const
let sequelize: Sequelize;

// eslint-disable-next-line prefer-const
sequelize = new Sequelize(
	envConfig.database,
	envConfig.username,
	envConfig.password,
	envConfig,
);

const init = async () => {
	await fs
		.readdirSync(__dirname)
		.filter((file) => {
			return (
				file.indexOf('.') !== 0 &&
				file !== basename &&
				file.slice(-3) === '.ts' &&
				file.indexOf('.test.js') === -1
			);
		})
		.forEach(async (file) => {
			const modelPath = require(path.join(__dirname, file));
			const initModel = modelPath.default.initModel;
			const model = initModel(sequelize);
			db[model.name] = model;
		});
};

init();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
