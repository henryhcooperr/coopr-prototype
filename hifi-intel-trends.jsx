/* global React, window, HfShell, FreshnessPill */
/* hifi-intel-trends.jsx — Intel / Trends surface.
   Topics rising in the creator's corner of the world (dive · underwater · safety · gear),
   each row showing a velocity bar so the rate of rise is legible at a glance.
   Mirrors the publication framing of hifi-intel.jsx so all 6 Intel surfaces read as siblings. */

const T_INT = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const TR_DISPATCH = 142;
const TR_TOP_DATE = 'WED · APR 24 · 09:42';
const TR_TAGLINE  = 'What is moving, and how fast.';

function TrM({ children, c = 'var(--fg-tertiary)', s = 10.5, st = {} }) {
  return <span style={{ fontFamily: T_INT.mono, fontSize: s, color: c, letterSpacing: '0.06em', ...st }}>{children}</span>;
}
function TrL({ children, c = 'var(--fg-tertiary)', s = 9.5, st = {} }) {
  return <span style={{ fontFamily: T_INT.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', ...st }}>{children}</span>;
}

function TrendsSubtabRight() {
  // B4 · tooltip both metadata pills so the dispatch number and freshness
  // tag explain what they're measuring without competing with the chrome.
  const Tip = window.HF_Tooltip;
  const dispatch = <span style={{ fontFamily: T_INT.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>DISPATCH №&nbsp;{TR_DISPATCH}</span>;
  const freshness = <FreshnessPill at="2m ago" state="fresh" />;
  return (
    <>
      {Tip ? <Tip label="Daily issue number · published 09:42">{dispatch}</Tip> : dispatch}
      {Tip ? <Tip label="Time since the last sync">{freshness}</Tip> : freshness}
    </>
  );
}

// ─── data ──────────────────────────────────────────────────
const TR_PILLAR_TONE = {
  gear:   'var(--accent-primary)',
  safety: 'var(--tone-warning)',
  story:  'var(--fg-secondary)',
};

const TR_CHANNEL_LABEL = {
  TT: 'TikTok',
  YT: 'YouTube',
  IG: 'Instagram',
};

const TR_ROWS = [
  { rank: 1,  dir: 'up',   pct: 84, title: 'Sidemount for solo cave divers',                  desc: 'Solo configurations spreading from cave-tech threads into open-water creators.', pillar: 'gear',   channel: 'TT', samples: ['cavekai.solo', 'silke.diveinstructor', 'reefdoc.kim'],  flag: 'rising-fast' },
  { rank: 2,  dir: 'up',   pct: 52, title: 'Re-evaluating the 5/15 minute gradient model',    desc: 'Decompression debate moving from forums into long-form video reactions.',     pillar: 'safety', channel: 'YT', samples: ['drcompression', 'tek.review.lab', 'bottom.time.kev'],   flag: 'rising' },
  { rank: 3,  dir: 'up',   pct: 38, title: 'Mares Sirius vs Garmin Descent G1',               desc: 'Side-by-side dive computer comparisons taking over the gear slot.',           pillar: 'gear',   channel: 'IG', samples: ['gear.lens.aria', 'wreck.kid.jules', 'silke.diveinstructor'], flag: 'rising' },
  { rank: 4,  dir: 'up',   pct: 27, title: 'Wreck penetration ethics post the Truk closure',  desc: 'Debate on permissioning, archaeology, and creator responsibility.',           pillar: 'story',  channel: 'YT', samples: ['palau.archive', 'maris.wreckhunt', 'sebastian.travels'], flag: 'rising' },
  { rank: 5,  dir: 'up',   pct: 22, title: 'Why dive computers fail in cold water',           desc: 'Battery-failure breakdowns landing across cold-water creators.',              pillar: 'safety', channel: 'YT', samples: ['icewater.kim', 'drcompression', 'reefdoc.kim'],         flag: 'rising' },
  { rank: 6,  dir: 'up',   pct: 18, title: 'Shooting 4K at depth · exposure crash courses',   desc: 'Quick-cut tutorials on ND-stack and white-balance under 30m.',                pillar: 'gear',   channel: 'YT', samples: ['gear.lens.aria', 'reefdoc.kim', 'sebastian.travels'],   flag: 'rising' },
  { rank: 7,  dir: 'up',   pct: 14, title: 'Buddy check shorthand · the BWRAF debate',        desc: 'Instructors arguing whether the mnemonic still earns its keep.',              pillar: 'safety', channel: 'IG', samples: ['silke.diveinstructor', 'instructor.luc', 'drcompression'], flag: 'rising' },
  { rank: 8,  dir: 'flat', pct: 9,  title: 'Reef-safe sunscreen on dive boats',                desc: 'Brand call-outs and ingredient teardowns trickling into stories.',            pillar: 'story',  channel: 'IG', samples: ['ocean.minded', 'reefdoc.kim', 'mira.makes'],            flag: 'new-today' },
  { rank: 9,  dir: 'up',   pct: 5,  title: 'Yoga for divers · hip mobility 5-min',            desc: 'Pre-dive mobility shorts crossing in from the wellness side.',                pillar: 'story',  channel: 'TT', samples: ['mobility.kira', 'silke.diveinstructor', 'instructor.luc'], flag: 'new-today' },
  { rank: 10, dir: 'down', pct: -4, title: 'Saltwater gear-rinse ratios',                      desc: 'Once-a-week posting cycle has thinned out across last 30 days.',              pillar: 'gear',   channel: 'IG', samples: ['gear.lens.aria', 'wreck.kid.jules', 'instructor.luc'],  flag: 'falling' },
  { rank: 11, dir: 'down', pct: -7, title: 'Solo diver self-rescue drills',                    desc: 'Drill demonstrations declining as creators move on to ascent practice.',      pillar: 'safety', channel: 'YT', samples: ['drcompression', 'instructor.luc', 'cavekai.solo'],     flag: 'falling' },
  { rank: 12, dir: 'down', pct: -12, title: 'Drysuit zipper longevity tips',                   desc: 'Maintenance content losing share to electronics teardowns.',                  pillar: 'gear',   channel: 'IG', samples: ['gear.lens.aria', 'silke.diveinstructor', 'wreck.kid.jules'], flag: 'falling' },
];

const TR_WINDOWS = [
  { key: '24h', label: '24h' },
  { key: '7d',  label: '7 days' },
  { key: '30d', label: '30 days' },
];

// ─── velocity bar ──────────────────────────────────────────
function VelocityBar({ pct, dir }) {
  // Visual range: −20 .. +100. Center anchored at 0 so falling rows pull left, rising rows fill right.
  const minPct = -20;
  const maxPct = 100;
  const span = maxPct - minPct; // 120
  const zeroX = ((0 - minPct) / span) * 100;     // ~16.6%
  const valueX = ((pct - minPct) / span) * 100;
  const left = Math.min(zeroX, valueX);
  const width = Math.abs(valueX - zeroX);

  const fill = dir === 'down'
    ? 'color-mix(in srgb, var(--tone-warning) 60%, transparent)'
    : dir === 'flat'
      ? 'color-mix(in srgb, var(--accent-primary) 28%, transparent)'
      : 'linear-gradient(90deg, color-mix(in srgb, var(--accent-primary) 30%, transparent), var(--accent-primary))';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 280 }}>
      <div style={{ position: 'relative', flex: 1, height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
        {/* zero tick */}
        <span style={{ position: 'absolute', left: `${zeroX}%`, top: -2, bottom: -2, width: 1, background: 'var(--border-default)' }} />
        <span style={{ position: 'absolute', left: `${left}%`, top: 0, bottom: 0, width: `${width}%`, background: fill, borderRadius: 4 }} />
      </div>
      <span className="hf-num" style={{
        fontFamily: T_INT.mono, fontSize: 12, fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        color: dir === 'down' ? 'var(--tone-warning)' : 'var(--fg-primary)',
        minWidth: 44, textAlign: 'right', letterSpacing: '0.02em',
      }}>{pct >= 0 ? `+${pct}%` : `${pct}%`}</span>
    </div>
  );
}

function DirArrow({ dir }) {
  // Inline SVG only — no icon libraries.
  const color = dir === 'down' ? 'var(--tone-warning)' : dir === 'flat' ? 'var(--fg-tertiary)' : 'var(--accent-primary)';
  const path = dir === 'down'
    ? 'M3 5 L8 11 L13 5'         // down chevron
    : dir === 'flat'
      ? 'M3 8 L13 8'              // flat dash
      : 'M3 11 L8 5 L13 11';      // up chevron
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d={path} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PillarChip({ pillar }) {
  const tone = TR_PILLAR_TONE[pillar] || 'var(--fg-secondary)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px',
      background: 'color-mix(in srgb, var(--accent-primary) 6%, transparent)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 999,
      fontFamily: T_INT.mono, fontSize: 9.5, fontWeight: 600,
      color: 'var(--fg-secondary)',
      letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone }} />
      {pillar}
    </span>
  );
}

function ChannelChip({ channel }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 6,
      fontFamily: T_INT.mono, fontSize: 9.5, fontWeight: 600,
      color: 'var(--fg-secondary)',
      letterSpacing: '0.08em',
    }}>
      {channel} · {TR_CHANNEL_LABEL[channel]}
    </span>
  );
}

