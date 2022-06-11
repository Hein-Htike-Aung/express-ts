import { Request, Response } from 'express';
import { get } from 'lodash';
import {
	createPost, deletePost, findAndUpdate, findLoggedInUserPosts, findPost, findPosts
} from './../services/post.service';

export const createPostHandler = async (req: Request, res: Response) => {
	const userId = get(req, 'user._id');
	const body = req.body;

	const post = await createPost({ ...body, user: userId });

	return res.send(post);
};

export const updatePostHandler = async (req: Request, res: Response) => {
	const postId = get(req, 'params.postId');
	const update = req.body;
	const userId = get(req, 'user._id');

	const post = await findPost({ postId });

	if (!post) {
		return res.sendStatus(404);
	}

	if (String(post.user) !== userId) {
		return res.sendStatus(404);
	}

	const updatedPost = await findAndUpdate({ postId }, update, { new: true });

	return res.send(updatedPost);
};	

export const deletePostHandler = async (req: Request, res: Response) => {
	const postId = get(req, 'params.postId');
	const userId = get(req, 'user._id');

	const post = await findPost({ postId });

	if (!post) {
		return res.sendStatus(404);
	}

	if (String(post.user) !== userId) {
		return res.sendStatus(404);
	}

	await deletePost({ postId });

	return res.send(203);
};

export const getPostByIdHandler = async (req: Request, res: Response) => {
	const postId = get(req, 'params.postId');

	const post = await findPost({ postId });

	if (!post) {
		return res.sendStatus(404);
	}

	return res.send(post);
};

export const getAllPostHandler = async (req: Request, res: Response) => {
	const posts = await findPosts();

	return res.send(posts);
};

export const getLoggedInUserPostsHandler = async (
	req: Request,
	res: Response,
) => {
	const userId = get(req, 'user._id');

	const posts = await findLoggedInUserPosts({ user: userId });

	return res.send(posts);
};
