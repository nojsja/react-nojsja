import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';

import './app/styles/public.css';
import './app/styles/public.less';

import 'antd/dist/antd.css';
import 'editable-tree-antd/lib/styles/editable-tree.css';
import 'editable-tree-antd/lib/styles/icon-font/iconfont.css';

// import './app/styles/font/iconfont.css';
import 'semantic-ui-css/semantic.min.css';

import App from './app/App';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./app/App', () => {
      render(require('./app/App').default)
  })
}