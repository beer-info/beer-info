'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import C from 'classnames'

import css from './BeerPage.scss'
import defLabel from '../../assets/beer_def_label.png'
import actions from '../../actions/BeerPage'

@connect(state => ({state: state.beers}), dispatch => actions(dispatch))
class BeerPage extends Component {

	constructor(props) {
		super(props)
	}

	componentWillMount() {
		this.props.requestBeer(this.props.params.id)
	}

	render() {
		let beer = this.props.state.beer
		console.log('render beer:', beer)

		// только не кастрируйте меня за это пожалуйста - если оно Вас раздражает,
		// то не вопрос, не буду такого городить, но как по мне, то оно вполне читабельно :)
		let label = !beer
			? '/assets/beer_def_label.png'
			: !beer.labels
				? '/assets/beer_def_label.png'
				: beer.labels.large
					? beer.labels.large
					: beer.labels.medium
						? beer.labels.medium
						: beer.labels.icon
							? beer.labels.icon
							: '/assets/beer_def_label.png'
		return beer
			? (
	        	<div className={css.page}>
					<h1 className={css.name}>
						{
							beer.displayName ? beer.displayName : beer.name
						}
					</h1>
					<h2 className={css.style}>
						{
							beer.style.name
						}
					</h2>
					<div className={css.pageBody}>
						<div className={css.leftSidebar}/>
						<div className={css.beerInfo}>
							<img className={css.label} src={label} alt="Beer label"/>
							<h2>Beer description:</h2>
							<p className={css.description}>
								{
									beer.description
								}
							</p>
							<h2>{`Style: ${beer.style.name}`}</h2>
							<p className={css.description}>
								{
									beer.style.description
								}
							</p>
							<Link className={css.link} to="/">{"Let's find more beer!"}</Link>
						</div>
						<div className={css.rightSidebar}/>
					</div>
				</div>
			)
			: (
	        	<div className={css.page}>
					<div className={css.preloader} >
						<div className={css.spinner} />
					</div>
				</div>
			)
	}
}

export default BeerPage
