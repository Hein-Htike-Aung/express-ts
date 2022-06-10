import bcrypt from 'bcrypt';
import config from 'config';
import mongoose from 'mongoose';

/* Use For Ts Type (not necessary in js)  */
export interface UserDocument extends mongoose.Document {
	email: string;
	name: string;
	password: string;
	createAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

/* Mongoose Schema */
const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		password: { type: String, required: true },
	},
	{ timestamps: true },
);

/* Schema Pre (must not be arrwow function) */
UserSchema.pre(
	'save',
	async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
		let user = this as UserDocument;

		// only hash the password if it has been modified (or is new)
		if (!user.isModified('password')) return next();

		// Random additional data
		const salt = await bcrypt.genSalt(config.get('saltWorkFactor'));

		const hash = await bcrypt.hashSync(user.password, salt);

		// Replace the password with hash
		user.password = hash;

		return next();
	},
);

/* Schema methods (must not be arrwow function) */
UserSchema.methods.comparePassword = async function (
	candidatePassword: string,
) {
	const user = this as unknown as UserDocument;

	return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
