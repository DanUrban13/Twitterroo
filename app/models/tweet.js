const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  text: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: Date,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;