/* global React, window, HfShell, FreshnessPill */
/* hifi-inbox-dms-r2.jsx — DMs · Round 2.
   Editorial template applied to a brand-priority DM queue:
   header band + 5-metric KPI strip + 3-pane queue (brand outreach / direct
   questions / fans) + BTF extension (older DMs + brand-fit over time
   + most-active accounts + italic-serif "one thing to do" close).
   Replaces HF_InboxDMs at wiring time. Reads FreshnessPill off window
   (hifi-data-chrome.jsx). All other primitives are local. */

const IDR = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function IDR_Meta({ children, color = 'var(--fg-tertiary)', size = 10, style = {} }) {
  return <span style={{ fontFamily: IDR.sans, fontSize: size, color, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...style }}>{children}</span>;
}
function IDR_Mono({ children, color = 'var(--fg-secondary)', size = 11, style = {} }) {
  return <span style={{ fontFamily: IDR.mono, fontSize: size, color, ...style }}>{children}</span>;
}

function IDR_Dot({ intent }) {
  const colors = {
    question: 'var(--tone-info)',
    brand:    'var(--accent-primary)',
    fan:      'var(--tone-success)',
    critical: 'var(--tone-warning)',
    spam:     'var(--fg-tertiary)',
  };
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors[intent] || 'var(--fg-tertiary)', flexShrink: 0 }} />;
}

function IDR_Tag({ intent, label }) {
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
      fontFamily: IDR.mono, fontSize: 9.5, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      borderRadius: 3,
    }}>{label}</span>
  );
}

function IDR_Platform({ ch, size = 14 }) {
  const map = { ig: 'Ig', yt: 'Yt', tt: 'Tt', th: 'Th' };
  return (
    <span style={{
      width: size, height: size, borderRadius: 3,
      background: '#1a1815', color: 'var(--fg-on-ink)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: IDR.mono, fontSize: 8, fontWeight: 700,
      flexShrink: 0,
    }}>{map[ch] || 'Ig'}</span>
  );
}

// Brand fit badge — small inline pill that scores brand match
function IDR_FitPill({ score, fit }) {
  const tone = score >= 80 ? 'var(--tone-success)' : score >= 60 ? 'var(--accent-primary)' : score >= 40 ? 'var(--fg-secondary)' : 'var(--fg-tertiary)';
  const bg   = score >= 80 ? 'var(--tone-success-bg)' : score >= 60 ? 'var(--accent-soft)' : 'var(--surface-2)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 18, padding: '0 8px',
      background: bg, color: tone,
      fontFamily: IDR.mono, fontSize: 9.5, fontWeight: 600,
      letterSpacing: '0.04em', borderRadius: 3,
    }}>
      <span className="hf-num">FIT {score}</span>
      <span style={{ color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>· {fit}</span>
    </span>
  );
}

// ─── Data — brand priority order ─────────────────────────
const IDR_GROUPS = [
  {
    intent: 'brand', title: 'Brand outreach · ranked by fit', count: 7,
    summary: 'Sponsorship, gifting, partnership pitches',
    items: [
      { id: 'd1', ch: 'ig', from: 'Aqualung Partnerships', when: '1h', intent: 'brand', intentLabel: 'sponsorship', sentiment: 'positive', body: "We'd love to have you in the next iteration of the Mikron campaign. Talent fee + gear. Worth a 20-min call?",                                                                          context: 'first contact',     fit: 88, fitLabel: 'safety match' },
      { id: 'd2', ch: 'ig', from: 'Mares · creator',       when: '5h', intent: 'brand', intentLabel: 'gifting',     sentiment: 'neutral',  body: "Sending the Quad Air reg over for a teardown if you're game — no script ask, just authentic content.",                                                                              context: 'returning · 2nd ask', fit: 72, fitLabel: 'gear fit'      },
      { id: 'd3', ch: 'ig', from: 'Suunto EMEA',           when: '1d', intent: 'brand', intentLabel: 'sponsorship', sentiment: 'positive', body: "Quarterly ambassador slot. Multi-channel commitment, 90-day window.",                                                                                                                  context: 'returning',         fit: 64, fitLabel: 'computer fit'  },
    ],
  },
  {
    intent: 'question', title: 'Direct questions · 12', count: 12,
    summary: 'From real divers, not brands',
    items: [
      { id: 'd4', ch: 'tt', from: 'jenna_freediver', when: '3h', intent: 'question', intentLabel: 'career advice', sentiment: 'neutral', body: "How did you decide to go full-time on this? I'm at 40k and wondering if I should give up the day job.",       context: '· follower since 2024' },
      { id: 'd5', ch: 'ig', from: 'rohan_dives_kar', when: '6h', intent: 'question', intentLabel: 'gear advice',   sentiment: 'neutral', body: "First wing BCD recommendation? Budget around $600 USD, mostly recreational + occasional wreck.",                context: '· first DM'           },
    ],
  },
  {
    intent: 'fan', title: 'Fans · low priority · 38', count: 38,
    summary: 'Compliments, gratitude, shares',
    items: [
      { id: 'd6', ch: 'ig', from: 'cori_underwaterstills', when: '2d', intent: 'fan', intentLabel: 'fan', sentiment: 'positive', body: "Just wanted to say your channel made me start diving safer. That's all, thank you.", context: '· no reply needed' },
    ],
  },
];

