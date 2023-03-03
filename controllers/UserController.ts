import { Request, Response, NextFunction } from 'express';
import { ICustomRequest, IUser } from '../types/index';
import { isValidObjectId } from 'mongoose';

import bcrypt from 'bcryptjs';
import validator from 'validator';

import UserModel from '../models/User';
import PostModel from '../models/Post';

import generateJWT from '../utils/generateJWT';

import success from '../services/responseSuccess';
import appError from '../services/appError';

export default {
    async getUser(req: ICustomRequest, res: Response, next: NextFunction) {

        if ( !isValidObjectId(req.user._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        success(res, req.user);
    },
    async insertUser(req: Request<unknown, unknown, IUser, unknown>, res: Response, next: NextFunction) {
        const {
            name,
            sex,
            email,
            password,
            confirmPassword
        } = req.body;

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

        if ( typeof password !== 'string' ) {
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

        req.body.password = await bcrypt.hash(password, 12);

        const user = await UserModel.create(req.body);

        generateJWT(user, res, 201);
    },
    async searchUserLogin(req: Request<unknown, unknown, IUser, unknown>, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        if ( typeof email !== 'string' ) {
            return appError('【帳號】需為字串', next);
        }

        if ( !email.trim() ) {
            return appError('【帳號】必填', next);
        }

        if ( typeof password !== 'string' ) {
            return appError('【密碼】需為字串', next);
        }

        if ( !password.trim() ) {
            return appError('【密碼】必填', next);
        }

        if ( !validator.isEmail(email) ) {
            return appError('請輸入正確信箱格式', next);
        }

        req.body.password = password.replace(/['<>]/g, '');

        const user = await UserModel.findOne({ email }).select('+password');

        if ( !user ) {
            return appError('帳號或密碼錯誤，請重新輸入！', next);
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password!);

        if ( !isPasswordCorrect ) {
            return appError('帳號或密碼錯誤，請重新輸入！', next);
        }

        generateJWT(user, res);
    },
    async updateUserPassword(req: Request<unknown, unknown, IUser, unknown>, res: Response, next: NextFunction) {
        const { password, confirmPassword } = req.body;
        const reqUser = req.user as ICustomRequest['user'];

        if ( typeof password !== 'string' ) {
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

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        const user = await UserModel.findById(reqUser._id).select('+password');

        if ( !user ) {
            return appError('【重設密碼】無此用戶', next);
        }

        const isPasswordSame = await bcrypt.compare(password, user.password!);

        if ( isPasswordSame ) {
            return appError('請重新設置密碼', next);
        }

        req.body.password = await bcrypt.hash(password, 12);

        await UserModel.findByIdAndUpdate(reqUser._id, { 'password': req.body.password });

        success(res, '重設密碼完成');
    },
    async updateUserInfo(req: Request<unknown, unknown, IUser, unknown>, res: Response, next: NextFunction) {
        const { avatar, name, sex } = req.body;
        const reqUser = req.user as ICustomRequest['user'];

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

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        const newUserInfo = await UserModel.findByIdAndUpdate(reqUser._id, {
            avatar,
            name,
            sex,
            updatedAt: Date.now(),
        }, { returnDocument: 'after' });

        if ( !newUserInfo ) {
            return appError('【更新個人資料】無此用戶', next);
        }

        success(res, newUserInfo);
    },
    async getUserLikePostList(req: ICustomRequest, res: Response, next: NextFunction) {

        if ( !isValidObjectId(req.user._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        const result = await PostModel.find(
            {
                likes: {
                    $in: [ req.user._id ]
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
    async followUser(req: Request<{ userID: string }, unknown, unknown, unknown>, res: Response, next: NextFunction) {
        const { userID } = req.params;
        const reqUser = req.user as ICustomRequest['user'];

        if ( !isValidObjectId(userID) ) {
            return appError('追蹤的用戶 ID 格式有誤', next);
        }

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        // Types.ObjectId 需要轉換為 string 才能比對是否為同一人
        const reqUserID = reqUser._id.toString();

        if ( reqUserID === userID ) {
            return appError('無法追蹤自己唷', next);
        }

        const result = await UserModel.findById(userID).exec();

        if ( !result ) {
            return appError('沒有此帳號', next);
        }

        const resAddFollowing = await UserModel.updateOne(
            {
                _id: reqUser._id,
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

        if ( resAddFollowing.modifiedCount === 0 ) {
            return appError('追蹤失敗', next);
        }

        const resAddFollowers = await UserModel.updateOne(
            {
                _id: userID,
                "followers.user": {
                    $ne: reqUser._id
                }
            },
            {
                $addToSet: {
                    followers: {
                        user: reqUser._id
                    }
                }
            }
        )

        if ( resAddFollowers.modifiedCount === 0 ) {
            return appError('新增追蹤者失敗', next);
        }

        success(res, '追蹤成功');
    },
    async cancelFollowUser(req: Request<{ userID: string }>, res: Response, next: NextFunction) {
        const { userID } = req.params;
        const reqUser = req.user as ICustomRequest['user'];

        if ( !isValidObjectId(userID) ) {
            return appError('取消追蹤的用戶 ID 格式有誤', next);
        }

        if ( !isValidObjectId(reqUser._id) ) {
            return appError('用戶 ID 格式有誤', next);
        }
        
        // Types.ObjectId 需要轉換為 string 才能比對是否為同一人
        const reqUserID = reqUser._id.toString();

        if ( reqUserID === userID ) {
            return appError('無法取消追蹤自己唷', next);
        }

        const result = await UserModel.findById(userID).exec();

        if ( !result ) {
            return appError('沒有此帳號', next);
        }

        const resPullFollowing = await UserModel.updateOne(
            {
                _id: reqUser._id,
            },
            {
                $pull: {
                    following: {
                        user: userID,
                    }
                }
            }
        )

        if ( resPullFollowing.modifiedCount === 0 ) {
            return appError('取消追蹤失敗', next);
        }

        const resPullFollowers = await UserModel.updateOne(
            {
                _id: userID,
            },
            {
                $pull: {
                    followers: {
                        user: reqUser._id,
                    }
                }
            }
        )

        if ( resPullFollowers.modifiedCount === 0 ) {
            return appError('移除追蹤者失敗', next);
        }

        success(res, '取消追蹤成功');
    },
    async getUserFollowing(req: ICustomRequest, res: Response, next: NextFunction) {
        const { _id } = req.user;

        if ( !isValidObjectId(_id) ) {
            return appError('用戶 ID 格式有誤', next);
        }

        const result = await UserModel.findById(
            _id,
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
