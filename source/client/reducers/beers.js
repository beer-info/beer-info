'use strict';

const initialState = {
    fetching: false,
    selected: null,
    data: []
}

const reducers = {

  BEERS_ADD_TO_BOOKMARKS: (state, data) => ({
    ...state,
    data: state.beers.data.map(beer => (beer.id === data ? {...beer, bookmarked: true} : beer))
  }),

  BEERS_REMOVE_FROM_BOOKMARKS: (state, data) => ({
    ...state,
    data: state.beers.data.map(beer => (beer.id === data ? {...beer, bookmarked: false} : beer))
  }),

  BEERS_REQUEST: (state, query = '') => ({
    ...state,
    query,
    fetching: true
  }),

  BEERS_RECEIVED (state, data = null) {
    if(!data) return state;
    return {
      ...state,
      ...data,
      fetching: false
    }
  }

}

export default function (state = initialState, action) {
  return (reducers[action.type] || (state => state))(state, action.data)
}
