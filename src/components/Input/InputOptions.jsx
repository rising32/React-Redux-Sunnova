import React, {Component, PropTypes} from 'react';

export default class InputOptions extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    disabledFunc: PropTypes.func,
    onClickDisabled: PropTypes.func,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
  };

  static defaultProps = {
    disabledFunc: (str) => { return str; },
  }

  state = {
    disabledText: '',
    selected: null,
    focus: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled && !this.props.disabled) {
      this.setState({disabledText: this.props.disabledFunc(this.getValue())});
    }

    if (this.props.disabled && !nextProps.disabled) {
      this.setState({disabledText: ''});
    }
  }

  unfocus = () => {
    this.setState({focus: false});
  }

  onClickDisabled = () => {
    console.log('on click disable');
    if (this.props.disabled && this.props.onClickDisabled) {
      this.props.onClickDisabled();
    }
  }

  focus = () => {
    const input = this.refs.input;
    setTimeout(() => {
      this.setState({focus: true});
      if (input) {
        input.focus();
      }
    }, 300);
  }

  select = (index) => {
    console.log(index);
    if (this.props.disabled || !this.state.focus) {
      return;
    }

    let selected;
    if (this.state.selected === index) {
      selected = null;
    } else {
      selected = index;
    }
    console.log('selected', selected);
    this.setState({selected: selected});
    if (this.props.onChange) {
      setTimeout(() => { this.props.onChange(this.props.options[selected]); },0);
    }
  }

  getValue = () => {
    console.log('getvalue', this.state.selected, this.props.options);
    return this.state.selected >= 0 ? this.props.options[this.state.selected] : '';
  }

  render() {
    const style = require('./Input.scss');

    const classNames = [style.formGroup, this.props.className];
    if (this.props.disabled) {
      classNames.push(style.disabled);
    }

    const options = [];
    let key = 0;
    this.props.options.forEach((opts) => {
      options.push(<div key={key} onClick={this.select.bind(this, key)}>{this.props.options[key]}</div>)
      key++;
    })

    return (
      <div className={classNames.join(' ')} >
        <div onClick={this.onClickDisabled} className={style.disabledText}>{this.state.disabledText}</div>
        <div ref="input" className={style.inputBool} tabIndex="0" onBlur={this.unfocus} onFocus={this.focus}>
          <div onClick={this.select.bind(this, 0)}>{this.props.options[0]}</div>
          <div onClick={this.select.bind(this, 1)}>{this.props.options[1]}</div>
        </div>
        <label className={style.controlLabel}>{this.props.placeholder}</label><i className={style.bar}></i>
      </div>
    );
  }
}
