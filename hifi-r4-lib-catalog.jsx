/* global React, window, HfShell, R4PlatformCard, R4Chip, R4PillarDot, R4ChannelChip, r4FmtViews */
/* hifi-r4-lib-catalog.jsx — Library round 4 · Catalog (the main grid).

   Job: a place to LOOK at everything we've made, with performance visible at a
   glance, organized by rhythm not chronology, with disciplined spacing.

   Composition:
   - Top: small Library masthead (counts, last 30d delta, 'tracking 412 across 3 platforms')
   - Filter row 1: pillar dots (color-coded, all our coding lives here)
   - Filter row 2: lifecycle (All · Live · Trial · Graduated · Stale)
   - View bar: density toggle · perf overlay toggle · sort · selection mode
   - Body: a SECTIONED grid — not one long blanket. Sections are 'Best of last 30
     days' / 'Recent' / 'Worth revisiting' / 'Trial reels'. Each section uses
     CSS grid with auto-fit/min-content so mixed aspects wrap with rhythm. */

const R4_LIB_DATA = window.HF_DATA;

// Sectioning logic — the data is short so we synthesize plausible sections
// from the 12 posts we have. In a real app this would be query-driven.
function r4Sections(posts) {
  const v = window.R4_LIB_VISUALS;
  return [
    {
      key: 'pinned',
      title: 'Best of last 30 days',
      sub: 'Top quartile by Coopr Score · the ones to remember',
      ids: ['0042', '0044', '0039', '0040', '0036'],
    },
    {
      key: 'recent',
      title: 'Recent',
      sub: 'Last 12 publishes across all 3 platforms',
      ids: ['0046', '0045', '0043', '0038', '0037', '0035'],
    },
    {
      key: 'trials',
      title: 'Trial reels & retired posts',
      sub: 'Marked TRIAL · the ones we ran a hypothesis on',
      ids: ['0043', '0041'],
    },
  ].map(s => ({
    ...s,
    posts: s.ids.map(id => posts.find(p => p.id === id)).filter(Boolean),
  }));
}

