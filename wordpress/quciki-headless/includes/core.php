<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ------------------------------------------------------------------ *
 * Roles and capabilities
 *   quciki_edit     write and save drafts, preview
 *   quciki_publish  publish to the website
 *   quciki_review   sign off legal / calculator text (reviewer name and date)
 *   quciki_manage   settings
 * ------------------------------------------------------------------ */

function quciki_caps_for_roles() {
	return array(
		'administrator' => array( 'quciki_edit', 'quciki_publish', 'quciki_review', 'quciki_manage' ),
		'editor'        => array( 'quciki_edit', 'quciki_publish' ),
	);
}

function quciki_activate() {
	quciki_ensure_roles();
	update_option( 'quciki_version', QUCIKI_VERSION, false );
	flush_rewrite_rules();
}

function quciki_ensure_roles() {
	foreach ( quciki_caps_for_roles() as $role_name => $caps ) {
		$role = get_role( $role_name );
		if ( $role ) {
			foreach ( $caps as $cap ) {
				$role->add_cap( $cap );
			}
		}
	}
	if ( ! get_role( 'qk_reviewer' ) ) {
		add_role( 'qk_reviewer', 'Quciki reviewer', array(
			'read'                => true,
			'upload_files'        => true,
			'edit_posts'          => true,
			'edit_others_posts'   => true,
			'quciki_edit'         => true,
			'quciki_review'       => true,
		) );
	}
}

add_action( 'init', function () {
	if ( get_option( 'quciki_version' ) !== QUCIKI_VERSION ) {
		quciki_ensure_roles();
		update_option( 'quciki_version', QUCIKI_VERSION, false );
	}
}, 1 );

/* ------------------------------------------------------------------ *
 * Schema (generated from the website code with `npm run wp:export`)
 * ------------------------------------------------------------------ */

function quciki_schema() {
	static $schema = null;
	if ( null === $schema ) {
		$file   = QUCIKI_DIR . 'data/schema.json';
		$json   = is_readable( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : null;
		$schema = is_array( $json ) ? $json : array( 'categories' => array(), 'calculators' => array(), 'paths' => array(), 'entries' => array() );
		$by_key = array();
		foreach ( $schema['entries'] as $e ) {
			$fields = array();
			foreach ( $e['fields'] as $f ) {
				if ( isset( $f['item'] ) && is_array( $f['item'] ) ) {
					$items = array();
					foreach ( $f['item'] as $sub ) {
						$items[ $sub['key'] ] = $sub;
					}
					$f['item'] = $items;
				}
				$fields[ $f['key'] ] = $f;
			}
			$e['fields']      = $fields;
			$by_key[ $e['key'] ] = $e;
		}
		$schema['by_key'] = $by_key;
	}
	return $schema;
}

function quciki_entry_def( $key ) {
	$s = quciki_schema();
	return isset( $s['by_key'][ $key ] ) ? $s['by_key'][ $key ] : null;
}

function quciki_categories() {
	$out = array();
	foreach ( quciki_schema()['categories'] as $c ) {
		$out[ $c['slug'] ] = $c['name'];
	}
	return $out ? $out : array( 'real-estate' => 'Real Estate', 'construction' => 'Construction', 'finance' => 'Personal Finance', 'auto' => 'Auto', 'business' => 'Business' );
}

/* ------------------------------------------------------------------ *
 * Settings
 * ------------------------------------------------------------------ */

function quciki_settings() {
	$defaults = array(
		'frontend_url'         => '',
		'revalidate_secret'    => '',
		'adsense_client'       => '',
		'adsense_slot_results' => '',
		'adsense_slot_content' => '',
		'contact_email'        => '',
		'google_verification'  => '',
		'notify_email'         => '',
		'review_months'        => '12',
	);
	$stored = get_option( 'quciki_settings', array() );
	return array_merge( $defaults, is_array( $stored ) ? $stored : array() );
}

/** Settings sent to the website. Never include the secret or the website URL. */
function quciki_public_setting_keys() {
	return array( 'adsense_client', 'adsense_slot_results', 'adsense_slot_content', 'contact_email', 'google_verification' );
}

function quciki_connected() {
	$s = quciki_settings();
	return '' !== $s['frontend_url'] && strlen( $s['revalidate_secret'] ) >= 16;
}

/** True when the request carries the shared secret (server to server calls from the website). */
function quciki_request_has_secret( $request ) {
	$s      = quciki_settings();
	$secret = (string) $s['revalidate_secret'];
	$given  = (string) $request->get_header( 'x-revalidate-secret' );
	return strlen( $secret ) >= 16 && '' !== $given && hash_equals( $secret, $given );
}

/* ------------------------------------------------------------------ *
 * Cleaning helpers
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

/** A site path ("/x") or an https:// address. Anything else is dropped. */
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

function quciki_clean_https_url( $url ) {
	$url = trim( (string) $url );
	if ( '' === $url ) {
		return '';
	}
	$url = esc_url_raw( $url, array( 'https', 'http' ) );
	return $url ? untrailingslashit( $url ) : '';
}

function quciki_mb_cut( $s, $max ) {
	return function_exists( 'mb_substr' ) ? mb_substr( $s, 0, $max ) : substr( $s, 0, $max );
}

function quciki_user_label( $user_id ) {
	$u = $user_id ? get_userdata( (int) $user_id ) : false;
	return $u ? $u->display_name : 'unknown';
}
