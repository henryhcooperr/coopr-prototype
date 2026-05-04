/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-D.jsx — Family D · Audience. */

function HF_R4B_D01() {
  const segs = [
    { n: 'WRECK / TECH', pct: 38, d: '+4pp' },
    { n: 'BEGINNER OW', pct: 22, d: '−1pp' },
    { n: 'GEAR / KIT', pct: 18, d: '+0pp' },
    { n: 'TRAVEL / LOG', pct: 14, d: '−2pp' },
    { n: 'OTHER', pct: 8, d: '−1pp' },
  ];
  return (
    <Frame id="D01" name="Audience-segment card" purpose="Five segments by share, 30d." target="AUDIENCE" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · SEGMENTS · BY INTEREST" right="N=12.4K · 30D" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {segs.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px 50px', gap: 10, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 9.5, color: 'var(--fg-secondary)', fontWeight: 600, letterSpacing: '0.06em' }}>{s.n}</span>
              <div style={{ height: 6, background: 'var(--surface-2)', position: 'relative' }}>
                <div style={{ height: '100%', width: `${s.pct}%`, background: i === 0 ? 'var(--accent-primary)' : 'var(--fg-primary)', opacity: i === 0 ? 1 : 0.3 + (4 - i) * 0.1 }} />
              </div>
              <span className="num mono" style={{ fontSize: 11, color: 'var(--fg-primary)', fontWeight: 600, textAlign: 'right' }}>{s.pct}%</span>
              <span className="num mono" style={{ fontSize: 10, color: s.d.startsWith('+') ? 'var(--accent-primary)' : 'var(--fg-tertiary)', textAlign: 'right' }}>{s.d}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Audience" />
      </div>
    </Frame>
  );
}

function HF_R4B_D02() {
  return (
    <Frame id="D02" name="Persona portrait" purpose="A composite persona drawn from the data." target="AUDIENCE" span={6}>
      <div className="blk">
        <Eyebrow left="PERSONA · WRECK / TECH · 38%" right="COMPOSITE · N=4.7K" />
        <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14, paddingTop: 4 }}>
          <div style={{ width: 88, height: 88, background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}>
            <svg width="88" height="88" viewBox="0 0 88 88">
              {Array.from({ length: 18 }).map((_, i) => (
                <line key={i} x1={-20 + i * 8} y1="0" x2={20 + i * 8} y2="88" stroke="var(--border-default)" strokeWidth="1" />
              ))}
              <text x="44" y="50" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)" letterSpacing="0.06em">PERSONA</text>
            </svg>
          </div>
          <div>
            <div className="serif-it" style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--fg-primary)' }}>"Logbook Liam"</div>
            <p className="serif" style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--fg-secondary)' }}>Mid-thirties, 200+ logged dives, side-mount curious. Lurks more than comments. Saves long-form to watch on the boat. Buys gear once a year, researches for six weeks first.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
          <Stat label="MEDIAN AGE" val="34" />
          <Stat label="DIVES/YR" val="42" />
          <Stat label="SAVE-RATE" val="11.2x" accent />
          <Stat label="LTV TIER" val="A" />
        </div>
        <Footer openIn="Audience" extra={<FooterChip icon="pencil" label="Write to them" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_D03() {
  return (
    <Frame id="D03" name="Top-fan list" purpose="Highest-affinity followers." target="AUDIENCE" span={6}>
      <div className="blk">
        <Eyebrow left="TOP FANS · 30D" right="AFFINITY · SAVES + REPLIES" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { h: '@marina.k', m: '14 saves · 6 replies · 2 shares', s: 9.4 },
            { h: '@diveops_lt', m: '12 saves · 3 replies', s: 8.7 },
            { h: '@reefdrifter', m: '11 saves · 1 reply', s: 8.2 },
            { h: '@kelpwarden', m: '8 saves · 4 replies', s: 7.6 },
            { h: '@fin.&.gauge', m: '7 saves · 2 replies', s: 7.1 },
          ].map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 50px', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px dotted var(--border-subtle)' : 0, alignItems: 'center' }}>
              <span style={{ width: 22, height: 22, background: 'var(--surface-2)', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)' }}>{f.h}</div>
                <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{f.m}</div>
              </div>
              <span className="num" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 18, color: 'var(--accent-primary)', letterSpacing: '-0.02em', textAlign: 'right' }}>{f.s}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Audience" />
      </div>
    </Frame>
  );
}

function HF_R4B_D04() {
  return (
    <Frame id="D04" name="Geo strip" purpose="Top countries / cities — banded bar." target="PULSE" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · GEO · 30D" right="VIEWS" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[['US', 38], ['UK', 14], ['AU', 12], ['DE', 9], ['JP', 7], ['MX', 5], ['OTHER', 15]].map(([c, p], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', gap: 8, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-secondary)' }}>{c}</span>
              <div style={{ height: 4, background: 'var(--surface-2)' }}>
                <div style={{ height: '100%', width: `${p}%`, background: 'var(--accent-primary)', opacity: 0.3 + (i < 3 ? 0.7 : 0.4) }} />
              </div>
              <span className="num mono" style={{ fontSize: 10, color: 'var(--fg-tertiary)', textAlign: 'right' }}>{p}%</span>
            </div>
          ))}
        </div>
        <Footer openIn="Pulse" />
      </div>
    </Frame>
  );
}

