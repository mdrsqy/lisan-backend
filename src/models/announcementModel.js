const supabase = require('./db');

// ==================================================
// CREATE ANNOUNCEMENT
// ==================================================
const createAnnouncement = async (title, description, image_url, video_url) => {
  const { data, error } = await supabase
    .from('announcements')
    .insert([{ title, description, image_url, video_url }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

// ==================================================
// GET ALL ANNOUNCEMENTS
// ==================================================
const getAnnouncements = async () => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// ==================================================
// SEARCH ANNOUNCEMENTS
// ==================================================
const searchAnnouncements = async (query) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// ==================================================
// UPDATE ANNOUNCEMENT
// ==================================================
const updateAnnouncement = async (id, title, description, image_url, video_url) => {
  const updateData = {
    title,
    description,
    image_url,
    video_url,
    updated_at: new Date(),
  };

  const { data, error } = await supabase
    .from('announcements')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return { message: 'Pengumuman tidak ditemukan!' };

  return { message: 'Pengumuman berhasil diperbarui!', announcement: data[0] };
};

// ==================================================
// DELETE ANNOUNCEMENT
// ==================================================
const deleteAnnouncement = async (id) => {
  const { data: existing, error: checkError } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id);

  if (checkError) throw new Error(checkError.message);
  if (!existing || existing.length === 0) return { message: 'Pengumuman tidak ditemukan!' };

  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw new Error(error.message);

  return { message: 'Pengumuman berhasil dihapus!', id };
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  searchAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};