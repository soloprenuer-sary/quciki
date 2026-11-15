<?php
/**
 * Admin screens: dashboard, pages and text list, the page editor, and settings.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ------------------------------------------------------------------ *
 * Menu
 * ------------------------------------------------------------------ */

add_action( 'admin_menu', 'quciki_admin_menu', 5 );
function quciki_admin_menu() {
	add_menu_page( 'Quciki', 'Quciki', 'quciki_edit', 'quciki', 'quciki_dashboard_page', 'dashicons-calculator', 25 );
	add_submenu_page( 'quciki', 'Quciki dashboard', 'Dashboard', 'quciki_edit', 'quciki', 'quciki_dashboard_page' );
	add_submenu_page( 'quciki', 'Pages and text', 'Pages and text', 'quciki_edit', 'quciki-content', 'quciki_content_list_page' );
	// Hidden screen for editing one page. Reached from the list.
	add_submenu_page( 'options.php', 'Edit page', 'Edit page', 'quciki_edit', 'quciki-edit', 'quciki_edit_page' );
}

add_action( 'admin_menu', function () {
	add_submenu_page( 'quciki', 'Menus', 'Menus', 'edit_theme_options', 'nav-menus.php' );
	add_submenu_page( 'quciki', 'Quciki settings', 'Settings', 'quciki_manage', 'quciki-settings', 'quciki_settings_page' );
}, 30 );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	if ( 0 !== strpos( $page, 'quciki' ) ) {
		return;
	}
	wp_enqueue_style( 'quciki-admin', QUCIKI_URL . 'assets/admin.css', array(), QUCIKI_VERSION );
	wp_enqueue_script( 'quciki-admin', QUCIKI_URL . 'assets/admin.js', array(), QUCIKI_VERSION, true );
	if ( 'quciki-edit' === $page ) {
		wp_enqueue_media();
		wp_enqueue_editor();
	}
} );

function quciki_edit_url( $key, $args = array() ) {
	return add_query_arg( array_merge( array( 'page' => 'quciki-edit', 'key' => $key ), $args ), admin_url( 'admin.php' ) );
}

function quciki_ago( $iso ) {
	$t = $iso ? strtotime( $iso ) : false;
	return $t ? human_time_diff( $t, time() ) . ' ago' : '';
}

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

