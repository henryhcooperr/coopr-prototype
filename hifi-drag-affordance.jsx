/* global React, window */
/* hifi-drag-affordance.jsx — B1 fleet · drag affordance + ghost preview primitives.

   Visual-only modeling for drag-and-drop. We are NOT implementing real DnD
   physics here — just the visual language so the prototype reads as
   "this is a draggable surface." Each consumer surface marks one item as
   the visually-mid-drag candidate and renders the ghost / drop target /
   status caption around it.

   Three primitives exposed on window:
   - DragHandle   : 6-dot SVG glyph (2×3) sized to the consumer (default 12px).
                    Render in a corner; consumer controls visibility (hover).
   - DragGhost    : a fixed-position floating clone with elevated shadow.
                    Used when the consumer wants the ghost OUTSIDE the
                    source item's flow. Consumers more often inline the
                    "lifted" treatment directly — see Catalog/Calendar/Studio.
   - DropMarker   : a clay-soft outlined placeholder. Two flavors:
                    flavor='block' for grid/list cells, flavor='line' for
                    table-row inter-row drop position.
   - DragStatusPill: a fixed-position pill with mono caption — e.g.
                    "Reorder mode · drop to commit" or "Rescheduling · 18:30 → 14:00".

   Tone: clay-soft outlines (var(--accent-primary) at low alpha), drop shadows
   from var(--shadow-md), mono captions in JetBrains Mono. No motion — these
   are static visual states.
*/

function DragHandle({ size = 12, color = 'rgba(255,255,255,0.85)', shadow = '0 1px 2px rgba(0,0,0,0.4)', style = {} }) {
  // 6-dot grid: 2 columns, 3 rows. Each dot is r=1.1 inside a 12-unit viewBox.
  // Dots positioned at (4, 3), (8, 3), (4, 6), (8, 6), (4, 9), (8, 9).
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 12 12"
      aria-label="Drag handle"
      style={{ display: 'block', filter: shadow ? `drop-shadow(${shadow})` : 'none', ...style }}
    >
      <circle cx="4" cy="3" r="1.1" fill={color} />
      <circle cx="8" cy="3" r="1.1" fill={color} />
      <circle cx="4" cy="6" r="1.1" fill={color} />
      <circle cx="8" cy="6" r="1.1" fill={color} />
      <circle cx="4" cy="9" r="1.1" fill={color} />
      <circle cx="8" cy="9" r="1.1" fill={color} />
    </svg>
  );
}

function DragStatusPill({ children, top, left, right, bottom }) {
  const pos = {};
  if (top    !== undefined) pos.top = top;
  if (left   !== undefined) pos.left = left;
  if (right  !== undefined) pos.right = right;
  if (bottom !== undefined) pos.bottom = bottom;
  return (
    <div style={{
      position: 'absolute',
      ...pos,
      padding: '5px 10px',
      borderRadius: 999,
      background: 'var(--fg-primary)',
      color: 'var(--fg-on-ink)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      boxShadow: '0 4px 12px rgba(15,14,12,0.22), 0 1px 2px rgba(15,14,12,0.16)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 6,
    }}>
      {children}
    </div>
  );
}

function DropMarker({ flavor = 'block', height = 'auto', label }) {
  if (flavor === 'line') {
    return (
      <div style={{
        position: 'relative',
        height: 0,
        margin: '0 28px',
        borderTop: '2px solid var(--accent-primary)',
        boxShadow: '0 0 0 3px rgba(154, 56, 56, 0.10)',
      }}>
        {label && (
          <span style={{
            position: 'absolute',
            left: 0, top: -7,
            padding: '1px 6px',
            background: 'var(--accent-primary)',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderRadius: 2,
          }}>{label}</span>
        )}
      </div>
    );
  }
  // block flavor — a placeholder cell
  return (
    <div style={{
      height,
      border: '1.5px dashed var(--accent-primary)',
      borderRadius: 6,
      background: 'rgba(154, 56, 56, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      color: 'var(--accent-primary-press)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600,
    }}>
      {label || 'Drop here'}
    </div>
  );
}

function DragGhost({ children, style = {} }) {
  // Inline "lifted" wrapper — slight rotate, elevated shadow, slight scale.
  return (
    <div style={{
      transform: 'translateY(-3px) rotate(-1.2deg)',
      boxShadow: '0 14px 28px rgba(15,14,12,0.22), 0 4px 8px rgba(15,14,12,0.14)',
      transition: 'none',
      position: 'relative',
      zIndex: 4,
      ...style,
    }}>
      {children}
    </div>
  );
}

Object.assign(window, { DragHandle, DragStatusPill, DropMarker, DragGhost });
