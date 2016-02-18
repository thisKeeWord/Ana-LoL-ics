import React from 'react';
import ReactDOM from 'react-dom';
import request from 'request';
import champion from 'champion';
import $ from 'jquery';
import async from 'async';
import TimeStamp from './timeStamp.jsx';
import EventDisplay from './eventDisplay.jsx';
import SelectData from './selectData.jsx';
import stuff from './../stuff.js';
let url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/';
    

class Display extends React.Component {
  constructor() {
    super();

    this.state = {
      scrollBar: '',
      playerID: [],
      pos: [],
      champImg: {},
      allowScroll: [],
      result: {},
      png: [],
      num: 0,
      selData: '',
      eventSelected: ''
    }
  }

  // AFTER INITIAL RENDERING
  componentWillMount() {
    let that = this,
        count = -1,
        total = 0;

    // $.get(url + '?dataById=true&' + stuff.key, function(res) {

    // FIRST REQUEST TO FILE
    $.get('http://localhost:3000/demoData.html', data => {
      let info = JSON.parse(data);  
      
      // GOING FOR THE TIMELINE INFORMATION
      for (let j = 0; j < info.timeline.frames.length; j++) {
        that.state.allowScroll.push([info.timeline.frames[j]]);
      }  

      // HAVE TO USE NUMBER FOR NUMERATOR SINCE SCROLL NOT UP YET
      let stepScroll = 300 / that.state.allowScroll.length;

      // NUMBER OF PARTICIPANTS FOR A GAME: ASYNC, BUT PARALLEL
      async.each(info.participants, (i, next) => {

        let pId = i.participantId;
        let cId = i.championId;

        // PARTICIPANT-ID AND CHAMPION-ID
        that.state.playerID.push([pId, cId]);
        console.log(that.state.playerID)

        // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
        $.get(url + cId + '?' + stuff.key, champData => {
          console.log(champData, 'champData');
          let stuffs = champData.key;
          count++;

          // HAD TO DO THIS WAY SINCE IMAGES RETURN AT RANDOM
          that.state.champImg[cId] = champData.key;
          that.state.pos.push([ info.timeline.frames[0].participantFrames[that.state.playerID[count][0]].position.x, info.timeline.frames[0].participantFrames[that.state.playerID[count][0]].position.y ]);

          // WAIT FOR ALL THE IMAGES TO RETURN AND GET PUSHED TO CHAMPIMG ARRAY
          if (champData[that.state.playerID[total][1].key] !== null && Object.keys(that.state.champImg).length === 10) {
            that.setState({ 
              pos: that.state.pos,
              champImg: that.state.champImg,
              playerID: that.state.playerID,
              allowScroll: that.state.allowScroll,
              result: info,
              scrollBar: (<input id="scroll" type='range' style={{ width: '300px'}} min='0' max={that.state.allowScroll.length - 1} step='1' defaultValue='0' onChange={that.onChange.bind(that)}></input>)
            }, 
              that.move(),
              that.addChampImg(0)
            );
          }
        })
      })
    })
  }

  move() {
    var that = this;
    // RIOT'S SETUP FOR FULL SIZE OF SR MAP
    let domain = {
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
        // color = d3.scale.linear()
        //   .domain([0, 3])
        //   .range(["white", "steelblue"])
        //   .interpolate(d3.interpolateLab);

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
    for (let z = 0; z < Object.keys(this.state.champImg).length; z++) {
      let checking = this.state.playerID[z][1];

      // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
      svg.append('svg:g').attr("id", "champIcon" + z).selectAll("image")
        .data([this.state.pos[z]])
        .enter().append("svg:image")
          .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + this.state.champImg[checking] + '.png')
          .attr('x', d => { return xScale(d[0]) })
          .attr('y', d => { return yScale(d[1]) })
          .attr('class', 'image')
          .style({ 'width': '24px', 'height': '24px' });
                 
    }
    // SET STATE FOR SVG TO USE LATER
    this.setState({
      png: svg,
    })
  }

