import 'whatwg-fetch';
import React from 'react';
import sh from 'shorthash';

/**
 * Fetch HoC using localStorage.
 */
const withFetch = ( url, options = {}, name = null ) => {
	// Store key without expiration.
	const key = `${url}:${sh.unique(JSON.stringify({ ...options, expires: 0}))}`;
	// HoC.
	return Component => {
		class fetchComponent extends React.Component {
			constructor() {
				super();

				// eslint-disable-next-line
				this.state = {
					loading:  true,  // Initial load indicator.
					fetching: false, // Refetch indicator.
					expires:  0,
					data:     {},
					error:    false,
				};

				// Timer reference.
				this.timer = null;

				this.doFetch = this.doFetch.bind( this );
			}

			componentDidMount() {
				if ( this.state.expires > Date.now() ) {
					return;
				}

				if ( this.timer ) {
					clearTimeout( this.timer );
				}

				const item = this.getStore();
				if ( item ) {
					this.setState( item );
				}

				this.setState( { loading: true } );
				this.doFetch();
			}

			doFetch( overrides = {} ) {
				this.setState( { fetching: true } );

				const fetchOptions = Object.assign( {}, options, overrides );
				let fetchURL = url;

				if ( options.expires && ! fetchOptions.method ) {
					fetchURL += ( fetchURL.indexOf( '?' ) >= 0 ? `&ts=` : '?ts=' ) + Date.now();
				}

				fetch( fetchURL, fetchOptions )
					.then( response => response.json() )
					.then( data => this.updateStore( data ) )
					.catch( error => this.updateStore( {}, error ) );
			}

			getStore() {
				const store = JSON.parse( window.localStorage.getItem( `withFetch(${key})` ) );
				return store || null;
			}

			updateStore( data, error = false ) {
				const update = {
					data,
					error,
					loading: false,
					fetching: false,
					expires: Date.now() + ( options.expires || ( 5 * 60 * 1000 ) ) // 5 minutes.
				};

				// Add a timeout to update the data after expiry time.
				if ( options.expires && !error ) {
					if ( this.timer ) {
						clearTimeout( this.timer );
					}
					this.timer = setTimeout( this.doFetch, parseInt( options.expires, 10 ) );
				}

				// Update store.
				const store = JSON.parse( window.localStorage.getItem( `withFetch(${key})` ) );
				window.localStorage.setItem( `withFetch(${key})`, JSON.stringify( Object.assign( store || {}, update ) ) );

				// Update state.
				this.setState( update );
			}

			render() {
				let state = Object.assign( {}, this.state, {
					refetch: ( overrides = {} ) => this.doFetch( overrides ),
				} );

				// Add state under named prop if set.
				if ( name ) {
					state = { [name]: state };
				}

				return <Component key="withFetch" {...state} {...this.props} />;
			}
		}

		// Set a nice display name.
		fetchComponent.displayName = `withFetch(${url})(${Component.displayName || Component.name || 'Component'})`;

		return fetchComponent;
	}
}

export default withFetch;
