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

		requestBeer: id => {
			dispatch({ type: 'BEERS_REQUEST' })
			return new Promise((resolve, reject) => {
				dispatch((dispatch, getState) => {
					let beers = getState().beers;
					let beer = beers.data
					.concat(beers.bookmarked)
					.filter(beer => beer.id === id)
					.reduce((found, beer) => found || beer, null)
					if(beer) {
						dispatch({ type: 'BEERS_VIEW_BEER', data: beer })
						resolve(beer)
					} else {
						fetch(`https://terezanov.ru:8888/api/beer/${id}`)
						.then(r => r.json())
						.then(json => {
							console.log(json)
							dispatch({
								type: 'BEERS_VIEW_BEER',
								data: json.status === 'success' ? json.data : json
							})
							resolve(json)
						})
						.catch(reject)
					}
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
		}

	}
	return actions
}
