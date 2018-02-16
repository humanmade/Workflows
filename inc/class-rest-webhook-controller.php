<?php

namespace HM\Workflow;

use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Request;
use WP_Term;
use WP_REST_Server;

/**
 * Class REST_Webhook_Controller
 *
 * @package HM\Workflow
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
		register_rest_route( $this->namespace, $this->rest_base . '/(?P<event>[\\w-\.]+)\/(?P<action>[\\w-\.]+)\/(?P<id>[\d]+)', [
			'methods'  => WP_REST_Server::READABLE,
			'callback' => [ $this, 'handle_endpoint_response' ],
		] );
	}

	/**
	 * @param WP_REST_Request $request
	 */
	public function handle_endpoint_response( WP_REST_Request $request ) {
		$params = $request->get_params();
		if ( 'edit' === $params['action'] && ! empty( $params['id'] ) ) {
			// @todo: perform necessary checks (permissions/csrf)
			wp_safe_redirect( add_query_arg( [
				'post'   => $params['id'],
				'action' => $params['action'],
			], admin_url( 'post.php' ) ) );
			exit;
		}

		if ( 'view' === $params['action'] && ! empty( $params['id'] ) ) {
			wp_safe_redirect( get_permalink( $params['id'] ) );
			exit;
		}
	}
}
