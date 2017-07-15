var request = require('request');
var ThrottleCalls = require('./throttleCalls.js');
var summonerUrl = ".api.riotgames.com/lol/summoner/v3/summoners/by-name/";
var matchHistoryList = ".api.riotgames.com/lol/match/v3/matchlists/by-account/";
var champImageUrl = ".api.riotgames.com/lol/static-data/v3/champions/";
var matchTimelineUrl = ".api.riotgames.com/lol/match/v3/timelines/by-match/";
var matchVersionUrl = ".api.riotgames.com/lol/match/v3/matches/";
var version = "https://ddragon.leagueoflegends.com/api/versions.json";
var versionNumber;
var regionName;


var controler = {
  userInformation: userInformation,
  matchList: matchList,
  getData: getData
}

// FINDING USER'S INFORMATION FROM ENDPOINT
function userInformation(req, res, next) {
	regionName = req.body.region.region.toLowerCase();
	var date = Date.now();
	if (isNaN(req.body.username.userName) === false) {
		req.summonerId = req.body.username.userName;
		req.summoner = req.body.summonerName.summoner;
		req.region = req.body.region.region.toLowerCase();
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
		});
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
			});
		}
		else if (!success.length || (success.length && success.length < 14 && date - success[0]['created_at'] <= 10000 && date - success[0]['created_at'] > 0)) {
			getMatchList(date, req, res)
		}
		else {
			return res.render('./../index.html', { error: 'too many requests, try again in a few' });
		}
	});
}

function getData(req, res) {
			keepTrackOf429 = 0,
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
				ThrottleCalls.create({ 'created_at': date, 'whatToSave': Object.keys(req.body)[0] }, function(error, throttling) {
					getGameData(keepTrackOf429, count, total, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, req, res);
				})
			})
		}
		else if (!success.length || (success.length && success.length < 14 && date - success[0]['created_at'] <= 10000 && date - success[0]['created_at'] > 0)) {
			ThrottleCalls.create({ 'created_at': date, 'whatToSave': Object.keys(req.body)[0] }, function(error, throttling) {
				getGameData(keepTrackOf429, count, total, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, req, res);
			})
		}
		else {
			return res.render('./../index.html', { error: 'too many requests, try again in a few' });
		}
	});
}

function usersInfo(date, req, res, next) {
	ThrottleCalls.create({ 'created_at': date, 'whatToSave': req.body.username.userName }, function(error, throttling) {
	  request("https://" + req.body.region.region.toLowerCase() + summonerUrl + encodeURI(req.body.username.userName) + "?" + process.env.stuff1, (error, resp) => {
			if (error) return console.error("we cannot find the summoner or " + error);
			if (resp.statusCode === 200) {
				var userId = JSON.parse(resp.body);
				var result = userId["accountId"];
				req.summonerId = result;
				req.userName = req.body.summonerName.summoner;
				req.region = req.body.region.region.toLowerCase();
			}
			return next();
		});
	});
}

// can split nested requests
function getMatchList(date, req, res, next) {
	request(version, (error, results) => {
		results = JSON.parse(results.body);
		ThrottleCalls.create({ 'created_at': date, 'whatToSave': req.summonerId }, function(error, throttling) {
			var count = 0, matchHistory = [];
			var country = req.body.region.region.toLowerCase();
			request("https://" + country + matchHistoryList + req.summonerId + "/recent?" + process.env.stuff1, (error, response) => {
				if (error) return console.error(error, "here");
				if (response.statusCode === 200) {
					var gamesList = JSON.parse(response.body);
					for (var i = 0; i < gamesList.matches.length; i++) {
						var perGameSpec = [], queueType = gamesList.matches[i]["queue"];
						if (queueType === 420 || queueType === 2 || queueType === 14 || queueType === 4 || queueType === 42 || queueType === 400 || queueType === 440) {
							perGameSpec.push(gamesList.matches[i]["gameId"]);
							perGameSpec.push(gamesList.matches[i]["champion"]);
							var needDate = new Date(gamesList.matches[i]["timestamp"]).toString().replace(/(?:\s+GMT[\+\-]\d+)?(?:\s+\([^\)]+\))?$/,'');
							perGameSpec.push(needDate);
							perGameSpec.push(gamesList.matches[i]["lane"]);
            	perGameSpec.push(gamesList.matches[i]["platformId"]);
            	perGameSpec.push(gamesList.matches[i]["queue"]);
            	perGameSpec.push(gamesList.matches[i]["role"]);
	            perGameSpec.push(gamesList.matches[i]["season"]);
						}
						matchHistory.push(perGameSpec);
					}
					getHistoryWithImages(req, res, country, matchHistory, count, results);
				}
			});
		});
	});
}

