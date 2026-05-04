/* global React, window */
/* hifi-chrome-v2.jsx — chrome ideation deep-dive.

   18 variants across 3 directions you said you liked:
     CH-B Editorial Masthead — 6 variants (B1-B6)
     CH-D Floating Pill Nav  — 6 variants (D1-D6) · each handles subtabs differently
     CH-E Newspaper Nameplate — 6 variants (E1-E6) · perfecting the broadsheet feel

   References across the field:
     Atlantic · Highline · Stratechery · NYRB · The Paris Review (B-direction)
     Linear · Vercel · Cron · Raycast · Arc · Apple's iOS bar (D-direction)
     NYT pre-1990 · The Economist · Le Monde · The Guardian · Atlantic 1900 (E-direction)
*/

const CV2 = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WS = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];
const ACTIVE = 'Insights';
const SUBS = ['Overview', 'Retention', 'Format DNA', 'Audience', 'Posting'];
const ACT_SUB = 'Overview';

// ─── Reusable bits ────────────────────────────────────────
function Sliver() {
  return (
    <div style={{ padding: '28px 32px 0', background: 'var(--bg-base)', minHeight: 90 }}>
      <div style={{ fontFamily: CV2.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
        Insights · Overview · Wed Apr 28
      </div>
      <h2 style={{ margin: '6px 0 0', fontFamily: CV2.serif, fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: 'var(--accent-primary)' }}>+22% saves</span>, +12% views. <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>One channel is going backwards.</span>
      </h2>
    </div>
  );
}
function Avatar({ size = 26 }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} />;
}
function CmdK({ tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 26,
      padding: '0 10px',
      background: dark ? 'transparent' : 'var(--surface-2)',
      borderRadius: 6,
      border: dark ? '1px solid rgba(253,252,249,0.18)' : '1px solid var(--border-subtle)',
    }}>
      <span style={{ width: 11, height: 11, borderRadius: '50%', border: `1.3px solid ${dark ? 'rgba(253,252,249,0.6)' : 'var(--fg-tertiary)'}` }} />
      <span style={{ fontFamily: CV2.mono, fontSize: 10, color: dark ? 'rgba(253,252,249,0.78)' : 'var(--fg-secondary)' }}>⌘K</span>
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// EDITORIAL MASTHEAD — 6 variants
// ──────────────────────────────────────────────────────────

// B1 · Wordmark left + mono nav center + dateline strip (the original CH-B)
function MastheadB1() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '14px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV2.mono, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          <span>VOL. 2 · NO. 142</span>
          <span style={{ flex: 1 }} />
          <span>WED · APR 28 · 2026</span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--tone-success)' }} />
            LIVE · 14M
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 32, padding: '14px 0 16px' }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
          <span style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 26, paddingBottom: 6 }}>
            {WS.map(w => {
              const a = w === ACTIVE;
              return (
                <span key={w} style={{
                  fontFamily: a ? CV2.serif : CV2.mono, fontStyle: a ? 'italic' : 'normal',
                  fontSize: a ? 16 : 11, fontWeight: a ? 500 : 600,
                  letterSpacing: a ? '-0.005em' : '0.16em', textTransform: a ? 'none' : 'uppercase',
                  color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                  borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                  paddingBottom: a ? 1 : 0,
                }}>{w}</span>
              );
            })}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <CmdK /><Avatar size={28} />
          </span>
        </div>
        <div style={{ borderBottom: '2px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// B2 · Centered masthead — wordmark CENTERED at top, nav below
function MastheadB2() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '14px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV2.mono, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, paddingBottom: 6 }}>
          <span>WED · APR 28 · 2026</span>
          <span style={{ flex: 1 }} />
          <span>VOL. 2 · NO. 142 · LIVE 14M</span>
        </div>
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)', marginTop: 10 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '12px 0' }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: a ? CV2.serif : CV2.mono, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 16 : 11, fontWeight: a ? 500 : 600,
                letterSpacing: a ? '-0.005em' : '0.16em', textTransform: a ? 'none' : 'uppercase',
                color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 2 : 0,
              }}>{w}</span>
            );
          })}
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// B3 · Stacked equal-weight — two rows balanced
function MastheadB3() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '12px 32px', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
          <span style={{ flex: 1 }} />
          <CmdK /><Avatar size={26} />
        </div>
      </div>
      <div style={{ padding: '10px 32px', background: 'var(--surface-1)', borderBottom: '2px solid var(--fg-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: a ? CV2.serif : CV2.mono, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 15 : 11, fontWeight: a ? 500 : 600,
                letterSpacing: a ? '-0.005em' : '0.16em', textTransform: a ? 'none' : 'uppercase',
                color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 1 : 0,
              }}>{w}</span>
            );
          })}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: CV2.mono, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            WED · APR 28 · LIVE 14M
          </span>
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// B4 · Compressed single-row — most efficient editorial chrome
function MastheadB4() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '0 32px', background: 'var(--surface-1)', borderBottom: '2px solid var(--fg-primary)', height: 64, display: 'flex', alignItems: 'center', gap: 28 }}>
        <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
        <span style={{ width: 1, height: 22, background: 'var(--border-default)' }} />
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 22, flex: 1 }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: a ? CV2.serif : CV2.mono, fontStyle: a ? 'italic' : 'normal',
                fontSize: a ? 15 : 11, fontWeight: a ? 500 : 600,
                letterSpacing: a ? '-0.005em' : '0.16em', textTransform: a ? 'none' : 'uppercase',
                color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 1 : 0,
              }}>{w}</span>
            );
          })}
        </span>
        <CmdK /><Avatar size={26} />
      </div>
      <Sliver />
    </div>
  );
}

