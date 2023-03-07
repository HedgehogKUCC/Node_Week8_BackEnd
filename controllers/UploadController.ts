import { Request, Response, NextFunction } from 'express';

import sizeOf from 'image-size';
import { ImgurClient } from 'imgur';

import success from '../services/responseSuccess';
import appError from '../services/appError';

export default {
    async upload(req: Request, res: Response, next: NextFunction) {
        if ( req.originalUrl !== '/upload' ) {
            return appError(`伺服器收到 ${req.originalUrl} 與 /upload 不符 `, next);
        }

        if ( typeof req.files === 'undefined' || !req.files.length ) {
            return appError('請上傳圖片', next);
        }

        const files = req.files as Express.Multer.File[];

        if ( files[0].fieldname !== 'avatar' ) {
            return appError(`FormData append name: avatar, but received ${files[0].fieldname}`, next);
        }

        const dimensions = sizeOf(files[0].buffer);
        if ( typeof dimensions.width === 'undefined' || dimensions.width < 300 ) {
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
            image: files[0].buffer.toString('base64'),
            type: 'base64',
            album: process.env.IMGUR_ALBUM_ID
        });
        success(res, response.data.link);
    }
}
