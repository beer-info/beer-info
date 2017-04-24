'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
// import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import C from 'classnames'

import css from './SearchPage.scss'

import actions from '../../actions/SearchPage'

// import {log, warn, error} from '../../utils/debug'

//import UnderConstruction from '../../components/UnderConstruction'

import SearchForm from '../SearchForm'
import SearchResults from '../SearchResults';
// import SearchResultsDetailes from './components/search-result-detailes'
import Bookmarks from '../Bookmarks'

// import MainLayout from './components/main-layout'

@connect(state => ({state}), dispatch => actions(dispatch))
class SearchPage extends Component {

	constructor(props) {
		super(props)
		this.onStyleSelect = this.onStyleSelect.bind(this)
		this.onSearchQuery = this.onSearchQuery.bind(this)
		this.onBookmarkAdd = this.onBookmarkAdd.bind(this)
		this.onBookmarkDel = this.onBookmarkDel.bind(this)
	}

	componentWillMount() {
		let { categories, styles, beers } = this.props.state
		!categories.fetching && this.props.requestCategories()
		!styles.fetching && this.props.requestStyles()
		!beers.fetching && this.props.requestBeers()
	}

	onStyleSelect(style) {
		console.log('selected style id:', style)
		this.props.selectStyle(style)
	}

	onSearchQuery(query, page) {
		console.log('search query:', {query, page})
		this.props.searchQuery(query, page || 1)
	}

	onBookmarkAdd(id) {
		console.log('add to bookmarks:', {query, page})
		this.props.addToBookmarks(id)
	}

	onBookmarkDel(id) {
		console.log('remove from bookmarks:', {query, page})
		this.props.removeFromBookmarks(id)
	}

	render() {
		let styles = this.props.state.styles;
		let beers = (
			styles.selected
				? this.props.state.beers.data.filter(beer => beer.style && beer.style.styleId === styles.selected)
				: this.props.state.beers.data
		)
		console.log('BEERS:', beers);
		return  (
			<div className={css.page} >
				<SearchForm
					items={styles}
					onSelect={this.onStyleSelect}
					onQuery={this.onSearchQuery} />
				<div className={css.pageBody} >
					<SearchResults
						items={beers}
						onBookmark={this.onBookmarkAdd} />
					<Bookmarks onBookmarkDel={this.onBookmarkDel} />
				</div>
			</div>
		)
	}
}

export default SearchPage
