/* global React, window, HfShell, FreshnessPill */
/* hifi-intel.jsx — Intel workspace sub-tabs.
   Broadsheet editorial treatment applied to: Radar, Inspiration, DNA, Memory, Studies.
   (Trends already exists as HF_PulseForYou in hifi-screens.jsx.)

   All 6 Intel surfaces share publication framing:
   - Top strip: PULSE · {SECTION} · DISPATCH №142  /  italic tagline  /  date
   - subtabRight: DISPATCH №142 + FreshnessPill
   - 56px Newsreader serif section name (inner pages only — Trends has its own lead)
   - IntelFolio strip at the bottom of every inner page. */

const I_INT = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const INTEL_DISPATCH = 142;
const INTEL_TOP_DATE = 'WED · APR 24 · 09:42';
const INTEL_TAGLINE  = 'Signal, not summary.';

function IM({ children, c = 'var(--fg-tertiary)', s = 10.5, st = {} }) {
  return <span style={{ fontFamily: I_INT.mono, fontSize: s, color: c, letterSpacing: '0.06em', ...st }}>{children}</span>;
}
function IL({ children, c = 'var(--fg-tertiary)', s = 9.5, st = {} }) {
  return <span style={{ fontFamily: I_INT.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', ...st }}>{children}</span>;
}

// subtabRight slot — used by every inner Intel page so the publication frame is consistent.
function IntelSubtabRight() {
  return (
    <>
      <span style={{ fontFamily: I_INT.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>DISPATCH №&nbsp;{INTEL_DISPATCH}</span>
      <FreshnessPill at="2m ago" state="fresh" />
    </>
  );
}

// Editorial masthead used across all Intel sub-tabs.
// Top strip mirrors HF_PulseForYou (Trends) so all 6 surfaces read as siblings of the same publication.
function IntelMasthead({ section, dateline, deck, edition }) {
  return (
    <>
      {/* Publication strip · same pattern as Trends */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '3px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', padding: '12px 0', marginBottom: 18 }}>
        <span className="hf-byline">PULSE · {section.toUpperCase()} · DISPATCH №&nbsp;{INTEL_DISPATCH}</span>
        <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)' }}>{INTEL_TAGLINE}</span>
        <span className="hf-byline">{INTEL_TOP_DATE}</span>
      </div>
      {/* Section name · context strip · deck */}
      <div style={{ borderBottom: '3px solid var(--fg-primary)', paddingBottom: 14, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
          <IM s={10} st={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>{dateline}</IM>
          <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          <IM s={10} st={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>{edition}</IM>
        </div>
        <h1 style={{ margin: 0, fontFamily: I_INT.serif, fontWeight: 600, fontSize: 56, color: 'var(--fg-primary)', letterSpacing: '-0.025em', lineHeight: 0.95 }}>
          {section}
        </h1>
        {deck && (
          <div style={{ marginTop: 10, fontFamily: I_INT.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 720, lineHeight: 1.45 }}>
            {deck}
          </div>
        )}
      </div>
    </>
  );
}

// Folio footer · matches Trends' folio strip. Every inner Intel page gets one.
function IntelFolio({ section, next }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fg-primary)', marginTop: 36, paddingTop: 10 }}>
      <span className="hf-folio">PULSE · {INTEL_DISPATCH} · {section.toUpperCase()}</span>
      <span className="hf-folio">·</span>
      <span className="hf-folio">{next ? `${next.toUpperCase()} · ↓` : 'END OF SECTION · ↑'}</span>
    </div>
  );
}

function DoubleRule() {
  // Matches the inline pattern used in HF_PulseForYou (hifi-screens.jsx) so all 6 Intel surfaces share one rule treatment.
  return <div style={{ borderTop: '6px double var(--fg-primary)', margin: '20px 0' }} />;
}

// ─── RADAR — what's about to break ────────────────────────
function HF_IntelRadar({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('intel', 'Radar');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="intel" subtab="Radar"><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="intel" subtab="Radar"><window.HF_EmptyHero
      eyebrow="Radar · 0 creators tracked"
      title="No competitive radar yet. Add a few creators to start."
      caption="Creators near your space, ranked by velocity. Pick the first batch from Inspiration."
      ctaLabel="Open Inspiration"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="intel" subtab="Radar"><window.HF_ErrorHero
      title="Couldn't load the radar."
      body="The creator feed timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  return (
    <HfShell workspace="intel" subtab="Radar" subtabRight={<IntelSubtabRight />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '32px 48px 56px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <IntelMasthead
            section="Radar"
            dateline="Wed · Apr 24 · 7:08 am · Wayanad"
            edition="Vol. III · No. 47"
            deck="Five things that aren't trending yet but will be inside seven days. Ranked by how much your audience overlaps with the early adopters."
          />

          {/* Lead — strong signal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 36, marginBottom: 24 }}>
            <div>
              <IL s={9.5}>Lead signal · earliest catch</IL>
              <h2 style={{ margin: '6px 0 12px', fontFamily: I_INT.serif, fontWeight: 600, fontSize: 38, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.05 }}>
                "Equipment-first storytelling" is replacing the gear-review.
              </h2>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10, fontFamily: I_INT.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <span>filed by · Coopr</span>
                <span>·</span>
                <span>signal strength · 0.84</span>
                <span>·</span>
                <span>days early · 5–7</span>
              </div>
              <p className="hf-dropcap" style={{ margin: 0, fontFamily: I_INT.serif, fontSize: 17, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
                Three creators in your near-niche posted long-form videos this week where the gear is a character, not a checklist. Watch-time on those clips ran 1.7× the channel mean. The pattern was absent two weeks ago and is in 11% of dive-adjacent uploads now. Your reg-teardown drafts can use this without rewriting.
              </p>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <span
                  onClick={() => ms.pushToast && ms.pushToast('Pitch a draft from this')}
                  style={{ padding: '8px 14px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 6, fontFamily: I_INT.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'transform 120ms ease' }}>Pitch a draft from this</span>
                <span
                  onClick={() => ms.pushToast && ms.pushToast('Show source videos · trend equipment-first')}
                  style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)', borderRadius: 6, fontFamily: I_INT.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'transform 120ms ease' }}>Show me the three videos</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-default)', paddingLeft: 24 }}>
              <IL s={9.5}>By the numbers</IL>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  ['Posts using the pattern', '11%', 'of dive-adjacent · last 7d'],
                  ['Mean watch-time lift',    '1.7×', 'vs channel baseline'],
                  ['Audience overlap',        '64%', 'with your core'],
                  ['Predicted peak',          '5d',  'breaks Tue evening'],
                ].map(([k, v, sub], i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 12, borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <span style={{ fontFamily: I_INT.sans, fontSize: 12, color: 'var(--fg-tertiary)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{k}</span>
                    <span className="hf-num" style={{ fontFamily: I_INT.sans, fontSize: 28, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{v}</span>
                    <IM s={10} c="var(--fg-tertiary)">{sub}</IM>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DoubleRule />

          {/* Other radar items — three columns */}
          <IL>Also tracking · 4 weaker signals</IL>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 14 }}>
            {[
              { score: 0.67, days: 8, head: "The 'second mistake' opener", body: "Creators leading with the second-most-relatable error, not the most. Outperforms 1.3× in 0:00–0:03." },
              { score: 0.58, days: 10, head: "Live wreck-dive Q&A's are returning", body: "Three accounts ran live sessions this week after a 9-month gap. Watch-time is healthy, brand interest follows." },
              { score: 0.52, days: 12, head: "Vertical safety primers > horizontal", body: "9:16 cuts of safety drills outperform their 16:9 originals. Shareable in DMs as instructional clips." },
              { score: 0.41, days: 14, head: "Carousel teardowns of single dives", body: "10-frame carousels of one dive replacing the 'highlights of my year' format. Save rate is the tell." },
            ].map((it, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <IM s={10} c="var(--accent-primary)">signal · {it.score.toFixed(2)} · {it.days}d early</IM>
                <span style={{ fontFamily: I_INT.serif, fontSize: 19, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{it.head}</span>
                <span style={{ fontFamily: I_INT.sans, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{it.body}</span>
                <IM s={10} st={{ marginTop: 4 }}>↗ open analysis</IM>
              </div>
            ))}
          </div>

          {/* ─────── Below the fold · what scrolling reveals ─────── */}

          <DoubleRule />
          <IL>Last week's signals · what came true</IL>
          <div style={{ marginTop: 14, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 70px 1fr 100px 1fr 80px', gap: 14, padding: '10px 16px', fontSize: 9.5, fontFamily: I_INT.mono, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>filed</span>
              <span style={{ textAlign: 'right' }}>signal</span>
              <span>headline</span>
              <span style={{ textAlign: 'right' }}>predicted peak</span>
              <span>actual outcome</span>
              <span style={{ textAlign: 'right' }}>fate</span>
            </div>
            {[
              { filed: 'Apr 17',  score: 0.78, head: 'Wreck-cluster migrating to long-form', predicted: 'Apr 23 ±1d',  outcome: 'Apr 24 · 0042 long-cut hit 421k by noon',          fate: 'CONFIRMED', tone: 'success' },
              { filed: 'Apr 12',  score: 0.71, head: 'Safety primers outpacing teardowns 2:1',  predicted: 'Apr 18 ±2d',  outcome: 'Apr 19 · niche-wide 2.1× ratio held',                fate: 'CONFIRMED', tone: 'success' },
              { filed: 'Apr 09',  score: 0.62, head: 'Q&A live sessions returning · 3 creators',predicted: 'Apr 16 ±3d',  outcome: 'Apr 22 · only 1 followed through · later than expected', fate: 'PARTIAL',   tone: 'warning' },
              { filed: 'Apr 02',  score: 0.55, head: 'Cross-niche photo-creator collabs',       predicted: 'Apr 14 ±4d',  outcome: 'Apr 24 · zero observed in your niche',                fate: 'MISS',      tone: 'danger' },
            ].map((r, i) => (
              <div key={r.filed} style={{ display: 'grid', gridTemplateColumns: '90px 70px 1fr 100px 1fr 80px', gap: 14, padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 12.5, alignItems: 'baseline' }}>
                <IM s={10}>{r.filed}</IM>
                <IM s={10} c="var(--accent-primary)" st={{ textAlign: 'right' }}>{r.score.toFixed(2)}</IM>
                <span style={{ fontFamily: I_INT.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.4 }}>{r.head}</span>
                <IM s={10} st={{ textAlign: 'right' }}>{r.predicted}</IM>
                <span style={{ fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.4 }}>{r.outcome}</span>
                <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: r.tone === 'success' ? 'var(--tone-success)' : r.tone === 'warning' ? 'var(--tone-warning)' : 'var(--tone-danger)' }}>{r.fate}</span>
              </div>
            ))}
          </div>

          <DoubleRule />
          <IL>Filed dispatches · earlier signals in this run</IL>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div>
              {[
                { date: 'Apr 23',  head: 'Bottom-time storytelling outperforming hero shots',     score: 0.72 },
                { date: 'Apr 20',  head: '"Single-fin black-background" hook re-emerging',         score: 0.68 },
                { date: 'Apr 16',  head: 'Brand-DMs shifting from gear to insurance category',     score: 0.64 },
                { date: 'Apr 11',  head: 'Comment threads asking for "second-half" technical depth',score: 0.58 },
              ].map((d, i) => (
                <div key={i} style={{ padding: '12px 0', borderTop: i === 0 ? '1px solid var(--fg-primary)' : '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '60px 1fr 50px', gap: 12, alignItems: 'baseline' }}>
                  <IM s={10}>{d.date}</IM>
                  <span style={{ fontFamily: I_INT.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.4 }}>{d.head}</span>
                  <IM s={10} c="var(--accent-primary)" st={{ textAlign: 'right' }}>{d.score.toFixed(2)}</IM>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '1px solid var(--border-default)', paddingLeft: 28 }}>
              <IL s={9.5}>How signals are scored</IL>
              <p style={{ marginTop: 10, fontFamily: I_INT.serif, fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.65 }}>
                Three factors compound: <span style={{ color: 'var(--fg-primary)', fontStyle: 'normal', fontFamily: I_INT.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>velocity</span> (rate of adoption across observed creators), <span style={{ color: 'var(--fg-primary)', fontStyle: 'normal', fontFamily: I_INT.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>overlap</span> (how much your audience intersects the early adopters), and <span style={{ color: 'var(--fg-primary)', fontStyle: 'normal', fontFamily: I_INT.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>fit</span> (whether the pattern translates to your existing drafts).
              </p>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Confirmed last 30d', '7 / 11', 'tone-success'],
                  ['Partial last 30d',   '3 / 11', 'tone-warning'],
                  ['Missed last 30d',    '1 / 11', 'tone-danger'],
                ].map(([k, v, tone], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${tone})` }} />
                    <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-primary)', flex: 1 }}>{k}</span>
                    <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── C2 expansion · Creator radar ranked by velocity ─── */}
          <DoubleRule />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginTop: 4, marginBottom: 14 }}>
            <div>
              <IL>Creators near your space · ranked by velocity</IL>
              <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>
                Fourteen accounts moving in your niche. Velocity is the 30-day follower delta multiplied by posting cadence, normalised to your overlap.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                onClick={() => ms.pushToast && ms.pushToast('Compare two creators')}
                style={{ padding: '7px 12px', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: I_INT.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-secondary)', background: 'var(--surface-1)', cursor: 'pointer' }}>
                Compare 2 creators
              </span>
              <span
                onClick={() => ms.pushToast && ms.pushToast('Sort by Velocity')}
                style={{ padding: '7px 12px', border: '1px solid var(--accent-primary)', borderRadius: 999, fontFamily: I_INT.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', background: 'var(--accent-soft)', cursor: 'pointer' }}>
                Sort by Velocity ▾
              </span>
            </div>
          </div>

          {/* Filter chip row · niche pillars + velocity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <IM s={9.5} st={{ flexShrink: 0 }}>filter ·</IM>
            {[
              { id: 'gear',     label: 'Gear',     active: true,  kind: 'pillar' },
              { id: 'safety',   label: 'Safety',   active: true,  kind: 'pillar' },
              { id: 'story',    label: 'Story',    active: false, kind: 'pillar' },
              { id: 'wellness', label: 'Wellness', active: false, kind: 'pillar' },
              { id: 'rising',   label: 'Rising',   active: true,  kind: 'velocity' },
              { id: 'steady',   label: 'Steady',   active: false, kind: 'velocity' },
              { id: 'falling',  label: 'Falling',  active: false, kind: 'velocity' },
            ].map((c) => (
              <span
                key={c.id}
                onClick={() => ms.pushToast && ms.pushToast('Toggle filter · ' + c.label)}
                style={{
                  padding: '5px 11px', borderRadius: 999,
                  border: c.active ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  background: c.active ? 'var(--accent-soft)' : 'transparent',
                  color: c.active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                  fontFamily: I_INT.sans, fontSize: 11.5, fontWeight: 600,
                  cursor: 'pointer',
                }}>
                {c.label}
                {c.kind === 'velocity' && c.active && <span style={{ marginLeft: 6, fontFamily: I_INT.mono, fontSize: 9, opacity: 0.7 }}>↑</span>}
              </span>
            ))}
          </div>

          {/* Ranked creator grid · 14 rows */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, marginBottom: 26 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '32px 200px 1.4fr 80px 90px 130px 80px', gap: 14, padding: '10px 16px', fontSize: 9.5, fontFamily: I_INT.mono, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>#</span>
              <span>creator</span>
              <span>niche</span>
              <span style={{ textAlign: 'right' }}>posts/wk</span>
              <span style={{ textAlign: 'right' }}>30d Δ</span>
              <span>velocity</span>
              <span style={{ textAlign: 'right' }}>signal</span>
            </div>
            {[
              { rank: 1,  who: 'silke.diveinstructor', tags: ['safety', 'gear'],     pw: 4.2, delta: '+18.4k',  vel: 0.92, sig: 0.87 },
              { rank: 2,  who: 'reefdoc.kim',          tags: ['story', 'photo'],     pw: 3.0, delta: '+11.2k',  vel: 0.81, sig: 0.78 },
              { rank: 3,  who: 'wreckhunter.theo',     tags: ['gear', 'tech'],       pw: 2.5, delta: '+9.8k',   vel: 0.74, sig: 0.71 },
              { rank: 4,  who: 'sebastian.travels',    tags: ['story', 'travel'],    pw: 5.0, delta: '+8.4k',   vel: 0.69, sig: 0.66 },
              { rank: 5,  who: 'cassidy.codes',        tags: ['gear'],               pw: 6.0, delta: '+6.1k',   vel: 0.61, sig: 0.59 },
              { rank: 6,  who: 'oceanwell.ana',        tags: ['wellness', 'story'],  pw: 2.0, delta: '+4.9k',   vel: 0.54, sig: 0.51 },
              { rank: 7,  who: 'tideline.morgan',      tags: ['safety'],             pw: 3.5, delta: '+4.2k',   vel: 0.49, sig: 0.46 },
              { rank: 8,  who: 'doublerig.harvey',     tags: ['tech', 'gear'],       pw: 2.0, delta: '+2.1k',   vel: 0.41, sig: 0.39 },
              { rank: 9,  who: 'mira.makes',           tags: ['craft'],              pw: 4.0, delta: '+1.8k',   vel: 0.36, sig: 0.34 },
              { rank: 10, who: 'aquanaut.julien',      tags: ['safety', 'story'],    pw: 1.5, delta: '+1.4k',   vel: 0.31, sig: 0.29 },
              { rank: 11, who: 'bluewater.hana',       tags: ['photo', 'wellness'],  pw: 2.0, delta: '+0.9k',   vel: 0.24, sig: 0.22 },
              { rank: 12, who: 'gear.nerdy',           tags: ['gear'],               pw: 5.5, delta: '+0.4k',   vel: 0.18, sig: 0.17 },
              { rank: 13, who: 'still.aquatic',        tags: ['wellness'],           pw: 1.0, delta: '−0.3k',   vel: 0.10, sig: 0.09, falling: true },
              { rank: 14, who: 'old.salt.scuba',       tags: ['story'],              pw: 0.5, delta: '−1.2k',   vel: 0.06, sig: 0.05, falling: true },
            ].map((c, i) => (
              <div
                key={c.who}
                onClick={() => ms.pushToast && ms.pushToast('Open creator · @' + c.who)}
                style={{ display: 'grid', gridTemplateColumns: '32px 200px 1.4fr 80px 90px 130px 80px', gap: 14, padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', alignItems: 'center', cursor: 'pointer' }}>
                <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 600 }}>{String(c.rank).padStart(2, '0')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-secondary)' }}>{c.who[0]}</span>
                  <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 600 }}>@{c.who}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {c.tags.map((t) => (
                    <span key={t} style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--surface-2)', fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t}</span>
                  ))}
                </div>
                <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 12, color: 'var(--fg-primary)' }}>{c.pw.toFixed(1)}</span>
                <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 12, color: c.falling ? 'var(--tone-warning)' : 'var(--tone-success)', fontWeight: 600 }}>{c.delta}</span>
                <span style={{ position: 'relative', height: 6, background: 'var(--surface-2)', borderRadius: 1, overflow: 'hidden' }}>
                  <span style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.max(4, c.vel * 100)}%`, background: c.falling ? 'var(--tone-warning)' : 'var(--accent-primary)' }} />
                </span>
                <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 11, color: 'var(--accent-primary)', fontWeight: 700 }}>{c.sig.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* New today strip · 4 newly-tracked creators */}
          <DoubleRule />
          <IL>New today · 4 creators just entered the radar</IL>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {[
              { who: 'kelp.forest.jay', niche: 'photo · cold-water', body: "Six posts, four of them 90s+ retention. The kelp-canopy frame is absent in your work." },
              { who: 'reg.tech.delphi',  niche: 'gear · servicing',  body: "Posts repair walkthroughs at 30s. Brand-friendly, technical, clean voice." },
              { who: 'frida.freediver',  niche: 'safety · breath',   body: "Cross-niche but freediving safety overlaps wreck-dive primer audience." },
              { who: 'longfin.club',     niche: 'story · expedition',body: "Four-part series format, named episodes. The arc you've been studying lives here." },
            ].map((n, i) => (
              <div
                key={i}
                onClick={() => ms.pushToast && ms.pushToast('Track @' + n.who)}
                style={{ padding: '14px 14px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', fontWeight: 600 }}>{n.who[0]}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, fontWeight: 700, color: 'var(--fg-primary)' }}>@{n.who}</span>
                    <IM s={9.5}>{n.niche}</IM>
                  </div>
                </div>
                <span style={{ fontFamily: I_INT.serif, fontSize: 13, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{n.body}</span>
                <span style={{ flex: 1 }} />
                <IM s={10} c="var(--accent-primary)">↗ Track this creator</IM>
              </div>
            ))}
          </div>

          {/* Velocity bucket digest · readable at-a-glance */}
          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 14 }}>
            {[
              { tier: 'Rising',  n: 7, lift: '+0.41 mean velocity', body: "Seven creators are gaining ground in your overlap. Most are publishing 3+ times a week.", tone: 'success' },
              { tier: 'Steady',  n: 4, lift: 'flat ±0.05',          body: "Four are holding ground. Steady doesn't mean stale — sebastian.travels is the model.",       tone: 'neutral' },
              { tier: 'Falling', n: 3, lift: '−0.18 mean velocity', body: "Three are losing the room. Watch for whether they pivot or churn out.",                       tone: 'warning' },
            ].map((b, i) => (
              <div key={i} style={{ padding: '18px 20px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <IL s={9.5} c={b.tone === 'success' ? 'var(--tone-success)' : b.tone === 'warning' ? 'var(--tone-warning)' : 'var(--fg-tertiary)'}>{b.tier} · {b.n} creators</IL>
                <span className="hf-num" style={{ fontFamily: I_INT.sans, fontSize: 22, fontWeight: 700, color: 'var(--fg-primary)' }}>{b.lift}</span>
                <span style={{ fontFamily: I_INT.serif, fontSize: 13.5, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{b.body}</span>
              </div>
            ))}
          </div>

          {/* Niche overlap heatmap · 14 creators × 4 pillars */}
          <DoubleRule />
          <IL>Niche overlap · creators × pillars</IL>
          <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(4, 1fr)', gap: 8, marginBottom: 6 }}>
              <span />
              {['Safety', 'Gear', 'Story', 'Wellness'].map((p) => (
                <span key={p} style={{ fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{p}</span>
              ))}
            </div>
            {[
              { who: '@silke',         vals: [0.92, 0.78, 0.34, 0.12] },
              { who: '@reefdoc',       vals: [0.34, 0.18, 0.84, 0.32] },
              { who: '@wreckhunter',   vals: [0.62, 0.91, 0.41, 0.08] },
              { who: '@sebastian',     vals: [0.22, 0.18, 0.88, 0.28] },
              { who: '@cassidy',       vals: [0.18, 0.74, 0.32, 0.14] },
              { who: '@oceanwell',     vals: [0.18, 0.08, 0.52, 0.81] },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px repeat(4, 1fr)', gap: 8, padding: '6px 0', alignItems: 'center', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: I_INT.sans, fontSize: 12, color: 'var(--fg-primary)', fontWeight: 600 }}>{row.who}</span>
                {row.vals.map((v, j) => (
                  <span key={j} style={{ height: 22, borderRadius: 3, background: `color-mix(in srgb, var(--accent-primary) ${Math.round(v * 80)}%, transparent)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: I_INT.mono, fontSize: 10, fontWeight: 700, color: v > 0.5 ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)' }}>
                    {v.toFixed(2)}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Compare preview · two-creator side-by-side stub */}
          <DoubleRule />
          <IL>Compare preview · two creators side by side</IL>
          <div style={{ marginTop: 14, padding: '20px 22px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 24, alignItems: 'center' }}>
              {[
                { who: 'silke.diveinstructor', vel: 0.92, posts: 4.2, hook: 'object-on-black', retain: '0:03 · 91%' },
                null,
                { who: 'reefdoc.kim',          vel: 0.81, posts: 3.0, hook: 'second-line question', retain: '0:03 · 84%' },
              ].map((c, i) => {
                if (c === null) {
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <IM s={10} st={{ letterSpacing: '0.18em' }}>vs</IM>
                      <span
                        onClick={() => ms.pushToast && ms.pushToast('Open compare workspace')}
                        style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid var(--accent-primary)', background: 'var(--accent-soft)', color: 'var(--accent-primary-press)', fontFamily: I_INT.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        Open
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={c.who} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{c.who[0]}</span>
                      <span style={{ fontFamily: I_INT.sans, fontSize: 13, fontWeight: 700, color: 'var(--fg-primary)' }}>@{c.who}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><IM s={10}>velocity</IM><span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>{c.vel.toFixed(2)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><IM s={10}>posts/wk</IM><span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 12, color: 'var(--fg-primary)' }}>{c.posts.toFixed(1)}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><IM s={10}>hook</IM><span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-primary)' }}>{c.hook}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><IM s={10}>retention</IM><span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 12, color: 'var(--fg-primary)' }}>{c.retain}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <IntelFolio section="Radar" next="Inspiration" />
        </div>
      </div>
    </HfShell>
  );
}

// ─── INSPIRATION — peer / cross-niche work worth studying ──
function HF_IntelInspiration({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('intel', 'Inspiration');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="intel" subtab="Inspiration"><window.HF_SkeletonHero shape="grid" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="intel" subtab="Inspiration"><window.HF_EmptyHero
      eyebrow="Inspiration · 0 saved"
      title="Nothing saved yet. Pin a snippet from anywhere to begin."
      caption="Saved screenshots, references, and peer takes — tagged so you can pull them into a doc later."
      ctaLabel="Open Intel"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="intel" subtab="Inspiration"><window.HF_ErrorHero
      title="Couldn't load Inspiration."
      body="The clipping index timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  const peers = [
    { who: 'silke.diveinstructor', niche: 'instructor', stat: '0:00 hooks', body: "Her 0:00 frame is consistently a single object on a black background — fin, reg, mask. Mean retention at 0:03 is 91%. You do this only 2 of last 12.", swipe: 'object-on-black hook' },
    { who: 'reefdoc.kim',          niche: 'photographer', stat: 'caption rhythm', body: "Three-line captions, second line always a question. 4.2% comment rate vs your 1.6%.", swipe: 'second-line question' },
    { who: 'sebastian.travels',    niche: 'travel', stat: 'series arcs', body: "Episodic dive-trip series with named entries (Ep. 1: 'arrival', Ep. 2: 'first dive'). Subscriber → viewer conversion 38% across the series.", swipe: 'named episode arcs' },
  ];
  const cross = [
    { who: 'cassidy.codes',  niche: 'coding educator', body: "Uses 'I was wrong about X' as a reliable opener. Ego-cost low, retention dividend high. Translates 1:1 to gear or technique posts." },
    { who: 'mira.makes',     niche: 'pottery / craft', body: "Slow-process B-roll with handwritten captions over the top. Translates to underwater sequence work." },
    { who: 'dustin.standup', niche: 'comedy',          body: "Ends 80% of 30-sec posts with a callback to a previous post. You don't reference your library at all in posts." },
  ];
  return (
    <HfShell workspace="intel" subtab="Inspiration" subtabRight={<IntelSubtabRight />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '32px 48px 56px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <IntelMasthead
            section="Inspiration"
            dateline="Wed · Apr 24 · curated this morning"
            edition="Reading list · 7 entries"
            deck="Things worth studying. Three from your near-niche, three from far-niche creators whose patterns translate. One annotated comparison."
          />

          {/* Annotated comparison — lead */}
          <div style={{ marginBottom: 28 }}>
            <IL>Comparison of the week</IL>
            <h2 style={{ margin: '6px 0 14px', fontFamily: I_INT.serif, fontWeight: 600, fontSize: 30, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.1 }}>
              Two openings to the same dive, one minute apart on the timeline.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { who: 'Yours · 0044', body: 'Wide drone shot of the boat. Voiceover lays out the day. Hook lands at 0:08.', stat: '0:03 retention · 71%', tone: 'baseline' },
                { who: 'silke.diveinstructor', body: "Single fin, black background. 'I almost didn't get on the boat that morning.' Hook lands at 0:01.", stat: '0:03 retention · 91%', tone: 'study' },
              ].map((c, i) => (
                <div key={i} style={{ padding: '20px 22px', background: i === 1 ? 'var(--accent-soft)' : 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <IM s={10} c={i === 1 ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'}>{c.tone === 'study' ? 'study this' : 'your own'}</IM>
                  <span style={{ fontFamily: I_INT.serif, fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.012em', lineHeight: 1.15 }}>{c.who}</span>
                  <div style={{ height: 180, borderRadius: 8, background: 'repeating-linear-gradient(45deg, var(--surface-2) 0 8px, var(--surface-3) 8px 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IM s={10} c="var(--fg-tertiary)">video frame · 0:00</IM>
                  </div>
                  <span style={{ fontFamily: I_INT.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{c.body}</span>
                  <span className="hf-num" style={{ fontFamily: I_INT.sans, fontSize: 16, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{c.stat}</span>
                </div>
              ))}
            </div>
          </div>

          <DoubleRule />

          {/* Peer creators */}
          <IL>From your near-niche</IL>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 12, marginBottom: 28 }}>
            {peers.map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, borderTop: '1px solid var(--fg-primary)' }}>
                <IM s={10}>{p.niche} · @{p.who}</IM>
                <span style={{ fontFamily: I_INT.serif, fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.15 }}>{p.stat}</span>
                <span style={{ fontFamily: I_INT.sans, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{p.body}</span>
                <span style={{ marginTop: 4, padding: '6px 10px', background: 'var(--surface-2)', border: '1px dashed var(--border-default)', borderRadius: 6, fontFamily: I_INT.mono, fontSize: 10, color: 'var(--fg-secondary)', alignSelf: 'flex-start' }}>swipe · {p.swipe}</span>
              </div>
            ))}
          </div>

          {/* Cross-niche */}
          <IL>From far-niche · patterns that translate</IL>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 12 }}>
            {cross.map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <IM s={10} c="var(--fg-tertiary)">{p.niche} · @{p.who}</IM>
                <span style={{ fontFamily: I_INT.sans, fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.6 }}>{p.body}</span>
              </div>
            ))}
          </div>

          {/* ─────── Below the fold · what scrolling reveals ─────── */}

          <DoubleRule />
          <IL>Saved this week · ready to apply</IL>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { pattern: 'object-on-black hook',     from: '@silke.diveinstructor', applied: 'd013', when: '2 days ago' },
              { pattern: 'second-line question',     from: '@reefdoc.kim',          applied: 'd011', when: '4 days ago' },
              { pattern: 'named episode arcs',       from: '@sebastian.travels',    applied: null,   when: '5 days ago' },
              { pattern: 'callback to prior post',   from: '@dustin.standup',       applied: null,   when: '6 days ago' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '14px 14px', background: 'var(--surface-1)', border: '1px dashed var(--border-default)', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <IM s={10} c="var(--accent-primary)">SWIPE · {s.when.toUpperCase()}</IM>
                <span style={{ fontFamily: I_INT.serif, fontSize: 16, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.25 }}>{s.pattern}</span>
                <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontFamily: I_INT.mono, letterSpacing: '0.04em' }}>{s.from}</span>
                <span style={{ flex: 1 }} />
                {s.applied ? (
                  <IM s={10} c="var(--tone-success)">↳ APPLIED · {s.applied.toUpperCase()}</IM>
                ) : (
                  <IM s={10} c="var(--accent-primary)">↗ apply to a draft</IM>
                )}
              </div>
            ))}
          </div>

          <DoubleRule />
          <IL>Library applied · last 30 days</IL>
          <div style={{ marginTop: 14, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 1fr 80px 80px', gap: 14, padding: '10px 16px', fontSize: 9.5, fontFamily: I_INT.mono, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>pattern</span>
              <span>borrowed from</span>
              <span>posts where used</span>
              <span style={{ textAlign: 'right' }}>n</span>
              <span style={{ textAlign: 'right' }}>avg lift</span>
            </div>
            {[
              { p: 'mistake-first opener',    from: '@silke',     posts: '0042 · 0046 · 0048',          n: 3, lift: '+18pp' },
              { p: 'second-line question',    from: '@reefdoc',   posts: '0046 · 0044',                 n: 2, lift: '+1.4x comments' },
              { p: 'object-on-black hook',    from: '@silke',     posts: '0048 (in test)',              n: 1, lift: 'pending' },
              { p: 'callback to prior post',  from: '@dustin',    posts: '— not yet applied',           n: 0, lift: '—' },
              { p: 'three-shot opening cut',  from: '@cassidy',   posts: '0041 · 0043 · 0045 · 0047',   n: 4, lift: '+9pp' },
            ].map((r, i) => (
              <div key={r.p} style={{ display: 'grid', gridTemplateColumns: '180px 100px 1fr 80px 80px', gap: 14, padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 12.5, alignItems: 'baseline' }}>
                <span style={{ fontFamily: I_INT.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-primary)' }}>{r.p}</span>
                <IM s={10}>{r.from}</IM>
                <span style={{ fontSize: 12, color: 'var(--fg-secondary)', fontFamily: I_INT.mono, letterSpacing: '0.02em' }}>{r.posts}</span>
                <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, color: r.n === 0 ? 'var(--fg-tertiary)' : 'var(--fg-primary)', fontWeight: 600 }}>{r.n}</span>
                <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 11, color: r.lift.startsWith('+') ? 'var(--tone-success)' : 'var(--fg-tertiary)', fontWeight: 700 }}>{r.lift}</span>
              </div>
            ))}
          </div>

          {/* ─── C2 expansion · Inspiration tile grid + filters ─── */}
          <DoubleRule />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
            <div>
              <IL>Saved inspirations · 14 tiles</IL>
              <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>
                Snippets, screenshots, and references caught in the last six weeks. Tone is taken from the source frame; tags travel with the tile.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                onClick={() => ms.pushToast && ms.pushToast('Sort inspirations · by recency')}
                style={{ padding: '7px 12px', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: I_INT.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-secondary)', background: 'var(--surface-1)', cursor: 'pointer' }}>
                Sort: Recency ▾
              </span>
              <span
                onClick={() => ms.pushToast && ms.pushToast('Save inspiration')}
                style={{ padding: '7px 12px', border: '1px solid var(--accent-primary)', borderRadius: 999, fontFamily: I_INT.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', background: 'var(--accent-soft)', cursor: 'pointer' }}>
                + New inspiration
              </span>
            </div>
          </div>

          {/* Tag filter row · 8 tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <IM s={9.5} st={{ flexShrink: 0 }}>tag ·</IM>
            {[
              { id: 'cinema',  label: 'Cinematography', active: true },
              { id: 'pacing',  label: 'Pacing',         active: true },
              { id: 'hook',    label: 'Hook',           active: true },
              { id: 'inter',   label: 'Interview',      active: false },
              { id: 'broll',   label: 'B-roll',         active: false },
              { id: 'sound',   label: 'Sound',          active: false },
              { id: 'caption', label: 'Caption',        active: false },
              { id: 'arc',     label: 'Arc',            active: false },
            ].map((c) => (
              <span
                key={c.id}
                onClick={() => ms.pushToast && ms.pushToast('Toggle tag · ' + c.label)}
                style={{
                  padding: '5px 11px', borderRadius: 999,
                  border: c.active ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  background: c.active ? 'var(--accent-soft)' : 'transparent',
                  color: c.active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                  fontFamily: I_INT.sans, fontSize: 11.5, fontWeight: 600,
                  cursor: 'pointer',
                }}>
                {c.label}
              </span>
            ))}
          </div>

          {/* 14-tile inspiration grid · 4 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { id: 'i01', tone: ['#1f2933', '#3b4252'], src: '@silke',         tags: ['hook', 'cinema'],   when: 'Apr 22', title: "Single-fin black-frame opener" },
              { id: 'i02', tone: ['#3a3026', '#5a4b3c'], src: '@reefdoc',       tags: ['caption'],          when: 'Apr 21', title: "Three-line caption rhythm" },
              { id: 'i03', tone: ['#0e3a4d', '#1a5a72'], src: '@sebastian',     tags: ['arc', 'pacing'],    when: 'Apr 19', title: "Episode-1 voiceover style" },
              { id: 'i04', tone: ['#2c1f3a', '#4a3654'], src: '@dustin',        tags: ['hook', 'arc'],      when: 'Apr 18', title: "Callback in the last frame" },
              { id: 'i05', tone: ['#36281e', '#5b3f30'], src: '@cassidy',       tags: ['hook', 'pacing'],   when: 'Apr 16', title: "I-was-wrong opener cadence" },
              { id: 'i06', tone: ['#1a2c1f', '#2c4634'], src: '@mira',          tags: ['broll', 'sound'],   when: 'Apr 15', title: "Slow-process B-roll over voice" },
              { id: 'i07', tone: ['#2d2438', '#473551'], src: '@kelp.forest',   tags: ['cinema'],           when: 'Apr 13', title: "Kelp-canopy pull-back" },
              { id: 'i08', tone: ['#1f2e36', '#33485a'], src: '@reg.tech',      tags: ['inter', 'broll'],   when: 'Apr 12', title: "Bench-side servicing close-up" },
              { id: 'i09', tone: ['#3d2521', '#5e3934'], src: '@frida.fd',      tags: ['hook'],             when: 'Apr 09', title: "Breath-hold count-in hook" },
              { id: 'i10', tone: ['#2a1f2e', '#473547'], src: '@longfin.club',  tags: ['arc', 'caption'],   when: 'Apr 06', title: "Named-episode title cards" },
              { id: 'i11', tone: ['#1c2a2e', '#2c4044'], src: '@bluewater.h',   tags: ['cinema'],           when: 'Apr 04', title: "Top-down lens above wreck" },
              { id: 'i12', tone: ['#2e2a1d', '#4a4330'], src: '@gear.nerdy',    tags: ['caption'],          when: 'Apr 02', title: "Spec-sheet caption layering" },
              { id: 'i13', tone: ['#251f2e', '#3a3147'], src: '@aquanaut.j',    tags: ['inter'],            when: 'Mar 31', title: "Mid-dive walkie-style talk" },
              { id: 'i14', tone: ['#1f2a1d', '#324430'], src: '@still.aqua',    tags: ['sound', 'pacing'],  when: 'Mar 28', title: "Ambient surface to silence cut" },
            ].map((t) => (
              <div
                key={t.id}
                onClick={() => ms.pushToast && ms.pushToast('Open inspiration · ' + t.id)}
                style={{
                  display: 'flex', flexDirection: 'column',
                  background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8,
                  cursor: 'pointer', overflow: 'hidden',
                }}>
                <div style={{ height: 130, background: `linear-gradient(135deg, ${t.tone[0]}, ${t.tone[1]})`, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.32)', color: 'rgba(255,255,255,0.78)', fontFamily: I_INT.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em' }}>
                    {t.id.toUpperCase()}
                  </span>
                </div>
                <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.3 }}>{t.title}</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{t.src} · {t.when}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    {t.tags.map((tag) => (
                      <span key={tag} style={{ padding: '1px 6px', borderRadius: 3, background: 'var(--surface-2)', fontFamily: I_INT.mono, fontSize: 9, color: 'var(--fg-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Source distribution · where inspirations come from */}
          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 14, marginBottom: 6 }}>
            <div>
              <IL>Where saves come from</IL>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { src: 'Near-niche peers',    n: 38, share: 0.42 },
                  { src: 'Far-niche translates', n: 22, share: 0.24 },
                  { src: 'Your own re-cuts',    n: 14, share: 0.16 },
                  { src: 'Comment screenshots', n: 9,  share: 0.10 },
                  { src: 'Press / publications',n: 7,  share: 0.08 },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-primary)', flex: 1 }}>{r.src}</span>
                      <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>{r.n}</span>
                    </div>
                    <span style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${r.share * 100}%`, background: 'var(--accent-primary)', borderRadius: 2 }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ paddingLeft: 24, borderLeft: '1px solid var(--border-default)' }}>
              <IL>How a tile becomes a draft</IL>
              <p style={{ marginTop: 10, fontFamily: I_INT.serif, fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.65 }}>
                Drag a tile onto a script chip and Coopr lifts the pattern verbatim. Eight of the last twelve drafts trace back to a saved inspiration; four traced back to two tiles each.
              </p>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Tile → script lift', '8 / 12 drafts', 'tone-success'],
                  ['Cross-tile remix',  '4 / 12 drafts', 'accent-primary'],
                  ['Unused saves',      '6 / 14 tiles',  'fg-tertiary'],
                ].map(([k, v, tone], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${tone})` }} />
                    <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-primary)', flex: 1 }}>{k}</span>
                    <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tag cloud · saves by tag */}
          <DoubleRule />
          <IL>Tag cloud · what you've been studying</IL>
          <div style={{ marginTop: 12, padding: '14px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'baseline' }}>
            {[
              { tag: 'cinematography', n: 12, weight: 22 },
              { tag: 'hook',           n: 9,  weight: 19 },
              { tag: 'pacing',         n: 7,  weight: 17 },
              { tag: 'caption',        n: 6,  weight: 15 },
              { tag: 'b-roll',         n: 4,  weight: 13 },
              { tag: 'arc',            n: 4,  weight: 13 },
              { tag: 'interview',      n: 3,  weight: 12 },
              { tag: 'sound',          n: 2,  weight: 11 },
            ].map((c) => (
              <span
                key={c.tag}
                onClick={() => ms.pushToast && ms.pushToast('Filter by tag · ' + c.tag)}
                style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: c.weight, color: 'var(--fg-primary)', letterSpacing: '-0.005em', cursor: 'pointer' }}>
                {c.tag} <span style={{ fontFamily: I_INT.mono, fontStyle: 'normal', fontSize: 9.5, color: 'var(--fg-tertiary)', verticalAlign: 'super' }}>{c.n}</span>
              </span>
            ))}
          </div>

          {/* Quick captures today · narrow rail */}
          <DoubleRule />
          <IL>Captured today · 5 pending tags</IL>
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            {[
              { tone: ['#1f2933', '#3b4252'], src: 'screenshot · IG saved',          note: 'tag this as cinema or hook',         time: '08:42' },
              { tone: ['#3a3026', '#5a4b3c'], src: 'voice memo · 22 sec',            note: 'thought about second-line questions', time: '07:55' },
              { tone: ['#0e3a4d', '#1a5a72'], src: 'screenshot · YouTube short',     note: 'unfamiliar opener — needs a watch',   time: '07:12' },
              { tone: ['#36281e', '#5b3f30'], src: 'paste · article excerpt',         note: 'about retention vs save rate',        time: '06:58' },
              { tone: ['#1a2c1f', '#2c4634'], src: 'photo · own bench',               note: 'might be a thumbnail, might not',     time: '06:30' },
            ].map((q, i) => (
              <div
                key={i}
                onClick={() => ms.pushToast && ms.pushToast('Tag inspiration · ' + q.src)}
                style={{ display: 'grid', gridTemplateColumns: '36px 200px 1fr 60px 60px', gap: 14, padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ width: 28, height: 28, borderRadius: 4, background: `linear-gradient(135deg, ${q.tone[0]}, ${q.tone[1]})` }} />
                <IM s={10} c="var(--fg-secondary)">{q.src}</IM>
                <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-primary)' }}>{q.note}</span>
                <IM s={10} st={{ textAlign: 'right' }}>{q.time}</IM>
                <span style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>tag</span>
              </div>
            ))}
          </div>

          {/* Recently used strip · 4 inspirations marked "used in 0042" etc */}
          <DoubleRule />
          <IL>Recently used · pulled into a draft</IL>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { id: 'i01', title: 'Single-fin black-frame opener',   used: '0042', when: '2 days ago' },
              { id: 'i05', title: 'I-was-wrong opener cadence',      used: '0046', when: '4 days ago' },
              { id: 'i02', title: 'Three-line caption rhythm',       used: '0044', when: '5 days ago' },
              { id: 'i08', title: 'Bench-side servicing close-up',   used: '0048', when: '6 days ago' },
            ].map((u, i) => (
              <div
                key={i}
                onClick={() => ms.pushToast && ms.pushToast('Open · used in ' + u.used)}
                style={{ padding: '14px 14px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
                <IM s={9.5} c="var(--accent-primary)">USED IN {u.used.toUpperCase()}</IM>
                <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.3 }}>{u.title}</span>
                <span style={{ flex: 1 }} />
                <IM s={10}>{u.when}</IM>
              </div>
            ))}
          </div>

          <IntelFolio section="Inspiration" next="DNA" />
        </div>
      </div>
    </HfShell>
  );
}

// ─── DNA — your creative fingerprint ──────────────────────
function HF_IntelDNA({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('intel', 'DNA');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="intel" subtab="DNA"><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="intel" subtab="DNA"><window.HF_EmptyHero
      eyebrow="DNA · 0 hours analyzed"
      title="No fingerprint yet. DNA forms after a dozen posts."
      caption="Pillars, hooks, and voice profile build as Coopr reads more of your work."
      ctaLabel="Open Intel"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="intel" subtab="DNA"><window.HF_ErrorHero
      title="Couldn't load the DNA profile."
      body="The voice analyzer timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  return (
    <HfShell workspace="intel" subtab="DNA" subtabRight={<IntelSubtabRight />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '32px 48px 56px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <IntelMasthead
            section="DNA"
            dateline="Profile updated · Apr 24 · 7:08 am"
            edition="156 posts · 412 hours analyzed"
            deck="What COOPR has learned about how you make things. Updated continuously. This is the voice profile every suggested reply, draft, and rewrite is matched against."
          />

          {/* ─── HERO · The archetype + signal constellation (Henry-loved, polish-only) ─── */}
          <div style={{ position: 'relative', marginBottom: 36, padding: '36px 40px 40px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', minHeight: 360 }}>
            {/* Eyebrow band */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, position: 'relative', zIndex: 2 }}>
              <IM s={10}>ARCHETYPE · DERIVED FROM 111 SIGNALS · LAST FIT 02:14 AGO</IM>
              <IM s={10} c="var(--fg-tertiary)">CONFIDENCE 0.91</IM>
            </div>
            <h2 style={{ margin: '0 0 4px', fontFamily: I_INT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 64, color: 'var(--fg-primary)', letterSpacing: '-0.025em', lineHeight: 0.96, position: 'relative', zIndex: 2 }}>
              The Educator
            </h2>
            <p style={{ margin: '6px 0 0', maxWidth: 540, fontFamily: I_INT.serif, fontSize: 16, color: 'var(--fg-secondary)', lineHeight: 1.55, position: 'relative', zIndex: 2 }}>
              You teach by walking through your own near-misses. Plainspoken, technically precise, allergic to hype. The audience trusts you because you start with what you got wrong.
            </p>
            {/* Constellation · floats on right side */}
            <svg viewBox="0 0 480 320" width="480" height="320" style={{ position: 'absolute', right: 24, top: 20, opacity: 0.95, pointerEvents: 'none' }} aria-hidden="true">
              {/* faint grid rings */}
              <circle cx="240" cy="160" r="60"  fill="none" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="2 4" />
              <circle cx="240" cy="160" r="110" fill="none" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="2 4" />
              <circle cx="240" cy="160" r="150" fill="none" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="2 4" />
              {/* connecting lines from center to anchors */}
              {[
                [240,160, 110, 70 ], [240,160, 360, 90 ], [240,160, 410,180],
                [240,160, 330,260], [240,160, 160,250], [240,160, 80, 200],
                [240,160, 70, 110], [240,160, 200, 60 ], [240,160, 370,240],
              ].map(([x1,y1,x2,y2],i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-default)" strokeWidth="0.6" opacity="0.6" />
              ))}
              {/* satellite dots — varied sizes by signal weight */}
              {[
                [110, 70, 4],  [360, 90, 5], [410,180, 3],
                [330,260, 4], [160,250, 5], [80,200, 3],
                [70, 110, 4], [200, 60, 3], [370,240, 4],
                [260, 95, 2], [310,140, 2], [180,180, 2],
                [220,230, 2], [150,130, 2], [120,180, 2],
              ].map(([cx,cy,r],i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill="var(--accent-primary)" opacity={0.55 + (r * 0.08)} />
              ))}
              {/* center · the archetype anchor */}
              <circle cx="240" cy="160" r="9" fill="var(--accent-primary)" />
              <circle cx="240" cy="160" r="18" fill="none" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.5" />
              <circle cx="240" cy="160" r="28" fill="none" stroke="var(--accent-primary)" strokeWidth="0.6" opacity="0.3" />
            </svg>
            {/* Footer mini-stats */}
            <div style={{ position: 'relative', zIndex: 2, marginTop: 220, display: 'flex', gap: 36, alignItems: 'baseline' }}>
              {[
                { k: 'fingerprint match', v: '0.41' },
                { k: 'pillars active',    v: '4' },
                { k: 'voice traits',      v: '7' },
                { k: 'phrases tracked',   v: '38' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <IM s={9.5}>{m.k}</IM>
                  <span className="hf-num" style={{ fontFamily: I_INT.sans, fontSize: 22, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{m.v}</span>
                </div>
              ))}
              <span style={{ flex: 1 }} />
              <span
                onClick={() => ms.pushToast && ms.pushToast('Recompute archetype · 111 signals')}
                style={{ cursor: 'pointer', fontFamily: I_INT.mono, fontSize: 10.5, color: 'var(--accent-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                recompute ↻
              </span>
            </div>
          </div>

          {/* ─── G2-NEW · Signal sources breakdown ─── */}
          <DoubleRule />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <IL>Signal sources · where the 111 came from</IL>
            <IM s={10}>UPDATED CONTINUOUSLY</IM>
          </div>
          <p style={{ margin: '0 0 16px', fontFamily: I_INT.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 720 }}>
            The archetype is not a guess. It is fit against 111 observations from four sources. Click any segment to drill down to the rows that fed it.
          </p>
          {(() => {
            const sources = [
              { name: 'Posts',         n: 60, last: '2 hr',  body: 'Captions, transcripts, on-screen text from your library.' },
              { name: 'Comments',      n: 28, last: '14 m',  body: 'Replies you wrote — voice in conversation.' },
              { name: 'Saves',         n: 15, last: '1 d',   body: 'What you saved as reference. Reveals taste.' },
              { name: 'Web mentions',  n:  8, last: '6 hr',  body: 'Press, podcasts, third-party writeups citing you.' },
            ];
            const total = sources.reduce((acc, s) => acc + s.n, 0);
            const tones = ['var(--accent-primary)', 'var(--fg-primary)', 'var(--accent-primary-press)', 'var(--fg-secondary)'];
            return (
              <>
                <div style={{ display: 'flex', height: 28, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  {sources.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => ms.pushToast && ms.pushToast('Drill signal source · ' + s.name)}
                      title={`${s.name} · ${s.n} signals (${Math.round((s.n/total)*100)}%)`}
                      style={{ width: `${(s.n/total)*100}%`, background: tones[i], cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: i < sources.length - 1 ? '1px solid var(--bg-base)' : 'none' }}>
                      <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 10.5, fontWeight: 700, color: i === 3 ? 'var(--fg-primary)' : 'var(--bg-base)', letterSpacing: '0.04em' }}>
                        {s.n}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 14 }}>
                  {sources.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => ms.pushToast && ms.pushToast('Drill signal source · ' + s.name)}
                      style={{ cursor: 'pointer', padding: '14px 14px 12px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderTop: `3px solid ${tones[i]}`, borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <IL s={9.5}>{s.name}</IL>
                        <IM s={9.5}>{Math.round((s.n/total)*100)}%</IM>
                      </div>
                      <span className="hf-num" style={{ display: 'block', marginTop: 4, fontFamily: I_INT.sans, fontSize: 24, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{s.n}</span>
                      <span style={{ display: 'block', marginTop: 2, fontFamily: I_INT.serif, fontSize: 13, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.4 }}>{s.body}</span>
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <IM s={9}>last update</IM>
                        <IM s={9.5} c="var(--fg-secondary)">{s.last} ago</IM>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* ─── G2-NEW · Fingerprint drift over 90 days ─── */}
          <DoubleRule />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <IL>Fingerprint drift · 90 days</IL>
            <IM s={10}>41% → 33% · 8pp SOFTENING</IM>
          </div>
          <p style={{ margin: '0 0 16px', fontFamily: I_INT.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 720 }}>
            Fingerprint match measures how tightly your last seven posts cling to the median Educator profile. A drop is not a failure — it is the surface area where new pillars are forming.
          </p>
          <div style={{ padding: '20px 22px 18px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            {(() => {
              // 13-week trajectory from 41 → 33, with two pinned events
              const W = 760, H = 180, P = 28;
              const pts = [41,42,41,40,42,40,38,37,36,35,34,34,33];
              const xs = (i) => P + (i / (pts.length - 1)) * (W - P * 2);
              const ys = (v) => P + (1 - (v - 28) / (45 - 28)) * (H - P * 2); // domain 28-45
              const path = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ');
              const fillPath = `${path} L ${xs(pts.length - 1).toFixed(1)} ${(H - P).toFixed(1)} L ${xs(0).toFixed(1)} ${(H - P).toFixed(1)} Z`;
              const events = [
                { i: 3,  v: pts[3],  label: 'Started gear teardowns · day 23',     side: 'top' },
                { i: 9,  v: pts[9],  label: 'Q&A pillar promoted · day 67',         side: 'bottom' },
              ];
              return (
                <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', maxHeight: 220 }}>
                  {/* horizontal grid lines · 30 / 35 / 40 / 45 */}
                  {[30, 35, 40, 45].map((g, i) => (
                    <g key={i}>
                      <line x1={P} x2={W - P} y1={ys(g)} y2={ys(g)} stroke="var(--border-subtle)" strokeWidth="0.6" strokeDasharray="2 4" />
                      <text x={4} y={ys(g) + 3} fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-tertiary)">{g}%</text>
                    </g>
                  ))}
                  {/* x-axis labels */}
                  {['90d ago', '60d', '30d', 'today'].map((lbl, i) => (
                    <text key={i} x={P + (i / 3) * (W - P * 2)} y={H - 6} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-tertiary)">{lbl}</text>
                  ))}
                  {/* area fill · subtle */}
                  <path d={fillPath} fill="var(--accent-primary)" opacity="0.08" />
                  {/* line */}
                  <path d={path} fill="none" stroke="var(--accent-primary)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
                  {/* dots for every week */}
                  {pts.map((v, i) => (
                    <circle key={i} cx={xs(i)} cy={ys(v)} r="2" fill="var(--accent-primary)" />
                  ))}
                  {/* event pins */}
                  {events.map((e, i) => {
                    const x = xs(e.i), y = ys(e.v);
                    const ly = e.side === 'top' ? y - 22 : y + 26;
                    const txtY = e.side === 'top' ? y - 28 : y + 36;
                    return (
                      <g key={i} style={{ cursor: 'pointer' }} onClick={() => ms.pushToast && ms.pushToast('Drift event · ' + e.label)}>
                        <line x1={x} x2={x} y1={y} y2={ly} stroke="var(--fg-primary)" strokeWidth="0.8" />
                        <circle cx={x} cy={y} r="4.5" fill="var(--bg-base)" stroke="var(--fg-primary)" strokeWidth="1.4" />
                        <circle cx={x} cy={y} r="2" fill="var(--fg-primary)" />
                        <text x={x + 6} y={txtY} fontFamily="var(--font-serif)" fontStyle="italic" fontSize="11.5" fill="var(--fg-primary)">{e.label}</text>
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
            <div style={{ display: 'flex', gap: 24, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IM s={9.5}>delta · 90d</IM>
                <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 14, fontWeight: 700, color: 'var(--tone-warning)' }}>−8pp</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IM s={9.5}>volatility</IM>
                <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 14, fontWeight: 700, color: 'var(--fg-primary)' }}>low</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IM s={9.5}>events pinned</IM>
                <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 14, fontWeight: 700, color: 'var(--fg-primary)' }}>2</span>
              </div>
              <span style={{ flex: 1 }} />
              <span
                onClick={() => ms.pushToast && ms.pushToast('Pin a new drift event')}
                style={{ alignSelf: 'center', cursor: 'pointer', fontFamily: I_INT.mono, fontSize: 10.5, color: 'var(--accent-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                pin event +
              </span>
            </div>
          </div>

          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 32 }}>
            {/* Voice */}
            <div>
              <IL>Voice</IL>
              <h3 style={{ margin: '8px 0 12px', fontFamily: I_INT.serif, fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.1 }}>
                Plainspoken, self-deprecating, precise about gear, allergic to hype.
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  ['Average sentence', '12 words', 'Tightens to 7 in shorts'],
                  ['Reading level', 'Grade 7.4', 'Climbs to 10 on technical posts'],
                  ['First-person frequency', '0.41/sentence', 'Higher than 78% of dive creators'],
                  ['Hype words used (last 30d)', '0', 'Forbidden: insane, epic, game-changer, literally, absolute'],
                ].map(([k, v, sub], i) => (
                  <div key={i} style={{ paddingBottom: 12, borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <IM s={10} c="var(--fg-tertiary)">{k}</IM>
                    <div className="hf-num" style={{ fontFamily: I_INT.sans, fontSize: 22, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em', marginTop: 2 }}>{v}</div>
                    <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-secondary)', fontStyle: 'italic' }}>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formats */}
            <div>
              <IL>Formats</IL>
              <h3 style={{ margin: '8px 0 12px', fontFamily: I_INT.serif, fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.1 }}>
                Short safety primer. Long story arc. Almost never a list.
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Safety primer · 30-60s', share: 0.42, n: 65 },
                  { label: 'Story · long-form 8-12m', share: 0.27, n: 42 },
                  { label: 'Gear teardown · 5-8m',   share: 0.18, n: 28 },
                  { label: 'Reply / Q&A · short',    share: 0.09, n: 14 },
                  { label: 'List or carousel',       share: 0.04, n: 7  },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-primary)', flex: 1 }}>{f.label}</span>
                      <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>{f.n}</span>
                    </div>
                    <span style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${f.share * 100}%`, background: 'var(--accent-primary)', borderRadius: 2 }} />
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 22 }}>
                <IL>Hook archetypes you re-use</IL>
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Mistake-first ("I almost…")',
                    'Constraint reveal ("at 18m with 60 bar…")',
                    'Quiet object on water',
                    'Direct rebuttal ("you don\'t need a…")',
                  ].map((h, i) => (
                    <span key={i} style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-primary)', borderLeft: '2px solid var(--accent-primary)', paddingLeft: 10 }}>{h}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Subjects + cadence */}
            <div>
              <IL>Subjects & cadence</IL>
              <h3 style={{ margin: '8px 0 12px', fontFamily: I_INT.serif, fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.1 }}>
                Three pillars, in falling order of yield.
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { p: 'Dive safety', share: '42%', body: 'Best retention. Lowest production cost. The reason people follow.' },
                  { p: 'Gear teardowns', share: '28%', body: 'Brand-friendly. Slowest growth but highest brand-DM yield.' },
                  { p: 'Story / travel', share: '22%', body: 'Highest views. Lowest comment intent — they watch, they don\'t engage.' },
                  { p: 'Replies / Q&A', share: '8%', body: 'Most personal. Smallest audience but highest conversion to subscriber.' },
                ].map((p, i) => (
                  <div key={i} style={{ paddingBottom: 12, borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: I_INT.serif, fontSize: 17, fontWeight: 500, color: 'var(--fg-primary)' }}>{p.p}</span>
                      <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 11, color: 'var(--accent-primary)' }}>{p.share}</span>
                    </div>
                    <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{p.body}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: 16, background: 'var(--surface-2)', borderRadius: 8 }}>
                <IL s={9}>Cadence</IL>
                <span style={{ fontFamily: I_INT.serif, fontSize: 16, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.5, display: 'block', marginTop: 4 }}>
                  Three posts a week. Tuesday and Friday evenings, Sunday morning. You miss the Sunday slot once a month.
                </span>
              </div>
            </div>
          </div>

          {/* ─────── Below the fold · what scrolling reveals ─────── */}

          <DoubleRule />
          <IL>Voice samples · verbatim from your library</IL>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { quote: "I almost didn't get on the boat that morning. The reg was hissing and the swell was wrong. Two minutes later I was glad I went anyway.", from: '0042 · long-form open',     archetype: 'mistake-first' },
              { quote: "At eighteen meters with sixty bar, you don't have many choices. You have one good one and a list of bad ones. Here's how I work the list.", from: '0046 · safety primer',     archetype: 'constraint reveal' },
              { quote: "You don't need a doubles rig to do this dive. You need someone competent on the boat and a plan that fits in one breath.",                  from: '0048 · short reply',       archetype: 'direct rebuttal' },
            ].map((s, i) => (
              <figure key={i} style={{ margin: 0, paddingTop: 14, borderTop: '1px solid var(--fg-primary)' }}>
                <p style={{ margin: 0, fontFamily: I_INT.serif, fontSize: 16, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.6, letterSpacing: '-0.005em' }}>
                  &ldquo;{s.quote}&rdquo;
                </p>
                <figcaption style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                  <IM s={10}>{s.from}</IM>
                  <IM s={10} c="var(--accent-primary)">{s.archetype}</IM>
                </figcaption>
              </figure>
            ))}
          </div>

          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
            <div>
              <IL>Style spectrum · where you sit</IL>
              <div style={{ marginTop: 14, padding: '24px 24px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 22 }}>
                {[
                  { left: 'terse',         right: 'expansive',     pos: 0.32 },
                  { left: 'ironic',        right: 'earnest',       pos: 0.78 },
                  { left: 'technical',     right: 'plain-spoken',  pos: 0.41 },
                  { left: 'certain',       right: 'questioning',   pos: 0.62 },
                ].map((axis, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 110px', gap: 14, alignItems: 'center' }}>
                    <span style={{ fontFamily: I_INT.mono, fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>{axis.left}</span>
                    <div style={{ position: 'relative', height: 4, background: 'var(--surface-2)', borderRadius: 1 }}>
                      <span style={{ position: 'absolute', left: '50%', top: -4, width: 1, height: 12, background: 'var(--border-default)' }} />
                      <span style={{ position: 'absolute', left: `${axis.pos * 100}%`, top: -3, width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-primary)', transform: 'translateX(-50%)' }} />
                    </div>
                    <span style={{ fontFamily: I_INT.mono, fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{axis.right}</span>
                  </div>
                ))}
                <p style={{ margin: 0, fontFamily: I_INT.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                  Plotted across 156 posts. The dot is your median; outliers tend to be replies and Q&A shorts, which skew earnest and questioning.
                </p>
              </div>
            </div>
            <div style={{ paddingLeft: 24, borderLeft: '1px solid var(--border-default)' }}>
              <IL>Last week's drift · 2 flags</IL>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { post: '0048', when: 'Apr 22', flag: 'used "literally" twice', sub: 'Forbidden word per voice rules. COOPR rewrote on draft 2.' },
                  { post: '0046', when: 'Apr 19', flag: 'opened with a question', sub: 'Question-opener archetype is your weakest 0:03. You overrode the suggestion.' },
                ].map((d, i) => (
                  <div key={i} style={{ paddingBottom: 12, borderBottom: i < 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <IM s={10} c="var(--tone-warning)">{d.post.toUpperCase()} · {d.when.toUpperCase()}</IM>
                    </div>
                    <span style={{ display: 'block', fontFamily: I_INT.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.4 }}>{d.flag}</span>
                    <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.sans, fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{d.sub}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, padding: 14, background: 'var(--accent-soft)', borderRadius: 6, borderLeft: '3px solid var(--accent-primary)' }}>
                <IL s={9} c="var(--accent-primary-press)">Forbidden words · last 30d</IL>
                <span style={{ display: 'block', marginTop: 6, fontFamily: I_INT.mono, fontSize: 12, color: 'var(--fg-primary)', letterSpacing: '0.04em' }}>insane · epic · game-changer · literally · absolute</span>
              </div>
            </div>
          </div>

          {/* ─── C2 expansion · DNA Pillars + Voice Signature + Niche Fit + Phrases + Avoid ─── */}
          <DoubleRule />
          <IL>Pillars · share of body × performance lift</IL>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 14 }}>
            {[
              { name: 'Dive safety',    body: '42%', lift: '+18pp', dom: 'short primer · 30-60s', tone: 'success' },
              { name: 'Gear teardowns', body: '28%', lift: '+9pp',  dom: 'long-form · 5-8m',      tone: 'neutral' },
              { name: 'Story / travel', body: '22%', lift: '+4pp',  dom: 'long-form · 8-12m',     tone: 'neutral' },
              { name: 'Replies / Q&A',  body: '8%',  lift: '+22pp', dom: 'short reply · sub-30s', tone: 'success' },
            ].map((p, i) => (
              <div key={i} style={{ position: 'relative', padding: '16px 16px 14px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderTop: '3px solid var(--accent-primary)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  onClick={(e) => { e.stopPropagation(); ms.pushToast && ms.pushToast('Edit pillar · ' + p.name); }}
                  style={{ position: 'absolute', top: 8, right: 10, padding: '2px 4px', cursor: 'pointer', color: 'var(--fg-tertiary)', fontFamily: I_INT.mono, fontSize: 14, lineHeight: 1, letterSpacing: '0.1em' }}
                  title="Edit pillar">⋯</span>
                <IL s={9.5}>{p.name}</IL>
                <span className="hf-num" style={{ fontFamily: I_INT.sans, fontSize: 26, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{p.body}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <IM s={9.5}>lift</IM>
                  <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 12, color: p.tone === 'success' ? 'var(--tone-success)' : 'var(--fg-secondary)', fontWeight: 700 }}>{p.lift}</span>
                </div>
                <span style={{ marginTop: 2, fontFamily: I_INT.serif, fontSize: 12, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.4 }}>{p.dom}</span>
              </div>
            ))}
          </div>

          {/* Voice signature + Niche fit + Phrases + Avoid */}
          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 1fr', gap: 32, marginTop: 14 }}>
            {/* Voice signature with strength bars */}
            <div>
              <IL>Voice signature · 7 traits</IL>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { trait: 'Reflective',    val: 87 },
                  { trait: 'Punchy',        val: 64 },
                  { trait: 'Educational',   val: 71 },
                  { trait: 'Self-deprecating', val: 78 },
                  { trait: 'Technical',     val: 58 },
                  { trait: 'Earnest',       val: 81 },
                  { trait: 'Restrained',    val: 69 },
                ].map((v, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-primary)', flex: 1 }}>{v.trait}</span>
                      <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)' }}>{v.val}</span>
                    </div>
                    <span style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${v.val}%`, background: 'var(--accent-primary)', borderRadius: 2 }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Niche fit · circular indicator + 3 metrics */}
            <div>
              <IL>Niche fit</IL>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 18 }}>
                <svg viewBox="0 0 80 80" width="92" height="92" style={{ flexShrink: 0 }}>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="var(--surface-2)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="var(--accent-primary)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${0.78 * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                    transform="rotate(-90 40 40)" />
                  <text x="40" y="44" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="18" fontWeight="700" fill="var(--fg-primary)">78</text>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <IM s={9.5}>alignment</IM>
                    <span style={{ display: 'block', fontFamily: I_INT.sans, fontSize: 14, fontWeight: 700, color: 'var(--fg-primary)' }}>strong</span>
                  </div>
                  <div>
                    <IM s={9.5}>drift · 30d</IM>
                    <span style={{ display: 'block', fontFamily: I_INT.sans, fontSize: 14, fontWeight: 700, color: 'var(--tone-warning)' }}>+4 toward story</span>
                  </div>
                  <div>
                    <IM s={9.5}>opportunity</IM>
                    <span style={{ display: 'block', fontFamily: I_INT.sans, fontSize: 14, fontWeight: 700, color: 'var(--tone-success)' }}>tech-deep gap</span>
                  </div>
                </div>
              </div>
              <p style={{ marginTop: 14, fontFamily: I_INT.serif, fontSize: 13, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                Your audience expects safety + gear. The drift toward story is healthy below 10. Tech-deep is the underexposed pillar.
              </p>
            </div>

            {/* Top distinctive phrases */}
            <div>
              <IL>Top 5 distinctive phrases</IL>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}>
                {[
                  { phrase: 'I almost didn\'t…',          freq: 18, last: '0048 · 2d' },
                  { phrase: 'at eighteen meters with…',   freq: 14, last: '0046 · 5d' },
                  { phrase: 'you don\'t need a doubles…', freq: 11, last: '0048 · 2d' },
                  { phrase: 'the reg was hissing',         freq: 9,  last: '0044 · 8d' },
                  { phrase: 'one good choice and a list', freq: 7,  last: '0046 · 5d' },
                ].map((p, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none', display: 'grid', gridTemplateColumns: '1fr 32px 70px', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.35 }}>&ldquo;{p.phrase}&rdquo;</span>
                    <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)' }}>{p.freq}×</span>
                    <IM s={9.5} st={{ textAlign: 'right' }}>{p.last}</IM>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What you avoid */}
          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, marginTop: 14 }}>
            <div>
              <IL>What you avoid · 4 patterns</IL>
              <p style={{ marginTop: 8, fontFamily: I_INT.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                Patterns Coopr has watched you reject — by edit, by skip, or by stated rule.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { pattern: 'Hype openers',          body: "No 'insane', 'epic', 'absolute', 'literally'. Removed in 7 of last 7 drafts that contained either." },
                { pattern: 'Question-only opener',  body: "Hooks that begin with a question land at 0:03 below your channel mean. You override the suggestion 5 of 6 times." },
                { pattern: 'Sponsored teardowns',   body: "Gear teardowns are not for sale. Stated explicitly when declining the Apeks gifting on Apr 22." },
                { pattern: 'Non-creditable footage',body: "You will not use other-people's footage without on-screen credit. Even when the licence permits." },
              ].map((a, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: I_INT.mono, fontSize: 14, color: 'var(--accent-primary)', lineHeight: 1, fontWeight: 700 }}>×</span>
                  <div>
                    <span style={{ display: 'block', fontFamily: I_INT.serif, fontSize: 16, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{a.pattern}</span>
                    <span style={{ display: 'block', marginTop: 2, fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{a.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drift trajectory · last 90 days */}
          <DoubleRule />
          <IL>Drift trajectory · 90 days</IL>
          <div style={{ marginTop: 14, padding: '20px 22px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <p style={{ margin: '0 0 14px', fontFamily: I_INT.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
              How each pillar's share has moved. Healthy drift is shallow and reversible; sharp drift in any direction is worth a conversation.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
              {[
                { name: 'Dive safety',    arrow: '↓ 3pp', tone: 'fg-tertiary', body: 'Dropped slightly as gear teardowns climbed.' },
                { name: 'Gear teardowns', arrow: '↑ 4pp', tone: 'tone-success', body: 'Promoted, on the back of brand-DM yield.' },
                { name: 'Story / travel', arrow: '↑ 2pp', tone: 'tone-success', body: 'Two long-form trip arcs added.' },
                { name: 'Replies / Q&A',  arrow: '↓ 3pp', tone: 'tone-warning', body: 'Underweighted — yields high but volume low.' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <IM s={9.5}>{d.name}</IM>
                  <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 16, fontWeight: 700, color: `var(--${d.tone})` }}>{d.arrow}</span>
                  <span style={{ fontFamily: I_INT.sans, fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{d.body}</span>
                </div>
              ))}
            </div>
          </div>

          <IntelFolio section="DNA" next="Memory" />
        </div>
      </div>
    </HfShell>
  );
}

// ─── MEMORY — what Coopr has learned about you ────────────
function HF_IntelMemory({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('intel', 'Memory');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="intel" subtab="Memory"><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="intel" subtab="Memory"><window.HF_EmptyHero
      eyebrow="Memory · 0 lessons stored"
      title="No memory yet. Coopr writes lessons here as you work together."
      caption="Preferences, voice rules, and learned workflow each land in the journal as they emerge."
      ctaLabel="Open Today"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="intel" subtab="Memory"><window.HF_ErrorHero
      title="Couldn't load Memory."
      body="The lessons index timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  const memories = [
    { t: 'Apr 22', kind: 'preference', body: "Henry doesn't want gear teardowns to be sponsored. Stated explicitly when declining the Apeks gifting last week.", confidence: 'stated' },
    { t: 'Apr 19', kind: 'pattern',    body: "When 'narcosis' is in a script, Henry asks for a CCR-vs-OC clarification 4 out of 5 times.", confidence: 'observed' },
    { t: 'Apr 17', kind: 'voice',      body: "Henry rewrites every Coopr-generated draft to remove the word 'simply.'", confidence: 'observed' },
    { t: 'Apr 12', kind: 'preference', body: "Henry prefers ~150 bar reserve mentioned in any wreck-dive script. Cited as 'baseline I'd recommend any OW diver.'", confidence: 'stated' },
    { t: 'Apr 08', kind: 'audience',   body: "Henry's audience reacts 2× more to mistake-first hooks than to mystery hooks. He's overweighting mystery in last 14 days.", confidence: 'observed' },
    { t: 'Apr 05', kind: 'voice',      body: "Henry prefers second person plural ('we') over first-person plural in safety primers. Switched after the 0034 comment thread.", confidence: 'inferred' },
    { t: 'Mar 30', kind: 'workflow',   body: "Henry edits hooks last, not first. Outline → script → frames → hook. Coopr should match this order on /script.", confidence: 'observed' },
    { t: 'Mar 24', kind: 'preference', body: "Henry won't reply to comments calling his ascent rates 'aggressive.' Rejected last 6 suggested replies on this topic.", confidence: 'observed' },
  ];

  return (
    <HfShell workspace="intel" subtab="Memory" subtabRight={<IntelSubtabRight />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '32px 48px 56px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <IntelMasthead
            section="Memory"
            dateline="42 entries · oldest Mar 11 · newest 12m ago"
            edition="Editable record"
            deck="Everything COOPR has learned and is using to match your voice. Each entry is editable — strike one through and the engine forgets it. Promote a stated preference and it becomes a hard rule."
          />

          {/* ─── M-A · Hero verdict band — sentence-answer at the top ─── */}
          <div style={{ marginBottom: 28, padding: '22px 26px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--accent-primary)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
              <IM s={10}>VERDICT · WEEK 17 · APR 17 — APR 24</IM>
              <IM s={9.5} c="var(--fg-tertiary)">MEMORY GROWTH +12 · STRIKES 4 · PROMOTIONS 1</IM>
            </div>
            <h2 style={{ margin: 0, fontFamily: I_INT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 30, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.15 }}>
              318 things you&rsquo;ve learned. Here are the five that matter most this week.
            </h2>
            <p style={{ margin: '8px 0 0', fontFamily: I_INT.serif, fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
              The lessons below are surfacing in 7 of 9 active drafts. Open them in your current draft to apply, or strike them through if the inference is off.
            </p>
          </div>

          {/* ─── M-B · Top 5 most-cited lessons this week ─── */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
              <IL>Most-cited this week · 5 lessons in active drafts</IL>
              <IM s={9.5} c="var(--fg-tertiary)">CITATIONS COUNT FROM APR 17</IM>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {[
                { rank: '01', cites: 9, last: '12m ago', body: "Mistake-first hooks pull 2× the reaction of mystery hooks.",                in: 'draft 0050' },
                { rank: '02', cites: 7, last: '1h ago',  body: "Credit boat captains by name in any wreck-dive script.",                       in: 'draft 0049' },
                { rank: '03', cites: 6, last: '3h ago',  body: "End on the dive itself — never end on the lesson.",                            in: 'draft 0050' },
                { rank: '04', cites: 6, last: 'today',   body: "Reg-on-bench close-up first; wide rig shot second.",                           in: 'draft 0048b' },
                { rank: '05', cites: 5, last: 'today',   body: "Reserve mention required: ~150 bar in any wreck content.",                     in: 'draft 0049' },
              ].map((l, i) => (
                <div
                  key={i}
                  onClick={() => ms.pushToast && ms.pushToast('Open lesson #' + l.rank + ' in ' + l.in)}
                  style={{ padding: '14px 14px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer', transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 11, color: 'var(--accent-primary-press)', fontWeight: 700, letterSpacing: '0.06em' }}>#{l.rank}</span>
                    <IM s={9.5} c="var(--fg-tertiary)">{l.cites}× cited</IM>
                  </div>
                  <span style={{ fontFamily: I_INT.serif, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.4 }}>{l.body}</span>
                  <span style={{ flex: 1 }} />
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                    <IM s={9.5}>{l.last}</IM>
                    <IM s={9.5} c="var(--accent-primary)">→ open in {l.in}</IM>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── M-C · What changed this week — 4-5 recently-added lessons strip ─── */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
              <IL>What changed this week · memory delta</IL>
              <span
                onClick={() => ms.pushToast && ms.pushToast('Filter · last 7 days only')}
                style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid var(--border-default)', fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-secondary)', cursor: 'pointer', letterSpacing: '0.06em' }}>LAST 7 DAYS</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
              {[
                { ts: '12m ago', tag: 'voice',      body: "You won't say 'simply' in any draft.",                          conf: 'observed' },
                { ts: '4h ago',  tag: 'preference', body: "Apeks teardown declined — sponsorship preference, not gear.",   conf: 'stated' },
                { ts: 'yest',    tag: 'pattern',    body: "Tuesday-evening posts pull 2× Tuesday-morning's comments.",      conf: 'observed' },
                { ts: '2d ago',  tag: 'audience',   body: "Mistake-first hooks 2× mystery hooks · sample of 18.",            conf: 'observed' },
                { ts: '3d ago',  tag: 'workflow',   body: "Hook-last edit order — outline, script, frames, then hook.",       conf: 'observed' },
              ].map((c, i) => (
                <div key={i}
                  onClick={() => ms.pushToast && ms.pushToast('Lesson · ' + c.tag + ' · ' + c.ts)}
                  style={{ padding: '14px 14px', borderLeft: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <IM s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 700 }}>{c.ts.toUpperCase()}</IM>
                    <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                    <IM s={9} st={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.tag}</IM>
                  </div>
                  <span style={{ fontFamily: I_INT.serif, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.45 }}>{c.body}</span>
                  <IM s={9.5} c={c.conf === 'stated' ? 'var(--tone-success)' : 'var(--fg-tertiary)'}>{c.conf}</IM>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
            {/* Memory ledger */}
            <div>
              {memories.map((m, i) => (
                <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '90px 100px 1fr 80px', gap: 16, alignItems: 'baseline' }}>
                  <IM s={10}>{m.t}</IM>
                  <span style={{ fontFamily: I_INT.sans, fontSize: 11, color: 'var(--accent-primary-press)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{m.kind}</span>
                  <span style={{ fontFamily: I_INT.serif, fontSize: 17, color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>{m.body}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <IM s={9.5} c={m.confidence === 'stated' ? 'var(--tone-success)' : m.confidence === 'inferred' ? 'var(--tone-warning)' : 'var(--fg-tertiary)'}>
                      {m.confidence}
                    </IM>
                    <IM s={9.5} st={{ textDecoration: 'underline' }}>strike</IM>
                  </div>
                </div>
              ))}
            </div>

            {/* Right rail · how memory works */}
            <aside style={{ paddingTop: 8, borderLeft: '1px solid var(--border-subtle)', paddingLeft: 24 }}>
              <IL>How memory works</IL>
              <p style={{ marginTop: 8, fontFamily: I_INT.serif, fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.65 }}>
                Three sources feed memory: things you state outright, patterns observed across edits and replies, and patterns inferred with lower confidence.
              </p>
              <DoubleRule />
              <IL>This week's additions</IL>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['stated', 4, 'You told Coopr directly'],
                  ['observed', 7, 'Patterns across edits'],
                  ['inferred', 2, 'Lower confidence'],
                ].map(([k, n, sub], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span className="hf-num" style={{ fontFamily: I_INT.sans, fontSize: 22, fontWeight: 700, color: 'var(--fg-primary)' }}>{n}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: I_INT.sans, fontSize: 12, color: 'var(--fg-primary)', fontWeight: 600 }}>{k}</span>
                      <IM s={10} c="var(--fg-tertiary)">{sub}</IM>
                    </div>
                  </div>
                ))}
              </div>
              <DoubleRule />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 6, fontFamily: I_INT.sans, fontSize: 12, color: 'var(--fg-secondary)', fontWeight: 500 }}>
                Export memory as JSON
              </span>
            </aside>
          </div>

          {/* ─────── Below the fold · what scrolling reveals ─────── */}

          <DoubleRule />
          <IL>Older entries · 8 more</IL>
          <div style={{ marginTop: 14 }}>
            {[
              { t: 'Mar 19', kind: 'preference', body: "Henry won't open a script with a question. Six rejected drafts in two weeks; the seventh got rewritten without asking.",                            confidence: 'observed' },
              { t: 'Mar 12', kind: 'voice',      body: "Henry says 'reg' not 'regulator' in shorts. Switches to full word in long-form. Format-aware vocabulary.",                                          confidence: 'observed' },
              { t: 'Mar 08', kind: 'audience',   body: "Henry's audience splits on whether to use technical depth notation in captions. He sides with depth notation; minority is loud.",                  confidence: 'observed' },
              { t: 'Mar 02', kind: 'preference', body: "Henry prefers to mention the boat captain by name in wreck-dive content. 'Credit the local crew.' Said in voice memo on Apr 3.",                     confidence: 'stated' },
              { t: 'Feb 24', kind: 'workflow',   body: "Henry batches three drafts at once on Sunday afternoon, ships them across Tue/Fri/Sun. Don't suggest mid-week composition.",                          confidence: 'observed' },
              { t: 'Feb 14', kind: 'voice',      body: "Henry will never use the word 'literally' or 'absolutely.' Removed in 7 of last 7 drafts that contained either.",                                    confidence: 'observed' },
              { t: 'Feb 02', kind: 'pattern',    body: "When a draft mentions 'narcosis,' Henry adds a callout box about gas planning. 5 of 5 occurrences.",                                                  confidence: 'observed' },
              { t: 'Jan 21', kind: 'preference', body: "Henry rejects sponsorship suggestions involving consumer-electronic dive computers. 'Brand alignment problem.'",                                       confidence: 'stated' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '90px 100px 1fr 80px', gap: 16, alignItems: 'baseline' }}>
                <IM s={10}>{m.t}</IM>
                <span style={{ fontFamily: I_INT.sans, fontSize: 11, color: 'var(--accent-primary-press)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{m.kind}</span>
                <span style={{ fontFamily: I_INT.serif, fontSize: 17, color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>{m.body}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <IM s={9.5} c={m.confidence === 'stated' ? 'var(--tone-success)' : m.confidence === 'inferred' ? 'var(--tone-warning)' : 'var(--fg-tertiary)'}>
                    {m.confidence}
                  </IM>
                  <IM s={9.5} st={{ textDecoration: 'underline' }}>strike</IM>
                </div>
              </div>
            ))}
          </div>

          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <IL>Promoted to rules · last 90d</IL>
              <p style={{ marginTop: 8, fontFamily: I_INT.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                Memories you flagged as hard rules. The engine refuses to suggest anything that violates them.
              </p>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { rule: 'No word "literally."',                              from: 'observed · Apr 17' },
                  { rule: 'Always credit boat captains in wreck-dive scripts.',from: 'stated · Mar 02' },
                  { rule: 'No sponsored gear teardowns.',                       from: 'stated · Apr 22' },
                  { rule: 'Reserve mention required: ~150 bar in wreck content.',from: 'stated · Apr 12' },
                ].map((r, i) => (
                  <div key={i} style={{ padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 6, borderLeft: '3px solid var(--accent-primary)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontFamily: I_INT.serif, fontSize: 14.5, color: 'var(--fg-primary)' }}>{r.rule}</span>
                    <IM s={9.5} c="var(--accent-primary-press)" st={{ flexShrink: 0 }}>{r.from}</IM>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <IL>Forgotten this week · strikes applied</IL>
              <p style={{ marginTop: 8, fontFamily: I_INT.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                Memories you struck through. The engine drops them on next refresh and stops applying the inference.
              </p>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { date: 'Apr 23', body: "Coopr inferred Henry preferred shorter (60-90s) primers based on 3 deletions. Henry struck through it — the deletions were quality issues, not length.", reason: 'wrong inference' },
                  { date: 'Apr 19', body: "Coopr started suggesting Mares-branded gear in teardowns. Henry struck through after the second suggestion — sponsorship preference, not gear preference.", reason: 'preference change' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                      <IM s={10}>{s.date.toUpperCase()}</IM>
                      <IM s={9.5} c="var(--tone-warning)" st={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.reason}</IM>
                    </div>
                    <span style={{ fontFamily: I_INT.serif, fontSize: 14, color: 'var(--fg-tertiary)', lineHeight: 1.55, textDecoration: 'line-through', textDecorationColor: 'var(--fg-tertiary)', textDecorationThickness: 1 }}>{s.body}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── C2 expansion · Memory · search + filter + lessons + lineage + snippets ─── */}
          <DoubleRule />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
            <div>
              <IL>Lessons · 12 entries</IL>
              <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>
                Things Coopr learned alongside you, dated and attributed. Each lesson points back to the moment it formed.
              </span>
            </div>
          </div>

          {/* Search input · pushes a toast on enter */}
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--fg-tertiary)' }}>
              <circle cx="6" cy="6" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9.2 9.2 L12.2 12.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search memory · words you said, lessons Coopr drew, sources cited"
              onKeyDown={(e) => { if (e.key === 'Enter' && ms.pushToast) ms.pushToast('Search memory · ' + (e.currentTarget.value || '<empty>')); }}
              style={{ all: 'unset', flex: 1, fontFamily: I_INT.sans, fontSize: 13, color: 'var(--fg-primary)' }} />
            <span
              onClick={() => ms.pushToast && ms.pushToast('Search memory · everything')}
              style={{ padding: '4px 10px', borderRadius: 999, fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', cursor: 'pointer', letterSpacing: '0.06em' }}>↵</span>
          </div>

          {/* M-D · Suggested searches · 4 example queries below the search input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <IM s={9.5} st={{ flexShrink: 0, textTransform: 'uppercase' }}>try ·</IM>
            {[
              "lessons about hooks",
              "what I rejected this month",
              "rules promoted from observation",
              "things Coopr inferred wrong",
            ].map((q, i) => (
              <span
                key={i}
                onClick={() => ms.pushToast && ms.pushToast('Search · ' + q)}
                style={{
                  padding: '6px 12px', borderRadius: 999,
                  background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
                  fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)',
                  cursor: 'pointer', transition: 'border-color 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                &ldquo;{q}&rdquo;
              </span>
            ))}
          </div>

          {/* Lesson-type filter chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            <IM s={9.5} st={{ flexShrink: 0 }}>type ·</IM>
            {[
              { id: 'insight',  label: 'Insight',  active: true },
              { id: 'mistake',  label: 'Mistake',  active: true },
              { id: 'pattern',  label: 'Pattern',  active: false },
              { id: 'question', label: 'Question', active: false },
            ].map((c) => (
              <span
                key={c.id}
                onClick={() => ms.pushToast && ms.pushToast('Toggle lesson type · ' + c.label)}
                style={{
                  padding: '5px 11px', borderRadius: 999,
                  border: c.active ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  background: c.active ? 'var(--accent-soft)' : 'transparent',
                  color: c.active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                  fontFamily: I_INT.sans, fontSize: 11.5, fontWeight: 600,
                  cursor: 'pointer',
                }}>
                {c.label}
              </span>
            ))}
          </div>

          {/* Lessons list · 12 entries */}
          <div style={{ marginBottom: 28, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            {[
              { t: 'Apr 23', kind: 'insight',  by: 'Coopr', body: "When you mention narcosis, audience comprehension drops unless you cite a pressure or depth. The cure is a callout box, not a paragraph rewrite." },
              { t: 'Apr 19', kind: 'mistake',  by: 'You',   body: "Posted 0048 with the question-opener you keep rejecting. The 0:03 was 71% — your channel mean is 84%." },
              { t: 'Apr 18', kind: 'pattern',  by: 'Coopr', body: "Tuesday-evening posts pull twice the comments of Tuesday-morning posts. The audience checks IG after work, not before." },
              { t: 'Apr 14', kind: 'insight',  by: 'You',   body: "Reg-teardown drafts that show the reg-on-bench close-up first outperform drafts that lead with a wide rig shot." },
              { t: 'Apr 11', kind: 'question', by: 'Coopr', body: "Open question: does the second post in a series outperform the first because of the warm audience, or because the second hook is sharper?" },
              { t: 'Apr 09', kind: 'mistake',  by: 'You',   body: "0046 ran without the boat-captain credit. Caught after publish. Promoted to a hard rule." },
              { t: 'Apr 06', kind: 'pattern',  by: 'Coopr', body: "Long-form posts that break to a black title card at minute 3 retain 1.4× the long-form posts that don't." },
              { t: 'Apr 02', kind: 'insight',  by: 'Coopr', body: "Replies to safety-rule questions land best when you state the rule, then narrate one personal mistake that taught it to you." },
              { t: 'Mar 30', kind: 'mistake',  by: 'You',   body: "Suggested an Apeks teardown after declining gifting. Inferred wrongly that the decline was about timing." },
              { t: 'Mar 26', kind: 'pattern',  by: 'Coopr', body: "Carousel posts cap at six cards. Card seven and eight see save-rate fall by half each." },
              { t: 'Mar 22', kind: 'question', by: 'Coopr', body: "Open question: do mistake-first hooks fatigue after consecutive uses? Sample size is 5 — too thin to call." },
              { t: 'Mar 18', kind: 'insight',  by: 'You',   body: "When in doubt, end on the dive itself. Don't end on the lesson. Audience is here for the place." },
            ].map((m, i) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: i < 11 ? '1px solid var(--border-subtle)' : 'none', display: 'grid', gridTemplateColumns: '70px 90px 1fr 70px', gap: 14, alignItems: 'baseline' }}>
                <IM s={10}>{m.t}</IM>
                <span style={{ fontFamily: I_INT.sans, fontSize: 10.5, color: m.kind === 'mistake' ? 'var(--tone-warning)' : m.kind === 'question' ? 'var(--accent-primary)' : 'var(--accent-primary-press)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{m.kind}</span>
                <span style={{ fontFamily: I_INT.serif, fontSize: 14.5, color: 'var(--fg-primary)', lineHeight: 1.5, letterSpacing: '-0.005em' }}>{m.body}</span>
                <span
                  onClick={() => ms.pushToast && ms.pushToast('Open lesson · ' + m.t)}
                  style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
                  by {m.by}
                </span>
              </div>
            ))}
          </div>

          {/* M-E · Lineage timeline · horizontal flow w/ clay-line connectors + clickable nodes */}
          <DoubleRule />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
            <div>
              <IL>Lineage · how four ideas walked through your library</IL>
              <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>
                Each row is one idea. Each node is a post that carried it forward. Click a node to read the moment.
              </span>
            </div>
            <span
              onClick={() => ms.pushToast && ms.pushToast('Lineage · expand all 11 arcs')}
              style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid var(--border-default)', fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-secondary)', cursor: 'pointer', letterSpacing: '0.06em' }}>SEE ALL 11 ARCS</span>
          </div>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 26 }}>
            {[
              {
                idea: "Mistake-first opener",
                meta: 'observed Mar 14 · promoted Apr 22 · 12 citations',
                steps: [
                  { post: '0036', when: 'Mar 14', body: "First tried as 'I almost got bent on this dive.' Retention at 0:03 was 71% — below channel mean.",         tag: 'first try' },
                  { post: '0042', when: 'Apr 04', body: "Tightened to 'I almost didn't get on the boat.' Hook lands at 0:01. Retention 84% — at channel mean.",   tag: 'tightened' },
                  { post: '0046', when: 'Apr 18', body: "Combined with constraint reveal. New hybrid template emerged.",                                              tag: 'hybrid' },
                  { post: '0048', when: 'Apr 22', body: "Shipped as the default opener for safety primers. Retention 89% — channel mean +5pp.",                       tag: 'default' },
                ],
              },
              {
                idea: "Single-object black-frame hook",
                meta: 'inspired Mar 28 · promoted Apr 22 · 8 citations',
                steps: [
                  { post: '@silke',  when: 'Mar 28', body: "First saved as inspiration tile i01.",                                          tag: 'inspired' },
                  { post: '0044',    when: 'Apr 11', body: "Tested in feed; retention 84% — equal to channel mean.",                         tag: 'tested' },
                  { post: '0048',    when: 'Apr 22', body: "Re-tested with a single fin; retention 89%. Promoted to default.",                tag: 'promoted' },
                ],
              },
              {
                idea: "Boat-captain credit rule",
                meta: 'observed Feb 28 · rule Apr 02 · 6 citations · hard rule',
                steps: [
                  { post: '0034', when: 'Feb 28', body: "Noticed the absence. Added as observed memory.",                                   tag: 'noticed' },
                  { post: '0040', when: 'Apr 02', body: "Stated outright in voice memo. Promoted to a hard rule.",                          tag: 'promoted' },
                  { post: '0046', when: 'Apr 18', body: "Missed on first draft — Coopr caught and inserted before publish.",                tag: 'enforced' },
                ],
              },
              {
                idea: "Reg-on-bench close-up first",
                meta: 'observed Apr 14 · 4 citations · still forming',
                steps: [
                  { post: '0044', when: 'Apr 11', body: "Tested wide rig shot first — save rate 0.9× mean.",                                tag: 'baseline' },
                  { post: '0046', when: 'Apr 18', body: "Reversed; reg-on-bench leads. Save rate 1.4× mean.",                               tag: 'reversed' },
                  { post: '0048', when: 'Apr 22', body: "Pattern holds — save rate 1.6× mean. Likely promotion next week.",                  tag: 'holds' },
                ],
              },
            ].map((arc, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 18, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{arc.idea}</span>
                  <IM s={9.5} c="var(--fg-tertiary)">{arc.meta.toUpperCase()}</IM>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${arc.steps.length}, 1fr)`, alignItems: 'stretch', gap: 0, position: 'relative' }}>
                  {arc.steps.map((step, j) => {
                    const isLast = j === arc.steps.length - 1;
                    return (
                      <div
                        key={j}
                        onClick={() => ms.pushToast && ms.pushToast('Open node · ' + step.post + ' · ' + step.when)}
                        style={{ position: 'relative', paddingRight: isLast ? 0 : 14, cursor: 'pointer' }}>
                        {/* Connector line — clay-toned, sweeps to next node */}
                        {!isLast && (
                          <svg width="100%" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" style={{ position: 'absolute', left: 8, top: 4, width: 'calc(100% - 8px)', pointerEvents: 'none' }} aria-hidden="true">
                            <path d="M 0 7 Q 100 7 200 7" fill="none" stroke="var(--accent-primary)" strokeWidth="1.2" opacity="0.65" />
                          </svg>
                        )}
                        {/* Node dot · double ring for emphasis */}
                        <span style={{ position: 'relative', display: 'inline-block', width: 14, height: 14, marginBottom: 8 }}>
                          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                          <span style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1px solid var(--accent-primary)', opacity: 0.45 }} />
                        </span>
                        <IM s={9.5} c="var(--accent-primary-press)">{step.post.toUpperCase()} · {step.when}</IM>
                        <span style={{ display: 'block', marginTop: 2, fontFamily: I_INT.mono, fontSize: 9, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{step.tag}</span>
                        <span style={{ display: 'block', marginTop: 6, fontFamily: I_INT.sans, fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5, paddingRight: 8 }}>{step.body}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Highlighted snippets · pulled from research, comments, scripts */}
          <DoubleRule />
          <IL>Highlighted snippets · 7 from research, comments, and scripts</IL>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            {[
              { src: 'comment · 0042', body: "&ldquo;Finally a creator who doesn't make me feel stupid for asking what bar means at depth.&rdquo;",                                    kind: 'audience' },
              { src: 'script · 0046',  body: "&ldquo;At eighteen meters with sixty bar, you don't have many choices. You have one good one and a list of bad ones.&rdquo;", kind: 'voice' },
              { src: 'research · trend equipment-first', body: "&ldquo;Three creators in your near-niche posted long-form videos this week where the gear is a character, not a checklist.&rdquo;", kind: 'pattern' },
              { src: 'comment · 0046', body: "&ldquo;The reg-on-bench close-up made me check my own setup before my next dive.&rdquo;",                                              kind: 'audience' },
              { src: 'script · 0048',  body: "&ldquo;You don't need a doubles rig to do this dive. You need someone competent on the boat.&rdquo;",                                  kind: 'voice' },
              { src: 'research · safety-primer outperform 2:1', body: "&ldquo;Vertical safety primers cluster at 0:03 retention 1.4× the horizontal cuts of the same content.&rdquo;",       kind: 'pattern' },
              { src: 'voice memo · Apr 22', body: "&ldquo;I won't sponsor a teardown. The teardown only has weight if I bought the gear.&rdquo;",                                  kind: 'rule' },
            ].map((sn, i) => (
              <figure key={i} style={{ margin: 0, padding: '14px 16px', background: 'var(--surface-1)', borderLeft: `3px solid ${sn.kind === 'rule' ? 'var(--accent-primary)' : sn.kind === 'pattern' ? 'var(--tone-success)' : 'var(--border-default)'}`, borderRadius: 4 }}>
                <p style={{ margin: 0, fontFamily: I_INT.serif, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.55 }}
                   dangerouslySetInnerHTML={{ __html: sn.body }} />
                <figcaption style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <IM s={9.5}>{sn.src}</IM>
                  <IM s={9.5} c="var(--accent-primary)">{sn.kind}</IM>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Source distribution · who taught Coopr what */}
          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 14 }}>
            <div>
              <IL>Source · who taught Coopr</IL>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { src: 'You · stated outright',   n: 18, share: 0.34 },
                  { src: 'Coopr · observed pattern',n: 27, share: 0.50 },
                  { src: 'Coopr · inferred low',    n: 9,  share: 0.16 },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-primary)', flex: 1 }}>{r.src}</span>
                      <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>{r.n}</span>
                    </div>
                    <span style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${r.share * 100}%`, background: 'var(--accent-primary)', borderRadius: 2 }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ paddingLeft: 24, borderLeft: '1px solid var(--border-default)' }}>
              <IL>Confidence · how sure Coopr is</IL>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { k: 'Stated',   v: '18 / 54', sub: 'highest weight in suggestions',   tone: 'tone-success' },
                  { k: 'Observed', v: '27 / 54', sub: 'medium weight; can be overruled', tone: 'fg-tertiary' },
                  { k: 'Inferred', v: '9 / 54',  sub: 'softest weight; struck most',     tone: 'tone-warning' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${r.tone})`, flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontFamily: I_INT.sans, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>{r.k}</span>
                      <IM s={9.5}>{r.sub}</IM>
                    </div>
                    <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 700 }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* M-F · Cross-reference matrix · 5×5 co-citation heatmap */}
          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 32, marginTop: 14 }}>
            <div>
              <IL>Cross-reference matrix · 5 lessons × 5 lessons</IL>
              <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>
                How often two lessons get cited together. Darker means tighter pairing. Click a cell to read the drafts that pair them.
              </span>
              {(() => {
                const labels = ['mistake-first', 'boat credit', 'end on dive', 'reg close-up', '~150 bar reserve'];
                // co-citation matrix · symmetric · 0..9 strength
                const grid = [
                  [9, 4, 6, 3, 2],
                  [4, 9, 2, 1, 7],
                  [6, 2, 9, 4, 1],
                  [3, 1, 4, 9, 2],
                  [2, 7, 1, 2, 9],
                ];
                const cellPx = 56;
                return (
                  <div style={{ marginTop: 14, display: 'inline-block' }}>
                    {/* column header row */}
                    <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${labels.length}, ${cellPx}px)`, gap: 0 }}>
                      <span />
                      {labels.map((l, j) => (
                        <span key={j} style={{ width: cellPx, height: 64, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {l}
                        </span>
                      ))}
                    </div>
                    {grid.map((row, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: `120px repeat(${labels.length}, ${cellPx}px)`, gap: 0 }}>
                        <span style={{ paddingRight: 12, height: cellPx, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>
                          {labels[i]}
                        </span>
                        {row.map((v, j) => {
                          const isDiag = i === j;
                          const op = isDiag ? 0.06 : 0.08 + (v / 9) * 0.7;
                          return (
                            <span
                              key={j}
                              onClick={() => !isDiag && ms.pushToast && ms.pushToast('Cross-ref · ' + labels[i] + ' × ' + labels[j] + ' · ' + v + ' co-citations')}
                              style={{
                                width: cellPx, height: cellPx,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isDiag ? 'var(--surface-2)' : `rgba(196, 92, 47, ${op})`,
                                border: '1px solid var(--bg-base)',
                                fontFamily: I_INT.mono, fontSize: 11, fontWeight: 700,
                                color: isDiag ? 'var(--fg-tertiary)' : (v >= 6 ? 'var(--accent-primary-press)' : 'var(--fg-secondary)'),
                                cursor: isDiag ? 'default' : 'pointer',
                              }}>
                              {isDiag ? '·' : v}
                            </span>
                          );
                        })}
                      </div>
                    ))}
                    {/* legend */}
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IM s={9.5} c="var(--fg-tertiary)">CO-CITATION ·</IM>
                      <span style={{ display: 'flex', gap: 0 }}>
                        {[1, 3, 5, 7, 9].map((v, k) => (
                          <span key={k} style={{ width: 18, height: 10, background: `rgba(196, 92, 47, ${0.08 + (v / 9) * 0.7})`, border: '1px solid var(--bg-base)' }} />
                        ))}
                      </span>
                      <IM s={9.5} c="var(--fg-tertiary)">LIGHT → TIGHT</IM>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div style={{ paddingLeft: 24, borderLeft: '1px solid var(--border-default)' }}>
              <IL>Tightest pairings · what travels together</IL>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { a: 'boat credit',     b: '~150 bar reserve', n: 7, sub: 'wreck-dive scripts always carry both' },
                  { a: 'mistake-first',   b: 'end on dive',      n: 6, sub: 'safety primers; the arc you trust' },
                  { a: 'mistake-first',   b: 'boat credit',      n: 4, sub: 'when the mistake is operational' },
                  { a: 'end on dive',     b: 'reg close-up',     n: 4, sub: 'gear pieces stay specific' },
                ].map((p, i) => (
                  <div
                    key={i}
                    onClick={() => ms.pushToast && ms.pushToast('Pairing · ' + p.a + ' × ' + p.b)}
                    style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontFamily: I_INT.serif, fontSize: 13.5, color: 'var(--fg-primary)' }}>
                        <span style={{ fontStyle: 'italic' }}>{p.a}</span> × <span style={{ fontStyle: 'italic' }}>{p.b}</span>
                      </span>
                      <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 13, color: 'var(--accent-primary-press)', fontWeight: 700 }}>{p.n}</span>
                    </div>
                    <IM s={10} st={{ marginTop: 4 }}>{p.sub}</IM>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Memory · summary tiles */}
          <DoubleRule />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 14 }}>
            {[
              { k: 'Lessons stored',          v: '54',   sub: '12 this month' },
              { k: 'Promoted to rules',       v: '11',   sub: 'engine refuses to violate' },
              { k: 'Struck-through · 30d',    v: '4',    sub: 'forgotten on next refresh' },
              { k: 'Retention half-life',     v: '142d', sub: 'avg before re-confirmed' },
            ].map((t, i) => (
              <div key={i} style={{ padding: '14px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <IM s={9.5}>{t.k}</IM>
                <span className="hf-num" style={{ fontFamily: I_INT.sans, fontSize: 26, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{t.v}</span>
                <IM s={10} c="var(--fg-tertiary)">{t.sub}</IM>
              </div>
            ))}
          </div>

          <IntelFolio section="Memory" next="Studies" />
        </div>
      </div>
    </HfShell>
  );
}

// ─── STUDIES — saved investigations & reports ─────────────
function HF_IntelStudies({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('intel', 'Studies');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="intel" subtab="Studies"><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="intel" subtab="Studies"><window.HF_EmptyHero
      eyebrow="Studies · 0 saved"
      title="No studies open. Ask a question worth tracking."
      caption="A study is a question Coopr runs across your library and tracks over time."
      ctaLabel="Open Today"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="intel" subtab="Studies"><window.HF_ErrorHero
      title="Couldn't load the studies list."
      body="The investigation index timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  const studies = [
    { t: 'Mar 14', title: "Why dive-safety retention drops at minute three", n: 14, kind: 'retention', status: 'closed · published as 0046 hook', open: false, body: "Cross-cut of 12 long-form posts where retention drops between 2:45 and 3:30. Identified the silent-cut-after-on-camera problem." },
    { t: 'Mar 02', title: "Brand-DM yield vs creator size", n: 8,  kind: 'brand', status: 'open · monthly refresh', open: true, body: "Tracking which categories of brand DMs convert in the 100-500k follower band. Mares and Suunto are 4× yield of dive-shop sponsorships." },
    { t: 'Feb 18', title: "The cost of a Tuesday miss", n: 6,  kind: 'cadence', status: 'open · ongoing', open: true, body: "Quantifying what a missed Tuesday post costs in subscriber growth. Two-week effect, not one-week." },
    { t: 'Feb 02', title: "Hook-length sweet spot · short form", n: 11, kind: 'hooks', status: 'closed · informs every short', open: false, body: "Hooks under 1.2 seconds cluster at 0:03 retention 1.4× the 1.2-2.5s band, but require a single visual focal point." },
    { t: 'Jan 21', title: "Cross-platform repurposing economics", n: 9,  kind: 'multi', status: 'closed', open: false, body: "Reels repurposed to TikTok within 24h see 0.6× the views; same Reels repurposed at 7+ days see 1.1×. The why is unclear." },
  ];
  // S-A · Active studies as case files — kicker mono · serif italic title 28pt ·
  // abstract · word count + last-edit + reading time · 2 inline chart previews ·
  // 'Open study' primary + 'Snapshot' secondary. Click → toast.
  const activeStudies = [
    { id: 'st-031', n: '03', kicker: 'STUDY 03 · ACTIVE · 1.8k WORDS',     title: "What turns a one-time viewer into a saver",                        words: 1840, edited: 'edited 2h ago',  read: '7 min read', abstract: "Cross-section of 142 posts looking at the moment-of-save. Hypothesis: the save fires when a frame names the viewer's specific situation back to them — not when the post is broadly useful.", chart: 'bars' },
    { id: 'st-029', n: '02', kicker: 'STUDY 02 · ACTIVE · 1.2k WORDS',     title: "Why the second post in a series outperforms the first",            words: 1240, edited: 'edited yesterday', read: '5 min read', abstract: "Pulling six multi-part series. The opener sets premise; the follow-up converts the warm audience. Quantifying the lift and the half-life of the warmth.", chart: 'line' },
    { id: 'st-028', n: '01', kicker: 'STUDY 01 · OUTLINE · 0.6k WORDS',    title: "Cold-open length and the feed-scroll moment",                       words: 620,  edited: 'edited 3d ago',   read: '3 min read', abstract: "Hooks under 1.2s scroll-stop in feed; longer hooks succeed only when the first frame is anomalous. Categorising the anomaly types.", chart: 'scatter' },
  ];
  // S-B · Done studies dense list · 9 closed studies — mono date + serif italic title +
  // 1-line takeaway + tags + 6-point sparkline of citations over time. Click → toast.
  const doneStudies = [
    { d: 'Mar 14', title: "Why dive-safety retention drops at minute three",     take: "Silent cut after on-camera causes the drop. Voice-over riding the cut is the cure.",      tags: ['retention', 'long-form'], cites: [1, 3, 4, 6, 7, 9] },
    { d: 'Feb 02', title: "Hook-length sweet spot · short form",                  take: "Sub-1.2s hooks cluster at 0:03 retention 1.4× higher — single focal point required.",      tags: ['hooks', 'short-form'],    cites: [2, 4, 5, 6, 7, 7] },
    { d: 'Jan 21', title: "Cross-platform repurposing economics",                 take: "Reels re-cut to TikTok within 24h see 0.6× views; at 7+ days, 1.1×.",                       tags: ['multi-channel'],          cites: [1, 2, 2, 3, 4, 5] },
    { d: 'Jan 08', title: "Sunday vs Monday morning · which slot wins",           take: "Sunday wins for story; Monday wins for gear. Don't post gear on Sunday.",                  tags: ['cadence'],                cites: [3, 5, 6, 8, 8, 9] },
    { d: 'Dec 18', title: "Comment-prompt copy that actually pulls replies",      take: "First-person memory prompts pull 3× the replies of generic openers.",                      tags: ['comments', 'voice'],      cites: [2, 3, 4, 4, 5, 6] },
    { d: 'Dec 02', title: "Carousel post lengths and save rate",                  take: "Six-card carousels save 1.5× a five-card. Eight is the ceiling.",                          tags: ['carousel', 'saves'],      cites: [1, 2, 3, 5, 6, 8] },
    { d: 'Nov 14', title: "DM warm-intro decay over time",                        take: "Warm intros lose 40% of conversion power after the first 14 days.",                        tags: ['brand', 'inbox'],         cites: [4, 5, 5, 4, 3, 3] },
    { d: 'Nov 04', title: "Long-form chapter markers and rewatch behaviour",     take: "Posts with named chapters see 2.2× re-watch on the chapter most-watched.",                tags: ['long-form', 'rewatch'],   cites: [2, 3, 5, 6, 7, 7] },
    { d: 'Oct 22', title: "Vertical vs square framing for IG saves",              take: "Square saves more on educational; vertical saves more on story.",                          tags: ['framing', 'saves'],       cites: [1, 1, 2, 2, 3, 4] },
  ];
  return (
    <HfShell workspace="intel" subtab="Studies" subtabRight={<IntelSubtabRight />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '32px 48px 56px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <IntelMasthead
            section="Studies"
            dateline="11 saved · 3 open · 8 closed"
            edition="Investigations"
            deck="Saved investigations into your own work. Each one is a question Coopr ran across your library and tracked the answer over time. Open ones refresh on cadence; closed ones froze when you shipped on the finding."
          />

          {/* Section header bar · + Start a study CTA pill */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
            <IL>Active investigations · in progress</IL>
            <span
              onClick={() => ms.pushModal && ms.pushModal('ModalNewDoc')}
              style={{
                padding: '7px 14px',
                border: '1px solid var(--accent-primary)',
                borderRadius: 999,
                background: 'var(--accent-soft)',
                color: 'var(--accent-primary-press)',
                fontFamily: I_INT.mono, fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}>+ Start a study</span>
          </div>

          {/* S-A · Active studies row · 3 publication-style case files */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border-subtle)' }}>
            {activeStudies.map((st) => (
              <div
                key={st.id}
                style={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '3px solid var(--accent-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 22px',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                {/* kicker mono */}
                <IM s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 700 }}>{st.kicker}</IM>
                {/* title serif italic 28pt */}
                <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 28, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.1 }}>
                  {st.title}
                </span>
                {/* abstract serif italic 13pt */}
                <p style={{ margin: 0, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {st.abstract}
                </p>
                {/* inline chart previews · 2 small SVGs side by side */}
                <div style={{ marginTop: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {/* preview 1 · spark of word-count growth */}
                  <div style={{ padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>
                    <IM s={9} c="var(--fg-tertiary)">WORD COUNT · 14d</IM>
                    <svg viewBox="0 0 110 28" width="100%" height="28" style={{ display: 'block', marginTop: 4 }} aria-hidden="true">
                      <polyline
                        points="0,24 12,22 24,18 36,17 48,12 60,11 72,9 84,7 96,5 108,4"
                        fill="none" stroke="var(--accent-primary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="108" cy="4" r="2" fill="var(--accent-primary)" />
                    </svg>
                  </div>
                  {/* preview 2 · varies by chart kind */}
                  <div style={{ padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>
                    <IM s={9} c="var(--fg-tertiary)">{st.chart === 'bars' ? 'SAVES BY FRAME TYPE' : st.chart === 'line' ? 'WARM AUDIENCE LIFT' : 'HOOK LEN × RETENTION'}</IM>
                    <svg viewBox="0 0 110 28" width="100%" height="28" style={{ display: 'block', marginTop: 4 }} aria-hidden="true">
                      {st.chart === 'bars' && [10, 18, 22, 14, 8, 24, 16].map((h, k) => (
                        <rect key={k} x={4 + k * 15} y={28 - h} width="9" height={h} fill="var(--accent-primary)" opacity={0.4 + (h / 24) * 0.6} />
                      ))}
                      {st.chart === 'line' && (
                        <>
                          <polyline points="0,22 18,20 36,16 54,11 72,8 90,9 108,6" fill="none" stroke="var(--accent-primary)" strokeWidth="1.4" />
                          <polyline points="0,24 18,23 36,22 54,21 72,20 90,19 108,18" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
                        </>
                      )}
                      {st.chart === 'scatter' && [[8,18],[18,12],[28,14],[40,8],[52,5],[62,9],[74,6],[86,4],[98,3]].map(([cx,cy],k) => (
                        <circle key={k} cx={cx} cy={cy} r={2 + (k % 2)} fill="var(--accent-primary)" opacity={0.5 + (k * 0.05)} />
                      ))}
                    </svg>
                  </div>
                </div>
                {/* meta strip */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <span className="hf-num" style={{ fontFamily: I_INT.mono, fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)' }}>
                    {st.words.toLocaleString()} <span style={{ fontWeight: 400, color: 'var(--fg-tertiary)' }}>words</span>
                  </span>
                  <IM s={10} c="var(--fg-tertiary)">·</IM>
                  <IM s={10}>{st.edited}</IM>
                  <IM s={10} c="var(--fg-tertiary)">·</IM>
                  <IM s={10}>{st.read}</IM>
                </div>
                <span style={{ flex: 1 }} />
                {/* dual CTAs · primary + secondary */}
                <div style={{ display: 'flex', alignItems: 'stretch', gap: 8, marginTop: 4 }}>
                  <span
                    onClick={() => ms.pushToast && ms.pushToast('Open study · ' + st.id)}
                    style={{
                      flex: 1, padding: '8px 14px', textAlign: 'center',
                      background: 'var(--accent-primary)', color: 'var(--fg-on-accent, #fff)',
                      borderRadius: 6, fontFamily: I_INT.sans, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer',
                    }}>Open study</span>
                  <span
                    onClick={(e) => { e.stopPropagation && e.stopPropagation(); ms.pushToast && ms.pushToast('Snapshot · ' + st.id); }}
                    style={{
                      padding: '8px 14px', textAlign: 'center',
                      background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)',
                      borderRadius: 6, fontFamily: I_INT.sans, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer',
                    }}>Snapshot</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lead study */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '3px solid var(--fg-primary)' }}>
            <IL>Open · longest-running</IL>
            <h2 style={{ margin: '6px 0 8px', fontFamily: I_INT.serif, fontWeight: 600, fontSize: 36, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Brand-DM yield vs creator size
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12 }}>
              <IM s={10}>started Mar 02</IM>
              <IM s={10}>·</IM>
              <IM s={10}>refreshes monthly</IM>
              <IM s={10}>·</IM>
              <IM s={10}>8 data points · 4 conclusions</IM>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
              <p className="hf-dropcap" style={{ margin: 0, fontFamily: I_INT.serif, fontSize: 17, color: 'var(--fg-primary)', lineHeight: 1.65 }}>
                Mares and Suunto are running 4× the yield of dive-shop sponsorships at your follower count, with twice the editorial freedom. Aqualung is an outlier — high yield but tightly scripted. The category that surprises is dive-insurance brands; small audiences but durable, multi-quarter contracts. The data underpins the response template you're now using on cold brand DMs.
              </p>
              <div style={{ paddingLeft: 24, borderLeft: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <IL s={9}>Latest finding · Apr 22</IL>
                  <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)' }}>"Insurance brands give a 14-month average runway versus 2.4 months for shops."</span>
                </div>
                <div>
                  <IL s={9}>Action taken</IL>
                  <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-primary)' }}>Cold-DM template updated · Apr 6.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Study list */}
          <IL>All studies</IL>
          <div style={{ marginTop: 12 }}>
            {studies.map((s, i) => (
              <div key={i} style={{ padding: '20px 0', borderTop: i === 0 ? '1px solid var(--border-subtle)' : 'none', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '90px 1fr 200px', gap: 18, alignItems: 'baseline' }}>
                <IM s={10}>{s.t}</IM>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.open ? 'var(--accent-primary)' : 'var(--fg-tertiary)' }} />
                    <IM s={9.5} c={s.open ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'} st={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                      {s.kind} · {s.open ? 'open' : 'closed'}
                    </IM>
                  </div>
                  <span style={{ fontFamily: I_INT.serif, fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{s.title}</span>
                  <p style={{ margin: '6px 0 0', fontFamily: I_INT.sans, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>{s.body}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <IM s={9.5}>{s.n} data points</IM>
                  <span style={{ fontFamily: I_INT.sans, fontSize: 11.5, fontStyle: 'italic', color: 'var(--fg-secondary)', textAlign: 'right' }}>{s.status}</span>
                  <IM s={10} c="var(--accent-primary)" st={{ marginTop: 4 }}>↗ open</IM>
                </div>
              </div>
            ))}
          </div>

          {/* ─────── Below the fold · what scrolling reveals ─────── */}

          <DoubleRule />
          <IL>Closed studies · what we learned</IL>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
            {[
              { study: 'The cost of a Tuesday miss',          finding: "Two-week subscriber growth lag. Roughly 380 net new subs displaced per missed slot. Friday recovers half; Sunday recovers none.",                                                          informed: 'Calendar lock · Apr 6' },
              { study: 'Hook-length sweet spot · short form', finding: "Hooks under 1.2 seconds cluster at 0:03 retention 1.4× the 1.2-2.5s band, but require a single visual focal point. Multi-cut openers under 1.2s underperform.",                       informed: 'Every short since Mar 04' },
              { study: 'Cross-platform repurposing economics', finding: "Reels re-cut to TikTok within 24h see 0.6× the views; same Reels at 7+ days see 1.1×. The why is unclear — likely an algorithm dampening signal.",                                       informed: 'Repurpose schedule · Mar 12' },
              { study: 'Why dive-safety retention drops at minute three', finding: "Cross-cut of 12 long-form posts where retention drops between 2:45 and 3:30. Identified the silent-cut-after-on-camera problem. Cure: voice-over riding the cut.",         informed: '0046 hook + every long-form since' },
            ].map((c, i) => (
              <figure key={i} style={{ margin: 0, paddingTop: 14, borderTop: '1px solid var(--fg-primary)' }}>
                <IL s={9.5}>{c.study}</IL>
                <p style={{ margin: '8px 0 0', fontFamily: I_INT.serif, fontSize: 16, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
                  &ldquo;{c.finding}&rdquo;
                </p>
                <figcaption style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <IM s={10} c="var(--accent-primary)">INFORMED · {c.informed.toUpperCase()}</IM>
                </figcaption>
              </figure>
            ))}
          </div>

          <DoubleRule />
          <IL>Pending questions · studies you've started but not kicked off</IL>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { q: "Does mistake-first hook fatigue after N consecutive uses?",     est: '6-8 weeks · 14 long-forms', cost: 'low' },
              { q: "What's the half-life of a brand-DM warm intro?",               est: '90 days · monthly cohort',   cost: 'medium' },
              { q: "Are Sunday morning posts cannibalising Monday's commute peak?", est: '4 weeks · A/B 8 slots',     cost: 'high' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '14px 14px', background: 'var(--surface-1)', border: '1px dashed var(--border-default)', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontFamily: I_INT.serif, fontSize: 17, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.3 }}>&ldquo;{p.q}&rdquo;</span>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <IM s={10}>{p.est}</IM>
                  <IM s={10} c={p.cost === 'low' ? 'var(--tone-success)' : p.cost === 'high' ? 'var(--tone-warning)' : 'var(--fg-tertiary)'}>{p.cost.toUpperCase()} COST</IM>
                </div>
                <span style={{ flex: 1 }} />
                <IM s={10} c="var(--accent-primary)">↗ kick off</IM>
              </div>
            ))}
          </div>

          {/* S-B · Done studies dense list · enriched rows w/ tags + citations sparkline */}
          <DoubleRule />
          <IL>Done · 9 closed studies the work now stands on</IL>
          <div style={{ marginTop: 14, marginBottom: 32 }}>
            {doneStudies.map((d, i) => {
              const maxCite = Math.max.apply(null, d.cites);
              const sparkW = 76, sparkH = 22, step = sparkW / (d.cites.length - 1);
              const sparkPts = d.cites.map((v, k) => `${k * step},${sparkH - (v / maxCite) * (sparkH - 4) - 2}`).join(' ');
              return (
                <div
                  key={i}
                  onClick={() => ms.pushToast && ms.pushToast('Open study · ' + d.title)}
                  style={{
                    display: 'grid', gridTemplateColumns: '74px 1fr 1.2fr 100px 86px 24px',
                    gap: 16, padding: '14px 0', alignItems: 'baseline',
                    borderTop: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'opacity 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}>
                  <IM s={10}>{d.d}</IM>
                  <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.35 }}>
                    {d.title}
                  </span>
                  <span style={{ fontFamily: I_INT.sans, fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                    {d.take}
                  </span>
                  {/* tags · pill cluster */}
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {d.tags.map((tg, k) => (
                      <span key={k} style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--surface-2)', fontFamily: I_INT.mono, fontSize: 9, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {tg}
                      </span>
                    ))}
                  </span>
                  {/* sparkline · citations over time */}
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} aria-hidden="true">
                      <polyline points={sparkPts} fill="none" stroke="var(--accent-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx={sparkW} cy={sparkH - (d.cites[d.cites.length - 1] / maxCite) * (sparkH - 4) - 2} r="1.8" fill="var(--accent-primary)" />
                    </svg>
                    <IM s={9} c="var(--fg-tertiary)">{d.cites.reduce((a, b) => a + b, 0)} cites · 6mo</IM>
                  </span>
                  <IM s={11} c="var(--accent-primary)" st={{ textAlign: 'right' }}>↗</IM>
                </div>
              );
            })}
          </div>

          {/* S-C · Reading queue · 4-5 peer-creator studies queued for review */}
          <DoubleRule />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
            <div>
              <IL>Reading queue · 5 studies by peer creators</IL>
              <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>
                Studies published by creators in your near-niche. Save the ones worth a deep read; skim the rest in 60 seconds.
              </span>
            </div>
            <span
              onClick={() => ms.pushToast && ms.pushToast('Reading queue · all sources')}
              style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid var(--border-default)', fontFamily: I_INT.mono, fontSize: 9.5, color: 'var(--fg-secondary)', cursor: 'pointer', letterSpacing: '0.06em' }}>SOURCES</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { author: '@silke',     title: "How I dropped my hook from 2.4s to 0.9s",                  tag: 'hooks',     est: '4 min', fresh: '1d' },
              { author: '@deepblue',  title: "What channel-rebrands cost in the first 30 days",          tag: 'identity',  est: '7 min', fresh: '2d' },
              { author: '@reefnotes', title: "Carousel vs reel for educational saves",                   tag: 'saves',     est: '5 min', fresh: '4d' },
              { author: '@wreckcrew', title: "Cold-DM templates that pulled mid-tier brand replies",     tag: 'brand',     est: '6 min', fresh: '6d' },
              { author: '@tankside',  title: "Long-form chapter pacing across 200 dive videos",           tag: 'pacing',    est: '9 min', fresh: '1w' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '14px 14px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <IM s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 700 }}>{r.author.toUpperCase()}</IM>
                  <IM s={9} c="var(--fg-tertiary)">{r.fresh.toUpperCase()} AGO</IM>
                </div>
                <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.35, letterSpacing: '-0.005em' }}>
                  {r.title}
                </span>
                <span style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 4, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--surface-2)', fontFamily: I_INT.mono, fontSize: 9, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.tag}</span>
                  <IM s={9.5}>{r.est}</IM>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span
                    onClick={() => ms.pushToast && ms.pushToast('Save · ' + r.author + ' · ' + r.title)}
                    style={{ flex: 1, padding: '6px 10px', textAlign: 'center', background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary-press)', borderRadius: 6, fontFamily: I_INT.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Save</span>
                  <span
                    onClick={() => ms.pushToast && ms.pushToast('Skim · ' + r.author + ' · ' + r.title)}
                    style={{ flex: 1, padding: '6px 10px', textAlign: 'center', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)', borderRadius: 6, fontFamily: I_INT.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Skim</span>
                </div>
              </div>
            ))}
          </div>

          {/* S-D · Study templates panel · 3 starters with 'Use template' CTAs */}
          <DoubleRule />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
            <div>
              <IL>Templates · 3 starters Coopr knows how to run</IL>
              <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>
                Each template names the question, scopes the data Coopr will pull, and the deliverable shape at the end.
              </span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
            {[
              {
                tpl: 'Channel teardown',
                blurb: "Pick a peer creator. Coopr pulls their last 30 posts, fingerprints hooks/pillars/cadence, and frames it against your fingerprint.",
                fields: ['target creator', 'lookback window', 'comparison axes'],
                eta: '~6 min · 30 posts',
              },
              {
                tpl: 'Format study',
                blurb: "Pick one format (carousel, vertical short, long-form). Coopr cross-cuts every post you've shipped in that format and produces a performance manifesto.",
                fields: ['format', 'metric', 'minimum sample'],
                eta: '~4 min · n ≥ 12',
              },
              {
                tpl: 'Audience cohort',
                blurb: "Define a cohort by behaviour (saved-2+, replied-once, returned-after-month). Coopr pulls what they engage with and what they don't.",
                fields: ['behaviour', 'window', 'compare-to cohort'],
                eta: '~7 min · 14d',
              },
            ].map((t, i) => (
              <div key={i} style={{ padding: '18px 18px', background: 'var(--surface-1)', border: '1px dashed var(--border-default)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <IM s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 700 }}>TEMPLATE · {String(i + 1).padStart(2, '0')}</IM>
                <span style={{ fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
                  {t.tpl}
                </span>
                <p style={{ margin: 0, fontFamily: I_INT.sans, fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{t.blurb}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {t.fields.map((f, k) => (
                    <span key={k} style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--surface-2)', fontFamily: I_INT.mono, fontSize: 9, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {f}
                    </span>
                  ))}
                </div>
                <span style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <IM s={10}>{t.eta}</IM>
                  <span
                    onClick={() => ms.pushToast && ms.pushToast('Use template · ' + t.tpl)}
                    style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--accent-primary)', color: 'var(--fg-on-accent, #fff)', fontFamily: I_INT.sans, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
                    Use template
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* S-E · Citations & references · what your studies cite + what cites them */}
          <DoubleRule />
          <div style={{ marginBottom: 28 }}>
            <IL>Citations · the web your studies sit inside</IL>
            <span style={{ display: 'block', marginTop: 4, fontFamily: I_INT.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>
              Two columns. Left is what your studies pull from — your own posts, your memory, peer creators, public data. Right is what your studies have shaped — drafts, rules, templates, replies.
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
            {/* Cites · sources your studies pull from */}
            <div>
              <IL s={9.5} c="var(--accent-primary-press)">YOUR STUDIES CITE · 47 SOURCES</IL>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { src: 'Your library · 156 posts',            n: 22, sub: 'most cited: 0046, 0042, 0034' },
                  { src: 'Memory · stated preferences',          n: 11, sub: 'rules and explicit voice notes' },
                  { src: 'Peer creators · public posts',         n:  8, sub: '@silke, @deepblue, @reefnotes' },
                  { src: 'Industry data · platform benchmarks',  n:  6, sub: 'IG, TikTok aggregate retention' },
                ].map((c, i) => (
                  <div
                    key={i}
                    onClick={() => ms.pushToast && ms.pushToast('Cited source · ' + c.src)}
                    style={{ padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 60px', gap: 12, alignItems: 'baseline', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: I_INT.serif, fontSize: 14, color: 'var(--fg-primary)' }}>{c.src}</span>
                      <IM s={9.5} st={{ marginTop: 2 }}>{c.sub}</IM>
                    </div>
                    <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 18, fontWeight: 700, color: 'var(--accent-primary-press)' }}>{c.n}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Cited by · what your studies have shaped */}
            <div style={{ paddingLeft: 24, borderLeft: '1px solid var(--border-default)' }}>
              <IL s={9.5} c="var(--accent-primary-press)">YOUR STUDIES SHAPED · 38 OUTPUTS</IL>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { dst: 'Drafts in Studio',         n: 14, sub: '0046 hook, 0048 opener, 0049 reserve callout' },
                  { dst: 'Promoted to hard rules',   n:  4, sub: 'boat credit, no "literally", reserve, no-sponsor teardowns' },
                  { dst: 'Reply templates',          n:  6, sub: 'safety-rule replies, gear-question replies' },
                  { dst: 'Calendar locks',           n:  3, sub: 'Tuesday slot, Sunday batch, mid-week pause' },
                ].map((c, i) => (
                  <div
                    key={i}
                    onClick={() => ms.pushToast && ms.pushToast('Output · ' + c.dst)}
                    style={{ padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 60px', gap: 12, alignItems: 'baseline', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: I_INT.serif, fontSize: 14, color: 'var(--fg-primary)' }}>{c.dst}</span>
                      <IM s={9.5} st={{ marginTop: 2 }}>{c.sub}</IM>
                    </div>
                    <span className="hf-num" style={{ textAlign: 'right', fontFamily: I_INT.mono, fontSize: 18, fontWeight: 700, color: 'var(--accent-primary-press)' }}>{c.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <IntelFolio section="Studies" />
        </div>
      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_IntelRadar, HF_IntelInspiration, HF_IntelDNA, HF_IntelMemory, HF_IntelStudies });
