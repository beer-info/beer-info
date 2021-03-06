'use strict';

const initialState = {
	fetching: false,
	loaded: false,
	selected: null,
	data: []
}

const reducers = {

	STYLES_SELECT: (state, data) => ({ ...state, selected: data }),

	STYLES_REQUEST: state => ({ ...state, fetching: true }),

	STYLES_RECEIVED (state, data = null) {
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
