import React from 'react';
import {
	Editor,
	EditorState,
	ContentState,
	CompositeDecorator
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled, { css } from 'styled-components';
import { insertEntity } from './functions';

const StyledEditor = styled.div`
	.editor-tags {
		margin-top: 5px;
		.button {
			margin-right: 5px;
		}
	}
	.DraftEditor-root {
		border: 1px solid #ccc;
		background: #fff;
		padding: 8px;
		${ props => props.type === 'textarea' && css`
			min-height: 4em;
		` }
	}
`

const Tag = props => <span className={props.className}>{props.children}</span>;
const StyledTag = styled( Tag )`
	background: #f9f9f9;
	font-family: Consolas, monospace;
	padding: 2px;
`

class WorkflowEditor extends React.Component {

	constructor( props ) {
		super( props );

		if ( props.content ) {
			this.state = {
				editorState: EditorState.createWithContent( ContentState.createFromText( props.content ) )
			}
		} else {
			this.state = { editorState: EditorState.createEmpty() }
		}

		// Move default selection to end of text.
		this.state.editorState = EditorState.moveSelectionToEnd( this.state.editorState );

		this.focus = () => this.refs.editor.focus();

		this.onChange = editorState => {
			this.setState( { editorState } )

			// Update outer item.
			if ( props.onChange ) {
				props.onChange( editorState.getCurrentContent().getPlainText() )
			}
		}

		// Decorators collection.
		this.decorators = [];

		// Add tags entity decorator.
		this.decorators.push(
			{
				strategy: ( contentBlock, callback, contentState ) => {
					contentBlock.findEntityRanges(
						(character) => {
							const entityKey = character.getEntity();
							if (entityKey === null) {
								return false;
							}
							return contentState.getEntity(entityKey).getType() === 'TAG';
						},
						callback
					);
				},
				component: StyledTag,
			}
		);

		// Add tag decorator.
		this.state.editorState = EditorState.set( this.state.editorState, {
			decorator: new CompositeDecorator( this.decorators ),
		} );
	}

	componentWillReceiveProps( nextProps ) {
		// Update the editor if the default content prop changes.
		if ( nextProps.content !== this.props.content ) {
			this.setState( {
				editorState: EditorState.moveSelectionToEnd(
					EditorState.createWithContent(
						ContentState.createFromText( nextProps.content ),
						new CompositeDecorator( this.decorators )
					)
				)
			} );
		}
	}

	tags() {
		return this.props.tags &&
			<div className="editor-tags">
				{ this.props.tags.map( tag => {
					return <button key={tag} type="button" className="button" onClick={event => {
						event.preventDefault();
						this.setState( {
							editorState: insertEntity( this.state.editorState, [ 'TAG', 'IMMUTABLE', { tag } ], `%${ tag }%` ),
						}, () => {
							setTimeout( this.focus, 0 );
						} );
					}}>%{tag}%</button>
				} ) }
			</div>;
	}

	render() {
		return <StyledEditor
			type={this.props.type || 'textarea'}
			className={this.props.className}
		>
			<Editor
				id={this.props.id}
				ref="editor"
				placeholder={this.props.placeholder}
				name={this.props.name}
				editorState={this.state.editorState}
				onChange={this.onChange}
			/>
			{this.tags()}
		</StyledEditor>
	}

}

export default WorkflowEditor;
