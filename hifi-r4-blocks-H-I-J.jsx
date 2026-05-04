/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-H.jsx — Family H · Inbox. */

function HF_R4B_H01() {
  return (
    <Frame id="H01" name="Inbox digest" purpose="Today's reply queue, triaged." target="INBOX" span={6}>
      <div className="blk">
        <Eyebrow left="INBOX · TODAY · TRIAGED" right="38 UNREAD · 6 NEED YOU" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { who: '@marina.k', t: '"Asked Henry about safety storytelling…"', tag: 'CRAFT Q', accent: true },
            { who: '@diveops_lt', t: '"Which reg do you run on cold dives?"', tag: 'GEAR Q' },
            { who: '@reefdrifter', t: '"Tried the three-check on Sat. Game changer—"', tag: 'PRAISE' },
            { who: '@kelpwarden', t: '"Disagree with check 2, here is why…"', tag: 'CRITIQUE', accent: true },
          ].map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '12px 1fr 80px', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px dotted var(--border-subtle)' : 0, alignItems: 'baseline' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.accent ? 'var(--accent-primary)' : 'transparent', border: r.accent ? 0 : '1px solid var(--border-default)' }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{r.who}</div>
                <div className="serif-it" style={{ fontSize: 12.5, color: 'var(--fg-secondary)', marginTop: 2 }}>{r.t}</div>
              </div>
              <span className="mono" style={{ fontSize: 9, color: r.accent ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em', textAlign: 'right' }}>{r.tag}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Inbox" />
      </div>
    </Frame>
  );
}

function HF_R4B_H02() {
  return (
    <Frame id="H02" name="Comment cluster" purpose="Top recurring comment theme." target="INBOX" span={6}>
      <div className="blk">
        <Eyebrow left="CLUSTER · 0046 · 138 COMMENTS" right="THEME · 'BUDDY CHECK' · 22%" />
        <p className="serif-it" style={{ margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.015em' }}>"What do you mean 'real' buddy check? Mine is real."</p>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', paddingTop: 4 }}>THE QUESTION 31 PEOPLE ASKED · WORTH ITS OWN POST</div>
        <Hairline />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
          {[
            { h: '@diveops_lt', t: '"Mine is the textbook one and it has saved me twice."' },
            { h: '@marina.k', t: '"You mean the actual hand-on-rig version, right?"' },
            { h: '@fin.&.gauge', t: '"What is wrong with the OW one I learned?"' },
          ].map((c, i) => (
            <div key={i} className="serif" style={{ fontSize: 12, color: 'var(--fg-secondary)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 10, fontStyle: 'italic' }}>
              <span className="mono" style={{ fontStyle: 'normal', fontSize: 9.5, color: 'var(--fg-tertiary)', fontWeight: 700, marginRight: 6, letterSpacing: '0.06em' }}>{c.h.toUpperCase()}</span>
              {c.t}
            </div>
          ))}
        </div>
        <Footer openIn="Inbox" extra={<FooterChip icon="pencil" label="Reply once, post once" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_H03() {
  return (
    <Frame id="H03" name="DM thread preview" purpose="A live DM with someone, summarised." target="INBOX" span={6}>
      <div className="blk">
        <Eyebrow left="THREAD · @marina.k · 6 MSGS" right="LAST: 4H AGO" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { h: 'MARINA', t: 'I keep recommending you to my OW students and they all come back saying "but he\'s scary."' },
            { h: 'YOU', t: 'I am not scary, I am specific.' },
            { h: 'MARINA', t: 'Same thing. Anyway — would you ever do a workshop?' },
          ].map((m, i) => (
            <div key={i} style={{ paddingLeft: m.h === 'YOU' ? 24 : 0, paddingRight: m.h === 'YOU' ? 0 : 24 }}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 2, textAlign: m.h === 'YOU' ? 'right' : 'left' }}>{m.h}</div>
              <p className="serif" style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: 'var(--fg-primary)', fontStyle: 'italic' }}>{m.t}</p>
            </div>
          ))}
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--accent-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, fontWeight: 700, letterSpacing: '0.06em' }}>OPPORTUNITY · WORKSHOP COLLAB</div>
        <Footer openIn="Inbox" />
      </div>
    </Frame>
  );
}

