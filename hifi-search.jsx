/* global React, window, HfShell, R4PlatformCard, R4PillarDot, R4ChannelChip, R4Chip, R4Stat, r4FmtViews, r4PlatformLabel */
/* hifi-search.jsx — Round 6 · Search · 4 surfaces.

   STANCE B (overlay-only · NO workspace tab):
   Search is invoked via Cmd-K from any surface. It is an action, not a
   destination. The four surfaces below are overlay states, not workspaces:

     HF_SearchOverlay   720px floating palette over a blurred Home backdrop
     HF_SearchEmpty     full 1440x900 cold state — no query yet, hero invitation
     HF_SearchResults   full 1440x900 results workspace — 280px filter rail + grouped list
     HF_SearchHistory   full 1440x900 results page with active query + recent rail + saved search

   No edits to HF_SHELL_WORKSPACES or HF_SHELL_SUBTABS. The "Search · ⌘K" chip
   already lives in the topbar (hifi-shell.jsx:74-84 + every R4LibTopbarRight).
   Promoting Search to a workspace would duplicate that affordance and crowd the
   centered nav. Modern command-palette UX (Linear, Notion, Raycast) treats
   search as a modal-over-context, not a destination — that is the model here. */

const SEARCH_W = 1440;
const SEARCH_H = 900;

// ───────────────────────────────────────────────────────────
// Tokens / icons
// ───────────────────────────────────────────────────────────
const SEARCH_GROUPS = [
  { id: 'library',  label: 'Library posts',   accent: 'var(--accent-primary)' },
  { id: 'studio',   label: 'Studio docs',     accent: 'var(--tone-info)' },
  { id: 'inbox',    label: 'Inbox items',     accent: 'var(--tone-warning)' },
  { id: 'intel',    label: 'Intel signals',   accent: 'var(--tone-success)' },
  { id: 'settings', label: 'Settings',        accent: 'var(--fg-tertiary)' },
  { id: 'agent',    label: 'Coopr asks',      accent: 'var(--accent-primary-press)' },
];

