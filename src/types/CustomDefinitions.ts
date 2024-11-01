import { NextFunction, Request, Response } from 'express';

export interface customRequest extends Request {
	user: any;
}