function HF_R4B_H04() {
  return (
    <Frame id="H04" name="Sentiment dial" purpose="Sentiment over the day, single number + arc." target="INBOX" span={4}>
      <div className="blk">
        <Eyebrow left="SENTIMENT · LAST 24H" right="N=812" />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
          <svg width="180" height="100" viewBox="0 0 180 100">
            <path d="M 20,90 A 70,70 0 0 1 160,90" fill="none" stroke="var(--surface-2)" strokeWidth="6" />
            <path d="M 20,90 A 70,70 0 0 1 130,28" fill="none" stroke="var(--accent-primary)" strokeWidth="6" />
            <text x="90" y="60" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="40" fontWeight="600" letterSpacing="-0.04em" fill="var(--fg-primary)">+72</text>
            <text x="90" y="78" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" fill="var(--fg-tertiary)" letterSpacing="0.08em">SENTIMENT</text>
          </svg>
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--accent-primary)', textAlign: 'center', letterSpacing: '0.06em', fontWeight: 700 }}>+8 vs YESTERDAY · UPSWING</div>
        <Footer openIn="Inbox" />
      </div>
    </Frame>
  );
}

function HF_R4B_H05() {
  return (
    <Frame id="H05" name="Reply-bank suggestion" purpose="Three drafted replies for one DM." target="INBOX" span={4}>
      <div className="blk">
        <Eyebrow left="REPLY BANK · 3 DRAFTS" right="@MARINA.K" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { l: 'YES', c: 'Marina — yes. June or July. I\'ll write up what I\'d cover and send it Monday.' },
            { l: 'MAYBE', c: 'Tempted. Send me the format you\'re thinking and I\'ll tell you if I can.' },
            { l: 'NOT NOW', c: 'I owe you a thoughtful answer. Give me a week.' },
          ].map((r, i) => (
            <div key={i} style={{ paddingBottom: 8, borderBottom: i < 2 ? '1px dotted var(--border-subtle)' : 0 }}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>{r.l}</div>
              <p className="serif" style={{ margin: 0, fontSize: 12.5, lineHeight: 1.45, color: 'var(--fg-primary)', fontStyle: 'italic' }}>{r.c}</p>
            </div>
          ))}
        </div>
        <Footer openIn="Inbox" />
      </div>
    </Frame>
  );
}

function HF_R4B_H06() {
  return (
    <Frame id="H06" name="Notification triage" purpose="Notifications grouped, ranked." target="INBOX" span={4}>
      <div className="blk">
        <Eyebrow left="NOTIFICATIONS · TRIAGED" right="142 to 4 NEED YOU" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { l: 'NEEDS YOU', n: 4, accent: true },
            { l: 'WAITING ON OTHERS', n: 12 },
            { l: 'FYI', n: 38 },
            { l: 'NOISE · MUTED', n: 88 },
          ].map((g, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 0, alignItems: 'baseline' }}>
              <span className="mono" style={{ fontSize: 10, color: g.accent ? 'var(--accent-primary)' : 'var(--fg-secondary)', fontWeight: 700, letterSpacing: '0.06em' }}>{g.l}</span>
              <span className="num" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: g.accent ? 28 : 18, color: g.accent ? 'var(--accent-primary)' : 'var(--fg-primary)', letterSpacing: '-0.025em', lineHeight: 1 }}>{g.n}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Inbox" />
      </div>
    </Frame>
  );
}

