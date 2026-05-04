/* global React, window */
/* hifi-chrome-v4.jsx — chat-aware bottom dock + phantom-top deep dive.

   Ten variants in two directions you said you wanted more of:
     CV1-CV5 · Chat-Bottom Dock — bottom pill that's chat-aware. Workspace
              nav + chat composer share the floating element. On Home the
              chat is dominant; on other pages it minimizes to a small button.
     PV1-PV5 · Phantom Top — chrome only on hover. Each variant solves the
              "how do I know where I am at rest?" problem differently.

   References across the field:
     CV-direction: Slack home prompt · iMessage compose pill · Beehiiv editor
                   bottom bar · Cron command bar · Notion comment composer
     PV-direction: Arc URL bar · Apple TouchBar · Substack reader · Origin
                   minimal mode · Stripe Sigma reader
*/

const C4 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WS = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];
const ACTIVE = 'Insights';
const ACT_SUB = 'Overview';

// ─── Sea lion + workspace glyphs (same primitives as v3) ──
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
function WSGlyph({ name, active = false }) {
  const stroke = active ? 'var(--accent-primary)' : 'var(--fg-secondary)';
  const sw = 1.4;
  const common = { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none' };
  switch (name) {
    case 'Home':     return <svg {...common}><path d="M2 7 L7 3 L12 7 V12 H2 Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/><line x1="6" y1="12" x2="6" y2="9" stroke={stroke} strokeWidth={sw}/><line x1="8" y1="12" x2="8" y2="9" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Studio':   return <svg {...common}><path d="M3 11 L9.5 4.5 L11 6 L4.5 12.5 Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" transform="translate(0,-1)"/></svg>;
    case 'Library':  return <svg {...common}><rect x="2" y="2" width="3" height="10" stroke={stroke} strokeWidth={sw}/><rect x="6" y="3" width="3" height="9" stroke={stroke} strokeWidth={sw}/><rect x="10" y="4" width="2.5" height="8" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Insights': return <svg {...common}><circle cx="7" cy="7" r="5" stroke={stroke} strokeWidth={sw}/><path d="M7 2 V7 L10.5 8.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case 'Intel':    return <svg {...common}><circle cx="7" cy="7" r="5.5" stroke={stroke} strokeWidth={sw}/><circle cx="7" cy="7" r="2" stroke={stroke} strokeWidth={sw}/></svg>;
    case 'Inbox':    return <svg {...common}><path d="M2 4 L12 4 V11 H2 Z" stroke={stroke} strokeWidth={sw}/><path d="M2 4 L7 8 L12 4" stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/></svg>;
    case 'Calendar': return <svg {...common}><rect x="2" y="3" width="10" height="9" stroke={stroke} strokeWidth={sw}/><line x1="2" y1="6" x2="12" y2="6" stroke={stroke} strokeWidth={sw}/></svg>;
    default: return null;
  }
}

// Send arrow used in chat composer mockups
function SendArrow({ size = 12, color = 'var(--fg-on-accent)' }) {
  return <svg width={size} height={size} viewBox="0 0 12 12" fill="none"><path d="M2 6 L10 6 M7 3 L10 6 L7 9" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

// Page sliver (Insights surface stand-in)
function Sliver({ caption = 'Insights · Overview · Wed Apr 28', minH = 100 }) {
  return (
    <div style={{ padding: '32px 32px 0', background: 'var(--bg-base)', minHeight: minH }}>
      <div style={{ fontFamily: C4.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>{caption}</div>
      <h2 style={{ margin: '6px 0 0', fontFamily: C4.serif, fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: 'var(--accent-primary)' }}>+22% saves</span>, +12% views. <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>One channel is going backwards.</span>
      </h2>
    </div>
  );
}

// Home content stand-in (used by chat-mode shots)
function HomeSliver() {
  return (
    <div style={{ padding: '40px 32px 0', background: 'var(--bg-base)', minHeight: 100 }}>
      <div style={{ fontFamily: C4.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>Home · Wed Apr 28 · Wayanad</div>
      <h2 style={{ margin: '6px 0 0', fontFamily: C4.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        Good morning, <span style={{ fontStyle: 'italic' }}>Henry</span>.
      </h2>
      <p style={{ margin: '6px 0 0', fontFamily: C4.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)' }}>
        Three things waiting for you. The Fujikawa cut is closest to ship.
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CV1 · Hybrid pill — workspace icons LEFT, chat composer RIGHT
// One pill that splits into two zones. Active workspace clay-tinted.
// ──────────────────────────────────────────────────────────
function ChromeCV1() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative' }}>
      <Sliver minH={200} />
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderRadius: 999, padding: '6px',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        boxShadow: '0 18px 44px -16px rgba(26,24,21,0.20), 0 4px 10px -4px rgba(26,24,21,0.10)',
        minWidth: 720,
      }}>
        {/* Sea lion + workspace icons (compressed) */}
        <span style={{ padding: '5px 8px 5px 6px' }}><SeaLion size={20} /></span>
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{
              width: 28, height: 28,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 6,
              background: a ? 'var(--accent-soft)' : 'transparent',
              cursor: 'pointer',
            }}>
              <WSGlyph name={w} active={a} />
            </span>
          );
        })}
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {/* Chat composer */}
        <span style={{
          flex: 1, display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '0 4px 0 12px', minWidth: 280,
        }}>
          <span style={{ fontFamily: C4.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-tertiary)' }}>Ask anything · @ for sources, # for projects…</span>
          <span style={{ flex: 1 }} />
          <span style={{
            width: 28, height: 28, borderRadius: 999,
            background: 'var(--accent-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><SendArrow /></span>
        </span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CV2 · Two-state morph — chat mode (Home) + nav mode (other pages)
// ──────────────────────────────────────────────────────────
function ChromeCV2() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      {/* Top half — chat mode (Home) */}
      <div style={{ position: 'relative', minHeight: 220, borderBottom: '1px dashed var(--border-default)' }}>
        <div style={{ padding: '14px 24px 0', fontFamily: C4.mono, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>
          STATE A · ON HOME · CHAT IS DOMINANT
        </div>
        <HomeSliver />
        <div style={{
          position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 999, padding: '6px',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          boxShadow: '0 18px 44px -16px rgba(26,24,21,0.20)',
          minWidth: 760,
        }}>
          <span style={{ padding: '5px 8px 5px 6px' }}><SeaLion size={20} /></span>
          <span style={{
            flex: 1, display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 4px 6px 14px', minWidth: 480,
          }}>
            <span style={{ fontFamily: C4.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-tertiary)' }}>Draft anything, ask about your work, or paste a link.</span>
            <span style={{ flex: 1 }} />
            <span style={{
              width: 30, height: 30, borderRadius: 999,
              background: 'var(--accent-primary)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><SendArrow size={13} /></span>
          </span>
          <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
          <span style={{ padding: '0 6px', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {WS.filter(w => w !== 'Home').slice(0, 6).map(w => (
              <span key={w} style={{
                width: 24, height: 24,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 5, opacity: 0.55,
              }}>
                <WSGlyph name={w} />
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Bottom half — nav mode (other pages) */}
      <div style={{ position: 'relative', minHeight: 220 }}>
        <div style={{ padding: '14px 24px 0', fontFamily: C4.mono, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>
          STATE B · ON INSIGHTS · NAV IS DOMINANT, CHAT MINIMIZES
        </div>
        <Sliver minH={120} />
        <div style={{
          position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 999, padding: '6px',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          boxShadow: '0 18px 44px -16px rgba(26,24,21,0.20)',
        }}>
          <span style={{ padding: '5px 8px 5px 6px' }}><SeaLion size={20} /></span>
          <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                width: 32, height: 32,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 7,
                background: a ? 'var(--accent-soft)' : 'transparent',
                cursor: 'pointer',
              }}>
                <WSGlyph name={w} active={a} />
              </span>
            );
          })}
          <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
          {/* Chat minimized to button */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 10px 5px 8px',
            borderRadius: 999,
            background: 'var(--surface-2)',
            cursor: 'pointer',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 4 L12 4 V10 L8 10 L6 12 L6 10 L2 10 Z" stroke="var(--fg-secondary)" strokeWidth="1.4" strokeLinejoin="round"/></svg>
            <span style={{ fontFamily: C4.sans, fontSize: 12, color: 'var(--fg-secondary)', fontWeight: 500 }}>Chat</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CV3 · Chat dominant + small workspace dot rail above
// On Home: chat is the centerpiece. On other pages chat collapses, nav slides into prominence.
// ──────────────────────────────────────────────────────────
function ChromeCV3() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative' }}>
      <HomeSliver />

      {/* Floating dock cluster — chat composer with tiny dot-rail of workspaces above */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        {/* Small dot-rail of workspaces */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 999,
          boxShadow: '0 6px 16px -10px rgba(26,24,21,0.10)',
        }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: a ? 'var(--accent-primary)' : 'var(--fg-tertiary)',
                opacity: a ? 1 : 0.5,
                cursor: 'pointer',
              }} />
            );
          })}
          <span style={{ width: 1, height: 10, background: 'var(--border-subtle)', margin: '0 4px' }} />
          <span style={{ fontFamily: C4.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-secondary)' }}>{ACTIVE}</span>
        </div>

        {/* Big chat composer */}
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '10px',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 18px 44px -16px rgba(26,24,21,0.20)',
          width: 720,
        }}>
          <span style={{ padding: '0 8px' }}><SeaLion size={22} /></span>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
          <span style={{ flex: 1, fontFamily: C4.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-tertiary)', padding: '4px 8px' }}>
            Ask anything · @ for sources, / for templates…
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 8px 4px 6px',
            borderRadius: 999,
            background: 'var(--surface-2)',
          }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, fontFamily: C4.mono }}>S</span>
            <span style={{ fontFamily: C4.sans, fontSize: 11.5, color: 'var(--fg-secondary)', fontWeight: 500 }}>Sonnet</span>
          </span>
          <span style={{
            width: 32, height: 32, borderRadius: 999,
            background: 'var(--accent-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><SendArrow size={14} /></span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CV4 · Chat-FAB + workspace dock · separation of concerns
// ──────────────────────────────────────────────────────────
function ChromeCV4() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative' }}>
      <Sliver minH={220} />

      {/* Workspace dock at bottom-center */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderRadius: 999, padding: '6px',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        boxShadow: '0 18px 44px -16px rgba(26,24,21,0.20)',
      }}>
        <span style={{ padding: '5px 8px 5px 6px' }}><SeaLion size={20} /></span>
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        {WS.map(w => {
          const a = w === ACTIVE;
          return (
            <span key={w} style={{
              width: 32, height: 32,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8,
              background: a ? 'var(--accent-soft)' : 'transparent',
              cursor: 'pointer',
            }}>
              <WSGlyph name={w} active={a} />
            </span>
          );
        })}
      </div>

      {/* Chat FAB at bottom-right */}
      <div style={{
        position: 'absolute', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
      }}>
        {/* Subtle hint label */}
        <span style={{
          padding: '4px 10px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6,
          fontFamily: C4.serif, fontStyle: 'italic', fontSize: 12,
          color: 'var(--fg-tertiary)',
          boxShadow: '0 6px 16px -8px rgba(26,24,21,0.12)',
        }}>Ask Coopr anything</span>
        <span style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--accent-primary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 18px 44px -12px rgba(182,83,43,0.45), 0 4px 10px -4px rgba(26,24,21,0.18)',
          cursor: 'pointer',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 7 L21 7 V17 L13 17 L9 21 L9 17 L3 17 Z" stroke="var(--fg-on-accent)" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CV5 · Chat IS the dock — workspace tabs as a thin hover-tray ABOVE
// On Home, the entire chrome is just the chat bar. Workspace nav reveals on hover.
// ──────────────────────────────────────────────────────────
function ChromeCV5() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative' }}>
      <HomeSliver />

      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        {/* Hover-revealed workspace tray (shown live for the mockup) */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 999, padding: '4px 6px',
          display: 'inline-flex', alignItems: 'center', gap: 2,
          boxShadow: '0 6px 16px -10px rgba(26,24,21,0.12)',
        }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                width: 26, height: 26,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6,
                background: a ? 'var(--accent-soft)' : 'transparent',
                cursor: 'pointer',
              }}>
                <WSGlyph name={w} active={a} />
              </span>
            );
          })}
        </div>

        {/* Chat bar — the primary chrome */}
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 18, padding: '8px',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 18px 44px -16px rgba(26,24,21,0.22)',
          width: 760,
        }}>
          <span style={{ padding: '0 6px' }}><SeaLion size={24} /></span>
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
          <span style={{ flex: 1, fontFamily: C4.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-tertiary)', padding: '6px 8px' }}>
            What are you making today?
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: C4.mono, fontSize: 9.5, color: 'var(--fg-tertiary)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '4px 8px', background: 'var(--surface-2)', borderRadius: 5,
          }}>
            <span style={{ fontWeight: 700 }}>↑</span> hover for nav
          </span>
          <span style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'var(--accent-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><SendArrow size={15} /></span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PV1 · Progressive reveal — three layers based on cursor distance from top
