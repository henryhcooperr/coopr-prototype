/* global React, window, HfShell, FreshnessPill */
/* hifi-inbox.jsx — Inbox workspace, all 4 sub-tabs.
   Sprout-style intent-pre-classified pattern: separate by intent (questions /
   brand outreach / fans / spam), NOT chronologically. Each message gets
   sentiment + intent labels. Right rail per message: AI-suggested reply
   matched to creator's voice profile. */

const I_INB = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function InbMeta({ children, color = 'var(--fg-tertiary)', size = 10, style = {} }) {
  return <span style={{ fontFamily: I_INB.sans, fontSize: size, color, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...style }}>{children}</span>;
}
function InbMono({ children, color = 'var(--fg-secondary)', size = 11, style = {} }) {
  return <span style={{ fontFamily: I_INB.mono, fontSize: size, color, ...style }}>{children}</span>;
}

// Intent dot — color-coded by classification
function IntentDot({ intent }) {
  const colors = {
    question: 'var(--tone-info)',
    brand:    'var(--accent-primary)',
    fan:      'var(--tone-success)',
    critical: 'var(--tone-warning)',
    spam:     'var(--fg-tertiary)',
  };
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors[intent] || 'var(--fg-tertiary)', flexShrink: 0 }} />;
}

function IntentTag({ intent, label }) {
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
      fontFamily: I_INB.mono, fontSize: 9.5, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      borderRadius: 3,
    }}>{label}</span>
  );
}

function PlatformGlyph({ ch, size = 14 }) {
  const map = {
    ig: { bg: '#1a1815', label: 'Ig' },
    yt: { bg: '#1a1815', label: 'Yt' },
    tt: { bg: '#1a1815', label: 'Tt' },
    th: { bg: '#1a1815', label: 'Th' },
  };
  const m = map[ch] || map.ig;
  return (
    <span style={{
      width: size, height: size, borderRadius: 3,
      background: m.bg, color: 'var(--fg-on-ink)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: I_INB.mono, fontSize: 8, fontWeight: 700,
      flexShrink: 0,
    }}>{m.label}</span>
  );
}

