import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BaseController from '../BaseController';
import ApiError from '../../abstractions/ApiError';
import { RouteDefinition } from '../../types/RouteDefinition';
import { ProfileService } from './ProfileService';
import { Roles } from '../../types';
import Profile, { ProfileAttributes } from '../../database/models/Profile';
import { auth, isAdmin } from '../../middleware/auth';
import { Api } from '../../types/types';
import { validationResult } from 'express-validator';
import { updateProfileValidation } from '../../helpers/validations/profile.validation';


const defaultRole = Roles.guest;

/**
 * profiles controller
 */
export default class ProfileController extends BaseController {
	private profile: ProfileService;
	public basePath = 'profiles';

	constructor() {
		super();
		this.profile = new ProfileService();
	}

	/**
	 * The routes method returns an array of route definitions for CRUD operations
	 * (GET, POST, PUT, DELETE) on enquiries,
	 * with corresponding handlers bound to the controller instance.
	 */
	public routes(): RouteDefinition[] {
		return [
			{
				path: '/',
				method: 'get',
				handler: this.getProfiles.bind(this),
				middlewares: [auth, isAdmin],
			},
			{
				path: '/details',
				method: 'get',
				handler: this.getProfile.bind(this),
				middlewares: [auth],
			},
			{
				path: '/userid/:id',
				method: 'get',
				handler: this.getProfileByUserId.bind(this),
				middlewares: [auth],
			},
			{
				path: '/',
				method: 'post',
				handler: this.createProfile.bind(this),
				middlewares: [auth],
			},
			{
				path: '/:id',
				method: 'put',
				handler: this.updateProfile.bind(this),
				middlewares: [auth, ...updateProfileValidation],
			},
			{
				path: '/:id',
				method: 'delete',
				handler: this.delete.bind(this),
				middlewares: [auth, isAdmin],
			},
			{
				path: '/:id/deactivate',
				method: 'delete',
				handler: this.delete.bind(this),
				middlewares: [auth],
			},
		];
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getProfiles(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const profiles: ProfileAttributes[] = await this.profile.getAll();
			res.locals.data = profiles;
			this.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getProfile(
		req: Api.Req,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user_id } = req.user;
			const profile: ProfileAttributes =
				await this.profile.getByUserId(user_id);
			if (!profile) {
				throw new ApiError('Profile not found', 404, 'not_found');
			}
			res.locals.data = profile;
			this.send(res);
		} catch (err) {
			next(err);
		}
	}
	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getProfileByUserId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const userId = req.params.id;

			const profile: ProfileAttributes =
				await this.profile.getByUserId(userId);
			res.locals.data = profile;
			// call base class method
			this.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async updateProfile(
		req: Api.Req,
		res: Response,
		next: NextFunction,
	): Promise<any> {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const id = req.params.id;
			const { body } = req;
			console.log('🚀 ~ ProfileController ~ body:', body);

			const existingProfile: ProfileAttributes | null =
				await Profile.findByPk(id);

			if (!existingProfile) {
				throw new ApiError('Profile not found', 404, 'not_found');
			}

			if (req.user.user_id !== existingProfile.userId) {
				throw new ApiError('Unauthorized access', 403, 'unauthorized');
			}

			const updatedProfile = await this.profile.update(
				existingProfile.id,
				body,
			);

			res.locals.data = {
				profile: updatedProfile,
			};
			this.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async createProfile(
		req: Api.Req,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { email, user_id } = req.user;
			const {
				role,
				name,
				lang,
				defaultCurrency,
				trialStartDate,
				trialEndDate,
				isOnboard,
			} = req.body;
			const userRole = role !== null ? role : defaultRole;
			const userName = name !== null ? name : 'default name';
			if (!email && !user_id) {
				throw new ApiError(
					ReasonPhrases.BAD_REQUEST + ' missing fields',
					StatusCodes.BAD_REQUEST,
				);
			}
			const existingProfile = await this.profile.getByUserId(user_id);

			if (existingProfile) {
				res.locals.data = {
					profile: existingProfile,
				};
			} else {
				const profile: ProfileAttributes = await this.profile.create({
					name: userName,
					email,
					userId: user_id,
					role: userRole,
					lang,
					defaultCurrency,
					trialStartDate,
					trialEndDate,
					isOnboard,
				});
				res.locals.data = {
					profile,
				};
			}

			super.send(res, StatusCodes.CREATED);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async delete(
		req: Api.Req,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;

			const existingProfile: ProfileAttributes | null =
				await Profile.findOne({ where: { userId: id } });

			if (!existingProfile) {
				throw new ApiError('Profile not found', 404, 'not_found');
			}
			if (
				req.user.user_id !== existingProfile.userId &&
				req.user.role !== Roles.admin
			) {
				throw new ApiError('Unauthorized access', 403, 'unauthorized');
			}

			await this.cleanupRelatedData(existingProfile.id);

			const status: boolean = await this.profile.delete(
				existingProfile.id,
			);
			res.locals.data = {
				status,
			};
			this.send(res);
		} catch (err) {
			next(err);
		}
	}

	public async softDelete(
		req: Api.Req,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;

			// Find the profile using userId
			const existingProfile: ProfileAttributes | null =
				await Profile.findOne({
					where: { userId: id },
				});

			// Check if the profile exists
			if (!existingProfile) {
				throw new ApiError('Profile not found', 404, 'not_found');
			}

			// Check for authorization: only the user or an admin can deactivate
			if (
				req.user.user_id !== existingProfile.userId &&
				req.user.role !== Roles.admin
			) {
				throw new ApiError('Unauthorized access', 403, 'unauthorized');
			}

			// Update the profile to set isDeactivated to true (soft delete)
			await Profile.update(
				{ isDeactivated: true },
				{ where: { id: existingProfile.id } },
			);

			// Optionally, you can also cleanup related data if needed lets keep the data for moment
			// await this.cleanupRelatedData(existingProfile.id);

			// Send response indicating success
			res.locals.data = {
				status: true,
				message: 'Profile deactivated successfully',
			};
			this.send(res);
		} catch (err) {
			next(err);
		}
	}

	private async cleanupRelatedData(userId: string): Promise<void> {
		// await Account.destroy({ where: { profileId: userId } });
	}
}
