import { Component } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {

	setDomElement( props ) {
		if ( props.target ) {
			this.domEl = document.querySelector( props.target );
		} else {
			this.domEl = document.createElement( 'div' );
			document.body.appendChild( this.domEl );
		}

		// if ( this.domEl ) {
		// 	this.domEl.innerHTML = '';
		// }
	}

	componentWillMount() {
		this.setDomElement( this.props );
	}

	componentDidMount() {
		this.props.onLoad && this.props.onLoad();
	}

	componentWillUnmount() {
		if ( ! this.props.target ) {
			document.body.removeChild( this.domEl );
		}

		this.props.onUnload && this.props.onUnload();
	}

	componentWillUpdate( nextProps ) {
		this.setDomElement( nextProps );

		// Support an unload method call in the props.
		this.props.onUnload && this.props.onUnload();
	}

	componentDidUpdate() {
		this.props.onLoad && this.props.onLoad();
	}

	render() {
		return this.domEl
			? ReactDOM.createPortal( this.props.children, this.domEl )
			: null;
	}
}

export default Portal;
