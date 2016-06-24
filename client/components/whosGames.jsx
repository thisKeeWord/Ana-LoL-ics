import React from 'react';

class WhosGames extends React.Component {
  render() {
    return (
      <div id="whichSummoner">
        {this.props.summonersName}'s Games

      </div>
    )
  }
}

module.exports=WhosGames;