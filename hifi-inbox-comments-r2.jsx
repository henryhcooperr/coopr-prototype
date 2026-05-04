/* global React, window, HfShell, FreshnessPill */
/* hifi-inbox-comments-r2.jsx — Comments · Round 2.
   Editorial template applied to the Sprout-style intent queue:
   header band + 5-metric KPI strip + 3-pane queue (questions / peers / critical / spam)
   + BTF extension (older comments + sentiment over time + most-active threads
   + italic-serif "one thing to do" close).
   Replaces HF_InboxComments at wiring time. Reads FreshnessPill off window
   (hifi-data-chrome.jsx). All other primitives are local. */

const ICR = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function ICR_Meta({ children, color = 'var(--fg-tertiary)', size = 10, style = {} }) {
  return <span style={{ fontFamily: ICR.sans, fontSize: size, color, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...style }}>{children}</span>;
}
function ICR_Mono({ children, color = 'var(--fg-secondary)', size = 11, style = {} }) {
  return <span style={{ fontFamily: ICR.mono, fontSize: size, color, ...style }}>{children}</span>;
}

function ICR_Dot({ intent }) {
  const colors = {
    question: 'var(--tone-info)',
    brand:    'var(--accent-primary)',
    fan:      'var(--tone-success)',
    critical: 'var(--tone-warning)',
    spam:     'var(--fg-tertiary)',
  };
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors[intent] || 'var(--fg-tertiary)', flexShrink: 0 }} />;
}

function ICR_Tag({ intent, label }) {
  const styles = {
    question: { bg: 'var(--tone-info-bg)',    fg: 'var(--tone-info)' },
    brand:    { bg: 'var(--accent-soft)',     fg: 'var(--accent-primary-press)' },
    fan:      { bg: 'var(--tone-success-bg)', fg: 'var(--tone-success)' },
    critical: { bg: 'var(--tone-warning-bg)', fg: 'var(--tone-warning)' },
    spam:     { bg: 'var(--surface-2)',       fg: 'var(--fg-tertiary)' },
  };
  const s = styles[intent] || styles.spam;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 18, padding: '0 7px',
      background: s.bg, color: s.fg,
      fontFamily: ICR.mono, fontSize: 9.5, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      borderRadius: 3,
    }}>{label}</span>
  );
}

function ICR_Platform({ ch, size = 14 }) {
  const map = { ig: 'Ig', yt: 'Yt', tt: 'Tt', th: 'Th' };
  return (
    <span style={{
      width: size, height: size, borderRadius: 3,
      background: '#1a1815', color: 'var(--fg-on-ink)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: ICR.mono, fontSize: 8, fontWeight: 700,
      flexShrink: 0,
    }}>{map[ch] || 'Ig'}</span>
  );
}

// ─── Data ────────────────────────────────────────────────
const ICR_GROUPS = [
  {
    intent: 'question', title: 'Questions worth your voice', count: 11,
    summary: 'Real gear or technique questions',
    items: [
      { id: 'c1', ch: 'yt', from: 'maya_diving', when: '12m', intent: 'question', intentLabel: 'gear question', sentiment: 'neutral',  body: "What pressure are you running on the AL80 there? Looked like you came up with a lot left in the tank.",                                                       context: 'on 0044 · 0:42' },
      { id: 'c2', ch: 'ig', from: 'reefdoc.kim', when: '24m', intent: 'question', intentLabel: 'technique',     sentiment: 'positive', body: "When you say 'breath up' before a deco stop, do you mean two breaths or full hyperventilation? Trying to teach this to a class.",                              context: 'on 0046'      },
      { id: 'c3', ch: 'tt', from: 'caleb.r',     when: '1h',  intent: 'question', intentLabel: 'safety',        sentiment: 'neutral',  body: "If your buddy's reg free-flows at 18m and you're at 60 bar — what's the actual call?",                                                                          context: 'on 0039'      },
    ],
  },
  {
    intent: 'fan', title: 'Peer praise · respond when you can', count: 64,
    summary: 'Positive, short, no question',
    items: [
      { id: 'c4', ch: 'yt', from: 'pavel_underwater',     when: '2h', intent: 'fan', intentLabel: 'fan',         sentiment: 'positive', body: "This is the only safety channel I trust. Keep these long ones coming.",            context: 'on 0042' },
      { id: 'c5', ch: 'ig', from: 'silke.diveinstructor', when: '3h', intent: 'fan', intentLabel: 'peer praise', sentiment: 'positive', body: "Showed this to my OW class today — perfect for the panic-management lesson.",   context: 'on 0046' },
    ],
  },
  {
    intent: 'critical', title: 'Critical · address today', count: 2,
    summary: 'Disagreement, factual challenge, or escalation',
    items: [
      { id: 'c6', ch: 'yt', from: 'tek_diver_77', when: '4h', intent: 'critical', intentLabel: 'factual challenge', sentiment: 'negative', body: "The narcosis depth you cited at 3:14 is wrong for a CCR diver — that's an OC number. This matters for your tek viewers.", context: 'on 0042 · 3:14' },
    ],
  },
];

