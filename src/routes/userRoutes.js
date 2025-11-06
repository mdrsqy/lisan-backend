const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/search', userController.searchUsers);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

module.exports = router;