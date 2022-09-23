const Stock = require('../models/Stock');

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
      const id = req.body.stockIdFromJSFile;
      await Stock.findOneAndDelete({_id: id});
      res.json('deleted');
      console.log('Deleted Stock!');
    } catch(err) {
      console.log(err);
    }
  }
}