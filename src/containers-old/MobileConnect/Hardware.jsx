import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toggle} from 'redux/modules/slidePage';
import {setLayoutName} from 'redux/modules/layout';
import {API} from 'redux/modules/data';
import {pushState} from 'redux-router';

@connect((state) => ({lead: state.data.selectedLead}), {setLayoutName, toggle, updateLead: API.update, pushState})
export default class Hardware extends Component {
  static propTypes = {}

  state = {
    selected: 'person'
  }

  componentWillMount() {
    this.props.setLayoutName('Hardware Selection');
  }

  selectOption = (key) => {
    this.setState({selected: key});
  }

  actionSubmit = () => {
    if (this.props.lead.electricity_yearly) {
      this.props.updateLead(this.props.lead.id, {test: parseInt(this.props.lead.electricity_yearly * 0.2, 10)});
    }
    this.props.toggle();
    this.props.pushState(null, '/designer');
  }

  render() {
    require('./Hardware.scss');

    return (
      <div className="section hardware" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}>
        <div className="text-link clickable user-row ownership-validation" style={{lineHeight: '30px', height: 100}}>
          <strong>Recommended hardware combinations</strong> are presented below. If your prefer to make a change from the default, now is a good time.
        </div>
        <ul className="option-select no-margin">
          <li><strong>Solar panel manufacturer: </strong></li>
          <li className={this.state.selected === 'person' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'person')}>EcoSolargy</li>
          <li className={this.state.selected === 'trust' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'trust')}>RECOM</li>
          <li className={this.state.selected === 'corporation' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'corporation')}>Silfab</li>
        </ul>

        <ul className="option-select no-margin">
          <li><strong>Model: </strong></li>
          <li className={this.state.selected === 'person' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'person')}>255W</li>
          <li className={this.state.selected === 'trust' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'trust')}>260W</li>
          <li className={this.state.selected === 'corporation' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'corporation')}>280W</li>
        </ul>

        <ul className="option-select no-margin">
          <li><strong>Micro Inverter: </strong></li>
          <li className={this.state.selected === 'person' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'person')}>Enphase M215</li>
          <li className={this.state.selected === 'aaatrust' ? 'active' : 'selectable'} style={{color: 'gray'}}>Enphase M250</li>
          <li className={this.state.selected === 'corporation' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'corporation')}>Brochure</li>
          <li className={this.state.selected === 'not-sure' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'not-sure')}>Website</li>
        </ul>

        <ul className="option-select">
          <li><strong>Racking manufacturer: </strong></li>
          <li className={this.state.selected === 'trust' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'person')}>Ecofasten</li>
          <li className={this.state.selected === 'person' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'trust')}>Unirac</li>
          <li className={this.state.selected === 'corporation' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'corporation')}>Silfab</li>
          <li className={this.state.selected === 'not-sure' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'not-sure')}>Not Sure</li>
        </ul>


        <ul className="option-select no-margin">
          <li><strong>Racking: </strong></li>
          <li className={this.state.selected === 'person' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'person')}>SM Rail</li>
          <li className={this.state.selected === 'trust' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'trust')}>Light Rail</li>
          <li className={this.state.selected === 'corporation' ? 'active' : 'selectable'} onClick={this.selectOption.bind(this, 'corporation')}>SunFrame MicroRail - (Rail-Less)</li>
        </ul>


        <ul className="option-select no-margin">
          <li>Brochure</li>
          <li>Website</li>
          <li>Certifications & Span Tables</li>
        </ul>

        <ul className="option-select">
          <li><strong>Choose Mount: </strong></li>
          <li>N/A, rail-less systems include custom flashed mounts.</li>
        </ul>


        <div className="section form-buttons" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '60%',
          minWidth: 500,
          maxWidth: 700,
          margin: '0 auto',
          marginTop: 30
        }}>
          <div className="other-button clickable black-border" style={{ visibility: 'hidden'}}>
            <div></div>
          </div>
          <div className="main-button clickable black-border" ref="submit" onClick={this.actionSubmit}>Continue</div>
          <div className="other-button clickable black-border">Reset</div>
        </div>
      </div>
    );
  }
}
