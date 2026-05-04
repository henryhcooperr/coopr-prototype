/* global React, window */
/* hifi-r4-lib-detail-analysis.jsx — Library round 4 · Detail · deep analysis sections.

   Five new sections that get inserted into HF_R4_LibraryDetail to surface
   the full breakdown of why a post worked (or didn't):

     1. Hook DNA       — the first 3 seconds, frame by frame
     2. Drop-off cards — annotated explanations of each retention dip
     3. Audience       — who actually watched (4-quadrant cohort breakdown)
     4. Comments       — detected themes + sentiment + top thread
     5. Performance vs cluster — bars compare this post to siblings + library

   Per-post data lives in `R4D_ANALYSIS` keyed by post id. Real implementation
   would generate this server-side from the embedding index, comment NLP,
   audience metadata, and cohort comparisons.

   All five components take `post` (the post object) and an optional `data`
   override for the analysis row. They render as their own <section> blocks
   so they slot cleanly into the existing Detail main column.
*/

window.R4D_ANALYSIS = {
  '0042': {
    // ── 1. Hook DNA — opening 3 seconds, frame by frame ──
    hookFrames: [
      { t: '0.0s', tone: 'midnight', desc: 'logo',     keep: 100 },
      { t: '0.3s', tone: 'midnight', desc: 'logo',     keep: 100 },
      { t: '0.6s', tone: 'midnight', desc: 'fade',     keep: 100 },
      { t: '0.9s', tone: 'navy',     desc: 'title',    keep: 99 },
      { t: '1.2s', tone: 'navy',     desc: 'title',    keep: 99 },
      { t: '1.5s', tone: 'deep-blue',desc: 'cut',      keep: 98 },
      { t: '1.8s', tone: 'deep-blue',desc: 'wreck',    keep: 97 },
      { t: '2.1s', tone: 'deep-blue',desc: 'wreck',    keep: 97 },
      { t: '2.4s', tone: 'midnight', desc: 'face',     keep: 96 },
      { t: '2.7s', tone: 'midnight', desc: 'reg',      keep: 96 },
      { t: '3.0s', tone: 'navy',     desc: 'voice',    keep: 96 },
    ],
    hookTakeaway: 'The logo sits 0.6s longer than the library median. Title at 0.9s is on-pace. The first cut (1.5s) lands the reveal — 96% retention through 3.0s, 8 points over library average.',

    // ── 2. Drop-off cards — moments where retention falls ──
    dropoffs: [
      // 0042 has gentle decay, no major drops — surface the smallest dips for instructive value
      { atTs: '4:12', deltaPp: -2,  cause: 'Bow-shot reveal · audience pause to register',          fix: 'Hold a beat longer; this is the gold moment, give it space.', kind: 'positive' },
      { atTs: '7:42', deltaPp: -5,  cause: 'Decompression-hang voice-over · slower pacing',         fix: 'Trim 8s of B-roll or add a beat with a cut on the breath.',     kind: 'caution' },
    ],

    // ── 3. Audience cohort breakdown ──
    audience: {
      newVsReturning: { new: 38, returning: 62 },
      timeline: { d1: 41, d3: 27, d7: 18, d30: 14 },          // % of total views by time bucket
      geo: [
        { country: 'United States', pct: 38 },
        { country: 'United Kingdom', pct: 14 },
        { country: 'Australia',     pct: 11 },
        { country: 'Germany',        pct: 8 },
        { country: 'Indonesia',      pct: 6 },
      ],
      followerVsDiscovery: { followers: 71, discovery: 29 },
    },

    // ── 4. Comment cluster ──
    comments: {
      total: 1810,
      sentiment: { positive: 76, curious: 14, critical: 6, spam: 4 },
      themes: [
        { label: 'Own-failure resonance',     count: 412, quote: '"the part nobody films" — that\'s why I trust this channel',     pct: 23 },
        { label: 'Dive-safety questions',     count: 340, quote: 'what kind of reg do you use? mine free-flowed at 30m last month', pct: 19 },
        { label: 'Truk Lagoon trip planning', count: 298, quote: 'how long is a trip out there? worth the flight from europe?',     pct: 16 },
        { label: 'Cinematography praise',     count: 264, quote: 'the bow shot at 4:12 is genuinely cinematic',                       pct: 15 },
      ],
      topThread: {
        comment: 'Anyone else here as someone who almost died on a wreck dive? This hit hard.',
        author: '@deepbreath_alex',
        replies: 87,
      },
    },

    // ── 5. Performance vs cluster ──
    cluster: {
      label: 'Story · travel cluster · 92 posts',
      thisPost:    { coopr: 84, watch: 71, save: 2.94 },
      clusterAvg:  { coopr: 58, watch: 54, save: 1.52 },
      libraryMed:  { coopr: 47, watch: 51, save: 0.98 },
    },
  },

  '0039': {
    // ── 1. Hook DNA — short-form, 3s window covers ~7% of duration ──
    hookFrames: [
      { t: '0.0s', tone: 'electric', desc: 'open',     keep: 100 },
      { t: '0.3s', tone: 'electric', desc: 'text',     keep: 100 },
      { t: '0.6s', tone: 'electric', desc: 'text',     keep: 99 },
      { t: '0.9s', tone: 'electric', desc: 'reveal',   keep: 96 },
      { t: '1.2s', tone: 'navy',     desc: 'cut',      keep: 95 },
      { t: '1.5s', tone: 'navy',     desc: 'face',     keep: 95 },
      { t: '1.8s', tone: 'navy',     desc: 'face',     keep: 94 },
      { t: '2.1s', tone: 'electric', desc: 'text',     keep: 94 },
      { t: '2.4s', tone: 'electric', desc: 'text',     keep: 93 },
      { t: '2.7s', tone: 'electric', desc: 'count',    keep: 93 },
      { t: '3.0s', tone: 'electric', desc: 'count',    keep: 92 },
    ],
    hookTakeaway: 'Pure declarative open. No logo, no setup — text on screen at 0.0s. Reveal lands at 0.9s, exactly on the library median. 92% retention at 3.0s is +6pts over the safety-primer cluster average.',

    // ── 2. Drop-off cards — short-form, smaller drops ──
    dropoffs: [
      { atTs: '0:08', deltaPp: -4, cause: 'Reveal beat · viewers self-select out',           fix: 'Net positive — those who stay are aligned. No change.',           kind: 'positive' },
      { atTs: '0:24', deltaPp: -6, cause: 'On-camera Q&A pivot · format shift mid-piece',     fix: 'Stay text-only OR cut to the next short instead of the pivot.',  kind: 'caution' },
    ],

    audience: {
      newVsReturning: { new: 71, returning: 29 },             // discovery-heavy on TT
      timeline: { d1: 64, d3: 22, d7: 9, d30: 5 },
      geo: [
        { country: 'United States', pct: 41 },
        { country: 'Mexico',         pct: 12 },
        { country: 'Brazil',         pct: 9 },
        { country: 'Spain',          pct: 7 },
        { country: 'Indonesia',      pct: 6 },
      ],
      followerVsDiscovery: { followers: 18, discovery: 82 },  // TikTok For You dominant
    },

    comments: {
      total: 612,
      sentiment: { positive: 68, curious: 22, critical: 6, spam: 4 },
      themes: [
        { label: 'Hook-craft questions',         count: 188, quote: 'how do you decide WHICH 8 seconds though',                  pct: 31 },
        { label: 'Safety-primer asks',           count: 142, quote: 'do you have a longer one on this? need more depth',         pct: 23 },
        { label: 'Voice / tone mimicry praise',   count: 96,  quote: 'the lowercase thing is so good. respect',                   pct: 16 },
        { label: 'Tag-a-friend',                  count: 84,  quote: '@chris this is what I was telling you about last weekend',  pct: 14 },
      ],
      topThread: {
        comment: 'The lowercase is doing so much work here. Most creators would ALL CAPS this and lose the seriousness.',
        author: '@hookwriter',
        replies: 43,
      },
    },

    cluster: {
      label: 'Safety primer cluster · 14 posts',
      thisPost:    { coopr: 62, watch: 74, save: 2.23 },
      clusterAvg:  { coopr: 38, watch: 48, save: 1.10 },
      libraryMed:  { coopr: 47, watch: 51, save: 0.98 },
    },
  },
};