function HF_R4B_D05() {
  return (
    <Frame id="D05" name="New-vs-returning" purpose="Cohort split for the period." target="AUDIENCE" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · NEW vs RETURN" right="30D · VIEWS" />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {[['NEW', 64, true], ['RETURN', 36, false]].map(([l, p, accent], i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
              <div className="num" style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.03em', color: accent ? 'var(--accent-primary)' : 'var(--fg-primary)', lineHeight: 0.9 }}>{p}%</div>
              <div style={{ width: '100%', height: 6, background: 'var(--surface-2)' }}>
                <div style={{ width: `${p}%`, height: '100%', background: accent ? 'var(--accent-primary)' : 'var(--fg-primary)' }} />
              </div>
              <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 600, letterSpacing: '0.06em' }}>{l}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Audience" />
      </div>
    </Frame>
  );
}

function HF_R4B_D06() {
  return (
    <Frame id="D06" name="Subscriber waterfall" purpose="Gains, losses, net for period." target="PULSE" span={4}>
      <div className="blk">
        <Eyebrow left="FIG · SUB CHANGE" right="30D" />
        <svg width="100%" height="100" viewBox="0 0 240 100">
          <line x1="0" y1="80" x2="240" y2="80" stroke="var(--border-default)" />
          <rect x="10" y="40" width="40" height="40" fill="var(--fg-tertiary)" opacity="0.6" />
          <text x="30" y="35" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)">START</text>
          <text x="30" y="68" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--fg-on-accent)">11.8K</text>
          <rect x="60" y="20" width="40" height="20" fill="var(--accent-primary)" />
          <text x="80" y="15" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--accent-primary)">+820</text>
          <rect x="110" y="40" width="40" height="6" fill="var(--tone-danger)" opacity="0.7" />
          <text x="130" y="58" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--tone-danger)">−212</text>
          <rect x="160" y="20" width="60" height="60" fill="var(--accent-primary)" opacity="0.85" />
          <text x="190" y="15" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--accent-primary)">END</text>
          <text x="190" y="56" textAnchor="middle" fontSize="13" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--fg-on-accent)">12.4K</text>
        </svg>
        <Footer openIn="Pulse" />
      </div>
    </Frame>
  );
}

function HF_R4B_D07() {
  return (
    <Frame id="D07" name="Audience overlap" purpose="Followers shared with peer accounts." target="INTEL" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · OVERLAP · 3 PEERS" right="N=12.4K" />
        <svg width="100%" height="160" viewBox="0 0 360 160">
          <circle cx="120" cy="80" r="60" fill="var(--accent-primary)" opacity="0.18" />
          <circle cx="180" cy="80" r="50" fill="var(--fg-primary)" opacity="0.10" />
          <circle cx="240" cy="80" r="44" fill="var(--fg-primary)" opacity="0.10" />
          <text x="100" y="50" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--accent-primary)">YOU</text>
          <text x="100" y="84" fontSize="14" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--accent-primary)">12.4K</text>
          <text x="180" y="32" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-secondary)">@diveops_lt</text>
          <text x="240" y="32" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-secondary)">@reefdrifter</text>
          <text x="155" y="86" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--fg-primary)">3.1K</text>
          <text x="210" y="86" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--fg-primary)">2.4K</text>
          <text x="245" y="86" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--fg-secondary)">1.1K</text>
        </svg>
        <Footer openIn="Intel" />
      </div>
    </Frame>
  );
}

