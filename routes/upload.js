const express = require('express');
const router = express.Router();

import handleErrorAsync from '../utils/handleErrorAsync';

const UploadController = require('../controllers/UploadController');

const isAuth = require('../middlewares/isAuth');
const imgurUpload = require('../middlewares/imgurUpload');

router.post('/', isAuth, imgurUpload, handleErrorAsync(UploadController.upload));

module.exports = router;
