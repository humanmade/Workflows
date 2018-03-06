import { EditorState, Modifier } from "draft-js"

export const insertEntity = (editorState, entity, text) => {
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

	const contentWithEntity = contentStateWithSpaceBefore.createEntity( ...entity );

	const tagEntity = contentWithEntity.getLastCreatedEntityKey();

	// Add the tag.
	const contentStateWithTag = Modifier.replaceText(
		contentWithEntity,
		editorStateWithSpace.getSelection(),
		text,
		editorState.getCurrentInlineStyle(),
		tagEntity
	);

	const editorStateWithTag = EditorState.push( editorStateWithSpace, contentStateWithTag, 'replace-text' );

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

	return editorStateWithSpaceAfter;
}
