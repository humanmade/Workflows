/*global HM*/
import React from 'react';
import Field from  './Field';
import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';

class SelectField extends Field {

	input( props = {} ) {
		const params = this.props.params || {};
		const Input  = params.endpoint ? Async : Select;

		// Set up
		if ( params.endpoint ) {
			params.autoload    = params.autoload || true;
			params.loadOptions = input => fetch( `${params.endpoint.url}?search=${encodeURIComponent( input )}`, {
				credentials: 'same-origin',
				headers:     {
					'X-WP-Nonce': HM.Workflows.Nonce
				}
			} )
				.then( response => response.json() )
				.then( data => ({ options: data }) );
			params.labelKey = params.endpoint.labelKey || 'name';
			params.valueKey = params.endpoint.valueKey || 'id';
		}

		return <Input
			key="input"
			id={this.props.name}
			name={this.props.name}
			onChange={this.onChange.bind(this)}
			value={this.props.value}
			{...params}
		/>;
	}

	onChange( option ) {
		if ( this.props.onChange ) {
			const valueKey = this.props.params.endpoint
				? ( this.props.params.endpoint.valueKey || 'id' )
				: 'value';

			const value = this.props.params.multi
				? option.map( opt => opt[valueKey] )
				: option[valueKey]

			this.props.onChange( value, option );
		}
	}

}

export default SelectField;
