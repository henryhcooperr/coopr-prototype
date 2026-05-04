/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r8-canvas.jsx — Docs R8 single-vessel canvas (Wave 4 / V1).

   Loads AFTER hifi-docs-r6-canvas.jsx and overrides its visual contract:

   ── What changes from R6 ──────────────────────────────────────────
   1. ONE VESSEL · the body card and the heading zone collapse into a
      single bordered surface. The heading is the first block of the body
      card; a single hairline rule (--border-subtle) — not a card boundary —
      separates heading from prose.
   2. INLINE TOOLS · format/insert/version/share dock to a mono right-row
      INSIDE the heading block. The R8 chrome retires the floating toolbar.
   3. ONE META STRIP · version-strip + 4-cell meta-grid collapse to a
      single mono dateline (active version pill + branch pills + target +
      channel + words).
   4. NO DENSITY TOGGLE · the bottom-right toggle is hidden. Measure stays
      at 920 (the R6 'comfortable' default). If we want density back we'll
      surface it inside the doc via /density.

   Implementation: this file does NOT delete or replace HF_DocsR6HeadingZone.
   It overrides the CSS, renames the heading mount sentinel attribute so
   the R6 useEffect can't repurpose it, and mounts its OWN portal instead.
   The R6 portal still exists in the React tree, but its host element is
   never created (we hide the legacy mount selector with a CSS guard).

   Public API (window):
     HF_DocsR8Canvas.dispatchTool(name)   // shared dispatcher for toolbar+heading
     HF_DocsR8Canvas.getActiveDocId()
*/

