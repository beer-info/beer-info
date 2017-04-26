'use strict';

const initialState = {
	fetching: true,
	selected: null,
	bookmarked: [],
	beer: null,
	data: []
}

const reducers = {

	// for add beer, which present in Store.beers.data by reference
	BEERS_ADD_TO_BOOKMARKS: (state, data) => ({
		...state,
		bookmarked: state.bookmarked.concat(state.data.filter(beer => {
			return beer.id === data && !state.bookmarked.reduce((found, beer) => found || beer.id === data, false)
		}))
	}),

	// for add beer, which being loaded using localStorage stored bookmarks but missing in Store.beers.data
	BEERS_PUSH_TO_BOOKMARKS: (state, data) => ({
		...state,
		bookmarked: state.bookmarked.concat(data)
	}),

	BEERS_REMOVE_FROM_BOOKMARKS: (state, data) => ({
		...state,
		bookmarked: state.bookmarked.filter(beer => beer.id !== data)
	}),

	BEERS_REQUEST: (state, query = '') => ({ ...state, query, fetching: true }),

	BEERS_VIEW_BEER: (state, beer) => ({...state, beer}),

	BEERS_RECEIVED (state, data = null) {
		if(!data) return state;
		return {
			...state,
			...data,
			fetching: false
		}
	}


}

export default (state = initialState, action) => (reducers[action.type] || (state => state))(state, action.data)
