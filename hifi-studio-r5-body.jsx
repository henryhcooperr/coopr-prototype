/* global React, window */
/* hifi-studio-r5-body.jsx — R5 doc body + inline AI primitives.

   Wave 7 uplift: real contentEditable surface, real `/` keydown popover with
   typed-filter and arrow-key nav, real Tab-to-accept on the opening suggestion,
   real Keep/Revert on agent edit marks, real Keep both/Drop on agent-added rows.

   Owns the page header, section primitives, and inline AI primitives. Does NOT
   own outline rail, Coopr panel, or layout shell.
*/

const R5B = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function R5B_ML({ children, s = 9.5, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R5B.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...st }}>{children}</span>;
}
function R5B_MM({ children, s = 11, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R5B.mono, fontSize: s, color: c, ...st }}>{children}</span>;
}

// ─── Inline primitives ─────────────────────────────────────

function R5_MentionChip({ name, onOpen = () => {} }) {
  return (
    <span
      onClick={(e) => { e.stopPropagation(); onOpen(name); }}
      contentEditable={false}
      style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 4,
        padding: '1px 7px',
        background: 'var(--accent-soft)',
        borderRadius: 999,
        fontFamily: R5B.sans, fontSize: 13, fontWeight: 500,
        color: 'var(--accent-primary-press)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span style={{ opacity: 0.7 }}>@</span>{name}
    </span>
  );
}

// Status: 'pending' (highlighted with hover keep/revert) | 'kept' | 'reverted'
function R5_AgentEditMark({ status = 'pending', editedText, originalText, when = '2h ago', tag = 'Edited by Coopr', editId = 'edit', onKeep = () => {}, onRevert = () => {} }) {
  const [hover, setHover] = React.useState(false);
  if (status === 'kept') {
    return <span>{editedText}</span>;
  }
  if (status === 'reverted') {
    return <span style={{ background: 'transparent', borderBottom: '1px dotted var(--fg-tertiary)' }} title="reverted">{originalText}</span>;
  }
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      contentEditable={false}
      style={{ position: 'relative', display: 'inline', userSelect: 'none' }}
    >
      <span style={{
        background: 'rgba(182,83,43,0.12)',
        boxShadow: 'inset 0 -1px 0 var(--accent-primary)',
        padding: '0 1px',
      }}>{editedText}</span>
      {hover && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 8px',
          background: 'var(--surface-2)',
          border: '1px solid var(--border-default)',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          zIndex: 4,
        }}>
          <R5B_MM s={9} c="var(--accent-primary-press)" st={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tag}</R5B_MM>
          <R5B_MM s={9}>{when}</R5B_MM>
          <span onClick={(e) => { e.stopPropagation(); onKeep(editId); }} style={{ padding: '2px 8px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Keep</span>
          <span onClick={(e) => { e.stopPropagation(); onRevert(editId); }} style={{ padding: '2px 8px', background: 'transparent', color: 'var(--fg-secondary)', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Revert</span>
        </span>
      )}
    </span>
  );
}

function R5_AgentRewrite({ before, after, tag = 'Tightened by Coopr', when = '14m ago' }) {
  return (
    <div contentEditable={false} style={{ marginTop: 10, paddingLeft: 14, borderLeft: '2px solid var(--accent-primary)', userSelect: 'none' }}>
      <p style={{ margin: 0, fontFamily: R5B.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-tertiary)', lineHeight: 1.55, textDecoration: 'line-through' }}>{before}</p>
      <p style={{ margin: '6px 0 0', fontFamily: R5B.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55 }}>{after}</p>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <svg width="10" height="10" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }} aria-hidden="true"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
        <R5B_MM s={9.5} c="var(--accent-primary)" st={{ fontWeight: 600 }}>{tag}</R5B_MM>
        <R5B_MM s={9.5}>· {when}</R5B_MM>
        <span style={{ flex: 1 }} />
        <R5B_MM s={9.5}>tab to accept</R5B_MM>
      </div>
    </div>
  );
}

function R5_AgentAddedRow({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 10px',
      background: 'var(--accent-soft)',
      border: '1px dashed var(--accent-primary)',
      borderRadius: 4,
    }}>{children}</div>
  );
}

function R5_DocParaWithSuggestion({ children, paraId = 'para', suggestion = 'Tighten this — 3 ideas', onOpen = () => {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative' }}
      data-suggestion-id={paraId}
    >
      {children}
      <span
        contentEditable={false}
        onClick={(e) => { e.stopPropagation(); onOpen(paraId); }}
        style={{
          position: 'absolute', top: '50%', right: -200,
          transform: 'translateY(-50%)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 999,
          opacity: hover ? 1 : 0,
          transition: 'opacity 120ms ease',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }} aria-hidden="true"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
        <R5B_MM s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>{suggestion}</R5B_MM>
      </span>
    </div>
  );
}

function R5_DocBlockHandle({ onSlash = () => {}, onMenu = () => {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      contentEditable={false}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute', top: 4, left: -40,
        display: 'flex', alignItems: 'center', gap: 4,
        opacity: hover ? 1 : 0,
        transition: 'opacity 120ms ease',
        userSelect: 'none',
      }}
    >
      <span
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); onSlash(e); }}
        style={{
          width: 20, height: 20,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 3,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        title="Insert block"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" style={{ color: 'var(--fg-tertiary)' }} aria-hidden="true">
          <path d="M6 2 L6 10 M2 6 L10 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      <span
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); onMenu(e); }}
        style={{
          width: 14, height: 20,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--fg-tertiary)',
          borderRadius: 3,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-tertiary)'; }}
        title="Block options"
      >
        <svg width="6" height="12" viewBox="0 0 6 12" aria-hidden="true">
          <circle cx="1.5" cy="2"  r="1" fill="currentColor" />
          <circle cx="4.5" cy="2"  r="1" fill="currentColor" />
          <circle cx="1.5" cy="6"  r="1" fill="currentColor" />
          <circle cx="4.5" cy="6"  r="1" fill="currentColor" />
          <circle cx="1.5" cy="10" r="1" fill="currentColor" />
          <circle cx="4.5" cy="10" r="1" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}

function R5_SelectionThread({ author = 'M', name = 'Mara', body = '', when = '1h ago', threadId = 'thread', anchorTop = 0, onReply = () => {} }) {
  return (
    <div contentEditable={false} style={{
      position: 'absolute', top: anchorTop, right: -260,
      width: 240,
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 6,
      padding: '10px 12px',
      boxShadow: '0 2px 8px rgba(38,21,12,0.06)',
      userSelect: 'none',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: -16,
        width: 16, height: 1,
        background: 'var(--accent-primary)',
        opacity: 0.4,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 22, height: 22,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--accent-soft)',
          color: 'var(--accent-primary-press)',
          borderRadius: '50%',
          fontFamily: R5B.serif, fontSize: 12, fontWeight: 600,
        }}>{author}</span>
        <span style={{ fontFamily: R5B.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{name}</span>
        <R5B_MM s={9}>{when}</R5B_MM>
      </div>
      <p style={{ margin: '8px 0 0', fontFamily: R5B.serif, fontSize: 13, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.5 }}>{body}</p>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <span
          onClick={(e) => { e.stopPropagation(); onReply(threadId); }}
          style={{ fontFamily: R5B.mono, fontSize: 9, fontWeight: 600, color: 'var(--fg-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
        >Reply</span>
      </div>
    </div>
  );
}

// ─── Quick-switcher (⌘O) ──────────────────────────────────

function R5_DocQuickSwitcher({ open = false, docs = [], onOpenDoc = () => {}, onClose = () => {} }) {
  const [filter, setFilter] = React.useState('');
  const [selected, setSelected] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open && inputRef.current) {
      try { inputRef.current.focus(); } catch (e) { /* ignore */ }
      setFilter('');
      setSelected(0);
    }
  }, [open]);

  if (!open) return null;
  const f = filter.toLowerCase();
  const filtered = f
    ? docs.filter(d => d.title.toLowerCase().includes(f) || d.eyebrow.toLowerCase().includes(f) || (d.italicTail || '').toLowerCase().includes(f))
    : docs;

  function pick(d) {
    onOpenDoc(d.id);
    onClose();
  }

  return (
    <div
      contentEditable={false}
      onClick={onClose}
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(38,21,12,0.42)',
        zIndex: 40,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 110,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(540px, 92%)',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          boxShadow: '0 24px 60px rgba(38,21,12,0.30)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '70vh',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <R5B_ML s={9.5}>Quick open</R5B_ML>
          <span style={{ flex: 1 }} />
          <R5B_MM s={9}>{filtered.length} of {docs.length} docs</R5B_MM>
        </div>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <input
            ref={inputRef}
            type="text"
            value={filter}
            placeholder="Type to filter…"
            onChange={(e) => { setFilter(e.target.value); setSelected(0); }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Escape') { onClose(); }
              else if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(i => Math.min(i + 1, Math.max(filtered.length - 1, 0))); }
              else if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)); }
              else if (e.key === 'Enter')     { e.preventDefault(); if (filtered[selected]) pick(filtered[selected]); }
            }}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 4,
              outline: 'none',
              background: 'transparent',
              fontFamily: R5B.serif, fontSize: 18, color: 'var(--fg-primary)',
              fontStyle: 'italic',
            }}
          />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <R5B_MM s={11} st={{ fontStyle: 'italic' }}>No docs match "{filter}".</R5B_MM>
            </div>
          )}
          {filtered.map((d, i) => {
            const active = i === selected;
            return (
              <div
                key={d.id}
                onClick={() => pick(d)}
                onMouseEnter={() => setSelected(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 12px',
                  borderRadius: 5,
                  cursor: 'pointer',
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  border: active ? '1px solid var(--accent-primary)' : '1px solid transparent',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <R5B_ML s={9} st={{ display: 'block', marginBottom: 4 }}>{d.eyebrow}</R5B_ML>
                  <div style={{ fontFamily: R5B.serif, fontSize: 18, color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.15 }}>
                    <span>{d.title} </span>
                    <span style={{ fontStyle: 'italic' }}>{d.italicTail}</span>
                  </div>
                </div>
                {d.statusVersion && (
                  <R5B_MM s={9} c="var(--fg-tertiary)" st={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.status} · {d.statusVersion}</R5B_MM>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <R5B_MM s={9}>↑↓ nav</R5B_MM>
          <R5B_MM s={9}>↵ open</R5B_MM>
          <R5B_MM s={9}>esc close</R5B_MM>
          <span style={{ flex: 1 }} />
          <R5B_MM s={9} st={{ fontStyle: 'italic' }}>⌘O anywhere · also click home crumb</R5B_MM>
        </div>
      </div>
    </div>
  );
}

// ─── Persistent format strip ──────────────────────────────

function R5_FormatStrip({ onCmd = () => {}, onInsert = () => {} }) {
  const [headingOpen, setHeadingOpen] = React.useState(false);
  const HEADINGS = [
    { label: 'Plain text',   cmd: 'formatBlock', val: '<p>',  hint: '⌘⌥0' },
    { label: 'Heading 1',    cmd: 'formatBlock', val: '<h2>', hint: '⌘⌥1' },
    { label: 'Heading 2',    cmd: 'formatBlock', val: '<h3>', hint: '⌘⌥2' },
    { label: 'Heading 3',    cmd: 'formatBlock', val: '<h4>', hint: '⌘⌥3' },
    { label: 'Quote',        cmd: 'formatBlock', val: '<blockquote>', hint: '⌘⇧.' },
  ];
  const Btn = ({ label, cmd, val = null, title }) => (
    <span
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => { e.stopPropagation(); onCmd(cmd, val); }}
      title={title}
      style={{
        padding: '4px 8px',
        fontFamily: R5B.serif, fontSize: 13, fontWeight: 500,
        color: 'var(--fg-secondary)',
        cursor: 'pointer',
        borderRadius: 3,
        userSelect: 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-secondary)'; }}
    >{label}</span>
  );
  const Sep = () => <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)', margin: '4px 4px' }} />;
  return (
    <div
      contentEditable={false}
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 2,
        margin: '4px 0 28px',
        padding: 4,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 5,
        userSelect: 'none',
        flexWrap: 'wrap',
      }}
    >
      <span
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); setHeadingOpen(o => !o); }}
        style={{
          padding: '4px 10px',
          fontFamily: R5B.mono, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--fg-secondary)',
          cursor: 'pointer',
          borderRadius: 3,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-secondary)'; }}
      >
        Style
        <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 5 L6 8 L9 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
      </span>
      {headingOpen && (
        <div
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'absolute', top: '100%', left: 0,
            marginTop: 4,
            minWidth: 200,
            background: 'var(--surface-1)',
            border: '1px solid var(--border-default)',
            borderRadius: 5,
            boxShadow: '0 8px 22px rgba(38,21,12,0.14)',
            padding: 4,
            zIndex: 6,
          }}
        >
          {HEADINGS.map((h, i) => (
            <div
              key={i}
              onClick={(e) => { e.stopPropagation(); onCmd(h.cmd, h.val); setHeadingOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '7px 10px',
                cursor: 'pointer',
                borderRadius: 3,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ flex: 1, fontFamily: R5B.serif, fontSize: 14, color: 'var(--fg-primary)', fontStyle: h.label === 'Quote' ? 'italic' : 'normal' }}>{h.label}</span>
              <R5B_MM s={9}>{h.hint}</R5B_MM>
            </div>
          ))}
        </div>
      )}
      <Sep />
      <Btn label={<b>B</b>} cmd="bold"          title="Bold · ⌘B" />
      <Btn label={<i>I</i>} cmd="italic"        title="Italic · ⌘I" />
      <Btn label={<u>U</u>} cmd="underline"     title="Underline · ⌘U" />
      <Btn label={<s>S</s>} cmd="strikeThrough" title="Strikethrough · ⌘⇧S" />
      <Sep />
      <span
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); onCmd('insertUnorderedList'); }}
        title="Bullet list · ⌘⇧8"
        style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', borderRadius: 3, color: 'var(--fg-secondary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-secondary)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="2.5" cy="4" r="1" fill="currentColor" /><circle cx="2.5" cy="10" r="1" fill="currentColor" /><path d="M5.5 4 H12 M5.5 10 H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
      </span>
      <span
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); onCmd('insertOrderedList'); }}
        title="Numbered list · ⌘⇧7"
        style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', borderRadius: 3, color: 'var(--fg-secondary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--fg-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-secondary)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><text x="0" y="6" style={{ fontFamily: 'monospace', fontSize: 4.5 }} fill="currentColor">1.</text><text x="0" y="12" style={{ fontFamily: 'monospace', fontSize: 4.5 }} fill="currentColor">2.</text><path d="M5.5 4 H12 M5.5 10 H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
      </span>
      <Sep />
      <span
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); onInsert(e.currentTarget); }}
        title="Insert block · /"
        style={{
          padding: '4px 10px',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: R5B.mono, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--accent-primary-press)',
          cursor: 'pointer',
          borderRadius: 3,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2 V10 M2 6 H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        Insert
      </span>
    </div>
  );
}

// ─── Block context menu (right-click / ⋮⋮ click) ──────────

function R5_BlockContextMenu({ open = false, x = 0, y = 0, onAction = () => {}, onClose = () => {} }) {
  if (!open) return null;
  const items = [
    { id: 'h1',     label: 'Turn into Heading 1' },
    { id: 'h2',     label: 'Turn into Heading 2' },
    { id: 'h3',     label: 'Turn into Heading 3' },
    { id: 'quote',  label: 'Turn into Quote' },
    { id: 'ul',     label: 'Turn into Bullet list' },
    { id: 'ol',     label: 'Turn into Numbered list' },
    { id: 'plain',  label: 'Turn into Plain text' },
    { id: 'sep' },
    { id: 'comment',  label: 'Add comment' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'delete',    label: 'Delete' },
  ];
  return (
    <div
      contentEditable={false}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed', left: x, top: y,
        minWidth: 220,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 5,
        boxShadow: '0 8px 24px rgba(38,21,12,0.18)',
        padding: 4,
        zIndex: 9,
        userSelect: 'none',
      }}
    >
      {items.map((it, i) => it.id === 'sep'
        ? <div key={i} style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
        : (
          <div
            key={it.id}
            onClick={() => { onAction(it.id); onClose(); }}
            style={{
              padding: '6px 10px',
              fontFamily: R5B.sans, fontSize: 13,
              color: it.id === 'delete' ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
              cursor: 'pointer',
              borderRadius: 3,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >{it.label}</div>
        )
      )}
    </div>
  );
}

// ─── Version diff overlay ─────────────────────────────────

const R5B_DIFF_CONTENT = {
  'v3': {
    label: 'v3 · current',
    by: 'Coopr',
    when: 'just now',
    changes: [
      { section: '§01 Opening', from: 'Eighty-one years ago this hold held bombs. Today it holds the soft coral and a turtle that doesn\'t know any of that.', to: 'Eighty-one years ago this hold held bombs. Today it holds soft coral and a turtle that doesn\'t know any of that.', delta: '−3 words' },
      { section: '§02 Beat 2', from: 'There\'s a thing wreck divers do that I never explain on camera, and it\'s the reason I\'m still diving wrecks at 38.', to: 'There\'s something wreck divers do that I\'ve never said out loud — it\'s why I\'m still doing this at 38.', delta: '−7 words' },
      { section: '§03 Shot list', from: '4 shots · 4 keepers', to: '6 shots · 4 keepers · 2 added by Coopr (turtle drift, backlit exit)', delta: '+2 shots' },
    ],
  },
  'v2': {
    label: 'v2 · 2h ago',
    by: 'You',
    when: '2h ago',
    changes: [
      { section: '§01 Opening', from: 'It was 2014 the last time I dove the Fujikawa.', to: 'I dropped onto the deck of the Fujikawa Maru at 95 feet, and counted my breaths to eight before I moved.', delta: '+18 words · rewrite' },
      { section: '§02 Outline', from: '3 beats sketched', to: '5 beats with timecodes', delta: '+2 beats' },
    ],
  },
  'v1': {
    label: 'v1 · yesterday',
    by: 'You',
    when: 'yesterday',
    changes: [
      { section: '§00 Title', from: '(untitled)', to: 'The Fujikawa in eight breaths.', delta: 'title locked' },
      { section: '§01 Opening', from: '(empty)', to: 'It was 2014 the last time I dove the Fujikawa.', delta: '+11 words' },
    ],
  },
};

