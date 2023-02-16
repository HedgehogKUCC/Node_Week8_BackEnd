"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const appError = require('../utils/appError');
const success = require('../services/responseSuccess');
const generateJWT = require('../utils/generateJWT');
module.exports = {
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            success(res, req.user);
        });
    },
    insertUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const { name, sex, email, password, confirmPassword, } = data;
            if (!name.trim()) {
                return appError('【暱稱】必填', next);
            }
            if (!validator.isLength(name, { min: 2 })) {
                return appError('【暱稱】至少 2 個字元以上', next);
            }
            if (!sex) {
                return appError('【性別】必填', next);
            }
            if (!email) {
                return appError('【帳號】必填', next);
            }
            if (!validator.isEmail(email)) {
                return appError('請輸入正確信箱格式', next);
            }
            if (!password.trim()) {
                return appError('【密碼】必填', next);
            }
            if (!confirmPassword.trim()) {
                return appError('【確認密碼】必填', next);
            }
            if (!validator.isLength(password, { min: 8 })) {
                return appError('【密碼】需 8 碼以上', next);
            }
            if (!validator.isStrongPassword(password)) {
                return appError('【密碼】需包含各一個大小寫英文、數字和符號', next);
            }
            if (validator.matches(password, /['<>]/g)) {
                return appError("【密碼】請勿使用 ' < >", next);
            }
            if (password !== confirmPassword) {
                return appError('【密碼】不一致', next);
            }
            const isExistedEmail = yield UserModel.find({ email });
            if (isExistedEmail.length > 0) {
                return appError('【帳號】已被註冊', next);
            }
            data.password = yield bcrypt.hash(data.password, 12);
            const user = yield UserModel.create(data);
            generateJWT(user, res, 201);
        });
    },
    searchUserLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const { email, password } = data;
            if (!email.trim()) {
                return appError('【帳號】必填', next);
            }
            if (!password.trim()) {
                return appError('【密碼】必填', next);
            }
            if (!validator.isEmail(email)) {
                return appError('請輸入正確信箱格式', next);
            }
            data.password = data.password.replace(/['<>]/g, '');
            const user = yield UserModel.findOne({ email }).select('+password');
            if (!user) {
                return appError('帳號或密碼錯誤，請重新輸入！', next);
            }
            const isPasswordCorrect = yield bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return appError('帳號或密碼錯誤，請重新輸入！', next);
            }
            generateJWT(user, res);
        });
    },
    updateUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const { password, confirmPassword } = data;
            if (!password.trim() || !confirmPassword.trim()) {
                return appError('有欄位未填寫', next);
            }
            if (!validator.isLength(password, { min: 8 })) {
                return appError('【密碼】需 8 碼以上', next);
            }
            if (!validator.isStrongPassword(password)) {
                return appError('【密碼】需包含各一個大小寫英文、數字和符號', next);
            }
            if (validator.matches(password, /['<>]/g)) {
                return appError("【密碼】請勿使用 ' < >", next);
            }
            if (password !== confirmPassword) {
                return appError('【密碼】不一致', next);
            }
            const user = yield UserModel.findById(req.user._id).select('+password');
            const isPasswordSame = yield bcrypt.compare(password, user.password);
            if (isPasswordSame) {
                return appError('請重新設置密碼', next);
            }
            data.password = yield bcrypt.hash(data.password, 12);
            yield UserModel.findByIdAndUpdate(req.user._id, { password: data.password });
            success(res, '密碼重設完成');
        });
    },
    updateUserInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const { avatar, name, sex } = data;
            const regexAvatar = /^https/g;
            if (!avatar.trim()) {
                return appError('【大頭照】必填', next);
            }
            if (!regexAvatar.test(avatar)) {
                return appError('【大頭照】網址開頭需為 https', next);
            }
            if (!name.trim()) {
                return appError('【暱稱】必填', next);
            }
            if (!validator.isLength(name, { min: 2 })) {
                return appError('【暱稱】至少 2 個字元以上', next);
            }
            if (!sex.trim()) {
                return appError('【性別】必填', next);
            }
            if (sex !== 'male' && sex !== 'female') {
                return appError('【性別】必填', next);
            }
            const newUserInfo = yield UserModel.findByIdAndUpdate(req.user._id, {
                avatar,
                name,
                sex,
                updatedAt: Date.now(),
            }, { returnDocument: 'after' });
            success(res, newUserInfo);
        });
    },
    getUserLikePostList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield PostModel.find({
                likes: {
                    $in: [req.user.id]
                }
            }).populate({
                path: 'userID',
                select: 'name avatar',
            });
            success(res, result);
        });
    },
    followUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: myselfID } = req.user;
            const { id: userID } = req.params;
            if (myselfID === userID) {
                return appError('無法追蹤自己唷', next);
            }
            const result = yield UserModel.findById(userID).exec();
            if (!result) {
                return appError('沒有此帳號', next);
            }
            yield UserModel.updateOne({
                _id: myselfID,
                "following.user": {
                    $ne: userID
                }
            }, {
                $addToSet: {
                    following: {
                        user: userID,
                    }
                }
            });
            yield UserModel.updateOne({
                _id: userID,
                "followers.user": {
                    $ne: myselfID
                }
            }, {
                $addToSet: {
                    followers: {
                        user: myselfID
                    }
                }
            });
            success(res, '追蹤成功');
        });
    },
    cancelFollowUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: myselfID } = req.user;
            const { id: userID } = req.params;
            if (myselfID === userID) {
                return appError('無法取消追蹤自己唷', next);
            }
            const result = yield UserModel.findById(userID).exec();
            if (!result) {
                return appError('沒有此帳號', next);
            }
            yield UserModel.updateOne({
                _id: myselfID,
            }, {
                $pull: {
                    following: {
                        user: userID,
                    }
                }
            });
            yield UserModel.updateOne({
                _id: userID,
            }, {
                $pull: {
                    followers: {
                        user: myselfID,
                    }
                }
            });
            success(res, '取消追蹤成功');
        });
    },
    getUserFollowing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const result = yield UserModel.findById(id, '-followers').populate({
                path: 'following.user',
                select: 'name avatar',
            });
            success(res, result);
        });
    }
};
