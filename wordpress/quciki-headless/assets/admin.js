(function () {
  'use strict';

  /* ---- filter on the Pages and text list ---- */
  var filter = document.getElementById('qk-filter');
  if (filter) {
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      document.querySelectorAll('.qk-table').forEach(function (table) {
        var any = false;
        table.querySelectorAll('tbody tr').forEach(function (tr) {
          var show = !q || (tr.getAttribute('data-filter') || '').indexOf(q) !== -1;
          tr.hidden = !show;
          if (show) any = true;
        });
        table.hidden = !any;
        if (table.previousElementSibling) table.previousElementSibling.hidden = !any;
      });
    });
  }

  var form = document.getElementById('qk-edit-form');
  if (!form) return;

  /* ---- repeatable rows ---- */
  function renumber(list) {
    var label = list.getAttribute('data-label') || 'Item';
    list.querySelectorAll('.qk-rows > .qk-row').forEach(function (row, i) {
      var title = row.querySelector('.qk-row-title');
      if (title) title.textContent = label + ' ' + (i + 1);
    });
  }

  function reindex(list) {
    var base = list.getAttribute('data-name');
    list.querySelectorAll('.qk-rows > .qk-row').forEach(function (row, i) {
      row.querySelectorAll('[name]').forEach(function (el) {
        var name = el.getAttribute('name');
        if (name.indexOf(base + '[') === 0) {
          el.setAttribute('name', base + '[' + i + ']' + name.slice(name.indexOf(']', base.length + 1) + 1));
        }
      });
    });
  }

  var counter = 0;
  form.querySelectorAll('.qk-list-field').forEach(function (list) {
    renumber(list);
    var rows = list.querySelector('.qk-rows');
    var max = parseInt(list.getAttribute('data-max') || '12', 10);
    var add = list.querySelector('.qk-add-row');

    function sync() {
      add.disabled = rows.children.length >= max;
      renumber(list);
    }

    add.addEventListener('click', function () {
      var tpl = list.querySelector('.qk-row-template');
      var html = tpl.innerHTML.replace(/__i__/g, 'n' + Date.now() + '_' + counter++);
      var holder = document.createElement('div');
      holder.innerHTML = html;
      var row = holder.firstElementChild;
      rows.appendChild(row);
      var first = row.querySelector('input,textarea');
      if (first) first.focus();
      sync();
    });

    rows.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var row = btn.closest('.qk-row');
      if (!row) return;
      if (btn.classList.contains('qk-remove')) {
        row.remove();
      } else if (btn.classList.contains('qk-up') && row.previousElementSibling) {
        rows.insertBefore(row, row.previousElementSibling);
      } else if (btn.classList.contains('qk-down') && row.nextElementSibling) {
        rows.insertBefore(row.nextElementSibling, row);
      }
      sync();
    });
    sync();
  });

  form.addEventListener('submit', function () {
    form.querySelectorAll('.qk-list-field').forEach(reindex);
    // Make sure rich text editors write their content back before the form is sent.
    if (window.tinyMCE && window.tinyMCE.triggerSave) window.tinyMCE.triggerSave();
  });

  /* ---- "Use default" buttons ---- */
  form.querySelectorAll('.qk-field').forEach(function (field) {
    var input = field.querySelector('[data-default]');
    var btn = field.querySelector('.qk-use-default');
    if (!input || !btn || field.querySelector('.qk-list-field')) return;
    function update() {
      btn.hidden = input.value === input.getAttribute('data-default');
    }
    input.addEventListener('input', update);
    btn.addEventListener('click', function () {
      input.value = input.getAttribute('data-default') || '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
    update();
  });

  /* ---- SEO length counters ---- */
  form.querySelectorAll('.qk-count').forEach(function (el) {
    var out = el.parentNode.querySelector('.qk-counter');
    var ideal = parseInt(el.getAttribute('data-ideal') || '0', 10);
    function update() {
      var n = el.value.length;
      out.textContent = n + (ideal ? ' / about ' + ideal + ' characters' : ' characters');
      out.classList.toggle('qk-over', ideal && n > ideal);
    }
    el.addEventListener('input', update);
    update();
  });

  /* ---- media picker ---- */
  form.addEventListener('click', function (e) {
    var btn = e.target.closest('.qk-pick-image');
    if (!btn || !window.wp || !window.wp.media) return;
    e.preventDefault();
    var input = btn.parentNode.querySelector('input');
    var frame = window.wp.media({ title: 'Choose image', multiple: false, library: { type: 'image' } });
    frame.on('select', function () {
      var a = frame.state().get('selection').first().toJSON();
      input.value = a.url;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    frame.open();
  });
})();
