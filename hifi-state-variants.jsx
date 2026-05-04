/* global React, window */
/* hifi-state-variants.jsx — F2 reusable state-variant heroes.

   Three components consumed by every primary surface for its non-happy
   branches. Each surface's `state` prop branches early; this file owns
   the visual vocabulary so the four states stay consistent across the
   product walkthrough.

   - HF_SkeletonHero  — loading shimmer, layout-aware via `shape` prop
   - HF_EmptyHero     — italic-serif title + mono caption + optional CTA
   - HF_ErrorHero     — tone-warning panel + retry chip

   Surfaces may still author bespoke skeletons / empties when the layout
   needs more fidelity (per R10: duplication is cheaper than the wrong
   abstraction). These three are the cheap default. F3 consumes them too.

   Load order: must come AFTER hifi-shell.jsx (no shell dep at runtime, but
   keeps a single load-order rule) and BEFORE every surface file that
   branches on state. See master.html.
*/

// ─── Tokens shared across the three heroes ───────────────────────
const HF_SV = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

// ─── Atom · uppercase mono eyebrow ───────────────────────────────
function HF_SV_Eyebrow({ children, color = 'var(--fg-tertiary)', style = {} }) {
  return (
    <span style={{
      fontFamily: HF_SV.mono,
      fontSize: 10.5,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color,
      fontVariantNumeric: 'tabular-nums',
      ...style,
    }}>
      {children}
    </span>
  );
}

// ─── Atom · italic serif title ───────────────────────────────────
function HF_SV_SerifTitle({ children, size = 30, style = {} }) {
  return (
    <span style={{
      fontFamily: HF_SV.serif,
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.18,
      letterSpacing: '-0.018em',
      color: 'var(--fg-primary)',
      ...style,
    }}>
      {children}
    </span>
  );
}

// ─── Atom · primary action chip ──────────────────────────────────
function HF_SV_CtaChip({ label, onClick, tone = 'primary' }) {
  const isWarn = tone === 'warning';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: HF_SV.mono,
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '9px 16px',
        border: '1px solid ' + (isWarn ? 'var(--tone-warning)' : 'var(--accent-primary)'),
        background: isWarn ? 'transparent' : 'var(--accent-primary)',
        color: isWarn ? 'var(--tone-warning)' : 'var(--fg-on-ink)',
        borderRadius: 0,
        cursor: 'pointer',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {label}
    </button>
  );
}

// ─── Atom · single shimmer block ─────────────────────────────────
// Reads from var(--surface-2) → var(--surface-1) gradient sweep so the
// shimmer adapts to dark / clay / moss accent themes without overrides.
function HF_SV_SkeletonBlock({ width = '100%', height = 12, radius = 0, style = {} }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, var(--surface-2) 0%, var(--surface-1) 50%, var(--surface-2) 100%)',
      backgroundSize: '200% 100%',
      animation: 'hf-skeleton-shimmer 1500ms ease-in-out infinite',
      ...style,
    }} />
  );
}

