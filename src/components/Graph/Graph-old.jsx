import React, {Component, PropTypes} from 'react';
import GraphMonth from './GraphMonth';

export default class Graph extends Component {
  static propTypes = {
    values: PropTypes.array,
    increase: PropTypes.func,
    decrease: PropTypes.func,
    onChange: PropTypes.func
  };

  state = {
    scale: {
      max: 200,
      min: 0
    },
    selectedMonth: 5,
    inTransition: false
  }

  componentDidMount() {
    this.select(0);
  }

  getPos = (month = this.state.selectedMonth) => {
    const space = 136.5;
    return month * space;
  }

  clickIncrease = (multiplier = 1) => {
    this.markModified();
    this.props.increase(this.state.selectedMonth, multiplier);
  }

  clickDecrease = (multiplier = 1) => {
    this.markModified();
    this.props.decrease(this.state.selectedMonth, multiplier);
  }

  targetChanged = () => {
    this.markModified();
    this.props.onChange(this.state.selectedMonth, parseInt(this.refs.target.value, 10));
  }

  mouseDown = (func) => {
    console.debug('DOWN');
    this.intervalRun = 0;
    this.interval = setInterval(() => {
      this.intervalRun++;
      let multiplier = 1;
      if (this.intervalRun < 8) {
        multiplier = 1;
      } else if (this.intervalRun < 12) {
        multiplier = 2;
      } else if (this.intervalRun < 15) {
        multiplier = 5;
      } else if (this.intervalRun < 20) {
        multiplier = 10;
      } else {
        multiplier = 25;
      }

      func(multiplier);
    }, 200);
  }

  mouseUp = () => {
    console.debug('UP');
    clearInterval(this.interval);
  }

  markModified = () => {
    this.props.values[this.state.selectedMonth].modified = true;
  }

  select = (index) => {
    this.setState({selectedMonth: index, inTransition: true});
    setTimeout(() => {
      this.setState({inTransition: false});
    }, 400);
  }

