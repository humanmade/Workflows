<?php
/**
 * Post owner recipient.
 *
 * @package Workflows
 */

namespace HM\Workflows;

require_once dirname( __DIR__ ) . '/events/transition-post-status.php';

function get_assignee( $post ) {
	return get_user_by( 'id', get_post_meta( get_post( $post )->ID, 'assignees', true ) );
}

// Add an assignee recipient handler to built in events.
Event::get( 'draft_to_pending' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_assignee',
		__( 'Assignees', 'hm-workflows' )
	);

Event::get( 'publish_post' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_assignee',
		__( 'Assignees', 'hm-workflows' )
	);

Event::get( 'publish_page' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_assignee',
		__( 'Assignees', 'hm-workflows' )
	);

/**
 * Add custom meta box for assignee.
 */

/**
 * Add the metabox.
 *
 * @param string $post_type
 */
function assignee_metabox( $post_type, $post ) {
	if ( ! in_array( $post_type, get_post_types( [ 'public' => true ] ), true ) ) {
		return;
	}

	add_meta_box(
		'hm.workflows.assignee',
		__( 'Workflow', 'hm-workflows' ),
		function ( $post ) {
			printf( '<div id="hm-workflows-comments" data-post-id="%d"></div>', $post->ID );
		},
		$post_type,
		'normal'
	);
}

add_action( 'add_meta_boxes', __NAMESPACE__ . '\assignee_metabox', 20, 2 );

/**
 * Register assignee meta.
 */
function assignee_api() {

	// Post assignees.
	register_meta( 'post', 'assignees', [
		'type'              => 'array',
		'items'             => [
			'type' => 'number',
		],
		'description'       => __( 'The assignees user IDs for this post.', 'hm-workflows' ),
		'single'            => false,
		'sanitize_callback' => function ( $value ) {
			return array_filter( array_map( 'absint', (array) $value ) );
		},
		'auth_callback'     => function ( $allowed, $post_id, $user_id ) {
			return user_can( $user_id, 'edit_post', $post_id );
		},
		'show_in_rest'      => true,
	] );

	// Editorial comment assignees.
	register_meta( 'comment', 'assignees', [
		'type'              => 'array',
		'items'             => [
			'type' => 'number',
		],
		'description'       => __( 'The assignees user IDs for this comment.', 'hm-workflows' ),
		'single'            => false,
		'sanitize_callback' => function ( $value ) {
			return array_filter( array_map( 'absint', (array) $value ) );
		},
		// 'auth_callback'     => function ( $allowed, $post_id, $user_id ) {
		// 	return user_can( $user_id, 'edit_post', $post_id );
		// },
		'show_in_rest'      => true,
	] );

}

add_action( 'rest_api_init', __NAMESPACE__ . '\rest_api' );
