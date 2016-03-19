import React from 'react';
import $ from 'jquery';

class Chart extends React.Component {

  diff() {
    // FIND SELECTION --> WARD PLACEMENT OR DELETIONS
    const eventSpecific1 = [];
    const eventSpecific2 = [];

    // GAME 1
    if (this.props.timeline1.length) {
      const searchEvents1 = this.props.timeline1;
      const eventChosen1 = this.props.eventSelected1;

      for (let i = 0; i < this.props.playerInfo1.length; i++) {
        let count1 = 0;
        if (eventChosen1 === 'WARD_PLACED' || eventChosen1 === 'WARD_KILL') {
          for (let j = 0; j <= this.props.spot; j++) {
            if (searchEvents1[j][0].events) {
              for (let k = 0; k < searchEvents1[j][0].events.length; k++) {
                if (searchEvents1[j][0].events[k].eventType === eventChosen1 && (searchEvents1[j][0].events[k].creatorId === this.props.playerInfo1[i][0] || searchEvents1[j][0].events[k].killerId === this.props.playerInfo1[i][0])) {
                  count1++;
                }
              }
            }
          }
        }
        if (eventChosen1 === 'killerId' || eventChosen1 === 'victimId' || eventChosen1 === 'assistingParticipantIds') {
          for (let j = 0; j <= this.props.spot; j++) {
            if (searchEvents1[j][0].events) {
              for (let k = 0; k < searchEvents1[j][0].events.length; k++) {
                if (searchEvents1[j][0].events[k].eventType === 'CHAMPION_KILL') {
                  if (eventChosen1 === 'killerId' || eventChosen1 === 'victimId') {
                    if (searchEvents1[j][0].events[k][eventChosen1] === this.props.playerInfo1[i][0]) {
                      count1++;
                    }
                  }
                  if (eventChosen1 === 'assistingParticipantIds' && searchEvents1[j][0].events[k][eventChosen1]) {
                    for (let assists = 0; assists < searchEvents1[j][0].events[k][eventChosen1].length; assists++) {
                      if (searchEvents1[j][0].events[k][eventChosen1][assists] === this.props.playerInfo1[i][0]) {
                        count1++;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (eventChosen1 === 'minionsKilled') {
          if (searchEvents1[this.props.spot][0].participantFrames) {
            count1 = searchEvents1[this.props.spot][0].participantFrames[i+1].minionsKilled + searchEvents1[this.props.spot][0].participantFrames[i+1].jungleMinionsKilled
          }
        }
        if (eventChosen1 === 'totalGold') {
          if (searchEvents1[this.props.spot][0].participantFrames) {
            count1 = searchEvents1[this.props.spot][0].participantFrames[i+1].totalGold;
          }
        }
        eventSpecific1.push(count1);    
      }
      return [eventSpecific1];
    }

    // GAME 2
    if (this.props.timeline2.length) {
      const searchEvents2 = this.props.timeline2;
      const eventChosen2 = this.props.eventSelected2;

      for (let i = 0; i < this.props.playerInfo2.length; i++) {
        let count2 = 0;
        if (eventChosen2 === 'WARD_PLACED' || eventChosen2 === 'WARD_KILL') {
          for (let j = 0; j <= this.props.spot; j++) {
            if (searchEvents2[j][0].events) {
              for (let k = 0; k < searchEvents2[j][0].events.length; k++) {
                if (searchEvents2[j][0].events[k].eventType === eventChosen2 && (searchEvents2[j][0].events[k].creatorId === this.props.playerInfo2[i][0] || searchEvents2[j][0].events[k].killerId === this.props.playerInfo2[i][0])) {
                  count2++;
                }
              }
            }
          }
        }
        if (eventChosen2 === 'killerId' || eventChosen2 === 'victimId' || eventChosen2 === 'assistingParticipantIds') {
          for (let j = 0; j <= this.props.spot; j++) {
            if (searchEvents2[j][0].events) {
              for (let k = 0; k < searchEvents2[j][0].events.length; k++) {
                if (searchEvents2[j][0].events[k].eventType === 'CHAMPION_KILL') {
                  if (eventChosen2 === 'killerId' || eventChosen2 === 'victimId') {
                    if (searchEvents2[j][0].events[k][eventChosen2] === this.props.playerInfo2[i][0]) {
                      count2++;
                    }
                  }
                  if (eventChosen2 === 'assistingParticipantIds' && searchEvents2[j][0].events[k][eventChosen2]) {
                    for (let assists = 0; assists < searchEvents2[j][0].events[k][eventChosen2].length; assists++) {
                      if (searchEvents2[j][0].events[k][eventChosen2][assists] === this.props.playerInfo2[i][0]) {
                        count2++;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (eventChosen2 === 'minionsKilled') {
          if (searchEvents2[this.props.spot][0].participantFrames) {
            count2 = searchEvents2[this.props.spot][0].participantFrames[i+1].minionsKilled + searchEvents2[this.props.spot][0].participantFrames[i+1].jungleMinionsKilled
          }
        }
        if (eventChosen2 === 'totalGold') {
          if (searchEvents2[this.props.spot][0].participantFrames) {
            count2 = searchEvents2[this.props.spot][0].participantFrames[i+1].totalGold;
          }
        }
        eventSpecific2.push(count2);    
      }
      return [eventSpecific2];
    } 
  }

  redo(whichData) {
    // GRAB CHAMP NAMES TO USE AS LABELS FOR CHART
    const getName1 = [];
    const getName2 = [];
    const w = 550, labelHeight = 400,
        x = d3.scale.linear()
              .domain([0, 1])
              .range([0, w]),
        y = d3.scale.linear()
              .domain([0, 1])
              .rangeRound([0, 375]),
        xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

    // GAME 1
    if (this.props.totalRenders === 1) {
      for (let name = 0; name < this.props.playerInfo1.length; name++) {
        getName1.push(this.props.champName1[this.props.playerInfo1[name][1]])
      }  
      
      // CHECK IF TEXT AND BAR EXISTS, THEN REMOVE
      if (document.getElementById("statInfo1") && document.getElementById("infoStat1")) {
        $("#statInfo1").first().remove();
        $("#infoStat1").first().remove();
      }

      // APPEND NEW BAR AND TEXT
      // BAR WAS UPSIDE DOWN
      if(this.props.selData1) {
        // console.log(this.props.maxForStat)
        if (document.getElementById("infoStat1")) {
          $("#infoStat1").first().remove();
        }
        this.props.selData1.append("g")
          .attr("id", "statInfo1")
          .selectAll("rect")
          .data(whichData[0])
          .enter()
          .append("rect")
            .attr("x", (d, i) => {
              return x(i) / 10;
            })
            .attr("y", (d, i) => { 
              if(this.props.maxForStat1) {
                return 370;
              }
            })
            .attr("width",  w / whichData[0].length - 2)
            .attr("height", (d, i) => {
              if(this.props.maxForStat1) {
                return (d / this.props.maxForStat1) * 370;
              }
            })
            .attr("y", (d, i) => {
              if(this.props.maxForStat1) {
                return 370 - (d / this.props.maxForStat1) * 370; // FLIP THE BAR TO LOAD UPWARD
              }
            })
            .attr("fill", d => {
              return "white";
            })
            .attr("id", "shape");

        // APPEND TEXT INSIDE BAR
        this.props.selData1.append("g")
          .attr("id", "infoStat1")
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
              if(this.props.maxForStat1) {
                return 370 - (d / this.props.maxForStat1) * 370 + 10;
              }
            })
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "black")
            .attr("id", "amount");

        // ADD LABELS TO X-AXIS
        this.props.selData1.append("g")
          .attr("id", "infoStat1")
          .selectAll("text")
          .data(getName1)
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
            .attr("id", "whichChamp1");    
      }
    }

    // GAME 2
    if (this.props.totalRenders === 2) {
      for (let name = 0; name < this.props.playerInfo2.length; name++) {
        getName2.push(this.props.champName2[this.props.playerInfo2[name][1]])
      }  
      
      // CHECK IF TEXT AND BAR EXISTS, THEN REMOVE
      if (document.getElementById("statInfo2") && document.getElementById("infoStat2")) {
        $("#statInfo2").first().remove();
        $("#infoStat2").first().remove();
      }

      // APPEND NEW BAR AND TEXT
      // BAR WAS UPSIDE DOWN
      if(this.props.selData2) {
        // console.log(this.props.maxForStat)
        if (document.getElementById("infoStat2")) {
          $("#infoStat2").first().remove();
        }
        this.props.selData2.append("g")
          .attr("id", "statInfo2")
          .selectAll("rect")
          .data(whichData[0])
          .enter()
          .append("rect")
            .attr("x", (d, i) => {
              return x(i) / 10;
            })
            .attr("y", (d, i) => { 
              if(this.props.maxForStat2) {
                return 370;
              }
            })
            .attr("width",  w / whichData[0].length - 2)
            .attr("height", (d, i) => {
              if(this.props.maxForStat2) {
                return (d / this.props.maxForStat2) * 370;
              }
            })
            .attr("y", (d, i) => {
              if(this.props.maxForStat2) {
                return 370 - (d / this.props.maxForStat2) * 370; // FLIP THE BAR TO LOAD UPWARD
              }
            })
            .attr("fill", d => {
              return "white";
            })
            .attr("id", "shape");

        // APPEND TEXT INSIDE BAR
        this.props.selData2.append("g")
          .attr("id", "infoStat2")
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
              if(this.props.maxForStat2) {
                return 370 - (d / this.props.maxForStat2) * 370 + 10;
              }
            })
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "black")
            .attr("id", "amount");

        // ADD LABELS TO X-AXIS
        this.props.selData1.append("g")
          .attr("id", "infoStat2")
          .selectAll("text")
          .data(getName2)
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
            .attr("id", "whichChamp2");    
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
    if (this.props.totalRenders === 1) {
      return (
      	<div id={"chart" + 1 * this.props.gamesToSee}>
          {bar}
      	</div>
      )
    }

    // GAME 2
    if (this.props.totalRenders === 2) {
      return (
        <div id={"chart" + 2 * this.props.gamesToSee}>
          {bar}
        </div>
      )
    }
  }
}

module.exports = Chart;