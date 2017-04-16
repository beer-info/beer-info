'use strict';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'remote-redux-devtools'
import thunk from 'redux-thunk'

import reducer from './reducers'

import SearchPage from './containers/SearchPage'
import StylePage from './containers/StylePage'
import NotFoundPage from './components/NotFoundPage'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={SearchPage} />
      <Route path="/style/:id" component={StylePage} />
      <Route path="*" component={NotFoundPage} />
    </Router>
  </Provider>,
  document.getElementById('approot')
)
