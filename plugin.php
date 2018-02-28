<?php
/**
 * Plugin Name: Workflow
 * Plugin URI: https://github.com/humanmade/Workflow
 * Description: Powerful workflows for WordPress
 * Version: 0.1.0
 * Author: Human Made Limited
 * Author URI: https://humanmade.com
 * Text Domain: hm-workflow
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /languages
 *
 * @package HM\Workflow
 * @since 0.1.0
 **/

namespace HM\Workflow;

require_once __DIR__ . '/inc/namespace.php';

add_action( 'plugins_loaded', function() {
	$email_destination = Destination::register( 'email', __NAMESPACE__ . '\\email_handler' );

	$event_status_draft_to_pending = Event::register( 'draft_to_pending' )
		->add_message_tags( [
			'title' => function( $post ) {
				if ( is_a( $post, 'WP_Post' ) ) {
					return $post->post_title;
				}
				return null;
			},
		]);

	$event_post_published = Event::register( 'publish_post' )
		->add_message_tags( [
			'title' => function( $post_id ) {
				$post = get_post( $post_id );
				if ( is_a( $post, 'WP_Post' ) ) {
					return $post->post_title;
				}
				return null;
			},
		]);

	$event_page_published = Event::register( 'publish_page' )
		->add_message_tags( [
			'title' => function( $post_id ) {
				$post = get_post( $post_id );
				if ( is_a( $post, 'WP_Post' ) ) {
					return $post->post_title;
				}
				return null;
			},
		]);

	// Built in workflows.
	$wf_draft_pending = Workflow::register( 'draft_to_pending', __( 'Notify editors by email when a post is ready to publish', 'hm-workflow' ) )
			->when( 'draft_to_pending' )
			->what( '%title% is ready to be published', [
				[
					'id'              => 'view',
					'text'            => __( 'View', 'hm-workflow' ),
					'callback_or_url' => function( $post ) { return $post->ID; },
					'args'            => [],
					'schema'          => [],
				],
				[
					'id'              => 'edit',
					'text'            => __( 'Edit', 'hm-workflow' ),
					'callback_or_url' => function( $post ) { return $post->ID; },
					'args'            => [],
					'schema'          => [],
				],
			] ) // @todo: consider i18n
			->who( 'editor' )
			->where( $email_destination );

	$wf_publish_post = Workflow::register( 'publish_post', __( 'Notify editors by email when a post has been published', 'hm-workflow' ) )
			->when( 'publish_post' )
			->what( '%title% is ready to be published', [
				[
					'id'              => 'view',
					'text'            => __( 'View', 'hm-workflow' ),
					'callback_or_url' => function( $post ) { return $post->ID; },
					'args'            => [],
					'schema'          => [],
				],
				[
					'id'              => 'edit',
					'text'            => __( 'Edit', 'hm-workflow' ),
					'callback_or_url' => function( $post ) { return $post->ID; },
					'args'            => [],
					'schema'          => [],
				],
			] ) // @todo: consider i18n
			->who( 'editor' )
			->where( $email_destination );

	$wf_publish_page = Workflow::register( 'publish_page', __( 'Notify editors by email when a page has been published', 'hm-workflow' ) )
			->when( 'publish_page' )
			->what( '%title% is ready to be published', [
				[
					'id'              => 'view',
					'text'            => __( 'View', 'hm-workflow' ),
					'callback_or_url' => function( $post_id ) { return $post_id; },
					'args'            => [],
					'schema'          => [],
				],
				[
					'id'              => 'edit',
					'text'            => __( 'Edit', 'hm-workflow' ),
					'callback_or_url' => function( $post_id ) { return $post_id; },
					'args'            => [],
					'schema'          => [],
				],
			] ) // @todo: consider i18n
			->who( 'editor' )
			->where( $email_destination );
});
