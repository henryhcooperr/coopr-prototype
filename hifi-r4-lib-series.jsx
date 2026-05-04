/* global React, window, HfShell, R4PlatformCard, R4Chip, R4PillarDot, R4ChannelChip, R4Stat, r4FmtViews */
/* hifi-r4-lib-series.jsx — Library round 4 · Series.

   Job: a creator's body of work isn't 412 atomic posts — it's 30-ish projects
   that each had a beginning, a middle and an end. Series view treats each
   multi-part body of work as a CASE FILE: how it started, how it's doing,
   what it's spawning.

   Layout: a left rail of all series (with sparkline of cumulative views), and
   a focused right pane on one selected series (Truk Lagoon · 6 posts) that
   shows: hero (the flagship post), arc (date strip with thumbnails inline),
   performance arc (cumulative views by post, retention by post), what we
   learned (memory excerpts), what's still cooking in Studio.

   This is the surface that proves Library is more than a CMS — it's where the
   creator goes to remember what they did. */

const R4SD = window.HF_DATA;

// ─── Synthesized series catalog ──────────────────────────
// We have a small dataset, so we hand-pick the series and their members.
const R4_SERIES = [
  {
    id: 'truk',
    title: 'Truk Lagoon',
    sub: '6 posts · Jan – Apr · Story / travel',
    summary: 'Eight-week shoot at Truk Lagoon — three wrecks, eight breaths, one near-incident that became the center of ep. 1.',
    posts: ['0044', '0042', '0037'],
    cumViewsK: 933,
    avgScore: 71,
    pillar: 'story',
    memory: [
      { ts: 'Apr 19', body: 'Truk audience indexes older (35–54). They watch longer. Don\'t cut for TikTok pacing.', kind: 'learning' },
      { ts: 'Apr 14', body: '0042 confirmed: own-failure cold-opens > observation cold-opens for save rate.',         kind: 'decision' },
    ],
    cooking: [
      { id: 'd010', title: 'Three-frame carousel from 0042', stage: 'frames' },
      { id: 'd012', title: 'Fiji wreck series · ep. 1 hook', stage: 'hooks (kin)' },
    ],
  },
  {
    id: 'safety-primer',
    title: 'Dive-safety primers',
    sub: '14 posts · ongoing · Safety',
    summary: 'The flagship pillar. Cold-open primers and 8-second rule cuts. One of these (0041) underperformed and is being rewritten.',
    posts: ['0046', '0043', '0041', '0039', '0038'],
    cumViewsK: 601,
    avgScore: 38,
    pillar: 'safety',
    memory: [
      { ts: 'Apr 22', body: 'Switched safety primers to cold-open format. Old narrated intros lose 14% by min 1.', kind: 'decision' },
      { ts: 'Apr 10', body: 'On long-form, the disclaimer kills 11% if it\'s pre-content. Move it to footer.',     kind: 'learning' },
    ],
    cooking: [
      { id: 'd011', title: 'Replacement opener for 0041', stage: 'rewrite' },
    ],
  },
  {
    id: 'gear',
    title: 'Gear teardowns',
    sub: '8 posts · since Q3 · Gear',
    summary: 'Long-form regulator + computer tear-downs. Highest save-per-view in the catalog.',
    posts: ['0045', '0040', '0036'],
    cumViewsK: 237,
    avgScore: 48,
    pillar: 'gear',
    memory: [
      { ts: 'Apr 06', body: 'DIN/YOKE comparison frame at 7:20 in 0040 is the highest-rewatched moment of the series.', kind: 'learning' },
    ],
    cooking: [
      { id: 'd008', title: 'Reg-first-stage gear teardown 2', stage: 'outline' },
      { id: 'd005', title: 'Why I retired my old BCD',         stage: 'spark' },
    ],
  },
  {
    id: 'komodo',
    title: 'Komodo',
    sub: '4 posts · Mar · Story / travel',
    summary: 'Fast-cut travel pieces. Carousel format outperformed reels 2× on saves.',
    posts: ['0037'],
    cumViewsK: 84,
    avgScore: 44,
    pillar: 'story',
    memory: [],
    cooking: [
      { id: 'd007', title: 'Komodo cold-open — alt cut', stage: 'frames' },
    ],
  },
  {
    id: 'fiji',
    title: 'Fiji wreck',
    sub: '0 published · 1 in Studio · Story',
    summary: 'Next series — kicking off in May. Ep. 1 hook is in Studio.',
    posts: [],
    cumViewsK: 0,
    avgScore: null,
    pillar: 'story',
    memory: [],
    cooking: [
      { id: 'd012', title: 'Fiji wreck series · ep. 1 hook', stage: 'hooks' },
    ],
  },
];

