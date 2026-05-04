/* global React, window */
/* hifi-multi-select-bar.jsx — B2 multi-select primitive.

   Reusable sticky bottom action bar consumed by Library/Compare,
   Inbox/Comments, and Inbox/DMs. Visible only when count >= 1.

   Positioned `position: absolute` (NOT fixed) so it stays inside the
   surface frame in layout view — escaping the artboard would bleed
   the bar into adjacent surfaces in the master grid.

   Pillbox shape (border-radius 999), surface-1 background, clay-tone
   shadow. Mono uppercase count, sans button labels — same vocabulary
   as the rest of the prototype.

   Each action is { label, onClick, variant? }. variant === 'primary'
   gets the clay accent fill. variant === 'danger' uses tone-warning
   border with transparent fill. Everything else is the default ghost
   chip with a subtle border.

   Load order: AFTER hifi-state-variants.jsx, BEFORE the consumer
   surfaces (Library/Compare, Inbox/Comments, Inbox/DMs). See
   master.html. */

const HF_MSB = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

// ─── MultiSelectActionBar ────────────────────────────────
// count   — number selected; bar is hidden when count < 1
// actions — Array<{ label: string, onClick: fn, variant?: 'primary' | 'danger' | 'ghost' }>
// onClear — optional clear-selection handler. Renders a leading [Clear] chip.
// noun    — what the count is counting (default: 'selected')
function MultiSelectActionBar({ count = 0, actions = [], onClear = null, noun = 'selected' }) {
  if (!count || count < 1) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 5,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px 10px 18px',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 999,
      boxShadow: '0 6px 22px rgba(80, 56, 30, 0.14), 0 1px 3px rgba(80, 56, 30, 0.08)',
      whiteSpace: 'nowrap',
    }}>
      {/* Count · mono uppercase */}
      <span style={{
        fontFamily: HF_MSB.mono,
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--fg-primary)',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 600,
      }}>
        <span className="hf-num">{count}</span>
        <span style={{ marginLeft: 6, color: 'var(--fg-tertiary)' }}>{noun}</span>
      </span>

      {/* Separator dot */}
      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-strong)' }} />

      {/* Optional clear chip */}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          style={{
            fontFamily: HF_MSB.sans,
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--fg-secondary)',
            background: 'transparent',
            border: 'none',
            padding: '6px 8px',
            borderRadius: 999,
            cursor: 'pointer',
            letterSpacing: '-0.005em',
          }}
        >
          Clear
        </button>
      )}

      {/* Action chips */}
      {actions.map((a, i) => {
        const variant = a.variant || 'ghost';
        const isPrimary = variant === 'primary';
        const isDanger  = variant === 'danger';
        const styles = isPrimary
          ? { bg: 'var(--accent-primary)', fg: 'var(--fg-on-accent)', border: 'var(--accent-primary)' }
          : isDanger
          ? { bg: 'transparent',           fg: 'var(--tone-warning)', border: 'var(--tone-warning)' }
          : { bg: 'var(--surface-2)',      fg: 'var(--fg-primary)',   border: 'var(--border-default)' };
        return (
          <button
            key={a.label + ':' + i}
            type="button"
            onClick={a.onClick}
            style={{
              fontFamily: HF_MSB.sans,
              fontSize: 12,
              fontWeight: isPrimary ? 600 : 500,
              padding: '7px 14px',
              background: styles.bg,
              color: styles.fg,
              border: '1px solid ' + styles.border,
              borderRadius: 999,
              cursor: 'pointer',
              letterSpacing: '-0.005em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {a.label}
            {a.menu && (
              <svg width="9" height="9" viewBox="0 0 12 12" style={{ marginLeft: 2 }}>
                <path d="M2 4 L6 8 L10 4" stroke={styles.fg} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── HF_Checkbox ─────────────────────────────────────────
// Compact square checkbox primitive consumed by row + tile selection.
// Stops click propagation so toggling the checkbox doesn't fire the
// underlying row's onClick (drill-in).
function HF_Checkbox({ checked = false, onChange = null, size = 16, ariaLabel = 'Select' }) {
  function handleClick(e) {
    e.stopPropagation();
    if (onChange) onChange(!checked);
  }
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={handleClick}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        border: '1.4px solid ' + (checked ? 'var(--accent-primary)' : 'var(--border-strong)'),
        background: checked ? 'var(--accent-primary)' : 'var(--surface-1)',
        borderRadius: 4,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
    >
      {checked && (
        <svg width={size - 6} height={size - 6} viewBox="0 0 12 12">
          <path d="M2.5 6.4 L4.8 8.7 L9.5 3.8" stroke="var(--fg-on-accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

Object.assign(window, {
  MultiSelectActionBar,
  HF_Checkbox,
});
