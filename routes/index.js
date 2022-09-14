const express = require('express');
const router = express.Router();
const homeRouter = require('../controllers/home');
const {ensureAuthenticated} = require('../config/auth');


// @desc    Landing page
// @route   Get /
router.get('/', homeRouter.getHome);

// @desc    LDashboard
// @route   Get /dashboard
// router.get('/dashboard', ensureAuthenticated, (req, res) => {
//   res.render('dashboard.ejs', {
//     name: req.user.name
//   });
// })


module.exports = router;