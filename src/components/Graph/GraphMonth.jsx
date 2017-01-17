import React, {Component, PropTypes} from 'react';

export default class GraphMonth extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    valueY: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    isModified: PropTypes.bool.isRequired,
    monthIndex: PropTypes.number.isRequired,
    onIncrease: PropTypes.func.isRequired,
    onDecrease: PropTypes.func.isRequired,
    onIncreaseMouseDown: PropTypes.func.isRequired,
    onIncreaseMouseUp: PropTypes.func.isRequired,
    onDecreaseMouseDown: PropTypes.func.isRequired,
    onDecreaseMouseUp: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  state = {

  }

  componentDidMount() {
    if (this.refs.target) {
      this.refs.target.value = this.props.value;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && this.refs.target) {
      console.debug('updating value - ', nextProps.monthIndex);
      this.refs.target.value = nextProps.value;
    }
  }

  getMonthName = (index) => {
    const months = global.moment.monthsShort();
    return months[index];
  }

  getPos = (month = this.state.selectedMonth) => {
    const space = 136.5;
    return month * space;
  }

  select = () => {
    const { onSelect, monthIndex } = this.props;
    console.debug('month clicked', monthIndex);
    onSelect(monthIndex);
  }

  render() {
    require('./Graph.scss');

    const { active, monthIndex, isModified, valueY } = this.props;
    const pos = this.getPos(monthIndex);
    const monthName = this.getMonthName(monthIndex);
    const start = 195;

    const monthStyle = (monthIndex) => {
      if (monthIndex === this.state.selectedMonth) {
        return { fontWeight: '400' };
      }

      return { cursor: 'pointer' };
    };

    if (active) {
      console.debug('now is active - ', monthIndex);
    }

    return (
      <g>
        <text onClick={this.select} className="e" transform={`translate(${start + pos} 615.569)`} style={monthStyle(monthIndex)}>{monthName}</text>
        <rect onClick={this.select} className={'c anim ' + (active ? '' : 'inactive')} x={148 + pos} width="170.657" height="739.149" rx="28.292" ry="28.292"/>

        <foreignObject className={'foreign anim ' + (active ? '' : 'inactive')} x={175 + pos} y="105.83" width="200" height="150">
          <body xmlns="http://www.w3.org/1999/xhtml">
            <span style={{color: isModified ? 'black' : 'gray'}}>$</span><input style={{color: isModified ? 'black' : 'gray'}} ref="target" type="text" onChange={() => {}} />
          </body>
        </foreignObject>
        <g onClick={this.props.onIncrease} onMouseDown={this.props.onIncreaseMouseDown} onMouseUp={this.props.onIncreaseMouseUp} style={{cursor: 'pointer'}}>
          <polyline className={'h anim ' + (active ? '' : 'inactive')} points={`${209 + pos} 79.001 ${234 + pos} 54.106 ${259 + pos} 79.001`}/>
          <polyline className={'h anim ' + (active ? '' : 'inactive')} points={`${209 + pos} 58.403 ${234 + pos} 33.508 ${259 + pos} 58.403`}/>
          <rect className="noselect" x={168 + pos} width="130" height="70" y="10" fill="transparent" />
        </g>
        <g onClick={this.props.onDecrease} onMouseDown={this.props.onDecreaseMouseDown} onMouseUp={this.props.onDecreaseMouseUp} style={{cursor: 'pointer'}}>
          <polyline className={'h anim ' + (active ? '' : 'inactive')} points={`${209 + pos} 188.6 ${234 + pos} 213.495 ${259 + pos} 188.6`}/>
          <polyline className={'h anim ' + (active ? '' : 'inactive')} points={`${209 + pos} 209.2 ${234 + pos} 234.093 ${259 + pos} 209.2`}/>
          <rect className="noselect" x={168 + pos} width="130" height="70" y="180" fill="transparent" />
        </g>
        {!active && isModified && <circle className={'g anim '} cx={233 + pos} cy={valueY} r="7.78"/>}
        {active && isModified && <text className={'i anim noselect '} transform={`translate(${221 + pos} 700)`} style={{cursor: 'pointer'}}>X</text>}
      </g>
    );
  }
}
