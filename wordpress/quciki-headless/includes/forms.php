<?php
/**
 * Messages, subscribers and saved estimates from the website forms.
 * The website sends submissions here (server to server, with the shared secret). Visitors never talk to WordPress.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function quciki_message_statuses() {
	return array( 'new' => 'New', 'in_progress' => 'In progress', 'done' => 'Done', 'spam' => 'Spam' );
}

add_action( 'init', function () {
	$common = array(
		'public'              => false,
		'show_ui'             => true,
		'show_in_menu'        => 'quciki',
		'show_in_rest'        => false,
		'exclude_from_search' => true,
		'publicly_queryable'  => false,
		'has_archive'         => false,
		'rewrite'             => false,
		'query_var'           => false,
		'capability_type'     => 'page', // editors and administrators only
		'map_meta_cap'        => true,
		'capabilities'        => array( 'create_posts' => 'do_not_allow' ),
		'supports'            => array( 'title' ),
	);
	register_post_type( 'qk_message', array_merge( $common, array( 'labels' => quciki_labels( 'Message', 'Messages' ) ) ) );
	register_post_type( 'qk_subscriber', array_merge( $common, array( 'labels' => quciki_labels( 'Subscriber', 'Subscribers' ) ) ) );
	register_post_type( 'qk_estimate', array_merge( $common, array( 'labels' => quciki_labels( 'Saved estimate', 'Saved estimates' ) ) ) );
} );

/* ------------------------------------------------------------------ *
 * Receiving submissions
 * ------------------------------------------------------------------ */

add_action( 'rest_api_init', function () {
	register_rest_route( 'quciki/v1', '/submit/(?P<type>message|subscriber|estimate)', array(
		'methods'             => 'POST',
		'callback'            => 'quciki_rest_submit',
		'permission_callback' => '__return_true', // checked inside: shared secret
	) );
} );

function quciki_rate_limit_ok( $type, $client ) {
	$limits = array( 'message' => 5, 'subscriber' => 10, 'estimate' => 10 );
	$client = preg_match( '/^[a-f0-9]{16,64}$/', (string) $client ) ? $client : 'unknown';
	$bump   = function ( $name, $max ) {
		$n = (int) get_transient( $name );
		if ( $n >= $max ) {
			return false;
		}
		set_transient( $name, $n + 1, HOUR_IN_SECONDS );
		return true;
	};
	// Per visitor, and a global ceiling per type so one attacker cannot flood the database.
	return $bump( 'quciki_rl_' . $type . '_' . $client, $limits[ $type ] ) && $bump( 'quciki_rl_all_' . $type, 300 );
}

