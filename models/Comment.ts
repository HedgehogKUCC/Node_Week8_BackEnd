import { Schema, model } from 'mongoose';
import { IComment } from '../types/index';

const commentSchema = new Schema<IComment>(
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
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '請登入帳號'],
        },
        postID: {
            type: Schema.Types.ObjectId,
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
            select: 'name avatar',
        }
    );

    next();
});

const CommentModel = model<IComment>('Comment', commentSchema);

export default CommentModel;
