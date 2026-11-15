<?php
/**
 * Public, read-only content endpoint for the website, plus the secret-protected preview endpoint.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

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
	register_rest_route( 'quciki/v1', '/preview', array(
		'methods'             => 'GET',
		'callback'            => 'quciki_rest_preview',
		'permission_callback' => '__return_true', // checked inside: shared secret + token
	) );
} );

function quciki_rest_response( $data, $max_age ) {
	$response = new WP_REST_Response( $data, 200 );
	$response->header( 'Cache-Control', $max_age > 0 ? 'public, max-age=' . (int) $max_age : 'no-store' );
	return $response;
}

function quciki_guide_row( $p ) {
	$slug = quciki_guide_slug( $p->ID );
	if ( '' === $slug ) {
		return null;
	}
	$cat = quciki_meta( $p->ID, 'category' );
	return array(
		'slug'            => $slug,
		'category'        => '' === $cat ? 'real-estate' : $cat,
		'title'           => get_the_title( $p ),
		'description'     => wp_strip_all_tags( $p->post_excerpt ),
		'body_html'       => apply_filters( 'the_content', $p->post_content ),
		'cover_url'       => (string) get_the_post_thumbnail_url( $p, 'large' ),
		'calculator_slug' => quciki_meta( $p->ID, 'calculator_slug' ),
		'published_at'    => get_post_time( 'c', true, $p ),
		'updated_at'      => get_post_modified_time( 'c', true, $p ),
	);
}

function quciki_guide_seo( $p ) {
	$slug = quciki_guide_slug( $p->ID );
	$seo  = array(
		'path'        => '/guides/' . $slug,
		'title'       => quciki_meta( $p->ID, 'seo_title' ),
		'description' => quciki_meta( $p->ID, 'seo_description' ),
		'canonical'   => quciki_meta( $p->ID, 'seo_canonical' ),
		'og_image'    => quciki_meta( $p->ID, 'seo_og_image' ),
		'noindex'     => '1' === quciki_meta( $p->ID, 'seo_noindex' ),
	);
	if ( '' === $slug || ( '' === $seo['title'] && '' === $seo['description'] && '' === $seo['canonical'] && '' === $seo['og_image'] && ! $seo['noindex'] ) ) {
		return null;
	}
	return $seo;
}

function quciki_published_guides() {
	return get_posts( array(
		'post_type'      => 'qk_guide',
		'post_status'    => 'publish',
		'posts_per_page' => 500,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'no_found_rows'  => true,
	) );
}

function quciki_menu_items( $location ) {
	$locations = get_nav_menu_locations();
	if ( empty( $locations[ $location ] ) ) {
		return array();
	}
	$items = wp_get_nav_menu_items( $locations[ $location ] );
	$out   = array();
	foreach ( (array) $items as $it ) {
		if ( (int) $it->menu_item_parent !== 0 ) {
			continue;
		}
		$out[] = array( 'label' => wp_strip_all_tags( $it->title ), 'url' => (string) $it->url );
	}
	return $out;
}

function quciki_redirect_list() {
	$out   = array();
	$posts = get_posts( array(
		'post_type'      => 'qk_redirect',
		'post_status'    => 'publish',
		'posts_per_page' => 1000,
		'no_found_rows'  => true,
	) );
	foreach ( $posts as $p ) {
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

/**
 * Everything the website needs.
 * $preview: null for the public version, or array( type => 'entry'|'guide', ref => key|post id ) to include one draft.
 */
