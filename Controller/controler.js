const request = require("request");
const rp = require("request-promise");
const ThrottleCalls = require("./throttleCalls.js");
const StaticData = require("./../database/Schema/StaticDataModel.js");
const summonerUrl = ".api.riotgames.com/lol/summoner/v4/summoners/by-name/";
const matchHistoryList = ".api.riotgames.com/lol/match/v4/matchlists/by-account/";
const matchTimelineUrl = ".api.riotgames.com/lol/match/v4/timelines/by-match/";
const matchVersionUrl = ".api.riotgames.com/lol/match/v4/matches/";
const version = "https://ddragon.leagueoflegends.com/api/versions.json";
let regionName = null;

const controler = {
  userInformation: userInformation,
  matchList: matchList,
  getData: getData,
};

// FINDING USER'S INFORMATION FROM ENDPOINT
function userInformation(req, res, next) {
  const { region, user_id, summonerName } = req.body;
  regionName = region.region.toLowerCase();
  const date = Date.now();
  if (user_id.users_id) {
    req.summonerId = user_id.users_id;
    req.summoner = summonerName.summoner;
    req.region = region.region.toLowerCase();

    return next();
  } else {
    // add a call to userInformation from matchList if users_id value in local storage is incorrect
    ThrottleCalls.find({ created_at: { $lt: date } }).exec((error, success) => {
      if (error) {
        throw new Error(error);
      }

      if (success.length && date - success[0]["created_at"] > 10000) {
        ThrottleCalls.remove({}, (err) => {
          if (error) {
            throw new Error(err);
          }
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
          error: "too many requests, try again in a few",
        });
      }
    });
  }
}

function usersInfo(date, req, res, next) {
  const { region, summonerName } = req.body;

  ThrottleCalls.create({ created_at: date, whatToSave: summonerName.summoner }, function(error) {
    if (error) {
      throw new Error(error);
    }
    request(
      `https://${region.region.toLowerCase()}${summonerUrl}${encodeURI(summonerName.summoner)}?${
        process.env.stuff1
      }`,
      (error, resp) => {
        if (error) {
          throw new Error("cannot find the summoner or " + error);
        }
        if (resp.statusCode === 200) {
          const userId = JSON.parse(resp.body);
          const result = userId["accountId"];
          req.summonerId = result;
          req.userName = summonerName.summoner;
          req.region = region.region.toLowerCase();
        }

        return next();
      }
    );
  });
}

// MOST RECENT 10 GAMES ON SUMMONER'S RIFT
function matchList(req, res) {
  const date = Date.now();
  ThrottleCalls.find({ created_at: { $lt: date } }).exec(function(error, success) {
    if (error) {
      throw new Error(error);
    }

    if (success.length && date - success[0]["created_at"] > 10000) {
      ThrottleCalls.remove({}, function(err) {
        if (err) {
          throw new Error(err);
        }
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
        error: "too many requests, try again in a few",
      });
    }
  });
}

