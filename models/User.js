const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  stocks: {
    type: Number,
    default: 0
  },
  userScore: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now 
  },
})

module.exports = mongoose.model('User', UserSchema)