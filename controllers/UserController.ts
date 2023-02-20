import { Request, Response, NextFunction } from 'express';
import { ICustomRequest, IUser } from '../types/index';

import bcrypt from 'bcryptjs';
import validator from 'validator';

import UserModel from '../models/User';
import PostModel from '../models/Post';

import generateJWT from '../utils/generateJWT';

import success from '../services/responseSuccess';
import appError from '../services/appError';

module.exports = {
    async getUser(req: ICustomRequest, res: Response, next: NextFunction) {
        success(res, req.user);
    },
    async insertUser(req: Request, res: Response, next: NextFunction) {
        const data = req.body as IUser;
        const {
            name,
            sex,
            email,
            password,
            confirmPassword,
        } = data as IUser;

        if ( typeof name !== 'string' ) {
            return appError('【暱稱】需為字串', next);
        }

        if ( !name.trim() ) {
            return appError('【暱稱】必填', next);
        }

        if ( !validator.isLength(name, { min: 2 }) ) {
            return appError('【暱稱】至少 2 個字元以上', next);
        }

        if ( typeof sex !== 'string' ) {
            return appError('【性別】需為字串', next);
        }

        if ( !sex.trim() ) {
            return appError('【性別】必填', next);
        }

        if ( typeof email !== 'string' ) {
            return appError('【帳號】需為字串', next);
        }

        if ( !email.trim() ) {
            return appError('【帳號】必填', next);
        }

        if ( !validator.isEmail(email) ) {
            return appError('請輸入正確信箱格式', next);
        }

        if ( typeof password !== 'string' || typeof data.password !== 'string' ) {
            return appError('【密碼】需為字串', next);
        }

        if ( !password.trim() ) {
            return appError('【密碼】必填', next);
        }

        if ( typeof confirmPassword !== 'string' ) {
            return appError('【確認密碼】需為字串', next);
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
    async searchUserLogin(req: Request, res: Response, next: NextFunction) {
        const data = req.body as IUser;
        const { email, password } = data as IUser;

        if ( typeof email !== 'string' ) {
            return appError('【帳號】需為字串', next);
        }

        if ( !email.trim() ) {
            return appError('【帳號】必填', next);
        }

        if ( typeof password !== 'string' || typeof data.password !== 'string' ) {
            return appError('【密碼】需為字串', next);
        }

        if ( !password.trim() ) {
            return appError('【密碼】必填', next);
        }

        if ( !validator.isEmail(email) ) {
            return appError('請輸入正確信箱格式', next);
        }

        data.password = data.password.replace(/['<>]/g, '');

        const user = await UserModel.findOne({ email }).select('+password') as IUser;
        if ( !user ) {
            return appError('帳號或密碼錯誤，請重新輸入！', next);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password!);
        if ( !isPasswordCorrect ) {
            return appError('帳號或密碼錯誤，請重新輸入！', next);
        }

        generateJWT(user, res);
    },
    async updateUserPassword(req: ICustomRequest, res: Response, next: NextFunction) {
        const data = req.body as IUser;
        const { password, confirmPassword } = data as IUser;

        if ( typeof password !== 'string' || typeof data.password !== 'string' ) {
            return appError('【密碼】需為字串', next);
        }

        if ( typeof confirmPassword !== 'string' ) {
            return appError('【確認密碼】需為字串', next);
        }

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

        const user = await UserModel.findById(req.user._id).select('+password') as IUser;
        const isPasswordSame = await bcrypt.compare(password, user.password!);
        if ( isPasswordSame ) {
            return appError('請重新設置密碼', next);
        }

        data.password = await bcrypt.hash(data.password, 12);
        await UserModel.findByIdAndUpdate(req.user._id, { password: data.password });
        success(res, '密碼重設完成');
    },
    async updateUserInfo(req: ICustomRequest, res: Response, next: NextFunction) {
        const data = req.body as IUser;
        const { avatar, name, sex } = data as IUser;

        const regexAvatar = /^https/g;

        if ( typeof avatar !== 'string') {
            return appError('【大頭照】需為網址字串', next);
        }

        if ( !avatar.trim() ) {
            return appError('【大頭照】必填', next);
        }

        if ( !regexAvatar.test(avatar) ) {
            return appError('【大頭照】網址開頭需為 https', next);
        }

        if ( typeof name !== 'string' ) {
            return appError('【暱稱】需為字串', next);
        }

        if ( !name.trim() ) {
            return appError('【暱稱】必填', next);
        }

        if ( !validator.isLength(name, { min: 2 }) ) {
            return appError('【暱稱】至少 2 個字元以上', next);
        }

        if ( typeof sex !== 'string' ) {
            return appError('【性別】需為字串', next);
        }

        if ( !sex.trim() ) {
            return appError('【性別】必填', next);
        }

        if ( sex !== 'male' && sex !== 'female' ) {
            return appError('【性別】無此選項', next);
        }

        const newUserInfo = await UserModel.findByIdAndUpdate(req.user._id, {
            avatar,
            name,
            sex,
            updatedAt: Date.now(),
        }, { returnDocument: 'after' }) as IUser;
        success(res, newUserInfo);
    },
    async getUserLikePostList(req: ICustomRequest, res: Response, next: NextFunction) {
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
    async followUser(req: ICustomRequest, res: Response, next: NextFunction) {
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
    async cancelFollowUser(req: ICustomRequest, res: Response, next: NextFunction) {
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
    async getUserFollowing(req: ICustomRequest, res: Response, next: NextFunction) {
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

        if (!result) {
            return appError('【取得個人追蹤名單】失敗', next);
        }

        success(res, result!);
    }
}
