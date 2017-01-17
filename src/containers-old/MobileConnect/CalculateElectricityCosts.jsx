import React, {Component} from 'react';
import {pushState} from 'redux-router';
import {close, openTop, toggle} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {setLayoutName} from 'redux/modules/layout';
import {API} from 'redux/modules/data';
import {setOrigin} from 'redux/modules/navigation';

import {Graph} from 'components';

@connect((state) => ({lead: state.data.selectedLead, origin: state.navigation.origin}), {
  close,
  pushState,
  setLayoutName,
  toggle,
  updateLead: API.update,
  saveBills: API.saveBills,
  getMonthlyValues: API.getMonthlyValues,
  openTop,
  setOrigin
})
export default class CalculateElectricityCosts extends Component {
  static propTypes = {}

  state = {
    multiplier: 3,
    lastEditedMonth: 1,
    monthValues: [
      {
        value: 100,
        modified: true
      }, {
        value: 110,
        modified: false
      }, {
        value: 180,
        modified: false
      }, {
        value: 130,
        modified: false
      }, {
        value: 140,
        modified: false
      }, {
        value: 390,
        modified: false
      }, {
        value: 300,
        modified: false
      }, {
        value: 200,
        modified: false
      }, {
        value: 130,
        modified: false
      }, {
        value: 120,
        modified: false
      }, {
        value: 110,
        modified: false
      }, {
        value: 100,
        modified: false
      }
    ]
  }

  componentWillMount() {
    this.props.setLayoutName('Electricity costs today');
  }

  /*eslint-disable */
  componentDidMount = () => {
    setTimeout(() => {
      const drag = new Dragdealer('box-wrapper', {
        horizontal: false,
        vertical: true,
        steps: 6,
        callback: (x, y) => {
          const numberOfSteps = 6;
          const multipliers = [
            2,
            1.75,
            1.5,
            1.25,
            1,
            0.75
          ];
          const index = y * 10 / (10 / (numberOfSteps - 1));
          const selectedMultiplier = multipliers[index];
          this.setState({multiplier: selectedMultiplier});
          this.fillValues();
          this.refs.multiplier.innerHTML = '<strong>' + selectedMultiplier + 'X</strong> Seasonal range for zipcode';
        },
        animationCallback: (x, y) => {
          const height = (1.1 - y) * 0.6 * 200 + 45;
          this.refs.bezierCurve.style.height = height + "px";
        }
      });

      window.drag = drag;

      let january = this.props.lead.electricity_january;
      if (january) {
        drag.setStep(0, 2);

        this.refs.january.value = january;
        this.fillValues();
      }
    }, 300);
  }

  componentWillUnmount = () => {
    // this.refs.scrollableContent.removeEventListener('mousewheel', this.scrollHandler);
  }
  /*eslint-enable */

  fillValues = (event) => {
    // const multipliers = [0, 0.2, 0.4, 0.6, 0.8, 1, 1, 0.8, 0.6, 0.4, 0.2, 0];
    const multipliers = [
      1,
      0.88,
      1.01,
      1.16,
      1.51,
      1.8,
      2.05,
      1.93,
      1.52,
      1.24,
      1.01,
      0.98
    ];

    const activeMultiplier = this.state.multiplier;

    let month = parseInt(this.state.lastEditedMonth, 10);
    let element = document.querySelectorAll("[data-month='" + month + "']")[0];
    if (event) {
      month = event.currentTarget.dataset.month;
      element = event.currentTarget;
      this.setState({lastEditedMonth: month});
    }

    const value = parseFloat(element.value);
    let januaryValue;
    if (month === 1) {
      januaryValue = value;
    } else {
      januaryValue = value / ((multipliers[month - 1] * activeMultiplier));
    }

    let sum = parseInt(januaryValue, 10);
    const inputs = document.querySelectorAll('.input-field.month-cost-input');
    // debugger;
    for (const input of inputs) {
      if (input === element) {
        continue;
      }
      const diff = januaryValue * multipliers[input.dataset.month - 1] - januaryValue;
      // const newVal = (januaryValue + (diffValue * multipliers[input.dataset.month - 1])).toFixed();
      console.debug('[calc]', input.dataset.month, month, diff, januaryValue, activeMultiplier, (januaryValue * multipliers[input.dataset.month - 1]));
      // let newVal; if (month !== 1) {
      const newVal = parseInt((januaryValue + diff * activeMultiplier), 10);
      // } else { const newVal = parseInt((januaryValue * multipliers[input.dataset.month - 1] * activeMultiplier), 10); }
      if (!isNaN(newVal)) {
        input.value = newVal;
        sum += newVal;
      } else {
        input.value = '';
      }
    }

    this.refs.sum.value = isNaN(sum)
      ? 0
      : sum;
  }

