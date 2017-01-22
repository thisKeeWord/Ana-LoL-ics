import React from 'react';

class SeasonStats extends React.Component {
  render() {
    return (
      <div className="getChamps">
        <DbResults />
      </div>
    );
  }
}

class OutForm extends React.Component {
  post(data) {
    return $.ajax({
      type: 'POST',
      url: '/',
      data: JSON.stringify(data),
      contentType: 'application/json'
    })
  }

  handle(e) {
    e.preventDefault();
    var data = {
      userName: React.findDOMNode(this.refs.userName).value,
      champion: React.findDOMNode(this.refs.champion).value,
      season: React.findDOMNode(this.refs.season).value
    };
    var that = this;
    this.post(data).done(res => {
      that.props.update(res);
    });
  }

  render() {
    return (
      <form id="league-form" onSubmit={this.handle}>
        IGN: <input type="text" name="userName" ref="userName" required /><br />
        Champion name: <input type="text" name="champion" ref="champion" required />&nbsp;&nbsp;&nbsp;&nbsp;
        Season: <input type="text" name="season" ref="season" required />
        <input type="submit" className="hidden" />
      </form>
    );
  }
}


class DbResults extends= React.Component {
  constructor() {
    this.state = {
      champData: {} 
    };
  }

  append(data) {
    console.log(data, 'aata')
    var cData = this.state.champData;
    this.setState({ champData: data });
  }

  getData() {
    var that = this;
    $.get('/').done(function(data) {
      console.log('this', that)
      that.setState({ champData: data })
    });
  }

  componentWillMount() {
    this.getData();
  }

  render() {
    console.log('champData', this.state.champData)
    return (
      <ul className="list-group" id="champInfo">
        <ResToDisp data={this.state.champData} />
        <OutForm update={this.append} />
      </ul>
    );
  }
}

class ResToDisp extends React.Component {
  render() {
    return (
      <li className="list-group-item" id="RtoD">
        <div id="header">
          <p>IGN: {this.props.data.userName}</p><br />
          <p>champion: {this.props.data.champion}</p>
        </div>
        <p>champion ID: {this.props.data.championId}</p>
        <p>season: {this.props.data.season}</p>
        <p>total Sessions Played: {this.props.data.totalSessionsPlayed}</p>
        <p>total Damage Taken: {this.props.data.totalDamageTaken}</p>
        <p>total Quadra Kills: {this.props.data.totalQuadraKills}</p>
        <p>total Triple Kills: {this.props.data.totalTripleKills}</p>
        <p>total Minion Kills: {this.props.data.totalMinionKills}</p>
        <p>max Champions Killed: {this.props.data.maxChampionsKilled}</p>
        <p>total Double Kills: {this.props.data.totalDoubleKills}</p>
        <p>total Physical Damage Dealt: {this.props.data.totalPhysicalDamageDealt}</p>
        <p>total Champion Kills: {this.props.data.totalChampionKills}</p>
        <p>total Assists: {this.props.data.totalAssists}</p>
        <p>most Champion Kills Per Session: {this.props.data.mostChampionKillsPerSession}</p>
        <p>total Damage Dealt: {this.props.data.totalDamageDealt}</p>
        <p>total First Blood: {this.props.data.totalFirstBlood}</p>
        <p>total Sessions Lost: {this.props.data.totalSessionsLost}</p>
        <p>total Sessions Won: {this.props.data.totalSessionsWon}</p>
        <p>total Magic Damage Dealt: {this.props.data.totalMagicDamageDealt}</p>
        <p>total Gold Earned: {this.props.data.totalGoldEarned}</p>
        <p>total Penta Kills: {this.props.data.totalPentaKills}</p>
        <p>total Turrets Killed: {this.props.data.totalTurretsKilled}</p>
        <p>most Spells Cast: {this.props.data.mostSpellsCast}</p>
        <p>max Num Deaths: {this.props.data.maxNumDeaths}</p>
        <p>total Unreal Kills: {this.props.data.totalUnrealKills}</p>
      </li>
    );
  }
}

module.exports = SeasonStats;