const ICR_DETAIL = {
  id: 'c1', ch: 'yt', from: 'maya_diving', when: '12m',
  intent: 'question', intentLabel: 'gear question', sentiment: 'neutral',
  handle: '@maya_diving · YouTube',
  followers: '2,400', priorThreads: 1, tier: 'returning · 3rd comment',
  fullBody: "What pressure are you running on the AL80 there? Looked like you came up with a lot left in the tank — I always run mine deeper and end up on fumes. Curious if you're tracking SAC or just going by feel at this point.",
  attachedPost: '0044 · Truk Lagoon · the Fujikawa Maru in eight breaths',
  priorThread: { when: 'Apr 6 · on 0040', body: 'Loved the DIN vs yoke breakdown. Switching the rest of my regs over.' },
  suggested: "Running ~150 bar reserve on AL80s for wreck work — I'd rather come up early than push it. I do track SAC (about 18 L/min on relaxed bottom time, closer to 22 on the swim back). Feel is fine for OW depth, but inside the wreck I want the number.",
  alts: [
    { tone: 'shorter',       len: '24 words', body: "150 bar reserve on AL80s for wreck dives. I track SAC — about 18 L/min relaxed, 22 on the swim back." },
    { tone: 'teach-leaning', len: '52 words', body: "For wreck penetration I run a 150-bar reserve and track SAC religiously (18-22 L/min depending on workload). For open-water OW depth I'd say feel is fine if you've got the reps. The wreck gets the number every time." },
    { tone: 'redirect',      len: '18 words', body: "I covered the SAC-tracking part of this in 0040 (around 4:30) — that explains the why better than I can in a comment." },
  ],
};

