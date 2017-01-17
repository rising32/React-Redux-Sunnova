import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toggle as toggleSlidePage} from 'redux/modules/slidePage';
import {toggle} from 'redux/modules/glass';
import {pushState} from 'redux-router';


@connect(() => ({}), {toggle, pushState, toggleSlidePage})
export default class NewLead extends Component {
  static propTypes = {}

  disableGlassAndRedirect = () => {
    this.props.toggle();
    this.props.pushState(null, '/assign-lead');
  }

  disableGlassAndMap = () => {
    this.props.toggle();
    this.props.toggleSlidePage();
    this.props.pushState(null, '/center-map');
  }

  render() {
    require('./NewLeadGlass.scss');

    return (
      <div className="submit-claim-widget has-event" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div className="glass-widget-cancel glass-widget-text clickable" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          position: 'relative'
        }}>
          <div onClick={this.props.toggle}>Close This Window</div>
        </div>
        <div className="submit-widget-bottom" style={{marginTop: 0, transform: 'none', top: '70%'}}>
        <div className="" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '80%',
          maxWidth: 500,
          margin: '0 auto'
        }}>
          <div onClick={this.disableGlassAndRedirect} className="submit-widget-buttons glass-widget-text clickable">Assign</div>
          <div onClick={this.disableGlassAndMap} className="submit-widget-buttons glass-widget-text clickable">Claim</div>
          <div className="submit-widget-buttons glass-widget-text clickable"><div>Leave Unassigned</div></div>
        </div>
      </div>
      </div>

    );
  }
}
