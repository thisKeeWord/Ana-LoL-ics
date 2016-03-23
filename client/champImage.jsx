import React from 'react';


class ChampImage extends React.Component {
  addChampImg() {
    // APPARENTLY NEEDED TO PROPERLY "SCALE" NEW ICONS FOR USE
    const domain = 
        {
          min: {x: -120, y: -120},
          max: {x: 14870, y: 14980}
        },

        // SCALING MAP DOWN
        width = 400,
        height = 400,

        xScale = d3.scale.linear()
          .domain([domain.min.x, domain.max.x])
          .range([0, width]),

        yScale = d3.scale.linear()
          .domain([domain.min.y, domain.max.y])
          .range([height, 0]);

    if(this.props.png1.length) {
      for (let count = 1; count <= this.props.gamesToSee; count++) {
        for (let w = 0; w < this.props["playerInfo" + count.toString()].length; w++) {
          const checking = this.props["playerInfo" + count.toString()][w];

          // REMOVE PREVIOUS ICONS      
          // USE SVG FROM STATE TO APPEND NEW ICONS
          // MAYBE DIDN'T HIT THE NEXT MINUTE TO LOG PLAYER POSITION
          // MOVED REMOVE METHOD TO IF STATEMENT TO NOT REMOVE IMAGE
          if (this.props["timeline" + count.toString()][this.props.spot]) {
            if (this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[w+1].position) {
              d3.select("#champIcon" + count * this.props.gamesToSee).remove();
              this.props["png" + count.toString()].append('svg:g').attr("id", "champIcon" + count * this.props.gamesToSee).selectAll("image")
                .data([[ this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[w+1].position.x, this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[w+1].position.y ]])
                .enter().append("svg:image")
                  .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.props["patch" + count.toString()] + '/img/champion/' + this.props["champImg" + count.toString()][this.props["playerInfo" + count.toString()][w][1]] + '.png')
                  .attr('x', d => { return xScale(d[0]) })
                  .attr('y', d => { return yScale(d[1]) })
                  .attr('class', 'image')
                  .style({ 'width': '17px', 'height': '17px' })
            }


              // USER MAY GO STRAIGHT TO LAST FRAME
            if (!this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[w+1].position && this.props["timeline" + count.toString()][this.props.spot-1][0].participantFrames[w+1].position) {
              d3.select("#champIcon" + count * this.props.gamesToSee).remove();
              this.props["png" + count.toString()].append('svg:g').attr("id", "champIcon" + count * this.props.gamesToSee).selectAll("image")
                .data([[ this.props["timeline" + count.toString()][this.props.spot-1][0].participantFrames[w+1].position.x, this.props["timeline" + count.toString()][this.props.spot-1][0].participantFrames[w+1].position.y ]])
                .enter().append("svg:image")
                  .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.props["patch" + count.toString()] + '/img/champion/' + this.props["champImg" + count.toString()][this.props["playerInfo" + count.toString()][w][1]] + '.png')
                  .attr('x', d => { return xScale(d[0]) })
                  .attr('y', d => { return yScale(d[1]) })
                  .attr('class', 'image')
                  .style({ 'width': '17px', 'height': '17px' });
            }
          }
        }
      }
    }
  }

  render() {
    const addChampImage = this.addChampImg();
    if (!addChampImage) {
      return (
        <div id="champImages" />
      )
    }

    return (
      <div id="champImages">
        {addChampImage}
      </div>
    )
  }
}

module.exports = ChampImage;