import { Router } from 'express';
const router = Router();

import handleErrorAsync from '../utils/handleErrorAsync';

import UploadController from '../controllers/UploadController';

import isAuth from '../middlewares/isAuth';
import imgurUpload from '../middlewares/imgurUpload';

router.post('/', isAuth, imgurUpload, handleErrorAsync(
  /*
    #swagger.tags = ['Others']
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['avatar'] = {
      in: 'formData',
      type: 'file',
      required: 'true',
      description: '上傳用戶大頭貼',
    }
   */
  UploadController.upload
));

export default router;
