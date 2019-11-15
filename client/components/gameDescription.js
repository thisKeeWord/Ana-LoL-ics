import React from "react";
import PropTypes from "prop-types";

GameDescription.propTypes = {
  gameSumm: PropTypes.array.isRequired,
  gamesToSee: PropTypes.number.isRequired,
};

class GameDescription extends React.Component {
  getGameDescription() {
    const tables = [],
      breakDown = ["LANE", "REGION", "GAME TYPE", "ROLE"];
    for (let i = 0; i < this.props.gameSumm.length; i++) {
      const infoByGame = this.props.gameSumm[i][1].split("break"),
        rows = [];
      for (let j = 0; j < infoByGame.length; j++) {
        const subData = infoByGame[j],
          categories = breakDown[j];
        rows.push(
          <tr
            key={i + j + this.props.gameSumm[i][0]}
            id={"data" + i + j + this.props.gameSumm[i][0]}
          >
            <th className="textInfo" key={subData + "th"} id={subData}>
              {categories}
            </th>
            <td className="textInfo" key={subData + "td"} id={subData}>
              {subData}
            </td>
          </tr>
        );
      }
      tables.push(
        <table id={"simple-board" + i + this.props.gamesToSee}>
          <tbody>{rows}</tbody>
        </table>
      );
    }

    return tables;
  }

  render() {
    if (this.props.gameSumm) {
      const gameInfo = this.getGameDescription();

      return (
        <div className="table" id={"gameDescription" + this.props.gamesToSee}>
          {gameInfo}
        </div>
      );
    } else {
      return <div className="gameDesc" />;
    }
  }
}

module.exports = GameDescription;
