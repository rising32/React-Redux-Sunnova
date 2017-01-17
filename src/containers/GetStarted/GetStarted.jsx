import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import { Layer, Arrow, Text, Pulse, Input, InputOptions, InputMonths, Graph, ShowDelay } from 'components';

import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
import config from 'config';

import {setPageNumber} from 'redux/modules/layout';
import {toggle, openTop} from 'redux/modules/slidePage';
import {toggle as toggleGlass} from 'redux/modules/glass';

import { API as leadsAPI } from 'redux/modules/data';

export default class GetStarted extends Component {
  static propTypes = {
    leftArrow: PropTypes.func.isRequired,
    rightArrow: PropTypes.func.isRequired
  };

  // - zipcode
  // - electric vehicle
  // - bill amount
  // - bill month
  // - graph
  // - savings

  state = {
    zipCode: {
      done: false,
      value: null
    },
    electricVehicle: {
      done: false,
      value: null
    },
    bill: {
      amount: null,
      amountDone: false,
      month: null,
      monthDone: false
    },
    graph: {
      state: 'none'
    },
    temp: {
      timeMonthUpdated: null
    }
  };

  componentWillMount() {}
  componentDidMount() {
    console.log('test', this.refs.test);
  }
  componentWillReceiveProps(nextProps) {}

  getActive = () => {
  }

  goNext = () => {
  }

  goBack = () => {
  }

  render() {
    const style = require('./GetStarted.scss');

    return (
      <div className={style.centerBox + ' ' + (this.state.zipCode.done ? style.hide : '') + ' ' + (this.state.electricVehicle.done ? style.hideEV : '') + ' ' + (this.state.bill.amountDone ? style.hideEL : '') + ' ' + (this.state.bill.monthDone ? style.monthSelected : '')}>
        <div className={style.leftSide}>
          <Text big>Jim & Alexandria Bettencourt</Text>
          <Text>1705 Helix Ct.<br/>Concord CA, 94598</Text>
          <br/><br/>
          <Text>A recent electricity bill <Text onClick={() => {}} inline>without</Text> an<br/>electric vehicle was <Text onClick={() => {}} inline>$231</Text> for <Text onClick={() => {}} inline>March</Text></Text>
          <br/><br/>
          <Text>With a <Text onClick={() => {}} inline>Sunnova's Solar Loan</Text></Text>

        </div>
        <div className={style.rightSide}>
          <Text big>Why Solar</Text>
          <Text onClick={() => {}}>Pay less for electricity</Text>
          <Text onClick={() => {}}>Lock in low rates</Text>
          <Text onClick={() => {}}>Generate clean energy</Text>

          <br/>
          <Text big>Why Sunnova</Text>
          <Text onClick={() => {}}>Lower your electricity bill</Text>
          <Text onClick={() => {}}>Global vision, local focus</Text>
          <Text onClick={() => {}}>Testimonials</Text>

          <div className={style.userInfo}>
            <ul>
              <li><img src="/images/Robbie.jpg" className={style.profilePicture}/></li>
              <li><Text onClick={() => {}}>My Proposals</Text></li>
              <li><Text onClick={() => {}}>Help</Text></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
