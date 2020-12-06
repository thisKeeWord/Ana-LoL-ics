import React from "react";
import PropTypes from "prop-types";

TimeStamp.propTypes = {
  gamesToSee: PropTypes.number.isRequired,
  conversion: PropTypes.array.isRequired,
  timeline1: PropTypes.array.isRequired,
  timeline2: PropTypes.array.isRequired,
};

export default function TimeStamp(props) {
  const { timeline1, timeline2, gamesToSee, conversion } = props;
  // CONVERTING MILLISECONDS TO HH:MM:SS:MS
  let convert = conversion;

  if (timeline1 && gamesToSee === 1 && conversion.length) {
    convert = timeline1[conversion][0].timestamp;
  }

  if (timeline2 && gamesToSee === 2 && conversion.length) {
    if (timeline1.length > timeline2.length) {
      convert = timeline1[conversion][0].timestamp;
    } else {
      convert = timeline2[conversion][0].timestamp;
    }
  }

  const milliseconds = parseInt(convert % 1000);
  let seconds = parseInt((convert / 1000) % 60);
  let minutes = parseInt((convert / (1000 * 60)) % 60);
  let hours = parseInt((convert / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return (
    <div id={`time${gamesToSee}`}>
      {hours} : {minutes} : {seconds} : {milliseconds}
    </div>
  );
}