// ─── Candidate posts for the "Posts to include" checklist ─
// Hand-picked from R4SD so the form has a meaningful demo without
// re-deriving the catalog. Two posts pre-checked to mirror Henry's
// "drop two related shoots into a series" intuition.
const R4_NEW_SERIES_CANDIDATES = ['0046', '0044', '0043', '0042', '0041', '0040', '0039', '0038', '0037', '0036'];
const R4_NEW_SERIES_PRECHECKED = ['0044', '0042'];

// ─── Pillars + cadence options for the create form ────────
const R4_NEW_SERIES_PILLARS = [
  { id: 'origin',  label: 'Origin Story' },
  { id: 'live',    label: 'Live Build' },
  { id: 'reaction',label: 'Reaction' },
  { id: 'field',   label: 'Field Notes' },
];
const R4_NEW_SERIES_CADENCES = [
  { id: 'weekly',  label: 'Weekly' },
  { id: 'biweek',  label: 'Bi-weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'adhoc',   label: 'Ad-hoc' },
];

// Sentinel: rail entry that triggers the in-pane edit form.
// We APPEND this to the rail (not replace any of the 5 real series),
// so the read-only catalog is preserved AND a click on either the
// header CTA or the bottom rail row routes to the same edit pane.
const R4_NEW_SERIES_ROW = {
  id: '_new',
  title: '+ Start a new series',
  sub: 'draft · unsaved',
  pillar: 'story',
  cooking: [],
  cumViewsK: 0,
  posts: [],
  memory: [],
  isNew: true,
};

function HF_R4_LibrarySeries({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('library', 'Series');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  const [focusId, setFocusId] = React.useState('truk');

  // Defensive master-state hook (toast layer). useMasterState throws
  // outside MasterStateProvider (layout view, R3 IA preview), so guard.
  let ms = null;
  try { ms = window.useMasterState && window.useMasterState(); } catch (_e) { ms = null; }
  const pushToast = (ms && typeof ms.pushToast === 'function') ? ms.pushToast : (() => {});

  // Edit-form state — kept at parent so the CTA in the masthead and
  // the rail row both write into the same draft.
  const [draft, setDraft] = React.useState({
    name: '',
    description: '',
    pillar: 'origin',
    cadence: 'weekly',
    selected: R4_NEW_SERIES_PRECHECKED.slice(),
  });

  if (s === 'loading') {
    return <HfShell workspace="library" subtab="Series" topbarRight={<R4SLibTopbar />}><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="library" subtab="Series" topbarRight={<R4SLibTopbar />}><window.HF_EmptyHero
      eyebrow="Series · 0 cases"
      title="No multi-part work yet. Series collect once you ship two related posts."
      caption="A series is a case file — the posts, the lessons, and what's still cooking."
      ctaLabel="Open Library"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="library" subtab="Series" topbarRight={<R4SLibTopbar />}><window.HF_ErrorHero
      title="Couldn't load the series view."
      body="The case-file index timed out. Retry, or come back in a minute."
    /></HfShell>;
  }

  const isNewMode = focusId === '_new';
  const focus = R4_SERIES.find(ss => ss.id === focusId) || R4_SERIES[0];
  const focusPosts = focus.posts.map(id => R4SD.posts.find(p => p.id === id)).filter(Boolean);

  return (
    <HfShell workspace="library" subtab="Series" topbarRight={<R4SLibTopbar onCreate={() => setFocusId('_new')} />}>

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden', background: 'var(--bg-base)' }}>

        {/* ─── Left rail · all series ───────────────────────── */}
        <div style={{ borderRight: '1px solid var(--border-subtle)', overflow: 'auto', background: 'var(--surface-1)' }}>
          <div style={{ padding: '20px 22px 14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Series · 12 active</div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>
              Bodies of work.
            </h2>
            <div style={{ marginTop: 6, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>
              Each series is a case file — the posts, what we learned, and what's still cooking.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {R4_SERIES.map(srs => (
              <R4SeriesRailItem
                key={srs.id}
                series={srs}
                active={srs.id === focusId}
                onSelect={() => setFocusId(srs.id)}
                onMenuAction={(action) => {
                  if (action === 'edit')    pushToast('Edit details · ' + srs.title);
                  if (action === 'add')     pushToast('Add post to · ' + srs.title);
                  if (action === 'archive') pushToast('Archive series · ' + srs.title);
                }}
              />
            ))}
            <R4SeriesRailItem
              key="_new"
              series={R4_NEW_SERIES_ROW}
              active={isNewMode}
              onSelect={() => setFocusId('_new')}
            />
          </div>
        </div>

        {/* ─── Right pane · the case file OR the edit form ──── */}
        <div key={focusId} style={{ overflow: 'auto', animation: 'cv-fade-in 200ms ease' }}>

          {isNewMode ? (
            <R4SeriesEditPanel
              draft={draft}
              setDraft={setDraft}
              onCancel={() => { setFocusId('truk'); pushToast('Discarded series draft'); }}
              onCreate={() => {
                pushToast('Created series · ' + (draft.name || 'Untitled') + ' · ' + draft.selected.length + ' posts');
                setFocusId('truk');
              }}
            />
          ) : (
          <React.Fragment>

          {/* Series masthead */}
          <div style={{
            padding: '28px 36px 20px',
            background: 'linear-gradient(180deg, var(--surface-2), var(--bg-base) 90%)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 6 }}>
              <window.R4PillarDot pillar={focus.pillar} size={7} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{focus.sub} · CASE FILE</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 38, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {focus.title}.
            </h1>
            <div style={{ marginTop: 8, maxWidth: 760, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>
              {focus.summary}
            </div>

            {/* KPI strip */}
            <div style={{ marginTop: 22, display: 'flex', gap: 36 }}>
              <window.R4Stat label="POSTS"          value={String(focus.posts.length)} sub={focus.sub} big />
              <window.R4Stat label="CUM. VIEWS"     value={focus.cumViewsK > 0 ? `${focus.cumViewsK}K` : '—'} sub="across YT · IG · TT" big />
              <window.R4Stat label="AVG COOPR"      value={focus.avgScore == null ? '—' : String(focus.avgScore)} sub={focus.avgScore != null && focus.avgScore >= 70 ? 'top quartile' : 'in flight'} big />
              <window.R4Stat label="WHAT'S COOKING" value={String(focus.cooking.length)} sub={focus.cooking.length === 0 ? 'nothing in Studio' : 'in Studio'} big />
            </div>
          </div>

          {/* Arc — chronological timeline of posts in series */}
          <div style={{ padding: '24px 36px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 18, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>
                The arc.
              </h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{focusPosts.length > 0 ? `FLAGSHIP IS ${focusPosts[0].id} · CSCORE ${focus.avgScore == null ? '—' : focus.avgScore}` : 'NO POSTS YET'}</span>
            </div>
            {/* Date axis */}
            <div style={{
              position: 'relative', padding: '0 4px',
            }}>
              <div style={{ height: 1, background: 'var(--border-default)', marginTop: 12, marginBottom: 12 }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22, flexWrap: 'wrap' }}>
                {focusPosts.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{p.publishedAt.toUpperCase()}</span>
                    <R4PlatformCard post={p} density="compact" perfMode="curve" />
                    {i === 0 && (
                      <span style={{
                        padding: '3px 8px',
                        background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
                        borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                      }}>FLAGSHIP</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two-up: What we learned + Still cooking */}
          <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
            {/* Learned */}
            <div style={{
              border: '1px solid var(--border-subtle)', borderRadius: 8,
              background: 'var(--surface-1)', padding: '20px 22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 17, color: 'var(--fg-primary)' }}>What we learned.</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{focus.memory.length} entries · Memory</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {focus.memory.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 14, borderBottom: i === focus.memory.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <div style={{ flexShrink: 0, width: 56, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>{m.ts.toUpperCase()}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: m.kind === 'decision' ? 'var(--accent-primary)' : 'var(--tone-info)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.kind}</span>
                    </div>
                    <div style={{ flex: 1, fontFamily: 'var(--font-serif)', fontSize: 14.5, color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
                      {m.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking */}
            <div style={{
              border: '1px solid var(--border-subtle)', borderRadius: 8,
              background: 'var(--surface-1)', padding: '20px 22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 17, color: 'var(--fg-primary)' }}>Still cooking.</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>STUDIO</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {focus.cooking.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px',
                    background: 'var(--surface-2)', borderRadius: 6, border: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 4,
                      background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                    }}>{c.id.replace('d0', '')}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>STAGE · {c.stage.toUpperCase()}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-primary)', fontWeight: 500 }}>open →</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 6, border: '1px dashed var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
                + Spin off a new project from this series
              </div>
            </div>
          </div>

          {/* Footer notes */}
          <div style={{ padding: '0 36px 60px', display: 'flex', alignItems: 'flex-start', gap: 24, fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SPINOFFS →</span>
            <span style={{ flex: 1, lineHeight: 1.5 }}>
              <span style={{ color: 'var(--fg-secondary)' }}>Fiji wreck</span> series in Studio inherits Truk's "open on the failure" pattern. <span style={{ color: 'var(--fg-secondary)' }}>0042</span> is the source for d010 (carousel) and shaped the safety-primer cold-open shift.
            </span>
          </div>

          </React.Fragment>
          )}
        </div>
      </div>
    </HfShell>
  );
}

// ─── Series rail item ────────────────────────────────────
// Visual weight: active series gets a thick accent left-stripe. Cooking
// series (drafts in Studio) get a thinner soft-accent stripe even when
// not active, plus a pill-style "N COOKING" label, so the rail sorts by
// momentum at a glance.
function R4SeriesRailItem({ series, active, onSelect, onMenuAction }) {
  const [hover, setHover] = React.useState(false);
  const [menu, setMenu] = React.useState(null); // null | { x, y }
  const isNew = !!series.isNew;
  const cooking = !isNew && series.cooking.length > 0;
  // simulated cumulative-views sparkline (hand-shaped, monotonic)
  const sparkPts = (() => {
    const n = 16;
    const out = [];
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * 80;
      const t = i / (n - 1);
      const y = 18 - (Math.pow(t, 1.6) * 16);
      out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return out.join(' ');
  })();
  const stripe = isNew
    ? (active ? '3px dashed var(--accent-primary)' : '3px dashed var(--border-default)')
    : active
      ? '3px solid var(--accent-primary)'
      : cooking
        ? '3px solid var(--accent-soft)'
        : '3px solid transparent';

  const showMenu = !isNew && hover && typeof onMenuAction === 'function';

  function openKebab(e) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenu({ x: rect.left - 180, y: rect.bottom + 4 });
  }
  function closeMenu() { setMenu(null); }

  const menuItems = [
    { kicker: 'EDIT',    label: 'Edit details',    onClick: () => onMenuAction && onMenuAction('edit') },
    { kicker: 'ADD',     label: 'Add post',        onClick: () => onMenuAction && onMenuAction('add') },
    { kicker: 'ARCHIVE', label: 'Archive series',  onClick: () => onMenuAction && onMenuAction('archive'), danger: true, divider: true },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect && onSelect(); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '14px 22px',
        borderLeft: stripe,
        background: active ? 'var(--surface-2)' : (hover ? 'var(--surface-2)' : 'transparent'),
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', gap: 6,
        cursor: 'pointer',
        transition: 'background 120ms ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {isNew ? (
          <span aria-hidden="true" style={{
            width: 10, height: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: active ? 'var(--accent-primary)' : 'var(--fg-tertiary)',
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1 V9 M1 5 H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </span>
        ) : (
          <window.R4PillarDot pillar={series.pillar} size={6} />
        )}
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 13.5,
          fontWeight: active ? 700 : 600,
          color: isNew ? (active ? 'var(--accent-primary)' : 'var(--fg-secondary)') : 'var(--fg-primary)',
          fontStyle: isNew ? 'normal' : 'normal',
        }}>{series.title}</span>
        {cooking && (
          <span style={{
            marginLeft: 'auto',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 7px',
            background: 'var(--accent-soft)', color: 'var(--accent-primary-press)',
            borderRadius: 999,
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.1em',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-primary)' }} />
            {series.cooking.length} COOKING
          </span>
        )}
        {showMenu && (
          <button
            type="button"
            aria-label={'More actions for ' + series.title}
            onClick={openKebab}
            style={{
              all: 'unset',
              marginLeft: cooking ? 6 : 'auto',
              width: 22, height: 22, borderRadius: 4,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-tertiary)',
              cursor: 'pointer',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
            }}>
            <svg width="3" height="13" viewBox="0 0 3 13" aria-hidden="true">
              <circle cx="1.5" cy="1.5"  r="1.2" fill="currentColor" />
              <circle cx="1.5" cy="6.5"  r="1.2" fill="currentColor" />
              <circle cx="1.5" cy="11.5" r="1.2" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: isNew ? (active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)') : 'var(--fg-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{series.sub}</div>
      {!isNew && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <svg width={80} height={20} viewBox="0 0 80 20" style={{ opacity: 0.85 }}>
            <polyline points={sparkPts} fill="none" stroke={active ? 'var(--accent-primary)' : 'var(--fg-tertiary)'} strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)', fontWeight: 600 }}>{series.cumViewsK > 0 ? `${series.cumViewsK}K` : '—'}</span>
        </div>
      )}
      {isNew && (
        <div style={{ marginTop: 2, fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.45 }}>
          Group existing posts, or start a new arc from a Studio doc.
        </div>
      )}
      {menu && (
        window.HF_ContextMenu
          ? <window.HF_ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={closeMenu} />
          : <R4SeriesInlineMenu x={menu.x} y={menu.y} items={menuItems} onClose={closeMenu} />
      )}
    </div>
  );
}

// Lightweight context-menu fallback when HF_ContextMenu is not loaded
// (e.g. Hi-fi round 4.html doesn't include hifi-context-menu.jsx; master.html does).
function R4SeriesInlineMenu({ x, y, items, onClose }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    function onDocDown(e) {
      const node = ref.current;
      if (!node || node.contains(e.target)) return;
      onClose();
    }
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  return (
    <div
      ref={ref}
      role="menu"
      style={{
        position: 'fixed', left: x, top: y,
        minWidth: 200,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        padding: '6px 0',
        zIndex: 80,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      }}
      onClick={(e) => e.stopPropagation()}>
      {items.map((it, i) => (
        <button
          key={i}
          role="menuitem"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof it.onClick === 'function') it.onClick();
            onClose();
          }}
          style={{
            all: 'unset',
            display: 'flex', alignItems: 'baseline', gap: 12,
            width: '100%', boxSizing: 'border-box',
            padding: '8px 14px',
            cursor: 'pointer',
            borderTop: i > 0 && it.divider ? '1px solid var(--border-subtle)' : 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: it.danger ? 'var(--tone-warning)' : 'var(--fg-tertiary)',
            minWidth: 22, textAlign: 'left',
          }}>{it.kicker}</span>
          <span style={{
            flex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize: 12.5, fontWeight: 500,
            color: it.danger ? 'var(--tone-warning)' : 'var(--fg-primary)',
            letterSpacing: '-0.005em',
          }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Series edit panel (in-pane, replaces the case-file view) ─
// Three-column form rhythm matches the case-file masthead so the
// transition feels like a state change, not a new page.
function R4SeriesEditPanel({ draft, setDraft, onCancel, onCreate }) {
  const inputRef = React.useRef(null);
  React.useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  function setField(key, value) { setDraft(d => Object.assign({}, d, { [key]: value })); }
  function togglePost(id) {
    setDraft(d => {
      const has = d.selected.indexOf(id) !== -1;
      const next = has ? d.selected.filter(x => x !== id) : d.selected.concat([id]);
      return Object.assign({}, d, { selected: next });
    });
  }

  const candidates = R4_NEW_SERIES_CANDIDATES
    .map(id => R4SD.posts.find(p => p.id === id))
    .filter(Boolean);

  const inputStyle = {
    all: 'unset',
    display: 'block', boxSizing: 'border-box',
    width: '100%',
    padding: '10px 12px',
    fontFamily: 'var(--font-sans)', fontSize: 13.5,
    color: 'var(--fg-primary)',
    background: 'var(--surface-1)',
    border: '1px solid var(--border-default)',
    borderRadius: 6,
    cursor: 'text',
  };
  const labelStyle = {
    fontFamily: 'var(--font-mono)', fontSize: 9.5,
    color: 'var(--fg-tertiary)', letterSpacing: '0.12em',
    textTransform: 'uppercase', marginBottom: 8,
  };
  const fieldGap = { display: 'flex', flexDirection: 'column' };

  return (
    <div>
      {/* Edit masthead — same rhythm as the case-file masthead */}
      <div style={{
        padding: '28px 36px 22px',
        background: 'linear-gradient(180deg, var(--surface-2), var(--bg-base) 90%)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--accent-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          New series · drafting
        </div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 38, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Set up a new series.
        </h1>
        <div style={{ marginTop: 8, maxWidth: 720, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>
          A series is a body of work — name it, place it under a pillar, and pick the posts that belong to it. You can refine cadence and add posts later.
        </div>
      </div>

      {/* Form body */}
      <div style={{ padding: '28px 36px 14px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', columnGap: 28, rowGap: 22 }}>
        <div style={fieldGap}>
          <span style={labelStyle}>Series name</span>
          <input
            ref={inputRef}
            type="text"
            value={draft.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="e.g. Fiji wreck"
            style={inputStyle}
          />
        </div>

        <div style={fieldGap}>
          <span style={labelStyle}>Pillar</span>
          <select
            value={draft.pillar}
            onChange={(e) => setField('pillar', e.target.value)}
            style={Object.assign({}, inputStyle, { cursor: 'pointer' })}>
            {R4_NEW_SERIES_PILLARS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>

        <div style={Object.assign({}, fieldGap, { gridColumn: '1 / span 2' })}>
          <span style={labelStyle}>Description</span>
          <textarea
            value={draft.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="One sentence about what ties these posts together — the place, the question, the throughline."
            rows={3}
            style={Object.assign({}, inputStyle, {
              minHeight: 78, resize: 'vertical', lineHeight: 1.5,
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
            })}
          />
        </div>

        <div style={fieldGap}>
          <span style={labelStyle}>Cadence target</span>
          <select
            value={draft.cadence}
            onChange={(e) => setField('cadence', e.target.value)}
            style={Object.assign({}, inputStyle, { cursor: 'pointer' })}>
            {R4_NEW_SERIES_CADENCES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        <div style={fieldGap}>
          <span style={labelStyle}>Selected</span>
          <div style={{
            padding: '10px 12px',
            border: '1px dashed var(--border-default)',
            borderRadius: 6,
            fontFamily: 'var(--font-sans)', fontSize: 12.5,
            color: 'var(--fg-secondary)',
            background: 'var(--surface-1)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)' }}>{draft.selected.length}</span>
            <span> of {candidates.length} candidate posts will join this series.</span>
          </div>
        </div>
      </div>

      {/* Posts to include */}
      <div style={{ padding: '8px 36px 28px' }}>
        <div style={Object.assign({}, labelStyle, { marginBottom: 12 })}>Posts to include</div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        }}>
          {candidates.map(p => {
            const checked = draft.selected.indexOf(p.id) !== -1;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePost(p.id)}
                style={{
                  all: 'unset',
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: '1px solid ' + (checked ? 'var(--accent-primary)' : 'var(--border-subtle)'),
                  background: checked ? 'var(--accent-soft)' : 'var(--surface-1)',
                  cursor: 'pointer',
                  transition: 'background 120ms ease, border-color 120ms ease',
                  boxSizing: 'border-box',
                }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 4,
                  border: '1.4px solid ' + (checked ? 'var(--accent-primary)' : 'var(--border-default)'),
                  background: checked ? 'var(--accent-primary)' : 'transparent',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {checked && (
                    <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true" style={{ color: 'var(--fg-on-accent)' }}>
                      <path d="M2 6.5 L5 9.5 L10 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span style={{
                  width: 32, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                  color: 'var(--fg-tertiary)', letterSpacing: '0.06em',
                  flexShrink: 0,
                }}>{p.id}</span>
                <span style={{
                  flex: 1, minWidth: 0,
                  fontFamily: 'var(--font-sans)', fontSize: 12.5,
                  color: checked ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
                  fontWeight: checked ? 600 : 500,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{p.title}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5,
                  color: 'var(--fg-tertiary)', letterSpacing: '0.06em',
                  flexShrink: 0,
                }}>{p.publishedAt.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer · cancel + create */}
      <div style={{
        position: 'sticky', bottom: 0,
        padding: '16px 36px',
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
      }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            all: 'unset',
            padding: '8px 14px',
            borderRadius: 6,
            border: '1px solid var(--border-default)',
            background: 'var(--surface-1)',
            fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600,
            color: 'var(--fg-secondary)',
            cursor: 'pointer',
          }}>Cancel</button>
        <button
          type="button"
          onClick={onCreate}
          disabled={!draft.name}
          style={{
            all: 'unset',
            padding: '8px 16px',
            borderRadius: 6,
            background: draft.name ? 'var(--accent-primary)' : 'var(--surface-2)',
            color: draft.name ? 'var(--fg-on-accent)' : 'var(--fg-tertiary)',
            fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 700,
            letterSpacing: '-0.005em',
            cursor: draft.name ? 'pointer' : 'not-allowed',
            border: '1px solid ' + (draft.name ? 'var(--accent-primary)' : 'var(--border-default)'),
          }}>Create series</button>
      </div>
    </div>
  );
}

function R4SLibTopbar({ onCreate } = {}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        type="button"
        onClick={() => { if (typeof onCreate === 'function') onCreate(); }}
        style={{
          all: 'unset',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 26, padding: '0 12px',
          borderRadius: 999,
          background: 'var(--accent-primary)',
          color: 'var(--fg-on-accent)',
          fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 700,
          letterSpacing: '-0.005em',
          cursor: 'pointer',
        }}>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 1 V9 M1 5 H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>Start a new series</span>
      </button>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 26, padding: '0 10px',
        border: '1px solid var(--border-subtle)', borderRadius: 6,
        background: 'var(--surface-2)',
        fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)',
      }}>
        <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
        <span>Search hooks, titles, themes…</span>
      </span>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
      }}>H</span>
    </div>
  );
}

Object.assign(window, { HF_R4_LibrarySeries });
