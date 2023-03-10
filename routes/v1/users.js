"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const handleErrorAsync_1 = __importDefault(require("../../utils/handleErrorAsync"));
const UserController_1 = __importDefault(require("../../controllers/UserController"));
const isAuth_1 = __importDefault(require("../../middlewares/isAuth"));
router
    .route('/sign_up')
    .post((0, handleErrorAsync_1.default)(
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
UserController_1.default.insertUser));
router
    .route('/sign_in')
    .post((0, handleErrorAsync_1.default)(
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
UserController_1.default.searchUserLogin));
router
    .route('/updatePassword')
    .patch(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Users']
  #swagger.summary = '重設密碼'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/UpdatePassword" }
      }
    }
  }
  #swagger.responses[200] = {
    description: '重設密碼成功',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/ResponseSuccessMsg' }
      }
    }
  }
*/
UserController_1.default.updateUserPassword));
router
    .route('/profile')
    .get(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Users']
  #swagger.summary = '取得個人資料'
  #swagger.responses[200] = {
    description: '成功取得個人資料',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/GetUserProfileSuccess' }
      }
    }
  }
*/
UserController_1.default.getUser))
    .patch(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Users']
  #swagger.summary = '更新個人資料'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/definitions/UpdateProfile" }
      }
    }
  }
  #swagger.responses[200] = {
    description: '成功更新個人資料',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/GetUserProfileSuccess' }
      }
    }
  }
*/
UserController_1.default.updateUserInfo));
router
    .route('/getLikeList')
    .get(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Users']
  #swagger.summary = '取得按讚列表'
  #swagger.responses[200] = {
    description: '成功取得按讚列表',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/GetLikeList' }
      }
    }
  }
*/
UserController_1.default.getUserLikePostList));
router
    .route('/:userID/follow')
    .post(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Users']
  #swagger.summary = '追蹤其它會員'
  #swagger.responses[200] = {
    description: '成功追蹤其它會員',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/ResponseSuccessMsg' }
      }
    }
  }
*/
UserController_1.default.followUser));
router
    .route('/:userID/unfollow')
    .delete(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Users']
  #swagger.summary = '取消追蹤其它會員'
  #swagger.responses[200] = {
    description: '成功取消追蹤其它會員',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/ResponseSuccessMsg' }
      }
    }
  }
*/
UserController_1.default.cancelFollowUser));
router
    .route('/following')
    .get(isAuth_1.default, (0, handleErrorAsync_1.default)(
/*
  #swagger.tags = ['Users']
  #swagger.summary = '取得追蹤列表'
  #swagger.responses[200] = {
    description: '成功取得追蹤列表',
    content: {
      "application/json": {
        schema: { $ref: '#/definitions/GetUserFollowing' }
      }
    }
  }
*/
UserController_1.default.getUserFollowing));
exports.default = router;
