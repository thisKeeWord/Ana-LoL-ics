import React from 'react';


class GameDescription extends React.Component {
  getGameDescription() {
    let rows = [];
    for (let i = 0; i < this.props.gameSumm.length; i++) {
      let infoByGame = this.props.gameSumm[i].split('break');
      let description = [];
      for (let j = 0; j < infoByGame.length; j++) {
        let subData = infoByGame[j];
        description.push(<td key={subData} id={subData}>{subData}</td>)
      }
      rows.push(<tr key={i} id={"data" + i}>{description}</tr>);
    }
    return rows;
  }
  
  render() {
    // console.log(this.props.gameSumm)
    if (this.props.gameSumm) {
      let gameInfo = this.getGameDescription();
      console.log('asdfasdf')
      return (
        <div className="gameDescription">
          <div className="row">
            <div className="col s12 board">
              <table id="simple-board">
                 <tbody>
                   {gameInfo}
                 </tbody>
               </table>
            </div>
          </div>
          yolo
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