import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class UserInformationForm extends Component {
  static propTypes = {
    submitUserForm: PropTypes.func,
    updateUserRegion: PropTypes.func,
    gamesToSee: PropTypes.number,
  };

  handleSubmitInfo(e) {
    e.preventDefault();
    console.log(e.target);;
    this.props.submitUserForm(e, ReactDOM.findDOMNode(this.refs.userName).value);
  }

  updateRegion(elem) {
    elem.preventDefault();
    this.props.updateUserRegion(elem);
  }

  render() {
    const that = this;

    return (
      <div className="userInfoForm">
        <form id="getSummonersGames" onSubmit={this.handleSubmitInfo.bind(this)}>
          <input
            type="text"
            className="userName"
            ref="userName"
            placeholder="enter summoner name"
            required
          />
        </form>

        <select
          value={that.props.region}
          defaultValue="select one"
          onChange={that.updateRegion.bind(that)}
          id={"regions" + this.props.gamesToSee}
        >
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
    );
  }
}
