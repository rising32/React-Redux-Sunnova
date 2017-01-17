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
  static propTypes = {};

  state = {
    voiceLevel: 0,
    aiActive: false,
    aiText: '',
    aiDone: false,
    boxHeight: "20vw"
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.setPageNumber(0);
    this.props.setLastView({mainView: 'FamilyPage'});
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
    this.setState({aiDone: false, aiText: false});

    setTimeout(() => {
      this.setState({aiActive: true, aiText: "i want to go solar"});
    }, 500);

    setTimeout(() => {
      this.setState({aiDone: true});
    }, 3000);

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


    setTimeout(() => {
        clearInterval(interval);
        this.setState({aiActive: false, voiceLevel: 0});
    }, 7000);
    return;




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
          this.setState({aiText: text});
		    }
		    console.log(text);
				if (recognition) {
				  recognition.stop();
				  recognition = null;
			  }

        // request
        //   .post(url + 'query/')
        //   .set('Accept', 'application/json')
        //   .set('Authorization', 'Bearer ' + accessToken)
        //   .send({ q: text, lang: "en" })
        //   .end((err, res) => {
        //     if (err) {
        //       alert(JSON.stringify(err, undefined, 2));
        //       return;
        //     }

        //     alert(JSON.stringify(res, undefined, 2));
        // });


        clearInterval(interval);
        setTimeout(() => {
          this.setState({aiDone: true});
        }, 1000);
        setTimeout(() => {
          this.setState({aiDone: false, aiText: false});
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
      <div className={style.landingPage}>
        <video className={style.backgroundVideo} autoPlay muted>
          <source src="video/landing-video.mov"/>
        </video>
        <div className={style.landingFlex}>
          <ul className={style.topRightElement}>
            <li><Text inline bold onClick={() => {}}>Get Started</Text></li>
            <li><img src="images/micGlow.svg" className={style.voiceBackground}
              style={{
                opacity: opacityVoice,
                width: voiceLevelSize + 'vw',
                height: voiceLevelSize + 'vw',
                top: (0.4 - voiceLevelSize/2) + 'vw',
                left: (-voiceLevelSize/2 + 0.8) + 'vw',
              }}/>
              <img onClick={this.runAPI} src="images/microphone.svg" style={{width: '1.7vw', top: '0.8vw', position: 'relative'}}/>
            </li>
          </ul>
          <AnimatedBox className={style.infoBox} show={!!this.state.aiActive} width={"76%"} height={!this.state.aiDone ? '6vw' : '14vw'}>
            <div className={style.aiText}>
              <Text bold italic>"{this.state.aiText}"</Text>
              <AnimatedBox show={!!this.state.aiDone}>
                <Text>Suggestions:</Text>
                <Text bold>Sign in, then enter your current bill.</Text>
              </AnimatedBox>
            </div>
          </AnimatedBox>
          <div className={style.headline}>
            <div style={{textAlign: 'center'}}><h1 className={style.headlineText}>The Olsens</h1></div>
            <h2 style={{fontSize: '4wv'}}>“We wanted to pay less for electricity without being hustled for a quick
commission.&nbsp;&nbsp; It's obscene how much lower our bill will be with Sunnova.”</h2>
          </div>
          <div className={style.logo}>
            <img src="images/SunnovaRetailLogo.svg" style={{width: '22vw'}}/>
          </div>
          <div className={style.bottomLeftElement} onClick={this.nextPage}><img src="images/arrowLeft.svg" style={{width: '5.5vw', transform: 'rotate(180deg)'}}/></div>
          <ul className={style.navigationDots}>
            <li className={style.circle + ' ' + style.active}></li>
            <li className={style.circle}></li>
            <li className={style.circle}></li>
            <li className={style.circle}></li>
            <li className={style.circle}></li>
          </ul>
        </div>
      </div>
    );
  }
}
