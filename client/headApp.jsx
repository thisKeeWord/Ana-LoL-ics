import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import TimeStamp from './timeStamp.jsx';
import EventDisplay from './eventDisplay.jsx';
import Chart from './chart.jsx';
import ChampBuild from './champBuild.jsx';
import ChampImage from './champImage.jsx';
import GamesOnSR from './summRift.jsx';
import DropDownMenu from './menu.jsx';
import GameMap from './gameMap.jsx';
import WhosGames from './whosGames.jsx';


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
      secondToggle: false,
      maxForStat: 0
    }
  }

  // POST REQUEST TO SERVER WITH USERNAME TO RETRIEVE ID
  post(data) {
    return $.ajax({
      type: 'POST',
      url: data.url.yooRL,
      data: JSON.stringify(data.username),
      contentType: 'application/json'
    })
  }

  // GET THE MATCH HISTORY
  postForGame(perGameData) {
    return $.ajax({
      type: 'POST',
      url: '/getGameData',
      data: perGameData
    })
  }

  // HANDLE IGN SUBMIT FORM
  handleSubmit(e) {
    e.preventDefault();
    const that = this;
    const inGameName = ReactDOM.findDOMNode(this.refs.userName).value;
    const cleanName = inGameName.toLowerCase().replace(/ /g, '')
    const newCleanName = {
      url: {
        yooRL: '/'
      }
    };

    // CHECK IF DATA EXISTS IN LOCAL STORAGE
    if (localStorage && localStorage[cleanName]) {
      newCleanName.username = { userName: localStorage[cleanName] };
      this.post(newCleanName).done(gotTheInfo => {
        that.setState({
          res: gotTheInfo[1],
          toggle: true,
          whosGames: cleanName.toUpperCase() 
        })
      })
    }

    // IF DATA ISN'T IN LOCAL STORAGE
    if (localStorage && !localStorage[cleanName]) {
      newCleanName.username = { userName: cleanName };
      this.post(newCleanName).done(gotTheInfo => {
        localStorage[cleanName] = gotTheInfo[0];
        that.setState({
          res: gotTheInfo[1],
          toggle: true,
          whosGames: cleanName.toUpperCase() 
        })
      })
    }
  }

  // HANDLE CLICK FOR MATCH SELECTION
  handleClick(e) {
    e.preventDefault();
    const sendGameId  = e.target.id,
        that = this;
    this.postForGame(sendGameId).done(function(gotGameData) {

      // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
      that.state.patch = gotGameData[0];
      that.state.pos = gotGameData[1];
      that.state.champImg = gotGameData[2];
      that.state.playerID = gotGameData[3];
      that.state.allowScroll = gotGameData[4];
      that.state.result = gotGameData[5];
      that.state.itemStorage = gotGameData[6];
      that.state.scrollBar = (<input id="scroll" type='range' style={{ width: '370px'}} min='0' max={gotGameData[4].length - 1} step='1' defaultValue='0' onChange={that.onChange.bind(that)}></input>);
      that.state.secondToggle = true;
      that.state.totalRenders++;

      // WHATEVER IS CALLED FIRST IS NOT BEING RENDERED
      that.move();
      that.addStatChoice();
      that.move();
      that.addItemVisuals();
    })
  }

  move() {
    // SEEMS 10 MAPS ARE RENDERED --> WILL EDIT THIS WEEKEND
    if (document.getElementById("backdrop")) {
      $("#backdrop").first().remove();
    }

    // RIOT'S SETUP FOR FULL SIZE OF SR MAP
    const domain = {
          min: {x: -120, y: -120},
          max: {x: 14870, y: 14980}
        },

        // SCALING MAP DOWN
        width = 400,
        height = 400,

        // NEWEST VERSION OF SUMMONER'S RIFT
        nSR = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-ig.png";

        // ADJUSTING COORDINATES TO FIT "MINIMAP" SIZE
        const xScale = d3.scale.linear()
          .domain([domain.min.x, domain.max.x])
          .range([0, width]);

        const yScale = d3.scale.linear()
          .domain([domain.min.y, domain.max.y])
          .range([height, 0]);

        const svg = d3.select("#map").append("svg:svg")
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
    for (let z = 0; z < this.state.playerID.length; z++) {
      const checking = this.state.playerID[z][1];

      // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
      svg.append('svg:g').attr("id", "champIcon").selectAll("image")
        .data([this.state.pos[z]])
        .enter().append("svg:image")
          .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.state.patch + '/img/champion/' + this.state.champImg[checking] + '.png')
          .attr('x', d => { return xScale(d[0]) })
          .attr('y', d => { return yScale(d[1]) })
          .attr('class', 'image')
          .style({ 'width': '17px', 'height': '17px' });         
    }

    // SET STATE FOR SVG TO USE LATER
    this.setState({
      png: svg
    })
  }

  // SCROLL BAR CHANGE
  onChange(e) {
    e.preventDefault();
    this.setState({
      num: e.target.value
    })
  }

  // BACKGROUND FOR THE BAR GRAPH
  addStatChoice() {
    if (this.state.totalRenders === 1) {
      const w = 550, 
          h = 300,
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
      const w = 304,
          h = 400,
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
    const eventSpecific = [];
    const searchEvents = this.state.allowScroll;
    for (let i = 0; i < this.state.playerID.length; i++) {
      let count = 0;
      if (eventPicked.target.value === 'WARD_PLACED' || eventPicked.target.value === 'WARD_KILL') {
        for (let j = 0; j < searchEvents.length; j++) {
          if (searchEvents[j][0].events) {
            for (let k = 0; k < searchEvents[j][0].events.length; k++) {
              if (searchEvents[j][0].events[k].eventType === eventPicked.target.value && (searchEvents[j][0].events[k].creatorId === this.state.playerID[i][0] || searchEvents[j][0].events[k].killerId === this.state.playerID[i][0])) {
                count++;
              }
            }
          }
        }
      }
      if (eventPicked.target.value === 'killerId' || eventPicked.target.value === 'victimId' || eventPicked.target.value === 'assistingParticipantIds') {
          for (let j = 0; j < searchEvents.length; j++) {
            if (searchEvents[j][0].events) {
              for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                if (searchEvents[j][0].events[k].eventType === 'CHAMPION_KILL') {
                  if (eventPicked.target.value === 'killerId' || eventPicked.target.value === 'victimId') {
                    if (searchEvents[j][0].events[k][eventPicked.target.value] === this.state.playerID[i][0]) {
                      count++;
                    }
                  }
                  if (eventPicked.target.value === 'assistingParticipantIds' && searchEvents[j][0].events[k][eventPicked.target.value]) {
                    for (let assists = 0; assists < searchEvents[j][0].events[k][eventPicked.target.value].length; assists++) {
                      if (searchEvents[j][0].events[k][eventPicked.target.value][assists] === this.state.playerID[i][0]) {
                        count++;
                      }
                    }
                  }
                }
              }
            }
          }
      }
      if (eventPicked.target.value === 'minionsKilled') {
        if (searchEvents[searchEvents.length - 1][0].participantFrames) {
          count = searchEvents[searchEvents.length - 1][0].participantFrames[i+1].minionsKilled + searchEvents[searchEvents.length - 1][0].participantFrames[i+1].jungleMinionsKilled
        }
      }
      if (eventPicked.target.value === 'totalGold') {
        if (searchEvents[searchEvents.length - 1][0].participantFrames) {
          count = searchEvents[searchEvents.length - 1][0].participantFrames[i+1].totalGold;
        }
      }
      eventSpecific.push(count);
    }
    this.setState({
      eventSelected: eventPicked.target.value,
      maxForStat: Math.max(...eventSpecific)
    })
  }

  render() {
    // IGN SEARCH BAR
    if (this.state.toggle === false) {
      return (
        <div id="landingPage">
          Your one stop shop to finding more than a summary but less than a replay of a game!<br />
          We are currently in beta and will soon have side-by-side game comparison available.<br />
          To get started, enter an ign (in game name) in the search bar.
          <form id="formSubmit" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" name="userName" ref="userName" placeholder="enter username" required />
          </form>
        </div>
      )
    }

    // MATCH LIST BUTTONS AND MATCH DATA
    if (this.state.secondToggle === true && this.state.toggle === true) {
      return (
        <div className="resultingInfo">
          <form id="getSummonersGames" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" name="userName" ref="userName" placeholder="enter username" required />
          </form>

          <WhosGames summonersName={this.state.whosGames} /> 

          <GamesOnSR res={this.state.res} onClick={this.handleClick.bind(this)} />
          <GameMap />
          <TimeStamp timeline={this.state.allowScroll} conversion={this.state.num} />
          <DropDownMenu scrollBar={this.state.scrollBar} whichEventPick={this.whichEventPick.bind(this)} />
          <EventDisplay timeline={this.state.allowScroll} spot={this.state.num} playerInfo={this.state.playerID} champImg={this.state.champImg} patch={this.state.patch} />
          <Chart timeline={this.state.allowScroll} spot={this.state.num} selData={this.state.selData} playerInfo={this.state.playerID} eventSelected={this.state.eventSelected} champName={this.state.champImg} maxForStat={this.state.maxForStat} />
          <ChampBuild timeline={this.state.allowScroll} spot={this.state.num} playerInfo={this.state.playerID} champName={this.state.champImg} itemStorage={this.state.itemStorage} addItems={this.state.addItems} patch={this.state.patch} />
          <ChampImage timeline={this.state.allowScroll} playerInfo={this.state.playerID} png={this.state.png} champImg={this.state.champImg} spot={this.state.num} patch={this.state.patch} />
        </div>
      )
    }

    // MATCH LIST BUTTONS
    if (this.state.toggle === true) {
      return (
        <div id="second">
          <form id="getSummonersGames" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" name="userName" ref="userName" placeholder="enter username" required />
          </form>

          <WhosGames summonersName={this.state.whosGames} /> 
          <GamesOnSR res={this.state.res} onClick={this.handleClick.bind(this)} />
          
        </div>
      )
    }
  }
}

module.exports=HeadApp;