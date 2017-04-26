'use strict';

const initialState = {
	fetching: false,
	loaded: false,
	data: []
}

const reducers = {

	CATEGORIES_REQUEST: state => ({ ...state, fetching: true }),

	CATEGORIES_RECEIVED (state, data = null) {
		if(data) return {
			...state,
			...data,
			fetching: false,
			loaded: true
		}
		return state;
	}

}

export default (state = initialState, action) => (reducers[action.type] || (state => state))(state, action.data)
