/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-K.jsx — Family K · Library. */

function HF_R4B_K01() {
  return (
    <Frame id="K01" name="Library hit · single post" purpose="One post pulled from the library." target="LIBRARY" span={6}>
      <div className="blk">
        <Eyebrow left="POST · 0042 · PINNED" right="YT · 421K · 14 MO AGO" />
        <div className="serif-it" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05 }}>"My first wreck — and what I got wrong"</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 4 }}>
          <Stat label="VIEWS" val="421K" />
          <Stat label="WATCH%" val="71%" accent />
          <Stat label="SAVES" val="12.4K" />
          <Stat label="ECHOES" val="38" sub="other posts cite this" />
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, letterSpacing: '0.06em' }}>TOP 4% · OWN-FAILURE FRAME · TEMPLATE FOR EP.1</div>
        <Footer openIn="Library" extra={<FooterChip icon="arrow-up-right" label="Open post" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_K02() {
  return (
    <Frame id="K02" name="Pattern card" purpose="A recurring structural pattern in your work." target="LIBRARY" span={6}>
      <div className="blk">
        <Eyebrow left="PATTERN · OWN-FAILURE OPEN" right="14 INSTANCES · LIBRARY" />
        <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>"Confession to correction to recipe"</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 12px 1fr 12px 1fr', gap: 0, alignItems: 'center', padding: '6px 0' }}>
          {[
            ['CONFESSION', '"I was wrong about X"'],
            ['CORRECTION', '"Here\'s what I do now"'],
            ['RECIPE', '"Three steps you can copy"'],
          ].flatMap((stage, i) => [
            <div key={`s${i}`} style={{ padding: 10, background: 'var(--surface-2)', borderRadius: 4 }}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.08em' }}>{stage[0]}</div>
              <div className="serif-it" style={{ fontSize: 12, marginTop: 4, color: 'var(--fg-secondary)' }}>{stage[1]}</div>
            </div>,
            i < 2 ? <span key={`a${i}`} className="mono" style={{ textAlign: 'center', color: 'var(--fg-tertiary)', fontSize: 14 }}>to</span> : null,
          ]).filter(Boolean)}
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--accent-primary)', letterSpacing: '0.06em', fontWeight: 700 }}>AVG WATCH% 64% · 11pp ABOVE LIBRARY MEAN</div>
        <Footer openIn="Library" />
      </div>
    </Frame>
  );
}

function HF_R4B_K03() {
  return (
    <Frame id="K03" name="Series strip" purpose="A multi-post series, ordered." target="LIBRARY" span={6}>
      <div className="blk">
        <Eyebrow left="SERIES · COLD-OPEN SAFETY · 6 POSTS" right="YTD" />
        <div style={{ display: 'flex', gap: 6, padding: '4px 0' }}>
          {[
            { id: '0046', live: true },
            { id: '0042', live: false },
            { id: '0038', live: false },
            { id: '0031', live: false },
            { id: '0024', live: false },
            { id: '0019', live: false },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, padding: 8, background: p.live ? 'var(--accent-soft)' : 'var(--surface-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span className="mono" style={{ fontSize: 9, color: p.live ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em' }}>{p.id}</span>
              <span className="num" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 18, color: p.live ? 'var(--accent-primary)' : 'var(--fg-primary)', letterSpacing: '-0.025em' }}>{[71, 68, 62, 64, 58, 54][i]}%</span>
              <span className="mono" style={{ fontSize: 8, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>WATCH</span>
            </div>
          ))}
        </div>
        <Footer openIn="Library" />
      </div>
    </Frame>
  );
}

