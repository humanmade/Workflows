<?php
/**
 * Built in events for post status transitions.
 */

namespace HM\Workflows;

function get_messages_tags() {
	return [
		'title'   => function ( $post ) {
			return get_post( $post )->post_title;
		},
		'excerpt' => function ( $post ) {
			if ( has_excerpt( $post ) ) {
				return get_the_excerpt( $post );
			} else {
				$post = get_post( $post );
				setup_postdata( $post );
				$excerpt = get_the_excerpt();
				wp_reset_postdata();

				return $excerpt;
			}
		},
		'content' => function ( $post ) {
			return apply_filters( 'the_content', get_post( $post )->post_content );
		},
		'author'  => function ( $post ) {
			$post = get_post( $post );
			setup_postdata( $post );
			$author = get_the_author();
			wp_reset_postdata();

			return $author;
		},
		'url'     => function ( $post ) {
			$post = get_post( $post );
			if ( $post->post_status !== 'publish' ) {
				return get_preview_post_link( $post );
			}

			return get_the_permalink( $post );
		},
	];
}

Event::register( 'draft_to_pending' )
	->add_message_tags( get_messages_tags() )
	->add_message_action(
		'preview',
		__( 'Preview post', 'hm-workflows' ),
		function ( $post_id ) {
			return get_preview_post_link( $post_id );
		},
		function ( $post ) {
			return [ 'post_id' => get_post( $post )->ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_message_action(
		'edit',
		__( 'Edit post', 'hm-workflows' ),
		function ( $post_id ) {
			return get_edit_post_link( $post_id, 'raw' );
		},
		function ( $post ) {
			return [ 'post_id' => get_post( $post )->ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_message_action(
		'publish',
		__( 'Publish post', 'hm-workflows' ),
		function ( $post_id ) {
			if ( current_user_can( 'edit_post', $post_id ) ) {
				wp_publish_post( $post_id );
			}

			return get_the_permalink( $post_id );
		},
		function ( $post ) {
			return [ 'post_id' => get_post( $post )->ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_ui( __( 'A post is pending review', 'hm-workflows' ) );

Event::register( 'publish_post' )
	->set_listener( [
		'action'        => 'transition_post_status',
		'callback'      => function ( $new_status, $old_status, \WP_Post $post ) {
			if ( $new_status === $old_status ) {
				return null;
			}

			if ( $post->post_type !== 'post' ) {
				return null;
			}

			if ( $new_status !== 'publish' ) {
				return null;
			}

			return [ $post, $old_status, $new_status ];
		},
		'accepted_args' => 3,
	] )
	->add_message_tags( get_messages_tags() )
	->add_message_action(
		'view',
		__( 'View post', 'hm-workflows' ),
		function ( $post_id ) {
			return get_the_permalink( $post_id );
		},
		function ( $post ) {
			return [ 'post_id' => get_post( $post )->ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_ui( __( 'A post is published', 'hm-workflows' ) );

Event::register( 'publish_page' )
	->set_listener( [
		'action'        => 'transition_post_status',
		'callback'      => function ( $new_status, $old_status, \WP_Post $post ) {
			if ( $new_status === $old_status ) {
				return null;
			}

			if ( $post->post_type !== 'page' ) {
				return null;
			}

			if ( $new_status !== 'publish' ) {
				return null;
			}

			return [ $post, $old_status, $new_status ];
		},
		'accepted_args' => 3,
	] )
	->add_message_tags( get_messages_tags() )
	->add_message_action(
		'view',
		__( 'View post', 'hm-workflows' ),
		function ( $post_id ) {
			return get_the_permalink( $post_id );
		},
		function ( $post ) {
			return [ 'post_id' => get_post( $post )->ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_ui( __( 'A page is published', 'hm-workflows' ) );

Event::register( 'transition_post_status' )
	->set_listener( [
		'action'        => 'transition_post_status',
		'callback'      => function ( $new_status, $old_status, \WP_Post $post, $ui_data ) {
			if ( empty( $ui_data ) || ! isset( $ui_data['from'], $ui_data['to'], $ui_data['types'] ) ) {
				return null;
			}

			if ( ! in_array( $old_status, $ui_data['from'], true ) ) {
				return null;
			}

			if ( $new_status !== $ui_data['to'] ) {
				return null;
			}

			if ( ! in_array( $post->post_type, $ui_data['types'], true ) ) {
				return null;
			}

			if ( $new_status === $old_status ) {
				return null;
			}

			return [ $post, $old_status, $new_status ];
		},
		'accepted_args' => 3,
	] )
	->add_message_tags( get_messages_tags() )
	->add_message_tags( [
		'old_status' => function ( $post, $old_status ) {
			$status = get_post_status_object( $old_status );

			return $status->label;
		},
		'new_status' => function ( $post, $old_status, $new_status ) {
			$status = get_post_status_object( $new_status );

			return $status->label;
		},
	] )
	->add_message_action(
		'view',
		__( 'View post', 'hm-workflows' ),
		function ( $post_id ) {
			$post = get_post( $post_id );

			if ( $post->post_status === 'publish' ) {
				return get_the_permalink( $post_id );
			}

			return get_preview_post_link( $post_id );
		},
		function ( $post ) {
			return [ 'post_id' => get_post( $post )->ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_message_action(
		'edit',
		__( 'Edit post', 'hm-workflows' ),
		function ( $post_id ) {
			return get_edit_post_link( $post_id, 'raw' );
		},
		function ( $post ) {
			return [ 'post_id' => get_post( $post )->ID ];
		},
		[ 'post_id' => 'intval' ]
	)
	->add_ui( __( 'When a post changes status', 'hm-workflows' ) )
	->get_ui()
	->add_field( 'from', __( 'From statuses', 'hm-workflows' ), 'select', [
		'multi'   => true,
		'options' => array_values( array_map( function ( $status ) {
			return [
				'label' => $status->label,
				'value' => $status->name,
			];
		}, get_post_stati( [ 'internal' => false ], 'objects' ) ) ),
	] )
	->add_field( 'to', __( 'To status', 'hm-workflows' ), 'select', [
		'options' => array_values( array_map( function ( $status ) {
			return [
				'label' => $status->label,
				'value' => $status->name,
			];
		}, get_post_stati( [ 'internal' => false ], 'objects' ) ) ),
	] )
	->add_field( 'types', __( 'For post types', 'hm-workflows' ), 'select', [
		'multi'   => true,
		'options' => array_values( array_map( function ( \WP_Post_Type $post_type ) {
			return [
				'label' => $post_type->label,
				'value' => $post_type->name,
			];
		}, get_post_types( [ 'public' => true ], 'objects' ) ) ),
	] );
