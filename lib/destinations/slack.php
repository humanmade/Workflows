<?php
/**
 * Email delivery handler for Workflows,
 *
 * @package Workflows
 */

namespace HM\Workflows;

Destination::register( 'slack', __NAMESPACE__ . '\slack_handler' )
	->add_ui( __( 'Slack', 'hm-workflows' ) )
	->get_ui()
	->set_description(
		__( 'Note: Slack notifications are sent to a channel rather than individual users.', 'hm-worklows' )
	)
	->add_field( 'incoming_webhook', __( 'Incoming webhook URL', 'hm-workflows' ), 'url', [
		'description' => __( 'Paste in an incoming webhook URL from your slack app. You can create an app at https://api.slack.com/apps.', 'hm-workflows' ),
		'required'    => true,
	] )
	->add_field( 'channel', __( 'Channel', 'hm-workflows' ), 'text', [
		'description' => __( 'Override the default channel to post notifications to.', 'hm-workflows' ),
	] );

/**
 * Custom handler for the slack Destination.
 *
 * @param array $recipients Array of WP_User or email addresses.
 * @param array $message    Message and actions.
 * @param array $data       Optional settings passed in from UI data.
 */
function slack_handler( array $recipients, array $message, array $data = [] ) {

	// Bail if no webhook URL.
	if (
		! isset( $data['incoming_webhook'] ) ||
		empty( $data['incoming_webhook'] ) ||
		! filter_var( $data['incoming_webhook'], FILTER_VALIDATE_URL )
	) {
		trigger_error( 'Workflows: Slack incoming webhook setting is missing or misconfigured.' );

		return;
	}

	$payload = [
		'text'        => $message['subject'],
		'attachments' => [],
	];

	// Add main message body.
	if ( ! empty( $message['text'] ) ) {
		$payload['attachments'][] = [ 'text' => $message['text'] ];
	}

	// Add action buttons.
	if ( ! empty( $message['actions'] ) ) {
		$actions = [
			'fallback' => sprintf(
				__( 'Log in to %s to take further actions', 'hm-workflows' ),
				admin_url()
			),
			'actions'  => [],
		];

		foreach ( $message['actions'] as $action ) {
			$button = [
				'type' => 'button',
				'text' => esc_html( $action['text'] ),
				'url'  => esc_url_raw( $action['url'] ),
			];

			if ( ! empty( $action['data'] ) && isset( $action['data']['style'] ) ) {
				$button['style'] = $action['data']['style'];
			}

			$actions['actions'][] = $button;
		}

		$payload['attachments'][] = $actions;
	}

	// Add channel override.
	if ( isset( $data['channel'] ) && ! empty( $data['channel'] ) ) {
		$payload['channel'] = '#' . sanitize_key( ltrim( $data['channel'], '#' ) );
	}

	// Send the payload.
	wp_remote_post( $data['incoming_webhook'], [
		'headers' => [
			'Content-type' => 'application/json',
		],
		'body'    => wp_json_encode( $payload ),
	] );
}
