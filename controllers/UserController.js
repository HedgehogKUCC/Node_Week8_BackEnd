const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserModel = require('../models/User');
const PostModel = require('../models/Post');

const generateJWT = require('../utils/generateJWT');

import success from '../services/responseSuccess';
import appError from '../services/appError';

module.exports = {
    async getUser(req, res, next) {
        success(res, req.user);
    },
    async insertUser(req, res, next) {
        const data = req.body;
        const {
            name,
            sex,
            email,
            password,
            confirmPassword,
        } = data;

        if ( !name.trim() ) {
            return appError('【暱稱】必填', next);
        }

        if ( !validator.isLength(name, { min: 2 }) ) {
            return appError('【暱稱】至少 2 個字元以上', next);
        }

        if ( !sex ) {
            return appError('【性別】必填', next);
        }

        if ( !email ) {
            return appError('【帳號】必填', next);
        }

        if ( !validator.isEmail(email) ) {
            return appError('請輸入正確信箱格式', next);
        }

        if ( !password.trim() ) {
            return appError('【密碼】必填', next);
        }

        if ( !confirmPassword.trim() ) {
            return appError('【確認密碼】必填', next);
        }

        if ( !validator.isLength(password, { min: 8 }) ) {
            return appError('【密碼】需 8 碼以上', next);
        }

        if ( !validator.isStrongPassword(password) ) {
            return appError('【密碼】需包含各一個大小寫英文、數字和符號', next);
        }

        if ( validator.matches(password, /['<>]/g) ) {
            return appError("【密碼】請勿使用 ' < >", next);
        }

        if ( password !== confirmPassword ) {
            return appError('【密碼】不一致', next);
        }

        const isExistedEmail = await UserModel.find({ email });
        if ( isExistedEmail.length > 0 ) {
            return appError('【帳號】已被註冊', next);
        }

        data.password = await bcrypt.hash(data.password, 12);

        const user = await UserModel.create(data);

        generateJWT(user, res, 201);
    },
    async searchUserLogin(req, res, next) {
        const data = req.body;
        const { email, password } = data;

        if ( !email.trim() ) {
            return appError('【帳號】必填', next);
        }

        if ( !password.trim() ) {
            return appError('【密碼】必填', next);
        }

        if ( !validator.isEmail(email) ) {
            return appError('請輸入正確信箱格式', next);
        }

        data.password = data.password.replace(/['<>]/g, '');

        const user = await UserModel.findOne({ email }).select('+password');
        if ( !user ) {
            return appError('帳號或密碼錯誤，請重新輸入！', next);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if ( !isPasswordCorrect ) {
            return appError('帳號或密碼錯誤，請重新輸入！', next);
        }

        generateJWT(user, res);
    },
    async updateUserPassword(req, res, next) {
        const data = req.body;
        const { password, confirmPassword } = data;

        if ( !password.trim() || !confirmPassword.trim() ) {
            return appError('有欄位未填寫', next);
        }

        if ( !validator.isLength(password, { min: 8 }) ) {
            return appError('【密碼】需 8 碼以上', next);
        }

        if ( !validator.isStrongPassword(password) ) {
            return appError('【密碼】需包含各一個大小寫英文、數字和符號', next);
        }

        if ( validator.matches(password, /['<>]/g) ) {
            return appError("【密碼】請勿使用 ' < >", next);
        }

        if ( password !== confirmPassword ) {
            return appError('【密碼】不一致', next);
        }

        const user = await UserModel.findById(req.user._id).select('+password');
        const isPasswordSame = await bcrypt.compare(password, user.password);
        if ( isPasswordSame ) {
            return appError('請重新設置密碼', next);
        }

        data.password = await bcrypt.hash(data.password, 12);
        await UserModel.findByIdAndUpdate(req.user._id, { password: data.password });
        success(res, '密碼重設完成');
    },
    async updateUserInfo(req, res, next) {
        const data = req.body;
        const { avatar, name, sex } = data;

        const regexAvatar = /^https/g;

        if ( !avatar.trim() ) {
            return appError('【大頭照】必填', next);
        }

        if ( !regexAvatar.test(avatar) ) {
            return appError('【大頭照】網址開頭需為 https', next);
        }

        if ( !name.trim() ) {
            return appError('【暱稱】必填', next);
        }

        if ( !validator.isLength(name, { min: 2 }) ) {
            return appError('【暱稱】至少 2 個字元以上', next);
        }

        if ( !sex.trim() ) {
            return appError('【性別】必填', next);
        }

        if ( sex !== 'male' && sex !== 'female' ) {
            return appError('【性別】必填', next);
        }

        const newUserInfo = await UserModel.findByIdAndUpdate(req.user._id, {
            avatar,
            name,
            sex,
            updatedAt: Date.now(),
        }, { returnDocument: 'after' });
        success(res, newUserInfo);
    },
    async getUserLikePostList(req, res, next) {
        const result = await PostModel.find(
            {
                likes: {
                    $in: [ req.user.id ]
                }
            }
        ).populate(
            {
                path: 'userID',
                select: 'name avatar',
            }
        )

        success(res, result);
    },
    async followUser(req, res, next) {
        const { id: myselfID } = req.user;
        const { id: userID } = req.params;

        if ( myselfID === userID ) {
            return appError('無法追蹤自己唷', next);
        }

        const result = await UserModel.findById(userID).exec();
        if ( !result ) {
            return appError('沒有此帳號', next);
        }

        await UserModel.updateOne(
            {
                _id: myselfID,
                "following.user": {
                    $ne: userID
                }
            },
            {
                $addToSet: {
                    following: {
                        user: userID,
                    }
                }
            }
        )

        await UserModel.updateOne(
            {
                _id: userID,
                "followers.user": {
                    $ne: myselfID
                }
            },
            {
                $addToSet: {
                    followers: {
                        user: myselfID
                    }
                }
            }
        )

        success(res, '追蹤成功');
    },
    async cancelFollowUser(req, res, next) {
        const { id: myselfID } = req.user;
        const { id: userID } = req.params;

        if ( myselfID === userID ) {
            return appError('無法取消追蹤自己唷', next);
        }

        const result = await UserModel.findById(userID).exec();
        if ( !result ) {
            return appError('沒有此帳號', next);
        }

        await UserModel.updateOne(
            {
                _id: myselfID,
            },
            {
                $pull: {
                    following: {
                        user: userID,
                    }
                }
            }
        )

        await UserModel.updateOne(
            {
                _id: userID,
            },
            {
                $pull: {
                    followers: {
                        user: myselfID,
                    }
                }
            }
        )

        success(res, '取消追蹤成功');
    },
    async getUserFollowing(req, res, next) {
        const { id } = req.user;

        const result = await UserModel.findById(
            id,
            '-followers',
        ).populate(
            {
                path: 'following.user',
                select: 'name avatar',
            }
        )

        success(res, result);
    }
}
