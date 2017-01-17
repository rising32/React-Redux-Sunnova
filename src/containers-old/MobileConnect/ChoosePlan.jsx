import React, {Component} from 'react';
import {pushState} from 'redux-router';
import {close} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {setLayoutName} from 'redux/modules/layout';
import {API} from 'redux/modules/data';

@connect((state) => (
  {lead: state.data.selectedLead, tariffs: state.data.tariffs, providers: state.data.servingEntities}),
  {close, pushState, setLayoutName, updateLead: API.update}
)
export default class ChoosePlan extends Component {
  static propTypes = {}

  state = {
    people: [],
  }

  componentWillMount() {
    this.props.setLayoutName('Electricity costs today');

    if (this.props.tariffs) {
      const arr = [];
      this.props.tariffs.forEach((item) => {
        arr.push(item.tariffName);
      });
      this.setState({people: arr});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tariffs) {
      const arr = [];
      nextProps.tariffs.forEach((item) => {
        arr.push(item.tariffName);
      });
      this.setState({people: arr});
    }
  }

  printName = (name) => {
    const selected = this.props.lead.electricity_plan;
    if (selected === name) {
      return <strong>{name}</strong>;
    }

    return name;
  }

  showMap = (event) => {
    const val = event.currentTarget.innerText;
    this.props.updateLead(this.props.lead.id, { electricity_plan: val});
    this.props.pushState(null, '/calculate-costs');
  }

  render() {
    require('./AssignLead.scss');
    const _this = this;
    const people = this.state.people.map(function RenderPeople(name, index) {
      return (
          <div key={index} onClick={_this.showMap} className="text-link clickable user-row">
            {_this.printName(name)}
          </div>
        );
    });

    return (
      <div className="section" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}>
        <div className="link-row assign-info" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div className style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexGrow: 1
          }}>
            <div className="text-link clickable currently-assigned">
              You electricity provider is <strong>{this.props.providers && this.props.providers[0].name}</strong>. What is your current rate plan? It's important this is accurate. If unsure, let's refer to one of your recent utility bills. Here's an example.
            </div>
          </div>
        </div>
        <div style={{paddingTop: 90}}>
          {people}
        </div>
       </div>
    );
  }
}
