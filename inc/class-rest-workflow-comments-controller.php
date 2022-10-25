<?php

namespace HM\Workflows;

use WP_Error;
use WP_REST_Comments_Controller;
use WP_REST_Request;

/**
 * Class REST_Workflows_Controller
 *
 * @package HM\Workflows
 */
class REST_Workflow_Comments_Controller extends WP_REST_Comments_Controller {

	/**
	 * API constructor.
	 *
	 * @param string $post_type Endpoint base.
	 */
	public function __construct() {
		parent::__construct();
		$this->namespace = 'workflows/v1';
	}

	/**
	 * Make the post ID or IDs required.
	 *
	 * (It's theoretically possible to query for all editorial comments on any
	 * post, but the generated query is extremely inefficient as there isn't
	 * an index available to use, so it's better to just disallow by default.)
	 *
	 * @return [] Comments collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params['post']['required'] = true;

		return $query_params;
	}

	/**
	 * Ensure only workflow comments are returned.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		add_filter( 'rest_comment_query', function ( $args ) {
			$args['type'] = 'workflow';
			return $args;
		} );

		return parent::get_items( $request );
	}

	/**
	 * Only allow reading editorial comments if the user can edit all the posts being queried.
	 *
	 * @param WP_REST_Request $request
	 * @return bool
	 */
	public function get_items_permissions_check( $request ) {
		$post_ids = (array) $request->get_param( 'post' );

		if ( empty( $post_ids ) ) {
			return false;
		}

		return array_reduce(
			$post_ids,
			function ( $can_edit, $post_id ) {
				return $can_edit && current_user_can( 'edit_post', $post_id );
			},
			true
		);
	}

	/**
	 * Users who can edit a post should be able to view single editorial
	 * comments on that post.
	 *
	 * @param WP_REST_Request $request Current request.
	 * @return bool
	 */
	public function get_item_permissions_check( $request ) {
		$comment = $this->get_comment( $request['id'] );
		return current_user_can( 'edit_post', $comment->comment_post_ID );
	}

	/**
	 * Allow creating editorial comments.
	 *
	 * @param WP_REST_Request $request
	 * @return bool
	 */
	public function create_item_permissions_check( $request ) {
		$result = parent::create_item_permissions_check( $request );

		// This is for workflow comments only.
		if ( $request->get_param( 'type' ) && $request->get_param( 'type' ) !== 'workflow' ) {
			return false;
		}

		if ( ! is_user_logged_in() ) {
			return false;
		}

		if ( ! current_user_can( 'edit_post', $request->get_param( 'post' ) ) ) {
			return false;
		}

		if ( ! is_wp_error( $result ) ) {
			return $result;
		}

		$allowed_errors = [
			'rest_invalid_comment_type',
			'rest_comment_closed',
			'rest_comment_draft_post',
			'rest_comment_invalid_status',
		];

		if ( in_array( $result->get_error_code(), $allowed_errors, true ) ) {
			return true;
		}

		return $result;
	}

