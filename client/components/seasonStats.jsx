import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import $ from 'jquery';


class SeasonStats extends React.Component {
  render() {
    let whichBackground = ["LeeSin_4", "Braum_2", "Lulu_3", "Blitzcrank_5", "Gragas_4", "Jinx_1", "Yasuo_2", "Bard_0", "Poppy_5", "MonkeyKing_5", "Chogath_6", "Anivia_5"];
    return (
      <div id="getSeasonStats" style= {{ backgroundImage: "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + whichBackground[Math.floor(Math.random() * whichBackground.length)] + ".jpg)" }}>
        <p id="ranked">Ranked Stats</p>
        <div id="backHome">
          <ul className="linkToPages">
            <li className="goHome"><Link to="/">Home</Link></li>
            <li className="goAboutPage"><Link to="/about">About</Link></li>
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
      url: '/season-stats',
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
        console.log('success');
      })
    }

    // IF DATA ISN'T IN LOCAL STORAGE
    if (localStorage && !localStorage[cleanName]) {
      data.username = { userName: cleanName };
      data.region = { region: that.props.region };
      this.post(data).done(gotTheInfo => {
        localStorage[cleanName] = gotTheInfo[0];
      })
    }
    
    this.post(data).done(res => {
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
      <div id="seasonSpecifics">
        <form id="league-form" onSubmit={this.handle.bind(that)}>
          <div className="ign">
            Summoner name: <input type="text" name="userName" ref="userName" required /><br />
          </div>
          <div className="championsName">
            Champion name: <input type="text" name="champion" ref="champion" required />
          </div>
          <div className="seasonNumber">
            Season: <input type="text" name="season" ref="season" placeholder="ex: input 2017 not 7" onkeypress='return event.charCode >= 48 && event.charCode <= 57' required />
          </div>
          <div id="regionInSeason">
            <select value={that.props.region} defaultValue='select one' onChange={that.updatingRegion.bind(that)}>
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
          <input type="submit" className="seasonSearch" />
        </form>
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
    this.setState({ champData: data });
  }

  getData() {
    let that = this;
    $.get('/season-stats').done(function(data) {
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
          <p className="statForChamp">
            <span className="seasonalData">IGN: </span>{this.props.data.userName}</p><br />
          <p className="statForChamp">
            <span className="seasonalData">champion: </span>{this.props.data.champion}</p>
        </div>
        <p className="statForChamp">
          <span className="seasonalData">champion ID: </span>{this.props.data.championId}</p>
        <p className="statForChamp">
          <span className="seasonalData">season: </span>{this.props.data.season}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Sessions Played: </span> {this.props.data.totalSessionsPlayed}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Damage Taken: </span>{this.props.data.totalDamageTaken}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Quadra Kills: </span>{this.props.data.totalQuadraKills}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Triple Kills: </span>{this.props.data.totalTripleKills}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Minion Kills: </span>{this.props.data.totalMinionKills}</p>
        <p className="statForChamp">
          <span className="seasonalData">max Champions Killed: </span>{this.props.data.maxChampionsKilled}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Double Kills: </span>{this.props.data.totalDoubleKills}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Physical Damage Dealt: </span>{this.props.data.totalPhysicalDamageDealt}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Champion Kills:</span>{this.props.data.totalChampionKills}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Assists: </span>{this.props.data.totalAssists}</p>
        <p className="statForChamp">
          <span className="seasonalData">most Champion Kills Per Session: </span>{this.props.data.mostChampionKillsPerSession}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Damage Dealt: </span>{this.props.data.totalDamageDealt}</p>
        <p className="statForChamp">
          <span className="seasonalData">total First Blood: </span>{this.props.data.totalFirstBlood}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Sessions Lost:</span> {this.props.data.totalSessionsLost}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Sessions Won: </span>{this.props.data.totalSessionsWon}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Magic Damage Dealt: </span>{this.props.data.totalMagicDamageDealt}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Gold Earned: </span>{this.props.data.totalGoldEarned}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Penta Kills: </span>{this.props.data.totalPentaKills}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Turrets Killed</span>: {this.props.data.totalTurretsKilled}</p>
        <p className="statForChamp">
          <span className="seasonalData">most Spells Cast: </span>{this.props.data.mostSpellsCast}</p>
        <p className="statForChamp">
          <span className="seasonalData">max Num Deaths: </span>{this.props.data.maxNumDeaths}</p>
        <p className="statForChamp">
          <span className="seasonalData">total Unreal Kills: </span>{this.props.data.totalUnrealKills}</p>
      </li>
    );
  }
}

module.exports = SeasonStats;