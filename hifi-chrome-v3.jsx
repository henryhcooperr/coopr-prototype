/* global React, window */
/* hifi-chrome-v3.jsx — minimal · light · unique · clean-tech direction.

   Eight variants going much further minimal than v2:
     - Use coopr-logo.png (sea lion + COOPRLABS) — sometimes full, sometimes
       just the sea lion glyph cropped via background-position
     - No "Coopr" text alongside the logo
     - No persistent Cmd-K button or avatar (utilities are keyboard-summoned
       or live in command palette only)
     - Subpages reveal on hover — never always-visible, never stacked
     - Light surfaces, not dark surface-ink — keeps the warm-paper feel
     - References: Linear · Arc · Cron · Notion calendar · Stripe · Origin
*/

const C3 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WS = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];
const ACTIVE = 'Insights';
const SUBS = ['Overview', 'Retention', 'Format DNA', 'Audience', 'Posting'];
const ACT_SUB = 'Overview';

// ─── Sea-lion-only crop of coopr-logo.png ──────────────────
// The full logo is 1205×341 with the sea lion in the leftmost ~280px of width.
// Setting backgroundSize so the height fills the container and width scales
// proportionally, then objectPosition: left exposes only the sea lion portion.
function SeaLion({ size = 28 }) {
  // The png is monochrome black — for tinting variants we'd switch to mix-blend
  // or replace with inline SVG; for these mockups we render as-is.
  return (
    <span style={{
      width: size, height: size,
      backgroundImage: 'url(coopr-logo.png)',
      backgroundSize: `${size * (1205 / 341)}px ${size}px`,
      backgroundPosition: 'left center',
      backgroundRepeat: 'no-repeat',
      display: 'inline-block',
      flexShrink: 0,
    }} />
  );
}