function quciki_rest_submit( $request ) {
	if ( ! quciki_request_has_secret( $request ) ) {
		return new WP_Error( 'quciki_forbidden', 'Not allowed.', array( 'status' => 401 ) );
	}
	$type = (string) $request['type'];
	if ( ! quciki_rate_limit_ok( $type, (string) $request->get_header( 'x-qk-client' ) ) ) {
		return new WP_Error( 'quciki_rate', 'Too many submissions.', array( 'status' => 429 ) );
	}
	$d = $request->get_json_params();
	$d = is_array( $d ) ? $d : array();

	$email = isset( $d['email'] ) ? sanitize_email( (string) $d['email'] ) : '';
	if ( '' === $email || ! is_email( $email ) ) {
		return new WP_Error( 'quciki_bad', 'Invalid email.', array( 'status' => 400 ) );
	}

	switch ( $type ) {
		case 'message':
			$name    = quciki_mb_cut( sanitize_text_field( isset( $d['name'] ) ? (string) $d['name'] : '' ), 100 );
			$topic   = quciki_mb_cut( sanitize_text_field( isset( $d['topic'] ) ? (string) $d['topic'] : '' ), 120 );
			$message = quciki_mb_cut( sanitize_textarea_field( isset( $d['message'] ) ? (string) $d['message'] : '' ), 4000 );
			if ( '' === $name || strlen( $message ) < 5 || '' === $topic ) {
				return new WP_Error( 'quciki_bad', 'Missing fields.', array( 'status' => 400 ) );
			}
			$id = wp_insert_post( array(
				'post_type'   => 'qk_message',
				'post_status' => 'publish',
				'post_title'  => quciki_mb_cut( $topic . ': ' . $name, 190 ),
			), true );
			if ( is_wp_error( $id ) ) {
				return new WP_Error( 'quciki_fail', 'Could not save.', array( 'status' => 500 ) );
			}
			update_post_meta( $id, '_qk_name', $name );
			update_post_meta( $id, '_qk_email', $email );
			update_post_meta( $id, '_qk_topic', $topic );
			update_post_meta( $id, '_qk_message', $message );
			update_post_meta( $id, '_qk_status', 'new' );
			quciki_notify_new_message( $name, $email, $topic, $message );
			break;

		case 'subscriber':
			quciki_add_subscriber( $email, isset( $d['source'] ) ? (string) $d['source'] : '' );
			break;

		case 'estimate':
			$calc    = isset( $d['calculator'] ) ? sanitize_title( (string) $d['calculator'] ) : '';
			$valid   = wp_list_pluck( quciki_schema()['calculators'], 'slug' );
			$summary = quciki_mb_cut( sanitize_text_field( isset( $d['summary'] ) ? (string) $d['summary'] : '' ), 500 );
			$inputs  = array();
			if ( isset( $d['inputs'] ) && is_array( $d['inputs'] ) ) {
				foreach ( $d['inputs'] as $k => $v ) {
					if ( is_string( $k ) && preg_match( '/^[A-Za-z0-9_]{1,40}$/', $k ) && is_numeric( $v ) ) {
						$inputs[ $k ] = 0 + $v;
					}
				}
			}
			if ( ! in_array( $calc, $valid, true ) ) {
				return new WP_Error( 'quciki_bad', 'Unknown calculator.', array( 'status' => 400 ) );
			}
			$id = wp_insert_post( array(
				'post_type'   => 'qk_estimate',
				'post_status' => 'publish',
				'post_title'  => quciki_mb_cut( $email . ' (' . $calc . ')', 190 ),
			), true );
			if ( is_wp_error( $id ) ) {
				return new WP_Error( 'quciki_fail', 'Could not save.', array( 'status' => 500 ) );
			}
			update_post_meta( $id, '_qk_email', $email );
			update_post_meta( $id, '_qk_calculator', $calc );
			update_post_meta( $id, '_qk_summary', $summary );
			update_post_meta( $id, '_qk_inputs', wp_json_encode( $inputs ) );
			quciki_add_subscriber( $email, 'estimate:' . $calc );
			break;
	}
	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

function quciki_find_subscriber( $email ) {
	$ids = get_posts( array(
		'post_type'      => 'qk_subscriber',
		'post_status'    => 'any',
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_key'       => '_qk_email', // phpcs:ignore WordPress.DB.SlowDBQuery
		'meta_value'     => strtolower( $email ), // phpcs:ignore WordPress.DB.SlowDBQuery
		'no_found_rows'  => true,
	) );
	return $ids ? (int) $ids[0] : 0;
}

/** Adds a subscriber once. A repeat signup is accepted silently so nobody can check who is on the list. */
function quciki_add_subscriber( $email, $source ) {
	$email = strtolower( $email );
	if ( quciki_find_subscriber( $email ) ) {
		return;
	}
	$id = wp_insert_post( array(
		'post_type'   => 'qk_subscriber',
		'post_status' => 'publish',
		'post_title'  => $email,
	) );
	if ( $id && ! is_wp_error( $id ) ) {
		update_post_meta( $id, '_qk_email', $email );
		update_post_meta( $id, '_qk_source', quciki_mb_cut( sanitize_text_field( $source ), 80 ) );
		update_post_meta( $id, '_qk_status', 'active' );
	}
}

function quciki_notify_new_message( $name, $email, $topic, $message ) {
	$to = quciki_settings()['notify_email'];
	if ( '' === $to || ! is_email( $to ) ) {
		return;
	}
	// Names and topics go in the body only, never in headers, so they cannot inject headers.
	wp_mail(
		$to,
		'New website message',
		"Topic: $topic\nFrom: $name <$email>\n\n$message\n\nOpen it: " . admin_url( 'edit.php?post_type=qk_message' )
	);
}

/* ------------------------------------------------------------------ *
 * Admin: message screen, columns, filters
 * ------------------------------------------------------------------ */

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'qk_message_box', 'Message', 'quciki_box_message', 'qk_message', 'normal', 'high' );
	add_meta_box( 'qk_estimate_box', 'Saved estimate', 'quciki_box_estimate', 'qk_estimate', 'normal', 'high' );
	add_meta_box( 'qk_subscriber_box', 'Subscriber', 'quciki_box_subscriber', 'qk_subscriber', 'normal', 'high' );
} );

