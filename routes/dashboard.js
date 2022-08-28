const express = require('express');
const router = express.Router();

const Stock = require('../models/Stock');

// @desc    Dashboard landing page
// @route   Get /dashboard
// router.get('/', async (req, res) => {
//   const stocks = await Stock.find({});
//   res.render('index.ejs', {stocks: stocks});
// })

// @desc    Add stock entry
// @route   POST /dashboard
// router.post('/', async (req, res) => {
//   try {
//     await Stock.create(req.body);
//     res.redirect('/dashboard');
//   } catch(err) {
//     console.error(err);
//   }
// })


module.exports = router;