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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
const responseSuccess_1 = __importDefault(require("../services/responseSuccess"));
const appError_1 = __importDefault(require("../services/appError"));
exports.default = {
    getPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { s, q } = req.query;
            const timeSort = s === 'asc' ? 'createdAt' : '-createdAt';
            let userQuery = {};
            if (typeof q !== 'string') {
                userQuery = {};
            }
            else {
                userQuery = { content: new RegExp(q) };
            }
            const result = yield Post_1.default.find(userQuery).populate({
                path: 'userID',
                select: 'name avatar',
            }).sort(timeSort);
            (0, responseSuccess_1.default)(res, result);
        });
    },
    insertPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = req.body;
            const reqUser = req.user;
            if (!(0, mongoose_1.isValidObjectId)(reqUser._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            if (typeof content !== 'string') {
                return (0, appError_1.default)('【貼文內容】格式有誤', next);
            }
            if (!content.trim()) {
                return (0, appError_1.default)('【貼文內容】必填', next);
            }
            const result = yield Post_1.default.create({
                userID: reqUser._id,
                content
            });
            (0, responseSuccess_1.default)(res, result, 201);
        });
    },
    delAllPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.originalUrl !== '/posts') {
                return (0, appError_1.default)(`伺服器收到 ${req.originalUrl} 與 /posts 不符`, next);
            }
            const result = yield Post_1.default.deleteMany();
            if (result.deletedCount === 0) {
                return (0, appError_1.default)('已無貼文', next);
            }
            (0, responseSuccess_1.default)(res, '成功刪除全部貼文');
        });
    },
    delSinglePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postID } = req.params;
            if (!(0, mongoose_1.isValidObjectId)(postID)) {
                return (0, appError_1.default)('貼文 ID 格式有誤', next);
            }
            const result = yield Post_1.default.findByIdAndDelete(postID);
            if (!result) {
                return (0, appError_1.default)('沒有這則貼文', next);
            }
            (0, responseSuccess_1.default)(res, '成功刪除單筆貼文');
        });
    },
    updatePostContent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postID } = req.params;
            const { content } = req.body;
            if (!(0, mongoose_1.isValidObjectId)(postID)) {
                return (0, appError_1.default)('貼文 ID 格式有誤', next);
            }
            if (typeof content !== 'string') {
                return (0, appError_1.default)('【貼文內容】格式有誤', next);
            }
            if (!content.trim()) {
                return (0, appError_1.default)('【貼文內容】請勿空白', next);
            }
            const result = yield Post_1.default.findByIdAndUpdate(postID, {
                content,
                updatedAt: Date.now()
            }, { returnDocument: 'after' });
            if (!result) {
                return (0, appError_1.default)('沒有這則貼文', next);
            }
            (0, responseSuccess_1.default)(res, result);
        });
    },
    getSinglePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postID } = req.params;
            if (!(0, mongoose_1.isValidObjectId)(postID)) {
                return (0, appError_1.default)('貼文 ID 格式有誤', next);
            }
            const result = yield Post_1.default.findById(postID).exec();
            if (!result) {
                return (0, appError_1.default)('沒有這則貼文', next);
            }
            (0, responseSuccess_1.default)(res, result);
        });
    },
    getUserPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.params;
            if (!(0, mongoose_1.isValidObjectId)(userID)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            /*
                不用驗證 userID 是否存在資料庫
                避免被用來測試
            */
            const result = yield Post_1.default.find({ userID }).populate({
                path: 'userID',
                select: 'name avatar'
            });
            (0, responseSuccess_1.default)(res, result);
        });
    },
    clickPostLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postID } = req.params;
            const reqUser = req.user;
            if (!(0, mongoose_1.isValidObjectId)(postID)) {
                return (0, appError_1.default)('貼文 ID 格式有誤', next);
            }
            if (!(0, mongoose_1.isValidObjectId)(reqUser._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            /*
                自己可以點自己的文章 讚
            */
            const originPostInfo = yield Post_1.default.findById(postID).exec();
            if (!originPostInfo) {
                return (0, appError_1.default)('沒有這則貼文', next);
            }
            const result = yield Post_1.default.findByIdAndUpdate(postID, {
                $addToSet: {
                    likes: reqUser._id,
                },
                updatedAt: Date.now(),
            }, {
                returnDocument: 'after'
            });
            if (originPostInfo.likes.length === result.likes.length) {
                return (0, appError_1.default)('這則貼文已點過讚囉', next);
            }
            (0, responseSuccess_1.default)(res, result);
        });
    },
    cancelPostLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postID } = req.params;
            const reqUser = req.user;
            if (!(0, mongoose_1.isValidObjectId)(postID)) {
                return (0, appError_1.default)('貼文 ID 格式有誤', next);
            }
            if (!(0, mongoose_1.isValidObjectId)(reqUser._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            const originPostInfo = yield Post_1.default.findById(postID).exec();
            if (!originPostInfo) {
                return (0, appError_1.default)('沒有這則貼文', next);
            }
            const result = yield Post_1.default.findByIdAndUpdate(postID, {
                $pull: {
                    likes: reqUser._id,
                },
                updatedAt: Date.now(),
            }, {
                returnDocument: 'after'
            });
            if (originPostInfo.likes.length === result.likes.length) {
                return (0, appError_1.default)('這則貼文已取消讚囉', next);
            }
            (0, responseSuccess_1.default)(res, result);
        });
    },
    insertComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postID } = req.params;
            const { comment } = req.body;
            const reqUser = req.user;
            if (!(0, mongoose_1.isValidObjectId)(postID)) {
                return (0, appError_1.default)('貼文 ID 格式有誤', next);
            }
            if (!(0, mongoose_1.isValidObjectId)(reqUser._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            if (typeof comment !== 'string') {
                return (0, appError_1.default)('【留言】格式有誤', next);
            }
            if (!comment.trim()) {
                return (0, appError_1.default)('【留言】請填寫', next);
            }
            const hasPost = yield Post_1.default.findById(postID).exec();
            if (!hasPost) {
                return (0, appError_1.default)('沒有這則貼文', next);
            }
            const originComment = yield Comment_1.default.find({ postID }).exec();
            yield Comment_1.default.create({
                'userID': reqUser._id,
                postID,
                comment,
            });
            const finalComment = yield Comment_1.default.find({ postID }).exec();
            if (originComment.length >= finalComment.length) {
                return (0, appError_1.default)('【留言】新增失敗', next);
            }
            (0, responseSuccess_1.default)(res, '新增留言成功', 201);
        });
    },
    getAllComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postID } = req.params;
            if (!(0, mongoose_1.isValidObjectId)(postID)) {
                return (0, appError_1.default)('貼文 ID 格式有誤', next);
            }
            const result = yield Post_1.default.findById(postID).populate({
                path: 'comments',
                select: 'userID comment',
                options: {
                    sort: {
                        createdAt: -1
                    }
                }
            });
            if (!result) {
                return (0, appError_1.default)('沒有這則貼文', next);
            }
            (0, responseSuccess_1.default)(res, result);
        });
    }
};
