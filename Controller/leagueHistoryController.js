var request = require('request');
var champUrl = '.api.pvp.net/api/lol/';
var allChampInfo = 'https://global.api.pvp.net/api/lol/static-data/';
var ThrottleCalls = require('./throttleCalls.js');

var History = {
  results: results
};

// champion data query and save
function results(req, res, next) {
  var champCheck = {};
  var toCheck = {
    userName: req.body.summonerName.summoner,
    champion: req.body.champion,
    season: req.body.season,
    region: req.body.region.region.toLowerCase()
  };

  request(allChampInfo + toCheck.region + '/v1.2/champion?' + process.env.stuff2, function(err, champDatas) {
    var champDatum = JSON.parse(champDatas.body).data;
    champStuff(req, champDatum, toCheck, res);
  });
}

// helper function being called
function champStuff(req, champDatum, infos, res) {
  var date = Date.now();
  ThrottleCalls.find({ 'created_at': { $lt: date } }).exec(function(error, success) {
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
      });
    }
  });
}

function getStats(req, champDatum, infos, res) {
  var desiredChamp = {};
  request('https://' + infos.region + champUrl + infos.region + '/v1.3/stats/by-summoner/' + req.summonerId + '/ranked?season=SEASON' + infos.season + '&' + process.env.stuff1, function(error, champStat) {
    if (error) return console.error(error);
    var champStatis = JSON.parse(champStat.body).champions;
    var champNameCheck = Object.keys(champDatum);
    for (var i = 0; i < champNameCheck.length; i++) {
      champNameCheck[i] = champNameCheck[i].toLowerCase();
    }
    var champName = champDatum[Object.keys(champDatum)[champNameCheck.indexOf(infos.champion)]].id;
    for (var i = 0; i < champStatis.length; i++) {
      if (champStatis[i].id === champName) {
        var capitalizeFirstLetter = infos.champion.substr(0, 1);
        capitalizeFirstLetter = capitalizeFirstLetter.toUpperCase() + infos.champion.substr(1, infos.champion.length - 1);
        desiredChamp = {
          userName: infos.userName,
          champion: capitalizeFirstLetter,
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
