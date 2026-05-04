/* global React, window */
/* hifi-modal-search.jsx — D4 · Search as a modal.

   Cmd/Ctrl+K from any surface invokes pushModal('ModalSearch'). The four
   palette-shaped states (empty / typing / results / history) live inline
   here as a single self-orchestrated component — they share the same
   modal frame and switch via internal state.

   Why reorchestrate instead of wrapping HF_SearchOverlay?
   HF_SearchOverlay (and HF_SearchEmpty / HF_SearchResults / HF_SearchHistory)
   each render a full 1440x900 page surface with their own scrim, faux-home
   backdrop, and topbar. MasterModalLayer already provides the scrim, the
   centered card, the border, the radius, the shadow, and ESC + click-out.
   Re-rendering a 1440x900 surface inside a 640-wide card would clip and
   doubly-scrim. So we keep this modal palette-shaped (~620x520) and use
   the result-row vocabulary that the page surfaces also use.

   ESC + scrim close are handled by MasterModalLayer (zIndex 12). Modes
   are switched by clicking footer-mode pills inside the modal — this is
   prototype-level interactivity, no router state needed. */

const MSR_M = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const MSR_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const MSR_GROUPS = [
  { id: 'library',  label: 'Library posts',   accent: 'var(--accent-primary)' },
  { id: 'studio',   label: 'Studio docs',     accent: 'var(--tone-info)' },
  { id: 'inbox',    label: 'Inbox items',     accent: 'var(--tone-warning)' },
  { id: 'intel',    label: 'Intel signals',   accent: 'var(--tone-success)' },
  { id: 'settings', label: 'Settings',        accent: 'var(--fg-tertiary)' },
  { id: 'agent',    label: 'Coopr asks',      accent: 'var(--accent-primary-press)' },
];

const MSR_RECENTS = [
  'fujikawa hook',
  'hooks under 1.5 seconds',
  'rec vs tech tension',
  'dispatch №142',
  'comments tagged gear',
];

const MSR_SUGGESTIONS = [
  'posts that saved best last month',
  'drafts due this week',
  'comments still needing a reply',
  'memory · what coopr decided in april',
];

// ─── Glyphs (inline, 4-12 viewBox) ────────────────────────────
function MSR_SearchGlyph({ size = 14, stroke = 1.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth={stroke} fill="none" />
      <line x1="7.6" y1="7.6" x2="10.4" y2="10.4" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

function MSR_ClockGlyph({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <circle cx="6" cy="6" r="4.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.6V6l1.8 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MSR_PinGlyph({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path d="M5 1.5h2l.6 3.4 1.8 1.4-.6.8H3.2l-.6-.8 1.8-1.4Z" fill="currentColor" />
      <line x1="6" y1="7.1" x2="6" y2="10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MSR_GroupGlyph({ groupId, size = 12 }) {
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
  return <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5 7 5l3.5 1L7 7l-1 3.5L5 7 1.5 6 5 5Z" fill={a} /></svg>;
}

// ─── Shared bits ──────────────────────────────────────────────
function MSR_Kbd({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 16, height: 16, padding: '0 4px',
      border: '1px solid var(--border-subtle)', borderRadius: 3,
      background: 'var(--surface-1)', color: 'var(--fg-secondary)',
      fontFamily: MSR_M.mono, fontSize: 10, fontWeight: 600,
    }}>{children}</span>
  );
}

function MSR_ScopeChip({ active, children, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '2px 9px',
        border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-subtle)'),
        borderRadius: 999,
        background: active ? 'var(--accent-soft)' : 'transparent',
        color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
        fontFamily: MSR_M.sans, fontSize: 11, fontWeight: active ? 600 : 500,
        letterSpacing: '-0.005em', cursor: 'pointer', userSelect: 'none',
      }}>{children}</span>
  );
}

function MSR_ModePill({ active, children, onClick }) {
  return (
    <span
      onClick={onClick}
      role="tab"
      aria-selected={active}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 6,
        background: active ? 'var(--surface-1)' : 'transparent',
        border: '1px solid ' + (active ? 'var(--border-default)' : 'transparent'),
        color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
        fontFamily: MSR_M.mono, fontSize: 9.5, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        cursor: 'pointer', userSelect: 'none',
        transition: `background 160ms ${MSR_EASE}, color 160ms ${MSR_EASE}`,
      }}>{children}</span>
  );
}

