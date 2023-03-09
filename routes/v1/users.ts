import { Router } from 'express';
const router = Router();

import handleErrorAsync from '../../utils/handleErrorAsync';

import UserController from '../../controllers/UserController';

import isAuth from '../../middlewares/isAuth';

router
  .route('/sign_up')
  .post(handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '註冊'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: '#/definitions/SignUp' }
          }
        }
      }
      #swagger.responses[201] = {
        description: '註冊成功',
        content: {
          "application/json": {
            schema: { $ref: '#/definitions/SignUpSuccess' }
          }
        }
      }
      #swagger.security = null
    */
    UserController.insertUser));

router
  .route('/sign_in')
  .post(handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '登入'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/definitions/SignIn" }
          }
        }
      }
      #swagger.responses[200] = {
        description: '登入成功',
        content: {
          "application/json": {
            schema: { $ref: '#/definitions/SignInSuccess' }
          }
        }
      }
      #swagger.security = null
    */
    UserController.searchUserLogin));

router
  .route('/updatePassword')
  .patch(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '重設密碼'
    */
    UserController.updateUserPassword));

router
  .route('/profile')
  .get(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '取得個人資料'
    */
    UserController.getUser))
  .patch(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '更新個人資料'
    */
    UserController.updateUserInfo));

router
  .route('/getLikeList')
  .get(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '取得按讚列表'
    */
    UserController.getUserLikePostList));

router
  .route('/:userID/follow')
  .post(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '追蹤其它會員'
    */
    UserController.followUser));

router
  .route('/:userID/unfollow')
  .delete(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '取消追蹤其它會員'
    */
    UserController.cancelFollowUser));

router
  .route('/following')
  .get(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Users']
      #swagger.summary = '取得追蹤列表'
    */
    UserController.getUserFollowing));

export default router;
