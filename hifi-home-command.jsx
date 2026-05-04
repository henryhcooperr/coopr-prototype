/* global React, HfShell, BackendNote, FreshnessPill, MetricCell, Spark, Sparkbar, ChannelGlyph, SectionHead, RankedRow, window */
// hifi-home-command.jsx — data-rich Home: command-center variant.
// Brings back HF_HomeCommand on the new top-nav (no SlimRail).
// Surfaces: KPI strip · Priorities (3 stacked) · Signals · Schedule heatmap · Library pulse.

const HC = window.HF_DATA;

function HF_HomeCommand() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  // ── Top KPI strip ────────────────────────────────────────
  // Only the load-bearing #01 cell carries clay — the others stay neutral so
  // the saves-velocity story (matches Priority #01 below) reads as the "one thing".
  const kpis = [
    { label: 'Followers',       value: '12,438', unit: '',  delta: +3.2,  spark: [8, 9, 11, 10, 13, 14, 14], accent: false },
    { label: 'Avg retention',   value: '52.4',   unit: '%', delta: -4.1,  spark: [62, 58, 55, 54, 53, 52, 52], accent: false },
    { label: 'Comments / post', value: '38',     unit: '',  delta: +11.8, spark: [22, 28, 31, 35, 33, 36, 38], accent: false },
    { label: 'Saves · 7d',      value: '4.6',    unit: 'K', delta: +28.4, spark: [2.1, 2.4, 2.8, 3.1, 3.6, 4.2, 4.6], accent: true  },
  ];

  // Numeric span helper — guarantees tabular-mono on every figure in body copy.
  const N = ({ children, c }) => (
    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: c || 'var(--fg-primary)' }}>{children}</span>
  );

  // ── Priorities (the 3 things that matter today) ─────────
  const priorities = [
    {
      kicker:   'PRIORITY · 01',
      head:     'Reply to the safety cluster before noon',
      body:     <><N>142</N> commenters this week want a technical follow-up on tank-check redundancy. Median commenter has watched <N>4</N> of your last <N>6</N>.</>,
      meta:     ['Audience', 'Reply window · 4h', '+18% vs last wk'],
      action:   'Draft reply',
      backend:  'cluster engine + reply scheduler',
    },
    {
      kicker:   'PRIORITY · 02',
      head:     'Trim the hook on Fiji wreck → ship today',
      body:     <>Hook is <N>1.92s</N>. Top quartile is under <N>1.4s</N>. Trim to <N>1.2s</N> and you gain ~<N>9%</N> by minute three based on your last <N>12</N>.</>,
      meta:     ['Studio · 0046', 'Drafted 2d ago', 'Confidence high'],
      action:   'Open in Studio',
      backend:  'hook-length retention model',
    },
    {
      kicker:   'PRIORITY · 03',
      head:     'Repurpose 0042 before its window closes',
      body:     <>Carousel script ready. Saves curve still rising at day <N>7</N> — a carousel cut typically captures <N>+30%</N> more on day <N>8–14</N>.</>,
      meta:     ['Library · 0042', 'Window · 3d', 'Repurpose queue'],
      action:   'Send to carousel',
      backend:  'repurpose engine',
    },
  ];

  // ── Signals (rolling watch list) ────────────────────────
  const signals = [
    { who: '@marina.k',         what: <>tagged you in a decompression-illness thread.</>, when: '4h',  pull: '18%',  pullSub: 'audience overlap' },
    { who: 'Niche-wide',        what: <>safety primers outperforming gear teardowns <N c="var(--fg-primary)">2.1×</N> this month.</>, when: 'today', pull: '2.1×', pullSub: 'vs gear' },
    { who: '@reefclub_official', what: <>quoted post 0042. <N c="var(--fg-primary)">11.0K</N> impressions. Two course-DMs.</>, when: '6h',  pull: '11.0K', pullSub: 'impressions' },
    { who: 'Format DNA',        what: <>cold-open + B-roll cuts are pulling <N c="var(--tone-success)">+14%</N> retention vs straight-to-camera.</>, when: '1d',  pull: '+14%', pullSub: 'retention lift' },
    { who: 'Reply rate',        what: <>dropped to <N c="var(--tone-warning)">64%</N> (was <N c="var(--fg-tertiary)">71%</N>) — <N c="var(--fg-primary)">23</N> unanswered DMs in Inbox.</>, when: 'now', pull: '23', pullSub: 'unanswered' },
  ];

  // ── Schedule (next 7 days, heatmap intensity = "weight" of day) ──
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const slots = [
    { time: '07h', vals: [0, 1, 0, 0, 0, 2, 1] },
    { time: '12h', vals: [2, 0, 3, 1, 0, 1, 0] },
    { time: '17h', vals: [1, 2, 2, 3, 1, 0, 0] },
    { time: '21h', vals: [0, 1, 1, 2, 2, 3, 1] },
  ];
  const slotInk = (n) => {
    if (n === 0) return 'transparent';
    if (n === 1) return 'var(--accent-soft)';
    if (n === 2) return 'var(--accent-primary)';
    return 'var(--accent-primary-press)';
  };

  return (
    <HfShell workspace="home" topbarRight={<FreshnessPill at="4 min ago" state="fresh" />}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto', background: 'var(--bg-base)' }}>

        {/* ─── Hero band — editorial header parity with HomeChat ───── */}
        <div style={{ padding: '28px 32px 22px', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="hf-byline" style={{ fontSize: 10, letterSpacing: '0.18em' }}>WED · APR 24 · HOME · COMMAND CENTER</span>
            <BackendNote kind="gap">today engine + cross-workspace aggregator (TBD)</BackendNote>
          </div>
          <h1 style={{
            margin: '4px 0 8px',
            fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 36,
            color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.1,
          }}>
            Three things matter, <span style={{ fontStyle: 'italic' }}>Henry</span>.
          </h1>
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', lineHeight: 1.45 }}>
            Two are about to expire — start with <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontStyle: 'normal', color: 'var(--accent-primary)' }}>#01</span>.
          </span>
        </div>

        {/* ─── KPI strip ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '14px 0' }}>
          {kpis.map((k, i) => (
            <div key={k.label} style={{ borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
              <MetricCell {...k} sparkline={<Spark data={k.spark} w={120} h={28} accent={k.accent} />} />
            </div>
          ))}
        </div>

        {/* ─── Body 12-col ───────────────────────────────── */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 28, padding: '22px 32px 32px' }}>

          {/* LEFT · Priorities */}
          <section>
            <SectionHead
              kicker="TODAY · 3 PRIORITIES"
              title="Move on these before the window closes."
              italic
              right={<>
                <span className="hf-byline">RANKED BY URGENCY × IMPACT</span>
                <BackendNote kind="gap">priority score</BackendNote>
              </>}
            />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {priorities.map((p, i) => (
                <article
                  key={i}
                  onClick={() => ms.pushToast && ms.pushToast(p.action)}
                  style={{
                    padding: '18px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'grid', gridTemplateColumns: '54px 1fr auto', gap: 18, alignItems: 'flex-start',
                    cursor: 'pointer',
                    transition: 'transform 120ms ease',
                  }}>
                  <span className="hf-num" style={{
                    fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 600,
                    color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-tertiary)',
                    lineHeight: 0.9, letterSpacing: '-0.02em',
                  }}>{String(i + 1).padStart(2, '0')}</span>

                  <div style={{ minWidth: 0 }}>
                    <div className="hf-byline" style={{ fontSize: 9.5, marginBottom: 5 }}>{p.kicker}</div>
                    <div style={{
                      fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600,
                      color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 6,
                    }}>{p.head}</div>
                    <div style={{ fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{p.body}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {p.meta.map((m, mi) => (
                        <span key={mi} className="hf-tag" style={{ fontSize: 10.5, height: 20 }}>{m}</span>
                      ))}
                      <span style={{ flex: 1 }} />
                      <BackendNote kind="gap">{p.backend}</BackendNote>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); ms.pushToast && ms.pushToast(p.action); }}
                    className={i === 0 ? 'hf-btn hf-btn-primary hf-btn-sm' : 'hf-btn hf-btn-secondary hf-btn-sm'}
                    style={{ cursor: 'pointer' }}>
                    {p.action} →
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* RIGHT · Signals + Schedule */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Signals */}
            <div>
              <SectionHead
                kicker="SIGNAL · ROLLING"
                title="Watch list"
                italic
                right={<span className="hf-byline" style={{ fontSize: 9.5 }}>5 OF 23</span>}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {signals.map((s, i) => (
                  <RankedRow
                    key={i}
                    rank={i + 1}
                    accent={i === 0}
                    lead={<span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{s.who}</span>}
                    body={<span style={{ fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.4 }}>{s.what}</span>}
                    trail={<>
                      <div style={{ textAlign: 'right' }}>
                        <div className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)' }}>{s.pull}</div>
                        <div className="hf-byline" style={{ fontSize: 8.5, marginTop: 1 }}>{s.pullSub}</div>
                      </div>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', minWidth: 28, textAlign: 'right' }}>{s.when}</span>
                    </>}
                  />
                ))}
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  onClick={() => ms.setActiveSurface && ms.setActiveSurface('intel', 'Radar')}
                  style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', cursor: 'pointer', textDecoration: 'underline' }}
                >18 more in Intel · Radar →</span>
                <BackendNote kind="gap">signal aggregator</BackendNote>
              </div>
            </div>

            {/* Schedule heatmap */}
            <div>
              <SectionHead
                kicker="NEXT 7 · SCHEDULE WEIGHT"
                title="Where the week leans"
                italic
                right={<>
                  <span className="hf-byline" style={{ fontSize: 9.5 }}>7 SCHEDULED · 3 OPEN</span>
                </>}
              />

              {/* Heatmap */}
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                  <span></span>
                  {days.map(d => (
                    <span key={d} className="hf-byline" style={{ fontSize: 9, textAlign: 'center' }}>{d}</span>
                  ))}
                </div>
                {slots.map(s => (
                  <div key={s.time} style={{ display: 'grid', gridTemplateColumns: '36px repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                    <span className="hf-byline hf-num" style={{ fontSize: 9.5, textAlign: 'right', alignSelf: 'center', fontFamily: 'var(--font-mono)' }}>{s.time}</span>
                    {s.vals.map((v, i) => (
                      <div key={i} style={{
                        height: 28,
                        background: slotInk(v),
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: 9.5,
                        color: v >= 2 ? 'var(--fg-on-accent)' : (v === 1 ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'),
                        fontWeight: 600,
                      }}>
                        {v > 0 ? v : '·'}
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    {[0, 1, 2, 3].map(n => (
                      <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 14, height: 12, background: slotInk(n), border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }} />
                        <span className="hf-byline" style={{ fontSize: 9 }}>{n} POSTS</span>
                      </div>
                    ))}
                  </div>
                  <BackendNote kind="gap">posting heatmap</BackendNote>
                </div>
              </div>

              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Thursday 17h is your strongest unfilled slot.</span>
                <span
                  onClick={() => ms.setActiveSurface && ms.setActiveSurface('calendar', null)}
                  style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                >FILL IT →</span>
              </div>
            </div>

          </section>
        </div>

        {/* ─── Library pulse footer ──────────────────────── */}
        <div style={{ padding: '18px 32px 28px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <SectionHead
            kicker="LIBRARY PULSE · 7D"
            title="What is doing the work right now"
            italic
            rule={false}
            right={<span className="hf-byline" style={{ fontSize: 9.5 }}>4 OF 142 · BY MOMENTUM</span>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {HC.posts.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                onClick={() => ms.setActiveSurface && ms.setActiveSurface('library', 'Catalog')}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex', flexDirection: 'column', gap: 8,
                  borderTop: i === 0 ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'transform 120ms ease',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ChannelGlyph id={p.channel} size={16} />
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)' }}>{p.id}</span>
                  <span style={{ flex: 1 }} />
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-secondary)' }}>
                    {(p.watchPct * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.4, minHeight: 34 }}>{p.title}</div>
                <Spark data={p.retention} w={180} h={20} accent={i === 0} />
                <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)' }}>
                  {HC.fmtNum(p.views)} views · {HC.fmtNum(p.saves)} saves
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_HomeCommand });
