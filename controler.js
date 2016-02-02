var request = require('request');
var $ = require('./bower_components/jquery/dist/jquery.js');

var controler = {
  hello: hello
}
var store;
function hello(req, res, next) {
  console.log('hello')
  // request('http://spectator.na.lol.riotgames.com/observer-mode/rest/consumer/getGameMetaData/NA1/2085925993/null', function(err, response, body) {
  //   for (var key in body) {
  //     if (key === 'pendingAvailableChunkInfo') {
  //       request('http://spectator.na.lol.riotgames.com/observer-mode/rest/consumer/getGameDataChunk/NA1/2085927623/' + body[key][0]["id"] + '/1/token', function(err, response, data) {
  //         if (err || response.statusCode !== 200) {
  //           return res.sendStatus(500);
  //         }
  //         // res.writeHead(200, {"Content-Type": "application/json"});
  //         // console.log(JSON.parse(body), 'parsing')
  //         res.send( data );
  //       })
  //     }
  //   }
  // })
  request('http://spectator.na.lol.riotgames.com:8088/observer-mode/rest/consumer/getGameDataChunk/NA1/2085953467/28/token', function(err, response, body) {
    if (err || response.statusCode !== 200) {
              return res.sendStatus(500);
            }
            console.log(JSON.parse(body))
            res.writeHead(200, {"Content-Type": "application/json"});
            console.log(JSON.parse(body), 'parsing')

            res.send( JSON.parse(data) );
  })
};

module.exports = controler;
