/* global React, window */
/* hifi-studio-r5-panel.jsx — R5 Coopr panel (chat / history / activity).

   Right-side single panel that replaces R3's three competing zones:
     - R_DocVersionPanel     → 'history' tab
     - R_SideChat            → 'chat' tab
     - R_DocAgentLog         → 'activity' tab

   Collapsed default: 48px ambient rail with presence dot + activity count.
   Expanded: 340px with tab strip + content. Owns no doc content; receives
   collapse + focus state from the shell.
*/

const R5P = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function R5P_ML({ children, s = 9.5, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R5P.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...st }}>{children}</span>;
}
function R5P_MM({ children, s = 11, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R5P.mono, fontSize: s, color: c, ...st }}>{children}</span>;
}

const R5P_TABS = [
  { id: 'chat',     label: 'Chat',     count: null },
  { id: 'history',  label: 'History',  count: 8 },
  { id: 'activity', label: 'Activity', count: 5 },
];

function R5P_TabIcon({ id }) {
  const C = 'currentColor';
  if (id === 'chat')     return <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 4 a2 2 0 0 1 2-2 h6 a2 2 0 0 1 2 2 v4 a2 2 0 0 1-2 2 H6 l-3 2 v-2 a2 2 0 0 1-1-2 z" fill="none" stroke={C} strokeWidth="1.2" /></svg>;
  if (id === 'history')  return <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke={C} strokeWidth="1.2" /><path d="M7 4 V7 L9.5 8.5" stroke={C} strokeWidth="1.2" fill="none" strokeLinecap="round" /></svg>;
  return <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7 L6 10 L11 4" stroke={C} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

// ─── Tab content ───────────────────────────────────────────

const R5P_FAKE_REPLIES = [
  "On it. I'll draft a take that respects the rhythm of the dive — give me 30s.",
  "Marked. I'll thread that through §02 so the beat lands twice — once at hook, once at outro.",
  "Saw the same problem. I'll pull two alternates from the transcript and queue them as a /alternates chip.",
  "Got it. Logging this against your gear-pillar memory so the next doc inherits the choice.",
  "Sketched. Look at §04 — I left a one-line summary you can promote to caption with /extract.",
  "Holding. If you want me to push it forward, hit the +ship checklist suggestion.",
];

function R5P_ChatTab() {
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  const initialMessages = [
    { from: 'coopr', time: '7:12 am', text: "Doc has 4 sections active. Caption and notes haven't been started — want me to draft a caption matched to your Tue 6:30 PM IG slot?", actions: ['draft caption', 'not yet'] },
    { from: 'you',   text: 'tighten beat 2' },
    { from: 'coopr', time: '7:14 am', text: "Done — dropped a tightened version inline (-7 words). Keep or revert from the diff chip in §02. I also pulled 2 more shots from your transcript that fit the rhythm — they're queued in §03 for batch accept.", actions: ['see all changes', 'undo all'] },
    { from: 'you',   text: 'good. and the gear link description in prep' },
    { from: 'coopr', time: '7:18 am', text: "Marked it — I'll draft from your gear pillar memory and your last 4 YT descriptions. Will post the draft inline; you'll see it appear in §04.", actions: ['ok', 'wait'] },
  ];
  const [messages, setMessages] = React.useState(initialMessages);
  const [composer, setComposer] = React.useState('');
  const [isThinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  const replyIxRef = React.useRef(0);
  const suggestions = ['/draft caption', '/extract pull-quote', '+ ship checklist'];

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  function send() {
    const text = composer.trim();
    if (!text) return;
    setMessages(ms => [...ms, { from: 'you', text }]);
    setComposer('');
    setThinking(true);
    const reply = R5P_FAKE_REPLIES[replyIxRef.current % R5P_FAKE_REPLIES.length];
    replyIxRef.current += 1;
    const now = new Date();
    const time = now.getHours() % 12 + ':' + String(now.getMinutes()).padStart(2, '0') + (now.getHours() >= 12 ? ' pm' : ' am');
    setTimeout(() => {
      setMessages(ms => [...ms, { from: 'coopr', time, text: reply, actions: ['keep going', 'pause'] }]);
      setThinking(false);
    }, 700);
  }

  function clickSuggestion(s) {
    setComposer(s + ' ');
    pushToast('Suggestion · ' + s);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {m.time && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: R5P.sans, fontSize: 11.5, fontWeight: 700, color: m.from === 'coopr' ? 'var(--accent-primary-press)' : 'var(--fg-primary)' }}>
                  {m.from === 'coopr' ? 'Coopr' : 'You'}
                </span>
                <R5P_MM s={9}>· {m.time}</R5P_MM>
              </div>
            )}
            <p style={{
              margin: 0,
              fontFamily: R5P.sans, fontSize: 12.5, lineHeight: 1.55,
              color: m.from === 'you' ? 'var(--fg-secondary)' : 'var(--fg-primary)',
              fontStyle: m.from === 'you' && !m.time ? 'italic' : 'normal',
            }}>{m.text}</p>
            {m.actions && m.actions.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {m.actions.map((a, j) => (
                  <span
                    key={j}
                    onClick={() => pushToast('Chat action · ' + a)}
                    style={{
                      padding: '3px 9px',
                      background: 'var(--surface-2)',
                      borderRadius: 4,
                      fontFamily: R5P.mono, fontSize: 9.5, fontWeight: 600,
                      color: 'var(--fg-secondary)',
                      letterSpacing: '0.06em', textTransform: 'lowercase',
                      cursor: 'pointer',
                    }}
                  >{a}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: R5P.sans, fontSize: 11.5, fontWeight: 700, color: 'var(--accent-primary-press)' }}>Coopr</span>
            <span style={{ fontFamily: R5P.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-tertiary)' }}>thinking…</span>
          </div>
        )}
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {suggestions.map((s, i) => (
            <span
              key={i}
              onClick={() => clickSuggestion(s)}
              style={{
                padding: '3px 9px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: 999,
                fontFamily: R5P.mono, fontSize: 10, color: 'var(--fg-secondary)',
                cursor: 'pointer',
              }}
            >{s}</span>
          ))}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-default)',
          borderRadius: 6,
        }}>
          <input
            type="text"
            value={composer}
            placeholder="Ask about this doc, or /opener, /script…"
            onChange={(e) => setComposer(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            style={{
              flex: 1, minWidth: 0,
              padding: 0, border: 'none', outline: 'none',
              background: 'transparent',
              fontFamily: R5P.sans, fontSize: 12, color: 'var(--fg-primary)',
            }}
          />
          <span
            onClick={send}
            style={{
              padding: '2px 8px',
              background: composer.trim() ? 'var(--accent-primary)' : 'var(--surface-2)',
              color: composer.trim() ? 'var(--fg-on-accent)' : 'var(--fg-tertiary)',
              borderRadius: 999,
              fontFamily: R5P.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: composer.trim() ? 'pointer' : 'default',
            }}
          >Send ↵</span>
        </div>
      </div>
    </div>
  );
}

