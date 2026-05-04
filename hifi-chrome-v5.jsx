/* global React, window */
/* hifi-chrome-v5.jsx — BRAND-NEW DIMENSIONS · 25 variants · 6 groups.

   Six dimensions the v1-v4 ideations did NOT touch:
     A · Edge-anchored chrome (attached to edge with character)
     B · Spatial / depth-aware (perceived 3D, layering)
     C · Time / context-aware (chrome responds to state)
     D · Unconventional layout (not horiz-top, not vert-left)
     E · Search-led chrome (Cmd-K palette IS the chrome)
     F · Editorial micro-typography (typographic-led)

   Sea-lion crop + WSGlyph + VC card + SectionHead + PageHeader patterns
   reused from v3/v4. All locked tokens — Literata serif, Inter Tight sans,
   JetBrains Mono, clay accent, warm-paper surfaces. No off-palette.
*/

const C5 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WS = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];
const ACTIVE = 'Insights';
const SUBS = ['Overview', 'Retention', 'Format DNA', 'Audience', 'Posting'];
const ACT_SUB = 'Overview';
const KEYS = { Home: 'G H', Studio: 'G S', Library: 'G L', Insights: 'G I', Intel: 'G N', Inbox: 'G B', Calendar: 'G C' };

// ─── Sea-lion only (cropped from coopr-logo.png) ───────────
function SeaLion({ size = 22 }) {
  return (
    <span style={{
      width: size, height: size,
      backgroundImage: 'url(coopr-logo.png)',
      backgroundSize: `${size * (1205 / 341)}px ${size}px`,
      backgroundPosition: 'left center',
      backgroundRepeat: 'no-repeat',
      display: 'inline-block', flexShrink: 0,
    }} />
  );
}

// ─── 14×14 workspace SVG glyphs ────────────────────────────
function WSGlyph({ name, active = false, color }) {
  const stroke = color || (active ? 'var(--accent-primary)' : 'var(--fg-secondary)');
  const sw = 1.4;
  const c = { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none' };
  switch (name) {
    case 'Home':     return <svg {...c}><path d="M2 7 L7 3 L12 7 V12 H2 Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/><line x1="6" y1="12" x2="6" y2="9" stroke={stroke} strokeWidth={sw}/><line x1="8" y1="12" x2="8" y2="9" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Studio':   return <svg {...c}><path d="M3 11 L9.5 4.5 L11 6 L4.5 12.5 Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" transform="translate(0,-1)"/></svg>;
    case 'Library':  return <svg {...c}><rect x="2" y="2" width="3" height="10" stroke={stroke} strokeWidth={sw}/><rect x="6" y="3" width="3" height="9" stroke={stroke} strokeWidth={sw}/><rect x="10" y="4" width="2.5" height="8" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Insights': return <svg {...c}><circle cx="7" cy="7" r="5" stroke={stroke} strokeWidth={sw}/><path d="M7 2 V7 L10.5 8.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case 'Intel':    return <svg {...c}><circle cx="7" cy="7" r="5.5" stroke={stroke} strokeWidth={sw}/><circle cx="7" cy="7" r="2" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Inbox':    return <svg {...c}><path d="M2 4 L12 4 V11 H2 Z" stroke={stroke} strokeWidth={sw}/><path d="M2 4 L7 8 L12 4" stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/></svg>;
    case 'Calendar': return <svg {...c}><rect x="2" y="3" width="10" height="9" stroke={stroke} strokeWidth={sw}/><line x1="2" y1="6" x2="12" y2="6" stroke={stroke} strokeWidth={sw}/></svg>;
    default: return null;
  }
}

// ─── Hover popover (subpages reveal) ───────────────────────
function SubPopover({ ws = ACTIVE, anchor = 'center', shift = 0 }) {
  const left = anchor === 'left' ? 0 : anchor === 'right' ? 'auto' : '50%';
  const right = anchor === 'right' ? 0 : 'auto';
  const tx = anchor === 'center' ? `translateX(calc(-50% + ${shift}px))` : 'none';
  return (
    <div style={{
      position: 'absolute', top: '100%', marginTop: 10,
      left, right, transform: tx,
      background: 'var(--surface-1)', border: '1px solid var(--border-default)',
      borderRadius: 10, padding: '6px 4px',
      display: 'flex', flexDirection: 'column', gap: 1,
      minWidth: 180,
      boxShadow: '0 18px 44px -16px rgba(26,24,21,0.22), 0 4px 10px -4px rgba(26,24,21,0.10)',
      zIndex: 9,
    }}>
      <div style={{ padding: '6px 12px 4px', fontFamily: C5.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>{ws}</div>
      {SUBS.map(s => {
        const a = s === ACT_SUB;
        return (
          <div key={s} style={{
            padding: '7px 12px', margin: '0 2px', borderRadius: 6,
            background: a ? 'var(--accent-soft)' : 'transparent',
            color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
            fontFamily: a ? C5.serif : C5.sans, fontStyle: a ? 'italic' : 'normal',
            fontSize: a ? 14 : 13, fontWeight: a ? 500 : 400, cursor: 'pointer',
          }}>{s}</div>
        );
      })}
    </div>
  );
}

// ─── Standard control sliver behind every chrome ───────────
function Sliver({ pad = '32px 32px 0', minH = 110, caption = 'Insights · Overview · Wed Apr 29' }) {
  return (
    <div style={{ padding: pad, background: 'var(--bg-base)', minHeight: minH }}>
      <div style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>{caption}</div>
      <h2 style={{ margin: '6px 0 0', fontFamily: C5.serif, fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: 'var(--accent-primary)' }}>+22% saves</span>, +12% views. <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>One channel is going backwards.</span>
      </h2>
    </div>
  );
}

// State label (used for two-state mockups in Group C)
function StateLabel({ label }) {
  return (
    <div style={{ padding: '12px 24px 0', fontFamily: C5.mono, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>{label}</div>
  );
}

// ───────────────────────────────────────────────────────────
// GROUP A · Edge-anchored chrome
// ───────────────────────────────────────────────────────────

// A1 · Diagonal-cut top — slanted bottom edge of strip
function ChromeA1() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 260, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 22px), 0 100%)',
        padding: '14px 32px 36px',
        display: 'flex', alignItems: 'center', gap: 22,
      }}>
        <SeaLion size={26} />
        <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{
              fontFamily: C5.sans, fontSize: 13, fontWeight: a ? 600 : 500,
              color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
              borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none',
              paddingBottom: 2, cursor: 'pointer',
            }}>{w}</span>
          );
        })}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
      </div>
      <div style={{ paddingTop: 10 }}><Sliver /></div>
    </div>
  );
}

