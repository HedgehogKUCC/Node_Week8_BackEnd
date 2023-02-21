import { Router } from 'express';
const router = Router();

import handleErrorAsync from '../utils/handleErrorAsync';

import UploadController from '../controllers/UploadController';

import isAuth from '../middlewares/isAuth';
import imgurUpload from '../middlewares/imgurUpload';

router.post('/', isAuth, imgurUpload, handleErrorAsync(UploadController.upload));

export default router;
