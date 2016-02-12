import React from 'react';
import async from 'async';

class NumData extends React.Component {
	// LOGS CHAMPION KILLS PER FRAME
	log() {
		let interaction = [];
		if (this.props.timeline.length && this.props.timeline[this.props.spot][0].events) {
			let searchEvents = this.props.timeline[this.props.spot][0].events;

			for (let i = 0; i < searchEvents.length; i++) {
				if (searchEvents[i].eventType === "CHAMPION_KILL") {
					interaction.push([ "http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/" + this.props.champImg[this.props.playerInfo[searchEvents[i].killerId - 1][1]] + ".png", "http://ddragon.leagueoflegends.com/cdn/6.2.1/img/champion/" + this.props.champImg[this.props.playerInfo[searchEvents[i].victimId - 1][1]] + ".png" ]);
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
				<div id="bangRight">
					
				</div>
			)
		}

		let slayerSlain = stat.map(k => {
			console.log(k);
			return (
				<div id={k}>
					<img src={k[0]} height="50px" width="50px" />
						has slain
					<img src={k[1]} height="50px" width="50px" />
				</div>
			)
		})
		return (
			<div id="bangRight">
				{slayerSlain}
			</div>
		)	
		
	}
}

module.exports = NumData;