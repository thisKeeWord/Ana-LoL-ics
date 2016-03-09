import React from 'react';
import async from 'async';

class EventDisplay extends React.Component {
	// LOGS CHAMPION KILLS PER FRAME
	log() {
		let interaction = [];
		if (this.props.timeline.length && this.props.timeline[this.props.spot][0].events && this.props.playerInfo.length && this.props.champImg.length) {
			let searchEvents = this.props.timeline[this.props.spot][0].events;

			for (let i = 0; i < searchEvents.length; i++) {
				if (searchEvents[i].eventType === "CHAMPION_KILL") {
					if (searchEvents[i].killerId === 0) {
						interaction.push([ this.props.champImg[this.props.playerInfo[searchEvents[i].victimId - 1][1]] ])
					}
					else {
						interaction.push([ this.props.champImg[this.props.playerInfo[searchEvents[i].killerId - 1][1]], this.props.champImg[this.props.playerInfo[searchEvents[i].victimId - 1][1]] ]);
					}
				}
			}
			return interaction;
		}
	}

	render() {
		let stat = this.log();

		// DOESN'T EXIST INITIALLY
		if (!stat) {
			return (
				<div id="eventDisplay">
					
				</div>
			)
		}

		return (
			<div id="eventDisplay">
				{ stat.map(champFight => {

						if (!champFight[1]) {
							return (
								<div>
									<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch + "/img/champion/" + champFight[0] + ".png"} height={40} width={40} />
										&nbsp;&nbsp;&nbsp; has been executed!
								</div>
							)
						}
						return (
							<div>
								<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch + "/img/champion/" + champFight[0] + ".png"} height={40} width={40} />
									&nbsp;&nbsp;&nbsp; has slain &nbsp;&nbsp;&nbsp;
								<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch + "/img/champion/" + champFight[1] + ".png"} height={40} width={40} />
							</div>
						)
					})
				}
			</div>
		)	
		
	}
}

module.exports = EventDisplay;