<?php
/**
 * Tell the website to refresh its pages when published content changes.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$GLOBALS['quciki_dirty'] = false;

function quciki_mark_dirty() {
	$GLOBALS['quciki_dirty'] = true;
}

function quciki_is_published_type( $post ) {
	return $post && in_array( $post->post_type, array( 'qk_guide', 'qk_redirect' ), true );
}

add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( quciki_is_published_type( $post ) && ( 'publish' === $new || 'publish' === $old ) ) {
		quciki_mark_dirty();
	}
}, 10, 3 );

add_action( 'save_post', function ( $id, $post ) {
	if ( quciki_is_published_type( $post ) && 'publish' === $post->post_status && ! wp_is_post_revision( $id ) ) {
		quciki_mark_dirty();
	}
}, 99, 2 );

add_action( 'deleted_post', function ( $id, $post = null ) {
	if ( quciki_is_published_type( $post ? $post : get_post( $id ) ) ) {
		quciki_mark_dirty();
	}
}, 10, 2 );

// Menus.
add_action( 'wp_update_nav_menu', 'quciki_mark_dirty' );
add_action( 'wp_update_nav_menu_item', 'quciki_mark_dirty' );
add_action( 'wp_delete_nav_menu', 'quciki_mark_dirty' );
add_action( 'wp_delete_post', function ( $id ) {
	if ( 'nav_menu_item' === get_post_type( $id ) ) {
		quciki_mark_dirty();
	}
} );

add_action( 'shutdown', 'quciki_notify_frontend' );
function quciki_notify_frontend() {
	if ( empty( $GLOBALS['quciki_dirty'] ) || ! quciki_connected() ) {
		return;
	}
	$s = quciki_settings();
	wp_remote_post( $s['frontend_url'] . '/api/revalidate', array(
		'timeout'     => 5,
		'blocking'    => false,
		'redirection' => 0,
		'headers'     => array( 'x-revalidate-secret' => $s['revalidate_secret'] ),
	) );
}

// WordPress itself is not the public site. Keep it out of search results.
add_filter( 'wp_robots', function ( $robots ) {
	$robots['noindex']  = true;
	$robots['nofollow'] = true;
	return $robots;
} );
