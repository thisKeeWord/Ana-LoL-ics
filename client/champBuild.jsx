import React from 'react';
import $ from 'jquery';


class ChampBuild extends React.Component {
  // GET PLAYER'S ITEM BUILD
  itemization() {
    if (this.props.timeline1.length) {
      console.log('yoyoyoyo')
      const eachPlayersItems1 = [];
      const searchEvents1 = this.props.timeline1;
      const itemStorage1 = this.props.itemStorage1;

      // 10 ARRAYS, 1 PER PLAYER
      this.props.playerInfo1.forEach(player => {
        const itemStore1 = [];

        // AT CURRENT SPOT IN TIMELINE
        for (let j = 0; j <= this.props.spot; j++) {
          if (searchEvents1[j][0].events) {
            for (let k = 0; k < searchEvents1[j][0].events.length; k++) {
              const findItem1 = searchEvents1[j][0].events[k].itemId;

              // ITEM_PURCHASED
              if (searchEvents1[j][0].events[k].eventType === "ITEM_PURCHASED" && searchEvents1[j][0].events[k].participantId === player[0]) {
                itemStore1.push(findItem1);
              }

              // ITEM_DESTROYED
              if (searchEvents1[j][0].events[k].eventType === "ITEM_DESTROYED" && searchEvents1[j][0].events[k].participantId === player[0]) {
                if (itemStore1.lastIndexOf(findItem1) !== -1) {
                  itemStore1.splice(itemStore1.lastIndexOf(findItem1), 1);
                }
              }

              // ITEM_SOLD
              if (searchEvents1[j][0].events[k].eventType === "ITEM_SOLD" && searchEvents1[j][0].events[k].participantId === player[0]) {
                if (itemStore1.lastIndexOf(findItem1) !== -1) {
                  itemStore1.splice(itemStore1.lastIndexOf(findItem1), 1);
                }
              }

              // ITEM_UNDO, PLAYER MAY HAVE "DESTROYED" RECIPE ITEMS TO GET NEW ONE
              if (searchEvents1[j][0].events[k].eventType === "ITEM_UNDO" && searchEvents1[j][0].events[k].participantId === player[0]) {
                if (searchEvents1[j][0].events[k].itemAfter === 0) {
                  const checkItemEvent1 = searchEvents1[j][0].events[k].itemBefore;
                  itemStore1.splice(itemStore1.lastIndexOf(searchEvents1[j][0].events[k].itemBefore), 1);
                  let retrieveItem1 = k;
                  while (searchEvents1[j][0].events[retrieveItem1] && searchEvents1[j][0].events[retrieveItem1].eventType !== "ITEM_PURCHASED" && findItem1 !== checkItemEvent1) {
                    if (itemStorage1[checkItemEvent1].from) {
                      if (searchEvents1[j][0].events[retrieveItem1].eventType === "ITEM_DESTROYED" && itemStorage1[checkItemEvent1].from.includes(searchEvents1[j][0].events[retrieveItem1].itemId.toString())) {
                        itemStore1.push(searchEvents1[j][0].events[retrieveItem1].itemId);
                      }
                    }
                  retrieveItem1--;
                  } 
                }
              }
            }
          }
        }
      eachPlayersItems1.push([itemStore1])
      })
      return eachPlayersItems1;
    }
    if (this.props.timeline2.length) {
      console.log('wassup23592')
      const eachPlayersItems2 = [];
      const searchEvents2 = this.props.timeline;
      const itemStorage2 = this.props.itemStorage2;

      // 10 ARRAYS, 1 PER PLAYER
      this.props.playerInfo2.forEach(player => {
        const itemStore2 = [];

        // AT CURRENT SPOT IN TIMELINE
        for (let j = 0; j <= this.props.spot; j++) {
          if (searchEvents2[j][0].events) {
            for (let k = 0; k < searchEvents2[j][0].events.length; k++) {
              const findItem2 = searchEvents2[j][0].events[k].itemId;

              // ITEM_PURCHASED
              if (searchEvents2[j][0].events[k].eventType === "ITEM_PURCHASED" && searchEvents2[j][0].events[k].participantId === player[0]) {
                itemStore2.push(findItem2);
              }

              // ITEM_DESTROYED
              if (searchEvents2[j][0].events[k].eventType === "ITEM_DESTROYED" && searchEvents2[j][0].events[k].participantId === player[0]) {
                if (itemStore2.lastIndexOf(findItem2) !== -1) {
                  itemStore2.splice(itemStore2.lastIndexOf(findItem2), 1);
                }
              }

              // ITEM_SOLD
              if (searchEvents2[j][0].events[k].eventType === "ITEM_SOLD" && searchEvents2[j][0].events[k].participantId === player[0]) {
                if (itemStore2.lastIndexOf(findItem2) !== -1) {
                  itemStore2.splice(itemStore2.lastIndexOf(findItem2), 1);
                }
              }

              // ITEM_UNDO, PLAYER MAY HAVE "DESTROYED" RECIPE ITEMS TO GET NEW ONE
              if (searchEvents2[j][0].events[k].eventType === "ITEM_UNDO" && searchEvents2[j][0].events[k].participantId === player[0]) {
                if (searchEvents2[j][0].events[k].itemAfter === 0) {
                  const checkItemEvent2 = searchEvents2[j][0].events[k].itemBefore;
                  itemStore2.splice(itemStore2.lastIndexOf(searchEvents2[j][0].events[k].itemBefore), 1);
                  let retrieveItem2 = k;
                  while (searchEvents2[j][0].events[retrieveItem2] && searchEvents2[j][0].events[retrieveItem2].eventType !== "ITEM_PURCHASED" && findItem2 !== checkItemEvent2) {
                    if (itemStorage2[checkItemEvent2].from) {
                      if (searchEvents2[j][0].events[retrieveItem2].eventType === "ITEM_DESTROYED" && itemStorage2[checkItemEvent2].from.includes(searchEvents2[j][0].events[retrieveItem2].itemId.toString())) {
                        itemStore2.push(searchEvents2[j][0].events[retrieveItem2].itemId);
                      }
                    }
                  retrieveItem2--;
                  } 
                }
              }
            }
          }
        }
      eachPlayersItems2.push([itemStore2])
      })
      return eachPlayersItems2;
    }
  }

