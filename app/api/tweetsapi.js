'use strict';

const Tweet = require('../models/tweet');
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