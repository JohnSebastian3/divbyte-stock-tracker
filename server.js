const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const methodOverride = require('method-override');
const passport = require('passport');
const connectDB = require('./config/db');
const dashboardRoutes = require('./routes/dashboard');

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

//Use forms for put / delete
app.use(methodOverride("_method"));

// Express session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

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
app.use('/dashboard', dashboardRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})