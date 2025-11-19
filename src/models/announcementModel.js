const supabase = require('./db');

const createAnnouncement = async (user_id, title, message, is_active = true) => {
  const { data, error } = await supabase
    .from('announcements')
    .insert([{ user_id, title, message, is_active }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

const getAnnouncements = async () => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const getActiveAnnouncements = async () => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const getAnnouncementById = async (id) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw new Error("Announcement tidak ditemukan");
  return data;
};

const updateAnnouncement = async (id, title, message, is_active) => {
  const { data: exists, error: existError } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single();

  if (existError || !exists) throw new Error("Announcement tidak ditemukan");

  const updateData = {
    title,
    message,
    is_active,
    updated_at: new Date()
  };

  const { data, error } = await supabase
    .from('announcements')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

const deleteAnnouncement = async (id) => {
  const { data: exists, error: existError } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single();

  if (existError || !exists) throw new Error("Announcement tidak ditemukan");

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { message: "Announcement berhasil dihapus", id };
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getActiveAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement
};