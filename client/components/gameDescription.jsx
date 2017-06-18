import React from 'react';


class GameDescription extends React.Component {
  getGameDescription() {
    let rows = [], breakDown = ["LANE", "REGION", "GAME TYPE", "ROLE"];
    for (let i = 0; i < this.props.gameSumm.length; i++) {
      let infoByGame = this.props.gameSumm[i][1].split('break');
      for (let j = 0; j < infoByGame.length; j++) {
        let description = [],
        subData = infoByGame[j],
        categories = breakDown[j];
        description.push(<td key={subData} id={subData}>{categories} {subData}</td>)
        rows.push(<tr key={i + j + this.props.gameSumm[i][0]} id={"data" + i + j + this.props.gameSumm[i][0]}>{description}</tr>);
      }
    }
    return rows;
  }

  render() {
    if (this.props.gameSumm) {
      let gameInfo = this.getGameDescription();
            // </div>
            // <div className="col s2 board">

      return (
        <div className="table" id="gameDescription">
          <table id="simple-board">
             <tbody>
               {gameInfo}
             </tbody>
           </table>
        </div>
      )
    }
    else {
      return (
        <div className="gameDesc" />
      )
    }
  }

}

module.exports=GameDescription;