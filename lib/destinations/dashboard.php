<?php
/**
 * Dashboard notifications Destination.
 *
 * @package HM\Workflows
 */

namespace HM\Workflows\Dashboard;

use HM\Workflows\Destination;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_User;
use WP_Error;

const REST_NAMESPACE = 'workflows/v1';

/**
 * Register our notifications REST API.
 */
add_action( 'rest_api_init', function () {

	$schema = [
		'type'    => [
			'type'     => 'string',
			'required' => true,
		],
		'subject' => [
			'type'     => 'string',
			'required' => true,
		],
		'text'    => [
			'type'     => 'string',
			'required' => true,
		],
		'time'    => [
			'type'     => 'int',
			'required' => true,
		],
		'data'    => [
			'type' => 'object',
		],
		'actions' => [
			'type'  => 'array',
			'items' => [
				'type'       => 'object',
				'properties' => [
					'id'   => [
						'type'     => 'string',
						'required' => true,
					],
					'text' => [
						'type'     => 'string',
						'required' => true,
					],
					'url'  => [
						'type'     => 'string',
						'required' => true,
					],
					'data' => [
						'type' => 'object',
					],
				],
			],
		],
	];

	$schema_with_id       = $schema;
	$schema_with_id['id'] = [
		'type'     => 'integer',
		'required' => true,
	];

	register_rest_route( REST_NAMESPACE, 'notifications/(?P<user>[\\d]+)', [
		'methods'              => WP_REST_Server::READABLE,
		'callback'             => __NAMESPACE__ . '\get_all',
		'permissions_callback' => __NAMESPACE__ . '\permissions',
		'schema'               => [
			'type'  => 'array',
			'items' => [
				'type'       => 'object',
				'properties' => $schema_with_id,
			],
		],
	] );

	register_rest_route( REST_NAMESPACE, 'notifications/(?P<user>[\\d]+)', [
		'methods'              => WP_REST_Server::CREATABLE,
		'callback'             => __NAMESPACE__ . '\create',
		'permissions_callback' => __NAMESPACE__ . '\permissions',
		'args'                 => $schema,
		'schema'               => $schema_with_id,
	] );

	register_rest_route( REST_NAMESPACE, 'notifications/(?P<user>[\\d]+)/(?P<id>[\\d]+)', [
		'methods'              => WP_REST_Server::READABLE,
		'callback'             => __NAMESPACE__ . '\get_one',
		'permissions_callback' => __NAMESPACE__ . '\permissions',
		'schema'               => $schema_with_id,
	] );

	register_rest_route( REST_NAMESPACE, 'notifications/(?P<user>[\\d]+)/(?P<id>[\\d]+)', [
		'methods'              => WP_REST_Server::EDITABLE,
		'callback'             => __NAMESPACE__ . '\edit',
		'permissions_callback' => __NAMESPACE__ . '\permissions',
		'args'                 => $schema,
		'schema'               => $schema_with_id,
	] );

	register_rest_route( REST_NAMESPACE, 'notifications/(?P<user>[\\d]+)/(?P<id>[\\d]+)', [
		'methods'              => WP_REST_Server::DELETABLE,
		'callback'             => __NAMESPACE__ . '\delete',
		'permissions_callback' => __NAMESPACE__ . '\permissions',
	] );
} );

/**
 * Get all notifications for a user.
 *
 * @param WP_User $user
 * @return array
 */
function get_notifications( WP_User $user ) {
	$notifications = get_user_meta( $user->ID, 'hm.workflows.notification' );

	if ( empty( $notifications ) ) {
		return [];
	}

	$notifications = array_map( function ( $notification ) use ( $user ) {
		// Decode the notification.
		$notification = _decode( $notification );

		/**
		 * Filters notification content for any dynamic changes that might be needed
		 *
		 * @param \WP_User $user  User object
		 *
		 * @return object $notification
		 */
		$notification = apply_filters( 'hm.workflows.notification.pre.output', $notification, $user );

		return sanitize_notification( $notification );
	}, $notifications );

	$notifications = array_filter( array_values( $notifications ) );

	/**
	 * Filter user notifications before rendering
	 *
	 * @param \WP_User User object
	 *
	 * @return array Filtered notifications array
	 */
	return apply_filters( 'hm.workflows.notifications', $notifications, $user );
}

