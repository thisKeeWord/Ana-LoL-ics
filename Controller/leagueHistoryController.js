var request = require('request');
var champUrl = '.api.pvp.net/api/lol/';
var allChampInfo = 'https://global.api.pvp.net/api/lol/static-data/';
var ThrottleCalls = require('./throttleCalls.js');

// var userUrl = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/';



var History = {
  // game: game,
  results: results
};


// // find all TEEHEE92's games and save to database...
// function game(req, res, next) {
//   var storeLength = {};

//   Game.find(storeLength, function(error, found) {
//     if (error) return console.error(error);
//     if (!found.length) {
//       request(matchUrl, function(error, data) {
//         if (error) return console.error(error);
//         var result = JSON.parse(data.body).matches.reverse();
//         storeLength = result.length;

//         for (var i = 0; i < result.length; i++) {
//           Game.create(result[i], function(error, gameSaved) {
//             if (error) return console.error(error);
//             console.log('gameSaved', gameSaved)

//           });
//         }
//       });
//       next()
//     }
//     else {
//       console.log(Object.keys(found).length);
//       request(matchUrl, function(error, data) {
//         if (error) return console.error(error);

//         // checks for updates -->
//         // compares length of request response to database info and updates if diff
//         var result = JSON.parse(data.body).matches.reverse();
//         for (var i = Object.keys(found).length; i < result.length; i++) {
//           Game.create(result[i], function(error, gameLogged) {
//             if (error) return console.error(error);
//             console.log('add ons to game.create', result[i])

//           });
//         }
//       });
//       next();
//     }
//   });
// }

// champion data query and save
function results(req, res, next) {
  var champCheck = {};
  var toCheck = {
    userName: req.body.userName,
    champion: req.body.champion,
    // championId: parseInt(champion(req.body.champion), 10),
    season: req.body.season,
    region: req.body.region.region.toLowerCase()
  };

  request(allChampInfo + toCheck.region + '/v1.2/champion?' + process.env.stuff2, function(err, champDatas) {
    var champDatum = JSON.parse(champDatas.body).data;


  // finds user from database. if user doesnt exist, create user
  // if user exists, get users number
  // User.findOne({ userName: toCheck.userName }, function(error, userFound) {
  //   if (error) return res.redirect('/');
  //   console.log(userFound);
  //   if (!userFound || (userFound.userName !== toCheck.userName)) {
  //     request(userUrl + toCheck.userName + '?' + keys.key, function(error, userResult) {
  //       console.log('about to make another request for user');
  //       if (error) return res.redirect('/');

  //       var userStats = JSON.parse(userResult.body);
  //       for(var key in userStats) {
  //         var gotId = userStats[key]["id"];
  //         User.create({ userName: toCheck.userName, userId: gotId }, function(error, userMade) {
  //           if (error) return console.error('in create user', error);
  //           champStuff(toCheck, userMade, res);
  //         });
  //       }
  //     });
  //   }
    // else if(userFound && userFound.userName === toCheck.userName) {
      champStuff(req, champDatum, toCheck, res);
    // }
    // else {
      // return res.send('unknown error');
    // }
  // });
  });
}


// helper function being called
function champStuff(req, champDatum, infos, res) {
  var date = Date.now();
  ThrottleCalls.find({ 'created_at': { $lt: date } }).exec(function(error, success) {
    // if (newData.statusCode === 429 && (!newData.headers["X-Rate-Limit-Type"] || newData.headers["X-Rate-Limit-Type"] === "service") && keepTrackOf429 < 15) {
      // setTimeout(getGameData(keepTrackOf429 + 1, count, total, compareVersions, patchDesired, gameTimeline, idOfPlayer, imgOfChamp, positionOfPlayer, matchDataArray, req, res), 10);
    // }
    if (success.length && date - success[0]['created_at'] > 10000) {
      ThrottleCalls.remove({}, function(error, removed) {
        if (error) return console.error(error);
        ThrottleCalls.create({ 'created_at': date, 'whatToSave': Object.keys(req.body)[0] }, function(error, throttling) {
          if (error) return console.error(error);
          getStats(req, champDatum, infos, res);
        })
      })
    }
    else if (!success.length || (success.length && success.length < 14 && date - success[0]['created_at'] <= 10000 && date - success[0]['created_at'] > 0)) {
      ThrottleCalls.create({ 'created_at': date, 'whatToSave': Object.keys(req.body)[0] }, function(error, throttling) {
        if (error) return console.error(error);
        getStats(req, champDatum, infos, res);
      })
    }
    else {
      return res.render('./../index.html', { error: 'too many requests, try again in a few' });
    }
  })
  // Champ.findOne(infos, function(error, search) {
  //   if (error) return res.redirect('/');
}

function getStats(req, champDatum, infos, res) {
  var desiredChamp = {};
  request('https://' + infos.region + champUrl + infos.region + '/v1.3/stats/by-summoner/' + req.summonerId + '/ranked?season=SEASON' + infos.season + '&' + process.env.stuff1, function(error, champStat) {
    if (error) return res.redirect('/');
    var champStatis = JSON.parse(champStat.body).champions;
    var champNameCheck = Object.keys(champDatum);
    for (var i = 0; i < champNameCheck.length; i++) {
      champNameCheck[i] = champNameCheck[i].toLowerCase();
    }
    var champName = champDatum[Object.keys(champDatum)[champNameCheck.indexOf(infos.champion)]].id;
    for (var i = 0; i < champStatis.length; i++) {
      if (champStatis[i].id === champName) {
        desiredChamp = {
          userName: infos.userName,
          champion: champName,
          championId: champStatis[i].id,
          season: infos.season,
          totalDeathsPerSession: champStatis[i].stats["totalDeathsPerSession"],
          totalSessionsPlayed: champStatis[i].stats["totalSessionsPlayed"],
          totalDamageTaken: champStatis[i].stats["totalDamageTaken"],
          totalQuadraKills: champStatis[i].stats["totalQuadraKills"],
          totalTripleKills: champStatis[i].stats["totalTripleKills"],
          totalMinionKills: champStatis[i].stats["totalMinionKills"],
          maxChampionsKilled: champStatis[i].stats["maxChampionsKilled"],
          totalDoubleKills: champStatis[i].stats["totalDoubleKills"],
          totalPhysicalDamageDealt: champStatis[i].stats["totalPhysicalDamageDealt"],
          totalChampionKills: champStatis[i].stats["totalChampionKills"],
          totalAssists: champStatis[i].stats["totalAssists"],
          mostChampionKillsPerSession: champStatis[i].stats["mostChampionKillsPerSession"],
          totalDamageDealt: champStatis[i].stats["totalDamageDealt"],
          totalFirstBlood: champStatis[i].stats["totalFirstBlood"],
          totalSessionsLost: champStatis[i].stats["totalSessionsLost"],
          totalSessionsWon: champStatis[i].stats["totalSessionsWon"],
          totalMagicDamageDealt: champStatis[i].stats["totalMagicDamageDealt"],
          totalGoldEarned: champStatis[i].stats["totalGoldEarned"],
          totalPentaKills: champStatis[i].stats["totalPentaKills"],
          totalTurretsKilled: champStatis[i].stats["totalTurretsKilled"],
          mostSpellsCast: champStatis[i].stats["mostSpellsCast"],
          maxNumDeaths: champStatis[i].stats["maxNumDeaths"],
          totalUnrealKills: champStatis[i].stats["totalUnrealKills"]
        }
      
      return res.send([ req.summonerId, desiredChamp ]);

      }
    }
  });
}


module.exports = History;
