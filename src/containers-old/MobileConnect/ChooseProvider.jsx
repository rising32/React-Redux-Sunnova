import React, {Component, PropTypes} from 'react';
import request from 'superagent';
import {pushState} from 'redux-router';
import {close} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {setLayoutName} from 'redux/modules/layout';
import {API} from 'redux/modules/data';


@connect((state) => (
  {lead: state.data.selectedLead, entities: state.data.servingEntities}),
  {close, pushState, setLayoutName, updateLead: API.update, getServingEntity: API.getServingEntity, createAccountGenability: API.createAccountGenability, getTariffs: API.getTariffs }
)
export default class ChooseProvider extends Component {
  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node,
    close: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    setLayoutName: PropTypes.func,
    updateLead: PropTypes.func,
    lead: PropTypes.object,
    getServingEntity: PropTypes.func.isRequired,
    createAccountGenability: PropTypes.func.isRequired,
    getTariffs: PropTypes.func.isRequired,
    entities: PropTypes.array
  }

  state = {
    people: [
      'Not shown in list',
    ],
  }

  componentWillMount() {
    this.props.setLayoutName('Electricity costs today');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entities || this.props.entities) {
      const arr = [];
      nextProps.entities.forEach((item) => {
        arr.push(item.name);
      });

      arr.push('Not shown in the list');
      this.setState({people: arr});
    }
  }

  registerAccount = (userId, name, address) => {
    const url = '/api/createAccount';
    request
      .post(url)
      .send({ userId, name, address })
      .end((err, res) => {
        console.log(err, res);
        this.props.getTariffs(res.body);
      });
  }

  printName = (name) => {
    const selected = this.props.lead.electricity_provider;
    if (selected === name) {
      return <strong>{name}</strong>;
    }

    return name;
  }

  showMap = (event) => {
    const val = event.currentTarget.innerText;
    this.props.updateLead(this.props.lead.id, { electricity_provider: val});
    this.props.pushState(null, '/choose-plan');
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
              Which of these utilities is the current provider?
            </div>
          </div>
        </div>
        <div style={{paddingTop: 50}}>
          {people}
        </div>
       </div>
    );
  }
}
