import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import { Layer, Arrow, Text, Pulse, Input, InputOptions, InputMonths, Graph } from 'components';
import { GetStarted } from 'containers';

import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
// import connectData from 'helpers/connectData';
import config from 'config';

import {open as openDesignerDialog, close as closeDesignerDialog} from 'redux/modules/designerDialog';
import {setPageNumber} from 'redux/modules/layout';
import {toggle, openTop} from 'redux/modules/slidePage';
import {toggle as toggleGlass} from 'redux/modules/glass';
import {isLoaded as isAuthLoaded, load as loadAuth, logout, setSocialLogin} from 'redux/modules/auth';
import { NotificationsAPI } from 'redux/modules/notifications';

import { API as leadsAPI } from 'redux/modules/data';
// import * as _ from 'lodash';

import {
    Empty,
    NewLeadGlass,
    LoginBoxGlass,
    ExistingLeadGlass,
    SavingsGlass,
    Help,
    NewsGlass,
    EligibilityGlass,
    SummaryGlass,
    ProposalGlass,
    SettingsGlass
  } from 'containers';

import {
  FamilyPage,
  InstallerPage,
  DesignerPage,
  LandingLayout,
  BatteryPage,
  SavingsPage,
  ShadingPage,
  DesignerDialog
} from 'containers';

// function fetchData(getState, dispatch) {
//   const promises = [];

//   if (!isAuthLoaded(getState())) {
//     promises.push(dispatch(loadAuth()));
//   }
//   return Promise.all(promises);
// }

