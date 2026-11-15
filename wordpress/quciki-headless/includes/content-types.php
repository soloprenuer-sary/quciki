<?php
/**
 * Guides (block editor) and redirects.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'quciki_register_content_types' );
function quciki_register_content_types() {
	$common = array(
		'public'              => false,
		'show_ui'             => true,
		'show_in_menu'        => 'quciki',
		'exclude_from_search' => true,
		'publicly_queryable'  => false,
		'has_archive'         => false,
		'rewrite'             => false,
		'query_var'           => false,
	);
	register_post_type( 'qk_guide', array_merge( $common, array(
		'labels'          => quciki_labels( 'Guide', 'Guides' ),
		'supports'        => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'author' ),
		'show_in_rest'    => true, // the block editor needs this; content reaches the website only through the Quciki endpoint
		'capability_type' => 'post',
		'menu_position'   => 3,
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
		'add_new'       => 'Add new',
		'add_new_item'  => 'Add new ' . strtolower( $singular ),
		'edit_item'     => 'Edit ' . strtolower( $singular ),
		'new_item'      => 'New ' . strtolower( $singular ),
		'all_items'     => $plural,
		'search_items'  => 'Search ' . strtolower( $plural ),
		'not_found'     => 'None found.',
		'menu_name'     => $plural,
	);
}

/* ------------------------------------------------------------------ *
 * Field helpers
 * ------------------------------------------------------------------ */

function quciki_meta( $id, $key ) {
	return (string) get_post_meta( $id, '_qk_' . $key, true );
}

function quciki_set_meta( $id, $key, $value ) {
	if ( '' === $value ) {
		delete_post_meta( $id, '_qk_' . $key );
	} else {
		update_post_meta( $id, '_qk_' . $key, $value );
	}
}

function quciki_input( $id, $key, $label, $help = '', $type = 'text' ) {
	printf(
		'<p><label for="qk_%1$s"><strong>%2$s</strong></label><br><input class="widefat" type="%5$s" id="qk_%1$s" name="qk_%1$s" value="%3$s">%4$s</p>',
		esc_attr( $key ),
		esc_html( $label ),
		esc_attr( quciki_meta( $id, $key ) ),
		$help ? '<span class="description">' . esc_html( $help ) . '</span>' : '',
		esc_attr( $type )
	);
}

function quciki_post_value( $key ) {
	// phpcs:ignore WordPress.Security.NonceVerification -- checked by the caller.
	return isset( $_POST[ $key ] ) && is_string( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : '';
}

/* ------------------------------------------------------------------ *
 * Guides
 * ------------------------------------------------------------------ */

function quciki_guide_slug( $post_id ) {
	$slug = quciki_meta( $post_id, 'slug' );
	if ( '' === $slug ) {
		$slug = sanitize_title( get_the_title( $post_id ) );
	}
	return $slug;
}

add_action( 'add_meta_boxes', 'quciki_add_meta_boxes' );
function quciki_add_meta_boxes() {
	add_meta_box( 'qk_guide_box', 'Guide details', 'quciki_box_guide', 'qk_guide', 'side', 'high' );
	add_meta_box( 'qk_guide_preview', 'Preview', 'quciki_box_guide_preview', 'qk_guide', 'side', 'high' );
	add_meta_box( 'qk_guide_seo', 'Search appearance', 'quciki_box_guide_seo', 'qk_guide', 'normal', 'default' );
	add_meta_box( 'qk_redirect_box', 'Redirect', 'quciki_box_redirect', 'qk_redirect', 'normal', 'high' );
}

function quciki_box_guide( $post ) {
	wp_nonce_field( 'quciki_save_post', 'quciki_nonce' );
	quciki_input( $post->ID, 'slug', 'Web address (slug)', 'Becomes /guides/your-slug. Lower case letters, numbers and hyphens. Leave empty to build it from the title.' );
	$cat = quciki_meta( $post->ID, 'category' );
	$cat = '' === $cat ? 'real-estate' : $cat;
	echo '<p><label for="qk_category"><strong>Category</strong></label><br><select class="widefat" id="qk_category" name="qk_category">';
	foreach ( quciki_categories() as $slug => $name ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $slug ), selected( $cat, $slug, false ), esc_html( $name ) );
	}
	echo '</select></p>';
	$calc = quciki_meta( $post->ID, 'calculator_slug' );
	echo '<p><label for="qk_calculator_slug"><strong>Related calculator</strong></label><br><select class="widefat" id="qk_calculator_slug" name="qk_calculator_slug"><option value="">None</option>';
	foreach ( quciki_schema()['calculators'] as $c ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $c['slug'] ), selected( $calc, $c['slug'], false ), esc_html( $c['name'] ) );
	}
	echo '</select></p>';
	echo '<p class="description">Write the short summary in the Excerpt box: it is the intro line and the default meta description. Use Heading 2 for section titles.</p>';
}

function quciki_box_guide_preview( $post ) {
	if ( 'auto-draft' === $post->post_status ) {
		echo '<p class="description">Save the draft first, then you can preview it on the website.</p>';
		return;
	}
	if ( ! quciki_connected() ) {
		echo '<p class="description">Connect the website under Quciki &gt; Settings to preview.</p>';
		return;
	}
	printf(
		'<p><a class="button button-secondary" href="%s" target="_blank" rel="noopener">Preview on site</a></p><p class="description">Shows the last saved version. Click Save draft or Update first. Changes to a published guide go live as soon as you click Update.</p>',
		esc_url( quciki_preview_link( 'guide', (string) $post->ID ) )
	);
}

