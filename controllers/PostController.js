const PostModel = require('../models/Post');

const appError = require('../utils/appError');
const success = require('../services/responseSuccess');

module.exports = {
    async getPosts(req, res, next) {
        const { s, q } = req.query;
        const timeSort = s === 'asc' ? 'createdAt' : '-createdAt';
        const userQuery = q !== undefined ? { "content": new RegExp(req.query.q) } : {};
        const result = await PostModel.find(userQuery).populate({
            path: 'userID',
            select: 'name avatar',
        }).sort(timeSort);
        success(res, result);
    },
    async insertPost(req, res, next) {
        const { content } = req.body;

        if ( !content.trim() ) {
            return appError('【貼文內容】必填', next);
        }

        const result = await PostModel.create({
            userID: req.user.id,
            content
        });
        success(res, result, 201);
    },
    async delAllPosts(req, res, next) {
        if ( req.originalUrl !== '/posts' ) {
            return appError(`伺服器收到 ${req.originalUrl} 與 /posts 不符`, next);
        }

        const result = await PostModel.deleteMany();
        if ( result.deletedCount === 0 ) {
            return appError('已無貼文', next);
        }
        success(res, '成功刪除全部貼文');
    }
}
