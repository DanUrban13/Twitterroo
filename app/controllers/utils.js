'use strict';
const User = require('../models/user');
const Joi = require('joi');
const fs = require('fs');
const cloudinary = require('cloudinary')

exports.upload = {

  payload: {
    output: 'stream',
    parse: true,
    allow: 'multipart/form-data',
    maxBytes: 2 * 1000 * 1000
  },

  handler: (request, reply) => {
    try {
      const env = require('../.data/.env.json');
      cloudinary.config(env.cloudinary);
    }
    catch(e) {
      logger.info('You must provide a Cloudinary credentials file - see README.md');
      process.exit(1);
    }

    var result = [];

    result.push(request.payload['file'].hapi);
    const fileString = __dirname + '/uploads/' + request.payload['file'].hapi.filename;
    request.payload['file'].pipe(fs.createWriteStream(fileString));

    cloudinary.uploader.upload(fileString, function(result) {
      const loggedInUserEmail = request.auth.credentials.loggedInUser;

      User.findOne({ email: loggedInUserEmail }).then(user => {
        user.image = result.url;
        return user.save();
      }).then(user => {
        fs.unlink(fileString, (err) => {
          if (err) throw err;
          console.log('successfully deleted /tmp/hello');
        });
        reply.view('settings', { title: 'Edit Account Settings', user: user });
      }).catch(err => {
        reply.redirect('/');
      });

    });
  },
};