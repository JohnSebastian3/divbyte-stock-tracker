const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const dashboardController = require('../controllers/dashboard');


router.get('/', ensureAuth, dashboardController.getDashboard)
router.post('/addStock', dashboardController.addStock);
router.delete('/deleteStock', dashboardController.deleteStock);


module.exports = router;