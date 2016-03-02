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
let version = "https://ddragon.leagueoflegends.com/api/versions.json";



class HeadApp extends React.Component {
  constructor() {
    super();
    this.state = {
      totalRenders: 0,
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
      patch: 0,
      secondToggle: false
    }
  }

  // POST REQUEST TO SERVER WITH USERNAME TO RETRIEVE ID
  post(data) {
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
      newCleanName.url = { url: '/found' };
      newCleanName.username = { userName: localStorage[newCleanName.username.userName] };
      this.post(newCleanName).done(res => {
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
        total = 0,
        matchId = e.target.id,
        compareVersions = 0,
        patchDesired = 0,
        gameTimeline = [],
        idOfPlayer = [],
        imgOfChamp = [],
        positionOfPlayer = [];



    // if (!document.getElementById("scroll") || !document.getElementById("selections") || !document.getElementById("map") || !document.getElementById("champImages") || !document.getElementById("builds") || !document.getElementById("chart") || !document.getElementById("eventDisplay") || !document.getElementById("time")) {
    request(matchUrl + matchId + "?includeTimeline=true&" + stuff.stuff1, (error, newData) => {
      if (error) return console.error(error);
      // console.log('b')
      let info = JSON.parse(newData.body); 

      request(version, (error, checkingVersion) => {
        let versionChecks = JSON.parse(checkingVersion.body);
        let patchVersion = 0;
        if (error) return console.error(error);
        while(patchVersion < versionChecks.length) {
          let splitCheck = versionChecks[patchVersion].split('.').slice(0, 2);
          let gamePatch = info.matchVersion.split('.').slice(0, 2);
          // console.log(splitCheck)
          // console.log(gamePatch)
          if (splitCheck.join('') === gamePatch.join('')) {
            patchDesired = versionChecks[patchVersion];
            // console.log(patchDesired)
            break;
          }
          patchVersion++;
        }


        // FIRST REQUEST TO FILE
        request("http://ddragon.leagueoflegends.com/cdn/" + patchDesired + "/data/en_US/item.json", (err, data) => {
          if (error) return console.error(error);
          // console.log(JSON.parse(data.body).data)
          // console.log('c') 
          
          // GOING FOR THE TIMELINE INFORMATION
          for (let j = 0; j < info.timeline.frames.length; j++) {
            gameTimeline.push([info.timeline.frames[j]]);
          }  

          // HAVE TO USE NUMBER FOR NUMERATOR SINCE SCROLL NOT UP YET
          let stepScroll = 300 / gameTimeline.length;

          // NUMBER OF PARTICIPANTS FOR A GAME: ASYNC, BUT PARALLEL
          async.each(info.participants, (i, next) => {
            // console.log('d')
            let pId = i.participantId;
            let cId = i.championId;
            // console.log(cId, i.championId)


            // PARTICIPANT-ID AND CHAMPION-ID
            idOfPlayer.push([pId, cId]);

            // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
            $.get(url + cId + '?' + stuff.stuff1, champData => {
              let stuffs = champData.key;
              count++;
              // console.log('e')

              // HAD TO DO THIS WAY SINCE IMAGES RETURN AT RANDOM
              imgOfChamp[cId] = champData.key;
              positionOfPlayer.push([ info.timeline.frames[0].participantFrames[idOfPlayer[count][0]].position.x, info.timeline.frames[0].participantFrames[idOfPlayer[count][0]].position.y ]);


               // console.log(Object.keys(imgOfChamp), 'pre-post g')

              // WAIT FOR ALL THE IMAGES TO RETURN AND GET PUSHED TO CHAMPIMG ARRAY
              if ( Object.keys(imgOfChamp).length === 10) {
                          // console.log('g')

              // console.log(champData[idOfPlayer[total][1].key], 'post-g')
                  // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
                  this.state.patch = patchDesired;
                  this.state.pos = positionOfPlayer;
                  this.state.champImg = imgOfChamp;
                  this.state.playerID = idOfPlayer;
                  this.state.allowScroll = gameTimeline;
                  this.state.result = info;
                  this.state.itemStorage = JSON.parse(data.body).data;
                  this.state.scrollBar = (<input id="scroll" type='range' style={{ width: '300px'}} min='0' max={gameTimeline.length - 1} step='1' defaultValue='0' onChange={that.onChange.bind(that)}></input>);
                  this.state.secondToggle = true;
                  this.state.totalRenders++;

                  // console.log("plz")

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
    })
  }

  move() {
    // SEEMS 10 MAPS ARE RENDERED --> WILL EDIT THIS WEEKEND
    // console.log('f')
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
    // if (document.getElementById("backdrop")) {

    // }
    for (let z = 0; z < Object.keys(this.state.champImg).length; z++) {
      let checking = this.state.playerID[z][1];

      // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
      svg.append('svg:g').attr("id", "champIcon").selectAll("image")
        .data([this.state.pos[z]])
        .enter().append("svg:image")
          .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.state.patch + '/img/champion/' + this.state.champImg[checking] + '.png')
          .attr('x', d => { return xScale(d[0]) })
          .attr('y', d => { return yScale(d[1]) })
          .attr('class', 'image')
          .style({ 'width': '24px', 'height': '24px' });         
    }
    // SET STATE FOR SVG TO USE LATER
    this.setState({
      png: svg
    })
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      num: e.target.value
    })
  }

  // BACKGROUND FOR THE BAR GRAPH
  addStatChoice() {
    if (this.state.totalRenders === 1) {
      let w = 500, 
          h = 400,
          svg = d3.select("#chart")
                  .append("svg:svg")
                  .attr("width", w)
                  .attr("height", h)
                  .attr("id", "allStat");
      this.setState({
        selData: svg
      })
    }
  }

  // CHAMP BUILDS
  addItemVisuals() {
    if (this.state.totalRenders === 1) {
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
    }
  }

  // USER SELECTION ON DROPDOWN MENU
  whichEventPick(eventPicked) {
    eventPicked.preventDefault();
    this.setState({
      eventSelected: eventPicked.target.value
    })
  }

  render() {
    // IGN SEARCH BAR
    if (this.state.toggle === false) {
      return (
        <div id="form">
          <form id="formSubmit" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" name="userName" ref="userName" placeholder="enter username" required />
          </form>
        </div>
      )
    }

    // MATCH LIST BUTTONS AND MATCH DATA
    if (this.state.secondToggle === true && this.state.toggle === true) {
      // console.log(this.state.allowScroll)
      return (
        <div id="matchResults">
          { this.state.res.map(matchList => {
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

          <select defaultValue='select one' onLoad={this.whichEventPick.bind(this)} onChange={this.whichEventPick.bind(this)} id="selections" >
            <option value="select one">select one</option>
            <option value="WARD_PLACED">wards placed</option>
            <option value="WARD_KILL">wards killed</option>
            <option value='minionsKilled'>total minions killed</option>
            <option value='totalGold'>total gold earned</option>
          </select>

          <TimeStamp timeline={this.state.allowScroll} conversion={this.state.num} />
          <EventDisplay timeline={this.state.allowScroll} spot={this.state.num} playerInfo={this.state.playerID} champImg={this.state.champImg} patch={this.state.patch} />
          <Chart timeline={this.state.allowScroll} spot={this.state.num} selData={this.state.selData} playerInfo={this.state.playerID} eventSelected={this.state.eventSelected} champName={this.state.champImg} />
          <ChampBuild timeline={this.state.allowScroll} spot={this.state.num} playerInfo={this.state.playerID} champName={this.state.champImg} itemStorage={this.state.itemStorage} addItems={this.state.addItems} patch={this.state.patch} />
          <ChampImage timeline={this.state.allowScroll} playerInfo={this.state.playerID} png={this.state.png} champImg={this.state.champImg} spot={this.state.num} patch={this.state.patch} />

          <div id="map" ref="map" />
        </div>
      )
    }

    // MATCH LIST BUTTONS
    if (this.state.toggle === true) {
      return (
        <div id="listOMatches">
          { this.state.res.map(matchList => {
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