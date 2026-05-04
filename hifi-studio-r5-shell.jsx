/* global React, window, HfShell, R4GDraftStudioArtifact */
/* hifi-studio-r5-shell.jsx — R5 layout shell for Studio · Docs.

   Composes the outline rail (left) + R5 doc body (center) + R5 Coopr panel
   (right). Owns: panel-collapsed state, focus-mode state, active section
   tracking, scroll-to-section, loading/empty/error early-return.

   Replaces the registry-bound HF_StudioDocFull export with the R5 surface,
   so master.html load order alone determines whether R3 or R5 wins.
*/

const R5S = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function R5S_ML({ children, s = 9.5, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R5S.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...st }}>{children}</span>;
}
function R5S_MM({ children, s = 11, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R5S.mono, fontSize: s, color: c, ...st }}>{children}</span>;
}

const R5S_SECTIONS = [
  { id: 'sec-01', n: '01', label: 'Opening' },
  { id: 'sec-02', n: '02', label: 'Script · 5 beats' },
  { id: 'sec-03', n: '03', label: 'Shot list · 14 shots' },
  { id: 'sec-04', n: '04', label: 'Prep · 5 of 8 done' },
  { id: 'sec-05', n: '05', label: 'Caption' },
  { id: 'sec-06', n: '06', label: 'Notes' },
  { id: 'sec-07', n: '07', label: 'Cards & end screen' },
  { id: 'sec-08', n: '08', label: 'Description copy' },
  { id: 'sec-09', n: '09', label: 'Cross-post · IG carousel' },
  { id: 'sec-10', n: '10', label: 'Cross-post · short' },
];

