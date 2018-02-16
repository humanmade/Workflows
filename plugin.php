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
	$event_dtp = Event::register( 'draft_to_pending' )
					->add_message_tags( [
						'title' => function( $post ) {
							// Receives the action $args array.
							if ( is_a( $post, 'WP_Post' ) ) {
									return $post->post_title;
							}
							return null;
					}]
					)
					->add_message_action( 'view_post', __( 'View post', 'hm-workflow' ), function( $post ) {
						return get_permalink( $post );
					}, null, [] );

	// Built in workflow: Notify editors by email whenever a post is changed from draft to pending.
	$wf = Workflow::register( 'draft_to_pending', __( 'Notify editors by email when a post is ready to publish', 'hm-workflow' ) )
			->when( 'draft_to_pending' )
			->what( '%title% is ready to be published' ) // @todo: consider i18n
			->who( 'editor' )
			->where( Destination::register( 'email', __NAMESPACE__ . '\\email_handler' ) );
});

/**
 * Custom handler for the email Event.
 *
 * @param WP_User[] $recipients Array of WP_Users.
 * @param array     $messages Messages.
 */
function email_handler( array $recipients, array $messages ) {
	if ( empty( $recipients ) || empty( $messages ) ) {
		return false;
	}
	$message = $messages[0];
	$headers = array_map( function( $email ) {
		return 'BCC: ' . $email;
	}, array_column( $recipients, 'user_email' ) );
	$result = wp_mail(
		[],
		/* translators: the current site URL. */
		sprintf( __( 'Notification for %s from HM Workflows', 'hm-workflow' ), esc_url( home_url() ) ),
		$message,
		$headers
	);
	return $result;
}