/**
 * Decode notification JSON and unslash it.
 *
 * @param string $notification The notification JSON string.
 * @return array
 */
function _decode( string $notification ) : array {
	$notification = json_decode( $notification, ARRAY_A );

	// Force action data to be of type array.
	$notification['actions'] = array_map( function ( $action ) {
		$action['data'] = (array) $action['data'];
		return $action;
	}, $notification['actions'] );

	$notification = wp_unslash( $notification );

	// Force action data to be of type object.
	$notification['actions'] = array_map( function ( $action ) {
		$action['data'] = (object) $action['data'];
		return $action;
	}, $notification['actions'] );

	return $notification;
}

/**
 * Slash notification array and encode it.
 *
 * @param array $notification The notification array.
 * @return string
 */
function _encode( array $notification ) : string {
	// Force action data to be of type array.
	$notification['actions'] = array_map( function ( $action ) {
		$action['data'] = (array) $action['data'];
		return $action;
	}, $notification['actions'] );

	$notification = wp_slash( $notification );

	// Force action data to be of type object.
	$notification['actions'] = array_map( function ( $action ) {
		$action['data'] = (object) $action['data'];
		return $action;
	}, $notification['actions'] );

	$notification = wp_json_encode( $notification, JSON_UNESCAPED_UNICODE );

	return $notification;
}

/**
 * Sanitize a notification object.
 *
 * @param array $notification
 * @return array
 */
function sanitize_notification( $notification ) {
	$notification = wp_parse_args( $notification, [
		'type'    => '',
		'subject' => '',
		'text'    => '',
		'actions' => [],
	] );

	/**
	 * Filter notification data array
	 *
	 * @param array Notification array
	 *
	 * @return array Notification data array
	 */
	$data = apply_filters(
		'hm.workflows.notification.data',
		sanitize_notification_data( (array) ( $notification['data'] ?? [] ), 'notification:' . $notification['type'] ),
		$notification
	);

	/**
	 * Filter allowed HTML tags in subjects
	 *
	 * @return array Array of tags to be used with wp_kses
	 */
	$allowed_subject_tags = apply_filters( 'hm.workflows.destination.subject.allowed.tags', [] );

	$sanitized_notification = [
		'type'    => sanitize_text_field( $notification['type'] ?? '' ),
		'subject' => wp_kses( $notification['subject'] ?? '', $allowed_subject_tags ),
		'text'    => wp_kses_post( $notification['text'] ?? '' ),
		'time'    => intval( $notification['time'] ?? 0 ),
		'data'    => (array) $data,
		'actions' => [],
	];

	$sanitized_notification['actions'] = array_values( array_map( function ( $action, $id ) use ( $sanitized_notification ) {
		$action_id = isset( $action['id'] ) ? sanitize_key( $action['id'] ) : sanitize_key( $id );

		/**
		 * Filter notification action data
		 *
		 * @param array Action array
		 * @param array Notification array
		 *
		 * @return array Data array
		 */
		$data      = apply_filters(
			'hm.workflows.notification.action.data',
			sanitize_notification_data( (array) $action['data'], 'action:' . $action_id ),
			$action,
			$sanitized_notification
		);

		return [
			'id'   => $action_id,
			'text' => sanitize_text_field( $action['text'] ),
			'url'  => esc_url_raw( $action['url'] ),
			'data' => (object) $data,
		];
	}, (array) $notification['actions'], array_keys( (array) $notification['actions'] ) ) );

	if ( isset( $notification['id'] ) ) {
		$sanitized_notification['id'] = intval( $notification['id'] );
	}

	return $sanitized_notification;
}

/**
 * Sanitise notification or action data array, which may contains arbitrary data schema
 *
 * @param array       $data       Data array
 * @param string      $type       Notification type or action ID, eg: 'notification:followed', 'action:follow'
 * @param string|null $parent_key Parent key name if nested
 *
 * @return array
 */
