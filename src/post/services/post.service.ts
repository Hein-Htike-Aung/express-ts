import Post, { PostDocument } from '../models/post.model';
import {
	DocumentDefinition,
	FilterQuery,
	QueryOptions,
	UpdateQuery,
} from 'mongoose';
import Session, { SessionDocument } from '../../user/models/sessoin.model';

export const createPost = async (input: DocumentDefinition<PostDocument>) => {
	return Post.create(input);
};

export const findPost = (
	query: FilterQuery<PostDocument>,
	options: QueryOptions = { lean: true },
) => {
	return Post.findOne(query, {}, options);
};

export const findAndUpdate = (
	query: FilterQuery<PostDocument>,
	update: UpdateQuery<PostDocument>,
	options: QueryOptions,
) => {
	return Post.findOneAndUpdate(query, update, options);
};

export const deletePost = (query: FilterQuery<PostDocument>) => {
	return Post.deleteOne(query);
};

export const findPosts = () => {
	return Post.find().lean();
};

export const findLoggedInUserPosts = (query: FilterQuery<SessionDocument>) => {
	return Session.find(query).lean();
};