// ─── HF_SkeletonHero ─────────────────────────────────────────────
// `shape` selects the skeleton silhouette so the loading state mirrors
// the happy layout. Every shape stays on the 8pt grid. No copy.
function HF_SkeletonHero({ shape = 'list' }) {
  // eyebrow + masthead — shared masthead band for every shape
  const masthead = (
    <div style={{ padding: '22px 32px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <HF_SV_SkeletonBlock width={140} height={10} />
      <HF_SV_SkeletonBlock width={420} height={28} />
      <HF_SV_SkeletonBlock width={300} height={12} />
    </div>
  );

  const wrap = (children) => (
    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      {masthead}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );

  if (shape === 'grid') {
    // Library catalog · 7-up uniform grid of 9:16 cards
    return wrap(
      <div style={{ padding: '24px 32px 60px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '24px 12px' }}>
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <HF_SV_SkeletonBlock width="100%" height={210} />
            <HF_SV_SkeletonBlock width="80%" height={11} />
            <HF_SV_SkeletonBlock width="55%" height={9} />
          </div>
        ))}
      </div>
    );
  }

  if (shape === 'split') {
    // Insights · 2-column overview, charts left, narrative right
    return wrap(
      <div style={{ padding: '24px 32px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HF_SV_SkeletonBlock width={120} height={9} />
          <HF_SV_SkeletonBlock width="100%" height={220} />
          <div style={{ display: 'flex', gap: 12 }}>
            <HF_SV_SkeletonBlock width="33%" height={64} />
            <HF_SV_SkeletonBlock width="33%" height={64} />
            <HF_SV_SkeletonBlock width="33%" height={64} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HF_SV_SkeletonBlock width={120} height={9} />
          <HF_SV_SkeletonBlock width="100%" height={140} />
          <HF_SV_SkeletonBlock width="100%" height={12} />
          <HF_SV_SkeletonBlock width="92%" height={12} />
          <HF_SV_SkeletonBlock width="78%" height={12} />
          <HF_SV_SkeletonBlock width="100%" height={140} />
        </div>
      </div>
    );
  }

  if (shape === 'card-row') {
    // Studio workspace · pinned row + recent rows of project cards
    return wrap(
      <div style={{ padding: '24px 32px 60px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <HF_SV_SkeletonBlock width={160} height={9} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={'pin' + i} style={{ padding: 18, border: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <HF_SV_SkeletonBlock width="60%" height={10} />
              <HF_SV_SkeletonBlock width="90%" height={16} />
              <HF_SV_SkeletonBlock width="100%" height={11} />
              <HF_SV_SkeletonBlock width="80%" height={11} />
            </div>
          ))}
        </div>
        <HF_SV_SkeletonBlock width={120} height={9} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={'r' + i} style={{ padding: 14, border: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <HF_SV_SkeletonBlock width="50%" height={9} />
              <HF_SV_SkeletonBlock width="85%" height={13} />
              <HF_SV_SkeletonBlock width="65%" height={10} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (shape === 'calendar-week') {
    // Calendar week · 7-column day strip with stacked event tiles
    return wrap(
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
        {Array.from({ length: 7 }).map((_, d) => (
          <div key={d} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12, border: '1px solid var(--border-subtle)', background: 'var(--surface-1)', minHeight: 520 }}>
            <HF_SV_SkeletonBlock width="60%" height={10} />
            <HF_SV_SkeletonBlock width="90%" height={48} />
            <HF_SV_SkeletonBlock width="80%" height={48} />
            <HF_SV_SkeletonBlock width="92%" height={48} />
          </div>
        ))}
      </div>
    );
  }

  if (shape === 'feed') {
    // Inbox comments · vertical feed of comment rows
    return wrap(
      <div style={{ padding: '20px 32px 60px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <HF_SV_SkeletonBlock width={36} height={36} radius={18} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <HF_SV_SkeletonBlock width={180} height={10} />
              <HF_SV_SkeletonBlock width="92%" height={12} />
              <HF_SV_SkeletonBlock width="74%" height={12} />
              <HF_SV_SkeletonBlock width={120} height={9} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // shape === 'list' (default · home/today briefing column)
  return wrap(
    <div style={{ padding: '52px 32px 60px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 720, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <HF_SV_SkeletonBlock width={180} height={10} />
        <HF_SV_SkeletonBlock width={520} height={36} />
        <HF_SV_SkeletonBlock width={420} height={14} />
        <HF_SV_SkeletonBlock width="100%" height={120} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <HF_SV_SkeletonBlock width="100%" height={70} />
          <HF_SV_SkeletonBlock width="100%" height={70} />
          <HF_SV_SkeletonBlock width="100%" height={70} />
          <HF_SV_SkeletonBlock width="100%" height={70} />
        </div>
        <HF_SV_SkeletonBlock width={140} height={9} />
        <HF_SV_SkeletonBlock width="100%" height={68} />
        <HF_SV_SkeletonBlock width="100%" height={68} />
      </div>
    </div>
  );
}

// ─── HF_EmptyHero ────────────────────────────────────────────────
// Italic-serif headline + uppercase mono caption + optional cta. The
// CTA fires `onCta` (or a console.log fallback) so day-one creators
// hit a real handler.
function HF_EmptyHero({
  eyebrow = null,
  title = 'Nothing here yet.',
  caption = null,
  ctaLabel = null,
  onCta = null,
}) {
  function handleCta() {
    if (onCta) return onCta();
    console.log('[HF_EmptyHero] cta · no handler bound: ' + ctaLabel);
  }
  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 32px',
      background: 'var(--bg-base)',
      gap: 18,
      textAlign: 'center',
    }}>
      {eyebrow && <HF_SV_Eyebrow>{eyebrow}</HF_SV_Eyebrow>}
      <HF_SV_SerifTitle size={32} style={{ maxWidth: 620 }}>{title}</HF_SV_SerifTitle>
      {caption && (
        <span style={{
          fontFamily: HF_SV.mono,
          fontSize: 11,
          color: 'var(--fg-secondary)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontVariantNumeric: 'tabular-nums',
          maxWidth: 520,
          lineHeight: 1.5,
        }}>
          {caption}
        </span>
      )}
      {ctaLabel && <div style={{ marginTop: 6 }}><HF_SV_CtaChip label={ctaLabel} onClick={handleCta} /></div>}
    </div>
  );
}

// ─── HF_ErrorHero ────────────────────────────────────────────────
// Tone-warning panel. Caller supplies a body sentence in plain prose;
// retry chip fires `onRetry` (or a console.log fallback). Keeps the
// retry mechanism close to the failure label so the user never has to
// hunt for it.
function HF_ErrorHero({
  title = "Couldn't load this view.",
  body = 'A dependency timed out. Try again, or come back in a minute.',
  onRetry = null,
  retryLabel = 'Try again',
}) {
  function handleRetry() {
    if (onRetry) return onRetry();
    console.log('[HF_ErrorHero] retry · no handler bound');
  }
  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 32px',
      background: 'var(--bg-base)',
    }}>
      <div style={{
        maxWidth: 560,
        width: '100%',
        background: 'var(--tone-warning-bg)',
        border: '1px solid var(--tone-warning)',
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        <HF_SV_Eyebrow color="var(--tone-warning)">Couldn't load</HF_SV_Eyebrow>
        <HF_SV_SerifTitle size={24}>{title}</HF_SV_SerifTitle>
        <span style={{
          fontFamily: HF_SV.serif,
          fontStyle: 'italic',
          fontSize: 14,
          lineHeight: 1.55,
          color: 'var(--fg-secondary)',
        }}>
          {body}
        </span>
        <div style={{ marginTop: 4 }}>
          <HF_SV_CtaChip label={retryLabel} onClick={handleRetry} tone="warning" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HF_SkeletonHero,
  HF_EmptyHero,
  HF_ErrorHero,
  HF_SV_SkeletonBlock,
  HF_SV_Eyebrow,
  HF_SV_SerifTitle,
  HF_SV_CtaChip,
});
