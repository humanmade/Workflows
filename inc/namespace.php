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

/**
 * Custom handler for the email Event.
 *
 * @param WP_User[] $recipients Array of WP_Users.
 * @param array[]   $data Messages and actions.
 */
function email_handler( array $recipients, array $data ) {
	if ( empty( $recipients ) || empty( $data ) ) {
		return false;
	}

	$body = implode( ' ', $data['messages'] );

	if ( ! empty( $data['actions'] ) ) {
		$body .= '<ul>';
		foreach ( $data['actions'] as $action ) {
			$body .= sprintf( '<li><a href="%1$s">%2$s</a></li>', esc_url( $action['url'] ), esc_html( $action['text'] ) );
		}
		$body .= '</ul>';
	}

	$headers = array_map( function( $email ) {
		return 'BCC: ' . $email;
	}, array_column( $recipients, 'user_email' ) );
	$headers[] = 'Content-Type: text/html; charset=UTF-8';
	$result    = wp_mail(
		[],
		/* translators: the current site URL. */
		sprintf( __( 'Notification for %s from HM Workflows', 'hm-workflow' ), esc_url( home_url() ) ),
		$body,
		$headers
	);
	return $result;
}