// @connectData(fetchData)
@connect(
    state => ({user: state.auth.user, navigation: state.navigation, glassLocked: state.auth.locked, invited: state.auth.invited, slidePageOpened: state.slidePage.opened, topIsOpened: state.slidePage.topOpened, glassActive: state.glass.active, glassName: state.glass.name, pageActive: state.layout.pageNumber, lead: state.data.selectedLead}),
  {
    loadLeads: leadsAPI.load,
    loadLead: leadsAPI.loadOne,
    pushState: push,
    toggle,
    toggleGlass,
    logout,
    openTop,
    setPageNumber,
    setSocialLogin,
    initNotifications: NotificationsAPI.init,
    addNotification: NotificationsAPI.add,
    openDesignerDialog,
    closeDesignerDialog
  })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    mainContent: PropTypes.object,
    slideContent: PropTypes.object,
    glassContent: PropTypes.object,
    location: PropTypes.object.isRequired
  };

  state = {
    isHovering: false,
    lastPageNumberHovered: 0,
    pageActive: 0,
    opacity: 0,
    lensesX: '0',
    lensesY: '0',
    treesX: '0',
    treesY: '0',
    slidePageZIndex: 10,
    synergykitActive: false,
    glassActive: false,
    showGetStarted: false,
    zipCode: '',
    graphState: 'init',
    playVideo: true,
    renderRemainingPages: false,
    leftArrow: false,
    rightArrow: false
  };

  componentWillMount() {
    // You need to be authenticated to fetch Lead
    if (!this.props.user || !this.props.user.id) {
      return;
    }

    const {query} = this.props.location;
    if (query && query.l) {
      this.props.loadLead(query.l);
    }

    const lastLead = localStorage.getItem('lastLeadId');
    // are we coming from proposal page?
    if (lastLead) {
      console.debug('[last-lead] loading...');
      this.props.loadLead(lastLead);

      localStorage.removeItem('lastLeadId');
    }
  }

  carousel = null;
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange',  this.handleResize);
    window.addEventListener('load', this.disableSafariBars);

    setTimeout(() => {
      this.setState({renderRemainingPages: true});
    }, 200);

    setTimeout(() => {
       this.carousel = new HammerCarousel(this.refs.carousel, Hammer.DIRECTION_HORIZONTAL, this.setPageActive);
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange',  this.handleResize);

  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.slidePageOpened && nextProps.slidePageOpened) {
      this.setState({slidePageZIndex: 50});
    } else if (this.props.slidePageOpened && !nextProps.slidePageOpened) {
      setTimeout(() => {
        this.setState({slidePageZIndex: 10});
      }, 350);
    }

    if (!this.props.glassActive && nextProps.glassActive && this.state.pageActive === 0) {
      this.setState({playVideo: false});
    }
    if (this.props.glassActive && !nextProps.glassActive && this.state.pageActive === 0) {
      this.setState({playVideo: true});
    }
  }

  currX = 0;
  currY = 0;
  tilt = (angle) => {
    const maxMovement = 2.5;
    this.currX += (angle[1] * 0.2 * 0.5);
    this.currY += (angle[0] * 0.2 * 0.5);

    if (this.currY > maxMovement) {
      this.currY = maxMovement;
    } else if (this.currY < -1 * maxMovement) {
      this.currY = -1 * maxMovement;
    }
    if (this.currX > maxMovement) {
      this.currX = maxMovement;
    } else if (this.currX < -1 * maxMovement) {
      this.currX = -1 * maxMovement;
    }

    const max = Math.max(Math.abs(angle[0]), Math.abs(angle[1]));
    let opacity;
    if (max < 0.5) {
      opacity = 0;
    } else {
      let percentage = (max - 0.5) / 2;
      if (max > 2.5) {
        percentage = 1;
      }

      opacity = percentage;
    }

    this.setState({
      lensesY: this.currY + 'vh',
      lensesX: this.currX + 'vw',
      treesY: (-1 * this.currY) + 'vh',
      treesX: (-1 * this.currX) + 'vw',
      opacity: opacity
    });
  }

  disableSafariBars = () => {
    const iDevices = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ];

    if(!!navigator.platform) {
      while(iDevices.length) {
        if(navigator.platform === iDevices.pop()) {
          this.makeScrollable();
        }
      }
    }

  }

  makeScrollable = () => {
    document.getElementsByTagName('body')[0].style.height = 'calc(100% + 1px)';
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 1000);
  }

  handleResize = () => {
    console.log('force update');
    this.forceUpdate();
  }

  round = (text, number) => {
    return text + ' - ' + Math.round(number * 100) / 100;
  }

  openNewLead = () => {
    this.props.toggle();
    this.props.pushState(null, '/new-lead');
  }

  actionHideGlass = (event) => {
    this.props.toggleGlass();
  }

  goHome = () => {
    this.props.pushState(null, '/');
  }

  goSavings = () => {
    if (!this.props.user) {
      this.props.toggleGlass('LoginBoxGlass');
      return;
    }

    this.props.pushState(null, '/savings');
  }

  goEligibility = () => {
    if (!this.props.user) {
      this.props.toggleGlass('LoginBoxGlass');
      return;
    }
    if (!this.props.lead.id) {
      this.props.toggleGlass('EligibilityGlass');
      return;
    }

    this.props.pushState(null, '/eligibility');
  }

  isLandingPage = () => {
    return false;
  }

  loadGlass = (name) => {
    if (!name) {
      return Empty;
    }
    const templates = {
      NewLeadGlass,
      LoginBoxGlass,
      ExistingLeadGlass,
      SavingsGlass,
      Help,
      NewsGlass,
      EligibilityGlass,
      SummaryGlass,
      ProposalGlass,
      SettingsGlass
    };
    console.log("------------run--------------");
    this.props.openDesignerDialog();
    const selectedTemplate = templates[name];
    if (!selectedTemplate) {
      console.debug('Glass template not found, name: ', name);
      return Empty;
    }

    return selectedTemplate;
  }

  openTop = () => {
    if (!this.props.user) {
      this.props.toggleGlass('LoginBoxGlass');
      return;
    }

    if (!this.props.lead.id) {
      this.props.toggleGlass('SummaryGlass');
      return;
    }
    if (!this.props.topIsOpened) {
      console.log('opening top...');
      localStorage.setItem('lastPageNumber', this.props.pageActive);
      this.props.setPageNumber(3);
      this.props.openTop();
    } else {
      console.log('closing top...');
      const pageActive = parseInt(localStorage.getItem('lastPageNumber') || 0, 10);
      this.props.setPageNumber(pageActive);
      this.props.openTop();
    }
  }

  openProposal = () => {
    if (!this.props.user) {
      this.props.toggleGlass('LoginBoxGlass');
      return;
    }

    if (!this.props.lead.id) {
      this.props.toggleGlass('ProposalGlass');
      return;
    }

    localStorage.setItem('lastLeadId', this.props.lead.id);
    window.location = 'https://proposal.sunnova.com/' + this.props.lead.firstname + '.' + this.props.lead.lastname + '/2j2udd902/';
  }

  goPage = (page) => {
    if (page === 0) {
      this.setState({playVideo: true});
    } else {
      this.setState({playVideo: false});
    }

    this.carousel.show(page, 0, true);
  }

  goBack = () => {
    const active = this.state.pageActive;
    if (active <= 0) {
      return;
    }

    if (active - 1 === 1) {
      this.setState({playVideo: false});
    } else {
      this.setState({playVideo: true});
    }

    this.carousel.show(active - 1, 0, true);
  }

  goNext = () => {
    const active = this.state.pageActive;
    if (active >= 4) {
      return;
    }
    this.setState({playVideo: false});

    this.carousel.show(active + 1, 0, true);
  }

  isFilled = (value, event) => {
    if (value.length === 5) {
      this.setState({zipCode: value});
    }
  }

  isEVFilled = (value) => {
    if (value === 'Yes') {
      this.setState({electricVehicle: true});
    }
  }

  onClickZipCodeDisabled = () => {
    if (this.state.zipCode) {
      this.setState({zipCode: false, electricVehicle: false, monthSelected: false, electricityAmount: 0, electricity: false});
    }
  }

  onChangeElectricity = () => {
    const time = Date.now();
    this.setState({monthUpdated: time});

    setTimeout(() => {
      if (time === this.state.monthUpdated) {
        this.setState({electricity: true});
      }
    }, 2000);
  }

  onChangeMonth = (month, index) => {
    this.setState({monthSelected: true, graphMargin: 8 * index});
    setTimeout(() => {
      this.setState({graphState: 'expenses'});
    }, 900);
  }

  electricityFunc = (val) => {
    this.setState({electricityAmount: val});
    return `\$${val}`;
  }

  monthFunc = (val) => {
    return <span>{val} <span style={{fontWeight: 300}}>electricity bill $</span>{this.state.electricityAmount}</span>;
  }

  setPageActive = (index) => {
    this.setState({pageActive: index});
  }

  runPulse = () => {
    this.setState({pulse: true});
  }

  stopPulse = () => {
    this.setState({pulse: false});
  }

  goBackGetStarted = () => {
    const getStarted = this._getStarted;
    getStarted.goBack();
  }

  goNextGetStarted = () => {
    const getStarted = this._getStarted;
    getStarted.goNext();
  }

  leftArrow = (active) => {
    this.setState({leftArrow: !!active});
  }

  rightArrow = (active) => {
    this.setState({rightArrow: !!active});
  }

  render() {
    console.log("loaded");
    const style = require('./App.scss');

    // const glassEffectActive = this.props.glassActive
    //   ? style.blured
    //   : '';

    const glassEffectActive = this.props.glassActive ? style.blured : '';
    const GlassComponent = this.loadGlass(this.props.glassName);
    const isSavingsPage = false;

    let step = 1;
    const interval = setInterval(() => {
      const times = step % 2;
      const el = this.refs.guide;
      let factor = 0;
      if (!el) {
        return;
      }
      if (times === 1) {
        factor = 1;
      } else if (times === 0) {
        factor = 0;
      }

      if (step % 4 === 0) {
        factor = 0;
      }

      const size = 150 * factor;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = 1 - factor;
      step += 1;

      if (step >= 3) {
        clearInterval(interval);
      }
    }, 500);

    const evFunc = (str) => {
      console.log('valEV', str);
      if (str === 'Yes') {
        return <span>At least One{' '}<span style={{fontWeight: 300}}>Electric Vehicle</span></span>;
      }

      return 'No Electric Vehicles';
    }

    const graphClass = this.state.monthSelected ? '' : style.line;

    return (
      <div className="appWrapper">
        <Helmet {...config.app.head}/>
        {/*<Layer name="no-portrait-allowed"><img src="/images/pleaseRotate.svg" width="200"/></Layer>*/}
        <div className={style.app + ' ' + glassEffectActive}>
          <Layer name={style.main}>
            {/*{this.props.children}*/}
            <LandingLayout ref="wtf" goBack={this.goBack} runPulse={this.runPulse} stopPulse={this.stopPulse}>
              <div className={style.carouselWrapper} ref="carousel">
                <div className={style.pane}>
                  <FamilyPage playVideo={this.state.playVideo}/>
                </div>
                <div className={style.pane}>
                  {this.state.renderRemainingPages && <InstallerPage/>}
                </div>
                <div className={style.pane}>
                  {this.state.renderRemainingPages && <BatteryPage/>}
                  {/*this.state.renderRemainingPages && <DesignerPage/>*/}
                </div>
                <div className={style.pane}>
                  {this.state.renderRemainingPages && <ShadingPage/>}
                </div>
                <div className={style.pane}>
                  {this.state.renderRemainingPages && <SavingsPage/>}
                </div>
              </div>
            </LandingLayout>

            <div className={this.state.pageActive > 0 ? style.extended : ''}>
              <div className={style.bottomLeftElement + ' ' + style.withHover + ' ' + style.prevButton} onClick={this.goBack}>
                <img src="images/arrowLeft.svg" style={{width: '5vw'}} className={style.clickable}/>
                <Pulse run={this.state.pulse} className={style.pulseBehindLeftArrow}/>
              </div>
              <ul className={style.navigationDots}>
                <li onClick={this.goPage.bind(this, 0)} className={style.circle + ' ' + (this.state.pageActive === 0 ? style.active : '')}></li>
                <li onClick={this.goPage.bind(this, 1)} className={style.circle + ' ' + (this.state.pageActive === 1 ? style.active : '')}></li>
                <li onClick={this.goPage.bind(this, 2)} className={style.circle + ' ' + (this.state.pageActive === 2 ? style.active : '')}></li>
                <li onClick={this.goPage.bind(this, 3)} className={style.circle + ' ' + (this.state.pageActive === 3 ? style.active : '')}></li>
                <li onClick={this.goPage.bind(this, 4)} className={style.circle + ' ' + (this.state.pageActive === 4 ? style.active : '')}></li>
              </ul>
              <div className={style.bottomLeftElement + ' ' + style.withHover + ' ' + style.nextButton} onClick={this.goNext} style={{left: '12%'}}><img src="images/arrowLeft.svg" className={style.clickable} style={{width: '5vw', transform: 'rotate(180deg)'}}/></div>
            </div>
          </Layer>
        </div>
        <Layer name={style.glass + ' ' + glassEffectActive }>
          {/*glassEffectActive && <GetStarted ref="getStarted"/>*/}
          <GetStarted ref={(c) =>  { this._getStarted = c;}} leftArrow={this.leftArrow} rightArrow={this.rightArrow}/>
          <div className={style.topRightElement + ' ' + style.withHover}>
            <ul className={style.getStartedNavigation}>
                <li><Text big onClick={this.actionHideGlass} color={'red'}>X</Text></li>
                <li><img src="images/microphone.svg" style={{width: '2.3vw'}}/></li>
            </ul>
          </div>
        </Layer>
        {/* preloader */}
        <div style={{display: 'none'}}>
        </div>
      </div>
    );
  }
}


