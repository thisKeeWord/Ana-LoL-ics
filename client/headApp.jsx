import React from 'react';
import ReactDOM from 'react-dom';
import request from 'request';
import stuff from './../stuff.js';
import Display from './app.jsx';
import $ from 'jquery';
let summonerUrl = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";


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
      toggle: false
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
    //     for (let key in userId) {
          // localStorage[newCleanName] = res;
    //     }
    //     that.setState({
    //       userId: localStorage[newCleanName],
    //       toggle: true
    //     })
    //   // })
    // }
      // })
    // }
    if (localStorage && localStorage[newCleanName.username.userName]) {
      console.log('sup')
      newCleanName.url = { url: '/found' };
      console.log(Number(localStorage[newCleanName.username.userName]))
      newCleanName.username = { userName: localStorage[newCleanName.username.userName] };
      this.post(newCleanName).done(res => {
        console.log('yosupdawg')
        console.log(res)
        // for (let count = 0; count < res.length; count++) {
        //   localStorage[]
        // }
        that.setState({
          res: res,
          toggle: true
        })
      })
    }
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
    this.state.png = svg;
  }

  onChange(e) {
    e.preventDefault();
    // this.setState({
    //   num: e.target.value
    // })
    this.state.num = e.target.value;
  }

  // BACKGROUND FOR THE BAR GRAPH
  addStatChoice() {
    // debugger
    let w = 500, 
        h = 400,
        svg = d3.select("#YO")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("id", "allStat");
    // this.setState({
    //   selData: svg
    // })
    this.state.selData = svg;
  }

  // CHAMP BUILDS
  addItemVisuals() {
    let w = 250,
        h = 600,
        svg = d3.select("#kudos")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("id", "allItems");
    // this.setState({
    //   addItems: svg
    // })
    this.state.addItems = svg;
  }

  // USER SELECTION ON DROPDOWN MENU
  whichEventPick(eventPicked) {
    eventPicked.preventDefault();
    // this.setState({
    //   eventSelected: eventPicked.target.value
    // })
    this.state.eventSelected = eventPicked.target.value;

  }

  update(allInfoPos, allInfoChampImg, allInfoPlayerID, allInfoScroll, info, res) {
    this.state.pos = allInfoPos;
    this.state.champImg = allInfoChampImg;
    this.state.playerID = allInfoPlayerID;
    this.state.allowScroll = allInfoScroll;
    this.state.result = info;
    this.state.itemStorage = res;
    this.state.scrollBar = (<input id="scroll" type='range' style={{ width: '300px'}} min='0' max={this.state.allowScroll.length - 1} step='1' defaultValue='0' onChange={this.onChange.bind(this)}></input>);
    // this.state.toggle = true;
  }

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
    if (this.state.toggle === true) {
      
      return (
        <div id="listOMatches">
          { this.state.res.map(matchList => {
              return (
                <div>
                  <button id="selectMatch" value={matchList[0]}>
                    <img src={matchList[1]} width={28} height={28} />
                    {matchList[2]}
                  </button>
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