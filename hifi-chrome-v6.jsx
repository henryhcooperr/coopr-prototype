/* global React, window, HF_InsightsOverview */
/* hifi-chrome-v6.jsx — chrome variants APPLIED to the real Insights · Overview
   surface (the same surface tweaks.html drives). Twelve panels:
     A · Asymmetric corner       — 3 takes (clay-trace · ink-trace · bracket-bottom)
     B · Floating drop-shadow    — 3 takes (gentle · dramatic · lateral)
     C · Reading-mode duck       — 3 states (full · ducked · dock-mode)
     D · Idle vs focused         — 3 states (focused · idle · deep-idle chevron)

   Surface mount strategy:
   We monkey-patch window.HfShell once at script-load time so that when
   HF_InsightsOverview calls <HfShell>...</HfShell>, the slim replacement
   renders ONLY the children (no topbar, no subtabs). Each v6 chrome variant
   then sits cleanly above the real surface body. The tweaks gallery is on
   a separate page (tweaks.html), so this patch does not affect it.
*/

// ─── Replace HfShell with a slim version (chrome-free) ──────
// Runs once when this script loads, before any panel mounts. The original
// HfShell is preserved on window.__OrigHfShell in case anything needs it.
if (typeof window !== 'undefined' && window.HfShell && !window.__cv6Patched) {
  window.__OrigHfShell = window.HfShell;
  window.HfShell = function HfShellSlim({ children, style = {} }) {
    return (
      <div className="hf" style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-base)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--fg-primary)',
        overflow: 'hidden',
        ...style,
      }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    );
  };
  window.__cv6Patched = true;
}

const C6 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WS = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];
const ACTIVE = 'Insights';

// ─── Sea lion crop + workspace SVG glyphs ──────────────────
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
// (Workspace tabs in v6 use text labels, not SVG glyphs — keep the file lean.)

// ─── Real surface mount ─────────────────────────────────────
// Renders <HF_InsightsOverview /> from hifi-more.jsx. The wrapper relies on
// a scoped <style> block (injected once at page level) to hide the native
// HfShell topbar/subtabs inside `.cv6-canvas`, leaving only the body content.
function RealSurface() {
  const Comp = window.HF_InsightsOverview;
  if (!Comp) {
    return (
      <div style={{ padding: 32, fontFamily: C6.mono, fontSize: 12, color: 'var(--tone-danger)' }}>
        HF_InsightsOverview not found on window — check script load order in chrome-v6.html.
      </div>
    );
  }
  return <Comp />;
}

// ─── Canvas wrapper ────────────────────────────────────────
// Fixed 1440 × 760 frame so each panel's chrome is judged at the real
// shell width. The .cv6-canvas class triggers the topbar/subtabs hide rule.
function Canvas({ chrome, contentTop = 60, dim = 1, blur = 0 }) {
  return (
    <div className="cv6-canvas" style={{
      width: 1440, height: 760,
      background: 'var(--bg-base)', position: 'relative', overflow: 'hidden',
      border: '1px solid var(--border-default)', borderRadius: 4,
    }}>
      {chrome}
      <div style={{
        position: 'absolute', top: contentTop, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        opacity: dim, filter: blur ? `blur(${blur}px)` : 'none',
        transition: 'opacity 240ms ease',
      }}>
        <RealSurface />
      </div>
    </div>
  );
}

