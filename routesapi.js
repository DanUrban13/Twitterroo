const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/userapi');

module.exports = [

  { method: 'GET', path: '/api/tweets', config: TweetsApi.find },
  { method: 'GET', path: '/api/tweets/find/{id}', config: TweetsApi.findSpecific },

  { method: 'GET', path: '/api/users', config: UsersApi.find },
  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'PUT', path: '/api/users', config: UsersApi.updateSettings },
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },
];