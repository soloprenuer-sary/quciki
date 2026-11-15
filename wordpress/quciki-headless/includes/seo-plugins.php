<?php
/**
 * Yoast SEO and Rank Math for guides.
 *
 * The public website is built by Next.js, so these plugins cannot output tags on it. What they can do is give editors
 * their familiar SEO box, focus keyword and analysis on guides. We read what they save (title, description, canonical,
 * social image, noindex) and send it to the website. Every other page is not a WordPress post, so those pages use the
 * "Search appearance" box on the Quciki page editor instead.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** 'yoast', 'rankmath' or '' when neither is active. */
function quciki_seo_plugin() {
	if ( defined( 'WPSEO_VERSION' ) ) {
		return 'yoast';
	}
	if ( defined( 'RANK_MATH_VERSION' ) || class_exists( 'RankMath' ) ) {
		return 'rankmath';
	}
	return '';
}

// Guides are not public WordPress pages, so tell both plugins to show their SEO box on them anyway.
add_filter( 'wpseo_accessible_post_types', 'quciki_add_guides_to_seo_plugins' );
add_filter( 'rank_math/excluded_post_types', 'quciki_add_guides_to_seo_plugins' );
function quciki_add_guides_to_seo_plugins( $types ) {
	if ( is_array( $types ) ) {
		$types['qk_guide'] = 'qk_guide';
	}
	return $types;
}

/** The brand name the website shows, used when a plugin title contains the site name variable. */
function quciki_public_site_name() {
	$records = quciki_all_records();
	if ( isset( $records['site']['live']['values']['name'] ) && '' !== $records['site']['live']['values']['name'] ) {
		return (string) $records['site']['live']['values']['name'];
	}
	$def = quciki_entry_def( 'site' );
	return $def && isset( $def['fields']['name']['default'] ) ? (string) $def['fields']['name']['default'] : get_bloginfo( 'name' );
}

/** Replaces the variables both plugins use (%%title%% in Yoast, %title% in Rank Math) and drops the rest. */
function quciki_resolve_seo_vars( $text, $post ) {
	$text = (string) $text;
	if ( false === strpos( $text, '%' ) ) {
		return trim( $text );
	}
	$map = array(
		'title'    => get_the_title( $post ),
		'sitename' => quciki_public_site_name(),
		'sitedesc' => '',
		'sep'      => '|',
		'excerpt'  => wp_strip_all_tags( $post->post_excerpt ),
		'page'     => '',
	);
	$text = preg_replace_callback( '/%%?([a-z_]+)(?:\([^)]*\))?%%?/i', function ( $m ) use ( $map ) {
		$k = strtolower( $m[1] );
		return isset( $map[ $k ] ) ? $map[ $k ] : '';
	}, $text );
	$text = preg_replace( '/\s+/', ' ', $text );
	return trim( $text, " \t\n\r|-" );
}

/** SEO values saved by the active plugin for a guide, or an empty array. */
function quciki_plugin_seo_for_guide( $post ) {
	$plugin = quciki_seo_plugin();
	$id     = $post->ID;
	$out    = array();
	if ( 'yoast' === $plugin ) {
		$out['title']       = quciki_resolve_seo_vars( get_post_meta( $id, '_yoast_wpseo_title', true ), $post );
		$out['description'] = quciki_resolve_seo_vars( get_post_meta( $id, '_yoast_wpseo_metadesc', true ), $post );
		$out['canonical']   = (string) get_post_meta( $id, '_yoast_wpseo_canonical', true );
		$out['og_image']    = (string) get_post_meta( $id, '_yoast_wpseo_opengraph-image', true );
		$out['noindex']     = '1' === (string) get_post_meta( $id, '_yoast_wpseo_meta-robots-noindex', true );
	} elseif ( 'rankmath' === $plugin ) {
		$robots             = get_post_meta( $id, 'rank_math_robots', true );
		$out['title']       = quciki_resolve_seo_vars( get_post_meta( $id, 'rank_math_title', true ), $post );
		$out['description'] = quciki_resolve_seo_vars( get_post_meta( $id, 'rank_math_description', true ), $post );
		$out['canonical']   = (string) get_post_meta( $id, 'rank_math_canonical_url', true );
		$out['og_image']    = (string) get_post_meta( $id, 'rank_math_facebook_image', true );
		$out['noindex']     = is_array( $robots ) && in_array( 'noindex', $robots, true );
	}
	return $out;
}
