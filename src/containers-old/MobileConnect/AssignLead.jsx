import React, {Component} from 'react';
import {pushState} from 'redux-router';
import {close} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {setLayoutName} from 'redux/modules/layout';
import {API as UsersAPI} from 'redux/modules/users';
import {API as LeadsAPI} from 'redux/modules/data';
import {setOrigin} from 'redux/modules/navigation';
import {NotificationsAPI} from 'redux/modules/notifications';

@connect(
  state => ({lead: state.data.selectedLead, user: state.auth.user, origin: state.navigation.origin, name: state.layout.name, address: state.layout.address, users: state.users, leads: state.data}),
  {close, pushState, setLayoutName, loadUsers: UsersAPI.load, updateLead: LeadsAPI.update, setOrigin, sentSMS: NotificationsAPI.sentSMS, loadLeadByID: LeadsAPI.loadOne})
export default class AssignLead extends Component {
  static propTypes = {}

  state = {
    filter: '',
    selectedIndex: -1,
    origin: ''
  }

  componentWillMount() {
    // Load Data from Database
    this.props.loadUsers();

    this.setState({origin: this.props.origin});
    this.props.setOrigin();

    this.props.setLayoutName('Assign to Energy Consultant');
  }

  setActive = (index) => {
    this.setState({selectedIndex: index});
  }

  filterNames = () => {
    this.setState({filter: this.refs.filter.value});
  }

  actionGenerateNotification = (targetUserId) => {
    const {lead, user} = this.props;
    const notification = Synergykit.Data('Notifications'); // eslint-disable-line
    const body = `You are now the Sales lead for ${lead.street}, ${lead.city}. Lead stage is complete, you are now in the Proposal phase.`;
    // const body = `The lead called ${lead.firstname} ${lead.lastname} has been assigned to you by ${user.firstname} ${user.lastname}.`;
    notification.set('type', 'assign-lead');
    notification.set('lead_id', this.props.leads.selectedLead.id);
    notification.set('author_id', user.id);
    notification.set('target_id', targetUserId);
    notification.set('body', body);
    notification.set('version', '1');
    notification.save({
      success: (data, code) => {
        // const arr = obj.map((item) => item.data);
        console.log(data, code);
      },
      error: (error, code) => {
        console.log(error, code);
      }
    });

    this.props.sentSMS(targetUserId, `Sunnova: ${body} Link: https://www.sunnova.pro/?l=${lead.id}`);
  }

  goNext = () => {
    this.props.updateLead(this.props.leads.selectedLead.id, {user_id: this.state.selectedIndex});
    if (this.props.lead.user_id !== this.state.selectedIndex) {
      this.actionGenerateNotification(this.state.selectedIndex);
    }

    setTimeout(() => {
      this.props.loadLeadByID(this.props.leads.selectedLead.id);
    }, 1000);

    console.log('state', this.state.origin);
    if (this.state.origin === 'ExistingLeadGlass') {
      this.props.pushState(null, '/menu');
    } else {
      this.props.close();
      this.props.pushState(null, '/center-map');
    }
  }

  goNextUnassign = () => {
    this.props.updateLead(this.props.leads.selectedLead.id, {user_id: null});
    setTimeout(() => {
      this.props.loadLeadByID(this.props.leads.selectedLead.id);
    }, 1000);

    if (this.state.origin === 'ExistingLeadGlass') {
      this.props.pushState(null, '/menu');
    } else {
      this.props.close();
      this.props.pushState(null, '/center-map');
    }
  }

  render() {
    require('./AssignLead.scss');
    const _this = this;

    const {filter, selectedIndex} = this.state;
    const {rows} = this.props.users;
    let people;
    if (rows) {
      people = rows.map(function RenderPeople(row, index) {
        let name = row.firstname + ' ' + row.lastname;
        let click = () => _this.setActive(row.id);
        if (row.id === _this.props.leads.selectedLead.user_id) {
          name = <span className="disabled">{row.firstname} {row.lastname}</span>;
          click = () => {};
        }
        if ((row.firstname + ' ' + row.lastname).toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          if (selectedIndex === row.id) {
            return (
              <div key={index} className={'text-link clickable user-row ' + (selectedIndex === row.id ? 'active' : '') } onClick={_this.goNext}>
                <strong>Assign to {name}</strong>
              </div>
            );
          }

          return (
            <div key={index} className={'text-link clickable user-row ' + (selectedIndex === row.id ? 'active' : '') } onClick={click}>
              {name}
            </div>
          );
        }
      });
    } else {
      people = [];
    }


    return (
      <div className="section" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}>
        <div className="input-row" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginTop: 50,
          paddingBottom: 30
        }}>
          <input ref="filter" onKeyUp={this.filterNames} className="input-field " placeholder="Search Filter" type="text" style={{flexGrow: 5, marginRight: 5}}/>
          <div className="buttons clickable" onClick={this.goNext}>Nevermind, I'll Claim It</div>
          <div className="buttons clickable" onClick={this.goNextUnassign}>Leave Unassigned</div>
        </div>
        {people}
       </div>
    );
  }
}
