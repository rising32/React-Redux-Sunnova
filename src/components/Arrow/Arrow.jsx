import React, {Component, PropTypes} from 'react';

export default class Arrow extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
    left: PropTypes.bool,
    right: PropTypes.bool,
    disabled: PropTypes.bool,
    onlytext: PropTypes.bool
  };

  getText = () => {
    return { __html: this.props.children };
  }

  goClick = () => {
    if (this.props.disabled) {
      console.debug('[arrow] arrow is disabled');
      return;
    }

    this.props.onClick();
  }

  render() {
    require('./Arrow.scss');

    const disabledClass = this.props.disabled ? 'disabled' : '';

    const left = (
      <div className={'left-arrow visible-controls clickable' + disabledClass} onClick={this.goClick} style={{textAlign: 'left', left: '5%', opacity: this.props.disabled ? 0.5 : 1, position: 'absolute', top: '50%'}}>
        {!this.props.onlytext && <img className="clickable" src="/images/proposal_arrowLeft.svg" width="40" style={{position: 'absolute', left: 0}}/>}
          <span className="clickable" style={{
            color: 'white',
            fontSize: '1.1rem',
            position: 'relative',
            left: 10,
            top: 70,
          }} dangerouslySetInnerHTML={this.getText()}></span>
      </div>
    );

    const right = (
      <div className={'right-arrow visible-controls clickable' + disabledClass} onClick={this.goClick} style={{textAlign: 'right', right: '5%', opacity: this.props.disabled ? 0.5 : 1}}>
        {!this.props.onlytext && <img className="clickable" src="/images/proposal_arrowRight.svg" width="40" style={{position: 'absolute', right: 0}}/>}
          <span className="clickable" style={{
            color: 'white',
            fontSize: '1.1rem',
            position: 'relative',
            right: 10,
            top: 70,
          }} dangerouslySetInnerHTML={this.getText()}></span>
      </div>
    );

    return this.props.left ? left : right;
  }
}