const FAMILY_H_META = [
  { id: 'H01', name: 'Inbox digest', purpose: "Today's reply queue, triaged.", target: 'INBOX', span: 6, family: 'H', familyTitle: 'Inbox', component: HF_R4B_H01 },
  { id: 'H02', name: 'Comment cluster', purpose: 'Top recurring comment theme.', target: 'INBOX', span: 6, family: 'H', familyTitle: 'Inbox', component: HF_R4B_H02 },
  { id: 'H03', name: 'DM thread preview', purpose: 'A live DM with someone, summarised.', target: 'INBOX', span: 6, family: 'H', familyTitle: 'Inbox', component: HF_R4B_H03 },
  { id: 'H04', name: 'Sentiment dial', purpose: 'Sentiment over the day, single number + arc.', target: 'INBOX', span: 4, family: 'H', familyTitle: 'Inbox', component: HF_R4B_H04 },
  { id: 'H05', name: 'Reply-bank suggestion', purpose: 'Three drafted replies for one DM.', target: 'INBOX', span: 4, family: 'H', familyTitle: 'Inbox', component: HF_R4B_H05 },
  { id: 'H06', name: 'Notification triage', purpose: 'Notifications grouped, ranked.', target: 'INBOX', span: 4, family: 'H', familyTitle: 'Inbox', component: HF_R4B_H06 },
];
registerBlock('H01', FAMILY_H_META[0]);
registerBlock('H02', FAMILY_H_META[1]);
registerBlock('H03', FAMILY_H_META[2]);
registerBlock('H04', FAMILY_H_META[3]);
registerBlock('H05', FAMILY_H_META[4]);
registerBlock('H06', FAMILY_H_META[5]);
Object.assign(window, {
  HF_R4B_H01,
  HF_R4B_H02,
  HF_R4B_H03,
  HF_R4B_H04,
  HF_R4B_H05,
  HF_R4B_H06,
  FAMILY_H: { H01: HF_R4B_H01, H02: HF_R4B_H02, H03: HF_R4B_H03, H04: HF_R4B_H04, H05: HF_R4B_H05, H06: HF_R4B_H06 }
});


/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-I.jsx — Family I · Intel. */

function HF_R4B_I01() {
  return (
    <Frame id="I01" name="Trend card" purpose="A rising topic with momentum metric." target="INTEL" span={6}>
      <div className="blk">
        <Eyebrow left="TREND · RISING · 7D" right="MOMENTUM 8.4x · YT" />
        <div className="serif-it" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05 }}>"Side-mount for recreational divers"</div>
        <p className="serif-it" style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-secondary)' }}>Three accounts in your peer set covered it this week. Search interest +312% MoM. Your audience overlap with side-mount: 38%.</p>
        <Spark vals={[2, 2, 3, 3, 5, 7, 9, 12, 18, 22, 28]} accent w={400} />
        <Footer openIn="Intel" extra={<FooterChip icon="pencil" label="Pitch a take" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_I02() {
  return (
    <Frame id="I02" name="Source citation" purpose="A linked source with quoted excerpt." target="INTEL" span={6}>
      <div className="blk">
        <Eyebrow left="SOURCE · CITED" right="DAN · ALERT BULLETIN" />
        <div style={{ paddingLeft: 12, borderLeft: '2px solid var(--accent-primary)' }}>
          <p className="serif" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg-primary)', fontStyle: 'italic' }}>"Of 412 reported recreational dive incidents in 2025, 38% involved a buddy-check failure within the first three minutes of descent."</p>
          <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', marginTop: 6, letterSpacing: '0.06em' }}>DAN ANNUAL REPORT · 2025 · §4.2 · ALERT-DIVER.ORG</div>
        </div>
        <Footer openIn="Intel" extra={<FooterChip icon="arrow-up-right" label="Open" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_I03() {
  return (
    <Frame id="I03" name="Topic radar" purpose="Topics by momentum x audience-fit." target="INTEL" span={6}>
      <div className="blk">
        <Eyebrow left="RADAR · 12 TOPICS" right="X = MOMENTUM · Y = FIT" />
        <svg width="100%" height="180" viewBox="0 0 360 180">
          <line x1="20" y1="160" x2="340" y2="160" stroke="var(--border-default)" />
          <line x1="20" y1="20" x2="20" y2="160" stroke="var(--border-default)" />
          {[
            { x: 60, y: 50, l: 'side-mount', a: true },
            { x: 90, y: 90, l: 'wreck pen.' },
            { x: 130, y: 40, l: 'safety storytelling', a: true },
            { x: 150, y: 110, l: 'gear repair' },
            { x: 200, y: 60, l: 'cold-water gear' },
            { x: 220, y: 130, l: 'travel logs' },
            { x: 280, y: 80, l: 'rebreather' },
            { x: 300, y: 140, l: 'surface intervals' },
            { x: 70, y: 130, l: 'OW basics' },
            { x: 250, y: 30, l: 'incident retros', a: true },
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.a ? 6 : 3.5} fill={p.a ? 'var(--accent-primary)' : 'var(--fg-primary)'} opacity={p.a ? 1 : 0.4} />
              <text x={p.x + 9} y={p.y + 3} fontSize="9" fontFamily="var(--font-serif)" fontStyle="italic" fontWeight={p.a ? 600 : 400} fill={p.a ? 'var(--accent-primary)' : 'var(--fg-secondary)'}>{p.l}</text>
            </g>
          ))}
          <text x="20" y="14" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--fg-tertiary)">FIT UP</text>
          <text x="340" y="174" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--fg-tertiary)" textAnchor="end">MOMENTUM</text>
        </svg>
        <Footer openIn="Intel" />
      </div>
    </Frame>
  );
}

