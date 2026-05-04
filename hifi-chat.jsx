/* global React */
// hifi-chat.jsx — Studio Threads chat surface, round 3 v2.
// Variants: default · cold-start · active thread.
// Key fixes vs v1: composer cleaned, capsule redesigned as editorial brief,
// suggestion pills redesigned as two-line provocations, sidebar threads list
// redesigned with body preview + signal markers.

const HF_TABS = [
  { id: 'studio',   label: 'Studio' },
  { id: 'audience', label: 'Audience' },
  { id: 'library',  label: 'Library' },
  { id: 'pulse',    label: 'Pulse' },
];

function ensureChatPolishStyles() {
  if (typeof document === 'undefined' || document.getElementById('hfc-polish-styles')) return;
  const style = document.createElement('style');
  style.id = 'hfc-polish-styles';
  style.textContent = `
    @keyframes hfc-word-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes hfc-caret { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
    @keyframes hfc-tool-in { from { opacity: 0; transform: scale(0.985); } to { opacity: 1; transform: scale(1); } }
    .hfc-word { display: inline-block; white-space: pre; animation: hfc-word-in 220ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .hfc-caret { display: inline-block; width: 1px; height: 1.05em; margin-left: 2px; background: var(--accent-primary); vertical-align: -2px; animation: hfc-caret 1s steps(1, end) infinite; }
    .hfc-tool-run { animation: hfc-tool-in 260ms cubic-bezier(0.2, 0.7, 0.2, 1) both; transform-origin: center top; }
  `;
  document.head.appendChild(style);
}

ensureChatPolishStyles();

function StreamingLine({ text, active = false }) {
  if (!active) return <>{text}</>;
  const words = String(text).split(/(\s+)/);
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="hfc-word" style={{ animationDelay: `${Math.min(i * 18, 420)}ms` }}>{w}</span>
      ))}
      <span className="hfc-caret" />
    </>
  );
}

function ReasoningTrail({ active = false, steps = [] }) {
  if (!active) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 26, padding: '0 10px', marginBottom: 10,
      border: '1px solid var(--border-subtle)',
      borderRadius: 999,
      background: 'var(--surface-2)',
      color: 'var(--fg-secondary)',
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 700,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--accent-primary)', display: 'inline-block' }} />
      {steps.join(' · ')}
    </div>
  );
}

function ToolRunMorph({ active = false, children }) {
  return <div className={active ? 'hfc-tool-run' : ''}>{children}</div>;
}

