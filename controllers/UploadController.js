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
const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');
const appError = require('../utils/appError');
const success = require('../services/responseSuccess');
module.exports = {
    upload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.originalUrl !== '/upload') {
                return appError(`伺服器收到 ${req.originalUrl} 與 /upload 不符 `, next);
            }
            if (!req.files.length) {
                return appError('請上傳圖片', next);
            }
            const dimensions = sizeOf(req.files[0].buffer);
            if (dimensions.width < 300) {
                return appError('圖片寬至少 300像素以上', next);
            }
            if (dimensions.width !== dimensions.height) {
                return appError('圖片寬高必須為 1:1', next);
            }
            const client = new ImgurClient({
                clientId: process.env.IMGUR_CLIENT_ID,
                clientSecret: process.env.IMGUR_CLIENT_SECRET,
                refreshToken: process.env.IMGUR_REFRESH_TOKEN,
            });
            const response = yield client.upload({
                image: req.files[0].buffer.toString('base64'),
                type: 'base64',
                album: process.env.IMGUR_ALBUM_ID
            });
            success(res, response.data.link);
        });
    }
};
