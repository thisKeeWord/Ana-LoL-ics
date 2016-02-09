var React = require('react');
var ReactDOM = require('react-dom');
var request = require('request');
var champion = require('champion');
var $ = require('jquery');
var async = require('async');
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
      png: [] 
    })
  },

  // AFTER INITIAL RENDERING
  componentDidMount: function() {

    var that = this,
        count = -1,
        total = 0;
        
      

    // $.get(url + '?dataById=true&' + stuff.key, function(res) {

      // FIRST REQUEST TO FILE
      $.get('http://localhost:3000/demoData.html', function(data) {
        var info = JSON.parse(data);
        // console.log('result', result)

        // GOING FOR THE TIMELINE INFORMATION
        for (var j = 0; j < info.timeline.frames.length; j++) {
          // for (var keys in info.timeline.frames[j]) {
          that.state.allowScroll.push([info.timeline.frames[j]]);
            // console.log(info.timeline.frames[j]);
              // count++;
          // }
        }
        // console.log(that.state.allowScroll[15][0].participantFrames[11].position.x);
        // console.log('frames', allowScroll[2][0])
        var stepScroll = 300 / that.state.allowScroll.length;
        

        // NUMBER OF PARTICIPANTS FOR A GAME
        async.each(info.participants, function(i, next) {
          // console.log(info.participants[i].championId);
          // console.log(i.participantId, 'i')
          var pId = i.participantId;
          var cId = i.championId;

          that.state.playerID.push([pId, cId]);
          // console.log(playerID, "playerID");
          // console.log('j', playerID.length)
          // console.log('what???', url + cId + '?' + stuff.key);
          $.get(url + cId + '?' + stuff.key, function(champData) {
            // console.log('champData', champData.key)
            var stuffs = champData.key;
            // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
            
            // console.log('player ID"s', playerID);
              // for (var key in res["data"]) {
              //   if (key === champData.key) {
            count++;
            that.state.champImg[cId] = champData.key;
            // console.log('champImg wt key', champImg)
          // console.log('yoyoyo')
          // console.log(res["data"][key].image.full, 'champion images coming')
          // console.log(that);
          // console.log(playerID)

            // for (var j = 0; j < playerID.length; j++) {
            // console.log('playerID', playerID[count][0], count)
            // console.log('i', i)
            // for 
            that.state.pos.push([ info.timeline.frames[0].participantFrames[that.state.playerID[count][0]].position.x, info.timeline.frames[0].participantFrames[that.state.playerID[count][0]].position.y ]);
            console.log('state.pos', that.state.pos)
            // console.log(res.data[champData.key].image.full, 'champ')
            // champImg.push(res["data"][key].image.full)
            // console.log(champImg, 'champImg')
         

            // RENDERING THE CHAMPION IMAGES TO CUSTOM-SIZED MAP
            // console.log('ordering', pos.slice(pos.length - 1)[0][2])
            // console.log('champData.key', stuffs)
            // console.log(champData[playerID[total][1].key], 'async probs')
            // for (var k = 0; k < playerID.length; k++) {
              // console.log('keys', Object.keys(champImg))

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
                scrollBar: (<input id="scroll" type='range' style={{ width: '300px'}} min='0' max={that.state.allowScroll.length} step='1' defaultValue='0' onChange={that.onChange}></input>)

              }, 
                that.move()
              );
             // total++
            
          // }
            }
          })
        })
          // another anon func call once async is done
          // }
      })
    // })
  },

  move: function() {
    var self = this;
    // RIOT'S SETUP FOR FULL SIZE OF SR MAP
    var domain = {
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
        // $("svg").css({top: 100, left: 100, position:'absolute'});


        svg.append('image')
          .attr('xlink:href', nSR)
          .attr('x', '0')
          .attr('y', '0')
          .attr('width', width)
          .attr('height', height)
          .attr('id', 'rift');



    for (var z = 0; z < Object.keys(self.state.champImg).length; z++) {
      var checking = self.state.playerID[z][1];
      console.log(self.state.champImg, 'y u do dis')
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
          .style({ 'width': '24px', 'height': '24px' })
          .attr('id', z)
                 
    }
    this.setState({
      png: svg
    })
  },

  addChampImg: function(e) {
    // console.log(e.target.value)
    var domain = 
        {
          min: {x: -120, y: -120},
          max: {x: 14870, y: 14980}
        };

    // SCALING MAP DOWN
    var width = 512,
        height = 512;
    var xScale = d3.scale.linear()
          .domain([domain.min.x, domain.max.x])
          .range([0, width]);

    var yScale = d3.scale.linear()
          .domain([domain.min.y, domain.max.y])
          .range([height, 0]);
    var self = this;
    // console.log('this 193', this)
    console.log(self.state.playerID, 'scroll part')
    for (var w = 0; w < self.state.playerID.length; w++) {
      // console.log(self.state.champImg[self.state.playerID])
      console.log('this 193', self.state.champImg[self.state.playerID[w][1]])
      var checking = self.state.playerID[w];
      console.log('total', self.state.allowScroll[e][0].participantFrames[w+1].position)
      // console.log('imgURL', checking)
      // console.log(champImg[checking], 'asymc?')
      // console.
      // var svg = d3.select("#map").append("svg:svg")
      //     .attr("width", 512)
      //     .attr("height", 512)
      //     .attr('x', '0')
      //     .attr('y', '0');
      // console.log(document.getElementById('1'))
      d3.select("g").remove();
      console.log([[ self.state.allowScroll[e][0].participantFrames[w+1].position.x, self.state.allowScroll[e][0].participantFrames[w+1].position.y ]])
      this.state.png.append('svg:g').selectAll("image")
        .data([[ self.state.allowScroll[e][0].participantFrames[w+1].position.x, self.state.allowScroll[e][0].participantFrames[w+1].position.y ]])
        .enter().append("svg:image")
          .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + self.state.champImg[self.state.playerID[w][1]] + '.png')
          .attr('x', function(d) { return xScale(d[0]) })
          .attr('y', function(d) { return yScale(d[1]) })
          .attr('class', 'image')
          .style({ 'width': '24px', 'height': '24px' });
    }
  },

  onChange: function(e) {
    e.preventDefault();
    console.log(e.target.value, 'value')
    this.addChampImg(e.target.value)
  },

  render: function() {
    return (
      <div id="hello">
        {this.state.scrollBar}

        <div id="map" ref="map" >  </div>
        
      </div>
    )
  }
})

ReactDOM.render(<Display />, document.getElementById('content'))
