import React from 'react';

class DropDownMenu extends React.Component {
  onLoad(eventPicked) {
    this.props.whichEventPick(eventPicked);
  }

  onChange(e) {
    this.props.whichEventPick(e);
  }

  onAnotherChange(e) {
    this.props.onChange(e);
  }

  findMax() {
    if (this.props.gamesToSee === 1) {
      return this.props.timeline1.length - 1;
    }
    if (this.props.gamesToSee === 2) {
      return Math.max(this.props.timeline1.length, this.props.timeline2.length) - 1;
    }
  }

  render() {
    return (
      <div id={"scrollAndSelect" + this.props.gamesToSee}>
          <input id={"scroll" + this.props.gamesToSee} type='range' style={{ width: '370px'}} min='0' max={this.findMax()} step='1' value={this.props.spot} defaultValue='0' onChange={this.onAnotherChange.bind(this)}></input>
        <select value={this.props.eventSelected} defaultValue='select one' onLoad={this.onLoad.bind(this)} onChange={this.onChange.bind(this)} id={"selections" + this.props.gamesToSee}>
          <option value="select one">select one</option>
          <option value="WARD_PLACED">wards placed</option>
          <option value="WARD_KILL">wards killed</option>
          <option value="minionsKilled">total minions killed</option>
          <option value="totalGold">total gold earned</option>
          <option value="killerId">kills</option>
          <option value="victimId">deaths</option>
          <option value="assistingParticipantIds">assists</option>
        </select>
      </div>
    )
  }
}

module.exports=DropDownMenu;