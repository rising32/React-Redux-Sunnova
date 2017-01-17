import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import auth from './auth';
import slidePage from './slidePage';
import glass from './glass';
import layout from './layout';
import data from './data';
import users from './users';
import navigation from './navigation';
import notifications from './notifications';
import designerDialog from './designerDialog';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  users,
  slidePage,
  glass,
  layout,
  data,
  navigation,
  notifications,
  designerDialog
});
