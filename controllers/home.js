const User = require('../models/User');

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
      res.render('profile.ejs', {
        user: user,
      })
    } catch(err) {
      console.log(err);
    }
    
  }
}