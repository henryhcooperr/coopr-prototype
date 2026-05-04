/* global React, window */
/* hifi-tooltip.jsx — shared tooltip primitive (B4).

   HF_Tooltip({ label, children, side='top' })

   Wraps any child node and renders a small mono-cased pill on hover after a
   350ms delay. Pill uses var(--surface-1) background, var(--fg-primary) text,
   subtle clay border + soft shadow. Absolute-positioned relative to a wrapper
   span; opacity transition only, no scale or springs (keeps with the toast's
   restrained motion vocabulary).

   Sides:
     - 'top'    (default) — pill sits above the child, arrow pointing down.
     - 'bottom' — below the child.
     - 'left'   — to the left.
     - 'right'  — to the right.

   Defensive: hover state sits behind try/catch on every consumer-side
   read. The child is rendered as-is; the wrapper span uses display:inline-flex
   so it doesn't break inline number runs in stat tiles. The 350ms timer is
   cleared on unmount + on mouseleave so escape never strands a visible pill.

   Usage:
     <HF_Tooltip label="Saves vs prior 30d">
       <span className="hf-num">+22%</span>
     </HF_Tooltip>

   The label is uppercased + mono via tooltip styles — pass plain prose,
   the tooltip handles the typography. */

const HF_TOOLTIP_DELAY_MS = 350;

function HF_Tooltip({ label, children, side }) {
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef(null);
  const sideKey = side === 'bottom' || side === 'left' || side === 'right' ? side : 'top';

  React.useEffect(() => {
    return () => {
      try {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } catch (_e) { /* defensive */ }
    };
  }, []);

  function handleEnter() {
    try {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { setVisible(true); }, HF_TOOLTIP_DELAY_MS);
    } catch (_e) { /* defensive */ }
  }
  function handleLeave() {
    try {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisible(false);
    } catch (_e) { /* defensive */ }
  }

  // Position tokens, keyed by side.
  let pillStyle = {
    position: 'absolute',
    zIndex: 14,
    pointerEvents: 'none',
    padding: '5px 10px',
    borderRadius: 6,
    background: 'var(--surface-1)',
    color: 'var(--fg-primary)',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 8px 16px -8px rgba(26,24,21,0.22), 0 1px 0 rgba(253,252,249,0.7) inset',
    fontFamily: 'var(--font-mono)',
    fontSize: 9.5,
    fontWeight: 600,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    opacity: visible ? 1 : 0,
    transition: 'opacity 160ms cubic-bezier(0.16, 1, 0.3, 1)',
  };
  if (sideKey === 'top') {
    pillStyle = { ...pillStyle, bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };
  } else if (sideKey === 'bottom') {
    pillStyle = { ...pillStyle, top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };
  } else if (sideKey === 'left') {
    pillStyle = { ...pillStyle, right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' };
  } else { /* right */
    pillStyle = { ...pillStyle, left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' };
  }

  return (
    <span
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {children}
      <span role="tooltip" aria-hidden={!visible} style={pillStyle}>{label}</span>
    </span>
  );
}

Object.assign(window, { HF_Tooltip });
