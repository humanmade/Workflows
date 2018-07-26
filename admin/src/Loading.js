import React from 'react';
import __ from './l10n';

const spinnerStyles = {
	display: "block",
	float: "none",
	margin: "30px auto",
};

const Loading = ({ isLoading, error }) => {
	if ( isLoading ) {
		return <span className="spinner is-active" style={spinnerStyles} />;
	}

	if ( error ) {
		return (
			<div className="notice notice-error">
				<p>{ __( 'There was an error loading the plugin UI.' ) }</p>
			</div>
		);
	}

	return null;
};

export default Loading;
