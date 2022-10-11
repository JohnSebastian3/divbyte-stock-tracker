const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number
  },
  likers: {
    type: Array,
    default: [],
  },
  ticker: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Comment', CommentSchema);