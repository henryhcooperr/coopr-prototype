/* global React, D1cfTopbar, D1cfSubTabs, D1cfScopedComposer, D1cfPin, MiniChart, Hatch, Textlines, TableRows */
// wf-d1cf-screens-more.jsx — the remaining 13 sub-tab screens.
// Keeps screen #1 file readable; same shell conventions.

// ─── Shared shell (identical to screens.jsx) ────────────────
function CFShell2({ active, children }) {
  return (
    <div className="wf-screen" style={{ flexDirection: 'column' }}>
      <D1cfTopbar active={active} accent={false} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}
function CFBody2({ children }) {
  return <div style={{ flex: 1, display: 'flex', minHeight: 0, background: 'var(--wf-paper)' }}>{children}</div>;
}
function CFRail2({ label, items, active, width = 188, footer }) {
  return (
    <aside style={{ width, borderRight: '1px solid var(--wf-line)', background: 'var(--wf-paper)', padding: '14px 8px 10px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
      {label && <div style={{ fontSize: 9.5, color: 'var(--wf-ink-3)', padding: '0 10px 6px', letterSpacing: '0.05em' }}>{label}</div>}
      {items.map((it, i) => {
        const isActive = (typeof active === 'number' ? i === active : it.id === active);
        return (
          <div key={it.id || i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 4, fontSize: 11.5, color: 'var(--wf-ink)', background: isActive ? 'var(--wf-paper-2)' : 'transparent', fontWeight: isActive ? 500 : 400 }}>
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
            {it.meta && <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{it.meta}</span>}
          </div>
        );
      })}
      {footer && <><div style={{ flex: 1 }} />{footer}</>}
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STUDIO · Brand voice
// ═══════════════════════════════════════════════════════════════════════════

function CF_StudioBrandVoice() {
  return (
    <CFShell2 active="studio">
      <D1cfSubTabs
        workspace="studio"
        active="Brand voice"
        right={<span className="wf-chip" style={{ fontSize: 10 }}>Edit voice</span>}
      />
      <CFBody2>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="studio" variant="bar" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 24px 20px', display: 'flex', gap: 18 }}>
            {/* Left column: voice profile */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              {/* Voice summary card */}
              <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: '18px 20px', background: 'var(--wf-paper)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--wf-ink)' }}>Your voice, distilled</span>
                  <span style={{ fontSize: 10.5, color: 'var(--wf-ink-3)' }}>learned from 147 posts · updated Apr 22</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--wf-ink)', lineHeight: 1.6, marginBottom: 14 }}>
                  You write like a <strong>working diver who respects the reader's time</strong>. Sentences run short, with one technical word per paragraph to anchor credibility. You lean on <em>near-miss storytelling</em> and the <em>rule-of-three</em> frame. You almost never use adverbs. You rarely end on a CTA — you end on an image.
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['direct', 'weathered', 'dry humor', 'technical-but-accessible', 'anti-guru', 'image-first'].map((t, i) => (
                    <span key={i} className="wf-chip" style={{ fontSize: 10.5 }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Do / Don't — side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: 14, background: 'var(--wf-paper)' }}>
                  <div style={{ fontSize: 10, color: 'var(--wf-accent)', letterSpacing: '0.05em', marginBottom: 10 }}>DO</div>
                  {[
                    'Open with a concrete image or action, not a thesis.',
                    'Use near-miss stories before rules. The rule earns its keep after.',
                    'Name specific gear/places. Specificity earns trust.',
                    'Stop at the image. Let the reader draw the line.',
                  ].map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderTop: i ? '1px solid var(--wf-line)' : 'none', fontSize: 12, color: 'var(--wf-ink)', lineHeight: 1.45 }}>
                      <span style={{ color: 'var(--wf-accent)', fontSize: 10, marginTop: 2 }}>✓</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: 14, background: 'var(--wf-paper)' }}>
                  <div style={{ fontSize: 10, color: 'var(--wf-note)', letterSpacing: '0.05em', marginBottom: 10 }}>DON'T</div>
                  {[
                    'Don\'t moralize. No "stay safe out there."',
                    'Avoid gear brand names when the story\'s the point.',
                    'No adverbs. "Quickly", "really", "actually" all cost credibility.',
                    'Don\'t stack hooks. One hook per post.',
                  ].map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderTop: i ? '1px solid var(--wf-line)' : 'none', fontSize: 12, color: 'var(--wf-ink)', lineHeight: 1.45 }}>
                      <span style={{ color: 'var(--wf-note)', fontSize: 10, marginTop: 2 }}>✕</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before/after example */}
              <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, background: 'var(--wf-paper)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--wf-paper-2)' }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--wf-ink)' }}>Rewritten in your voice</span>
                  <span style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>from a draft 2 days ago</span>
                  <span style={{ flex: 1 }} />
                  <span className="wf-chip" style={{ fontSize: 10 }}>Open thread ↗</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  <div style={{ padding: 14, borderRight: '1px solid var(--wf-line)' }}>
                    <div style={{ fontSize: 9.5, color: 'var(--wf-ink-3)', letterSpacing: '0.05em', marginBottom: 8 }}>BEFORE</div>
                    <div style={{ fontSize: 12, color: 'var(--wf-ink-2)', lineHeight: 1.55, fontStyle: 'italic' }}>
                      Safety is really important when you\u2019re diving. You should always quickly check your gear before every dive to stay safe out there!
                    </div>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 9.5, color: 'var(--wf-accent)', letterSpacing: '0.05em', marginBottom: 8 }}>AFTER</div>
                    <div style={{ fontSize: 12, color: 'var(--wf-ink)', lineHeight: 1.55 }}>
                      I watched a rental reg fail at 18 meters last month. The diver was fine. Her buddy wasn\u2019t paying attention. Check your own gear. Check your buddy\u2019s. Then check it again on the surface.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: signals & sources */}
            <aside style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
              <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--wf-ink-3)', letterSpacing: '0.05em', marginBottom: 10 }}>VOICE SIGNALS</div>
                {[
                  { label: 'Avg sentence length', value: '11 words', bar: 0.4 },
                  { label: 'Adverbs / 1k words',    value: '3.2',     bar: 0.12 },
                  { label: 'Concrete nouns / post', value: '8',       bar: 0.76 },
                  { label: 'Near-miss rate',        value: '31%',     bar: 0.62 },
                  { label: 'Posts ending on image', value: '68%',     bar: 0.68 },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '8px 0', borderTop: i ? '1px solid var(--wf-line)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--wf-ink)', marginBottom: 5 }}>
                      <span>{s.label}</span><span style={{ fontWeight: 500 }}>{s.value}</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--wf-line)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${s.bar * 100}%`, height: '100%', background: 'var(--wf-ink)' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--wf-ink-3)', letterSpacing: '0.05em', marginBottom: 10 }}>LEARNED FROM</div>
                {[
                  'Post #0042 · "The day I lost a fin"',
                  'Post #0051 · "Rental gear is a roll"',
                  'Post #0068 · "Three things my instructor said"',
                  'Post #0074 · "Why I went back to sidemount"',
                ].map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 11, color: 'var(--wf-ink-2)', borderTop: i ? '1px solid var(--wf-line)' : 'none' }}>
                    <span style={{ color: 'var(--wf-ink-3)', fontSize: 9 }}>↗</span>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p}</span>
                  </div>
                ))}
                <div style={{ marginTop: 10, fontSize: 10, color: 'var(--wf-ink-3)' }}>147 more posts · <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>see all</span></div>
              </div>
            </aside>
          </div>
        </main>
      </CFBody2>
      <D1cfPin n={1} text="Brand voice is a Studio sub-view — living, learned, editable" top={64} left={520} />
      <D1cfPin n={2} text="before/after pulled from real drafts — not fake examples" top={540} left={760} />
      <D1cfPin n={3} text="signals are measurable — this isn't vibes" top={260} left={1100} />
    </CFShell2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIENCE · Retention
// ═══════════════════════════════════════════════════════════════════════════

function CF_AudienceRetention() {
  return (
    <CFShell2 active="audience">
      <D1cfSubTabs
        workspace="audience"
        active="Retention"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Last 30 days ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Carousels ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Compare: cohort</span>
          </div>
        }
      />
      <CFBody2>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="audience" variant="bar" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Top: 3 KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Slide 4 retention',  value: '41%',   delta: '−18% vs cohort', pos: false },
                { label: 'Avg. completion',    value: '58%',   delta: '+4% vs last 30d', pos: true },
                { label: 'Hook slide (S1)',    value: '96%',   delta: 'stable', pos: true },
              ].map((m, i) => (
                <div key={i} style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10.5, color: 'var(--wf-ink-3)', letterSpacing: '0.04em', marginBottom: 6 }}>{m.label.toUpperCase()}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--wf-ink)', letterSpacing: '-0.02em' }}>{m.value}</span>
                    <span style={{ fontSize: 11, color: m.pos ? 'var(--wf-accent)' : 'var(--wf-note)', fontWeight: 500 }}>{m.delta}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Big chart: retention heatmap by post × slide */}
            <div style={{ flex: 1, border: '1px solid var(--wf-line)', borderRadius: 6, padding: 16, background: 'var(--wf-paper)', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--wf-ink)' }}>Retention heatmap · last 10 carousels × 6 slides</span>
                <span style={{ fontSize: 11, color: 'var(--wf-ink-3)' }}>darker = higher retention</span>
                <span style={{ flex: 1 }} />
                <span className="wf-chip" style={{ fontSize: 10 }}>Open in chat ↗</span>
                <span className="wf-chip" style={{ fontSize: 10 }}>Export</span>
              </div>

              {/* Heatmap grid */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, minHeight: 0, overflow: 'hidden' }}>
                {/* header */}
                <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(6, 1fr) 60px', gap: 2, fontSize: 10, color: 'var(--wf-ink-3)', marginBottom: 4 }}>
                  <span />
                  {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map(s => <span key={s} style={{ textAlign: 'center' }}>{s}</span>)}
                  <span style={{ textAlign: 'right' }}>avg</span>
                </div>
                {[
                  { post: 'The dive that…', values: [98, 88, 74, 52, 44, 42], avg: 66 },
                  { post: '#0074 · Sidemount', values: [97, 86, 72, 40, 38, 36], avg: 61 },
                  { post: '#0073 · Checklist', values: [95, 83, 68, 38, 35, 32], avg: 58 },
                  { post: '#0068 · Instructor', values: [96, 85, 70, 54, 50, 48], avg: 67 },
                  { post: '#0065 · Safety stops', values: [94, 80, 64, 36, 33, 30], avg: 56 },
                  { post: '#0058 · Panic', values: [98, 90, 78, 60, 56, 54], avg: 73 },
                  { post: '#0051 · Rental gear', values: [97, 88, 74, 64, 62, 60], avg: 74 },
                  { post: '#0046 · Currents', values: [95, 82, 66, 38, 35, 33], avg: 58 },
                  { post: '#0042 · Lost a fin', values: [99, 92, 80, 70, 66, 64], avg: 79 },
                  { post: '#0038 · Night dive', values: [93, 78, 62, 34, 31, 29], avg: 55 },
                ].map((row, ri) => (
                  <div key={ri} style={{ display: 'grid', gridTemplateColumns: '140px repeat(6, 1fr) 60px', gap: 2, marginBottom: 2 }}>
                    <span style={{ fontSize: 10.5, color: 'var(--wf-ink)', padding: '4px 6px 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.post}</span>
                    {row.values.map((v, i) => {
                      const alpha = 0.08 + (v / 100) * 0.85;
                      return (
                        <div key={i} style={{ background: `rgba(20, 30, 40, ${alpha})`, color: v > 55 ? 'white' : 'var(--wf-ink-2)', fontSize: 10, textAlign: 'center', padding: '5px 0', borderRadius: 2 }}>{v}</div>
                      );
                    })}
                    <span style={{ fontSize: 10.5, color: 'var(--wf-ink-2)', textAlign: 'right', padding: '4px 0', fontWeight: 500 }}>{row.avg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
              <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: '12px 16px', background: 'var(--wf-paper-2)' }}>
                <div style={{ fontSize: 11, color: 'var(--wf-accent)', letterSpacing: '0.05em', marginBottom: 6 }}>◉ FROM A CHAT THREAD · 3M AGO</div>
                <div style={{ fontSize: 12.5, color: 'var(--wf-ink)', lineHeight: 1.55 }}>
                  The two posts above 70% avg retention (<strong>#0042 · Lost a fin</strong> and <strong>#0051 · Rental gear</strong>) both used the <em>question → near-miss → rule</em> beat on slide 4. The three under 58% used a visual recap instead. <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Continue this thread ↗</span>
                </div>
              </div>
              <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--wf-ink-3)', letterSpacing: '0.05em', marginBottom: 8 }}>QUICK ASKS</div>
                {['Why is S4 the drop?', 'Show me the top 2 vs cohort', 'Project next post retention'].map((q, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, padding: '4px 0', fontSize: 11, color: 'var(--wf-ink-2)', borderTop: i ? '1px solid var(--wf-line)' : 'none' }}>
                    <span style={{ color: 'var(--wf-ink-3)', fontSize: 9 }}>↗</span>{q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </CFBody2>
      <D1cfPin n={1} text="heatmap is the deep view — Overview showed a summary bar chart, Retention is the real thing" top={240} left={1000} />
      <D1cfPin n={2} text="insight card pulled from a chat thread — analytics & conversation remember each other" top={680} left={780} />
    </CFShell2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIENCE · Followers
// ═══════════════════════════════════════════════════════════════════════════

function CF_AudienceFollowers() {
  const cohorts = [
    { id: 'c1', label: 'All followers',       meta: '24.8k', active: true },
    { id: 'c2', label: 'New (30d)',           meta: '+842' },
    { id: 'c3', label: 'Highly engaged',      meta: '2.1k' },
    { id: 'c4', label: 'Creators (10k+)',     meta: '67' },
    { id: 'c5', label: 'Lapsed (90d)',        meta: '304' },
    { id: 'c6', label: 'Churn risk',          meta: '118' },
  ];
  const rows = [
    { who: '@marina.k',       note: 'creator · 38k · dive safety',         first: 'Jan 12', last: '3h ago',    score: 94, flag: 'creator' },
    { who: '@seabird.jo',     note: 'dive-shop owner · Bali',              first: 'Nov 3',  last: '12m ago',   score: 88, flag: null },
    { who: '@dive.master_r',  note: 'creator · 12k · tech diving',         first: 'Feb 19', last: '7h ago',    score: 86, flag: 'creator' },
    { who: '@coldwater_cam',  note: 'commented 14x in 7d',                 first: 'Mar 8',  last: '6h ago',    score: 82, flag: null },
    { who: '@newb_diver',     note: 'open-water student · high-intent',    first: 'Apr 2',  last: '9h ago',    score: 71, flag: 'new' },
    { who: '@oceanophile',    note: 'liked every post in April',           first: 'Oct 2022', last: '2h ago',  score: 69, flag: null },
    { who: '@wrecks.and.reefs', note: 'shared 3 of your posts',            first: 'Jan 2024', last: '1d ago',  score: 64, flag: null },
    { who: '@palette.dives',  note: 'dropped off after Apr 15',            first: 'Jul 2023', last: '9d ago',  score: 38, flag: 'churn' },
  ];
  return (
    <CFShell2 active="audience">
      <D1cfSubTabs
        workspace="audience"
        active="Followers"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Sort: engagement ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Export</span>
          </div>
        }
      />
      <CFBody2>
        <CFRail2 label="COHORT" items={cohorts} active="c1" width={200} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="audience" variant="bar" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Summary line */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--wf-ink)' }}>24,812 followers</span>
              <span style={{ fontSize: 11, color: 'var(--wf-accent)' }}>+182 this week</span>
              <span style={{ fontSize: 11, color: 'var(--wf-note)' }}>−24 unfollowed</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: 'var(--wf-ink-3)' }}>showing top 8 by engagement · 2,096 more</span>
            </div>

            {/* Table */}
            <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, background: 'var(--wf-paper)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 90px 100px 60px 100px', gap: 0, padding: '8px 14px', background: 'var(--wf-paper-2)', borderBottom: '1px solid var(--wf-line)', fontSize: 10, color: 'var(--wf-ink-3)', letterSpacing: '0.04em' }}>
                <span>FOLLOWER</span>
                <span>NOTES</span>
                <span>FOLLOWED</span>
                <span>LAST SEEN</span>
                <span style={{ textAlign: 'right' }}>SCORE</span>
                <span style={{ textAlign: 'right' }}>ACTION</span>
              </div>
              {rows.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 90px 100px 60px 100px', gap: 0, padding: '10px 14px', borderBottom: i < rows.length - 1 ? '1px solid var(--wf-line)' : 'none', fontSize: 11.5, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line)' }} />
                    <span style={{ color: 'var(--wf-ink)', fontWeight: 500 }}>{r.who}</span>
                    {r.flag === 'creator' && <span style={{ fontSize: 9, color: 'var(--wf-accent)', fontWeight: 600 }}>◉</span>}
                    {r.flag === 'new' && <span style={{ fontSize: 9, color: 'var(--wf-ink-3)' }}>NEW</span>}
                    {r.flag === 'churn' && <span style={{ fontSize: 9, color: 'var(--wf-note)' }}>CHURN</span>}
                  </div>
                  <span style={{ color: 'var(--wf-ink-2)', fontSize: 11 }}>{r.note}</span>
                  <span style={{ color: 'var(--wf-ink-3)', fontSize: 10.5 }}>{r.first}</span>
                  <span style={{ color: 'var(--wf-ink-3)', fontSize: 10.5 }}>{r.last}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: r.score > 80 ? 'var(--wf-accent)' : r.score < 50 ? 'var(--wf-note)' : 'var(--wf-ink)', fontWeight: 500 }}>{r.score}</span>
                  <span style={{ textAlign: 'right' }}>
                    <span className="wf-chip" style={{ fontSize: 9.5 }}>Ask about ↗</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom: AI observation */}
            <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: '12px 16px', background: 'var(--wf-paper-2)' }}>
              <div style={{ fontSize: 10, color: 'var(--wf-accent)', letterSpacing: '0.05em', marginBottom: 6 }}>◉ PATTERN</div>
              <div style={{ fontSize: 12, color: 'var(--wf-ink)', lineHeight: 1.55 }}>
                67 creators with 10k+ followers follow you. Three of them (<span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>@marina.k</span>, <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>@dive.master_r</span>, <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>@wrecks.and.reefs</span>) engaged with your last post — a collab window. <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Draft a DM to all 3 ↗</span>
              </div>
            </div>
          </div>
        </main>
      </CFBody2>
      <D1cfPin n={1} text="cohort rail filters the table — classic structured analytics surface" top={120} left={12} />
      <D1cfPin n={2} text="'Ask about' turns any follower into a chat thread scoped to them" top={440} left={1220} />
    </CFShell2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIENCE · Segments
// ═══════════════════════════════════════════════════════════════════════════

function CF_AudienceSegments() {
  const segs = [
    { name: 'Safety-curious learners', size: '32%',  growth: '+4%', match: 'high',   blurb: 'New divers looking for trustworthy advice. High engagement on checklist & near-miss content.' },
    { name: 'Gear nerds',              size: '21%',  growth: '+1%', match: 'high',   blurb: 'Read teardowns, argue brands. Low on stories, high on technical posts.' },
    { name: 'Travel divers',           size: '18%',  growth: '+6%', match: 'medium', blurb: 'Fiji, Red Sea, Raja Ampat. Save trip posts. Convert on destination reels.' },
    { name: 'Instructor / pro',        size: '11%',  growth: 'flat', match: 'medium', blurb: 'Dive pros. Likely to reply, rarely likes. Your highest-signal critics.' },
    { name: 'Cold-water / tech',       size: '9%',   growth: '+2%', match: 'low',    blurb: 'Niche overlap. Engage with sidemount & wreck content; drop off on tropical.' },
    { name: 'Lurkers / non-engaged',   size: '9%',   growth: '−1%', match: 'low',    blurb: 'Follow but rarely interact. Watch-only on stories.' },
  ];

  return (
    <CFShell2 active="audience">
      <D1cfSubTabs
        workspace="audience"
        active="Segments"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Auto-clustered ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>+ Custom segment</span>
          </div>
        }
      />
      <CFBody2>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="audience" variant="bar" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Donut + legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'center', padding: '8px 0 12px', borderBottom: '1px solid var(--wf-line)' }}>
              {/* "donut" as stacked horizontal bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--wf-ink-3)', letterSpacing: '0.04em' }}>DISTRIBUTION · 24.8K</div>
                <div style={{ display: 'flex', height: 18, borderRadius: 3, overflow: 'hidden', border: '1px solid var(--wf-line)' }}>
                  {segs.map((s, i) => {
                    const pct = parseFloat(s.size);
                    const shades = [0.95, 0.78, 0.62, 0.48, 0.34, 0.22];
                    return <div key={i} style={{ width: `${pct}%`, background: `rgba(20, 30, 40, ${shades[i]})` }} />;
                  })}
                </div>
                <div style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>6 auto-clustered segments · updated daily</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {segs.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--wf-ink-2)' }}>
                    <span style={{ width: 9, height: 9, background: `rgba(20, 30, 40, ${[0.95,0.78,0.62,0.48,0.34,0.22][i]})`, borderRadius: 1 }} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                    <span style={{ color: 'var(--wf-ink-3)', fontSize: 10 }}>{s.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segment cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {segs.map((s, i) => (
                <div key={i} style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: 14, background: 'var(--wf-paper)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--wf-ink)' }}>{s.name}</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ fontSize: 11, color: 'var(--wf-ink-2)', fontFamily: 'monospace' }}>{s.size}</span>
                    <span style={{ fontSize: 10, color: s.growth.startsWith('+') ? 'var(--wf-accent)' : s.growth === 'flat' ? 'var(--wf-ink-3)' : 'var(--wf-note)' }}>{s.growth}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--wf-ink)', lineHeight: 1.5 }}>{s.blurb}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)', letterSpacing: '0.04em' }}>MATCH WITH YOUR CONTENT</span>
                    <span style={{ flex: 1, height: 3, background: 'var(--wf-line)', borderRadius: 2, overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: s.match === 'high' ? '82%' : s.match === 'medium' ? '54%' : '28%', background: s.match === 'high' ? 'var(--wf-accent)' : s.match === 'medium' ? 'var(--wf-ink)' : 'var(--wf-ink-3)' }} />
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--wf-ink-2)' }}>{s.match}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                    <span className="wf-chip" style={{ fontSize: 9.5 }}>Draft for segment ↗</span>
                    <span className="wf-chip" style={{ fontSize: 9.5 }}>Ask about</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody2>
      <D1cfPin n={1} text="Segments surface = structure, not bullet list. Hierarchy: distribution → cards" top={100} left={960} />
      <D1cfPin n={2} text="'Draft for segment' = the whole point. Segments feed Studio." top={620} left={1080} />
    </CFShell2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LIBRARY filter sub-tabs (Posts · Drafts · Charts · Notes · Decisions)
// All share one base component, differ by filter & empty state.
// ═══════════════════════════════════════════════════════════════════════════

function LibraryFiltered({ activeSub, tiles, summary, pin }) {
  return (
    <CFShell2 active="library">
      <D1cfSubTabs
        workspace="library"
        active={activeSub}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Sort: recent ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Grid</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>List</span>
          </div>
        }
      />
      <CFBody2>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="library" variant="bar" />
          </div>

          {/* Summary strip */}
          <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--wf-ink)' }}>{summary.title}</span>
            <span style={{ fontSize: 11, color: 'var(--wf-ink-3)' }}>{summary.meta}</span>
            <span style={{ flex: 1 }} />
            {summary.chip && <span className="wf-chip" style={{ fontSize: 10 }}>{summary.chip}</span>}
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '16px 24px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {tiles.map((t, i) => (
                <div key={i} style={{ border: t.accent ? '1px solid var(--wf-ink-2)' : '1px solid var(--wf-line)', borderRadius: 6, padding: 12, background: 'var(--wf-paper)', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 150 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="wf-tag wf-tag-panel" style={{ fontSize: 9 }}>{t.kind}</span>
                    <span style={{ flex: 1 }} />
                    {t.fromChat && <span style={{ fontSize: 9, color: 'var(--wf-accent)' }}>◉ chat</span>}
                  </div>
                  <div style={{ flex: 1, background: 'var(--wf-paper-2)', borderRadius: 3, minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.preview === 'chart' ? <MiniChart height={32} /> :
                     t.preview === 'text'  ? <Textlines lines={3} style={{ width: '82%' }} /> :
                                             <Hatch style={{ width: '75%', height: 28 }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--wf-ink)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 2 }}>{t.title}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{t.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody2>
      {pin && <D1cfPin n={1} text={pin} top={64} left={720} />}
    </CFShell2>
  );
}

function CF_LibraryPosts() {
  return <LibraryFiltered
    activeSub="Posts"
    summary={{ title: '143 published posts', meta: 'last 90 days · avg reach 8.2k', chip: '+ New post ↗' }}
    tiles={[
      { kind: 'CAROUSEL', preview: 'hatch', title: 'Why I stopped giving gear advice',    meta: '4.1k reach · Apr 20', fromChat: false },
      { kind: 'POST',     preview: 'hatch', title: 'The Bali descent log',                 meta: '12.4k reach · Apr 17', fromChat: false },
      { kind: 'CAROUSEL', preview: 'hatch', title: 'Three things my instructor said',      meta: '8.9k reach · Apr 14', fromChat: true },
      { kind: 'STORY',    preview: 'hatch', title: 'Night dive · the first panic',          meta: '22k views · Apr 11', fromChat: false },
      { kind: 'POST',     preview: 'hatch', title: 'Sidemount vs backmount (again)',        meta: '6.2k reach · Apr 8',  fromChat: false },
      { kind: 'CAROUSEL', preview: 'hatch', title: 'Rental reg failure · a story',          meta: '14.8k reach · Apr 5', fromChat: true },
      { kind: 'POST',     preview: 'hatch', title: 'Decompression in plain words',          meta: '9.1k reach · Apr 2',  fromChat: false },
      { kind: 'CAROUSEL', preview: 'hatch', title: 'The day I lost a fin',                  meta: '19.2k reach · Mar 29', fromChat: false },
      { kind: 'STORY',    preview: 'hatch', title: 'Fiji · The wreck at 30m',                meta: '18k views · Mar 26', fromChat: false },
      { kind: 'POST',     preview: 'hatch', title: 'Why I went back to sidemount',           meta: '7.4k reach · Mar 23', fromChat: true },
      { kind: 'CAROUSEL', preview: 'hatch', title: 'Rule-of-three, visual edition',          meta: '5.8k reach · Mar 20', fromChat: false },
      { kind: 'POST',     preview: 'hatch', title: 'The cheapest dive computer worth buying', meta: '11.3k reach · Mar 17', fromChat: false },
    ]}
    pin="Posts = published-only filter; each tile shows reach, not status"
  />;
}

function CF_LibraryDraftsList() {
  return <LibraryFiltered
    activeSub="Drafts"
    summary={{ title: '27 drafts', meta: '3 ready · 2 scheduled · 22 in progress', chip: '+ New draft ↗' }}
    tiles={[
      { kind: 'CAROUSEL', preview: 'hatch', title: 'The dive that almost went wrong',      meta: 'Ready · Fri 7:10a', fromChat: true, accent: true },
      { kind: 'POST',     preview: 'hatch', title: 'Decompression for impatient divers',   meta: 'Draft · 2d',         fromChat: false },
      { kind: 'CAROUSEL', preview: 'hatch', title: 'Why I stopped giving gear advice',     meta: 'Needs a hook · Tue', fromChat: false },
      { kind: 'STORY',    preview: 'hatch', title: 'Fiji · Part 1 · The descent',           meta: 'Scheduled · Sat 6am', fromChat: false },
      { kind: 'STORY',    preview: 'hatch', title: 'Fiji · Part 2 · The wreck',             meta: 'Draft · Mon',         fromChat: false },
      { kind: 'CAROUSEL', preview: 'hatch', title: 'Rule of three, visual edition',         meta: 'Draft · Sun',         fromChat: true },
      { kind: 'POST',     preview: 'hatch', title: 'Reply: @marina.k',                      meta: 'Ready to post',       fromChat: true },
      { kind: 'POST',     preview: 'hatch', title: 'Gear teardown · Suunto D5',             meta: 'Needs images',        fromChat: false },
      { kind: 'CAROUSEL', preview: 'hatch', title: 'Night dive checklist',                  meta: 'Scheduled · Tue 7am', fromChat: true },
      { kind: 'POST',     preview: 'hatch', title: 'Why I trust older regulators',          meta: 'Draft · Apr 15',      fromChat: false },
      { kind: 'CAROUSEL', preview: 'hatch', title: 'Sidemount in current',                   meta: 'Draft · Apr 12',      fromChat: false },
      { kind: 'POST',     preview: 'hatch', title: 'Near-miss #3 · the boat',                meta: 'Draft · Apr 10',      fromChat: true },
    ]}
    pin="Drafts (Library) = read-only browse; clicking opens Studio · Drafts for edit"
  />;
}

function CF_LibraryCharts() {
  return <LibraryFiltered
    activeSub="Charts"
    summary={{ title: '34 saved charts', meta: '22 from chat · 12 pinned from dashboards', chip: '+ New chart ↗' }}
    tiles={[
      { kind: 'CHART', preview: 'chart', title: 'Retention by slide · safety series', meta: '7 posts · Apr 24', fromChat: true, accent: true },
      { kind: 'CHART', preview: 'chart', title: 'Posting-time vs retention',          meta: '90d window',       fromChat: true },
      { kind: 'CHART', preview: 'chart', title: 'Follower growth · last 180d',        meta: 'Apr 24',           fromChat: false },
      { kind: 'CHART', preview: 'chart', title: 'Reach by format · carousel vs post', meta: 'Apr 20',           fromChat: true },
      { kind: 'CHART', preview: 'chart', title: 'Comment sentiment by cluster',       meta: 'Apr 18',           fromChat: true },
      { kind: 'CHART', preview: 'chart', title: 'Save rate · top 25 posts',           meta: 'Apr 15',           fromChat: false },
      { kind: 'CHART', preview: 'chart', title: 'Segment growth · Q1 vs Q2',          meta: 'Apr 12',           fromChat: true },
      { kind: 'CHART', preview: 'chart', title: 'Retention heatmap · 10 carousels',   meta: 'Apr 10',           fromChat: true },
      { kind: 'CHART', preview: 'chart', title: 'DM reply rate',                       meta: 'Apr 8',            fromChat: false },
      { kind: 'CHART', preview: 'chart', title: 'Mentions → followers conversion',    meta: 'Apr 5',            fromChat: true },
      { kind: 'CHART', preview: 'chart', title: 'Story completion by segment',        meta: 'Apr 2',            fromChat: false },
      { kind: 'CHART', preview: 'chart', title: 'Hook-slide retention · year',        meta: 'Mar 29',           fromChat: true },
    ]}
    pin="Charts = visual artifacts, mostly from chat. Each stays tied to the thread that made it."
  />;
}

function CF_LibraryNotes() {
  return <LibraryFiltered
    activeSub="Notes"
    summary={{ title: '89 notes', meta: '38 voice · 51 text · tagged across 14 topics', chip: '+ New note ↗' }}
    tiles={[
      { kind: 'NOTE', preview: 'text', title: 'Voice memo · "open with a question?"',       meta: '38s · Mon',   fromChat: false },
      { kind: 'NOTE', preview: 'text', title: 'Brand voice · near-miss storytelling',        meta: 'Apr 19',      fromChat: true, accent: true },
      { kind: 'NOTE', preview: 'text', title: 'Dive-shop interview · Kuta',                  meta: '12m · Apr 17', fromChat: false },
      { kind: 'NOTE', preview: 'text', title: 'Reply template · gear brand questions',       meta: 'Apr 14',      fromChat: true },
      { kind: 'NOTE', preview: 'text', title: 'Follow-up ideas · @marina.k thread',          meta: 'Apr 12',      fromChat: true },
      { kind: 'NOTE', preview: 'text', title: 'Voice memo · between dives at Tulamben',      meta: '1m 12s · Apr 10', fromChat: false },
      { kind: 'NOTE', preview: 'text', title: 'Post ideas · monsoon season',                  meta: 'Apr 8',       fromChat: true },
      { kind: 'NOTE', preview: 'text', title: 'Instructor quote · "buoyancy first"',          meta: 'Apr 5',       fromChat: false },
      { kind: 'NOTE', preview: 'text', title: 'Voice memo · gear checklist draft',            meta: '2m 04s · Apr 3', fromChat: false },
      { kind: 'NOTE', preview: 'text', title: 'Research · wreck dive rules by country',       meta: 'Apr 1',       fromChat: true },
      { kind: 'NOTE', preview: 'text', title: 'Reply idea · @coldwater_cam',                  meta: 'Mar 29',      fromChat: true },
      { kind: 'NOTE', preview: 'text', title: 'Draft outline · Red Sea trip series',          meta: 'Mar 26',      fromChat: false },
    ]}
    pin="Notes = raw material. Voice + text. Every note can seed a thread via chat."
  />;
}

function CF_LibraryDecisions() {
  return <LibraryFiltered
    activeSub="Decisions"
    summary={{ title: '14 decisions', meta: 'editorial choices you\'ve made & kept', chip: '+ Record decision' }}
    tiles={[
      { kind: 'DECISION', preview: 'text', title: 'Drop the gear-brand ambiguity',             meta: 'Apr 22 · 3 threads', fromChat: true, accent: true },
      { kind: 'DECISION', preview: 'text', title: 'Kill the "gear pro" angle',                 meta: 'Apr 18',             fromChat: true },
      { kind: 'DECISION', preview: 'text', title: 'Post carousels on Fri 7a, stories Sat 6a',  meta: 'Apr 14',             fromChat: true },
      { kind: 'DECISION', preview: 'text', title: 'Near-miss stories > tip-list posts',         meta: 'Apr 10',             fromChat: true },
      { kind: 'DECISION', preview: 'text', title: 'No more "stay safe out there" closers',      meta: 'Apr 8',              fromChat: true },
      { kind: 'DECISION', preview: 'text', title: 'Reply to creators within 24h, others w/in 72h', meta: 'Apr 4',            fromChat: false },
      { kind: 'DECISION', preview: 'text', title: 'Carousels over posts for safety content',    meta: 'Mar 30',             fromChat: true },
      { kind: 'DECISION', preview: 'text', title: 'Stop cross-posting stories to reels',         meta: 'Mar 26',             fromChat: false },
      { kind: 'DECISION', preview: 'text', title: 'Use real gear names only when it\'s the point', meta: 'Mar 22',          fromChat: true },
      { kind: 'DECISION', preview: 'text', title: 'Never open on a thesis — open on an image',  meta: 'Mar 18',             fromChat: true },
      { kind: 'DECISION', preview: 'text', title: 'One hook per post. No stacking.',             meta: 'Mar 14',             fromChat: true },
      { kind: 'DECISION', preview: 'text', title: 'Sidemount content Tues/Thurs only',          meta: 'Mar 10',             fromChat: false },
    ]}
    pin="Decisions = the editorial memory. This is unusual for creator tools — it's what makes the voice stay consistent."
  />;
}

// ═══════════════════════════════════════════════════════════════════════════
// PULSE · Creator niche / Your audience / Mentions
// ═══════════════════════════════════════════════════════════════════════════

function CF_PulseNiche() {
  const stories = [
    { who: '@scubadive.daily',  size: '+4.2k', delta: '7d',  headline: 'Posted a near-miss carousel · 12k saves in 48h', preview: 'carousel' },
    { who: '@reefhunter',       size: '+1.8k', delta: '7d',  headline: 'Switched to rule-of-three hook frames · retention up 22%', preview: 'chart' },
    { who: '@oceanographer.ms', size: 'flat',  delta: '7d',  headline: 'Ran a 5-part gear-maintenance series · steady growth', preview: 'carousel' },
    { who: '@divebrief',        size: '+6.1k', delta: '30d', headline: 'Added short-form reels · 3× previous reach', preview: 'reel' },
    { who: '@bubbles.and.blue', size: '−200',  delta: '7d',  headline: 'Drops in engagement after brand sponsorship posts', preview: 'chart' },
  ];
  return (
    <CFShell2 active="pulse">
      <D1cfSubTabs
        workspace="pulse"
        active="Creator niche"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Dive-safety ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>50 creators tracked</span>
          </div>
        }
      />
      <CFBody2>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 0 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 820, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Summary row */}
              <div style={{ padding: '0 0 18px', borderBottom: '1px solid var(--wf-line)', marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--wf-accent)', letterSpacing: '0.06em', marginBottom: 6 }}>◉ THIS WEEK IN YOUR NICHE</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--wf-ink)', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 8 }}>
                  Near-miss storytelling is the frame winning in dive-safety content right now — 8 of the top 50 creators shifted to it in the last 14 days.
                </div>
                <div style={{ fontSize: 12, color: 'var(--wf-ink-2)', lineHeight: 1.5 }}>
                  You&apos;ve been doing this for months. Two creators (<span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>@marina.k</span>, <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>@dive.master_r</span>) cited your posts in their threads.
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <span className="wf-chip" style={{ fontSize: 10 }}>Draft a lead on this ↗</span>
                  <span className="wf-chip" style={{ fontSize: 10 }}>Open in chat</span>
                </div>
              </div>

              {stories.map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16, padding: '14px 0', borderBottom: i < stories.length - 1 ? '1px solid var(--wf-line)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5 }}>
                      <span style={{ color: 'var(--wf-ink)', fontWeight: 500 }}>{s.who}</span>
                      <span style={{ color: s.size.startsWith('+') ? 'var(--wf-accent)' : s.size === 'flat' ? 'var(--wf-ink-3)' : 'var(--wf-note)' }}>{s.size}</span>
                      <span style={{ color: 'var(--wf-ink-3)' }}>· {s.delta}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--wf-ink)', lineHeight: 1.35 }}>{s.headline}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      <span className="wf-chip" style={{ fontSize: 9.5 }}>Open post</span>
                      <span className="wf-chip" style={{ fontSize: 9.5 }}>Ask about ↗</span>
                      <span className="wf-chip" style={{ fontSize: 9.5 }}>Add to watchlist</span>
                    </div>
                  </div>
                  <div style={{ background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line)', borderRadius: 4, minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.preview === 'chart' ? <MiniChart height={28} /> : <Hatch style={{ width: '70%', height: 24 }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody2>
      <D1cfPin n={1} text="Creator niche = tracked creators in your genre — not trending news" top={100} left={880} />
      <D1cfPin n={2} text="lead insight at top, then per-creator stories" top={220} left={1080} />
    </CFShell2>
  );
}

function CF_PulseYourAudience() {
  return (
    <CFShell2 active="pulse">
      <D1cfSubTabs
        workspace="pulse"
        active="Your audience"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Last 7 days ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Unseen (8)</span>
          </div>
        }
      />
      <CFBody2>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 0 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 820, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Lead */}
              <div style={{ padding: '0 0 18px', borderBottom: '1px solid var(--wf-line)', marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--wf-accent)', letterSpacing: '0.06em', marginBottom: 6 }}>◉ YOUR AUDIENCE · LAST 7 DAYS</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--wf-ink)', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 8 }}>
                  3 of your top-50 followers started asking about regulators — a topical window.
                </div>
                <div style={{ fontSize: 12, color: 'var(--wf-ink-2)', lineHeight: 1.5 }}>
                  @marina.k, @seabird.jo, and @dive.master_r each posted or commented about reg maintenance in the last 72 hours. Matches the gear-teardown draft you have in Library.
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <span className="wf-chip" style={{ fontSize: 10 }}>Open that draft ↗</span>
                  <span className="wf-chip" style={{ fontSize: 10 }}>Draft a DM to all 3</span>
                </div>
              </div>

              {[
                { tag: 'SEGMENT SHIFT',     who: 'Safety-curious learners',  text: 'Engagement on checklist content rose 34% this week. This segment is responsive — tighten cadence.', preview: 'chart' },
                { tag: 'NEW ENGAGED',       who: '@surge.diver',             text: 'First-follow Tuesday · already commented on 6 posts. High-signal new follower.', preview: 'avatar' },
                { tag: 'MENTION CLUSTER',   who: 'Bali dive-shop scene',     text: '5 accounts in Bali tagged you in gear-rental threads. Possible local collab lead.', preview: 'avatar' },
                { tag: 'LAPSED · RETURNED', who: '@reeflife_al',              text: 'Went quiet for 6 weeks, then liked 3 posts today. Worth a reply to their last comment.', preview: 'avatar' },
                { tag: 'RETENTION DROP',    who: 'Travel divers',             text: 'Save-rate on travel posts dropped 12% this week. May need a different angle.', preview: 'chart' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16, padding: '14px 0', borderBottom: i < 4 ? '1px solid var(--wf-line)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 9.5, color: 'var(--wf-ink-3)', letterSpacing: '0.06em' }}>{s.tag}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--wf-ink)', lineHeight: 1.35 }}>{s.who}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--wf-ink-2)', lineHeight: 1.5 }}>{s.text}</div>
                  </div>
                  <div style={{ background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line)', borderRadius: 4, minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.preview === 'chart' ? <MiniChart height={28} /> : <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--wf-paper)', border: '1px solid var(--wf-line)' }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody2>
      <D1cfPin n={1} text="Your audience = audience-specific signal. Creator niche is competitive; this is yours." top={100} left={880} />
    </CFShell2>
  );
}

function CF_PulseMentions() {
  const mentions = [
    { who: '@marina.k',       kind: 'TAG',       when: '12m ago',  ctx: 'Thread about rental regulator reliability · 184 likes', sentiment: 'positive', replied: false, featured: true },
    { who: '@seabird.jo',     kind: 'REPLY',     when: '1h ago',   ctx: 'Replied to your safety carousel: "Best checklist I\'ve seen"', sentiment: 'positive', replied: false },
    { who: '@dive.master_r',  kind: 'REPOST',    when: '3h ago',   ctx: 'Reshared your "Three things my instructor said"', sentiment: 'positive', replied: true },
    { who: '@coldwater_cam',  kind: 'QUOTE',     when: '4h ago',   ctx: '"This is how you talk about safety without being preachy."', sentiment: 'positive', replied: false },
    { who: '@gearbag.dave',   kind: 'TAG',       when: '6h ago',   ctx: 'Tagged you in a gear-teardown callout thread', sentiment: 'neutral', replied: false },
    { who: '@newb_diver',     kind: 'REPLY',     when: '8h ago',   ctx: 'Asked a follow-up about surface marker buoy use', sentiment: 'question', replied: false },
    { who: '@wrecks.and.reefs', kind: 'MENTION', when: '12h ago',  ctx: 'Mentioned you in a "who to follow" post (47 likes)', sentiment: 'positive', replied: true },
    { who: '@oceanophile',    kind: 'REPLY',     when: '1d ago',    ctx: '"Tell us the brand. We know you won\'t but tell us anyway 😂"', sentiment: 'positive', replied: false },
  ];
  return (
    <CFShell2 active="pulse">
      <D1cfSubTabs
        workspace="pulse"
        active="Mentions"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>All types ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Unreplied (6)</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Last 24h ▾</span>
          </div>
        }
      />
      <CFBody2>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 0 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 820, display: 'flex', flexDirection: 'column' }}>
              {/* Summary */}
              <div style={{ padding: '0 0 14px', borderBottom: '1px solid var(--wf-line)', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--wf-ink)' }}>42 mentions today</span>
                  <span style={{ fontSize: 11, color: 'var(--wf-accent)' }}>sentiment +.71</span>
                  <span style={{ fontSize: 11, color: 'var(--wf-note)' }}>6 unreplied</span>
                  <span style={{ flex: 1 }} />
                  <span className="wf-chip" style={{ fontSize: 10 }}>Draft replies for all unreplied ↗</span>
                </div>
              </div>

              {/* Featured mention */}
              {mentions.filter(m => m.featured).map((m, i) => (
                <div key={i} style={{ border: '1px solid var(--wf-ink-2)', borderRadius: 6, padding: 14, background: 'var(--wf-paper)', marginBottom: 14, display: 'flex', gap: 12 }}>
                  <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--wf-ink)' }}>{m.who}</span>
                      <span style={{ fontSize: 9.5, color: 'var(--wf-accent)', letterSpacing: '0.05em' }}>{m.kind}</span>
                      <span style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>{m.when}</span>
                      <span style={{ flex: 1 }} />
                      <span style={{ fontSize: 9.5, color: 'var(--wf-accent)', fontWeight: 600 }}>◉ HIGH SIGNAL</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--wf-ink)', lineHeight: 1.45, marginBottom: 8 }}>{m.ctx}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className="wf-chip" style={{ fontSize: 10 }}>Open thread ↗</span>
                      <span className="wf-chip" style={{ fontSize: 10 }}>Draft a reply</span>
                      <span className="wf-chip" style={{ fontSize: 10 }}>Save to Library</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {mentions.filter(m => !m.featured).map((m, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--wf-line)' : 'none' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line)', flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--wf-ink)' }}>{m.who}</span>
                        <span style={{ fontSize: 9, color: 'var(--wf-ink-3)', letterSpacing: '0.05em' }}>{m.kind}</span>
                        <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{m.when}</span>
                        {m.replied && <span style={{ fontSize: 9, color: 'var(--wf-ink-3)' }}>✓ replied</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--wf-ink)', lineHeight: 1.45 }}>{m.ctx}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'flex-start', marginTop: 2 }}>
                      {!m.replied && <span className="wf-chip" style={{ fontSize: 9.5 }}>Reply</span>}
                      <span className="wf-chip" style={{ fontSize: 9.5 }}>Draft from</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </CFBody2>
      <D1cfPin n={1} text="Mentions = filtered Pulse view, tuned for reply workflow" top={64} left={720} />
      <D1cfPin n={2} text="high-signal mention pinned up top, rest as a dense list" top={240} left={1080} />
    </CFShell2>
  );
}

Object.assign(window, {
  CF_StudioBrandVoice,
  CF_AudienceRetention,
  CF_AudienceFollowers,
  CF_AudienceSegments,
  CF_LibraryPosts,
  CF_LibraryDraftsList,
  CF_LibraryCharts,
  CF_LibraryNotes,
  CF_LibraryDecisions,
  CF_PulseNiche,
  CF_PulseYourAudience,
  CF_PulseMentions,
});
