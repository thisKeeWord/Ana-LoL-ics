import React from 'react';
import $ from 'jquery';

class ChampBuild extends React.Component {
  // GET PLAYER'S ITEM BUILD
  itemization() {
    if ((this.props.timeline1 && this.props.gamesToSee === 1) || (this.props.timeline2 && this.props.gamesToSee === 2)) {
      let itemsPerGame = [];

      for (let i = 1; i <= this.props.gamesToSee; i++) {
        let searchEvents = this.props["timeline" + i.toString()];
        let itemStorage = this.props["itemStorage" + i.toString()];
        let eachPlayersItems = [];

        // 10 ARRAYS, 1 PER PLAYER
        this.props["playerInfo" + i.toString()].forEach(player => {
          let itemStore = [];
          let findTrinket = false;
          let potions, biscuits, controlWards, consumables = [];

          // AT CURRENT SPOT IN TIMELINE
          if (searchEvents[this.props.spot]) {
            // health potion is 2003

            for (let j = 0; j <= this.props.spot; j++) {
              if (searchEvents[j][0].events) {
                potions = 0, biscuits = 0, controlWards = 0;
                for (let k = 0; k < searchEvents[j][0].events.length; k++) {
                  let findItem = searchEvents[j][0].events[k].itemId;

                  // ITEM_PURCHASED
                  if (searchEvents[j][0].events[k].eventType === "ITEM_PURCHASED" && searchEvents[j][0].events[k].participantId === player[0]) {
                      itemStore.push(findItem);
                  }

                  // ITEM_DESTROYED
                  if (searchEvents[j][0].events[k].eventType === "ITEM_DESTROYED" && searchEvents[j][0].events[k].participantId === player[0]) {
                    if (itemStore.lastIndexOf(findItem) !== -1) {
                      itemStore.splice(itemStore.lastIndexOf(findItem), 1);
                    }
                  }

                  // ITEM_SOLD
                  if (searchEvents[j][0].events[k].eventType === "ITEM_SOLD" && searchEvents[j][0].events[k].participantId === player[0]) {
                    if (itemStore.lastIndexOf(findItem) !== -1) {
                      itemStore.splice(itemStore.lastIndexOf(findItem), 1);
                    }
                  }

                  // ITEM_UNDO, PLAYER MAY HAVE "DESTROYED" RECIPE ITEMS TO GET NEW ONE
                  if (searchEvents[j][0].events[k].eventType === "ITEM_UNDO" && searchEvents[j][0].events[k].participantId === player[0]) {
                    if (searchEvents[j][0].events[k].itemAfter === 0) {
                      let checkItemEvent = searchEvents[j][0].events[k].itemBefore;
                      // IF PLAYER PURCHASES POTION AND UNDO'S THE PURCHASE
                      if (checkItemEvent === 2003) {
                        potions--;
                      }
                      if (checkItemEvent === 2010) {
                        biscuits--;
                      }
                      if (checkItemEvent === 2055) {
                        controlWards--;
                      }
                      itemStore.splice(itemStore.lastIndexOf(searchEvents[j][0].events[k].itemBefore), 1);
                      let retrieveItem = k;
                      while (searchEvents[j][0].events[retrieveItem] && searchEvents[j][0].events[retrieveItem].eventType !== "ITEM_PURCHASED" && findItem !== checkItemEvent) {
                        if (itemStorage[checkItemEvent].from) {
                          if (searchEvents[j][0].events[retrieveItem].eventType === "ITEM_DESTROYED" && itemStorage[checkItemEvent].from.includes(searchEvents[j][0].events[retrieveItem].itemId.toString())) {
                            itemStore.push(searchEvents[j][0].events[retrieveItem].itemId);
                          }
                        }
                        retrieveItem--;
                      } 
                    }
                  }

                  // DUPLICATE TRINKET
                  if ((findItem === 3340 || findItem === 3341 || findItem === 3363 || findItem === 3364) && itemStore.indexOf(findItem) !== -1 && itemStore.lastIndexOf(findItem) !== itemStore.indexOf(findItem)) {
                    itemStore.splice(itemStore.lastIndexOf(findItem), 1);
                  }
                  if ((itemStore.includes(2003) && findItem === 2003) && searchEvents[j][0].events[k].participantId === player[0])  {
                    potions++;
                  }
                  if ((itemStore.includes(2010) && findItem === 2010) && searchEvents[j][0].events[k].participantId === player[0])  {
                    biscuits++;
                  }
                  if ((itemStore.includes(2055) && findItem === 2055) && searchEvents[j][0].events[k].participantId === player[0])  {
                    controlWards++;
                  }
                }

                // NO TRINKET
                if (player[0] <= 5 && findTrinket === false && searchEvents[j][0].participantFrames[player[0]].position) {
                  if (Math.sqrt(Math.pow(searchEvents[j][0].participantFrames[player[0]].position.x - 703, 2) + Math.pow(searchEvents[j][0].participantFrames[player[0]].position.y - 703, 2)) > 4184) {
                    if (!itemStore.includes(3340) && !itemStore.includes(3341) && !itemStore.includes(3363) && !itemStore.includes(3364)) {
                      itemStore.push(3340);
                      findTrinket = true;
                    }
                  }
                }
                if (player[0] > 5 && findTrinket === false && searchEvents[j][0].participantFrames[player[0]].position) {
                  if (Math.sqrt(Math.pow(searchEvents[j][0].participantFrames[player[0]].position.x - 14130, 2) + Math.pow(searchEvents[j][0].participantFrames[player[0]].position.y - 14130, 2)) > 4204) {
                    if (!itemStore.includes(3340) && !itemStore.includes(3341) && !itemStore.includes(3363) && !itemStore.includes(3364)) {
                      itemStore.push(3340);
                      findTrinket = true;
                    }
                  }
                }
              }

            }
            consumables.push({ 2003: potions, 2010: biscuits, 2055: controlWards });
          }

          // IF SCROLL EXCEEDS GAME LENGTH
          if (!searchEvents[this.props.spot]) {
            for (let z = 0; z < searchEvents.length; z++) {
              if (searchEvents[z][0].events) {
                potions = 0, biscuits = 0, controlWards = 0;
                for (let k = 0; k < searchEvents[z][0].events.length; k++) {
                  let findItem = searchEvents[z][0].events[k].itemId;

                  // ITEM_PURCHASED
                  if (searchEvents[z][0].events[k].eventType === "ITEM_PURCHASED" && searchEvents[z][0].events[k].participantId === player[0]) {
                    itemStore.push(findItem);
                  }

                  // ITEM_DESTROYED
                  if (searchEvents[z][0].events[k].eventType === "ITEM_DESTROYED" && searchEvents[z][0].events[k].participantId === player[0]) {
                    if (itemStore.lastIndexOf(findItem) !== -1) {
                      itemStore.splice(itemStore.lastIndexOf(findItem), 1);
                    }
                  }

                  // ITEM_SOLD
                  if (searchEvents[z][0].events[k].eventType === "ITEM_SOLD" && searchEvents[z][0].events[k].participantId === player[0]) {
                    if (itemStore.lastIndexOf(findItem) !== -1) {
                      itemStore.splice(itemStore.lastIndexOf(findItem), 1);
                    }
                  }

                  // ITEM_UNDO, PLAYER MAY HAVE "DESTROYED" RECIPE ITEMS TO GET NEW ONE
                  if (searchEvents[z][0].events[k].eventType === "ITEM_UNDO" && searchEvents[z][0].events[k].participantId === player[0]) {
                    if (searchEvents[z][0].events[k].itemAfter === 0) {
                      let checkItemEvent = searchEvents[z][0].events[k].itemBefore;
                      // potions and control wards
                      if (checkItemEvent === 2003) {
                        potions--;
                      }
                      if (checkItemEvent === 2010) {
                        biscuits--;
                      }
                      if (checkItemEvent === 2055) {
                        controlWards--;
                      }
                      itemStore.splice(itemStore.lastIndexOf(searchEvents[z][0].events[k].itemBefore), 1);
                      let retrieveItem = k;
                      while (searchEvents[z][0].events[retrieveItem] && searchEvents[z][0].events[retrieveItem].eventType !== "ITEM_PURCHASED" && findItem !== checkItemEvent) {
                        if (itemStorage[checkItemEvent].from) {
                          if (searchEvents[z][0].events[retrieveItem].eventType === "ITEM_DESTROYED" && itemStorage[checkItemEvent].from.includes(searchEvents[z][0].events[retrieveItem].itemId.toString())) {
                            itemStore.push(searchEvents[z][0].events[retrieveItem].itemId);
                          }
                        }
                        retrieveItem--;
                      } 
                    }
                  }
                  if ((itemStore.includes(2003) && findItem === 2003) && searchEvents[j][0].events[k].participantId === player[0])  {
                    potions++;
                  }
                  if ((itemStore.includes(2010) && findItem === 2010) && searchEvents[j][0].events[k].participantId === player[0])  {
                    biscuits++;
                  }
                  if ((itemStore.includes(2055) && findItem === 2055) && searchEvents[j][0].events[k].participantId === player[0])  {
                    controlWards++;
                  }
                }
              }
            }
            consumables.push({ 2003: potions, 2010: biscuits, 2055: controlWards });
          }
          console.log(itemStore, consumables);
          eachPlayersItems.push([itemStore, consumables]);
        })
        itemsPerGame.push(eachPlayersItems);  
      }
      return itemsPerGame;
    }
  }