function R5_DiffOverlay({ open = false, fromId = null, toId = 'v3', onClose = () => {}, onRestore = () => {} }) {
  if (!open || !fromId) return null;
  const from = R5B_DIFF_CONTENT[fromId] || R5B_DIFF_CONTENT.v2;
  const to = R5B_DIFF_CONTENT[toId] || R5B_DIFF_CONTENT.v3;
  return (
    <div
      contentEditable={false}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(38,21,12,0.42)',
        zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(880px, 100%)', maxHeight: '90vh',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-default)',
          borderRadius: 6,
          boxShadow: '0 20px 60px rgba(38,21,12,0.28)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <header style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <R5B_ML s={9.5}>Diff</R5B_ML>
          <span style={{ fontFamily: R5B.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-secondary)' }}>{from.label}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" style={{ color: 'var(--fg-tertiary)' }} aria-hidden="true"><path d="M3 7 H11 M8 4 L11 7 L8 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
          <span style={{ fontFamily: R5B.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-primary)' }}>{to.label}</span>
          <span style={{ flex: 1 }} />
          <span
            onClick={onClose}
            style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--fg-tertiary)', borderRadius: 3 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.4" /></svg>
          </span>
        </header>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '20px 22px' }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: R5B.sans, fontSize: 13, color: 'var(--fg-secondary)' }}>by {from.by}</span>
            <R5B_MM s={9}>· {from.when}</R5B_MM>
            <span style={{ flex: 1 }} />
            <R5B_MM s={9.5}>{from.changes.length} change{from.changes.length === 1 ? '' : 's'}</R5B_MM>
          </div>
          {from.changes.map((c, i) => (
            <div key={i} style={{ marginBottom: 22, paddingBottom: 18, borderBottom: i < from.changes.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: R5B.serif, fontSize: 15, color: 'var(--fg-primary)' }}>{c.section}</span>
                <span style={{ flex: 1 }} />
                <R5B_MM s={9} c={c.delta.startsWith('−') ? 'var(--tone-success)' : 'var(--accent-primary-press)'} st={{ fontWeight: 600 }}>{c.delta}</R5B_MM>
              </div>
              <p style={{ margin: 0, padding: '6px 10px', background: 'rgba(220,80,40,0.08)', borderLeft: '2px solid rgba(220,80,40,0.45)', fontFamily: R5B.serif, fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.55, textDecoration: 'line-through' }}>{c.from}</p>
              <p style={{ margin: '4px 0 0', padding: '6px 10px', background: 'rgba(80,140,80,0.08)', borderLeft: '2px solid rgba(80,140,80,0.45)', fontFamily: R5B.serif, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.55 }}>{c.to}</p>
            </div>
          ))}
        </div>
        <footer style={{ padding: '12px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10 }}>
          <span
            onClick={() => { onRestore(fromId); onClose(); }}
            style={{ padding: '6px 14px', background: 'var(--fg-primary)', color: 'var(--surface-1)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          >Restore {from.label.split(' ')[0]}</span>
          <span
            onClick={onClose}
            style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          >Keep {to.label.split(' ')[0]}</span>
        </footer>
      </div>
    </div>
  );
}

// ─── Selection-anchored format toolbar ────────────────────

function R5_FormatToolbar({ visible = false, x = 0, y = 0, onCmd = () => {}, onLink = () => {}, onComment = () => {} }) {
  if (!visible) return null;
  const Btn = ({ label, cmd, val = null, title }) => (
    <span
      onMouseDown={(e) => { e.preventDefault(); }}
      onClick={(e) => { e.stopPropagation(); onCmd(cmd, val); }}
      title={title}
      style={{
        padding: '6px 9px',
        fontFamily: R5B.serif, fontSize: 14, fontWeight: 500,
        color: 'var(--surface-1)',
        cursor: 'pointer',
        userSelect: 'none',
        borderRight: '1px solid rgba(255,255,255,0.12)',
      }}
    >{label}</span>
  );
  const Sep = () => <span style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.12)' }} />;
  return (
    <div
      contentEditable={false}
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        left: x, top: y,
        transform: 'translate(-50%, -100%)',
        display: 'inline-flex', alignItems: 'stretch',
        background: 'var(--fg-primary)',
        borderRadius: 4,
        boxShadow: '0 6px 16px rgba(38,21,12,0.22)',
        zIndex: 7,
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <Btn label={<b>B</b>}            cmd="bold"          title="Bold · ⌘B" />
      <Btn label={<i>I</i>}            cmd="italic"        title="Italic · ⌘I" />
      <Btn label={<u>U</u>}            cmd="underline"     title="Underline · ⌘U" />
      <Btn label={<s>S</s>}            cmd="strikeThrough" title="Strikethrough · ⌘⇧S" />
      <Sep />
      <Btn label="H1"  cmd="formatBlock" val="<h2>"        title="Heading · ⌘⌥1" />
      <Btn label="H2"  cmd="formatBlock" val="<h3>"        title="Sub-heading · ⌘⌥2" />
      <Btn label={<span style={{ fontStyle: 'italic' }}>"</span>} cmd="formatBlock" val="<blockquote>" title="Quote" />
      <Sep />
      <span
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); onLink(); }}
        title="Link · ⌘K"
        style={{
          padding: '6px 9px',
          display: 'inline-flex', alignItems: 'center',
          color: 'var(--surface-1)',
          cursor: 'pointer',
          borderRight: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M5 9 L9 5 M4.5 7.5 L3 9 a2 2 0 0 1-2.8-2.8 L3 4 M9.5 6.5 L11 5 a2 2 0 0 1 2.8 2.8 L11 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); onComment(); }}
        title="Comment"
        style={{
          padding: '6px 10px',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          color: 'var(--surface-1)',
          cursor: 'pointer',
          fontFamily: R5B.mono, fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 3 a1 1 0 0 1 1-1 h6 a1 1 0 0 1 1 1 v4 a1 1 0 0 1-1 1 H6 l-2 2 v-2 a1 1 0 0 1-1-1 z" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
        Note
      </span>
    </div>
  );
}

// ─── Slash popover with filter + keyboard nav ──────────────

const R5B_ICON_GLYPHS = {
  h1:       { glyph: 'H1',   font: 'serif', size: 13 },
  h2:       { glyph: 'H2',   font: 'serif', size: 12 },
  h3:       { glyph: 'H3',   font: 'serif', size: 11 },
  p:        { glyph: '¶',    font: 'serif', size: 14 },
  quote:    { glyph: '"',    font: 'serif', size: 18, italic: true },
  hr:       { glyph: '—',    font: 'mono',  size: 13 },
  ul:       { glyph: '•',    font: 'mono',  size: 14 },
  ol:       { glyph: '1.',   font: 'mono',  size: 11 },
  check:    { glyph: '☐',    font: 'mono',  size: 13 },
  star:     { glyph: '✦',    font: 'serif', size: 12 },
  at:       { glyph: '@',    font: 'mono',  size: 13 },
  code:     { glyph: '<>',   font: 'mono',  size: 11 },
  callout:  { glyph: '◐',    font: 'serif', size: 13 },
  photo:    { glyph: '◫',    font: 'mono',  size: 13 },
  video:    { glyph: '▶',    font: 'mono',  size: 11 },
  gif:      { glyph: 'GIF',  font: 'mono',  size: 8 },
  embed:    { glyph: '⤴',    font: 'mono',  size: 13 },
  carousel: { glyph: '◧◨',   font: 'mono',  size: 9 },
  thread:   { glyph: '☰',    font: 'mono',  size: 13 },
  hook:     { glyph: '↯',    font: 'mono',  size: 13 },
};

// Pre-built embed HTML — inserted at caret via execCommand('insertHTML') when
// user picks a Media or Social verb. Each embed is contentEditable=false and
// has data-r5-embed-* hooks for click delegation.
function R5B_PHOTO_HTML(id) {
  return (
    '<div class="r5-embed r5-embed-photo" data-r5-embed-id="' + id + '" data-r5-embed-type="photo" contenteditable="false" style="display:block;margin:18px 0;padding:0;border:1px solid var(--border-subtle);border-radius:6px;overflow:hidden;background:var(--surface-2);user-select:none;">' +
      '<div data-r5-photo-canvas="1" style="aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f0eadd,#e8dcc7);border-bottom:1px solid var(--border-subtle);position:relative;background-size:cover;background-position:center;">' +
        '<svg width="36" height="36" viewBox="0 0 24 24" style="color:var(--fg-tertiary)" aria-hidden="true"><path d="M3 5 a2 2 0 0 1 2-2 h14 a2 2 0 0 1 2 2 v14 a2 2 0 0 1-2 2 H5 a2 2 0 0 1-2-2 z M3 17 L8 12 L13 17 M14 14 L17 11 L21 15 M16 8 a1.5 1.5 0 1 1 3 0 a1.5 1.5 0 1 1 -3 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>' +
      '</div>' +
      '<div style="padding:10px 14px;display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:10px;color:var(--fg-tertiary);text-transform:uppercase;letter-spacing:0.08em;">' +
        '<span style="font-weight:700;color:var(--fg-secondary);">Photo</span>' +
        '<span>· drop or click upload</span>' +
        '<span style="flex:1;"></span>' +
        '<span data-r5-action="aspect-16-9" data-r5-aspect-chip="1" style="padding:3px 8px;background:var(--fg-primary);color:var(--surface-1);border:1px solid var(--fg-primary);border-radius:999px;font-weight:700;cursor:pointer;">16:9</span>' +
        '<span data-r5-action="aspect-1-1" data-r5-aspect-chip="1" style="padding:3px 8px;background:transparent;color:var(--fg-secondary);border:1px solid var(--border-default);border-radius:999px;font-weight:700;cursor:pointer;">1:1</span>' +
        '<span data-r5-action="aspect-4-5" data-r5-aspect-chip="1" style="padding:3px 8px;background:transparent;color:var(--fg-secondary);border:1px solid var(--border-default);border-radius:999px;font-weight:700;cursor:pointer;">4:5</span>' +
        '<span data-r5-action="aspect-9-16" data-r5-aspect-chip="1" style="padding:3px 8px;background:transparent;color:var(--fg-secondary);border:1px solid var(--border-default);border-radius:999px;font-weight:700;cursor:pointer;">9:16</span>' +
        '<span data-r5-action="crop-photo" style="padding:3px 10px;background:transparent;color:var(--fg-secondary);border:1px solid var(--border-default);border-radius:999px;font-weight:700;cursor:pointer;">Crop</span>' +
        '<span data-r5-action="upload-photo" style="padding:3px 10px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-weight:700;cursor:pointer;">Upload</span>' +
      '</div>' +
    '</div>'
  );
}

function R5B_VIDEO_HTML(id) {
  return (
    '<div class="r5-embed r5-embed-video" data-r5-embed-id="' + id + '" data-r5-embed-type="video" contenteditable="false" style="display:block;margin:18px 0;padding:0;border:1px solid var(--border-subtle);border-radius:6px;overflow:hidden;background:var(--surface-2);user-select:none;">' +
      '<div data-r5-video-canvas="1" style="aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;background:#26150c;color:#f0eadd;position:relative;">' +
        '<svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><path d="M10 8 L16 12 L10 16 z" fill="currentColor"/></svg>' +
        '<span data-r5-video-duration="1" style="position:absolute;bottom:10px;left:14px;font-family:var(--font-mono);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;opacity:0.65;">0:00 / —</span>' +
      '</div>' +
      '<div style="padding:10px 14px;display:flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:10px;color:var(--fg-tertiary);text-transform:uppercase;letter-spacing:0.08em;">' +
        '<span data-r5-video-meta="1" style="font-weight:700;color:var(--fg-secondary);">Video</span>' +
        '<span data-r5-video-status="1">· upload .mp4 or paste URL</span>' +
        '<span style="flex:1;"></span>' +
        '<span data-r5-action="upload-video" style="padding:3px 10px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-weight:700;cursor:pointer;">Upload</span>' +
        '<span data-r5-action="paste-url" style="padding:3px 10px;border:1px solid var(--border-default);color:var(--fg-secondary);border-radius:999px;font-weight:600;cursor:pointer;">Paste URL</span>' +
      '</div>' +
    '</div>'
  );
}

function R5B_GIF_HTML(id) {
  return (
    '<div class="r5-embed r5-embed-gif" data-r5-embed-id="' + id + '" data-r5-embed-type="gif" contenteditable="false" style="display:inline-flex;flex-direction:column;margin:14px 0;padding:0;border:1px solid var(--border-subtle);border-radius:6px;overflow:hidden;background:var(--surface-2);user-select:none;width:280px;">' +
      '<div style="aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;background:linear-gradient(45deg,#e8dcc7,#d6c5a8);">' +
        '<span style="font-family:var(--font-mono);font-weight:700;font-size:24px;color:var(--fg-tertiary);letter-spacing:0.04em;">GIF</span>' +
      '</div>' +
      '<div style="padding:8px 12px;display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:9px;color:var(--fg-tertiary);text-transform:uppercase;letter-spacing:0.08em;">' +
        '<span data-r5-action="search-gif" style="font-weight:700;color:var(--accent-primary-press);cursor:pointer;">Search Giphy</span>' +
        '<span>· or paste URL</span>' +
      '</div>' +
    '</div>'
  );
}

function R5B_EMBED_HTML(id) {
  return (
    '<div class="r5-embed r5-embed-link" data-r5-embed-id="' + id + '" data-r5-embed-type="embed" contenteditable="false" style="display:flex;align-items:center;gap:14px;margin:14px 0;padding:14px 16px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
      '<svg width="18" height="18" viewBox="0 0 14 14" style="color:var(--fg-tertiary);flex-shrink:0;" aria-hidden="true"><path d="M5 9 L9 5 M4.5 7.5 L3 9 a2 2 0 0 1-2.8-2.8 L3 4 M9.5 6.5 L11 5 a2 2 0 0 1 2.8 2.8 L11 10" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-family:var(--font-mono);font-size:9px;color:var(--fg-tertiary);text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Embed link</div>' +
        '<div style="margin-top:2px;font-family:var(--font-sans);font-size:13px;color:var(--fg-secondary);font-style:italic;">Paste a URL — Coopr will fetch the title, image, and description.</div>' +
      '</div>' +
      '<span data-r5-action="paste-embed-url" style="padding:4px 12px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">Paste URL</span>' +
    '</div>'
  );
}

function R5B_CAROUSEL_SLIDE_HTML(n, kicker, body, isPlaceholder) {
  const empty = !body || isPlaceholder;
  return (
    '<div class="r5-carousel-slide" data-r5-slide-n="' + n + '" style="flex:0 0 180px;width:180px;aspect-ratio:4/5;display:flex;flex-direction:column;background:var(--surface-1);border:1px solid var(--border-default);border-radius:5px;padding:0;position:relative;overflow:hidden;">' +
      '<span data-r5-slide-handle="1" draggable="true" title="Drag to reorder" style="position:absolute;top:6px;right:6px;z-index:3;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:rgba(255,250,242,0.92);border-radius:5px;color:var(--fg-tertiary);cursor:grab;backdrop-filter:blur(4px);box-shadow:0 1px 4px rgba(38,21,12,0.12);">' +
        '<svg width="13" height="13" viewBox="0 0 12 12" aria-hidden="true"><circle cx="3" cy="3" r="1.1" fill="currentColor"/><circle cx="9" cy="3" r="1.1" fill="currentColor"/><circle cx="3" cy="6" r="1.1" fill="currentColor"/><circle cx="9" cy="6" r="1.1" fill="currentColor"/><circle cx="3" cy="9" r="1.1" fill="currentColor"/><circle cx="9" cy="9" r="1.1" fill="currentColor"/></svg>' +
      '</span>' +
      '<div data-r5-slide-content="1" style="position:relative;z-index:1;display:flex;flex-direction:column;height:100%;padding:12px 12px 14px;">' +
        '<div style="display:flex;align-items:baseline;gap:6px;">' +
          '<span data-r5-slide-kicker="1" style="font-family:var(--font-mono);font-size:9px;color:var(--fg-tertiary);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">' + n + ' · ' + kicker + '</span>' +
        '</div>' +
        '<span data-r5-slide-body="' + n + '" contenteditable="true" style="flex:1;margin-top:14px;font-family:var(--font-serif);font-style:italic;font-size:14px;color:' + (empty ? 'var(--fg-tertiary)' : 'var(--fg-primary)') + ';line-height:1.35;outline:none;opacity:' + (empty ? 0.55 : 1) + ';" data-r5-slide-empty="' + (empty ? '1' : '0') + '">' + (empty ? 'Drop image or type a plan…' : body) + '</span>' +
        '<div data-r5-slide-empty-hint="1" style="margin-top:8px;display:' + (empty ? 'flex' : 'none') + ';align-items:center;gap:6px;">' +
          '<span data-r5-action="upload-slide-image" style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border:1px dashed var(--border-default);border-radius:999px;font-family:var(--font-mono);font-size:8.5px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--fg-secondary);cursor:pointer;">+ Image</span>' +
        '</div>' +
      '</div>' +
      '<span data-r5-action="open-slide-notes" data-r5-slide-notes-chip="1" style="display:none;position:absolute;bottom:8px;right:8px;z-index:2;align-items:center;gap:4px;padding:3px 8px;background:rgba(38,21,12,0.78);color:#f0eadd;border-radius:999px;font-family:var(--font-mono);font-size:8.5px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(4px);">' +
        '<svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4 H9 M3 6 H9 M3 8 H7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/></svg>' +
        'Notes' +
      '</span>' +
    '</div>'
  );
}

