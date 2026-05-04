/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSlider, TweakColor, TweakToggle */
/* global CF_StudioThreadsLanding, CF_StudioThreadsActive, CF_StudioDrafts, CF_StudioSchedule, CF_AudienceOverview, CF_AudienceComments, CF_LibraryAll, CF_LibraryDraftDetail, CF_PulseForYou, CF_CmdK */
/* global CF_StudioBrandVoice, CF_AudienceRetention, CF_AudienceFollowers, CF_AudienceSegments, CF_LibraryPosts, CF_LibraryDraftsList, CF_LibraryCharts, CF_LibraryNotes, CF_LibraryDecisions, CF_PulseNiche, CF_PulseYourAudience, CF_PulseMentions */

// ─────────────────────────────────────────────────────────────
// Direction 1 · workspace model
// 4 workspaces: Studio · Audience · Library · Pulse
// Chat is the interaction model, not a tab. Sub-tabs per workspace.
// ─────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent":      "#0d9488",
  "density":     "default",
  "radius":      4,
  "showHeaders": true
}/*EDITMODE-END*/;

const SCREEN_W = 1440;
const SCREEN_H = 900;

// ───── Cover atoms ─────

function Headline() {
  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: 1440 }}>
      <div className="wf-label" style={{ fontSize: 11, marginBottom: 6 }}>SHELL EXPLORE · ROUND 5 · WORKSPACES, NOT VIEWS</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.015em', marginBottom: 4 }}>Studio · Audience · Library · Pulse.</div>
      <div style={{ fontFamily: 'Kalam, cursive', fontSize: 16, color: '#d97706' }}>Four workspaces, each with its own sub-tabs and a scoped composer. Chat lives inside every workspace, not as a tab of its own.</div>
    </div>
  );
}

function SystemCard() {
  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: 1440, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
      <div style={{ background: '#fafaf7', border: '1.5px solid #4a4a4a', borderRadius: 6, padding: 18 }}>
        <div className="wf-label" style={{ marginBottom: 10 }}>NAV · 4 WORKSPACES · PERPLEXITY MODEL</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { tab: 'Studio',   role: 'Make',    sub: 'Threads · Drafts · Schedule · Brand voice',                desc: 'The making surface. Chat threads, drafts, scheduled posts. Hero composer on the threads landing, docked composer in-thread.' },
            { tab: 'Audience', role: 'Mirror',  sub: 'Overview · Retention · Comments · Followers · Segments',  desc: 'Analytics + replies. Every card has an "open in chat" hand-off. Composer scoped: "Ask anything about your audience."' },
            { tab: 'Library',  role: 'Ledger',  sub: 'All · Posts · Drafts · Charts · Notes · Decisions',        desc: 'Durable artifacts. ◉ chat badge on anything produced by a thread. Composer is search + ask.' },
            { tab: 'Pulse',    role: 'Signal',  sub: 'For you · Creator niche · Your audience · Mentions',       desc: 'Feed of audience activity, niche trends, mentions. No composer — this surface is signal, not interaction.' },
          ].map(r => (
            <div key={r.tab} style={{ display: 'grid', gridTemplateColumns: '80px 60px 1fr', gap: 12, alignItems: 'baseline', fontSize: 11.5, padding: '8px 0', borderBottom: '1px solid #e8e5dd' }}>
              <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{r.tab}</span>
              <span style={{ fontFamily: 'Kalam, cursive', color: '#d97706', fontSize: 13 }}>{r.role}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ color: '#1a1a1a', lineHeight: 1.5 }}>{r.desc}</span>
                <span style={{ color: '#6a6a6a', fontSize: 10.5, fontFamily: 'monospace' }}>↳ {r.sub}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11.5, color: '#4a4a4a', lineHeight: 1.55 }}>
          <strong>What changed:</strong> "Chat" is no longer a tab — it's the interaction model present in Studio, Audience, and Library. Side rails are now <em>optional</em> per sub-view (hybrid) instead of a permanent system. Composer placement is <em>contextual</em>: hero on empty states, bar at top of content-heavy sub-views, none on Pulse.
        </div>
      </div>

      <div style={{ background: '#fafaf7', border: '1.5px solid #4a4a4a', borderRadius: 6, padding: 18 }}>
        <div className="wf-label" style={{ marginBottom: 10 }}>COMPOSER · SCOPED PER WORKSPACE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 11.5 }}>
          {[
            { where: 'Studio · landing',     text: 'Hero composer, centered. "Draft anything, or ask to make something." Suggestion links below.' },
            { where: 'Studio · in thread',   text: 'Docked below the conversation. Reply placeholder. Quick-follow chips.' },
            { where: 'Studio · Drafts/Schedule', text: 'Bar at top of content. Same Studio scope, sits above the grid/calendar.' },
            { where: 'Audience',             text: 'Bar at top. "Ask anything about your audience…" — scoped to current sub-view (Overview, Retention, etc.)' },
            { where: 'Library',              text: 'Bar at top. "Search your library, or ask…" — dual-purpose: filter + conversation.' },
            { where: 'Pulse',                text: 'No composer. Feed only. Each story has "Draft a reply" which jumps to Studio.' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 10, padding: '5px 0', borderBottom: i < 5 ? '1px solid #e8e5dd' : 'none', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{r.where}</span>
              <span style={{ color: '#4a4a4a', lineHeight: 1.5 }}>{r.text}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 10, background: '#fff7ed', border: '1px dashed #d97706', borderRadius: 4, fontSize: 11, color: '#7b5f1c', lineHeight: 1.55 }}>
          <strong>⌘K overlays this everywhere.</strong> Mixes "continue a thread" (from Studio), "jump to" (any sub-view), and "ask in context" (new thread scoped to current workspace). ⌘↵ opens the last option in a new thread.
        </div>
      </div>
    </div>
  );
}

