const express = require('express');
const router = express.Router();
const announcementController = require('../controller/announcementController');

router.post('/', announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);
router.get('/active', announcementController.getActiveAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);
router.put('/:id', announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;