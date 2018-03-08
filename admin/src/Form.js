/*global HM*/
import React from 'react';
import './Fields';
import styled from 'styled-components';

const Field = styled.div`
	margin: 0 auto 1em;
	padding: 8px 0;
	
	label {
		font-weight: bold;
		display: block;
	}
	
	input[type="text"],
	input[type="url"],
	input[type="number"] {
		padding: 8px;
	}
`

class Form extends React.Component {

	render() {
		const items = [];

		if ( this.props.description ) {
			items.push( <p key="ui-description" className="description">{this.props.description}</p> );
		}

		this.props.fields.forEach( field => {
			const Input = HM.Workflows.Fields[ field.type || 'text' ];

			if ( ! Input ) {
				return null;
			}

			items.push( <Field key={field.name} type={field.type || 'text'}>
				<Input
					{...field}
					value={this.props.data[ field.name ]}
					onChange={value => this.props.onChange( value, field )}
				/>
			</Field> );
		} );

		return items;
	}

}

export default Form;
