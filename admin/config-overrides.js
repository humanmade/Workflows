const webpack = require( 'webpack' );
const { compose } = require( 'react-app-rewired' );
const rewireStyledComponents = require( 'react-app-rewire-styled-components' );
const rewireSVG = require( 'react-app-rewire-svg-react-loader' );
const DynamicPublicPathPlugin = require( 'dynamic-public-path-webpack-plugin' );
const SriPlugin = require( 'webpack-subresource-integrity' );

//  custom config
module.exports = function ( config, env ) {
	const rewires = compose(
		rewireStyledComponents,
		rewireSVG,
	);

	if ( env === 'production' ) {
		config.plugins.push( new DynamicPublicPathPlugin( {
			externalGlobal: 'window.HM.Workflows.BuildURL',
			chunkName: 'hm-workflows',
		} ) );
		config.plugins.push( new SriPlugin( {
			hashFuncNames: [ 'sha384' ],
			enabled: true,
		} ) );
	}

	// Override entry to customise entry file name.
	config.entry = { 'hm-workflows': config.entry };

	// Avoid code splitting conflicts.
	config.output.jsonpFunction = 'hmWorkflowsJSONP';

	// Only include credentials when loading assets from the same origin.
	config.output.crossOriginLoading = 'anonymous';

	// Set SC_ATTR env var.
	config.plugins.push( new webpack.EnvironmentPlugin( {
		SC_ATTR: 'data-styled-components-hm-workflows',
	} ) );

	return rewires( config, env );
}
