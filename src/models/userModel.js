const bcrypt = require('bcryptjs');
const supabase = require('../models/db');

const createUser = async (name, username, email, password, role) => {
  username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  email = email.toLowerCase();
  if (password.length < 6) throw new Error('Password minimal 6 karakter');

  const { data: existingUser, error: existingError } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${email},username.eq.${username}`);
  if (existingError) throw new Error(existingError.message);
  if (existingUser.length > 0) throw new Error('Email atau username sudah terdaftar');

  const hashedPassword = await bcrypt.hash(password.toLowerCase(), 10);
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, username, email, password: hashedPassword, role }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
};

const searchUsers = async (searchTerm) => {
  const isNumeric = !isNaN(searchTerm);
  const query = supabase
    .from('users')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .or(`username.ilike.%${searchTerm}%`);
  if (isNumeric) query.or(`user_id.eq.${searchTerm}`);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

const deleteUser = async (userId) => {
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId);
  if (checkError || !existingUser || existingUser.length === 0)
    return { message: 'User tidak ditemukan!' };
  const { error } = await supabase.from('users').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
  return { message: 'User berhasil dihapus!', userId };
};

const updateUser = async (userId, name, username, email, password, role) => {
  username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  email = email.toLowerCase();
  const updateData = { name, username, email, role, updated_at: new Date() };
  if (password) {
    if (password.length < 6) throw new Error('Password minimal 6 karakter');
    updateData.password = await bcrypt.hash(password.toLowerCase(), 10);
  }
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('user_id', userId)
    .select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return { message: 'User tidak ditemukan!' };
  return { message: 'User berhasil diperbarui!', user: data[0] };
};

const signupUser = async (name, username, email, password, role) => {
  username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  email = email.toLowerCase();
  if (password.length < 6) throw new Error('Password minimal 6 karakter');
  const { data: existingUser, error: existingError } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${email},username.eq.${username}`);
  if (existingError) throw new Error(existingError.message);
  if (existingUser.length > 0) throw new Error('Email atau username sudah terdaftar');
  const hashedPassword = await bcrypt.hash(password.toLowerCase(), 10);
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, username, email, password: hashedPassword, role }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

const signinUser = async (emailOrUsername, password) => {
  const identifier = emailOrUsername.toLowerCase();
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${identifier},username.eq.${identifier}`);
  if (error) throw new Error(error.message);
  if (!users || users.length === 0) throw new Error('User tidak ditemukan');
  const user = users[0];
  const validPassword = await bcrypt.compare(password.toLowerCase(), user.password);
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
  signinUser
};