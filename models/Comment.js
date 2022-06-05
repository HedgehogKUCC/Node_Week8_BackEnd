const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
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
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, '請登入帳號'],
        },
        postID: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
            required: [true, '請選擇貼文'],
        }
    },
    {
        versionKey: false,
    }
)

commentSchema.pre(/^find/, function(next) {
    this.populate(
        {
            path: 'userID',
            select: 'name avatar'
        }
    ).sort('-createdAt');

    next();
});

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;
