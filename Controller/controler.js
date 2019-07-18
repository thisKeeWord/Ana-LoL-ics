const request = require("request");
const rp = require("request-promise");
const util = require("util");
const ThrottleCalls = require("./throttleCalls.js");
const StaticData = require("./../database/Schema/StaticDataModel.js");
const summonerUrl = ".api.riotgames.com/lol/summoner/v4/summoners/by-name/";
const matchHistoryList = ".api.riotgames.com/lol/match/v4/matchlists/by-account/";
const matchTimelineUrl = ".api.riotgames.com/lol/match/v4/timelines/by-match/";
const matchVersionUrl = ".api.riotgames.com/lol/match/v4/matches/";
const version = "https://ddragon.leagueoflegends.com/api/versions.json";
let regionName = null;
const patchNumber = util.promisify(getPatchVersion);

const controler = {
  userInformation: userInformation,
  matchList: matchList,
  getData: getData
};

// FINDING USER'S INFORMATION FROM ENDPOINT
function userInformation(req, res, next) {
  regionName = req.body.region.region.toLowerCase();
  const date = Date.now();
  if (req.body.username.userName) {
    req.summonerId = req.body.username.userName;
    req.summoner = req.body.summonerName.summoner;
    req.region = req.body.region.region.toLowerCase();
    return next();
  } else {
    ThrottleCalls.find({ created_at: { $lt: date } }).exec(function(error, success) {
      if (success.length && date - success[0]["created_at"] > 10000) {
        ThrottleCalls.remove({}, function(error, removed) {
          if (error) return console.error(error);
          usersInfo(date, req, res, next);
        });
      } else if (
        !success.length ||
        (success.length &&
          success.length <= 500 &&
          date - success[0]["created_at"] <= 10000 &&
          date - success[0]["created_at"] > 0)
      ) {
        usersInfo(date, req, res, next);
      } else {
        return res.render("./../index.html", {
          error: "too many requests, try again in a few"
        });
      }
    });
  }
}

// MOST RECENT 10 GAMES ON SUMMONER'S RIFT
function matchList(req, res) {
  const date = Date.now();
  ThrottleCalls.find({ created_at: { $lt: date } }).exec(function(error, success) {
    if (success.length && date - success[0]["created_at"] > 10000) {
      ThrottleCalls.remove({}, function(removed) {
        if (error) return console.error(error);
        getMatchList(date, req, res);
      });
    } else if (
      !success.length ||
      (success.length &&
        success.length <= 500 &&
        date - success[0]["created_at"] <= 10000 &&
        date - success[0]["created_at"] > 0)
    ) {
      getMatchList(date, req, res);
    } else {
      return res.render("./../index.html", {
        error: "too many requests, try again in a few"
      });
    }
  });
}

function getData(req, res) {
  let keepTrackOf429 = 0,
    count = -1,
    total = 0,
    compareVersions = 0;
    // patchDesired = 0,
    const gameTimeline = [],
    idOfPlayer = [],
    imgOfChamp = [],
    positionOfPlayer = [],
    matchDataArray = [],
    date = Date.now();
  ThrottleCalls.find({ created_at: { $lt: date } }).exec(function(error, success) {
    if (success.length && date - success[0]["created_at"] > 10000) {
      ThrottleCalls.remove({}, function(error, removed) {
        if (error) return console.error(error);
        ThrottleCalls.create({ created_at: date, whatToSave: Object.keys(req.body)[0] }, function(
          error,
          throttling
        ) {
          getGameData(
            keepTrackOf429,
            count,
            total,
            compareVersions,
            gameTimeline,
            idOfPlayer,
            imgOfChamp,
            positionOfPlayer,
            matchDataArray,
            req,
            res
          );
        });
      });
    } else if (
      !success.length ||
      (success.length &&
        success.length <= 500 &&
        date - success[0]["created_at"] <= 10000 &&
        date - success[0]["created_at"] > 0)
    ) {
      ThrottleCalls.create({ created_at: date, whatToSave: Object.keys(req.body)[0] }, function(
        error,
        throttling
      ) {
        getGameData(
          keepTrackOf429,
          count,
          total,
          compareVersions,
          gameTimeline,
          idOfPlayer,
          imgOfChamp,
          positionOfPlayer,
          matchDataArray,
          req,
          res
        );
      });
    } else {
      return res.render("./../index.html", {
        error: "too many requests, try again in a few"
      });
    }
  });
}

function usersInfo(date, req, res, next) {
  ThrottleCalls.create({ created_at: date, whatToSave: req.body.username.userName }, function(
    error,
    throttling
  ) {
    request(
      "https://" +
        req.body.region.region.toLowerCase() +
        summonerUrl +
        encodeURI(req.body.username.userName) +
        "?" +
        process.env.stuff1,
      (error, resp) => {
        if (error) return console.error("we cannot find the summoner or " + error);
        if (resp.statusCode === 200) {
          let userId = JSON.parse(resp.body);
          let result = userId["accountId"];
          req.summonerId = result;
          req.userName = req.body.summonerName.summoner;
          req.region = req.body.region.region.toLowerCase();
        }
        return next();
      }
    );
  });
}

