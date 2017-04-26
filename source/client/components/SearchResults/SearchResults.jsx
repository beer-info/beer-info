'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
import { Link } from 'react-router'

import C from 'classnames'

import css from './SearchResults.scss'

class SearchResults extends Component {

	constructor(props) {
		super(props)
	}

	onBookmark(item) {
		this.props.onBookmark(item)
	}

	render() {
		let items = this.props.items || []
		return (
			<div className={css.results}>
			{
				items.map((item, key) => {

					let description = item.description
						? item.description
						: item.style && item.style.description
							? item.style.description
							: item.name
					let src = !item.labels
						? 'favicon.png'
						: item.labels.medium
							? item.labels.medium
							: item.labels.icon
								? item.labels.icon
								: 'favicon.png'
					if(description.length > 500) description = `${description.substr(0, 500)}...`;

					return (
					    <div
					    	className={css.item}
					    	key={key} >
							<Link to={`/beer/${item.id}`}>
								<h1 title={'Open detailed beer info'}>
									{
										item.displayName ? item.displayName : item.name
									}
								</h1>
							</Link>
							<div className={css.info} >
								<div className={css.description} >
									{
										description
									}
								</div>
								<img
									className={css.label}
									src={src}
									alt="Beer label" height="128"
									onClick={this.onBookmark.bind(this, item.id)}
									title={'Add to beer collection'}/>
							</div>
						</div>
					)

				})
			}
			</div>
		);
	}
}

export default SearchResults
