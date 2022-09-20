const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

module.exports = {
  getLogin: (req, res) => {
    if(req.user) {
      return res.redirect('/dashboard');
    }
    res.render('login');
  },
  postLogin: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res, next);
  },
  postRegister: async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    // Check required fields
    if(!name || !email || !password || !password2) {
      errors.push({ message: 'Please fill in all fields, ' });
    }
  
    // Check that passwords match
    if(password !== password2) {
      errors.push({ message: 'Passwords do not match, ' });
    }
  
    // Check password length
    if(password.length < 6) {
      errors.push({ message: 'Password should be at least 6 characters' });
    }
  
    if(errors.length > 0) {
      res.render('welcome', {
        errors,
        name, 
        email,
        password,
        password2
      })
    } else {
      // Validation passed
      const user = await User.findOne({ email: email });
      if(user) {
        // User already exists
        errors.push({ message: 'Email is already in use' })
  
        res.render('welcome', {
          errors,
          name, 
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name, 
          email,
          password
        });
  
        // Hash the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            // Set password to hashed password
            newUser.password = hash;
            // Save the new user
            newUser.save()
              .then(user =>  {
                req.flash('success_message', 'You are now registered and can log in!');
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          })
      })
      }
    }
  
  },
  logout: (req, res, next) => {
    req.logout((err) => {
      if(err) return next(err);
      req.flash('success_message', 'You are logged out');
      res.redirect('/login');
    });
  }
}