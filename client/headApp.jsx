import React from 'react';
import ReactDOM from 'react-dom';
import Display from './app.jsx';


class HeadApp extends React.Component {
  constructor() {
    super();
    this.state = {
      formGood: false
    }
  }

  handleSubmit(e) {
    this.setState({
      yo: 123,
      formGood: true
    })
  }

  render() {
    if (this.state.formGood === false) {
      return (
        <div id="form">
          <form id="formSubmit" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" name="userName" ref="userName" placeholder="enter username"required />
          </form>
        </div>
      )
    }
    return (
      <Display yo={this.state.yo} />
    )
  }
}

ReactDOM.render(<HeadApp />, document.getElementById('content'))