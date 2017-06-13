import React from 'react';

class GameDescription extends React.Component {
  render() {
    // console.log(this.props.gameSumm)
    if (this.props.gameSumm) {
      return (
        <div className="gameDesc">
          { this.props.gameSumm.map((el, index) => {
              // console.log(el, 'element')
              let detailBreakdown = el.split('break');
              return (
                <div id={"gameDetails" + index}>
                  {detailBreakdown[0]}
                </div>
              )
            })
          }

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