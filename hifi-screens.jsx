/* global React, HfTopbar, HfSubtabs, HfRail, HfComposerBar, HfComposerHero, HfPillComposer, HfStat, HfDelta */
/* global HfRetentionChart, HfCommentsBars, HfFollowerArea, HfHeatStrip, FreshnessPill */
// hifi-screens.jsx — round 2 fidelity loop.
// Pulse rebuilt as editorial broadsheet. Audience uses real charts. Type system upgraded.

// ─── 1. Studio · Threads (landing) ──────────────────────────
function HF_StudioThreads() {
  const recent = [
    { title: 'Why dive-safety retention dropped at min 3', when: '12 min',  preview: 'Hooks above 1.8s lose 14% by minute 3 across the last six primers.', kind: '2 charts · 1 draft' },
    { title: 'Hook lines for the Fiji wreck series',         when: '1 hr',    preview: '12 openers ranked against your top-quartile hooks from Q1.',          kind: 'list · saved' },
    { title: 'Reply ideas for @marina.k thread',             when: 'Yesterday', preview: 'Three angles — none defensive. Truk voice notes work here.',         kind: '3 drafts' },
    { title: 'Repurpose post 0042 → carousel',               when: 'Yesterday', preview: '7 panels. Pulled the underwater stills from Sunday.',                kind: 'carousel' },
  ];
  return (
    <div className="hf hf-shell">
      <HfTopbar active="studio" />
      <HfSubtabs workspace="studio" active="Threads" />
      <div className="hf-body">
        <HfRail workspace="studio" active="threads" />
        <main className="hf-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 32px 24px', overflow: 'hidden' }}>
          {/* Hero — date stamp + serif greeting */}
          <div style={{ marginBottom: 28, textAlign: 'center', maxWidth: 760 }}>
            <div className="hf-byline" style={{ marginBottom: 14 }}>WED · APR 24 · 09:42 · WAYANAD, 2M</div>
            <div className="hf-headline" style={{ fontSize: 44, marginBottom: 12 }}>
              What are we making, <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Henry?</span>
            </div>
            <div className="hf-deck" style={{ fontSize: 17, lineHeight: 1.45 }}>
              A draft, a chart, a reply — anything you start here lands in the Library.
            </div>
          </div>

          <HfComposerHero
            workspace="studio"
            suggestions={[
              'Three hook variants for Fiji',
              'Why did 0042 outperform 0041?',
              'Pull retention by hook length',
              'Schedule next week from drafts',
            ]}
          />

          {/* Recent threads — newspaper-table style */}
          <div style={{ marginTop: 56, width: '100%', maxWidth: 880 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--fg-primary)' }}>
              <span className="hf-byline">RECENT THREADS · {recent.length}</span>
              <span style={{ fontSize: 12, color: 'var(--fg-secondary)', fontFamily: 'var(--font-mono)' }}>VIEW ALL →</span>
            </div>
            <div>
              {recent.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 130px', gap: 18, padding: '16px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'baseline' }}>
                  <span className="hf-byline hf-num" style={{ paddingTop: 2 }}>{r.when}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.01em', marginBottom: 4 }}>{r.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{r.preview}</div>
                  </div>
                  <span className="hf-tag hf-tag-accent" style={{ justifySelf: 'end' }}>{r.kind}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── 2. Audience · Overview ─────────────────────────────────
function HF_AudienceOverview() {
  return (
    <div className="hf hf-shell" style={{ position: 'relative' }}>
      <HfTopbar active="audience" />
      <HfSubtabs workspace="audience" active="Overview" right={
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="hf-tag">Last 30 days</span>
          <span className="hf-tag">All series</span>
        </div>
      } />
      <div className="hf-body">
        <HfRail workspace="audience" active="overview" />
        <main className="hf-content" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HfComposerBar workspace="audience" />

          {/* KPI strip — minimalist, strong type */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--fg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
            <KpiCell label="Followers"        value="12,438" delta={3.2}  ds="30d" />
            <KpiCell label="Avg retention"    value="52%"    delta={-4.1} ds="30d" warning />
            <KpiCell label="Comments / post"  value="38"     delta={11.8} ds="30d" />
            <KpiCell label="Reply rate"       value="64%"    delta={2.4}  ds="30d" last />
          </div>

          {/* Hero chart — full retention curve with annotation */}
          <div className="hf-card" style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24, padding: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="hf-byline">FIG. 01 · RETENTION CURVE</span>
                <span className="hf-byline">N = 12 POSTS · 30D</span>
              </div>
              <div className="hf-headline" style={{ fontSize: 22, marginBottom: 4, marginTop: 4 }}>
                Where viewers leave the safety primers
              </div>
              <div className="hf-deck" style={{ fontSize: 13.5, marginBottom: 8 }}>
                The drop at 0:03 lines up with the hook ending. Top-quartile posts open faster.
              </div>
              <HfRetentionChart width={620} height={240} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 14, borderLeft: '1px solid var(--border-subtle)', paddingLeft: 20 }}>
              <LegendRow color="var(--accent-primary)" thick label="This batch" sub="last 12 posts · avg" />
              <LegendRow color="var(--fg-tertiary)" dashed label="Your benchmark" sub="rolling 90-day" />
              <LegendRow color="var(--tone-success-bg)" band label="Top-quartile band" sub="creators in your niche" />
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
              <div>
                <div className="hf-byline" style={{ marginBottom: 6 }}>FINDING</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.4, color: 'var(--fg-primary)', fontWeight: 500 }}>
                  Trim the hook to <span style={{ fontStyle: 'italic' }}>under 1.4 seconds</span> and you gain ~9% by minute three.
                </div>
              </div>
              <button className="hf-btn hf-btn-secondary hf-btn-sm" style={{ alignSelf: 'flex-start' }}>Open in thread →</button>
            </div>
          </div>

          {/* Bottom row — three smaller charts, all real */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
            <ChartCard title="Comments by topic" eyebrow="FIG. 02" sub="Safety dominates · 30d">
              <HfCommentsBars width={340} height={170} />
            </ChartCard>
            <ChartCard title="Follower velocity" eyebrow="FIG. 03" sub="Twelve weeks · weekly net">
              <HfFollowerArea width={340} height={170} />
            </ChartCard>
            <ChartCard title="Hook length × retention" eyebrow="FIG. 04" sub="Each cell = a post · ↓ darker is better">
              <HfHeatStrip width={340} height={120} />
            </ChartCard>
          </div>
        </main>
      </div>
      <HfPillComposer scope="overview" />
    </div>
  );
}

