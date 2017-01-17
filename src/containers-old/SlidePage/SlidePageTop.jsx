import React, {Component, PropTypes} from 'react';
import {GoogleMapLoader, GoogleMap} from 'react-google-maps';

import {toggle as toggleGlass} from 'redux/modules/glass';
import {toggle as toggleSlidePage} from 'redux/modules/slidePage';
import {openTop} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {logout} from 'redux/modules/auth';
import {setFilter, setPageNumber} from 'redux/modules/layout';
import {setOrigin} from 'redux/modules/navigation';
import {API} from 'redux/modules/data';

import {Text} from 'components';

@connect(
  (state) => ({user: state.auth.user, layoutName: state.layout.layoutName, logged: state.layout.userLogged, filter: state.layout.filter, leadsCount: state.data.leadsCount, refreshNeeded: state.data.refreshNeeded, lead: state.data.selectedLead, arrays: state.data.arrays}),
  {toggleGlass, openTop, pushState, logout, setFilter, toggleSlidePage, setPageNumber, setOrigin, loadArrays: API.loadArrays})
export default class SlidePageTop extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  static contextTypes = {
    history: PropTypes.object
  };

  state = {
    scroll: null,
    leadTest: false,
    leadFlagged: true,
    leadCanceled: false,
    mapEnabled: false
  };

  componentWillReceiveProps(nextProps) {
    const {lead} = nextProps;
    if (lead) {
      // fix
      // if (lead.sfid) {
      //   this.props.loadArrays(lead.sfid);
      // }

      this.setState({
        leadTest: lead.testing,
        leadFlagged: lead.flagged,
        leadCanceled: lead.canceled
      });
    }
  }

  goBack = () => {
    this.props.openTop();

    const lastPageNumber = localStorage.getItem('lastPageNumber');
    if (lastPageNumber) {
      this.props.setPageNumber(parseInt(lastPageNumber, 10));
      localStorage.removeItem('lastPageNumber');
    }
  }

  goLogout = () => {
    this.props.logout();
    this.props.openTop();
    this.props.pushState(null, '/');
  }

  goHelp = () => {
    this.props.toggleGlass('Help');
  }

  goNewLead = () => {
    localStorage.setItem('back', 'SlidePageTop');
    localStorage.setItem('offset', 100);
    this.props.setOrigin('topSlidePage');
    this.props.openTop();
    this.props.pushState(null, '/new-lead');
    setTimeout(this.props.toggleSlidePage, 0);
  }

  goRoof = () => {
    this.props.setOrigin('topSlidePage');
    this.props.openTop();
    this.props.pushState(null, '/center-map');
  }

  goSavings = () => {
    this.props.setOrigin('topSlidePage');
    this.props.openTop();
    this.props.pushState(null, '/choose-provider');
    setTimeout(this.props.toggleSlidePage, 0);
  }

  goOwnership = () => {
    this.props.setOrigin('topSlidePage');
    this.props.openTop();
    this.props.pushState(null, '/credit-check');
    setTimeout(this.props.toggleSlidePage, 0);
  }

  goPricing = () => {
    this.props.setOrigin('topSlidePage');
    this.props.openTop();
    this.props.pushState(null, '/pricing');
    setTimeout(this.props.toggleSlidePage, 0);
  }

  toggleDraggableMap = () => {
    const draggable = this.state.mapEnabled;
    if (draggable) {
      this.disableDrag();
    } else {
      this.enableDrag();
    }
    this.setState({mapEnabled: !draggable });
  }

  disableDrag = () => { this._map.props.map.setOptions({draggable: false}); }
  enableDrag = () => { this._map.props.map.setOptions({draggable: true}); }

  render() {
    require('./SlidePageTop.scss');

    const {lead} = this.props;


    const simpleHeader = (
        <div ref="pageHead" className="connect-page-head" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2000
        }}>
          <div className="connect-page-head-row" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 100,
            marginLeft: 30
          }}>
            <div className style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <img onClick={this.goBack} className="must-work connect-page-back-arrow clickable" src="/images/icon_back.svg" style={{
                width: 25
              }}/>
              <div className="profile-pic-small fix-left" style={{
                left: 30
              }}>
                <img src={ this.props.user && this.props.user.profile_picture ? this.props.user.profile_picture : '/images/default_profile_picture.jpg'} width="50" style={{borderRadius: 25}}/>
              </div>
              <div className="text-link clickable" onClick={this.goLogout} style={{
                left: 50,
                position: 'relative'
              }}>Logout</div>
            </div>
            <div className="user-info-detail" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, 0)'
            }}>
              Project Overview
            </div>
            <div className="company-logo" style={{
              marginRight: 60
            }}>
              <div className="text-link clickable" onClick={this.goHelp} style={{
                float: 'left',
                lineHeight: '50px',
                position: 'relative',
                left: -20
              }}>Help</div>
              <img className="company-logo" src="images/NikeSolar.svg" style={{
                height: 50,
                width: 120
              }}/>
            </div>
          </div>
        </div>
    );


    if (!lead) {
      return <div/>;
    }


    const klass = this.props.show
      ? 'open'
      : '';
    const style = this.props.show
      ? {
        overflow: 'scroll',
        transform: 'translate3d(0, 0, 0)'
      }
      : {
        transform: 'translate3d(0, -110%, 0)'
      };

    const mapDisabled = <span className="left-margin clickable" onClick={this.toggleDraggableMap}>Adjust</span>;
    const mapEnabled = [
      <span className="left-margin clickable" onClick={this.toggleDraggableMap}>Save</span>,
      <span className="left-margin clickable" onClick={this.toggleDraggableMap}>Cancel</span>
    ];

    const map = (
      <div style={{position: 'relative'}} className={this.state.mapEnabled ? 'enabled' : ''}>
        <Text><span className="bold">Roof Location</span> {this.state.mapEnabled ? mapEnabled : mapDisabled} </Text>
        <div className="visible-controls center-dot">
          <Text>Rooftop</Text>
        </div>
        <div style={{margin: '10px 25px'}}>
          <GoogleMapLoader containerElement={<div {...this.props} style={{ height: 400, width: '100%' }}/>} googleMapElement={
            <GoogleMap ref={it => this._map = it} defaultOptions={{mapTypeControl: false, mapTypeId: 'satellite', tilt: 0, disableDefaultUI: true, zoomControl: false, scrollwheel: false, draggable: false}} defaultZoom={20} defaultCenter={{lat: lead.address_lat, lng: lead.address_lng}}/>
          }/>
        </div>
      </div>
    );


    const solarArrays = [];
    let index = 1;
    this.props.arrays.forEach((array) => {
      const arrHtml = (
        <div className="lead-info">
          <div className="inline-text">Array {index} Original Shade Value: <strong>{array.shading_coefficient__c}</strong></div>
          <div className="inline-text">New value: <strong style="color: red;">Not Yet Calculated</strong></div>
        </div>
      );

      solarArrays.push(arrHtml);
      index++;
    });

    const assignedTo = lead.user ? <Text inline>Assigned to: {lead.user.firstname} {lead.user.middlename} {lead.user.lastname}</Text> : <Text inline>Assigned to: Unassigned</Text>;

    return (
      <div className={klass + ' connect-page-top has-event'} style={style}>
        {simpleHeader}
        <div ref="scrollable" className="scrollable" style={{height: (window.innerHeight - 0.1 * window.innerHeight - 100)}}>
          <div style={{marginLeft: 30}}>
            <Text><strong>Project Status: Permitting Phase</strong> <span className="left-margin">8 days late (based on Trinity's average time to complete phase)</span></Text>
          </div>
          <img src="/images/timeline.svg" width="100%" style={{margin: '20px 0'}}/>

          <div className="horizontal-line"/>
          <div className="lead-info" style={{marginLeft: 30}}>
            {assignedTo}

            <Text inline>Flagged</Text>
            <div className="option-input">
              <div className={ this.state.leadFlag ? 'text-link clickable activated' : 'text-link clickable'} onClick={() => this.setState({leadFlag: true})}>Yes</div>
            </div>
            <div className="option-input">
              <div className={ this.state.leadFlag ? 'text-link clickable' : 'text-link clickable activated'} onClick={() => this.setState({leadFlag: false})}>No</div>
            </div>

            <Text inline>Canceled</Text>
            <div className="option-input">
              <div className={ this.state.leadCanceled ? 'text-link clickable activated' : 'text-link clickable'} onClick={() => this.setState({leadCanceled: true})}>Yes</div>
            </div>
            <div className="option-input">
              <div className={ this.state.leadCanceled ? 'text-link clickable' : 'text-link clickable  activated'} onClick={() => this.setState({leadCanceled: false})}>No</div>
            </div>

            <Text inline>Test data</Text>
            <div className="option-input">
              <div className={ this.state.leadTest ? 'text-link clickable activated' : 'text-link clickable'} onClick={() => this.setState({leadTest: true})}>Yes</div>
            </div>
            <div className="option-input">
              <div className={ this.state.leadTest ? 'text-link clickable' : 'text-link clickable activated'} onClick={() => this.setState({leadTest: false})}>No</div>
            </div>
          </div>

          {solarArrays}

          <div className="horizontal-line"/>

          <div style={{marginLeft: 30}}>
						<Text bold>Contact(s) <div className="edit-button" onClick={this.goNewLead}>Edit</div></Text>
						<Text><span>{lead.firstname} {lead.middlename} {lead.lastname}</span> <span className="left-margin">{lead.email}</span> <span className="left-margin">Primary Contact</span></Text>
						<Text>{lead.phone}</Text>

						<div className="delimiter"/>

						<Text bold>Solar address</Text>
						<Text><span>{lead.street}</span></Text>
						<Text>{lead.city} {lead.state} {lead.postalcode}</Text>

						<div className="delimiter"/>

						<Text><strong>Billing Address</strong> <span className="left-margin">Same as solar address</span></Text>

						<div className="horizontal-line"/>

						<Text bold>Roof Characteristics <div className="edit-button" onClick={this.goRoof}>Edit</div></Text>
						<Text>Actual roof identified via map adjustment: <strong>Yes</strong> <span className="left-margin">Roof Type: <strong>Tile</strong></span> <span className="left-margin">Roof Condition: <strong>Fair</strong></span></Text>

						<div className="delimiter"/>

						{/*{this.props.lead.id && map}*/}
						{lead.address_lat && lead.address_lng && map}

						<div className="horizontal-line"/>
						<Text bold>ASCE 7-10 Wind Speed: 110 mph <span className="left-margin">Snow</span> <div className="edit-button" onClick={this.goSavings}>Edit</div></Text>
						<Text bold>Savings</Text>

						<div className="delimiter"/>

						<Text bold>Cost of Electricity Without Solar</Text>
						<Text inline>Utility:<span className="bold">{lead.electricity_provider}</span></Text>
						<Text inline>Plan:<span className="bold">{lead.electricity_plan}</span></Text>
						<Text>One-month cost estimate provided by homeowner: <span className="bold">January was ${lead.electricity_january}</span> <span className="left-margin">Yearly Estimate</span> <span className="bold">$1,873</span></Text>
						<Text>Seasonality Multiplier: <span className="bold">{lead.electricity_multiplier}</span></Text>

						<div className="horizontal-line"/>

						<Text bold>Estimated Cost With Sunnova Energy <div className="edit-button">Edit</div></Text>

						<div className="delimiter"/>

						<Text><span className="bold">Quote 1</span> Created on 9/26/16</Text>
						<Text><span className="bold">$397 Annual Savings</span> <span className="left-margin">Proposal</span> <span className="left-margin">Contract</span> <span className="left-margin">Hardware</span> <span className="left-margin">Plan-set Pages</span> <span className="left-margin">Array(s)</span> <span className="left-margin">Duplicate</span></Text>
						<Text>Contact written on <span className="bold">9/28/16 (expired 10/28/16)</span> <span onClick={this.goPricing} className="left-margin">EZ PAY PPA</span> <span className="left-margin bold">View PPA Contract</span> <span className="left-margin">EZ OWN</span> <span className="left-margin">Lease</span></Text>

						<div className="delimiter"/>

						<Text><span className="bold">Quote 2</span> Created on 9/26/16</Text>
						<Text><span className="bold">$339 Annual Savings</span> <span className="left-margin">Proposal</span> <span className="left-margin">Contract</span> <span className="left-margin">Hardware</span> <span className="left-margin">Plan-set Pages</span> <span className="left-margin">Array(s)</span> <span className="left-margin">Duplicate</span></Text>
						<Text>Contact written on <span className="bold">11/4/16 (expired 12/4/16)</span> <span className="left-margin bold">View EZ PAY PPA</span> <span className="left-margin">PPA Contract</span> <span className="left-margin">EZ OWN</span> <span className="left-margin">Lease</span></Text>
						<Text><span className="bold">Option 1 $348</span> <span className="left-margin">Proposal</span> <span className="left-margin">Revised Contract (Most Recent)</span> <span className="left-margin">Plan-set Pages</span> <span className="left-margin">Solar Arrays</span></Text>
						<Text>Original Contract</Text>
						<Text>Original Contract - unsigned</Text>
						<Text>Contract Revision 1 - unsigned</Text>
						<Text bold>Contract Revision 2 - signed</Text>

						<div className="horizontal-line"/>

						<Text bold>Eligibility</Text>

						<div className="delimiter"/>

						<Text bold>Ownership <div onClick={this.goOwnership} className="edit-button">Edit</div></Text>
						<Text>Title records indicate this address is owned by <span className="bold">"Jason Lytle Family LP".</span></Text>
						<Text>Ownership type is indicated as <span className="bold">Trust/Partnership</span></Text>

						<div className="delimiter"/>

						<Text bold>FICO Score <div className="edit-button">Edit</div></Text>
						<Text>Jim McCreedy &lt; 650 FICO</Text>
						<Text bold>Janet McCreedy &#8805; 650 FICO</Text>
          </div>

          <div onClick={this.goBack} className="main-button got-it clickable" style={{margin: '50px auto'}}>Close</div>
        </div>
      </div>
    );
  }
}