  render() {
    require('./Graph.scss');

    const {values} = this.props;
    // const pos = this.getPos();
    // const selected = this.props.values[this.state.selectedMonth];

    // calculate the Y range of graph
    let max = 0;
    const min = 0;

    values.forEach((month) => {
      if (month.value > max) {
        max = month.value;
      }
    });

    max *= 1.15;
    max = parseInt(max / 100, 10) * 100 + 100;

    // calculate the curve
    const pointsY = [];
    const pointsX = [229.12, 366.097, 503.075, 640.053, 777.031, 914.009, 1050.987, 1187.964, 1324.942, 1461.92, 1598.898, 1735.876];
    values.forEach((month) => {
      const val = month.value;
      const scale = val / max;
      const point = 555 - (555 - 300) * scale;
      pointsY.push(point);
    });

    let points = '';
    let index = 0;
    pointsX.forEach((point) => {
      points += `${point} ${pointsY[index]} `;
      index++;
    });
    // const monthStyle = (monthIndex) => {
    //   if (monthIndex === this.state.selectedMonth) {
    //     return { fontWeight: '400' };
    //   }
    //
    //   return { cursor: 'pointer' };
    // };
    //
    // const isModified = (monthIndex = this.state.selectedMonth) => {
    //   return this.props.values[monthIndex].modified;
    // };
    //
    // const getMonthName = (index) => {
    //   const months = global.moment.monthsShort();
    //   return months[index];
    // };

    // const renderMonth = (month) => {
    //   const pos = this.getPos(month);
    //   const start = 195;
    //   const active = month === this.state.selectedMonth;
    //   const res = [
    //     <text onClick={this.select.bind(this, month)} className="e" transform={`translate(${start + this.getPos(month)} 615.569)`} style={monthStyle(month)}>{getMonthName(month)}</text>,
    //     <rect className={'c anim ' + (active ? '' : 'inactive')} x={148 + this.getPos(month)} width="170.657" height="739.149" rx="28.292" ry="28.292" onClick={this.select.bind(this, month)}/>,
    //     <g onClick={this.clickIncrease.bind(this, 1)} onMouseDown={this.mouseDown.bind(this, this.clickIncrease)} onMouseUp={this.mouseUp} style={{cursor: 'pointer'}}>
    //       <polyline className={'h anim '} points={`${209 + pos} 79.001 ${234 + pos} 54.106 ${259 + pos} 79.001`}/>
    //       <polyline className={'h anim '} points={`${209 + pos} 58.403 ${234 + pos} 33.508 ${259 + pos} 58.403`}/>
    //       <rect className="noselect" x={168 + pos} width="130" height="70" y="10" fill="transparent" />
    //     </g>
    //   ];
    //
    //   if (!isModified(month)) {
    //     return res;
    //   }
    //
    //   res.push(<circle className="g" cx={start + 38 + this.getPos(month)} cy={pointsY[month]} r="7.78"/>);
    //
    //   if (!active) {
    //     res.push(<text className="e" transform={`translate(${start - 22 + this.getPos(month)} ${pointsY[month] - 50})`}>{'$' + this.props.values[month].value}</text>);
    //   }
    //
    //   return res;
    // };

    const months = [];
    for (let index = 0; index < 12; index++) {
      const val = values[index];
      const active = index === this.state.selectedMonth;
      if (active) {
        console.debug('selected month', index);
      }
      const month = (
        <GraphMonth
          key={index}
          value={val.value}
          isModified={val.modified}
          valueY={pointsY[index]}
          monthIndex={index}
          active={active}
          onIncrease={this.clickIncrease.bind(this, 1)}
          onDecrease={this.clickDecrease.bind(this, 1)}
          onIncreaseMouseDown={this.mouseDown.bind(this, this.clickIncrease)}
          onIncreaseMouseUp={this.mouseUp}
          onDecreaseMouseDown={this.mouseDown.bind(this, this.clickDecrease)}
          onDecreaseMouseUp={this.mouseUp}
          onSelect={this.select}
        />
      );
      months.push(month);
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1830.529 739.149" style={{userSelect: 'none'}}>
        <defs>
          <style
            dangerouslySetInnerHTML={{
              __html: '.a, .c {opacity: 0.7;}\n .b, .d, .h {fill: none; -webkit-user-select: none;}\n .b, .d, .f { stroke-miterlimit: 10;}\n .b {stroke-width: 12px; stroke: url(#a); }\n .c {fill: url(#b);}\n .d { stroke: #999; stroke-width: 0.5px;}\n .e, .i {font-size: 43.585px; font-family: Helvetica Neue; -webkit-user-select: none; }\n .f {fill: #fff;}\n .f, .h { stroke: #666; stroke-linecap: round; stroke-width: 2px; }\n .g { fill: #666; }\n .h { stroke-linejoin: round;}\n .i { fill: red; } \n .foreign input { background: none; border: 0; font-size: 43px; width: 120px; font-weight: 300; } .foreign span { font-size: 43px; } .anim { transition: all 0.4s ease; opacity: 1; } .hide-element { opacity: 0; transition: opacity 0s; } .noselect { -webkit-user-select: none; } .inactive { fill: transparent!important; opacity: 0; }'
            }}/>
          <lineargradient id="a" x1="982.613" y1="505.517" x2="982.613" y2="308.922" gradientUnits="userSpaceOnUse">
            <stop offset={0} stopColor="#ccc" stopOpacity="0.8"/>
            <stop offset="0.125" stopColor="#c5cec5" stopOpacity="0.8"/>
            <stop offset="0.29" stopColor="#b0d3b0" stopOpacity="0.8"/>
            <stop offset="0.476" stopColor="#8edb8e" stopOpacity="0.8"/>
            <stop offset="0.678" stopColor="#5fe75f" stopOpacity="0.8"/>
            <stop offset="0.891" stopColor="#23f623" stopOpacity="0.8"/>
            <stop offset={1} stopColor="lime" stopOpacity="0.8"/>
          </lineargradient>
          <lineargradient id="b" x1="1497.752" y1="-260.65" x2="1196.307" y2="843.802" gradientUnits="userSpaceOnUse">
            <stop offset={0} stopColor="#ddd" stopOpacity="0.2"/>
            <stop offset={1} stopColor="#3e3e3e" stopOpacity="0.4"/>
          </lineargradient>
        </defs>
        <g className="a">
          <polyline
            className="b anim"
            points={points} />
        </g>
        <line className="d" x1="196.941" y1="465.962" x2="1770.28" y2="465.962"/>
        <line className="d" x1="196.941" y1="555.89" x2="1770.28" y2="555.89"/>
        <line className="d" x1="196.941" y1="376.035" x2="1770.28" y2="376.035"/>
        <line className="d" x1="196.941" y1="286.108" x2="1770.28" y2="286.108"/>
        <path className="d" d="M1789.626,220.282" transform="translate(-19.346 -24.101)"/>
        <path className="d" d="M216.287,220.282" transform="translate(-19.346 -24.101)"/>

        {months}

        <text className="e" transform="translate(0 575.889)">{'$' + min}</text>
        <text className="e" transform="translate(0.001 300.605)">{'$' + max}</text>
      </svg>
    );
  }
}