function quciki_build_payload( $preview = null ) {
	$records = quciki_all_records( true );
	$entries = array();
	$seo     = array();

	$slots = array();
	foreach ( $records as $key => $r ) {
		if ( $r['live'] ) {
			$slots[ $key ] = $r['live'];
		}
	}
	if ( $preview && 'entry' === $preview['type'] && quciki_valid_key( $preview['ref'] ) ) {
		$r = isset( $records[ $preview['ref'] ] ) ? $records[ $preview['ref'] ] : array( 'live' => null, 'draft' => null );
		$w = $r['draft'] ? $r['draft'] : $r['live'];
		if ( $w ) {
			$slots[ $preview['ref'] ] = $w;
		}
	}
	foreach ( $slots as $key => $slot ) {
		$entries[ $key ] = array(
			'values'      => (object) $slot['values'],
			'reviewed_by' => $slot['reviewed_by'],
			'reviewed_at' => $slot['reviewed_at'],
			'updated_at'  => $slot['at'],
		);
		$s = $slot['seo'];
		if ( $slot['path'] && ( ! empty( $s['title'] ) || ! empty( $s['description'] ) || ! empty( $s['canonical'] ) || ! empty( $s['og_image'] ) || ! empty( $s['noindex'] ) ) ) {
			$seo[] = array(
				'path'        => $slot['path'],
				'title'       => isset( $s['title'] ) ? $s['title'] : '',
				'description' => isset( $s['description'] ) ? $s['description'] : '',
				'canonical'   => isset( $s['canonical'] ) ? $s['canonical'] : '',
				'og_image'    => isset( $s['og_image'] ) ? $s['og_image'] : '',
				'noindex'     => ! empty( $s['noindex'] ),
			);
		}
	}

	$guides = array();
	$posts  = quciki_published_guides();
	if ( $preview && 'guide' === $preview['type'] ) {
		$extra = get_post( (int) $preview['ref'] );
		if ( $extra && 'qk_guide' === $extra->post_type && 'trash' !== $extra->post_status ) {
			$posts = array_values( array_filter( $posts, function ( $p ) use ( $extra ) {
				return $p->ID !== $extra->ID;
			} ) );
			array_unshift( $posts, $extra );
		}
	}
	foreach ( $posts as $p ) {
		$row = quciki_guide_row( $p );
		if ( $row ) {
			$guides[] = $row;
		}
		$g = quciki_guide_seo( $p );
		if ( $g ) {
			$seo[] = $g;
		}
	}

	$settings = array();
	$s        = quciki_settings();
	foreach ( quciki_public_setting_keys() as $k ) {
		$settings[ $k ] = (string) $s[ $k ];
	}

	return array(
		'version'      => 2,
		'generated_at' => gmdate( 'c' ),
		'guides'       => $guides,
		'entries'      => (object) $entries,
		'menus'        => (object) array(
			'header'             => quciki_menu_items( 'quciki_header' ),
			'footer_calculators' => quciki_menu_items( 'quciki_footer_calculators' ),
			'footer_company'     => quciki_menu_items( 'quciki_footer_company' ),
		),
		'seo'          => $seo,
		'redirects'    => quciki_redirect_list(),
		'settings'     => (object) $settings,
	);
}

function quciki_rest_content() {
	return quciki_rest_response( quciki_build_payload( null ), 30 );
}

function quciki_rest_redirects() {
	return quciki_rest_response( quciki_redirect_list(), 30 );
}

function quciki_rest_preview( $request ) {
	if ( ! quciki_request_has_secret( $request ) ) {
		return new WP_Error( 'quciki_forbidden', 'Not allowed.', array( 'status' => 401 ) );
	}
	$data = quciki_preview_lookup( (string) $request->get_header( 'x-preview-token' ) );
	if ( ! $data ) {
		return new WP_Error( 'quciki_expired', 'This preview has expired.', array( 'status' => 401 ) );
	}
	return quciki_rest_response( quciki_build_payload( array( 'type' => $data['type'], 'ref' => $data['ref'] ) ), 0 );
}

/* ------------------------------------------------------------------ *
 * Menus: let editors manage the header and footer menus with the normal WordPress Menus screen.
 * ------------------------------------------------------------------ */

add_action( 'after_setup_theme', function () {
	add_theme_support( 'menus' );
	register_nav_menus( array(
		'quciki_header'             => 'Quciki: header menu',
		'quciki_footer_calculators' => 'Quciki: footer, calculators column',
		'quciki_footer_company'     => 'Quciki: footer, company column',
	) );
} );
