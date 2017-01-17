import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toggle} from 'redux/modules/glass';
import {pushState} from 'redux-router';
import {setLoggedUser} from 'redux/modules/layout';
import {login, useAuthy, validateCodeAuthy, logoutAndResetRedux, changePassword} from 'redux/modules/auth';

@connect((state) => (
  {user: state.auth.user, locked: state.auth.locked, codeValid: state.auth.codeValid, passwordChangeSuccess: state.auth.passwordChangeSuccess, passwordChangeError: state.auth.passwordChangeError}
), {
  toggle,
  pushState,
  setLoggedUser,
  login,
  useAuthy,
  validateCodeAuthy,
  logoutAndResetRedux,
  changePassword
})
export default class Settings extends Component {
  static propTypes = {}

  state = {
    codeSent: false,
    context: 'login',
    message: ''
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.passwordChangeSuccess !== nextProps.passwordChangeSuccess && nextProps.passwordChangeSuccess) {
      this.goClose();
    }

    if (this.props.passwordChangeError !== nextProps.passwordChangeError && nextProps.passwordChangeError) {
      this.actionWrongPassword();
    }
  }

  messages = {
    matchError: 'Passwords does not match.',
    wrongPasswordError: 'Wrong password.'
  };

  goClose = () => {
    this.props.toggle();
  }

  actionWrongPassword = () => {
    this.refs.oldPassword.classList.add('red-border');
    this.setState({message: this.messages.wrongPasswordError});
  }

  actionSave = () => {
    const oldPassword = this.refs.oldPassword.value;
    const newPassword = this.refs.newPassword.value;
    const newPasswordAgain = this.refs.newPasswordAgain.value;

    const checkPassword = (str) => {
      // at least one number, one lowercase and one uppercase letter
      // at least 8 characters
      const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
      return re.test(str);
    };

    if (!checkPassword(newPassword)) {
      console.debug('Password does not have valid format.');
      this.refs.newPassword.classList.add('red-border');
      return;
    }

    if (newPassword !== newPasswordAgain) {
      console.debug('Password does not match.');
      this.refs.newPassword.classList.add('red-border');
      this.refs.newPasswordAgain.classList.add('red-border');
      this.setState({message: this.messages.matchError});
      return;
    }

    this.props.changePassword(this.props.user.id, oldPassword, newPassword);
  }

  render() {
    require('./NewLeadGlass.scss');

    return (
      <div className="has-event user-login-box" style={{
        position: 'absolute',
        top: '5%',
        right: '5%',
        width: 500
      }}>
        <p>
          <strong>Update Password</strong>
        </p>
        <input ref="oldPassword" className="login-input" type="password" placeholder="Old Password"/>
        <input ref="newPassword" className="login-input" type="password" placeholder="New Password"/>
        <input ref="newPasswordAgain" className="login-input" type="password" placeholder="Repeat New Password"/>
        <p>{this.state.message}</p>
        <p>Minimum 8 characters including at least one capital and one lowercase letter, and a number.</p>
        <p>
          <strong>Update Cell Phone Number</strong>
        </p>
        <input ref="phone" className="login-input" type="phone" defaultValue={this.props.user.phone} placeholder="Your Phone Number"/>
        <ul className="login-buttons">
          <li className="clickable" onClick={this.actionSave}>Save Changes</li>
          <li className="clickable" onClick={this.goClose}>Cancel</li>
        </ul>
      </div>
    );
  }
}
