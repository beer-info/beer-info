'use strict';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'remote-redux-devtools'
import thunk from 'redux-thunk'

import reducer from './reducers'

import SearchPage from './components/SearchPage'
import BeerPage from './components/BeerPage'
import NotFoundPage from './components/NotFoundPage'

import css from './app.scss'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

window.addEventListener('scroll', (event) => {
	let {clientHeight, scrollHeight, scrollTop} = document.body
	console.log({event, clientHeight, scrollHeight, scrollTop})
	document.body.style.backgroundPositionY =
		-(1888 - clientHeight) / (scrollHeight - clientHeight) * scrollTop + 'px';
})

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={SearchPage} />
			<Route path="/beer/:id" component={BeerPage} />
			<Route path="*" component={NotFoundPage} />
		</Router>
	</Provider>,
	document.getElementById('approot')
)