function SearchIcon({ size = 14, color = 'currentColor', stroke = 1.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="5" cy="5" r="3.4" stroke={color} strokeWidth={stroke} fill="none" />
      <line x1="7.6" y1="7.6" x2="10.4" y2="10.4" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

function ArrowReturnIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path d="M10 3v3a2 2 0 0 1-2 2H2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 6 2 8l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <circle cx="6" cy="6" r="4.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.6V6l1.8 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path d="M5 1.5h2l.6 3.4 1.8 1.4-.6.8H3.2l-.6-.8 1.8-1.4Z" fill="currentColor" />
      <line x1="6" y1="7.1" x2="6" y2="10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function GroupGlyph({ groupId, size = 12 }) {
  const a = 'currentColor';
  if (groupId === 'library') {
    return <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true"><rect x="1.5" y="1.5" width="3" height="9" stroke={a} strokeWidth="1.2" fill="none" /><rect x="5.5" y="3" width="3" height="7.5" stroke={a} strokeWidth="1.2" fill="none" /><rect x="9.2" y="2" width="1.5" height="8.5" fill={a} /></svg>;
  }
  if (groupId === 'studio') {
    return <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1.5" width="7" height="9" stroke={a} strokeWidth="1.2" fill="none" rx="1" /><line x1="3.6" y1="4" x2="7.4" y2="4" stroke={a} strokeWidth="1.1" /><line x1="3.6" y1="6" x2="7.4" y2="6" stroke={a} strokeWidth="1.1" /><line x1="3.6" y1="8" x2="6" y2="8" stroke={a} strokeWidth="1.1" /></svg>;
  }
  if (groupId === 'inbox') {
    return <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true"><path d="M1.6 4 6 1.5 10.4 4v5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1Z" stroke={a} strokeWidth="1.2" fill="none" strokeLinejoin="round" /><path d="M1.6 4 6 7l4.4-3" stroke={a} strokeWidth="1.2" fill="none" strokeLinejoin="round" /></svg>;
  }
  if (groupId === 'intel') {
    return <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true"><polyline points="1.5,9 4,6 6,7.4 8.2,3.6 10.5,4.6" stroke={a} strokeWidth="1.3" fill="none" strokeLinejoin="round" strokeLinecap="round" /><circle cx="10.5" cy="4.6" r="1" fill={a} /></svg>;
  }
  if (groupId === 'settings') {
    return <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="1.7" stroke={a} strokeWidth="1.2" fill="none" /><path d="M6 1.5v1.7M6 8.8v1.7M1.5 6h1.7M8.8 6h1.7M2.7 2.7l1.2 1.2M8.1 8.1l1.2 1.2M2.7 9.3l1.2-1.2M8.1 3.9l1.2-1.2" stroke={a} strokeWidth="1.1" strokeLinecap="round" /></svg>;
  }
  // agent — coopr ask sparkle
  return <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5 7 5l3.5 1L7 7l-1 3.5L5 7 1.5 6 5 5Z" fill={a} /></svg>;
}

// ───────────────────────────────────────────────────────────
// Shared input row (palette + page header use it)
// ───────────────────────────────────────────────────────────
function SearchInputRow({ query = '', placeholder = 'Search posts, drafts, comments, signals…', big = false, showSubmit = true, showEsc = true }) {
  const h = big ? 56 : 44;
  const fs = big ? 17 : 14;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      height: h,
      padding: '0 18px',
      background: 'var(--surface-1)',
      borderBottom: '1px solid var(--border-subtle)',
      borderRadius: 0,
    }}>
      <span style={{ display: 'inline-flex', color: 'var(--fg-tertiary)' }}>
        <SearchIcon size={big ? 18 : 14} />
      </span>
      <span style={{
        flex: 1,
        fontFamily: 'var(--font-sans)',
        fontSize: fs,
        fontWeight: 500,
        color: query ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
        letterSpacing: '-0.005em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        display: 'inline-flex', alignItems: 'center', gap: 4,
      }}>
        {query || placeholder}
        {query && <span style={{ display: 'inline-block', width: 1.5, height: fs + 4, background: 'var(--accent-primary)', marginLeft: 2, animation: 'none' }} />}
      </span>
      {showSubmit && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          height: 22, padding: '0 8px',
          border: '1px solid var(--border-subtle)', borderRadius: 4,
          background: 'var(--surface-2)',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em',
        }}>
          <ArrowReturnIcon size={9} /> open
        </span>
      )}
      {showEsc && (
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          height: 22, padding: '0 8px',
          border: '1px solid var(--border-subtle)', borderRadius: 4,
          background: 'var(--surface-2)',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.08em',
        }}>ESC</span>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Faux-shell topbar for full search surfaces (no workspace nav highlighted —
// search is a transient, not a destination)
// ───────────────────────────────────────────────────────────
function SearchPageChrome({ children, query = '', resultsCount = null, mode = 'results' }) {
  return (
    <div className="hf" style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-base)',
      fontFamily: 'var(--font-sans)', color: 'var(--fg-primary)', overflow: 'hidden',
    }}>
      {/* Topbar — like HfShellTopbar but workspace nav muted (you're "above" all of them while searching) */}
      <div style={{
        height: 52,
        padding: '0 22px',
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-1)', flexShrink: 0, gap: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 130 }}>
          <span style={{
            width: 24, height: 24, borderRadius: 5,
            background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, lineHeight: 1,
          }}>C</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--fg-primary)' }}>COOPR</span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 30 }}>
          {(window.HF_SHELL_WORKSPACES || []).map(w => (
            <span key={w.id} style={{
              fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 500,
              color: 'var(--fg-tertiary)', opacity: 0.45,
              padding: '15px 2px', cursor: 'default',
            }}>{w.label}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 130, justifyContent: 'flex-end' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 26, padding: '0 10px',
            border: '1px solid var(--accent-primary)', borderRadius: 6,
            background: 'var(--accent-soft)',
            fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--accent-primary-press)',
            letterSpacing: '0.1em',
          }}>SEARCHING · ESC</span>
          <span style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
          }}>H</span>
        </div>
      </div>

      {/* Page-header row — query + result count + close affordance */}
      <div style={{
        height: 64,
        padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: 18,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-1)',
      }}>
        <span style={{ color: 'var(--fg-tertiary)' }}><SearchIcon size={20} stroke={1.4} /></span>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 14 }}>
          {mode === 'empty' ? (
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 500,
              color: 'var(--fg-tertiary)', letterSpacing: '-0.005em',
            }}>Search posts, drafts, comments, signals…</span>
          ) : (
            <>
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: 19, fontWeight: 600,
                color: 'var(--fg-primary)', letterSpacing: '-0.012em',
              }}>{query}</span>
              <span style={{
                width: 2, height: 22, background: 'var(--accent-primary)',
                display: 'inline-block', alignSelf: 'center', marginLeft: -10,
              }} />
              {resultsCount != null && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--fg-tertiary)', letterSpacing: '0.1em',
                }}>· {resultsCount} RESULTS</span>
              )}
            </>
          )}
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 26, padding: '0 10px',
          border: '1px solid var(--border-default)', borderRadius: 6,
          background: 'var(--surface-2)',
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-secondary)', letterSpacing: '0.1em',
        }}>⌘K</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 26, padding: '0 12px',
          background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', borderRadius: 6,
          fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600,
        }}>Close</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
        {children}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Result-row primitives — one shape, group-tinted accent
