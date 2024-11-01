import ApiError from '../abstractions/ApiError';
import { decodeToken } from '../helpers/jwt';
import { NextFunction, Response } from 'express';
import { Api } from '../types/types';
import 'dotenv/config';
import { Roles } from '../types';
import Profile from '../database/models/Profile';

export const auth = async (req: Api.Req, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			throw new ApiError(
				'Missing authorization header',
				401,
				'unauthorized',
			);
		}

		const token = authHeader.split('Bearer ')[1];
		if (!token) {
			throw new ApiError('Missing token', 401, 'unauthorized');
		}

		const decodedToken = await decodeToken(token);
		// console.log(
		// 	'decodedToken.exp * 1000 < Date.now()',
		// 	decodedToken.exp * 1000 < Date.now(),
		// );
		// Check if the token is expired since it expiries every 1 h
		// if (decodedToken.exp * 1000 < Date.now()) {
		// 	// exp is in seconds, convert to milliseconds
		// 	throw new ApiError('Token has expired', 401, 'unauthorized');
		// }
		if (decodedToken.aud !== process.env.FIREBASE_AUD) {
			throw new ApiError(
				'Missing firebase token aud',
				401,
				'unauthorized',
			);
		}

		req.user = decodedToken;
		next();
	} catch (error) {
		next(error);
	}
};

export const isAdmin = (req: Api.Req, res: Response, next: NextFunction) => {
	try {
		if (!req.user || req.user.role !== Roles.admin) {
			throw new ApiError('Admin access required', 403, 'forbidden');
		}
		next();
	} catch (error) {
		next(error);
	}
};

export const isUserRole = (req: Api.Req, res: Response, next: NextFunction) => {
	try {
		if (!req.user || req.user.role !== Roles.user) {
			throw new ApiError('User access required', 403, 'forbidden');
		}
		next();
	} catch (error) {
		next(error);
	}
};

export const isGuestRole = (
	req: Api.Req,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user || req.user.role !== Roles.guest) {
			throw new ApiError('Guest access required', 403, 'forbidden');
		}
		next();
	} catch (error) {
		next(error);
	}
};
export const attachProfile = async (
	req: Api.Req,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user_id } = req.user;

		// Find the profile using the userId from the decoded token
		const profile = await Profile.findOne({
			where: { userId: user_id },
		});

		// If no profile is found, throw an error
		if (!profile) {
			throw new ApiError('Profile not found', 404, 'not_found');
		}

		req.profileId = profile.id;

		next();
	} catch (error) {
		next(error);
	}
};
