import React, {Component, PropTypes} from 'react';

export default class Input extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    disabledFunc: PropTypes.func,
    onClickDisabled: PropTypes.func,
    className: PropTypes.string,
    pattern: PropTypes.string
  }

  static defaultProps = {
    disabledFunc: (str) => { return str; },
  }

  state = {
    disabledText: '',
    focus: false
  }

  componentDidMount() {
    if (this.props.pattern) {
      const el = this.refs.input;
      if (el) {
        new global.Formatter(el, {'pattern': this.props.pattern}); // eslint-disable-line
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled && !this.props.disabled) {
      this.setState({disabledText: this.props.disabledFunc(this.getValue())});
    }

    if (this.props.disabled && !nextProps.disabled) {
      this.setState({disabledText: ''});
    }
  }

  onClickDisabled = () => {
    console.log('on click disable');
    if (this.props.disabled && this.props.onClickDisabled) {
      this.props.onClickDisabled();
    }
  }

  onChange = (event) => {
    console.log('changed');
    const val = this.refs.input.value;
    if (this.props.onChange) {
      this.props.onChange(val, event);
    }
  }

  getValue = () => {
    return this.refs.input.value || '';
  }

  unfocus = () => {
    console.log('UNfocus called');
    this.setState({focus: false});
  }

  focus = () => {
    console.log('focus called');
    const input = this.refs.input;
    setTimeout(() => {
      this.setState({focus: true});
      if (input) {
        input.focus();
      }
    }, 300);
  }

  render() {
    const style = require('./Input.scss');
    console.log('input', this.state, this.props);

    const classNames = [style.formGroup, this.props.className];
    if (this.props.disabled) {
      classNames.push(style.disabled);
    }

    return (
      <div className={classNames.join(' ')}>
        <div onClick={this.onClickDisabled} className={style.disabledText + ' ' + (this.props.onClickDisabled ? style.clickable : '')}>{this.state.disabledText}</div>
        {/*  onChange={this.onChange} not used on input because of the collision with Formatter.js*/}
        <input className={!this.state.focus ? style.clickable : ''} type="text" ref="input" required onKeyPress={this.onChange} disabled={this.props.disable}/>
        <label className={style.controlLabel}>{this.props.placeholder}</label>
        <i className={style.bar}></i>
      </div>
    );
  }
}