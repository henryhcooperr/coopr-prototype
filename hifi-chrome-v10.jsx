/* global React, window */
/* hifi-chrome-v10.jsx — FULL-FIDELITY DR3 (List + preview pane) prototype.

   The DR3 drawer is the chosen direction. This page is fully interactive:
     • Click any workspace tab in the pill → switch workspace + open drawer
     • Click the active workspace's chevron → toggle drawer
     • Hover a subtab in the drawer's left list → preview pane updates live
     • Click a subtab → commit · close drawer · render the actual surface below
     • Click outside the drawer → close drawer (no commit)

   Every workspace + subtab combination renders a real surface (HF_*) below
   the chrome. Surfaces that aren't built yet show a "not yet built" placeholder
   styled to match. The slim-HfShell patch strips each surface's native
   topbar / subtabs so they nest cleanly under the v10 chrome.
*/

if (typeof window !== 'undefined' && window.HfShell && !window.__cv10Patched) {
  window.__OrigHfShellV10 = window.__OrigHfShell || window.HfShell;
  window.HfShell = function HfShellSlimV10({ children, style = {} }) {
    return (
      <div className="hf" style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'var(--bg-base)', fontFamily: 'var(--font-sans)',
        color: 'var(--fg-primary)', overflow: 'auto',
        ...style,
      }}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    );
  };
  window.__cv10Patched = true;
}

const C10 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

// ─── Workspace order (locked) ───────────────────────────────
// `fresh` = workspace has new activity since last visit. Drives a small clay
// dot in the chrome — ambient awareness without a loud notification badge.
const WS_ORDER = [
  { id: 'home',     label: 'Home',     fresh: false },
  { id: 'studio',   label: 'Studio',   fresh: false },
  { id: 'library',  label: 'Library',  fresh: false },
  { id: 'insights', label: 'Insights', fresh: true  },
  { id: 'intel',    label: 'Intel',    fresh: true  },
  { id: 'inbox',    label: 'Inbox',    fresh: true  },
  { id: 'calendar', label: 'Calendar', fresh: false },
];

