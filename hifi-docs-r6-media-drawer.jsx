/* global React, ReactDOM, window, document, requestAnimationFrame, FileReader */
/* hifi-docs-r6-media-drawer.jsx — Docs R6 persistent media drawer
   (Wave 3 / S7). Bottom-edge handle with three states: closed (24px peek
   bar), peek (48px header strip), open (360px full).

   Sections (tabs at top of drawer):
     · Recents · This doc · Other docs · Library · Brand kit

   Drag-into-doc: each thumbnail is HTML5-draggable with MIME
   `application/x-r6-media`; dropped on contentEditable inserts a photo
   embed at the caret. Dropped on an existing photo embed replaces it
   (handled by S5/S2 listeners).

   Public API (window):
     HF_DocsMediaDrawerOpen()
     HF_DocsMediaDrawerClose()
     HF_DocsMediaDrawerAdd(item)         // append to Recents
     HF_DocsMediaDrawer                  // React component
*/

(function () {
  'use strict';
  if (window.__DOCS_R6_MEDIA_BOOTED__) return;
  window.__DOCS_R6_MEDIA_BOOTED__ = true;

  const LS_RECENTS = 'docs-r6-media-recents';
  const LS_DRAWER_STATE = 'docs-r6-drawer-state';

  function loadRecents() {
    try {
      const raw = window.localStorage.getItem(LS_RECENTS);
      const arr = raw ? JSON.parse(raw) : null;
      if (Array.isArray(arr)) return arr;
    } catch (e) {}
    return [];
  }
  function saveRecents(arr) {
    try { window.localStorage.setItem(LS_RECENTS, JSON.stringify(arr.slice(-40))); } catch (e) {}
  }
  function loadDrawerState() {
    try {
      const v = window.localStorage.getItem(LS_DRAWER_STATE);
      if (v === 'closed' || v === 'peek' || v === 'open') return v;
    } catch (e) {}
    return 'closed';
  }
  function saveDrawerState(v) { try { window.localStorage.setItem(LS_DRAWER_STATE, v); } catch (e) {} }

  // ── State + listeners ──
  let drawerState = loadDrawerState();
  let activeSection = 'recents';
  const stateListeners = new Set();
  function notify() { stateListeners.forEach(cb => { try { cb(drawerState, activeSection); } catch (e) {} }); }

  function setDrawerState(v) {
    if (drawerState === v) return;
    drawerState = v;
    saveDrawerState(v);
    notify();
  }

  // ── Public add() ──
  let recents = loadRecents();
  function addToRecents(item) {
    if (!item || !item.src) return;
    recents = [...recents, { ...item, ts: Date.now() }].slice(-40);
    saveRecents(recents);
    listenersAdd.forEach(cb => { try { cb(recents); } catch (e) {} });
  }
  const listenersAdd = new Set();

  // ── Static brand-kit fixture ──
  const BRAND_KIT = {
    logos: [
      { id: 'logo-coopr-mark', label: 'COOPR mark', glyph: 'C' },
      { id: 'logo-coopr-word', label: 'COOPR word', glyph: 'COOPR' },
    ],
    colors: [
      { id: 'moss',  val: 'var(--accent-primary)', label: 'moss · accent' },
      { id: 'cocoa', val: 'var(--fg-primary)',     label: 'cocoa · ink' },
      { id: 'ivory', val: 'var(--surface-1)',      label: 'ivory · surface' },
      { id: 'tone-fg-2', val: 'var(--fg-secondary)', label: 'mist · fg-2' },
      { id: 'tone-fg-3', val: 'var(--fg-tertiary)',  label: 'fog · fg-3' },
    ],
    fonts: [
      { id: 'serif',   stack: 'var(--font-serif)', label: 'Serif · editorial', sample: 'Five instructor mistakes.' },
      { id: 'sans',    stack: 'var(--font-sans)',  label: 'Sans · UI',          sample: 'Studio · Workspace · Channel' },
      { id: 'mono',    stack: 'var(--font-mono)',  label: 'Mono · numbers',     sample: '1842 / 2400 · v3' },
    ],
  };

  // ── CSS ──
  const CSS = `
    .docs-r6-drawer {
      position: fixed;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: min(calc(100vw - 28px), 1100px);
      background: var(--surface-1);
      border: 1px solid var(--border-subtle);
      border-bottom: none;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      box-shadow: 0 -16px 32px -18px rgba(26,24,21,0.18), 0 -2px 6px -3px rgba(26,24,21,0.08);
      z-index: 11;
      display: flex; flex-direction: column;
      overflow: hidden;
      transition: height 280ms cubic-bezier(0.2,0.7,0.2,1);
    }
    .docs-r6-drawer.is-closed { height: 24px; }
    .docs-r6-drawer.is-peek   { height: 48px; }
    .docs-r6-drawer.is-open   { height: 360px; }
    .docs-r6-drawer-handle {
      height: 24px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .docs-r6-drawer-handle:hover { background: var(--surface-2); }
    .docs-r6-drawer-handle-bar {
      width: 36px; height: 3px;
      background: var(--border-default);
      border-radius: 2px;
    }
    .docs-r6-drawer-tabs {
      height: 24px;
      display: flex; align-items: center; gap: 18px;
      padding: 0 14px;
      flex-shrink: 0;
    }
    .docs-r6-drawer-tab {
      font-family: var(--font-mono);
      font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.10em; text-transform: uppercase;
      color: var(--fg-tertiary);
      cursor: pointer;
      padding: 4px 0;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      white-space: nowrap;
    }
    .docs-r6-drawer-tab.is-active {
      color: var(--fg-primary);
      border-bottom-color: var(--accent-primary);
    }
    .docs-r6-drawer-actions {
      margin-left: auto;
      display: flex; align-items: center; gap: 8px;
    }
    .docs-r6-drawer-btn {
      display: inline-flex; align-items: center;
      height: 26px; padding: 0 11px;
      border: 1px solid var(--border-subtle);
      border-radius: 7px; cursor: pointer;
      font-family: var(--font-sans); font-size: 11px; font-weight: 500;
      color: var(--fg-secondary); background: var(--surface-1);
    }
    .docs-r6-drawer-btn:hover { background: var(--surface-2); color: var(--fg-primary); }
    .docs-r6-drawer-btn.is-primary {
      background: var(--accent-primary);
      color: var(--fg-on-accent);
      border-color: var(--accent-primary);
    }
    .docs-r6-drawer-body {
      flex: 1; min-height: 0;
      padding: 12px 14px 16px;
      overflow-y: auto;
      display: flex; flex-direction: column; gap: 14px;
    }
    .docs-r6-drawer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 8px;
    }
    .docs-r6-thumb {
      aspect-ratio: 1 / 1;
      background: var(--surface-2);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      cursor: grab;
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;
    }
    .docs-r6-thumb:hover { border-color: var(--border-default); }
    .docs-r6-thumb-empty {
      aspect-ratio: 1 / 1;
      border: 1px dashed var(--border-default);
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-family: var(--font-mono); font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.10em; text-transform: uppercase;
      color: var(--fg-tertiary);
    }
    .docs-r6-thumb-empty:hover { background: var(--surface-2); color: var(--fg-secondary); }
    .docs-r6-color-row {
      display: flex; gap: 10px; align-items: center;
      padding: 6px 0;
    }
    .docs-r6-color-swatch {
      width: 28px; height: 28px;
      border-radius: 6px;
      border: 1px solid var(--border-subtle);
      cursor: grab;
    }
    .docs-r6-empty-state {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 13px;
      color: var(--fg-tertiary);
      line-height: 1.5;
      padding: 24px 12px;
      text-align: center;
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r6-media-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r6-media-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  // ── Drawer component ──
  function HF_DocsMediaDrawer() {
    const [state, setState] = React.useState(drawerState);
    const [section, setSection] = React.useState(activeSection);
    const [recentsList, setRecentsList] = React.useState(recents);
    const fileRef = React.useRef(null);

    React.useEffect(() => {
      const cb = (s, sec) => { setState(s); setSection(sec); };
      stateListeners.add(cb);
      const cb2 = (arr) => setRecentsList([...arr]);
      listenersAdd.add(cb2);
      return () => { stateListeners.delete(cb); listenersAdd.delete(cb2); };
    }, []);

    function toggleHandle() {
      if (state === 'closed') setDrawerState('peek');
      else if (state === 'peek') setDrawerState('open');
      else setDrawerState('closed');
    }
    function closeAll() { setDrawerState('closed'); }

    function pickFiles() { if (fileRef.current) fileRef.current.click(); }
    function onFiles(e) {
      const files = e.target.files || [];
      let pending = 0; let added = 0;
      Array.from(files).forEach(f => {
        if (!f.type.startsWith('image/')) return;
        pending++;
        const reader = new FileReader();
        reader.onload = (ev) => {
          addToRecents({ src: ev.target.result, kind: 'photo', name: f.name });
          added++;
          if (added === pending) {
            setDrawerState('open');
            activeSection = 'recents'; setSection('recents');
            const toaster = window.__DOCS_R6_PUSH_TOAST || (() => {});
            toaster('Uploaded · ' + added + ' file' + (added === 1 ? '' : 's'));
          }
        };
        reader.readAsDataURL(f);
      });
      if (e.target) e.target.value = '';
    }

    function onDragStart(e, item) {
      try {
        e.dataTransfer.setData('application/x-r6-media', JSON.stringify(item));
        e.dataTransfer.setData('text/plain', item.src || item.label || '');
        e.dataTransfer.effectAllowed = 'copyMove';
      } catch (err) { /* ignore */ }
    }

    function changeSection(next) {
      activeSection = next;
      setSection(next);
      if (state === 'closed' || state === 'peek') setDrawerState('open');
    }

    // For "This doc" / "Other docs" — extract images already in the visible doc
    const thisDocImages = React.useMemo(() => {
      if (state !== 'open') return [];
      const out = [];
      const editable = document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
      if (!editable) return out;
      const photos = editable.querySelectorAll('.r5-photo-canvas, .r5-carousel-slide');
      photos.forEach(p => {
        const bg = window.getComputedStyle(p).backgroundImage;
        const m = bg && bg.match(/url\("?(.+?)"?\)/);
        if (m && m[1]) out.push({ src: m[1], kind: 'photo', source: 'this-doc' });
      });
      return out;
    }, [state, section]);

    return (
      <div
        className={'docs-r6-drawer is-' + state}
        role="region"
        aria-label="Media drawer">
        {/* Handle */}
        <div className="docs-r6-drawer-handle" onClick={toggleHandle}
             title={state === 'open' ? 'Collapse' : (state === 'peek' ? 'Open' : 'Peek')}>
          <span className="docs-r6-drawer-handle-bar" />
        </div>

        {/* Tabs (visible on peek + open) */}
        {state !== 'closed' && (
          <div className="docs-r6-drawer-tabs">
            {[
              { id: 'recents',   label: 'Recents' },
              { id: 'this-doc',  label: 'This doc' },
              { id: 'other-docs',label: 'Other docs' },
              { id: 'library',   label: 'Library' },
              { id: 'brand',     label: 'Brand kit' },
            ].map(t => (
              <span key={t.id}
                className={'docs-r6-drawer-tab' + (section === t.id ? ' is-active' : '')}
                onClick={() => changeSection(t.id)}>
                {t.label}
              </span>
            ))}
            <div className="docs-r6-drawer-actions">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={onFiles}
              />
              <span className="docs-r6-drawer-btn is-primary" onClick={pickFiles}>Upload</span>
              <span className="docs-r6-drawer-btn" onClick={closeAll} title="Close drawer">
                <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
            </div>
          </div>
        )}

        {/* Body — only render when open */}
        {state === 'open' && (
          <div className="docs-r6-drawer-body">
            {section === 'recents' && (
              recentsList.length === 0 ? (
                <div className="docs-r6-empty-state">No recent uploads. Drag images here, or click Upload.</div>
              ) : (
                <div className="docs-r6-drawer-grid">
                  {recentsList.slice().reverse().map((it, i) => (
                    <div
                      key={i}
                      className="docs-r6-thumb"
                      style={{ backgroundImage: 'url("' + it.src + '")' }}
                      draggable
                      onDragStart={(e) => onDragStart(e, it)}
                      title={it.name || 'image'}
                    />
                  ))}
                </div>
              )
            )}

            {section === 'this-doc' && (
              thisDocImages.length === 0 ? (
                <div className="docs-r6-empty-state">No images in this doc yet. Insert a Photo block to get started.</div>
              ) : (
                <div className="docs-r6-drawer-grid">
                  {thisDocImages.map((it, i) => (
                    <div
                      key={i}
                      className="docs-r6-thumb"
                      style={{ backgroundImage: 'url("' + it.src + '")' }}
                      draggable
                      onDragStart={(e) => onDragStart(e, it)}
                    />
                  ))}
                </div>
              )
            )}

            {section === 'other-docs' && (
              <div className="docs-r6-empty-state">Cross-doc media library coming next pass · phase-2</div>
            )}

            {section === 'library' && (
              <div className="docs-r6-empty-state">Library catalog assets · phase-2 (drag from your shipped posts directly into a draft)</div>
            )}

            {section === 'brand' && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 8 }}>Logos</div>
                <div className="docs-r6-drawer-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', marginBottom: 14 }}>
                  {BRAND_KIT.logos.map(l => (
                    <div key={l.id}
                      className="docs-r6-thumb"
                      style={{ aspectRatio: '2 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, fontWeight: 600 }}
                      draggable
                      onDragStart={(e) => onDragStart(e, { kind: 'logo', label: l.label, glyph: l.glyph })}
                      title={l.label}>
                      {l.glyph}
                    </div>
                  ))}
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 8 }}>Colors</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                  {BRAND_KIT.colors.map(c => (
                    <div key={c.id} title={c.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span className="docs-r6-color-swatch"
                        style={{ background: c.val }}
                        draggable
                        onDragStart={(e) => onDragStart(e, { kind: 'color', val: c.val, label: c.label })}
                      />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)' }}>{c.id}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 8 }}>Type</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {BRAND_KIT.fonts.map(f => (
                    <div key={f.id}
                      style={{ padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--surface-2)', cursor: 'grab' }}
                      draggable
                      onDragStart={(e) => onDragStart(e, { kind: 'font', stack: f.stack, label: f.label })}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontFamily: f.stack, fontSize: 18, color: 'var(--fg-primary)' }}>{f.sample}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Mount ──
  function mount() {
    if (!document.body) { requestAnimationFrame(mount); return; }
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
      requestAnimationFrame(mount); return;
    }
    injectCSS();
    let host = document.getElementById('docs-r6-media-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'docs-r6-media-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(<HF_DocsMediaDrawer />);
  }
  mount();

  Object.assign(window, {
    HF_DocsMediaDrawerOpen: () => setDrawerState('open'),
    HF_DocsMediaDrawerClose: () => setDrawerState('closed'),
    HF_DocsMediaDrawerAdd: addToRecents,
    HF_DocsMediaDrawer,
  });
})();
