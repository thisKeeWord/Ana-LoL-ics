import React from "react";

class EventDisplay extends React.Component {
  // LOGS CHAMPION KILLS PER FRAME
  log() {
    // FIRST/SECOND GAME
    if (
      (this.props.timeline1 &&
        this.props.champImg1 &&
        this.props.playerInfo1 &&
        this.props.gamesToSee === 1) ||
      (this.props.timeline2 &&
        this.props.champImg2 &&
        this.props.playerInfo2 &&
        this.props.gamesToSee === 2)
    ) {
      let eventPerGame = [];
      for (let i = 1; i <= this.props.gamesToSee; i++) {
        let interaction = [];
        if (this.props["timeline" + i.toString()][this.props.spot]) {
          if (this.props["timeline" + i.toString()][this.props.spot][0].events) {
            let searchEvents = this.props["timeline" + i.toString()][this.props.spot][0].events;
            for (let j = 0; j < searchEvents.length; j++) {
              if (searchEvents[j].type === "CHAMPION_KILL") {
                if (searchEvents[j].killerId === 0) {
                  interaction.push([
                    this.props["champImg" + i.toString()][
                      this.props["playerInfo" + i.toString()][searchEvents[j].victimId - 1][1]
                    ]
                  ]);
                } else {
                  interaction.push([
                    this.props["playerInfo" + i.toString()][searchEvents[j].killerId - 1],
                    this.props["playerInfo" + i.toString()][searchEvents[j].victimId - 1]
                  ]);
                }
              }
            }
          }
          eventPerGame.push(interaction);
        } else {
          eventPerGame.push([]);
        }
      }
      return eventPerGame;
    }
  }

  render() {
    let stat = this.log();

    // DOESN'T EXIST INITIALLY
    if (!stat) {
      return <div id="eventDisplay"></div>;
    }
    const colorOfTeam = {
      1: "blue",
      2: "blue",
      3: "blue",
      4: "blue",
      5: "blue",
      6: "purple",
      7: "purple",
      8: "purple",
      9: "purple",
      10: "purple"
    };
    // GAME 1
    if (this.props.gamesToSee === 1) {
      return (
        <div id={"eventDisplay" + 1 * this.props.gamesToSee}>
          {stat[0].map(champFight => {
            if (!champFight[1]) {
              return (
                <div>
                  <div
                    id="champExecuted"
                    style={{
                      border: "1px solid " + colorOfTeam[champFight[0][0]],
                      height: "40px",
                      width: "40px"
                    }}
                  >
                    <img
                      src={
                        "http://ddragon.leagueoflegends.com/cdn/" +
                        this.props.patch1 +
                        "/img/champion/" +
                        this.props["champImg" + 1 * this.props.gamesToSee][champFight[0][0]] +
                        ".png"
                      }
                      height={40}
                      width={40}
                    />
                    &nbsp;&nbsp;&nbsp; executed!
                  </div>
                </div>
              );
            }
            return (
              <div>
                <div
                  id="champKiller"
                  style={{
                    border: "1px solid " + colorOfTeam[champFight[0][0]],
                    height: "40px",
                    width: "40px"
                  }}
                >
                  <img
                    src={
                      "http://ddragon.leagueoflegends.com/cdn/" +
                      this.props.patch1 +
                      "/img/champion/" +
                      this.props["champImg" + 1 * this.props.gamesToSee][champFight[0][1]] +
                      ".png"
                    }
                    height={40}
                    width={40}
                  />
                </div>
                &nbsp;&nbsp;&nbsp; has slain &nbsp;&nbsp;&nbsp;
                <div
                  id="champVictim"
                  style={{
                    border: "1px solid " + colorOfTeam[champFight[1][0]],
                    height: "40px",
                    width: "40px"
                  }}
                >
                  <img
                    src={
                      "http://ddragon.leagueoflegends.com/cdn/" +
                      this.props.patch1 +
                      "/img/champion/" +
                      this.props["champImg" + 1 * this.props.gamesToSee][champFight[1][1]] +
                      ".png"
                    }
                    height={40}
                    width={40}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // GAME 2
    if (this.props.gamesToSee === 2) {
      let eventArr = [1, 2];
      return (
        <div>
          {eventArr.map(i => {
            return (
              <div id={"eventDisplay" + i * this.props.gamesToSee} key={i}>
                {stat[i - 1].map(champFight => {
                  if (!champFight[1]) {
                    return (
                      <div
                        id="playerExecuted"
                        style={{
                          border: "1px solid " + colorOfTeam[champFight[0][0]],
                          height: "40px",
                          width: "40px"
                        }}
                      >
                        <img
                          src={
                            "http://ddragon.leagueoflegends.com/cdn/" +
                            this.props.patch1 +
                            "/img/champion/" +
                            this.props["champImg" + 1 * this.props.gamesToSee][champFight[0][0]] +
                            ".png"
                          }
                          height={40}
                          width={40}
                        />
                        &nbsp;&nbsp;&nbsp; has been executed!
                      </div>
                    );
                  }
                  return (
                    <div id="playerKPlayer">
                      <div
                        id={"champKiller" + i.toString()}
                        style={{
                          border: "1px solid " + colorOfTeam[champFight[0][0]],
                          height: "30px",
                          width: "30px"
                        }}
                      >
                        <img
                          src={
                            "http://ddragon.leagueoflegends.com/cdn/" +
                            this.props["patch" + i.toString()] +
                            "/img/champion/" +
                            this.props["champImg" + i.toString()][champFight[0][1]] +
                            ".png"
                          }
                          height={30}
                          width={30}
                        />
                      </div>
                      &nbsp;&nbsp;&nbsp; has slain &nbsp;&nbsp;&nbsp;
                      <div
                        id={"champVictim" + i.toString()}
                        style={{
                          border: "1px solid " + colorOfTeam[champFight[1][0]],
                          height: "30px",
                          width: "30px"
                        }}
                      >
                        <img
                          src={
                            "http://ddragon.leagueoflegends.com/cdn/" +
                            this.props["patch" + i.toString()] +
                            "/img/champion/" +
                            this.props["champImg" + i.toString()][champFight[1][1]] +
                            ".png"
                          }
                          height={30}
                          width={30}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }
  }
}

module.exports = EventDisplay;
