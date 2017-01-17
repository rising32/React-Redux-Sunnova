import React, {Component, PropTypes} from 'react';
import {Text} from 'components';

import {connect} from 'react-redux';

import { push } from 'react-router-redux';

import {toggle, openTop} from 'redux/modules/slidePage';
import {setPageNumber} from 'redux/modules/layout';
import {toggle as toggleGlass} from 'redux/modules/glass';
import {logoutAndResetRedux} from 'redux/modules/auth';
import {setLastView} from 'redux/modules/navigation';


@connect(state => (
  {user: state.auth.user, notifications: state.notifications.arr, slidePageOpened: state.slidePage.opened, glassActive: state.glass.active, name: state.layout.name, logged: state.layout.userLogged, lead: state.data.selectedLead}),
  {pushState: push, toggle, openTop, setPageNumber, toggleGlass, logoutAndResetRedux, setLastView})
export default class LandingPage extends Component {
  static propTypes = {};

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.setPageNumber(0);
    this.props.setLastView({mainView: 'LandingPage'});
  }

  componentDidMount() {
    // window.fitText( document.getElementById('headline-text'), 1.75);
  }

  openMenu = () => {
    this.props.toggle();
    this.props.setLastView({mainView: 'LandingPage'});
    this.context.router.push('/menu');
  }

  openNewLead = () => {
    console.log('new-lead');
    this.props.toggle();
    this.props.pushState(null, '/new-lead');
  }

  openGraphs = () => {
    if (!this.props.user) {
      this.props.toggleGlass('LoginBoxGlass');
      return;
    }

    this.props.pushState(null, '/savings');
  }

  openBox = () => {
    this.props.toggleGlass('LoginBoxGlass');
  }

  logout = () => {
    this.props.logoutAndResetRedux();
    this.props.pushState(null, '/');
  }

  render() {
    require('./LandingPage.scss');

    const {lead} = this.props;
    let name = this.props.name;
    if (name === 'Homeowner' && lead.id) {
      name = [lead.firstname, lead.lastname].join(' ');
    }

    return (
      <div className="landing-page">
        <div className="landing-flex">
          <ul className="top-right-element">
            <li><Text inline>Get Started</Text></li>
            <li><img src="/new/microphone.svg" style={{width: '1.7vw', top: '0.8vw', position: 'relative'}}/></li>
          </ul>
          <div className="headline">
            <div style={{width: '90%', position: 'relative', top: 200, textAlign: 'center'}}><h1 id="headline-text" ><span style={{fontWeight: 300}}>Save more on electricity (</span>A lot more<span style={{fontWeight: 300}}>)</span></h1></div>
          </div>
          <div className="logo">
            <img src="/new/SunnovaRetailLogo.svg" style={{width: '22vw'}}/>
          </div>
        </div>
      </div>
    );
  }
}