function sanitize_notification_data( array $data, string $type, string $parent_key = null ) : array {
	foreach ( $data as $key => $value ) {
		$fullpath_key = ( $parent_key ? $parent_key . ':' : '' ) . $key;
		/**
		 * Pre-filter data item value
		 *
		 * @param string $key   Data item key, may contain parent key if present
		 * @param string $value Data item value
		 * @param string $type  Notification type or action ID, eg: 'notification:followed', 'action:follow'
		 *
		 * @return mixed Data item value if pre-filtered, short-circuits the sanitization process
		 */
		$check = apply_filters( 'hm.workflows.notification.data.item', null, $fullpath_key, $value, $type );
		if ( $check !== null ) {
			$data[ $key ] = $check;
			continue;
		}

		if ( is_numeric( $value ) ) {
			$data[ $key ] = floatval( $value );
		} elseif ( is_string( $value ) ) {
			$data[ $key ] = sanitize_text_field( $value );
		} elseif ( is_object( $value ) || is_array( $value ) ) {
			$data[ $key ] = sanitize_notification_data( (array) $value, $type, $fullpath_key );
		}
	}

	return (array) $data;
}

/**
 * Return all notifications for a user.
 *
 * @param WP_REST_Request $request
 * @return WP_Error|WP_REST_Response
 */
function get_all( WP_REST_Request $request ) {
	$user = get_user_by( 'id', intval( $request->get_param( 'user' ) ) );

	if ( ! $user ) {
		return new \WP_Error( 'hm.workflows.notifications.user', __( 'User not found', 'hm-workflows' ) );
	}

	return rest_ensure_response( get_notifications( $user ) );
}

/**
 * Returns a single user notification.
 *
 * @param WP_REST_Request $request
 * @return WP_Error|WP_REST_Response
 */
function get_one( WP_REST_Request $request ) {
	$user = get_user_by( 'id', intval( $request->get_param( 'user' ) ) );
	$id   = intval( $request->get_param( 'id' ) );

	if ( ! $user ) {
		return new \WP_Error( 'hm.workflows.notifications.user', __( 'User not found', 'hm-workflows' ) );
	}

	$notifications = get_notifications( $user );

	$notifications = array_filter( $notifications, function ( $notification ) use ( $id ) {
		return $notification['id'] === $id;
	} );

	if ( empty( $notifications ) ) {
		return new \WP_Error( 'hm.workflows.notifications.id', __( 'Notification not found', 'hm-workflows' ) );
	}

	return rest_ensure_response( reset( $notifications ) );
}

/**
 * Create a user notification.
 *
 * @param WP_REST_Request $request
 * @return WP_Error|WP_REST_Response
 */
function create( WP_REST_Request $request ) {
	$user = get_user_by( 'id', intval( $request->get_param( 'user' ) ) );

	if ( ! $user ) {
		return new \WP_Error( 'hm.workflows.notifications.user', __( 'User not found', 'hm-workflows' ) );
	}

	$notification = sanitize_notification( [
		'actions' => $request->get_param( 'actions' ),
		'data'    => $request->get_param( 'data' ),
		'subject' => $request->get_param( 'subject' ),
		'text'    => $request->get_param( 'text' ),
		'time'    => $request->get_param( 'time' ),
		'type'    => $request->get_param( 'type' ),
	] );

	// Store a placeholder to get a meta ID.
	$placeholder = 'hm.workflows.notification.' . microtime( true );
	$meta_id     = add_user_meta( $user->ID, 'hm.workflows.notification', $placeholder );

	// Add the meta ID.
	$notification['id'] = intval( $meta_id );

	// And update using value from above.
	$result = update_user_meta( $user->ID, 'hm.workflows.notification', wp_slash( _encode( $notification ) ), $placeholder );

	if ( ! $result ) {
		delete_user_meta( $user->ID, 'hm.workflows.notification', $placeholder );

		return new WP_Error( 'hm.workflows.notifications.create', __( 'Could not add notification to data store.', 'hm-workflows' ) );
	}

	clear_cache( $user->ID );
	return rest_ensure_response( $notification );
}

/**
 * Edit a notification.
 *
 * @param WP_REST_Request $request
 * @return WP_Error|WP_REST_Response
 */