function FlagChip({ flag }) {
  if (!flag || flag === 'rising') return null;
  const map = {
    'rising-fast': { label: 'rising fast', tone: 'var(--accent-primary)', bg: 'var(--accent-soft)' },
    'new-today':   { label: 'new today',   tone: 'var(--tone-success)',   bg: 'var(--tone-success-bg)' },
    'falling':     { label: 'falling',     tone: 'var(--tone-warning)',   bg: 'var(--tone-warning-bg)' },
  };
  const it = map[flag];
  if (!it) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px',
      background: it.bg,
      borderRadius: 4,
      fontFamily: T_INT.mono, fontSize: 9, fontWeight: 700,
      color: it.tone,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>{it.label}</span>
  );
}

// ─── surface ───────────────────────────────────────────────
function HF_IntelTrends({ state = 'happy' }) {
  // R10 · state variants — hooks BEFORE early returns.
  const ovr = window.useSurfaceState && window.useSurfaceState('intel', 'Trends');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  const [windowKey, setWindowKey] = React.useState('7d');
  const [hoverRank, setHoverRank] = React.useState(null);
  const [whyOn, setWhyOn] = React.useState(false);
  // E3 · click coverage — pushToast for trend-row CTA destinations that
  // don't yet have a dedicated detail surface.
  const ms = window.useMasterState ? window.useMasterState() : null;
  const pushToast = ms && ms.pushToast ? ms.pushToast : function () {};
  if (s === 'loading') {
    return <HfShell workspace="intel" subtab="Trends"><window.HF_SkeletonHero shape="feed" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="intel" subtab="Trends"><window.HF_EmptyHero
      eyebrow="Trends · 0 topics tracked"
      title="No trends yet. The radar wakes up once the niche is set."
      caption="Topics rising in your corner of the world will surface here as Intel learns the niche."
      ctaLabel="Open Intel"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="intel" subtab="Trends"><window.HF_ErrorHero
      title="Couldn't load trending topics."
      body="The trend feed timed out. Retry, or come back in a minute."
    /></HfShell>;
  }

  const activeCount  = TR_ROWS.filter(r => r.dir === 'up' || r.dir === 'flat').length;
  const newCount     = TR_ROWS.filter(r => r.flag === 'new-today').length;
  const fallingCount = TR_ROWS.filter(r => r.dir === 'down').length;

  return (
    <HfShell workspace="intel" subtab="Trends" subtabRight={<TrendsSubtabRight />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '32px 48px 56px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>

          {/* Publication strip */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '3px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', padding: '12px 0', marginBottom: 18 }}>
            <span className="hf-byline">PULSE · TRENDS · DISPATCH №&nbsp;{TR_DISPATCH}</span>
            <span style={{ fontFamily: T_INT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)' }}>{TR_TAGLINE}</span>
            <span className="hf-byline">{TR_TOP_DATE}</span>
          </div>

          {/* Header band */}
          <div style={{ borderBottom: '3px solid var(--fg-primary)', paddingBottom: 18, marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
              <TrM s={10} st={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>What is moving</TrM>
              <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
              <TrM s={10} st={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>Vol. III · No. 47</TrM>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 36, alignItems: 'end' }}>
              <div>
                <h1 style={{ margin: 0, fontFamily: T_INT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 52, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 0.98 }}>
                  Topics rising near you.
                </h1>
                <div style={{ marginTop: 12, fontFamily: T_INT.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 640, lineHeight: 1.5 }}>
                  Twelve threads in the dive corner of the world, ranked by how quickly they are gaining ground in your near-niche. Velocity is share-of-posts week over week.
                </div>
              </div>
              {/* stat strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, paddingLeft: 24, borderLeft: '1px solid var(--border-default)' }}>
                {[
                  ['Active',     activeCount],
                  ['New today',  newCount],
                  ['Falling',    fallingCount],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontFamily: T_INT.sans, fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</span>
                    <span className="hf-num" style={{ fontFamily: T_INT.sans, fontSize: 26, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrL s={9.5} st={{ marginRight: 8 }}>Window</TrL>
              <div style={{ display: 'inline-flex', padding: 3, background: 'var(--surface-2)', borderRadius: 999, border: '1px solid var(--border-subtle)' }}>
                {TR_WINDOWS.map(w => {
                  const on = w.key === windowKey;
                  return (
                    <button
                      key={w.key}
                      onClick={() => setWindowKey(w.key)}
                      style={{
                        padding: '6px 14px',
                        border: 'none',
                        borderRadius: 999,
                        background: on ? 'var(--accent-primary)' : 'transparent',
                        color: on ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                        fontFamily: T_INT.mono, fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}>{w.label}</button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => setWhyOn(v => !v)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 14px',
                background: whyOn ? 'var(--accent-soft)' : 'transparent',
                border: `1px solid ${whyOn ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                borderRadius: 6,
                fontFamily: T_INT.sans, fontSize: 12, fontWeight: 600,
                color: whyOn ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                letterSpacing: '0.02em',
                cursor: 'pointer',
              }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: whyOn ? 'var(--accent-primary)' : 'var(--border-default)' }} />
              Why this is rising
            </button>
          </div>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 280px 220px 180px 110px', gap: 16, padding: '10px 14px', borderTop: '1px solid var(--fg-primary)', borderBottom: '1px solid var(--border-default)', fontFamily: T_INT.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <span>Rank</span>
            <span>Topic</span>
            <span>Velocity · {windowKey}</span>
            <span>Pillar · channel</span>
            <span>Who is posting it</span>
            <span style={{ textAlign: 'right' }}>Action</span>
          </div>

          {/* Body — trend rows */}
          <div>
            {TR_ROWS.map(r => {
              const hovered = hoverRank === r.rank;
              const titleSerif = r.dir !== 'down';
              return (
                <div
                  key={r.rank}
                  onMouseEnter={() => setHoverRank(r.rank)}
                  onMouseLeave={() => setHoverRank(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 1fr 280px 220px 180px 110px',
                    gap: 16,
                    alignItems: 'center',
                    padding: '16px 14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: hovered ? 'color-mix(in srgb, var(--accent-primary) 4%, transparent)' : 'transparent',
                    transition: 'background 120ms ease',
                  }}>
                  {/* Rank + arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="hf-num" style={{
                      fontFamily: T_INT.mono, fontSize: 13, fontWeight: 700,
                      color: r.rank <= 3 ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                      fontVariantNumeric: 'tabular-nums',
                      minWidth: 18,
                    }}>{String(r.rank).padStart(2, '0')}</span>
                    <DirArrow dir={r.dir} />
                  </div>

                  {/* Title + desc */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: titleSerif ? T_INT.serif : T_INT.sans,
                        fontStyle: titleSerif ? 'italic' : 'normal',
                        fontSize: titleSerif ? 19 : 16,
                        fontWeight: titleSerif ? 500 : 600,
                        color: r.dir === 'down' ? 'var(--fg-secondary)' : 'var(--fg-primary)',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                      }}>{r.title}</span>
                      <FlagChip flag={r.flag} />
                    </div>
                    <span style={{ fontFamily: T_INT.sans, fontSize: 12.5, color: 'var(--fg-tertiary)', lineHeight: 1.45 }}>{r.desc}</span>
                    {whyOn && (
                      <span style={{ marginTop: 4, fontFamily: T_INT.serif, fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                        Rising because three near-niche creators picked it up in the same {windowKey} window and watch-time on those clips ran above their channel mean.
                      </span>
                    )}
                  </div>

                  {/* Velocity bar · B4 — tooltip explains the percentage delta */}
                  {window.HF_Tooltip
                    ? <window.HF_Tooltip label={'Share-of-voice velocity · ' + (r.pct >= 0 ? '+' : '') + r.pct + '% over ' + windowKey}>
                        <VelocityBar pct={r.pct} dir={r.dir} />
                      </window.HF_Tooltip>
                    : <VelocityBar pct={r.pct} dir={r.dir} />}

                  {/* Pillar + channel */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <PillarChip pillar={r.pillar} />
                    <ChannelChip channel={r.channel} />
                  </div>

                  {/* Samples */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {r.samples.map(s => (
                      <span key={s} style={{ fontFamily: T_INT.mono, fontSize: 10.5, color: 'var(--fg-secondary)', letterSpacing: '0.02em' }}>@{s}</span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => pushToast('Draft a take · ' + r.title)}
                      style={{
                        padding: '7px 12px',
                        background: hovered ? 'var(--accent-primary)' : 'transparent',
                        border: `1px solid ${hovered ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                        borderRadius: 6,
                        fontFamily: T_INT.sans, fontSize: 11.5, fontWeight: 600,
                        color: hovered ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                        letterSpacing: '0.02em',
                        cursor: 'pointer',
                        transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
                      }}>draft a take</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Folio */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fg-primary)', marginTop: 36, paddingTop: 10 }}>
            <span className="hf-folio">PULSE · {TR_DISPATCH} · TRENDS</span>
            <span className="hf-folio">·</span>
            <span className="hf-folio">RADAR · ↓</span>
          </div>
        </div>
      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_IntelTrends });