// B5 · Section sub-wordmark — "Coopr · *Insights*" with active section in masthead
function MastheadB5() {
  const others = WS.filter(w => w !== ACTIVE);
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '14px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV2.mono, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          <span>VOL. 2 · NO. 142</span>
          <span style={{ flex: 1 }} />
          <span>WED · APR 28 · LIVE 14M</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '12px 0' }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
            <span style={{ fontFamily: CV2.mono, fontSize: 14, color: 'var(--fg-tertiary)', fontWeight: 400 }}>·</span>
            <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--accent-primary)', lineHeight: 1 }}>{ACTIVE}</span>
          </span>
          <span style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 18, paddingLeft: 24, borderLeft: '1px solid var(--border-default)' }}>
            <span style={{ fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>SWITCH TO</span>
            {others.map(w => (
              <span key={w} style={{
                fontFamily: CV2.mono, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--fg-secondary)',
              }}>{w}</span>
            ))}
          </span>
          <CmdK /><Avatar size={28} />
        </div>
        <div style={{ borderBottom: '2px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// B6 · Italic everywhere — serif italic nav, no mono
function MastheadB6() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '14px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 11, color: 'var(--fg-tertiary)', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          <span>vol. 2 · no. 142</span>
          <span style={{ flex: 1 }} />
          <span>Wed · April 28 · 2026 · live · 14m</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 32, padding: '14px 0 16px' }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
          <span style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 22 }}>
            {WS.map(w => {
              const a = w === ACTIVE;
              return (
                <span key={w} style={{
                  fontFamily: CV2.serif, fontStyle: 'italic',
                  fontSize: a ? 18 : 14, fontWeight: a ? 600 : 400,
                  letterSpacing: '-0.005em',
                  color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                  borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                  paddingBottom: a ? 1 : 0,
                }}>{w}</span>
              );
            })}
          </span>
          <CmdK /><Avatar size={28} />
        </div>
        <div style={{ borderBottom: '2px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// FLOATING PILL — 6 variants · each handles subtabs differently
// ──────────────────────────────────────────────────────────

// D1 · Classic dark pill (original CH-D, with subtabs in page header below)
function PillD1() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'var(--surface-ink)', borderRadius: 999,
          padding: '6px 6px 6px 16px',
          display: 'inline-flex', alignItems: 'center', gap: 18,
          boxShadow: '0 14px 36px -16px rgba(26,24,21,0.28)',
        }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-on-ink)' }}>Coopr</span>
          <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: CV2.sans, fontSize: 12.5, fontWeight: a ? 600 : 500,
                padding: a ? '5px 12px' : '5px 0', borderRadius: 999,
                background: a ? 'var(--accent-soft)' : 'transparent',
                color: a ? 'var(--accent-primary-press)' : 'rgba(253,252,249,0.78)',
              }}>{w}</span>
            );
          })}
          <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
          <CmdK tone="dark" /><Avatar size={28} />
        </div>
      </div>
      <div style={{ padding: '20px 32px 0', display: 'flex', alignItems: 'baseline', gap: 22 }}>
        <span style={{ fontFamily: CV2.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>Insights ·</span>
        {SUBS.map(s => {
          const a = s === ACT_SUB;
          return (
            <span key={s} style={{
              fontFamily: CV2.sans, fontSize: 12, fontWeight: a ? 600 : 500,
              color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
              borderBottom: a ? '2px solid var(--accent-primary)' : '2px solid transparent',
              paddingBottom: 2,
            }}>{s}</span>
          );
        })}
      </div>
      <Sliver />
    </div>
  );
}

