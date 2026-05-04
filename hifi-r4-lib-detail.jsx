/* global React, window, HfShell, R4PlatformCard, R4Chip, R4PillarDot, R4ChannelChip, R4Stat, R4ThumbBackdrop, R4ChromeLongYT, R4ChromeReelIG, R4ChromeShortTT, R4ChromeCarouselIG, r4FmtViews, r4PlatformLabel, R4RetentionSpark, R4GOutcomeRail */
/* hifi-r4-lib-detail.jsx — Library round 4 · Post Detail.

   Round-4 update (2026-04-27): now accepts a postId prop. Default is '0042'
   (the Truk flagship long-form). Pass a different postId to render the
   detail layout for any other post in the catalog — the embed swaps to the
   right platform chrome (long-yt = 16:9 YT player, short-tt = 9:16 phone
   frame, etc.) and per-post copy lives in R4D_COPY below. */

const R4D_DATA = window.HF_DATA;

// ─── Per-post copy overrides ─────────────────────────────────────
// Anything not provided here falls back to the post's R4_LIB_VISUALS row
// (improve, tone) plus the post's own data (title, views, retention).
const R4D_COPY = {
  '0042': {
    breadcrumb:   ['LIBRARY', 'CATALOG', 'SERIES · TRUK LAGOON'],
    lifecycle:    'GRADUATED',
    metaPrefix:   'STORY · TRAVEL',
    blurb:        "The flagship of the Truk series. Eight breaths inside the Fujikawa Maru, opening on the moment my reg started free-flowing at 28 metres. The cold-open carried the post — retention sits above 80% for the full first quarter and never drops below 60%.",
    retentionTakeaway: 'No major drops. Highest-watched moment is the bow shot at 4:12 — pull as a standalone reel (predicted CScore ~72).',
    peakLabel:    'peak · 4:12 bow shot',
    peakIndex:    9,    // 0..20 — index into the retention array
    transcript:   "\"My reg started free-flowing at 28 metres. I'd been on the Fujikawa Maru for nine minutes. This is the part of the dive nobody films.\"",
    hookCaption:  'HOOK PATTERN · COLD-OPEN · 0.9s OPENING · 3-SEC RETN 96%',
    cooprScore:   84,
    velocity:     '+18% · 30D',
    trajectory:   [3, 12, 24, 38, 52, 68, 88, 110, 138, 178, 220, 268, 310, 348, 380, 405, 421],
    sub:          { HOOK: 94, DEPTH: 88, SAVE: 71, VOICE: 82 },
    reuseMoments: [
      { range: '4:08–4:24', caption: 'The bow-shot scene',                  predictedScore: 72, kind: 'reel',     why: 'highest watch · most-rewound · 16s standalone' },
      { range: '0:00–0:18', caption: 'Cold-open · the free-flow',           predictedScore: 79, kind: 'reel',     why: 'opens hot · already structured for short-form' },
      { range: '7:42–8:01', caption: 'Decompression hang reflection',       predictedScore: 58, kind: 'carousel', why: 'introspective beat · pulls saves on IG' },
    ],
    lineage: [
      { label: 'SERIES',  value: 'Truk Lagoon · flagship',           hint: 'case file 04' },
      { label: 'IDEA',    value: 'My first wreck — what I got wrong', hint: '3-of-3 ports queued' },
      { label: 'HOOK',    value: 'Cold-open · own-failure',           hint: '84 occurrences in library' },
    ],
    kin: [
      { id: '0044', similarity: 89, why: 'same series · own-failure cold-open' },
      { id: '0040', similarity: 71, why: 'long-yt · same audience commit' },
      { id: '0036', similarity: 62, why: 'long-yt · same depth ceiling' },
    ],
    primaryAction: '+ Draft the reel',
  },
  '0039': {
    breadcrumb:   ['LIBRARY', 'CATALOG', 'PATTERN · 8-SECOND RULE'],
    lifecycle:    'GRADUATED',
    metaPrefix:   'SAFETY · SHORT-FORM',
    blurb:        "Top performer in the cold-open / 8-second rule cluster. The lowercase title and on-screen text only do the work — no narration, no music sting. 74% watch on a 41-second piece is the ceiling for this format.",
    retentionTakeaway: 'Cold-opens like this clear the library average by 8–12 points on 3-second retention. Three more variants in the same shape would compound the slot.',
    peakLabel:    'peak · 0:08 reveal',
    peakIndex:    3,
    transcript:   "\"the eight-second rule. that's how long you have. before someone scrolls. and you can't talk faster — you have to start later.\"",
    hookCaption:  'HOOK PATTERN · DECLARATION · 0.8s OPENING · 3-SEC RETN 92%',
    cooprScore:   62,
    velocity:     '+27% · 30D',
    trajectory:   [4, 8, 14, 22, 32, 44, 58, 74, 90, 108, 126, 144, 160, 175, 188],
    sub:          { HOOK: 92, DEPTH: 58, SAVE: 64, VOICE: 88 },
    reuseMoments: [
      { range: '0:00–0:09', caption: 'The eight-second reveal',           predictedScore: 81, kind: 'reel',     why: 'pure hook · already 9s · negligible re-cut needed' },
      { range: '0:24–0:36', caption: '"you can\'t talk faster"',          predictedScore: 64, kind: 'reel',     why: 'declarative beat · could lead a sibling variant' },
      { range: '0:36–0:41', caption: 'Loop hook · "start later"',         predictedScore: 70, kind: 'reel',     why: 'natural loop point · seeds the next post' },
    ],
    lineage: [
      { label: 'SERIES',  value: 'Dive-safety primers · 14 posts',      hint: 'case file 02' },
      { label: 'IDEA',    value: 'The 8-second rule',                   hint: '3-of-3 ports · YT primer + IG cut' },
      { label: 'HOOK',    value: 'Declaration · plain · lowercase',     hint: '96 occurrences in library' },
    ],
    kin: [
      { id: '0046', similarity: 78, why: 'safety · list-of-N hook · same audience' },
      { id: '0043', similarity: 64, why: 'short · safety primer · same shape' },
      { id: '0041', similarity: 55, why: 'safety · primer cluster · long-form sibling' },
    ],
    primaryAction: '+ Draft 3 variants',
  },
  '0046': {
    breadcrumb:   ['LIBRARY', 'CATALOG', 'PATTERN · LIST-OF-N'],
    lifecycle:    'GRADUATED',
    metaPrefix:   'SAFETY · SHORT-FORM',
    blurb:        "Top-quartile reel in the safety pillar. List-of-N hook lands at 1.1s — earlier than 88% of the library — and the on-screen checklist takes the second beat without narration. 68% watch on a 47-second piece, with a save-rate that's nearly double the safety average.",
    retentionTakeaway: 'Hook lands clean. The 1.1s opening could be tightened to 0.8s by lifting the title card a frame earlier — predicted 3-sec retention 95%+.',
    peakLabel:    'peak · 0:06 checklist',
    peakIndex:    2,
    transcript:   "\"three things I check before every wreck dive. one — gas math against the worst-case exit. two — redundancy on the primary. three — a buddy who actually rehearsed the call.\"",
    hookCaption:  'HOOK PATTERN · LIST-OF-N · 1.1s OPENING · 3-SEC RETN 92%',
    cooprScore:   47,
    velocity:     '+11% · 30D',
    trajectory:   [3, 7, 14, 26, 42, 58, 76, 94, 110, 124, 134],
    sub:          { HOOK: 89, DEPTH: 64, SAVE: 91, VOICE: 82 },
    reuseMoments: [
      { range: '0:00–0:08', caption: 'Cold-open · the three-item promise', predictedScore: 78, kind: 'reel',     why: 'pure list-of-N hook · cleanest cut in the post' },
      { range: '0:18–0:32', caption: 'Item two · redundancy frame',         predictedScore: 65, kind: 'reel',     why: 'mid-beat · could lead a sibling list-of-N' },
      { range: '0:32–0:47', caption: 'Item three + close · the rehearsal',  predictedScore: 71, kind: 'carousel', why: 'declarative ending · pulls saves on IG' },
    ],
    lineage: [
      { label: 'SERIES',  value: 'Safety primers · 14 posts',          hint: 'case file 02' },
      { label: 'IDEA',    value: 'Pre-dive checklist as a reel',        hint: '2-of-3 ports queued' },
      { label: 'HOOK',    value: 'List-of-N · plain · numbered',        hint: '64 occurrences in library' },
    ],
    kin: [
      { id: '0039', similarity: 78, why: 'safety · same primer cluster · short-form' },
      { id: '0043', similarity: 71, why: 'safety · same audience · 3-item shape' },
      { id: '0038', similarity: 58, why: 'safety · same channel · how-to flavour' },
    ],
    primaryAction: '+ Tighten the open',
  },
  '0044': {
    breadcrumb:   ['LIBRARY', 'CATALOG', 'SERIES · TRUK LAGOON'],
    lifecycle:    'GRADUATED',
    metaPrefix:   'STORY · TRAVEL',
    blurb:        "The second flagship of the Truk series. Eight breaths inside the Fujikawa Maru, framed as a meditation rather than a tour. Watch-pct holds at 54% across an 11-minute piece, with the deepest engagement on the bow-shot reveal.",
    retentionTakeaway: 'A noticeable drop at 03:00 — the disclaimer card costs about 7 points. Move it to a footer card next time. The bow shot at 4:12 is the highest-rewatched moment.',
    peakLabel:    'peak · 4:12 bow shot',
    peakIndex:    8,
    transcript:   "\"I have eight breaths. That's the whole dive. The Fujikawa is a 137-metre wreck and I'm hanging at the rail with a hold-of-breath I can't justify.\"",
    hookCaption:  'HOOK PATTERN · DECLARATION · 2.2s OPENING · 3-SEC RETN 88%',
    cooprScore:   71,
    velocity:     '+12% · 30D',
    trajectory:   [4, 9, 18, 32, 48, 66, 88, 112, 138, 162, 184, 204, 222, 240, 256],
    sub:          { HOOK: 78, DEPTH: 84, SAVE: 73, VOICE: 86 },
    reuseMoments: [
      { range: '4:08–4:24', caption: 'The bow-shot reveal',                  predictedScore: 74, kind: 'reel',     why: 'highest-rewatched · 16s standalone' },
      { range: '0:00–0:14', caption: 'Cold-open · the eight-breath promise', predictedScore: 70, kind: 'reel',     why: 'declarative · already shaped for short-form' },
      { range: '7:30–7:52', caption: 'Decompression hang reflection',        predictedScore: 56, kind: 'carousel', why: 'introspective beat · saves-leaning' },
    ],
    lineage: [
      { label: 'SERIES',  value: 'Truk Lagoon · 4 posts',                hint: 'case file 04' },
      { label: 'IDEA',    value: 'Eight breaths inside the Fujikawa',     hint: '3-of-3 ports queued' },
      { label: 'HOOK',    value: 'Declaration · meditative cadence',      hint: '38 occurrences in library' },
    ],
    kin: [
      { id: '0042', similarity: 89, why: 'same series · own-failure cold-open · long-yt' },
      { id: '0040', similarity: 64, why: 'long-yt · same audience commit window' },
      { id: '0036', similarity: 52, why: 'long-yt · introspective long-form' },
    ],
    primaryAction: '+ Pull the bow shot',
  },
  '0040': {
    breadcrumb:   ['LIBRARY', 'CATALOG', 'PATTERN · TEARDOWN'],
    lifecycle:    'NORMAL',
    metaPrefix:   'GEAR · TEARDOWN',
    blurb:        "Solid mid-tier long-form. The DIN/YOKE comparison frame at 7:20 is the highest-rewatched moment — the kind of demo beat that pulls saves on YouTube and previews well as a 30-second teaser. Watch-pct sits at 58% across a 10-minute piece.",
    retentionTakeaway: 'Steady curve · no sharp drops. The teardown comparison at 7:20 carries the back half — pull it as a teaser to feed the long post.',
    peakLabel:    'peak · 7:20 comparison',
    peakIndex:    11,
    transcript:   "\"this is a DIN regulator. this is a yoke. one of these will fail you in a way you can recover from. the other one will fail you in a way you can't.\"",
    hookCaption:  'HOOK PATTERN · DEMONSTRATION · 1.8s OPENING · 3-SEC RETN 84%',
    cooprScore:   56,
    velocity:     '+3% · 30D',
    trajectory:   [3, 7, 12, 19, 27, 38, 50, 62, 74, 84, 92, 100, 106, 112],
    sub:          { HOOK: 72, DEPTH: 88, SAVE: 78, VOICE: 80 },
    reuseMoments: [
      { range: '7:14–7:36', caption: 'DIN vs yoke · the comparison beat',   predictedScore: 76, kind: 'reel',     why: 'highest-rewatched · already framed as a demo' },
      { range: '0:00–0:18', caption: 'Cold-open · the failure-mode promise', predictedScore: 62, kind: 'reel',     why: 'demonstration hook · transposes to short cleanly' },
      { range: '4:48–5:12', caption: 'Service-interval frame',               predictedScore: 54, kind: 'carousel', why: 'saves-leaning · gear-shopping audience' },
    ],
    lineage: [
      { label: 'SERIES',  value: 'Gear teardowns · 9 posts',             hint: 'case file 06' },
      { label: 'IDEA',    value: 'DIN vs yoke · comparison teardown',     hint: '2-of-3 ports queued' },
      { label: 'HOOK',    value: 'Demonstration · object on the bench',   hint: '52 occurrences in library' },
    ],
    kin: [
      { id: '0045', similarity: 74, why: 'gear · same audience · short sibling' },
      { id: '0036', similarity: 62, why: 'gear · long-yt · same purchase-decision window' },
      { id: '0042', similarity: 58, why: 'long-yt · same audience commit window' },
    ],
    primaryAction: '+ Pull the comparison',
  },
  '0036': {
    breadcrumb:   ['LIBRARY', 'CATALOG', 'PATTERN · Q&A'],
    lifecycle:    'NORMAL',
    metaPrefix:   'GEAR · Q&A',
    blurb:        "An eight-minute reply to a frequent question — should you buy a rebreather in year two? Watch-pct at 62% is the ceiling for the Q&A format on this channel; the audience that opens it tends to finish it. Save rate is modest — this is a shape that works better as a one-off than a series.",
    retentionTakeaway: 'No sharp drops. The format ceiling is the bigger lever — a 3-minute IG cutdown of the same script would extend the answer to a saves-leaning audience.',
    peakLabel:    'peak · 2:48 the answer',
    peakIndex:    6,
    transcript:   "\"should you buy a rebreather in year two? almost always no. the answer is a shape — not a yes or a no — and it depends on what you want diving to feel like at year five.\"",
    hookCaption:  'HOOK PATTERN · QUESTION · 1.3s OPENING · 3-SEC RETN 85%',
    cooprScore:   51,
    velocity:     '+0% · 30D',
    trajectory:   [2, 5, 9, 14, 21, 28, 36, 44, 52, 58, 63, 67, 70],
    sub:          { HOOK: 68, DEPTH: 82, SAVE: 54, VOICE: 81 },
    reuseMoments: [
      { range: '2:38–2:58', caption: 'The answer · the year-five frame',     predictedScore: 64, kind: 'reel',     why: 'cleanest declarative beat · stands alone' },
      { range: '0:00–0:16', caption: 'Cold-open · the question itself',      predictedScore: 58, kind: 'reel',     why: 'question-hook · pulls the same curiosity at scale' },
      { range: '5:24–5:48', caption: 'Cost-of-ownership frame',              predictedScore: 49, kind: 'carousel', why: 'numbers-heavy · saves on IG' },
    ],
    lineage: [
      { label: 'SERIES',  value: 'Q&A replies · 11 posts',               hint: 'case file 08' },
      { label: 'IDEA',    value: 'Rebreather year-two question',          hint: '1-of-3 ports queued' },
      { label: 'HOOK',    value: 'Question · plain restatement',          hint: '47 occurrences in library' },
    ],
    kin: [
      { id: '0040', similarity: 62, why: 'gear · long-yt · same purchase-decision window' },
      { id: '0035', similarity: 56, why: 'reply · same conversational shape' },
      { id: '0044', similarity: 52, why: 'long-yt · introspective long-form' },
    ],
    primaryAction: '+ Cut the IG version',
  },
};

