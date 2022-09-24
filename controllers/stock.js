const axios = require("axios");

module.exports = {
  getStock: async (req, res) => {
    console.log(req.params.ticker);
    try {
      const dividendInfo = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${req.params.ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`,
        {
          params: {
            _limit: 2
          }
        }
      )

      const profile = await axios.get(
        `https://financialmodelingprep.com/api/v3/profile/${req.params.ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`,
      )

      console.log(dividendInfo.data.historical[0]);
      // console.log("QUOTE:", dividendInfo.data);
      let freq;
      let dividendYield;
      
      if(Object.keys(dividendInfo.data).length > 0 && dividendInfo.data.historical[0].dividend != 0) {
        let firstMonth = dividendInfo.data.historical[0].paymentDate.slice(5, 7);
        if(Number(firstMonth) < 10) {
          firstMonth = Number(firstMonth.slice(1));
        } else {
          firstMonth = Number(firstMonth);
        }
  
        let secondMonth = dividendInfo.data.historical[1].paymentDate.slice(5, 7);
        
        if(Number(secondMonth) < 10) {
          secondMonth = Number(secondMonth.slice(1));
        } else {
          secondMonth = Number(secondMonth);
        }
  
        let diff = Math.abs(firstMonth - secondMonth);
        if(diff % 12 === 0) {
          freq = 'Annual';
          dividendYield = ((dividendInfo.data.historical[0].dividend  / profile.data[0].price) * 100).toFixed(2);
        } else if(diff % 6 === 0) {
          freq = 'Semi-Annual';
          dividendYield = ((dividendInfo.data.historical[0].dividend * 2 / profile.data[0].price) * 100).toFixed(2);
        } else if (diff % 3 === 0) {
          freq = 'Quarterly';
          dividendYield = ((dividendInfo.data.historical[0].dividend * 4 / profile.data[0].price) * 100).toFixed(2);
        } else if(diff % 1 === 0) {
          freq = 'Monthly';
          dividendYield = ((dividendInfo.data.historical[0].dividend * 12 / profile.data[0].price) * 100).toFixed(2);

        }
      }

      
      // console.log("PROFILE:",profile.data);
      res.render('stock.ejs', {profile: profile.data[0], 
        payoutFreq: freq, 
        ticker: req.params.ticker, 
        divYield: dividendYield,
        divPayout: dividendInfo.data.historical[0].dividend,
      });

    }
    catch(err) {
      console.log(err);
    }
  } 
}
