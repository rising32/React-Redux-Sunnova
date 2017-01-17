import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toggle} from 'redux/modules/glass';
import {pushState} from 'redux-router';
import {setLoggedUser} from 'redux/modules/layout';
import {login, useAuthy, validateCodeAuthy, logoutAndResetRedux} from 'redux/modules/auth';

//production -  FHAjM22RfAZ1CWUT8ZoUMo6tMGUowsjJ
//testing - 36cfe745b497f8b55c8377971b75f7b7

@connect(
  (state) => ({user: state.auth.user, locked: state.auth.locked, codeValid: state.auth.codeValid, loginError: state.auth.loginError}),
  {toggle, pushState, setLoggedUser, login, useAuthy, validateCodeAuthy, logoutAndResetRedux}
)
export default class NewLead extends Component {
  static propTypes = {}

  state = {
    codeSent: false,
    context: 'login',
    remember: false
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (!this.state.codeSent && nextProps.user && nextProps.user.id) {
      if (localStorage.getItem('pro_remember')) {
        this.props.toggle();
      } else {
        this.actionSendCode(nextProps);
      }
    }

    if (this.state.codeSent && !nextProps.locked && nextProps.user) {
      if (this.state.remember) {
        localStorage.setItem('pro_remember', Date.now());
      }
      this.props.toggle();
    }

    if (!nextProps.codeValid && this.state.context === 'code') {
      this.refs.code.classList.add('red-border');
    }

    // if login error
    if (nextProps.loginError && !this.props.loginError) {
      this.refs.email.classList.add('red-border');
      this.refs.password.classList.add('red-border');
    }
  }

  goClose = () => {
    this.props.logoutAndResetRedux();
    this.props.toggle();
  }

  disableGlassAndRedirect = () => {
    this.props.toggle();
    this.props.pushState(null, '/assign-lead');
  }

  loginFacebook = () => {
    window.location.href = '/api/auth/facebook';
  }

  loginTwitter = () => {
    window.location.href = '/api/auth/twitter';
  }

  loginLocal = () => {
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    this.props.login(email, password);
  }

  actionSendCode = (opts) => {
    const props = opts && opts.user ? opts : this.props;
    // const phone = this.refs.phone.value;
    this.props.useAuthy(props.user.id);
    this.setState({context: 'code', codeSent: true});
  }

  actionValidateCode = () => {
    const code = this.refs.code.value;
    this.props.validateCodeAuthy(this.props.user.id, code);
    // this.goClose();
  }

  isEnter = (func, event) => {
    if (event.key === 'Enter') {
      func();
    }
  }

  render() {
    require('./NewLeadGlass.scss');

    const printPhone = (phone) => {
      if (!phone) {
        return '';
      }
      return phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6, 4);
    };

    if (this.state.context === 'code') {
      return (
        <div className="has-event user-login-box" style={{
          position: 'absolute',
          top: '5%',
          right: '5%'
        }}>
          <p>
            <strong>Let's validate your computer or mobile device.</strong>
          </p>
          <p style={{margin: '30px 0'}}><span>Code sent to {printPhone(this.props.user.phone)}</span> <span className="left-margin clickable" onClick={this.actionSendCode}>Text Code Again</span></p>
          <input ref="code" autoFocus defaultValue="" className="login-input" type="text" placeholder="Enter the Code you received on your phone" onKeyPress={this.isEnter.bind(this, this.actionValidateCode)}/>

          <div style={{margin: '30px 0'}}>
            <div className="inline-text">Remember device:</div>
            <div className="option-input" style={{margin: '0 5px'}}>
              <div className={ this.state.remember ? 'text-link clickable activated' : 'text-link clickable'} onClick={() => this.setState({remember: true})}>Yes</div>
            </div>
            <div className="option-input" style={{margin: '0 5px'}}>
              <div className={ this.state.remember ? 'text-link clickable' : 'text-link clickable  activated'} onClick={() => this.setState({remember: false})}>No</div>
            </div>
          </div>

          <p style={{margin: '30px 0'}}><span className="clickable" onClick={this.actionValidateCode}>Submit</span> <span className="left-margin clickable" onClick={this.goClose}>Cancel</span></p>
          <p className="description">* You will be given the option to update your cell phone number after logging in.</p>
        </div>
      );
    } else if (this.state.context === 'login') {
      return (
        <div className="has-event user-login-box" style={{
          position: 'absolute',
          top: '5%',
          right: '5%'
        }}>
          <p>
            <strong>Log in socially </strong>
          to explore Sunnova Pro. We will never post
            <br/>
            without your permission and never with your email address.</p>
          <ul className="social-buttons">
            <li className="fb-button" onClick={this.loginFacebook}>
              <img src="/images/facebookLogoWhite.svg" height="25"/>Log in with Facebook</li>
            <li className="twitter-button" onClick={this.loginTwitter}>
              <img src="/images/twitterLogoWhite.svg" height="20"/>Log in with Twitter</li>
          </ul>

          <p>
            <strong>Determining cost savings and eligibility </strong>
            requires logging in with<br/>your Sunnova Partner credentials.</p>
          <input ref="email" className="login-input" autoFocus type="email" placeholder="Email" onKeyPress={this.isEnter.bind(this, this.loginLocal)}/>
          <input ref="password" className="login-input" type="password" placeholder="Password" onKeyPress={this.isEnter.bind(this, this.loginLocal)}/>
          <ul className="login-buttons">
            <li>Forgot Login</li>
            <li>Forgot Password</li>
            <li className="submit-button clickable" onClick={this.loginLocal}>Log in</li>
          </ul>
        </div>
      );
    }
  }
}
