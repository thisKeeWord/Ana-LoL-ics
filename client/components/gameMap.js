import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

GameMap.propTypes = {
  gamesToSee: PropTypes.number.isRequired,
};

export default function GameMap(props) {
  if (props.gamesToSee === 1) {
    return <div id={`map${1 * props.gamesToSee}`} />;
  }

  return (
    <div>
      {_.range(2).map((i) => {
        return <div id={`map${i * props.gamesToSee}`} key={i} />;
      })}
    </div>
  );
}