function R5P_HistoryTab() {
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  const VERSIONS = [
    { id: 'v8', when: 'just now',  author: 'Coopr', change: 'Tightened beat 2 — kept rhythm of eight breaths.', delta: -7,   current: true },
    { id: 'v7', when: '14m ago',   author: 'Coopr', change: 'Pulled two shots from transcript into §03.',       delta: 38,   current: false },
    { id: 'v6', when: '2h ago',    author: 'You',   change: 'Rewrote opening — ditched the 2014 framing.',      delta: 142,  current: false },
    { id: 'v5', when: '4h ago',    author: 'Coopr', change: 'Drafted prep checklist from your gear pillar.',    delta: 84,   current: false },
    { id: 'v4', when: 'yesterday', author: 'You',   change: 'Outline + first three section headings.',          delta: 218,  current: false },
    { id: 'v3', when: 'apr 22',    author: 'You',   change: 'Imported transcript from Truk dive footage.',      delta: 1242, current: false },
    { id: 'v2', when: 'apr 21',    author: 'You',   change: 'Title locked — Fujikawa in eight breaths.',        delta: 6,    current: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <R5P_ML s={9}>Versions</R5P_ML>
        <R5P_MM s={9.5}>· {VERSIONS.length} saved</R5P_MM>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 16px 12px' }}>
        {VERSIONS.map((v) => (
          <div
            key={v.id}
            onClick={() => pushToast('Open version compare · ' + v.id)}
            style={{
              padding: '10px 0',
              borderBottom: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <R5P_MM s={10} c={v.current ? 'var(--fg-primary)' : 'var(--fg-secondary)'} st={{ fontWeight: 700, letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums' }}>{v.id}</R5P_MM>
              {v.current && (
                <span style={{ padding: '1px 6px', background: 'var(--accent-soft)', color: 'var(--accent-primary-press)', borderRadius: 999, fontFamily: R5P.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>just now</span>
              )}
              {!v.current && <R5P_MM s={9}>{v.when}</R5P_MM>}
              <span style={{ flex: 1 }} />
              <R5P_MM s={9} c={v.delta < 0 ? 'var(--tone-success)' : 'var(--accent-primary-press)'} st={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {v.delta < 0 ? '' : '+'}{v.delta}w
              </R5P_MM>
            </div>
            <div style={{ marginTop: 4, fontFamily: R5P.sans, fontSize: 11.5, color: 'var(--fg-secondary)' }}>{v.author}</div>
            <p style={{ margin: '4px 0 0', fontFamily: R5P.serif, fontSize: 12.5, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.45 }}>{v.change}</p>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '10px 12px', display: 'flex', gap: 8 }}>
        <span
          onClick={() => pushToast('Restore version · v8')}
          style={{ padding: '5px 12px', background: 'var(--fg-primary)', color: 'var(--surface-1)', borderRadius: 999, fontFamily: R5P.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
        >Restore</span>
        <span
          onClick={() => pushToast('Compare versions · side-by-side')}
          style={{ padding: '5px 12px', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)', borderRadius: 999, fontFamily: R5P.mono, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
        >Compare</span>
      </div>
    </div>
  );
}

function R5P_ActivityTab() {
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  const ITEMS = [
    { body: 'Suggested 3 hook variants',         when: '12s ago' },
    { body: 'Flagged 2 weak transitions in §02', when: '1m ago' },
    { body: 'Drafted §05 cold-open caption',     when: '4m ago' },
    { body: 'Pulled 2 shots from transcript',    when: '12m ago' },
    { body: 'Tightened beat 2 by 7 words',       when: '14m ago' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <R5P_ML s={9}>Today</R5P_ML>
        <R5P_MM s={9.5}>· {ITEMS.length} actions</R5P_MM>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 16px 12px' }}>
        {ITEMS.map((it, i) => (
          <div
            key={i}
            onClick={() => pushToast('Open · ' + it.body)}
            style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 10 }}
          >
            <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)', flexShrink: 0, alignSelf: 'center' }} aria-hidden="true"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
            <span style={{ fontFamily: R5P.sans, fontSize: 12.5, color: 'var(--fg-primary)', flex: 1 }}>{it.body}</span>
            <R5P_MM s={9}>{it.when}</R5P_MM>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main panel ────────────────────────────────────────────

function HF_R5CooprPanel({
  collapsed = true,
  onToggleCollapsed = () => {},
  focusMode = false,
  onToggleFocus = () => {},
}) {
  const [activeTab, setActiveTab] = React.useState('chat');

  if (focusMode) {
    return (
      <div style={{
        width: 0, flexShrink: 0,
        transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }} />
    );
  }

  if (collapsed) {
    return (
      <div style={{
        width: 48, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface-1)',
        borderLeft: '1px solid var(--border-subtle)',
        transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div
          onClick={onToggleCollapsed}
          style={{
            padding: '14px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            cursor: 'pointer',
          }}
          title="Open Coopr panel"
        >
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent-primary)',
            animation: 'hf-doc-state-pulse 2.4s ease-in-out infinite',
          }} />
          <R5P_MM s={9} c="var(--accent-primary-press)" st={{ fontWeight: 700, letterSpacing: '0.10em' }}>5</R5P_MM>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 6 }}>
          {R5P_TABS.map((t) => (
            <span
              key={t.id}
              onClick={() => { setActiveTab(t.id); onToggleCollapsed(); }}
              style={{
                width: 32, height: 32,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg-tertiary)',
                borderRadius: 4,
                cursor: 'pointer',
              }}
              title={t.label}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-tertiary)'; }}
            >
              <R5P_TabIcon id={t.id} />
            </span>
          ))}
        </div>
        <div
          onClick={onToggleFocus}
          style={{
            padding: '12px 0', display: 'flex', justifyContent: 'center',
            borderTop: '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
          title="Focus mode"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" style={{ color: 'var(--fg-tertiary)' }} aria-hidden="true">
            <path d="M2 4 V2 H4 M10 2 H12 V4 M12 10 V12 H10 M4 12 H2 V10" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: 340, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--surface-1)',
      borderLeft: '1px solid var(--border-subtle)',
      transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      minHeight: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '10px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        gap: 4,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--accent-primary)',
          animation: 'hf-doc-state-pulse 2.4s ease-in-out infinite',
          marginRight: 8,
        }} />
        <span style={{ fontFamily: R5P.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>Coopr</span>
        <R5P_MM s={9} st={{ marginLeft: 6 }}>· scoped to this doc</R5P_MM>
        <span style={{ flex: 1 }} />
        <span
          onClick={onToggleFocus}
          style={{
            width: 22, height: 22,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--fg-tertiary)',
            borderRadius: 3,
            cursor: 'pointer',
          }}
          title="Focus mode"
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 4 V2 H4 M10 2 H12 V4 M12 10 V12 H10 M4 12 H2 V10" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
        </span>
        <span
          onClick={onToggleCollapsed}
          style={{
            width: 22, height: 22,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--fg-tertiary)',
            borderRadius: 3,
            cursor: 'pointer',
          }}
          title="Collapse"
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2 L8 6 L4 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
        {R5P_TABS.map((t) => {
          const active = activeTab === t.id;
          return (
            <span
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                textAlign: 'center',
                borderBottom: active ? '2px solid var(--fg-primary)' : '2px solid transparent',
                fontFamily: R5P.mono, fontSize: 9.5, fontWeight: 700,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                cursor: 'pointer',
              }}
            >
              {t.label}
              {t.count != null && <span style={{ marginLeft: 6, color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{t.count}</span>}
            </span>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {activeTab === 'chat'     && <R5P_ChatTab />}
        {activeTab === 'history'  && <R5P_HistoryTab />}
        {activeTab === 'activity' && <R5P_ActivityTab />}
      </div>
    </div>
  );
}

Object.assign(window, {
  HF_R5CooprPanel,
});
