const { compose } = require( 'react-app-rewired' );
const rewireStyledComponents = require( 'react-app-rewire-styled-components' );
const rewireSVG = require( 'react-app-rewire-svg-react-loader' );

//  custom config
module.exports = function ( config, env ) {
	const rewires = compose(
		rewireStyledComponents,
		rewireSVG,
	);

	return rewires( config, env );
}
