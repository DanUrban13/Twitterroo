'use strict';

const Tweet = require('../models/tweet');
const utils = require('./utils');
const Boom = require('boom');

exports.find = {

  auth: false,

  handler: function (request, reply) {
    Tweet.find({}).populate('creator').exec().then(tweet => {
      reply(tweet);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.findSpecific = {

  auth: false,

  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id }).exec().then(tweet => {
      reply(tweet);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.findOfUser = {

  auth: false,

  handler: function (request, reply) {
    Tweet.findOne({ creator: request.params.id }).then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.create = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {

    const tweet = new Tweet(request.payload);
    tweet.creator = utils.getUserIdFromRequest(request);
    tweet.date = new Date();

    tweet.save().then(newTweet => {
      Tweet.findOne(newTweet).populate('creator').then(tweet =>{
        reply(tweet).code(201);
      })
    }).catch(err => {
      reply(Boom.badImplementation('error making tweet'));
    });
  },

};

exports.deleteSpecific = {

  handler: function (request, reply) {
    Tweet.findByIdAndRemove({ tweet: request.params.id }).then(result => {
      console.log('deleted tweet');
      reply('/home');
    }).catch(err => {
      reply(Boom.badImplementation('error removing tweet'));
    });
  },
};