import React from 'react';
import Field from './Field';
import { ContentState, Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled from 'styled-components';

const StyledEditor = styled.div`
	.DraftEditor-root {
		border: 1px solid #ccc;
		background: #fff;
		padding: 8px;
		min-height: 4em;
	}
`

class Textarea extends Field {

	constructor( props ) {
		super( props );

		this.state = {
			editorState: EditorState.createWithContent( ContentState.createFromText( props.value ) )
		};
	}

	input( props = {} ) {
		return <StyledEditor key="input">
			<Editor
				key="input"
				id={this.props.name}
				name={this.props.name}
				onChange={this.onChange.bind(this)}
				{...props.params}
			/>
		</StyledEditor>;
	}

	onChange( editorState ) {
		this.setState( { editorState } );

		if ( this.props.onChange ) {
			this.props.onChange( editorState.getCurrentContent().getPlainText() );
		}
	}

}

export default Textarea;
