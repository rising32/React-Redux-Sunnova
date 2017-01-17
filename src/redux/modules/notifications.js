const INIT_NOTIFICATIONS = 'sunnova/notifications/INIT_NOTIFICATIONS';
const ADD_NOTIFICATION = 'sunnova/notifications/ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'sunnova/notifications/REMOVE_NOTIFICATION';

const SENT_NOTIFICATION = 'sunnova/notifications/SENT_NOTIFICATION';
const SENT_NOTIFICATION_SUCCESS = 'sunnova/notifications/SENT_NOTIFICATION_SUCCESS';
const SENT_NOTIFICATION_FAIL = 'sunnova/notifications/SENT_NOTIFICATION_FAIL';

const initialState = {
  arr: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INIT_NOTIFICATIONS:
      return {
        ...state,
        arr: action.data
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        arr: [
          action.data,
          ...state.arr
        ]
      };
    case REMOVE_NOTIFICATION:
      let arr = state.arr.slice(0) || [];
      arr = arr.filter((item) => { return item._id !== action.data; });
      return {
        ...state,
        arr: [
          ...arr
        ]
      };
    default:
      return state;
  }
}

export function init(arr) {
  return {
    type: INIT_NOTIFICATIONS,
    data: arr
  };
}

export function add(notification) {
  return {
    type: ADD_NOTIFICATION,
    data: notification
  };
}

export function remove(notificationId) {
  return {
    type: REMOVE_NOTIFICATION,
    data: notificationId
  };
}

export function sentSMS(userId, body) {
  console.log(userId, body);
  return {
    types: [SENT_NOTIFICATION, SENT_NOTIFICATION_SUCCESS, SENT_NOTIFICATION_FAIL],
    promise: (client) => client.post('/sendSMS', {
      data: {
        id: userId,
        body: body
      }
    })
  };
}

export const NotificationsAPI = { init, add, sentSMS, remove };
