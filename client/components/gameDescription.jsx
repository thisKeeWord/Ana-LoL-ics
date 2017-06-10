import React from 'react';

class GameDescription extends React.Component {
  render() {
    return (
      <div className="gameDesc">
        { this.props.gameSumm.map((el, index) => {
            let detailBreakdown = el.split('break');
            return (
              <div id={"gameDetails" + index}>
                detailBreakdown[0]
              </div>
            )
          })
        }

      </div>
    )
  }
}

module.exports=GameDescription;