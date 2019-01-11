import React from 'react';

class UserInformationForm extends React.Component {
  handleSubmitInfo(e) {
    e.preventDefault();
    this.props.userInfoSubmit(ReactDOM.findDOMNode(this.refs.userName).value);
  }

  render() {
    return (
      <div class="userInfoForm">
        <form id="getSummonersGames" onSubmit={this.handleSubmitInfo.bind(this)}>
          <input type="text" className="userName" ref="userName" placeholder="enter summoner name" required />
        </form>

        <select value={that.state.region} defaultValue='select one' onChange={that.updateRegion.bind(that)} id={"regions" + this.state.gamesToSee}>
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
      </div>
    )
  }
}

module.exports = UserInformationForm;


  