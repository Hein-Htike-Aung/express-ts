import { SessionDocument } from './../models/sessoin.model';
import User, { UserDocument } from './../models/user.model';
import { DocumentDefinition, FilterQuery, UpdateQuery } from 'mongoose';
import { omit } from 'lodash';

export const createUser = async (input: DocumentDefinition<UserDocument>) => {
	try {
		return await User.create(input);
	} catch (error) {
		throw new Error(error as any);
	}
};

/* 
By default, Mongoose queries return an instance of the Mongoose Document class. Documents are much heavier than vanilla JavaScript objects, because they have a lot of internal state for change tracking. Enabling the lean option tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO.
*/
export async function findUser(query: FilterQuery<UserDocument>) {
	return User.findOne(query).lean();
}

export const validateUser = async ({
	email,
	password,
}: {
	email: UserDocument['email'];
	password: string;
}) => {
	const user = await User.findOne({ email });

	if (!user) return false;

	const isValid = user.comparePassword(password);

	if (!isValid) return false;

	return omit(user.toJSON(), 'password');
};

