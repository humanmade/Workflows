/*global HM*/
import React from 'react';
import { Async as AsyncSelect } from 'react-select';
import styled, { css } from 'styled-components';
import Errors from '../Errors';
import __ from '../l10n';

class Comments extends React.Component {

	constructor() {
		super();

		this.state = {
			loading:      false,
			saving:       false,
			errors:       [],
			comment:      '',
			comments:     [],
			assignees:    [],
			newAssignees: [],
		};
	}

	componentDidMount() {
		if ( ! this.props.postId ) {
			this.addError( 'no-post', __( 'Sorry! There was a problem determing which post to load editorial comments for.' ) );
			return;
		}

		// Fetch assignees.
		fetch( `${HM.Workflows.Endpoints.WP}/posts/${ this.props.postId }`, {
			credentials: 'same-origin',
			headers:     {
				'X-WP-Nonce': HM.Workflows.Nonce
			}
		} )
			.then( response => response.json() )
			.then( data => {
				const { assignees } = data;
				this.setState( { assignees } );
			} );

		// Fetch comments.
		fetch( `${HM.Workflows.Endpoints.WP}/comments?post=${ this.props.postId }&type=workflow`, {
			credentials: 'same-origin',
			headers:     {
				'X-WP-Nonce': HM.Workflows.Nonce
			}
		} )
			.then( response => response.json() )
			.then( data => {
				this.setState( { comments: data } );
			} );
	}

	addError( code, message ) {
		this.setState( {
			errors: this.state.errors.concat( [
				{ code, message }
			] )
		} );
	}

	updateErrors( condition, code ) {
		if ( condition ) {
			return this.state.errors.filter( error => error.code !== code );
		}
		return this.state.errors;
	}

	addComment( text, assignees ) {
		fetch( `${HM.Workflows.Endpoints.WP}/comments`, {
			method: 'post',
			credentials: 'same-origin',
			headers:     {
				'X-WP-Nonce': HM.Workflows.Nonce
			},
			body: JSON.stringify( {
				content: text,
				post: this.props.postId,
				author: HM.Workflows.User,
				type: 'workflow',
				meta: {
					assignees: this.state.newAssignees,
				},
			} )
		} )
			.then( response => response.json() )
			.then( data => {
				this.setState( { comments: data } );
			} );
	}

	render() {
		if ( ! this.props.postId ) {
			return (
				<Errors errors={ this.state.errors } />
			);
		}

		return (
			<div className="hm-workflows-comments">
				<div className="hm-workflows-comments-assignees">
					<h3>{ __( 'Currently assigned to' ) }:</h3>
					<ul>
						<li></li>
					</ul>
				</div>
				<div className="hm-workflows-comment-form">
					<textarea
						rows="2"
						cols="100%"
						onChange={ e => this.setState( { comment: e.target.value } ) }
					>
						{ this.state.comment }
					</textarea>
					<AsyncSelect
						placeholder={ __( 'Assignees - No change' ) }
						options={ [] }
						multi={true}
						autoload={true}
						loadOptions={ input => fetch( `${HM.Workflows.Endpoints.WP}/users?search=${encodeURIComponent( input )}`, {
								credentials: 'same-origin',
								headers:     {
									'X-WP-Nonce': HM.Workflows.Nonce
								}
							} )
								.then( response => response.json() )
								.then( data => ( { options: data } ) )
						}
						value={ this.state.newassignees }
						labelKey="name"
						valueKey="id"
						onChange={ options => this.setState( {
							assignees: options
						} ) }
					/>
					<button className={`button button-primary`} disabled={ this.state.comment === '' && this.state.newAssignees === this.state.assignees }>
						{ this.state.comment && __( 'Comment' ) }
						{ ' ' }
						{ this.state.comment === '' && this.state.newAssignees === this.state.assignees && __( 'or' ) }
						{ this.state.comment && this.state.newAssignees !== this.state.assignees && __( 'and' ) }
						{ ' ' }
						{ this.state.newAssignees !== this.state.assignees && __( 'Assign' ) }
					</button>
				</div>
				<div className="hm-workflows-comments-list">
					<ol>
						<li>
							<div>
								<div>user</div>
								<time>date</time>
							</div>
							<p>comment</p>
							<div className="">assigned to</div>
						</li>
					</ol>
				</div>
			</div>
		);
	}

}

export default Comments;
