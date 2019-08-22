import React from "react";
import $ from "jquery";
import d3 from "d3";
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

export default class HeadApp extends React.Component {
  constructor() {
    super();
    this.state = {
      backgroundImg: [
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
        "Anivia_5",
      ][Math.floor(Math.random() * 12)],
      playerID1: [],
      pos1: [],
      champImg1: {},
      allowScroll1: [],
      result1: {},
      png1: [],
      selData1: "",
      eventSelected: "",
      addItems1: "",
      toggle: false,
      patch1: 0,
      secondToggle: false,
      maxForStat1: 0,
      gamesToSee: 1,
      clicksForGame: [],
      playerID2: [],
      pos2: [],
      champImg2: {},
      allowScroll2: [],
      result2: {},
      png2: [],
      selData2: "",
      addItems2: "",
      patch2: 0,
      maxForStat2: 0,
      region: "",
      gameSummary: [],
    };
  }

  // POST REQUEST TO SERVER WITH USERNAME TO RETRIEVE ID
  post(data) {
    $(".loading").css("display", "block");

    return $.ajax({
      type: "POST",
      url: data.url.yooRL,
      data: JSON.stringify(data),
      contentType: "application/json",
    });
  }

  // GET THE MATCH HISTORY
  postForGame(perGameData) {
    $(".loading").css("display", "block");

    return $.ajax({
      type: "POST",
      url: "/getGameData",
      data: perGameData,
    });
  }

  // HANDLE IGN SUBMIT FORM
  handleSubmit(e, elem) {
    e.preventDefault();
    const that = this;
    const cleanName = elem.toLowerCase().replace(/ /g, "");
    const newCleanName = {
      url: { yooRL: "/" },
      summonerName: { summoner: cleanName },
      region: { region: that.state.region },
    };

    // CHECK IF DATA EXISTS IN LOCAL STORAGE
    if (localStorage && localStorage[cleanName]) {
      newCleanName.user_id = { users_id: localStorage[cleanName] };
    } else {
      newCleanName.user_id = { users_id: null };
    }

    this.post(newCleanName).done((gotTheInfo) => {
      // IF DATA ISN'T IN LOCAL STORAGE
      if (localStorage && !localStorage[cleanName]) {
        localStorage[cleanName] = gotTheInfo[0];
      }
      $(".loading").css("display", "none");
      that.setState({
        res: gotTheInfo[1],
        toggle: true,
        whosGames: cleanName.toUpperCase(),
        secondToggle: false,
      });
    });
  }

  // HANDLE CLICK FOR MATCH SELECTION
  handleClick(e) {
    e.preventDefault();
    const that = this;

    this.state.clicksForGame.push(e.target.id);
    if (this.state.gameSummary.length >= this.state.gamesToSee) {
      this.state.gameSummary = [];
    }
    this.state.gameSummary.push([e.target.id, e.target.name]);

    if (this.state.clicksForGame.length === this.state.gamesToSee) {
      this.postForGame(this.state.clicksForGame[this.state.clicksForGame.length - 1])
        .done((gotGameOne) => {
          // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
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
          if (this.state.gamesToSee === 1) {
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
            that.postForGame(this.state.clicksForGame[0]).done((gotGameOne) => {
              $(".loading").css("display", "none");

              // HAD TO DO THIS FOR NOW SINCE SETSTATE TRIGGERS TO SOON
              that.state.patch2 = gotGameOne[0];
              that.state.pos2 = gotGameOne[1];
              that.state.champImg2 = gotGameOne[2];
              that.state.playerID2 = gotGameOne[3];
              that.state.allowScroll2 = gotGameOne[4];
              that.state.result2 = gotGameOne[5];
              that.state.itemStorage2 = gotGameOne[6];
              that.state.totalRenders = 2;
              that.state.clicksForGame.length--;

              // WHATEVER IS CALLED FIRST IS NOT BEING RENDERED
              that.move();
              that.addStatChoice();
              that.move();
              that.addItemVisuals();
              that.champEventDisplay();
            });
          }
        });
    }
  }

