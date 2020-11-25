import React from 'react';
import { Route, Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import { createHashHistory } from 'history';

import PublicState from './stores/Public';
import DemoState from './stores/Demo';

import HomePage from './views/HomePage';

/* ------------------- global history ------------------- */
export const history = createHashHistory();

const stores = {
  pub: new PublicState(),
  demo: new DemoState(),
};

function App() {
  return (
    <Provider {...stores}>
      <Router history={history}>
        <Route path="/" component={HomePage} />
      </Router>
    </Provider>
  );
}

/* ------------------- export provider ------------------- */
export default App;
