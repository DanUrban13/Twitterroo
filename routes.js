const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'GET', path: '/tweet', config: Tweets.form },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/home/{id}', config: Tweets.homeOfUser },
  { method: 'POST', path: '/home', config: Tweets.home },

  { method: 'GET', path: '/userlist', config: Accounts.showUsers },

  { method: 'POST', path: '/tweets/delete/{id}', config: Tweets.deleteSpecific },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];