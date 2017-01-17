import React, {Component, PropTypes} from 'react';

export default class ShowDelay extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    delay: PropTypes.number,
    start: PropTypes.bool.isRequired,
    className: PropTypes.string,
    reset: PropTypes.bool
  };

  state = {
    display: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.start !== nextProps.start && nextProps.start === true) {
      setTimeout(() => {
        this.setState({display: true});
      }, this.props.delay);
    }

    if (this.props.reset !== nextProps.reset && nextProps.reset === true) {
      this.setState({display: false});
    }
  }

  render() {
    const style = require('./ShowDelay.scss');

    return (
      <div className={[style.showDelay, (this.state.display ? style.show : style.delayed), this.props.className].join(' ')}>
        {this.props.children}
      </div>
    );
  }
}
