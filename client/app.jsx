import React from 'react';
import ReactDOM from 'react-dom';
import HeadApp from './headApp.jsx';

class App extends React.Component {
  render() {
    return (
      <div className="showStats">
        <HeadApp />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('content'));