function HF_R4B_I04() {
  return (
    <Frame id="I04" name="Peer post · cited" purpose="A peer's recent post worth reading." target="INTEL" span={6}>
      <div className="blk">
        <Eyebrow left="PEER POST · @diveops_lt" right="3D AGO · 84K VIEWS" />
        <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.015em' }}>"Why I switched my OW students to side-mount"</div>
        <div style={{ height: 100, background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none">
            {Array.from({ length: 30 }).map((_, i) => (
              <line key={i} x1={-20 + i * 16} y1="0" x2={20 + i * 16} y2="100" stroke="var(--border-default)" strokeWidth="1" />
            ))}
            <text x="200" y="56" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-tertiary)" letterSpacing="0.08em">VIDEO PLACEHOLDER · 14:22</text>
          </svg>
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>WATCH-THROUGH 64% · YOUR AVG 58% · WORTH WATCHING</div>
        <Footer openIn="Intel" extra={<FooterChip icon="arrow-up-right" label="Open" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_I05() {
  return (
    <Frame id="I05" name="Search-volume curve" purpose="Search interest, 90d." target="INTEL" span={4}>
      <div className="blk">
        <Eyebrow left="SEARCH · 'side-mount'" right="GOOGLE · 90D" />
        <Spark vals={[12, 14, 13, 18, 22, 28, 32, 38, 44, 52, 62, 78]} accent w={300} height={50} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)' }}>
          <span>FEB</span><span>MAR</span><span>APR</span><span>NOW</span>
        </div>
        <Stat label="MoM CHANGE" val="+312%" accent />
        <Footer openIn="Intel" />
      </div>
    </Frame>
  );
}

function HF_R4B_I06() {
  return (
    <Frame id="I06" name="News brief" purpose="3-line briefing on a story." target="INTEL" span={4}>
      <div className="blk">
        <Eyebrow left="BRIEF · DAN · 2D AGO" right="REGULATORY" />
        <div className="serif-it" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.2 }}>New cold-water training requirement (EU)</div>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['EU dive ops must verify cold-water hours starting Jan 2027.', 'Affects two of your three travel partners directly.', 'Likely audience demand: gear-prep videos, cert pathways.'].map((l, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 6, fontSize: 12, lineHeight: 1.4 }}>
              <span className="mono num" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>0{i + 1}</span>
              <span>{l}</span>
            </li>
          ))}
        </ol>
        <Footer openIn="Intel" />
      </div>
    </Frame>
  );
}

