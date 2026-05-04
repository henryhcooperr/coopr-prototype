/* global React, window, HfShell */
/* hifi-cliplab.jsx — Clip Lab · Studio sub-tab.

   Five surfaces for the redefined Clip Lab feature (D1 v1, 2026-04-30).
   Clip Lab is for evaluating a single clip: drop one in, get a verdict,
   suggested moments, and edit suggestions. Not a hard-drive sync surface.

   IA stance: STUDIO SUB-TAB (between Workspace and Docs).
     - Clip Lab evaluates · suggests · improves a single clip the creator
       points it at. Output flows into Studio drafts or the publishing
       queue. Co-locating with Studio keeps the agent vocabulary shared.
     - Adding as an 8th workspace would inflate chrome (currently 7).
     - In-doc block is too constrained — Clip Lab needs its own canvas
       for the player + per-edit review surfaces.

   Five components (all exposed on window):
     - HF_ClipLabEmpty     · day-one state · "Drop a clip. Get a verdict in 30 seconds."
     - HF_ClipLabImport    · clip preview + 3-task picker (diagnose / moments / edits)
     - HF_ClipLabAutoClips · 12 best moments inside the clip · 4×3 grid · why-tag + lift
     - HF_ClipLabReview    · 5 inline edit suggestions · accept/skip chips · verdict pane
     - HF_ClipLabExport    · ship plan · 3 platform targets (IG Reel / TikTok / YT Short)

   Coopr vocabulary mirrors the R6 agent co-editor primitives in hifi-studio-r3.jsx
   (R_DocAgentPresence, R_AgentAddedRow). Local analogs (CL_AgentBand) redefined
   here so this file has no soft dependency on Studio load order beyond the
   standard R4 visuals foundation (R4ThumbBackdrop, R4_TONE_PALETTES, R4Chip). */

const CL = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

// ─── Step navigation helpers (D2) ─────────────────────────
// useClipLabStepNav() — defensive accessor over useMasterState. The 5 surfaces
// also mount inside legacy `app-hifi-r4.jsx` artboards which are NOT wrapped
// in MasterStateProvider; useMasterState() throws there. We catch and return
// no-op handlers so the legacy artboard view still renders.
//
// Inside the master prototype (master.html → MasterStateProvider), this
// returns real `setDetail` / `clearDetail` from the router, wired so the
// step CTAs drive the URL hash to #interactive/studio/Clip Lab/step/<id>.
function useClipLabStepNav() {
  let ctx = null;
  try { ctx = window.useMasterState && window.useMasterState(); } catch (_) { ctx = null; }
  const noop = () => {};
  const setDetail = ctx ? ctx.setDetail : noop;
  const clearDetail = ctx ? ctx.clearDetail : noop;
  return {
    goStep: (step) => setDetail('step', step),
    goEmpty: () => clearDetail(),
  };
}

// CL_StepBack — inline back-chevron for non-Empty steps. Steps further along
// the chain go back to the previous step; step='import' clears detail to
// land on Empty. Tokens-only, mirrors MasterDetailBackChevron typography but
// inline at the top of the surface, since each step renders its own chrome.
function CL_StepBack({ to, label }) {
  const { goStep, goEmpty } = useClipLabStepNav();
  const [hover, setHover] = React.useState(false);
  const handle = () => { if (to === 'empty') goEmpty(); else goStep(to); };
  const color = hover ? 'var(--accent-primary)' : 'var(--fg-secondary)';
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handle(); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 999,
        cursor: 'pointer', userSelect: 'none',
        color,
        background: hover ? 'var(--accent-soft)' : 'transparent',
        transition: 'color 200ms ease, background 200ms ease',
      }}
      aria-label={'Back to ' + label}>
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M7 2 L3 5 L7 8 M3 5 L8 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: CL.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
    </span>
  );
}

// ─── Local primitives ────────────────────────────────────
function CL_Eyebrow({ children, c = 'var(--fg-tertiary)', s = 9.5, st = {} }) {
  return <span style={{ fontFamily: CL.mono, fontSize: s, color: c, letterSpacing: '0.14em', textTransform: 'uppercase', ...st }}>{children}</span>;
}

function CL_AnalysisHead({ eyebrow, title, hint }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 18,
      paddingBottom: 12,
      borderBottom: '1px solid var(--accent-soft)',
      marginBottom: 18,
    }}>
      <div>
        <div style={{ fontFamily: CL.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 4 }}>{eyebrow}</div>
        <h2 style={{ margin: 0, fontFamily: CL.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1 }}>{title}</h2>
      </div>
      {hint && <span style={{ fontFamily: CL.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{hint}</span>}
    </header>
  );
}

// "Coopr is here" presence band — local analog of R_DocAgentPresence.
// Used at the top of every Clip Lab surface to make the agent a participant
// in the lab, not a chatbot beside it.
function CL_AgentBand({ activity = 'Watching this clip with you', when = 'just now', countLabel = 'PICK A TASK →' }) {
  return (
    <div style={{
      maxWidth: 980, margin: '20px 0 0',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      background: 'var(--accent-soft)',
      border: '1px solid transparent',
      borderRadius: 999,
    }}>
      <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="var(--fg-on-accent)" /></svg>
      </div>
      <span style={{ fontFamily: CL.sans, fontSize: 11.5, color: 'var(--accent-primary-press)', fontWeight: 600 }}>Coopr is in this lab.</span>
      <span style={{ fontFamily: CL.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--accent-primary-press)' }}>{activity}.</span>
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: CL.mono, fontSize: 9.5, color: 'var(--accent-primary-press)' }}>{when}</span>
      <span style={{ fontFamily: CL.mono, fontSize: 9.5, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.06em' }}>{countLabel}</span>
    </div>
  );
}

// Topbar utility chip — reused across all 5 surfaces. Search affordance is
// scoped to clip-relevant indices (transcripts, moments, source takes).
function CL_Topbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--surface-2)', fontFamily: CL.sans, fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
        <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
        <span>Search clips, transcripts, moments…</span>
      </span>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: CL.sans, fontSize: 11, fontWeight: 700 }}>H</span>
    </div>
  );
}

