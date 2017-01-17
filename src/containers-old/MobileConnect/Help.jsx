import React, {Component} from 'react';
import YouTube from 'react-youtube';

import {toggle} from 'redux/modules/glass';
import {connect} from 'react-redux';

@connect(() => ({}), {toggle})
export default class Help extends Component {
  static propTypes = {}

  state = {
    active: -1,
    showVideo: false,

    height: 1000,
  }

  componentDidMount() {
    /*eslint-disable */
    this.setState({height: window.innerHeight - this.refs.scrollable.scrollTop});
    /*eslint-enable */
  }

  setActive = (num) => {
    if (this.state.active === num) {
      this.setState({showVideo: true});
    } else {
      this.setState({active: num});
    }
  }

  showVideo = () => {
    this.setState({showVideo: true});
  }

  close = () => {
    if (this.state.showVideo) {
      this.setState({showVideo: false});
    } else {
      this.props.toggle();
    }
  }

  render() {
    require('./Help.scss');

    const videos = [
      'Create a new lead',
      'Reassign a lead',
      'Claim a lead',
      'Validating an address',
      'Checking credit for 650 and better',
      'Inputing electricity costs',
      'Determining home ownership type',
      'Determining building type',
      'Roughing-in a solar design',
      'Adding shading objects to your scene',
      'Detailing a solar design',
      'Inputing electricity costs',
      'Determining home ownership type',
      'Determining building type',
      'Roughing-in a solar design',
      'Adding shading objects to your scene',
      'Detailing a solar design'
    ];
    const lines = [];
    for (let index = 0; index < videos.length; index++) {
      let row;
      if (index === this.state.active) {
        row = (
          <div key={'video-' + index} className="text-link clickable user-row" onClick={this.setActive.bind(this, index)}>
            Watch {videos[index].toLowerCase()}&nbsp;
            <img className="play-icon" src="images/icon_playButton_black.svg" width="20px" style={{
              top: 3,
              position: 'relative'
            }}/>
          </div>
        );
      } else {
        row = (
          <div key={'video-' + index} className="text-link clickable user-row" onClick={this.setActive.bind(this, index)}>
            {videos[index]}
          </div>
        );
      }

      lines.push(row);
    }

    const opts = {
      height: '370',
      width: '670',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        showinfo: 0,
        // autoplay: 1
      }
    };

    const video = <YouTube videoId = "DYu_bGbZiiQ" opts = {opts} onReady = {this.onReady} style = {{zIndex: 1500}}/>;

    const listOfVideos = [
      <div className="text-medium" style={{marginTop: 20, width: '80%', marginBottom: 40}}>
        <strong>Pro Tip: </strong>Inputing electricity costs begins with... begin placeholder text describing, in
        greater detail, what to do where. We suggest you either collaboratively administrate
        empowered markets via plug-and-play networks via dynamically procrastinating
        users into installed base benefits to enhance click ratings.
      </div>,
      <div className="text-link clickable currently-assigned" style={{marginTop: 20}} onClick={this.showVideo}>
        Watch inputing electricity costs&nbsp;
        <img className="play-icon" src="images/icon_playButton_black.svg" width="20px" style={{top: 3, position: 'relative'}}/>
      </div>,
      <div className="text-link user-row" style={{marginTop: 20}}>
        <strong>Full list of help videos:</strong>
      </div>,
      <div ref="scrollable" className="scrollable" style={{height: this.state.height, overflowY: 'scroll', paddingBottom: 100, paddingTop: 20}}>{lines}</div>
    ];

    return (
      <div className="help-widget-base" style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        <div className="section" style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 40,
          marginLeft: 70,
          height: '100%'
        }}>
          <div className="close-help text-link has-event clickable" onClick={this.close}>
            Close {this.state.showVideo ? 'Video' : 'Help'}
          </div> {
        this.state.showVideo
          ? video
          : listOfVideos
      } </div>
      </div>);
  }
}
