import React, {Component, PropTypes} from 'react';

export default class AnimatedBox extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.any,
    onClick: PropTypes.func,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    width: 'auto',
    height: 'auto'
  };

  getText = () => {
    return { __html: this.props.children };
  }

  render() {
    const style = require('./AnimatedBox.scss');

    const klass = [this.props.className ,style.box];
    if (!this.props.show) {
      klass.push(style.hidden);
    }

    const styles = {
      width: this.props.width,
      height: this.props.height
    };

    const html = (
      <div className={klass.join(' ')} style={styles}>{this.props.children}</div>
    );

    return html;
  }
}