const IDR_DETAIL = {
  id: 'd1', ch: 'ig', from: 'Aqualung Partnerships', when: '1h',
  intent: 'brand', intentLabel: 'sponsorship', sentiment: 'positive',
  handle: '@aqualung.partnerships · Instagram',
  followers: '184k', priorThreads: 0, tier: 'first contact · brand', fit: 88, fitLabel: 'safety match',
  fullBody: "Hi Henry — we've been watching the channel for about a year and your safety positioning is exactly what we want associated with the Mikron line for 2026. We'd love to have you in the next iteration of the campaign. Talent fee + full gear set + travel covered. Worth a 20-min intro call this week or next?",
  brandNote: "You've recommended Mikron in 0040 and 0044 already. Their safety positioning matches your most-saved hooks (cold-open, plain-spoken, no-hype). Last brand fit at this score: Suunto · 86 · closed.",
  suggested: "Thanks — Mikron is a reg I've genuinely recommended to OW students, so this isn't a stretch. Happy to talk. Two things up front: I don't read scripts, and I keep editorial control on safety messaging. If those are workable, I can do Tuesday or Thursday next week, 30 min.",
  alts: [
    { tone: 'warmer', len: '64 words', body: "Thanks for reaching out — Mikron is genuinely a reg I'd recommend, so this isn't a stretch on my end. I'd love to learn more before committing. Two non-negotiables I'd flag now: I don't read scripts, and I keep editorial control on safety claims. Both Tuesday and Thursday next week work for an intro." },
    { tone: 'curt',   len: '28 words', body: "Interested in principle. Two things up front — no scripts, full editorial on safety. Let me know if those work and I'll send a calendar." },
    { tone: 'pass',   len: '22 words', body: "Thanks for reaching out — booked solid through Q2. If the slot's still open in July, ping me again." },
  ],
};

