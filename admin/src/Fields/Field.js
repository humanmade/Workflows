import React from 'react';

class Field extends React.Component {

	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind( this );
	}

	label( props = {} ) {
		return <label key="label" htmlFor={this.props.name} {...props}>{this.props.label}</label>;
	}

	input( props = {} ) {
		return <input
			key="input"
			type={this.props.type || 'text'}
			id={this.props.name}
			name={this.props.name}
			onChange={this.onChange}
			value={this.props.value}
			{...props}
		/>;
	}

	description() {
		return this.props.description && <div className="description">{this.props.description}</div>;
	}

	onChange( event ) {
		if ( this.props.onChange ) {
			switch( this.props.type ) {
				case 'checkbox':
				case 'radio':
					this.props.onChange( event.target.checked );
					break;
				default:
					this.props.onChange( event.target.value );
			}
		}
	}

	render() {
		return [
			this.label(),
			this.input(),
			this.description(),
		];
	}

}

export default Field;
