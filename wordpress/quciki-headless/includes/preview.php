<?php
/**
 * "Preview on site": an editor sees unpublished changes on the real website.
 *
 * WordPress makes a random token (30 minutes) that names the item being previewed. The website confirms the token
 * with WordPress using the shared secret, switches on preview mode, and then asks /preview for content that
 * includes the draft. Visitors never see drafts.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const QUCIKI_PREVIEW_TTL = 1800;

function quciki_preview_create( $type, $ref ) {
	$token = bin2hex( random_bytes( 16 ) );
	set_transient( 'quciki_pv_' . $token, array(
		'type' => $type,
		'ref'  => $ref,
		'user' => get_current_user_id(),
	), QUCIKI_PREVIEW_TTL );
	return $token;
}

function quciki_preview_lookup( $token ) {
	if ( ! preg_match( '/^[a-f0-9]{32}$/', (string) $token ) ) {
		return null;
	}
	$data = get_transient( 'quciki_pv_' . $token );
	return is_array( $data ) ? $data : null;
}

/** Link (with a nonce) that creates a token and sends the editor to the website. */
function quciki_preview_link( $type, $ref ) {
	return wp_nonce_url(
		add_query_arg( array( 'action' => 'quciki_preview', 'type' => $type, 'ref' => $ref ), admin_url( 'admin-post.php' ) ),
		'quciki_preview_' . $type . '_' . $ref
	);
}

/** Public path of the previewed item on the website. */
function quciki_preview_path( $type, $ref ) {
	if ( 'entry' === $type ) {
		$def = quciki_entry_def( $ref );
		return $def && ! empty( $def['path'] ) ? $def['path'] : '/';
	}
	if ( 'guide' === $type ) {
		$slug = quciki_guide_slug( (int) $ref );
		return '' !== $slug ? '/guides/' . $slug : '/guides';
	}
	return '/';
}

add_action( 'admin_post_quciki_preview', 'quciki_handle_preview' );
function quciki_handle_preview() {
	if ( ! current_user_can( 'quciki_edit' ) ) {
		wp_die( 'You do not have permission to preview.', 403 );
	}
	$type = isset( $_GET['type'] ) ? sanitize_key( wp_unslash( $_GET['type'] ) ) : '';
	$ref  = isset( $_GET['ref'] ) ? sanitize_text_field( wp_unslash( $_GET['ref'] ) ) : '';
	check_admin_referer( 'quciki_preview_' . $type . '_' . $ref );
	quciki_redirect_to_preview( $type, $ref );
}

/** Creates the token and redirects the browser to the website's preview route. */
function quciki_redirect_to_preview( $type, $ref ) {
	if ( ! in_array( $type, array( 'entry', 'guide' ), true ) ) {
		wp_die( 'Unknown preview type.', 400 );
	}
	$s = quciki_settings();
	if ( ! quciki_connected() ) {
		wp_die( 'Preview needs the website connection. Open Quciki > Settings and fill in the Website URL and Refresh secret.', 'Preview not set up', array( 'back_link' => true ) );
	}
	$token = quciki_preview_create( $type, $ref );
	$url   = add_query_arg(
		array( 'token' => $token, 'path' => quciki_preview_path( $type, $ref ) ),
		$s['frontend_url'] . '/api/preview'
	);
	// phpcs:ignore WordPress.Security.SafeRedirect -- the website URL is an admin-configured setting.
	wp_redirect( $url );
	exit;
}