// ─── Shared chrome ─────────────────────────────────────────
// The 3-band catalog chrome (identity strip + filter strip + control band) is
// reused across BOTH the masonry grid (HF_R4_LibraryCatalog) and the vertical
// feed variant (HF_R4_LibraryCatalogFeed). The body is passed as `children`
// so each variant only owns its layout. `view` lets the control band reflect
// which mode is active.
function R4CatalogChrome({ view = 'masonry', children, showSortDemo = false }) {
  // B3 · sort popover state. Defaults are calm; explicit demo routes can pin
  // the popover open while the button remains click-toggle in interactive view.
  const [sortOpen, setSortOpen] = React.useState(false);
  const [activeSort, setActiveSort] = React.useState('score');
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx && masterCtx.pushToast ? masterCtx.pushToast : (() => {});

  function openSortAt(e) {
    e.stopPropagation();
    setSortOpen(open => !open);
  }

  const sortOptions = [
    { id: 'score',    label: 'Coopr Score · highest' },
    { id: 'date',     label: 'Date · newest first' },
    { id: 'views',    label: 'Views · most watched' },
    { id: 'watch',    label: 'Watch through · best' },
    { id: 'saves',    label: 'Saves · most saved' },
  ];
  const activeSortLabel = (sortOptions.find(o => o.id === activeSort) || sortOptions[0]).label;
  const popoverOpen = showSortDemo || sortOpen;

  return (
    <HfShell workspace="library" subtab="Catalog" topbarRight={<R4LibTopbarRight />} subtabRight={<R4LibSubtabRight />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)' }}>

        {/* ─── Band 1 · identity + stats inline ───────────── */}
        <div style={{
          padding: '14px 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1 }}>Library</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>· 412 posts · 3 channels · 18 months</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <R4InlineStat label="LIVE"       value="404" />
            <R4InlineStat label="TRIAL"      value="6"   tone="accent" />
            <R4InlineStat label="GRADUATED"  value="38" />
            <R4InlineStat label="30D"        value="+18%" tone="success" />
          </div>
        </div>

        {/* ─── Band 2 · 3-axis filter strip · single line ──── */}
        <div style={{
          padding: '10px 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
          display: 'flex', alignItems: 'center', gap: 14,
          overflowX: 'auto',
        }}>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <R4Chip size="sm" active>All · 412</R4Chip>
            <R4PillarFilterChip pillar="safety" label="Dive safety"    count={172} />
            <R4PillarFilterChip pillar="gear"   label="Gear teardowns" count={114} />
            <R4PillarFilterChip pillar="story"  label="Story / travel" count={92} />
            <R4PillarFilterChip pillar="reply"  label="Replies / Q&A"  count={34} />
          </div>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <R4Chip size="sm">Live · 404</R4Chip>
            <R4Chip size="sm">Trial · 6</R4Chip>
            <R4Chip size="sm">Graduated · 38</R4Chip>
            <R4Chip size="sm">Stale · 14</R4Chip>
          </div>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <R4ChannelFilterChip ch="yt" count={186} />
            <R4ChannelFilterChip ch="ig" count={148} />
            <R4ChannelFilterChip ch="tt" count={78} />
          </div>
        </div>

        {/* ─── Band 3 · filter-active state + view toggle + controls ─── */}
        <div style={{
          padding: '8px 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', gap: 16,
          fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-secondary)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--accent-primary-press)', letterSpacing: '0.06em' }}>
              <span style={{ fontWeight: 700 }}>47</span> of <span style={{ fontWeight: 700 }}>412</span> · safety · live · YT
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>clear</span>
          </span>

          <span style={{ flex: 1 }} />

          {/* View toggle — Grid (default) · Masonry */}
          <SegSwitch
            label="View"
            options={['Grid', 'Masonry']}
            active={view === 'masonry' ? 'Masonry' : 'Grid'}
          />
          <SegSwitch label="Density" options={['Compact', 'Regular', 'Lush']}    active="Regular" />
          <SegSwitch label="Perf"    options={['Off', 'Curve', 'Numbers']}        active="Curve" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, position: 'relative' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sort</span>
            <button
              type="button"
              onClick={openSortAt}
              style={{
                all: 'unset',
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 8px',
                borderRadius: 6,
                background: popoverOpen ? 'var(--accent-soft)' : 'transparent',
                fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600,
                color: 'var(--fg-primary)', cursor: 'pointer',
                transition: 'background 160ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span>{activeSortLabel.split(' · ')[0]} ↓</span>
              <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 4 L5 7 L8 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* B3 · explicit demo routes can pin this open; canonical defaults stay closed. */}
            {popoverOpen && (
              <window.HF_SortPopover
                x={-32}
                y={28}
                options={sortOptions}
                activeId={activeSort}
                frozen={showSortDemo}
                onSelect={(opt) => { setActiveSort(opt.id); pushToast('Sort by · ' + opt.label); }}
                onClose={() => setSortOpen(false)}
              />
            )}
          </span>
          <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px',
            border: '1px solid var(--border-default)', borderRadius: 999,
            fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, color: 'var(--fg-secondary)',
            background: 'var(--surface-1)',
          }}>
            <svg width="10" height="10" viewBox="0 0 12 12"><rect x="1" y="2" width="4" height="8" stroke="currentColor" fill="none" strokeWidth="1.2" /><rect x="7" y="2" width="4" height="8" stroke="currentColor" fill="none" strokeWidth="1.2" /></svg>
            Compare 2–3
          </span>
        </div>

        {/* ─── Band 4 · applied filter chips ─────────────────
            B3 · the active filter set, made visible. Each chip shows the
            facet kicker + the matched value, with an X to remove. The
            ghost "+ add filter" pendant invites another. */}
        <div style={{
          padding: '10px 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <window.HF_FilterChip
            kicker="PILLAR"
            label="gear"
            onRemove={() => pushToast('Remove filter · pillar · gear')}
          />
          <window.HF_FilterChip
            kicker="CHANNEL"
            label="IG"
            onRemove={() => pushToast('Remove filter · channel · IG')}
          />
          <window.HF_FilterChip
            kicker="WINDOW"
            label="last 30d"
            onRemove={() => pushToast('Remove filter · last 30d')}
          />
          <window.HF_AddFilterChip
            onClick={() => pushToast('Add filter')}
          />
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>
            3 active · 47 of 412 posts
          </span>
        </div>

        {children}
      </div>
    </HfShell>
  );
}

function HF_R4_LibraryCatalog() {
  const posts = R4_LIB_DATA.posts;
  const sections = r4Sections(posts);
  return (
    <R4CatalogChrome view="masonry">
      <div style={{ padding: '8px 32px 60px' }}>
        {sections.map((sec, i) => (
          <R4Section key={sec.key} section={sec} index={i} />
        ))}
      </div>
    </R4CatalogChrome>
  );
}

// ─── Section block ───────────────────────────────────────
// Layout strategy:
//   pinned (Best of last 30 days) → editorial spread:
//     hero post on the left (large thumbnail · title + opening line + score
//     block beside), 4-col masonry of remaining posts below.
//   recent / trials → 4-col masonry packed tight (no flex-wrap dead space).
//
// Masonry is implemented by round-robin distribution across N columns; each
// column is a flex-column with uniform gap. Cards adopt the column width via
// the new `colWidth` prop on R4PlatformCard so mixed aspects (16:9 / 9:16 /
// 1:1) stack nose-to-tail with no holes — the platform-faithfulness lives in
// the per-card aspect ratio, not the card width.
const R4_BODY_PAD_X = 32;          // matches the section block's px padding
const R4_SHELL_W   = 1440;
const R4_GUTTER    = 22;
const R4_MASONRY_COLS = 3;         // R5d: lush default · 3 columns at 1440 → 446px each
const R4_COL_WIDTH = Math.floor(
  (R4_SHELL_W - R4_BODY_PAD_X * 2 - R4_GUTTER * (R4_MASONRY_COLS - 1)) / R4_MASONRY_COLS
);
const R4_HERO_W = 660;             // Hero stays fixed; doesn't scale with column count.

function R4Section({ section, index = 0 }) {
  const isPinned = section.key === 'pinned';
  // Pinned section: split off post[0] as hero, remaining posts go to masonry.
  const heroPost = isPinned ? section.posts[0] : null;
  const gridPosts = isPinned ? section.posts.slice(1) : section.posts;

  // Pinned section frames itself on warm paper (surface-1) with negative
  // x-margin to bleed to the body padding edges + a thin top fade. Other
  // sections sit on bg-base. Visual cue: "this is the curated set."
  const sectionBg = isPinned ? 'var(--surface-1)' : 'transparent';
  const sectionBleed = isPinned
    ? { marginLeft: -R4_BODY_PAD_X, marginRight: -R4_BODY_PAD_X, paddingLeft: R4_BODY_PAD_X, paddingRight: R4_BODY_PAD_X, borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }
    : {};
  return (
    <section style={{ paddingTop: 36, paddingBottom: isPinned ? 36 : 8, background: sectionBg, ...sectionBleed }}>
      {/* ── Decorative editorial header ───────────────────
          Oversize italic-serif numeral on the left, title + sub stacked beside.
          Underlined by a thin clay rule that runs the section width — gives the
          page editorial punctuation rather than a uniform header. */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, paddingBottom: 14, borderBottom: '1px solid var(--accent-soft)', marginBottom: 22 }}>
        <span style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
          fontSize: 76, color: 'var(--accent-primary)', letterSpacing: '-0.04em',
          lineHeight: 0.85, flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 6 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1 }}>
            {section.title}
          </h2>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-tertiary)' }}>
            <span>{section.sub}</span>
            <span style={{ width: 1, height: 10, background: 'var(--border-default)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em' }}>{section.posts.length} POSTS</span>
          </div>
        </div>
        <span style={{
          alignSelf: 'flex-end', paddingBottom: 8,
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)',
          letterSpacing: '0.12em', cursor: 'default',
        }}>SEE ALL →</span>
      </div>

      {/* ── Hero (pinned only) ──────────────────────────── */}
      {heroPost && <R4Hero post={heroPost} />}

      {/* ── Masonry pack (all sections) ─────────────────── */}
      <R4Masonry posts={gridPosts} cols={R4_MASONRY_COLS} colWidth={R4_COL_WIDTH} gutter={R4_GUTTER} />
    </section>
  );
}