// ─── Intent-grouped left list (the core pattern) ───────────
function InboxIntentList({ groups, activeId }) {
  return (
    <div style={{
      width: 380, borderRight: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'auto',
    }}>
      {/* Triage header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <InbMeta size={9.5}>Triage · 142 unread</InbMeta>
          <span style={{ flex: 1 }} />
          <InbMono size={10} color="var(--fg-tertiary)">last sync · 2m ago</InbMono>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            ['question', 'Questions', 38],
            ['brand', 'Brand', 7],
            ['fan', 'Fans', 64],
            ['critical', 'Critical', 4],
            ['spam', 'Spam', 29],
          ].map(([i, l, n]) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 22, padding: '0 8px',
              background: 'var(--surface-2)', borderRadius: 999,
              fontFamily: I_INB.sans, fontSize: 11, color: 'var(--fg-secondary)', fontWeight: 500,
            }}>
              <IntentDot intent={i} />
              {l}
              <span style={{ fontFamily: I_INB.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{n}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Groups */}
      {groups.map((g, gi) => (
        <div key={gi}>
          <div style={{
            padding: '14px 16px 8px',
            display: 'flex', alignItems: 'baseline', gap: 8,
            borderTop: gi === 0 ? 'none' : '1px solid var(--border-subtle)',
            background: 'var(--surface-2)',
          }}>
            <IntentDot intent={g.intent} />
            <span style={{ fontFamily: I_INB.serif, fontSize: 16, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{g.title}</span>
            <InbMono size={10} color="var(--fg-tertiary)">· {g.count}</InbMono>
            <span style={{ flex: 1 }} />
            <InbMono size={10} color="var(--fg-tertiary)">{g.summary}</InbMono>
          </div>
          {g.items.map((it) => (
            <InboxRow key={it.id} item={it} active={it.id === activeId} />
          ))}
        </div>
      ))}
    </div>
  );
}

function InboxRow({ item, active }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
      borderLeft: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
      display: 'flex', flexDirection: 'column', gap: 4,
      cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PlatformGlyph ch={item.ch} />
        <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{item.from}</span>
        <span style={{ flex: 1 }} />
        <InbMono size={9.5} color="var(--fg-tertiary)">{item.when}</InbMono>
      </div>
      <div style={{ fontFamily: I_INB.sans, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.body}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
        <IntentTag intent={item.intent} label={item.intentLabel} />
        {item.sentiment && (
          <span style={{ fontFamily: I_INB.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>
            sentiment · {item.sentiment}
          </span>
        )}
        {item.context && (
          <>
            <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--fg-tertiary)' }} />
            <InbMono size={9.5} color="var(--fg-tertiary)">{item.context}</InbMono>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Detail pane (center) ──────────────────────────────────
function InboxDetail({ item, contextLine }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '18px 32px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <PlatformGlyph ch={item.ch} size={20} />
          <span style={{ fontFamily: I_INB.sans, fontSize: 15, fontWeight: 600, color: 'var(--fg-primary)' }}>{item.from}</span>
          <InbMono size={10} color="var(--fg-tertiary)">{item.handle}</InbMono>
          <IntentTag intent={item.intent} label={item.intentLabel} />
          <span style={{ flex: 1 }} />
          <InbMono size={10} color="var(--fg-tertiary)">{contextLine}</InbMono>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: I_INB.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>
          <span>followers · {item.followers}</span>
          <span>· prior threads · {item.priorThreads || 0}</span>
          <span>· lifetime sentiment · {item.sentiment}</span>
          {item.tier && <span>· {item.tier}</span>}
        </div>
      </div>

      {/* Conversation */}
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
        {/* Their message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #c8b08c, #8a7252)',
              border: '1px solid var(--border-default)',
            }} />
            <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{item.from}</span>
            <InbMono size={9.5} color="var(--fg-tertiary)">{item.when}</InbMono>
          </div>
          <div style={{
            marginLeft: 36, padding: '14px 18px',
            background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            fontFamily: I_INB.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6,
          }}>
            {item.fullBody || item.body}
          </div>
          {item.attachedPost && (
            <div style={{ marginLeft: 36, marginTop: 4, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 36, height: 48, background: 'var(--border-default)', borderRadius: 4, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <InbMono size={9.5} color="var(--fg-tertiary)">In reply to</InbMono>
                <div style={{ fontFamily: I_INB.sans, fontSize: 12, color: 'var(--fg-primary)', fontWeight: 500 }}>{item.attachedPost}</div>
              </div>
              <InbMono size={10} color="var(--fg-tertiary)">↗ open</InbMono>
            </div>
          )}
        </div>

        {/* Prior thread (if any) */}
        {item.priorThread && (
          <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, borderLeft: '2px solid var(--border-strong)' }}>
            <InbMono size={9.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.08em' }}>Prior thread · {item.priorThread.when}</InbMono>
            <div style={{ marginTop: 4, fontFamily: I_INB.sans, fontSize: 12.5, color: 'var(--fg-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{item.priorThread.body}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Right rail — voice-matched suggested reply + actions ──
function InboxRightRail({ item }) {
  return (
    <aside style={{
      width: 360, borderLeft: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)', flexShrink: 0,
      display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="var(--fg-on-accent)" /></svg>
          </span>
          <InbMeta size={9.5}>Coopr · suggested reply</InbMeta>
        </div>
        <InbMono size={10} color="var(--fg-tertiary)">matched to your voice · 3 alts</InbMono>
      </div>

      {/* Voice match indicators */}
      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 6, borderBottom: '1px solid var(--border-subtle)' }}>
        <InbMeta size={8.5}>Voice match</InbMeta>
        {[
          ['plainspoken', 'high'],
          ['short sentences', 'high'],
          ['avoids hype words', 'pass'],
          ['precise on gear', 'medium'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: I_INB.sans, fontSize: 11.5, color: 'var(--fg-secondary)', flex: 1 }}>{k}</span>
            <span style={{ width: 60, height: 3, background: 'var(--surface-2)', borderRadius: 2, position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: v === 'high' ? '92%' : v === 'medium' ? '64%' : '78%',
                background: 'var(--accent-primary)', borderRadius: 2,
              }} />
            </span>
            <InbMono size={9} color="var(--fg-tertiary)">{v}</InbMono>
          </div>
        ))}
      </div>

      {/* Suggested reply */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{
          padding: '14px 16px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          fontFamily: I_INB.sans, fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.6,
        }}>
          {item.suggested}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <span style={{
            padding: '7px 14px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            borderRadius: 6, fontFamily: I_INB.sans, fontSize: 12, fontWeight: 600,
          }}>Send as is</span>
          <span style={{
            padding: '7px 12px', background: 'transparent', color: 'var(--fg-secondary)',
            border: '1px solid var(--border-default)', borderRadius: 6,
            fontFamily: I_INB.sans, fontSize: 12, fontWeight: 500,
          }}>Edit first</span>
          <span style={{ flex: 1 }} />
          <InbMono size={10} color="var(--fg-tertiary)" style={{ alignSelf: 'center' }}>regenerate ⇄</InbMono>
        </div>
      </div>

      {/* Alternatives */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
        <InbMeta size={8.5} style={{ marginBottom: 8, display: 'block' }}>Alternatives</InbMeta>
        {item.alts.map((a, i) => (
          <div key={i} style={{
            padding: '10px 12px', marginBottom: 6,
            background: 'var(--surface-2)', borderRadius: 8,
            display: 'flex', flexDirection: 'column', gap: 4,
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <InbMono size={9} color="var(--fg-tertiary)">{a.tone}</InbMono>
              <span style={{ flex: 1 }} />
              <InbMono size={9} color="var(--fg-tertiary)">{a.len}</InbMono>
            </div>
            <span style={{ fontFamily: I_INB.sans, fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {a.body}
            </span>
          </div>
        ))}
      </div>

      {/* Triage actions */}
      <div style={{ padding: '12px 18px' }}>
        <InbMeta size={8.5} style={{ marginBottom: 8, display: 'block' }}>Triage</InbMeta>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            ['Mark replied', 'M'],
            ['Snooze · 4h',  'Z'],
            ['Pin to follow up', 'P'],
            ['Block & report',   '⌫'],
          ].map(([t, k]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 5 }}>
              <span style={{ fontFamily: I_INB.sans, fontSize: 12, color: 'var(--fg-secondary)', flex: 1 }}>{t}</span>
              <span style={{
                fontFamily: I_INB.mono, fontSize: 9.5, color: 'var(--fg-tertiary)',
                width: 18, height: 18, border: '1px solid var(--border-subtle)',
                borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface-1)',
              }}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── COMMENTS sub-tab ─────────────────────────────────────
const COMMENTS_DATA = {
  groups: [
    {
      intent: 'question', title: 'Questions worth your voice', count: 11,
      summary: 'Real gear or technique questions',
      items: [
        { id: 'c1', ch: 'yt', from: 'maya_diving', when: '12m', intent: 'question', intentLabel: 'gear question', sentiment: 'neutral', body: "What pressure are you running on the AL80 there? Looked like you came up with a lot left in the tank.", context: 'on 0044 · 0:42' },
        { id: 'c2', ch: 'ig', from: 'reefdoc.kim', when: '24m', intent: 'question', intentLabel: 'technique', sentiment: 'positive', body: "Hi Henry — when you say 'breath up' before a deco stop, do you mean two breaths or full hyperventilation? Trying to teach this to a class.", context: 'on 0046' },
        { id: 'c3', ch: 'tt', from: 'caleb.r',   when: '1h',  intent: 'question', intentLabel: 'safety', sentiment: 'neutral', body: "If your buddy's reg free-flows at 18m and you're at 60 bar — what's the actual call?", context: 'on 0039' },
      ],
    },
    {
      intent: 'fan', title: 'Fans · respond when you can', count: 64,
      summary: 'Positive, short, no question',
      items: [
        { id: 'c4', ch: 'yt', from: 'pavel_underwater', when: '2h', intent: 'fan', intentLabel: 'fan', sentiment: 'positive', body: "This is the only safety channel I trust. Keep these long ones coming.", context: 'on 0042' },
        { id: 'c5', ch: 'ig', from: 'silke.diveinstructor', when: '3h', intent: 'fan', intentLabel: 'peer praise', sentiment: 'positive', body: "Showed this to my OW class today — perfect for the panic-management lesson.", context: 'on 0046' },
      ],
    },
    {
      intent: 'critical', title: 'Critical · address today', count: 2,
      summary: 'Disagreement, factual challenge, or escalation',
      items: [
        { id: 'c6', ch: 'yt', from: 'tek_diver_77', when: '4h', intent: 'critical', intentLabel: 'factual challenge', sentiment: 'negative', body: "The narcosis depth you cited at 3:14 is wrong for a CCR diver — that's an OC number. This matters for your tek viewers.", context: 'on 0042 · 3:14' },
      ],
    },
    {
      intent: 'spam', title: 'Spam · ignored', count: 29,
      summary: 'Auto-classified, no action needed',
      items: [
        { id: 'c7', ch: 'ig', from: '_growth_partner_', when: '5h', intent: 'spam', intentLabel: 'spam', sentiment: 'neutral', body: "Hi creator! We help YouTubers grow 10x in 90 days, DM us…", context: '· hidden' },
      ],
    },
  ],
};

const COMMENTS_DETAIL = {
  ...COMMENTS_DATA.groups[0].items[0],
  handle: '@maya_diving · YouTube',
  followers: '2,400',
  priorThreads: 1,
  tier: 'returning · 3rd comment',
  fullBody: "What pressure are you running on the AL80 there? Looked like you came up with a lot left in the tank — I always run mine deeper and end up on fumes. Curious if you're tracking SAC or just going by feel at this point.",
  attachedPost: '0044 · Truk Lagoon · the Fujikawa Maru in eight breaths',
  priorThread: { when: 'Apr 6 · on 0040', body: 'Loved the DIN vs yoke breakdown. Switching the rest of my regs over.' },
  suggested: "Running ~150 bar reserve on AL80s for wreck work — I'd rather come up early than push it. I do track SAC (about 18 L/min on relaxed bottom time, closer to 22 on the swim back). Feel is fine for OW depth, but inside the wreck I want the number.",
  alts: [
    { tone: 'shorter', len: '24 words', body: "150 bar reserve on AL80s for wreck dives. I track SAC — about 18 L/min relaxed, 22 on the swim back." },
    { tone: 'teach-leaning', len: '52 words', body: "Good question — for wreck penetration I run a 150-bar reserve and track SAC religiously (18-22 L/min depending on workload). For open water OW depth I'd say feel is fine if you've got the reps in. The wreck gets the number every time." },
    { tone: 'redirect', len: '18 words', body: "I covered the SAC-tracking part of this in 0040 (around 4:30) — that explains the why better than I can in a comment." },
  ],
};

function HF_InboxComments() {
  return (
    <HfShell workspace="inbox" subtab="Comments" subtabRight={
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>
        <span>auto-triage · on</span>
        <span style={{ color: 'var(--fg-secondary)' }}>group by · intent ▾</span>
        <span style={{ color: 'var(--fg-secondary)' }}>filter · all platforms ▾</span>
      </div>
    }>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <InboxIntentList groups={COMMENTS_DATA.groups} activeId="c1" />
        <InboxDetail item={COMMENTS_DETAIL} contextLine="3 unread above" />
        <InboxRightRail item={COMMENTS_DETAIL} />
      </div>
    </HfShell>
  );
}

// ─── DMs sub-tab ───────────────────────────────────────────
const DMS_DATA = {
  groups: [
    {
      intent: 'brand', title: 'Brand outreach · 7 new', count: 7,
      summary: 'Sponsorship, gifting, partnership pitches',
      items: [
        { id: 'd1', ch: 'ig', from: 'Aqualung Partnerships', when: '1h', intent: 'brand', intentLabel: 'sponsorship', sentiment: 'positive', body: "Hi Henry — we'd love to have you in the next iteration of the Mikron campaign. Talent fee + gear. Worth a 20-min call?", context: 'first contact' },
        { id: 'd2', ch: 'ig', from: 'Mares · creator',     when: '5h', intent: 'brand', intentLabel: 'gifting',     sentiment: 'neutral',  body: "Sending the Quad Air reg over for a teardown if you're game — no script ask, just authentic content.", context: 'returning · 2nd ask' },
        { id: 'd3', ch: 'ig', from: 'Suunto EMEA',         when: '1d', intent: 'brand', intentLabel: 'sponsorship', sentiment: 'positive', body: "Quarterly ambassador slot. Multi-channel commitment, 90-day window.", context: 'returning' },
      ],
    },
    {
      intent: 'question', title: 'Direct questions · 12', count: 12,
      summary: 'From real divers, not brands',
      items: [
        { id: 'd4', ch: 'tt', from: 'jenna_freediver', when: '3h', intent: 'question', intentLabel: 'career advice', sentiment: 'neutral', body: "How did you decide to go full-time on this? I'm at 40k and wondering if I should give up the day job.", context: '· follower since 2024' },
        { id: 'd5', ch: 'ig', from: 'rohan_dives_kar',  when: '6h', intent: 'question', intentLabel: 'gear advice', sentiment: 'neutral', body: "First wing BCD recommendation? Budget around $600 USD, mostly recreational + occasional wreck.", context: '· first DM' },
      ],
    },
    {
      intent: 'fan', title: 'Fans · low priority', count: 38,
      summary: 'Compliments, gratitude, shares',
      items: [
        { id: 'd6', ch: 'ig', from: 'cori_underwaterstills', when: '2d', intent: 'fan', intentLabel: 'fan', sentiment: 'positive', body: "Just wanted to say your channel made me start diving safer. That's all, thank you.", context: '· no reply needed' },
      ],
    },
  ],
};

const DMS_DETAIL = {
  ...DMS_DATA.groups[0].items[0],
  handle: '@aqualung.partnerships · Instagram',
  followers: '184k',
  priorThreads: 0,
  tier: 'first contact · brand',
  fullBody: "Hi Henry — we've been watching the channel for about a year and your safety positioning is exactly what we want associated with the Mikron line for 2026. We'd love to have you in the next iteration of the campaign. Talent fee + full gear set + travel covered. Worth a 20-min intro call this week or next?",
  suggested: "Thanks — Mikron is a reg I've genuinely recommended to OW students, so this isn't a stretch. Happy to talk. Two things up front: I don't read scripts, and I keep editorial control on safety messaging. If those are workable, I can do Tuesday or Thursday next week, 30 min.",
  alts: [
    { tone: 'warmer', len: '64 words', body: "Thanks for reaching out — Mikron is genuinely a reg I'd recommend, so this isn't a stretch on my end. I'd love to learn more before committing to anything. Two non-negotiables I'd flag now: I don't read scripts, and I keep editorial control on safety claims. Both Tuesday and Thursday next week work for an intro." },
    { tone: 'curt',    len: '28 words', body: "Interested in principle. Two things up front — no scripts, full editorial on safety. Let me know if those work and I'll send a calendar." },
    { tone: 'pass',    len: '22 words', body: "Thanks for reaching out — booked solid through Q2. If the slot's still open in July, ping me again." },
  ],
};

function HF_InboxDMs() {
  return (
    <HfShell workspace="inbox" subtab="DMs" subtabRight={
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>
        <span style={{ color: 'var(--fg-secondary)' }}>brand priority · on</span>
        <span style={{ color: 'var(--fg-secondary)' }}>group by · intent ▾</span>
      </div>
    }>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <InboxIntentList groups={DMS_DATA.groups} activeId="d1" />
        <InboxDetail item={DMS_DETAIL} contextLine="brand · responds within 4h average" />
        <InboxRightRail item={DMS_DETAIL} />
      </div>
    </HfShell>
  );
}

// ─── Mentions sub-tab ──────────────────────────────────────
function HF_InboxMentions({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('inbox', 'Mentions');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  // E2 · click coverage. Pull pushToast off master state so influencer cards
  // and watch-a-creator CTA route through the toast layer.
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  if (s === 'loading') {
    return <HfShell workspace="inbox" subtab="Mentions"><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="inbox" subtab="Mentions"><window.HF_EmptyHero
      eyebrow="Mentions · 0 today"
      title="No mentions yet. Tags and @-pings land here as they happen."
      caption="Influencers and high-sentiment mentions float to the top automatically."
      ctaLabel="Open Inbox"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="inbox" subtab="Mentions"><window.HF_ErrorHero
      title="Couldn't load mentions."
      body="The mentions feed timed out. Retry, or check the platform connections."
    /></HfShell>;
  }
  return (
    <HfShell workspace="inbox" subtab="Mentions" subtabRight={<>
      <span style={{ fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>142 mentions · 7d · sentiment +0.62</span>
      <span style={{ fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>filter · all platforms ▾</span>
      <FreshnessPill at="2m ago" state="fresh" />
    </>}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

        {/* Header band — byline + newsticker + serif headline + italic deck */}
        <div style={{ padding: '22px 32px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
            <InbMeta size={10}>Inbox · Mentions · Apr 28</InbMeta>
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: I_INB.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-primary)' }} />
              <span>Since last visit · 23 new across 4 platforms</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>8 peer · 2 media · 11 brand · 1 critical · 1 cross-niche</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>response window · same-day</span>
            </span>
            <InbMono size={10} color="var(--fg-tertiary)">last sync · 2m ago</InbMono>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
            <span style={{ fontFamily: I_INB.serif, fontSize: 36, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--fg-primary)', maxWidth: 920 }}>
              <span style={{ fontStyle: 'italic' }}>Twenty-three new mentions since you last looked.</span>
              {' '}
              <span style={{ color: 'var(--fg-secondary)' }}>Two are media you should reply to privately. One critical thread is worth your hand today.</span>
            </span>
          </div>
          <div style={{ marginTop: 10, fontFamily: I_INB.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 760, letterSpacing: '-0.005em' }}>
            Coopr surfaced who's name-dropping you and how the room is reading it. Triage left to right: peer praise to acknowledge, media to take to DM, the critical mention to address before it spreads.
          </div>
        </div>

        {/* KPI strip — 5 metrics */}
        <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
          {[
            ['mentions · 7d',   '142',   '+18 vs last week'],
            ['by peers',        '47',    'creators with >10k'],
            ['by media',        '4',     'Diver Magazine, Outside'],
            ['by brands',       '11',    'unprompted'],
            ['sentiment · 7d',  '+0.62', 'up from +0.55 last week'],
          ].map(([l, v, sub], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <InbMeta size={9}>{l}</InbMeta>
              <span className="hf-num" style={{ fontFamily: I_INB.sans, fontSize: 24, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{v}</span>
              <InbMono size={10} color="var(--fg-tertiary)">{sub}</InbMono>
            </div>
          ))}
        </div>

        {/* Influencer strip — high-fit mentioners with collaboration potential */}
        <div style={{ padding: '20px 32px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: I_INB.serif, fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>Influencer mentions · worth your attention</span>
            <InbMono size={10} color="var(--fg-tertiary)">4 with reach above 50k · sorted by collaboration fit</InbMono>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { handle: 'reefdoc.kim',          followers: '128k', fit: 'high',   pillar: 'safety · primer',  ch: 'yt', last: 'mentioned 6h ago',  note: 'Three cross-references in last 30 days · would respond to a DM' },
              { handle: 'cassidy.codes',        followers: '94k',  fit: 'medium', pillar: 'cross-niche · craft', ch: 'tt', last: 'mentioned Apr 16',  note: 'Outside-the-niche endorsement · drives discovery' },
              { handle: 'silke.diveinstructor', followers: '34k',  fit: 'high',   pillar: 'safety · classroom', ch: 'ig', last: 'mentioned 2h ago',  note: 'Uses your work in OW classes · co-creator candidate' },
              { handle: 'tek_diver_77',         followers: '8k',   fit: 'medium', pillar: 'tek · technical',    ch: 'yt', last: 'mentioned 4h ago',  note: 'Critical-but-fair · fact-checking strengthens trust' },
            ].map((m, i) => (
              <div key={i}
                onClick={() => pushToast('Open influencer · ' + m.handle)}
                style={{
                padding: '12px 14px',
                background: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                display: 'flex', flexDirection: 'column', gap: 6,
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #c8b08c, #8a7252)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.handle}</span>
                    <InbMono size={9.5} color="var(--fg-tertiary)">{m.followers} followers · {m.ch.toUpperCase()}</InbMono>
                  </div>
                  <span style={{
                    padding: '2px 7px', borderRadius: 999,
                    background: m.fit === 'high' ? 'var(--tone-success-bg)' : 'var(--tone-info-bg)',
                    color: m.fit === 'high' ? 'var(--tone-success)' : 'var(--tone-info)',
                    fontFamily: I_INB.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{m.fit} fit</span>
                </div>
                <InbMono size={9.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>{m.pillar}</InbMono>
                <span style={{ fontFamily: I_INB.serif, fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.4, letterSpacing: '-0.005em' }}>{m.note}</span>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                  <InbMono size={9.5} color="var(--fg-tertiary)" style={{ flex: 1 }}>{m.last}</InbMono>
                  <span style={{ fontFamily: I_INB.mono, fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase' }}>OPEN →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter chips · mention type */}
        <div style={{ padding: '14px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <InbMeta size={9}>filter</InbMeta>
          {[
            { id: 'all',      label: 'All', count: 142, sel: true  },
            { id: 'story',    label: 'Story-tag', count: 28, sel: false },
            { id: 'comment',  label: 'Comment-mention', count: 67, sel: false },
            { id: 'dm',       label: 'DM-mention', count: 19, sel: false },
            { id: 'brand',    label: 'Brand-mention', count: 11, sel: false },
            { id: 'critical', label: 'Critical', count: 1, sel: false, accent: true },
          ].map(c => (
            <span key={c.id} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: c.sel ? 'var(--fg-primary)' : 'transparent',
              color: c.sel ? 'var(--surface-1)' : c.accent ? 'var(--tone-warning)' : 'var(--fg-secondary)',
              border: c.sel ? 'none' : '1px solid ' + (c.accent ? 'var(--tone-warning)' : 'var(--border-default)'),
              fontFamily: I_INB.sans, fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
            }}>
              {c.label}
              <span style={{
                fontFamily: I_INB.mono, fontSize: 9.5, fontWeight: 600,
                color: c.sel ? 'var(--surface-1)' : 'var(--fg-tertiary)',
                opacity: c.sel ? 0.8 : 1,
                fontVariantNumeric: 'tabular-nums',
              }}>{c.count}</span>
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <InbMono size={10} color="var(--fg-tertiary)">142 results · last sync 2m ago</InbMono>
        </div>

        {/* Sentiment trend strip · 7-day spark with daily counts */}
        <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <InbMeta size={9}>Mention trend · last 7 days</InbMeta>
            <InbMono size={10} color="var(--fg-tertiary)">net sentiment +0.62 · trending up</InbMono>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 10,
            alignItems: 'end',
          }}>
            {[
              { day: 'Wed', date: 'Apr 22', total: 16, pos: 12, neu: 3, neg: 1 },
              { day: 'Thu', date: 'Apr 23', total: 21, pos: 16, neu: 4, neg: 1 },
              { day: 'Fri', date: 'Apr 24', total: 19, pos: 13, neu: 5, neg: 1 },
              { day: 'Sat', date: 'Apr 25', total: 24, pos: 18, neu: 5, neg: 1 },
              { day: 'Sun', date: 'Apr 26', total: 18, pos: 12, neu: 5, neg: 1 },
              { day: 'Mon', date: 'Apr 27', total: 23, pos: 17, neu: 5, neg: 1 },
              { day: 'Tue', date: 'Apr 28', total: 21, pos: 14, neu: 6, neg: 1 },
            ].map((d, i) => {
              const max = 28;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="hf-num" style={{ fontFamily: I_INB.mono, fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{d.total}</span>
                  <div style={{ height: 56, display: 'flex', flexDirection: 'column-reverse', gap: 1 }}>
                    <div style={{ height: `${(d.pos / max) * 100}%`, background: 'var(--tone-success)', borderRadius: 1 }} />
                    <div style={{ height: `${(d.neu / max) * 100}%`, background: 'var(--fg-tertiary)' }} />
                    <div style={{ height: `${(d.neg / max) * 100}%`, background: 'var(--tone-warning)', borderRadius: 1 }} />
                  </div>
                  <span style={{ textAlign: 'center' }}>
                    <InbMono size={9.5} color="var(--fg-tertiary)">{d.day}</InbMono>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body — mention queue + BTF + closing CTA */}
        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 920 }}>

          {/* Mention cards — grouped by intent */}
          {[
            { title: 'Peer mentions · respond when you can', count: 8, items: [
              { from: 'silke.diveinstructor', ch: 'ig', body: "Showing 0042 to my OW class this week — best safety storytelling I've seen. /cc @henry.dives", when: '2h', intent: 'fan', tag: 'peer praise', followers: '34k' },
              { from: 'reefdoc.kim',          ch: 'yt', body: "Henry @henry.dives covered this pattern last month — his explanation is cleaner than mine.", when: '6h', intent: 'fan', tag: 'cross-reference', followers: '128k' },
            ]},
            { title: 'Media · review and reply privately', count: 2, items: [
              { from: 'Diver Magazine', ch: 'th', body: "@henry.dives's wreck-safety series is quietly becoming the reference for a generation of OW divers.", when: '1d', intent: 'brand', tag: 'editorial', followers: '52k' },
            ]},
            { title: 'Critical · address today', count: 1, items: [
              { from: 'tek_diver_77', ch: 'yt', body: "@henry.dives the narcosis number you cited at 3:14 in 0042 is OC, not CCR. Important distinction for your tek viewers.", when: '4h', intent: 'critical', tag: 'factual challenge', followers: '8k' },
            ]},
          ].map((g, gi) => (
            <div key={gi} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: I_INB.serif, fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>{g.title}</span>
                <InbMono size={10} color="var(--fg-tertiary)">· {g.count}</InbMono>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {g.items.map((m, mi) => (
                  <div key={mi} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 200px', gap: 14, padding: '14px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                    <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #c8b08c, #8a7252)', border: '1px solid var(--border-default)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PlatformGlyph ch={m.ch} />
                        <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{m.from}</span>
                        <InbMono size={9.5} color="var(--fg-tertiary)">· {m.followers} followers</InbMono>
                      </div>
                      <span style={{ fontFamily: I_INB.serif, fontSize: 16, fontWeight: 400, color: 'var(--fg-primary)', lineHeight: 1.45, letterSpacing: '-0.005em', fontStyle: m.intent === 'fan' ? 'italic' : 'normal' }}>"{m.body}"</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <InbMono size={10} color="var(--fg-tertiary)">{m.when}</InbMono>
                      <IntentTag intent={m.intent} label={m.tag} />
                      <span style={{ fontFamily: I_INB.mono, fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.04em' }}>↗ open thread</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ─────── Below the fold · what scrolling reveals ─────── */}

          {/* Older mentions · context only */}
          <div style={{ marginTop: 8, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: I_INB.serif, fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>From last 30 days · context only</span>
              <InbMono size={10} color="var(--fg-tertiary)">· 47 archived · no reply needed</InbMono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { from: 'Outside Magazine',    ch: 'th', body: "@henry.dives is quietly building the most credible safety library on the platform.",                                                  when: 'Apr 18', intent: 'brand',    tag: 'editorial',         followers: '1.2M' },
                { from: 'cassidy.codes',       ch: 'tt', body: "If you teach anything technical and want to see what good explanation looks like, watch @henry.dives's wreck series. Same energy, different domain.", when: 'Apr 16', intent: 'fan',      tag: 'cross-niche',       followers: '94k'  },
                { from: 'tek_diver_77',        ch: 'yt', body: "@henry.dives's correction on 0042's narcosis numbers landed clean. That's how you do it.",                                              when: 'Apr 15', intent: 'fan',      tag: 'recovery praise',   followers: '8k'   },
                { from: 'pott.studio',         ch: 'ig', body: "Stealing the cold-open structure from @henry.dives for my pottery process videos. It works.",                                            when: 'Apr 12', intent: 'fan',      tag: 'cross-niche',       followers: '22k'  },
              ].map((m, mi) => (
                <div key={mi} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 200px', gap: 14, padding: '14px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 10, opacity: 0.85 }}>
                  <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #c8b08c, #8a7252)', border: '1px solid var(--border-default)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <PlatformGlyph ch={m.ch} />
                      <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{m.from}</span>
                      <InbMono size={9.5} color="var(--fg-tertiary)">· {m.followers} followers</InbMono>
                    </div>
                    <span style={{ fontFamily: I_INB.serif, fontSize: 15, fontWeight: 400, color: 'var(--fg-secondary)', lineHeight: 1.45, letterSpacing: '-0.005em', fontStyle: m.intent === 'fan' ? 'italic' : 'normal' }}>"{m.body}"</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <InbMono size={10} color="var(--fg-tertiary)">{m.when}</InbMono>
                    <IntentTag intent={m.intent} label={m.tag} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment over time + most-mentioned posts · two columns */}
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '6px double var(--fg-primary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

            <div>
              <InbMeta size={9}>Sentiment over time · last 4 weeks</InbMeta>
              <div style={{ marginTop: 10, padding: '14px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[
                    { week: 'Apr 1', pos: 28, neu: 12, neg: 4,  net: '+0.55' },
                    { week: 'Apr 8', pos: 34, neu: 14, neg: 5,  net: '+0.58' },
                    { week: 'Apr 15',pos: 41, neu: 18, neg: 6,  net: '+0.61' },
                    { week: 'Apr 22',pos: 52, neu: 21, neg: 7,  net: '+0.64' },
                  ].map((w, i) => {
                    const total = w.pos + w.neu + w.neg;
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                        <div style={{ display: 'flex', flexDirection: 'column-reverse', height: 90, gap: 1 }}>
                          <div style={{ height: `${(w.pos / total) * 100}%`, background: 'var(--tone-success)', borderRadius: 1 }} />
                          <div style={{ height: `${(w.neu / total) * 100}%`, background: 'var(--fg-tertiary)' }} />
                          <div style={{ height: `${(w.neg / total) * 100}%`, background: 'var(--tone-warning)', borderRadius: 1 }} />
                        </div>
                        <InbMono size={9.5} color="var(--fg-tertiary)" style={{ textAlign: 'center', marginTop: 4 }}>{w.week}</InbMono>
                        <span className="hf-num" style={{ fontFamily: I_INB.mono, fontSize: 11, color: 'var(--accent-primary)', textAlign: 'center', fontWeight: 600 }}>{w.net}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 14, fontFamily: I_INB.mono, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--tone-success)' }} /> positive</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--fg-tertiary)' }} /> neutral</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: 'var(--tone-warning)' }} /> critical</span>
                </div>
              </div>
            </div>

            <div>
              <InbMeta size={9}>Most-mentioned posts · last 30d</InbMeta>
              <div style={{ marginTop: 10 }}>
                {[
                  { id: '0042', title: 'Truk Lagoon · why this wreck still matters', count: 38, net: '+0.71' },
                  { id: '0046', title: 'Pre-dive checklist · the long version',       count: 24, net: '+0.68' },
                  { id: '0041', title: '12-min primer on safety stops',                count: 18, net: '+0.42' },
                  { id: '0048', title: 'Reply · doubles vs sidemount',                  count: 11, net: '+0.55' },
                  { id: '0044', title: 'Shore-entry technique',                          count:  8, net: '+0.50' },
                ].map((p, i) => (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 50px 60px', gap: 12, padding: '11px 0', borderTop: i === 0 ? '1px solid var(--fg-primary)' : '1px solid var(--border-subtle)', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{p.id}</span>
                    <span style={{ fontFamily: I_INB.serif, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.35, letterSpacing: '-0.005em' }}>{p.title}</span>
                    <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INB.mono, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>{p.count}</span>
                    <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INB.mono, fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600 }}>{p.net}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Watch-a-creator CTA — turn a notable mentioner into a tracked relationship */}
          <div style={{
            marginTop: 24, padding: '18px 24px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center',
          }}>
            <div>
              <InbMeta size={9}>Add to watchlist</InbMeta>
              <p style={{ margin: '8px 0 0', fontFamily: I_INB.serif, fontSize: 16, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.5, letterSpacing: '-0.005em' }}>
                Pin a creator to surface their mentions, comments, and DMs first — Coopr will route their threads to the top of your inbox and flag any tone shift in their reactions over time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => pushToast('Open watch-creator picker')}
              style={{
                padding: '10px 18px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600,
                color: 'var(--fg-primary)',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
              }}>
              <span style={{ fontFamily: I_INB.mono, fontSize: 15, fontWeight: 700, lineHeight: 1, color: 'var(--accent-primary)' }}>+</span>
              Watch a creator
            </button>
          </div>

          {/* Closing italic-serif "one thing to do today" CTA */}
          <div style={{ marginTop: 24, padding: '22px 26px', background: 'var(--accent-soft)', borderRadius: 10, borderLeft: '3px solid var(--accent-primary)' }}>
            <InbMeta size={9} color="var(--accent-primary-press)">The one thing to do today</InbMeta>
            <p style={{ margin: '10px 0 0', fontFamily: I_INB.serif, fontSize: 19, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
              Reply privately to Diver Magazine. Their unprompted editorial mention of your wreck-safety series is the strongest endorsement this month, and the writer typically follows up with creators within 48 hours — missing the window forfeits the relationship for the next quarter.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <span style={{ padding: '8px 14px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 6, fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600 }}>Open the thread</span>
              <span style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary-press)', borderRadius: 6, fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 500 }}>Draft a private reply</span>
            </div>
          </div>

        </div>
        </div>
      </div>
    </HfShell>
  );
}

// ─── Replies sub-tab — your sent replies, sorted by performance ───
function HF_InboxReplies({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('inbox', 'Replies');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  // E2 · click coverage. Pull pushToast off master state for queue rows,
  // template tiles, and the new-template CTA.
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  if (s === 'loading') {
    return <HfShell workspace="inbox" subtab="Replies"><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="inbox" subtab="Replies"><window.HF_EmptyHero
      eyebrow="Replies · 0 sent"
      title="Nothing sent yet. Sent replies and follow-ups land here once you respond."
      caption="Sorted by outcome — continued, closed, or amplified by the original poster."
      ctaLabel="Open Inbox"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="inbox" subtab="Replies"><window.HF_ErrorHero
      title="Couldn't load Replies."
      body="The reply log timed out. Retry, or check the platform connections."
    /></HfShell>;
  }
  const sent = [
    { id: 'r1', ch: 'yt', to: 'maya_diving', when: '12m ago', body: "Running ~150 bar reserve on AL80s for wreck work — I'd rather come up early than push it. I do track SAC (about 18 L/min on relaxed bottom time, closer to 22 on the swim back).", outcome: 'thread', meta: '3 follow-ups · 14 likes', tag: 'continued' },
    { id: 'r2', ch: 'ig', to: 'reefdoc.kim', when: '2h ago', body: "Two breaths is what I mean. Hyperventilation kills the CO2 trigger you actually want at depth — opposite of the goal.", outcome: 'thanked', meta: 'Liked + replied "thank you"', tag: 'closed' },
    { id: 'r3', ch: 'tt', to: 'caleb.r', when: '5h ago', body: "Donate yours, signal up, share air to the surface. Free-flow at 60 bar is a problem you solve by ascending, not by fighting the reg.", outcome: 'pinned', meta: 'Pinned by Caleb · 89 replies on his side', tag: 'amplified' },
    { id: 'r4', ch: 'ig', to: 'jenna_freediver', when: '6h ago', body: "Honestly — wait. The income is real now but it's lumpy. I went full-time at ~80k with six months runway and a sponsor on retainer. 40k feels too thin.", outcome: 'thanked', meta: 'Long DM thread · ongoing', tag: 'continued' },
    { id: 'r5', ch: 'yt', to: 'tek_diver_77', when: 'yest', body: "You're right and that's on me — I conflated OC narcosis numbers with CCR depth. I'll pin a correction on the video and note it in 0048's intro.", outcome: 'corrected', meta: 'Pinned correction · 240 thanks', tag: 'recovered' },
  ];
  return (
    <HfShell workspace="inbox" subtab="Replies" subtabRight={<>
      <span style={{ fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>64 sent · 7d · 59% continued</span>
      <span style={{ fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>sort · outcome ▾</span>
      <FreshnessPill at="2m ago" state="fresh" />
    </>}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

        {/* Header band — byline + newsticker + serif headline + italic deck */}
        <div style={{ padding: '22px 32px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
            <InbMeta size={10}>Inbox · Replies · Apr 28</InbMeta>
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: I_INB.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-primary)' }} />
              <span>Since last visit · 12 new replies sent</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>4 amplified · 2 recovered · 1 thread still warming · 1 pin in 24h</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span>response window · 71% within 24h</span>
            </span>
            <InbMono size={10} color="var(--fg-tertiary)">last sync · 2m ago</InbMono>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
            <span style={{ fontFamily: I_INB.serif, fontSize: 36, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--fg-primary)', maxWidth: 920 }}>
              <span style={{ fontStyle: 'italic' }}>Sixty-four replies. Thirty-eight kept the thread alive.</span>
              {' '}
              <span style={{ color: 'var(--fg-secondary)' }}>Four got pinned or shared. One correction landed clean enough to recover sentiment within a day.</span>
            </span>
          </div>
          <div style={{ marginTop: 10, fontFamily: I_INB.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 760, letterSpacing: '-0.005em' }}>
            What happened after you replied. Threads that kept going, replies the recipient pinned, corrections that recovered the room. Sorted by outcome strength so the patterns that work are visible at a glance.
          </div>
        </div>

        {/* KPI strip — 5 metrics */}
        <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
          {[
            ['sent · 7d',       '64',   'across 3 platforms'],
            ['continued',       '38',   '59% kept the thread alive'],
            ['amplified',       '4',    'pinned or shared by recipient'],
            ['recovered',       '2',    'corrections that landed clean'],
            ['within · 24h',    '71%',  'response window · target 80%'],
          ].map(([l, v, sub], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <InbMeta size={9}>{l}</InbMeta>
              <span className="hf-num" style={{ fontFamily: I_INB.sans, fontSize: 24, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{v}</span>
              <InbMono size={10} color="var(--fg-tertiary)">{sub}</InbMono>
            </div>
          ))}
        </div>

        {/* Body — reply queue + sent list + templates + BTF + synthesis + closing CTA */}
        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 880 }}>

          {/* Reply queue — pending replies with response-time slack indicator */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: I_INB.serif, fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>
                <span style={{ fontStyle: 'italic' }}>In your queue · 9 pending</span>
              </span>
              <InbMono size={10} color="var(--fg-tertiary)">slack indicator · response window 24h</InbMono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { id: 'q1', ch: 'yt', from: 'maya_diving',         topic: 'Pressure on AL80 reserve · 3 follow-ups deep', slack: 'within hour',  slackPct: 92, intent: 'question', priority: 'hot' },
                { id: 'q2', ch: 'ig', from: 'reefdoc.kim',         topic: 'Breath-up before deco · classroom asking',     slack: '4h',           slackPct: 68, intent: 'question', priority: 'warm' },
                { id: 'q3', ch: 'tt', from: 'caleb.r',             topic: 'Free-flow at 60 bar · safety drill question',   slack: '6h',           slackPct: 55, intent: 'question', priority: 'warm' },
                { id: 'q4', ch: 'ig', from: 'jenna_freediver',     topic: 'Going full-time at 40k · long DM thread',        slack: '12h',          slackPct: 30, intent: 'question', priority: 'cold' },
                { id: 'q5', ch: 'yt', from: 'depth_cult',          topic: 'Follow-up on narcosis correction',                slack: '18h',          slackPct: 18, intent: 'fan',      priority: 'cold' },
                { id: 'q6', ch: 'ig', from: 'pott.studio',         topic: 'Cold-open structure question · cross-niche',     slack: '21h',          slackPct: 12, intent: 'question', priority: 'cold' },
                { id: 'q7', ch: 'th', from: 'Diver Magazine',      topic: 'Editorial reach-out · 48h window',                slack: 'today',        slackPct: 80, intent: 'brand',    priority: 'hot' },
                { id: 'q8', ch: 'yt', from: 'silke.diveinstructor', topic: 'OW class slide deck request',                    slack: '2d',           slackPct: 8,  intent: 'fan',      priority: 'cold' },
                { id: 'q9', ch: 'tt', from: 'cassidy.codes',       topic: 'Cross-niche craft cite · light ask',              slack: '3d',           slackPct: 5,  intent: 'fan',      priority: 'cold' },
              ].map((q, i) => {
                const tone = q.priority === 'hot' ? 'var(--tone-warning)' : q.priority === 'warm' ? 'var(--accent-primary)' : 'var(--fg-tertiary)';
                return (
                  <div key={q.id}
                    onClick={() => pushToast('Open queue · ' + q.from)}
                    style={{
                    padding: '11px 14px',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: '3px solid ' + tone,
                    borderRadius: 8,
                    display: 'grid', gridTemplateColumns: '24px 200px 1fr 120px 80px', gap: 14, alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                    <PlatformGlyph ch={q.ch} size={16} />
                    <span style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.from}</span>
                      <IntentTag intent={q.intent === 'brand' ? 'brand' : q.intent === 'fan' ? 'fan' : 'question'} label={q.priority} />
                    </span>
                    <span style={{ fontFamily: I_INB.serif, fontStyle: 'italic', fontSize: 14.5, color: 'var(--fg-primary)', lineHeight: 1.4, letterSpacing: '-0.005em' }}>{q.topic}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <InbMono size={9.5} color={tone} style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{q.slack} slack</InbMono>
                      <span style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                        <span style={{ display: 'block', width: q.slackPct + '%', height: '100%', background: tone }} />
                      </span>
                    </span>
                    <span style={{
                      justifySelf: 'end',
                      padding: '5px 10px', borderRadius: 6,
                      background: tone, color: 'var(--fg-on-accent)',
                      fontFamily: I_INB.sans, fontSize: 11, fontWeight: 600,
                    }}>Reply →</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recently sent — section eyebrow ahead of the existing list */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: I_INB.serif, fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>
              <span style={{ fontStyle: 'italic' }}>Recently sent · last 24h</span>
            </span>
            <InbMono size={10} color="var(--fg-tertiary)">5 sent · sorted by outcome</InbMono>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {sent.map((r, i) => (
              <div key={r.id} style={{
                padding: '20px 4px',
                borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                display: 'grid', gridTemplateColumns: '60px 1fr 220px', gap: 18, alignItems: 'flex-start',
              }}>
                <InbMono size={10} color="var(--fg-tertiary)" style={{ paddingTop: 4 }}>{r.when}</InbMono>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <PlatformGlyph ch={r.ch} />
                    <InbMono size={10.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.08em' }}>YOU REPLIED TO</InbMono>
                    <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{r.to}</span>
                  </div>
                  <span style={{ fontFamily: I_INB.serif, fontSize: 18, fontWeight: 400, color: 'var(--fg-primary)', lineHeight: 1.5, letterSpacing: '-0.005em' }}>"{r.body}"</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 14, borderLeft: '1px solid var(--border-subtle)' }}>
                  <InbMeta size={9}>Outcome</InbMeta>
                  <span style={{ fontFamily: I_INB.sans, fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', textTransform: 'capitalize' }}>{r.outcome}</span>
                  <InbMono size={10.5} color="var(--fg-secondary)" style={{ lineHeight: 1.5 }}>{r.meta}</InbMono>
                  <span style={{ marginTop: 4 }}>
                    <IntentTag intent={r.tag === 'amplified' ? 'fan' : r.tag === 'recovered' ? 'critical' : r.tag === 'closed' ? 'spam' : 'question'} label={r.tag} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ─────── Below the fold · what scrolling reveals ─────── */}

          {/* Older replies · last 30 days */}
          <div style={{ marginTop: 32, paddingTop: 18, borderTop: '6px double var(--fg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: I_INB.serif, fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>Older replies · last 30 days</span>
              <InbMono size={10} color="var(--fg-tertiary)">240 sent · sorted by outcome strength</InbMono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { ch: 'yt', to: 'maria_lago',   when: 'Apr 21', body: "The wreck checklist on 0042 takes about ten minutes to walk through; the whole video is the long version. The short version is: pre-dive briefing, gas plan, redundancy check, exit drill.",                                                                       outcome: 'thread',    meta: '14 follow-ups · pinned by maria',     tag: 'amplified' },
                { ch: 'ig', to: 'jordan.films', when: 'Apr 19', body: "Don't compress for the algorithm — your audience already knows what they want. The pacing question only matters when you're chasing reach.",                                                                                                                    outcome: 'thanked',   meta: 'Liked · referenced in their next reel', tag: 'amplified' },
                { ch: 'tt', to: 'shane_dive',   when: 'Apr 14', body: "I track SAC because the alternative is guessing. Your bottom-time math is only as good as your gas math, and 'I've got plenty' is the moment things go sideways.",                                                                                              outcome: 'thread',    meta: '6 follow-ups · 41 likes',               tag: 'continued' },
                { ch: 'yt', to: 'depth_cult',   when: 'Apr 11', body: "You're right that the citation was sloppy — fixed in 0046's intro and pinned a correction. Thanks for keeping me honest.",                                                                                                                                       outcome: 'corrected', meta: 'Pinned correction · 180 thanks',         tag: 'recovered' },
                { ch: 'ig', to: 'amelie_under', when: 'Apr 06', body: "First-stage maintenance interval is about service quality, not brand. The reg I service annually outlasts the reg I serviced 'eventually' regardless of make.",                                                                                                  outcome: 'thread',    meta: '3 follow-ups · 12 likes',                tag: 'continued' },
              ].map((r, i) => (
                <div key={i} style={{ padding: '18px 4px', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '70px 1fr 220px', gap: 18, alignItems: 'flex-start', opacity: 0.85 }}>
                  <InbMono size={10} color="var(--fg-tertiary)" style={{ paddingTop: 4 }}>{r.when}</InbMono>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <PlatformGlyph ch={r.ch} />
                      <InbMono size={10.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.08em' }}>YOU REPLIED TO</InbMono>
                      <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{r.to}</span>
                    </div>
                    <span style={{ fontFamily: I_INB.serif, fontSize: 16, fontWeight: 400, color: 'var(--fg-secondary)', lineHeight: 1.5, letterSpacing: '-0.005em' }}>"{r.body}"</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 14, borderLeft: '1px solid var(--border-subtle)' }}>
                    <InbMeta size={9}>Outcome</InbMeta>
                    <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', textTransform: 'capitalize' }}>{r.outcome}</span>
                    <InbMono size={10} color="var(--fg-secondary)" style={{ lineHeight: 1.5 }}>{r.meta}</InbMono>
                    <span style={{ marginTop: 4 }}>
                      <IntentTag intent={r.tag === 'amplified' ? 'fan' : r.tag === 'recovered' ? 'critical' : r.tag === 'closed' ? 'spam' : 'question'} label={r.tag} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved reply templates · 6 templates with use count + new-template CTA */}
          <div style={{ marginTop: 32, paddingTop: 18, borderTop: '6px double var(--fg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: I_INB.serif, fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>Saved templates · the shapes that land</span>
              <button
                type="button"
                onClick={() => pushToast('Open new-template editor')}
                style={{
                  padding: '7px 14px',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 6,
                  fontFamily: I_INB.sans, fontSize: 12, fontWeight: 600,
                  color: 'var(--fg-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                <span style={{ fontFamily: I_INB.mono, fontSize: 14, fontWeight: 700, color: 'var(--accent-primary)' }}>+</span>
                New template
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { id: 't1', label: 'Open with a number',   sample: 'Running ~150 bar reserve on AL80s for wreck work.',                       uses: 38, lastUsed: 'today',  outcome: 'pinned 3.2x' },
                { id: 't2', label: 'Admit + cite fix',     sample: 'You\'re right — that was on me. Pinned a correction in the next post.',  uses: 22, lastUsed: 'yest',   outcome: 'recovery 4/5' },
                { id: 't3', label: 'Defer to a longer post', sample: 'I covered this in detail in 0046 — short answer is...',                  uses: 31, lastUsed: '2d',     outcome: 'closes 78%' },
                { id: 't4', label: 'Two-breath calm',      sample: 'Two slow breaths, ribcage soft. Settling, not loading.',                   uses: 14, lastUsed: '3d',     outcome: 'classroom-ready' },
                { id: 't5', label: 'Brand · take to DM',   sample: 'Thanks for the kind words — opening a private DM so we can talk specifics.', uses: 9,  lastUsed: '5d',     outcome: 'media-safe' },
                { id: 't6', label: 'Critical · acknowledge', sample: 'Important catch — fixing in the next intro and pinning here.',           uses: 7,  lastUsed: '1w',     outcome: 'sentiment +0.18' },
              ].map(t => (
                <div key={t.id}
                  onClick={() => pushToast('Apply template · ' + t.label)}
                  style={{
                  padding: '12px 14px',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  display: 'flex', flexDirection: 'column', gap: 6,
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', flex: 1 }}>{t.label}</span>
                    <span className="hf-num" style={{ fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 600 }}>×{t.uses}</span>
                  </div>
                  <span style={{ fontFamily: I_INB.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.4, letterSpacing: '-0.005em' }}>"{t.sample}"</span>
                  <div style={{ marginTop: 4, paddingTop: 6, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <InbMono size={9.5} color="var(--fg-tertiary)" style={{ flex: 1 }}>last used · {t.lastUsed}</InbMono>
                    <InbMono size={9.5} color="var(--accent-primary-press)" style={{ fontWeight: 600 }}>{t.outcome}</InbMono>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's working · synthesis callout */}
          <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <InbMeta size={9}>What's working · synthesis from last 30d</InbMeta>
            <p style={{ margin: '8px 0 0', fontFamily: I_INB.serif, fontSize: 17, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
              Replies that lead with a number get pinned 3.2x more often. Replies that admit error and cite the fix recover the thread 4 of 5 times. Replies that defer to a longer post you've already shipped close cleanly without follow-up.
            </p>
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                ['Open with a number', '3.2x',  'pinned vs no-number'],
                ['Admit + cite fix',   '4 / 5', 'recovery rate'],
                ['Defer to a post',    '78%',   'closes without follow-up'],
              ].map(([k, v, sub], i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <InbMono size={9.5} color="var(--fg-tertiary)">{k.toUpperCase()}</InbMono>
                  <span className="hf-num" style={{ fontFamily: I_INB.serif, fontSize: 22, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.02em' }}>{v}</span>
                  <InbMono size={10} color="var(--fg-secondary)">{sub}</InbMono>
                </div>
              ))}
            </div>
          </div>

          {/* Closing italic-serif "one thing to do today" CTA */}
          <div style={{ marginTop: 18, padding: '22px 26px', background: 'var(--accent-soft)', borderRadius: 10, borderLeft: '3px solid var(--accent-primary)' }}>
            <InbMeta size={9} color="var(--accent-primary-press)">The one thing to do today</InbMeta>
            <p style={{ margin: '10px 0 0', fontFamily: I_INB.serif, fontSize: 19, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
              Follow up on the maya_diving thread. Three follow-ups deep, fourteen likes — the shape that gets pinned every time when you drop one more SAC number into the thread. The window is the next four hours; after that the thread cools and your reply lands as a footnote.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <span style={{ padding: '8px 14px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 6, fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600 }}>Open the maya thread</span>
              <span style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary-press)', borderRadius: 6, fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 500 }}>Draft the follow-up</span>
            </div>
          </div>

        </div>
        </div>
      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// COMMENT THREAD DETAIL — D5
// Lightweight detail surface mounted under inbox/Comments via the
// registry's detail.kind === 'thread' descriptor. Click a comment row
// in HF_InboxComments_R2 → setDetail('thread', commentId). The
// chrome's back-chevron (MasterDetailBackChevron) handles the
// return-to-feed affordance via clearDetail().
//
// Shape: one main comment block + 4 replies + composer at bottom. The
// fixture is keyed by commentId; falls back to a generic record so
// the detail mounts even when the id is unknown — keeps the dispatch
// contract observable end-to-end.
// ─────────────────────────────────────────────────────────
const INBOX_THREAD_FIXTURES = {
  c1: {
    eyebrow: 'YOUTUBE · ON 0044 · 0:42',
    headline: 'Maya · pressure on AL80?',
    deck: 'Three follow-ups deep · 14 likes · returning commenter (3rd thread).',
    main: {
      from: 'maya_diving',
      handle: '@maya_diving',
      ch: 'yt',
      when: '12m ago',
      body: "What pressure are you running on the AL80 there? Looked like you came up with a lot left in the tank — I always run mine deeper and end up on fumes. Curious if you're tracking SAC or just going by feel at this point.",
    },
    replies: [
      { from: 'reefdoc.kim',  ch: 'yt', when: '10m', body: "I'm also curious — and whether you swap to a doubles setup for the longer wreck cuts.", likes: 4 },
      { from: 'caleb.r',      ch: 'yt', when: '8m',  body: "Following · I usually run 1700 and end up with 600 reserve, feels safe but heavy.", likes: 2 },
      { from: 'silke.diveinstructor', ch: 'yt', when: '4m', body: "Worth saying for the OW students reading this thread — you'd want to track SAC long before you push the reserve number down.", likes: 9 },
      { from: 'tek_diver_77', ch: 'yt', when: '1m',  body: "Different math for CCR — but for OC the 150 reserve is the floor, not the target.", likes: 1 },
      { from: 'henrymwangi', ch: 'yt', when: 'just now', body: "150 bar reserve on AL80s for wreck dives. SAC tracked at about 18 L/min relaxed, 22 on the swim back. Doubles only on the deeper Truk cuts.", likes: 14 },
    ],
  },
  c2: {
    eyebrow: 'INSTAGRAM · ON 0046',
    headline: 'Reefdoc · breath-up before deco',
    deck: 'Single thread · classroom-leaning · returning instructor.',
    main: {
      from: 'reefdoc.kim',
      handle: '@reefdoc.kim',
      ch: 'ig',
      when: '24m ago',
      body: "When you say 'breath up' before a deco stop, do you mean two breaths or full hyperventilation? Trying to teach this to a class.",
    },
    replies: [
      { from: 'maya_diving', ch: 'ig', when: '18m', body: "Always two — full hyperventilation is the wrong shape for OW.", likes: 3 },
      { from: 'silke.diveinstructor', ch: 'ig', when: '12m', body: "Same here — I tell my classes 'two slow ones, then breathe through the stop.'", likes: 6 },
      { from: 'henrymwangi', ch: 'ig', when: '9m',  body: "Two slow, ribcage soft, no holding. The point is settling, not loading.", likes: 11 },
      { from: 'caleb.r', ch: 'ig', when: '6m', body: "This is exactly what tripped me up on my AOW. Glad to see it spelled out.", likes: 4 },
      { from: 'reefdoc.kim', ch: 'ig', when: '2m', body: "Saving this for tomorrow's lesson — the 'settling, not loading' framing is going straight on the whiteboard.", likes: 8 },
    ],
  },
  c6: {
    eyebrow: 'YOUTUBE · ON 0042 · 3:14',
    headline: 'Tek_diver_77 · narcosis depth',
    deck: 'Critical · factual challenge · two other commenters watching.',
    main: {
      from: 'tek_diver_77',
      handle: '@tek_diver_77',
      ch: 'yt',
      when: '4h ago',
      body: "The narcosis depth you cited at 3:14 is wrong for a CCR diver — that's an OC number. This matters for your tek viewers.",
    },
    replies: [
      { from: 'depth_cult', ch: 'yt', when: '3h',  body: "Yeah, watching the thread. Pinned correction would be the move here.", likes: 8 },
      { from: 'maya_diving', ch: 'yt', when: '2h', body: "Same numbers I learned in tek class — would love a follow-up frame on this.", likes: 4 },
      { from: 'silke.diveinstructor', ch: 'yt', when: '90m', body: "Important catch. The OC/CCR distinction is the kind of thing that quietly seeds bad habits — worth a callout in the next post.", likes: 6 },
      { from: 'henrymwangi', ch: 'yt', when: '1h', body: "You're right — fixing in 0046's intro and pinning a correction here. Thanks for catching it.", likes: 22 },
      { from: 'tek_diver_77', ch: 'yt', when: '40m', body: "Appreciate the response — that's how you do it. Subbed for the next one.", likes: 18 },
    ],
  },
};

function InbThreadPlatformGlyph({ ch, size = 16 }) {
  const map = { ig: 'Ig', yt: 'Yt', tt: 'Tt', th: 'Th' };
  return (
    <span style={{
      width: size, height: size, borderRadius: 3,
      background: '#1a1815', color: 'var(--fg-on-ink)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: I_INB.mono, fontSize: 9, fontWeight: 700,
      flexShrink: 0,
    }}>{map[ch] || 'Ig'}</span>
  );
}

function HF_InboxCommentThread({ commentId }) {
  const thread = (commentId && INBOX_THREAD_FIXTURES[commentId])
    || INBOX_THREAD_FIXTURES.c1;
  return (
    <HfShell workspace="inbox" subtab="Comments" subtabRight={
      <span style={{ fontFamily: I_INB.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>
        thread · {thread.replies.length + 1} messages
      </span>
    }>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

        {/* Header band — eyebrow + serif headline + italic deck */}
        <div style={{ padding: '24px 32px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <InbMeta size={10}>{thread.eyebrow}</InbMeta>
          <h1 style={{
            margin: '8px 0 6px',
            fontFamily: I_INB.serif, fontStyle: 'italic',
            fontSize: 32, fontWeight: 500, color: 'var(--fg-primary)',
            letterSpacing: '-0.02em', lineHeight: 1.12, maxWidth: 880,
          }}>
            {thread.headline}
          </h1>
          <p style={{
            margin: 0,
            fontFamily: I_INB.serif, fontSize: 14, fontStyle: 'italic',
            color: 'var(--fg-secondary)', lineHeight: 1.55, letterSpacing: '-0.005em', maxWidth: 760,
          }}>
            {thread.deck}
          </p>
        </div>

        {/* Body — main comment + replies stacked */}
        <div style={{ padding: '24px 32px 8px', maxWidth: 880, width: '100%', alignSelf: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Main comment block */}
          <div style={{
            padding: '18px 22px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #c8b08c, #8a7252)', border: '1px solid var(--border-default)', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: I_INB.sans, fontSize: 13.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{thread.main.from}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <InbThreadPlatformGlyph ch={thread.main.ch} size={12} />
                  <InbMono size={10} color="var(--fg-tertiary)">{thread.main.handle} · {thread.main.when}</InbMono>
                </span>
              </div>
            </div>
            <div style={{
              fontFamily: I_INB.sans, fontSize: 14, color: 'var(--fg-primary)',
              lineHeight: 1.6,
            }}>{thread.main.body}</div>
          </div>

          {/* Replies column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 28, borderLeft: '1px solid var(--border-subtle)', marginLeft: 14 }}>
            <InbMeta size={9} style={{ paddingTop: 4 }}>Replies · {thread.replies.length}</InbMeta>
            {thread.replies.map((r, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #b8a98e, #6f6452)', flexShrink: 0 }} />
                  <span style={{ fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{r.from}</span>
                  <InbThreadPlatformGlyph ch={r.ch} size={11} />
                  <span style={{ flex: 1 }} />
                  <InbMono size={10} color="var(--fg-tertiary)">{r.when}</InbMono>
                  <InbMono size={10} color="var(--fg-tertiary)">{r.likes} likes</InbMono>
                </div>
                <div style={{ fontFamily: I_INB.sans, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.55 }}>{r.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Composer · sticky-feeling band at the foot */}
        <div style={{
          marginTop: 16,
          padding: '18px 32px 22px',
          maxWidth: 880, width: '100%', alignSelf: 'center', boxSizing: 'border-box',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <InbMeta size={9} color="var(--accent-primary-press)" style={{ marginBottom: 8, display: 'block' }}>Reply as @henrymwangi</InbMeta>
          <div style={{
            padding: '12px 14px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            display: 'flex', flexDirection: 'column', gap: 10,
            minHeight: 96,
          }}>
            <span style={{
              fontFamily: I_INB.sans, fontSize: 13,
              color: 'var(--fg-tertiary)', fontStyle: 'italic', lineHeight: 1.55,
            }}>
              Drop a reply · cmd + enter to send · cmd + j for the suggested-voice draft.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{
                padding: '8px 14px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
                borderRadius: 7, fontFamily: I_INB.sans, fontSize: 12.5, fontWeight: 600,
                cursor: 'pointer', userSelect: 'none',
              }}>Send reply</span>
              <span style={{
                padding: '8px 12px', background: 'transparent',
                border: '1px solid var(--border-default)',
                borderRadius: 7, fontFamily: I_INB.sans, fontSize: 12,
                color: 'var(--fg-secondary)', fontWeight: 500,
                cursor: 'pointer', userSelect: 'none',
              }}>Save as draft</span>
              <span style={{ flex: 1 }} />
              <InbMono size={10} color="var(--fg-tertiary)">cmd j · suggest in your voice</InbMono>
            </div>
          </div>
        </div>

      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_InboxComments, HF_InboxDMs, HF_InboxMentions, HF_InboxReplies, HF_InboxCommentThread });