// ──────────────────────────────────────────────────────────
// Section header helper — mono eyebrow + italic-serif title +
// a thin clay accent rule. Used by every analysis section so the
// page reads like one editorial document.
function R4DAnalysisHead({ eyebrow, title, hint }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 18,
      paddingBottom: 12,
      borderBottom: '1px solid var(--accent-soft)',
      marginBottom: 18,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 4 }}>{eyebrow}</div>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1 }}>{title}</h2>
      </div>
      {hint && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{hint}</span>}
    </header>
  );
}

// ─── 1. HOOK DNA ──────────────────────────────────────────
function R4DHookDNA({ post }) {
  const a = window.R4D_ANALYSIS[post.id];
  if (!a || !a.hookFrames) return null;
  return (
    <section style={{ marginTop: 44 }}>
      <R4DAnalysisHead
        eyebrow="ANALYSIS · 01"
        title="Hook DNA."
        hint="THE FIRST 3 SECONDS · FRAME BY FRAME"
      />
      <div style={{
        display: 'flex', gap: 6, alignItems: 'flex-start',
        overflowX: 'auto', paddingBottom: 4,
      }}>
        {a.hookFrames.map((f, i) => (
          <R4DHookFrame key={i} frame={f} index={i} />
        ))}
      </div>
      <p style={{
        margin: '14px 0 0', maxWidth: 760,
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em',
      }}>{a.hookTakeaway}</p>
    </section>
  );
}

