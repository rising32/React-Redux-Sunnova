import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from 'redux/modules/auth';

@connect(() => ({}), authActions)
export default class Login extends Component {
  static propTypes = {
    invitation: PropTypes.func,
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const input = this.refs.passcode;
    this.props.invitation(input.value);
    input.value = '';
  }

  render() {
    require('./Login.scss');

    return (
      <div className="check-page">
        <Helmet title="Invitation Only"/>
        {/*<div className="check-page-logo">
          <img className="logo" height={50} src="/images/sunnova_logo.svg" width={150}/>
        </div>*/}
        <form onSubmit={this.handleSubmit}>
          <input type="text" ref="passcode"/>
        </form>
      </div>
    );
  }
}
