const bcrypt = require('bcryptjs');
const supabase = require('../models/db');

// ==================================================
// CREATE USER
// ==================================================
const createUser = async (full_name, username, email, password, role = 'user') => {
  username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  email = email.toLowerCase();
  if (password.length < 6) throw new Error('Password minimal 6 karakter');

  // cek apakah email atau username sudah terdaftar
  const { data: existingUser, error: existingError } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${email},username.eq.${username}`);
  if (existingError) throw new Error(existingError.message);
  if (existingUser.length > 0) throw new Error('Email atau username sudah terdaftar');

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user baru
  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name, username, email, password: hashedPassword, role }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

// ==================================================
// GET ALL USERS
// ==================================================
const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// ==================================================
// SEARCH USERS
// ==================================================
const searchUsers = async (searchTerm) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);

  if (error) throw new Error(error.message);
  return data;
};

// ==================================================
// DELETE USER
// ==================================================
const deleteUser = async (userId) => {
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId);

  if (checkError) throw new Error(checkError.message);
  if (!existingUser || existingUser.length === 0)
    return { message: 'User tidak ditemukan!' };

  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) throw new Error(error.message);
  return { message: 'User berhasil dihapus!', userId };
};

// ==================================================
// UPDATE USER
// ==================================================
const updateUser = async (userId, full_name, username, email, password, role) => {
  username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  email = email.toLowerCase();

  const updateData = {
    full_name,
    username,
    email,
    role,
    updated_at: new Date(),
  };

  if (password) {
    if (password.length < 6) throw new Error('Password minimal 6 karakter');
    updateData.password = await bcrypt.hash(password, 10);
  }

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select();

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return { message: 'User tidak ditemukan!' };

  return { message: 'User berhasil diperbarui!', user: data[0] };
};

// ==================================================
// SIGNUP USER
// ==================================================
const signupUser = async (full_name, username, email, password, role = 'user') => {
  return await createUser(full_name, username, email, password, role);
};

// ==================================================
// SIGNIN USER
// ==================================================
const signinUser = async (emailOrUsername, password) => {
  const identifier = emailOrUsername.toLowerCase();

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${identifier},username.eq.${identifier}`);

  if (error) throw new Error(error.message);
  if (!users || users.length === 0) throw new Error('User tidak ditemukan');

  const user = users[0];
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error('Password salah');

  return user;
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  searchUsers,
  signupUser,
  signinUser,
};