const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');
const Utils = require('./app/controllers/utils');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'GET', path: '/tweet', config: Tweets.form },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },
  { method: 'GET', path: '/tweet/follow', config: Tweets.follow },
  { method: 'GET', path: '/tweet/global', config: Tweets.global },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/home/{id}', config: Tweets.homeOfUser },
  { method: 'POST', path: '/home', config: Tweets.home },

  { method: 'GET', path: '/userlist', config: Accounts.showUsers },

  { method: 'GET', path: '/follow/{id}', config: Accounts.addNewFollow },

  { method: 'POST', path: '/tweets/delete/{id}', config: Tweets.deleteSpecific },

  { method: 'POST', path: '/tweets/delete', config: Tweets.delete },
  { method: 'POST', path: '/tweets/deleteAll', config: Tweets.deleteAll },

  { method: 'POST', path: '/upload', config: Utils.upload },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];