'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
import { Link } from 'react-router'

import { connect } from 'react-redux'

import C from 'classnames'

import css from './StylePage.scss'

//import UnderConstruction from '../../components/UnderConstruction'

import { ACTIONS } from '../../constants'
// import SearchForm from './containers/search-form'
// import SearchResultsList from './containers/search-result-list'
// import SearchResultsDetailes from './containers/search-result-detailes'
// import BookmarksList from './containers/bookmarks-list'

// import MainLayout from './components/main-layout'

@connect(
    state => ({state}),
    dispatch => ({
        initState: () => dispatch({type: 'INIT_STATE'})
    })
)
class StylePage extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return <div><Link to="/">home</Link></div>;//<UnderConstruction />
  }
}

export default StylePage
