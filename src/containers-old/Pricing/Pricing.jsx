import React, {Component} from 'react';
import {pushState} from 'redux-router';
import {close, openTop, toggle} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {setLayoutName} from 'redux/modules/layout';
import {API} from 'redux/modules/data';
import {setOrigin} from 'redux/modules/navigation';
import PricingEngine from '../../utils/pricing';

@connect((state) => ({lead: state.data.selectedLead, origin: state.navigation.origin}), {
  close,
  pushState,
  setLayoutName,
  toggle,
  updateLead: API.update,
  openTop,
  setOrigin
})
export default class Pricing extends Component {
  static propTypes = { }

  state = {
    data: {}
  }

  componentWillMount() {
    this.props.setLayoutName('Pricing Engine');
  }

  recalculateValues = () => {
    const {investment, capRate, annualEscalator, degradation, contractLength} = this.refs;
    const pricingEngine = new PricingEngine({
      investement: parseFloat(investment.value),
      capRate: parseFloat(capRate.value),
      capRateLength: 5,
      annualEscalator: parseFloat(annualEscalator.value),
      productionDegradation: parseFloat(degradation.value),
      contractLength: parseFloat(contractLength.value)
    });
    const result = pricingEngine.calculate();
    this.setState({data: result.threshold});
  }

  render() {
    const {data} = this.state;
    require('./Pricing.scss');

    const round = (num) => {
      return Math.round(num * 100) / 100;
    };

    const rows = [];
    const details = [];
    console.log(data);
    if (data.years) {
      let index = 1;
      data.years.forEach((item) => {
        const row = (
          <tr>
            <td>{index}</td>
            <td>{round(item.escalator * 100)}%</td>
            <td>{round(item.production * 100)}%</td>
            <td>{round(item.netKWh * 100)}%</td>
            <td>${round(item.cfPPA)}</td>
            <td>${round(item.cfLease)}</td>
          </tr>
        );
        rows.push(row);
        index++;
      });

      details.push(<p>Total CF-PPA: ${round(data.cfPPA.total)}</p>);
      details.push(<p>IRR CF-PPA: {round(data.cfPPA.IRR)}%</p>);

      details.push(<p>Total CF-Lease: ${round(data.cfLease.total)}</p>);
      details.push(<p>IRR CF-Lease: {round(data.cfLease.IRR)}%</p>);
    }

    return (
      <div className="pricing">
        <div>
          <p>Investment</p><input type="text" ref="investment" name="investment" defaultValue={2000000} onChange={this.recalculateValues}/>
        </div>
        <div>
          <p>Cap Rate 5 years</p><input type="text" ref="capRate" name="capRate" value={0.10250} onChange={this.recalculateValues}/>
        </div>
        <div>
          <p>Annual Escalator</p><input type="text" ref="annualEscalator" defaultValue={0.029} onChange={this.recalculateValues}/>
        </div>
        <div>
          <p>Production Degradation</p><input type="text" ref="degradation" value={0.005} onChange={this.recalculateValues}/>
        </div>
        <div>
          <p>Contract length</p><input type="text" ref="contractLength" value={25} onChange={this.recalculateValues}/>
        </div>
        {/*<button onClick={this.recalculateValues}>Calculate</button>*/}

        <div className="data">
          <p></p>
          <p></p>

          <table>
            <thead>
              <tr>
                <th className="row-1 row-ID">Year</th>
                <th className="row-2 row-name">Escalator</th>
                <th className="row-3 row-job">Production</th>
                <th className="row-4 row-email">Net KWh</th>
                <th className="row-4 row-email">CF-PPA</th>
                <th className="row-4 row-email">CF-Lease</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
          {details}
        </div>
      </div>
    );
  }
}
