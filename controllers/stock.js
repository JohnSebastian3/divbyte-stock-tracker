const axios = require("axios");

module.exports = {
  getStock: async (req, res) => {
    try {
      const dividendInfo = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${req.params.ticker}?&apikey=ac08be8670bfbfba904e1e17d7596342`
      )

      const profile = await axios.get(
        `https://financialmodelingprep.com/api/v3/profile/${req.params.ticker}?apikey=ac08be8670bfbfba904e1e17d7596342`,
      )

      const metrics = await axios.get(
        `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${req.params.ticker}?limit=40&apikey=ac08be8670bfbfba904e1e17d7596342`
      )

      

      let freq;
      let dividendYield;
      let dividend;
      
      if(Object.keys(dividendInfo.data).length > 0 ) {
        if(dividendInfo.data.historical[0].dividend != 0) {
          
          let firstMonth = dividendInfo.data.historical[0].paymentDate.slice(5, 7);
          dividend = dividendInfo.data.historical[0].dividend.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          });
  
  
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
        
        if(dividendInfo.data.historical[0].dividend == 0) {
          dividend = dividendInfo.data.historical[0].dividend.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          });
        }

      } 

     

      // FIX undefined
      if(dividendYield) {
        dividendYield = dividendYield.toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })
      }

      const keyMetrics = {
        sector: profile.data[0].sector,
        industry: profile.data[0].industry,
        beta: profile.data[0].beta,
        website: profile.data[0].website,
        marketCap: profile.data[0].mktCap,
        peRatioTTM: metrics.data[0].peRatioTTM,
        dividendYieldTTM: metrics.data[0].dividendYieldPercentageTTM,
        payoutRatioTTM: metrics.data[0].payoutRatioTTM,
        divPerShareTTM: metrics.data[0].dividendPerShareTTM,
      }

      
      res.render('stock.ejs', {profile: profile.data[0], 
        payoutFreq: freq ? freq : '-', 
        ticker: req.params.ticker, 
        divYield: dividendYield > 0 ? dividendYield : '0.00',
        // FIX undefined
        divPayout: Object.keys(dividendInfo.data).length != 0 ? dividend : '0.00',
        metrics: keyMetrics,
      });

    }
    catch(err) {
      console.log(err);
    }
  } 
}
