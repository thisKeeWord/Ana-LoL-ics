var React = require('react');
var ReactDOM = require('react-dom');

var TimeStamp = React.createClass({
  swap: function() {
    // CONVERTING MILLISECONDS TO HH:MM:SS:MS
    var convert = this.props.conversion;

    if (this.props.timeline.length) {
      for (var i in  this.props.timeline[this.props.conversion]) {
        var convert = this.props.timeline[this.props.conversion][i].timestamp
      }
    }
  
    var milliseconds = parseInt(convert % 1000),
        seconds = parseInt((convert / 1000) % 60),
        minutes = parseInt((convert / (1000 * 60)) % 60),
        hours = parseInt((convert / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  },

  render: function() {
    return (
      <div id="time">
        {this.swap()}
      </div>
    )
  }
});

module.exports = TimeStamp;