// 9:16 vertical clip thumb · auto-detected. Uses R4ThumbBackdrop tone palette
// for the gradient background + a synthetic on-screen-text overlay so the
// thumb reads as a real short-form post, with Coopr-source badge + score pill.
function CL_ClipCard({ clip }) {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
      <div style={{
        position: 'relative',
        aspectRatio: '9 / 16',
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        background: '#0a0a0a',
        boxShadow: '0 1px 3px rgba(15,14,12,0.10)',
      }}>
        <window.R4ThumbBackdrop tone={clip.tone}>
          <div style={{
            position: 'absolute', left: 12, top: 60, right: 14,
            fontFamily: CL.sans, fontSize: 14, fontWeight: 800, lineHeight: 1.05,
            color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.55)',
            whiteSpace: 'pre-wrap', textTransform: 'lowercase', letterSpacing: '-0.01em',
          }}>{clip.firstLine}</div>
        </window.R4ThumbBackdrop>

        {/* Coopr Suggests badge — top-left */}
        <div style={{
          position: 'absolute', left: 7, top: 7,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 7px',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          borderRadius: 4,
        }}>
          <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}>
            <path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" />
          </svg>
          <span style={{ fontFamily: CL.sans, fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Coopr</span>
        </div>

        {/* Predicted score pill — top-right */}
        <div style={{
          position: 'absolute', right: 7, top: 7,
          display: 'inline-flex', alignItems: 'baseline', gap: 3,
          padding: '3px 7px',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          borderRadius: 4,
        }}>
          <span style={{ fontFamily: CL.sans, fontSize: 11, fontWeight: 700, color: '#fff' }}>{clip.predictedScore}</span>
          <span style={{ fontFamily: CL.mono, fontSize: 8, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>PRED</span>
        </div>

        {/* Duration · bottom-left */}
        <span style={{
          position: 'absolute', left: 7, bottom: 7,
          padding: '2px 6px',
          background: 'rgba(0,0,0,0.55)',
          borderRadius: 3,
          fontFamily: CL.mono, fontSize: 9.5, color: '#fff', fontWeight: 700,
        }}>{clip.range}</span>

        {/* Source-clip ID · bottom-right */}
        <span style={{
          position: 'absolute', right: 7, bottom: 7,
          padding: '2px 6px',
          background: 'rgba(0,0,0,0.45)',
          borderRadius: 3,
          fontFamily: CL.mono, fontSize: 8.5, color: 'rgba(255,255,255,0.85)',
        }}>{clip.source}</span>
      </div>

      <div>
        <div style={{ fontFamily: CL.serif, fontStyle: 'italic', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.3 }}>{clip.caption}</div>
        <div style={{ marginTop: 4, fontFamily: CL.sans, fontSize: 11, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>{clip.rationale}</div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{
          flex: 1,
          padding: '5px 10px', textAlign: 'center',
          background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
          borderRadius: 5,
          fontFamily: CL.sans, fontSize: 11, fontWeight: 600,
        }}>Use</span>
        <span style={{
          padding: '5px 10px', textAlign: 'center',
          background: 'transparent', color: 'var(--fg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 5,
          fontFamily: CL.sans, fontSize: 11, fontWeight: 600,
        }}>Skip</span>
      </div>
    </article>
  );
}

// ─── Fixture data · 12 auto-detected clips ────────────────
// Captions/rationales are content (creator-flavored, fine per design rule 11);
// chrome strings (headers, buttons, status pills) stay creator-agnostic.
const CL_CLIPS = [
  { id: 'c01', range: '0:00–0:09', source: 'A001_C002', tone: 'midnight',  predictedScore: 81, firstLine: "eight seconds.\nthat's how long\nyou have",         caption: 'Cold-open · the eight-second declaration', rationale: 'Pure declarative · 0.0s open · already 9s · negligible re-cut.' },
  { id: 'c02', range: '4:08–4:24', source: 'A001_C002', tone: 'navy',      predictedScore: 79, firstLine: 'this is the\npart of the dive\nnobody films',       caption: 'The bow-shot scene', rationale: 'Highest watch · most-rewound moment in the source · 16s standalone.' },
  { id: 'c03', range: '0:24–0:36', source: 'A001_C001', tone: 'electric',  predictedScore: 74, firstLine: "you can't\ntalk faster.\nstart later",              caption: '"start later" beat', rationale: 'Declarative pivot · could lead a sibling variant in the same shape.' },
  { id: 'c04', range: '7:42–7:58', source: 'A001_C002', tone: 'deep-blue', predictedScore: 68, firstLine: 'my reg started\nfree-flowing\nat 28 metres',        caption: 'Cold-open · the free-flow', rationale: 'Opens hot · already structured for short-form.' },
  { id: 'c05', range: '2:14–2:30', source: 'A001_C003', tone: 'kelp',      predictedScore: 64, firstLine: 'most instructors\nstop doing this\nin year three', caption: 'Five mistakes · opener', rationale: 'Counter-intuitive · low confidence on the cut at 2:30.' },
  { id: 'c06', range: '5:01–5:14', source: 'A001_C002', tone: 'cyan',      predictedScore: 62, firstLine: 'one specific\nquestion before\nthe giant stride',  caption: 'Buddy-check question', rationale: 'Implicit list-of-N · could carry a series.' },
  { id: 'c07', range: '0:36–0:41', source: 'A001_C001', tone: 'electric',  predictedScore: 60, firstLine: "and you can't\ntalk faster",                       caption: 'Loop hook · "start later"', rationale: 'Natural loop point · seeds the next post in the series.' },
  { id: 'c08', range: '8:20–8:38', source: 'A001_C002', tone: 'midnight',  predictedScore: 58, firstLine: 'the part\nthe brochure\nleaves out',               caption: 'Decompression hang reflection', rationale: 'Introspective · pulls saves on IG.' },
  { id: 'c09', range: '1:48–2:02', source: 'A001_C004', tone: 'teal',      predictedScore: 54, firstLine: 'I trust my SPG\nover my dive\ncomputer',           caption: 'SPG declaration', rationale: 'Strong opening line · weaker middle. Trim 4s.' },
  { id: 'c10', range: '0:48–0:58', source: 'A001_C003', tone: 'green',     predictedScore: 51, firstLine: 'how to clean\na flooded mask\nwithout panic',      caption: 'How-to · mask flood', rationale: 'How-to format · save rate ceiling. Try a fail-state cold-open instead.' },
  { id: 'c11', range: '3:12–3:28', source: 'A001_C004', tone: 'steel',     predictedScore: 47, firstLine: 'DIN vs YOKE\nat 7:20.\nthe rewatched\nframe',       caption: 'DIN vs YOKE comparison', rationale: 'Highest-rewatched in source · pull as a teaser.' },
  { id: 'c12', range: '6:55–7:08', source: 'A001_C001', tone: 'amber',     predictedScore: 42, firstLine: 'a reply to\n@marina.k\non safety',                 caption: 'Reply · @marina.k', rationale: 'Reply format · narrow audience overlap. Worth a long-form follow-up.' },
];

// ───────────────────────────────────────────────────────
// 1. EMPTY · day-one state
// ───────────────────────────────────────────────────────
function HF_ClipLabEmpty({ state = 'happy' }) {
  // R10 · state variants — hooks BEFORE early returns.
  // 'happy' is already the day-one drop-zone view, so empty/happy collapse together
  // for this surface; loading + error still get their canonical heroes.
  const ovr = window.useSurfaceState && window.useSurfaceState('studio', 'Clip Lab');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  const { goStep } = useClipLabStepNav();
  if (s === 'loading') {
    return <HfShell workspace="studio" subtab="Clip Lab" topbarRight={<CL_Topbar />}><window.HF_SkeletonHero shape="grid" /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="studio" subtab="Clip Lab" topbarRight={<CL_Topbar />}><window.HF_ErrorHero
      title="Couldn't load Clip Lab."
      body="The clip index timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="studio" subtab="Clip Lab" topbarRight={<CL_Topbar />}><window.HF_EmptyHero
      eyebrow="Studio · Clip Lab · evaluate a clip"
      title="Drop a clip. Get a verdict in 30 seconds."
      caption="Paste a link or drop a file. Coopr returns a watch-curve, hook diagnosis, and three ways the clip could land."
      ctaLabel="Drop a clip"
    /></HfShell>;
  }
  const starters = [
    {
      id: 'evaluate-hook',
      eyebrow: 'Evaluate',
      title: 'Evaluate a hook',
      body: 'Run the cold-open through retention diagnosis and hook-DNA match against your library.',
    },
    {
      id: 'find-moments',
      eyebrow: 'Pull moments',
      title: 'Find the moments that work',
      body: 'Mark the three highest-watch beats inside the clip and tell you why each one earns the rewatch.',
    },
    {
      id: 'suggest-cuts',
      eyebrow: 'Re-cut',
      title: 'Suggest 3 cuts',
      body: 'Trim, restructure, and sharpen. Coopr proposes specific edits with a one-line reason for each.',
    },
  ];
  return (
    <HfShell workspace="studio" subtab="Clip Lab" topbarRight={<CL_Topbar />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 60px' }}>
        <div style={{ maxWidth: 760, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <CL_Eyebrow>Studio · Clip Lab · evaluate a clip</CL_Eyebrow>
          <h1 style={{ margin: 0, fontFamily: CL.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 52, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            Drop a clip. Get a verdict in 30 seconds.
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 580 }}>
            <p style={{ margin: 0, fontFamily: CL.sans, fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.65 }}>
              Paste a video link or drop a file. Coopr returns a watch-curve, a hook diagnosis, suggested cuts, and three ways the clip could land in a future post.
            </p>
            <p style={{ margin: 0, fontFamily: CL.sans, fontSize: 13.5, color: 'var(--fg-tertiary)', lineHeight: 1.65 }}>
              One clip at a time. The lab is for thinking through a single piece of footage — not bulk-importing a folder.
            </p>
          </div>

          {/* Three CTA chips at top */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
            {[
              { label: 'Drop a file', primary: true },
              { label: 'Paste a link', primary: false },
              { label: 'Pick from library', primary: false },
            ].map((c, i) => (
              <span
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => goStep('import')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStep('import'); } }}
                style={{
                  padding: '9px 18px',
                  background: c.primary ? 'var(--accent-primary)' : 'transparent',
                  color: c.primary ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                  border: c.primary ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  borderRadius: 999,
                  fontFamily: CL.sans, fontSize: 12, fontWeight: c.primary ? 700 : 600,
                  letterSpacing: '0.02em',
                  cursor: 'pointer', userSelect: 'none',
                }}>{c.label}</span>
            ))}
          </div>

          {/* Three starter tiles · pick a task */}
          <div style={{ width: '100%', marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <CL_Eyebrow s={9.5}>Or start from a question</CL_Eyebrow>
              <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {starters.map(s => (
                <article
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => goStep('import')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStep('import'); } }}
                  style={{
                    padding: '18px 16px 16px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    background: 'var(--surface-1)',
                    textAlign: 'left',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    cursor: 'pointer', userSelect: 'none',
                  }}>
                  <CL_Eyebrow s={9}>{s.eyebrow}</CL_Eyebrow>
                  <div style={{ fontFamily: CL.serif, fontStyle: 'italic', fontSize: 18, color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.2, fontWeight: 500 }}>{s.title}</div>
                  <div style={{ fontFamily: CL.sans, fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>{s.body}</div>
                </article>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 6, fontFamily: CL.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Clip Lab evaluates · suggests · improves. It does not back up your archive.
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// ───────────────────────────────────────────────────────
// 2. IMPORT · clip preview + task picker (diagnose / find / suggest edits)
// ───────────────────────────────────────────────────────
function HF_ClipLabImport() {
  const { goStep } = useClipLabStepNav();
  const clip = CL_CLIPS[1]; // c02 · the bow-shot scene · feels like a real cinematic clip
  const [picked, setPicked] = React.useState('diagnose');

  // Three task cards · the user picks ONE before the lab runs.
  const tasks = [
    {
      id: 'diagnose',
      eyebrow: 'Diagnose retention',
      title: 'Where do viewers drop?',
      body: 'Build the watch-curve. Mark the second-by-second decay and the moment the audience leaves.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 18 L7 12 L11 14 L15 7 L21 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="15" cy="7" r="1.6" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'moments',
      eyebrow: 'Pull moments',
      title: 'Find the best moments',
      body: 'Surface the three most usable beats inside the clip with timecodes and a why-it-works tag for each.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 14 L9 10 L13 13 L20 8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <circle cx="13" cy="13" r="1.4" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'edits',
      eyebrow: 'Re-cut',
      title: 'Suggest edits',
      body: 'Trim, restructure, sharpen. Coopr proposes 4-5 specific cuts with a one-line reason for each.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="6" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="6" cy="17" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 8.5 L20 16 M8 15.5 L20 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <HfShell workspace="studio" subtab="Clip Lab" topbarRight={<CL_Topbar />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)', padding: '24px 36px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <CL_StepBack to="empty" label="Day one" />
              <CL_Eyebrow>Studio · Clip Lab · pick a task</CL_Eyebrow>
            </div>
            <h1 style={{ margin: '6px 0 0', fontFamily: CL.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 36, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              What should Coopr do with this clip?
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <CL_Eyebrow s={10}>Replace clip</CL_Eyebrow>
            <span style={{ padding: '6px 14px', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: CL.sans, fontSize: 11.5, color: 'var(--fg-secondary)', fontWeight: 600 }}>Choose another</span>
          </div>
        </div>

        <CL_AgentBand activity="Read 16 seconds of footage · transcript ready · waiting on a task" when="just now" countLabel="PICK ONE →" />

        {/* Two-column · clip preview + task picker */}
        <section style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'start' }}>
          {/* Left · single clip preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              position: 'relative',
              aspectRatio: '9 / 16',
              width: '100%',
              borderRadius: 10,
              overflow: 'hidden',
              background: '#0a0a0a',
              boxShadow: '0 4px 18px rgba(15,14,12,0.10)',
            }}>
              <window.R4ThumbBackdrop tone={clip.tone}>
                <div style={{
                  position: 'absolute', left: 14, top: 70, right: 16,
                  fontFamily: CL.sans, fontSize: 18, fontWeight: 800, lineHeight: 1.05,
                  color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  whiteSpace: 'pre-wrap', textTransform: 'lowercase', letterSpacing: '-0.01em',
                }}>{clip.firstLine}</div>
              </window.R4ThumbBackdrop>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.35)' }}>
                  <svg width="20" height="20" viewBox="0 0 32 32"><polygon points="11,7 26,16 11,25" fill="#0a0a0a" /></svg>
                </span>
              </div>
              <span style={{ position: 'absolute', left: 8, bottom: 8, padding: '3px 8px', background: 'rgba(0,0,0,0.6)', borderRadius: 4, fontFamily: CL.mono, fontSize: 10, color: '#fff', fontWeight: 700 }}>{clip.range}</span>
              <span style={{ position: 'absolute', right: 8, bottom: 8, padding: '3px 8px', background: 'rgba(0,0,0,0.45)', borderRadius: 4, fontFamily: CL.mono, fontSize: 9.5, color: 'rgba(255,255,255,0.85)' }}>{clip.source}</span>
            </div>
            <div>
              <div style={{ fontFamily: CL.serif, fontStyle: 'italic', fontSize: 18, color: 'var(--fg-primary)', letterSpacing: '-0.01em', fontWeight: 500, lineHeight: 1.25 }}>{clip.caption}.</div>
              <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', padding: '10px 12px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
                {[
                  ['LENGTH', '0:16'],
                  ['ASPECT', '9:16 · vertical'],
                  ['CODEC', 'h264 · 1080p'],
                  ['AUDIO', 'whisper · 0.94 conf'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CL_Eyebrow s={8.5}>{k}</CL_Eyebrow>
                    <span style={{ fontFamily: CL.mono, fontSize: 11, color: 'var(--fg-primary)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right · task picker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CL_AnalysisHead
              eyebrow="TASK · 01"
              title="Pick what to evaluate."
              hint="ONE TASK · RUNS IN ABOUT 30 SECONDS"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks.map(t => {
                const active = picked === t.id;
                return (
                  <article
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setPicked(t.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPicked(t.id); } }}
                    style={{
                      display: 'grid', gridTemplateColumns: '40px 1fr 120px',
                      gap: 16, alignItems: 'center',
                      padding: '16px 18px',
                      border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 10,
                      background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
                      cursor: 'pointer', userSelect: 'none',
                      transition: 'border-color 200ms ease, background 200ms ease',
                    }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      background: active ? 'var(--accent-primary)' : 'var(--surface-2)',
                      color: active ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                    }}>{t.icon}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <CL_Eyebrow s={9}>{t.eyebrow}</CL_Eyebrow>
                      <div style={{ fontFamily: CL.serif, fontStyle: 'italic', fontSize: 17, color: 'var(--fg-primary)', letterSpacing: '-0.01em', fontWeight: 500, lineHeight: 1.2 }}>{t.title}</div>
                      <div style={{ fontFamily: CL.sans, fontSize: 12, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>{t.body}</div>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); goStep('auto'); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); goStep('auto'); } }}
                      style={{
                        justifySelf: 'end',
                        padding: '7px 14px',
                        background: active ? 'var(--accent-primary)' : 'transparent',
                        color: active ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                        border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                        borderRadius: 999,
                        fontFamily: CL.sans, fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.04em',
                        cursor: 'pointer', userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}>Run analysis</span>
                  </article>
                );
              })}
            </div>

            <p style={{ margin: '6px 0 0', fontFamily: CL.sans, fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.55, maxWidth: 560 }}>
              Three tasks today · more later. Each one runs against this single clip — you'll get the result inline, not a job that runs in the background.
            </p>

            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
              <span
                role="button"
                tabIndex={0}
                onClick={() => goStep('auto')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStep('auto'); } }}
                style={{
                  padding: '9px 20px',
                  background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
                  borderRadius: 999,
                  fontFamily: CL.sans, fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.02em',
                  cursor: 'pointer', userSelect: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                Run · {tasks.find(t => t.id === picked).title.toLowerCase()}
                <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </section>
      </div>
    </HfShell>
  );
}

// ───────────────────────────────────────────────────────
// 3. AUTO · best moments found inside the clip
// ───────────────────────────────────────────────────────
function HF_ClipLabAutoClips() {
  const { goStep } = useClipLabStepNav();
  // Re-tag the fixture rows by why-it-works · creator-agnostic vocabulary
  // (Hook · Reveal · Beat · Quote). Tag is derived from rationale tone.
  const whyTag = (id) => ({
    c01: 'HOOK',  c02: 'REVEAL', c03: 'BEAT',  c04: 'HOOK',
    c05: 'BEAT',  c06: 'QUOTE',  c07: 'HOOK',  c08: 'REVEAL',
    c09: 'QUOTE', c10: 'BEAT',   c11: 'REVEAL', c12: 'QUOTE',
  })[id] || 'BEAT';
  const tagBg = {
    HOOK:   'var(--accent-primary)',
    REVEAL: 'var(--tone-success)',
    BEAT:   'var(--tone-info)',
    QUOTE:  'var(--tone-warning)',
  };

  return (
    <HfShell workspace="studio" subtab="Clip Lab" topbarRight={<CL_Topbar />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)', padding: '24px 36px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <CL_StepBack to="import" label="Task picker" />
              <CL_Eyebrow>Studio · Clip Lab · 12 moments · ranked by lift</CL_Eyebrow>
            </div>
            <h1 style={{ margin: '6px 0 0', fontFamily: CL.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 36, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Coopr found 12 usable moments in your clip.
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[
              ['All · 12', true],
              ['Hook · 3', false],
              ['Reveal · 3', false],
              ['Beat · 3', false],
              ['Quote · 3', false],
            ].map(([label, active], i) => (
              <window.R4Chip key={i} active={active} size="sm" accent={active}>{label}</window.R4Chip>
            ))}
            <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', margin: '0 4px' }} />
            <span style={{ fontFamily: CL.mono, fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>SORT · LIFT ↓</span>
          </div>
        </div>

        <CL_AgentBand activity="Ranked by lift score · grouped by why-it-works tag" when="just now" countLabel="WHY THESE? →" />

        {/* Re-tagged moments grid · same 12 clips, new framing */}
        <section style={{ marginTop: 28 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px 18px',
          }}>
            {CL_CLIPS.map(c => {
              const tag = whyTag(c.id);
              return (
                <article key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
                  <div style={{
                    position: 'relative',
                    aspectRatio: '9 / 16',
                    width: '100%',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#0a0a0a',
                    boxShadow: '0 1px 3px rgba(15,14,12,0.10)',
                  }}>
                    <window.R4ThumbBackdrop tone={c.tone}>
                      <div style={{
                        position: 'absolute', left: 12, top: 60, right: 14,
                        fontFamily: CL.sans, fontSize: 14, fontWeight: 800, lineHeight: 1.05,
                        color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.55)',
                        whiteSpace: 'pre-wrap', textTransform: 'lowercase', letterSpacing: '-0.01em',
                      }}>{c.firstLine}</div>
                    </window.R4ThumbBackdrop>

                    {/* Why-it-works tag · top-left */}
                    <div style={{
                      position: 'absolute', left: 7, top: 7,
                      padding: '3px 7px',
                      background: tagBg[tag],
                      borderRadius: 4,
                      fontFamily: CL.mono, fontSize: 9, fontWeight: 700,
                      color: '#fff', letterSpacing: '0.1em',
                    }}>{tag}</div>

                    {/* Lift score · top-right */}
                    <div style={{
                      position: 'absolute', right: 7, top: 7,
                      display: 'inline-flex', alignItems: 'baseline', gap: 3,
                      padding: '3px 7px',
                      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                      borderRadius: 4,
                    }}>
                      <span style={{ fontFamily: CL.sans, fontSize: 11, fontWeight: 700, color: '#fff' }}>+{Math.max(0, c.predictedScore - 50)}</span>
                      <span style={{ fontFamily: CL.mono, fontSize: 8, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>LIFT</span>
                    </div>

                    {/* Time range · bottom-left */}
                    <span style={{
                      position: 'absolute', left: 7, bottom: 7,
                      padding: '2px 6px',
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: 3,
                      fontFamily: CL.mono, fontSize: 10, color: '#fff', fontWeight: 700, letterSpacing: '0.04em',
                    }}>{c.range.replace('–', ' → ')}</span>
                  </div>

                  <div>
                    <div style={{ fontFamily: CL.serif, fontStyle: 'italic', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.3 }}>{c.caption}</div>
                    <div style={{ marginTop: 4, fontFamily: CL.sans, fontSize: 11, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>{c.rationale}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{
                      flex: 1,
                      padding: '5px 10px', textAlign: 'center',
                      background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
                      borderRadius: 5,
                      fontFamily: CL.sans, fontSize: 11, fontWeight: 600,
                    }}>Promote</span>
                    <span style={{
                      padding: '5px 10px', textAlign: 'center',
                      background: 'transparent', color: 'var(--fg-secondary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 5,
                      fontFamily: CL.sans, fontSize: 11, fontWeight: 600,
                    }}>Skip</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section style={{ marginTop: 36, paddingTop: 18, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <CL_Eyebrow>Selection · 0 of 12 promoted</CL_Eyebrow>
          <span style={{ flex: 1 }} />
          <span style={{ padding: '7px 14px', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: CL.sans, fontSize: 11.5, color: 'var(--fg-secondary)', fontWeight: 600 }}>Promote top 3 to drafts</span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => goStep('review')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStep('review'); } }}
            style={{
              padding: '7px 16px',
              background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
              borderRadius: 999,
              fontFamily: CL.sans, fontSize: 11.5, fontWeight: 700,
              cursor: 'pointer', userSelect: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
            See edit suggestions
            <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </section>
      </div>
    </HfShell>
  );
}

// ───────────────────────────────────────────────────────
// 4. REVIEW · edit suggestions · accept / skip chips
// ───────────────────────────────────────────────────────
function HF_ClipLabReview() {
  const { goStep } = useClipLabStepNav();
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const clip = CL_CLIPS[0]; // c01 · the eight-second cold-open

  // 5 inline edit suggestions · serif italic title + sans body + accept/skip
  const suggestedEdits = [
    {
      at: '0:00',
      kind: 'TRIM',
      title: 'Trim cold-open from 1.92s to 1.2s',
      body: 'Half-second of dead air before the first word — viewers feel the lag. Land on the consonant of "eight" instead.',
    },
    {
      at: '0:03–0:06',
      kind: 'REORDER',
      title: 'Reverse beats 3 and 4',
      body: 'Lead with "you have to start later" and resolve into "you can\'t talk faster." Pivot lands harder when the answer arrives first.',
    },
    {
      at: '0:18',
      kind: 'INSERT',
      title: 'Add a 0:18 reaction beat',
      body: 'Sticker-style cutaway after the rule. Saves it from being a single-take monologue without breaking the hook structure.',
    },
    {
      at: '0:08',
      kind: 'TIGHTEN',
      title: 'Tighten the pivot · -0.4s',
      body: 'Drop the breath after "rule." Loop point closes on the noun, not on the inhale.',
    },
    {
      at: '0:09',
      kind: 'TAIL',
      title: 'Cut the tail · "isn\'t about pacing"',
      body: 'Optional · ends harder if the hook closes on "the eight-second rule" itself rather than qualifying it.',
    },
  ];

  const kindColor = {
    TRIM:    'var(--accent-primary)',
    REORDER: 'var(--tone-info)',
    INSERT:  'var(--tone-success)',
    TIGHTEN: 'var(--accent-primary)',
    TAIL:    'var(--tone-warning)',
  };

  return (
    <HfShell workspace="studio" subtab="Clip Lab" topbarRight={<CL_Topbar />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)' }}>
        <div style={{ padding: '20px 36px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: CL.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>
            <CL_StepBack to="auto" label="Moments" />
            <span>STUDIO</span><span>›</span>
            <span>CLIP LAB</span><span>›</span>
            <span style={{ color: 'var(--fg-secondary)' }}>EDIT SUGGESTIONS</span>
            <span style={{ flex: 1 }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
              <span style={{ color: 'var(--accent-primary-press)' }}>COOPR PROPOSED · 5 EDITS · CONFIDENCE HIGH</span>
            </span>
          </div>

          <header style={{ marginTop: 12, paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
              <CL_Eyebrow>Studio · Clip Lab · suggest edits</CL_Eyebrow>
              <span style={{ fontFamily: CL.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>· source clip {clip.range}</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: CL.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 38, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Five edits to sharpen the clip.</h1>
            <p style={{ margin: '10px 0 0', fontFamily: CL.sans, fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.6, maxWidth: 760 }}>
              Each suggestion is a specific change — a trim, a reorder, an inserted beat. Accept the ones that read true and skip the rest. Apply all to bake them into a draft, or open the clip in the editor to fine-tune.
            </p>
          </header>
        </div>

        <div style={{ padding: '24px 36px 40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
          {/* Left · original clip preview + edit suggestion cards */}
          <div>
            {/* Original clip preview · top of body */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <CL_Eyebrow>Original · before edits</CL_Eyebrow>
              <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ fontFamily: CL.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>9.0s · 1080P</span>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 10, overflow: 'hidden', background: '#0a0a0a', boxShadow: '0 6px 24px rgba(15,14,12,0.10)' }}>
              <window.R4ThumbBackdrop tone={clip.tone}>
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                  fontFamily: CL.sans, fontSize: 48, fontWeight: 800, lineHeight: 1.0,
                  color: '#fff', textAlign: 'center', textShadow: '0 4px 24px rgba(0,0,0,0.55)',
                  textTransform: 'lowercase', letterSpacing: '-0.02em',
                  whiteSpace: 'pre-wrap',
                }}>{clip.firstLine}</div>
              </window.R4ThumbBackdrop>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.4)' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="11,7 26,16 11,25" fill="#0a0a0a" /></svg>
                </span>
              </div>
              {/* Scrubber · 5 edit markers along the timeline */}
              <div style={{ position: 'absolute', left: 18, right: 18, bottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 999, position: 'relative' }}>
                  <div style={{ width: '34%', height: '100%', background: 'var(--accent-primary)', borderRadius: 999 }} />
                  {[8, 33, 60, 78, 92].map((pct, i) => (
                    <span key={i} title={'edit ' + (i + 1)} style={{ position: 'absolute', left: `${pct}%`, top: -3, width: 2, height: 10, background: 'var(--accent-primary)' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: CL.mono, fontSize: 10, color: '#fff' }}>
                  <span>0:03 / 0:09</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>5 edit markers · timeline</span>
                </div>
              </div>
            </div>

            {/* Edit suggestion cards · 5 inline · accept / skip chips */}
            <section style={{ marginTop: 28 }}>
              <CL_AnalysisHead
                eyebrow="EDITS · 01"
                title="Suggested edits."
                hint="ACCEPT INDIVIDUALLY · OR APPLY ALL"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {suggestedEdits.map((s, i) => (
                  <article key={i} style={{
                    display: 'grid', gridTemplateColumns: '70px 1fr 150px',
                    gap: 18, alignItems: 'start',
                    padding: '14px 16px',
                    border: '1px solid var(--border-subtle)', borderRadius: 10,
                    background: 'var(--surface-1)',
                    borderLeft: `3px solid ${kindColor[s.kind]}`,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontFamily: CL.mono, fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)' }}>{s.at}</span>
                      <span style={{ fontFamily: CL.mono, fontSize: 9, color: kindColor[s.kind], letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>{s.kind}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontFamily: CL.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.25, fontWeight: 500 }}>{s.title}</div>
                      <div style={{ fontFamily: CL.sans, fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{s.body}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: 2 }}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => ms.pushToast && ms.pushToast('Accepted · ' + s.title)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Accepted · ' + s.title); } }}
                        style={{
                          padding: '6px 14px',
                          background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
                          borderRadius: 999,
                          fontFamily: CL.mono, fontSize: 9.5, fontWeight: 700,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          cursor: 'pointer', userSelect: 'none',
                        }}>Accept</span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => ms.pushToast && ms.pushToast('Skipped · ' + s.title)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Skipped · ' + s.title); } }}
                        style={{
                          padding: '6px 14px',
                          border: '1px solid var(--border-default)',
                          borderRadius: 999,
                          fontFamily: CL.mono, fontSize: 9.5, fontWeight: 600,
                          color: 'var(--fg-secondary)',
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          cursor: 'pointer', userSelect: 'none',
                        }}>Skip</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Bottom CTAs · apply all + open in editor */}
            <section style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <CL_Eyebrow>Edits · 0 of 5 accepted</CL_Eyebrow>
              <span style={{ flex: 1 }} />
              <span
                role="button"
                tabIndex={0}
                onClick={() => ms.pushToast && ms.pushToast('Open in editor · spawn doc')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Open in editor · spawn doc'); } }}
                style={{
                  padding: '8px 18px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 999,
                  fontFamily: CL.sans, fontSize: 12, fontWeight: 600,
                  color: 'var(--fg-secondary)',
                  cursor: 'pointer', userSelect: 'none',
                }}>Open in editor</span>
              <span
                role="button"
                tabIndex={0}
                onClick={() => goStep('export')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStep('export'); } }}
                style={{
                  padding: '8px 20px',
                  background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
                  borderRadius: 999,
                  fontFamily: CL.sans, fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.02em',
                  cursor: 'pointer', userSelect: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                Apply all
                <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </section>
          </div>

          {/* Right · why these edits + verdict summary */}
          <aside style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 24 }}>
            <CL_AnalysisHead
              eyebrow="VERDICT · 01"
              title="What Coopr saw."
              hint="DIAGNOSIS · 30 SECONDS"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                {
                  k: 'STRUCTURE',
                  body: 'Strong declarative hook · pivot lands two beats too late. The fix is reordering, not rewriting.',
                  flag: 'fix',
                },
                {
                  k: 'PACING',
                  body: 'Mid-clip drag at 0:06 · viewers feel the breath before the noun. Tighten by 0.4s and the rhythm holds.',
                  flag: 'fix',
                },
                {
                  k: 'ENERGY',
                  body: 'Closes flat. A reaction beat at 0:18 keeps the loop alive without breaking the single-take feel.',
                  flag: 'add',
                },
                {
                  k: 'VOICE MATCH',
                  body: 'Reads like your last 4 reels · 0.91 match. No tonal edits needed.',
                  flag: 'good',
                },
              ].map((row, i) => {
                const flagColor = row.flag === 'good' ? 'var(--tone-success)' : row.flag === 'add' ? 'var(--tone-info)' : 'var(--accent-primary)';
                const flagText = row.flag === 'good' ? 'GOOD' : row.flag === 'add' ? 'ADD' : 'FIX';
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 12, borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CL_Eyebrow s={9}>{row.k}</CL_Eyebrow>
                      <span style={{ flex: 1 }} />
                      <span style={{ padding: '2px 7px', background: flagColor, color: '#fff', borderRadius: 3, fontFamily: CL.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em' }}>{flagText}</span>
                    </div>
                    <p style={{ margin: 0, fontFamily: CL.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>{row.body}</p>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 18, padding: '14px 14px', background: 'var(--accent-soft)', borderRadius: 8 }}>
              <CL_Eyebrow s={9}>Verdict</CL_Eyebrow>
              <div style={{ marginTop: 4, fontFamily: CL.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--accent-primary-press)', letterSpacing: '-0.01em', lineHeight: 1.3, fontWeight: 500 }}>
                Ship it after the trim and the reorder. The other three are optional.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </HfShell>
  );
}

// ───────────────────────────────────────────────────────
// 5. EXPORT · ship plan · 3 platform targets · per-platform variations
// ───────────────────────────────────────────────────────
function HF_ClipLabExport() {
  const { goStep } = useClipLabStepNav();
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const clip = CL_CLIPS[0]; // c01 source

  // 3 platform targets · aspect-ratio-correct preview + tone notes
  const targets = [
    {
      id: 'ig',
      label: 'Instagram Reel',
      eyebrow: 'IG REEL',
      aspect: '9 / 16',
      duration: '0:09',
      title: 'eight seconds. start later.',
      body: "Saves-leaning · the question lands first, the resolution second. Captions kept short for the in-feed read.",
      tone: 'Save-bait · question-led',
      caption: "the part of the dive nobody films — and the one that taught me the most.",
      hashtags: '#scuba #divelife #cinematography',
    },
    {
      id: 'tt',
      label: 'TikTok',
      eyebrow: 'TIKTOK',
      aspect: '9 / 16',
      duration: '0:11',
      title: "you can't talk faster. start later.",
      body: 'Loop-leaning · pivot lands earlier, declarative tail re-enters the hook. Caption leans casual.',
      tone: 'Loop-bait · declarative',
      caption: "you can't talk faster on a hook. you have to start later. here's how.",
      hashtags: '#filmmaker #shorttok #howto',
    },
    {
      id: 'yt',
      label: 'YouTube Short',
      eyebrow: 'YOUTUBE SHORT',
      aspect: '9 / 16',
      duration: '0:14',
      title: 'the eight-second rule.',
      body: 'Watch-time-leaning · longer setup, named rule in the title for search. Body breathes more.',
      tone: 'Search-led · named rule',
      caption: "the eight-second rule for short-form video — and why most creators get it wrong.",
      hashtags: '#shorts #videoediting #creator',
    },
  ];

  return (
    <HfShell workspace="studio" subtab="Clip Lab" topbarRight={<CL_Topbar />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)', padding: '24px 36px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <CL_StepBack to="review" label="Edits" />
              <CL_Eyebrow>Studio · Clip Lab · ship plan · 3 platforms</CL_Eyebrow>
            </div>
            <h1 style={{ margin: '6px 0 0', fontFamily: CL.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 36, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Three ways the clip could land.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span
              role="button"
              tabIndex={0}
              onClick={() => ms.pushToast && ms.pushToast('Saved · 3 drafts')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Saved · 3 drafts'); } }}
              style={{ padding: '7px 14px', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: CL.sans, fontSize: 11.5, color: 'var(--fg-secondary)', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>Save to drafts</span>
            <span
              role="button"
              tabIndex={0}
              onClick={() => ms.pushToast && ms.pushToast('Scheduled · 3 platforms · Tue 6:30 PM')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Scheduled · 3 platforms · Tue 6:30 PM'); } }}
              style={{ padding: '7px 16px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 999, fontFamily: CL.sans, fontSize: 11.5, fontWeight: 700, cursor: 'pointer', userSelect: 'none' }}>Schedule across all 3</span>
          </div>
        </div>

        <CL_AgentBand
          activity="Drafted 3 platform variations of the same clip · per-platform tone, length, and caption"
          when="just now"
          countLabel="REVIEW DRAFTS →"
        />

        {/* Three platform target cards · aspect-correct previews side by side */}
        <section style={{ marginTop: 28 }}>
          <CL_AnalysisHead
            eyebrow="SHIP PLAN · 01"
            title="Per-platform variations."
            hint="SAME CLIP · DIFFERENT CUT · DIFFERENT TONE"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {targets.map(t => (
              <article key={t.id} style={{
                display: 'flex', flexDirection: 'column', gap: 12,
                padding: '16px 16px 18px',
                border: '1px solid var(--border-subtle)', borderRadius: 12,
                background: 'var(--surface-1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CL_Eyebrow s={9.5}>{t.eyebrow}</CL_Eyebrow>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontFamily: CL.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{t.duration}</span>
                </div>

                {/* Aspect-correct preview · 9:16 vertical */}
                <div style={{
                  position: 'relative',
                  aspectRatio: t.aspect,
                  width: '100%',
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#0a0a0a',
                }}>
                  <window.R4ThumbBackdrop tone={clip.tone}>
                    <div style={{
                      position: 'absolute', left: 14, top: 70, right: 16,
                      fontFamily: CL.sans, fontSize: 18, fontWeight: 800, lineHeight: 1.05,
                      color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                      whiteSpace: 'pre-wrap', textTransform: 'lowercase', letterSpacing: '-0.01em',
                    }}>{t.title}</div>
                  </window.R4ThumbBackdrop>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.35)' }}>
                      <svg width="16" height="16" viewBox="0 0 32 32"><polygon points="11,7 26,16 11,25" fill="#0a0a0a" /></svg>
                    </span>
                  </div>
                  <span style={{ position: 'absolute', left: 8, bottom: 8, padding: '2px 7px', background: 'rgba(0,0,0,0.6)', borderRadius: 3, fontFamily: CL.mono, fontSize: 9.5, color: '#fff', fontWeight: 700 }}>{t.duration}</span>
                </div>

                {/* Tone note */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <CL_Eyebrow s={9}>{t.tone}</CL_Eyebrow>
                  <p style={{ margin: 0, fontFamily: CL.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.4, fontWeight: 500 }}>{t.body}</p>
                </div>

                {/* Caption draft */}
                <div style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 6 }}>
                  <CL_Eyebrow s={8.5}>Caption</CL_Eyebrow>
                  <p style={{ margin: '4px 0 6px', fontFamily: CL.sans, fontSize: 12, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{t.caption}</p>
                  <p style={{ margin: 0, fontFamily: CL.mono, fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{t.hashtags}</p>
                </div>

                {/* Per-target actions */}
                <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => ms.pushToast && ms.pushToast('Scheduled · ' + t.label)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Scheduled · ' + t.label); } }}
                    style={{
                      flex: 1,
                      padding: '7px 10px', textAlign: 'center',
                      background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
                      borderRadius: 6,
                      fontFamily: CL.sans, fontSize: 11, fontWeight: 700,
                      cursor: 'pointer', userSelect: 'none',
                    }}>Schedule</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => ms.pushToast && ms.pushToast('Edit · ' + t.label)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Edit · ' + t.label); } }}
                    style={{
                      padding: '7px 12px', textAlign: 'center',
                      background: 'transparent', color: 'var(--fg-secondary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 6,
                      fontFamily: CL.sans, fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', userSelect: 'none',
                    }}>Edit</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom · Schedule across all 3 / Save to drafts */}
        <section style={{ marginTop: 28, padding: '18px 22px', background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
          <CL_Eyebrow c="rgba(253,252,249,0.6)">Ship plan summary</CL_Eyebrow>
          <span style={{ fontFamily: CL.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-on-ink)', letterSpacing: '-0.01em' }}>1 clip · 3 platform variations · captions drafted</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: CL.mono, fontSize: 10.5, color: 'rgba(253,252,249,0.55)', letterSpacing: '0.1em' }}>NEXT SLOT · TUE 6:30 PM</span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => ms.pushToast && ms.pushToast('Saved · 3 drafts to Library')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Saved · 3 drafts to Library'); } }}
            style={{ padding: '8px 16px', border: '1px solid rgba(253,252,249,0.3)', color: 'var(--fg-on-ink)', borderRadius: 999, fontFamily: CL.sans, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>Save to drafts</span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => ms.pushToast && ms.pushToast('Scheduled across IG · TT · YT')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ms.pushToast && ms.pushToast('Scheduled across IG · TT · YT'); } }}
            style={{ padding: '8px 18px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 999, fontFamily: CL.sans, fontSize: 12, fontWeight: 700, cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Schedule across all 3
            <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </section>

        {/* Loop back · evaluate another clip */}
        <section style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
          <CL_Eyebrow s={9.5}>Done with this clip?</CL_Eyebrow>
          <span
            role="button"
            tabIndex={0}
            onClick={() => goStep('empty')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goStep('empty'); } }}
            style={{
              padding: '7px 14px',
              border: '1px solid var(--border-default)',
              borderRadius: 999,
              fontFamily: CL.sans, fontSize: 11.5, color: 'var(--fg-secondary)', fontWeight: 600,
              cursor: 'pointer', userSelect: 'none',
            }}>Evaluate another clip</span>
        </section>
      </div>
    </HfShell>
  );
}

Object.assign(window, {
  HF_ClipLabEmpty,
  HF_ClipLabImport,
  HF_ClipLabAutoClips,
  HF_ClipLabReview,
  HF_ClipLabExport,
});
