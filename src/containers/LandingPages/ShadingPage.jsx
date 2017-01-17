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
export default class ShadingPage extends Component {
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
      <div className={style.shadingPage}>
        <div className={style.landingFlex}>
          <div className={style.designerTextPosition}>
            {/*<Text className={style.text}>
              <div style={{fontSize: '1.2vw'}}>
                PV Panel #5, Cell #47, Time Step: May 28, 3-4PM<br/>
                Is Direct Light Shaded for Timestep? NO<br/>
                Angle of Incedence: 24 Deg.<br/>
                Rotation: 172 Deg.<br/>
                Slope: 12 Deg.<br/>
                Atmospheric Reduction: 3.4%<br/>
                Soiling: 2.1%<br/>
                Hardware Degredation: 1.8%<br/>
                Energy harvest: 12 kWh<br/>
              </div>
            </Text>*/}
          </div>
        </div>
      </div>
    );
  }
}
