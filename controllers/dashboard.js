const Stock = require('../models/Stock');
const mongoose = require('mongoose');
const axios = require('axios');
const formatNumber = require('../public/js/format');

module.exports = {
  getDashboard: async (req, res) => {
    try {
      // TODO: AXIOS to get all stocks to dashboard
        const stockItems = await Stock.find({userId: req.user.id});

        let stockList = [];
        let annualDividend = 0;
        let dividendYield = 0;
        let totalProfitLoss = 0;
        let portfolioValue = 0;
        let dividendFrequency;

        for(let i = 0; i < stockItems.length; i++) {
          const currentStock = {};
          let {ticker, shares, basis} = stockItems[i];

          currentStock.ticker = ticker;
          currentStock.shares = formatNumber(shares);
          currentStock.basis = formatNumber(basis);

          const divResponse = await axios.get(
            `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`
          );

          const quoteResponse = await axios.get(
            `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`
          )

          const metrics = await axios.get(
            `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${ticker}?limit=40&apikey=ac08be8670bfbfba904e1e17d7596342`
          )


          const currentPrice = quoteResponse.data[0].price;
          const change = quoteResponse.data[0].change;
          const changesPercentage = quoteResponse.data[0].changesPercentage;

          currentStock.change = formatNumber(change);
          currentStock.changesPercentage = formatNumber(changesPercentage);
          currentStock.currentPrice = formatNumber(currentPrice);

          const profitTotal = ((shares * currentPrice) - (shares * basis));
          totalProfitLoss += Number(profitTotal);

          portfolioValue += shares * currentPrice;

          currentStock.profitTotal = formatNumber(profitTotal);

          if(divResponse.data.historical) {
            const currentDivInfo = divResponse.data.historical[0];
            const pastDivInfo = divResponse.data.historical[1];
            let firstMonth = currentDivInfo.paymentDate.slice(5, 7);
            let secondMonth = pastDivInfo.paymentDate.slice(5, 7);
            
            if(Number(firstMonth) < 10) { 
              // Gets rid of zero at the front
              firstMonth = Number(firstMonth.slice(1));
            } else {
              firstMonth = Number(firstMonth);
            }
      
            if(Number(secondMonth) < 10) {
              secondMonth = Number(secondMonth.slice(1));
            } else {
              secondMonth = Number(secondMonth);
            }
      
            let diff = Math.abs(firstMonth - secondMonth);
            let payoutsPerYear = 0;
            if(diff % 12 === 0) {
              dividendFrequency = 'NA';
              payoutsPerYear = 0;
            } else if(diff % 6 === 0) {
              dividendFrequency = 'Semi-Annual';
              payoutsPerYear = 2;
            } else if (diff % 3 === 0) {
              dividendFrequency = 'Quarterly';
              payoutsPerYear = 4;
            } else if(diff % 1 === 0) {
              dividendFrequency = 'Monthly';
              payoutsPerYear = 12;
            }
            
            let dividend = currentDivInfo.dividend;
            dividendYield = ((dividend * payoutsPerYear / currentPrice) * 100).toFixed(2);
            annualDividend += shares * dividend * payoutsPerYear; // quarterly for now, will add algo to change this soon
            if(metrics.data[0].dividendPerShareTTM == 0 || metrics.data[0].dividendPerShareTTM === null) {
              dividendYield = '-';
              dividendFrequency = '-';
            }
            
            currentStock.dividendYield = dividendYield;
            currentStock.dividendFrequency = dividendFrequency;

          }

          stockList.push(currentStock);

          } 
          
        
        res.render('dashboard.ejs', {
          stocks: stockList, 
          totalProfitLoss: totalProfitLoss.toLocaleString('en-US', 
          {minimumFractionDigits: 2, maximumFractionDigits: 2}
          ),
          annualDividend: annualDividend.toLocaleString('en-US', 
          {minimumFractionDigits: 2, maximumFractionDigits: 2}
          ),
          portfolioValue: portfolioValue.toLocaleString('en-US', 
          {minimumFractionDigits: 2, maximumFractionDigits: 2}
          ),
          user: req.user,
        });
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