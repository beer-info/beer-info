'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'

import C from 'classnames'

import css from './SearchForm.scss'

class SearchForm extends Component {

  constructor(props) {
    super(props)
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.onQuery(this.searchInput.value);
  }

  onSelect(event) {
    this.props.onSelect(event.target.value)
  }

  render() {
    let items = this.props.items || [];
    return (
      <form
        className={css.search}
        onSubmit={this.onSubmit.bind(this)}>
        <input
          className={css.query}
          type="text"
          ref={input => this.searchInput = input}
          placeholder={'Your beer search query'}/>
        <button
          className={css.submit}
          type="submit">
          {
            '🔎'
          }
        </button>
        <select disabled={!!this.props.disabled}
          className={css.select}
          onChange={this.onSelect.bind(this)}>
          {
            items.map((item, key) => <option key={key} value={item.id}>{item.name}</option>)
          }
        </select>
      </form>
    );
  }
}

export default SearchForm
