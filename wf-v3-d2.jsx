/* global React, V3TopBar, V3SideRail, V3SubTabs, V3CmdJPane, V3CmdKModal, V3_GROUPS, V3Pin, ConvoRail, Composer, ChatBlock, MiniChart, PhoneMini, Pin, Hatch, Textlines, AbEdge, KeyCombo */

// ════════════════════════════════════════════════════════════════
// DIRECTION 2 — "Surface-group tabs + ambient chat"
// Top tabs = WORKSPACE / INTELLIGENCE / OUTPUT (just gate side rail).
// NO mode tabs. Chat is ambient: ⌘K modal opener, ⌘J docks a peer pane.
// ════════════════════════════════════════════════════════════════

const D2_TABS = [
  { id: 'workspace',    label: 'Workspace' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'output',       label: 'Output' },
];

function D2Shell({ group = 'workspace', activeSurface, leading, children, cmdJOpen = false, cmdKOpen = false, cmdJScope, pins = [] }) {
  const surfaces = V3_GROUPS[group];
  return (
    <div className="wf-screen" style={{ flexDirection: 'column' }}>
      <V3TopBar
        tabs={D2_TABS}
        active={group}
        leading={leading}
        accent={false}
      />
      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
        <V3SideRail
          surfaces={surfaces}
          active={activeSurface}
          header={<div className="wf-section-header" style={{ padding: '0 6px', marginBottom: 6 }}>{group.toUpperCase()}</div>}
          showChatLauncher={true}
        />
        <main style={{ flex: 1, display: 'flex', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            {children}
          </div>
          <V3CmdJPane open={cmdJOpen} scope={cmdJScope} />
        </main>
        {cmdKOpen && <V3CmdKModal />}
      </div>
      {pins.map((p, i) => <V3Pin key={i} {...p} />)}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 1. SHELL — default (Workspace, Home), ⌘J pane closed
// ────────────────────────────────────────────────────────────────
function D2_Shell() {
  return (
    <D2Shell
      group="workspace"
      activeSurface="home"
      pins={[
        { n: 1, text: '3 group tabs · centered · just gate the rail · NO chat mode',  top: 8,  left: 0, right: 0 },
        { n: 2, text: 'Side rail = WORKSPACE surfaces (5)',                             top: 70, left: 12 },
        { n: 3, text: 'Ambient chat launcher in rail · ⌘K opens modal',                 top: 280, left: 12 },
        { n: 4, text: '⌘J pane closed by default · vertical handle on right edge',      top: 200, right: 0, arrowDir: 'right' },
        { n: 5, text: 'Topbar ⌘K = ask · jump · run',                                   top: 8, right: 240, arrowDir: 'right' },
      ]}
    >
      <div style={{ flex: 1, padding: 24, background: 'var(--wf-paper)', position: 'relative' }}>
        <AbEdge>WORKSPACE · Home</AbEdge>
        <div style={{ marginTop: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Welcome back, Henry</h1>
          <div className="wf-meta" style={{ marginTop: 4 }}>3 active projects · 41 unread feed items · 7-day window</div>
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--wf-ink-2)', maxWidth: 640 }}>
            Group tabs are simple gates. Same Home content regardless of any "mode" — there is no mode. Chat lives in ⌘K and ⌘J.
          </div>
        </div>
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {['Active Projects · 3', 'Performance · 7d', 'Recent Library · 5'].map((t, i) => (
            <div key={i} className="wf-sketch" style={{ padding: 14, height: 140 }}>
              <div className="wf-label">{t.split(' · ')[0]}</div>
              <div className="wf-meta" style={{ marginTop: 2 }}>{t.split(' · ')[1]}</div>
              <div style={{ marginTop: 12 }}><Textlines lines={3} /></div>
            </div>
          ))}
        </div>
      </div>
    </D2Shell>
  );
}

// ────────────────────────────────────────────────────────────────
// 2. HOME — full dashboard (real labels)
// ────────────────────────────────────────────────────────────────
function D2_Home() {
  return (
    <D2Shell
      group="workspace"
      activeSurface="home"
      pins={[
        { n: 1, text: 'Same dashboard regardless of group · grouping is structural, not behavioural',  top: 50, left: 200 },
        { n: 2, text: 'No anchored composer anywhere · ⌘K is the opener · ⌘J docks a peer',            bottom: 14, left: 200 },
      ]}
    >
      <div style={{ flex: 1, padding: 22, overflow: 'auto', background: 'var(--wf-paper)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Home</h1>
            <div className="wf-meta" style={{ marginTop: 2 }}>Today · 7-day rollup · @henry.dives</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span className="wf-tag">7d</span>
            <span className="wf-tag" style={{ background: 'var(--wf-ink)', color: '#fff', borderColor: 'var(--wf-ink)' }}>30d</span>
            <span className="wf-tag">90d</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 0.9fr', gap: 14 }}>
          <div className="wf-sketch" style={{ padding: 14 }}>
            <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="wf-label">ACTIVE PROJECTS · 3</span>
              <span className="wf-meta">→ Studio</span>
            </div>
            {[
              ['Dive safety · Reels series', 'Script · step 3 / 6', 'Tue'],
              ['Carousel hooks audit',      'Outline · step 2 / 6', 'Wed'],
              ['March Clip Lab batch',      'Score · step 5 / 6',   'Fri'],
            ].map((p, i) => (
              <div key={i} style={{ padding: '8px 0', borderTop: i ? '1px solid var(--wf-line)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: i === 0 ? 'var(--wf-accent)' : 'var(--wf-ink-3)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600 }}>{p[0]}</div>
                  <div className="wf-meta">{p[1]}</div>
                </div>
                <span className="wf-meta">{p[2]}</span>
              </div>
            ))}
          </div>

          <div className="wf-sketch" style={{ padding: 14 }}>
            <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="wf-label">PERFORMANCE · 7D</span>
              <span className="wf-meta">→ Insights</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              {[
                ['Reach',     '184k', '+12%'],
                ['Followers', '+412', '+0.4%'],
                ['Avg watch', '11.4s', '−0.6s'],
                ['Save rate', '4.1%',  '+0.2%'],
              ].map((m, i) => (
                <div key={i} style={{ padding: '6px 8px', background: 'var(--wf-paper-2)', borderRadius: 4 }}>
                  <div className="wf-meta">{m[0]}</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{m[1]}</div>
                  <div style={{ fontSize: 10, color: m[2].startsWith('+') ? 'var(--wf-accent)' : 'var(--wf-note)' }}>{m[2]}</div>
                </div>
              ))}
            </div>
            <MiniChart bars={9} accentIndex={6} />
          </div>

          <div className="wf-sketch" style={{ padding: 14 }}>
            <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="wf-label">DNA · SNAPSHOT</span>
              <span className="wf-meta">→ Creator</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {[['Voice','wry · grounded'],['Pace','medium-fast'],['Hook','rule-of-three'],['Topic','underwater · safety']].map((c, i) => (
                <span key={i} className="wf-tag" style={{ fontSize: 10 }}>
                  <span className="wf-meta" style={{ marginRight: 3 }}>{c[0]}</span>{c[1]}
                </span>
              ))}
            </div>
            <div className="wf-meta" style={{ marginTop: 10, fontSize: 10, lineHeight: 1.5 }}>Drift detected on <strong>Pace</strong> — 3 recent posts trended faster.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginTop: 14 }}>
          <div className="wf-sketch" style={{ padding: 14 }}>
            <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="wf-label">RECENT LIBRARY · 5 clips</span>
              <span className="wf-meta">→ Library · Stories lens</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Fiji · 0042','Wreck · 0031','Dive 1','Dive 2','Reef'].map((c, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <PhoneMini w={50} h={90} />
                  <span className="wf-meta" style={{ fontSize: 9 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="wf-sketch" style={{ padding: 14 }}>
            <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="wf-label">FEED · 4 new</span>
              <span className="wf-meta">→ Feed</span>
            </div>
            {[
              ['DM · Kai',          'Re: Fiji rights',          '2m'],
              ['Mention · @oceanly','tagged you in a Reel',     '11m'],
              ['Asset · 4 clips',   'imported from Drive',      '1h'],
              ['Comment · Sasha',   'on dive-safety · slide 4', '3h'],
            ].map((r, i) => (
              <div key={i} style={{ padding: '6px 0', borderTop: i ? '1px solid var(--wf-line)' : 'none', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                <span className="wf-meta" style={{ width: 90 }}>{r[0]}</span>
                <span style={{ flex: 1 }}>{r[1]}</span>
                <span className="wf-meta">{r[2]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="wf-sketch" style={{ padding: 14, marginTop: 14 }}>
          <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="wf-label">UP NEXT</span>
            <span className="wf-meta">→ Studio · Release</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 10, background: 'var(--wf-paper-2)', borderRadius: 4, display: 'flex', gap: 10, alignItems: 'center' }}>
              <PhoneMini w={42} h={76} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>Publish: Dive safety · 03</div>
                <div className="wf-meta">Tue 4:30pm · IG Reel + TikTok + YT Short</div>
              </div>
              <span className="wf-tag wf-tag-panel" style={{ fontSize: 10 }}>Release</span>
            </div>
            <div style={{ padding: 10, background: 'var(--wf-paper-2)', borderRadius: 4, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 42, height: 76, background: 'var(--wf-paper)', border: '1.25px solid var(--wf-ink-2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--wf-ink-3)' }}>script</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>Finish: Carousel hooks · scene 4</div>
                <div className="wf-meta">Studio · Outline 2/6 · 18 min est.</div>
              </div>
              <span className="wf-tag wf-tag-panel" style={{ fontSize: 10 }}>Studio</span>
            </div>
          </div>
        </div>
      </div>
    </D2Shell>
  );
}

// ────────────────────────────────────────────────────────────────
// 3. CHAT — full /chat route (ambient model)
// ────────────────────────────────────────────────────────────────
function D2_Chat() {
  return (
    <D2Shell
      group="workspace"
      activeSurface="chat"
      pins={[
        { n: 1, text: 'Convo rail (left)',                                           top: 80,  left: 184 },
        { n: 2, text: 'Multi-block COOPR response · same vocabulary as D1',          top: 230, left: 380 },
        { n: 3, text: 'Peer pane = attached project context',                        top: 80,  right: 12, arrowDir: 'right' },
        { n: 4, text: 'Composer · @-mention attaches the surface, not a "mode"',     bottom: 80, left: 380 },
      ]}
    >
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <ConvoRail width={180} active={1} highlight />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--wf-paper)' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-title" style={{ fontSize: 13 }}>Dive safety · Reels batch</span>
            <span className="wf-meta">· 14 messages · attached: Dive safety project</span>
            <div style={{ flex: 1 }} />
            <span className="wf-tag" style={{ fontSize: 10 }}>Sonnet</span>
          </div>
          <div style={{ flex: 1, padding: '18px 22px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="wf-msg-user">Pull the 3 best openings from last month's dive-safety carousels and draft a script for episode 4 in my voice.</div>
            <div className="wf-msg-coopr" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>Found 3 strong openings from <strong>Feb 12 – Mar 6</strong>. Common DNA: rule-of-three text-on-image, 0.6s static frame, then cut. I drafted episode 4 below — same pattern, your voice, pace nudged 8% slower.</div>
              <ChatBlock kind="METRICS" title="Hook strength · 3 reference openings">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[['#0042','81%','9.2s'],['#0051','77%','8.4s'],['#0038','74%','10.1s']].map((m,i) => (
                    <div key={i} style={{ padding: 6, background: 'var(--wf-paper)', borderRadius: 4, border: '1px solid var(--wf-line)' }}>
                      <div className="wf-meta">{m[0]}</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{m[1]}</div>
                      <div className="wf-meta" style={{ fontSize: 9 }}>retention · avg watch {m[2]}</div>
                    </div>
                  ))}
                </div>
              </ChatBlock>
              <ChatBlock kind="CLIPS" title="Reference openings">
                <div style={{ display: 'flex', gap: 10 }}>
                  <PhoneMini w={50} h={90} /><PhoneMini w={50} h={90} /><PhoneMini w={50} h={90} />
                </div>
              </ChatBlock>
              <ChatBlock kind="DRAFT" title="Episode 4 · script (3 scenes)">
                <Textlines lines={4} />
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <span className="wf-tag wf-tag-route" style={{ fontSize: 10 }}>Open in Studio →</span>
                  <span className="wf-tag" style={{ fontSize: 10 }}>Save to Library</span>
                  <span className="wf-tag" style={{ fontSize: 10 }}>Send to Clip Lab</span>
                </div>
              </ChatBlock>
            </div>
          </div>
          <div style={{ padding: 14, borderTop: '1px solid var(--wf-line)' }}>
            <Composer
              placeholder="Reply, attach a clip, or @mention a surface…"
              chips={['@studio/dive-safety', 'Sonnet', '+ attach']}
              accent
            />
          </div>
        </div>
        <aside style={{ width: 270, flex: '0 0 270px', borderLeft: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)', padding: 14, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <div className="wf-row" style={{ justifyContent: 'space-between' }}>
            <span className="wf-label">ATTACHED · PROJECT</span>
            <span className="wf-meta">⌘.</span>
          </div>
          <div className="wf-sketch" style={{ padding: 12 }}>
            <div className="wf-row" style={{ marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--wf-accent)' }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Dive safety</span>
              <span className="wf-meta" style={{ marginLeft: 'auto' }}>Reels · ep 4</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--wf-ink-3)', marginBottom: 10 }}>Step 3 / 6 · Script</div>
            <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
              {[1,2,3,4,5,6].map(n => (
                <div key={n} style={{ flex: 1, height: 5, borderRadius: 1, background: n <= 3 ? 'var(--wf-accent)' : 'var(--wf-line)' }} />
              ))}
            </div>
            <div className="wf-label" style={{ fontSize: 9, marginBottom: 4 }}>NOTES · 3</div>
            <div style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--wf-ink-2)' }}>
              · Lead with rule-of-three text frame.<br/>
              · Cut at 0.6s — match #0042 cadence.<br/>
              · Avoid pace drift; hold under 1.1×.
            </div>
          </div>
          <div className="wf-sketch" style={{ padding: 10 }}>
            <div className="wf-label" style={{ fontSize: 9, marginBottom: 6 }}>RECENT ARTIFACTS</div>
            {['Outline.md','Reference clip 0042','Hook script v2','Voice card · DNA'].map((a, i) => (
              <div key={i} style={{ padding: '4px 0', borderTop: i ? '1px solid var(--wf-line)' : 'none', fontSize: 10, color: 'var(--wf-ink-2)' }}>{a}</div>
            ))}
          </div>
        </aside>
      </div>
    </D2Shell>
  );
}

// ────────────────────────────────────────────────────────────────
// 4. INSIGHTS — Intelligence group, ⌘J pane closed by default
// ────────────────────────────────────────────────────────────────
function D2_Insights() {
  return (
    <D2Shell
      group="intelligence"
      activeSurface="insights"
      cmdJOpen={false}
      pins={[
        { n: 1, text: 'Intelligence group · same chrome',                          top: 8, left: 0, right: 0 },
        { n: 2, text: 'Sub-tabs · Overview / Retention / Hooks / Audience',        top: 50, left: 200 },
        { n: 3, text: 'Right rail · Creator / Memory / Run-a-study (in-page · NOT chat)', top: 110, right: 50, arrowDir: 'right' },
        { n: 4, text: 'NO anchored composer · ⌘J handle waits at the right edge', top: 280, right: 0, arrowDir: 'right' },
      ]}
    >
      <V3SubTabs tabs={['Overview', 'Retention', 'Hooks', 'Audience']} active="Retention" />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, padding: 18, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="wf-row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Retention · 30d</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="wf-tag">All formats</span>
              <span className="wf-tag" style={{ background: 'var(--wf-ink)', color: '#fff', borderColor: 'var(--wf-ink)' }}>Carousels</span>
              <span className="wf-tag">Reels</span>
              <span className="wf-tag">Shorts</span>
            </div>
          </div>

          <div className="wf-sketch" style={{ padding: 14 }}>
            <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="wf-label">RETENTION CURVE · DIVE SAFETY CAROUSELS</span>
              <span className="wf-meta">slide 1 → slide 8</span>
            </div>
            <div style={{ height: 130, position: 'relative', background: 'var(--wf-paper-2)', borderRadius: 4, padding: 8 }}>
              <svg viewBox="0 0 400 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <path d="M0 10 L50 18 L100 28 L150 42 L200 58 L250 72 L300 80 L350 84 L400 88" stroke="var(--wf-accent)" strokeWidth="2" fill="none" />
                <path d="M0 10 L50 18 L100 28 L150 42 L200 58 L250 72 L300 80 L350 84 L400 88 L400 110 L0 110 Z" fill="var(--wf-accent)" opacity="0.12" />
                <circle cx="150" cy="42" r="4" fill="var(--wf-note)" />
              </svg>
              <div style={{ position: 'absolute', top: 28, left: '36%', fontSize: 10, color: 'var(--wf-note)', fontFamily: 'Kalam, cursive' }}>← drop · slide 4</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 12 }}>
            <div className="wf-sketch" style={{ padding: 12 }}>
              <div className="wf-label" style={{ marginBottom: 8 }}>HEATMAP · slide × week</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2 }}>
                {Array.from({ length: 32 }, (_, i) => {
                  const v = (Math.sin(i * 1.7) + 1) / 2;
                  return <div key={i} style={{ paddingBottom: '100%', background: `rgba(13,148,136,${0.15 + v * 0.65})`, borderRadius: 2 }} />;
                })}
              </div>
              <div className="wf-meta" style={{ marginTop: 6, fontSize: 9 }}>4 weeks · slides 1–8</div>
            </div>
            <div className="wf-sketch" style={{ padding: 12 }}>
              <div className="wf-label" style={{ marginBottom: 8 }}>POSTS · 30d</div>
              {[
                ['#0042', 'Fiji · dive safety 02', 'Carousel', '81%'],
                ['#0051', 'Wreck dive · safety',   'Carousel', '77%'],
                ['#0038', 'Reef · 3 rules',        'Carousel', '74%'],
                ['#0067', 'Night dive recap',      'Reel',     '69%'],
                ['#0055', 'Tank check',            'Carousel', '63%'],
              ].map((r, i) => (
                <div key={i} style={{ padding: '6px 4px', borderBottom: i < 4 ? '1px solid var(--wf-line)' : 'none', display: 'flex', gap: 8, fontSize: 10.5, alignItems: 'center' }}>
                  <span className="wf-meta" style={{ width: 38 }}>{r[0]}</span>
                  <span style={{ flex: 1 }}>{r[1]}</span>
                  <span className="wf-tag" style={{ fontSize: 9 }}>{r[2]}</span>
                  <span style={{ width: 36, textAlign: 'right', fontWeight: 600 }}>{r[3]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ width: 220, flex: '0 0 220px', borderLeft: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
          <div className="wf-sketch" style={{ padding: 10 }}>
            <div className="wf-label" style={{ marginBottom: 6 }}>CREATOR · DNA</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['rule-of-three','medium-fast','wry','underwater'].map(c => <span key={c} className="wf-tag" style={{ fontSize: 10 }}>{c}</span>)}
            </div>
          </div>
          <div className="wf-sketch" style={{ padding: 10 }}>
            <div className="wf-label" style={{ marginBottom: 6 }}>MEMORY · pinned</div>
            <div style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--wf-ink-2)' }}>
              · Slide 4 is the danger frame.<br/>
              · Reef topics grow audience.
            </div>
          </div>
          <div className="wf-sketch wf-sketch-dashed" style={{ padding: 10 }}>
            <div className="wf-label" style={{ marginBottom: 4 }}>RUN A STUDY</div>
            <div style={{ fontSize: 10, color: 'var(--wf-ink-2)' }}>Test a slide-3 prompt against the slide-4 drop?</div>
            <div className="wf-tag wf-tag-route" style={{ fontSize: 10, marginTop: 6 }}>Start →</div>
          </div>
          <div className="wf-sketch wf-sketch-thin" style={{ padding: 8, fontSize: 10, color: 'var(--wf-ink-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--wf-accent-soft)', border: '1px solid var(--wf-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--wf-accent)', fontWeight: 700 }}>?</span>
            <span style={{ flex: 1 }}>Open chat scoped to this view</span>
            <KeyCombo keys={['⌘','J']} />
          </div>
        </aside>
      </div>
    </D2Shell>
  );
}

// ────────────────────────────────────────────────────────────────
// 5. RELEASE — Output group, sub-tabs, merged Repurpose+Publishing
// ────────────────────────────────────────────────────────────────
function D2_Release() {
  return (
    <D2Shell
      group="output"
      activeSurface="release"
      pins={[
        { n: 1, text: 'Output group · 3 surfaces',                                top: 70, left: 12 },
        { n: 2, text: 'Sub-tabs absorb both old surfaces',                        top: 50, left: 200 },
        { n: 3, text: 'Right · 3 platform variants (IG · TikTok · YT Short)',     top: 130, right: 12, arrowDir: 'right' },
        { n: 4, text: '/repurpose and /publishing legacy URLs redirect here',    bottom: 14, left: 200 },
      ]}
    >
      <V3SubTabs tabs={['Queue', 'Calendar', 'Suggestions', 'Settings']} active="Queue" />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Queue · 7 pending</h2>
            <span className="wf-tag wf-tag-panel">+ New release</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['Tue · 4:30p', 'Dive safety · 03',     ['IG','TT','YT'], 'Reel · 0:42', 'scheduled'],
              ['Wed · 9:00a', 'Carousel hooks · 02',  ['IG'],            'Carousel · 8 slides', 'draft'],
              ['Wed · 6:15p', 'Reef rules · short',   ['TT','YT'],       'Short · 0:28', 'scheduled'],
              ['Thu · 11:00a','Dive safety · 04',     ['IG','TT','YT'], 'Reel · 0:51', 'needs review'],
              ['Fri · 5:00p', 'Wreck recap',          ['IG','YT'],       'Reel · 1:04', 'scheduled'],
              ['Sat · 10:00a','Tank check',           ['TT'],            'Short · 0:31', 'draft'],
              ['Mon · 8:30a', 'Dive safety · 05',     ['IG','TT','YT'], 'Reel · TBD', 'placeholder'],
            ].map((r, i) => (
              <div key={i} style={{ padding: '10px 10px', borderRadius: 4, border: '1px solid var(--wf-line)', background: i === 0 ? 'var(--wf-accent-soft)' : 'var(--wf-paper)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 70, fontSize: 10, color: 'var(--wf-ink-2)' }}>{r[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600 }}>{r[1]}</div>
                  <div className="wf-meta">{r[3]}</div>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {r[2].map(p => (
                    <span key={p} style={{ width: 22, height: 22, borderRadius: 4, background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--wf-ink-2)' }}>{p}</span>
                  ))}
                </div>
                <span className="wf-tag" style={{ fontSize: 10, color: r[4] === 'needs review' ? 'var(--wf-note)' : r[4] === 'placeholder' ? 'var(--wf-ink-3)' : 'var(--wf-ink-2)', borderColor: r[4] === 'needs review' ? 'var(--wf-note)' : 'var(--wf-line-2)' }}>{r[4]}</span>
              </div>
            ))}
          </div>
        </div>
        <aside style={{ width: 360, flex: '0 0 360px', borderLeft: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
          <div className="wf-row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="wf-label">PREVIEW · Dive safety · 03</div>
              <div className="wf-meta">Reel · 0:42 · ready Tue 4:30p</div>
            </div>
            <span className="wf-tag wf-tag-route">Edit in Studio →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {['IG Reel','TikTok','YT Short'].map((p, i) => (
              <div key={p} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <PhoneMini w={92} h={166} />
                <span className="wf-tag" style={{ fontSize: 9 }}>{p}</span>
                <span className="wf-meta" style={{ fontSize: 9 }}>{['caption','hashtags','title'][i]}</span>
              </div>
            ))}
          </div>
          <div className="wf-sketch" style={{ padding: 10 }}>
            <div className="wf-label" style={{ marginBottom: 4 }}>SUGGESTIONS</div>
            <div style={{ fontSize: 10, color: 'var(--wf-ink-2)', lineHeight: 1.5 }}>
              · Lift hook to 0.4s · matches your top 3 carousels<br/>
              · Move TikTok to 5:40p · audience peak window
            </div>
          </div>
        </aside>
      </div>
    </D2Shell>
  );
}

// ────────────────────────────────────────────────────────────────
// 6. STUDIO — fenced
// ────────────────────────────────────────────────────────────────
function D2_Studio() {
  return (
    <D2Shell
      group="workspace"
      activeSurface="studio"
      pins={[
        { n: 1, text: 'STUDIO IS FENCED · shell hosts only · no internal changes',          top: 50, left: 200 },
        { n: 2, text: 'Studio sub-nav · Board / Calendar / List · 6-step flow visible',    top: 100, left: 200 },
        { n: 3, text: '⌘J still works · scoped to current Studio project',                  top: 100, right: 0, arrowDir: 'right' },
      ]}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--wf-paper)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 10px', background: 'var(--wf-note-soft)', borderBottomLeftRadius: 4, fontSize: 10, color: 'var(--wf-note)', fontFamily: 'Kalam, cursive', zIndex: 4 }}>↓ Studio internals · not modified</div>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--wf-line)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <span className="wf-title" style={{ fontSize: 13 }}>Studio</span>
          <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--wf-paper-2)', borderRadius: 4 }}>
            {['Board','Calendar','List'].map((v, i) => (
              <span key={v} style={{ padding: '4px 10px', fontSize: 10, borderRadius: 3, background: i === 0 ? 'var(--wf-paper)' : 'transparent', border: i === 0 ? '1px solid var(--wf-line-2)' : '1px solid transparent', fontWeight: i === 0 ? 600 : 400 }}>{v}</span>
            ))}
          </div>
          <span className="wf-meta">|</span>
          <span className="wf-meta">3 active projects · 12 archived</span>
          <div style={{ flex: 1 }} />
          <span className="wf-tag wf-tag-panel">+ New project</span>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, minHeight: 0 }}>
          {[
            ['CONCEPT', ['New idea: night dive']],
            ['OUTLINE', ['Carousel hooks audit']],
            ['SCRIPT',  ['Dive safety · ep 4', 'Wreck recap']],
            ['SHOOT',   ['Reef rules']],
            ['EDIT',    ['March Clip Lab batch']],
            ['PUBLISH', ['Dive safety · ep 3']],
          ].map((col, i) => (
            <div key={col[0]} style={{ borderRight: i < 5 ? '1px solid var(--wf-line)' : 'none', padding: 10, display: 'flex', flexDirection: 'column', gap: 6, background: i % 2 ? 'var(--wf-paper)' : 'var(--wf-paper-2)' }}>
              <div className="wf-label" style={{ marginBottom: 4 }}>{col[0]}</div>
              {col[1].map((card, j) => (
                <div key={j} className="wf-sketch wf-sketch-thin" style={{ padding: 8, fontSize: 10.5, background: 'var(--wf-paper)' }}>
                  <div style={{ fontWeight: 600 }}>{card}</div>
                  <div className="wf-meta" style={{ fontSize: 9, marginTop: 4 }}>step {i + 1}/6 · {['Mon','Tue','Wed'][j % 3]}</div>
                  <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
                    {[1,2,3,4,5,6].map(n => (
                      <div key={n} style={{ flex: 1, height: 3, borderRadius: 1, background: n <= i + 1 ? 'var(--wf-accent)' : 'var(--wf-line)' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </D2Shell>
  );
}

// ────────────────────────────────────────────────────────────────
// 7. DEEP — Library → Stories lens → Fiji series → clip 0042 (3-col + ⌘J)
// ────────────────────────────────────────────────────────────────
function D2_Deep() {
  return (
    <D2Shell
      group="workspace"
      activeSurface="library"
      cmdJOpen={true}
      cmdJScope="clip 0042"
      leading={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
          <div className="wf-box" style={{ width: 22, height: 22, background: '#1a1a1a', color: '#fafaf7', border: 'none', fontSize: 10, fontWeight: 700 }}>C</div>
          <span className="wf-meta">Library</span>
          <span className="wf-meta">/</span>
          <span className="wf-meta">Stories</span>
          <span className="wf-meta">/</span>
          <span className="wf-meta">Fiji series</span>
          <span className="wf-meta">/</span>
          <span style={{ color: 'var(--wf-ink)', fontWeight: 600 }}>clip 0042</span>
        </div>
      }
      pins={[
        { n: 1, text: 'Breadcrumb · 4 levels · group tab still on Workspace',              top: 8,  left: 12 },
        { n: 2, text: 'Library "Stories" lens (was a separate surface — now a tab)',     top: 50,  left: 200 },
        { n: 3, text: '3-column · clips list + phone preview + ⌘J pane (open)',          top: 110, left: 200 },
        { n: 4, text: '⌘J pane scoped to clip 0042 · permanent dock when open',           top: 110, right: 12, arrowDir: 'right' },
      ]}
    >
      <V3SubTabs tabs={['All', 'Published', 'Drafts', 'Stories']} active="Stories" />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* clips list */}
        <div style={{ width: 240, flex: '0 0 240px', borderRight: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)', padding: 12, overflow: 'auto' }}>
          <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="wf-label">FIJI SERIES · 12 clips</span>
            <span className="wf-meta">grid</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {Array.from({ length: 12 }, (_, i) => {
              const id = String(40 + i).padStart(4, '0');
              const active = i === 2;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: 4, borderRadius: 4, background: active ? 'var(--wf-accent-soft)' : 'transparent', border: active ? '1px solid var(--wf-accent)' : '1px solid transparent' }}>
                  <PhoneMini w={70} h={120} />
                  <span className="wf-meta" style={{ fontSize: 9 }}>#{id}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* phone preview */}
        <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <div className="wf-row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Clip #0042 · Fiji · dive safety 02</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="wf-tag" style={{ fontSize: 10 }}>Reel</span>
              <span className="wf-tag" style={{ fontSize: 10 }}>0:42</span>
              <span className="wf-tag wf-tag-panel" style={{ fontSize: 10 }}>retention 81%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <PhoneMini w={200} h={356} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="wf-label">METADATA</div>
              <div className="wf-sketch" style={{ padding: 10, fontSize: 11 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 5, color: 'var(--wf-ink-2)' }}>
                  <span className="wf-meta">Posted</span><span>Mar 2 · 4:30p</span>
                  <span className="wf-meta">Hook</span><span>rule-of-three text frame</span>
                  <span className="wf-meta">DNA tag</span><span>safety · medium-fast · wry</span>
                  <span className="wf-meta">Series</span><span>Fiji · ep 02</span>
                  <span className="wf-meta">Variants</span><span>IG · TT · YT</span>
                </div>
              </div>
              <div className="wf-label">CAPTION</div>
              <div className="wf-sketch wf-sketch-thin" style={{ padding: 10, fontSize: 11, lineHeight: 1.55 }}>
                Three things — only three — keep you alive past 30 meters. Number two saved my life in the wreck. ↓
              </div>
            </div>
          </div>
        </div>
      </div>
    </D2Shell>
  );
}

Object.assign(window, {
  D2_Shell, D2_Home, D2_Chat, D2_Insights, D2_Release, D2_Studio, D2_Deep,
});
