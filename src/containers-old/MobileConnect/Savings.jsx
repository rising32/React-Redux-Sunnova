import React, {Component, PropTypes} from 'react';
import {GoogleMapLoader, GoogleMap} from 'react-google-maps';
import YouTube from 'react-youtube';
import {Arrow} from 'components';
import request from 'superagent';

import {connect} from 'react-redux';
import {pushState} from 'redux-router';

// Actions
import {toggle} from 'redux/modules/slidePage';
import {toggle as toggleGlass} from 'redux/modules/glass';
import {setPageNumber} from 'redux/modules/layout';
import {API} from 'redux/modules/data';
import {logoutAndResetRedux} from 'redux/modules/auth';
import {setLastView} from 'redux/modules/navigation';

@connect(
  state => ({user: state.auth.user, slidePageOpened: state.slidePage.opened, glassActive: state.glass.active, leads: state.data, lead: state.data.selectedLead}),
 {pushState, toggle, setPageNumber, toggleGlass, loadLead: API.loadOne, logoutAndResetRedux, setLastView, getTariffs: API.getTariffs, updateLead: API.update, getProviders: API.getServingEntity}
)
export default class Savings extends Component {
  static propTypes = {}

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    withSolar: true,
    player: null,
    videoActive: false,
    calculateSavingsClicked: false,
    lat: this.props.leads.selectedLead.address_lat || 0,
    lng: this.props.leads.selectedLead.address_lng || 0
  }

  componentWillMount() {
    const lead = this.props.lead;
    if (lead.id) {
      const { id, firstname, lastname, street, postalcode, city, state } = this.props.lead;
      if (!lead.address_lat && !lead.address_lng) {
        const geocoder = new global.google.maps.Geocoder();
        const inputAddress = `${street} ${city} ${state} ${postalcode}`;
        geocoder.geocode({
          'address': inputAddress
        }, (results) => {
          const res = results[0].geometry.location;
          const gps = {
            address_lat: res.lat(),
            address_lng: res.lng()
          };
          this.props.updateLead(lead.id, gps);
        });
      } else {
        console.debug('LatLng set.');
      }

      this.props.getProviders(postalcode);
      if (!this.props.lead.genability_account_id) {
        console.debug('[genability] Registering account');
        const action = this.registerAccount(id, `${firstname} ${lastname}`, `${street} ${city} ${state} ${postalcode}`);
        action.then((uuid) => {
          this.props.updateLead(id, { 'genability_account_id': uuid });
          this.props.getTariffs(uuid);
        });
      } else {
        console.debug('[genability] Loading tarrifs');
        this.props.getTariffs(this.props.lead.genability_account_id);
      }
    }

    this.props.setPageNumber(1);
    this.props.setLastView({mainView: 'Savings'});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      lat: nextProps.leads.selectedLead.address_lat || 0,
      lng: nextProps.leads.selectedLead.address_lng || 0
    });

    const lead = nextProps.leads.selectedLead;
    if (lead && lead.address_lat && lead.address_lng) {
      this.setState({lat: lead.address_lat, lng: lead.address_lng});
    }
  }

  onReady = (event) => {
    this.setState({
      player: event.target,
    });
  }

  setCalculateSavingsClicked = () => {
    if (this.props.user && this.props.leads.selectedLead.id) {
      this.setState({calculateSavingsClicked: true});
    } else {
      this.props.toggleGlass('SavingsGlass');
    }
  }

  registerAccount = (userId, name, address) => {
    return new Promise((resolve) => {
      const url = '/api/createAccount';
      request
        .post(url)
        .send({ userId, name, address })
        .end((err, res) => {
          console.debug('[genability] Account registered');
          resolve(res.body);
        });
    });
  }

  playVideo = () => {
    this.setState({
      videoActive: true
    });

    this.state.player.playVideo();
  }

  closeVideo = () => {
    this.setState({
      videoActive: false,
      player: null
    });
  }

  openMenu = () => {
    this.props.toggle();
    this.props.setLastView({mainView: 'Savings'});
    this.context.router.push('/menu');
  }

  displayWithSolar = () => {
    this.setState({withSolar: true});
  }

  displayWithoutSolar = () => {
    this.setState({withSolar: false});
  }

  goCalculateMySavings = () => {
    this.props.toggle();
    // this.props.pushState(null, '/choose-provider');
    this.props.pushState(null, '/choose-plan');
  }

  goNext = () => {
    this.props.pushState(null, '/eligibility');
  }

  goBack = () => {
    this.props.pushState(null, '/');
  }

  goHardware = () => {
    this.props.toggle();
    this.props.pushState(null, '/hardware');
  }

  openBox = () => {
    this.props.toggleGlass('LoginBoxGlass');
  }

  logout = () => {
    this.props.logoutAndResetRedux();
    this.props.pushState(null, '/');
  }

  render() {
    require('./Savings.scss');

    const lead = this.props.leads.selectedLead;

    const logged = (
      <div className="has-event clickable" style={{
        position: 'absolute',
        top: '5%',
        right: '5%'
      }} onClick={this.openMenu}>
        <ul className="logged-info">
          <li className="profile-picture">
            <img src={ this.props.user && this.props.user.profile_picture ? this.props.user.profile_picture : '/images/default_profile_picture.jpg'}/>
          </li>
          <li className="company-logo">
            <img style={{}} src="/images/NikeSolar.svg" width="120" height="50"/>
          </li>
          <li className="menu">
            <img style={{marginTop: 3}} src="/images/icon_openMenu.svg" width="30"/>
          </li>
        </ul>
      </div>
    );

    const sociallyLogged = (
      <div className="has-event" style={{
        position: 'absolute',
        top: '5%',
        right: '5%'
      }}>
        <ul className="logged-info">
          <li className="profile-picture">
            <img src={ this.props.user && this.props.user.profile_picture ? this.props.user.profile_picture : '/images/default_profile_picture.jpg'}/>
          </li>
          <li className="menu">
            <img style={{marginTop: 3}} src="/images/facebookLogo.svg" height="30"/>
          </li>
          <li onClick={this.logout} className="menu clickable" style={{color: 'black', marginLeft: 50, fontSize: '1.1rem'}}>
            Logout
          </li>
        </ul>
      </div>
    );

    const opts = {
      height: '370',
      width: '670',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        showinfo: 0,
        // autoplay: 1
      }
    };

    const video = [
      <YouTube videoId="4rzbzWsw0Iw" opts={opts} onReady={this.onReady} style={{zIndex: 1500}} />,
    ];
    const closeButton = (
      <div className="action-button" style={{
        position: 'absolute',
        top: '5%',
        right: '5%',
        fontSize: '1.1rem',
        padding: 0
      }} onClick={this.closeVideo}>Close Video</div>
    );
    const notLoggedContent = [
      this.props.glassActive ? <div/> : <img className="welcome-text clickable" style={{top: 0}} src="/images/howItWorks.png" width="300" onClick={this.playVideo} />,
      // <h1 className="clickable center-center" style={{color: 'white', fontSize: 35, fontWeight: 300, position: 'relative', top: -50}} onClick={this.setCalculateSavingsClicked}>Calculate Your Savings</h1>,
      <div className="action-button" onClick={this.setCalculateSavingsClicked} style={{position: 'absolute', top: '5%', left: '5%', fontSize: '1.1rem', padding: '20px 0px'}}>Calculate Your Savings</div>
    ];

    const printDollars = (number) => {
      const parts = number.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    };

    const loggedContent = [
      <div style={{marginTop: -70}}><h1 className="headline-savings">Cost savings estimates are based on:</h1></div>,
      lead.electricity_yearly ? <div className="action-button button-background success" onClick={this.goCalculateMySavings} style={{width: 400}}>${printDollars(lead.electricity_yearly)} Yearly for Electricity</div> : <div style={{width: 400}} className="action-button button-background" onClick={this.goCalculateMySavings}>Your electricity use</div>,
      lead.test ? <div className="action-button button-background success" onClick={this.goHardware} style={{width: 400}}>${printDollars(lead.test)} Yearly Cost Savings</div> : <div className="action-button button-background" style={{width: 400}} onClick={this.goHardware}>Your solar system</div>,
      <div className="action-button" onClick={this.playVideo} style={{position: 'absolute', top: '5%', left: '5%', fontSize: '1.1rem', padding: '20px 0'}}>Cost Savings Example <img src="/images/icon_playButton_white.svg" width="20" style={{position: 'relative', top: 3, fontSize: '1rem'}}/></div>
    ];

    const notLogged = (
      <img onClick={this.openBox} style={{position: 'absolute', top: '5%', right: '5%', cursor: 'pointer'}} src="/images/button_logIn.svg" width="300" className="clickable login-button" />
    );

    const gmaps = (
      <GoogleMapLoader containerElement={<div {...this.props} style={{ height: '100%', }}/>} googleMapElement={
        <GoogleMap ref={() => {}} defaultOptions={{mapTypeControl: false, mapTypeId: 'satellite', tilt: 0, disableDefaultUI: true}} defaultZoom={20} defaultCenter={{lat: this.state.lat, lng: this.state.lng}}/>
      }/>
    );

    return (
      <div className={"landing-page savings-back"}>
        {this.state.videoActive && closeButton}
        {!this.state.videoActive && this.props.user && this.props.user.social && sociallyLogged}
        {!this.state.videoActive && this.props.user && !this.props.user.social && logged}
        {!this.state.videoActive && !this.props.user && notLogged}

        {/*<div className="left-arrow visible-controls" onClick={this.goBack}>
          <img src="/images/proposal_arrowLeft.svg" width="50"/>
          <span style={{
            color: 'white',
            fontSize: '1.1rem',
            position: 'relative',
            left: -40,
            top: 30,
          }}>Homeowner Test</span>
        </div>*/}
        {/*<div className="right-arrow visible-controls" onClick={this.goNext} style={{textAlign: 'right', right: '5%'}}>
          <img src="/images/proposal_arrowRight.svg" width="40" style={{position: 'absolute', right: 0}}/>
            <span style={{
              color: 'white',
              fontSize: '1.1rem',
              position: 'relative',
              right: 10,
              top: 70,
            }}>Eligibility</span>
        </div>*/}

        <Arrow left onClick={this.goBack}>Homeowner</Arrow>
        <Arrow right onClick={this.goNext}>Eligibility</Arrow>


        <div className="landing-flex">
          <div className="headline">
            {this.state.videoActive && video}
            {!this.state.videoActive && this.props.lead.id && loggedContent}
            {!this.state.videoActive && !this.props.lead.id && this.state.calculateSavingsClicked && loggedContent}
            {!this.state.videoActive && !this.props.lead.id && !this.state.calculateSavingsClicked && notLoggedContent}
          </div>
          <div className="logo"><img src="/images/logo_withoutAsteriskText.svg"/></div>
        </div>

        <section style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          zIndex: -1
        }}>
          {this.state.lat && gmaps}
        </section>
      </div>
    );
  }
}