// ───────────────────────────────────────────────────────────
function SearchResultRow({ group, title, meta, snippet, badge, accent, kbd, score, hover }) {
  const grp = SEARCH_GROUPS.find(g => g.id === group) || SEARCH_GROUPS[0];
  const isHover = !!hover;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '24px 1fr auto',
      alignItems: 'center', gap: 14,
      padding: '11px 18px',
      background: isHover ? 'var(--accent-soft)' : 'transparent',
      borderLeft: isHover ? `3px solid ${accent || grp.accent}` : '3px solid transparent',
      borderBottom: '1px solid var(--border-subtle)',
      cursor: 'default',
    }}>
      {/* Glyph */}
      <span style={{ color: accent || grp.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <GroupGlyph groupId={group} size={13} />
      </span>
      {/* Title block */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600,
            color: 'var(--fg-primary)', letterSpacing: '-0.005em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}>{title}</span>
          {badge && (
            <span style={{
              flexShrink: 0,
              fontFamily: 'var(--font-mono)', fontSize: 9.5, color: accent || grp.accent,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '1px 6px', border: `1px solid ${accent || grp.accent}`, borderRadius: 3,
              background: 'var(--surface-1)',
            }}>{badge}</span>
          )}
        </div>
        {snippet && (
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12.5,
            color: 'var(--fg-secondary)', marginTop: 3, lineHeight: 1.45,
            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{snippet}</div>
        )}
        {meta && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)',
            letterSpacing: '0.1em', marginTop: 4,
          }}>{meta}</div>
        )}
      </div>
      {/* Trailing — score, kbd hint, etc */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-tertiary)' }}>
        {score != null && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            color: 'var(--accent-primary)', letterSpacing: '-0.01em',
          }}>{score}</span>
        )}
        {kbd && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            padding: '1px 6px', border: '1px solid var(--border-subtle)',
            borderRadius: 3, background: 'var(--surface-2)',
            color: 'var(--fg-tertiary)', letterSpacing: '0.05em',
          }}>{kbd}</span>
        )}
      </div>
    </div>
  );
}

function SearchGroupHeader({ group, count, action }) {
  const grp = SEARCH_GROUPS.find(g => g.id === group) || SEARCH_GROUPS[0];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 18px 8px',
      background: 'var(--surface-2)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{ color: grp.accent, display: 'inline-flex' }}>
        <GroupGlyph groupId={group} size={11} />
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        color: 'var(--fg-secondary)', letterSpacing: '0.16em', textTransform: 'uppercase',
        fontWeight: 700,
      }}>{grp.label}</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        color: 'var(--fg-tertiary)', letterSpacing: '0.1em',
      }}>· {count}</span>
      <span style={{ flex: 1 }} />
      {action && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)',
          letterSpacing: '0.12em', cursor: 'default',
        }}>{action}</span>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sample query data — niche-agnostic where copy is shipped UI;
