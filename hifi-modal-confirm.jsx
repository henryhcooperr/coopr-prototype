/* global React, window */
/* hifi-modal-confirm.jsx — F1 · Generic confirm modal.

   Reusable destructive-action gate. Caller passes:
     props.title         (string)        — serif italic headline
     props.body          (string)        — sans body copy
     props.confirmLabel  (string='Continue')
     props.cancelLabel   (string='Cancel')
     props.dangerLabel   (boolean)       — when true, confirm uses tone-warning
     props.onConfirm     (function)      — invoked before popModal
     props.onCancel      (function)      — optional, invoked before popModal

   ESC + scrim handled by MasterModalLayer. */

const MCF_M = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const MCF_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function HF_ModalConfirm(props) {
  const safe         = props || {};
  const title        = safe.title        || 'Are you sure?';
  const body         = safe.body         || '';
  const confirmLabel = safe.confirmLabel || 'Continue';
  const cancelLabel  = safe.cancelLabel  || 'Cancel';
  const dangerLabel  = !!safe.dangerLabel;
  const onConfirm    = typeof safe.onConfirm === 'function' ? safe.onConfirm : function () {};
  const onCancelExt  = typeof safe.onCancel  === 'function' ? safe.onCancel  : null;

  const ctx       = window.useMasterState ? window.useMasterState() : null;
  const popModal  = ctx && ctx.popModal  ? ctx.popModal  : function () {};

  function handleConfirm() { try { onConfirm(); } finally { popModal(); } }
  function handleCancel()  { if (onCancelExt) { try { onCancelExt(); } finally { popModal(); } } else { popModal(); } }

  const confirmBg     = dangerLabel ? 'var(--tone-warning)' : 'var(--accent-primary)';
  const confirmBorder = dangerLabel ? 'var(--tone-warning)' : 'var(--accent-primary)';

  return (
    <div style={{
      width: 460, maxWidth: '100%',
      display: 'flex', flexDirection: 'column',
      margin: '-32px',
      background: 'var(--surface-1)',
      borderRadius: 16, overflow: 'hidden',
    }}>
      <div style={{
        padding: '24px 24px 18px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <span style={{
          fontFamily: MCF_M.mono, fontSize: 9.5,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontWeight: 700, color: dangerLabel ? 'var(--tone-warning)' : 'var(--fg-tertiary)',
        }}>{dangerLabel ? 'Destructive' : 'Confirm'}</span>
        <span style={{
          fontFamily: MCF_M.serif, fontStyle: 'italic',
          fontSize: 22, fontWeight: 500,
          color: 'var(--fg-primary)', letterSpacing: '-0.018em',
          lineHeight: 1.2,
        }}>{title}</span>
        {body ? (
          <span style={{
            fontFamily: MCF_M.sans, fontSize: 13.5,
            fontWeight: 400, lineHeight: 1.55,
            color: 'var(--fg-secondary)', letterSpacing: '-0.003em',
          }}>{body}</span>
        ) : null}
      </div>

      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--surface-2)',
      }}>
        <span style={{ flex: 1 }} />
        <span
          role="button" tabIndex={0} onClick={handleCancel}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCancel(); } }}
          style={{
            padding: '7px 14px', borderRadius: 6,
            background: 'transparent', color: 'var(--fg-secondary)',
            border: '1px solid var(--border-default)',
            fontFamily: MCF_M.sans, fontSize: 12.5, fontWeight: 600,
            letterSpacing: '-0.005em', cursor: 'pointer', userSelect: 'none',
          }}>{cancelLabel}</span>
        <span
          role="button" tabIndex={0} onClick={handleConfirm}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleConfirm(); } }}
          style={{
            padding: '7px 14px', borderRadius: 6,
            background: confirmBg, color: 'var(--fg-on-accent)',
            border: '1px solid ' + confirmBorder,
            fontFamily: MCF_M.sans, fontSize: 12.5, fontWeight: 600,
            letterSpacing: '-0.005em', cursor: 'pointer', userSelect: 'none',
            transition: `background 160ms ${MCF_EASE}`,
          }}>{confirmLabel}</span>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ModalConfirm });
