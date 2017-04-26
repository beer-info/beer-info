'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
import C from 'classnames'

import css from './SearchForm.scss'

class SearchForm extends Component {

	constructor(props) {
		super(props)
	}

	setQuery(query) {
		this.searchInput.value = query || ''
	}

	setSelect(id) {
		this.select.selectedIndex = [
			// 'я обычно так не делаю, но так присвоение выглядит прикольно,',
			// 'когда надо метод массива на чем то типа HTMLCollection вызвать :)',
			// 'и эти строки можно типа как каменты заюзать :)',
			// 'разумеется в боевом проекте я так гнать не собираюсь :)',
			// 'И по большому счету надо юзать Array.prototype, а не []',
			// 'А вообще - мне просто стало скучно и я решил пострадать фигнёй :)'
		].filter.call(this.select.options, option => option.value === id).pop().index
	}

	onSubmit(event) {
		event.preventDefault();
		this.props.onQuery(this.searchInput.value);
	}

	onSelect(event) {
		this.props.onSelect(event.target.value)
	}

	onPageSelect(page) {
		this.props.onPageSelect(page)
	}

	render() {
		let items = this.props.items || []
		let pages = []
		while(pages.length < this.props.pages) {
			pages.push(pages.length + 1)
		}
		return (
		    <nav className={css.nav}>
				<form
					className={css.search}
					onSubmit={this.onSubmit.bind(this)} >
					<input
						className={css.query}
						type="text"
						ref={input => this.searchInput = input}
						placeholder={this.props.placeholder} />
					<button
						className={css.submit}
						type="submit" >
						{
							'🔎'
						}
					</button>
					<select
						disabled={!!this.props.disabled}
						className={css.select}
						ref={select => this.select = select}
						onChange={this.onSelect.bind(this)} >
						{
							items.map((item, key) => (
	                        	<option
	                        		key={key}
	                        		value={item.id} >
		                        	{
		                        		item.name
		                        	}
	                        	</option>
	                    	))
						}
					</select>
				</form>
				<div className={css.pagination}>
					{
						pages.map((page, key) => (
							<div
								key={key}
								className={C(css.page, page === this.props.currentPage ? css.selected : '')}
								onClick={this.onPageSelect.bind(this, page)}>
								{
									page
								}
							</div>
						))
					}
				</div>
			</nav>
		);
	}
}

export default SearchForm
