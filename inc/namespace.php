<?php
/**
 * HM\Workflow Namespace related functions and includes.
 *
 *  Declares functions and constants in the HM\Workflow namespace
 *
 * @package HM\Workflow
 * @since 0.1.0
 */

namespace HM\Workflow;

require_once __DIR__ . '/class-ui.php';
require_once __DIR__ . '/class-destination.php';
require_once __DIR__ . '/class-event.php';
require_once __DIR__ . '/class-workflow.php';
require_once __DIR__ . '/class-rest-webhook-controller.php';

/**
 * Register post type
 */
add_action( 'init', function() {

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
		'labels'             => $labels,
		'description'        => __( 'Description.', 'hm-workflow' ),
		'public'             => false,
		'publicly_queryable' => false,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'capability_type'    => 'post',
		'has_archive'        => false,
		'hierarchical'       => false,
		'menu_position'      => null,
		'menu_icon'          => 'dashicons-randomize',
		'rewrite'            => [ 'slug' => 'workflows' ],
		'supports'           => [ 'title' ],
	];

	register_post_type( 'hm_workflow', $args );

}, 1 );

/**
 * REST API endpoints.
 */
add_action( 'rest_api_init', function() {
	$rest_controller = new REST_Webhook_Controller( 'workflows/v1', 'webhooks' );
	$rest_controller->register_routes();
});
