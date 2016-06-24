import React from 'react';

class TimeStamp extends React.Component {
  // CONVERTING MILLISECONDS TO HH:MM:SS:MS
  swap() {
    let convert = this.props.conversion;

    if (this.props.timeline1 && this.props.gamesToSee === 1 && this.props.conversion.length) {
      convert = this.props.timeline1[this.props.conversion][0].timestamp;
    }

    if (this.props.timeline2 && this.props.gamesToSee === 2 && this.props.conversion.length) {
      if (this.props.timeline1.length > this.props.timeline2.length) {
      	convert = this.props.timeline1[this.props.conversion][0].timestamp;
      }
      else {
        convert = this.props.timeline2[this.props.conversion][0].timestamp;
      }
    }
  
    let milliseconds = parseInt(convert % 1000),
        seconds = parseInt((convert / 1000) % 60),
        minutes = parseInt((convert / (1000 * 60)) % 60),
        hours = parseInt((convert / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  render() {
  	const callSwap = this.swap();
    return (
      <div id={"time" + this.props.gamesToSee}>
        {callSwap}
      </div>
    )
  }
};

module.exports = TimeStamp;