// Round-robin masonry: split posts into N columns by index, render each
// column as a flex-column with consistent gap. No flex-wrap dead space.
function R4Masonry({ posts, cols, colWidth, gutter }) {
  if (!posts || posts.length === 0) return null;
  const columns = Array.from({ length: cols }, () => []);
  posts.forEach((p, i) => columns[i % cols].push(p));
  return (
    <div style={{ display: 'flex', gap: gutter, alignItems: 'flex-start' }}>
      {columns.map((col, ci) => (
        <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: '0 0 auto', width: colWidth }}>
          {col.map(p => (
            <R4PlatformCard
              key={p.id}
              post={p}
              density="regular"
              perfMode="curve"
              colWidth={colWidth}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Hero card — used in the pinned section. Big thumbnail on the left, title +
// opening line + score block beside on the right. Spans roughly half the
// section width so it visually outranks the masonry below without dominating.
function R4Hero({ post }) {
  const v = window.R4_LIB_VISUALS[post.id] || {};
  const display = v.display || 'long-yt';
  // Hero is a fixed editorial size, independent of the column count, so it
  // doesn't dominate the page when columns get wider.
  const heroThumbW = R4_HERO_W;
  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: `${heroThumbW}px 1fr`,
      gap: 32, marginBottom: 36,
      padding: '4px 0 24px', borderBottom: '1px dashed var(--border-default)',
    }}>
      {/* Big thumbnail — reuses R4PlatformCard via colWidth */}
      <div style={{ position: 'relative' }}>
        <R4PlatformCard post={post} density="regular" perfMode="numbers" colWidth={heroThumbW} hoverHint />
      </div>
      {/* Hero metadata — sits at the height of the thumbnail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignSelf: 'center', paddingRight: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.16em' }}>
          FLAGSHIP · {post.publishedAt.toUpperCase()} · {window.r4PlatformLabel(display)}
        </div>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 38, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          {post.title}.
        </h3>
        <blockquote style={{
          margin: 0, padding: '12px 16px',
          borderLeft: '3px solid var(--accent-primary)',
          background: 'var(--surface-1)',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', lineHeight: 1.5,
        }}>
          "My reg started free-flowing at 28 metres. I'd been on the Fujikawa Maru for nine minutes."
        </blockquote>
        {/* Stat row */}
        <div style={{ display: 'flex', gap: 28, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
          <R4HeroStat label="COOPR" value={String(v.cooprScore ?? '—')} accent />
          <R4HeroStat label="VIEWS" value={window.r4FmtViews(post.views)} />
          <R4HeroStat label="WATCH" value={`${(post.watchPct * 100).toFixed(0)}%`} />
          <R4HeroStat label="SAVES" value={window.r4FmtViews(post.saves)} />
        </div>
      </div>
    </article>
  );
}

function R4HeroStat({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: accent ? 'var(--accent-primary)' : 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1 }}>{value}</span>
    </div>
  );
}

// ─── Helper — pillar filter chip with dot + count ────────
function R4PillarFilterChip({ pillar, label, count }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px',
      border: '1px solid var(--border-default)',
      borderRadius: 999,
      fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)',
      background: 'var(--surface-1)',
    }}>
      <window.R4PillarDot pillar={pillar} size={7} />
      {label}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)' }}>· {count}</span>
    </span>
  );
}
function R4ChannelFilterChip({ ch, count }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px',
      border: '1px solid var(--border-default)',
      borderRadius: 999,
      fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-secondary)',
      background: 'var(--surface-1)',
    }}>
      <window.R4ChannelChip ch={ch} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)' }}>{count}</span>
    </span>
  );
}

