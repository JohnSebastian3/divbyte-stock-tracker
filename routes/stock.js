const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const stockController = require('../controllers/stock');

router.get('/:ticker', stockController.getStock);

module.exports = router;