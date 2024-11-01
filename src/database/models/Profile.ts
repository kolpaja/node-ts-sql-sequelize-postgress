import { DataTypes, Model, Optional, Sequelize, UUIDV4 } from 'sequelize';
import { Roles } from '../../types';

export interface ProfileAttributes {
	id: string;
	email?: string;
	name: string;
	country?: string;
	lang: string;
	defaultCurrency: string;
	isOnboard?: boolean;
	role?: Roles;
	trialStartDate?: Date;
	trialEndDate?: Date;
	secondaryEmail?: string;
	isDeactivated: boolean;
	userId: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export type ProfileCreationAttributes = Optional<
	ProfileAttributes,
	'id' | 'defaultCurrency' | 'lang' | 'isDeactivated'
>;

class Profile
	extends Model<ProfileAttributes, ProfileCreationAttributes>
	implements ProfileAttributes
{
	public id!: string;
	public name!: string;
	public email: string;
	public userId!: string;
	public role!: Roles;
	public country: string;
	public lang!: string;
	public defaultCurrency!: string;
	public isDeactivated!: boolean;
	public isOnboard!: boolean;

	public createdAt!: Date;
	public updatedAt!: Date;
	public trialStartDate!: Date;
	public trialEndDate!: Date;

	static associate(models) {
	// here goes the associates
	}

	static initModel(sequelize: Sequelize) {
		return Profile.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: UUIDV4,
					primaryKey: true,
				},
				name: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				lang: {
					type: DataTypes.STRING(3),
					allowNull: false,
					defaultValue: 'en',
				},
				defaultCurrency: {
					type: DataTypes.STRING(3),
					allowNull: false,
					defaultValue: 'EUR',
				},
				country: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				userId: {
					type: DataTypes.STRING(100),
					allowNull: false,
					unique: true,
				},
				email: {
					type: DataTypes.STRING(100),
					allowNull: false,
					unique: true,
				},
				isDeactivated: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
					defaultValue: false,
				},
				isOnboard: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
					defaultValue: false,
				},
				secondaryEmail: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				role: {
					type: DataTypes.STRING(50),
					defaultValue: Roles.guest,
					allowNull: false,
				},
				trialStartDate: {
					type: DataTypes.DATE,
					allowNull: true,
				},
				trialEndDate: {
					type: DataTypes.DATE,
					allowNull: true,
				},
				createdAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.fn('NOW'),
				},
				updatedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.fn('NOW'),
				},
			},
			{
				sequelize,
				modelName: 'Profile',
				tableName: 'profile',
				timestamps: true,
			},
		);
	}
}

export default Profile;
