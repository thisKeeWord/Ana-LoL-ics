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
    

class Display extends React.Component {
 

  // the setup of the intial data!!!
  // AFTER INITIAL RENDERING
  handle() {
    let allInfoScroll = [],
        allInfoPlayerID = [],
        allInfoPos = [],
        allInfoChampImg = {};

    console.log(this.props)    
    if (localStorage) {
      console.log(localStorage)
    }
    let that = this,
        count = -1,
        total = 0;

    // REQUEST TO GRAB ALL ITEMS
    request("http://ddragon.leagueoflegends.com/cdn/6.2.1/data/en_US/item.json", (err, data) => {
      if (err) return console.error(err);
      let res = JSON.parse(data.body).data;
      
      // FIRST REQUEST TO FILE
      request('http://localhost:3000/demoData.html', (error, newData) => {
        if (error) return console.error(error);
        let info = JSON.parse(newData.body);  
        
        // GOING FOR THE TIMELINE INFORMATION
        for (let j = 0; j < info.timeline.frames.length; j++) {
          allInfoScroll.push([info.timeline.frames[j]]);
        }  

        // HAVE TO USE NUMBER FOR NUMERATOR SINCE SCROLL NOT UP YET
        let stepScroll = 300 / allInfoScroll.length;

        // NUMBER OF PARTICIPANTS FOR A GAME: ASYNC, BUT PARALLEL
        async.each(info.participants, (i, next) => {

          let pId = i.participantId;
          let cId = i.championId;

          // PARTICIPANT-ID AND CHAMPION-ID
          allInfoPlayerID.push([pId, cId]);

          // GETTING CHAMPION NUMERICAL KEY TO GRAB IMAGE
          $.get(url + cId + '?' + stuff.stuff, champData => {
            let stuffs = champData.key;
            count++;

            // HAD TO DO THIS WAY SINCE IMAGES RETURN AT RANDOM
            allInfoChampImg[cId] = champData.key;
            allInfoPos.push([ info.timeline.frames[0].participantFrames[allInfoPlayerID[count][0]].position.x, info.timeline.frames[0].participantFrames[allInfoPlayerID[count][0]].position.y ]);

            // WAIT FOR ALL THE IMAGES TO RETURN AND GET PUSHED TO allInfoCHAMPIMG ARRAY
            if (champData[allInfoPlayerID[total][1].key] !== null && Object.keys(allInfoChampImg).length === 10) {
              
                // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
                // return (this.props.update(allInfoScroll, allInfoPlayerID, allInfoPos, allInfoChampImg, info, res),

                // WHATEVER IS CALLED FIRST IS NOT BEING RENDERED
                this.props.move(),
                this.props.addStatChoice(),
                this.props.move(),
                this.props.addItemVisuals();
                next(this.props.update(allInfoScroll, allInfoPlayerID, allInfoPos, allInfoChampImg, info, res));
            }
          })
        })
      })
    })

  }
 
  // GAME MAP
  

  render() {
    // if (this.state.toggle === false) {
    //   return (
    //     <div id="form">
    //       <form id="formSubmit" onSubmit={this.handleSubmit.bind(this)}>
    //         <input type="text" name="userName" ref="userName" placeholder="enter username"required />
    //       </form>
    //     </div>
    //   )
    // }
    let result = this.handle();
    debugger;
      if (!result) {
        return (
          <div />
        )
      }
    // if (this.state.toggle === true) {
      return (
        <div id="parent">
          {this.props.allInfo.scrollBar}

          <select defaultValue='A' onLoad={this.props.allInfo.whichEventPick.bind(this)} onChange={this.props.allInfo.whichEventPick.bind(this)} id="selections" >
            <option value="WARD_PLACED">wards placed</option>
            <option value="WARD_KILL">wards killed</option>
            <option value='A'>A</option>
            <option value='Fruit'>Fruit</option>
          </select>

          <TimeStamp timeline={this.props.allInfo.allowScroll} conversion={this.props.allInfo.num} />
          <EventDisplay timeline={this.props.allInfo.allowScroll} spot={this.props.allInfo.num} playerInfo={this.props.allInfo.playerID} champImg={this.props.allInfo.champImg} />
          <Chart timeline={this.props.allInfo.allowScroll} spot={this.props.allInfo.num} selData={this.props.allInfo.selData} playerInfo={this.props.allInfo.playerID} eventSelected={this.props.allInfo.eventSelected} champName={this.props.allInfo.champImg} />
          <ChampBuild timeline={this.props.allInfo.allowScroll} spot={this.props.allInfo.num} playerInfo={this.props.allInfo.playerID} champName={this.props.allInfo.champImg} itemStorage={this.props.allInfo.itemStorage} addItems={this.props.allInfo.addItems}  />
          <ChampImage timeline={this.props.allInfo.allowScroll} playerInfo={this.props.allInfo.playerID} png={this.props.allInfo.png} champImg={this.props.allInfo.champImg} spot={this.props.allInfo.num} />

          <div id="map" ref="map" />

        </div>
      )
    // })
  }
}

module.exports=Display;