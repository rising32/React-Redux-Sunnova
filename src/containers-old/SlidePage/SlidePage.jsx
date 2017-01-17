import React, {Component, PropTypes} from 'react';
import {toggle as toggleGlass} from 'redux/modules/glass';
import {toggle as toggleSlidePage, openTop} from 'redux/modules/slidePage';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {logoutAndResetRedux, setProfilePicture, useAuthy} from 'redux/modules/auth';
import {setFilter} from 'redux/modules/layout';
import {API} from 'redux/modules/data';
import {NotificationsAPI} from 'redux/modules/notifications';

@connect(
  (state) => ({user: state.auth.user, notifications: state.notifications.arr, layoutName: state.layout.layoutName, filter: state.layout.filter, leadsCount: state.data.leadsCount, refreshNeeded: state.data.refreshNeeded}),
  {toggleGlass, toggleSlidePage, pushState, logoutAndResetRedux, setFilter, resetSelected: API.resetSelected, openTop, setProfilePicture, useAuthy, sentSMS: NotificationsAPI.sentSMS}
)
export default class SlidePage extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    console.log('context', this.context);
    this.refs.scrollableContent.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.refs.scrollableContent.removeEventListener('scroll', this.handleScroll);
  }

  setFilter = (val) => {
    this.props.setFilter(val);
  }

  goBack = () => {
    const forcePrev = localStorage.getItem('back');
    if (forcePrev) {
      if (forcePrev === 'SlidePageTop') {
        this.props.pushState(null, '/');
        this.props.toggleSlidePage();
        setTimeout(() => { this.props.openTop(); }, 0);
      }

      localStorage.removeItem('back');
    }

    const path = window.location.pathname;
    const routesToggleSlidePage = ['/new-lead', '/center-map', '/choose-provider', '/credit-check'];

    if (path === routesToggleSlidePage[0]) {
      this.context.router.push('/menu');
      return;
    }

    if (routesToggleSlidePage.indexOf(path) !== -1) {
      this.props.toggleSlidePage();
    }

    this.context.router.goBack();
  }

  goCreateNewLead = () => {
    this.props.resetSelected();
    this.context.router.push({pathname: '/new-lead', state: { from: 'Petr' }});
  }

  goHome = () => {
    this.context.router.push('/menu');
  }

  closeSlidePage = () => {
    this.props.toggleSlidePage();
    this.context.router.push('/');
  }

  goLogout = () => {
    this.props.logoutAndResetRedux();
    // this.props.resetSelected();
    this.props.toggleSlidePage();
    this.context.router.push('/');
  }

  goHelp = () => {
    this.props.toggleGlass('Help');
  }

  goUploadPicture = () => {
    const isUploadSupported = () => {
      if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
        return false;
      }
      const elem = document.createElement('input');
      elem.type = 'file';
      return !elem.disabled;
    };
    const supported = isUploadSupported();
    console.debug('[upload] ' + supported
      ? 'supported'
      : 'not supported');
    if (!supported) {
      return;
    }
  }

  uploadProfilePicture = () => {
    const fileArray = this.refs.uploadProfilePicture.files;
    console.log(fileArray);

    if (fileArray.length >= 1) {
      const file = fileArray[0];

      // check mime type
      if (/^image\//i.test(file.type)) {
        console.debug(this.props.user.id);
        const formData = new FormData();
        formData.append('user_id', this.props.user.id);
        formData.append('image', file);
        const xhr = new XMLHttpRequest();
        xhr.open('post', '/api/uploadProfilePicture', true);

        const _this = this;
        xhr.onload = function Loaded() {
          if (this.status === 200) {
            _this.props.setProfilePicture(this.response);
            console.log(this.response);
          } else {
            console.log(this.statusText);
          }
        };
        xhr.send(formData);
      } else {
        console.error('[upload] not a valid image');
      }
    }
  }

  isMenuPage = () => {
    const path = window.location.pathname;
    return path === '/menu';
  }

  openNewsGlass = () => {
    this.props.toggleGlass('NewsGlass');
  }

  goSettings = () => {
    this.props.toggleGlass('SettingsGlass');
  }

  handleScroll = () => {
    const el = this.refs.scrollableContent;
    const head = this.refs.pageHead;
    if (el.scrollTop > 5) {
      head.classList.add('has-shadow');
    } else {
      head.classList.remove('has-shadow');
    }
  }

  generateNotification = () => {
    const notification = Synergykit.Data('Notifications'); // eslint-disable-line
    notification.set('type', 'assign-lead');
    notification.set('lead_id', 3);
    notification.set('author_id', this.props.user.id);
    notification.set('target_id', 1);
    notification.set('new', '5');
    notification.save({
      success: (data, code) => {
        // const arr = obj.map((item) => item.data);
        console.log(data, code);
      },
      error: (error, code) => {
        console.log(error, code);
      }
    });

    this.props.sentSMS(this.props.user.id, 'Sunnova: The lead called Fred Jones Residence has been assigned to you by Robbie Lemos.');
  }

  render() {
    require('./SlidePage.scss');

    const klass = this.props.show
      ? 'open'
      : '';
    const style = this.props.show
      ? {
        transform: 'translate3d(0, 0, 0)'
      }
      : {
        transform: 'translate3d(110%, 0, 0)'
      };

    const menuPage = (
      <div className="list-user-info">
        <ul>
          <li>Energy Consultant: <strong>{this.props.user && this.props.user.firstname} {this.props.user && this.props.user.lastname}</strong></li>
          <li className="clickable" onClick={this.goSettings}>Edit</li>
          <li className="link" onClick={this.goCreateNewLead}>Create New Lead +</li>
        </ul>
        <ul>
          <li onClick={this.openNewsGlass} className="clickable">News & Updates
            {this.props.notifications.length > 0 && <span style={{marginLeft: 10}} className="notification-number">{this.props.notifications.length}</span>}
          </li>
          <li>Sunnova Credit: $125</li>
            <li>Sales Ranking:
              <strong style={{
                marginLeft: 10
              }}>Top 8%</strong>
            </li>
        </ul>

      </div>
    );

    const filterOptions = (
      <div ref="stickyWrapper" className="sticky sticky-background-wrapper">
        <ul ref="filter" className="lead-filter">
          <li className={this.props.filter === 'partial'
            ? 'active'
            : ''} onClick={this.setFilter.bind(this, 'partial')}>Partial Lead</li>
          <li className={this.props.filter === 'existing'
            ? 'active'
            : ''} onClick={this.setFilter.bind(this, 'existing')}>My Existing Leads</li>
          <li className={this.props.filter === 'converted'
            ? 'active'
            : ''} onClick={this.setFilter.bind(this, 'converted')}>Coverted to Customer</li>
          <li className={!this.props.filter || this.props.filter === 'all'
            ? 'active'
            : ''} onClick={this.setFilter.bind(this, 'all')}>All Leads</li>
        </ul>
      </div>
    );

    const profilePicture = (
      <div className="profile-pic-big" onClick={this.goUploadPicture}>
        { this.props.user && !this.props.user.profile_picture && <div className="add-picture-text">Edit</div>}
        <img ref="profilePicture" src={ this.props.user && this.props.user.profile_picture ? this.props.user.profile_picture : '/images/default_profile_picture.jpg'} width="100"/>
        <input id="file" type="file" className="hidden-file-upload" accept="image/*" ref="uploadProfilePicture" onChange={this.uploadProfilePicture}/>
      </div>
    );

    const profilePictureLeft = (
      <div className="profile-pic-small fix-left">
        <img src={ this.props.user && this.props.user.profile_picture ? this.props.user.profile_picture : '/images/default_profile_picture.jpg'} width="50"/>
      </div>
    );

    const backButton = (<img onClick={this.goBack} className="must-work connect-page-back-arrow clickable" src="/images/icon_back.svg" style={{
      width: 30
    }}/>);

    const generalPage = (
      <div className="connect-page-title bold-text" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 10
      }}>
        {this.props.layoutName}
      </div>
    );

    const menu = (
      <div className="connect-page-head-row show-bottom-border" style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        top: -15
      }}>
        {menuPage}
        {profilePicture}
      </div>
    );

    const simpleHeader = (
      <div className={klass + ' connect-page connect-page-shadow has-event'} style={style}>
        <div ref="pageHead" className="connect-page-head" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2000
        }}>
          <div className="connect-page-head-row" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 100,
            marginLeft: 30
          }}>
            <div className style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <img onClick={this.goBack} className="must-work connect-page-back-arrow clickable" src="/images/icon_back.svg" style={{
                width: 25
              }}/>
              <div className="profile-pic-small fix-left" style={{
                left: 30
              }}>
                <img src={ this.props.user && this.props.user.profile_picture ? this.props.user.profile_picture : '/images/default_profile_picture.jpg'} width="50" style={{borderRadius: 25}}/>
              </div>
              <div className="text-link clickable" onClick={this.goLogout} style={{
                left: 50,
                position: 'relative'
              }}>Logout</div>
            </div>
            <div className="user-info-detail" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, 0)'
            }}>
              {this.props.layoutName}
            </div>
            <div className="company-logo" style={{
              marginRight: 60
            }}>
              <div className="text-link clickable" onClick={this.goHelp} style={{
                float: 'left',
                lineHeight: '50px',
                position: 'relative',
                left: -20
              }}>Help</div>
              <img className="company-logo" src="images/NikeSolar.svg" style={{
                height: 50,
                width: 120
              }}/>
            </div>
          </div>
        </div>
        <div onScroll={this.scrollHandler} ref="scrollableContent" className="connect-page-content" style={{
          height: window.innerHeight - (this.isMenuPage
            ? 100
            : 200)
        }}>
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    );

    if (!this.isMenuPage()) {
      return simpleHeader;
    }

    return (
      <div className={klass + ' connect-page connect-page-shadow has-event'} style={style}>
        {/*TODO: refactor into component*/}
        <div ref="pageHead" className="connect-page-head" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 2000
        }}>
          <div className="connect-page-head-row" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 100,
            marginLeft: 30
          }}>
            <div className style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div className="text-link clickable right-margin-35" onClick={this.closeSlidePage}>Close</div>
              <div className="text-link clickable  right-margin-35 " onClick={this.goHelp}>Help</div>
              <div className="text-link clickable" onClick={this.goLogout}>Logout</div>
            </div>
            <div className="user-info-detail" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, 0)'
            }}>
              Sunnova Energy
            </div>
            <div className="company-logo" style={{
              marginRight: 60
            }}>
              <img className="company-logo" onClick={this.generateNotification} src="images/NikeSolar.svg" style={{
                height: 50,
                width: 120
              }}/>
            </div>
          </div>
          <div className="connect-page-head-row show-bottom-border" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 30,
            position: 'relative',
            top: -15
          }}>
            {!this.isMenuPage() && backButton}
            {!this.isMenuPage() && generalPage}
            {!this.isMenuPage() && profilePictureLeft}
          </div>
        </div>

        <div onScroll={this.scrollHandler} ref="scrollableContent" className="connect-page-content" style={{
          height: window.innerHeight - (this.isMenuPage
            ? 100
            : 200)
        }}>
          <div>
            {this.isMenuPage() && menu}
            <div ref="sticky">
              {this.isMenuPage() && filterOptions}
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/*eslint-disable*/
function processFile(dataURL, fileType, cb) {
  const loadedImg = new Image();
  loadedImg.src = dataURL;
  const crop = {x: 200, y: 200, width: 200, height: 200};
  const maxWidth = 200;
  const maxHeight = 200;
  const options = {debug: true, width: 250, height: 250};
  loadedImg.onload = () => {
    SmartCrop.crop(loadedImg, options, (result) => {
                const crop = result.topCrop;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = options.width;
                canvas.height = options.height;
                ctx.drawImage(loadedImg, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
                const res = canvas.toDataURL('image/jpeg');
                console.log('res - ', res);
                cb(res);
            });

		// const canvas = document.createElement('canvas');
		// canvas.width = scaledCrop.width;
    // canvas.height = scaledCrop.height;
		// const ctx = canvas.getContext('2d');

    // console.log(loadedImg, cropX, cropY, cropWidth, cropHeight, 0, 0, destWidth, destHeight);
    // ctx.drawImage(loadedImg, cropX, cropY, cropWidth, cropHeight, 0, 0, destWidth, destHeight);
    // const res = canvas.toDataURL('image/jpeg');
    // console.log('res - ', res);
    // cb(res);
  };

  loadedImg.onerror = function onError(err) {
    console.log(err);
    alert('There was an error processing your file!');
  };
}

function scale(options) {
  let scale = options.scale || Math.min(options.maxWidth / options.width, options.maxHeight / options.height);

  scale = Math.min(scale, options.maxScale || 1);

  return {
    scale: scale,
    width: options.width * scale,
    height: options.height * scale
  };
}

function readFile(file, cb) {
  // const reader = new FileReader();
  console.log('calling');
  processFile(file, 'nevim', cb);

  // reader.onloadend = function ProcessFile() {
  //   console.log('success');
  //   processFile(reader.result, file.type, cb);
  // };

  // reader.onerror = function HandleError() {
  //   console.error('[upload] there was an error reading the file');
  // };

  // reader.readAsArrayBuffer(file);
}


function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

function handleFiles(file, cb)
{
    // var filesToUpload = document.getElementById('input').files;
    // var file = filesToUpload[0];

    // Create an image
    var img = document.createElement("img");
    // Create a file reader
    var reader = new FileReader();
    // Set the image once loaded into file reader
    reader.onload = function(e)
    {
        img.src = e.target.result;

        var canvas = document.createElement("canvas");
        //var canvas = $("<canvas>", {"id":"testing"})[0];
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 500;
        var MAX_HEIGHT = 500;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        var dataurl = canvas.toBlob((blob) => {
          cb(blob);
        }, 'image/jpeg', 0.95);
    }
    // Load files into file reader
    reader.readAsDataURL(file);


    // Post the data
    /*
    var fd = new FormData();
    fd.append("name", "some_filename.jpg");
    fd.append("image", dataurl);
    fd.append("info", "lah_de_dah");
    */
}

if (typeof(HTMLCanvasElement) !== 'undefined' && !HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}