// ─── Topbar / subtab right ────────────────────────────────
function R4LibTopbarRight() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 26, padding: '0 10px',
        border: '1px solid var(--border-subtle)', borderRadius: 6,
        background: 'var(--surface-2)',
        fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)',
      }}>
        <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
        <span>Search hooks, titles, themes…</span>
        <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', padding: '1px 5px', border: '1px solid var(--border-subtle)', borderRadius: 3 }}>⌘K</span>
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

function R4LibSubtabRight() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>UPDATED 6m ago</span>
      <span style={{ width: 1, height: 12, background: 'var(--border-subtle)' }} />
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 10px',
        background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
        borderRadius: 999,
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
      }}>
        <span style={{ fontSize: 12, lineHeight: 1 }}>+</span> New post
      </span>
    </div>
  );
}

// ─── Inline stat (single line · value + tiny mono label) ─
// Used in the compact identity strip. value is mono+bold, label is mono+muted.
// tone='accent' → clay value · tone='success' → moss value · default → ink.
function R4InlineStat({ label, value, tone }) {
  const valColor = tone === 'success' ? 'var(--tone-success)'
                  : tone === 'accent'  ? 'var(--accent-primary)'
                  : 'var(--fg-primary)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: valColor, letterSpacing: '-0.01em' }}>{value}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{label}</span>
    </span>
  );
}

// ─── Segmented switch ────────────────────────────────────
function SegSwitch({ label, options, active }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{
        display: 'inline-flex',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 999, padding: 2, gap: 0,
      }}>
        {options.map(opt => (
          <span key={opt} style={{
            padding: '3px 10px',
            background: opt === active ? 'var(--surface-ink)' : 'transparent',
            color: opt === active ? 'var(--fg-on-ink)' : 'var(--fg-secondary)',
            borderRadius: 999,
            fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: opt === active ? 600 : 500,
            cursor: 'default',
          }}>{opt}</span>
        ))}
      </span>
    </span>
  );
}

Object.assign(window, { HF_R4_LibraryCatalog, R4CatalogChrome });