// D2 · Dual pills · primary workspace + secondary subtab pill below
function PillD2() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0' }}>
      {/* Primary pill — workspace */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'var(--surface-ink)', borderRadius: 999, padding: '6px 6px 6px 16px',
          display: 'inline-flex', alignItems: 'center', gap: 18,
          boxShadow: '0 14px 36px -16px rgba(26,24,21,0.28)',
        }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-on-ink)' }}>Coopr</span>
          <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: CV2.sans, fontSize: 12.5, fontWeight: a ? 600 : 500,
                padding: a ? '5px 12px' : '5px 0', borderRadius: 999,
                background: a ? 'var(--accent-soft)' : 'transparent',
                color: a ? 'var(--accent-primary-press)' : 'rgba(253,252,249,0.78)',
              }}>{w}</span>
            );
          })}
          <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
          <CmdK tone="dark" /><Avatar size={28} />
        </div>
      </div>
      {/* Secondary pill — subtabs · paper-tone, smaller */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 32px 0' }}>
        <div style={{
          background: 'var(--surface-1)', borderRadius: 999, padding: '5px 14px',
          display: 'inline-flex', alignItems: 'center', gap: 18,
          border: '1px solid var(--border-default)',
          boxShadow: '0 6px 16px -8px rgba(26,24,21,0.10)',
        }}>
          {SUBS.map(s => {
            const a = s === ACT_SUB;
            return (
              <span key={s} style={{
                fontFamily: CV2.sans, fontSize: 12, fontWeight: a ? 600 : 500,
                padding: a ? '3px 10px' : '3px 0', borderRadius: 999,
                background: a ? 'var(--accent-soft)' : 'transparent',
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
              }}>{s}</span>
            );
          })}
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// D3 · Expanded pill — subtabs reveal nested INSIDE the pill on active workspace
function PillD3() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'var(--surface-ink)', borderRadius: 28, padding: '6px',
          display: 'flex', flexDirection: 'column', gap: 6,
          boxShadow: '0 14px 36px -16px rgba(26,24,21,0.28)',
        }}>
          {/* Row 1 — workspace */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '0 10px' }}>
            <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-on-ink)' }}>Coopr</span>
            <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
            {WS.map(w => {
              const a = w === ACTIVE;
              return (
                <span key={w} style={{
                  fontFamily: CV2.sans, fontSize: 12.5, fontWeight: a ? 600 : 500,
                  padding: a ? '5px 12px' : '5px 0', borderRadius: 999,
                  background: a ? 'var(--accent-soft)' : 'transparent',
                  color: a ? 'var(--accent-primary-press)' : 'rgba(253,252,249,0.78)',
                }}>{w}</span>
              );
            })}
            <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
            <CmdK tone="dark" /><Avatar size={26} />
          </div>
          {/* Row 2 — subtabs nested under active workspace */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '4px 14px 4px 18px', background: 'rgba(253,252,249,0.06)', borderRadius: 22 }}>
            <span style={{ fontFamily: CV2.mono, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(253,252,249,0.5)', fontWeight: 700 }}>{ACTIVE} ·</span>
            {SUBS.map(s => {
              const a = s === ACT_SUB;
              return (
                <span key={s} style={{
                  fontFamily: CV2.sans, fontSize: 11.5, fontWeight: a ? 600 : 500,
                  color: a ? 'var(--fg-on-ink)' : 'rgba(253,252,249,0.62)',
                  borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none',
                  paddingBottom: a ? 1 : 0,
                }}>{s}</span>
              );
            })}
          </div>
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// D4 · Pill with attached subtab tail · single visual unit, two zones
function PillD4() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'var(--surface-ink)', borderRadius: 14,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 14px 36px -16px rgba(26,24,21,0.28)',
          overflow: 'hidden',
        }}>
          {/* Top zone — workspace */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '8px 14px' }}>
            <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-on-ink)' }}>Coopr</span>
            <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
            {WS.map(w => {
              const a = w === ACTIVE;
              return (
                <span key={w} style={{
                  fontFamily: CV2.sans, fontSize: 12.5, fontWeight: a ? 600 : 500,
                  padding: a ? '4px 12px' : '4px 0', borderRadius: 999,
                  background: a ? 'var(--accent-soft)' : 'transparent',
                  color: a ? 'var(--accent-primary-press)' : 'rgba(253,252,249,0.78)',
                }}>{w}</span>
              );
            })}
            <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
            <CmdK tone="dark" /><Avatar size={26} />
          </div>
          {/* Tail zone — subtabs · slightly lighter */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '6px 18px 8px', background: 'rgba(253,252,249,0.07)' }}>
            {SUBS.map(s => {
              const a = s === ACT_SUB;
              return (
                <span key={s} style={{
                  fontFamily: CV2.sans, fontSize: 11.5, fontWeight: a ? 600 : 500,
                  color: a ? 'var(--fg-on-ink)' : 'rgba(253,252,249,0.62)',
                  borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none',
                  paddingBottom: a ? 1 : 0,
                }}>{s}</span>
              );
            })}
          </div>
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// D5 · Pill + breadcrumb-suffix · subtab is the right end of the pill (Coopr / Insights / Overview)
function PillD5() {
  const others = WS.filter(w => w !== ACTIVE);
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'var(--surface-ink)', borderRadius: 999, padding: '7px 14px',
          display: 'inline-flex', alignItems: 'center', gap: 14,
          boxShadow: '0 14px 36px -16px rgba(26,24,21,0.28)',
        }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-on-ink)' }}>Coopr</span>
          <span style={{ fontFamily: CV2.mono, fontSize: 11, color: 'rgba(253,252,249,0.42)' }}>/</span>
          <span style={{ fontFamily: CV2.sans, fontSize: 12.5, fontWeight: 500, color: 'rgba(253,252,249,0.78)' }}>{ACTIVE}</span>
          <span style={{ fontFamily: CV2.mono, fontSize: 11, color: 'rgba(253,252,249,0.42)' }}>/</span>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 14, fontWeight: 500, color: 'var(--fg-on-ink)' }}>{ACT_SUB}</span>
          <span style={{ fontFamily: CV2.mono, fontSize: 11, color: 'rgba(253,252,249,0.42)' }}>·</span>
          <span style={{ fontFamily: CV2.mono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(253,252,249,0.5)', fontWeight: 600 }}>{others.length} more</span>
          <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
          <CmdK tone="dark" /><Avatar size={26} />
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// D6 · Translucent two-row pill · whole nav fits in one frosted-glass pill
function PillD6() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'rgba(26,24,21,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 18, padding: '8px 10px',
          display: 'flex', flexDirection: 'column', gap: 2,
          boxShadow: '0 14px 36px -16px rgba(26,24,21,0.32), inset 0 1px 0 rgba(253,252,249,0.08)',
          border: '1px solid rgba(253,252,249,0.06)',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '0 8px' }}>
            <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-on-ink)' }}>Coopr</span>
            <span style={{ width: 1, height: 16, background: 'rgba(253,252,249,0.16)' }} />
            {WS.map(w => {
              const a = w === ACTIVE;
              return (
                <span key={w} style={{
                  fontFamily: CV2.sans, fontSize: 12.5, fontWeight: a ? 600 : 500,
                  padding: a ? '4px 12px' : '4px 0', borderRadius: 999,
                  background: a ? 'var(--accent-soft)' : 'transparent',
                  color: a ? 'var(--accent-primary-press)' : 'rgba(253,252,249,0.8)',
                }}>{w}</span>
              );
            })}
            <span style={{ width: 1, height: 16, background: 'rgba(253,252,249,0.16)' }} />
            <CmdK tone="dark" /><Avatar size={24} />
          </div>
          <div style={{ height: 1, background: 'rgba(253,252,249,0.08)', margin: '4px 0' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 14px 2px' }}>
            {SUBS.map(s => {
              const a = s === ACT_SUB;
              return (
                <span key={s} style={{
                  fontFamily: CV2.sans, fontSize: 11.5, fontWeight: a ? 600 : 500,
                  color: a ? 'var(--fg-on-ink)' : 'rgba(253,252,249,0.6)',
                  borderBottom: a ? '1.5px solid var(--accent-primary)' : 'none',
                  paddingBottom: a ? 1 : 0,
                }}>{s}</span>
              );
            })}
          </div>
        </div>
      </div>
      <Sliver />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// NEWSPAPER NAMEPLATE — 6 variants
// ──────────────────────────────────────────────────────────

// E1 · Classic broadsheet — oversize centered + dateline ears + small-caps nav
function NewspaperE1() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '20px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          <span>VOL. 2 · NO. 142</span>
          <span style={{ flex: 1 }} />
          <span>WED · APR 28 · 2026</span>
          <span style={{ flex: 1 }} />
          <span>FAIR · 68° · WAYANAD</span>
        </div>
        <div style={{ textAlign: 'center', padding: '4px 0 6px' }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 64, fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
        </div>
        <div style={{ borderTop: '1px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', height: 4, margin: '4px 0 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, padding: '12px 0 14px' }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: CV2.mono, fontSize: 11,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                fontWeight: a ? 700 : 500,
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 2 : 4,
              }}>{w}</span>
            );
          })}
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// E2 · Asymmetric broadsheet — wordmark left + dateline right + nav below, all left-aligned
function NewspaperE2() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '20px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, paddingBottom: 4 }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 56, fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--fg-primary)', lineHeight: 0.9 }}>Coopr</span>
          <span style={{ flex: 1 }} />
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, paddingBottom: 8 }}>
            <span style={{ fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>WED · APR 28 · 2026</span>
            <span style={{ fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>VOL. 2 · NO. 142 · LIVE 14M</span>
          </span>
        </div>
        <div style={{ borderTop: '1px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', height: 4, marginTop: 8 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0' }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: CV2.mono, fontSize: 11,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                fontWeight: a ? 700 : 500,
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 2 : 4,
              }}>{w}</span>
            );
          })}
          <span style={{ flex: 1 }} />
          <CmdK /><Avatar size={26} />
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// E3 · Compact broadsheet — smaller wordmark + thin single rule + inline nav
function NewspaperE3() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '12px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, paddingBottom: 8 }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 36, fontWeight: 500, letterSpacing: '-0.022em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
          <span style={{ fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>VOL. 2 · WED APR 28 · LIVE 14M</span>
          <span style={{ flex: 1 }} />
          <CmdK /><Avatar size={26} />
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '10px 0 12px' }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: CV2.mono, fontSize: 10.5,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: a ? 700 : 500,
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 1 : 3,
              }}>{w}</span>
            );
          })}
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// E4 · Vintage front page · NYT pre-1990 style with multi-rule sandwich
function NewspaperE4() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '16px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ borderBottom: '1px solid var(--fg-primary)', paddingBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>
            <span>"the creator's daily read"</span>
            <span style={{ flex: 1 }} />
            <span>est. 2024</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <span style={{ fontFamily: CV2.serif, fontSize: 56, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--fg-primary)', lineHeight: 1, textTransform: 'uppercase' }}>COOPR</span>
        </div>
        <div style={{ borderTop: '1px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', height: 4, margin: '6px 0 0' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '6px 0', fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          <span>VOL. 2 · NO. 142</span>
          <span style={{ flex: 1 }} />
          <span>WED · APR 28 · 2026</span>
          <span style={{ flex: 1 }} />
          <span>EARLY EDITION · LIVE 14M</span>
        </div>
        <div style={{ borderTop: '1px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', height: 4 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '10px 0' }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: CV2.mono, fontSize: 10.5,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: a ? 700 : 500,
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 1 : 3,
              }}>{w}</span>
            );
          })}
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// E5 · Magazine cover · massive wordmark + serif italic nav
function NewspaperE5() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '24px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          <span>VOL. 2 · ISSUE 142</span>
          <span style={{ flex: 1 }} />
          <span>APRIL 28 · 2026</span>
        </div>
        <div style={{ textAlign: 'center', padding: '8px 0 18px' }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 96, fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, paddingBottom: 18 }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: CV2.serif, fontStyle: 'italic',
                fontSize: a ? 22 : 16, fontWeight: a ? 600 : 400,
                letterSpacing: '-0.01em',
                color: a ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 1 : 0,
              }}>{w}</span>
            );
          })}
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// E6 · With strapline — wordmark + italic tagline below + nav
function NewspaperE6() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '18px 32px 0', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV2.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          <span>VOL. 2 · NO. 142</span>
          <span style={{ flex: 1 }} />
          <span>WED · APR 28 · LIVE 14M</span>
        </div>
        <div style={{ textAlign: 'center', padding: '6px 0 4px' }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 56, fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--fg-primary)', lineHeight: 1 }}>Coopr</span>
        </div>
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-tertiary)' }}>
            the creator's daily read · published since 2024
          </span>
        </div>
        <div style={{ borderTop: '1px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', height: 4, margin: '4px 0 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '12px 0' }}>
          {WS.map(w => {
            const a = w === ACTIVE;
            return (
              <span key={w} style={{
                fontFamily: CV2.mono, fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: a ? 700 : 500,
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                borderBottom: a ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: a ? 1 : 3,
              }}>{w}</span>
            );
          })}
        </div>
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
      </div>
      <Sliver />
    </div>
  );
}

