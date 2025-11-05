const supabase = require('../models/db');

// CREATE
const createUser = async (name, username, email, password, role) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, username, email, password, role }]);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw new Error('Error creating user: ' + err.message);
  }
};

// PRINT
const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw new Error('Error fetching users: ' + err.message);
  }
};

// SEARCH
const searchUsers = async (searchTerm) => {
  try {
    const isNumeric = !isNaN(searchTerm);
    const query = supabase
      .from('users')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .or(`username.ilike.%${searchTerm}%`);
    if (isNumeric) {
      query.or(`user_id.eq.${searchTerm}`);
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw new Error('Error searching users: ' + err.message);
  }
};

// DELETE
const deleteUser = async (userId) => {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId); 
    if (checkError || !existingUser || existingUser.length === 0) {
      return { message: 'User tidak ditemukan!' };
    }
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return { message: 'User berhasil dihapus!', userId: userId };
  } catch (err) {
    console.error('Error deleting user:', err);
    throw new Error('Error deleting user: ' + err.message);
  }
};

// UPDATE
const updateUser = async (userId, name, username, email, role) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        username,
        email,
        role,
        updated_at: new Date()
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return { message: 'User tidak ditemukan atau tidak ada perubahan pada data!' };
    }

    return { message: 'User berhasil diperbarui!', user: data[0] };

  } catch (err) {
    throw new Error('Error updating user: ' + err.message);
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser, searchUsers };