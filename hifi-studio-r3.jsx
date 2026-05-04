/* global React, window, HfShell */
/* hifi-studio-r3.jsx — round 3 Studio additions.
   - HF_StudioList     : flat sortable index of every project · "list" view
   - HF_StudioCalendar : project-scoped calendar · drag projects onto dates
   - HF_StudioDocHooks : a doc that's JUST hook drafts — proves shape adapts down
   - HF_StudioDocNotes : a doc that's JUST loose notes — proves shape adapts down
   - HF_StudioDocFull  : the full Truk doc, but with explicit "+ section" affordance
                          and section-handle gutters so the user sees structure is composable
*/

const R = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function R_ML({ children, s = 9.5, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...st }}>{children}</span>;
}
function R_MM({ children, s = 11, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R.mono, fontSize: s, color: c, ...st }}>{children}</span>;
}

// ────────────────────────────────────────────────────────
// STUDIO · LIST VIEW · row helper with B1 drag affordance
// ────────────────────────────────────────────────────────
function StudioListRow({ r, i, dragState, pillarColor, stageColor, onClick, frozenMenuOpen, onMenuOpenChange, pushToast, checked, onToggleSelect, statusTone }) {
  const [hover, setHover] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState({ x: 0, y: 0 });
  const isLifted = dragState === 'lifted';
  const isDimmed = dragState === 'dimmed';
  const showHandle = hover || isLifted;
  const showMenu = menuOpen || frozenMenuOpen;
  const showKebab = hover || showMenu;
  const isSelected = !!checked;
  const baseBg = isSelected
    ? 'var(--accent-soft)'
    : r.flag === 'overdue' ? 'rgba(154, 56, 56, 0.04)' : i % 2 === 1 ? 'var(--surface-1)' : 'transparent';

  function openMenuAt(e) {
    const btn = e.currentTarget.getBoundingClientRect();
    const row = e.currentTarget.closest('.studio-list-row').getBoundingClientRect();
    setMenuPos({ x: btn.right - row.left - 220, y: btn.bottom - row.top + 6 });
    setMenuOpen(true);
    if (onMenuOpenChange) onMenuOpenChange(true);
  }
  function closeMenu() {
    setMenuOpen(false);
    if (onMenuOpenChange) onMenuOpenChange(false);
  }
  const toast = typeof pushToast === 'function' ? pushToast : (() => {});
  const items = [
    { kicker: 'OPN', label: 'Open',      onClick: () => toast('List · Open · ' + r.id) },
    { kicker: 'EDT', label: 'Edit',      onClick: () => toast('List · Edit · ' + r.id) },
    { kicker: 'DUP', label: 'Duplicate', onClick: () => toast('List · Duplicate · ' + r.id) },
    { kicker: 'MOV', label: 'Move to…',  onClick: () => toast('List · Move · ' + r.id) },
    { kicker: 'ARC', label: 'Archive',   onClick: () => toast('List · Archive · ' + r.id) },
    { kicker: 'DEL', label: 'Delete',    onClick: () => toast('List · Delete · ' + r.id), danger: true, divider: true },
  ];

  return (
    <div
      className="studio-list-row"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '14px 28px',
        display: 'grid',
        gridTemplateColumns: '20px 20px 70px 1fr 140px 110px 80px 70px 70px 60px 28px',
        gap: 16,
        borderBottom: '1px solid var(--border-subtle)',
        background: isLifted ? 'var(--surface-1)' : baseBg,
        alignItems: 'center',
        cursor: 'pointer',
        transform: isLifted ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isLifted
          ? '0 12px 22px rgba(15,14,12,0.16), 0 2px 4px rgba(15,14,12,0.10)'
          : 'none',
        opacity: isDimmed ? 0.5 : 1,
        zIndex: showMenu ? 6 : isLifted ? 4 : 'auto',
        transition: isLifted ? 'none' : 'opacity 160ms ease-out, transform 160ms ease-out',
      }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: showHandle ? 1 : 0,
        cursor: 'grab',
      }}>
        <window.DragHandle size={12} color="var(--fg-tertiary)" shadow="" />
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
        {window.HF_Checkbox && (
          <window.HF_Checkbox
            checked={isSelected}
            onChange={() => onToggleSelect && onToggleSelect(r.id)}
            size={14}
            ariaLabel={'Select project ' + r.id}
          />
        )}
      </span>
      <R_MM s={11} c="var(--fg-secondary)" st={{ fontWeight: 600 }}>{r.id}</R_MM>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: R.serif, fontSize: 16, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{r.title}</span>
          {r.flag && (
            <span style={{ fontFamily: R.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: r.flag === 'overdue' ? 'var(--tone-warning)' : 'var(--tone-success)',
              padding: '2px 6px', borderRadius: 3, border: `1px solid ${r.flag === 'overdue' ? 'var(--tone-warning)' : 'var(--tone-success)'}` }}>{r.flag}</span>
          )}
        </div>
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 8px',
        borderRadius: 999,
        background: (statusTone && statusTone.bg) || 'transparent',
        border: '1px solid ' + ((statusTone && statusTone.fg) || stageColor[r.stage]),
        fontFamily: R.sans, fontSize: 11, color: (statusTone && statusTone.fg) || stageColor[r.stage], fontWeight: 600,
        letterSpacing: '-0.005em',
        width: 'fit-content',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: (statusTone && statusTone.fg) || stageColor[r.stage] }} />
        {r.stage}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: pillarColor[r.pillar] }} />
        <R_MM s={11} c="var(--fg-secondary)" st={{ textTransform: 'lowercase' }}>{r.pillar}</R_MM>
      </span>
      <R_MM s={11} c={r.due === 'today' ? 'var(--tone-warning)' : 'var(--fg-secondary)'} st={{ textAlign: 'right', fontWeight: r.due === 'today' ? 600 : 400 }}>{r.due}</R_MM>
      <R_MM s={11} c="var(--fg-tertiary)" st={{ textAlign: 'right' }}>{r.upd}</R_MM>
      <R_MM s={11} c="var(--fg-secondary)" st={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.words.toLocaleString()}</R_MM>
      <R_MM s={11} c="var(--fg-tertiary)" st={{ textAlign: 'right' }}>{r.attach}</R_MM>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', opacity: showKebab ? 1 : 0, transition: 'opacity 160ms ease-out' }}>
        <window.HF_KebabHandle tone="ink" visible onClick={openMenuAt} />
      </span>
      {showMenu && (
        <div onClick={(e) => e.stopPropagation()}>
          <window.HF_ContextMenu
            x={frozenMenuOpen ? 920 : menuPos.x}
            y={frozenMenuOpen ? 40 : menuPos.y}
            items={items}
            frozen={frozenMenuOpen}
            onClose={closeMenu}
          />
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// STUDIO · LIST VIEW
// ────────────────────────────────────────────────────────
function HF_StudioList({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('studio', 'List');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  // E2 · click coverage. Rows toast — project-detail surface isn't built.
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  if (s === 'loading') {
    return <HfShell workspace="studio" subtab="List"><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="studio" subtab="List"><window.HF_EmptyHero
      eyebrow="List · 0 projects"
      title="Nothing to sort yet. Start a doc and it shows up here."
      caption="Sortable table view of every project · status, due, pillar, words."
      ctaLabel="New project"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="studio" subtab="List"><window.HF_ErrorHero
      title="Couldn't load the project list."
      body="The project index timed out. Retry, or refresh the session."
    /></HfShell>;
  }
  // 21 rows · varied status / pillar / channel / due date so the table earns its h=1800 vert.
  const rows = [
    // ── Overdue (3) ────────────────────────────────
    { id: 'd011', title: 'Replacement opener for 0041',         stage: 'Rewrite',      status: 'awaiting media', pillar: 'safety', channel: 'yt', due: 'today',  upd: '38m', words: 612,  attach: '—',     flag: 'overdue', bucket: 'overdue' },
    { id: 'd024', title: 'Brand brief · Sealab capsule recap',  stage: 'Voice pass',   status: 'drafting',       pillar: 'gear',   channel: 'ig', due: 'Apr 22', upd: '2d',  words: 488,  attach: '5 imgs', flag: 'overdue', bucket: 'overdue' },
    { id: 'd023', title: 'Q&A · trimix at recreational depths', stage: 'Outline',      status: 'awaiting media', pillar: 'reply',  channel: 'yt', due: 'Apr 21', upd: '3d',  words: 290,  attach: '—',     flag: 'overdue', bucket: 'overdue' },
    // ── This week (10) ─────────────────────────────
    { id: 'd012', title: 'Fiji wreck series · ep. 1 hook',      stage: 'Hook',         status: 'drafting',       pillar: 'story',  channel: 'yt', due: 'Apr 25', upd: '12m', words: 1412, attach: '3 imgs', bucket: 'thisweek' },
    { id: 'd010', title: 'Three-frame carousel from 0042',      stage: 'Hook',         status: 'drafting',       pillar: 'story',  channel: 'ig', due: 'Apr 24', upd: '1h',  words: 188,  attach: '4 stills', bucket: 'thisweek' },
    { id: 'd009', title: 'Reply ideas for @marina.k',           stage: 'Voice pass',   status: 'drafting',       pillar: 'reply',  channel: 'ig', due: 'Apr 26', upd: '2h',  words: 340,  attach: '—', bucket: 'thisweek' },
    { id: '0046', title: 'Three things I check (short)',        stage: 'Ship-ready',   status: 'scheduled',      pillar: 'safety', channel: 'ig', due: 'Apr 25', upd: '1d',  words: 940,  attach: '1 cut', flag: 'scheduled', bucket: 'thisweek' },
    { id: 'd014', title: 'Cold-open recut · trim 8s of room',   stage: 'Rewrite',      status: 'drafting',       pillar: 'story',  channel: 'tt', due: 'Apr 27', upd: '40m', words: 220,  attach: '2 cuts', bucket: 'thisweek' },
    { id: 'd015', title: 'Pre-dive checklist · long version',   stage: 'Voice pass',   status: 'drafting',       pillar: 'safety', channel: 'yt', due: 'Apr 26', upd: '3h',  words: 1840, attach: '—',  bucket: 'thisweek' },
    { id: 'd016', title: 'Buoyancy drill · 30s social cut',     stage: 'Hook',         status: 'awaiting media', pillar: 'safety', channel: 'tt', due: 'Apr 27', upd: '5h',  words: 92,   attach: '1 clip', bucket: 'thisweek' },
    { id: 'd017', title: 'Reg first-stage teardown · ep.2',     stage: 'Outline',      status: 'outlining',      pillar: 'gear',   channel: 'yt', due: 'Apr 28', upd: '6h',  words: 720,  attach: '8 clips', bucket: 'thisweek' },
    { id: 'd018', title: 'Newsletter · Truk Lagoon recap',      stage: 'Voice pass',   status: 'drafting',       pillar: 'story',  channel: 'th', due: 'Apr 26', upd: '7h',  words: 1110, attach: '6 imgs', bucket: 'thisweek' },
    { id: 'd019', title: 'Reply · doubles vs sidemount',        stage: 'Hook',         status: 'drafting',       pillar: 'reply',  channel: 'yt', due: 'Apr 27', upd: '8h',  words: 410,  attach: '—',  bucket: 'thisweek' },
    { id: '0048', title: 'Carousel · cave-line drills',         stage: 'Ship-ready',   status: 'published',      pillar: 'safety', channel: 'ig', due: 'Apr 24', upd: '1d',  words: 240,  attach: '5 stills', flag: 'published', bucket: 'thisweek' },
    // ── Later (8) ──────────────────────────────────
    { id: 'd008', title: 'Reg-first-stage gear teardown 2',     stage: 'Outline',      status: 'outlining',      pillar: 'gear',   channel: 'yt', due: 'May 1',  upd: '4h',  words: 820,  attach: '8 clips', bucket: 'later' },
    { id: 'd007', title: 'Komodo cold-open · alt cut',          stage: 'Outline',      status: 'outlining',      pillar: 'story',  channel: 'yt', due: 'May 8',  upd: '1d',  words: 410,  attach: '2 stills', bucket: 'later' },
    { id: 'd020', title: 'Long-form · why I switched to CCR',   stage: 'Outline',      status: 'outlining',      pillar: 'gear',   channel: 'yt', due: 'May 12', upd: '2d',  words: 1480, attach: '4 stills', bucket: 'later' },
    { id: 'd021', title: 'Carousel · 6 instructor mistakes',    stage: 'Spark',        status: 'drafting',       pillar: 'safety', channel: 'ig', due: 'May 5',  upd: '2d',  words: 280,  attach: '—',  bucket: 'later' },
    { id: 'd006', title: 'Q&A · doubles vs sidemount',          stage: 'Spark',        status: 'drafting',       pillar: 'reply',  channel: 'yt', due: '—',      upd: '4d',  words: 60,   attach: '—',  bucket: 'later' },
    { id: 'd005', title: 'Why I retired my old BCD',            stage: 'Spark',        status: 'drafting',       pillar: 'gear',   channel: 'yt', due: '—',      upd: '1w',  words: 120,  attach: '—',  bucket: 'later' },
    { id: 'd022', title: 'Photo essay · Lembeh muck stills',    stage: 'Spark',        status: 'drafting',       pillar: 'story',  channel: 'ig', due: '—',      upd: '1w',  words: 80,   attach: '12 stills', bucket: 'later' },
    { id: 'd003', title: 'Carousel · 5 instructor mistakes',    stage: 'Spark',        status: 'drafting',       pillar: 'safety', channel: 'ig', due: '—',      upd: '2d',  words: 280,  attach: '—',  bucket: 'later' },
  ];
  const pillarColor = { safety: 'var(--accent-primary)', gear: 'var(--tone-info)', story: 'var(--tone-success)', reply: 'var(--tone-warning)' };
  const stageColor  = { Spark: 'var(--fg-tertiary)', Outline: 'var(--tone-info)', Hook: 'var(--accent-primary-press)', 'Voice pass': 'var(--tone-warning)', Rewrite: 'var(--accent-primary)', 'Ship-ready': 'var(--tone-success)' };
  // 5 inline status pills: drafting / awaiting media / scheduled / published / overdue
  const statusTones = {
    'drafting':       { bg: 'var(--surface-2)',       fg: 'var(--fg-secondary)' },
    'outlining':      { bg: 'var(--surface-2)',       fg: 'var(--fg-tertiary)' },
    'awaiting media': { bg: 'var(--tone-warning-bg)', fg: 'var(--tone-warning)' },
    'voice pass':     { bg: 'var(--accent-soft)',     fg: 'var(--accent-primary-press)' },
    'scheduled':      { bg: 'var(--tone-info-bg)',    fg: 'var(--tone-info)' },
    'published':      { bg: 'var(--tone-success-bg)', fg: 'var(--tone-success)' },
    'overdue':        { bg: 'rgba(154,56,56,0.10)',   fg: 'var(--tone-warning)' },
  };

  // Bulk-select state — pre-select 3 rows so the action bar is visible in layout view.
  const [selected, setSelected] = React.useState(() => new Set(['d011', 'd024', 'd012']));
  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // Sort affordance — local visual state, no actual sort (this is a happy-state demo).
  const [sortKey, setSortKey] = React.useState('upd');
  const [sortDir, setSortDir] = React.useState('desc');
  function bumpSort(k) {
    if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(k); setSortDir('desc'); }
  }

  const totalWords = rows.reduce((s, r) => s + r.words, 0);
  const dueThisWk = rows.filter(r => r.bucket === 'thisweek').length;
  const overdue = rows.filter(r => r.flag === 'overdue').length;
  const FreshPill = window.FreshnessPill;

  return (
    <HfShell workspace="studio" subtab="List" subtabRight={
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>{rows.length} active · {dueThisWk} due this week</span>
        {FreshPill && <FreshPill at="12m ago" state="fresh" />}
      </div>
    }>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)' }}>
        {/* Editorial header band */}
        <div style={{ padding: '20px 28px 14px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Studio · List · Wed Apr 24</span>
            <span style={{ fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Sorted · last touched</span>
          </div>
          <h1 style={{ margin: 0, marginBottom: 4, fontFamily: R.serif, fontSize: 28, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.1 }}>
            Every project, <span style={{ fontStyle: 'italic' }}>flat.</span>
          </h1>
          <p style={{ margin: 0, fontFamily: R.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 720, lineHeight: 1.45 }}>
            One row per doc — sort, scan, triage. Pipeline lives in Workspace; this is the index.
          </p>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          {[
            ['Active',     rows.length, 'docs'],
            ['Words',      (totalWords/1000).toFixed(1) + 'k', 'total'],
            ['Due this wk', dueThisWk,  'projects'],
            ['Overdue',    overdue,    overdue ? 'needs attention' : 'clear'],
            ['Last touched', '12m', 'd012'],
          ].map(([k, v, sub], i) => (
            <div key={k} style={{ padding: '12px 18px', borderRight: i < 4 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: R.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{k}</span>
              <span style={{ fontFamily: R.serif, fontSize: 22, fontWeight: 500, color: k === 'Overdue' && overdue ? 'var(--tone-warning)' : 'var(--fg-primary)', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>{v}</span>
              <span style={{ fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{sub}</span>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div style={{ padding: '14px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-1)' }}>
          {[
            ['all',     true],
            ['safety',  false],
            ['gear',    false],
            ['story',   false],
            ['reply',   false],
            ['—',       null],
            ['this week', false],
            ['cold',    false],
            ['overdue', false],
          ].map(([t, sel], i) => t === '—' ? (
            <span key={i} style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
          ) : (
            <span key={t} style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: sel ? 'var(--surface-ink)' : 'transparent',
              color: sel ? 'var(--fg-on-ink)' : 'var(--fg-secondary)',
              border: sel ? 'none' : '1px solid var(--border-default)',
              fontFamily: R.sans, fontSize: 11.5, fontWeight: 500,
            }}>{t}</span>
          ))}
          <span style={{ flex: 1 }} />
          <R_MM s={11}>10 results · 4.2k words total</R_MM>
        </div>

        {/* Header — sortable columns. Active key shows arrow indicator. */}
        <div style={{ padding: '12px 28px 8px', display: 'grid', gridTemplateColumns: '20px 20px 70px 1fr 140px 110px 80px 70px 70px 60px 28px', gap: 16, borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <span />
          <span />
          {[
            ['ID',      'id',     'left'],
            ['Project', 'title',  'left'],
            ['Stage',   'stage',  'left'],
            ['Pillar',  'pillar', 'left'],
            ['Due',     'due',    'right'],
            ['Updated', 'upd',    'right'],
            ['Words',   'words',  'right'],
            ['Files',   'attach', 'right'],
          ].map(([h, k, align]) => {
            const active = sortKey === k;
            return (
              <span
                key={k}
                onClick={() => bumpSort(k)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
                  cursor: 'pointer',
                  fontFamily: R.sans, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                }}>
                {h}
                {active && (
                  <svg width="8" height="8" viewBox="0 0 8 8" style={{ transform: sortDir === 'asc' ? 'rotate(180deg)' : 'none' }}>
                    <path d="M1 2.6 L4 5.6 L7 2.6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            );
          })}
          <span />
        </div>

        {/*
         * Rows · grouped by due bucket (Overdue / This week / Later).
         * B1 drag-affordance + B3 frozen-menu preserved on the first
         * "this week" row so neither affordance is hidden in a collapsed
         * group. Each band is a mono-uppercase eyebrow + inline count.
         */}
        {(() => {
          const groups = [
            { id: 'overdue',  label: 'Overdue · address today',         tone: 'var(--tone-warning)',   bucket: 'overdue'  },
            { id: 'thisweek', label: 'This week · ship by Sunday',      tone: 'var(--accent-primary)', bucket: 'thisweek' },
            { id: 'later',    label: 'Later · backlog & sparks',        tone: 'var(--fg-tertiary)',    bucket: 'later'    },
          ];
          // Tag B1 lifted index relative to the FIRST row of "thisweek" so
          // the drag demo lives in a stable cluster regardless of overdue
          // count. Frozen menu pins to the third "thisweek" row.
          const thisWeekStart = rows.findIndex(r => r.bucket === 'thisweek');
          const liftedIdx     = thisWeekStart + 0;     // first thisweek row
          const dropAfterIdx  = thisWeekStart + 1;     // drop line after second thisweek row
          const frozenMenuIdx = thisWeekStart + 3;     // frozen menu on fourth thisweek row

          return groups.map(g => {
            const groupRows = rows
              .map((r, i) => ({ r, i }))
              .filter(({ r }) => r.bucket === g.bucket);
            if (!groupRows.length) return null;
            const groupWords = groupRows.reduce((s, x) => s + x.r.words, 0);
            return (
              <React.Fragment key={g.id}>
                {/* Group band — mono-uppercase eyebrow, ledger style */}
                <div style={{
                  padding: '14px 28px 10px',
                  background: 'var(--surface-1)',
                  borderTop: '1px solid var(--fg-primary)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: '20px 20px 70px 1fr auto',
                  gap: 16,
                  alignItems: 'center',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: g.tone, justifySelf: 'center' }} />
                  <span />
                  <R_ML s={9.5} c={g.tone} st={{ letterSpacing: '0.16em' }}>
                    {g.bucket.toUpperCase()}
                  </R_ML>
                  <span style={{ fontFamily: R.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', letterSpacing: '-0.005em' }}>
                    {g.label}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                    <R_MM s={10.5} c="var(--fg-tertiary)">{groupRows.length} {groupRows.length === 1 ? 'project' : 'projects'}</R_MM>
                    <span style={{ width: 1, height: 12, background: 'var(--border-subtle)' }} />
                    <R_MM s={10.5} c="var(--fg-tertiary)">{groupWords.toLocaleString()} words</R_MM>
                  </span>
                </div>
                {groupRows.map(({ r, i }) => {
                  let dragState = 'idle';
                  if (i === liftedIdx) dragState = 'lifted';
                  else if (i === liftedIdx - 1 || i === liftedIdx + 1) dragState = 'dimmed';
                  const tone = statusTones[r.status] || statusTones['drafting'];
                  return (
                    <React.Fragment key={r.id}>
                      <StudioListRow
                        r={r}
                        i={i}
                        dragState={dragState}
                        pillarColor={pillarColor}
                        stageColor={stageColor}
                        statusTone={tone}
                        onClick={() => pushToast('Open project · ' + r.id)}
                        frozenMenuOpen={i === frozenMenuIdx}
                        pushToast={pushToast}
                        checked={selected.has(r.id)}
                        onToggleSelect={toggleSelect}
                      />
                      {i === dropAfterIdx && (
                        <window.DropMarker flavor="line" label="Drop here" />
                      )}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          });
        })()}

        {/* Closing ledger band — what the table sums to. Editorial summary. */}
        <div style={{
          padding: '18px 28px 28px',
          borderTop: '6px double var(--fg-primary)',
          background: 'var(--surface-1)',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: 28,
          alignItems: 'baseline',
        }}>
          <div>
            <R_ML s={9}>Sheet total</R_ML>
            <div style={{ marginTop: 4, fontFamily: R.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>
              {rows.length} active projects, {(totalWords / 1000).toFixed(1)}k words on file.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <R_ML s={9}>Overdue</R_ML>
            <span style={{ fontFamily: R.serif, fontSize: 22, fontWeight: 500, color: overdue ? 'var(--tone-warning)' : 'var(--fg-primary)', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>{overdue}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <R_ML s={9}>This week</R_ML>
            <span style={{ fontFamily: R.serif, fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>{dueThisWk}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <R_ML s={9}>Later</R_ML>
            <span style={{ fontFamily: R.serif, fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>{rows.length - overdue - dueThisWk}</span>
          </div>
        </div>

      </div>

      {/* B2 · multi-select action bar — visible whenever ≥1 row is checked. */}
      {window.MultiSelectActionBar && (
        <window.MultiSelectActionBar
          count={selected.size}
          noun={selected.size === 1 ? 'project' : 'projects'}
          onClear={() => setSelected(new Set())}
          actions={[
            { label: 'Move to…',   onClick: () => pushToast('Move ' + selected.size + ' projects'), variant: 'ghost', menu: true },
            { label: 'Set due',    onClick: () => pushToast('Set due · ' + selected.size + ' projects'), variant: 'ghost', menu: true },
            { label: 'Archive',    onClick: () => pushToast('Archive ' + selected.size + ' projects'), variant: 'ghost' },
            { label: 'Schedule',   onClick: () => pushToast('Schedule ' + selected.size + ' projects'), variant: 'primary' },
          ]}
        />
      )}
    </HfShell>
  );
}

// ────────────────────────────────────────────────────────
// STUDIO · CALENDAR (project-scoped, by due date)
// ────────────────────────────────────────────────────────
function HF_StudioCalendar({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('studio', 'Calendar');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  // E2 · click coverage. Deadline cards toast for the slot-edit modal that
  // F1 will register; empty days toast their drop-target intent.
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  if (s === 'loading') {
    return <HfShell workspace="studio" subtab="Calendar"><window.HF_SkeletonHero shape="calendar-week" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="studio" subtab="Calendar"><window.HF_EmptyHero
      eyebrow="Calendar · 0 due dates"
      title="No project deadlines yet. Set one in any doc."
      caption="Per-project due dates land here — distinct from the cross-platform post schedule."
      ctaLabel="New project"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="studio" subtab="Calendar"><window.HF_ErrorHero
      title="Couldn't load the project calendar."
      body="The deadline index timed out. Retry, or refresh the session."
    /></HfShell>;
  }
  const days = ['Mon · 22', 'Tue · 23', 'Wed · 24', 'Thu · 25', 'Fri · 26', 'Sat · 27', 'Sun · 28'];
  // Each day shows due-projects (Studio · what's owed)
  const dueByDay = {
    'Mon · 22': [],
    'Tue · 23': [{ id: 'd010', t: 'Three-frame carousel · 0042', stage: 'Hook', pillar: 'story' }],
    'Wed · 24': [{ id: 'd012', t: 'Fiji wreck · ep. 1 hook',       stage: 'Hook', pillar: 'story' }],
    'Thu · 25': [
      { id: 'd011', t: 'Replacement opener · 0041', stage: 'Rewrite',  pillar: 'safety', flag: 'overdue' },
      { id: '0046', t: 'Three things I check (short)', stage: 'Ship-ready', pillar: 'safety' },
    ],
    'Fri · 26': [{ id: 'd009', t: 'Reply ideas for @marina.k', stage: 'Voice pass', pillar: 'reply' }],
    'Sat · 27': [],
    'Sun · 28': [],
  };
  const pillarColor = { safety: 'var(--accent-primary)', gear: 'var(--tone-info)', story: 'var(--tone-success)', reply: 'var(--tone-warning)' };

  const totalDue = Object.values(dueByDay).reduce((s, arr) => s + arr.length, 0);
  const overdue = Object.values(dueByDay).flat().filter(p => p.flag === 'overdue').length;
  const FreshPill = window.FreshnessPill;

  return (
    <HfShell workspace="studio" subtab="Calendar" subtabRight={
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>{totalDue} due · {overdue} overdue</span>
        {FreshPill && <FreshPill at="just now" state="fresh" />}
      </div>
    }>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
        {/* Editorial header band */}
        <div style={{ padding: '20px 28px 14px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Studio · Calendar · Wk 17</span>
            <span style={{ fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>‹ Prev · This week · Next ›</span>
          </div>
          <h1 style={{ margin: 0, marginBottom: 4, fontFamily: R.serif, fontSize: 28, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.1 }}>
            Studio · week of <span style={{ fontStyle: 'italic' }}>Apr 22.</span>
          </h1>
          <p style={{ margin: 0, fontFamily: R.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 720, lineHeight: 1.45 }}>
            Project due-dates only. Drag a card to reschedule — for cross-platform post slots, open Calendar in the topbar.
          </p>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          {[
            ['Due this wk', totalDue, 'projects'],
            ['Overdue',      overdue, overdue ? 'today' : 'clear'],
            ['Today',        (dueByDay['Wed · 24'] || []).length, 'Apr 24'],
            ['Empty days',   Object.values(dueByDay).filter(a => a.length === 0).length, 'open slots'],
          ].map(([k, v, sub], i) => (
            <div key={k} style={{ padding: '12px 18px', borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: R.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{k}</span>
              <span style={{ fontFamily: R.serif, fontSize: 22, fontWeight: 500, color: k === 'Overdue' && overdue ? 'var(--tone-warning)' : 'var(--fg-primary)', letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>{v}</span>
              <span style={{ fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{sub}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--border-subtle)' }}>
          {days.map((d, di) => (
            <div key={d} style={{ background: di === 2 ? 'var(--accent-soft)' : 'var(--surface-1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <R_MM s={10} c={di === 2 ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'} st={{ fontWeight: 600 }}>{d.split(' · ')[0]}</R_MM>
                <span style={{ fontFamily: R.serif, fontSize: 18, color: 'var(--fg-primary)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{d.split(' · ')[1]}</span>
                <R_MM s={9.5} c="var(--fg-tertiary)" st={{ marginLeft: 4 }}>{(dueByDay[d] || []).length}</R_MM>
                {di === 2 && <span style={{ marginLeft: 'auto', fontFamily: R.mono, fontSize: 9, color: 'var(--accent-primary-press)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>today</span>}
              </div>
              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 360 }}>
                {(dueByDay[d] || []).map((p, i) => (
                  <div
                    key={i}
                    onClick={() => pushToast('Edit deadline · ' + d + ' · ' + p.id)}
                    style={{
                    padding: 10,
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: `3px solid ${pillarColor[p.pillar]}`,
                    borderRadius: 6,
                    display: 'flex', flexDirection: 'column', gap: 4,
                    boxShadow: p.flag === 'overdue' ? 'inset 0 0 0 1px var(--tone-warning), 0 1px 3px rgba(26,24,21,0.06)' : '0 1px 3px rgba(26,24,21,0.06)',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <R_MM s={9.5} c="var(--fg-secondary)" st={{ fontWeight: 600 }}>{p.id}</R_MM>
                      {p.flag && <span style={{ fontFamily: R.mono, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--tone-warning)' }}>· {p.flag}</span>}
                    </div>
                    <span style={{ fontFamily: R.serif, fontSize: 13.5, color: 'var(--fg-primary)', fontWeight: 500, lineHeight: 1.3 }}>{p.t}</span>
                    <R_MM s={9.5} c="var(--fg-tertiary)">{p.stage}</R_MM>
                  </div>
                ))}
                {(dueByDay[d] || []).length === 0 && (
                  <div
                    onClick={() => pushToast('Schedule project · ' + d)}
                    style={{ padding: '20px 8px', border: '1px dashed var(--border-default)', borderRadius: 6, fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)', textAlign: 'center', cursor: 'pointer' }}>
                    drop a project
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 28px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <R_MM s={11} c="var(--fg-tertiary)">
            this is studio · project due-dates only. for cross-platform post scheduling open <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Calendar</span> in the topbar.
          </R_MM>
        </div>
      </div>
    </HfShell>
  );
}

// ────────────────────────────────────────────────────────
// STUDIO · DOC SHELL (round 3, with section gutters + add)
// ────────────────────────────────────────────────────────
function R_DocCrumb({ crumbs, right = 'autosaved · share' }) {
  return (
    <div style={{ height: 38, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
      <R_ML s={9.5}>{crumbs}</R_ML>
      <span style={{ flex: 1 }} />
      <R_MM s={10}>{right}</R_MM>
    </div>
  );
}

function R_AddSection() {
  return (
    <div style={{ marginTop: 28, padding: '12px 16px', borderTop: '1px dashed var(--border-default)', display: 'flex', alignItems: 'center', gap: 12, maxWidth: 720 }}>
      <span style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-tertiary)', fontFamily: R.mono, fontSize: 13 }}>+</span>
      <span style={{ fontFamily: R.sans, fontSize: 13, color: 'var(--fg-tertiary)' }}>Add a section · or type <R_MM s={11} c="var(--accent-primary)">/</R_MM> for blocks</span>
      <span style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 4 }}>
        {['hooks', 'script', 'shots', 'prep', 'caption', 'notes'].map(t => (
          <span key={t} style={{ padding: '3px 8px', border: '1px solid var(--border-subtle)', borderRadius: 999, fontFamily: R.mono, fontSize: 9.5, color: 'var(--fg-secondary)' }}>+ {t}</span>
        ))}
      </div>
    </div>
  );
}

function R_SectionHandle({ n, label, status }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
      <span style={{ width: 24, fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)', textAlign: 'right', flexShrink: 0 }}>·{n}·</span>
      <R_ML s={10}>{label}</R_ML>
      {status && <R_MM s={9.5} c="var(--fg-tertiary)">· {status}</R_MM>}
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: R.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>⋮</span>
    </div>
  );
}

function R_SideChat({ messages = [], suggestions = [] }) {
  return (
    <div style={{ width: 320, borderLeft: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="var(--fg-on-accent)" /></svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontFamily: R.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>Coopr</span>
          <R_MM s={9}>scoped to this doc</R_MM>
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, color: 'var(--fg-tertiary)', cursor: 'pointer' }} role="button" aria-label="Close">
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '14px 12px 6px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {m.from === 'coopr' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 2 }}>
                  <R_ML s={9}>Coopr</R_ML>
                  <R_MM s={9}>· {m.time}</R_MM>
                </div>
                <div style={{ padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 10, borderTopLeftRadius: 3, maxWidth: '96%', fontFamily: R.sans, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-primary)' }}>
                  {m.text}
                </div>
                {m.actions && m.actions.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4, paddingLeft: 2 }}>
                    {m.actions.map((a, j) => (
                      <span key={j} style={{ padding: '4px 10px', background: j === 0 ? 'var(--accent-primary)' : 'transparent', border: j === 0 ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)', borderRadius: 999, fontFamily: R.sans, fontSize: 11, fontWeight: 600, color: j === 0 ? 'var(--fg-on-accent)' : 'var(--fg-secondary)' }}>{a}</span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ alignSelf: 'flex-end', maxWidth: '85%', padding: '8px 12px', background: 'var(--surface-3)', borderRadius: 10, borderTopRightRadius: 3, fontFamily: R.sans, fontSize: 12.5, color: 'var(--fg-primary)' }}>{m.text}</div>
            )}
          </div>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div style={{ padding: '6px 10px 4px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {suggestions.map((s, i) => (
            <span key={i} style={{ padding: '3px 9px', border: '1px solid var(--border-subtle)', borderRadius: 999, background: 'var(--surface-1)' }}>
              <R_MM s={9.5} c="var(--fg-secondary)">{s}</R_MM>
            </span>
          ))}
        </div>
      )}
      <div style={{ padding: 10 }}>
        <div style={{ padding: '10px 12px', background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 10 }}>
          <span style={{ fontFamily: R.sans, fontSize: 12.5, color: 'var(--fg-tertiary)' }}>Ask about this doc, or /opener, /script…</span>
        </div>
      </div>
    </div>
  );
}

// ── A doc that's JUST hooks ──────────────────────────────
function HF_StudioDocHooks() {
  return (
    <HfShell workspace="studio" subtab="Docs">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <R_DocCrumb crumbs="Studio › Docs › Carousel · 5 instructor mistakes" right="autosaved · just notes shape" />
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '40px 96px 60px 60px', background: 'var(--surface-1)' }}>
            <R_MM s={11} st={{ fontVariantNumeric: 'tabular-nums' }}>Apr 24 · sketching · 7 candidates</R_MM>
            <div style={{ marginTop: 4 }}>
              <span style={{ fontFamily: R.serif, fontSize: 56, fontWeight: 400, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>Five instructor </span>
              <span style={{ fontFamily: R.serif, fontSize: 56, fontWeight: 400, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>mistakes</span>
            </div>

            <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'baseline', gap: 8, padding: '4px 12px', border: '1px solid var(--border-default)', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-primary)', alignSelf: 'center' }} />
              <span style={{ fontFamily: R.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>Just hooks.</span>
              <R_MM s={10} c="var(--fg-tertiary)">no script · no shot list</R_MM>
            </div>

            {/* Agent presence — Coopr lives in this doc too */}
            <R_DocAgentPresence activity="Tightened hook 3 — kept the picks alone" when="6m ago" />

            <div style={{ marginTop: 30, maxWidth: 720 }}>
              <R_SectionHandle n="01" label="Hooks · 7 drafts" status="2 picked" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { t: 0.9, h: "I almost killed a student last spring. It was the third mistake — not the first — that nearly did it.", k: 'pick' },
                  { t: 1.1, h: "The most dangerous instructor on a dive boat is the one who's never had a close call.", k: 'pick' },
                  { t: 1.4, h: "Five mistakes I made in my first year teaching, ranked by how close they came to consequences.", k: '', tightened: true },
                  { t: 0.8, h: "Your instructor is lying to you about something. Here's how to catch them.", k: '' },
                  { t: 1.6, h: "There's a checklist most instructors stopped doing in 2008. The PADI numbers say the rest of us should bring it back.", k: 'cut' },
                  { t: 1.2, h: "I've taught 600 students. Five of them almost didn't come back up. Here's what I missed.", k: '' },
                  { t: 1.0, h: "If your instructor doesn't ask one specific question before the giant stride, get out of the water.", k: '' },
                ].map((x, i) => (
                  <div key={i} style={{
                    padding: '12px 14px',
                    background: x.k === 'pick' ? 'var(--accent-soft)' : 'var(--surface-1)',
                    border: x.k === 'pick' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    display: x.tightened ? 'flex' : 'grid',
                    flexDirection: x.tightened ? 'column' : undefined,
                    gridTemplateColumns: x.tightened ? undefined : '60px 1fr 50px',
                    gap: x.tightened ? 0 : 14,
                    alignItems: 'baseline',
                    opacity: x.k === 'cut' ? 0.45 : 1,
                  }}>
                    {x.tightened ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 50px', gap: 14, alignItems: 'baseline' }}>
                          <R_MM s={11} c="var(--accent-primary-press)" st={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{x.t}s</R_MM>
                          <span style={{ fontFamily: R.serif, fontStyle: 'italic', fontSize: 15.5, color: 'var(--fg-primary)', lineHeight: 1.55 }}>{x.h}</span>
                          <R_MM s={9.5} c="var(--fg-tertiary)" st={{ textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>—</R_MM>
                        </div>
                        <R_AgentRewrite
                          before="Five mistakes I made in my first year teaching, ranked by how close they came to consequences."
                          after="Five mistakes from my first year. Ranked by how close they came."
                          tag="Tightened by Coopr · -8 words"
                          when="6m ago"
                        />
                      </>
                    ) : (
                      <>
                        <R_MM s={11} c="var(--accent-primary-press)" st={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{x.t}s</R_MM>
                        <span style={{ fontFamily: R.serif, fontStyle: 'italic', fontSize: 15.5, color: 'var(--fg-primary)', lineHeight: 1.55, textDecoration: x.k === 'cut' ? 'line-through' : 'none' }}>{x.h}</span>
                        <R_MM s={9.5} c={x.k === 'pick' ? 'var(--accent-primary)' : 'var(--fg-tertiary)'} st={{ textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{x.k || '—'}</R_MM>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <R_AddSection />
            </div>
          </div>
        </div>
        <R_SideChat
          messages={[
            { from: 'coopr', time: '11:02 am', text: "Doc started as just a hook brainstorm — that's fine. When you're ready I can stretch the two picks into a full script + shot list, or leave it as scratch." },
            { from: 'you', text: 'leave it. I want to live with these for a day' },
            { from: 'coopr', time: '11:03 am', text: "Got it. Will check back tomorrow morning.", actions: [] },
          ]}
          suggestions={['/script from picks', '/list from picks', '+ stretch to project']}
        />
      </div>
    </HfShell>
  );
}

// ── A doc that's JUST loose notes ────────────────────────
function HF_StudioDocNotes() {
  return (
    <HfShell workspace="studio" subtab="Docs">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <R_DocCrumb crumbs="Studio › Docs › La Jolla scout · loose" right="autosaved · just notes shape" />
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '40px 96px 60px 60px', background: 'var(--surface-1)' }}>
            <R_MM s={11} st={{ fontVariantNumeric: 'tabular-nums' }}>La Jolla · Apr 24 · scouting</R_MM>
            <div style={{ marginTop: 4 }}>
              <span style={{ fontFamily: R.serif, fontSize: 52, fontWeight: 400, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>La Jolla </span>
              <span style={{ fontFamily: R.serif, fontSize: 52, fontWeight: 400, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>scout.</span>
            </div>
            <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'baseline', gap: 8, padding: '4px 12px', border: '1px solid var(--border-default)', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--fg-tertiary)', alignSelf: 'center' }} />
              <span style={{ fontFamily: R.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>Loose notes.</span>
              <R_MM s={10} c="var(--fg-tertiary)">no structure</R_MM>
            </div>

            {/* Agent presence — Coopr stays out of the way on a scratch doc */}
            <R_DocAgentPresence activity="Indexed for retrieval — won't shape it unless asked" when="9:02 am" />

            {/* Mono date sub-header — frames the prose block as a journal entry */}
            <div style={{ marginTop: 28, maxWidth: 640, display: 'flex', alignItems: 'baseline', gap: 10, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
              <R_MM s={10} c="var(--fg-tertiary)" st={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>Apr 24 · 09:02</R_MM>
              <R_ML s={9}>Why this exists</R_ML>
            </div>

            <div style={{ marginTop: 12, maxWidth: 640 }}>
              <p style={{ margin: 0, fontFamily: R.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.7 }}>
                Banking b-roll Thursday morning before the leopard-shark spawn. In case the main Truk shoot weathers out. <span style={{ background: 'rgba(182,83,43,0.14)', padding: '0 3px', borderRadius: 2 }}>Loose list, not matched to a script.</span>
              </p>
              <p style={{ margin: '14px 0 0', fontFamily: R.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.7 }}>
                Don't shape this into anything. I'll come back and decide after I see what I get on the camera.
              </p>
            </div>

            {/* Mono date sub-header — second journal entry */}
            <div style={{ marginTop: 30, maxWidth: 640, display: 'flex', alignItems: 'baseline', gap: 10, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
              <R_MM s={10} c="var(--fg-tertiary)" st={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>Apr 24 · 09:14</R_MM>
              <R_ML s={9}>Eight shots, in order of greed</R_ML>
            </div>

            <div style={{ marginTop: 8, maxWidth: 640 }}>
              {[
                'Leopard shark aggregation at shoreline · golden hour',
                'Garibaldi territorial display — single subject',
                'Kelp holdfast detail · backlit',
                'Sea hare close-up · slow push',
                'Sand divers emerging at dusk',
                'Surface silhouettes from 20ft',
                'Anemone cluster · macro',
                'Moray peek · tight frame',
              ].map((t, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <R_MM s={10.5} c="var(--fg-tertiary)">{String(i + 1).padStart(2, '0')}</R_MM>
                  <span style={{ fontFamily: R.sans, fontSize: 14, color: 'var(--fg-primary)' }}>{t}</span>
                </div>
              ))}
            </div>

            <R_AddSection />
          </div>
        </div>
        <R_SideChat
          messages={[
            { from: 'coopr', time: '9:02 am', text: "Want me to add structure later? I see this is just a list right now. I'll leave it alone." },
          ]}
          suggestions={['/list', '+ expand to project', '+ caption']}
        />
      </div>
    </HfShell>
  );
}

// ── The full doc with explicit section composability ─────
// ─────────────────────────────────────────────────────────
// Agent-as-co-editor primitives — used inside HF_StudioDocFull.
// They make Coopr a participant in the doc, not a chatbot beside it.
// ─────────────────────────────────────────────────────────

// Top strip · "Coopr is here" — a persistent presence indicator at the
// top of every doc, like a co-editor's avatar in Google Docs.
function R_DocAgentPresence({ activity = 'Drafted 3 hook variants in §01', when = 'just now' }) {
  return (
    <div style={{
      maxWidth: 720, margin: '20px 0 0',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      background: 'var(--accent-soft)',
      border: '1px solid transparent',
      borderRadius: 999,
    }}>
      <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="var(--fg-on-accent)" /></svg>
      </div>
      <span style={{ fontFamily: R.sans, fontSize: 11.5, color: 'var(--accent-primary-press)', fontWeight: 600, letterSpacing: '0.02em' }}>Coopr is in this doc.</span>
      <span style={{ fontFamily: R.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--accent-primary-press)' }}>{activity}.</span>
      <span style={{ flex: 1 }} />
      <R_MM s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>{when}</R_MM>
      <R_MM s={9.5} c="var(--accent-primary)" st={{ fontWeight: 700, letterSpacing: '0.06em' }}>SEE 3 EDITS →</R_MM>
    </div>
  );
}

// Inline diff chip — shows "before / after" for an agent rewrite.
// Old line strikethrough in fg-tertiary, new in clay italic. Footer pill: accept · revert.
function R_AgentRewrite({ before, after, tag = 'tightened by Coopr', when = '14m ago' }) {
  return (
    <div style={{
      marginTop: 8, padding: '10px 12px',
      background: 'var(--bg-base)',
      border: '1px solid var(--accent-primary)',
      borderRadius: 8,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: R.mono, fontSize: 9, fontWeight: 600, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 38 }}>before</span>
        <span style={{ fontFamily: R.serif, fontSize: 14, color: 'var(--fg-tertiary)', textDecoration: 'line-through', textDecorationColor: 'var(--fg-tertiary)', lineHeight: 1.5, flex: 1 }}>{before}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: R.mono, fontSize: 9, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 38 }}>after</span>
        <span style={{ fontFamily: R.serif, fontStyle: 'italic', fontSize: 14.5, color: 'var(--fg-primary)', lineHeight: 1.55, flex: 1, fontWeight: 500 }}>{after}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
        <svg width="10" height="10" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
        <R_MM s={9.5} c="var(--accent-primary)" st={{ fontWeight: 600 }}>{tag}</R_MM>
        <R_MM s={9} c="var(--fg-tertiary)">· {when}</R_MM>
        <span style={{ flex: 1 }} />
        <span style={{ padding: '3px 10px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 999, fontFamily: R.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Keep</span>
        <span style={{ padding: '3px 10px', background: 'transparent', color: 'var(--fg-secondary)', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: R.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Revert</span>
      </div>
    </div>
  );
}

// Floating "selection menu" — appears when text is selected. Mimics a Linear-style
// inline command bar with quick rewrite verbs. We render it as if a paragraph above
// is selected; positioning is illustrative.
function R_AgentSelectionBar({ verbs = ['Rewrite tighter', 'Extract as caption', 'Shorten by 30%', 'Make question'], anchor = 'absolute' }) {
  return (
    <div style={{
      position: anchor, top: -42, left: 0, zIndex: 5,
      background: 'var(--fg-primary)',
      borderRadius: 999,
      padding: '5px 6px',
      display: 'inline-flex', alignItems: 'center', gap: 4,
      boxShadow: '0 8px 24px rgba(15,14,12,0.22)',
    }}>
      <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: 4, marginRight: 2 }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="var(--accent-soft)" /></svg>
      {verbs.map((v, i) => (
        <span key={i} style={{
          padding: '4px 10px', borderRadius: 999,
          background: i === 0 ? 'var(--accent-primary)' : 'transparent',
          color: i === 0 ? 'var(--fg-on-accent)' : 'var(--surface-1)',
          fontFamily: R.sans, fontSize: 11, fontWeight: 500,
          cursor: 'pointer',
        }}>{v}</span>
      ))}
      <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
      <span style={{ padding: '4px 10px', color: 'var(--surface-1)', fontFamily: R.sans, fontSize: 11, fontWeight: 500, opacity: 0.7, cursor: 'pointer' }}>or ask…</span>
    </div>
  );
}

// "Added by Coopr" row used inside lists (shot list, checklist, etc).
function R_AgentAddedRow({ children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 12,
      padding: '8px 10px', alignItems: 'center',
      background: 'var(--accent-soft)',
      borderRadius: 6,
      border: '1px solid transparent',
    }}>
      <svg width="11" height="11" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
      {children}
    </div>
  );
}

// Version-compare strip — three pills: current + 2 prior. Click any non-current → toast.
function R_DocVersionStrip({ versions = [], onPick = () => {} }) {
  return (
    <div style={{
      maxWidth: 720, margin: '8px 0 0',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <R_ML s={9}>versions</R_ML>
      <div style={{ display: 'flex', gap: 6 }}>
        {versions.map((v, i) => {
          const current = v.current;
          return (
            <span
              key={i}
              onClick={current ? undefined : () => onPick(v.id)}
              style={{
                padding: '3px 10px',
                borderRadius: 999,
                background: current ? 'var(--accent-primary)' : 'transparent',
                color: current ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                border: current ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                fontFamily: R.mono, fontSize: 9.5, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                fontVariantNumeric: 'tabular-nums',
                cursor: current ? 'default' : 'pointer',
              }}
            >
              {v.id} · {v.when}
            </span>
          );
        })}
      </div>
      <span style={{ flex: 1 }} />
      <R_MM s={9.5} c="var(--fg-tertiary)">compare</R_MM>
    </div>
  );
}

// Agent-edit highlight — wraps a sentence with clay-soft background and a hover
// tooltip showing the eyebrow + keep/revert chips. Cosmetic; chips fire pushToast.
function R_AgentEditMark({ children, when = '2h ago', tag = 'Edited by Coopr', editId = 'edit', onKeep = () => {}, onRevert = () => {} }) {
  const [hov, setHov] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: 'var(--accent-soft)',
        boxShadow: '0 0 0 2px var(--accent-soft)',
        borderRadius: 2,
        padding: '0 1px',
        cursor: 'help',
      }}
    >
      {children}
      {hov && (
        <span style={{
          position: 'absolute',
          left: 0, top: -34,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 8px',
          background: 'var(--fg-primary)',
          borderRadius: 999,
          boxShadow: '0 6px 18px rgba(15,14,12,0.20)',
          whiteSpace: 'nowrap',
          zIndex: 5,
        }}>
          <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-soft)' }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
          <span style={{ fontFamily: R.mono, fontSize: 9, fontWeight: 600, color: 'var(--surface-1)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tag} · {when}</span>
          <span
            onClick={(e) => { e.stopPropagation(); onKeep(editId); }}
            style={{ padding: '1px 8px', borderRadius: 999, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', fontFamily: R.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          >Keep</span>
          <span
            onClick={(e) => { e.stopPropagation(); onRevert(editId); }}
            style={{ padding: '1px 8px', borderRadius: 999, background: 'transparent', color: 'var(--surface-1)', border: '1px solid rgba(255,255,255,0.25)', fontFamily: R.mono, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          >Revert</span>
        </span>
      )}
    </span>
  );
}

// Paragraph hover suggestion — wraps a paragraph; on hover, a clay popover floats
// in the right gutter with a one-line agent suggestion + chevron. Click → toast.
function R_DocParaWithSuggestion({ children, paraId = 'para', suggestion = 'Tighten this — 3 ideas', onOpen = () => {} }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: 'relative' }}
    >
      {children}
      {hov && (
        <div
          onClick={() => onOpen(paraId)}
          style={{
            position: 'absolute',
            top: 0, left: 'calc(100% + 18px)',
            width: 184,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px',
            background: 'var(--accent-soft)',
            border: '1px solid transparent',
            borderRadius: 8,
            boxShadow: '0 6px 14px rgba(15,14,12,0.06)',
            cursor: 'pointer',
            zIndex: 4,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)', flexShrink: 0 }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
          <span style={{ flex: 1, fontFamily: R.sans, fontSize: 11.5, color: 'var(--accent-primary-press)', fontWeight: 500, lineHeight: 1.35 }}>{suggestion}</span>
          <svg width="8" height="8" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)', flexShrink: 0 }}><path d="M4 2 L8 6 L4 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
        </div>
      )}
    </div>
  );
}

// Inline mention chip — clay-soft pill rendered inline inside prose. Click → toast.
function R_MentionChip({ name, onOpen = () => {} }) {
  const [hov, setHov] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(name)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '0 7px',
        margin: '0 1px',
        borderRadius: 999,
        background: 'var(--accent-soft)',
        color: 'var(--accent-primary-press)',
        fontFamily: R.sans, fontSize: 13.5, fontWeight: 600,
        cursor: 'pointer',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hov ? '0 4px 10px rgba(182,83,43,0.16)' : 'none',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
      }}
    >
      <span style={{ fontFamily: R.mono, fontSize: 10.5, fontWeight: 700, opacity: 0.7 }}>@</span>
      {name}
    </span>
  );
}

// Margin comment thread — anchored beside a paragraph in the right rail.
// Tiny avatar circle + 1-2 line comment + reply chip. Reply → toast.
function R_DocMarginComment({ author = 'M', name = 'Mara', body = '', when = '1h ago', threadId = 'c1', onReply = () => {} }) {
  return (
    <div style={{
      display: 'flex', gap: 10,
      padding: '10px 12px',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 10,
      boxShadow: '0 4px 10px rgba(15,14,12,0.04)',
      maxWidth: 220,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 999,
        background: 'var(--accent-soft)',
        color: 'var(--accent-primary-press)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: R.mono, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.04em', textTransform: 'uppercase',
        flexShrink: 0,
      }}>{author}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: R.sans, fontSize: 11.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{name}</span>
          <R_MM s={9} c="var(--fg-tertiary)">· {when}</R_MM>
        </div>
        <p style={{
          margin: '4px 0 8px',
          fontFamily: R.serif, fontStyle: 'italic',
          fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.45,
        }}>{body}</p>
        <span
          onClick={() => onReply(threadId)}
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 999,
            border: '1px solid var(--border-default)',
            fontFamily: R.mono, fontSize: 9, fontWeight: 600,
            color: 'var(--fg-secondary)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >Reply</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// D2 · Long-form editor structure — outline rail / version
// panel / state pill / agent activity log / mid-doc ToC.
// These wrap the v3-B1 inline interactions; they DO NOT
// replace them.
// ─────────────────────────────────────────────────────────

// Outline rail · vertical list of section headings, active row highlighted,
// word-count + reading-time footer. Click → smooth-scroll + toast.
function R_DocOutlineRail({ sections = [], activeId, onJump = () => {}, words = 0, target = 0 }) {
  const pct = Math.max(0, Math.min(1, target ? words / target : 0));
  const minutes = Math.max(1, Math.round(words / 220));
  return (
    <aside style={{
      width: 200, flexShrink: 0,
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--bg-base)',
      padding: '40px 18px 28px',
      display: 'flex', flexDirection: 'column',
      overflow: 'auto',
    }}>
      <R_ML s={9} st={{ marginBottom: 12 }}>outline</R_ML>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sections.map((sec, i) => {
          const active = sec.id === activeId;
          return (
            <span
              key={sec.id}
              onClick={() => onJump(sec.id)}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 8,
                padding: '7px 10px 7px 12px',
                borderLeft: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                background: active ? 'var(--accent-soft)' : 'transparent',
                borderRadius: '0 6px 6px 0',
                cursor: 'pointer',
                transition: 'background 120ms ease',
              }}
            >
              <span style={{
                fontFamily: R.mono, fontSize: 9.5, fontWeight: 600,
                color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)',
                letterSpacing: '0.06em',
                fontVariantNumeric: 'tabular-nums',
                minWidth: 18,
              }}>{sec.n}</span>
              <span style={{
                fontFamily: R.sans, fontSize: 12,
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                lineHeight: 1.35,
              }}>{sec.label}</span>
            </span>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <R_ML s={9}>words</R_ML>
          <span style={{ fontFamily: R.mono, fontSize: 11, fontWeight: 600, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {words}<span style={{ color: 'var(--fg-tertiary)' }}> / {target}</span>
          </span>
        </div>
        <div style={{ marginTop: 8, height: 4, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: (pct * 100).toFixed(1) + '%',
            height: '100%',
            background: 'var(--accent-primary)',
            borderRadius: 2,
            transition: 'width 320ms ease',
          }} />
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <R_ML s={9}>read time</R_ML>
          <span style={{ fontFamily: R.mono, fontSize: 11, color: 'var(--fg-secondary)', fontVariantNumeric: 'tabular-nums' }}>{minutes} min</span>
        </div>
      </div>
    </aside>
  );
}

// Doc-state pill · prominent state indicator at the top of the doc body.
// Click cycles state — toast confirms the new state. Active state has a
// subtle pulsing dot when it's "drafting".
function R_DocStatePill({ states = [], activeId, onCycle = () => {} }) {
  const active = states.find(s => s.id === activeId) || states[0];
  if (!active) return null;
  return (
    <span
      onClick={() => onCycle()}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 12px 5px 10px',
        borderRadius: 999,
        background: active.bg,
        color: active.fg,
        border: '1px solid ' + (active.border || 'transparent'),
        cursor: 'pointer',
        boxShadow: active.id === 'shipped' ? '0 0 0 3px var(--accent-soft)' : 'none',
      }}
    >
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: active.dot,
        animation: active.pulse ? 'hf-doc-state-pulse 1.6s ease-in-out infinite' : 'none',
      }} />
      <span style={{
        fontFamily: R.mono, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.10em', textTransform: 'uppercase',
      }}>{active.label}</span>
      <span style={{ width: 1, height: 10, background: 'currentColor', opacity: 0.18 }} />
      <span style={{
        fontFamily: R.mono, fontSize: 9.5, fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        opacity: 0.7,
      }}>{active.who}</span>
    </span>
  );
}

// Version history side panel · timeline of saves with author / change /
// word delta. Click any row → toast. Footer Restore + Compare buttons.
function R_DocVersionPanel({ versions = [], onPick = () => {}, onRestore = () => {}, onCompare = () => {} }) {
  return (
    <aside style={{
      width: 240, flexShrink: 0,
      borderLeft: '1px solid var(--border-subtle)',
      background: 'var(--bg-base)',
      padding: '40px 16px 16px',
      display: 'flex', flexDirection: 'column',
      overflow: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <R_ML s={9}>versions · 8 saved</R_ML>
        <R_MM s={9} c="var(--fg-tertiary)">v8</R_MM>
      </div>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Spine */}
        <span style={{
          position: 'absolute', left: 4, top: 6, bottom: 6,
          width: 1, background: 'var(--border-subtle)',
        }} />
        {versions.map((v, i) => (
          <span
            key={v.id}
            onClick={() => onPick(v.id)}
            style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column', gap: 2,
              padding: '8px 0 12px 18px',
              cursor: 'pointer',
              borderRadius: 4,
            }}
          >
            <span style={{
              position: 'absolute', left: 1.5, top: 12,
              width: 7, height: 7, borderRadius: '50%',
              background: v.current ? 'var(--accent-primary)' : 'var(--surface-1)',
              border: v.current ? 'none' : '1px solid var(--border-default)',
              boxShadow: v.current ? '0 0 0 3px var(--accent-soft)' : 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: R.mono, fontSize: 10, fontWeight: 700, color: v.current ? 'var(--accent-primary-press)' : 'var(--fg-secondary)', letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums' }}>{v.id}</span>
              <R_MM s={9} c="var(--fg-tertiary)">· {v.when}</R_MM>
              <span style={{ flex: 1 }} />
              <span style={{
                fontFamily: R.mono, fontSize: 9.5, fontWeight: 600,
                color: v.delta >= 0 ? 'var(--tone-success)' : 'var(--tone-warning)',
                fontVariantNumeric: 'tabular-nums',
              }}>{v.delta >= 0 ? '+' : ''}{v.delta}w</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{
                fontFamily: R.sans, fontSize: 10.5, fontWeight: 600,
                color: v.author === 'Coopr' ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
              }}>{v.author}</span>
            </div>
            <p style={{ margin: '2px 0 0', fontFamily: R.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.4 }}>
              {v.change}
            </p>
          </span>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 6 }}>
        <span
          onClick={onRestore}
          style={{
            flex: 1, textAlign: 'center',
            padding: '6px 10px', borderRadius: 999,
            background: 'transparent',
            border: '1px solid var(--border-default)',
            fontFamily: R.mono, fontSize: 9.5, fontWeight: 600,
            color: 'var(--fg-secondary)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >Restore</span>
        <span
          onClick={onCompare}
          style={{
            flex: 1, textAlign: 'center',
            padding: '6px 10px', borderRadius: 999,
            background: 'var(--accent-primary)',
            color: 'var(--fg-on-accent)',
            border: '1px solid var(--accent-primary)',
            fontFamily: R.mono, fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >Compare</span>
      </div>
    </aside>
  );
}

// Agent activity log · horizontal strip below the doc body. Live recent
// agent moves with timestamps. Click any → toast.
function R_DocAgentLog({ items = [], onOpen = () => {} }) {
  return (
    <div style={{
      flexShrink: 0,
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-2)',
      padding: '10px 60px',
      display: 'flex', alignItems: 'center', gap: 18,
      overflowX: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--accent-primary)',
          animation: 'hf-doc-state-pulse 1.6s ease-in-out infinite',
        }} />
        <R_ML s={9} st={{ color: 'var(--accent-primary-press)' }}>coopr · live</R_ML>
      </div>
      <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', flexShrink: 0 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, overflowX: 'auto' }}>
        {items.map((it, i) => (
          <span
            key={i}
            onClick={() => onOpen(it.body)}
            style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 6,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)', flexShrink: 0 }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
            <span style={{ fontFamily: R.sans, fontSize: 11.5, color: 'var(--fg-primary)', fontWeight: 500 }}>{it.body}</span>
            <R_MM s={9} c="var(--fg-tertiary)">· {it.when}</R_MM>
          </span>
        ))}
      </div>
      <span style={{ flex: 1 }} />
      <span onClick={() => onOpen('See all activity')} style={{ flexShrink: 0, cursor: 'pointer' }}>
        <R_MM s={9.5} c="var(--accent-primary)" st={{ fontWeight: 700, letterSpacing: '0.08em' }}>SEE ALL →</R_MM>
      </span>
    </div>
  );
}

// Mid-doc jump-to ToC · inline section anchors to keep wayfinding alive
// in the middle of long bodies.
function R_DocJumpToC({ targets = [], onJump = () => {} }) {
  return (
    <div style={{
      maxWidth: 720,
      margin: '36px 0 24px',
      padding: '12px 16px',
      background: 'var(--surface-2)',
      border: '1px dashed var(--border-default)',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', gap: 14,
      flexWrap: 'wrap',
    }}>
      <R_ML s={9}>jump to</R_ML>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {targets.map((t, i) => (
          <React.Fragment key={t.id}>
            <span
              onClick={() => onJump(t.id)}
              style={{
                display: 'inline-flex', alignItems: 'baseline', gap: 4,
                padding: '3px 9px', borderRadius: 999,
                background: 'var(--surface-1)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: R.mono, fontSize: 9.5, fontWeight: 700, color: 'var(--accent-primary-press)', letterSpacing: '0.06em' }}>{t.n}</span>
              <span style={{ fontFamily: R.sans, fontSize: 11.5, color: 'var(--fg-primary)', fontWeight: 500 }}>{t.label}</span>
              <span style={{ marginLeft: 2, fontFamily: R.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>›</span>
            </span>
            {i < targets.length - 1 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-default)', display: 'inline-block', margin: '0 2px' }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function HF_StudioDocFull({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('studio', 'Docs');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  // E2 · click coverage. The active doc IS the surface — no further drill-
  // in. Wire the cardinal "+" affordances and the expand-row links so they
  // toast their would-be route instead of silently doing nothing.
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});

  // D2 · long-form editor structure — outline / state / activity / versions.
  // Sections drive both the outline rail (left) and the mid-doc jump ToC.
  const SECTIONS = [
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
  const STATES = [
    { id: 'drafting',  label: 'drafting · you',     who: 'you',   bg: 'var(--accent-soft)',     fg: 'var(--accent-primary-press)', dot: 'var(--accent-primary)', border: 'transparent', pulse: true },
    { id: 'reviewing', label: 'reviewing · coopr',  who: 'coopr', bg: 'var(--tone-warning-bg)', fg: 'var(--tone-warning)',         dot: 'var(--tone-warning)',   border: 'transparent', pulse: false },
    { id: 'locked',    label: 'locked · read-only', who: 'all',   bg: 'var(--surface-2)',       fg: 'var(--fg-secondary)',         dot: 'var(--fg-tertiary)',    border: 'var(--border-default)', pulse: false },
    { id: 'shipped',   label: 'shipped · apr 24',   who: 'live',  bg: 'var(--tone-success-bg)', fg: 'var(--tone-success)',         dot: 'var(--tone-success)',   border: 'transparent', pulse: false },
  ];
  const VERSIONS_LOG = [
    { id: 'v8', when: 'just now', author: 'Coopr', change: 'Tightened beat 2 — kept rhythm of eight breaths.', delta: -7,  current: true },
    { id: 'v7', when: '14m ago',  author: 'Coopr', change: 'Pulled two shots from transcript into §03.',       delta: 38,  current: false },
    { id: 'v6', when: '2h ago',   author: 'You',   change: 'Rewrote opening — ditched the 2014 framing.',      delta: 142, current: false },
    { id: 'v5', when: '4h ago',   author: 'Coopr', change: 'Drafted prep checklist from your gear pillar.',    delta: 84,  current: false },
    { id: 'v4', when: 'yesterday', author: 'You',  change: 'Outline + first three section headings.',          delta: 218, current: false },
    { id: 'v3', when: 'apr 22',   author: 'You',   change: 'Imported transcript from Truk dive footage.',      delta: 1242, current: false },
    { id: 'v2', when: 'apr 21',   author: 'You',   change: 'Title locked — Fujikawa in eight breaths.',        delta: 6,   current: false },
  ];
  const AGENT_LOG = [
    { body: 'Suggested 3 hook variants',           when: '12s ago' },
    { body: 'Flagged 2 weak transitions in §02',   when: '1m ago' },
    { body: 'Drafted §05 cold-open caption',       when: '4m ago' },
    { body: 'Pulled 2 shots from transcript',      when: '12m ago' },
    { body: 'Tightened beat 2 by 7 words',         when: '14m ago' },
  ];
  const JUMP_TARGETS = [SECTIONS[2], SECTIONS[3], SECTIONS[4], SECTIONS[6]];

  const [activeStateId, setActiveStateId] = React.useState('drafting');
  const [activeSectionId, setActiveSectionId] = React.useState('sec-01');

  function cycleDocState() {
    const i = STATES.findIndex(x => x.id === activeStateId);
    const next = STATES[(i + 1) % STATES.length];
    setActiveStateId(next.id);
    pushToast('Doc state · ' + next.label);
  }
  function jumpTo(id) {
    setActiveSectionId(id);
    const sec = SECTIONS.find(x => x.id === id);
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
  return (
    <HfShell workspace="studio" subtab="Docs">
      {/* D2 · pulse keyframes for state pill + agent live dot */}
      <style>{`@keyframes hf-doc-state-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.82); } }`}</style>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          {/* D2 · OUTLINE RAIL (left) */}
          <R_DocOutlineRail
            sections={SECTIONS}
            activeId={activeSectionId}
            onJump={jumpTo}
            words={1842}
            target={2400}
          />

          {/* DOC BODY (center) */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <R_DocCrumb crumbs="Studio › Docs › Truk Lagoon · ep. 1 hook" right="autosaved · 6 sections · share" />
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '40px 60px 60px', background: 'var(--surface-1)' }}>
            {/* D2 · DOC-STATE PILL anchored at the top of the doc body */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <R_DocStatePill states={STATES} activeId={activeStateId} onCycle={cycleDocState} />
              <R_MM s={9.5} c="var(--fg-tertiary)">click to cycle state</R_MM>
            </div>

            <R_MM s={11} st={{ fontVariantNumeric: 'tabular-nums' }}>Truk Lagoon · Apr 19 · single tank</R_MM>
            <div style={{ marginTop: 4 }}>
              <span style={{ fontFamily: R.serif, fontSize: 56, fontWeight: 400, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>The Fujikawa </span>
              <span style={{ fontFamily: R.serif, fontSize: 56, fontWeight: 400, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>in eight breaths.</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 22, flexWrap: 'wrap' }}>
              {[['Status', 'drafting · v3'], ['Format', '11-min YT'], ['Channel', 'YouTube'], ['Target', 'Tue 6:30 PM']].map(([k, v], i) => (
                <div key={i}>
                  <R_ML s={9}>{k}</R_ML>
                  <div style={{ marginTop: 2, fontFamily: R.sans, fontSize: 12.5, fontWeight: 500, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Version compare strip — three pills; click any prior → toast (v3-B1, preserved) */}
            <R_DocVersionStrip
              versions={[
                { id: 'v3', when: 'current', current: true },
                { id: 'v2', when: '2h',      current: false },
                { id: 'v1', when: 'yesterday', current: false },
              ]}
              onPick={(id) => pushToast('Open version compare · ' + id)}
            />

            {/* Agent presence — Coopr lives in the doc */}
            <R_DocAgentPresence activity="Three edits in the last 14 minutes — hook tightened, two shots added, caption drafted" when="14m ago" />

            {/* Intro paragraph + margin comment thread anchored to the right rail */}
            <div style={{ marginTop: 28, display: 'flex', gap: 28, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 1 640px', minWidth: 0 }}>
                <p style={{ margin: 0, fontFamily: R.sans, fontSize: 15.5, color: 'var(--fg-primary)', lineHeight: 1.65 }}>
                  Filmed Apr 19 in Truk Lagoon. Eight-breath rule the whole dive — descend, hover, exhale, count. Pinged <R_MentionChip name="mara" onOpen={(n) => pushToast('Open mention · ' + n)} /> on the second-camera framing and <R_MentionChip name="alex" onOpen={(n) => pushToast('Open mention · ' + n)} /> on the safety-stop overlay. Writing this episode to feel like the rhythm of the dive, not narrate it.
                </p>
              </div>
              <div style={{ flex: '0 0 220px', marginTop: 4 }}>
                <R_DocMarginComment
                  author="M"
                  name="Mara"
                  body="Lean into the rhythm. The ‘eight breaths’ phrase should land twice — open and close."
                  when="1h ago"
                  threadId="c1-rhythm"
                  onReply={(id) => pushToast('Reply to comment · ' + id)}
                />
              </div>
            </div>

            <div id="sec-01" style={{ marginTop: 36, maxWidth: 720 }}>
              <R_SectionHandle n="01" label="Opening" status="1 line · v3" />
              <div style={{ paddingLeft: 38, position: 'relative' }}>
                {/* Selection bar floating above the paragraph — mimics a real selection */}
                <R_AgentSelectionBar />
                <R_DocParaWithSuggestion
                  paraId="01-opening-line"
                  suggestion="Tighten this — 3 ideas"
                  onOpen={(id) => pushToast('Open suggestion · ' + id)}
                >
                  <p style={{ margin: 0, fontFamily: R.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.7, background: 'rgba(182,83,43,0.10)', boxShadow: '0 0 0 2px rgba(182,83,43,0.10)', borderRadius: 2, padding: '0 1px' }}>
                    I dropped onto the deck of the Fujikawa Maru at 95 feet, and counted my breaths to eight before I moved.
                  </p>
                </R_DocParaWithSuggestion>
                <div style={{ marginTop: 10, paddingLeft: 14, borderLeft: '2px solid var(--accent-primary)' }}>
                  <p style={{ margin: 0, fontFamily: R.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55 }}>
                    Eighty-one years ago this hold held bombs. Today it holds <R_AgentEditMark
                      editId="01-coral-line"
                      tag="Edited by Coopr"
                      when="2h ago"
                      onKeep={(id) => pushToast('Keep edit · ' + id)}
                      onRevert={(id) => pushToast('Revert edit · ' + id)}
                    >soft coral and a turtle that doesn't know any of that</R_AgentEditMark>.
                  </p>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
                    <R_MM s={9.5} c="var(--accent-primary)">coopr suggested · just now</R_MM>
                    <span style={{ flex: 1 }} />
                    <R_MM s={9.5}>tab to accept</R_MM>
                  </div>
                </div>
              </div>
            </div>

            <div id="sec-02" style={{ marginTop: 36, maxWidth: 720 }}>
              <R_SectionHandle n="02" label="Script" status="11 min · 5 beats · 1 rewrite" />
              <div style={{ paddingLeft: 38 }}>
                {/* First beat — kept as is */}
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <R_MM s={10.5} c="var(--fg-secondary)">0:00–0:08</R_MM>
                  <p style={{ margin: 0, fontFamily: R.serif, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.6 }}>I dropped onto the deck of the Fujikawa Maru at 95 feet, and counted my breaths to eight before I moved.</p>
                  <R_ML s={9} st={{ textAlign: 'right' }}>HOOK</R_ML>
                </div>

                {/* Second beat — REWRITTEN by Coopr · diff chip */}
                <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', gap: 16, alignItems: 'baseline' }}>
                    <R_MM s={10.5} c="var(--fg-secondary)">0:08–0:42</R_MM>
                    <div>
                      <p style={{ margin: 0, fontFamily: R.serif, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
                        There's a thing wreck divers do that I never explain on camera, and it's the reason I'm still diving wrecks at 38.
                      </p>
                      <R_AgentRewrite
                        before="There's a thing wreck divers do that I never explain on camera, and it's the reason I'm still diving wrecks at 38."
                        after="There's something wreck divers do that I've never said out loud — it's why I'm still doing this at 38."
                        tag="Tightened by Coopr · -7 words"
                        when="14m ago"
                      />
                    </div>
                    <R_ML s={9} st={{ textAlign: 'right' }}>SETUP</R_ML>
                  </div>
                </div>

                {/* Third beat */}
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', gap: 16, padding: '10px 0' }}>
                  <R_MM s={10.5} c="var(--fg-secondary)">0:42–4:10</R_MM>
                  <p style={{ margin: 0, fontFamily: R.serif, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.6 }}>You stop. You count. <R_AgentEditMark
                    editId="02-beat3-dilating"
                    tag="Edited by Coopr"
                    when="2h ago"
                    onKeep={(id) => pushToast('Keep edit · ' + id)}
                    onRevert={(id) => pushToast('Revert edit · ' + id)}
                  >You let your eyes finish dilating</R_AgentEditMark>. You let the silt settle.</p>
                  <R_ML s={9} st={{ textAlign: 'right' }}>BODY</R_ML>
                </div>
                <span onClick={() => pushToast('Expand script · 2 more beats')} style={{ display: 'inline-block', marginTop: 12, cursor: 'pointer' }}>
                  <R_MM s={11}>+ 2 more beats · click to expand</R_MM>
                </span>
              </div>
            </div>

            {/* D2 · MID-DOC JUMP-TO ToC — keeps wayfinding alive in the middle of the body */}
            <R_DocJumpToC
              targets={JUMP_TARGETS}
              onJump={jumpTo}
            />

            <div id="sec-03" style={{ marginTop: 36, maxWidth: 720 }}>
              <R_SectionHandle n="03" label="Shot list" status="14 shots · 6 keepers · 2 added by Coopr" />
              <div style={{ paddingLeft: 38, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  ['01', 'Wide — Fujikawa deck from above', '0:00–0:08', true],
                  ['02', 'Medium — gauges, breaths counting', '0:08–0:30', true],
                  ['03', 'Close — soft coral on rail', '0:30–1:00', true],
                  ['04', 'POV — swim into hold three', '4:10–4:40', true],
                ].map(([n, t, time, keep], i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 50px', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                    <R_MM s={10.5} c={keep ? 'var(--accent-primary)' : 'var(--fg-tertiary)'}>{n}</R_MM>
                    <span style={{ fontFamily: R.sans, fontSize: 13.5, color: 'var(--fg-primary)' }}>{t}</span>
                    <R_MM s={9.5} c="var(--fg-tertiary)" st={{ textAlign: 'right' }}>{time}</R_MM>
                    <R_MM s={9.5} c="var(--tone-success)" st={{ textAlign: 'right' }}>keep</R_MM>
                  </div>
                ))}

                {/* Coopr-added shots — visually distinct, with batch accept */}
                <R_AgentAddedRow>
                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px', gap: 12, alignItems: 'center', flex: 1 }}>
                    <R_MM s={10.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>05</R_MM>
                    <span style={{ fontFamily: R.sans, fontSize: 13.5, color: 'var(--accent-primary-press)' }}>Detail — turtle drifting through hold three</span>
                    <R_MM s={9.5} c="var(--accent-primary-press)" st={{ textAlign: 'right' }}>4:40–5:10</R_MM>
                  </div>
                  <R_MM s={9} c="var(--accent-primary-press)" st={{ fontWeight: 600, letterSpacing: '0.08em' }}>NEW</R_MM>
                </R_AgentAddedRow>
                <R_AgentAddedRow>
                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px', gap: 12, alignItems: 'center', flex: 1 }}>
                    <R_MM s={10.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>06</R_MM>
                    <span style={{ fontFamily: R.sans, fontSize: 13.5, color: 'var(--accent-primary-press)' }}>Wide silhouette — exit at safety stop · backlight</span>
                    <R_MM s={9.5} c="var(--accent-primary-press)" st={{ textAlign: 'right' }}>9:40–10:00</R_MM>
                  </div>
                  <R_MM s={9} c="var(--accent-primary-press)" st={{ fontWeight: 600, letterSpacing: '0.08em' }}>NEW</R_MM>
                </R_AgentAddedRow>

                <div style={{ marginTop: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
                  <R_MM s={9.5} c="var(--accent-primary)" st={{ fontWeight: 600 }}>Coopr added 2 shots from your transcript · 12m ago</R_MM>
                  <span style={{ flex: 1 }} />
                  <span onClick={() => pushToast('Keep · 2 Coopr-added shots')} style={{ padding: '3px 10px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 999, fontFamily: R.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Keep both</span>
                  <span onClick={() => pushToast('Drop · 2 Coopr-added shots')} style={{ padding: '3px 10px', background: 'transparent', color: 'var(--fg-secondary)', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: R.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Drop</span>
                </div>

                <span onClick={() => pushToast('Expand shot list · 10 more shots')} style={{ display: 'inline-block', marginTop: 12, cursor: 'pointer' }}>
                  <R_MM s={11}>+ 10 more shots</R_MM>
                </span>
              </div>
            </div>

            <div id="sec-04" style={{ marginTop: 36, maxWidth: 720 }}>
              <R_SectionHandle n="04" label="Prep" status="5 of 8 done · 1 Coopr can do" />
              <div style={{ paddingLeft: 38, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 28px' }}>
                {[['Color graded', true, false], ['Captions pass 2', true, false], ['Thumbnail variants', true, false], ['Audio noise floor', true, false], ['Description gear links', false, true], ['Cards & end screen', false, false]].map(([t, d, agent], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 13, height: 13, borderRadius: 3, background: d ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--border-default)' }} />
                    <span style={{ fontFamily: R.sans, fontSize: 13, color: d ? 'var(--fg-tertiary)' : 'var(--fg-primary)', textDecoration: d ? 'line-through' : 'none' }}>{t}</span>
                    {agent && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: 'var(--accent-soft)', borderRadius: 999, cursor: 'pointer' }}>
                        <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
                        <R_MM s={8.5} c="var(--accent-primary-press)" st={{ fontWeight: 700, letterSpacing: '0.08em' }}>COOPR CAN DO IT</R_MM>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <R_AddSection />
            </div>
          </div>

          {/* D2 · VERSION HISTORY PANEL (right column, collapsible by intent) */}
          <R_DocVersionPanel
            versions={VERSIONS_LOG}
            onPick={(id) => pushToast('Open version compare · ' + id)}
            onRestore={() => pushToast('Restore version · v8')}
            onCompare={() => pushToast('Compare versions · side-by-side')}
          />

          {/* Existing scoped Coopr side-chat — kept; sits to the right of the versions panel */}
          <R_SideChat
            messages={[
              { from: 'coopr', time: '7:12 am', text: "Doc has 4 sections active. Caption and notes haven't been started — want me to draft a caption matched to your Tue 6:30 PM IG slot?", actions: ['draft caption', 'not yet'] },
              { from: 'you', text: 'tighten beat 2' },
              { from: 'coopr', time: '7:14 am', text: "Done — dropped a tightened version inline (-7 words). Keep or revert from the diff chip in §02. I also pulled 2 more shots from your transcript that fit the rhythm — they're queued in §03 for batch accept." , actions: ['see all changes', 'undo all'] },
              { from: 'you', text: 'good. and the gear link description in prep' },
              { from: 'coopr', time: '7:18 am', text: "Marked it — I'll draft from your gear pillar memory and your last 4 YT descriptions. Will post the draft inline; you'll see it appear in §04.", actions: ['ok', 'wait'] },
            ]}
            suggestions={['/draft caption', '/extract pull-quote', '+ ship checklist']}
          />
        </div>

        {/* D2 · AGENT ACTIVITY LOG (horizontal strip, below the body) */}
        <R_DocAgentLog
          items={AGENT_LOG}
          onOpen={(body) => pushToast('Open · ' + body)}
        />
      </div>
    </HfShell>
  );
}

Object.assign(window, {
  HF_StudioList, HF_StudioCalendar,
  HF_StudioDocFull, HF_StudioDocHooks, HF_StudioDocNotes,
});
