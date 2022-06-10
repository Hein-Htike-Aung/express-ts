import mongoose from 'mongoose';
import { UserDocument } from './user.model';

/* Use For Ts Type (not necessary in js)  */
export interface SessionDocument extends mongoose.Document {
	user: UserDocument['_id'];
	valid: boolean;
	userAgent: string;
	createdAt: Date;
	updatedAt: Date;
}

/* Mongoose Schema */
const SessionSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		valid: { type: Boolean, default: true },
		userAgent: { type: String },
	},
	{ timestamps: true },
);

const Session = mongoose.model<SessionDocument>('Session', SessionSchema);

export default Session;
