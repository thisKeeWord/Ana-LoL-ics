import React from 'react';
import ReactDOM from 'react-dom';
import request from 'request';
import champion from 'champion';
import $ from 'jquery';
import async from 'async';
import TimeStamp from './timeStamp.jsx';
import EventDisplay from './eventDisplay.jsx';
import Chart from './chart.jsx';
import ChampBuild from './champBuild.jsx';
import ChampImage from './champImage.jsx';
import stuff from './../stuff.js';
let url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/';
let summonerUrl = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";
let matchUrl = "https://na.api.pvp.net/api/lol/na/v2.2/match/";



class HeadApp extends React.Component {
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
      eventSelected: '',
      addItems: '',
      toggle: false,
      secondToggle: false
    }
  }

  // POST REQUEST TO SERVER WITH USERNAME TO RETRIEVE ID
  post(data) {
    console.log(data.username.userName);
    return $.ajax({
      type: 'POST',
      url: data.url.url,
      data: JSON.stringify(data.username),
      contentType: 'application/json'
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    let that = this;
    let cleanName = React.findDOMNode(this.refs.userName).value;
    let newCleanName = {
      username: {
        userName: cleanName.toLowerCase().replace(/ /g, '')
      }
    };
    if (localStorage && !localStorage[newCleanName.username.userName]) {
      newCleanName.url = { url: '/' };
      this.post(newCleanName).done(res => {
        localStorage[newCleanName.username.userName] = res;
      });
    }
    if (localStorage && localStorage[newCleanName.username.userName]) {
      console.log('sup')
      newCleanName.url = { url: '/found' };
      console.log(Number(localStorage[newCleanName.username.userName]))
      newCleanName.username = { userName: localStorage[newCleanName.username.userName] };
      this.post(newCleanName).done(res => {
        console.log(res)
        that.setState({
          res: res,
          toggle: true
        })
      })
    }
  }

  handleClick(e) {
    e.preventDefault();
    let that = this,
        count = -1,
        total = 0;
    let matchId = e.target.id;
    request("http://ddragon.leagueoflegends.com/cdn/6.2.1/data/en_US/item.json", (err, data) => {
      if (err) return console.error(err);
      
      // FIRST REQUEST TO FILE
      request(matchUrl + matchId + "?includeTimeline=true&" + stuff.stuff1, (error, newData) => {
        if (error) return console.error(error);
        let info = JSON.parse(newData.body);  
        
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

          // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
          $.get(url + cId + '?' + stuff.stuff1, champData => {
            let stuffs = champData.key;
            count++;

            // HAD TO DO THIS WAY SINCE IMAGES RETURN AT RANDOM
            that.state.champImg[cId] = champData.key;
            that.state.pos.push([ info.timeline.frames[0].participantFrames[that.state.playerID[count][0]].position.x, info.timeline.frames[0].participantFrames[that.state.playerID[count][0]].position.y ]);

            // WAIT FOR ALL THE IMAGES TO RETURN AND GET PUSHED TO CHAMPIMG ARRAY
            if (champData[that.state.playerID[total][1].key] !== null && Object.keys(that.state.champImg).length === 10) {
              
                // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
                this.state.pos = that.state.pos,
                this.state.champImg = that.state.champImg,
                this.state.playerID = that.state.playerID,
                this.state.allowScroll = that.state.allowScroll,
                this.state.result = info,
                this.state.itemStorage = JSON.parse(data.body).data,
                this.state.scrollBar = (<input id="scroll" type='range' style={{ width: '300px'}} min='0' max={that.state.allowScroll.length - 1} step='1' defaultValue='0' onChange={that.onChange.bind(that)}></input>),
                this.state.secondToggle = true;

                // WHATEVER IS CALLED FIRST IS NOT BEING RENDERED
                that.move();
                that.addStatChoice();
                that.move();
                that.addItemVisuals();
            }
          })
        })
      })
    })
  }

  move() {
    // SEEMS 10 MAPS ARE RENDERED --> WILL EDIT THIS WEEKEND
    if (document.getElementById("backdrop")) {
      $("#backdrop").first().remove();
    }

    // RIOT'S SETUP FOR FULL SIZE OF SR MAP
    let domain = {
          min: {x: -120, y: -120},
          max: {x: 14870, y: 14980}
        },

        // SCALING MAP DOWN
        width = 512,
        height = 512,

        // NEWEST VERSION OF SUMMONER'S RIFT
        nSR = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-ig.png";

        // ADJUSTING COORDINATES TO FIT "MINIMAP" SIZE
        let xScale = d3.scale.linear()
          .domain([domain.min.x, domain.max.x])
          .range([0, width]);

        let yScale = d3.scale.linear()
          .domain([domain.min.y, domain.max.y])
          .range([height, 0]);

        let svg = d3.select("#map").append("svg:svg")
          .attr("id", "backdrop")
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
    // this.setState({
    //   png: svg
    // })
    this.setState({
      png: svg
    })
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      num: e.target.value
    })
    // this.state.num = e.target.value;
  }

  // BACKGROUND FOR THE BAR GRAPH
  addStatChoice() {
    // debugger
    let w = 500, 
        h = 400,
        svg = d3.select("#chart")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("id", "allStat");
    // this.setState({
    //   selData: svg
    // })
    this.setState({
      selData: svg
    })
  }

  // CHAMP BUILDS
  addItemVisuals() {
    let w = 250,
        h = 600,
        svg = d3.select("#builds")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("id", "allItems");
    this.setState({
      addItems: svg
    })
    // this.state.addItems = svg;
  }

  // USER SELECTION ON DROPDOWN MENU
  whichEventPick(eventPicked) {
    eventPicked.preventDefault();
    // this.setState({
    //   eventSelected: eventPicked.target.value
    // })
    this.setState({
      eventSelected: eventPicked.target.value
    })
  }

  // update(allInfoPos, allInfoChampImg, allInfoPlayerID, allInfoScroll, info, res) {
  //   this.state.pos = allInfoPos;
  //   this.state.champImg = allInfoChampImg;
  //   this.state.playerID = allInfoPlayerID;
  //   this.state.allowScroll = allInfoScroll;
  //   this.state.result = info;
  //   this.state.itemStorage = res;
  //   this.state.scrollBar = (<input id="scroll" type='range' style={{ width: '300px'}} min='0' max={this.state.allowScroll.length - 1} step='1' defaultValue='0' onChange={this.onChange.bind(this)}></input>);
  //   // this.state.toggle = true;
  // }

  render() {
    if (this.state.toggle === false) {
      return (
        <div id="form">
          <form id="formSubmit" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" name="userName" ref="userName" placeholder="enter username"required />
          </form>
        </div>
      )
    }
    if (this.state.secondToggle === true && this.state.toggle === true) {
      return (
        <div id="matchResults">
          { this.state.res.map(matchList => {
            console.log(matchList[0]);
              // debugger;

              return (
                <div id="matchHistory">
                  <input type="submit" id={matchList[0]} onClick={this.handleClick.bind(this)}
                    style={{backgroundSize: "30px", backgroundImage:"url(" + matchList[1] + ")",  backgroundRepeat: "no-repeat", "height":"40px"}} value={matchList[2]} >
                  </input>
                  
                </div>
              )
            })
            
          }

          {this.state.scrollBar}

          <select defaultValue='A' onLoad={this.whichEventPick.bind(this)} onChange={this.whichEventPick.bind(this)} id="selections" >
            <option value="WARD_PLACED">wards placed</option>
            <option value="WARD_KILL">wards killed</option>
            <option value='A'>A</option>
            <option value='Fruit'>Fruit</option>
          </select>

          <TimeStamp timeline={this.state.allowScroll} conversion={this.state.num} />
          <EventDisplay timeline={this.state.allowScroll} spot={this.state.num} playerInfo={this.state.playerID} champImg={this.state.champImg} />
          <Chart timeline={this.state.allowScroll} spot={this.state.num} selData={this.state.selData} playerInfo={this.state.playerID} eventSelected={this.state.eventSelected} champName={this.state.champImg} />
          <ChampBuild timeline={this.state.allowScroll} spot={this.state.num} playerInfo={this.state.playerID} champName={this.state.champImg} itemStorage={this.state.itemStorage} addItems={this.state.addItems}  />
          <ChampImage timeline={this.state.allowScroll} playerInfo={this.state.playerID} png={this.state.png} champImg={this.state.champImg} spot={this.state.num} />

          <div id="map" ref="map" />
        </div>
      )
    }
    if (this.state.toggle === true) {
      console.log(this.state.res)
      return (
        <div id="listOMatches">
          { this.state.res.map(matchList => {
            console.log(matchList[0]);
              // debugger;

              return (
                <div id="matchHistory">
                  <input type="submit" id={matchList[0]} onClick={this.handleClick.bind(this)}
                    style={{backgroundSize: "30px", backgroundImage:"url(" + matchList[1] + ")",  backgroundRepeat: "no-repeat", "height":"40px"}} value={matchList[2]} >
                  </input>
                  
                </div>
              )
            })
            
          }
        </div>
      )
    }
  }
}

ReactDOM.render(<HeadApp />, document.getElementById('content'))
// return (
      //   <Display userId={this.state.userId} update={this.update.bind(this)} whichEventPick={this.whichEventPick.bind(this)} addItemVisuals={this.addItemVisuals.bind(this)} addStatChoice={this.addStatChoice.bind(this)} onNeedChange={this.onChange.bind(this)} move={this.move.bind(this)} allInfo={this.state} />
      // )