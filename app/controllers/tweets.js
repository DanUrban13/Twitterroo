'use strict';
const Tweet = require('../models/tweet');
const User = require('../models/user');
const Joi = require('joi');

exports.home = {

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne(({ email: userEmail })).then(userFound => {
      return Tweet.find({ creator: userFound }).populate('creator');
    }).then(allTweets => {
        reply.view('home', {
          title: 'Current Tweets',
          tweets: allTweets,
        });
      }).catch(err => {
        reply.redirect('/');
      });

    // Candidate.find({}).then(candidates => {
    //   reply.view('home', {
    //     title: 'Make a ',
    //     candidates: candidates,
    //   });
    // }).catch(err => {
    //   reply.redirect('/');
    // });
  },

};

exports.tweet = {

  // validate: {
  //
  //   payload: {
  //     amount: Joi.number().required(),
  //     method: Joi.string().required(),
  //     candidate: Joi.string().required(),
  //   },
  //
  //   options: {
  //     abortEarly: false,
  //   },
  //
  //   failAction: function (request, reply, source, error) {
  //     Candidate.find({}).then(candidates => {
  //       reply.view('home', {
  //         title: 'Invalid Donation',
  //         candidates: candidates,
  //         errors: error.data.details,
  //       }).code(400);
  //     }).catch(err => {
  //       reply.redirect('/');
  //     });
  //   },
  // },

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    let userId = null;
    let tweet = null;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      console.log(data);
      userId = user._id;
      tweet = new Tweet();
      tweet.text = data.tweetText;
      tweet.creator = userId;
      console.log(tweet);
      return tweet.save();
    }).then(tweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.form = {
  handler: function (request, reply) {
    reply.view('tweet', {
      title: 'Write your Tweet',
    });
  },
};

exports.report = {

  handler: function (request, reply) {
    // Donation.find({}).populate('donor').populate('candidate').then(allDonations => {
    //   let total = 0;
    //   allDonations.forEach(donation => {
    //     total += donation.amount;
    //   });
    //   reply.view('report', {
    //     title: 'Donations to Date',
    //     donations: allDonations,
    //     total: total,
    //   });
    // }).catch(err => {
    //   reply.redirect('/');
    // });
  },

};