  move() {
    // RIOT'S SETUP FOR FULL SIZE OF SR MAP
    const domain = {
        min: { x: -120, y: -120 },
        max: { x: 14870, y: 14980 },
      },
      // NEWEST VERSION OF SUMMONER'S RIFT
      nSR = "https://s3-us-west-1.amazonaws.com/riot-developer-portal/docs/map11.png";

    // SCALING MAP DOWN
    let width = 468,
      height = 468;

    if (this.state.gamesToSee === 1) {
      width = 500;
      height = 500;
    }

    // ADJUSTING COORDINATES TO FIT "MINIMAP" SIZE
    const xScale = d3.scale
      .linear()
      .domain([domain.min.x, domain.max.x])
      .range([0, width]);

    const yScale = d3.scale
      .linear()
      .domain([domain.min.y, domain.max.y])
      .range([height, 0]);

    // SEEMS 10 MAPS ARE RENDERED
    if (this.state.gamesToSee === 1) {
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

    if (this.state.gamesToSee === 2) {
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

    if (this.state.gamesToSee === 1) {
      const svg = d3
        .select("#map" + 1 * this.state.gamesToSee)
        .append("svg:svg")
        .attr("id", "backdrop" + 1 * this.state.gamesToSee)
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
      for (let z = 0; z < this.state.playerID1.length; z++) {
        const checking = this.state.playerID1[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg
          .append("svg:g")
          .attr("id", "champIcon" + 1 * this.state.gamesToSee)
          .selectAll("image")
          .data([this.state.pos1[z]])
          .enter()
          .append("svg:image")
          .attr(
            "xlink:href",
            "http://ddragon.leagueoflegends.com/cdn/" +
              this.state.patch1 +
              "/img/champion/" +
              this.state.champImg1[checking] +
              ".png"
          )
          .attr("x", (d) => {
            return xScale(d[0]);
          })
          .attr("y", (d) => {
            return yScale(d[1]);
          })
          .attr("class", "image")
          .style({ width: "24px", height: "24px" });
      }

      // SET STATE FOR SVG TO USE LATER
      this.setState({
        png1: svg,
      });
    }

    if (this.state.gamesToSee === 2) {
      const svg = d3
        .select("#map" + 1 * this.state.gamesToSee)
        .append("svg:svg")
        .attr("id", "backdrop" + 1 * this.state.gamesToSee)
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
      for (let z = 0; z < this.state.playerID1.length; z++) {
        const checking1 = this.state.playerID1[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg
          .append("svg:g")
          .attr("id", "champIcon" + 1 * this.state.gamesToSee)
          .selectAll("image")
          .data([this.state.pos1[z]])
          .enter()
          .append("svg:image")
          .attr(
            "xlink:href",
            "http://ddragon.leagueoflegends.com/cdn/" +
              this.state.patch1 +
              "/img/champion/" +
              this.state.champImg1[checking1] +
              ".png"
          )
          .attr("x", (d) => {
            return xScale(d[0]);
          })
          .attr("y", (d) => {
            return yScale(d[1]);
          })
          .attr("class", "image")
          .style({ width: "24px", height: "24px" });
      }

      const svg2 = d3
        .select("#map" + 2 * this.state.gamesToSee)
        .append("svg:svg")
        .attr("id", "backdrop" + 2 * this.state.gamesToSee)
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
      for (let z = 0; z < this.state.playerID2.length; z++) {
        const checking2 = this.state.playerID2[z][1];

        // INITIAL RENDERING OF POSITION AT FRAME 0 FOR SIMPLICITY
        svg2
          .append("svg:g")
          .attr("id", "champIcon" + 2 * this.state.gamesToSee)
          .selectAll("image")
          .data([this.state.pos2[z]])
          .enter()
          .append("svg:image")
          .attr(
            "xlink:href",
            "http://ddragon.leagueoflegends.com/cdn/" +
              this.state.patch2 +
              "/img/champion/" +
              this.state.champImg2[checking2] +
              ".png"
          )
          .attr("x", (d) => {
            return xScale(d[0]);
          })
          .attr("y", (d) => {
            return yScale(d[1]);
          })
          .attr("class", "image")
          .style({ width: "24px", height: "24px" });
      }

      // SET STATE FOR SVG TO USE LATER
      this.setState({
        png1: svg,
        png2: svg2,
      });
    }
  }

  // SCROLL BAR CHANGE
  onChange(e) {
    e.preventDefault();
    this.setState({
      spot: e.target.value,
    });
  }

  // BACKGROUND FOR THE BAR GRAPH
  addStatChoice() {
    const h = 450;
    if (this.state.gamesToSee === 1) {
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

      if (this.state.gamesToSee === 1) {
        this.setState({
          selData1: svg,
        });
      }
    }

    if (this.state.gamesToSee === 2) {
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

      this.setState({
        selData1: svg2,
        selData2: svg4,
      });
    }
  }

  // CHAMP BUILDS
  addItemVisuals() {
    // REMOVE PREVIOUS ITEM VISUALS
    if (this.state.gamesToSee === 1) {
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

    if (this.state.gamesToSee === 2) {
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
    if (this.state.gamesToSee === 1) {
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

      this.setState({
        addItems1: svg,
        whichRole1: champRole,
      });
    }

    if (this.state.gamesToSee === 2) {
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

      this.setState({
        addItems1: svg,
        addItems2: svg2,
        whichRole1: champRole,
        whichRole2: champRole2,
      });
    }
  }

  champEventDisplay() {
    const h = 500;
    if (this.state.gamesToSee === 1) {
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

      if (this.state.gamesToSee === 1) {
        this.setState({
          eventDisplay1: champEvent,
        });
      }
    }

    if (this.state.gamesToSee === 2) {
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

      this.setState({
        eventDisplay1: champEvent,
        eventDisplay2: champEvent2,
      });
    }
  }

  // USER SELECTION ON DROPDOWN MENU
  whichEventPick(eventPicked) {
    eventPicked.preventDefault();
    const eventsForGames = [];

    // NUMBER OF GAMES WANTED
    for (let t = 1; t <= this.state.gamesToSee; t++) {
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
    if (this.state.gamesToSee === 1) {
      this.setState({
        eventSelected: eventPicked.target.value,
        maxForStat1: Math.max(...eventsForGames[0]),
      });
    }
    if (this.state.gamesToSee === 2) {
      this.setState({
        eventSelected: eventPicked.target.value,
        maxForStat1: Math.max(...eventsForGames[0]),
        maxForStat2: Math.max(...eventsForGames[1]),
      });
    }
  }

  numGamesSee(e) {
    e.preventDefault();
    this.state.gamesToSee = parseInt(e.target.value, 10);
    this.state.gameSummary = [];
  }

  updateRegion(el) {
    el.preventDefault();
    this.setState({ region: el.target.value });
  }

  render() {
    console.log(this.state.toggle);;
    // IGN SEARCH BAR
    if (this.state.toggle === false) {
      return (
        <div id="landingPage">
          <div className="loading"></div>
          <div
            id="championBackground"
            style={{
              backgroundImage:
                "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
                this.state.backgroundImg +
                ".jpg)",
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
            region={this.state.region}
            updateUserRegion={this.updateRegion.bind(this)}
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
    if (this.state.secondToggle === true && this.state.toggle === true) {
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
            region={this.state.region}
            updateRegion={this.updateRegion.bind(this)}
            gamesToSee={this.state.gamesToSee}
          />
          <WhosGames summonersName={this.state.whosGames} />
          <GamesOnSR
            gamesToSee={this.state.gamesToSee}
            res={this.state.res}
            onClick={this.handleClick.bind(this)}
            numGamesSee={this.numGamesSee.bind(this)}
            region={this.state.region}
          />
          <GameDescription gameSumm={this.state.gameSummary} gamesToSee={this.state.gamesToSee} />
          <GameMap gamesToSee={this.state.gamesToSee} region={this.state.region} />
          <TimeStamp
            gamesToSee={this.state.gamesToSee}
            timeline1={this.state.allowScroll1}
            conversion={this.state.spot}
            timeline2={this.state.allowScroll2}
            region={this.state.region}
          />
          <DropDownMenu
            gamesToSee={this.state.gamesToSee}
            spot={this.state.spot}
            whichEventPick={this.whichEventPick.bind(this)}
            onChange={this.onChange.bind(this)}
            timeline1={this.state.allowScroll1}
            timeline2={this.state.allowScroll2}
            eventSelected={this.state.eventSelected}
            region={this.state.region}
          />
          <EventDisplay
            gamesToSee={this.state.gamesToSee}
            timeline1={this.state.allowScroll1}
            spot={this.state.spot}
            eventDisplay1={this.state.eventDisplay1}
            eventDisplay2={this.state.eventDisplay2}
            playerInfo1={this.state.playerID1}
            champImg1={this.state.champImg1}
            patch1={this.state.patch1}
            timeline2={this.state.allowScroll2}
            playerInfo2={this.state.playerID2}
            champImg2={this.state.champImg2}
            patch2={this.state.patch2}
            region={this.state.region}
          />
          <Chart
            gamesToSee={this.state.gamesToSee}
            timeline1={this.state.allowScroll1}
            spot={this.state.spot}
            selData1={this.state.selData1}
            playerInfo1={this.state.playerID1}
            champName1={this.state.champImg1}
            maxForStat1={this.state.maxForStat1}
            timeline2={this.state.allowScroll2}
            selData2={this.state.selData2}
            playerInfo2={this.state.playerID2}
            eventSelected={this.state.eventSelected}
            champName2={this.state.champImg2}
            maxForStat2={this.state.maxForStat2}
            region={this.state.region}
          />
          <ChampBuild
            gamesToSee={this.state.gamesToSee}
            timeline1={this.state.allowScroll1}
            spot={this.state.spot}
            playerInfo1={this.state.playerID1}
            champName1={this.state.champImg1}
            itemStorage1={this.state.itemStorage1}
            addItems1={this.state.addItems1}
            patch1={this.state.patch1}
            timeline2={this.state.allowScroll2}
            playerInfo2={this.state.playerID2}
            champName2={this.state.champImg2}
            itemStorage2={this.state.itemStorage2}
            addItems2={this.state.addItems2}
            patch2={this.state.patch2}
            whichRole1={this.state.whichRole1}
            whichRole2={this.state.whichRole2}
            region={this.state.region}
          />
          <ChampImage
            gamesToSee={this.state.gamesToSee}
            timeline1={this.state.allowScroll1}
            playerInfo1={this.state.playerID1}
            png1={this.state.png1}
            champImg1={this.state.champImg1}
            spot={this.state.spot}
            patch1={this.state.patch1}
            timeline2={this.state.allowScroll2}
            playerInfo2={this.state.playerID2}
            png2={this.state.png2}
            champImg2={this.state.champImg2}
            patch2={this.state.patch2}
            region={this.state.region}
          />
        </div>
      );
    }

    // MATCH LIST BUTTONS
    if (this.state.toggle === true) {
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
            region={this.state.region}
            updateRegion={this.updateRegion.bind(this)}
            gamesToSee={this.state.gamesToSee}
          />
          <WhosGames summonersName={this.state.whosGames} />
          <GamesOnSR
            gamesToSee={this.state.gamesToSee}
            res={this.state.res}
            onClick={this.handleClick.bind(this)}
            numGamesSee={this.numGamesSee.bind(this)}
          />
        </div>
      );
    }
  }
}
