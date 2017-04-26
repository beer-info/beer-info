'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import SearchForm from '../SearchForm'
import SearchResults from '../SearchResults';
import Bookmarks from '../Bookmarks'

import css from './SearchPage.scss'
import actions from '../../actions/SearchPage'

@connect(state => ({state}), dispatch => actions(dispatch))
class SearchPage extends Component {

	constructor(props) {
		super(props)
	}

	componentWillMount() {
		let { requestCategories, requestStyles, requestBeers, requestBookmarks } = this.props
		Promise.all([
            requestCategories(), requestStyles(), requestBeers(), requestBookmarks()
        ]).catch(console.error)
	}

	onStyleSelect(style) {
		this.props.requestBeers(style)
		this.searchForm.clearInput()
	}

	onSearchQuery(query, page) {
		this.props.searchQuery(query, page || 1)
	}

	onBookmarkAdd(id) {
		this.props.addToBookmarks(id)
	}

	onBookmarkDel(id) {
		this.props.removeFromBookmarks(id)
	}

	onPageSelect(page) {
		this.props.state.beers.byQuery
		? this.props.searchQuery(this.props.state.beers.byQuery, page)
		: this.props.requestBeers(this.props.state.beers.byStyle, page)
	}

	render() {
		let styles = this.props.state.styles
		let beers = this.props.state.beers
		return  (
			<div className={css.page} >
				<SearchForm
					items={styles.data}
					pages={beers.numberOfPages}
					currentPage={beers.currentPage}
					placeholder={'Search you favorite beer here or select beer style from dropbox 🠊'}
					ref={form => this.searchForm = form}
					onPageSelect={this.onPageSelect.bind(this)}
					onSelect={this.onStyleSelect.bind(this)}
					onQuery={this.onSearchQuery.bind(this)} />
				<div className={css.pageBody} >
					<div className={css.leftSidebar} />
					<SearchResults
						items={beers.data}
						onBookmark={this.onBookmarkAdd.bind(this)} />
					<div className={css.rightSidebar} >
						<Bookmarks
							caption='Beer collection'
							onBookmarkDel={this.onBookmarkDel.bind(this)}
							items={beers.bookmarked} />
					</div>
				</div>
				{
					beers.fetching
					? (
						<div className={css.preloader} >
							<div className={css.spinner} />
						</div>
					)
					: null
				}
			</div>
		)
	}
}

export default SearchPage