function getData(req, res) {
  const keepTrackOf429 = 0,
    count = -1,
    total = 0,
    compareVersions = 0;

  const gameTimeline = [],
    idOfPlayer = [],
    imgOfChamp = [],
    positionOfPlayer = [],
    matchDataArray = [],
    date = Date.now();

  ThrottleCalls.find({ created_at: { $lt: date } }).exec((error, success) => {
    if (success.length && date - success[0]["created_at"] > 10000) {
      ThrottleCalls.remove({}, function(error) {
        if (error) {
          throw new Error(error);
        }
        ThrottleCalls.create({ created_at: date, whatToSave: Object.keys(req.body)[0] }, function(
          err
        ) {
          if (err) {
            throw new Error(err);
          }
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
        error
      ) {
        if (error) {
          throw new Error(error);
        }
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
        error: "too many requests, try again in a few",
      });
    }
  });
}

// can split nested requests
function getMatchList(date, req, res) {
  request(version, (error, results) => {
    results = JSON.parse(results.body);

    ThrottleCalls.create({ created_at: date, whatToSave: req.summonerId }, function(error) {
      if (error) {
        throw new Error(error);
      }
      const count = 0,
        matchHistory = [];
      const country = req.body.region.region.toLowerCase();
      request(
        "https://" + country + matchHistoryList + req.summonerId + "?" + process.env.stuff1,
        (error, response) => {
          if (error) {
            throw (new error(), "here");
          }
          if (response.statusCode === 200) {
            const gamesList = JSON.parse(response.body).matches.slice(0, 20);
            for (let i = 0; i < gamesList.length; i++) {
              const perGameSpec = [];
              const queueType = gamesList[i].queue;
              if (
                queueType === 420 ||
                queueType === 2 ||
                queueType === 14 ||
                queueType === 4 ||
                queueType === 42 ||
                queueType === 400 ||
                queueType === 440
              ) {
                const needDate = new Date(gamesList[i].timestamp)
                  .toString()
                  .replace(/(?:\s+GMT[+-]\d+)?(?:\s+\([^)]+\))?$/, "");
                perGameSpec.push(
                  gamesList[i].gameId,
                  gamesList[i].champion,
                  needDate,
                  gamesList[i].lane,
                  gamesList[i].platformId,
                  gamesList[i].queue,
                  gamesList[i].role,
                  gamesList[i].season
                );
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
      if (error) {
        throw new Error(error);
      }
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
        const info = JSON.parse(newData.body);
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
  const versionChecks = JSON.parse(await rp(version));
  let splitCheck,
    gamePatch,
    patchVersion = 0;
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
  const date = Date.now();
  const patchDesired = await getPatchVersion(info).catch((err) => {
    throw new Error(err);
  }); // Don't forget to catch error;
  request(`http://ddragon.leagueoflegends.com/cdn/${patchDesired}/data/en_US/item.json`, function(
    err,
    data
  ) {
    if (err) {
      throw new Error(err);
    }
    const resData = JSON.parse(data.body).data;

    // getting timeline information by frame from another endpoint
    // since the first timeline request doesn't have the full info
    // by frame for the game
    request(
      `https://${regionName}${matchTimelineUrl}${Object.keys(req.body)[0]}?${process.env.stuff1}`,
      function(er, timelineData) {
        const timelineDataFrames = JSON.parse(timelineData.body).frames;
        for (let j = 0; j < timelineDataFrames.length; j++) {
          gameTimeline.push([timelineDataFrames[j]]);
        }

        // have to use number for numerator since
        // scroll not up yet
        // const stepScroll = 300 / gameTimeline.length;

        // going to add this call to db to "cache"
        StaticData.find().exec(function(error, staticInfo) {
          if (error) {
            throw new Error(error);
          }
          if (!staticInfo || date - staticInfo.created_at >= 604800000) {
            StaticData.remove({}, function(error) {
              if (error) {
                throw new Error(error);
              }
              request(
                `http://ddragon.leagueoflegends.com/cdn/${patchDesired}/data/en_US/champion.json`,
                function(errors, inform) {
                  const parsedStaticData = JSON.parse(inform.body);
                  StaticData.create(
                    { created_at: { $lt: date }, static: parsedStaticData },
                    function(err) {
                      if (err) {
                        throw new Error(error);
                      }
                      const allChamps = parsedStaticData.data;
                      championImageHelper(
                        patchDesired,
                        timelineDataFrames,
                        allChamps,
                        idOfPlayer,
                        count,
                        matchDataArray,
                        positionOfPlayer,
                        imgOfChamp,
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
            const allChamps = staticInfo[0].static;
            championImageHelper(
              patchDesired,
              timelineDataFrames,
              allChamps,
              idOfPlayer,
              count,
              matchDataArray,
              positionOfPlayer,
              imgOfChamp,
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
  const date = Date.now();
  const patchDesired = await getPatchVersion().catch((err) => {
    throw new Error(err);
  }); // Don't forget to catch error;
  if (count >= matchHistory.length) {
    return;
  }
  //staticInfo not valid?
  StaticData.find().exec(function(error, staticInfo) {
    if (error) {
      throw new Error(error);
    }
    if (
      !staticInfo ||
      staticInfo.length === 0 ||
      !staticInfo[0].static ||
      date - staticInfo[0].created_at >= 604800000
    ) {
      StaticData.remove({}, function(error) {
        if (error) {
          throw new Error(error);
        }
        request(
          `http://ddragon.leagueoflegends.com/cdn/${patchDesired}/data/en_US/champion.json`,
          function(errors, inform) {
            if (errors) {
              throw new Error(errors);
            }
            const allChamps = JSON.parse(inform.body).data;
            StaticData.create({ created_at: date, static: allChamps }, function(err) {
              if (err) {
                throw new Error(err);
              }
              for (const getId in allChamps) {
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
      const allChamps = staticInfo[0].static;
      const champ_key_list = {};
      for (const getId in allChamps) {
        champ_key_list[allChamps[getId].key] = allChamps[getId].id;
      }

      matchHistory = matchHistory.filter((el) => el.length > 0);
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
  patchDesired,
  timelineDataFrames,
  allChamps,
  idOfPlayer,
  count,
  matchDataArray,
  positionOfPlayer,
  imgOfChamp,
  gameTimeline,
  info,
  resData,
  res
) {
  info.participants.forEach(function(i) {
    const pId = i.participantId;
    const cId = i.championId;
    const playerRole = i.timeline.role;
    const playerLane = i.timeline.lane;

    // participant-id and champion-id
    idOfPlayer.push([pId, cId, playerRole, playerLane]);

    // getting champion numerical key to grab image
    for (const getId in allChamps) {
      const champion_key = allChamps[getId].key;
      const champion_id = allChamps[getId].id;

      if (champion_key == cId) {
        count++;
        imgOfChamp[cId] = champion_id;
        positionOfPlayer.push([
          timelineDataFrames[0].participantFrames[idOfPlayer[count][0]].position.x,
          timelineDataFrames[0].participantFrames[idOfPlayer[count][0]].position.y,
        ]);
        if (count === 9) {
          matchDataArray.push(
            patchDesired,
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
