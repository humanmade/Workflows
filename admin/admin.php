<?php
/**
 * Admin UI.
 *
 * @package HM\Workflows
 */

namespace HM\Workflows;

use WP_Post;

require_once 'react-loader.php';

add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_ui_assets', 20 );
add_action( 'wp_footer', __NAMESPACE__ . '\\enqueue_ui_assets', 3000 );
add_action( 'add_meta_boxes_hm_workflow', __NAMESPACE__ . '\\meta_boxes' );
add_action( 'edit_form_after_title', __NAMESPACE__ . '\\main_ui' );
add_action( 'admin_init', __NAMESPACE__ . '\\filter_custom_columns' );

function meta_boxes() {
	remove_meta_box( 'submitdiv', 'hm_workflow', 'side' );
	remove_meta_box( 'slugdiv', 'hm_workflow', 'normal' );

	add_meta_box( 'enable-workflow', __( 'Workflow options', 'hm-workflows' ), function () {
		echo '<div id="hm-workflow-options"></div>';
	}, 'hm_workflow', 'side', 'high' );
}

function main_ui( WP_Post $post ) {
	if ( $post->post_type !== 'hm_workflow' ) {
		return;
	}

	echo '<div id="hm-workflow-ui"></div>';
}

/**
 * Load the UI scripts.
 */
function enqueue_ui_assets() {
	if ( ! is_user_logged_in() ) {
		return;
	}

	if ( ! is_admin() && ! is_admin_bar_showing() ) {
		return;
	}

	enqueue_assets( __DIR__, [
		'handle' => 'hm-workflows',
	] );

	// Get event UI configs.
	$events = array_filter( Event::get_all(), function ( Event $event ) {
		return $event->get_ui();
	} );
	$events = array_map( function ( Event $event, $id ) {
		return [
			'id'         => $id,
			'ui'         => $event->get_ui()->get_config(),
			'actions'    => array_map( function ( $action, $id ) {
				return [
					'id'   => $id,
					'text' => $action['text'],
					'data' => $action['data'],
				];
			}, $event->get_message_actions(), array_keys( $event->get_message_actions() ) ),
			'tags'       => array_keys( $event->get_message_tags() ),
			'recipients' => array_map( function ( $handler, $id ) {
				return [
					'id'   => $id,
					'name' => $handler['name'],
				];
			}, $event->get_recipient_handlers(), array_keys( $event->get_recipient_handlers() ) ),
		];
	}, $events, array_keys( $events ) );

	// Get destination UI configs.
	$destinations = array_filter( Destination::get_all(), function ( Destination $destination ) {
		return $destination->get_ui();
	} );
	$destinations = array_map( function ( Destination $destination, $id ) {
		return [
			'id' => $id,
			'ui' => $destination->get_ui()->get_config(),
		];
	}, $destinations, array_keys( $destinations ) );

	$ui_data = [
		'BuildURL'  => infer_base_url( __DIR__ . '/build/' ),
		'Nonce'     => wp_create_nonce( 'wp_rest' ),
		'Namespace' => rest_url( 'workflows/v1' ),
		'Endpoints' => [
			'WP' => rest_url( 'wp/v2' ),
		],
		'User'      => get_current_user_id(),
		'L10n'      => [
			'There was an error loading the plugin UI.' => __( 'There was an error loading the plugin UI.', 'hm-workflows' ),
			'Enable' => __( 'Enable', 'hm-workflows' ),
			'Saving' => __( 'Saving', 'hm-workflows' ),
			'Save' => __( 'Save', 'hm-workflows' ),
			'When should the workflow run?' => __( 'When should the workflow run?', 'hm-workflows' ),
			'What message should be sent?' => __( 'What message should be sent?', 'hm-workflows' ),
			'Subject' => __( 'Subject', 'hm-workflows' ),
			'Briefly state what has happened or the action to take...' => __( 'Briefly state what has happened or the action to take...', 'hm-workflows' ),
			'Message' => __( 'Message', 'hm-workflows' ),
			'Add an optional detailed message here...' => __( 'Add an optional detailed message here...', 'hm-workflows' ),
			'The following actions will be added to the message.' => __( 'The following actions will be added to the message.', 'hm-workflows' ),
			'Who should be notified?' => __( 'Who should be notified?', 'hm-workflows' ),
			'Select another...' => __( 'Select another...', 'hm-workflows' ),
			'Select...' => __( 'Select...', 'hm-workflows' ),
			'Where should they be notified?' => __( 'Where should they be notified?', 'hm-workflows' ),
			'You have no new notifications.' => __( 'You have no new notifications.', 'hm-workflows' ),
			'Read less' => __( 'Read less', 'hm-workflows' ),
			'Read more' => __( 'Read more', 'hm-workflows' ),
			'Dismiss' => __( 'Dismiss', 'hm-workflows' ),
			'Sorry! There was a problem determing which post to load editorial comments for.' => __( 'Sorry! There was a problem determing which post to load editorial comments for.', 'hm-workflows' ),
			'Show more comments' => __( 'Show more comments', 'hm-workflows' ),
			'What needs to be done next?' => __( 'What needs to be done next?', 'hm-workflows' ),
			'Assignees - No change' => __( 'Assignees - No change', 'hm-workflows' ),
			'Currently assigned to' => __( 'Currently assigned to', 'hm-workflows' ),
			'Currently unassigned' => __( 'Currently unassigned', 'hm-workflows' ),
			'Comment and Assign' => __( 'Comment and Assign', 'hm-workflows' ),
			'Comment' => __( 'Comment', 'hm-workflows' ),
			'Assigned to' => __( 'Assigned to', 'hm-workflows' ),
		],
	];

	if ( is_admin() && function_exists( 'get_editable_roles' ) ) {
		$ui_data = array_merge( $ui_data, [
			'Events'       => array_values( $events ),
			'Destinations' => array_values( $destinations ),
			'Recipients'   => [
				[
					'id'    => 'role',
					'name'  => __( 'Users with the roles...', 'hm-workflows' ),
					'items' => array_values( array_map( function ( $role, $key ) {
						return [
							'label' => $role['name'],
							'value' => $key,
						];
					}, get_editable_roles(), array_keys( get_editable_roles() ) ) ),
					'multi' => true,
				],
				[
					'id'       => 'user',
					'name'     => __( 'Specific users...', 'hm-workflows' ),
					'endpoint' => [
						'url'      => rest_url( 'wp/v2/users' ),
						'labelKey' => 'name',
						'valueKey' => 'id',
					],
					'multi'    => true,
				],
				[
					'id'   => 'all',
					'name' => __( 'All users', 'hm-workflows' ),
				],
			],
		] );
	}

	wp_add_inline_script(
		'hm-workflows',
		sprintf( 'var HM = HM || {}; HM.Workflows = %s;', wp_json_encode( $ui_data ) ),
		'before'
	);

	if ( current_action() === 'wp_footer' ) {
		wp_print_footer_scripts();
	}
}

