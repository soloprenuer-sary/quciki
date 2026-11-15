<?php
/**
 * Plugin Name: Quciki Headless
 * Description: Content backend for the Quciki Next.js site. Manage guides, calculator text, legal pages, SEO, redirects and site settings, and publish them to the frontend.
 * Version: 1.0.0
 * Requires PHP: 7.4
 * Author: Quciki
 * License: GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'QUCIKI_VERSION', '1.0.0' );
define( 'QUCIKI_DIR', plugin_dir_path( __FILE__ ) );

/* ------------------------------------------------------------------ *
 * Site data (calculator slugs, categories, page paths).
 * Generated from the Next.js project with `npm run wp:export`.
 * ------------------------------------------------------------------ */

function quciki_site_data() {
	static $data = null;
	if ( null === $data ) {
		$file = QUCIKI_DIR . 'data/site-data.json';
		$json = is_readable( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : null;
		$data = is_array( $json ) ? $json : array( 'categories' => array(), 'calculators' => array(), 'paths' => array() );
	}
	return $data;
}

function quciki_categories() {
	$out = array();
	foreach ( quciki_site_data()['categories'] as $c ) {
		$out[ $c['slug'] ] = $c['name'];
	}
	return $out ? $out : array(
		'real-estate'  => 'Real Estate',
		'construction' => 'Construction',
		'finance'      => 'Personal Finance',
		'auto'         => 'Auto',
		'business'     => 'Business',
	);
}

function quciki_legal_pages() {
	return array(
		'privacy-policy' => 'Privacy Policy',
		'terms'          => 'Terms of Use',
		'disclaimer'     => 'Disclaimer',
	);
}

/* ------------------------------------------------------------------ *
 * Post types
 * ------------------------------------------------------------------ */

add_action( 'init', 'quciki_register_post_types' );
function quciki_register_post_types() {
	$common = array(
		'public'              => false,
		'show_ui'             => true,
		'show_in_menu'        => 'quciki',
		'show_in_rest'        => true, // Gutenberg needs REST for the block editor. Content is only exposed by our own endpoint.
		'exclude_from_search' => true,
		'publicly_queryable'  => false,
		'has_archive'         => false,
		'rewrite'             => false,
		'query_var'           => false,
	);

	register_post_type( 'qk_guide', array_merge( $common, array(
		'labels'          => quciki_labels( 'Guide', 'Guides' ),
		'supports'        => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'author' ),
		'capability_type' => 'post',
	) ) );
	register_post_type( 'qk_calc', array_merge( $common, array(
		'labels'          => quciki_labels( 'Calculator text', 'Calculator text' ),
		'supports'        => array( 'title', 'revisions' ),
		'show_in_rest'    => false,
		'capability_type' => 'post',
	) ) );
	register_post_type( 'qk_page', array_merge( $common, array(
		'labels'          => quciki_labels( 'Legal page', 'Legal pages' ),
		'supports'        => array( 'title', 'editor', 'revisions' ),
		'capability_type' => 'page',
	) ) );
	register_post_type( 'qk_seo', array_merge( $common, array(
		'labels'          => quciki_labels( 'SEO override', 'SEO overrides' ),
		'supports'        => array( 'title' ),
		'show_in_rest'    => false,
		'capability_type' => 'page',
	) ) );
	register_post_type( 'qk_redirect', array_merge( $common, array(
		'labels'          => quciki_labels( 'Redirect', 'Redirects' ),
		'supports'        => array( 'title' ),
		'show_in_rest'    => false,
		'capability_type' => 'page',
	) ) );
}

function quciki_labels( $singular, $plural ) {
	return array(
		'name'          => $plural,
		'singular_name' => $singular,
		'add_new_item'  => 'Add new ' . strtolower( $singular ),
		'edit_item'     => 'Edit ' . strtolower( $singular ),
		'new_item'      => 'New ' . strtolower( $singular ),
		'all_items'     => $plural,
		'not_found'     => 'None found.',
		'menu_name'     => $plural,
	);
}

