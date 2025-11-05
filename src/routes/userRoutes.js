const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

const validateUserInput = (req, res, next) => {
  const { name, username, email, password, role } = req.body;

  if (!name || !username || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, username, email, password, role) are required' });
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const validRoles = ['user', 'admin', 'superadmin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Valid roles are ${validRoles.join(', ')}` });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

router.post('/', validateUserInput, userController.createUser);
router.get('/', userController.getUsers);
router.get('/search', userController.searchUsers);
router.put('/:userId', validateUserInput, userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;