// dive-flavored where it's example fixture (per CLAUDE.md rule 11)
// ───────────────────────────────────────────────────────────
function searchSampleResults() {
  const D = window.HF_DATA || {};
  const posts = D.posts || [];
  const drafts = D.drafts || [];
  const inbox = D.inbox || [];
  const trends = D.trends || [];
  return {
    library: [
      posts[4] && { id: posts[4].id, title: posts[4].title, meta: `LONG · YT · APR 14 · CSCORE 92`,
        snippet: 'My reg started free-flowing at 28 metres. I\'d been on the Fujikawa Maru for nine minutes.',
        score: '92', kbd: '↵' },
      posts[2] && { id: posts[2].id, title: posts[2].title, meta: 'LONG · YT · APR 19 · CSCORE 88',
        snippet: 'Eight breaths is what I gave myself for the bow railing. The light met me there.', score: '88' },
      posts[7] && { id: posts[7].id, title: posts[7].title, meta: 'SHORT · TT · APR 04 · CSCORE 87',
        snippet: 'You have eight seconds before they swipe. Spend two on the title and six on the punch.', score: '87' },
      posts[0] && { id: posts[0].id, title: posts[0].title, meta: 'SHORT · IG · APR 22 · CSCORE 84',
        snippet: 'Three things — the same three, every single time.', score: '84' },
    ].filter(Boolean),
    studio: [
      drafts[0] && { id: drafts[0].id, title: drafts[0].title, meta: `DRAFT · ${drafts[0].stage.toUpperCase()} · DUE ${drafts[0].dueIn.toUpperCase()}`, score: String(drafts[0].score) },
      drafts[1] && { id: drafts[1].id, title: drafts[1].title, meta: `DRAFT · ${drafts[1].stage.toUpperCase()} · DUE ${drafts[1].dueIn.toUpperCase()}`, score: String(drafts[1].score) },
      drafts[2] && { id: drafts[2].id, title: drafts[2].title, meta: `DRAFT · ${drafts[2].stage.toUpperCase()} · DUE ${drafts[2].dueIn.toUpperCase()}`, score: String(drafts[2].score) },
    ].filter(Boolean),
    inbox: [
      inbox[1] && { id: inbox[1].id, title: `${inbox[1].author} on ${inbox[1].on || '—'}`, meta: `COMMENT · ${inbox[1].priority.toUpperCase()} · ${inbox[1].ts.toUpperCase()}`,
        snippet: inbox[1].body, badge: 'NEEDS REPLY' },
      inbox[5] && { id: inbox[5].id, title: `${inbox[5].author} on ${inbox[5].on || '—'}`, meta: `COMMENT · ${inbox[5].priority.toUpperCase()} · ${inbox[5].ts.toUpperCase()}`,
        snippet: inbox[5].body },
      inbox[2] && { id: inbox[2].id, title: `${inbox[2].author} mentioned you`, meta: `MENTION · ${inbox[2].priority.toUpperCase()} · ${inbox[2].ts.toUpperCase()}`,
        snippet: inbox[2].body, badge: 'PINNED' },
    ].filter(Boolean),
    intel: [
      trends[1] && { id: trends[1].id, title: trends[1].topic, meta: `TREND · FIT ${(trends[1].fit*100).toFixed(0)}% · PEAK ${trends[1].peakIn.toUpperCase()}`,
        snippet: trends[1].example, score: `+${trends[1].acceleration}` },
      trends[3] && { id: trends[3].id, title: trends[3].topic, meta: `TREND · FIT ${(trends[3].fit*100).toFixed(0)}% · PEAK ${trends[3].peakIn.toUpperCase()}`,
        snippet: trends[3].example, score: `+${trends[3].acceleration}` },
      { id: 'mem-12', title: 'Switched safety primers to cold-open format', meta: 'MEMORY · DECISION · APR 22',
        snippet: 'Old narrated intros lose 14% by minute one — confirmed across six posts.', badge: 'PINNED' },
    ].filter(Boolean),
    settings: [
      { id: 'set-channels', title: 'Channels · YouTube, Instagram, TikTok', meta: 'SETTINGS · CONNECTIONS', snippet: '3 channels connected · last sync 6 minutes ago' },
      { id: 'set-voice', title: 'Brand voice · forbidden words', meta: 'SETTINGS · VOICE',
        snippet: '5 words flagged · plainspoken, self-deprecating, precise about gear.' },
    ],
    agent: [
      { id: 'agent-draft', title: 'Draft a reply that matches my voice', meta: 'COOPR ASK · SUGGESTED',
        snippet: 'I will read the comment, your last 12 replies, and send three options.', badge: 'NEW' },
      { id: 'agent-recap', title: 'Summarise everything since Monday', meta: 'COOPR ASK · WEEKLY RECAP',
        snippet: 'What posted, what moved, what needs your attention before Friday.' },
    ],
  };
}

// ───────────────────────────────────────────────────────────
// (1) HF_SearchOverlay — Cmd-K floating palette over blurred Home
// ───────────────────────────────────────────────────────────
function HF_SearchOverlay() {
  const data = searchSampleResults();
  // 8 visible across groups · prefer hi-signal items first
  const visible = [
    { ...data.library[0], group: 'library', hover: true },
    { ...data.library[1], group: 'library' },
    { ...data.studio[0],  group: 'studio' },
    { ...data.studio[1],  group: 'studio' },
    { ...data.inbox[0],   group: 'inbox' },
    { ...data.intel[0],   group: 'intel' },
    { ...data.settings[1], group: 'settings' },
    { ...data.agent[0],    group: 'agent' },
  ];
  return (
    <div style={{
      width: SEARCH_W, height: SEARCH_H,
      background: 'var(--bg-base)',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--font-sans)', color: 'var(--fg-primary)',
    }}>
      {/* Blurred Home stand-in (so the overlay reads as a true overlay) */}
      <FauxHomeBackdrop />

      {/* Scrim */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(26,24,21,0.42)',
        backdropFilter: 'blur(2px)',
      }} />

      {/* Palette · 720 wide, anchored 14% from top */}
      <div style={{
        position: 'absolute',
        top: 124,
        left: '50%', transform: 'translateX(-50%)',
        width: 720,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
      }}>
        <SearchInputRow query="fujikawa hook" big />

        {/* Inline scope chips */}
        <div style={{
          display: 'flex', gap: 6, alignItems: 'center',
          padding: '8px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--fg-tertiary)',
        }}>
          <span>SCOPE</span>
          <span style={{ color: 'var(--border-default)' }}>·</span>
          <PaletteChip active>All</PaletteChip>
          <PaletteChip>Library</PaletteChip>
          <PaletteChip>Studio</PaletteChip>
          <PaletteChip>Inbox</PaletteChip>
          <PaletteChip>Intel</PaletteChip>
          <PaletteChip>Coopr</PaletteChip>
          <span style={{ flex: 1 }} />
          <span>FOUND</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>34</span>
        </div>

        {/* Result body — 8 visible · 1 hover */}
        <div style={{ background: 'var(--surface-1)' }}>
          {visible.map((r, i) => (
            <SearchResultRow
              key={r.id || i}
              group={r.group}
              title={r.title}
              meta={r.meta}
              snippet={r.snippet}
              badge={r.badge}
              score={r.score}
              kbd={i === 0 ? '↵' : null}
              hover={r.hover}
            />
          ))}
        </div>

        {/* Footer — show all + hotkeys */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '10px 18px',
          background: 'var(--surface-2)',
          borderTop: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <KbdKey>↑</KbdKey><KbdKey>↓</KbdKey> NAVIGATE
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <KbdKey>↵</KbdKey> OPEN
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <KbdKey>⌘</KbdKey><KbdKey>↵</KbdKey> OPEN AS PAGE
          </span>
          <span style={{ flex: 1 }} />
          <span style={{
            color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.12em',
          }}>SHOW ALL 34 RESULTS →</span>
        </div>
      </div>
    </div>
  );
}

