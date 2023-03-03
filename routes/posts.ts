const express = require('express');
const router = express.Router();

import handleErrorAsync from '../utils/handleErrorAsync';
import PostController from '../controllers/PostController';

import isAuth from '../middlewares/isAuth';

router.get('/', isAuth, handleErrorAsync(PostController.getPosts));
router.post('/', isAuth, handleErrorAsync(PostController.insertPost));
router.delete('/', isAuth, handleErrorAsync(PostController.delAllPosts));
router.delete('/:postID', isAuth, handleErrorAsync(PostController.delSinglePost));
router.patch('/:postID', isAuth, handleErrorAsync(PostController.updatePostContent));
router.get('/:postID', isAuth, handleErrorAsync(PostController.getSinglePost));
router.get('/user/:userID', isAuth, handleErrorAsync(PostController.getUserPosts));
router.post('/:postID/like', isAuth, handleErrorAsync(PostController.clickPostLike));
router.delete('/:postID/unlike', isAuth, handleErrorAsync(PostController.cancelPostLike));
router.post('/:postID/comment', isAuth, handleErrorAsync(PostController.insertComment));
router.get('/:postID/comments', isAuth, handleErrorAsync(PostController.getAllComments));

export default router;