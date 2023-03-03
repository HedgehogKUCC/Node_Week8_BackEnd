"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseSuccess_1 = __importDefault(require("../services/responseSuccess"));
exports.default = (user, res, httpStatus = 200) => {
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_DAY,
    });
    user.password = undefined;
    (0, responseSuccess_1.default)(res, { "user": {
            token,
            name: user.name,
        }
    }, httpStatus);
};
