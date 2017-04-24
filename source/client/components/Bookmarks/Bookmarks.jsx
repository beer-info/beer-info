'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'

import C from 'classnames'

import css from './Bookmarks.scss'

class Bookmarks extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		let key = 0;
		let bookmarks = [1,2,3,4,5,6,7,8,9].reduce((items, item) => {
			let label = !!
				item.labels
				? item.labels.icon
					? item.labels.icon
					: item.labels.medium
				: 'favicon.png'
			;
			let bookmark = (
				<div
					key={key++}
					className={css.bookmark}>
						<img src={label} />
						<p>{item}</p>
				</div>
			);
			if(items.length && items[items.length-1] && items[items.length-1].length < 3) {
				items[items.length-1].push(bookmark);
			} else {
				items.push([bookmark])
			}
			return items;
		}, []).map((group, key) => <div key={key} className={css.group}>{group}</div>);
		return (
			<div className={css.bookmarks}>
				{bookmarks}
			</div>
		);
	}
}

export default Bookmarks