function quciki_box_guide_seo( $post ) {
	quciki_input( $post->ID, 'seo_title', 'Search title', 'About 60 characters or fewer. Empty uses the guide title.' );
	printf(
		'<p><label for="qk_seo_description"><strong>Meta description</strong></label><br><textarea class="widefat" rows="3" id="qk_seo_description" name="qk_seo_description">%s</textarea><span class="description">About 150 to 160 characters. Empty uses the excerpt.</span></p>',
		esc_textarea( quciki_meta( $post->ID, 'seo_description' ) )
	);
	quciki_input( $post->ID, 'seo_canonical', 'Canonical URL', 'Leave empty unless this guide duplicates another page.' );
	quciki_input( $post->ID, 'seo_og_image', 'Social image URL', 'A 1200x630 image. Empty uses the featured image.' );
	printf( '<p><label><input type="checkbox" name="qk_seo_noindex" value="1"%s> Hide from search engines (noindex)</label></p>', checked( quciki_meta( $post->ID, 'seo_noindex' ), '1', false ) );
}

function quciki_box_redirect( $post ) {
	wp_nonce_field( 'quciki_save_post', 'quciki_nonce' );
	quciki_input( $post->ID, 'source', 'From (old path)', 'Starts with /, no spaces, ? or #. Example: /old-page' );
	quciki_input( $post->ID, 'destination', 'To (new path or https:// address)', 'Example: /real-estate/mortgage-calculator' );
	$perm = quciki_meta( $post->ID, 'permanent' );
	$perm = '' === $perm ? '1' : $perm;
	printf( '<p><label><input type="checkbox" name="qk_permanent" value="1"%s> Permanent (308). Untick for a temporary (307) redirect.</label></p>', checked( $perm, '1', false ) );
	echo '<p class="description">Publish to turn the redirect on. Move it to Draft to turn it off. Changes apply within about a minute.</p>';
}

add_action( 'save_post', 'quciki_save_post', 10, 2 );
function quciki_save_post( $post_id, $post ) {
	if ( ! in_array( $post->post_type, array( 'qk_guide', 'qk_redirect' ), true ) ) {
		return;
	}
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_id ) || ! isset( $_POST['quciki_nonce'] ) ) {
		return;
	}
	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['quciki_nonce'] ) ), 'quciki_save_post' ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( 'qk_guide' === $post->post_type ) {
		$slug = sanitize_title( quciki_post_value( 'qk_slug' ) );
		if ( '' === $slug ) {
			$slug = sanitize_title( $post->post_title );
		}
		$slug = quciki_unique_guide_slug( $slug, $post_id );
		quciki_set_meta( $post_id, 'slug', $slug );

		$cat = quciki_post_value( 'qk_category' );
		quciki_set_meta( $post_id, 'category', isset( quciki_categories()[ $cat ] ) ? $cat : 'real-estate' );
		$calc  = quciki_post_value( 'qk_calculator_slug' );
		$valid = wp_list_pluck( quciki_schema()['calculators'], 'slug' );
		quciki_set_meta( $post_id, 'calculator_slug', in_array( $calc, $valid, true ) ? $calc : '' );

		quciki_set_meta( $post_id, 'seo_title', quciki_mb_cut( sanitize_text_field( quciki_post_value( 'qk_seo_title' ) ), 200 ) );
		quciki_set_meta( $post_id, 'seo_description', quciki_mb_cut( sanitize_textarea_field( quciki_post_value( 'qk_seo_description' ) ), 400 ) );
		quciki_set_meta( $post_id, 'seo_canonical', quciki_clean_target( quciki_post_value( 'qk_seo_canonical' ) ) );
		quciki_set_meta( $post_id, 'seo_og_image', quciki_clean_target( quciki_post_value( 'qk_seo_og_image' ) ) );
		quciki_set_meta( $post_id, 'seo_noindex', '1' === quciki_post_value( 'qk_seo_noindex' ) ? '1' : '' );
	} else {
		quciki_set_meta( $post_id, 'source', quciki_clean_path( quciki_post_value( 'qk_source' ) ) );
		quciki_set_meta( $post_id, 'destination', quciki_clean_target( quciki_post_value( 'qk_destination' ) ) );
		update_post_meta( $post_id, '_qk_permanent', '1' === quciki_post_value( 'qk_permanent' ) ? '1' : '0' );
	}
}

function quciki_unique_guide_slug( $slug, $post_id ) {
	if ( '' === $slug ) {
		return '';
	}
	$base = $slug;
	$n    = 2;
	while ( true ) {
		$others = get_posts( array(
			'post_type'      => 'qk_guide',
			'post_status'    => array( 'publish', 'future', 'draft', 'pending', 'private' ),
			'posts_per_page' => 1,
			'post__not_in'   => array( $post_id ),
			'meta_key'       => '_qk_slug', // phpcs:ignore WordPress.DB.SlowDBQuery
			'meta_value'     => $slug, // phpcs:ignore WordPress.DB.SlowDBQuery
			'fields'         => 'ids',
			'no_found_rows'  => true,
		) );
		if ( ! $others ) {
			return $slug;
		}
		$slug = $base . '-' . $n++;
	}
}
