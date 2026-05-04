/* global React, window */
/* hifi-chrome-v8.jsx — SUBTAB / SUBPAGE design.

   The workspace pill from v7 is locked. This file explores FOUR ways to
   handle subtabs (Overview / Retention / Format DNA / Audience / Posting
   for Insights, etc.) inside the floating-pill paradigm:

     S1 · Stacked sub-pill        — small companion pill below workspace pill
     S2 · Inline expansion         — active workspace widens to host subtabs in the same row
     S3 · Hover popover            — subtabs drop down from active workspace on hover (loop demo)
     S4 · Unified drawer           — workspace pill extends downward to expose subtabs

   Each variant renders the live <HF_InsightsOverview /> below it, with the
   v7 cast-shadow + bottom-edge-hairline integration carried over. Some
   variants animate (S1 stagger-in + breathe, S3 hover loop, S4 drawer loop).
   The S2 variant cycles through three workspaces every 4s to show how the
   inline expansion behaves across different subtab counts.

   Reuses the slim HfShell patch so the surface body mounts without its own
   topbar / subtabs. The tweaks gallery is on a separate page so it is unaffected.
*/

if (typeof window !== 'undefined' && window.HfShell && !window.__cv8Patched) {
  window.__OrigHfShellV8 = window.__OrigHfShell || window.HfShell;
  window.HfShell = function HfShellSlimV8({ children, style = {} }) {
    return (
      <div className="hf" style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-base)', fontFamily: 'var(--font-sans)',
        color: 'var(--fg-primary)', overflow: 'hidden',
        ...style,
      }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    );
  };
  window.__cv8Patched = true;
}

const C8 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WS_LIST = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];
const SUBTABS = {
  home: [],
  studio:   ['Workspace', 'Clip Lab', 'Docs', 'List', 'Calendar', 'Shipped'],
  library:  ['Catalog', 'Series', 'Patterns', 'Timeline', 'Pairings', 'Compare'],
  insights: ['Overview', 'Retention', 'Format DNA', 'Audience', 'Posting'],
  intel:    ['Trends', 'Radar', 'Inspiration', 'DNA', 'Memory', 'Studies'],
  inbox:    ['Comments', 'DMs', 'Mentions', 'Replies'],
  calendar: [],
};
const ACT_SUB_FOR = {
  insights: 'Overview', library: 'Catalog', studio: 'Workspace',
  intel: 'Trends', inbox: 'Comments',
};

// ─── Sea lion crop ──────────────────────────────────────────
function SeaLion({ size = 22 }) {
  return (
    <span style={{
      width: size, height: size,
      backgroundImage: 'url(coopr-logo.png)',
      backgroundSize: `${size * (1205 / 341)}px ${size}px`,
      backgroundPosition: 'left center', backgroundRepeat: 'no-repeat',
      display: 'inline-block', flexShrink: 0,
    }} />
  );
}

