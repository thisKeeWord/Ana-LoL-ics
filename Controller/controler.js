var request = require('request');

var controler = {
  hello: hello
}

function hello(req, res, next) {
  // request('https://na.api.pvp.net/api/lol/na/v2.2/match/1370158145?includeTimeline=true&api_key=8d362b18-09a1-43d8-bfd2-4ef879d6c9f1', function(err, response, body) {
  //   res.send(body);
  })
}

module.exports = controler;
