const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');

import success from '../services/responseSuccess';
import appError from '../services/appError';

module.exports = {
    async upload(req, res, next) {
        if ( req.originalUrl !== '/upload' ) {
            return appError(`伺服器收到 ${req.originalUrl} 與 /upload 不符 `, next);
        }

        if ( !req.files.length ) {
            return appError('請上傳圖片', next);
        }

        const dimensions = sizeOf(req.files[0].buffer);
        if ( dimensions.width < 300 ) {
            return appError('圖片寬至少 300像素以上', next);
        }

        if ( dimensions.width !== dimensions.height ) {
            return appError('圖片寬高必須為 1:1', next);
        }

        const client = new ImgurClient({
            clientId: process.env.IMGUR_CLIENT_ID,
            clientSecret: process.env.IMGUR_CLIENT_SECRET,
            refreshToken: process.env.IMGUR_REFRESH_TOKEN,
        });

        const response = await client.upload({
            image: req.files[0].buffer.toString('base64'),
            type: 'base64',
            album: process.env.IMGUR_ALBUM_ID
        });
        success(res, response.data.link);
    }
}
