const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
  text: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;