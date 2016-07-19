import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import $ from 'jquery';


class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      emailStatus: false
    };
  }
  submitEmail(e) {
    e.preventDefault();
    // console.log('what')
    let that = this;
    console.log(this.props.emailStatus)
    let emailForm = {
      emailTopic: ReactDOM.findDOMNode(this.refs.subject).value,
      emailBody: ReactDOM.findDOMNode(this.refs.mainBody).value,
      userEmail: ReactDOM.findDOMNode(this.refs.userEmail).value
    };
    $.ajax({
      type: 'POST',
      url: '/sendEmail',
      data: emailForm
    }).done(function(sent) {
      that.setState({
        emailStatus: true
      })
    });
  }

  render() {
    const that = this;
    console.log(this.state.emailStatus)
    if (this.state.emailStatus === false) {
      return (
        <div id="feedbackInfo">
          <div id="championBackground" style={{backgroundImage: "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kennen_4.jpg)"}} />
          <div id="returnHome"><Link to="/">Home</Link></div>
          <form id="feedbackForm" onSubmit={that.submitEmail.bind(that)}>
            <li><input id="userEmail" ref="userEmail" placeholder="please enter your email" isRequired /></li>
            <li><input id="subject" ref="subject" placeholder="subject" isRequired /></li>
            <li><input id="mainBody" ref="mainBody" placeholder="body" isRequired /></li>
            <li><button type="submit">Submit</button></li>
          </form>
        </div>
      )
    }
    if (this.state.emailStatus === true) {
      return (
        <div id="feedback">
          <div id="championBackground" style={{backgroundImage: "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kennen_4.jpg)"}} />
          <div id="returnHome"><Link to="/">Home</Link></div>
          Email Sent
          <form id="feedbackForm" onSubmit={that.submitEmail.bind(that)}>
            <input id="userEmail" ref="userEmail" placeholder="please enter your email" isRequired />
            <input id="subject" ref="subject" placeholder="subject" isRequired />
            <input id="mainBody" ref="mainBody" placeholder="body" isRequired />
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    }
  }
}

module.exports=Feedback;