/* global React, window */
/* hifi-chrome-v9.jsx — DRAWER VARIATIONS · five takes with real subtab content.

   The v7 pill is locked. The v8 drawer pattern is the chosen reveal mechanism.
   This file explores FIVE ways the drawer content can be designed:

     DR1 · Cards-in-drawer       — each subtab a small card · kicker + label + descriptor
     DR2 · Live metric strip      — subtab + tiny live number per cell
     DR3 · Vertical menu + preview — split: list left · preview pane right
     DR4 · Section-grouped        — subtabs categorized into 3 groups
     DR5 · Two-phase cascade      — labels appear, then metadata cascades in

   Same canonical Insights subtabs (Overview · Retention · Format DNA · Audience
   · Posting). Each variant uses real subtab metadata + plausible live metrics.
   All five animate on an 8s loop · closed (3s) → opening (360ms) → open (3s)
   → closing (360ms). Renders live over <HF_InsightsOverview />.
*/

if (typeof window !== 'undefined' && window.HfShell && !window.__cv9Patched) {
  window.__OrigHfShellV9 = window.__OrigHfShell || window.HfShell;
  window.HfShell = function HfShellSlimV9({ children, style = {} }) {
    return (
      <div className="hf" style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'var(--bg-base)', fontFamily: 'var(--font-sans)',
        color: 'var(--fg-primary)', overflow: 'hidden', ...style,
      }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    );
  };
  window.__cv9Patched = true;
}

const C9 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WS_LIST = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];

// ─── Real subtab content for Insights ───────────────────────
const INSIGHTS_SUBS = [
  { id: 'overview',   label: 'Overview',     kicker: '30-DAY SNAPSHOT',     desc: 'Where the volume lives this month.', metric: '+22%',  metricLabel: 'saves',  trend: 'up' },
  { id: 'retention',  label: 'Retention',    kicker: 'WATCH-CURVE ANALYSIS', desc: 'How long viewers stay; where they drop.', metric: '64%', metricLabel: 'median',  trend: 'up' },
  { id: 'formatdna',  label: 'Format DNA',   kicker: 'PATTERN RECOGNITION', desc: 'Hooks, structures, channels by lift.', metric: '12',   metricLabel: 'patterns', trend: 'flat' },
  { id: 'audience',   label: 'Audience',     kicker: 'DEMOGRAPHIC + INTENT', desc: 'Who is watching, and how much they say.', metric: '+11.4k', metricLabel: 'net new', trend: 'up' },
  { id: 'posting',    label: 'Posting',      kicker: 'CADENCE + COVERAGE',   desc: 'Volume, timing, and channel mix.',  metric: '3.2',  metricLabel: '/ week',  trend: 'down' },
];
const ACT_SUB = 'overview';

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
  if (!Comp) return <div style={{ padding: 32, fontFamily: C9.mono, fontSize: 12, color: 'var(--tone-danger)' }}>HF_InsightsOverview not on window.</div>;
  return <div style={{ position: 'absolute', top: surfaceShift, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}><Comp /></div>;
}

// ─── Canvas wrapper ─────────────────────────────────────────
function Canvas({ children }) {
  return (
    <div className="cv6-canvas" style={{
      width: 1440, height: 760, background: 'var(--bg-base)',
      position: 'relative', overflow: 'hidden',
      border: '1px solid var(--border-default)', borderRadius: 8,
    }}>{children}</div>
  );
}

function Annot({ children }) {
  return (
    <div style={{
      position: 'absolute', top: 16, right: 16, zIndex: 20,
      padding: '6px 10px', background: 'rgba(26,24,21,0.78)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 6, fontFamily: C9.mono, fontSize: 9.5,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--fg-on-ink)', fontWeight: 600,
      boxShadow: '0 6px 14px -8px rgba(26,24,21,0.32)',
    }}>{children}</div>
  );
}

