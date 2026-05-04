/* global React, window */
/* hifi-chrome-variants.jsx — chrome ideation gallery.

   Six design directions for the COOPR shell, rendered as static visual
   mockups for side-by-side comparison. Each variant proposes a different
   answer to the question: "what should the persistent navigation feel
   like for an editorial creator-focused tool?"

   This is IDEATION — not implementation. Pick a direction and integration
   becomes a separate fleet (modifying hifi-shell.jsx + every surface that
   renders a subtab strip).

   References (real-world):
     CH-B Editorial Masthead → NYT Magazine · Highline · Stratechery
     CH-C Slim Left Rail     → Notion · Linear · Perplexity Pro
     CH-D Floating Pill Nav  → Vercel · Cron · Linear command bar
     CH-E Newspaper          → The Atlantic · 1960s broadsheet press
     CH-F Breadcrumb-Only    → Stripe Dashboard · Vercel project view

   Hard rules: same as the rest of the prototype (no import/export, no
   emoji, inline SVG only, var(--*) tokens only).
*/

const CV = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const WORKSPACES = ['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'];
const ACTIVE_WORKSPACE = 'Insights';
const SUBTABS = ['Overview', 'Retention', 'Format DNA', 'Audience', 'Posting'];
const ACTIVE_SUBTAB = 'Overview';

// ─── Below-chrome content sliver — same in every variant for fair compare ──
function BelowChromeSliver() {
  return (
    <div style={{ padding: '32px 32px 0', background: 'var(--bg-base)', minHeight: 110 }}>
      <div style={{ fontFamily: CV.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
        Insights · Overview · Wed Apr 28
      </div>
      <h2 style={{ margin: '6px 0 0', fontFamily: CV.serif, fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: 'var(--accent-primary)' }}>+22% saves</span>, +12% views. <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>One channel is going backwards.</span>
      </h2>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CH-A · Current (baseline reference)
// ──────────────────────────────────────────────────────────
function ChromeA_Current() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      {/* Topbar */}
      <div style={{
        height: 56, padding: '0 24px', background: 'var(--surface-1)',
        display: 'flex', alignItems: 'center', gap: 18,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: CV.serif, fontStyle: 'italic', fontSize: 14, fontWeight: 500 }}>C</span>
          <span style={{ fontFamily: CV.sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>COOPR</span>
        </div>
        <span style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 18 }}>
          {WORKSPACES.map(w => {
            const active = w === ACTIVE_WORKSPACE;
            return (
              <span key={w} style={{
                fontFamily: CV.sans, fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                paddingBottom: 2,
              }}>{w}</span>
            );
          })}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', background: 'var(--surface-2)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1.4px solid var(--fg-tertiary)' }} />
          <span style={{ fontFamily: CV.mono, fontSize: 10.5, color: 'var(--fg-secondary)' }}>Search · ⌘K</span>
        </span>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)' }} />
      </div>
      {/* Subtab strip */}
      <div style={{ height: 38, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 22, borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-base)' }}>
        {SUBTABS.map(s => {
          const active = s === ACTIVE_SUBTAB;
          return (
            <span key={s} style={{
              fontFamily: CV.sans, fontSize: 12,
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
            }}>{s}</span>
          );
        })}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: CV.mono, fontSize: 10, color: 'var(--fg-tertiary)', padding: '3px 8px', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>last 30d</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: CV.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tone-success)' }} />
          live · 14m ago
        </span>
      </div>
      <BelowChromeSliver />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CH-B · Editorial Masthead
// Italic-serif "Coopr" wordmark like a magazine nameplate, mono-uppercase
// section nav, no subtab strip in chrome (subtabs move into page header).
// ──────────────────────────────────────────────────────────
function ChromeB_EditorialMasthead() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{
        padding: '14px 32px 0', background: 'var(--surface-1)',
      }}>
        {/* Tier 1: dateline + status — newspaper-style top strip */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV.mono, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          <span>VOL. 2 · NO. 142</span>
          <span style={{ flex: 1 }} />
          <span>WED · APR 28 · 2026</span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--tone-success)' }} />
            LIVE · 14M
          </span>
        </div>

        {/* Tier 2: italic-serif wordmark + section nav */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 32, padding: '14px 0 16px' }}>
          <span style={{ fontFamily: CV.serif, fontStyle: 'italic', fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1 }}>
            Coopr
          </span>
          <span style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 26, paddingBottom: 6 }}>
            {WORKSPACES.map(w => {
              const active = w === ACTIVE_WORKSPACE;
              return (
                <span key={w} style={{
                  fontFamily: active ? CV.serif : CV.mono,
                  fontStyle: active ? 'italic' : 'normal',
                  fontSize: active ? 16 : 11,
                  fontWeight: active ? 500 : 600,
                  letterSpacing: active ? '-0.005em' : '0.16em',
                  textTransform: active ? 'none' : 'uppercase',
                  color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                  borderBottom: active ? '2px solid var(--accent-primary)' : 'none',
                  paddingBottom: active ? 1 : 0,
                }}>{w}</span>
              );
            })}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: CV.mono, fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', border: '1.4px solid var(--fg-tertiary)' }} />
              ⌘K
            </span>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)' }} />
          </span>
        </div>

        {/* Bottom rule — newspaper nameplate divider */}
        <div style={{ height: 0, borderBottom: '2px solid var(--fg-primary)' }} />
      </div>
      <BelowChromeSliver />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CH-C · Slim Left Rail (Notion / Linear / Perplexity Pro)
