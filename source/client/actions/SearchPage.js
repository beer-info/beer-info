'use strict';

const restoreBookmarks = () => JSON.parse(localStorage.getItem('bookmarks') || '[]')

function rememberBookmark(id) {
	let bookmarks = restoreBookmarks()
	if(!bookmarks.reduce((found, item) => found || item === id, false)) {
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks.concat(id)))
	}
	return true;
}

function forgetBookmark(id) {
	let bookmarks = restoreBookmarks()
	if(bookmarks.reduce((found, item) => found || item === id, false)) {
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks.filter(bookmark => bookmark !== id)))
	}
	return true;
}

export default dispatch => {
	const actions = {

		addToBookmarks: data => rememberBookmark(data) && dispatch({ type: 'BEERS_ADD_TO_BOOKMARKS', data }),

		removeFromBookmarks: data => forgetBookmark(data) && dispatch({ type: 'BEERS_REMOVE_FROM_BOOKMARKS', data }),

		requestCategories: () => {
			dispatch({ type: 'CATEGORIES_REQUEST' })
			return new Promise((resolve, reject) => {
				dispatch((dispatch, getState) => {
					const categories = getState().categories
					if(!categories.loaded){
						fetch('https://terezanov.ru:8888/api/categories')
						.then(r => r.json())
						.then(json => {
							json.data = json.data.filter(category => category.name && category.name !== '""' )
							dispatch({ type: 'CATEGORIES_RECEIVED', data: { ...json } })
							resolve(json)
						})
						.catch(reject)
					} else {
						dispatch({ type: 'CATEGORIES_RECEIVED', data: { ...categories } })
						resolve(categories)
					}
				})
			})
		},

		requestStyles: () => {
			dispatch({ type: 'STYLES_REQUEST' })
			return new Promise((resolve, reject) => {
				dispatch((dispatch, getState) => {
					const styles = getState().styles
					if(!styles.loaded){
						fetch('https://terezanov.ru:8888/api/styles')
						.then(r => r.json())
						.then(json => {
							dispatch({ type: 'STYLES_RECEIVED', data: { ...json } })
							resolve(json)
						})
						.catch(reject)
					} else {
						dispatch({ type: 'STYLES_RECEIVED', data: { ...styles } })
						resolve(styles)
					}
				})
			})
		},

		requestBeers: (style = 1, page = 1) => {
			dispatch({ type: 'BEERS_REQUEST' })
			return new Promise((resolve, reject) => {
				dispatch((dispatch, getState) => {
					let state = getState()
					fetch(`https://terezanov.ru:8888/api/beers?styleId=${style}&p=${page}`)
					.then(r => r.json())
					.then(json => {
						dispatch({
							type: 'BEERS_RECEIVED',
							data: {
								...json,
								byQuery: false,
								byStyle: style
							}
						})
						resolve(json)
					})
					.catch(reject)
				})
			})
		},

		requestBookmarks: () => {
			return new Promise((resolve, reject) => {
				dispatch((dispatch, getState) => {
					const storedBookmarks = restoreBookmarks()
					const bookmarks = getState().beers.bookmarked
					const bookmarksToLoad = bookmarks.reduce((stored, item) => stored.filter(id => item.id !== id), storedBookmarks)
					Promise
					.all(bookmarksToLoad.map(id => fetch(`https://terezanov.ru:8888/api/beer/${id}`)))
					.then(results => {
						results.map(result => {
							result.json().then(json => {
								if(json.data && json.data.id) {
									rememberBookmark(json.data.id) && dispatch({ type: 'BEERS_PUSH_TO_BOOKMARKS', data: json.data })
								}
							})
						})
					})
					.catch(reject)
				})
			})
		},

		searchQuery: (query, page = 1) => {
			dispatch({ type: 'BEERS_REQUEST', data: query })
			return new Promise((resolve, reject) => {
				dispatch((dispatch, getState) => {
					let state = getState()
					fetch(`https://terezanov.ru:8888/api/search?q=${query}&type=beer&p=${page}`)
					.then(r => r.json())
					.then(json => {
						dispatch({
							type: 'BEERS_RECEIVED',
							data: {
								...json,
								byQuery: query,
								byStyle: false
							}
						})
						resolve(json)
					})
					.catch(reject)
				})
			})
		},

		loadBookmarks: () => {

		}
	}
	return actions
}
