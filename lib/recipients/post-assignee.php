<?php
/**
 * Post owner recipient.
 *
 * @package Workflows
 */

namespace HM\Workflows;

/**
 * Get assigned user IDs for a post.
 *
 * @param WP_Post|int $post Post object or ID.
 * @return array
 */
function get_post_assignees( $post ) {
	$assignees = get_post_meta( get_post( $post )->ID, 'assignees', true );
	return array_map( function ( $user_id ) {
		return get_user_by( 'id', $user_id );
	}, $assignees );
}

// Add an assignee recipient handler to built in events.
Event::get( 'draft_to_pending' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_post_assignees',
		__( 'Assignees', 'hm-workflows' )
	);

Event::get( 'publish_post' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_post_assignees',
		__( 'Assignees', 'hm-workflows' )
	);

Event::get( 'publish_page' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_post_assignees',
		__( 'Assignees', 'hm-workflows' )
	);
