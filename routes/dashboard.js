const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const dashboardController = require('../controllers/dashboard');


router.get('/', ensureAuthenticated, dashboardController.getDashboard)
router.post('/addStock', dashboardController.addStock);
router.delete('/deleteStock', dashboardController.deleteStock);


module.exports = router;