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
export default class SavingsPage extends Component {
  static propTypes = {};

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

  componentWillMount() {}

  render() {
    const style = require('./LandingPage.scss');

    const {lead} = this.props;
    let name = this.props.name;
    if (name === 'Homeowner' && lead.id) {
      name = [lead.firstname, lead.lastname].join(' ');
    }
    const voiceLevelSize = 5 * this.state.voiceLevel;
    const opacityVoice = this.state.voiceLevel === 0.1 ? 0.7 : 0.1;


    return (
      <div className={style.savingsPage}>
        <div className={style.landingFlex}>
          <div className={style.designerTextPosition}>
            <Text className={style.text}>
              <div style={{fontSize: '2.7vw', fontWeight: 400, lineHeight: '3.4vw'}}>
                permit-set CAD drawing labor<br/>
                structural engineering labor<br/>
                electrical engineering labor<br/>
                solar system design labor<br/>
                Sales commision<br/>
                trusting they'll get it right<br/>
                <span style={{position: 'relative', top: '3vw', fontSize: '4.7vw', fontWeight: 600}}>Boom! Gone.</span>
              </div>
            </Text>
          </div>
          <div className={style.headline}>
            <h2 style={{fontSize: '2.45vw', textAlign: 'left'}}>Watch Ava and Boyd take control while savings thousands more.</h2>
            <img src="/images/playButton.svg" className={style.playButton}/>
          </div>
        </div>
      </div>
    );
  }
}
