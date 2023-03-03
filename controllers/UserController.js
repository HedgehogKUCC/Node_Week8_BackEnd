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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const generateJWT_1 = __importDefault(require("../utils/generateJWT"));
const responseSuccess_1 = __importDefault(require("../services/responseSuccess"));
const appError_1 = __importDefault(require("../services/appError"));
exports.default = {
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(req.user._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            (0, responseSuccess_1.default)(res, req.user);
        });
    },
    insertUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, sex, email, password, confirmPassword } = req.body;
            if (typeof name !== 'string') {
                return (0, appError_1.default)('【暱稱】需為字串', next);
            }
            if (!name.trim()) {
                return (0, appError_1.default)('【暱稱】必填', next);
            }
            if (!validator_1.default.isLength(name, { min: 2 })) {
                return (0, appError_1.default)('【暱稱】至少 2 個字元以上', next);
            }
            if (typeof sex !== 'string') {
                return (0, appError_1.default)('【性別】需為字串', next);
            }
            if (!sex.trim()) {
                return (0, appError_1.default)('【性別】必填', next);
            }
            if (typeof email !== 'string') {
                return (0, appError_1.default)('【帳號】需為字串', next);
            }
            if (!email.trim()) {
                return (0, appError_1.default)('【帳號】必填', next);
            }
            if (!validator_1.default.isEmail(email)) {
                return (0, appError_1.default)('請輸入正確信箱格式', next);
            }
            if (typeof password !== 'string') {
                return (0, appError_1.default)('【密碼】需為字串', next);
            }
            if (!password.trim()) {
                return (0, appError_1.default)('【密碼】必填', next);
            }
            if (typeof confirmPassword !== 'string') {
                return (0, appError_1.default)('【確認密碼】需為字串', next);
            }
            if (!confirmPassword.trim()) {
                return (0, appError_1.default)('【確認密碼】必填', next);
            }
            if (!validator_1.default.isLength(password, { min: 8 })) {
                return (0, appError_1.default)('【密碼】需 8 碼以上', next);
            }
            if (!validator_1.default.isStrongPassword(password)) {
                return (0, appError_1.default)('【密碼】需包含各一個大小寫英文、數字和符號', next);
            }
            if (validator_1.default.matches(password, /['<>]/g)) {
                return (0, appError_1.default)("【密碼】請勿使用 ' < >", next);
            }
            if (password !== confirmPassword) {
                return (0, appError_1.default)('【密碼】不一致', next);
            }
            const isExistedEmail = yield User_1.default.find({ email });
            if (isExistedEmail.length > 0) {
                return (0, appError_1.default)('【帳號】已被註冊', next);
            }
            req.body.password = yield bcryptjs_1.default.hash(password, 12);
            const user = yield User_1.default.create(req.body);
            (0, generateJWT_1.default)(user, res, 201);
        });
    },
    searchUserLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (typeof email !== 'string') {
                return (0, appError_1.default)('【帳號】需為字串', next);
            }
            if (!email.trim()) {
                return (0, appError_1.default)('【帳號】必填', next);
            }
            if (typeof password !== 'string') {
                return (0, appError_1.default)('【密碼】需為字串', next);
            }
            if (!password.trim()) {
                return (0, appError_1.default)('【密碼】必填', next);
            }
            if (!validator_1.default.isEmail(email)) {
                return (0, appError_1.default)('請輸入正確信箱格式', next);
            }
            req.body.password = password.replace(/['<>]/g, '');
            const user = yield User_1.default.findOne({ email }).select('+password');
            if (!user) {
                return (0, appError_1.default)('帳號或密碼錯誤，請重新輸入！', next);
            }
            const isPasswordCorrect = yield bcryptjs_1.default.compare(req.body.password, user.password);
            if (!isPasswordCorrect) {
                return (0, appError_1.default)('帳號或密碼錯誤，請重新輸入！', next);
            }
            (0, generateJWT_1.default)(user, res);
        });
    },
    updateUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, confirmPassword } = req.body;
            const reqUser = req.user;
            if (typeof password !== 'string') {
                return (0, appError_1.default)('【密碼】需為字串', next);
            }
            if (typeof confirmPassword !== 'string') {
                return (0, appError_1.default)('【確認密碼】需為字串', next);
            }
            if (!password.trim() || !confirmPassword.trim()) {
                return (0, appError_1.default)('有欄位未填寫', next);
            }
            if (!validator_1.default.isLength(password, { min: 8 })) {
                return (0, appError_1.default)('【密碼】需 8 碼以上', next);
            }
            if (!validator_1.default.isStrongPassword(password)) {
                return (0, appError_1.default)('【密碼】需包含各一個大小寫英文、數字和符號', next);
            }
            if (validator_1.default.matches(password, /['<>]/g)) {
                return (0, appError_1.default)("【密碼】請勿使用 ' < >", next);
            }
            if (password !== confirmPassword) {
                return (0, appError_1.default)('【密碼】不一致', next);
            }
            if (!(0, mongoose_1.isValidObjectId)(reqUser._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            const user = yield User_1.default.findById(reqUser._id).select('+password');
            if (!user) {
                return (0, appError_1.default)('【重設密碼】無此用戶', next);
            }
            const isPasswordSame = yield bcryptjs_1.default.compare(password, user.password);
            if (isPasswordSame) {
                return (0, appError_1.default)('請重新設置密碼', next);
            }
            req.body.password = yield bcryptjs_1.default.hash(password, 12);
            yield User_1.default.findByIdAndUpdate(reqUser._id, { 'password': req.body.password });
            (0, responseSuccess_1.default)(res, '重設密碼完成');
        });
    },
    updateUserInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { avatar, name, sex } = req.body;
            const reqUser = req.user;
            const regexAvatar = /^https/g;
            if (typeof avatar !== 'string') {
                return (0, appError_1.default)('【大頭照】需為網址字串', next);
            }
            if (!avatar.trim()) {
                return (0, appError_1.default)('【大頭照】必填', next);
            }
            if (!regexAvatar.test(avatar)) {
                return (0, appError_1.default)('【大頭照】網址開頭需為 https', next);
            }
            if (typeof name !== 'string') {
                return (0, appError_1.default)('【暱稱】需為字串', next);
            }
            if (!name.trim()) {
                return (0, appError_1.default)('【暱稱】必填', next);
            }
            if (!validator_1.default.isLength(name, { min: 2 })) {
                return (0, appError_1.default)('【暱稱】至少 2 個字元以上', next);
            }
            if (typeof sex !== 'string') {
                return (0, appError_1.default)('【性別】需為字串', next);
            }
            if (!sex.trim()) {
                return (0, appError_1.default)('【性別】必填', next);
            }
            if (sex !== 'male' && sex !== 'female') {
                return (0, appError_1.default)('【性別】無此選項', next);
            }
            if (!(0, mongoose_1.isValidObjectId)(reqUser._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            const newUserInfo = yield User_1.default.findByIdAndUpdate(reqUser._id, {
                avatar,
                name,
                sex,
                updatedAt: Date.now(),
            }, { returnDocument: 'after' });
            if (!newUserInfo) {
                return (0, appError_1.default)('【更新個人資料】無此用戶', next);
            }
            (0, responseSuccess_1.default)(res, newUserInfo);
        });
    },
    getUserLikePostList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(req.user._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            const result = yield Post_1.default.find({
                likes: {
                    $in: [req.user._id]
                }
            }).populate({
                path: 'userID',
                select: 'name avatar',
            });
            (0, responseSuccess_1.default)(res, result);
        });
    },
    followUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.params;
            const reqUser = req.user;
            if (!(0, mongoose_1.isValidObjectId)(userID)) {
                return (0, appError_1.default)('追蹤的用戶 ID 格式有誤', next);
            }
            if (!(0, mongoose_1.isValidObjectId)(reqUser._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            // Types.ObjectId 需要轉換為 string 才能比對是否為同一人
            const reqUserID = reqUser._id.toString();
            if (reqUserID === userID) {
                return (0, appError_1.default)('無法追蹤自己唷', next);
            }
            const result = yield User_1.default.findById(userID).exec();
            if (!result) {
                return (0, appError_1.default)('沒有此帳號', next);
            }
            const resAddFollowing = yield User_1.default.updateOne({
                _id: reqUser._id,
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
            if (resAddFollowing.modifiedCount === 0) {
                return (0, appError_1.default)('追蹤失敗', next);
            }
            const resAddFollowers = yield User_1.default.updateOne({
                _id: userID,
                "followers.user": {
                    $ne: reqUser._id
                }
            }, {
                $addToSet: {
                    followers: {
                        user: reqUser._id
                    }
                }
            });
            if (resAddFollowers.modifiedCount === 0) {
                return (0, appError_1.default)('新增追蹤者失敗', next);
            }
            (0, responseSuccess_1.default)(res, '追蹤成功');
        });
    },
    cancelFollowUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.params;
            const reqUser = req.user;
            if (!(0, mongoose_1.isValidObjectId)(userID)) {
                return (0, appError_1.default)('取消追蹤的用戶 ID 格式有誤', next);
            }
            if (!(0, mongoose_1.isValidObjectId)(reqUser._id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            // Types.ObjectId 需要轉換為 string 才能比對是否為同一人
            const reqUserID = reqUser._id.toString();
            if (reqUserID === userID) {
                return (0, appError_1.default)('無法取消追蹤自己唷', next);
            }
            const result = yield User_1.default.findById(userID).exec();
            if (!result) {
                return (0, appError_1.default)('沒有此帳號', next);
            }
            const resPullFollowing = yield User_1.default.updateOne({
                _id: reqUser._id,
            }, {
                $pull: {
                    following: {
                        user: userID,
                    }
                }
            });
            if (resPullFollowing.modifiedCount === 0) {
                return (0, appError_1.default)('取消追蹤失敗', next);
            }
            const resPullFollowers = yield User_1.default.updateOne({
                _id: userID,
            }, {
                $pull: {
                    followers: {
                        user: reqUser._id,
                    }
                }
            });
            if (resPullFollowers.modifiedCount === 0) {
                return (0, appError_1.default)('移除追蹤者失敗', next);
            }
            (0, responseSuccess_1.default)(res, '取消追蹤成功');
        });
    },
    getUserFollowing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.user;
            if (!(0, mongoose_1.isValidObjectId)(_id)) {
                return (0, appError_1.default)('用戶 ID 格式有誤', next);
            }
            const result = yield User_1.default.findById(_id, '-followers').populate({
                path: 'following.user',
                select: 'name avatar',
            });
            if (!result) {
                return (0, appError_1.default)('【取得個人追蹤名單】失敗', next);
            }
            (0, responseSuccess_1.default)(res, result);
        });
    }
};
