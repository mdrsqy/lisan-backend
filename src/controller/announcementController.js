const announcementModel = require('../models/announcementModel');

const createAnnouncement = async (req, res) => {
  try {
    const { user_id, title, message, is_active } = req.body;

    if (!user_id || !title || !message)
      return res.status(400).json({ error: "user_id, title dan message wajib diisi" });

    const announcement = await announcementModel.createAnnouncement(
      user_id,
      title,
      message,
      is_active
    );

    res.status(201).json({ message: "Announcement berhasil dibuat", announcement });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const data = await announcementModel.getAnnouncements();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getActiveAnnouncements = async (req, res) => {
  try {
    const data = await announcementModel.getActiveAnnouncements();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await announcementModel.getAnnouncementById(id);
    res.status(200).json(announcement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, is_active } = req.body;

    const announcement = await announcementModel.updateAnnouncement(
      id,
      title,
      message,
      is_active
    );

    res.status(200).json({ message: "Announcement berhasil diupdate", announcement });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await announcementModel.deleteAnnouncement(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getActiveAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement
};