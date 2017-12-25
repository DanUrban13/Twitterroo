const Tweets = require('./app/api/tweetsapi');

module.exports = [

  { method: 'GET', path: '/tweets/find', config: Tweets.find },
  { method: 'GET', path: '/tweets/find/{id}', config: Tweets.findSpecific },

];