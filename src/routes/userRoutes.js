const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// ROUTES
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

router.get('/', userController.getUsers);
router.get('/search', userController.searchUsers);
router.post('/', userController.createUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;