import React from 'react';

class GamesOnSR extends React.Component {

  handleClick(e) {
    this.props.onClick(e);
  }

  render() {
    return (
      <div id="matches">
        click on one of the following: <br/>
        { this.props.res.map(matchList => {
            return (
              <input type="submit" id={matchList[0]} className="games" key={matchList[0]} onClick={this.handleClick.bind(this)} style={{backgroundSize: "25px", backgroundImage:"url(" + matchList[1] + ")",  backgroundRepeat: "no-repeat", "height":"30px"}} value={matchList[2]} />
            )
          })
        }
      </div>
    )
  }
}

module.exports=GamesOnSR;