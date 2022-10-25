<?php
/**
 * Plugin Name: Workflows
 * Plugin URI: https://github.com/humanmade/Workflows
 * Description: A flexible workflows framework for WordPress
 * Version: 0.4.6
 * Author: Human Made Limited
 * Author URI: https://humanmade.com
 * Text Domain: hm-workflows
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /languages
 *
 * @package HM\Workflows
 * @since   0.1.0
 */

namespace HM\Workflows;

require_once __DIR__ . '/inc/namespace.php';
require_once __DIR__ . '/admin/admin.php';

// Load built ins early so they can be modified consistently.
add_action( 'plugins_loaded', function () {
	require_once __DIR__ . '/lib/destinations/email.php';
	require_once __DIR__ . '/lib/destinations/slack.php';
	require_once __DIR__ . '/lib/destinations/dashboard.php';
	require_once __DIR__ . '/lib/events/transition-post-status.php';
	require_once __DIR__ . '/lib/events/new-comment.php';
	require_once __DIR__ . '/lib/events/new-editorial-comment.php';
	require_once __DIR__ . '/lib/recipients/post-assignee.php';
	require_once __DIR__ . '/lib/recipients/post-author.php';
}, 9 );

// Run a consistent hook to load all the stored Workflows.
add_action( 'init', function () {
	do_action( 'hm.workflows.init' );
}, 20 );
