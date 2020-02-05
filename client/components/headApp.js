import React from "react";
import $ from "jquery";
import * as d3 from "d3";
import { Link } from "react-router-dom";
import TimeStamp from "./timeStamp";
import EventDisplay from "./eventDisplay";
import Chart from "./chart";
import ChampBuild from "./champBuild";
import ChampImage from "./champImage";
import GamesOnSR from "./summRift";
import DropDownMenu from "./menu";
import GameMap from "./gameMap";
import WhosGames from "./whosGames";
import GameDescription from "./gameDescription";
import UserInformationForm from "./userInfoForm";

const backgroundImg = [
  "LeeSin_4",
  "Braum_2",
  "Lulu_3",
  "Blitzcrank_5",
  "Gragas_4",
  "Jinx_1",
  "Yasuo_2",
  "Bard_0",
  "Poppy_5",
  "MonkeyKing_5",
  "Chogath_6",
  "Anivia_5"
][Math.floor(Math.random() * 12)];

export default function HeadApp() {
  const [name, setName] = React.useState("");
  const [playerID1, setPlayerID1] = React.useState([]);
  const [pos1, setPos1] = React.useState([]);
  const [champImg1, setChampImg1] = React.useState({});
  const [allowScroll1, setAllowScroll1] = React.useState([]);
  const [result1, setResult1] = React.useState({});
  const [png1, setPng1] = React.useState([]);
  const [selData1, setSelData1] = React.useState("");
  const [eventSelected, setEventSelected] = React.useState("");
  const [addItems1, setAddItems1] = React.useState("");
  const [toggle, setToggle] = React.useState(false);
  const [patch1, setPatch1] = React.useState(0);
  const [secondToggle, setSecondToggle] = React.useState(false);
  const [maxForStat1, setMaxForStat1] = React.useState(0);
  const [gamesToSee, setGamesToSee] = React.useState(1);
  const [clicksForGame, setClicksForGame] = React.useState([]);
  const [playerID2, setPlayerID2] = React.useState([]);
  const [pos2, setPos2] = React.useState([]);
  const [champImg2, setChampImg2] = React.useState({});
  const [allowScroll2, setAllowScroll2] = React.useState([]);
  const [result2, setResult2] = React.useState({});
  const [png2, setPng2] = React.useState([]);
  const [selData2, setSelData2] = React.useState("");
  const [addItems2, setAddItems2] = React.useState("");
  const [patch2, setPatch2] = React.useState(0);
  const [maxForStat2, setMaxForStat2] = React.useState(0);
  const [region, setRegion] = React.useState("");
  const [spot, setSpot] = React.useState(null);
  let gameSummary = [];

  // POST REQUEST TO SERVER WITH USERNAME TO RETRIEVE ID
  const post = React.useCallback(function(data) {
    $(".loading").css("display", "block");

    return $.ajax({
      type: "POST",
      url: data.url.yooRL,
      data: JSON.stringify(data),
      contentType: "application/json"
    });
  }, []);

  // GET THE MATCH HISTORY
  const postForGame = React.useCallback(function(perGameData) {
    $(".loading").css("display", "block");

    return $.ajax({
      type: "POST",
      url: "/getGameData",
      data: perGameData
    });
  }, []);

  const handleChange = React.useCallback(function(val) {
    setName(val.toLowerCase().replace(/ /g, ""));
  }, []);

  // HANDLE IGN SUBMIT FORM
  const handleSubmit = React.useCallback(function() {
    const cleanName = name;
    const newCleanName = {
      url: { yooRL: "/" },
      summonerName: { summoner: cleanName },
      region: { region }
    };

    // CHECK IF DATA EXISTS IN LOCAL STORAGE
    if (localStorage && localStorage[cleanName]) {
      newCleanName.user_id = { users_id: localStorage[cleanName] };
    } else {
      newCleanName.user_id = { users_id: null };
    }

    post(newCleanName).done(gotTheInfo => {
      // IF DATA ISN'T IN LOCAL STORAGE
      if (localStorage && !localStorage[cleanName]) {
        localStorage[cleanName] = gotTheInfo[0];
      }
      $(".loading").css("display", "none");
      setRes(gotTheInfo[1]);
      setToggle(true);
      setWhosGames(cleanName);
      setSecondToggle(false);
    });
  }, []);

  // HANDLE CLICK FOR MATCH SELECTION
  // continue React Hook conversion from ----- here
  const handleClick = React.useCallback(e => {
    e.preventDefault();
    const that = this;

    clicksForGame.push(e.target.id);
    if (gameSummary.length >= gamesToSee) {
      gameSummary = [];
    }
    gameSummary.push([e.target.id, e.target.name]);

    if (clicksForGame.length === gamesToSee) {
      postForGame(clicksForGame[clicksForGame.length - 1])
        .done(gotGameOne => {
          // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
          // that.setState({
          //   spot: 0,
          //   eventSelected: "select one",
          //   patch1: gotGameOne[0],
          //   pos1: gotGameOne[1],
          //   champImg1: gotGameOne[2],
          //   playerID1: gotGameOne[3],
          //   allowScroll1: gotGameOne[4],
          //   result1: gotGameOne[5],
          //   itemStorage1: gotGameOne[6],
          //   secondToggle: true,
          //   totalRenders: 1,
          //   clicksForGame: [...that.state.clicksForGame].pop(),
          // });
          that.state.spot = 0;
          that.state.eventSelected = "select one";
          that.state.patch1 = gotGameOne[0];
          that.state.pos1 = gotGameOne[1];
          that.state.champImg1 = gotGameOne[2];
          that.state.playerID1 = gotGameOne[3];
          that.state.allowScroll1 = gotGameOne[4];
          that.state.result1 = gotGameOne[5];
          that.state.itemStorage1 = gotGameOne[6];
          that.state.secondToggle = true;
          that.state.totalRenders = 1;
          that.state.clicksForGame.length--;
          if (gamesToSee === 1) {
            $(".loading").css("display", "none");

            // WHATEVER IS CALLED FIRST IS NOT BEING RENDERED
            that.move();
            that.addStatChoice();
            that.move();
            that.addItemVisuals();
          }
        })
        .then(() => {
          if (that.state.clicksForGame.length === 1) {
            that.postForGame(clicksForGame[0]).done(gotGameOne => {
              $(".loading").css("display", "none");

              // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
              setPatch2(gotGameOne[0]);
              setPos2(gotGameOne[1]);
              setChampImg2(gotGameOne[2]);
              setPlayerID2(gotGameOne[3]);
              setAllowScroll2(gotGameOne[4]);
              setResult2(gotGameOne[5]);
              setItemStorage2(gotGameOne[6]);
              setTotalRenders(2);
              setClicksForGame.length--;

              // WHATEVER IS CALLED FIRST IS NOT BEING RENDERED
              move();
              addStatChoice();
              move();
              addItemVisuals();
              champEventDisplay();
            });
          }
        });
    }
  }, []);

  const move = React.useCallback(() => {
    // RIOT'S SETUP FOR FULL SIZE OF SR MAP
    const domain = {
        min: { x: -120, y: -120 },
        max: { x: 14870, y: 14980 }
      },
      // NEWEST VERSION OF SUMMONER'S RIFT
      nSR = "https://s3-us-west-1.amazonaws.com/riot-developer-portal/docs/map11.png";

    // SCALING MAP DOWN
    let width = 468,
      height = 468;

    if (gamesToSee === 1) {
      width = 500;
      height = 500;
    }

    // ADJUSTING COORDINATES TO FIT "MINIMAP" SIZE
    const xScale = d3
      .scaleLinear()
      .domain([domain.min.x, domain.max.x])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([domain.min.y, domain.max.y])
      .range([height, 0]);

    // SEEMS 10 MAPS ARE RENDERED
    if (gamesToSee === 1) {
      if (document.getElementById("backdrop1")) {
        $("#backdrop1")
          .first()
          .remove();
      }
      if (document.getElementById("backdrop4") && document.getElementById("backdrop2")) {
        $("#backdrop2")
          .first()
          .remove();
        $("#backdrop4")
          .first()
          .remove();
      }
    }

    if (gamesToSee === 2) {
      if (document.getElementById("backdrop4") && document.getElementById("backdrop2")) {
        $("#backdrop4")
          .first()
          .remove();
        $("#backdrop2")
          .first()
          .remove();
      }
      if (document.getElementById("backdrop1")) {
        $("#backdrop1")
          .first()
          .remove();
      }
    }

    if (gamesToSee === 1) {
      const svg = d3
        .select("#map" + 1 * gamesToSee)
        .append("svg:svg")
        .attr("id", "backdrop" + 1 * gamesToSee)
        .attr("width", width)
        .attr("height", height)
        .attr("x", "0")
        .attr("y", "0");

      // APPEND BACKGROUND IMAGE TO SVG
      svg
        .append("image")
        .attr("xlink:href", nSR)
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "rift");

      // GET THE 10 IMAGES FROM URL
      for (let z = 0; z < playerID1.length; z++) {
        const checking = playerID1[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg
          .append("svg:g")
          .attr("id", "champIcon" + 1 * gamesToSee)
          .selectAll("image")
          .data([pos1[z]])
          .enter()
          .append("svg:image")
          .attr(
            "xlink:href",
            "http://ddragon.leagueoflegends.com/cdn/" +
              patch1 +
              "/img/champion/" +
              champImg1[checking] +
              ".png"
          )
          .attr("x", d => {
            return xScale(d[0]);
          })
          .attr("y", d => {
            return yScale(d[1]);
          })
          .attr("class", "image");
        // .style({ width: "24px", height: "24px" });
      }

      // SET STATE FOR SVG TO USE LATER
      setPng1(svg);
    }

    if (gamesToSee === 2) {
      const svg = d3
        .select("#map" + 1 * gamesToSee)
        .append("svg:svg")
        .attr("id", "backdrop" + 1 * gamesToSee)
        .attr("width", width)
        .attr("height", height)
        .attr("x", "0")
        .attr("y", "0");

      // APPEND BACKGROUND IMAGE TO SVG
      svg
        .append("image")
        .attr("xlink:href", nSR)
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "rift");

      // GET THE 10 IMAGES FROM URL
      for (let z = 0; z < playerID1.length; z++) {
        const checking1 = playerID1[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg
          .append("svg:g")
          .attr("id", "champIcon" + 1 * gamesToSee)
          .selectAll("image")
          .data([pos1[z]])
          .enter()
          .append("svg:image")
          .attr(
            "xlink:href",
            "http://ddragon.leagueoflegends.com/cdn/" +
              patch1 +
              "/img/champion/" +
              champImg1[checking1] +
              ".png"
          )
          .attr("x", d => {
            return xScale(d[0]);
          })
          .attr("y", d => {
            return yScale(d[1]);
          })
          .attr("class", "image")
          .style({ width: "24px", height: "24px" });
      }

      const svg2 = d3
        .select("#map" + 2 * gamesToSee)
        .append("svg:svg")
        .attr("id", "backdrop" + 2 * gamesToSee)
        .attr("width", width)
        .attr("height", height)
        .attr("x", "0")
        .attr("y", "0");

      // APPEND BACKGROUND IMAGE TO SVG
      svg2
        .append("image")
        .attr("xlink:href", nSR)
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "rift");

      // GET THE 10 IMAGES FROM URL
      for (let z = 0; z < playerID2.length; z++) {
        const checking2 = playerID2[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg2
          .append("svg:g")
          .attr("id", "champIcon" + 2 * gamesToSee)
          .selectAll("image")
          .data([pos2[z]])
          .enter()
          .append("svg:image")
          .attr(
            "xlink:href",
            "http://ddragon.leagueoflegends.com/cdn/" +
              patch2 +
              "/img/champion/" +
              champImg2[checking2] +
              ".png"
          )
          .attr("x", d => {
            return xScale(d[0]);
          })
          .attr("y", d => {
            return yScale(d[1]);
          })
          .attr("class", "image")
          .style({ width: "24px", height: "24px" });
      }

      // SET STATE FOR SVG TO USE LATER
      setPng1(svg);
      setPng2(svg2);
    }
  }, []);

  // SCROLL BAR CHANGE
  const onChange = React.useCallback(e => {
    e.preventDefault();
    setSpot(e.target.value);
  }, []);

  // BACKGROUND FOR THE BAR GRAPH
  const addStatChoice = React.useCallback(() => {
    const h = 450;
    if (gamesToSee === 1) {
      if (document.getElementById("chart1")) {
        $("#allStat1")
          .first()
          .remove();
      }
      if (document.getElementById("chart2")) {
        $("#chart2").remove();
        $("#allStat2").remove();
      }
      if (document.getElementById("chart4")) {
        $("#chart4").remove();
        $("#allStat4").remove();
      }

      const svg = d3
        .select("#chart1")
        .append("svg:svg")
        .attr("height", h)
        .attr("width", 415)
        .attr("id", "allStat1");

      if (gamesToSee === 1) {
        setSelData1(svg);
      }
    }

    if (gamesToSee === 2) {
      if (document.getElementById("chart1") || document.getElementById("allStat1")) {
        $("#chart1").remove();
        $("#allStat1").remove();
      }
      if (document.getElementById("chart2")) {
        $("#allStat2")
          .first()
          .remove();
      }
      if (document.getElementById("chart4")) {
        $("#allStat4")
          .first()
          .remove();
      }

      const svg2 = d3
        .select("#chart2")
        .append("svg:svg")
        .attr("height", h)
        .attr("width", 400)
        .attr("id", "allStat2");

      const svg4 = d3
        .select("#chart4")
        .append("svg:svg")
        .attr("height", h)
        .attr("width", 400)
        .attr("id", "allStat4");

      setSelData1(svg2);
      setSelData2(svg4);
    }
  }, []);

  // CHAMP BUILDS
  const addItemVisuals = React.useCallback(() => {
    // REMOVE PREVIOUS ITEM VISUALS
    if (gamesToSee === 1) {
      if (document.getElementById("allItems1")) {
        $("#allItems1")
          .first()
          .remove();
      }
      if (document.getElementById("laneRole1")) {
        $("#laneRole1")
          .first()
          .remove();
      }
      if (document.getElementById("builds2")) {
        $("#builds2")
          .first()
          .remove();
      }
      if (document.getElementById("roleLane2")) {
        $("#roleLane2")
          .first()
          .remove();
      }
      if (document.getElementById("builds4")) {
        $("#builds4")
          .first()
          .remove();
      }
      if (document.getElementById("roleLane4")) {
        $("#roleLane4")
          .first()
          .remove();
      }
    }

    if (gamesToSee === 2) {
      if (document.getElementById("allItems1")) {
        $("#allItems1")
          .first()
          .remove();
      }
      if (document.getElementById("allItems2")) {
        $("#allItems2")
          .first()
          .remove();
      }
      if (document.getElementById("allItems4")) {
        $("#allItems4")
          .first()
          .remove();
      }
      if (document.getElementById("laneRole1")) {
        $("#laneRole1")
          .first()
          .remove();
      }
      if (document.getElementById("laneRole2")) {
        $("#laneRole2")
          .first()
          .remove();
      }
      if (document.getElementById("laneRole4")) {
        $("#laneRole4")
          .first()
          .remove();
      }
    }

    const w = 304,
      h = 450;
    if (gamesToSee === 1) {
      const svg = d3
        .select("#builds1")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "allItems1");

      const champRole = d3
        .select("#roleLane1")
        .append("svg:svg")
        .attr("width", 50)
        .attr("height", h)
        .attr("id", "laneRole1");

      setAddItems1(svg);
      setWhichRole1(champRole);
    }

    if (gamesToSee === 2) {
      const svg = d3
        .select("#builds2")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "allItems2");

      const svg2 = d3
        .select("#builds4")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "allItems4");

      const champRole = d3
        .select("#roleLane2")
        .append("svg:svg")
        .attr("width", 50)
        .attr("height", h)
        .attr("id", "laneRole2");

      const champRole2 = d3
        .select("#roleLane4")
        .append("svg:svg")
        .attr("width", 50)
        .attr("height", h)
        .attr("id", "laneRole4");

      setAddItems1(svg);
      setAddItems2(svg2);
      setWhichRole1(champRole);
      setWhichRole2(champRole2);
    }
  }, []);

  const champEventDisplay = React.useCallback(() => {
    const h = 500;
    if (gamesToSee === 1) {
      if (document.getElementById("eventDisplay1")) {
        $("#event1")
          .first()
          .remove();
      }
      if (document.getElementById("eventDisplay2")) {
        $("#eventDisplay2").remove();
        $("#event2").remove();
      }
      if (document.getElementById("eventDisplay4")) {
        $("#eventDisplay4").remove();
        $("#event4").remove();
      }

      const champEvent = d3
        .select("#eventDisplay1")
        .append("svg:svg")
        .attr("height", h)
        .attr("width", 450)
        .attr("id", "event1");

      if (gamesToSee === 1) {
        setEventDisplay1(champEvent);
      }
    }

    if (gamesToSee === 2) {
      if (document.getElementById("eventDisplay1") || document.getElementById("event1")) {
        $("#eventDisplay1").remove();
        $("#event1").remove();
      }
      if (document.getElementById("eventDisplay2")) {
        $("#event2")
          .first()
          .remove();
      }
      if (document.getElementById("eventDisplay4")) {
        $("#event4")
          .first()
          .remove();
      }

      const champEvent = d3
        .select("#eventDisplay2")
        .append("svg:svg")
        .attr("height", h)
        .attr("width", 165)
        .attr("id", "allStat2");

      const champEvent2 = d3
        .select("#eventDisplay4")
        .append("svg:svg")
        .attr("height", h)
        .attr("width", 165)
        .attr("id", "allStat4");

      setEventDisplay1(champEvent);
      setEventDisplay2(champEvent2);
    }
  }, []);

  // USER SELECTION ON DROPDOWN MENU
  const whichEventPick = React.useCallback(eventPicked => {
    eventPicked.preventDefault();
    const eventsForGames = [];

    // NUMBER OF GAMES WANTED
    for (let t = 1; t <= gamesToSee; t++) {
      const searchEvents = this.state["allowScroll" + t.toString()];
      const eventSpecific = [];
      for (let i = 0; i < this.state["playerID" + t.toString()].length; i++) {
        let statCount = 0;
        if (
          eventPicked.target.value === "WARD_PLACED" ||
          eventPicked.target.value === "WARD_KILL"
        ) {
          for (let j = 0; j < searchEvents.length; j++) {
            if (searchEvents[j][0].events) {
              for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                if (
                  searchEvents[j][0].events[k].type === eventPicked.target.value &&
                  searchEvents[j][0].events[k].wardType !== "UNDEFINED" &&
                  (searchEvents[j][0].events[k].creatorId ===
                    this.state["playerID" + t.toString()][i][0] ||
                    searchEvents[j][0].events[k].killerId ===
                      this.state["playerID" + t.toString()][i][0])
                ) {
                  statCount++;
                }
              }
            }
          }
        }
        if (
          eventPicked.target.value === "killerId" ||
          eventPicked.target.value === "victimId" ||
          eventPicked.target.value === "assistingParticipantIds"
        ) {
          for (let j = 0; j < searchEvents.length; j++) {
            if (searchEvents[j][0].events) {
              for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                if (searchEvents[j][0].events[k].type === "CHAMPION_KILL") {
                  if (
                    eventPicked.target.value === "killerId" ||
                    eventPicked.target.value === "victimId"
                  ) {
                    if (
                      searchEvents[j][0].events[k][eventPicked.target.value] ===
                      this.state["playerID" + t.toString()][i][0]
                    ) {
                      statCount++;
                    }
                  }
                  if (
                    eventPicked.target.value === "assistingParticipantIds" &&
                    searchEvents[j][0].events[k][eventPicked.target.value]
                  ) {
                    for (
                      let assists = 0;
                      assists < searchEvents[j][0].events[k][eventPicked.target.value].length;
                      assists++
                    ) {
                      if (
                        searchEvents[j][0].events[k][eventPicked.target.value][assists] ===
                        this.state["playerID" + t.toString()][i][0]
                      ) {
                        statCount++;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (eventPicked.target.value === "minionsKilled") {
          if (searchEvents[searchEvents.length - 1][0].participantFrames) {
            statCount =
              searchEvents[searchEvents.length - 1][0].participantFrames[i + 1].minionsKilled +
              searchEvents[searchEvents.length - 1][0].participantFrames[i + 1].jungleMinionsKilled;
          }
        }
        if (eventPicked.target.value === "totalGold") {
          if (searchEvents[searchEvents.length - 1][0].participantFrames) {
            statCount = searchEvents[searchEvents.length - 1][0].participantFrames[i + 1].totalGold;
          }
        }
        eventSpecific.push(statCount);
      }
      eventsForGames.push(eventSpecific);
    }
    if (gamesToSee === 1) {
      setEventSelected(eventPicked.target.value);
      setMaxForStat1(Math.max(...eventsForGames[0]));
    }
    if (gamesToSee === 2) {
      setEventSelected(eventPicked.target.value);
      setMaxForStat1(Math.max(...eventsForGames[0]));
      setMaxForStat2(Math.max(...eventsForGames[1]));
    }
  }, []);

  const numGamesSee = React.useCallback(e => {
    e.preventDefault();
    gamesToSee = parseInt(e.target.value, 10);
    gameSummary = [];
  }, []);

  const updateRegion = React.useCallback(el => {
    el.preventDefault();
    setRegion(el.target.value);
  }, []);

  const updateUsername = React.useCallback(name => {
    setName(name);
  }, []);

  // IGN SEARCH BAR
  if (toggle === false) {
    return (
      <div id="landingPage">
        <div className="loading"></div>
        <div
          id="championBackground"
          style={{
            backgroundImage:
              "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
              backgroundImg +
              ".jpg)"
          }}
        />
        <ul className="linkToPages">
          <li className="goAbout">
            <Link to="/about">About</Link>
          </li>
        </ul>

        <p id="quickSumm">
          Your one stop shop to finding more than a summary but less than a replay of a game!
          <br />
          To get started, enter an ign (in game name) in the search bar.
        </p>

        <UserInformationForm
          submitUserForm={this.handleSubmit.bind(this)}
          region={region}
          updateUserRegion={this.updateRegion.bind(this)}
          handleNameChange={this.handleChange.bind(this)}
        />

        <br />
        <br />
        <br />
        <br />

        <p id="legalStuff">
          (Legal Stuff: Ana-LoL-ics isn’t endorsed by Riot Games and doesn’t reflect the views or
          opinions of Riot Games or anyone officially involved in producing or managing League of
          Legends.League of Legends and Riot Games are trademarks or registered trademarks of Riot
          Games, Inc. League of Legends © Riot Games, Inc.)
        </p>
      </div>
    );
  }

  // MATCH LIST BUTTONS AND MATCH DATA
  if (secondToggle === true && toggle === true) {
    $("body").css("background", "#292929");

    return (
      <div className="resultingInfo">
        <div className="loading"></div>
        <div id="backHome">
          <ul className="linkToPages">
            <li className="goAbout">
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <UserInformationForm
          userFormSubmit={this.handleSubmit.bind(this)}
          region={region}
          updateRegion={this.updateRegion.bind(this)}
          gamesToSee={gamesToSee}
          handleNameChange={this.handleChange.bind(this)}
        />
        <WhosGames summonersName={whosGames} />
        <GamesOnSR
          gamesToSee={gamesToSee}
          res={res}
          onClick={this.handleClick.bind(this)}
          numGamesSee={this.numGamesSee.bind(this)}
          region={region}
        />
        <GameDescription gameSumm={gameSummary} gamesToSee={gamesToSee} />
        <GameMap gamesToSee={gamesToSee} region={region} />
        <TimeStamp
          gamesToSee={gamesToSee}
          timeline1={allowScroll1}
          conversion={spot}
          timeline2={allowScroll2}
          region={region}
        />
        <DropDownMenu
          gamesToSee={gamesToSee}
          spot={spot}
          whichEventPick={this.whichEventPick.bind(this)}
          onChange={this.onChange.bind(this)}
          timeline1={allowScroll1}
          timeline2={allowScroll2}
          eventSelected={eventSelected}
          region={region}
        />
        <EventDisplay
          gamesToSee={gamesToSee}
          timeline1={allowScroll1}
          spot={spot}
          eventDisplay1={eventDisplay1}
          eventDisplay2={eventDisplay2}
          playerInfo1={playerID1}
          champImg1={champImg1}
          patch1={patch1}
          timeline2={allowScroll2}
          playerInfo2={playerID2}
          champImg2={champImg2}
          patch2={patch2}
          region={region}
        />
        <Chart
          gamesToSee={gamesToSee}
          timeline1={allowScroll1}
          spot={spot}
          selData1={selData1}
          playerInfo1={playerID1}
          champName1={champImg1}
          maxForStat1={maxForStat1}
          timeline2={allowScroll2}
          selData2={selData2}
          playerInfo2={playerID2}
          eventSelected={eventSelected}
          champName2={champImg2}
          maxForStat2={maxForStat2}
          region={region}
        />
        <ChampBuild
          gamesToSee={gamesToSee}
          timeline1={allowScroll1}
          spot={spot}
          playerInfo1={playerID1}
          champName1={champImg1}
          itemStorage1={itemStorage1}
          addItems1={addItems1}
          patch1={patch1}
          timeline2={allowScroll2}
          playerInfo2={playerID2}
          champName2={champImg2}
          itemStorage2={itemStorage2}
          addItems2={addItems2}
          patch2={patch2}
          whichRole1={whichRole1}
          whichRole2={whichRole2}
          region={region}
        />
        <ChampImage
          gamesToSee={gamesToSee}
          timeline1={allowScroll1}
          playerInfo1={playerID1}
          png1={png1}
          champImg1={champImg1}
          spot={spot}
          patch1={patch1}
          timeline2={allowScroll2}
          playerInfo2={playerID2}
          png2={png2}
          champImg2={champImg2}
          patch2={patch2}
          region={region}
        />
      </div>
    );
  }

  // MATCH LIST BUTTONS
  if (toggle === true) {
    $("body").css("background", "#292929");

    return (
      <div id="second">
        <div className="loading"></div>
        <div id="backHome">
          <ul className="linkToPages">
            <li className="goAbout">
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <UserInformationForm
          userInfoSubmit={this.handleSubmit.bind(this)}
          region={region}
          updateRegion={this.updateRegion.bind(this)}
          gamesToSee={gamesToSee}
          handleNameChange={this.handleChange.bind(this)}
        />
        <WhosGames summonersName={whosGames} />
        <GamesOnSR
          gamesToSee={gamesToSee}
          res={res}
          onClick={this.handleClick.bind(this)}
          numGamesSee={this.numGamesSee.bind(this)}
        />
      </div>
    );
  }
}
