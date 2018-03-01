<?php
/**
 * Email delivery handler for Workflows,
 *
 * @package Workflows
 */

namespace HM\Workflows;

Destination::register( 'email', __NAMESPACE__ . '\email_handler' )
	->add_ui( __( 'Email', 'hm-workflows' ) )
	->get_ui()
		->add_field( 'use_bcc', __( 'Use BCC?' ), 'checkbox' );

/**
 * Custom handler for the email Event.
 *
 * @param array $recipients Array of WP_Users or email addresses.
 * @param array $messages   Messages and actions.
 * @param array $data       Optional settings passed in from UI data.
 */
function email_handler( array $recipients, array $messages, array $data = [] ) {

	$users = array_filter( $recipients, function ( $recipient ) {
		return is_a( $recipient, 'WP_User' );
	} );

	$emails = array_filter( $recipients, function ( $recipient ) {
		return is_string( $recipient ) && is_email( $recipient );
	} );

	$emails = array_merge( wp_list_pluck( $users, 'user_email' ), $emails );
	$emails = array_unique( $emails );

	// Check UI settings.
	if ( isset( $data['use_bcc'] ) ) {
		$to            = [];
		$email_headers = array_map( function ( $email ) {
			return 'BCC: ' . $email;
		}, $emails );
	} else {
		$to            = $emails;
		$email_headers = [];
	}

	/**
	 * Filters the email headers for the email Workflows destination.
	 * All recipients are visible in the to address field by default.
	 *
	 * @param array $email_headers
	 * @param array $recipients
	 * @param array $messages
	 * @param array $data
	 */
	$headers = apply_filters( 'hm.workflows.destination.email.headers', $email_headers, $recipients, $messages, $data );

	foreach ( $messages as $message ) {
		if ( ! empty( $message['actions'] ) ) {
			$message['text'] .= "\n\n----------------------------------------------\n\n";
			foreach ( $message['actions'] as $action ) {
				$message['text'] .= sprintf( "%s\n<%s>\n\n",
					esc_html( $action['text'] ),
					esc_url_raw( $action['url'] )
				);
			}
		}

		// Send the email.
		wp_mail(
			$to,
			$message['subject'],
			$message['text'],
			$headers
		);
	}
}
