<?php
/**
 * Built in workflows for post status transitions.
 */

namespace HM\Workflows;

Workflow::register( 'email-draft-to-pending' )
	->when( 'draft_to_pending' )
	->what( __( '%title% is awaiting review', 'hm-workflows' ) )
	->who( 'editor' )
	->where( 'email' );

Workflow::register( 'email-publish-post' )
	->when( 'publish_post' )
	->what( __( '%title% has been published', 'hm-workflows' ) )
	->who( 'post_author' )
	->where( 'email' );

Workflow::register( 'email-publish-page' )
	->when( 'publish_page' )
	->what( __( '%title% has been published', 'hm-workflows' ) )
	->who( 'post_author' )
	->where( 'email' );