function quciki_box_message( $post ) {
	wp_nonce_field( 'quciki_save_form_item', 'quciki_form_nonce' );
	$status = quciki_meta( $post->ID, 'status' );
	printf(
		'<table class="form-table" role="presentation"><tr><th>From</th><td>%s &lt;<a href="mailto:%s">%s</a>&gt;</td></tr><tr><th>Topic</th><td>%s</td></tr><tr><th>Received</th><td>%s</td></tr><tr><th>Message</th><td><div style="white-space:pre-wrap;max-width:720px;padding:12px;background:#f6f7f7;border:1px solid #dcdcde">%s</div></td></tr></table>',
		esc_html( quciki_meta( $post->ID, 'name' ) ),
		esc_attr( quciki_meta( $post->ID, 'email' ) ),
		esc_html( quciki_meta( $post->ID, 'email' ) ),
		esc_html( quciki_meta( $post->ID, 'topic' ) ),
		esc_html( get_the_date( 'j M Y H:i', $post ) ),
		esc_html( quciki_meta( $post->ID, 'message' ) )
	);
	echo '<p><label for="qk_status"><strong>Status</strong></label><br><select id="qk_status" name="qk_status">';
	foreach ( quciki_message_statuses() as $k => $label ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $status, $k, false ), esc_html( $label ) );
	}
	echo '</select></p>';
	printf(
		'<p><label for="qk_note"><strong>Internal note</strong> <span class="description">(never shown on the website)</span></label><br><textarea class="widefat" rows="4" id="qk_note" name="qk_note">%s</textarea></p>',
		esc_textarea( quciki_meta( $post->ID, 'note' ) )
	);
}

function quciki_box_estimate( $post ) {
	$inputs = json_decode( quciki_meta( $post->ID, 'inputs' ), true );
	echo '<table class="form-table" role="presentation">';
	printf( '<tr><th>Email</th><td>%s</td></tr>', esc_html( quciki_meta( $post->ID, 'email' ) ) );
	printf( '<tr><th>Calculator</th><td>%s</td></tr>', esc_html( quciki_meta( $post->ID, 'calculator' ) ) );
	printf( '<tr><th>Result</th><td>%s</td></tr>', esc_html( quciki_meta( $post->ID, 'summary' ) ) );
	echo '<tr><th>Inputs</th><td>';
	if ( is_array( $inputs ) ) {
		foreach ( $inputs as $k => $v ) {
			printf( '<code>%s</code> = %s<br>', esc_html( $k ), esc_html( (string) $v ) );
		}
	}
	echo '</td></tr></table>';
}

function quciki_box_subscriber( $post ) {
	wp_nonce_field( 'quciki_save_form_item', 'quciki_form_nonce' );
	$status = quciki_meta( $post->ID, 'status' );
	printf( '<p><strong>Email:</strong> %s<br><strong>Source:</strong> %s<br><strong>Signed up:</strong> %s</p>', esc_html( quciki_meta( $post->ID, 'email' ) ), esc_html( quciki_meta( $post->ID, 'source' ) ), esc_html( get_the_date( 'j M Y H:i', $post ) ) );
	echo '<p><label for="qk_status"><strong>Status</strong></label><br><select id="qk_status" name="qk_status">';
	foreach ( array( 'active' => 'Active', 'unsubscribed' => 'Unsubscribed' ) as $k => $label ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $status, $k, false ), esc_html( $label ) );
	}
	echo '</select></p>';
}