// Full COOPRLABS logo (sea lion + wordmark + tagline)
function FullLogo({ height = 24 }) {
  return (
    <img
      src="coopr-logo.png"
      alt="COOPRLABS"
      style={{
        height,
        width: 'auto',
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
}

// ─── Workspace SVG glyphs — inline, monochrome, 14×14 ──────
function WSGlyph({ name, active = false }) {
  const s = 14;
  const stroke = active ? 'var(--accent-primary)' : 'var(--fg-secondary)';
  const sw = 1.4;
  const common = { width: s, height: s, viewBox: '0 0 14 14', fill: 'none' };
  switch (name) {
    case 'Home':
      return <svg {...common}><path d="M2 7 L7 3 L12 7 V12 H2 Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/><line x1="6" y1="12" x2="6" y2="9" stroke={stroke} strokeWidth={sw}/><line x1="8" y1="12" x2="8" y2="9" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Studio':
      return <svg {...common}><path d="M3 11 L9.5 4.5 L11 6 L4.5 12.5 Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" transform="translate(0,-1)"/><path d="M9 5 L11 7" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Library':
      return <svg {...common}><rect x="2" y="2" width="3" height="10" stroke={stroke} strokeWidth={sw}/><rect x="6" y="3" width="3" height="9" stroke={stroke} strokeWidth={sw}/><rect x="10" y="4" width="2.5" height="8" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Insights':
      return <svg {...common}><circle cx="7" cy="7" r="5" stroke={stroke} strokeWidth={sw}/><path d="M7 2 V7 L10.5 8.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case 'Intel':
      return <svg {...common}><circle cx="7" cy="7" r="5.5" stroke={stroke} strokeWidth={sw}/><circle cx="7" cy="7" r="2" stroke={stroke} strokeWidth={sw}/><line x1="7" y1="2" x2="7" y2="4" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Inbox':
      return <svg {...common}><path d="M2 4 L12 4 V11 H2 Z" stroke={stroke} strokeWidth={sw}/><path d="M2 4 L7 8 L12 4" stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/></svg>;
    case 'Calendar':
      return <svg {...common}><rect x="2" y="3" width="10" height="9" stroke={stroke} strokeWidth={sw}/><line x1="2" y1="6" x2="12" y2="6" stroke={stroke} strokeWidth={sw}/><line x1="5" y1="2" x2="5" y2="4" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/><line x1="9" y1="2" x2="9" y2="4" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/></svg>;
    default: return null;
  }
}

// ─── Hover popover — used when showing subtab reveal ─────────
function SubPopover({ ws = ACTIVE, anchor = 'center', tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <div style={{
      position: 'absolute',
      top: '100%', marginTop: 10,
      [anchor === 'left' ? 'left' : anchor === 'right' ? 'right' : 'left']: anchor === 'center' ? '50%' : 0,
      transform: anchor === 'center' ? 'translateX(-50%)' : 'none',
      background: dark ? 'rgba(26,24,21,0.92)' : 'var(--surface-1)',
      backdropFilter: dark ? 'blur(14px)' : 'none',
      border: dark ? '1px solid rgba(253,252,249,0.10)' : '1px solid var(--border-default)',
      borderRadius: 10,
      padding: '6px 4px',
      display: 'flex', flexDirection: 'column', gap: 1,
      minWidth: 180,
      boxShadow: '0 18px 44px -16px rgba(26,24,21,0.22), 0 4px 10px -4px rgba(26,24,21,0.10)',
      zIndex: 5,
    }}>
      <div style={{ padding: '6px 12px 4px', fontFamily: C3.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: dark ? 'rgba(253,252,249,0.5)' : 'var(--fg-tertiary)', fontWeight: 700 }}>
        {ws}
      </div>
      {SUBS.map(s => {
        const a = s === ACT_SUB;
        return (
          <div key={s} style={{
            padding: '7px 12px',
            margin: '0 2px',
            borderRadius: 6,
            background: a ? (dark ? 'rgba(253,252,249,0.08)' : 'var(--accent-soft)') : 'transparent',
            color: a ? (dark ? 'var(--fg-on-ink)' : 'var(--accent-primary-press)') : (dark ? 'rgba(253,252,249,0.78)' : 'var(--fg-secondary)'),
            fontFamily: a ? C3.serif : C3.sans,
            fontStyle: a ? 'italic' : 'normal',
            fontSize: a ? 14 : 13,
            fontWeight: a ? 500 : 400,
            cursor: 'pointer',
          }}>{s}</div>
        );
      })}
    </div>
  );
}

// ─── Below-chrome content sliver ──────────────────────────
function Sliver() {
  return (
    <div style={{ padding: '32px 32px 0', background: 'var(--bg-base)', minHeight: 110 }}>
      <div style={{ fontFamily: C3.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
        Insights · Overview · Wed Apr 28
      </div>
      <h2 style={{ margin: '6px 0 0', fontFamily: C3.serif, fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: 'var(--accent-primary)' }}>+22% saves</span>, +12% views. <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>One channel is going backwards.</span>
      </h2>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// V1 · Light icon pill — sea lion + 7 glyphs, hover for sub
// ──────────────────────────────────────────────────────────
function ChromeV1() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0', minHeight: 240 }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'var(--surface-1)',
          borderRadius: 999,
          padding: '6px',
          display: 'inline-flex', alignItems: 'center', gap: 2,
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 12px 32px -16px rgba(26,24,21,0.14), 0 2px 6px -3px rgba(26,24,21,0.06)',
          position: 'relative',
        }}>
          <span style={{ padding: '5px 10px 5px 8px', display: 'inline-flex', alignItems: 'center' }}>
            <SeaLion size={22} />
          </span>
          <span style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 4px' }} />
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{ position: 'relative', display: 'inline-flex' }}>
                <span style={{
                  width: 32, height: 32,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8,
                  background: a ? 'var(--accent-soft)' : 'transparent',
                  cursor: 'pointer',
                }}>
                  <WSGlyph name={w} active={a} />
                </span>
                {a && <SubPopover />}
              </span>
            );
          })}
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// V2 · Vertical edge dock · 56px wide, hover for horizontal subs
// ──────────────────────────────────────────────────────────
function ChromeV2() {
  return (
    <div style={{ display: 'flex', minHeight: 380, background: 'var(--bg-base)' }}>
      <aside style={{
        width: 64, background: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        padding: '14px 0',
      }}>
        <span style={{ marginBottom: 14 }}><SeaLion size={26} /></span>
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{
                width: 38, height: 38,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8,
                background: a ? 'var(--accent-soft)' : 'transparent',
                cursor: 'pointer',
              }}>
                <WSGlyph name={w} active={a} />
              </span>
              {a && (
                <div style={{
                  position: 'absolute',
                  left: '100%', top: '50%',
                  transform: 'translate(8px, -50%)',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  padding: '6px 4px',
                  display: 'flex', flexDirection: 'column', gap: 1,
                  minWidth: 180,
                  boxShadow: '0 18px 44px -16px rgba(26,24,21,0.22)',
                  zIndex: 5,
                }}>
                  <div style={{ padding: '6px 12px 4px', fontFamily: C3.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>{w}</div>
                  {SUBS.map(s => {
                    const sa = s === ACT_SUB;
                    return (
                      <div key={s} style={{
                        padding: '7px 12px', margin: '0 2px',
                        borderRadius: 6,
                        background: sa ? 'var(--accent-soft)' : 'transparent',
                        color: sa ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                        fontFamily: sa ? C3.serif : C3.sans,
                        fontStyle: sa ? 'italic' : 'normal',
                        fontSize: sa ? 14 : 13,
                        fontWeight: sa ? 500 : 400,
                      }}>{s}</div>
                    );
                  })}
                </div>
              )}
            </span>
          );
        })}
      </aside>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Sliver />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// V3 · Phantom top — chrome invisible, hover reveals
