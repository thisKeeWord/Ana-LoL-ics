import React from 'react';
import $ from 'jquery';

class Chart extends React.Component {

  diff() {
    // FIND SELECTION --> WARD PLACEMENT OR DELETIONS
    const allEvents = [];

    if ((this.props.timeline1 && this.props.gamesToSee === 1) || (this.props.timeline2 && this.props.gamesToSee === 2)) {
      for (let l = 1; l <= this.props.gamesToSee; l++) {
        let eventSpecific = [];
        let searchEvents = this.props["timeline" + l.toString()];
        let eventChosen = this.props.eventSelected;

        for (let i = 0; i < this.props["playerInfo" + l.toString()].length; i++) {
          let count = 0;
          if (eventChosen === 'WARD_PLACED' || eventChosen === 'WARD_KILL') {
            if (searchEvents[this.props.spot]) {
              for (let j = 0; j <= this.props.spot; j++) {
                if (searchEvents[j][0].events) {
                  for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                    if ((searchEvents[j][0].events[k].eventType === eventChosen && searchEvents[j][0].events[k].wardType !== "UNDEFINED") && (searchEvents[j][0].events[k].creatorId === this.props["playerInfo" + l.toString()][i][0] || searchEvents[j][0].events[k].killerId === this.props["playerInfo" + l.toString()][i][0])) {
                      count++;
                    }
                  }
                }
              }
            }
            else {
              for (let j = 0; j < searchEvents.length; j++) {
                if (searchEvents[j][0].events) {
                  for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                    if ((searchEvents[j][0].events[k].eventType === eventChosen && searchEvents[j][0].events[k].wardType !== "UNDEFINED")&& (searchEvents[j][0].events[k].creatorId === this.props["playerInfo" + l.toString()][i][0] || searchEvents[j][0].events[k].killerId === this.props["playerInfo" + l.toString()][i][0])) {
                      count++;
                    }
                  }
                }
              }
            }
          }
          if (eventChosen === 'killerId' || eventChosen === 'victimId' || eventChosen === 'assistingParticipantIds') {
            if (searchEvents[this.props.spot]) {
              for (let j = 0; j <= this.props.spot; j++) {
                if (searchEvents[j][0].events) {
                  for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                    if (searchEvents[j][0].events[k].eventType === 'CHAMPION_KILL') {
                      if (eventChosen === 'killerId' || eventChosen === 'victimId') {
                        if (searchEvents[j][0].events[k][eventChosen] === this.props["playerInfo" + l.toString()][i][0]) {
                          count++;
                        }
                      }
                      if (eventChosen === 'assistingParticipantIds' && searchEvents[j][0].events[k][eventChosen]) {
                        for (let assists = 0; assists < searchEvents[j][0].events[k][eventChosen].length; assists++) {
                          if (searchEvents[j][0].events[k][eventChosen][assists] === this.props["playerInfo" + l.toString()][i][0]) {
                            count++;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            else {
              for (let j = 0; j < searchEvents.length; j++) {
                if (searchEvents[j][0].events) {
                  for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                    if (searchEvents[j][0].events[k].eventType === 'CHAMPION_KILL') {
                      if (eventChosen === 'killerId' || eventChosen === 'victimId') {
                        if (searchEvents[j][0].events[k][eventChosen] === this.props["playerInfo" + l.toString()][i][0]) {
                          count++;
                        }
                      }
                      if (eventChosen === 'assistingParticipantIds' && searchEvents[j][0].events[k][eventChosen]) {
                        for (let assists = 0; assists < searchEvents[j][0].events[k][eventChosen].length; assists++) {
                          if (searchEvents[j][0].events[k][eventChosen][assists] === this.props["playerInfo" + l.toString()][i][0]) {
                            count++;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (eventChosen === 'minionsKilled') {
            if (searchEvents[this.props.spot]) {
              if (searchEvents[this.props.spot][0].participantFrames) {
                count = searchEvents[this.props.spot][0].participantFrames[i+1].minionsKilled + searchEvents[this.props.spot][0].participantFrames[i+1].jungleMinionsKilled
              }
            }
            else {
              if (searchEvents[searchEvents.length - 1][0].participantFrames) {
                count = searchEvents[searchEvents.length - 1][0].participantFrames[i+1].minionsKilled + searchEvents[searchEvents.length - 1][0].participantFrames[i+1].jungleMinionsKilled
              }
            }
          }
          if (eventChosen === 'totalGold') {
            if (searchEvents[this.props.spot]) {
              if (searchEvents[this.props.spot][0].participantFrames) {
                count = searchEvents[this.props.spot][0].participantFrames[i+1].totalGold;
              }
            }
            else {
              if (searchEvents[searchEvents.length - 1][0].participantFrames) {
                count = searchEvents[searchEvents.length - 1][0].participantFrames[i+1].totalGold;
              }
            }
          }
          eventSpecific.push(count);    
        }
        allEvents.push(eventSpecific);
      }
    return allEvents;
    }
  }

  redo(whichData) {
    // GRAB CHAMP NAMES TO USE AS LABELS FOR CHART
    const h = 450,  
          y = d3.scale.linear()
                .domain([0, 1])
                .range([0, h]),
          x = d3.scale.linear()
                .domain([0, 1])
                .rangeRound([0, 375]),
          yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("bottom");
    let labelWidth = 400;

    // GAMES
    for (let l = 1; l <= this.props.gamesToSee; l++) {
      let getName = [];
      if (this.props["selData" + l.toString()]) {
        let nameOfChamp = this.props["champName" + l.toString()],
            playerInformation = this.props["playerInfo" + l.toString()],
            whichSelData = this.props["selData" + l.toString()],
            whichMaxStat = this.props["maxForStat" + l.toString()];


        for (let name = 0; name < playerInformation.length; name++) {
          getName.push(nameOfChamp[playerInformation[name][1]])
        } 

        // CHECK IF TEXT AND BAR EXISTS, THEN REMOVE
        if (document.getElementById("statInfo" + l * this.props.gamesToSee) && document.getElementById("infoStat" + l * this.props.gamesToSee) && document.getElementById("nameStat" + l * this.props.gamesToSee)) {
          $("#statInfo" + l * this.props.gamesToSee).first().remove();
          $("#infoStat" + l * this.props.gamesToSee).first().remove();
          $("#nameStat" + l * this.props.gamesToSee).first().remove();
        }


        // APPEND NEW BAR AND TEXT
        // BAR WAS UPSIDE DOWN
        if(whichSelData) {
          if (document.getElementById("infoStat" + l * this.props.gamesToSee)) {
            $("#infoStat" + l * this.props.gamesToSee).first().remove();
          }
          whichSelData.append("g")
            .attr("id", "statInfo" + l * this.props.gamesToSee)
            .selectAll("rect")
            .data(whichData[l-1])
            .enter()
            .append("rect")
              .attr("y", (d, i) => {
                return y(i) / 10;
              })
              .attr("x", (d, i) => { 
                if(whichMaxStat) {
                  if (l === 2 || this.props.gamesToSee === 1) {
                    return (labelWidth - 58);
                  }
                  return 58;
                }
              })
              .attr("height",  h / whichData[l-1].length - 2)
              .attr("width", (d, i) => {
                if(whichMaxStat) {
                  return (d / whichMaxStat) * (labelWidth - 58);
                }
              })
              .attr("x", (d, i) => {
                if(whichMaxStat) {
                  if (l === 2 || this.props.gamesToSee === 1) {
                    return (labelWidth - 58) - (d / whichMaxStat) * (labelWidth - 58); // FLIP THE BAR TO LOAD UPWARD
                  }
                  return 58;
                }
              })
              .attr("fill", d => {
                return "white";
              })
              .attr("id", "shape");

          // APPEND TEXT INSIDE BAR
          whichSelData.append("g")
            .attr("id", "infoStat" + l * this.props.gamesToSee)
            .selectAll("text")
            .data(whichData[l-1])
            .enter()
            .append("text")
              .text((d, i) => {
                if (d) { 
                  return d;
                }
              })
              .attr("y", (d, i) => {
                return y(i) / 10 + 24;
              })
              .attr("x", (d, i) => {
                if(whichMaxStat) {
                  if (l === 2 || this.props.gamesToSee === 1) {
                    return (labelWidth - 58) - (d / whichMaxStat) * (labelWidth - 58) + 26;
                  }
                  return (d / whichMaxStat) * (labelWidth - 50) + 25;
                }
              })
              .attr("text-anchor", "middle")
              .attr("font-family", "sans-serif")
              .attr("font-size", "13px")
              .attr("fill", "black")
              .attr("id", "amount");

          // ADD LABELS TO Y-AXIS
          let allTheNames = whichSelData.append("g").attr("id", "nameStat" + l * this.props.gamesToSee);

          for (let textName = 0; textName < getName.length; textName++) {
            allTheNames.append("g")
              .attr("id", "splitChamp" + l + textName.toString())      
              .selectAll("text")
              .data([getName[textName]])
              .enter()
              .append("text")
                .text((d, i) => {
                  return d;
                })
                .attr("y", y(textName) / 10 + 26)
                .attr("x", () => {
                  if (l === 2 || this.props.gamesToSee === 1) {
                    return labelWidth - 50;
                  }
                  return 50;
                })
                .attr("text-anchor", () => {
                  if (l === 2 || this.props.gamesToSee === 1) {
                    return "left";
                  }
                  return "end";
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "13px")
                .attr("fill", "white")
                .attr("id", "whichChamp" + textName + l.toString());

            let wrapWord = Number(allTheNames.selectAll("#whichChamp" + textName + l.toString()).style("width").replace(/px/g,''));
            if (wrapWord > 52) {
              $("#splitChamp" + l + textName.toString()).remove();

              allTheNames.append("g")
                .attr("id", "splitChamp" + l + textName.toString())
                .selectAll("text")
                .data([getName[textName]])
                .enter()
                .append("text")
                  .text((d, i) => {
                    return d;
                  })
                  .attr("y", y(textName) / 10 + 26)
                  .attr("x", () => {
                    if (l === 2 || this.props.gamesToSee === 1) {
                      return labelWidth - 50;
                    }
                    return 50;
                  })
                  .attr("text-anchor", () => {
                    if (l === 2 || this.props.gamesToSee === 1) {
                      return "left";
                    }
                    return "end";
                  })
                  .attr("font-family", "sans-serif")
                  .attr("font-size", "10px")
                  .attr("fill", "white")
                  .attr("id", "whichChamp" + textName + l.toString());
            }
          }
        }
      }
    }
  }

  render() {
    let whichData = this.diff();
    if (!whichData) {
      return (
        <div id="chart">
        </div>
      )
    }

    let bar = this.redo(whichData);
    // GAME 1
    if (this.props.gamesToSee === 1) {
      return (
      	<div id={"chart" + 1 * this.props.gamesToSee}>
          {bar}
      	</div>
      )
    }

    // GAME 2
    if (this.props.gamesToSee === 2) {
      let ray = [1, 2];
      return (
        <div>
          { ray.map(l => {
              return (
                <div id={"chart" + l * this.props.gamesToSee} key={l}>
                  {bar}
                </div>
              )
            })
          }
        </div>
      )
    }
  }
}

module.exports = Chart;