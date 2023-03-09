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
const image_size_1 = __importDefault(require("image-size"));
const imgur_1 = require("imgur");
const responseSuccess_1 = __importDefault(require("../services/responseSuccess"));
const appError_1 = __importDefault(require("../services/appError"));
exports.default = {
    upload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.originalUrl !== '/upload') {
                return (0, appError_1.default)(`伺服器收到 ${req.originalUrl} 與 /upload 不符 `, next);
            }
            if (typeof req.files === 'undefined' || !req.files.length) {
                return (0, appError_1.default)('請上傳圖片', next);
            }
            const files = req.files;
            if (files[0].fieldname !== 'avatar') {
                return (0, appError_1.default)(`FormData append name: avatar, but received ${files[0].fieldname}`, next);
            }
            const dimensions = (0, image_size_1.default)(files[0].buffer);
            if (typeof dimensions.width === 'undefined' || dimensions.width < 300) {
                return (0, appError_1.default)('圖片寬至少 300像素以上', next);
            }
            if (dimensions.width !== dimensions.height) {
                return (0, appError_1.default)('圖片寬高必須為 1:1', next);
            }
            const client = new imgur_1.ImgurClient({
                clientId: process.env.IMGUR_CLIENT_ID,
                clientSecret: process.env.IMGUR_CLIENT_SECRET,
                refreshToken: process.env.IMGUR_REFRESH_TOKEN,
            });
            const response = yield client.upload({
                image: files[0].buffer.toString('base64'),
                type: 'base64',
                album: process.env.IMGUR_ALBUM_ID
            });
            (0, responseSuccess_1.default)(res, response.data.link);
        });
    }
};