  appendItems(showItems) {

    // GAME 1
    if(this.props.addItems1 && this.props.totalRenders === 1) {

      // REMOVE CONSTANT CREATIONS OF ICONS AND BUILD IMAGES
      for (let i = 1; i <= this.props.gamesToSee; i++) {
        if (document.getElementById("allItems" + i)) {
          $(".champBuilds" + i).remove();
          $(".champIcons"+ i).remove();
        }
      

        // EACH PLAYER'S BUILDS
        for (let w = 0; w < this.props.playerInfo1.length; w++) {

          // WID=WIDTH HARDCODED FOR NOW
          const wid = 466;
          const build1 = this.props.playerInfo1[w];

          this.props.addItems1.append('svg:g')
            .attr("class", "champIcons" + i)
            .selectAll("image")
            .data([[]])
            .enter()
              .append("svg:image")
              .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.props.patch1 +'/img/champion/' + this.props.champName1[build1[1]] + '.png')
              .attr('y', w * 40)
              .style({ 'width': '40px', 'height': '40px', 'marginBottom': '3px'});
        
          this.props.addItems1
            .append('svg:g')
            .attr('class', 'champBuilds' + i)
            .selectAll("image")
            .data(showItems[w][0])
            .enter()
              .append("svg:image")
              .attr('xlink:href', d => {
                if (d) {
                  return ("http://ddragon.leagueoflegends.com/cdn/" + this.props.patch1 + "/img/item/" + d + ".png");
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

    // GAME 2
    if(this.props.addItems2 && this.props.totalRenders === 2) {

      // REMOVE CONSTANT CREATIONS OF ICONS AND BUILD IMAGES
      for (let i = 1; i <= this.props.gamesToSee; i++) {
        if (document.getElementById("allItems" + i)) {
          $(".champBuilds" + i).remove();
          $(".champIcons"+ i).remove();
        }
      

        // EACH PLAYER'S BUILDS
        for (let w = 0; w < this.props.playerInfo2.length; w++) {

          // WID=WIDTH HARDCODED FOR NOW
          const wid = 466;
          const build2 = this.props.playerInfo2[w];

          this.props.addItems2.append('svg:g')
            .attr("class", "champIcons" + i)
            .selectAll("image")
            .data([[]])
            .enter()
              .append("svg:image")
              .attr('xlink:href', 'http://ddragon.leagueoflegends.com/cdn/' + this.props.patch2 +'/img/champion/' + this.props.champName2[build2[1]] + '.png')
              .attr('y', w * 40)
              .style({ 'width': '40px', 'height': '40px', 'marginBottom': '3px'});
        
          this.props.addItems2
            .append('svg:g')
            .attr('class', 'champBuilds' + i)
            .selectAll("image")
            .data(showItems[w][0])
            .enter()
              .append("svg:image")
              .attr('xlink:href', d => {
                if (d) {
                  return ("http://ddragon.leagueoflegends.com/cdn/" + this.props.patch2 + "/img/item/" + d + ".png");
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
    
  render() {
    const showItems = this.itemization();
    if (!showItems) {
      return (
        <div id="builds" />
      )
    }

    const items = this.appendItems(showItems)
    // ARRAY MAY HAVE NUMBER, SO FIND IT AND GET CHAMP IMG
    // GAME 1
    if (this.props.totalRenders === 1) {
      return (
        <div id={"builds" + 1 * this.props.gamesToSee}>
          {items}
        </div>
      )
    }

    // GAME 2
    if (this.props.totalRenders === 2) {
      return (
        <div id={"builds" + 2 * this.props.gamesToSee}>
          {items}
        </div>
      )
    }
  }
}

module.exports=ChampBuild;