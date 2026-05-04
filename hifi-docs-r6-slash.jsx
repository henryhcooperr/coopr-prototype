/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r6-slash.jsx — Docs R6 enhanced slash menu (Wave 3 / S4).

   Adds a parallel slash menu to the R5 popover. R5's `/` keystroke continues
   to open the existing popover. Our R6 popover is opened explicitly via:
     · S5's ambient `+` button click  (most common)
     · Programmatic call: window.HF_DocsSlashOpen(x, y, opts?)

   What's new vs R5's slash:
     · Right-side hover-preview panel showing a rendered approximation of the
       block at scale (~0.6×). Hover or arrow-key onto a verb for ≥400ms →
       preview slides in.
     · Verb registry as window.HF_DocsVerbs (mutable array). S5 pushes its
       6 component-block verbs onto this array at module load.

   Public API (window):
     HF_DocsSlashOpen(x, y, opts?)      // open at viewport coords
     HF_DocsSlashClose()                // close
     HF_DocsVerbs                       // the registry array (extensible)
     HF_DocsSlashRegister(verb)         // append to registry
     HF_DocsSlashRender                 // mounts the popover root once
*/

(function () {
  'use strict';
  if (window.__DOCS_R6_SLASH_BOOTED__) return;
  window.__DOCS_R6_SLASH_BOOTED__ = true;

  // ── Verb registry — start with R5's lineage but reduced (full set lives
  // in R5 itself). The ambient-`+` flow promotes Component blocks; basic
  // blocks remain accessible too.
  const DEFAULT_VERBS = [
    { category: 'Basic blocks', icon: 'h1',     label: 'Heading 1',      desc: 'Section title.',                       cmd: 'formatBlock', val: '<h2>',           hint: '#' },
    { category: 'Basic blocks', icon: 'h2',     label: 'Heading 2',      desc: 'Sub-section.',                         cmd: 'formatBlock', val: '<h3>',           hint: '##' },
    { category: 'Basic blocks', icon: 'h3',     label: 'Heading 3',      desc: 'Tertiary heading.',                    cmd: 'formatBlock', val: '<h4>',           hint: '###' },
    { category: 'Basic blocks', icon: 'p',      label: 'Plain text',     desc: 'Regular paragraph.',                   cmd: 'formatBlock', val: '<p>'                },
    { category: 'Basic blocks', icon: 'quote',  label: 'Quote',          desc: 'Block quotation.',                     cmd: 'formatBlock', val: '<blockquote>',   hint: '>' },
    { category: 'Basic blocks', icon: 'hr',     label: 'Divider',        desc: 'Thin horizontal rule.',                cmd: 'insertHorizontalRule'                   },

    { category: 'Lists',        icon: 'ul',     label: 'Bullet list',    desc: 'A point-by-point list.',               cmd: 'insertUnorderedList',                hint: '⌘⇧8' },
    { category: 'Lists',        icon: 'ol',     label: 'Numbered list',  desc: 'An ordered list.',                     cmd: 'insertOrderedList',                  hint: '⌘⇧7' },
    { category: 'Lists',        icon: 'check',  label: 'Checklist',      desc: 'Boxes to tick off.',                   placeholder: '☐ '                          },
    // Component blocks register themselves from S5.
  ];

  const VERBS = (window.HF_DocsVerbs && Array.isArray(window.HF_DocsVerbs))
    ? window.HF_DocsVerbs
    : DEFAULT_VERBS.slice();
  // Expose registry for S5 / future extensions.
  window.HF_DocsVerbs = VERBS;

  function registerVerb(verb) {
    if (!verb || typeof verb !== 'object' || !verb.label) return;
    // De-dupe by label
    const existing = VERBS.findIndex(v => v.label === verb.label);
    if (existing >= 0) VERBS[existing] = verb;
    else VERBS.push(verb);
  }

  // ── Open/close state + listeners ──────────────────────────────
  const state = { open: false, x: 0, y: 0, opts: null };
  const listeners = new Set();
  function notify() { listeners.forEach(cb => { try { cb(state); } catch (e) { /* ignore */ } }); }

  // Snapshot the editable + caret position when the popover opens, so we
  // can restore focus + selection before inserting the block (the popover's
  // filter input steals focus on mount).
  function snapshotCaret() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    let editable = range.startContainer;
    if (editable.nodeType === 3) editable = editable.parentElement;
    while (editable && editable !== document.body && !editable.isContentEditable) {
      editable = editable.parentElement;
    }
    if (!editable || !editable.isContentEditable) {
      // Fallback: try to find the active R5 editable
      editable = document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
    }
    return { editable, range: range.cloneRange() };
  }
  function restoreCaret(snap) {
    if (!snap || !snap.editable) return false;
    try {
      snap.editable.focus();
      if (snap.range) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(snap.range);
      } else {
        // Place at end of editable
        const r = document.createRange();
        r.selectNodeContents(snap.editable);
        r.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
      }
      return true;
    } catch (e) { return false; }
  }

  function openAt(x, y, opts) {
    state.open = true;
    state.x = typeof x === 'number' ? x : 0;
    state.y = typeof y === 'number' ? y : 0;
    state.opts = opts || null;
    state.caretSnap = snapshotCaret();
    notify();
  }
  function close() {
    if (!state.open) return;
    state.open = false;
    state.opts = null;
    notify();
  }

  // ── CSS ──
  const CSS = `
    .docs-r6-slash-popover {
      position: fixed;
      z-index: 12;
      background: var(--surface-1);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      box-shadow:
        0 24px 48px -22px rgba(26,24,21,0.30),
        0 8px 16px -8px rgba(26,24,21,0.14),
        0 1px 0 rgba(253,252,249,0.7) inset;
      max-height: 440px;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      font-family: var(--font-sans);
    }
    .docs-r6-slash-list {
      width: 340px;
      max-height: 440px;
      overflow-y: auto;
      padding: 8px 0;
      flex-shrink: 0;
    }
    .docs-r6-slash-cat {
      font-family: var(--font-mono);
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--fg-tertiary);
      padding: 9px 16px 5px;
    }
    .docs-r6-slash-row {
      display: flex; align-items: center; gap: 12px;
      padding: 7px 14px;
      cursor: pointer;
      border-left: 2px solid transparent;
    }
    .docs-r6-slash-row.is-selected {
      background: var(--accent-soft);
      border-left-color: var(--accent-primary);
    }
    .docs-r6-slash-glyph {
      flex-shrink: 0;
      width: 30px; height: 30px;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface-2);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 10.5px;
      font-weight: 600;
      color: var(--fg-secondary);
    }
    .docs-r6-slash-label {
      font-family: var(--font-sans); font-size: 13px; font-weight: 500;
      color: var(--fg-primary); line-height: 1.2;
    }
    .docs-r6-slash-desc {
      font-family: var(--font-serif); font-size: 11.5px; font-style: italic;
      color: var(--fg-tertiary); line-height: 1.25; margin-top: 1px;
    }
    .docs-r6-slash-hint {
      margin-left: auto; flex-shrink: 0;
      font-family: var(--font-mono); font-size: 9.5px;
      color: var(--fg-tertiary); padding: 1px 6px;
      border: 1px solid var(--border-subtle); border-radius: 4px;
      background: var(--surface-1);
    }
    .docs-r6-slash-preview {
      width: 320px; max-height: 440px;
      border-left: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--surface-2) 60%, var(--surface-1));
      padding: 18px;
      overflow: hidden;
      opacity: 0; transform: translateX(-8px);
      transition: opacity 180ms cubic-bezier(0.2,0.7,0.2,1), transform 180ms cubic-bezier(0.2,0.7,0.2,1);
      pointer-events: none;
    }
    .docs-r6-slash-preview.is-visible {
      opacity: 1; transform: translateX(0);
    }
    .docs-r6-slash-preview-eyebrow {
      font-family: var(--font-mono); font-size: 9px; font-weight: 600;
      letter-spacing: 0.10em; text-transform: uppercase;
      color: var(--fg-tertiary); margin-bottom: 10px;
    }
    .docs-r6-slash-preview-canvas {
      transform: scale(0.85); transform-origin: top left;
      width: calc(100% / 0.85);
    }
    .docs-r6-slash-filter {
      padding: 6px 14px 8px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .docs-r6-slash-filter input {
      width: 100%;
      border: none; outline: none;
      background: transparent;
      font-family: var(--font-sans); font-size: 13px;
      color: var(--fg-primary);
    }
    .docs-r6-slash-filter input::placeholder {
      color: var(--fg-tertiary); font-style: italic; font-family: var(--font-serif);
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r6-slash-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r6-slash-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  // ── Glyph rendering (reuse R5_SlashIcon if available, else fallback) ─
  function Glyph({ kind }) {
    if (window.R5_SlashIcon) {
      try { return window.R5_SlashIcon({ kind }); } catch (e) { /* fall through */ }
    }
    const map = {
      h1: 'H1', h2: 'H2', h3: 'H3', p: '¶', quote: '"', hr: '—',
      ul: '•', ol: '1.', check: '☐', star: '✦', at: '@', code: '<>', callout: '◐',
      photo: '◫', video: '▶', gif: 'GIF', embed: '⤴',
      carousel: '◧◨', thread: '☰', hook: '↯',
      clip: 'CL', library: 'LB', script: 'SC', shotlist: 'SL', competitor: 'CR',
    };
    return <span>{map[kind] || '·'}</span>;
  }

  // ── Block preview renderer (rough approximations) ──
  function PreviewBlock({ verb }) {
    if (!verb) return null;
    const serif = 'var(--font-serif)';
    const ph = 'Heading text';
    const para = 'A paragraph of body text in editorial serif. Generous leading, comfortable measure, the way it lands when you actually type.';
    if (verb.cmd === 'formatBlock' && verb.val === '<h2>') {
      return <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 600, lineHeight: 1.18, color: 'var(--fg-primary)', margin: 0 }}>{ph}</h2>;
    }
    if (verb.cmd === 'formatBlock' && verb.val === '<h3>') {
      return <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, lineHeight: 1.2, color: 'var(--fg-primary)', margin: 0 }}>{ph}</h3>;
    }
    if (verb.cmd === 'formatBlock' && verb.val === '<h4>') {
      return <h4 style={{ fontFamily: serif, fontSize: 17, fontWeight: 600, lineHeight: 1.25, color: 'var(--fg-primary)', margin: 0 }}>{ph}</h4>;
    }
    if (verb.cmd === 'formatBlock' && verb.val === '<p>') {
      return <p style={{ fontFamily: serif, fontSize: 14, lineHeight: 1.55, color: 'var(--fg-primary)', margin: 0 }}>{para}</p>;
    }
    if (verb.cmd === 'formatBlock' && verb.val === '<blockquote>') {
      return <blockquote style={{ fontFamily: serif, fontSize: 16, fontStyle: 'italic', lineHeight: 1.45, color: 'var(--fg-secondary)', margin: 0, paddingLeft: 14, borderLeft: '2px solid var(--accent-primary)' }}>{para}</blockquote>;
    }
    if (verb.cmd === 'insertHorizontalRule') {
      return <hr style={{ border: 0, borderTop: '1px solid var(--border-default)', margin: '18px 0' }} />;
    }
    if (verb.cmd === 'insertUnorderedList') {
      return <ul style={{ fontFamily: serif, fontSize: 14, lineHeight: 1.55, color: 'var(--fg-primary)', margin: 0, paddingLeft: 22 }}>
        <li>First item — set a quick beat.</li>
        <li>Second item — keep going.</li>
        <li>Third item — close the loop.</li>
      </ul>;
    }
    if (verb.cmd === 'insertOrderedList') {
      return <ol style={{ fontFamily: serif, fontSize: 14, lineHeight: 1.55, color: 'var(--fg-primary)', margin: 0, paddingLeft: 22 }}>
        <li>Open with the hook.</li>
        <li>Set the stakes.</li>
        <li>Close with the lift.</li>
      </ol>;
    }
    if (verb.placeholder) {
      return <p style={{ fontFamily: serif, fontSize: 13, fontStyle: 'italic', color: 'var(--fg-tertiary)', margin: 0 }}>{verb.placeholder} placeholder text</p>;
    }
    if (verb.preview) {
      // Custom preview hook for component blocks (S5 sets this)
      try { return verb.preview(); } catch (e) { return null; }
    }
    if (verb.kind === 'embed-html') {
      return <div style={{
        height: 110, border: '1px dashed var(--border-default)', borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)',
        background: 'var(--surface-1)',
      }}>{verb.label || 'Embed'}</div>;
    }
    return <div style={{ fontFamily: serif, fontSize: 13, color: 'var(--fg-tertiary)' }}>No preview.</div>;
  }

  // ── Main popover component ──
  function HF_DocsSlashPopover() {
    const [s, setS] = React.useState(state);
    const [filter, setFilter] = React.useState('');
    const [selected, setSelected] = React.useState(0);
    const [previewVisible, setPreviewVisible] = React.useState(false);
    const previewTimerRef = React.useRef(null);

    React.useEffect(() => {
      const cb = (next) => { setS({ ...next }); if (!next.open) { setFilter(''); setSelected(0); setPreviewVisible(false); } };
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    }, []);

    const filtered = React.useMemo(() => {
      const f = filter.trim().toLowerCase();
      if (!f) return VERBS;
      return VERBS.filter(v =>
        (v.label && v.label.toLowerCase().includes(f)) ||
        (v.desc && v.desc.toLowerCase().includes(f)) ||
        (v.category && v.category.toLowerCase().includes(f)) ||
        (v.hint && v.hint.toLowerCase().includes(f)));
    }, [filter, s]);

    React.useEffect(() => {
      if (selected >= filtered.length) setSelected(0);
    }, [filtered.length, selected]);

    React.useEffect(() => {
      if (!s.open) return;
      // Hover-preview delay
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      setPreviewVisible(false);
      previewTimerRef.current = setTimeout(() => setPreviewVisible(true), 400);
      return () => { if (previewTimerRef.current) clearTimeout(previewTimerRef.current); };
    }, [s.open, selected, filter]);

    function pick(verb) {
      if (!verb) return;
      const snap = state.caretSnap;
      close();
      // Defer dispatch one tick so the popover unmount doesn't steal focus,
      // then restore the editable + caret position before issuing execCommand
      // (the popover's autoFocus filter input had stolen it on mount).
      setTimeout(() => {
        const restored = restoreCaret(snap);
        try {
          if (verb.cmd) {
            document.execCommand(verb.cmd, false, verb.val || null);
          } else if (verb.kind === 'embed-html' && verb.builderKey && window.HF_DocsBlockBuilders && window.HF_DocsBlockBuilders[verb.builderKey]) {
            const html = window.HF_DocsBlockBuilders[verb.builderKey]('id-' + Date.now());
            document.execCommand('insertHTML', false, html);
            // Fire input on the editable so R5's debounced localStorage save picks it up.
            if (snap && snap.editable) snap.editable.dispatchEvent(new Event('input', { bubbles: true }));
          } else if (verb.placeholder) {
            document.execCommand('insertText', false, verb.placeholder);
          } else if (typeof verb.onPick === 'function') {
            verb.onPick();
          }
        } catch (e) { /* swallow */ }
        const toaster = window.__DOCS_R6_PUSH_TOAST;
        if (toaster) toaster('Inserted · ' + verb.label);
      }, 0);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(i => Math.min(i + 1, filtered.length - 1)); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)); return; }
      if (e.key === 'Enter')     { e.preventDefault(); pick(filtered[selected]); return; }
      if (e.key === 'ArrowRight') {
        if (!previewVisible) { e.preventDefault(); setPreviewVisible(true); }
        return;
      }
    }

    if (!s.open) return null;

    // Group filtered verbs by category in registry order.
    const categories = [];
    for (const v of filtered) {
      let cat = categories.find(c => c.name === v.category);
      if (!cat) { cat = { name: v.category, verbs: [] }; categories.push(cat); }
      cat.verbs.push(v);
    }
    // Map filtered index back to selected via flat order (already ordered same as VERBS so flat index applies).
    let flatIdx = -1;

    // Position — clamp to viewport
    const margin = 8;
    const totalW = 340 + (previewVisible && filtered.length > 0 ? 320 : 0) + 2;
    const totalH = 440;
    let posX = s.x;
    let posY = s.y + 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (posX + totalW > vw - margin) posX = Math.max(margin, vw - totalW - margin);
    if (posY + totalH > vh - margin) posY = Math.max(margin, s.y - totalH - 8);

    return (
      <div className="docs-r6-slash-popover" style={{ left: posX, top: posY }} onKeyDown={onKeyDown} tabIndex={-1}>
        <div className="docs-r6-slash-list">
          <div className="docs-r6-slash-filter">
            <input
              autoFocus
              placeholder="Filter blocks…"
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setSelected(0); }}
              onKeyDown={onKeyDown}
            />
          </div>
          {categories.map(cat => (
            <div key={cat.name}>
              <div className="docs-r6-slash-cat">{cat.name}</div>
              {cat.verbs.map((v) => {
                flatIdx++;
                const isSel = flatIdx === selected;
                return (
                  <div
                    key={v.label}
                    className={'docs-r6-slash-row' + (isSel ? ' is-selected' : '')}
                    onMouseEnter={() => setSelected(flatIdx)}
                    onClick={() => pick(v)}>
                    <span className="docs-r6-slash-glyph"><Glyph kind={v.icon} /></span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="docs-r6-slash-label">{v.label}</div>
                      <div className="docs-r6-slash-desc">{v.desc || ''}</div>
                    </div>
                    {v.hint && <span className="docs-r6-slash-hint">{v.hint}</span>}
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '18px 18px 24px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-tertiary)', textAlign: 'center' }}>
              No matches for "{filter}".
            </div>
          )}
        </div>
        {filtered.length > 0 && (
          <div className={'docs-r6-slash-preview' + (previewVisible ? ' is-visible' : '')}>
            <div className="docs-r6-slash-preview-eyebrow">Preview · {filtered[selected] && filtered[selected].label}</div>
            <div className="docs-r6-slash-preview-canvas">
              <PreviewBlock verb={filtered[selected]} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Click-outside to close ──
  document.addEventListener('mousedown', (e) => {
    if (!state.open) return;
    const t = e.target;
    if (t && t.closest && t.closest('.docs-r6-slash-popover')) return;
    close();
  }, true);

  // ── Mount ──
  function mount() {
    if (!document.body) { requestAnimationFrame(mount); return; }
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
      requestAnimationFrame(mount);
      return;
    }
    injectCSS();
    let host = document.getElementById('docs-r6-slash-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'docs-r6-slash-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(<HF_DocsSlashPopover />);
  }
  mount();

  // ── Public API ──
  Object.assign(window, {
    HF_DocsSlashOpen: openAt,
    HF_DocsSlashClose: close,
    HF_DocsSlashRegister: registerVerb,
    HF_DocsSlashPopover,
  });
})();
