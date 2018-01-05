'use strict';
const Tweet = require('../models/tweet');
const User = require('../models/user');
const Joi = require('joi');
const fs = require('fs');
const cloudinary = require('cloudinary')

exports.home = {

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne(({ email: userEmail })).then(userFound => {
      return Tweet.find({ creator: userFound }).populate('creator');
    }).then(allTweets => {
        allTweets.forEach(function(tweet) {
          tweet.dateString = tweet.date.toUTCString();
        });
        allTweets.sort(function(a,b) {return (a.date.getDate() > b.date.getDate()) ? 1 : ((b.date.getDate() > a.date.getDate()) ? -1 : 0);} );
        reply.view('home', {
          adminuser: request.auth.credentials.loggedInUser,
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
    User.findOne(({ _id: request.params.id })).then(userFound => {
      return Tweet.find({ creator: userFound }).populate('creator');
    }).then(allTweets => {
      allTweets.forEach(function(tweet) {
        tweet.dateString = tweet.date.toUTCString();
      });
      allTweets.sort(function(a,b) {return (a.date.getDate() > b.date.getDate()) ? 1 : ((b.date.getDate() > a.date.getDate()) ? -1 : 0);} );
      reply.view('timeline', {
        adminuser: request.auth.credentials.loggedInUser,
        title: 'Current Tweets',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.follow = {

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    let tweets = [];
    let following = [];
    User.findOne(({ email: userEmail })).then(userFound => {
      return userFound.following;
    }).then(f => {
      following = f;
      return Tweet.find({ }).populate('creator');
    }).then(allTweets => {
      allTweets.forEach(function(tweet) {
        tweet.dateString = tweet.date.toUTCString();
        for (let i = 0; i < following.length; i++){
          if (tweet.creator._id.equals(following[i])) {
            tweets.push(tweet);
          }
        }
      });
      tweets.sort(function(a,b) {return (a.date.getDate() > b.date.getDate()) ? 1 : ((b.date.getDate() > a.date.getDate()) ? -1 : 0);} );
      reply.view('timelineFollow', {
        adminuser: request.auth.credentials.loggedInUser,
        title: 'Current Tweets',
        tweets: tweets,
      });
    }).catch(err => {
      reply.redirect('/home');
    });
  },
};

exports.global = {

  handler: function (request, reply) {
    Tweet.find({}).populate('creator').exec().then(allTweets => {
      allTweets.forEach(function(tweet) {
        tweet.dateString = tweet.date.toUTCString();
      });
      allTweets.sort(function(a,b) {return (a.date.getDate() > b.date.getDate()) ? 1 : ((b.date.getDate() > a.date.getDate()) ? -1 : 0);} );
      reply.view('timelineGlobal', {
        adminuser: request.auth.credentials.loggedInUser,
        title: 'Current Tweets',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.show = {

  handler: function (request, reply) {
    Tweet.find({}).populate('creator').exec().then(allTweets => {
      allTweets.forEach(function(tweet) {
        tweet.dateString = tweet.date.toUTCString();
      });
      allTweets.sort(function(a,b) {return (a.date.getDate() > b.date.getDate()) ? 1 : ((b.date.getDate() > a.date.getDate()) ? -1 : 0);} );
      reply.view('mgmtTweet', {
        adminuser: request.auth.credentials.loggedInUser,
        title: 'Current Tweets',
        tweets: allTweets,
      });
    }).catch(err => {
      console.log(err);
      reply.redirect('/settings');
    });
  },
};

exports.tweet = {
  payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: 2 * 1000 * 1000
  },
  validate: {

    payload: {
      tweetText: Joi.string().min(1).max(140),
      file: Joi.any(),
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
    let data = request.payload;
    let userId = null;
    let tweet = null;

    try {
      const env = require('../.data/.env.json');
      cloudinary.config(env.cloudinary);
    }
    catch (e) {
      logger.info('You must provide a Cloudinary credentials file - see README.md');
      process.exit(1);
    }

    if (data.file.hapi.filename !== '') {
      tweet = new Tweet();
      const fileString = __dirname + '/uploads/' + request.payload['file'].hapi.filename;
      request.payload['file'].pipe(fs.createWriteStream(fileString));

      cloudinary.uploader.upload(fileString, function(result) {
        User.findOne({ email: userEmail }).then(user => {
          userId = user._id;
          tweet = new Tweet();
          console.log('url' + result.url);
          tweet.date = new Date();
          tweet.text = data.tweetText;
          tweet.creator = userId;
          tweet.image = result.url;
          return tweet.save(function (error) {
            if (!error) {
              Tweet.find({}).populate('creator').exec(function (error, posts) {
              });
            }
          });
        }).then(tweet => {
          reply.redirect('/home');
        }).catch(err => {
          console.log('could not save tweet');
          reply.redirect('/');
        });
      });
    } else {
      User.findOne({ email: userEmail }).then(user => {
        userId = user._id;
        tweet = new Tweet();
        tweet.date = new Date();
        tweet.text = data.tweetText;
        tweet.creator = userId;
        return tweet.save(function (error) {
          if (!error) {
            Tweet.find({}).populate('creator').exec(function (error, posts) {
            });
          }
        });
      }).then(tweet => {
        reply.redirect('/home');
      }).catch(err => {
        console.log('could not save tweet2');
        reply.redirect('/');
      });
    }
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
    let tweetsToDelete = [];
    tweetsToDelete = request.payload;
    let length = tweetsToDelete.tweet.length;
    if (length > 15) {
      Tweet.findById( tweetsToDelete.tweet ).then(tweet => {
        return Tweet.remove( tweet ).exec();
      }).catch(err => {
        console.log('could not delete tweet');
      });
    } else {
      for (let i = 0; i < length; i++) {
        Tweet.findById( tweetsToDelete.tweet[i] ).then(tweet => {
          return Tweet.remove( tweet ).exec();
        }).catch(err => {
          console.log('could not delete tweet');
        });
      }
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
      adminuser: request.auth.credentials.loggedInUser,
      title: 'Write your Tweet',
    });
  },
};
