/*global HM*/
import React from 'react';
import Field from  './Field';
import Select, { Async } from 'react-select';

class SelectField extends Field {

	state = {}

	input( props = {} ) {
		const params = this.props.params || {};
		const Input  = params.endpoint ? Async : Select;

		// Set up
		if ( params.endpoint ) {
			params.loadOptions = async input => {
				const fetchOpts = {
					credentials: 'same-origin',
					headers:     {
						'X-WP-Nonce': HM.Workflows.Nonce,
					},
				};

				let results = [];
				let exclude = '';

				// Get selected.
				if ( this.props.value ) {
					const valueResponse = await fetch( `${params.endpoint.url}?include=${ this.props.value.toString() }`, fetchOpts );
					const value = await valueResponse.json();
					results.concat( value );
					exclude = `&exclude=${ value.map( item => item[ params.endpoint.valueKey || 'id' ] ).join( ',' ) }`;

					this.setState( {
						value,
					} );
				}

				const search = input ? `&search=${encodeURIComponent( input )}` : '';
				const response = await fetch( `${params.endpoint.url}?per_page=100&_locale=user${ exclude }${ search }`, fetchOpts );
				const data = await response.json();

				return data;
			}

			params.cacheOptions   = params.cacheOptions || true;
			params.defaultOptions = params.defaultOptions || true;
			params.getOptionLabel = option => option[ params.endpoint.labelKey || 'name' ];
			params.getOptionValue = option => option[ params.endpoint.valueKey || 'id' ];
		}

		// Get default value.
		let value;

		if ( params.options && ! params.isMulti ) {
			value = params.options.filter( item => item.value === this.props.value );
		}

		if ( params.options && params.isMulti ) {
			value = params.options.filter( item => this.props.value.indexOf( item.value ) >= 0 );
		}

		if ( this.state.value ) {
			value = this.state.value;
		}

		if ( value && ! params.isMulti ) {
			value = value.shift();
		}

		return <Input
			key="input"
			id={this.props.name}
			name={this.props.name}
			onChange={this.onChange.bind(this)}
			value={value}
			getOptionLabel={option => option.label}
			getOptionValue={option => option.value}
			{...params}
		/>;
	}

	onChange( option ) {
		const { onChange, params } = this.props;

		if ( onChange ) {
			const valueKey = params.endpoint
				? ( params.endpoint.valueKey || 'id' )
				: 'value';

			if ( params.endpoint ) {
				this.setState( {
					value: option,
				} );
			}

			const value = params.isMulti
				? option.map( opt => opt[ valueKey ] )
				: option[ valueKey ];

			onChange( value, option );
		}
	}

}

export default SelectField;
