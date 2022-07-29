<?php
/**
 * HM\Workflow Namespace related functions and includes.
 *
 *  Declares functions and constants in the HM\Workflow namespace
 *
 * @package HM\Workflow
 * @since   0.1.0
 */

namespace HM\Workflows;

use WP_Query;

require_once __DIR__ . '/class-ui.php';
require_once __DIR__ . '/class-destination.php';
require_once __DIR__ . '/class-event.php';
require_once __DIR__ . '/class-workflow.php';
require_once __DIR__ . '/class-rest-webhook-controller.php';
require_once __DIR__ . '/class-rest-workflows-controller.php';
require_once __DIR__ . '/class-rest-workflow-comments-controller.php';

/**
 * Register post type
 */
add_action( 'init', function () {

	$labels = [
		'name'               => _x( 'Workflows', 'post type general name', 'hm-workflow' ),
		'singular_name'      => _x( 'Workflow', 'post type singular name', 'hm-workflow' ),
		'menu_name'          => _x( 'Workflows', 'admin menu', 'hm-workflow' ),
		'name_admin_bar'     => _x( 'Workflow', 'add new on admin bar', 'hm-workflow' ),
		'add_new'            => _x( 'Add New', 'Filing', 'hm-workflow' ),
		'add_new_item'       => __( 'Add New Workflow', 'hm-workflow' ),
		'new_item'           => __( 'New Workflow', 'hm-workflow' ),
		'edit_item'          => __( 'Edit Workflow', 'hm-workflow' ),
		'view_item'          => __( 'View Workflow', 'hm-workflow' ),
		'all_items'          => __( 'All Workflows', 'hm-workflow' ),
		'search_items'       => __( 'Search Workflows', 'hm-workflow' ),
		'parent_item_colon'  => __( 'Parent Workflows:', 'hm-workflow' ),
		'not_found'          => __( 'No workflows found.', 'hm-workflow' ),
		'not_found_in_trash' => __( 'No workflows found in Trash.', 'hm-workflow' ),
	];

	$args = [
		'labels'                => $labels,
		'description'           => __( 'Description.', 'hm-workflow' ),
		'public'                => false,
		'publicly_queryable'    => false,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'query_var'             => true,
		'capability_type'       => 'workflow',
		'map_meta_cap'          => true,
		'has_archive'           => false,
		'hierarchical'          => false,
		'menu_position'         => 121,
		'menu_icon'             => 'dashicons-randomize',
		'rewrite'               => false,
		'supports'              => [ 'title' ],
		'show_in_rest'          => true,
		'rest_base'             => 'workflows',
		'rest_controller_class' => __NAMESPACE__ . '\REST_Workflows_Controller',
	];

	register_post_type( 'hm_workflow', $args );

	remove_post_type_support( 'hm_workflow', 'revisions' );
}, 1 );

/**
 * Maps capabilities for managing workflows.
 *
 * Site admins are always allowed, plus anyone with the
 * special cap 'manage_workflows'.
 */
add_filter( 'map_meta_cap', function ( $caps, $cap, $user_id, $args ) {
	$workflow_caps = [
		'edit_workflow',
		'read_workflow',
		'publish_workflow',
		'delete_workflow',
		'edit_workflows',
		'edit_others_workflows',
		'publish_workflows',
		'read_private_workflows',
		'delete_workflows',
		'delete_private_workflows',
		'delete_published_workflows',
		'delete_others_workflows',
		'edit_private_workflows',
		'edit_published_workflows',
	];

	if ( ! array_intersect( $workflow_caps, $caps ) ) {
		return $caps;
	}

	$replacement_cap = user_can( $user_id, 'manage_options' ) ? 'manage_options' : 'manage_workflows';

	// Remove all workflows-related caps, and add our replacement cap.
	$filtered_caps = array_merge( array_diff( $caps, $workflow_caps ), [ $replacement_cap ] );
	// `manage_workflows` should imply `read` as well
	unset( $filtered_caps['read'] );

	return $filtered_caps;
}, 11, 4 );

/**
 * Temporary fix for autosave creating empty drafts before explicit save.
 */
add_filter( 'wp_insert_post_data', function ( $data ) {
	if ( $data['post_type'] !== 'hm_workflow' ) {
		return $data;
	}

	if ( isset( $_POST['data'], $_POST['data']['wp_autosave'] ) ) {
		$data['post_status'] = 'auto-draft';
	}

	return $data;
}, 10 );

