/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-A.jsx — Family A · Measurement. */

// A01 · Retention curve
function HF_R4B_A01() {
  return (
    <Frame id="A01" name="Retention curve" purpose="Watch-through over duration vs your top quartile." target="AUDIENCE" span={8}>
      <div className="blk">
        <Eyebrow left="FIG · RETENTION CURVE · LAST 6 SAFETY POSTS" right="30D · N=6" />
        <svg width="100%" height="160" viewBox="0 0 720 160" style={{ display: 'block' }}>
          {[0, 25, 50, 75, 100].map(t => (
            <line key={t} x1="40" x2="710" y1={20 + (1 - t/100) * 110} y2={20 + (1 - t/100) * 110} stroke="var(--border-subtle)" />
          ))}
          <path d="M 40,30 L 100,42 L 160,75 L 220,68 L 280,72 L 340,76 L 400,80 L 460,82 L 520,84 L 580,86 L 640,88 L 710,92" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.25" strokeDasharray="3 3" />
          <path d="M 40,32 L 100,52 L 160,108 L 220,104 L 280,108 L 340,111 L 400,114 L 460,116 L 520,118 L 580,120 L 640,122 L 710,124" fill="none" stroke="var(--accent-primary)" strokeWidth="2.25" />
          <line x1="160" y1="20" x2="160" y2="130" stroke="var(--tone-danger)" strokeDasharray="2 2" opacity="0.55" />
          <circle cx="160" cy="108" r="3.5" fill="var(--surface-1)" stroke="var(--tone-danger)" strokeWidth="1.5" />
          <text x="170" y="104" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--tone-danger)">−14% · 0:03</text>
          <text x="40" y="148" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)">0:00</text>
          <text x="375" y="148" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)" textAnchor="middle">5:00</text>
          <text x="710" y="148" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)" textAnchor="end">10:00</text>
          <line x1="540" y1="22" x2="556" y2="22" stroke="var(--accent-primary)" strokeWidth="2" />
          <text x="560" y="25" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--fg-secondary)">Last 6</text>
          <line x1="615" y1="22" x2="631" y2="22" stroke="var(--fg-tertiary)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="635" y="25" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--fg-secondary)">Top quartile</text>
        </svg>
        <Footer openIn="Audience" extra={<FooterChip icon="pencil" label="Draft a fix" />} />
      </div>
    </Frame>
  );
}

// A02 · Retention delta strip
function HF_R4B_A02() {
  const rows = [
    { id: '0046', d: +9 }, { id: '0045', d: +2 }, { id: '0044', d: -3 }, { id: '0043', d: -22 },
    { id: '0042', d: +12 }, { id: '0041', d: -28 }, { id: '0040', d: -1 }, { id: '0039', d: +14 },
  ];
  return (
    <Frame id="A02" name="Retention delta strip" purpose="Per-post deltas vs your top quartile." target="LIBRARY" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · DELTA · VS Q4" right="N=8" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 0' }}>
          {rows.map(r => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', gap: 8 }}>
              <span className="mono num" style={{ fontSize: 10.5, color: 'var(--fg-tertiary)' }}>{r.id}</span>
              <div style={{ position: 'relative', height: 8, background: 'var(--surface-2)', borderRadius: 1 }}>
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--fg-primary)' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, [r.d >= 0 ? 'left' : 'right']: '50%', width: `${Math.min(48, Math.abs(r.d) * 1.4)}%`, background: r.d >= 0 ? 'var(--accent-primary)' : 'var(--tone-danger)' }} />
              </div>
              <span className="mono num" style={{ fontSize: 10.5, fontWeight: 600, textAlign: 'right', color: r.d >= 0 ? 'var(--accent-primary)' : 'var(--tone-danger)' }}>{r.d > 0 ? '+' : ''}{r.d}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Library" />
      </div>
    </Frame>
  );
}

// A03 · Hook-length scatter
function HF_R4B_A03() {
  const pts = [
    { x: 0.8, y: 0.74 }, { x: 0.9, y: 0.71 }, { x: 1.1, y: 0.68 }, { x: 1.2, y: 0.66 },
    { x: 1.4, y: 0.61 }, { x: 1.6, y: 0.49 }, { x: 1.8, y: 0.42 }, { x: 2.1, y: 0.31 },
    { x: 2.2, y: 0.54 }, { x: 2.4, y: 0.42 },
  ];
  return (
    <Frame id="A03" name="Hook-length scatter" purpose="Hook seconds x retention at min 3." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · SCATTER · HOOK x RETENTION" right="LAST 30 · N=10" />
        <svg width="100%" height="140" viewBox="0 0 360 140">
          <line x1="30" y1="10" x2="30" y2="120" stroke="var(--border-subtle)" />
          <line x1="30" y1="120" x2="350" y2="120" stroke="var(--border-subtle)" />
          <rect x="30" y="20" width="80" height="100" fill="var(--accent-soft)" opacity="0.5" />
          <text x="35" y="33" fontFamily="var(--font-mono)" fontSize="9" fill="var(--accent-primary-press)">≤1.2s · GOOD</text>
          <line x1="30" y1="40" x2="350" y2="115" stroke="var(--fg-tertiary)" strokeDasharray="3 3" strokeWidth="1" />
          {pts.map((p, i) => (
            <circle key={i} cx={30 + p.x * 130} cy={120 - p.y * 100} r="3" fill="var(--accent-primary)" />
          ))}
          <text x="30" y="135" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)">0.5s</text>
          <text x="350" y="135" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)" textAnchor="end">2.5s</text>
          <text x="25" y="25" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)" textAnchor="end">80%</text>
          <text x="25" y="120" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)" textAnchor="end">20%</text>
        </svg>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

// A04 · Watch-time histogram
function HF_R4B_A04() {
  const bins = [1, 2, 4, 7, 9, 6, 3, 2];
  return (
    <Frame id="A04" name="Watch-time histogram" purpose="Distribution of watch-pct, n=12." target="AUDIENCE" span={3}>
      <div className="blk">
        <Eyebrow left="FIG · HIST · WATCH%" right="N=12" />
        <svg width="100%" height="100" viewBox="0 0 200 100">
          {bins.map((v, i) => (
            <rect key={i} x={10 + i * 23} y={90 - v * 8} width={20} height={v * 8} fill="var(--accent-primary)" opacity={i === 4 ? 1 : 0.7} />
          ))}
          <line x1="10" y1="90" x2="200" y2="90" stroke="var(--fg-primary)" />
          <line x1="115" y1="10" x2="115" y2="92" stroke="var(--fg-primary)" strokeDasharray="2 2" />
          <text x="118" y="20" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-primary)" fontWeight="600">μ 58.7%</text>
        </svg>
        <Footer openIn="Audience" />
      </div>
    </Frame>
  );
}

