/* global React, window, HfShell, SectionHead, ChannelGlyph, Spark */
/* hifi-home.jsx — Home = Chat workspace.

   Above-the-fold (centered 720px column · cold-open chat surface):
     1. Editorial masthead (date + greeting)
     2. Hero composer
     3. Suggestion provocations (4 cards)
     4. Today briefing card (priorities / signals / schedule) — dismissible
     5. Recent threads list

   Below-the-fold (wider 1248px editorial layer · "your desk"):
     6. Week ahead — 7-day horizontal strip (scheduled posts per slot)
     7. Library pulse — 4-up of recent posts that are doing the work
     8. One thing to do — italic-serif close + single CTA

   Replaces the old HF_HomeCommand (data dashboard) and the chat-page family —
   they are now ONE surface. */

const HD = window.HF_DATA;

// ─── Atoms ────────────────────────────────────────────────
function MetaLabel({ children, color = 'var(--fg-tertiary)', size = 10, style = {} }) {
  return <span style={{ fontFamily: 'var(--font-sans)', fontSize: size, color, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...style }}>{children}</span>;
}
function Mono({ children, color = 'var(--fg-secondary)', size = 11, style = {} }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: size, color, ...style }}>{children}</span>;
}

// ─── Hero composer ────────────────────────────────────────
function HomeComposer({ placeholder = 'Draft anything, ask about your work, or paste a link.', docked = false }) {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const [value, setValue] = React.useState('');
  const Composer = window.R4BComposer;
  const onSend = (text) => {
    setValue('');
    if (ms.pushToast) ms.pushToast('Thread started · ' + String(text || '').slice(0, 54));
  };
  if (Composer) {
    return (
      <div style={{ width: docked ? '100%' : 720, maxWidth: 760 }}>
        <Composer
          value={value}
          setValue={setValue}
          onSend={onSend}
          placeholder={placeholder}
        />
      </div>
    );
  }
  return (
    <div
      onClick={() => ms.pushToast && ms.pushToast('Composer loading')}
      style={{
        width: docked ? '100%' : 720,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        boxShadow: '0 1px 0 rgba(26,24,21,0.02), 0 12px 32px -20px rgba(26,24,21,0.10)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
      }}>
      <div style={{ padding: '20px 22px 14px', minHeight: 64 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15.5, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>{placeholder}</span>
      </div>
    </div>
  );
}

// ─── Suggestion provocations ──────────────────────────────
function SuggestionRow({ items }) {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  return (
    <div style={{ width: 720, marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {items.map((it, i) => (
        <div
          key={i}
          onClick={() => ms.pushToast && ms.pushToast('Compose modal')}
          style={{
            padding: '12px 14px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            display: 'flex', flexDirection: 'column', gap: 6,
            cursor: 'pointer',
            transition: 'transform 120ms ease',
          }}>
          <MetaLabel size={9}>{it.eyebrow}</MetaLabel>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.45 }}>{it.prompt}</span>
        </div>
      ))}
    </div>
  );
}

function HomeChatPreview() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const Streaming = window.R4BStreamingText;
  const Trail = window.R4BReasoningTrail;
  const Tool = window.R4BToolRun;
  const steps = [
    { label: 'Reading recent posts', detail: 'library', sources: 4 },
    { label: 'Checking audience movement', detail: '30d window', sources: 1 },
    { label: 'Looking at schedule', detail: 'next 7 days', sources: 1 },
  ];
  return (
    <div className="r4bd-thread-panel" style={{ width: 720, marginTop: 16 }}>
      <div className="r4bd-thread-toolbar" style={{ padding: '12px 14px' }}>
        <div className="r4bd-thread-meta">
          <span className="r4bd-thread-title">Today starts as a conversation</span>
          <span className="r4bd-thread-sub">Composer · reasoning · tool run · blocks</span>
        </div>
        <button
          type="button"
          className="r4bd-control-btn"
          onClick={() => ms.setActiveSurface && ms.setActiveSurface('blocks', 'Thread Demo')}
        >
          Open thread demo
        </button>
      </div>
      <div className="r4bd-thread-scroll" style={{ maxHeight: 330, padding: '0 20px 16px' }}>
        <section className="r4bd-turn" data-role="Henry">
          <div className="r4bd-turn-role">
            <div>Henry</div>
            <div className="num" style={{ marginTop: 5, fontSize: 9 }}>09:42</div>
          </div>
          <div className="r4bd-turn-body">
            <p className="r4bd-turn-copy">Pull together the fastest read on what changed this week.</p>
          </div>
        </section>
        <section className="r4bd-turn" data-role="Coopr">
          <div className="r4bd-turn-role">
            <div>Coopr</div>
            <div className="num" style={{ marginTop: 5, fontSize: 9 }}>+0:03</div>
          </div>
          <div className="r4bd-turn-body">
            {Trail ? <Trail steps={steps} complete /> : <div className="r4bd-trail">Reasoned · 6 sources</div>}
            {Tool ? <Tool name="Weekly read" target="Library · Insights" complete /> : null}
            <p className="r4bd-turn-copy">
              {Streaming ? (
                <Streaming
                  text="I scanned recent performance, audience movement, and the schedule. The fastest move is to ship the ready cut, answer the warm inbox thread, and hold the experimental hook for a cleaner slot."
                  active
                  speed={2}
                />
              ) : (
                'I scanned recent performance, audience movement, and the schedule before drafting the answer.'
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function HomeWeekBrief() {
  return (
    <div style={{
      width: 720,
      marginTop: 32,
      borderTop: '1px solid var(--fg-primary)',
      padding: '14px 0 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', fontWeight: 500 }}>
          The week so far
        </span>
        <span className="hf-byline" style={{ fontSize: 10 }}>WED · APR 24 · 09:42 PT</span>
      </div>
      <p style={{
        margin: 0,
        fontFamily: 'var(--font-serif)',
        fontSize: 16,
        lineHeight: 1.55,
        color: 'var(--fg-primary)',
        letterSpacing: '-0.005em',
      }}>
        Comments are up <span className="hf-num" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>69%</span> on the safety series — most of them asking the same two questions you haven't answered. Three drafts are ready to ship; one of them (<span style={{ fontStyle: 'italic' }}>0046</span>) tests a hook you haven't run before. Marina replied to your DM and is waiting.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
        {[
          { eyebrow: 'INBOX', line: 'Two questions waiting', num: '142', sub: 'comments · up 69%' },
          { eyebrow: 'STUDIO', line: 'Three ready to ship', num: '3', sub: 'of 12 open drafts' },
          { eyebrow: 'MENTIONS', line: 'Marina replied', num: '23', sub: 'mentions · 3 creators' },
        ].map((p, i) => (
          <div key={p.eyebrow} style={{
            padding: '0 18px',
            borderLeft: i ? '1px solid var(--border-subtle)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <span className="hf-byline" style={{ fontSize: 9.5 }}>{p.eyebrow}</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)', lineHeight: 1.3 }}>{p.line}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span className="hf-num" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{p.num}</span>
              <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)' }}>{p.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Today briefing ───────────────────────────────────────
// Three columns: Priorities · Signals · Schedule.
// Compact — this is BELOW the fold relative to the composer.
function TodayBriefing() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  return (
    <div style={{
      width: 720, marginTop: 32,
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 0 4px rgba(182,83,43,0.16)' }} />
        <MetaLabel size={9.5}>Today at a glance</MetaLabel>
        <Mono size={10} color="var(--fg-tertiary)">Wed · Apr 24 · 7:08 am</Mono>
        <span style={{ flex: 1 }} />
        <span
          onClick={() => {
            // Destructive flow → route through pushToastUndo so the user can
            // recover the briefing without resubscribing or reloading. The
            // onUndo handler chains a plain pushToast so the recovery is also
            // visible in the toast layer.
            if (ms.pushToastUndo) {
              ms.pushToastUndo('Briefing dismissed', () => {
                if (ms.pushToast) ms.pushToast('Briefing restored');
              });
            } else if (ms.pushToast) {
              ms.pushToast('Dismiss briefing');
            }
          }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', cursor: 'pointer', textDecoration: 'underline' }}
        >dismiss</span>
      </div>

      {/* Body — three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--border-subtle)' }}>

        {/* Priorities */}
        <div style={{ background: 'var(--surface-1)', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MetaLabel size={9}>Priorities · 3</MetaLabel>
          {[
            ['Ship', 'Fujikawa script v3', 'due today'],
            ['Reply', '@marina.k thread', '2 days old'],
            ['Cut',  'Komodo cold-open',  'queued'],
          ].map(([k, t, sub], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: i === 0 ? 'var(--accent-primary)' : 'var(--fg-tertiary)' }} />
                <Mono size={9.5} color={i === 0 ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'}>{k}</Mono>
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 500, paddingLeft: 10 }}>{t}</span>
              <Mono size={9.5} color="var(--fg-tertiary)" style={{ paddingLeft: 10 }}>{sub}</Mono>
            </div>
          ))}
        </div>

        {/* Signals */}
        <div style={{ background: 'var(--surface-1)', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MetaLabel size={9}>Signals · 4</MetaLabel>
          {[
            ['0046 saving fast',     '+2.0% save rate', 'up'],
            ['0041 retention drop',  '−14% at 0:03',    'down'],
            ['Reply velocity',       '38 unread',        'flat'],
            ['Trend · cold-open',    '+22% in niche',    'up'],
          ].map(([t, sub, dir], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 500 }}>{t}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: dir === 'up' ? 'var(--tone-success)' : dir === 'down' ? 'var(--tone-warning)' : 'var(--fg-tertiary)' }}>
                  {dir === 'up' ? '↑' : dir === 'down' ? '↓' : '·'}
                </span>
                <Mono size={9.5} color="var(--fg-tertiary)">{sub}</Mono>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div style={{ background: 'var(--surface-1)', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MetaLabel size={9}>Schedule · next 48h</MetaLabel>
          {[
            ['Today',  '6:30 PM', 'IG · Truk teaser'],
            ['Today',  '9:00 PM', 'TikTok · 8-second rule'],
            ['Thu',    '7:00 AM', 'YouTube · Fujikawa primer'],
            ['Thu',    '6:00 PM', 'IG Story · La Jolla scout'],
          ].map(([d, t, label], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 50px 1fr', gap: 6, alignItems: 'baseline' }}>
              <Mono size={9.5} color="var(--fg-tertiary)">{d}</Mono>
              <Mono size={9.5} color="var(--fg-secondary)" style={{ fontWeight: 600 }}>{t}</Mono>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-primary)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Recent threads ───────────────────────────────────────
function RecentThreads() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const threads = (HD && HD.threads) ? HD.threads.slice(0, 5) : [];
  return (
    <div style={{ width: 720, marginTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <MetaLabel size={9.5}>Recent threads</MetaLabel>
        <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        <span
          onClick={() => ms.setActiveSurface && ms.setActiveSurface('home', 'Threads')}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', cursor: 'pointer', textDecoration: 'underline' }}
        >view all</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {threads.map((th, i) => (
          <div
            key={th.id}
            onClick={() => ms.pushToast && ms.pushToast('Open thread · ' + (th.id || th.title || 'thread'))}
            style={{
              padding: '12px 14px',
              display: 'grid', gridTemplateColumns: '1fr 80px',
              gap: 12, alignItems: 'baseline',
              borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'transform 120ms ease',
            }}>
            <div style={{ minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{th.title}</span>
              <div style={{ marginTop: 2, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{th.snippet}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <Mono size={9.5} color="var(--fg-tertiary)">{th.m}</Mono>
              {th.signal && th.signal !== 'none' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: th.signal === 'charts' ? 'var(--tone-info)' : th.signal === 'drafts' ? 'var(--accent-primary)' : 'var(--tone-warning)' }} />
                  <Mono size={9} color="var(--fg-tertiary)">{th.signal} · {th.count}</Mono>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BTF · Week ahead ─────────────────────────────────────
// Horizontal 7-day strip. Today highlighted. Each day shows scheduled count,
// the platforms in queue, and the most-anchoring post for that day.
function HomeWeekAhead() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const days = [
    { d: 'WED', date: 'Apr 24', today: true, slots: [
      { time: '6:30p', ch: 'ig', label: 'Truk teaser' },
      { time: '9:00p', ch: 'tt', label: '8-second rule' },
    ]},
    { d: 'THU', date: 'Apr 25', slots: [
      { time: '7:00a', ch: 'yt', label: 'Fujikawa primer' },
      { time: '6:00p', ch: 'ig', label: 'La Jolla scout' },
    ]},
    { d: 'FRI', date: 'Apr 26', slots: [
      { time: '12:00p', ch: 'tt', label: 'Buddy-check redo' },
    ]},
    { d: 'SAT', date: 'Apr 27', slots: [], open: true },
    { d: 'SUN', date: 'Apr 28', slots: [
      { time: '5:00p', ch: 'yt', label: 'Komodo cold-open' },
    ]},
    { d: 'MON', date: 'Apr 29', slots: [], open: true },
    { d: 'TUE', date: 'Apr 30', slots: [
      { time: '8:00p', ch: 'ig', label: 'Reply to @marina.k' },
    ]},
  ];
  const totalScheduled = days.reduce((acc, d) => acc + d.slots.length, 0);
  const totalOpen = days.filter(d => d.open).length;

  return (
    <section>
      <SectionHead
        kicker="WEEK AHEAD · APR 24 → APR 30"
        title="What's queued"
        italic
        right={<>
          <span className="hf-byline" style={{ fontSize: 10 }}>{totalScheduled} SCHEDULED · {totalOpen} OPEN</span>
        </>}
      />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}>
        {days.map((d, i) => (
          <div
            key={d.d}
            onClick={() => ms.setActiveSurface && ms.setActiveSurface('calendar', null)}
            style={{
              padding: '14px 14px 16px',
              borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none',
              background: d.today ? 'var(--accent-soft)' : 'transparent',
              display: 'flex', flexDirection: 'column', gap: 10, minHeight: 168,
              cursor: 'pointer',
              transition: 'transform 120ms ease',
            }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <Mono size={10.5} color={d.today ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'} style={{ letterSpacing: '0.14em', fontWeight: 700 }}>{d.d}</Mono>
              <Mono size={9.5} color="var(--fg-tertiary)">{d.date}</Mono>
            </div>
            {d.slots.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 4, opacity: 0.7 }}>
                <span style={{ width: 18, height: 1, background: 'var(--fg-tertiary)' }} />
                <Mono size={9.5} color="var(--fg-tertiary)" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>nothing yet</Mono>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {d.slots.map((s, si) => (
                  <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ChannelGlyph id={s.ch} size={12} />
                      <Mono size={9.5} color="var(--fg-secondary)" style={{ fontWeight: 700 }}>{s.time}</Mono>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12.5,
                      color: 'var(--fg-primary)', lineHeight: 1.3,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Saturday and Monday are the strongest unfilled slots.</span>
        <span
          onClick={() => ms.setActiveSurface && ms.setActiveSurface('calendar', null)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer' }}
        >OPEN CALENDAR →</span>
      </div>
    </section>
  );
}

// ─── BTF · Library pulse ──────────────────────────────────
// 4-up grid of recent posts that are still moving. Mirrors the editorial
// "what's doing the work right now" framing used in HF_HomeCommand's footer
// but at the BTF density of Home.
function HomeLibraryPulse() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const posts = (HD && HD.posts) ? HD.posts.slice(0, 4) : [];
  return (
    <section>
      <SectionHead
        kicker="LIBRARY · LAST 7 DAYS"
        title="What's still moving"
        italic
        right={<span className="hf-byline" style={{ fontSize: 10 }}>4 OF 142 · BY MOMENTUM</span>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {posts.map((p, i) => (
          <div
            key={p.id}
            onClick={() => ms.setActiveSurface && ms.setActiveSurface('library', 'Catalog')}
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderTop: i === 0 ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 10,
              cursor: 'pointer',
              transition: 'transform 120ms ease',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ChannelGlyph id={p.channel} size={16} />
              <Mono size={10} color="var(--fg-tertiary)">{p.id}</Mono>
              <span style={{ flex: 1 }} />
              <Mono size={10.5} color={i === 0 ? 'var(--accent-primary)' : 'var(--fg-secondary)'} style={{ fontWeight: 700 }}>
                {(p.watchPct * 100).toFixed(0)}%
              </Mono>
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14.5, fontWeight: 500,
              color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.3, minHeight: 56,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{p.title}</div>
            <Spark data={p.retention} w={180} h={20} accent={i === 0} />
            <Mono size={10} color="var(--fg-tertiary)">
              {HD.fmtNum(p.views)} views · {HD.fmtNum(p.saves)} saves
            </Mono>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>0046 is the early-stage save leader. Worth a carousel cut on day 8.</span>
        <span
          onClick={() => ms.setActiveSurface && ms.setActiveSurface('library', 'Catalog')}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer' }}
        >OPEN LIBRARY →</span>
      </div>
    </section>
  );
}

// ─── BTF · One thing to do (closing CTA) ──────────────────
function HomeOneThing() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  return (
    <section style={{
      borderTop: '6px double var(--fg-primary)',
      paddingTop: 22, marginTop: 6,
      display: 'grid', gridTemplateColumns: '1fr 280px', gap: 28, alignItems: 'center',
    }}>
      <div>
        <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>ONE THING TO DO · BEFORE YOU CLOSE THE LAPTOP</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--fg-primary)', lineHeight: 1.35, letterSpacing: '-0.005em' }}>
          Trim the Fujikawa cold-open from <span className="hf-num" style={{ fontStyle: 'normal', color: 'var(--accent-primary)', fontWeight: 600 }}>1.92s</span> to <span className="hf-num" style={{ fontStyle: 'normal', color: 'var(--accent-primary)', fontWeight: 600 }}>1.2s</span>. Your top quartile of long-form lives below 1.4. The rest of the cut is shippable.
        </div>
      </div>
      {window.HF_Tooltip
        ? <window.HF_Tooltip label="Selected from today's priority queue" side="left">
            <button
              className="hf-btn hf-btn-primary"
              onClick={() => ms.pushToast && ms.pushToast('Open project detail · 0046')}
              style={{ width: '100%', height: 44, fontSize: 13, cursor: 'pointer' }}>
              Open 0046 in Studio →
            </button>
          </window.HF_Tooltip>
        : (
            <button
              className="hf-btn hf-btn-primary"
              onClick={() => ms.pushToast && ms.pushToast('Open project detail · 0046')}
              style={{ width: '100%', height: 44, fontSize: 13, cursor: 'pointer' }}>
              Open 0046 in Studio →
            </button>
          )}
    </section>
  );
}

// ─── BTF · One-thing-to-do hero (clay-soft panel, dual CTA) ──
// Distinct from HomeOneThing: clay-soft panel with eyebrow, body paragraph,
// and a two-button row (open project / skip). HomeOneThing remains as the
// double-rule editorial close at the very end.
// ─── BTF · Briefing header band ───────────────────────────
// Defines what "briefing" means up top so the desk row beneath has context:
// what was pulled from, when it refreshes, and the one-line answer to
// "why am I looking at this".
function HomeBriefingHeader() {
  return (
    <section style={{
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '20px 0 22px',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: 32,
      rowGap: 8,
      alignItems: 'baseline',
    }}>
      <Mono size={10} color="var(--fg-tertiary)" style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>
        TODAY'S BRIEFING · TUE APR 30
      </Mono>
      <Mono size={10} color="var(--fg-tertiary)" style={{ letterSpacing: '0.12em', fontWeight: 600, justifySelf: 'end' }}>
        REFRESHES 7:00 AM
      </Mono>
      <h2 style={{
        margin: 0,
        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
        fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.014em', lineHeight: 1.2,
        gridColumn: '1 / -1',
      }}>
        Three signals worth your morning.
      </h2>
      <p style={{
        margin: 0,
        fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55,
        maxWidth: 640,
        gridColumn: '1 / -1',
      }}>
        Pulled from your last 24 hours of posts, comments, and trend feeds — surfaced as one open thread, one in progress, and one already handled.
      </p>
    </section>
  );
}

// ─── BTF · Desk row · 3 signals with explicit state ───────
// Replaces the single-card "one thing" hero. Each card reads its own
// state at a glance: ACTIVE (accent border, full body, primary CTA),
// IN-PROGRESS (neutral border, partial body, secondary CTA), CLOSED
// (low-contrast, collapsed, "reopen" link). This is what Henry meant
// by "show how it's active or closed".
function HomeDeskRow() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const cards = [
    {
      id: '0046',
      stateKey: 'active',
      eyebrow: 'ACTIVE · OPEN NOW',
      title: 'Re-cut the Fujikawa cold-open before the wreck-tag rolls off.',
      body: 'The seven-day window closes Friday. 0046 still needs trim work — the other two cuts are scheduled. Forty minutes to ship.',
      chip: '+1.4× lift',
      cta: 'Open project · 0046',
      onCta: () => {
        if (ms.setActiveSurface) ms.setActiveSurface('studio', 'Concept');
        if (ms.setDetail) ms.setDetail('project', '0046');
        if (ms.pushToast) ms.pushToast('Open project · 0046');
      },
    },
    {
      id: '0047',
      stateKey: 'progress',
      eyebrow: 'IN PROGRESS · STARTED 1H AGO',
      title: 'Three reasons I trust my gauge over the dashboard.',
      body: 'Hooks drafted, six of eight shots blocked. Pick up where you left off in Studio.',
      chip: '6 of 8 shots',
      cta: 'Resume in Studio',
      onCta: () => {
        if (ms.setActiveSurface) ms.setActiveSurface('studio', 'Hooks');
        if (ms.setDetail) ms.setDetail('project', '0047');
        if (ms.pushToast) ms.pushToast('Resume · 0047');
      },
    },
    {
      id: '0042',
      stateKey: 'closed',
      eyebrow: 'CLOSED · 2H AGO',
      title: 'My first wreck — and what I got wrong.',
      body: '',
      chip: '21 comments',
      cta: 'Reopen',
      onCta: () => {
        if (ms.setActiveSurface) ms.setActiveSurface('library', 'Catalog');
        if (ms.setDetail) ms.setDetail('post', '0042');
        if (ms.pushToast) ms.pushToast('Reopen · 0042');
      },
    },
  ];
  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
      {cards.map((c) => {
        const isActive = c.stateKey === 'active';
        const isProgress = c.stateKey === 'progress';
        const isClosed = c.stateKey === 'closed';

        // State-driven container styling.
        const containerStyle = {
          position: 'relative',
          background: isClosed ? 'var(--surface-2)' : 'var(--surface-1)',
          border: isActive
            ? '1.5px solid var(--accent-primary)'
            : isProgress
              ? '1px solid var(--border-default)'
              : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          opacity: isClosed ? 0.62 : 1,
          boxShadow: isActive
            ? '0 1px 0 rgba(26,24,21,0.02), 0 16px 36px -22px rgba(26,24,21,0.18)'
            : 'none',
          transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          minHeight: 188,
        };

        // State-driven eyebrow color.
        const eyebrowColor = isActive
          ? 'var(--accent-primary)'
          : isProgress
            ? 'var(--tone-info)'
            : 'var(--fg-tertiary)';

        return (
          <div key={c.id} style={containerStyle}>
            {/* Closed corner glyph — small "x" mark. */}
            {isClosed && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 10, right: 12,
                  width: 14, height: 14,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--fg-tertiary)',
                }}>
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M2 2 L10 10 M10 2 L2 10" />
                </svg>
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <Mono size={9.5} color={eyebrowColor} style={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
                {c.eyebrow}
              </Mono>
              <Mono size={9.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.08em' }}>{c.id}</Mono>
            </div>

            <div style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
              fontSize: isClosed ? 15 : 17,
              color: 'var(--fg-primary)',
              letterSpacing: '-0.008em',
              lineHeight: 1.28,
            }}>
              {c.title}
            </div>

            {/* Body shown on active + progress; closed collapses it. */}
            {!isClosed && c.body ? (
              <p style={{
                margin: 0,
                fontFamily: 'var(--font-sans)', fontSize: 12.5,
                color: 'var(--fg-secondary)', lineHeight: 1.55,
                opacity: isProgress ? 0.92 : 1,
              }}>
                {c.body}
              </p>
            ) : null}

            <span style={{ flex: 1 }} />

            {/* Footer: metric chip + CTA */}
            <div style={{
              paddingTop: 10,
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                height: 22, padding: '0 9px',
                background: isActive ? 'var(--accent-soft)' : 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 999,
                fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
                color: isActive ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                letterSpacing: '0.04em',
              }}>{c.chip}</span>

              {isActive ? (
                <button
                  className="hf-btn hf-btn-primary"
                  onClick={c.onCta}
                  style={{ height: 30, padding: '0 14px', fontSize: 11.5, cursor: 'pointer' }}>
                  {c.cta}
                </button>
              ) : isProgress ? (
                <span
                  onClick={c.onCta}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10.5,
                    color: 'var(--accent-primary)', fontWeight: 700,
                    letterSpacing: '0.06em', cursor: 'pointer',
                  }}>
                  {c.cta.toUpperCase()} →
                </span>
              ) : (
                <span
                  onClick={c.onCta}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10.5,
                    color: 'var(--fg-tertiary)', fontWeight: 600,
                    letterSpacing: '0.06em', cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}>
                  {c.cta.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function HomeOneThingHero() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  return (
    <section style={{
      background: 'var(--accent-soft)',
      border: '1px solid var(--border-subtle)',
      borderLeft: '3px solid var(--accent-primary)',
      borderRadius: 'var(--radius-md)',
      padding: '22px 26px',
      display: 'grid',
      gridTemplateColumns: '1fr 220px',
      gap: 24,
      alignItems: 'center',
    }}>
      <div>
        <Mono size={10} color="var(--accent-primary-press)" style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>
          ONE THING · TUESDAY
        </Mono>
        <h2 style={{
          margin: '8px 0 10px',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
          fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.012em', lineHeight: 1.2,
        }}>
          Re-cut the Fujikawa cold-open before the wreck-tag rolls off the homepage.
        </h2>
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.6, maxWidth: 540 }}>
          The seven-day window for the Truk Lagoon series closes Friday. 0046 is the only piece that still needs trim work — the other two cuts are scheduled. Forty minutes to ship.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          className="hf-btn hf-btn-primary"
          onClick={() => {
            if (ms.setActiveSurface) ms.setActiveSurface('studio', 'Concept');
            if (ms.setDetail) ms.setDetail('project', '0046');
            if (ms.pushToast) ms.pushToast('Open project · 0046');
          }}
          style={{ width: '100%', height: 40, fontSize: 12.5, cursor: 'pointer' }}>
          Open project · 0046
        </button>
        <button
          onClick={() => ms.pushToast && ms.pushToast('Skipped one-thing for today')}
          style={{
            width: '100%', height: 36, fontSize: 11.5, cursor: 'pointer',
            background: 'transparent', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)', color: 'var(--fg-secondary)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
            transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
          Skip for today
        </button>
      </div>
    </section>
  );
}

// ─── BTF · Library pulse expanded — three different pulse types ──
// Three cards: recent win (0046), draft to pick up (0047), overdue (0044 long).
// Distinct from HomeLibraryPulse (the by-momentum 4-up); this is a typed
// snapshot — what shipped, what's stuck, what's slipping.
function HomeLibraryTriad() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const cards = [
    {
      kind: 'win', id: '0042', title: 'My first wreck — and what I got wrong',
      eyebrow: 'RECENT WIN · APR 14',
      stats: [{ k: 'views', v: '421k' }, { k: 'completion', v: '71%' }],
      tone: 'var(--tone-success)',
    },
    {
      kind: 'pickup', id: '0047', title: 'Three reasons I trust my gauge over the dashboard',
      eyebrow: 'DRAFT · PICK UP · 2 DAYS QUIET',
      stats: [{ k: 'words', v: '480' }, { k: 'shots', v: '6 of 8' }],
      tone: 'var(--accent-primary)',
    },
    {
      kind: 'overdue', id: '0044', title: 'Truk Lagoon · Fujikawa Maru in eight breaths',
      eyebrow: 'SLIPPING · COLD-OPEN STILL 1.92S',
      stats: [{ k: 'cut at', v: '1.92s' }, { k: 'target', v: '1.20s' }],
      tone: 'var(--tone-warning)',
    },
  ];
  return (
    <section>
      <SectionHead
        kicker="LIBRARY · TYPED PULSE"
        title="Where the desk stands right now"
        italic
        right={<span className="hf-byline" style={{ fontSize: 10 }}>3 SIGNALS · UPDATED 7:08 AM</span>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {cards.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              if (ms.setActiveSurface) ms.setActiveSurface('library', 'Catalog');
              if (ms.setDetail) ms.setDetail('post', c.id);
            }}
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderTop: '3px solid ' + c.tone,
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              display: 'flex', flexDirection: 'column', gap: 12,
              cursor: 'pointer',
              transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
            <Mono size={9.5} color={c.tone} style={{ letterSpacing: '0.12em', fontWeight: 700 }}>{c.eyebrow}</Mono>
            <div style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, fontWeight: 500,
              color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.3, minHeight: 60,
            }}>{c.title}</div>
            <div style={{ display: 'flex', gap: 18, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
              {c.stats.map((s, i) => (
                <div key={i}>
                  <Mono size={9} color="var(--fg-tertiary)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>{s.k}</Mono>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--fg-primary)' }}>{s.v}</span>
                </div>
              ))}
              <span style={{ flex: 1 }} />
              <Mono size={10} color="var(--fg-tertiary)">{c.id}</Mono>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── BTF · Activity strip (thin horizontal mono row) ──────
function HomeActivityStrip() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const items = [
    { tag: 'COOPR', body: 'drafted 3 hooks for 0047', when: '2h ago' },
    { tag: 'YOU',   body: 'shipped 0046',            when: '4h ago' },
    { tag: 'COOPR', body: 'closed Tuesday-miss study', when: 'yesterday' },
    { tag: 'YOU',   body: 'replied to @marina.k',    when: 'yesterday' },
    { tag: 'COOPR', body: 'pulled new dispatch from radar', when: '2d ago' },
  ];
  return (
    <section style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="hf-byline" style={{ fontSize: 10 }}>ACTIVITY · LAST 48 HOURS</span>
        <span
          onClick={() => ms.setActiveSurface && ms.setActiveSurface('home', 'Activity')}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer' }}
        >SEE ALL →</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 0 }}>
        {items.map((it, i) => (
          <div
            key={i}
            onClick={() => ms.setActiveSurface && ms.setActiveSurface('home', 'Activity')}
            style={{
              flex: '1 1 0',
              minWidth: 220,
              padding: '8px 14px',
              borderLeft: i === 0 ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'background 240ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
            <Mono size={9} color={it.tag === 'COOPR' ? 'var(--accent-primary)' : 'var(--fg-tertiary)'} style={{ letterSpacing: '0.12em', fontWeight: 700, display: 'block', marginBottom: 4 }}>
              {it.tag}
            </Mono>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-primary)', lineHeight: 1.4, display: 'block' }}>
              {it.body}
            </span>
            <Mono size={9.5} color="var(--fg-tertiary)" style={{ marginTop: 4, display: 'block' }}>{it.when}</Mono>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── BTF · Briefing teaser (2-line + open link) ───────────
function HomeBriefingTeaser() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  return (
    <section
      onClick={() => ms.setActiveSurface && ms.setActiveSurface('home', 'Briefing')}
      style={{
        cursor: 'pointer',
        padding: '16px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        transition: 'opacity 240ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
      <div style={{ flex: 1 }}>
        <Mono size={10} color="var(--fg-tertiary)" style={{ letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 6 }}>
          THIS MORNING'S BRIEFING · 4-MIN READ
        </Mono>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--fg-primary)', lineHeight: 1.45, letterSpacing: '-0.005em' }}>
          The wreck-tag is up 18% week-over-week. Three brand DMs are warm. Tuesday is your second-best slot, and you have a shippable cut in the queue.
        </span>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
        OPEN FULL BRIEFING →
      </span>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────
function HF_HomeChat({ state = 'happy' }) {
  // R10 · state variants — read tweaks override, fall back to prop, then 'happy'.
  // Home has no subtab strip; registry uses 'Today' as the surface id.
  const ovr = window.useSurfaceState && window.useSurfaceState('home', 'Today');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="home"><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="home"><window.HF_EmptyHero
      eyebrow="Today · 0 threads"
      title="Nothing waiting. Start the day with a question."
      caption="Ask Coopr what to ship, what to read, or what to record next."
      ctaLabel="Open composer"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="home"><window.HF_ErrorHero
      title="Couldn't load today's briefing."
      body="The thread index is taking longer than usual. Retry, or open a fresh chat."
    /></HfShell>;
  }
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* ── ABOVE-THE-FOLD · centered 720 column ───────── */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '52px 32px 60px' }}>
          <div style={{ width: 720, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Editorial masthead */}
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <Mono size={10.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>STUDIO · THREADS</Mono>
              <h1 style={{
                margin: '14px 0 8px',
                fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 44,
                color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1,
              }}>
                Good morning, <span style={{ fontStyle: 'italic' }}>Henry</span>.
              </h1>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                Draft, ask, schedule. Anything you make here lands in the Library.
              </div>
            </div>

            {/* Hero composer */}
            <HomeComposer />

            {/* Suggestions */}
            <SuggestionRow items={[
              { eyebrow: 'DRAFT',     prompt: 'Three openers for the Fiji wreck series, under 1.2 seconds.' },
              { eyebrow: 'EXPLAIN',   prompt: 'Why did 0042 keep watchers and 0041 lose them at minute three?' },
              { eyebrow: 'SCHEDULE',  prompt: 'Lay out next week to balance safety, gear, and storytime.' },
              { eyebrow: 'REPLY',     prompt: "Draft a reply to @marina.k that doesn't sound like a brand." },
            ]} />

            <HomeWeekBrief />

          </div>
        </div>

        {/* ── BELOW-THE-FOLD · wider editorial layer ─────── */}
        <div style={{
          background: 'var(--surface-1)',
          borderTop: '1px solid var(--border-default)',
          padding: '48px 32px 64px',
        }}>
          <div style={{ maxWidth: 1248, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* BTF byline strip — anchors the fold visually */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
              <span className="hf-byline" style={{ fontSize: 10 }}>YOUR DESK · BELOW THE FOLD</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-tertiary)' }}>
                The week, the library, and the one move worth making before bed.
              </span>
              <span className="hf-byline" style={{ fontSize: 10 }}>UPDATED 7:08 AM · 4 MIN AGO</span>
            </div>

            <HomeBriefingHeader />
            <HomeDeskRow />
            <HomeWeekAhead />
            <HomeLibraryTriad />
            <HomeLibraryPulse />
            <HomeActivityStrip />
            <HomeBriefingTeaser />
            <HomeOneThing />
          </div>
        </div>

      </div>
    </HfShell>
  );
}

// ─── Variant: cold-open (no briefing, day-one feel) ───────
function HF_HomeColdOpen() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '52px 32px 60px' }}>
        <div style={{ width: 720, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Mono size={10.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>WELCOME · DAY ONE</Mono>
            <h1 style={{ margin: '18px 0 14px', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 56, color: 'var(--fg-primary)', letterSpacing: '-0.035em', lineHeight: 1.02 }}>
              COO<span style={{ fontStyle: 'italic', fontWeight: 500 }}>P</span>R
            </h1>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 540, margin: '0 auto' }}>
              A creative engine for creators. Start with a draft, an ask, or a thought you don't know what to do with yet.
            </div>
          </div>
          <HomeComposer placeholder="What are you working on?" />
          <div style={{ marginTop: 36, width: 720 }}>
            <Mono size={10} color="var(--fg-tertiary)" style={{ letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: 12 }}>
              TRY ONE OF THESE TO GET STARTED
            </Mono>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { num: '01', title: 'Connect a channel', body: "YouTube, Instagram, or TikTok. We'll read your last 30 posts to learn your voice." },
                { num: '02', title: 'Try a hook test', body: "Paste a draft. We'll show you three openers ranked against your top quartile." },
                { num: '03', title: 'Ask a question', body: 'Anything about your audience, your library, your schedule. Voice or text.' },
              ].map(c => (
                <div
                  key={c.num}
                  onClick={() => ms.pushToast && ms.pushToast(c.title)}
                style={{
                  minHeight: 130,
                  padding: 14,
                  border: '1px solid var(--border-default)',
                  background: 'var(--surface-1)',
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  cursor: 'pointer',
                  transition: 'transform 120ms ease',
                }}>
                  <Mono size={10.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.08em' }}>{c.num}</Mono>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{c.title}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{c.body}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// ─── Variant: active thread (composer docked at bottom) ───
function HF_HomeActive() {
  const [phase, setPhase] = React.useState('reasoning');
  const [saved, setSaved] = React.useState(false);
  const Trail = window.R4BReasoningTrail;
  const Stream = window.R4BStreamingText;
  const Tool = window.R4BToolRun;
  const RetentionBlock = window.HF_R4B_A01;
  const Icon = window.Icon;
  const steps = [
    { label: 'Reading 6 safety posts', detail: 'retention curves', sources: 6 },
    { label: 'Querying audience', detail: 'last 30 days', sources: 1 },
    { label: 'Comparing to top quartile', detail: 'n=12', sources: 1 },
    { label: 'Drafting next move', detail: 'voice match', sources: 0 },
  ];
  const para1 = 'The drop happens at {{EM:0:03}} and again at {{EM:0:14}}. The first cuts {{ACC:−14% vs your benchmark}}. The second is normal mid-attention.';
  const para2 = 'Hooks above {{EM:1.8s}} correlate. Your last six averaged {{NUM:1.96|accent}}s. The two posts that held attention ({{EM:0042}}, {{EM:0039}}) opened in under {{NUM:1.2|accent}}s.';

  React.useEffect(() => {
    if (phase !== 'reasoning') return undefined;
    const id = window.setTimeout(() => setPhase('para1'), 2100);
    return () => window.clearTimeout(id);
  }, [phase]);

  React.useEffect(() => {
    if (phase !== 'toolrun') return undefined;
    const id = window.setTimeout(() => setPhase('block'), 1700);
    return () => window.clearTimeout(id);
  }, [phase]);

  React.useEffect(() => {
    if (phase !== 'block') return undefined;
    const id = window.setTimeout(() => setPhase('para2'), 420);
    return () => window.clearTimeout(id);
  }, [phase]);

  const showPara1 = ['para1', 'toolrun', 'block', 'para2', 'chips'].includes(phase);
  const showTool = ['toolrun', 'block', 'para2', 'chips'].includes(phase);
  const showBlock = ['block', 'para2', 'chips'].includes(phase);
  const showPara2 = ['para2', 'chips'].includes(phase);
  const isStreaming = ['reasoning', 'para1', 'toolrun', 'block', 'para2'].includes(phase);
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', maxWidth: 880, width: '100%', margin: '0 auto', boxSizing: 'border-box', flexShrink: 0 }}>
          <div>
            <div className="hf-byline" style={{ marginBottom: 4 }}>THREAD · 12 MIN AGO · <span className="hf-num">4</span> TURNS</div>
            <div className="hf-headline" style={{ fontSize: 24 }}>Why dive-safety retention dropped at minute three</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="hf-tag hf-tag-accent"><span className="hf-num">{saved ? 3 : 2}</span> charts saved</span>
            <span className="hf-tag"><span className="hf-num">1</span> draft</span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 32px 24px', maxWidth: 880, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <section className="r4bd-turn" data-role="Henry">
            <div className="r4bd-turn-role"><div>Henry</div><div className="num" style={{ marginTop: 5, fontSize: 9 }}>09:42</div></div>
            <div className="r4bd-turn-body">
              <p className="r4bd-turn-copy">Why did retention drop on the last six safety primers? Open the data and tell me where they leave.</p>
            </div>
          </section>
          <section className="r4bd-turn" data-role="Coopr">
            <div className="r4bd-turn-role"><div>Coopr</div><div className="num" style={{ marginTop: 5, fontSize: 9 }}>+0:03</div></div>
            <div className="r4bd-turn-body">
              {Trail ? (
                <Trail steps={steps} active={phase === 'reasoning'} complete={phase !== 'reasoning'} />
              ) : (
                <div className="r4bd-trail">Reasoned · 8 sources</div>
              )}
              {showPara1 && (
                <p className="r4bd-turn-copy" style={{ color: 'var(--fg-primary)', fontStyle: 'normal' }}>
                  {Stream ? (
                    <Stream text={para1} active={phase === 'para1'} speed={2} onDone={() => setPhase('toolrun')} />
                  ) : para1}
                </p>
              )}
              {showTool && Tool && (
                <Tool
                  name="Charting"
                  target="retention · last 6 safety"
                  active={phase === 'toolrun'}
                  complete={showBlock}
                />
              )}
              {showBlock && RetentionBlock && (
                <div className="r4bd-turn-grid" data-mode="single" data-block-count="1">
                  <div className={`r4bd-block-shell cell-8${phase === 'block' ? ' r4bd-save-flash' : ''}`} data-demo-block-id="A01">
                    <RetentionBlock />
                  </div>
                </div>
              )}
              {showPara2 && (
                <p className="r4bd-turn-copy" style={{ color: 'var(--fg-primary)', fontStyle: 'normal' }}>
                  {Stream ? (
                    <Stream text={para2} active={phase === 'para2'} speed={2} onDone={() => setPhase('chips')} />
                  ) : para2}
                </p>
              )}
              {phase === 'chips' && (
                <div className="r4bd-chip-row">
                  <button type="button" className="r4bd-action-chip" data-saved={saved ? '1' : '0'} onClick={() => setSaved(true)}>
                    {Icon && <Icon name={saved ? 'check' : 'plus'} size={10} />}{saved ? 'Saved chart' : 'Save chart'}
                  </button>
                  <button type="button" className="r4bd-action-chip">{Icon && <Icon name="arrow-up-right" size={10} />}Open in Audience</button>
                  <button type="button" className="r4bd-action-chip">{Icon && <Icon name="pencil" size={10} />}Draft a fix</button>
                  <button type="button" className="r4bd-action-chip">{Icon && <Icon name="dots" size={10} />}More</button>
                </div>
              )}
              {isStreaming && (
                <div>
                  <button type="button" className="r4bd-control-btn" onClick={() => setPhase('chips')}>
                    {Icon && <Icon name="square" size={9} />}Stop · ESC
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <div style={{ padding: '12px 32px 18px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-1)', maxWidth: 880, width: '100%', margin: '0 auto', boxSizing: 'border-box', flexShrink: 0 }}>
          <div style={{ width: '100%' }}>
            <HomeComposer placeholder="Reply…" docked />
          </div>
        </div>
      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_HomeChat, HF_HomeColdOpen, HF_HomeActive });