/**
 * REST API endpoints.
 */
function get_webhook_controller() {
	static $controller;

	if ( $controller ) {
		return $controller;
	}

	$controller = new REST_Webhook_Controller( 'workflows/v1', 'webhooks' );

	return $controller;
}

function get_comments_controller() {
	static $controller;

	if ( $controller ) {
		return $controller;
	}

	$controller = new REST_Workflow_Comments_Controller();

	return $controller;
}

add_action( 'rest_api_init', function () {
	$webhook_controller = get_webhook_controller();
	$webhook_controller->register_routes();
	$comments_controller = get_comments_controller();
	$comments_controller->register_routes();
} );

/**
 * Destination notifications opt out.
 */
add_action( 'profile_personal_options', function () {
	// Add the settings section.
	add_settings_section(
		'notifications',
		esc_html__( 'Workflow notifications', 'hm-workflows' ),
		'__return_false',
		'hm.workflows.destinations'
	);

	// Add the notification opt-out fields.
	foreach ( Destination::get_all() as $id => $destination ) {
		if ( ! $destination->get_ui() ) {
			continue;
		}

		add_settings_field( $id, $destination->get_ui()->get_name(), function ( $args ) {
			printf( '<label for="%1$s"><input id="%1$s" type="checkbox" name="%1$s" value="1" %2$s /> %3$s</label>',
				esc_attr( $args['id'] ),
				checked( true, $args['value'], false ),
				esc_html( $args['label'] )
			);
		}, 'hm.workflows.destinations', 'notifications', [
			'id'    => "hm-workflows-destinations-disable-{$id}",
			'label' => sprintf(
				__( 'Disable %s notifications', 'hm-workflows' ),
				$destination->get_ui()->get_name()
			),
			'value' => get_user_meta( get_current_user_id(), "hm.workflows.destinations.disable.{$id}", true ),
		] );
	}
}, 9 );

// Output the fields on a later priority so other fields csn be added.
add_action( 'profile_personal_options', function () {
	do_settings_sections( 'hm.workflows.destinations' );
}, 11 );

// Save notification opt out fields.
add_action( 'profile_update', function ( $user_id ) {
	foreach ( Destination::get_all() as $id => $destination ) {
		update_user_meta(
			$user_id,
			"hm.workflows.destinations.disable.{$id}",
			filter_input( INPUT_POST, "hm-workflows-destinations-disable-{$id}", FILTER_SANITIZE_NUMBER_INT )
		);
	}
} );

/**
 * Load stored Workflows.
 */
add_action( 'hm.workflows.init', function () {

	$workflows = new WP_Query( [
		'post_type'      => 'hm_workflow',
		'posts_per_page' => 300,
		'post_status'    => 'publish',
		'fields'         => 'ids',
	] );

	foreach ( $workflows->posts as $workflow_id ) {
		$event        = get_post_meta( $workflow_id, 'event', true );
		$subject      = get_post_meta( $workflow_id, 'subject', true );
		$message      = get_post_meta( $workflow_id, 'message', true ) ?: '';
		$recipients   = get_post_meta( $workflow_id, 'recipients', true ) ?: [];
		$destinations = get_post_meta( $workflow_id, 'destinations', true );

		if ( empty( $event ) || empty( $subject ) || empty( $destinations ) ) {
			continue;
		}

		// Set Event UI data.
		$event_object = Event::get( $event['id'] );

		if ( empty( $event_object ) ) {
			continue;
		}

		$event_object->get_ui()->set_data( $event['data'] );

		// Map recipients to values or ID.
		$recipients = array_map( function ( $recipient ) {
			if ( isset( $recipient['value'] ) && is_array( $recipient['value'] ) ) {
				$recipient['value'] = array_filter( $recipient['value'] );
			}

			return ! empty( $recipient['value'] )
				? $recipient['value']
				: $recipient['id'];
		}, $recipients );

		// Map destinations to object and set UI data.
		$destinations = array_map( function ( $destination ) {
			$destination_object = Destination::get( $destination['id'] );
			$destination_object->get_ui()->set_data( $destination['data'] );

			return $destination_object;
		}, $destinations );

		$workflow = Workflow::register( $workflow_id )
			->when( $event_object )
			->what( $subject, $message );

		foreach ( $recipients as $recipient ) {
			$workflow->who( $recipient );
		}

		foreach ( $destinations as $destination ) {
			$workflow->where( $destination );
		}
	}
}, 11 );