// ─── 3-pane queue (compressed Sprout pattern) ─────────────
function ICR_LeftList({ groups, activeId, onItemClick, selectedIds, onToggleSelect }) {
  const selSet = selectedIds || [];
  return (
    <div style={{
      width: 360, borderRight: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)', display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'auto',
    }}>
      <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <ICR_Meta size={9.5}>Triage · 142 unread</ICR_Meta>
          <span style={{ flex: 1 }} />
          <ICR_Mono size={10} color="var(--fg-tertiary)">last sync · 2m ago</ICR_Mono>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {[
            ['question', 'Questions', 38],
            ['fan',      'Peers',     64],
            ['critical', 'Critical',   4],
            ['spam',     'Spam',      29],
          ].map(([i, l, n]) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 20, padding: '0 8px',
              background: 'var(--surface-2)', borderRadius: 999,
              fontFamily: ICR.sans, fontSize: 11, color: 'var(--fg-secondary)', fontWeight: 500,
            }}>
              <ICR_Dot intent={i} />{l}
              <span style={{ fontFamily: ICR.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{n}</span>
            </span>
          ))}
        </div>
      </div>
      {groups.map((g, gi) => (
        <div key={gi}>
          <div style={{
            padding: '12px 16px 6px', display: 'flex', alignItems: 'baseline', gap: 8,
            borderTop: gi === 0 ? 'none' : '1px solid var(--border-subtle)',
            background: 'var(--surface-2)',
          }}>
            <ICR_Dot intent={g.intent} />
            <span style={{ fontFamily: ICR.serif, fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{g.title}</span>
            <ICR_Mono size={10} color="var(--fg-tertiary)">· {g.count}</ICR_Mono>
          </div>
          {g.items.map((it) => {
            const checked = selSet.includes(it.id);
            return (
            <div
              key={it.id}
              onClick={() => { if (onItemClick) onItemClick(it.id); }}
              style={{
              padding: '11px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: it.id === activeId ? 'var(--accent-soft)' : 'var(--surface-1)',
              borderLeft: it.id === activeId ? '2px solid var(--accent-primary)' : '2px solid transparent',
              display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10,
              cursor: 'pointer', userSelect: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}>
                {window.HF_Checkbox && (
                  <window.HF_Checkbox checked={checked} onChange={() => onToggleSelect && onToggleSelect(it.id)} ariaLabel={'Select comment from ' + it.from} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ICR_Platform ch={it.ch} />
                  <span style={{ fontFamily: ICR.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{it.from}</span>
                  <span style={{ flex: 1 }} />
                  <ICR_Mono size={9.5} color="var(--fg-tertiary)">{it.when}</ICR_Mono>
                </div>
                <div style={{ fontFamily: ICR.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {it.body}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ICR_Tag intent={it.intent} label={it.intentLabel} />
                  <ICR_Mono size={9.5} color="var(--fg-tertiary)">{it.context}</ICR_Mono>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ICR_Detail({ item }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', overflow: 'auto' }}>
      <div style={{ padding: '14px 28px 12px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <ICR_Platform ch={item.ch} size={20} />
          <span style={{ fontFamily: ICR.sans, fontSize: 14.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{item.from}</span>
          <ICR_Mono size={10} color="var(--fg-tertiary)">{item.handle}</ICR_Mono>
          <ICR_Tag intent={item.intent} label={item.intentLabel} />
          <span style={{ flex: 1 }} />
          <ICR_Mono size={10} color="var(--fg-tertiary)">3 unread above</ICR_Mono>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: ICR.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>
          <span>followers · {item.followers}</span>
          <span>· prior threads · {item.priorThreads}</span>
          <span>· lifetime sentiment · {item.sentiment}</span>
          <span>· {item.tier}</span>
        </div>
      </div>
      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #c8b08c, #8a7252)', border: '1px solid var(--border-default)' }} />
            <span style={{ fontFamily: ICR.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{item.from}</span>
            <ICR_Mono size={9.5} color="var(--fg-tertiary)">{item.when}</ICR_Mono>
          </div>
          <div style={{
            marginLeft: 34, padding: '12px 16px',
            background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
            borderRadius: 10, fontFamily: ICR.sans, fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.6,
          }}>{item.fullBody}</div>
          <div style={{ marginLeft: 34, marginTop: 4, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 44, background: 'var(--border-default)', borderRadius: 4, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <ICR_Mono size={9.5} color="var(--fg-tertiary)">In reply to</ICR_Mono>
              <div style={{ fontFamily: ICR.sans, fontSize: 11.5, color: 'var(--fg-primary)', fontWeight: 500 }}>{item.attachedPost}</div>
            </div>
            <ICR_Mono size={10} color="var(--fg-tertiary)">↗ open</ICR_Mono>
          </div>
        </div>
        <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, borderLeft: '2px solid var(--border-strong)' }}>
          <ICR_Mono size={9.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.08em' }}>Prior thread · {item.priorThread.when}</ICR_Mono>
          <div style={{ marginTop: 4, fontFamily: ICR.sans, fontSize: 12.5, color: 'var(--fg-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{item.priorThread.body}"
          </div>
        </div>
      </div>
    </div>
  );
}

function ICR_RightRail({ item }) {
  return (
    <aside style={{
      width: 320, borderLeft: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)', flexShrink: 0,
      display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="var(--fg-on-accent)" /></svg>
          </span>
          <ICR_Meta size={9.5}>Coopr · suggested reply</ICR_Meta>
        </div>
        <ICR_Mono size={10} color="var(--fg-tertiary)">matched to your voice · 3 alts</ICR_Mono>
      </div>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{
          padding: '12px 14px', background: 'var(--bg-base)',
          border: '1px solid var(--border-default)', borderRadius: 10,
          fontFamily: ICR.sans, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.6,
        }}>{item.suggested}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <span style={{ padding: '7px 12px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 6, fontFamily: ICR.sans, fontSize: 12, fontWeight: 600 }}>Send as is</span>
          <span style={{ padding: '7px 10px', border: '1px solid var(--border-default)', borderRadius: 6, fontFamily: ICR.sans, fontSize: 12, fontWeight: 500, color: 'var(--fg-secondary)' }}>Edit first</span>
          <span style={{ flex: 1 }} />
          <ICR_Mono size={10} color="var(--fg-tertiary)" style={{ alignSelf: 'center' }}>regenerate ⇄</ICR_Mono>
        </div>
      </div>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ICR_Meta size={8.5} style={{ marginBottom: 6, display: 'block' }}>Alternatives</ICR_Meta>
        {item.alts.map((a, i) => (
          <div key={i} style={{ padding: '8px 10px', marginBottom: 5, background: 'var(--surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ICR_Mono size={9} color="var(--fg-tertiary)">{a.tone}</ICR_Mono>
              <span style={{ flex: 1 }} />
              <ICR_Mono size={9} color="var(--fg-tertiary)">{a.len}</ICR_Mono>
            </div>
            <span style={{ fontFamily: ICR.sans, fontSize: 11.5, color: 'var(--fg-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.body}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 16px' }}>
        <ICR_Meta size={8.5} style={{ marginBottom: 6, display: 'block' }}>Triage</ICR_Meta>
        {[
          ['Mark replied', 'M'], ['Snooze · 4h', 'Z'], ['Pin to follow up', 'P'], ['Hide & report', 'X'],
        ].map(([t, k]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px' }}>
            <span style={{ fontFamily: ICR.sans, fontSize: 11.5, color: 'var(--fg-secondary)', flex: 1 }}>{t}</span>
            <span style={{ fontFamily: ICR.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', width: 18, height: 18, border: '1px solid var(--border-subtle)', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-1)' }}>{k}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ─── Main surface ────────────────────────────────────────
function HF_InboxComments_R2({ state = 'happy' }) {
  // R10 · state variants — read tweaks override, fall back to prop.
  const ovr = window.useSurfaceState && window.useSurfaceState('inbox', 'Comments');
  // D5 · master-state pull so comment-row clicks can drill into the
  // thread detail surface. Hooks first → throws guarded with try/catch
  // so the surface still mounts standalone (layout view, IA preview).
  let ms = null;
  try { ms = window.useMasterState && window.useMasterState(); } catch (_e) { ms = null; }
  const onCommentClick = (commentId) => {
    if (ms && ms.setDetail) ms.setDetail('thread', commentId);
  };
  // B2 · multi-select state. Pre-selected: c1 (gear question), c2 (technique
  // question), c4 (peer praise) — three diverse intents to demo the bar.
  const [selectedIds, setSelectedIds] = React.useState(['c1', 'c2', 'c4']);
  const pushToast = (ms && ms.pushToast) ? ms.pushToast : function () {};
  function toggleSelect(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function clearSelection() { setSelectedIds([]); }
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="inbox" subtab="Comments"><window.HF_SkeletonHero shape="feed" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="inbox" subtab="Comments"><window.HF_EmptyHero
      eyebrow="Inbox · Comments · 0 unread"
      title="Inbox is quiet. Nothing waiting on a reply."
      caption="New comments appear here, intent-grouped. Auto-triage runs every minute."
      ctaLabel="View archive"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="inbox" subtab="Comments"><window.HF_ErrorHero
      title="Couldn't load the comments feed."
      body="The platform inbox didn't respond in time. Retry, or check the connections."
    /></HfShell>;
  }
  return (
    <HfShell workspace="inbox" subtab="Comments" subtabRight={<>
      <span style={{ fontFamily: ICR.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>142 unread · sentiment +0.58</span>
      <span style={{ fontFamily: ICR.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>auto-triage · on</span>
      <FreshnessPill at="2m ago" state="fresh" />
    </>}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', position: 'relative' }}>

        {/* Header band — byline + newsticker + serif headline + italic deck */}
        <div style={{ padding: '22px 32px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
            <ICR_Meta size={10}>Inbox · Comments · Apr 28</ICR_Meta>
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: ICR.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-primary)' }} />
              <span>Since last visit · 47 new across 3 platforms</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>11 questions · 64 peer notes · 2 critical · 29 spam (auto-hidden)</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>response window · 4d avg</span>
            </span>
            <ICR_Mono size={10} color="var(--fg-tertiary)">last sync · 2m ago</ICR_Mono>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
            <span style={{ fontFamily: ICR.serif, fontSize: 36, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--fg-primary)', maxWidth: 920 }}>
              <span style={{ fontStyle: 'italic' }}>Forty-seven new comments since you last looked.</span>
              {' '}
              <span style={{ color: 'var(--fg-secondary)' }}>Eleven worth your voice. Two need your hand today.</span>
            </span>
          </div>
          <div style={{ marginTop: 10, fontFamily: ICR.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 760, letterSpacing: '-0.005em' }}>
            Coopr classified them by intent. Triage left to right: questions worth your voice, peer praise to acknowledge, the critical thread to address before it ferments, and spam already silenced.
          </div>
        </div>

        {/* B3 · applied filter chips · what's narrowing the queue right now.
            Each chip removes itself with a toast; the ghost pendant adds a
            new facet. Sits below the header band so the queue beneath
            already reflects the filter state. */}
        <div style={{
          padding: '10px 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <window.HF_FilterChip
            kicker="INTENT"
            label="questions"
            onRemove={() => ms && ms.pushToast && ms.pushToast('Remove filter · intent · questions')}
          />
          <window.HF_FilterChip
            kicker="CHANNEL"
            label="YT + IG"
            onRemove={() => ms && ms.pushToast && ms.pushToast('Remove filter · channel · YT + IG')}
          />
          <window.HF_FilterChip
            kicker="WINDOW"
            label="last 7d"
            onRemove={() => ms && ms.pushToast && ms.pushToast('Remove filter · last 7d')}
          />
          <window.HF_AddFilterChip
            onClick={() => ms && ms.pushToast && ms.pushToast('Add filter')}
          />
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: ICR.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>
            3 active · 47 of 142 unread
          </span>
        </div>

        {/* KPI strip — 5 metrics */}
        <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
          {[
            ['unread · 7d',     '142',  'across YT IG TT'],
            ['questions',       '38',   'real, gear or technique'],
            ['peer praise',     '64',   '34 from creators >10k'],
            ['critical',        '4',    '2 factual, 2 escalation'],
            ['response · 4d',   '71%',  'within 24h · target 80%'],
          ].map(([l, v, sub], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <ICR_Meta size={9}>{l}</ICR_Meta>
              <span className="hf-num" style={{ fontFamily: ICR.sans, fontSize: 24, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{v}</span>
              <ICR_Mono size={10} color="var(--fg-tertiary)">{sub}</ICR_Mono>
            </div>
          ))}
        </div>

        {/* 3-pane intent queue (Sprout pattern preserved) */}
        <div style={{ display: 'flex', height: 620, flexShrink: 0, borderBottom: '1px solid var(--border-subtle)' }}>
          <ICR_LeftList groups={ICR_GROUPS} activeId="c1" onItemClick={onCommentClick} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
          <ICR_Detail item={ICR_DETAIL} />
          <ICR_RightRail item={ICR_DETAIL} />
        </div>

        {/* ─── BTF · what scrolling reveals ───────────── */}

        {/* Older comments · context only */}
        <div style={{ padding: '24px 32px 8px', maxWidth: 1200, width: '100%', alignSelf: 'center', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: ICR.serif, fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>From last 30 days · already handled</span>
            <ICR_Mono size={10} color="var(--fg-tertiary)">· 312 archived · sorted by thread strength</ICR_Mono>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { ch: 'yt', from: 'maria_lago',     when: 'Apr 21', body: "The wreck checklist on 0042 takes about ten minutes to walk through; the whole video is the long version.",                                          intent: 'question', tag: 'returned to thread', meta: '14 follow-ups · pinned by maria' },
              { ch: 'ig', from: 'jordan.films',   when: 'Apr 19', body: "Don't compress for the algorithm — your audience already knows what they want. The pacing question only matters when you're chasing reach.",         intent: 'fan',      tag: 'archived',           meta: 'Liked · 41 hearts'             },
              { ch: 'tt', from: 'shane_dive',     when: 'Apr 14', body: "I track SAC because the alternative is guessing. Your bottom-time math is only as good as your gas math.",                                            intent: 'question', tag: 'returned to thread', meta: '6 follow-ups · 41 likes'        },
              { ch: 'yt', from: 'depth_cult',     when: 'Apr 11', body: "You're right that the citation was sloppy — fixed in 0046's intro and pinned a correction. Thanks for keeping me honest.",                            intent: 'critical', tag: 'recovered',          meta: 'Pinned correction · 180 thanks' },
            ].map((c, i) => (
              <div key={i} style={{ padding: '14px 4px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '70px 1fr 220px', gap: 18, alignItems: 'flex-start', opacity: 0.85 }}>
                <ICR_Mono size={10} color="var(--fg-tertiary)" style={{ paddingTop: 4 }}>{c.when}</ICR_Mono>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ICR_Platform ch={c.ch} />
                    <span style={{ fontFamily: ICR.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{c.from}</span>
                  </div>
                  <span style={{ fontFamily: ICR.serif, fontSize: 15, fontWeight: 400, color: 'var(--fg-secondary)', lineHeight: 1.5, letterSpacing: '-0.005em', fontStyle: c.intent === 'fan' ? 'italic' : 'normal' }}>"{c.body}"</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 14, borderLeft: '1px solid var(--border-subtle)' }}>
                  <ICR_Meta size={9}>Outcome</ICR_Meta>
                  <ICR_Tag intent={c.intent} label={c.tag} />
                  <ICR_Mono size={10} color="var(--fg-secondary)" style={{ lineHeight: 1.5 }}>{c.meta}</ICR_Mono>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment over time + most-active threads · two columns */}
        <div style={{ padding: '24px 32px 8px', maxWidth: 1200, width: '100%', alignSelf: 'center', boxSizing: 'border-box', marginTop: 16, paddingTop: 18, borderTop: '6px double var(--fg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <ICR_Meta size={9}>Sentiment over time · last 4 weeks</ICR_Meta>
            <div style={{ marginTop: 10, padding: '14px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { week: 'Apr 1',  pos: 168, neu: 52,  neg: 18, net: '+0.51' },
                  { week: 'Apr 8',  pos: 196, neu: 64,  neg: 14, net: '+0.56' },
                  { week: 'Apr 15', pos: 224, neu: 72,  neg: 11, net: '+0.59' },
                  { week: 'Apr 22', pos: 248, neu: 88,  neg:  9, net: '+0.62' },
                ].map((w, i) => {
                  const total = w.pos + w.neu + w.neg;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                      <div style={{ display: 'flex', flexDirection: 'column-reverse', height: 90, gap: 1 }}>
                        <div style={{ height: `${(w.pos / total) * 100}%`, background: 'var(--tone-success)', borderRadius: 1 }} />
                        <div style={{ height: `${(w.neu / total) * 100}%`, background: 'var(--fg-tertiary)' }} />
                        <div style={{ height: `${(w.neg / total) * 100}%`, background: 'var(--tone-warning)', borderRadius: 1 }} />
                      </div>
                      <ICR_Mono size={9.5} color="var(--fg-tertiary)" style={{ textAlign: 'center', marginTop: 4 }}>{w.week}</ICR_Mono>
                      <span className="hf-num" style={{ fontFamily: ICR.mono, fontSize: 11, color: 'var(--accent-primary)', textAlign: 'center', fontWeight: 600 }}>{w.net}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 14, fontFamily: ICR.mono, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--tone-success)' }} /> positive</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--fg-tertiary)' }} /> neutral</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--tone-warning)' }} /> critical</span>
              </div>
            </div>
          </div>

          <div>
            <ICR_Meta size={9}>Most-active threads · last 30d</ICR_Meta>
            <div style={{ marginTop: 10 }}>
              {[
                { id: '0042', title: 'Truk Lagoon · why this wreck still matters',   count: 184, net: '+0.71' },
                { id: '0046', title: 'Pre-dive checklist · the long version',         count: 112, net: '+0.68' },
                { id: '0044', title: 'Fujikawa Maru in eight breaths',                count:  68, net: '+0.59' },
                { id: '0039', title: 'Buddy free-flow · what to actually do',         count:  44, net: '+0.42' },
                { id: '0048', title: 'Reply · doubles vs sidemount',                  count:  31, net: '+0.55' },
              ].map((p, i) => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 60px 60px', gap: 12, padding: '11px 0', borderTop: i === 0 ? '1px solid var(--fg-primary)' : '1px solid var(--border-subtle)', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: ICR.mono, fontSize: 11, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{p.id}</span>
                  <span style={{ fontFamily: ICR.serif, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.35, letterSpacing: '-0.005em' }}>{p.title}</span>
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: ICR.mono, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>{p.count}</span>
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: ICR.mono, fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600 }}>{p.net}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing italic-serif "one thing to do" CTA */}
        <div style={{ padding: '24px 32px 32px', maxWidth: 1200, width: '100%', alignSelf: 'center', boxSizing: 'border-box', marginTop: 16 }}>
          <div style={{ padding: '22px 26px', background: 'var(--accent-soft)', borderRadius: 10, borderLeft: '3px solid var(--accent-primary)' }}>
            <ICR_Meta size={9} color="var(--accent-primary-press)">The one thing to do today</ICR_Meta>
            <p style={{ margin: '10px 0 0', fontFamily: ICR.serif, fontSize: 19, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
              Address the narcosis correction on 0042. Tek_diver_77's challenge is factually right, two other commenters are watching the thread, and a pinned correction will recover sentiment within 24 hours — the same shape that worked for the 0046 citation fix in March.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <span style={{ padding: '8px 14px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 6, fontFamily: ICR.sans, fontSize: 12.5, fontWeight: 600 }}>Open the thread</span>
              <span style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary-press)', borderRadius: 6, fontFamily: ICR.sans, fontSize: 12.5, fontWeight: 500 }}>Draft a correction</span>
            </div>
          </div>
        </div>

        {/* B2 · sticky bottom action bar */}
        {window.MultiSelectActionBar && (
          <window.MultiSelectActionBar
            count={selectedIds.length}
            onClear={clearSelection}
            actions={[
              { label: 'Reply with template', menu: true, onClick: () => pushToast('Bulk reply with template · ' + selectedIds.length) },
              { label: 'Mark resolved', onClick: () => pushToast('Bulk mark resolved · ' + selectedIds.length) },
              { label: 'Archive', onClick: () => pushToast('Bulk archive · ' + selectedIds.length) },
              { label: 'Delete', variant: 'danger', onClick: () => pushToast('Bulk delete · ' + selectedIds.length) },
            ]}
          />
        )}

      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_InboxComments_R2 });
