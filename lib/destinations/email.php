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
		->add_field( 'group_email', __( 'Send group email?' ), 'checkbox', [
			'description' => __( 'CC all recipients with the message. This can be useful if you prefer to collaborate via email.', 'hm-workflows' ),
		] );


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

	/**
	 * Filters the email headers for the email Workflows destination.
	 * All recipients are visible in the to address field by default.
	 *
	 * @param array $email_headers
	 * @param array $recipients
	 * @param array $messages
	 * @param array $data
	 */
	$headers = apply_filters( 'hm.workflows.destination.email.headers', [], $recipients, $messages, $data );

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

		// Send the emails.
		if ( isset( $data['group_email'] ) ) {
			wp_mail(
				$emails,
				$message['subject'],
				$message['text'],
				$headers
			);
		} else {
			foreach ( $emails as $email ) {
				wp_mail(
					$email,
					$message['subject'],
					$message['text'],
					$headers
				);
			}
		}
	}
}
