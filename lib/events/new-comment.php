<?php
/**
 * Built in event for new comments.
 */

namespace HM\Workflows;

use WP_Comment;

Event::register( 'published_comment' )
	->add_ui( __( 'A new comment is published', 'hm-workflows' ) )
	->set_listener( [
		'action'        => 'wp_insert_comment',
		'callback'      => function ( $id, WP_Comment $comment ) {
			// The default comment type is an empty string. Ignore any other comment types.
			if ( $comment->comment_type !== '' ) {
				return null;
			}

			// Ignore unapproved comments.
			if ( $comment->comment_approved !== '1' ) {
				return null;
			}

			return $comment;
		},
		'accepted_args' => 2,
	] )
	->add_message_tags( [
		'comment.author' => function ( WP_Comment $comment ) : string {
			return $comment->comment_author;
		},
		'comment.text'   => function ( WP_Comment $comment ) : string {
			return $comment->comment_content;
		},
		'comment.url'    => function ( WP_Comment $comment ) : string {
			return get_comment_link( $comment );
		},
		'post.title'     => function ( WP_Comment $comment ) : string {
			return get_post( $comment->comment_post_ID )->post_title;
		},
		'post.url'       => function ( WP_Comment $comment ) : string {
			return get_permalink( $comment->comment_post_ID );
		},
	] )
	->add_message_action(
		'view',
		__( 'View comment', 'hm-workflows' ),
		function ( int $comment_id ) : string {
			return get_comment_link( $comment_id );
		},
		function ( WP_Comment $comment ) : array {
			return [
				'comment_id' => $comment->comment_ID,
			];
		},
		[
			'comment_id' => 'intval',
		]
	);
