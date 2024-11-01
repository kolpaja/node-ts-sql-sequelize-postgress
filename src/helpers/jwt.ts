import { jwtConfig } from '../config/jwt.config';
import logger from '../lib/logger';
import { JwtPayloadRes } from '../types';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const sign = (
	payload: any,
	options = { expiresIn: jwtConfig.expiry + 'h' },
) => {
	return jwt.sign(payload, jwtConfig.secret, options);
};

export const verify = (token: string) => {
	try {
		const decoded = jwt.verify(token, jwtConfig.secret);
		return { valid: true, expired: false, decoded };
	} catch (error) {
		logger.error(error);
		let msg;
		if (error instanceof Error) {
			msg = error.message;
		} else {
			msg = error;
		}
		return {
			valid: false,
			expired: msg === 'jwt expired',
			msg: msg,
			decoded: null as null,
		};
	}
};

export const decodeToken = (
	token: string,
): JwtPayload | JwtPayloadRes | null => {
	try {
		const decoded = jwt.decode(token);
		return decoded as JwtPayloadRes;
	} catch (error) {
		logger.error(error);
		return null;
	}
};
