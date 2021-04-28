/*global HM*/
import React from 'react';
import withFetch from '../withFetch';
import Portal from '../Portal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReactHtmlParser from 'react-html-parser';
import __ from '../l10n';

import './index.css';

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
		const items = [];
		const data  = this.props.data instanceof Array ? this.props.data : [];

		// Add badge.
		if ( this.props.adminBar ) {
			const badgeClasses = [
				'hm-workflows-notifications-badge',
				'wp-ui-notification'
			];

			if ( data.length > 0 ) {
				badgeClasses.push( 'hm-workflows-notifications-badge--has-items' );
			}

			items.push( <Portal key="badge" target="#wp-admin-bar-hm-workflows-user-notifications-bar > .ab-item">
				{' '}
				<span className={badgeClasses.join(' ')}>
					{data.length}
				</span>
			</Portal> );
		}

		if ( this.props.adminBar && ! data.length ) {
			items.push( <li key="empty">
				<div className="hm-workflows-notification">{__( 'You have no new notifications.' )}</div>
			</li> );
		}

		if ( this.props.loading ) {
			return items;
		}

		items.push( <TransitionGroup key="items">
			{data.map( notification => {
				return <CSSTransition
					key={notification.id}
					timeout={300}
					classNames="hm-workflows-notification"
				>
					<li className={this.props.adminBar ? '' : 'notice notice-dismissable'}>
						<div className="hm-workflows-notification">
							<h4>{ReactHtmlParser( notification.subject )}</h4>
							{notification.text && <div className="hm-workflows-notification-message">
								{this.state.expanded.indexOf( notification.id ) >= 0
									? [
										<p key="message">{ReactHtmlParser( notification.text )}</p>,
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
		</TransitionGroup> );

		return items;
	}
}

const notificationsWithFetch = withFetch(
	`${HM.Workflows.Namespace}/notifications/${HM.Workflows.User}`,
	{
		expires:     60 * 1000,
		credentials: 'include',
		headers:     {
			'X-WP-Nonce':   HM.Workflows.Nonce,
			'Content-type': 'application/json'
		}
	}
)( Notifications );

export default notificationsWithFetch;