function HF_R4B_K04() {
  return (
    <Frame id="K04" name="Library facet filter" purpose="Library result count, faceted." target="LIBRARY" span={6}>
      <div className="blk">
        <Eyebrow left="FILTER · 38 / 404 · MATCH" right="PILLAR=SAFETY · WATCH≥60%" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            { l: 'PILLAR · SAFETY', n: 142, on: true },
            { l: 'WATCH ≥ 60%', n: 86, on: true },
            { l: 'YT ONLY', n: 218, on: false },
            { l: 'OWN-FAILURE', n: 38, on: true },
            { l: 'AFTER 2025', n: 142, on: false },
          ].map((f, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)', background: f.on ? 'var(--accent-primary)' : 'var(--surface-2)', color: f.on ? 'var(--fg-on-accent)' : 'var(--fg-secondary)', border: f.on ? 0 : '1px solid var(--border-default)' }}>
              {f.l} · {f.n}{f.on && ' failed'}
            </span>
          ))}
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, letterSpacing: '0.06em' }}>38 POSTS MATCH · MEDIAN VIEWS 142K · MEDIAN WATCH 64%</div>
        <Footer openIn="Library" />
      </div>
    </Frame>
  );
}

function HF_R4B_K05() {
  return (
    <Frame id="K05" name="Quote / pull" purpose="A line lifted from a past post." target="LIBRARY" span={6}>
      <div className="blk">
        <Eyebrow left="QUOTE · POST 0042 · 03:14" right="LIFTED · USED 6x" />
        <div style={{ position: 'relative', padding: '10px 0' }}>
          <span style={{ position: 'absolute', top: -8, left: -4, fontFamily: 'var(--font-serif)', fontSize: 80, fontStyle: 'italic', fontWeight: 600, color: 'var(--accent-primary)', opacity: 0.18, lineHeight: 1, letterSpacing: '-0.04em' }}>"</span>
          <p className="serif-it" style={{ margin: 0, fontSize: 22, fontWeight: 500, lineHeight: 1.35, letterSpacing: '-0.015em', color: 'var(--fg-primary)', paddingLeft: 24 }}>I have been doing buddy checks wrong for twelve years.</p>
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, letterSpacing: '0.06em' }}>BECAME THE THESIS FOR 0046 · ECHOED IN 5 OTHERS</div>
        <Footer openIn="Library" />
      </div>
    </Frame>
  );
}

const FAMILY_K_META = [
  { id: 'K01', name: 'Library hit · single post', purpose: 'One post pulled from the library.', target: 'LIBRARY', span: 6, family: 'K', familyTitle: 'Library', component: HF_R4B_K01 },
  { id: 'K02', name: 'Pattern card', purpose: 'A recurring structural pattern in your work.', target: 'LIBRARY', span: 6, family: 'K', familyTitle: 'Library', component: HF_R4B_K02 },
  { id: 'K03', name: 'Series strip', purpose: 'A multi-post series, ordered.', target: 'LIBRARY', span: 6, family: 'K', familyTitle: 'Library', component: HF_R4B_K03 },
  { id: 'K04', name: 'Library facet filter', purpose: 'Library result count, faceted.', target: 'LIBRARY', span: 6, family: 'K', familyTitle: 'Library', component: HF_R4B_K04 },
  { id: 'K05', name: 'Quote / pull', purpose: 'A line lifted from a past post.', target: 'LIBRARY', span: 6, family: 'K', familyTitle: 'Library', component: HF_R4B_K05 },
];
registerBlock('K01', FAMILY_K_META[0]);
registerBlock('K02', FAMILY_K_META[1]);
registerBlock('K03', FAMILY_K_META[2]);
registerBlock('K04', FAMILY_K_META[3]);
registerBlock('K05', FAMILY_K_META[4]);
Object.assign(window, {
  HF_R4B_K01,
  HF_R4B_K02,
  HF_R4B_K03,
  HF_R4B_K04,
  HF_R4B_K05,
  FAMILY_K: { K01: HF_R4B_K01, K02: HF_R4B_K02, K03: HF_R4B_K03, K04: HF_R4B_K04, K05: HF_R4B_K05 }
});


/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-L.jsx — Family L · System. */

