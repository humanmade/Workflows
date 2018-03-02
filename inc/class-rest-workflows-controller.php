<?php

namespace HM\Workflows;

use WP_REST_Posts_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

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
		parent::register_routes();

		// Add custom fields.

	}

}
