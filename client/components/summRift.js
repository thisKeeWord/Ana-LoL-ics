import React from "react";
import PropTypes from "prop-types";

GamesOnSR.propTypes = {
  numGamesSee: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  gamesToSee: PropTypes.number.isRequired,
  res: PropTypes.array.isRequired,
};

export default function GamesOnSR(props) {
  return (
    <div id={`matches${props.gamesToSee}`}>
      click on &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <select defaultValue="1" onChange={props.numGamesSee} id={"choices1"}>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      from list: <br />
      <div className="dropdown">
        <span className="hoverHere">Hover Here For Match History</span>
        <div className="dropdown-content">
          {props.res.map((matchList) => {
            return (
              <input
                type="submit"
                id={matchList[0]}
                className={`games${props.gamesToSee}`}
                name={`${matchList[3]}break${matchList[4]}break${matchList[5]}break${matchList[6]}`}
                key={matchList[0]}
                onClick={props.onClick}
                style={{
                  backgroundSize: "25px",
                  backgroundImage: `url(${matchList[1]})`,
                  backgroundRepeat: "no-repeat",
                  height: "30px",
                }}
                value={matchList[2]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