// (shown in REVEALED state with thin-edge dimmed alt)
// ──────────────────────────────────────────────────────────
function ChromeV3() {
  return (
    <div style={{ background: 'var(--bg-base)', position: 'relative', minHeight: 280 }}>
      {/* Hairline indicator that there's a chrome here */}
      <div style={{ height: 2, background: 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)', borderBottom: '1px solid rgba(26,24,21,0.10)' }} />

      {/* Revealed state — pill fades in from top */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 999,
        padding: '5px 6px',
        display: 'inline-flex', alignItems: 'center', gap: 2,
        boxShadow: '0 14px 36px -14px rgba(26,24,21,0.18)',
        zIndex: 4,
      }}>
        <span style={{ padding: '4px 10px 4px 6px' }}><SeaLion size={20} /></span>
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)', margin: '0 4px' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: a ? 'var(--accent-soft)' : 'transparent',
              color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
              fontFamily: C3.sans, fontSize: 12, fontWeight: a ? 600 : 500,
              cursor: 'pointer',
            }}>{w}</span>
          );
        })}
      </div>

      {/* Caption */}
      <div style={{ position: 'absolute', top: 70, right: 32, fontFamily: C3.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>
        SHOWN IN HOVER-REVEAL STATE · resting state is just the hairline above
      </div>

      {/* Sliver pushed down so revealed pill doesn't overlap */}
      <div style={{ paddingTop: 60 }}>
        <Sliver />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// V4 · Single sea-lion hub — corner only, ⌘K is THE nav
// ──────────────────────────────────────────────────────────
function ChromeV4() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 280, position: 'relative' }}>
      {/* Sea lion hub in top-left */}
      <div style={{
        position: 'absolute', top: 18, left: 24,
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '6px 12px 6px 8px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 999,
        boxShadow: '0 8px 20px -10px rgba(26,24,21,0.14)',
      }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        <span style={{ fontFamily: C3.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', fontWeight: 500 }}>{ACTIVE}</span>
        <span style={{ fontFamily: C3.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>/</span>
        <span style={{ fontFamily: C3.sans, fontSize: 12, color: 'var(--fg-secondary)' }}>{ACT_SUB}</span>
      </div>

      {/* Cmd-K hint at top-right */}
      <div style={{ position: 'absolute', top: 22, right: 32, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: C3.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>
        <span style={{ padding: '2px 6px', background: 'var(--surface-2)', borderRadius: 4, border: '1px solid var(--border-subtle)', fontSize: 10, fontWeight: 600 }}>⌘K</span>
        <span style={{ fontStyle: 'italic', fontFamily: C3.serif, fontSize: 12, color: 'var(--fg-tertiary)' }}>switch anything</span>
      </div>

      <div style={{ paddingTop: 84 }}><Sliver /></div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// V5 · Letter monogram — H S L I N B C, active expands
// ──────────────────────────────────────────────────────────
function ChromeV5() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0', minHeight: 250 }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 999,
          padding: '5px 6px',
          display: 'inline-flex', alignItems: 'center', gap: 1,
          boxShadow: '0 12px 32px -16px rgba(26,24,21,0.14)',
          position: 'relative',
        }}>
          <span style={{ padding: '4px 8px 4px 6px' }}><SeaLion size={20} /></span>
          <span style={{ width: 1, height: 14, background: 'var(--border-subtle)', margin: '0 4px' }} />
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                position: 'relative',
                padding: a ? '6px 14px' : '6px 10px',
                minWidth: a ? 'auto' : 28,
                borderRadius: 999,
                background: a ? 'var(--accent-soft)' : 'transparent',
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                fontFamily: a ? C3.serif : C3.sans,
                fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14 : 13,
                fontWeight: a ? 500 : 600,
                textAlign: 'center',
                cursor: 'pointer',
              }}>{a ? w : w[0]}{a && <SubPopover />}</span>
            );
          })}
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// V6 · Bottom-floating dock · iOS-style at bottom, frees the top
// ──────────────────────────────────────────────────────────
function ChromeV6() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative' }}>
      {/* Page content area — full-height, no top chrome */}
      <div style={{ padding: '24px 32px 100px' }}>
        <div style={{ fontFamily: C3.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          Insights · Overview · Wed Apr 28
        </div>
        <h2 style={{ margin: '6px 0 0', fontFamily: C3.serif, fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          <span style={{ color: 'var(--accent-primary)' }}>+22% saves</span>, +12% views. <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>One channel is going backwards.</span>
        </h2>
        <p style={{ margin: '10px 0 0', fontFamily: C3.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', maxWidth: 720, lineHeight: 1.5 }}>
          The dock floats at the bottom — entire top of the page is yours.
        </p>
      </div>

      {/* Bottom-floating pill */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 999,
        padding: '6px',
        display: 'inline-flex', alignItems: 'center', gap: 2,
        boxShadow: '0 18px 44px -16px rgba(26,24,21,0.20), 0 4px 10px -4px rgba(26,24,21,0.10)',
      }}>
        <span style={{ padding: '5px 10px 5px 8px' }}><SeaLion size={20} /></span>
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)', margin: '0 4px' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ position: 'relative', display: 'inline-flex' }}>
              <span style={{
                width: 32, height: 32,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8,
                background: a ? 'var(--accent-soft)' : 'transparent',
                cursor: 'pointer',
              }}>
                <WSGlyph name={w} active={a} />
              </span>
              {a && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: 12,
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  padding: '6px 4px',
                  display: 'flex', flexDirection: 'column', gap: 1,
                  minWidth: 180,
                  boxShadow: '0 -18px 44px -16px rgba(26,24,21,0.22)',
                  zIndex: 5,
                }}>
                  <div style={{ padding: '6px 12px 4px', fontFamily: C3.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>{w}</div>
                  {SUBS.map(s => {
                    const sa = s === ACT_SUB;
                    return (
                      <div key={s} style={{
                        padding: '7px 12px', margin: '0 2px',
                        borderRadius: 6,
                        background: sa ? 'var(--accent-soft)' : 'transparent',
                        color: sa ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                        fontFamily: sa ? C3.serif : C3.sans,
                        fontStyle: sa ? 'italic' : 'normal',
                        fontSize: sa ? 14 : 13,
                        fontWeight: sa ? 500 : 400,
                      }}>{s}</div>
                    );
                  })}
                </div>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// V7 · Lateral logo + serif-italic strip · max minimal
// ──────────────────────────────────────────────────────────
function ChromeV7() {
  return (
    <div style={{ background: 'var(--bg-base)', position: 'relative', minHeight: 240 }}>
      {/* Lateral logo in left margin */}
      <div style={{ position: 'absolute', top: 16, left: 24 }}>
        <SeaLion size={28} />
      </div>

      {/* Italic-serif workspace strip — max minimal, no utilities */}
      <div style={{ padding: '20px 32px 14px 80px', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                position: 'relative',
                fontFamily: C3.serif, fontStyle: 'italic',
                fontSize: a ? 17 : 14, fontWeight: a ? 600 : 400,
                color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                letterSpacing: '-0.005em',
                cursor: 'pointer',
                paddingBottom: a ? 1 : 0,
                borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none',
              }}>
                {w}
                {a && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0,
                    marginTop: 14,
                    display: 'inline-flex', alignItems: 'baseline', gap: 14,
                  }}>
                    {SUBS.map(s => {
                      const sa = s === ACT_SUB;
                      return (
                        <span key={s} style={{
                          fontFamily: C3.sans, fontSize: 12,
                          fontWeight: sa ? 600 : 500,
                          color: sa ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                          borderBottom: sa ? '1.5px solid var(--accent-primary)' : 'none',
                          paddingBottom: 1,
                          fontStyle: 'normal',
                        }}>{s}</span>
                      );
                    })}
                  </div>
                )}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ paddingTop: 36 }}>
        <Sliver />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// V8 · Frosted-glass icon pill — translucent, light, hover-reveal
// ──────────────────────────────────────────────────────────
function ChromeV8() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0', minHeight: 280, position: 'relative' }}>
      {/* Faux page content peeking through to show the translucency */}
      <div style={{ position: 'absolute', top: 80, left: 0, right: 0, padding: '0 32px', opacity: 0.18, fontFamily: C3.serif, fontStyle: 'italic', fontSize: 22, color: 'var(--fg-primary)' }}>
        the warm paper underneath bleeds through the frosted glass · you see content & nav at once
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px', position: 'relative', zIndex: 2 }}>
        <div style={{
          background: 'rgba(253,252,249,0.62)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          border: '1px solid rgba(26,24,21,0.06)',
          borderRadius: 999,
          padding: '6px',
          display: 'inline-flex', alignItems: 'center', gap: 2,
          boxShadow: '0 14px 32px -16px rgba(26,24,21,0.10), inset 0 1px 0 rgba(253,252,249,0.6)',
          position: 'relative',
        }}>
          <span style={{ padding: '5px 10px 5px 8px' }}><SeaLion size={20} /></span>
          <span style={{ width: 1, height: 14, background: 'rgba(26,24,21,0.10)', margin: '0 4px' }} />
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{ position: 'relative', display: 'inline-flex' }}>
                <span style={{
                  width: 32, height: 32,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8,
                  background: a ? 'var(--accent-soft)' : 'transparent',
                  cursor: 'pointer',
                }}>
                  <WSGlyph name={w} active={a} />
                </span>
                {a && <SubPopover />}
              </span>
            );
          })}
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// ─── Variant card ─────────────────────────────────────────
function VC({ id, title, sub, refs, what, tradeoff, children }) {
  return (
    <article style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-1)',
      boxShadow: '0 12px 32px -24px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08)',
    }}>
      <div style={{ padding: '14px 24px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: C3.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: C3.serif, fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>{title}</h3>
          <span style={{ fontFamily: C3.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C3.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            ref · {refs}
          </span>
        </div>
      </div>
      <div style={{ background: 'var(--bg-base)' }}>{children}</div>
      <div style={{ padding: '12px 24px 14px', borderTop: '1px solid var(--border-default)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: C3.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-success)', marginBottom: 4 }}>WHAT</div>
          <div style={{ fontFamily: C3.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{what}</div>
        </div>
        <div>
          <div style={{ fontFamily: C3.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-warning)', marginBottom: 4 }}>TRADEOFF</div>
          <div style={{ fontFamily: C3.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{tradeoff}</div>
        </div>
      </div>
    </article>
  );
}

function PageHeader() {
  return (
    <div style={{ padding: '40px 32px 28px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
      <div style={{ maxWidth: 1376, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <FullLogo height={32} />
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C3.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            CHROME IDEATION · v3 · MINIMAL · CLEAN-TECH
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontFamily: C3.serif, fontWeight: 500, fontSize: 40, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Eight minimal directions, <span style={{ fontStyle: 'italic' }}>using the sea lion.</span>
        </h1>
        <p style={{ margin: '0 0 12px', fontFamily: C3.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>
          You said the v2 floating pills felt bulky. These eight strip everything — no "Coopr" text, no Cmd-K button, no avatar visible. Just the sea lion and the workspace nav. Subpages reveal on hover (active state shown on most variants so you can see the popover). Light surfaces only — no dark pills.
        </p>
        <p style={{ margin: 0, fontFamily: C3.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          v1 (chrome.html) · v2 (chrome-v2.html) · <span style={{ color: 'var(--accent-primary)' }}>v3 minimal · this page</span>
        </p>
      </div>
    </div>
  );
}

function HF_ChromeIdeationV3() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <PageHeader />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 32px 96px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        <VC id="V1" title="Light icon pill" sub="sea lion + 7 glyphs · hover for subs" refs="Linear floating bar"
            what="Single light pill. Sea lion (cropped from coopr-logo) + 7 workspace icons in custom inline SVG. No Coopr text, no Cmd-K, no avatar — keyboard-only. Active workspace gets clay-soft background. Hovering active reveals subpage popover (shown live on this mockup)."
            tradeoff="Icons need to be obvious enough that creators recognize Home/Studio/Library/Insights at a glance — first-time onboarding may need tooltips. Clay-soft on warm-paper has subtle contrast.">
          <ChromeV1 />
        </VC>

        <VC id="V2" title="Vertical edge dock" sub="64px left rail · hover slides subs OUT right" refs="macOS dock · Arc · Linear sidebar"
            what="Thin vertical dock on the left edge. Sea lion top, 7 workspace glyphs stacked. Hovering active workspace reveals subpages as a horizontal popover sliding RIGHT — no static rail clutter. Frees the entire top of the page."
            tradeoff="Eats 64px horizontally. Vertical icon stack reads as software-tool more than editorial-publication. Better for daily-driver creators than first-impression visitors.">
          <ChromeV2 />
        </VC>

        <VC id="V3" title="Phantom top · hover reveal" sub="hairline at rest, full pill on cursor approach" refs="Arc URL bar · Apple TouchBar"
            what="Resting state: a 1px hairline gradient at the page top — barely there, just enough to indicate 'nav lives here.' Cursor approaches the top 60px → pill fades in. Cursor leaves → fades back. Maximum chrome-off mode for fullscreen reading."
            tradeoff="Discoverability — first-time users may not realize there's nav at all. Best paired with an onboarding moment that teaches the gesture. Animation-dependent (fade-in feels broken without smooth motion).">
          <ChromeV3 />
        </VC>

        <VC id="V4" title="Sea lion hub" sub="single corner button · ⌘K is THE nav" refs="Notion app sidebar · Cron command"
            what="Just the sea lion + active section name in a tiny pill in the top-left corner. ⌘K hint on the right. No workspace tabs visible at all — switching is keyboard-only via command palette (which you already have at HF_SearchOverlay)."
            tradeoff="Most extreme minimalism — relies entirely on the user knowing ⌘K is the navigation. Works for power users (Notion/Linear regulars) but a hard sell for casual visitors. Might need a discoverable onboarding tooltip.">
          <ChromeV4 />
        </VC>

        <VC id="V5" title="Letter monogram pill" sub="H S L I N B C · active expands to full word" refs="Cron · Origin app"
            what="Workspaces shown as single-letter monograms (H, S, L, I, N, B, C) in a thin pill. Active workspace expands to show the full word in serif italic. Charming + literary — feels like a hand-bound notebook with chapter letters."
            tradeoff="Letter collisions — Library/Insights/Inbox all start with vowels that could read confusingly. Hover-tooltip would resolve, but at first glance it's a small cognitive tax. Best as a power-user mode after onboarding.">
          <ChromeV5 />
        </VC>

        <VC id="V6" title="Bottom-floating dock" sub="iOS-style at the bottom · top is yours" refs="iOS App Library · Beehiiv"
            what="Floats at the BOTTOM center. Top of the page is completely free — the editorial header band you already have becomes the apparent 'masthead.' Sub-pages reveal UPWARD from the dock when you hover (shown live)."
            tradeoff="Bottom-fixed nav is unconventional on desktop — most users expect top-anchored. Shipping this requires committing to the convention. On 4K monitors the bottom dock is far from cursor's natural resting position.">
          <ChromeV6 />
        </VC>

        <VC id="V7" title="Lateral logo + italic strip" sub="serif-italic workspace names as a thin masthead" refs="London Review of Books · Granta"
            what="Sea lion in the left margin (almost outside the content), workspace names in serif italic on a thin strip. Active workspace gets clay underline + reveals subpage strip below in sans. Most editorial of the minimal variants — feels like the masthead of a literary supplement."
            tradeoff="Italic-only nav is a one-note ladder. Subpage strip below the active workspace is functional but adds vertical weight when revealed. Less 'tech' than the icon pills.">
          <ChromeV7 />
        </VC>

        <VC id="V8" title="Frosted-glass icon pill" sub="translucent · backdrop-blur · light not dark" refs="iOS Control Center · Arc · Apple Vision Pro"
            what="Same icon-pill structure as V1 but with translucent backdrop-filter blur. Warm paper bleeds through — you can see content underneath the chrome. Most tech-cool variant; hardest to mess up because the blur softens contrast issues."
            tradeoff="Backdrop-filter has perf cost on lower-end devices (older Intel Macs, Chromebooks). Light translucent on warm paper can feel washed out if not perfectly tuned. Most ambitious technically.">
          <ChromeV8 />
        </VC>

        {/* Closing recommendation */}
        <article style={{
          marginTop: 14, padding: '24px 28px 26px', borderRadius: 14,
          background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)',
        }}>
          <div style={{ fontFamily: C3.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 8 }}>
            Recommendation · clean-tech · the strongest two
          </div>
          <h2 style={{ margin: '0 0 12px', fontFamily: C3.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            V8 Frosted-glass icon pill is the strongest "unique creative clean tech." V1 is the safest bet.
          </h2>
          <p style={{ margin: '0 0 12px', fontFamily: C3.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>V8 wins on character.</strong> The frosted-glass treatment is technically ambitious (backdrop-filter blur), visually distinctive (warm paper bleeding through is a memorable detail), and stays minimal. Sea lion + 7 icons + active state. No text, no Cmd-K, no avatar. Hover for subpages. It's the variant most likely to make people screenshot the chrome.
          </p>
          <p style={{ margin: '0 0 12px', fontFamily: C3.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>V1 is V8 without the blur</strong> — same structure, lower risk. If you're worried about backdrop-filter perf or want an absolute-clean baseline before adding the glass effect, V1 is the iteration target. You could also ship V1 as the default and offer V8 as a premium "Pro" theme.
          </p>
          <p style={{ margin: 0, fontFamily: C3.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            V3 phantom-top and V4 sea-lion-hub are bold but probably too aggressive for non-power-users. V6 bottom-dock is unique but fights desktop conventions. V2 dock and V7 strip are useful but feel less "creative." V5 monogram is charming but the letter-collision tax limits it.
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV3 });
