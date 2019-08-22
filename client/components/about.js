import React from "react";
import { Link } from "react-router";

export default class About extends React.Component {
  render() {
    return (
      <div id="aboutMe">
        <div id="backHome">
          <ul className="linkToPages">
            <li className="goHome">
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>

        <div
          id="championBackground"
          style={{
            backgroundImage:
              "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kennen_4.jpg)",
          }}
        />
        <div id="description">
          <p>
            Ana-LoL-ics doesn't just give a more specialized way of viewing stats by game - played
            on Summoner's Rift - it allows side-by-side analysis of games.
          </p>
          <p>
            Users can view stats - warding, creep score, deaths, etc - side-by-side, which should
            give a better and a more straightfoward idea of betterment.
          </p>

          <p>*The site is still undergoing changes. Thank you for your patience.*</p>
          <p>
            *For the optimal view, please use a desktop browser to use the site in as full a window
            as possible.*
          </p>

          <div className="icons">
            <a href="https://www.linkedin.com/in/thiskeeword">
              <i className="fa fa-linkedin fa-lg li grow" id="iconLink" target="_blank"></i>
            </a>
            <a href="https://www.github.com/thisKeeWord">
              <i className="fa fa-github-alt fa-lg gh grow" id="iconLink" target="_blank"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
