import { Express } from 'express';
import requiresUser from '../middleware/requiresUser';
import validateRequest from '../middleware/validateRequest';
import {
	createPostHandler,
	deletePostHandler,
	getAllPostHandler,
	getLoggedInUserPostsHandler,
	getPostByIdHandler,
	updatePostHandler,
} from './controllers/post.controller';
import {
	createPostSchema,
	deletePostSchema,
	updatePostSchema,
} from './schema/post.schema';

export const postRoute = (app: Express) => {
	/* Create Post */
	app.post(
		'/api/posts',
		[requiresUser, validateRequest(createPostSchema)],
		createPostHandler,
	);

	/* Update Post */
	app.patch(
		'/api/posts/:postId',
		[requiresUser, validateRequest(updatePostSchema)],
		updatePostHandler,
	);

	/* Delete post */
	app.delete(
		'/api/posts/:postId',
		[requiresUser, validateRequest(deletePostSchema)],
		deletePostHandler,
	);

	/* Get post by id */
	app.get('/api/posts/:postId', getPostByIdHandler);

	/* Get All Posts */
	app.get('/api/posts', getAllPostHandler);

	/* Get Logged in User's Post */
	app.get('/api/user-posts', requiresUser, getLoggedInUserPostsHandler);
};
