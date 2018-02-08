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
	$wf = Workflow::register( 'draft_to_pending' )
			->when( 'draft_to_pending' ) // creates the Workflow Event.
			->what( 'Post is ready to publish' )
			->who( 'administrator' )
			->where( Destination::register( 'email', __NAMESPACE__ . '\\email_handler' ) );
});

/**
 * Custom handler for the email Event.
 *
 * @param WP_User[] $recipients Array of WP_Users.
 * @param array     $messages Messages.
 */
function email_handler( $recipients, $messages ) {
	$message = $messages[0];
	wp_mail( array_column( $recipients, 'user_email' ), 'A message for you sir.', $message );
}
