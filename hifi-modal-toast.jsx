/* global React, window */
/* hifi-modal-toast.jsx — auto-dismissing pill toast.

   Architecture decision (E2): the toast lives on the SAME modalStack used by
   ModalSearch / ModalCompose / etc, but MasterModalLayer special-cases the
   `'ModalToast'` kind to skip the scrim and pointer-events trap. The
   special-case branch is in hifi-master-interactive-view.jsx::MasterModalLayer.

   Why share the stack rather than build an independent layer?
     - One source of truth for "interrupting overlay state".
     - Reuses pushModal/popModal/clearModals — no new context fields, no new
       provider plumbing, no new keyboard ladder.
     - The setTimeout that auto-dismisses just calls popModal(). Stack stays
       coherent: a toast queued under a real modal pops clean when its timer
       fires (popModal pops the TOP entry, not "the toast" — but the special
       rendering path means the toast is always visible regardless of stack
       depth, and queued toasts stack visually with no interaction conflict).

   Tone:
     - Pill, bottom-center, 32px from bottom.
     - var(--surface-1) bg, var(--fg-primary) text.
     - Mono eyebrow optional (text only, no eyebrow at this size).
     - 14px vertical padding, 22px horizontal — feels like a footnote, not a
       chrome element.
     - Subtle clay border + soft shadow. Fades in via opacity transition.
     - z-index 13 (above the modal layer's 12 — see MasterModalLayer scrim).

   Lifecycle:
     - On mount, schedule `popModal()` after `durationMs` (default 2000).
     - Cleanup the timer on unmount (ESC dismissal, manual popModal, etc.).
*/

function HF_ModalToast({ text, durationMs, undo, onUndo }) {
  // Undo-bearing toasts hold a touch longer (3.4s) so the user has time to
  // read the action and reach the chip. Plain toasts keep the original 2s.
  const defaultMs = undo ? 3400 : 2000;
  const ms = typeof durationMs === 'number' ? durationMs : defaultMs;
  const ctx = window.useMasterState && window.useMasterState();
  const popModal = ctx ? ctx.popModal : null;

  React.useEffect(() => {
    if (!popModal) return undefined;
    const id = setTimeout(() => { popModal(); }, ms);
    return () => clearTimeout(id);
  }, [popModal, ms]);

  function handleUndoClick(e) {
    try {
      e.stopPropagation();
      if (typeof onUndo === 'function') onUndo();
      if (popModal) popModal();
    } catch (_err) { /* defensive — never strand the toast */ }
  }

  // Subtle entrance — opacity + a 4px lift. No scale, no spring (avoid
  // chat-bot toast theatrics). The .ct-fade class is keyed to once-per-mount.
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 32,
        transform: 'translateX(-50%)',
        zIndex: 13,
        pointerEvents: 'none',
        // Pill chrome
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 22px',
        borderRadius: 999,
        background: 'var(--surface-1)',
        color: 'var(--fg-primary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 18px 36px -16px rgba(26,24,21,0.28), 0 4px 10px -4px rgba(26,24,21,0.10), 0 1px 0 rgba(253,252,249,0.7) inset',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '-0.005em',
        maxWidth: 'min(90vw, 640px)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        animation: 'cv-toast-in 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--fg-tertiary)',
      }}>{undo ? 'done' : 'routed'}</span>
      <span style={{ width: 1, height: 12, background: 'var(--border-subtle)' }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
      {undo && (
        <>
          <span style={{ width: 1, height: 12, background: 'var(--border-subtle)', marginLeft: 4 }} />
          <span
            role="button"
            tabIndex={0}
            onClick={handleUndoClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleUndoClick(e); } }}
            style={{
              pointerEvents: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 9px',
              borderRadius: 999,
              background: 'transparent',
              border: '1px solid color-mix(in srgb, var(--accent-primary) 22%, transparent)',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background 160ms cubic-bezier(0.16, 1, 0.3, 1), color 160ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-primary) 8%, transparent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
              <path d="M5.5 2 L2.5 4.5 L5.5 7 M2.7 4.5 L7 4.5"
                stroke="currentColor" strokeWidth="1.3" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Undo
          </span>
        </>
      )}
    </div>
  );
}

// One-shot keyframes injection. Idempotent — every mount checks whether the
// rule is already present before appending. Lives outside the component so
// ESC-dismiss + remount doesn't churn the stylesheet.
if (typeof document !== 'undefined' && !document.getElementById('cv-toast-keyframes')) {
  const style = document.createElement('style');
  style.id = 'cv-toast-keyframes';
  style.textContent = '@keyframes cv-toast-in { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }';
  document.head.appendChild(style);
}

Object.assign(window, { HF_ModalToast });