add_action( 'admin_menu', 'quciki_admin_menu', 5 );
function quciki_admin_menu() {
	add_menu_page( 'Quciki', 'Quciki', 'edit_posts', 'quciki', 'quciki_dashboard_page', 'dashicons-calculator', 25 );
	add_submenu_page( 'quciki', 'Quciki settings', 'Settings', 'manage_options', 'quciki-settings', 'quciki_settings_page' );
}

/* ------------------------------------------------------------------ *
 * Settings
 * ------------------------------------------------------------------ */

function quciki_settings() {
	$defaults = array(
		'frontend_url'        => '',
		'revalidate_secret'   => '',
		'adsense_client'      => '',
		'adsense_slot_results' => '',
		'adsense_slot_content' => '',
		'contact_email'       => '',
		'google_verification' => '',
	);
	$stored = get_option( 'quciki_settings', array() );
	return array_merge( $defaults, is_array( $stored ) ? $stored : array() );
}

/** Settings sent to the frontend. Never include the secret or frontend URL. */
function quciki_public_setting_keys() {
	return array( 'adsense_client', 'adsense_slot_results', 'adsense_slot_content', 'contact_email', 'google_verification' );
}

function quciki_clean_https_url( $url ) {
	$url = trim( (string) $url );
	if ( '' === $url ) {
		return '';
	}
	$url = esc_url_raw( $url, array( 'https', 'http' ) );
	return $url ? untrailingslashit( $url ) : '';
}

function quciki_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'You do not have permission to view this page.' );
	}
	$notice = '';
	if ( isset( $_POST['quciki_settings_nonce'] ) ) {
		check_admin_referer( 'quciki_save_settings', 'quciki_settings_nonce' );
		$in  = wp_unslash( $_POST );
		$new = array(
			'frontend_url'         => quciki_clean_https_url( isset( $in['frontend_url'] ) ? $in['frontend_url'] : '' ),
			'revalidate_secret'    => preg_replace( '/[^A-Za-z0-9_\-]/', '', isset( $in['revalidate_secret'] ) ? $in['revalidate_secret'] : '' ),
			'adsense_client'       => preg_match( '/^ca-pub-\d{10,20}$/', isset( $in['adsense_client'] ) ? trim( $in['adsense_client'] ) : '' ) ? trim( $in['adsense_client'] ) : '',
			'adsense_slot_results' => preg_replace( '/\D/', '', isset( $in['adsense_slot_results'] ) ? $in['adsense_slot_results'] : '' ),
			'adsense_slot_content' => preg_replace( '/\D/', '', isset( $in['adsense_slot_content'] ) ? $in['adsense_slot_content'] : '' ),
			'contact_email'        => sanitize_email( isset( $in['contact_email'] ) ? $in['contact_email'] : '' ),
			'google_verification'  => preg_replace( '/[^A-Za-z0-9_\-]/', '', isset( $in['google_verification'] ) ? $in['google_verification'] : '' ),
		);
		update_option( 'quciki_settings', $new, false );
		quciki_mark_dirty();
		$notice = 'Settings saved.';
	}
	$s = quciki_settings();
	echo '<div class="wrap"><h1>Quciki settings</h1>';
	if ( $notice ) {
		echo '<div class="notice notice-success"><p>' . esc_html( $notice ) . '</p></div>';
	}
	echo '<form method="post">';
	wp_nonce_field( 'quciki_save_settings', 'quciki_settings_nonce' );
	echo '<h2>Connection to the website</h2><table class="form-table" role="presentation">';
	quciki_setting_row( 'frontend_url', 'Website URL', $s, 'https://your-site.vercel.app (no trailing slash). WordPress calls this address to refresh pages when you publish.' );
	quciki_setting_row( 'revalidate_secret', 'Refresh secret', $s, 'At least 16 characters. Must equal REVALIDATE_SECRET in your Vercel environment variables.' );
	echo '</table><h2>Site settings (public)</h2><p>These values are sent to the website. Do not enter anything secret.</p><table class="form-table" role="presentation">';
	quciki_setting_row( 'contact_email', 'Contact email', $s, 'Shown on the Contact page and footer.' );
	quciki_setting_row( 'adsense_client', 'AdSense publisher ID', $s, 'ca-pub-0000000000000000. Leave empty until AdSense approves the site.' );
	quciki_setting_row( 'adsense_slot_results', 'AdSense ad unit: results', $s, 'Numbers only.' );
	quciki_setting_row( 'adsense_slot_content', 'AdSense ad unit: content', $s, 'Numbers only.' );
	quciki_setting_row( 'google_verification', 'Search Console verification code', $s, 'Only the code from the meta tag content value.' );
	echo '</table>';
	submit_button( 'Save settings' );
	echo '</form></div>';
}

