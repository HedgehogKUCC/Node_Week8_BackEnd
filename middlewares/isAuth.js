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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const handleErrorAsync_1 = __importDefault(require("../utils/handleErrorAsync"));
const appError_1 = __importDefault(require("../services/appError"));
exports.default = (0, handleErrorAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = undefined;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return (0, appError_1.default)('請登入帳號', next, 401);
    }
    const decodeJWT = yield new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
    if (typeof decodeJWT === 'undefined' || typeof decodeJWT === 'string') {
        return (0, appError_1.default)('請登入帳號', next, 401);
    }
    req.user = yield User_1.default.findById(decodeJWT.id);
    if (!req.user) {
        return (0, appError_1.default)('請登入帳號', next, 401);
    }
    next();
}));