// A2 · Left-edge tab-bar — tabs stick OUT from the edge as flags
function ChromeA2() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, display: 'flex' }}>
      <aside style={{ width: 140, position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 16, left: 14 }}><SeaLion size={26} /></div>
        <div style={{ position: 'absolute', top: 64, left: 0, right: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                alignSelf: 'flex-start',
                background: a ? 'var(--surface-1)' : 'var(--surface-2)',
                border: '1px solid var(--border-subtle)', borderLeft: 'none',
                padding: '7px 16px 7px 14px',
                borderTopRightRadius: 999, borderBottomRightRadius: 999,
                fontFamily: a ? C5.serif : C5.sans, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14 : 13, fontWeight: a ? 600 : 500,
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                boxShadow: a ? '2px 4px 14px -8px rgba(26,24,21,0.16)' : 'none',
                marginRight: a ? -1 : 12,
                cursor: 'pointer',
              }}>{w}</span>
            );
          })}
        </div>
      </aside>
      <div style={{ flex: 1, borderLeft: '1px solid var(--border-default)', background: 'var(--surface-1)' }}>
        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 18 }}>
          {SUBS.map(s => {
            const a = s === ACT_SUB;
            return (
              <span key={s} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1, cursor: 'pointer' }}>{s}</span>
            );
          })}
        </div>
        <Sliver pad="20px 24px 0" minH={120} />
      </div>
    </div>
  );
}

// A3 · Right-edge minimal — chrome on the right (LTR-friendly content-first)
function ChromeA3() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, display: 'flex' }}>
      <div style={{ flex: 1, padding: '24px 32px' }}>
        <div style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>Insights · Overview · Wed Apr 29</div>
        <h2 style={{ margin: '6px 0 0', fontFamily: C5.serif, fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1, maxWidth: 760 }}>
          <span style={{ color: 'var(--accent-primary)' }}>+22% saves</span>, +12% views. <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>One channel is going backwards.</span>
        </h2>
        <p style={{ margin: '10px 0 0', fontFamily: C5.serif, fontStyle: 'italic', fontSize: 14.5, color: 'var(--fg-secondary)', maxWidth: 720, lineHeight: 1.55 }}>
          Content first. Nav drifts to the right where the cursor finishes, not where the eye starts.
        </p>
      </div>
      <aside style={{ width: 56, borderLeft: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', gap: 4 }}>
        <SeaLion size={24} />
        <span style={{ width: 24, height: 1, background: 'var(--border-subtle)', margin: '6px 0' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ width: 36, height: 36, borderRadius: 8, background: a ? 'var(--accent-soft)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <WSGlyph name={w} active={a} />
            </span>
          );
        })}
      </aside>
    </div>
  );
}

// A4 · Two-edge frame — top for nav, bottom for chat
function ChromeA4() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 360, position: 'relative' }}>
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 22 }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1, cursor: 'pointer' }}>{w}</span>
          );
        })}
      </div>
      <div style={{ padding: '20px 24px 80px' }}><Sliver pad="0" minH={80} /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--surface-1)', borderTop: '1px solid var(--border-subtle)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-tertiary)', flex: 1 }}>Ask anything · @ for sources, # for projects…</span>
        <span style={{ width: 26, height: 26, borderRadius: 999, background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6 L10 6 M7 3 L10 6 L7 9" stroke="var(--fg-on-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </span>
      </div>
    </div>
  );
}

// A5 · Asymmetric corner — one corner rounded, others sharp
function ChromeA5() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 260, padding: '16px 24px 0' }}>
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderTopLeftRadius: 32, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
        padding: '14px 22px 14px 36px',
        display: 'flex', alignItems: 'center', gap: 18,
        boxShadow: '0 -2px 0 rgba(182,83,43,0.18)',
        position: 'relative',
      }}>
        <SeaLion size={24} />
        <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ position: 'relative', fontFamily: a ? C5.serif : C5.sans, fontStyle: a ? 'italic' : 'normal', fontSize: a ? 15 : 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer' }}>
              {w}
              {a && <SubPopover anchor="center" />}
            </span>
          );
        })}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
      </div>
      <div style={{ background: 'var(--bg-base)', padding: '60px 0 0' }}><Sliver pad="0 12px" minH={120} /></div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// GROUP B · Spatial / depth-aware chrome
// ───────────────────────────────────────────────────────────

// B1 · Stacked translucent layers — three z-layers
function ChromeB1() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 280, padding: '22px 0 0', position: 'relative' }}>
      {/* Layer 3 (back) */}
      <div style={{ position: 'absolute', top: 38, left: '50%', transform: 'translateX(calc(-50% - 10px))', width: 580, height: 38, background: 'rgba(253,252,249,0.55)', border: '1px solid rgba(26,24,21,0.05)', borderRadius: 999, backdropFilter: 'blur(8px)' }} />
      {/* Layer 2 (mid) */}
      <div style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(calc(-50% + 6px))', width: 600, height: 42, background: 'rgba(253,252,249,0.78)', border: '1px solid rgba(26,24,21,0.06)', borderRadius: 999, backdropFilter: 'blur(12px)' }} />
      {/* Layer 1 (front) */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'rgba(253,252,249,0.92)', border: '1px solid var(--border-subtle)',
          borderRadius: 999, padding: '6px',
          display: 'inline-flex', alignItems: 'center', gap: 2,
          backdropFilter: 'blur(16px) saturate(140%)',
          boxShadow: '0 10px 28px -14px rgba(26,24,21,0.16)',
        }}>
          <span style={{ padding: '4px 8px 4px 6px' }}><SeaLion size={20} /></span>
          <span style={{ width: 1, height: 14, background: 'var(--border-subtle)', margin: '0 4px' }} />
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: a ? 'var(--accent-soft)' : 'transparent', cursor: 'pointer' }}>
                <WSGlyph name={w} active={a} />
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ paddingTop: 30 }}><Sliver /></div>
    </div>
  );
}

// B2 · Peek-through cutouts — chrome lives BEHIND the page, peeks through cutout slots
function ChromeB2() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 280, position: 'relative' }}>
      {/* Underlay band — the chrome lives here, behind the page */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 64, background: 'var(--surface-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <SeaLion size={22} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.sans, fontSize: 12, fontWeight: 600, color: a ? '#fdfcf9' : 'rgba(253,252,249,0.55)', cursor: 'pointer' }}>{w}</span>
          );
        })}
      </div>
      {/* Page surface with cutouts */}
      <div style={{ position: 'absolute', top: 16, left: 0, right: 0, bottom: 0, background: 'var(--bg-base)' }}>
        {/* Notch cutout near top — sea lion + active workspace peek through */}
        <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 280, height: 38, background: 'transparent', border: '1px solid var(--border-default)', borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 22, borderBottomRightRadius: 22, boxShadow: 'inset 0 -1px 0 rgba(26,24,21,0.04)' }} />
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 18px', color: 'var(--fg-on-ink)' }}>
          <SeaLion size={20} />
          <span style={{ width: 1, height: 14, background: 'rgba(253,252,249,0.18)' }} />
          <span style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 14, fontWeight: 500, color: 'var(--fg-on-ink)' }}>{ACTIVE}</span>
          <span style={{ fontFamily: C5.mono, fontSize: 10, color: 'rgba(253,252,249,0.45)' }}>/</span>
          <span style={{ fontFamily: C5.sans, fontSize: 12, color: 'rgba(253,252,249,0.78)' }}>{ACT_SUB}</span>
        </div>
        <div style={{ paddingTop: 56 }}><Sliver /></div>
      </div>
    </div>
  );
}

