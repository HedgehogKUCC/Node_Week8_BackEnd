"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: [true, '【留言】不能為空白'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: true,
    },
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, '請登入帳號'],
    },
    postID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, '請選擇貼文'],
    }
}, {
    versionKey: false,
});
commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userID',
        select: 'name avatar',
    });
    next();
});
const CommentModel = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = CommentModel;