function quciki_setting_row( $key, $label, $s, $help ) {
	printf(
		'<tr><th scope="row"><label for="%1$s">%2$s</label></th><td><input class="regular-text" type="text" id="%1$s" name="%1$s" value="%3$s" autocomplete="off"><p class="description">%4$s</p></td></tr>',
		esc_attr( $key ),
		esc_html( $label ),
		esc_attr( $s[ $key ] ),
		esc_html( $help )
	);
}

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

function quciki_dashboard_page() {
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die( 'You do not have permission to view this page.' );
	}
	$s       = quciki_settings();
	$counts  = array();
	foreach ( array( 'qk_guide' => 'Guides', 'qk_calc' => 'Calculator texts', 'qk_page' => 'Legal pages', 'qk_seo' => 'SEO overrides', 'qk_redirect' => 'Redirects' ) as $type => $label ) {
		$c               = wp_count_posts( $type );
		$counts[ $label ] = isset( $c->publish ) ? (int) $c->publish : 0;
	}
	echo '<div class="wrap"><h1>Quciki</h1>';
	if ( '' === $s['frontend_url'] || strlen( $s['revalidate_secret'] ) < 16 ) {
		echo '<div class="notice notice-warning"><p>The website is not connected yet. Open <a href="' . esc_url( admin_url( 'admin.php?page=quciki-settings' ) ) . '">Settings</a> and add the Website URL and Refresh secret, so publishing updates the site right away.</p></div>';
	}
	echo '<p>Published items (each one replaces the built-in text on the website):</p><ul style="list-style:disc;margin-left:20px">';
	foreach ( $counts as $label => $n ) {
		echo '<li>' . esc_html( $label ) . ': <strong>' . (int) $n . '</strong></li>';
	}
	echo '</ul>';
	echo '<p>Content endpoint: <code>' . esc_html( rest_url( 'quciki/v1/content' ) ) . '</code></p>';
	echo '<p>Drafts, scheduled and trashed items are never sent to the website. Anything you leave out falls back to the text built into the website.</p></div>';
}

/* ------------------------------------------------------------------ *
 * Meta boxes
 * ------------------------------------------------------------------ */

add_action( 'add_meta_boxes', 'quciki_add_meta_boxes' );
function quciki_add_meta_boxes() {
	add_meta_box( 'qk_guide_box', 'Guide details', 'quciki_box_guide', 'qk_guide', 'side', 'high' );
	add_meta_box( 'qk_seo_fields', 'SEO for this guide', 'quciki_box_seo_fields', 'qk_guide', 'normal', 'default' );
	add_meta_box( 'qk_page_box', 'Review', 'quciki_box_page', 'qk_page', 'side', 'high' );
	add_meta_box( 'qk_page_seo', 'SEO for this page', 'quciki_box_seo_fields', 'qk_page', 'normal', 'default' );
	add_meta_box( 'qk_calc_box', 'Calculator text', 'quciki_box_calc', 'qk_calc', 'normal', 'high' );
	add_meta_box( 'qk_seo_box', 'SEO override', 'quciki_box_seo', 'qk_seo', 'normal', 'high' );
	add_meta_box( 'qk_redirect_box', 'Redirect', 'quciki_box_redirect', 'qk_redirect', 'normal', 'high' );
}