function ScreensRow({ screens }) {
  const tw = 268;
  const th = (SCREEN_H * tw) / SCREEN_W;
  const sc = tw / SCREEN_W;
  const Cell = ({ s, n }) => (
    <div>
      <div style={{ width: tw, height: th, border: '1.5px solid #4a4a4a', borderRadius: 4, overflow: 'hidden', background: '#fafaf7', position: 'relative' }}>
        <div style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${sc})`, transformOrigin: 'top left' }}>
          {s.render()}
        </div>
        <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(255,255,255,0.92)', border: '1px solid #4a4a4a', borderRadius: 2, padding: '0 4px', fontSize: 9, fontWeight: 600, color: '#1a1a1a' }}>{n}</div>
      </div>
      <div style={{ marginTop: 5, fontSize: 10.5, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.25 }}>{s.label}</div>
      <div style={{ fontSize: 9.5, color: '#6a6a6a' }}>{s.note}</div>
    </div>
  );
  const cols = 5;
  const rows = [];
  for (let i = 0; i < screens.length; i += cols) rows.push(screens.slice(i, i + cols));
  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', padding: 14 }}>
      <div className="wf-label" style={{ marginBottom: 10 }}>{screens.length} SCREENS · 4 WORKSPACES × ALL SUB-TABS · + 1 GLOBAL OVERLAY</div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tw}px)`, gap: 12, marginBottom: ri < rows.length - 1 ? 14 : 0, justifyContent: 'start' }}>
          {row.map((s, ci) => <Cell key={s.id} s={s} n={ri * cols + ci + 1} />)}
        </div>
      ))}
    </div>
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

  // All 23 screens. Grouped by workspace + sub-tab.
  const studioScreens = [
    { id: 'st-threads-l',  label: 'Studio · Threads (landing)',  note: 'hero composer · empty state',         render: () => <CF_StudioThreadsLanding /> },
    { id: 'st-threads-a',  label: 'Studio · Threads (active)',   note: 'thread rail + draft block',            render: () => <CF_StudioThreadsActive /> },
    { id: 'st-drafts',     label: 'Studio · Drafts',             note: 'grid · status dots',                   render: () => <CF_StudioDrafts /> },
    { id: 'st-schedule',   label: 'Studio · Schedule',           note: 'week grid',                            render: () => <CF_StudioSchedule /> },
    { id: 'st-voice',      label: 'Studio · Brand voice',        note: 'codified voice · do/don\'t · examples', render: () => <CF_StudioBrandVoice /> },
  ];
  const audienceScreens = [
    { id: 'au-overview',   label: 'Audience · Overview',         note: 'KPIs + retention bar + quick asks',    render: () => <CF_AudienceOverview /> },
    { id: 'au-retention',  label: 'Audience · Retention',        note: 'deep heatmap chart',                   render: () => <CF_AudienceRetention /> },
    { id: 'au-comments',   label: 'Audience · Comments',         note: 'cluster rail + AI summary',            render: () => <CF_AudienceComments /> },
    { id: 'au-followers',  label: 'Audience · Followers',        note: 'cohort rail + table',                  render: () => <CF_AudienceFollowers /> },
    { id: 'au-segments',   label: 'Audience · Segments',         note: 'distribution + segment cards',         render: () => <CF_AudienceSegments /> },
  ];
  const libraryScreens = [
    { id: 'lb-all',        label: 'Library · All',               note: 'mixed artifacts · ◉ chat badge',       render: () => <CF_LibraryAll /> },
    { id: 'lb-posts',      label: 'Library · Posts',             note: 'published only',                       render: () => <CF_LibraryPosts /> },
    { id: 'lb-drafts',     label: 'Library · Drafts',            note: 'all drafts (read-only browse)',        render: () => <CF_LibraryDraftsList /> },
    { id: 'lb-charts',     label: 'Library · Charts',            note: 'saved charts · mostly chat-born',      render: () => <CF_LibraryCharts /> },
    { id: 'lb-notes',      label: 'Library · Notes',             note: 'voice + text notes',                   render: () => <CF_LibraryNotes /> },
    { id: 'lb-decisions',  label: 'Library · Decisions',         note: 'editorial memory',                     render: () => <CF_LibraryDecisions /> },
    { id: 'lb-detail',     label: 'Library · Draft detail',      note: 'canvas + provenance',                  render: () => <CF_LibraryDraftDetail /> },
  ];
  const pulseScreens = [
    { id: 'pl-foryou',     label: 'Pulse · For you',             note: 'feed · no composer',                   render: () => <CF_PulseForYou /> },
    { id: 'pl-niche',      label: 'Pulse · Creator niche',       note: 'tracked creators · trends',            render: () => <CF_PulseNiche /> },
    { id: 'pl-audience',   label: 'Pulse · Your audience',       note: 'audience-specific signal',             render: () => <CF_PulseYourAudience /> },
    { id: 'pl-mentions',   label: 'Pulse · Mentions',            note: 'reply-workflow filter',                render: () => <CF_PulseMentions /> },
  ];
  const overlayScreens = [
    { id: 'ov-cmdk',       label: '⌘K overlay',                  note: 'continue · jump · ask in context',     render: () => <CF_CmdK /> },
  ];
  const allScreens = [...studioScreens, ...audienceScreens, ...libraryScreens, ...pulseScreens, ...overlayScreens];
  const screens = allScreens; // for ScreensRow contact-sheet

  return (
    <>
      <DesignCanvas>
        <DCSection id="cover" title="Direction 1 · Workspace model" subtitle="4 workspaces (Studio · Audience · Library · Pulse). Chat is the interaction model, present everywhere. Composer scoped per workspace.">
          <DCArtboard id="headline"  label="headline"            width={1440} height={120}><Headline /></DCArtboard>
          <DCArtboard id="system"    label="the system"          width={1440} height={560}><SystemCard /></DCArtboard>
          <DCArtboard id="contact"   label="all 23 screens"      width={1440} height={920}><ScreensRow screens={allScreens} /></DCArtboard>
        </DCSection>

        <DCSection id="studio" title="Studio workspace" subtitle="Threads (landing + active) · Drafts · Schedule · Brand voice.">
          {studioScreens.map(s => (
            <DCArtboard key={s.id} id={s.id} label={s.label} width={SCREEN_W} height={SCREEN_H}>{s.render()}</DCArtboard>
          ))}
        </DCSection>

        <DCSection id="audience" title="Audience workspace" subtitle="Overview · Retention · Comments · Followers · Segments.">
          {audienceScreens.map(s => (
            <DCArtboard key={s.id} id={s.id} label={s.label} width={SCREEN_W} height={SCREEN_H}>{s.render()}</DCArtboard>
          ))}
        </DCSection>

        <DCSection id="library" title="Library workspace" subtitle="All · Posts · Drafts · Charts · Notes · Decisions · Draft detail.">
          {libraryScreens.map(s => (
            <DCArtboard key={s.id} id={s.id} label={s.label} width={SCREEN_W} height={SCREEN_H}>{s.render()}</DCArtboard>
          ))}
        </DCSection>

        <DCSection id="pulse" title="Pulse workspace" subtitle="For you · Creator niche · Your audience · Mentions.">
          {pulseScreens.map(s => (
            <DCArtboard key={s.id} id={s.id} label={s.label} width={SCREEN_W} height={SCREEN_H}>{s.render()}</DCArtboard>
          ))}
        </DCSection>

        <DCSection id="overlays" title="Global overlays" subtitle="⌘K command bar.">
          {overlayScreens.map(s => (
            <DCArtboard key={s.id} id={s.id} label={s.label} width={SCREEN_W} height={SCREEN_H}>{s.render()}</DCArtboard>
          ))}
        </DCSection>
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
