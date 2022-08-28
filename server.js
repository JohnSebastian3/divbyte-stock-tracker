const express = require('express');
const connectDB = require('./config/db');
const app = express();
require('dotenv').config({path: './config/.env'});

connectDB();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', require('./routes/index'));
app.use('/dashboard', require('./routes/dashboard'));


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})