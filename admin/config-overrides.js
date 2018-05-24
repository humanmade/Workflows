const { compose } = require( 'react-app-rewired' );
const rewireStyledComponents = require( 'react-app-rewire-styled-components' );
const rewireSVG = require( 'react-app-rewire-svg-react-loader' );
const DynamicPublicPathPlugin = require('dynamic-public-path-webpack-plugin');

//  custom config
module.exports = function ( config, env ) {
	const rewires = compose(
		rewireStyledComponents,
		rewireSVG,
	);

	config.plugins.push( new DynamicPublicPathPlugin( {
		externalGlobal: 'window.HM.Workflows.BuildURL', //Your global variable name.
		chunkName: 'hm-workflows',
	} ) );

	config.entry = { 'hm-workflows': config.entry };

	return rewires( config, env );
}