// State label above each canvas
function StateRibbon({ label, sub }) {
  return (
    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'baseline', gap: 14, borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontFamily: C6.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>{label}</span>
      <span style={{ fontFamily: C6.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// SECTION 1 · ASYMMETRIC CORNER · 3 takes
// ───────────────────────────────────────────────────────────

// A5a · Top-left rounded · clay-trace
function A5aChrome() {
  return (
    <div style={{
      position: 'absolute', top: 12, left: 12, right: 12, height: 48,
      background: 'var(--surface-1)',
      borderTopLeftRadius: 24, borderTopRightRadius: 0,
      borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
      border: '1px solid var(--border-subtle)',
      borderBottom: '1.5px solid var(--accent-primary)',
      display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px 0 28px',
      zIndex: 10,
      boxShadow: '0 -2px 0 rgba(182,83,43,0.08)',
    }}>
      <SeaLion size={22} />
      <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
      {WS.map(w => {
        const a = w === ACTIVE;
        return (
          <span key={w} style={{ fontFamily: a ? C6.serif : C6.sans, fontStyle: a ? 'italic' : 'normal', fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer' }}>{w}</span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: C6.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
    </div>
  );
}
function A5a() { return <Canvas chrome={<A5aChrome />} contentTop={70} />; }

// A5b · Top-right rounded · ink-trace
function A5bChrome() {
  return (
    <div style={{
      position: 'absolute', top: 12, left: 12, right: 12, height: 48,
      background: 'var(--surface-1)',
      borderTopLeftRadius: 0, borderTopRightRadius: 24,
      borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
      border: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--fg-primary)',
      display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px 0 22px',
      zIndex: 10,
    }}>
      <SeaLion size={22} />
      <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
      {WS.map(w => {
        const a = w === ACTIVE;
        return (
          <span key={w} style={{ fontFamily: C6.sans, fontSize: 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--fg-primary)' : 'none', paddingBottom: 1, cursor: 'pointer' }}>{w}</span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: C6.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>VOL · 12 · ISS · 47</span>
    </div>
  );
}
function A5b() { return <Canvas chrome={<A5bChrome />} contentTop={70} />; }

// A5c · Bottom-bracket · chrome strip with rounded BOTTOM corners only
function A5cChrome() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 56,
      background: 'var(--surface-1)',
      borderBottom: '1px solid var(--border-subtle)',
      borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
      display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px',
      zIndex: 10,
      boxShadow: '0 1px 0 rgba(26,24,21,0.04), 0 12px 22px -16px rgba(26,24,21,0.10)',
    }}>
      <SeaLion size={24} />
      <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
      {WS.map(w => {
        const a = w === ACTIVE;
        return (
          <span key={w} style={{ position: 'relative', fontFamily: C6.sans, fontSize: 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer' }}>
            {w}
            {a && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -19, height: 2, background: 'var(--accent-primary)', borderRadius: 999 }} />}
          </span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: C6.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
    </div>
  );
}
function A5c() { return <Canvas chrome={<A5cChrome />} contentTop={62} />; }

// ───────────────────────────────────────────────────────────
// SECTION 2 · FLOATING DROP-SHADOW GRADIENT · 3 takes
// ───────────────────────────────────────────────────────────

// B3a · Gentle rest — soft elevation
function B3aChrome() {
  return (
    <div style={{ position: 'absolute', top: 14, left: 14, right: 14, zIndex: 10 }}>
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: '10px 16px', height: 44,
        display: 'flex', alignItems: 'center', gap: 18,
        boxShadow: '0 8px 18px -10px rgba(26,24,21,0.10), 0 1px 2px -1px rgba(26,24,21,0.04), 0 1px 0 rgba(253,252,249,0.6) inset',
      }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: a ? C6.serif : C6.sans, fontStyle: a ? 'italic' : 'normal', fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer' }}>{w}</span>
          );
        })}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: C6.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
      </div>
      <div style={{ height: 16, background: 'linear-gradient(to bottom, rgba(26,24,21,0.04), transparent)', pointerEvents: 'none' }} />
    </div>
  );
}
function B3a() { return <Canvas chrome={<B3aChrome />} contentTop={84} />; }

// B3b · Dramatic float — pronounced layered shadow
function B3bChrome() {
  return (
    <div style={{ position: 'absolute', top: 18, left: 24, right: 24, zIndex: 10 }}>
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderRadius: 14, padding: '11px 18px', height: 48,
        display: 'flex', alignItems: 'center', gap: 18,
        boxShadow: '0 28px 56px -22px rgba(26,24,21,0.26), 0 6px 16px -6px rgba(26,24,21,0.12), 0 1px 0 rgba(253,252,249,0.7) inset',
      }}>
        <SeaLion size={24} />
        <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: a ? C6.serif : C6.sans, fontStyle: a ? 'italic' : 'normal', fontSize: a ? 15 : 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer' }}>{w}</span>
          );
        })}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: C6.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29 · WAYANAD</span>
      </div>
      <div style={{ height: 28, background: 'linear-gradient(to bottom, rgba(26,24,21,0.10), transparent)', pointerEvents: 'none' }} />
    </div>
  );
}
function B3b() { return <Canvas chrome={<B3bChrome />} contentTop={94} />; }

// B3c · Lateral float — chrome offset to LEFT, asymmetric side-shadow
function B3cChrome() {
  return (
    <div style={{ position: 'absolute', top: 16, left: 16, width: 980, zIndex: 10 }}>
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderRadius: 14, padding: '10px 16px', height: 46,
        display: 'flex', alignItems: 'center', gap: 18,
        boxShadow: '14px 22px 38px -18px rgba(26,24,21,0.20), 6px 6px 12px -6px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
      }}>
        <SeaLion size={22} />
        <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{ fontFamily: C6.sans, fontSize: 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none', paddingBottom: 1, cursor: 'pointer' }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
}
function B3c() { return <Canvas chrome={<B3cChrome />} contentTop={80} />; }

// ───────────────────────────────────────────────────────────
// SECTION 3 · READING-MODE DUCK · 3 states
// ───────────────────────────────────────────────────────────

// Standard full-bar — used in C2a (rest) and the reset state of C4
function StandardBar() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 56,
      background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px',
      zIndex: 10,
    }}>
      <SeaLion size={24} />
      <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
      {WS.map(w => {
        const a = w === ACTIVE;
        return (
          <span key={w} style={{ position: 'relative', fontFamily: C6.sans, fontSize: 13, fontWeight: a ? 600 : 500, color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer' }}>
            {w}
            {a && <span style={{ position: 'absolute', left: -2, right: -2, bottom: -19, height: 2, background: 'var(--accent-primary)' }} />}
          </span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: C6.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
    </div>
  );
}

// C2a · Full bar (at rest, reading paused / page just loaded)
function C2a() { return <Canvas chrome={<StandardBar />} contentTop={56} />; }

// C2b · Ducked — chrome collapsed to a 6px hairline + tiny crumb wisp
function C2bChrome() {
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(to bottom, rgba(26,24,21,0.10), transparent)', borderBottom: '1px solid rgba(26,24,21,0.05)', zIndex: 10 }} />
      <div style={{ position: 'absolute', top: 12, left: 18, display: 'inline-flex', alignItems: 'center', gap: 10, opacity: 0.65, zIndex: 11 }}>
        <SeaLion size={16} />
        <span style={{ fontFamily: C6.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-secondary)' }}>Insights · Overview</span>
      </div>
      <div style={{ position: 'absolute', top: 12, right: 18, fontFamily: C6.mono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', opacity: 0.65, zIndex: 11 }}>READING ↑ HOVER FOR NAV</div>
    </>
  );
}
function C2b() { return <Canvas chrome={<C2bChrome />} contentTop={36} />; }

// C2c · Dock-mode — chrome dismissed; tiny floating sea-lion pill bottom-right (recall affordance)
function C2cChrome() {
  return (
    <>
      {/* Hairline at top edge — barely there */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(26,24,21,0.06)', zIndex: 10 }} />
      {/* Floating recall pill bottom-right */}
      <div style={{
        position: 'absolute', bottom: 18, right: 18, zIndex: 12,
        background: 'var(--surface-1)', border: '1px solid var(--border-default)',
        borderRadius: 999, padding: '8px 14px 8px 10px',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        boxShadow: '0 14px 32px -14px rgba(26,24,21,0.22), 0 2px 6px -2px rgba(26,24,21,0.08)',
      }}>
        <SeaLion size={20} />
        <span style={{ fontFamily: C6.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-primary)', fontWeight: 500 }}>Insights</span>
        <span style={{ fontFamily: C6.mono, fontSize: 9.5, padding: '2px 6px', background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--fg-tertiary)', fontWeight: 600 }}>⌘K</span>
      </div>
    </>
  );
}
function C2c() { return <Canvas chrome={<C2cChrome />} contentTop={4} />; }

// ───────────────────────────────────────────────────────────
// SECTION 4 · IDLE VS FOCUSED · 3 states
// ───────────────────────────────────────────────────────────

// C4a · Focused — full chrome, full surface (baseline)
function C4a() { return <Canvas chrome={<StandardBar />} contentTop={56} />; }

// C4b · Idle 30s — chrome dimmed to 55%, surface dims to 78%
function C4bChrome() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 56,
      background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px',
      opacity: 0.55, zIndex: 10,
    }}>
      <SeaLion size={24} />
      <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
      {WS.map(w => {
        const a = w === ACTIVE;
        return (
          <span key={w} style={{ position: 'relative', fontFamily: C6.sans, fontSize: 13, fontWeight: a ? 600 : 500, color: a ? 'rgba(26,24,21,0.55)' : 'rgba(26,24,21,0.30)' }}>
            {w}
            {a && <span style={{ position: 'absolute', left: -2, right: -2, bottom: -19, height: 2, background: 'rgba(182,83,43,0.45)' }} />}
          </span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: C6.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,24,21,0.30)' }}>IDLE · 0:32</span>
    </div>
  );
}
function C4b() { return <Canvas chrome={<C4bChrome />} contentTop={56} dim={0.78} />; }

// C4c · Deep idle (5min) — chrome shrinks to a tiny chevron, surface darkens + softens
function C4cChrome() {
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(26,24,21,0.10)', zIndex: 10 }} />
      <div style={{
        position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px',
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderRadius: 999, opacity: 0.78,
        boxShadow: '0 6px 14px -8px rgba(26,24,21,0.10)', zIndex: 11,
      }}>
        <SeaLion size={14} />
        <span style={{ fontFamily: C6.mono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>IDLE · 5:14 · MOVE TO WAKE</span>
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 7 L5 4 L8 7" stroke="var(--fg-tertiary)" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
      </div>
    </>
  );
}
function C4c() { return <Canvas chrome={<C4cChrome />} contentTop={32} dim={0.55} blur={0.6} />; }

// ───────────────────────────────────────────────────────────
// VC card · SectionHead · PageHeader
// ───────────────────────────────────────────────────────────
function VC({ id, title, sub, refs, what, tradeoff, ribbon, children }) {
  return (
    <article style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-1)',
      boxShadow: '0 16px 36px -28px rgba(26,24,21,0.20), 0 2px 6px -3px rgba(26,24,21,0.08)',
    }}>
      <div style={{ padding: '14px 24px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: C6.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: C6.serif, fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>{title}</h3>
          <span style={{ fontFamily: C6.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C6.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>ref · {refs}</span>
        </div>
      </div>
      {ribbon}
      <div style={{ background: 'var(--bg-base)', padding: 24, display: 'flex', justifyContent: 'center' }}>{children}</div>
      <div style={{ padding: '12px 24px 14px', borderTop: '1px solid var(--border-default)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: C6.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-success)', marginBottom: 4 }}>WHAT</div>
          <div style={{ fontFamily: C6.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{what}</div>
        </div>
        <div>
          <div style={{ fontFamily: C6.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-warning)', marginBottom: 4 }}>TRADEOFF</div>
          <div style={{ fontFamily: C6.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{tradeoff}</div>
        </div>
      </div>
    </article>
  );
}

function SectionHead({ kicker, title, deck }) {
  return (
    <div style={{ marginTop: 32, marginBottom: 20 }}>
      <div style={{ fontFamily: C6.mono, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 6 }}>{kicker}</div>
      <h2 style={{ margin: '0 0 6px', fontFamily: C6.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1 }}>{title}</h2>
      <p style={{ margin: 0, fontFamily: C6.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>{deck}</p>
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
          <span style={{ fontFamily: C6.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            CHROME IDEATION · v6 · LIVE-SURFACE TAKES
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontFamily: C6.serif, fontWeight: 500, fontSize: 40, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Twelve takes — on the <span style={{ fontStyle: 'italic' }}>actual Insights · Overview</span> surface.
        </h1>
        <p style={{ margin: '0 0 12px', fontFamily: C6.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 980, lineHeight: 1.55 }}>
          Same surface that drives <code style={{ fontFamily: C6.mono, fontSize: 14, color: 'var(--accent-primary-press)' }}>tweaks.html</code> — &lt;HF_InsightsOverview /&gt; from <code style={{ fontFamily: C6.mono, fontSize: 14 }}>hifi-more.jsx</code> rendered as-is, with its native HfShell topbar / subtabs hidden so each chrome variant can sit above the real UI. Three takes per direction: asymmetric corner · floating drop-shadow · reading-mode duck (3 states) · idle vs focused (3 states).
        </p>
        <p style={{ margin: 0, fontFamily: C6.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          v1 · v2 · v3 · v4 · v5 · <span style={{ color: 'var(--accent-primary)' }}>v6 live-surface takes · this page</span>
        </p>
      </div>
    </div>
  );
}

function HF_ChromeIdeationV6() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Scoped CSS: hide the native HfShell topbar/subtabs ONLY inside our canvas
          frames. The tweaks.html surface is untouched — this only affects
          .cv6-canvas .hf-topbar / .cv6-canvas .hf-subtabs. */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cv6-canvas .hf-topbar,
        .cv6-canvas .hf-subtabs { display: none !important; }
        .cv6-canvas .hf { height: 100% !important; }
      `}} />

      <PageHeader />

      <div style={{ maxWidth: 1504, margin: '0 auto', padding: '24px 32px 96px' }}>

        <SectionHead
          kicker="SECTION 1 · ASYMMETRIC CORNER · 3 TAKES"
          title="One corner does something different. The rest stays calm."
          deck="The asymmetric-corner idea from v5 (A5) applied to the live Insights surface, with three takes on which corner gets the playful treatment and how it's traced. Same surface, three distinct edges."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="A5a" title="Top-left clay corner" sub="rounded top-left · clay underline" refs="Italian cinema title cards"
              ribbon={<StateRibbon label="STATE · A5a" sub="One rounded corner top-left + clay accent line under chrome — an editorial fold." />}
              what="The chrome strip has a 24px rounded top-left corner; the other three corners stay sharp. A 1.5px clay border traces the bottom edge of the chrome — reads like a pull-quote frame. Sits above the real Insights surface."
              tradeoff="Asymmetry reads as 'one-off design detail' — fights the rest of the design system's uniform 8/12/14px radii. Best applied as a thematic flourish, not a system-wide rule.">
            <A5a />
          </VC>
          <VC id="A5b" title="Top-right ink corner" sub="rounded top-right · ink rule below" refs="Wes Anderson menus · Magnum photos covers"
              ribbon={<StateRibbon label="STATE · A5b" sub="Mirrored corner — top-right rounded · ink (not clay) underline · volume-and-issue meta on the right." />}
              what="Mirror of A5a — top-right corner gets the 24px radius. The bottom edge of the chrome carries a 1px ink line (full warm-fg-primary, not clay). Reads more austere, more masthead-like. Right-aligned dateline becomes a volume / issue caption."
              tradeoff="Mirror-image asymmetry can feel like a layout glitch on first sight — needs the volume / issue meta to anchor the right corner so it reads as 'designed,' not 'broken'.">
            <A5b />
          </VC>
          <VC id="A5c" title="Bottom-bracket corners" sub="full-bleed top · rounded BOTTOM corners" refs="Field Notes covers · Penguin Modern Classics"
              ribbon={<StateRibbon label="STATE · A5c" sub="Sharp top-edge meets the canvas, bottom corners curve inward — chrome reads as 'wrapping' the page below it." />}
              what="Both top corners are flush to the canvas. Both bottom corners get a 24px radius — chrome reads like a paper sleeve wrapping the page below it. Active workspace marker is a clay capsule that hangs OUT of the bottom edge of the chrome."
              tradeoff="The hanging clay marker is the load-bearing element here — it has to be exactly the right size or the asymmetry collapses into looking like a generic underline. ~6px more vertical chrome than other variants.">
            <A5c />
          </VC>
        </div>

        <SectionHead
          kicker="SECTION 2 · FLOATING DROP-SHADOW · 3 TAKES"
          title="Three elevations. Same idea: chrome floats above page."
          deck="The B3 floating drop-shadow idea graded across three intensities, applied to the live surface. Subtle (gentle), assertive (dramatic), and asymmetric (lateral). All three read as 'chrome hovers above page' — which one feels right for a daily-driver?"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="B3a" title="Gentle rest" sub="low elevation · barely-there bleed-out" refs="Stripe sticky bar · Linear top bar"
              ribbon={<StateRibbon label="ELEVATION · 04 / 32" sub="The chrome floats just enough to register depth — a daily-driver that won't compete with content for attention." />}
              what="Most restrained version. 8/16px shadow (low blur, low spread, low alpha). Soft bleed-out gradient under the chrome at 4% alpha. Inset highlight sells the lighting without screaming. Reads as 'attended-to' but not 'showy'."
              tradeoff="Low elevation can read as 'almost flat' on warm-paper backgrounds — the user might not register the float intent. Best paired with a slightly stronger border-color to compensate.">
            <B3a />
          </VC>
          <VC id="B3b" title="Dramatic float" sub="layered · pronounced bleed-out · premium" refs="visionOS layered glass · Cron command bar"
              ribbon={<StateRibbon label="ELEVATION · 14 / 32" sub="Maximum elevation — chrome looks like it's hovering ~6-8px above the page surface." />}
              what="Layered shadow at 28/56px and 6/16px (two stacked shadows for depth realism). Soft 28px bleed-out under the chrome at 10% alpha. Inset highlight at 70% alpha sells warm-paper translucency. Reads as 'this app cares about details'."
              tradeoff="Heavy shadow on warm-paper risks the rgba(26,24,21,X) trap — get the alpha wrong and it looks gray-grey. R7 shadow sweep already established warm-ink alpha as the rule.">
            <B3b />
          </VC>
          <VC id="B3c" title="Lateral float" sub="offset to LEFT · asymmetric side-shadow" refs="Italian magazine spreads · early Apple iPhoto shelves"
              ribbon={<StateRibbon label="ELEVATION · LATERAL" sub="Chrome bar floats with a sideways shadow — implies left-side light source. Most editorial of the three." />}
              what="Chrome offset to the left, doesn't span the full width. Shadow has a horizontal component (14/22px lateral bleed) — implies the page is lit from the upper-left. Most directional of the three; closest to a print-magazine feel."
              tradeoff="Lateral shadow assumes a fixed light source, which fights the rest of the page's flat lighting. Best for a single hero surface (Insights), not a system rule across all workspaces.">
            <B3c />
          </VC>
        </div>

        <SectionHead
          kicker="SECTION 3 · READING-MODE DUCK · 3 STATES"
          title="The chrome ducks when you scroll. Same idea, three end-states."
          deck="C2's reading-mode duck behavior shown as three distinct end-states: (a) full at rest, (b) ducked to a 6px wisp + crumb, (c) dock-mode where the chrome dismisses entirely and a tiny floating sea-lion pill becomes the recall affordance. Pick the duck-target."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="C2a" title="At rest · full bar" sub="not scrolling · chrome is full" refs="Safari Reader normal mode"
              ribbon={<StateRibbon label="DUCK · 0%" sub="Cursor recently moved · scroll position 0 · chrome at 100%." />}
              what="Baseline state. Standard 56px chrome strip with sea lion + 7 workspace tabs + clay underline on Insights + dateline on the right. The reference state every other duck phase morphs from."
              tradeoff="Same as any horizontal-top chrome — eats 56px before content starts. The duck behavior earns this back during reading.">
            <C2a />
          </VC>
          <VC id="C2b" title="Ducked · 6px wisp + crumb" sub="scrolling · chrome collapses · crumb wisp persists" refs="Safari Reader on scroll · Medium reading view"
              ribbon={<StateRibbon label="DUCK · 88%" sub="Cursor not active for 1s · scroll velocity > 0 · chrome morphs to 6px hairline + low-alpha crumb." />}
              what="Chrome collapses to a 6px gradient hairline. A faint italic-serif 'Insights · Overview' wisp persists in the top-left at 65% opacity — you still know where you are. Reading hint on the right reads 'READING ↑ HOVER FOR NAV'. Maximum chrome-off."
              tradeoff="The crumb wisp at 65% can be hard to read on certain warmth variants — needs a 70% threshold on cool-paper. Velocity-aware threshold (don't collapse on tiny accidental scrolls) is critical to prevent flicker.">
            <C2b />
          </VC>
          <VC id="C2c" title="Dock-mode · floating sea-lion pill" sub="long reading · chrome dismissed entirely · pill bottom-right" refs="iA Writer focus mode · Bear reader"
              ribbon={<StateRibbon label="DUCK · 100% · DOCKED" sub="No interaction for 3s · scroll past 600px · chrome completely dismissed; tiny pill at bottom-right is the only persistent UI." />}
              what="The chrome itself is gone. A 2px hairline at the very top edge stays as a 'chrome lives here' cue. A small floating pill in the bottom-right corner shows the sea lion + active workspace + ⌘K hint. Click the pill or hit ⌘K to bring chrome back."
              tradeoff="Bottom-right pill competes with any FAB or chat composer in that corner. On Home where the chat lives there, the pill needs a different anchor (top-right? bottom-left?). Discoverability concerns — first-time users may not realize they can summon nav back.">
            <C2c />
          </VC>
        </div>

        <SectionHead
          kicker="SECTION 4 · IDLE VS FOCUSED · 3 STATES"
          title="Chrome breathes when you're not paying attention. Three depths."
          deck="C4's idle behavior shown across three idle depths: focused (full attention) · 30s idle (chrome dims to 55%, surface dims to 78%) · 5min deep idle (chrome shrinks to a tiny chevron, surface darkens + softens). The room dims while you weren't looking."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="C4a" title="Focused" sub="active input within 5s · everything sharp" refs="macOS Stage Manager active"
              ribbon={<StateRibbon label="IDLE · 0:00" sub="Cursor moving · keys pressing · scroll happening — full attention state." />}
              what="Same as C2a's 'at rest' but the meaning differs — this is the baseline focused state from which the idle dimming morphs. Both chrome and surface at 100% opacity, no blur, all colors at full saturation."
              tradeoff="Identical-to-rest visual — needs to be paired with one of the idle states (B or C) to read as a 'focused' state. Alone, it's just the standard chrome.">
            <C4a />
          </VC>
          <VC id="C4b" title="Idle 30s · dim + breathing" sub="no input for 30s · chrome 55% · surface 78%" refs="macOS menubar dim · Apple TV idle"
              ribbon={<StateRibbon label="IDLE · 0:32 · BREATHING" sub="No input for 30s — chrome opacity 55%, surface opacity 78%, slow sine-pulse 1.0 → 0.92." />}
              what="Chrome opacity 55%, including the active-workspace clay underline (drops to 45% alpha). The surface dims to 78% opacity. Breathing animation runs as a 4s sine on the chrome. Any input (mouse, key, scroll) snaps everything back to 100% in 80ms."
              tradeoff="Idle dimming on a desktop app is unusual — could be misread as a bug or low-power mode. Best paired with a tiny mono caption ('IDLE · 0:32') so the user knows it's intentional.">
            <C4b />
          </VC>
          <VC id="C4c" title="Deep idle 5min · chevron + soft surface" sub="no input for 5min · chrome shrinks to chevron · surface 55% · slight blur" refs="Apple TV screensaver · macOS lock-screen lead-in"
              ribbon={<StateRibbon label="IDLE · 5:14 · DEEP" sub="No input for 5 minutes — chrome shrinks to a tiny pill chevron centered up top; surface dims to 55% with a 0.6px blur." />}
              what="Chrome shrinks to a small pill at the top-center (sea lion + 'IDLE · 5:14 · MOVE TO WAKE' + tiny up chevron). The surface drops to 55% opacity AND gets a 0.6px blur — soft-focus reading break. Movement restores everything in 200ms."
              tradeoff="The blur is the most aggressive idle move — dim is one thing, but blurring real content can feel disorienting. Best for daily-drivers; risky for first-time users. Skip the blur on touch devices.">
            <C4c />
          </VC>
        </div>

        {/* Closing recommendation */}
        <article style={{ marginTop: 32, padding: '24px 28px 26px', borderRadius: 14, background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)' }}>
          <div style={{ fontFamily: C6.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 8 }}>SYNTHESIS · what to commit to</div>
          <h2 style={{ margin: '0 0 12px', fontFamily: C6.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            B3a (gentle rest) as the default · C2b (ducked wisp) as the scroll behavior · C4b (idle dim) as the inactivity behavior.
          </h2>
          <p style={{ margin: '0 0 12px', fontFamily: C6.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>B3a gentle-rest</strong> is the right default elevation — registers depth without competing with content. B3b dramatic is over-spec'd for a daily-driver; B3c lateral fights the system's flat lighting. <strong>C2b ducked-wisp</strong> is the right scroll behavior — preserves orientation (the crumb tells you where you are) while freeing reading space. C2c dock-mode is too aggressive for a default and should be a per-user opt-in. <strong>C4b idle-dim</strong> is the right inactivity behavior — visible enough to register, gentle enough not to feel buggy. C4c deep-idle's blur is a beautiful detail but should ship dark instead of blurred.
          </p>
          <p style={{ margin: 0, fontFamily: C6.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            Asymmetric corners (Section 1) are a thematic flourish — pick A5a (top-left clay) for the front-door surfaces (Home / Insights front-page) and don't apply system-wide. Treat asymmetry as 'cover-page only' and keep inner pages on the standard rectangle.
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV6 });
