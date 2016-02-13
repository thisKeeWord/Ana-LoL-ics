import React from 'react';

class SelectData extends React.Component {

  render() {
    console.log(this.props.timeline, 'selectData');
    console.log(this.props.spot, 'selectData');
    console.log(this.props.playerInfo, 'selectData');
    return (
    	<div>
    	</div>
    )
  }
}

module.exports = SelectData;