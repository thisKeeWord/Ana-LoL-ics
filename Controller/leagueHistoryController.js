var request = require('request');



var History = {
  game: game,
  results: results
};


// find all TEEHEE92's games and save to database...
function game(req, res, next) {
  var storeLength = {};

  Game.find(storeLength, function(error, found) {
    if (error) return console.error(error);
    if (!found.length) {
      request(matchUrl, function(error, data) {
        if (error) return console.error(error);
        var result = JSON.parse(data.body).matches.reverse();
        storeLength = result.length;

        for (var i = 0; i < result.length; i++) {
          Game.create(result[i], function(error, gameSaved) {
            if (error) return console.error(error);
            console.log('gameSaved', gameSaved)

          });
        }
      });
      next()
    }
    else {
      console.log(Object.keys(found).length);
      request(matchUrl, function(error, data) {
        if (error) return console.error(error);

        // checks for updates -->
        // compares length of request response to database info and updates if diff
        var result = JSON.parse(data.body).matches.reverse();
        for (var i = Object.keys(found).length; i < result.length; i++) {
          Game.create(result[i], function(error, gameLogged) {
            if (error) return console.error(error);
            console.log('add ons to game.create', result[i])

          });
        }
      });
      next();
    }
  });
}

// champion data query and save
function results(req, res, next) {

  var champCheck = {};
  var toCheck = {
    userName: req.body.userName,
    champion: req.body.champion,
    championId: parseInt(champion(req.body.champion), 10),
    season: req.body.season
  };

  // finds user from database. if user doesnt exist, create user
  // if user exists, get users number
  User.findOne({ userName: toCheck.userName }, function(error, userFound) {
    if (error) return res.redirect('/');
    console.log(userFound);
    if (!userFound || (userFound.userName !== toCheck.userName)) {
      request(userUrl + toCheck.userName + '?' + keys.key, function(error, userResult) {
        console.log('about to make another request for user');
        if (error) return res.redirect('/');

        var userStats = JSON.parse(userResult.body);
        for(var key in userStats) {
          var gotId = userStats[key]["id"];
          User.create({ userName: toCheck.userName, userId: gotId }, function(error, userMade) {
            if (error) return console.error('in create user', error);
            champStuff(toCheck, userMade, res);
          });
        }
      });
    }
    else if(userFound && userFound.userName === toCheck.userName) {
      champStuff(toCheck, userFound, res);
    }
    else {
      return res.send('unknown error');
    }
  });
}


// helper function being called
function champStuff(infos, user, res) {
  Champ.findOne(infos, function(error, search) {
    if (error) return res.redirect('/');
    if (!search || search.season !== infos.season || (!infos.championId && !infos.season)) {
      request(champUrl + user.userId + '/ranked?season=' + infos.season + '&' + keys.key, function(error, champStat) {
        if (error) return res.redirect('/');
        var champStatis = JSON.parse(champStat.body).champions;
        console.log('infos', infos);
        for (var i = 0; i < champStatis.length; i++) {
          if (champStatis[i].id === infos.championId) {
            Champ.create({
              userName: infos.userName,
              champion: infos.champion,
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
            }, function(error, champSaved) {
              if(error) return console.error('in champ.create', error);
              // return res.send(champSaved);
            });
          }
        }
      });
    }
    else if (search.season === infos.season && search.champion === infos.champion) {
      return res.send(search);
    }
    else {
      return res.send("You haven't played this champ for the season specified");
    }
  });
}


module.exports = History;
