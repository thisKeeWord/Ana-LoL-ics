import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import HeadApp from './headApp.jsx';
import About from './about.jsx';


class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={HeadApp} />
        <Route path="/about" component={About} />
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('content'));