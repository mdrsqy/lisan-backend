const express = require('express');
const router = express.Router();
const announcementController = require('../controller/announcementController');

// ROUTES
router.post('/', announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);
router.get('/search', announcementController.searchAnnouncements);
router.put('/:id', announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;