function quciki_field( $post, $key, $default = '' ) {
	$v = get_post_meta( $post->ID, '_qk_' . $key, true );
	return '' === $v ? $default : (string) $v;
}

function quciki_text_input( $post, $key, $label, $help = '', $type = 'text' ) {
	printf(
		'<p><label for="qk_%1$s"><strong>%2$s</strong></label><br><input class="widefat" type="%5$s" id="qk_%1$s" name="qk_%1$s" value="%3$s">%4$s</p>',
		esc_attr( $key ),
		esc_html( $label ),
		esc_attr( quciki_field( $post, $key ) ),
		$help ? '<br><span class="description">' . esc_html( $help ) . '</span>' : '',
		esc_attr( $type )
	);
}

function quciki_textarea( $post, $key, $label, $help, $rows = 5 ) {
	printf(
		'<p><label for="qk_%1$s"><strong>%2$s</strong></label><br><textarea class="widefat" rows="%5$d" id="qk_%1$s" name="qk_%1$s">%3$s</textarea><span class="description">%4$s</span></p>',
		esc_attr( $key ),
		esc_html( $label ),
		esc_textarea( quciki_field( $post, $key ) ),
		esc_html( $help ),
		(int) $rows
	);
}

function quciki_box_guide( $post ) {
	wp_nonce_field( 'quciki_save_post', 'quciki_nonce' );
	$cat = quciki_field( $post, 'category', 'real-estate' );
	echo '<p><label for="qk_category"><strong>Category</strong></label><br><select class="widefat" id="qk_category" name="qk_category">';
	foreach ( quciki_categories() as $slug => $name ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $slug ), selected( $cat, $slug, false ), esc_html( $name ) );
	}
	echo '</select></p>';
	$calc = quciki_field( $post, 'calculator_slug' );
	echo '<p><label for="qk_calculator_slug"><strong>Related calculator</strong></label><br><select class="widefat" id="qk_calculator_slug" name="qk_calculator_slug"><option value="">None</option>';
	foreach ( quciki_site_data()['calculators'] as $c ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $c['slug'] ), selected( $calc, $c['slug'], false ), esc_html( $c['name'] ) );
	}
	echo '</select></p>';
	echo '<p class="description">Write the short summary in the Excerpt box. It becomes the meta description and the intro line. The permalink slug becomes the URL: /guides/your-slug. Use Gutenberg headings level 2 (H2) for sections.</p>';
}

function quciki_box_page( $post ) {
	wp_nonce_field( 'quciki_save_post', 'quciki_nonce' );
	$slug = quciki_field( $post, 'page_slug' );
	echo '<p><label for="qk_page_slug"><strong>Page</strong></label><br><select class="widefat" id="qk_page_slug" name="qk_page_slug"><option value="">Choose a page</option>';
	foreach ( quciki_legal_pages() as $s => $name ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $s ), selected( $slug, $s, false ), esc_html( $name ) );
	}
	echo '</select></p>';
	quciki_text_input( $post, 'reviewed_by', 'Reviewed by', 'Name of the legal advisor or accounting firm. Shown on the page.' );
	quciki_text_input( $post, 'reviewed_at', 'Review date', 'Shown as "Last reviewed". Leave empty to show the last updated date.', 'date' );
}

function quciki_box_calc( $post ) {
	wp_nonce_field( 'quciki_save_post', 'quciki_nonce' );
	$slug = quciki_field( $post, 'calc_slug' );
	echo '<p><label for="qk_calc_slug"><strong>Calculator</strong></label><br><select class="widefat" id="qk_calc_slug" name="qk_calc_slug"><option value="">Choose a calculator</option>';
	foreach ( quciki_site_data()['calculators'] as $c ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $c['slug'] ), selected( $slug, $c['slug'], false ), esc_html( $c['name'] ) );
	}
	echo '</select><span class="description">The calculator maths stays in the website code. You edit only the text. Empty boxes keep the built-in text.</span></p>';
	quciki_text_input( $post, 'tagline', 'Tagline', 'One sentence under the calculator title.' );
	quciki_textarea( $post, 'intro', 'Intro', 'Separate paragraphs with a blank line.', 6 );
	quciki_textarea( $post, 'steps', 'How to use it (steps)', 'One step per line.', 5 );
	quciki_textarea( $post, 'formula', 'Formulas', 'One line each.', 4 );
	quciki_textarea( $post, 'example', 'Worked example', 'Separate paragraphs with a blank line.', 6 );
	quciki_textarea( $post, 'tips', 'Tips', 'One tip per line.', 5 );
	quciki_textarea( $post, 'faqs', 'FAQs', "Write each as two lines, with a blank line between items:\nQ: question\nA: answer", 10 );
}