// ─── Per-workspace metadata + per-subtab preview content + surface name ──
// `surface` is the global window key for the React component to render.
// `null` = surface not yet built; placeholder shown.
const WS_META = {
  home: {
    label: 'Home',
    subs: [
      { id: 'Today',    kicker: 'WHAT IS HAPPENING',     desc: 'Today’s briefing — what to ship, what to read.',  stats: [{l: 'Threads', v: '12', t: 'flat'}, {l: 'Drafts', v: '3', t: 'up'}, {l: 'Due', v: '2', t: 'down'}],         surface: 'HF_HomeChat' },
      { id: 'Threads',  kicker: 'CONVERSATIONS',          desc: 'Recent chats with the agent — pinned + active.',  stats: [{l: 'Active', v: '4', t: 'up'}, {l: 'Pinned', v: '6', t: 'flat'}, {l: 'Archived', v: '218', t: 'up'}],     surface: null },
      { id: 'Briefing', kicker: 'TODAY · STANDALONE',     desc: 'Full briefing card — week ahead + library pulse.', stats: [{l: 'Posts due', v: '4', t: 'flat'}, {l: 'Recent wins', v: '2', t: 'up'}, {l: 'One-thing', v: '1', t: 'flat'}], surface: 'HF_HomeBriefingCollapsed' },
      { id: 'Activity', kicker: 'RECENT ACTIVITY',         desc: 'What the agent did, what you did, in order.',     stats: [{l: 'Today', v: '24', t: 'up'}, {l: 'This week', v: '187', t: 'up'}, {l: 'By agent', v: '64%', t: 'up'}],   surface: null },
    ],
  },
  studio: {
    label: 'Studio',
    subs: [
      { id: 'Workspace', kicker: 'WHAT YOU ARE WORKING ON', desc: 'Free-form gallery of projects, with status pills and agent activity hints.', stats: [{l: 'Pinned', v: '3', t: 'flat'}, {l: 'Total', v: '18', t: 'up'}, {l: 'Due this week', v: '4', t: 'flat'}], surface: 'HF_StudioWorkspace' },
      { id: 'Clip Lab',  kicker: 'AUTO-DETECTED MOMENTS',   desc: 'Drop footage; Coopr finds the best 9:16 verticals.',                          stats: [{l: 'Pending', v: '12', t: 'up'}, {l: 'Reviewed', v: '48', t: 'up'}, {l: 'Published', v: '31', t: 'up'}], surface: 'HF_ClipLabEmpty' },
      { id: 'Docs',      kicker: 'WRITTEN PROJECTS',         desc: 'Long-form scripts, hooks, notes; the agent edits inline.',                    stats: [{l: 'Drafts', v: '7', t: 'flat'}, {l: 'Words', v: '24.3k', t: 'up'}, {l: 'Open', v: '3', t: 'flat'}], surface: 'HF_StudioDocFull' },
      { id: 'List',      kicker: 'EVERYTHING IN ONE TABLE',  desc: 'All projects, sortable by status, due, pillar, words.',                        stats: [{l: 'Items', v: '18', t: 'up'}, {l: 'Overdue', v: '1', t: 'down'}, {l: 'Words', v: '24.3k', t: 'up'}], surface: 'HF_StudioList' },
      { id: 'Calendar',  kicker: 'PROJECT DUE DATES',         desc: 'Per-project deadlines; distinct from cross-platform post schedule.',         stats: [{l: 'This week', v: '4', t: 'flat'}, {l: 'Next week', v: '6', t: 'up'}, {l: 'Overdue', v: '1', t: 'down'}], surface: 'HF_StudioCalendar' },
      { id: 'Shipped',   kicker: 'WHAT WENT OUT',             desc: 'The archive — what shipped, when, where.',                                    stats: [{l: 'This month', v: '14', t: 'up'}, {l: 'Lifetime', v: '404', t: 'up'}, {l: 'Avg time', v: '8d', t: 'down'}], surface: 'HF_StudioShipped' },
    ],
  },
  library: {
    label: 'Library',
    subs: [
      { id: 'Catalog',  kicker: 'EVERYTHING YOU MADE',   desc: '404 posts across 3 platforms, sectioned by recency and pillar.', stats: [{l: 'Live', v: '404', t: 'up'}, {l: 'Trial', v: '6', t: 'flat'}, {l: 'Graduated', v: '38', t: 'up'}], surface: 'HF_R4_LibraryCatalogGrid' },
      { id: 'Series',   kicker: 'CASE FILES',             desc: 'Multi-part projects, organized as journals.',                  stats: [{l: 'Active', v: '7', t: 'up'}, {l: 'In series', v: '132', t: 'up'}, {l: 'Top lift', v: '+58%', t: 'up'}], surface: 'HF_R4_LibrarySeries' },
      { id: 'Patterns', kicker: 'PILLARS / FORMATS / DNA', desc: 'What makes a post work for you — and what doesn’t.',           stats: [{l: 'Pillars', v: '4', t: 'flat'}, {l: 'Top yield', v: '1.42×', t: 'up'}, {l: 'Hooks', v: '47', t: 'up'}], surface: 'HF_R4_LibraryPatterns' },
      { id: 'Timeline', kicker: 'THE JOURNAL',            desc: 'One row per month — flagships, locations, learnings.',         stats: [{l: 'Months', v: '14', t: 'flat'}, {l: 'Flagships', v: '9', t: 'up'}, {l: 'Locations', v: '6', t: 'up'}], surface: 'HF_R4_LibraryTimeline' },
      { id: 'Pairings', kicker: 'ONE IDEA × THREE',       desc: 'Same idea, three channels — see what ports.',                  stats: [{l: 'Ideas', v: '9', t: 'flat'}, {l: 'Channels', v: '3', t: 'flat'}, {l: 'Coverage', v: '42%', t: 'up'}], surface: 'HF_R4_LibraryPairing' },
      { id: 'Compare',  kicker: 'SIDE BY SIDE',           desc: 'Three posts overlaid on one chart with synthesis rail.',        stats: [{l: 'Active', v: '3', t: 'flat'}, {l: 'Top watch', v: '81%', t: 'up'}, {l: 'Top save', v: '4.6%', t: 'up'}], surface: 'HF_R4_LibraryCompare' },
    ],
  },
  insights: {
    label: 'Insights',
    subs: [
      { id: 'Overview',   kicker: '30-DAY SNAPSHOT',     desc: 'Where the volume lives this month.',           stats: [{l: 'Saves', v: '+22%', t: 'up'}, {l: 'Views', v: '+12%', t: 'up'}, {l: 'Channel', v: '−4%', t: 'down'}], surface: 'HF_InsightsOverview' },
      { id: 'Retention',  kicker: 'WATCH-CURVE ANALYSIS', desc: 'How long viewers stay; where they drop.',       stats: [{l: 'Median', v: '64%', t: 'up'}, {l: 'Drop', v: '1:42', t: 'flat'}, {l: 'Top quartile', v: '81%', t: 'up'}], surface: 'HF_InsightsRetention' },
      { id: 'Format DNA', kicker: 'PATTERN RECOGNITION', desc: 'Hooks, structures, and channels by lift.',       stats: [{l: 'Patterns', v: '12', t: 'flat'}, {l: 'Top hook', v: '+38%', t: 'up'}, {l: 'Coverage', v: '78%', t: 'up'}], surface: 'HF_InsightsFormatDNA' },
      { id: 'Audience',   kicker: 'DEMOGRAPHIC + INTENT', desc: 'Who is watching, and how much they say.',       stats: [{l: 'Net new', v: '+11.4k', t: 'up'}, {l: 'Sentiment', v: '+0.62', t: 'up'}, {l: 'Sub conv', v: '2.6%', t: 'up'}], surface: 'HF_InsightsAudience' },
      { id: 'Posting',    kicker: 'CADENCE + COVERAGE',   desc: 'Volume, timing, and channel mix.',              stats: [{l: 'Per week', v: '3.2', t: 'down'}, {l: 'On-time', v: '92%', t: 'up'}, {l: 'IG gap', v: '4d', t: 'down'}], surface: 'HF_InsightsPosting' },
    ],
  },
  intel: {
    label: 'Intel',
    subs: [
      { id: 'Trends',      kicker: 'WHAT IS MOVING',          desc: 'Topics rising in your corner of the world.',  stats: [{l: 'Active', v: '8', t: 'up'}, {l: 'New today', v: '2', t: 'up'}, {l: 'Falling', v: '3', t: 'down'}],   surface: null },
      { id: 'Radar',       kicker: 'COMPETITIVE WATCH',       desc: 'Creators near your space, ranked by velocity.', stats: [{l: 'Tracked', v: '42', t: 'flat'}, {l: 'New', v: '4', t: 'up'}, {l: 'Hot', v: '7', t: 'up'}],            surface: 'HF_IntelRadar' },
      { id: 'Inspiration', kicker: 'IDEAS WORTH STEALING',    desc: 'Saved snippets, screenshots, and references.',  stats: [{l: 'Saved', v: '124', t: 'up'}, {l: 'Tagged', v: '87', t: 'up'}, {l: 'Used', v: '18', t: 'up'}],         surface: 'HF_IntelInspiration' },
      { id: 'DNA',         kicker: 'CREATIVE FINGERPRINT',    desc: 'What makes you, you — pillars and voice.',      stats: [{l: 'Pillars', v: '4', t: 'flat'}, {l: 'Voice', v: '82', t: 'up'}, {l: 'Niche fit', v: '94%', t: 'up'}], surface: 'HF_IntelDNA' },
      { id: 'Memory',      kicker: 'WHAT THE APP REMEMBERS',  desc: 'Knowledge base, lineage, and prior lessons.',   stats: [{l: 'Snippets', v: '318', t: 'up'}, {l: 'Lessons', v: '42', t: 'up'}, {l: 'Links', v: '128', t: 'up'}], surface: 'HF_IntelMemory' },
      { id: 'Studies',     kicker: 'DEEPER ANALYSES',         desc: 'Long-form takes you can return to.',           stats: [{l: 'Active', v: '3', t: 'flat'}, {l: 'Done', v: '9', t: 'up'}, {l: 'Words', v: '42k', t: 'up'}],           surface: 'HF_IntelStudies' },
    ],
  },
  inbox: {
    label: 'Inbox',
    subs: [
      { id: 'Comments', kicker: 'WHAT VIEWERS SAY',  desc: 'Comments across all platforms, intent-grouped.', stats: [{l: 'Today', v: '214', t: 'up'}, {l: 'Week', v: '1.2k', t: 'up'}, {l: 'Pending', v: '18', t: 'down'}],     surface: 'HF_InboxComments_R2' },
      { id: 'DMs',      kicker: 'BRAND + COLLAB',     desc: 'Private messages, sorted by brand-fit score.',   stats: [{l: 'Today', v: '42', t: 'up'}, {l: 'Brand', v: '7', t: 'up'}, {l: 'Top fit', v: '88', t: 'up'}],          surface: 'HF_InboxDMs_R2' },
      { id: 'Mentions', kicker: 'WHO TAGGED YOU',     desc: 'Mentions and tags worth a look.',                stats: [{l: 'Today', v: '18', t: 'up'}, {l: 'Influencers', v: '4', t: 'up'}, {l: 'Sentiment', v: '+0.71', t: 'up'}], surface: 'HF_InboxMentions' },
      { id: 'Replies',  kicker: 'YOUR SENT REPLIES',  desc: 'Replies and follow-ups, with response time.',     stats: [{l: 'Today', v: '24', t: 'up'}, {l: 'Within 24h', v: '92%', t: 'up'}, {l: 'Open', v: '7', t: 'flat'}],     surface: 'HF_InboxReplies' },
    ],
  },
  calendar: {
    label: 'Calendar',
    subs: [
      { id: 'Week',       kicker: 'WEEK VIEW',          desc: 'Cross-platform schedule for the active week.',     stats: [{l: 'Scheduled', v: '14', t: 'up'}, {l: 'Drafts', v: '4', t: 'flat'}, {l: 'Open slots', v: '6', t: 'down'}], surface: 'HF_Calendar' },
      { id: 'Day',        kicker: 'HOUR-BY-HOUR',       desc: 'Vertical hour spine for one day, with a now line.', stats: [{l: 'Today', v: '4', t: 'flat'}, {l: 'Best window', v: '6:30p', t: 'flat'}, {l: 'Conflict', v: '0', t: 'up'}], surface: 'HF_CalendarDay' },
      { id: 'Month',      kicker: 'GRID OVERVIEW',      desc: 'April at a glance — daily counts and top slots.',    stats: [{l: 'This month', v: '36', t: 'up'}, {l: 'Active days', v: '22', t: 'up'}, {l: 'Conflicts', v: '1', t: 'down'}], surface: 'HF_CalendarMonth' },
      { id: 'Conflicts',  kicker: 'OVERLAP RESOLUTION',  desc: 'Scheduling conflicts to resolve, ordered by date.',  stats: [{l: 'Active', v: '1', t: 'flat'}, {l: 'Resolved', v: '14', t: 'up'}, {l: 'IG double-book', v: '1', t: 'down'}], surface: 'HF_CalendarConflict' },
    ],
  },
};

