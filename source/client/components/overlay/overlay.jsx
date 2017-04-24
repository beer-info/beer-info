'use strict';

import 'react-hot-loader'
import React, { Component } from 'react'
import connect from '../../utils/redux-connect-helper'

/*import overlay components*/

import actions from '../../actions/overlay'

import css from './overlay.scss'

@connect('system.overlay', actions)
export default class Overlay extends Component {

	constructor(props) {
		super(props);
	}

	componentWillUpdate() {
		document.body.style.overflowY = this.props.state.overlay === 'off' ? 'auto' : 'hidden'
	}

	onClose(){
		this.props.overlay('off');
	}

	render(){
		console.log(this.props);
		let component = this.props.state.overlay;
		let overlay = {
			off: null,
			on: <div>overlay</div>
			/*overlay components*/
		}
		return (
			<div className={(component === 'off' ? css.overlayOff : css.overlayOn)}>
				<div>
					{overlay[component]}
					<div className={css.closeButton} onClick={this.onClose.bind(this)}>⮿</div>
				</div>
			</div>
        )
	}

}

