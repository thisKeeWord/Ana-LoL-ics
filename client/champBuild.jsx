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
    // let bunchOItems = [];
    if (!document.getElementById("allItems")) {
      this.props.addItemVisuals(showItems);
    }

    // // NESTING FOR LOOPS TO PUSH IMAGES TO NEW ARRAY FROM NESTED ARRAYS
    // for (let y = 0; y < showItems.length; y++) {
    //   bunchOItems.push(this.props.champName[this.props.playerInfo[y][1]]);
    //   for (let z = 0; z < showItems[y].length; z++) {
    //     bunchOItems.push(showItems[y][z]);
    //   }
    // }
    // for (let y = 0; y < showItems.length; y++) {
    //   showItems[y].push(this.props.champName[this.props.playerInfo[y][1]])
    // }
    if(this.props.addItems) {
      // $(".itemIcon").first().remove();
      let yAttr = 0;
      if (document.getElementsByClassName("champBuilds")) {
        $(".champBuilds").first().remove();
      }
      showItems.forEach(i => {
        this.props.addItems.selectAll("#itemIcon" + yAttr)
          .append('svg:g')
          .attr('class', 'champBuilds')
          .selectAll("image")
          .data(i[0])
          .enter()
            .append("svg:image")
            .attr('xlink:href', d => {
              // return d.forEach(res => {
              //   console.log(d, res)
                return ("http://ddragon.leagueoflegends.com/cdn/6.2.1/img/item/" + d + ".png");
              })
            })
            .attr('x', () => { return yAttr * 24 })
            // .attr('y', d => { return yScale(d[1]) })
            .style({ 'width': '24px', 'height': '24px' });

        yAttr++;

         
    }
  }
    
   

  render() {
    let showItems = this.itemization();
    if (!showItems) {
      return (
        <div id="items" />
      )
    }
    // showItems = [].concat.apply([], showItems);
    // return (
    //   <div id="kudos">
    //     { showItems.map(i => {
    //        return (
    //           <img src={"http://ddragon.leagueoflegends.com/cdn/6.2.1/img/item/" + i + ".png"} height={10} width={10} />
    //         )
    //       })
    //     }
    //   </div>
    // )
    // bunchOItems.map(i =>  {
    //         if (typeof i === 'number') {
    //           return (
    //             <div id="itemsPerChamp">
    //               <img src={"http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/" + this.props.champName[i] + ".png" } height={25} width={25} />
    //             </div>
    //           )
    //         }
    //         return i;
    //       })

    

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