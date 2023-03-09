import { Router } from 'express';
const router = Router();

import handleErrorAsync from '../../utils/handleErrorAsync';
import PostController from '../../controllers/PostController';

import isAuth from '../../middlewares/isAuth';

router
  .route('/')
  .get(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '取得所有貼文'
      #swagger.path = '/api/posts'
    */
    PostController.getPosts))
  .post(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '新增貼文'
      #swagger.path = '/api/posts'
    */
    PostController.insertPost))
  .delete(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '刪除所有貼文'
      #swagger.path = '/api/posts'
    */
    PostController.delAllPosts));

router
  .route('/:postID')
  .get(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '取得單一貼文'
    */
    PostController.getSinglePost))
  .patch(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '更新貼文'
    */
    PostController.updatePostContent))
  .delete(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '刪除單筆貼文'
    */
    PostController.delSinglePost));

router
  .route('/user/:userID')
  .get(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '取得會員所有貼文'
    */
    PostController.getUserPosts));

router
  .route('/:postID/like')
  .post(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '新增一則貼文的讚'
    */
    PostController.clickPostLike));

router
  .route('/:postID/unlike')
  .delete(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '取消一則貼文的讚'
    */
    PostController.cancelPostLike));

router
  .route('/:postID/comments')
  .get(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '取得單筆貼文所有留言'
    */
    PostController.getAllComments));

router
  .route('/:postID/comment')
  .post(isAuth, handleErrorAsync(
    /*
      #swagger.tags = ['Posts']
      #swagger.summary = '新增一則貼文的留言'
    */
    PostController.insertComment));

export default router;
