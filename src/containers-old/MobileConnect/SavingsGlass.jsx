import React, {Component} from 'react';
import {toggle} from 'redux/modules/glass';
import {toggle as toggleSlidePage} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';

@connect((state) => ({ user: state.auth.user }), {toggle, pushState, toggleSlidePage})
export default class SavingsGlass extends Component {
  static propTypes = {}

  goNewLead = () => {
    if (!this.props.user || this.props.user.social) {
      this.closeHelp();
      this.props.toggle('LoginBoxGlass');
      return;
    }

    this.props.pushState(null, '/new-lead');
    this.props.toggleSlidePage();
    this.closeHelp();
  }

  goMenu = () => {
    if (!this.props.user || this.props.user.social) {
      this.closeHelp();
      this.props.toggle('LoginBoxGlass');
      return;
    }

    this.props.pushState(null, '/menu');
    this.props.toggleSlidePage();
    this.closeHelp();
  }

  goLogin = () => {
    this.props.pushState(null, '/');
    // this.closeHelp();
  }


  closeHelp = () => {
    this.props.toggle();
  }

  render() {
    require('./SavingsGlass.scss');

    return (
      <div className="glass-widget-base" style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
        <div className="section" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          position: 'relative',
          top: -40
        }}>

          <div className="text-link clickable user-row first" style={{paddingTop: 50}}>
              Calculating cost savings requires
          </div>
          <div className="text-link clickable user-row">
            1. being logged in to Sunnova Pro as a Sunnova Energy Consultant, and
          </div>
          <div className="text-link clickable user-row last">
            2. starting a new project or opening an existing one.
          </div>

          <div className="" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '80%',
            maxWidth: 350,
            margin: '0 auto'
          }}>
            <div onClick={this.goNewLead} className="submit-widget-buttons glass-widget-text clickable">Start New</div>
            <div onClick={this.goMenu} className="submit-widget-buttons glass-widget-text clickable">Open Existing</div>
          </div>

          <div className="close-help text-link has-event clickable" onClick={this.closeHelp}>
            Close This Window
          </div>
        </div>
      </div>
    );
  }
}