function quciki_box_seo_fields( $post ) {
	quciki_text_input( $post, 'seo_title', 'Search title', 'Aim for 60 characters or fewer. Leave empty to use the default.' );
	quciki_textarea( $post, 'seo_description', 'Meta description', 'Aim for 150 to 160 characters. Leave empty to use the default.', 3 );
	quciki_text_input( $post, 'seo_canonical', 'Canonical URL', 'Leave empty unless this page duplicates another.' );
	quciki_text_input( $post, 'seo_og_image', 'Social image URL', 'Full https:// address of a 1200x630 image.' );
	printf( '<p><label><input type="checkbox" name="qk_seo_noindex" value="1"%s> Hide from search engines (noindex)</label></p>', checked( quciki_field( $post, 'seo_noindex' ), '1', false ) );
}

function quciki_box_seo( $post ) {
	wp_nonce_field( 'quciki_save_post', 'quciki_nonce' );
	$path = quciki_field( $post, 'seo_path' );
	echo '<p><label for="qk_seo_path"><strong>Page</strong></label><br><input class="widefat" list="qk_paths" id="qk_seo_path" name="qk_seo_path" value="' . esc_attr( $path ) . '" placeholder="/real-estate/mortgage-calculator"><datalist id="qk_paths">';
	foreach ( quciki_site_data()['paths'] as $p ) {
		printf( '<option value="%s">%s</option>', esc_attr( $p['path'] ), esc_html( $p['label'] ) );
	}
	echo '</datalist><span class="description">Start typing to pick a page, or enter any path that starts with /. For guides and legal pages, use the SEO box on that item instead.</span></p>';
	quciki_box_seo_fields( $post );
}

function quciki_box_redirect( $post ) {
	wp_nonce_field( 'quciki_save_post', 'quciki_nonce' );
	quciki_text_input( $post, 'source', 'From (old path)', 'Starts with /, no spaces, ? or #. Example: /old-page' );
	quciki_text_input( $post, 'destination', 'To (new path or https:// address)', 'Example: /real-estate/mortgage-calculator' );
	$perm = quciki_field( $post, 'permanent', '1' );
	printf( '<p><label><input type="checkbox" name="qk_permanent" value="1"%s> Permanent (308). Untick for a temporary (307) redirect.</label></p>', checked( $perm, '1', false ) );
	echo '<p class="description">Publish to turn the redirect on. Move it to Draft to turn it off. Changes apply within about a minute.</p>';
}

/* ------------------------------------------------------------------ *
 * Saving
 * ------------------------------------------------------------------ */

function quciki_clean_path( $v ) {
	$v = trim( (string) $v );
	if ( strlen( $v ) > 1 ) {
		$v = rtrim( $v, '/' );
	}
	if ( '' === $v || '/' !== $v[0] || 0 === strpos( $v, '//' ) || preg_match( '/\s/', $v ) ) {
		return '';
	}
	return strlen( $v ) <= 300 ? $v : '';
}

function quciki_clean_target( $v ) {
	$v = trim( (string) $v );
	if ( '' === $v ) {
		return '';
	}
	if ( preg_match( '#^/(?!/)\S*$#', $v ) ) {
		return strlen( $v ) <= 500 ? $v : '';
	}
	if ( preg_match( '#^https://\S+$#', $v ) ) {
		return strlen( $v ) <= 500 ? esc_url_raw( $v, array( 'https' ) ) : '';
	}
	return '';
}

