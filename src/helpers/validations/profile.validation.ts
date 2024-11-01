import { NextFunction, Response, Request } from 'express';
import { check, validationResult } from 'express-validator';

export const updateProfileValidation = [
	check('name').optional().isString().isLength({ min: 1, max: 100 }),
	check('secondaryEmail').optional().isEmail().normalizeEmail(),
	check('country').optional().isString().isLength({ max: 100 }),
	check('trialStartDate').optional().isDate(),
	check('trialEndDate').optional().isDate(),
	check('role').optional().isString(),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];
