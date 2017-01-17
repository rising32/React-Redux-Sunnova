import React, {Component, PropTypes} from 'react';
import {GoogleMapLoader, GoogleMap} from 'react-google-maps';
import {Arrow} from 'components';

import {pushState} from 'redux-router';
import {connect} from 'react-redux';
import {toggle as toggleSlidePage} from 'redux/modules/slidePage';
import request from 'superagent';
import {API} from 'redux/modules/data';
import {openTop} from 'redux/modules/slidePage';

@connect(
  (state) => ({address: state.layout.address, lead: state.data.selectedLead, origin: state.navigation.origin}),
  {pushState, toggleSlidePage, updateLead: API.update, openTop})
export default class CenterMap extends Component {
  static propTypes = {}

  static contextTypes = {
    history: PropTypes.object
  }

  state = {
    active: 1,
    step: 0,
    map: null,
    lat: 0,
    lng: 0
  }

  componentDidMount = () => {
    // address=Tr+Spojencu+1246,+Otrokovice+Czech+Republic
    const {lead} = this.props;
    let url = 'https://maps.google.com/maps/api/geocode/json?sensor=false&address=';
    const params = [lead.street, lead.city, lead.postalcode, lead.postalcode, lead.country];

    url += params.join(', ').split(' ').join('+') + ';';
    request
      .get(url)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          console.error(err);
          return;
        }

        const json = JSON.parse(res.text);
        console.log(json.results);

        if (json.results.length < 1) {
          console.error('Address not found');
          return;
        }

        const gps = json.results[0].geometry.location;
        console.log(gps);

        this.setState({lat: gps.lat, lng: gps.lng});
      });
  }

  setActive = (num) => {
    this.setState({active: num});
  }

  disableDrag = () => { this._map.props.map.setOptions({draggable: false}); }
  enableDrag = () => { this._map.props.map.setOptions({draggable: true}); }

  nextStep = () => {
    const step = this.state.step; // 0 - center map, 1 - roof type, 2 - roof condition
    if (step === 2) {
      if (this.props.origin === 'topSlidePage') {
        setTimeout(this.props.openTop, 0);
        this.props.toggleSlidePage();
        this.props.pushState(null, '/');
      } else {
        this.actionCalculateElectricity();
      }
    } else {
      this.setState({step: step + 1, active: -1});
    }

    this.disableDrag();
  }

  goBack = () => {
    const step = this.state.step; // 0 - center map, 1 - roof type, 2 - roof condition
    if (step === 0) {
      if (this.props.origin === 'topSlidePage') {
        setTimeout(this.props.openTop, 0);
        this.props.toggleSlidePage();
        this.props.pushState(null, '/');
      } else {
        this.props.toggleSlidePage();
        this.context.history.goBack();
      }
    } else if (step === 1) {
      this.setState({active: 0});
      this.enableDrag();
    }

    this.setState({step: step - 1});
    this.setState({step: this.state.step - 1});
  }

  actionCalculateElectricity = () => {
    // const map = this.state.map;
    if (this.state.lat && this.state.lng) {
      this.props.updateLead(this.props.lead.id, {address_lat: this.state.lat, address_lng: this.state.lng});
    }

    const {type} = this.props.lead;
    if (type === 'existing') {
      this.props.pushState(null, '/savings');
    } else if (type === 'partial') {
      this.props.toggleSlidePage();
      this.props.pushState(null, '/menu');
    } else {
      this.props.pushState(null, '/');
    }
  }

  render() {
    require('./CenterMap.scss');

    const gmaps = (
      <GoogleMapLoader containerElement={<div {...this.props} style={{ height: '100%', }}/>} googleMapElement={
        <GoogleMap ref={it => this._map = it} defaultOptions={{mapTypeControl: false, mapTypeId: 'satellite', tilt: 0, disableDefaultUI: true, zoomControl: false, scrollwheel: false}} defaultZoom={20} defaultCenter={{lat: this.state.lat, lng: this.state.lng}}/>
      }/>
    );

    const centerDot = (
      <div className="visible-controls center-dot">
        <div className="text">Rooftop</div>
      </div>
    );

    const roofType = (
      <ul className="visible-controls roof-options">
        <li className={this.state.active === 0 && 'active'} onClick={this.setActive.bind(this, 0)}>Comp Shingle</li>
        <li className={this.state.active === 1 && 'active'} onClick={this.setActive.bind(this, 1)}>Tile</li>
        <li className={this.state.active === 2 && 'active'} onClick={this.setActive.bind(this, 2)}>Metal</li>
        <li className={this.state.active === 3 && 'active'} onClick={this.setActive.bind(this, 3)}>Other</li>
      </ul>
    );

    const roofCondition = (
      <ul className="visible-controls roof-options">
        <li className={this.state.active === 0 && 'active'} onClick={this.setActive.bind(this, 0)}>Excellent</li>
        <li className={this.state.active === 1 && 'active'} onClick={this.setActive.bind(this, 1)}>Good</li>
        <li className={this.state.active === 2 && 'active'} onClick={this.setActive.bind(this, 2)}>Fair</li>
        <li className={this.state.active === 3 && 'active'} onClick={this.setActive.bind(this, 3)}>Poor</li>
        <li className={this.state.active === 4 && 'active'} onClick={this.setActive.bind(this, 4)}>Faulty</li>
      </ul>
    );

    const textForStep = [
      'Ensure the home\'s roof is beneath the circle shown below. Touch and move the map image into position, then tap the right arrow to continue.',
      'Please choose a roof type. This will filter your racking and mounting options.',
      'Please identify the condition of the roof'
    ];

    const textForLeftArrow = [
      'Back Up<br/>A Step',
      'Rooftop<br/>Location',
      'Roof Type'
    ];

    const textForRightArrow = [
      'Done, next step<br/>is select root type',
      'Roof<br/>Condition',
      'Estimate<br/>Savings'
    ];

    return (
      <div className="center-map" style={{
        height: '100%',
        width: '100%'
      }}>
        <div className="page-head">
          <div className="page-description">
            <div style={{margin: '0 40px', height: 80}}>
              <span style={{marginRight: 40}} className="clickable">Help</span>
              <span style={{marginRight: 40}} className="clickable">34 sec. tutorial <img className="play-icon" src="images/icon_playButton_black.svg" width="20px" style={{top: 3, position: 'relative'}}/></span>
              <span style={{lineHeight: '40px'}}><strong style={{marginRight: 10}}>Instructions:</strong> {textForStep[this.state.step]}</span>
            </div>
          </div>
          <div className="menu-open-button has-event clickable" style={{
            width: 200,
            margin: 0,
            height: '100%',
            background: 'white',
            paddingLeft: 20
          }}>
            <img style={{
              marginTop: 25
            }} src="/images/NikeSolar.svg" width="150" height="50"/>
          </div>
        </div>

        <Arrow left onClick={this.goBack}>{textForLeftArrow[this.state.step]}</Arrow>
        <Arrow right disabled={this.state.active === -1} onClick={this.nextStep}>{textForRightArrow[this.state.step]}</Arrow>

        {this.state.step === 0 && centerDot}
        {this.state.step === 1 && roofType}
        {this.state.step === 2 && roofCondition}

        <section style={{
          height: '100%',
          width: '100%'
        }}>
        {this.state.lat && gmaps}
        </section>
      </div>
    );
  }
}
