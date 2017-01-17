import React, {Component, PropTypes} from 'react';

export default class Text extends Component {
  static propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func,
    bold: PropTypes.bool,
    inline: PropTypes.bool,
    italic: PropTypes.bool,
    big: PropTypes.bool,
    className: PropTypes.string
  };

  getText = () => {
    return { __html: this.props.children };
  }

  render() {
    const style = require('./Text.scss');

    const klass = [style.textNormal, this.props.className];
    if (this.props.bold) {
      klass.push(style.bold);
    }
    if (this.props.inline) {
      klass.push(style.inline);
    }
    if (this.props.italic) {
      klass.push(style.italic);
    }
    if (this.props.onClick) {
      klass.push(style.clickable);
    }
    if (this.props.big) {
      klass.push(style.big);
    }

    const html = (
      <div className={klass.join(' ')} onClick={this.props.onClick}>{this.props.children}</div>
    );

    return html;
  }
}