add_action( 'save_post', 'quciki_save_post', 10, 2 );
function quciki_save_post( $post_id, $post ) {
	if ( ! in_array( $post->post_type, array( 'qk_guide', 'qk_calc', 'qk_page', 'qk_seo', 'qk_redirect' ), true ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( wp_is_post_revision( $post_id ) || ! isset( $_POST['quciki_nonce'] ) ) {
		return;
	}
	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['quciki_nonce'] ) ), 'quciki_save_post' ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$in = wp_unslash( $_POST );
	$get = function ( $k ) use ( $in ) {
		return isset( $in[ $k ] ) && is_string( $in[ $k ] ) ? $in[ $k ] : '';
	};
	$set = function ( $key, $value ) use ( $post_id ) {
		if ( '' === $value ) {
			delete_post_meta( $post_id, '_qk_' . $key );
		} else {
			update_post_meta( $post_id, '_qk_' . $key, $value );
		}
	};

	// SEO fields (guides, legal pages, SEO overrides).
	if ( in_array( $post->post_type, array( 'qk_guide', 'qk_page', 'qk_seo' ), true ) ) {
		$set( 'seo_title', mb_substr( sanitize_text_field( $get( 'qk_seo_title' ) ), 0, 200 ) );
		$set( 'seo_description', mb_substr( sanitize_textarea_field( $get( 'qk_seo_description' ) ), 0, 400 ) );
		$set( 'seo_canonical', quciki_clean_target( $get( 'qk_seo_canonical' ) ) );
		$set( 'seo_og_image', quciki_clean_target( $get( 'qk_seo_og_image' ) ) );
		$set( 'seo_noindex', '1' === $get( 'qk_seo_noindex' ) ? '1' : '' );
	}

	switch ( $post->post_type ) {
		case 'qk_guide':
			$cat = $get( 'qk_category' );
			$set( 'category', isset( quciki_categories()[ $cat ] ) ? $cat : 'real-estate' );
			$calc = $get( 'qk_calculator_slug' );
			$valid = wp_list_pluck( quciki_site_data()['calculators'], 'slug' );
			$set( 'calculator_slug', in_array( $calc, $valid, true ) ? $calc : '' );
			break;

		case 'qk_page':
			$slug = $get( 'qk_page_slug' );
			$set( 'page_slug', isset( quciki_legal_pages()[ $slug ] ) ? $slug : '' );
			$set( 'reviewed_by', mb_substr( sanitize_text_field( $get( 'qk_reviewed_by' ) ), 0, 200 ) );
			$date = $get( 'qk_reviewed_at' );
			$set( 'reviewed_at', preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) ? $date : '' );
			break;

		case 'qk_calc':
			$slug  = $get( 'qk_calc_slug' );
			$valid = wp_list_pluck( quciki_site_data()['calculators'], 'slug' );
			$set( 'calc_slug', in_array( $slug, $valid, true ) ? $slug : '' );
			$set( 'tagline', mb_substr( sanitize_text_field( $get( 'qk_tagline' ) ), 0, 300 ) );
			foreach ( array( 'intro', 'steps', 'formula', 'example', 'tips', 'faqs' ) as $f ) {
				$set( $f, mb_substr( sanitize_textarea_field( $get( 'qk_' . $f ) ), 0, 30000 ) );
			}
			break;

		case 'qk_seo':
			$set( 'seo_path', quciki_clean_path( $get( 'qk_seo_path' ) ) );
			break;

		case 'qk_redirect':
			$set( 'source', quciki_clean_path( $get( 'qk_source' ) ) );
			$set( 'destination', quciki_clean_target( $get( 'qk_destination' ) ) );
			update_post_meta( $post_id, '_qk_permanent', '1' === $get( 'qk_permanent' ) ? '1' : '0' );
			break;
	}
}

/* ------------------------------------------------------------------ *
 * REST endpoints (public, read-only)
 * ------------------------------------------------------------------ */