function KpiCell({ label, value, delta, ds, warning, last }) {
  const positive = delta > 0;
  return (
    <div style={{ padding: '20px 24px', borderRight: last ? 'none' : '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="hf-byline">{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="hf-num" style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
        <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: warning ? 'var(--tone-danger)' : 'var(--fg-secondary)', fontWeight: 500 }}>
          {positive ? '↑' : '↓'} {Math.abs(delta)}% <span style={{ color: 'var(--fg-tertiary)' }}>· {ds}</span>
        </span>
      </div>
    </div>
  );
}

function LegendRow({ color, label, sub, thick, dashed, band }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ flexShrink: 0, marginTop: 7, width: 18, height: thick ? 3 : (band ? 10 : 1), borderTop: dashed ? `1.5px dashed ${color}` : 'none', background: !dashed ? color : 'transparent', borderRadius: band ? 1 : 0 }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)' }}>{label}</div>
        <div className="hf-byline" style={{ fontSize: 10, marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, eyebrow, sub, children }) {
  return (
    <div className="hf-card" style={{ display: 'flex', flexDirection: 'column', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span className="hf-byline">{eyebrow}</span>
      </div>
      <div className="hf-headline" style={{ fontSize: 16, marginTop: 4 }}>{title}</div>
      <div className="hf-deck" style={{ fontSize: 12, marginBottom: 8 }}>{sub}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

// ─── 3. Library · All ───────────────────────────────────────
function HF_LibraryAll() {
  const items = [
    { kind: 'POST',     title: 'How buoyancy controls every safety call',           series: 'Safety primers', when: 'Apr 22', stats: '12.4k · 64% ret', chat: true },
    { kind: 'CHART',    title: 'Retention by hook length · Q1',                     series: '—',              when: 'Apr 21', stats: '4 mentions',     chat: true },
    { kind: 'DRAFT',    title: 'Truk Lagoon · why this wreck still matters',        series: 'Fiji wrecks',    when: 'Apr 20', stats: '3 versions',     chat: true },
    { kind: 'NOTE',     title: 'Voice memo · open with the silence shot',           series: '—',              when: 'Apr 19', stats: '1:42',           chat: false },
    { kind: 'POST',     title: 'A tank check that has saved my life four times',    series: 'Safety primers', when: 'Apr 17', stats: '18.2k · 71% ret', chat: false },
    { kind: 'DECISION', title: 'No more sponsor reads in safety primers',           series: '—',              when: 'Apr 16', stats: 'editorial',      chat: false },
    { kind: 'CHART',    title: 'Comments-per-post by series · 90d',                 series: '—',              when: 'Apr 15', stats: '2 mentions',     chat: true },
    { kind: 'POST',     title: 'The reef I keep coming back to',                    series: 'Field journal',  when: 'Apr 14', stats: '8.9k · 58% ret',  chat: false },
    { kind: 'DRAFT',    title: 'Reply to @marina.k — three angles',                 series: '—',              when: 'Apr 13', stats: '3 versions',     chat: true },
    { kind: 'NOTE',     title: 'Hook list · cold-open candidates',                  series: 'Fiji wrecks',    when: 'Apr 12', stats: '12 lines',       chat: true },
  ];

  const kindStyles = {
    POST:     { bg: 'var(--surface-2)',     fg: 'var(--fg-primary)' },
    CHART:    { bg: 'var(--accent-soft)',   fg: 'var(--accent-primary-press)' },
    DRAFT:    { bg: 'var(--tone-warning-bg)', fg: 'var(--tone-warning)' },
    NOTE:     { bg: 'var(--tone-info-bg)',   fg: 'var(--tone-info)' },
    DECISION: { bg: 'var(--tone-success-bg)', fg: 'var(--tone-success)' },
  };

  return (
    <div className="hf hf-shell" style={{ position: 'relative' }}>
      <HfTopbar active="library" />
      <HfSubtabs workspace="library" active="All" right={
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="hf-tag">Sort · recent</span>
          <span className="hf-tag">Filter</span>
        </div>
      } />
      <div className="hf-body">
        <HfRail workspace="library" active="all" />
        <main className="hf-content" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HfComposerBar workspace="library" />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--fg-primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 200px 100px 140px 30px', gap: 14, padding: '10px 4px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
              <span className="hf-byline">KIND</span>
              <span className="hf-byline">TITLE</span>
              <span className="hf-byline">SERIES</span>
              <span className="hf-byline">UPDATED</span>
              <span className="hf-byline">STATS</span>
              <span></span>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {items.map((it, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 200px 100px 140px 30px', gap: 14, padding: '14px 4px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, padding: '3px 7px', borderRadius: 'var(--radius-sm)', background: kindStyles[it.kind].bg, color: kindStyles[it.kind].fg, justifySelf: 'start', letterSpacing: '0.04em' }}>{it.kind}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>{it.title}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--fg-secondary)' }}>{it.series}</span>
                  <span className="hf-num" style={{ color: 'var(--fg-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{it.when}</span>
                  <span className="hf-num" style={{ color: 'var(--fg-tertiary)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>{it.stats}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: it.chat ? 'var(--accent-soft)' : 'transparent', color: it.chat ? 'var(--accent-primary-press)' : 'transparent', fontSize: 10, fontWeight: 700 }}>◉</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <HfPillComposer scope="all artifacts" />
    </div>
  );
}

// ─── 4. Pulse · For you — EDITORIAL BROADSHEET ──────────────
function HF_PulseForYou() {
  return (
    <HfShell workspace="intel" subtab="Trends" subtabRight={<>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>23 STORIES</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>DISPATCH №&nbsp;142</span>
        <FreshnessPill at="2m ago" state="fresh" />
      </>}>
        <main className="hf-content" style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 0 }}>
          <div style={{ maxWidth: 1040, margin: '0 auto', padding: '20px 32px 32px' }}>
            {/* Masthead */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '3px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', padding: '12px 0', marginBottom: 20 }}>
              <span className="hf-byline">PULSE · TRENDS · DISPATCH №&nbsp;142</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)' }}>Signal, not summary.</span>
              <span className="hf-byline">WED · APR 24 · 09:42</span>
            </div>

            {/* Lead story — large, with companion image-block */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, paddingBottom: 24, borderBottom: '1px solid var(--border-default)' }}>
              <div>
                <div className="hf-byline" style={{ marginBottom: 10 }}>LEAD · AUDIENCE SIGNAL</div>
                <div className="hf-headline" style={{ fontSize: 38, marginBottom: 14 }}>
                  142 of your followers commented on safety content this week.
                </div>
                <div className="hf-deck" style={{ fontSize: 17, lineHeight: 1.45, marginBottom: 14 }}>
                  Up from 84 the week before. The tank-check post seeded most of it — three new safety-curious clusters formed, and one is reading every primer back to <span style={{ fontStyle: 'italic' }}>0019</span>.
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.55, color: 'var(--fg-primary)' }} className="hf-dropcap">
                  These aren't drive-bys. The median commenter on this cluster has watched four of your last six posts and is replying with technical follow-ups — depth limits, gas mixes, redundancy. Worth a thread; you have voice notes from Truk that fit.
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center' }}>
                  <button className="hf-btn hf-btn-primary hf-btn-sm">Draft a reply →</button>
                  <button className="hf-btn hf-btn-ghost hf-btn-sm">Open in Audience</button>
                  <span style={{ flex: 1 }} />
                  <span className="hf-byline">2H AGO · 3 CLUSTERS</span>
                </div>
              </div>

              {/* Companion — stat block + mini chart */}
              <aside style={{ background: 'var(--fg-primary)', color: 'var(--surface-1)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.08em', color: 'var(--fg-tertiary)', textTransform: 'uppercase' }}>FIGURE · COMMENTS / WK</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-serif)', fontSize: 64, fontWeight: 600, lineHeight: 0.9, color: 'var(--surface-1)', letterSpacing: '-0.025em' }}>142</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-primary)' }}>↑ 69%</span>
                </div>
                <svg width="280" height="80" style={{ marginTop: 4 }}>
                  {[34, 28, 42, 38, 51, 48, 56, 52, 64, 71, 84, 142].map((v, i, a) => {
                    const x = 4 + (i / (a.length - 1)) * 272;
                    const y = 76 - (v / 142) * 68;
                    return <circle key={i} cx={x} cy={y} r="2" fill={i === a.length - 1 ? 'var(--accent-primary)' : 'var(--surface-2)'} opacity={i === a.length - 1 ? 1 : 0.7} />;
                  })}
                  <polyline
                    points={[34, 28, 42, 38, 51, 48, 56, 52, 64, 71, 84, 142].map((v, i, a) => {
                      const x = 4 + (i / (a.length - 1)) * 272;
                      const y = 76 - (v / 142) * 68;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none" stroke="var(--surface-2)" strokeWidth="1.25" opacity="0.7"
                  />
                </svg>
                <div style={{ height: 1, background: 'var(--fg-secondary)', opacity: 0.4 }} />
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontStyle: 'italic', lineHeight: 1.5, color: 'var(--surface-2)' }}>
                  "The tank check post hit a nerve I didn't know was there."
                </div>
                <div className="hf-byline" style={{ color: 'var(--fg-tertiary)' }}>— @reefclub_official, in DM</div>
              </aside>
            </div>

            {/* Three-up — sub stories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, paddingTop: 20, borderTop: '6px double var(--fg-primary)', marginTop: 20 }}>
              <SubStory
                cat="CREATOR NICHE"
                title="@marina.k posted on decompression illness — and tagged you."
                deck="Audience overlap 18%. She wants a technical take; your Truk Lagoon notes apply."
                meta="4H AGO · @MARINA.K"
                action="Open thread"
                pull="18% overlap"
              />
              <SubStory
                cat="TREND"
                title="Safety primers are outperforming gear teardowns 2.1× this month."
                deck="Across the niche, not just your channel. Five creators in your cohort have leaned in."
                meta="TODAY · NICHE-WIDE"
                action="See chart"
                pull="2.1×"
              />
              <SubStory
                cat="MENTION"
                title="@reefclub_official quoted post 0042."
                deck="11k impressions. Two comments asking if you'll teach a course."
                meta="6H AGO · 11.0K IMPR"
                action="View mention"
                pull="11.0k"
              />
            </div>

            {/* ─────── Below the fold · what scrolling reveals ─────── */}

            {/* Yesterday's lead recap */}
            <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--surface-2)', borderRadius: 8, display: 'grid', gridTemplateColumns: '140px 1fr 120px', gap: 24, alignItems: 'baseline' }}>
              <span className="hf-byline">YESTERDAY · LED WITH</span>
              <div>
                <div className="hf-headline" style={{ fontSize: 18, marginBottom: 4 }}>"Your wreck-cluster is migrating to long-form."</div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13.5, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                  Filed as a Radar signal at 0.78 confidence. <span style={{ color: 'var(--accent-primary)', fontStyle: 'normal', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>confirmed</span> · 0042 went long this morning, 421k views by noon.
                </span>
              </div>
              <span className="hf-folio" style={{ textAlign: 'right' }}>1 DAY · ↑</span>
            </div>

            {/* By the week · figures that moved */}
            <div style={{ marginTop: 32, paddingTop: 16, borderTop: '6px double var(--fg-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="hf-byline">BY THE WEEK · FIGURES THAT MOVED</span>
                <span className="hf-folio">WED 09:42 → WED 09:42</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                {[
                  { label: 'Comments / week', value: '142', delta: '+69%',     sub: 'tank-check seeded most' },
                  { label: 'New clusters',    value: '3',   delta: '+2 vs prior', sub: 'safety-curious' },
                  { label: 'Brand DM volume', value: '11',  delta: '+4',       sub: 'Mares + Apeks lead' },
                  { label: 'Cross-niche tags',value: '4',   delta: 'flat',     sub: 'travel + photo creators' },
                ].map((s, i) => (
                  <div key={i} style={{ borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none', paddingRight: i < 3 ? 16 : 0 }}>
                    <span className="hf-byline" style={{ fontSize: 9.5 }}>{s.label}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: s.delta.includes('+') ? 'var(--tone-success)' : 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{s.delta}</span>
                    </div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--fg-tertiary)', fontStyle: 'italic', marginTop: 6 }}>{s.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tomorrow's edition preview */}
            <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="hf-byline">TOMORROW · DISPATCH №&nbsp;143 · WHAT WE'RE TRACKING</span>
                <span className="hf-folio">3 STORIES FILED · 04:22 IST</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {[
                  { cat: 'AUDIENCE',      preview: 'Two new clusters formed around the wreck content overnight. Likely 200+ comments by morning if pace holds.' },
                  { cat: 'CREATOR NICHE', preview: 'A peer is publishing long-form on instructor mistakes tomorrow — Radar caught this 5 days early.' },
                  { cat: 'BRAND',         preview: 'A category-aligned brand cold-DMed at 03:14 IST. Past pattern suggests multi-quarter contract.' },
                ].map((p, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'var(--surface-1)', border: '1px dashed var(--border-default)', borderRadius: 4 }}>
                    <span className="hf-byline" style={{ fontSize: 9, color: 'var(--accent-primary)' }}>{p.cat}</span>
                    <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-serif)', fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{p.preview}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Folio strip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fg-primary)', marginTop: 32, paddingTop: 10 }}>
              <span className="hf-folio">PULSE · 142 · TRENDS</span>
              <span className="hf-folio">·</span>
              <span className="hf-folio">RADAR · ↓</span>
            </div>
          </div>
        </main>
    </HfShell>
  );
}

function SubStory({ cat, title, deck, meta, action, pull }) {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="hf-byline">{cat}</span>
        {pull && <span className="hf-num" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '-0.01em' }}>{pull}</span>}
      </div>
      <div className="hf-headline" style={{ fontSize: 19 }}>{title}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontStyle: 'italic', lineHeight: 1.45, color: 'var(--fg-secondary)' }}>{deck}</div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
        <span className="hf-byline">{meta}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{action} →</span>
      </div>
    </article>
  );
}

Object.assign(window, {
  HF_StudioThreads,
  HF_AudienceOverview,
  HF_LibraryAll,
  HF_PulseForYou,
});
