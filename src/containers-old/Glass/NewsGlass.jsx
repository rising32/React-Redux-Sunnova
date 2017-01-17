import React, {Component, PropTypes} from 'react';

import {toggle} from 'redux/modules/glass';
import {connect} from 'react-redux';
import {NotificationsAPI} from 'redux/modules/notifications';

@connect((state) => ({notifications: state.notifications.arr}), {toggle, removeNotification: NotificationsAPI.remove})
export default class Help extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    height: 1000,
  }

  componentDidMount() {
    /*eslint-disable */
    this.setState({height: window.innerHeight - this.refs.scrollable.scrollTop});
    /*eslint-enable */
  }

  close = () => {
    this.props.toggle();
  }

  deleteNotification = (id) => {
    console.debug('notification - ', id);
    const notification = Synergykit.Data('Notifications'); // eslint-disable-line
    notification.set('id', id);
    notification.destroy({
      success: (result, statusCode) => {
        console.log(result, statusCode);
      },
      error: (error, statusCode) => {
        console.log(error, statusCode);
      }
    });
    this.props.removeNotification(id);
  }

  render() {
    require('./NewsGlass.scss');
    // const news = [
    //   {date: '10/26/16', head: 'Notification', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'News', text: 'Where in Massachusetts are stalled solar projects located? Where in Massachusetts are stalled solar projects located? Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'Sunnova Update', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'News', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'News', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'Sunnova Update', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'News', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'News', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'Sunnova Update', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'News', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    //   {date: '10/26/16', head: 'News', text: 'Where in Massachusetts are stalled solar projects located?', author: 'Shira Schoenberg - Mass Live'},
    // ];
    const printDate = (value) => {
      const date = global.moment(value);
      return date.format('MM/DD/YY');
    };

    const news = this.props.notifications;
    const entries = [];
    for (let index = news.length - 1; index >= 0; index--) {
      const data = news[index];
      const row = (
          <div key={'entry-' + index} className="text-link user-row">
              <div className="text">
                <strong>{printDate(data.createdAt)} Notification: </strong>
                {data.body}
              </div>
              <div className="buttons clickable" onClick={this.deleteNotification.bind(this, data._id)}>Delete</div>
          </div>
      );

      entries.push(row);
    }

    return (
      <div className="help-widget-base news" style={{
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
            Close News & Updates
          </div>
          <div ref="scrollable" className="scrollable" style={{height: this.state.height, overflowY: 'scroll', paddingBottom: 100, paddingTop: 20}}>
            {entries}
          </div>
          </div>
      </div>);
  }
}
