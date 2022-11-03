const User = require('../models/User');
const dayjs = require('dayjs');


module.exports = {
  getHome: (req, res) => {
     // res.render('login.ejs', req);
     if(req.user) {
      return res.redirect('/dashboard');
    }
    res.render('welcome');
  },
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const dates = user.date.toString().split(' ');
      const dateJoined = {
        month: dates[1],
        day: dates[2],
        year: dates[3],
      }
      res.render('profile.ejs', {
        profileUser: user,
        user: req.user,
        dateJoined: dateJoined
      })
    } catch(err) {
      console.log(err);
    }
    
  }
}