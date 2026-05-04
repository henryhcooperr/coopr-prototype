/* global window, document */
/* hifi-docs-r7-blocks.jsx — Docs R7 interactive blocks expansion.

   Registers 6 new component-block slash verbs joining the R6 6 (total 12)
   under the COOPR Components category:
     · Caption A/B           — multi-platform char counter + scoring
     · Pull-quote            — oversized editorial quote with attribution
     · Stat callout          — big number + label + delta
     · Channel preview       — IG / TikTok / YT shape previews side-by-side
     · Series pin            — auto-pulls 3 docs from same series
     · Comment poll          — 4-option poll with mock voting

   Loads after R6 (depends on HF_DocsSlashRegister + HF_DocsBlockBuilders).
*/

(function () {
  'use strict';
  if (window.__DOCS_R7_BLOCKS_BOOTED__) return;
  window.__DOCS_R7_BLOCKS_BOOTED__ = true;

  // ── 1. Caption A/B ───────────────────────────────────────────────
  const PLATFORMS = [
    { id: 'ig', label: 'IG', limit: 2200 },
    { id: 'tt', label: 'TikTok', limit: 2200 },
    { id: 'li', label: 'LinkedIn', limit: 3000 },
    { id: 'x',  label: 'X', limit: 280 },
  ];
  const CAPTION_AB_HTML = (id) => {
    const samples = [
      'I dropped to 95 feet in Truk Lagoon and counted my breaths to eight before moving. The Fujikawa held me there.',
      'Eight breaths. The Fujikawa Maru. Truk Lagoon. The wreck doesn\'t care that you\'re here.',
      '',
    ];
    return (
      '<div class="r7-embed r7-embed-caption-ab" data-r7-embed-id="' + id + '" data-r7-embed-type="caption-ab" data-r7-platform="ig" contenteditable="false" ' +
      'style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
          '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Caption A/B · 3 variants</span>' +
          '<span style="flex:1;"></span>' +
          // Platform toggle
          '<div data-r7-cap-tabs="1" style="display:flex;gap:0;border:1px solid var(--border-subtle);border-radius:6px;overflow:hidden;">' +
            PLATFORMS.map(p => (
              '<span data-r7-action="cap-platform" data-r7-cap-platform="' + p.id + '" style="padding:3px 9px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;background:' + (p.id === 'ig' ? 'var(--accent-soft)' : 'var(--surface-1)') + ';color:' + (p.id === 'ig' ? 'var(--accent-primary)' : 'var(--fg-tertiary)') + ';border-right:1px solid var(--border-subtle);">' + p.label + '</span>'
            )).join('') +
          '</div>' +
          '<span data-r7-action="cap-score" style="padding:4px 12px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Score</span>' +
        '</div>' +
        ['A', 'B', 'C'].map((label, i) => (
          '<div data-r7-cap-row="' + i + '" style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--border-subtle);">' +
            '<span style="font-family:var(--font-serif);font-size:14px;font-style:italic;color:var(--fg-secondary);min-width:14px;">' + label + '</span>' +
            '<div data-r7-cap-text="1" contenteditable="true" style="flex:1;font-family:var(--font-serif);font-size:14px;line-height:1.55;color:var(--fg-primary);outline:none;min-height:18px;">' + samples[i] + '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;min-width:80px;">' +
              '<span data-r7-cap-count="' + i + '" style="font-family:var(--font-mono);font-size:10px;font-weight:600;color:var(--fg-tertiary);">' + samples[i].length + ' / 2200</span>' +
              '<span data-r7-cap-score-pill="' + i + '" style="font-family:var(--font-mono);font-size:10px;font-weight:600;color:var(--fg-tertiary);">— /100</span>' +
            '</div>' +
          '</div>'
        )).join('') +
      '</div>'
    );
  };

  // ── 2. Pull-quote ────────────────────────────────────────────────
  const PULL_QUOTE_HTML = (id) => (
    '<div class="r7-embed r7-embed-pullquote" data-r7-embed-id="' + id + '" data-r7-embed-type="pullquote" contenteditable="false" ' +
    'style="display:block;margin:32px 0;padding:24px 28px 24px 32px;border-left:3px solid var(--accent-primary);background:linear-gradient(90deg, var(--accent-soft) 0%, transparent 80%);user-select:none;">' +
      '<div data-r7-pq-text="1" contenteditable="true" style="font-family:var(--font-serif);font-size:26px;font-style:italic;font-weight:500;line-height:1.25;color:var(--fg-primary);outline:none;letter-spacing:-0.005em;">' +
        'Eight breaths and the gun mount.' +
      '</div>' +
      '<div data-r7-pq-attribution="1" contenteditable="true" style="margin-top:14px;font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--fg-tertiary);outline:none;">' +
        '— Truk Lagoon · ep. 1 · cold open' +
      '</div>' +
      '<div style="margin-top:14px;display:flex;gap:8px;align-items:center;">' +
        '<span data-r7-action="pq-lift" style="padding:3px 10px;border:1px dashed var(--border-default);color:var(--fg-tertiary);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Lift from doc</span>' +
        '<span data-r7-action="pq-style" style="padding:3px 10px;border:1px solid var(--border-subtle);color:var(--fg-secondary);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Style: editorial</span>' +
      '</div>' +
    '</div>'
  );

  // ── 3. Stat callout ──────────────────────────────────────────────
  const STAT_CALLOUT_HTML = (id) => (
    '<div class="r7-embed r7-embed-stat" data-r7-embed-id="' + id + '" data-r7-embed-type="stat" contenteditable="false" ' +
    'style="display:flex;gap:24px;align-items:center;margin:20px 0;padding:22px 24px;border:1px solid var(--border-subtle);border-radius:8px;background:var(--surface-2);user-select:none;">' +
      '<div data-r7-stat-num="1" contenteditable="true" style="font-family:var(--font-serif);font-size:48px;font-weight:600;line-height:1;color:var(--fg-primary);letter-spacing:-0.02em;outline:none;">342k</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div data-r7-stat-label="1" contenteditable="true" style="font-family:var(--font-mono);font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--fg-tertiary);outline:none;margin-bottom:4px;">Saves on similar posts</div>' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
          '<span data-r7-action="stat-toggle-direction" data-r7-stat-dir="up" style="display:inline-flex;align-items:center;font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--accent-primary);cursor:pointer;">' +
            '<svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" style="margin-right:3px;"><path d="M6 2 L10 7 L2 7 Z" fill="currentColor"/></svg>' +
          '</span>' +
          '<span data-r7-stat-delta="1" contenteditable="true" style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--accent-primary);outline:none;">+58%</span>' +
          '<span data-r7-stat-period="1" contenteditable="true" style="font-family:var(--font-mono);font-size:11px;color:var(--fg-tertiary);outline:none;">vs last 30d</span>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  // ── 4. Channel preview · IG / TikTok / YT side-by-side ───────────
  const CHANNEL_PREVIEW_HTML = (id) => (
    '<div class="r7-embed r7-embed-channels" data-r7-embed-id="' + id + '" data-r7-embed-type="channels" contenteditable="false" ' +
    'style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">' +
        '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Channel preview · same hook, three platforms</span>' +
        '<span style="flex:1;"></span>' +
        '<span data-r7-action="ch-edit-title" style="padding:3px 10px;border:1px solid var(--border-subtle);color:var(--fg-secondary);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Edit title</span>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:14px;align-items:end;">' +
        // IG portrait 4:5
        '<div data-r7-action="ch-open" data-r7-ch-platform="ig" style="cursor:pointer;">' +
          '<div style="aspect-ratio:4/5;background:linear-gradient(180deg, #2a4a3a 0%, #1a2a2a 100%);border-radius:8px;position:relative;overflow:hidden;">' +
            '<div data-r7-ch-title-ig="1" style="position:absolute;left:14px;right:14px;bottom:14px;font-family:var(--font-serif);font-size:18px;font-weight:600;line-height:1.2;color:#fdfcf9;text-shadow:0 1px 4px rgba(0,0,0,0.4);">The Fujikawa <em>in eight breaths.</em></div>' +
            '<div style="position:absolute;top:10px;left:14px;font-family:var(--font-mono);font-size:8.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:rgba(253,252,249,0.7);">cold open · 8s</div>' +
          '</div>' +
          '<div style="margin-top:6px;display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">' +
            '<span style="width:6px;height:6px;background:#e1306c;border-radius:50%;"></span> IG · 4:5' +
          '</div>' +
        '</div>' +
        // TikTok 9:16
        '<div data-r7-action="ch-open" data-r7-ch-platform="tt" style="cursor:pointer;">' +
          '<div style="aspect-ratio:9/16;background:linear-gradient(180deg, #1a2a2a 0%, #2a4a4a 100%);border-radius:8px;position:relative;overflow:hidden;">' +
            '<div data-r7-ch-title-tt="1" style="position:absolute;left:12px;right:12px;bottom:50px;font-family:var(--font-serif);font-size:15px;font-weight:600;line-height:1.2;color:#fdfcf9;text-shadow:0 1px 4px rgba(0,0,0,0.4);">95 feet · 8 breaths · the Fujikawa</div>' +
            '<div style="position:absolute;left:12px;bottom:14px;font-family:var(--font-mono);font-size:9px;font-weight:600;color:rgba(253,252,249,0.7);">@truk.diver · #wreckdiving</div>' +
            '<div style="position:absolute;top:10px;left:12px;font-family:var(--font-mono);font-size:8px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:rgba(253,252,249,0.7);">9:16 · 60s</div>' +
          '</div>' +
          '<div style="margin-top:6px;display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">' +
            '<span style="width:6px;height:6px;background:#fe2c55;border-radius:50%;"></span> TikTok · 9:16' +
          '</div>' +
        '</div>' +
        // YT thumbnail 16:9
        '<div data-r7-action="ch-open" data-r7-ch-platform="yt" style="cursor:pointer;">' +
          '<div style="aspect-ratio:16/9;background:linear-gradient(135deg, #2a3a4a 0%, #1a2a3a 100%);border-radius:8px;position:relative;overflow:hidden;">' +
            '<div data-r7-ch-title-yt="1" style="position:absolute;left:14px;right:14px;top:14px;font-family:var(--font-serif);font-size:14px;font-weight:700;line-height:1.15;color:#fdfcf9;text-shadow:0 1px 4px rgba(0,0,0,0.4);">I held my breath 8 times on a sunken Japanese warship</div>' +
            '<div style="position:absolute;bottom:10px;right:10px;padding:1px 5px;background:rgba(0,0,0,0.7);color:#fdfcf9;font-family:var(--font-mono);font-size:9px;font-weight:700;border-radius:3px;">11:04</div>' +
            '<div style="position:absolute;bottom:10px;left:14px;font-family:var(--font-mono);font-size:8px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:rgba(253,252,249,0.7);">YT · 16:9</div>' +
          '</div>' +
          '<div style="margin-top:6px;display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">' +
            '<span style="width:6px;height:6px;background:#ff0000;border-radius:50%;"></span> YouTube · 11:04' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  // ── 5. Series pin · pulls 3 most recent docs in same series ──────
  function buildSeriesPinHTML(id, currentDocId) {
    const docs = window.R5H_DOCS || [];
    const current = docs.find(d => d.id === currentDocId) || docs[0];
    const seriesKey = current && current.eyebrow ? current.eyebrow.split(' · ')[0] : null;
    let related = [];
    if (seriesKey) {
      related = docs.filter(d => d.eyebrow && d.eyebrow.split(' · ')[0] === seriesKey).slice(0, 3);
    }
    if (related.length === 0) related = docs.slice(0, 3);
    return (
      '<div class="r7-embed r7-embed-seriespin" data-r7-embed-id="' + id + '" data-r7-embed-type="seriespin" contenteditable="false" ' +
      'style="display:block;margin:20px 0;padding:16px 18px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
          '<span style="width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);color:var(--accent-primary);border-radius:5px;font-family:var(--font-mono);font-size:10px;font-weight:700;">SP</span>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--fg-tertiary);">Series · ' + (seriesKey || 'all docs') + '</div>' +
            '<div style="font-family:var(--font-serif);font-size:14px;color:var(--fg-primary);">' + related.length + ' related ' + (related.length === 1 ? 'doc' : 'docs') + '</div>' +
          '</div>' +
        '</div>' +
        related.map(d => (
          '<div data-r7-action="series-open" data-r7-series-doc-id="' + d.id + '" style="display:flex;gap:10px;align-items:center;padding:8px 10px;border-top:1px solid var(--border-subtle);cursor:pointer;">' +
            '<span style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);min-width:90px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (d.eyebrow || '') + '</span>' +
            '<span style="flex:1;font-family:var(--font-serif);font-size:13.5px;color:var(--fg-primary);">' + (d.title || '') + (d.italicTail ? ' <em style="color:var(--fg-tertiary);">' + d.italicTail + '</em>' : '') + '</span>' +
            '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;color:var(--fg-tertiary);">' + (d.statusVersion || '') + '</span>' +
            '<span style="font-family:var(--font-mono);font-size:9.5px;color:var(--fg-tertiary);min-width:50px;text-align:right;">' + (d.words || 0).toLocaleString() + '</span>' +
          '</div>'
        )).join('') +
      '</div>'
    );
  }
  const SERIES_PIN_HTML = (id) => {
    // Try to detect the current doc id from the active doc-view marker
    const docEl = document.querySelector('[data-shell-view="doc"]');
    const currentDocId = docEl && docEl.getAttribute('data-active-doc-id');
    return buildSeriesPinHTML(id, currentDocId);
  };

  // ── 6. Comment poll · 4 options with mock voting ─────────────────
  const POLL_HTML = (id) => (
    '<div class="r7-embed r7-embed-poll" data-r7-embed-id="' + id + '" data-r7-embed-type="poll" data-r7-poll-state="composing" contenteditable="false" ' +
    'style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
        '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Comment poll · pre-publish read</span>' +
        '<span style="flex:1;"></span>' +
        '<span data-r7-action="poll-open" style="padding:4px 12px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Open poll</span>' +
        '<span data-r7-action="poll-reset" style="padding:4px 10px;border:1px solid var(--border-subtle);color:var(--fg-tertiary);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;display:none;">Reset</span>' +
      '</div>' +
      '<div data-r7-poll-question="1" contenteditable="true" style="font-family:var(--font-serif);font-size:16px;font-style:italic;color:var(--fg-primary);line-height:1.4;outline:none;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border-subtle);">' +
        'Which hook lands first for you?' +
      '</div>' +
      [
        'I dropped to 95 feet and counted to eight.',
        'Eight breaths. Truk Lagoon. The Fujikawa.',
        'Eighty years on, the wreck still holds bombs.',
        'My hand on the gun mount. 50 feet of growth.',
      ].map((opt, i) => (
        '<div data-r7-poll-row="' + i + '" style="display:flex;gap:12px;align-items:center;padding:8px 0;position:relative;">' +
          '<span style="font-family:var(--font-mono);font-size:10px;font-weight:700;color:var(--fg-tertiary);min-width:18px;">' + String.fromCharCode(65 + i) + '</span>' +
          '<div data-r7-poll-opt="' + i + '" contenteditable="true" style="flex:1;font-family:var(--font-serif);font-size:13.5px;color:var(--fg-primary);line-height:1.4;outline:none;">' + opt + '</div>' +
          '<div data-r7-poll-bar="' + i + '" style="position:relative;width:120px;height:8px;background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:4px;overflow:hidden;display:none;">' +
            '<div data-r7-poll-fill="' + i + '" style="position:absolute;left:0;top:0;bottom:0;background:var(--accent-primary);width:0%;transition:width 240ms cubic-bezier(0.2,0.7,0.2,1);"></div>' +
          '</div>' +
          '<span data-r7-poll-pct="' + i + '" style="font-family:var(--font-mono);font-size:10px;font-weight:600;color:var(--fg-tertiary);min-width:32px;text-align:right;display:none;">—</span>' +
        '</div>'
      )).join('') +
      '<div style="margin-top:10px;font-family:var(--font-mono);font-size:9px;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);font-weight:600;">' +
        'Mock voting · scenes seeded by Coopr from your audience profile' +
      '</div>' +
    '</div>'
  );

  // ── Register builders + verbs ────────────────────────────────────
  const builders = {
    'caption-ab':       CAPTION_AB_HTML,
    'pull-quote':       PULL_QUOTE_HTML,
    'stat':             STAT_CALLOUT_HTML,
    'channels':         CHANNEL_PREVIEW_HTML,
    'series-pin':       SERIES_PIN_HTML,
    'poll':             POLL_HTML,
  };
  if (window.HF_DocsBlockBuilders) {
    Object.assign(window.HF_DocsBlockBuilders, builders);
  } else {
    window.HF_DocsBlockBuilders = builders;
  }

  function registerVerbs() {
    if (!window.HF_DocsSlashRegister) {
      requestAnimationFrame(registerVerbs);
      return;
    }
    const verbs = [
      { category: 'COOPR Components', icon: 'hook',     label: 'Caption A/B',       desc: 'Three caption variants · multi-platform char counter.', kind: 'embed-html', builderKey: 'caption-ab',  hint: '/cap' },
      { category: 'COOPR Components', icon: 'quote',    label: 'Pull-quote',        desc: 'Oversized editorial quote with attribution.',           kind: 'embed-html', builderKey: 'pull-quote',  hint: '/quote' },
      { category: 'COOPR Components', icon: 'callout',  label: 'Stat callout',      desc: 'Big number · label · delta with direction.',            kind: 'embed-html', builderKey: 'stat',        hint: '/stat' },
      { category: 'COOPR Components', icon: 'carousel', label: 'Channel preview',   desc: 'Same content as IG / TikTok / YT side-by-side.',        kind: 'embed-html', builderKey: 'channels',    hint: '/ch' },
      { category: 'COOPR Components', icon: 'library',  label: 'Series pin',        desc: 'Auto-pulls the 3 most recent docs in this series.',     kind: 'embed-html', builderKey: 'series-pin',  hint: '/series' },
      { category: 'COOPR Components', icon: 'check',    label: 'Comment poll',      desc: 'Four-option poll · mock voting before publish.',        kind: 'embed-html', builderKey: 'poll',        hint: '/poll' },
    ];
    verbs.forEach(v => window.HF_DocsSlashRegister(v));
  }
  registerVerbs();

  // ── Click delegation ────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.dataset || !t.dataset.r7Action) return;
    const action = t.dataset.r7Action;
    const embed = t.closest('[data-r7-embed-id]');
    const toaster = window.__DOCS_R6_PUSH_TOAST || ((m) => { try { console.log(m); } catch (_) {} });

    // Caption A/B
    if (action === 'cap-platform' && embed) {
      const pid = t.getAttribute('data-r7-cap-platform');
      const platform = PLATFORMS.find(p => p.id === pid);
      if (!platform) return;
      embed.setAttribute('data-r7-platform', pid);
      // Recolor tabs
      embed.querySelectorAll('[data-r7-cap-platform]').forEach(tab => {
        const isActive = tab.getAttribute('data-r7-cap-platform') === pid;
        tab.style.background = isActive ? 'var(--accent-soft)' : 'var(--surface-1)';
        tab.style.color = isActive ? 'var(--accent-primary)' : 'var(--fg-tertiary)';
      });
      // Recompute counts vs new limit
      embed.querySelectorAll('[data-r7-cap-row]').forEach((row, i) => {
        const text = row.querySelector('[data-r7-cap-text]');
        const count = row.querySelector('[data-r7-cap-count="' + i + '"]');
        if (text && count) {
          const len = (text.textContent || '').length;
          count.textContent = len + ' / ' + platform.limit;
          count.style.color = len > platform.limit ? 'var(--accent-error, #b34a3a)' : 'var(--fg-tertiary)';
        }
      });
      return;
    }
    if (action === 'cap-score' && embed) {
      const pills = embed.querySelectorAll('[data-r7-cap-score-pill]');
      pills.forEach(p => { p.textContent = '… /100'; });
      setTimeout(() => {
        const scores = [];
        pills.forEach((p, i) => {
          const score = 55 + Math.floor(Math.random() * 40);
          scores.push(score);
          p.textContent = score + ' /100';
        });
        const winner = scores.indexOf(Math.max(...scores));
        pills.forEach((p, i) => {
          p.style.color = i === winner ? 'var(--accent-primary)' : 'var(--fg-tertiary)';
          p.style.fontWeight = i === winner ? '700' : '600';
        });
        toaster('Captions scored · ' + ['A','B','C'][winner] + ' wins · ' + scores[winner] + ' pts');
      }, 950);
      return;
    }

    // Pull-quote
    if (action === 'pq-lift') { toaster('Lift from doc · phase-2 · select a paragraph and pull it'); return; }
    if (action === 'pq-style') {
      const styles = ['editorial', 'magazine', 'oversized', 'minimal'];
      const cur = (t.textContent || '').replace('Style: ', '').trim();
      const idx = styles.indexOf(cur);
      const next = styles[(idx + 1) % styles.length];
      t.textContent = 'Style: ' + next;
      // Apply different sizing per style
      const text = embed && embed.querySelector('[data-r7-pq-text]');
      if (text) {
        const sizes = { editorial: 26, magazine: 22, oversized: 36, minimal: 18 };
        text.style.fontSize = sizes[next] + 'px';
      }
      toaster('Pull-quote · ' + next);
      return;
    }

    // Stat callout
    if (action === 'stat-toggle-direction' && embed) {
      const cur = t.getAttribute('data-r7-stat-dir');
      const next = cur === 'up' ? 'down' : 'up';
      t.setAttribute('data-r7-stat-dir', next);
      const svg = t.querySelector('svg');
      if (svg) {
        svg.innerHTML = next === 'up'
          ? '<path d="M6 2 L10 7 L2 7 Z" fill="currentColor"/>'
          : '<path d="M6 10 L2 5 L10 5 Z" fill="currentColor"/>';
      }
      const delta = embed.querySelector('[data-r7-stat-delta]');
      const color = next === 'up' ? 'var(--accent-primary)' : 'var(--accent-error, #b34a3a)';
      t.style.color = color;
      if (delta) delta.style.color = color;
      // Toggle delta sign prefix
      if (delta) {
        const txt = (delta.textContent || '').replace(/^[+-]/, '');
        delta.textContent = (next === 'up' ? '+' : '-') + txt;
      }
      return;
    }

    // Channel preview
    if (action === 'ch-edit-title') { toaster('Edit title · phase-2 · per-platform overrides'); return; }
    if (action === 'ch-open') {
      const platform = t.getAttribute('data-r7-ch-platform');
      toaster('Open · ' + platform.toUpperCase() + ' preview · phase-2');
      return;
    }

    // Series pin
    if (action === 'series-open') {
      const docId = t.getAttribute('data-r7-series-doc-id');
      if (window.HF_DocsHomeOpenDoc && docId) {
        window.HF_DocsHomeOpenDoc(docId);
      } else {
        toaster('Open series doc · ' + docId);
      }
      return;
    }

    // Comment poll
    if (action === 'poll-open' && embed) {
      embed.setAttribute('data-r7-poll-state', 'voted');
      const bars = embed.querySelectorAll('[data-r7-poll-bar]');
      const fills = embed.querySelectorAll('[data-r7-poll-fill]');
      const pcts = embed.querySelectorAll('[data-r7-poll-pct]');
      const reset = embed.querySelector('[data-r7-action="poll-reset"]');
      const openBtn = embed.querySelector('[data-r7-action="poll-open"]');
      // Generate 4 random vote totals that sum to 100
      const raw = [Math.random(), Math.random(), Math.random(), Math.random()];
      const sum = raw.reduce((a, b) => a + b, 0);
      const pcts_arr = raw.map(r => Math.round((r / sum) * 100));
      // Adjust to actually sum to 100
      const diff = 100 - pcts_arr.reduce((a, b) => a + b, 0);
      pcts_arr[0] += diff;
      const winner = pcts_arr.indexOf(Math.max(...pcts_arr));
      bars.forEach((b, i) => { b.style.display = 'block'; });
      pcts.forEach((p, i) => {
        p.style.display = 'inline';
        p.textContent = pcts_arr[i] + '%';
        p.style.color = i === winner ? 'var(--accent-primary)' : 'var(--fg-tertiary)';
        p.style.fontWeight = i === winner ? '700' : '600';
      });
      // Animate bars
      requestAnimationFrame(() => {
        fills.forEach((f, i) => {
          f.style.width = pcts_arr[i] + '%';
          f.style.background = i === winner ? 'var(--accent-primary)' : 'color-mix(in srgb, var(--accent-primary) 35%, transparent)';
        });
      });
      if (openBtn) openBtn.style.display = 'none';
      if (reset) reset.style.display = 'inline-flex';
      toaster('Poll opened · ' + String.fromCharCode(65 + winner) + ' wins · ' + pcts_arr[winner] + '%');
      return;
    }
    if (action === 'poll-reset' && embed) {
      embed.setAttribute('data-r7-poll-state', 'composing');
      embed.querySelectorAll('[data-r7-poll-bar]').forEach(b => { b.style.display = 'none'; });
      embed.querySelectorAll('[data-r7-poll-pct]').forEach(p => { p.style.display = 'none'; });
      embed.querySelectorAll('[data-r7-poll-fill]').forEach(f => { f.style.width = '0%'; });
      const openBtn = embed.querySelector('[data-r7-action="poll-open"]');
      if (openBtn) openBtn.style.display = 'inline-flex';
      t.style.display = 'none';
      return;
    }
  }, true);

  // ── Caption A/B live char counter (input event delegation) ───────
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (!t || !t.dataset || !t.dataset.r7CapText) return;
    const row = t.closest('[data-r7-cap-row]');
    const embed = t.closest('[data-r7-embed-id]');
    if (!row || !embed) return;
    const i = parseInt(row.getAttribute('data-r7-cap-row'));
    const platform = PLATFORMS.find(p => p.id === (embed.getAttribute('data-r7-platform') || 'ig'));
    const count = row.querySelector('[data-r7-cap-count="' + i + '"]');
    if (count && platform) {
      const len = (t.textContent || '').length;
      count.textContent = len + ' / ' + platform.limit;
      count.style.color = len > platform.limit ? 'var(--accent-error, #b34a3a)' : 'var(--fg-tertiary)';
    }
  }, true);

  Object.assign(window, {
    HF_DocsR7Blocks: { builders, registerVerbs },
  });
})();
