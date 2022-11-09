const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const profileController = require('../controllers/profile');


router.get('/:id', profileController.getProfile);
router.post('/:id/updateUser', upload.single("file"), profileController.updateUser);


module.exports = router;