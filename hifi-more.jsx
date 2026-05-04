/* global React, window, HfShell, MetricCell, SectionHead, FreshnessPill, BackendNote, ChannelGlyph */
/* hifi-more.jsx — bulk new surfaces: Insights sub-tabs, Studio sub-views,
   Calendar (top-level), Settings, Linked-accounts switcher options,
   Onboarding flow, Briefing-collapse interaction. */

const M = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function ML({ children, c = 'var(--fg-tertiary)', s = 9.5, st = {} }) {
  return <span style={{ fontFamily: M.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', ...st }}>{children}</span>;
}
function MM({ children, c = 'var(--fg-tertiary)', s = 10.5, st = {} }) {
  return <span style={{ fontFamily: M.mono, fontSize: s, color: c, letterSpacing: '0.04em', ...st }}>{children}</span>;
}

// ─────────────────────────────────────────────────────────
// INSIGHTS · OVERVIEW
// ─────────────────────────────────────────────────────────
function HF_InsightsOverview({ state = 'happy' }) {
  // R10 · state variants — read tweaks override, fall back to prop.
  const ovr = window.useSurfaceState && window.useSurfaceState('insights', 'Overview');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="insights" subtab="Overview"><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="insights" subtab="Overview"><window.HF_EmptyHero
      eyebrow="Insights · 0 days indexed"
      title="No data yet. Insights wakes up after the first sync."
      caption="Connect at least one platform; the first sync runs within an hour."
      ctaLabel="Run first sync"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="insights" subtab="Overview"><window.HF_ErrorHero
      title="Couldn't load the 30-day snapshot."
      body="The metrics aggregator timed out. Retry, or check the platform connections."
    /></HfShell>;
  }
  const channels = [
    { id: 'yt', name: 'YouTube',   handle: '@henrydives',     foll: '287.4k', d30: +4.2, views: '1.42M', share: 0.92 },
    { id: 'ig', name: 'Instagram', handle: '@henry.dives',    foll: '98.3k',  d30: +1.1, views: '612k',  share: 0.54 },
    { id: 'tt', name: 'TikTok',    handle: '@henry.underwater', foll: '24.8k', d30: -0.6, views: '288k',  share: 0.22 },
  ];
  const pillars = [
    { name: 'Dive safety',     share: 0.42, eff: 1.42, color: 'var(--accent-primary)', sub: '982k views · 58% completion' },
    { name: 'Gear teardowns',  share: 0.28, eff: 0.92, color: 'var(--tone-info)',      sub: '498k views · 54% completion' },
    { name: 'Story / travel',  share: 0.22, eff: 1.18, color: 'var(--tone-success)',   sub: '624k views · 47% completion' },
    { name: 'Replies / Q&A',   share: 0.08, eff: 1.04, color: 'var(--tone-warning)',   sub: '218k views · 64% completion' },
  ];
  const leaders = [
    { tone: 'up',   t: '0046 · pre-dive checklist', body: '142k views · 68% completion · saves 2× mean' },
    { tone: 'up',   t: '0042 · first wreck',        body: '421k views · top quartile retention · sub conv 2.6%' },
    { tone: 'down', t: '0041 · 12-min primer',      body: '138k views · 31% completion · drop at 3:14' },
    { tone: 'flat', t: 'TikTok cadence',            body: '2 posts in 30d · reach -22% as a result' },
  ];
  const audience = [
    ['Net new followers', '+11.4k', 'across 3 platforms'],
    ['Sub-to-viewer',     '38%',    'of new YT subs returned'],
    ['Avg comment',       '142 ch', 'longer than 78% of niche'],
    ['Sentiment',         '+0.62',  '142 mentions analyzed'],
  ];
  // Wins this month — top 3 hero posts. Thumb represented by initials chip
  // (no fixture image on prototype). Lift compares to channel median.
  const monthWins = [
    { id: '0046', pillar: 'Dive safety',    title: 'pre-dive checklist',  metric: '142k', metricLabel: 'views', lift: '+118%', why: 'Cold open with hand signal · saves 2× channel mean.' },
    { id: '0042', pillar: 'Story / travel', title: 'first wreck dive',    metric: '421k', metricLabel: 'views', lift: '+86%',  why: 'Story arc held retention to the 9:42 mark · sub conv 2.6%.' },
    { id: '0044', pillar: 'Dive safety',    title: 'depth-gauge teardown', metric: '38.4k', metricLabel: 'saves', lift: '+62%',  why: 'B-roll of failure mode at 0:18 · drove every save downstream.' },
  ];
  // Watchouts — 2 underperformers worth a fix.
  const watchouts = [
    { tone: 'warn', tag: 'TikTok',     title: 'Cadence collapsed', body: '2 posts in 30 days. Algorithm cooled — reach is down 22% versus the prior window.', cta: 'Open d011 · this week\'s slot' },
    { tone: 'warn', tag: 'Long-form',  title: 'Primer hooks lost the room', body: '12-min primers averaging 31% completion. Drop concentrated at 3:14 (silent cut).', cta: 'Review hook patterns' },
  ];

  return (
    <HfShell workspace="insights" subtab="Overview" subtabRight={<>
      <span className="hf-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>last 30d · ending Apr 24</span>
      <FreshnessPill at="14m ago" state="fresh" />
    </>}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-base)' }}>
        {/* Editorial header — single byline row, tight headline + one-line deck */}
        <div style={{ padding: '18px 28px 16px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span className="hf-byline" style={{ fontSize: 10 }}>Insights · overview · last 30 days</span>
            <span className="hf-byline" style={{ fontSize: 10 }}>3 platforms · 47 posts indexed</span>
          </div>
          {/* Newsticker: since-last-visit diff — distinguishes the front-door surface from drilldowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, padding: '7px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--fg-secondary)', fontWeight: 700 }}>Since Mon 09:00</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><span className="hf-num" style={{ color: 'var(--tone-success)', fontWeight: 600 }}>+1.4k</span> followers</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><span className="hf-num" style={{ color: 'var(--tone-success)', fontWeight: 600 }}>+18%</span> saves</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><span className="hf-num" style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>2</span> new flagships</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span><span className="hf-num" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>0</span> misses</span>
            <span style={{ flex: 1 }} />
            <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'normal' }}>4d ago</span>
          </div>
          <h1 className="hf-headline" style={{ fontSize: 30, margin: 0, marginBottom: 6 }}>
            <span style={{ color: 'var(--accent-primary)' }}>+22% saves</span>, +12% views. <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'italic', fontWeight: 400 }}>One channel is going backwards.</span>
          </h1>
          <p className="hf-deck" style={{ fontSize: 13.5, margin: 0, maxWidth: 980, lineHeight: 1.5 }}>
            YouTube carries the volume; TikTok cadence collapsed; Instagram is flat. Two pillars (safety + story) account for 64% of yield.
          </p>
        </div>

        {/* KPI strip · B4 — five tiles, edge-padded so the leftmost number sits inside the
            page gutter instead of crashing into the rail. Tooltips preserved on F/V/S. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '14px 12px', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          {window.HF_Tooltip
            ? <window.HF_Tooltip label="Followers across all 3 channels"><MetricCell label="Total followers" value="410.5k" delta={+2.8} /></window.HF_Tooltip>
            : <MetricCell label="Total followers" value="410.5k" delta={+2.8} />}
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}>
            {window.HF_Tooltip
              ? <window.HF_Tooltip label="Total views vs prior 30d"><MetricCell label="Views" value="2.32M" delta={+12.0} /></window.HF_Tooltip>
              : <MetricCell label="Views" value="2.32M" delta={+12.0} />}
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Watch time" value="184k" unit="h" delta={+8.4} /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}>
            {window.HF_Tooltip
              ? <window.HF_Tooltip label="Saves vs prior 30d"><MetricCell label="Saves" value="34.1k" delta={+22.0} accent /></window.HF_Tooltip>
              : <MetricCell label="Saves" value="34.1k" delta={+22.0} accent />}
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Replies sent" value="64" deltaSub="avg 4.2h response" /></div>
        </div>

        {/* Body — left column carries channel + pillar tables and the new wins/watchouts
            cards. Right rail keeps leaders + audience + CTA. */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', gap: 1, background: 'var(--border-subtle)', overflow: 'hidden', minHeight: 0 }}>

          {/* LEFT — channels + pillars + wins + watchouts */}
          <div style={{ background: 'var(--bg-base)', padding: '20px 24px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SectionHead
              kicker="channel performance · 30d"
              title="Where the volume lives"
              italic
              right={<span className="hf-byline" style={{ fontSize: 10 }}>3 platforms</span>}
            />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '20px 150px 1fr 80px 64px 80px', gap: 12, padding: '8px 16px', fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border-subtle)' }}>
                <span />
                <span>channel</span>
                <span>share of reach</span>
                <span style={{ textAlign: 'right' }}>followers</span>
                <span style={{ textAlign: 'right' }}>30d</span>
                <span style={{ textAlign: 'right' }}>views</span>
              </div>
              {channels.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => ms.pushToast && ms.pushToast('Filter library by channel · ' + c.name)}
                  style={{ display: 'grid', gridTemplateColumns: '20px 150px 1fr 80px 64px 80px', gap: 12, padding: '7px 16px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', fontSize: 12.5, alignItems: 'center', cursor: 'pointer', transition: 'transform 120ms ease' }}>
                  <ChannelGlyph id={c.id} size={18} />
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: 'var(--fg-primary)' }}>{c.name}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.handle}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 1, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${c.share * 100}%`, background: 'var(--accent-primary)', borderRadius: 1 }} />
                  </div>
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--fg-primary)', fontWeight: 600 }}>{c.foll}</span>
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: c.d30 >= 0 ? 'var(--tone-success)' : 'var(--tone-danger)', fontWeight: 700 }}>
                    {c.d30 >= 0 ? '+' : ''}{c.d30.toFixed(1)}%
                  </span>
                  <span className="hf-num" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--fg-secondary)' }}>{c.views}</span>
                </div>
              ))}
            </div>

            <SectionHead kicker="yield by pillar · 30d" title="What pulls its weight" italic />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '12px 170px 56px 1fr 56px', gap: 12, padding: '8px 16px', fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border-subtle)' }}>
                <span />
                <span>pillar</span>
                <span style={{ textAlign: 'right' }}>share</span>
                <span>yield index</span>
                <span style={{ textAlign: 'right' }}>lift</span>
              </div>
              {pillars.map((p, i) => {
                // Cap proportional bar at 1.3x so the dive-safety bar reads inside
                // the row instead of running edge-to-edge.
                const barPct = Math.min(p.eff, 1.3) / 1.3 * 100;
                return (
                  <div
                    key={p.name}
                    onClick={() => ms.pushToast && ms.pushToast('Filter library by pillar · ' + p.name)}
                    style={{ display: 'grid', gridTemplateColumns: '12px 170px 56px 1fr 56px', gap: 12, padding: '7px 16px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', fontSize: 12.5, alignItems: 'center', cursor: 'pointer', transition: 'transform 120ms ease' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--fg-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.sub}</div>
                    </div>
                    <span className="hf-num" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--fg-secondary)' }}>{(p.share * 100).toFixed(0)}%</span>
                    <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 1, position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, width: `${barPct}%`, background: p.eff >= 1 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', borderRadius: 1 }} />
                      <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${100 / 1.3}%`, width: 1, background: 'var(--border-subtle)' }} title="parity" />
                    </div>
                    <span className="hf-num" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: p.eff >= 1 ? 'var(--tone-success)' : 'var(--tone-danger)', fontWeight: 700 }}>
                      {p.eff.toFixed(2)}x
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Wins this month — 3 hero cards */}
            <SectionHead kicker="wins this month · top 3" title="What earned the volume" italic />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {monthWins.map((w) => (
                <div
                  key={w.id}
                  onClick={() => {
                    if (ms.setActiveSurface) ms.setActiveSurface('library', 'Catalog');
                    if (ms.setDetail) ms.setDetail('post', w.id);
                  }}
                  style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer', transition: 'transform 120ms ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 4, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-secondary)', fontWeight: 600 }}>{w.id}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <span className="hf-byline" style={{ fontSize: 9 }}>{w.pillar}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.title}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{w.metric}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)' }}>{w.metricLabel}</span>
                    <span style={{ flex: 1 }} />
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tone-success)', fontWeight: 700 }}>{w.lift}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, color: 'var(--fg-secondary)', lineHeight: 1.45 }}>{w.why}</p>
                </div>
              ))}
            </div>

            {/* Watchouts — 2 cards with fix CTA */}
            <SectionHead kicker="watchouts · needs a fix" title="Where the floor is dropping" italic />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {watchouts.map((w, i) => (
                <div
                  key={i}
                  style={{ background: 'var(--surface-1)', border: '1px solid var(--tone-warning)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tone-warning)' }} />
                    <span className="hf-byline" style={{ fontSize: 9.5, color: 'var(--tone-warning)' }}>{w.tag}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', lineHeight: 1.25 }}>{w.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{w.body}</div>
                  <button
                    onClick={() => ms.pushToast && ms.pushToast(w.cta)}
                    className="hf-btn hf-btn-ghost"
                    style={{ alignSelf: 'flex-start', cursor: 'pointer', fontSize: 11.5 }}>{w.cta}</button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — leaders + audience + CTA */}
          <div style={{ background: 'var(--surface-1)', padding: '20px 18px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div>
              <SectionHead kicker="this month's leaders" title="What worked" italic rule={false} />
              {leaders.map((r, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const winId = (r.t || '').split(' ')[0];
                    if (ms.setActiveSurface) ms.setActiveSurface('library', 'Catalog');
                    if (winId && ms.setDetail) ms.setDetail('post', winId);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'transform 120ms ease' }}>
                  <span className="hf-dot" style={{ width: 6, height: 6, flex: '0 0 auto', background: r.tone === 'up' ? 'var(--tone-success)' : r.tone === 'down' ? 'var(--tone-warning)' : 'var(--fg-tertiary)' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '0 0 auto', maxWidth: 170 }}>{r.t}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>{r.body}</span>
                </div>
              ))}
            </div>

            <div>
              <SectionHead kicker="audience health · 30d" title="Who's listening" italic rule={false} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 4 }}>
                {audience.map(([k, v, sub], i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 0', borderTop: i < 2 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <span className="hf-byline" style={{ fontSize: 9.5 }}>{k}</span>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{v}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <div className="hf-byline" style={{ fontSize: 9.5, marginBottom: 6 }}>One thing to do</div>
              <div style={{ fontSize: 13, color: 'var(--fg-primary)', marginBottom: 10, lineHeight: 1.5 }}>
                Restart Tuesday TikTok cadence. Two posts in 30d cost roughly <span className="hf-num" style={{ color: 'var(--tone-warning)', fontWeight: 600 }}>-180k reach</span>.
              </div>
              <button
                onClick={() => ms.pushToast && ms.pushToast('Open project detail · d011')}
                className="hf-btn hf-btn-primary"
                style={{ width: '100%', cursor: 'pointer' }}>Open d011 · this week's TT slot</button>
            </div>

          </div>
        </div>
      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// INSIGHTS · FORMAT DNA  (sister page to Intel-DNA but data-led)
// ─────────────────────────────────────────────────────────
function HF_InsightsFormatDNA({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('insights', 'Formats');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="insights" subtab="Formats"><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="insights" subtab="Formats"><window.HF_EmptyHero
      eyebrow="Formats · 0 patterns"
      title="No format patterns yet. They emerge after a dozen posts."
      caption="Top formats, hook structures, and channel mix with their lift will land here as the library grows."
      ctaLabel="Open Insights"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="insights" subtab="Formats"><window.HF_ErrorHero
      title="Couldn't load Formats."
      body="The pattern engine timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  const formats = [
    { l: 'Safety primer · short', x: 78, y: 28, n: 65, color: 'var(--accent-primary)', avgRet: 0.71, lift: 0.42, sub: 'Short verticals · cold-open + reveal',     length: '0:30-1:30' },
    { l: 'Story · long',          x: 38, y: 18, n: 42, color: 'var(--accent-primary)', avgRet: 0.62, lift: 0.18, sub: 'Long-form YT · slow-build narrated',        length: '8-14m' },
    { l: 'Gear teardown',         x: 28, y: 52, n: 28, color: 'var(--tone-info)',      avgRet: 0.58, lift: 0.52, sub: 'Saves leader · technical viewer',            length: '4-8m' },
    { l: 'Reply / Q&A',           x: 14, y: 38, n: 14, color: 'var(--tone-success)',   avgRet: 0.54, lift: 0.04, sub: 'Reactive · audience-driven',                 length: '0:45-2:00' },
    { l: 'List or carousel',      x: 9,  y: 78, n: 7,  color: 'var(--tone-warning)',   avgRet: 0.31, lift: -0.18, sub: 'IG carousel · low cost, low return',         length: '6-9 slides' },
  ];
  // Top-10 ranked formats by lift — primary list section.
  // structure pill labels: Cold-open / Burn-in / Q-bait / Stack / Cliffhanger
  const top10 = [
    { name: 'First-person POV cold open',     structure: 'Cold-open',   lift: 42, n: 28, channels: ['ig', 'tt'],       sub: 'Open in motion · narrated 0:00-0:04' },
    { name: 'Gear teardown · constraint reveal', structure: 'Burn-in',  lift: 38, n: 22, channels: ['yt'],             sub: 'Reveal a hidden flaw · 4-8m' },
    { name: 'Mistake-first short',            structure: 'Cold-open',   lift: 31, n: 18, channels: ['ig', 'tt'],       sub: 'Lead with what you got wrong' },
    { name: 'Quiet object hook',              structure: 'Cliffhanger', lift: 24, n: 12, channels: ['ig'],             sub: 'Single object on table · whisper-led' },
    { name: 'Stat-led claim',                 structure: 'Stack',       lift: 19, n: 11, channels: ['yt', 'ig'],       sub: 'One number, three proofs' },
    { name: 'Direct rebuttal short',          structure: 'Q-bait',      lift: 14, n: 9,  channels: ['tt'],             sub: 'Quote a claim · counter it' },
    { name: 'Negative-space carousel',        structure: 'Stack',       lift: 11, n: 8,  channels: ['ig'],             sub: 'White slides · single line per' },
    { name: 'POV reframe',                    structure: 'Burn-in',     lift:  6, n: 7,  channels: ['ig', 'yt'],       sub: 'Same scene · different lens' },
    { name: 'Calendar callout',               structure: 'Q-bait',      lift:  4, n: 5,  channels: ['ig'],             sub: 'Sunday 09:00 anchor slot' },
    { name: 'Question opener',                structure: 'Q-bait',      lift: -8, n: 4,  channels: ['ig', 'tt'],       sub: 'Worst 0:03 hold of any archetype' },
  ];
  // Structure breakdown — 5 archetypes that compose the way you assemble a piece.
  const structures = [
    { name: 'Cold-open',   pct: 0.71, n: 38, lift: 0.34, beats: ['hook', 'reveal', 'thesis', 'proof', 'call'],   desc: 'Lead with the result. Earn the setup back.', note: 'Strongest for shorts under 2:00.', sample: '0046' },
    { name: 'Burn-in',     pct: 0.58, n: 22, lift: 0.22, beats: ['setup', 'tension', 'reveal', 'reframe'],       desc: 'Slow build to a single moment of payoff.', note: 'Best for the gear-teardown cohort.', sample: '0040' },
    { name: 'Q-bait',      pct: 0.42, n: 18, lift: 0.04, beats: ['question', 'context', 'answer'],               desc: 'Pose a question. Withhold. Resolve.', note: 'Drags retention. Carries comments.', sample: '0036' },
    { name: 'Stack',       pct: 0.62, n: 14, lift: 0.16, beats: ['claim', 'claim', 'claim', 'recap'],            desc: 'Three short proofs in a row. Recap.', note: 'Strong for Reels · weak for YT.', sample: '0039' },
    { name: 'Cliffhanger', pct: 0.48, n: 11, lift: 0.18, beats: ['hook', 'half-reveal', 'pause', 'finish'],      desc: 'Half-reveal at 0:08. Finish at the end.', note: 'Best on Sunday 09:00 slot.', sample: '0042' },
  ];
  // 3-channel × 5-format heatmap — lift values (negative = drag, positive = lift)
  const heatChannels = ['IG', 'YT', 'TT'];
  const heatFormats = ['Safety primer', 'Story · long', 'Gear teardown', 'Reply / Q&A', 'List / carousel'];
  // rows = channel, cols = format; values are lift % (vs that channel's mean)
  const heatGrid = [
    [42,  10,  18,  8, -22], // IG
    [28,  44,  52, 14, -10], // YT
    [38,  -4,  16,  6, -18], // TT
  ];
  // Emerging formats — gaining signal but not yet dominant. Shown as 3-card strip.
  const emerging = [
    { name: 'Whisper-track gear primer',  growth: '+24%', sample: 6,  tag: 'low-volume',     sub: 'Six tries · two of them in your top quartile.' },
    { name: 'Two-shot reply short',       growth: '+18%', sample: 9,  tag: 'reactive',       sub: 'Up nine straight weeks · save rate trending.' },
    { name: 'Diptych carousel',           growth: '+12%', sample: 5,  tag: 'experimental',   sub: 'New since Mar 28 · IG only · early signal.' },
  ];
  // Top format hero — example post chips (clickable to library detail)
  const heroExamples = [
    { id: '0046', label: 'Three things I check' },
    { id: '0039', label: 'The eight-second rule' },
    { id: '0038', label: 'Flooded mask · no panic' },
  ];
  // Top format hero — synthetic retention curve for the inline spark
  const heroRetention = [1.0, 0.92, 0.84, 0.78, 0.74, 0.71, 0.68, 0.65, 0.62, 0.58];

  // Color hint for structure pill background (low-saturation by structure family)
  const structureTint = {
    'Cold-open':   'var(--accent-soft)',
    'Burn-in':     'color-mix(in srgb, var(--tone-info) 12%, transparent)',
    'Q-bait':      'color-mix(in srgb, var(--tone-warning) 16%, transparent)',
    'Stack':       'color-mix(in srgb, var(--tone-success) 14%, transparent)',
    'Cliffhanger': 'color-mix(in srgb, var(--accent-primary) 10%, transparent)',
  };

  return (
    <HfShell workspace="insights" subtab="Formats" subtabRight={<>
      <span className="hf-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>last 30d</span>
      <FreshnessPill at="14m ago" state="fresh" />
    </>}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-base)' }}>

        {/* SECTION 1 · HERO VERDICT BAND ─────────────────────────────────── */}
        <div style={{ padding: '22px 28px 18px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span className="hf-byline" style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Formats · last 30 days · what repeated, what peaked</span>
            <span className="hf-byline" style={{ fontSize: 10 }}>n = 156 posts · 10 formats tracked</span>
          </div>
          <h1 className="hf-headline" style={{ fontSize: 32, margin: 0, marginBottom: 6, lineHeight: 1.15 }}>
            <span style={{ fontStyle: 'italic' }}>Two formats account for </span><span style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>71% of your wins.</span>
          </h1>
          <p className="hf-deck" style={{ fontSize: 14, margin: 0, maxWidth: 920, lineHeight: 1.55 }}>
            <span style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>First-person POV cold open</span> and <span style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>Gear teardown · constraint reveal</span> are doing the heavy lifting. The <span style={{ color: 'var(--tone-warning)' }}>Question opener</span> is dragging every shoot it touches. <BackendNote kind="gap">format engine · niche-blind</BackendNote>
          </p>

          {/* 4 KPI chips */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 158 }}>
              <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Top format</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.2 }}>POV cold open</span>
              <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tone-success)', fontWeight: 700 }}>+42% lift · n=28</span>
            </div>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 158 }}>
              <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Runner-up</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.2 }}>Gear teardown</span>
              <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tone-success)', fontWeight: 700 }}>+38% lift · n=22</span>
            </div>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 158 }}>
              <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Failed format</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.2 }}>Question opener</span>
              <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--tone-warning)', fontWeight: 700 }}>-8% lift · retire</span>
            </div>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 158 }}>
              <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Format coverage</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.2 }}>78%</span>
              <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 600 }}>10 of 13 archetypes</span>
            </div>
          </div>
        </div>

        {/* SECTION 2 · TOP FORMAT HERO CARD ──────────────────────────────── */}
        <div style={{ padding: '20px 28px 0' }}>
          <div style={{
            background: 'var(--accent-soft)',
            border: '1px solid color-mix(in srgb, var(--accent-primary) 22%, transparent)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 22px',
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: 24,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span className="hf-byline" style={{ fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>your top format · last 30d</span>
                <span style={{ flex: 1 }} />
                <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary-press)', fontWeight: 600 }}>structure: cold-open</span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 30, fontWeight: 500, margin: 0, color: 'var(--fg-primary)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                First-person POV cold open
              </h2>

              {/* 4 stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, paddingTop: 4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Posts using it</span>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>28</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Median lift</span>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--tone-success)', letterSpacing: '-0.01em' }}>+42%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Median retention</span>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>71%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Top quartile</span>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>61%</span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 560 }}>
                Open in motion · narrated 0:00-0:04 · constraint named by 0:08. Strongest hold rate in your library; 17 of 28 posts land in your top quartile.
              </p>

              {/* Example post chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', paddingTop: 4 }}>
                <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 4 }}>recent:</span>
                {heroExamples.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      if (ms.setActiveSurface) ms.setActiveSurface('library', 'Catalog');
                      if (ms.setDetail) ms.setDetail('post', ex.id);
                      if (ms.pushToast) ms.pushToast('Open post · ' + ex.id);
                    }}
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      color: 'var(--fg-primary)',
                    }}>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)' }}>{ex.id}</span>
                    <span>{ex.label}</span>
                  </button>
                ))}
              </div>

              <div style={{ paddingTop: 6 }}>
                <button
                  onClick={() => ms.pushToast && ms.pushToast('Use format · POV cold open · queued in Studio')}
                  className="hf-btn hf-btn-primary"
                  style={{ cursor: 'pointer' }}>
                  Use this format in next draft
                </button>
              </div>
            </div>

            {/* Right: retention spark + caption */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
              <span className="hf-byline" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>typical retention curve</span>
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px 14px 10px' }}>
                <window.R4RetentionSpark data={heroRetention} w={252} h={64} accent />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>
                  <span>0:00</span><span>0:30</span><span>1:00</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                Holds 71% at the median. Drop happens late, not early — a fingerprint of the cold-open shape.
              </span>
            </div>
          </div>
        </div>

        {/* Body grid (single column from here) */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'var(--border-subtle)', overflow: 'hidden', minHeight: 0 }}>
          <div style={{ background: 'var(--bg-base)', padding: '20px 28px 28px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* SECTION 3 · TOP 10 FORMATS RANKED ─────────────────────────── */}
            <SectionHead
              kicker="top 10 formats · ranked by lift"
              title="What earns vs what drags"
              italic
              right={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>last 30d · n = 156</span>}
            />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '6px 0' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 130px 60px 1fr 88px 60px', gap: 14, padding: '10px 18px', fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>#</span>
                <span>format</span>
                <span>structure</span>
                <span style={{ textAlign: 'right' }}>posts</span>
                <span>lift</span>
                <span style={{ textAlign: 'right' }}>lift %</span>
                <span style={{ textAlign: 'right' }}>channels</span>
              </div>
              {top10.map((row, i) => {
                const liftPct = row.lift;
                const liftAbs = Math.min(Math.abs(liftPct), 50) / 50;
                const liftPositive = liftPct >= 0;
                const liftColor = liftPct >= 10 ? 'var(--tone-success)' : liftPct < 0 ? 'var(--tone-warning)' : 'var(--fg-tertiary)';
                return (
                  <div
                    key={row.name}
                    onClick={() => ms.pushToast && ms.pushToast('Drill format · ' + row.name)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr 130px 60px 1fr 88px 60px',
                      gap: 14,
                      padding: '12px 18px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: 12.5,
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background 120ms ease',
                    }}>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 700 }}>{(i + 1).toString().padStart(2, '0')}</span>
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.25, letterSpacing: '-0.005em' }}>{row.name}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', lineHeight: 1.35 }}>{row.sub}</span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      background: structureTint[row.structure] || 'var(--surface-2)',
                      color: 'var(--fg-secondary)',
                      padding: '4px 8px', borderRadius: 3,
                      width: 'max-content',
                    }}>{row.structure}</span>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-secondary)', textAlign: 'right' }}>{row.n}</span>
                    {/* Bidirectional lift bar */}
                    <div style={{ position: 'relative', height: 6, background: 'var(--surface-2)', borderRadius: 1, marginRight: 4 }}>
                      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'var(--border-strong)' }} />
                      <div style={{
                        position: 'absolute', top: 0, bottom: 0,
                        left: liftPositive ? '50%' : `${50 - liftAbs * 50}%`,
                        width: `${liftAbs * 50}%`,
                        background: liftPositive ? 'var(--accent-primary)' : 'var(--tone-warning)',
                        borderRadius: 1,
                      }} />
                    </div>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: liftColor, textAlign: 'right' }}>
                      {liftPositive ? '+' : ''}{liftPct}%
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                      {row.channels.map(ch => <window.R4ChannelChip key={ch} ch={ch} />)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SECTION 4 · FORMAT × CHANNEL HEATMAP ───────────────────────── */}
            <SectionHead
              kicker="lift by channel × format"
              title="Where each format earns"
              italic
              right={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>vs that channel's mean</span>}
            />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 18px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '64px repeat(5, 1fr)', gap: 8, marginBottom: 8 }}>
                <span />
                {heatFormats.map(f => (
                  <span key={f} style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', textAlign: 'center', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{f}</span>
                ))}
              </div>
              {heatChannels.map((c, ri) => (
                <div key={c} style={{ display: 'grid', gridTemplateColumns: '64px repeat(5, 1fr)', gap: 8, marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-secondary)', alignSelf: 'center', letterSpacing: '0.04em', fontWeight: 600 }}>{c}</span>
                  {heatGrid[ri].map((v, ci) => {
                    const isPos = v >= 0;
                    const intensity = Math.min(Math.abs(v), 60) / 60;
                    const swatch = isPos ? 'var(--accent-primary)' : 'var(--tone-warning)';
                    const fmtName = heatFormats[ci];
                    return (
                      <div
                        key={ci}
                        onClick={() => ms.pushToast && ms.pushToast('Filter library by ' + c + ' · ' + fmtName)}
                        style={{
                          height: 48, borderRadius: 4,
                          background: `color-mix(in oklab, ${swatch} ${(intensity * 70).toFixed(0)}%, var(--surface-2))`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                          color: intensity > 0.4 ? (isPos ? 'var(--fg-on-accent)' : 'var(--tone-warning)') : 'var(--fg-secondary)',
                          transition: 'transform 120ms ease',
                        }}>
                        {isPos ? '+' : ''}{v}%
                      </div>
                    );
                  })}
                </div>
              ))}
              <div style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', marginTop: 14, fontStyle: 'italic', lineHeight: 1.5 }}>
                YT · Gear teardown is your single highest-yielding cell at <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--tone-success)' }}>+52%</span>. IG carousels are the largest drag at <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--tone-warning)' }}>-22%</span>.
              </div>
            </div>

            {/* SECTION 5 · HOOK STRUCTURE BREAKDOWN ───────────────────────── */}
            <SectionHead
              kicker="hook structures · how the piece is assembled"
              title="The five shapes you build with"
              italic
              right={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>n = 103 across 5</span>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {structures.map(st => {
                const liftPct = st.lift * 100;
                const liftPositive = liftPct >= 0;
                const liftColor = liftPct >= 15 ? 'var(--tone-success)' : liftPct < 0 ? 'var(--tone-warning)' : 'var(--fg-secondary)';
                return (
                  <div
                    key={st.name}
                    onClick={() => ms.pushToast && ms.pushToast('Open structure · ' + st.name)}
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 14px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      minHeight: 220,
                    }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        background: structureTint[st.name] || 'var(--surface-2)',
                        color: 'var(--fg-secondary)',
                        padding: '3px 7px', borderRadius: 2,
                      }}>{st.name}</span>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: liftColor, fontWeight: 700 }}>
                        {liftPositive ? '+' : ''}{liftPct.toFixed(0)}%
                      </span>
                    </div>

                    <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-primary)', margin: 0, lineHeight: 1.35, minHeight: 36 }}>
                      {st.desc}
                    </p>

                    {/* Lift bar */}
                    <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 1, position: 'relative' }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        width: `${Math.min(Math.abs(liftPct), 50) * 2}%`,
                        background: liftColor,
                        borderRadius: 1,
                      }} />
                    </div>

                    {/* Beats */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {st.beats.map((b, bi) => (
                        <span key={bi} style={{
                          fontFamily: 'var(--font-mono)', fontSize: 8.5,
                          color: 'var(--fg-tertiary)',
                          background: 'var(--bg-base)',
                          padding: '2px 5px', borderRadius: 2,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>{b}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)' }}>n = {st.n}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (ms.setActiveSurface) ms.setActiveSurface('library', 'Catalog');
                          if (ms.setDetail) ms.setDetail('post', st.sample);
                          if (ms.pushToast) ms.pushToast('Open example · ' + st.sample);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-primary-press)',
                          fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          cursor: 'pointer', padding: 0,
                        }}>
                        Example {st.sample} →
                      </button>
                    </div>

                    <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', fontStyle: 'italic', lineHeight: 1.4 }}>{st.note}</span>
                  </div>
                );
              })}
            </div>

            {/* SECTION 6 · EMERGING FORMATS ──────────────────────────────── */}
            <SectionHead
              kicker="formats gaining signal · last 14 days"
              title="What's earning attention but not yet dominant"
              italic
              right={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>candidates · low sample</span>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {emerging.map(em => (
                <div
                  key={em.name}
                  style={{
                    background: 'var(--surface-1)',
                    border: '1px dashed var(--border-strong)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      background: 'var(--surface-2)',
                      color: 'var(--fg-tertiary)',
                      padding: '3px 7px', borderRadius: 2,
                    }}>{em.tag}</span>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--tone-success)' }}>
                      {em.growth}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, fontWeight: 500, margin: 0, color: 'var(--fg-primary)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                    {em.name}
                  </h3>

                  <p style={{ fontSize: 12, color: 'var(--fg-secondary)', margin: 0, lineHeight: 1.5 }}>{em.sub}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)' }}>n = {em.sample}</span>
                    <button
                      onClick={() => ms.pushToast && ms.pushToast('Promote format · ' + em.name)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--accent-primary)',
                        color: 'var(--accent-primary-press)',
                        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                        padding: '5px 10px', borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}>
                      Promote
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Closing one-thing-to-do */}
            <div style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              marginTop: 4,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="hf-byline" style={{ fontSize: 9.5, marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>One thing to do</div>
                <p style={{ fontSize: 13, color: 'var(--fg-primary)', margin: 0, lineHeight: 1.5 }}>
                  Stack a <em>POV cold open</em> on top of your next <em>gear teardown</em>. Top format hook plus runner-up format · expected lift <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', color: 'var(--tone-success)', fontWeight: 700 }}>+24pp</span>.
                </p>
              </div>
              <button
                onClick={() => ms.pushToast && ms.pushToast('Open project detail · d014')}
                className="hf-btn hf-btn-primary"
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Open d014 · this week's draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// Small directional arrow used by the Formats trends strip and Posting cadence cards.
function TrendArrow({ dir }) {
  const up = dir === 'up';
  const color = up ? 'var(--tone-success)' : 'var(--tone-warning)';
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
      {up
        ? <path d="M3 8 L6 4 L9 8" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M3 4 L6 8 L9 4" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// INSIGHTS · POSTING (when, where, how often)
// ─────────────────────────────────────────────────────────
function HF_InsightsPosting({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('insights', 'Posting');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="insights" subtab="Posting"><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="insights" subtab="Posting"><window.HF_EmptyHero
      eyebrow="Posting · 0 weeks indexed"
      title="No cadence data yet. Coverage builds after the first month."
      caption="Volume, timing, and channel mix arrive once the schedule has run for a while."
      ctaLabel="Open Calendar"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="insights" subtab="Posting"><window.HF_ErrorHero
      title="Couldn't load posting cadence."
      body="The cadence aggregator timed out. Retry, or check the platform connections."
    /></HfShell>;
  }
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = [6, 9, 12, 15, 18, 21];
  // deterministic heatmap data — values picked for editorial story
  const heat = [
    [0.18, 0.34, 0.42, 0.36, 0.55, 0.40], // Mon
    [0.22, 0.41, 0.48, 0.52, 0.95, 0.46], // Tue · 18:00 hot
    [0.25, 0.38, 0.44, 0.42, 0.60, 0.38], // Wed
    [0.28, 0.50, 0.46, 0.44, 0.66, 0.42], // Thu
    [0.24, 0.42, 0.46, 0.48, 0.92, 0.50], // Fri · 18:00 hot
    [0.30, 0.34, 0.38, 0.32, 0.30, 0.28], // Sat · cold
    [0.20, 0.88, 0.42, 0.38, 0.46, 0.36], // Sun · 09:00 hot
  ];
  const cadence = [
    { day: 'Mon', hits: 8,  weeks: 13, sub: 'Quiet day · used for replies' },
    { day: 'Tue', hits: 12, weeks: 13, sub: 'Best discipline · keep it' },
    { day: 'Wed', hits: 7,  weeks: 13, sub: 'Inconsistent' },
    { day: 'Thu', hits: 9,  weeks: 13, sub: 'Solid' },
    { day: 'Fri', hits: 11, weeks: 13, sub: 'Solid · second-best slot' },
    { day: 'Sat', hits: 4,  weeks: 13, sub: 'Trap day · skip or move' },
    { day: 'Sun', hits: 9,  weeks: 13, sub: '09:00 only · misses cost' },
  ];
  const platformBest = [
    { id: 'yt', name: 'YouTube',   slot: 'Tue 18:00 IST', lift: '1.8x', sub: 'Long-form lands here' },
    { id: 'ig', name: 'Instagram', slot: 'Fri 18:00 IST', lift: '1.6x', sub: 'Reels + carousels both' },
    { id: 'tt', name: 'TikTok',    slot: 'Sun 09:00 IST', lift: '1.5x', sub: 'Shifted from Sat morning' },
  ];
  // 24-hour grid · 7 days × 24 hours · synthesized from the 6-hour heat array
  // (interpolation around the known peaks · deterministic values)
  const heat24 = days.map((_, di) => {
    const base = heat[di];
    const out = [];
    // baseline floor + perturbation per hour
    for (let h = 0; h < 24; h += 1) {
      // pick the closest known anchor (6,9,12,15,18,21)
      const anchors = [{ h: 6, v: base[0] }, { h: 9, v: base[1] }, { h: 12, v: base[2] }, { h: 15, v: base[3] }, { h: 18, v: base[4] }, { h: 21, v: base[5] }];
      let nearest = anchors[0]; let best = 99;
      for (const a of anchors) { const d = Math.abs(a.h - h); if (d < best) { best = d; nearest = a; } }
      // deep night (0–5h) is cold
      const nightMul = (h < 5 || h > 22) ? 0.18 : 1;
      const v = nearest.v * nightMul * (1 - Math.min(best, 4) * 0.05);
      out.push(Math.max(0.04, Math.min(0.98, v)));
    }
    return out;
  });
  // Channel cadence cards · IG / YT / TT — avg/wk + last gap + recommended cadence
  const channelCadence = [
    { id: 'ig', name: 'Instagram', avg: 4.2, target: 4, lastGap: '2 days', sub: 'Healthy rhythm · stay on it', tone: 'success', recommend: 'Hold 4/wk · add a Sunday Reel' },
    { id: 'yt', name: 'YouTube',   avg: 1.1, target: 2, lastGap: '11 days', sub: 'Below target · long-form gap', tone: 'warning', recommend: 'Lift to 2/wk · ship the queued teardown' },
    { id: 'tt', name: 'TikTok',    avg: 2.6, target: 3, lastGap: '4 days', sub: 'Close to target · skipped Sat', tone: 'info',    recommend: 'Move Sat slot to Sun 09:00' },
  ];
  // Coverage-gap callouts — top 3 gaps in the schedule
  const gaps = [
    { slot: 'Sat 09:00 IST', channel: 'TikTok',   reason: 'Empty for 6 of last 8 weeks', cost: '-1.5x lift forfeited',   fixCta: 'Fill this slot · Sat 09:00' },
    { slot: 'Tue 18:00 IST', channel: 'YouTube',  reason: 'Missed once in 13 weeks',     cost: '380 net new subs · 2wk', fixCta: 'Lock Tuesday · YT' },
    { slot: 'Sun 09:00 IST', channel: 'Instagram', reason: 'No Reel in 4 of 6 Sundays',   cost: 'Carousel reach drag',     fixCta: 'Slot a Reel · Sun 09:00' },
  ];
  // 12-week cadence trend — posts per week, deterministic
  const cadence12wk = [3.3, 3.0, 3.4, 2.8, 3.6, 3.1, 2.9, 3.2, 3.5, 3.0, 3.1, 3.4];

  return (
    <HfShell workspace="insights" subtab="Posting" subtabRight={<>
      <span className="hf-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>last 90d</span>
      <FreshnessPill at="14m ago" state="fresh" />
    </>}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-base)' }}>
        {/* Editorial header */}
        <div style={{ padding: '20px 28px 16px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span className="hf-byline" style={{ fontSize: 10 }}>Insights · posting · last 90 days</span>
            <span className="hf-byline" style={{ fontSize: 10 }}>143 posts · 78 publish slots · IST</span>
          </div>
          <h1 className="hf-headline" style={{ fontSize: 30, margin: 0, marginBottom: 4 }}>
            <span style={{ color: 'var(--accent-primary)' }}>Tuesday 6PM</span> is your best slot. <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'italic', fontWeight: 400 }}>Saturday morning is the trap.</span>
          </h1>
          <p className="hf-deck" style={{ fontSize: 14, margin: 0, maxWidth: 920 }}>
            Three windows hold +50%+ over your channel mean: Tuesday and Friday at 18:00, Sunday at 09:00. Discipline on Tuesday is your best growth lever — every miss costs roughly <span className="hf-num" style={{ color: 'var(--tone-warning)', fontWeight: 600 }}>380 net new subs</span> over two weeks.
          </p>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '14px 0', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          <MetricCell label="Posts per week" value="3.1" deltaSub="target 3.0" accent />
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Tuesday discipline" value="92%" deltaSub="12 of 13 weeks" /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Sunday discipline" value="69%" deltaSub="9 of 13 · misses cost" /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Best window lift" value="1.8x" deltaSub="Tue 18:00 IST" /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Saturday drag" value="-32%" deltaSub="vs channel mean" /></div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', gap: 1, background: 'var(--border-subtle)', overflow: 'hidden', minHeight: 0 }}>

          {/* LEFT — heatmap + cadence-by-day */}
          <div style={{ background: 'var(--bg-base)', padding: '20px 24px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SectionHead
              kicker="when retention beats your mean"
              title="Posting × performance heatmap"
              italic
              right={<div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)' }}>
                <span>cool</span>
                <span style={{ display: 'inline-flex', height: 6, width: 80, background: 'linear-gradient(to right, var(--surface-2), var(--accent-primary))', borderRadius: 1 }} />
                <span>hot</span>
              </div>}
            />

            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(6, 1fr)', gap: 4, marginBottom: 4 }}>
                <span />
                {hours.map(h => (
                  <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', textAlign: 'center', letterSpacing: '0.06em' }}>{h}:00</span>
                ))}
              </div>
              {days.map((d, di) => (
                <div key={d} style={{ display: 'grid', gridTemplateColumns: '52px repeat(6, 1fr)', gap: 4, marginTop: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-secondary)', alignSelf: 'center', letterSpacing: '0.04em' }}>{d}</span>
                  {hours.map((hr, hi) => {
                    const v = heat[di][hi];
                    return (
                      <div key={hi} style={{
                        height: 40, borderRadius: 3,
                        background: `color-mix(in oklab, var(--accent-primary) ${(v * 100).toFixed(0)}%, var(--surface-2))`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                        color: v > 0.6 ? 'var(--fg-on-accent)' : 'var(--fg-tertiary)',
                      }}>{v > 0.85 ? `${(v * 1.8).toFixed(1)}x` : ''}</div>
                    );
                  })}
                </div>
              ))}
              <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', marginTop: 10, fontStyle: 'italic' }}>
                Brighter cells outperform your channel mean by 1.5x+. Numbers shown when lift exceeds 1.5x.
              </div>
            </div>

            <SectionHead kicker="discipline by day · last 13 weeks" title="Where the misses are" italic />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr 60px', gap: 12, padding: '8px 16px', fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>day</span>
                <span style={{ textAlign: 'right' }}>hits</span>
                <span>note</span>
                <span style={{ textAlign: 'right' }}>rate</span>
              </div>
              {cadence.map((c, i) => {
                const rate = c.hits / c.weeks;
                return (
                  <div
                    key={c.day}
                    onClick={() => ms.setActiveSurface && ms.setActiveSurface('calendar', null)}
                    style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr 60px', gap: 12, padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', fontSize: 12.5, alignItems: 'center', cursor: 'pointer', transition: 'transform 120ms ease' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--fg-primary)' }}>{c.day}</span>
                    <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', color: 'var(--fg-secondary)' }}>{c.hits} / {c.weeks}</span>
                    <span style={{ fontStyle: 'italic', color: 'var(--fg-secondary)', fontSize: 12 }}>{c.sub}</span>
                    <span className="hf-num" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: rate >= 0.8 ? 'var(--tone-success)' : rate >= 0.6 ? 'var(--fg-secondary)' : 'var(--tone-warning)', fontWeight: 700 }}>
                      {(rate * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hour-of-day heatmap · 7 days × 24 hours (full schedule view) */}
            <SectionHead
              kicker="full schedule · 24-hour view"
              title="Best post slots by hour"
              italic
            />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(24, 1fr)', gap: 2, marginBottom: 4 }}>
                <span />
                {Array.from({ length: 24 }, (_, h) => (
                  <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--fg-tertiary)', textAlign: 'center', letterSpacing: '0.02em' }}>{h % 3 === 0 ? h : ''}</span>
                ))}
              </div>
              {days.map((d, di) => (
                <div key={d} style={{ display: 'grid', gridTemplateColumns: '40px repeat(24, 1fr)', gap: 2, marginTop: 2 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)', alignSelf: 'center', letterSpacing: '0.04em', fontWeight: 600 }}>{d}</span>
                  {heat24[di].map((v, hi) => (
                    <div
                      key={hi}
                      onClick={() => ms.pushToast && ms.pushToast('Inspect slot · ' + d + ' ' + hi.toString().padStart(2, '0') + ':00')}
                      title={d + ' ' + hi.toString().padStart(2, '0') + ':00 · lift ' + (v * 1.8).toFixed(1) + 'x'}
                      style={{
                        height: 14, borderRadius: 2, cursor: 'pointer',
                        background: `color-mix(in oklab, var(--accent-primary) ${(v * 100).toFixed(0)}%, var(--surface-2))`,
                        transition: 'transform 120ms ease',
                      }} />
                  ))}
                </div>
              ))}
              <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', marginTop: 8, fontStyle: 'italic' }}>
                Hover any cell for the exact lift. Each row sums to a day · brighter cells beat your channel mean.
              </div>
            </div>

            {/* Weekly cadence trend sparkline · 12 weeks */}
            <SectionHead
              kicker="weekly cadence · last 12 weeks"
              title="The shipping rhythm"
              italic
              right={<span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)' }}>target 3.0/wk</span>}
            />
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 14px' }}>
              <CadenceSpark12 values={cadence12wk} target={3.0} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)' }}>
                <span>w-12</span>
                <span style={{ flex: 1 }} />
                <span>this week · <span className="hf-num" style={{ color: 'var(--tone-success)', fontWeight: 700 }}>3.4</span> · <span style={{ fontStyle: 'italic' }}>over target</span></span>
              </div>
            </div>
          </div>

          {/* RIGHT — miss cost + best by platform + CTA */}
          <div style={{ background: 'var(--surface-1)', padding: '20px 18px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div>
              <SectionHead kicker="what missed slots cost" title="The Tuesday tax" italic rule={false} />
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--fg-primary)', lineHeight: 1.55, fontStyle: 'italic', margin: '4px 0 12px' }}>
                Two-week subscriber growth lag · roughly <span className="hf-num" style={{ fontStyle: 'normal', color: 'var(--tone-warning)', fontWeight: 600 }}>380 net new subs</span> displaced per Tuesday miss.
              </p>
              <div style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', fontSize: 11.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                Methodology cross-referenced from <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>Studies · Tuesday miss cost</span>.
              </div>
            </div>

            <div>
              <SectionHead kicker="cadence by channel · 90d avg" title="Channel rhythm" italic rule={false} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {channelCadence.map((c) => {
                  const ratio = c.avg / c.target;
                  const tone = c.tone === 'success' ? 'var(--tone-success)' : c.tone === 'warning' ? 'var(--tone-warning)' : 'var(--tone-info)';
                  return (
                    <div
                      key={c.id}
                      onClick={() => ms.pushToast && ms.pushToast('Open cadence · ' + c.name)}
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ChannelGlyph id={c.id} size={16} />
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{c.name}</span>
                        <span style={{ flex: 1 }} />
                        <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: tone }}>{c.avg.toFixed(1)}<span style={{ fontWeight: 400, color: 'var(--fg-tertiary)', fontSize: 10 }}> / wk</span></span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-base)', borderRadius: 1, position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, width: `${Math.min(ratio, 1.2) * 100}%`, background: tone, opacity: 0.7, borderRadius: 1 }} />
                        <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${(c.target / 5) * 100}%`, width: 1, background: 'var(--fg-tertiary)' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        <span className="hf-byline" style={{ fontSize: 9 }}>last gap</span>
                        <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-secondary)', fontWeight: 600 }}>{c.lastGap}</span>
                        <span style={{ flex: 1 }} />
                        <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>{c.sub}</span>
                      </div>
                      <div style={{ fontSize: 11, color: tone, fontStyle: 'italic', lineHeight: 1.4, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>{c.recommend}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionHead kicker="coverage gaps · top 3" title="Slots you're leaving on the table" italic rule={false} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {gaps.map((g, i) => (
                  <div
                    key={i}
                    onClick={() => ms.setActiveSurface && ms.setActiveSurface('calendar', null)}
                    style={{ background: 'var(--tone-warning-bg)', border: '1px solid color-mix(in srgb, var(--tone-warning) 18%, transparent)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '0.04em' }}>{g.slot}</span>
                      <span className="hf-byline" style={{ fontSize: 9, color: 'var(--tone-warning)' }}>· {g.channel}</span>
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--fg-secondary)', lineHeight: 1.45 }}>{g.reason}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px solid color-mix(in srgb, var(--tone-warning) 12%, transparent)' }}>
                      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--tone-warning)', fontWeight: 600 }}>{g.cost}</span>
                      <span style={{ flex: 1 }} />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); ms.pushToast && ms.pushToast(g.fixCta); }}
                        style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, color: 'var(--tone-warning)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{g.fixCta} →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHead kicker="best slot by platform" title="Where each channel lands" italic rule={false} />
              {platformBest.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => ms.pushToast && ms.pushToast('Filter library by channel · ' + p.name)}
                  style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'transform 120ms ease' }}>
                  <ChannelGlyph id={p.id} size={20} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)', marginTop: 2, letterSpacing: '0.04em' }}>{p.slot}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontStyle: 'italic', marginTop: 3 }}>{p.sub}</div>
                  </div>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--accent-primary)' }}>{p.lift}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <div className="hf-byline" style={{ fontSize: 9.5, marginBottom: 6 }}>One thing to do</div>
              <div style={{ fontSize: 13, color: 'var(--fg-primary)', marginBottom: 10, lineHeight: 1.5 }}>
                Lock Tuesday 18:00 IST as a non-negotiable. Move TikTok publish from Sat 09:00 to Sun 09:00 — <span className="hf-num" style={{ color: 'var(--tone-success)', fontWeight: 600 }}>+1.5x</span> retention swing.
              </div>
              <button
                onClick={() => ms.setActiveSurface && ms.setActiveSurface('calendar', null)}
                className="hf-btn hf-btn-primary"
                style={{ width: '100%', cursor: 'pointer' }}>Open calendar · lock Tue 18:00</button>
            </div>

          </div>
        </div>
      </div>
    </HfShell>
  );
}

// 12-week cadence sparkline used by Posting · trend section.
// Shows posts/wk vs target line, with a soft area fill.
function CadenceSpark12({ values, target }) {
  const w = 720, h = 70, pad = 6;
  const max = Math.max(...values, target) * 1.1;
  const stepX = (w - pad * 2) / (values.length - 1);
  const yOf = v => h - pad - (v / max) * (h - pad * 2);
  const pts = values.map((v, i) => `${(pad + i * stepX).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
  const area = `${pad},${h-pad} ${pts} ${pad + (values.length-1)*stepX},${h-pad}`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: 70, display: 'block' }}>
      {/* target line */}
      <line x1={pad} x2={w-pad} y1={yOf(target)} y2={yOf(target)} stroke="var(--fg-tertiary)" strokeWidth="0.75" strokeDasharray="3,3" />
      <text x={w-pad-2} y={yOf(target)-3} fontSize="9" textAnchor="end" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">target {target.toFixed(1)}</text>
      {/* area + line */}
      <polygon points={area} fill="var(--accent-primary)" opacity="0.08" />
      <polyline points={pts} fill="none" stroke="var(--accent-primary)" strokeWidth="1.6" />
      {/* dots — colored by whether they hit target */}
      {values.map((v, i) => (
        <circle key={i} cx={pad + i * stepX} cy={yOf(v)} r="2" fill={v >= target ? 'var(--accent-primary)' : 'var(--tone-warning)'} />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// STUDIO · WORKSPACE — the free-form project gallery
// (replaces the old stage-pipeline kanban; status is a tag,
// not a column you have to pass through)
// ─────────────────────────────────────────────────────────

// Status palette — a tag, not a stage. Order does not imply progression.
const STUDIO_STATUS = {
  drafting:  { label: 'Drafting',   bg: 'var(--surface-2)',       fg: 'var(--fg-secondary)',        bd: 'var(--border-default)' },
  outlining: { label: 'Outlining',  bg: 'var(--tone-info-bg)',    fg: 'var(--tone-info)',           bd: 'transparent' },
  rewrite:   { label: 'Rewriting',  bg: 'var(--accent-soft)',     fg: 'var(--accent-primary-press)', bd: 'transparent' },
  scratch:   { label: 'Scratch',    bg: 'transparent',            fg: 'var(--fg-tertiary)',         bd: 'var(--border-subtle)' },
  scheduled: { label: 'Scheduled',  bg: 'var(--tone-success-bg)', fg: 'var(--tone-success)',        bd: 'transparent' },
  shipped:   { label: 'Shipped',    bg: 'transparent',            fg: 'var(--fg-tertiary)',         bd: 'var(--border-subtle)' },
};
const STUDIO_PILLAR_COLOR = { safety: 'var(--accent-primary)', gear: 'var(--tone-info)', story: 'var(--tone-success)', reply: 'var(--tone-warning)' };

// Shape glyph next to each title — signals what KIND of doc this is.
// Free-form: a project can be a doc, just hooks, just notes, a carousel plan, or scratch.
function StudioShapeGlyph({ shape }) {
  const stroke = 'var(--fg-tertiary)';
  const w = 12;
  if (shape === 'doc') return <svg width={w} height={w} viewBox="0 0 12 12" fill="none"><rect x="2.5" y="1.5" width="7" height="9" stroke={stroke} strokeWidth="1"/><line x1="4" y1="4.5" x2="8" y2="4.5" stroke={stroke} strokeWidth="0.8"/><line x1="4" y1="6.5" x2="8" y2="6.5" stroke={stroke} strokeWidth="0.8"/><line x1="4" y1="8.5" x2="7" y2="8.5" stroke={stroke} strokeWidth="0.8"/></svg>;
  if (shape === 'notes') return <svg width={w} height={w} viewBox="0 0 12 12" fill="none"><line x1="2" y1="3" x2="10" y2="3" stroke={stroke} strokeWidth="1"/><line x1="2" y1="6" x2="9" y2="6" stroke={stroke} strokeWidth="1"/><line x1="2" y1="9" x2="7" y2="9" stroke={stroke} strokeWidth="1"/></svg>;
  if (shape === 'hooks') return <svg width={w} height={w} viewBox="0 0 12 12" fill="none"><path d="M3 3 Q4 6 3 9 M5 3 Q6 6 5 9" stroke={stroke} strokeWidth="1.1" fill="none" strokeLinecap="round"/></svg>;
  if (shape === 'carousel') return <svg width={w} height={w} viewBox="0 0 12 12" fill="none"><rect x="1" y="3" width="3" height="6" stroke={stroke} strokeWidth="0.8"/><rect x="4.5" y="3" width="3" height="6" stroke={stroke} strokeWidth="0.8"/><rect x="8" y="3" width="3" height="6" stroke={stroke} strokeWidth="0.8"/></svg>;
  if (shape === 'shotlist') return <svg width={w} height={w} viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2.5" width="3" height="2" stroke={stroke} strokeWidth="0.8"/><rect x="6" y="2.5" width="4.5" height="2" stroke={stroke} strokeWidth="0.8"/><rect x="1.5" y="6" width="3" height="2" stroke={stroke} strokeWidth="0.8"/><rect x="6" y="6" width="4.5" height="2" stroke={stroke} strokeWidth="0.8"/></svg>;
  return <svg width={w} height={w} viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="3" stroke={stroke} strokeWidth="0.8"/></svg>;
}

function StudioStatusPill({ status, urgent }) {
  const s = STUDIO_STATUS[status] || STUDIO_STATUS.drafting;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px',
      background: urgent ? 'var(--tone-warning-bg)' : s.bg,
      color: urgent ? 'var(--tone-warning)' : s.fg,
      border: `1px solid ${urgent ? 'transparent' : s.bd}`,
      borderRadius: 999,
      fontFamily: M.mono, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: urgent ? 'var(--tone-warning)' : s.fg }} />
      {urgent ? 'Overdue' : s.label}
    </span>
  );
}

// Hero card — pinned/today projects. Bigger, more agent context.
function StudioHeroCard({ p, onActivate }) {
  const tint = STUDIO_PILLAR_COLOR[p.pillar];
  return (
    <article
      onClick={onActivate}
      style={{
      padding: '18px 20px 16px',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderTop: `2px solid ${p.urgent ? 'var(--tone-warning)' : tint}`,
      borderRadius: 'var(--radius-md)',
      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200,
      cursor: 'pointer',
      boxShadow: '0 1px 0 rgba(26,24,21,0.02)',
    }}>
      {/* Top: id + status pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MM s={10} c="var(--fg-tertiary)" st={{ fontWeight: 600 }}>{p.id}</MM>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: tint }} />
        <MM s={9.5} c="var(--fg-tertiary)" st={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{p.pillar}</MM>
        <span style={{ flex: 1 }} />
        <StudioStatusPill status={p.status} urgent={p.urgent} />
      </div>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ paddingTop: 5 }}><StudioShapeGlyph shape={p.shape} /></span>
        <span style={{
          fontFamily: M.serif, fontStyle: 'italic', fontSize: 22, fontWeight: 500,
          color: 'var(--fg-primary)', lineHeight: 1.2, letterSpacing: '-0.01em', flex: 1,
        }}>{p.title}</span>
      </div>

      {/* Agent activity hint — Coopr presence as a cardinal feature, not a chrome flourish */}
      {p.agentNote && (
        <div style={{
          padding: '8px 10px',
          background: 'var(--accent-soft)',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="var(--accent-primary)" /></svg>
          <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--accent-primary-press)', lineHeight: 1.3, flex: 1 }}>{p.agentNote}</span>
        </div>
      )}

      {/* Footer: meta + "open" affordance */}
      <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <MM s={10} c="var(--fg-tertiary)">{p.words} words</MM>
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <MM s={10} c="var(--fg-tertiary)">{p.updated} ago</MM>
        {p.due && p.due !== '—' && (<>
          <span style={{ color: 'var(--border-default)' }}>·</span>
          <MM s={10} c={p.urgent ? 'var(--tone-warning)' : 'var(--fg-tertiary)'} st={{ fontWeight: p.urgent ? 700 : 400 }}>due {p.due}</MM>
        </>)}
        <span style={{ flex: 1 }} />
        <MM s={10} c="var(--accent-primary)" st={{ fontWeight: 700, letterSpacing: '0.06em' }}>OPEN →</MM>
      </div>
    </article>
  );
}

// Compact card — recent / all-projects grid.
function StudioCompactCard({ p, onActivate }) {
  const tint = STUDIO_PILLAR_COLOR[p.pillar];
  return (
    <article
      onClick={onActivate}
      style={{
      padding: '13px 14px 12px',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      display: 'flex', flexDirection: 'column', gap: 8,
      cursor: 'pointer', minHeight: 130,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <MM s={9.5} c="var(--fg-tertiary)" st={{ fontWeight: 600 }}>{p.id}</MM>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: tint }} />
        <span style={{ flex: 1 }} />
        <StudioStatusPill status={p.status} urgent={p.urgent} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1 }}>
        <span style={{ paddingTop: 3 }}><StudioShapeGlyph shape={p.shape} /></span>
        <span style={{
          fontFamily: M.serif, fontStyle: 'italic', fontSize: 15, fontWeight: 500,
          color: 'var(--fg-primary)', lineHeight: 1.3, letterSpacing: '-0.005em',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{p.title}</span>
      </div>
      <div style={{ paddingTop: 6, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <MM s={9.5} c="var(--fg-tertiary)">{p.words}w · {p.updated}</MM>
        <span style={{ flex: 1 }} />
        {p.due && p.due !== '—' && (
          <MM s={9.5} c={p.urgent ? 'var(--tone-warning)' : 'var(--fg-tertiary)'} st={{ fontWeight: p.urgent ? 700 : 400 }}>{p.due}</MM>
        )}
      </div>
    </article>
  );
}

function HF_StudioWorkspace({ state = 'happy' }) {
  // R10 · state variants — read tweaks override, fall back to prop.
  const ovr = window.useSurfaceState && window.useSurfaceState('studio', 'Workspace');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  // E2 · click coverage. Hooks must run before every early return; we read
  // the master-state context once and fall back to a no-op if the surface
  // is rendered outside the provider (e.g. in the layout-view artboard
  // index, where the toast layer would have nothing to dock to anyway).
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  if (s === 'loading') {
    return <HfShell workspace="studio" subtab="Workspace"><window.HF_SkeletonHero shape="card-row" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="studio" subtab="Workspace"><window.HF_EmptyHero
      eyebrow="Studio · 0 projects"
      title="Nothing in flight. Start a doc, a hook list, or a clip lab."
      caption="Every project lives here · pinned, recent, archived. No stages, no templates."
      ctaLabel="New project"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="studio" subtab="Workspace"><window.HF_ErrorHero
      title="Couldn't load the workspace."
      body="The project index didn't respond in time. Retry, or refresh the session."
    /></HfShell>;
  }
  // Free-form gallery. Each row is a project; status is a tag, not a stage.
  // pinned + recent + all are sections of attention, not a workflow.
  const projects = [
    // Pinned (4) — what you actively touched today.
    { id: 'd012', title: 'Fiji wreck series · ep. 1 hook',     pillar: 'story',  status: 'drafting',  channel: 'yt', words: 1412, updated: '12m', due: 'Apr 25', shape: 'hooks',    pinned: true, agentNote: 'Coopr drafted 3 hook variants — 2 picked, 1 cut' },
    { id: 'd011', title: 'Replacement opener for 0041',         pillar: 'safety', status: 'rewrite',   channel: 'yt', words: 612,  updated: '38m', due: 'today',  shape: 'doc',      pinned: true, urgent: true, agentNote: 'Diagnosis: silent cut at 3:14 → fix is one line' },
    { id: 'd010', title: 'Three-frame carousel from 0042',      pillar: 'story',  status: 'drafting',  channel: 'ig', words: 188,  updated: '1h',  due: 'Apr 24', shape: 'carousel', pinned: true, agentNote: 'Source · 0042 · ready for caption pass' },
    { id: 'd015', title: 'Pre-dive checklist · long version',   pillar: 'safety', status: 'rewrite',   channel: 'yt', words: 1840, updated: '3h',  due: 'Apr 26', shape: 'doc',      pinned: true, agentNote: 'Coopr flagged 4 redundant lines · easy 30s trim' },
    // Active (10).
    { id: 'd009', title: 'Reply ideas for @marina.k',           pillar: 'reply',  status: 'drafting',  channel: 'ig', words: 340,  updated: '2h',  due: 'Apr 26', shape: 'doc' },
    { id: 'd013', title: 'La Jolla scout · loose notes',        pillar: 'story',  status: 'scratch',   channel: '—',  words: 290,  updated: '4h',  due: '—',      shape: 'notes' },
    { id: 'd008', title: 'Reg-first-stage gear teardown 2',     pillar: 'gear',   status: 'outlining', channel: 'yt', words: 820,  updated: '4h',  due: 'May 1',  shape: 'doc' },
    { id: 'd007', title: 'Komodo cold-open · alt cut',          pillar: 'story',  status: 'outlining', channel: 'yt', words: 410,  updated: '1d',  due: 'May 8',  shape: 'doc' },
    { id: '0046', title: 'Three things I check (short)',        pillar: 'safety', status: 'scheduled', channel: 'ig', words: 940,  updated: '1d',  due: 'Apr 25', shape: 'shotlist' },
    { id: 'd014', title: 'Cold-open recut · trim 8s of room',   pillar: 'story',  status: 'rewrite',   channel: 'tt', words: 220,  updated: '5h',  due: 'Apr 27', shape: 'doc' },
    { id: 'd016', title: 'Buoyancy drill · 30s social cut',     pillar: 'safety', status: 'drafting',  channel: 'tt', words: 92,   updated: '5h',  due: 'Apr 27', shape: 'shotlist' },
    { id: 'd018', title: 'Newsletter · Truk Lagoon recap',      pillar: 'story',  status: 'drafting',  channel: 'th', words: 1110, updated: '7h',  due: 'Apr 26', shape: 'doc' },
    { id: 'd019', title: 'Reply · doubles vs sidemount',        pillar: 'reply',  status: 'drafting',  channel: 'yt', words: 410,  updated: '8h',  due: 'Apr 27', shape: 'hooks' },
    { id: 'd003', title: 'Carousel · 5 instructor mistakes',    pillar: 'safety', status: 'scratch',   channel: 'ig', words: 280,  updated: '2d',  due: '—',      shape: 'hooks' },
    { id: 'd006', title: 'Q&A · doubles vs sidemount',          pillar: 'reply',  status: 'scratch',   channel: 'yt', words: 60,   updated: '4d',  due: '—',      shape: 'notes' },
    { id: 'd005', title: 'Why I retired my old BCD',            pillar: 'gear',   status: 'scratch',   channel: 'yt', words: 120,  updated: '1w',  due: '—',      shape: 'notes' },
  ];

  const pinned = projects.filter(p => p.pinned);
  // "Active" = top 8 non-pinned by recency. Pillar columns reuse projects across pinned/non-pinned.
  const recent = projects.filter(p => !p.pinned).slice(0, 8);
  const byPillar = {
    safety: projects.filter(p => p.pillar === 'safety').slice(0, 3),
    gear:   projects.filter(p => p.pillar === 'gear').slice(0, 3),
    story:  projects.filter(p => p.pillar === 'story').slice(0, 3),
    reply:  projects.filter(p => p.pillar === 'reply').slice(0, 3),
  };
  // Last 6 shipped — horizontal ledger of recently-closed projects with outcome notes.
  const shipped = [
    { id: '0048', title: 'Carousel · cave-line drills',           ch: 'ig', shippedOn: 'Apr 24', metric: '12.4k saves', note: 'Save:view 9.6%' },
    { id: '0046', title: 'Three things I check (short)',          ch: 'ig', shippedOn: 'Apr 21', metric: '38k views',   note: 'Pinned by 6 instructors' },
    { id: '0044', title: 'Buoyancy drill · 30s',                  ch: 'tt', shippedOn: 'Apr 19', metric: '142k views',  note: 'Top 1% of pillar' },
    { id: '0042', title: 'Truk Lagoon · why this wreck matters',  ch: 'yt', shippedOn: 'Apr 16', metric: '21k views',   note: 'Avg watch 7m12s' },
    { id: '0041', title: '12-min primer on safety stops',         ch: 'yt', shippedOn: 'Apr 13', metric: '14k views',   note: 'Cited by Diver Mag' },
    { id: '0040', title: 'Pre-dive · the short version',          ch: 'ig', shippedOn: 'Apr 11', metric: '8.1k saves',  note: 'Save:view 8.2%' },
  ];
  const PILLAR_TONES = {
    safety: { fg: 'var(--accent-primary-press)', soft: 'var(--accent-soft)',     label: 'Safety' },
    gear:   { fg: 'var(--tone-info)',            soft: 'var(--tone-info-bg)',    label: 'Gear' },
    story:  { fg: 'var(--tone-success)',         soft: 'var(--tone-success-bg)', label: 'Story' },
    reply:  { fg: 'var(--tone-warning)',         soft: 'var(--tone-warning-bg)', label: 'Reply' },
  };

  // Doc shapes that show up under the "+ New" hero — none of them are templates that
  // force a structure; they're just empty starting points.
  const newShapes = [
    { id: 'doc',      label: 'Blank doc',    sub: 'Start with nothing' },
    { id: 'hooks',    label: 'Hook list',    sub: 'Just openers' },
    { id: 'notes',    label: 'Loose notes',  sub: 'Trip / scratch / scout' },
    { id: 'shotlist', label: 'Shot list',    sub: 'Numbered shots, unscripted' },
    { id: 'fromPost', label: 'From a post',  sub: 'Branch off an existing post' },
  ];

  return (
    <HfShell workspace="studio" subtab="Workspace" subtabRight={
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="hf-tag" style={{ fontFamily: M.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>{projects.length} projects · 1 overdue</span>
        <FreshnessPill at="just now" state="fresh" />
      </div>
    }>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

        {/* Editorial header band */}
        <div style={{ padding: '22px 32px 18px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="hf-byline" style={{ fontSize: 10 }}>Studio · Workspace · Wed Apr 24</span>
            <span className="hf-byline" style={{ fontSize: 10 }}>Last opened 12m ago · Coopr is here</span>
          </div>
          <h1 className="hf-headline" style={{ fontSize: 30, margin: 0, marginBottom: 4 }}>
            What you're <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontWeight: 500 }}>working on.</span>
          </h1>
          <p className="hf-deck" style={{ fontSize: 14, margin: 0, maxWidth: 920 }}>
            Every project is a free-form doc. No fixed pipeline — start with a single hook, a trip's loose notes, a shot list, or a full script. Coopr edits in the doc, not around it.
          </p>
        </div>

        {/* Hero action bar — "+ New doc" is the cardinal action */}
        <div style={{ padding: '18px 32px 14px', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => masterCtx && masterCtx.pushModal ? masterCtx.pushModal('ModalNewProject') : pushToast('New doc')}
              className="hf-btn hf-btn-primary"
              style={{ height: 40, fontSize: 13, padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: M.mono, fontSize: 16, fontWeight: 700 }}>+</span>
              New project
            </button>
            <span style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
            {newShapes.map(sh => (
              <span
                key={sh.id}
                onClick={() => pushToast('New ' + sh.label.toLowerCase())}
                style={{
                  display: 'inline-flex', flexDirection: 'column', gap: 1,
                  padding: '6px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: 'var(--bg-base)',
                }}>
                <span style={{ fontFamily: M.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{sh.label}</span>
                <MM s={9.5} c="var(--fg-tertiary)">{sh.sub}</MM>
              </span>
            ))}
            <span style={{ flex: 1 }} />
            <MM s={10.5} c="var(--fg-tertiary)" st={{ fontStyle: 'italic', fontFamily: M.serif, textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>
              or paste anything · drag in a clip · @-mention a post
            </MM>
          </div>

          {/* Filter / group-by row */}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <ML s={9}>filter</ML>
            {[
              ['All', true],
              ['Drafting', false],
              ['Outlining', false],
              ['Scheduled', false],
              ['Scratch', false],
            ].map(([t, sel]) => (
              <span key={t} style={{
                padding: '4px 12px', borderRadius: 999,
                background: sel ? 'var(--fg-primary)' : 'transparent',
                color: sel ? 'var(--surface-1)' : 'var(--fg-secondary)',
                border: sel ? 'none' : '1px solid var(--border-default)',
                fontFamily: M.sans, fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
              }}>{t}</span>
            ))}
            <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
            <ML s={9}>group by</ML>
            {['Last touched', 'Pillar', 'Channel', 'Due', 'Status'].map((t, i) => (
              <span key={t} style={{
                padding: '4px 12px', borderRadius: 999,
                background: i === 0 ? 'var(--accent-soft)' : 'transparent',
                color: i === 0 ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                border: i === 0 ? '1px solid transparent' : '1px solid var(--border-subtle)',
                fontFamily: M.sans, fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
              }}>{t}</span>
            ))}
            <span style={{ flex: 1 }} />
            <MM s={10}>view · gallery · list · board</MM>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '24px 32px 36px', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Pinned · today — 4-up hero row */}
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span className="hf-byline" style={{ fontSize: 10 }}>PINNED · TODAY · {pinned.length} PROJECTS</span>
                <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>
                  In the rotation
                </span>
              </div>
              <MM s={10}>last touched within the hour</MM>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {pinned.map(p => <StudioHeroCard key={p.id} p={p} onActivate={() => pushToast('Open project detail · ' + p.id)} />)}
            </div>
          </section>

          {/* Recent · 7 days · 8 active medium cards */}
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span className="hf-byline" style={{ fontSize: 10 }}>RECENT · 7 DAYS · {recent.length} PROJECTS</span>
                <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>
                  Whatever you've touched
                </span>
              </div>
              <MM s={10}>grouped by · last touched</MM>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {recent.map(p => <StudioCompactCard key={p.id} p={p} onActivate={() => pushToast('Open project detail · ' + p.id)} />)}
            </div>
          </section>

          {/* Pillar columns · 4 pillars × 2-3 projects each */}
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span className="hf-byline" style={{ fontSize: 10 }}>BY PILLAR · 4 LANES</span>
                <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>
                  How the docs split across the things you make
                </span>
              </div>
              <MM s={10}>tap a pillar to filter the workspace</MM>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {['safety', 'gear', 'story', 'reply'].map(pillar => {
                const tone = PILLAR_TONES[pillar];
                const items = byPillar[pillar];
                return (
                  <div key={pillar} style={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderTop: '3px solid ' + tone.fg,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 12px 14px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                    minHeight: 220,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone.fg }} />
                        <span style={{ fontFamily: M.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{tone.label}</span>
                      </span>
                      <MM s={9.5} c={tone.fg} st={{ fontWeight: 700 }}>{items.length}</MM>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                      {items.map(p => (
                        <div
                          key={p.id}
                          onClick={() => pushToast('Open project detail · ' + p.id)}
                          style={{
                            padding: '8px 10px',
                            background: 'var(--bg-base)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 6,
                            cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', gap: 4,
                          }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <MM s={9.5} c="var(--fg-tertiary)" st={{ fontWeight: 600 }}>{p.id}</MM>
                            <span style={{ flex: 1 }} />
                            <MM s={9.5} c={p.urgent ? 'var(--tone-warning)' : 'var(--fg-tertiary)'} st={{ fontWeight: p.urgent ? 700 : 400 }}>
                              {p.due === '—' ? p.updated : p.due}
                            </MM>
                          </div>
                          <span style={{
                            fontFamily: M.serif, fontStyle: 'italic', fontSize: 13.5,
                            color: 'var(--fg-primary)', lineHeight: 1.3, letterSpacing: '-0.005em',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>{p.title}</span>
                        </div>
                      ))}
                    </div>
                    <span
                      onClick={() => pushToast('Filter Workspace by ' + tone.label)}
                      style={{
                        marginTop: 'auto', paddingTop: 8,
                        borderTop: '1px solid var(--border-subtle)',
                        fontFamily: M.mono, fontSize: 9.5, fontWeight: 600,
                        color: tone.fg, letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}>VIEW ALL · {tone.label.toUpperCase()} →</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recently shipped · horizontal ledger of last 6 closed projects */}
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span className="hf-byline" style={{ fontSize: 10 }}>RECENTLY SHIPPED · LAST 6</span>
                <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>
                  What closed in the last two weeks
                </span>
              </div>
              <MM s={10}>tap to open the catalog row</MM>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
              gap: 10,
            }}>
              {shipped.map(s => (
                <div
                  key={s.id}
                  onClick={() => pushToast('Open library detail · ' + s.id)}
                  style={{
                    padding: '12px 12px 14px',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    minHeight: 130,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <MM s={9.5} c="var(--fg-tertiary)" st={{ fontWeight: 600 }}>{s.id}</MM>
                    <span style={{ flex: 1 }} />
                    <MM s={9} c="var(--fg-tertiary)">{s.shippedOn}</MM>
                  </div>
                  <span style={{
                    fontFamily: M.serif, fontStyle: 'italic', fontSize: 13.5, fontWeight: 500,
                    color: 'var(--fg-primary)', lineHeight: 1.3, letterSpacing: '-0.005em', flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{s.title}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="hf-num" style={{ fontFamily: M.sans, fontSize: 13, fontWeight: 700, color: 'var(--fg-primary)' }}>{s.metric}</span>
                    <MM s={9.5} c="var(--accent-primary-press)">{s.note}</MM>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Empty-state hint + + New project CTA — flexible-shape closer */}
          <section style={{ padding: '20px 24px', borderTop: '6px double var(--fg-primary)', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 28, alignItems: 'center' }}>
            <div>
              <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>WHAT A "PROJECT" CAN BE</div>
              <div style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 18, color: 'var(--fg-primary)', lineHeight: 1.45, letterSpacing: '-0.005em' }}>
                A single hook. A loose shot list from a scout. Three reply variants. A 12-minute YouTube primer with a script and a checklist. An empty doc you'll fill in tomorrow. The shape adapts to whatever you put in it — Coopr will not force it to become anything else.
              </div>
            </div>
            <button
              onClick={() => masterCtx && masterCtx.pushModal ? masterCtx.pushModal('ModalNewProject') : pushToast('New project')}
              className="hf-btn hf-btn-primary"
              style={{ width: '100%', height: 44, fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontFamily: M.mono, fontSize: 16, fontWeight: 700 }}>+</span>
              New project
            </button>
          </section>

        </div>

      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// STUDIO · SHIPPED  (closed projects, what was learned)
// ─────────────────────────────────────────────────────────
function HF_StudioShipped({ state = 'happy' }) {
  // D3 · reframed as SHIP LOG. Each row is a publish receipt — when it
  // went out, where it landed, and what happened to it. The point is to
  // answer "what shipped, what worked, what can I repeat" — not just to
  // archive things.
  const ovr = window.useSurfaceState && window.useSurfaceState('studio', 'Shipped');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  const masterCtx = window.useMasterState && window.useMasterState();
  const setActiveSurface = masterCtx ? masterCtx.setActiveSurface : (() => {});
  const setDetail = masterCtx ? masterCtx.setDetail : (() => {});
  const pushToast = (masterCtx && masterCtx.pushToast) ? masterCtx.pushToast : (() => {});
  // B3 · sort popover state preserved.
  const [sortOpen, setSortOpen] = React.useState(false);
  const [sortPos, setSortPos] = React.useState({ x: 0, y: 0 });
  const [activeSort, setActiveSort] = React.useState('date-desc');
  const [activeFilter, setActiveFilter] = React.useState('All');
  function openSortAt(e) {
    const btn = e.currentTarget.getBoundingClientRect();
    const wrap = e.currentTarget.parentElement.getBoundingClientRect();
    setSortPos({ x: btn.right - wrap.left - 220, y: btn.bottom - wrap.top + 6 });
    setSortOpen(true);
  }
  const sortOptions = [
    { id: 'date-desc',  label: 'Date · newest first' },
    { id: 'date-asc',   label: 'Date · oldest first' },
    { id: 'lift-desc',  label: 'Lift · best first' },
    { id: 'views-desc', label: 'Views · most watched' },
    { id: 'pillar',     label: 'Pillar · alphabetical' },
  ];
  if (s === 'loading') {
    return <HfShell workspace="studio" subtab="Shipped"><window.HF_SkeletonHero shape="grid" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="studio" subtab="Shipped"><window.HF_EmptyHero
      eyebrow="Ship log · 0 entries"
      title="Nothing has shipped yet. The log writes itself as you publish."
      caption="Each publish becomes a receipt — where it landed, what it did, what to repeat next."
      ctaLabel="Open Studio"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="studio" subtab="Shipped"><window.HF_ErrorHero
      title="Couldn't load the ship log."
      body="The log timed out. Retry, or refresh the session."
    /></HfShell>;
  }
  // Pillar dot color (used in row + win cards).
  const pillarColor = { safety: 'var(--accent-primary)', gear: 'var(--tone-info)', story: 'var(--tone-success)', reply: 'var(--tone-warning)' };
  const platTone = { YT: '#cc3a2c', IG: '#a45ea4', TT: '#1c1c1c' };
  // Ship log · 14 rows. Each row is one publish event: date, post, platform,
  // outcome metrics, status. Status drives the right-rail tone.
  const ships = [
    { d: 'Apr 24', tm: '6:30p', id: '0048', plat: 'YT', t: 'Cold-water gear list, 2026 edition', pillar: 'gear',   views: '74k',  saves: '1.8k', lift: '+12%', status: 'Live' },
    { d: 'Apr 23', tm: '8:00p', id: '0047', plat: 'IG', t: 'Why I stopped doing safety stops the way you were taught', pillar: 'safety', views: '162k', saves: '3.4k', lift: '+28%', status: 'Pinned' },
    { d: 'Apr 22', tm: '6:30p', id: '0046', plat: 'YT', t: 'Three things I check before every wreck dive', pillar: 'safety', views: '142k', saves: '2.1k', lift: '+18%', status: 'Live' },
    { d: 'Apr 21', tm: '7:15p', id: '0045', plat: 'IG', t: 'Why I trust my SPG over my dive computer', pillar: 'gear',   views: '88k',  saves: '0.9k', lift: '+04%', status: 'Live' },
    { d: 'Apr 19', tm: '6:00p', id: '0044', plat: 'YT', t: 'Truk Lagoon · Fujikawa Maru in eight breaths', pillar: 'story',  views: '312k', saves: '6.2k', lift: '+22%', status: 'Pinned' },
    { d: 'Apr 17', tm: '5:45p', id: '0043', plat: 'TT', t: 'Buddy check, but make it actually useful', pillar: 'safety', views: '62k',  saves: '0.4k', lift: '-08%', status: 'Live' },
    { d: 'Apr 14', tm: '6:30p', id: '0042', plat: 'YT', t: 'My first wreck — and what I got wrong', pillar: 'story',  views: '421k', saves: '8.4k', lift: '+34%', status: 'Pinned' },
    { d: 'Apr 11', tm: '8:15p', id: '0041', plat: 'IG', t: 'Reading a current you can\'t see', pillar: 'safety', views: '54k',  saves: '0.7k', lift: '+11%', status: 'Live' },
    { d: 'Apr 09', tm: '5:30p', id: '0040', plat: 'TT', t: 'The mask trick I do every dive', pillar: 'gear',   views: '36k',  saves: '0.3k', lift: '+02%', status: 'Live' },
    { d: 'Apr 06', tm: '6:00p', id: '0039', plat: 'YT', t: 'Eight minutes on a wreck I had to abort', pillar: 'story',  views: '98k',  saves: '1.1k', lift: '+09%', status: 'Live' },
    { d: 'Apr 03', tm: '7:00p', id: '0038', plat: 'IG', t: 'Equalising on the way down · short form', pillar: 'gear',   views: '42k',  saves: '0.4k', lift: '+05%', status: 'Live' },
    { d: 'Apr 01', tm: '6:30p', id: '0037', plat: 'YT', t: 'A reply I owed the channel for two months', pillar: 'reply',  views: '28k',  saves: '0.2k', lift: '-14%', status: 'Pulled' },
    { d: 'Mar 30', tm: '8:00p', id: '0036', plat: 'IG', t: 'Three lessons from a 40-meter wall', pillar: 'story',  views: '74k',  saves: '0.9k', lift: '+07%', status: 'Live' },
    { d: 'Mar 28', tm: '6:00p', id: '0035', plat: 'YT', t: 'Why my regulator failed at 22m', pillar: 'safety', views: '184k', saves: '2.6k', lift: '+19%', status: 'Live' },
  ];
  const filteredShips = activeFilter === 'All' ? ships
    : activeFilter === 'YouTube' ? ships.filter(r => r.plat === 'YT')
    : activeFilter === 'Instagram' ? ships.filter(r => r.plat === 'IG')
    : activeFilter === 'TikTok' ? ships.filter(r => r.plat === 'TT')
    : ships;
  // Cross-platform spread · per-platform stats with mini sparklines.
  const spread = [
    { plat: 'YT', label: 'YouTube',   ships: 6, views: '1.23M', avg: '+19%', spark: [12, 18, 14, 24, 19, 28] },
    { plat: 'IG', label: 'Instagram', ships: 5, views: '432k',  avg: '+11%', spark: [8, 12, 10, 16, 13, 18] },
    { plat: 'TT', label: 'TikTok',    ships: 3, views: '124k',  avg: '-02%', spark: [6, 8, 7, 9, 6, 8] },
  ];
  // Wins · 3 posts that beat the channel's top quartile (81% completion line).
  const wins = [
    { id: '0042', t: 'My first wreck — and what I got wrong', plat: 'YT', metric: '421k views · 71% completion', why: 'Mistake-first opener at 0:00 — the channel signature.' },
    { id: '0044', t: 'Truk Lagoon · Fujikawa Maru', plat: 'YT', metric: '312k views · 6.2k saves',           why: 'Named-episode formula — viewers asked for ep. 2 in comments.' },
    { id: '0047', t: 'Why I stopped doing safety stops…', plat: 'IG', metric: '162k views · 3.4k saves',     why: 'Counter-intuitive headline + named technique in caption.' },
  ];
  const filters = ['All', 'YouTube', 'Instagram', 'TikTok'];
  // Status pill tone map.
  const statusTone = {
    Live:   { fg: 'var(--fg-secondary)', bg: 'transparent',         border: 'var(--border-default)' },
    Pinned: { fg: 'var(--accent-primary-press)', bg: 'var(--accent-soft)', border: 'var(--accent-primary)' },
    Pulled: { fg: 'var(--tone-warning)', bg: 'transparent',         border: 'var(--tone-warning)' },
  };
  return (
    <HfShell workspace="studio" subtab="Shipped">
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '28px 36px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* ── Hero verdict band ─────────────────────────────────── */}
          <div style={{ marginBottom: 4 }}><ML>Shipped · last 30 days</ML></div>
          <h1 style={{ margin: '0 0 10px', fontFamily: M.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 38, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1 }}>
            14 ships, <span className="hf-num" style={{ fontFamily: M.mono, fontStyle: 'normal', fontWeight: 600, fontSize: 34 }}>2.1M</span> views, three above your top quartile.
          </h1>
          <div style={{ marginBottom: 22, fontFamily: M.sans, fontSize: 13.5, color: 'var(--fg-secondary)', maxWidth: 720, lineHeight: 1.6 }}>
            Each row is a publish receipt — where it landed, what it did, and what to repeat. The wins below the log are posts that cleared your channel's 81% completion line.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 26, padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            {[
              { k: 'This month',       v: '14',     sub: '4 in last 7 days' },
              { k: 'Lifetime',         v: '404',    sub: 'across 3 channels' },
              { k: 'Top performer',    v: '0042',   sub: '421k · 71% completion' },
              { k: 'Avg time to ship', v: '4.2 d',  sub: '-0.8d vs Q1' },
            ].map((cell, i) => (
              <div key={cell.k} style={{ borderLeft: i === 0 ? 'none' : '1px solid var(--border-subtle)', padding: '0 18px' }}>
                <ML s={9.5}>{cell.k}</ML>
                <div className="hf-num" style={{ fontFamily: M.mono, fontSize: 22, fontWeight: 600, color: 'var(--fg-primary)', marginTop: 4, letterSpacing: '-0.005em' }}>{cell.v}</div>
                <MM s={10} c="var(--fg-tertiary)" st={{ marginTop: 4, display: 'block' }}>{cell.sub}</MM>
              </div>
            ))}
          </div>

          {/* ── Filter row · channel pills + sort popover ────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
            {filters.map((f) => (
              <span
                key={f}
                onClick={() => { setActiveFilter(f); pushToast('Filter · ' + f); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: '1px solid ' + (activeFilter === f ? 'var(--accent-primary)' : 'var(--border-default)'),
                  background: activeFilter === f ? 'var(--accent-soft)' : 'transparent',
                  color: activeFilter === f ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                  fontFamily: M.mono, fontSize: 10.5, letterSpacing: '0.06em', fontWeight: activeFilter === f ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}>{f}</span>
            ))}
            <span style={{ flex: 1 }} />
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <button
                type="button"
                onClick={openSortAt}
                style={{
                  all: 'unset',
                  padding: '6px 14px',
                  border: '1px solid ' + (sortOpen ? 'var(--accent-primary)' : 'var(--border-default)'),
                  background: sortOpen ? 'var(--accent-soft)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: M.mono, fontSize: 10.5,
                  color: sortOpen ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                <span>SORT · {(sortOptions.find(o => o.id === activeSort) || sortOptions[0]).label.split(' · ')[0].toUpperCase()} ↓</span>
              </button>
              {sortOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                  <window.HF_SortPopover
                    x={sortPos.x}
                    y={sortPos.y}
                    options={sortOptions}
                    activeId={activeSort}
                    onSelect={(opt) => {
                      setActiveSort(opt.id);
                      pushToast('Sort by · ' + opt.label);
                    }}
                    onClose={() => setSortOpen(false)}
                  />
                </div>
              )}
            </span>
          </div>

          {/* ── Ship log · vertical timeline of publish receipts ──── */}
          <ML>The log · publish receipts</ML>
          <div style={{ marginTop: 12, marginBottom: 32 }}>
            {filteredShips.map((row, i) => (
              <div
                key={row.id}
                onClick={() => { setActiveSurface('library', 'Catalog'); setDetail('post', row.id); }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr 240px',
                  gap: 18,
                  padding: '16px 4px',
                  alignItems: 'center',
                  borderTop: i === 0 ? '1px solid var(--border-subtle)' : 'none',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}>
                {/* Left · timestamp */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{row.d}</span>
                  <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{row.tm}</span>
                </div>
                {/* Mid · post mini-card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: M.mono, fontSize: 9.5, fontWeight: 700, color: 'var(--fg-tertiary)', letterSpacing: '0.08em' }}>{row.id}</span>
                  </div>
                  <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: pillarColor[row.pillar] }} />
                      <MM s={9.5} c="var(--fg-tertiary)" st={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{row.pillar}</MM>
                      <span style={{ padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: platTone[row.plat], color: '#ffffff', fontFamily: M.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em' }}>{row.plat}</span>
                    </div>
                    <div style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-primary)', lineHeight: 1.3, letterSpacing: '-0.005em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.t}
                    </div>
                  </div>
                </div>
                {/* Right · outcome stats */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 13, fontWeight: 700, color: 'var(--fg-primary)' }}>{row.views}</span>
                    <MM s={9.5} c="var(--fg-tertiary)" st={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>views · {row.saves} saves</MM>
                  </div>
                  <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 12, fontWeight: 700, color: row.lift.startsWith('-') ? 'var(--tone-warning)' : 'var(--tone-success)', minWidth: 48, textAlign: 'right' }}>
                    {row.lift}
                  </span>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid ' + statusTone[row.status].border,
                    background: statusTone[row.status].bg,
                    color: statusTone[row.status].fg,
                    fontFamily: M.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
                  }}>{row.status.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Cross-platform spread · 3-up cards ─────────────────── */}
          <ML>Where the month landed</ML>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 12, marginBottom: 32 }}>
            {spread.map((p) => {
              const max = Math.max.apply(null, p.spark);
              return (
                <div key={p.plat} style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ padding: '2px 7px', borderRadius: 'var(--radius-sm)', background: platTone[p.plat], color: '#ffffff', fontFamily: M.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em' }}>{p.plat}</span>
                    <MM s={10} c="var(--fg-secondary)" st={{ letterSpacing: '0.04em', fontWeight: 600 }}>{p.label}</MM>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                    <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 22, fontWeight: 600, color: 'var(--fg-primary)' }}>{p.ships}</span>
                    <MM s={10} c="var(--fg-tertiary)" st={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>ships · {p.views} views</MM>
                  </div>
                  {/* Mini sparkline · inline SVG, no external libs */}
                  <svg width="100%" height="36" viewBox={'0 0 ' + (p.spark.length * 14) + ' 36'} preserveAspectRatio="none" style={{ display: 'block', marginTop: 8 }}>
                    <polyline
                      fill="none"
                      stroke="var(--accent-primary)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={p.spark.map((v, idx) => (idx * 14 + 7) + ',' + (32 - (v / max) * 26)).join(' ')}
                    />
                    {p.spark.map((v, idx) => (
                      <circle key={idx} cx={idx * 14 + 7} cy={32 - (v / max) * 26} r="1.6" fill="var(--accent-primary)" />
                    ))}
                  </svg>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
                    <MM s={9.5} c="var(--fg-tertiary)" st={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>avg lift vs you</MM>
                    <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 12, fontWeight: 700, color: p.avg.startsWith('-') ? 'var(--tone-warning)' : 'var(--tone-success)' }}>{p.avg}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Wins above your line · 3 highlight cards ──────────── */}
          <ML>Wins above your line</ML>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 12, marginBottom: 32 }}>
            {wins.map((w) => (
              <div
                key={w.id}
                onClick={() => { setActiveSurface('library', 'Catalog'); setDetail('post', w.id); }}
                style={{
                  background: 'var(--surface-1)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-md)',
                  padding: '16px 18px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ padding: '2px 7px', borderRadius: 'var(--radius-sm)', background: platTone[w.plat], color: '#ffffff', fontFamily: M.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em' }}>{w.plat}</span>
                  <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 10, fontWeight: 700, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>{w.id}</span>
                  <span style={{ flex: 1 }} />
                  <MM s={9.5} c="var(--accent-primary-press)" st={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>top quartile</MM>
                </div>
                <div style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 17, fontWeight: 500, color: 'var(--fg-primary)', lineHeight: 1.3, letterSpacing: '-0.008em' }}>
                  {w.t}
                </div>
                <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 11, fontWeight: 600, color: 'var(--fg-secondary)', letterSpacing: '0.04em' }}>{w.metric}</span>
                <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <ML s={9}>What worked</ML>
                  <span style={{ display: 'block', marginTop: 4, fontFamily: M.serif, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{w.why}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Schedule next ship CTA ────────────────────────────── */}
          <div
            onClick={() => { setActiveSurface('calendar', 'Week'); pushToast('Open Calendar · Week'); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18,
              padding: '20px 22px', marginBottom: 8,
              background: 'var(--surface-1)',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <ML s={9.5}>Next move</ML>
              <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.012em' }}>Schedule the next ship.</span>
              <MM s={11} c="var(--fg-secondary)">Open windows this week · Tue 6:30p, Thu 8:00p, Sat 10:00a.</MM>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-primary)', color: '#ffffff', fontFamily: M.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Open calendar
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

        </div>
      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// CALENDAR · Event card with hover-driven drag handle (B1 affordance)
// ─────────────────────────────────────────────────────────
function HF_CalendarEventCard({ e, isLifted, platColors, statusBadge, onClick }) {
  const [hover, setHover] = React.useState(false);
  const showHandle = (hover || isLifted) && e.status !== 'open';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: 8,
        paddingLeft: showHandle ? 22 : 8,
        background: e.status === 'open' ? 'var(--surface-2)' : 'var(--surface-1)',
        border: e.status === 'open' ? '1px dashed var(--border-default)' : '1px solid var(--border-subtle)',
        borderLeft: e.status !== 'open' ? `3px solid ${platColors[e.plat] || 'var(--fg-tertiary)'}` : '1px dashed var(--border-default)',
        borderRadius: 6,
        display: 'flex', flexDirection: 'column', gap: 3,
        cursor: 'pointer', userSelect: 'none',
        transform: isLifted ? 'translate(2px, -2px) rotate(-1.4deg)' : 'translate(0, 0)',
        boxShadow: isLifted
          ? '0 14px 28px rgba(15,14,12,0.22), 0 4px 8px rgba(15,14,12,0.14)'
          : 'none',
        zIndex: isLifted ? 5 : 'auto',
        transition: isLifted
          ? 'none'
          : 'padding-left 160ms ease-out, transform 160ms ease-out',
      }}>
      {showHandle && (
        <div style={{
          position: 'absolute',
          left: 5, top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'grab',
          color: 'var(--fg-tertiary)',
          padding: 1,
        }}>
          <window.DragHandle size={12} color="var(--fg-tertiary)" shadow="" />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <MM s={9.5} c="var(--fg-secondary)" st={{ fontWeight: 600 }}>{e.time}</MM>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: statusBadge[e.status] }} />
      </div>
      <span style={{ fontFamily: M.sans, fontSize: 11.5, color: 'var(--fg-primary)', fontWeight: 500, lineHeight: 1.3 }}>{e.t}</span>
      <MM s={9} c="var(--fg-tertiary)">{e.plat} · {e.status}</MM>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CALENDAR (top-level) — drag-from-Library → schedule
// ─────────────────────────────────────────────────────────
function HF_Calendar({ state = 'happy', detail = null }) {
  // R10 · state variants — read tweaks override, fall back to prop.
  // Calendar workspace has no subtabs in the shell; registry uses 'Week' as id.
  const ovr = window.useSurfaceState && window.useSurfaceState('calendar', 'Week');
  // D5 · master-state pull for the slot-edit modal. Hook is called at the
  // top so the rules-of-hooks contract holds; the surface still mounts in
  // standalone preview contexts (try/catch matches hifi-cliplab pattern).
  let ms = null;
  try { ms = window.useMasterState && window.useMasterState(); } catch (_e) { ms = null; }
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="calendar"><window.HF_SkeletonHero shape="calendar-week" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="calendar"><window.HF_EmptyHero
      eyebrow="Calendar · 0 scheduled"
      title="The week is wide open. Drop a draft on a day to schedule it."
      caption="Drag from Library, or open a slot to compose in place."
      ctaLabel="Schedule a post"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="calendar"><window.HF_ErrorHero
      title="Couldn't load the schedule."
      body="The calendar feed timed out. Retry, or check the platform connections."
    /></HfShell>;
  }
  const days = ['Mon · 22', 'Tue · 23', 'Wed · 24', 'Thu · 25', 'Fri · 26', 'Sat · 27', 'Sun · 28'];
  const lib = [
    { id: 'L1', t: '0046 · pre-dive checklist',    ratio: '9:16', plat: 'IG Reel',  status: 'edited' },
    { id: 'L2', t: 'Fujikawa teaser · 0:08',        ratio: '9:16', plat: 'TikTok',   status: 'draft' },
    { id: 'L3', t: 'SPG vs computer carousel',      ratio: '1:1',  plat: 'IG carousel', status: 'edited' },
    { id: 'L4', t: 'La Jolla scout · still',        ratio: '9:16', plat: 'IG Story', status: 'raw' },
    { id: 'L5', t: '8-second rule (alt cut)',       ratio: '9:16', plat: 'TikTok',   status: 'edited' },
    { id: 'L6', t: 'Truk · ep. 2 hook',             ratio: '16:9', plat: 'YouTube',  status: 'draft' },
  ];
  const events = {
    'Mon · 22': [
      { id: 'mon-1200-yt',  time: '12:00 PM', t: 'Truk recap · long cut',  plat: 'YT', status: 'live' },
      { id: 'mon-1830-ig',  time: '6:30 PM',  t: 'SPG carousel',           plat: 'IG', status: 'live' },
    ],
    'Tue · 23': [
      { id: 'tue-0730-yt',  time: '7:30 AM',  t: 'Fujikawa primer',        plat: 'YT', status: 'queued' },
      { id: 'tue-1830-ig',  time: '6:30 PM',  t: 'Truk teaser',            plat: 'IG', status: 'live' },
      { id: 'tue-2100-tt',  time: '9:00 PM',  t: '8-second rule',          plat: 'TT', status: 'live' },
    ],
    'Wed · 24': [
      { id: 'wed-0700-yt',  time: '7:00 AM',  t: 'Fujikawa primer',        plat: 'YT', status: 'queued' },
      { id: 'wed-1800-ig',  time: '6:00 PM',  t: 'La Jolla scout',         plat: 'IG Story', status: 'queued' },
    ],
    'Thu · 25': [
      { id: 'thu-1830-ig',  time: '6:30 PM',  t: 'Pre-dive checklist',     plat: 'IG', status: 'queued' },
      { id: 'thu-2030-tt',  time: '8:30 PM',  t: 'Reef pointer · alt',     plat: 'TT', status: 'queued' },
    ],
    'Fri · 26': [
      { id: 'fri-1200-yt',  time: '12:00 PM', t: 'Friday cut · short',     plat: 'YT', status: 'queued' },
      { id: 'fri-1830-open', time: '6:30 PM', t: '— empty slot',           plat: '—',  status: 'open' },
    ],
    'Sat · 27': [
      { id: 'sat-1000-ig',  time: '10:00 AM', t: 'Saturday b-roll teaser', plat: 'IG Story', status: 'queued' },
    ],
    'Sun · 28': [
      { id: 'sun-0900-open', time: '9:00 AM', t: '— empty slot',           plat: '—',  status: 'open' },
      { id: 'sun-1900-ig',  time: '7:00 PM',  t: 'Week recap carousel',    plat: 'IG', status: 'queued' },
    ],
  };
  const platColors = { IG: 'var(--accent-primary)', YT: 'var(--tone-warning)', TT: 'var(--tone-info)', 'IG Story': 'var(--accent-primary)' };
  const statusBadge = { live: 'var(--tone-success)', queued: 'var(--accent-primary)', open: 'var(--fg-tertiary)' };

  // B1 · drag affordance demo · the visually-mid-drag event. The canonical
  // Week route stays calm; the demo is explicit via
  // #interactive/calendar/week/demo/rescheduling.
  const showRescheduleDemo = detail && detail.kind === 'demo' && detail.id === 'rescheduling';
  // Thu's 6:30 PM IG event is being rescheduled to Thu's open 2:00 PM slot.
  // In demo mode we render the source as lifted and inject a drop-target
  // outlined placeholder above it at the new time.
  const liftedEventId = 'thu-1830-ig';
  const dropTargetDay = 'Thu · 25';
  const dropTargetTime = '2:00 PM';

  return (
    <HfShell workspace="calendar">
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Library drawer · drag source */}
        <aside style={{ width: 260, borderRight: '1px solid var(--border-subtle)', background: 'var(--surface-1)', flexShrink: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
            <ML>Library · drag to schedule</ML>
            <MM s={10} st={{ display: 'block', marginTop: 4 }}>6 ready · 14 drafts · all platforms</MM>
          </div>
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lib.map(l => (
              <div key={l.id} style={{ display: 'flex', gap: 10, padding: 8, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, cursor: 'grab' }}>
                <div style={{
                  width: l.ratio === '9:16' ? 32 : l.ratio === '1:1' ? 44 : 56,
                  height: 44,
                  background: 'repeating-linear-gradient(45deg, var(--surface-2) 0 6px, var(--surface-3) 6px 12px)',
                  borderRadius: 4, flexShrink: 0,
                }} />
                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: M.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.t}</span>
                  <MM s={9.5}>{l.ratio} · {l.plat}</MM>
                  <MM s={9} c={l.status === 'edited' ? 'var(--tone-success)' : l.status === 'draft' ? 'var(--accent-primary)' : 'var(--fg-tertiary)'}>{l.status}</MM>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Calendar grid */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 24px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontFamily: M.serif, fontSize: 26, fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--fg-primary)' }}>April · week of 22</span>
            <MM>‹ prev · this week · next ›</MM>
            <span style={{ flex: 1 }} />
            <MM s={10.5}>3 platforms · drag to slot · option-drag to copy</MM>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--border-subtle)' }}>
            {days.map((d, di) => (
              <div key={d} style={{ position: 'relative', background: di === 2 ? 'var(--accent-soft)' : 'var(--surface-1)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <MM s={10} c={di === 2 ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'} st={{ fontWeight: 600 }}>{d.split(' · ')[0]}</MM>
                  <span style={{ fontFamily: M.serif, fontSize: 18, color: 'var(--fg-primary)', fontWeight: 500 }}>{d.split(' · ')[1]}</span>
                  {di === 2 && <span style={{ marginLeft: 'auto', fontFamily: M.mono, fontSize: 9, color: 'var(--accent-primary-press)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>today</span>}
                </div>
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 320, position: 'relative' }}>
                  {/* B1 · injected drop-target placeholder for the rescheduling demo */}
                  {showRescheduleDemo && d === dropTargetDay && (
                    <div style={{
                      padding: 8,
                      background: 'rgba(154, 56, 56, 0.06)',
                      border: '1.5px dashed var(--accent-primary)',
                      borderRadius: 6,
                      display: 'flex', flexDirection: 'column', gap: 3,
                      position: 'relative',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MM s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 700 }}>{dropTargetTime}</MM>
                        <span style={{
                          fontFamily: M.mono, fontSize: 8.5, fontWeight: 700,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: 'var(--accent-primary-press)',
                          marginLeft: 'auto',
                        }}>drop here</span>
                      </div>
                      <span style={{ fontFamily: M.sans, fontSize: 11.5, color: 'var(--accent-primary-press)', fontWeight: 500, lineHeight: 1.3, fontStyle: 'italic' }}>
                        Pre-dive checklist
                      </span>
                      <MM s={9} c="var(--accent-primary-press)">IG · would land here</MM>
                    </div>
                  )}
                  {(events[d] || []).map((e) => {
                    const isLifted = showRescheduleDemo && e.id === liftedEventId;
                    return (
                      <HF_CalendarEventCard
                        key={e.id}
                        e={e}
                        isLifted={isLifted}
                        platColors={platColors}
                        statusBadge={statusBadge}
                        onClick={() => { if (ms && ms.pushModal) ms.pushModal('ModalSlotEdit', { slotId: e.id }); }}
                      />
                    );
                  })}
                </div>
                {/* B1 · status caption — only on the day where the rescheduling is happening */}
                {showRescheduleDemo && d === dropTargetDay && (
                  <div style={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 7,
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      padding: '5px 10px',
                      borderRadius: 999,
                      background: 'var(--fg-primary)',
                      color: 'var(--fg-on-ink)',
                      fontFamily: M.mono,
                      fontSize: 9.5,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 12px rgba(15,14,12,0.22), 0 1px 2px rgba(15,14,12,0.16)',
                      whiteSpace: 'nowrap',
                    }}>
                      Rescheduling · 18:30 → 14:00
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// SETTINGS · multi-section
// ─────────────────────────────────────────────────────────
function HF_Settings() {
  const sections = [
    { id: 'account',     label: 'Account' },
    { id: 'connections', label: 'Connections' },
    { id: 'voice',       label: 'Brand voice' },
    { id: 'notifs',      label: 'Notifications' },
    { id: 'plan',        label: 'Plan & billing' },
  ];
  const conns = [
    { plat: 'YouTube',     handle: '@henrymwangi',   foll: '287.4k', status: 'connected', last: '2m ago', primary: true },
    { plat: 'YouTube',     handle: '@henrymwangi.tutorials', foll: '12.1k', status: 'connected', last: '4h ago', primary: false, note: 'secondary channel' },
    { plat: 'Instagram',   handle: '@henry.dives',    foll: '98.3k',  status: 'connected', last: '12m ago', primary: true },
    { plat: 'TikTok',      handle: '@henrymwangi',    foll: '24.8k',  status: 'connected', last: '1h ago', primary: false },
    { plat: 'Threads',     handle: '@henry.dives',    foll: '12.4k',  status: 'connected', last: '1d ago', primary: false },
    { plat: 'YouTube',     handle: '— add second channel', foll: '—', status: 'add', last: '', primary: false },
  ];
  return (
    <HfShell workspace="home" topbarRight={<>
      <span style={{ fontFamily: M.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>← back to Home</span>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: M.sans, fontSize: 11, fontWeight: 700 }}>H</span>
    </>}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Section nav */}
        <aside style={{ width: 220, padding: '24px 14px', borderRight: '1px solid var(--border-subtle)', background: 'var(--surface-1)', flexShrink: 0 }}>
          <div style={{ padding: '0 10px 12px' }}>
            <span style={{ fontFamily: M.serif, fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>Settings</span>
          </div>
          {sections.map((s, i) => (
            <div key={s.id} style={{
              padding: '8px 12px',
              borderRadius: 6,
              fontFamily: M.sans, fontSize: 13,
              fontWeight: i === 1 ? 600 : 500,
              color: i === 1 ? 'var(--fg-primary)' : 'var(--fg-secondary)',
              background: i === 1 ? 'var(--surface-2)' : 'transparent',
              cursor: 'default',
            }}>{s.label}</div>
          ))}
        </aside>

        {/* Body — Connections section open */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: '32px 40px 60px' }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 4 }}><ML>Connections</ML></div>
            <h1 style={{ margin: '0 0 8px', fontFamily: M.serif, fontWeight: 500, fontSize: 30, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>
              Your linked accounts
            </h1>
            <p style={{ margin: '0 0 24px', fontFamily: M.sans, fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.6, maxWidth: 600 }}>
              COOPR pulls your library, insights, and inbox from these. Mark one per platform as primary — that's the account that shows up in the topbar switcher by default.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {conns.map((c, i) => (
                <div key={i} style={{ padding: '16px 0', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '40px 1fr 110px 90px 80px', gap: 14, alignItems: 'center' }}>
                  <span style={{ width: 32, height: 32, borderRadius: 6, background: c.status === 'add' ? 'var(--surface-2)' : 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: M.mono, fontSize: 11, fontWeight: 700 }}>
                    {c.plat.slice(0, 2)}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: M.sans, fontSize: 13.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{c.plat}</span>
                      <span style={{ fontFamily: M.mono, fontSize: 11.5, color: 'var(--fg-secondary)' }}>{c.handle}</span>
                      {c.primary && <span style={{ fontFamily: M.mono, fontSize: 9, color: 'var(--accent-primary-press)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>primary</span>}
                      {c.note && <span style={{ fontFamily: M.sans, fontSize: 11, color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>· {c.note}</span>}
                    </div>
                    {c.last && <MM s={10} st={{ marginTop: 2, display: 'block' }}>last sync · {c.last}</MM>}
                  </div>
                  <MM s={11.5} c="var(--fg-primary)" st={{ fontWeight: 600 }}>{c.foll}</MM>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 999,
                    background: c.status === 'connected' ? 'var(--tone-success-bg)' : 'var(--surface-2)',
                    color: c.status === 'connected' ? 'var(--tone-success)' : 'var(--fg-tertiary)',
                    fontFamily: M.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                    width: 'fit-content',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.status === 'connected' ? 'var(--tone-success)' : 'var(--fg-tertiary)' }} />
                    {c.status}
                  </span>
                  <MM s={11} c="var(--accent-primary)" st={{ textAlign: 'right', fontWeight: 600 }}>
                    {c.status === 'add' ? 'Add ↗' : 'Manage ↗'}
                  </MM>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: 16, background: 'var(--surface-2)', borderRadius: 8 }}>
              <ML s={9}>Why connect more than one</ML>
              <p style={{ marginTop: 6, fontFamily: M.sans, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                If you run more than one account on a platform — a tutorials channel, a behind-the-scenes account — connect each. The topbar lets you switch which one is in focus, and Insights, Library and Inbox follow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// LINKED-ACCOUNTS SWITCHER — three placement options
// ─────────────────────────────────────────────────────────
function SwitcherFrame({ label, sub, children, height = 580 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <ML>{label}</ML>
        <div style={{ marginTop: 2, fontFamily: M.serif, fontSize: 16, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.45 }}>{sub}</div>
      </div>
      <div style={{ height, border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function HF_LinkedSwitcher() {
  return (
    <div className="hf" style={{ background: 'var(--bg-base)', padding: 36, width: 1440 }}>
      <div style={{ marginBottom: 24 }}>
        <ML>Linked-accounts switcher · 3 placements</ML>
        <h1 style={{ margin: '6px 0 8px', fontFamily: M.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>
          Three ways the user picks which connected account is in focus.
        </h1>
        <div style={{ fontFamily: M.sans, fontSize: 13.5, color: 'var(--fg-secondary)', maxWidth: 720, lineHeight: 1.6 }}>
          Same user, different connected platform identities — not multi-tenant SaaS. The Library, Insights and Inbox follow whichever account is selected. Each placement has trade-offs noted underneath.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        {/* Option 1 — dedicated topbar chip */}
        <SwitcherFrame label="Option A · dedicated topbar chip" sub="Always visible. Cheap to scan. Strong recommendation.">
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
            {/* Mock topbar */}
            <div style={{ height: 52, padding: '0 22px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: M.serif, fontStyle: 'italic', fontSize: 13 }}>C</span>
                <span style={{ fontFamily: M.sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>COOPR</span>
              </div>
              {/* The chip */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', background: 'var(--surface-2)', borderRadius: 7, border: '1px solid var(--border-subtle)' }}>
                <span style={{ width: 16, height: 16, borderRadius: 3, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', fontFamily: M.mono, fontSize: 8, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Ig</span>
                <span style={{ fontFamily: M.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>@henry.dives</span>
                <MM s={9.5}>▾</MM>
              </span>
              <span style={{ flex: 1 }} />
              <MM s={10.5}>Search · ⌘K</MM>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)' }} />
            </div>
            {/* Open dropdown */}
            <div style={{ padding: '14px 22px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 200, top: 6, width: 320, background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <ML s={9}>Linked accounts · 5</ML>
                </div>
                {[
                  ['Ig', '@henry.dives', '98.3k', true],
                  ['Yt', '@henrymwangi', '287.4k', false],
                  ['Yt', '@henrymwangi.tutorials', '12.1k', false],
                  ['Tt', '@henrymwangi', '24.8k', false],
                  ['Th', '@henry.dives', '12.4k', false],
                ].map(([g, h, n, sel], i) => (
                  <div key={i} style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, background: sel ? 'var(--accent-soft)' : 'var(--surface-1)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 3, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', fontFamily: M.mono, fontSize: 9, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{g}</span>
                    <span style={{ flex: 1, fontFamily: M.sans, fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: sel ? 600 : 500 }}>{h}</span>
                    <MM s={10}>{n}</MM>
                    {sel && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 12, height: 12, color: 'var(--accent-primary)' }} aria-label="Selected">
                        <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M2.5 6.4 L5 9 L9.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
                <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MM s={11} c="var(--accent-primary)" st={{ fontWeight: 600 }}>+ connect another</MM>
                  <span style={{ flex: 1 }} />
                  <MM s={9.5}>⌘ ⇧ A</MM>
                </div>
              </div>
            </div>
          </div>
        </SwitcherFrame>

        {/* Option 2 — avatar dropdown */}
        <SwitcherFrame label="Option B · avatar dropdown" sub="Lower visual weight. Costs one click to discover.">
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
            <div style={{ height: 52, padding: '0 22px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: M.serif, fontStyle: 'italic', fontSize: 13 }}>C</span>
                <span style={{ fontFamily: M.sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>COOPR</span>
              </div>
              <span style={{ flex: 1 }} />
              <MM s={10.5}>Search · ⌘K</MM>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', fontFamily: M.sans, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--fg-primary)' }}>H</span>
            </div>
            <div style={{ padding: 16, position: 'relative' }}>
              <div style={{ position: 'absolute', right: 12, top: 6, width: 280, background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                <div style={{ padding: 14, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #c98b6b, #8c5a3d)' }} />
                  <div>
                    <span style={{ fontFamily: M.sans, fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)' }}>Henry Mwangi</span>
                    <div style={{ fontFamily: M.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>henry@dives.studio</div>
                  </div>
                </div>
                <div style={{ padding: '10px 14px 6px' }}><ML s={9}>Switch to</ML></div>
                {[
                  ['Ig', '@henry.dives · 98.3k', true],
                  ['Yt', '@henrymwangi · 287.4k', false],
                  ['Yt', '@henrymwangi.tutorials · 12.1k', false],
                  ['Tt', '@henrymwangi · 24.8k', false],
                ].map(([g, h, sel], i) => (
                  <div key={i} style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 3, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', fontFamily: M.mono, fontSize: 8, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{g}</span>
                    <span style={{ flex: 1, fontFamily: M.sans, fontSize: 12, color: 'var(--fg-primary)', fontWeight: sel ? 600 : 500 }}>{h}</span>
                    {sel && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 12, height: 12, color: 'var(--accent-primary)' }} aria-label="Selected">
                        <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M2.5 6.4 L5 9 L9.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8 }}>
                  {['Settings', 'Brand voice', 'Plan & billing', 'Sign out'].map((t, i) => (
                    <div key={i} style={{ padding: '8px 14px', fontFamily: M.sans, fontSize: 12, color: 'var(--fg-secondary)' }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SwitcherFrame>

        {/* Option 3 — command palette only */}
        <SwitcherFrame label="Option C · ⌘K palette only" sub="Keyboardists love it. Hidden from new users — too discrete for primary surface.">
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
            <div style={{ height: 52, padding: '0 22px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: M.serif, fontStyle: 'italic', fontSize: 13 }}>C</span>
                <span style={{ fontFamily: M.sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>COOPR</span>
              </div>
              <span style={{ flex: 1 }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', background: 'var(--surface-2)', borderRadius: 7, border: '1px solid var(--border-subtle)' }}>
                <MM s={11} c="var(--fg-secondary)">Search · jump · ask</MM>
                <span style={{ fontFamily: M.mono, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>⌘K</span>
              </span>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)' }} />
            </div>
            {/* Palette open */}
            <div style={{ flex: 1, position: 'relative', background: 'rgba(26, 24, 21, 0.18)' }}>
              <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 420, background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: M.mono, fontSize: 11, color: 'var(--fg-tertiary)' }}>›</span>
                  <span style={{ fontFamily: M.sans, fontSize: 14, color: 'var(--fg-primary)' }}>switch to</span>
                </div>
                <div style={{ padding: '10px 16px 6px' }}><ML s={9}>Switch account</ML></div>
                {[
                  ['Ig', '@henry.dives', 'Instagram · 98.3k', true],
                  ['Yt', '@henrymwangi', 'YouTube · 287.4k', false],
                  ['Yt', '@henrymwangi.tutorials', 'YouTube · 12.1k', false],
                  ['Tt', '@henrymwangi', 'TikTok · 24.8k', false],
                ].map(([g, h, sub, sel], i) => (
                  <div key={i} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10, background: sel ? 'var(--accent-soft)' : 'transparent' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 3, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', fontFamily: M.mono, fontSize: 9, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{g}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: M.sans, fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 500, display: 'block' }}>{h}</span>
                      <MM s={9.5}>{sub}</MM>
                    </div>
                    {sel && <MM s={9} c="var(--accent-primary)" st={{ fontWeight: 600 }}>active</MM>}
                  </div>
                ))}
                <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)' }}>
                  <MM s={10}>↑↓ navigate · ⏎ select · esc to close</MM>
                </div>
              </div>
            </div>
          </div>
        </SwitcherFrame>
      </div>

      {/* Recommendation */}
      <div style={{ marginTop: 24, padding: 18, background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)', borderRadius: 10, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 18 }}>
        <ML c="var(--accent-primary-press)">Our pick</ML>
        <div style={{ fontFamily: M.serif, fontSize: 16, color: 'var(--fg-primary)', lineHeight: 1.55 }}>
          <span style={{ fontWeight: 600 }}>Option A — dedicated chip — plus the ⌘K shortcut.</span> Visible to new users, fast for power users. Avatar stays for account-level settings, not for switching identities.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ONBOARDING — 4 screens
// ─────────────────────────────────────────────────────────
function OnbScreen({ children, label }) {
  return (
    <div className="hf" style={{ width: 1440, height: 900, background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 12, left: 16, fontFamily: M.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        {children}
      </div>
      {/* Top brand only */}
      <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: M.serif, fontStyle: 'italic', fontSize: 16 }}>C</span>
        <span style={{ fontFamily: M.sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em' }}>COOPR</span>
      </div>
    </div>
  );
}

function HF_Onb1Signup() {
  return (
    <OnbScreen label="01 · signup · the full screen">
      <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <ML s={9.5}>Get started · 60 seconds</ML>
          <h1 style={{ margin: '8px 0 6px', fontFamily: M.serif, fontWeight: 500, fontSize: 44, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
            <span style={{ fontStyle: 'italic' }}>One creative engine</span> that already knows your work.
          </h1>
          <p style={{ margin: 0, fontFamily: M.sans, fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            Connect a handle. We'll have something worth looking at in 90 seconds.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {[
            ['Continue with Google', 'gmail · workspace'],
            ['Continue with Apple',  'sign in with Apple'],
            ['Continue with email',  'work address recommended'],
          ].map(([t, sub], i) => (
            <div key={i} style={{ padding: '14px 16px', background: i === 0 ? 'var(--surface-ink)' : 'var(--surface-1)', color: i === 0 ? 'var(--fg-on-ink)' : 'var(--fg-primary)', border: i === 0 ? 'none' : '1px solid var(--border-default)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? 'var(--fg-on-ink)' : 'var(--surface-2)' }} />
              <span style={{ fontFamily: M.sans, fontSize: 14, fontWeight: 600 }}>{t}</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: M.mono, fontSize: 10.5, opacity: 0.7 }}>{sub}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, fontFamily: M.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
          By signing up you agree to our terms and confirm you are the creator behind the handle you'll connect next. We don't post anything without your say-so.
        </div>
      </div>
    </OnbScreen>
  );
}

function HF_Onb2Handle() {
  return (
    <OnbScreen label="02 · paste a handle · or connect">
      <div style={{ width: 580, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <ML s={9.5}>Step 2 of 3 · pick the account that defines you</ML>
          <h1 style={{ margin: '8px 0 6px', fontFamily: M.serif, fontWeight: 500, fontSize: 38, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.08 }}>
            What's the handle you'd point a stranger at?
          </h1>
          <p style={{ margin: 0, fontFamily: M.sans, fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            We'll use this one to bootstrap your library and audience. You can connect more after.
          </p>
        </div>

        {/* Handle input */}
        <div style={{ padding: '6px 8px', background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <select style={{ height: 44, padding: '0 12px', border: 'none', background: 'transparent', fontFamily: M.sans, fontSize: 14, color: 'var(--fg-primary)', fontWeight: 600 }}>
            <option>Instagram</option>
          </select>
          <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)' }} />
          <span style={{ fontFamily: M.mono, fontSize: 14, color: 'var(--fg-tertiary)' }}>@</span>
          <span style={{ flex: 1, fontFamily: M.sans, fontSize: 16, color: 'var(--fg-primary)', fontWeight: 500 }}>henry.dives</span>
          <span style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 8, fontFamily: M.sans, fontSize: 13, fontWeight: 600 }}>Continue →</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <MM s={10.5}>or skip and answer 3 questions instead</MM>
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        {/* Fallback questions preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            ['Niche', 'cooking, comedy, gear, education…'],
            ['Format mix', 'mostly shorts? long-form? carousels?'],
            ['Cadence', 'how often do you post?'],
          ].map(([k, sub], i) => (
            <div key={i} style={{ padding: 12, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
              <ML s={9}>{k}</ML>
              <div style={{ marginTop: 4, fontFamily: M.serif, fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </OnbScreen>
  );
}

function HF_Onb3Loading() {
  return (
    <OnbScreen label="03 · bootstrap · single progress">
      <div style={{ width: 540, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, textAlign: 'center' }}>
        <ML s={9.5}>Setting up · about 90 seconds</ML>
        <h1 style={{ margin: 0, fontFamily: M.serif, fontWeight: 500, fontSize: 40, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.08 }}>
          Reading <span style={{ fontStyle: 'italic' }}>everything you've made</span>.
        </h1>

        {/* Single progress — no 14-step pipeline */}
        <div style={{ width: '100%', height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
          <span style={{ display: 'block', height: '100%', width: '64%', background: 'var(--accent-primary)' }} />
        </div>
        <MM s={11}>64% · still pulling YouTube · 287 of 412 posts · 38s remaining</MM>

        <div style={{ marginTop: 8, fontFamily: M.serif, fontStyle: 'italic', fontSize: 17, color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 460 }}>
          "While we're at it — your last 30 Reels averaged 4.2% engagement, and your dive footage outperforms your lifestyle content by 2.1×. Worth starting with what's working."
        </div>

        <span style={{ fontFamily: M.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          you can close this — we'll email when it's ready
        </span>
      </div>
    </OnbScreen>
  );
}

function HF_Onb4FirstChat() {
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '52px 32px 60px' }}>
        <div style={{ width: 720, display: 'flex', flexDirection: 'column' }}>
          {/* Welcome banner */}
          <div style={{ marginBottom: 32, padding: '14px 18px', background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
            <span style={{ fontFamily: M.sans, fontSize: 12.5, color: 'var(--accent-primary-press)', fontWeight: 600 }}>Setup complete · 412 posts read · 6 series detected · voice profile drafted</span>
            <span style={{ flex: 1 }} />
            <MM s={10} c="var(--accent-primary)" st={{ fontWeight: 600 }}>tour the app · ⌘ ⇧ T</MM>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <MM s={10.5} st={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>Day one · Wed · Apr 24</MM>
            <h1 style={{ margin: '14px 0 8px', fontFamily: M.serif, fontWeight: 500, fontSize: 42, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              <span style={{ fontStyle: 'italic' }}>Henry</span> — I read your last 412 posts.
            </h1>
            <div style={{ fontFamily: M.sans, fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 560, margin: '0 auto' }}>
              Your last 30 Reels averaged 4.2% engagement. Your dive footage outperforms your lifestyle content by 2.1×. Want to start with what's working?
            </div>
          </div>

          {/* The pre-loaded first message — Coopr to user */}
          <div style={{ marginBottom: 18, padding: '16px 18px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="var(--fg-on-accent)" /></svg>
              </span>
              <ML s={9}>Coopr · your first message</ML>
              <MM s={9}>· now</MM>
            </div>
            <p style={{ margin: 0, fontFamily: M.serif, fontSize: 17, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
              Three things I noticed while reading. First — your <span style={{ fontWeight: 600 }}>mistake-first opener</span> outperforms every other archetype you use, and you've drifted away from it the last two weeks. Second — Tuesday and Friday at 6:30 PM are your reliable slots. Third — there's a <span style={{ fontWeight: 600 }}>3:14 retention drop</span> on 0041 I'd want to look at with you.
            </p>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {['Show the mistake-first analysis', 'Plan the next two weeks', 'Look at 0041'].map((t, i) => (
                <span key={t} style={{ padding: '6px 12px', background: i === 0 ? 'var(--accent-primary)' : 'transparent', color: i === 0 ? 'var(--fg-on-accent)' : 'var(--fg-secondary)', border: i === 0 ? 'none' : '1px solid var(--border-default)', borderRadius: 999, fontFamily: M.sans, fontSize: 12, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div style={{ width: 720, padding: '12px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, fontFamily: M.sans, fontSize: 14, color: 'var(--fg-tertiary)' }}>Reply, or jump to something else…</span>
            <MM s={10}>↵ to send</MM>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>↑</span>
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// EMPTY HOME for a brand-new user with no handle yet
// ─────────────────────────────────────────────────────────
function HF_HomeEmpty() {
  const chips = [
    { lbl: 'Paste a YouTube link',  hint: 'analyze a single post' },
    { lbl: 'Connect Instagram',     hint: 'pull in your last 90 days' },
    { lbl: 'Drop a script',         hint: 'rewrite or audit voice' },
    { lbl: 'Describe what you make',hint: 'no handle needed' },
  ];
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '52px 32px 60px' }}>
        <div style={{ width: 640, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <ML s={10.5} st={{ letterSpacing: '0.18em' }}>Day one · sandbox · nothing indexed yet</ML>
          <h1 style={{ margin: 0, fontFamily: M.serif, fontWeight: 500, fontSize: 46, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
            Start anywhere. <span style={{ fontStyle: 'italic' }}>I'll keep up.</span>
          </h1>
          <p style={{ margin: 0, fontFamily: M.sans, fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.6, maxWidth: 520 }}>
            Studio works from zero — describe a project or paste a script and we'll start. Library and Insights wake up the moment you connect a handle.
          </p>

          <div style={{ width: '100%', padding: '20px 22px 14px', background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 14, boxShadow: '0 1px 0 rgba(26,24,21,0.02), 0 12px 32px -20px rgba(26,24,21,0.10)', textAlign: 'left' }}>
            <span style={{ display: 'block', fontFamily: M.sans, fontSize: 15.5, color: 'var(--fg-tertiary)', lineHeight: 1.5, minHeight: 44 }}>Paste a script, describe what you're making, or drop a link…</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, paddingTop: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: M.sans, fontSize: 11.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>
                <span style={{ fontFamily: M.mono, fontSize: 10, color: 'var(--accent-primary)' }}>@</span>
                Studio · sandbox
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>↑</span>
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 2 }}>
            {chips.map((c) => (
              <span key={c.lbl} style={{
                display: 'inline-flex', alignItems: 'baseline', gap: 8,
                padding: '7px 14px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border-default)',
                borderRadius: 999,
                fontFamily: M.sans, fontSize: 12.5, color: 'var(--fg-secondary)', fontWeight: 500,
                cursor: 'default',
              }}>
                {c.lbl}
                <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 11.5, color: 'var(--fg-tertiary)', fontWeight: 400 }}>{c.hint}</span>
              </span>
            ))}
          </div>

          <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-tertiary)', lineHeight: 1.5, marginTop: 4 }}>
            Connect a handle later and the briefing fills in — what's working, what isn't, what's about to break.
          </span>
        </div>
      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// BRIEFING-COLLAPSE — what happens after first send
// ─────────────────────────────────────────────────────────
function HF_HomeBriefingCollapsed({ state = 'happy' }) {
  // R10 · state variants — read tweaks override, fall back to prop.
  const ovr = window.useSurfaceState && window.useSurfaceState('home', 'Briefing');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="home"><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="home"><window.HF_EmptyHero
      eyebrow="Briefing · 0 items"
      title="Nothing brewing yet. The briefing fills as you ship."
      caption="Posts due, recent wins, and the one-thing follow-up gather here over time."
      ctaLabel="Open Today"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="home"><window.HF_ErrorHero
      title="Couldn't load the briefing card."
      body="The summary engine timed out. Retry, or expand the full briefing instead."
    /></HfShell>;
  }
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Editorial masthead — single mono eyebrow + thin rule + italic-serif recap.
            Replaces the old multi-stat pill row: that was the full briefing in disguise.
            Now the briefing is genuinely collapsed; what was happening before this thread
            sits in one italic-serif line. */}
        <div style={{ padding: '20px 32px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <div style={{ maxWidth: 1248, margin: '0 auto', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24 }}>
            <ML s={10} st={{ letterSpacing: '0.18em' }}>Wed · Apr 24 · Thread open · 12 m</ML>
            <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-tertiary)', flex: 1, textAlign: 'center' }}>
              Since you started this thread: <span style={{ color: 'var(--fg-primary)' }}>Fujikawa v3 still due,</span> <span style={{ color: 'var(--fg-primary)' }}><span className="hf-num" style={{ fontFamily: M.mono, fontStyle: 'normal', fontWeight: 600, color: 'var(--accent-primary)' }}>0046</span> ticked up to <span className="hf-num" style={{ fontFamily: M.mono, fontStyle: 'normal', fontWeight: 600 }}>31%</span> saves,</span> <span style={{ color: 'var(--fg-primary)' }}>Truk teaser leaves at <span className="hf-num" style={{ fontFamily: M.mono, fontStyle: 'normal', fontWeight: 600 }}>6:30 PM</span>.</span>
            </span>
            <span
              onClick={() => ms.pushToast && ms.pushToast('Expand briefing')}
              style={{ fontFamily: M.mono, fontSize: 10, color: 'var(--fg-tertiary)', textDecoration: 'underline', cursor: 'pointer' }}
            >expand briefing</span>
          </div>
        </div>

        {/* Conversation underneath */}
        <div style={{ padding: '24px 32px 12px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ alignSelf: 'flex-end', maxWidth: '78%', padding: '10px 14px', background: 'var(--surface-3)', borderRadius: 12, borderTopRightRadius: 3 }}>
              <span style={{ fontFamily: M.sans, fontSize: 14, color: 'var(--fg-primary)' }}>three openers for the Fujikawa series, under 1.2 seconds</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--accent-primary)' }} />
                <ML s={9}>Coopr</ML>
                <MM s={9}>· just now</MM>
              </div>
              <p style={{ margin: 0, fontFamily: M.sans, fontSize: 14.5, color: 'var(--fg-primary)', lineHeight: 1.65 }}>
                Three. Each is mistake-first because that archetype outperforms <span className="hf-num" style={{ fontFamily: M.mono }}>1.4×</span> for you. Drafts saved to <span style={{ fontFamily: M.mono, color: 'var(--accent-primary)' }}>Studio · Fujikawa ep. 1 hook</span>.
              </p>
              <div style={{ marginTop: 8, padding: '14px 16px', border: '1px solid var(--border-subtle)', borderRadius: 10, background: 'var(--surface-2)' }}>
                {[
                  ['1.0s', "I almost didn't get on the boat that morning."],
                  ['0.9s', "The Fujikawa is the easiest wreck dive in the world. I still nearly screwed it up."],
                  ['1.1s', "Eight breaths. That's all I had on her port side."],
                ].map(([t, q], i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10, padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', alignItems: 'baseline' }}>
                    <MM s={10.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>{t}</MM>
                    <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-primary)' }}>"{q}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Docked composer */}
        <div style={{ padding: '14px 32px 28px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 720, padding: '12px 16px', background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, fontFamily: M.sans, fontSize: 14, color: 'var(--fg-tertiary)' }}>Reply, or jump to something else…</span>
            <MM s={10}>↵</MM>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>↑</span>
          </div>
        </div>

        {/* ── BTF · trimmed for active-thread density ─────── */}
        <div style={{ background: 'var(--surface-1)', borderTop: '1px solid var(--border-default)', padding: '36px 32px 48px' }}>
          <div style={{ maxWidth: 1248, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
              <span className="hf-byline" style={{ fontSize: 10 }}>YOUR DESK · WHILE THIS THREAD IS OPEN</span>
              <span style={{ fontFamily: M.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-tertiary)' }}>
                Trimmed view — full week and pulse stay in the background.
              </span>
            </div>

            {/* Compact 7-day strip — single row, no per-day post cards */}
            <section>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="hf-byline" style={{ fontSize: 10 }}>WEEK AHEAD · APR 24 → APR 30</span>
                <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>7 SCHEDULED · 2 OPEN</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {[
                  { d: 'WED', date: '24', n: 2, today: true },
                  { d: 'THU', date: '25', n: 2 },
                  { d: 'FRI', date: '26', n: 1 },
                  { d: 'SAT', date: '27', n: 0 },
                  { d: 'SUN', date: '28', n: 1 },
                  { d: 'MON', date: '29', n: 0 },
                  { d: 'TUE', date: '30', n: 1 },
                ].map((d, i) => (
                  <div
                    key={d.d}
                    onClick={() => ms.setActiveSurface && ms.setActiveSurface('calendar', null)}
                    style={{
                      padding: '12px 12px 14px',
                      borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none',
                      background: d.today ? 'var(--accent-soft)' : 'transparent',
                      display: 'flex', flexDirection: 'column', gap: 6,
                      cursor: 'pointer',
                      transition: 'transform 120ms ease',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <MM s={10.5} c={d.today ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'} st={{ letterSpacing: '0.14em', fontWeight: 700 }}>{d.d}</MM>
                      <MM s={9.5} c="var(--fg-tertiary)">{d.date}</MM>
                    </div>
                    <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 13, fontWeight: 600, color: d.n === 0 ? 'var(--fg-tertiary)' : (d.today ? 'var(--accent-primary)' : 'var(--fg-secondary)') }}>
                      {d.n === 0 ? '—' : `${d.n} post${d.n > 1 ? 's' : ''}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Library pulse — 4-up trimmed (no spark, single-line title) */}
            <section>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="hf-byline" style={{ fontSize: 10 }}>LIBRARY PULSE · LAST 7 DAYS</span>
                <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>4 OF 142 · BY MOMENTUM</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                  { id: '0046', ch: 'ig', title: 'The carousel cut from 0042', pct: '31', hot: true },
                  { id: '0042', ch: 'yt', title: 'How I almost lost the Fujikawa cold-open', pct: '54' },
                  { id: '0041', ch: 'tt', title: 'Eight breaths on her port side', pct: '22' },
                  { id: '0039', ch: 'ig', title: 'La Jolla scout, no plan', pct: '28' },
                ].map((p, i) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (ms.setActiveSurface) ms.setActiveSurface('library', 'Catalog');
                      if (ms.setDetail) ms.setDetail('post', p.id);
                    }}
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderTop: p.hot ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      display: 'flex', flexDirection: 'column', gap: 8,
                      cursor: 'pointer',
                      transition: 'transform 120ms ease',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ChannelGlyph id={p.ch} size={14} />
                      <MM s={10} c="var(--fg-tertiary)">{p.id}</MM>
                      <span style={{ flex: 1 }} />
                      <span className="hf-num" style={{ fontFamily: M.mono, fontSize: 10.5, fontWeight: 700, color: p.hot ? 'var(--accent-primary)' : 'var(--fg-secondary)' }}>{p.pct}%</span>
                    </div>
                    <span style={{
                      fontFamily: M.serif, fontStyle: 'italic', fontSize: 13.5, fontWeight: 500,
                      color: 'var(--fg-primary)', lineHeight: 1.35,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{p.title}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

      </div>
    </HfShell>
  );
}

// ─────────────────────────────────────────────────────────
// PATTERN DECISIONS — dimmed chrome, plus-menu, inline AI
// ─────────────────────────────────────────────────────────
function HF_PatternDecisions() {
  return (
    <div className="hf" style={{ width: 1440, padding: 32, background: 'var(--bg-base)' }}>
      <div style={{ marginBottom: 22 }}>
        <ML>Pattern decisions to apply across screens</ML>
        <h1 style={{ margin: '6px 0 8px', fontFamily: M.serif, fontWeight: 500, fontSize: 30, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>
          Five small mechanics, three shown here.
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        {/* Plus menu */}
        <div className="hf-card" style={{ padding: 18 }}>
          <ML>Composer + menu · 285 backend tools</ML>
          <p style={{ margin: '8px 0 12px', fontFamily: M.sans, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            Left-anchored + button on every composer. Opens a contextual menu grouped by workflow stage. ~10 visible at a time. Never a full inventory.
          </p>
          <div style={{ width: 320, background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            {[
              ['Create',    ['Hook Lab', 'Script', 'Storyboard', 'Caption', 'Carousel']],
              ['Analyze',   ['Competitor intel', 'Trends', 'Insights', 'Audience demand']],
              ['Publish',   ['Buffer queue', 'Post Now', 'Repurpose']],
              ['Reference', ['Search Library', 'Web research', 'Knowledge graph']],
            ].map(([g, items], gi) => (
              <div key={g}>
                <div style={{ padding: '8px 14px 4px', borderTop: gi === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <ML s={9}>{g}</ML>
                </div>
                {items.map((it, i) => (
                  <div key={it} style={{ padding: '6px 14px', fontFamily: M.sans, fontSize: 12, color: 'var(--fg-primary)' }}>
                    <span style={{ display: 'inline-block', width: 14, height: 14, marginRight: 8, background: 'var(--surface-2)', borderRadius: 3, verticalAlign: 'middle' }} />
                    {it}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dimmed chrome */}
        <div className="hf-card" style={{ padding: 18 }}>
          <ML>Dimmed chrome · deep-work mode</ML>
          <p style={{ margin: '8px 0 12px', fontFamily: M.sans, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            When Studio Zone 3 is loaded or a chat thread passes 5 messages, app chrome dims to 60%. Hover restores. Linear's signature.
          </p>
          <div style={{ height: 220, border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 36, background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 18, opacity: 0.55 }}>
              <span style={{ width: 16, height: 16, background: 'var(--surface-ink)', borderRadius: 4 }} />
              <span style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 18 }}>
                {['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox'].map((t, i) => (
                  <MM key={t} s={11} c={i === 1 ? 'var(--fg-primary)' : 'var(--fg-secondary)'} st={{ fontWeight: 500 }}>{t}</MM>
                ))}
              </span>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-primary)' }} />
            </div>
            <div style={{ flex: 1, padding: 14, fontFamily: M.serif, fontSize: 16, fontStyle: 'italic', color: 'var(--fg-primary)', background: 'var(--surface-1)' }}>
              You're 12 minutes into rewriting the Fujikawa script. The chrome fades back. The cursor stays alive.
            </div>
          </div>
        </div>

        {/* Inline AI */}
        <div className="hf-card" style={{ padding: 18 }}>
          <ML>Inline AI · space-bar on empty line</ML>
          <p style={{ margin: '8px 0 12px', fontFamily: M.sans, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            In Studio script and hook fields, hitting space on an empty line summons a floating suggestion menu. Removes the explicit "Iterate with COOPR" button.
          </p>
          <div style={{ height: 220, padding: 16, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, position: 'relative' }}>
            <span style={{ fontFamily: M.serif, fontSize: 16, color: 'var(--fg-primary)', display: 'block', marginBottom: 6 }}>The wreck is upside down. Most people miss the entrance.</span>
            <span style={{ fontFamily: M.serif, fontSize: 16, color: 'var(--fg-tertiary)', display: 'block', marginBottom: 6 }}>|</span>
            <div style={{ position: 'absolute', left: 16, top: 76, width: 220, background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 8, boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--accent-primary)' }} />
                <MM s={10} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>continue with…</MM>
              </div>
              {['add a beat after this line', 'turn this into a hook', 'rewrite tighter', 'cite from 0042', 'shot list for this'].map((t, i) => (
                <div key={t} style={{ padding: '6px 12px', fontFamily: M.sans, fontSize: 12, color: 'var(--fg-primary)', background: i === 0 ? 'var(--accent-soft)' : 'var(--surface-1)' }}>{t}</div>
              ))}
              <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-2)' }}>
                <MM s={9.5}>↑↓ navigate · ⏎ insert · esc to dismiss</MM>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HF_InsightsOverview, HF_InsightsFormatDNA, HF_InsightsPosting,
  HF_StudioWorkspace, HF_StudioShipped,
  // Legacy alias so Hi-fi round 1/2/3.html (which still reference the
  // pre-R4 stage-pipeline kanban) keep loading. Round 4 uses HF_StudioWorkspace.
  HF_StudioPipeline: HF_StudioWorkspace,
  HF_Calendar,
  HF_Settings,
  HF_LinkedSwitcher,
  HF_Onb1Signup, HF_Onb2Handle, HF_Onb3Loading, HF_Onb4FirstChat,
  HF_HomeEmpty, HF_HomeBriefingCollapsed,
  HF_PatternDecisions,
});
