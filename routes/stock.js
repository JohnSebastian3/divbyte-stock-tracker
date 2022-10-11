const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const stockController = require('../controllers/stock');

router.get('/:ticker', stockController.getStock);
router.post('/:ticker/addComment', stockController.addComment);

module.exports = router;