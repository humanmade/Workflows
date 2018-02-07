<?php
/*
Plugin Name: Workflow
Plugin URI: https://github.com/humanmade/Workflow
Description: Powerful workflows for WordPress
Version: 0.1.0
Author: Human Made Limited
Author URI: https://humanmade.com
Text Domain: hm-workflow
License: GPL-2.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.txt
Domain Path: /languages
*/

namespace HM\Workflow;

require_once __DIR__ . '/inc/namespace.php';

add_action( 'plugins_loaded', function() {
		$wf = Workflow::register( 'draft_to_pending' )
		->when( 'draft_to_pending' )
		->what( 'Post is ready to publish' )
		->who( 'editor' )
		->where( 'email' );
});
