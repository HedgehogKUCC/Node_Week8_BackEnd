import path from 'path';

import multer from 'multer';

export default multer({
    limits: {
        fileSize: 2*1024*1024,
    },
    fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if ( ext !== '.jpg' && ext !== '.png' ) {
            cb(new Error('圖片檔案格式只能上傳 jpg、png 格式'));
        }
        cb(null, true);
    }
}).any();
