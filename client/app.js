var React = require('react');
var ReactDOM = require('react-dom');
var request = require('request');
var champion = require('champion');
var $ = require('jquery');
var async = require('async');
var TimeStamp = require('./timeStamp');
var stuff = require('./../stuff.js');
var url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/';


var Display = React.createClass({
  getInitialState: function() {
    return ({
      scrollBar: '',
      playerID: [],
      pos: [],
      champImg: {},
      allowScroll: [],
      result: {},
      png: [],
      num: 0
    })
  },

  // AFTER INITIAL RENDERING
  componentWillMount: function() {

    var that = this,
        count = -1,
        total = 0;
        
      

    // $.get(url + '?dataById=true&' + stuff.key, function(res) {

      // FIRST REQUEST TO FILE
    $.get('http://localhost:3000/demoData.html', function(data) {
      var info = JSON.parse(data);
      console.log('result', info.timeline.frames.length)

      // GOING FOR THE TIMELINE INFORMATION
      for (var j = 0; j < info.timeline.frames.length; j++) {
        that.state.allowScroll.push([info.timeline.frames[j]]);
      }

      // console.log(that.state.allowScroll[15][0].participantFrames[11].position.x);
      console.log('frames', that.state.allowScroll)

      // HAVE TO USE NUMBER FOR NUMERATOR SINCE SCROLL NOT UP YET
      var stepScroll = 300 / that.state.allowScroll.length;
      

      // NUMBER OF PARTICIPANTS FOR A GAME: ASYNC, BUT PARALLEL
      async.each(info.participants, function(i, next) {
        // console.log(info.participants[i].championId);
        // console.log(i.participantId, 'i')
        var pId = i.participantId;
        var cId = i.championId;

        that.state.playerID.push([pId, cId]);
        // console.log(playerID, "playerID");
        // console.log('j', playerID.length)
        // console.log('what???', url + cId + '?' + stuff.key);

        // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
        $.get(url + cId + '?' + stuff.key, function(champData) {
          // console.log('champData', champData.key)
          var stuffs = champData.key;
          count++;
          that.state.champImg[cId] = champData.key;
          // console.log('champImg wt key', champImg)
        // console.log(res["data"][key].image.full, 'champion images coming')
        // console.log(playerID)

          that.state.pos.push([ info.timeline.frames[0].participantFrames[that.state.playerID[count][0]].position.x, info.timeline.frames[0].participantFrames[that.state.playerID[count][0]].position.y ]);
          // console.log('state.pos', that.state.pos)
          // console.log(res.data[champData.key].image.full, 'champ')
          // console.log(champImg, 'champImg')
       

          // RENDERING THE CHAMPION IMAGES TO CUSTOM-SIZED MAP
          if (champData[that.state.playerID[total][1].key] !== null && Object.keys(that.state.champImg).length === 10) {
            console.log(that.state.champImg, 'almost!!!')
            var rand;
            // console.log('ID', champImg[playerID[total][1]])
            // console.log(pos.slice(pos.length - 1))
            that.setState({ 
              pos: that.state.pos,
              champImg: that.state.champImg,
              playerID: that.state.playerID,
              allowScroll: that.state.allowScroll,
              result: info,
              scrollBar: (<input id="scroll" type='range' style={{ width: '300px'}} min='0' max={that.state.allowScroll.length - 1} step='1' defaultValue='0' onChange={that.onChange}></input>)

            }, 
              that.move()
            );
          }
        })
      })
    })
  },

  move: function() {
    var self = this,

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
          .attr("height", height)
          .attr('x', '0')
          .attr('y', '0');

        // APPEND BACKGROUND IMAGE TO SVG
        svg.append('image')
          .attr('xlink:href', nSR)
          .attr('x', '0')
          .attr('y', '0')
          .attr('width', width)
          .attr('height', height)
          .attr('id', 'rift');


    // GET THE 10 IMAGES FROM URL
    for (var z = 0; z < Object.keys(self.state.champImg).length; z++) {
      var checking = self.state.playerID[z][1];
      // console.log(self.state.champImg, 'y u do dis')
      // console.log('total', champImg)
      // console.log('imgURL', checking)
      // console.log(champImg[checking], 'asymc?')
      svg.append('svg:g').selectAll("image")
        .data([self.state.pos[z]])
        .enter().append("svg:image")
          .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + self.state.champImg[checking] + '.png')
          .attr('x', function(d) { return xScale(d[0]) })
          .attr('y', function(d) { return yScale(d[1]) })
          .attr('class', 'image')
          .style({ 'width': '24px', 'height': '24px' });
                 
    }
    // SET STATE FOR SVG TO USE LATER
    this.setState({
      png: svg,
    })
  },

  addChampImg: function(e) {
    // APPARENTLY NEEDED TO PROPERLY "SCALE" NEW ICONS FOR USE
    var domain = 
        {
          min: {x: -120, y: -120},
          max: {x: 14870, y: 14980}
        },

    // SCALING MAP DOWN
        width = 512,
        height = 512,

        xScale = d3.scale.linear()
          .domain([domain.min.x, domain.max.x])
          .range([0, width]),

        yScale = d3.scale.linear()
          .domain([domain.min.y, domain.max.y])
          .range([height, 0]),

        self = this;

    // console.log(self.state.playerID, 'scroll part')
    for (var w = 0; w < self.state.playerID.length; w++) {
      // console.log(self.state.champImg[self.state.playerID])
      // console.log('this 193', self.state.champImg[self.state.playerID[w][1]])
      var checking = self.state.playerID[w];
      // console.log('total', self.state.allowScroll[e][0].participantFrames[w+1].position)

      // REMOVE PREVIOUS ICONS
      
      console.log(self.state.allowScroll[e][0].participantFrames[w+1], e)
      
      // USE SVG FROM STATE TO APPEND NEW ICONS
      // MAYBE DIDN'T HIT THE NEXT MINUTE TO LOG PLAYER POSITION
      // MOVED REMOVE METHOD TO IF STATEMENT TO NOT REMOVE IMAGE
      if (self.state.allowScroll[e][0].participantFrames[w+1].position) {
        d3.select("g").remove();
        this.state.png.append('svg:g').selectAll("image")
          .data([[ self.state.allowScroll[e][0].participantFrames[w+1].position.x, self.state.allowScroll[e][0].participantFrames[w+1].position.y ]])
          .enter().append("svg:image")
            .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + self.state.champImg[self.state.playerID[w][1]] + '.png')
            .attr('x', function(d) { return xScale(d[0]) })
            .attr('y', function(d) { return yScale(d[1]) })
            .attr('class', 'image')
            .style({ 'width': '24px', 'height': '24px' })
      }

      // USER MAY GO STRAIGHT TO LAST FRAME
      if (!self.state.allowScroll[e][0].participantFrames[w+1].position && self.state.allowScroll[e-1][0].participantFrames[w+1].position) {
       d3.select("g").remove();
        this.state.png.append('svg:g').selectAll("image")
          .data([[ self.state.allowScroll[e-1][0].participantFrames[w+1].position.x, self.state.allowScroll[e-1][0].participantFrames[w+1].position.y ]])
          .enter().append("svg:image")
            .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + self.state.champImg[self.state.playerID[w][1]] + '.png')
            .attr('x', function(d) { return xScale(d[0]) })
            .attr('y', function(d) { return yScale(d[1]) })
            .attr('class', 'image')
            .style({ 'width': '24px', 'height': '24px' }) 
      }

      this.setState({
        num: e
      })
    }
  },

  onChange: function(e) {
    e.preventDefault();
    // console.log(e);
    this.addChampImg(e.target.value)
  },

  render: function() {
    console.log(this.state.num)
    return (
      <div id="hello">
        {this.state.scrollBar}
        <TimeStamp timeline={this.state.allowScroll} conversion={this.state.num}  />
        <div id="map" ref="map" >

        </div>
        
      </div>
    )
  }
})

ReactDOM.render(<Display />, document.getElementById('content'))
