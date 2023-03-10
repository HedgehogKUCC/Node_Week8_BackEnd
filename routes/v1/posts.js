"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const handleErrorAsync_1 = __importDefault(require("../../utils/handleErrorAsync"));
const PostController_1 = __importDefault(require("../../controllers/PostController"));
const isAuth_1 = __importDefault(require("../../middlewares/isAuth"));
router
    .route('/')
    .get(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '取得所有貼文'
  #swagger.path = '/api/posts'
  #swagger.responses[200] = {
    description: '成功取得所有貼文',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/GetPostsSuccess' }
      }
    }
  }
*/
PostController_1.default.getPosts))
    .post(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '新增貼文'
  #swagger.path = '/api/posts'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/AddPost" }
      }
    }
  }
  #swagger.responses[201] = {
    description: '成功新增貼文',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/AddPostSuccess' }
      }
    }
  }
*/
PostController_1.default.insertPost))
    .delete(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '刪除所有貼文'
  #swagger.path = '/api/posts'
  #swagger.responses[200] = {
    description: '成功刪除所有貼文',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/ResponseSuccessMsg' }
      }
    }
  }
*/
PostController_1.default.delAllPosts));
router
    .route('/:postID')
    .get(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '取得單一貼文'
  #swagger.responses[201] = {
    description: '成功取得單一貼文',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/AddPostSuccess' }
      }
    }
  }
*/
PostController_1.default.getSinglePost))
    .patch(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '更新貼文'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/AddPost" }
      }
    }
  }
  #swagger.responses[200] = {
    description: '成功更新貼文',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/AddPostSuccess' }
      }
    }
  }
*/
PostController_1.default.updatePostContent))
    .delete(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '刪除單筆貼文'
  #swagger.responses[200] = {
    description: '成功刪除單筆貼文',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/ResponseSuccessMsg' }
      }
    }
  }
*/
PostController_1.default.delSinglePost));
router
    .route('/user/:userID')
    .get(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '取得會員所有貼文'
  #swagger.responses[200] = {
    description: '成功取得會員所有貼文',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/GetPostsSuccess' }
      }
    }
  }
*/
PostController_1.default.getUserPosts));
router
    .route('/:postID/like')
    .post(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '新增一則貼文的讚'
  #swagger.responses[200] = {
    description: '成功新增一則貼文的讚',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/AddPostSuccess' }
      }
    }
  }
*/
PostController_1.default.clickPostLike));
router
    .route('/:postID/unlike')
    .delete(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '取消一則貼文的讚'
  #swagger.responses[200] = {
    description: '成功取消一則貼文的讚',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/AddPostSuccess' }
      }
    }
  }
*/
PostController_1.default.cancelPostLike));
router
    .route('/:postID/comments')
    .get(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '取得單筆貼文所有留言'
  #swagger.responses[200] = {
    description: '成功取得單筆貼文所有留言',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/GetPostWithComments' }
      }
    }
  }
*/
PostController_1.default.getAllComments));
router
    .route('/:postID/comment')
    .post(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Posts']
  #swagger.summary = '新增一則貼文的留言'
  #swagger.responses[201] = {
    description: '成功新增一則貼文的留言',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/ResponseSuccessMsg' }
      }
    }
  }
*/
PostController_1.default.insertComment));
exports.default = router;
