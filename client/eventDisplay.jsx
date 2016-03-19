import React from 'react';

class EventDisplay extends React.Component {
	// LOGS CHAMPION KILLS PER FRAME
	log() {
		const interaction1 = [];
		const interaction2 = [];

		// FIRST GAME
		if (this.props.totalRenders === 1 && this.props.timeline1.length && this.props.timeline1[this.props.spot][0].events && this.props.playerInfo1.length && this.props.champImg1.length) {
			const searchEvents1 = this.props.timeline1[this.props.spot][0].events;

			for (let i = 0; i < searchEvents1.length; i++) {
				if (searchEvents1[i].eventType === "CHAMPION_KILL") {
					if (searchEvents1[i].killerId === 0) {
						interaction1.push([ this.props.champImg1[this.props.playerInfo1[searchEvents1[i].victimId - 1][1]] ])
					}
					else {
						interaction1.push([ this.props.champImg1[this.props.playerInfo1[searchEvents1[i].killerId - 1][1]], this.props.champImg1[this.props.playerInfo1[searchEvents1[i].victimId - 1][1]] ]);
					}
				}
			}
			return interaction1;
		}

		// SECOND GAME
		if (this.props.totalRenders === 2 && this.props.timeline2.length && this.props.timeline2[this.props.spot][0].events && this.props.playerInfo2.length && this.props.champImg2.length) {
			const searchEvents2 = this.props.timeline2[this.props.spot][0].events;

			for (let i = 0; i < searchEvents2.length; i++) {
				if (searchEvents2[i].eventType === "CHAMPION_KILL") {
					if (searchEvents2[i].killerId === 0) {
						interaction2.push([ this.props.champImg2[this.props.playerInfo2[searchEvents2[i].victimId - 1][1]] ])
					}
					else {
						interaction2.push([ this.props.champImg2[this.props.playerInfo2[searchEvents2[i].killerId - 1][1]], this.props.champImg2[this.props.playerInfo2[searchEvents2[i].victimId - 1][1]] ]);
					}
				}
			}
			return interaction2;
		}
	}

	render() {
		const stat = this.log();

		// DOESN'T EXIST INITIALLY
		if (!stat) {
			return (
				<div id="eventDisplay">
					
				</div>
			)
		}

		// GAME 1
		if (this.props.totalRenders === 1) {
			console.log(this.props.totalRenders)
			return (
				<div id={"eventDisplay" + 1 * this.props.gamesToSee}>
					{ stat.map(champFight => {

							if (!champFight[1]) {
								return (
									<div>
										<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch1 + "/img/champion/" + champFight[0] + ".png"} height={40} width={40} />
											&nbsp;&nbsp;&nbsp; has been executed!
									</div>
								)
							}
							return (
								<div>
									<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch1 + "/img/champion/" + champFight[0] + ".png"} height={40} width={40} />
										&nbsp;&nbsp;&nbsp; has slain &nbsp;&nbsp;&nbsp;
									<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch1 + "/img/champion/" + champFight[1] + ".png"} height={40} width={40} />
								</div>
							)
						})
					}
				</div>
			)
		}

		// GAME 2
		if (this.props.totalRenders === 2) {
			return (
				<div id={"eventDisplay" + 2 * this.props.gamesToSee}>
					{ stat.map(champFight => {

							if (!champFight[1]) {
								return (
									<div>
										<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch2 + "/img/champion/" + champFight[0] + ".png"} height={40} width={40} />
											&nbsp;&nbsp;&nbsp; has been executed!
									</div>
								)
							}
							return (
								<div>
									<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch2 + "/img/champion/" + champFight[0] + ".png"} height={40} width={40} />
										&nbsp;&nbsp;&nbsp; has slain &nbsp;&nbsp;&nbsp;
									<img src={"http://ddragon.leagueoflegends.com/cdn/" + this.props.patch2 + "/img/champion/" + champFight[1] + ".png"} height={40} width={40} />
								</div>
							)
						})
					}
				</div>
			)
		}
	}
}

module.exports = EventDisplay;