// ─── Sidebar — editorial threads list with previews + signals ──
function ChatSidebar({ activeIdx = -1 }) {
  // Each thread: title, snippet (last assistant line, truncated), time,
  // signal (none | charts | drafts | reply). Signal is a tiny inline marker
  // that conveys what's *in* the thread without the chip-soup of v1.
  const groups = [
    {
      label: 'Today',
      meta:  'WED · APR 24',
      items: [
        { t: 'Why dive-safety retention dropped',
          s: 'The drop happens at 0:03 — 14% below your top quartile.',
          m: '12m', signal: 'charts', count: 2 },
        { t: 'Hook lines for Fiji series',
          s: '"You have ninety seconds underwater. Don\'t waste the first eight."',
          m: '1h',  signal: 'drafts', count: 3 },
      ],
    },
    {
      label: 'Yesterday',
      meta:  'TUE · APR 23',
      items: [
        { t: 'Reply ideas for @marina.k',
          s: 'Three options, ranked by how often you reply with humor vs. craft.',
          m: '4:12p', signal: 'reply',  count: 1 },
        { t: 'Repurpose 0042 → carousel',
          s: 'Six-frame breakdown. The hook stays; the middle gets quieter.',
          m: '11:08a', signal: 'drafts', count: 1 },
      ],
    },
    {
      label: 'This week',
      meta:  'MON–SUN',
      items: [
        { t: 'Audience deep-dive · safety lens',
          s: 'Your safety viewers skew older and finish more often than the channel avg.',
          m: 'Mon', signal: 'charts', count: 4 },
        { t: 'Caption tone · darker?',
          s: 'Looked at your top ten — the wins are funnier than you remember.',
          m: 'Mon', signal: null,    count: 0 },
        { t: 'Wreck-dive script outline',
          s: 'Beat sheet for a 2:30 piece, opening on the bow railing.',
          m: 'Sun', signal: 'drafts', count: 1 },
      ],
    },
    {
      label: 'Earlier',
      meta:  'APR',
      items: [
        { t: 'Series brainstorm · Q3', s: '"Lessons from things that almost killed me." · 8 candidates.', m: 'Apr 18', signal: 'drafts', count: 8 },
        { t: 'Bio refresh',             s: 'Three options. The middle one drops "underwater filmmaker".', m: 'Apr 12', signal: 'drafts', count: 3 },
      ],
    },
  ];

  return (
    <aside style={{
      width: 268,
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span className="hf-logo" style={{ width: 22, height: 22 }}>C</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--fg-primary)' }}>COOPR</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-tertiary)' }}>⇤</span>
      </div>

      {/* Compose row */}
      <div style={{ padding: '0 10px 10px' }}>
        <button style={{
          width: '100%', height: 34, padding: '0 10px',
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'transparent', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600,
          color: 'var(--fg-primary)', fontFamily: 'inherit', cursor: 'default',
        }}>
          <span style={{ fontSize: 15, lineHeight: 1, color: 'var(--accent-primary)', fontWeight: 600 }}>+</span>
          <span>New thread</span>
          <span style={{ flex: 1 }} />
          <span className="hf-key" style={{ fontSize: 10 }}>⌘N</span>
        </button>
        <div style={{
          marginTop: 6, height: 28, padding: '0 10px',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: 'var(--fg-tertiary)',
        }}>
          <span style={{ width: 10, height: 10, border: '1.5px solid var(--fg-tertiary)', borderRadius: '50%', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Search threads</span>
          <span className="hf-key" style={{ fontSize: 10 }}>⌘K</span>
        </div>
      </div>

      {/* Threads list */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '6px 0 0' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 14 }}>
            <div style={{ padding: '0 16px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--fg-secondary)', fontWeight: 500 }}>{g.label}</span>
              <span className="hf-byline" style={{ fontSize: 9 }}>{g.meta}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {g.items.map((it, i) => {
                const flatIdx = groups.slice(0, gi).reduce((acc, gg) => acc + gg.items.length, 0) + i;
                const isActive = flatIdx === activeIdx;
                return <ThreadRow key={i} it={it} active={isActive} />;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer — user */}
      <div style={{ padding: '10px 14px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 9 }}>
        <span className="hf-avatar" style={{ width: 26, height: 26 }} />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 600 }}>@henry.dives</span>
          <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)' }}>Pro · 7 scheduled this week</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--fg-tertiary)' }}>···</span>
      </div>
    </aside>
  );
}

