import React from 'react';
import styled from 'styled-components';

const StyledLoading = styled.div`
	.spinner {
		display: block;
		float: none;
		margin: 30px auto;
	}
`

const Loading = ({ isLoading, error }) => {
	if ( isLoading ) {
		return <StyledLoading>
			<span className="spinner is-active" />
		</StyledLoading>;
	}

	if ( error ) {
		return <StyledLoading>
			<div className="notice notice-error">There was an error loading the plugin UI</div>
		</StyledLoading>;
	}

	return null;
};

export default Loading;
