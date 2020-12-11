const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortenedUrl: {
    type: String
  },
  urlClickCount: {
    type: Number
  },
  lastAccessed: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: null
  }
});

let Url = mongoose.model('Url', UrlSchema);

module.exports = { Url };
