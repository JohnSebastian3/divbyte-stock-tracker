module.exports = {
  getHome: (req, res) => {
    res.render('welcome.ejs', req);
  },
}