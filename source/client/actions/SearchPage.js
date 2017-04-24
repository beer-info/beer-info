'use strict';

import { ACTIONS } from '../constants'

export default dispatch => {
	return {

		addToBookmarks: data => dispatch({ type: 'BEERS_ADD_TO_BOOKMARKS', data }),

		removeFromBookmarks: data => dispatch({ type: 'BEERS_REMOVE_FROM_BOOKMARKS', data }),

		selectStyle: data => dispatch({ type: 'STYLES_SELECT', data }),

		requestCategories: () => {
			dispatch({ type: 'CATEGORIES_REQUEST' })
			dispatch((dispatch, getState) => {
				fetch('https://terezanov.ru:8888/api/categories')
				.then(r => r.json())
				.then(json => {
					console.log(json)
					return dispatch({
						type: 'CATEGORIES_RECEIVED',
						data: json.data.filter(category => category.name && category.name !== '""' )
					})
				})
			})
		},

		requestStyles: () => {
			dispatch({ type: 'STYLES_REQUEST' })
			dispatch((dispatch, getState) => {
				fetch('https://terezanov.ru:8888/api/styles')
				.then(r => r.json())
				.then(json => {
					console.log(json)
					return dispatch({
						type: 'STYLES_RECEIVED',
						data: json.data //.filter(style => style.name && style.name !== '""' )
					})
				})
			})
		},

		requestBeers: (style = 1, page = 1) => dispatch({
			dispatch({ type: 'BEERS_REQUEST' })
			dispatch((dispatch, getState) => {
				let state = getState()
				let loaded = state.beers.pages.reduce((loaded, pageNum) => loaded || page === pageNum, false)
				if(state.styles.selected === style && loaded)
			})
		}),

		searchQuery: (query, page = 1) => {
			console.log('query', query, page)
			dispatch({ type: 'BEERS_REQUEST', data: query })
			dispatch((dispatch, getState) => {
				let state = getState()
				let loaded = state.beers.pages.reduce((loaded, pageNum) => loaded || page === pageNum, false)
				if(state.beers.query === query && loaded){
					dispatch({
						type: 'BEERS_RECEIVED',
						data: {
							...state.beers,
							query,
							currentPage: page
						}
					})
				} else {
					fetch(`https://terezanov.ru:8888/api/search?q=${query}&type=beer&p=${page}`)
					.then(r => r.json())
					.then(json => {
						let style = getState().style.selected
						console.log('searchQuery json:',json)
						dispatch({
							type: 'BEERS_RECEIVED',
							data: {
								...json,
								query
							}
						})
					})
				}
			})
		},

	}

};
