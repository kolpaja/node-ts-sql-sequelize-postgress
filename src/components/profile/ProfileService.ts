import logger from '../../lib/logger';
import ApiError from '../../abstractions/ApiError';
import { StatusCodes } from 'http-status-codes';
import Profile, {
	ProfileAttributes,
	ProfileCreationAttributes,
} from '../../database/models/Profile';

export class ProfileService {
	async getAll(): Promise<ProfileAttributes[]> {
		try {
			const profiles = await Profile.findAll();
			if (!profiles) return [];
			return profiles;
			return [];
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getById(id: string | number): Promise<ProfileAttributes> {
		try {
			const profile = await Profile.findByPk(id);
			if (!profile) {
				throw new ApiError('Profile not found', StatusCodes.NOT_FOUND);
			}
			return profile;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
	async getByUserId(userId: string | number): Promise<ProfileAttributes> {
		try {
			const profile = await Profile.findOne({
				where: {
					userId,
				},
			});
			if (!profile) {
				return null;
			}
			return profile;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	// TODO this later on
	async update(
		id: string | number,
		payload: Partial<ProfileCreationAttributes>,
	): Promise<ProfileAttributes> {
		try {
			const profile = await Profile.findByPk(id);
			if (!profile) {
				throw new ApiError('Profile not found', StatusCodes.NOT_FOUND);
			}
			const updatedProfile = await profile.update(payload);
			return updatedProfile;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async create(
		payload: ProfileCreationAttributes,
	): Promise<ProfileAttributes> {
		try {
			const profile = await Profile.create(payload);
			return profile;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async delete(id: string | number): Promise<boolean> {
		try {
			const deletedProfileCount = await Profile.destroy({
				where: { id },
			});

			return !!deletedProfileCount;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	/**
	 * Count all profiles
	 */
	async count(): Promise<number> {
		try {
			const counts = await Profile.count();
			return counts;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