function PaletteChip({ active, children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 9px',
      border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-subtle)'),
      borderRadius: 999,
      background: active ? 'var(--accent-soft)' : 'transparent',
      color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
      fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: active ? 600 : 500,
      letterSpacing: '-0.005em', textTransform: 'none',
    }}>{children}</span>
  );
}

function KbdKey({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 16, height: 16, padding: '0 4px',
      border: '1px solid var(--border-subtle)', borderRadius: 3,
      background: 'var(--surface-1)', color: 'var(--fg-secondary)',
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
    }}>{children}</span>
  );
}

// Faux home backdrop — a rough approximation of the Home composer + briefing,
// blurred and dimmed. Built locally because we need pixel-faithful 1440x900.
function FauxHomeBackdrop() {
  return (
    <div style={{ position: 'absolute', inset: 0, filter: 'blur(3px) saturate(0.9)', opacity: 0.85 }}>
      {/* Topbar stand-in */}
      <div style={{ height: 52, background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }} />
      {/* Body */}
      <div style={{
        height: 'calc(100% - 52px)', background: 'var(--bg-base)',
        display: 'flex', justifyContent: 'center', paddingTop: 90,
      }}>
        <div style={{ width: 720, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--fg-tertiary)', letterSpacing: '0.16em',
          }}>WED · APR 24 · 09:42 · WAYANAD</div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 36,
            color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1,
          }}>Good morning, Henry.</div>
          <div style={{
            height: 90,
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
          }} />
          <div style={{ display: 'flex', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 64,
                background: 'var(--surface-1)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// (2) HF_SearchEmpty — cold state, no query
// ───────────────────────────────────────────────────────────
function HF_SearchEmpty() {
  const recents = [
    'fujikawa hook',
    'hooks under 1.5 seconds',
    'rec vs tech tension',
    'dispatch №142',
    'comments tagged gear',
  ];
  const suggestions = [
    'posts that saved best last month',
    'what\'s working on long-form',
    'drafts due this week',
    'comments still needing a reply',
    'series with the longest tail',
    'memory · what coopr decided in april',
  ];
  return (
    <SearchPageChrome mode="empty">
      {/* Left rail · recent searches */}
      <div style={{
        width: 280, flexShrink: 0,
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '24px 22px',
        display: 'flex', flexDirection: 'column', gap: 16,
        overflow: 'auto',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)',
          letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
        }}>Recent searches</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recents.map(q => (
            <div key={q} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 0',
              borderBottom: '1px dashed var(--border-subtle)',
              fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-secondary)',
              cursor: 'default',
            }}>
              <span style={{ color: 'var(--fg-tertiary)' }}><ClockIcon size={11} /></span>
              <span style={{ flex: 1, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-primary)' }}>{q}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>2d</span>
            </div>
          ))}
        </div>

        <div style={{ height: 12 }} />
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)',
          letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
        }}>Saved searches</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 12px',
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent-primary)',
          borderRadius: 8,
        }}>
          <span style={{ color: 'var(--accent-primary)' }}><PinIcon size={11} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)' }}>My Tuesday review</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--accent-primary-press)', letterSpacing: '0.1em', marginTop: 2 }}>3 SCOPES · 14 RESULTS · 7D</div>
          </div>
        </div>
      </div>

      {/* Main column — hero + suggestions */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: '70px 80px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--accent-primary-press)', letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 700,
        }}>SEARCH · 1,284 indexed items</div>

        <h1 style={{
          margin: '14px 0 0',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
          fontSize: 64, color: 'var(--fg-primary)',
          letterSpacing: '-0.028em', lineHeight: 1.02, maxWidth: 780,
        }}>What are you looking for?</h1>

        <p style={{
          margin: '20px 0 0',
          fontFamily: 'var(--font-sans)', fontSize: 14.5,
          color: 'var(--fg-secondary)', maxWidth: 600, lineHeight: 1.6,
        }}>
          Posts, drafts, comments, signals, decisions — every artefact in your studio is one query away.
          Search by what you remember: a hook line, a name, a feeling.
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          marginTop: 32, maxWidth: 900,
        }}>
          {suggestions.map(s => (
            <span key={s} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 16px',
              border: '1px solid var(--border-default)', borderRadius: 999,
              background: 'var(--surface-1)',
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 14.5, fontWeight: 400, color: 'var(--fg-primary)',
              cursor: 'default', letterSpacing: '-0.005em',
            }}>
              <SearchIcon size={11} color="var(--accent-primary)" />
              {s}
            </span>
          ))}
        </div>

        <div style={{
          marginTop: 48, paddingTop: 22, borderTop: '1px solid var(--border-subtle)',
          maxWidth: 900,
          display: 'flex', alignItems: 'center', gap: 32,
        }}>
          <FootnoteStat label="POSTS"   value="412" />
          <span style={{ width: 1, height: 26, background: 'var(--border-default)' }} />
          <FootnoteStat label="DRAFTS"  value="38"  tone="info" />
          <span style={{ width: 1, height: 26, background: 'var(--border-default)' }} />
          <FootnoteStat label="COMMENTS" value="4,180" />
          <span style={{ width: 1, height: 26, background: 'var(--border-default)' }} />
          <FootnoteStat label="SIGNALS" value="142" tone="success" />
          <span style={{ width: 1, height: 26, background: 'var(--border-default)' }} />
          <FootnoteStat label="MEMORIES" value="68" tone="accent" />
        </div>
      </div>
    </SearchPageChrome>
  );
}