function HF_R4B_L01() {
  return (
    <Frame id="L01" name="Decision card" purpose="A choice with options + recommendation." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="DECISION · POST 0046 · LAUNCH WINDOW" right="3 OPTIONS · 1 PICK" />
        <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.25 }}>When should this go live?</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { l: 'WED 19:30', d: 'Best window for wreck/tech segment', rec: true },
            { l: 'THU 17:00', d: 'Avoids Marina\'s post collision' },
            { l: 'SUN 08:00', d: 'New audience, lower lift, lower risk' },
          ].map((o, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '14px 100px 1fr 60px', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px dotted var(--border-subtle)' : 0, alignItems: 'center' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid', borderColor: o.rec ? 'var(--accent-primary)' : 'var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {o.rec && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />}
              </span>
              <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: o.rec ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>{o.l}</span>
              <span className="serif" style={{ fontSize: 12.5, color: 'var(--fg-secondary)' }}>{o.d}</span>
              {o.rec && <span className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.06em', textAlign: 'right' }}>PICK</span>}
            </div>
          ))}
        </div>
        <Footer openIn="Studio" extra={<FooterChip icon="check" label="Lock window" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_L02() {
  return (
    <Frame id="L02" name="Risk / forecast band" purpose="Forecasted reach with a confidence band." target="STUDIO" span={6}>
      <div className="blk">
        <Eyebrow left="FORECAST · 7-DAY REACH" right="POST 0046 · 50/95 BAND" />
        <svg width="100%" height="100" viewBox="0 0 480 100">
          <line x1="0" y1="80" x2="480" y2="80" stroke="var(--border-subtle)" />
          <path d="M 0,80 L 60,72 L 120,58 L 180,42 L 240,32 L 300,28 L 360,26 L 420,26 L 480,28 L 480,42 L 420,40 L 360,40 L 300,44 L 240,52 L 180,60 L 120,72 L 60,80 L 0,80 Z" fill="var(--accent-soft)" opacity="0.7" />
          <path d="M 0,80 L 60,76 L 120,64 L 180,50 L 240,40 L 300,34 L 360,32 L 420,32 L 480,34" fill="none" stroke="var(--accent-primary)" strokeWidth="1.75" />
          <text x="6" y="14" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--accent-primary)">PRED 84K · ±12K</text>
          <text x="474" y="14" fontSize="9" fontFamily="var(--font-mono)" fill="var(--fg-tertiary)" textAnchor="end">DAY 7</text>
        </svg>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_L03() {
  return (
    <Frame id="L03" name="Cost / token meter" purpose="Run cost for this thread." target="SETTINGS" span={4}>
      <div className="blk">
        <Eyebrow left="THREAD COST · TODAY" right="SONNET · DEEP" />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="num" style={{ fontFamily: 'var(--font-serif)', fontSize: 40, fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.035em', lineHeight: 0.9, color: 'var(--accent-primary)' }}>$0.42</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em' }}>OF $20.00 PLAN</span>
        </div>
        <div style={{ height: 6, background: 'var(--surface-2)', marginTop: 4 }}>
          <div style={{ height: '100%', width: '21%', background: 'var(--accent-primary)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', paddingTop: 4, letterSpacing: '0.06em' }}>
          <span>14 TURNS</span><span>38K TOK IN</span><span>12K OUT</span>
        </div>
        <Footer openIn="Settings" />
      </div>
    </Frame>
  );
}

function HF_R4B_L04() {
  return (
    <Frame id="L04" name="Empty state" purpose="A friendly vacuum, with one suggestion." target="ANYWHERE" span={4}>
      <div className="blk" style={{ alignItems: 'center', textAlign: 'center', padding: '28px 16px' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <span className="mono" style={{ fontSize: 14, color: 'var(--fg-tertiary)' }}>·</span>
        </div>
        <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>Nothing here yet.</div>
        <p className="serif-it" style={{ margin: '4px 0 12px', fontSize: 13, color: 'var(--fg-secondary)' }}>Try asking why your last post drifted.</p>
        <FooterChip icon="star" label="Why did 0041 lose people at 0:03?" accent />
      </div>
    </Frame>
  );
}

function HF_R4B_L05() {
  return (
    <Frame id="L05" name="Tool-run errored" purpose="A failure with a recovery path." target="STUDIO" span={4}>
      <div className="blk" style={{ borderColor: 'var(--tone-warning)', background: 'var(--tone-warning-bg)' }}>
        <Eyebrow left="FAILED · YT INDEX" right="LAST OK · 4H AGO" />
        <p className="serif-it" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: 'var(--tone-warning)' }}>Couldn't reach the YouTube index. Retry, or narrow the scope to a single channel.</p>
        <div style={{ display: 'flex', gap: 6, paddingTop: 6 }}>
          <FooterChip icon="retry" label="Retry" />
          <FooterChip icon="box-x" label="Narrow scope" />
        </div>
        <Footer openIn="Studio" />
      </div>
    </Frame>
  );
}

function HF_R4B_L06() {
  return (
    <Frame id="L06" name="Caveat / disclosure" purpose="What COOPR was/wasn't reading for this answer." target="ANYWHERE" span={6}>
      <div className="blk">
        <Eyebrow left="CAVEAT · WHAT THIS USED" right="THREAD T-2026-0429-Q14" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ padding: 10, borderRight: '1px solid var(--border-subtle)' }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>READ FROM</div>
            <ul className="serif" style={{ margin: 0, padding: '0 0 0 14px', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
              <li>Library · 404 posts</li>
              <li>Insights · 30d window</li>
              <li>Voice memory M01–M14</li>
            </ul>
          </div>
          <div style={{ padding: 10 }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>NOT READ</div>
            <ul className="serif" style={{ margin: 0, padding: '0 0 0 14px', fontSize: 12.5, color: 'var(--fg-tertiary)', lineHeight: 1.5, fontStyle: 'italic' }}>
              <li>DMs (off by default)</li>
              <li>Drive (not connected)</li>
              <li>Posts older than 18 mo</li>
            </ul>
          </div>
        </div>
        <Footer openIn="Anywhere" />
      </div>
    </Frame>
  );
}

const FAMILY_L_META = [
  { id: 'L01', name: 'Decision card', purpose: 'A choice with options + recommendation.', target: 'STUDIO', span: 6, family: 'L', familyTitle: 'System', component: HF_R4B_L01 },
  { id: 'L02', name: 'Risk / forecast band', purpose: 'Forecasted reach with a confidence band.', target: 'STUDIO', span: 6, family: 'L', familyTitle: 'System', component: HF_R4B_L02 },
  { id: 'L03', name: 'Cost / token meter', purpose: 'Run cost for this thread.', target: 'SETTINGS', span: 4, family: 'L', familyTitle: 'System', component: HF_R4B_L03 },
  { id: 'L04', name: 'Empty state', purpose: 'A friendly vacuum, with one suggestion.', target: 'ANYWHERE', span: 4, family: 'L', familyTitle: 'System', component: HF_R4B_L04 },
  { id: 'L05', name: 'Tool-run errored', purpose: 'A failure with a recovery path.', target: 'STUDIO', span: 4, family: 'L', familyTitle: 'System', component: HF_R4B_L05 },
  { id: 'L06', name: 'Caveat / disclosure', purpose: "What COOPR was/wasn't reading for this answer.", target: 'ANYWHERE', span: 6, family: 'L', familyTitle: 'System', component: HF_R4B_L06 },
];
registerBlock('L01', FAMILY_L_META[0]);
registerBlock('L02', FAMILY_L_META[1]);
registerBlock('L03', FAMILY_L_META[2]);
registerBlock('L04', FAMILY_L_META[3]);
registerBlock('L05', FAMILY_L_META[4]);
registerBlock('L06', FAMILY_L_META[5]);
Object.assign(window, {
  HF_R4B_L01,
  HF_R4B_L02,
  HF_R4B_L03,
  HF_R4B_L04,
  HF_R4B_L05,
  HF_R4B_L06,
  FAMILY_L: { L01: HF_R4B_L01, L02: HF_R4B_L02, L03: HF_R4B_L03, L04: HF_R4B_L04, L05: HF_R4B_L05, L06: HF_R4B_L06 }
});
