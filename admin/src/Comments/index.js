/*global HM*/
import React from 'react';
import { Async as AsyncSelect } from 'react-select';
import styled from 'styled-components';
import Errors from '../Errors';
import UserList from './UserList';
import __ from '../l10n';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';
import 'whatwg-fetch';
import 'react-select/dist/react-select.css';

const CommentsWrap = styled.div`
	max-width: 640px;
`;

const Assignees = styled.div`
	display: flex;
	align-items: flex-start;

	p {
		flex: none;
		margin-right: 16px;
	}

	ul {
		flex: 1;
	}

	.components-button {
		margin-top: 14px;
	}
`;

const Form = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin: 8px 0;

	.button {
		flex: 0;
		margin-left: 8px;
		height: auto;
		padding: 3px 12px;
	}

	.Select {
		flex: 1;
	}
`;

const CommentBox = styled.textarea`
	width: 100%;
	padding: 8px;
	border-radius: 2px;
	font-size: 16px;
	margin-bottom: 8px;
	flex: none;
`;

const CommentsList = styled.ol`
	list-style: none;
	margin: 32px 0 16px;
	padding: 0;
`;

const Comment = styled.li`
	margin: 16px 0;
	padding: 0;
	& + li {
		border-top: 1px solid #dedede;
		padding-top: 16px;
	}

	header {
		div {
			display: inline;
			margin-right: 16px;
			font-size: 14px;
			font-weight: bold;

			img {
				margin-right: 8px;
				float: left;
				border-radius: 3px;
			}
		}

		time {
			flex: none;
			font-size: 13px;
			color: #555d66;
		}
	}

	.hm-workflows-comments-comment-body {
		margin-left: 56px;
		font-size: 14px;
	}

	.hm-workflows-comments-comment-assignees {
		margin-left: 56px;
		font-style: italic;
		font-size: 13px;

		img {
			width: 18px;
			height: 18px;
		}
	}