function MSR_InputRow({ value, placeholder, mode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      height: 56, padding: '0 18px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
    }}>
      <span style={{ color: 'var(--fg-tertiary)' }}>
        <MSR_SearchGlyph size={16} stroke={1.4} />
      </span>
      <span style={{
        flex: 1, minWidth: 0,
        fontFamily: MSR_M.sans, fontSize: 17, fontWeight: 500,
        color: value ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
        letterSpacing: '-0.012em',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value || placeholder}
        {value ? (
          <span style={{
            display: 'inline-block', width: 2, height: 18,
            background: 'var(--accent-primary)',
            marginLeft: 4, marginBottom: -3,
          }} />
        ) : null}
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '0 8px', height: 22, borderRadius: 4,
        border: '1px solid var(--border-subtle)',
        background: 'var(--surface-2)',
        color: 'var(--fg-tertiary)',
        fontFamily: MSR_M.mono, fontSize: 9.5, letterSpacing: '0.14em',
      }}>ESC</span>
    </div>
  );
}

function MSR_ResultRow({ group, title, meta, snippet, score, kbd, hover }) {
  const grp = MSR_GROUPS.find(g => g.id === group) || MSR_GROUPS[0];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '20px 1fr auto',
      alignItems: 'center', gap: 12,
      padding: '10px 18px',
      background: hover ? 'var(--accent-soft)' : 'transparent',
      borderLeft: hover ? `3px solid ${grp.accent}` : '3px solid transparent',
      borderBottom: '1px solid var(--border-subtle)',
      cursor: 'default',
    }}>
      <span style={{
        color: grp.accent,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <MSR_GroupGlyph groupId={group} size={12} />
      </span>
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 8,
        }}>
          <span style={{
            fontFamily: MSR_M.sans, fontSize: 13, fontWeight: 600,
            color: 'var(--fg-primary)', letterSpacing: '-0.005em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 360,
          }}>{title}</span>
          <span style={{
            fontFamily: MSR_M.mono, fontSize: 9.5,
            color: 'var(--fg-tertiary)', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>{meta}</span>
        </div>
        {snippet ? (
          <span style={{
            fontFamily: MSR_M.serif, fontStyle: 'italic',
            fontSize: 12, fontWeight: 400,
            color: 'var(--fg-secondary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 480,
          }}>{snippet}</span>
        ) : null}
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: MSR_M.mono, fontSize: 10, color: 'var(--fg-tertiary)',
        letterSpacing: '0.1em', fontVariantNumeric: 'tabular-nums',
      }}>
        {score ? <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{score}</span> : null}
        {kbd ? <MSR_Kbd>{kbd}</MSR_Kbd> : null}
      </span>
    </div>
  );
}