function getGameData(keepTrackOf429, count, total, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, req, res) {
  request("https://" + regionName + matchVersionUrl + Object.keys(req.body)[0] + "?" + process.env.stuff1, function(error, newData) {
    if (error) return console.error(error);
    if (newData.statusCode === 429 && (!newData.headers["X-Rate-Limit-Type"] || newData.headers["X-Rate-Limit-Type"] === "service") && keepTrackOf429 < 15) {
    	setTimeout(getGameData(keepTrackOf429 + 1, count, total, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, req, res), 10);
    }
    // getting correct patch version to compare with data version
    else {
	    var info = JSON.parse(newData.body);
	    comparePatchVersions(info, count, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, req, res);
	  }
  });
}

// getting proper patch version to compare with data version
function comparePatchVersions(info, count, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, req, res) {
	request(version, function(error, checkingVersion) {
    var versionChecks = JSON.parse(checkingVersion.body);
    var splitCheck, gamePatch, patchVersion = 0;
    if (error) return console.error(error);
    while(patchVersion < versionChecks.length) {
      splitCheck = versionChecks[patchVersion].split('.').slice(0, 2);
      gamePatch = info["gameVersion"].split('.').slice(0, 2);
      if (splitCheck.join('') === gamePatch.join('')) {
        patchDesired = versionChecks[patchVersion];
        break;
      }
      patchVersion++;
    }
    request("http://ddragon.leagueoflegends.com/cdn/" + patchDesired + "/data/en_US/item.json", function(err, data) {
      if (error) return console.error(error);
      var resData = JSON.parse(data.body).data;
      // getting timeline information by frame from another endpoint
      // since the first timeline request doesn't have the full info
      // by frame for the game
      request("https://" + regionName + matchTimelineUrl + Object.keys(req.body)[0] + "?" + process.env.stuff1, function(er, timelineData) {
      	var timelineDataFrames = JSON.parse(timelineData.body).frames;
	      for (var j = 0; j < timelineDataFrames.length; j++) {
	        gameTimeline.push([timelineDataFrames[j]]);
	      }  
	      // HAVE TO USE NUMBER FOR NUMERATOR SINCE SCROLL NOT UP YET
	      var stepScroll = 300 / gameTimeline.length;
	      // NUMBER OF PARTICIPANTS FOR A GAME: ASYNC, BUT PARALLEL
	      info.participants.forEach(function(i) {
	        var pId = i.participantId;
	        var cId = i.championId;
	        var playerRole = i.timeline.role;
	        var playerLane = i.timeline.lane;
	        // PARTICIPANT-ID AND CHAMPION-ID
	        idOfPlayer.push([pId, cId, playerRole, playerLane]);
	        // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
	        request("https://" + regionName + champImageUrl + cId + '?' + process.env.stuff1, function(error, champData) {
	        	champData = JSON.parse(champData.body);
	        	if (error) return console.error(error);
	          var stuffs = champData.key;
	          count++;
	          imgOfChamp[cId] = champData.key;
	          positionOfPlayer.push([ timelineDataFrames[0].participantFrames[idOfPlayer[count][0]].position.x, timelineDataFrames[0].participantFrames[idOfPlayer[count][0]].position.y ]);
	          if (count === 9) {
	          	matchDataArray.push(patchDesired, positionOfPlayer, imgOfChamp, idOfPlayer, gameTimeline, info, resData)
	          	res.status(200).send(matchDataArray);
	          }
	        });
	      });
	    });
    });
  });
}

function getHistoryWithImages(req, res, country, matchHistory, count, results) {
	if (count >= matchHistory.length) return;
	request("https://" + country + champImageUrl + matchHistory[count][1] + "?" + process.env.stuff1, function(error, good) {
		good = JSON.parse(good.body);
		matchHistory[count][1] = 'http://ddragon.leagueoflegends.com/cdn/' + results[0] + '/img/champion/' + good.key + '.png';
		count++;
		if (count === matchHistory.length) {
			matchHistory = matchHistory.filter(function(summonersRift) {
				return summonersRift.length > 2;
			});
			res.status(200).send([ req.summonerId, matchHistory ]);
		}
		else {
			getHistoryWithImages(req, res, country, matchHistory, count, results);
		}				
	});
}

module.exports = controler;