function ThreadRow({ it, active }) {
  const sigMap = {
    charts: { gly: '◐', label: 'CHARTS', color: 'var(--accent-primary)' },
    drafts: { gly: '✎', label: 'DRAFTS', color: 'var(--fg-secondary)' },
    reply:  { gly: '↩', label: 'REPLY',  color: 'var(--tone-success)' },
  };
  const sig = it.signal ? sigMap[it.signal] : null;
  return (
    <div style={{
      padding: '8px 16px',
      display: 'flex', flexDirection: 'column', gap: 3,
      background: active ? 'var(--surface-2)' : 'transparent',
      borderLeft: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
      cursor: 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{
          flex: 1, minWidth: 0,
          fontSize: 12.5,
          fontWeight: active ? 600 : 500,
          color: 'var(--fg-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{it.t}</span>
        <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)', flexShrink: 0 }}>{it.m}</span>
      </div>
      <span style={{
        fontSize: 11.5,
        color: 'var(--fg-tertiary)',
        lineHeight: 1.45,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        fontStyle: 'italic',
        fontFamily: 'var(--font-serif)',
      }}>{it.s}</span>
      {sig && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: sig.color, fontWeight: 600, letterSpacing: '0.08em' }}>{sig.gly}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 600, letterSpacing: '0.08em' }}>
            {it.count} {sig.label}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Slim header — quiet centered tabs only ──────────────────
function ChatHeader({ active = 'studio' }) {
  return (
    <div style={{
      height: 52,
      padding: '0 24px',
      display: 'flex', alignItems: 'center',
      background: 'transparent',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: 28, position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: 52, alignItems: 'center' }}>
        {HF_TABS.map(t => (
          <span key={t.id} style={{
            fontSize: 13,
            fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
            cursor: 'default',
          }}>
            {t.label}
          </span>
        ))}
      </div>
      <span style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--fg-secondary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="hf-dot" style={{ background: 'var(--tone-success)' }} />
          7 scheduled
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)' }}>↗</span>
        </span>
      </div>
    </div>
  );
}

// ─── Composer — cleaner, single visual gesture row ────────────
function ChatComposer({ placeholder = 'Draft anything, or ask about your work.', model = 'Sonnet', scope = 'Library + Audience', docked = false, threadId = null }) {
  const gated = !!(threadId && window.JOB_REGISTRY && window.JOB_REGISTRY.gatedThreads().has(threadId));
  const runningJob = gated
    ? window.JOB_REGISTRY.listRunning().find((j) => j.gatesThreadId === threadId)
    : null;

  // Re-render every second while gated so the elapsed pill stays fresh.
  // Only run the ticker when gated — there's no visible state to refresh otherwise.
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!gated) return;
    const t = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, [gated]);

  function fmtElapsed(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(s / 60);
    const r = s - m * 60;
    return `${m}:${r < 10 ? '0' : ''}${r}`;
  }

  const placeholderText = gated
    ? `Composer locked while ${runningJob ? runningJob.label : 'a task'} is running`
    : placeholder;

  return (
    <div data-locked={gated ? '1' : '0'} style={{
      width: docked ? '100%' : 720,
      background: gated ? 'var(--surface-2)' : 'var(--surface-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 14,
      boxShadow: docked ? 'none' : '0 1px 0 rgba(26,24,21,0.02), 0 12px 32px -20px rgba(26,24,21,0.10)',
      overflow: 'hidden',
    }}>
      {/* Input area */}
      <div style={{ padding: '18px 20px 12px', minHeight: 60 }}>
        <span style={{ fontSize: 15.5, color: gated ? 'var(--fg-secondary)' : 'var(--fg-tertiary)', fontStyle: gated ? 'italic' : 'normal', fontFamily: gated ? 'var(--font-serif)' : 'inherit', lineHeight: 1.5 }}>{placeholderText}</span>
      </div>
      {/* Action row — left: scope only · right: model + send */}
      <div style={{ padding: '8px 12px 8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Scope chip — primary affordance */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 26, padding: '0 10px',
          fontSize: 11.5, color: 'var(--fg-secondary)', fontWeight: 500,
          background: 'transparent',
          borderRadius: 999,
          opacity: gated ? 0.5 : 1,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)' }}>＠</span>
          {scope}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)' }}>▾</span>
        </span>
        {/* Attach — quieter */}
        <span style={{
          width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: 'var(--fg-tertiary)', cursor: 'default',
          opacity: gated ? 0.4 : 1,
        }}>＋</span>
        <span style={{ flex: 1 }} />
        {/* Locked status pill — visible only when gated */}
        {gated && runningJob && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '0 10px', height: 22, borderRadius: 999,
            background: 'var(--surface-3)',
            fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'var(--fg-secondary)', fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: 'blk-step-pulse 1.4s ease-in-out infinite' }} />
            {fmtElapsed(Date.now() - runningJob.startedAt)} elapsed
          </span>
        )}
        {/* Voice */}
        <span style={{
          width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: 'var(--fg-tertiary)',
          opacity: gated ? 0.4 : 1,
        }}>◉</span>
        {/* Model — text only */}
        <span style={{ fontSize: 11.5, color: 'var(--fg-secondary)', fontWeight: 500, padding: '0 6px', opacity: gated ? 0.5 : 1 }}>
          {model}
        </span>
        {/* Send */}
        <span style={{
          width: 30, height: 30,
          background: gated ? 'var(--surface-3)' : 'var(--accent-primary)',
          color: gated ? 'var(--fg-tertiary)' : 'var(--fg-on-accent)',
          borderRadius: 999,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600,
        }}>↑</span>
      </div>
    </div>
  );
}

