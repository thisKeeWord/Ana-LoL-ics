import React from 'react';

class GamesOnSR extends React.Component {

  handleClick(e) {
    this.props.onClick(e);
  }

  render() {
    return (
      <div id="matches">
        { this.props.res.map(matchList => {
            return (
              <input type="submit" id={matchList[0]} onClick={this.handleClick.bind(this)} style={{backgroundSize: "30px", backgroundImage:"url(" + matchList[1] + ")",  backgroundRepeat: "no-repeat", "height":"40px"}} value={matchList[2]} />
            )
          })
        }
      </div>
    )
  }
}

module.exports=GamesOnSR;