  addChampImg(spot) {
    console.log(this.state)
    // APPARENTLY NEEDED TO PROPERLY "SCALE" NEW ICONS FOR USE
    let domain = 
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
          .range([height, 0]);

    for (let w = 0; w < this.state.playerID.length; w++) {
      let checking = this.state.playerID[w];

      // REMOVE PREVIOUS ICONS      
      // USE SVG FROM STATE TO APPEND NEW ICONS
      // MAYBE DIDN'T HIT THE NEXT MINUTE TO LOG PLAYER POSITION
      // MOVED REMOVE METHOD TO IF STATEMENT TO NOT REMOVE IMAGE
      if (this.state.allowScroll[spot][0].participantFrames[w+1].position) {
        d3.select("#champIcon" + w).remove();
        this.state.png.append('svg:g').attr("id", "champIcon" + w).selectAll("image")
          .data([[ this.state.allowScroll[spot][0].participantFrames[w+1].position.x, this.state.allowScroll[spot][0].participantFrames[w+1].position.y ]])
          .enter().append("svg:image")
            .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + this.state.champImg[this.state.playerID[w][1]] + '.png')
            .attr('x', d => { return xScale(d[0]) })
            .attr('y', d => { return yScale(d[1]) })
            .attr('class', 'image')
            .style({ 'width': '24px', 'height': '24px' })
      }

      // USER MAY GO STRAIGHT TO LAST FRAME
       if (!this.state.allowScroll[spot][0].participantFrames[w+1].position && this.state.allowScroll[spot-1][0].participantFrames[w+1].position) {
       d3.select("#champIcon" + w).remove();
        this.state.png.append('svg:g').attr("id", "champIcon" + w).selectAll("image")
          .data([[ this.state.allowScroll[spot-1][0].participantFrames[w+1].position.x, this.state.allowScroll[spot-1][0].participantFrames[w+1].position.y ]])
          .enter().append("svg:image")
            .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + this.state.champImg[this.state.playerID[w][1]] + '.png')
            .attr('x', d => { return xScale(d[0]) })
            .attr('y', d => { return yScale(d[1]) })
            .attr('class', 'image')
            .style({ 'width': '24px', 'height': '24px' }) 
      }
      this.setState({
        num: spot
      })
    }
  }

  onChange(e) {
    e.preventDefault();
    this.addChampImg(e.target.value);
  }

  addStatChoice(data) {
    let w = 500, 
        h = 100,
        svg = d3.select("#YO")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("id", "allStat");

    this.state.selData = svg;
  }

  whichEventPick(eventPicked) {
    eventPicked.preventDefault();
    console.log('checking 289', eventPicked.target.value)
    this.state.eventSelected = eventPicked.target.value
    console.log(this.state)
  }

  render() {

    var that = this;
    return (
      <div id="parent">
        {this.state.scrollBar}

        <TimeStamp timeline={this.state.allowScroll} conversion={this.state.num} />
        <EventDisplay timeline={this.state.allowScroll} spot={this.state.num} playerInfo={this.state.playerID} champImg={this.state.champImg} />
        <SelectData timeline={this.state.allowScroll} spot={this.state.num} selData={this.state.selData} playerInfo={this.state.playerID} passStat={this.addStatChoice.bind(this)} eventSelected={this.state.eventSelected} />

        <select defaultValue='A' onLoad={that.whichEventPick.bind(that)} onChange={that.whichEventPick.bind(that)} id="yo" >
          <option value="WARD_PLACED">wards placed</option>
          <option value="WARD_KILL">wards killed</option>
          <option value='A'>A</option>
          <option value='Fruit'>Fruit</option>
        </select>

        <div id="map" ref="map" />

      </div>
    )
  }
}

ReactDOM.render(<Display />, document.getElementById('content'))