// A05 · Engagement sparkline grid
function HF_R4B_A05() {
  const sparks = [
    { label: 'VIEWS', val: '2.18M', d: '+18.2%', vals: [12, 14, 13, 15, 17, 18, 16, 19, 20, 22, 21, 23] },
    { label: 'SAVES', val: '42.3K', d: '+28.4%', vals: [8, 9, 11, 10, 12, 14, 13, 15, 17, 18, 19, 22] },
    { label: 'COMMENTS', val: '4.18K', d: '+69%', vals: [6, 7, 7, 8, 9, 10, 12, 13, 14, 16, 18, 22] },
  ];
  return (
    <Frame id="A05" name="Engagement sparkline grid" purpose="Three trends, last 30 days." target="PULSE" span={5}>
      <div className="blk">
        <Eyebrow left="FIG · SPARKS · 30D" right="ALL CHANNELS" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sparks.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: i ? '1px solid var(--border-subtle)' : 0 }}>
              <div>
                <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.08em', color: 'var(--fg-tertiary)', fontWeight: 600 }}>{s.label}</div>
                <div className="num" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 18, letterSpacing: '-0.02em' }}>{s.val}</div>
              </div>
              <Spark vals={s.vals} accent w={160} height={32} />
              <span className="mono num" style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600, textAlign: 'right' }}>{s.d}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Pulse" />
      </div>
    </Frame>
  );
}

// A06 · Posting heatmap
function HF_R4B_A06() {
  const m = D.heatmap, hours = D.heatmapHours, days = D.heatmapDays;
  return (
    <Frame id="A06" name="Posting heatmap" purpose="Engagement index by day x hour." target="CALENDAR" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · HEATMAP · DAY x HOUR" right="ENGAGEMENT INDEX" />
        <div style={{ display: 'grid', gridTemplateColumns: '24px repeat(8, 1fr)', gap: 2 }}>
          <span />
          {hours.map(h => <span key={h} className="mono" style={{ fontSize: 8.5, textAlign: 'center', color: 'var(--fg-tertiary)' }}>{h}</span>)}
          {days.map((d, di) => (
            <React.Fragment key={d}>
              <span className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', textAlign: 'right', paddingRight: 4, lineHeight: '20px' }}>{d.slice(0, 1)}</span>
              {m[di].map((v, hi) => (
                <div key={hi} style={{ height: 20, background: 'var(--accent-primary)', opacity: v }} />
              ))}
            </React.Fragment>
          ))}
        </div>
        <Footer openIn="Calendar" />
      </div>
    </Frame>
  );
}

// A07 · Pillar share donut
function HF_R4B_A07() {
  const p = D.creator.pillars;
  let acc = 0;
  const segs = p.map(s => {
    const start = acc;
    acc += s.share;
    return { ...s, start, end: acc };
  });
  return (
    <Frame id="A07" name="Pillar share donut" purpose="Share of library by pillar." target="LIBRARY" span={3}>
      <div className="blk">
        <Eyebrow left="FIG · PILLARS" right="404 POSTS" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            {segs.map((s, i) => {
              const a0 = s.start * 2 * Math.PI - Math.PI / 2;
              const a1 = s.end * 2 * Math.PI - Math.PI / 2;
              const r = 35, cx = 40, cy = 40;
              const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
              const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
              const large = s.end - s.start > 0.5 ? 1 : 0;
              return <path key={i} d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={s.color} opacity={1 - i * 0.18} />;
            })}
            <circle cx="40" cy="40" r="22" fill="var(--surface-1)" />
            <text x="40" y="38" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-tertiary)">PILLAR</text>
            <text x="40" y="50" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="600" fontSize="13">mix</text>
          </svg>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {p.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, background: s.color, opacity: 1 - i * 0.18, borderRadius: 1 }} />
                <span style={{ flex: 1, color: 'var(--fg-secondary)' }}>{s.label}</span>
                <span className="mono num" style={{ fontSize: 10, color: 'var(--fg-tertiary)' }}>{Math.round(s.share * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
        <Footer openIn="Library" />
      </div>
    </Frame>
  );
}

// A08 · Channel split bar
function HF_R4B_A08() {
  const ch = [{ n: 'YT', p: 64 }, { n: 'IG', p: 26 }, { n: 'TT', p: 10 }];
  return (
    <Frame id="A08" name="Channel split bar" purpose="Views per channel, stacked." target="PULSE" span={5}>
      <div className="blk">
        <Eyebrow left="FIG · STACK · CHANNEL" right="VIEWS · 30D" />
        <div style={{ display: 'flex', height: 28, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          {ch.map((c, i) => (
            <div key={i} style={{ flex: c.p, background: 'var(--accent-primary)', opacity: 1 - i * 0.22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-on-accent)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>
              {c.n} · {c.p}%
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 4 }}>
          <Stat label="YOUTUBE" val="1.40M" sub="287K subs" />
          <Stat label="INSTAGRAM" val="567K" sub="98K · up1.1%" />
          <Stat label="TIKTOK" val="218K" sub="25K · down0.6%" />
        </div>
        <Footer openIn="Pulse" />
      </div>
    </Frame>
  );
}

// A09 · Growth curve
function HF_R4B_A09() {
  return (
    <Frame id="A09" name="Growth curve" purpose="Followers over time, all channels." target="PULSE" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · GROWTH · 90D" right="3 CHANNELS" />
        <svg width="100%" height="120" viewBox="0 0 280 120">
          <line x1="30" y1="100" x2="270" y2="100" stroke="var(--border-subtle)" />
          <path d="M 30,90 L 70,84 L 110,72 L 150,60 L 190,48 L 230,38 L 270,30" fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
          <text x="272" y="32" fontFamily="var(--font-mono)" fontSize="9" fill="var(--accent-primary)">YT</text>
          <path d="M 30,72 L 70,70 L 110,68 L 150,66 L 190,64 L 230,62 L 270,60" fill="none" stroke="var(--fg-primary)" strokeWidth="1.5" />
          <text x="272" y="62" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-primary)">IG</text>
          <path d="M 30,90 L 70,91 L 110,90 L 150,91 L 190,92 L 230,92 L 270,92" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.2" strokeDasharray="2 2" />
          <text x="272" y="94" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-tertiary)">TT</text>
          <text x="30" y="115" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-tertiary)">Jan</text>
          <text x="270" y="115" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-tertiary)" textAnchor="end">Apr</text>
        </svg>
        <Footer openIn="Pulse" />
      </div>
    </Frame>
  );
}

