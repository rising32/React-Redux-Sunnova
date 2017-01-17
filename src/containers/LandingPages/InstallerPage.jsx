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
export default class InstallerPage extends Component {
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


    // setTimeout(() => {
    //   this.setState({aiDone: true});
    // }, 3000);

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


    // setTimeout(() => {
    //     clearInterval(interval);
    //     this.setState({aiActive: false, voiceLevel: 0});
    // }, 7000);
    // return;

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
        //  this.setState({aiActive: true, aiText: "i want to go solar"});
            console.log(res);

            action = res.body.result.action || null;
            if (action === 'go.back') {
              this.setState({aiAction: "Take me step back"});
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
    this.props.pushState('/');
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
      <div className={style.installerPage}>
        <div className={style.landingFlex}>
          <div className={style.designerTextPosition}>
            <Text className={style.text}>
              <div style={{fontSize: '4vw', fontWeight: 400, lineHeight: '4vw'}}>Who do you want<br/> on your roof?<br/><br/>
              In your garage?</div>
              <br/><br/><br/>
              With <span style={{fontWeight: 400}}>iwant.solar</span><br/>
              you get to decide.
            </Text>
          </div>
          <AnimatedBox className={style.installerBox} show={true} width={"76%"} height={'auto'}>
            <div style={{padding: '0.3vw 1vw', position: 'relative'}}>
              <Text big bold className={style.text}>Kevin Garcia - Certified Installer</Text>
              <Text className={style.text}>Garcia Bros. Roofing & Solar</Text>
              <Text className={style.reviewsText}>16 reviews</Text>
              <img className={style.reviewRating} src="/images/4-75-rating.svg"/>
            </div>
          </AnimatedBox>
        </div>
      </div>
    );
  }
}
