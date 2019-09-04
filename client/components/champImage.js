import React from "react";
import * as d3 from "d3";

class ChampImage extends React.Component {
  addChampImg() {
    // APPARENTLY NEEDED TO PROPERLY "SCALE" NEW ICONS FOR USE
    const domain = {
      min: { x: -120, y: -120 },
      max: { x: 14870, y: 14980 },
    };

    // SCALING MAP DOWN
    let width = 468,
      height = 468;

    if (this.props.gamesToSee === 1) {
      width = 500;
      height = 500;
    }

    const xScale = d3
      .scaleLinear()
      .domain([domain.min.x, domain.max.x])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([domain.min.y, domain.max.y])
      .range([height, 0]);

    if (
      (this.props.png1 && this.props.gamesToSee === 1) ||
      (this.props.png2 && this.props.gamesToSee === 2)
    ) {
      let whichGameBorder = "";
      for (let count = 1; count <= this.props.gamesToSee; count++) {
        if (count === 2) {
          whichGameBorder = "0";
        }
        let colorOfTeam = "blue";

        // BLUE OR PURPLE SIDE

        for (let w = 0; w < this.props["playerInfo" + count.toString()].length; w++) {
          if (w > 4) {
            colorOfTeam = "purple";
          }
          const checking = this.props["playerInfo" + count.toString()][w];

          // REMOVE PREVIOUS ICONS
          // USE SVG FROM STATE TO APPEND NEW ICONS
          // MAYBE DIDN'T HIT THE NEXT MINUTE TO LOG PLAYER POSITION
          // MOVED REMOVE METHOD TO IF STATEMENT TO NOT REMOVE IMAGE
          d3.select("#champIcon" + count * this.props.gamesToSee).remove();
          d3.select("#whichTeam" + colorOfTeam + w + whichGameBorder).remove();

          if (this.props["timeline" + count.toString()][this.props.spot]) {
            if (
              this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[w + 1]
                .position
            ) {
              this.props["png" + count.toString()]
                .append("svg:g")
                .attr("id", "champIcon" + count * this.props.gamesToSee)
                .selectAll("image")
                .data([
                  [
                    this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[
                      w + 1
                    ].position.x,
                    this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[
                      w + 1
                    ].position.y,
                  ],
                ])
                .enter()
                .append("image")
                .attr(
                  "xlink:href",
                  "http://ddragon.leagueoflegends.com/cdn/" +
                    this.props["patch" + count.toString()] +
                    "/img/champion/" +
                    this.props["champImg" + count.toString()][
                      this.props["playerInfo" + count.toString()][w][1]
                    ] +
                    ".png"
                )
                .attr("x", (d) => {
                  return xScale(d[0]);
                })
                .attr("y", (d) => {
                  return yScale(d[1]);
                })
                .attr("class", "image")
                .style({ width: "24px", height: "24px" });

              this.props["png" + count.toString()]
                .append("svg:g")
                .attr("id", "whichTeam" + colorOfTeam + w + whichGameBorder)
                .selectAll("rect")
                .data([
                  [
                    this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[
                      w + 1
                    ].position.x,
                    this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[
                      w + 1
                    ].position.y,
                  ],
                ])
                .enter()
                .append("rect")
                .attr("x", (d) => {
                  return xScale(d[0]);
                })
                .attr("y", (d) => {
                  return yScale(d[1]);
                })
                .style({ "stroke-width": 2, stroke: colorOfTeam.toString() })
                .attr("height", 23)
                .attr("width", 23)
                .attr("fill", "transparent");
            }

            // USER MAY GO STRAIGHT TO LAST FRAME
            if (
              !this.props["timeline" + count.toString()][this.props.spot][0].participantFrames[
                w + 1
              ].position &&
              this.props["timeline" + count.toString()][this.props.spot - 1][0].participantFrames[
                w + 1
              ].position
            ) {
              this.props["png" + count.toString()]
                .append("svg:g")
                .attr("id", "champIcon" + count * this.props.gamesToSee)
                .selectAll("image")
                .data([
                  [
                    this.props["timeline" + count.toString()][this.props.spot - 1][0]
                      .participantFrames[w + 1].position.x,
                    this.props["timeline" + count.toString()][this.props.spot - 1][0]
                      .participantFrames[w + 1].position.y,
                  ],
                ])
                .enter()
                .append("image")
                .attr(
                  "xlink:href",
                  "http://ddragon.leagueoflegends.com/cdn/" +
                    this.props["patch" + count.toString()] +
                    "/img/champion/" +
                    this.props["champImg" + count.toString()][
                      this.props["playerInfo" + count.toString()][w][1]
                    ] +
                    ".png"
                )
                .attr("x", (d) => {
                  return xScale(d[0]);
                })
                .attr("y", (d) => {
                  return yScale(d[1]);
                })
                .attr("class", "image")
                .style({ width: "24px", height: "24px" });

              this.props["png" + count.toString()]
                .append("svg:g")
                .attr("id", "whichTeam" + colorOfTeam + w + whichGameBorder)
                .selectAll("rect")
                .data([
                  [
                    this.props["timeline" + count.toString()][this.props.spot - 1][0]
                      .participantFrames[w + 1].position.x,
                    this.props["timeline" + count.toString()][this.props.spot - 1][0]
                      .participantFrames[w + 1].position.y,
                  ],
                ])
                .enter()
                .append("rect")
                .attr("x", (d) => {
                  return xScale(d[0]);
                })
                .attr("y", (d) => {
                  return yScale(d[1]);
                })
                .style({ "stroke-width": 2, stroke: colorOfTeam.toString() })
                .attr("height", 23)
                .attr("width", 23)
                .attr("fill", "transparent");
            }
          } else {
            if (
              this.props["timeline" + count.toString()][
                this.props["timeline" + count.toString()].length - 1
              ][0].participantFrames[w + 1].position
            ) {
              this.props["png" + count.toString()]
                .append("svg:g")
                .attr("id", "champIcon" + count * this.props.gamesToSee)
                .selectAll("image")
                .data([
                  [
                    this.props["timeline" + count.toString()][
                      this.props["timeline" + count.toString()].length - 1
                    ][0].participantFrames[w + 1].position.x,
                    this.props["timeline" + count.toString()][
                      this.props["timeline" + count.toString()].length - 1
                    ][0].participantFrames[w + 1].position.y,
                  ],
                ])
                .enter()
                .append("image")
                .attr(
                  "xlink:href",
                  "http://ddragon.leagueoflegends.com/cdn/" +
                    this.props["patch" + count.toString()] +
                    "/img/champion/" +
                    this.props["champImg" + count.toString()][
                      this.props["playerInfo" + count.toString()][w][1]
                    ] +
                    ".png"
                )
                .attr("x", (d) => {
                  return xScale(d[0]);
                })
                .attr("y", (d) => {
                  return yScale(d[1]);
                })
                .attr("class", "image")
                .style({ width: "24px", height: "24px" });

              this.props["png" + count.toString()]
                .append("svg:g")
                .attr("id", "whichTeam" + colorOfTeam + w + whichGameBorder)
                .selectAll("rect")
                .data([
                  [
                    this.props["timeline" + count.toString()][
                      this.props["timeline" + count.toString()].length - 1
                    ][0].participantFrames[w + 1].position.x,
                    this.props["timeline" + count.toString()][
                      this.props["timeline" + count.toString()].length - 1
                    ][0].participantFrames[w + 1].position.y,
                  ],
                ])
                .enter()
                .append("rect")
                .attr("x", (d) => {
                  return xScale(d[0]);
                })
                .attr("y", (d) => {
                  return yScale(d[1]);
                })
                .style({ "stroke-width": 2, stroke: colorOfTeam.toString() })
                .attr("height", 23)
                .attr("width", 23)
                .attr("fill", "transparent");
            }

            // USER MAY GO STRAIGHT TO LAST FRAME
            if (
              !this.props["timeline" + count.toString()][
                this.props["timeline" + count.toString()].length - 1
              ][0].participantFrames[w + 1].position &&
              this.props["timeline" + count.toString()][
                this.props["timeline" + count.toString()].length - 1 - 1
              ][0].participantFrames[w + 1].position
            ) {
              this.props["png" + count.toString()]
                .append("svg:g")
                .attr("id", "champIcon" + count * this.props.gamesToSee)
                .selectAll("image")
                .data([
                  [
                    this.props["timeline" + count.toString()][
                      this.props["timeline" + count.toString()].length - 1 - 1
                    ][0].participantFrames[w + 1].position.x,
                    this.props["timeline" + count.toString()][
                      this.props["timeline" + count.toString()].length - 1 - 1
                    ][0].participantFrames[w + 1].position.y,
                  ],
                ])
                .enter()
                .append("image")
                .attr(
                  "xlink:href",
                  "http://ddragon.leagueoflegends.com/cdn/" +
                    this.props["patch" + count.toString()] +
                    "/img/champion/" +
                    this.props["champImg" + count.toString()][
                      this.props["playerInfo" + count.toString()][w][1]
                    ] +
                    ".png"
                )
                .attr("x", (d) => {
                  return xScale(d[0]);
                })
                .attr("y", (d) => {
                  return yScale(d[1]);
                })
                .attr("class", "image")
                .style({ width: "24px", height: "24px" });

              this.props["png" + count.toString()]
                .append("svg:g")
                .attr("id", "whichTeam" + colorOfTeam + w + whichGameBorder)
                .selectAll("rect")
                .data([
                  [
                    this.props["timeline" + count.toString()][
                      this.props["timeline" + count.toString()].length - 1 - 1
                    ][0].participantFrames[w + 1].position.x,
                    this.props["timeline" + count.toString()][
                      this.props["timeline" + count.toString()].length - 1 - 1
                    ][0].participantFrames[w + 1].position.y,
                  ],
                ])
                .enter()
                .append("rect")
                .attr("x", (d) => {
                  return xScale(d[0]);
                })
                .attr("y", (d) => {
                  return yScale(d[1]);
                })
                .style({ "stroke-width": 2, stroke: colorOfTeam.toString() })
                .attr("height", 23)
                .attr("width", 23)
                .attr("fill", "transparent");
            }
          }
        }
      }
    }
  }

  render() {
    const addChampImage = this.addChampImg();
    if (!addChampImage) {
      return <div id="champImages" />;
    }

    return <div id="champImages">{addChampImage}</div>;
  }
}

module.exports = ChampImage;