// can split nested requests
function getMatchList(date, req, res, next) {
  request(version, (error, results) => {
    results = JSON.parse(results.body);

    ThrottleCalls.create({ created_at: date, whatToSave: req.summonerId }, function(
      error,
      throttling
    ) {
      if (error) return console.error(error);
      let count = 0,
        matchHistory = [];
      let country = req.body.region.region.toLowerCase();
      request(
        "https://" + country + matchHistoryList + req.summonerId + "?" + process.env.stuff1,
        (error, response) => {
          if (error) return console.error(error, "here");
          if (response.statusCode === 200) {
            let gamesList = JSON.parse(response.body).matches.slice(0, 30);
            for (let i = 0; i < gamesList.length; i++) {
              const perGameSpec = [],
                queueType = gamesList[i]["queue"];
              if (
                queueType === 420 ||
                queueType === 2 ||
                queueType === 14 ||
                queueType === 4 ||
                queueType === 42 ||
                queueType === 400 ||
                queueType === 440
              ) {
                perGameSpec.push(gamesList[i]["gameId"]);
                perGameSpec.push(gamesList[i]["champion"]);
                let needDate = new Date(gamesList[i]["timestamp"])
                  .toString()
                  .replace(/(?:\s+GMT[\+\-]\d+)?(?:\s+\([^\)]+\))?$/, "");
                perGameSpec.push(needDate);
                perGameSpec.push(gamesList[i]["lane"]);
                perGameSpec.push(gamesList[i]["platformId"]);
                perGameSpec.push(gamesList[i]["queue"]);
                perGameSpec.push(gamesList[i]["role"]);
                perGameSpec.push(gamesList[i]["season"]);
              }
              matchHistory.push(perGameSpec);
            }
            getHistoryWithImages(req, res, country, matchHistory, count, results);
          }
        }
      );
    });
  });
}

function getGameData(
  keepTrackOf429,
  count,
  total,
  compareVersions,
  gameTimeline,
  idOfPlayer,
  imgOfChamp,
  positionOfPlayer,
  matchDataArray,
  req,
  res
) {
  request(
    "https://" + regionName + matchVersionUrl + Object.keys(req.body)[0] + "?" + process.env.stuff1,
    function(error, newData) {
      if (error) return console.error(error);
      if (
        newData.statusCode === 429 &&
        (!newData.headers["X-Rate-Limit-Type"] ||
          newData.headers["X-Rate-Limit-Type"] === "service") &&
        keepTrackOf429 < 15
      ) {
        setTimeout(
          getGameData(
            keepTrackOf429 + 1,
            count,
            total,
            compareVersions,
            gameTimeline,
            idOfPlayer,
            imgOfChamp,
            positionOfPlayer,
            matchDataArray,
            req,
            res
          ),
          10
        );
      }
      // getting correct patch version to compare with data version
      else {
        let info = JSON.parse(newData.body);
        comparePatchVersions(
          info,
          count,
          compareVersions,
          gameTimeline,
          idOfPlayer,
          imgOfChamp,
          positionOfPlayer,
          matchDataArray,
          req,
          res
        );
      }
    }
  );
}

async function getPatchVersion(info) {

  let apiVersion = null;
  let versionChecks = JSON.parse(await rp(version));
  let splitCheck,
    gamePatch,
    patchVersion = 0;
  // if (error) return console.error(error);
  if (info) {
    while (patchVersion < versionChecks.length) {
      splitCheck = versionChecks[patchVersion].split(".").slice(0, 2);
      gamePatch = info["gameVersion"].split(".").slice(0, 2);
      if (splitCheck.join("") === gamePatch.join("")) {
        apiVersion = versionChecks[patchVersion];
        break;
      }
      patchVersion++;
    }
  } else {
    apiVersion = versionChecks[0];
  }
  return apiVersion;
  // });
}