function FootnoteStat({ label, value, tone }) {
  const c = tone === 'success' ? 'var(--tone-success)'
          : tone === 'info'    ? 'var(--tone-info)'
          : tone === 'accent'  ? 'var(--accent-primary)'
          : 'var(--fg-primary)';
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.16em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 26, fontWeight: 500, color: c, letterSpacing: '-0.018em', lineHeight: 1 }}>{value}</span>
    </span>
  );
}

// ───────────────────────────────────────────────────────────
// (3) HF_SearchResults — full results workspace
// ───────────────────────────────────────────────────────────
function HF_SearchResults() {
  const data = searchSampleResults();
  const total =
    data.library.length + data.studio.length + data.inbox.length +
    data.intel.length + data.settings.length + data.agent.length;
  return (
    <SearchPageChrome query="hooks under 1.5 seconds" resultsCount={total}>
      {/* Filter rail */}
      <FilterRail />
      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'var(--bg-base)' }}>
        {/* Editorial header band */}
        <div style={{
          padding: '28px 36px 22px',
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'flex-end', gap: 24,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: 'var(--accent-primary-press)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
            }}>RESULTS · 6 SCOPES · INDEX UPDATED 6m AGO</div>
            <h1 style={{
              margin: '8px 0 0',
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
              fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.1,
            }}>Everything that mentions <span style={{ color: 'var(--accent-primary)' }}>hooks under 1.5 seconds</span>.</h1>
            <p style={{
              margin: '8px 0 0',
              fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-secondary)', maxWidth: 720,
            }}>Sorted by relevance · grouped by scope · select 2-3 to compare or pin to a saved search.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PageHeaderAction label="Save search" />
            <PageHeaderAction label="Export" />
            <PageHeaderAction label="Sort · Relevance ↓" />
          </div>
        </div>

        {/* Grouped results — at least 12 items across 6 groups */}
        <div style={{ background: 'var(--surface-1)', margin: '0 0 20px' }}>
          <SearchGroupHeader group="library" count={data.library.length} action="OPEN ALL →" />
          {data.library.map((r, i) => (
            <SearchResultRow
              key={r.id} group="library" title={r.title} meta={r.meta} snippet={r.snippet}
              score={r.score} kbd={i === 0 ? '↵' : null} hover={i === 0}
            />
          ))}

          <SearchGroupHeader group="studio" count={data.studio.length} action="SEE 3 →" />
          {data.studio.map(r => (
            <SearchResultRow key={r.id} group="studio" title={r.title} meta={r.meta} snippet={r.snippet} score={r.score} />
          ))}

          <SearchGroupHeader group="inbox" count={data.inbox.length} action="REPLY ALL →" />
          {data.inbox.map(r => (
            <SearchResultRow key={r.id} group="inbox" title={r.title} meta={r.meta} snippet={r.snippet} badge={r.badge} />
          ))}

          <SearchGroupHeader group="intel" count={data.intel.length} action="OPEN PULSE →" />
          {data.intel.map(r => (
            <SearchResultRow key={r.id} group="intel" title={r.title} meta={r.meta} snippet={r.snippet} score={r.score} badge={r.badge} />
          ))}

          <SearchGroupHeader group="settings" count={data.settings.length} />
          {data.settings.map(r => (
            <SearchResultRow key={r.id} group="settings" title={r.title} meta={r.meta} snippet={r.snippet} />
          ))}

          <SearchGroupHeader group="agent" count={data.agent.length} action="ASK COOPR →" />
          {data.agent.map(r => (
            <SearchResultRow key={r.id} group="agent" title={r.title} meta={r.meta} snippet={r.snippet} badge={r.badge} />
          ))}
        </div>
      </div>
    </SearchPageChrome>
  );
}