// B3 · Floating drop-shadow gradient — implies elevation above page
function ChromeB3() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 280, padding: '24px 24px 0', position: 'relative' }}>
      <div style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 14,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 18,
        boxShadow: '0 24px 48px -20px rgba(26,24,21,0.22), 0 4px 14px -6px rgba(26,24,21,0.10), 0 1px 0 rgba(253,252,249,0.6) inset',
        transform: 'translateY(-2px)',
      }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: a ? C5.serif : C5.sans, fontStyle: a ? 'italic' : 'normal', fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer' }}>{w}</span>
          );
        })}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
      </div>
      {/* Soft bleed-out gradient under the floating bar */}
      <div style={{ position: 'absolute', top: 76, left: 0, right: 0, height: 32, background: 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)', pointerEvents: 'none' }} />
      <div style={{ paddingTop: 24 }}><Sliver pad="0 0" /></div>
    </div>
  );
}

// B4 · Paper-fold — chrome looks like a folded sheet of paper at the top
function ChromeB4() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 280, position: 'relative' }}>
      {/* The folded "shadow" wedge — diagonal under-fold strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'linear-gradient(to bottom, rgba(26,24,21,0.10), transparent)' }} />
      <div style={{
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-default)',
        padding: '14px 26px',
        display: 'flex', alignItems: 'center', gap: 20,
        position: 'relative', zIndex: 2,
        backgroundImage: 'linear-gradient(to bottom, var(--surface-1) 0, var(--surface-1) calc(100% - 2px), rgba(26,24,21,0.04) 100%)',
      }}>
        <SeaLion size={24} />
        <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.sans, fontSize: 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 2, cursor: 'pointer' }}>{w}</span>
          );
        })}
      </div>
      {/* Crease shadow */}
      <div style={{ height: 14, background: 'linear-gradient(to bottom, rgba(26,24,21,0.08), transparent)', borderTop: '0' }} />
      <Sliver pad="6px 26px 0" minH={120} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// GROUP C · Time / context-aware chrome (two-state)
// ───────────────────────────────────────────────────────────

// C1 · Time-of-day shift — morning vs evening (color tint differs)
function C1Bar({ tone }) {
  const tint = tone === 'morning' ? 'rgba(255, 240, 220, 0.55)' : 'rgba(40, 32, 28, 0.06)';
  const accent = tone === 'morning' ? 'var(--accent-primary)' : 'var(--tone-info)';
  return (
    <div style={{ background: `linear-gradient(to bottom, ${tint}, transparent), var(--surface-1)`, borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
      <SeaLion size={22} />
      <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
      {WS.map(w => {
        const a = w === ACTIVE;
        return (
          <span key={w} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? `1.5px solid ${accent}` : 'none', paddingBottom: 1 }}>{w}</span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>{tone === 'morning' ? '08:14 · WAYANAD' : '21:42 · WAYANAD'}</span>
    </div>
  );
}
function ChromeC1() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <StateLabel label="STATE A · MORNING (08:14) · WARM PAPER WITH AMBER WASH" />
      <C1Bar tone="morning" />
      <Sliver pad="14px 24px 18px" minH={70} />
      <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      <StateLabel label="STATE B · EVENING (21:42) · COOLER WASH, INFO-SLATE ACCENT ON UNDERLINE" />
      <C1Bar tone="evening" />
      <Sliver pad="14px 24px 24px" minH={70} caption="Insights · Overview · Wed Apr 29 · Late" />
    </div>
  );
}

// C2 · Reading-mode duck — scrolling fades chrome to a strip; pause restores
function C2Bar({ ducked }) {
  if (ducked) {
    return (
      <div style={{ height: 6, background: 'linear-gradient(to bottom, rgba(26,24,21,0.18), transparent)', borderBottom: '1px solid rgba(26,24,21,0.05)' }} />
    );
  }
  return (
    <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 18, transition: 'all 240ms' }}>
      <SeaLion size={22} />
      <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
      {WS.map(w => {
        const a = w === ACTIVE;
        return (
          <span key={w} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1 }}>{w}</span>
        );
      })}
    </div>
  );
}
function ChromeC2() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <StateLabel label="STATE A · AT REST · CHROME FULL HEIGHT" />
      <C2Bar ducked={false} />
      <Sliver pad="14px 24px 18px" minH={70} />
      <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      <StateLabel label="STATE B · SCROLLING DOWN · CHROME DUCKS TO 6PX HAIRLINE WISP" />
      <C2Bar ducked={true} />
      <Sliver pad="14px 24px 24px" minH={70} caption="Insights · Overview · Reading mode" />
    </div>
  );
}

// C3 · Notification pulse — clay halo on workspace tab when new arrives
function ChromeC3() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <StateLabel label="STATE A · NORMAL · NO NEW SIGNAL" />
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1 }}>{w}</span>
          );
        })}
      </div>
      <Sliver pad="14px 24px 18px" minH={60} />
      <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      <StateLabel label="STATE B · INTEL HAS A FRESH SIGNAL · CLAY PULSE HALO ON THAT TAB" />
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          const pulse = w === 'Intel';
          return (
            <span key={w} style={{ position: 'relative', fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: pulse ? 'var(--accent-primary-press)' : a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1 }}>
              {w}
              {pulse && <span style={{ position: 'absolute', top: -3, right: -10, width: 6, height: 6, borderRadius: 999, background: 'var(--accent-primary)', boxShadow: '0 0 0 4px rgba(182,83,43,0.18)' }} />}
            </span>
          );
        })}
      </div>
      <Sliver pad="14px 24px 24px" minH={60} caption="Intel · 3 fresh signals since 09:30" />
    </div>
  );
}

// C4 · Idle vs focused — dim/breathing at idle, full snap at focus
function ChromeC4() {
  const idleCol = 'rgba(26,24,21,0.40)';
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <StateLabel label="STATE A · IDLE 30S · CHROME DIMS, BREATHES, KEEPS WHEREABOUTS LEGIBLE" />
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 18, opacity: 0.55 }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? idleCol : 'rgba(26,24,21,0.28)', borderBottom: a ? '1.5px solid rgba(182,83,43,0.45)' : 'none', paddingBottom: 1 }}>{w}</span>
          );
        })}
      </div>
      <Sliver pad="14px 24px 18px" minH={60} />
      <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      <StateLabel label="STATE B · CURSOR / KEY ACTIVITY · CHROME SNAPS BACK TO FULL" />
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1 }}>{w}</span>
          );
        })}
      </div>
      <Sliver pad="14px 24px 24px" minH={60} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// GROUP D · Unconventional layout chrome
// ───────────────────────────────────────────────────────────

