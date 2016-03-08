import React from 'react';

class DropDownMenu extends React.Component {
  onLoad(eventPicked) {
    this.props.whichEventPick(eventPicked);
  }

  onChange(e) {
    this.props.whichEventPick(e);
  }


  render() {
    return (
      <div id="scrollAndSelect">
        {this.props.scrollBar}
        <select defaultValue='select one' onLoad={this.onLoad.bind(this)} onChange={this.onChange.bind(this)} id="selections" >
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