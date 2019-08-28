import React from "react";
import PropTypes from "prop-types";

GameMap.propTypes = {
  gamesToSee: PropTypes.number.isRequired,
};

export default function GameMap(props) {
  if (props.gamesToSee === 1) {
    return <div id={`map${1 * props.gamesToSee}`} />;
  }

  return (
    <div>
      {[1, 2].map((i) => {
        return <div id={`map${i * props.gamesToSee}`} key={i} />;
      })}
    </div>
  );
}