// ──────────────────────────────────────────────────────────
function ChromePV1() {
  return (
    <div style={{ background: 'var(--bg-base)', position: 'relative', minHeight: 320 }}>
      {/* Layer descriptors */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)' }}>
        {[
          { label: 'AT REST · 0–5px', desc: '1px hairline only · barely there' },
          { label: 'CURSOR IN TOP 60–100PX', desc: 'sea lion + breadcrumb · partial fade-in' },
          { label: 'CURSOR IN TOP 0–60PX', desc: 'full pill · workspaces + subpages' },
        ].map((l, i) => (
          <div key={i} style={{ flex: 1, padding: '12px 16px', borderRight: i < 2 ? '1px solid var(--border-default)' : 'none', background: 'var(--surface-1)' }}>
            <div style={{ fontFamily: C4.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700, marginBottom: 4 }}>{l.label}</div>
            <div style={{ fontFamily: C4.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-secondary)' }}>{l.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        {/* Layer 1 · rest */}
        <div style={{ flex: 1, position: 'relative', minHeight: 200, borderRight: '1px solid var(--border-default)' }}>
          <div style={{ height: 1, background: 'rgba(26,24,21,0.12)' }} />
          <div style={{ padding: '24px 18px', fontFamily: C4.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-tertiary)' }}>The page sits at full height. The chrome is gone except the hairline.</div>
        </div>
        {/* Layer 2 · partial */}
        <div style={{ flex: 1, position: 'relative', minHeight: 200, borderRight: '1px solid var(--border-default)' }}>
          <div style={{ padding: '12px 18px', display: 'inline-flex', alignItems: 'center', gap: 10, opacity: 0.78 }}>
            <SeaLion size={18} />
            <span style={{ fontFamily: C4.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)' }}>{ACTIVE}</span>
            <span style={{ fontFamily: C4.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>/</span>
            <span style={{ fontFamily: C4.sans, fontSize: 12, color: 'var(--fg-tertiary)' }}>{ACT_SUB}</span>
          </div>
          <div style={{ height: 1, background: 'rgba(26,24,21,0.12)' }} />
          <div style={{ padding: '20px 18px 0', fontFamily: C4.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-tertiary)' }}>Halfway. Sea lion + breadcrumb tells you where you are. No nav yet.</div>
        </div>
        {/* Layer 3 · full */}
        <div style={{ flex: 1, position: 'relative', minHeight: 200 }}>
          <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
              borderRadius: 999, padding: '5px 6px',
              display: 'inline-flex', alignItems: 'center', gap: 2,
              boxShadow: '0 12px 28px -12px rgba(26,24,21,0.16)',
            }}>
              <span style={{ padding: '4px 8px 4px 6px' }}><SeaLion size={16} /></span>
              {WS.map(w => {
                const a = w === ACTIVE;
                return (
                  <span key={w} style={{
                    width: 24, height: 24,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 5,
                    background: a ? 'var(--accent-soft)' : 'transparent',
                  }}>
                    <WSGlyph name={w} active={a} />
                  </span>
                );
              })}
            </div>
          </div>
          <div style={{ padding: '12px 18px 0', fontFamily: C4.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-tertiary)' }}>Full pill. Workspaces visible. Hover active = subpage popover.</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PV2 · Phantom + persistent corner indicator
// You always know where you are; nav reveals on top hover.
// ──────────────────────────────────────────────────────────
function ChromePV2() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative' }}>
      <div style={{ height: 1, background: 'rgba(26,24,21,0.10)' }} />
      <Sliver minH={200} />
      {/* Persistent corner badge — bottom right */}
      <div style={{
        position: 'absolute', bottom: 24, right: 24,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 12px',
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderRadius: 999,
        boxShadow: '0 6px 16px -10px rgba(26,24,21,0.12)',
      }}>
        <SeaLion size={16} />
        <span style={{ fontFamily: C4.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-primary)' }}>{ACTIVE}</span>
        <span style={{ fontFamily: C4.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>/</span>
        <span style={{ fontFamily: C4.sans, fontSize: 11.5, color: 'var(--fg-secondary)' }}>{ACT_SUB}</span>
        <span style={{ fontFamily: C4.mono, fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 8, marginLeft: 2 }}>↑ HOVER FOR NAV</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PV3 · Breadcrumb wisp — almost-invisible serif text always present at top
// ──────────────────────────────────────────────────────────
function ChromePV3() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative' }}>
      {/* Wisp text top center */}
      <div style={{
        padding: '14px 32px 6px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.55,
      }}>
        <span style={{ fontFamily: C4.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-tertiary)' }}>
          Coopr · {ACTIVE} · <span style={{ color: 'var(--fg-secondary)', fontWeight: 500 }}>{ACT_SUB}</span>
        </span>
      </div>
      <div style={{ height: 1, background: 'rgba(26,24,21,0.06)', marginBottom: 4 }} />
      <Sliver minH={160} />
      <div style={{ position: 'absolute', top: 12, right: 24, fontFamily: C4.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
        AT REST · WISP TEXT TELLS YOU WHERE YOU ARE · HOVER FOR FULL NAV
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PV4 · Side-rail clay indicator + hover-top reveal
// A 2px clay strip on the right edge is the persistent indicator
// ──────────────────────────────────────────────────────────
function ChromePV4() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative', display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ height: 1, background: 'rgba(26,24,21,0.08)' }} />
        <Sliver minH={220} />
        <div style={{ position: 'absolute', top: 14, right: 24, fontFamily: C4.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          THE CLAY STRIP RIGHT → IS YOUR PERMANENT 'YOU ARE HERE' INDICATOR
        </div>
      </div>
      {/* Right-edge clay strip with section label rotated */}
      <div style={{
        width: 28, background: 'var(--surface-1)',
        borderLeft: '1px solid var(--border-subtle)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
          width: 3, height: 60, background: 'var(--accent-primary)', borderRadius: 2,
        }} />
        <div style={{
          position: 'absolute', top: 100, left: '50%',
          transform: 'translateX(-50%) rotate(90deg)',
          transformOrigin: 'left top',
          fontFamily: C4.mono, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--accent-primary-press)', fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>
          {ACTIVE.toUpperCase()} · {ACT_SUB.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PV5 · Sea-lion peek — sea lion always visible top-left, hover expands
// ──────────────────────────────────────────────────────────
function ChromePV5() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 320, position: 'relative' }}>
      {/* Hairline at top */}
      <div style={{ height: 1, background: 'rgba(26,24,21,0.08)' }} />

      {/* Sea lion peek top-left + revealed pill */}
      <div style={{
        position: 'absolute', top: 14, left: 24,
        display: 'flex', alignItems: 'center', gap: 0,
      }}>
        {/* Sea lion always visible */}
        <span style={{
          width: 36, height: 36,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '50%',
          boxShadow: '0 6px 16px -10px rgba(26,24,21,0.12)',
          zIndex: 2,
        }}>
          <SeaLion size={20} />
        </span>
        {/* Pill fans out from sea lion · shown in hover state */}
        <span style={{
          marginLeft: -18, paddingLeft: 24,
          display: 'inline-flex', alignItems: 'center', gap: 2,
          padding: '4px 6px 4px 24px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '0 999px 999px 0',
          borderLeft: 'none',
          boxShadow: '0 6px 16px -10px rgba(26,24,21,0.10)',
        }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                width: 28, height: 28,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6,
                background: a ? 'var(--accent-soft)' : 'transparent',
              }}>
                <WSGlyph name={w} active={a} />
              </span>
            );
          })}
        </span>
      </div>

      <div style={{ paddingTop: 80 }}><Sliver minH={140} /></div>

      <div style={{ position: 'absolute', top: 22, right: 24, fontFamily: C4.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
        SEA LION ALWAYS VISIBLE · HOVER ON IT OR TOP EDGE · NAV FANS OUT
      </div>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────
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
          <span style={{ fontFamily: C4.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: C4.serif, fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>{title}</h3>
          <span style={{ fontFamily: C4.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: C4.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            ref · {refs}
          </span>
        </div>
      </div>
      <div style={{ background: 'var(--bg-base)' }}>{children}</div>
      <div style={{ padding: '12px 24px 14px', borderTop: '1px solid var(--border-default)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: C4.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-success)', marginBottom: 4 }}>WHAT</div>
          <div style={{ fontFamily: C4.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{what}</div>
        </div>
        <div>
          <div style={{ fontFamily: C4.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-warning)', marginBottom: 4 }}>TRADEOFF</div>
          <div style={{ fontFamily: C4.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{tradeoff}</div>
        </div>
      </div>
    </article>
  );
}

function SectionHead({ kicker, title, deck }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 18 }}>
      <div style={{ fontFamily: C4.mono, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 6 }}>{kicker}</div>
      <h2 style={{ margin: '0 0 6px', fontFamily: C4.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1 }}>{title}</h2>
      <p style={{ margin: 0, fontFamily: C4.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', maxWidth: 880, lineHeight: 1.55 }}>{deck}</p>
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
          <span style={{ fontFamily: C4.mono, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            CHROME IDEATION · v4 · CHAT-BOTTOM + PHANTOM-TOP
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontFamily: C4.serif, fontWeight: 500, fontSize: 40, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Ten variants in two directions, <span style={{ fontStyle: 'italic' }}>chat-aware bottom + hover-revealed top.</span>
        </h1>
        <p style={{ margin: '0 0 12px', fontFamily: C4.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>
          Five ways to make the bottom pill chat-aware (CV1–CV5) — workspace + chat composer share the same floating element, morphing based on whether you're on Home or another page. Five ways to perfect the phantom-top reveal (PV1–PV5) — each solves "how do I know where I am at rest?" differently.
        </p>
        <p style={{ margin: 0, fontFamily: C4.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          v1 (chrome.html) · v2 (chrome-v2.html) · v3 (chrome-v3.html) · <span style={{ color: 'var(--accent-primary)' }}>v4 chat + phantom · this page</span>
        </p>
      </div>
    </div>
  );
}

function HF_ChromeIdeationV4() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <PageHeader />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 32px 96px' }}>

        {/* CHAT-BOTTOM */}
        <SectionHead
          kicker="DIRECTION CV · CHAT-BOTTOM DOCK · 5 VARIANTS"
          title="Bottom pill that's chat-aware. Morphs between chat and nav modes."
          deck="The user said: 'the bottom pill is like a floating chat entrance thing also so I can hit the chat button and the other ones minimize.' These five variants explore how the workspace nav and the chat composer share one floating element — and how the dominance shifts between Home (chat-led) and other pages (nav-led)."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="CV1" title="Hybrid pill" sub="workspace icons LEFT, chat input RIGHT, one container" refs="iMessage compose · Beehiiv editor"
              what="Single bottom pill split into two zones. Left: sea lion + 7 compressed workspace icons. Right: chat composer with placeholder + clay send button. Active workspace clay-tinted. Both affordances always visible."
              tradeoff="Pill is wide (~720px min). On smaller viewports the chat input compresses to almost nothing. Doesn't morph between modes — same shape always.">
            <ChromeCV1 />
          </VC>
          <VC id="CV2" title="Two-state morph" sub="chat-mode (Home) + nav-mode (other pages)" refs="Slack home prompt · Notion comment composer"
              what="Same pill, two states shown side-by-side. State A (top): on Home, chat is dominant — wide composer, workspace icons compressed and faded. State B (bottom): on Insights, nav dominant — full workspace icons + chat collapsed to a small 'Chat' button you can click to expand. The pill is always one element, the proportions just flip."
              tradeoff="Animation between states needs to be elegant or the morph feels janky. Two visual systems for the same element adds learning cost.">
            <ChromeCV2 />
          </VC>
          <VC id="CV3" title="Stacked dock cluster" sub="big chat composer + tiny workspace dot-rail above" refs="Cron composer · Origin"
              what="Chat composer is the primary affordance — large, prominent, 720px wide. Above it sits a tiny dot-rail showing all 7 workspaces as colored dots with the active workspace label spelled out. Click a dot to switch. The chat is always center stage."
              tradeoff="Two stacked elements at the bottom = ~110px of chrome. Dot-rail is cute but doesn't show what each workspace IS until you hover (just colored dots).">
            <ChromeCV3 />
          </VC>
          <VC id="CV4" title="Chat FAB + workspace dock" sub="chat is a separate floating action button" refs="Material FAB · Linear inbox button"
              what="Workspace dock at the bottom-center handles navigation. Chat is a SEPARATE 56px clay floating action button at the bottom-right corner with a small italic-serif hint ('Ask Coopr anything'). Click → chat panel expands. Cleanest separation: nav is nav, chat is chat."
              tradeoff="Two floating elements at bottom — bottom-right FAB plus bottom-center dock. Could feel cluttered on smaller viewports. The clay FAB is loud — pulls attention away from content.">
            <ChromeCV4 />
          </VC>
          <VC id="CV5" title="Chat IS the dock" sub="workspace tabs as a hover-revealed tray ABOVE the chat" refs="ChatGPT app · Substack reader"
              what="The chat composer IS the chrome. Default state: just the chat bar, with a tiny '↑ hover for nav' affordance. Hovering the chat surface reveals a thin workspace icon tray ABOVE the chat. Most chat-first variant — assumes chat is the primary mode and nav is the secondary action."
              tradeoff="Discoverability — users might not realize there's nav until they hover. The hint affordance is critical and needs to NOT feel like a gimmick. Best for power users who chat-first.">
            <ChromeCV5 />
          </VC>
        </div>

        {/* PHANTOM-TOP */}
        <SectionHead
          kicker="DIRECTION PV · PHANTOM-TOP REVEAL · 5 VARIANTS"
          title="Chrome only on hover. Each solves the 'where am I' problem differently."
          deck="The user said: 'i also like the phantom top hover reveal — give me more.' These five variants ALL hide the chrome at rest. The variation is in the resting indicator — the cue that tells you where you are without the chrome being visible."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="PV1" title="Progressive reveal" sub="3 layers based on cursor distance" refs="Apple TouchBar · macOS Dock"
              what="Three layers of reveal based on cursor distance from the top edge. At rest: hairline. Cursor in top 60–100px: sea lion + breadcrumb fades in (you know where you are). Cursor in top 0–60px: full pill expands. Each tier earns its reveal."
              tradeoff="Tightest motion design dependency — needs smooth fades and good distance-detection. Three states means three things to design correctly.">
            <ChromePV1 />
          </VC>
          <VC id="PV2" title="Persistent corner indicator" sub="bottom-right badge + hover-top reveal" refs="Notion app sidebar collapsed"
              what="At rest: hairline at top + persistent small badge at bottom-right showing sea lion + 'Insights / Overview' + a '↑ hover for nav' hint. You always know where you are without the chrome being visible. Hover the top → full nav reveals."
              tradeoff="Two things to look at — top hairline AND bottom-right badge. The badge takes up corner real estate that's also competing for FAB / chat / etc.">
            <ChromePV2 />
          </VC>
          <VC id="PV3" title="Breadcrumb wisp" sub="almost-invisible serif text always at top" refs="Substack reader · long-form mags"
              what="At rest: a faint italic-serif 'Coopr · Insights · Overview' wisp text floats centered at the top, at 55% opacity. Hairline below. Most editorial of the phantoms — feels like the running header on a magazine page. Hover the top zone → full nav reveals."
              tradeoff="Wisp text might be hard to read on certain backgrounds (especially the cream/cool warmth variants). Serif italic at low opacity is delicate — needs the right font weight + size pairing.">
            <ChromePV3 />
          </VC>
          <VC id="PV4" title="Side-rail clay indicator" sub="2px clay strip on right edge + rotated label" refs="Origin productivity · Bear notes"
              what="At rest: a 28px-wide right-edge column with a 3px clay vertical strip + the active section name rotated 90° below it. Permanent 'you are here' indicator that never gets in the way. Top-edge hover reveals the full nav."
              tradeoff="The right-edge column eats horizontal space (~28px). Rotated text is harder to read at a glance. Most minimal but also most unconventional.">
            <ChromePV4 />
          </VC>
          <VC id="PV5" title="Sea-lion peek" sub="sea lion always visible top-left · hover expands nav" refs="Apple Watch crown · Linear logo"
              what="The sea lion sits in a permanent 36px circle in the top-left corner. Click on it OR hover near the top-left → the workspace pill fans out RIGHT from the sea lion (shown in hover state on the mockup). The sea lion is the persistent identity anchor; everything else reveals on demand."
              tradeoff="Top-left sea lion is now load-bearing — if it ever fails to render, the user has zero nav affordance. The 'fan out' animation needs to be elegant.">
            <ChromePV5 />
          </VC>
        </div>

        {/* Closing recommendation */}
        <article style={{
          marginTop: 28, padding: '24px 28px 26px', borderRadius: 14,
          background: 'var(--accent-soft)', border: '1px solid var(--accent-primary)',
        }}>
          <div style={{ fontFamily: C4.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 8 }}>
            Synthesis · the strongest combo
          </div>
          <h2 style={{ margin: '0 0 12px', fontFamily: C4.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            CV2 + PV3 · two-state chat dock at the bottom + breadcrumb-wisp at the top.
          </h2>
          <p style={{ margin: '0 0 12px', fontFamily: C4.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>CV2 Two-state morph</strong> is the most-COOPR direction for the bottom — Home is genuinely chat-first in this prototype, so the chat-dominant state is the right default. On other pages (Insights, Studio, Library), the workspace nav takes over and chat collapses to a small button. One pill, two proportions — feels intentional and chat-aware.
          </p>
          <p style={{ margin: '0 0 12px', fontFamily: C4.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>PV3 Breadcrumb wisp</strong> is the right phantom because the serif-italic wisp at the top is editorial — matches the Literata + Inter Tight type system you locked. It's the only phantom variant that doesn't feel like a software gesture (PV4's rotated label, PV5's sea-lion fan-out). The wisp reads as a magazine running-header.
          </p>
          <p style={{ margin: 0, fontFamily: C4.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            Combined: CV2 bottom + PV3 top means the page is bracketed by editorial whisper-states. Top wisp tells you where you are. Bottom morphs between chat and nav based on context. Maximum minimalism, full editorial character, distinct chat personality on Home. Worth committing to and integrating.
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV4 });