function HF_R4B_I07() {
  return (
    <Frame id="I07" name="Hashtag heatmap" purpose="Tags by use x performance." target="INTEL" span={4}>
      <div className="blk">
        <Eyebrow left="TAGS · LAST 30D" right="N=USES · BAR=AVG ER" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[['#wreckdiving', 14, 84], ['#sidemount', 8, 71], ['#divesafety', 22, 62], ['#truklagoon', 4, 48], ['#scubalife', 18, 22]].map(([t, n, p], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 24px 1fr', gap: 6, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--fg-secondary)' }}>{t}</span>
              <span className="num mono" style={{ fontSize: 10, color: 'var(--fg-tertiary)' }}>{n}</span>
              <div style={{ height: 4, background: 'var(--surface-2)' }}>
                <div style={{ height: '100%', width: `${p}%`, background: 'var(--accent-primary)' }} />
              </div>
            </div>
          ))}
        </div>
        <Footer openIn="Intel" />
      </div>
    </Frame>
  );
}

function HF_R4B_I08() {
  return (
    <Frame id="I08" name="Reference list" purpose="Sources used to answer this thread." target="INTEL" span={6}>
      <div className="blk">
        <Eyebrow left="REFERENCES · 5 SOURCES" right="THIS THREAD" />
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
          {[
            { t: 'DAN Annual Report 2025', src: 'alert-diver.org', kind: 'PDF' },
            { t: 'Side-mount, recreational adoption', src: 'scuba-diving.com', kind: 'WEB' },
            { t: '@diveops_lt — switched OW students', src: 'youtube.com', kind: 'YT' },
            { t: 'Your post 0046 · "Bow railing"', src: 'library', kind: 'POST' },
            { t: 'Voice memory M08', src: 'memory', kind: 'MEM' },
          ].map((r, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 100px 36px', gap: 8, padding: '7px 0', borderBottom: i < 4 ? '1px dotted var(--border-subtle)' : 0, alignItems: 'baseline' }}>
              <span className="mono num" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', fontWeight: 700 }}>0{i + 1}</span>
              <span className="serif-it" style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)' }}>{r.t}</span>
              <span className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', textAlign: 'right' }}>{r.src}</span>
              <span className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.06em', textAlign: 'right' }}>{r.kind}</span>
            </li>
          ))}
        </ol>
        <Footer openIn="Intel" />
      </div>
    </Frame>
  );
}

const FAMILY_I_META = [
  { id: 'I01', name: 'Trend card', purpose: 'A rising topic with momentum metric.', target: 'INTEL', span: 6, family: 'I', familyTitle: 'Intel', component: HF_R4B_I01 },
  { id: 'I02', name: 'Source citation', purpose: 'A linked source with quoted excerpt.', target: 'INTEL', span: 6, family: 'I', familyTitle: 'Intel', component: HF_R4B_I02 },
  { id: 'I03', name: 'Topic radar', purpose: 'Topics by momentum x audience-fit.', target: 'INTEL', span: 6, family: 'I', familyTitle: 'Intel', component: HF_R4B_I03 },
  { id: 'I04', name: 'Peer post · cited', purpose: "A peer's recent post worth reading.", target: 'INTEL', span: 6, family: 'I', familyTitle: 'Intel', component: HF_R4B_I04 },
  { id: 'I05', name: 'Search-volume curve', purpose: 'Search interest, 90d.', target: 'INTEL', span: 4, family: 'I', familyTitle: 'Intel', component: HF_R4B_I05 },
  { id: 'I06', name: 'News brief', purpose: '3-line briefing on a story.', target: 'INTEL', span: 4, family: 'I', familyTitle: 'Intel', component: HF_R4B_I06 },
  { id: 'I07', name: 'Hashtag heatmap', purpose: 'Tags by use x performance.', target: 'INTEL', span: 4, family: 'I', familyTitle: 'Intel', component: HF_R4B_I07 },
  { id: 'I08', name: 'Reference list', purpose: 'Sources used to answer this thread.', target: 'INTEL', span: 6, family: 'I', familyTitle: 'Intel', component: HF_R4B_I08 },
];
registerBlock('I01', FAMILY_I_META[0]);
registerBlock('I02', FAMILY_I_META[1]);
registerBlock('I03', FAMILY_I_META[2]);
registerBlock('I04', FAMILY_I_META[3]);
registerBlock('I05', FAMILY_I_META[4]);
registerBlock('I06', FAMILY_I_META[5]);
registerBlock('I07', FAMILY_I_META[6]);
registerBlock('I08', FAMILY_I_META[7]);
Object.assign(window, {
  HF_R4B_I01,
  HF_R4B_I02,
  HF_R4B_I03,
  HF_R4B_I04,
  HF_R4B_I05,
  HF_R4B_I06,
  HF_R4B_I07,
  HF_R4B_I08,
  FAMILY_I: { I01: HF_R4B_I01, I02: HF_R4B_I02, I03: HF_R4B_I03, I04: HF_R4B_I04, I05: HF_R4B_I05, I06: HF_R4B_I06, I07: HF_R4B_I07, I08: HF_R4B_I08 }
});


