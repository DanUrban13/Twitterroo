'use strict';
const User = require('../models/user');
const Tweet = require('../models/tweet');
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
      reply.view('settings', {
        adminuser: request.auth.credentials.loggedInUser,
        title: 'Edit Account Settings',
        user: foundUser,
      });
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

exports.create = {

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

    let newUser = new User();
    newUser.firstName = editedUser.firstName;
    newUser.lastName = editedUser.lastName;
    newUser.email = editedUser.email;
    newUser.password = editedUser.password;

    newUser.save().then(user => {
      return User.find({}).exec();
    }).then(users => {
      reply.view('mgmtUser', {
        title: 'Edit Account Settings',
        user: users,
        adminuser: request.auth.credentials.loggedInUser,
      });
    }).catch(err => {
      reply.redirect('/mgmtUser');
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
      var included = false;
      for (let i = 0; i < editedUser.following.length; i++){
        if (editedUser.following[i].equals(user._id)) {
          included = true;
        }
      }
      if(!included){
        editedUser.following.push(user);
      }
      return editedUser.save();
    }).then(user =>{
      reply.redirect('/userlist', {
        adminuser: request.auth.credentials.loggedInUser,
      });
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
        reply.redirect('/init');
      } else {
        reply.redirect('/signup');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.showUsers = {

  handler: function (request, reply) {
    User.find({}).populate('user').then(users => {
      let userCount = users.length;
      var users1 = users.slice(0, userCount / 2);
      var users2 = users.slice(userCount / 2);
      reply.view('userlist', {
        adminuser: request.auth.credentials.loggedInUser,
        user1: users1,
        user2: users2,
      });
    }).catch(err => {
      console.log(err);
      reply.redirect('/home');
    });
  },

};

exports.init = {

  handler: function (request, reply) {
    let allTweets = [];
    Tweet.find({ }).populate('creator').then(res => {
      res.forEach(tweet => {
        allTweets.push(tweet);
      });
      return User.find({});
    }).then(users => {
      for (let i = 0; i < users.length; i++) {
        users[i].tweetCount = 0;
        users[i].signCount = 0;
        for (let j = 0; j < allTweets.length; j++){
          if(allTweets[j].creator._id.equals(users[i]._id)) {
            users[i].signCount = users[i].signCount + allTweets[j].text.length;
            users[i].tweetCount = users[i].tweetCount + 1;
          }
        }
      }
      let res = [];
      return users.forEach(function (item) {
        item.save(function (err) {
          res.push(err);
          if (res.length === users.length)
          {
            // Done
          }
        });
      });
    }).then(users => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/home');
    });
  },

};

exports.show = {

  handler: function (request, reply) {
    User.find({}).populate('user').then(users => {
      reply.view('mgmtUser', {
        adminuser: request.auth.credentials.loggedInUser,
        user: users,
      });
    }).catch(err => {
      reply.redirect('/home');
    });
  },

};

exports.delete = {

  handler: function (request, reply) {
    let userToDelete = [];
    userToDelete = request.payload;
    let length = userToDelete.user.length;
    if (length > 15) {
      let userId;
      User.findById( userToDelete.user ).then(user => {
        userId = user._id;
        return User.remove( user ).exec();
      }).then(user => {
        return Tweet.remove({ creator: userId }).exec();
      }).then(user => {
        reply.redirect('/mgmtUser', {
          adminuser: request.auth.credentials.loggedInUser,
        });
      }).catch(err => {
        console.log('could not delete user');
      });
    } else {
      for (let i = 0; i < length; i++) {
        let userId;
        User.findById( userToDelete.user[i] ).then(user => {
          userId = user._id;
          return User.remove( user ).exec();
        }).then(user => {
          return Tweet.remove({ creator: userId }).exec();
        }).then(tweet => {
          reply.redirect('/mgmtUser', {
            adminuser: request.auth.credentials.loggedInUser,
          });
        }).catch(err => {
          //console.log(err);
          console.log('could not delete users');
        });
      }
    }

  },
};
