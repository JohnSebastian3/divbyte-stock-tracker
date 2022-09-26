const Stock = require('../models/Stock');
const mongoose = require('mongoose');

module.exports = {
  getDashboard: async (req, res) => {
    try {
        const stockItems = await Stock.find({userId: req.user.id});
        res.render('dashboard.ejs', {stocks: stockItems, user: req.user});
    } catch(err) {
      console.log(err);
    }
  },
  addStock: async (req, res) => {
    try {
      await Stock.create({
        ticker: req.body.ticker, 
        shares: req.body.shares, 
        basis: req.body.basis, 
        userId: req.user.id
      });
      console.log('Stock has been added!');
      res.redirect('/dashboard');
    } catch(err) {
      console.error(err);
    }
  },
  deleteStock: async(req, res) => {
    try {
      const id = req.params.id;
      // const id = req.body.stockIdFromJSFile;
      await Stock.findOneAndDelete({_id: id});
      res.redirect('/dashboard');
      console.log('Deleted Stock!');
    } catch(err) {
      console.log(err);
    }
  },
  editStock: async(req, res) => {
    const id = req.params.id.trim();

    try {
      await Stock.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(id)},
        {
          $set: {
            ticker: req.body.ticker,
            shares: req.body.shares,
            basis: req.body.basis
          }
        }
  
      )

      res.redirect('/dashboard');

    } catch(err) {
      console.log(err);
    }
  }
}