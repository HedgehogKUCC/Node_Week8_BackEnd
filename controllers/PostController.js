const PostModel = require('../models/Post');
const UserModel = require('../models/User');
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
        const data = req.body;
        const {
            userID,
            content,
        } = data;

        if ( !userID ) {
            return appError('請登入帳號', next);
        }

        if ( !content ) {
            return appError('【貼文內容】必填', next);
        }

        const hasUserID = await UserModel.findById(userID).exec();
        if ( !hasUserID ) {
            return appError('請註冊帳號', next);
        }

        const result = await PostModel.create(data);
        success(res, result, 201);
    },
}