// getting proper patch version to compare with data version
async function comparePatchVersions(
  info,
  count,
  compareVersions,
  gameTimeline,
  idOfPlayer,
  imgOfChamp,
  positionOfPlayer,
  matchDataArray,
  req,
  res
) {
  let date = Date.now();
  let patchDesired = await patchNumber(info).catch(err => console.error(err)); // Don't forget to catch errors;
  request(`http://ddragon.leagueoflegends.com/cdn/${patchDesired}/data/en_US/item.json`, function(
    err,
    data
  ) {
    if (error) return console.error(error);
    let resData = JSON.parse(data.body).data;

    // getting timeline information by frame from another endpoint
    // since the first timeline request doesn't have the full info
    // by frame for the game
    request(
      `https://${regionName}${matchTimelineUrl}${Object.keys(req.body)[0]}?${process.env.stuff1}`,
      function(er, timelineData) {
        let timelineDataFrames = JSON.parse(timelineData.body).frames;
        for (let j = 0; j < timelineDataFrames.length; j++) {
          gameTimeline.push([timelineDataFrames[j]]);
        }

        // have to use number for numerator since
        // scroll not up yet
        let stepScroll = 300 / gameTimeline.length;

        // going to add this call to db to "cache"
        StaticData.find().exec(function(error, staticInfo) {
          if (error) return console.error(error);
          if (!staticInfo || date - staticInfo.created_at >= 604800000) {
            StaticData.remove({}, function(error, removed) {
              if (error) return console.error(error);
              request(
                `http://ddragon.leagueoflegends.com/cdn/${patchDesired}/data/en_US/champion.json`,
                function(errors, inform) {
                  let parsedStaticData = JSON.parse(inform.body);
                  StaticData.create(
                    { created_at: { $lt: date }, static: parsedStaticData },
                    function(err, successful) {
                      let allChamps = parsedStaticData.data;
                      championImageHelper(
                        timelineDataFrames,
                        allChamps,
                        idOfPlayer,
                        count,
                        matchDataArray,
                        positionOfPlayer,
                        imgOfChamp,
                        idOfPlayer,
                        gameTimeline,
                        info,
                        resData,
                        res
                      );
                    }
                  );
                }
              );
            });
          } else {
            let allChamps = staticInfo[0].static;
            championImageHelper(
              timelineDataFrames,
              allChamps,
              idOfPlayer,
              count,
              matchDataArray,
              positionOfPlayer,
              imgOfChamp,
              idOfPlayer,
              gameTimeline,
              info,
              resData,
              res
            );
          }
        });
      }
    );
  });
}

async function getHistoryWithImages(req, res, country, matchHistory, count, results) {
  let date = Date.now();
  let patchDesired = await getPatchVersion().catch(err => console.error(err)); // Don't forget to catch errors;
  if (count >= matchHistory.length) return;
  //staticInfo not valid?
  StaticData.find().exec(function(error, staticInfo) {
    if (error) return console.error(error);
    if (
      !staticInfo || staticInfo.length === 0 || !staticInfo[0].static ||
      date - staticInfo[0].created_at >= 604800000
    ) {
      StaticData.remove({}, function(error, removed) {
        if (error) return console.error(error);
        // getPatchVersion();
        request(
          `http://ddragon.leagueoflegends.com/cdn/${patchDesired}/data/en_US/champion.json`,
          function(errors, inform) {
            if (errors) return console.error(errors);
            let allChamps = JSON.parse(inform.body).data;
            StaticData.create({ created_at: date, static: allChamps }, function(err, successful) {
              if (err) return console.error(err);
              for (let getId in allChamps) {
                if (allChamps[getId].id === matchHistory[count][1]) {
                  matchHistory[count][1] = `http://ddragon.leagueoflegends.com/cdn/${
                    results[0]
                  }/img/champion/${allChamps[getId].key}.png`;
                  count++;
                  if (count === matchHistory.length) {
                    matchHistory = matchHistory.filter(function(summonersRift) {
                      return summonersRift.length > 2;
                    });
                    res.status(200).send([req.summonerId, matchHistory]);
                  }
                }
              }
            });
          }
        );
      });
    } else {
      let allChamps = staticInfo[0].static;
      const champ_key_list = {};
      for (let getId in allChamps) {
        champ_key_list[allChamps[getId].key] = allChamps[getId].id;
      }

      matchHistory = matchHistory.filter(el => el.length > 0);
      for (let i = 0; i < matchHistory.length; i++) {
        if (matchHistory[i]) {
          matchHistory[i][1] = `http://ddragon.leagueoflegends.com/cdn/${results[0]}/img/champion/${
            champ_key_list[matchHistory[i][1]]
          }.png`;
          if (i === matchHistory.length - 1) {
            matchHistory = matchHistory.filter(function(summonersRift) {
              return summonersRift.length > 2;
            });
            return res.status(200).send([req.summonerId, matchHistory]);
          }
        }
      }
    }
  });
  // functin should return something
}

function championImageHelper(
  timelineDataFrames,
  allChamps,
  idOfPlayer,
  count,
  matchDataArray,
  positionOfPlayer,
  imgOfChamp,
  idOfPlayer,
  gameTimeline,
  info,
  resData,
  res
) {
  info.participants.forEach(function(i) {
    let pId = i.participantId;
    let cId = i.championId;
    let playerRole = i.timeline.role;
    let playerLane = i.timeline.lane;

    // participant-id and champion-id
    idOfPlayer.push([pId, cId, playerRole, playerLane]);

    // getting champion numerical key to grab image
    for (let getId in allChamps) {
      if (allChamps[getId].id === cId) {
        count++;
        imgOfChamp[cId] = allChamps[getId].key;
        positionOfPlayer.push([
          timelineDataFrames[0].participantFrames[idOfPlayer[count][0]].position.x,
          timelineDataFrames[0].participantFrames[idOfPlayer[count][0]].position.y
        ]);
        if (count === 9) {
          matchDataArray.push(
            positionOfPlayer,
            imgOfChamp,
            idOfPlayer,
            gameTimeline,
            info,
            resData
          );
          res.status(200).send(matchDataArray);
        }
      }
    }
  });
}

module.exports = controler;
