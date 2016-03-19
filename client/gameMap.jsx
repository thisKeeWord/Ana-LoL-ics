import React from 'react';

class GameMap extends React.Component {
  render() {
    if (this.props.gamesToSee === 1) {
      console.log('chose 2 doe')
      return (
        <div id={"map" + 1 * this.props.gamesToSee} />
      )
    }

    if (this.props.gamesToSee === 2) {
      return (
        <div>
        <div id={"map" + 1 * this.props.gamesToSee} />

        <div id={"map" + 2 * this.props.gamesToSee} />
        </div>
      )
    }
  }
}

module.exports=GameMap;