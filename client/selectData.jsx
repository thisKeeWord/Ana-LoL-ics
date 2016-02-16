import React from 'react';

class SelectData extends React.Component {
  // constructor() {
  //   super();

  //   this.state = {
  //     selData: 0
  //   }
  // }

  diff() {
    let eventSpecific = [];
    let count = 0;
    // console.log(that)
    if (this.props.timeline.length && this.props.timeline[this.props.spot][0].events) {
      let searchEvents = this.props.timeline;
      console.log('hello')
      for (let i = 0; i < this.props.spot; i++) {
        if (searchEvents[i][0].events) {
          for (let j = 0; j < searchEvents[i][0].events.length; j++) {
            if (searchEvents[i][0].events[j].eventType === 'WARD_PLACED' && searchEvents[i][0].events[j].creatorId === 9) {
              count++;
            }
          }
        }
      }
      console.log(count)
      return [count];
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

  redo(something) {
    // this.props.passStat(something);
    d3.select("rect").remove();
    d3.select("text").remove();

    this.props.selData.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        return i * (w / data.length);
      })
      .attr("y", d => {
        return h - d;  //Height minus data value
      })
      .attr("width",  w / data.length)
      .attr("height", d => {
        return d * 5;
      })
      .attr("fill", d => {
        return "rgb(0, 0, " + (d * 10) + ")";
      });

    this.props.selData.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => {
        return d;
      })
      .attr("x", (d, i) => {
        return i * (w / data.length) + 5;
      })
      .attr("y", d => {
        return h - (d * 4) + 14;
      })
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white");

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
    let something = this.diff();

    if (!something) {
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
    console.log(this.props.passStat)
    let bar = this.props.appendBar(something);
    console.log(bar, "bar")


    let newBar = this.redo(something);
    console.log(this.props.appendBar)
    return (
    	<div id="YO">
        {bar}
    	</div>
    )
  }
}

module.exports = SelectData;