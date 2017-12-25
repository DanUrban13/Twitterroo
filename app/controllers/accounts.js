'use strict';
const User = require('../models/user');
const Joi = require('joi');

exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to Twitterroo' });
  },

};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Twitterroo' });
  },

};

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to Twitterroo' });
  },

};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

exports.register = {
  auth: false,

  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {

        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.viewSettings = {

  handler: function (request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser }).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.updateSettings = {

  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const editedUser = request.payload;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: loggedInUserEmail }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.password = editedUser.password;
      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.addNewFollow = {

  handler: function (request, reply) {
    const loggedInUserEmail = request.auth.credentials.loggedInUser;
    let editedUser = null;
    User.findOne({ email: loggedInUserEmail }).then(user => {
      editedUser = user;
      return User.findOne({ _id: request.params.id });
    }).then(user => {
        editedUser.following.push(user);
      return editedUser.save();
    }).then(user =>{
      reply.redirect('/userlist');
    }).catch(err => {
      reply.redirect('/home');
    });
  },
};

exports.authenticate = {

  auth: false,

  // validate: {
  //
  //   payload: {
  //     email: Joi.string().email().required(),
  //     password: Joi.string().required(),
  //   },
  //
  //   options: {
  //     abortEarly: false,
  //   },
  //
  //   failAction: function (request, reply, source, error) {
  //     reply.view('login', {
  //       title: 'Sign in error',
  //       errors: error.data.details,
  //     }).code(400);
  //   },
  //
  // },

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: user.email,

        });
        reply.redirect('/home');
      } else {
        reply.redirect('/signup');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.showUsers = {

  auth: false,

  handler: function (request, reply) {
    User.find({}).populate('user').then(users => {
      let userCount = users.length;
      var users1 = users.slice(0, userCount / 2);
      var users2 = users.slice(userCount / 2);
      reply.view('userlist', {
        user1: users1,
        user2: users2,
      });
    }).catch(err => {
      reply.redirect('/home');
    });
  },

};
