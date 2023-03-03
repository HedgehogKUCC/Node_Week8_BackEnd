"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, '請登入帳號']
    },
    content: {
        type: String,
        required: [true, '【貼文內容】必填'],
        trim: true,
    },
    image: {
        type: String,
        trim: true,
        default: '',
    },
    likes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'postID',
    localField: '_id',
});
const PostModel = (0, mongoose_1.model)('Post', postSchema);
exports.default = PostModel;
