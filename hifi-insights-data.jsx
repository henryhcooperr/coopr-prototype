/* global React, BackendNote, FreshnessPill, MetricCell, Spark, Sparkbar, ChannelGlyph, SectionHead, RankedRow, HfShell */
// hifi-insights-data.jsx — data-rich Insights with retention, format matrix,
// pillar mix, posting heatmap, audience cohorts.

const ID = window.HF_DATA;

function HF_InsightsRetention({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('insights', 'Retention');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  // Hook ordering (rules-of-hooks): every React hook must run on every render
  // regardless of state branch. Place ALL hooks above any early return.
  const [activeFmt, setActiveFmt] = React.useState({ longform: true, shorts: true, carousel: false });
  const [scope, setScope] = React.useState('overall'); // 'overall' | per-post id
  const toggleFmt = (k) => setActiveFmt(prev => ({ ...prev, [k]: !prev[k] }));
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="insights" subtab="Retention"><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="insights" subtab="Retention"><window.HF_EmptyHero
      eyebrow="Retention · 0 posts indexed"
      title="No watch curves yet. Retention wakes up after the first 30 days of posts."
      caption="Median curve, top-quartile band, and drop locators arrive once enough posts have data."
      ctaLabel="Open Insights"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="insights" subtab="Retention"><window.HF_ErrorHero
      title="Couldn't load retention curves."
      body="The watch-curve aggregator timed out. Retry, or check the platform connections."
    /></HfShell>;
  }

  // ── Aggregate retention curve · all posts (median) and top-quartile band ──
  const top = ID.posts.filter(p => p.watchPct >= 0.6);
  const avg = (arr) => {
    const n = Math.max(arr.length, 1);
    const out = new Array(21).fill(0);
    arr.forEach(p => p.retention.forEach((v, i) => { out[i] += v; }));
    return out.map(v => v / n);
  };
  const overallAvg = avg(ID.posts);
  const topAvg = avg(top);
  // Industry baseline · gentle reference curve (creator-agnostic), not real data.
  const industryAvg = overallAvg.map((v, i) => Math.max(0.18, v - 0.06 - i * 0.005));

  // Annotation pins anchored to the overall curve. Each is one moment.
  const pins = [
    { i: 0,  label: 'Cold open',  tone: 'var(--tone-success)',                      body: 'first frame holds 92.1%' },
    { i: 1,  label: 'Hook end',   tone: 'var(--accent-primary)',                    body: '5s mark · 78% held' },
    { i: 6,  label: 'Drop @ 30s', tone: 'var(--tone-warning)',                      body: 'biggest single-step loss' },
    { i: 10, label: 'Midpoint',   tone: 'var(--fg-secondary)',                      body: 'where the audience commits' },
    { i: 20, label: 'Final hold', tone: 'var(--tone-info)',                         body: 'tail viewers · loyal' },
  ];

  // ── Per-channel retention sparklines ──
  const channels = [
    { id: 'ig', name: 'Instagram', handle: '@henryhcooper',  median: 64, p75: 78, dropAt: '0:30', coldHold: 92, color: 'var(--accent-primary)', curve: [88, 79, 72, 68, 64, 60, 58, 55, 52, 49] },
    { id: 'yt', name: 'YouTube',   handle: 'henrycooperdive', median: 58, p75: 71, dropAt: '3:00', coldHold: 88, color: 'var(--tone-info)',      curve: [92, 78, 70, 64, 58, 54, 50, 47, 44, 41] },
    { id: 'tt', name: 'TikTok',    handle: '@henryhcooper',  median: 49, p75: 62, dropAt: '0:08', coldHold: 85, color: 'var(--tone-success)',   curve: [85, 70, 60, 55, 49, 44, 40, 37, 34, 31] },
  ];

  // ── Per-post drill grid · 6 most informative posts (mix of strong + weak) ──
  // Picked across the spectrum so the grid teaches what's working AND what isn't.
  const driverIds = ['0042', '0039', '0046', '0045', '0040', '0041'];
  const ownerMedian = 0.587;
  const driverPosts = driverIds
    .map(pid => ID.posts.find(p => p.id === pid))
    .filter(Boolean);

  const openPost = (pid) => {
    if (ms.setActiveSurface) {
      ms.setActiveSurface('library', 'Catalog');
      if (ms.setDetail) ms.setDetail('post', pid);
    } else if (ms.pushToast) {
      ms.pushToast('Open post · ' + pid);
    }
  };

  // The current post-of-focus, if any. Drives the hero verdict and big curve.
  const focused = scope === 'overall' ? null : ID.posts.find(p => p.id === scope);

  return (
    <HfShell workspace="insights" subtab="Retention" subtabRight={<>
      <span className="hf-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>last 30d · all channels</span>
      <FreshnessPill at="14m ago" state="fresh" />
    </>}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-base)', overflow: 'auto' }}>

        {/* ── 1 · Hero verdict band ───────────────────────────────────── */}
        <div style={{ padding: '24px 28px 20px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span className="hf-byline" style={{ fontSize: 10 }}>
              {focused
                ? `Retention · post ${focused.id} · ${focused.publishedAt}`
                : 'Retention · last 30 days · all channels'}
            </span>
            <span className="hf-byline" style={{ fontSize: 10 }}>Pulled 14m ago · n = 142</span>
          </div>
          {focused ? (
            <h1 className="hf-headline" style={{ fontSize: 32, margin: 0, marginBottom: 6, lineHeight: 1.15 }}>
              {focused.watchPct >= ownerMedian + 0.05
                ? <>This post <span style={{ color: 'var(--tone-success)' }}>beats your median by {((focused.watchPct - ownerMedian) * 100).toFixed(1)}pp.</span></>
                : focused.watchPct < ownerMedian - 0.05
                  ? <>This post <span style={{ color: 'var(--tone-danger)' }}>trailed your median by {((ownerMedian - focused.watchPct) * 100).toFixed(1)}pp.</span></>
                  : <>This post <span style={{ color: 'var(--fg-secondary)', fontStyle: 'italic', fontWeight: 400 }}>held the line</span> at your median.</>}
            </h1>
          ) : (
            <h1 className="hf-headline" style={{ fontSize: 32, margin: 0, marginBottom: 6, lineHeight: 1.15 }}>
              Above your top quartile. <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'italic', fontWeight: 400 }}>Holding 71% at the midpoint.</span>
            </h1>
          )}
          <p className="hf-deck" style={{ fontSize: 14, margin: 0, maxWidth: 820, lineHeight: 1.5 }}>
            {focused
              ? `Median watched ${(focused.watchPct * 100).toFixed(0)}% · your channel norm sits at ${(ownerMedian * 100).toFixed(0)}%. The first eight seconds are doing the work; the structural drop is in the cold-open transition.`
              : 'Your median across the last 30 days is 58.7% — three points above your six-month mean and roughly nine points above the comparable creator-set baseline. The cold-open template is doing the work.'}
          </p>
          {focused && (
            <button
              type="button"
              onClick={() => setScope('overall')}
              className="hf-btn"
              style={{ marginTop: 12, fontSize: 11, padding: '4px 10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)' }}>
              Back to overall
            </button>
          )}

          {/* KPI chips — 4 small */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
            {(focused ? [
              { k: 'Median',         v: `${(focused.watchPct * 100).toFixed(1)}%`, sub: `vs your ${(ownerMedian * 100).toFixed(0)}%`, tone: focused.watchPct >= ownerMedian ? 'var(--tone-success)' : 'var(--tone-warning)' },
              { k: 'Top quartile',   v: '—',                                       sub: 'single post',                                tone: 'var(--fg-tertiary)' },
              { k: 'Cold-open hold', v: `${(focused.retention[1] * 100).toFixed(0)}%`,  sub: 'first 5s',                              tone: 'var(--tone-success)' },
              { k: 'Final hold',     v: `${(focused.retention[20] * 100).toFixed(0)}%`, sub: 'tail viewers',                          tone: 'var(--tone-info)' },
            ] : [
              { k: 'Median',         v: '58.7%', sub: '+1.8 vs last month',           tone: 'var(--fg-primary)' },
              { k: 'Top quartile',   v: '71.2%', sub: 'top 25% of posts',             tone: 'var(--accent-primary-press)' },
              { k: 'Cold-open hold', v: '92.1%', sub: 'first 5 seconds',              tone: 'var(--tone-success)' },
              { k: 'Final hold',     v: '49.3%', sub: 'tail viewers · 100% mark',     tone: 'var(--tone-info)' },
            ]).map((kpi, i) => (
              <div key={i} style={{ padding: i === 0 ? '0 16px 0 0' : '0 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="hf-byline" style={{ fontSize: 9.5 }}>{kpi.k}</span>
                <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: kpi.tone, lineHeight: 1.1 }}>{kpi.v}</span>
                <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>{kpi.sub}</span>
              </div>
            ))}
          </div>

          {/* Cohort filter strip — preserved from v3 */}
          {window.HF_FilterChip && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <span className="hf-byline" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)' }}>cohort</span>
              {activeFmt.longform && <window.HF_FilterChip kicker="FORMAT" label="long-form" onRemove={() => toggleFmt('longform')} />}
              {activeFmt.shorts && <window.HF_FilterChip kicker="FORMAT" label="shorts" onRemove={() => toggleFmt('shorts')} />}
              {activeFmt.carousel && <window.HF_FilterChip kicker="FORMAT" label="carousel" onRemove={() => toggleFmt('carousel')} />}
              {window.HF_AddFilterChip && <window.HF_AddFilterChip onClick={() => {
                if (!activeFmt.carousel) toggleFmt('carousel');
                else if (!activeFmt.shorts) toggleFmt('shorts');
                else if (!activeFmt.longform) toggleFmt('longform');
                ms.pushToast && ms.pushToast('Add cohort filter');
              }} />}
            </div>
          )}
        </div>

        {/* ── 2 · Big retention curve ─────────────────────────────────── */}
        <div style={{ padding: '20px 28px 8px', background: 'var(--bg-base)' }}>
          <SectionHead
            kicker={focused ? `post curve · ${focused.id} vs your median` : 'overall median curve · 30d'}
            title={focused ? 'Where this post lost — and held — its viewers' : 'Where viewers leave'}
            italic
          />
          <div style={{ marginTop: 14 }}>
            <RetentionBig
              overallAvg={focused ? focused.retention : overallAvg}
              topAvg={topAvg}
              industryAvg={industryAvg}
              showTop={!focused}
              showOwnerMedian={!!focused}
              ownerMedian={overallAvg}
              pins={focused ? [] : pins}
              onPinClick={(label) => ms.pushToast && ms.pushToast('Open moment · ' + label)}
            />
          </div>
        </div>

        {/* ── 3 · Channel comparison · 3-up ───────────────────────────── */}
        <div style={{ padding: '20px 28px 8px', background: 'var(--bg-base)' }}>
          <SectionHead
            kicker="retention by channel · 30d"
            title="Where each platform holds"
            italic
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 14 }}>
            {channels.map((c) => (
              <div
                key={c.id}
                onClick={() => ms.pushToast && ms.pushToast('Drill · ' + c.name)}
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ChannelGlyph id={c.id} size={18} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{c.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)' }}>{c.handle}</span>
                </div>
                <ChannelSpark curve={c.curve} color={c.color} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="hf-byline" style={{ fontSize: 8.5 }}>median</span>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--fg-primary)' }}>{c.median}%</span>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="hf-byline" style={{ fontSize: 8.5 }}>p75</span>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: c.color }}>{c.p75}%</span>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="hf-byline" style={{ fontSize: 8.5 }}>drop @</span>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--tone-warning)' }}>{c.dropAt}</span>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="hf-byline" style={{ fontSize: 8.5 }}>cold-open</span>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--tone-success)' }}>{c.coldHold}%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4 · Per-post drill grid ─────────────────────────────────── */}
        <div style={{ padding: '20px 28px 8px', background: 'var(--bg-base)' }}>
          <SectionHead
            kicker="per-post curves · last 30 days"
            title="Pick a post to drill in"
            italic
            right={<span className="hf-byline" style={{ fontSize: 9.5 }}>solid · this post · dashed · your median</span>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 14 }}>
            {driverPosts.map((post) => {
              const delta = (post.watchPct - ownerMedian) * 100;
              const dropIdx = post.retention.reduce((acc, v, i) => {
                if (i === 0) return acc;
                const dv = v - post.retention[i - 1];
                return dv < acc.dv ? { i, dv } : acc;
              }, { i: 0, dv: 0 });
              const dropTime = post.durationS > 90
                ? `${Math.floor(post.durationS * dropIdx.i / 20 / 60)}:${String(Math.floor(post.durationS * dropIdx.i / 20) % 60).padStart(2, '0')}`
                : `0:${String(Math.floor(post.durationS * dropIdx.i / 20)).padStart(2, '0')}`;
              const dropColor = delta >= 5 ? 'var(--tone-success)' : delta <= -5 ? 'var(--tone-danger)' : 'var(--tone-warning)';
              const isActive = scope === post.id;

              return (
                <div
                  key={post.id}
                  onClick={() => { setScope(post.id); openPost(post.id); }}
                  style={{
                    background: 'var(--surface-1)',
                    border: '1px solid ' + (isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'),
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    transition: 'border-color 160ms ease',
                  }}>
                  {/* thumbnail row */}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 56, height: 72, flexShrink: 0, borderRadius: 6, overflow: 'hidden', background: 'var(--surface-2)' }}>
                      {window.R4Thumb_Reel
                        ? <window.R4Thumb_Reel post={post} platform={post.channel} />
                        : <div style={{ width: '100%', height: '100%', background: 'var(--surface-2)' }} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{post.id} · {post.publishedAt}</span>
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5,
                        color: 'var(--fg-primary)', lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>{post.title}</span>
                    </div>
                  </div>
                  {/* mini curve · post solid + your-median dashed */}
                  <PostMiniCurve post={post.retention} median={overallAvg} accent={dropColor} />
                  {/* 3 stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span className="hf-byline" style={{ fontSize: 8.5 }}>median</span>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: 'var(--fg-primary)' }}>{(post.watchPct * 100).toFixed(0)}%</span>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span className="hf-byline" style={{ fontSize: 8.5 }}>vs you</span>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: dropColor }}>{delta >= 0 ? '+' : ''}{delta.toFixed(1)}pp</span>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span className="hf-byline" style={{ fontSize: 8.5 }}>dropped</span>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: 'var(--tone-warning)' }}>{dropTime}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 5 · One-thing CTA panel ─────────────────────────────────── */}
        <div style={{ padding: '20px 28px 28px', background: 'var(--bg-base)' }}>
          <div style={{ background: 'var(--accent-soft)', border: '1px solid color-mix(in srgb, var(--accent-primary) 18%, transparent)', borderRadius: 'var(--radius-md)', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span className="hf-byline" style={{ fontSize: 9.5, color: 'var(--accent-primary)' }}>the move · this week</span>
              <span style={{ flex: 1 }} />
              <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary-press)', fontWeight: 600 }}>+12pp expected</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--fg-primary)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
              Trim the cold-open below 1.4s for top quartile. Three of five drops bled in the first eight seconds.
            </h3>
            <p style={{ fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.5, margin: 0 }}>
              Apply to the next four shorts in your queue. Re-cut 0041 first — it has the steepest 0:24 drop.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button
                onClick={() => openPost('0041')}
                className="hf-btn hf-btn-primary"
                style={{ flex: 1, cursor: 'pointer' }}>Open 0041 · re-cut now</button>
              <button
                onClick={() => ms.pushToast && ms.pushToast('Apply rule to draft queue · 4 posts')}
                className="hf-btn"
                style={{ flex: 1, cursor: 'pointer', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary-press)' }}>Apply to draft queue</button>
            </div>
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// Hero retention chart · one curve, reference lines, optional annotation pins.
// Henry's brief: drop the side-annotate widget; pins live on the curve itself.
function RetentionBig({ overallAvg, topAvg, industryAvg, showTop, showOwnerMedian, ownerMedian, pins, onPinClick }) {
  const w = 1080, h = 280, pad = 40;
  const xs = overallAvg || [];
  const stepX = (w - pad * 2) / Math.max(xs.length - 1, 1);
  const yOf = v => h - pad - v * (h - pad * 2);
  const ptsMain = xs.map((v, i) => `${(pad + i * stepX).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
  const ptsTop = (topAvg || []).map((v, i) => `${(pad + i * stepX).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
  const ptsIndustry = (industryAvg || []).map((v, i) => `${(pad + i * stepX).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
  const ptsMedian = (ownerMedian || []).map((v, i) => `${(pad + i * stepX).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
  const areaMain = `${pad},${h - pad} ${ptsMain} ${pad + (xs.length - 1) * stepX},${h - pad}`;
  // Time labels — cold open through 4:00 across 5 ticks.
  const xLabels = ['0:00', '1:00', '2:00', '3:00', '4:00'];
  const xTickIdx = [0, 5, 10, 15, 20];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{ height: 280, display: 'block', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
        {/* y-axis · % held */}
        {[0.25, 0.5, 0.75, 1.0].map(g => (
          <g key={g}>
            <line x1={pad} x2={w - pad} y1={yOf(g)} y2={yOf(g)} stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray={g === 0.5 ? '0' : '2,3'} />
            <text x={pad - 8} y={yOf(g) + 3} fontSize="10" textAnchor="end" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">
              {(g * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        {/* x-axis · time */}
        {xTickIdx.map((i, k) => (
          <g key={i}>
            <line x1={pad + i * stepX} x2={pad + i * stepX} y1={h - pad} y2={h - pad + 4} stroke="var(--fg-tertiary)" strokeWidth="0.6" />
            <text x={pad + i * stepX} y={h - 10} fontSize="10" textAnchor="middle" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">{xLabels[k]}</text>
          </g>
        ))}
        {/* industry baseline · dashed */}
        {industryAvg && <polyline points={ptsIndustry} fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.25" strokeDasharray="3,3" opacity="0.55" />}
        {/* top quartile band · subtle */}
        {showTop && topAvg && <polyline points={ptsTop} fill="none" stroke="var(--accent-primary-press)" strokeWidth="1.25" strokeDasharray="2,2" opacity="0.6" />}
        {/* your median (when in per-post mode) · dashed */}
        {showOwnerMedian && ownerMedian && <polyline points={ptsMedian} fill="none" stroke="var(--fg-secondary)" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />}
        {/* main curve · solid accent + soft area */}
        <polygon points={areaMain} fill="var(--accent-primary)" opacity="0.08" />
        <polyline points={ptsMain} fill="none" stroke="var(--accent-primary)" strokeWidth="2.4" />
        {/* annotation pins · clickable */}
        {(pins || []).map((p, k) => {
          const x = pad + p.i * stepX;
          const y = yOf(xs[p.i] || 0.5);
          return (
            <g key={k} style={{ cursor: 'pointer' }} onClick={() => onPinClick && onPinClick(p.label)}>
              <line x1={x} x2={x} y1={y} y2={y - 28} stroke={p.tone} strokeWidth="1" />
              <circle cx={x} cy={y} r="4.5" fill="var(--surface-1)" stroke={p.tone} strokeWidth="1.75" />
              <circle cx={x} cy={y} r="2" fill={p.tone} />
              {/* pin label · positioned with mono case */}
              <rect x={x - 44} y={y - 46} width="88" height="18" rx="3" fill="var(--surface-1)" stroke={p.tone} strokeWidth="0.75" />
              <text x={x} y={y - 33} fontSize="9.5" textAnchor="middle" fill={p.tone} fontFamily="var(--font-mono)" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
      {/* legend strip below chart */}
      <div style={{ display: 'flex', gap: 18, padding: '10px 4px 0', fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, borderTop: '2.4px solid var(--accent-primary)' }} />
          {showOwnerMedian ? 'this post' : 'your median'}
        </span>
        {showOwnerMedian && ownerMedian && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 16, borderTop: '1.5px dashed var(--fg-secondary)' }} />
            your channel median
          </span>
        )}
        {showTop && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 16, borderTop: '1.25px dashed var(--accent-primary-press)' }} />
            your top quartile
          </span>
        )}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, borderTop: '1.25px dashed var(--fg-tertiary)' }} />
          comparable creators
        </span>
        {(pins || []).length > 0 && (
          <span style={{ marginLeft: 'auto', fontStyle: 'italic', color: 'var(--fg-secondary)' }}>
            click a pin to open the moment
          </span>
        )}
      </div>
    </div>
  );
}

// Compact channel sparkline — used in the channel 3-up.
function ChannelSpark({ curve, color }) {
  const w = 240, h = 56, pad = 4;
  const stepX = (w - pad * 2) / (curve.length - 1);
  const yOf = v => h - pad - (v / 100) * (h - pad * 2);
  const pts = curve.map((v, i) => `${(pad + i * stepX).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
  const area = `${pad},${h - pad} ${pts} ${pad + (curve.length - 1) * stepX},${h - pad}`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: 56, display: 'block' }}>
      <polygon points={area} fill={color} opacity="0.12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
      {curve.map((v, i) => (
        <circle key={i} cx={pad + i * stepX} cy={yOf(v)} r="1.4" fill={color} />
      ))}
    </svg>
  );
}

// Per-post mini retention curve · post (solid) overlaid on owner median (dashed).
function PostMiniCurve({ post, median, accent }) {
  const w = 240, h = 64, pad = 4;
  const xs = post || [];
  const stepX = (w - pad * 2) / Math.max(xs.length - 1, 1);
  const yOf = v => h - pad - v * (h - pad * 2);
  const ptsPost = xs.map((v, i) => `${(pad + i * stepX).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
  const ptsMed = (median || []).map((v, i) => `${(pad + i * stepX).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: 64, display: 'block' }}>
      <polyline points={ptsMed}  fill="none" stroke="var(--fg-secondary)" strokeWidth="1.1" strokeDasharray="3,2.5" opacity="0.55" />
      <polyline points={ptsPost} fill="none" stroke={accent} strokeWidth="1.8" />
    </svg>
  );
}

function BarTrack({ value, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--surface-2)', borderRadius: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${value * 100}%`, background: accent ? 'var(--accent-primary)' : 'var(--fg-secondary)', borderRadius: 1 }} />
      </div>
      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-secondary)', minWidth: 28, textAlign: 'right' }}>{(value * 100).toFixed(0)}%</span>
    </div>
  );
}


// ─── Audience cohort view ─────────────────────────────────
function HF_InsightsAudience({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('insights', 'Audience');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="insights" subtab="Audience"><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="insights" subtab="Audience"><window.HF_EmptyHero
      eyebrow="Audience · 0 cohorts indexed"
      title="No audience data yet. Cohorts arrive after the first sync."
      caption="Age, sentiment, and intent breakdowns appear once a platform reports demographics."
      ctaLabel="Connect a platform"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="insights" subtab="Audience"><window.HF_ErrorHero
      title="Couldn't load the audience cohorts."
      body="The demographic feed timed out. Retry, or check the platform connections."
    /></HfShell>;
  }
  // age × pillar breakdown
  const cohorts = [
    { age: '18-24',  yt: 0.08, ig: 0.21, tt: 0.42, share: 0.18, retentionLift: -0.08 },
    { age: '25-34',  yt: 0.32, ig: 0.41, tt: 0.38, share: 0.36, retentionLift: +0.02 },
    { age: '35-44',  yt: 0.34, ig: 0.22, tt: 0.14, share: 0.24, retentionLift: +0.11 },
    { age: '45-54',  yt: 0.18, ig: 0.11, tt: 0.04, share: 0.14, retentionLift: +0.16 },
    { age: '55+',    yt: 0.08, ig: 0.05, tt: 0.02, share: 0.08, retentionLift: +0.18 },
  ];
  // Demographic detail · age buckets bar chart, top regions list,
  // intent quadrant, 30-day sentiment trend, top-fan strip.
  const ageBuckets = [
    { age: '18-24', pct: 18 },
    { age: '25-34', pct: 36 },
    { age: '35-44', pct: 24 },
    { age: '45-54', pct: 14 },
    { age: '55+',   pct: 8  },
  ];
  const regions = [
    { r: 'US-CA',     pct: 22 },
    { r: 'US-FL',     pct: 14 },
    { r: 'AU-QLD',    pct: 11 },
    { r: 'GB-LDN',    pct: 9  },
    { r: 'PH-NCR',    pct: 7  },
  ];
  const intent = [
    { k: 'Curious',      pct: 38, note: "First-touch viewers — find you via gear search." },
    { k: 'Aspirational', pct: 27, note: "Want to dive someday — engage with story content." },
    { k: 'Practical',    pct: 21, note: "Already certified — save how-tos and gear tests." },
    { k: 'Loyal',        pct: 14, note: "Returning weekly — the core that powers DMs." },
  ];
  // Sentiment 30-day trend · 30 daily values 0..1; rough peak/trough callouts.
  const sent30 = [0.48, 0.52, 0.55, 0.51, 0.58, 0.61, 0.59, 0.62, 0.66, 0.71, 0.68, 0.64, 0.59, 0.61, 0.65, 0.69, 0.72, 0.74, 0.71, 0.68, 0.66, 0.69, 0.73, 0.76, 0.74, 0.71, 0.69, 0.72, 0.75, 0.78];
  const sentMax = Math.max(...sent30);
  const sentMin = Math.min(...sent30);
  const sentMaxIdx = sent30.indexOf(sentMax);
  const sentMinIdx = sent30.indexOf(sentMin);
  const sentW = 360, sentH = 60;
  const sentPath = sent30.map((v, i) => {
    const x = (i / (sent30.length - 1)) * sentW;
    const y = sentH - ((v - 0.4) / 0.4) * sentH;
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
  }).join(' ');
  const fans = [
    { h: '@marina.k',     who: 'Marina K.',     note: '14 saves · 6 replies' },
    { h: '@deepcut.ben',  who: 'Ben Auerbach',  note: '11 saves · 4 replies' },
    { h: '@reefnotes',    who: 'Sam Hwang',     note: '9 saves · 3 replies' },
    { h: '@coldwater_ann',who: 'Annika R.',     note: '8 saves · 5 replies' },
    { h: '@scubadays',    who: 'Tom Mendez',    note: '7 saves · 2 replies' },
  ];

  return (
    <HfShell workspace="insights" subtab="Audience" subtabRight={<FreshnessPill at="14m ago" state="fresh" />}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-base)', overflow: 'auto' }}>
        <div style={{ padding: '20px 28px 16px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
          <span className="hf-byline" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>Insights · audience cohorts</span>
          <h1 className="hf-headline" style={{ fontSize: 28, margin: 0 }}>
            <span style={{ color: 'var(--accent-primary)' }}>35-54</span> watches you longest. <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'italic', fontWeight: 400 }}>Don't write to TikTok cohort.</span>
          </h1>
          <p className="hf-deck" style={{ fontSize: 14, margin: 0, marginTop: 4 }}>
            Pinned memory: <em>"Truk audience indexes older. Don't cut for TikTok pacing."</em> The data confirms it. <BackendNote kind="gap">cohort engine · channel-merged</BackendNote>
          </p>
        </div>

        {/* Top stat band — net new followers / sentiment / sub conv / top region */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '14px 0', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          <MetricCell label="Net new followers" value="+11.4k" delta={+18.2} />
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Sentiment score" value="+0.62" delta={+12.8} accent /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Sub conv · 30d" value="2.6%" delta={+0.4} /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Top region" value="US-CA" deltaSub="22% of reach" /></div>
        </div>

        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Cohort table */}
          <div>
            <SectionHead kicker="age × channel · share of reach" title="Where each audience lives" italic />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 1fr 60px 80px', gap: 10, padding: '8px 14px', fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>age</span>
                <span>YouTube</span>
                <span>Instagram</span>
                <span>TikTok</span>
                <span style={{ textAlign: 'right' }}>share</span>
                <span style={{ textAlign: 'right' }}>ret. lift</span>
              </div>
              {cohorts.map((c, i) => (
                <div
                  key={c.age}
                  onClick={() => ms.pushToast && ms.pushToast('Filter library by audience · ' + c.age)}
                  style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 1fr 60px 80px', gap: 10, padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 12, alignItems: 'center', cursor: 'pointer', transition: 'transform 120ms ease' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--fg-primary)' }}>{c.age}</span>
                  <BarTrack value={c.yt} />
                  <BarTrack value={c.ig} />
                  <BarTrack value={c.tt} />
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--fg-secondary)', fontWeight: 600 }}>{(c.share*100).toFixed(0)}%</span>
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: c.retentionLift >= 0 ? 'var(--tone-success)' : 'var(--tone-danger)', fontWeight: 700 }}>
                    {c.retentionLift >= 0 ? '+' : ''}{(c.retentionLift*100).toFixed(0)}pp
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Channel split */}
          <div>
            <SectionHead kicker="growth · 30d" title="Channel by channel" italic />
            {ID.creator.channels.map(ch => (
              <div
                key={ch.id}
                onClick={() => ms.pushToast && ms.pushToast('Filter library by channel · ' + ch.name)}
                style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'transform 120ms ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <ChannelGlyph id={ch.id} size={20} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)' }}>{ch.name} <span style={{ fontWeight: 400, color: 'var(--fg-tertiary)' }}>{ch.handle}</span></div>
                  </div>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)' }}>{ID.fmtNum(ch.followers)}</span>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: ch.growth30 >= 0 ? 'var(--tone-success)' : 'var(--tone-danger)', fontWeight: 600, minWidth: 50, textAlign: 'right' }}>
                    {ch.growth30 >= 0 ? '+' : ''}{ch.growth30.toFixed(1)}%
                  </span>
                </div>
                <div style={{ marginLeft: 30, fontSize: 11, color: 'var(--fg-tertiary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  {ch.id === 'yt' && 'Skews older. Hold for long-form. Best signal for save rate.'}
                  {ch.id === 'ig' && 'Even age curve. Squares > vertical for saves.'}
                  {ch.id === 'tt' && 'Younger. Lower retention but +18% follower delta on hits.'}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)' }}>
              <div className="hf-byline" style={{ fontSize: 9.5, marginBottom: 4, color: 'var(--accent-primary-press)' }}>Recommendation</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>
                The 35-54 cohort is your retention engine. Keep YouTube long-form; don't compress for TikTok rhythm.
              </div>
            </div>
          </div>

        </div>

        {/* ── Demographic 2-column · age bars + region list ─────── */}
        <div style={{ padding: '8px 24px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <SectionHead kicker="age distribution · 30d" title="Who watches you" italic />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ageBuckets.map((b) => (
                <div
                  key={b.age}
                  onClick={() => ms.pushToast && ms.pushToast('Filter library by age · ' + b.age)}
                  style={{ display: 'grid', gridTemplateColumns: '60px 1fr 50px', gap: 10, alignItems: 'center', cursor: 'pointer', transition: 'opacity 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg-primary)' }}>{b.age}</span>
                  <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: (b.pct * 2.4) + '%', height: '100%', background: 'var(--accent-primary)', transition: 'width 320ms cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)', textAlign: 'right' }}>{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHead kicker="top regions · share of reach" title="Where they live" italic />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {regions.map((r, i) => (
                <div
                  key={r.r}
                  onClick={() => ms.pushToast && ms.pushToast('Filter library by region · ' + r.r)}
                  style={{ display: 'grid', gridTemplateColumns: '70px 1fr 50px', gap: 10, alignItems: 'center', cursor: 'pointer', transition: 'opacity 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>{r.r}</span>
                  <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: (r.pct * 4.5) + '%', height: '100%', background: i === 0 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', transition: 'width 320ms cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg-secondary)', textAlign: 'right' }}>{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Intent quadrant · 2x2 ─────────────────────────────── */}
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <SectionHead kicker="audience intent · why they're here" title="Four reasons people return" italic />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12 }}>
            {intent.map((q, i) => (
              <div
                key={q.k}
                onClick={() => ms.pushToast && ms.pushToast('Filter library by intent · ' + q.k)}
                style={{
                  padding: '14px 18px',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '2px solid ' + (i === 0 ? 'var(--accent-primary)' : i === 3 ? 'var(--tone-success)' : 'var(--fg-tertiary)'),
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{q.k}</span>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--fg-primary)' }}>{q.pct}%</span>
                </div>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{q.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sentiment trend · 30-day sparkline ─────────────────── */}
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <SectionHead kicker="sentiment · 30 days" title="The reply tone, day by day" italic />
          <div
            onClick={() => ms.pushToast && ms.pushToast('Open sentiment detail')}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 20px', cursor: 'pointer', transition: 'opacity 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>30-day score · current +0.62</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tone-success)', fontWeight: 700, letterSpacing: '0.06em' }}>↑ 12% MoM</span>
            </div>
            <svg width={sentW} height={sentH} style={{ display: 'block', overflow: 'visible' }}>
              <path d={sentPath} fill="none" stroke="var(--accent-primary)" strokeWidth={1.6} strokeLinecap="round" />
              <circle cx={(sentMaxIdx / 29) * sentW} cy={sentH - ((sentMax - 0.4) / 0.4) * sentH} r={3.5} fill="var(--tone-success)" />
              <circle cx={(sentMinIdx / 29) * sentW} cy={sentH - ((sentMin - 0.4) / 0.4) * sentH} r={3.5} fill="var(--tone-warning)" />
            </svg>
            <div style={{ marginTop: 10, display: 'flex', gap: 18 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--tone-success)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>peak · day {sentMaxIdx + 1}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-secondary)', marginTop: 2 }}>The Truk Lagoon long-form landed · saves spiked.</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--tone-warning)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>trough · day {sentMinIdx + 1}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-secondary)', marginTop: 2 }}>The buddy-check short opened cold — replies skewed neutral.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top fans strip · 5 avatar circles + handles ───────── */}
        <div style={{ padding: '14px 24px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <SectionHead kicker="top fans · last 30 days" title="The five who keep showing up" italic />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {fans.map((f, i) => (
              <div
                key={f.h}
                onClick={() => ms.pushToast && ms.pushToast('Open fan · ' + f.h)}
                style={{
                  background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  cursor: 'pointer',
                  transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                <span style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c8b08c, #8a7252)',
                  border: '1px solid var(--border-default)',
                }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)' }}>{f.h}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, color: 'var(--fg-tertiary)', textAlign: 'center', lineHeight: 1.3 }}>{f.note}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_InsightsRetention, HF_InsightsAudience });