function R4DHookFrame({ frame, index }) {
  const palette = window.R4_TONE_PALETTES[frame.tone] || window.R4_TONE_PALETTES['deep-blue'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 78, flexShrink: 0 }}>
      {/* Frame thumb-as-color */}
      <div style={{
        position: 'relative',
        width: '100%', aspectRatio: '3 / 4',
        borderRadius: 4,
        overflow: 'hidden',
        background: `radial-gradient(120% 90% at ${20 + (index * 6) % 60}% 30%, ${palette.via}, ${palette.from} 70%)`,
        filter: 'saturate(1.18) contrast(1.04)',
        boxShadow: '0 1px 2px rgba(15,14,12,0.10)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.40), transparent 50%)' }} />
        <span style={{
          position: 'absolute', left: 4, bottom: 3,
          fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
          color: '#fff', letterSpacing: '0.06em',
        }}>{frame.desc}</span>
      </div>
      {/* Caption — timestamp + retention */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{frame.t}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: frame.keep >= 95 ? 'var(--tone-success)' : frame.keep >= 90 ? 'var(--fg-secondary)' : 'var(--tone-warning)' }}>{frame.keep}%</span>
      </div>
    </div>
  );
}

// ─── 2. DROP-OFF CARDS ────────────────────────────────────
function R4DDropoffCards({ post }) {
  const a = window.R4D_ANALYSIS[post.id];
  if (!a || !a.dropoffs || a.dropoffs.length === 0) return null;
  return (
    <section style={{ marginTop: 28 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 12 }}>
        ANNOTATED DROP-OFFS · {a.dropoffs.length} DETECTED
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {a.dropoffs.map((d, i) => (
          <R4DDropoffCard key={i} dropoff={d} />
        ))}
      </div>
    </section>
  );
}

