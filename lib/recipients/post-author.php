<?php
/**
 * Post owner recipient.
 *
 * @package Workflows
 */

namespace HM\Workflows;

require_once dirname( __DIR__ ) . '/events/transition-post-status.php';

function get_author( $post ) {
	return get_user_by( 'id', get_post( $post )->post_author );
}

// Add an assignee recipient handler to built in events.
Event::get( 'draft_to_pending' )
	->add_recipient_handler(
		'post_author',
		__NAMESPACE__ . '\get_author',
		__( 'Post author', 'hm-workflows' )
	);

Event::get( 'publish_post' )
	->add_recipient_handler(
		'post_author',
		__NAMESPACE__ . '\get_author',
		__( 'Post author', 'hm-workflows' )
	);

Event::get( 'publish_page' )
	->add_recipient_handler(
		'post_author',
		__NAMESPACE__ . '\get_author',
		__( 'Post author', 'hm-workflows' )
	);