// ─── Variant card — compact for high volume ───────────────
function VC({ id, title, sub, refs, what, tradeoff, children }) {
  return (
    <article style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-1)',
      boxShadow: '0 12px 32px -24px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08)',
    }}>
      <div style={{ padding: '14px 24px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: CV2.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: CV2.serif, fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>{title}</h3>
          <span style={{ fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>{sub}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: CV2.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            ref · {refs}
          </span>
        </div>
      </div>
      <div style={{ background: 'var(--bg-base)' }}>{children}</div>
      <div style={{ padding: '12px 24px 14px', borderTop: '1px solid var(--border-default)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontFamily: CV2.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-success)', marginBottom: 4 }}>WHAT</div>
          <div style={{ fontFamily: CV2.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{what}</div>
        </div>
        <div>
          <div style={{ fontFamily: CV2.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tone-warning)', marginBottom: 4 }}>TRADEOFF</div>
          <div style={{ fontFamily: CV2.sans, fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{tradeoff}</div>
        </div>
      </div>
    </article>
  );
}

// ─── Section heading ──────────────────────────────────────
function SectionHead({ kicker, title, deck }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 18 }}>
      <div style={{ fontFamily: CV2.mono, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 6 }}>
        {kicker}
      </div>
      <h2 style={{ margin: '0 0 6px', fontFamily: CV2.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.1 }}>
        {title}
      </h2>
      <p style={{ margin: 0, fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 15, color: 'var(--fg-secondary)', maxWidth: 880, lineHeight: 1.55 }}>
        {deck}
      </p>
    </div>
  );
}

function PageHeader() {
  return (
    <div style={{ padding: '40px 32px 28px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
      <div style={{ maxWidth: 1376, margin: '0 auto' }}>
        <div style={{ fontFamily: CV2.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 8 }}>
          COOPR · CHROME IDEATION · DEEP DIVE · v2
        </div>
        <h1 style={{ margin: '0 0 10px', fontFamily: CV2.serif, fontWeight: 500, fontSize: 44, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Eighteen variants across the three directions you liked, <span style={{ fontStyle: 'italic' }}>side by side.</span>
        </h1>
        <p style={{ margin: '0 0 8px', fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 920, lineHeight: 1.55 }}>
          Six Editorial Mastheads, six Floating Pills (each handles subtabs differently), six Newspaper Nameplates. Each rendered at 1440 width with the locked tokens (Literata + Inter Tight + clay) so you're comparing chrome design only.
        </p>
        <p style={{ margin: 0, fontFamily: CV2.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          Original 6 directions still live at <span style={{ color: 'var(--accent-primary)' }}>chrome.html</span> ·  this page is the deep dive.
        </p>
      </div>
    </div>
  );
}

function HF_ChromeIdeationV2() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <PageHeader />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 32px 96px' }}>

        {/* ═══ EDITORIAL MASTHEAD ═══ */}
        <SectionHead
          kicker="DIRECTION B · EDITORIAL MASTHEAD · 6 VARIANTS"
          title="Wordmark-led, italic-serif identity, magazine cadence."
          deck="Each variant arranges the masthead differently — left-aligned, centered, single-row, sub-wordmark for the active section, full-italic ladder. References: Atlantic, Highline, Stratechery, NYRB, Paris Review."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="B1" title="Wordmark-left + dateline strip" sub="the original CH-B" refs="Highline · Atavist"
              what="Italic-serif Coopr left, mono nav center, dateline strip on top. Active workspace gets serif-italic 16px treatment so the section you're reading is the most legible item in the chrome."
              tradeoff="Three rows of chrome (~108px). Subtabs need to leave the chrome and become page-header content. Mobile responsive story is non-trivial.">
            <MastheadB1 />
          </VC>
          <VC id="B2" title="Centered masthead" sub="wordmark center, nav below" refs="London Review of Books"
              what="Wordmark CENTERED at the top, dateline split to the corners, full nav row below the rule. Symmetric, balanced, calm — like a literary supplement front page."
              tradeoff="Eats more vertical space than B1. Centered nav is slightly harder to scan than left-aligned. No room for utilities (Cmd-K, avatar) without crowding.">
            <MastheadB2 />
          </VC>
          <VC id="B3" title="Stacked equal-weight" sub="two clear horizontal rows" refs="The New Republic"
              what="Top row: wordmark + utilities. Bottom row: nav + dateline strip. Each row has its own job. Reads as a structured front-of-book — minimal cognitive load."
              tradeoff="Two distinct rows means more visual weight than B4 single-row. Less editorial, more grid-like.">
            <MastheadB3 />
          </VC>
          <VC id="B4" title="Compressed single-row" sub="most efficient editorial chrome" refs="Stratechery · Substack pro"
              what="Wordmark + nav + utilities all on one 64px row. Heavy bottom rule signals 'masthead complete.' Most chrome-density-friendly direction. Subtabs and dateline move to the page header."
              tradeoff="Loses the dateline's editorial rhythm. Italic nav vs mono inactive can look unbalanced at this density. Pure efficiency play.">
            <MastheadB4 />
          </VC>
          <VC id="B5" title="Section sub-wordmark" sub="'Coopr · Insights' as the masthead" refs="The Paris Review · n+1"
              what="Active section becomes part of the masthead identity ('Coopr · Insights'). Other workspaces relegated to a 'switch to' rail right of the wordmark. Strongest sense of 'where you are.'"
              tradeoff="Switch-to nav is smaller / less prominent. Innovation cost: users have to learn that the wordmark+section IS the identity. Subtabs need separate solution.">
            <MastheadB5 />
          </VC>
          <VC id="B6" title="Italic everywhere" sub="serif italic ladder, no mono nav" refs="Penguin Classics · Granta"
              what="Wordmark italic + every nav item in serif italic. Active is bigger + bolder (18 vs 14). Dateline strip also italic. Maximum editorial italic ladder — feels uniformly literary."
              tradeoff="Risk of one-note: too much italic across the chrome can feel mannered. Mono captions would still appear in the page below — visual contrast with the chrome.">
            <MastheadB6 />
          </VC>
        </div>

        {/* ═══ FLOATING PILL ═══ */}
        <SectionHead
          kicker="DIRECTION D · FLOATING PILL · 6 VARIANTS"
          title="Dark pill on warm paper. Each variant solves the subtab problem differently."
          deck="The pill nav is striking but D1 left subtabs orphaned. These six variants explore: dual pills, expanded nested pill, attached subtab tail, breadcrumb-suffix pill, frosted-glass two-row pill. References: Linear, Vercel, Cron, Raycast, Arc."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="D1" title="Classic dark pill" sub="subtabs in page header" refs="the original CH-D"
              what="Single dark pill at top with workspace tabs. Subtabs detach completely and float in the page below as a separate header. Chrome is one focused element; subtabs read as part of the surface they belong to."
              tradeoff="Subtabs are visually orphaned from the rest of the nav. New users may not connect them to the workspace tabs above.">
            <PillD1 />
          </VC>
          <VC id="D2" title="Dual pills" sub="primary dark + secondary light" refs="Linear command bar"
              what="Two floating pills. Primary dark for workspaces, secondary lighter for subtabs centered below. Both are hierarchically clear and live in the same visual zone."
              tradeoff="Two competing floating elements add visual weight. Centered alignment of the subtab pill creates a 'chrome stack' that's still ~110px tall.">
            <PillD2 />
          </VC>
          <VC id="D3" title="Expanded pill — nested subtabs" sub="single pill, two integrated rows" refs="Vercel command bar expanded"
              what="One floating pill that grows downward to reveal subtabs in a slightly-translucent inner zone. All nav lives in one container — workspace + subtab as a coherent unit."
              tradeoff="Pill is taller (~88px). Subtabs visible at all times means the pill is always 'open' — could feel busier.">
            <PillD3 />
          </VC>
          <VC id="D4" title="Pill with attached tail" sub="rounded rectangle, two zones" refs="Notion floating menu"
              what="Single floating element rounded-rectangle (not pill). Top zone dark for workspaces, tail zone lighter for subtabs. One visual unit, two clear functional zones, with a visible color-step transition between them."
              tradeoff="Departs from the pure 'pill' shape — becomes more of a floating panel. Less playful, more committee.">
            <PillD4 />
          </VC>
          <VC id="D5" title="Breadcrumb-suffix pill" sub="Coopr / Insights / Overview" refs="Vercel project view · Stripe"
              what="Subtab IS the right end of the pill via breadcrumb pattern. Workspace + subtab read as one path. Minimal chrome. Other workspaces accessed via Cmd-K."
              tradeoff="Workspace switching no longer visible — relies on Cmd-K discovery. Breadcrumb shows ONE path, other workspaces summarized as '6 more'. Power-user tilt.">
            <PillD5 />
          </VC>
          <VC id="D6" title="Frosted-glass two-row pill" sub="translucent, internal subtabs" refs="iOS toolbar · Arc"
              what="Translucent (rgba 0.82 + backdrop-blur) pill with two rows inside: workspace nav on top, subtab strip below, separated by a hairline. Whole nav fits in one frosted container that lets warm paper bleed through."
              tradeoff="Backdrop-filter has perf cost on lower-end devices. Translucent dark on warm paper can look muddy if not perfectly tuned. Most ambitious technically.">
            <PillD6 />
          </VC>
        </div>

        {/* ═══ NEWSPAPER NAMEPLATE ═══ */}
        <SectionHead
          kicker="DIRECTION E · NEWSPAPER NAMEPLATE · 6 VARIANTS"
          title="Broadsheet identity. Front-page treatment for the workspace."
          deck="You said this 'feeds so cleanly into the intelligence stuff' — these variants perfect the broadsheet feel. References: NYT pre-1990, Le Monde, The Economist, The Atlantic, The Guardian, vintage American newspaper press."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VC id="E1" title="Classic broadsheet" sub="the original CH-E · centered + double-rule" refs="The Atlantic · NYRB"
              what="Massive 64px italic Coopr centered. Double-rule sandwich. Small-caps mono section nav centered. Dateline ears (vol/no left, weather right). The most theatrical, magazine-cover treatment."
              tradeoff="Tall (~140px) chrome eats vertical space. Centered nav harder to scan than left-aligned. Maximalist — fights for attention with data-dense surfaces.">
            <NewspaperE1 />
          </VC>
          <VC id="E2" title="Asymmetric broadsheet" sub="wordmark left, dateline right, nav below" refs="The Guardian · NYRB"
              what="Wordmark anchored left at 56px italic. Dateline stack on the right. Double-rule below. Nav row left-aligned + utilities right. Same broadsheet language but more functional and less symmetric."
              tradeoff="Loses the dramatic centered-wordmark moment. Reads more like a daily-use newspaper than a magazine.">
            <NewspaperE2 />
          </VC>
          <VC id="E3" title="Compact broadsheet" sub="smaller wordmark inline with dateline" refs="Le Monde · The Economist"
              what="36px wordmark on the same line as a dateline strip + utilities. Single thin rule. Mono nav row below + bottom rule. Most chrome-density-friendly broadsheet variant — preserves the editorial cadence at half the height."
              tradeoff="Loses the dramatic mass of the wordmark. Closer to standard editorial chrome than 'newspaper.'">
            <NewspaperE3 />
          </VC>
          <VC id="E4" title="Vintage front page" sub="pre-1990 NYT · gothic caps + multi-rule" refs="NYT pre-1990 · vintage broadsheets"
              what="Wordmark in serif CAPS (treats the wordmark like a sectional banner, not a logotype). Multi-rule sandwich (ATL strapline → wordmark → double-rule → dateline → double-rule → nav). Most vintage / 'broadsheet press' feel."
              tradeoff="Heavy three-rule structure adds visual weight. Caps wordmark is less elegant than italic — closer to American newspaper than European magazine.">
            <NewspaperE4 />
          </VC>
          <VC id="E5" title="Magazine cover" sub="96px wordmark + serif-italic nav" refs="The Atlantic cover · The New Yorker"
              what="MASSIVE 96px italic Coopr wordmark, dominant. Nav in serif-italic 16px (active 22px) — reads as section names not labels. Maximum magazine-cover treatment. Best for low-frequency-use surfaces (Intel, Insights)."
              tradeoff="Tallest chrome variant (~180px). Will overpower data-dense surfaces. Better suited as the cover for Intel specifically than as system chrome.">
            <NewspaperE5 />
          </VC>
          <VC id="E6" title="With strapline" sub="wordmark + tagline + nav" refs="Granta · The Believer · LRB"
              what="Wordmark + italic strapline ('the creator's daily read · published since 2024') + double-rule + small-caps nav. The strapline gives the masthead character + context. Old-magazine convention."
              tradeoff="Strapline copy needs to be earned — if it feels generic, drags down the whole chrome. Mostly a one-time decision.">
            <NewspaperE6 />
          </VC>
        </div>

        {/* Closing recommendation */}
        <article style={{
          marginTop: 36,
          padding: '26px 30px 28px',
          borderRadius: 14,
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent-primary)',
        }}>
          <div style={{ fontFamily: CV2.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 10 }}>
            Synthesis · what to commit to
          </div>
          <h2 style={{ margin: '0 0 12px', fontFamily: CV2.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            E2 + D6 is the strongest combo. E2 for permanent chrome, D6 as a Cmd-K-revealed alternate.
          </h2>
          <p style={{ margin: '0 0 12px', fontFamily: CV2.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>For the always-on shell:</strong> E2 Asymmetric Broadsheet. It keeps the editorial broadsheet identity you liked but is functional enough for daily use — wordmark anchored left, dateline ear right, mono section nav row below, utilities accessible. The double-rule + small-caps nav reads cleanly into Intel pages because Intel's broadsheet treatment uses the exact same language. E1 is more dramatic but too tall for daily Insights / Studio use; E5 is reserved as the Intel cover specifically.
          </p>
          <p style={{ margin: '0 0 12px', fontFamily: CV2.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            <strong>For the floating overlay (Cmd-K mode / fullscreen reading):</strong> D6 Frosted-glass two-row pill. The two-row design solves the subtab problem completely — workspace + subtabs in one floating container — and the frosted-glass treatment is technically ambitious without feeling gimmicky. Use this as a "chrome-off mode" the user can summon via Cmd-K-shift, or auto-reveal during long-form reading.
          </p>
          <p style={{ margin: 0, fontFamily: CV2.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            E5 deserves a callout — it's not for system chrome but is PERFECT as the Intel · Pulse cover. The 96px italic wordmark + serif-italic nav matches Intel's broadsheet body language exactly. Worth lifting into Intel's surface, not the shell.
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeationV2 });
