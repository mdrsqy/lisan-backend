const supabase = require('../models/db');

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

const searchUsers = async (searchTerm) => {
  try {
    // Menggunakan ilike untuk pencarian case-insensitive
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('name', `%${searchTerm}%`)  // Pencarian berdasarkan nama
      .or(`username.ilike.%${searchTerm}%`) // Pencarian berdasarkan username
      .or(`user_id::text.ilike.%${searchTerm}%`); // Pencarian berdasarkan user_id (di-cast ke teks)

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    throw new Error('Error searching users: ' + err.message);
  }
};

const updateUser = async (userId, name, username, email, role) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ name, username, email, role })
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return { message: 'Tidak ada perubahan yang dilakukan pada user!' };
    }

    return { message: 'User berhasil diperbarui!', user: data[0] };

  } catch (err) {
    throw new Error('Error updating user: ' + err.message);
  }
};

const deleteUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return { message: 'User tidak ditemukan!' };
    }

    return { message: 'User berhasil dihapus!', userId: data[0].user_id };

  } catch (err) {
    throw new Error('Error deleting user: ' + err.message);
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser, searchUsers };