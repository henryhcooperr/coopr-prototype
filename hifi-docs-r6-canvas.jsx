/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r6-canvas.jsx — Docs R6 canvas enhancements (Wave 3 / S2).

   Composition layer over the R5 body. Owns:
     · Density toggle (compact 820 / comfortable 920 / spacious 1040) via
       a body class that adjusts the editable's max-width and line-height.
     · Promoted heading / config zone above the editor: eyebrow, large
       editorial title, version-tree strip with branch siblings, and a
       four-cell meta row (target, channel, agent, words).
     · Drop-target wiring on the editable: when items dragged from the
       media drawer (S7) land on the canvas, they insert as photo embeds.

   This file does NOT replace the R5 body. It augments it from outside via
   DOM injection + CSS. The R6 heading is mounted inside the doc shell view
   immediately above the existing R5 page header.

   Public API (window):
     HF_DocsCanvas.setDensity(level)       // 'compact' | 'comfortable' | 'spacious'
     HF_DocsCanvas.getDensity()
     HF_DocsCanvas                         // attach/detach state
*/

(function () {
  'use strict';
  if (window.__DOCS_R6_CANVAS_BOOTED__) return;
  window.__DOCS_R6_CANVAS_BOOTED__ = true;

  const LS_DENSITY = 'docs-r6-density';
  const DENSITY_VALUES = { compact: 820, comfortable: 920, spacious: 1040 };
  const DENSITY_LH    = { compact: 1.45, comfortable: 1.55, spacious: 1.65 };
  const DENSITY_PARA  = { compact: 12,   comfortable: 18,   spacious: 24 };

  function loadDensity() {
    try { const v = window.localStorage.getItem(LS_DENSITY); if (DENSITY_VALUES[v]) return v; } catch (e) {}
    return 'comfortable';
  }
  function saveDensity(v) { try { window.localStorage.setItem(LS_DENSITY, v); } catch (e) {} }

  let density = loadDensity();

  // ── CSS ──
  function densityCSS() {
    return `
      :root {
        --docs-r6-measure: ${DENSITY_VALUES[density]}px;
        --docs-r6-line-height: ${DENSITY_LH[density]};
        --docs-r6-para-spacing: ${DENSITY_PARA[density]}px;
      }
      [data-shell-view="doc"] [contenteditable="true"] {
        max-width: var(--docs-r6-measure) !important;
        line-height: var(--docs-r6-line-height);
        /* Card chrome — matches the heading zone aesthetic so the body
           feels like its own contained writing surface, not bare text on
           the canvas. */
        margin: 0 auto 28px !important;
        padding: 36px 56px 56px !important;
        background: var(--surface-1);
        border: 1px solid var(--border-subtle);
        border-radius: 14px;
        box-shadow:
          0 12px 28px -16px rgba(26,24,21,0.10),
          0 1px 0 rgba(253,252,249,0.7) inset;
        box-sizing: border-box;
        min-height: calc(100vh - 360px);
      }
      [data-shell-view="doc"] [contenteditable="true"] > p,
      [data-shell-view="doc"] [contenteditable="true"] > div {
        margin-bottom: var(--docs-r6-para-spacing);
      }
      /* Density-driven inside padding so compact reads tighter and
         spacious reads roomier — the inner gutters scale with the measure. */
      [data-shell-view="doc"] [contenteditable="true"] {
        --docs-r6-edit-pad-x: 56px;
        --docs-r6-edit-pad-y: 36px;
      }
      .docs-r6-heading-zone {
        max-width: var(--docs-r6-measure);
        margin: 24px auto 28px;
        padding: 28px 36px 22px;
        font-family: var(--font-sans);
        background: var(--surface-1);
        border: 1px solid var(--border-subtle);
        border-radius: 14px;
        box-shadow:
          0 12px 28px -16px rgba(26,24,21,0.10),
          0 1px 0 rgba(253,252,249,0.7) inset;
        position: relative;
      }
      /* The heading-zone "page" needle — a small mono kicker that anchors the
         card visually without dominating it. */
      .docs-r6-heading-zone::before {
        content: '';
        position: absolute;
        left: 36px; top: -1px;
        width: 28px; height: 3px;
        background: var(--accent-primary);
        border-radius: 0 0 2px 2px;
      }
      .docs-r6-heading-eyebrow {
        font-family: var(--font-mono);
        font-size: 9.5px; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase;
        color: var(--fg-tertiary);
        margin-bottom: 10px;
      }
      .docs-r6-heading-title {
        font-family: var(--font-serif);
        font-size: 36px; font-weight: 600; line-height: 1.1;
        color: var(--fg-primary);
        margin-bottom: 4px;
        letter-spacing: -0.01em;
      }
      .docs-r6-heading-tail {
        font-style: italic;
        color: var(--fg-tertiary);
      }
      .docs-r6-version-strip {
        display: flex; align-items: center; gap: 8px;
        padding: 16px 0 12px;
        border-bottom: 1px solid var(--border-subtle);
        margin-top: 14px;
      }
      .docs-r6-version-label {
        font-family: var(--font-mono);
        font-size: 9px; font-weight: 600;
        letter-spacing: 0.10em; text-transform: uppercase;
        color: var(--fg-tertiary);
      }
      .docs-r6-version-pill {
        display: inline-flex; align-items: center;
        height: 24px; padding: 0 10px;
        border: 1px solid var(--border-subtle);
        border-radius: 999px;
        font-family: var(--font-mono);
        font-size: 10.5px; font-weight: 600;
        color: var(--fg-secondary);
        background: var(--surface-1);
        cursor: pointer;
      }
      .docs-r6-version-pill.is-active {
        background: var(--accent-soft);
        color: var(--accent-primary);
        border-color: var(--accent-primary);
      }
      .docs-r6-version-pill.is-branch {
        border-style: dashed;
      }
      .docs-r6-meta-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
        padding: 12px 0 4px;
      }
      .docs-r6-meta-cell-label {
        font-family: var(--font-mono);
        font-size: 9px; font-weight: 600;
        letter-spacing: 0.10em; text-transform: uppercase;
        color: var(--fg-tertiary);
        margin-bottom: 4px;
      }
      .docs-r6-meta-cell-value {
        font-family: var(--font-serif);
        font-size: 14px;
        color: var(--fg-primary);
        line-height: 1.3;
      }
      /* Hide the R5 in-body page header when our R6 heading zone is mounted.
         R5_DocHeader is rendered as the first child <header> inside the
         R5 contentEditable. Without this, eyebrow/title/meta render twice. */
      [data-shell-view="doc"] [contenteditable="true"] > header:first-child {
        display: none !important;
      }
      /* Also hide the R5 state pill row that sits immediately after the
         R5 header (drafting · v3 chip — duplicates our version strip). */
      [data-shell-view="doc"] [contenteditable="true"] > header:first-child + div {
        display: none !important;
      }

      /* Density toggle floats top-right of doc view */
      .docs-r6-density-toggle {
        position: fixed;
        right: 16px;
        bottom: 80px;
        display: flex;
        gap: 4px;
        padding: 4px;
        background: var(--surface-1);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        box-shadow: 0 8px 16px -8px rgba(26,24,21,0.18);
        z-index: 7;
        opacity: 0;
        pointer-events: none;
        transition: opacity 220ms ease-out;
      }
      .docs-r6-chrome-doc-active .docs-r6-density-toggle {
        opacity: 1;
        pointer-events: auto;
      }
      .docs-r6-density-btn {
        font-family: var(--font-mono);
        font-size: 9.5px; font-weight: 600;
        letter-spacing: 0.10em; text-transform: uppercase;
        color: var(--fg-tertiary);
        padding: 6px 10px;
        border-radius: 5px;
        cursor: pointer;
        border: 1px solid transparent;
      }
      .docs-r6-density-btn:hover { color: var(--fg-primary); background: var(--surface-2); }
      .docs-r6-density-btn.is-active {
        background: var(--accent-soft);
        color: var(--accent-primary);
        border-color: var(--accent-primary);
      }
    `;
  }

  let styleEl = null;
  function applyDensity() {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'docs-r6-canvas-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = densityCSS();
  }

  function setDensity(level) {
    if (!DENSITY_VALUES[level]) return;
    if (density === level) return;
    density = level;
    saveDensity(level);
    applyDensity();
    densityListeners.forEach(cb => { try { cb(level); } catch (e) {} });
  }
  function getDensity() { return density; }
  const densityListeners = new Set();

  // ── Density toggle component (fixed bottom-right) ──
  function HF_DocsR6DensityToggle() {
    const [d, setD] = React.useState(density);
    React.useEffect(() => {
      const cb = (v) => setD(v);
      densityListeners.add(cb);
      return () => { densityListeners.delete(cb); };
    }, []);
    return (
      <div className="docs-r6-density-toggle" role="group" aria-label="Reading density">
        {Object.keys(DENSITY_VALUES).map(level => (
          <span key={level}
            className={'docs-r6-density-btn' + (d === level ? ' is-active' : '')}
            onClick={() => setDensity(level)}
            title={level + ' · ' + DENSITY_VALUES[level] + 'px'}>
            {level.charAt(0)}
          </span>
        ))}
      </div>
    );
  }

  // ── Heading zone — injected above R5 body in the doc view ──
  function HF_DocsR6HeadingZone() {
    const [docId, setDocId] = React.useState(null);
    const [bumper, setBumper] = React.useState(0);

    React.useEffect(() => {
      function tick() {
        const el = document.querySelector('[data-shell-view="doc"]');
        const id = el && el.getAttribute('data-active-doc-id');
        setDocId(id || null);
      }
      tick();
      const obs = new MutationObserver(() => { tick(); setBumper(n => n + 1); });
      obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-shell-view','data-active-doc-id'] });
      return () => obs.disconnect();
    }, []);

    const docMeta = React.useMemo(() => {
      const docs = window.R5H_DOCS || [];
      return docs.find(x => x.id === docId) || null;
    }, [docId, bumper]);

    const branches = React.useMemo(() => {
      if (!docMeta) return [];
      const docs = window.R5H_DOCS || [];
      return docs.filter(x => x.parentId === docMeta.id);
    }, [docMeta, bumper]);

    const parent = React.useMemo(() => {
      if (!docMeta || !docMeta.parentId) return null;
      const docs = window.R5H_DOCS || [];
      return docs.find(x => x.id === docMeta.parentId);
    }, [docMeta, bumper]);

    if (!docMeta) return null;
    const eyebrow = docMeta.eyebrow || 'Docs';
    const title = docMeta.title || 'Untitled';
    const tail = docMeta.italicTail || '';
    const version = docMeta.statusVersion || '';
    const status = docMeta.status || '';
    const target_when = docMeta.target_when || '—';
    const channel = docMeta.channel || '—';
    const agent = docMeta.agent || null;
    const words = docMeta.words || 0;
    const target = docMeta.target || 0;

    function applyMeta(label, val) {
      const toaster = window.__DOCS_R6_PUSH_TOAST || (() => {});
      toaster(label + ' · phase-2 · click-to-edit');
    }

    return (
      <div className="docs-r6-heading-zone" data-r6-heading-active={docId || ''}>
        <div className="docs-r6-heading-eyebrow">{eyebrow}</div>
        <div className="docs-r6-heading-title">
          {title}
          {tail && <span className="docs-r6-heading-tail"> {tail}</span>}
        </div>

        {/* Versioning strip — first-class per locked decision */}
        <div className="docs-r6-version-strip">
          <span className="docs-r6-version-label">Version</span>
          {parent && (
            <span
              className="docs-r6-version-pill is-branch"
              onClick={() => window.HF_DocsHomeOpenDoc && window.HF_DocsHomeOpenDoc(parent.id)}
              title={'Parent · ' + parent.title}>
              ↑ {parent.statusVersion || 'parent'}
            </span>
          )}
          {/* Self pill */}
          <span className="docs-r6-version-pill is-active">
            {version || 'v—'} · {status}
          </span>
          {/* Branch siblings */}
          {branches.map(b => (
            <span key={b.id}
              className="docs-r6-version-pill is-branch"
              onClick={() => window.HF_DocsHomeOpenDoc && window.HF_DocsHomeOpenDoc(b.id)}
              title={(b.branchLabel || b.title) + ' · ' + (b.statusVersion || '')}>
              {b.statusVersion || 'branch'} · {b.branchLabel || 'branch'}
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <span
            className="docs-r6-version-pill"
            style={{ borderStyle: 'dashed' }}
            onClick={() => applyMeta('+ branch', null)}
            title="Create a trial / branch from this version">
            + branch
          </span>
        </div>

        {/* Meta grid */}
        <div className="docs-r6-meta-grid">
          <div>
            <div className="docs-r6-meta-cell-label">Target</div>
            <div className="docs-r6-meta-cell-value">{target_when}</div>
          </div>
          <div>
            <div className="docs-r6-meta-cell-label">Channel</div>
            <div className="docs-r6-meta-cell-value">{channel}</div>
          </div>
          <div>
            <div className="docs-r6-meta-cell-label">Coopr</div>
            <div className="docs-r6-meta-cell-value">
              {agent
                ? <span>{agent.name} · <span style={{ color: 'var(--fg-tertiary)' }}>{agent.when}</span></span>
                : <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>idle</span>}
            </div>
          </div>
          <div>
            <div className="docs-r6-meta-cell-label">Words</div>
            <div className="docs-r6-meta-cell-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {words ? (words.toLocaleString() + (target ? ' / ' + target.toLocaleString() : '')) : '—'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Inject heading zone INSIDE the editable's scroll container ──
  // Mounting it as a SIBLING (above the editable) inside the same scroll
  // wrapper means the heading + body scroll as one unified column. The
  // earlier approach mounted it outside the scroll container, leaving the
  // user staring at a fixed heading + a tiny body scroll region.
  function HF_DocsR6CanvasOverlay() {
    const [docHostEl, setDocHostEl] = React.useState(null);

    React.useEffect(() => {
      function findScrollContainer(ed) {
        // Walk up from the editable to the closest ancestor with overflow:auto/scroll
        let cur = ed && ed.parentElement;
        while (cur && cur !== document.body) {
          const cs = window.getComputedStyle(cur);
          if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') return cur;
          cur = cur.parentElement;
        }
        return null;
      }
      function tick() {
        const docEl = document.querySelector('[data-shell-view="doc"]');
        if (!docEl) { setDocHostEl(null); return; }
        const ed = docEl.querySelector('[contenteditable="true"]');
        if (!ed) { setDocHostEl(null); return; }
        const scroller = findScrollContainer(ed);
        if (!scroller) { setDocHostEl(null); return; }
        // Find or create our heading mount as a SIBLING above the editable,
        // INSIDE the scroll container. Some shells wrap the editable in an
        // intermediate <div>; insert at the same level as that wrapper.
        let mount = scroller.querySelector(':scope > [data-r6-heading-mount]');
        if (!mount) {
          mount = document.createElement('div');
          mount.setAttribute('data-r6-heading-mount', '1');
          // Insert as scroller's first child so it appears above the editable.
          if (scroller.firstChild) {
            scroller.insertBefore(mount, scroller.firstChild);
          } else {
            scroller.appendChild(mount);
          }
        }
        // If a stale mount exists OUTSIDE the scroller (legacy from previous
        // builds), drop it so we don't render twice.
        const stale = docEl.querySelector('[data-r6-heading-mount]');
        if (stale && stale !== mount) {
          stale.parentNode && stale.parentNode.removeChild(stale);
        }
        setDocHostEl(mount);
      }
      tick();
      const obs = new MutationObserver(tick);
      obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-shell-view','data-active-doc-id'] });
      return () => obs.disconnect();
    }, []);

    if (!docHostEl) return null;
    return ReactDOM.createPortal(<HF_DocsR6HeadingZone />, docHostEl);
  }

  // ── Drop-target wiring on the editable for media-drawer drags ──
  function bootDropTargets() {
    if (window.__DOCS_R6_DROP_BOOTED__) return;
    window.__DOCS_R6_DROP_BOOTED__ = true;

    document.addEventListener('dragover', (e) => {
      const editable = e.target && e.target.closest && e.target.closest('[contenteditable="true"]');
      if (!editable) return;
      // Allow drop only if our MIME is present
      const types = e.dataTransfer && e.dataTransfer.types;
      if (!types) return;
      if (!Array.from(types).includes('application/x-r6-media') && !Array.from(types).includes('Files')) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      editable.classList.add('r5-drop-active');
    }, true);

    document.addEventListener('dragleave', (e) => {
      const editable = e.target && e.target.closest && e.target.closest('[contenteditable="true"]');
      if (editable) editable.classList.remove('r5-drop-active');
    }, true);

    document.addEventListener('drop', (e) => {
      const editable = e.target && e.target.closest && e.target.closest('[contenteditable="true"]');
      if (!editable) return;
      const data = e.dataTransfer && e.dataTransfer.getData && e.dataTransfer.getData('application/x-r6-media');
      if (!data) return;
      try {
        const item = JSON.parse(data);
        if (item.kind === 'photo' && item.src) {
          e.preventDefault();
          editable.classList.remove('r5-drop-active');
          editable.focus();
          // Use R5's photo embed builder if available; else custom HTML.
          let html;
          if (window.HF_DocsBlockBuilders && window.HF_DocsBlockBuilders['photo']) {
            html = window.HF_DocsBlockBuilders['photo']('drag-' + Date.now());
          } else {
            html = '<div class="r5-embed r5-embed-photo" data-r5-embed-id="drag-' + Date.now() + '" data-r5-embed-type="photo" contenteditable="false" style="display:block;margin:18px 0;border:1px solid var(--border-subtle);border-radius:6px;overflow:hidden;background:var(--surface-2);"><div class="r5-photo-canvas" style="width:100%;aspect-ratio:16/9;background-image:url(\'' + item.src + '\');background-size:cover;background-position:center;"></div></div>';
          }
          try { document.execCommand('insertHTML', false, html); } catch (err) { /* ignore */ }
          // Toast
          const toaster = window.__DOCS_R6_PUSH_TOAST || (() => {});
          toaster('Inserted · photo from drawer');
          return;
        }
        if (item.kind === 'color' && item.val) {
          e.preventDefault();
          editable.classList.remove('r5-drop-active');
          // Apply foreColor on current selection
          try {
            const tmp = document.createElement('div');
            tmp.style.color = item.val;
            document.body.appendChild(tmp);
            const real = window.getComputedStyle(tmp).color;
            tmp.remove();
            document.execCommand('foreColor', false, real);
            const toaster = window.__DOCS_R6_PUSH_TOAST || (() => {});
            toaster('Color · ' + (item.label || item.val));
          } catch (err) { /* ignore */ }
          return;
        }
      } catch (err) { /* ignore */ }
    }, true);
  }

  // ── Mount ──
  function mount() {
    if (!document.body) { requestAnimationFrame(mount); return; }
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
      requestAnimationFrame(mount); return;
    }
    applyDensity();
    let host = document.getElementById('docs-r6-canvas-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'docs-r6-canvas-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(
      <React.Fragment>
        <HF_DocsR6CanvasOverlay />
        <HF_DocsR6DensityToggle />
      </React.Fragment>
    );
    bootDropTargets();
  }
  mount();

  Object.assign(window, {
    HF_DocsCanvas: { setDensity, getDensity, mount },
  });
})();
