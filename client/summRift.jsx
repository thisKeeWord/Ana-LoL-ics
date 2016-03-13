import React from 'react';

class GamesOnSR extends React.Component {

  handleClick(e) {
    this.props.onClick(e);
  }

  onChange(e) {
    this.props.oneOrTwoGames(e)
  }

  render() {
    return (
      <div id="matches">
        <select defaultValue='one' onChange={this.onChange.bind(this)} id="numOMatches" >
          <option value="one">view 1 match</option>
          <option value="two">view 2 matches</option>
        </select>
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