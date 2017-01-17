import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toggle} from 'redux/modules/glass';
import {toggle as toggleSlidePage} from 'redux/modules/slidePage';
import {pushState} from 'redux-router';
import {setName} from 'redux/modules/layout';
import {setOrigin} from 'redux/modules/navigation';

import {API as LeadsAPI} from 'redux/modules/data';


@connect((state) => (
  {lead: state.data.selectedLead}),
  {toggle, pushState, toggleSlidePage, setName, setFlag: LeadsAPI.setFlag, remove: LeadsAPI.remove, load: LeadsAPI.load, update: LeadsAPI.update, setOrigin})
export default class ExistingLeadGlass extends Component {
  static propTypes = {}

  state = {
    help: true
  }

  disableGlassAndRedirect = () => {
    this.props.toggle();
    this.props.pushState(null, '/assign-lead');
  }

  open = () => {
    if (this.props.lead.type === 'partial') {
      this.props.toggle();
      this.props.pushState(null, '/new-lead');
    } else {
      this.props.toggle();
      this.props.toggleSlidePage();
      this.props.pushState(null, '/');
    }

    this.props.setName(window.selectedName);
  }

  closeHelp = () => {
    sessionStorage.setItem('existing-lead-glass-disabled', 'true');
    this.setState({help: false});
  }

  actionRemove = () => {
    this.props.remove();
    this.props.toggle();
    this.props.pushState(null, '/menu');
  }

  actionFlag = () => {
    this.props.update(this.props.lead.id, { flagged: !!!this.props.lead.flagged });
    this.props.toggle();
    this.props.pushState(null, '/menu');
  }

  goAssign = () => {
    this.props.toggle();
    this.props.setOrigin('ExistingLeadGlass');
    this.props.pushState(null, '/assign-lead');
  }

  render() {
    const { lead } = this.props;

    if (!lead) {
      return <div/>;
    }

    const printArray = (names, delimiter = ' ') => {
      const filteredArr = names.filter(function Filter(val) { return val !== undefined && val !== '' && val !== null; });
      const result = filteredArr.join(delimiter);
      return result;
    };

    const printDate = (value) => {
      const date = global.moment(value);
      return date.format('MM/DD/YY');
    };

    const capitalize = (str) => {
      if (!str || str.length === 0) {
        return '';
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    require('./ExistingLeadGlass.scss');

    const helpBox = (
      <img onClick={this.closeHelp} src="/images/helper_flag.svg" width="400" style={{position: 'absolute', top: 110, left: -45, cursor: 'pointer'}}/>
    );

    const assignedTo = lead.user ? <div className="inline-text">Assigned to: <span className="bold">{lead.user.firstname} {lead.user.middlename} {lead.user.lastname}</span></div> : <div className="inline-text">Assigned to: <span className="bold">Unassigned</span></div>;

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
        <div className="submit-widget-bottom">

          <ul className="lead-type">
            <li>{capitalize(lead.type)} Lead</li>
          </ul>

          <ul className="lead-info">
            <li>{printArray([lead.firstname, lead.middlename, lead.lastname])}</li>
            {/*TODO: precompute those vlaues and store in props*/}
            <li>{printArray([lead.street, lead.city, lead.state, lead.postalcode], ', ')}</li>
            {/*<li>2892 Bright Pony Island, Pysht, WY, 83016</li>*/}
            <li>&nbsp;</li>
            <li>{assignedTo}</li>
            <li>Created: {printDate(lead.created_at)}</li>
            <li>Most Recently Modified: {printDate(lead.updated_at)}</li>
          </ul>

        <div className="" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '80%',
          maxWidth: 550,
          margin: '0 auto'
        }}>
          <div className="submit-widget-buttons glass-widget-text clickable" onClick={this.open}><div className="text" style={{marginTop: 40}} >Open</div></div>
          <div className="submit-widget-buttons glass-widget-text clickable" style={{position: 'relative'}}>
            <div onClick={this.actionFlag} className="text">{lead.flagged ? 'Remove' : 'Add'}<br/> Flag <br/> <span className="flag"></span></div>
            {sessionStorage.getItem('existing-lead-glass-disabled') !== 'true' && this.state.help && helpBox}
          </div>
          {lead.type === 'existing' ?
          <div className="submit-widget-buttons glass-widget-text clickable" onClick={this.goAssign}><div className="text" style={{marginTop: 40}} >Assign</div></div> :
          <div onClick={this.actionRemove} className="submit-widget-buttons glass-widget-text clickable"><div className="text" style={{marginTop: 40}}>Delete</div></div>}
        </div>
        {/*<img className="helper" src="/images/helper_flag.svg" width="80%"/>*/}
      </div>
      </div>

    );
  }
}
