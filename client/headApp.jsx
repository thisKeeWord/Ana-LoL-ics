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
      playerID1: [],
      pos1: [],
      champImg1: {},
      allowScroll1: [],
      result1: {},
      png1: [],
      num1: 0,
      selData1: '',
      eventSelected1: '',
      addItems1: '',
      toggle: false,
      patch1: 0,
      secondToggle: false,
      maxForStat1: 0,
      gamesToSee: 1,
      clicksForGame: [],
      playerID2: [],
      pos2: [],
      champImg2: {},
      allowScroll2: [],
      result2: {},
      png2: [],
      num2: 0,
      selData2: '',
      eventSelected2: '',
      addItems2: '',
      patch2: 0,
      maxForStat2: 0,

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
    this.state.clicksForGame.push(e.target.id);
    const that = this;
    // let count = this.state.gamesToSee;

    if (this.state.clicksForGame.length === this.state.gamesToSee) {
      this.postForGame(this.state.clicksForGame[this.state.clicksForGame.length - 1]).done(gotGameOne => {

        // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
        that.state.patch1 = gotGameOne[0];
        that.state.pos1 = gotGameOne[1];
        that.state.champImg1 = gotGameOne[2];
        that.state.playerID1 = gotGameOne[3];
        that.state.allowScroll1 = gotGameOne[4];
        that.state.result1 = gotGameOne[5];
        that.state.itemStorage1 = gotGameOne[6];
        that.state.secondToggle = true;
        that.state.totalRenders = 1;
        that.state.clicksForGame.length--;
        if (this.state.gamesToSee === 1) {
          that.state.scrollBar = (<input id={"scroll1"} type='range' style={{ width: '370px'}} min='0' max={gotGameOne[4].length - 1} step='1' defaultValue='0' onChange={that.onChange.bind(that)}></input>);

          // WHATEVER IS CALLED FIRST IS NOT BEING RENDERED
          that.move();
          that.addStatChoice();
          that.move();
          that.addItemVisuals();
        }
      }).then(() => {
        if (that.state.clicksForGame.length === 1) {
          that.postForGame(this.state.clicksForGame[0]).done(gotGameOne => {

            // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
            that.state.patch2 = gotGameOne[0];
            that.state.pos2 = gotGameOne[1];
            that.state.champImg2 = gotGameOne[2];
            that.state.playerID2 = gotGameOne[3];
            that.state.allowScroll2 = gotGameOne[4];
            that.state.result2 = gotGameOne[5];
            that.state.itemStorage2 = gotGameOne[6];
            that.state.scrollBar = (<input id={"scroll2"} type='range' style={{ width: '370px'}} min='0' max={Math.max(that.state.allowScroll1.length - 1, gotGameOne[4].length - 1)} step='1' defaultValue='0' onChange={that.onChange.bind(that)}></input>);
            that.state.totalRenders = 2;
            that.state.clicksForGame.length--;

            // WHATEVER IS CALLED FIRST IS NOT BEING RENDERED
            that.move();
            that.addStatChoice();
            that.move();
            that.addItemVisuals();
          })
        }
      })
    }
  }

  move() {
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

    // SEEMS 10 MAPS ARE RENDERED --> WILL EDIT THIS WEEKEND
    if (this.state.gamesToSee === 1) {
      if (document.getElementById("backdrop1")) {
        $("#backdrop1").first().remove();
      }
      if (document.getElementById("backdrop4") && document.getElementById("backdrop2")) {
        $("#backdrop2").first().remove();
        $("#backdrop4").first().remove();
      }
    }

    if (this.state.gamesToSee === 2) {
      if (document.getElementById("backdrop4") && document.getElementById("backdrop2")) {
        $("#backdrop4").first().remove();
        $("#backdrop2").first().remove();
      }
      if (document.getElementById("backdrop1")) {
        $("#backdrop1").first().remove();
      }
    }

    if (this.state.totalRenders === 1 && this.state.gamesToSee === 1) {
      let svg = d3.select("#map" + 1 * this.state.gamesToSee).append("svg:svg")
        .attr("id", "backdrop" + 1 * this.state.gamesToSee)
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
      for (let z = 0; z < this.state.playerID1.length; z++) {
        const checking = this.state.playerID1[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg.append('svg:g').attr("id", "champIcon" + 1 * this.state.gamesToSee).selectAll("image")
          .data([this.state.pos1[z]])
          .enter().append("svg:image")
            .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.state.patch1 + '/img/champion/' + this.state.champImg1[checking] + '.png')
            .attr('x', d => { return xScale(d[0]) })
            .attr('y', d => { return yScale(d[1]) })
            .attr('class', 'image')
            .style({ 'width': '17px', 'height': '17px' });         
      }

      // SET STATE FOR SVG TO USE LATER
      this.setState({
        png1: svg
      })
    }

    if (this.state.gamesToSee === 2 && this.state.totalRenders === 2) {
      let svg = d3.select("#map" + 1 * this.state.gamesToSee).append("svg:svg")
        .attr("id", "backdrop" + 1 * this.state.gamesToSee)
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
      for (let z = 0; z < this.state.playerID1.length; z++) {
        const checking1 = this.state.playerID1[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg.append('svg:g').attr("id", "champIcon" + 1 * this.state.gamesToSee).selectAll("image")
          .data([this.state.pos1[z]])
          .enter().append("svg:image")
            .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.state.patch1 + '/img/champion/' + this.state.champImg1[checking1] + '.png')
            .attr('x', d => { return xScale(d[0]) })
            .attr('y', d => { return yScale(d[1]) })
            .attr('class', 'image')
            .style({ 'width': '17px', 'height': '17px' });         
      }

      const svg2 = d3.select("#map" + 2 * this.state.gamesToSee).append("svg:svg")
        .attr("id", "backdrop" + 2 * this.state.gamesToSee)
        .attr("width", width)
        .attr("height", height)
        .attr('x', '0')
        .attr('y', '0');

      // APPEND BACKGROUND IMAGE TO SVG
      svg2.append('image')
        .attr('xlink:href', nSR)
        .attr('x', '0')
        .attr('y', '0')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'rift');

      // GET THE 10 IMAGES FROM URL
      for (let z = 0; z < this.state.playerID2.length; z++) {
        const checking2 = this.state.playerID2[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg2.append('svg:g').attr("id", "champIcon" + 2 * this.state.gamesToSee).selectAll("image")
          .data([this.state.pos2[z]])
          .enter().append("svg:image")
            .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.state.patch2 + '/img/champion/' + this.state.champImg2[checking2] + '.png')
            .attr('x', d => { return xScale(d[0]) })
            .attr('y', d => { return yScale(d[1]) })
            .attr('class', 'image')
            .style({ 'width': '17px', 'height': '17px' });         
      }
      console.log('what')
      // SET STATE FOR SVG TO USE LATER
      this.setState({
        png1: svg,
        png2: svg2
      })
    }
  }

  // SCROLL BAR CHANGE
  onChange(e) {
    e.preventDefault();
    this.setState({
      num1: e.target.value
    })
  }

  // BACKGROUND FOR THE BAR GRAPH
  addStatChoice() {
    const w = 550, 
          h = 300;
    if (this.state.gamesToSee === 1) {
      const svg = d3.select("#chart1")
              .append("svg:svg")
              .attr("width", w)
              .attr("height", h)
              .attr("id", "allStat1");
      if (this.state.gamesToSee === 1) {
        this.setState({
          selData1: svg
        })
      }
    }
    if (this.state.gamesToSee === 2) {
      const svg = d3.select("#chart2")
              .append("svg:svg")
              .attr("width", w)
              .attr("height", h)
              .attr("id", "allStat2");
      const svg2 = d3.select("#chart4")
              .append("svg:svg")
              .attr("width", w)
              .attr("height", h)
              .attr("id", "allStat4");
      this.setState({
        selData1: svg,
        selData2: svg2
      })
    }
  }

  // CHAMP BUILDS
  addItemVisuals() {
    const w = 304,
          h = 400;
    if (this.state.totalRenders === 1 && this.state.gamesToSee === 1) {
      const svg = d3.select("#builds1")
              .append("svg:svg")
              .attr("width", w)
              .attr("height", h)
              .attr("id", "allItems1");
      this.setState({
        addItems1: svg
      })
    }
    if (this.state.totalRenders === 2 && this.state.gamesToSee === 2) {
      const svg = d3.select("#builds2")
              .append("svg:svg")
              .attr("width", w)
              .attr("height", h)
              .attr("id", "allItems2");

      const svg2 = d3.select("#builds" + 2 * this.state.gamesToSee)
              .append("svg:svg")
              .attr("width", w)
              .attr("height", h)
              .attr("id", "allItems4");
      this.setState({
        addItems1: svg,
        addItems2: svg2
      })
    }
  }

  // USER SELECTION ON DROPDOWN MENU
  whichEventPick(eventPicked) {
    eventPicked.preventDefault();
    const eventSpecific1 = [];
    const eventSpecific2 = [];
    const searchEvents1 = this.state.allowScroll1;
    const searchEvents2 = this.state.allowScroll2;
    if (this.state.totalRenders === 1) {
      for (let i = 0; i < this.state.playerID1.length; i++) {
        let firstCount = 0;
        if (eventPicked.target.value === 'WARD_PLACED' || eventPicked.target.value === 'WARD_KILL') {
          for (let j = 0; j < searchEvents1.length; j++) {
            if (searchEvents1[j][0].events) {
              for (let k = 0; k < searchEvents1[j][0].events.length; k++) {
                if (searchEvents1[j][0].events[k].eventType === eventPicked.target.value && (searchEvents1[j][0].events[k].creatorId === this.state.playerID1[i][0] || searchEvents1[j][0].events[k].killerId === this.state.playerID1[i][0])) {
                  firstCount++;
                }
              }
            }
          }
        }
        if (eventPicked.target.value === 'killerId' || eventPicked.target.value === 'victimId' || eventPicked.target.value === 'assistingParticipantIds') {
          for (let j = 0; j < searchEvents1.length; j++) {
            if (searchEvents1[j][0].events) {
              for (let k = 0; k < searchEvents1[j][0].events.length; k++) {
                if (searchEvents1[j][0].events[k].eventType === 'CHAMPION_KILL') {
                  if (eventPicked.target.value === 'killerId' || eventPicked.target.value === 'victimId') {
                    if (searchEvents1[j][0].events[k][eventPicked.target.value] === this.state.playerID1[i][0]) {
                      firstCount++;
                    }
                  }
                  if (eventPicked.target.value === 'assistingParticipantIds' && searchEvents1[j][0].events[k][eventPicked.target.value]) {
                    for (let assists = 0; assists < searchEvents1[j][0].events[k][eventPicked.target.value].length; assists++) {
                      if (searchEvents1[j][0].events[k][eventPicked.target.value][assists] === this.state.playerID1[i][0]) {
                        firstCount++;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (eventPicked.target.value === 'minionsKilled') {
          if (searchEvents1[searchEvents1.length - 1][0].participantFrames) {
            firstCount = searchEvents1[searchEvents1.length - 1][0].participantFrames[i+1].minionsKilled + searchEvents1[searchEvents1.length - 1][0].participantFrames[i+1].jungleMinionsKilled
          }
        }
        if (eventPicked.target.value === 'totalGold') {
          if (searchEvents1[searchEvents1.length - 1][0].participantFrames) {
            firstCount = searchEvents1[searchEvents1.length - 1][0].participantFrames[i+1].totalGold;
          }
        }
        eventSpecific1.push(firstCount);
      }
      this.setState({
        eventSelected1: eventPicked.target.value,
        maxForStat1: Math.max(...eventSpecific1)
      })
    }

    // SECOND GAME
    if (this.state.totalRenders === 2) {
      for (let i = 0; i < this.state.playerID2.length; i++) {
        let secondCount = 0;
        if (eventPicked.target.value === 'WARD_PLACED' || eventPicked.target.value === 'WARD_KILL') {
          for (let j = 0; j < searchEvents2.length; j++) {
            if (searchEvents2[j][0].events) {
              for (let k = 0; k < searchEvents2[j][0].events.length; k++) {
                if (searchEvents2[j][0].events[k].eventType === eventPicked.target.value && (searchEvents2[j][0].events[k].creatorId === this.state.playerID2[i][0] || searchEvents2[j][0].events[k].killerId === this.state.playerID2[i][0])) {
                  secondCount++;
                }
              }
            }
          }
        }
        if (eventPicked.target.value === 'killerId' || eventPicked.target.value === 'victimId' || eventPicked.target.value === 'assistingParticipantIds') {
          for (let j = 0; j < searchEvents2.length; j++) {
            if (searchEvents2[j][0].events) {
              for (let k = 0; k < searchEvents2[j][0].events.length; k++) {
                if (searchEvents2[j][0].events[k].eventType === 'CHAMPION_KILL') {
                  if (eventPicked.target.value === 'killerId' || eventPicked.target.value === 'victimId') {
                    if (searchEvents2[j][0].events[k][eventPicked.target.value] === this.state.playerID2[i][0]) {
                      secondCount++;
                    }
                  }
                  if (eventPicked.target.value === 'assistingParticipantIds' && searchEvents2[j][0].events[k][eventPicked.target.value]) {
                    for (let assists = 0; assists < searchEvents2[j][0].events[k][eventPicked.target.value].length; assists++) {
                      if (searchEvents2[j][0].events[k][eventPicked.target.value][assists] === this.state.playerID2[i][0]) {
                        secondCount++;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (eventPicked.target.value === 'minionsKilled') {
          if (searchEvents2[searchEvents2.length - 1][0].participantFrames) {
            secondCount = searchEvents2[searchEvents2.length - 1][0].participantFrames[i+1].minionsKilled + searchEvents2[searchEvents2.length - 1][0].participantFrames[i+1].jungleMinionsKilled
          }
        }
        if (eventPicked.target.value === 'totalGold') {
          if (searchEvents2[searchEvents2.length - 1][0].participantFrames) {
            secondCount = searchEvents2[searchEvents2.length - 1][0].participantFrames[i+1].totalGold;
          }
        }
        eventSpecific1.push(secondCount);
      }
      this.setState({
        eventSelected2: eventPicked.target.value,
        maxForStat2: Math.max(...eventSpecific2)
      })
    }
  }

  numGamesSee(e) {
    e.preventDefault();
    this.state.gamesToSee = parseInt(e.target.value, 10);

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

          <GamesOnSR gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} res={this.state.res} onClick={this.handleClick.bind(this)} numGamesSee={this.numGamesSee.bind(this)} />
          <GameMap gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} />
          <TimeStamp gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} timeline1={this.state.allowScroll1} conversion={this.state.num1} timeline2={this.state.allowScroll2} />
          <DropDownMenu gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} scrollBar={this.state.scrollBar} whichEventPick={this.whichEventPick.bind(this)} />
          <EventDisplay gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} timeline1={this.state.allowScroll1} spot={this.state.num1} playerInfo1={this.state.playerID1} champImg1={this.state.champImg1} patch1={this.state.patch1} timeline2={this.state.allowScroll2} playerInfo2={this.state.playerID2} champImg2={this.state.champImg2} patch2={this.state.patch2} />
          <Chart gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} timeline1={this.state.allowScroll1} spot={this.state.num1} selData1={this.state.selData1} playerInfo1={this.state.playerID1} eventSelected1={this.state.eventSelected1} champName1={this.state.champImg1} maxForStat1={this.state.maxForStat1} timeline2={this.state.allowScroll2} selData2={this.state.selData2} playerInfo2={this.state.playerID2} eventSelected2={this.state.eventSelected2} champName2={this.state.champImg2} maxForStat2={this.state.maxForStat2} />
          <ChampBuild gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} timeline1={this.state.allowScroll1} spot={this.state.num1} playerInfo1={this.state.playerID1} champName1={this.state.champImg1} itemStorage1={this.state.itemStorage1} addItems1={this.state.addItems1} patch1={this.state.patch1} timeline2={this.state.allowScroll2} playerInfo2={this.state.playerID2} champName2={this.state.champImg2} itemStorage2={this.state.itemStorage2} addItems2={this.state.addItems2} patch2={this.state.patch2} />
          <ChampImage gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} timeline1={this.state.allowScroll1} playerInfo1={this.state.playerID1} png1={this.state.png1} champImg1={this.state.champImg1} spot={this.state.num1} patch1={this.state.patch1} timeline2={this.state.allowScroll2} playerInfo2={this.state.playerID2} png2={this.state.png2} champImg2={this.state.champImg2} patch2={this.state.patch2} />
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
          <GamesOnSR gamesToSee={this.state.gamesToSee} totalRenders={this.state.totalRenders} res={this.state.res} onClick={this.handleClick.bind(this)} numGamesSee={this.numGamesSee.bind(this)} />
          
        </div>
      )
    }
  }
}

module.exports=HeadApp;