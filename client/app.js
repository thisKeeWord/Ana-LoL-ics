var React = require('react');
var ReactDOM = require('react-dom');
var request = require('request');
var champion = require('champion');
var $ = require('jquery');
var stuff = require('./../stuff.js');
var url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/';

var Display = React.createClass({

  // AFTER INITIAL RENDERING
  componentDidMount: function() {
    var that = this,
        playerID = [],
        allowScroll = [],
        pos = [],
        champImg = [],
        count = -1,
        
        // RIOT'S SETUP FOR FULL SIZE OF SR MAP
        domain = {
          min: {x: -120, y: -120},
          max: {x: 14870, y: 14980}
        },

        // SCALING MAP DOWN
        width = 512,
        height = 512,

        // NEWEST VERSION OF SUMMONER'S RIFT
        nSR = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-ig.png",

        // ADJUSTING COORDINATES TO FIT "MINIMAP" SIZE
        xScale, yScale, svg;

    // D3 METHODS AND SUCH
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
      .attr('xlink:href', nSR)
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', width)
      .attr('height', height);

    // FIRST REQUEST TO FILE
    $.get('http://localhost:3000/demoData.html', function(data) {
      var result = JSON.parse(data);

      // GOING FOR THE TIMELINE INFORMATION
      for (var j = 0; j < result.timeline.frames.length; j++) {
        for (var keys in result.timeline.frames[j]) {
          allowScroll.push(result.timeline.frames[j][keys]);
          // console.log(result.timeline.frames.length);
            // count++;
        }
      }
      // console.log(allowScroll[0], 'frames')

      // NUMBER OF PARTICIPANTS FOR A GAME
      for (var i = 0; i < result.participants.length; i++) {
        // console.log(result.participants[i].championId);
        var pId = result.participants[i].participantId;
        var cId = result.participants[i].championId;

        playerID.push([pId, cId]);
        // console.log(playerID)
        // console.log('j', playerID.length)

        $.get(url + pId + '?' + stuff.key, function(champData) {
          // console.log('champData', champData.key)

          // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
          $.get('http://ddragon.leagueoflegends.com/cdn/6.2.1/data/en_US/champion.json', function(res) {
          // console.log('player ID"s', playerID);
            for (var key in res["data"]) {
              if (key === champData.key) {
                count++;
              // console.log('yoyoyo')
              // console.log(res["data"][key].image.full, 'champion images coming')
              // console.log(that);
              // console.log(playerID)

                // for (var j = 0; j < playerID.length; j++) {
                // console.log('playerID', playerID[count][0], count)
                pos.push([ result.timeline.frames[0].participantFrames[playerID[count][0]].position.x, result.timeline.frames[0].participantFrames[playerID[count][0]].position.y ]);
                champImg.push(res["data"][key].image.full)
                // console.log(champImg, 'champImg')
              }
            }

            // RENDERING THE CHAMPION IMAGES TO CUSTOM-SIZED MAP
            svg.append('svg:g').selectAll("image")
              .data(pos.slice(pos.length - 1))
              .enter().append("svg:image")
                .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + champImg.slice(champImg.length - 1))
                .attr('x', function(d) { return xScale(d[0]) })
                .attr('y', function(d) { return yScale(d[1]) })
                .attr('class', 'image')
                .style({ 'width': '24px', 'height': '24px' })
          })
        })
      }
    })
  },

  render: function() {
    return (
      <div id="map" ref="map">
        
      </div>
    )
  }
})

ReactDOM.render(<Display />, document.getElementById('content'))