const R5B_CAROUSEL_TEMPLATE_SLIDES = [
  { n: '1', kicker: 'HOOK',   body: 'I almost killed a student last spring.' },
  { n: '2', kicker: 'STAT',   body: '600 students. 5 close calls.' },
  { n: '3', kicker: 'STORY',  body: 'It was the third mistake — not the first.' },
  { n: '4', kicker: 'LESSON', body: 'The thing instructors stopped doing in 2008.' },
  { n: '5', kicker: 'CTA',    body: 'Pick the right instructor. Here\'s how.' },
];

function R5B_CAROUSEL_HTML(id) {
  // Empty initial state: 1 placeholder slide + Use template chip.
  return (
    '<div class="r5-embed r5-embed-carousel" data-r5-embed-id="' + id + '" data-r5-embed-type="carousel" contenteditable="false" style="display:block;margin:20px 0;padding:18px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
      '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:12px;">' +
        '<span style="font-family:var(--font-sans);font-size:9px;font-weight:700;color:var(--fg-tertiary);letter-spacing:0.12em;text-transform:uppercase;">Carousel</span>' +
        '<span data-r5-carousel-count="1" style="font-family:var(--font-mono);font-size:10px;color:var(--fg-tertiary);">1 slide · 4:5 · IG</span>' +
        '<span style="flex:1;"></span>' +
        '<span data-r5-action="add-slide" style="padding:3px 10px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">+ Slide</span>' +
        '<span data-r5-action="use-template-carousel" style="padding:3px 10px;border:1px solid var(--accent-primary);color:var(--accent-primary-press);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">Use template</span>' +
        '<span data-r5-action="export-carousel" style="padding:3px 10px;border:1px solid var(--border-default);color:var(--fg-secondary);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">Export</span>' +
      '</div>' +
      '<div data-r5-carousel-slides="1" class="r5-carousel-scroll" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;scroll-behavior:smooth;">' +
        R5B_CAROUSEL_SLIDE_HTML('1', 'HOOK', 'Type your hook…', true) +
      '</div>' +
      '<div data-r5-carousel-scrub="1" style="display:flex;align-items:center;justify-content:center;gap:5px;margin-top:6px;flex-wrap:wrap;">' +
        '<span data-r5-scrub-dot="1" style="width:18px;height:3px;background:var(--accent-primary);border-radius:2px;cursor:pointer;transition:background 120ms ease;"></span>' +
      '</div>' +
    '</div>'
  );
}

function R5B_CAROUSEL_TEMPLATE_HTML() {
  return R5B_CAROUSEL_TEMPLATE_SLIDES.map(s => R5B_CAROUSEL_SLIDE_HTML(s.n, s.kicker, s.body, false)).join('');
}

function R5B_TWEET_ROW_HTML(n, body, isPlaceholder) {
  const count = isPlaceholder ? 0 : body.length;
  const overLimit = count > 240;
  return (
    '<div class="r5-tweet-row" style="display:grid;grid-template-columns:28px 1fr 60px;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);align-items:baseline;">' +
      '<span style="font-family:var(--font-mono);font-size:10px;color:var(--accent-primary-press);font-weight:700;letter-spacing:0.06em;">' + n + '/</span>' +
      '<span data-r5-tweet-body="' + n + '" contenteditable="true" style="font-family:var(--font-serif);font-size:14.5px;color:' + (isPlaceholder ? 'var(--fg-tertiary)' : 'var(--fg-primary)') + ';line-height:1.5;outline:none;font-style:' + (isPlaceholder ? 'italic' : 'normal') + ';">' + body + '</span>' +
      '<span data-r5-tweet-count="' + n + '" style="font-family:var(--font-mono);font-size:9px;color:' + (overLimit ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)') + ';text-align:right;font-variant-numeric:tabular-nums;">' + count + '/280</span>' +
    '</div>'
  );
}

const R5B_THREAD_TEMPLATE_TWEETS = [
  { n: '1', body: 'I almost killed a student last spring. It was the third mistake — not the first — that nearly did it.' },
  { n: '2', body: 'The most dangerous instructor on a dive boat is the one who\'s never had a close call.' },
  { n: '3', body: 'Five mistakes from my first year teaching, ranked by how close they came.' },
];

function R5B_THREAD_HTML(id) {
  return (
    '<div class="r5-embed r5-embed-thread" data-r5-embed-id="' + id + '" data-r5-embed-type="thread" contenteditable="false" style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
      '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px;">' +
        '<span style="font-family:var(--font-sans);font-size:9px;font-weight:700;color:var(--fg-tertiary);letter-spacing:0.12em;text-transform:uppercase;">Thread</span>' +
        '<span data-r5-thread-count="1" style="font-family:var(--font-mono);font-size:10px;color:var(--fg-tertiary);">1 tweet · X/Threads</span>' +
        '<span style="flex:1;"></span>' +
        '<span data-r5-action="add-tweet" style="padding:3px 10px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">+ Tweet</span>' +
        '<span data-r5-action="use-template-thread" style="padding:3px 10px;border:1px solid var(--accent-primary);color:var(--accent-primary-press);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">Use template</span>' +
      '</div>' +
      '<div data-r5-thread-tweets="1">' +
        R5B_TWEET_ROW_HTML('1', 'Type your first tweet…', true) +
      '</div>' +
    '</div>'
  );
}

function R5B_THREAD_TEMPLATE_HTML() {
  return R5B_THREAD_TEMPLATE_TWEETS.map(t => R5B_TWEET_ROW_HTML(t.n, t.body, false)).join('');
}

function R5B_HOOK_VARIANT_HTML(letter, body, score, leading, isPlaceholder) {
  const borderColor = leading ? 'var(--accent-primary)' : 'var(--border-default)';
  const labelColor = leading ? 'var(--accent-primary-press)' : 'var(--fg-secondary)';
  const scoreColor = leading ? 'var(--tone-success)' : 'var(--fg-tertiary)';
  const bodyColor = isPlaceholder ? 'var(--fg-tertiary)' : (leading ? 'var(--fg-primary)' : 'var(--fg-secondary)');
  return (
    '<div class="r5-hook-variant" data-r5-hook-variant="' + letter + '" style="padding:12px 14px;background:var(--surface-1);border:1px solid ' + borderColor + ';border-radius:5px;">' +
      '<div style="display:flex;align-items:baseline;gap:10px;">' +
        '<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:700;color:' + labelColor + ';letter-spacing:0.06em;">' + letter + '</span>' +
        '<span style="flex:1;"></span>' +
        '<span data-r5-hook-score="' + letter + '" style="font-family:var(--font-mono);font-size:9px;color:' + scoreColor + ';font-weight:600;letter-spacing:0.06em;text-transform:uppercase;transition:color 200ms ease;">' + score + '</span>' +
      '</div>' +
      '<p data-r5-hook-body="' + letter + '" contenteditable="true" style="margin:6px 0 0;font-family:var(--font-serif);font-style:italic;font-size:15.5px;color:' + bodyColor + ';line-height:1.45;outline:none;">' + body + '</p>' +
    '</div>'
  );
}

function R5B_HOOK_HTML(id) {
  return (
    '<div class="r5-embed r5-embed-hook" data-r5-embed-id="' + id + '" data-r5-embed-type="hook" contenteditable="false" style="display:block;margin:20px 0;padding:18px 20px;border:1px solid var(--border-subtle);border-radius:6px;background:var(--surface-2);user-select:none;">' +
      '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:14px;">' +
        '<span style="font-family:var(--font-sans);font-size:9px;font-weight:700;color:var(--fg-tertiary);letter-spacing:0.12em;text-transform:uppercase;">Hook test</span>' +
        '<span data-r5-hook-status="1" style="font-family:var(--font-mono);font-size:10px;color:var(--fg-tertiary);">A vs B · ready to run</span>' +
        '<span style="flex:1;"></span>' +
        '<span data-r5-action="run-hook-test" style="padding:3px 10px;background:var(--accent-primary);color:var(--fg-on-accent);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">Run test</span>' +
        '<span data-r5-action="add-hook-variant" style="padding:3px 10px;background:var(--surface-1);border:1px solid var(--border-default);color:var(--fg-secondary);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">+ Variant</span>' +
        '<span data-r5-action="use-template-hook" style="padding:3px 10px;border:1px solid var(--accent-primary);color:var(--accent-primary-press);border-radius:999px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;">Use template</span>' +
      '</div>' +
      '<div data-r5-hook-variants="1">' +
        R5B_HOOK_VARIANT_HTML('A', 'Type variant A here…', '— % stop-rate', false, true) +
        '<div style="margin-top:8px;"></div>' +
        R5B_HOOK_VARIANT_HTML('B', 'Type variant B here…', '— % stop-rate', false, true) +
      '</div>' +
    '</div>'
  );
}

function R5B_HOOK_TEMPLATE_A() {
  return R5B_HOOK_VARIANT_HTML('A', 'I almost killed a student last spring. It was the third mistake — not the first — that nearly did it.', '71% stop-rate', true, false);
}
function R5B_HOOK_TEMPLATE_B() {
  return R5B_HOOK_VARIANT_HTML('B', 'Five mistakes from my first year teaching. Ranked by how close they came.', '58% stop-rate', false, false);
}

function R5_SlashIcon({ kind }) {
  const ic = R5B_ICON_GLYPHS[kind] || R5B_ICON_GLYPHS.p;
  return (
    <span style={{
      width: 28, height: 28, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 4,
      fontFamily: ic.font === 'mono' ? R5B.mono : R5B.serif,
      fontSize: ic.size,
      fontStyle: ic.italic ? 'italic' : 'normal',
      fontWeight: kind === 'star' ? 400 : 500,
      color: kind === 'star' ? 'var(--accent-primary)' : 'var(--fg-secondary)',
      lineHeight: 1,
    }}>{ic.glyph}</span>
  );
}

