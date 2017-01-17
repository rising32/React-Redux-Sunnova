import React, {Component, PropTypes} from 'react';
import {Text} from 'components';

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
export default class LandingPage extends Component {
  static propTypes = {};

  state = {
    voiceLevel: 0
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.setPageNumber(0);
    this.props.setLastView({mainView: 'LandingPage'});

    // setInterval(() => {
    //   this.setState({voiceLevel: Math.random()});
    // }, 200)
  }

  runAPI = () => {
    // ApiAIPlugin.levelMeterCallback((level) => {
    //     this.setState({voiceLevel: level});
    // });

    // try {
    //   ApiAIPlugin.requestVoice(
    //     {}, // empty for simple requests, some optional parameters can be here
    //     function (response) {
    //         // place your result processing here
    //         alert(JSON.stringify(response));
    //     },
    //     function (error) {
    //         // place your error processing here
    //         alert(error);
    //     });
    // } catch (e) {
    //     alert(e);
    // }

    const accessToken = "1ae47e92822d45ac8876027c8dedc7b1";
		const baseUrl = "https://api.api.ai/v1/";
    const recognition = new webkitSpeechRecognition();
		recognition.onstart = (event) => {
			console.log('start');
		};
    let text = "";
		recognition.onresult = (event) => {
			text = "";
	  	for (let i = event.resultIndex; i < event.results.length; ++i) {
	    	text += event.results[i][0].transcript;
	    }
	    console.log(text);
			stopRecognition();

      request
		    .post(url + 'query/')
        .set('Accept', 'application/json')
        .send({ q: text, lang: "en" })
        .end((err, res) => {
          if (err) {
            alert(err);
            return;
          }

          alert(res);
        });
			};
			recognition.onend = () => {
				if (recognition) {
				  recognition.stop();
				  recognition = null;
			  }
			};
			recognition.lang = "en-US";
			recognition.start();
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

  render() {
    const style = require('./LandingPage.scss');

    const {lead} = this.props;
    let name = this.props.name;
    if (name === 'Homeowner' && lead.id) {
      name = [lead.firstname, lead.lastname].join(' ');
    }
    const voiceLevelSize = 5 * this.state.voiceLevel;


    return (
      <div className={style.landingPage}>
        <div className={style.landingFlex}>
          <ul className={style.topRightElement}>
            <li><Text inline>Get Started</Text></li>
            <li><img src="images/micGlow.svg" className={style.voiceBackground}
              style={{
                width: voiceLevelSize + 'vw',
                height: voiceLevelSize + 'vw',
                top: (0.4 - voiceLevelSize/2) + 'vw',
                left: (-voiceLevelSize/2 + 0.8) + 'vw',
              }}/>
              <img onClick={this.runAPI} src="images/microphone.svg" style={{width: '1.7vw', top: '0.8vw', position: 'relative'}}/>
            </li>
          </ul>
          <div className={style.headline}>
            <div style={{width: '90%', position: 'relative', top: 200, textAlign: 'center'}}><h1 className={style.headlineText} ><span style={{fontWeight: 300}}>Save more on electricity (</span>A lot more<span style={{fontWeight: 300}}>)</span></h1></div>
          </div>
          <div className={style.logo}>
            <img src="images/SunnovaRetailLogo.svg" style={{width: '22vw'}}/>
          </div>
          <div className={style.bottomLeftElement} onClick={this.openGlass}><img src="images/arrowLeft.svg" style={{width: '5.5vw', transform: 'rotate(180deg)'}}/></div>
        </div>
      </div>
    );
  }
}
