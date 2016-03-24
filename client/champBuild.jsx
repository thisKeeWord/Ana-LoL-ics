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

          // AT CURRENT SPOT IN TIMELINE
          if (searchEvents[this.props.spot]) {

            for (let j = 0; j <= this.props.spot; j++) {
              if (searchEvents[j][0].events) {
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
                }
              }
            }
          }

          // IF SCROLL EXCEEDS GAME LENGTH
          if (!searchEvents[this.props.spot]) {
            for (let z = 0; z < searchEvents.length; z++) {
              if (searchEvents[z][0].events) {
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
                }
              }
            }
          }
          eachPlayersItems.push([itemStore])
        })
        itemsPerGame.push(eachPlayersItems);  
      }
      return itemsPerGame;
    }
  }

  appendItems(showItems) {
 
    // REMOVE CONSTANT CREATIONS OF ICONS AND BUILD IMAGES
    if ((this.props.addItems1 && this.props.gamesToSee === 1) || (this.props.addItems2 && this.props.gamesToSee === 2)) {
      for (let i = 1; i <= this.props.gamesToSee; i++) {
        if (document.getElementById("allItems" + i * this.props.gamesToSee)) {
          $(".champBuilds" + i * this.props.gamesToSee).remove();
          $(".champIcons"+ i * this.props.gamesToSee).remove();
        }
      

        // EACH PLAYER'S BUILDS
        for (let w = 0; w < this.props["playerInfo" + i.toString()].length; w++) {

          // WID=WIDTH HARDCODED FOR NOW
          let wid = 466;
          let build = this.props["playerInfo" + i.toString()][w];

          // FLIP SECOND BUILD FOR SYMMETRY
          if (i === 2) {
            this.props["addItems" + i.toString()].append('svg:g')
              .attr("class", "champIcons" + i * this.props.gamesToSee)
              .selectAll("image")
              .data([[]])
              .enter()
                .append("svg:image")
                .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.props["patch" + i.toString()] +'/img/champion/' + this.props["champName" + i.toString()][build[1]] + '.png')
                .attr('y', w * 40)
                .attr('x', 264)
                .style({ 'width': '40px', 'height': '40px', 'marginBottom': '3px' });
          
            this.props["addItems" + i.toString()].append('svg:g')
              .attr('class', 'champBuilds' + i * this.props.gamesToSee)
              .selectAll("image")
              .data(showItems[i-1][w][0])
              .enter()
                .append("svg:image")
                .attr('xlink:href', d => {
                  if (d) {
                    return ("http://ddragon.leagueoflegends.com/cdn/" + this.props["patch" + i.toString()] + "/img/item/" + d + ".png");
                  }
                })
                .attr("x", (d, i) => {
                  return 240 - 24 * i;
                })
                .attr("y", 40 * w + 10)
                .style({ 'width': '24px', 'height': '24px' });
          }
          else {
            this.props["addItems" + i.toString()].append('svg:g')
              .attr("class", "champIcons" + i * this.props.gamesToSee)
              .selectAll("image")
              .data([[]])
              .enter()
                .append("svg:image")
                .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.props["patch" + i.toString()] +'/img/champion/' + this.props["champName" + i.toString()][build[1]] + '.png')
                .attr('y', w * 40)
                .style({ 'width': '40px', 'height': '40px', 'marginBottom': '3px', 'float': 'right'});
          
            this.props["addItems" + i.toString()].append('svg:g')
              .attr('class', 'champBuilds' + i * this.props.gamesToSee)
              .selectAll("image")
              .data(showItems[i-1][w][0])
              .enter()
                .append("svg:image")
                .attr('xlink:href', d => {
                  if (d) {
                    return ("http://ddragon.leagueoflegends.com/cdn/" + this.props["patch" + i.toString()] + "/img/item/" + d + ".png");
                  }
                })
                .attr("x", (d, i) => {
                  return 24 * i + 40;
                })
                .attr("y", 40 * w + 10)
                .style({ 'width': '24px', 'height': '24px' });
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

    let items = this.appendItems(showItems)

    // ARRAY MAY HAVE NUMBER, SO FIND IT AND GET CHAMP IMG
    // GAME 1
    if (this.props.gamesToSee === 1) {
      return (
        <div id={"builds" + 1 * this.props.gamesToSee}>
          {items}
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
                  <div id={"builds" + i * this.props.gamesToSee}>
                  {items}
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