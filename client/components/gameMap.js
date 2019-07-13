import React from "react";

class GameMap extends React.Component {
  render() {
    if (this.props.gamesToSee === 1) {
      return <div id={"map" + 1 * this.props.gamesToSee} />;
    }

    if (this.props.gamesToSee === 2) {
      let gameMapArr = [1, 2];
      return (
        <div>
          {gameMapArr.map(i => {
            return <div id={"map" + i * this.props.gamesToSee} key={i} />;
          })}
        </div>
      );
    }
  }
}

module.exports = GameMap;
