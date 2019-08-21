import React from "react";
import PropTypes from "prop-types";

DropDownMenu.propTypes = {
  gamesToSee: PropTypes.number.isRequired,
  timeline1: PropTypes.array.isRequired,
  timeline2: PropTypes.array.isRequired,
  spot: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  eventSelected: PropTypes.func.isRequired,
  whichEventPick: PropTypes.func.isRequired,
};

export default function DropDownMenu(props) {
  const { gamesToSee, timeline1, timeline2, spot, onChange, eventSelected, whichEventPick } = props;

  const findMax = () => {
    if (gamesToSee === 1) {
      return timeline1.length - 1;
    }
    if (gamesToSee === 2) {
      return Math.max(timeline1.length, timeline2.length) - 1;
    }
  };;

  return (
    <div id={"scrollAndSelect" + gamesToSee}>
      <input
        id={"scroll" + gamesToSee}
        type="range"
        style={{ width: "370px" }}
        min="0"
        max={findMax()}
        step="1"
        value={spot}
        defaultValue="0"
        onChange={onChange}
      ></input>
      <select
        value={eventSelected}
        defaultValue="select one"
        onLoad={whichEventPick}
        onChange={whichEventPick}
        id={"selections" + gamesToSee}
      >
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
  );
}
