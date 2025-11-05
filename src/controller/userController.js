const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  const { name, username, email, password, role } = req.body;
  if (!name || !username || !email || !password || !role) {
    return res.status(400).json({ message: 'Semua kolom harus diisi!' });
  }

  try {
    const lowercaseUsername = username.toLowerCase();
    const lowercaseEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(name, lowercaseUsername, lowercaseEmail, hashedPassword, role);

    res.status(201).json({
      message: 'User berhasil dibuat!',
      user: { ...user, password: undefined },
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat user, coba lagi!', error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data user!', error: err.message });
  }
};

const searchUsers = async (req, res) => {
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Masukkan kata kunci untuk pencarian!' });
  }

  try {
    const users = await userModel.searchUsers(searchTerm);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mencari user, coba lagi!', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await userModel.deleteUser(userId);

    if (result.message === 'User tidak ditemukan!') {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus user, coba lagi!', error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, username, email, role } = req.body;

  if (!name || !username || !email || !role) {
    return res.status(400).json({ message: 'Semua kolom harus diisi!' });
  }

  try {
    const result = await userModel.updateUser(userId, name, username, email, role);

    if (result.message === 'Tidak ada perubahan yang dilakukan pada user!') {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui user, coba lagi!', error: err.message });
  }
};

module.exports = { createUser, getUsers, searchUsers, updateUser, deleteUser };