// D1 · Radial / compass nav — workspaces around a sea-lion center
function ChromeD1() {
  const r = 92;
  const cx = 152, cy = 132;
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 360, display: 'flex' }}>
      <div style={{ width: 320, position: 'relative', borderRight: '1px solid var(--border-subtle)' }}>
        <svg width="304" height="280" viewBox="0 0 304 280" style={{ position: 'absolute', top: 8, left: 8 }}>
          <circle cx={cx} cy={cy} r={r} stroke="var(--border-subtle)" strokeWidth="1" fill="none" strokeDasharray="2 4" />
        </svg>
        <div style={{ position: 'absolute', left: cx + 8 - 22, top: cy + 8 - 22, width: 44, height: 44, borderRadius: 999, background: 'var(--surface-1)', border: '1px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px -8px rgba(26,24,21,0.18)' }}>
          <SeaLion size={22} />
        </div>
        {WS.map((w, i) => {
          const a = w === ACTIVE;
          const ang = (-Math.PI / 2) + (i * 2 * Math.PI / WS.length);
          const x = cx + 8 + Math.cos(ang) * r - 14;
          const y = cy + 8 + Math.sin(ang) * r - 14;
          return (
            <div key={w} style={{ position: 'absolute', left: x, top: y, width: 28, height: 28, borderRadius: 999, background: a ? 'var(--accent-soft)' : 'var(--surface-1)', border: `1px solid ${a ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <WSGlyph name={w} active={a} />
            </div>
          );
        })}
        <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, fontFamily: C5.mono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', textAlign: 'center' }}>COMPASS · {ACTIVE} · {ACT_SUB}</div>
      </div>
      <div style={{ flex: 1 }}><Sliver pad="20px 24px 0" minH={120} /></div>
    </div>
  );
}

// D2 · Diagonal 45° tilted strip — bold editorial
function ChromeD2() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -22, left: -40, right: -40, height: 78, background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', transform: 'rotate(-2.4deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, paddingTop: 22, boxShadow: '0 6px 16px -10px rgba(26,24,21,0.14)' }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: a ? C5.serif : C5.sans, fontStyle: a ? 'italic' : 'normal', fontSize: a ? 15 : 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1, cursor: 'pointer' }}>{w}</span>
          );
        })}
      </div>
      <div style={{ paddingTop: 90 }}><Sliver /></div>
    </div>
  );
}

// D3 · Card-stack peek — workspaces as a peek-card stack, swipe through
function ChromeD3() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, padding: '20px 0 0', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 560, height: 64 }}>
          {/* Back card 2 */}
          <div style={{ position: 'absolute', top: 6, left: 12, right: 12, height: 56, background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 14, opacity: 0.55 }} />
          {/* Back card 1 */}
          <div style={{ position: 'absolute', top: 3, left: 6, right: 6, height: 58, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 14, opacity: 0.78 }} />
          {/* Front card */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 14, boxShadow: '0 14px 28px -14px rgba(26,24,21,0.22)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px' }}>
            <SeaLion size={22} />
            <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: C5.mono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>NOW SHOWING · 04 / 07</span>
              <span style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 18, fontWeight: 600, color: 'var(--fg-primary)' }}>{ACTIVE} <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'normal', fontFamily: C5.mono, fontSize: 11 }}>/ {ACT_SUB}</span></span>
            </div>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: C5.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>← SWIPE →</span>
          </div>
        </div>
      </div>
      {/* Tiny peek dots underneath */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
        {WS.map(w => {
          const a = w === ACTIVE;
          return <span key={w} style={{ width: a ? 18 : 6, height: 6, borderRadius: 999, background: a ? 'var(--accent-primary)' : 'var(--border-default)' }} />;
        })}
      </div>
      <div style={{ paddingTop: 14 }}><Sliver /></div>
    </div>
  );
}

// D4 · Below-masthead TOC — chrome lives UNDER an editorial page header
function ChromeD4() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320 }}>
      {/* Editorial masthead — full-bleed, the chrome sits under it */}
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)', padding: '20px 28px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="coopr-logo.png" alt="COOPRLABS" style={{ height: 28, width: 'auto' }} />
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>VOL · 12 · ISSUE · 47 · WED · APR 29</span>
        </div>
      </div>
      {/* Chrome strip — placed UNDER the masthead, like a magazine TOC ribbon */}
      <div style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', padding: '8px 28px', display: 'flex', alignItems: 'center', gap: 22 }}>
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: a ? 15 : 13, fontWeight: a ? 600 : 400, color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 2, cursor: 'pointer' }}>{w}</span>
          );
        })}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>TABLE · OF · CONTENTS</span>
      </div>
      <Sliver pad="20px 28px 0" minH={120} />
    </div>
  );
}

// D5 · Chord-keyed nav — workspace tabs show keyboard shortcuts as monogram pairs
function ChromeD5() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 280, padding: '20px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 14, padding: '8px',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          boxShadow: '0 12px 28px -16px rgba(26,24,21,0.16)',
        }}>
          <span style={{ padding: '4px 10px 4px 6px' }}><SeaLion size={20} /></span>
          <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                position: 'relative',
                padding: '8px 12px', borderRadius: 8,
                background: a ? 'var(--accent-soft)' : 'transparent',
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                cursor: 'pointer',
              }}>
                <span style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--accent-primary-press)' : 'var(--fg-primary)' }}>{w}</span>
                <span style={{ display: 'inline-flex', gap: 3 }}>
                  {KEYS[w].split(' ').map((k, i) => (
                    <span key={i} style={{ fontFamily: C5.mono, fontSize: 9, padding: '1px 4px', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 3, color: 'var(--fg-tertiary)', fontWeight: 600 }}>{k}</span>
                  ))}
                </span>
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ paddingTop: 18 }}><Sliver /></div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// GROUP E · Search-led chrome
// ───────────────────────────────────────────────────────────

// E1 · Permanent visible search field, workspaces appear BELOW on focus
function ChromeE1() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, padding: '22px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 720, position: 'relative' }}>
          <div style={{
            background: 'var(--surface-1)', border: '1.5px solid var(--accent-primary)',
            borderRadius: 14, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 0 0 4px var(--accent-ring), 0 12px 28px -16px rgba(26,24,21,0.18)',
          }}>
            <SeaLion size={22} />
            <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
            <span style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-tertiary)', flex: 1 }}>What are you looking for?</span>
            <span style={{ width: 6, height: 18, background: 'var(--accent-primary)', animation: 'none' }} />
            <span style={{ fontFamily: C5.mono, fontSize: 10, padding: '3px 6px', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>⌘K</span>
          </div>
          {/* Workspace strip BELOW on focus */}
          <div style={{ marginTop: 8, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '6px', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', boxShadow: '0 12px 28px -18px rgba(26,24,21,0.14)' }}>
            {WS.map(w => {
              const a = w === ACTIVE;
              return (
                <span key={w} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: a ? 'var(--accent-soft)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: C5.sans, fontSize: 12, fontWeight: a ? 600 : 500, color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)', cursor: 'pointer' }}>
                  <WSGlyph name={w} active={a} /> {w}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 22 }}><Sliver /></div>
    </div>
  );
}

// E2 · Search ↔ breadcrumb morph — field shrinks to crumb when not focused
function ChromeE2() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <StateLabel label="STATE A · UNFOCUSED · FIELD MORPHS DOWN TO A QUIET BREADCRUMB" />
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        <span style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)' }}>{ACTIVE}</span>
        <span style={{ fontFamily: C5.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>/</span>
        <span style={{ fontFamily: C5.sans, fontSize: 12.5, color: 'var(--fg-secondary)' }}>{ACT_SUB}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: C5.mono, fontSize: 10, padding: '3px 6px', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--fg-tertiary)' }}>⌘K to search</span>
      </div>
      <Sliver pad="12px 24px 18px" minH={70} />
      <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      <StateLabel label="STATE B · FOCUSED · CRUMB EXPANDS INTO A LIVE SEARCH FIELD" />
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--accent-primary)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'inset 0 -4px 0 var(--accent-ring)' }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        <span style={{ fontFamily: C5.sans, fontSize: 13, color: 'var(--fg-primary)', flex: 1 }}>fujikawa cold-open<span style={{ marginLeft: 4, display: 'inline-block', width: 6, height: 16, background: 'var(--accent-primary)', verticalAlign: 'middle' }} /></span>
        <span style={{ fontFamily: C5.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>17 RESULTS</span>
      </div>
      <Sliver pad="12px 24px 24px" minH={70} caption="Search · 17 results across 5 scopes" />
    </div>
  );
}

// E3 · Search-as-everything — chrome IS the search field, nothing else
function ChromeE3() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, padding: '40px 0 0', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 22, left: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <SeaLion size={20} />
      </div>
      <div style={{ position: 'absolute', top: 22, right: 24, fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>{ACTIVE} · {ACT_SUB}</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 880, background: 'var(--surface-1)',
          border: '1px solid var(--border-default)', borderRadius: 18,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 26px 60px -28px rgba(26,24,21,0.20), 0 4px 14px -6px rgba(26,24,21,0.08)',
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="10" cy="10" r="6.5" stroke="var(--fg-tertiary)" strokeWidth="1.5"/><line x1="15" y1="15" x2="20" y2="20" stroke="var(--fg-tertiary)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 22, color: 'var(--fg-tertiary)', flex: 1, lineHeight: 1.2 }}>Anything · go to a workspace, search a post, ask Coopr, schedule…</span>
          <span style={{ fontFamily: C5.mono, fontSize: 11, padding: '4px 8px', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--fg-secondary)', fontWeight: 600 }}>⌘K</span>
        </div>
      </div>
      <div style={{ paddingTop: 14 }}><Sliver /></div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// GROUP F · Editorial micro-typography chrome
// ───────────────────────────────────────────────────────────

// F1 · Single italic-serif line — one elegant cursive-ish strip, no boxes
function ChromeF1() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 240 }}>
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '18px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'nowrap' }}>
          <SeaLion size={22} />
          <span style={{ flex: 1, fontFamily: C5.serif, fontSize: 17, color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {WS.map((w, i) => {
              const a = w === ACTIVE;
              return (
                <React.Fragment key={w}>
                  {i > 0 && <span style={{ color: 'var(--fg-tertiary)', fontFamily: C5.mono, fontSize: 11, margin: '0 14px' }}>·</span>}
                  <span style={{ fontStyle: a ? 'italic' : 'normal', fontWeight: a ? 600 : 400, color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1, cursor: 'pointer' }}>{w}</span>
                </React.Fragment>
              );
            })}
          </span>
        </div>
      </div>
      <Sliver pad="22px 30px 0" minH={120} />
    </div>
  );
}

// F2 · Hand-drawn rule decorations — magazine pull-quote dividers
function HRule() {
  return (
    <svg width="28" height="14" viewBox="0 0 28 14"><path d="M0 7 L8 7 M14 4 Q16 7 18 4 M14 10 Q16 7 18 10 M22 7 L28 7" stroke="var(--fg-tertiary)" strokeWidth="0.9" strokeLinecap="round" fill="none" /></svg>
  );
}
function ChromeF2() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 240 }}>
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '16px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SeaLion size={22} />
          <HRule />
          {WS.map((w, i) => {
            const a = w === ACTIVE;
            return (
              <React.Fragment key={w}>
                {i > 0 && <HRule />}
                <span style={{ fontFamily: a ? C5.serif : C5.sans, fontStyle: a ? 'italic' : 'normal', fontSize: a ? 15 : 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)', cursor: 'pointer' }}>{w}</span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <Sliver pad="20px 28px 0" minH={120} />
    </div>
  );
}

// F3 · Pull-quote rotation — quote rotates with the active workspace
function ChromeF3() {
  const QUOTES = {
    Home: 'Start anywhere. I’ll keep up.',
    Studio: 'A workspace, not a pipeline.',
    Library: 'Everything you’ve made, in one place.',
    Insights: 'Three numbers tell most of the story.',
    Intel: 'What’s moving in your corner of the world.',
    Inbox: 'Reply once, well.',
    Calendar: 'A week is a small story.',
  };
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 280 }}>
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1, cursor: 'pointer' }}>{w}</span>
          );
        })}
      </div>
      {/* Pull-quote band — italic, 14px, rotates with the workspace */}
      <div style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', fontWeight: 500 }}>“{QUOTES[ACTIVE]}”</span>
        <span style={{ fontFamily: C5.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>— {ACTIVE.toUpperCase()}</span>
      </div>
      <Sliver pad="16px 28px 0" minH={120} />
    </div>
  );
}

// F4 · Single epigraph — one editorial line ABOVE a quiet nav
function ChromeF4() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 280 }}>
      <div style={{ background: 'var(--surface-1)', padding: '18px 30px 4px', textAlign: 'center', borderBottom: '0' }}>
        <div style={{ fontFamily: C5.mono, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700, marginBottom: 6 }}>EPIGRAPH · WED · APR 29</div>
        <div style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 18, color: 'var(--fg-primary)', fontWeight: 500, letterSpacing: '-0.01em' }}>
          “The work of <span style={{ color: 'var(--accent-primary)' }}>making</span> is the work of <span style={{ color: 'var(--accent-primary)' }}>noticing</span>.”
        </div>
      </div>
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>
        <SeaLion size={20} />
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C5.sans, fontSize: 12.5, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1, cursor: 'pointer' }}>{w}</span>
          );
        })}
      </div>
      <Sliver pad="20px 30px 0" minH={100} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// VC card · SectionHead · PageHeader
// ───────────────────────────────────────────────────────────
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
          <span style={{ fontFamily: C5.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: C5.serif, fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>{title}</h3>
          <span style={{ fontFamily: C5.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C5.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>ref · {refs}</span>
        </div>
      </div>
      <div style={{ background: 'var(--bg-base)' }}>{children}</div>
      <div style={{ padding: '12px 24px 14px', borderTop: '1px solid var(--border-default)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: C5.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-success)', marginBottom: 4 }}>WHAT</div>
          <div style={{ fontFamily: C5.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{what}</div>
        </div>
        <div>
          <div style={{ fontFamily: C5.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-warning)', marginBottom: 4 }}>TRADEOFF</div>
          <div style={{ fontFamily: C5.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{tradeoff}</div>
        </div>
      </div>
    </article>
  );
}

function SectionHead({ kicker, title, deck }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 18 }}>
      <div style={{ fontFamily: C5.mono, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 6 }}>{kicker}</div>
      <h2 style={{ margin: '0 0 6px', fontFamily: C5.serif, fontWeight: 500, fontSize: 30, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1 }}>{title}</h2>
      <p style={{ margin: 0, fontFamily: C5.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>{deck}</p>
    </div>
  );
}

function PageHeader() {
  return (
    <div style={{ padding: '40px 32px 28px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
      <div style={{ maxWidth: 1376, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <img src="coopr-logo.png" alt="COOPRLABS" style={{ height: 32, width: 'auto' }} />
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C5.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            CHROME IDEATION · v5 · BRAND-NEW DIMENSIONS
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontFamily: C5.serif, fontWeight: 500, fontSize: 40, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Twenty-five variants across <span style={{ fontStyle: 'italic' }}>six dimensions you haven't seen.</span>
        </h1>
        <p style={{ margin: '0 0 12px', fontFamily: C5.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>
          Edge-anchored chrome (with character at the seam). Spatial / depth-aware (perceived 3D). Time- and context-aware (chrome reacts to state). Unconventional layouts (radial, diagonal, card-stack). Search-led (the palette IS the chrome). Editorial micro-typography (a single line of italic, a hand-drawn rule, a rotating pull-quote).
        </p>
        <p style={{ margin: 0, fontFamily: C5.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          v1 · v2 · v3 · v4 · <span style={{ color: 'var(--accent-primary)' }}>v5 brand-new dimensions · this page</span>
        </p>
      </div>
    </div>
  );
}

function HF_ChromeIdeationV5() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <PageHeader />
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 32px 96px' }}>

        <SectionHead
          kicker="GROUP A · EDGE-ANCHORED · 5 VARIANTS"
          title="Chrome attached to a viewport edge — with character."
          deck="Not floating, not centered. The chrome lives on an edge but does something interesting at that seam: a diagonal cut, a tab-bar that flags out, a right-edge dock, a top-and-bottom frame, an asymmetric corner."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="A1" title="Diagonal-cut top" sub="slanted bottom edge of the strip" refs="Bauhaus posters · Ginza Six signage"
              what="Top chrome strip with a clip-path slant on its bottom edge. The page surface meets it at a 22px diagonal. Sea lion + workspace tabs + mono dateline. Underline on active workspace stays parallel — only the strip edge is angled."
              tradeoff="Diagonals draw the eye; if the page below is also strongly editorial it can feel like two competing slants. The clip-path also adds a tiny non-rectangular hit-zone at the seam.">
            <ChromeA1 />
          </VC>
          <VC id="A2" title="Left-edge tab-bar" sub="tabs flag out from the edge as page-flags" refs="Field Notes index tabs · Moleskine sticky-flags"
              what="Vertical column on the left holds the sea lion. Each workspace is a tab that protrudes from the edge — the active tab extends fully into the body, inactive tabs sit a few pixels short. Subtabs run horizontally across the top of the body panel."
              tradeoff="Eats ~140px on the left. Tab-flag protrusion reads as 'paper file', which is editorial but unmistakably analog — could feel dated if the rest of the surface is high-tech.">
            <ChromeA2 />
          </VC>
          <VC id="A3" title="Right-edge minimal" sub="56px dock on the right · content first" refs="ProtoPie sidebar · Bear right-edge"
              what="LTR reading flow puts content on the left where the eye starts; the 56px dock sits on the right where the cursor finishes after reading. Sea lion top, 7 glyphs stacked. Active workspace gets clay-soft fill."
              tradeoff="Right-edge nav inverts every web convention. Reach is a nuance — RTL languages would feel right; LTR users may take a beat to learn. Save it for the daily-driver mode, not first-touch.">
            <ChromeA3 />
          </VC>
          <VC id="A4" title="Two-edge frame" sub="top for nav · bottom for chat · the page is bracketed" refs="Notion sidebar+composer · iMessage app strip"
              what="Top edge holds the workspace nav (familiar). Bottom edge holds a permanent chat composer. The page becomes a 'framed letter' — bracketed by structure on both edges. Chat is always one keystroke away on every page."
              tradeoff="Eats ~52px top + ~50px bottom. On 900px-tall canvases, the body shrinks to ~800px. Best for surfaces that are already vertical-light (Insights, Inbox).">
            <ChromeA4 />
          </VC>
          <VC id="A5" title="Asymmetric corner" sub="one corner rounded, others sharp · playful asymmetry" refs="Italian cinema title cards · Wes Anderson menus"
              what="The chrome strip has a single 32px rounded top-left corner, the other three corners stay sharp. A 2px clay accent line traces the rounded edge. Subtab popover opens centered under the active workspace."
              tradeoff="Asymmetry is a strong stylistic choice — it reads as 'designed' rather than 'systematic.' One-off corner radii also fight the rest of the design system (uniform 8/12/14px radii on cards).">
            <ChromeA5 />
          </VC>
        </div>

        <SectionHead
          kicker="GROUP B · SPATIAL / DEPTH-AWARE · 4 VARIANTS"
          title="Chrome that reads as 3D, not flat."
          deck="Stacked translucent layers. Chrome behind the page peeking through cutouts. Drop-shadow gradients that imply elevation. Paper-fold metaphor with a crease shadow. Each variant trades on perceived depth — the page is no longer one plane."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="B1" title="Stacked translucent layers" sub="three z-layers behind the active pill" refs="visionOS layered glass · macOS Sonoma menubar"
              what="Three overlapping pills, each more translucent than the front one. Active pill is 92% opacity, mid layer is 78%, back layer is 55%. Subtle horizontal offsets imply z-axis depth. Only the front layer is interactive."
              tradeoff="Backdrop-filter has perf cost. Three layers of blur on warm-paper can wash colors out — needs careful tuning of opacity ladder. Visually rich but technically expensive.">
            <ChromeB1 />
          </VC>
          <VC id="B2" title="Peek-through cutouts" sub="chrome lives BEHIND the page · peeks through a notch" refs="Dynamic Island · Apple Vision Pro window peeks"
              what="Surface-ink chrome is full-bleed BEHIND the page surface. The page has a 280px-wide notch at top-center cutting through to the chrome — sea lion + active workspace + subtab read in cream-on-ink. Remaining workspaces are hidden under the page (revealed on hover-drag-down)."
              tradeoff="Inverts the warm-paper-first aesthetic locally. Most of the chrome is invisible at rest, which makes 'where am I' clear (the notch shows it) but 'where can I go' invisible. Needs a discoverable interaction to expand.">
            <ChromeB2 />
          </VC>
          <VC id="B3" title="Floating drop-shadow gradient" sub="chrome implies elevation above the page" refs="Linear top bar · Stripe Atlas sticky bar"
              what="Chrome is a rounded card with a strong layered drop-shadow + soft bleed-out gradient under it. The chrome appears to hover ~6px above the page. Inset highlight on the top edge sells the lighting. Light-only — never dark."
              tradeoff="Drop shadows on warm-paper need warm-ink alpha (rgba(26,24,21,X)), not pure black, to avoid the disharmony from the R7 shadow sweep. Done right it's premium; done wrong it looks like a 2014 Material card.">
            <ChromeB3 />
          </VC>
          <VC id="B4" title="Paper-fold" sub="chrome looks like a folded sheet of paper at the top" refs="Field Notes folded notebooks · 1960s Penguin covers"
              what="Top strip with a 14px crease-shadow gradient where it meets the page — reads as a sheet of paper folded over the top of the body. The chrome is the 'cover'; the page is the 'inside.' Pure CSS gradient, no images."
              tradeoff="The crease shadow is small — may read as a generic shadow rather than a fold on first glance. Best paired with a tiny mono caption ('FOLDED · READING') in the corner to spell the metaphor.">
            <ChromeB4 />
          </VC>
        </div>

        <SectionHead
          kicker="GROUP C · TIME / CONTEXT-AWARE · 4 VARIANTS"
          title="Chrome that responds to state — shown as A/B mockups."
          deck="The static prototypes can't animate, so each of these renders the two states stacked with state labels. The behavior is what matters: chrome that knows the time of day, that ducks when you're reading, that pulses when something's new, that breathes when you're idle."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="C1" title="Time-of-day shift" sub="morning warm-amber wash · evening cool slate-blue" refs="Apple Sky theme · Things 3 day-night"
              what="A subtle gradient wash on the chrome bg shifts with the system clock. Morning (06–18) gets a warm amber wash + clay underline accent. Evening (18–06) gets a cool slate wash + tone-info accent on the underline. Same structure, two atmospheres."
              tradeoff="The wash is small and could feel like a bug if it's too subtle, or a costume if it's too loud. Needs a 6-step dimming curve through the day, not a binary flip. Eats QA cycles.">
            <ChromeC1 />
          </VC>
          <VC id="C2" title="Reading-mode duck" sub="scroll fades chrome to a 6px wisp · pause restores" refs="Safari Reader mode · Medium reading view"
              what="At rest the chrome is full-height. As the user scrolls down past 200px, the chrome fades + collapses to a 6px gradient hairline at the top. Mouse pause or scroll-up restores it. Maximum chrome-off when reading; immediate access when needed."
              tradeoff="Animation-dependent. A bad scroll-snap can make the chrome flicker. Needs a velocity-aware threshold so a tiny accidental scroll doesn't dismiss it.">
            <ChromeC2 />
          </VC>
          <VC id="C3" title="Notification pulse" sub="active workspace pulses clay halo on fresh signal" refs="iOS notification dot · Linear inbox glow"
              what="When a workspace receives a new signal (Intel pulse, Inbox DM, Library indexed clip), its tab gets a tiny clay dot + a soft halo ring + the label color shifts to accent-primary-press. Pulse decays over 8s. Calmer than a red badge — feels editorial."
              tradeoff="Clay-on-warm-paper has subtle contrast at the dot scale (6px). May need to be 7-8px for visibility on Retina displays. Halo can be misread as 'active' rather than 'new'.">
            <ChromeC3 />
          </VC>
          <VC id="C4" title="Idle vs focused" sub="dim/breathing at idle · snaps in on focus" refs="macOS menubar dim · Apple TV idle screensaver"
              what="After 30s of no input, the chrome fades to ~55% opacity and gently breathes (1.0 → 0.92 opacity, 4s sine). On any input event (keystroke, mousemove, scroll), it snaps back to full instantly. Creates a 'the room dimmed while you weren't looking' feeling."
              tradeoff="Idle animations on the page chrome are unusual on desktop apps — could read as a bug to first-time users. Power-saving claim is dubious; this is purely aesthetic.">
            <ChromeC4 />
          </VC>
        </div>

        <SectionHead
          kicker="GROUP D · UNCONVENTIONAL LAYOUT · 5 VARIANTS"
          title="Not horizontal-top, not vertical-left."
          deck="Radial compass nav. A diagonal 45° tilted strip. A card-stack you swipe through. Chrome BELOW a magazine masthead. Workspaces with their keyboard-shortcut chord shown as monogram pairs. Bold geometry in a system that's been mostly horizontal."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="D1" title="Radial compass nav" sub="workspaces orbit a sea-lion center" refs="Pinterest old radial picker · macOS Wheel of Time prototypes"
              what="Sea lion sits in a 44px circle at the center of a 184px dashed orbit. The 7 workspaces are 28px nodes equally spaced around the orbit. Active workspace gets clay-soft fill + clay border. The whole nav fits in a 320px panel that lives left of the body."
              tradeoff="Radial nav is hard to scan linearly — names of workspaces get hidden under glyphs only. Best paired with a label layer on hover. Large for what it shows (320px).">
            <ChromeD1 />
          </VC>
          <VC id="D2" title="Diagonal 45° tilted strip" sub="chrome is rotated −2.4° · bold editorial" refs="Wired '90s issue covers · Bauhaus typography"
              what="Chrome strip rotates by -2.4° and bleeds slightly off the canvas edges. The tilt is subtle enough not to disorient but unmistakable. Active workspace gets serif-italic + clay underline. Reads as editorial-attitude."
              tradeoff="Tilt fights every grid in the page below. Aligning the strip with the page becomes hard — needs a thicker padding band so the rotation doesn't crowd content.">
            <ChromeD2 />
          </VC>
          <VC id="D3" title="Card-stack peek" sub="workspaces as a peek-card stack · swipe to switch" refs="Apple Wallet pass stack · Tinder card UI"
              what="The active workspace card sits on top of a 3-deep peek-card stack. Behind it: 2 increasingly faded cards hint at the rest. Tiny mono caption ('NOW SHOWING · 04 / 07') gives orientation. Below: a 7-dot ladder that highlights position. Swipe / arrow keys cycle."
              tradeoff="Switching between non-adjacent workspaces is slow (cycle through). Peek metaphor is foreign on desktop where users expect parallel access. Best for touch + small screens — overkill on a 1440 desktop.">
            <ChromeD3 />
          </VC>
          <VC id="D4" title="Below-masthead TOC" sub="chrome ribbon UNDER an editorial masthead" refs="The Atlantic site header · NYRB issue page"
              what="Full COOPRLABS logo + volume / issue / date masthead at the very top — no chrome. Below the masthead, a thin ribbon holds the workspace nav as italic-serif tabs. Reads as a magazine table-of-contents under the magazine title."
              tradeoff="Eats ~100px (masthead 50 + ribbon 40 + gutters). Masthead bands feel formal; daily users may wish the masthead would shrink after the first visit.">
            <ChromeD4 />
          </VC>
          <VC id="D5" title="Chord-keyed nav" sub="workspace tabs show their G+letter shortcut as a monogram pair" refs="Linear keyboard shortcuts · Vim leader keys · Zed action chords"
              what="Each workspace tab stacks the workspace name above its keyboard chord (G H, G S, G L, G I, G N, G B, G C — Vim-style leader chords). Mono caps in tiny chips below the label. Trains keyboard navigation explicitly. Active tab clay-soft."
              tradeoff="Showing chords always-on can look noisy — ~2 lines per tab. Best as an opt-in 'show shortcuts' toggle, or fade-in after first day of usage.">
            <ChromeD5 />
          </VC>
        </div>

        <SectionHead
          kicker="GROUP E · SEARCH-LED · 3 VARIANTS"
          title="The search field is the chrome."
          deck="What if Cmd-K was always visible — the navigation IS the search? Three takes: permanent search with workspaces revealed below on focus; search that morphs to breadcrumb when not focused; a search-as-everything box that swallows nav, search, and Coopr-asks into one giant editorial input."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="E1" title="Permanent search · workspaces below on focus" sub="search top, 7-tab strip below when active" refs="Raycast main window · Linear search-first"
              what="Search field with clay focus ring sits at top, 720px wide. Below it, a thin pill with 7 workspace tabs (icon + label). The search drives both 'find a thing' and 'switch to a workspace' — typing 'lib' selects Library, typing 'fujikawa' searches posts."
              tradeoff="Two interaction patterns share one input — could create ambiguity ('did this search? did this navigate?'). Needs robust precedence rules and visible 'switching to' confirmation.">
            <ChromeE1 />
          </VC>
          <VC id="E2" title="Search ↔ breadcrumb morph" sub="quiet crumb at rest · expands to live field on focus" refs="Notion top bar · Arc URL bar"
              what="At rest the chrome shows a quiet breadcrumb: sea lion · Insights / Overview · ⌘K hint. On focus, the breadcrumb morphs into a live search field with cursor + hit-count caption. Same physical space, two purposes — 'where am I' and 'what am I looking for'."
              tradeoff="Morph-on-focus needs a 200ms transition or it feels like the chrome 'glitches' between modes. Some users will never realize the crumb is also the search.">
            <ChromeE2 />
          </VC>
          <VC id="E3" title="Search-as-everything" sub="one giant editorial input · nav, search, ask Coopr in one" refs="ChatGPT prompt-bar-as-everything · Spotlight Mac"
              what="One 880px-wide search box dominates the chrome. Italic-serif placeholder reads 'Anything · go to a workspace, search a post, ask Coopr, schedule…'. Sea lion top-left, current location top-right (mono). The input is the entire UI. ⌘K is implicit — the input is always focused."
              tradeoff="Maximum minimalism = maximum learning cost. Users have to learn that 'studio' switches workspaces, 'fujikawa' searches, '/draft a hook' asks Coopr. Best if the input has a strong autocomplete/intent-classifier.">
            <ChromeE3 />
          </VC>
        </div>

        <SectionHead
          kicker="GROUP F · EDITORIAL MICRO-TYPOGRAPHY · 4 VARIANTS"
          title="Chrome that's typographic-led."
          deck="No icons. Just type. A single italic-serif line reading like a literary masthead. Hand-drawn rule decorations between workspace names. A pull-quote that rotates with the active workspace. A single epigraph above a quiet nav. Closest to literary-supplement aesthetic."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="F1" title="Single italic-serif line" sub="one elegant line · workspaces separated by mono dots" refs="London Review of Books spine · Granta TOC"
              what="One horizontal line: sea lion + workspace names in 17px Literata, separated by a tiny mono '·'. Active workspace becomes italic + bold + clay-underlined. No background pill, no boxes — just a typographic strip. Most literary of the variants."
              tradeoff="One-note ladder — every workspace looks similar at a glance. Active state is the only visual differentiation. Works only if the type ladder is dialed in.">
            <ChromeF1 />
          </VC>
          <VC id="F2" title="Hand-drawn rule decorations" sub="magazine pull-quote dividers between workspaces" refs="Field Notes dividers · 1960s Penguin section breaks"
              what="Each workspace name is separated by a small SVG hand-drawn rule (line · curve · curve · line). The rules feel sketched, not generated. The rest of the chrome stays restrained — type only, no fills."
              tradeoff="Hand-drawn elements need a few variations or they read as repeated stamps. Also delicate at tiny sizes — needs anti-aliased SVG strokes to not look pixelated.">
            <ChromeF2 />
          </VC>
          <VC id="F3" title="Pull-quote rotation" sub="quote band rotates with active workspace" refs="The Paris Review section pages · NYRB epigraphs"
              what="Standard chrome on top. A second band below holds an italic-serif pull-quote that rotates per workspace ('Three numbers tell most of the story.' for Insights). Each workspace gets its own permanent quote — feels like the editor's voice for that section."
              tradeoff="The quotes need to be genuinely good — bad ones read as filler. Adds ~40px of chrome height. Quote rotation is content-design work, not just engineering.">
            <ChromeF3 />
          </VC>
          <VC id="F4" title="Single epigraph" sub="one editorial line above the nav · centered" refs="NYRB issue intros · The New Yorker contributor page"
              what="A single epigraph in italic-serif sits centered above the chrome — typographer's mono kicker ('EPIGRAPH · WED · APR 29'), then the line itself ('The work of making is the work of noticing.'). Two clay accents on the verbs. Nav below stays restrained."
              tradeoff="Epigraph reads as 'set dressing' on first viewing — users may want to dismiss it. Needs to be daily-rotated or it gets stale fast. Eats vertical space (~70px).">
            <ChromeF4 />
          </VC>
        </div>

        {/* Closing recommendation */}
        <article style={{ marginTop: 28, padding: '24px 28px 26px', borderRadius: 14, background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)' }}>
          <div style={{ fontFamily: C5.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 8 }}>Synthesis · the strongest three</div>
          <h2 style={{ margin: '0 0 12px', fontFamily: C5.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            B3 floating drop-shadow · D4 below-masthead TOC · E2 breadcrumb-morph search.
          </h2>
          <p style={{ margin: '0 0 12px', fontFamily: C5.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>B3 floating drop-shadow</strong> reads as 'premium / attention-paid' without leaving the warm-paper aesthetic — closest to a polished daily-driver. <strong>D4 below-masthead TOC</strong> is the most honest editorial direction: gives the brand its full COOPRLABS masthead and treats the workspace strip as the issue's table-of-contents. <strong>E2 breadcrumb-morph</strong> is the most behaviorally interesting — solves where-am-I and what-am-I-looking-for in one element with a 200ms morph.
          </p>
          <p style={{ margin: 0, fontFamily: C5.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            If you want a single bold statement: D2 diagonal-strip is the variant that would make people screenshot the chrome. If you want a quiet daily companion: B3 + E2 combined. If you want to push into truly novel territory: C2 reading-mode duck (most novel behavior in the set).
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV5 });
