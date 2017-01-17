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
export default class LandingLayout extends Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    runPulse: PropTypes.func.isRequired,
    stopPulse: PropTypes.func.isRequired
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

  componentWillMount() {}

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

    this.setState({aiDone: false, aiText: false});

    let iteration = 0;
    const interval = setInterval(() => {
      const iter = iteration % 8;
      let voiceLevel = 0.1;
      if (iter === 0) {
        voiceLevel = 1.5;
      } else if (iter === 2) {
        voiceLevel = 1.5;
      }

      this.setState({voiceLevel: voiceLevel});
      iteration += 1;
    }, 250);

    const accessToken = "1ae47e92822d45ac8876027c8dedc7b1";
		const baseUrl = "https://api.api.ai/v1/";
    let recognition = new webkitSpeechRecognition();
			recognition.onstart = (event) => {
				console.log('start');
			};

      let text = "";
			recognition.onresult = (event) => {
				text = "";
			  for (let i = event.resultIndex; i < event.results.length; ++i) {
		    	text += event.results[i][0].transcript;
          this.setState({aiText: text, aiActive: true});
		    }
		    console.log(text);
				if (recognition) {
				  recognition.stop();
				  recognition = null;
			  }

        let action = null;
        request
          .post(baseUrl + 'query/')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + accessToken)
          .send({ q: text, lang: "en" })
          .end((err, res) => {
            if (err) {
              alert(JSON.stringify(err, undefined, 2));
              return;
            }
            console.debug(`[ai] ${res}`);

            action = res.body.result.action || null;
            if (action === 'go.back') {
              this.setState({aiAction: "Go Back"});
            } else if (action === 'go.beginning') {
              this.setState({aiAction: "Take me to the beginning"});
            } else {
              this.setState({aiAction: "I didn't understand that."});
            }
        });


        clearInterval(interval);
        setTimeout(() => {
          this.setState({aiDone: true});
        }, 1500);
        setTimeout(() => {
          this.setState({aiActive: false, voiceLevel: 0});
        }, 7000);
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


  nextPage = () => {
    this.props.pushState('/installer');
  }

  clickGetStarted = () => {
    console.log('toggle glass :)');
    this.props.toggleGlass('get-started');
  }

  runAiAction = () => {
    if (this.state.aiAction !== 'Go Back') {
      return;
    }

    this.props.runPulse();
    setTimeout(() => {
      this.props.stopPulse();
      this.props.goBack();
    }, 1600)
  }

  render() {
    const style = require('./LandingLayout.scss');
    const voiceLevelSize = 5 * this.state.voiceLevel;
    const opacityVoice = this.state.voiceLevel === 0.1 ? 0.7 : 0.1;
    const micSupported = typeof(webkitSpeechRecognition) === 'undefined' ? false : true;

    return (
      <div className={style.landingLayout}>
          <ul className={style.topRightElement}>
            <li><Text inline bold onClick={this.clickGetStarted}>Menu</Text></li>
            {micSupported && <li><img src="images/micGlow.svg" className={style.voiceBackground}
              style={{
                opacity: voiceLevelSize,
                width: voiceLevelSize + 'vw',
                height: voiceLevelSize + 'vw',
                top: (-0.1 - voiceLevelSize/2) + 'vw',
                left: (-voiceLevelSize/2 + 0.8) + 'vw',
              }}/>
              <svg onClick={this.runAPI} viewBox="0 0 36.634 53.578" style={{width: '1.7vw', position: 'relative'}} className={style.withHover}>
                <title>microphone</title>
                <path className="a" d="M29.841,11.577V28.752a10.163,10.163,0,1,1-20.327,0V11.577a10.163,10.163,0,0,1,20.327,0Z" transform="translate(-1.352 -1.428)"/>
                <path className="a" d="M37.986,23.4V27.48A18.329,18.329,0,0,1,21.679,45.7v6.419h8.356a1.446,1.446,0,1,1,0,2.891H9.332a1.446,1.446,0,1,1,0-2.891h8.356V45.7A18.331,18.331,0,0,1,1.352,27.48V23.4A1.432,1.432,0,0,1,2.8,21.957,1.432,1.432,0,0,1,4.243,23.4V27.48a15.426,15.426,0,1,0,30.851,0V23.4a1.446,1.446,0,1,1,2.891,0Z" transform="translate(-1.352 -1.428)"/>
              </svg>
            </li>}
          </ul>
          {this.props.children}
          <div className={style.logo}>
            <img src="images/SunnovaRetailLogo.svg"/>
          </div>
      </div>
    );
  }
}
