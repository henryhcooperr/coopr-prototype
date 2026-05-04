/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSlider, TweakColor, TweakToggle */
/* global D1_Shell, D1_Home, D1_Chat, D1_Insights, D1_Release, D1_Studio, D1_Deep */
/* global D2_Shell, D2_Home, D2_Chat, D2_Insights, D2_Release, D2_Studio, D2_Deep */

// ─────────────────────────────────────────────────────────────
// Shell explore — v3 (hard reset)
// 12 surfaces. Top centered tabs + scoped left rail.
// Two directions, 7 deep screens each, side-by-side contact sheets.
// ─────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent":      "#0d9488",
  "density":     "default",
  "radius":      4,
  "showHeaders": true
}/*EDITMODE-END*/;

// Render at 1440x900 — explicit per the round-3 brief.
const SCREEN_W = 1440;
const SCREEN_H = 900;

// ───────────────────────────── Cover atoms ─────────────────────

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: '#3a3a3a', padding: '6px 0' }}>
      <span style={{ fontFamily: 'Kalam, cursive', fontSize: 14, color: '#d97706' }}>Round 3 · 2 directions · same chrome pattern · only chat-stance differs →</span>
      <span className="wf-tag wf-tag-panel">12 surfaces (was 19)</span>
      <span className="wf-tag">top centered tabs · max 3</span>
      <span className="wf-tag">left side rail · scoped to active tab</span>
      <span className="wf-tag wf-tag-route">numbered pins = load-bearing decisions</span>
    </div>
  );
}