/**
 * Add a Workflow assignee column.
 */
function filter_custom_columns() {
	$post_types = get_post_types_by_support( 'editorial-comments' );

	// Loop through public post types to add custom columns to each.
	foreach ( $post_types as $post_type ) {
		// Add the assignee column.
		add_filter( "manage_{$post_type}_posts_columns", function( $columns ) {
			return array_merge( $columns, [ 'assignees' => __( 'Assignees', 'hm-workflows' ) ] );
		} );

		// Render the assignee column.
		add_action( "manage_{$post_type}_posts_custom_column", __NAMESPACE__ . '\\add_assignee_column', 10, 2 );
	}
}

/**
 * Render the Assignees column.
 *
 * @param string $column The column to filter. We're only concerned about the 'assignees' column we registered above.
 * @param int $post_id The post ID.
 */
function add_assignee_column( string $column, int $post_id ) {
	// Return early if we're not looking at assignees.
	if ( $column !== 'assignees' ) {
		return;
	}

	// Get an array of assignees.
	$assignees = get_post_meta( $post_id, 'assignees', false );

	// Bail if no assignees.
	if ( empty( $assignees ) ) {
		echo '&mdash;';
		return;
	}

	// Get user objects for the assignees.
	$users = get_users( [ 'include' => $assignees ] );
	$links = array_map( function( $user ) {
		$post_type = get_post_type();
		$link = add_query_arg( [
			'post_type' => $post_type,
			'assigned' => $user->ID,
		], get_admin_url( null, 'edit.php' ) );
		return sprintf( '<a href="%1$s">%2$s</a>', $link, $user->display_name );
	}, $users );

	$link_list = implode( ', ', $links );

	echo wp_kses_post( $link_list );
}
