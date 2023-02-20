import { Schema, model } from 'mongoose';
import { IPost } from '../types/index';

const postSchema = new Schema<IPost>(
    {
        userID: {
            type: Schema.Types.ObjectId,
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
                type: Schema.Types.ObjectId,
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
    },
    {
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'postID',
    localField: '_id',
});

const PostModel = model<IPost>('Post', postSchema);

export default PostModel;
