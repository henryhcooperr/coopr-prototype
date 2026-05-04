/* global React, window */
/* hifi-context-menu.jsx — B3 · Context-menu + sort-popover primitives.

   Shared popover surface for kebab menus + sort dropdowns. Lives outside
   the modal stack on purpose: context menus are point-of-action affordances
   that should NOT scrim the page, and they should disappear on outside-click
   instead of demanding ESC. Local state only.

   Exports on window:
     HF_ContextMenu({ x, y, items, onClose, anchor='top-left' })
       items: Array<{ label, kicker?, onClick, danger?, active? }>
       Renders an absolute-positioned card at (x, y). Each row gets a
       mono-eyebrow kicker on the left and the label in sans on the right.
       Click outside or ESC fires onClose. Items wrap their own click handler
       so callers don't need to manually dispatch onClose after action.

     HF_SortPopover({ x, y, options, activeId, onSelect, onClose })
       options: Array<{ id, label }>
       Same anchor/dismiss model as HF_ContextMenu, narrower content.
       Active option shows a checkmark. Clicking an option fires onSelect
       then onClose.

     HF_FilterChip({ label, kicker, onRemove })
       Small pill with mono kicker · sans label · X. Used at top of
       Library/Catalog and Inbox/Comments. Pure visual — caller wires removal.

     HF_AddFilterChip({ onClick })
       Ghost-style pendant for the end of the filter chip row.

   Anchor model: callers measure the kebab/sort button's bounding rect via
   useRef + e.currentTarget.getBoundingClientRect(), then pass the bottom-
   left corner as (x, y). The popover measures itself once and shifts up if
   it would overflow the viewport — so callers don't need to know whether
   they're near the bottom.

   Frozen-open mode (layout view): pass `frozen` to skip the outside-click
   listener and the timer-driven dismiss. Frozen popovers are pure visual
   demonstrations and never call onClose. */

