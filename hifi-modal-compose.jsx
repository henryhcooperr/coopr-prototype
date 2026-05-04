/* global React, window */
/* hifi-modal-compose.jsx — F1 · Compose modal.

   Cmd/Ctrl+N from any surface invokes pushModal('ModalCompose'). This is the
   showpiece modal of F1 — a real composer surface with autofocus, an @-mention
   affordance stub, a decorative file-attach glyph, and a right-aligned submit
   in the footer.

   Submit path is FAKED at this prototype tier:
     console.log({ kind: 'compose', text }) + popModal() + pushToast('Sent.')

   No chat-tool wire — that lives at promote-to-v3 time. The modal pretends.

   ESC + scrim click are handled by MasterModalLayer. */

const MC_M = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const MC_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ─── Glyphs (inline, 4-12 viewBox) ────────────────────────────
function MC_AtGlyph({ size = 12 }) {
  // @ glyph for the mention popover trigger.
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <circle cx="6" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7.8 6v0.8a1.2 1.2 0 0 0 2.4 0V6a4.2 4.2 0 1 0-1.6 3.3"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function MC_PaperclipGlyph({ size = 12 }) {
  // Decorative attach affordance — clip outline, ink stroke.
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path d="M8.5 3.4 4.7 7.2a1.6 1.6 0 0 0 2.3 2.3l4.3-4.3a2.6 2.6 0 0 0-3.7-3.7L2.7 7a3.4 3.4 0 0 0 4.8 4.8L11 8.3"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MC_SendGlyph({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path d="M2 6 10.5 2.2 8.4 10.4 6.4 7.6Z"
        fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" />
    </svg>
  );
}

function MC_CloseGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 3 L9 9 M9 3 L3 9"
        stroke="currentColor" strokeWidth="1.4"
        fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Mention popover stub ─────────────────────────────────────
// Cosmetic only — flag that mentions are a wired affordance but not yet
// connected to the registry of posts / drafts / contacts. Anchors below
// the textarea, soft clay border, mono kicker.
function MC_MentionPopover() {
  return (
    <div style={{
      position: 'absolute',
      left: 0, bottom: -56,
      padding: '10px 14px',
      borderRadius: 10,
      background: 'var(--surface-2)',
      border: '1px dashed var(--border-default)',
      display: 'flex', alignItems: 'center', gap: 10,
      maxWidth: 360,
      pointerEvents: 'none',
      animation: `cv-compose-pop 200ms ${MC_EASE}`,
    }}>
      <span style={{
        color: 'var(--accent-primary-press)',
        display: 'inline-flex',
      }}>
        <MC_AtGlyph size={11} />
      </span>
      <span style={{
        fontFamily: MC_M.mono, fontSize: 9.5,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        fontWeight: 700, color: 'var(--accent-primary-press)',
      }}>Mentions</span>
      <span style={{
        fontFamily: MC_M.serif, fontStyle: 'italic',
        fontSize: 12.5, color: 'var(--fg-secondary)',
        letterSpacing: '-0.005em',
      }}>pre-wired, not yet connected</span>
    </div>
  );
}

// ─── Top-level modal component ────────────────────────────────
function HF_ModalCompose(props) {
  const initialText = (props && typeof props.initialText === 'string') ? props.initialText : '';
  const [text, setText] = React.useState(initialText);
  const [showMention, setShowMention] = React.useState(false);
  const taRef = React.useRef(null);

  const ctx = window.useMasterState ? window.useMasterState() : null;
  const popModal  = ctx && ctx.popModal  ? ctx.popModal  : function () {};
  const pushToast = ctx && ctx.pushToast ? ctx.pushToast : function () {};

  // Autofocus on mount — composer should feel snappy.
  React.useEffect(() => {
    if (taRef.current) {
      try { taRef.current.focus(); } catch (e) { /* ignore */ }
    }
  }, []);

  function onSubmit() {
    const payload = { kind: 'compose', text };
    // eslint-disable-next-line no-console
    console.log(payload);
    popModal();
    pushToast('Sent.');
  }

  function onTextChange(e) {
    const next = e && e.target ? e.target.value : '';
    setText(next);
    // Cosmetic mention trigger — last typed @ flips the popover on, any
    // subsequent space turns it back off. No real lookup.
    const lastChar = next.slice(-1);
    if (lastChar === '@') setShowMention(true);
    else if (lastChar === ' ' || next.length === 0) setShowMention(false);
  }

  const canSend = text.trim().length > 0;

  return (
    <div style={{
      width: 620, maxWidth: '100%',
      display: 'flex', flexDirection: 'column',
      margin: '-32px',
      background: 'var(--surface-1)',
      borderRadius: 16, overflow: 'hidden',
    }}>
      {/* HEADER STRIP ─────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 14px 22px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: MC_M.mono, fontSize: 9.5,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontWeight: 700, color: 'var(--fg-tertiary)',
          }}>Compose</span>
          <span style={{
            fontFamily: MC_M.serif, fontStyle: 'italic',
            fontSize: 16, fontWeight: 500,
            color: 'var(--fg-primary)', letterSpacing: '-0.012em',
          }}>What are you sending?</span>
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label="Close compose"
          onClick={popModal}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); popModal(); } }}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, borderRadius: 6,
            cursor: 'pointer', userSelect: 'none',
            color: 'var(--fg-secondary)',
          }}>
          <MC_CloseGlyph />
        </span>
      </div>

      {/* BODY · textarea + mention popover ─────────────────────── */}
      <div style={{
        position: 'relative',
        padding: '18px 22px 26px',
        background: 'var(--surface-1)',
      }}>
        <textarea
          ref={taRef}
          value={text}
          onChange={onTextChange}
          placeholder="Start a thought, or ask Coopr to draft from a hook…"
          style={{
            width: '100%', boxSizing: 'border-box',
            minHeight: 120,
            padding: '14px 16px',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            background: 'var(--surface-2)',
            color: 'var(--fg-primary)',
            fontFamily: MC_M.sans, fontSize: 14,
            fontWeight: 500, lineHeight: 1.55,
            letterSpacing: '-0.005em',
            resize: 'vertical',
            outline: 'none',
          }}
        />
        {showMention ? <MC_MentionPopover /> : null}
      </div>

      {/* FOOTER · attach + meta + submit ────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--surface-2)',
      }}>
        {/* Attach glyph — decorative cluster on the left */}
        <span
          role="button"
          tabIndex={0}
          aria-label="Attach a file"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30, borderRadius: 6,
            color: 'var(--fg-secondary)',
            cursor: 'default', userSelect: 'none',
          }}>
          <MC_PaperclipGlyph size={14} />
        </span>

        <span
          role="button"
          tabIndex={0}
          aria-label="Insert mention"
          onClick={() => setShowMention((v) => !v)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30, borderRadius: 6,
            color: showMention ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
            cursor: 'pointer', userSelect: 'none',
            background: showMention ? 'var(--accent-soft)' : 'transparent',
          }}>
          <MC_AtGlyph size={13} />
        </span>

        <span style={{
          fontFamily: MC_M.mono, fontSize: 9.5,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--fg-tertiary)', fontWeight: 600,
        }}>Markdown ok</span>

        <span style={{ flex: 1 }} />

        <span style={{
          fontFamily: MC_M.mono, fontSize: 9.5,
          color: 'var(--fg-tertiary)', letterSpacing: '0.1em',
          fontVariantNumeric: 'tabular-nums',
        }}>{String(text.length)} CHARS</span>

        {/* Submit — right-aligned in footer */}
        <span
          role="button"
          tabIndex={0}
          aria-label="Send"
          aria-disabled={!canSend}
          onClick={() => { if (canSend) onSubmit(); }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && canSend) {
              e.preventDefault(); onSubmit();
            }
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 14px',
            borderRadius: 6,
            background: canSend ? 'var(--accent-primary)' : 'var(--surface-1)',
            color: canSend ? 'var(--fg-on-accent)' : 'var(--fg-tertiary)',
            border: '1px solid ' + (canSend ? 'var(--accent-primary)' : 'var(--border-default)'),
            fontFamily: MC_M.sans, fontSize: 12.5, fontWeight: 600,
            letterSpacing: '-0.005em',
            cursor: canSend ? 'pointer' : 'not-allowed',
            userSelect: 'none',
            transition: `background 160ms ${MC_EASE}, color 160ms ${MC_EASE}`,
          }}>
          <MC_SendGlyph size={11} />
          <span>Send</span>
        </span>
      </div>
    </div>
  );
}

// One-shot keyframes for the mention popover entrance. Idempotent.
if (typeof document !== 'undefined' && !document.getElementById('cv-compose-keyframes')) {
  const style = document.createElement('style');
  style.id = 'cv-compose-keyframes';
  style.textContent = '@keyframes cv-compose-pop { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }';
  document.head.appendChild(style);
}

Object.assign(window, { HF_ModalCompose });
