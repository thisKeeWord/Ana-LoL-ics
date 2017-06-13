import React from 'react';

class GamesOnSR extends React.Component {

  handleClick(e) {
    this.props.onClick(e);
  }

  onChange(e) {
    this.props.numGamesSee(e);
  }

  render() {
    return (
      <div id={"matches" + this.props.gamesToSee}>
        click on
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <select defaultValue='1' onChange={this.onChange.bind(this)} id={"choices1"}>
          <option value="1">1</option>
          <option value="2">2</option>
        </select> 
        from list: <br/>
        { this.props.res.map(matchList => {
            return (
              <input type="submit" id={matchList[0]} className={"games" + this.props.gamesToSee} name={matchList[3] + "break" + matchList[4] + "break" + matchList[5] + "break" + matchList[6]} key={matchList[0]} onClick={this.handleClick.bind(this)} style={{backgroundSize: "25px", backgroundImage:"url(" + matchList[1] + ")",  backgroundRepeat: "no-repeat", "height":"30px"}} value={matchList[2]} />
            )
          })
        }
      </div>
    )
  }
}

module.exports=GamesOnSR;