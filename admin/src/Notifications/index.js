/*global HM*/
import React from 'react';
import withFetch from '../withFetch';
import Portal from '../Portal';
import { injectGlobal } from 'styled-components';

injectGlobal`
	#wpwrap #wpadminbar {
		.hm-workflows-notifications-badge {
			border-radius: 100px;
			background: orange;
			color: #fff;
			display: inline-block;
			margin-left: 5px;
			padding: 0 4px;
			min-width: 22px;
			height: 22px;
			vertical-align: baseline;
			line-height: 22px;
			text-align: center;
			box-sizing: border-box;
		}
		
		.hm-workflows-notification {
			padding: 5px 10px;
			* {
				line-height: 1.4;
			}
	
			h4 {
				font-weight: bold;
				margin: 0 0 5px;
			}
		}
		
		.hm-workflows-notification-actions {
			a {
				display: inline-block;
				margin-right: 10px;
				padding: 0;
				height: auto;
				
				&:before {
					margin-right: 0px;
					display: inline-block;
					vertical-align: bottom;
				}
			}
		}
	}
`

class Notifications extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			expanded: [],
			errors:   [],
		};
	}

	delete( id ) {
		fetch( `${HM.Workflows.Namespace}/notifications/${HM.Workflows.User}/${ id }`, {
			method:      'DELETE',
			credentials: 'same-origin',
			headers:     {
				'X-WP-Nonce':   HM.Workflows.Nonce,
				'Content-type': 'application/json'
			}
		} )
			.then( () => this.props.refetch() );
	}

	render() {
		if ( this.props.loading ) {
			if ( this.props.adminBar ) {
				return <li>
					<div className="hm-workflows-notification">You have no new notifications.</div>
				</li>;
			}
			return null;
		}

		const items = [];
		const data = this.props.data instanceof Array ? this.props.data : [];

		data.forEach( notification => {
			items.push( <li key={notification.id} className={this.props.adminBar ? '' : 'notice notice-dismissable'}>
				<div className="hm-workflows-notification">
					<h4>{notification.subject}</h4>
					{notification.text && <div className="hm-workflows-notification-message">
						{this.state.expanded.indexOf( notification.id ) >= 0
							? [
								<p key="message">{notification.text}</p>,
								<p key="close" className="hm-workflows-notification-actions">
									<a
										href="#hm-notification-message-close"
										onClick={e => {
											e.preventDefault();
											this.setState( {
												expanded: this.state.expanded.filter( id => id !== notification.id )
											} )
										}}
									>
										Read less
									</a>
								</p>
							]
							: <p className="hm-workflows-notification-actions">
								<a
									href="#hm-notification-message-open"
									onClick={e => {
										e.preventDefault();
										this.setState( {
											expanded: this.state.expanded.concat( [ notification.id ] )
										} );
									}}
								>
									Read more
								</a>
							</p>
						}
					</div>}
					<div className="hm-workflows-notification-actions">
						{notification.actions.map( action => {
							return <a key={action.id} href={action.url}>{action.text}</a>;
						} )}
						<a
							className="notice-dismiss"
							href="#hm-notification-delete"
							onClick={e => {
								e.preventDefault();
								this.delete( notification.id );
							}}
						>
							Dismiss
						</a>
					</div>
				</div>
			</li> );
		} );

		if ( this.props.adminBar && ! data.length ) {
			items.push( <li key="empty">
				<div className="hm-workflows-notification">You have no new notifications.</div>
			</li> );
		}

		// Add badge.
		if ( this.props.adminBar && data.length ) {
			items.push( <Portal key="badge" target="#wp-admin-bar-hm-workflows-user-notifications-bar > .ab-item">
				{' '}
				<span className="hm-workflows-notifications-badge">
					{data.length}
				</span>
			</Portal> );
		}

		return items;
	}
}

const notificationsWithFetch = withFetch(
	`${HM.Workflows.Namespace}/notifications/${HM.Workflows.User}`,
	{
		expires:     30 * 1000,
		credentials: 'same-origin',
		headers:     {
			'X-WP-Nonce':   HM.Workflows.Nonce,
			'Content-type': 'application/json'
		}
	}
)( Notifications );

export default notificationsWithFetch;
