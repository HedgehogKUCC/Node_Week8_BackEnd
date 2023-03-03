import { Router } from 'express';
const router = Router();

import handleErrorAsync from '../utils/handleErrorAsync';

import UserController from '../controllers/UserController';

import isAuth from '../middlewares/isAuth';

router.post('/sign_up', handleErrorAsync(UserController.insertUser));
router.post('/sign_in', handleErrorAsync(UserController.searchUserLogin));
router.patch('/updatePassword', isAuth, handleErrorAsync(UserController.updateUserPassword));
router.get('/profile', isAuth, handleErrorAsync(UserController.getUser));
router.patch('/profile', isAuth, handleErrorAsync(UserController.updateUserInfo));
router.get('/getLikeList', isAuth, handleErrorAsync(UserController.getUserLikePostList));
router.post('/:userID/follow', isAuth, handleErrorAsync(UserController.followUser));
router.delete('/:userID/unfollow', isAuth, handleErrorAsync(UserController.cancelFollowUser));
router.get('/following', isAuth, handleErrorAsync(UserController.getUserFollowing));

export default router;
