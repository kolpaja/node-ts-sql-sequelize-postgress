import { JwtPayloadRes } from './index';
import { Request } from 'express';

export namespace Api {
	export interface Req extends Request {
		user?: JwtPayloadRes;
		profileId?: string;
		isOwner?: boolean;
	}
}
