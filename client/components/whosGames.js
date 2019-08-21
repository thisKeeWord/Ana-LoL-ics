import React from "react";
import PropTypes from "prop-types";

WhosGames.propTypes = {
  summonersName: PropTypes.string.isRequired,
};

export default function WhosGames(props) {
  return <div id="whichSummoner">{props.summonersName} Games</div>;
}
