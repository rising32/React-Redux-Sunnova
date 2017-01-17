import React, {Component, PropTypes} from 'react';

import {toggle as toggleGlass} from 'redux/modules/glass';

import {connect} from 'react-redux';
import {pushState} from 'redux-router';

import {toggle, openTop} from 'redux/modules/slidePage';
import {setPageNumber} from 'redux/modules/layout';
import {logoutAndResetRedux} from 'redux/modules/auth';
import {setLastView} from 'redux/modules/navigation';

@connect(
  (state) => ({lead: state.data.selectedLead}),
  {pushState, toggle, setPageNumber, openTop, toggleGlass, logoutAndResetRedux, setLastView})
export default class Designer extends Component {
  static propTypes = {}

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.setPageNumber(1);
    this.props.setLastView({mainView: 'Savings'});
  }

  goBack = () => {
    this.props.pushState(null, '/savings');
  }

  render() {
    const url = 'https://sunnova-connect.herokuapp.com?id=' + this.props.lead.id;

    return (
      <div className="designer-page qualify" style={{height: '100%'}}>
        <div style={{
          position: 'absolute',
          top: 8,
          right: 600,
          zIndex: 2020,
          fontSize: '1.1rem',
          background: 'white',
          padding: 10,
          borderRadius: 10,
          cursor: 'pointer'
        }} onClick={this.goBack}>Close Designer</div>
        <iframe src={url} style={{width: '100%', height: '100%', zIndex: 2000, position: 'absolute'}}/>
      </div>
    );
  }
}
