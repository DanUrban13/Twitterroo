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
        allTweets.forEach(function(tweet) {
          tweet.dateString = tweet.date.toUTCString();
        });
        reply.view('home', {
          title: 'Current Tweets',
          tweets: allTweets,
        });
      }).catch(err => {
        reply.redirect('/');
      });
  },
};

exports.homeOfUser = {

  auth: false,

  handler: function (request, reply) {

    console.log(request.params.id);
    User.findOne(({ _id: request.params.id })).then(userFound => {
      return Tweet.find({ creator: userFound }).populate('creator');
    }).then(allTweets => {
      allTweets.forEach(function(tweet) {
        tweet.dateString = tweet.date.toUTCString();
      });
      reply.view('timeline', {
        title: 'Current Tweets',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.tweet = {

  validate: {

    payload: {
      tweetText: Joi.string().min(1).max(140),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('tweet', {
        title: 'Invalid tweet',
        errors: error.data.details,
      }).code(400);
    },
  },

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    let userId = null;
    let tweet = null;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      console.log(data);
      userId = user._id;
      tweet = new Tweet();
      tweet.date = new Date();
      tweet.text = data.tweetText;
      tweet.creator = userId;
      console.log(tweet);
      return tweet.save(function (error) {
        if(!error) {
          Tweet.find({}).populate('creator').exec(function(error, posts) {
            console.log(JSON.stringify(posts, null, "\t"));
          });
        }
      });
    }).then(tweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.deleteSpecific = {

  handler: function (request, reply) {
    Tweet.findByIdAndRemove( request.params.id ).then(result => {
      reply.redirect('/home');
    }).catch(err => {
      console.log('could not delete tweet');
      reply.redirect('/');
    });
  },
};

exports.delete = {

  handler: function (request, reply) {
    console.log(request.payload);
    const tweetsToDelete = request.payload;
    console.log(tweetsToDelete);
    console.log(tweetsToDelete.tweet);
    for (let i = 0; i < tweetsToDelete.tweet.length; i++) {
      console.log(tweetsToDelete.tweet[i]);
      Tweet.findByIdAndRemove( tweetsToDelete.tweet[i] ).catch(err => {
        console.log('could not delete tweet');
      });
    }
    reply.redirect('/home');
  },
};

exports.deleteAll = {
  handler: function (request, reply) {

    var userEmail = request.auth.credentials.loggedInUser;
    let userId = null;
    User.findOne({ email: userEmail }).then(user => {
      userId = user._id;
      return Tweet.remove({ creator: userId });
    }).then(deleteTweet =>{
      reply.redirect('/home');
    }).catch(tweet => {
      console.log('could not find user');
      reply.redirect('/home');
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