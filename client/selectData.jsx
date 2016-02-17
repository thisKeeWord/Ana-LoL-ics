import React from 'react';
import $ from 'jquery';

class SelectData extends React.Component {
  // constructor() {
  //   super();

  //   this.state = {
  //     selData: 0
  //   }
  // }

  diff() {
    // debugger;
    let eventSpecific = [];
    let wardCount = [];
    
    // console.log(that)
    if (this.props.timeline.length && this.props.timeline[this.props.spot][0].events) {
      let count = 0;
      let searchEvents = this.props.timeline;
      console.log('hello')
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
      console.log(count)
      return wardCount;
    }
    
    
  }
  // appendBar(data) {
  //   console.log('somesing wong')
  //   let w = 500, h = 100;
  //   d3.select("svg").remove();
  //   let svg = d3.select("#YO")
  //               .append("svg")
  //               .attr("width", w)
  //               .attr("height", h);

  //   svg.selectAll("rect")
  //     .data(data)
  //     .enter()
  //     .append("rect")
  //     .attr("x", (d, i) => {
  //       return i * (w / data.length);
  //     })
  //     .attr("y", d => {
  //       return h - d;  //Height minus data value
  //     })
  //     .attr("width",  w / data.length)
  //     .attr("height", d => {
  //       return d * 5;
  //     })
  //     .attr("fill", d => {
  //       return "rgb(0, 0, " + (d * 10) + ")";
  //     });

  //   svg.selectAll("text")
  //     .data(data)
  //     .enter()
  //     .append("text")
  //     .text(d => {
  //       return d;
  //     })
  //     .attr("x", (d, i) => {
  //       return i * (w / data.length) + 5;
  //     })
  //     .attr("y", d => {
  //       return h - (d * 4) + 14;
  //     })
  //     .attr("text-anchor", "middle")
  //     .attr("font-family", "sans-serif")
  //     .attr("font-size", "11px")
  //     .attr("fill", "white");
  //   this.setState({
  //     selData: svg
  //   })
  //   console.log('this.state.selData')
  // }

  // componentDidMount() {
  //   console.log('this.props', this.props.selData)
  // }

  redo(whichData) {
    let w = 500, h = 100;
    // console.log(d3.select("addStat" + this.props.increment))
    // console.log(this.props)
    // var that = this;

    
    // removePrevIncrement++;
    // }
    // console.log(d3.select("allStat"))
    // console.log(document.getElementById("allStat"))
    if (!document.getElementById("allStat")) {
      // console.log('ggNOTez')
      this.props.passStat(whichData);
      // console.log(d3.select("g.allStat"))
    }
    

    // if (d3.select("statInfo") || d3.select("statInfo").text === '') {
      if (document.getElementById("statInfo") && document.getElementById("infoStat")) {
      $("svg#statInfo").first().remove();
      $("svg#infoStat").first().remove();

    }
    // if (d3.select("use" + this.props.increment + 1).text === '') {
    //   d3.select("use").empty();
    // }
    
    // console.log(this.props.increment)
    // console.log(this.props.passStat(whichData))
    if(this.props.selData) {
      // debugger;
      // console.log('helloworld')
      let specificLength = whichData[this.props.spot].length;
      let specificData = whichData[this.props.spot];
      this.props.selData.append("svg")
        .attr("id", "statInfo")
        .selectAll("rect")
        .data(specificData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
          return i * (w / specificLength);
        })
        .attr("y", d => {
          return h - d;  //Height minus data value
        })
        .attr("width",  w / specificLength)
        .attr("height", d => {
          return d * 5;
        })
        .attr("fill", d => {
          return "rgb(0, 0, " + (d * 10) + ")";
        });

      this.props.selData.append("svg")
        .attr("id", "infoStat")
        .selectAll("text")
        .data(specificData)
        .enter()
        .append("text")
        .text(d => {
          return d;
        })
        .attr("x", (d, i) => {
          return i * (w / specificLength) + 5;
        })
        .attr("y", d => {
          return h - (d * 4) + 14;
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
    }
  }
    
  // handle(event) {
  //   event.preventDefault();
  //   let that = this;
  //   console.log(that)
  //   console.log(event.target.value)
  //   // console.log(this)
  //   // that.setState({
  //   //   selectValue: event.target.value
  //   // },
  //     that.__proto__.diff(this.props.spot)
  //   // )
  // }

  render() {
    // console.log(this)
    // debugger;
    let whichData = this.diff();

    if (!whichData) {
      return (
        <div id="YOUTROLL">
        </div>
      )
    }

    // let that = this;
    // console.log(this.props.timeline, 'selectData');
    // console.log(this.props.spot, 'selectData');
    // console.log(this.props.playerInfo, 'selectData');
    
    // <select defaultValue='stats' onChange={that.handle.bind(that)} id="yo" >
    //       <option value='WARDS_PLACED'>wards</option>
    //       <option value='stats'>Are</option>
    //       <option value='A'>A</option>
    //       <option value='Fruit'>Fruit</option>
    //     </select>
    // console.log(this.props.passStat)
    // if (!d3.select("#YO")[0].length) {
    //   let bar = this.appendBar(whichData);

    // }

    let bar = this.redo(whichData);
    // console.log(this.appendBar)
    return (
    	<div id="YO">
        {bar}
    	</div>
    )
  }
}

module.exports = SelectData;