function HF_R4B_D08() {
  return (
    <Frame id="D08" name="Comment-tone breakdown" purpose="Comments by sentiment / theme." target="INBOX" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · COMMENT TONE · 30D" right="N=812" />
        <div style={{ display: 'flex', height: 28, borderRadius: 0 }}>
          {[
            { l: 'CRAFT Qs', p: 38, c: 'var(--accent-primary)' },
            { l: 'PRAISE', p: 28, c: 'var(--fg-primary)' },
            { l: 'GEAR QS', p: 18, c: 'var(--fg-tertiary)' },
            { l: 'CRITIQUE', p: 10, c: 'var(--tone-warning)' },
            { l: 'OTHER', p: 6, c: 'var(--border-strong)' },
          ].map((s, i) => (
            <div key={i} style={{ width: `${s.p}%`, background: s.c, position: 'relative' }}>
              <span className="mono" style={{ position: 'absolute', top: -16, left: 0, fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{s.l}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, paddingTop: 18 }}>
          {[['CRAFT QS', '38%'], ['PRAISE', '28%'], ['GEAR QS', '18%'], ['CRITIQUE', '10%'], ['OTHER', '6%']].map(([l, v], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="mono num" style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>{v}</span>
              <span className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>{l}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Inbox" />
      </div>
    </Frame>
  );
}

const FAMILY_D_META = [
  { id: 'D01', name: 'Audience-segment card', purpose: 'Five segments by share, 30d.', target: 'AUDIENCE', span: 6, family: 'D', familyTitle: 'Audience', component: HF_R4B_D01 },
  { id: 'D02', name: 'Persona portrait', purpose: 'A composite persona drawn from the data.', target: 'AUDIENCE', span: 6, family: 'D', familyTitle: 'Audience', component: HF_R4B_D02 },
  { id: 'D03', name: 'Top-fan list', purpose: 'Highest-affinity followers.', target: 'AUDIENCE', span: 6, family: 'D', familyTitle: 'Audience', component: HF_R4B_D03 },
  { id: 'D04', name: 'Geo strip', purpose: 'Top countries / cities — banded bar.', target: 'PULSE', span: 4, family: 'D', familyTitle: 'Audience', component: HF_R4B_D04 },
  { id: 'D05', name: 'New-vs-returning', purpose: 'Cohort split for the period.', target: 'AUDIENCE', span: 4, family: 'D', familyTitle: 'Audience', component: HF_R4B_D05 },
  { id: 'D06', name: 'Subscriber waterfall', purpose: 'Gains, losses, net for period.', target: 'PULSE', span: 4, family: 'D', familyTitle: 'Audience', component: HF_R4B_D06 },
  { id: 'D07', name: 'Audience overlap', purpose: 'Followers shared with peer accounts.', target: 'INTEL', span: 6, family: 'D', familyTitle: 'Audience', component: HF_R4B_D07 },
  { id: 'D08', name: 'Comment-tone breakdown', purpose: 'Comments by sentiment / theme.', target: 'INBOX', span: 6, family: 'D', familyTitle: 'Audience', component: HF_R4B_D08 },
];
registerBlock('D01', FAMILY_D_META[0]);
registerBlock('D02', FAMILY_D_META[1]);
registerBlock('D03', FAMILY_D_META[2]);
registerBlock('D04', FAMILY_D_META[3]);
registerBlock('D05', FAMILY_D_META[4]);
registerBlock('D06', FAMILY_D_META[5]);
registerBlock('D07', FAMILY_D_META[6]);
registerBlock('D08', FAMILY_D_META[7]);
Object.assign(window, {
  HF_R4B_D01,
  HF_R4B_D02,
  HF_R4B_D03,
  HF_R4B_D04,
  HF_R4B_D05,
  HF_R4B_D06,
  HF_R4B_D07,
  HF_R4B_D08,
  FAMILY_D: { D01: HF_R4B_D01, D02: HF_R4B_D02, D03: HF_R4B_D03, D04: HF_R4B_D04, D05: HF_R4B_D05, D06: HF_R4B_D06, D07: HF_R4B_D07, D08: HF_R4B_D08 }
});


/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-E.jsx — Family E · Schedule. */

function HF_R4B_E01() {
  const cells = [['MON 5', 'FIJI EP.1', 'YT', true], ['TUE 6', '—', '', false], ['WED 7', 'GEAR Q&A', 'IG', false], ['THU 8', '—', '', false], ['FRI 9', 'WRECK CLIP', 'TT', false], ['SAT 10', '—', '', false], ['SUN 11', 'WK RECAP', 'NEWSLTR', false]];
  return (
    <Frame id="E01" name="Schedule block · week" purpose="A week's slate, channel-coded." target="CALENDAR" span={12}>
      <div className="blk">
        <Eyebrow left="SCHEDULE · WK 19" right="MAY 5–11 · 4 SLOTS" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid var(--fg-primary)', borderLeft: '1px solid var(--border-subtle)' }}>
          {cells.map(([d, t, ch, primary], i) => (
            <div key={i} style={{ borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', minHeight: 92, padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: primary ? 'var(--accent-soft)' : 'transparent' }}>
              <div className="mono" style={{ fontSize: 9, color: primary ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em' }}>{d}</div>
              {t === '—' ? (
                <div className="mono" style={{ fontSize: 22, color: 'var(--border-strong)', fontWeight: 200, textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>—</div>
              ) : (
                <div>
                  <div className="serif-it" style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.2, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>{t}</div>
                  <div className="mono" style={{ fontSize: 9, color: primary ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontWeight: 700, marginTop: 2, letterSpacing: '0.06em' }}>{ch}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Footer openIn="Calendar" extra={<FooterChip icon="plus" label="Add slot" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_E02() {
  return (
    <Frame id="E02" name="Best-time strip" purpose="When this segment opens the app." target="CALENDAR" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · BEST WINDOW · WRECK/TECH" right="LOCAL TIME · 30D" />
        <div style={{ position: 'relative', height: 64 }}>
          <svg width="100%" height="64" viewBox="0 0 480 64" preserveAspectRatio="none">
            <path d="M 0,55 Q 50,40 100,30 T 200,18 T 280,12 T 360,28 T 480,50" fill="var(--accent-soft)" stroke="var(--accent-primary)" strokeWidth="1.5" />
            <line x1="240" y1="0" x2="240" y2="64" stroke="var(--accent-primary)" strokeDasharray="2 2" />
            <text x="244" y="14" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--accent-primary)">19:30 PEAK</text>
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 4 }}>
          {['00', '06', '12', '18', '24'].map(h => <span key={h}>{h}h</span>)}
        </div>
        <Footer openIn="Calendar" extra={<FooterChip icon="play" label="Schedule for 19:30" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_E03() {
  return (
    <Frame id="E03" name="Single-slot card" purpose="One scheduled post, full detail." target="CALENDAR" span={6}>
      <div className="blk">
        <Eyebrow left="SLOT · WED 7 · 19:30" right="IG · STATUS: QUEUED" />
        <div className="serif-it" style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.025em', lineHeight: 1.05 }}>"Three checks I run on the bow railing"</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
          <Stat label="ETA" val="WED 19:30" sub="local · viewer-tz" />
          <Stat label="DURATION" val="0:54" sub="vertical · 9:16" />
          <Stat label="REACH EST." val="84K" sub="±12K" accent />
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, letterSpacing: '0.06em' }}>NO CONFLICT · 38H FROM PREV POST · ON-PILLAR</div>
        <Footer openIn="Calendar" extra={<FooterChip icon="retry" label="Reschedule" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_E04() {
  return (
    <Frame id="E04" name="Frequency curve" purpose="Posts per week over time, with target band." target="CALENDAR" span={6}>
      <div className="blk">
        <Eyebrow left="FIG · POSTING CADENCE · 12W" right="TARGET 3–5/WK" />
        <svg width="100%" height="80" viewBox="0 0 480 80">
          <rect x="0" y="20" width="480" height="32" fill="var(--accent-soft)" opacity="0.6" />
          <text x="6" y="32" fontSize="9" fontFamily="var(--font-mono)" fill="var(--accent-primary-press)" fontWeight="700">TARGET</text>
          {[3, 4, 4, 2, 5, 3, 4, 4, 6, 3, 2, 5].map((v, i) => {
            const x = 20 + i * 38;
            return <circle key={i} cx={x} cy={70 - v * 8} r={3.5} fill={v < 3 || v > 5 ? 'var(--tone-danger)' : 'var(--accent-primary)'} />;
          })}
          <path d={[3, 4, 4, 2, 5, 3, 4, 4, 6, 3, 2, 5].map((v, i) => `${i === 0 ? 'M' : 'L'} ${20 + i * 38},${70 - v * 8}`).join(' ')} fill="none" stroke="var(--accent-primary)" strokeWidth="1.25" />
        </svg>
        <Footer openIn="Calendar" />
      </div>
    </Frame>
  );
}

function HF_R4B_E05() {
  return (
    <Frame id="E05" name="Conflict / collision" purpose="Two posts too close — warning." target="CALENDAR" span={6}>
      <div className="blk" style={{ borderColor: 'var(--tone-warning)', background: 'var(--tone-warning-bg)' }}>
        <Eyebrow left="CONFLICT · WED 7" right="2H WINDOW" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center', padding: '8px 0' }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700 }}>17:00 · IG</div>
            <div className="serif-it" style={{ fontSize: 13.5, fontWeight: 600 }}>"Gear Q&A"</div>
          </div>
          <span className="mono" style={{ display: 'inline-flex', color: 'var(--tone-warning)' }}><Icon name="arrows-h" size={18} /></span>
          <div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700 }}>19:30 · IG</div>
            <div className="serif-it" style={{ fontSize: 13.5, fontWeight: 600 }}>"Three checks…"</div>
          </div>
        </div>
        <p className="serif-it" style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: 'var(--tone-warning)' }}>Two IG posts inside 2.5h. Median lift drops 18% when posts collide. Move one to Thu 19:30?</p>
        <Footer openIn="Calendar" extra={<FooterChip icon="arrow-right" label="Move to Thu" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_E06() {
  const months = Array.from({ length: 12 }).map((_, i) => i);
  return (
    <Frame id="E06" name="Year-at-a-glance" purpose="Annual posting density." target="CALENDAR" span={6}>
      <div className="blk">
        <Eyebrow left="YEAR · 2026 · TO DATE" right="142 POSTS · ON PACE" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4, paddingTop: 4 }}>
          {months.map(m => {
            const intensity = m < 4 ? 0.85 - m * 0.05 : m === 4 ? 0.95 : 0.15;
            const label = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][m];
            return (
              <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: 36, background: 'var(--accent-primary)', opacity: intensity }} />
                <span className="mono" style={{ fontSize: 9, color: m < 5 ? 'var(--fg-secondary)' : 'var(--fg-tertiary)', fontWeight: 700 }}>{label}</span>
              </div>
            );
          })}
        </div>
        <Footer openIn="Calendar" />
      </div>
    </Frame>
  );
}

function HF_R4B_E07() {
  return (
    <Frame id="E07" name="Series timeline" purpose="Multi-episode series across weeks." target="CALENDAR" span={12}>
      <div className="blk">
        <Eyebrow left="SERIES · TRUK LAGOON · 5 EPS" right="WK 19–23 · YT" />
        <div style={{ position: 'relative', padding: '20px 0 6px' }}>
          <div style={{ height: 1, background: 'var(--fg-primary)' }} />
          {[
            { x: 4, l: 'EP.1 · Bow railing', d: 'WED 5/7', cur: true },
            { x: 22, l: 'EP.2 · 28m and the silt-out', d: 'WED 5/14' },
            { x: 42, l: 'EP.3 · The torpedo room', d: 'WED 5/21' },
            { x: 62, l: 'EP.4 · What I almost did wrong', d: 'WED 5/28' },
            { x: 82, l: 'EP.5 · Walking back to the boat', d: 'WED 6/4' },
          ].map((e, i) => (
            <div key={i} style={{ position: 'absolute', left: `${e.x}%`, top: 14, transform: 'translateX(-50%)' }}>
              <div style={{ width: 1, height: 12, background: e.cur ? 'var(--accent-primary)' : 'var(--fg-primary)', margin: '0 auto' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.cur ? 'var(--accent-primary)' : 'var(--surface-1)', border: '1.5px solid', borderColor: e.cur ? 'var(--accent-primary)' : 'var(--fg-primary)', margin: '4px auto 0' }} />
              <div style={{ width: 140, marginLeft: -70, marginTop: 8, textAlign: 'center' }}>
                <div className="serif-it" style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.25, color: e.cur ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>{e.l}</div>
                <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', marginTop: 3, letterSpacing: '0.06em' }}>{e.d}</div>
              </div>
            </div>
          ))}
          <div style={{ height: 100 }} />
        </div>
        <Footer openIn="Calendar" />
      </div>
    </Frame>
  );
}

function HF_R4B_E08() {
  return (
    <Frame id="E08" name="Streak / cadence stat" purpose="Consecutive on-cadence weeks." target="CALENDAR" span={4}>
      <div className="blk">
        <Eyebrow left="STREAK · ON CADENCE" right="3-5/WK · 12W" />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0' }}>
          <span className="num" style={{ fontFamily: 'var(--font-serif)', fontSize: 64, fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 0.85, color: 'var(--accent-primary)' }}>11</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em' }}>WEEKS</span>
        </div>
        <div style={{ display: 'flex', gap: 3, paddingBottom: 4 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 14, height: 14, background: i === 4 ? 'transparent' : 'var(--accent-primary)', border: i === 4 ? '1px solid var(--border-default)' : 0, opacity: i === 4 ? 1 : 0.85 }} />
          ))}
        </div>
        <span className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>BREAK ON WK 14 · 1 POST · KIT FAILURE</span>
        <Footer openIn="Calendar" />
      </div>
    </Frame>
  );
}

const FAMILY_E_META = [
  { id: 'E01', name: 'Schedule block · week', purpose: "A week's slate, channel-coded.", target: 'CALENDAR', span: 12, family: 'E', familyTitle: 'Schedule', component: HF_R4B_E01 },
  { id: 'E02', name: 'Best-time strip', purpose: 'When this segment opens the app.', target: 'CALENDAR', span: 6, family: 'E', familyTitle: 'Schedule', component: HF_R4B_E02 },
  { id: 'E03', name: 'Single-slot card', purpose: 'One scheduled post, full detail.', target: 'CALENDAR', span: 6, family: 'E', familyTitle: 'Schedule', component: HF_R4B_E03 },
  { id: 'E04', name: 'Frequency curve', purpose: 'Posts per week over time, with target band.', target: 'CALENDAR', span: 6, family: 'E', familyTitle: 'Schedule', component: HF_R4B_E04 },
  { id: 'E05', name: 'Conflict / collision', purpose: 'Two posts too close — warning.', target: 'CALENDAR', span: 6, family: 'E', familyTitle: 'Schedule', component: HF_R4B_E05 },
  { id: 'E06', name: 'Year-at-a-glance', purpose: 'Annual posting density.', target: 'CALENDAR', span: 6, family: 'E', familyTitle: 'Schedule', component: HF_R4B_E06 },
  { id: 'E07', name: 'Series timeline', purpose: 'Multi-episode series across weeks.', target: 'CALENDAR', span: 12, family: 'E', familyTitle: 'Schedule', component: HF_R4B_E07 },
  { id: 'E08', name: 'Streak / cadence stat', purpose: 'Consecutive on-cadence weeks.', target: 'CALENDAR', span: 4, family: 'E', familyTitle: 'Schedule', component: HF_R4B_E08 },
];
registerBlock('E01', FAMILY_E_META[0]);
registerBlock('E02', FAMILY_E_META[1]);
registerBlock('E03', FAMILY_E_META[2]);
registerBlock('E04', FAMILY_E_META[3]);
registerBlock('E05', FAMILY_E_META[4]);
registerBlock('E06', FAMILY_E_META[5]);
registerBlock('E07', FAMILY_E_META[6]);
registerBlock('E08', FAMILY_E_META[7]);
Object.assign(window, {
  HF_R4B_E01,
  HF_R4B_E02,
  HF_R4B_E03,
  HF_R4B_E04,
  HF_R4B_E05,
  HF_R4B_E06,
  HF_R4B_E07,
  HF_R4B_E08,
  FAMILY_E: { E01: HF_R4B_E01, E02: HF_R4B_E02, E03: HF_R4B_E03, E04: HF_R4B_E04, E05: HF_R4B_E05, E06: HF_R4B_E06, E07: HF_R4B_E07, E08: HF_R4B_E08 }
});


/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-F.jsx — Family F · Hook tests. */

function HF_R4B_F01() {
  return (
    <Frame id="F01" name="A/B test card" purpose="Two variants live, current leader called." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="A/B · OPENER · IG STORY · 0046" right="LIVE · 14H IN · N=4.2K" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {[
            { l: 'A', copy: 'Ninety seconds underwater.', stop: 14, lead: true },
            { l: 'B', copy: 'My buddy almost killed me.', stop: 22, lead: false },
          ].map((v, i) => (
            <div key={i} style={{ padding: 12, borderRight: i === 0 ? '1px solid var(--border-subtle)' : 0, background: v.lead ? 'var(--accent-soft)' : 'transparent' }}>
              <div className="mono" style={{ fontSize: 10, fontWeight: 700, color: v.lead ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', letterSpacing: '0.08em' }}>VARIANT {v.l} {v.lead && '· LEAD'}</div>
              <div className="serif-it" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, marginTop: 6 }}>"{v.copy}"</div>
              <div className="num" style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.03em', marginTop: 6, color: v.lead ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>{v.stop}%</div>
              <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 600, letterSpacing: '0.06em' }}>STOP · LOWER IS BETTER</span>
            </div>
          ))}
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, letterSpacing: '0.06em' }}>POSTERIOR P(B beats A) = 88% · CALL AT 24H</div>
        <Footer openIn="Studio" extra={<FooterChip icon="check" label="Call B" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_F02() {
  return (
    <Frame id="F02" name="Hook predictor" purpose="Score a single hook on three axes." target="STUDIO" span={4}>
      <div className="blk">
        <Eyebrow left="PREDICT · ONE HOOK" right="VOICE-MATCHED" />
        <div className="serif-it" style={{ fontSize: 13.5, lineHeight: 1.4, padding: '4px 0' }}>"You have ninety seconds underwater. Don't waste the first eight."</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
          {[['STOP-RATE', 88], ['VOICE-FIT', 92], ['NOVELTY', 64]].map(([l, v], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 30px', gap: 8, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em' }}>{l}</span>
              <div style={{ height: 4, background: 'var(--surface-2)' }}>
                <div style={{ height: '100%', width: `${v}%`, background: 'var(--accent-primary)' }} />
              </div>
              <span className="mono num" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_F03() {
  return (
    <Frame id="F03" name="Cliffhanger / hold map" purpose="Where viewers paused / re-watched." target="STUDIO" span={8}>
      <div className="blk">
        <Eyebrow left="FIG · HOLD MAP · 0046 · 12:42" right="N=21K SESSIONS" />
        <svg width="100%" height="80" viewBox="0 0 720 80" preserveAspectRatio="none">
          {Array.from({ length: 60 }).map((_, i) => {
            const raw = 0.3 + 0.3 * Math.sin(i * 0.4) + (i === 18 ? 0.5 : 0) + (i === 38 ? 0.4 : 0) - (i > 50 ? 0.2 : 0);
            const v = Math.max(0.02, Math.min(1, raw));
            return <rect key={i} x={i * 12} y={80 - v * 70} width="10" height={v * 70} fill={i === 18 ? 'var(--accent-primary)' : 'var(--fg-primary)'} opacity={i === 18 ? 1 : 0.5} />;
          })}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 4 }}>
          <span>0:00</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>up 3:42 PEAK · "the buddy check"</span>
          <span>12:42</span>
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_F04() {
  return (
    <Frame id="F04" name="Experiment log" purpose="A running log of A/B tests." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="EXPERIMENT LOG · YTD" right="14 TESTS · 9 WINS" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { id: 'EXP-014', t: 'Cold-open vs narrated', s: 'COLD WON', d: '+14pp watch', accent: true },
            { id: 'EXP-013', t: 'Title length 40 vs 60', s: '60 WON', d: '+8% CTR', accent: true },
            { id: 'EXP-012', t: 'Music bed vs ambient', s: 'INCONCLUSIVE', d: 'p=0.41' },
            { id: 'EXP-011', t: 'Caption: question vs claim', s: 'QUESTION WON', d: '+22% saves', accent: true },
            { id: 'EXP-010', t: 'Vertical vs landscape (IG)', s: '9:16 LOST', d: '−6% reach' },
          ].map((e, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 100px 80px', gap: 8, padding: '8px 0', borderBottom: i < 4 ? '1px dotted var(--border-subtle)' : 0, alignItems: 'baseline' }}>
              <span className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em' }}>{e.id}</span>
              <span className="serif-it" style={{ fontSize: 13, fontWeight: 500 }}>{e.t}</span>
              <span className="mono" style={{ fontSize: 9, fontWeight: 700, color: e.accent ? 'var(--accent-primary)' : 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>{e.s}</span>
              <span className="mono num" style={{ fontSize: 10, color: e.accent ? 'var(--accent-primary)' : 'var(--fg-tertiary)', textAlign: 'right' }}>{e.d}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_F05() {
  return (
    <Frame id="F05" name="Stop-rate forecast" purpose="Predicted stop curve for a hook." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="FORECAST · STOP-RATE · 0–8s" right="PRED · 50/95 BAND" />
        <svg width="100%" height="120" viewBox="0 0 480 120">
          <line x1="0" y1="100" x2="480" y2="100" stroke="var(--border-subtle)" />
          <path d="M 0,100 L 60,80 L 120,55 L 180,32 L 240,18 L 300,10 L 360,8 L 420,8 L 480,8 L 480,30 L 420,28 L 360,28 L 300,30 L 240,38 L 180,52 L 120,72 L 60,90 L 0,100 Z" fill="var(--accent-soft)" opacity="0.6" />
          <path d="M 0,100 L 60,85 L 120,62 L 180,42 L 240,28 L 300,18 L 360,18 L 420,16 L 480,16" fill="none" stroke="var(--accent-primary)" strokeWidth="1.75" />
          <text x="6" y="14" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--accent-primary)">+98% HOLD</text>
          <text x="6" y="116" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)">0%</text>
          <text x="474" y="116" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)" textAnchor="end">8s</text>
        </svg>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_F06() {
  return (
    <Frame id="F06" name="Test power calculator" purpose="Sample size needed to call a winner." target="STUDIO" span={4}>
      <div className="blk">
        <Eyebrow left="POWER · A/B SIZER" right="α=0.05 · 1−β=0.8" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingBottom: 6 }}>
          <Stat label="MDE" val="3pp" sub="min detectable effect" />
          <Stat label="N PER ARM" val="4,200" accent />
        </div>
        <Hairline />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 6 }}>
          <Stat label="TIME TO CALL" val="≈ 36h" sub="at this reach" />
          <Stat label="RECENT REACH" val="2.8K/h" sub="median, IG" />
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

const FAMILY_F_META = [
  { id: 'F01', name: 'A/B test card', purpose: 'Two variants live, current leader called.', target: 'STUDIO', span: 6, family: 'F', familyTitle: 'Hook tests', component: HF_R4B_F01 },
  { id: 'F02', name: 'Hook predictor', purpose: 'Score a single hook on three axes.', target: 'STUDIO', span: 4, family: 'F', familyTitle: 'Hook tests', component: HF_R4B_F02 },
  { id: 'F03', name: 'Cliffhanger / hold map', purpose: 'Where viewers paused / re-watched.', target: 'STUDIO', span: 8, family: 'F', familyTitle: 'Hook tests', component: HF_R4B_F03 },
  { id: 'F04', name: 'Experiment log', purpose: 'A running log of A/B tests.', target: 'STUDIO', span: 6, family: 'F', familyTitle: 'Hook tests', component: HF_R4B_F04 },
  { id: 'F05', name: 'Stop-rate forecast', purpose: 'Predicted stop curve for a hook.', target: 'STUDIO', span: 6, family: 'F', familyTitle: 'Hook tests', component: HF_R4B_F05 },
  { id: 'F06', name: 'Test power calculator', purpose: 'Sample size needed to call a winner.', target: 'STUDIO', span: 4, family: 'F', familyTitle: 'Hook tests', component: HF_R4B_F06 },
];
registerBlock('F01', FAMILY_F_META[0]);
registerBlock('F02', FAMILY_F_META[1]);
registerBlock('F03', FAMILY_F_META[2]);
registerBlock('F04', FAMILY_F_META[3]);
registerBlock('F05', FAMILY_F_META[4]);
registerBlock('F06', FAMILY_F_META[5]);
Object.assign(window, {
  HF_R4B_F01,
  HF_R4B_F02,
  HF_R4B_F03,
  HF_R4B_F04,
  HF_R4B_F05,
  HF_R4B_F06,
  FAMILY_F: { F01: HF_R4B_F01, F02: HF_R4B_F02, F03: HF_R4B_F03, F04: HF_R4B_F04, F05: HF_R4B_F05, F06: HF_R4B_F06 }
});


/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-G.jsx — Family G · Voice. */

function HF_R4B_G01() {
  return (
    <Frame id="G01" name="Voice DNA card" purpose="The voice profile, in five dimensions." target="MEMORY" span={6}>
      <div className="blk">
        <Eyebrow left="VOICE DNA · @henry.dives" right="LEARNED FROM 142 POSTS" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['CADENCE', 'Plainspoken', 0.78],
            ['LENS', 'Own-failure', 0.82],
            ['DENSITY', 'Spare', 0.66],
            ['HUMOR', 'Dry', 0.54],
            ['STAKES', 'Personal', 0.74],
          ].map(([l, v, p], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 100px 1fr', gap: 10, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em' }}>{l}</span>
              <span className="serif-it" style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)' }}>{v}</span>
              <div style={{ height: 4, background: 'var(--surface-2)' }}>
                <div style={{ height: '100%', width: `${p * 100}%`, background: 'var(--accent-primary)' }} />
              </div>
            </div>
          ))}
        </div>
        <Footer openIn="Memory" extra={<FooterChip icon="pencil" label="Edit DNA" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_G02() {
  return (
    <Frame id="G02" name="Forbidden-words list" purpose="Words the voice does not use." target="MEMORY" span={6}>
      <div className="blk">
        <Eyebrow left="FORBIDDEN · NEVER WRITE" right="14 ENTRIES" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
          {['epic', 'literally', 'game-changer', 'dive into', 'unleash', 'guys', 'crazy', 'low-key', 'absolutely', 'level up', 'underrated', 'iconic', 'no cap', 'world-class'].map(w => (
            <span key={w} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)', textDecoration: 'line-through' }}>
              {w}
            </span>
          ))}
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, marginTop: 6, letterSpacing: '0.06em' }}>FROM 04 EXPLICIT EDITS · 10 INFERRED FROM ABSENCE</div>
        <Footer openIn="Memory" extra={<FooterChip icon="plus" label="Add" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_G03() {
  return (
    <Frame id="G03" name="Voice memory · pinned" purpose="A single memory written by the user." target="MEMORY" span={6}>
      <div className="blk">
        <Eyebrow left="MEMORY · M08 · PINNED" right="USED IN 38 PROMPTS" />
        <p className="serif-it" style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: 'var(--fg-primary)', fontWeight: 500, letterSpacing: '-0.005em', borderLeft: '2px solid var(--accent-primary)', paddingLeft: 12 }}>
          "If a hook would fit on a t-shirt, cut it. My audience came for craft, not posters."
        </p>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, letterSpacing: '0.06em' }}>HENRY · 2026-04-12 · APPLIES TO HOOKS, TITLES</div>
        <Footer openIn="Memory" extra={<FooterChip icon="pin" label="Pinned" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_G04() {
  return (
    <Frame id="G04" name="Style sample" purpose="Five lines that feel like the voice." target="MEMORY" span={6}>
      <div className="blk">
        <Eyebrow left="STYLE · 5 EXAMPLES" right="LIKED · LIBRARY" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            'I have been doing buddy checks wrong for twelve years.',
            'The current showed up. I had nothing planned for that.',
            'Ninety seconds. Eight breaths. One thing you forgot.',
            'My instructor said this once and I have not stopped saying it.',
            'You can rebuild the kit. You cannot rebuild the dive.',
          ].map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 14px', gap: 8, padding: '8px 0', borderBottom: i < 4 ? '1px dotted var(--border-subtle)' : 0, alignItems: 'baseline' }}>
              <span className="mono num" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700 }}>0{i + 1}</span>
              <span className="serif-it" style={{ fontSize: 13.5, lineHeight: 1.4, color: 'var(--fg-primary)' }}>"{s}"</span>
              <span className="mono" style={{ display: 'inline-flex', color: 'var(--accent-primary)' }}><Icon name="star" size={11} /></span>
            </div>
          ))}
        </div>
        <Footer openIn="Memory" />
      </div>
    </Frame>
  );
}

function HF_R4B_G05() {
  return (
    <Frame id="G05" name="Tone-axis dial" purpose="Adjust tone for one draft." target="STUDIO" span={4}>
      <div className="blk">
        <Eyebrow left="TONE DIAL · DRAFT · FIJI EP.1" right="LIVE PREVIEW" />
        {[
          ['WARM', 'COOL', 0.62],
          ['SHORT', 'LONG', 0.32],
          ['DRY', 'WRY', 0.48],
          ['CLOSE', 'BROAD', 0.40],
        ].map(([l, r, v], i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 50px', gap: 8, alignItems: 'center', padding: '6px 0' }}>
            <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em' }}>{l}</span>
            <div style={{ position: 'relative', height: 8 }}>
              <div style={{ position: 'absolute', top: 4, left: 0, right: 0, height: 1, background: 'var(--border-default)' }} />
              <div style={{ position: 'absolute', top: 0, left: `${v * 100}%`, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)', transform: 'translateX(-50%)' }} />
            </div>
            <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em', textAlign: 'right' }}>{r}</span>
          </div>
        ))}
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_G06() {
  return (
    <Frame id="G06" name="Brand-fact card" purpose="A locked fact: pricing, name, partner, etc." target="MEMORY" span={4}>
      <div className="blk">
        <Eyebrow left="BRAND FACT · F-04 · LOCKED" right="USED IN 12 PROMPTS" />
        <div style={{ paddingTop: 4 }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em' }}>WORKSHOP · CALL IT</span>
          <div className="serif-it" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05, marginTop: 4, color: 'var(--accent-primary)' }}>"Three-Check Sundays"</div>
          <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', marginTop: 6, letterSpacing: '0.06em' }}>NEVER "DIVE SAFETY SUNDAYS" · NEVER "TCS"</div>
        </div>
        <Footer openIn="Memory" />
      </div>
    </Frame>
  );
}

const FAMILY_G_META = [
  { id: 'G01', name: 'Voice DNA card', purpose: 'The voice profile, in five dimensions.', target: 'MEMORY', span: 6, family: 'G', familyTitle: 'Voice', component: HF_R4B_G01 },
  { id: 'G02', name: 'Forbidden-words list', purpose: 'Words the voice does not use.', target: 'MEMORY', span: 6, family: 'G', familyTitle: 'Voice', component: HF_R4B_G02 },
  { id: 'G03', name: 'Voice memory · pinned', purpose: 'A single memory written by the user.', target: 'MEMORY', span: 6, family: 'G', familyTitle: 'Voice', component: HF_R4B_G03 },
  { id: 'G04', name: 'Style sample', purpose: 'Five lines that feel like the voice.', target: 'MEMORY', span: 6, family: 'G', familyTitle: 'Voice', component: HF_R4B_G04 },
  { id: 'G05', name: 'Tone-axis dial', purpose: 'Adjust tone for one draft.', target: 'STUDIO', span: 4, family: 'G', familyTitle: 'Voice', component: HF_R4B_G05 },
  { id: 'G06', name: 'Brand-fact card', purpose: 'A locked fact: pricing, name, partner, etc.', target: 'MEMORY', span: 4, family: 'G', familyTitle: 'Voice', component: HF_R4B_G06 },
];
registerBlock('G01', FAMILY_G_META[0]);
registerBlock('G02', FAMILY_G_META[1]);
registerBlock('G03', FAMILY_G_META[2]);
registerBlock('G04', FAMILY_G_META[3]);
registerBlock('G05', FAMILY_G_META[4]);
registerBlock('G06', FAMILY_G_META[5]);
Object.assign(window, {
  HF_R4B_G01,
  HF_R4B_G02,
  HF_R4B_G03,
  HF_R4B_G04,
  HF_R4B_G05,
  HF_R4B_G06,
  FAMILY_G: { G01: HF_R4B_G01, G02: HF_R4B_G02, G03: HF_R4B_G03, G04: HF_R4B_G04, G05: HF_R4B_G05, G06: HF_R4B_G06 }
});