/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Spark, Bars, Hairline, Stat, registerBlock */
/* hifi-r4-blocks-J.jsx — Family J · Workspace. */

function HF_R4B_J01() {
  return (
    <Frame id="J01" name="Workspace summary" purpose="A workspace at a glance." target="WORKSPACE" span={6}>
      <div className="blk">
        <Eyebrow left="WORKSPACE · TRUK LAGOON · EP.1–5" right="OPENED 14 TIMES" />
        <div className="serif-it" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05 }}>"Truk Lagoon — five episodes, one safety thesis."</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
          <Stat label="DRAFTS" val="14" />
          <Stat label="SCHEDULED" val="3" sub="next: Wed" />
          <Stat label="REFS" val="22" sub="DAN, peers, library" />
          <Stat label="OPEN Qs" val="6" accent />
        </div>
        <Footer openIn="Workspace" extra={<FooterChip icon="play" label="Resume" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_J02() {
  return (
    <Frame id="J02" name="File card" purpose="A user-uploaded file with extract." target="WORKSPACE" span={6}>
      <div className="blk">
        <Eyebrow left="FILE · DIVE-LOG-FIJI-EP1.PDF" right="UPLOADED · 4.2MB · 38 PAGES" />
        <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 64, height: 80, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em' }}>PDF</span>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, background: 'var(--bg-base)', borderLeft: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }} />
          </div>
          <div>
            <p className="serif-it" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>"Day 3 — Fujikawa Maru · 28m · 41 min · vis 18m · current 0.6kt to 1.4kt during second half. Issue: low first-stage on partner's primary at minute 24."</p>
            <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', marginTop: 6, letterSpacing: '0.06em' }}>EXTRACTED · 1 INCIDENT · 2 GEAR NOTES · 14 TIMESTAMPS</div>
          </div>
        </div>
        <Footer openIn="Workspace" extra={<FooterChip icon="arrow-up-right" label="Open file" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_J03() {
  return (
    <Frame id="J03" name="Brief / project sheet" purpose="The shape of the project, on one page." target="WORKSPACE" span={12}>
      <div className="blk">
        <Eyebrow left="BRIEF · TRUK LAGOON · EP.1" right="V3 · LAST EDITED 4H" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderTop: '1px solid var(--fg-primary)' }}>
          {[
            ['THESIS', 'Eight seconds before the descent decide the dive.'],
            ['AUDIENCE', 'Wreck/tech segment — 38% of you.'],
            ['FRAME', 'Own-failure · personal · plainspoken.'],
            ['HOOK', '"Ninety seconds underwater."'],
          ].map(([l, v], i) => (
            <div key={i} style={{ padding: 12, borderRight: i < 3 ? '1px solid var(--border-subtle)' : 0 }}>
              <span className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.08em' }}>{l}</span>
              <p className="serif-it" style={{ margin: '6px 0 0', fontSize: 14.5, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{v}</p>
            </div>
          ))}
        </div>
        <Footer openIn="Workspace" />
      </div>
    </Frame>
  );
}

function HF_R4B_J04() {
  return (
    <Frame id="J04" name="Versions ladder" purpose="Draft history of one piece." target="WORKSPACE" span={6}>
      <div className="blk">
        <Eyebrow left="VERSIONS · 0046 · CAPTION" right="6 VERSIONS · LIVE V6" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { v: 'v6', t: '4h ago · current · "Ninety seconds underwater"', live: true },
            { v: 'v5', t: '1d ago · "My buddy almost killed me"' },
            { v: 'v4', t: '2d ago · "Three checks…"' },
            { v: 'v3', t: '2d ago · "I was wrong about buddy checks"' },
            { v: 'v2', t: '3d ago · first complete draft' },
            { v: 'v1', t: '5d ago · outline only' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 60px', gap: 10, padding: '7px 0', borderBottom: i < 5 ? '1px dotted var(--border-subtle)' : 0, alignItems: 'baseline' }}>
              <span className="mono" style={{ fontSize: 10, color: r.live ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em' }}>{r.v}</span>
              <span className="serif-it" style={{ fontSize: 12.5, fontWeight: r.live ? 600 : 400, color: r.live ? 'var(--fg-primary)' : 'var(--fg-secondary)' }}>{r.t}</span>
              <span className="mono" style={{ fontSize: 9, color: r.live ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 700, letterSpacing: '0.06em', textAlign: 'right' }}>{r.live ? 'current LIVE' : 'restore'}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Workspace" />
      </div>
    </Frame>
  );
}

function HF_R4B_J05() {
  return (
    <Frame id="J05" name="Image / asset card" purpose="Image w/ caption + safe-area." target="WORKSPACE" span={4}>
      <div className="blk">
        <Eyebrow left="ASSET · IMG-0046-bow.jpg" right="3024x4032 · 4.8MB" />
        <div style={{ height: 200, background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 240 200" preserveAspectRatio="none">
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={i} x1={-30 + i * 14} y1="0" x2={30 + i * 14} y2="200" stroke="var(--border-default)" strokeWidth="1" />
            ))}
            <rect x="40" y="36" width="160" height="128" fill="none" stroke="var(--accent-primary)" strokeWidth="1" strokeDasharray="3 3" />
            <text x="120" y="108" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-tertiary)" letterSpacing="0.08em">PHOTO PLACEHOLDER</text>
          </svg>
        </div>
        <div className="serif-it" style={{ fontSize: 12.5, color: 'var(--fg-secondary)' }}>Bow railing, Fujikawa Maru, m18.</div>
        <Footer openIn="Workspace" />
      </div>
    </Frame>
  );
}

function HF_R4B_J06() {
  return (
    <Frame id="J06" name="Checklist" purpose="A live to-do for the project." target="WORKSPACE" span={4}>
      <div className="blk">
        <Eyebrow left="CHECKLIST · EP.1 · PRELAUNCH" right="6/9 DONE" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { t: 'Voice-match check', d: true },
            { t: 'Hook A/B picked', d: true },
            { t: 'Captions written · 3 channels', d: true },
            { t: 'Thumbnails (3 options)', d: true },
            { t: 'Schedule confirmed', d: true },
            { t: 'Description + chapters', d: true },
            { t: 'Alt text accessibility pass', d: false },
            { t: 'Notify @marina.k for boost', d: false, accent: true },
            { t: 'Set day-after retro reminder', d: false },
          ].map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 8, padding: '5px 0', borderBottom: i < 8 ? '1px dotted var(--border-subtle)' : 0, alignItems: 'center' }}>
              <span style={{ width: 12, height: 12, border: '1px solid', borderColor: r.d ? 'var(--accent-primary)' : 'var(--border-default)', background: r.d ? 'var(--accent-primary)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {r.d && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4L3 6L7 1.5" stroke="var(--fg-on-accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
              </span>
              <span className="serif" style={{ fontSize: 12.5, color: r.d ? 'var(--fg-tertiary)' : 'var(--fg-primary)', textDecoration: r.d ? 'line-through' : 'none', fontStyle: r.accent ? 'italic' : 'normal', fontWeight: r.accent ? 600 : 500 }}>{r.t}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Workspace" />
      </div>
    </Frame>
  );
}

function HF_R4B_J07() {
  return (
    <Frame id="J07" name="Sticky note / pin" purpose="A pinned note at the top of the workspace." target="WORKSPACE" span={4}>
      <div className="blk" style={{ background: 'var(--accent-soft)', borderColor: 'transparent' }}>
        <Eyebrow left="Pinned PINNED · NOTE-08" right="HENRY · 2026-04-29" />
        <p className="serif-it" style={{ margin: 0, fontSize: 16, lineHeight: 1.5, fontWeight: 500, color: 'var(--accent-primary-press)' }}>"This series isn't about gear. It's about decision-making in the eight seconds before a dive. If a draft drifts toward gear talk, kill it."</p>
        <Footer openIn="Workspace" />
      </div>
    </Frame>
  );
}

const FAMILY_J_META = [
  { id: 'J01', name: 'Workspace summary', purpose: 'A workspace at a glance.', target: 'WORKSPACE', span: 6, family: 'J', familyTitle: 'Workspace', component: HF_R4B_J01 },
  { id: 'J02', name: 'File card', purpose: 'A user-uploaded file with extract.', target: 'WORKSPACE', span: 6, family: 'J', familyTitle: 'Workspace', component: HF_R4B_J02 },
  { id: 'J03', name: 'Brief / project sheet', purpose: 'The shape of the project, on one page.', target: 'WORKSPACE', span: 12, family: 'J', familyTitle: 'Workspace', component: HF_R4B_J03 },
  { id: 'J04', name: 'Versions ladder', purpose: 'Draft history of one piece.', target: 'WORKSPACE', span: 6, family: 'J', familyTitle: 'Workspace', component: HF_R4B_J04 },
  { id: 'J05', name: 'Image / asset card', purpose: 'Image w/ caption + safe-area.', target: 'WORKSPACE', span: 4, family: 'J', familyTitle: 'Workspace', component: HF_R4B_J05 },
  { id: 'J06', name: 'Checklist', purpose: 'A live to-do for the project.', target: 'WORKSPACE', span: 4, family: 'J', familyTitle: 'Workspace', component: HF_R4B_J06 },
  { id: 'J07', name: 'Sticky note / pin', purpose: 'A pinned note at the top of the workspace.', target: 'WORKSPACE', span: 4, family: 'J', familyTitle: 'Workspace', component: HF_R4B_J07 },
];
registerBlock('J01', FAMILY_J_META[0]);
registerBlock('J02', FAMILY_J_META[1]);
registerBlock('J03', FAMILY_J_META[2]);
registerBlock('J04', FAMILY_J_META[3]);
registerBlock('J05', FAMILY_J_META[4]);
registerBlock('J06', FAMILY_J_META[5]);
registerBlock('J07', FAMILY_J_META[6]);
Object.assign(window, {
  HF_R4B_J01,
  HF_R4B_J02,
  HF_R4B_J03,
  HF_R4B_J04,
  HF_R4B_J05,
  HF_R4B_J06,
  HF_R4B_J07,
  FAMILY_J: { J01: HF_R4B_J01, J02: HF_R4B_J02, J03: HF_R4B_J03, J04: HF_R4B_J04, J05: HF_R4B_J05, J06: HF_R4B_J06, J07: HF_R4B_J07 }
});