function HF_R4_LibraryDetail({ postId = '0042' } = {}) {
  const normalizedPostId = String(postId || '0042').split('~')[0];
  const post = R4D_DATA.posts.find(p => p.id === normalizedPostId) || R4D_DATA.posts[0];
  const v    = window.R4_LIB_VISUALS[post.id];
  const copy = R4D_COPY[post.id] || R4D_COPY['0042'];
  const display = v.display; // 'long-yt' | 'short-tt' | 'reel-ig' | 'carousel-ig'
  const durM = Math.floor(post.durationS / 60);
  const durS = String(post.durationS % 60).padStart(2, '0');
  const durLabel = `${durM}:${durS}`;
  const formatLabel = window.r4PlatformLabel(display);

  return (
    <HfShell workspace="library" subtab="Catalog" topbarRight={<R4DTopbar />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 380px', background: 'var(--bg-base)' }}>

        {/* ── Left: content-first ────────────────────────── */}
        <div style={{ overflow: 'auto', padding: '24px 36px 60px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>
            {copy.breadcrumb.map((seg, i) => (
              <React.Fragment key={i}>
                <span>{seg}</span><span>›</span>
              </React.Fragment>
            ))}
            <span style={{ color: 'var(--fg-secondary)' }}>{post.id}</span>
            <span style={{ flex: 1 }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tone-success)' }} />
              <span style={{ color: 'var(--tone-success)' }}>{copy.lifecycle}</span>
            </span>
          </div>

          {/* Title + meta */}
          <header style={{ marginTop: 14, paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <window.R4PillarDot pillar={post.pillar} size={9} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{copy.metaPrefix} · {formatLabel} · {post.publishedAt.toUpperCase()} · {durLabel}</span>
              <window.R4ChannelChip ch={post.channel} />
            </div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 38, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{post.title}.</h1>
            <p style={{ margin: '12px 0 0', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.6, maxWidth: 760 }}>
              {copy.blurb}
            </p>
            {window.R4GOutcomeRail && (
              <div style={{ marginTop: 14, maxWidth: 860 }}>
                <R4GOutcomeRail active="preview" compact title="Source preview in the active run" right={`${post.id} selected as evidence`} />
              </div>
            )}
          </header>

          {/* Embed — format-aware */}
          <R4DEmbed post={post} v={v} display={display} durLabel={durLabel} />

          {/* ── ANALYSIS · 01 · Hook DNA ──────────────────── */}
          <window.R4DHookDNA post={post} />

          {/* Retention curve — the chart */}
          <section style={{ marginTop: 44 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--accent-soft)', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 4 }}>ANALYSIS · 02</div>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1 }}>Retention.</h2>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>WATCH-PCT · {(post.watchPct*100).toFixed(0)}%</span>
            </div>
            <R4DCurve post={post} peakIndex={copy.peakIndex} peakLabel={copy.peakLabel} />
            <div style={{ marginTop: 10, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 760 }}>
              {copy.retentionTakeaway}
            </div>
            {/* Drop-off cards inline with the curve */}
            <window.R4DDropoffCards post={post} />
          </section>

          {/* ── ANALYSIS · 03 · Audience cohorts ──────────── */}
          <window.R4DAudience post={post} />

          {/* ── ANALYSIS · 04 · Comment cluster ───────────── */}
          <window.R4DCommentCluster post={post} />

          {/* ── ANALYSIS · 05 · Performance vs cluster ────── */}
          <window.R4DPerformanceVsCluster post={post} />

          {/* Description / transcript opener */}
          <section style={{ marginTop: 44 }}>
            <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 18, color: 'var(--fg-primary)' }}>Opening 12 seconds · transcript.</h3>
            <blockquote style={{ margin: 0, padding: '14px 18px', borderLeft: '3px solid var(--accent-primary)', background: 'var(--surface-1)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
              {copy.transcript}
            </blockquote>
            <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>{copy.hookCaption}</p>
          </section>

          {/* Reuse moments — auto-detected high-retention segments to pull as variants */}
          {copy.reuseMoments && (
            <section style={{ marginTop: 44 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--accent-soft)', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>What to pull from this.</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{copy.reuseMoments.length} REUSE MOMENTS · AUTO-DETECTED</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {copy.reuseMoments.map((m, i) => (
                  <R4DReuseMomentCard key={i} moment={m} tone={v.tone} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right rail ─────────────────────────────────── */}
        <aside style={{ borderLeft: '1px solid var(--border-subtle)', background: 'var(--surface-1)', overflow: 'auto', padding: '24px 22px 60px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Coopr Score block · with inline 30-day trajectory spark */}
          <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: '16px 18px', background: 'var(--surface-2)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>COOPR SCORE</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 4, justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 44, fontWeight: 500, color: 'var(--accent-primary)', letterSpacing: '-0.025em', lineHeight: 1 }}>{copy.cooprScore}</span>
              {copy.trajectory && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <R4DTrajectorySpark data={copy.trajectory} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--tone-success)', letterSpacing: '0.08em' }}>{copy.velocity}</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.entries(copy.sub).map(([label, val]) => (
                <R4DSubScore key={label} label={label} v={val} />
              ))}
            </div>
          </div>

          {/* What could improve */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', marginBottom: 8 }}>WHAT COULD IMPROVE</div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, fontFamily: 'var(--font-serif)', fontSize: 14.5, color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
              {v.improve}
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600 }}>{copy.primaryAction}</span>
              <span style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid var(--border-default)', fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-secondary)' }}>Save to Memory</span>
            </div>
          </div>

          {/* Lineage */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', marginBottom: 8 }}>LINEAGE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {copy.lineage.map(l => (
                <R4DLineage key={l.label} label={l.label} value={l.value} hint={l.hint} />
              ))}
            </div>
          </div>

          {/* Kin posts — by hook DNA + audience cohort similarity */}
          {copy.kin && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', marginBottom: 8 }}>KIN · BY HOOK DNA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {copy.kin.map(k => (
                  <R4DKinRow key={k.id} kin={k} />
                ))}
              </div>
            </div>
          )}

          {/* Stats compact */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', marginBottom: 8 }}>NUMBERS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 0', borderTop: '1px solid var(--border-subtle)' }}>
              <R4DStat label="Views"        value={r4FmtViews(post.views)} />
              <R4DStat label="Watch %"      value={`${(post.watchPct*100).toFixed(0)}%`} />
              <R4DStat label="Saves"        value={r4FmtViews(post.saves)} />
              <R4DStat label="Comments"     value={r4FmtViews(post.comments)} />
              <R4DStat label="Save / view"  value={`${(post.saves/post.views*100).toFixed(2)}%`} />
              <R4DStat label="Cmts / view"  value={`${(post.comments/post.views*100).toFixed(2)}%`} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button type="button" onClick={() => window.r4gOutcomeNavigate && window.r4gOutcomeNavigate('actions')} style={{ padding: '10px 14px', background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', border: 0, borderRadius: 6, fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, textAlign: 'center', cursor: 'pointer' }}>Open in Studio · spawn variant</button>
            <button type="button" onClick={() => window.r4gOutcomeRecord && window.r4gOutcomeRecord('schedule hold requested')} style={{ padding: '10px 14px', border: '1px solid var(--border-default)', background: 'var(--surface-1)', borderRadius: 6, fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--fg-secondary)', textAlign: 'center', cursor: 'pointer' }}>Schedule a re-share</button>
            <button type="button" onClick={() => window.r4gOutcomeRecord && window.r4gOutcomeRecord('added source to compare')} style={{ padding: '10px 14px', border: '1px solid var(--border-default)', background: 'var(--surface-1)', borderRadius: 6, fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--fg-secondary)', textAlign: 'center', cursor: 'pointer' }}>Add to Compare</button>
          </div>
        </aside>
      </div>
    </HfShell>
  );
}

// ─── Format-aware embed ──────────────────────────────────
// long-yt → 16:9 YouTube-shaped player.
// short-tt / reel-ig → 9:16 phone-shaped frame, centered.
// carousel-ig → 1:1 with carousel chrome.
function R4DEmbed({ post, v, display, durLabel }) {
  if (display === 'long-yt') {
    return (
      <div style={{ marginTop: 22, border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', background: '#0a0a0a', boxShadow: '0 6px 24px rgba(15,14,12,0.10)' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
          <window.R4ThumbBackdrop tone={v.tone}>
            <window.R4ChromeLongYT hook={v.hook} durationS={post.durationS} />
          </window.R4ThumbBackdrop>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="11,7 26,16 11,25" fill="#0a0a0a" /></svg>
            </span>
          </div>
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12, height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 999 }}>
            <div style={{ width: '32%', height: '100%', background: '#FF0033', borderRadius: 999, position: 'relative' }}>
              <span style={{ position: 'absolute', right: -6, top: -4, width: 12, height: 12, borderRadius: '50%', background: '#FF0033' }} />
            </div>
          </div>
          <span style={{ position: 'absolute', left: 14, bottom: 22, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#fff' }}>2:54 / {durLabel}</span>
        </div>
        <div style={{ padding: '14px 20px', background: '#0a0a0a', color: '#f5f5f5', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600 }}>{r4FmtViews(post.views)} views · 3 days ago</span>
          <span style={{ display: 'inline-flex', gap: 14, fontFamily: 'var(--font-sans)', fontSize: 12, color: '#bbb' }}>
            <span>↑ 18K</span><span>↓ 240</span><span>↗ Share</span><span>＋ Save</span>
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 12 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700 }}>H</span>
            <span>Henry Mwangi</span>
            <span style={{ color: '#bbb' }}>· 287K</span>
          </span>
        </div>
      </div>
    );
  }

  // 9:16 phone frame for short-form (TT short, IG reel)
  // Editorial spread: phone on the left (taller, monumental), a "scene scan"
  // widget on the right pulls four key moments from the retention curve and
  // pairs them with timestamps + tiny sparks so the parallel space carries
  // its own information rather than sitting empty.
  if (display === 'short-tt' || display === 'reel-ig') {
    const ChromeFn = display === 'short-tt' ? window.R4ChromeShortTT : window.R4ChromeReelIG;
    const phoneW = 340, phoneH = 605;  // slightly taller than 9:16 for chrome border
    return (
      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: `${phoneW}px 1fr`, gap: 32, alignItems: 'flex-start' }}>
        {/* Phone canvas · left */}
        <div style={{
          position: 'relative',
          width: phoneW, height: phoneH,
          borderRadius: 32,
          overflow: 'hidden',
          background: '#000',
          boxShadow: '0 14px 44px rgba(15,14,12,0.22), 0 2px 6px rgba(15,14,12,0.10), inset 0 0 0 6px #0a0a0a',
        }}>
          <window.R4ThumbBackdrop tone={v.tone}>
            <ChromeFn hook={v.hook} durationS={post.durationS} fullChrome />
          </window.R4ThumbBackdrop>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
              <svg width="26" height="26" viewBox="0 0 32 32"><polygon points="11,7 26,16 11,25" fill="#0a0a0a" /></svg>
            </span>
          </div>
          <span style={{ position: 'absolute', top: 14, left: 14, padding: '3px 8px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#fff', fontWeight: 600 }}>{durLabel}</span>
        </div>

        {/* Scene scan · right · the parallel content */}
        <R4DSceneScan post={post} />
      </div>
    );
  }

  // 1:1 carousel
  return (
    <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 480, aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden', background: '#000', boxShadow: '0 6px 24px rgba(15,14,12,0.10)' }}>
        <window.R4ThumbBackdrop tone={v.tone}>
          <window.R4ChromeCarouselIG hook={v.hook} />
        </window.R4ThumbBackdrop>
      </div>
    </div>
  );
}

