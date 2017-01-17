import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
  App,
  NotFound,
  FamilyPage,
  InstallerPage,
  DesignerPage,
  LandingLayout
} from 'containers';

export default (store) => {
  function checkAuth(logged, replace, cb) {
    const { auth: { user } } = store.getState();
    if (!!user === !logged) replace('/');
    cb();
  }

  const requireLogin = (nextState, replace, cb) => {
    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(() => checkAuth(true, replace, cb));
    } else {
      checkAuth(true, replace, cb);
    }
  };

  const requireNotLogged = (nextState, replace, cb) => {
    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(() => checkAuth(false, replace, cb));
    } else {
      checkAuth(false, replace, cb);
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      {/* Home (main) route */}

      <Route component={LandingLayout}>
        <IndexRoute component={FamilyPage} />
        <Route path="/installer" component={InstallerPage} />
        <Route path="/designer" component={DesignerPage} />
      </Route>



      {/* Routes requiring login */}
      <Route onEnter={requireLogin} />

      <Route onEnter={requireNotLogged} />

      {/* Catch all route */}
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
