import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';


class SeasonStats extends React.Component {
  render() {
    return (
      <div className="getChamps">
        <div id="backHome">
          <ul className="linkToPages">
            <li className="goHome"><Link to="/">Home</Link></li>
            <li className="goAbout"><Link to="/about">About</Link></li>
          </ul>
        </div>
        <DbResults />
      </div>
    );
  }
}

class OutForm extends React.Component {
  post(data) {
    return $.ajax({
      type: 'POST',
      url: '/season_stats',
      data: JSON.stringify(data),
      contentType: 'application/json'
    });
  }

  handle(e) {
    e.preventDefault();
    let that = this;
    let inGameName = ReactDOM.findDOMNode(this.refs.userName).value;
    let data = {
      champion: ReactDOM.findDOMNode(this.refs.champion).value.toLowerCase().replace(/\s/g,''),
      season: ReactDOM.findDOMNode(this.refs.season).value
    };

    const cleanName = inGameName.toLowerCase().replace(/ /g, '');
    if (localStorage && localStorage[cleanName]) {
      data.username = { userName: localStorage[cleanName] };
      data.region = { region: that.props.region };
      this.post(data).done(gotTheInfo => {
        console.log('success')
      })
    }

    // IF DATA ISN'T IN LOCAL STORAGE
    if (localStorage && !localStorage[cleanName]) {
      data.username = { userName: cleanName };
      data.region = { region: that.props.region };
      this.post(data).done(gotTheInfo => {
        console.log('i got the info', gotTheInfo);
        localStorage[cleanName] = gotTheInfo[0];
      })
    }
    
    this.post(data).done(res => {
      console.log(res[1], 'res')
      that.props.update(res[1]);
    });
  }

  updatingRegion(e) {
    e.preventDefault();
    this.props.regionSelect(e);
  }

  render() {
    let that = this;
    return (
      <div>
        <form id="league-form" onSubmit={this.handle.bind(that)}>

          IGN: <input type="text" name="userName" ref="userName" required /><br />
          Champion name: <input type="text" name="champion" ref="champion" required />&nbsp;&nbsp;&nbsp;&nbsp;
          Season: <input type="text" name="season" ref="season" placeholder="enter 2017 not 7" onkeypress='return event.charCode >= 48 && event.charCode <= 57' required />
          <input type="submit" className="hidden" />
        </form>
        <select value={that.props.region} defaultValue='select one' onChange={that.updatingRegion.bind(that)} id="regions1">
          <option value="BR">Brazil</option>
          <option value="EUNE">Europe Nordic & East</option>
          <option value="EUW">Europe West</option>
          <option value="JP">Japan</option>
          <option value="KR">Korea</option>
          <option value="LAN">Latin America North</option>
          <option value="LAS">Latin America South</option>
          <option value="NA">North America</option>
          <option value="OCE">Oceania</option>
          <option value="RU">Russia</option>
          <option value="TR">Turkey</option>
        </select>
      </div>
    );
  }
}


class DbResults extends React.Component {
  constructor() {
    super();
    this.state = {
      champData: {},
      region: '' 
    };
  }

  updateRegion(e) {
    e.preventDefault();
    this.setState({ region: e.target.value });
  }

  append(data) {
    // let cData = this.state.champData;
    this.setState({ champData: data });
  }

  getData() {
    let that = this;
    $.get('/season_stats').done(function(data) {
      that.setState({ champData: data })
    });
  }

  componentWillMount() {
    this.getData();
  }

  render() {
    return (
      <ul className="list-group" id="champInfo">
        <ResToDisp data={this.state.champData} />
        <OutForm update={this.append.bind(this)} regionSelect={this.updateRegion.bind(this)} region={this.state.region} />
      </ul>
    );
  }
}

class ResToDisp extends React.Component {
  render() {
    return (
      <li className="list-group-item" id="RtoD">
        <div id="header">
          <p className="statForChamp">IGN: {this.props.data.userName}</p><br />
          <p className="statForChamp">champion: {this.props.data.champion}</p>
        </div>
        <p className="statForChamp">champion ID: {this.props.data.championId}</p>
        <p className="statForChamp">season: {this.props.data.season}</p>
        <p className="statForChamp">total Sessions Played: {this.props.data.totalSessionsPlayed}</p>
        <p className="statForChamp">total Damage Taken: {this.props.data.totalDamageTaken}</p>
        <p className="statForChamp">total Quadra Kills: {this.props.data.totalQuadraKills}</p>
        <p className="statForChamp">total Triple Kills: {this.props.data.totalTripleKills}</p>
        <p className="statForChamp">total Minion Kills: {this.props.data.totalMinionKills}</p>
        <p className="statForChamp">max Champions Killed: {this.props.data.maxChampionsKilled}</p>
        <p className="statForChamp">total Double Kills: {this.props.data.totalDoubleKills}</p>
        <p className="statForChamp">total Physical Damage Dealt: {this.props.data.totalPhysicalDamageDealt}</p>
        <p className="statForChamp">total Champion Kills: {this.props.data.totalChampionKills}</p>
        <p className="statForChamp">total Assists: {this.props.data.totalAssists}</p>
        <p className="statForChamp">most Champion Kills Per Session: {this.props.data.mostChampionKillsPerSession}</p>
        <p className="statForChamp">total Damage Dealt: {this.props.data.totalDamageDealt}</p>
        <p className="statForChamp">total First Blood: {this.props.data.totalFirstBlood}</p>
        <p className="statForChamp">total Sessions Lost: {this.props.data.totalSessionsLost}</p>
        <p className="statForChamp">total Sessions Won: {this.props.data.totalSessionsWon}</p>
        <p className="statForChamp">total Magic Damage Dealt: {this.props.data.totalMagicDamageDealt}</p>
        <p className="statForChamp">total Gold Earned: {this.props.data.totalGoldEarned}</p>
        <p className="statForChamp">total Penta Kills: {this.props.data.totalPentaKills}</p>
        <p className="statForChamp">total Turrets Killed: {this.props.data.totalTurretsKilled}</p>
        <p className="statForChamp">most Spells Cast: {this.props.data.mostSpellsCast}</p>
        <p className="statForChamp">max Num Deaths: {this.props.data.maxNumDeaths}</p>
        <p className="statForChamp">total Unreal Kills: {this.props.data.totalUnrealKills}</p>
      </li>
    );
  }
}

module.exports = SeasonStats;