// ─── Scene scan (short-form embed companion) ────────────
// Four moments pulled from the retention curve at fixed temporal positions
// (0% / 25% / 50% / end of duration), paired with timestamps, a tiny spark of
// the local retention shape, and an editorial caption. Lives parallel to the
// phone embed in short-form Detail so the spread stops looking centered-and-empty.
function R4DSceneScan({ post }) {
  const data = post.retention;
  const dur = post.durationS;
  const fmtTs = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  // Pick 4 evenly-spaced indices into the 21-sample retention array.
  const moments = [
    { i: 0,  caption: 'open',     hint: 'hook lands' },
    { i: 5,  caption: 'reveal',   hint: 'declaration carries' },
    { i: 12, caption: 'turn',     hint: 'audience commits' },
    { i: 20, caption: 'exit',     hint: 'end-card · loop?' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 18, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>Scene scan.</h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>4 MOMENTS · 0% / 25% / 50% / END</span>
      </div>
      {moments.map((m, idx) => {
        const ts = Math.round((m.i / 20) * dur);
        // Local retention spark — 5 samples around index m.i
        const samples = [-2, -1, 0, 1, 2].map(off => {
          const ii = Math.max(0, Math.min(data.length - 1, m.i + off));
          return data[ii];
        });
        const localPct = data[m.i];
        return (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '64px 80px 1fr auto',
            gap: 16, alignItems: 'center',
            padding: '12px 14px',
            border: '1px solid var(--border-subtle)', borderRadius: 6,
            background: idx === 0 ? 'var(--accent-soft)' : 'var(--surface-1)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>
              {fmtTs(ts)}
            </span>
            <window.R4RetentionSpark data={samples} w={70} h={20} accent={localPct >= 0.6} />
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{m.caption}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 2 }}>{m.hint}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: localPct >= 0.6 ? 'var(--tone-success)' : 'var(--fg-secondary)', fontWeight: 700 }}>
              {(localPct * 100).toFixed(0)}%
            </span>
          </div>
        );
      })}
      <div style={{ paddingTop: 8, fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>
        Generated from the retention curve. Each scan is a 5-sample window centered on the moment — the spark shows local shape, the percentage is hold-rate at that mark.
      </div>
    </div>
  );
}

