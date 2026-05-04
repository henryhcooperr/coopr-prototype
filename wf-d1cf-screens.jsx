/* global React, D1cfTopbar, D1cfThreadRail, D1cfFullComposer, D1cfPillComposer, D1cfLibraryRail, D1cfAudienceRail, D1cfPin, D1cfSubTabs, D1cfScopedComposer, ChatBlock, MiniChart, PhoneMini, TableRows, Hatch, Textlines, Composer */
// wf-d1cf-screens.jsx — 9 deep screens of Direction 1 (workspace model).
// Each screen: topbar workspaces + sub-tab row + scoped inline composer +
// optional collapsible rail. Chat is the interaction model, not a tab.

// ─── Reusable shell wrappers ────────────────────────────────
function CFShell({ active, children, accent = false }) {
  return (
    <div className="wf-screen" style={{ flexDirection: 'column' }}>
      <D1cfTopbar active={active} accent={accent} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

// Body wrapper: sub-tabs + a horizontal row (optional rail + main column).
function CFBody({ children }) {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, background: 'var(--wf-paper)' }}>
      {children}
    </div>
  );
}

// A collapsible rail. Appears on some sub-views but not others.
function CFRail({ label, items, active, width = 188, footer }) {
  return (
    <aside style={{ width, borderRight: '1px solid var(--wf-line)', background: 'var(--wf-paper)', padding: '14px 8px 10px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
      {label && <div style={{ fontSize: 9.5, color: 'var(--wf-ink-3)', padding: '0 10px 6px', letterSpacing: '0.05em' }}>{label}</div>}
      {items.map((it, i) => {
        const isActive = (typeof active === 'number' ? i === active : it.id === active);
        return (
          <div key={it.id || i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 4, fontSize: 11.5, color: 'var(--wf-ink)', background: isActive ? 'var(--wf-paper-2)' : 'transparent', fontWeight: isActive ? 500 : 400 }}>
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
            {it.meta && <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{it.meta}</span>}
          </div>
        );
      })}
      {footer && <>
        <div style={{ flex: 1 }} />
        {footer}
      </>}
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STUDIO workspace  —  Threads · Drafts · Schedule · Brand voice
// ═══════════════════════════════════════════════════════════════════════════

// ─── 1 · Studio · Threads (landing, empty) ──────────────────
function CF_StudioThreadsLanding() {
  const suggestions = [
    { text: 'What changed in retention this week?',     tag: 'analytics' },
    { text: 'Resume Tuesday\'s carousel draft',          tag: 'draft' },
    { text: 'Reply ideas for @marina.k thread',          tag: 'audience' },
    { text: 'Draft 3 hooks for the Fiji wreck dive',     tag: 'studio' },
    { text: 'Best posting time for safety series',       tag: 'schedule' },
  ];

  return (
    <CFShell active="studio">
      <D1cfSubTabs workspace="studio" active="Threads" />
      <CFBody>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
            {/* Greeting */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 32, fontWeight: 500, color: 'var(--wf-ink)', letterSpacing: '-0.015em', lineHeight: 1.15 }}>
                What are we making, Henry?
              </div>
              <div style={{ fontSize: 12, color: 'var(--wf-ink-3)', marginTop: 10 }}>
                Wednesday · 9:42 AM &nbsp;·&nbsp; Last drafted: <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}>Decompression for impatient divers</span>
              </div>
            </div>

            {/* Hero composer */}
            <D1cfScopedComposer workspace="studio" variant="hero" />

            {/* Quiet suggestion links */}
            <div style={{ width: 680, marginTop: 22, display: 'flex', flexDirection: 'column' }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 4px', borderBottom: i < suggestions.length - 1 ? '1px solid var(--wf-line)' : 'none', fontSize: 12.5, color: 'var(--wf-ink-2)' }}>
                  <span style={{ width: 14, color: 'var(--wf-ink-3)', fontSize: 11, textAlign: 'center' }}>↗</span>
                  <span style={{ flex: 1 }}>{s.text}</span>
                  <span style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>{s.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="4 workspaces — Studio · Audience · Library · Pulse" top={16} left={520} />
      <D1cfPin n={2} text="sub-tabs ride just under topbar, Perplexity-style" top={64} left={340} />
      <D1cfPin n={3} text="hero composer is scoped to Studio — 'Draft anything'" top={360} left={1100} />
      <D1cfPin n={4} text="no side rail on empty state — rail appears once threads exist" top={120} left={12} />
    </CFShell>
  );
}

// ─── 2 · Studio · Threads (active thread w/ draft block) ────
function CF_StudioThreadsActive() {
  const threads = [
    { id: 't1', label: 'Why dive-safety retention dropped',  meta: '3m' },
    { id: 't2', label: 'Hook lines for Fiji series',          meta: '1h' },
    { id: 't3', label: 'Reply ideas for @marina.k thread',    meta: '4:12p' },
    { id: 't4', label: 'Audience deep-dive · safety lens',    meta: 'Mon' },
    { id: 't5', label: 'Caption tone · darker?',              meta: 'Mon' },
    { id: 't6', label: 'Wreck-dive script outline',           meta: 'Sun' },
  ];

  return (
    <CFShell active="studio">
      <D1cfSubTabs
        workspace="studio"
        active="Threads"
        right={<span style={{ fontSize: 10.5, color: 'var(--wf-ink-3)' }}>27 threads · <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>+ New</span> <span className="wf-key" style={{ marginLeft: 4 }}>⌘N</span></span>}
      />
      <CFBody>
        <CFRail label="THREADS" items={threads} active="t1" />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--wf-paper)' }}>
          {/* Thread header */}
          <div style={{ padding: '10px 24px', borderBottom: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--wf-ink)' }}>Why dive-safety retention dropped</span>
            <span className="wf-meta">started 9:38am · 6 turns</span>
            <span style={{ flex: 1 }} />
            <span className="wf-chip" style={{ fontSize: 10 }}>↗ Saved to Library</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>···</span>
          </div>

          {/* Thread body */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '20px 80px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ alignSelf: 'flex-end', maxWidth: 520, background: 'var(--wf-paper-2)', color: 'var(--wf-ink)', padding: '10px 14px', borderRadius: 14, border: '1px solid var(--wf-line)', fontSize: 12.5 }}>
              Retention on the dive-safety series dropped 18% this week. Why? And draft a follow-up post that recovers it.
            </div>

            <div style={{ alignSelf: 'flex-start', maxWidth: 720, fontSize: 12.5, color: 'var(--wf-ink)', lineHeight: 1.55 }}>
              <div style={{ marginBottom: 8 }}>Two things happened. First, slide-4 is where the fall-off lives — that's the "hook frame" slot, and the last two posts dropped the rule-of-three text-on-image pattern posts <strong>#0042</strong> and <strong>#0051</strong> used. Second, posting time slipped from 7:10am to ~9:00am on the affected days.</div>
              <div>Here's a draft that re-uses the strong frame and re-anchors the safety angle to a near-miss story:</div>
            </div>

            {/* Inline draft block — the load-bearing pattern */}
            <div style={{ alignSelf: 'flex-start', width: 720 }}>
              <div className="wf-sketch" style={{ padding: 0, background: 'var(--wf-paper)', borderColor: 'var(--wf-ink-2)', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--wf-paper-2)' }}>
                  <span className="wf-tag wf-tag-panel" style={{ fontSize: 10 }}>DRAFT · CAROUSEL</span>
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--wf-ink)' }}>"The dive that almost went wrong" — 6 slides</span>
                  <span style={{ flex: 1 }} />
                  <span className="wf-meta" style={{ fontSize: 10 }}>↗ Library · Drafts</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, padding: 12 }}>
                  {['HOOK', 'STORY', 'PIVOT', 'LESSON', 'PROOF', 'CTA'].map((label, i) => (
                    <div key={i} className="wf-sketch wf-sketch-thin" style={{ aspectRatio: '4/5', padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: i === 0 ? 'var(--wf-accent-soft)' : 'var(--wf-paper-2)', borderColor: i === 0 ? 'var(--wf-accent)' : undefined }}>
                      <span className="wf-label" style={{ fontSize: 8.5, color: i === 0 ? 'var(--wf-accent)' : 'var(--wf-ink-3)' }}>{label}</span>
                      <Textlines lines={2} style={{ marginBottom: 2 }} />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '8px 12px', borderTop: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--wf-paper-2)' }}>
                  <span className="wf-chip" style={{ fontSize: 10 }}>Edit inline</span>
                  <span className="wf-chip" style={{ fontSize: 10 }}>Open in Library</span>
                  <span className="wf-chip" style={{ fontSize: 10 }}>Refine hook</span>
                  <span style={{ flex: 1 }} />
                  <span className="wf-chip" style={{ fontSize: 10 }}>Schedule…</span>
                  <span className="wf-chip wf-chip-accent" style={{ fontSize: 10 }}>Approve</span>
                </div>
              </div>
            </div>
          </div>

          {/* Docked reply composer */}
          <div style={{ padding: '12px 80px 16px', borderTop: '1px solid var(--wf-line)', background: 'var(--wf-paper)' }}>
            <D1cfScopedComposer workspace="studio" variant="bar" />
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <span className="wf-chip" style={{ fontSize: 10 }}>Queue a teaser story</span>
              <span className="wf-chip" style={{ fontSize: 10 }}>Fix posting time</span>
              <span className="wf-chip" style={{ fontSize: 10 }}>Show the retention chart</span>
            </div>
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="collapsible rail appears when threads exist — labeled, not group-headered" top={120} left={12} />
      <D1cfPin n={2} text="draft block inline in chat = editable artifact, auto-saved to Library" top={336} left={1000} />
      <D1cfPin n={3} text="composer anchored but inline — not a floating hero" top={760} left={1000} />
    </CFShell>
  );
}

// ─── 3 · Studio · Drafts (grid) ─────────────────────────────
function CF_StudioDrafts() {
  const drafts = [
    { title: 'The dive that almost went wrong', kind: 'Carousel · 6 slides', status: 'Ready · Fri 7:10a', age: '3m', active: true },
    { title: 'Decompression for impatient divers', kind: 'Post', status: 'Draft', age: '2d' },
    { title: 'Why I stopped giving gear advice', kind: 'Carousel · 4 slides', status: 'Needs a hook', age: 'Tue' },
    { title: 'Fiji · Part 1 · The descent', kind: 'Story · 6 frames', status: 'Scheduled Sat 6am', age: 'Mon' },
    { title: 'Fiji · Part 2 · The wreck', kind: 'Story · 5 frames', status: 'Draft', age: 'Mon' },
    { title: 'Rule of three, visual edition', kind: 'Carousel · 5 slides', status: 'Draft', age: 'Sun' },
    { title: 'Reply: @marina.k', kind: 'Reply · thread', status: 'Ready to post', age: 'Sun' },
    { title: 'Gear teardown · Suunto D5', kind: 'Post', status: 'Needs images', age: 'Apr 19' },
    { title: 'Night dive checklist', kind: 'Carousel · 5 slides', status: 'Scheduled Tue 7am', age: 'Apr 18' },
  ];

  return (
    <CFShell active="studio">
      <D1cfSubTabs
        workspace="studio"
        active="Drafts"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Status ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Kind ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Sort: recent ▾</span>
          </div>
        }
      />
      <CFBody>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Scoped composer at top */}
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="studio" variant="bar" />
          </div>

          {/* Grid */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 24px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {drafts.map((d, i) => (
                <div key={i} style={{ border: d.active ? '1px solid var(--wf-ink-2)' : '1px solid var(--wf-line)', background: d.active ? 'var(--wf-paper)' : 'var(--wf-paper)', borderRadius: 6, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 160 }}>
                  <div style={{ flex: 1, background: 'var(--wf-paper-2)', borderRadius: 4, minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hatch style={{ width: '80%', height: 36 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--wf-ink)', marginBottom: 2, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>{d.kind} · {d.age}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10 }}>
                    <span style={{ color: d.status.startsWith('Ready') || d.status.startsWith('Scheduled') ? 'var(--wf-accent)' : 'var(--wf-ink-3)' }}>
                      {d.status.startsWith('Ready') || d.status.startsWith('Scheduled') ? '●' : '○'} {d.status}
                    </span>
                    <span className="wf-chip" style={{ fontSize: 9.5 }}>Open</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="scoped composer at top — 'draft anything' works from any sub-view" top={120} left={1000} />
      <D1cfPin n={2} text="filter chips replace rail for this sub-view — rail would be overkill" top={64} left={900} />
      <D1cfPin n={3} text="status dot + text: ready/scheduled = accent, draft/needs = quiet" top={360} left={1000} />
    </CFShell>
  );
}

// ─── 4 · Studio · Schedule (calendar) ───────────────────────
function CF_StudioSchedule() {
  const days = ['MON 28', 'TUE 29', 'WED 30 · today', 'THU 1', 'FRI 2', 'SAT 3', 'SUN 4'];
  const slots = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];
  // item map: day index → slot index → item
  const items = {
    '0-0': { title: 'Night dive checklist', kind: 'carousel', state: 'scheduled' },
    '1-0': { title: 'Reply · @marina.k', kind: 'reply', state: 'scheduled' },
    '2-0': { title: 'Fiji · Part 1', kind: 'story', state: 'live' },
    '2-3': { title: 'Retention recap', kind: 'note', state: 'draft' },
    '4-0': { title: 'Dive that almost went wrong', kind: 'carousel', state: 'ready', active: true },
    '4-2': { title: 'Gear teardown · Suunto D5', kind: 'post', state: 'needs' },
    '5-0': { title: 'Fiji · Part 2', kind: 'story', state: 'scheduled' },
  };

  return (
    <CFShell active="studio">
      <D1cfSubTabs
        workspace="studio"
        active="Schedule"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>◀</span>
            <span style={{ fontSize: 11, color: 'var(--wf-ink-2)' }}>Apr 28 – May 4</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>▶</span>
            <span style={{ width: 1, height: 16, background: 'var(--wf-line)' }} />
            <span className="wf-chip" style={{ fontSize: 10 }}>Week</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Month</span>
          </div>
        }
      />
      <CFBody>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="studio" variant="bar" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '16px 24px 20px', display: 'flex', flexDirection: 'column' }}>
            {/* Day header */}
            <div style={{ display: 'grid', gridTemplateColumns: '44px repeat(7, 1fr)', gap: 1, background: 'var(--wf-line)', border: '1px solid var(--wf-line)', borderBottom: 'none' }}>
              <div style={{ background: 'var(--wf-paper-2)' }} />
              {days.map((d, i) => (
                <div key={i} style={{ padding: '8px 10px', background: d.includes('today') ? 'var(--wf-accent-soft)' : 'var(--wf-paper-2)', fontSize: 10.5, color: d.includes('today') ? 'var(--wf-accent)' : 'var(--wf-ink-2)', fontWeight: d.includes('today') ? 600 : 500, letterSpacing: '0.04em' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Slot rows */}
            {slots.map((slot, si) => (
              <div key={si} style={{ display: 'grid', gridTemplateColumns: '44px repeat(7, 1fr)', gap: 1, background: 'var(--wf-line)', border: '1px solid var(--wf-line)', borderTop: 'none', flex: 1 }}>
                <div style={{ background: 'var(--wf-paper)', padding: '8px 6px', fontSize: 9.5, color: 'var(--wf-ink-3)', textAlign: 'right' }}>{slot}</div>
                {days.map((_, di) => {
                  const it = items[`${di}-${si}`];
                  const isToday = days[di].includes('today');
                  return (
                    <div key={di} style={{ background: isToday ? 'rgba(13, 148, 136, 0.03)' : 'var(--wf-paper)', padding: 4, minHeight: 42 }}>
                      {it && (
                        <div style={{
                          fontSize: 10,
                          padding: '4px 6px',
                          borderRadius: 3,
                          background: it.state === 'live' ? 'var(--wf-ink)' : it.active ? 'var(--wf-accent-soft)' : 'var(--wf-paper-2)',
                          border: it.active ? '1px solid var(--wf-accent)' : '1px solid var(--wf-line)',
                          color: it.state === 'live' ? 'var(--wf-paper)' : it.active ? 'var(--wf-accent)' : 'var(--wf-ink-2)',
                          lineHeight: 1.25,
                        }}>
                          <div style={{ fontWeight: 500, marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
                          <div style={{ fontSize: 9, opacity: 0.75, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {it.kind} · {it.state}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="Schedule is a Studio sub-view, not a Library section" top={64} left={520} />
      <D1cfPin n={2} text="today column tinted, live item inverse, active = accent outline" top={340} left={1000} />
      <D1cfPin n={3} text="composer still scoped to Studio — 'Draft anything, or schedule it'" top={120} left={1000} />
    </CFShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIENCE workspace  —  Overview · Retention · Comments · Followers · Segments
// ═══════════════════════════════════════════════════════════════════════════

// ─── 5 · Audience · Overview ────────────────────────────────
function CF_AudienceOverview() {
  const metrics = [
    { label: 'Followers', value: '24.8k', delta: '+182', pos: true },
    { label: 'Reach (7d)', value: '341k',  delta: '+12%', pos: true },
    { label: 'Retention', value: '58%',    delta: '−18%', pos: false },
    { label: 'Replies',   value: '1.1k',   delta: '+84',  pos: true },
  ];

  return (
    <CFShell active="audience">
      <D1cfSubTabs
        workspace="audience"
        active="Overview"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Last 30 days ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>All series ▾</span>
          </div>
        }
      />
      <CFBody>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--wf-paper)' }}>
          {/* Scoped composer at top */}
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="audience" variant="bar" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 24px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Metric row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: '14px 16px', background: 'var(--wf-paper)' }}>
                  <div style={{ fontSize: 10.5, color: 'var(--wf-ink-3)', letterSpacing: '0.04em', marginBottom: 8 }}>{m.label.toUpperCase()}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: 24, fontWeight: 500, color: 'var(--wf-ink)', letterSpacing: '-0.02em' }}>{m.value}</span>
                    <span style={{ fontSize: 11, color: m.pos ? 'var(--wf-accent)' : 'var(--wf-note)', fontWeight: 500 }}>{m.delta}</span>
                  </div>
                  <MiniChart height={28} style={{ marginTop: 10 }} />
                </div>
              ))}
            </div>

            {/* Two-col: retention chart + answers card */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, flex: 1, minHeight: 0 }}>
              <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--wf-ink)' }}>Retention by slide — last 7 dive-safety carousels</span>
                  <span style={{ flex: 1 }} />
                  <span className="wf-chip" style={{ fontSize: 10 }}>Open in chat ↗</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 24, paddingBottom: 4 }}>
                  {[96, 84, 70, 41, 38, 36].map((h, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10, color: i === 3 ? 'var(--wf-note)' : 'var(--wf-ink-2)', fontWeight: 600 }}>{h}%</span>
                      <div style={{ width: '100%', height: h * 1.8, background: i === 3 ? 'var(--wf-note)' : 'var(--wf-ink)', opacity: i === 3 ? 1 : 0.85, borderRadius: '3px 3px 0 0' }} />
                      <span style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>S{i + 1}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--wf-ink-3)' }}>Slide 4 is the consistent drop point. <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Ask why ↗</span></div>
              </div>

              <div style={{ border: '1px solid var(--wf-line)', borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--wf-ink)' }}>Quick asks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Who are my 10 newest engaged followers?',
                    'What did @marina.k post about me?',
                    'Replies I haven\'t answered in 48h',
                    'Which segments drove reach last week?',
                  ].map((q, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--wf-line)' : 'none', fontSize: 11.5, color: 'var(--wf-ink-2)' }}>
                      <span style={{ color: 'var(--wf-ink-3)', fontSize: 10, marginTop: 2 }}>↗</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="Audience composer is scoped to the data — 'Ask anything about your audience'" top={120} left={1000} />
      <D1cfPin n={2} text="every card has an 'Open in chat' affordance — analytics seeds conversation" top={360} left={680} />
      <D1cfPin n={3} text="Quick asks = canned pulls, sit alongside the chart, not in a rail" top={420} left={1140} />
    </CFShell>
  );
}

// ─── 6 · Audience · Comments ────────────────────────────────
function CF_AudienceComments() {
  const clusters = [
    { id: 'c1', label: 'About safety gear', meta: '42', active: true },
    { id: 'c2', label: 'Decompression questions', meta: '28' },
    { id: 'c3', label: 'Fiji trip logistics', meta: '19' },
    { id: 'c4', label: 'Requests for gear teardown', meta: '14' },
    { id: 'c5', label: 'Night dive concerns', meta: '11' },
    { id: 'c6', label: 'Certification advice', meta: '9' },
  ];
  const comments = [
    { from: '@seabird.jo',   text: 'Do you trust your buddy\'s gear as much as your own? I don\'t.',                   when: '2h',  sentiment: 'neutral' },
    { from: '@marina.k',     text: 'Second this — had a near-miss with a rental reg last month. Write about it.',       when: '3h',  sentiment: 'positive' },
    { from: '@coldwater_cam', text: 'What regs are you running currently?',                                              when: '6h',  sentiment: 'question' },
    { from: '@dive.master_r', text: 'The whole industry ignores maintenance intervals. Would love a teardown.',          when: '7h',  sentiment: 'positive' },
    { from: '@newb_diver',   text: 'I never know what to check before a dive. A checklist post would be clutch.',        when: '9h',  sentiment: 'question' },
    { from: '@oceanophile',  text: 'Tell us the brand. We know you won\'t but tell us anyway 😂',                        when: '11h', sentiment: 'positive' },
  ];

  return (
    <CFShell active="audience">
      <D1cfSubTabs
        workspace="audience"
        active="Comments"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Last 7 days ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Unanswered</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>All sentiment ▾</span>
          </div>
        }
      />
      <CFBody>
        <CFRail
          label="CLUSTERS"
          items={clusters}
          active="c1"
          width={196}
          footer={<div style={{ padding: '8px 10px', fontSize: 10, color: 'var(--wf-ink-3)' }}>6 clusters · 123 comments</div>}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="audience" variant="bar" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Cluster header */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--wf-ink)' }}>About safety gear</span>
              <span style={{ fontSize: 11, color: 'var(--wf-ink-3)' }}>42 comments · sentiment +.62 · 7 unanswered</span>
              <span style={{ flex: 1 }} />
              <span className="wf-chip" style={{ fontSize: 10 }}>Reply to all ↗</span>
              <span className="wf-chip" style={{ fontSize: 10 }}>Open in chat</span>
            </div>

            {/* Summary paragraph (AI-generated, Perplexity-style flowing text) */}
            <div style={{ fontSize: 12.5, color: 'var(--wf-ink)', lineHeight: 1.6, maxWidth: 820 }}>
              Your audience keeps circling back to <strong>gear reliability</strong> — especially rentals, regulators, and maintenance. Three asks are shaped like posts: a <em>pre-dive checklist</em>, a <em>regulator teardown</em>, and a <em>near-miss story about rental gear</em>. Two creators in the cluster (<span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>@marina.k</span>, <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>@dive.master_r</span>) would likely amplify. <span style={{ color: 'var(--wf-ink-2)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Draft all three ↗</span>
            </div>

            {/* Comment list */}
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--wf-line)', borderRadius: 6, background: 'var(--wf-paper)' }}>
              {comments.map((c, i) => (
                <div key={i} style={{ padding: '10px 14px', borderBottom: i < comments.length - 1 ? '1px solid var(--wf-line)' : 'none', display: 'flex', gap: 10 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line)', flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--wf-ink)' }}>{c.from}</span>
                      <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{c.when}</span>
                      {c.sentiment === 'positive' && <span style={{ fontSize: 9, color: 'var(--wf-accent)' }}>●</span>}
                      {c.sentiment === 'question' && <span style={{ fontSize: 9, color: 'var(--wf-ink-3)' }}>?</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--wf-ink)', lineHeight: 1.45 }}>{c.text}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <span className="wf-chip" style={{ fontSize: 9.5 }}>Reply</span>
                    <span className="wf-chip" style={{ fontSize: 9.5 }}>Draft from</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="Comments needs the rail — 6 clusters, not a flat list" top={120} left={12} />
      <D1cfPin n={2} text="AI summary is flowing text, not bullets — Perplexity-pattern" top={280} left={1060} />
      <D1cfPin n={3} text="'Draft from' on every comment — audience → studio is 1 click" top={520} left={1080} />
    </CFShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LIBRARY workspace  —  All · Posts · Drafts · Charts · Notes · Decisions
// ═══════════════════════════════════════════════════════════════════════════

// ─── 7 · Library · All (mixed artifacts) ────────────────────
function CF_LibraryAll() {
  const filters = [
    { id: 'all',    label: 'Everything', meta: '1,284', active: true },
    { id: 'fromc',  label: 'From chat',  meta: '412' },
    { id: 'mine',   label: 'Handmade',   meta: '872' },
    { id: 'shared', label: 'Shared',     meta: '23' },
    { id: 'starred',label: 'Starred',    meta: '41' },
  ];
  const tiles = [
    { kind: 'CAROUSEL', title: 'The dive that almost went wrong', tag: 'from chat', meta: '6 slides · ready',        accent: true },
    { kind: 'CHART',    title: 'Retention by slide · safety series', tag: 'from chat', meta: '7 posts · Apr 24' },
    { kind: 'NOTE',     title: 'Voice memo · "maybe open with a question"', tag: 'captured', meta: '38s · Mon' },
    { kind: 'POST',     title: 'Why I stopped giving gear advice', tag: 'published', meta: '4.1k reach · Apr 20' },
    { kind: 'STORY',    title: 'Fiji · Part 1 · The descent',      tag: 'scheduled', meta: '6 frames · Sat 6am' },
    { kind: 'DECISION', title: 'Drop the gear-brand ambiguity',    tag: 'from chat', meta: 'Apr 22 · 3 threads' },
    { kind: 'CHART',    title: 'Posting-time vs retention',         tag: 'from chat', meta: '90d window' },
    { kind: 'CAROUSEL', title: 'Night dive checklist',              tag: 'scheduled', meta: '5 slides · Tue 7am' },
    { kind: 'NOTE',     title: 'Brand voice · near-miss storytelling', tag: 'captured', meta: 'Apr 19' },
    { kind: 'POST',     title: 'Decompression for impatient divers', tag: 'draft', meta: 'Draft · 2d' },
    { kind: 'DECISION', title: 'Kill the "gear pro" angle',          tag: 'from chat', meta: 'Apr 18' },
    { kind: 'CAROUSEL', title: 'Rule of three, visual edition',      tag: 'draft', meta: '5 slides · Sun' },
  ];

  return (
    <CFShell active="library">
      <D1cfSubTabs
        workspace="library"
        active="All"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Sort: recent ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Grid</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>List</span>
          </div>
        }
      />
      <CFBody>
        <CFRail label="FILTER" items={filters} active="all" width={180} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid var(--wf-line)' }}>
            <D1cfScopedComposer workspace="library" variant="bar" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '16px 24px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {tiles.map((t, i) => (
                <div key={i} style={{ border: t.accent ? '1px solid var(--wf-ink-2)' : '1px solid var(--wf-line)', borderRadius: 6, padding: 12, background: 'var(--wf-paper)', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 150 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="wf-tag wf-tag-panel" style={{ fontSize: 9 }}>{t.kind}</span>
                    <span style={{ flex: 1 }} />
                    {t.tag === 'from chat' && <span style={{ fontSize: 9, color: 'var(--wf-accent)' }}>◉ chat</span>}
                  </div>
                  <div style={{ flex: 1, background: 'var(--wf-paper-2)', borderRadius: 3, minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.kind === 'CHART' ? <MiniChart height={32} /> : t.kind === 'NOTE' || t.kind === 'DECISION' ? <Textlines lines={3} style={{ width: '80%' }} /> : <Hatch style={{ width: '75%', height: 28 }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--wf-ink)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 2 }}>{t.title}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{t.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="Library composer = search + ask; 'search your library or ask'" top={120} left={1000} />
      <D1cfPin n={2} text="◉ chat badge = 'produced by a conversation'" top={260} left={1040} />
      <D1cfPin n={3} text="filter rail is collapsible — saves vertical room when deep-linking" top={120} left={12} />
    </CFShell>
  );
}

// ─── 8 · Library · Draft detail (artifact open) ─────────────
function CF_LibraryDraftDetail() {
  return (
    <CFShell active="library">
      <D1cfSubTabs
        workspace="library"
        active="Drafts"
        leftAccessory={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--wf-ink-3)' }}>
            <span>Library</span>
            <span>/</span>
            <span>Drafts</span>
            <span>/</span>
            <span style={{ color: 'var(--wf-ink-2)' }}>The dive that…</span>
          </div>
        }
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>Duplicate</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Share</span>
            <span className="wf-chip wf-chip-accent" style={{ fontSize: 10 }}>Schedule</span>
          </div>
        }
      />
      <CFBody>
        <main style={{ flex: 1, display: 'flex', minWidth: 0 }}>
          {/* Canvas side */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--wf-paper-2)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, width: 640 }}>
                {['HOOK', 'STORY', 'PIVOT', 'LESSON', 'PROOF', 'CTA'].map((label, i) => (
                  <div key={i} className="wf-sketch wf-sketch-thin" style={{ aspectRatio: '4/5', padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--wf-paper)', borderColor: i === 0 ? 'var(--wf-accent)' : undefined, borderWidth: i === 0 ? 2 : 1 }}>
                    <span className="wf-label" style={{ fontSize: 9, color: i === 0 ? 'var(--wf-accent)' : 'var(--wf-ink-3)' }}>{label} · {String(i + 1).padStart(2, '0')}</span>
                    <Textlines lines={3} />
                    <span style={{ fontSize: 8.5, color: 'var(--wf-ink-3)' }}>{i === 0 ? 'rule of three — active' : 'standard frame'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '10px 24px', borderTop: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--wf-paper)' }}>
              <span style={{ fontSize: 10.5, color: 'var(--wf-ink-3)' }}>Autosaved · 3 minutes ago</span>
              <span style={{ flex: 1 }} />
              <span className="wf-chip" style={{ fontSize: 10 }}>Version history (4)</span>
              <span className="wf-chip" style={{ fontSize: 10 }}>Export</span>
            </div>
          </div>

          {/* Right pane — provenance + ask */}
          <aside style={{ width: 320, borderLeft: '1px solid var(--wf-line)', background: 'var(--wf-paper)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid var(--wf-line)' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--wf-ink)', marginBottom: 4 }}>The dive that almost went wrong</div>
              <div style={{ fontSize: 10.5, color: 'var(--wf-ink-3)' }}>Carousel · 6 slides · ready · Fri 7:10a</div>
            </div>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--wf-line)' }}>
              <div style={{ fontSize: 10, color: 'var(--wf-ink-3)', letterSpacing: '0.04em', marginBottom: 8 }}>FROM</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--wf-paper-2)', borderRadius: 4, fontSize: 11 }}>
                <span style={{ color: 'var(--wf-accent)' }}>◉</span>
                <span style={{ color: 'var(--wf-ink), flex: 1', flex: 1 }}>Why dive-safety retention dropped</span>
                <span style={{ color: 'var(--wf-ink-3)', fontSize: 9.5 }}>3m</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--wf-ink-3)', marginTop: 6 }}>Generated in turn 4 of 6 · <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Open thread</span></div>
            </div>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--wf-line)' }}>
              <div style={{ fontSize: 10, color: 'var(--wf-ink-3)', letterSpacing: '0.04em', marginBottom: 8 }}>REFERENCES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  'Post #0042 · rule of three',
                  'Post #0051 · near-miss frame',
                  'Chart · retention by slide',
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--wf-ink-2)', padding: '3px 0' }}>
                    <span style={{ color: 'var(--wf-ink-3)', fontSize: 9 }}>↗</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--wf-ink-3)', letterSpacing: '0.04em' }}>ASK ABOUT THIS DRAFT</div>
              <D1cfScopedComposer workspace="studio" variant="bar" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {['Rewrite hook slide', 'Make it 4 slides', 'Change tone to darker', 'Suggest a CTA'].map((q, i) => (
                  <span key={i} className="wf-chip" style={{ fontSize: 9.5 }}>{q}</span>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </CFBody>
      <D1cfPin n={1} text="breadcrumb slots into the sub-tab row — don't add a 3rd nav strip" top={62} left={24} />
      <D1cfPin n={2} text="provenance pane: every artifact remembers the thread it came from" top={180} left={1080} />
      <D1cfPin n={3} text="ask-about-this: chat scoped to THIS artifact, not globally" top={520} left={1080} />
    </CFShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PULSE workspace  —  For you · Creator niche · Your audience · Mentions
// ═══════════════════════════════════════════════════════════════════════════

// ─── 9 · Pulse · For you (feed, no composer) ────────────────
function CF_PulseForYou() {
  const stories = [
    { kind: 'audience', title: '@marina.k tagged you in a thread about gear', meta: '12 min ago · 184 likes', tag: 'MENTION' },
    { kind: 'niche',    title: 'Dive-safety creators are shifting to near-miss storytelling', meta: '3h ago · 8 creators', tag: 'TREND' },
    { kind: 'audience', title: '3 of your top 50 followers started asking about regs', meta: 'today', tag: 'SIGNAL' },
    { kind: 'niche',    title: '"Rule of three" hooks up 40% in saves across dive carousels', meta: 'this week', tag: 'TREND' },
    { kind: 'audience', title: 'Retention on your safety series vs cohort', meta: 'Apr 18 – 24', tag: 'COMPARE' },
    { kind: 'niche',    title: 'New dive-safety accounts above 10k (4 this month)', meta: 'Apr', tag: 'NETWORK' },
  ];

  return (
    <CFShell active="pulse">
      <D1cfSubTabs
        workspace="pulse"
        active="For you"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="wf-chip" style={{ fontSize: 10 }}>All sources ▾</span>
            <span className="wf-chip" style={{ fontSize: 10 }}>Unseen (12)</span>
          </div>
        }
      />
      <CFBody>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'hidden', padding: '18px 0 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 780, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Lead story — bigger */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingBottom: 18, borderBottom: '1px solid var(--wf-line)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9.5, color: 'var(--wf-ink-3)', letterSpacing: '0.06em' }}>
                    <span style={{ color: 'var(--wf-accent)' }}>●</span>
                    <span>AUDIENCE · MENTION</span>
                    <span>·</span>
                    <span>12 MIN AGO</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--wf-ink)', letterSpacing: '-0.015em', lineHeight: 1.2 }}>
                    @marina.k tagged you in a thread about rental regulator reliability
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--wf-ink-2)', lineHeight: 1.5 }}>
                    Thread has 184 likes and 42 replies. Two of her followers asked if you'd publish a teardown. The thread's tone matches the "near-miss" frame your last two carousels used.
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span className="wf-chip" style={{ fontSize: 10 }}>Open thread ↗</span>
                    <span className="wf-chip" style={{ fontSize: 10 }}>Draft a reply</span>
                    <span className="wf-chip" style={{ fontSize: 10 }}>Save to Library</span>
                  </div>
                </div>
                <div style={{ background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line)', borderRadius: 6, minHeight: 200, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>@marina.k · original post</div>
                  <Textlines lines={6} />
                  <div style={{ flex: 1 }} />
                  <div style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>184 likes · 42 replies · 18 reposts</div>
                </div>
              </div>

              {/* Feed rows */}
              {stories.slice(1).map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16, paddingBottom: 16, borderBottom: i < stories.length - 2 ? '1px solid var(--wf-line)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9.5, color: 'var(--wf-ink-3)', letterSpacing: '0.06em' }}>
                      <span style={{ color: s.kind === 'audience' ? 'var(--wf-accent)' : 'var(--wf-ink-3)' }}>{s.kind === 'audience' ? '●' : '○'}</span>
                      <span>{s.kind === 'audience' ? 'YOUR AUDIENCE' : 'CREATOR NICHE'}</span>
                      <span>·</span>
                      <span>{s.tag}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--wf-ink)', lineHeight: 1.3 }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--wf-ink-3)' }}>{s.meta}</div>
                  </div>
                  <div style={{ background: 'var(--wf-paper-2)', border: '1px solid var(--wf-line)', borderRadius: 4, minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.tag === 'TREND' || s.tag === 'COMPARE' ? <MiniChart height={28} /> : <Hatch style={{ width: '70%', height: 24 }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="Pulse is the 4th workspace — Discover for a creator tool" top={16} left={680} />
      <D1cfPin n={2} text="no composer on Pulse — it's signal, not interaction" top={120} left={1080} />
      <D1cfPin n={3} text="each story has a 'Draft a reply' or 'Open in chat' action" top={300} left={1080} />
    </CFShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ⌘K global overlay  —  jump + ask, mixed results
// ═══════════════════════════════════════════════════════════════════════════

function CF_CmdK() {
  const groups = [
    {
      label: 'CONTINUE A THREAD',
      items: [
        { icon: '◉', title: 'Why dive-safety retention dropped',  meta: '3m · Studio' },
        { icon: '◉', title: 'Hook lines for Fiji series',         meta: '1h · Studio' },
      ],
    },
    {
      label: 'JUMP TO',
      items: [
        { icon: '→', title: 'Audience · Retention',                meta: 'Audience' },
        { icon: '→', title: 'Library · Drafts · The dive that…',   meta: 'Library' },
        { icon: '→', title: 'Studio · Schedule · Fri',             meta: 'Studio' },
      ],
    },
    {
      label: 'ASK IN CONTEXT',
      items: [
        { icon: '✦', title: 'Ask about this library…',             meta: 'Library · new thread' },
        { icon: '✦', title: 'Ask about last week\'s audience…',    meta: 'Audience · new thread' },
      ],
    },
  ];

  return (
    <CFShell active="studio">
      <D1cfSubTabs workspace="studio" active="Threads" />
      <CFBody>
        <main style={{ flex: 1, background: 'var(--wf-paper)', position: 'relative' }}>
          {/* Dimmed backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 20, 30, 0.18)', backdropFilter: 'blur(1px)' }} />

          {/* Palette */}
          <div style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', width: 620, background: 'var(--wf-paper)', border: '1px solid var(--wf-ink-2)', borderRadius: 10, boxShadow: '0 24px 56px -24px rgba(0,0,0,0.24)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15, color: 'var(--wf-ink-3)' }}>⌘</span>
              <input readOnly value="retention last" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--wf-ink)', fontFamily: 'inherit' }} />
              <span className="wf-chip" style={{ fontSize: 10 }}>@library</span>
              <span style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>⌘K</span>
            </div>

            <div style={{ padding: '6px 0 8px', maxHeight: 440, overflow: 'hidden' }}>
              {groups.map((g, gi) => (
                <div key={gi} style={{ padding: '6px 0' }}>
                  <div style={{ padding: '4px 16px', fontSize: 9.5, color: 'var(--wf-ink-3)', letterSpacing: '0.06em' }}>{g.label}</div>
                  {g.items.map((it, i) => (
                    <div key={i} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--wf-ink)', background: gi === 0 && i === 0 ? 'var(--wf-paper-2)' : 'transparent' }}>
                      <span style={{ width: 14, color: 'var(--wf-ink-3)', fontSize: 11 }}>{it.icon}</span>
                      <span style={{ flex: 1 }}>{it.title}</span>
                      <span style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>{it.meta}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--wf-ink-3)' }}>
              <span>↵</span><span>open</span>
              <span style={{ margin: '0 6px' }}>·</span>
              <span>⌘↵</span><span>ask in new thread</span>
              <span style={{ flex: 1 }} />
              <span>esc to close</span>
            </div>
          </div>
        </main>
      </CFBody>
      <D1cfPin n={1} text="⌘K is the everywhere-shortcut — mixes jumps + continue-a-thread + ask-in-context" top={120} left={40} />
      <D1cfPin n={2} text="⌘↵ opens a new chat thread scoped to wherever you were" top={540} left={1040} />
    </CFShell>
  );
}

Object.assign(window, {
  CF_StudioThreadsLanding,
  CF_StudioThreadsActive,
  CF_StudioDrafts,
  CF_StudioSchedule,
  CF_AudienceOverview,
  CF_AudienceComments,
  CF_LibraryAll,
  CF_LibraryDraftDetail,
  CF_PulseForYou,
  CF_CmdK,
});