function R5_SlashPopover({ open = false, x = 0, y = 0, verbs = [], filter = '', selected = 0, onPick = () => {} }) {
  if (!open) return null;
  const f = (filter || '').toLowerCase();
  const filtered = f
    ? verbs.filter(v => v.label.toLowerCase().includes(f) || (v.desc && v.desc.toLowerCase().includes(f)) || (v.category && v.category.toLowerCase().includes(f)))
    : verbs;

  // Group by category preserving insertion order.
  const groups = [];
  const seen = {};
  filtered.forEach(v => {
    const cat = v.category || 'Other';
    if (!seen[cat]) { seen[cat] = []; groups.push([cat, seen[cat]]); }
    seen[cat].push(v);
  });

  // Track flat index across categories for keyboard nav.
  let idx = -1;

  return (
    <div
      contentEditable={false}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: 'fixed', left: x, top: y,
        width: 360,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        boxShadow: '0 12px 30px rgba(38,21,12,0.18)',
        zIndex: 9,
        userSelect: 'none',
        display: 'flex', flexDirection: 'column',
        maxHeight: 460,
      }}
    >
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <R5B_ML s={9.5}>Insert</R5B_ML>
        {filter ? (
          <span style={{ fontFamily: R5B.mono, fontSize: 10, color: 'var(--accent-primary-press)', fontWeight: 600 }}>filter: {filter}</span>
        ) : (
          <R5B_MM s={9.5}>type to filter</R5B_MM>
        )}
        <span style={{ flex: 1 }} />
        <R5B_MM s={9}>{filtered.length} block{filtered.length === 1 ? '' : 's'}</R5B_MM>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 4 }}>
        {filtered.length === 0 && (
          <div style={{ padding: '24px 14px', textAlign: 'center' }}>
            <R5B_MM s={11} st={{ fontStyle: 'italic' }}>No blocks match "{filter}".</R5B_MM>
          </div>
        )}
        {groups.map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 4 }}>
            <div style={{ padding: '8px 10px 4px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <R5B_ML s={8.5}>{cat}</R5B_ML>
              <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>
            {items.map((v) => {
              idx++;
              const active = idx === selected;
              return (
                <div
                  key={v.label}
                  onClick={() => onPick(v)}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 10px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    border: active ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  }}
                >
                  <R5_SlashIcon kind={v.icon} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: R5B.sans, fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)' }}>{v.label}</div>
                    {v.desc && (
                      <div style={{ marginTop: 2, fontFamily: R5B.serif, fontSize: 12, fontStyle: 'italic', color: 'var(--fg-tertiary)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.desc}</div>
                    )}
                  </div>
                  {v.hint && (
                    <R5B_MM s={9} c={active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'} st={{ flexShrink: 0, fontWeight: 600, letterSpacing: '0.04em' }}>{v.hint}</R5B_MM>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <R5B_MM s={9}>↑↓ nav</R5B_MM>
        <R5B_MM s={9}>↵ insert</R5B_MM>
        <R5B_MM s={9}>esc close</R5B_MM>
        <span style={{ flex: 1 }} />
        <R5B_MM s={9} c="var(--fg-tertiary)" st={{ fontStyle: 'italic' }}>type / for menu</R5B_MM>
      </div>
    </div>
  );
}

// ─── Section primitives ────────────────────────────────────

function R5_DocSectionHandle({ n, label, status }) {
  return (
    <div contentEditable={false} style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, userSelect: 'none' }}>
      <R5B_MM s={11} c="var(--fg-tertiary)" st={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', minWidth: 20 }}>{n}</R5B_MM>
      <span style={{ fontFamily: R5B.serif, fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{label}</span>
      <span style={{ flex: 1 }} />
      <R5B_MM s={9.5}>{status}</R5B_MM>
    </div>
  );
}

function R5_DocBeat({ time, kind, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'baseline' }}>
      <R5B_MM s={10.5} c="var(--fg-secondary)">{time}</R5B_MM>
      <div>{children}</div>
      <R5B_ML s={9} st={{ textAlign: 'right' }}>{kind}</R5B_ML>
    </div>
  );
}

function R5_DocPrepRow({ label, done, agent, onAgentClick = () => {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 13, height: 13, borderRadius: 3, background: done ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--border-default)' }} />
      <span style={{ fontFamily: R5B.sans, fontSize: 13, color: done ? 'var(--fg-tertiary)' : 'var(--fg-primary)', textDecoration: done ? 'line-through' : 'none' }}>{label}</span>
      {agent && (
        <span
          onClick={(e) => { e.stopPropagation(); onAgentClick(label); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: 'var(--accent-soft)', borderRadius: 999, cursor: 'pointer' }}
        >
          <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }} aria-hidden="true"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
          <R5B_MM s={8.5} c="var(--accent-primary-press)" st={{ fontWeight: 700, letterSpacing: '0.08em' }}>COOPR CAN DO IT</R5B_MM>
        </span>
      )}
    </div>
  );
}

function R5_DocAddSection({ onClick = () => {} }) {
  return (
    <div
      contentEditable={false}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        marginTop: 36, padding: '16px 0',
        display: 'flex', alignItems: 'center', gap: 12,
        borderTop: '1px dashed var(--border-default)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" style={{ color: 'var(--fg-tertiary)' }} aria-hidden="true">
        <path d="M7 2 L7 12 M2 7 L12 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <R5B_MM s={11}>Add section</R5B_MM>
    </div>
  );
}

// ─── Page header primitives ────────────────────────────────

function R5_DocStatePill({ states = [], activeId, onCycle = () => {} }) {
  const a = states.find(x => x.id === activeId) || states[0];
  if (!a) return null;
  return (
    <span
      contentEditable={false}
      onClick={(e) => { e.stopPropagation(); onCycle(); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 12px',
        background: a.bg,
        border: '1px solid ' + a.border,
        borderRadius: 999,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      title="Click to cycle state"
    >
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: a.dot,
        animation: a.pulse ? 'hf-doc-state-pulse 1.6s ease-in-out infinite' : 'none',
      }} />
      <span style={{
        fontFamily: R5B.mono, fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.10em', textTransform: 'uppercase',
        color: a.fg,
      }}>{a.label}</span>
    </span>
  );
}

function R5_DocVersionStrip({ versions = [], onPick = () => {} }) {
  return (
    <div contentEditable={false} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', userSelect: 'none' }}>
      {versions.map((v) => (
        <span
          key={v.id}
          onClick={(e) => { e.stopPropagation(); onPick(v.id); }}
          style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 6,
            padding: '3px 9px',
            background: v.current ? 'var(--surface-2)' : 'transparent',
            border: '1px solid ' + (v.current ? 'var(--border-default)' : 'var(--border-subtle)'),
            borderRadius: 999,
            cursor: 'pointer',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <R5B_MM s={10} c={v.current ? 'var(--fg-primary)' : 'var(--fg-secondary)'} st={{ fontWeight: 700, letterSpacing: '0.06em' }}>{v.id}</R5B_MM>
          <R5B_MM s={9} c="var(--fg-tertiary)">{v.when}</R5B_MM>
          {v.delta != null && (
            <R5B_MM s={9} c={v.delta < 0 ? 'var(--tone-success)' : 'var(--accent-primary-press)'} st={{ fontWeight: 600 }}>
              {v.delta < 0 ? '' : '+'}{v.delta}w
            </R5B_MM>
          )}
        </span>
      ))}
    </div>
  );
}

function R5_DocAmbientPresence({ name = 'Coopr', when = '14m ago', activity = '' }) {
  return (
    <div contentEditable={false} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, userSelect: 'none' }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: 'var(--accent-primary)',
        alignSelf: 'center',
        animation: 'hf-doc-state-pulse 2.4s ease-in-out infinite',
      }} />
      <span style={{ fontFamily: R5B.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{name}</span>
      <R5B_MM s={9.5}>· {when}</R5B_MM>
      {activity && <span style={{ fontFamily: R5B.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>· {activity}</span>}
    </div>
  );
}

function R5_DocHeader({
  eyebrow,
  states, activeStateId, onCycleState,
  title, italicTail,
  meta = [],
  versions = [], onPickVersion = () => {},
  presence,
}) {
  return (
    <header contentEditable={false} style={{ marginBottom: 32, userSelect: 'none' }}>
      <R5B_ML s={9.5} st={{ display: 'block', marginBottom: 14 }}>{eyebrow}</R5B_ML>

      <div style={{ marginBottom: 14 }}>
        <R5_DocStatePill states={states} activeId={activeStateId} onCycle={onCycleState} />
      </div>

      <h1 style={{ margin: 0, fontFamily: R5B.serif, fontSize: 56, fontWeight: 400, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.05 }}>
        <span>{title} </span>
        <span style={{ fontStyle: 'italic' }}>{italicTail}</span>
      </h1>

      {meta.length > 0 && (
        <div style={{ marginTop: 18, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {meta.map(([k, v], i) => (
            <div key={i} style={{ minWidth: 0 }}>
              <R5B_ML s={9}>{k}</R5B_ML>
              <div style={{ marginTop: 3, fontFamily: R5B.sans, fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {versions.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <R5_DocVersionStrip versions={versions} onPick={onPickVersion} />
        </div>
      )}

      {presence && (
        <div style={{ marginTop: 16 }}>
          <R5_DocAmbientPresence {...presence} />
        </div>
      )}

      <div style={{ marginTop: 28, height: 1, background: 'var(--border-subtle)' }} />
    </header>
  );
}

// ─── Constants ─────────────────────────────────────────────

const R5B_STATES = [
  { id: 'drafting',  label: 'drafting · you',    bg: 'var(--accent-soft)',     fg: 'var(--accent-primary-press)', dot: 'var(--accent-primary)', border: 'transparent', pulse: true },
  { id: 'reviewing', label: 'reviewing · coopr', bg: 'var(--tone-warning-bg)', fg: 'var(--tone-warning)',         dot: 'var(--tone-warning)',   border: 'transparent', pulse: false },
  { id: 'locked',    label: 'locked · read-only', bg: 'var(--surface-2)',      fg: 'var(--fg-secondary)',         dot: 'var(--fg-tertiary)',    border: 'var(--border-default)', pulse: false },
  { id: 'shipped',   label: 'shipped · apr 24',  bg: 'var(--tone-success-bg)', fg: 'var(--tone-success)',         dot: 'var(--tone-success)',   border: 'transparent', pulse: false },
];
const R5B_VERSIONS_HEADER = [
  { id: 'v3', when: 'current',   current: true,  delta: null },
  { id: 'v2', when: '2h',        current: false, delta: 38 },
  { id: 'v1', when: 'yesterday', current: false, delta: 218 },
];
const R5B_META = [
  ['Status',  'drafting · v3'],
  ['Format',  '11-min YT'],
  ['Channel', 'YouTube'],
  ['Target',  'Tue 6:30 PM'],
];
const R5B_SHOTS = [
  ['01', 'Wide — Fujikawa deck from above',     '0:00–0:08'],
  ['02', 'Medium — gauges, breaths counting',   '0:08–0:30'],
  ['03', 'Close — soft coral on rail',          '0:30–1:00'],
  ['04', 'POV — swim into hold three',          '4:10–4:40'],
];
const R5B_PREP = [
  ['Color graded',           true,  false],
  ['Captions pass 2',        true,  false],
  ['Thumbnail variants',     true,  false],
  ['Audio noise floor',      true,  false],
  ['Description gear links', false, true],
  ['Cards & end screen',     false, false],
];
const R5B_SLASH_VERBS = [
  // Basic blocks
  { category: 'Basic blocks', icon: 'h1',    label: 'Heading 1',         desc: 'Big section title.',           kind: 'block',       cmd: 'formatBlock', val: '<h2>',          hint: '⌘⌥1' },
  { category: 'Basic blocks', icon: 'h2',    label: 'Heading 2',         desc: 'Medium subsection title.',     kind: 'block',       cmd: 'formatBlock', val: '<h3>',          hint: '⌘⌥2' },
  { category: 'Basic blocks', icon: 'h3',    label: 'Heading 3',         desc: 'Small italic eyebrow.',        kind: 'block',       cmd: 'formatBlock', val: '<h4>',          hint: '⌘⌥3' },
  { category: 'Basic blocks', icon: 'p',     label: 'Plain paragraph',   desc: 'Just prose, no styling.',      kind: 'block',       cmd: 'formatBlock', val: '<p>',           hint: '⌘⌥0' },
  { category: 'Basic blocks', icon: 'quote', label: 'Quote',             desc: 'Italic with cocoa rule.',      kind: 'block',       cmd: 'formatBlock', val: '<blockquote>',  hint: '⌘⇧.' },
  { category: 'Basic blocks', icon: 'hr',    label: 'Divider',           desc: 'Thin horizontal rule.',        kind: 'block',       cmd: 'insertHorizontalRule' },
  // Lists
  { category: 'Lists',        icon: 'ul',    label: 'Bullet list',       desc: 'A point-by-point list.',       kind: 'block',       cmd: 'insertUnorderedList',           hint: '⌘⇧8' },
  { category: 'Lists',        icon: 'ol',    label: 'Numbered list',     desc: 'An ordered list.',             kind: 'block',       cmd: 'insertOrderedList',             hint: '⌘⇧7' },
  { category: 'Lists',        icon: 'check', label: 'Checklist',         desc: 'Boxes to tick off.',           kind: 'placeholder', text: '☐ ' },
  // Coopr verbs (AI)
  { category: 'Coopr',        icon: 'star',  label: 'Rewrite tighter',   desc: 'Coopr trims your selection.',  kind: 'placeholder', text: '[Rewrite tighter · drafted by Coopr]' },
  { category: 'Coopr',        icon: 'star',  label: 'Extract as caption', desc: 'Pull a one-line caption.',     kind: 'placeholder', text: '[Caption · drafted by Coopr]' },
  { category: 'Coopr',        icon: 'star',  label: 'Shorten by 30%',    desc: 'Cut without losing meaning.',  kind: 'placeholder', text: '[Shortened · drafted by Coopr]' },
  { category: 'Coopr',        icon: 'star',  label: 'Make question',     desc: 'Reframe as a question.',       kind: 'placeholder', text: '[Question · drafted by Coopr]' },
  { category: 'Coopr',        icon: 'star',  label: 'Insert shot from transcript', desc: 'Pull a shot row from your dive footage.', kind: 'placeholder', text: '[Shot · pulled by Coopr]' },
  { category: 'Coopr',        icon: 'star',  label: 'Insert beat from outline',     desc: 'Pull a script beat with timecode.',         kind: 'placeholder', text: '[Beat · pulled by Coopr]' },
  { category: 'Coopr',        icon: 'star',  label: 'Pull a quote from §',          desc: 'Lift a memorable line from a section.',    kind: 'placeholder', text: '[Pull-quote · drafted by Coopr]' },
  // Media
  { category: 'Media',        icon: 'photo',    label: 'Photo',          desc: 'Upload a 16:9 image.',                          kind: 'embed-html', html: 'photo' },
  { category: 'Media',        icon: 'video',    label: 'Video',          desc: 'Upload a clip or paste a URL.',                  kind: 'embed-html', html: 'video' },
  { category: 'Media',        icon: 'gif',      label: 'GIF',            desc: 'Search Giphy or paste a URL.',                   kind: 'embed-html', html: 'gif' },
  { category: 'Media',        icon: 'embed',    label: 'Embed link',     desc: 'Coopr fetches title, image, and description.',  kind: 'embed-html', html: 'embed' },
  // Social
  { category: 'Social',       icon: 'carousel', label: 'Carousel',       desc: 'Multi-slide deck — IG / LinkedIn / web.',        kind: 'embed-html', html: 'carousel' },
  { category: 'Social',       icon: 'thread',   label: 'Tweet thread',   desc: 'Numbered tweets with character counters.',       kind: 'embed-html', html: 'thread' },
  { category: 'Social',       icon: 'hook',     label: 'Hook test (A/B)', desc: 'Two hook variants with stop-rate scoring.',     kind: 'embed-html', html: 'hook' },
  // Insert
  { category: 'Insert',       icon: 'at',    label: 'Mention teammate',  desc: 'Tag a Coopr or user with @.',  kind: 'placeholder', text: '@teammate ', hint: '@' },
  { category: 'Insert',       icon: 'code',  label: 'Code',              desc: 'Monospaced code block.',        kind: 'block',       cmd: 'formatBlock', val: '<pre>' },
  { category: 'Insert',       icon: 'callout', label: 'Callout',         desc: 'Highlighted note block.',       kind: 'block',       cmd: 'formatBlock', val: '<blockquote>' },
];

const R5B_EMBED_BUILDERS = {
  photo:    R5B_PHOTO_HTML,
  video:    R5B_VIDEO_HTML,
  gif:      R5B_GIF_HTML,
  embed:    R5B_EMBED_HTML,
  carousel: R5B_CAROUSEL_HTML,
  thread:   R5B_THREAD_HTML,
  hook:     R5B_HOOK_HTML,
};
const R5B_OPENING_TIGHTENED = 'I dropped onto the Fujikawa at 95 feet and counted to eight before moving.';

// ─── Main body ─────────────────────────────────────────────

function HF_R5DocBody({ focusMode = false, onWordCount = () => {}, onDirty = () => {}, docId = 'truk-lagoon-ep-1', onOpenDoc = () => {} }) {
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});

  const containerRef = React.useRef(null);
  const editableRef  = React.useRef(null);
  const openingParaRef = React.useRef(null);

  const [stateId, setStateId] = React.useState('drafting');
  const [editStatus, setEditStatus] = React.useState({});  // { editId: 'kept' | 'reverted' }
  const [addedShots, setAddedShots] = React.useState('pending'); // 'pending' | 'kept' | 'dropped'
  const [openingAccepted, setOpeningAccepted] = React.useState(false);
  const [diffOverlay, setDiffOverlay] = React.useState(null); // { fromId, toId } or null
  const [blockMenu, setBlockMenu] = React.useState({ visible: false, x: 0, y: 0, blockEl: null });
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [cropMode, setCropMode] = React.useState(null); // { canvasEl, originalBg, posX, posY, zoom }
  const [exportCarousel, setExportCarousel] = React.useState(null); // { slidesHtml, count }

  // Per-doc metadata lookup. Falls back to Truk if window.R5H_DOCS isn't loaded yet.
  const docMeta = React.useMemo(() => {
    const docs = (window.R5H_DOCS || []);
    return docs.find(d => d.id === docId) || {
      id: docId, eyebrow: 'Studio · Docs · Truk Lagoon · Ep. 1 hook',
      title: 'The Fujikawa', italicTail: 'in eight breaths.',
      status: 'drafting', statusVersion: 'v3',
      target_when: 'Tue 6:30 PM', channel: 'YouTube · 11-min',
      agent: { name: 'Coopr', when: '14m ago', body: 'three edits — hook tightened, two shots added, caption drafted' },
    };
  }, [docId]);
  const isTruk = docId === 'truk-lagoon-ep-1';

  // slash popover state
  const [slashOpen, setSlashOpen] = React.useState(false);
  const [slashAnchor, setSlashAnchor] = React.useState({ x: 0, y: 0 });
  const [slashFilter, setSlashFilter] = React.useState('');
  const [slashSelected, setSlashSelected] = React.useState(0);
  const slashRangeRef = React.useRef(null); // saved Range to know where '/' was

  // selection-anchored format toolbar state — viewport coords (position: fixed)
  const [tb, setTb] = React.useState({ visible: false, x: 0, y: 0 });
  const [linkInput, setLinkInput] = React.useState({ visible: false, x: 0, y: 0, value: '' });
  const [commentInput, setCommentInput] = React.useState({ visible: false, x: 0, y: 0, value: '', anchorTop: 0 });
  const [comments, setComments] = React.useState([
    { id: 'c1-rhythm', author: 'M', name: 'Mara', body: "Lean into the rhythm. The 'eight breaths' phrase should land twice — open and close.", when: '1h ago', anchorTop: 48, sectionId: 'sec-01' },
  ]);
  const savedRangeRef = React.useRef(null);

  React.useEffect(() => {
    function onSelectionChange() {
      if (slashOpen || linkInput.visible || commentInput.visible) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setTb(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }
      const ed = editableRef.current;
      if (!ed) return;
      let n = sel.anchorNode;
      let inside = false;
      while (n) { if (n === ed) { inside = true; break; } n = n.parentNode; }
      if (!inside) {
        setTb(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) return;
      setTb({
        visible: true,
        x: rect.left + rect.width / 2,
        y: Math.max(rect.top - 8, 56),
      });
    }
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [slashOpen, linkInput.visible, commentInput.visible]);

  function applyCmd(cmd, val = null) {
    const ed = editableRef.current;
    if (!ed) return;
    ed.focus();
    // If caret isn't inside the editable yet (e.g. first click on the format
    // strip after page load), place it at the end of the last text node so
    // execCommand has a target.
    const sel = window.getSelection();
    let inside = false;
    if (sel && sel.rangeCount > 0) {
      let n = sel.anchorNode;
      while (n) { if (n === ed) { inside = true; break; } n = n.parentNode; }
    }
    if (!inside) {
      const walker = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT);
      let last = null;
      while (walker.nextNode()) last = walker.currentNode;
      if (last && sel) {
        const r = document.createRange();
        r.setStart(last, last.textContent.length);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    }
    try { document.execCommand(cmd, false, val); } catch (e) { /* ignore */ }
    setTb(prev => ({ ...prev, visible: false }));
  }

  function openLinkInput() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      pushToast('Link · select text first');
      return;
    }
    savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    setLinkInput({ visible: true, x: tb.x, y: tb.y, value: '' });
    setTb(prev => ({ ...prev, visible: false }));
  }
  function applyLink(url) {
    setLinkInput({ visible: false, x: 0, y: 0, value: '' });
    if (!url) return;
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
    if (editableRef.current) editableRef.current.focus();
    try { document.execCommand('createLink', false, url); } catch (e) { /* ignore */ }
  }

  function openCommentInput() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      pushToast('Comment · select text first');
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    savedRangeRef.current = range.cloneRange();
    // Find the section the selection is in for anchorTop calc
    let n = sel.anchorNode;
    let sectionId = 'sec-01';
    while (n) {
      if (n.id && n.id.startsWith('sec-')) { sectionId = n.id; break; }
      n = n.parentNode;
    }
    const sectionEl = document.getElementById(sectionId);
    const sectionRect = sectionEl ? sectionEl.getBoundingClientRect() : { top: 0 };
    setCommentInput({
      visible: true,
      x: tb.x,
      y: tb.y,
      value: '',
      anchorTop: rect.top - sectionRect.top + 4,
      sectionId,
    });
    setTb(prev => ({ ...prev, visible: false }));
  }
  function submitComment(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) {
      setCommentInput({ visible: false, x: 0, y: 0, value: '', anchorTop: 0 });
      return;
    }
    const newId = 'c-' + Date.now().toString(36);
    setComments(cs => [...cs, {
      id: newId,
      author: 'Y',
      name: 'You',
      body: trimmed,
      when: 'just now',
      anchorTop: commentInput.anchorTop,
      sectionId: commentInput.sectionId || 'sec-01',
    }]);
    setCommentInput({ visible: false, x: 0, y: 0, value: '', anchorTop: 0 });
    pushToast('Comment added');
  }

  // Markdown-style block triggers (typed at the very start of a block, then space)
  function tryMarkdownTrigger(e) {
    if (e.key !== ' ' || e.metaKey || e.ctrlKey || e.altKey) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (!editableRef.current || !editableRef.current.contains(node)) return false;

    // Walk up to the closest block-level container so we know we're at line-start.
    let block = node.nodeType === 3 ? node.parentElement : node;
    while (block && block !== editableRef.current && !['P','DIV','H1','H2','H3','H4','H5','H6','BLOCKQUOTE','LI'].includes(block.tagName)) {
      block = block.parentElement;
    }
    if (!block || block === editableRef.current) return false;

    // Read all text from block start up to the caret.
    const blockRange = document.createRange();
    blockRange.setStart(block, 0);
    blockRange.setEnd(node, range.startOffset);
    const textBefore = blockRange.toString();

    let cmd = null, val = null;
    if      (textBefore === '###') { cmd = 'formatBlock'; val = '<h4>'; }
    else if (textBefore === '##')  { cmd = 'formatBlock'; val = '<h3>'; }
    else if (textBefore === '#')   { cmd = 'formatBlock'; val = '<h2>'; }
    else if (textBefore === '>')   { cmd = 'formatBlock'; val = '<blockquote>'; }
    else if (textBefore === '-' || textBefore === '*') { cmd = 'insertUnorderedList'; }
    else if (textBefore === '1.')  { cmd = 'insertOrderedList'; }
    if (!cmd) return false;

    e.preventDefault();
    blockRange.deleteContents();
    try { document.execCommand(cmd, false, val); } catch (err) { /* ignore */ }
    pushToast('Markdown · ' + (val || cmd));
    return true;
  }

  // Auto-replace -- → em-dash, ... → ellipsis. Runs after any input.
  function tryAutoReplace() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== 3) return;
    const off = range.startOffset;
    const text = node.textContent;
    if (off >= 3 && text.slice(off - 3, off) === '...') {
      const r = document.createRange();
      r.setStart(node, off - 3);
      r.setEnd(node, off);
      r.deleteContents();
      const tn = document.createTextNode('…');
      r.insertNode(tn);
      const after = document.createRange();
      after.setStartAfter(tn);
      after.collapse(true);
      sel.removeAllRanges();
      sel.addRange(after);
      return;
    }
    if (off >= 2 && text.slice(off - 2, off) === '--') {
      const r = document.createRange();
      r.setStart(node, off - 2);
      r.setEnd(node, off);
      r.deleteContents();
      const tn = document.createTextNode('—');
      r.insertNode(tn);
      const after = document.createRange();
      after.setStartAfter(tn);
      after.collapse(true);
      sel.removeAllRanges();
      sel.addRange(after);
    }
  }

  // Counts words from the editable's plain-text + reports up + persists to
  // localStorage after a quiet 800ms.
  const inputDebounceRef = React.useRef(null);
  const saveDebounceRef  = React.useRef(null);
  const STORAGE_KEY = 'r5-doc-' + (docId || 'truk-lagoon-ep-1');

  function handleInput(e) {
    tryAutoReplace();
    onDirty(true);
    // Live char count for tweet bodies + clear placeholder italic on first edit.
    const target = e && e.target;
    if (target && target.dataset && target.dataset.r5TweetBody) {
      const n = target.dataset.r5TweetBody;
      const count = (target.innerText || '').replace(/ /g, ' ').length;
      const overLimit = count > 240;
      target.style.color = 'var(--fg-primary)';
      target.style.fontStyle = 'normal';
      const display = target.parentElement && target.parentElement.querySelector('[data-r5-tweet-count="' + n + '"]');
      if (display) {
        display.textContent = count + '/280';
        display.style.color = overLimit ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)';
      }
    }
    if (target && target.dataset && (target.dataset.r5SlideBody || target.dataset.r5HookBody)) {
      target.style.color = 'var(--fg-primary)';
      target.style.fontStyle = target.dataset.r5HookBody ? 'italic' : 'italic';
    }
    if (inputDebounceRef.current) clearTimeout(inputDebounceRef.current);
    inputDebounceRef.current = setTimeout(() => {
      const text = editableRef.current ? editableRef.current.innerText : '';
      const count = (text.match(/\S+/g) || []).length;
      onWordCount(count);
    }, 120);
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    saveDebounceRef.current = setTimeout(() => {
      try {
        if (editableRef.current && window.localStorage) {
          window.localStorage.setItem(STORAGE_KEY, editableRef.current.innerHTML);
          onDirty(false);
        }
      } catch (e) { /* storage may be full or blocked */ }
    }, 800);
  }

  // On mount and on docId change: if there's a saved version for THIS doc,
  // swap the editable's innerHTML. useLayoutEffect runs before paint so we
  // never see a flash of seed content.
  React.useLayoutEffect(() => {
    try {
      if (editableRef.current && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && saved.length > 100) {
          editableRef.current.innerHTML = saved;
          const text = editableRef.current.innerText || '';
          onWordCount((text.match(/\S+/g) || []).length);
          onDirty(false);
        }
      }
    } catch (e) { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY]);

  function clearSavedDoc() {
    try {
      if (window.localStorage) window.localStorage.removeItem(STORAGE_KEY);
      pushToast('Local edits cleared · refresh to reset');
    } catch (e) { /* ignore */ }
  }

  function cycleState() {
    const i = R5B_STATES.findIndex(x => x.id === stateId);
    const next = R5B_STATES[(i + 1) % R5B_STATES.length];
    setStateId(next.id);
    pushToast('Doc state · ' + next.label);
  }

  function getCaretRect() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    let rect = range.getClientRects()[0];
    if (!rect) rect = range.getBoundingClientRect();
    return rect;
  }

  // Positions the popover under the caret using viewport coords (position: fixed).
  // Clamps to viewport so it never spawns off-screen.
  function openSlashAtCaret() {
    const rect = getCaretRect();
    if (!rect) return false;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = rect.left + 4;
    let y = rect.bottom + 6;
    if (x + 280 > vw) x = vw - 280 - 12;
    if (y + 360 > vh) y = Math.max(12, rect.top - 360 - 6);
    setSlashAnchor({ x, y });
    setSlashFilter('');
    setSlashSelected(0);
    setSlashOpen(true);
    return true;
  }

  function openSlashFromHandle(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const vw = window.innerWidth;
    let x = r.right + 8;
    let y = r.top + 4;
    if (x + 280 > vw) x = vw - 280 - 12;
    // Place caret at end of the closest block so execCommand block conversions
    // operate on the correct paragraph.
    const handleBlock = e.currentTarget.closest('.r5-edit-block');
    if (handleBlock) {
      const walker = document.createTreeWalker(handleBlock, NodeFilter.SHOW_TEXT);
      let lastText = null;
      while (walker.nextNode()) lastText = walker.currentNode;
      if (lastText) {
        const sel = window.getSelection();
        const rng = document.createRange();
        rng.setStart(lastText, lastText.textContent.length);
        rng.collapse(true);
        sel.removeAllRanges();
        sel.addRange(rng);
      }
    }
    setSlashAnchor({ x, y });
    setSlashFilter('');
    setSlashSelected(0);
    slashRangeRef.current = null;
    setSlashOpen(true);
  }

  function openBlockMenu(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const handleBlock = e.currentTarget.closest('.r5-edit-block');
    setBlockMenu({ visible: true, x: r.right + 8, y: r.top, blockEl: handleBlock });
  }
  function applyBlockMenu(action) {
    const block = blockMenu.blockEl;
    if (block) {
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
      const firstText = walker.nextNode();
      if (firstText) {
        const sel = window.getSelection();
        const rng = document.createRange();
        rng.setStart(firstText, 0);
        rng.collapse(true);
        sel.removeAllRanges();
        sel.addRange(rng);
      }
    }
    if (editableRef.current) editableRef.current.focus();
    const map = {
      h1:    { cmd: 'formatBlock', val: '<h2>' },
      h2:    { cmd: 'formatBlock', val: '<h3>' },
      h3:    { cmd: 'formatBlock', val: '<h4>' },
      quote: { cmd: 'formatBlock', val: '<blockquote>' },
      ul:    { cmd: 'insertUnorderedList', val: null },
      ol:    { cmd: 'insertOrderedList', val: null },
      plain: { cmd: 'formatBlock', val: '<p>' },
    };
    if (map[action]) {
      try { document.execCommand(map[action].cmd, false, map[action].val); } catch (e) { /* ignore */ }
      pushToast('Turned into · ' + action);
    } else if (action === 'comment') {
      pushToast('Add comment · select text first');
    } else if (action === 'duplicate') {
      pushToast('Duplicate block');
    } else if (action === 'delete') {
      pushToast('Delete block');
    }
  }

  function closeSlash() {
    setSlashOpen(false);
    setSlashFilter('');
    setSlashSelected(0);
    slashRangeRef.current = null;
  }

  function pickVerb(v) {
    // Clean up the typed `/` + filter chars so the caret lands where the slash started.
    if (slashRangeRef.current) {
      try {
        const sel = window.getSelection();
        const startNode = slashRangeRef.current.node;
        const startOffset = slashRangeRef.current.offset;
        if (sel && sel.rangeCount > 0 && startNode && startNode.parentNode) {
          const range = document.createRange();
          range.setStart(startNode, startOffset);
          const cur = sel.getRangeAt(0);
          range.setEnd(cur.endContainer, cur.endOffset);
          range.deleteContents();
          const after = document.createRange();
          after.setStart(startNode, startOffset);
          after.collapse(true);
          sel.removeAllRanges();
          sel.addRange(after);
        }
      } catch (err) { /* ignore */ }
    }
    if (editableRef.current) editableRef.current.focus();
    if (v.kind === 'block') {
      try { document.execCommand(v.cmd, false, v.val || null); } catch (e) { /* ignore */ }
    } else if (v.kind === 'embed-html') {
      const builder = R5B_EMBED_BUILDERS[v.html];
      if (builder) {
        const id = 'embed-' + Date.now().toString(36);
        try { document.execCommand('insertHTML', false, builder(id)); } catch (e) { /* ignore */ }
      }
    } else {
      const text = v.text || ('[' + v.label + ']');
      try { document.execCommand('insertText', false, text); } catch (e) { /* ignore */ }
    }
    closeSlash();
    pushToast('Slash · ' + v.label);
  }

  function uploadFile(accept, onLoad) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = true;
    input.style.display = 'none';
    input.onchange = () => {
      const files = Array.from(input.files || []);
      files.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = () => onLoad(reader.result, file, i, files.length);
        reader.readAsDataURL(file);
      });
      if (input.parentNode) document.body.removeChild(input);
    };
    document.body.appendChild(input);
    input.click();
  }

  function fireSave() {
    if (editableRef.current) editableRef.current.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Apply an image data-URL to a photo embed. The placeholder svg gets hidden,
  // background-image is set on the canvas, and a "replace" affordance shows.
  function applyImageToPhotoEmbed(embed, dataUrl) {
    const canvas = embed.querySelector('[data-r5-photo-canvas]');
    if (!canvas) return;
    canvas.style.background = "url('" + dataUrl + "') center/cover";
    const svg = canvas.querySelector('svg');
    if (svg) svg.style.display = 'none';
  }

  // Apply a video data-URL to a video embed. Replaces the play-icon canvas
  // with a real <video> element. Reads duration once metadata loads.
  function applyVideoToEmbed(embed, dataUrl, fileName) {
    const canvas = embed.querySelector('[data-r5-video-canvas]');
    if (!canvas) return;
    canvas.innerHTML = '';
    const v = document.createElement('video');
    v.src = dataUrl;
    v.controls = true;
    v.style.cssText = 'width:100%;height:100%;object-fit:cover;background:#26150c;';
    v.onloadedmetadata = () => {
      const d = v.duration || 0;
      const m = Math.floor(d / 60), s = Math.floor(d % 60);
      const dur = m + ':' + (s < 10 ? '0' : '') + s;
      const durEl = embed.querySelector('[data-r5-video-duration]');
      if (durEl) durEl.textContent = '0:00 / ' + dur;
      const status = embed.querySelector('[data-r5-video-status]');
      if (status) status.textContent = '· ' + (fileName || 'uploaded') + ' · ' + dur;
      fireSave();
    };
    canvas.appendChild(v);
  }

  // Convert a carousel slide to an image-backed slide.
  // Image-first: image is the slide. Any existing plan text becomes "notes"
  // hidden behind a chip in the bottom-right corner.
  function applyImageToSlide(slide, dataUrl) {
    slide.style.background = "url('" + dataUrl + "') center/cover, #1a1815";
    slide.style.padding = '0';
    slide.style.position = 'relative';
    slide.style.overflow = 'hidden';
    slide.dataset.r5HasImg = '1';
    let overlay = slide.querySelector('[data-r5-slide-overlay]');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.setAttribute('data-r5-slide-overlay', '1');
      overlay.style.cssText = 'position:absolute;inset:0;background:linear-gradient(180deg, rgba(38,21,12,0.45) 0%, rgba(38,21,12,0.05) 22%, transparent 40%);pointer-events:none;z-index:0;';
      slide.insertBefore(overlay, slide.firstChild);
    }
    let content = slide.querySelector('[data-r5-slide-content]');
    if (!content) {
      content = document.createElement('div');
      content.setAttribute('data-r5-slide-content', '1');
      content.style.cssText = 'position:relative;z-index:1;display:flex;flex-direction:column;height:100%;padding:10px 12px;';
      const movables = Array.from(slide.children).filter(c => c !== overlay);
      movables.forEach(c => content.appendChild(c));
      slide.appendChild(content);
    } else {
      content.style.padding = '10px 12px';
    }
    // Image mode: kicker tucked top-left in cream-on-shadow; body becomes notes.
    const kicker = content.querySelector('[data-r5-slide-kicker]');
    const body   = content.querySelector('[data-r5-slide-body]');
    const hint   = content.querySelector('[data-r5-slide-empty-hint]');
    if (kicker) {
      kicker.style.color = '#f0eadd';
      kicker.style.textShadow = '0 1px 3px rgba(0,0,0,0.65)';
      kicker.style.opacity = '0.95';
    }
    const isEmptyBody = body && body.dataset.r5SlideEmpty === '1';
    if (body) {
      body.style.display = 'none';
      // If still showing the placeholder text, clear it so notes start empty.
      if (isEmptyBody) body.textContent = '';
      body.dataset.r5SlideEmpty = '0';
    }
    if (hint) hint.style.display = 'none';
    // Show the Notes chip (always visible once image is set so user knows where notes live).
    let notesChip = slide.querySelector('[data-r5-slide-notes-chip]');
    if (notesChip) {
      notesChip.style.display = 'inline-flex';
      const noteText = (body && body.innerText.trim()) || '';
      const chipText = noteText.length > 0 ? 'Notes · ' + (noteText.split(/\s+/).filter(Boolean).length) : 'Notes';
      const textNodes = Array.from(notesChip.childNodes).filter(n => n.nodeType === 3);
      if (textNodes.length > 0) textNodes[textNodes.length - 1].textContent = chipText;
      else notesChip.appendChild(document.createTextNode(chipText));
    }
    // Show a Crop chip in the bottom-left of image-backed slides.
    let cropChip = slide.querySelector('[data-r5-slide-crop-chip]');
    if (!cropChip) {
      cropChip = document.createElement('span');
      cropChip.setAttribute('data-r5-action', 'crop-slide');
      cropChip.setAttribute('data-r5-slide-crop-chip', '1');
      cropChip.style.cssText = 'position:absolute;bottom:8px;left:8px;z-index:2;display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(38,21,12,0.78);color:#f0eadd;border-radius:999px;font-family:var(--font-mono);font-size:8.5px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(4px);';
      cropChip.innerHTML = '<svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1 V9 H11 M1 3 H9 V11" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>Crop';
      slide.appendChild(cropChip);
    } else {
      cropChip.style.display = 'inline-flex';
    }
  }

  // Notes popover state
  const [slideNotes, setSlideNotes] = React.useState({ visible: false, x: 0, y: 0, slideEl: null });
  function openSlideNotes(slide) {
    if (!slide) return;
    const r = slide.getBoundingClientRect();
    setSlideNotes({ visible: true, x: r.right - 8, y: r.bottom + 6, slideEl: slide });
  }
  function closeSlideNotes() {
    setSlideNotes({ visible: false, x: 0, y: 0, slideEl: null });
  }

  // ── Drag-drop ──
  // Two flavors of drag are handled on the editable:
  //   1. File drop  → onto carousel slide / photo / video / carousel chrome
  //   2. Slide drag → reorder within a carousel (HTML5 native drag with custom MIME)
  const slideDragRef = React.useRef({ slide: null, embedId: null });

  function handleDragStart(e) {
    // Slide drag now starts only from the dotted handle widget, so a click on
    // the slide body still focuses for editing.
    const handle = e.target.closest && e.target.closest('[data-r5-slide-handle]');
    if (!handle) return;
    const slide = handle.closest('.r5-carousel-slide');
    if (!slide) return;
    const embed = slide.closest('.r5-embed-carousel');
    slideDragRef.current = { slide, embedId: embed && embed.dataset.r5EmbedId };
    try {
      e.dataTransfer.setData('application/x-r5-slide', '1');
      e.dataTransfer.effectAllowed = 'move';
    } catch (err) { /* ignore */ }
    slide.style.opacity = '0.4';
  }
  function handleDragEnd() {
    const slide = slideDragRef.current.slide;
    if (slide) slide.style.opacity = '';
    slideDragRef.current = { slide: null, embedId: null };
    document.querySelectorAll('.r5-drop-active').forEach(el => el.classList.remove('r5-drop-active'));
  }
  function isSlideDrag(e) {
    if (!e.dataTransfer || !e.dataTransfer.types) return false;
    return Array.from(e.dataTransfer.types).indexOf('application/x-r5-slide') >= 0 || !!slideDragRef.current.slide;
  }
  function hasFiles(e) {
    if (!e.dataTransfer || !e.dataTransfer.types) return false;
    return Array.from(e.dataTransfer.types).indexOf('Files') >= 0;
  }
  function handleDragOver(e) {
    if (!hasFiles(e) && !isSlideDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = isSlideDrag(e) ? 'move' : 'copy';
    const slide = e.target.closest && e.target.closest('.r5-carousel-slide');
    const photo = e.target.closest && e.target.closest('.r5-embed-photo');
    const video = e.target.closest && e.target.closest('.r5-embed-video');
    const carousel = e.target.closest && e.target.closest('.r5-embed-carousel');
    const target = slide || photo || video || carousel;
    document.querySelectorAll('.r5-drop-active').forEach(el => { if (el !== target) el.classList.remove('r5-drop-active'); });
    if (target && (isSlideDrag(e) ? target !== slideDragRef.current.slide : true)) target.classList.add('r5-drop-active');
  }
  function handleDragLeave(e) {
    if (e.currentTarget && (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget))) {
      document.querySelectorAll('.r5-drop-active').forEach(el => el.classList.remove('r5-drop-active'));
    }
  }
  function renumberSlides(carousel) {
    const slides = carousel.querySelectorAll('.r5-carousel-slide');
    slides.forEach((s, i) => {
      const n = i + 1;
      s.dataset.r5SlideN = String(n);
      const kicker = s.querySelector('[data-r5-slide-kicker]');
      if (kicker) {
        const txt = kicker.textContent || '';
        const tail = txt.split('·').slice(1).join('·').trim();
        kicker.textContent = n + ' · ' + (tail || 'NEW');
      }
    });
    const countEl = carousel.querySelector('[data-r5-carousel-count]');
    if (countEl) countEl.textContent = slides.length + ' slide' + (slides.length === 1 ? '' : 's') + ' · 4:5 · IG';
    rebuildScrubber(carousel);
  }

  // Rebuild the scrubber dots row to match the current slide count and
  // sync the active dot with the visible slide.
  function rebuildScrubber(carousel) {
    const scrub = carousel.querySelector('[data-r5-carousel-scrub]');
    const scroll = carousel.querySelector('[data-r5-carousel-slides]');
    if (!scrub || !scroll) return;
    const slides = carousel.querySelectorAll('.r5-carousel-slide');
    scrub.innerHTML = '';
    slides.forEach((slide, i) => {
      const dot = document.createElement('span');
      dot.setAttribute('data-r5-scrub-dot', String(i + 1));
      dot.style.cssText = 'width:18px;height:3px;background:var(--border-default);border-radius:2px;cursor:pointer;transition:background 120ms ease;';
      scrub.appendChild(dot);
    });
    syncScrubberActive(carousel);
  }
  function syncScrubberActive(carousel) {
    const scrub = carousel.querySelector('[data-r5-carousel-scrub]');
    const scroll = carousel.querySelector('[data-r5-carousel-slides]');
    if (!scrub || !scroll) return;
    const slides = carousel.querySelectorAll('.r5-carousel-slide');
    if (slides.length === 0) return;
    const slideWidth = slides[0].offsetWidth + 8;
    const center = scroll.scrollLeft + (scroll.clientWidth / 2);
    const activeIdx = Math.min(slides.length - 1, Math.max(0, Math.round(center / slideWidth - 0.5)));
    const dots = scrub.querySelectorAll('[data-r5-scrub-dot]');
    dots.forEach((d, i) => {
      d.style.background = i === activeIdx ? 'var(--accent-primary)' : 'var(--border-default)';
    });
  }
  // Click a scrubber dot to scroll its slide into view.
  function handleScrubClick(e) {
    const dot = e.target.closest && e.target.closest('[data-r5-scrub-dot]');
    if (!dot) return;
    const carousel = dot.closest('.r5-embed-carousel');
    if (!carousel) return;
    const idx = parseInt(dot.dataset.r5ScrubDot, 10) - 1;
    const slides = carousel.querySelectorAll('.r5-carousel-slide');
    if (slides[idx]) {
      slides[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setTimeout(() => syncScrubberActive(carousel), 300);
    }
  }
  // Watch each carousel's scroll position so dots reflect the current slide.
  React.useEffect(() => {
    const root = editableRef.current;
    if (!root) return;
    function onScroll(e) {
      const slides = e.target.closest && e.target.closest('[data-r5-carousel-slides]');
      if (!slides) return;
      const carousel = slides.closest('.r5-embed-carousel');
      if (carousel) syncScrubberActive(carousel);
    }
    root.addEventListener('scroll', onScroll, true);
    return () => root.removeEventListener('scroll', onScroll, true);
  }, []);

  // Crop mode pan-drag + wheel-zoom on the photo canvas. Runs only while
  // cropMode is active. Updates background-position and background-size live.
  React.useEffect(() => {
    if (!cropMode || !cropMode.canvasEl) return;
    const canvas = cropMode.canvasEl;
    let posX = cropMode.posX || 50;
    let posY = cropMode.posY || 50;
    let zoom = cropMode.zoom || 100;
    let panning = false;
    let startX = 0, startY = 0, startPosX = posX, startPosY = posY;

    function applyBg() {
      // Extract just the URL from current background to keep the image stable.
      const bg = canvas.style.background || '';
      const m = bg.match(/url\((['"]?)([^'")]+)\1\)/);
      const url = m ? m[2] : '';
      if (!url) return;
      canvas.style.background = `url("${url}") ${posX}% ${posY}% / ${zoom}% no-repeat #1a1815`;
      canvas.dataset.r5CropPos = posX + ',' + posY + ',' + zoom;
    }
    applyBg();

    function onPointerDown(e) {
      if (canvas.dataset.r5CropActive !== '1') return;
      panning = true;
      startX = e.clientX;
      startY = e.clientY;
      startPosX = posX;
      startPosY = posY;
      canvas.style.cursor = 'grabbing';
      try { canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    function onPointerMove(e) {
      if (!panning) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      // Bg-position % moves opposite to pointer when dragging. 100% pos shows right edge.
      posX = Math.max(0, Math.min(100, startPosX - (dx / w) * 100));
      posY = Math.max(0, Math.min(100, startPosY - (dy / h) * 100));
      applyBg();
    }
    function onPointerUp(e) {
      if (!panning) return;
      panning = false;
      canvas.style.cursor = 'grab';
      try { canvas.releasePointerCapture && canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    function onWheel(e) {
      if (canvas.dataset.r5CropActive !== '1') return;
      e.preventDefault();
      zoom = Math.max(100, Math.min(400, zoom - e.deltaY * 0.2));
      applyBg();
      if (zoomSliderRef.current) zoomSliderRef.current.value = String(zoom);
    }
    function onSliderInput(e) {
      zoom = Number(e.target.value);
      applyBg();
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    const slider = zoomSliderRef.current;
    if (slider) slider.addEventListener('input', onSliderInput);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      if (slider) slider.removeEventListener('input', onSliderInput);
    };
  }, [cropMode]);

  const zoomSliderRef = React.useRef(null);
  function handleDrop(e) {
    // Slide-reorder path: dropping a slide onto another slide swaps positions.
    if (isSlideDrag(e)) {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.r5-drop-active').forEach(el => el.classList.remove('r5-drop-active'));
      const src = slideDragRef.current.slide;
      const targetSlide = e.target.closest && e.target.closest('.r5-carousel-slide');
      if (!src || !targetSlide || src === targetSlide) {
        if (src) src.style.opacity = '';
        slideDragRef.current = { slide: null, embedId: null };
        return;
      }
      const carousel = targetSlide.closest('.r5-embed-carousel');
      const slidesEl = carousel && carousel.querySelector('[data-r5-carousel-slides]');
      if (!slidesEl) return;
      // Insert src before or after target depending on cursor x within target.
      const r = targetSlide.getBoundingClientRect();
      const after = (e.clientX - r.left) > (r.width / 2);
      if (after && targetSlide.nextSibling) slidesEl.insertBefore(src, targetSlide.nextSibling);
      else if (after) slidesEl.appendChild(src);
      else slidesEl.insertBefore(src, targetSlide);
      src.style.opacity = '';
      renumberSlides(carousel);
      slideDragRef.current = { slide: null, embedId: null };
      fireSave();
      pushToast('Slide reordered');
      return;
    }
    if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll('.r5-drop-active').forEach(el => el.classList.remove('r5-drop-active'));

    const files = Array.from(e.dataTransfer.files);
    const slide    = e.target.closest && e.target.closest('.r5-carousel-slide');
    const photo    = e.target.closest && e.target.closest('.r5-embed-photo');
    const video    = e.target.closest && e.target.closest('.r5-embed-video');
    const carousel = e.target.closest && e.target.closest('.r5-embed-carousel');

    function readImage(file, cb) { const r = new FileReader(); r.onload = () => cb(r.result, file); r.readAsDataURL(file); }

    if (slide) {
      const carouselEl = slide.closest('.r5-embed-carousel');
      const slidesEl = carouselEl && carouselEl.querySelector('[data-r5-carousel-slides]');
      const countEl = carouselEl && carouselEl.querySelector('[data-r5-carousel-count]');
      files.forEach((file, i) => {
        if (!file.type.startsWith('image/')) return;
        readImage(file, (dataUrl) => {
          if (i === 0) {
            applyImageToSlide(slide, dataUrl);
          } else if (slidesEl) {
            const next = slidesEl.children.length + 1;
            const div = document.createElement('div');
            div.innerHTML = R5B_CAROUSEL_SLIDE_HTML(String(next), 'IMG', 'Type a caption…', true);
            const newSlide = div.firstChild;
            slidesEl.appendChild(newSlide);
            applyImageToSlide(newSlide, dataUrl);
            if (countEl) countEl.textContent = next + ' slide' + (next === 1 ? '' : 's') + ' · 4:5 · IG';
          }
          fireSave();
        });
      });
      pushToast('Dropped ' + files.length + ' image' + (files.length === 1 ? '' : 's') + ' on slide');
      return;
    }
    if (photo) {
      const file = files.find(f => f.type.startsWith('image/'));
      if (file) {
        readImage(file, (dataUrl) => {
          applyImageToPhotoEmbed(photo, dataUrl);
          fireSave();
          pushToast('Photo replaced · ' + file.name);
        });
      } else {
        pushToast('Drop ignored · photo embed needs an image');
      }
      return;
    }
    if (video) {
      const file = files.find(f => f.type.startsWith('video/'));
      if (file) {
        readImage(file, (dataUrl) => {
          applyVideoToEmbed(video, dataUrl, file.name);
          fireSave();
          pushToast('Video uploaded · ' + file.name);
        });
      } else {
        pushToast('Drop ignored · video embed needs a video file');
      }
      return;
    }
    if (carousel) {
      const slidesEl = carousel.querySelector('[data-r5-carousel-slides]');
      const countEl = carousel.querySelector('[data-r5-carousel-count]');
      let added = 0;
      files.forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        added++;
        readImage(file, (dataUrl) => {
          if (!slidesEl) return;
          const next = slidesEl.children.length + 1;
          const div = document.createElement('div');
          div.innerHTML = R5B_CAROUSEL_SLIDE_HTML(String(next), 'IMG', 'Type a caption…', true);
          const newSlide = div.firstChild;
          slidesEl.appendChild(newSlide);
          applyImageToSlide(newSlide, dataUrl);
          if (countEl) countEl.textContent = next + ' slide' + (next === 1 ? '' : 's') + ' · 4:5 · IG';
          fireSave();
        });
      });
      pushToast(added + ' slide' + (added === 1 ? '' : 's') + ' added from drop');
      return;
    }
    pushToast('Drop ignored · drop on a slide, photo, or video embed');
  }

  function handleEmbedClick(e) {
    // Scrubber dot click handled separately (no data-r5-action).
    if (e.target.closest && e.target.closest('[data-r5-scrub-dot]')) {
      e.preventDefault();
      e.stopPropagation();
      handleScrubClick(e);
      return;
    }
    const action = e.target.closest('[data-r5-action]');
    if (!action) return;
    const verb = action.dataset.r5Action;
    const embed = action.closest('[data-r5-embed-id]');
    e.preventDefault();
    e.stopPropagation();

    // Photo upload — file picker (multiple) → data URL → background-image
    if (verb === 'upload-photo' || verb === 'replace-photo') {
      uploadFile('image/*', (dataUrl, file) => {
        if (embed) applyImageToPhotoEmbed(embed, dataUrl);
        fireSave();
        pushToast('Photo uploaded · ' + file.name);
      });
      return;
    }

    // Per-slide image upload (the "+ Image" chip on an empty slide).
    if (verb === 'upload-slide-image') {
      const slide = action.closest('.r5-carousel-slide');
      uploadFile('image/*', (dataUrl, file) => {
        if (slide) applyImageToSlide(slide, dataUrl);
        fireSave();
        pushToast('Image added to slide · ' + file.name);
      });
      return;
    }
    if (verb === 'open-slide-notes') {
      const slide = action.closest('.r5-carousel-slide');
      openSlideNotes(slide);
      return;
    }
    // Photo / slide crop mode (pan + zoom). Same logic for either target since
    // both use background:url(...) to render the image.
    if (verb === 'crop-photo' || verb === 'crop-slide') {
      let target = null;
      if (verb === 'crop-photo') {
        target = embed && embed.querySelector('[data-r5-photo-canvas]');
      } else {
        target = action.closest('.r5-carousel-slide');
      }
      if (!target) return;
      const bg = target.style.background || '';
      if (bg.indexOf('url(') < 0) {
        pushToast('Crop · upload an image first');
        return;
      }
      const original = { background: target.style.background, cursor: target.style.cursor };
      target.style.cursor = 'grab';
      target.dataset.r5CropActive = '1';
      setCropMode({ canvasEl: target, original, posX: 50, posY: 50, zoom: 100 });
      pushToast('Crop · drag to pan, slider to zoom');
      return;
    }
    if (verb === 'crop-apply') {
      // Apply persists current canvas style; just exit mode.
      if (cropMode && cropMode.canvasEl) {
        cropMode.canvasEl.style.cursor = '';
        delete cropMode.canvasEl.dataset.r5CropActive;
      }
      setCropMode(null);
      fireSave();
      pushToast('Crop applied');
      return;
    }
    if (verb === 'crop-cancel') {
      if (cropMode && cropMode.canvasEl && cropMode.original) {
        cropMode.canvasEl.style.background = cropMode.original.background || '';
        cropMode.canvasEl.style.cursor = cropMode.original.cursor || '';
        delete cropMode.canvasEl.dataset.r5CropActive;
      }
      setCropMode(null);
      pushToast('Crop cancelled');
      return;
    }
    // Carousel export
    if (verb === 'export-carousel') {
      if (!embed) return;
      const slidesEl = embed.querySelector('[data-r5-carousel-slides]');
      if (!slidesEl) return;
      const slides = Array.from(slidesEl.children).map(s => s.outerHTML);
      setExportCarousel({ slidesHtml: slides, count: slides.length });
      pushToast('Export · ' + slides.length + ' slides');
      return;
    }
    // Photo aspect ratio toggles
    if (verb === 'aspect-4-5' || verb === 'aspect-1-1' || verb === 'aspect-16-9' || verb === 'aspect-9-16') {
      if (!embed) return;
      const canvas = embed.querySelector('[data-r5-photo-canvas]');
      const map = { 'aspect-4-5': '4 / 5', 'aspect-1-1': '1 / 1', 'aspect-16-9': '16 / 9', 'aspect-9-16': '9 / 16' };
      if (canvas) canvas.style.aspectRatio = map[verb];
      // Update active chip styling
      const chips = embed.querySelectorAll('[data-r5-aspect-chip]');
      chips.forEach(c => {
        const active = c.dataset.r5Action === verb;
        c.style.background = active ? 'var(--fg-primary)' : 'transparent';
        c.style.color = active ? 'var(--surface-1)' : 'var(--fg-secondary)';
        c.style.borderColor = active ? 'var(--fg-primary)' : 'var(--border-default)';
      });
      fireSave();
      pushToast('Aspect · ' + map[verb]);
      return;
    }

    // Video upload — file picker → data URL → <video> element + duration
    if (verb === 'upload-video') {
      uploadFile('video/*', (dataUrl, file) => {
        if (embed) applyVideoToEmbed(embed, dataUrl, file.name);
        pushToast('Video uploaded · ' + file.name);
      });
      return;
    }

    // Carousel: load template
    if (verb === 'use-template-carousel') {
      const slides = embed && embed.querySelector('[data-r5-carousel-slides]');
      const count = embed && embed.querySelector('[data-r5-carousel-count]');
      if (slides) {
        slides.innerHTML = R5B_CAROUSEL_TEMPLATE_HTML();
        if (count) count.textContent = '5 slides · 4:5 · IG';
        rebuildScrubber(embed);
        fireSave();
        pushToast('Loaded carousel template · 5 slides');
      }
      return;
    }
    if (verb === 'add-slide') {
      const slides = embed && embed.querySelector('[data-r5-carousel-slides]');
      const count = embed && embed.querySelector('[data-r5-carousel-count]');
      if (slides) {
        const next = slides.children.length + 1;
        const div = document.createElement('div');
        div.innerHTML = R5B_CAROUSEL_SLIDE_HTML(String(next), 'NEW', 'Type slide content…', true);
        slides.appendChild(div.firstChild);
        if (count) count.textContent = next + ' slide' + (next === 1 ? '' : 's') + ' · 4:5 · IG';
        rebuildScrubber(embed);
        // Scroll the new slide into view.
        const newSlide = slides.lastElementChild;
        if (newSlide) newSlide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        fireSave();
        pushToast('Slide ' + next + ' added');
      }
      return;
    }

    // Thread: load template
    if (verb === 'use-template-thread') {
      const tweets = embed && embed.querySelector('[data-r5-thread-tweets]');
      const count = embed && embed.querySelector('[data-r5-thread-count]');
      if (tweets) {
        tweets.innerHTML = R5B_THREAD_TEMPLATE_HTML();
        if (count) count.textContent = '3 tweets · X/Threads';
        fireSave();
        pushToast('Loaded thread template · 3 tweets');
      }
      return;
    }
    if (verb === 'add-tweet') {
      const tweets = embed && embed.querySelector('[data-r5-thread-tweets]');
      const count = embed && embed.querySelector('[data-r5-thread-count]');
      if (tweets) {
        const next = tweets.children.length + 1;
        const div = document.createElement('div');
        div.innerHTML = R5B_TWEET_ROW_HTML(String(next), 'Type tweet ' + next + '…', true);
        tweets.appendChild(div.firstChild);
        if (count) count.textContent = next + ' tweet' + (next === 1 ? '' : 's') + ' · X/Threads';
        fireSave();
        pushToast('Tweet ' + next + ' added');
      }
      return;
    }

    // Hook test: load template + run animation
    if (verb === 'use-template-hook') {
      if (embed) {
        // Replace the two variant cards. Match by data-r5-hook-variant.
        const a = embed.querySelector('[data-r5-hook-variant="A"]');
        const b = embed.querySelector('[data-r5-hook-variant="B"]');
        if (a) a.outerHTML = R5B_HOOK_TEMPLATE_A();
        if (b) b.outerHTML = R5B_HOOK_TEMPLATE_B();
        const status = embed.querySelector('[data-r5-hook-status]');
        if (status) status.textContent = 'A vs B · scored';
        fireSave();
        pushToast('Loaded hook test template');
      }
      return;
    }
    if (verb === 'add-hook-variant') {
      const wrap = embed && embed.querySelector('[data-r5-hook-variants]');
      if (!wrap) return;
      const existing = wrap.querySelectorAll('[data-r5-hook-variant]').length;
      if (existing >= 5) {
        pushToast('Max 5 variants per hook test');
        return;
      }
      const letter = ['A','B','C','D','E'][existing];
      const div = document.createElement('div');
      div.innerHTML = '<div style="margin-top:8px;"></div>' + R5B_HOOK_VARIANT_HTML(letter, 'Type variant ' + letter + ' here…', '— % stop-rate', false, true);
      // Append both the spacer and the variant.
      Array.from(div.children).forEach(c => wrap.appendChild(c));
      // Update header status text.
      const status = embed.querySelector('[data-r5-hook-status]');
      if (status) {
        const letters = ['A','B','C','D','E'].slice(0, existing + 1).join(' vs ');
        status.textContent = letters + ' · ready to run';
      }
      fireSave();
      pushToast('Variant ' + letter + ' added');
      return;
    }
    if (verb === 'run-hook-test') {
      if (!embed) return;
      const status = embed.querySelector('[data-r5-hook-status]');
      const variants = embed.querySelectorAll('[data-r5-hook-variant]');
      const scores = embed.querySelectorAll('[data-r5-hook-score]');
      if (status) status.textContent = 'running…';
      scores.forEach(s => { s.style.color = 'var(--fg-tertiary)'; s.textContent = '— % stop-rate'; });
      // Remove any previous graph
      const oldGraph = embed.querySelector('[data-r5-hook-graph]');
      if (oldGraph) oldGraph.remove();
      setTimeout(() => {
        const results = Array.from(variants).map(v => ({ letter: v.dataset.r5HookVariant, pct: 45 + Math.floor(Math.random() * 40) }));
        const sorted = results.slice().sort((a, b) => b.pct - a.pct);
        const winner = sorted[0];
        results.forEach(r => {
          const scoreEl = embed.querySelector('[data-r5-hook-score="' + r.letter + '"]');
          if (scoreEl) {
            scoreEl.textContent = r.pct + '% stop-rate';
            scoreEl.style.color = r.letter === winner.letter ? 'var(--tone-success)' : 'var(--fg-tertiary)';
          }
        });
        const letters = Array.from(variants).map(v => v.dataset.r5HookVariant).join(' vs ');
        const margin = winner.pct - (sorted[1] ? sorted[1].pct : 0);
        if (status) status.textContent = letters + ' · ' + winner.letter + ' wins · ' + margin + 'pp';
        // Render the results bar chart at the end of the embed
        const wrap = embed.querySelector('[data-r5-hook-variants]');
        if (wrap) {
          const max = Math.max.apply(null, results.map(r => r.pct));
          const bars = results.map(r => {
            const isWin = r.letter === winner.letter;
            const widthPct = Math.max(4, (r.pct / 100) * 100);
            return (
              '<div style="display:grid;grid-template-columns:18px 1fr 70px;gap:10px;align-items:center;padding:6px 0;">' +
                '<span style="font-family:var(--font-mono);font-size:10px;font-weight:700;color:' + (isWin ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)') + ';letter-spacing:0.06em;">' + r.letter + '</span>' +
                '<div style="height:8px;background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:4px;overflow:hidden;">' +
                  '<div style="width:0%;height:100%;background:' + (isWin ? 'var(--accent-primary)' : 'var(--border-default)') + ';transition:width 600ms cubic-bezier(0.16, 1, 0.3, 1) ' + (results.indexOf(r) * 80) + 'ms;" data-r5-hook-bar="' + r.letter + '" data-target="' + widthPct + '"></div>' +
                '</div>' +
                '<span style="font-family:var(--font-mono);font-size:9.5px;color:' + (isWin ? 'var(--tone-success)' : 'var(--fg-tertiary)') + ';font-weight:600;text-align:right;font-variant-numeric:tabular-nums;">' + r.pct + '%</span>' +
              '</div>'
            );
          }).join('');
          const graph = document.createElement('div');
          graph.setAttribute('data-r5-hook-graph', '1');
          graph.style.cssText = 'margin-top:14px;padding:12px 14px;background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:5px;';
          graph.innerHTML =
            '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px;">' +
              '<span style="font-family:var(--font-sans);font-size:8.5px;font-weight:700;color:var(--fg-tertiary);letter-spacing:0.12em;text-transform:uppercase;">Stop-rate · scored ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</span>' +
              '<span style="flex:1;"></span>' +
              '<span style="font-family:var(--font-mono);font-size:9px;color:var(--accent-primary-press);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">' + winner.letter + ' wins · ' + margin + 'pp</span>' +
            '</div>' +
            bars;
          wrap.appendChild(graph);
          // Animate the bars from 0% to target.
          requestAnimationFrame(() => {
            graph.querySelectorAll('[data-r5-hook-bar]').forEach((bar) => {
              bar.style.width = bar.dataset.target + '%';
            });
          });
        }
        pushToast('Hook test scored · ' + winner.letter + ' wins ' + margin + 'pp');
        fireSave();
      }, 900);
      return;
    }

    // Everything else: toast (Phase-2 wiring).
    pushToast('Embed · ' + verb.replace(/-/g, ' '));
  }

  function handleKeyDown(e) {
    // Format keyboard shortcuts (Cmd/Ctrl + key) — fully swallowed so global ⌘K
    // and ⌘B handlers (master search, browser bookmarks bar) don't also fire.
    const meta = e.metaKey || e.ctrlKey;
    function swallow() {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
    }
    if (meta && !e.shiftKey && !e.altKey) {
      if (e.key === 'b' || e.key === 'B') { swallow(); applyCmd('bold');          return; }
      if (e.key === 'i' || e.key === 'I') { swallow(); applyCmd('italic');        return; }
      if (e.key === 'u' || e.key === 'U') { swallow(); applyCmd('underline');     return; }
      if (e.key === 'k' || e.key === 'K') { swallow(); openLinkInput();           return; }
      if (e.key === 'z' || e.key === 'Z') { swallow(); applyCmd('undo');          return; }
      if (e.key === 'o' || e.key === 'O') { swallow(); setQuickOpen(true);        return; }
    }
    if (meta && e.shiftKey && !e.altKey) {
      if (e.key === 'S' || e.key === 's' || e.key === 'X' || e.key === 'x') { swallow(); applyCmd('strikeThrough'); return; }
      if (e.key === 'Z' || e.key === 'z') { swallow(); applyCmd('redo'); return; }
      if (e.key === '8') { swallow(); applyCmd('insertUnorderedList'); return; }
      if (e.key === '7') { swallow(); applyCmd('insertOrderedList');  return; }
      if (e.key === '.') { swallow(); applyCmd('formatBlock', '<blockquote>'); return; }
      if (e.key === 'M' || e.key === 'm') { swallow(); openCommentInput(); return; }
    }
    if (meta && e.altKey && !e.shiftKey) {
      if (e.key === '1' || e.code === 'Digit1') { swallow(); applyCmd('formatBlock', '<h2>'); return; }
      if (e.key === '2' || e.code === 'Digit2') { swallow(); applyCmd('formatBlock', '<h3>'); return; }
      if (e.key === '3' || e.code === 'Digit3') { swallow(); applyCmd('formatBlock', '<h4>'); return; }
      if (e.key === '0' || e.code === 'Digit0') { swallow(); applyCmd('formatBlock', '<p>');  return; }
    }

    // Markdown-style triggers — fire when space lands after #/##/###/>/-/1.
    if (!slashOpen && tryMarkdownTrigger(e)) return;

    // Slash-popover mode — capture nav + filter keys
    if (slashOpen) {
      const f = (slashFilter || '').toLowerCase();
      const filtered = f
        ? R5B_SLASH_VERBS.filter(v => v.label.toLowerCase().includes(f) || (v.desc && v.desc.toLowerCase().includes(f)) || (v.category && v.category.toLowerCase().includes(f)))
        : R5B_SLASH_VERBS;
      if (e.key === 'Escape') {
        closeSlash();
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowDown') {
        setSlashSelected(i => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowUp') {
        setSlashSelected(i => Math.max(i - 1, 0));
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter') {
        if (filtered[slashSelected]) {
          pickVerb(filtered[slashSelected]);
        }
        e.preventDefault();
        return;
      }
      if (e.key === 'Backspace') {
        if (slashFilter.length === 0) {
          closeSlash();
          return;
        }
        setSlashFilter(prev => prev.slice(0, -1));
        setSlashSelected(0);
        return;
      }
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setSlashFilter(prev => prev + e.key);
        setSlashSelected(0);
        return;
      }
      return;
    }

    // Tab-to-accept on the opening suggestion
    if (e.key === 'Tab' && !openingAccepted) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        let n = sel.getRangeAt(0).startContainer;
        while (n && n.nodeType === 3) n = n.parentElement;
        let inOpening = false;
        while (n) {
          if (n.dataset && n.dataset.openingAccept === '1') { inOpening = true; break; }
          n = n.parentElement;
        }
        if (inOpening) {
          e.preventDefault();
          if (openingParaRef.current) {
            openingParaRef.current.innerText = R5B_OPENING_TIGHTENED;
          }
          setOpeningAccepted(true);
          pushToast('Accepted · tightened opening line');
          return;
        }
      }
    }

    // Slash trigger — capture caret position BEFORE the / lands
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        slashRangeRef.current = { node: range.startContainer, offset: range.startOffset + 1 };
      }
      // Defer popover open until after the / has been inserted
      requestAnimationFrame(() => {
        openSlashAtCaret();
      });
      // do not preventDefault — let the slash actually land in the doc; we'll delete it on accept
    }
  }

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (slashOpen && !e.target.closest('[data-slash-popover]')) closeSlash();
      }}
      style={{ position: 'relative', flex: 1, minWidth: 0, overflow: 'auto', background: 'var(--surface-1)' }}
    >
      <style>{`
        @keyframes hf-doc-state-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.82); } }
        .r5-edit { caret-color: var(--accent-primary); }
        .r5-edit:focus { outline: none; }
        .r5-edit ::selection { background: var(--accent-soft); color: var(--fg-primary); }
        .r5-edit-block { position: relative; border-radius: 3px; padding: 2px 4px; margin-left: -4px; }
        .r5-edit-block:hover { background: rgba(38,21,12,0.025); }
        .r5-edit-block:focus-within { background: rgba(182,83,43,0.05); }
        .r5-edit h2 { font-family: var(--font-serif); font-size: 32px; font-weight: 500; margin: 28px 0 8px; letter-spacing: -0.012em; line-height: 1.15; color: var(--fg-primary); }
        .r5-edit h3 { font-family: var(--font-serif); font-size: 22px; font-weight: 500; margin: 22px 0 6px; letter-spacing: -0.005em; line-height: 1.2; color: var(--fg-primary); }
        .r5-edit h4 { font-family: var(--font-serif); font-style: italic; font-size: 17px; font-weight: 500; margin: 18px 0 4px; color: var(--fg-primary); }
        .r5-edit blockquote { margin: 14px 0; padding: 4px 0 4px 16px; border-left: 2px solid var(--accent-primary); font-family: var(--font-serif); font-style: italic; font-size: 16px; color: var(--fg-secondary); }
        .r5-edit ul, .r5-edit ol { margin: 8px 0 8px 0; padding-left: 28px; }
        .r5-edit li { font-family: var(--font-sans); font-size: 15px; line-height: 1.65; color: var(--fg-primary); margin-bottom: 4px; }
        .r5-edit a { color: var(--accent-primary-press); text-decoration: underline; text-underline-offset: 2px; }
        .r5-drop-active { outline: 2px solid var(--accent-primary) !important; outline-offset: -2px; box-shadow: 0 0 0 4px var(--accent-soft); transition: box-shadow 80ms ease; }
        .r5-carousel-slide { transition: outline 100ms ease, box-shadow 100ms ease; }
        .r5-carousel-scroll::-webkit-scrollbar { height: 7px; }
        .r5-carousel-scroll::-webkit-scrollbar-track { background: transparent; border-radius: 4px; }
        .r5-carousel-scroll::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 4px; }
        .r5-carousel-scroll::-webkit-scrollbar-thumb:hover { background: var(--fg-tertiary); }
      `}</style>

      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onClick={handleEmbedClick}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="r5-edit"
        style={{
          maxWidth: focusMode ? 720 : 760,
          margin: '0 auto',
          padding: focusMode ? '64px 32px 120px' : '56px 60px 120px',
          outline: 'none',
        }}
      >

        <R5_DocHeader
          eyebrow={docMeta.eyebrow}
          states={R5B_STATES}
          activeStateId={stateId}
          onCycleState={cycleState}
          title={docMeta.title}
          italicTail={docMeta.italicTail}
          meta={[
            ['Status',  (docMeta.status || 'drafting') + (docMeta.statusVersion ? ' · ' + docMeta.statusVersion : '')],
            ['Format',  docMeta.channel || '11-min YT'],
            ['Channel', (docMeta.channel || 'YouTube').split('·')[0].trim()],
            ['Target',  docMeta.target_when || 'Tue 6:30 PM'],
          ]}
          versions={isTruk ? R5B_VERSIONS_HEADER : [{ id: 'v1', when: 'current', current: true, delta: null }]}
          onPickVersion={(id) => setDiffOverlay({ fromId: id, toId: 'v3' })}
          presence={docMeta.agent ? { name: docMeta.agent.name, when: docMeta.agent.when, activity: docMeta.agent.body } : null}
        />

        {!focusMode && (
          <R5_FormatStrip
            onCmd={applyCmd}
            onInsert={(handleEl) => openSlashFromHandle({ currentTarget: handleEl })}
          />
        )}

        {!isTruk && (
          <div className="r5-edit-block" style={{ marginTop: 12, position: 'relative', minHeight: 180 }}>
            <p style={{ margin: 0, fontFamily: R5B.serif, fontStyle: 'italic', fontSize: 18, color: 'var(--fg-tertiary)', lineHeight: 1.6 }}>
              Start writing. Press <span style={{ fontFamily: R5B.mono, fontSize: 12, color: 'var(--accent-primary-press)', fontStyle: 'normal', fontWeight: 700 }}>/</span> for blocks, <span style={{ fontFamily: R5B.mono, fontSize: 12, color: 'var(--accent-primary-press)', fontStyle: 'normal', fontWeight: 700 }}>⌘O</span> to switch docs, or just type.
            </p>
            <p style={{ margin: '24px 0 0', minHeight: 24 }}><br /></p>
            <p style={{ margin: '12px 0 0', minHeight: 24 }}><br /></p>
            <p style={{ margin: '12px 0 0', minHeight: 24 }}><br /></p>
          </div>
        )}

        {isTruk && <>
        {/* Section 01 — Opening with selection-anchored thread + tab-to-accept suggestion */}
        <section id="sec-01" style={{ position: 'relative', marginBottom: 40 }}>
          <R5_DocSectionHandle n="01" label="Opening" status="1 line · v3" />
          <div className="r5-edit-block" style={{ position: 'relative' }}>
            <R5_DocBlockHandle onSlash={openSlashFromHandle} onMenu={openBlockMenu} />
            <p style={{ margin: 0, fontFamily: R5B.sans, fontSize: 15.5, color: 'var(--fg-primary)', lineHeight: 1.65 }}>
              Filmed Apr 19 in Truk Lagoon. Eight-breath rule the whole dive — descend, hover, exhale, count. Pinged{' '}
              <R5_MentionChip name="mara" onOpen={(n) => pushToast('Open mention · ' + n)} />{' '}
              on the second-camera framing and{' '}
              <R5_MentionChip name="alex" onOpen={(n) => pushToast('Open mention · ' + n)} />{' '}
              on the safety-stop overlay. Writing this episode to feel like the{' '}
              <span style={{ background: 'rgba(182,83,43,0.14)', padding: '0 2px' }}>rhythm of the dive, not narrate it</span>.
            </p>
            {!focusMode && comments.filter(c => c.sectionId === 'sec-01').map(c => (
              <R5_SelectionThread
                key={c.id}
                author={c.author}
                name={c.name}
                body={c.body}
                when={c.when}
                threadId={c.id}
                anchorTop={c.anchorTop}
                onReply={(id) => pushToast('Reply to comment · ' + id)}
              />
            ))}
          </div>
          <div className="r5-edit-block" style={{ marginTop: 18, position: 'relative' }} data-opening-accept="1">
            <R5_DocParaWithSuggestion
              paraId="01-opening-line"
              suggestion={openingAccepted ? 'Accepted · 14 words' : 'Tighten this — 3 ideas · ⇥ accept'}
              onOpen={(id) => {
                if (openingAccepted) { pushToast('See alternates · ' + id); return; }
                if (openingParaRef.current) openingParaRef.current.innerText = R5B_OPENING_TIGHTENED;
                setOpeningAccepted(true);
                pushToast('Accepted · tightened opening line');
              }}
            >
              <p
                ref={openingParaRef}
                style={{
                  margin: 0,
                  fontFamily: R5B.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.7,
                  background: openingAccepted ? 'transparent' : 'rgba(182,83,43,0.08)',
                  borderRadius: 2, padding: '0 2px',
                  transition: 'background 200ms ease',
                }}
              >
                I dropped onto the deck of the Fujikawa Maru at 95 feet, and counted my breaths to eight before I moved.
              </p>
            </R5_DocParaWithSuggestion>
          </div>
          <div className="r5-edit-block" style={{ marginTop: 14 }}>
            <R5_AgentRewrite
              before="Eighty-one years ago this hold held bombs. Today it holds the soft coral and a turtle that doesn't know any of that."
              after="Eighty-one years ago this hold held bombs. Today it holds soft coral and a turtle that doesn't know any of that."
              tag="Tightened by Coopr · -3 words"
              when="just now"
            />
          </div>
          <p style={{ margin: '20px 0 0', minHeight: 24, fontFamily: R5B.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.65 }}><br /></p>
        </section>

        {/* Section 02 — Script with one rewrite + one wired keep/revert edit mark */}
        <section id="sec-02" style={{ position: 'relative', marginBottom: 40 }}>
          <R5_DocSectionHandle n="02" label="Script" status="11 min · 5 beats · 1 rewrite" />
          <div className="r5-edit-block" style={{ position: 'relative' }}>
            <R5_DocBlockHandle onSlash={openSlashFromHandle} onMenu={openBlockMenu} />
            <R5_DocBeat time="0:00–0:08" kind="HOOK">
              <p style={{ margin: 0, fontFamily: R5B.serif, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.6 }}>I dropped onto the deck of the Fujikawa Maru at 95 feet, and counted my breaths to eight before I moved.</p>
            </R5_DocBeat>
            <R5_DocBeat time="0:08–0:42" kind="SETUP">
              <p style={{ margin: 0, fontFamily: R5B.serif, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
                There's a thing wreck divers do that I never explain on camera, and it's the reason I'm still diving wrecks at 38.
              </p>
              <R5_AgentRewrite
                before="There's a thing wreck divers do that I never explain on camera, and it's the reason I'm still diving wrecks at 38."
                after="There's something wreck divers do that I've never said out loud — it's why I'm still doing this at 38."
                tag="Tightened by Coopr · -7 words"
                when="14m ago"
              />
            </R5_DocBeat>
            <R5_DocBeat time="0:42–4:10" kind="BODY">
              <p style={{ margin: 0, fontFamily: R5B.serif, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
                You stop. You count.{' '}
                <R5_AgentEditMark
                  status={editStatus['02-beat3-dilating'] || 'pending'}
                  editedText="You let your eyes finish dilating"
                  originalText="You let your eyes adjust"
                  editId="02-beat3-dilating"
                  tag="Edited by Coopr"
                  when="2h ago"
                  onKeep={(id) => { setEditStatus(s => ({ ...s, [id]: 'kept' })); pushToast('Kept edit · ' + id); }}
                  onRevert={(id) => { setEditStatus(s => ({ ...s, [id]: 'reverted' })); pushToast('Reverted edit · ' + id); }}
                />. You let the silt settle.
              </p>
            </R5_DocBeat>
            <span onClick={(e) => { e.stopPropagation(); pushToast('Expand script · 2 more beats'); }} style={{ display: 'inline-block', marginTop: 12, cursor: 'pointer' }}>
              <R5B_MM s={11}>+ 2 more beats · click to expand</R5B_MM>
            </span>
          </div>
          <p style={{ margin: '20px 0 0', minHeight: 24, fontFamily: R5B.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.65 }}><br /></p>
        </section>

        {/* Section 03 — Shot list with wired keep/drop on agent-added rows */}
        <section id="sec-03" style={{ position: 'relative', marginBottom: 40 }}>
          <R5_DocSectionHandle n="03" label="Shot list" status="14 shots · 6 keepers · 2 added by Coopr" />
          <div className="r5-edit-block" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <R5_DocBlockHandle onSlash={openSlashFromHandle} onMenu={openBlockMenu} />
            {R5B_SHOTS.map(([n, label, time], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 50px', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                <R5B_MM s={10.5} c="var(--accent-primary)">{n}</R5B_MM>
                <span style={{ fontFamily: R5B.sans, fontSize: 13.5, color: 'var(--fg-primary)' }}>{label}</span>
                <R5B_MM s={9.5} c="var(--fg-tertiary)" st={{ textAlign: 'right' }}>{time}</R5B_MM>
                <R5B_MM s={9} c="var(--tone-success)" st={{ textAlign: 'right', fontWeight: 600, letterSpacing: '0.08em' }}>keep</R5B_MM>
              </div>
            ))}

            {addedShots !== 'dropped' && (
              <>
                <R5_AgentAddedRow>
                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px', gap: 12, alignItems: 'center', flex: 1 }}>
                    <R5B_MM s={10.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>05</R5B_MM>
                    <span style={{ fontFamily: R5B.sans, fontSize: 13.5, color: 'var(--accent-primary-press)' }}>Detail — turtle drifting through hold three</span>
                    <R5B_MM s={9.5} c="var(--accent-primary-press)" st={{ textAlign: 'right' }}>4:40–5:10</R5B_MM>
                  </div>
                  <R5B_MM s={9} c={addedShots === 'kept' ? 'var(--tone-success)' : 'var(--accent-primary-press)'} st={{ fontWeight: 600, letterSpacing: '0.08em' }}>{addedShots === 'kept' ? 'KEPT' : 'NEW'}</R5B_MM>
                </R5_AgentAddedRow>
                <R5_AgentAddedRow>
                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px', gap: 12, alignItems: 'center', flex: 1 }}>
                    <R5B_MM s={10.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>06</R5B_MM>
                    <span style={{ fontFamily: R5B.sans, fontSize: 13.5, color: 'var(--accent-primary-press)' }}>Wide silhouette — exit at safety stop · backlight</span>
                    <R5B_MM s={9.5} c="var(--accent-primary-press)" st={{ textAlign: 'right' }}>9:40–10:00</R5B_MM>
                  </div>
                  <R5B_MM s={9} c={addedShots === 'kept' ? 'var(--tone-success)' : 'var(--accent-primary-press)'} st={{ fontWeight: 600, letterSpacing: '0.08em' }}>{addedShots === 'kept' ? 'KEPT' : 'NEW'}</R5B_MM>
                </R5_AgentAddedRow>
              </>
            )}

            {addedShots === 'pending' && (
              <div contentEditable={false} style={{ marginTop: 8, padding: '6px 4px', display: 'flex', alignItems: 'center', gap: 8, userSelect: 'none' }}>
                <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }} aria-hidden="true"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" /></svg>
                <R5B_MM s={9.5} c="var(--accent-primary)" st={{ fontWeight: 600 }}>Coopr added 2 shots from your transcript · 12m ago</R5B_MM>
                <span style={{ flex: 1 }} />
                <span onClick={(e) => { e.stopPropagation(); setAddedShots('kept'); pushToast('Kept · 2 Coopr-added shots'); }} style={{ padding: '3px 10px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Keep both</span>
                <span onClick={(e) => { e.stopPropagation(); setAddedShots('dropped'); pushToast('Dropped · 2 Coopr-added shots'); }} style={{ padding: '3px 10px', background: 'transparent', color: 'var(--fg-secondary)', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Drop</span>
              </div>
            )}
            {addedShots !== 'pending' && (
              <div contentEditable={false} style={{ marginTop: 8, padding: '6px 4px', display: 'flex', alignItems: 'center', gap: 8, userSelect: 'none' }}>
                <R5B_MM s={9.5} c={addedShots === 'kept' ? 'var(--tone-success)' : 'var(--fg-tertiary)'} st={{ fontWeight: 600 }}>
                  {addedShots === 'kept' ? '2 Coopr-added shots — kept' : '2 Coopr-added shots — dropped'}
                </R5B_MM>
                <span style={{ flex: 1 }} />
                <span onClick={(e) => { e.stopPropagation(); setAddedShots('pending'); }} style={{ padding: '3px 10px', background: 'transparent', color: 'var(--fg-secondary)', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Undo</span>
              </div>
            )}

            <span onClick={(e) => { e.stopPropagation(); pushToast('Expand shot list · 10 more shots'); }} style={{ display: 'inline-block', marginTop: 10, cursor: 'pointer' }}>
              <R5B_MM s={11}>+ 10 more shots</R5B_MM>
            </span>
          </div>
          <p style={{ margin: '20px 0 0', minHeight: 24, fontFamily: R5B.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.65 }}><br /></p>
        </section>

        {/* Section 04 — Prep checklist */}
        <section id="sec-04" style={{ position: 'relative', marginBottom: 40 }}>
          <R5_DocSectionHandle n="04" label="Prep" status="5 of 8 done · 1 Coopr can do" />
          <div className="r5-edit-block" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 28px' }}>
            <R5_DocBlockHandle onSlash={openSlashFromHandle} onMenu={openBlockMenu} />
            {R5B_PREP.map(([label, done, agent], i) => (
              <R5_DocPrepRow key={i} label={label} done={done} agent={agent} onAgentClick={(l) => pushToast('Coopr drafting · ' + l)} />
            ))}
          </div>
          <p style={{ margin: '20px 0 0', minHeight: 24, fontFamily: R5B.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.65 }}><br /></p>
        </section>

        <R5_DocAddSection onClick={() => pushToast('Open new-section menu')} />
        </>}

        <p style={{ margin: '24px 0 0', minHeight: 24, fontFamily: R5B.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.65 }}><br /></p>
      </div>

      <div data-slash-popover>
        <R5_SlashPopover
          open={slashOpen}
          x={slashAnchor.x}
          y={slashAnchor.y}
          verbs={R5B_SLASH_VERBS}
          filter={slashFilter}
          selected={slashSelected}
          onPick={pickVerb}
        />
      </div>

      <R5_FormatToolbar
        visible={tb.visible && !slashOpen && !linkInput.visible && !commentInput.visible}
        x={tb.x}
        y={tb.y}
        onCmd={applyCmd}
        onLink={openLinkInput}
        onComment={openCommentInput}
      />

      {commentInput.visible && (
        <div
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            left: commentInput.x, top: commentInput.y,
            transform: 'translate(-50%, -100%)',
            display: 'flex', flexDirection: 'column', gap: 8,
            width: 280, padding: '12px 14px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            boxShadow: '0 8px 22px rgba(38,21,12,0.18)',
            zIndex: 8,
          }}
        >
          <R5B_ML s={9}>Comment</R5B_ML>
          <textarea
            autoFocus
            value={commentInput.value}
            placeholder="leave a note on this selection…"
            rows={3}
            onChange={(e) => setCommentInput(c => ({ ...c, value: e.target.value }))}
            onKeyDown={(e) => {
              e.stopPropagation();
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                submitComment(commentInput.value);
              } else if (e.key === 'Escape') {
                setCommentInput({ visible: false, x: 0, y: 0, value: '', anchorTop: 0 });
              }
            }}
            style={{
              padding: '8px 10px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 4,
              outline: 'none',
              resize: 'none',
              fontFamily: R5B.serif, fontSize: 13, fontStyle: 'italic', color: 'var(--fg-primary)',
              background: 'var(--surface-1)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <R5B_MM s={9}>⌘↵ submit · esc cancel</R5B_MM>
            <span style={{ flex: 1 }} />
            <span
              onClick={() => setCommentInput({ visible: false, x: 0, y: 0, value: '', anchorTop: 0 })}
              style={{ padding: '4px 10px', color: 'var(--fg-secondary)', fontFamily: R5B.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
            >Cancel</span>
            <span
              onClick={() => submitComment(commentInput.value)}
              style={{ padding: '4px 12px', background: 'var(--fg-primary)', color: 'var(--surface-1)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
            >Add</span>
          </div>
        </div>
      )}

      <R5_DiffOverlay
        open={!!diffOverlay}
        fromId={diffOverlay ? diffOverlay.fromId : null}
        toId={diffOverlay ? diffOverlay.toId : 'v3'}
        onClose={() => setDiffOverlay(null)}
        onRestore={(id) => pushToast('Restored · ' + id)}
      />

      <R5_BlockContextMenu
        open={blockMenu.visible}
        x={blockMenu.x}
        y={blockMenu.y}
        onAction={applyBlockMenu}
        onClose={() => setBlockMenu({ visible: false, x: 0, y: 0, blockEl: null })}
      />

      {slideNotes.visible && slideNotes.slideEl && (() => {
        const body = slideNotes.slideEl.querySelector('[data-r5-slide-body]');
        const initial = body ? body.innerText : '';
        return (
          <div
            contentEditable={false}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: slideNotes.x, top: slideNotes.y,
              transform: 'translate(-100%, 0)',
              width: 280, padding: '12px 14px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
              borderRadius: 6,
              boxShadow: '0 8px 22px rgba(38,21,12,0.18)',
              zIndex: 9,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <R5B_ML s={9}>Slide notes</R5B_ML>
              <span style={{ flex: 1 }} />
              <span
                onClick={closeSlideNotes}
                style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-tertiary)', cursor: 'pointer', borderRadius: 3 }}
              >
                <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.4" /></svg>
              </span>
            </div>
            <textarea
              autoFocus
              defaultValue={initial}
              placeholder="Notes for this slide — plans, alts, credits…"
              rows={5}
              onChange={(e) => {
                if (body) body.innerText = e.target.value;
                // Refresh chip count
                const chip = slideNotes.slideEl.querySelector('[data-r5-slide-notes-chip]');
                if (chip) {
                  const w = (e.target.value.trim().split(/\s+/).filter(Boolean).length);
                  const txt = w > 0 ? 'Notes · ' + w : 'Notes';
                  const textNodes = Array.from(chip.childNodes).filter(n => n.nodeType === 3);
                  if (textNodes.length > 0) textNodes[textNodes.length - 1].textContent = txt;
                }
                fireSave();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Escape') closeSlideNotes();
              }}
              style={{
                padding: '8px 10px',
                border: '1px solid var(--border-subtle)',
                borderRadius: 4,
                outline: 'none',
                resize: 'vertical',
                fontFamily: R5B.serif, fontSize: 13, fontStyle: 'italic', color: 'var(--fg-primary)',
                background: 'var(--surface-1)',
                minHeight: 80,
              }}
            />
            <R5B_MM s={9}>esc close · saved automatically</R5B_MM>
          </div>
        );
      })()}

      <R5_DocQuickSwitcher
        open={quickOpen}
        docs={window.R5H_DOCS || []}
        onOpenDoc={(id) => { onOpenDoc(id); setQuickOpen(false); }}
        onClose={() => setQuickOpen(false)}
      />

      {cropMode && cropMode.canvasEl && (() => {
        const r = cropMode.canvasEl.getBoundingClientRect();
        return (
          <div
            contentEditable={false}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: r.left + r.width / 2, top: r.bottom + 10,
              transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px',
              background: 'var(--fg-primary)',
              color: 'var(--surface-1)',
              borderRadius: 999,
              boxShadow: '0 8px 22px rgba(38,21,12,0.28)',
              zIndex: 12,
              fontFamily: R5B.mono, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.06em',
            }}
          >
            <span style={{ textTransform: 'uppercase' }}>Zoom</span>
            <input
              ref={zoomSliderRef}
              type="range"
              min={100}
              max={400}
              defaultValue={100}
              style={{ width: 140, accentColor: 'var(--accent-primary)' }}
            />
            <span data-r5-action="crop-cancel" style={{ padding: '4px 10px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cancel</span>
            <span data-r5-action="crop-apply" style={{ padding: '4px 12px', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderRadius: 999, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Apply</span>
          </div>
        );
      })()}

      {exportCarousel && (
        <div
          contentEditable={false}
          onClick={() => setExportCarousel(null)}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(38,21,12,0.42)',
            zIndex: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(960px, 100%)', maxHeight: '90vh',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)',
              borderRadius: 6,
              boxShadow: '0 20px 60px rgba(38,21,12,0.28)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <header style={{ padding: '14px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <R5B_ML s={9.5}>Export carousel</R5B_ML>
              <R5B_MM s={11} c="var(--fg-secondary)">{exportCarousel.count} slide{exportCarousel.count === 1 ? '' : 's'} · 4:5 · IG</R5B_MM>
              <span style={{ flex: 1 }} />
              <span
                onClick={() => { try { window.print(); } catch (e) {} pushToast('Sent to print'); }}
                style={{ padding: '5px 14px', background: 'var(--fg-primary)', color: 'var(--surface-1)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
              >Print</span>
              <span
                onClick={() => pushToast('Download · PNG strip queued')}
                style={{ padding: '5px 14px', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
              >Download PNG</span>
              <span
                onClick={() => setExportCarousel(null)}
                style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--fg-tertiary)' }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.4" /></svg>
              </span>
            </header>
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '24px 22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {exportCarousel.slidesHtml.map((html, i) => (
                  <div key={i} style={{ aspectRatio: '4 / 5', position: 'relative', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </div>
            </div>
            <footer style={{ padding: '10px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <R5B_MM s={9}>esc / click outside to close</R5B_MM>
              <span style={{ flex: 1 }} />
              <R5B_MM s={9} st={{ fontStyle: 'italic' }}>Print uses your browser's native print preview · 4:5 grid layout</R5B_MM>
            </footer>
          </div>
        </div>
      )}

      {linkInput.visible && (
        <div
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            left: linkInput.x, top: linkInput.y,
            transform: 'translate(-50%, -100%)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 8px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-default)',
            borderRadius: 4,
            boxShadow: '0 6px 16px rgba(38,21,12,0.18)',
            zIndex: 8,
          }}
        >
          <R5B_MM s={9} c="var(--fg-tertiary)" st={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Link</R5B_MM>
          <input
            type="text"
            autoFocus
            value={linkInput.value}
            placeholder="paste url, ↵ apply"
            onChange={(e) => setLinkInput(l => ({ ...l, value: e.target.value }))}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') { applyLink(linkInput.value); }
              else if (e.key === 'Escape') { setLinkInput({ visible: false, x: 0, y: 0, value: '' }); }
            }}
            style={{
              minWidth: 240,
              padding: '4px 6px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: R5B.sans, fontSize: 13, color: 'var(--fg-primary)',
            }}
          />
          <span
            onClick={() => applyLink(linkInput.value)}
            style={{ padding: '3px 10px', background: 'var(--fg-primary)', color: 'var(--surface-1)', borderRadius: 999, fontFamily: R5B.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          >Apply</span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  HF_R5DocBody,
  R5_MentionChip, R5_AgentEditMark, R5_AgentRewrite, R5_AgentAddedRow,
  R5_DocParaWithSuggestion, R5_SlashPopover, R5_DocBlockHandle,
  R5_SelectionThread, R5_FormatToolbar, R5_DiffOverlay, R5_FormatStrip, R5_BlockContextMenu, R5_DocQuickSwitcher,
  R5_DocSectionHandle, R5_DocBeat, R5_DocPrepRow, R5_DocAddSection,
  R5_DocStatePill, R5_DocVersionStrip, R5_DocAmbientPresence, R5_DocHeader,
});
