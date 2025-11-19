const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

router.get('/count', userController.countUsersByRole);
router.get('/search', userController.searchUsers);
router.get('/', userController.getUsers);

router.post('/', userController.createUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;