add_action( 'save_post', function ( $post_id, $post ) {
	if ( ! in_array( $post->post_type, array( 'qk_message', 'qk_subscriber' ), true ) || ! isset( $_POST['quciki_form_nonce'] ) ) {
		return;
	}
	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['quciki_form_nonce'] ) ), 'quciki_save_form_item' ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$allowed = 'qk_message' === $post->post_type ? array_keys( quciki_message_statuses() ) : array( 'active', 'unsubscribed' );
	$status  = quciki_post_value( 'qk_status' );
	if ( in_array( $status, $allowed, true ) ) {
		update_post_meta( $post_id, '_qk_status', $status );
	}
	if ( 'qk_message' === $post->post_type ) {
		quciki_set_meta( $post_id, 'note', quciki_mb_cut( sanitize_textarea_field( quciki_post_value( 'qk_note' ) ), 2000 ) );
	}
}, 10, 2 );

add_filter( 'manage_qk_message_posts_columns', function () {
	return array( 'cb' => '<input type="checkbox">', 'title' => 'Message', 'qk_email' => 'Email', 'qk_status' => 'Status', 'date' => 'Received' );
} );
add_filter( 'manage_qk_subscriber_posts_columns', function () {
	return array( 'cb' => '<input type="checkbox">', 'title' => 'Email', 'qk_source' => 'Source', 'qk_status' => 'Status', 'date' => 'Signed up' );
} );
add_filter( 'manage_qk_estimate_posts_columns', function () {
	return array( 'cb' => '<input type="checkbox">', 'title' => 'Estimate', 'qk_calc' => 'Calculator', 'date' => 'Saved' );
} );
add_action( 'manage_posts_custom_column', function ( $col, $post_id ) {
	switch ( $col ) {
		case 'qk_email':
			echo esc_html( quciki_meta( $post_id, 'email' ) );
			break;
		case 'qk_source':
			echo esc_html( quciki_meta( $post_id, 'source' ) );
			break;
		case 'qk_calc':
			echo esc_html( quciki_meta( $post_id, 'calculator' ) );
			break;
		case 'qk_status':
			$s      = quciki_meta( $post_id, 'status' );
			$labels = array_merge( quciki_message_statuses(), array( 'active' => 'Active', 'unsubscribed' => 'Unsubscribed' ) );
			echo esc_html( isset( $labels[ $s ] ) ? $labels[ $s ] : $s );
			break;
	}
}, 10, 2 );

