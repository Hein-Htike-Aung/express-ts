import { SessionDocument } from './../models/sessoin.model';
import config from 'config';
import { LeanDocument, FilterQuery, UpdateQuery } from 'mongoose';
import Session from '../models/sessoin.model';
import { UserDocument } from '../models/user.model';
import { get } from 'lodash';
import { findUser } from './user.service';
import { decode, sign } from '../../utils/jwt.utils';

export const createSession = async (userId: string, userAgent: string) => {
	const session = await Session.create({ user: userId, userAgent });

	return session.toJSON();
};

export const createAccessToken = ({ user, session }: any) => {
	const accessToken = sign(
		{ ...user, session: session._id },
		{
			expiresIn: config.get('accessTokenTtl'),
		},
	);

	return accessToken;
};

export const reIssueAccessToken = async ({
	refreshToken,
}: {
	refreshToken: string;
}) => {
	// Decode the refresh token
	const { decoded } = decode(refreshToken);

	// get(decoded, '_id') = decoded._id
	if (!decoded || !get(decoded, '_id')) return false;

	// Get the session in the refresh token
	const session = await Session.findById(get(decoded, '_id'));

	// Make sure the session is still valid
	if (!session || !session?.valid) return false;

	const user = await findUser({ _id: session.user });

	if (!user) return false;

	const accessToken = createAccessToken({ user, session });

	return accessToken;
};

export async function updateSession(
	query: FilterQuery<SessionDocument>,
	update: UpdateQuery<SessionDocument>,
) {
	return Session.updateOne(query, update);
}

export const findSessions = (query: FilterQuery<SessionDocument>) => {
	return Session.find(query).lean();
};
