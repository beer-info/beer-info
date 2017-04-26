'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
import { Link } from 'react-router'
import C from 'classnames'

import css from './Bookmarks.scss'

class Bookmarks extends Component {

	constructor(props) {
		super(props)
	}

	onBookmarkDel(id) {
		this.props.onBookmarkDel(id)
	}

	render() {
		let key = 0;
		let bookmarks = this.props.items.reduce((items, item) => {
			let label = !item.labels
				? 'favicon.png'
				: item.labels.icon
					? item.labels.icon
					: item.labels.medium
			let bookmark = (
				<div
					key={key++}
					title={item.style.name}
					className={css.bookmark} >
					<div
						className={css.remove}
						onClick={this.onBookmarkDel.bind(this, item.id)}>
						{
							'❌'
						}
					</div>
					<Link to={`/beer/${item.id}`}>
						<img
							className={css.icon}
							src={label} />
						<p className={css.name}>
							{
								item.name
							}
						</p>
					</Link>
				</div>
			);
			if(items.length && items[items.length-1] && items[items.length-1].length < 3) {
				items[items.length-1].push(bookmark);
			} else {
				items.push([bookmark])
			}
			return items;

		}, []).map((group, key) => (

            <div
            	key={key}
            	className={css.group} >
	            {
	            	group
	            }
            </div>

    	));
    	console.log(bookmarks)
		return (
			<div className={css.bookmarks} >
				<div key={bookmarks.length || 1} className={css.caption} >
					{
						this.props.caption
					}
				</div>
				<div className="css.items">
					{
						(bookmarks.length ? bookmarks : [<div key={0} className={css.group} />])
					}
				</div>
			</div>
		);
	}
}

export default Bookmarks
