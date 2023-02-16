"use strict";
const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../utils/handleErrorAsync');
const UploadController = require('../controllers/UploadController');
const isAuth = require('../middlewares/isAuth');
const imgurUpload = require('../middlewares/imgurUpload');
router.post('/', isAuth, imgurUpload, handleErrorAsync(UploadController.upload));
module.exports = router;