// A10 · Funnel block
function HF_R4B_A10() {
  const steps = [
    { label: 'IMPRESSIONS', n: '4.21M', w: 100 },
    { label: 'VIEWS', n: '2.18M', w: 52 },
    { label: 'SAVES', n: '42.3K', w: 12 },
    { label: 'FOLLOWS', n: '12.6K', w: 4 },
  ];
  return (
    <Frame id="A10" name="Funnel block" purpose="Impressions to views to saves to follows." target="PULSE" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · FUNNEL · 30D" right="ALL CHANNELS" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', fontWeight: 600, letterSpacing: '0.06em' }}>{s.label}</span>
              <div style={{ height: 16, background: 'var(--accent-primary)', width: `${s.w}%`, opacity: 1 - i * 0.15 }} />
              <span className="mono num" style={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>{s.n}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Pulse" />
      </div>
    </Frame>
  );
}

// A11 · Quartile ladder
function HF_R4B_A11() {
  return (
    <Frame id="A11" name="Quartile ladder" purpose="Where this post lands across the library." target="LIBRARY" span={3}>
      <div className="blk">
        <Eyebrow left="FIG · QUARTILE · 0042" right="N=404" />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90, paddingTop: 8 }}>
          {[24, 38, 56, 80].map((h, i) => (
            <div key={i} style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ width: '100%', height: `${h}%`, background: i === 3 ? 'var(--accent-primary)' : 'var(--surface-3)' }} />
              {i === 3 && (
                <span style={{ position: 'absolute', top: -16, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-primary)', fontWeight: 700 }}>YOU</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)' }}>
          <span style={{ flex: 1, textAlign: 'center' }}>Q1</span>
          <span style={{ flex: 1, textAlign: 'center' }}>Q2</span>
          <span style={{ flex: 1, textAlign: 'center' }}>Q3</span>
          <span style={{ flex: 1, textAlign: 'center', color: 'var(--accent-primary)', fontWeight: 700 }}>Q4</span>
        </div>
        <Footer openIn="Library" />
      </div>
    </Frame>
  );
}

// A12 · Retention diff overlay
function HF_R4B_A12() {
  return (
    <Frame id="A12" name="Retention diff overlay" purpose="Two posts, one curve, shaded delta." target="STUDIO" span={5}>
      <div className="blk">
        <Eyebrow left="FIG · DIFF · 0042 vs 0041" right="DELTA SHADED" />
        <svg width="100%" height="140" viewBox="0 0 360 140">
          <line x1="20" y1="120" x2="350" y2="120" stroke="var(--border-subtle)" />
          <path d="M 20,30 L 80,40 L 140,52 L 200,60 L 260,68 L 320,76 L 350,80 L 350,120 L 20,120 Z" fill="var(--accent-soft)" opacity="0.5" />
          <path d="M 20,30 L 80,40 L 140,52 L 200,60 L 260,68 L 320,76 L 350,80" fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
          <path d="M 20,42 L 80,76 L 140,86 L 200,92 L 260,98 L 320,102 L 350,104" fill="none" stroke="var(--fg-primary)" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="354" y="82" fontFamily="var(--font-mono)" fontSize="9" fill="var(--accent-primary)" fontWeight="700">0042</text>
          <text x="354" y="106" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-primary)">0041</text>
          <text x="180" y="78" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--accent-primary-press)" fontWeight="700">+24pp</text>
        </svg>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

// A13 · Cohort retention
function HF_R4B_A13() {
  return (
    <Frame id="A13" name="Cohort retention" purpose="Followers acquired week W, retained week W+1..8." target="AUDIENCE" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · COHORT" right="8W ROLLING" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 1 }}>
          {[...Array(8)].map((_, row) => (
            <React.Fragment key={row}>
              <span className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', textAlign: 'right', paddingRight: 4, lineHeight: '18px' }}>W{row + 12}</span>
              {[...Array(8)].map((_, col) => {
                const inCohort = col >= row;
                const v = inCohort ? Math.max(0.18, 1 - (col - row) * 0.12 - row * 0.02) : 0;
                return <div key={col} style={{ height: 18, background: inCohort ? 'var(--accent-primary)' : 'var(--surface-2)', opacity: v }} />;
              })}
            </React.Fragment>
          ))}
        </div>
        <Footer openIn="Audience" />
      </div>
    </Frame>
  );
}

// A14 · Day-of-week strip
function HF_R4B_A14() {
  const vals = [78, 74, 86, 91, 74, 56, 60];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <Frame id="A14" name="Day-of-week strip" purpose="Engagement index per weekday." target="CALENDAR" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · DAY-OF-WEEK" right="ENGAGEMENT INDEX · 30D" />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 72, paddingTop: 4 }}>
          {vals.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', height: `${v}%`, background: i === 3 ? 'var(--accent-primary)' : 'var(--fg-primary)', opacity: i === 3 ? 1 : 0.7 }} />
              <span className="mono" style={{ fontSize: 9, color: i === 3 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: i === 3 ? 700 : 500 }}>{days[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)' }}>
          <span>μ 74</span><span>peak Thu · 91</span>
        </div>
        <Footer openIn="Calendar" />
      </div>
    </Frame>
  );
}

const FAMILY_A_META = [
  { id: 'A01', name: 'Retention curve', purpose: 'Watch-through over duration vs your top quartile.', target: 'AUDIENCE', span: 8, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A01 },
  { id: 'A02', name: 'Retention delta strip', purpose: 'Per-post deltas vs your top quartile.', target: 'LIBRARY', span: 4, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A02 },
  { id: 'A03', name: 'Hook-length scatter', purpose: 'Hook seconds x retention at min 3.', target: 'STUDIO', span: 6, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A03 },
  { id: 'A04', name: 'Watch-time histogram', purpose: 'Distribution of watch-pct, n=12.', target: 'AUDIENCE', span: 3, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A04 },
  { id: 'A05', name: 'Engagement sparkline grid', purpose: 'Three trends, last 30 days.', target: 'PULSE', span: 5, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A05 },
  { id: 'A06', name: 'Posting heatmap', purpose: 'Engagement index by day x hour.', target: 'CALENDAR', span: 4, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A06 },
  { id: 'A07', name: 'Pillar share donut', purpose: 'Share of library by pillar.', target: 'LIBRARY', span: 3, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A07 },
  { id: 'A08', name: 'Channel split bar', purpose: 'Views per channel, stacked.', target: 'PULSE', span: 5, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A08 },
  { id: 'A09', name: 'Growth curve', purpose: 'Followers over time, all channels.', target: 'PULSE', span: 4, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A09 },
  { id: 'A10', name: 'Funnel block', purpose: 'Impressions to views to saves to follows.', target: 'PULSE', span: 4, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A10 },
  { id: 'A11', name: 'Quartile ladder', purpose: 'Where this post lands across the library.', target: 'LIBRARY', span: 3, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A11 },
  { id: 'A12', name: 'Retention diff overlay', purpose: 'Two posts, one curve, shaded delta.', target: 'STUDIO', span: 5, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A12 },
  { id: 'A13', name: 'Cohort retention', purpose: 'Followers acquired week W, retained week W+1..8.', target: 'AUDIENCE', span: 4, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A13 },
  { id: 'A14', name: 'Day-of-week strip', purpose: 'Engagement index per weekday.', target: 'CALENDAR', span: 4, family: 'A', familyTitle: 'Measurement', component: HF_R4B_A14 },
];
registerBlock('A01', FAMILY_A_META[0]);
registerBlock('A02', FAMILY_A_META[1]);
registerBlock('A03', FAMILY_A_META[2]);
registerBlock('A04', FAMILY_A_META[3]);
registerBlock('A05', FAMILY_A_META[4]);
registerBlock('A06', FAMILY_A_META[5]);
registerBlock('A07', FAMILY_A_META[6]);
registerBlock('A08', FAMILY_A_META[7]);
registerBlock('A09', FAMILY_A_META[8]);
registerBlock('A10', FAMILY_A_META[9]);
registerBlock('A11', FAMILY_A_META[10]);
registerBlock('A12', FAMILY_A_META[11]);
registerBlock('A13', FAMILY_A_META[12]);
registerBlock('A14', FAMILY_A_META[13]);
Object.assign(window, {
  HF_R4B_A01,
  HF_R4B_A02,
  HF_R4B_A03,
  HF_R4B_A04,
  HF_R4B_A05,
  HF_R4B_A06,
  HF_R4B_A07,
  HF_R4B_A08,
  HF_R4B_A09,
  HF_R4B_A10,
  HF_R4B_A11,
  HF_R4B_A12,
  HF_R4B_A13,
  HF_R4B_A14,
  FAMILY_A: { A01: HF_R4B_A01, A02: HF_R4B_A02, A03: HF_R4B_A03, A04: HF_R4B_A04, A05: HF_R4B_A05, A06: HF_R4B_A06, A07: HF_R4B_A07, A08: HF_R4B_A08, A09: HF_R4B_A09, A10: HF_R4B_A10, A11: HF_R4B_A11, A12: HF_R4B_A12, A13: HF_R4B_A13, A14: HF_R4B_A14 }
});


/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-B.jsx — Family B · Comparison. */

function HF_R4B_B01() {
  return (
    <Frame id="B01" name="Two-post compare" purpose="Side-by-side post stat sheet." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · COMPARE · 0042 vs 0041" right="LONG-FORM · YT" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '1px solid var(--border-subtle)' }}>
          {[
            { id: '0042', title: 'My first wreck — and what I got wrong', m: [{ k: 'VIEWS', v: '421K' }, { k: 'WATCH%', v: '71%' }, { k: 'SAVES', v: '12.4K' }, { k: 'HOOK', v: '0.9s' }] },
            { id: '0041', title: 'A 12-min dive-safety primer that almost worked', m: [{ k: 'VIEWS', v: '138K' }, { k: 'WATCH%', v: '31%' }, { k: 'SAVES', v: '1.82K' }, { k: 'HOOK', v: '2.1s' }] },
          ].map((p, i) => (
            <div key={i} style={{ padding: 12, borderRight: i === 0 ? '1px solid var(--border-subtle)' : 0 }}>
              <div className="mono" style={{ fontSize: 9.5, color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em' }}>POST {p.id}</div>
              <div className="serif-it" style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.25, marginTop: 4, marginBottom: 10 }}>{p.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {p.m.map(s => <Stat key={s.k} label={s.k} val={s.v} accent={i === 0} />)}
              </div>
            </div>
          ))}
        </div>
        <Footer openIn="Studio" extra={<span className="blk-chip accent">Δ +24pp watch</span>} />
      </div>
    </Frame>
  );
}

function HF_R4B_B02() {
  return (
    <Frame id="B02" name="Format A/B card" purpose="Format X vs Y on key metrics." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · FORMAT · COLD-OPEN vs NARRATED" right="N=22" />
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 60px', gap: 0, fontSize: 11, lineHeight: '28px' }}>
          {['', 'COLD-OPEN', 'NARRATED', 'Δ'].map((h, i) => (
            <span key={i} className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 600, letterSpacing: '0.08em', borderBottom: '1px solid var(--fg-primary)' }}>{h}</span>
          ))}
          {[
            ['Avg retention', '66%', '52%', '+14pp'],
            ['Avg saves', '1,820', '610', '+198%'],
            ['Stop-rate', '8%', '21%', '−13pp'],
            ['Posts in library', '14', '8', '—'],
          ].map((row, i) => (
            <React.Fragment key={i}>
              <span style={{ borderTop: i ? '1px dotted var(--border-subtle)' : 0, color: 'var(--fg-secondary)' }}>{row[0]}</span>
              <span className="num mono" style={{ borderTop: i ? '1px dotted var(--border-subtle)' : 0, color: 'var(--accent-primary)', fontWeight: 600 }}>{row[1]}</span>
              <span className="num mono" style={{ borderTop: i ? '1px dotted var(--border-subtle)' : 0, color: 'var(--fg-primary)' }}>{row[2]}</span>
              <span className="num mono" style={{ borderTop: i ? '1px dotted var(--border-subtle)' : 0, color: 'var(--accent-primary)', fontWeight: 600 }}>{row[3]}</span>
            </React.Fragment>
          ))}
        </div>
        <span className="mono" style={{ fontSize: 9.5, color: 'var(--accent-primary)', letterSpacing: '0.06em' }}>star SIG · p&lt;0.05</span>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_B03() {
  const hooks = [
    { rank: 1, copy: '"You have ninety seconds underwater. Don\'t waste the first eight."', stop: 12, pred: 78 },
    { rank: 2, copy: '"My buddy almost killed me last Tuesday. Here\'s why it was my fault."', stop: 18, pred: 71 },
    { rank: 3, copy: '"Three things I check before every wreck dive."', stop: 24, pred: 64 },
  ];
  return (
    <Frame id="B03" name="Hook-test grid" purpose="Three openers ranked by predicted stop-rate." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · HOOK TEST · FIJI EP.1" right="3 OPENERS · ≤8s" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hooks.map((h, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 60px', gap: 10, alignItems: 'flex-start', paddingBottom: 10, borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 0 }}>
              <span className="num" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 26, fontStyle: 'italic', color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', letterSpacing: '-0.03em', lineHeight: 0.9 }}>0{h.rank}</span>
              <div>
                <div className="serif-it" style={{ fontSize: 13.5, lineHeight: 1.4, color: 'var(--fg-primary)' }}>{h.copy}</div>
                <div className="mono" style={{ marginTop: 6, fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>STOP {h.stop}% · PRED HOLD {h.pred}%</div>
              </div>
              <div style={{ position: 'relative', height: 4, background: 'var(--surface-2)', marginTop: 8 }}>
                <div style={{ position: 'absolute', inset: 0, width: `${h.pred}%`, background: i === 0 ? 'var(--accent-primary)' : 'var(--fg-primary)', opacity: i === 0 ? 1 : 0.5 }} />
              </div>
            </div>
          ))}
        </div>
        <Footer openIn="Studio" extra={<FooterChip icon="play" label="Run as A/B" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_B04() {
  const p = [{ n: 'SAFETY', r: 62, s: 84 }, { n: 'GEAR', r: 58, s: 56 }, { n: 'STORY', r: 71, s: 92 }, { n: 'REPLY', r: 64, s: 18 }];
  return (
    <Frame id="B04" name="Pillar comparison" purpose="Retention & saves by pillar." target="LIBRARY" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · PILLAR · 4 LANES" right="RETENTION · SAVES" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {p.map((x, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 8, borderLeft: '1px solid var(--border-subtle)' }}>
              <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em' }}>{x.n}</span>
              <div className="num" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em' }}>{x.r}%</div>
              <div style={{ height: 4, background: 'var(--surface-2)' }}>
                <div style={{ height: '100%', width: `${x.r}%`, background: 'var(--accent-primary)' }} />
              </div>
              <span className="mono num" style={{ fontSize: 10, color: 'var(--fg-tertiary)' }}>{x.s} saves/post</span>
            </div>
          ))}
        </div>
        <Footer openIn="Library" />
      </div>
    </Frame>
  );
}

function HF_R4B_B05() {
  const rows = [['VIEWS', '1.4M', '567K', '218K'], ['SAVES', '24.1K', '15.4K', '2.8K'], ['WATCH%', '62%', '58%', '47%']];
  return (
    <Frame id="B05" name="Channel matrix" purpose="Metric x channel grid, best cell highlighted." target="PULSE" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · MATRIX" right="LAST 30 · 3 CHANNELS" />
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr', fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>
          <span style={{ color: 'var(--fg-tertiary)' }}> </span>
          {['YT', 'IG', 'TT'].map(c => <span key={c} style={{ fontSize: 9, fontWeight: 700, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', borderBottom: '1px solid var(--fg-primary)', paddingBottom: 4, textAlign: 'right' }}>{c}</span>)}
          {rows.map((r, i) => r.map((cell, j) => (
            <span key={`${i}${j}`} className={j > 0 ? 'num' : ''} style={{ padding: '6px 0', borderBottom: '1px dotted var(--border-subtle)', color: j === 1 && i === 0 ? 'var(--accent-primary)' : j === 0 ? 'var(--fg-tertiary)' : 'var(--fg-primary)', fontWeight: j === 1 && i === 0 ? 700 : 500, textAlign: j === 0 ? 'left' : 'right', fontSize: j === 0 ? 9 : 11, letterSpacing: j === 0 ? '0.06em' : 0 }}>{cell}</span>
          )))}
        </div>
        <Footer openIn="Pulse" />
      </div>
    </Frame>
  );
}

function HF_R4B_B06() {
  const peers = [{ h: '@henry.dives', f: 410, you: true }, { h: '@diveops_lt', f: 312 }, { h: '@marina.k', f: 408 }, { h: '@reefdrifter', f: 612 }];
  return (
    <Frame id="B06" name="Peer benchmark" purpose="You vs 3 peers on a shared axis." target="PULSE" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · PEERS · SAFETY LANE" right="FOLLOWERS · K" />
        <div style={{ position: 'relative', padding: '12px 0' }}>
          <div style={{ height: 1, background: 'var(--fg-primary)', position: 'relative' }}>
            {peers.map((p, i) => (
              <div key={i} style={{ position: 'absolute', left: `${(p.f / 700) * 100}%`, top: -5, width: 10, height: 10, borderRadius: '50%', background: p.you ? 'var(--accent-primary)' : 'var(--surface-1)', border: '1.5px solid', borderColor: p.you ? 'var(--accent-primary)' : 'var(--fg-primary)', transform: 'translateX(-50%)' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)' }}>
            <span>0</span><span>700K</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
          {peers.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: p.you ? 'var(--accent-primary)' : 'var(--fg-secondary)', fontWeight: p.you ? 700 : 500 }}>
              <span>{p.h}{p.you ? ' · you' : ''}</span><span className="num">{p.f}K</span>
            </div>
          ))}
        </div>
        <Footer openIn="Pulse" />
      </div>
    </Frame>
  );
}

function HF_R4B_B07() {
  return (
    <Frame id="B07" name="Before/after rewrite" purpose="Original vs rewrite, predicted lift." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · REWRITE · 0041 OPENER" right="VOICE-MATCHED" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ padding: 12, borderRight: '1px solid var(--border-subtle)' }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>BEFORE</div>
            <p className="serif" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-secondary)', fontStyle: 'italic' }}>"Today we're going to talk about dive safety, which is something I think a lot of people overlook in their training…"</p>
            <div className="mono" style={{ marginTop: 8, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>HOOK 2.1s · STOP 28%</div>
          </div>
          <div style={{ padding: 12 }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>AFTER</div>
            <p className="serif" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-primary)', fontStyle: 'italic' }}>"My buddy almost killed me last Tuesday. Here's why it was my fault."</p>
            <div className="mono" style={{ marginTop: 8, fontSize: 9.5, color: 'var(--accent-primary)', fontWeight: 700 }}>HOOK 0.8s · PRED STOP 11%</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
          <span className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', fontWeight: 600 }}>PRED LIFT</span>
          <div style={{ flex: 1, height: 6, background: 'var(--surface-2)' }}>
            <div style={{ height: '100%', width: '64%', background: 'var(--accent-primary)' }} />
          </div>
          <span className="mono num" style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 700 }}>+17pp</span>
        </div>
        <Footer openIn="Studio" extra={<FooterChip icon="check" label="Apply" accent />} />
      </div>
    </Frame>
  );
}

const FAMILY_B_META = [
  { id: 'B01', name: 'Two-post compare', purpose: 'Side-by-side post stat sheet.', target: 'STUDIO', span: 6, family: 'B', familyTitle: 'Comparison', component: HF_R4B_B01 },
  { id: 'B02', name: 'Format A/B card', purpose: 'Format X vs Y on key metrics.', target: 'STUDIO', span: 6, family: 'B', familyTitle: 'Comparison', component: HF_R4B_B02 },
  { id: 'B03', name: 'Hook-test grid', purpose: 'Three openers ranked by predicted stop-rate.', target: 'STUDIO', span: 6, family: 'B', familyTitle: 'Comparison', component: HF_R4B_B03 },
  { id: 'B04', name: 'Pillar comparison', purpose: 'Retention & saves by pillar.', target: 'LIBRARY', span: 6, family: 'B', familyTitle: 'Comparison', component: HF_R4B_B04 },
  { id: 'B05', name: 'Channel matrix', purpose: 'Metric x channel grid, best cell highlighted.', target: 'PULSE', span: 4, family: 'B', familyTitle: 'Comparison', component: HF_R4B_B05 },
  { id: 'B06', name: 'Peer benchmark', purpose: 'You vs 3 peers on a shared axis.', target: 'PULSE', span: 4, family: 'B', familyTitle: 'Comparison', component: HF_R4B_B06 },
  { id: 'B07', name: 'Before/after rewrite', purpose: 'Original vs rewrite, predicted lift.', target: 'STUDIO', span: 6, family: 'B', familyTitle: 'Comparison', component: HF_R4B_B07 },
];
registerBlock('B01', FAMILY_B_META[0]);
registerBlock('B02', FAMILY_B_META[1]);
registerBlock('B03', FAMILY_B_META[2]);
registerBlock('B04', FAMILY_B_META[3]);
registerBlock('B05', FAMILY_B_META[4]);
registerBlock('B06', FAMILY_B_META[5]);
registerBlock('B07', FAMILY_B_META[6]);
Object.assign(window, {
  HF_R4B_B01,
  HF_R4B_B02,
  HF_R4B_B03,
  HF_R4B_B04,
  HF_R4B_B05,
  HF_R4B_B06,
  HF_R4B_B07,
  FAMILY_B: { B01: HF_R4B_B01, B02: HF_R4B_B02, B03: HF_R4B_B03, B04: HF_R4B_B04, B05: HF_R4B_B05, B06: HF_R4B_B06, B07: HF_R4B_B07 }
});


/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock,
   R4GDraftCanvas, R4GDraftVariantStack, R4GDraftInlinePatch, R4GDraftSourceTrace, R4GDraftRevisionControls, R4GDraftApprovalPackage */
/* hifi-r4-blocks-C.jsx — Family C · Draft. */

function HF_R4B_C01() {
  return (
    <Frame id="C01" name="Draft block" purpose="A generated caption / post / script." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · FIJI EP.1 · CAPTION" right="IG · 318 / 2200 CHARS" />
        <p className="serif" style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--fg-primary)' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 38, float: 'left', lineHeight: 0.85, marginRight: 6, marginTop: 4, color: 'var(--accent-primary)' }}>Y</span>ou have ninety seconds underwater. Don't waste the first eight. The Fujikawa Maru is sitting in 28 meters of water and the bow railing is the only place you actually get to think before the current shows up. I'll show you what I check.
        </p>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>VOICE-MATCHED · NO FORBIDDEN WORDS · READ TIME 12s</div>
        <Footer openIn="Studio" extra={<FooterChip icon="retry" label="Regenerate" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_C02() {
  const hooks = [
    'You have ninety seconds underwater. Don\'t waste the first eight.',
    'My buddy almost killed me last Tuesday. Here\'s why it was my fault.',
    'Three things I check before every wreck dive.',
    'I\'ve been doing buddy checks wrong for twelve years.',
  ];
  return (
    <Frame id="C02" name="Hook variants" purpose="Ranked openers with stop-rate prediction." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · 4 HOOKS · RANKED" right="≤8s · PRED STOP" />
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
          {hooks.map((h, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 50px', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 0, alignItems: 'baseline' }}>
              <span className="mono num" style={{ fontSize: 10, color: 'var(--fg-tertiary)', fontWeight: 700 }}>0{i + 1}</span>
              <span className="serif-it" style={{ fontSize: 13.5, lineHeight: 1.4 }}>"{h}"</span>
              <span className="mono num" style={{ fontSize: 10.5, color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 700, textAlign: 'right' }}>{[12, 18, 24, 31][i]}%</span>
            </li>
          ))}
        </ol>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_C03() {
  const beats = [
    { tc: '0:00', t: 'Cold-open · bow railing, current rip' },
    { tc: '0:08', t: 'Voiceover: "Ninety seconds." Cut to gauge.' },
    { tc: '0:30', t: 'Step one — buddy check, real version' },
    { tc: '1:10', t: 'Step two — depth + air, single breath' },
    { tc: '1:50', t: 'Step three — exit plan you can recite' },
    { tc: '2:20', t: 'Sit on the railing. Don\'t go yet.' },
  ];
  return (
    <Frame id="C03" name="Outline beat sheet" purpose="Structured outline with timecodes." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="OUTLINE · 6 BEATS" right="TARGET 2:30" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {beats.map((b, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: 12, padding: '8px 0', borderBottom: i < beats.length - 1 ? '1px solid var(--border-subtle)' : 0, alignItems: 'baseline' }}>
              <span className="mono num" style={{ fontSize: 10.5, color: 'var(--accent-primary)', fontWeight: 700 }}>{b.tc}</span>
              <span className="serif" style={{ fontSize: 13.5, lineHeight: 1.4, fontStyle: i === 0 ? 'italic' : 'normal', fontWeight: 500 }}>{b.t}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_C04() {
  const titles = [
    'My first wreck — and what I got wrong',
    'I\'ve dived this wreck a hundred times. Here\'s what I never noticed.',
    'Eight breaths inside the Fujikawa Maru',
  ];
  return (
    <Frame id="C04" name="Title test" purpose="Three alternative titles + reasoning." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · 3 TITLES" right="YT · 60 CHARS MAX" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {titles.map((t, i) => (
            <div key={i} style={{ paddingBottom: 10, borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 0 }}>
              <div className="serif-it" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.25, color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>{t}</div>
              <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', marginTop: 4, letterSpacing: '0.06em' }}>
                {[`${t.length} CHARS · OWN-FAILURE FRAME · MATCHES YOUR TOP 3`, `${t.length} CHARS · CONTRARIAN · UNTESTED`, `${t.length} CHARS · NUMERIC + LOCATION · 2 PRECEDENTS`][i]}
              </div>
            </div>
          ))}
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_C05() {
  return (
    <Frame id="C05" name="Caption variants" purpose="IG/TT caption options with character meters." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · CAPTIONS · 3 VARIANTS" right="IG · 2200 MAX" />
        {[
          { l: 'TIGHT', n: 142, c: 'You have 90 seconds underwater. Don\'t waste 8 of them. Three checks I run on the bow railing — link in bio for the full piece.' },
          { l: 'NARRATIVE', n: 388, c: 'My first time on the Fujikawa Maru I forgot the second check, and the current got my fin straps before I got my bearings. I\'ve since baked the three-check ritual into every wreck I dive — and I\'ve never had a panic moment again.' },
          { l: 'QUESTION-LED', n: 96, c: 'What do you actually do in the eight seconds before you drop? Mine is a three-step thing.' },
        ].map((v, i) => (
          <div key={i} style={{ paddingTop: i ? 10 : 4, borderTop: i ? '1px solid var(--border-subtle)' : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 9.5, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.08em' }}>{v.l}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 60, height: 3, background: 'var(--surface-2)' }}>
                  <div style={{ height: '100%', width: `${(v.n / 2200) * 100 * 4}%`, background: 'var(--accent-primary)' }} />
                </div>
                <span className="mono num" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)' }}>{v.n}/2200</span>
              </div>
            </div>
            <p className="serif" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-primary)' }}>{v.c}</p>
          </div>
        ))}
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_C06() {
  return (
    <Frame id="C06" name="Reply draft" purpose="Draft reply to a comment or DM." target="INBOX" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · REPLY TO @marina.k" right="DM · TONE: WARM, CRAFT" />
        <div style={{ paddingLeft: 10, borderLeft: '2px solid var(--border-subtle)', marginBottom: 8 }}>
          <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', marginBottom: 4 }}>@MARINA.K · 5H</div>
          <p className="serif-it" style={{ margin: 0, fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>"Asked Henry on the safety storytelling pod — his answer at 23:14 is the cleanest I've heard."</p>
        </div>
        <p className="serif" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--fg-primary)' }}>Marina — that's generous. The 23:14 line was actually borrowed from a thing my dive instructor used to say, just dressed up. If you want the longer version of it I'll dig out the original recording.</p>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, letterSpacing: '0.06em' }}>VOICE: PLAINSPOKEN · 38 WORDS · SOUNDS LIKE YOU</div>
        <Footer openIn="Inbox" extra={<FooterChip icon="arrow-up" label="Send" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_C07() {
  return (
    <Frame id="C07" name="Voice-match patch" purpose="Rewrite of a passage matching voice DNA." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="PATCH · VOICE-MATCH · 2 EDITS" right="0046 · LINE 4" />
        <div className="serif" style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-primary)' }}>
          The dive itself was{' '}
          <span style={{ textDecoration: 'line-through', color: 'var(--fg-tertiary)' }}>absolutely epic</span>
          {' '}<span style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary-press)', padding: '0 4px' }}>quietly satisfying</span>
          , and the visibility was{' '}
          <span style={{ textDecoration: 'line-through', color: 'var(--fg-tertiary)' }}>a literal game-changer</span>
          {' '}<span style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary-press)', padding: '0 4px' }}>better than I'd planned for</span>.
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 8, letterSpacing: '0.06em' }}>2 FORBIDDEN WORDS REPLACED · "EPIC", "GAME-CHANGER" · VOICE MEMORY M08</div>
        <Footer openIn="Studio" extra={<FooterChip icon="check" label="Accept all" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_C08() {
  const rows = [
    ['0:00', 'Cold open · gauge close-up', 'MACRO · gauge to pan to bow'],
    ['0:08', '"You have ninety seconds underwater."', 'WIDE · diver silhouette'],
    ['0:30', 'Step one — buddy check, real version', 'OTS · partner\'s rig'],
    ['1:10', 'Step two — depth + air', 'INSERT · computer screen'],
    ['1:50', 'Step three — exit plan', 'WIDE · ascent line'],
  ];
  return (
    <Frame id="C08" name="Script with shotlist" purpose="Line + shot column." target="STUDIO" span={12}>
      <div className="blk">
        <Eyebrow left="SCRIPT · 5 BEATS · WITH SHOTLIST" right="TARGET 2:30 · YT" />
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', borderTop: '1px solid var(--fg-primary)' }}>
          {['TC', 'LINE', 'SHOT'].map((h, i) => (
            <span key={i} className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em', padding: '6px 8px 6px 0', borderBottom: '1px solid var(--border-subtle)' }}>{h}</span>
          ))}
          {rows.map((r, i) => r.map((c, j) => (
            <span key={`${i}${j}`} className={j === 0 ? 'mono num' : j === 2 ? 'mono' : 'serif'} style={{ padding: '8px 8px 8px 0', borderBottom: i < rows.length - 1 ? '1px dotted var(--border-subtle)' : 0, fontSize: j === 0 ? 11 : j === 2 ? 10.5 : 13.5, fontStyle: j === 1 ? 'italic' : 'normal', color: j === 0 ? 'var(--accent-primary)' : j === 2 ? 'var(--fg-tertiary)' : 'var(--fg-primary)', fontWeight: j === 0 ? 700 : 500, letterSpacing: j === 2 ? '0.06em' : 0 }}>{c}</span>
          )))}
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_C09() {
  return (
    <Frame id="C09" name="Description / chapters" purpose="YT description with timestamped chapters." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · YT DESCRIPTION + CHAPTERS" right="0046 · 712s" />
        <p className="serif" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-primary)', fontStyle: 'italic' }}>The Fujikawa Maru is sitting in 28 meters of water in Truk Lagoon. This is what I actually do in the eight seconds before I drop.</p>
        <div className="mono" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
          {[['0:00', 'Bow railing'], ['1:08', 'Buddy check, real version'], ['3:24', 'The mistake I made on dive one'], ['7:12', 'Three checks, recap'], ['9:48', 'What I do if any of them fails']].map(([tc, t], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr', padding: '4px 0', fontSize: 11.5 }}>
              <span className="num" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{tc}</span>
              <span style={{ color: 'var(--fg-secondary)', fontFamily: 'var(--font-sans)' }}>{t}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_C10() {
  return (
    <Frame id="C10" name="Source-backed draft canvas" purpose="Draft text with attached proof and revision controls." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · SOURCE-BACKED / V2" right="OWN PROOF ATTACHED" />
        {window.R4GDraftCanvas ? <R4GDraftCanvas compact /> : null}
        <Footer openIn="Studio" extra={<FooterChip icon="arrow-up-right" label="Open draft" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_C11() {
  return (
    <Frame id="C11" name="Variant decision stack" purpose="Choose the draft variant before packaging." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · VARIANT DECISION" right="3 OPTIONS / 1 KEPT" />
        {window.R4GDraftVariantStack ? <R4GDraftVariantStack compact /> : null}
        <Footer openIn="Studio" extra={<FooterChip icon="check" label="Use selected" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_C12() {
  return (
    <Frame id="C12" name="Inline revision patch" purpose="Accept or restore a source-backed revision." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · REVISION PATCH" right="ACCEPT / RESTORE" />
        {window.R4GDraftInlinePatch ? <R4GDraftInlinePatch compact /> : null}
        {window.R4GDraftRevisionControls ? <R4GDraftRevisionControls compact /> : null}
        <Footer openIn="Studio" extra={<FooterChip icon="pencil" label="Revise again" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_C13() {
  return (
    <Frame id="C13" name="Voice and source trace" purpose="Show why the generated draft is allowed to exist." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DRAFT · TRACE / VOICE / SOURCES" right="APPROVAL NEXT" />
        {window.R4GDraftSourceTrace ? <R4GDraftSourceTrace compact /> : null}
        {window.R4GDraftApprovalPackage ? <R4GDraftApprovalPackage compact /> : null}
        <Footer openIn="Studio" extra={<FooterChip icon="warning" label="Hold approval" accent />} />
      </div>
    </Frame>
  );
}

const FAMILY_C_META = [
  { id: 'C01', name: 'Draft block', purpose: 'A generated caption / post / script.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C01 },
  { id: 'C02', name: 'Hook variants', purpose: 'Ranked openers with stop-rate prediction.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C02 },
  { id: 'C03', name: 'Outline beat sheet', purpose: 'Structured outline with timecodes.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C03 },
  { id: 'C04', name: 'Title test', purpose: 'Three alternative titles + reasoning.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C04 },
  { id: 'C05', name: 'Caption variants', purpose: 'IG/TT caption options with character meters.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C05 },
  { id: 'C06', name: 'Reply draft', purpose: 'Draft reply to a comment or DM.', target: 'INBOX', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C06 },
  { id: 'C07', name: 'Voice-match patch', purpose: 'Rewrite of a passage matching voice DNA.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C07 },
  { id: 'C08', name: 'Script with shotlist', purpose: 'Line + shot column.', target: 'STUDIO', span: 12, family: 'C', familyTitle: 'Draft', component: HF_R4B_C08 },
  { id: 'C09', name: 'Description / chapters', purpose: 'YT description with timestamped chapters.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C09 },
  { id: 'C10', name: 'Source-backed draft canvas', purpose: 'Draft text with attached proof and revision controls.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C10 },
  { id: 'C11', name: 'Variant decision stack', purpose: 'Choose the draft variant before packaging.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C11 },
  { id: 'C12', name: 'Inline revision patch', purpose: 'Accept or restore a source-backed revision.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C12 },
  { id: 'C13', name: 'Voice and source trace', purpose: 'Show why the generated draft is allowed to exist.', target: 'STUDIO', span: 6, family: 'C', familyTitle: 'Draft', component: HF_R4B_C13 },
];
FAMILY_C_META.forEach(meta => registerBlock(meta.id, meta));
Object.assign(window, {
  HF_R4B_C01,
  HF_R4B_C02,
  HF_R4B_C03,
  HF_R4B_C04,
  HF_R4B_C05,
  HF_R4B_C06,
  HF_R4B_C07,
  HF_R4B_C08,
  HF_R4B_C09,
  HF_R4B_C10,
  HF_R4B_C11,
  HF_R4B_C12,
  HF_R4B_C13,
  FAMILY_C: { C01: HF_R4B_C01, C02: HF_R4B_C02, C03: HF_R4B_C03, C04: HF_R4B_C04, C05: HF_R4B_C05, C06: HF_R4B_C06, C07: HF_R4B_C07, C08: HF_R4B_C08, C09: HF_R4B_C09, C10: HF_R4B_C10, C11: HF_R4B_C11, C12: HF_R4B_C12, C13: HF_R4B_C13 }
});
