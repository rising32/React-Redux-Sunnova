import React, {Component, PropTypes} from 'react';
import {Text, AnimatedBox} from 'components';

import {connect} from 'react-redux';

import { push } from 'react-router-redux';

import {toggle, openTop} from 'redux/modules/slidePage';
import {setPageNumber} from 'redux/modules/layout';
import {toggle as toggleGlass} from 'redux/modules/glass';
import {logoutAndResetRedux} from 'redux/modules/auth';
import {setLastView} from 'redux/modules/navigation';
import request from 'superagent';


@connect(state => (
  {user: state.auth.user, notifications: state.notifications.arr, slidePageOpened: state.slidePage.opened, glassActive: state.glass.active, name: state.layout.name, logged: state.layout.userLogged, lead: state.data.selectedLead}),
  {pushState: push, toggle, openTop, setPageNumber, toggleGlass, logoutAndResetRedux, setLastView})
export default class FamilyPage extends Component {
  static propTypes = {
    playVideo: PropTypes.bool.isRequired
  };

  state = {
    voiceLevel: 0,
    aiActive: false,
    aiText: '',
    aiDone: false,
    boxHeight: "20vw",
    aiAction: ''
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.setPageNumber(0);
    this.props.setLastView({mainView: 'FamilyPage'});
  }

  componentWillReceiveProps(nextProps) {

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

  openGlass = () => {
    this.props.toggleGlass('LoginBoxGlass');
  }

  logout = () => {
    this.props.logoutAndResetRedux();
    this.props.pushState(null, '/');
  }

  nextPage = () => {
    this.props.pushState('/installer');
  }

  iOS = () => {
    return global.navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }

  render() {
    const style = require('./LandingPage.scss');

    const {lead} = this.props;
    let name = this.props.name;
    if (name === 'Homeowner' && lead.id) {
      name = [lead.firstname, lead.lastname].join(' ');
    }
    const voiceLevelSize = 5 * this.state.voiceLevel;
    const opacityVoice = this.state.voiceLevel === 0.1 ? 0.7 : 0.1;


    // autoPlay
    return (
      <div className={style.landingPage}>
        <div className={style.landingFlex}>
        </div>
      </div>
    );
  }
}
