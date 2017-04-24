'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'

import C from 'classnames'

import css from './SearchResults.scss'

class SearchResults extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className={css.results}>
				{this.props.beers.map((beer, key) => (
					<div key={key}>
						<img
							src={ beer.labels
								? beer.labels.medium
									? beer.labels.medium
									: beer.labels.icon
										? beer.labels.icon
										: 'favicon.png'
								: 'favicon.png'
							}
							alt="Beer label" height="128"/>
						<div>
							{beer.style ? beer.style.description : 'Some cool beer'}
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default SearchResults
