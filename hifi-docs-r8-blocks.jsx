/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r8-blocks.jsx — Docs R8 component blocks (Wave 4 / V1).

   New verbs:
     · /scripted-hook  — bridges Hook scoring v2 to the script writer.
                         Reads winning variant from any r6-embed-hook-v2 in
                         this doc, locks it as Beat 01 of the script. Beat
                         edits write back to the hook block (bidirectional).
     · /transcript     — paste raw transcript, auto-mark 9:16 candidates by
                         sentence weight + reading time. Stub for R8 — UI
                         renders, scoring is heuristic-fake.

   Loads AFTER hifi-docs-r7-blocks.jsx so we can extend HF_DocsBlockBuilders.
*/

(function () {
  'use strict';
  if (window.__DOCS_R8_BLOCKS_BOOTED__) return;
  window.__DOCS_R8_BLOCKS_BOOTED__ = true;

  // ── 1. Helpers · winning hook lookup ───────────────────────────────
  // Walks the active editable for a hook-v2 embed and returns the highest-
  // scored variant text. Falls back to first non-empty variant text.
  function findWinningHook(scopeEl) {
    const hookEl = (scopeEl || document)
      .querySelector('.r6-embed-hook-v2[data-r6-embed-type="hook-v2"]');
    if (!hookEl) return null;
    const rows = hookEl.querySelectorAll('[data-r6-hook-row]');
    let best = { text: '', score: -1, idx: -1, embedId: hookEl.getAttribute('data-r6-embed-id') };
    rows.forEach((row, i) => {
      const txtEl = row.querySelector('[data-r6-hook-text]');
      const scoreEl = row.querySelector('[data-r6-hook-score]');
      const text = txtEl ? (txtEl.textContent || '').trim() : '';
      if (!text) return;
      let score = 0;
      if (scoreEl) {
        const m = (scoreEl.textContent || '').match(/(\d+)/);
        score = m ? parseInt(m[1], 10) : 0;
      }
      if (score > best.score || (best.score < 0 && best.idx < 0)) {
        best = { text, score, idx: i, embedId: hookEl.getAttribute('data-r6-embed-id') };
      }
    });
    if (!best.text) return null;
    return best;
  }

  // Write a beat's text back to the corresponding hook variant text.
  function writeBackToHook(embedId, idx, newText) {
    if (!embedId || idx == null) return;
    const ed = document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
    if (!ed) return;
    const hookEl = ed.querySelector('.r6-embed-hook-v2[data-r6-embed-id="' + embedId + '"]');
    if (!hookEl) return;
    const row = hookEl.querySelector('[data-r6-hook-row="' + idx + '"]');
    if (!row) return;
    const txtEl = row.querySelector('[data-r6-hook-text]');
    if (txtEl && txtEl.textContent !== newText) {
      txtEl.textContent = newText;
    }
  }

  // ── 2. /scripted-hook builder ──────────────────────────────────────
  function SCRIPTED_HOOK_HTML(id) {
    const ed = document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
    const won = findWinningHook(ed);
    const lockText = (won && won.text) || 'Add a Hook scoring block above, then re-insert this script.';
    const lockedTo = won ? ('locked · hook ' + ['A','B','C'][won.idx] + ' · ' + (won.score >= 0 ? won.score : '—') + '/100') : 'no hook block above · unlinked';
    const embedId = (won && won.embedId) || '';
    const variantIdx = won ? won.idx : -1;
    return (
      '<div class="r8-embed r8-embed-scripted-hook" data-r8-embed-id="' + id + '" data-r8-embed-type="scripted-hook" ' +
      'data-r8-link-embed-id="' + embedId + '" data-r8-link-variant="' + variantIdx + '" contenteditable="false" ' +
      'style="display:block;margin:22px 0;padding:0;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-1);user-select:none;overflow:hidden;">' +
        // Header
        '<div style="display:flex;align-items:center;gap:10px;padding:14px 18px;background:var(--surface-2);border-bottom:1px solid var(--border-subtle);">' +
          '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Scripted hook · bridge</span>' +
          '<span style="flex:1;"></span>' +
          '<span data-r8-link-status="1" style="font-family:var(--font-mono);font-size:9.5px;color:' + (won ? 'var(--accent-primary)' : 'var(--tone-warning, #a07346)') + ';">' + lockedTo + '</span>' +
          '<span data-r8-action="rescore" title="Re-read the hook block above and update the locked beat" style="padding:4px 10px;border:1px solid var(--border-default);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-secondary);cursor:pointer;background:var(--surface-1);">Re-link</span>' +
        '</div>' +
        // Beat 01 — locked from the winning hook
        '<div style="display:flex;gap:14px;align-items:flex-start;padding:14px 18px;border-bottom:1px solid var(--border-subtle);background:' + (won ? 'var(--accent-soft)' : 'transparent') + ';">' +
          '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;min-width:38px;">' +
            '<span style="font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.04em;color:var(--accent-primary);">01</span>' +
            '<span style="font-family:var(--font-mono);font-size:8.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--accent-primary);">' + (won ? '0:00' : '—') + '</span>' +
          '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
              '<span style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-primary);">Hook · locked</span>' +
              (won ? '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" style="color:var(--accent-primary);"><rect x="3" y="5.5" width="6" height="4.5" rx="0.5"/><path d="M4 5.5 V4 a2 2 0 0 1 4 0 V5.5"/></svg>' : '') +
            '</div>' +
            '<div data-r8-beat-locked="1" data-r8-beat-idx="0" contenteditable="true" ' +
              'style="font-family:var(--font-serif);font-size:15px;line-height:1.55;color:var(--fg-primary);outline:none;min-height:20px;" ' +
              'data-placeholder="No winning hook yet — type or score variants above.">' + escapeHTML(lockText) + '</div>' +
            '<div style="margin-top:6px;font-family:var(--font-mono);font-size:9px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--fg-tertiary);">' +
              (won ? 'Edits sync ↔ hook block above' : 'Add /hook above to lock this beat') +
            '</div>' +
          '</div>' +
        '</div>' +
        // Beats 02-04 — script body
        ['Setup', 'Payoff', 'CTA'].map((label, i) => (
          '<div style="display:flex;gap:14px;align-items:flex-start;padding:12px 18px;border-bottom:1px solid var(--border-subtle);">' +
            '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;min-width:38px;">' +
              '<span style="font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.04em;color:var(--fg-tertiary);">' + ('0' + (i + 2)) + '</span>' +
              '<span data-r8-beat-duration="' + (i + 1) + '" style="font-family:var(--font-mono);font-size:8.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--fg-tertiary);" data-r8-dur-sec="' + [12, 28, 8][i] + '">' + ['0:12','0:28','0:08'][i] + '</span>' +
            '</div>' +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);margin-bottom:4px;">' + label + '</div>' +
              '<div data-r8-beat-body="1" contenteditable="true" style="font-family:var(--font-serif);font-size:14px;line-height:1.5;color:var(--fg-primary);outline:none;min-height:18px;" data-placeholder="Type the ' + label.toLowerCase() + ' beat…">' +
                ['What I came for · what I had to learn first · why eight breaths.', 'Three close-ups of the gun mount. The wreck teaching me how to film it.', 'Watching for episode two? Drop a depth in the comments.'][i] +
              '</div>' +
            '</div>' +
          '</div>'
        )).join('') +
        // Footer
        '<div style="display:flex;align-items:center;gap:10px;padding:12px 18px;background:var(--surface-2);">' +
          '<span style="font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Total · </span>' +
          '<span data-r8-script-total="1" style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--fg-primary);">0:48</span>' +
          '<span style="flex:1;"></span>' +
          '<span data-r8-action="add-beat" style="padding:3px 10px;border:1px solid var(--border-default);color:var(--fg-secondary);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">+ beat</span>' +
        '</div>' +
      '</div>'
    );
  }

  // ── 3. /transcript builder (stub) ──────────────────────────────────
  function TRANSCRIPT_HTML(id) {
    return (
      '<div class="r8-embed r8-embed-transcript" data-r8-embed-id="' + id + '" data-r8-embed-type="transcript" contenteditable="false" ' +
      'style="display:block;margin:22px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
          '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--fg-tertiary);">Transcript → 9:16 candidates</span>' +
          '<span style="flex:1;"></span>' +
          '<span data-r8-action="t-rescore" style="padding:4px 10px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;">Score</span>' +
        '</div>' +
        '<div data-r8-t-paste="1" contenteditable="true" placeholder="Paste raw transcript…" ' +
          'style="font-family:var(--font-mono);font-size:11.5px;line-height:1.55;color:var(--fg-secondary);background:var(--surface-1);border:1px dashed var(--border-default);border-radius:5px;padding:12px 14px;outline:none;min-height:80px;" ' +
          'data-placeholder="Paste raw transcript here · we mark candidates by sentence weight + reading time.">Truk Lagoon doesn\'t care that you\'re here. The wreck of the Fujikawa Maru sits at ninety-five feet. The only way to read its language is to count your breaths. I went down to film an opening shot. I came back with eight breaths and three close-ups of the gun mount.</div>' +
        '<div data-r8-t-results="1" style="margin-top:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' +
          [0,1,2].map(i => (
            '<div style="border:1px solid var(--border-subtle);border-radius:5px;background:var(--surface-1);padding:10px 12px;">' +
              '<div style="font-family:var(--font-mono);font-size:8.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:' + ['var(--accent-primary)','var(--fg-tertiary)','var(--fg-tertiary)'][i] + ';margin-bottom:4px;">Candidate ' + (i+1) + ' · ' + [82,64,71][i] + '/100</div>' +
              '<div style="font-family:var(--font-serif);font-size:12px;line-height:1.4;color:var(--fg-primary);">' + ['Truk Lagoon doesn\'t care that you\'re here.','I went down to film an opening shot.','Eight breaths and three close-ups.'][i] + '</div>' +
              '<div style="font-family:var(--font-mono);font-size:9px;color:var(--fg-tertiary);margin-top:4px;">' + ['0:04','0:03','0:02'][i] + ' · 9:16</div>' +
            '</div>'
          )).join('') +
        '</div>' +
      '</div>'
    );
  }

  function escapeHTML(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── 4. Register builders + verbs ───────────────────────────────────
  const builders = {
    'scripted-hook': SCRIPTED_HOOK_HTML,
    'transcript':    TRANSCRIPT_HTML,
  };
  if (window.HF_DocsBlockBuilders) {
    Object.assign(window.HF_DocsBlockBuilders, builders);
  } else {
    window.HF_DocsBlockBuilders = builders;
  }

  function registerVerbs() {
    if (typeof window.HF_DocsSlashRegister !== 'function') {
      setTimeout(registerVerbs, 200);
      return;
    }
    [
      { category: 'COOPR Components', icon: 'hook', label: 'Scripted hook',
        desc: 'Bridges Hook scoring → script writer · Beat 01 locked from winning hook.',
        kind: 'embed-html', builderKey: 'scripted-hook', hint: '/scripted-hook' },
      { category: 'COOPR Components', icon: 'shotlist', label: 'Transcript → clips',
        desc: 'Paste transcript · auto-mark 9:16 candidates by sentence weight.',
        kind: 'embed-html', builderKey: 'transcript', hint: '/transcript' },
    ].forEach(v => window.HF_DocsSlashRegister(v));
  }
  registerVerbs();

  // ── 5. Action handlers (delegated) ─────────────────────────────────
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.getAttribute) return;
    const action = t.getAttribute('data-r8-action');
    if (!action) return;
    const embed = t.closest('.r8-embed');
    const toaster = window.__DOCS_R6_PUSH_TOAST || ((m) => { try { console.log(m); } catch (_) {} });

    if (action === 'rescore' && embed) {
      const ed = document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
      const won = findWinningHook(ed);
      if (!won) {
        toaster('No hook block above · /hook to add one');
        return;
      }
      const beat = embed.querySelector('[data-r8-beat-locked]');
      if (beat) {
        beat.textContent = won.text;
        beat.style.transition = 'background 220ms';
        beat.style.background = 'rgba(232,220,200,0.6)';
        setTimeout(() => { beat.style.background = 'transparent'; }, 600);
      }
      const status = embed.querySelector('[data-r8-link-status]');
      if (status) {
        status.textContent = 'locked · hook ' + ['A','B','C'][won.idx] + ' · ' + (won.score >= 0 ? won.score : '—') + '/100';
        status.style.color = 'var(--accent-primary)';
      }
      embed.setAttribute('data-r8-link-embed-id', won.embedId);
      embed.setAttribute('data-r8-link-variant', String(won.idx));
      toaster('Beat 01 · re-locked from hook ' + ['A','B','C'][won.idx]);
      return;
    }
    if (action === 'add-beat') { toaster('+ beat · phase-2'); return; }
    if (action === 't-rescore') {
      toaster('Transcript · re-scored · 3 candidates');
      return;
    }
  }, true);

  // ── 6. Bidirectional bind · beat → hook write-back ─────────────────
  // Debounced. Fires on input inside any [data-r8-beat-locked].
  const writeTimers = new WeakMap();
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (!t || !t.getAttribute) return;
    if (!t.matches || !t.matches('[data-r8-beat-locked]')) return;
    const embed = t.closest('.r8-embed-scripted-hook');
    if (!embed) return;
    const linkId = embed.getAttribute('data-r8-link-embed-id');
    const linkVar = parseInt(embed.getAttribute('data-r8-link-variant') || '-1', 10);
    if (!linkId || linkVar < 0) return;
    if (writeTimers.has(t)) clearTimeout(writeTimers.get(t));
    writeTimers.set(t, setTimeout(() => {
      writeBackToHook(linkId, linkVar, t.textContent);
    }, 300));
  }, true);

  // ── 7. Reverse bind · hook variant → beat (when user edits the hook) ─
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (!t || !t.getAttribute) return;
    if (!t.matches || !t.matches('[data-r6-hook-text]')) return;
    const row = t.closest('[data-r6-hook-row]');
    const hookEl = t.closest('.r6-embed-hook-v2');
    if (!row || !hookEl) return;
    const idx = parseInt(row.getAttribute('data-r6-hook-row') || '-1', 10);
    const embedId = hookEl.getAttribute('data-r6-embed-id');
    if (idx < 0 || !embedId) return;
    // Find any scripted-hook embeds linked to this variant
    const ed = document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
    if (!ed) return;
    const linked = ed.querySelectorAll('.r8-embed-scripted-hook[data-r8-link-embed-id="' + embedId + '"][data-r8-link-variant="' + idx + '"]');
    linked.forEach(scr => {
      const beat = scr.querySelector('[data-r8-beat-locked]');
      if (beat && beat.textContent !== t.textContent) {
        beat.textContent = t.textContent;
      }
    });
  }, true);

  Object.assign(window, {
    HF_DocsR8Blocks: { builders, findWinningHook, writeBackToHook },
  });
})();
