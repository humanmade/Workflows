<?php
/**
 * Built in event for new editorial comments.
 */

namespace HM\Workflows;

use WP_Comment;
use WP_Comment_Query;
use WP_Query;

Event::register( 'new_editorial_comment' )
	->add_ui( __( 'A new editorial comment was added', 'hm-workflows' ) )
	->set_listener( [
		'action'        => 'wp_insert_comment',
		'callback'      => function ( $id, WP_Comment $comment ) {
			if ( $comment->comment_type !== 'workflow' ) {
				return null;
			}

			return $comment;
		},
		'accepted_args' => 2,
	] )
	->add_message_tags( [
		'comment.author' => function ( WP_Comment $comment ) {
			return $comment->comment_author;
		},
		'comment.text'   => function ( WP_Comment $comment ) {
			return $comment->comment_content;
		},
		'assignees'      => function ( WP_Comment $comment ) {
			$assignees = get_comment_meta( $comment->comment_ID, 'assignees' );
			$assignees = array_map( function ( $user_id ) {
				return get_user_by( 'id', $user_id )->get( 'display_name' );
			}, $assignees );

			return implode( ', ', $assignees );
		},
		'post.title'     => function ( WP_Comment $comment ) {
			return get_the_title( $comment->comment_post_ID );
		},
		'post.url'       => function ( WP_Comment $comment ) {
			$post = get_post( $comment->comment_post_ID );
			if ( $post->post_status !== 'publish' ) {
				return get_preview_post_link( $post );
			}

			return get_the_permalink( $post );
		},
	] )
	->add_message_action(
		'preview',
		__( 'Preview post', 'hm-workflows' ),
		function ( $post_id ) {
			return get_preview_post_link( $post_id );
		},
		function ( WP_Comment $comment ) {
			return [ 'post_id' => $comment->comment_post_ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_message_action(
		'edit',
		__( 'Edit post', 'hm-workflows' ),
		function ( $post_id ) {
			return get_edit_post_link( $post_id, 'raw' );
		},
		function ( WP_Comment $comment ) {
			return [ 'post_id' => $comment->comment_post_ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_recipient_handler(
		'assignees',
		function ( WP_Comment $comment ) {
			return array_map( function ( $user_id ) {
				return get_user_by( 'id', $user_id );
			}, (array) get_comment_meta( $comment->comment_ID, 'assignees' ) );
		},
		__( 'Assignees', 'hm-workflows' )
	);



/**
 * Add custom meta box for editorial comments.
 */

/**
 * Add the default post type editorial comment support.
 *
 * @return void
 */
function add_default_editorial_comment_support() {
	add_post_type_support( 'post', 'editorial-comments' );
	add_post_type_support( 'page', 'editorial-comments' );
	add_post_type_support( 'attachment', 'editorial-comments' );
}

add_action( 'init', __NAMESPACE__ . '\add_default_editorial_comment_support', 9 );

/**
 * Add the metabox.
 *
 * @param string  $post_type
 * @param WP_Post $post
 */
function editorial_coments_metabox( $post_type, $post ) {
	if ( ! post_type_supports( $post_type, 'editorial-comments' ) ) {
		return;
	}

	add_meta_box(
		'hm.workflows.editorial-comments',
		__( 'Workflow', 'hm-workflows' ),
		function ( $post ) {
			printf( '<div id="hm-workflows-comments" data-post-id="%d"></div>', $post->ID );
		},
		$post_type,
		'normal'
	);
}

add_action( 'add_meta_boxes', __NAMESPACE__ . '\editorial_coments_metabox', 20, 2 );

/**
 * Remove rows actions for workflow comments.
 *
 * @param array $actions
 * @param WP_Comment $comment
 * @return array
 */
function comment_row_actions( $actions, $comment ) {
	if ( $comment->comment_type === 'workflow' ) {
		return [];
	}

	return $actions;
}

add_filter( 'comment_row_actions', __NAMESPACE__ . '\comment_row_actions', 10, 2 );

/**
 * Filter the default comments query to ignore workflow comments.
 *
 * @param WP_Comment_Query $query
 */
function comments_query( WP_Comment_Query $query ) {
	if ( $query->query_vars['type'] === 'workflow' ) {
		return;
	}


	// Exclude workflow comments everywhere.
	$not_in   = $query->query_vars['type__not_in'] ?: [];
	$not_in[] = 'workflow';

	$query->query_vars['type__not_in'] = $not_in;
}

add_action( 'pre_get_comments', __NAMESPACE__ . '\comments_query' );

/**
 * Register assignees meta.
 */
function assignees_api() {

	// Post assignees.
	register_meta( 'post', 'assignees', [
		'type'          => 'integer',
		'description'   => __( 'The assignees user IDs for this post.', 'hm-workflows' ),
		'single'        => false,
		'auth_callback' => function ( $allowed, $meta_key, $post_id, $user_id ) {
			return user_can( $user_id, 'edit_post', $post_id );
		},
		'show_in_rest'  => true,
		'schema'        => [
			'type'    => 'array',
			'default' => [],
			'items'   => [
				'type' => 'integer',
			],
		],
	] );

	// Editorial comment assignees.
	register_meta( 'comment', 'assignees', [
		'type'              => 'number',
		'description'       => __( 'The new assignees set with this comment.', 'hm-workflows' ),
		'single'            => false,
		'auth_callback'     => function () {
			return is_user_logged_in();
		},
		'show_in_rest'      => true,
		'schema'        => [
			'type'    => 'array',
			'default' => [],
			'items'   => [
				'type' => 'integer',
			],
		],
	] );

}

add_action( 'init', __NAMESPACE__ . '\assignees_api' );

/**
 * Add a link in the admin to filter by assigned posts.
 */
function add_assignee_filter_link() {

	$valid_post_types = get_post_types( [ 'public' => true ] );

	foreach ( $valid_post_types as $post_type ) {
		add_filter( "views_edit-{$post_type}", function ( $views ) use ( $post_type ) {
			global $wpdb;

			$url = add_query_arg( [
				'post_type' => $post_type,
				'assigned'  => get_current_user_id(),
			], 'edit.php' );

			$class = filter_input( INPUT_GET, 'assigned', FILTER_SANITIZE_NUMBER_INT ) ? 'current' : '';

			$class_html = sprintf(
				' class="%s"',
				esc_attr( $class )
			);

			$aria_current = '';

			if ( 'current' === $class ) {
				$aria_current = ' aria-current="page"';
			}

			$assigned_posts_count = intval( $wpdb->get_var( $wpdb->prepare( "
				SELECT COUNT( 1 )
				FROM $wpdb->posts p
				LEFT JOIN $wpdb->postmeta pm ON p.ID = pm.post_id
				WHERE p.post_type = %s
				AND p.post_status NOT IN ( '" . implode( "','", [ 'trash' ] ) . "' )
				AND p.post_author = %d
				AND pm.meta_key = 'assignees'
				AND pm.meta_value = %s
			", $post_type, get_current_user_id(), get_current_user_id() ) ) );

			$label = esc_html__( 'Assigned to me', 'hm-workflows' );

			$views['assigned'] = sprintf(
				'<a href="%s"%s%s>%s</a> (%d)',
				esc_url( $url ),
				$class_html,
				$aria_current,
				$label,
				$assigned_posts_count
			);

			return $views;
		} );
	}
}

add_action( 'admin_init', __NAMESPACE__ . '\add_assignee_filter_link' );

/**
 * Filter main admin query by assigned posts.
 *
 * @param WP_Query $query
 */
function pre_get_posts_admin( WP_Query $query ) {
	if ( ! is_admin() || ! $query->is_main_query() ) {
		return;
	}

	$assignee = filter_input( INPUT_GET, 'assigned', FILTER_SANITIZE_NUMBER_INT );

	if ( ! $assignee ) {
		return;
	}

	$meta_query = $query->get( 'meta_query' ) ?: [];

	$assignee_meta_query = [
		'key'   => 'assignees',
		'value' => $assignee,
	];

	if ( ! empty( $meta_query ) ) {
		$meta_query = [
			'relation' => 'AND',
			'original' => $meta_query,
			'assignee' => $assignee_meta_query,
		];
	} else {
		$meta_query['assignee'] = $assignee_meta_query;
	}

	$query->set( 'meta_query', $meta_query );
}

add_action( 'pre_get_posts', __NAMESPACE__ . '\pre_get_posts_admin' );