// ─── Curve component (full retention plot) ──────────────
function R4DCurve({ post, peakIndex = 9, peakLabel = 'peak' }) {
  const W = 760, H = 160;
  const data = post.retention;
  const pts = data.map((val, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (val * H * 0.92) - 6;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const areaPath = `M0,${H} L${pts.split(' ').join(' L')} L${W},${H} Z`;
  const peakX = (peakIndex / (data.length - 1)) * W;
  const peakY = H - data[peakIndex] * H * 0.92 - 6;
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '16px 14px 14px', background: 'var(--surface-1)' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {/* gridlines */}
        {[0.25, 0.5, 0.75, 1].map((g, i) => (
          <line key={i} x1={0} x2={W} y1={H - g*H*0.92 - 6} y2={H - g*H*0.92 - 6} stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray={i === 3 ? 'none' : '2 4'} />
        ))}
        <path d={areaPath} fill="rgba(182,83,43,0.10)" />
        <polyline points={pts} fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx={peakX} cy={peakY} r="3.5" fill="var(--accent-primary)" />
        <text x={peakX + 8} y={peakY - 4} fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-secondary)">{peakLabel}</text>
      </svg>
      <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>
        <span>0:00</span><span>25%</span><span>50%</span><span>75%</span><span>end</span>
      </div>
    </div>
  );
}