// ─── Sea lion crop ──────────────────────────────────────────
function SeaLion({ size = 22 }) {
  return (
    <span style={{
      width: size, height: size,
      backgroundImage: 'url(coopr-logo.png)',
      backgroundSize: `${size * (1205 / 341)}px ${size}px`,
      backgroundPosition: 'left center', backgroundRepeat: 'no-repeat',
      display: 'inline-block', flexShrink: 0,
    }} />
  );
}

// ─── Trend arrow ────────────────────────────────────────────
function TrendArrow({ trend }) {
  if (trend === 'up')   return <svg width="8" height="8" viewBox="0 0 8 8"><path d="M2 6 L4 2 L6 6" stroke="var(--tone-success)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (trend === 'down') return <svg width="8" height="8" viewBox="0 0 8 8"><path d="M2 2 L4 6 L6 2" stroke="var(--tone-warning)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <svg width="8" height="8" viewBox="0 0 8 8"><line x1="2" y1="4" x2="6" y2="4" stroke="var(--fg-tertiary)" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

// ─── Render the active surface (or a placeholder if not built) ─
function ActiveSurface({ wsId, subId }) {
  const meta = WS_META[wsId];
  let key;
  if (!meta.subs.length) {
    key = meta.surface;
  } else {
    const sub = meta.subs.find(s => s.id === subId);
    key = sub ? sub.surface : null;
  }
  const Comp = key ? window[key] : null;
  if (Comp) return <Comp />;
  return (
    <div style={{
      flex: 1, minHeight: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: 64, background: 'var(--bg-base)',
    }}>
      <span style={{ fontFamily: C10.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>
        SURFACE NOT YET BUILT
      </span>
      <h2 style={{ margin: 0, fontFamily: C10.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.022em', textAlign: 'center', lineHeight: 1.15 }}>
        {meta.label} · {subId}
      </h2>
      <p style={{ margin: 0, fontFamily: C10.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 480, textAlign: 'center', lineHeight: 1.55 }}>
        The drawer routes here; the surface itself hasn’t been drafted yet. The chrome and the navigation are real — only the destination is empty.
      </p>
      {/* Draft-this CTA — keeps the navigation from dead-ending */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8,
        padding: '8px 16px', borderRadius: 999,
        background: 'var(--surface-1)',
        border: '1px solid color-mix(in srgb, var(--accent-primary) 24%, transparent)',
        color: 'var(--accent-primary-press)',
        fontFamily: C10.sans, fontSize: 12.5, fontWeight: 600,
        cursor: 'pointer', userSelect: 'none',
        boxShadow: '0 4px 12px -6px color-mix(in srgb, var(--accent-primary) 24%, transparent)',
      }}>
        Draft {meta.label} · {subId}
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 8 L8 2 M5 2 L8 2 L8 5" stroke="var(--accent-primary)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    </div>
  );
}

// (Pill markup is inlined inside HF_ChromeIdeationV10 to keep click/hover
// handlers state-coupled — no prop drilling. Reference primitive lives in v7.)

// ─── Drawer body (list + preview) ───────────────────────────
function DrawerBody({ wsId, previewSub, onSubHover, onSubCommit }) {
  const meta = WS_META[wsId];
  const subs = meta.subs;
  const previewItem = subs.find(s => s.id === previewSub) || subs[0];
  return (
    <div style={{ display: 'flex', height: 156, flexShrink: 0 }}>
      {/* LEFT · vertical list */}
      <div style={{
        width: 320, padding: '12px 16px',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <span style={{ fontFamily: C10.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700, marginBottom: 4 }}>
          {meta.label.toUpperCase()} · {subs.length} VIEW{subs.length === 1 ? '' : 'S'}
        </span>
        {subs.map((s, i) => {
          const a = s.id === previewSub;
          return (
            <span key={s.id}
              onMouseEnter={() => onSubHover(s.id)}
              onClick={() => onSubCommit(s.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', borderRadius: 6,
                background: a ? 'var(--accent-soft)' : 'transparent',
                cursor: 'pointer', userSelect: 'none',
                transition: 'background 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: 0,
                animation: `cv10-list-in 360ms cubic-bezier(0.16, 1, 0.3, 1) ${120 + i * 45}ms forwards`,
              }}>
              <span style={{
                fontFamily: a ? C10.serif : C10.sans, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14 : 13, fontWeight: a ? 600 : 500,
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
              }}>{s.id}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: C10.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>
                <TrendArrow trend={s.stats[0].t} />
                {s.stats[0].v} {s.stats[0].l.toLowerCase()}
              </span>
            </span>
          );
        })}
      </div>
      {/* RIGHT · preview pane */}
      <div key={previewItem.id} style={{
        flex: 1, padding: '16px 24px',
        display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
        animation: 'cv10-preview-in 360ms cubic-bezier(0.16, 1, 0.3, 1) 280ms backwards',
      }}>
        <span style={{ fontFamily: C10.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>{previewItem.kicker}</span>
        <span style={{ fontFamily: C10.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.15 }}>{previewItem.desc}</span>
        <div style={{ display: 'flex', gap: 24, marginTop: 4, alignItems: 'flex-end' }}>
          {previewItem.stats.map(stat => (
            <span key={stat.l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: C10.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>{stat.l}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendArrow trend={stat.t} />
                <span style={{ fontFamily: C10.mono, fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums' }}>{stat.v}</span>
              </span>
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <span
            onClick={() => onSubCommit(previewItem.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 999,
              background: 'var(--accent-primary)',
              color: 'var(--fg-on-accent)',
              fontFamily: C10.sans, fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', userSelect: 'none',
              boxShadow: '0 6px 14px -8px color-mix(in srgb, var(--accent-primary) 40%, transparent)',
              transition: 'transform 160ms ease',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Open {previewItem.id}
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="var(--fg-on-accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Easing curves ──────────────────────────────────────────
// All chrome motion uses ease-out-expo — feels softer / less mechanical than
// standard cubic-bezier(0.4,0,0.2,1). Cited from Apple HIG motion + Tailwind
// motion-safe defaults.
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ─── Main interactive prototype ─────────────────────────────
// Hover model:
//   - Mouse enters the chrome area + active workspace has subs → drawer opens
//   - Mouse hovers a different workspace tab → drawer content swaps to that
//     workspace's subtabs (preview only — does not commit activeWs)
//   - Mouse hovers a subtab → preview pane updates
//   - Mouse leaves the chrome area → drawer closes after a 240ms grace period
//   - Click on a workspace → commits activeWs (renders surface)
//   - Click on a subtab → commits activeWs = hoverWs + activeSub, closes drawer
//
// Smoothness moves:
//   • Sliding clay indicator — one shared underline element that translates
//     between active workspace positions instead of pop-in / pop-out per tab.
//   • Color-only hover — hovering a workspace just shifts its color toward
//     accent-primary-press; no font-family / size / weight change so layout
//     stays still.
//   • EASE_OUT_EXPO curves on every transition — softer than the default.
function HF_ChromeIdeationV10() {
  const [activeWs, setActiveWs] = React.useState('insights');
  const [activeSubByWs, setActiveSubByWs] = React.useState({
    home: 'Today', insights: 'Overview', library: 'Catalog', studio: 'Workspace',
    intel: 'Radar', inbox: 'Comments', calendar: 'Week',
  });
  const [hoverWs, setHoverWs] = React.useState('insights');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [previewSub, setPreviewSub] = React.useState('Overview');
  const [justOpened, setJustOpened] = React.useState(false);
  const closeTimerRef = React.useRef(null);

  // Two sliding indicators measured from the same DOM:
  //   - active: the clay-tinted "you are here" pill, follows activeWs
  //   - hover:  the warm-gray "you are previewing here" pill, follows hoverWs
  //             (only visible when drawer is open AND hoverWs !== activeWs)
  const tabsRowRef = React.useRef(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ x: 0, w: 0, ready: false });
  const [hoverIndicator, setHoverIndicator] = React.useState({ x: 0, w: 0, ready: false });

  React.useLayoutEffect(() => {
    if (!tabsRowRef.current) return;
    const el = tabsRowRef.current.querySelector(`[data-ws="${activeWs}"]`);
    if (!el) return;
    const elRect = el.getBoundingClientRect();
    const containerRect = tabsRowRef.current.getBoundingClientRect();
    setIndicatorStyle({
      x: elRect.left - containerRect.left,
      w: elRect.width,
      ready: true,
    });
  }, [activeWs]);

  // Hover indicator updates when hoverWs changes while drawer is open
  React.useLayoutEffect(() => {
    if (!tabsRowRef.current || !drawerOpen || hoverWs === activeWs) {
      setHoverIndicator(prev => ({ ...prev, ready: false }));
      return;
    }
    const el = tabsRowRef.current.querySelector(`[data-ws="${hoverWs}"]`);
    if (!el) return;
    const elRect = el.getBoundingClientRect();
    const containerRect = tabsRowRef.current.getBoundingClientRect();
    setHoverIndicator({
      x: elRect.left - containerRect.left,
      w: elRect.width,
      ready: true,
    });
  }, [hoverWs, drawerOpen, activeWs]);

  React.useEffect(() => {
    if (drawerOpen) {
      setJustOpened(true);
      const id = setTimeout(() => setJustOpened(false), 800);
      return () => clearTimeout(id);
    }
  }, [drawerOpen]);

  // Keyboard: ESC closes the drawer (no commit)
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
        setHoverWs(activeWs);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, activeWs]);

  const meta = WS_META[activeWs];
  const hasSubs = meta.subs.length > 0;
  const activeSub = activeSubByWs[activeWs] || (hasSubs ? meta.subs[0].id : null);

  // Hover-driven drawer content uses hoverWs (defaults to activeWs)
  const drawerWs = WS_META[hoverWs] || meta;
  const drawerHasSubs = drawerWs.subs.length > 0;

  function handleChromeEnter() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    // Always open the drawer on any chrome hover — content reads from the
    // current hoverWs, which gets updated by per-tab handleWsHover. If the
    // current hoverWs has no subs (which is now never — Home and Calendar
    // both have subs), the drawer body is empty but the seam still shows.
    const m = WS_META[hoverWs] || WS_META[activeWs];
    if (m && m.subs.length > 0) setDrawerOpen(true);
  }

  function handleChromeLeave() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setDrawerOpen(false);
      setHoverWs(activeWs);
    }, 240);
  }

  function handleWsHover(id) {
    setHoverWs(id);
    const m = WS_META[id];
    if (m.subs.length > 0) {
      setDrawerOpen(true);
      const sub = activeSubByWs[id] || m.subs[0].id;
      setPreviewSub(sub);
    }
    // Don't explicitly close — let the chrome's mouseLeave handle that.
  }

  function handleWsClick(id) {
    setActiveWs(id);
    setHoverWs(id);
    // Don't auto-close even for workspaces without subs — the user can still
    // pick a subtab from the drawer that just opened. Drawer closes on
    // mouseLeave like any other workspace.
  }

  function handleSubCommit(subId) {
    setActiveWs(hoverWs);
    setActiveSubByWs(prev => ({ ...prev, [hoverWs]: subId }));
    setDrawerOpen(false);
  }

  return (
    <div style={{ position: 'relative', width: 1440, height: 900, background: 'var(--bg-base)', overflow: 'hidden', border: '1px solid var(--border-default)', borderRadius: 8 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .cv6-canvas .hf-topbar, .cv6-canvas .hf-subtabs { display: none !important; }
        .cv6-canvas .hf { height: 100% !important; }
        /* All drawer-body motion uses ease-out-expo for the softer feel */
        @keyframes cv10-list-in {
          0%   { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes cv10-preview-in {
          0%   { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      ` }} />

      {/* Cast-shadow at top of surface */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 36,
        background: drawerOpen
          ? 'linear-gradient(to bottom, rgba(26,24,21,0.10), transparent)'
          : 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)',
        transition: 'background 360ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none', zIndex: 5,
      }} />

      {/* Surface body — renders the active surface (always tied to activeWs, not hoverWs) */}
      <div className="cv6-canvas" style={{
        position: 'absolute',
        top: 64, left: 0, right: 0, bottom: 0,
        overflow: 'auto',
        zIndex: 4,
      }}>
        <ActiveSurface wsId={activeWs} subId={activeSub} />
      </div>

      {/* Floating chrome — pill + drawer · hover-driven open/close */}
      <div
        onMouseEnter={handleChromeEnter}
        onMouseLeave={handleChromeLeave}
        style={{
          position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10,
      }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: 0,
          height: drawerOpen && drawerHasSubs ? 48 + 156 : 48,
          display: 'flex', flexDirection: 'column',
          boxShadow: drawerOpen
            ? '0 28px 56px -22px rgba(26,24,21,0.26), 0 6px 14px -6px rgba(26,24,21,0.12), 0 1px 0 rgba(253,252,249,0.7) inset'
            : '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
          transition: `height 360ms ${EASE_OUT_EXPO}, box-shadow 360ms ${EASE_OUT_EXPO}`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* TOP ZONE · pill — three-zone layout (left anchor · centered tabs · right anchor)
              Sliding indicator is a clay-tinted pill background, not an underline.
              Tab sizes are uniform (14px) so no layout reflow on active change. */}
          <div ref={tabsRowRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '8px 20px', height: 48, flexShrink: 0, boxSizing: 'border-box' }}>
            {/* LEFT ANCHOR · sea lion + divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }}><SeaLion size={22} /></span>
              <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
            </div>

            {/* CENTER · workspace tabs · centered horizontally */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              {WS_ORDER.map(w => {
                const isActive = w.id === activeWs;
                const isHovered = drawerOpen && w.id === hoverWs && !isActive;
                return (
                  <span key={w.id}
                    data-ws={w.id}
                    onMouseEnter={() => handleWsHover(w.id)}
                    onClick={() => handleWsClick(w.id)}
                    style={{
                      position: 'relative', zIndex: 1,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: isActive ? C10.serif : C10.sans,
                      fontStyle: isActive ? 'italic' : 'normal',
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive
                        ? 'var(--accent-primary-press)'
                        : isHovered
                          ? 'var(--fg-primary)'
                          : 'var(--fg-secondary)',
                      cursor: 'pointer', userSelect: 'none',
                      padding: '6px 12px',
                      letterSpacing: isActive ? '-0.005em' : '0',
                      transition: `color 280ms ${EASE_OUT_EXPO}`,
                    }}>
                    {w.label}
                    {/* Ambient freshness dot — only when there's new activity AND
                        the workspace isn't currently active (so it doesn't
                        compete with the active capsule). */}
                    {w.fresh && !isActive && (
                      <span style={{
                        width: 5, height: 5, borderRadius: 999,
                        background: 'var(--accent-primary)',
                        boxShadow: '0 0 0 3px color-mix(in srgb, var(--accent-primary) 14%, transparent)',
                        flexShrink: 0,
                      }} />
                    )}
                  </span>
                );
              })}
            </div>

            {/* RIGHT ANCHOR · dateline */}
            <div style={{ flexShrink: 0 }}>
              <span style={{ fontFamily: C10.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
            </div>

            {/* HOVER preview indicator · neutral warm-gray pill · subordinate to active.
                Subtle: surface-2 fill + faint border + no glow. Faster transition (320ms)
                so hover feels lightweight vs the committed 480ms active slide.
                Hidden when hoverWs === activeWs (no need to double-up). */}
            <span style={{
              position: 'absolute',
              left: hoverIndicator.x, top: '50%',
              transform: 'translateY(-50%)',
              width: hoverIndicator.w, height: 32,
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 999,
              boxShadow: '0 1px 0 rgba(253,252,249,0.5) inset',
              opacity: hoverIndicator.ready ? 1 : 0,
              transition: `left 320ms ${EASE_OUT_EXPO}, width 320ms ${EASE_OUT_EXPO}, opacity 200ms ease`,
              pointerEvents: 'none', willChange: 'left, width', zIndex: 0,
            }} />

            {/* ACTIVE indicator · clay-tinted pill, gradient derived from --accent-primary
                via color-mix() so the indicator follows accent-color changes automatically.
                z-index 0 (alongside hover); tabs at z-index 1 sit on top. */}
            <span style={{
              position: 'absolute',
              left: indicatorStyle.x, top: '50%',
              transform: 'translateY(-50%)',
              width: indicatorStyle.w, height: 32,
              background: 'linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 14%, transparent), color-mix(in srgb, var(--accent-primary) 4%, transparent))',
              border: '1px solid color-mix(in srgb, var(--accent-primary) 18%, transparent)',
              borderRadius: 999,
              boxShadow: '0 1px 0 rgba(253,252,249,0.5) inset, 0 2px 6px -3px color-mix(in srgb, var(--accent-primary) 22%, transparent)',
              opacity: indicatorStyle.ready ? 1 : 0,
              transition: `left 480ms ${EASE_OUT_EXPO}, width 480ms ${EASE_OUT_EXPO}, opacity 320ms ease`,
              pointerEvents: 'none', willChange: 'left, width', zIndex: 0,
            }} />
          </div>

          {/* SEAM · accent-soft rule that briefly glows clay when freshly opened */}
          <span style={{
            position: 'absolute', left: 12, right: 12, top: 48, height: 1,
            background: justOpened
              ? 'linear-gradient(to right, transparent, var(--accent-primary), transparent)'
              : 'linear-gradient(to right, transparent, var(--accent-soft), transparent)',
            opacity: drawerOpen && drawerHasSubs ? 1 : 0,
            transform: drawerOpen && drawerHasSubs ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: `opacity 280ms ${EASE_OUT_EXPO}, transform 360ms ${EASE_OUT_EXPO}, background 800ms ease`,
            pointerEvents: 'none',
            boxShadow: justOpened ? '0 0 8px 0 color-mix(in srgb, var(--accent-primary) 32%, transparent)' : 'none',
          }} />

          {/* BOTTOM ZONE · drawer body — opacity fades alongside height */}
          <div style={{
            opacity: drawerOpen && drawerHasSubs ? 1 : 0,
            transform: drawerOpen && drawerHasSubs ? 'translateY(0)' : 'translateY(-4px)',
            transition: `opacity 320ms ${EASE_OUT_EXPO} 60ms, transform 360ms ${EASE_OUT_EXPO} 60ms`,
            pointerEvents: drawerOpen && drawerHasSubs ? 'auto' : 'none',
          }}>
            {drawerHasSubs && (
              <DrawerBody
                wsId={hoverWs}
                previewSub={previewSub}
                onSubHover={setPreviewSub}
                onSubCommit={handleSubCommit}
              />
            )}
          </div>

          <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* (Status pill removed — chrome's gradient capsule + surface's own header
          band already tell the user where they are. Triple redundancy was
          flagged in the v10 critique; the chrome speaks for itself.) */}
    </div>
  );
}

// ─── Page wrapper · header + canvas ─────────────────────────
function HF_ChromeIdeationV10Page() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Compact page header */}
      <div style={{ padding: '24px 32px 20px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
        <div style={{ maxWidth: 1488, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <img src="coopr-logo.png" alt="COOPRLABS" style={{ height: 28, width: 'auto' }} />
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: C10.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              CHROME IDEATION · v10 · LIST + PREVIEW · INTERACTIVE
            </span>
          </div>
          <h1 style={{ margin: '0 0 4px', fontFamily: C10.serif, fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.1 }}>
            Hover the chrome. Move the cursor away. The pages are <span style={{ fontStyle: 'italic' }}>real.</span>
          </h1>
          <p style={{ margin: 0, fontFamily: C10.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.45 }}>
            Hover any workspace tab — the drawer opens and shows that workspace’s subtabs. Hover a subtab to preview it on the right. Click (or hit Open) to navigate. Move the cursor off, or press ESC, and the drawer closes. Tiny clay dots mark workspaces with new activity.
          </p>
        </div>
      </div>

      {/* Single big canvas */}
      <div style={{ padding: '24px 32px 64px', display: 'flex', justifyContent: 'center' }}>
        <HF_ChromeIdeationV10 />
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV10, HF_ChromeIdeationV10Page });
