import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';


import {close as closeDesignerDialog} from 'redux/modules/designerDialog';

@connect(
    state => ({switchedOn: state.designerDialog.switchedOn}),
  {
    closeDesignerDialog
  })

export default class DesignerDialog extends Component {

  render() {
    console.log("switch", this.props.switchedOn);
    const style = require('./DesignerDialog.scss');
    let canDisplay = this.props.switchedOn ? 'block': 'none';
    console.log(canDisplay);
    return (
      <div className={style.designerDialog} style={{display: canDisplay}}>
        <div className={style.msgToUser}>
          <p>Designing your system requires a large screen.</p>
          <p>Go to sunnova.com and enter this code:</p>
        </div>
        <div className={style.codeToType}>
          <p>56038</p>
        </div>
        <div className={style.action}>
          <button className={style.btnNormal + ' ' + style.btnDone}>Done</button>
          <button className={style.btnNormal}>Cancel</button>
        </div>
      </div>
    );
  }
}
