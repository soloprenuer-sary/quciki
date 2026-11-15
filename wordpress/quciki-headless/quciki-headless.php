<?php
/**
 * Plugin Name: Quciki Headless
 * Description: Content backend for the Quciki website. Edit every page, menu, guide, SEO field and setting here, preview it on the site, and publish. Also stores contact messages, subscribers and saved estimates.
 * Version: 2.0.0
 * Requires PHP: 7.4
 * Author: Quciki
 * License: GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'QUCIKI_VERSION', '2.0.0' );
define( 'QUCIKI_DIR', plugin_dir_path( __FILE__ ) );
define( 'QUCIKI_URL', plugin_dir_url( __FILE__ ) );

require_once QUCIKI_DIR . 'includes/core.php';
require_once QUCIKI_DIR . 'includes/entries.php';
require_once QUCIKI_DIR . 'includes/preview.php';
require_once QUCIKI_DIR . 'includes/admin.php';
require_once QUCIKI_DIR . 'includes/content-types.php';
require_once QUCIKI_DIR . 'includes/seo-plugins.php';
require_once QUCIKI_DIR . 'includes/forms.php';
require_once QUCIKI_DIR . 'includes/rest.php';
require_once QUCIKI_DIR . 'includes/notify.php';

register_activation_hook( __FILE__, 'quciki_activate' );
