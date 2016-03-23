import React from 'react';
import $ from 'jquery';

class Chart extends React.Component {

  diff() {
    // FIND SELECTION --> WARD PLACEMENT OR DELETIONS
    const allEvents = [];

    if ((this.props.timeline1 && this.props.gamesToSee === 1) || (this.props.timeline2 && this.props.gamesToSee === 2)) {
      for (let i = 1; i <= this.props.gamesToSee; i++) {
        let eventSpecific = [];
        let searchEvents = this.props.timeline1;
        let eventChosen = this.props.eventSelected1;

        for (let i = 0; i < this.props.playerInfo1.length; i++) {
          let count = 0;
          if (eventChosen === 'WARD_PLACED' || eventChosen === 'WARD_KILL') {
            for (let j = 0; j <= this.props.spot; j++) {
              if (searchEvents[j]) {
                if (searchEvents[j][0].events) {
                  for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                    if (searchEvents[j][0].events[k].eventType === eventChosen && (searchEvents[j][0].events[k].creatorId === this.props.playerInfo1[i][0] || searchEvents[j][0].events[k].killerId === this.props.playerInfo1[i][0])) {
                      count++;
                    }
                  }
                }
              }
            }
          }
          if (eventChosen === 'killerId' || eventChosen === 'victimId' || eventChosen === 'assistingParticipantIds') {
            for (let j = 0; j <= this.props.spot; j++) {
              if (searchEvents[j]) {
                if (searchEvents[j][0].events) {
                  for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                    if (searchEvents[j][0].events[k].eventType === 'CHAMPION_KILL') {
                      if (eventChosen === 'killerId' || eventChosen === 'victimId') {
                        if (searchEvents[j][0].events[k][eventChosen] === this.props.playerInfo1[i][0]) {
                          count++;
                        }
                      }
                      if (eventChosen === 'assistingParticipantIds' && searchEvents[j][0].events[k][eventChosen]) {
                        for (let assists = 0; assists < searchEvents[j][0].events[k][eventChosen].length; assists++) {
                          if (searchEvents[j][0].events[k][eventChosen][assists] === this.props.playerInfo1[i][0]) {
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
          }
          if (eventChosen === 'totalGold') {
            if (searchEvents[this.props.spot]) {
              if (searchEvents[this.props.spot][0].participantFrames) {
                count = searchEvents[this.props.spot][0].participantFrames[i+1].totalGold;
              }
            }
          }
          eventSpecific.push(count);    
        }
        allEvents.push(eventSpecific);
      }
    console.log(allEvents, 'allEvents')
    return allEvents;
    }
  }

  redo(whichData) {
    // GRAB CHAMP NAMES TO USE AS LABELS FOR CHART
    const w = 550, 
          labelHeight = 300, 
          x = d3.scale.linear()
                .domain([0, 1])
                .range([0, w]),
          y = d3.scale.linear()
                .domain([0, 1])
                .rangeRound([0, 375]),
          xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

    // GAMES

    for (let i = 1; i <= this.props.gamesToSee; i++) {
      let getName = [];
      let h = this.props["maxForStat" + i.toString()];
      if (this.props["selData" + i.toString()]) {
        for (let name = 0; name < this.props["playerInfo" + i.toString()].length; name++) {
          getName.push(this.props["champName" + i.toString()][this.props["playerInfo" + i.toString()][name][1]])
        } 

        // CHECK IF TEXT AND BAR EXISTS, THEN REMOVE
        if (document.getElementById("statInfo" + i) && document.getElementById("infoStat" + i)) {
          $("#statInfo" + i).first().remove();
          $("#infoStat" + i).first().remove();
        }

        // APPEND NEW BAR AND TEXT
        // BAR WAS UPSIDE DOWN
        if(this.props["selData" + i.toString()]) {
          if (document.getElementById("infoStat" + i)) {
            $("#infoStat" + i).first().remove();
          }
          this.props["selData" + i.toString()].append("g")
            .attr("id", "statInfo" + i)
            .selectAll("rect")
            .data(whichData[i-1])
            .enter()
            .append("rect")
              .attr("x", (d, i) => {
                return x(i) / 10;
              })
              .attr("y", (d, i) => { 
                if(this.props["maxForStat" + i.toString()]) {
                  return 270;
                }
              })
              .attr("width",  w / whichData[0].length - 2)
              .attr("height", (d, i) => {
                if(this.props["maxForStat" + i.toString()]) {
                  return (d / this.props["maxForStat" + i.toString()]) * 270;
                }
              })
              .attr("y", (d, i) => {
                if(this.props["maxForStat" + i.toString()]) {
                  return 270 - (d / this.props["maxForStat" + i.toString()]) * 270; // FLIP THE BAR TO LOAD UPWARD
                }
              })
              .attr("fill", d => {
                return "white";
              })
              .attr("id", "shape");

          // APPEND TEXT INSIDE BAR
          this.props["selData" + i.toString()].append("g")
            .attr("id", "infoStat" + i)
            .selectAll("text")
            .data(whichData[i-1])
            .enter()
            .append("text")
              .text((d, i) => {
                return d;
              })
              .attr("x", (d, i) => {
                return x(i) / 10 + 24;
              })
              .attr("y", (d, i) => {
                if(this.props["maxForStat" + i.toString()]) {
                  return 270 - (d / this.props["maxForStat" + i.toString()]) * 270 + 10;
                }
              })
              .attr("text-anchor", "middle")
              .attr("font-family", "sans-serif")
              .attr("font-size", "11px")
              .attr("fill", "black")
              .attr("id", "amount");

          // ADD LABELS TO X-AXIS
          this.props["selData" + i.toString()].append("g")
            .attr("id", "infoStat1")
            .selectAll("text")
            .data(getName)
            .enter()
            .append("text")
              .text((d, i) => {
                return d;
              })
              .attr("x", (d, i) => {
                return x(i) / 10 + 24;
              })
              .attr("y", (d, i) => {
                return labelHeight - 10;
              })
              .attr("text-anchor", "middle")
              .attr("font-family", "sans-serif")
              .attr("font-size", "11px")
              .attr("fill", "white")
              .attr("id", "whichChamp" + i);
      
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
          { ray.map(i => {
              return (
                <div id={"chart" + i * this.props.gamesToSee}>
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