// ─── Reuse moment card ──────────────────────────────────
// Each moment card has a tiny clip-strip preview (3 frames lifted from the
// post's tone palette), the time range in mono, the caption in italic-serif,
// the predicted reel/carousel CScore in clay, and a primary CTA. The visual
// idea: this is a *clip*, not just a stat — the strip carries the implication.
function R4DReuseMomentCard({ moment, tone = 'deep-blue' }) {
  const p = window.R4_TONE_PALETTES[tone] || window.R4_TONE_PALETTES['deep-blue'];
  return (
    <article style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: '12px 14px 14px',
      border: '1px solid var(--border-subtle)', borderRadius: 8,
      background: 'var(--surface-1)',
    }}>
      {/* Clip-strip preview · 3 frames with subtle shifts */}
      <div style={{ display: 'flex', gap: 3, height: 60, borderRadius: 4, overflow: 'hidden' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            flex: 1,
            background: `radial-gradient(120% 90% at ${30 + i * 25}% 30%, ${p.via}, ${p.from} 70%)`,
            filter: 'saturate(1.18) contrast(1.04)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent 50%)',
            }} />
          </div>
        ))}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '0.04em' }}>{moment.range}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{moment.kind.toUpperCase()}</span>
        </div>
        <h4 style={{ margin: '4px 0 0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
          {moment.caption}
        </h4>
        <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>{moment.why}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, color: 'var(--accent-primary)', letterSpacing: '-0.018em', lineHeight: 1 }}>{moment.predictedScore}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>PRED</span>
        </span>
        <span style={{ flex: 1 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '5px 10px',
          background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
          borderRadius: 5,
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
        }}>
          Spawn as {moment.kind}
          <svg width="9" height="9" viewBox="0 0 10 10"><path d="M2 8 L8 2 M5 2 L8 2 L8 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
    </article>
  );
}