function PageHeaderAction({ label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 28, padding: '0 12px',
      border: '1px solid var(--border-default)', borderRadius: 6,
      background: 'var(--surface-1)',
      fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 500, color: 'var(--fg-secondary)',
      letterSpacing: '-0.005em',
    }}>{label}</span>
  );
}

function FilterRail({ activeQuery = null, recents = null, savedHighlight = false }) {
  const sections = [
    { id: 'type',    label: 'Type',    items: [
      { name: 'All',      count: 1284, active: true },
      { name: 'Posts',    count: 412 },
      { name: 'Drafts',   count: 38 },
      { name: 'Inbox',    count: 4180, active: true },
      { name: 'Intel',    count: 142 },
      { name: 'Settings', count: 24 },
      { name: 'Coopr',    count: 12 },
    ]},
    { id: 'date',    label: 'Date',    items: [
      { name: 'Today' },
      { name: '7 days', active: true },
      { name: '30 days' },
      { name: '90 days' },
      { name: 'This year' },
      { name: 'All time' },
    ]},
    { id: 'pillar',  label: 'Pillar',  items: [
      { name: 'All' },
      { name: 'Safety',  pillar: 'safety',  active: true },
      { name: 'Gear',    pillar: 'gear' },
      { name: 'Story',   pillar: 'story' },
      { name: 'Reply',   pillar: 'reply' },
    ]},
    { id: 'channel', label: 'Channel', items: [
      { name: 'YouTube',   ch: 'yt', active: true },
      { name: 'Instagram', ch: 'ig' },
      { name: 'TikTok',    ch: 'tt' },
    ]},
    { id: 'status',  label: 'Status',  items: [
      { name: 'Live' },
      { name: 'Trial' },
      { name: 'Graduated' },
      { name: 'Stale' },
    ]},
  ];
  return (
    <aside style={{
      width: 280, flexShrink: 0,
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border-subtle)',
      overflow: 'auto',
      padding: '20px 0 24px',
    }}>
      {/* Optional active query block — used by HF_SearchHistory */}
      {activeQuery && (
        <div style={{
          padding: '0 22px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 18,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--accent-primary-press)', letterSpacing: '0.16em', fontWeight: 700, marginBottom: 8 }}>ACTIVE</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px',
            background: 'var(--accent-soft)', borderRadius: 6,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)',
          }}>
            <SearchIcon size={11} color="var(--accent-primary-press)" />
            <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeQuery}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--accent-primary-press)' }}>×</span>
          </div>
        </div>
      )}

      {/* Recents block — used by HF_SearchHistory */}
      {recents && (
        <div style={{ padding: '0 22px 22px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.16em', fontWeight: 700, marginBottom: 10 }}>RECENT</div>
          {recents.map((q, i) => (
            <div key={q.text} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 0',
              borderBottom: i < recents.length - 1 ? '1px dashed var(--border-subtle)' : 'none',
            }}>
              <span style={{ color: 'var(--fg-tertiary)' }}><ClockIcon size={10} /></span>
              <span style={{
                flex: 1, minWidth: 0,
                fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13,
                color: 'var(--fg-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{q.text}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>{q.ago}</span>
            </div>
          ))}
        </div>
      )}

      {/* Saved-search highlight block */}
      {savedHighlight && (
        <div style={{ padding: '0 22px 22px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.16em', fontWeight: 700, marginBottom: 10 }}>SAVED</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 8,
          }}>
            <span style={{ color: 'var(--accent-primary)' }}><PinIcon size={11} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--accent-primary-press)' }}>My Tuesday review</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-primary-press)', letterSpacing: '0.1em', marginTop: 2 }}>14 RESULTS · 7D</div>
            </div>
          </div>
        </div>
      )}

      {/* Standard filters */}
      {sections.map(sec => (
        <div key={sec.id} style={{ padding: '0 22px 18px', marginBottom: 6 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            color: 'var(--fg-tertiary)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
            marginBottom: 10,
          }}>{sec.label}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sec.items.map(it => (
              <FilterRow key={it.name} item={it} />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

function FilterRow({ item }) {
  return (
    <span style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 8px',
      borderRadius: 5,
      background: item.active ? 'var(--surface-2)' : 'transparent',
      fontFamily: 'var(--font-sans)', fontSize: 12.5,
      color: item.active ? 'var(--fg-primary)' : 'var(--fg-secondary)',
      fontWeight: item.active ? 600 : 500,
      cursor: 'default',
    }}>
      {/* Optional pillar dot */}
      {item.pillar && <window.R4PillarDot pillar={item.pillar} size={7} />}
      {/* Optional channel chip */}
      {item.ch && <window.R4ChannelChip ch={item.ch} />}
      <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
      {item.count != null && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: item.active ? 'var(--accent-primary)' : 'var(--fg-tertiary)',
          letterSpacing: '0.04em',
        }}>{item.count.toLocaleString()}</span>
      )}
    </span>
  );
}

