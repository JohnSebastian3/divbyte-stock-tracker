const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    trim: true
  },
  shares: {
    type: Number,
    required: true,
  },
  basis: {
    type: Number,
    required: true,
  }
})

module.exports = mongoose.model('Stock', StockSchema);