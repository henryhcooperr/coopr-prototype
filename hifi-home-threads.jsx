/* global React, window, HfShell */
/* hifi-home-threads.jsx — Home / Threads.
   The list view of every agent conversation Henry has had with COOPR:
   pinned + active + archived. 3-pane editorial layout —
   filter rail (260) · thread list (flex) · detail pane (380). */

const HT = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

// ─── Atoms ───────────────────────────────────────────────
function HT_Meta({ children, color = 'var(--fg-tertiary)', size = 10, style = {} }) {
  return <span style={{ fontFamily: HT.sans, fontSize: size, color, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...style }}>{children}</span>;
}
function HT_Mono({ children, color = 'var(--fg-secondary)', size = 11, style = {} }) {
  return <span style={{ fontFamily: HT.mono, fontSize: size, color, fontVariantNumeric: 'tabular-nums', ...style }}>{children}</span>;
}
function HT_PinGlyph({ on = false, size = 11 }) {
  // Inline SVG pin — filled if on, outlined otherwise.
  const fill = on ? 'var(--accent-primary)' : 'none';
  const stroke = on ? 'var(--accent-primary)' : 'var(--fg-tertiary)';
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
      <path d="M6 1.5 L6 6.5 M3.5 4 L8.5 4 L8 7 L4 7 Z M6 7 L6 10.5"
            fill={fill} stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Data ────────────────────────────────────────────────
const HT_THREADS = [
  // 6 PINNED
  { id: 't1',  group: 'pinned', title: 'Re: Truk Lagoon · Fujikawa Maru episode',          preview: 'Pulled the dive log into the cold-open. Three openers under 1.2s ready.',         lastTouched: '11m', turns: 38, agent: 'COOPR', kind: 'studio'   },
  { id: 't2',  group: 'pinned', title: 'Pillar coverage gaps · Q2',                          preview: 'Safety-Education is at 14% of last quarter. Wreck-storytelling is doubled.',     lastTouched: '1h',  turns: 22, agent: 'COOPR', kind: 'planning' },
  { id: 't3',  group: 'pinned', title: 'Voice rules · ascent-rate critique',                 preview: 'Three replies drafted that don\'t bait the comment thread.',                    lastTouched: '3h',  turns: 17, agent: 'COOPR', kind: 'voice'    },
  { id: 't4',  group: 'pinned', title: 'Reply ideas for @marina.k',                          preview: 'She asked about deco margins on the Suunto D5. Two reply variants.',             lastTouched: '6h',  turns: 9,  agent: 'COOPR', kind: 'inbox'    },
  { id: 't5',  group: 'pinned', title: 'Buddy-check rewrite · long-form pillar',             preview: 'Outline → script → frames. Hook still soft. Worth one more pass tonight.',     lastTouched: 'yest', turns: 31, agent: 'COOPR', kind: 'studio'   },
  { id: 't6',  group: 'pinned', title: 'Sponsor pitch · Mares regulator series',             preview: 'Brand-fit memo + suggested terms + first email draft.',                          lastTouched: 'yest', turns: 14, agent: 'COOPR', kind: 'brand'    },

  // 4 ACTIVE
  { id: 't7',  group: 'active', title: 'Repurpose 0046 to TikTok',                            preview: 'Cropped vertical, captions re-timed, hook variant for TT audience.',            lastTouched: '2d',  turns: 6,  agent: 'COOPR', kind: 'studio'   },
  { id: 't8',  group: 'active', title: 'Audience question · CCR vs OC for wrecks',           preview: 'Six DMs in the last week. Worth a one-take primer instead of replies.',         lastTouched: '2d',  turns: 11, agent: 'COOPR', kind: 'inbox'    },
  { id: 't9',  group: 'active', title: 'Caption pass · 0044 (gear teardown)',                preview: 'Three variants without "simply." Last one feels closest to your voice.',        lastTouched: '3d',  turns: 8,  agent: 'COOPR', kind: 'voice'    },
  { id: 't10', group: 'active', title: 'Posting plan · next 7 days',                          preview: 'Tue safety primer · Fri storytime · Sun gear. Holds reserve for Truk teaser.',  lastTouched: '4d',  turns: 5,  agent: 'COOPR', kind: 'planning' },

  // 2 ARCHIVED
  { id: 't11', group: 'archived', title: 'Reg first stage teardown · ep.2 outline',           preview: 'Outline shipped as 0044. Closing the thread.',                                  lastTouched: 'Apr 14', turns: 19, agent: 'COOPR', kind: 'studio' },
  { id: 't12', group: 'archived', title: 'Naming the dive-safety pillar',                      preview: 'Settled on "Safety-Education." Memory updated, this thread retired.',          lastTouched: 'Apr 09', turns: 12, agent: 'COOPR', kind: 'planning' },
];

// Detail-pane transcripts — keyed by thread id. Only a few entries needed.
const HT_TRANSCRIPTS = {
  t1: [
    { role: 'henry',  body: "What's the cleanest cold-open for the Fujikawa episode? I want it under 1.2s." },
    { role: 'agent',  body: "Three openers tested against your top-quartile retention curve. Two land at 1.08s, one at 1.18s. The 1.08 with the silt-burst is closest to your wreck-storytelling pillar." },
    { role: 'henry',  body: "Pull the silt-burst. Show me the in/out points." },
    { role: 'agent',  body: "00:00.00 → 00:01.08. In on the bow rail, out on the porthole light bloom. Cut sits on the second snare hit in the bed track." },
  ],
  t2: [
    { role: 'henry',  body: "Where am I underweight on pillar coverage this quarter?" },
    { role: 'agent',  body: "Safety-Education is at 14% of Q1's volume. Wreck-storytelling is at 220%. Gear-Reviews holding flat. The audience that subbed in March came in on a safety primer." },
    { role: 'henry',  body: "Suggest three safety-primer concepts I'd actually want to make." },
    { role: 'agent',  body: "Reg free-flow at depth. Buddy-separation protocol. Reading a dive table after deco. Each one maps to a real DM you got this month." },
  ],
  t3: [
    { role: 'henry',  body: "I keep seeing 'aggressive ascent' as a critique. I don't want to engage but I want to be on record." },
    { role: 'agent',  body: "Three reply variants. None of them re-air the critique. The third defers to the dive computer logs without naming the commenter." },
  ],
  t4: [
    { role: 'henry',  body: "@marina.k asked about deco margins on the D5. Help me sound like a diver, not a brand." },
    { role: 'agent',  body: "Two variants. The longer one mentions her own depth profile from her last post — feels like a peer reading her work, not a press release." },
  ],
  t5: [
    { role: 'henry',  body: "Buddy-check piece needs a stronger hook. Current one is too procedural." },
    { role: 'agent',  body: "Tested four. The mistake-first variant beats your average by 1.4× on first 0:03 retention. The other three test below your median." },
  ],
  t6: [
    { role: 'henry',  body: "Mares wants to talk about the regulator series. What's the brand-fit risk?" },
    { role: 'agent',  body: "Low. Their EU storytelling matches your audience age band. Risk is the dive-shop sponsorships you've already declined — Mares would land cleaner if framed as gear, not endorsement." },
  ],
  t7: [
    { role: 'henry',  body: "Repurpose 0046 for TikTok. Hook should change." },
    { role: 'agent',  body: "Vertical re-cut and a TT-native hook ready. The cold-open swaps the editorial title card for a question framing — 'do you trim the cold-open or the close?'" },
  ],
  t8: [
    { role: 'henry',  body: "I keep getting CCR-vs-OC questions. Worth a primer?" },
    { role: 'agent',  body: "Six DMs in 7 days. Two are from peers, four are from learners. A one-take primer would close the loop without running a reply marathon." },
  ],
  t9: [
    { role: 'henry',  body: "Captions for 0044 — three variants, none with 'simply.'" },
    { role: 'agent',  body: "Three variants. The middle one carries the teardown rhythm best. Removed 'simply' and the closer 'hope this helps' you don't use anymore." },
  ],
  t10: [
    { role: 'henry',  body: "Lay out next week. Hold reserve for the Truk teaser." },
    { role: 'agent',  body: "Tue safety primer. Fri storytime. Sun gear. Truk teaser slotted Wed evening. Reserve held for Sat AM if you want to pull it forward." },
  ],
  t11: [
    { role: 'henry',  body: "0044 shipped. Closing this thread." },
    { role: 'agent',  body: "Closed. Memory updated — outline → script → frames was the order, will repeat next teardown." },
  ],
  t12: [
    { role: 'henry',  body: "We're calling the safety pillar Safety-Education." },
    { role: 'agent',  body: "Saved. Pillar registry updated and reflected on Library and Insights." },
  ],
};

// ─── Filter rail ─────────────────────────────────────────
function HT_FilterRail({ activeGroup, onPick, threads }) {
  const counts = {
    pinned:   threads.filter(t => t.group === 'pinned').length,
    active:   threads.filter(t => t.group === 'active').length,
    archived: threads.filter(t => t.group === 'archived').length,
  };
  const items = [
    { key: 'pinned',   label: 'Pinned',   blurb: 'Threads you keep returning to' },
    { key: 'active',   label: 'Active',   blurb: 'Touched in the last 7 days'    },
    { key: 'archived', label: 'Archived', blurb: 'Closed but kept on record'      },
  ];
  return (
    <aside style={{ width: 260, flexShrink: 0, padding: '32px 24px 32px 32px', borderRight: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <HT_Meta size={9.5}>Filter</HT_Meta>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
          {items.map((it, i) => {
            const isActive = activeGroup === it.key;
            return (
              <div key={it.key}
                   onClick={() => onPick(it.key)}
                   style={{
                     padding: '14px 12px',
                     borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                     background: isActive ? 'var(--accent-soft)' : 'transparent',
                     borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                     cursor: 'pointer',
                     display: 'flex', flexDirection: 'column', gap: 4,
                   }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: HT.sans, fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{it.label}</span>
                  <HT_Mono size={11} color={isActive ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'}>{counts[it.key]}</HT_Mono>
                </div>
                <span style={{ fontFamily: HT.serif, fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-tertiary)', lineHeight: 1.45 }}>{it.blurb}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border-subtle)' }} />

      <div>
        <HT_Meta size={9.5}>Span</HT_Meta>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            ['Today',        2],
            ['This week',    6],
            ['This month',  10],
            ['All time',    12],
          ].map(([label, n]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '6px 4px' }}>
              <span style={{ fontFamily: HT.sans, fontSize: 12.5, color: 'var(--fg-secondary)' }}>{label}</span>
              <HT_Mono size={11} color="var(--fg-tertiary)">{n}</HT_Mono>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '14px 12px', background: 'var(--surface-2)', borderRadius: 6, fontFamily: HT.serif, fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
        Threads pin to the top when you return to them three times. Strike a thread to forget the conversation.
      </div>
    </aside>
  );
}

// ─── Thread list (center pane) ───────────────────────────
function HT_KindGlyph({ kind }) {
  const map = {
    studio:   'St',
    voice:    'Vo',
    inbox:    'In',
    planning: 'Pl',
    brand:    'Br',
  };
  return (
    <span style={{
      width: 20, height: 20, borderRadius: 4,
      background: 'var(--surface-2)', color: 'var(--fg-secondary)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: HT.mono, fontSize: 9, fontWeight: 700,
      flexShrink: 0,
    }}>{map[kind] || 'Th'}</span>
  );
}

function HT_ThreadList({ threads, activeGroup, activeId, onPick }) {
  const filtered = threads.filter(t => t.group === activeGroup);
  return (
    <main style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: '32px 36px 56px', background: 'var(--bg-base)' }}>
      {/* Editorial header */}
      <header style={{ marginBottom: 24 }}>
        <HT_Meta size={10}>Home · Threads · {activeGroup === 'pinned' ? 'Pinned' : activeGroup === 'active' ? 'Active' : 'Archived'}</HT_Meta>
        <h1 style={{
          margin: '8px 0 6px',
          fontFamily: HT.serif, fontWeight: 500, fontSize: 30,
          color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>
          Every <span style={{ fontStyle: 'italic' }}>conversation</span> we've had.
        </h1>
        <div style={{ fontFamily: HT.sans, fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 640 }}>
          The agent keeps the work and the reasoning side by side. Reopen any thread to keep going from where you stopped.
        </div>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, paddingBottom: 8, borderBottom: '1px solid var(--border-default)' }}>
        <HT_Meta size={9.5}>{filtered.length} threads</HT_Meta>
        <span style={{ flex: 1 }} />
        <HT_Mono size={10} color="var(--fg-tertiary)">sorted by last touched</HT_Mono>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filtered.map((th) => {
          const isActive = th.id === activeId;
          return (
            <div key={th.id}
                 onClick={() => onPick(th.id)}
                 style={{
                   padding: '16px 14px',
                   borderBottom: '1px solid var(--border-subtle)',
                   background: isActive ? 'var(--accent-soft)' : 'transparent',
                   cursor: 'pointer',
                   display: 'grid',
                   gridTemplateColumns: '20px 1fr 90px',
                   gap: 14,
                   alignItems: 'baseline',
                 }}>
              <HT_KindGlyph kind={th.kind} />

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: HT.serif, fontStyle: 'italic', fontSize: 16.5, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.3 }}>{th.title}</span>
                  {th.group === 'pinned' && <HT_PinGlyph on size={10} />}
                </div>
                <div style={{ fontFamily: HT.sans, fontSize: 12.5, color: 'var(--fg-tertiary)', lineHeight: 1.45, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {th.preview}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <HT_Mono size={10.5} color="var(--fg-secondary)">{th.lastTouched}</HT_Mono>
                <HT_Mono size={9.5} color="var(--fg-tertiary)">{th.turns} turns</HT_Mono>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer · italic-serif close */}
      <div style={{ marginTop: 32, padding: '20px 0', borderTop: '1px solid var(--border-default)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontFamily: HT.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>
          Pin the threads you'd come back to. Archive the ones the work has outgrown.
        </span>
        <HT_Mono size={10} color="var(--fg-tertiary)">{HT_THREADS.length} total · 6 pinned · 4 active · 2 archived</HT_Mono>
      </div>
    </main>
  );
}

// ─── Detail pane (right) ─────────────────────────────────
function HT_DetailPane({ thread, transcript }) {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  if (!thread) return null;
  return (
    <aside style={{ width: 380, flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '28px 24px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <HT_Meta size={9.5}>Thread · {thread.group}</HT_Meta>
          <span style={{ flex: 1 }} />
          {thread.group === 'pinned' && <HT_PinGlyph on size={11} />}
        </div>
        <h2 style={{
          margin: '0 0 8px',
          fontFamily: HT.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 21,
          color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.25,
        }}>
          {thread.title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <HT_Mono size={10} color="var(--fg-tertiary)">{thread.turns} turns</HT_Mono>
          <span style={{ width: 3, height: 3, background: 'var(--fg-tertiary)', borderRadius: '50%' }} />
          <HT_Mono size={10} color="var(--fg-tertiary)">touched {thread.lastTouched}</HT_Mono>
        </div>
      </div>

      {/* Transcript */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(transcript || []).map((m, i) => {
          const isAgent = m.role === 'agent';
          return (
            <div key={i} style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: isAgent ? 'var(--surface-2)' : 'var(--accent-soft)',
              borderLeft: isAgent ? '2px solid var(--border-default)' : '2px solid var(--accent-primary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <HT_Meta size={9} color={isAgent ? 'var(--fg-secondary)' : 'var(--accent-primary-press)'}>
                  {isAgent ? 'COOPR' : 'HENRY'}
                </HT_Meta>
                <HT_Mono size={9} color="var(--fg-tertiary)">turn {i + 1}</HT_Mono>
              </div>
              <span style={{
                fontFamily: isAgent ? HT.serif : HT.sans,
                fontStyle: isAgent ? 'italic' : 'normal',
                fontSize: isAgent ? 14 : 13,
                color: 'var(--fg-primary)',
                lineHeight: 1.55,
              }}>{m.body}</span>
            </div>
          );
        })}
      </div>

      {/* Footer · open in chat */}
      <div style={{ padding: '18px 24px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          onClick={() => ms.setActiveSurface && ms.setActiveSurface('home', null)}
          style={{
            flex: 1,
            height: 38,
            padding: '0 14px',
            background: 'var(--accent-primary)',
            color: 'var(--fg-on-accent)',
            borderRadius: 8,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: HT.sans, fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 120ms ease',
          }}>
          Open in chat
          <span style={{ fontFamily: HT.mono, fontSize: 11 }}>→</span>
        </span>
        <span
          onClick={() => ms.pushToast && ms.pushToast(thread.group === 'pinned' ? 'Unpin thread · ' + thread.id : 'Pin thread · ' + thread.id)}
          style={{
            width: 38, height: 38,
            border: '1px solid var(--border-default)',
            background: 'var(--surface-1)',
            borderRadius: 8,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--fg-secondary)',
            cursor: 'pointer',
            transition: 'transform 120ms ease',
          }}>
          <HT_PinGlyph on={thread.group === 'pinned'} size={13} />
        </span>
      </div>
    </aside>
  );
}

// ─── Main surface ────────────────────────────────────────
function HF_HomeThreads({ state = 'happy' }) {
  // R10 · state variants — read tweaks override, fall back to prop.
  // Hooks above any early return so React's rules-of-hooks holds.
  const ovr = window.useSurfaceState && window.useSurfaceState('home', 'Threads');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  const [activeGroup, setActiveGroup] = React.useState('pinned');
  const [activeId, setActiveId] = React.useState('t1');
  if (s === 'loading') {
    return <HfShell workspace="home" subtab="Threads"><window.HF_SkeletonHero shape="feed" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="home" subtab="Threads"><window.HF_EmptyHero
      eyebrow="Threads · 0 conversations"
      title="No threads yet. Start the day with a question."
      caption="Pinned chats with the agent collect here. Ask anything in Today to begin."
      ctaLabel="Open composer"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="home" subtab="Threads"><window.HF_ErrorHero
      title="Couldn't load your threads."
      body="The conversation index timed out. Retry, or come back in a minute."
    /></HfShell>;
  }

  // If we switch groups and the active thread isn't in the new group, pick the first one in it.
  const inGroup = HT_THREADS.filter(t => t.group === activeGroup);
  const currentId = inGroup.some(t => t.id === activeId) ? activeId : (inGroup[0] && inGroup[0].id);
  const currentThread = HT_THREADS.find(t => t.id === currentId);
  const currentTranscript = currentId ? HT_TRANSCRIPTS[currentId] : null;

  const handlePickGroup = (g) => {
    setActiveGroup(g);
    const first = HT_THREADS.find(t => t.group === g);
    if (first) setActiveId(first.id);
  };

  return (
    <HfShell workspace="home" subtab="Threads">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <HT_FilterRail
          activeGroup={activeGroup}
          onPick={handlePickGroup}
          threads={HT_THREADS}
        />
        <HT_ThreadList
          threads={HT_THREADS}
          activeGroup={activeGroup}
          activeId={currentId}
          onPick={setActiveId}
        />
        <HT_DetailPane
          thread={currentThread}
          transcript={currentTranscript}
        />
      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_HomeThreads });
