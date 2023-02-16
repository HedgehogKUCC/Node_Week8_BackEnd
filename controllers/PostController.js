"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PostModel = require('../models/Post');
const CommentModel = require('../models/Comment');
const appError = require('../utils/appError');
const success = require('../services/responseSuccess');
module.exports = {
    getPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { s, q } = req.query;
            const timeSort = s === 'asc' ? 'createdAt' : '-createdAt';
            const userQuery = q !== undefined ? { "content": new RegExp(req.query.q) } : {};
            const result = yield PostModel.find(userQuery).populate({
                path: 'userID',
                select: 'name avatar',
            }).sort(timeSort);
            success(res, result);
        });
    },
    insertPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = req.body;
            if (!content.trim()) {
                return appError('【貼文內容】必填', next);
            }
            const result = yield PostModel.create({
                userID: req.user.id,
                content
            });
            success(res, result, 201);
        });
    },
    delAllPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.originalUrl !== '/posts') {
                return appError(`伺服器收到 ${req.originalUrl} 與 /posts 不符`, next);
            }
            const result = yield PostModel.deleteMany();
            if (result.deletedCount === 0) {
                return appError('已無貼文', next);
            }
            success(res, '成功刪除全部貼文');
        });
    },
    delSinglePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield PostModel.findByIdAndDelete(id);
            if (!result) {
                return appError('沒有這則貼文', next);
            }
            success(res, '成功刪除單筆貼文');
        });
    },
    updatePostContent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { content } = req.body;
            if (!content.trim()) {
                return appError('【貼文內容】請勿空白', next);
            }
            const result = yield PostModel.findByIdAndUpdate(id, {
                content,
                updatedAt: Date.now()
            }, { returnDocument: 'after' });
            if (!result) {
                return appError('沒有這則貼文', next);
            }
            success(res, result);
        });
    },
    getSinglePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield PostModel.findById(id).exec();
            if (!result) {
                return appError('沒有這則貼文', next);
            }
            success(res, result);
        });
    },
    getUserPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.params;
            const result = yield PostModel.find({ userID }).populate({
                path: 'userID',
                select: 'name avatar'
            });
            success(res, result);
        });
    },
    clickPostLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield PostModel.findByIdAndUpdate(id, {
                $addToSet: {
                    likes: req.user.id,
                },
                updatedAt: Date.now(),
            }, {
                returnDocument: 'after'
            });
            if (!result) {
                return appError('沒有這則貼文', next);
            }
            success(res, result);
        });
    },
    cancelPostLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield PostModel.findByIdAndUpdate(id, {
                $pull: {
                    likes: req.user.id,
                },
                updatedAt: Date.now(),
            }, {
                returnDocument: 'after'
            });
            if (!result) {
                return appError('沒有這則貼文', next);
            }
            success(res, result);
        });
    },
    insertComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userID } = req.user;
            const { id: postID } = req.params;
            const data = req.body;
            const { comment } = data;
            if (!comment) {
                return appError("請傳入 JSON => { 'comment': '' }", next);
            }
            if (!comment.trim()) {
                return appError('【留言】請填寫', next);
            }
            const hasPost = yield PostModel.findById(postID).exec();
            if (!hasPost) {
                return appError('沒有這則貼文', next);
            }
            yield CommentModel.create({
                comment,
                userID,
                postID,
            });
            success(res, '新增留言成功', 201);
        });
    },
    getAllComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: postID } = req.params;
            const result = yield PostModel.findById(postID).populate({
                path: 'comments',
                select: 'userID comment',
            });
            if (!result) {
                return appError('沒有這則貼文', next);
            }
            success(res, result);
        });
    }
};
