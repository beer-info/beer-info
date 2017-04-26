'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
import { Link } from 'react-router'

import css from './NotFoundPage.scss'

export default class NotFoundPage extends Component {
	render(){
		return (
			<div className={css.page}>
				There is nothing to drink on this page<br/>
				Try to search some beer <Link to="/">here</Link>
			</div>
		)
	}
}

