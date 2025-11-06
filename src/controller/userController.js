const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const createUser = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    const user = await userModel.createUser(name, username, email, password, role);
    res.status(201).json({ message: 'User berhasil dibuat!', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await userModel.searchUsers(q);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, username, email, password, role } = req.body;
    const result = await userModel.updateUser(userId, name, username, email, password, role);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userModel.deleteUser(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signup = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    const user = await userModel.signupUser(name, username, email, password, role);
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ message: 'Signup berhasil', token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await userModel.signinUser(emailOrUsername, password);
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Signin berhasil', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  searchUsers,
  updateUser,
  deleteUser,
  signup,
  signin
};