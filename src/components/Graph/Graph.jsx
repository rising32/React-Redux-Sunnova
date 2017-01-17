import React, {Component, PropTypes} from 'react';
import GraphMonth from './GraphMonth';

export default class Graph extends Component {
  static propTypes = {
    values: PropTypes.array.isRequired,
    state: PropTypes.oneOf(['none', 'init', 'expenses', 'all']).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    selected: PropTypes.number
  };

  state = {
    animateMonth: null
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    // when 'init' state is active
    if (nextProps.state === 'init' && this.props.state !== nextProps.state) {
      console.log('state: expenses');
      const svg = global.d3.select('svg#graph');
      let month = 0;
      const int = setInterval(() => {
        this.setState({animateMonth: month});
        console.log('animate month: ', month);
        month += 1;

        if (month >= 12) {
          clearInterval(int);
        }
      }, 200);
    }

    // when 'expenses' state is active
    if (nextProps.state === 'expenses' && this.props.state !== nextProps.state) {
      this.setState({animateMonth: 12});
      console.log('state: expenses');
      const svg = global.d3.select('svg#graph');
      svg.select('circle').transition().duration(700).attr('class', 'e start-animation').attr('r', 8);
    }
  }

  render() {
    require('./Graph.scss');

    const {values} = this.props;

    const startingPoint = 170;
    const maxPoint = 5;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const diffValue = maxValue - minValue;
    const curveMargin = 5;
    const valuesX = [0.5, 44.03, 183.73, 323.44, 463.15, 602.85, 742.56, 882.271, 1021.97, 1161.68, 1301.39, 1441.1, 1580.8, 1629.98];
    const valuesY = [startingPoint];
    const savingsY = [330];
    const curves = [];
    const savings = [];

    for (let i = 0; i < 12; i++) {
      const ratio = (maxValue - values[i]) / diffValue;
      let point = maxPoint + ratio * 170;
      const pointSavings = 265 + ratio * 60;

      if (i > this.state.animateMonth) {
        point = startingPoint;
      }

      valuesY.push(point);
      savingsY.push(pointSavings)
    }
    valuesY.push(startingPoint);
    savingsY.push(330);


    for (let year = 0; year < 10; year++) {
      const values = [];
      for (let pointIndex = 0; pointIndex < 14; pointIndex++) {
        values.push(valuesX[pointIndex]);

        const y = valuesY[pointIndex] + curveMargin * year;
        values.push(Math.round(y * 100) / 100);
      }
      curves.push(values);
    }

    for (let pointIndex = 0; pointIndex < 14; pointIndex++) {
      savings.push(valuesX[pointIndex]);

      const y = savingsY[pointIndex];
      savings.push(Math.round(y * 100) / 100);
    }

    if (this.state.animateMonth < 12 && this.state.animateMonth >= 0) {
      const curve = global.d3.select('svg#graph .first');
      curve.transition().duration(300).attr("points", curves[9].join(' '));
      console.debug(curves[9]);
    }



    const prefix = [1629.98, 170.574, 1629.98, 396.034, 0.5, 396.034];
    const classState = this.props.state;

    return (
      <svg id="graph" className={this.props.className} style={{...this.props.style, overflow: 'visible'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1630.48 396.534" preserveAspectRatio="none">
        <defs>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .a, .b, .c, .d, .e {
                  opacity: 0;
                }

                .a {
                  fill: #ffffff;
                }

                .b {
                  fill: #33ff00;
                }

                .c, .d {
                  transition: opacity 0.5s ease-out;
                  fill: none;
                  stroke: #fff;
                  stroke-miterlimit: 10;
                }

                .e {
                  fill: #fff;
                }

                .all .a, .all .b, .all .d {
                  opacity: 0.5;
                }

                .all .b {
                  transition: opacity 0.7s ease-out;
                }

                .all .e {
                  opacity: 1;
                }

                .all .a {
                  opacity: 0.2;
                }

                .c:nth-child(1) {
                  transition-delay: 2s;
                }
                .c:nth-child(2) {
                  transition-delay: 1.8s;
                }
                .c:nth-child(3) {
                  transition-delay: 1.6s;
                }
                .c:nth-child(4) {
                  transition-delay: 1.4s;
                }
                .c:nth-child(5) {
                  transition-delay: 1.2s;
                }
                .c:nth-child(6) {
                  transition-delay: 1s;
                }
                .c:nth-child(7) {
                  transition-delay: 0.8s;
                }
                .c:nth-child(8) {
                  transition-delay: 0.6s;
                }
                .c:nth-child(9) {
                  transition-delay: 0.4s;
                }
                .c:nth-child(10) {
                  transition-delay: 0.2s;
                }

                .all .c {
                  opacity: 0.4;
                }

                .expenses .a, .expenses .d {
                  opacity: 0.5;
                  transition: opacity 1s ease-out;
                  transition-delay: 2s;
                }

                .expenses .a {
                  opacity: 0.2!important;
                }

                .e {
                  opacity: 0;
                }

                .expenses .e.start-animation {
                  opacity: 1;
                  transition: opacity 0.7s ease-out;
                  transition-delay: 0s;
                }

                .expenses .c {
                  opacity: 0.4;
                }

                .init .first {
                  opacity: 0.4;
                }
              `
            }}/>
          <linearGradient id="b" x1="815.24" y1="392.898" x2="815.24" y2="263.195" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="lime" stopOpacity="0"/>
            <stop offset="1" stopColor="lime"/>
          </linearGradient>
        </defs>
        <title>10YearGraph</title>
        <g className={classState}>
          {/* gradient for expenses */}
          <polygon className="a" points={[...prefix, ...curves[0]].join(' ')}/>
          {/* savings */}
          <polygon className="b" points={[...prefix, ...savings].join(' ')}/>
          {/* yearly curve */}
          <polyline className="c" points={curves[1].join(' ')}/>
          <polyline className="c" points={curves[2].join(' ')}/>
          <polyline className="c" points={curves[3].join(' ')}/>
          <polyline className="c" points={curves[4].join(' ')}/>
          <polyline className="c" points={curves[5].join(' ')}/>
          <polyline className="c" points={curves[6].join(' ')}/>
          <polyline className="c" points={curves[7].join(' ')}/>
          <polyline className="c" points={curves[8].join(' ')}/>
          <polyline className="c first"/>

          {/* border */}
          <polygon className="d" points={[...prefix, ...curves[0]].join(' ')}/>
          {/* point */}
          <circle className="e" cx={valuesX[this.props.selected + 1]} cy={valuesY[this.props.selected + 1] + curveMargin * 9} r="2000"/>
        </g>
      </svg>
    );
  }
}
