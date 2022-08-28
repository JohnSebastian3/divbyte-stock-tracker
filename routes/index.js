const express = require('express');
const router = express.Router();


// @desc    Login/landing page
// @route   Get /
router.get('/', (req, res) => {
  res.render('login.ejs', req);
})

module.exports = router;