// ─── Trajectory mini-spark (right rail · score block) ───
// 30-day cumulative-views growth at 70x18px. Filled-area + line so it reads
// as "growing" not "fluctuating".
function R4DTrajectorySpark({ data, w = 70, h = 18 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data) || 1;
  const pts = data.map((val, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (val / max) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const areaPath = `M0,${h} L${pts.split(' ').join(' L')} L${w},${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <path d={areaPath} fill="rgba(74,107,58,0.18)" />
      <polyline points={pts} fill="none" stroke="var(--tone-success)" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Kin row · related post by hook DNA + audience cohort ─
function R4DKinRow({ kin }) {
  const post = window.HF_DATA.posts.find(p => p.id === kin.id);
  if (!post) return null;
  const v = window.R4_LIB_VISUALS[kin.id] || {};
  const p = window.R4_TONE_PALETTES[v.tone || 'deep-blue'];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 10,
      padding: '8px 10px',
      background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 5,
      alignItems: 'center',
    }}>
      {/* Tiny tone-palette thumb · stand-in for post thumbnail */}
      <div style={{
        width: 52, height: 52, borderRadius: 4, overflow: 'hidden',
        background: `radial-gradient(120% 90% at 30% 30%, ${p.via}, ${p.from} 70%)`,
        filter: 'saturate(1.18)',
        position: 'relative',
        flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)' }} />
        <span style={{ position: 'absolute', left: 4, bottom: 3, fontFamily: 'var(--font-mono)', fontSize: 8.5, color: '#fff', fontWeight: 700, letterSpacing: '0.06em' }}>{post.id}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5, fontWeight: 500,
          color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{post.title}</div>
        <div style={{ marginTop: 2, fontFamily: 'var(--font-sans)', fontSize: 10.5, color: 'var(--fg-tertiary)', lineHeight: 1.4 }}>{kin.why}</div>
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 2,
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: kin.similarity >= 75 ? 'var(--tone-success)' : 'var(--fg-secondary)', letterSpacing: '-0.01em' }}>{kin.similarity}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>%</span>
      </span>
    </div>
  );
}

function R4DSubScore({ label, v }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: 'var(--fg-primary)' }}>{v}</span>
      </div>
      <div style={{ marginTop: 4, height: 3, background: 'var(--surface-1)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${v}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: 999 }} />
      </div>
    </div>
  );
}

function R4DLineage({ label, value, hint }) {
  return (
    <div style={{ padding: '8px 10px', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 5 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{label}</div>
      <div style={{ marginTop: 2, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{value}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', whiteSpace: 'nowrap' }}>{hint}</span>
      </div>
    </div>
  );
}

function R4DStat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  );
}

function R4DTopbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--surface-2)', fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
        <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
        <span>Search hooks, titles, themes…</span>
      </span>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700 }}>H</span>
    </div>
  );
}

Object.assign(window, { HF_R4_LibraryDetail });
