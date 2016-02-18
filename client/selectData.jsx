import React from 'react';
import $ from 'jquery';

class SelectData extends React.Component {

  diff() {
    let eventSpecific = [];
    let wardCount = [];
    
    if (this.props.timeline.length && this.props.timeline[this.props.spot][0].events) {
      let count = 0;
      let searchEvents = this.props.timeline;

      for (let i = 0; i <= this.props.spot; i++) {
        if (searchEvents[i][0].events) {
          for (let j = 0; j < searchEvents[i][0].events.length; j++) {
            if (searchEvents[i][0].events[j].eventType === 'WARD_PLACED' && searchEvents[i][0].events[j].creatorId === 9) {
              count++;
            }
          }
        }
        wardCount.push([count])
      }
      return wardCount;
    } 
  }

  redo(whichData) {
    let w = 500, h = 100,
        x = d3.scale.linear()
              .domain([0, 1])
              .range([0, w]),
        y = d3.scale.linear()
              .domain([0, 600])
              .rangeRound([0, h]);

    if (!document.getElementById("allStat")) {
      this.props.passStat(whichData);
    }
    
    // CHECK IF TEXT AND BAR EXISTS, THEN REMOVE
    if (document.getElementById("statInfo") && document.getElementById("infoStat")) {
      $("#statInfo").first().remove();
      $("#infoStat").first().remove();
    }

    // APPEND NEW BAR AND TEXT
    // BAR WAS UPSIDE DOWN
    if(this.props.selData) {
      let specificLength = whichData[this.props.spot].length;
      let specificData = whichData[this.props.spot];

      this.props.selData.append("g")
        .attr("id", "statInfo")
        .selectAll("rect")
        .data(specificData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
          return x(i);
        })
        .attr("y", d => { 
          return h * 5; 
        })
        .attr("width",  w / specificLength)
        .attr("height", d => {
          return d * 5;
        })
        .attr("y", d => { 
          return h - d * 5; // FLIP THE BAR TO LOAD UPWARD
        })
        .attr("fill", d => {
          return "rgb(0, 0, " + ((h-d) * 10) + ")";
        });

      // APPEND TEXT INSIDE BAR
      this.props.selData.append("g")
        .attr("id", "infoStat")
        .selectAll("text")
        .data(specificData)
        .enter()
        .append("text")
        .text(d => {
          return d;
        })
        .attr("x", (d, i) => {
          // return i * (w / specificLength) + 5;
          return w/2;
        })
        .attr("y", d => {
          return h - (d * 5) + 20;
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
    }
  }

  render() {
    let whichData = this.diff();
    if (!whichData) {
      return (
        <div id="YOUTROLL">
        </div>
      )
    }

    let bar = this.redo(whichData);
    return (
    	<div id="YO">
        {bar}
    	</div>
    )
  }
}

module.exports = SelectData;