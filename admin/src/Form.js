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
`

class Form extends React.Component {

	render() {
		return this.props.fields.map( field => {
			const Input = HM.Workflows.Fields[ field.type || 'text' ];

			if ( ! Input ) {
				return null;
			}

			return <Field key={field.name} type={field.type || 'text'}>
				<Input
					{...field}
					value={this.props.data[ field.name ]}
					onChange={value => this.props.onChange( value, field )}
				/>
			</Field>
		} )
	}

}

export default Form;