add_action( 'rest_api_init', function () {
	register_rest_route( 'quciki/v1', '/content', array(
		'methods'             => 'GET',
		'callback'            => 'quciki_rest_content',
		'permission_callback' => '__return_true',
	) );
	register_rest_route( 'quciki/v1', '/redirects', array(
		'methods'             => 'GET',
		'callback'            => 'quciki_rest_redirects',
		'permission_callback' => '__return_true',
	) );
} );

function quciki_published( $type ) {
	return get_posts( array(
		'post_type'        => $type,
		'post_status'      => 'publish',
		'posts_per_page'   => 500,
		'orderby'          => 'date',
		'order'            => 'DESC',
		'no_found_rows'    => true,
		'suppress_filters' => false,
	) );
}

function quciki_meta( $id, $key ) {
	return (string) get_post_meta( $id, '_qk_' . $key, true );
}

function quciki_seo_from( $id, $path ) {
	$title = quciki_meta( $id, 'seo_title' );
	$desc  = quciki_meta( $id, 'seo_description' );
	$canon = quciki_meta( $id, 'seo_canonical' );
	$og    = quciki_meta( $id, 'seo_og_image' );
	$noidx = '1' === quciki_meta( $id, 'seo_noindex' );
	if ( '' === $path || ( '' === $title && '' === $desc && '' === $canon && '' === $og && ! $noidx ) ) {
		return null;
	}
	return array(
		'path'        => $path,
		'title'       => $title,
		'description' => $desc,
		'canonical'   => $canon,
		'og_image'    => $og,
		'noindex'     => $noidx,
	);
}

function quciki_rest_response( $data, $max_age ) {
	$response = new WP_REST_Response( $data, 200 );
	$response->header( 'Cache-Control', 'public, max-age=' . (int) $max_age );
	return $response;
}

function quciki_rest_content() {
	$guides = array();
	$seo    = array();
	foreach ( quciki_published( 'qk_guide' ) as $p ) {
		if ( '' === $p->post_name ) {
			continue;
		}
		$guides[] = array(
			'slug'            => $p->post_name,
			'category'        => quciki_meta( $p->ID, 'category' ) ?: 'real-estate',
			'title'           => get_the_title( $p ),
			'description'     => wp_strip_all_tags( $p->post_excerpt ),
			'body_html'       => apply_filters( 'the_content', $p->post_content ),
			'cover_url'       => (string) get_the_post_thumbnail_url( $p, 'large' ),
			'calculator_slug' => quciki_meta( $p->ID, 'calculator_slug' ),
			'published_at'    => get_post_time( 'c', true, $p ),
			'updated_at'      => get_post_modified_time( 'c', true, $p ),
		);
		$entry = quciki_seo_from( $p->ID, '/guides/' . $p->post_name );
		if ( $entry ) {
			$seo[] = $entry;
		}
	}

	$calculators = array();
	$seen        = array();
	foreach ( quciki_published( 'qk_calc' ) as $p ) {
		$slug = quciki_meta( $p->ID, 'calc_slug' );
		if ( '' === $slug || isset( $seen[ $slug ] ) ) {
			continue; // newest published text per calculator wins
		}
		$seen[ $slug ] = true;
		$calculators[] = array(
			'slug'    => $slug,
			'tagline' => quciki_meta( $p->ID, 'tagline' ),
			'intro'   => quciki_meta( $p->ID, 'intro' ),
			'steps'   => quciki_meta( $p->ID, 'steps' ),
			'formula' => quciki_meta( $p->ID, 'formula' ),
			'example' => quciki_meta( $p->ID, 'example' ),
			'tips'    => quciki_meta( $p->ID, 'tips' ),
			'faqs'    => quciki_meta( $p->ID, 'faqs' ),
		);
	}

	$pages = array();
	$taken = array();
	foreach ( quciki_published( 'qk_page' ) as $p ) {
		$slug = quciki_meta( $p->ID, 'page_slug' );
		if ( ! isset( quciki_legal_pages()[ $slug ] ) || isset( $taken[ $slug ] ) ) {
			continue;
		}
		$taken[ $slug ] = true;
		$pages[]        = array(
			'slug'        => $slug,
			'title'       => get_the_title( $p ),
			'body_html'   => apply_filters( 'the_content', $p->post_content ),
			'updated_at'  => get_post_modified_time( 'c', true, $p ),
			'reviewed_at' => quciki_meta( $p->ID, 'reviewed_at' ),
			'reviewed_by' => quciki_meta( $p->ID, 'reviewed_by' ),
		);
		$entry = quciki_seo_from( $p->ID, '/' . $slug );
		if ( $entry ) {
			$seo[] = $entry;
		}
	}

	foreach ( quciki_published( 'qk_seo' ) as $p ) {
		$entry = quciki_seo_from( $p->ID, quciki_meta( $p->ID, 'seo_path' ) );
		if ( $entry ) {
			$seo[] = $entry;
		}
	}

	$settings = array();
	$s        = quciki_settings();
	foreach ( quciki_public_setting_keys() as $k ) {
		$settings[ $k ] = (string) $s[ $k ];
	}

	return quciki_rest_response( array(
		'version'      => 1,
		'generated_at' => gmdate( 'c' ),
		'guides'       => $guides,
		'calculators'  => $calculators,
		'seo'          => $seo,
		'redirects'    => quciki_redirect_list(),
		'pages'        => $pages,
		'settings'     => $settings,
	), 30 );
}

