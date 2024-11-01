import { get } from 'lodash';
import { Response, NextFunction } from 'express';
import { verify } from '../helpers/jwt';
import { customRequest } from '../types/CustomDefinitions';

const deserializeUser = async (
	req: customRequest,
	res: Response,
	next: NextFunction,
) => {
	const bearerToken = get(req, 'headers.authorization');
	let token = bearerToken;
	if (bearerToken && bearerToken.startsWith('Bearer ')) {
		token = bearerToken.substring(7);
	}
	if (!token) return next();

	const { decoded, expired, valid, msg: errorMsg } = verify(token);

	if (valid && !expired) {
		req.user = decoded;
		return next();
	} else {
		return res.status(403).json({
			error: true,
			errorMsg: errorMsg,
		});
	}
};

export default deserializeUser;