	/**
	 * Creates a comment.
	 *
	 * @since 4.7.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_Error|WP_REST_Response Response object on success, or error object on failure.
	 */
	public function create_item( $request ) {
		// User must have edit post capability.
		if ( ! current_user_can( 'edit_post', $request['post'] ) ) {
			return new WP_Error( 'rest_forbidden', __( 'You do not have permission to create an editorial comment.', 'hm-workflows' ), array( 'status' => 403 ) );
		}

		if ( ! empty( $request['id'] ) ) {
			return new WP_Error( 'rest_comment_exists', __( 'Cannot create existing comment.', 'hm-workflows' ), array( 'status' => 400 ) );
		}

		// Do not allow comments to be created with a workflow type.
		if ( ! empty( $request['type'] ) && 'workflow' !== $request['type'] ) {
			return new WP_Error( 'rest_invalid_comment_type', __( 'Cannot create a comment with that type.', 'hm-workflows' ), array( 'status' => 400 ) );
		}

		$prepared_comment = $this->prepare_item_for_database( $request );
		if ( is_wp_error( $prepared_comment ) ) {
			return $prepared_comment;
		}

		$prepared_comment['comment_type'] = 'workflow';

		/*
		 * Do not allow a comment to be created with missing or empty
		 * comment_content. See wp_handle_comment_submission().
		 */
		if ( empty( $prepared_comment['comment_content'] ) ) {
			return new WP_Error( 'rest_comment_content_invalid', __( 'Invalid comment content.', 'hm-workflows' ), array( 'status' => 400 ) );
		}

		// Setting remaining values before wp_insert_comment so we can use wp_allow_comment().
		if ( ! isset( $prepared_comment['comment_date_gmt'] ) ) {
			$prepared_comment['comment_date_gmt'] = current_time( 'mysql', true );
		}

		// Set author data if the user's logged in.
		$missing_author = empty( $prepared_comment['user_id'] )
			&& empty( $prepared_comment['comment_author'] )
			&& empty( $prepared_comment['comment_author_email'] )
			&& empty( $prepared_comment['comment_author_url'] );

		if ( is_user_logged_in() && $missing_author ) {
			$user = wp_get_current_user();

			$prepared_comment['user_id'] = $user->ID;
			$prepared_comment['comment_author'] = $user->display_name;
			$prepared_comment['comment_author_email'] = $user->user_email;
			$prepared_comment['comment_author_url'] = $user->user_url;
		}

		// Honor the discussion setting that requires a name and email address of the comment author.
		if ( get_option( 'require_name_email' ) ) {
			if ( empty( $prepared_comment['comment_author'] ) || empty( $prepared_comment['comment_author_email'] ) ) {
				return new WP_Error( 'rest_comment_author_data_required', __( 'Creating a comment requires valid author name and email values.', 'hm-workflows' ), array( 'status' => 400 ) );
			}
		}

		if ( ! isset( $prepared_comment['comment_author_email'] ) ) {
			$prepared_comment['comment_author_email'] = '';
		}

		if ( ! isset( $prepared_comment['comment_author_url'] ) ) {
			$prepared_comment['comment_author_url'] = '';
		}

		if ( ! isset( $prepared_comment['comment_agent'] ) ) {
			$prepared_comment['comment_agent'] = '';
		}

		$check_comment_lengths = wp_check_comment_data_max_lengths( $prepared_comment );
		if ( is_wp_error( $check_comment_lengths ) ) {
			$error_code = $check_comment_lengths->get_error_code();
			return new WP_Error( $error_code, __( 'Comment field exceeds maximum length allowed.', 'hm-workflows' ), array( 'status' => 400 ) );
		}

		$prepared_comment['comment_approved'] = wp_allow_comment( $prepared_comment, true );

		if ( is_wp_error( $prepared_comment['comment_approved'] ) ) {
			$error_code    = $prepared_comment['comment_approved']->get_error_code();
			$error_message = $prepared_comment['comment_approved']->get_error_message();

			if ( 'comment_duplicate' === $error_code ) {
				return new WP_Error( $error_code, $error_message, array( 'status' => 409 ) );
			}

			if ( 'comment_flood' === $error_code ) {
				return new WP_Error( $error_code, $error_message, array( 'status' => 400 ) );
			}

			return $prepared_comment['comment_approved'];
		}

		/**
		 * Filter comment for HTML.
		 */
		$prepared_comment['comment_content'] = wp_kses_post( $prepared_comment['comment_content'] );

		/**
		 * Filters a comment before it is inserted via the REST API.
		 *
		 * Allows modification of the comment right before it is inserted via wp_insert_comment().
		 * Returning a WP_Error value from the filter will shortcircuit insertion and allow
		 * skipping further processing.
		 *
		 * @since 4.7.0
		 * @since 4.8.0 $prepared_comment can now be a WP_Error to shortcircuit insertion.
		 *
		 * @param array|WP_Error  $prepared_comment The prepared comment data for wp_insert_comment().
		 * @param WP_REST_Request $request          Request used to insert the comment.
		 */
		$prepared_comment = apply_filters( 'rest_pre_insert_comment', $prepared_comment, $request );
		if ( is_wp_error( $prepared_comment ) ) {
			return $prepared_comment;
		}

		$comment_id = wp_insert_comment( wp_filter_comment( wp_slash( (array) $prepared_comment ) ) );

		if ( ! $comment_id ) {
			return new WP_Error( 'rest_comment_failed_create', __( 'Creating comment failed.', 'hm-workflows' ), array( 'status' => 500 ) );
		}

		if ( isset( $request['status'] ) ) {
			$this->handle_status_param( $request['status'], $comment_id );
		}

		$comment = get_comment( $comment_id );

		/**
		 * Fires after a comment is created or updated via the REST API.
		 *
		 * @since 4.7.0
		 *
		 * @param WP_Comment      $comment  Inserted or updated comment object.
		 * @param WP_REST_Request $request  Request object.
		 * @param bool            $creating True when creating a comment, false
		 *                                  when updating.
		 */
		do_action( 'rest_insert_comment', $comment, $request, true );

		$schema = $this->get_item_schema();

		if ( ! empty( $schema['properties']['meta'] ) && isset( $request['meta'] ) ) {
			$meta_update = $this->meta->update_value( $request['meta'], $comment_id );

			if ( is_wp_error( $meta_update ) ) {
				return $meta_update;
			}
		}

		$fields_update = $this->update_additional_fields_for_object( $comment, $request );

		if ( is_wp_error( $fields_update ) ) {
			return $fields_update;
		}

		$context = current_user_can( 'edit_post', $request->get_param( 'post' ) ) ? 'edit' : 'view';

		$request->set_param( 'context', $context );

		$response = $this->prepare_item_for_response( $comment, $request );
		$response = rest_ensure_response( $response );

		$response->set_status( 201 );
		$response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $comment_id ) ) );


		return $response;
	}

	/**
	 * Ensure comment type is valid.
	 *
	 * @param int $id
	 * @return WP_Comment|WP_Error
	 */
	protected function get_comment( $id ) {
		$result = parent::get_comment( $id );

		if ( isset( $result['type'] ) && $result['type'] !== 'workflow' ) {
			return new WP_Error( 'rest_post_invalid_type', __( 'Invalid comment type.', 'hm-workflows' ), array( 'status' => 400 ) );
		}

		return $result;
	}
}