// 220px sidebar, no topbar. Workspace nav as icon + label.
// ──────────────────────────────────────────────────────────
function ChromeC_LeftRail() {
  const items = [
    { name: 'Home',     glyph: '◌' },
    { name: 'Studio',   glyph: '✎' },
    { name: 'Library',  glyph: '▦' },
    { name: 'Insights', glyph: '◐' },
    { name: 'Intel',    glyph: '◇' },
    { name: 'Inbox',    glyph: '✉' },
    { name: 'Calendar', glyph: '▤' },
  ];
  return (
    <div style={{ display: 'flex', minHeight: 380, background: 'var(--bg-base)' }}>
      {/* Rail */}
      <aside style={{
        width: 220, background: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: CV.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500 }}>C</span>
          <span style={{ fontFamily: CV.serif, fontStyle: 'italic', fontSize: 18, fontWeight: 500, color: 'var(--fg-primary)' }}>Coopr</span>
          <span style={{ flex: 1 }} />
          <span style={{ width: 18, height: 14, display: 'inline-flex', flexDirection: 'column', justifyContent: 'space-around', cursor: 'pointer' }}>
            <span style={{ height: 1.4, background: 'var(--fg-tertiary)' }} />
            <span style={{ height: 1.4, background: 'var(--fg-tertiary)' }} />
          </span>
        </div>

        {/* Workspaces */}
        <div style={{ padding: '14px 8px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map(it => {
            const active = it.name === ACTIVE_WORKSPACE;
            return (
              <div key={it.name} style={{
                padding: '8px 12px',
                borderRadius: 6,
                background: active ? 'var(--accent-soft)' : 'transparent',
                borderLeft: active ? '3px solid var(--accent-primary)' : '3px solid transparent',
                marginLeft: active ? 0 : 3,
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
              }}>
                <span style={{ width: 16, fontFamily: CV.mono, fontSize: 12, color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', textAlign: 'center' }}>{it.glyph}</span>
                <span style={{ fontFamily: CV.sans, fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)' }}>{it.name}</span>
              </div>
            );
          })}
        </div>

        {/* Subtabs nested under active workspace */}
        <div style={{ padding: '4px 24px 8px 36px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SUBTABS.map(s => {
            const active = s === ACTIVE_SUBTAB;
            return (
              <span key={s} style={{
                fontFamily: CV.sans, fontSize: 12,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                padding: '3px 0',
              }}>{s}</span>
            );
          })}
        </div>

        <span style={{ flex: 1 }} />

        {/* Profile pinned bottom */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)' }} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontFamily: CV.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>Henry Cooper</span>
            <span style={{ fontFamily: CV.mono, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>@henry.dives</span>
          </span>
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Slim top utility bar */}
        <div style={{ height: 44, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <span style={{ fontFamily: CV.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>Insights · Overview</span>
          <span style={{ flex: 1 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', background: 'var(--surface-2)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', border: '1.3px solid var(--fg-tertiary)' }} />
            <span style={{ fontFamily: CV.mono, fontSize: 10, color: 'var(--fg-secondary)' }}>Search · ⌘K</span>
          </span>
        </div>
        <BelowChromeSliver />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CH-D · Floating Pill Nav (Linear / Vercel / Cron)
// Centered floating pill, dark surface-ink, no persistent topbar.
// ──────────────────────────────────────────────────────────
function ChromeD_FloatingPill() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '20px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{
          background: 'var(--surface-ink)',
          borderRadius: 999,
          padding: '6px 6px 6px 16px',
          display: 'inline-flex', alignItems: 'center', gap: 18,
          boxShadow: '0 14px 36px -16px rgba(26,24,21,0.28), 0 4px 12px -8px rgba(26,24,21,0.16)',
        }}>
          <span style={{ fontFamily: CV.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-on-ink)', letterSpacing: '-0.01em' }}>Coopr</span>
          <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
          {WORKSPACES.map(w => {
            const active = w === ACTIVE_WORKSPACE;
            return (
              <span key={w} style={{
                fontFamily: CV.sans, fontSize: 12.5,
                fontWeight: active ? 600 : 500,
                padding: active ? '5px 12px' : '5px 0',
                borderRadius: 999,
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent-primary-press)' : 'rgba(253,252,249,0.78)',
                lineHeight: 1.1,
              }}>{w}</span>
            );
          })}
          <span style={{ width: 1, height: 18, background: 'rgba(253,252,249,0.16)' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: CV.mono, fontSize: 10, color: 'rgba(253,252,249,0.62)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', border: '1.3px solid rgba(253,252,249,0.42)' }} />
            ⌘K
          </span>
          <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-primary)' }} />
        </div>
      </div>

      {/* Subtab strip floats below as a separate page-header element */}
      <div style={{ padding: '20px 32px 0', display: 'flex', alignItems: 'baseline', gap: 22 }}>
        <span style={{ fontFamily: CV.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>Insights ·</span>
        {SUBTABS.map(s => {
          const active = s === ACTIVE_SUBTAB;
          return (
            <span key={s} style={{
              fontFamily: CV.sans, fontSize: 12,
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
              borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
              paddingBottom: 2,
            }}>{s}</span>
          );
        })}
      </div>
      <BelowChromeSliver />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CH-E · Newspaper Nameplate
// Oversize centered wordmark, double-rule, small-caps section nav.
// Maximum magazine-cover treatment.
// ──────────────────────────────────────────────────────────
function ChromeE_Newspaper() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{ padding: '20px 32px 0', background: 'var(--surface-1)' }}>
        {/* Top dateline strip */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: CV.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          <span>VOL. 2 · NO. 142</span>
          <span style={{ flex: 1 }} />
          <span>WED · APR 28 · 2026</span>
          <span style={{ flex: 1 }} />
          <span>FAIR · 68° · WAYANAD</span>
        </div>

        {/* Massive italic-serif wordmark */}
        <div style={{ textAlign: 'center', padding: '4px 0 6px' }}>
          <span style={{ fontFamily: CV.serif, fontStyle: 'italic', fontSize: 64, fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--fg-primary)', lineHeight: 1 }}>
            Coopr
          </span>
        </div>

        {/* Double rule — classic newspaper nameplate divider */}
        <div style={{ borderTop: '1px solid var(--fg-primary)', borderBottom: '1px solid var(--fg-primary)', height: 4, margin: '4px 0 0' }} />

        {/* Small-caps section nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, padding: '12px 0 14px' }}>
          {WORKSPACES.map(w => {
            const active = w === ACTIVE_WORKSPACE;
            return (
              <span key={w} style={{
                fontFamily: CV.mono, fontSize: 11,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                borderBottom: active ? '2px solid var(--accent-primary)' : 'none',
                paddingBottom: active ? 2 : 4,
              }}>{w}</span>
            );
          })}
        </div>

        {/* Bottom rule */}
        <div style={{ borderBottom: '1px solid var(--fg-primary)' }} />
      </div>

      {/* Subtab strip lives in page header, italic-serif treatment */}
      <div style={{ padding: '14px 32px 0', display: 'flex', alignItems: 'baseline', gap: 24 }}>
        {SUBTABS.map(s => {
          const active = s === ACTIVE_SUBTAB;
          return (
            <span key={s} style={{
              fontFamily: CV.serif,
              fontStyle: active ? 'italic' : 'normal',
              fontSize: active ? 18 : 14,
              fontWeight: active ? 500 : 400,
              color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
              letterSpacing: '-0.005em',
            }}>{s}</span>
          );
        })}
        <span style={{ flex: 1 }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: CV.mono, fontSize: 10, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', border: '1.3px solid var(--fg-tertiary)' }} />
          SEARCH ⌘K
        </span>
      </div>
      <BelowChromeSliver />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CH-F · Breadcrumb-Only (Stripe Dashboard / Vercel project view)
// Slim 44px topbar, no workspace tabs visible, Cmd-K is the switcher.
// ──────────────────────────────────────────────────────────
function ChromeF_Breadcrumb() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      <div style={{
        height: 48, padding: '0 24px',
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: CV.serif, fontStyle: 'italic', fontSize: 13, fontWeight: 500 }}>C</span>
        <span style={{ fontFamily: CV.mono, fontSize: 12, color: 'var(--fg-tertiary)' }}>/</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: CV.sans, fontSize: 13, fontWeight: 500, color: 'var(--fg-secondary)', cursor: 'pointer' }}>Insights</span>
          <span style={{ fontFamily: CV.mono, fontSize: 12, color: 'var(--fg-tertiary)' }}>/</span>
          <span style={{ fontFamily: CV.serif, fontStyle: 'italic', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)' }}>Overview</span>
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', background: 'var(--surface-2)', borderRadius: 999, border: '1px solid var(--border-subtle)' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', border: '1.4px solid var(--fg-tertiary)' }} />
          <span style={{ fontFamily: CV.sans, fontSize: 12, color: 'var(--fg-secondary)' }}>Find anything</span>
          <span style={{ fontFamily: CV.mono, fontSize: 9.5, padding: '1px 5px', background: 'var(--surface-1)', borderRadius: 3, color: 'var(--fg-tertiary)', fontWeight: 600 }}>⌘K</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: CV.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--tone-success)' }} />
          live · 14m
        </span>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-primary)' }} />
      </div>
      <BelowChromeSliver />
    </div>
  );
}

// ─── Variant card wrapper ────────────────────────────────
function VariantCard({ id, title, vibe, inspiredBy, pros = [], cons = [], wouldNeed = [], children }) {
  return (
    <article style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-1)',
      boxShadow: '0 12px 32px -24px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08)',
    }}>
      {/* Card header */}
      <div style={{ padding: '20px 28px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: CV.mono, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>{id}</span>
          <h3 style={{ margin: 0, fontFamily: CV.serif, fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>
            {title}
          </h3>
          <span style={{ fontFamily: CV.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)' }}>{vibe}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: CV.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
            inspired by · {inspiredBy}
          </span>
        </div>
      </div>

      {/* Mockup */}
      <div style={{ background: 'var(--bg-base)' }}>
        {children}
      </div>

      {/* Notes */}
      <div style={{ padding: '20px 28px 22px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-1)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
        <NotesColumn label="WHAT WORKS" items={pros} tone="success" />
        <NotesColumn label="TRADEOFFS" items={cons} tone="warning" />
        <NotesColumn label="WOULD NEED" items={wouldNeed} tone="info" />
      </div>
    </article>
  );
}

function NotesColumn({ label, items, tone }) {
  const dotColor = tone === 'success' ? 'var(--tone-success)' : tone === 'warning' ? 'var(--tone-warning)' : 'var(--tone-info)';
  return (
    <div>
      <div style={{ fontFamily: CV.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 10 }}>
        {label}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((t, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, marginTop: 7, flexShrink: 0 }} />
            <span style={{ fontFamily: CV.sans, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.5 }}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page header ──────────────────────────────────────────
function PageHeader() {
  return (
    <div style={{ padding: '40px 32px 28px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
      <div style={{ maxWidth: 1376, margin: '0 auto' }}>
        <div style={{ fontFamily: CV.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 8 }}>
          COOPR · CHROME IDEATION · ROUND 8
        </div>
        <h1 style={{ margin: '0 0 8px', fontFamily: CV.serif, fontWeight: 500, fontSize: 44, color: 'var(--fg-primary)', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
          Six directions for the shell, <span style={{ fontStyle: 'italic' }}>side by side.</span>
        </h1>
        <p style={{ margin: '0 0 18px', fontFamily: CV.serif, fontStyle: 'italic', fontSize: 16, color: 'var(--fg-secondary)', maxWidth: 880, lineHeight: 1.55 }}>
          Each variant is a static mockup at full 1440 width, rendered with the current locked tokens (Literata + Inter Tight + clay) so you're comparing chrome design — not type or color. Pick one and integration becomes a separate fleet.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontFamily: CV.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          <span>1: current (baseline)</span>
          <span>·</span>
          <span>2: editorial masthead</span>
          <span>·</span>
          <span>3: slim left rail</span>
          <span>·</span>
          <span>4: floating pill nav</span>
          <span>·</span>
          <span>5: newspaper nameplate</span>
          <span>·</span>
          <span>6: breadcrumb only</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────
function HF_ChromeIdeation() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <PageHeader />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '36px 32px 96px', display: 'flex', flexDirection: 'column', gap: 36 }}>

        <VariantCard
          id="CH-A"
          title="Current"
          vibe="baseline reference · what we have today"
          inspiredBy="us"
          pros={[
            'Workspaces and subtabs both visible — no need for command palette to navigate.',
            'Familiar SaaS dashboard pattern — zero learning curve.',
            '7-tab horizontal centering is balanced at 1440 width.',
          ]}
          cons={[
            'Two-row chrome (94px) feels heavy and SaaS-y next to the editorial body.',
            'Workspace tabs in flat sans-serif lozenges have no editorial character — same as every Notion clone.',
            'Right-side Cmd-K + status pill + avatar feels crammed; no visual hierarchy.',
            'Active-state underline is faint; eye drifts away from current location.',
          ]}
          wouldNeed={[
            '(this is what we already ship)',
          ]}
        >
          <ChromeA_Current />
        </VariantCard>

        <VariantCard
          id="CH-B"
          title="Editorial Masthead"
          vibe="newspaper-meets-magazine nameplate · italic-serif wordmark"
          inspiredBy="NYT Magazine · Highline · Stratechery"
          pros={[
            'Italic-serif "Coopr" wordmark IS the masthead — instantly editorial, matches the rest of the page.',
            'Active workspace gets serif-italic 16px treatment — "this is the section you\'re reading" feel.',
            'Inactive workspaces in mono-uppercase 11px reads as a section index, not buttons.',
            'Top dateline strip ("VOL. 2 · WED APR 28 · LIVE 14M") sets the publication rhythm.',
            'Subtabs leave the chrome and become page-header italic — chrome stays under 90px.',
          ]}
          cons={[
            'Subtabs in page means every surface needs to render its own subtab strip.',
            'Active-state typography swap (mono → serif italic) is unusual; first-time users may need to learn it.',
            'Wordmark + tabs + utilities competing for one row at 1440 width can feel tight; mobile would need a redesign.',
          ]}
          wouldNeed={[
            'Refactor hifi-shell.jsx to render the masthead structure.',
            'Each surface assumes responsibility for its own subtab strip (move from shell to surface).',
            'Add VOL/NO/dateline as a single token in HF_DATA so it\'s editable.',
          ]}
        >
          <ChromeB_EditorialMasthead />
        </VariantCard>

        <VariantCard
          id="CH-C"
          title="Slim Left Rail"
          vibe="sidebar-driven · workspace + subtabs nested · profile pinned bottom"
          inspiredBy="Notion · Linear · Perplexity Pro"
          pros={[
            '220px rail gives every workspace a permanent home; nothing scrolls out of view.',
            'Subtabs nest under active workspace as a tree — IA is visible at a glance.',
            'Profile + identity pinned to bottom (matches Notion pattern users already know).',
            'Top utility bar shrinks to 44px — more vertical space for the actual work.',
            'Collapsible: pressing the hamburger collapses to icons-only (~64px) for full-bleed reading.',
          ]}
          cons={[
            'Eats 220px of horizontal real estate — content area drops from 1440 to 1220.',
            'Less editorial / more SaaS-y — rails read as software UI, not magazine.',
            'Subtabs nested in rail conflict with the "section header on page" pattern; might double up.',
            'Mobile responsive story is its own design problem (drawer? bottom tabs?).',
          ]}
          wouldNeed={[
            'New left-rail component — significant hifi-shell.jsx rewrite.',
            'Decide: do subtabs live in rail or in page? Both creates redundancy.',
            'Collapse / expand state management.',
          ]}
        >
          <ChromeC_LeftRail />
        </VariantCard>

        <VariantCard
          id="CH-D"
          title="Floating Pill Nav"
          vibe="dark surface-ink pill floats over warm-paper canvas · maximum focus on content"
          inspiredBy="Linear (command bar) · Vercel · Cron"
          pros={[
            'Removes the persistent topbar entirely; canvas reads as a single page.',
            'Dark pill against warm paper is striking — high contrast, very current.',
            'Active workspace gets clay-soft pill within the dark pill — clear emphasis.',
            'Subtabs detach completely from chrome — float in page as the surface\'s own header.',
            'Cmd-K and avatar live inside the pill — single nav unit, no scattered chrome.',
          ]}
          cons={[
            'Dark element on warm paper is a stark visual contrast — could feel heavy / "modal".',
            '7 workspace items in one inline pill at 1440 will be tight; mobile is impossible.',
            'Floating pill has no anchor — visually disconnected from page hierarchy.',
            'Less editorial than CH-B — reads as productivity-tool, not magazine.',
          ]}
          wouldNeed={[
            'Sticky positioning / scroll-aware behavior decisions.',
            'Pill-internal contrast checks (clay-soft on surface-ink with a11y).',
            'Consider whether the pill becomes an island or attaches to a top container.',
          ]}
        >
          <ChromeD_FloatingPill />
        </VariantCard>

        <VariantCard
          id="CH-E"
          title="Newspaper Nameplate"
          vibe="oversize italic-serif Coopr wordmark · double-rule · small-caps section nav"
          inspiredBy="The Atlantic · 1960s broadsheet press · NYRB"
          pros={[
            'Most editorial direction by far — every surface load opens like a newspaper front page.',
            '64px italic-serif wordmark IS the brand statement — no logo box needed.',
            'Double-rule under wordmark is a 200-year-old typesetting convention; signals "this is a publication".',
            'Small-caps mono section nav reads as section index, not chrome.',
            'Wraps the wordmark with editorial dateline ear ("VOL · NO · WEATHER") — full broadsheet treatment.',
          ]}
          cons={[
            'Heavy chrome (~140px tall) — least content-density-friendly direction.',
            'Maximalist masthead may overpower the actual page content.',
            'Centered nav is harder to scan than left/right anchored.',
            'Possibly too "themed" — might fight with data-dense surfaces like Insights or Inbox.',
            'Active workspace switching to italic-serif 18px while inactive stay 11px mono creates weird type ladder.',
          ]}
          wouldNeed={[
            'Strong stance: only worth doing if you commit fully to the magazine metaphor.',
            'Scale considerations for mobile / smaller breakpoints (the 64px wordmark won\'t fit).',
            'Editorial calendar / dateline as page state.',
          ]}
        >
          <ChromeE_Newspaper />
        </VariantCard>

        <VariantCard
          id="CH-F"
          title="Breadcrumb-Only"
          vibe="Cmd-K is the navigation · chrome shrinks to 48px · maximum content"
          inspiredBy="Stripe Dashboard · Vercel project view · Raycast"
          pros={[
            'Most minimal chrome — just 48px tall, 96% of the canvas is content.',
            'Workspace switching is implicit via Cmd-K command palette (already a peer skill in the prototype).',
            'Breadcrumb tells you where you are; serif-italic on the active leaf adds personality.',
            'Active-state status ("live · 14m") + Cmd-K + avatar all balanced at the right.',
            'Search bar is wider — invites typing instead of just being a hint.',
          ]}
          cons={[
            'Discoverability — users may not realize Cmd-K is required to switch workspaces.',
            'No visible nav means no spatial orientation; harder to introduce to new users.',
            'Power-user-y — slants away from the editorial vibe toward developer tooling.',
            'Subtabs need another solution (page header? Cmd-K? secondary breadcrumb level?).',
          ]}
          wouldNeed={[
            'Robust Cmd-K palette (already exists as HF_SearchOverlay — could extend).',
            'Onboarding affordance: first-launch tooltip "press ⌘K to switch sections".',
            'Decide subtab strategy (in-page header is most likely).',
          ]}
        >
          <ChromeF_Breadcrumb />
        </VariantCard>

        {/* Closing recommendation card */}
        <article style={{
          padding: '24px 28px 26px',
          borderRadius: 14,
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent-primary)',
        }}>
          <div style={{ fontFamily: CV.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', marginBottom: 10 }}>
            Recommendation · what fits COOPR's aesthetic best
          </div>
          <h2 style={{ margin: '0 0 10px', fontFamily: CV.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 26, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>
            CH-B Editorial Masthead is the most-COOPR direction. CH-C Slim Rail is the most-pragmatic.
          </h2>
          <p style={{ margin: '0 0 14px', fontFamily: CV.sans, fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.6 }}>
            CH-B turns the chrome itself into editorial content — the wordmark IS the masthead, active workspace gets serif-italic treatment, and the dateline strip sets a publication rhythm that the rest of the page already echoes. It's the only direction where the chrome stops feeling like SaaS chrome and starts feeling like a magazine front page. CH-C is the safest pragmatic choice — Notion / Linear users will know exactly where to look — but it pulls toward a productivity-tool vibe that competes with the editorial body. CH-E is striking but may overpower data-dense surfaces. CH-D and CH-F lean too much toward developer tooling.
          </p>
          <p style={{ margin: 0, fontFamily: CV.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--accent-primary-press)', lineHeight: 1.5 }}>
            If you pick CH-B, integration would be a focused fleet: refactor hifi-shell.jsx to the masthead structure, then sweep every surface to render its own subtab strip in its page header. Roughly a single-session job using the existing fleet patterns.
          </p>
        </article>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ChromeIdeation });
