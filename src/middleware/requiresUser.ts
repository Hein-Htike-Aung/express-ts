import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';

const requiresUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
    // Extract user from request
	const user = get(req, 'user');

	if (!user) {
		return res.sendStatus(403);
	}

	return next();
};

export default requiresUser;