function R4DDropoffCard({ dropoff }) {
  const isPositive = dropoff.kind === 'positive';
  const accentColor = isPositive ? 'var(--tone-success)' : 'var(--tone-warning)';
  return (
    <article style={{
      padding: '14px 16px',
      border: '1px solid var(--border-subtle)',
      borderRadius: 6,
      background: 'var(--surface-1)',
      borderLeft: `3px solid ${accentColor}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{dropoff.atTs}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: accentColor, letterSpacing: '-0.01em' }}>
          {dropoff.deltaPp > 0 ? '+' : ''}{dropoff.deltaPp}pp
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: accentColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {isPositive ? 'INSTRUCTIVE' : 'FIXABLE'}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.45, letterSpacing: '-0.005em',
        marginBottom: 8,
      }}>{dropoff.cause}</div>
      <div style={{
        paddingTop: 8, borderTop: '1px dashed var(--border-default)',
        fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5,
      }}>{dropoff.fix}</div>
    </article>
  );
}

// ─── 3. AUDIENCE COHORT BREAKDOWN ────────────────────────
function R4DAudience({ post }) {
  const a = window.R4D_ANALYSIS[post.id];
  if (!a || !a.audience) return null;
  const aud = a.audience;
  return (
    <section style={{ marginTop: 44 }}>
      <R4DAnalysisHead
        eyebrow="ANALYSIS · 03"
        title="Audience."
        hint="WHO ACTUALLY WATCHED · 4 LENSES"
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <R4DAudienceCard title="WHO" sub="new vs returning">
          <R4DSplitBar a={aud.newVsReturning.new} b={aud.newVsReturning.returning} aLabel="NEW" bLabel="RETURNING" aColor="var(--accent-primary)" bColor="var(--tone-info)" />
        </R4DAudienceCard>

        <R4DAudienceCard title="WHEN" sub="views by time-since-post">
          <R4DTimeline data={aud.timeline} />
        </R4DAudienceCard>

        <R4DAudienceCard title="WHERE" sub="top 5 countries">
          <R4DGeoList data={aud.geo} />
        </R4DAudienceCard>

        <R4DAudienceCard title="DISCOVERY" sub="followers vs algorithmic surface">
          <R4DSplitBar a={aud.followerVsDiscovery.followers} b={aud.followerVsDiscovery.discovery} aLabel="FOLLOWERS" bLabel="DISCOVERY" aColor="var(--tone-success)" bColor="var(--accent-primary)" />
        </R4DAudienceCard>
      </div>
    </section>
  );
}

function R4DAudienceCard({ title, sub, children }) {
  return (
    <article style={{ padding: '14px 16px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--surface-1)' }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)', marginTop: 2 }}>{sub}</div>
      </div>
      {children}
    </article>
  );
}

function R4DSplitBar({ a, b, aLabel, bLabel, aColor, bColor }) {
  return (
    <div>
      <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: 'var(--surface-2)' }}>
        <div style={{ width: `${a}%`, background: aColor }} />
        <div style={{ width: `${b}%`, background: bColor }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em' }}>
        <span><span style={{ fontWeight: 700, color: aColor }}>{a}%</span> <span style={{ color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{aLabel}</span></span>
        <span><span style={{ color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{bLabel}</span> <span style={{ fontWeight: 700, color: bColor }}>{b}%</span></span>
      </div>
    </div>
  );
}

function R4DTimeline({ data }) {
  const max = Math.max(...Object.values(data));
  const labels = { d1: 'first 24h', d3: '24–72h', d7: '3–7d', d30: '7–30d' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(data).map(([k, v]) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 36px', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>{labels[k]}</span>
          <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${(v / max) * 100}%`, height: '100%', background: 'var(--accent-primary)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)', textAlign: 'right' }}>{v}%</span>
        </div>
      ))}
    </div>
  );
}

