const express = require('express');
const router = express.Router();

const handleErrorAsync = require('../utils/handleErrorAsync');
const PostController = require('../controllers/PostController');

const isAuth = require('../middlewares/isAuth');

router.get('/', isAuth, handleErrorAsync(PostController.getPosts));
router.post('/', isAuth, handleErrorAsync(PostController.insertPost));
router.delete('/', isAuth, handleErrorAsync(PostController.delAllPosts));
router.delete('/:id', isAuth, handleErrorAsync(PostController.delSinglePost));

module.exports = router;