  checkNumber = (event) => {
    const isValidNumber = (obj) => {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
    };

    const value = event.currentTarget.value;
    console.log(value, isValidNumber(value));
    if (event.keyCode !== 8 && (event.keyCode < 48 || event.keyCode > 57)) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (value.length >= 4 && event.keyCode !== 8) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleStart = (event, ui) => {
    console.log('Event: ', event);
    console.log('Position: ', ui.position);
  }

  handleDrag = (event, ui) => {
    console.log('Event: ', event);
    console.log('Position: ', ui.position);
  }

  handleStop = (event, ui) => {
    console.log('Event: ', event);
    console.log('Position: ', ui.position);
  }

  goSavings = () => {
    this.props.updateLead(this.props.lead.id, {
      electricity_yearly: this.refs.sum.value,
      electricity_january: this.refs.january.value,
      electricity_multiplier: this.state.multiplier
    });
    if (this.props.origin === 'topSlidePage') {
      this.props.pushState(null, '/');
      this.props.toggle();
      setTimeout(() => {
        this.props.openTop();
      }, 0);
      this.props.setOrigin();
    } else {
      this.props.pushState(null, '/savings');
      this.props.toggle();
    }
  }

  debug = (val) => {
    console.debug(`[graph] ${val}`);
  }

  render() {
    require('./CalculateElectricityCosts.scss');

    const inc = (month, multiplier) => {
      this.debug(`increase month ${month + 1}`);
      const vals = this.state.monthValues;
      vals[month].value += 1 * multiplier;
      this.setState({monthValues: vals});
      return vals[month].value;
    };

    const dec = (month, multiplier) => {
      this.debug(`decrease month ${month + 1}`);
      const vals = this.state.monthValues;
      let {value} = vals[month];
      value -= 1 * multiplier;
      if (value >= 0) {
        vals[month].value = value;
        this.setState({monthValues: vals});
        return value;
      }
      return this.state.monthValues[month].value;
    };

    const change = (month, newValue) => {
      const vals = this.state.monthValues;
      vals[month].value = newValue;
      this.setState({monthValues: vals});
      return newValue;
    };

    window.tt = () => {
      this.props.saveBills(this.props.lead.id, [
        {
          year: 2015,
          month: 1,
          value: 120
        }, {
          year: 2015,
          month: 5,
          value: 200
        }, {
          year: 2015,
          month: 7,
          value: 300
        }
      ]);
    };

    window.ty = () => {
      this.props.getMonthlyValues(this.props.lead.id, this.props.lead.genability_account_id);
    };

    return (
      <div>
        <div className="text-link" style={{
          padding: '40px 0px'
        }}>
          Select a month, enter that month's electricity bill. Add additional months to improve accuracy. Common hourly usage patterns and climate data are used to estimate the missing month's bills.
        </div>
        <Graph values={this.state.monthValues} increase={inc} decrease={dec} onChange={change}/>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270.964 270.964">
          <defs>
            <lineargradient id="button-gradient" x1="294.967" y1="-310.673" x2="8.005" y2="492.095" gradientUnits="userSpaceOnUse">
              <stop offset={0} stopColor="#ddd" stopOpacity="0.2"/>
              <stop offset={1} stopColor="#3e3e3e" stopOpacity="0.4"/>
            </lineargradient>
          </defs>
          <title>button_continue</title>
          <circle className="button-circle" cx="135.482" cy="135.482" r="135.482" style={{opacity: 0.7}}/>
          <text className="button-text" transform="translate(51.125 150.123)">Continue</text>
        </svg>
      </div>
    );

    // return (   <div className="section electricity" style={{     display: 'flex',     flexDirection: 'column',     justifyContent: 'space-around'   }}>     <div className="text-link clickable "
    // style={{paddingBottom: 20}}>       Enter any one month's cost of electricity, then adjust the seasonality curve as needed.     </div>     <div className="link-row month-cost-wrapper" style={{
    // display: 'flex',       flexDirection: 'row',       justifyContent: 'space-between',       alignItems: 'center'     }}>       <div className style={{         display: 'flex',         flexDirection:
    // 'row',         justifyContent: 'center',         flexGrow: 1       }}>         <div className="text-link clickable month-cost">           Jan $         </div>       </div>       <div className
    // style={{         flexGrow: 2       }}>         <input ref="january" className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues}
    // onKeyDown={this.checkNumber} data-month="1"/>       </div>       <div className style={{         display: 'flex',         flexDirection: 'row',         justifyContent: 'center',         flexGrow: 1
    //       }}>         <div className="text-link clickable month-cost">           Apr $         </div>       </div>       <div className style={{         flexGrow: 2       }}>         <input
    // className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues} onKeyDown={this.checkNumber} data-month="4"/>       </div>       <div className
    // style={{         display: 'flex',         flexDirection: 'row',         justifyContent: 'center',         flexGrow: 1       }}>         <div className="text-link clickable month-cost"> Jul $
    // </div>       </div>       <div className style={{         flexGrow: 2       }}>         <input className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0"
    // onKeyUp={this.fillValues} onKeyDown={this.checkNumber} data-month="7"/>       </div>       <div className style={{         display: 'flex',         flexDirection: 'row', justifyContent: 'center',
    //     flexGrow: 1       }}>         <div className="text-link clickable month-cost">           Oct $         </div>       </div>       <div className style={{ flexGrow: 2       }}>         <input
    // className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues} onKeyDown={this.checkNumber} data-month="10"/>       </div>     </div>     <div
    // className="link-row month-cost-wrapper" style={{       display: 'flex',       flexDirection: 'row',       justifyContent: 'space-between', alignItems: 'center'     }}>       <div
    // className="month-name" style={{         display: 'flex',         flexDirection: 'row',         justifyContent: 'center',         flexGrow: 1       }}>  <div className="text-link clickable
    // month-cost">           Feb $         </div>       </div>       <div className style={{         flexGrow: 2       }}>         <input className="input-field month-cost-input" placeholder={0.00}
    // type="text" max="9999" min="0" onKeyUp={this.fillValues} onKeyDown={this.checkNumber} data-month="2"/>       </div>       <div className="month-name" style={{       display: 'flex', flexDirection:
    // 'row',         justifyContent: 'center',         flexGrow: 1       }}>         <div className="text-link clickable month-cost">           May $ </div>       </div>       <div className style={{
    //     flexGrow: 2       }}>         <input className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues} onKeyDown={this.checkNumber}
    // data-month="5"/>       </div>       <div className="month-name" style={{         display: 'flex',         flexDirection: 'row', justifyContent: 'center', flexGrow: 1       }}>         <div
    // className="text-link clickable month-cost">           Aug $         </div>       </div>       <div className style={{ flexGrow: 2       }}>         <input className="input-field month-cost-input"
    // placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues} onKeyDown={this.checkNumber} data-month="8"/>       </div>       <div className="month-name" style={{         display:
    // 'flex',         flexDirection: 'row',         justifyContent: 'center',         flexGrow: 1       }}>   <div className="text-link clickable month-cost">           Nov $         </div>       </div>
    //      <div className style={{         flexGrow: 2       }}>         <input className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues}
    // onKeyDown={this.checkNumber} data-month="11"/>       </div>     </div>     <div className="link-row month-cost-wrapper" style={{ display: 'flex',       flexDirection: 'row',       justifyContent:
    // 'space-between',       alignItems: 'center'     }}>       <div className="month-name" style={{        display: 'flex', flexDirection: 'row',         justifyContent: 'center',         flexGrow: 1
    //    }}>         <div className="text-link clickable month-cost">           Mar $  </div>       </div>       <div className style={{         flexGrow: 2       }}>         <input
    // className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues} onKeyDown={this.checkNumber} data-month="3"/>       </div>       <div
    // className="month-name" style={{         display: 'flex',         flexDirection: 'row', justifyContent: 'center', flexGrow: 1       }}>         <div className="text-link clickable month-cost">
    //     Jun $         </div>       </div>       <div className style={{ flexGrow: 2       }}>         <input className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0"
    // onKeyUp={this.fillValues} onKeyDown={this.checkNumber} data-month="6"/>       </div>       <div className="month-name" style={{         display: 'flex',         flexDirection: 'row',
    // justifyContent: 'center',         flexGrow: 1       }}>   <div className="text-link clickable month-cost">           Sep $         </div>       </div>       <div className style={{
    // flexGrow: 2       }}>         <input className="input-field month-cost-input" placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues} onKeyDown={this.checkNumber}
    // data-month="9"/>       </div>       <div className="month-name" style={{       display: 'flex', flexDirection: 'row',         justifyContent: 'center',         flexGrow: 1       }}>         <div
    // className="text-link clickable month-cost">           Dec $ </div>       </div>       <div className style={{         flexGrow: 2       }}>         <input className="input-field month-cost-input"
    // placeholder={0.00} type="text" max="9999" min="0" onKeyUp={this.fillValues} onKeyDown={this.checkNumber} data-month="12"/>       </div>     </div>
    //
    //
    //     <div className="link-row month-cost-wrapper" style={{       display: 'flex',       flexDirection: 'row',       justifyContent: 'space-between',       alignItems: 'center'     }}>       <div
    // className="month-name invisible" style={{         display: 'flex',         flexDirection: 'row',         justifyContent: 'center',         flexGrow: 1       }}>         <div className="text-link
    // clickable month-cost">           Mar $         </div>       </div>       <div className="invisible" style={{         flexGrow: 2       }}>         <input className="input-field month-cost-input"
    // placeholder={0.00} type="text" />       </div>       <div className="month-name invisible" style={{         display: 'flex',         flexDirection: 'row',         justifyContent: 'center',
    // flexGrow: 1       }}>         <div className="text-link clickable month-cost">           Jun $         </div>       </div>       <div className="invisible" style={{         flexGrow: 2       }}>
    // <input className="input-field month-cost-input" placeholder={0.00} type="text" />       </div>       <div className="month-name invisible" style={{         display: 'flex', flexDirection: 'row',
    //     justifyContent: 'center',         flexGrow: 1       }}>         <div className="text-link clickable month-cost">           Sep $         </div>       </div>       <div className="invisible"
    // style={{         flexGrow: 2       }}>         <input className="input-field month-cost-input" placeholder={0.00} type="text" />       </div>       <div className="month-name" style={{ display:
    // 'flex',         flexDirection: 'row',         justifyContent: 'center',         flexGrow: 1       }}>         <div className="text-link clickable month-cost" style={{width: 100, marginLeft: -46 }}>
    //           Yearly $         </div>       </div>       <div className style={{         flexGrow: 2       }}>         <input ref="sum" className="input-field month-cost-input" placeholder={0.00}
    // type="text" disabled style={{background: 'transparent!important', color: 'black'}}/>       </div>     </div>
    //
    //
    //     <div id="slide-wrapper" className="slide-wrapper" style={{position: 'relative', width: '100%', height: 250, paddingBottom: 70, marginBottom: 50, marginTop: -42, zIndex: 5}}>       <div
    // id="box-wrapper" className="box-wrapper" style={{position: 'relative'}}>         <img src="/images/electricitySliderButton.svg" className="box handle"/>       </div>       <div style={{position:
    // 'absolute', bottom: 60, width: '100%', zIndex: -1}}>         <img ref="bezierCurve" src="/images/electricityCostSlider.svg" width="100%" style={{height: 30}}/>       </div>       <div
    // style={{position: 'absolute', bottom: 63, width: '100%', height: 5, background: '#e6e5e6', zIndex: -1}}>
    //
    //       </div>       <div className="winter-left">Winter</div>       <div className="winter-right">Winter</div>     <div ref="multiplier" className="multiplier"><strong>3X</strong>{' '}Seasonal range
    // for zipcode</div>     </div>
    //
    //
    //     <div className="section form-buttons" style={{       display: 'flex',       flexDirection: 'row',       alignItems: 'center',       justifyContent: 'space-around',       width: '60%', minWidth:
    // 500,       maxWidth: 700,       margin: '0 auto',       marginTop: -80,       zIndex: 10     }}>       <div className="main-button clickable black-border" ref="submit"
    // onClick={this.goSavings}>Continue</div>     </div>   </div>
    //
    // );
  }
}
