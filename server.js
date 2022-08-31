const express = require('express');
const connectDB = require('./config/db');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
require('dotenv').config({path: './config/.env'});

// Passport config
require('./config/passport')(passport);

connectDB();

// Middle ware
// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
})


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
// app.use('/dashboard', require('./routes/dashboard'));


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})