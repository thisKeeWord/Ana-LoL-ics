import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import HeadApp from "./headApp.js";
import About from "./about.js";

class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={HeadApp} />
        <Route path="/about" component={About} />
        <Route path="/userName/:username" component={About} />
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
