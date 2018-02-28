<?php
/**
 * Email delivery handler for Workflows,
 *
 * @package Workflows
 */

namespace HM\Workflows;

Destination::register( 'email', __NAMESPACE__ . '\email_handler' );

/**
 * Custom handler for the email Event.
 *
 * @param \WP_User[] $recipients Array of WP_Users.
 * @param array[]   $data       Messages and actions.
 * @return bool
 */
function email_handler( array $recipients, array $data ) {
	if ( empty( $recipients ) || empty( $data ) ) {
		return false;
	}

	$body = implode( ' ', $data['messages'] );

	if ( ! empty( $data['actions'] ) ) {
		$body .= '<ul>';
		foreach ( $data['actions'] as $action ) {
			$body .= '<li><a href="' . esc_url( $action['url'] ) . '">' . esc_html( $action['text'] ) . '</a></li>';
		}
		$body .= '</ul>';
	}

	$headers   = array_map( function ( $email ) {
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
