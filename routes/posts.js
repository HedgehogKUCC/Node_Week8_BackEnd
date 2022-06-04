const express = require('express');
const router = express.Router();

const handleErrorAsync = require('../utils/handleErrorAsync');
const PostController = require('../controllers/PostController');

router.get('/', handleErrorAsync(PostController.getPosts));
router.post('/', handleErrorAsync(PostController.insertPost));

module.exports = router;