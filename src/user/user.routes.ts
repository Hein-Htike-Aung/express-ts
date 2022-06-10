import {
	createUserSchema,
	createUserSessionSchema,
} from './schema/user.schema';
import { createUserHandler } from './controllers/user.controller';
import { Express, Request, Response } from 'express';
import validateRequest from '../middleware/validateRequest';
import {
	createUserSessionHandler,
	getUserSessionsHandler,
	invalidateUserSessionHandler,
} from './controllers/session.controller';
import requiresUser from '../middleware/requiresUser';

export const userRoute = (app: Express) => {
	/* Register User */
	app.post('/api/users', validateRequest(createUserSchema), createUserHandler);

	/* Login */
	app.post(
		'/api/sessions',
		validateRequest(createUserSessionSchema),
		createUserSessionHandler,
	);

	/* Get the user's sessions */
	app.get('/api/sessions', requiresUser, getUserSessionsHandler);

	/* Logout */
	app.delete('/api/sessions', requiresUser, invalidateUserSessionHandler);
};
