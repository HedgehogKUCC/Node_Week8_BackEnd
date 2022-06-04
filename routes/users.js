const express = require('express');
const router = express.Router();

const handleErrorAsync = require('../utils/handleErrorAsync');
const UserController = require('../controllers/UserController');

const isAuth = require('../middlewares/isAuth');

router.post('/sign_up', handleErrorAsync(UserController.insertUser));
router.post('/sign_in', handleErrorAsync(UserController.searchUserLogin));
router.post('/updatePassword', isAuth, handleErrorAsync(UserController.updateUserPassword));
router.get('/profile', isAuth, handleErrorAsync(UserController.getUser));
router.patch('/profile', isAuth, handleErrorAsync(UserController.updateUserInfo));

module.exports = router;