function R5_DocOutlineRail({ sections, activeId, onJump, words = 0, target = 0, collapsed = false }) {
  if (collapsed) {
    return (
      <div style={{
        width: 48, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '20px 0',
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
      }}>
        {sections.slice(0, 10).map((s) => {
          const active = s.id === activeId;
          return (
            <span
              key={s.id}
              onClick={() => onJump(s.id)}
              style={{
                width: 24, height: 24,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: R5S.mono, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.06em',
                color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                background: active ? 'var(--surface-2)' : 'transparent',
                borderRadius: 3,
                cursor: 'pointer',
                fontVariantNumeric: 'tabular-nums',
              }}
              title={s.label}
            >{s.n}</span>
          );
        })}
      </div>
    );
  }
  const pct = target > 0 ? Math.min(100, Math.round((words / target) * 100)) : 0;
  return (
    <nav style={{
      width: 200, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border-subtle)',
    }}>
      <div style={{ padding: '20px 18px 10px' }}>
        <R5S_ML s={9}>Outline</R5S_ML>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 8px' }}>
        {sections.map((s) => {
          const active = s.id === activeId;
          return (
            <div
              key={s.id}
              onClick={() => onJump(s.id)}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 8,
                padding: '6px 10px',
                borderRadius: 4,
                background: active ? 'var(--surface-2)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <R5S_MM s={9.5} c={active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'} st={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: 18 }}>{s.n}</R5S_MM>
              <span style={{
                fontFamily: R5S.sans, fontSize: 12,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                lineHeight: 1.3,
              }}>{s.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <R5S_MM s={10} c="var(--fg-primary)" st={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{words.toLocaleString()}</R5S_MM>
          <R5S_MM s={9}>/ {target.toLocaleString()}</R5S_MM>
        </div>
        <div style={{ marginTop: 6, height: 2, background: 'var(--border-subtle)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: 'var(--accent-primary)' }} />
        </div>
        <div style={{ marginTop: 4 }}>
          <R5S_ML s={8.5}>Read time · 8 min</R5S_ML>
        </div>
      </div>
    </nav>
  );
}

function R5_DocCrumb({ crumbs = '', right = '', onBack = null, dirty = false, onSave = null }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 24px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
    }}>
      {onBack && (
        <span
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px 2px 4px',
            color: 'var(--fg-secondary)',
            borderRadius: 999,
            cursor: 'pointer',
            fontFamily: R5S.mono, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          title="Back to docs"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="M8 2 L4 6 L8 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Docs
        </span>
      )}
      <R5S_MM s={9.5} c="var(--fg-tertiary)" st={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{crumbs}</R5S_MM>
      <span style={{ flex: 1 }} />
      {dirty && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '2px 9px',
          background: 'var(--accent-soft)',
          borderRadius: 999,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-primary)' }} />
          <span style={{ fontFamily: R5S.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--accent-primary-press)' }}>unsaved</span>
        </span>
      )}
      <R5S_MM s={9.5}>{right}</R5S_MM>
      {dirty && onSave && (
        <span
          onClick={onSave}
          style={{ padding: '3px 10px', background: 'var(--fg-primary)', color: 'var(--surface-1)', borderRadius: 999, fontFamily: R5S.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          title="Save now"
        >Save</span>
      )}
    </div>
  );
}

// ─── Main R5 Studio Doc surface ────────────────────────────

function HF_R5StudioDoc({ state = 'happy' }) {
  const ovr = window.useSurfaceState && window.useSurfaceState('studio', 'Docs');
  const s = (ovr && ovr !== 'happy') ? ovr : state;

  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});

  const [view, setView]                     = React.useState('home');     // 'home' | 'doc'
  const [activeDocId, setActiveDocId]       = React.useState(null);
  const [panelCollapsed, setPanelCollapsed] = React.useState(true);
  const [focusMode, setFocusMode]           = React.useState(false);
  const [activeSectionId, setActiveSection] = React.useState('sec-01');
  const [wordCount, setWordCount]           = React.useState(1842);
  const [dirty, setDirty]                   = React.useState(false);

  function openDoc(id) {
    setActiveDocId(id);
    setView('doc');
    setDirty(false);
    pushToast('Opened · ' + id);
  }
  function backToHome() {
    setView('home');
    setFocusMode(false);
  }
  function fakeSave() {
    setDirty(false);
    pushToast('Saved · autosave on');
  }

  function jumpTo(id) {
    setActiveSection(id);
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el && el.scrollIntoView) {
        try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* ignore */ }
      }
    }
    const sec = R5S_SECTIONS.find(x => x.id === id);
    pushToast('Scroll to · ' + (sec ? sec.label : id));
  }

  if (s === 'loading') {
    return <HfShell workspace="studio" subtab="Docs"><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="studio" subtab="Docs"><window.HF_EmptyHero
      eyebrow="Docs · 0 open"
      title="No doc open. Pick one, or start a new draft."
      caption="Long-form scripts, hook lists, scratch notes — all the words live here."
      ctaLabel="New doc"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="studio" subtab="Docs"><window.HF_ErrorHero
      title="Couldn't load the doc."
      body="The editor stream timed out. Retry, or open from the Studio list instead."
    /></HfShell>;
  }

  const Body  = window.HF_R5DocBody;
  const Panel = window.HF_R5CooprPanel;
  const Home  = window.HF_R5DocsHome;

  if (view === 'home') {
    return (
      <HfShell workspace="studio" subtab="Docs">
        <div data-shell-view="home" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <R5_DocCrumb
            crumbs="Studio › Docs"
            right="7 active · 14 shipped · share"
          />
          {window.R4GDraftStudioArtifact && (
            <div style={{ padding: '10px 18px 0', background: 'var(--surface-1)' }}>
              <R4GDraftStudioArtifact compact onOpenDoc={() => openDoc('launch-ready-read')} />
            </div>
          )}
          {Home
            ? <Home onOpen={openDoc} />
            : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, background: 'var(--surface-1)' }}>
                <R5S_MM s={11}>R5 docs home not loaded · check master.html script order</R5S_MM>
              </div>
            )
          }
        </div>
      </HfShell>
    );
  }

  const docCrumb = activeDocId
    ? 'Studio › Docs › ' + activeDocId.replace(/-/g, ' · ')
    : 'Studio › Docs › Truk Lagoon · ep. 1 hook';

  return (
    <HfShell workspace="studio" subtab="Docs">
      <div data-shell-view="doc" data-active-doc-id={activeDocId || 'none'} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <R5_DocCrumb
          crumbs={docCrumb}
          right={focusMode ? 'focus mode · esc to exit' : (dirty ? 'unsaved · ' + wordCount.toLocaleString() + ' words' : 'autosaved · ' + wordCount.toLocaleString() + ' words')}
          onBack={backToHome}
          dirty={dirty}
          onSave={fakeSave}
        />
        {window.R4GDraftStudioArtifact && (
          <div style={{ padding: '10px 18px 0', background: 'var(--surface-1)' }}>
            <R4GDraftStudioArtifact compact onOpenDoc={() => openDoc(activeDocId || 'launch-ready-read')} />
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          {!focusMode && (
            <R5_DocOutlineRail
              sections={R5S_SECTIONS}
              activeId={activeSectionId}
              onJump={jumpTo}
              words={wordCount}
              target={2400}
              collapsed={false}
            />
          )}

          {Body
            ? <Body focusMode={focusMode} onWordCount={setWordCount} onDirty={setDirty} docId={activeDocId || 'truk-lagoon-ep-1'} onOpenDoc={openDoc} />
            : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, background: 'var(--surface-1)' }}>
                <R5S_MM s={11}>R5 doc body not loaded · check master.html script order</R5S_MM>
              </div>
            )
          }

          {Panel
            ? <Panel
                collapsed={panelCollapsed}
                onToggleCollapsed={() => setPanelCollapsed(v => !v)}
                focusMode={focusMode}
                onToggleFocus={() => setFocusMode(v => !v)}
              />
            : null
          }
        </div>
      </div>
    </HfShell>
  );
}

Object.assign(window, {
  HF_R5StudioDoc,
  HF_StudioDocFull: HF_R5StudioDoc,
  R5_DocOutlineRail, R5_DocCrumb,
});
