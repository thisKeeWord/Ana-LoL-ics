import React from 'react';
import $ from 'jquery';
import stuff from './../stuff.js';


class ChampBuild extends React.Component {
  // GET PLAYER'S ITEM BUILD
  itemization() {
    if (this.props.timeline.length) {
      let eachPlayersItems = [];
      let searchEvents = this.props.timeline;
      let itemStorage = this.props.itemStorage;

      // 10 ARRAYS, 1 PER PLAYER
      this.props.playerInfo.forEach(player => {
        let itemStore = [];

        // AT CURRENT SPOT IN TIMELINE
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
                  while (searchEvents[j][0].events[retrieveItem].eventType !== "ITEM_PURCHASED" && findItem !== checkItemEvent) {
                    if (searchEvents[j][0].events[retrieveItem].eventType === "ITEM_DESTROYED" && itemStorage[checkItemEvent].from.includes(searchEvents[j][0].events[retrieveItem].itemId.toString())) {
                      itemStore.push(searchEvents[j][0].events[retrieveItem].itemId);
                    }
                  retrieveItem--;
                  } 
                }
              }
            }
          }
        }
      eachPlayersItems.push([itemStore])
      })
      return eachPlayersItems;
    }
  }

  appendItems(showItems) {
    if(this.props.addItems) {

      // REMOVE CONSTANT CREATIONS OF ICONS AND BUILD IMAGES
      if (document.getElementById("allItems")) {
        $(".champBuilds").remove();
        $(".champIcons").remove();
      }

      // EACH PLAYER'S BUILDS
      for (let w = 0; w < this.props.playerInfo.length; w++) {

        // WID=WIDTH HARDCODED FOR NOW
        let wid = 466;
        let build = this.props.playerInfo[w];

        this.props.addItems.append('svg:g')
          .attr("class", "champIcons")
          .selectAll("image")
          .data([[]])
          .enter()
            .append("svg:image")
            .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/' + this.props.champName[build[1]] + '.png')
            .attr('y', w * 24)
            .style({ 'width': '24px', 'height': '24px' });
      
        this.props.addItems
          .append('svg:g')
          .attr('class', 'champBuilds')
          .selectAll("image")
          .data(showItems[w][0])
          .enter()
            .append("svg:image")
            .attr('xlink:href', d => {
              if (d) {
                return ("http://ddragon.leagueoflegends.com/cdn/6.2.1/img/item/" + d + ".png");
              }
            })
            .attr("x", (d, i) => {
              return 24 * (i+1)
            })
            .attr("y", 24 * w)
            .style({ 'width': '24px', 'height': '24px' });
      }   
    }
  }
    
   

  render() {
    let showItems = this.itemization();
    if (!showItems) {
      return (
        <div id="items" />
      )
    }

    let items = this.appendItems(showItems)
    // ARRAY MAY HAVE NUMBER, SO FIND IT AND GET CHAMP IMG
    return (
      <div id="kudos">
        {items}
      </div>
    )
  }
}

module.exports=ChampBuild;