  appendItems(showItems) {
    console.log(showItems, "showItems");
    // REMOVE CONSTANT CREATIONS OF ICONS AND BUILD IMAGES
    if ((this.props.addItems1 && this.props.gamesToSee === 1) || (this.props.addItems2 && this.props.gamesToSee === 2)) {
      for (let i = 1; i <= this.props.gamesToSee; i++) {
        let colorOfTeam = 'blue';

        if (document.getElementById("allItems" + i * this.props.gamesToSee)) {
          $(".champBuilds" + i * this.props.gamesToSee).remove();
          $(".champIcons" + i * this.props.gamesToSee).remove();
          $("allItems" + i * this.props.gamesToSee).remove();
        }
        if (document.getElementById("laneRole" + i * this.props.gamesToSee)) {
          $("laneRole" + i * this.props.gamesToSee).remove();
        }
      
        // EACH PLAYER'S BUILDS
        for (let w = 0; w < this.props["playerInfo" + i.toString()].length; w++) {
          if (w > 4) {
            colorOfTeam = 'purple';
          }

          // WID=WIDTH HARDCODED FOR NOW
          let wid = 466;
          let build = this.props["playerInfo" + i.toString()][w];

          // FLIP SECOND BUILD FOR SYMMETRY
          if (i === 2) {
            d3.select("#whichTeamBuild" + colorOfTeam + w + '0').remove();
            this.props["addItems" + i.toString()].append('svg:g')
              .attr("class", "champIcons" + i * this.props.gamesToSee)
              .selectAll("image")
              .data([[]])
              .enter()
                .append("svg:image")
                .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.props["patch" + i.toString()] +'/img/champion/' + this.props["champName" + i.toString()][build[1]] + '.png')
                .attr('y', w * 45)
                .attr('x', 264)
                .style({ 'width': '40px', 'height': '40px', 'marginBottom': '3px' });

            this.props["addItems" + i.toString()].append('svg:g')
              .attr("id", "whichTeamBuild" + colorOfTeam + w + '0')
              .selectAll("rect")
              .data([[]])
                .enter()
                  .append("rect")
                    .attr('y', w * 45)
                    .attr('x', 264)
                    .style({ 'stroke-width': 2, 'stroke': colorOfTeam.toString() })
                    .attr('height', 39)
                    .attr('width', 39)
                    .attr("fill", "transparent");
          
            this.props["addItems" + i.toString()].append('svg:g')
              .attr('class', 'champBuilds' + i * this.props.gamesToSee)
              .selectAll("image")
              .data(showItems[i-1][w][0])
              .enter()
                .append("svg:image")
                .attr('xlink:href', d => {
                  if (d) {
          // 
                    return ("http://ddragon.leagueoflegends.com/cdn/" + this.props["patch" + i.toString()] + "/img/item/" + d + ".png");
                  }
                })
                .attr("x", (d, i) => {
                  return 300 - 30 * i;
                })
                .attr("y", 45 * w + 10)
                .style({ 'width': '30px', 'height': '30px' });

            this.props["whichRole" + i.toString()].append('svg:g')
              .attr('class', 'champRoles' + i * this.props.gamesToSee)
              .selectAll("text")
              .data([ this.props["playerInfo" + i.toString()][w][2], this.props["playerInfo" + i.toString()][w][3] ])
              .enter()
                .append("text")
                .text((d, i) => {
                  if (d === "DUO_SUPPORT") {
                    return "support";
                  }
                  if (d === "DUO_CARRY") {
                    return "adcarry";
                  }
                  if (d === "NONE") {
                    return;
                  }
                  return d.toLowerCase();
                })
                .attr("x", (d, i) => {
                  return 1;
                })
                .attr("y", (d, i) => {
                  return 45 * w + (((i+1) * 10) + 10);
                })
                .attr("font-size", "10px")
                .attr("text-anchor", "start")
                .style({ 'width': '20px', 'height': '20px'})
                .attr("fill", "#cccccc");
          }
          else {
            d3.select("#whichTeamBuild" + colorOfTeam + w).remove();
            this.props["addItems" + i.toString()].append('svg:g')
              .attr("class", "champIcons" + i * this.props.gamesToSee)
              .selectAll("image")
              .data([[]])
              .enter()
                .append("svg:image")
                .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.props["patch" + i.toString()] +'/img/champion/' + this.props["champName" + i.toString()][build[1]] + '.png')
                .attr('y', w * 45)
                .style({ 'width': '40px', 'height': '40px', 'marginBottom': '3px', 'float': 'right'});

            this.props["addItems" + i.toString()].append('svg:g')
              .attr("id", "whichTeamBuild" + colorOfTeam + w)
              .selectAll("rect")
              .data([[]])
                .enter()
                  .append("rect")
                    .attr('y', w * 45)
                    .style({ 'stroke-width': 2, 'stroke': colorOfTeam.toString() })
                    .attr('height', 39)
                    .attr('width', 39)
                    .attr("fill", "transparent");
          
            this.props["addItems" + i.toString()].append('svg:g')
              .attr('class', 'champBuilds' + i * this.props.gamesToSee)
              .selectAll("image")
              .data(showItems[i-1][w][0])
              .enter()
                .append("svg:image")
                .attr('xlink:href', d => {
                  console.log("ORDER 1");
                  if (d) {
                    return ("http://ddragon.leagueoflegends.com/cdn/" + this.props["patch" + i.toString()] + "/img/item/" + d + ".png");
                  }
                })
                .attr("x", (d, i) => {
                  return 30 * i + 40;
                })
                .attr("y", 45 * w + 10)
                .style({ 'width': '30px', 'height': '30px' });


                      // append consumables
            this.props["addItems" + i.toString()].append('svg:g')
              .attr('class', 'consumableCount' + i * this.props.gamesToSee)
                .selectAll("text")
                .data(showItems[i-1][w][0])
                .enter()
                  .append("text")
                    .text(d => {
                      
                      console.log("ORDER 222")
                      if (showItems[i-1][w][1][0][d] > 0) {
                        return showItems[i-1][w][1][0][d];
                      }
                    })
                    .attr("x", (d, i) => {
                      return 30 * i + 40;
                    })
                    .attr("y", 45 * w + 15)
                    .style({ 'font-size': '15px' });

            this.props["whichRole" + i.toString()].append('svg:g')
              .attr('id', 'champRoles' + i * this.props.gamesToSee)
              .selectAll("text")
              .data([ this.props["playerInfo" + i.toString()][w][2], this.props["playerInfo" + i.toString()][w][3] ])
              .enter()
                .append("text")
                .text((d, i) => {
                  if (d === "DUO_SUPPORT") {
                    return "support";
                  }
                  if (d === "DUO_CARRY") {
                    return "adcarry";
                  }
                  if (d === "NONE") {
                    return;
                  }
                  return d.toLowerCase();
                })
                .attr("x", (d, i) => {
                  return 49;
                })
                .attr("y", (d, i) => {
                  return 45 * w + (((i+1) * 10) + 10);
                })
                .attr("font-size", "10px")
                .attr("text-anchor", "end")
                .style({ 'width': '20px', 'height': '20px'})
                .attr("fill", "#cccccc");
          }
        }
      }
    }
  }
    
  render() {
    let showItems = this.itemization();
    if (!showItems && this.props.gamesToSee === 1) {
      return (
        <div id="builds" />
      )
    }

    let items = this.appendItems(showItems);

    // ARRAY MAY HAVE NUMBER, SO FIND IT AND GET CHAMP IMG
    // GAME 1
    if (this.props.gamesToSee === 1) {
      return (
        <div>
          <div id={"builds" + 1 * this.props.gamesToSee}>
            {items}
          </div>
          <div id={"roleLane" + 1 * this.props.gamesToSee} />
        </div>
      )
    }

    // GAME 2
    if (this.props.gamesToSee === 2) {
      let arr = [1, 2];
      return (
        <div>
          { arr.map(i => {
              return (
                <div>
                  <div id={"builds" + i * this.props.gamesToSee} key={i}>
                    {items}
                  </div>
                  <div id={"roleLane" + i * this.props.gamesToSee} key={i+i} />
                </div>
              )
            })
          }
        </div>
      )
    }
  }
}

module.exports=ChampBuild;