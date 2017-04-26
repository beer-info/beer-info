'use strict';

import { combineReducers } from 'redux'

import categories from './categories'
import styles from './styles'
import beers from './beers'

export default combineReducers({ categories, styles, beers })
