import React, {Component, PropTypes} from 'react';

export default class Layer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.any,
    onClick: PropTypes.func,
    opacity: PropTypes.number,
    transformX: PropTypes.string,
    transformY: PropTypes.string,
    zIndex: PropTypes.number
  };

  render() {
    const style = require('./Layer.scss');

    let s = {};
    if (typeof(this.props.opacity) !== undefined) {
      s = {
        opacity: this.props.opacity >= 0 ? this.props.opacity : 1,
        transform: 'translate3d(' + this.props.transformX + ',  ' + this.props.transformY + ', 0)'
      };
    }

    if (typeof(this.props.zIndex) !== undefined) {
      s.zIndex = this.props.zIndex;
    }

    return (
      <div className={this.props.name + ' ' + style.layer} onClick={this.props.onClick} style={s}>
        {this.props.children}
      </div>
    );
  }
}