const HCM_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function HF_ContextMenu(props) {
  const safe = props || {};
  const x = typeof safe.x === 'number' ? safe.x : 0;
  const y = typeof safe.y === 'number' ? safe.y : 0;
  const items = Array.isArray(safe.items) ? safe.items : [];
  const onClose = typeof safe.onClose === 'function' ? safe.onClose : function () {};
  const frozen = !!safe.frozen;
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (frozen) return undefined;
    function onDocDown(e) {
      const node = ref.current;
      if (!node || node.contains(e.target)) return;
      onClose();
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [frozen, onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      style={{
        position: 'absolute',
        left: x, top: y,
        minWidth: 218,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        padding: '6px 0',
        zIndex: 80,
        animation: `hcmIn 200ms ${HCM_EASE} both`,
      }}>
      {items.map((it, i) => {
        const danger = !!it.danger;
        const active = !!it.active;
        return (
          <button
            key={i}
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof it.onClick === 'function') it.onClick();
              if (!frozen) onClose();
            }}
            style={{
              all: 'unset',
              display: 'flex', alignItems: 'baseline', gap: 12,
              width: '100%', boxSizing: 'border-box',
              padding: '8px 14px',
              cursor: 'pointer',
              transition: `background 160ms ${HCM_EASE}`,
              borderTop: i > 0 && it.divider ? '1px solid var(--border-subtle)' : 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: danger ? 'var(--tone-warning)' : 'var(--fg-tertiary)',
              minWidth: 22, textAlign: 'left',
            }}>{it.kicker || String(i + 1).padStart(2, '0')}</span>
            <span style={{
              flex: 1,
              fontFamily: 'var(--font-sans)',
              fontSize: 12.5, fontWeight: active ? 600 : 500,
              color: danger ? 'var(--tone-warning)' : 'var(--fg-primary)',
              letterSpacing: '-0.005em',
            }}>{it.label}</span>
            {active && (
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" style={{ color: 'var(--accent-primary)' }}>
                <path d="M2 6.5 L5 9.5 L10 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

function HF_SortPopover(props) {
  const safe = props || {};
  const x = typeof safe.x === 'number' ? safe.x : 0;
  const y = typeof safe.y === 'number' ? safe.y : 0;
  const options = Array.isArray(safe.options) ? safe.options : [];
  const activeId = safe.activeId || null;
  const onSelect = typeof safe.onSelect === 'function' ? safe.onSelect : function () {};
  const onClose = typeof safe.onClose === 'function' ? safe.onClose : function () {};
  const frozen = !!safe.frozen;

  const items = options.map(o => ({
    label: o.label,
    kicker: 'SORT',
    active: o.id === activeId,
    onClick: () => onSelect(o),
  }));

  return (
    <HF_ContextMenu x={x} y={y} items={items} onClose={onClose} frozen={frozen} />
  );
}

function HF_FilterChip(props) {
  const safe = props || {};
  const label = safe.label || '';
  const kicker = safe.kicker || 'FILTER';
  const onRemove = typeof safe.onRemove === 'function' ? safe.onRemove : null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 24, padding: '0 6px 0 10px',
      borderRadius: 999,
      background: 'var(--accent-soft)',
      border: '1px solid color-mix(in srgb, var(--accent-primary) 18%, transparent)',
      color: 'var(--accent-primary-press)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--accent-primary)',
      }}>{kicker}</span>
      <span style={{
        fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600,
        color: 'var(--accent-primary-press)',
        letterSpacing: '-0.005em',
      }}>{label}</span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); if (onRemove) onRemove(); }}
        aria-label={'Remove filter ' + label}
        style={{
          all: 'unset',
          width: 16, height: 16, borderRadius: '50%',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-primary-press)',
          cursor: 'pointer',
          transition: 'background 160ms ' + HCM_EASE,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 2 L8 8 M8 2 L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

function HF_AddFilterChip(props) {
  const safe = props || {};
  const onClick = typeof safe.onClick === 'function' ? safe.onClick : function () {};
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 24, padding: '0 12px',
        borderRadius: 999,
        border: '1px dashed var(--border-default)',
        background: 'transparent',
        color: 'var(--fg-tertiary)',
        fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 200ms ' + HCM_EASE,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--fg-secondary)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--fg-tertiary)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
    >
      <span style={{ fontSize: 13, lineHeight: 1, fontWeight: 500 }}>+</span>
      <span>add filter</span>
    </button>
  );
}

// Simple kebab handle — 3 vertical dots in a small clickable circle. Used by
// catalog cards + studio rows.
function HF_KebabHandle(props) {
  const safe = props || {};
  const onClick = typeof safe.onClick === 'function' ? safe.onClick : function () {};
  const tone = safe.tone || 'light'; // 'light' for dark thumbnails, 'ink' for warm-paper rows
  const visible = safe.visible !== false;
  const isLight = tone === 'light';
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      aria-label="Open menu"
      style={{
        all: 'unset',
        width: 24, height: 24, borderRadius: 6,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: isLight ? 'rgba(255,255,255,0.92)' : 'var(--surface-1)',
        border: isLight ? 'none' : '1px solid var(--border-subtle)',
        color: isLight ? 'var(--fg-primary)' : 'var(--fg-secondary)',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transition: 'opacity 160ms ' + HCM_EASE,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="2.4" r="1.1" fill="currentColor" />
        <circle cx="6" cy="6.0" r="1.1" fill="currentColor" />
        <circle cx="6" cy="9.6" r="1.1" fill="currentColor" />
      </svg>
    </button>
  );
}

// Inject a tiny fade-in keyframe once. Idempotent — if the style tag already
// exists we skip. Lives in this file so it ships alongside the primitive.
(function () {
  if (typeof document === 'undefined') return;
  if (document.getElementById('hcm-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'hcm-keyframes';
  style.textContent = '@keyframes hcmIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }';
  document.head.appendChild(style);
})();

Object.assign(window, {
  HF_ContextMenu,
  HF_SortPopover,
  HF_FilterChip,
  HF_AddFilterChip,
  HF_KebabHandle,
});