function R4DGeoList({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {data.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 36px', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-primary)' }}>{row.country}</span>
          <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${(row.pct / data[0].pct) * 100}%`, height: '100%', background: 'var(--tone-info)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, color: 'var(--fg-secondary)', textAlign: 'right' }}>{row.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── 4. COMMENT CLUSTER ──────────────────────────────────
function R4DCommentCluster({ post }) {
  const a = window.R4D_ANALYSIS[post.id];
  if (!a || !a.comments) return null;
  const c = a.comments;
  return (
    <section style={{ marginTop: 44 }}>
      <R4DAnalysisHead
        eyebrow="ANALYSIS · 04"
        title="What people said."
        hint={`${window.r4FmtViews(c.total)} COMMENTS · ${c.themes.length} THEMES DETECTED`}
      />

      {/* Sentiment band */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', marginBottom: 6 }}>SENTIMENT</div>
        <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', background: 'var(--surface-2)' }}>
          <div style={{ width: `${c.sentiment.positive}%`, background: 'var(--tone-success)' }} title={`positive ${c.sentiment.positive}%`} />
          <div style={{ width: `${c.sentiment.curious}%`, background: 'var(--tone-info)' }} title={`curious ${c.sentiment.curious}%`} />
          <div style={{ width: `${c.sentiment.critical}%`, background: 'var(--tone-warning)' }} title={`critical ${c.sentiment.critical}%`} />
          <div style={{ width: `${c.sentiment.spam}%`, background: 'var(--fg-tertiary)' }} title={`spam ${c.sentiment.spam}%`} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.08em' }}>
          <span><span style={{ color: 'var(--tone-success)', fontWeight: 700 }}>{c.sentiment.positive}%</span> POSITIVE</span>
          <span><span style={{ color: 'var(--tone-info)',    fontWeight: 700 }}>{c.sentiment.curious}%</span> CURIOUS</span>
          <span><span style={{ color: 'var(--tone-warning)', fontWeight: 700 }}>{c.sentiment.critical}%</span> CRITICAL</span>
          <span><span style={{ color: 'var(--fg-secondary)', fontWeight: 700 }}>{c.sentiment.spam}%</span> SPAM</span>
        </div>
      </div>

      {/* Theme cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 18 }}>
        {c.themes.map((t, i) => (
          <article key={i} style={{
            padding: '12px 14px',
            border: '1px solid var(--border-subtle)', borderRadius: 6,
            background: 'var(--surface-1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{t.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>
                <span style={{ fontWeight: 700, color: 'var(--fg-secondary)' }}>{t.count}</span> · {t.pct}%
              </span>
            </div>
            <blockquote style={{
              margin: 0, padding: '0 0 0 10px',
              borderLeft: '2px solid var(--accent-soft)',
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.45,
            }}>{t.quote}</blockquote>
          </article>
        ))}
      </div>

      {/* Top thread callout */}
      <article style={{
        padding: '14px 18px',
        background: 'var(--accent-soft)',
        border: '1px solid var(--accent-primary)',
        borderRadius: 6,
        display: 'grid', gridTemplateColumns: '1fr 90px', gap: 14, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--accent-primary-press)', letterSpacing: '0.14em', marginBottom: 5 }}>TOP THREAD · BY REPLY COUNT</div>
          <blockquote style={{
            margin: 0,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.45, letterSpacing: '-0.005em',
          }}>{c.topThread.comment}</blockquote>
          <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-secondary)', letterSpacing: '0.04em' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary-press)' }}>{c.topThread.author}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, color: 'var(--accent-primary-press)', lineHeight: 1, letterSpacing: '-0.018em' }}>{c.topThread.replies}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginTop: 2 }}>REPLIES</div>
        </div>
      </article>
    </section>
  );
}

// ─── 5. PERFORMANCE VS CLUSTER ───────────────────────────
function R4DPerformanceVsCluster({ post }) {
  const a = window.R4D_ANALYSIS[post.id];
  if (!a || !a.cluster) return null;
  const c = a.cluster;
  // Build 3 metric rows: COOPR / WATCH / SAVE
  const rows = [
    { key: 'coopr', label: 'COOPR SCORE',   suffix: '',  this_: c.thisPost.coopr, avg: c.clusterAvg.coopr, med: c.libraryMed.coopr,  max: 100 },
    { key: 'watch', label: 'WATCH %',        suffix: '%', this_: c.thisPost.watch, avg: c.clusterAvg.watch, med: c.libraryMed.watch,  max: 100 },
    { key: 'save',  label: 'SAVE / VIEW',    suffix: '%', this_: c.thisPost.save,  avg: c.clusterAvg.save,  med: c.libraryMed.save,   max: Math.max(c.thisPost.save, c.clusterAvg.save, c.libraryMed.save) * 1.2 },
  ];
  return (
    <section style={{ marginTop: 44, marginBottom: 8 }}>
      <R4DAnalysisHead
        eyebrow="ANALYSIS · 05"
        title="Performance, in context."
        hint={`VS ${c.label.toUpperCase()}`}
      />
      <div style={{
        padding: '18px 20px',
        border: '1px solid var(--border-subtle)', borderRadius: 8,
        background: 'var(--surface-1)',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        {rows.map(r => (
          <R4DCompareRow key={r.key} row={r} />
        ))}
      </div>
      <p style={{
        margin: '12px 0 0', maxWidth: 760,
        fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.55,
      }}>
        This post outperforms its cluster average across all three dimensions. Use that lift — the underlying pattern is replicable; queue 2–3 variants from the Reuse Moments below.
      </p>
    </section>
  );
}

function R4DCompareRow({ row }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>{row.label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.08em' }}>SCALE 0 → {row.max.toFixed(0)}{row.suffix}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <R4DCompareBar label="THIS POST"      value={row.this_} max={row.max} suffix={row.suffix} color="var(--accent-primary)" emphasized />
        <R4DCompareBar label="CLUSTER AVG"    value={row.avg}   max={row.max} suffix={row.suffix} color="var(--tone-info)" />
        <R4DCompareBar label="LIBRARY MEDIAN" value={row.med}   max={row.max} suffix={row.suffix} color="var(--fg-tertiary)" />
      </div>
    </div>
  );
}

function R4DCompareBar({ label, value, max, suffix, color, emphasized = false }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 56px', gap: 10, alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{label}</span>
      <div style={{ height: emphasized ? 12 : 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: emphasized ? 13 : 11,
        fontWeight: 700,
        color: emphasized ? color : 'var(--fg-secondary)',
        textAlign: 'right',
        letterSpacing: '-0.01em',
      }}>{Number.isInteger(value) ? value : value.toFixed(2)}{suffix}</span>
    </div>
  );
}

Object.assign(window, {
  R4DHookDNA, R4DDropoffCards, R4DAudience, R4DCommentCluster, R4DPerformanceVsCluster,
});