// Status filter on the messages list.
add_action( 'restrict_manage_posts', function ( $post_type ) {
	if ( 'qk_message' !== $post_type ) {
		return;
	}
	$current = isset( $_GET['qk_status'] ) ? sanitize_key( wp_unslash( $_GET['qk_status'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	echo '<select name="qk_status"><option value="">All statuses</option>';
	foreach ( quciki_message_statuses() as $k => $label ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $current, $k, false ), esc_html( $label ) );
	}
	echo '</select>';
} );
add_action( 'pre_get_posts', function ( $q ) {
	if ( ! is_admin() || ! $q->is_main_query() || 'qk_message' !== $q->get( 'post_type' ) ) {
		return;
	}
	$status = isset( $_GET['qk_status'] ) ? sanitize_key( wp_unslash( $_GET['qk_status'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	if ( isset( quciki_message_statuses()[ $status ] ) ) {
		$q->set( 'meta_key', '_qk_status' ); // phpcs:ignore WordPress.DB.SlowDBQuery
		$q->set( 'meta_value', $status ); // phpcs:ignore WordPress.DB.SlowDBQuery
	}
} );

function quciki_count_messages( $status ) {
	$q = new WP_Query( array(
		'post_type'      => 'qk_message',
		'post_status'    => 'publish',
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_key'       => '_qk_status', // phpcs:ignore WordPress.DB.SlowDBQuery
		'meta_value'     => $status, // phpcs:ignore WordPress.DB.SlowDBQuery
	) );
	return (int) $q->found_posts;
}

/* ------------------------------------------------------------------ *
 * CSV export of subscribers
 * ------------------------------------------------------------------ */

add_action( 'admin_notices', function () {
	$screen = get_current_screen();
	if ( ! $screen || 'edit-qk_subscriber' !== $screen->id || ! current_user_can( 'quciki_publish' ) ) {
		return;
	}
	$url = wp_nonce_url( admin_url( 'admin-post.php?action=quciki_export_subscribers' ), 'quciki_export_subscribers' );
	printf( '<div class="notice notice-info"><p><a class="button button-primary" href="%s">Download subscribers (CSV)</a> Active subscribers only.</p></div>', esc_url( $url ) );
} );

add_action( 'admin_post_quciki_export_subscribers', function () {
	if ( ! current_user_can( 'quciki_publish' ) ) {
		wp_die( 'You do not have permission to export.', 403 );
	}
	check_admin_referer( 'quciki_export_subscribers' );
	$ids = get_posts( array(
		'post_type'      => 'qk_subscriber',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'fields'         => 'ids',
		'no_found_rows'  => true,
	) );
	nocache_headers();
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="subscribers-' . gmdate( 'Y-m-d' ) . '.csv"' );
	$out = fopen( 'php://output', 'w' );
	fputcsv( $out, array( 'email', 'source', 'signed_up' ) );
	foreach ( $ids as $id ) {
		if ( 'unsubscribed' === quciki_meta( $id, 'status' ) ) {
			continue;
		}
		// A leading = + - @ would be run as a formula by spreadsheet programs, so such values get a leading quote.
		$cell = function ( $v ) {
			return preg_match( '/^[=+\-@\t\r]/', $v ) ? "'" . $v : $v;
		};
		fputcsv( $out, array( $cell( quciki_meta( $id, 'email' ) ), $cell( quciki_meta( $id, 'source' ) ), get_the_date( 'c', $id ) ) );
	}
	fclose( $out );
	exit;
} );

/* ------------------------------------------------------------------ *
 * WordPress personal data tools (Tools > Export / Erase Personal Data)
 * ------------------------------------------------------------------ */

function quciki_posts_by_email( $email ) {
	return get_posts( array(
		'post_type'      => array( 'qk_message', 'qk_subscriber', 'qk_estimate' ),
		'post_status'    => 'any',
		'posts_per_page' => -1,
		'meta_key'       => '_qk_email', // phpcs:ignore WordPress.DB.SlowDBQuery
		'meta_value'     => strtolower( $email ), // phpcs:ignore WordPress.DB.SlowDBQuery
		'no_found_rows'  => true,
	) );
}

add_filter( 'wp_privacy_personal_data_exporters', function ( $exporters ) {
	$exporters['quciki'] = array(
		'exporter_friendly_name' => 'Quciki website forms',
		'callback'               => function ( $email ) {
			$items = array();
			foreach ( quciki_posts_by_email( $email ) as $p ) {
				$data = array( array( 'name' => 'Type', 'value' => $p->post_type ), array( 'name' => 'Email', 'value' => quciki_meta( $p->ID, 'email' ) ) );
				foreach ( array( 'name', 'topic', 'message', 'source', 'calculator', 'summary' ) as $k ) {
					if ( '' !== quciki_meta( $p->ID, $k ) ) {
						$data[] = array( 'name' => ucfirst( $k ), 'value' => quciki_meta( $p->ID, $k ) );
					}
				}
				$items[] = array( 'group_id' => 'quciki', 'group_label' => 'Quciki website forms', 'item_id' => 'quciki-' . $p->ID, 'data' => $data );
			}
			return array( 'data' => $items, 'done' => true );
		},
	);
	return $exporters;
} );

add_filter( 'wp_privacy_personal_data_erasers', function ( $erasers ) {
	$erasers['quciki'] = array(
		'eraser_friendly_name' => 'Quciki website forms',
		'callback'             => function ( $email ) {
			$removed = false;
			foreach ( quciki_posts_by_email( $email ) as $p ) {
				wp_delete_post( $p->ID, true );
				$removed = true;
			}
			return array( 'items_removed' => $removed, 'items_retained' => false, 'messages' => array(), 'done' => true );
		},
	);
	return $erasers;
} );
