const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');


// @desc    Landing page
// @route   Get /
router.get('/', (req, res) => {
  res.render('welcome.ejs', req);
})

// @desc    LDashboard
// @route   Get /dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard.ejs', {
    name: req.user.name
  });
})


module.exports = router;