function ConsolidationCard() {
  const merges = [
    ['Stories',                'absorbed →',  'Library · "Stories" lens (sub-tab)'],
    ['Media + Inbox',          'merged →',    'Feed · type filters'],
    ['Trends + Radar',         'merged →',    'Signal'],
    ['DNA + Memory + Studies', 'merged →',    'Creator · sub-tabs'],
    ['Formats + Inspiration',  'merged →',    'Patterns'],
    ['Repurpose + Publishing', 'merged →',    'Release · Queue / Calendar / Suggestions / Settings'],
    ['Link in Bio + Media Kit','merged →',    'Presence'],
  ];
  return (
    <div style={{ background: '#fafaf7', border: '1.5px solid #4a4a4a', borderRadius: 6, padding: '14px 18px', fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: 1440 }}>
      <div className="wf-label" style={{ marginBottom: 10 }}>SURFACE CONSOLIDATION · 19 → 12</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 32px' }}>
        {merges.map((m, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 80px 1fr', alignItems: 'baseline', fontSize: 11.5, color: '#1a1a1a', padding: '4px 0', borderBottom: i < 5 ? '1px solid #e8e5dd' : 'none' }}>
            <span style={{ color: '#8a8a8a' }}>{m[0]}</span>
            <span style={{ fontFamily: 'Kalam, cursive', color: '#d97706' }}>{m[1]}</span>
            <span style={{ fontWeight: 600 }}>{m[2]}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 11.5, lineHeight: 1.55, color: '#1a1a1a' }}>
        <strong>Final 12:</strong> Workspace · <em>Home · Chat · Studio · Library · Feed</em> &nbsp;·&nbsp; Intelligence · <em>Insights · Signal · Creator · Patterns</em> &nbsp;·&nbsp; Output · <em>Clip Lab · Release · Presence</em>.
        Old names (Stories, Inspiration, Formats, Trends, Radar, Memory, Studies, Repurpose, Publishing, Link in Bio, Media Kit, Media, Inbox) appear only as internal tabs/lenses.
      </div>
    </div>
  );
}

function TwoDirectionThesis() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: 1440 }}>
      {[
        {
          letter: '1', name: 'Job-mode tabs', sub: 'Make · Look · Ship', color: '#0d6e64',
          thesis: 'Top tabs encode JOB MODE. Make = generative, Look = diagnostic, Ship = scheduling. Each mode re-seeds chat stance — Make-mode chat drafts and explores; Look-mode chat diagnoses and cites. Anchored composer at the bottom of every Look surface (Perplexity-Finance pattern). Studio is fenced — opts out of the anchored composer.',
          ia: ['3 mode tabs (centered)', 'rail = 5 / 4 / 3 surfaces by mode', 'Chat = sidebar item in MAKE', 'anchored composer in LOOK', '⌘K everywhere'],
        },
        {
          letter: '2', name: 'Surface-group tabs · ambient chat', sub: 'Workspace · Intelligence · Output', color: '#3d2d6e',
          thesis: 'Top tabs are STRUCTURAL gates — they only decide which surfaces appear in the rail. No mode encoded in chrome; no anchored composer anywhere. Chat is ambient: ⌘K opens a modal opener with chat-or-jump as peers; ⌘J docks a peer pane on the right of any surface, default closed. Tests whether grouping alone is enough without mode tabs.',
          ia: ['3 group tabs (centered)', 'rail = surfaces in group', 'NO chat in chrome', '⌘K modal opener', '⌘J docked peer pane'],
        },
      ].map(d => (
        <div key={d.letter} style={{ background: '#fafaf7', border: '1.5px solid #4a4a4a', borderRadius: 6, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 6, background: d.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>{d.letter}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Direction {d.letter} · {d.name}</div>
              <div className="wf-meta" style={{ fontSize: 11 }}>tabs: {d.sub}</div>
            </div>
          </div>
          <p style={{ margin: '6px 0 10px', fontSize: 12.5, lineHeight: 1.6, color: '#1a1a1a' }}>{d.thesis}</p>
          <div className="wf-label" style={{ marginBottom: 5 }}>IA POSITIONS · 7</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['Top tabs',          d.ia[0]],
              ['Side rail',         d.ia[1]],
              ['Chat in chrome',    d.ia[2]],
              ['Bottom anchored',   d.letter === '1' ? 'on every Look surface · scoped' : 'never'],
              ['Modal opener',      d.ia[4]],
              ['Peer pane',         d.letter === '2' ? d.ia[4] : '/chat only · permanent'],
              ['Studio fence',      'unchanged · 6-step flow hosted as-is'],
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: 11, padding: '3px 0', borderBottom: i < 6 ? '1px solid #e8e5dd' : 'none' }}>
                <span className="wf-meta">{row[0]}</span>
                <span style={{ color: '#1a1a1a' }}>{row[1]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DecisionRubric() {
  return (
    <div style={{ background: '#fafaf7', border: '1.5px dashed #d97706', borderRadius: 6, padding: '14px 18px', fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: 1440 }}>
      <div className="wf-label" style={{ marginBottom: 8, color: '#d97706' }}>HOW TO PICK</div>
      <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.7, color: '#1a1a1a' }}>
        <li>Should chat-stance be a chrome control? <span style={{ color: '#7b5f1c' }}>Yes → Direction 1. No → Direction 2.</span></li>
        <li>Will users notice that Make-mode and Look-mode chat behave differently? <span style={{ color: '#7b5f1c' }}>Yes → 1 earns its tabs. No → 1 is dead chrome; pick 2.</span></li>
        <li>Do dense surfaces (Library, Insights tables) need maximum horizontal room? <span style={{ color: '#7b5f1c' }}>Yes → 2 wins (no anchored bar steals 64px).</span></li>
        <li>Are users likely to learn ⌘K + ⌘J? <span style={{ color: '#7b5f1c' }}>Even if not, the rail Chat-launcher button keeps 2 viable.</span></li>
      </ol>
      <div style={{ fontFamily: 'Kalam, cursive', fontSize: 14, color: '#d97706', marginTop: 10 }}>
        Round 3 question: does mode tabs + anchored composer (1) carry its weight, or is structural grouping + ambient chat (2) enough?
      </div>
    </div>
  );
}

// ───────────────────────────── Contact sheet (legible) ─────────

function ContactSheet({ letter, name, color, screens }) {
  // 7 screens in a 4 + 3 grid as specified — readable thumbs.
  const thumbW = 320;
  const thumbH = (SCREEN_H * thumbW) / SCREEN_W;  // preserve 16:10 ratio
  const scale = thumbW / SCREEN_W;

  const row1 = screens.slice(0, 4);
  const row2 = screens.slice(4);
  return (
    <div style={{ padding: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: 6, background: color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{letter}</span>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Direction {letter} · {name}</span>
        <span className="wf-meta">· {screens.length} deep screens · open below for full-size inspection</span>
      </div>
      {[row1, row2].map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${thumbW}px)`, gap: 14, marginBottom: 12, justifyContent: 'start' }}>
          {row.map(s => (
            <div key={s.id}>
              <div style={{ width: thumbW, height: thumbH, border: '1.5px solid #4a4a4a', borderRadius: 4, overflow: 'hidden', background: '#fafaf7', position: 'relative' }}>
                <div style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                  {s.render()}
                </div>
              </div>
              <div style={{ marginTop: 5, fontSize: 11, color: '#1a1a1a', lineHeight: 1.35, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: '#6a6a6a' }}>{s.note}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Side-by-side contact sheets — for at-a-glance comparison.
function SideBySide({ d1Screens, d2Screens }) {
  const colW = 700;
  const thumbW = 220;
  const thumbH = (SCREEN_H * thumbW) / SCREEN_W;
  const scale = thumbW / SCREEN_W;

  const Cell = ({ s }) => (
    <div>
      <div style={{ width: thumbW, height: thumbH, border: '1.5px solid #4a4a4a', borderRadius: 4, overflow: 'hidden', background: '#fafaf7', position: 'relative' }}>
        <div style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {s.render()}
        </div>
      </div>
      <div style={{ marginTop: 4, fontSize: 10.5, color: '#1a1a1a', fontWeight: 600 }}>{s.label}</div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${colW}px ${colW}px`, gap: 16, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {[
        { letter: '1', name: 'Job-mode tabs · Make / Look / Ship', color: '#0d6e64', screens: d1Screens },
        { letter: '2', name: 'Surface-group tabs · ambient chat',  color: '#3d2d6e', screens: d2Screens },
      ].map(col => (
        <div key={col.letter} style={{ background: '#fafaf7', border: '1.5px solid #4a4a4a', borderRadius: 6, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 26, height: 26, borderRadius: 5, background: col.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{col.letter}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Direction {col.letter} · {col.name}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, ${thumbW}px)`, gap: 10 }}>
            {col.screens.slice(0, 3).map(s => <Cell key={s.id} s={s} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${thumbW * 0.74}px)`, gap: 8, marginTop: 10 }}>
            {col.screens.slice(3).map(s => {
              const tw = thumbW * 0.74;
              const th = (SCREEN_H * tw) / SCREEN_W;
              const sc = tw / SCREEN_W;
              return (
                <div key={s.id}>
                  <div style={{ width: tw, height: th, border: '1.5px solid #4a4a4a', borderRadius: 4, overflow: 'hidden', background: '#fafaf7', position: 'relative' }}>
                    <div style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${sc})`, transformOrigin: 'top left' }}>
                      {s.render()}
                    </div>
                  </div>
                  <div style={{ marginTop: 3, fontSize: 9.5, color: '#1a1a1a', fontWeight: 600 }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────── App ─────────────────────────────

function DirectionSection({ letter, name, color, sub, thesis, screens }) {
  return (
    <DCSection id={`dir-${letter}`} title={`Direction ${letter} · ${name}`} subtitle={`tabs: ${sub} · ${thesis}`}>
      {screens.map(s => (
        <DCArtboard key={s.id} id={s.id} label={s.label} width={SCREEN_W} height={SCREEN_H}>
          {s.render()}
        </DCArtboard>
      ))}
    </DCSection>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--wf-accent', t.accent);
    r.style.setProperty('--wf-accent-soft', hexToRgba(t.accent, 0.10));
    r.style.setProperty('--wf-density', t.density === 'tight' ? '0.85' : t.density === 'loose' ? '1.15' : '1');
    r.style.setProperty('--wf-radius', `${t.radius}px`);
    r.style.setProperty('--wf-radius-lg', `${t.radius * 2}px`);
    document.body.dataset.showHeaders = t.showHeaders ? 'on' : 'off';
  }, [t]);

  const d1 = [
    { id: 'D1-1', label: '1-1 · Shell',    note: 'default · Make · Home',                 render: () => <D1_Shell /> },
    { id: 'D1-2', label: '1-2 · Home',     note: 'full dashboard · 5 real tiles',        render: () => <D1_Home /> },
    { id: 'D1-3', label: '1-3 · Chat',     note: 'rail + thread + project peer · composer', render: () => <D1_Chat /> },
    { id: 'D1-4', label: '1-4 · Insights', note: 'Look mode · sub-tabs · anchored composer', render: () => <D1_Insights /> },
    { id: 'D1-5', label: '1-5 · Release',  note: 'merged Repurpose + Publishing',        render: () => <D1_Release /> },
    { id: 'D1-6', label: '1-6 · Studio',   note: 'fenced · 6-step flow hosted',          render: () => <D1_Studio /> },
    { id: 'D1-7', label: '1-7 · Deep',     note: 'Studio · Dive safety · Script · Scene 3', render: () => <D1_Deep /> },
  ];

  const d2 = [
    { id: 'D2-1', label: '2-1 · Shell',    note: 'default · Workspace · Home · ⌘J closed', render: () => <D2_Shell /> },
    { id: 'D2-2', label: '2-2 · Home',     note: 'full dashboard · same content',         render: () => <D2_Home /> },
    { id: 'D2-3', label: '2-3 · Chat',     note: '/chat route · ambient model',           render: () => <D2_Chat /> },
    { id: 'D2-4', label: '2-4 · Insights', note: 'Intelligence group · ⌘J handle right',  render: () => <D2_Insights /> },
    { id: 'D2-5', label: '2-5 · Release',  note: 'merged · same as D1',                   render: () => <D2_Release /> },
    { id: 'D2-6', label: '2-6 · Studio',   note: 'fenced · same hosting pattern',         render: () => <D2_Studio /> },
    { id: 'D2-7', label: '2-7 · Deep',     note: 'Library · Stories · Fiji · clip 0042 · ⌘J open', render: () => <D2_Deep /> },
  ];

  return (
    <>
      <DesignCanvas>
        <DCSection id="cover" title="Shell explore v3 — hard reset" subtitle="12 surfaces. Top centered tabs + scoped left rail. Two directions: Job-mode (1) vs Surface-group + ambient chat (2).">
          <DCArtboard id="legend"      label="legend"                   width={1440} height={64}>  <Legend /></DCArtboard>
          <DCArtboard id="consol"      label="surface consolidation"    width={1440} height={420}> <ConsolidationCard /></DCArtboard>
          <DCArtboard id="thesis"      label="2 directions · thesis"    width={1440} height={520}> <TwoDirectionThesis /></DCArtboard>
          <DCArtboard id="rubric"      label="how to pick"              width={1440} height={240}> <DecisionRubric /></DCArtboard>
          <DCArtboard id="sidebyside"  label="side-by-side · 7 vs 7"    width={1440} height={620}> <SideBySide d1Screens={d1} d2Screens={d2} /></DCArtboard>
          <DCArtboard id="contact-1"   label="Direction 1 · contact sheet" width={1440} height={540}> <ContactSheet letter="1" name="Job-mode tabs · Make / Look / Ship" color="#0d6e64" screens={d1} /></DCArtboard>
          <DCArtboard id="contact-2"   label="Direction 2 · contact sheet" width={1440} height={540}> <ContactSheet letter="2" name="Surface-group tabs · ambient chat" color="#3d2d6e" screens={d2} /></DCArtboard>
        </DCSection>

        <DirectionSection
          letter="1"
          name="Job-mode tabs · Make / Look / Ship"
          color="#0d6e64"
          sub="Make · Look · Ship"
          thesis="Tabs encode chat stance. Anchored composer on every Look surface."
          screens={d1}
        />

        <DirectionSection
          letter="2"
          name="Surface-group tabs · ambient chat"
          color="#3d2d6e"
          sub="Workspace · Intelligence · Output"
          thesis="Tabs gate the rail; nothing else. Chat is ⌘K + ⌘J only."
          screens={d2}
        />
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Accent" subtitle="One accent color, used sparingly." />
        <TweakColor label="Accent" value={t.accent} onChange={v => setTweak('accent', v)} />
        <TweakSection label="Density & shape" />
        <TweakRadio label="Density" value={t.density} options={['tight', 'default', 'loose']} onChange={v => setTweak('density', v)} />
        <TweakSlider label="Corner radius" value={t.radius} min={0} max={12} step={1} unit="px" onChange={v => setTweak('radius', v)} />
        <TweakToggle label="Show topbar" value={t.showHeaders} onChange={v => setTweak('showHeaders', v)} />
      </TweaksPanel>
    </>
  );
}

function hexToRgba(hex, a) {
  const h = hex.replace('#','');
  const n = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
