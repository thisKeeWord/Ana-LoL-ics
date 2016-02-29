var request = require('request');
var stuff = require('./../stuff.js');
var summonerUrl = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";
var matchHistoryList = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/";
var champImageUrl = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/";


var controler = {
  userInformation: userInformation,
  matchList: matchList
}

function userInformation(req, res, next) {
  request(summonerUrl + req.body.username + "?" + stuff.stuff1, (error, resp) => {
		if (error) return console.error("we cannot find the summoner or " + error);
		if (resp.statusCode === 200) {
			var userId = JSON.parse(resp.body);
			// console.log(userId)
			for (var keys in userId) {
				var result = userId[keys]["id"];
				// console.log(result, 're-result')
			}
			// console.log('result', result)
			req.summonerId = result;
		}
		next();
	})
}

function matchList(req, res) {
	// console.log(req.body.userName, 'req..username');
	var count = 0;
	if (!req.summonerId) {
		req.summonerId = req.body.userName;
	}
	// console.log(req.summonerId);
	var matchHistory = [];
	request(matchHistoryList + req.summonerId + "/recent?" + stuff.stuff1, (error, response) => {
		if (error) return console.error(error);
		if (response.statusCode === 200) {
			var gamesList = JSON.parse(response.body);
			for (var i = 0; i < gamesList.games.length; i++) {
				var perGameSpec = [];
				if (gamesList.games[i]["mapId"] === 11) {
					perGameSpec.push(gamesList.games[i]["gameId"])
					perGameSpec.push(gamesList.games[i]["championId"])
					var date = new Date(gamesList.games[i]["createDate"])
					perGameSpec.push(date.toString());
				}
				matchHistory.push(perGameSpec);
				
			}
			// console.log(matchHistory)
			matchHistory.forEach(function(i) {
				// console.log(i[1])
				
				request(champImageUrl + i[1] + "?" + stuff.stuff1, function(error, good) {
					// console.log(good)
					good = JSON.parse(good.body)
					i[1] = 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + good.key + '.png';
					count++;
					if (count === 10) {
						matchHistory = matchHistory.filter(function(summonersRift) {
					// console.log(summonersRift.length)
							return summonersRift.length > 2;
						})
						console.log(matchHistory)
						return res.status(200).send(matchHistory);
					}
				}) 
			})
		}
	})
}


module.exports = controler;
