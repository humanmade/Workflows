/*global HM*/
import React from 'react';
import styled from 'styled-components';
import 'whatwg-fetch';

const StyledUser = styled.span`
	font-weight: bold;
	display: inline-block;
	font-style: normal;

	img {
		display: inline-block;
		margin-top: -2px;
		vertical-align: middle;
		margin-right: 5px;
		border-radius: 3px;
	}
`;

class User extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			loading: false,
			user: {},
		};
	}

	componentDidMount() {
		this.fetchUser();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.userId === this.props.userId ) {
			return;
		}

		this.fetchUser();
	}

	fetchUser() {
		const { userId } = this.props;
		const cachedUser = User.cache.find( user => user.id === userId )

		if ( cachedUser ) {
			this.setState( { user: cachedUser } );
			return;
		}

		this.setState( { loading: true } );

		fetch( `${HM.Workflows.Endpoints.WP}/users/${userId}`, {
			credentials: 'same-origin',
			headers: {
				'X-WP-Nonce': HM.Workflows.Nonce,
			}
		} )
			.then( response => response.json() )
			.then( user => {
				User.cache.push( user );
				this.setState( { user, loading: false } );
			} );
	}

	render() {
		const { user, loading } = this.state;

		return [
			<span
				key="loader"
				className="spinner is-active"
				style={{ display: loading ? "none" : "inline", position: "static", margin: 0, float: "none" }}
			/>,
			user.name && (
				<StyledUser key="user">
					<img src={ user.avatar_urls['24'] } alt="" />
					{ user.name }
				</StyledUser>
			),
		];
	}

}

User.cache = [];

export default User;
