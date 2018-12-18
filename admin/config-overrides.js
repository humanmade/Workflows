const webpack = require( 'webpack' );
const { compose } = require( 'react-app-rewired' );
const rewireStyledComponents = require( 'react-app-rewire-styled-components' );
const rewireSVG = require( 'react-app-rewire-svg-react-loader' );

//  custom config
module.exports = function ( config, env ) {
	const rewires = compose(
		rewireStyledComponents,
		rewireSVG,
	);

	// Set SC_ATTR env var.
	config.plugins.push( new webpack.EnvironmentPlugin( {
		SC_ATTR: 'data-styled-components-hm-workflows',
	} ) );

	// Set externals.
	config.externals = Object.assign( config.externals || {}, {
		HM: 'HM',
	} );

	return rewires( config, env );
}
