var request = require('request');
var ThrottleCalls = require('./throttleCalls.js');
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

// FINDING USER'S INFORMATION FROM ENDPOINT
function userInformation(req, res, next) {
	var date = Date.now();
	if (isNaN(req.body.userName) === false) {
		req.summonerId = req.body.userName;
		return next();
	}
	else {
		ThrottleCalls.find({ 'created_at': { $lt: date } }).exec(function(error, success) {
			if (success.length && date - success[0]['created_at'] > 10000) {
				ThrottleCalls.remove({}, function(error, removed) {
					if (error) return console.error(error);
					usersInfo(date, req, res, next);
				})
			}
			else if (!success.length || (success.length && success.length < 14 && date - success[0]['created_at'] <= 10000 && date - success[0]['created_at'] > 0)) {
				usersInfo(date, req, res, next);
			}
			else {
				return res.render('./../index.html', { error: 'too many requests, try again in a few' });
			}
		})
	}
}

// MOST RECENT 10 GAMES ON SUMMONER'S RIFT
function matchList(req, res) {
	var date = Date.now();
	ThrottleCalls.find({ 'created_at': { $lt: date } }).exec(function(error, success) {
		if (success.length && date - success[0]['created_at'] > 10000) {
			ThrottleCalls.remove({}, function(removed) {
				if (error) return console.error(error);
				getMatchList(date, req, res);
			})
		}
		else if (!success.length || (success.length && success.length < 14 && date - success[0]['created_at'] <= 10000 && date - success[0]['created_at'] > 0)) {
			getMatchList(date, req, res)
		}
		else {
			return res.render('./../index.html', { error: 'too many requests, try again in a few' });
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
      matchDataArray = [],
			date = Date.now();

	ThrottleCalls.find({ 'created_at': { $lt: date } }).exec(function(error, success) {
		if (success.length && date - success[0]['created_at'] > 10000) {
			ThrottleCalls.remove({}, function(error, removed) {
				if (error) return console.error(error);
				getGameData(that, count, total, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, date, req, res);
			})
		}
		else if (!success.length || (success.length && success.length < 14 && date - success[0]['created_at'] <= 10000 && date - success[0]['created_at'] > 0)) {
			getGameData(that, count, total, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, date, req, res);
		}
		else {
			return res.render('./../index.html', { error: 'too many requests, try again in a few' });
		}
	})
}

function usersInfo(date, req, res, next) {
	ThrottleCalls.create({ 'created_at': date, 'whatToSave': req.body.userName }, function(error, throttling) {
	  request(summonerUrl + req.body.userName + "?" + process.env.stuff1, (error, resp) => {
			if (error) return console.error("we cannot find the summoner or " + error);
			if (resp.statusCode === 200) {
				var userId = JSON.parse(resp.body);
				var result = userId[req.body.userName]["id"];
				req.summonerId = result;
			}
			return next();
		})
	})
}

function getMatchList(date, req, res, next) {
	ThrottleCalls.create({ 'created_at': date, 'whatToSave': req.summonerId }, function(error, throttling) {
		var count = 0;
		var matchHistory = [];
		request(matchHistoryList + req.summonerId + "/recent?" + process.env.stuff2, (error, response) => {
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
					request(champImageUrl + i[1] + "?" + process.env.stuff2, function(error, good) {
						good = JSON.parse(good.body)
						i[1] = 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + good.key + '.png';
						count++;

						if (count === 10) {
							matchHistory = matchHistory.filter(function(summonersRift) {
								return summonersRift.length > 2;
							})
							res.status(200).send([ req.summonerId, matchHistory ]);
						}						
					}) 
				})
			}
		})
	})
}

function getGameData(that, count, total, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, date, req, res) {
	ThrottleCalls.create({ 'created_at': date, 'whatToSave': Object.keys(req.body)[0] }, function(error, throttling) {
	  request(matchUrl + Object.keys(req.body)[0] + "?includeTimeline=true&" + process.env.stuff3, function(error, newData) {
	    if (error) return console.error(error);
	    var info = JSON.parse(newData.body); 

	    // GETTING CORRECT PATCH VERSION TO COMPARE WITH PATCH DATA VERSION
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
	          console.log(idOfPlayer)

	          // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
	          request(url + cId + '?' + process.env.stuff2, function(error, champData) {
	          	champData = JSON.parse(champData.body);

	          	if (error) return console.error(error);
	            var stuffs = champData.key;
	            count++;

	            imgOfChamp[cId] = champData.key;
	            positionOfPlayer.push([ info.timeline.frames[0].participantFrames[idOfPlayer[count][0]].position.x, info.timeline.frames[0].participantFrames[idOfPlayer[count][0]].position.y ]);
	            console.log(Object.keys(imgOfChamp))
	            if (Object.keys(imgOfChamp).length === 10) {
	            	matchDataArray.push(patchDesired, positionOfPlayer, imgOfChamp, idOfPlayer, gameTimeline, info, resData)
	            	res.status(200).send(matchDataArray);
	            }
	          })
	        })
	      })
	    })
	  })
	})
}

module.exports = controler;