// ─── 3-pane queue ────────────────────────────────────────
function IDR_LeftList({ groups, activeId, selectedIds, onToggleSelect }) {
  const selSet = selectedIds || [];
  return (
    <div style={{
      width: 360, borderRight: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)', display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'auto',
    }}>
      <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <IDR_Meta size={9.5}>Brand priority · 7 new</IDR_Meta>
          <span style={{ flex: 1 }} />
          <IDR_Mono size={10} color="var(--fg-tertiary)">last sync · 2m</IDR_Mono>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {[
            ['brand',    'Brand',     7],
            ['question', 'Questions', 12],
            ['fan',      'Fans',      38],
          ].map(([i, l, n]) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 20, padding: '0 8px',
              background: 'var(--surface-2)', borderRadius: 999,
              fontFamily: IDR.sans, fontSize: 11, color: 'var(--fg-secondary)', fontWeight: 500,
            }}>
              <IDR_Dot intent={i} />{l}
              <span style={{ fontFamily: IDR.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{n}</span>
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
            <IDR_Dot intent={g.intent} />
            <span style={{ fontFamily: IDR.serif, fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{g.title}</span>
            <IDR_Mono size={10} color="var(--fg-tertiary)">· {g.count}</IDR_Mono>
          </div>
          {g.items.map((it) => {
            const checked = selSet.includes(it.id);
            return (
            <div key={it.id} style={{
              padding: '11px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: it.id === activeId ? 'var(--accent-soft)' : 'var(--surface-1)',
              borderLeft: it.id === activeId ? '2px solid var(--accent-primary)' : '2px solid transparent',
              display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}>
                {window.HF_Checkbox && (
                  <window.HF_Checkbox checked={checked} onChange={() => onToggleSelect && onToggleSelect(it.id)} ariaLabel={'Select DM from ' + it.from} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IDR_Platform ch={it.ch} />
                  <span style={{ fontFamily: IDR.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{it.from}</span>
                  <span style={{ flex: 1 }} />
                  <IDR_Mono size={9.5} color="var(--fg-tertiary)">{it.when}</IDR_Mono>
                </div>
                <div style={{ fontFamily: IDR.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {it.body}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                  <IDR_Tag intent={it.intent} label={it.intentLabel} />
                  {typeof it.fit === 'number' && <IDR_FitPill score={it.fit} fit={it.fitLabel} />}
                  {!it.fit && <IDR_Mono size={9.5} color="var(--fg-tertiary)">{it.context}</IDR_Mono>}
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

function IDR_Detail({ item }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', overflow: 'auto' }}>
      <div style={{ padding: '14px 28px 12px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <IDR_Platform ch={item.ch} size={20} />
          <span style={{ fontFamily: IDR.sans, fontSize: 14.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{item.from}</span>
          <IDR_Mono size={10} color="var(--fg-tertiary)">{item.handle}</IDR_Mono>
          <IDR_Tag intent={item.intent} label={item.intentLabel} />
          <IDR_FitPill score={item.fit} fit={item.fitLabel} />
          <span style={{ flex: 1 }} />
          <IDR_Mono size={10} color="var(--fg-tertiary)">brand · responds within 4h</IDR_Mono>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: IDR.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>
          <span>followers · {item.followers}</span>
          <span>· prior threads · {item.priorThreads}</span>
          <span>· {item.tier}</span>
        </div>
      </div>
      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #c8b08c, #8a7252)', border: '1px solid var(--border-default)' }} />
            <span style={{ fontFamily: IDR.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{item.from}</span>
            <IDR_Mono size={9.5} color="var(--fg-tertiary)">{item.when}</IDR_Mono>
          </div>
          <div style={{
            marginLeft: 34, padding: '12px 16px',
            background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
            borderRadius: 10, fontFamily: IDR.sans, fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.6,
          }}>{item.fullBody}</div>
        </div>
        {/* Brand-fit synthesis callout */}
        <div style={{ padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 8, borderLeft: '2px solid var(--accent-primary)' }}>
          <IDR_Meta size={9} color="var(--accent-primary-press)">Why Coopr ranked this 88</IDR_Meta>
          <div style={{ marginTop: 6, fontFamily: IDR.serif, fontSize: 13.5, color: 'var(--fg-primary)', fontStyle: 'italic', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
            "{item.brandNote}"
          </div>
        </div>
      </div>
    </div>
  );
}

function IDR_RightRail({ item }) {
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
          <IDR_Meta size={9.5}>Coopr · suggested reply</IDR_Meta>
        </div>
        <IDR_Mono size={10} color="var(--fg-tertiary)">non-negotiables surfaced · 3 alts</IDR_Mono>
      </div>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{
          padding: '12px 14px', background: 'var(--bg-base)',
          border: '1px solid var(--border-default)', borderRadius: 10,
          fontFamily: IDR.sans, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.6,
        }}>{item.suggested}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <span style={{ padding: '7px 12px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 6, fontFamily: IDR.sans, fontSize: 12, fontWeight: 600 }}>Send as is</span>
          <span style={{ padding: '7px 10px', border: '1px solid var(--border-default)', borderRadius: 6, fontFamily: IDR.sans, fontSize: 12, fontWeight: 500, color: 'var(--fg-secondary)' }}>Edit first</span>
          <span style={{ flex: 1 }} />
          <IDR_Mono size={10} color="var(--fg-tertiary)" style={{ alignSelf: 'center' }}>regenerate ⇄</IDR_Mono>
        </div>
      </div>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <IDR_Meta size={8.5} style={{ marginBottom: 6, display: 'block' }}>Alternatives</IDR_Meta>
        {item.alts.map((a, i) => (
          <div key={i} style={{ padding: '8px 10px', marginBottom: 5, background: 'var(--surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IDR_Mono size={9} color="var(--fg-tertiary)">{a.tone}</IDR_Mono>
              <span style={{ flex: 1 }} />
              <IDR_Mono size={9} color="var(--fg-tertiary)">{a.len}</IDR_Mono>
            </div>
            <span style={{ fontFamily: IDR.sans, fontSize: 11.5, color: 'var(--fg-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.body}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 16px' }}>
        <IDR_Meta size={8.5} style={{ marginBottom: 6, display: 'block' }}>Triage</IDR_Meta>
        {[
          ['Send to brand pipeline', 'B'], ['Snooze · 24h', 'Z'], ['Forward to manager', 'F'], ['Archive · pass', 'X'],
        ].map(([t, k]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px' }}>
            <span style={{ fontFamily: IDR.sans, fontSize: 11.5, color: 'var(--fg-secondary)', flex: 1 }}>{t}</span>
            <span style={{ fontFamily: IDR.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', width: 18, height: 18, border: '1px solid var(--border-subtle)', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-1)' }}>{k}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ─── Main surface ────────────────────────────────────────
function HF_InboxDMs_R2({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('inbox', 'DMs');
  // B2 · multi-select state. Pre-selected: d1 (Aqualung sponsorship · fit 88)
  // and d2 (Mares gifting · fit 72) — top two brand asks ranked by fit.
  const [selectedIds, setSelectedIds] = React.useState(['d1', 'd2']);
  let ms = null;
  try { ms = window.useMasterState && window.useMasterState(); } catch (_e) { ms = null; }
  const pushToast = (ms && ms.pushToast) ? ms.pushToast : function () {};
  function toggleSelect(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function clearSelection() { setSelectedIds([]); }
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="inbox" subtab="DMs"><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="inbox" subtab="DMs"><window.HF_EmptyHero
      eyebrow="DMs · 0 unread"
      title="Inbox zero. Brand and collab DMs land here as they arrive."
      caption="Sorted by brand-fit so the high-leverage ones surface first."
      ctaLabel="Open Inbox"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="inbox" subtab="DMs"><window.HF_ErrorHero
      title="Couldn't load DMs."
      body="The DM stream timed out. Retry, or check the platform connections."
    /></HfShell>;
  }
  return (
    <HfShell workspace="inbox" subtab="DMs" subtabRight={<>
      <span style={{ fontFamily: IDR.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>57 unread · brand-fit avg 71</span>
      <span style={{ fontFamily: IDR.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>brand priority · on</span>
      <FreshnessPill at="2m ago" state="fresh" />
    </>}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', position: 'relative' }}>

        {/* Header band */}
        <div style={{ padding: '22px 32px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
            <IDR_Meta size={10}>Inbox · DMs · Apr 28</IDR_Meta>
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: IDR.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-primary)' }} />
              <span>Since last visit · 23 new</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>7 brand asks ranked by fit · 12 direct questions · 4 fan notes</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>brand reply window · 4h target</span>
            </span>
            <IDR_Mono size={10} color="var(--fg-tertiary)">last sync · 2m ago</IDR_Mono>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
            <span style={{ fontFamily: IDR.serif, fontSize: 36, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--fg-primary)', maxWidth: 920 }}>
              <span style={{ fontStyle: 'italic' }}>Twenty-three new DMs since you last looked.</span>
              {' '}
              <span style={{ color: 'var(--fg-secondary)' }}>Three brand asks worth a call. Two questions worth a thoughtful answer.</span>
            </span>
          </div>
          <div style={{ marginTop: 10, fontFamily: IDR.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 760, letterSpacing: '-0.005em' }}>
            Brand outreach ranked by fit with your safety positioning, then direct questions surfaced from the fan layer. Spam and copy-paste pitches were filtered out before they reached this view.
          </div>
        </div>

        {/* KPI strip — 5 metrics */}
        <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
          {[
            ['unread · 7d',         '57',  'across YT IG TT'],
            ['brand asks',          '7',   '3 fit ≥ 80'],
            ['direct questions',    '12',  'from divers, not brands'],
            ['fans',                '38',  'no reply expected'],
            ['response · brands',   '84%', 'within 24h · 6.2h avg'],
          ].map(([l, v, sub], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <IDR_Meta size={9}>{l}</IDR_Meta>
              <span className="hf-num" style={{ fontFamily: IDR.sans, fontSize: 24, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{v}</span>
              <IDR_Mono size={10} color="var(--fg-tertiary)">{sub}</IDR_Mono>
            </div>
          ))}
        </div>

        {/* 3-pane brand-priority queue */}
        <div style={{ display: 'flex', height: 620, flexShrink: 0, borderBottom: '1px solid var(--border-subtle)' }}>
          <IDR_LeftList groups={IDR_GROUPS} activeId="d1" selectedIds={selectedIds} onToggleSelect={toggleSelect} />
          <IDR_Detail item={IDR_DETAIL} />
          <IDR_RightRail item={IDR_DETAIL} />
        </div>

        {/* ─── BTF ─────────────────────────────────── */}

        {/* Older DMs · already replied or archived */}
        <div style={{ padding: '24px 32px 8px', maxWidth: 1200, width: '100%', alignSelf: 'center', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: IDR.serif, fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>From last 30 days · already handled</span>
            <IDR_Mono size={10} color="var(--fg-tertiary)">· 184 archived · sorted by outcome</IDR_Mono>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { ch: 'ig', from: 'Patagonia · creator',  when: 'Apr 22', body: "Editorial fee for the dive-conservation series. No script ask. Three-month window.",                                                              intent: 'brand',    tag: 'closed',    meta: 'Booked · shoots May 12-18',         fit: 92 },
              { ch: 'ig', from: 'GoPro Creators',        when: 'Apr 18', body: "Hero 13 early access for honest review. We trust your safety lens, you don't pull punches.",                                                      intent: 'brand',    tag: 'shipped',   meta: 'Review live in 0046 · 184k saves',  fit: 78 },
              { ch: 'tt', from: 'leila_dives',           when: 'Apr 15', body: "Got my first wreck cert this week — your 0042 was the one that made me want to go. Thank you.",                                                  intent: 'fan',      tag: 'replied',   meta: 'Replied · liked + 12 hearts'                       },
              { ch: 'ig', from: 'Mares · creator',       when: 'Apr 09', body: "First gifting ask · Quad Air reg teardown. Returning this week with the same offer.",                                                             intent: 'brand',    tag: 'pending',   meta: 'Re-pitched in d2 · upgraded to gear-fit', fit: 68 },
            ].map((d, i) => (
              <div key={i} style={{ padding: '14px 4px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '70px 1fr 220px', gap: 18, alignItems: 'flex-start', opacity: 0.85 }}>
                <IDR_Mono size={10} color="var(--fg-tertiary)" style={{ paddingTop: 4 }}>{d.when}</IDR_Mono>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IDR_Platform ch={d.ch} />
                    <span style={{ fontFamily: IDR.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{d.from}</span>
                    {typeof d.fit === 'number' && <IDR_FitPill score={d.fit} fit="" />}
                  </div>
                  <span style={{ fontFamily: IDR.serif, fontSize: 15, fontWeight: 400, color: 'var(--fg-secondary)', lineHeight: 1.5, letterSpacing: '-0.005em', fontStyle: d.intent === 'fan' ? 'italic' : 'normal' }}>"{d.body}"</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 14, borderLeft: '1px solid var(--border-subtle)' }}>
                  <IDR_Meta size={9}>Outcome</IDR_Meta>
                  <IDR_Tag intent={d.intent} label={d.tag} />
                  <IDR_Mono size={10} color="var(--fg-secondary)" style={{ lineHeight: 1.5 }}>{d.meta}</IDR_Mono>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand-fit over time + most-active accounts */}
        <div style={{ padding: '24px 32px 8px', maxWidth: 1200, width: '100%', alignSelf: 'center', boxSizing: 'border-box', marginTop: 16, paddingTop: 18, borderTop: '6px double var(--fg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <IDR_Meta size={9}>Brand fit over time · last 4 weeks</IDR_Meta>
            <div style={{ marginTop: 10, padding: '14px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { week: 'Apr 1',  high: 1, mid: 3, low: 5,  avg: '52' },
                  { week: 'Apr 8',  high: 2, mid: 4, low: 4,  avg: '61' },
                  { week: 'Apr 15', high: 3, mid: 3, low: 3,  avg: '68' },
                  { week: 'Apr 22', high: 4, mid: 4, low: 2,  avg: '74' },
                ].map((w, i) => {
                  const total = w.high + w.mid + w.low;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                      <div style={{ display: 'flex', flexDirection: 'column-reverse', height: 90, gap: 1 }}>
                        <div style={{ height: `${(w.high / total) * 100}%`, background: 'var(--tone-success)', borderRadius: 1 }} />
                        <div style={{ height: `${(w.mid / total) * 100}%`,  background: 'var(--accent-primary)' }} />
                        <div style={{ height: `${(w.low / total) * 100}%`,  background: 'var(--fg-tertiary)', borderRadius: 1 }} />
                      </div>
                      <IDR_Mono size={9.5} color="var(--fg-tertiary)" style={{ textAlign: 'center', marginTop: 4 }}>{w.week}</IDR_Mono>
                      <span className="hf-num" style={{ fontFamily: IDR.mono, fontSize: 11, color: 'var(--accent-primary)', textAlign: 'center', fontWeight: 600 }}>avg {w.avg}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 14, fontFamily: IDR.mono, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--tone-success)' }} /> fit ≥ 80</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--accent-primary)' }} /> fit 60-79</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--fg-tertiary)' }} /> fit &lt; 60</span>
              </div>
            </div>
          </div>

          <div>
            <IDR_Meta size={9}>Most-active accounts · last 30d</IDR_Meta>
            <div style={{ marginTop: 10 }}>
              {[
                { handle: '@aqualung.partnerships', kind: 'brand',    msgs: 8,  fit: 88, last: '1h ago' },
                { handle: '@mares.creator',         kind: 'brand',    msgs: 6,  fit: 72, last: '5h ago' },
                { handle: '@suunto_emea',           kind: 'brand',    msgs: 5,  fit: 64, last: '1d ago' },
                { handle: '@jenna_freediver',      kind: 'fan/q',    msgs: 4,  fit: 0,  last: '3h ago' },
                { handle: '@cori_underwaterstills', kind: 'fan',     msgs: 3,  fit: 0,  last: '2d ago' },
              ].map((a, i) => (
                <div key={a.handle} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px', gap: 12, padding: '11px 0', borderTop: i === 0 ? '1px solid var(--fg-primary)' : '1px solid var(--border-subtle)', alignItems: 'baseline' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontFamily: IDR.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{a.handle}</span>
                    <IDR_Mono size={9.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.04em' }}>{a.kind} · last {a.last}</IDR_Mono>
                  </div>
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: IDR.mono, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>{a.msgs}</span>
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: IDR.mono, fontSize: 11, color: a.fit > 0 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 600 }}>{a.fit > 0 ? `fit ${a.fit}` : '—'}</span>
                  <span style={{ textAlign: 'right', fontFamily: IDR.mono, fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.04em' }}>↗ open</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing italic-serif "one thing to do" CTA */}
        <div style={{ padding: '24px 32px 32px', maxWidth: 1200, width: '100%', alignSelf: 'center', boxSizing: 'border-box', marginTop: 16 }}>
          <div style={{ padding: '22px 26px', background: 'var(--accent-soft)', borderRadius: 10, borderLeft: '3px solid var(--accent-primary)' }}>
            <IDR_Meta size={9} color="var(--accent-primary-press)">The one thing to do today</IDR_Meta>
            <p style={{ margin: '10px 0 0', fontFamily: IDR.serif, fontSize: 19, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
              Reply to Aqualung Partnerships before end of week. Mikron is a regulator you've already recommended on-camera in 0040 and 0044, the talent fee scales with safety creators at your follower count, and the team has been watching for a year — first contact at fit 88 is a calibration signal worth a thirty-minute call.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <span style={{ padding: '8px 14px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 6, fontFamily: IDR.sans, fontSize: 12.5, fontWeight: 600 }}>Send the suggested reply</span>
              <span style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary-press)', borderRadius: 6, fontFamily: IDR.sans, fontSize: 12.5, fontWeight: 500 }}>Schedule the call directly</span>
            </div>
          </div>
        </div>

        {/* B2 · sticky bottom action bar */}
        {window.MultiSelectActionBar && (
          <window.MultiSelectActionBar
            count={selectedIds.length}
            onClear={clearSelection}
            actions={[
              { label: 'Mark replied', onClick: () => pushToast('Bulk mark replied · ' + selectedIds.length) },
              { label: 'Snooze', onClick: () => pushToast('Bulk snooze · ' + selectedIds.length) },
              { label: 'Archive', onClick: () => pushToast('Bulk archive · ' + selectedIds.length) },
            ]}
          />
        )}

      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_InboxDMs_R2 });
