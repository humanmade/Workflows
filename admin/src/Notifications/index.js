/*global HM*/
import React from 'react';
import withFetch from '../withFetch';
import Portal from '../Portal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { injectGlobal } from 'styled-components';
import __ from '../l10n';

injectGlobal`
	#wpadminbar #wp-toolbar {
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
				color: inherit !important;
			}
		}
		
		.hm-workflows-notification-enter,
		.hm-workflows-notification-exit.hm-workflows-notification-exit-active {
			opacity: 0.01;
			left: 100%;
			position: relative;
			transition: left .3s ease-out, opacity .3s ease-out;
		}
		
		.hm-workflows-notification-exit,
		.hm-workflows-notification-enter.hm-workflows-notification-enter-active {
			opacity: 1;
			left: 0;
			position: relative;
			transition: left .3s ease-in, opacity .3s ease-in;
		}
		
		.hm-workflows-notification-actions {
			a {
				display: inline-block;
				margin-right: 10px;
				padding: 0;
				height: auto;
				
				&:before {
					margin-right: 0px;
					vertical-align: bottom;
				}
			}
			
			.notice-dismiss:before {
				background: none;
				color: #72777c;
				content: "\\f153";
				display: inline-block;
				font: normal 16px/20px dashicons;
				speak: none;
				height: 20px;
				text-align: center;
				width: 20px;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}
			
			.notice-dismiss:hover:before,
			.notice-dismiss:active:before,
			.notice-dismiss:focus:before {
				color: #c00;
			}
			
			.notice-dismiss:focus {
				outline: none;
				box-shadow: 0 0 0 1px #5b9dd9, 0 0 2px 1px rgba(30, 140, 190, .8);
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
					<div className="hm-workflows-notification">{__( 'You have no new notifications.' )}</div>
				</li>;
			}
			return null;
		}

		const items = [];
		const data = this.props.data instanceof Array ? this.props.data : [];

		items.push( <TransitionGroup key="items">
			{data.map( notification => {
				return <CSSTransition
					key={notification.id}
					timeout={300}
					classNames="hm-workflows-notification"
				>
					<li className={this.props.adminBar ? '' : 'notice notice-dismissable'}>
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
												{__( 'Read less' )}
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
											{__( 'Read more' )}
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
									{__( 'Dismiss' )}
								</a>
							</div>
						</div>
					</li>
				</CSSTransition>
			} )}
		</TransitionGroup> )

		if ( this.props.adminBar && ! data.length ) {
			items.push( <li key="empty">
				<div className="hm-workflows-notification">{__( 'You have no new notifications.' )}</div>
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
		credentials: 'include',
		headers:     {
			'X-WP-Nonce':   HM.Workflows.Nonce,
			'Content-type': 'application/json'
		}
	}
)( Notifications );

export default notificationsWithFetch;
