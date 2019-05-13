<?php

namespace HM\Workflows;

use WP_REST_Posts_Controller;

/**
 * Class REST_Workflows_Controller
 *
 * @package HM\Workflows
 */
class REST_Workflows_Controller extends WP_REST_Posts_Controller {

	/**
	 * API constructor.
	 *
	 * @param string $post_type Endpoint base.
	 */
	public function __construct( $post_type ) {
		parent::__construct( $post_type );
		$this->namespace = 'workflows/v1';
	}

	/**
	 * Register the routes.
	 */
	public function register_routes() {

		// Add custom fields.
		register_rest_field( 'hm_workflow', 'event', [
			'get_callback' => function ( $post ) {
				$event = get_post_meta( $post['id'], 'event', true ) ?: null;

				if ( $event ) {
					$event['data'] = (object) $event['data'];
				}

				return $event;
			},
			'update_callback' => function ( $value, $post ) {
				update_post_meta( $post->ID, 'event', $value );
			},
			'schema' => [
				'type' => 'object',
				'description' => __( 'The event object', 'hm-workflows' ),
				'properties' => [
					'id' => [
						'type' => 'string',
						'required' => true,
						'description' => __( 'A registered Event ID or an action name.', 'hm-workflows' ),
					],
					'data' => [
						'type' => 'object',
						'description' => __( 'Associated data passed to the event callback.', 'hm-workflows' ),
					],
				],
			],
		] );

		register_rest_field( 'hm_workflow', 'subject', [
			'get_callback' => function ( $post ) {
				return sanitize_text_field( get_post_meta( $post['id'], 'subject', true ) );
			},
			'update_callback' => function ( $value, $post ) {
				update_post_meta( $post->ID, 'subject', sanitize_text_field( $value ) );
			},
			'schema' => [
				'type' => 'string',
				'description' => __( 'The workflows notification subject line', 'hm-workflows' ),
			],
		] );

		register_rest_field( 'hm_workflow', 'message', [
			'get_callback' => function ( $post ) {
				return sanitize_textarea_field( get_post_meta( $post['id'], 'message', true ) );
			},
			'update_callback' => function ( $value, $post ) {
				update_post_meta( $post->ID, 'message', sanitize_textarea_field( $value ) );
			},
			'schema' => [
				'type' => 'string',
				'description' => __( 'The workflows notification subject line', 'hm-workflows' ),
			],
		] );

		register_rest_field( 'hm_workflow', 'recipients', [
			'get_callback' => function ( $post ) {
				return get_post_meta( $post['id'], 'recipients', true ) ?: [];
			},
			'update_callback' => function ( $value, $post ) {
				update_post_meta( $post->ID, 'recipients', $value );
			},
			'schema' => [
				'type' => 'array',
				'default' => [],
				'items' => [
					'type' => 'object',
					'properties' => [
						'id' => [
							'type' => 'string',
							'required' => true,
						],
						'value' => [
							'type' => 'array',
							'items' => [
								'type' => 'string',
							],
						],
					],
				],
			],
		] );

		register_rest_field( 'hm_workflow', 'destinations', [
			'get_callback' => function ( $post ) {
				$destinations = get_post_meta( $post['id'], 'destinations', true ) ?: [];

				$destinations = array_map( function ( $destination ) {
					$destination['data'] = (object) $destination['data'];
					return $destination;
				}, $destinations );

				return $destinations;
			},
			'update_callback' => function ( $value, $post ) {
				update_post_meta( $post->ID, 'destinations', $value );
			},
			'schema' => [
				'type' => 'array',
				'default' => [],
				'items' => [
					'type' => 'object',
					'properties' => [
						'id' => [
							'type' => 'string',
							'required' => true,
						],
						'data' => [
							'type' => 'object',
						],
					],
				],
			],
		] );

		parent::register_routes();
	}

}
