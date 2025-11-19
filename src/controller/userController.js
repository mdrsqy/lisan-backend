const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

function sanitizeUsername(username) {
  return username.toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

function sanitizeEmail(email) {
  return email.toLowerCase().trim().replace(/\s+/g, '');
}

const createUser = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password)
      return res.status(400).json({ error: "Harap isi semua field wajib" });

    const cleanUsername = sanitizeUsername(username);
    const cleanEmail = sanitizeEmail(email);

    if (password.length < 6)
      return res.status(400).json({ error: "Password minimal 6 karakter" });

    const user = await userModel.createUser(
      name,
      cleanUsername,
      cleanEmail,
      password,
      role
    );

    res.status(201).json({ message: "User berhasil dibuat!", user });
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
    const { name, username, email, password, role, profile_picture } = req.body;

    const cleanUsername = sanitizeUsername(username);
    const cleanEmail = sanitizeEmail(email);

    if (!name || !cleanUsername || !cleanEmail)
      return res.status(400).json({ error: "Nama, username, dan email wajib diisi" });

    if (password && password.length < 6)
      return res.status(400).json({ error: "Password minimal 6 karakter" });

    const result = await userModel.updateUser(
      userId,
      name,
      cleanUsername,
      cleanEmail,
      password,
      role,
      profile_picture
    );

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

    const cleanUsername = sanitizeUsername(username);
    const cleanEmail = sanitizeEmail(email);

    if (!name || !cleanUsername || !cleanEmail || !password)
      return res.status(400).json({ error: "Harap isi semua field wajib" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password minimal 6 karakter" });

    const user = await userModel.signupUser(
      name,
      cleanUsername,
      cleanEmail,
      password,
      role
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Signup berhasil", token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password)
      return res.status(400).json({ error: "Email/Username dan Password wajib diisi" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password minimal 6 karakter" });

    const user = await userModel.signinUser(emailOrUsername, password);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Signin berhasil", token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const countUsersByRole = async (req, res) => {
  try {
    const counts = await userModel.countUsersByRole();
    res.status(200).json(counts);
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
  signin,
  countUsersByRole
};