function quciki_dashboard_page() {
	if ( ! current_user_can( 'quciki_edit' ) ) {
		wp_die( 'You do not have permission to view this page.' );
	}
	$s       = quciki_settings();
	$records = quciki_all_records( true );
	$edited  = 0;
	foreach ( $records as $r ) {
		if ( $r['live'] ) {
			$edited++;
		}
	}
	$schema    = quciki_schema();
	$attention = quciki_attention_list();
	$guides    = wp_count_posts( 'qk_guide' );
	$new_msgs  = quciki_count_messages( 'new' );

	echo '<div class="wrap quciki"><h1>Quciki</h1>';
	if ( ! quciki_connected() ) {
		echo '<div class="notice notice-warning"><p><strong>The website is not connected yet.</strong> Open <a href="' . esc_url( admin_url( 'admin.php?page=quciki-settings' ) ) . '">Settings</a> and add the Website URL and Refresh secret. Until then, published changes appear on the website within an hour, and Preview does not work.</p></div>';
	}
	if ( ! $schema['entries'] ) {
		echo '<div class="notice notice-error"><p>The page list is missing (data/schema.json). Re-install the plugin zip.</p></div>';
	}

	echo '<div class="qk-cards">';
	printf( '<a class="qk-card" href="%s"><span class="qk-num">%d</span><span>Pages edited of %d</span></a>', esc_url( admin_url( 'admin.php?page=quciki-content' ) ), (int) $edited, count( $schema['by_key'] ) );
	printf( '<a class="qk-card" href="%s"><span class="qk-num">%d</span><span>Published guides</span></a>', esc_url( admin_url( 'edit.php?post_type=qk_guide' ) ), isset( $guides->publish ) ? (int) $guides->publish : 0 );
	printf( '<a class="qk-card" href="%s"><span class="qk-num">%d</span><span>New messages</span></a>', esc_url( admin_url( 'edit.php?post_type=qk_message&qk_status=new' ) ), $new_msgs );
	printf( '<a class="qk-card" href="%s"><span class="qk-num">%d</span><span>Unpublished drafts</span></a>', esc_url( admin_url( 'admin.php?page=quciki-content' ) ), count( $attention['drafts'] ) );
	echo '</div>';

	echo '<h2>Needs attention</h2>';
	if ( ! $attention['drafts'] && ! $attention['reviews'] ) {
		echo '<p>Nothing needs attention.</p>';
	}
	if ( $attention['drafts'] ) {
		echo '<h3>Unpublished changes</h3><ul class="qk-list">';
		foreach ( $attention['drafts'] as $key ) {
			$d = $schema['by_key'][ $key ];
			printf( '<li><a href="%s">%s</a> <span class="description">draft saved %s by %s</span></li>', esc_url( quciki_edit_url( $key ) ), esc_html( $d['label'] ), esc_html( quciki_ago( $records[ $key ]['draft']['at'] ) ), esc_html( quciki_user_label( $records[ $key ]['draft']['by'] ) ) );
		}
		echo '</ul>';
	}
	if ( $attention['reviews'] ) {
		printf( '<h3>Review needed (never reviewed, or older than %d months)</h3><ul class="qk-list">', (int) $attention['months'] );
		foreach ( $attention['reviews'] as $key ) {
			$d    = $schema['by_key'][ $key ];
			$live = isset( $records[ $key ] ) ? $records[ $key ]['live'] : null;
			printf( '<li><a href="%s">%s</a> <span class="description">%s</span></li>', esc_url( quciki_edit_url( $key ) ), esc_html( $d['label'] ), $live && $live['reviewed_at'] ? 'last reviewed ' . esc_html( $live['reviewed_at'] ) : 'not reviewed yet' );
		}
		echo '</ul>';
	}

	echo '<h2>How it works</h2><ol>';
	echo '<li>Open <a href="' . esc_url( admin_url( 'admin.php?page=quciki-content' ) ) . '"><strong>Pages and text</strong></a>, pick a page and change its text.</li>';
	echo '<li><strong>Save draft</strong> keeps your changes private. <strong>Preview on site</strong> shows them on the real website.</li>';
	echo '<li><strong>Publish</strong> sends the changes live. The website refreshes in a few seconds.</li>';
	echo '<li>Anything you do not change keeps the text built into the website.</li></ol>';
	echo '<p>Website: ' . ( $s['frontend_url'] ? '<a href="' . esc_url( $s['frontend_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $s['frontend_url'] ) . '</a>' : 'not set' ) . '</p>';
	echo '</div>';
}

/* ------------------------------------------------------------------ *
 * Pages and text (list)
 * ------------------------------------------------------------------ */

function quciki_content_list_page() {
	if ( ! current_user_can( 'quciki_edit' ) ) {
		wp_die( 'You do not have permission to view this page.' );
	}
	$schema  = quciki_schema();
	$records = quciki_all_records( true );
	$groups  = array();
	foreach ( $schema['entries'] as $e ) {
		$groups[ $e['group'] ][] = $e;
	}

	echo '<div class="wrap quciki"><h1>Pages and text</h1>';
	echo '<p>Every word on the website can be changed here. Pages you have not touched show the text built into the website.</p>';
	echo '<p><input type="search" id="qk-filter" class="regular-text" placeholder="Filter pages, for example &quot;mortgage&quot;"></p>';
	foreach ( $groups as $group => $entries ) {
		printf( '<h2 class="qk-group">%s</h2><table class="widefat striped qk-table"><thead><tr><th>Page</th><th>Status</th><th>Last published</th><th></th></tr></thead><tbody>', esc_html( $group ) );
		foreach ( $entries as $e ) {
			$r      = isset( $records[ $e['key'] ] ) ? $records[ $e['key'] ] : array( 'live' => null, 'draft' => null );
			$status = '<span class="qk-chip">Default text</span>';
			if ( $r['live'] ) {
				$status = '<span class="qk-chip qk-chip-live">Edited</span>';
			}
			if ( $r['draft'] ) {
				$status .= ' <span class="qk-chip qk-chip-draft">Unpublished changes</span>';
			}
			printf(
				'<tr data-filter="%s"><td><strong><a href="%s">%s</a></strong>%s</td><td>%s</td><td>%s</td><td><a class="button button-small" href="%s">Edit</a></td></tr>',
				esc_attr( strtolower( $e['label'] . ' ' . $e['key'] ) ),
				esc_url( quciki_edit_url( $e['key'] ) ),
				esc_html( $e['label'] ),
				! empty( $e['path'] ) ? ' <span class="description">' . esc_html( $e['path'] ) . '</span>' : '',
				wp_kses_post( $status ),
				$r['live'] ? esc_html( quciki_ago( $r['live']['at'] ) . ' by ' . quciki_user_label( $r['live']['by'] ) ) : '&mdash;',
				esc_url( quciki_edit_url( $e['key'] ) )
			);
		}
		echo '</tbody></table>';
	}
	echo '</div>';
}

/* ------------------------------------------------------------------ *
 * Field rendering
 * ------------------------------------------------------------------ */

function quciki_render_text_input( $name, $id, $f, $value, $compact = false ) {
	$default = (string) ( isset( $f['default'] ) ? $f['default'] : '' );
	$attrs   = sprintf( ' data-default="%s"', esc_attr( $default ) );
	$max     = isset( $f['max'] ) ? (int) $f['max'] : 0;
	$maxattr = $max ? sprintf( ' maxlength="%d"', $max ) : '';
	switch ( $f['type'] ) {
		case 'textarea':
			printf( '<textarea class="widefat" rows="%d" id="%s" name="%s"%s%s>%s</textarea>', $max > 400 ? 8 : 3, esc_attr( $id ), esc_attr( $name ), $maxattr, $attrs, esc_textarea( $value ) );
			break;
		case 'image':
			printf( '<span class="qk-image"><input class="widefat" type="text" id="%s" name="%s" value="%s"%s placeholder="https://… or choose from the library"><button type="button" class="button qk-pick-image">Choose image</button></span>', esc_attr( $id ), esc_attr( $name ), esc_attr( $value ), $attrs );
			break;
		case 'date':
			printf( '<input type="date" id="%s" name="%s" value="%s"%s>', esc_attr( $id ), esc_attr( $name ), esc_attr( $value ), $attrs );
			break;
		default:
			printf( '<input class="widefat" type="text" id="%s" name="%s" value="%s"%s%s>', esc_attr( $id ), esc_attr( $name ), esc_attr( $value ), $maxattr, $attrs );
	}
}

function quciki_render_field( $key, $f, $value ) {
	$id   = 'qkf_' . $key;
	$name = 'qk[' . $key . ']';
	echo '<div class="qk-field">';
	if ( 'list' === $f['type'] ) {
		printf( '<span class="qk-label">%s</span>', esc_html( $f['label'] ) );
		if ( ! empty( $f['help'] ) ) {
			printf( '<span class="description">%s</span>', esc_html( $f['help'] ) );
		}
		$label = ! empty( $f['itemLabel'] ) ? $f['itemLabel'] : 'Item';
		printf( '<div class="qk-list-field" data-max="%d" data-name="%s" data-label="%s">', (int) $f['max'], esc_attr( $name ), esc_attr( $label ) );
		echo '<div class="qk-rows">';
		foreach ( (array) $value as $i => $row ) {
			quciki_render_list_row( $name, $f, (int) $i, (array) $row, $label );
		}
		echo '</div>';
		echo '<template class="qk-row-template">';
		quciki_render_list_row( $name, $f, '__i__', array(), $label );
		echo '</template>';
		printf( '<button type="button" class="button qk-add-row">Add %s</button>', esc_html( strtolower( $label ) ) );
		echo '</div>';
	} elseif ( 'richtext' === $f['type'] ) {
		printf( '<label class="qk-label" for="%s">%s</label>', esc_attr( $id ), esc_html( $f['label'] ) );
		if ( ! empty( $f['help'] ) ) {
			printf( '<span class="description">%s</span>', esc_html( $f['help'] ) );
		}
		wp_editor( (string) $value, $id, array(
			'textarea_name' => $name,
			'media_buttons' => false,
			'textarea_rows' => 12,
			'teeny'         => false,
			'quicktags'     => true,
			'tinymce'       => array( 'toolbar1' => 'formatselect,bold,italic,bullist,numlist,link,unlink,undo,redo', 'toolbar2' => '', 'block_formats' => 'Paragraph=p;Heading 2=h2;Heading 3=h3' ),
		) );
	} else {
		$required = empty( $f['optional'] ) && '' !== (string) $f['default'];
		printf( '<label class="qk-label" for="%s">%s%s</label>', esc_attr( $id ), esc_html( $f['label'] ), $required ? ' <span class="qk-req" title="Required. Empty uses the default.">*</span>' : '' );
		if ( ! empty( $f['help'] ) ) {
			printf( '<span class="description">%s</span>', esc_html( $f['help'] ) );
		}
		quciki_render_text_input( $name, $id, $f, (string) $value );
		if ( in_array( $f['type'], array( 'text', 'textarea', 'url', 'image' ), true ) ) {
			echo '<button type="button" class="button-link qk-use-default" hidden>Use default</button>';
		}
	}
	echo '</div>';
}

function quciki_render_list_row( $name, $f, $index, $row, $label ) {
	echo '<div class="qk-row"><div class="qk-row-bar"><strong class="qk-row-title">' . esc_html( $label ) . '</strong>';
	echo '<span><button type="button" class="button-link qk-up" aria-label="Move up">&uarr;</button> <button type="button" class="button-link qk-down" aria-label="Move down">&darr;</button> <button type="button" class="button-link qk-remove">Remove</button></span></div>';
	foreach ( $f['item'] as $sk => $sf ) {
		$id = 'qkr_' . md5( $name . $index . $sk );
		printf( '<label class="qk-sublabel" for="%s">%s</label>', esc_attr( $id ), esc_html( $sf['label'] ) );
		quciki_render_text_input( $name . '[' . $index . '][' . $sk . ']', $id, $sf, isset( $row[ $sk ] ) ? (string) $row[ $sk ] : '' );
	}
	echo '</div>';
}

/* ------------------------------------------------------------------ *
 * Edit one page
 * ------------------------------------------------------------------ */

function quciki_edit_page() {
	if ( ! current_user_can( 'quciki_edit' ) ) {
		wp_die( 'You do not have permission to edit this page.' );
	}
	$key = isset( $_GET['key'] ) ? sanitize_text_field( wp_unslash( $_GET['key'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	$def = quciki_valid_key( $key ) ? quciki_entry_def( $key ) : null;
	if ( ! $def ) {
		wp_die( 'That page does not exist. <a href="' . esc_url( admin_url( 'admin.php?page=quciki-content' ) ) . '">Back to the list</a>.' );
	}
	$record  = quciki_entry_record( $key );
	$working = quciki_working_slot( $record );
	$values  = quciki_effective_values( $def, $working );
	$seo     = $working ? $working['seo'] : array();
	$sections = array();
	foreach ( $def['fields'] as $fk => $f ) {
		$sections[ isset( $f['section'] ) && $f['section'] ? $f['section'] : 'Content' ][ $fk ] = $f;
	}

	$notice = isset( $_GET['qk_notice'] ) ? sanitize_key( wp_unslash( $_GET['qk_notice'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	$notes  = get_transient( 'quciki_notes_' . get_current_user_id() );
	delete_transient( 'quciki_notes_' . get_current_user_id() );

	echo '<div class="wrap quciki"><h1 class="wp-heading-inline">' . esc_html( $def['label'] ) . '</h1>';
	printf( ' <a class="page-title-action" href="%s">All pages</a>', esc_url( admin_url( 'admin.php?page=quciki-content' ) ) );
	echo '<hr class="wp-header-end">';

	$msg = array(
		'draft'     => array( 'success', 'Draft saved. Nothing has changed on the website yet.' ),
		'published' => array( 'success', 'Published. The website will refresh in a few seconds.' ),
		'discarded' => array( 'success', 'Unpublished changes discarded.' ),
		'reset'     => array( 'success', 'This page now uses the default text from the website. The previous version is in the history.' ),
		'restored'  => array( 'success', 'Earlier version loaded as a draft. Preview it, then publish when ready.' ),
		'blocked'   => array( 'error', 'Not published.' ),
	);
	if ( isset( $msg[ $notice ] ) ) {
		printf( '<div class="notice notice-%s is-dismissible"><p>%s</p></div>', esc_attr( $msg[ $notice ][0] ), esc_html( $msg[ $notice ][1] ) );
	}
	if ( is_array( $notes ) ) {
		foreach ( $notes as $n ) {
			printf( '<div class="notice notice-%s"><p>%s</p></div>', esc_attr( $n[0] ), esc_html( $n[1] ) );
		}
	}

	$can_publish = current_user_can( 'quciki_publish' );
	$can_review  = current_user_can( 'quciki_review' );

	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="qk-edit" id="qk-edit-form">';
	echo '<input type="hidden" name="action" value="quciki_save_entry">';
	printf( '<input type="hidden" name="key" value="%s">', esc_attr( $key ) );
	wp_nonce_field( 'quciki_save_entry_' . $key );

	echo '<div class="qk-edit-main">';
	foreach ( $sections as $title => $fields ) {
		// Sections stay open so the rich text editors can size themselves; only the long per-input sections start closed.
		$open = 0 !== strpos( $title, 'Input:' );
		printf( '<details class="qk-section"%s><summary>%s</summary><div class="qk-section-body">', $open ? ' open' : '', esc_html( $title ) );
		foreach ( $fields as $fk => $f ) {
			quciki_render_field( $fk, $f, $values[ $fk ] );
		}
		echo '</div></details>';
	}

	if ( ! empty( $def['path'] ) ) {
		$sd = isset( $def['seo'] ) && is_array( $def['seo'] ) ? $def['seo'] : array( 'title' => '', 'description' => '' );
		echo '<details class="qk-section"><summary>Search appearance (SEO)</summary><div class="qk-section-body">';
		printf( '<p class="description">Page address: <code>%s</code>. Leave a box empty to use the default shown in grey.</p>', esc_html( $def['path'] ) );
		printf( '<div class="qk-field"><label class="qk-label" for="qk_seo_title">Search title</label><input class="widefat qk-count" data-ideal="60" type="text" id="qk_seo_title" name="qk_seo[title]" value="%s" placeholder="%s" maxlength="200"><span class="qk-counter"></span></div>', esc_attr( isset( $seo['title'] ) ? $seo['title'] : '' ), esc_attr( $sd['title'] ) );
		printf( '<div class="qk-field"><label class="qk-label" for="qk_seo_description">Meta description</label><textarea class="widefat qk-count" data-ideal="160" rows="3" id="qk_seo_description" name="qk_seo[description]" placeholder="%s" maxlength="400">%s</textarea><span class="qk-counter"></span></div>', esc_attr( $sd['description'] ), esc_textarea( isset( $seo['description'] ) ? $seo['description'] : '' ) );
		printf( '<div class="qk-field"><label class="qk-label" for="qk_seo_canonical">Canonical URL</label><input class="widefat" type="text" id="qk_seo_canonical" name="qk_seo[canonical]" value="%s" placeholder="Leave empty unless this page duplicates another"></div>', esc_attr( isset( $seo['canonical'] ) ? $seo['canonical'] : '' ) );
		printf( '<div class="qk-field"><label class="qk-label" for="qk_seo_og">Social image URL</label><span class="qk-image"><input class="widefat" type="text" id="qk_seo_og" name="qk_seo[og_image]" value="%s" placeholder="1200x630 image"><button type="button" class="button qk-pick-image">Choose image</button></span></div>', esc_attr( isset( $seo['og_image'] ) ? $seo['og_image'] : '' ) );
		printf( '<div class="qk-field"><label><input type="checkbox" name="qk_seo[noindex]" value="1"%s> Hide this page from search engines (noindex)</label></div>', checked( ! empty( $seo['noindex'] ), true, false ) );
		echo '</div></details>';
	}

	if ( ! empty( $def['review'] ) ) {
		$by = $working ? $working['reviewed_by'] : '';
		$at = $working ? $working['reviewed_at'] : '';
		echo '<details class="qk-section" open><summary>Review sign-off' . ( 'required' === $def['review'] ? ' (required to publish)' : '' ) . '</summary><div class="qk-section-body">';
		if ( $can_review ) {
			echo '<p class="description">Fill these in when the legal advisor or accountant has checked this page. They appear on the website as "Last reviewed".</p>';
			printf( '<div class="qk-field"><label class="qk-label" for="qk_rv_by">Reviewed by</label><input class="widefat" type="text" id="qk_rv_by" name="qk_review[by]" value="%s" maxlength="160" placeholder="Name of the advisor or firm"></div>', esc_attr( $by ) );
			printf( '<div class="qk-field"><label class="qk-label" for="qk_rv_at">Review date</label><input type="date" id="qk_rv_at" name="qk_review[at]" value="%s"></div>', esc_attr( $at ) );
		} else {
			printf( '<p>Reviewed by: <strong>%s</strong><br>Review date: <strong>%s</strong></p><p class="description">Only a reviewer or administrator can change the sign-off.</p>', esc_html( $by ? $by : 'not reviewed yet' ), esc_html( $at ? $at : 'not reviewed yet' ) );
		}
		echo '</div></details>';
	}
	echo '</div>'; // main

	// Sidebar.
	echo '<aside class="qk-edit-side"><div class="qk-box"><h2>Publish</h2>';
	if ( $record['draft'] ) {
		printf( '<p><span class="qk-chip qk-chip-draft">Unpublished changes</span><br><span class="description">Draft saved %s by %s</span></p>', esc_html( quciki_ago( $record['draft']['at'] ) ), esc_html( quciki_user_label( $record['draft']['by'] ) ) );
	} else {
		echo '<p class="description">No unpublished changes.</p>';
	}
	if ( $record['live'] ) {
		printf( '<p class="description">Live: published %s by %s.</p>', esc_html( quciki_ago( $record['live']['at'] ) ), esc_html( quciki_user_label( $record['live']['by'] ) ) );
	} else {
		echo '<p class="description">Live: showing the default text.</p>';
	}
	echo '<p><button type="submit" name="qk_action" value="draft" class="button button-secondary widefat">Save draft</button></p>';
	if ( quciki_connected() ) {
		echo '<p><button type="submit" name="qk_action" value="preview" formtarget="_blank" class="button widefat">Save and preview on site</button></p>';
	} else {
		echo '<p class="description">Connect the website in Settings to enable preview.</p>';
	}
	if ( $can_publish ) {
		echo '<p><button type="submit" name="qk_action" value="publish" class="button button-primary widefat">Publish to website</button></p>';
	} else {
		echo '<p class="description">You can save drafts. An Editor or Administrator publishes them.</p>';
	}
	if ( $record['draft'] ) {
		echo '<p><button type="submit" name="qk_action" value="discard" class="button-link qk-danger" onclick="return confirm(\'Discard the unpublished changes?\')">Discard unpublished changes</button></p>';
	}
	if ( $record['live'] && $can_publish ) {
		echo '<p><button type="submit" name="qk_action" value="reset" class="button-link qk-danger" onclick="return confirm(\'Go back to the default text built into the website? The current version stays in the history.\')">Reset to default text</button></p>';
	}
	echo '</div>';

	if ( $record['history'] ) {
		echo '<div class="qk-box"><h2>History</h2><ul class="qk-history">';
		foreach ( $record['history'] as $i => $h ) {
			$restore = wp_nonce_url( add_query_arg( array( 'action' => 'quciki_restore_entry', 'key' => $key, 'index' => $i ), admin_url( 'admin-post.php' ) ), 'quciki_restore_' . $key . '_' . $i );
			printf( '<li>%s by %s <a href="%s">Load as draft</a></li>', esc_html( quciki_ago( isset( $h['at'] ) ? $h['at'] : '' ) ), esc_html( quciki_user_label( isset( $h['by'] ) ? $h['by'] : 0 ) ), esc_url( $restore ) );
		}
		echo '</ul></div>';
	}
	echo '</aside></form></div>';
}

/* ------------------------------------------------------------------ *
 * Handlers
 * ------------------------------------------------------------------ */

function quciki_posted( $name ) {
	// phpcs:ignore WordPress.Security.NonceVerification -- every caller verifies the nonce first.
	return isset( $_POST[ $name ] ) ? wp_unslash( $_POST[ $name ] ) : null;
}

function quciki_flash( $type, $message ) {
	$uid   = get_current_user_id();
	$notes = get_transient( 'quciki_notes_' . $uid );
	$notes = is_array( $notes ) ? $notes : array();
	$notes[] = array( $type, $message );
	set_transient( 'quciki_notes_' . $uid, $notes, 120 );
}

add_action( 'admin_post_quciki_save_entry', 'quciki_handle_save_entry' );
function quciki_handle_save_entry() {
	$key = isset( $_POST['key'] ) ? sanitize_text_field( wp_unslash( $_POST['key'] ) ) : '';
	if ( ! quciki_valid_key( $key ) || ! quciki_entry_def( $key ) ) {
		wp_die( 'Unknown page.', 400 );
	}
	check_admin_referer( 'quciki_save_entry_' . $key );
	if ( ! current_user_can( 'quciki_edit' ) ) {
		wp_die( 'You do not have permission to edit.', 403 );
	}
	$action = isset( $_POST['qk_action'] ) ? sanitize_key( wp_unslash( $_POST['qk_action'] ) ) : 'draft';
	$notice = 'draft';

	if ( 'discard' === $action ) {
		quciki_discard_draft( $key );
		$notice = 'discarded';
	} elseif ( 'reset' === $action ) {
		if ( ! current_user_can( 'quciki_publish' ) ) {
			wp_die( 'Only an Editor or Administrator can reset a page.', 403 );
		}
		quciki_reset_entry( $key );
		$notice = 'reset';
	} else {
		list( $ok, $messages ) = quciki_save_draft( $key, quciki_posted( 'qk' ), quciki_posted( 'qk_seo' ), quciki_posted( 'qk_review' ) );
		foreach ( $messages as $m ) {
			quciki_flash( 'warning', $m );
		}
		if ( ! $ok ) {
			$notice = 'blocked';
		} elseif ( 'publish' === $action ) {
			list( $pub_ok, $pub_msg ) = quciki_publish_entry( $key );
			if ( $pub_ok ) {
				$notice = 'published';
			} else {
				$notice = 'blocked';
				quciki_flash( 'error', $pub_msg . ' Your changes were saved as a draft.' );
			}
		} elseif ( 'preview' === $action ) {
			quciki_redirect_to_preview( 'entry', $key );
		}
	}
	wp_safe_redirect( quciki_edit_url( $key, array( 'qk_notice' => $notice ) ) );
	exit;
}

add_action( 'admin_post_quciki_restore_entry', function () {
	$key   = isset( $_GET['key'] ) ? sanitize_text_field( wp_unslash( $_GET['key'] ) ) : '';
	$index = isset( $_GET['index'] ) ? absint( $_GET['index'] ) : 0;
	check_admin_referer( 'quciki_restore_' . $key . '_' . $index );
	if ( ! current_user_can( 'quciki_edit' ) || ! quciki_valid_key( $key ) || ! quciki_entry_def( $key ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	quciki_restore_history( $key, $index );
	wp_safe_redirect( quciki_edit_url( $key, array( 'qk_notice' => 'restored' ) ) );
	exit;
} );

/* ------------------------------------------------------------------ *
 * Settings
 * ------------------------------------------------------------------ */

/** Calls the website's refresh route with the saved secret and explains the result in plain words. */
function quciki_test_connection() {
	$s = quciki_settings();
	if ( ! quciki_connected() ) {
		return array( 'error', 'Fill in the Website URL and a shared secret of at least 16 characters first.' );
	}
	$res = wp_remote_post( $s['frontend_url'] . '/api/revalidate', array(
		'timeout'     => 20,
		'redirection' => 0,
		'headers'     => array( 'x-revalidate-secret' => $s['revalidate_secret'] ),
	) );
	if ( is_wp_error( $res ) ) {
		return array( 'error', 'Could not reach the website: ' . $res->get_error_message() . '. Check the Website URL.' );
	}
	$code = (int) wp_remote_retrieve_response_code( $res );
	if ( 200 === $code ) {
		return array( 'success', 'Connected. The website accepted the secret and refreshed its pages. Forms, publishing and preview will work.' );
	}
	if ( 401 === $code ) {
		return array( 'error', 'The website rejected the secret. REVALIDATE_SECRET in Vercel must be exactly the same as the Shared secret here (letters, numbers, - and _ only). After changing it in Vercel, redeploy the site.' );
	}
	if ( in_array( $code, array( 404, 405 ), true ) ) {
		return array( 'error', 'The website answered, but it does not have the refresh route. Redeploy the latest version of the website, or check that the Website URL is the right project.' );
	}
	if ( $code >= 300 && $code < 400 ) {
		return array( 'error', 'The website redirected the request. Use the final address as the Website URL (for example with or without www, as the site shows it).' );
	}
	return array( 'error', 'The website answered with an unexpected status (' . $code . '). Check the Vercel deployment.' );
}

function quciki_settings_page() {
	if ( ! current_user_can( 'quciki_manage' ) ) {
		wp_die( 'You do not have permission to view this page.' );
	}
	$notices = array();
	if ( isset( $_POST['quciki_settings_nonce'] ) ) {
		check_admin_referer( 'quciki_save_settings', 'quciki_settings_nonce' );
		$in  = wp_unslash( $_POST );
		$get = function ( $k ) use ( $in ) {
			return isset( $in[ $k ] ) && is_string( $in[ $k ] ) ? $in[ $k ] : '';
		};
		$new = array(
			'frontend_url'         => quciki_clean_https_url( $get( 'frontend_url' ) ),
			'revalidate_secret'    => preg_replace( '/[^A-Za-z0-9_\-]/', '', $get( 'revalidate_secret' ) ),
			'adsense_client'       => preg_match( '/^ca-pub-\d{10,20}$/', trim( $get( 'adsense_client' ) ) ) ? trim( $get( 'adsense_client' ) ) : '',
			'adsense_slot_results' => preg_replace( '/\D/', '', $get( 'adsense_slot_results' ) ),
			'adsense_slot_content' => preg_replace( '/\D/', '', $get( 'adsense_slot_content' ) ),
			'contact_email'        => sanitize_email( $get( 'contact_email' ) ),
			'google_verification'  => preg_replace( '/[^A-Za-z0-9_\-]/', '', $get( 'google_verification' ) ),
			'notify_email'         => sanitize_email( $get( 'notify_email' ) ),
			'review_months'        => (string) max( 1, min( 60, absint( $get( 'review_months' ) ) ) ),
		);
		$typed_secret = trim( $get( 'revalidate_secret' ) );
		if ( $typed_secret !== $new['revalidate_secret'] ) {
			$notices[] = array( 'warning', 'The shared secret can only contain letters, numbers, - and _. Other characters were removed, so the saved secret is different from what you typed. Use a secret made only of those characters, and put the same value in Vercel.' );
		}
		if ( '' !== $new['revalidate_secret'] && strlen( $new['revalidate_secret'] ) < 16 ) {
			$notices[] = array( 'warning', 'The shared secret is shorter than 16 characters, so the website connection is switched off. Use at least 16.' );
		}
		update_option( 'quciki_settings', $new, false );
		$notices[] = array( 'success', 'Settings saved.' );
		// Always check the connection after saving, or when the Test button was used.
		$notices[] = quciki_test_connection();
	}
	$s = quciki_settings();
	echo '<div class="wrap quciki"><h1>Quciki settings</h1>';
	foreach ( $notices as $n ) {
		printf( '<div class="notice notice-%s"><p>%s</p></div>', esc_attr( $n[0] ), esc_html( $n[1] ) );
	}
	echo '<form method="post">';
	wp_nonce_field( 'quciki_save_settings', 'quciki_settings_nonce' );
	echo '<h2>Connection to the website</h2><table class="form-table" role="presentation">';
	quciki_setting_row( 'frontend_url', 'Website URL', $s, 'The address of the public website, for example https://quciki.vercel.app (no trailing slash). WordPress calls it to refresh pages and open previews.' );
	quciki_setting_row( 'revalidate_secret', 'Shared secret', $s, '16 or more characters, using only letters, numbers, - and _ (other characters are removed). Must equal REVALIDATE_SECRET in the website settings (Vercel). Keep it private.' );
	echo '</table><h2>Public site settings</h2><p>These values are sent to the website and are public. Do not enter anything secret.</p><table class="form-table" role="presentation">';
	quciki_setting_row( 'contact_email', 'Contact email', $s, 'Shown on the Contact page and in the footer.' );
	quciki_setting_row( 'adsense_client', 'AdSense publisher ID', $s, 'ca-pub-0000000000000000. Leave empty until AdSense approves the site.' );
	quciki_setting_row( 'adsense_slot_results', 'AdSense ad unit: results', $s, 'Numbers only.' );
	quciki_setting_row( 'adsense_slot_content', 'AdSense ad unit: content', $s, 'Numbers only.' );
	quciki_setting_row( 'google_verification', 'Search Console verification code', $s, 'Only the code from the meta tag content value.' );
	echo '</table><h2>Messages and reviews</h2><table class="form-table" role="presentation">';
	quciki_setting_row( 'notify_email', 'Email me about new messages', $s, 'Optional. Leave empty for no emails; messages are always saved under Quciki > Messages.' );
	quciki_setting_row( 'review_months', 'Review cycle (months)', $s, 'Pages with a review sign-off are flagged on the dashboard when older than this.' );
	echo '</table>';
	submit_button( 'Save settings and test connection' );
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
