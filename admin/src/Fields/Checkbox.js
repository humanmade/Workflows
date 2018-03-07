import React from 'react';
import Field from './Field';

class Checkbox extends Field {

	label() {
		return <label key="label" htmlFor={this.props.name}>
			{this.input()}
			{this.props.label}
		</label>;
	}

	input( props = {} ) {
		return <input
			key="input"
			type="checkbox"
			id={this.props.name}
			name={this.props.name}
			onChange={this.onChange}
			checked={!!this.props.value}
			{...props.params}
		/>;
	}

	render() {
		return [
			this.label(),
			this.description(),
		];
	}

}

export default Checkbox;
