var React = require('react');
var ReactDOM = require('react-dom');
var request = require('request');
var champion = require('champion');
var $ = require('jquery');
var stuff = require('./../stuff.js');
var url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/';

var Display = React.createClass({
  // componentDidMount: function() {
  //   var that = this;
  //   var playerID = [];
  //   var allowScroll = [];
  //   var count = -1;
  //   $.get('http://localhost:3000/demoData.html', function(data) {
  //     var result = JSON.parse(data);
  //     for (var j = 0; j < result.timeline.frames.length; j++) {
  //       for (var keys in result.timeline.frames[j]) {
  //         allowScroll.push(result.timeline.frames[j][keys]);
  //         // console.log(result.timeline.frames.length);
  //           // count++;
  //       }
  //     }
  //     // console.log(allowScroll[0], 'frames')

  //     for (var i = 0; i < result.participants.length; i++) {
  //       // console.log(result.participants[i].championId);
  //       var pId = result.participants[i].participantId;
  //       var cId = result.participants[i].championId;

  //       playerID.push([pId, cId]);
  //       // console.log(playerID)
  //       console.log('j', playerID.length)

  //       $.get(url + pId + '?' + stuff.key, function(champData) {
  //         // console.log('champData', champData.key)
  //         $.get('http://ddragon.leagueoflegends.com/cdn/6.2.1/data/en_US/champion.json', function(res) {
  //           // console.log('player ID"s', playerID);
  //           for (var key in res["data"]) {
  //               if (key === champData.key) {
  //                 count++;
  //               // console.log('yoyoyo')
  //               // console.log(res["data"][key].image.full, 'champion images coming')
  //               // console.log(that);
  //               // console.log(playerID)

  //                 // for (var j = 0; j < playerID.length; j++) {
  //                   console.log('playerID', playerID)
  //                 // for (var keys in result.timeline.frames[0].participantFrames[playerID[playerID.length - 1][0]]) {
  //                   console.log(result.timeline.frames[0].participantFrames[playerID[count][0]], 'concerns');

  //                   var ctx = React.findDOMNode(that.refs.map).getContext("2d");
  //                   // console.log('ctx', ctx)
  //                   var img = document.createElement('img');
  //                   img.src = "http://ddragon.leagueoflegends.com/cdn/4.6.3/img/champion/" + res["data"][key].image.full;
  //                   img.addEventListener('load', function() {
  //                     // console.log(ctx, 'image drawn')
  //                     // x += 4;
  //                     // y += 4; 
                      
  //                     console.log('length result', 15 + result.timeline.frames[2].participantFrames[playerID[count][0]].position.x / 16000, 8.5* (15 + result.timeline.frames[2].participantFrames[playerID[count][0]].position.y / 16000));
  //                     // return ctx.drawImage(img, 17.952, 18.592, 15, 15);
  //                     return ctx.drawImage(img, 452.736 / 5, 460.832 / 5, 15, 15);
  //                     // return ctx.drawImage(img, 20, 130, 15, 15);
  //                   })
  //                 // }
  //               }
  //             }
  //           // }
  //         })
  //       })
  //     }
  //   })
  //   // .then(function() { console.log(playerID); })
    
  // },
  componentDidMount: function() {
    var cords = [
        [14486, 14291]
    ],
    // Domain for the current Summoner's Rift on the in-game mini-map
    domain = {
            min: {x: -120, y: -120},
            max: {x: 14870, y: 14980}
    },
    width = 512,
    height = 512,
    bg = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-ig.png",
    xScale, yScale, svg;

color = d3.scale.linear()
    .domain([0, 3])
    .range(["white", "steelblue"])
    .interpolate(d3.interpolateLab);

xScale = d3.scale.linear()
  .domain([domain.min.x, domain.max.x])
  .range([0, width]);

yScale = d3.scale.linear()
  .domain([domain.min.y, domain.max.y])
  .range([height, 0]);

svg = d3.select("#map").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

svg.append('image')
    .attr('xlink:href', bg)
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', width)
    .attr('height', height);

svg.append('svg:g').selectAll("circle")
    .data(cords)
    .enter().append("svg:circle")
        .attr('cx', function(d) { return xScale(d[0]) })
        .attr('cy', function(d) { return yScale(d[1]) })
        .attr('r', 5)
        .attr('class', 'kills');
  },

  render: function() {
    // var champImg = (<canvas id="map" ref="map"/>)

    var champImg = (<div id="map" ref="map"/>)

    // console.log(champImg)
    return (
      <div className="stats">
        {champImg}
      </div>
    )
  }
})

ReactDOM.render(<Display />, document.getElementById('content'))
