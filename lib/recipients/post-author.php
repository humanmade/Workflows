<?php
/**
 * Post owner recipient.
 *
 * @package Workflows
 */

namespace HM\Workflows;

use WP_Comment;

function get_author( $post ) {
	return get_user_by( 'id', get_post( $post )->post_author );
}

// Add an author recipient handler to built in events.
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

Event::get( 'published_comment' )
	->add_recipient_handler(
		'post_author',
		function( WP_Comment $comment ) {
			$author = get_author( $comment->comment_post_ID );

			// Don't notify the post author about their own comments:
			if ( $author->ID === $comment->user_id ) {
				return null;
			}

			return $author;
		},
		__( 'Post author', 'hm-workflows' )
	);
