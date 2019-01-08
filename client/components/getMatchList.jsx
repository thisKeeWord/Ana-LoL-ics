import React from 'react';


class MatchList extends React.Component {
  handleSubmit(e) {
    this.props.submitUserForm(e);
  }

  updateRegion(e) {
    this.props.updateUserRegion(e);
  }

  render() {
    return (
      <form id="formSubmit" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" className="inGameName" ref="userName" placeholder="enter summoner name" required />
        <select value={this.props.region} defaultValue='select one' onChange={this.updateRegion.bind(this)} id="regions">
          <option value="BR1">Brazil</option>
          <option value="EUN1">Europe Nordic & East</option>
          <option value="EUW1">Europe West</option>
          <option value="JP1">Japan</option>
          <option value="KR">Korea</option>
          <option value="LA1">Latin America North</option>
          <option value="LA2">Latin America South</option>
          <option value="NA1">North America</option>
          <option value="OC1">Oceania</option>
          <option value="RU">Russia</option>
          <option value="TR1">Turkey</option>
        </select>
        <button type="submit" id="findStats" val>Find Stats</button>
      </form>
    )
  }
}

module.exports = MatchList;


