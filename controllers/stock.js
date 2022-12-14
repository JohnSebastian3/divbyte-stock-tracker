const axios = require("axios");
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const updateLocale = require('dayjs/plugin/updateLocale');
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: 'a few seconds',
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})

dayjs.extend(relativeTime);



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
      let divDate;
      
      if(Object.keys(dividendInfo.data).length > 0 ) {
        if(dividendInfo.data.historical[0].dividend != 0) {
          divDate = dividendInfo.data.historical[0].label;
          let firstMonth = Number(new Date(dividendInfo.data.historical[0].paymentDate).getMonth());
          dividend = dividendInfo.data.historical[0].dividend.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          });

    
          let secondMonth;
          if(dividendInfo.data.historical.length > 1) {
            secondMonth = Number(new Date(dividendInfo.data.historical[1].paymentDate).getMonth());
          }
          
    
          let diff = Math.abs(firstMonth - secondMonth);
          if(Number.isNaN(parseFloat(diff))) {
            freq = '-';
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

      const comments = await Comment.find({ticker: req.params.ticker});
      const users = [];
      const dates = [];
      for(let i = 0; i < comments.length; i++) {
        const currUser = await User.findById(comments[i].user);
        users.push(currUser);
      
        const timeSince = dayjs(comments[i].date).fromNow();
        dates.push(timeSince);
      } 
      
      res.render('stock.ejs', {
        profile: profile.data[0], 
        payoutFreq: freq, 
        ticker: req.params.ticker, 
        divYield: dividendYield,
        // FIX undefined
        divPayout: Object.keys(dividendInfo.data).length != 0 ? dividend : '0.00',
        divDate: divDate,
        metrics: keyMetrics,
        comments: comments,
        commentUsers: users,
        commentDates: dates,
        user: req.user,
      });

    }
    catch(err) {
      console.log(err);
    }
  },
  addComment: async (req, res) => {
    try {
      await Comment.create({
        content: req.body.comment,
        likes: 0,
        ticker: req.params.ticker,
        user: req.user.id
      });
      res.redirect(`/stock/${req.params.ticker}`);
    } catch(err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    try {
      let alreadyLiked = false;
      const comment = await Comment.findById(req.params.commentID);
      const currentLikers = comment.likers;

      for(let i = 0; i < currentLikers.length; i++) {
        if(currentLikers[i] == req.user.id) {
          alreadyLiked = true;
        }
      }
      if(!alreadyLiked) {
        const liker = await User.findById(req.user.id);
        await Comment.findOneAndUpdate(
          {_id: req.params.commentID},
          {
            $push: {likers: liker.id},
            $inc: {likes: 1}
          }
          );
        } 
        res.redirect(`/stock/${req.params.ticker}`);
    } catch(err) {
      console.log(err);
    }
  }, 
  deleteComment: async (req, res) => {
    try {
      await Comment.findByIdAndDelete({_id: req.params.commentID});
      console.log('comment deleted');
      res.redirect(`/stock/${req.params.ticker}`);
    } catch(err) {
      console.log(err);
    }
  }
}
