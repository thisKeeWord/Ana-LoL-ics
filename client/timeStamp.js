import React from 'react';

class TimeStamp extends React.Component {
  // CONVERTING MILLISECONDS TO HH:MM:SS:MS
  swap() {
    let convert = this.props.conversion;

    if (this.props.timeline.length) {
    	convert = this.props.timeline[this.props.conversion][0].timestamp;
    }
  
    let milliseconds = parseInt(convert % 1000),
        seconds = parseInt((convert / 1000) % 60),
        minutes = parseInt((convert / (1000 * 60)) % 60),
        hours = parseInt((convert / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

  render() {
  	let callSwap = this.swap();
    return (
      <div id="time">
        {callSwap}
      </div>
    )
  }
};

module.exports = TimeStamp;