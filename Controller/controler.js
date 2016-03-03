var request = require('request');
var async = require('async');
var stuff = require('./../stuff.js');
var summonerUrl = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";
var matchHistoryList = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/";
var champImageUrl = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/";
var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/";
var summonerUrl = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";
var matchUrl = "https://na.api.pvp.net/api/lol/na/v2.2/match/";
var version = "https://ddragon.leagueoflegends.com/api/versions.json";


var controler = {
  userInformation: userInformation,
  matchList: matchList,
  getData: getData
}

function userInformation(req, res, next) {
  request(summonerUrl + req.body.username + "?" + stuff.stuff1, (error, resp) => {
		if (error) return console.error("we cannot find the summoner or " + error);
		if (resp.statusCode === 200) {
			var userId = JSON.parse(resp.body);
			for (var keys in userId) {
				var result = userId[keys]["id"];
			}
			req.summonerId = result;
		}
		next();
	})
}

function matchList(req, res) {
	var count = 0;
	if (!req.summonerId) {
		req.summonerId = req.body.userName;
	}
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

			matchHistory.forEach(function(i) {
				request(champImageUrl + i[1] + "?" + stuff.stuff1, function(error, good) {
					good = JSON.parse(good.body)
					i[1] = 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + good.key + '.png';
					count++;
					if (count === 10) {
						matchHistory = matchHistory.filter(function(summonersRift) {
							return summonersRift.length > 2;
						})
						return res.status(200).send(matchHistory);
					}
				}) 
			})
		}
	})
}

function getData(req, res) {
	var that = this,
      count = -1,
      total = 0,
      compareVersions = 0,
      patchDesired = 0,
      gameTimeline = [],
      idOfPlayer = [],
      imgOfChamp = [],
      positionOfPlayer = [],
      matchDataArray = [];

  request(matchUrl + Object.keys(req.body)[0] + "?includeTimeline=true&" + stuff.stuff1, function(error, newData) {
    if (error) return console.error(error);
    var info = JSON.parse(newData.body); 

    request(version, function(error, checkingVersion) {
      var versionChecks = JSON.parse(checkingVersion.body);
      var patchVersion = 0;
      if (error) return console.error(error);
      while(patchVersion < versionChecks.length) {
        var splitCheck = versionChecks[patchVersion].split('.').slice(0, 2);
        var gamePatch = info["matchVersion"].split('.').slice(0, 2);

        if (splitCheck.join('') === gamePatch.join('')) {
          patchDesired = versionChecks[patchVersion];
          break;
        }
        patchVersion++;
      }


      // FIRST REQUEST TO FILE
      request("http://ddragon.leagueoflegends.com/cdn/" + patchDesired + "/data/en_US/item.json", function(err, data) {
        if (error) return console.error(error);
        var resData = JSON.parse(data.body).data;
        
        // GOING FOR THE TIMELINE INFORMATION
        for (var j = 0; j < info.timeline.frames.length; j++) {
          gameTimeline.push([info.timeline.frames[j]]);
        }  

        // HAVE TO USE NUMBER FOR NUMERATOR SINCE SCROLL NOT UP YET
        var stepScroll = 300 / gameTimeline.length;

        // NUMBER OF PARTICIPANTS FOR A GAME: ASYNC, BUT PARALLEL
        info.participants.forEach(function(i) {
          var pId = i.participantId;
          var cId = i.championId;

          // PARTICIPANT-ID AND CHAMPION-ID
          idOfPlayer.push([pId, cId]);

          // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
          request(url + cId + '?' + stuff.stuff1, function(error, champData) {
          	champData = JSON.parse(champData.body);

          	if (error) return console.error(error);
            var stuffs = champData.key;
            count++;

            imgOfChamp[cId] = champData.key;
            positionOfPlayer.push([ info.timeline.frames[0].participantFrames[idOfPlayer[count][0]].position.x, info.timeline.frames[0].participantFrames[idOfPlayer[count][0]].position.y ]);

            if (Object.keys(imgOfChamp).length === 10) {
            	matchDataArray.push(patchDesired, positionOfPlayer, imgOfChamp, idOfPlayer, gameTimeline, info, resData)
            	return res.status(200).send(matchDataArray);
            }
          })
        })
      })
    })
  })
}

module.exports = controler;