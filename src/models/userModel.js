const bcrypt = require('bcryptjs');
const supabase = require('../models/db');

function sanitizeUsername(username) {
  return username
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function sanitizeEmail(email) {
  return email
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '');
}

const createUser = async (name, username, email, password, role = 'user') => {
  username = sanitizeUsername(username);
  email = sanitizeEmail(email);

  if (password.length < 6) throw new Error('Password minimal 6 karakter');

  const { data: existingUser, error: existingError } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${email},username.eq.${username}`);

  if (existingError) throw new Error(existingError.message);
  if (existingUser.length > 0) throw new Error('Email atau username sudah terdaftar');

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      name,
      username,
      email,
      password: hashedPassword,
      role
    }])
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
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);

  if (error) throw new Error(error.message);
  return data;
};

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

const updateUser = async (userId, name, username, email, password, role, profile_picture) => {
  username = sanitizeUsername(username);
  email = sanitizeEmail(email);

  const { data: existingUser, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError || !existingUser) throw new Error("User tidak ditemukan");

  const { data: usernameCheck, error: usernameError } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .neq('id', userId);

  if (usernameError) throw new Error(usernameError.message);
  if (usernameCheck.length > 0) throw new Error("Username sudah digunakan oleh user lain");

  const { data: emailCheck, error: emailError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .neq('id', userId);

  if (emailError) throw new Error(emailError.message);
  if (emailCheck.length > 0) throw new Error("Email sudah digunakan oleh user lain");

  const updateData = {
    name,
    username,
    email,
    role,
    profile_picture,
    updated_at: new Date(),
  };

  if (password) {
    if (password.length < 6) throw new Error("Password minimal 6 karakter");
    updateData.password = await bcrypt.hash(password, 10);
  }

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select();

  if (error) throw new Error(error.message);

  return {
    message: "User berhasil diperbarui!",
    user: data[0]
  };
};

const signupUser = async (name, username, email, password, role = 'user') => {
  return await createUser(name, username, email, password, role);
};

const signinUser = async (emailOrUsername, password) => {
  const identifier = sanitizeEmail(emailOrUsername.toLowerCase());

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

const countUsersByRole = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('role', { count: 'exact' });

  if (error) throw new Error(error.message);

  const userCount = data.filter(u => u.role === 'user').length;
  const adminCount = data.filter(u => u.role === 'admin').length;

  return { users: userCount, admins: adminCount };
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  searchUsers,
  signupUser,
  signinUser,
  countUsersByRole,
};