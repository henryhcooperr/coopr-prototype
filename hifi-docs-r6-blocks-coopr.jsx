/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r6-blocks-coopr.jsx — Docs R6 ambient + and component blocks
   (Wave 3 / S5).

   Two responsibilities:
     1. AMBIENT `+` BUTTON — a far-left gutter affordance that tracks the
        caret line inside the R5 editable. Click → opens HF_DocsSlashOpen
        with x/y at the line's left edge.
     2. COOPR COMPONENT BLOCKS — six block types registered as new slash
        verbs and embed builders. Three wired Phase-1, three Phase-2
        placeholder (toast on action chip click):
          Phase-1 wired:
            · Hook scoring v2  (multi-variant A/B/C, run-test scoring anim)
            · Shot list        (table-shaped rows, optional cover image)
            · Library reference (live link to a doc by id from R5H_DOCS)
          Phase-2 placeholder (toast):
            · Clip Lab          (placeholder card · "open Clip Lab")
            · Script building   (placeholder card · "open script editor")
            · Competitor reference (placeholder card · "paste url")

   Public API (window):
     window.HF_DocsBlocks               // mounts the ambient + overlay
     window.HF_DocsBlockBuilders        // map of builderKey → (id) => htmlString
*/

(function () {
  'use strict';
  if (window.__DOCS_R6_BLOCKS_BOOTED__) return;
  window.__DOCS_R6_BLOCKS_BOOTED__ = true;

  // ── Block builders ──────────────────────────────────────────────
  const HOOK_V2_HTML = (id) => (
    '<div class="r6-embed r6-embed-hook-v2" data-r6-embed-id="' + id + '" data-r6-embed-type="hook-v2" contenteditable="false" ' +
    'style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">' +
      '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Hook test · A/B/C · COOPR-scored</span>' +
      '<span style="flex:1;"></span>' +
      '<span data-r6-action="hook-run" style="padding:4px 12px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Run test</span>' +
      '<span data-r6-hook-status="1" style="font-family:var(--font-mono);font-size:9.5px;color:var(--fg-tertiary);">3 variants · idle</span>' +
    '</div>' +
    ['A','B','C'].map((label, i) => (
      '<div data-r6-hook-row="' + i + '" style="display:flex;gap:14px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--border-subtle);">' +
        '<span style="font-family:var(--font-serif);font-size:14px;font-style:italic;color:var(--fg-secondary);min-width:14px;">' + label + '</span>' +
        '<div data-r6-hook-text="1" contenteditable="true" style="flex:1;font-family:var(--font-serif);font-size:14px;line-height:1.5;color:var(--fg-primary);outline:none;min-height:18px;" data-placeholder="Type variant ' + label + '…">' + (i === 0 ? 'I dropped to 95 feet and counted to eight before moving.' : '') + '</div>' +
        '<span data-r6-hook-score="1" style="font-family:var(--font-mono);font-size:10.5px;font-weight:600;letter-spacing:0.04em;color:var(--fg-tertiary);min-width:46px;text-align:right;">— /100</span>' +
      '</div>'
    )).join('') +
    '</div>'
  );

  const SHOT_LIST_HTML = (id) => (
    '<div class="r6-embed r6-embed-shotlist" data-r6-embed-id="' + id + '" data-r6-embed-type="shotlist" contenteditable="false" ' +
    'style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
      '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Shot list · 3 shots</span>' +
      '<span style="flex:1;"></span>' +
      '<span data-r6-action="shotlist-add" style="padding:3px 10px;border:1px solid var(--border-default);color:var(--fg-secondary);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">+ shot</span>' +
    '</div>' +
    [
      { n: '01', kind: 'wide', t: 'Approach', body: 'Wide approach to the wreck — silhouette only.' },
      { n: '02', kind: 'medium', t: 'Hand on hull', body: 'Medium · my gloved hand on the rivet line.' },
      { n: '03', kind: 'macro', t: 'Encrustation', body: 'Macro · 50 years of growth on the gun mount.' },
    ].map((s) => (
      '<div data-r6-shot-row="1" style="display:flex;gap:14px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--border-subtle);">' +
        '<span style="font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.04em;color:var(--fg-tertiary);min-width:24px;">' + s.n + '</span>' +
        '<span style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-primary);min-width:54px;">' + s.kind + '</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-family:var(--font-serif);font-size:14px;font-weight:500;color:var(--fg-primary);">' + s.t + '</div>' +
          '<div data-r6-shot-body="1" contenteditable="true" style="font-family:var(--font-serif);font-size:13px;color:var(--fg-secondary);line-height:1.45;outline:none;margin-top:2px;">' + s.body + '</div>' +
        '</div>' +
        '<span data-r6-action="shotlist-cover" style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);cursor:pointer;padding:2px 8px;border:1px dashed var(--border-default);border-radius:4px;">+ cover</span>' +
      '</div>'
    )).join('') +
    '</div>'
  );

  const LIBRARY_REF_HTML = (id) => {
    const docs = (window.R5H_DOCS || []).slice(0, 1);
    const ref = docs[0] || { id: 'truk-lagoon-ep-1', eyebrow: 'Truk Lagoon · ep. 1', title: 'The Fujikawa', italicTail: 'in eight breaths.', words: 1842, status: 'drafting', statusVersion: 'v3' };
    return (
      '<div class="r6-embed r6-embed-libref" data-r6-embed-id="' + id + '" data-r6-embed-type="library-ref" data-r6-ref-doc-id="' + ref.id + '" contenteditable="false" ' +
      'style="display:flex;gap:14px;align-items:center;margin:18px 0;padding:14px 16px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;cursor:pointer;">' +
      '<span style="width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);color:var(--accent-primary);border-radius:6px;font-family:var(--font-mono);font-size:11px;font-weight:700;">LB</span>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">' + (ref.eyebrow || 'Library reference') + '</div>' +
        '<div style="font-family:var(--font-serif);font-size:14px;color:var(--fg-primary);line-height:1.25;">' + (ref.title || '') + (ref.italicTail ? ' <span style="font-style:italic;color:var(--fg-tertiary);">' + ref.italicTail + '</span>' : '') + '</div>' +
      '</div>' +
      '<span data-r6-action="libref-open" style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-secondary);padding:4px 10px;border:1px solid var(--border-default);border-radius:999px;cursor:pointer;">Open</span>' +
      '</div>'
    );
  };

  // ── CLIP LAB · real inline preview ───────────────────────────────
  // 3 vertical clip thumbnails with COOPR hook scores + Use/Skip chips +
  // drop-zone footer. Run-analysis chip in header simulates re-scoring.
  const CLIP_LAB_HTML = (id) => {
    const grads = [
      'linear-gradient(180deg, #2a4a3a 0%, #4a6a4a 100%)',
      'linear-gradient(180deg, #4a3a2a 0%, #6a5a3a 100%)',
      'linear-gradient(180deg, #2a3a4a 0%, #3a4a5a 100%)',
    ];
    const labels = ['00:18', '00:42', '01:07'];
    const scores = [82, 64, 71];
    return (
      '<div class="r6-embed r6-embed-cliplab" data-r6-embed-id="' + id + '" data-r6-embed-type="cliplab" contenteditable="false" ' +
      'style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">' +
          '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Clip Lab · 3 auto-detected verticals</span>' +
          '<span style="flex:1;"></span>' +
          '<span data-r6-action="cliplab-run" style="padding:4px 12px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Re-score</span>' +
          '<span data-r6-cliplab-status="1" style="font-family:var(--font-mono);font-size:9.5px;color:var(--fg-tertiary);">scored 14m ago</span>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;">' +
        [0,1,2].map(i => (
          '<div data-r6-cliplab-clip="' + i + '" style="position:relative;border-radius:6px;overflow:hidden;background:var(--surface-1);">' +
            '<div style="aspect-ratio:9/16;background:' + grads[i] + ';position:relative;">' +
              '<div style="position:absolute;top:6px;right:6px;padding:2px 7px;background:rgba(26,24,21,0.55);color:var(--fg-on-ink);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;">' + labels[i] + '</div>' +
              '<div data-r6-cliplab-score="' + i + '" style="position:absolute;bottom:6px;left:6px;padding:2px 7px;background:rgba(26,24,21,0.55);color:var(--fg-on-ink);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;">hook ' + scores[i] + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:4px;padding:6px 6px 4px;">' +
              '<span data-r6-action="cliplab-use" data-r6-cliplab-clip-ref="' + i + '" style="flex:1;padding:3px 0;text-align:center;background:var(--accent-soft);color:var(--accent-primary);border-radius:5px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Use</span>' +
              '<span data-r6-action="cliplab-skip" data-r6-cliplab-clip-ref="' + i + '" style="flex:1;padding:3px 0;text-align:center;background:var(--surface-1);color:var(--fg-tertiary);border-radius:5px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Skip</span>' +
            '</div>' +
          '</div>'
        )).join('') +
        '</div>' +
        '<div style="margin-top:12px;padding:10px 12px;border:1px dashed var(--border-default);border-radius:6px;display:flex;align-items:center;gap:10px;">' +
          '<span style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Drop a clip here</span>' +
          '<span style="flex:1;"></span>' +
          '<span data-r6-action="cliplab-upload" style="padding:3px 10px;border:1px solid var(--border-default);color:var(--fg-secondary);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Upload</span>' +
        '</div>' +
      '</div>'
    );
  };

  // ── SCRIPT WRITER · beat-by-beat with auto-summed duration ──────
  const SCRIPT_HTML = (id) => {
    const beats = [
      { kind: 'COLD OPEN', label: 'Hook · "I dropped to ninety-five feet"', dur: '00:08' },
      { kind: 'SETUP',     label: 'Why eight breaths matters · context', dur: '00:42' },
      { kind: 'BODY',      label: 'Approach · pause · turtle · payoff',  dur: '06:30' },
      { kind: 'PAYOFF',    label: 'Eight breaths land twice · close',     dur: '01:20' },
    ];
    function dur(s) { return s; }
    function sumDur(bs) {
      let total = 0;
      bs.forEach(b => {
        const m = (b.dur || '00:00').match(/(\d+):(\d+)/);
        if (m) total += parseInt(m[1]) * 60 + parseInt(m[2]);
      });
      const min = Math.floor(total / 60);
      const sec = total % 60;
      return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
    }
    return (
      '<div class="r6-embed r6-embed-script" data-r6-embed-id="' + id + '" data-r6-embed-type="script" contenteditable="false" ' +
      'style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
          '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Script · ' + beats.length + ' beats · target 11:00</span>' +
          '<span style="flex:1;"></span>' +
          '<span data-r6-script-total="1" style="padding:3px 10px;background:var(--accent-soft);color:var(--accent-primary);border-radius:999px;font-family:var(--font-mono);font-size:10.5px;font-weight:700;letter-spacing:0.04em;">' + sumDur(beats) + ' total</span>' +
          '<span data-r6-action="script-add" style="padding:3px 10px;border:1px solid var(--border-default);color:var(--fg-secondary);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">+ beat</span>' +
        '</div>' +
        beats.map((b, i) => (
          '<div data-r6-script-row="' + i + '" style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-top:1px solid var(--border-subtle);">' +
            '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.04em;color:var(--fg-tertiary);min-width:24px;padding-top:2px;">' + (i + 1).toString().padStart(2, '0') + '</span>' +
            '<span data-r6-script-kind="1" contenteditable="true" style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-primary);min-width:78px;padding-top:3px;outline:none;">' + b.kind + '</span>' +
            '<span data-r6-script-label="1" contenteditable="true" style="flex:1;font-family:var(--font-serif);font-size:14px;color:var(--fg-primary);line-height:1.4;outline:none;min-height:18px;">' + b.label + '</span>' +
            '<span data-r6-script-dur="1" contenteditable="true" style="font-family:var(--font-mono);font-size:11px;font-weight:600;color:var(--fg-secondary);min-width:50px;text-align:right;outline:none;border:1px solid transparent;padding:1px 4px;border-radius:4px;" title="mm:ss">' + dur(b.dur) + '</span>' +
            '<span data-r6-action="script-delete" data-r6-script-row-ref="' + i + '" style="cursor:pointer;color:var(--fg-tertiary);font-family:var(--font-mono);font-size:11px;padding:0 4px;">×</span>' +
          '</div>'
        )).join('') +
      '</div>'
    );
  };

  // ── COMPETITOR REFERENCE · paste URL → mock fetch → metrics card ─
  const COMPETITOR_HTML = (id) => (
    '<div class="r6-embed r6-embed-competitor" data-r6-embed-id="' + id + '" data-r6-embed-type="competitor" data-r6-comp-state="empty" contenteditable="false" ' +
    'style="display:block;margin:20px 0;padding:16px 18px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
      // Empty state — input field
      '<div data-r6-comp-empty="1" style="display:flex;gap:10px;align-items:center;">' +
        '<span style="width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;background:var(--surface-1);border:1px solid var(--border-subtle);color:var(--fg-secondary);border-radius:6px;font-family:var(--font-mono);font-size:10px;font-weight:700;">CR</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);margin-bottom:4px;">Competitor reference</div>' +
          '<input data-r6-comp-input="1" placeholder="Paste a TikTok or Reels URL…" style="width:100%;padding:6px 0;border:none;background:transparent;font-family:var(--font-serif);font-size:13.5px;color:var(--fg-primary);outline:none;border-bottom:1px solid var(--border-subtle);"/>' +
        '</div>' +
        '<span data-r6-action="comp-fetch" style="padding:4px 12px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Fetch</span>' +
      '</div>' +
      // Loaded state — hidden until fetched
      '<div data-r6-comp-loaded="1" style="display:none;">' +
        '<div style="display:flex;gap:14px;align-items:flex-start;">' +
          '<div data-r6-comp-thumb="1" style="width:84px;aspect-ratio:9/16;background:linear-gradient(180deg, #4a3a5a 0%, #6a4a5a 100%);border-radius:6px;flex-shrink:0;"></div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">' +
              '<span data-r6-comp-handle="1" style="font-family:var(--font-mono);font-size:10px;font-weight:600;color:var(--fg-secondary);">@diveinstructor.kai</span>' +
              '<span style="font-family:var(--font-mono);font-size:9px;color:var(--fg-tertiary);">·</span>' +
              '<span style="font-family:var(--font-mono);font-size:9px;color:var(--fg-tertiary);">2d ago</span>' +
            '</div>' +
            '<div data-r6-comp-title="1" style="font-family:var(--font-serif);font-size:14px;color:var(--fg-primary);line-height:1.4;margin-bottom:10px;">Five things every new diver gets wrong about wreck dives.</div>' +
            '<div style="display:flex;gap:18px;flex-wrap:wrap;">' +
              '<div><div style="font-family:var(--font-mono);font-size:8.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Views</div><div style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--fg-primary);">2.4M</div></div>' +
              '<div><div style="font-family:var(--font-mono);font-size:8.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Saves</div><div style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--fg-primary);">187k</div></div>' +
              '<div><div style="font-family:var(--font-mono);font-size:8.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Watch-time</div><div style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--fg-primary);">71%</div></div>' +
              '<div><div style="font-family:var(--font-mono);font-size:8.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-primary);">Δ vs you</div><div style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--accent-primary);">+340% saves</div></div>' +
            '</div>' +
            '<div style="margin-top:10px;font-family:var(--font-serif);font-size:12.5px;font-style:italic;color:var(--fg-secondary);line-height:1.45;">Hook lands in the first 1.2s · five-item structure · zero setup before the first wrong-thing reveal.</div>' +
          '</div>' +
          '<span data-r6-action="comp-clear" style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);padding:3px 8px;cursor:pointer;">Clear</span>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  window.HF_DocsBlockBuilders = {
    'hook-v2':       HOOK_V2_HTML,
    'shotlist':      SHOT_LIST_HTML,
    'library-ref':   LIBRARY_REF_HTML,
    'cliplab':       CLIP_LAB_HTML,
    'script':        SCRIPT_HTML,
    'competitor':    COMPETITOR_HTML,
  };

  // ── Register slash verbs ────────────────────────────────────────
  function registerVerbs() {
    if (!window.HF_DocsSlashRegister) {
      // Slash module not booted yet — retry next tick
      requestAnimationFrame(registerVerbs);
      return;
    }
    const verbs = [
      { category: 'COOPR Components', icon: 'hook',      label: 'Hook scoring',       desc: 'Multi-variant A/B/C with COOPR scoring.', kind: 'embed-html', builderKey: 'hook-v2',    hint: '/hook' },
      { category: 'COOPR Components', icon: 'shotlist',  label: 'Shot list',          desc: 'Numbered shots with kind, body, cover.',  kind: 'embed-html', builderKey: 'shotlist',   hint: '/shots' },
      { category: 'COOPR Components', icon: 'library',   label: 'Library reference',  desc: 'Live link to one of your existing docs.', kind: 'embed-html', builderKey: 'library-ref',hint: '/lib' },
      { category: 'COOPR Components', icon: 'clip',      label: 'Clip Lab',           desc: 'Drop a clip · COOPR finds vertical cuts.',kind: 'embed-html', builderKey: 'cliplab',    hint: '/clip' },
      { category: 'COOPR Components', icon: 'script',    label: 'Script building',    desc: 'Beat-by-beat script with timing.',        kind: 'embed-html', builderKey: 'script',     hint: '/script' },
      { category: 'COOPR Components', icon: 'competitor',label: 'Competitor reference',desc: 'Paste TikTok or Reels URL.',             kind: 'embed-html', builderKey: 'competitor', hint: '/comp' },
    ];
    verbs.forEach(v => window.HF_DocsSlashRegister(v));
  }
  registerVerbs();

  // ── Click delegation for r6-embed action chips ──────────────────
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.dataset || !t.dataset.r6Action) return;
    const action = t.dataset.r6Action;
    const embed = t.closest('[data-r6-embed-id]');
    const toaster = window.__DOCS_R6_PUSH_TOAST || ((m) => { try { console.log(m); } catch (_) {} });

    if (action === 'hook-run' && embed) {
      const status = embed.querySelector('[data-r6-hook-status]');
      const scores = embed.querySelectorAll('[data-r6-hook-score]');
      if (status) status.textContent = '3 variants · running…';
      scores.forEach(s => { s.textContent = '… /100'; s.style.color = 'var(--fg-tertiary)'; });
      setTimeout(() => {
        const arr = [];
        scores.forEach((s, i) => {
          const score = 60 + Math.floor(Math.random() * 30);
          arr.push({ i, score });
          s.textContent = score + ' /100';
        });
        const winner = arr.reduce((a, b) => (a.score >= b.score ? a : b), arr[0]);
        scores.forEach((s, i) => {
          s.style.color = i === winner.i ? 'var(--accent-primary)' : 'var(--fg-tertiary)';
          s.style.fontWeight = i === winner.i ? '700' : '500';
        });
        const wlabel = ['A','B','C'][winner.i];
        if (status) status.textContent = '3 variants · ' + wlabel + ' wins · ' + winner.score + ' pts';
      }, 900);
      return;
    }
    if (action === 'shotlist-add' && embed) {
      toaster('Shot row added · phase-2');
      return;
    }
    if (action === 'shotlist-cover') {
      toaster('Cover image · phase-2 · drag from media drawer');
      return;
    }
    if (action === 'libref-open' && embed) {
      const docId = embed.getAttribute('data-r6-ref-doc-id');
      toaster('Open library doc · ' + (docId || 'unknown'));
      // If S1 home is loaded, hand off via window.HF_DocsHomeOpenDoc
      if (window.HF_DocsHomeOpenDoc) {
        window.HF_DocsHomeOpenDoc(docId);
      }
      return;
    }
    // ── Clip Lab actions ──
    if (action === 'cliplab-run' && embed) {
      const status = embed.querySelector('[data-r6-cliplab-status]');
      const scoreEls = embed.querySelectorAll('[data-r6-cliplab-score]');
      if (status) status.textContent = 'scoring…';
      scoreEls.forEach(s => { s.textContent = 'hook —'; });
      setTimeout(() => {
        scoreEls.forEach((s, i) => {
          const score = 60 + Math.floor(Math.random() * 30);
          s.textContent = 'hook ' + score;
        });
        if (status) status.textContent = 'scored just now';
      }, 1100);
      return;
    }
    if (action === 'cliplab-use') {
      const ref = t.getAttribute('data-r6-cliplab-clip-ref');
      t.style.background = 'var(--accent-primary)';
      t.style.color = 'var(--fg-on-accent)';
      t.textContent = 'queued';
      toaster('Clip ' + (parseInt(ref) + 1) + ' queued for export');
      return;
    }
    if (action === 'cliplab-skip') {
      const ref = t.getAttribute('data-r6-cliplab-clip-ref');
      const sibling = t.parentElement && t.parentElement.querySelector('[data-r6-action="cliplab-use"]');
      if (sibling) {
        sibling.style.opacity = '0.4';
        sibling.style.pointerEvents = 'none';
      }
      t.style.opacity = '0.4';
      toaster('Clip ' + (parseInt(ref) + 1) + ' skipped');
      return;
    }
    if (action === 'cliplab-upload') {
      toaster('Upload flow · phase-2');
      return;
    }

    // ── Script writer actions ──
    function recalcScriptTotal(scriptEmbed) {
      if (!scriptEmbed) return;
      const rows = scriptEmbed.querySelectorAll('[data-r6-script-dur]');
      let total = 0;
      rows.forEach(r => {
        const m = (r.textContent || '').match(/(\d+):(\d+)/);
        if (m) total += parseInt(m[1]) * 60 + parseInt(m[2]);
      });
      const min = Math.floor(total / 60);
      const sec = total % 60;
      const totalEl = scriptEmbed.querySelector('[data-r6-script-total]');
      if (totalEl) totalEl.textContent = ((min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec) + ' total';
    }
    if (action === 'script-add' && embed) {
      const last = embed.querySelector('[data-r6-script-row]:last-of-type');
      const idx = embed.querySelectorAll('[data-r6-script-row]').length;
      const row = document.createElement('div');
      row.setAttribute('data-r6-script-row', String(idx));
      row.style.cssText = 'display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-top:1px solid var(--border-subtle);';
      row.innerHTML =
        '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.04em;color:var(--fg-tertiary);min-width:24px;padding-top:2px;">' + (idx + 1).toString().padStart(2, '0') + '</span>' +
        '<span data-r6-script-kind="1" contenteditable="true" style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-primary);min-width:78px;padding-top:3px;outline:none;">BEAT</span>' +
        '<span data-r6-script-label="1" contenteditable="true" style="flex:1;font-family:var(--font-serif);font-size:14px;color:var(--fg-primary);line-height:1.4;outline:none;min-height:18px;" data-placeholder="Type the beat…">New beat</span>' +
        '<span data-r6-script-dur="1" contenteditable="true" style="font-family:var(--font-mono);font-size:11px;font-weight:600;color:var(--fg-secondary);min-width:50px;text-align:right;outline:none;border:1px solid transparent;padding:1px 4px;border-radius:4px;" title="mm:ss">00:30</span>' +
        '<span data-r6-action="script-delete" data-r6-script-row-ref="' + idx + '" style="cursor:pointer;color:var(--fg-tertiary);font-family:var(--font-mono);font-size:11px;padding:0 4px;">×</span>';
      if (last && last.parentNode) {
        last.parentNode.appendChild(row);
      } else {
        embed.appendChild(row);
      }
      recalcScriptTotal(embed);
      return;
    }
    if (action === 'script-delete') {
      const row = t.closest('[data-r6-script-row]');
      const scriptEmbed = t.closest('[data-r6-embed-id]');
      if (row && row.parentNode) row.parentNode.removeChild(row);
      recalcScriptTotal(scriptEmbed);
      return;
    }

    // ── Competitor reference actions ──
    if (action === 'comp-fetch' && embed) {
      const input = embed.querySelector('[data-r6-comp-input]');
      const url = input && input.value.trim();
      if (!url) { toaster('Paste a URL first'); return; }
      // Show fetching state
      const empty = embed.querySelector('[data-r6-comp-empty]');
      const loaded = embed.querySelector('[data-r6-comp-loaded]');
      if (empty) empty.style.display = 'none';
      // Inline a compact "fetching" pill while we simulate
      embed.setAttribute('data-r6-comp-state', 'loading');
      const loader = document.createElement('div');
      loader.setAttribute('data-r6-comp-loading', '1');
      loader.style.cssText = 'padding:18px 0;text-align:center;font-family:var(--font-mono);font-size:11px;color:var(--fg-tertiary);';
      loader.textContent = 'fetching · ' + url.slice(0, 50) + (url.length > 50 ? '…' : '');
      empty && empty.parentNode && empty.parentNode.insertBefore(loader, empty.nextSibling);
      setTimeout(() => {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        if (loaded) loaded.style.display = 'block';
        embed.setAttribute('data-r6-comp-state', 'loaded');
        // Pick a random delta to feel mocked-fresh
        const deltas = ['+340% saves', '+128% watch-time', '+72% comments', '+420% shares'];
        const deltaEl = embed.querySelector('[data-r6-comp-loaded] div div div:nth-child(4) div:nth-child(2)');
        // Skip rewriting; the static delta reads fine.
      }, 850);
      return;
    }
    if (action === 'comp-clear' && embed) {
      const empty = embed.querySelector('[data-r6-comp-empty]');
      const loaded = embed.querySelector('[data-r6-comp-loaded]');
      if (empty) empty.style.display = 'flex';
      if (loaded) loaded.style.display = 'none';
      const input = embed.querySelector('[data-r6-comp-input]');
      if (input) input.value = '';
      embed.setAttribute('data-r6-comp-state', 'empty');
      return;
    }
  }, true);

  // ── Ambient + button overlay ─────────────────────────────────────
  const CSS = `
    .docs-r6-line-plus {
      position: fixed;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.32;
      pointer-events: auto;
      z-index: 6;
      color: var(--fg-tertiary);
      transition: opacity 120ms ease-out, transform 120ms ease-out, color 120ms ease-out;
      border-radius: 6px;
    }
    .docs-r6-line-plus:hover {
      opacity: 1;
      color: var(--accent-primary);
      background: var(--accent-soft);
    }
    .docs-r6-line-plus.is-hidden {
      opacity: 0;
      pointer-events: none;
    }
    @keyframes docs-r6-tip-in {
      0%   { opacity: 0; transform: translateX(-6px); }
      100% { opacity: 1; transform: translateX(0); }
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r6-blocks-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r6-blocks-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  function findEditable() {
    return document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
  }

  function getCaretLineRect() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    if (!range.collapsed) return null;
    let rect = range.getBoundingClientRect();
    if (!rect || (rect.top === 0 && rect.bottom === 0)) {
      // Fallback: get nearest block element rect
      let node = range.startContainer;
      if (node.nodeType === 3) node = node.parentElement;
      if (!node || !node.getBoundingClientRect) return null;
      rect = node.getBoundingClientRect();
    }
    return rect;
  }

  // Discoverability tooltip — first time the user focuses the editor with no
  // localStorage flag, surface a tooltip pointing at the +. Auto-dismiss on
  // first + click or after 8s.
  const ONBOARDED_KEY = 'docs-r6-onboarded-plus';
  function shouldShowTooltip() {
    try { return !window.localStorage.getItem(ONBOARDED_KEY); } catch (e) { return false; }
  }
  function markOnboarded() {
    try { window.localStorage.setItem(ONBOARDED_KEY, '1'); } catch (e) {}
  }

  function HF_DocsR6LinePlus() {
    const [pos, setPos] = React.useState({ x: -100, y: -100, hidden: true });
    const [tipVisible, setTipVisible] = React.useState(false);
    const tipDismissTimer = React.useRef(null);

    React.useEffect(() => {
      let ticking = false;
      function update() {
        ticking = false;
        const editable = findEditable();
        if (!editable) { setPos(p => ({ ...p, hidden: true })); return; }
        const rect = getCaretLineRect();
        if (!rect) { setPos(p => ({ ...p, hidden: true })); return; }
        const editableRect = editable.getBoundingClientRect();
        const x = editableRect.left - 36; // 36px left of editable's left edge
        const y = rect.top + (rect.height / 2) - 12;
        if (x < 4 || y < 70) { setPos(p => ({ ...p, hidden: true })); return; }
        setPos({ x, y, hidden: false });
      }
      function schedule() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      }
      document.addEventListener('selectionchange', schedule, true);
      document.addEventListener('keyup', schedule, true);
      document.addEventListener('mouseup', schedule, true);
      window.addEventListener('scroll', schedule, true);
      window.addEventListener('resize', schedule);
      schedule();
      return () => {
        document.removeEventListener('selectionchange', schedule, true);
        document.removeEventListener('keyup', schedule, true);
        document.removeEventListener('mouseup', schedule, true);
        window.removeEventListener('scroll', schedule, true);
        window.removeEventListener('resize', schedule);
      };
    }, []);

    function onClick(e) {
      e.preventDefault();
      e.stopPropagation();
      // Onboard the user the first time they actually click +.
      setTipVisible(false);
      markOnboarded();
      if (window.HF_DocsSlashOpen) {
        const editable = findEditable();
        if (editable) editable.focus();
        window.HF_DocsSlashOpen(pos.x + 24, pos.y + 24, { source: 'ambient-plus' });
      }
    }

    // Listen for first focus → show tooltip if not yet onboarded.
    React.useEffect(() => {
      function maybeShow() {
        if (!shouldShowTooltip()) return;
        const ed = findEditable();
        if (!ed) return;
        // Wait for the + to position itself.
        setTimeout(() => {
          if (!shouldShowTooltip()) return;
          setTipVisible(true);
          if (tipDismissTimer.current) clearTimeout(tipDismissTimer.current);
          tipDismissTimer.current = setTimeout(() => {
            setTipVisible(false);
            markOnboarded();
          }, 8000);
        }, 350);
      }
      function onFocusIn(e) {
        const t = e.target;
        if (t && t.closest && t.closest('[data-shell-view="doc"] [contenteditable="true"]')) {
          maybeShow();
        }
      }
      document.addEventListener('focusin', onFocusIn, true);
      return () => {
        document.removeEventListener('focusin', onFocusIn, true);
        if (tipDismissTimer.current) clearTimeout(tipDismissTimer.current);
      };
    }, []);

    return (
      <React.Fragment>
        <div
          className={'docs-r6-line-plus' + (pos.hidden ? ' is-hidden' : '')}
          style={{ left: pos.x, top: pos.y }}
          title="Insert block"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClick}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
        {tipVisible && !pos.hidden && (
          <div style={{
            position: 'fixed',
            left: pos.x + 32,
            top: pos.y - 8,
            background: 'var(--surface-ink)',
            color: 'var(--fg-on-ink)',
            padding: '8px 12px 10px',
            borderRadius: 7,
            boxShadow: '0 12px 28px -12px rgba(26,24,21,0.30)',
            zIndex: 13,
            maxWidth: 220,
            pointerEvents: 'auto',
            opacity: 0,
            animation: 'docs-r6-tip-in 220ms cubic-bezier(0.2,0.7,0.2,1) forwards',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--accent-primary)', marginBottom: 3,
            }}>Insert blocks</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, lineHeight: 1.4 }}>
              Click <span style={{ fontFamily: 'var(--font-mono)', background: 'rgba(253,252,249,0.10)', padding: '0 5px', borderRadius: 4 }}>+</span> on any line to add a hook test, shot list, clip, or more.
            </div>
            <span
              onClick={(e) => { e.stopPropagation(); setTipVisible(false); markOnboarded(); }}
              style={{
                position: 'absolute', top: 4, right: 6,
                cursor: 'pointer', color: 'var(--fg-tertiary)',
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '0 4px',
              }}>×</span>
            {/* Tail pointing left toward the + */}
            <div style={{
              position: 'absolute', left: -5, top: 12,
              width: 10, height: 10,
              background: 'var(--surface-ink)',
              transform: 'rotate(45deg)',
            }} />
          </div>
        )}
      </React.Fragment>
    );
  }

  // ── Mount ────────────────────────────────────────────────────────
  function mount() {
    if (!document.body) { requestAnimationFrame(mount); return; }
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
      requestAnimationFrame(mount); return;
    }
    injectCSS();
    let host = document.getElementById('docs-r6-blocks-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'docs-r6-blocks-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(<HF_DocsR6LinePlus />);
  }
  mount();

  Object.assign(window, {
    HF_DocsBlocks: { mount, HOOK_V2_HTML, SHOT_LIST_HTML, LIBRARY_REF_HTML, CLIP_LAB_HTML, SCRIPT_HTML, COMPETITOR_HTML },
  });
})();
