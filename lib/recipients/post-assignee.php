<?php
/**
 * Post owner recipient.
 *
 * @package Workflows
 */

namespace HM\Workflows;

require_once dirname( __DIR__ ) . '/events/transition-post-status.php';

function get_assignee( $post ) {
	return get_user_by( 'id', get_post_meta( get_post( $post )->ID, 'hm.workflows.assignee', true ) );
}

// Add an assignee recipient handler to built in events.
Event::get( 'draft_to_pending' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_assignee',
		__( 'Assignee', 'hm-workflows' )
	);

Event::get( 'publish_post' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_assignee',
		__( 'Assignee', 'hm-workflows' )
	);

Event::get( 'publish_page' )
	->add_recipient_handler(
		'assignee',
		__NAMESPACE__ . '\get_assignee',
		__( 'Assignee', 'hm-workflows' )
	);

/**
 * Add custom meta box for assignee.
 */

/**
 * Add the metabox.
 *
 * @param string $post_type
 */
function assignee_metabox( $post_type ) {
	if ( ! in_array( $post_type, get_post_types( [ 'public' => true ] ), true ) ) {
		return;
	}

	add_meta_box(
		'hm.workflows.assignee',
		__( 'Assignees', 'hm-workflows' ),
		function ( $post ) {
			printf(
				'<p class="description">%s</p>',
				esc_html__( 'Assignees are responsible for this content and can be notified of changes or specific events via Workflows.', 'hm-workflows' )
			);
			wp_dropdown_users( [
				'multi'    => true,
				'name'     => 'hm.workflows.assignee',
				'selected' => get_post_meta( $post->ID, 'hm.workflows.assignee', true ),
			] );
		},
		$post_type,
		'side',
		'default'
	);
}

add_action( 'add_meta_boxes', __NAMESPACE__ . '\assignee_metabox', 10 );

/**
 * Save the assignee meta data.
 *
 * @param int $post_id
 */
function assignee_save( $post_id ) {
	$assignee = filter_input( INPUT_POST, 'hm.workflows.assignee', FILTER_SANITIZE_NUMBER_INT );

	if ( $assignee ) {
		update_post_meta( $post_id, 'hm.workflows.assignee', intval( $assignee ) );
	}
}

add_action( 'save_post', __NAMESPACE__ . '\assignee_save', 10 );