`;

class Comments extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			loading:      false,
			saving:       false,
			errors:       [],
			comment:      '',
			comments:     [],
			assignees:    [],
			newAssignees: [],
			page:         1,
			newComments:  0,
		};
	}

	componentDidMount() {
		if ( ! this.props.postId ) {
			this.addError( 'no-post', __( 'Sorry! There was a problem determing which post to load editorial comments for.' ) );
			return;
		}

		// Fetch assignees.
		this.fetchAssignees();

		// Fetch comments.
		this.fetchComments();
	}

	fetchAssignees() {
		fetch( `${HM.Workflows.Namespace}/assignees/${this.props.postId}`, {
			credentials: 'same-origin',
			headers: {
				'X-WP-Nonce': HM.Workflows.Nonce
			},
		} )
			.then( response => response.json() )
			.then( data => {
				if ( ! data || ! Array.isArray( data ) ) {
					return;
				}

				const assignees = data;
				this.setState( { assignees } );
			} );
	}

	fetchComments() {
		const { comments, page, newComments } = this.state;

		this.setState( { loading: true } );

		fetch( `${HM.Workflows.Namespace}/comments?post=${ this.props.postId }&per_page=3&offset=${ ( ( page - 1 ) * 3 ) + newComments }`, {
			credentials: 'same-origin',
			headers: {
				'X-WP-Nonce': HM.Workflows.Nonce
			},
		} )
			.then( response => response.json() )
			.then( data => {
				if ( ! Array.isArray( data ) ) {
					return;
				}

				const updatedComments = comments.concat( data );

				this.setState( { comments: updatedComments, loading: false } );
			} );
	}

	addError( code, message ) {
		this.setState( {
			errors: this.state.errors.concat( [
				{ code, message }
			] )
		} );
	}

	onSubmit( event ) {
		event.preventDefault();

		this.setState( { errors: [] } );

		if ( this.state.comment ) {
			this.addComment();
		}
		if ( this.state.newAssignees.length > 0 ) {
			this.updateAssignees();
		}
	}

	addComment() {
		const body = {
			content: this.state.comment,
			post: this.props.postId,
			author: HM.Workflows.User,
			status: 'approved',
		};

		if ( this.state.newAssignees.length > 0 ) {
			body.meta = {
				assignees: this.state.newAssignees,
			};
		}

		fetch( `${HM.Workflows.Namespace}/comments?context=edit`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'X-WP-Nonce': HM.Workflows.Nonce,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
		} )
			.then( response => response.json() )
			.then( data => {
				if ( data.code && data.message ) {
					this.addError( data.code, data.message );
					return;
				}

				const { comments, newComments } = this.state;
				comments.unshift( data );
				this.setState( { comments, comment: '', newComments: newComments + 1 } );
			} );
	}

	updateAssignees() {
		const { newAssignees } = this.state;

		fetch( `${HM.Workflows.Namespace}/assignees/${this.props.postId}`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'X-WP-Nonce': HM.Workflows.Nonce,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {
				assignees: this.state.newAssignees,
			} ),
		} )
			.then( response => response.json() )
			.then( data => {
				if ( ! data || ! Array.isArray( data ) ) {
					return;
				}

				this.setState( { assignees: newAssignees, newAssignees: [] } );
			} );
	}

	render() {
		const { postId } = this.props;
		const { errors, assignees, newAssignees, comment, comments, page, loading, newComments } = this.state;

		if ( ! postId ) {
			return (
				<Errors errors={ errors } />
			);
		}

		return (
			<CommentsWrap className="hm-workflows-comments">
				{ assignees.length > 0 && (
					<Assignees className="hm-workflows-comments-assignees" aria-live="polite">
						<p><em>{ __( 'Currently assigned to' ) }:</em></p>
						<UserList userIds={ assignees } />
						<button
							className={`components-button is-link is-destructive`}
							onClick={ e => {
								this.setState( { newAssignees: [] } );
								this.updateAssignees();
							} }
							type="button"
						>
							{  __( 'Clear', 'hm-workflows' ) }
						</button>
					</Assignees>
				) }
				{ assignees.length === 0 && (
					<Assignees className="hm-workflows-comments-assignees" aria-live="polite">
						<p><em>{ __( 'Currently unassigned' ) }</em></p>
					</Assignees>
				) }
				<Form className="hm-workflows-comment-form">
					<Errors errors={ errors } />
					<CommentBox
						rows="2"
						cols="100%"
						onChange={ e => this.setState( { comment: e.target.value, errors: [] } ) }
						placeholder={ __( 'What needs to be done next?' ) }
						value={ comment }
					/>
					<AsyncSelect
						placeholder={ __( 'Assignees - No change' ) }
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
						value={ this.state.newAssignees }
						labelKey="name"
						valueKey="id"
						onChange={ options => this.setState( {
							newAssignees: options.map( opt => opt.id ),
							errors: [],
						} ) }
					/>
					<button
						className={`button button-primary`}
						disabled={ ! comment }
						onClick={ e => this.onSubmit( e ) }
						type="button"
					>
						{ ! comment && __( 'Comment and Assign' ) }
						{ comment && newAssignees.length === 0 && __( 'Comment' ) }
						{ comment && newAssignees.length > 0 && __( 'Comment and Assign' ) }
					</button>
				</Form>
				<CommentsList className="hm-workflows-comments-list" aria-live="polite">
					{ comments.map( editorialComment => (
						<Comment key={ editorialComment.id }>
							<header className="hm-workflows-comments-comment-header">
								<div className="hm-workflows-comments-comment-author">
									{ editorialComment.author_avatar_urls['48'] && <img src={ editorialComment.author_avatar_urls['48'] } alt="" /> }
									{ editorialComment.author_name }
								</div>
								<time>{ moment.utc( editorialComment.date ).fromNow() }</time>
							</header>
							<div className="hm-workflows-comments-comment-body">
								{ ReactHtmlParser( editorialComment.content.rendered ) }
							</div>
							{ editorialComment.meta && editorialComment.meta.assignees.length > 0 && (
								<div className="hm-workflows-comments-comment-assignees">
									{ __( 'Assigned to' ) }
									{ ' ' }
									<UserList userIds={ editorialComment.meta.assignees } />
								</div>
							) }
						</Comment>
					) ) }
					{ comments.length - newComments - ( ( page - 1 ) * 3 ) === 3 && ! loading && (
						<li>
							<button
								className="button button-secondary"
								onClick={ () => {
									this.setState( { page: page + 1 }, () => {
										this.fetchComments();
									} );
								} }
							>
								{ __( 'Show more comments' ) }
							</button>
						</li>
					) }
					<li>
						<span
							className="spinner is-active"
							style={{
								position: "static",
								display: loading ? "block" : "none",
								float: "none",
								margin: "0",
							}}
						/>
					</li>
				</CommentsList>
			</CommentsWrap>
		);
	}

}

export default Comments;