function edit( WP_REST_Request $request ) {
	$user = get_user_by( 'id', intval( $request->get_param( 'user' ) ) );

	if ( ! $user ) {
		return new WP_Error( 'hm.workflows.notifications.user', __( 'User not found', 'hm-workflows' ) );
	}

	$notification = get_one( $request );

	if ( is_wp_error( $notification ) ) {
		return $notification;
	}

	$old_notification = $notification->get_data();

	$new_notification = sanitize_notification( [
		'id'      => $old_notification['id'],
		'subject' => $request->get_param( 'subject' ) ?: $old_notification['subject'],
		'text'    => $request->get_param( 'text' ) ?: $old_notification['text'],
		'data'    => $request->get_param( 'data' ) ?: $old_notification['data'],
		'type'    => $request->get_param( 'type' ) ?: $old_notification['type'],
		'actions' => $request->get_param( 'actions' ) ?: $old_notification['actions'],
	] );

	$result = update_user_meta( $user->ID, 'hm.workflows.notification', _encode( $new_notification ), _encode( $old_notification ) );

	if ( ! $result ) {
		return new WP_Error( 'hm.workflows.notifications.edit', __( 'Could not edit notification.', 'hm-workflows' ) );
	}

	clear_cache( $user->ID );
	return rest_ensure_response( $new_notification );
}

/**
 * Delete a notification.
 *
 * @param WP_REST_Request $request
 * @return WP_Error|WP_REST_Response
 */
function delete( WP_REST_Request $request ) {
	$user = get_user_by( 'id', intval( $request->get_param( 'user' ) ) );

	if ( ! $user ) {
		return new WP_Error( 'hm.workflows.notifications.user', __( 'User not found', 'hm-workflows' ) );
	}

	$notification = get_one( $request );

	if ( is_wp_error( $notification ) ) {
		return $notification;
	}

	// Get the data back.
	$data = $notification->get_data();

	// Delete the user meta matching the encoded value.
	$result = delete_user_meta( $user->ID, 'hm.workflows.notification', wp_slash( _encode( $data ) ) );

	if ( ! $result ) {
		return new WP_Error( 'hm.workflows.notifications.delete', __( 'Could not delete notification from data store.', 'hm-workflows' ) );
	}

	clear_cache( $user->ID );
	return rest_ensure_response( $result );
}

/**
 * Clear API endpoint from page cache.
 *
 * @param int $user_id
 */
function clear_cache( $user_id ) {
	if ( ! function_exists( 'batcache_clear_url' ) ) {
		return;
	}

	batcache_clear_url( rest_url( REST_NAMESPACE . '/notifications/' . $user_id ) );
}

/**
 * Ensure permissions are restricted to the current user or
 * a user with the ability to edit users.
 *
 * @param WP_REST_Request $request
 * @return bool
 */
function permissions( WP_REST_Request $request ) {
	if ( current_user_can( 'edit_users' ) ) {
		return true;
	}

	return get_current_user_id() === intval( $request->get_param( 'user' ) );
}

/**
 * Add the destination.
 */
Destination::register( 'dashboard', __NAMESPACE__ . '\dashboard_handler' )
	->add_ui( __( 'Dashboard', 'hm-workflows' ) );

/**
 * Handle adding notifications.
 *
 * @param array $recipients
 * @param array $message
 */
function dashboard_handler( array $recipients, array $message ) {
	foreach ( $recipients as $recipient ) {
		if ( ! is_a( $recipient, 'WP_User' ) ) {
			continue;
		}

		$request = new WP_REST_Request( 'POST' );
		$request->set_url_params( [ 'user' => $recipient->ID ] );
		$request->set_body_params( $message );

		create( $request );
	}
}

/**
 * Add placeholder markup for React portals.
 */
add_action( 'add_admin_bar_menus', __NAMESPACE__ . '\admin_bar_notices', 1 );
add_action( 'user_admin_notices', __NAMESPACE__ . '\user_notices' );

function admin_bar_notices() {
	global $wp_admin_bar;

	$wp_admin_bar->add_menu( [
		'id'    => 'hm-workflows-user-notifications-bar',
		'title' => '<span class="ab-icon"></span><span class="screen-reader-text">' . esc_html__( 'Notifications', 'hm-workflows' ) . '</span>',
		'meta'  => [
			'class' => 'ab-top-secondary',
		],
	] );

	$wp_admin_bar->add_node( [
		'id'     => 'hm-workflows-user-notifications-bar-node',
		'parent' => 'hm-workflows-user-notifications-bar',
	] );
}

function user_notices() {
	if ( ! is_admin_bar_showing() ) {
		printf( '<ul id="hm-workflows-user-notifications" data-user-id="%d"></ul>', get_current_user_id() );
	}
}