// ─── Workspace pill (top zone of the drawer · locked from v7) ──
function PillTopZone({ open }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', height: 48, flexShrink: 0 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0 }}><SeaLion size={22} /></span>
      <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
      {WS_LIST.map(w => {
        const a = w === 'Insights';
        return (
          <span key={w} style={{
            position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: a ? C9.serif : C9.sans, fontStyle: a ? 'italic' : 'normal',
            fontSize: a ? 14.5 : 13, fontWeight: a ? 600 : 500,
            color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)', cursor: 'pointer',
          }}>
            {w}
            {a && (
              <svg width="9" height="9" viewBox="0 0 9 9" style={{ marginLeft: 1, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 360ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <path d="M2 3 L4.5 5.5 L7 3" stroke="var(--accent-primary)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {a && <span style={{ position: 'absolute', left: 0, right: 13, bottom: -8, height: 2, background: 'var(--accent-primary)', borderRadius: 999, boxShadow: '0 1px 4px -1px rgba(182,83,43,0.32)' }} />}
          </span>
        );
      })}
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: C9.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>WED · APR 29</span>
    </div>
  );
}

// ─── Seam between zones · accent-soft, glows clay when freshly opened ──
function Seam({ open, justOpened, top = 48 }) {
  return (
    <span style={{
      position: 'absolute', left: 12, right: 12, top, height: 1,
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
  );
}

// ─── Standard 8s drawer cycle hook ──────────────────────────
function useDrawerCycle() {
  const [open, setOpen] = React.useState(false);
  const [justOpened, setJustOpened] = React.useState(false);
  React.useEffect(() => {
    const seq = [3000, 360, 3000, 360];
    let i = 0;
    const tick = () => {
      const target = (i % 4 === 1 || i % 4 === 2) ? true : false;
      setOpen(target);
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
  return { open, justOpened };
}

// ─── Outer drawer container ─────────────────────────────────
function DrawerShell({ open, drawerHeight, children }) {
  const totalHeight = open ? 48 + drawerHeight : 48;
  return (
    <div style={{
      background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
      borderRadius: 12, padding: 0,
      height: totalHeight,
      display: 'flex', flexDirection: 'column',
      boxShadow: open
        ? '0 28px 56px -22px rgba(26,24,21,0.26), 0 6px 14px -6px rgba(26,24,21,0.12), 0 1px 0 rgba(253,252,249,0.7) inset'
        : '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
      transition: 'height 360ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 360ms cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative', overflow: 'hidden',
    }}>
      {children}
      <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
    </div>
  );
}

// ─── Cast-shadow at top of canvas ───────────────────────────
function CastShadow({ open }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 36,
      background: open
        ? 'linear-gradient(to bottom, rgba(26,24,21,0.10), transparent)'
        : 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)',
      transition: 'background 360ms cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: 'none', zIndex: 5,
    }} />
  );
}

// ─── Trend arrow ────────────────────────────────────────────
function TrendArrow({ trend }) {
  if (trend === 'up') return <svg width="8" height="8" viewBox="0 0 8 8"><path d="M2 6 L4 2 L6 6" stroke="var(--tone-success)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (trend === 'down') return <svg width="8" height="8" viewBox="0 0 8 8"><path d="M2 2 L4 6 L6 2" stroke="var(--tone-warning)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <svg width="8" height="8" viewBox="0 0 8 8"><line x1="2" y1="4" x2="6" y2="4" stroke="var(--fg-tertiary)" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

// ───────────────────────────────────────────────────────────
// DR1 · CARDS-IN-DRAWER
// Each subtab is a small card with kicker + italic-serif label + descriptor.
// 5 cards in an even row, separated by thin vertical rules. Active card has
// accent-soft fill + clay capsule underline. Drawer height: 84px.
// ───────────────────────────────────────────────────────────
function DR1() {
  const { open, justOpened } = useDrawerCycle();
  return (
    <Canvas>
      <RealSurface surfaceShift={open ? 152 : 64} />
      <CastShadow open={open} />
      <Annot>DR1 · CARDS-IN-DRAWER · {open ? (justOpened ? 'OPENING…' : 'OPEN') : 'CLOSED'}</Annot>
      <div style={{ position: 'absolute', top: open ? 15 : 16, left: 16, right: 16, zIndex: 10, transition: 'top 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <DrawerShell open={open} drawerHeight={84}>
          <PillTopZone open={open} />
          <Seam open={open} justOpened={justOpened} />
          <div style={{ display: 'flex', alignItems: 'stretch', height: 84, flexShrink: 0 }}>
            {INSIGHTS_SUBS.map((s, i) => {
              const a = s.id === ACT_SUB;
              return (
                <React.Fragment key={s.id}>
                  {i > 0 && (
                    <span style={{
                      width: 1, alignSelf: 'stretch', marginTop: 16, marginBottom: 16,
                      background: 'var(--border-subtle)',
                      opacity: open ? 1 : 0,
                      transition: `opacity 200ms ease ${200 + i * 40}ms`,
                    }} />
                  )}
                  <div style={{
                    flex: 1, padding: '12px 16px',
                    background: a ? 'var(--accent-soft)' : 'transparent',
                    display: 'flex', flexDirection: 'column', gap: 4,
                    cursor: 'pointer', position: 'relative',
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(-6px)',
                    transition: `opacity 320ms cubic-bezier(0.4, 0, 0.2, 1) ${140 + i * 60}ms, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) ${140 + i * 60}ms`,
                  }}>
                    <span style={{ fontFamily: C9.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: a ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontWeight: 700 }}>{s.kicker}</span>
                    <span style={{ fontFamily: C9.serif, fontStyle: a ? 'italic' : 'normal', fontWeight: a ? 600 : 500, fontSize: 16, color: a ? 'var(--fg-primary)' : 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{s.label}</span>
                    <span style={{ fontFamily: C9.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.35 }}>{s.desc}</span>
                    {a && <span style={{ position: 'absolute', left: 16, right: 16, bottom: 0, height: 2, background: 'var(--accent-primary)', borderRadius: 999, boxShadow: '0 1px 3px -1px rgba(182,83,43,0.28)' }} />}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </DrawerShell>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// DR2 · LIVE METRIC STRIP
// Each subtab carries a tiny live number + trend arrow. Reads as a quick
// dashboard glance. Active gets clay underline + bold label. 5 cells.
// Drawer height: 60px.
// ───────────────────────────────────────────────────────────
function DR2() {
  const { open, justOpened } = useDrawerCycle();
  return (
    <Canvas>
      <RealSurface surfaceShift={open ? 128 : 64} />
      <CastShadow open={open} />
      <Annot>DR2 · LIVE METRIC STRIP · {open ? (justOpened ? 'OPENING…' : 'OPEN') : 'CLOSED'}</Annot>
      <div style={{ position: 'absolute', top: open ? 15 : 16, left: 16, right: 16, zIndex: 10, transition: 'top 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <DrawerShell open={open} drawerHeight={60}>
          <PillTopZone open={open} />
          <Seam open={open} justOpened={justOpened} />
          <div style={{ display: 'flex', alignItems: 'center', height: 60, flexShrink: 0, padding: '0 6px' }}>
            <span style={{
              fontFamily: C9.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--fg-tertiary)', fontWeight: 700, padding: '0 16px',
              opacity: open ? 1 : 0, transition: 'opacity 280ms ease 80ms',
            }}>INSIGHTS /</span>
            {INSIGHTS_SUBS.map((s, i) => {
              const a = s.id === ACT_SUB;
              return (
                <div key={s.id} style={{
                  flex: 1, padding: '0 12px',
                  display: 'flex', flexDirection: 'column', gap: 2,
                  cursor: 'pointer', position: 'relative',
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(-6px)',
                  transition: `opacity 320ms cubic-bezier(0.4, 0, 0.2, 1) ${160 + i * 50}ms, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) ${160 + i * 50}ms`,
                }}>
                  <span style={{
                    fontFamily: a ? C9.serif : C9.sans, fontStyle: a ? 'italic' : 'normal',
                    fontSize: a ? 13.5 : 12.5, fontWeight: a ? 600 : 500,
                    color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                    letterSpacing: '-0.005em',
                  }}>{s.label}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendArrow trend={s.trend} />
                    <span style={{ fontFamily: C9.mono, fontSize: 11, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{s.metric}</span>
                    <span style={{ fontFamily: C9.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{s.metricLabel}</span>
                  </span>
                  {a && <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 2, background: 'var(--accent-primary)', borderRadius: 999, boxShadow: '0 1px 3px -1px rgba(182,83,43,0.28)' }} />}
                </div>
              );
            })}
          </div>
        </DrawerShell>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// DR3 · VERTICAL MENU + PREVIEW PANE
// Split layout: left panel (~320px) holds 5 subtab items as a vertical list;
// right panel shows a small preview of the active subtab (kicker + headline +
// 3-stat row). Drawer height: 156px.
// ───────────────────────────────────────────────────────────
function DR3() {
  const { open, justOpened } = useDrawerCycle();
  const act = INSIGHTS_SUBS.find(s => s.id === ACT_SUB);
  return (
    <Canvas>
      <RealSurface surfaceShift={open ? 224 : 64} />
      <CastShadow open={open} />
      <Annot>DR3 · LIST + PREVIEW · {open ? (justOpened ? 'OPENING…' : 'OPEN') : 'CLOSED'}</Annot>
      <div style={{ position: 'absolute', top: open ? 15 : 16, left: 16, right: 16, zIndex: 10, transition: 'top 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <DrawerShell open={open} drawerHeight={156}>
          <PillTopZone open={open} />
          <Seam open={open} justOpened={justOpened} />
          <div style={{ display: 'flex', height: 156, flexShrink: 0 }}>
            {/* LEFT · subtab list */}
            <div style={{
              width: 320, padding: '12px 16px',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <span style={{
                fontFamily: C9.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--fg-tertiary)', fontWeight: 700, marginBottom: 4,
                opacity: open ? 1 : 0, transition: 'opacity 280ms ease 80ms',
              }}>INSIGHTS · 5 VIEWS</span>
              {INSIGHTS_SUBS.map((s, i) => {
                const a = s.id === ACT_SUB;
                return (
                  <span key={s.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 10px', borderRadius: 6,
                    background: a ? 'var(--accent-soft)' : 'transparent',
                    cursor: 'pointer',
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateX(0)' : 'translateX(-8px)',
                    transition: `opacity 280ms ease ${140 + i * 50}ms, transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1) ${140 + i * 50}ms`,
                  }}>
                    <span style={{
                      fontFamily: a ? C9.serif : C9.sans, fontStyle: a ? 'italic' : 'normal',
                      fontSize: a ? 14 : 13, fontWeight: a ? 600 : 500,
                      color: a ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
                    }}>{s.label}</span>
                    <span style={{ fontFamily: C9.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{s.metric} {s.metricLabel}</span>
                  </span>
                );
              })}
            </div>
            {/* RIGHT · preview pane */}
            <div style={{
              flex: 1, padding: '14px 22px',
              display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 320ms ease 320ms, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) 320ms',
            }}>
              <span style={{ fontFamily: C9.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>{act.kicker}</span>
              <span style={{ fontFamily: C9.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.15 }}>{act.desc}</span>
              <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
                {[
                  { label: 'Saves',    value: '+22%',  trend: 'up' },
                  { label: 'Views',    value: '+12%',  trend: 'up' },
                  { label: 'Channel',  value: '−4%',  trend: 'down' },
                ].map(stat => (
                  <span key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontFamily: C9.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>{stat.label}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TrendArrow trend={stat.trend} />
                      <span style={{ fontFamily: C9.mono, fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)' }}>{stat.value}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DrawerShell>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// DR4 · SECTION-GROUPED
// Subtabs grouped into 3 categories: Performance · Audience · Output.
// Each group has a mono section header above its subtabs. Drawer height: 76px.
// ───────────────────────────────────────────────────────────
const DR4_GROUPS = [
  { name: 'PERFORMANCE', items: ['Overview', 'Retention'] },
  { name: 'AUDIENCE',    items: ['Format DNA', 'Audience'] },
  { name: 'OUTPUT',      items: ['Posting'] },
];
function DR4() {
  const { open, justOpened } = useDrawerCycle();
  return (
    <Canvas>
      <RealSurface surfaceShift={open ? 144 : 64} />
      <CastShadow open={open} />
      <Annot>DR4 · SECTION-GROUPED · {open ? (justOpened ? 'OPENING…' : 'OPEN') : 'CLOSED'}</Annot>
      <div style={{ position: 'absolute', top: open ? 15 : 16, left: 16, right: 16, zIndex: 10, transition: 'top 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <DrawerShell open={open} drawerHeight={76}>
          <PillTopZone open={open} />
          <Seam open={open} justOpened={justOpened} />
          <div style={{ display: 'flex', alignItems: 'stretch', height: 76, flexShrink: 0 }}>
            {DR4_GROUPS.map((g, gi) => (
              <React.Fragment key={g.name}>
                {gi > 0 && (
                  <span style={{
                    width: 1, alignSelf: 'stretch', marginTop: 16, marginBottom: 16,
                    background: 'var(--border-subtle)',
                    opacity: open ? 1 : 0,
                    transition: `opacity 200ms ease ${200 + gi * 80}ms`,
                  }} />
                )}
                <div style={{
                  flex: g.items.length, padding: '10px 18px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  <span style={{
                    fontFamily: C9.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'var(--fg-tertiary)', fontWeight: 700,
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(-4px)',
                    transition: `opacity 280ms ease ${100 + gi * 80}ms, transform 280ms cubic-bezier(0.4, 0, 0.2, 1) ${100 + gi * 80}ms`,
                  }}>{g.name}</span>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                    {g.items.map((label, ii) => {
                      const sub = INSIGHTS_SUBS.find(s => s.label === label);
                      const a = sub.id === ACT_SUB;
                      return (
                        <span key={label} style={{
                          position: 'relative',
                          fontFamily: a ? C9.serif : C9.sans, fontStyle: a ? 'italic' : 'normal',
                          fontSize: a ? 15 : 14, fontWeight: a ? 600 : 500,
                          color: a ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                          cursor: 'pointer', letterSpacing: '-0.005em',
                          opacity: open ? 1 : 0,
                          transform: open ? 'translateY(0)' : 'translateY(-6px)',
                          transition: `opacity 320ms ease ${180 + gi * 80 + ii * 40}ms, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) ${180 + gi * 80 + ii * 40}ms`,
                        }}>
                          {label}
                          {a && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -6, height: 1.5, background: 'var(--accent-primary)', borderRadius: 999, boxShadow: '0 1px 3px -1px rgba(182,83,43,0.28)' }} />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </React.Fragment>
            ))}
            <span style={{ flex: 1 }} />
            <div style={{
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 8,
              opacity: open ? 1 : 0,
              transition: 'opacity 280ms ease 380ms',
            }}>
              <span style={{ fontFamily: C9.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>LAST 30D</span>
            </div>
          </div>
        </DrawerShell>
      </div>
    </Canvas>
  );
}

// ───────────────────────────────────────────────────────────
// DR5 · TWO-PHASE CASCADE
// On open, subtabs reveal in two phases:
//   Phase 1 (0–360ms): drawer expands · italic-serif labels appear
//   Phase 2 (400–880ms): mono kicker + descriptor cascade in below each label
// Closes in reverse. Drawer height: 100px.
// ───────────────────────────────────────────────────────────
function DR5() {
  const { open, justOpened } = useDrawerCycle();
  return (
    <Canvas>
      <RealSurface surfaceShift={open ? 168 : 64} />
      <CastShadow open={open} />
      <Annot>DR5 · TWO-PHASE CASCADE · {open ? (justOpened ? 'PHASE 1' : 'OPEN') : 'CLOSED'}</Annot>
      <div style={{ position: 'absolute', top: open ? 15 : 16, left: 16, right: 16, zIndex: 10, transition: 'top 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <DrawerShell open={open} drawerHeight={100}>
          <PillTopZone open={open} />
          <Seam open={open} justOpened={justOpened} />
          <div style={{ display: 'flex', alignItems: 'stretch', height: 100, flexShrink: 0 }}>
            <span style={{
              fontFamily: C9.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--fg-tertiary)', fontWeight: 700, padding: '14px 16px 0',
              opacity: open ? 1 : 0, transition: 'opacity 280ms ease 80ms',
            }}>INSIGHTS</span>
            <span style={{
              width: 1, alignSelf: 'stretch', marginTop: 16, marginBottom: 16,
              background: 'var(--border-subtle)',
              opacity: open ? 1 : 0, transition: 'opacity 280ms ease 80ms',
            }} />
            {INSIGHTS_SUBS.map((s, i) => {
              const a = s.id === ACT_SUB;
              return (
                <div key={s.id} style={{
                  flex: 1, padding: '14px 14px', position: 'relative',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  cursor: 'pointer',
                }}>
                  {/* Phase 1 · italic-serif label */}
                  <span style={{
                    fontFamily: a ? C9.serif : C9.sans, fontStyle: a ? 'italic' : 'normal',
                    fontSize: a ? 16 : 14, fontWeight: a ? 600 : 500,
                    color: a ? 'var(--fg-primary)' : 'var(--fg-primary)',
                    letterSpacing: '-0.01em', lineHeight: 1.1,
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(-8px)',
                    transition: `opacity 320ms ease ${140 + i * 60}ms, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) ${140 + i * 60}ms`,
                  }}>{s.label}</span>
                  {/* Phase 2 · mono kicker (cascades in 400ms after labels) */}
                  <span style={{
                    fontFamily: C9.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: a ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontWeight: 700,
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(-4px)',
                    transition: `opacity 280ms ease ${440 + i * 60}ms, transform 280ms ease ${440 + i * 60}ms`,
                  }}>{s.kicker}</span>
                  {/* Phase 2 · descriptor (cascades in last) */}
                  <span style={{
                    fontFamily: C9.serif, fontStyle: 'italic', fontSize: 11.5,
                    color: 'var(--fg-secondary)', lineHeight: 1.35,
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(-4px)',
                    transition: `opacity 280ms ease ${540 + i * 60}ms, transform 280ms ease ${540 + i * 60}ms`,
                  }}>{s.desc}</span>
                  {a && <span style={{
                    position: 'absolute', left: 14, right: 14, bottom: 0, height: 2,
                    background: 'var(--accent-primary)', borderRadius: 999,
                    opacity: open ? 1 : 0,
                    transform: open ? 'scaleX(1)' : 'scaleX(0.3)',
                    transformOrigin: 'left',
                    transition: `opacity 280ms ease ${640 + i * 60}ms, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) ${640 + i * 60}ms`,
                    boxShadow: '0 1px 3px -1px rgba(182,83,43,0.28)',
                  }} />}
                </div>
              );
            })}
          </div>
        </DrawerShell>
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
          <span style={{ fontFamily: C9.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: C9.serif, fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>{title}</h3>
          <span style={{ fontFamily: C9.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C9.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>ref · {refs}</span>
        </div>
      </div>
      <div style={{ padding: '8px 24px 6px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ fontFamily: C9.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)' }}>BEHAVIOR · </span>
        <span style={{ fontFamily: C9.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-primary)' }}>{behavior}</span>
      </div>
      <div style={{ background: 'var(--bg-base)', padding: 24, display: 'flex', justifyContent: 'center' }}>{children}</div>
      <div style={{ padding: '12px 24px 14px', borderTop: '1px solid var(--border-default)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: C9.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-success)', marginBottom: 4 }}>WHAT</div>
          <div style={{ fontFamily: C9.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{what}</div>
        </div>
        <div>
          <div style={{ fontFamily: C9.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-warning)', marginBottom: 4 }}>TRADEOFF</div>
          <div style={{ fontFamily: C9.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{tradeoff}</div>
        </div>
      </div>
    </article>
  );
}

function SectionHead({ kicker, title, deck }) {
  return (
    <div style={{ marginTop: 32, marginBottom: 20 }}>
      <div style={{ fontFamily: C9.mono, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 6 }}>{kicker}</div>
      <h2 style={{ margin: '0 0 6px', fontFamily: C9.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1 }}>{title}</h2>
      <p style={{ margin: 0, fontFamily: C9.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>{deck}</p>
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
          <span style={{ fontFamily: C9.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            CHROME IDEATION · v9 · DRAWER VARIATIONS
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontFamily: C9.serif, fontWeight: 500, fontSize: 40, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Five drawer takes, with the <span style={{ fontStyle: 'italic' }}>actual subtab content inside.</span>
        </h1>
        <p style={{ margin: '0 0 12px', fontFamily: C9.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 980, lineHeight: 1.55 }}>
          The pill is locked. The drawer mechanism is chosen. This loop explores what GOES INSIDE the drawer — cards with descriptors, live metrics per subtab, a list-plus-preview split, section-grouped categories, and a two-phase cascade reveal. Each animates an 8s open / close cycle on page load.
        </p>
        <p style={{ margin: 0, fontFamily: C9.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          v7 floating · v8 subtabs · <span style={{ color: 'var(--accent-primary)' }}>v9 drawer content · this page</span>
        </p>
      </div>
    </div>
  );
}

function HF_ChromeIdeationV9() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <GlobalAnimStyles />
      <PageHeader />
      <div style={{ maxWidth: 1504, margin: '0 auto', padding: '24px 32px 96px' }}>
        <SectionHead
          kicker="GROUP DR · DRAWER CONTENT · 5 TAKES"
          title="Same drawer · five interior treatments · all on the live Insights surface."
          deck="Subtabs and metadata for Insights are real: Overview / Retention / Format DNA / Audience / Posting · each carries a kicker, descriptor, and a plausible live metric. Pick which interior best balances density, scannability, and editorial calm."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <VC id="DR1" title="Cards-in-drawer" sub="kicker + italic label + descriptor · 5 cards in a row" refs="Apple App Store category cards · Notion gallery"
              behavior="Five cards, one per subtab, separated by thin vertical rules. Each card stacks: mono kicker (UPPERCASE 0.14em) → italic-serif label (16px, 1.1 line-height) → italic-serif descriptor (12px, 1.35 line-height). Active card gets accent-soft fill + bottom clay capsule. Cards stagger in 60ms apart. 84px drawer."
              what="The most literary treatment. Each subtab gets a small editorial card that reads like a TOC entry. Reads-as 'choose where to spend the next minute.' The descriptor line is the load-bearing detail — gives the reader a reason to pick THIS subtab over the others."
              tradeoff="Tallest single-row drawer at 84px (drawer total 132px including pill). The descriptor lines need to be genuinely good copy or they read as filler. If the descriptors aren't curated, this reads worse than a label-only row.">
            <DR1 />
          </VC>

          <VC id="DR2" title="Live metric strip" sub="subtab + tiny live metric per cell · 60px drawer" refs="Linear inbox count badges · Stripe sticky stats"
              behavior="One row of 5 cells, each: italic-serif label on top (12.5–13.5px) + a stat row underneath (trend arrow + mono number + mono unit). Active cell gets clay underline. Cells stagger in 50ms apart. 60px drawer (most compact of the five)."
              what="Quick-glance dashboard feel. Each subtab shows you what's interesting RIGHT NOW (Overview +22% saves · Retention 64% median · Format DNA 12 patterns · Audience +11.4k net · Posting 3.2 / week). Lets the user navigate by 'where's the action' rather than 'where's the heading.'"
              tradeoff="Metrics need to be live and meaningful — stale or fake numbers undermine the whole pattern. Cell width gets tight at 5 evenly-distributed columns; longer metric labels could wrap awkwardly. Best if there's a real backend wired to update these.">
            <DR2 />
          </VC>

          <VC id="DR3" title="List + preview pane" sub="left list (320px) · right preview pane · 156px drawer" refs="Notion sidebar + page · iA Writer outline + body"
              behavior="Split layout. Left: header + 5 vertical menu items (each: label + small mono metric, active item gets accent-soft fill). Right: preview pane for the active subtab — kicker + 22px italic-serif descriptor headline + 3-stat row (Saves +22%, Views +12%, Channel −4%). Left items slide in from −8px x-axis; right pane fades from −8px y-axis after a 320ms delay."
              what="The most committed treatment — the drawer becomes a small information surface. Lets the user PREVIEW what the active subtab will show before committing to navigate. Reads as 'app within an app.' Best for power users who want context before clicking."
              tradeoff="Tallest at 156px drawer (204px total chrome). Eats real estate. The right preview pane has to be content-dynamic — empty pane = wasted space. Best on workspaces where each subtab has genuinely distinct data; weaker on workspaces with subtle subtab differences.">
            <DR3 />
          </VC>

          <VC id="DR4" title="Section-grouped" sub="3 groups · Performance / Audience / Output · mono section heads" refs="The Atlantic site nav · NYRB section pages"
              behavior="Subtabs categorized into 3 groups separated by thin vertical rules. Each group: mono group header (UPPERCASE 0.16em) + italic-serif subtab labels in a row below. Active subtab gets clay capsule. Group headers stagger in 80ms; labels within each group stagger 40ms. 76px drawer."
              what="Reads as a magazine table-of-contents — the section headers tell you WHY the subtabs are grouped. Gives the user a mental model: 'Performance is here · Audience is there · Output is over there.' Strongest when subtab count grows past 5–6."
              tradeoff="Requires a real categorization that survives growth. Fits this Insights example (5 subs → 3 groups). Library has 6 subs that don't naturally cluster. Studio has 6 with mixed concerns. Forcing groups where none exist is worse than no grouping. Hand-curated per workspace.">
            <DR4 />
          </VC>

          <VC id="DR5" title="Two-phase cascade" sub="labels first · metadata after a beat · 100px drawer" refs="Apple Stage Manager reveal · Origin idle wake"
              behavior="Phase 1 (0–360ms): drawer expands · italic-serif labels appear with stagger (60ms each). Phase 2 (440ms onward): mono kicker cascades in below each label, then italic-serif descriptor (540ms+), then active-tab clay underline (640ms+). Total reveal sequence ~880ms before fully settled."
              what="Time-based information density. Fast scanners get labels in 360ms; readers who linger get the kicker + descriptor 100ms later. Honors both modes without forcing one. Most cinematic of the five — the cascade is a reading rhythm, not just a transition."
              tradeoff="The cascade is over-spec'd if subtab labels alone are enough. Phase 2 metadata has to be load-bearing or it reads as performative motion. Eats 100px drawer. Best when descriptor copy is curated and the user genuinely needs the secondary context.">
            <DR5 />
          </VC>

        </div>

        <article style={{ marginTop: 32, padding: '24px 28px 26px', borderRadius: 14, background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)' }}>
          <div style={{ fontFamily: C9.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 8 }}>SYNTHESIS · which interior</div>
          <h2 style={{ margin: '0 0 12px', fontFamily: C9.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            DR2 metric strip is the pragmatic default. DR1 cards is the editorial default. DR3 split-pane is the power-user mode.
          </h2>
          <p style={{ margin: '0 0 12px', fontFamily: C9.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>DR2 metric strip</strong> wins on usefulness — every glance at the drawer answers "where's the action." 60px is also the most disciplined drawer. <strong>DR1 cards</strong> wins on editorial character — feels most like COOPR, with italic-serif descriptors carrying the brand voice. <strong>DR3 split-pane</strong> wins on power — the preview pane lets users navigate by intent, not by label.
          </p>
          <p style={{ margin: 0, fontFamily: C9.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            DR4 section-grouped is the strongest IF the categorization survives across all 7 workspaces — an open research question. DR5 cascade is beautiful but has the highest copy-curation cost; ship it once the descriptors are written. Recommended sequence: ship DR2 first (cheap, useful), upgrade to DR1 once descriptors are written, offer DR3 as a "rich nav" mode in settings.
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV9 });