// ───────────────────────────────────────────────────────────
// (4) HF_SearchHistory — results page with active query + 5 recents + saved
// ───────────────────────────────────────────────────────────
function HF_SearchHistory() {
  const recents = [
    { text: 'hook < 1.5s',                     ago: '2h' },
    { text: 'long-form retention drop',        ago: 'yest' },
    { text: 'comments asking gear questions',  ago: '2d' },
    { text: 'trial reels still alive',         ago: '4d' },
    { text: 'drafts I haven\'t touched in a week', ago: '1w' },
  ];
  const data = searchSampleResults();
  return (
    <SearchPageChrome query="hook < 1.5s" resultsCount={47}>
      {/* History rail · LEFT — active query, 5 recents, 1 saved */}
      <FilterRail activeQuery="hook < 1.5s" recents={recents} savedHighlight />

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'var(--bg-base)' }}>
        {/* Editorial header band — emphasises this query was just resumed from history */}
        <div style={{
          padding: '24px 36px 18px',
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'flex-end', gap: 24,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: 'var(--accent-primary-press)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <ClockIcon size={11} />
              RESUMED FROM 2H AGO · 47 RESULTS
            </div>
            <h1 style={{
              margin: '8px 0 0',
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
              fontSize: 30, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.1,
            }}>You searched <span style={{ color: 'var(--accent-primary)' }}>hook &lt; 1.5s</span> earlier today.</h1>
            <p style={{
              margin: '8px 0 0',
              fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-secondary)', maxWidth: 680,
            }}>Three new results since then — all in Inbox.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PageHeaderAction label="Save · My Tuesday review" />
            <PageHeaderAction label="Refine ↻" />
          </div>
        </div>

        {/* Results · partial sample */}
        <div style={{ background: 'var(--surface-1)', margin: '0 0 20px' }}>
          <SearchGroupHeader group="library" count={3} action="SEE 18 →" />
          {data.library.slice(0, 3).map((r, i) => (
            <SearchResultRow key={r.id} group="library" title={r.title} meta={r.meta} snippet={r.snippet} score={r.score} hover={i === 0} kbd={i === 0 ? '↵' : null} />
          ))}

          <SearchGroupHeader group="studio" count={2} action="SEE 4 →" />
          {data.studio.slice(0, 2).map(r => (
            <SearchResultRow key={r.id} group="studio" title={r.title} meta={r.meta} snippet={r.snippet} score={r.score} />
          ))}

          <SearchGroupHeader group="inbox" count={3} action="REPLY ALL →" />
          {data.inbox.map(r => (
            <SearchResultRow key={r.id} group="inbox" title={r.title} meta={r.meta} snippet={r.snippet} badge="NEW" />
          ))}

          <SearchGroupHeader group="intel" count={2} action="OPEN PULSE →" />
          {data.intel.slice(0, 2).map(r => (
            <SearchResultRow key={r.id} group="intel" title={r.title} meta={r.meta} snippet={r.snippet} score={r.score} />
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          margin: '0 36px 36px',
          padding: '14px 18px',
          background: 'var(--surface-1)',
          border: '1px dashed var(--border-default)',
          borderRadius: 8,
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5,
          color: 'var(--fg-secondary)', lineHeight: 1.55,
        }}>
          Save this query and Coopr will re-run it every Tuesday at 09:00 — anything new lands in your morning briefing.
        </div>
      </div>
    </SearchPageChrome>
  );
}

// ───────────────────────────────────────────────────────────
// Export
// ───────────────────────────────────────────────────────────
Object.assign(window, {
  HF_SearchOverlay,
  HF_SearchEmpty,
  HF_SearchResults,
  HF_SearchHistory,
});
