<?php
/**
 * Admin UI.
 *
 * @package HM\Workflows
 */

namespace HM\Workflows;

require_once 'react-loader.php';

add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_ui_assets', 20 );
add_action( 'add_meta_boxes_hm_workflow', __NAMESPACE__ . '\\meta_boxes' );
add_action( 'edit_form_after_title', __NAMESPACE__ . '\\main_ui' );

function meta_boxes() {
	remove_meta_box( 'submitdiv', 'hm_workflow', 'side' );

	add_meta_box( 'enable-workflow', __( 'Workflow options', 'hm-workflows' ), function () {
		echo '<div id="hm-workflow-options"></div>';
	}, 'hm_workflow', 'side', 'high' );
}

function main_ui() {
	echo '<div id="hm-workflow-ui"></div>';
}

/**
 * Load the UI scripts.
 */
function enqueue_ui_assets() {
	enqueue_assets( __DIR__, [
		'handle'  => 'hm-workflows',
		'scripts' => [ 'wp-api' ],
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

	wp_add_inline_script( 'hm-workflows', sprintf( 'var HM = HM || {}; HM.Workflows = %s;',
		wp_json_encode( [
			'Nonce'        => wp_create_nonce( 'wp_rest' ),
			'Namespace'    => rest_url( 'workflows/v1' ),
			'User'         => get_current_user_id(),
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
		] )
	), 'before' );
}
