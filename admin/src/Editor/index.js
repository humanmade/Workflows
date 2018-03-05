import React from 'react';
import {
	Editor,
	EditorState,
	ContentState,
	Modifier,
	CompositeDecorator
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled, { css } from 'styled-components';

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

		// Add tags entity decorator.
		if ( props.tags ) {
			const tagDecorator = new CompositeDecorator( [
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
			] );

			// Add tag decorator.
			this.state.editorState = EditorState.set( this.state.editorState, { decorator: tagDecorator } );
		}
	}

	tags() {
		return this.props.tags &&
			<div className="editor-tags">
				{ this.props.tags.map( tag => {
					return <button key={tag} type="button" className="button" onClick={event => {
						event.preventDefault();

						const editorState = this.state.editorState;
						const contentState = editorState.getCurrentContent();
						const selection = editorState.getSelection();

						// If there's a character immediately before the insert add a space between that and the tag.
						const characterBefore = contentState.getPlainText()[ selection.getStartOffset() - 1 ];
						const contentStateWithSpaceBefore = !!characterBefore && characterBefore.match( /\S+/ )
							? Modifier.insertText(
									contentState,
									selection,
									' '
								)
							: contentState;

						const editorStateWithSpace = EditorState.push( editorState, contentStateWithSpaceBefore, 'insert-text' );

						const contentWithEntity = contentStateWithSpaceBefore.createEntity( 'TAG', 'IMMUTABLE', {
							tag
						} );

						const tagEntity = contentWithEntity.getLastCreatedEntityKey();

						// Add the tag.
						const contentStateWithTag = Modifier.replaceText(
							contentWithEntity,
							editorStateWithSpace.getSelection(),
							`%${ tag }%`,
							editorState.getCurrentInlineStyle(),
							tagEntity
						);

						const editorStateWithTag = EditorState.push( editorStateWithSpace, contentStateWithTag, 'apply-entity' );

						// Add a space after the tag.
						const contentStateWithSpaceAfter = Modifier.insertText(
							contentStateWithTag,
							editorStateWithTag.getSelection(),
							' '
						);

						const editorStateWithSpaceAfter = EditorState.push(
							editorStateWithTag,
							contentStateWithSpaceAfter,
							'insert-text'
						);

						// Update content.
						this.setState( {
							editorState: editorStateWithSpaceAfter,
						}, () => {
							setTimeout( this.focus, 0 );
						} );
					}}>%{tag}%</button>
				} ) }
			</div>;
	}

	render() {
		// Output insert tags.

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
