const express = require('express');
const router = express.Router();

const handleErrorAsync = require('../utils/handleErrorAsync');
const PostController = require('../controllers/PostController');

const isAuth = require('../middlewares/isAuth');

router.get('/', isAuth, handleErrorAsync(PostController.getPosts));
router.post('/', isAuth, handleErrorAsync(PostController.insertPost));

module.exports = router;