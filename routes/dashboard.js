const express = require('express');
const router = express.Router();

const Stock = require('../models/Stock');

// @desc    Dashboard landing page
// @route   Get /dashboard
router.get('/', async (req, res) => {
  try {
      const stockItems = await Stock.find({userId: req.user.id});
      res.render('dashboard.ejs', {stocks: stockItems, user: req.user});
  } catch(err) {
    console.log(err);
  }
})

// @desc    Add stock entry
// @route   POST /dashboard
router.post('/', async (req, res) => {
  try {
    await Stock.create({ticker: req.body.ticker, shares: req.body.shares, basis: req.body.basis, userId: req.user.id});
    console.log('Stock has been added!');
    res.redirect('/dashboard');
  } catch(err) {
    console.error(err);
  }
})

// @desc    remove stock entry
// @route   Get /remove/:id
router.get('/remove/:id', async (req, res) => {
  const id = req.params.id;
  Stock.findByIdAndRemove(id, err => {
    if(err) return res.status(500).send(err);
    res.redirect('/dashboard');
  })
})


module.exports = router;