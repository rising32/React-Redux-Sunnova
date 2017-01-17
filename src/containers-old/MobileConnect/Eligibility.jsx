import React, {Component, PropTypes} from 'react';
import {GoogleMapLoader, GoogleMap} from 'react-google-maps';
import {toggle as toggleGlass} from 'redux/modules/glass';

import {Arrow} from 'components';

import {connect} from 'react-redux';
import {pushState} from 'redux-router';

// import ActionButton from 'components';
import {toggle, openTop} from 'redux/modules/slidePage';
import {setPageNumber} from 'redux/modules/layout';
import {logoutAndResetRedux} from 'redux/modules/auth';
import {setLastView} from 'redux/modules/navigation';

@connect(state => (
  {user: state.auth.user, slidePageOpened: state.slidePage.opened, glassActive: state.glass.active, lead: state.data.selectedLead}),
  {pushState, toggle, setPageNumber, openTop, toggleGlass, logoutAndResetRedux, setLastView})
export default class Eligibility extends Component {
  static propTypes = {}

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    lat: this.props.lead.address_lat || 0,
    lng: this.props.lead.address_lng || 0
  }

  componentWillMount() {
    this.props.setPageNumber(2);
    this.props.setLastView({mainView: 'Eligibility'});
  }

  goCreditCheck = () => {
    if (!this.props.lead.id) {
      this.props.toggleGlass('EligibilityGlass');
      return;
    }

    this.props.toggle();
    this.props.pushState(null, '/credit-check');
  }

  goNext = () => {
    if (!this.props.lead.id) {
      this.props.toggleGlass('ProposalGlass');
      return;
    }

    localStorage.setItem('lastLeadId', this.props.lead.id);
    window.location = 'https://proposal.sunnova.com/' + this.props.lead.firstname + '.' + this.props.lead.lastname + '/2j2udd902/';
  }

  goBack = () => {
    this.props.pushState(null, '/savings');
  }

  openMenu = () => {
    this.props.toggle();
    this.props.setLastView({mainView: 'Eligibility'});
    this.context.router.push('/menu');
  }

  logout = () => {
    this.props.logoutAndResetRedux();
    this.props.pushState(null, '/');
  }

  render() {
    require('./Eligibility.scss');

    const gmaps = (
      <GoogleMapLoader containerElement={<div {...this.props} style={{ height: '100%', }}/>} googleMapElement={
        <GoogleMap ref={(map) => console.log(map)} defaultOptions={{mapTypeControl: false, mapTypeId: 'satellite', tilt: 0, disableDefaultUI: true}} defaultZoom={20} defaultCenter={{lat: this.state.lat, lng: this.state.lng}}/>
      }/>
    );

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

    // logged
    return (
      <div className="landing-page qualify-back qualify">
        {this.props.user && this.props.user.social && sociallyLogged}
        {this.props.user && !this.props.user.social && logged}
        <div className="landing-flex">
          <div className="headline">
            <div style={{marginTop: -100}}><h1 className="headline-savings" style={{textAlign: 'center'}}>If you're a homeowner, with a FICO score <br/> of 650 or better, you'll likely qualify.</h1></div>,

            <div onClick={this.goCreditCheck} style={{width: 300}} className={this.props.lead.owner && this.props.lead.owner !== 'not-sure' ? 'action-button button-background success' : 'action-button button-background'}>Home Ownership</div>,
            <div className="action-button button-background" style={{width: 300}}>FICO Score</div>
          </div>

          {/*TODO: refactor into component*/}
          <div className="logo"><img src="/images/logo_withoutAsteriskText.svg"/></div>
        </div>

        <Arrow left onClick={this.goBack}>Savings</Arrow>
        <Arrow right onClick={this.goNext}>Proposal</Arrow>

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
