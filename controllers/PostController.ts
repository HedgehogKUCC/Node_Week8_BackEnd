import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

import { ICustomRequest } from '../types/index';

import PostModel from '../models/Post';
import CommentModel from '../models/Comment';

import success from '../services/responseSuccess';
import appError from '../services/appError';

export default {
    async getPosts(req: Request<unknown, unknown, unknown, { s?: string; q?: string; }>, res: Response, next: NextFunction) {
        const { s, q } = req.query;
        const timeSort = s === 'asc' ? 'createdAt' : '-createdAt';
        let userQuery: { content?: RegExp; } = {};

        if ( typeof q !== 'string' ) {
            userQuery = {};
        } else {
            userQuery = { content: new RegExp(q) };
        }

        const result = await PostModel.find(userQuery).populate({
            path: 'userID',
            select: 'name avatar',
        }).sort(timeSort);

        success(res, result);
    },
    async insertPost(req: Request<unknown, unknown, { content?: string }, unknown>, res: Response, next: NextFunction) {
        const { content } = req.body;
        const reqUser = req.user as ICustomRequest['user'];

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }
        
        if ( typeof content !== 'string' ) {
            return appError('【貼文內容】格式有誤', next);
        }

        if ( !content.trim() ) {
            return appError('【貼文內容】必填', next);
        }

        const result = await PostModel.create({
            userID: reqUser._id,
            content
        });

        success(res, result, 201);
    },
    async delAllPosts(req: Request, res: Response, next: NextFunction) {
        if ( req.originalUrl !== '/posts' ) {
            return appError(`伺服器收到 ${req.originalUrl} 與 /posts 不符`, next);
        }

        const result = await PostModel.deleteMany();

        if ( result.deletedCount === 0 ) {
            return appError('已無貼文', next);
        }

        success(res, '成功刪除全部貼文');
    },
    async delSinglePost(req: Request<{ postID?: string }, unknown, unknown, unknown>, res: Response, next: NextFunction) {
        const { postID } = req.params;
        const reqUser = req.user as ICustomRequest['user'];

        if ( !isValidObjectId(postID) ) {
            return appError('貼文 ID 格式有誤', next);
        }

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        const postSearch = await PostModel.findById(postID).exec();

        if ( !postSearch ) {
            return appError('沒有這則貼文', next);
        }

        const postUserID = postSearch.userID.toString();
        const reqUserID = reqUser._id.toString();

        if ( reqUserID !== postUserID ) {
            return appError('刪除者與貼文發佈者不符合', next);
        }

        await PostModel.findByIdAndDelete(postID);

        success(res, '成功刪除單筆貼文');
    },
    async updatePostContent(req: Request<{ postID?: string }, unknown, { content?: string }, unknown>, res: Response, next: NextFunction) {
        const { postID } = req.params;
        const { content } = req.body;
        const reqUser = req.user as ICustomRequest['user'];

        if ( !isValidObjectId(postID) ) {
            return appError('貼文 ID 格式有誤', next);
        }

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        if ( typeof content !== 'string' ) {
            return appError('【貼文內容】格式有誤', next);
        }

        if ( !content.trim() ) {
            return appError('【貼文內容】請勿空白', next);
        }

        const postSearch = await PostModel.findById(postID).exec();

        if ( !postSearch ) {
            return appError('沒有這則貼文', next);
        }

        const postUserID = postSearch.userID.toString();
        const reqUserID = reqUser._id.toString();

        if ( reqUserID !== postUserID ) {
            return appError('編輯者與貼文發佈者不符合', next);
        }

        const result = await PostModel.findByIdAndUpdate(
            postID,
            {
                content,
                updatedAt: Date.now()
            },
            { returnDocument: 'after' }
        );

        success(res, result!);
    },
    async getSinglePost(req: Request<{ postID?: string }, unknown, unknown, unknown>, res: Response, next: NextFunction) {
        const { postID } = req.params;

        if ( !isValidObjectId(postID) ) {
            return appError('貼文 ID 格式有誤', next);
        }

        const result = await PostModel.findById(postID).exec();

        if ( !result ) {
            return appError('沒有這則貼文', next);
        }

        success(res, result);
    },
    async getUserPosts(req: Request<{ userID?: string }, unknown, unknown, unknown>, res: Response, next: NextFunction) {
        const { userID } = req.params;

        if ( !isValidObjectId(userID) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        /*
            不用驗證 userID 是否存在資料庫
            避免被用來測試
        */

        const result = await PostModel.find({ userID }).populate({
            path: 'userID',
            select: 'name avatar'
        });

        success(res, result);
    },
    async clickPostLike(req: Request<{ postID?: string }, unknown, unknown, unknown>, res: Response, next: NextFunction) {
        const { postID } = req.params;
        const reqUser = req.user as ICustomRequest['user'];

        if ( !isValidObjectId(postID) ) {
            return appError('貼文 ID 格式有誤', next);
        }

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        /*
            自己可以點自己的文章 讚
        */

        const originPostInfo = await PostModel.findById(postID).exec();

        if ( !originPostInfo ) {
            return appError('沒有這則貼文', next);
        }

        const result = await PostModel.findByIdAndUpdate(
            postID,
            {
                $addToSet: {
                    likes: reqUser._id,
                },
                updatedAt: Date.now(),
            },
            {
                returnDocument: 'after'
            }
        );

        if ( originPostInfo.likes.length === result!.likes.length ) {
            return appError('這則貼文已點過讚囉', next);
        }

        success(res, result!);
    },
    async cancelPostLike(req: Request<{ postID?: string }, unknown, unknown, unknown>, res: Response, next: NextFunction) {
        const { postID } = req.params;
        const reqUser = req.user as ICustomRequest['user'];

        if ( !isValidObjectId(postID) ) {
            return appError('貼文 ID 格式有誤', next);
        }

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        const originPostInfo = await PostModel.findById(postID).exec();

        if ( !originPostInfo ) {
            return appError('沒有這則貼文', next);
        }

        const result = await PostModel.findByIdAndUpdate(
            postID,
            {
                $pull: {
                    likes: reqUser._id,
                },
                updatedAt: Date.now(),
            },
            {
                returnDocument: 'after'
            }
        );

        if ( originPostInfo.likes.length === result!.likes.length ) {
            return appError('這則貼文已取消讚囉', next);
        }

        success(res, result!);
    },
    async insertComment(req: Request<{ postID?: string }, unknown, { comment?: string }>, res: Response, next: NextFunction) {
        const { postID } = req.params;
        const { comment } = req.body;
        const reqUser = req.user as ICustomRequest['user'];

        if ( !isValidObjectId(postID) ) {
            return appError('貼文 ID 格式有誤', next);
        }

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        if ( typeof comment !== 'string' ) {
            return appError('【留言】格式有誤', next);
        }

        if ( !comment.trim() ) {
            return appError('【留言】請填寫', next);
        }

        const hasPost = await PostModel.findById(postID).exec();

        if ( !hasPost ) {
            return appError('沒有這則貼文', next);
        }

        const originComment = await CommentModel.find({postID}).exec();

        await CommentModel.create(
            {
                'userID': reqUser._id,
                postID,
                comment,
            }
        )

        const finalComment = await CommentModel.find({postID}).exec();

        if ( originComment.length >= finalComment.length ) {
            return appError('【留言】新增失敗', next);
        }

        success(res, '新增留言成功', 201);
    },
    async getAllComments(req: Request<{ postID?: string }, unknown, unknown, unknown>, res: Response, next: NextFunction) {
        const { postID } = req.params;

        if ( !isValidObjectId(postID) ) {
            return appError('貼文 ID 格式有誤', next);
        }

        const result = await PostModel.findById(
            postID,
        ).populate(
            {
                path: 'comments',
                select: 'userID comment',
                options: {
                    sort: {
                        createdAt: -1
                    }
                }
            }
        );

        if ( !result ) {
            return appError('沒有這則貼文', next);
        }

        success(res, result);
    }
}
