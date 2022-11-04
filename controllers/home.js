module.exports = {
  getHome: (req, res) => {
     // res.render('login.ejs', req);
     if(req.user) {
      return res.redirect('/dashboard');
    }
    res.render('welcome');
  },
  
}