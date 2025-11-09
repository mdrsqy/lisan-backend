const announcementModel = require('../models/announcementModel');

// ==================================================
// CREATE ANNOUNCEMENT
// ==================================================
const createAnnouncement = async (req, res) => {
  try {
    const { title, description, image_url, video_url } = req.body;
    const announcement = await announcementModel.createAnnouncement(title, description, image_url, video_url);
    res.status(201).json({ message: 'Pengumuman berhasil dibuat!', announcement });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==================================================
// GET ALL ANNOUNCEMENTS
// ==================================================
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await announcementModel.getAnnouncements();
    res.status(200).json(announcements);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==================================================
// SEARCH ANNOUNCEMENTS
// ==================================================
const searchAnnouncements = async (req, res) => {
  try {
    const { q } = req.query;
    const announcements = await announcementModel.searchAnnouncements(q);
    res.status(200).json(announcements);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==================================================
// UPDATE ANNOUNCEMENT
// ==================================================
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, video_url } = req.body;
    const result = await announcementModel.updateAnnouncement(id, title, description, image_url, video_url);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==================================================
// DELETE ANNOUNCEMENT
// ==================================================
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
  searchAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};