// ─── Per-mode bodies ──────────────────────────────────────────
function MSR_BodyEmpty() {
  // Cold state — no query yet. Show a soft invitation + suggestion chips.
  return (
    <div style={{
      flex: 1, minHeight: 0, overflow: 'auto',
      padding: '28px 22px 24px',
      display: 'flex', flexDirection: 'column', gap: 22,
      background: 'var(--surface-1)',
    }}>
      <div>
        <div style={{
          fontFamily: MSR_M.mono, fontSize: 10,
          color: 'var(--accent-primary-press)', letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 700,
        }}>Search · 1,284 indexed items</div>
        <div style={{
          marginTop: 10,
          fontFamily: MSR_M.serif, fontStyle: 'italic', fontWeight: 500,
          fontSize: 28, color: 'var(--fg-primary)',
          letterSpacing: '-0.022em', lineHeight: 1.1,
        }}>What are you looking for?</div>
        <div style={{
          marginTop: 8,
          fontFamily: MSR_M.sans, fontSize: 12.5,
          color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 520,
        }}>
          Posts, drafts, comments, signals, decisions — every artefact in your studio is one query away.
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {MSR_SUGGESTIONS.map(s => (
          <span key={s} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 13px',
            border: '1px solid var(--border-default)', borderRadius: 999,
            background: 'var(--surface-2)',
            fontFamily: MSR_M.serif, fontStyle: 'italic',
            fontSize: 12.5, fontWeight: 400, color: 'var(--fg-primary)',
            cursor: 'default', letterSpacing: '-0.005em',
          }}>
            <span style={{ color: 'var(--accent-primary)' }}><MSR_SearchGlyph size={11} stroke={1.4} /></span>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function MSR_BodyTyping() {
  // Mid-query state — query but no results-resolution yet. Render scope
  // chips + loading-shaped skeleton rows so the modal feels alive.
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--surface-1)' }}>
      <div style={{
        display: 'flex', gap: 6, alignItems: 'center',
        padding: '8px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        fontFamily: MSR_M.mono, fontSize: 10, letterSpacing: '0.1em', color: 'var(--fg-tertiary)',
      }}>
        <span>SCOPE</span>
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <MSR_ScopeChip active>All</MSR_ScopeChip>
        <MSR_ScopeChip>Library</MSR_ScopeChip>
        <MSR_ScopeChip>Studio</MSR_ScopeChip>
        <MSR_ScopeChip>Inbox</MSR_ScopeChip>
        <MSR_ScopeChip>Intel</MSR_ScopeChip>
        <span style={{ flex: 1 }} />
        <span>SCANNING…</span>
      </div>
      <div>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '20px 1fr auto',
            alignItems: 'center', gap: 12,
            padding: '12px 18px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <span style={{
              width: 12, height: 12, borderRadius: 3,
              background: 'var(--surface-2)',
              opacity: 1 - (i * 0.14),
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{
                height: 11, width: 240 - (i * 24),
                background: 'var(--surface-2)', borderRadius: 3,
                opacity: 1 - (i * 0.14),
              }} />
              <span style={{
                height: 9, width: 320 - (i * 30),
                background: 'var(--surface-2)', borderRadius: 3,
                opacity: 0.6 - (i * 0.08),
              }} />
            </div>
            <span style={{
              width: 22, height: 11,
              background: 'var(--surface-2)', borderRadius: 3,
              opacity: 1 - (i * 0.14),
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MSR_BodyResults() {
  // Results state — same row vocabulary as HF_SearchOverlay's palette.
  const D = window.HF_DATA || {};
  const posts = D.posts || [];
  const drafts = D.drafts || [];
  const inbox = D.inbox || [];
  const trends = D.trends || [];
  const rows = [
    posts[4] && {
      group: 'library', hover: true,
      title: posts[4].title, meta: 'LONG · YT · APR 14 · CSCORE 92',
      snippet: 'My reg started free-flowing at 28 metres.',
      score: '92', kbd: '↵',
    },
    posts[2] && {
      group: 'library',
      title: posts[2].title, meta: 'LONG · YT · APR 19 · CSCORE 88',
      snippet: 'Eight breaths is what I gave myself for the bow railing.',
      score: '88',
    },
    drafts[0] && {
      group: 'studio',
      title: drafts[0].title,
      meta: `DRAFT · ${(drafts[0].stage || '').toUpperCase()} · DUE ${(drafts[0].dueIn || '').toUpperCase()}`,
      score: String(drafts[0].score || ''),
    },
    inbox[1] && {
      group: 'inbox',
      title: `${inbox[1].author} on ${inbox[1].on || '—'}`,
      meta: `COMMENT · ${(inbox[1].priority || '').toUpperCase()} · ${(inbox[1].ts || '').toUpperCase()}`,
      snippet: inbox[1].body,
    },
    trends[1] && {
      group: 'intel',
      title: trends[1].topic,
      meta: `TREND · FIT ${Math.round((trends[1].fit || 0) * 100)}% · PEAK ${(trends[1].peakIn || '').toUpperCase()}`,
      snippet: trends[1].example,
      score: `+${trends[1].acceleration || 0}`,
    },
    {
      group: 'settings',
      title: 'Channels · YouTube, Instagram, TikTok',
      meta: 'SETTINGS · CONNECTIONS',
      snippet: '3 channels connected · last sync 6 minutes ago',
    },
    {
      group: 'agent',
      title: 'Draft a reply that matches my voice',
      meta: 'COOPR ASK · SUGGESTED',
      snippet: 'I will read the comment, your last 12 replies, and send three options.',
    },
  ].filter(Boolean);

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--surface-1)' }}>
      <div style={{
        display: 'flex', gap: 6, alignItems: 'center',
        padding: '8px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        fontFamily: MSR_M.mono, fontSize: 10, letterSpacing: '0.1em', color: 'var(--fg-tertiary)',
      }}>
        <span>SCOPE</span>
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <MSR_ScopeChip active>All</MSR_ScopeChip>
        <MSR_ScopeChip>Library</MSR_ScopeChip>
        <MSR_ScopeChip>Studio</MSR_ScopeChip>
        <MSR_ScopeChip>Inbox</MSR_ScopeChip>
        <MSR_ScopeChip>Intel</MSR_ScopeChip>
        <span style={{ flex: 1 }} />
        <span>FOUND</span>
        <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>34</span>
      </div>
      <div>
        {rows.map((r, i) => (
          <MSR_ResultRow key={i}
            group={r.group} title={r.title} meta={r.meta}
            snippet={r.snippet} score={r.score} kbd={r.kbd} hover={r.hover} />
        ))}
      </div>
    </div>
  );
}

function MSR_BodyHistory() {
  // History state — recent searches + saved searches list, no live query.
  return (
    <div style={{
      flex: 1, minHeight: 0, overflow: 'auto',
      padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 18,
      background: 'var(--surface-1)',
    }}>
      <div>
        <div style={{
          fontFamily: MSR_M.mono, fontSize: 10, color: 'var(--fg-tertiary)',
          letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
        }}>Recent searches</div>
        <div style={{ marginTop: 8 }}>
          {MSR_RECENTS.map(q => (
            <div key={q} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 0',
              borderBottom: '1px dashed var(--border-subtle)',
              cursor: 'default',
            }}>
              <span style={{ color: 'var(--fg-tertiary)' }}><MSR_ClockGlyph size={11} /></span>
              <span style={{
                flex: 1,
                fontFamily: MSR_M.serif, fontStyle: 'italic',
                fontSize: 13.5, color: 'var(--fg-primary)',
              }}>{q}</span>
              <span style={{
                fontFamily: MSR_M.mono, fontSize: 9.5,
                color: 'var(--fg-tertiary)', letterSpacing: '0.06em',
              }}>2d</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{
          fontFamily: MSR_M.mono, fontSize: 10, color: 'var(--fg-tertiary)',
          letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
        }}>Saved searches</div>
        <div style={{
          marginTop: 8,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 12px',
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent-primary)',
          borderRadius: 8,
        }}>
          <span style={{ color: 'var(--accent-primary)' }}><MSR_PinGlyph size={11} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: MSR_M.serif, fontStyle: 'italic',
              fontSize: 14, color: 'var(--accent-primary-press)',
            }}>My Tuesday review</div>
            <div style={{
              fontFamily: MSR_M.mono, fontSize: 9.5,
              color: 'var(--accent-primary-press)',
              letterSpacing: '0.1em', marginTop: 2,
            }}>3 SCOPES · 14 RESULTS · 7D</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Top-level modal component ────────────────────────────────
function HF_ModalSearch(props) {
  const initial = (props && props.initialMode) || 'empty';
  const [mode, setMode] = React.useState(initial);

  const ctx = window.useMasterState ? window.useMasterState() : null;
  const popModal = ctx && ctx.popModal ? ctx.popModal : function () {};

  const queryByMode = {
    empty:   '',
    typing:  'fujikawa hook',
    results: 'hooks under 1.5 seconds',
    history: '',
  };
  const placeholderByMode = {
    empty:   'Search posts, drafts, comments, signals…',
    typing:  'Search posts, drafts, comments, signals…',
    results: 'Search posts, drafts, comments, signals…',
    history: 'Recall a previous query…',
  };

  let body;
  if      (mode === 'typing')  body = <MSR_BodyTyping />;
  else if (mode === 'results') body = <MSR_BodyResults />;
  else if (mode === 'history') body = <MSR_BodyHistory />;
  else                         body = <MSR_BodyEmpty />;

  return (
    <div style={{
      width: 640, maxWidth: '100%',
      height: 540, maxHeight: '100%',
      display: 'flex', flexDirection: 'column',
      margin: '-32px',
      background: 'var(--surface-1)',
      borderRadius: 16, overflow: 'hidden',
    }}>
      <MSR_InputRow value={queryByMode[mode]} placeholder={placeholderByMode[mode]} mode={mode} />

      {body}

      {/* Footer · mode pills + hotkey legend */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '10px 14px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--surface-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MSR_ModePill active={mode === 'empty'}   onClick={() => setMode('empty')}>Empty</MSR_ModePill>
          <MSR_ModePill active={mode === 'typing'}  onClick={() => setMode('typing')}>Typing</MSR_ModePill>
          <MSR_ModePill active={mode === 'results'} onClick={() => setMode('results')}>Results</MSR_ModePill>
          <MSR_ModePill active={mode === 'history'} onClick={() => setMode('history')}>History</MSR_ModePill>
        </div>
        <span style={{ flex: 1 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: MSR_M.mono, fontSize: 9.5,
          color: 'var(--fg-tertiary)', letterSpacing: '0.12em',
        }}>
          <MSR_Kbd>↵</MSR_Kbd> OPEN
        </span>
        <span
          role="button"
          tabIndex={0}
          aria-label="Close search"
          onClick={popModal}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); popModal(); } }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px',
            borderRadius: 4,
            background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
            fontFamily: MSR_M.sans, fontSize: 11, fontWeight: 600,
            cursor: 'pointer', userSelect: 'none',
          }}>Close</span>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ModalSearch });