function HammerCarousel(container, direction, setActiveFunc) {
    this.container = container;
    this.direction = direction;
    this.setActive = setActiveFunc;
    this.style = require('./App.scss');

    this.panes = Array.prototype.slice.call(this.container.children, 0);
    this.containerSize = this.container['offsetWidth'];

    this.currentIndex = 0;

    this.hammer = new Hammer.Manager(this.container);
    this.hammer.add(new Hammer.Pan({ direction: this.direction, threshold: 10 }));
    this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));

    this.show(this.currentIndex);
}


HammerCarousel.prototype = {
    /**
     * show a pane
     * @param {Number} showIndex
     * @param {Number} [percent] percentage visible
     * @param {Boolean} [animate]
     */
    show: function(showIndex, percent, animate){
        showIndex = Math.max(0, Math.min(showIndex, this.panes.length - 1));
        percent = percent || 0;

        var className = this.container.className;
        if(animate) {
            if(className.indexOf(this.style.animate) === -1) {
                this.container.className += ' ' + this.style.animate;
            }
        } else {
            if(className.indexOf(this.style.animate) !== -1) {
                this.container.className = className.replace(this.style.animate, '').trim();
            }
        }

        var paneIndex, pos, translate;
        for (paneIndex = 0; paneIndex < this.panes.length; paneIndex++) {
            pos = (this.containerSize / 100) * (((paneIndex - showIndex) * 100) + percent);
            if(this.direction & Hammer.DIRECTION_HORIZONTAL) {
                translate = 'translate3d(' + pos + 'px, 0, 0)';
            } else {
                translate = 'translate3d(0, ' + pos + 'px, 0)'
            }
              this.panes[paneIndex].style.transform = translate;
              this.panes[paneIndex].style.mozTransform = translate;
              this.panes[paneIndex].style.webkitTransform = translate;
        }

        this.currentIndex = showIndex;
        this.setActive(showIndex);
    },

    /**
     * handle pan
     * @param {Object} ev
     */
    onPan : function (ev) {
        var delta = ev.deltaX;
        var percent = (100 / this.containerSize) * delta;
        var animate = false;

        if (ev.type == 'panend' || ev.type == 'pancancel') {
            if (Math.abs(percent) > 20 && ev.type == 'panend') {
                this.currentIndex += (percent < 0) ? 1 : -1;
            }
            percent = 0;
            animate = true;
        }

        this.show(this.currentIndex, percent, animate);
    }
};
