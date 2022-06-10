import mongoose from 'mongoose';
import { UserDocument } from '../../user/models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid'

export interface PostDocument extends mongoose.Document {
	user: UserDocument['_id'];
	title: string;
	body: string;
	createdAt: Date;
	updatedAt: Date;
}

const PostSchema = new mongoose.Schema(
	{
		postId: {
			type: String,
			required: true,
			unique: true,
			default: () => uuidv4(),
			// default: () => nanoid(),
		},
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		title: { type: String, default: true },
		body: { type: String, default: true },
	},
	{ timestamps: true },
);

const Post = mongoose.model<PostDocument>('Post', PostSchema);

export default Post;
