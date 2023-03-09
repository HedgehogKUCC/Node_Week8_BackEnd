import { Router } from 'express';
const router = Router();

import handleErrorAsync from '../../utils/handleErrorAsync';

import UploadController from '../../controllers/UploadController';

import isAuth from '../../middlewares/isAuth';
import imgurUpload from '../../middlewares/imgurUpload';

router
  .route('/')
  .post(isAuth, imgurUpload, handleErrorAsync(
    /*
      #swagger.tags = ['Others']
      #swagger.summary = '上傳會員大頭貼'
      #swagger.path = '/api/upload'
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['avatar'] = {
        in: 'formData',
        type: 'file',
        required: true,
      }
      #swagger.responses[200] = {
        description: '上傳圖片成功',
        content: {
          "application/json": {
            schema: { $ref: '#/definitions/UploadImageSuccess' }
          }
        }
      }
    */
    UploadController.upload));

export default router;
