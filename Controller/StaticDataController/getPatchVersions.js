const request = require("request");
const rp = require("request-promise");

const patchNumber = util.promisify(getPatchVersion);


async function getPatchVersion(info) {
  let apiVersion = null;
  // request(version, function(error, checkingVersion) {
  // var versionChecks = JSON.parse(checkingVersion.body);
  let versionChecks = JSON.parse(await rp(version));
  var splitCheck,
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
  var date = Date.now();
  let patchDesired = await patchNumber(info).catch(err => console.error(err)); // Don't forget to catch errors;
  request(`http://ddragon.leagueoflegends.com/cdn/${patchDesired}/data/en_US/item.json`, function(
    err,
    data
  ) {
    if (error) return console.error(error);
    var resData = JSON.parse(data.body).data;

    // getting timeline information by frame from another endpoint
    // since the first timeline request doesn't have the full info
    // by frame for the game
    request(
      `https://${regionName}${matchTimelineUrl}${Object.keys(req.body)[0]}?${process.env.stuff1}`,
      function(er, timelineData) {
        var timelineDataFrames = JSON.parse(timelineData.body).frames;
        for (var j = 0; j < timelineDataFrames.length; j++) {
          gameTimeline.push([timelineDataFrames[j]]);
        }

        // have to use number for numerator since
        // scroll not up yet
        var stepScroll = 300 / gameTimeline.length;

        // going to add this call to db to "cache"
        StaticData.find().exec(function(error, staticInfo) {
          if (error) return console.error(error);
          if (!staticInfo || date - staticInfo.created_at >= 604800000) {
            StaticData.remove({}, function(error, removed) {
              if (error) return console.error(error);
              request(
                `http://ddragon.leagueoflegends.com/cdn/${patchDesired}/data/en_US/champion.json`,
                function(errors, inform) {
                  var parsedStaticData = JSON.parse(inform.body);
                  StaticData.create(
                    { created_at: { $lt: date }, static: parsedStaticData },
                    function(err, successful) {
                      var allChamps = parsedStaticData.data;
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
            var allChamps = staticInfo[0].static;
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