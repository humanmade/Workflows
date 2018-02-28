<?php

namespace HM\Workflows;

use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

/**
 * Class REST_Webhook_Controller
 *
 * @package HM\Workflows
 */
class REST_Webhook_Controller extends WP_REST_Controller {

	/**
	 * API constructor.
	 *
	 * @param string $namespace Endpoint namespace.
	 * @param string $rest_base Endpoint base.
	 */
	public function __construct( $namespace, $rest_base ) {
		$this->namespace = $namespace;
		$this->rest_base = $rest_base;
	}

	/**
	 * Register the routes.
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, $this->rest_base . '/(?P<event>[\\w-\.]+)\/(?P<action>[\\w-\.]+)', [
			'methods'  => WP_REST_Server::READABLE,
			'callback' => [ $this, 'handle_endpoint_response' ],
			'args'     => [
				'payload'   => [
					'validate_callback' => 'is_string',
					'sanitize_callback' => 'sanitize_text_field',
				],
				'signature' => [
					'validate_callback' => 'is_string',
					'sanitize_callback' => 'sanitize_text_field',
				],
			],
		] );
	}

	/**
	 * Specify endpoint schema.
	 *
	 * @return array
	 */
	public function get_item_schema() {
		return [
			[
				'$schema'     => 'http://json-schema.org/draft-04/schema#',
				'title'       => 'payload',
				'type'        => 'string',
				'description' => __( 'A base64 encoded JSON payload.', 'hm-workflows' ),
			],
			[
				'$schema'     => 'http://json-schema.org/draft-04/schema#',
				'title'       => 'signature',
				'type'        => 'string',
				'required'    => true,
				'description' => __( 'The request signature hash.', 'hm-workflows' ),
			],
		];
	}

	/**
	 * Process the webhook request.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function handle_endpoint_response( WP_REST_Request $request ) {
		$event     = $request->get_param( 'event' );
		$action    = $request->get_param( 'action' );
		$payload   = $request->get_param( 'payload' ) ?? [];
		$signature = $request->get_param( 'signature' );

		if ( empty( $event ) || empty( $action ) || empty( $signature ) ) {
			return $this->handle_response( $request, 'The event ID, action ID and signature are required.', 'error' );
		}

		// Verify webhook.
		$headers = $this->get_webhook_headers( [
			'evt' => $event,
			'act' => $action,
		] );

		if ( ! $this->verify_webhook( $headers, $payload, $signature ) ) {
			return $this->handle_response( $request, 'The security check has failed, the data received did not match what was expected.', 'error' );
		}

		// Check Event object exists.
		if ( ! Event::get( $event ) ) {
			return $this->handle_response( $request, 'Could find an event matching the ID ' . $event, 'error' );
		}

		// Get the message action.
		$message_action = Event::get( $event )->get_message_action( $action );

		if ( ! $message_action ) {
			return $this->handle_response( $request, 'The action handler ' . $action . ' was not found for ' . $event, 'error' );
		}

		if ( ! is_callable( $message_action['callback_or_url'] ) ) {
			return $this->handle_response( $request, 'Message action callback should be a callable.', 'error' );
		}

		// Parse the payload.
		$args = json_decode( base64_decode( $payload ) );

		// Get the sanitisation schema.
		$schema = wp_parse_args(
			$message_action['schema'],
			array_fill_keys( array_keys( $args ), 'sanitize_text_field' )
		);

		// Sanitise args.
		foreach ( $args as $key => $value ) {
			$args[ $key ] = call_user_func( $schema[ $key ], $value );
		}

		// Pass to callback handler.
		$result = call_user_func_array( $message_action['callback_or_url'], $args );

		// Redirect to URL or return as a message.
		if ( is_string( $result ) ) {
			if ( filter_var( $result, FILTER_VALIDATE_URL ) ) {
				wp_safe_redirect( $result, 302 );
				exit;
			} else {
				return $this->handle_response( $request, $result );
			}
		}

		// Generic action success message.
		return $this->handle_response( $request, $message_action['text'] . ' was successful!' );
	}

	/**
	 * If the request has been made using the API Nonce header or content-type
	 * header is application/json then return JSON, otherwise show the response as HTML.
	 *
	 * @todo is there a better / more RESTful approach to making this distinction?
	 *
	 * @param WP_REST_Request $request
	 * @param string $response
	 * @param string $type One of 'success' or 'error'
	 *
	 * @return WP_REST_Response
	 */
	public function handle_response( WP_REST_Request $request, string $response = '', $type = 'success' ) {
		// Wrap error responses in WP_Error.
		if ( $type === 'error' ) {
			$response = new WP_Error( $response );
		}

		$title = $type === 'success'
			? esc_html__( 'Success!', 'hm-workflows' )
			: esc_html__( 'There was an error', 'hm-workflows' );

		// Handle JSON response.
		if ( $request->get_header( 'x-wp-nonce' ) || $request->get_header( 'content-type' ) === 'application/json' ) {
			return rest_ensure_response( $response );
		}

		// If the request referer is the current site then append link back to page they were on.
		if ( strpos( $request->get_header( 'referer' ), home_url() ) !== false ) {
			return wp_die( $response, $title, [ 'back_link' => true ] );
		}

		// If no nonce then wp_die() the response data.
		// @todo custom wp_die_handler for webhook message?
		return wp_die( $response, $title );
	}

	/**
	 * JSON Web Token style headers array for URL signing.
	 *
	 * @param array $additional
	 * @return array
	 */
	public function get_webhook_headers( array $additional = [] ) {
		return array_merge( [
			'typ' => 'jwt',
			'alg' => PASSWORD_DEFAULT,
		], $additional );
	}

	/**
	 * Generate a webhook URL for an event, action and a payload of data to pass
	 * to the callback.
	 *
	 * @param string $event
	 * @param string $action
	 * @param array  $payload
	 * @return string
	 */
	public function get_webhook_url( string $event, string $action, array $payload = [] ) {
		return add_query_arg( [
			'payload'   => base64_encode( json_encode( $payload ) ),
			'signature' => $this->sign( $this->get_webhook_headers( [
				'evt' => $event,
				'act' => $action,
			] ), $payload ),
		], rest_url( "{$this->namespace}/{$this->rest_base}/$event/$action" ) );
	}

	/**
	 * Verify the webhook hasn't been tampered with or spoofed.
	 *
	 * @param array  $headers   The headers array used for signing the URL.
	 * @param string $payload   The encoded payload from $_GET.
	 * @param string $signature The webhook signature from $_GET.
	 * @return bool
	 */
	public function verify_webhook( array $headers, string $payload, string $signature ) {
		return password_verify(
			base64_encode( json_encode( $headers ) ) . '.' .
			$payload,
			$signature
		);
	}

	/**
	 * Generate a secure signature for the webhook. Using a JWT approach
	 * as nonce based checks expire.
	 *
	 * @param array $headers
	 * @param array $payload
	 * @return bool|string
	 */
	protected function sign( array $headers, array $payload ) {
		return password_hash(
			base64_encode( json_encode( $headers ) ) . '.' .
			base64_encode( json_encode( $payload ) ),
			PASSWORD_DEFAULT
		);
	}
}
