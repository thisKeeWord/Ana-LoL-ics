import React from 'react';
import $ from 'jquery';

class Chart extends React.Component {

  diff() {
    // FIND SELECTION --> WARD PLACEMENT OR DELETIONS
    const eventSpecific = [];
    if (this.props.timeline.length) {
      const searchEvents = this.props.timeline;
      const eventChosen = this.props.eventSelected;

      for (let i = 0; i < this.props.playerInfo.length; i++) {
        let count = 0;
        if (eventChosen === 'WARD_PLACED' || eventChosen === 'WARD_KILL') {
          // if (searchEvents[this.props.spot][0].events) {
            for (let j = 0; j <= this.props.spot; j++) {
              if (searchEvents[j][0].events) {
                for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                  if (searchEvents[j][0].events[k].eventType === eventChosen && (searchEvents[j][0].events[k].creatorId === this.props.playerInfo[i][0] || searchEvents[j][0].events[k].killerId === this.props.playerInfo[i][0])) {
                    count++;
                  }
                }
              }
            }
          // }
        }
        if (eventChosen === 'killerId' || eventChosen === 'victimId' || eventChosen === 'assistingParticipantIds') {
          // if (searchEvents[this.props.spot][0].events) {
            for (let j = 0; j <= this.props.spot; j++) {
              if (searchEvents[j][0].events) {
                for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                  if (searchEvents[j][0].events[k].eventType === 'CHAMPION_KILL') {
                    if (eventChosen === 'killerId' || eventChosen === 'victimId') {
                      if (searchEvents[j][0].events[k][eventChosen] === this.props.playerInfo[i][0]) {
                        count++;
                      }
                    }
                    if (eventChosen === 'assistingParticipantIds' && searchEvents[j][0].events[k][eventChosen]) {
                      for (let assists = 0; assists < searchEvents[j][0].events[k][eventChosen].length; assists++) {
                        if (searchEvents[j][0].events[k][eventChosen][assists] === this.props.playerInfo[i][0]) {
                          count++;
                        }
                      }
                    }
                  }
                }
              }
            }
          // }
        }
        if (eventChosen === 'minionsKilled') {
          if (searchEvents[this.props.spot][0].participantFrames) {
            count = searchEvents[this.props.spot][0].participantFrames[i+1].minionsKilled + searchEvents[this.props.spot][0].participantFrames[i+1].jungleMinionsKilled
          }
        }
        if (eventChosen === 'totalGold') {
          if (searchEvents[this.props.spot][0].participantFrames) {
            count = searchEvents[this.props.spot][0].participantFrames[i+1].totalGold;
          }
        }
        eventSpecific.push(count);    
      }
      return [eventSpecific];
    } 
  }

  redo(whichData) {
    // GRAB CHAMP NAMES TO USE AS LABELS FOR CHART
    const getName = [];
    for (let name = 0; name < this.props.playerInfo.length; name++) {
      getName.push(this.props.champName[this.props.playerInfo[name][1]])
    }

    // BAR INFO AND DATA
    const w = 550, h = this.props.maxForStat, labelHeight = 400,
        x = d3.scale.linear()
              .domain([0, 1])
              .range([0, w]),
        y = d3.scale.linear()
              .domain([0, 1])
              .rangeRound([0, 375]),
        xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");
    
    // CHECK IF TEXT AND BAR EXISTS, THEN REMOVE
    if (document.getElementById("statInfo") && document.getElementById("infoStat")) {
      $("#statInfo").first().remove();
      $("#infoStat").first().remove();
    }

    // APPEND NEW BAR AND TEXT
    // BAR WAS UPSIDE DOWN
    if(this.props.selData) {
      // console.log(this.props.maxForStat)
      if (document.getElementById("infoStat")) {
        $("#infoStat").first().remove();
      }
      this.props.selData.append("g")
        .attr("id", "statInfo")
        .selectAll("rect")
        .data(whichData[0])
        .enter()
        .append("rect")
          .attr("x", (d, i) => {
            return x(i) / 10;
          })
          .attr("y", (d, i) => { 
            if(this.props.maxForStat) {
              return 370;
            }
          })
          .attr("width",  w / whichData[0].length - 2)
          .attr("height", (d, i) => {
            if(this.props.maxForStat) {
              // console.log((d / this.props.maxForStat * 370))
              return (d / this.props.maxForStat) * 370;
            }
          })
          .attr("y", (d, i) => {
            if(this.props.maxForStat) {
              return 370 - (d / this.props.maxForStat) * 370; // FLIP THE BAR TO LOAD UPWARD
            }
          })
          .attr("fill", d => {
            // return "rgb(173, 255, 47)";
            return "white";
          })
          .attr("id", "shape");

      // APPEND TEXT INSIDE BAR
      this.props.selData.append("g")
        .attr("id", "infoStat")
        .selectAll("text")
        .data(whichData[0])
        .enter()
        .append("text")
          .text((d, i) => {
            return d;
          })
          .attr("x", (d, i) => {
            return x(i) / 10 + 24;
          })
          .attr("y", (d, i) => {
            if(this.props.maxForStat) {
              return 370 - (d / this.props.maxForStat) * 370 + 10;
            }
          })
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "black")
          .attr("id", "amount");

      // ADD LABELS TO X-AXIS
      this.props.selData.append("g")
        .attr("id", "infoStat")
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
          .attr("id", "whichChamp");    
    }
  }

  render() {
    const whichData = this.diff();
    if (!whichData) {
      return (
        <div id="chart">
        </div>
      )
    }

    const bar = this.redo(whichData);
    return (
    	<div id="chart">
        {bar}
    	</div>
    )
  }
}

module.exports = Chart;