const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const profileController = require('../controllers/profile');


router.get('/:id', profileController.getProfile);
router.post('/:id/uploadPicture', upload.single("file"), profileController.uploadPicture);


module.exports = router;