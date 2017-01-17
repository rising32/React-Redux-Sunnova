import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toggle, openTop} from 'redux/modules/slidePage';
import {setLayoutName} from 'redux/modules/layout';
import {API} from 'redux/modules/data';
import {setOrigin} from 'redux/modules/navigation';
import {pushState} from 'redux-router';

@connect(
  (state) => ({lead: state.data.selectedLead, origin: state.navigation.origin}),
  {setLayoutName, toggle, updateLead: API.update, openTop, setOrigin, pushState})
export default class CreditCheck extends Component {
  static propTypes = {}

  state = {
    selected: 'none'
  }

  componentWillMount() {
    this.setState({selected: this.props.lead.owner || 'none'});
    this.props.setLayoutName('Home Ownership');
  }

  selectOption = (key) => {
    this.setState({selected: key});
  }

  actionSubmit = () => {
    this.props.updateLead(this.props.lead.id, {owner: this.state.selected});

    if (this.props.origin === 'topSlidePage') {
      this.props.pushState(null, '/');
      this.props.toggle();
      setTimeout(() => { this.props.openTop(); }, 0);
    } else {
      this.props.toggle();
    }
  }

  render() {
    require('./CreditCheck.scss');

    const description = [
      <div className="text-medium" style={{marginTop: 50}}>Here's what Sunnova Energy will need prior to a Trust/Partnership contract: 1.) A partnershop agreement, 2.) two most recent year's tax returns, 3.) a list of general partners, and 4.) a personal guaranty from a general partner or resident.</div>,
      <div onClick={this.actionSubmit} className="main-button got-it clickable green-border" style={{margin: '50px auto'}}><div className="text">Got it, Let's<br/>Continue</div></div>
    ];

    const notSureDescription = [
      <div onClick={this.actionSubmit} className="main-button got-it clickable" style={{margin: '50px auto'}}><div className="text">Try again<br/> later</div></div>
    ];

    const {lead} = this.props;

    return (
      <div className="section" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}>
        <div className="text-link clickable user-row ownership-validation" style={{lineHeight: '30px', height: 100}}>
          <strong>Let's determine which type of owner is on title. When owner is a trust or corporation, Sunnova Energy will require additional documentation during contract completion.</strong>
        </div>
        {/*TODO: refactor, create component */}
        <div className="text-medium">
          Title records indicate <strong>{lead.street} {lead.city} {lead.state} {lead.postalcode}</strong>
        </div>
        <div className="text-medium">is owned by <strong>"{lead.firstname} {lead.middleName} {lead.lastname}"</strong></div>

        {/*TODO: refactor, create component */}
        <ul className="option-select">
          <li>Owner is a:</li>
          <li className={this.state.selected === 'person' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'person')}>Person/People</li>
          <li className={this.state.selected === 'trust' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'trust')}>Trust/Partnership</li>
          <li className={this.state.selected === 'corporation' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'corporation')}>Corporation</li>
          <li className={this.state.selected === 'not-sure' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'not-sure')}>Not Sure</li>
        </ul>
        {this.state.selected !== 'not-sure' && this.state.selected !== 'none' && description}
        {this.state.selected === 'not-sure' && notSureDescription}

      </div>

    );
  }
}
