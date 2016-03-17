import React from 'react';

class GameMap extends React.Component {
  render() {
    let arr = [];
    for (let i = 1; i <= this.props.gamesToSee; i++) {
      arr.push(i);
    }
    return (
      <div>
        { arr.map(i => {
            return ( <div id={"map" + i * this.props.gamesToSee} /> )
          })
        }
      </div> 
    )
  }
}

module.exports=GameMap;