// ─── Suggestion provocations — two-line cards, not pills ──────
function SuggestionGrid({ items }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 8, width: 720, marginTop: 14,
    }}>
      {items.map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '10px 14px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          cursor: 'default',
          textAlign: 'left',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--fg-tertiary)',
            fontWeight: 600, letterSpacing: '0.08em',
            paddingTop: 2,
            flexShrink: 0,
          }}>{s.eyebrow}</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 13.5, lineHeight: 1.35,
              color: 'var(--fg-primary)', fontWeight: 500,
            }}>{s.prompt}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-tertiary)', paddingTop: 3 }}>↗</span>
        </div>
      ))}
    </div>
  );
}

// ─── Editorial brief capsule — replaces "Your week, briefly" ──
// Reads as a small print-style brief: dateline, one prose paragraph that
// does the work of a dashboard, and three pulls underneath that act as
// drill-ins. No more dashboard-tile vibe.
function WeekBrief() {
  return (
    <div style={{
      width: 720,
      marginTop: 32,
      background: 'transparent',
      borderTop: '1px solid var(--fg-primary)',
      padding: '14px 0 0',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {/* Dateline / masthead */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', fontWeight: 500 }}>
          The week so far
        </span>
        <span className="hf-byline" style={{ fontSize: 10 }}>WED · APR 24 · 09:42 PT</span>
      </div>

      {/* Lede paragraph — the brief itself */}
      <p style={{
        margin: 0,
        fontFamily: 'var(--font-serif)',
        fontSize: 16, lineHeight: 1.55,
        color: 'var(--fg-primary)',
        letterSpacing: '-0.005em',
      }}>
        Comments are up <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>69%</span> on the safety series — most of them asking the same two questions you haven't answered. Three drafts are ready to ship; one of them (<span style={{ fontStyle: 'italic' }}>0046</span>) tests a hook you haven't run before. Marina replied to your DM and is waiting.
      </p>

      {/* Pull row — three drill-ins, no card chrome */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
        {[
          { eyebrow: 'INBOX',     line: 'Two questions waiting',  num: '142', sub: 'comments · ↑ 69%' },
          { eyebrow: 'STUDIO',    line: 'Three ready to ship',     num: '3',   sub: 'of 12 open drafts' },
          { eyebrow: 'MENTIONS',  line: 'Marina replied',           num: '23',  sub: 'mentions · 3 creators' },
        ].map((p, i) => (
          <div key={i} style={{
            padding: '0 18px',
            borderLeft: i ? '1px solid var(--border-subtle)' : 'none',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <span className="hf-byline" style={{ fontSize: 9.5 }}>{p.eyebrow}</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)', lineHeight: 1.3 }}>{p.line}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{p.num}</span>
              <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>{p.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 1. DEFAULT ───────────────────────────────────────────
function HF_ChatDefault() {
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0 }}>
      <ChatSidebar activeIdx={-1} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '52px 32px 40px', overflow: 'auto' }}>
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <div className="hf-byline" style={{ marginBottom: 14 }}>STUDIO · THREADS</div>
            <div className="hf-headline" style={{ fontSize: 42, marginBottom: 10 }}>
              Good morning, <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Henry.</span>
            </div>
            <div className="hf-deck" style={{ fontSize: 15.5 }}>
              Draft, ask, schedule. Anything you make here lands in the Library.
            </div>
          </div>

          <ChatComposer />

          <SuggestionGrid items={[
            { eyebrow: 'DRAFT',     prompt: 'Three openers for the Fiji wreck series, under 1.2 seconds.' },
            { eyebrow: 'EXPLAIN',   prompt: 'Why did 0042 keep watchers and 0041 lose them at minute three?' },
            { eyebrow: 'SCHEDULE',  prompt: 'Lay out next week to balance safety, gear, and storytime.' },
            { eyebrow: 'REPLY',     prompt: 'Draft a reply to @marina.k that doesn\'t sound like a brand.' },
          ]} />

          <WeekBrief />
        </main>
      </div>
      </div>
    </HfShell>
  );
}

// ─── 2. COLD-START ────────────────────────────────────────
function HF_ChatEmpty() {
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0 }}>
      {/* Empty sidebar variant */}
      <aside style={{
        width: 268,
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 14px 12px' }}>
          <span className="hf-logo" style={{ width: 22, height: 22 }}>C</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--fg-primary)' }}>COOPR</span>
        </div>
        <div style={{ padding: '0 10px 10px' }}>
          <button style={{ width: '100%', height: 34, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 9, background: 'var(--accent-primary)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, color: 'var(--fg-on-accent)', fontFamily: 'inherit', cursor: 'default' }}>
            <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 600 }}>+</span>
            <span>New thread</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.85 }}>⌘N</span>
          </button>
        </div>
        <div style={{ flex: 1, padding: '32px 22px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="hf-byline" style={{ fontSize: 9.5 }}>NO THREADS YET</span>
          <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            Threads will appear here as you start them — grouped by Today, Yesterday, This week, Earlier.
          </p>
        </div>
        <div style={{ padding: '10px 14px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 9 }}>
          <span className="hf-avatar" style={{ width: 26, height: 26 }} />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 600 }}>@henry.dives</span>
            <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)' }}>First day · welcome</span>
          </div>
        </div>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', overflow: 'auto' }}>
          <div style={{ marginBottom: 36, textAlign: 'center' }}>
            <div className="hf-byline" style={{ marginBottom: 18 }}>WELCOME · DAY ONE</div>
            <div className="hf-headline" style={{ fontSize: 56, marginBottom: 14, lineHeight: 1.02 }}>
              <span style={{ fontWeight: 600 }}>COO</span><span style={{ fontStyle: 'italic', fontWeight: 500 }}>P</span><span style={{ fontWeight: 600 }}>R</span>
            </div>
            <div className="hf-deck" style={{ fontSize: 18, maxWidth: 520, margin: '0 auto' }}>
              A creative engine for creators. Start with a draft, an ask, or a thought you don't know what to do with yet.
            </div>
          </div>

          <ChatComposer placeholder="What are you working on?" />

          <div style={{ marginTop: 36, width: 720 }}>
            <div className="hf-byline" style={{ marginBottom: 12, textAlign: 'center' }}>TRY ONE OF THESE TO GET STARTED</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { num: '01', title: 'Connect a channel', body: 'YouTube, Instagram, or TikTok. We\'ll read your last 30 posts to learn your voice.' },
                { num: '02', title: 'Try a hook test',    body: 'Paste a draft. We\'ll show you three openers ranked against your top quartile.' },
                { num: '03', title: 'Ask a question',     body: 'Anything about your audience, your library, your schedule. Voice or text.' },
              ].map(c => (
                <div key={c.num} style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 14, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 130 }}>
                  <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.08em', fontWeight: 500 }}>{c.num}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{c.title}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{c.body}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      </div>
    </HfShell>
  );
}

// ─── 3. ACTIVE THREAD ─────────────────────────────────────
function HF_ChatActive({ polish = true } = {}) {
  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0 }}>
      <ChatSidebar activeIdx={0} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', maxWidth: 880, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            <div>
              <div className="hf-byline" style={{ marginBottom: 4 }}>THREAD · 12 MIN AGO · 4 TURNS</div>
              <div className="hf-headline" style={{ fontSize: 24 }}>
                Why dive-safety retention dropped at minute three
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="hf-tag hf-tag-accent">2 charts saved</span>
              <span className="hf-tag">1 draft</span>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', padding: '0 32px 24px', maxWidth: 880, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            <Turn role="HENRY" body="Why did retention drop on the last six safety primers? Open the data and tell me where they leave." />
            <Turn role="COOPR" body={
              <>
                <ReasoningTrail active={polish} steps={['retention read', 'benchmark compare', 'tool result ready']} />
                <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.55, color: 'var(--fg-primary)' }}>
                  <StreamingLine active={polish} text="The drop happens at 0:03 and again at 0:14. The first cuts 14% vs your benchmark. The second is normal mid-attention." />
                </p>
                <ToolRunMorph active={polish}>
                  <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 8 }}>
                    <div className="hf-byline" style={{ marginBottom: 6 }}>FIG · RETENTION CURVE · LAST 6 SAFETY POSTS</div>
                    <svg width="780" height="120" style={{ display: 'block', maxWidth: '100%' }}>
                      {[0, 25, 50, 75, 100].map(t => <line key={t} x1="40" x2="770" y1={20 + (1 - t/100) * 80} y2={20 + (1 - t/100) * 80} stroke="var(--border-subtle)" />)}
                      <path d="M 40,30 L 100,42 L 160,75 L 220,68 L 280,72 L 340,76 L 400,80 L 460,82 L 520,84 L 580,86 L 640,88 L 700,90 L 770,92" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.25" strokeDasharray="3 3" />
                      <path d="M 40,32 L 100,52 L 160,90 L 220,86 L 280,90 L 340,93 L 400,96 L 460,98 L 520,100 L 580,102 L 640,104 L 700,105 L 770,106" fill="none" stroke="var(--accent-primary)" strokeWidth="2.25" />
                      <line x1="160" y1="20" x2="160" y2="100" stroke="var(--tone-danger)" strokeDasharray="2 2" opacity="0.6" />
                      <circle cx="160" cy="90" r="3.5" fill="var(--surface-1)" stroke="var(--tone-danger)" strokeWidth="1.5" />
                      <text x="170" y="86" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--tone-danger)">−14% · 0:03</text>
                    </svg>
                  </div>
                </ToolRunMorph>
                <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.55, color: 'var(--fg-primary)' }}>Hooks above 1.8s correlate. Your last six averaged <span className="hf-num" style={{ fontWeight: 600 }}>1.96s</span>. The two posts that held attention (0042, 0039) opened in <span className="hf-num" style={{ fontWeight: 600 }}>under 1.2s</span>.</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <span className="hf-tag" style={{ borderColor: 'var(--border-default)' }}>＋ Save chart</span>
                  <span className="hf-tag" style={{ borderColor: 'var(--border-default)' }}>↗ Open in Audience</span>
                  <span className="hf-tag" style={{ borderColor: 'var(--border-default)' }}>✎ Draft a fix</span>
                </div>
              </>
            } />
            <Turn role="HENRY" body="Draft three replacement hooks for the next safety post — under 1.2s, my voice." />
          </div>

          <div style={{ padding: '12px 32px 18px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-1)', maxWidth: 880, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            <ChatComposer placeholder="Reply…" docked />
          </div>
        </main>
      </div>
      </div>
    </HfShell>
  );
}

function Turn({ role, body }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 18, padding: '18px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span className="hf-byline" style={{ paddingTop: 4 }}>{role}</span>
      <div>{typeof body === 'string' ? <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--fg-primary)' }}>{body}</p> : body}</div>
    </div>
  );
}

Object.assign(window, {
  HF_ChatDefault,
  HF_ChatEmpty,
  HF_ChatActive,
  StreamingLine,
  ReasoningTrail,
  ToolRunMorph,
});
