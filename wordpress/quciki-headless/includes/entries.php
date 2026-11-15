<?php
/**
 * Storage and validation for editable pages and text ("entries").
 *
 * Each entry is one option holding three things:
 *   live     what the website shows (only the fields that differ from the defaults in the website code)
 *   draft    unpublished changes, previewable on the site
 *   history  the last live versions, restorable into the draft
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const QUCIKI_HISTORY_LIMIT = 10;

function quciki_entry_option( $key ) {
	return 'quciki_e_' . $key;
}

function quciki_valid_key( $key ) {
	return (bool) preg_match( '/^[a-z0-9][a-z0-9-]{0,80}$/', (string) $key );
}

function quciki_empty_slot() {
	return array(
		'values'      => array(),
		'seo'         => array(),
		'reviewed_by' => '',
		'reviewed_at' => '',
		'path'        => '',
		'at'          => '',
		'by'          => 0,
	);
}

function quciki_normalize_slot( $slot ) {
	if ( ! is_array( $slot ) ) {
		return null;
	}
	return array_merge( quciki_empty_slot(), $slot );
}

function quciki_entry_record( $key ) {
	$raw = get_option( quciki_entry_option( $key ), array() );
	$raw = is_array( $raw ) ? $raw : array();
	return array(
		'live'    => isset( $raw['live'] ) ? quciki_normalize_slot( $raw['live'] ) : null,
		'draft'   => isset( $raw['draft'] ) ? quciki_normalize_slot( $raw['draft'] ) : null,
		'history' => isset( $raw['history'] ) && is_array( $raw['history'] ) ? array_values( $raw['history'] ) : array(),
	);
}

function quciki_save_record( $key, $record ) {
	if ( ! $record['live'] && ! $record['draft'] && ! $record['history'] ) {
		delete_option( quciki_entry_option( $key ) );
		return;
	}
	update_option( quciki_entry_option( $key ), $record, false );
}

/** key => record summary for every entry that has been touched. One query. */
function quciki_all_records( $refresh = false ) {
	global $wpdb;
	static $cache = null;
	if ( $refresh ) {
		$cache = null;
	}
	if ( null !== $cache ) {
		return $cache;
	}
	$like = $wpdb->esc_like( 'quciki_e_' ) . '%';
	$rows = $wpdb->get_results( $wpdb->prepare( "SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE %s", $like ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$cache = array();
	foreach ( (array) $rows as $row ) {
		$key = substr( $row->option_name, strlen( 'quciki_e_' ) );
		if ( ! quciki_valid_key( $key ) ) {
			continue;
		}
		$raw = maybe_unserialize( $row->option_value );
		$raw = is_array( $raw ) ? $raw : array();
		$cache[ $key ] = array(
			'live'    => isset( $raw['live'] ) ? quciki_normalize_slot( $raw['live'] ) : null,
			'draft'   => isset( $raw['draft'] ) ? quciki_normalize_slot( $raw['draft'] ) : null,
			'history' => isset( $raw['history'] ) && is_array( $raw['history'] ) ? $raw['history'] : array(),
		);
	}
	return $cache;
}

/* ------------------------------------------------------------------ *
 * Field cleaning
 * ------------------------------------------------------------------ */

function quciki_normalize_html( $html ) {
	$html = trim( (string) $html );
	$html = preg_replace( '/>\s+</', '><', $html );
	$html = preg_replace( '/\s+/', ' ', $html );
	return $html;
}

/** Cleans one text value. Returns a string. */
function quciki_clean_text_value( $f, $raw ) {
	$raw  = is_string( $raw ) ? $raw : '';
	$max  = isset( $f['max'] ) ? (int) $f['max'] : 2000;
	switch ( $f['type'] ) {
		case 'textarea':
			return quciki_mb_cut( trim( sanitize_textarea_field( $raw ) ), $max );
		case 'richtext':
			return quciki_mb_cut( trim( wp_kses_post( $raw ) ), 60000 );
		case 'url':
		case 'image':
			return quciki_clean_target( $raw );
		case 'date':
			return preg_match( '/^\d{4}-\d{2}-\d{2}$/', trim( $raw ) ) ? trim( $raw ) : '';
		default:
			return quciki_mb_cut( trim( sanitize_text_field( $raw ) ), $max );
	}
}

function quciki_text_equal( $f, $a, $b ) {
	if ( 'richtext' === $f['type'] ) {
		return quciki_normalize_html( $a ) === quciki_normalize_html( $b );
	}
	return (string) $a === (string) $b;
}

/** Cleans a list value into a list of rows (empty rows dropped). */
function quciki_clean_list_value( $f, $raw ) {
	$rows = array();
	if ( ! is_array( $raw ) ) {
		return $rows;
	}
	foreach ( $raw as $row ) {
		if ( ! is_array( $row ) ) {
			continue;
		}
		$clean = array();
		$any   = false;
		foreach ( $f['item'] as $sk => $sf ) {
			$v           = quciki_clean_text_value( $sf, isset( $row[ $sk ] ) ? $row[ $sk ] : '' );
			$clean[ $sk ] = $v;
			if ( '' !== $v ) {
				$any = true;
			}
		}
		if ( $any ) {
			$rows[] = $clean;
		}
		if ( count( $rows ) >= (int) $f['max'] ) {
			break;
		}
	}
	return $rows;
}

function quciki_lists_equal( $a, $b ) {
	return wp_json_encode( array_values( $a ) ) === wp_json_encode( array_values( $b ) );
}

function quciki_default_list( $f ) {
	return quciki_clean_list_value( $f, isset( $f['default'] ) ? $f['default'] : array() );
}

/**
 * Turns posted form data into the values to store (only differences from the defaults).
 * Returns array( values, reset ) where reset lists required fields that were empty and fell back to the default.
 */
function quciki_values_from_post( $def, $posted ) {
	$values = array();
	$reset  = array();
	$posted = is_array( $posted ) ? $posted : array();
	foreach ( $def['fields'] as $key => $f ) {
		if ( 'list' === $f['type'] ) {
			$rows    = quciki_clean_list_value( $f, isset( $posted[ $key ] ) ? $posted[ $key ] : array() );
			$default = quciki_default_list( $f );
			if ( ! $rows ) {
				if ( $default ) {
					$reset[] = $f['label'];
				}
				continue;
			}
			if ( ! quciki_lists_equal( $rows, $default ) ) {
				$values[ $key ] = $rows;
			}
			continue;
		}
		$v       = quciki_clean_text_value( $f, isset( $posted[ $key ] ) ? $posted[ $key ] : '' );
		$default = quciki_clean_text_value( $f, $f['default'] );
		if ( '' === $v && '' !== $default && empty( $f['optional'] ) ) {
			$reset[] = $f['label'];
			continue;
		}
		if ( ! quciki_text_equal( $f, $v, $default ) ) {
			$values[ $key ] = $v;
		}
	}
	return array( $values, $reset );
}

/** Full values (defaults + stored differences) for showing in the form. */
function quciki_effective_values( $def, $slot ) {
	$stored = $slot ? $slot['values'] : array();
	$out    = array();
	foreach ( $def['fields'] as $key => $f ) {
		if ( isset( $stored[ $key ] ) ) {
			$out[ $key ] = $stored[ $key ];
		} else {
			$out[ $key ] = 'list' === $f['type'] ? quciki_default_list( $f ) : (string) $f['default'];
		}
	}
	return $out;
}

function quciki_seo_from_post( $posted ) {
	$posted = is_array( $posted ) ? $posted : array();
	$g      = function ( $k ) use ( $posted ) {
		return isset( $posted[ $k ] ) && is_string( $posted[ $k ] ) ? $posted[ $k ] : '';
	};
	$seo = array(
		'title'       => quciki_mb_cut( sanitize_text_field( $g( 'title' ) ), 200 ),
		'description' => quciki_mb_cut( sanitize_textarea_field( $g( 'description' ) ), 400 ),
		'canonical'   => quciki_clean_target( $g( 'canonical' ) ),
		'og_image'    => quciki_clean_target( $g( 'og_image' ) ),
		'noindex'     => '1' === $g( 'noindex' ) ? '1' : '',
	);
	return array_filter( $seo, function ( $v ) {
		return '' !== $v;
	} );
}

/* ------------------------------------------------------------------ *
 * Draft, publish, discard, reset, restore
 * ------------------------------------------------------------------ */

/** The slot an editor starts from: the draft if there is one, else the live version. */
function quciki_working_slot( $record ) {
	return $record['draft'] ? $record['draft'] : $record['live'];
}

/**
 * Saves the posted form as the draft.
 * Returns array( ok, messages[] ).
 */
function quciki_save_draft( $key, $posted, $posted_seo, $posted_review ) {
	$def = quciki_entry_def( $key );
	if ( ! $def ) {
		return array( false, array( 'Unknown page.' ) );
	}
	$record  = quciki_entry_record( $key );
	$current = quciki_working_slot( $record );
	list( $values, $reset ) = quciki_values_from_post( $def, $posted );

	$slot           = quciki_empty_slot();
	$slot['values'] = $values;
	$slot['path']   = isset( $def['path'] ) && $def['path'] ? $def['path'] : '';
	$slot['seo']    = ! empty( $def['path'] ) ? quciki_seo_from_post( $posted_seo ) : array();
	$slot['at']     = gmdate( 'c' );
	$slot['by']     = get_current_user_id();

	// Only reviewers can change the sign-off. Everyone else keeps what is already saved.
	$slot['reviewed_by'] = $current ? $current['reviewed_by'] : '';
	$slot['reviewed_at'] = $current ? $current['reviewed_at'] : '';
	if ( ! empty( $def['review'] ) && current_user_can( 'quciki_review' ) && is_array( $posted_review ) ) {
		$by   = isset( $posted_review['by'] ) ? quciki_mb_cut( trim( sanitize_text_field( $posted_review['by'] ) ), 160 ) : '';
		$at   = isset( $posted_review['at'] ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', trim( $posted_review['at'] ) ) ? trim( $posted_review['at'] ) : '';
		$slot['reviewed_by'] = $by;
		$slot['reviewed_at'] = $at;
	}

	$messages = array();
	// If someone other than a reviewer changes the text, the earlier sign-off no longer covers it.
	if ( ! empty( $def['review'] ) && ! current_user_can( 'quciki_review' ) && $current && ( '' !== $slot['reviewed_by'] || '' !== $slot['reviewed_at'] ) && $current['values'] != $values ) {
		$slot['reviewed_by'] = '';
		$slot['reviewed_at'] = '';
		$messages[]          = 'The text changed after the last review, so the sign-off was cleared. A reviewer needs to sign it off again before it can be published.';
	}

	$record['draft'] = $slot;
	quciki_save_record( $key, $record );

	if ( $reset ) {
		$messages[] = 'These required fields were empty, so the default text is used: ' . implode( ', ', $reset ) . '.';
	}
	return array( true, $messages );
}

/** Publishes the saved draft to the website. Returns array( ok, message ). */
function quciki_publish_entry( $key ) {
	$def = quciki_entry_def( $key );
	if ( ! $def ) {
		return array( false, 'Unknown page.' );
	}
	if ( ! current_user_can( 'quciki_publish' ) ) {
		return array( false, 'You can save drafts, but only an Editor or Administrator can publish.' );
	}
	$record = quciki_entry_record( $key );
	$draft  = $record['draft'];
	if ( ! $draft ) {
		return array( false, 'There are no unpublished changes to publish.' );
	}
	if ( 'required' === ( isset( $def['review'] ) ? $def['review'] : '' ) && ( '' === $draft['reviewed_by'] || '' === $draft['reviewed_at'] ) ) {
		return array( false, 'This page needs a reviewer name and review date before it can be published. Ask a reviewer to sign it off.' );
	}
	if ( $record['live'] ) {
		array_unshift( $record['history'], $record['live'] );
		$record['history'] = array_slice( $record['history'], 0, QUCIKI_HISTORY_LIMIT );
	}
	$draft['at'] = gmdate( 'c' );
	$draft['by'] = get_current_user_id();
	$record['live']  = $draft;
	$record['draft'] = null;
	quciki_save_record( $key, $record );
	quciki_mark_dirty();
	return array( true, 'Published. The website will refresh in a few seconds.' );
}

function quciki_discard_draft( $key ) {
	$record          = quciki_entry_record( $key );
	$record['draft'] = null;
	quciki_save_record( $key, $record );
}

/** Goes back to the default text from the website code. The old live version stays in the history. */
function quciki_reset_entry( $key ) {
	$record = quciki_entry_record( $key );
	if ( $record['live'] ) {
		array_unshift( $record['history'], $record['live'] );
		$record['history'] = array_slice( $record['history'], 0, QUCIKI_HISTORY_LIMIT );
	}
	$record['live']  = null;
	$record['draft'] = null;
	quciki_save_record( $key, $record );
	quciki_mark_dirty();
}

/** Puts an earlier live version into the draft so it can be previewed and published again. */
function quciki_restore_history( $key, $index ) {
	$record = quciki_entry_record( $key );
	if ( ! isset( $record['history'][ $index ] ) ) {
		return false;
	}
	$slot            = quciki_normalize_slot( $record['history'][ $index ] );
	$slot['at']      = gmdate( 'c' );
	$slot['by']      = get_current_user_id();
	$record['draft'] = $slot;
	quciki_save_record( $key, $record );
	return true;
}

/** Entries that need attention: unpublished drafts and reviews that are missing or old. */
function quciki_attention_list() {
	$settings = quciki_settings();
	$months   = max( 1, (int) $settings['review_months'] );
	$cutoff   = strtotime( '-' . $months . ' months' );
	$records  = quciki_all_records();
	$schema   = quciki_schema();
	$drafts   = array();
	$reviews  = array();
	foreach ( $records as $key => $r ) {
		if ( $r['draft'] && isset( $schema['by_key'][ $key ] ) ) {
			$drafts[] = $key;
		}
	}
	foreach ( $schema['by_key'] as $key => $def ) {
		if ( empty( $def['review'] ) ) {
			continue;
		}
		$live = isset( $records[ $key ] ) ? $records[ $key ]['live'] : null;
		$at   = $live && $live['reviewed_at'] ? strtotime( $live['reviewed_at'] ) : false;
		if ( 'required' === $def['review'] && ( ! $at || $at < $cutoff ) ) {
			$reviews[] = $key;
		} elseif ( 'optional' === $def['review'] && $at && $at < $cutoff ) {
			$reviews[] = $key;
		}
	}
	return array( 'drafts' => $drafts, 'reviews' => $reviews, 'months' => $months );
}
