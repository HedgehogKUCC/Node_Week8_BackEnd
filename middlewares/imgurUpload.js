"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
exports.default = (0, multer_1.default)({
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.png') {
            cb(new Error('圖片檔案格式只能上傳 jpg、png 格式'));
        }
        cb(null, true);
    }
}).any();