(function () {
  'use strict';
  if (window.__DOCS_R8_CANVAS_BOOTED__) return;
  window.__DOCS_R8_CANVAS_BOOTED__ = true;

  // ── 0. Public dispatcher · used by both heading inline tools and the
  //      retired-but-bridged R8 chrome listeners. Centralized so behavior
  //      stays consistent regardless of where the click came from. ──────
  function dispatchTool(name) {
    const toaster = window.__DOCS_R6_PUSH_TOAST || ((m) => { try { console.log(m); } catch (_) {} });
    switch (name) {
      case 'Format':
      case 'Insert':
      case 'Version':
      case 'Share':
      case 'Overflow':
        toaster('R8 · ' + name + ' · phase-2');
        // Mirror the R8 gutter-hint primitive: surfacing equivalent
        // shortcut after the user reaches for the menu.
        if (window.HF_DocsR8Discoverability && window.HF_DocsR8Discoverability.flashHint) {
          const hints = { Format: '⌘B / ⌘I', Insert: '/', Version: '⌘⇧V', Share: '⌘⇧S' };
          if (hints[name]) window.HF_DocsR8Discoverability.flashHint('Next time · ' + hints[name]);
        }
        break;
      default:
        toaster('R8 · ' + name);
    }
  }

  function getActiveDocId() {
    const el = document.querySelector('[data-shell-view="doc"]');
    return el && el.getAttribute('data-active-doc-id') || null;
  }

  // ── 1. CSS · single vessel + hidden density toggle + retired toolbar
  //      visual ────────────────────────────────────────────────────
  const CSS = `
    /* ─── Retire the R6 floating toolbar visually ─────────────────── */
    .docs-r6-toolbar { display: none !important; }

    /* ─── Retire the R6 density toggle ───────────────────────────── */
    .docs-r6-density-toggle { display: none !important; }

    /* ─── Hide the legacy R6 heading mount if it tries to render ──── */
    [data-r6-heading-mount] { display: none !important; }

    /* ─── Hide R5's in-body page header when R8 vessel is active ────
       R6 had a similar rule but it scoped against header:first-child,
       which no longer matches now that R8 inserts data-r8-heading-mount
       as the first child of the editable. Match any HEADER inside the
       editable — Truk doc renders R5_DocHeader as a HEADER element with
       big serif title + status row + format/channel/target grid. */
    [data-shell-view="doc"] [contenteditable="true"] > header {
      display: none !important;
    }
    /* R5's in-body state-pill row sits immediately after R5_DocHeader.
       It was hidden in R6 by adjacent-sibling selector against the
       hidden header — replicate that here. R5 doesn't class it; we
       target the inline-styled state-pill wrapper structurally. */
    [data-shell-view="doc"] [contenteditable="true"] > header + div {
      display: none !important;
    }

    /* ─── Hide the R4 "Chat-created draft package" studio artifact ──
       R5 shell unconditionally renders R4GDraftStudioArtifact as a
       sibling above the body row whenever the function exists, on
       BOTH home view (line 252) and doc view (line 284). It's a
       launch-ready-read demo banner that fights R8's quiet vessel and
       crowds the home grid. Hide on either shell view. */
    [data-shell-view="home"] > div[style*="padding: 10px 18px"],
    [data-shell-view="doc"] > div[style*="padding: 10px 18px"] {
      display: none !important;
    }

    /* ─── R8 single vessel ────────────────────────────────────────── */
    /* The body editable becomes the only vessel. Its border, radius,
       background, and shadow are owned here and override the R6 recipe. */
    [data-shell-view="doc"] [contenteditable="true"] {
      max-width: 760px !important;
      margin: 28px auto 28px !important;
      padding: 0 !important;
      background: var(--surface-1) !important;
      border: 1px solid var(--border-subtle) !important;
      border-radius: 4px !important;
      box-shadow: none !important;
      box-sizing: border-box !important;
      position: relative !important;
      min-height: calc(100vh - 200px) !important;
    }
    /* Single accent kicker — the only chrome flourish on the vessel */
    [data-shell-view="doc"] [contenteditable="true"]::before {
      content: '';
      position: absolute;
      left: 36px; top: -1px;
      width: 28px; height: 3px;
      background: var(--accent-primary);
      pointer-events: none;
    }
    /* Inner padding moves to a wrapper inside the editable so the heading
       block (added via portal as the first child) and the prose can carry
       different paddings without breaking the editable's contenteditable
       contract. */
    [data-shell-view="doc"] [contenteditable="true"] > p,
    [data-shell-view="doc"] [contenteditable="true"] > div:not([data-r8-heading-mount]):not(.r6-embed):not(.r7-embed):not(.r8-embed):not(.r5-embed),
    [data-shell-view="doc"] [contenteditable="true"] > h1,
    [data-shell-view="doc"] [contenteditable="true"] > h2,
    [data-shell-view="doc"] [contenteditable="true"] > h3,
    [data-shell-view="doc"] [contenteditable="true"] > ul,
    [data-shell-view="doc"] [contenteditable="true"] > ol,
    [data-shell-view="doc"] [contenteditable="true"] > blockquote {
      padding-left: 56px;
      padding-right: 56px;
      max-width: none;
    }
    [data-shell-view="doc"] [contenteditable="true"] > p:first-of-type,
    [data-shell-view="doc"] [contenteditable="true"] [data-r8-heading-mount] + p,
    [data-shell-view="doc"] [contenteditable="true"] [data-r8-heading-mount] + div {
      padding-top: 4px;
    }
    [data-shell-view="doc"] [contenteditable="true"] > p:last-of-type {
      padding-bottom: 56px;
    }

    /* ─── Heading block — sits as first child of the editable ────── */
    .docs-r8-heading {
      padding: 32px 56px 22px;
      font-family: var(--font-sans);
      position: relative;
      user-select: text;
    }
    .docs-r8-heading-row1 {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 14px;
    }
    .docs-r8-back {
      font-family: var(--font-mono);
      font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--fg-tertiary);
      cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 0;
      transition: color 120ms;
    }
    .docs-r8-back:hover { color: var(--fg-primary); }
    .docs-r8-tools {
      display: flex; gap: 2px;
      margin-left: auto;
    }
    .docs-r8-tool {
      width: 28px; height: 28px;
      display: inline-flex; align-items: center; justify-content: center;
      color: var(--fg-tertiary);
      border-radius: 5px;
      cursor: pointer;
      transition: background 100ms, color 100ms;
    }
    .docs-r8-tool:hover { color: var(--fg-primary); background: var(--surface-2); }
    .docs-r8-tool.is-primary {
      width: auto;
      padding: 0 11px;
      height: 26px;
      background: var(--fg-primary);
      color: var(--fg-on-accent);
      font-family: var(--font-mono);
      font-size: 9.5px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      margin-left: 4px;
    }
    .docs-r8-tool.is-primary:hover {
      background: var(--accent-primary);
      color: var(--fg-on-accent);
    }
    .docs-r8-eyebrow {
      font-family: var(--font-mono);
      font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--fg-tertiary);
      margin-bottom: 8px;
    }
    .docs-r8-title {
      font-family: var(--font-serif);
      font-style: italic;
      font-weight: 600;
      font-size: 34px;
      line-height: 1.06;
      letter-spacing: -0.025em;
      color: var(--fg-primary);
      margin-bottom: 4px;
    }
    .docs-r8-title-tail {
      font-family: var(--font-serif);
      font-style: italic;
      color: var(--fg-tertiary);
      font-size: 20px;
    }
    /* The single mono meta strip — replaces version-strip + 4-cell grid */
    .docs-r8-meta-strip {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 14px;
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 0.04em;
      color: var(--fg-tertiary);
    }
    .docs-r8-meta-strip .k {
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.10em;
    }
    .docs-r8-meta-strip .v {
      color: var(--fg-secondary);
      text-transform: none;
      letter-spacing: 0;
    }
    .docs-r8-meta-strip .v.serif {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 13px;
      color: var(--fg-primary);
    }
    .docs-r8-meta-strip .sep {
      width: 1px; height: 11px;
      background: var(--border-default);
      display: inline-block;
    }
    .docs-r8-pill {
      display: inline-flex; align-items: center;
      height: 22px; padding: 0 10px;
      border: 1px solid var(--border-subtle);
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.06em;
      color: var(--fg-secondary);
      background: var(--surface-1);
      cursor: pointer;
      transition: background 100ms, color 100ms, border-color 100ms;
    }
    .docs-r8-pill:hover { background: var(--surface-2); color: var(--fg-primary); }
    .docs-r8-pill.is-active {
      background: var(--accent-soft);
      color: var(--accent-primary);
      border-color: var(--accent-primary);
    }
    .docs-r8-pill.is-branch { border-style: dashed; }

    /* The hairline rule — NOT a card boundary, just a divider. */
    .docs-r8-rule {
      height: 1px;
      background: var(--border-subtle);
      margin: 0 36px 12px;
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r8-canvas-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r8-canvas-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  // ── 2. R8 heading component — renders into the inside of the editable
  //      as the first child (via portal). Carries title + back + tools +
  //      meta strip. ────────────────────────────────────────────────
  function HF_DocsR8Heading() {
    const [docId, setDocId] = React.useState(null);
    const [bumper, setBumper] = React.useState(0);

    React.useEffect(() => {
      // PATCH (orchestrator · 2026-05-04): the original observer fired
      // setBumper on EVERY DOM mutation in the subtree (childList:true,
      // subtree:true). Re-render → DOM changes → observer fires → setBumper
      // → re-render → infinite loop, renderer froze. Fix: only respond to
      // ATTRIBUTE changes for data-shell-view / data-active-doc-id (the
      // attributeFilter does narrow attribute mutations, but childList
      // mutations were ignoring the filter). Drop childList monitoring;
      // the attribute mutations are the only ones we actually care about.
      function tick() { setDocId(getActiveDocId()); }
      tick();
      const obs = new MutationObserver((mutations) => {
        let docIdChanged = false;
        for (const m of mutations) {
          if (m.type === 'attributes') { docIdChanged = true; break; }
        }
        if (docIdChanged) {
          tick();
          setBumper(n => n + 1);
        }
      });
      obs.observe(document.body, {
        attributes: true, subtree: true,
        attributeFilter: ['data-shell-view', 'data-active-doc-id'],
      });
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

    function back() {
      if (typeof window.docsR6BackToHome === 'function') window.docsR6BackToHome();
    }

    const eyebrow = docMeta.eyebrow || 'Docs';
    const title = docMeta.title || 'Untitled';
    const tail = docMeta.italicTail || '';
    const version = docMeta.statusVersion || 'v—';
    const status = docMeta.status || '';
    const target_when = docMeta.target_when || '—';
    const channel = docMeta.channel || '—';
    const words = docMeta.words || 0;
    const target = docMeta.target || 0;

    const ToolIcon = ({ name }) => {
      if (name === 'Format') return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 4 L11 4 M3 7 L9 7 M3 10 L11 10"/></svg>;
      if (name === 'Insert') return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="7" y1="3" x2="7" y2="11"/><line x1="3" y1="7" x2="11" y2="7"/></svg>;
      if (name === 'Version') return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="4" cy="4" r="1.6" fill="none"/><circle cx="10" cy="10" r="1.6" fill="none"/><path d="M4 5.6 Q4 10 9 10"/></svg>;
      if (name === 'Overflow') return <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="3" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="11" cy="7" r="1.2" fill="currentColor"/></svg>;
      return null;
    };

    return (
      <div className="docs-r8-heading" contentEditable={false} suppressContentEditableWarning>
        <div className="docs-r8-heading-row1">
          <span className="docs-r8-back" onClick={back} title="Back to Docs home">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2 L4 6 L8 10"/></svg>
            Docs
          </span>
          <div className="docs-r8-tools" role="toolbar" aria-label="Document tools">
            {['Format','Insert','Version'].map(n => (
              <span key={n} className="docs-r8-tool" title={n} onClick={() => dispatchTool(n)}>
                <ToolIcon name={n} />
              </span>
            ))}
            <span className="docs-r8-tool" title="More" onClick={() => dispatchTool('Overflow')}>
              <ToolIcon name="Overflow" />
            </span>
            <span className="docs-r8-tool is-primary" onClick={() => dispatchTool('Share')}>Share</span>
          </div>
        </div>

        <div className="docs-r8-eyebrow">{eyebrow}</div>
        <div className="docs-r8-title">
          {title}
          {tail && <><br/><span className="docs-r8-title-tail">{tail}</span></>}
        </div>

        <div className="docs-r8-meta-strip">
          <span className="docs-r8-pill is-active" title={status ? (status + ' · current') : 'current'}>
            {version}{status ? ' · ' + status : ''}
          </span>
          {parent && (
            <span
              className="docs-r8-pill is-branch"
              onClick={() => window.HF_DocsHomeOpenDoc && window.HF_DocsHomeOpenDoc(parent.id)}
              title={'Parent · ' + parent.title}>
              ↑ {parent.statusVersion || 'parent'}
            </span>
          )}
          {branches.map(b => (
            <span key={b.id}
              className="docs-r8-pill is-branch"
              onClick={() => window.HF_DocsHomeOpenDoc && window.HF_DocsHomeOpenDoc(b.id)}
              title={(b.branchLabel || b.title) + ' · ' + (b.statusVersion || '')}>
              {b.statusVersion || 'branch'}
            </span>
          ))}
          <span className="docs-r8-pill is-branch" onClick={() => dispatchTool('Branch')} title="Create a trial / branch">+</span>

          <span className="sep" />
          <span className="k">Target</span><span className="v serif">{target_when}</span>
          <span className="sep" />
          <span className="k">Channel</span><span className="v">{channel}</span>
          <span className="sep" />
          <span className="k">Words</span><span className="v">
            {words ? (words.toLocaleString() + (target ? ' / ' + target.toLocaleString() : '')) : '—'}
          </span>
        </div>
      </div>
    );
  }

  // ── 3. Overlay · maintains the heading mount as first child of the
  //      contenteditable. Mounts after the editable exists, replaces R6's
  //      [data-r6-heading-mount] sentinel logic. ────────────────────────
  function HF_DocsR8CanvasOverlay() {
    const [host, setHost] = React.useState(null);

    React.useEffect(() => {
      function tick() {
        const docEl = document.querySelector('[data-shell-view="doc"]');
        if (!docEl) { setHost(null); return; }
        const ed = docEl.querySelector('[contenteditable="true"]');
        if (!ed) { setHost(null); return; }
        // Find or create the R8 heading mount as ed's first child. We mount
        // INSIDE the editable so it scrolls with prose. contentEditable is
        // forced to false on the mount + heading, so caret can't enter.
        let mount = ed.querySelector(':scope > [data-r8-heading-mount]');
        if (!mount) {
          mount = document.createElement('div');
          mount.setAttribute('data-r8-heading-mount', '1');
          mount.setAttribute('contenteditable', 'false');
          if (ed.firstChild) ed.insertBefore(mount, ed.firstChild);
          else ed.appendChild(mount);
        }
        // NOTE (orchestrator patch · 2026-05-04): originally R8 actively
        // removed any [data-r6-heading-mount] here. But R6 canvas runs its
        // own MutationObserver that re-creates that mount on every DOM
        // mutation — removal triggered a mutual fight that froze the
        // renderer (CDP timed out at 45s). The R6 mount is already hidden
        // via CSS line ~75 ([data-r6-heading-mount] { display: none !important })
        // so leaving the dead node in place is harmless — it sits hidden
        // inside the React tree.
        setHost(mount);
      }
      tick();
      // Same fix as the heading observer — drop childList:true to avoid
      // the renderer-freezing mutual-mutation loop. We only need to react
      // when the shell view or active doc id changes (attribute mutations).
      const obs = new MutationObserver((mutations) => {
        let attrChanged = false;
        for (const m of mutations) {
          if (m.type === 'attributes') { attrChanged = true; break; }
        }
        if (attrChanged) tick();
      });
      obs.observe(document.body, {
        attributes: true, subtree: true,
        attributeFilter: ['data-shell-view', 'data-active-doc-id'],
      });
      return () => obs.disconnect();
    }, []);

    if (!host) return null;
    return ReactDOM.createPortal(<HF_DocsR8Heading />, host);
  }

  // ── Mount ─────────────────────────────────────────────────────────
  function mount() {
    if (!document.body) { requestAnimationFrame(mount); return; }
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
      requestAnimationFrame(mount); return;
    }
    injectCSS();
    let host = document.getElementById('docs-r8-canvas-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'docs-r8-canvas-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(<HF_DocsR8CanvasOverlay />);
  }
  mount();

  Object.assign(window, {
    HF_DocsR8Canvas: { dispatchTool, getActiveDocId, mount },
  });
})();