function quciki_redirect_list() {
	$out = array();
	foreach ( quciki_published( 'qk_redirect' ) as $p ) {
		$source      = quciki_meta( $p->ID, 'source' );
		$destination = quciki_meta( $p->ID, 'destination' );
		if ( '' === $source || '' === $destination || $source === $destination ) {
			continue;
		}
		$out[] = array(
			'source'      => $source,
			'destination' => $destination,
			'permanent'   => '0' !== quciki_meta( $p->ID, 'permanent' ),
		);
	}
	return $out;
}

function quciki_rest_redirects() {
	return quciki_rest_response( quciki_redirect_list(), 30 );
}

/* ------------------------------------------------------------------ *
 * Tell the website to refresh when content changes
 * ------------------------------------------------------------------ */

$GLOBALS['quciki_dirty'] = false;

function quciki_mark_dirty() {
	$GLOBALS['quciki_dirty'] = true;
}

function quciki_is_ours( $post ) {
	return $post && in_array( $post->post_type, array( 'qk_guide', 'qk_calc', 'qk_page', 'qk_seo', 'qk_redirect' ), true );
}

add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( quciki_is_ours( $post ) && ( 'publish' === $new || 'publish' === $old ) ) {
		quciki_mark_dirty();
	}
}, 10, 3 );
add_action( 'save_post', function ( $id, $post ) {
	if ( quciki_is_ours( $post ) && 'publish' === $post->post_status && ! wp_is_post_revision( $id ) ) {
		quciki_mark_dirty();
	}
}, 99, 2 );
add_action( 'deleted_post', function ( $id, $post = null ) {
	if ( quciki_is_ours( $post ? $post : get_post( $id ) ) ) {
		quciki_mark_dirty();
	}
}, 10, 2 );

add_action( 'shutdown', 'quciki_notify_frontend' );
function quciki_notify_frontend() {
	if ( empty( $GLOBALS['quciki_dirty'] ) ) {
		return;
	}
	$s = quciki_settings();
	if ( '' === $s['frontend_url'] || strlen( $s['revalidate_secret'] ) < 16 ) {
		return;
	}
	wp_remote_post( $s['frontend_url'] . '/api/revalidate', array(
		'timeout'     => 5,
		'blocking'    => false,
		'redirection' => 0,
		'headers'     => array( 'x-revalidate-secret' => $s['revalidate_secret'] ),
	) );
}

/* ------------------------------------------------------------------ *
 * The website is the public face; keep WordPress itself out of search results.
 * ------------------------------------------------------------------ */

add_filter( 'wp_robots', function ( $robots ) {
	$robots['noindex']  = true;
	$robots['nofollow'] = true;
	return $robots;
} );