// ─── Real surface mount ─────────────────────────────────────
function RealSurface({ surfaceShift = 0 }) {
  const Comp = window.HF_InsightsOverview;
  if (!Comp) return <div style={{ padding: 32, fontFamily: C8.mono, fontSize: 12, color: 'var(--tone-danger)' }}>HF_InsightsOverview not on window — check load order.</div>;
  return <div style={{ position: 'absolute', top: surfaceShift, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}><Comp /></div>;
}

// ─── Canvas wrapper (1440 × 760) ────────────────────────────
function Canvas({ children }) {
  return (
    <div className="cv6-canvas" style={{
      width: 1440, height: 760, background: 'var(--bg-base)',
      position: 'relative', overflow: 'hidden',
      border: '1px solid var(--border-default)', borderRadius: 8,
    }}>{children}</div>
  );
}

// Annotation pill (top-right)
function Annot({ children }) {
  return (
    <div style={{
      position: 'absolute', top: 16, right: 16, zIndex: 20,
      padding: '6px 10px', background: 'rgba(26,24,21,0.78)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 6, fontFamily: C8.mono, fontSize: 9.5,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--fg-on-ink)', fontWeight: 600,
      boxShadow: '0 6px 14px -8px rgba(26,24,21,0.32)',
    }}>{children}</div>
  );
}

// (WorkspacePill is inlined per-variant so each can attach its own state hooks
// — popover anchoring, drawer expansion, etc. — without restructuring a shared
// primitive. The pill structure itself is locked: see v7 FloatBar for canonical.)

// ─── Subtab list primitive ──────────────────────────────────
// Used inside S1 sub-pill, S3 popover, and S4 drawer. The same component
// keeps the typography ladder consistent across treatments.
function SubtabRow({ workspace = 'insights', active = 'Overview', size = 'sm', italic = true }) {
  const subs = SUBTABS[workspace] || [];
  const px = size === 'sm' ? 12 : 13;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
      {subs.map(s => {
        const a = s === active;
        return (
          <span key={s} style={{
            position: 'relative',
            fontFamily: a && italic ? C8.serif : C8.sans,
            fontStyle: a && italic ? 'italic' : 'normal',
            fontSize: a ? px + 0.5 : px,
            fontWeight: a ? 600 : 500,
            color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            paddingBottom: 1,
            letterSpacing: '-0.005em',
          }}>
            {s}
            {a && <span style={{
              position: 'absolute', left: 0, right: 0, bottom: -6, height: 1.5,
              background: 'var(--accent-primary)', borderRadius: 999,
            }} />}
          </span>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// S1 · STACKED SUB-PILL · companion pill below workspace pill
// Both pills breathe in sync (4.4s loop). Sub-pill staggers in
// from −10px / opacity 0 on workspace activation (one-shot, 320ms).
// ───────────────────────────────────────────────────────────
function S1() {
  return (
    <Canvas>
      <RealSurface surfaceShift={120} />
      <div className="cv8-s1-cast" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 36, pointerEvents: 'none', zIndex: 5 }} />
      <Annot>S1 · STACKED SUB-PILL · 4.4S BREATHE</Annot>
      {/* Workspace pill (inlined — same structure as v7 FloatBar) */}
      <div className="cv8-s1-ws" style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 12 }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: '10px 16px', height: 48,
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
          position: 'relative',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}><SeaLion size={22} /></span>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
          {WS_LIST.map(w => {
            const a = w === 'Insights';
            return (
              <span key={w} style={{
                position: 'relative',
                fontFamily: a ? C8.serif : C8.sans, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
                color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer',
              }}>
                {w}
                {a && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 2, background: 'var(--accent-primary)', borderRadius: 999, boxShadow: '0 1px 4px -1px rgba(182,83,43,0.32)' }} />}
              </span>
            );
          })}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C8.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
          <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
        </div>
      </div>
      {/* Sub-pill — narrower, centered horizontally, sits 10px below workspace pill */}
      <div className="cv8-s1-sub" style={{
        position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
        zIndex: 11,
      }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 999, padding: '8px 18px', height: 36,
          display: 'inline-flex', alignItems: 'center', gap: 14,
          boxShadow: '0 10px 24px -14px rgba(26,24,21,0.16), 0 2px 4px -2px rgba(26,24,21,0.06), 0 1px 0 rgba(253,252,249,0.7) inset',
        }}>
          <span style={{ fontFamily: C8.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>INSIGHTS</span>
          <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
          <SubtabRow workspace="insights" active="Overview" size="sm" italic={true} />
        </div>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// S2 · INLINE EXPANSION · active workspace widens to host subtabs
// One pill, two zones. The active workspace's subtabs render in italic-serif
// inline AFTER the workspace tabs, separated by a thin "/". Cycles through
// 3 active workspaces every 4s to show how the layout breathes.
// ───────────────────────────────────────────────────────────
const S2_CYCLE = ['insights', 'library', 'studio'];
function S2() {
  const [idx, setIdx] = React.useState(0);
  const [morph, setMorph] = React.useState(false);
  React.useEffect(() => {
    const id = setInterval(() => {
      setMorph(true);
      setTimeout(() => setMorph(false), 360);
      setIdx(prev => (prev + 1) % S2_CYCLE.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  const wsKey = S2_CYCLE[idx];
  const wsLabel = wsKey[0].toUpperCase() + wsKey.slice(1);
  const subs = SUBTABS[wsKey];
  const actSub = ACT_SUB_FOR[wsKey];
  return (
    <Canvas>
      <RealSurface surfaceShift={64} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)', pointerEvents: 'none', zIndex: 5 }} />
      <Annot>S2 · INLINE EXPANSION · {morph ? 'MORPHING' : `ACTIVE: ${wsLabel.toUpperCase()}`}</Annot>
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10 }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: '10px 16px', height: 48,
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
          position: 'relative',
          transition: 'box-shadow 360ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}><SeaLion size={22} /></span>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
          {WS_LIST.map(w => {
            const a = w.toLowerCase() === wsKey;
            return (
              <span key={w} style={{
                position: 'relative',
                fontFamily: a ? C8.serif : C8.sans, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
                color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                opacity: a ? 1 : 0.78,
                transition: 'all 320ms cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}>
                {w}
                {a && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 2, background: 'var(--accent-primary)', borderRadius: 999, boxShadow: '0 1px 4px -1px rgba(182,83,43,0.32)' }} />}
              </span>
            );
          })}
          {/* Inline expansion: divider + subtabs */}
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', marginLeft: 4 }} />
          <span style={{ fontFamily: C8.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>/</span>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            opacity: morph ? 0.35 : 1,
            transform: morph ? 'translateX(-4px)' : 'translateX(0)',
            transition: 'all 360ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {subs.map(s => {
              const a = s === actSub;
              return (
                <span key={s} style={{
                  position: 'relative',
                  fontFamily: a ? C8.serif : C8.sans, fontStyle: a ? 'italic' : 'normal',
                  fontSize: a ? 13 : 12, fontWeight: a ? 600 : 500,
                  color: a ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)',
                  letterSpacing: '-0.005em', cursor: 'pointer',
                }}>
                  {s}
                  {a && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 1.5, background: 'var(--accent-primary)', borderRadius: 999 }} />}
                </span>
              );
            })}
          </div>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C8.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
          <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
        </div>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// S3 · HOVER POPOVER · subtabs drop down on hover · loop demo
// CSS keyframe simulates a hover cycle: closed → opening → open → closing
// → closed. 9s loop. The popover anchors centered to the active workspace.
// ───────────────────────────────────────────────────────────
function S3() {
  return (
    <Canvas>
      <RealSurface surfaceShift={64} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)', pointerEvents: 'none', zIndex: 5 }} />
      <Annot>S3 · HOVER POPOVER · 9S LOOP</Annot>
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10 }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: '10px 16px', height: 48,
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
          position: 'relative',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}><SeaLion size={22} /></span>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
          {WS_LIST.map(w => {
            const a = w === 'Insights';
            return (
              <span key={w} style={{
                position: 'relative',
                fontFamily: a ? C8.serif : C8.sans, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
                color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                {w}
                {a && <svg width="9" height="9" viewBox="0 0 9 9" style={{ marginTop: 1 }}><path d="M2 3 L4.5 5.5 L7 3" stroke="var(--accent-primary)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {a && <span style={{ position: 'absolute', left: 0, right: 16, bottom: -8, height: 2, background: 'var(--accent-primary)', borderRadius: 999, boxShadow: '0 1px 4px -1px rgba(182,83,43,0.32)' }} />}
                {/* Popover anchored to Insights */}
                {a && (
                  <span className="cv8-s3-pop" style={{
                    position: 'absolute', top: 'calc(100% + 14px)', left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--surface-1)', border: '1px solid var(--border-default)',
                    borderRadius: 12, padding: '12px 18px',
                    display: 'inline-flex', alignItems: 'center', gap: 16,
                    boxShadow: '0 18px 44px -16px rgba(26,24,21,0.22), 0 4px 10px -4px rgba(26,24,21,0.10)',
                    zIndex: 11, whiteSpace: 'nowrap',
                  }}>
                    <span style={{ fontFamily: C8.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>INSIGHTS</span>
                    <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
                    <SubtabRow workspace="insights" active="Overview" size="sm" italic={true} />
                  </span>
                )}
              </span>
            );
          })}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C8.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
          <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
        </div>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// S4 · UNIFIED DRAWER · workspace pill extends downward
// One container, two zones, separated by an accent-soft seam that briefly
// glows clay when the drawer just opened. Active workspace ("Insights")
// has a chevron that rotates 180° as the drawer opens. Subtabs stagger in
// from above with a 60ms-per-tab delay. Pill lifts -1px on open to sell
// the "container grew" feeling. 8s loop: closed (3s) → opening (360ms) →
// open (3s) → closing (360ms). Fixed render bug: outer container padding
// is 0 always; nested zones own their own padding.
// ───────────────────────────────────────────────────────────
function S4() {
  const [open, setOpen] = React.useState(false);
  const [justOpened, setJustOpened] = React.useState(false);
  React.useEffect(() => {
    const seq = [3000, 360, 3000, 360];
    let i = 0;
    const tick = () => {
      const target = (i % 4 === 1 || i % 4 === 2) ? true : false;
      setOpen(target);
      // Glow seam for 800ms after the drawer just opened
      if (i % 4 === 1) {
        setJustOpened(true);
        setTimeout(() => setJustOpened(false), 800);
      }
      const id = setTimeout(() => { i++; tick(); }, seq[i % 4]);
      return id;
    };
    const id = tick();
    return () => clearTimeout(id);
  }, []);
  const insightsSubs = SUBTABS.insights;
  return (
    <Canvas>
      <RealSurface surfaceShift={open ? 116 : 64} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 36,
        background: open
          ? 'linear-gradient(to bottom, rgba(26,24,21,0.10), transparent)'
          : 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)',
        transition: 'background 360ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none', zIndex: 5,
      }} />
      <Annot>S4 · DRAWER · {open ? (justOpened ? 'OPENING…' : 'OPEN') : 'CLOSED'}</Annot>
      <div style={{
        position: 'absolute',
        top: open ? 15 : 16, left: 16, right: 16, zIndex: 10,
        transition: 'top 360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: 0,
          height: open ? 92 : 48,
          display: 'flex', flexDirection: 'column',
          boxShadow: open
            ? '0 28px 56px -22px rgba(26,24,21,0.26), 0 6px 14px -6px rgba(26,24,21,0.12), 0 1px 0 rgba(253,252,249,0.7) inset'
            : '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
          transition: 'height 360ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 360ms cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* TOP ZONE · workspace tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', height: 48, flexShrink: 0 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}><SeaLion size={22} /></span>
            <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
            {WS_LIST.map(w => {
              const a = w === 'Insights';
              return (
                <span key={w} style={{
                  position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontFamily: a ? C8.serif : C8.sans, fontStyle: a ? 'italic' : 'normal',
                  fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
                  color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer',
                }}>
                  {w}
                  {/* Chevron next to active workspace — rotates 180° when drawer opens */}
                  {a && (
                    <svg width="9" height="9" viewBox="0 0 9 9" style={{
                      marginLeft: 1,
                      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 360ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                      <path d="M2 3 L4.5 5.5 L7 3" stroke="var(--accent-primary)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {a && <span style={{ position: 'absolute', left: 0, right: 13, bottom: -8, height: 2, background: 'var(--accent-primary)', borderRadius: 999, boxShadow: '0 1px 4px -1px rgba(182,83,43,0.32)' }} />}
                </span>
              );
            })}
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: C8.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
          </div>

          {/* SEAM · accent-soft rule that briefly glows clay when freshly opened */}
          <span style={{
            position: 'absolute', left: 12, right: 12, top: 48, height: 1,
            background: justOpened
              ? 'linear-gradient(to right, transparent, var(--accent-primary), transparent)'
              : 'linear-gradient(to right, transparent, var(--accent-soft), transparent)',
            opacity: open ? 1 : 0,
            transform: open ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 360ms cubic-bezier(0.4, 0, 0.2, 1), background 800ms ease',
            pointerEvents: 'none',
            boxShadow: justOpened ? '0 0 8px 0 rgba(182,83,43,0.32)' : 'none',
          }} />

          {/* BOTTOM ZONE · subtabs · stagger in from above on open */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 18, padding: '10px 22px',
            height: 44, flexShrink: 0,
          }}>
            <span style={{
              fontFamily: C8.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--fg-tertiary)', fontWeight: 700,
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-6px)',
              transition: 'opacity 280ms cubic-bezier(0.4, 0, 0.2, 1) 80ms, transform 280ms cubic-bezier(0.4, 0, 0.2, 1) 80ms',
            }}>INSIGHTS /</span>
            {insightsSubs.map((s, i) => {
              const a = s === 'Overview';
              return (
                <span key={s} style={{
                  position: 'relative',
                  fontFamily: a ? C8.serif : C8.sans, fontStyle: a ? 'italic' : 'normal',
                  fontSize: a ? 14 : 13, fontWeight: a ? 600 : 500,
                  color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                  letterSpacing: '-0.005em', cursor: 'pointer',
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(-8px)',
                  transition: `opacity 320ms cubic-bezier(0.4, 0, 0.2, 1) ${120 + i * 50}ms, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) ${120 + i * 50}ms`,
                }}>
                  {s}
                  {a && <span style={{
                    position: 'absolute', left: 0, right: 0, bottom: -6, height: 1.5,
                    background: 'var(--accent-primary)', borderRadius: 999,
                    opacity: open ? 1 : 0,
                    transform: open ? 'scaleX(1)' : 'scaleX(0.3)',
                    transformOrigin: 'left',
                    transition: `opacity 280ms ease ${260 + i * 50}ms, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) ${260 + i * 50}ms`,
                    boxShadow: '0 1px 3px -1px rgba(182,83,43,0.28)',
                  }} />}
                </span>
              );
            })}
            <span style={{ flex: 1 }} />
            {/* Subtle right-side mono caption — staggers in last */}
            <span style={{
              fontFamily: C8.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--fg-tertiary)',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-6px)',
              transition: 'opacity 280ms cubic-bezier(0.4, 0, 0.2, 1) 380ms, transform 280ms cubic-bezier(0.4, 0, 0.2, 1) 380ms',
            }}>LAST 30D · 14M AGO</span>
          </div>

          <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
        </div>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// VC · SectionHead · PageHeader · global animation styles
// ───────────────────────────────────────────────────────────
function GlobalAnimStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .cv6-canvas .hf-topbar, .cv6-canvas .hf-subtabs { display: none !important; }
      .cv6-canvas .hf { height: 100% !important; }

      @media (prefers-reduced-motion: reduce) {
        .cv8-s1-ws, .cv8-s1-sub, .cv8-s1-ws > div, .cv8-s1-cast, .cv8-s3-pop { animation: none !important; }
      }

      /* S1 · breathe — both pills bob in sync, cast-shadow in sync */
      @keyframes cv8-breathe-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
      @keyframes cv8-breathe-bob-sub { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-1.5px); } }
      @keyframes cv8-breathe-shadow {
        0%, 100% { box-shadow: 0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset; }
        50%      { box-shadow: 0 24px 48px -20px rgba(26,24,21,0.22), 0 4px 10px -4px rgba(26,24,21,0.10), 0 1px 0 rgba(253,252,249,0.7) inset; }
      }
      @keyframes cv8-breathe-cast {
        0%, 100% { background: linear-gradient(to bottom, rgba(26,24,21,0.04), transparent); }
        50%      { background: linear-gradient(to bottom, rgba(26,24,21,0.08), transparent); }
      }
      .cv8-s1-ws { animation: cv8-breathe-bob 4.4s ease-in-out infinite; }
      .cv8-s1-ws > div { animation: cv8-breathe-shadow 4.4s ease-in-out infinite; }
      .cv8-s1-sub { animation: cv8-breathe-bob-sub 4.4s ease-in-out infinite; }
      .cv8-s1-cast { animation: cv8-breathe-cast 4.4s ease-in-out infinite; }

      /* S3 · hover popover loop · 9s · closed → opening → open → closing → closed */
      @keyframes cv8-s3-popover {
        0%   { opacity: 0; transform: translateX(-50%) translateY(-8px); pointer-events: none; }
        18%  { opacity: 0; transform: translateX(-50%) translateY(-8px); }
        28%  { opacity: 1; transform: translateX(-50%) translateY(0); }
        72%  { opacity: 1; transform: translateX(-50%) translateY(0); }
        82%  { opacity: 0; transform: translateX(-50%) translateY(-8px); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-8px); }
      }
      .cv8-s3-pop { animation: cv8-s3-popover 9s cubic-bezier(0.4, 0, 0.2, 1) infinite; opacity: 0; }
    `}} />
  );
}

function VC({ id, title, sub, refs, what, tradeoff, behavior, children }) {
  return (
    <article style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border-default)', background: 'var(--surface-1)',
      boxShadow: '0 16px 36px -28px rgba(26,24,21,0.20), 0 2px 6px -3px rgba(26,24,21,0.08)',
    }}>
      <div style={{ padding: '14px 24px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: C8.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: C8.serif, fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>{title}</h3>
          <span style={{ fontFamily: C8.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C8.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>ref · {refs}</span>
        </div>
      </div>
      <div style={{ padding: '8px 24px 6px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ fontFamily: C8.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)' }}>BEHAVIOR · </span>
        <span style={{ fontFamily: C8.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-primary)' }}>{behavior}</span>
      </div>
      <div style={{ background: 'var(--bg-base)', padding: 24, display: 'flex', justifyContent: 'center' }}>{children}</div>
      <div style={{ padding: '12px 24px 14px', borderTop: '1px solid var(--border-default)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: C8.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-success)', marginBottom: 4 }}>WHAT</div>
          <div style={{ fontFamily: C8.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{what}</div>
        </div>
        <div>
          <div style={{ fontFamily: C8.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-warning)', marginBottom: 4 }}>TRADEOFF</div>
          <div style={{ fontFamily: C8.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{tradeoff}</div>
        </div>
      </div>
    </article>
  );
}

function SectionHead({ kicker, title, deck }) {
  return (
    <div style={{ marginTop: 32, marginBottom: 20 }}>
      <div style={{ fontFamily: C8.mono, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 6 }}>{kicker}</div>
      <h2 style={{ margin: '0 0 6px', fontFamily: C8.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1 }}>{title}</h2>
      <p style={{ margin: 0, fontFamily: C8.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>{deck}</p>
    </div>
  );
}

function PageHeader() {
  return (
    <div style={{ padding: '40px 32px 28px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
      <div style={{ maxWidth: 1488, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <img src="coopr-logo.png" alt="COOPRLABS" style={{ height: 32, width: 'auto' }} />
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C8.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            CHROME IDEATION · v8 · SUBPAGE / SUBTAB DESIGN
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontFamily: C8.serif, fontWeight: 500, fontSize: 40, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Four ways subtabs can live <span style={{ fontStyle: 'italic' }}>under the floating pill.</span>
        </h1>
        <p style={{ margin: '0 0 12px', fontFamily: C8.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 980, lineHeight: 1.55 }}>
          The workspace pill from v7 is locked. This page only explores how subpages reveal themselves: a stacked sub-pill that breathes in sync, an inline expansion that widens the active workspace, a hover popover that drops down on demand, or a unified drawer that the workspace pill itself opens.
        </p>
        <p style={{ margin: 0, fontFamily: C8.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          v1 · v2 · v3 · v4 · v5 · v6 · v7 floating · <span style={{ color: 'var(--accent-primary)' }}>v8 subtabs · this page</span>
        </p>
      </div>
    </div>
  );
}

function HF_ChromeIdeationV8() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <GlobalAnimStyles />
      <PageHeader />
      <div style={{ maxWidth: 1504, margin: '0 auto', padding: '24px 32px 96px' }}>

        <SectionHead
          kicker="GROUP S · SUBPAGE TREATMENTS · 4 VARIANTS"
          title="The pill is locked. The question is where the subtabs live."
          deck="The Insights workspace has five subtabs (Overview · Retention · Format DNA · Audience · Posting). Library has six. Studio has six. Whatever pattern wins has to gracefully handle 4–6 children per workspace and never crowd the workspace pill. Each variant rendered live over the real Insights surface."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="S1" title="Stacked sub-pill" sub="companion pill below workspace pill · breathes in sync" refs="iOS Control Center stacks · Notion peek panels"
              behavior="Two pills float at rest. Workspace pill on top (full width, 16/16 margins). Companion sub-pill below it (auto-width to fit subtabs, centered horizontally, ~10px gap). Both bob ±1.5px in a synchronized 4.4s breathe — they're physically separate but optically one element. Sub-pill's mono kicker ('INSIGHTS') labels the context."
              what="Two pills, one breath. Sub-pill carries: mono workspace kicker ('INSIGHTS' uppercase tracked) · vertical rule · 5 subtabs in a tight inline row. Active subtab gets italic-serif + clay-capsule underline. Reads as a stack of two related-but-distinct controls. The workspace pill stays minimum width; the sub-pill is sized to its content."
              tradeoff="Eats ~98px of vertical chrome (48 pill + 10 gap + 36 sub-pill + cast-shadow). Two floating elements at the top is more visual weight than the pure v7 chrome. The sub-pill's centered position can fight wide workspaces (Library has 6 subtabs ≈ 460px wide; still fits at 1440 but feels tight at 1024).">
            <S1 />
          </VC>

          <VC id="S2" title="Inline expansion" sub="active workspace widens · subtabs in same row" refs="Linear breadcrumb · macOS path bar"
              behavior="One pill. Cycles through 3 active workspaces every 4s (Insights → Library → Studio → ...). When the active workspace changes, the post-active section morphs (opacity 100% → 35% → 100%, slight x-translate) over 360ms while subtabs swap. Reads as 'the breadcrumb after the workspace name.'"
              what="Single pill. Layout: sea lion · divider · 7 workspace tabs · vertical rule · mono '/' separator · italic-serif subtabs of the active workspace · dateline. Subtabs are slightly smaller (12-13px vs 13-14.5px) and use accent-primary-press tint to read as 'subordinate.' Active subtab gets capsule underline."
              tradeoff="Pill width grows with subtab count: Insights (5 subs) ≈ 1180px · Library (6 subs) ≈ 1280px · Studio (6 subs, longer labels) ≈ 1340px. At 1440 viewport, all fit; at 1024 it would overflow. Also: the more elements in the pill, the harder each becomes to scan — the breadcrumb is best with shorter subtab counts.">
            <S2 />
          </VC>

          <VC id="S3" title="Hover popover" sub="subtabs drop down on hover · 9s loop demo" refs="macOS menubar dropdowns · Linear quick-switcher"
              behavior="9s loop simulates a hover cycle: closed (3s) → opening (1.4s · fade-in + slide-down) → open (4s) → closing (1s · fade-out + slide-up) → closed. Active workspace tab carries a tiny ↓ chevron next to its name to signal there's more inside. Popover anchors centered to the active tab and has its own subtle drop-shadow + clay-soft hairline so it reads as a continuation of the pill."
              what="Workspace pill is unchanged. Active workspace gets a 9px chevron next to its label. On hover, a popover drops down 14px below the pill: rounded 12px corners, mono 'INSIGHTS' kicker, vertical rule, italic-serif subtabs in a compact row. Animation: 320ms fade-in + 8px translateY-down."
              tradeoff="Discoverability — first-time users may not realize they need to hover. The chevron is the load-bearing affordance. On touch/mobile, hover is unreliable; needs a click fallback. Best for desktop power users; needs an alternative pattern for first-touch.">
            <S3 />
          </VC>

          <VC id="S4" title="Unified drawer" sub="pill extends downward · one container · two zones" refs="Apple Music navigation drawer · Notion sidebar drawer"
              behavior="8s loop: closed (3s, height 48px) → opening (320ms · height grows to 88px, accent-soft seam fades in) → open (3s, both zones visible) → closing (320ms · drawer collapses). Bottom zone holds the active workspace's subtabs with mono context kicker + italic-serif tabs. Cast-shadow intensifies during open."
              what="One container. Top zone (always visible): workspace pill. Bottom zone (revealed on engage): subtabs. Separated by an accent-soft hairline. Border radius stays consistent at 12px. Surface body shifts down by 48px during open to make room — chrome and surface are always touching. Most committed 'pill + subtabs are one element' direction."
              tradeoff="Eats 88px vertical chrome when open. Has to know when to open: on workspace click? on workspace hover? on URL match? Each strategy has UX costs. Auto-open on workspace match is the sanest default but can feel intrusive on Home (which has no subtabs).">
            <S4 />
          </VC>
        </div>

        {/* Closing recommendation */}
        <article style={{ marginTop: 32, padding: '24px 28px 26px', borderRadius: 14, background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)' }}>
          <div style={{ fontFamily: C8.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 8 }}>SYNTHESIS · subpage strategy</div>
          <h2 style={{ margin: '0 0 12px', fontFamily: C8.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            S1 stacked sub-pill is the strongest default. S4 unified drawer is the most committed.
          </h2>
          <p style={{ margin: '0 0 12px', fontFamily: C8.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>S1 stacked sub-pill</strong> wins on calmness: subtabs are always visible (no discoverability tax) and the synchronized breathe sells "two pills, one element" without forcing them into one container. Best for the daily-driver. <strong>S4 unified drawer</strong> wins on commitment: workspaces and subtabs are unmistakably the same control, and the drawer's open/close state can be tied to actual user intent (active workspace open = drawer open). More opinionated but stronger as a system.
          </p>
          <p style={{ margin: '0 0 12px', fontFamily: C8.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>S2 inline expansion</strong> is the most editorial — reads as a breadcrumb in the masthead — but breaks at higher subtab counts (Library / Studio with 6 subs). Reserve for narrow-IA workspaces only. <strong>S3 hover popover</strong> is the most chrome-light variant but the chevron is a fragile affordance; would need a strong onboarding moment.
          </p>
          <p style={{ margin: 0, fontFamily: C8.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            Recommended path: S4 drawer as primary default (committed system, drawer-open follows active workspace), with S1 stacked sub-pill as the alt mode for users who want subtabs always visible. S3 popover and S2 inline are stylistic alternatives, not load-bearing options.
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV8 });
