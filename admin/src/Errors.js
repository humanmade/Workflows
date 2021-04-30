import React from 'react';
import styled from 'styled-components';

const StyledErrors = styled.div`
	margin: 10px 0;
`

const Errors = ({ errors = [] }) => errors.length
	? <StyledErrors>
			<ul aria-live="polite">
				{errors.map( error => <li key={error.code} className="notice notice-error"><p>{error.message}</p></li> )}
			</ul>
		</StyledErrors>
	: null;

export default Errors;
