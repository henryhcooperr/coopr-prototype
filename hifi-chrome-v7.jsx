/* global React, window */
/* hifi-chrome-v7.jsx — DYNAMIC FLOATING CHROME · animated · 5 variants.
   Built ON TOP OF the real Insights surface. Chrome floats and animates;
   the surface body slips UP under the chrome's cast shadow so the float
   reads as part of the page rather than a separate UI layer.

   Variants:
     F1 · Breathing float           — perpetual gentle bob + shadow pulse
     F2 · Scroll-reactive (sim)     — chrome compresses on scroll, springs back
     F3 · Magnetic active tab       — active tab pulses with clay glow halo
     F4 · Workspace cycling lift    — chrome lifts as workspace switches
     F5 · Float ↔ landed (idle)     — chrome floats then "lands" on idle, lifts on activity

   Surface mount strategy: same patch as v6 — replace window.HfShell with a
   slim version that renders only the body (no native topbar / subtabs).
   The tweaks gallery is on a separate page so it is unaffected.
*/

// ─── Slim HfShell patch (chrome-free surface mount) ─────────
if (typeof window !== 'undefined' && window.HfShell && !window.__cv7Patched) {
  window.__OrigHfShellV7 = window.__OrigHfShell || window.HfShell;
  window.HfShell = function HfShellSlimV7({ children, style = {} }) {
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
  window.__cv7Patched = true;
}

const C7 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WS_LIST = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];

// ─── Sea lion crop ──────────────────────────────────────────
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

