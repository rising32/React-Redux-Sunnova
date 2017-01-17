import React, {Component, PropTypes} from 'react';

export default class Pulse extends Component {
  static propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func,
    className: PropTypes.string,
    run: PropTypes.bool
    // infinite: PropTypes.bool
  };

  render() {
    const style = require('./Pulse.scss');

    const klass = [style.rings, this.props.className];
    if (this.props.run) {
      klass.push(style.run);
    }


    const html = (
      <div className={klass.join(' ')}>
	      <div className={style.ringlet}></div>
	      <div className={style.ringlet}></div>
	      <div className={style.ringlet}></div>
      </div>
    );

    return html;
  }
}
