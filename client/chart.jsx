import React from 'react';
import $ from 'jquery';

class Chart extends React.Component {

  diff() {
    // FIND SELECTION --> WARD PLACEMENT OR DELETIONS
    let eventSpecific = [];
    if (this.props.timeline.length) {
      let searchEvents = this.props.timeline;

      for (let i = 0; i < this.props.playerInfo.length; i++) {
        let count = 0;
        if (this.props.eventSelected === 'WARD_PLACED' || this.props.eventSelected === 'WARD_KILL') {
          if (searchEvents[this.props.spot][0].events) {
            for (let j = 0; j <= this.props.spot; j++) {
              if (searchEvents[j][0].events) {
                for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                  if (searchEvents[j][0].events[k].eventType === this.props.eventSelected && (searchEvents[j][0].events[k].creatorId === this.props.playerInfo[i][0] || searchEvents[j][0].events[k].killerId === this.props.playerInfo[i][0])) {
                    count++;
                  }
                }
              }
            }
          }
        }
        if (this.props.eventSelected === 'minionsKilled') {
          if (searchEvents[this.props.spot][0].participantFrames) {
            count = searchEvents[this.props.spot][0].participantFrames[i+1].minionsKilled + searchEvents[this.props.spot][0].participantFrames[i+1].jungleMinionsKilled
          }
        }
        if (this.props.eventSelected === 'totalGold') {
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
    let getName = [];
    for (let name = 0; name < this.props.playerInfo.length; name++) {
      getName.push(this.props.champName[this.props.playerInfo[name][1]])
    }

    // BAR INFO AND DATA
    let w = 500, h = this.props.maxForStat, labelHeight = 400,
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
            return 370; 
          })
          .attr("width",  w / whichData[0].length - 2)
          .attr("height", (d, i) => {
            return (d / this.props.maxForStat) * 370;
          })
          .attr("y", (d, i) => {
            return 370 - (d / this.props.maxForStat) * 370; // FLIP THE BAR TO LOAD UPWARD
          })
          .attr("fill", d => {
            return "rgb(0, 0, 200)";
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
            return 370 - (d / this.props.maxForStat) * 370 + 10;
          })
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "white")
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
          .attr("fill", "black")
          .attr("id", "whichChamp");    
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
    return (
    	<div id="chart">
        {bar}
    	</div>
    )
  }
}

module.exports = Chart;