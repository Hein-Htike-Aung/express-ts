import { UserDocument } from './../models/user.model';
import { Request, Response } from 'express';
import config from 'config';
import { sign } from '../../utils/jwt.utils';
import { SessionDocument } from '../models/sessoin.model';
import { get } from 'lodash';
import { updateSession, validatePassword } from '../services/user.service';
import { createAccessToken, createSession, findSessions } from '../services/sesson.service';

export const createUserSessionHandler = async (req: Request, res: Response) => {
	// validate the email and password
	const user = await validatePassword(req.body);

	if (!user) {
		return res.status(401).send('Invalid username or password');
	}

	// Create a session
	const session = await createSession(user._id, req.get('user-agent') || '');

	// create access token
	const accessToken = createAccessToken({ user, session });

	// create refresh token
	const refreshToken = sign(session, {
		expiresIn: config.get('refreshTokenTtl'),
	});

	// send refresh & access token back
	return res.send({ accessToken, refreshToken });
};

export const invalidateUserSessionHandler = async (
	req: Request,
	res: Response,
) => {
	const sessionId = get(req, 'user.session');

	await updateSession({ _id: sessionId }, { valid: false });

	return res.sendStatus(200);
};

export const getUserSessionsHandler = async (req: Request, res: Response) => {
	const userId = get(req, 'user._id');

	const sessions = await findSessions({ user: userId, valid: true });

	return res.send(sessions);
};