// ─── Real surface mount ─────────────────────────────────────
function RealSurface({ surfaceShift = 0 }) {
  const Comp = window.HF_InsightsOverview;
  if (!Comp) {
    return (
      <div style={{ padding: 32, fontFamily: C7.mono, fontSize: 12, color: 'var(--tone-danger)' }}>
        HF_InsightsOverview not on window — check script load order.
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', top: surfaceShift, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <Comp />
    </div>
  );
}

// ─── Chrome bar primitive — used by all variants ────────────
// Three-layer shadow: warm-ink ambient float + key shadow + inset highlight.
// Active workspace gets a 2px clay capsule underline (animates between
// positions in F4) + Literata italic. Sea lion sits in a quiet pad so the
// glyph reads as "anchored," not floating loose. The chrome's bottom edge
// carries a 1px accent-soft hairline that bleeds into the surface body —
// the load-bearing detail that makes chrome and surface feel like one
// material instead of two layers.
function FloatBar({ active = 'Insights', onClick = () => {}, style = {}, children }) {
  return (
    <div style={{
      background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
      borderRadius: 12, padding: '10px 16px', height: 48,
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
      position: 'relative',
      ...style,
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}>
        <SeaLion size={22} />
      </span>
      <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
      {WS_LIST.map(w => {
        const a = w === active;
        return (
          <span key={w} onClick={() => onClick(w)} style={{
            position: 'relative',
            fontFamily: a ? C7.serif : C7.sans, fontStyle: a ? 'italic' : 'normal',
            fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
            color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
            cursor: 'pointer', transition: 'all 220ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {w}
            {a && <span style={{
              position: 'absolute', left: 0, right: 0, bottom: -8, height: 2,
              background: 'var(--accent-primary)', borderRadius: 999,
              transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
            }} />}
          </span>
        );
      })}
      <span style={{ flex: 1 }} />
      {children}
      {/* Bottom-edge hairline that bleeds into the surface body */}
      <span style={{
        position: 'absolute', left: 12, right: 12, bottom: -1, height: 1,
        background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── Canvas wrapper · 1440 × 760 ────────────────────────────
function Canvas({ children }) {
  return (
    <div className="cv6-canvas" style={{
      width: 1440, height: 760, background: 'var(--bg-base)',
      position: 'relative', overflow: 'hidden',
      border: '1px solid var(--border-default)', borderRadius: 8,
    }}>{children}</div>
  );
}

// Annotation pill (top-right of canvas) — explains what's animating
function Annot({ children }) {
  return (
    <div style={{
      position: 'absolute', top: 16, right: 16, zIndex: 20,
      padding: '6px 10px', background: 'rgba(26,24,21,0.78)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 6,
      fontFamily: C7.mono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--fg-on-ink)', fontWeight: 600,
      boxShadow: '0 6px 14px -8px rgba(26,24,21,0.32)',
    }}>{children}</div>
  );
}

// ───────────────────────────────────────────────────────────
// F1 · Breathing float — perpetual bob + shadow pulse (CSS-only)
// Cast-shadow alpha breathes in sync with the chrome bob (4.4s loop):
// chrome rises 1.5px while shadow softens; chrome settles while shadow
// strengthens. The synchronized pulse sells "the chrome is on the page,
// not floating in space."
// ───────────────────────────────────────────────────────────
function F1() {
  return (
    <Canvas>
      <RealSurface surfaceShift={64} />
      <div className="cv7-f1-cast" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 40,
        pointerEvents: 'none', zIndex: 5,
      }} />
      <Annot>BREATHING · 4.4S LOOP · CSS</Annot>
      <div className="cv7-f1" style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10 }}>
        <FloatBar active="Insights">
          <span style={{ fontFamily: C7.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
        </FloatBar>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// F2 · Scroll-reactive (simulated)
// CSS state-machine: rest → compressed → super-compressed → back
// 8s loop simulating scroll-down then scroll-up
// ───────────────────────────────────────────────────────────
function F2() {
  return (
    <Canvas>
      <RealSurface surfaceShift={64} />
      {/* Cast-shadow fades to 0 as chrome compresses — chrome leaving the page */}
      <div className="cv7-f2-cast" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 32,
        pointerEvents: 'none', zIndex: 5,
      }} />
      <Annot>SIM SCROLL · 8S LOOP</Annot>
      {/* Slimmer scroll thumb — 3px wide, warm-ink alpha */}
      <div style={{ position: 'absolute', top: 16, right: 12, bottom: 16, width: 3, background: 'rgba(26,24,21,0.04)', borderRadius: 999, zIndex: 18 }}>
        <div className="cv7-f2-thumb" style={{ position: 'absolute', left: 0, right: 0, height: 52, background: 'rgba(26,24,21,0.28)', borderRadius: 999 }} />
      </div>
      <div className="cv7-f2" style={{ position: 'absolute', top: 16, left: 16, right: 28, zIndex: 10 }}>
        <FloatBar active="Insights">
          <span style={{ fontFamily: C7.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>READING</span>
        </FloatBar>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// F3 · Magnetic active tab — pulses for 3 cycles (~9s), then settles.
// Production behavior: fires once on workspace navigation. Demo: re-fires
// every 14s so the page can be left open and still show the behavior.
// ───────────────────────────────────────────────────────────
function F3() {
  const [pulsing, setPulsing] = React.useState(true);
  React.useEffect(() => {
    let t1 = setTimeout(() => setPulsing(false), 9000);  // 3 × 3s
    const loop = setInterval(() => {
      setPulsing(true);
      t1 = setTimeout(() => setPulsing(false), 9000);
    }, 14000);
    return () => { clearTimeout(t1); clearInterval(loop); };
  }, []);
  return (
    <Canvas>
      <RealSurface surfaceShift={64} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(to bottom, rgba(26,24,21,0.05), transparent)', pointerEvents: 'none', zIndex: 5 }} />
      <Annot>MAGNETIC TAB · {pulsing ? 'PULSING (3 CYCLES)' : 'SETTLED'}</Annot>
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10 }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: '10px 16px', height: 48,
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
          position: 'relative',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}>
            <SeaLion size={22} />
          </span>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
          {WS_LIST.map(w => {
            const a = w === 'Insights';
            return (
              <span key={w} className={a && pulsing ? 'cv7-f3-active' : ''} style={{
                position: 'relative',
                padding: a ? '4px 10px' : '4px 4px',
                borderRadius: 6,
                fontFamily: a ? C7.serif : C7.sans, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
                color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                background: a && !pulsing ? 'var(--accent-soft)' : 'transparent',
                transition: 'background 320ms ease',
                cursor: 'pointer',
              }}>{w}</span>
            );
          })}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C7.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
          <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
        </div>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// F4 · Workspace cycling lift — uses React state + setInterval
// Cycles ACTIVE through 4 workspaces every 2.6s. On switch, chrome
// briefly lifts (translateY -3px, shadow expands) for 320ms, then
// settles. Underline animates between tab positions via CSS transition.
// ───────────────────────────────────────────────────────────
const F4_CYCLE = ['Insights', 'Library', 'Studio', 'Insights', 'Inbox', 'Insights'];
function F4() {
  const [idx, setIdx] = React.useState(0);
  const [lifting, setLifting] = React.useState(false);
  React.useEffect(() => {
    const id = setInterval(() => {
      setLifting(true);
      setTimeout(() => setLifting(false), 360);
      setIdx(prev => (prev + 1) % F4_CYCLE.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);
  const active = F4_CYCLE[idx];
  return (
    <Canvas>
      {/* Surface dims briefly during the 360ms lift — sells "the page paused while chrome did something" */}
      <div style={{
        position: 'absolute', top: 64, left: 0, right: 0, bottom: 0,
        opacity: lifting ? 0.94 : 1,
        transition: 'opacity 360ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <RealSurface surfaceShift={0} />
      </div>
      {/* Cast-shadow intensifies during lift */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 32,
        background: lifting
          ? 'linear-gradient(to bottom, rgba(26,24,21,0.10), transparent)'
          : 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)',
        transition: 'background 360ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none', zIndex: 5,
      }} />
      <Annot>WORKSPACE CYCLE · LIFT ON SWITCH · {lifting ? 'LIFTING' : 'SETTLED'}</Annot>
      <div style={{
        position: 'absolute', top: lifting ? 13 : 16, left: 16, right: 16, zIndex: 10,
        transition: 'top 360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: '10px 16px', height: 48,
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: lifting
            ? '0 24px 48px -20px rgba(26,24,21,0.26), 0 6px 14px -6px rgba(26,24,21,0.12), 0 1px 0 rgba(253,252,249,0.7) inset'
            : '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
          transition: 'box-shadow 360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}>
            <SeaLion size={22} />
          </span>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
          {WS_LIST.map(w => {
            const a = w === active;
            return (
              <span key={w} style={{
                position: 'relative',
                fontFamily: a ? C7.serif : C7.sans, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
                color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                transition: 'all 320ms cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}>
                {w}
                {a && <span style={{
                  position: 'absolute', left: 0, right: 0, bottom: -8, height: 2,
                  background: 'var(--accent-primary)', borderRadius: 999,
                  animation: 'cv7-underline 360ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 1px 4px -1px rgba(182,83,43,0.32)',
                }} />}
              </span>
            );
          })}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C7.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>
            WED · APR 29
          </span>
          <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
        </div>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// F5 · Float ↔ landed — state machine, idle-driven
// Cycles: floating (3s) → landing (300ms) → landed (3s) → lifting (300ms)
// When landed: chrome flush to top, shadow flat. When floating: full elevation.
// Caption tracks state.
// ───────────────────────────────────────────────────────────
function F5() {
  const [phase, setPhase] = React.useState('floating');
  React.useEffect(() => {
    const seq = [
      { phase: 'floating', dur: 3000 },
      { phase: 'landing',  dur: 300 },
      { phase: 'landed',   dur: 3000 },
      { phase: 'lifting',  dur: 300 },
    ];
    let i = 0;
    const tick = () => {
      const step = seq[i % seq.length];
      setPhase(step.phase);
      const id = setTimeout(() => { i++; tick(); }, step.dur);
      return id;
    };
    const id = tick();
    return () => clearTimeout(id);
  }, []);
  const isFloat = phase === 'floating' || phase === 'lifting';
  const top = isFloat ? 16 : 0;
  const radius = isFloat ? 12 : 0;
  const shadow = isFloat
    ? '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset'
    : '0 1px 0 rgba(26,24,21,0.04)';
  const left = isFloat ? 16 : 0;
  const right = isFloat ? 16 : 0;
  return (
    <Canvas>
      <RealSurface surfaceShift={isFloat ? 64 : 52} />
      {/* Cast-shadow exists when floating, fades to 0 when landed */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 32,
        background: isFloat
          ? 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)'
          : 'linear-gradient(to bottom, rgba(26,24,21,0), transparent)',
        transition: 'background 480ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none', zIndex: 5,
      }} />
      <Annot>FLOAT ↔ LANDED · 6.6S LOOP · {phase.toUpperCase()}</Annot>
      <div style={{
        position: 'absolute', top, left, right, zIndex: 10,
        transition: 'top 480ms cubic-bezier(0.4, 0, 0.2, 1), left 480ms cubic-bezier(0.4, 0, 0.2, 1), right 480ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          background: 'var(--surface-1)',
          border: isFloat ? '1px solid var(--border-subtle)' : '1px solid transparent',
          borderBottom: '1px solid var(--border-subtle)',
          borderRadius: radius,
          padding: '10px 16px', height: 48,
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: shadow,
          transition: 'box-shadow 480ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 480ms cubic-bezier(0.4, 0, 0.2, 1), border-color 480ms',
          position: 'relative',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}>
            <SeaLion size={22} />
          </span>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
          {WS_LIST.map(w => {
            const a = w === 'Insights';
            return (
              <span key={w} style={{
                position: 'relative',
                fontFamily: a ? C7.serif : C7.sans, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
                color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                cursor: 'pointer',
              }}>
                {w}
                {a && <span style={{
                  position: 'absolute', left: 0, right: 0, bottom: -8, height: 2,
                  background: 'var(--accent-primary)', borderRadius: 999,
                  boxShadow: '0 1px 4px -1px rgba(182,83,43,0.32)',
                }} />}
              </span>
            );
          })}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C7.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>
            {phase === 'floating' ? 'IDLE · 0:02' : phase === 'landed' ? 'READING · DOCKED' : 'TRANSITIONING'}
          </span>
          {/* Bottom-edge accent-soft hairline · stronger when landed (sells "chrome merged with page") */}
          <span style={{
            position: 'absolute', left: isFloat ? 12 : 0, right: isFloat ? 12 : 0, bottom: -1, height: 1,
            background: isFloat
              ? 'linear-gradient(to right, transparent, var(--accent-soft), transparent)'
              : 'linear-gradient(to right, transparent, var(--accent-primary), transparent)',
            opacity: isFloat ? 1 : 0.42,
            transition: 'all 480ms cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
          }} />
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
      /* Hide native HfShell topbar/subtabs inside our canvas (defensive — HfShell is patched) */
      .cv6-canvas .hf-topbar, .cv6-canvas .hf-subtabs { display: none !important; }
      .cv6-canvas .hf { height: 100% !important; }

      /* Respect reduce-motion preference — disable autoplay loops */
      @media (prefers-reduced-motion: reduce) {
        .cv7-f1, .cv7-f1 > div, .cv7-f1-cast,
        .cv7-f2 > div, .cv7-f2-thumb, .cv7-f2-cast,
        .cv7-f3-active { animation: none !important; }
      }

      /* F1 · Breathing float — bob + shadow pulse + synced cast-shadow */
      @keyframes cv7-breathe {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-1.5px); }
      }
      @keyframes cv7-breathe-shadow {
        0%, 100% { box-shadow: 0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset; }
        50%      { box-shadow: 0 24px 48px -20px rgba(26,24,21,0.22), 0 4px 10px -4px rgba(26,24,21,0.10), 0 1px 0 rgba(253,252,249,0.7) inset; }
      }
      @keyframes cv7-breathe-cast {
        0%, 100% { background: linear-gradient(to bottom, rgba(26,24,21,0.04), transparent); }
        50%      { background: linear-gradient(to bottom, rgba(26,24,21,0.08), transparent); }
      }
      .cv7-f1 { animation: cv7-breathe 4.4s ease-in-out infinite; }
      .cv7-f1 > div { animation: cv7-breathe-shadow 4.4s ease-in-out infinite; }
      .cv7-f1-cast { animation: cv7-breathe-cast 4.4s ease-in-out infinite; }

      /* F2 · Scroll-reactive simulation — chrome compresses with scroll */
      @keyframes cv7-f2-bar {
        0%, 100% { height: 48px; padding-top: 10px; padding-bottom: 10px; box-shadow: 0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset; opacity: 1; }
        25%      { height: 36px; padding-top: 6px; padding-bottom: 6px; box-shadow: 0 8px 18px -10px rgba(26,24,21,0.14), 0 1px 3px -1px rgba(26,24,21,0.06), 0 1px 0 rgba(253,252,249,0.6) inset; opacity: 0.92; }
        50%      { height: 28px; padding-top: 3px; padding-bottom: 3px; box-shadow: 0 4px 10px -6px rgba(26,24,21,0.10), 0 1px 2px -1px rgba(26,24,21,0.04); opacity: 0.78; }
        75%      { height: 36px; padding-top: 6px; padding-bottom: 6px; box-shadow: 0 8px 18px -10px rgba(26,24,21,0.14), 0 1px 3px -1px rgba(26,24,21,0.06), 0 1px 0 rgba(253,252,249,0.6) inset; opacity: 0.92; }
      }
      .cv7-f2 > div { animation: cv7-f2-bar 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

      /* F2 · scroll thumb position */
      @keyframes cv7-f2-thumb {
        0%, 100% { top: 0; }
        25%      { top: 35%; }
        50%      { top: 70%; }
        75%      { top: 35%; }
      }
      .cv7-f2-thumb { animation: cv7-f2-thumb 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

      /* F2 · cast-shadow fades as chrome compresses (chrome leaving the page) */
      @keyframes cv7-f2-cast {
        0%, 100% { background: linear-gradient(to bottom, rgba(26,24,21,0.06), transparent); }
        25%      { background: linear-gradient(to bottom, rgba(26,24,21,0.04), transparent); }
        50%      { background: linear-gradient(to bottom, rgba(26,24,21,0), transparent); }
        75%      { background: linear-gradient(to bottom, rgba(26,24,21,0.04), transparent); }
      }
      .cv7-f2-cast { animation: cv7-f2-cast 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

      /* F3 · Magnetic active tab — clay glow halo + subtle scale, gated by JS */
      @keyframes cv7-f3-pulse {
        0%, 100% { background: var(--accent-soft); box-shadow: 0 0 0 0 rgba(182,83,43,0); transform: scale(1); }
        50%      { background: var(--accent-soft); box-shadow: 0 0 0 5px rgba(182,83,43,0.14); transform: scale(1.03); }
      }
      .cv7-f3-active { animation: cv7-f3-pulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

      /* F4 · Underline springs in from compressed scale on workspace switch */
      @keyframes cv7-underline {
        0%   { transform: scaleX(0.3); opacity: 0; }
        60%  { transform: scaleX(1.04); opacity: 1; }
        100% { transform: scaleX(1); opacity: 1; }
      }
    `}} />
  );
}

function VC({ id, title, sub, refs, what, tradeoff, behavior, children }) {
  return (
    <article style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-1)',
      boxShadow: '0 16px 36px -28px rgba(26,24,21,0.20), 0 2px 6px -3px rgba(26,24,21,0.08)',
    }}>
      <div style={{ padding: '14px 24px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: C7.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: C7.serif, fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>{title}</h3>
          <span style={{ fontFamily: C7.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C7.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>ref · {refs}</span>
        </div>
      </div>
      <div style={{ padding: '8px 24px 6px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ fontFamily: C7.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)' }}>BEHAVIOR · </span>
        <span style={{ fontFamily: C7.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-primary)' }}>{behavior}</span>
      </div>
      <div style={{ background: 'var(--bg-base)', padding: 24, display: 'flex', justifyContent: 'center' }}>{children}</div>
      <div style={{ padding: '12px 24px 14px', borderTop: '1px solid var(--border-default)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: C7.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-success)', marginBottom: 4 }}>WHAT</div>
          <div style={{ fontFamily: C7.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{what}</div>
        </div>
        <div>
          <div style={{ fontFamily: C7.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-warning)', marginBottom: 4 }}>TRADEOFF</div>
          <div style={{ fontFamily: C7.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{tradeoff}</div>
        </div>
      </div>
    </article>
  );
}

function SectionHead({ kicker, title, deck }) {
  return (
    <div style={{ marginTop: 32, marginBottom: 20 }}>
      <div style={{ fontFamily: C7.mono, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 6 }}>{kicker}</div>
      <h2 style={{ margin: '0 0 6px', fontFamily: C7.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1 }}>{title}</h2>
      <p style={{ margin: 0, fontFamily: C7.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>{deck}</p>
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
          <span style={{ fontFamily: C7.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            CHROME IDEATION · v7 · DYNAMIC FLOATING · LIVE ANIMATION
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontFamily: C7.serif, fontWeight: 500, fontSize: 40, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Five floating chromes — <span style={{ fontStyle: 'italic' }}>built into the page, animating live.</span>
        </h1>
        <p style={{ margin: '0 0 12px', fontFamily: C7.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 980, lineHeight: 1.55 }}>
          Each chrome casts a soft shadow onto the surface below it — the page slips up under the chrome, so the float reads as part of the page rather than UI floating in space. All five animate on page load. Hard-refresh (⌘⇧R) to bust the Babel cache.
        </p>
        <p style={{ margin: 0, fontFamily: C7.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          v1 · v2 · v3 · v4 · v5 · v6 · <span style={{ color: 'var(--accent-primary)' }}>v7 dynamic floating · this page</span>
        </p>
      </div>
    </div>
  );
}

function HF_ChromeIdeationV7() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <GlobalAnimStyles />
      <PageHeader />
      <div style={{ maxWidth: 1504, margin: '0 auto', padding: '24px 32px 96px' }}>

        <SectionHead
          kicker="SECTION 1 · AMBIENT MOTION · 1 VARIANT"
          title="Chrome breathes when the page is at rest."
          deck="A perpetual gentle bob (±1.5px) and shadow-pulse on a 4.4s cycle. Subtle enough to not distract; present enough to feel 'alive'. Pure CSS keyframes — no JS state. The surface body slips under the chrome's cast shadow at the top."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="F1" title="Breathing float" sub="ambient · always on" refs="visionOS title bars · macOS Sonoma menubar"
              behavior="Chrome bobs −1.5px and back over 4.4s. Shadow blur expands from 30→44px in sync. Surface body unaffected — the bob lives entirely in chrome space. Cast-shadow gradient at top of body intensifies from 6%→8% alpha at the bob's apex."
              what="Pure CSS animation: translateY oscillates ±1.5px and shadow blur breathes 30→44→30px. Active-tab indicator and surface body stay still. Reads as 'alive but calm.'"
              tradeoff="Constant motion can be distracting after long sessions — best paired with a 'reduce motion' OS setting check (prefers-reduced-motion). Some users will love the alive feel; others will read it as 'what's wrong with my browser.'">
            <F1 />
          </VC>
        </div>

        <SectionHead
          kicker="SECTION 2 · SCROLL-REACTIVE · 1 VARIANT"
          title="Chrome compresses on scroll, springs back on stop."
          deck="As you scroll down, the chrome compresses (height 48 → 36 → 28px) and the shadow tightens — same idea as Reading-mode duck (C2) but graded continuously instead of binary. Springs back when scroll stops. Demoed here as an 8s simulated scroll-down/up cycle with a fake scrollbar thumb."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="F2" title="Scroll-reactive (sim)" sub="height + opacity + shadow scale with scroll velocity" refs="iOS Safari URL bar · macOS scroll-aware menubar"
              behavior="Mock 8s scroll: chrome 48px → 36px → 28px → 36px → 48px synchronized to a fake scrollbar thumb on the right edge that animates 0% → 35% → 70% → 35% → 0%. In production this binds to actual scroll position with a velocity threshold."
              what="Chrome height, padding, shadow strength, and opacity all linearly interpolate against scroll position. At full scroll the chrome is a translucent ribbon that still shows sea lion + active workspace. Cast-shadow on body softens in sync."
              tradeoff="Requires a scroll-position observer and a velocity smoother. Naive implementations cause chrome to jitter on inertial scroll. Should be debounced + clamped at 0–60% scroll, not 0–100%, so the chrome never fully disappears.">
            <F2 />
          </VC>
        </div>

        <SectionHead
          kicker="SECTION 3 · ACTIVE-TAB MAGNETISM · 1 VARIANT"
          title="The active workspace pulses — a clay glow halo announces 'you are here.'"
          deck="The chrome itself stays still. The active workspace tab pulses (scale 1 → 1.04, accent-soft fill, 16% clay shadow halo) on a 3s cycle. Useful when the user just navigated to a new workspace and needs a beat to register the change."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="F3" title="Magnetic active tab" sub="pulse · 3s loop · CSS-only" refs="iOS notification dot pulse · Linear inbox glow"
              behavior="3s loop on the active workspace pill: scale 1 → 1.04, background transparent → accent-soft, halo box-shadow 0 → 4px 16% clay. Other tabs stay still. The pulse loops perpetually as a 'you are here' beacon."
              what="Pure CSS keyframe scoped to a single .cv7-f3-active class. The animation runs 24/7 in this prototype to demo it; in production it would run for ~6s after a navigation event then settle."
              tradeoff="Constant pulse is too much — should auto-stop after user interaction. Also the 16% halo is loud on warm-paper at this size; 12% might be the right ceiling. Easy to over-do.">
            <F3 />
          </VC>
        </div>

        <SectionHead
          kicker="SECTION 4 · LIFT-ON-ACTION · 1 VARIANT"
          title="Switching workspaces lifts the chrome. The shadow expands. Then it settles."
          deck="React state cycles the active workspace every 2.6s. On each switch: chrome lifts −3px for 320ms with a soft-bouncy easing (cubic-bezier 0.34, 1.56, 0.64, 1), shadow strength jumps from -16px / -3px to -18px / -6px (deeper), then returns. The active-tab underline animates from old position to new with a 280ms transition."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="F4" title="Workspace cycling lift" sub="lift + shadow expand on every switch · 320ms" refs="Apple Watch app launches · iOS spring lifts"
              behavior="Active workspace cycles Insights → Library → Studio → Insights → Inbox → Insights every 2.6s. Each switch: chrome lifts −3px (320ms cubic-bezier 0.34, 1.56, 0.64, 1) · shadow expands. Cast-shadow gradient on body intensifies in sync. Underline animates between tab positions in 280ms."
              what="React.useState + setInterval drives the cycle. Two pieces of state: active workspace and a brief 'lifting' boolean that triggers the lift animation. Both top and box-shadow transition; spring-bounce easing sells the lift physics."
              tradeoff="Lift physics need to feel light. The cubic-bezier(0.34, 1.56, 0.64, 1) overshoot is barely perceptible at 3px translation — too much overshoot at this scale reads as buggy. Don't go past 4px translation.">
            <F4 />
          </VC>
        </div>

        <SectionHead
          kicker="SECTION 5 · FLOAT ↔ LANDED · 1 VARIANT"
          title="The chrome floats while you act. It lands while you read."
          deck="Two-state machine driven by activity. Floating (3s in this demo) = full elevation, rounded corners, side-margins. Landed (3s) = chrome flush with top, sharp corners, no side-margins, flat shadow. 480ms transitions between. Surface body shifts up/down by 12px as the chrome lands or lifts. The most committed 'chrome IS part of the page' variant."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <VC id="F5" title="Float ↔ landed" sub="state machine · activity-driven" refs="macOS desk + dock metaphor · Origin idle"
              behavior="6.6s loop: floating (3s) → landing transition (300ms) → landed (3s) → lifting transition (300ms) → floating. While floating: rounded corners (14px), 14px side margins, full shadow. While landed: flush to top edge, sharp corners, flat. Surface body's `surfaceShift` adjusts so the body always sits below the chrome's bottom edge."
              what="React.useState + recursive setTimeout to step through the four phases at different durations. CSS transitions on top, left, right, border-radius, box-shadow, and border-color cover all of the visual change. Caption tracks state ('IDLE · 0:02' / 'READING · DOCKED' / 'TRANSITIONING')."
              tradeoff="Two-state machines are powerful but need real activity tracking (mouse, keys, scroll, focus events) — naive implementations land the chrome at unfortunate moments. Threshold should be ≥3s genuine inactivity, not just no-mousemove.">
            <F5 />
          </VC>
        </div>

        {/* Closing recommendation */}
        <article style={{ marginTop: 32, padding: '24px 28px 26px', borderRadius: 14, background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)' }}>
          <div style={{ fontFamily: C7.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 8 }}>SYNTHESIS · stack of three behaviors, layered</div>
          <h2 style={{ margin: '0 0 12px', fontFamily: C7.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            F1 always-on · F4 lift-on-action · F5 float ↔ landed.
          </h2>
          <p style={{ margin: '0 0 12px', fontFamily: C7.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>F1 breathing</strong> as the constant ambient state — chrome reads as alive without needing any user action. <strong>F4 lift-on-action</strong> kicks in on workspace switch — the lift sells 'something happened' physically. <strong>F5 float ↔ landed</strong> kicks in on idle/reading detection — the chrome lands when you're actually reading, lifts back when you act. Three behaviors, no conflict — they're scoped to different events.
          </p>
          <p style={{ margin: '0 0 12px', fontFamily: C7.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>F2 scroll-reactive</strong> is the strongest single behavior if you only want one — it's the most felt by the user (matches their scroll directly). <strong>F3 magnetic tab</strong> is too aggressive as a constant; ship it as a one-shot post-navigation pulse only.
          </p>
          <p style={{ margin: 0, fontFamily: C7.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            Body adaptation: the cast-shadow gradient at the top of every surface (28–36px tall, 5–6% alpha) is the load-bearing detail that makes the chrome feel like it lives ON the page. Without it the chrome reads as a floating UI element. Keep this in any production implementation.
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV7 });
