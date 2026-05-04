/* global React, window */
/* hifi-r4-lib-visuals.jsx — round 4 Library shared visuals.
   Lifts LIB_VISUALS / TONE_PALETTES / ThumbBackdrop / ChromeReelIG / ChromeShortTT /
   ChromeLongYT / ChromeCarouselIG / PlatformCard from hifi-library.jsx and adds
   round-4-only primitives: PerfOverlay, RetentionSpark, PillarDot, TrialBadge,
   ImprovementPill, ChannelChip, CompactStat. Plus a richer card variant that
   supports density modes (compact/regular/lush) and overlay toggles. */

const R4_LIB_DATA = window.HF_DATA;

// ─── Per-post visuals (extended with improvement notes + trial flags) ─────
window.R4_LIB_VISUALS = {
  '0046': { display: 'reel-ig',     hook: '3 THINGS\nI CHECK\nbefore every wreck',           tone: 'deep-blue',  cooprScore: 47, lifecycle: 'graduated', velocity: '+4%/d',  improve: 'Hook lands at 1.1s — earlier cut to checklist would push 3s retention from 92% → 95%+.', trial: false, series: 'safety-primer' },
  '0045': { display: 'short-tt',    hook: 'why I trust\nmy SPG\nover my dive computer',      tone: 'teal',       cooprScore: 38, lifecycle: 'normal',     velocity: '+1%/d',  improve: 'On-camera Q&A format underperforms saves vs. teardown. Try same script as narrated teardown.', trial: false, series: 'gear' },
  '0044': { display: 'long-yt',     hook: 'TRUK LAGOON · The Fujikawa Maru in eight breaths', tone: 'kelp',       cooprScore: 71, lifecycle: 'graduated', velocity: '+12%/d', improve: 'Drop at 03:00 (–7pp). Likely the disclaimer card. Move to footer next time.',                trial: false, series: 'truk' },
  '0043': { display: 'reel-ig',     hook: 'BUDDY CHECK\nbut make it\nactually useful',       tone: 'cyan',       cooprScore: 22, lifecycle: 'normal',     velocity: '-3%/d',  improve: 'Hook is 2.4s — your library says ≤1.2s. Recut opening to lead with the gauge.',             trial: true,  series: 'safety-primer' },
  '0042': { display: 'long-yt',     hook: 'My first wreck — and what I got wrong',           tone: 'midnight',   cooprScore: 84, lifecycle: 'graduated', velocity: '+6%/d',  improve: 'No major drops. Repurpose the bow shot at 4:12 as a standalone reel — predicted CScore 72.', trial: false, series: 'truk' },
  '0041': { display: 'long-yt',     hook: 'The 12-minute primer that almost worked',         tone: 'navy',       cooprScore: 31, lifecycle: 'trial',      velocity: '-2%/d',  improve: '14% drop at min 1 from pre-roll disclaimer. Pacing complaints in comments. Replacement opener (d011) drafted.', trial: true,  series: 'safety-primer' },
  '0040': { display: 'long-yt',     hook: 'Reg first stage · DIN vs YOKE',                   tone: 'steel',      cooprScore: 56, lifecycle: 'normal',     velocity: '+3%/d',  improve: 'Solid retention. The DIN/YOKE comparison frame at 7:20 is your highest-rewatched moment — pull as a teaser.', trial: false, series: 'gear' },
  '0039': { display: 'short-tt',    hook: 'the EIGHT\nSECOND\nrule',                         tone: 'electric',   cooprScore: 62, lifecycle: 'graduated', velocity: '+9%/d',  improve: 'Top performer in the 8s rule cluster. Three more variants would compound.',                  trial: false, series: 'safety-primer' },
  '0038': { display: 'reel-ig',     hook: 'how to clean\na flooded\nMASK without panic',     tone: 'green',      cooprScore: 29, lifecycle: 'normal',     velocity: '+2%/d',  improve: 'Save rate below median. Try a "things-go-wrong" cold open instead of a how-to caption.',     trial: false, series: 'safety-primer' },
  '0037': { display: 'carousel-ig', hook: 'three reels\nfrom KOMODO\n· uncut',                tone: 'sunset',     cooprScore: 44, lifecycle: 'normal',     velocity: '+1%/d',  improve: 'Carousel format pulls 2× saves vs. reel for travel content. Worth a series of these.',       trial: false, series: 'komodo' },
  '0036': { display: 'long-yt',     hook: 'Should you buy a rebreather in year two?',        tone: 'plum',       cooprScore: 51, lifecycle: 'normal',     velocity: '+0%/d',  improve: 'Q&A format ceiling. Consider as a reel cutdown for IG.',                                       trial: false, series: 'gear' },
  '0035': { display: 'reel-ig',     hook: 'a reply to\n@marina.k\non safety storytelling',   tone: 'amber',      cooprScore: 33, lifecycle: 'normal',     velocity: '+1%/d',  improve: 'Reply format underweighted. Marina’s audience overlaps 62%. Worth a long-form follow-up.',     trial: false, series: null },
};

window.R4_TONE_PALETTES = {
  'deep-blue':  { from: '#0d2b3e', via: '#1f5876', to: '#3a7c9a' },
  'teal':       { from: '#0a3a3f', via: '#1f6770', to: '#3a9a9c' },
  'kelp':       { from: '#1a2e1a', via: '#2d4f2a', to: '#5a7a3e' },
  'cyan':       { from: '#0f3a4a', via: '#256a86', to: '#5fa8c0' },
  'midnight':   { from: '#0a1424', via: '#1a2c4a', to: '#2c4878' },
  'navy':       { from: '#0e1f3a', via: '#1f3760', to: '#385a8c' },
  'steel':      { from: '#1a2025', via: '#3a4452', to: '#6a7280' },
  'electric':   { from: '#0a1a3a', via: '#1f3a72', to: '#4868b8' },
  'green':      { from: '#0e2a1c', via: '#1f5535', to: '#3a8a55' },
  'sunset':     { from: '#3a1a0e', via: '#7a3a1a', to: '#c97b3e' },
  'plum':       { from: '#28102a', via: '#4a2155', to: '#7a4a8a' },
  'amber':      { from: '#3a200a', via: '#7a4a1a', to: '#c08a3e' },
};

// ─── ThumbBackdrop ─────────────────────────────────────────
// R5d: saturation bumped via CSS filter (cheap, global). Static white-dot
// speckle replaced with an SVG fractalNoise turbulence rendered as a tiled
// data-URL background — reads as film grain at low opacity + overlay blend.
function R4ThumbBackdrop({ tone = 'deep-blue', children, style = {} }) {
  const p = window.R4_TONE_PALETTES[tone] || window.R4_TONE_PALETTES['deep-blue'];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(140% 90% at 30% 20%, ${p.via} 0%, ${p.from} 60%, ${p.from} 100%)`,
      overflow: 'hidden',
      filter: 'saturate(1.18) contrast(1.04)',
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(50% 30% at 75% 15%, ${p.to}66 0%, transparent 70%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 80%, rgba(0,0,0,0.48), transparent 60%)' }} />
      {/* Film grain — fractalNoise turbulence, overlay blend, low opacity */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url("data:image/svg+xml;utf8,' +
          encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.5 0"/></filter><rect width="100%" height="100%" filter="url(%23g)"/></svg>')
          + '")',
        backgroundSize: '180px 180px',
        opacity: 0.16,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
}

// ─── Chrome variants (lifted from r3) ─────────────────────
function R4ChromeReelIG({ hook, fullChrome }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: 12, top: 30, right: 50,
        fontFamily: '"Plus Jakarta Sans", system-ui',
        fontSize: 15, fontWeight: 800, lineHeight: 1.05,
        color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.55)',
        whiteSpace: 'pre-wrap', textTransform: 'uppercase', letterSpacing: '-0.005em',
      }}>{hook}</div>
      <div style={{ position: 'absolute', right: 8, bottom: 56, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {[['♡','736'],['◯','29'],['↗','60'],['↙','32']].map(([g,n],i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 14, color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}>{g}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 8.5, color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.55)' }}>{n}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.45)', border: '1px solid #fff' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9.5, color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>@henry.dives</span>
        </div>
        {fullChrome && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 8, color: '#fff', opacity: 0.85, textShadow: '0 1px 2px rgba(0,0,0,0.6)', lineHeight: 1.3 }}>
            three things I check before every wreck dive…
          </div>
        )}
      </div>
    </>
  );
}

function R4ChromeShortTT({ hook }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: 12, top: 60, right: 50,
        fontFamily: '"Plus Jakarta Sans", system-ui',
        fontSize: 16, fontWeight: 800, lineHeight: 1.0,
        color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        whiteSpace: 'pre-wrap', textTransform: 'lowercase', letterSpacing: '-0.015em',
      }}>{hook}</div>
      <div style={{ position: 'absolute', right: 7, bottom: 70, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        {[['♥','4.2K'],['◯','612'],['⤴','1.1K'],['☆','420']].map(([g,n],i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>{g}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 7.5, color: '#fff', fontWeight: 700 }}>{n}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 10, right: 50, bottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9, color: '#fff', fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}>@henrymwangi</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 8, color: '#fff', opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.7)', marginTop: 2 }}>♪ original sound — henry</div>
      </div>
    </>
  );
}

function R4ChromeLongYT({ hook, durationS = 600 }) {
  const m = Math.floor(durationS / 60);
  const s = String(durationS % 60).padStart(2, '0');
  return (
    <>
      <div style={{
        position: 'absolute', left: 14, top: 16, right: 16,
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: 19, fontWeight: 500, lineHeight: 1.05,
        color: '#fff', textShadow: '0 1px 12px rgba(0,0,0,0.6)', letterSpacing: '-0.01em',
      }}>{hook}</div>
      <span style={{
        position: 'absolute', right: 8, bottom: 8,
        background: 'rgba(0,0,0,0.85)', color: '#fff',
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
        padding: '2px 5px', borderRadius: 3,
      }}>{m}:{s}</span>
    </>
  );
}

function R4ChromeCarouselIG({ hook }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: 14, top: 24, right: 20,
        fontFamily: '"Plus Jakarta Sans", system-ui',
        fontSize: 14, fontWeight: 800, lineHeight: 1.05,
        color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.5)',
        whiteSpace: 'pre-wrap', textTransform: 'uppercase',
      }}>{hook}</div>
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 3 }}>
        {[0,1,2,3,4,5].map(i => (
          <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
      <div style={{ position: 'absolute', right: -3, top: -3, bottom: -3, width: 4, background: 'rgba(0,0,0,0.25)', borderRadius: '0 6px 6px 0' }} />
      <div style={{ position: 'absolute', left: 12, bottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', border: '1px solid #fff' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9.5, color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>@henry.dives</span>
      </div>
    </>
  );
}

// ─── Format helpers ──────────────────────────────────────
function r4FmtViews(n) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000)    return (n/1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function r4PlatformLabel(display) {
  return {
    'reel-ig':     'REEL',
    'short-tt':    'TIKTOK',
    'long-yt':     'YOUTUBE',
    'carousel-ig': 'CAROUSEL',
  }[display] || 'POST';
}

function r4PlatformShort(channel) {
  return { yt: 'YT', ig: 'IG', tt: 'TT' }[channel] || channel;
}

// ─── Sparkline (retention curve, mini) ────────────────────
function R4RetentionSpark({ data, w = 56, h = 16, accent = false }) {
  if (!data || !data.length) return null;
  const min = 0, max = 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const stroke = accent ? 'var(--accent-primary)' : 'var(--fg-tertiary)';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Pillar dot (color-coded) ─────────────────────────────
const R4_PILLAR_COLORS = {
  safety: 'var(--accent-primary)',
  gear:   'var(--tone-info)',
  story:  'var(--tone-success)',
  reply:  'var(--tone-warning)',
};
function R4PillarDot({ pillar, size = 6 }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: R4_PILLAR_COLORS[pillar] || 'var(--fg-tertiary)', flexShrink: 0 }} />;
}

// ─── Trial badge (overlaid corner) ────────────────────────
function R4TrialBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 6px',
      background: 'rgba(255,255,255,0.92)', color: 'var(--fg-primary)',
      borderRadius: 3,
      fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--tone-warning)' }} />
      TRIAL
    </span>
  );
}

// ─── Channel chip (mini) ──────────────────────────────────
function R4ChannelChip({ ch }) {
  const bg = { yt: '#ff0033', ig: '#0a0a0a', tt: '#0a0a0a' }[ch] || '#0a0a0a';
  const lbl = { yt: 'YT', ig: 'IG', tt: 'TT' }[ch] || ch.toUpperCase();
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 18, height: 14,
      background: bg, color: '#fff',
      fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700,
      letterSpacing: '0.04em', borderRadius: 2,
    }}>{lbl}</span>
  );
}

// ─── Performance overlay (covers thumbnail bottom) ───────
function R4PerfOverlay({ post, mode = 'curve' }) {
  // mode: 'curve' (retention spark + saves) | 'numbers' (views/saves/score) | 'off'
  if (mode === 'off') return null;
  if (mode === 'numbers') {
    return (
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0))',
        padding: '18px 8px 6px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6,
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', gap: 9, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#fff' }}>{r4FmtViews(post.views)}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }}>VIEWS</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: '#fff' }}>{(post.watchPct*100).toFixed(0)}%</span>
        </div>
      </div>
    );
  }
  // curve mode
  return (
    <div style={{
      position: 'absolute', left: 6, right: 6, bottom: 6,
      background: 'rgba(15,14,12,0.78)',
      backdropFilter: 'blur(6px)',
      padding: '5px 7px',
      borderRadius: 4,
      display: 'flex', alignItems: 'center', gap: 8,
      pointerEvents: 'none',
    }}>
      <R4RetentionSpark data={post.retention} w={50} h={14} accent={post.watchPct >= 0.6} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, color: '#fff' }}>{(post.watchPct*100).toFixed(0)}%</span>
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>{r4FmtViews(post.saves)}♡</span>
    </div>
  );
}

// ─── Card sizes per density ───────────────────────────────
// Ratios stay platform-faithful; only the BASE width changes by density.
function r4CardDims(display, density = 'regular') {
  const base = density === 'compact' ? 0.78 : (density === 'lush' ? 1.15 : 1.0);
  if (display === 'long-yt')      return { w: Math.round(280*base), h: Math.round(158*base), aspect: '16:9' };
  if (display === 'carousel-ig')  return { w: Math.round(220*base), h: Math.round(220*base), aspect: '1:1' };
  if (display === 'short-tt')     return { w: Math.round(168*base), h: Math.round(298*base), aspect: '9:16' };
  return { w: Math.round(168*base), h: Math.round(298*base), aspect: '9:16' };
}

// Aspect ratio (h/w) per display — used by colWidth path so card height is
// driven by aspect when card adopts a column's width.
function r4AspectHW(display) {
  if (display === 'long-yt')     return 9/16;     // landscape
  if (display === 'carousel-ig') return 1;
  return 16/9;                                     // portrait (short-tt, reel-ig)
}

// ─── The Card ─────────────────────────────────────────────
function R4PlatformCard({ post, density = 'regular', perfMode = 'curve', selectable = false, selected = false, hoverHint = false, colWidth = null, onClick }) {
  const v = window.R4_LIB_VISUALS[post.id] || window.R4_LIB_VISUALS['0046'];
  const display = v.display;
  // colWidth takes precedence — card adopts the column width and computes
  // height from the platform aspect ratio. Used by masonry sections.
  const baseDims = r4CardDims(display, density);
  const w = colWidth != null ? colWidth : baseDims.w;
  const h = colWidth != null ? Math.round(colWidth * r4AspectHW(display)) : baseDims.h;

  let ChromeFn;
  if (display === 'long-yt') ChromeFn = R4ChromeLongYT;
  else if (display === 'carousel-ig') ChromeFn = R4ChromeCarouselIG;
  else if (display === 'short-tt') ChromeFn = R4ChromeShortTT;
  else ChromeFn = R4ChromeReelIG;

  // hoverHint simulates the hover state on a static prototype so the affordance is visible.
  // Uses the same accent ring as `selected` but a tighter shadow + a top-right "open" pill.
  const cardShadow = selected
    ? '0 0 0 2px var(--accent-primary), 0 6px 18px rgba(182,83,43,0.22)'
    : hoverHint
      ? '0 0 0 1.5px var(--accent-primary), 0 4px 14px rgba(182,83,43,0.16)'
      : '0 1px 2px rgba(15,14,12,0.08)';

  return (
    <div onClick={onClick} style={{
      width: w, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: density === 'compact' ? 6 : 8,
      position: 'relative',
      transform: hoverHint ? 'translateY(-2px)' : 'none',
      transition: 'transform 160ms ease',
    }}>
      {/* Thumbnail */}
      <div style={{
        position: 'relative', width: w, height: h, borderRadius: 6, overflow: 'hidden',
        background: '#111',
        boxShadow: cardShadow,
      }}>
        <R4ThumbBackdrop tone={v.tone}>
          <ChromeFn hook={v.hook} durationS={post.durationS} />
        </R4ThumbBackdrop>

        {/* Coopr Score badge — top-left */}
        <div style={{
          position: 'absolute', left: 7, top: 7,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          padding: '3px 7px', borderRadius: 4,
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}>
            <path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" />
          </svg>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.005em' }}>{v.cooprScore}</span>
        </div>

        {/* Platform label — top-right */}
        <div style={{
          position: 'absolute', right: 7, top: 7,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          padding: '3px 6px', borderRadius: 3,
          fontFamily: 'var(--font-sans)', fontSize: 8.5, fontWeight: 700, color: '#fff',
          letterSpacing: '0.08em',
        }}>{r4PlatformLabel(display)}</div>

        {/* Trial badge — top-center */}
        {v.trial && (
          <div style={{ position: 'absolute', left: '50%', top: 7, transform: 'translateX(-50%)' }}>
            <R4TrialBadge />
          </div>
        )}

        {/* Performance overlay */}
        <R4PerfOverlay post={post} mode={perfMode} />

        {/* Selection corner */}
        {selectable && (
          <div style={{
            position: 'absolute', left: 7, bottom: 7,
            width: 18, height: 18, borderRadius: '50%',
            background: selected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.92)',
            border: selected ? 'none' : '1px solid rgba(0,0,0,0.18)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.16)',
          }}>
            {selected && (
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </div>
        )}

        {/* Hover affordance pill — appears when hoverHint is true so the static
            prototype shows what the click target looks like. */}
        {hoverHint && (
          <span style={{
            position: 'absolute', right: 7, bottom: 7,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px',
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            borderRadius: 4,
            fontFamily: 'var(--font-sans)', fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            boxShadow: '0 2px 6px rgba(15,14,12,0.20)',
          }}>
            Open
            <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 8 L8 2 M5 2 L8 2 L8 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        )}
      </div>

      {/* Below-card metadata */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {display === 'long-yt' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <R4PillarDot pillar={post.pillar} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: density === 'compact' ? 11.5 : 12.5, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: density === 'compact' ? 10 : 11, color: 'var(--fg-tertiary)' }}>{r4FmtViews(post.views)} views · {post.publishedAt}</span>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <R4PillarDot pillar={post.pillar} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: density === 'compact' ? 10 : 11, color: 'var(--fg-secondary)' }}>{post.publishedAt}</span>
            <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--fg-tertiary)' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: density === 'compact' ? 10 : 11, fontWeight: 600, color: 'var(--fg-primary)' }}>{r4FmtViews(post.views)}</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: v.velocity.startsWith('-') ? 'var(--tone-warning)' : 'var(--tone-success)' }}>{v.velocity}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Filter chip ──────────────────────────────────────────
function R4Chip({ children, active = false, size = 'md', accent = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '4px 10px' : '6px 12px',
      background: active ? (accent ? 'var(--accent-primary)' : 'var(--surface-ink)') : 'transparent',
      border: '1px solid ' + (active ? (accent ? 'var(--accent-primary)' : 'var(--surface-ink)') : 'var(--border-default)'),
      color: active ? (accent ? 'var(--fg-on-accent)' : 'var(--fg-on-ink)') : 'var(--fg-secondary)',
      borderRadius: 999,
      fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 11 : 12, fontWeight: active ? 600 : 500,
      cursor: 'default', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ─── Stats (for detail / panels) ──────────────────────────
function R4Stat({ label, value, sub, big = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: big ? 28 : 20, fontWeight: 500, color: 'var(--fg-primary)', lineHeight: 1, letterSpacing: '-0.015em' }}>{value}</span>
      {sub && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-tertiary)', lineHeight: 1.3 }}>{sub}</span>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//
// E1 · PLATFORM-FAITHFUL CATALOG THUMBNAILS
//
// Five variants meant to be MIXED on a single page so Library/Catalog
// reads as a real library — Reels next to Threads next to YouTube — not a
// uniform tile grid. Each thumbnail is fully self-contained chrome (handle,
// caption, metric strip, platform tells) so it can be dropped into any
// masonry-style layout without external labels.
//
// Pre-existing platform-card glyphs (♡ ◯ ↗ ↙ ♥ ⤴ ☆ ♪) are an allowed
// exception per DESIGN-SYSTEM.md R14 — these new thumbnails mirror them.
//
// All thumbnails share a small "scene SVG" hint per pillar — abstract
// shapes that suggest the underlying topic without being literal.
// ════════════════════════════════════════════════════════════════════════

// Pillar → abstract scene hint. Small SVG shapes overlaid into the
// gradient body so each thumbnail looks like content, not a placeholder.
function R4SceneHint({ pillar = 'safety', accent = 'rgba(255,255,255,0.20)', muted = 'rgba(255,255,255,0.10)' }) {
  if (pillar === 'safety') {
    // crossed-checklist beats — three short horizontal strokes + a tick
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line x1="22" y1="40" x2="48" y2="40" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="52" x2="60" y2="52" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="64" x2="44" y2="64" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68 46 L74 53 L84 40" stroke={accent} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="40" r="2" fill={muted} />
        <circle cx="14" cy="52" r="2" fill={muted} />
        <circle cx="14" cy="64" r="2" fill={muted} />
      </svg>
    );
  }
  if (pillar === 'gear') {
    // a single piece of gear silhouette — rectangle + tube + dial
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <rect x="32" y="42" width="36" height="22" rx="3" fill={accent} />
        <circle cx="50" cy="53" r="6" fill="none" stroke={muted} strokeWidth="1.5" />
        <line x1="50" y1="48" x2="50" y2="51" stroke={muted} strokeWidth="1.5" strokeLinecap="round" />
        <rect x="44" y="34" width="12" height="9" rx="1.5" fill={muted} />
      </svg>
    );
  }
  if (pillar === 'story') {
    // kelp / horizon — flowing diagonal lines
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <path d="M-5 70 Q 25 55, 45 70 T 105 70" fill="none" stroke={accent} strokeWidth="1.8" />
        <path d="M-5 78 Q 30 64, 55 78 T 105 78" fill="none" stroke={muted} strokeWidth="1.5" />
        <line x1="20" y1="20" x2="20" y2="68" stroke={muted} strokeWidth="1.2" />
        <line x1="32" y1="28" x2="32" y2="72" stroke={accent} strokeWidth="1.3" />
        <line x1="74" y1="22" x2="74" y2="70" stroke={muted} strokeWidth="1.2" />
        <line x1="84" y1="30" x2="84" y2="74" stroke={accent} strokeWidth="1.3" />
      </svg>
    );
  }
  // reply / default — quote-mark cluster
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path d="M28 40 Q24 40, 24 46 L24 56 L34 56 L34 46 Q34 40, 30 40 M22 50 Q22 46, 26 44" fill={accent} opacity="0.55" />
      <path d="M50 40 Q46 40, 46 46 L46 56 L56 56 L56 46 Q56 40, 52 40 M44 50 Q44 46, 48 44" fill={accent} opacity="0.55" />
    </svg>
  );
}

// Tiny avatar dot used by every thumbnail's chrome. Tone-tinted disc with
// a subtle inner ring so it reads as a profile picture, not a bullet.
function R4MiniAvatar({ size = 14, tone = 'deep-blue' }) {
  const p = window.R4_TONE_PALETTES[tone] || window.R4_TONE_PALETTES['deep-blue'];
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 35% 30%, ${p.to}, ${p.from})`,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.55), 0 1px 2px rgba(0,0,0,0.35)',
    }} />
  );
}

// Inline metric stack used by Reel + Feed thumbnails (vertical stack of
// glyph + tabular number).
function R4MetricStack({ items, color = '#fff', shadow = '0 1px 3px rgba(0,0,0,0.6)' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      {items.map(([g, n], i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: 13, color, filter: `drop-shadow(${shadow})` }}>{g}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color, fontWeight: 600, textShadow: shadow, letterSpacing: '0.02em' }}>{n}</span>
        </div>
      ))}
    </div>
  );
}

// ─── 1. Reel thumbnail — 9:16 vertical (TikTok / IG Reel) ────────────
function R4Thumb_Reel({ post, platform = 'ig' }) {
  const v = window.R4_LIB_VISUALS[post.id] || window.R4_LIB_VISUALS['0046'];
  const handle = platform === 'tt' ? '@henrymwangi' : '@henry.dives';
  const platformLabel = platform === 'tt' ? 'TikTok' : 'Reels';
  const m = Math.floor(post.durationS / 60);
  const sec = String(post.durationS % 60).padStart(2, '0');
  // Caption preview — first 2 lines of the title in serif italic.
  const caption = post.title.length > 56 ? post.title.slice(0, 54) + '…' : post.title;
  const metrics = platform === 'tt'
    ? [['♥', window.r4FmtViews(post.saves * 2)], ['◯', window.r4FmtViews(post.comments)], ['⤴', window.r4FmtViews(Math.round(post.saves * 0.4))]]
    : [['♡', window.r4FmtViews(post.saves)], ['◯', window.r4FmtViews(post.comments)], ['↗', window.r4FmtViews(Math.round(post.saves * 0.3))]];
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '9 / 16', borderRadius: 6, overflow: 'hidden', background: '#111' }}>
      <R4ThumbBackdrop tone={v.tone}>
        <R4SceneHint pillar={post.pillar} />
        {/* Top-left: platform glyph + handle */}
        <div style={{
          position: 'absolute', left: 8, top: 8,
          display: 'flex', alignItems: 'center', gap: 5,
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'rgba(255,255,255,0.92)',
          textShadow: '0 1px 2px rgba(0,0,0,0.55)',
          letterSpacing: '0.04em',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700 }}>{platform === 'tt' ? '♪' : '◯'}</span>
          <span>{handle}</span>
        </div>
        {/* Top-right: duration pill */}
        <span style={{
          position: 'absolute', right: 8, top: 8,
          padding: '2px 5px',
          borderRadius: 2,
          background: 'rgba(0,0,0,0.55)',
          color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
          letterSpacing: '0.02em',
        }}>{m}:{sec}</span>
        {/* Right rail: metric stack */}
        <div style={{ position: 'absolute', right: 8, bottom: 60 }}>
          <R4MetricStack items={metrics} />
        </div>
        {/* Bottom-left: caption preview, serif italic, with gradient overlay */}
        <div style={{
          position: 'absolute', left: 0, right: 50, bottom: 0,
          padding: '24px 10px 10px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
        }}>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 11, fontWeight: 500, lineHeight: 1.25,
            color: 'rgba(255,255,255,0.96)',
            textShadow: '0 1px 3px rgba(0,0,0,0.65)',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{caption}</div>
        </div>
        {/* Watermark — platform name, bottom-right of the gradient */}
        <span style={{
          position: 'absolute', right: 8, bottom: 8,
          fontFamily: 'var(--font-mono)', fontSize: 8,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>{platformLabel}</span>
      </R4ThumbBackdrop>
    </div>
  );
}

// ─── 2. Carousel thumbnail — 1:1 IG carousel ──────────────────────────
function R4Thumb_Carousel({ post, pages = 5 }) {
  const v = window.R4_LIB_VISUALS[post.id] || window.R4_LIB_VISUALS['0046'];
  const handle = '@henry.dives';
  const caption = post.title.length > 48 ? post.title.slice(0, 46) + '…' : post.title;
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: 6, overflow: 'hidden', background: '#111' }}>
      <R4ThumbBackdrop tone={v.tone}>
        <R4SceneHint pillar={post.pillar} />
        {/* Top-right: page indicator pill 1/N */}
        <span style={{
          position: 'absolute', right: 8, top: 8,
          padding: '2px 6px',
          borderRadius: 999,
          background: 'rgba(0,0,0,0.55)',
          color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
          letterSpacing: '0.02em',
        }}>1/{pages}</span>
        {/* Carousel page dots — bottom-center */}
        <div style={{
          position: 'absolute', left: '50%', bottom: 30,
          transform: 'translateX(-50%)',
          display: 'flex', gap: 4,
        }}>
          {Array.from({ length: pages }).map((_, i) => (
            <span key={i} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: i === 0 ? '#fff' : 'rgba(255,255,255,0.45)',
              boxShadow: '0 1px 1px rgba(0,0,0,0.45)',
            }} />
          ))}
        </div>
        {/* Bottom strip: handle + caption + metrics */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '20px 10px 8px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.62), transparent)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <R4MiniAvatar size={12} tone={v.tone} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#fff', letterSpacing: '0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{handle}</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>♡ {window.r4FmtViews(post.saves)}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>◯ {window.r4FmtViews(post.comments)}</span>
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 10, fontWeight: 500, lineHeight: 1.25,
            color: 'rgba(255,255,255,0.96)',
            textShadow: '0 1px 3px rgba(0,0,0,0.65)',
            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{caption}</div>
        </div>
      </R4ThumbBackdrop>
    </div>
  );
}

// ─── 3. Feed thumbnail — 4:5 IG feed post ─────────────────────────────
function R4Thumb_Feed({ post }) {
  const v = window.R4_LIB_VISUALS[post.id] || window.R4_LIB_VISUALS['0046'];
  const handle = '@henry.dives';
  const caption = post.title;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {/* Top: profile bar — IG-style */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 2px',
      }}>
        <R4MiniAvatar size={18} tone={v.tone} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{handle}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>···</span>
      </div>
      {/* Image area — 4:5 */}
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '4 / 5',
        borderRadius: 4, overflow: 'hidden', background: '#111',
      }}>
        <R4ThumbBackdrop tone={v.tone}>
          {/* Asymmetric scene — translate the hint to the right side */}
          <div style={{ position: 'absolute', inset: 0, transform: 'translateX(12%)' }}>
            <R4SceneHint pillar={post.pillar} accent="rgba(255,255,255,0.24)" muted="rgba(255,255,255,0.12)" />
          </div>
          {/* Subtle vignette on the left so the asymmetry reads */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%',
            background: 'linear-gradient(to right, rgba(0,0,0,0.32), transparent)',
            pointerEvents: 'none',
          }} />
        </R4ThumbBackdrop>
      </div>
      {/* Bottom strip: like / comment / share / save row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 2px',
      }}>
        <span style={{ fontSize: 14, color: 'var(--fg-primary)' }}>♡</span>
        <span style={{ fontSize: 14, color: 'var(--fg-primary)' }}>◯</span>
        <span style={{ fontSize: 14, color: 'var(--fg-primary)' }}>↗</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 14, color: 'var(--fg-primary)' }}>☆</span>
      </div>
      {/* Likes + caption row */}
      <div style={{ padding: '0 2px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '0.02em' }}>
          {window.r4FmtViews(post.saves * 4)} likes
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-primary)',
          lineHeight: 1.32, marginTop: 2,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          <span style={{ fontWeight: 700, marginRight: 4 }}>{handle.replace('@','')}</span>
          {caption}
        </div>
      </div>
    </div>
  );
}

// ─── 4. Thread card — Threads-style text card (no image area) ─────────
// Thread bodies are pulled from the post title + a synthesised follow-up
// line so the card reads as a 3-5 line micro-essay, not a tweet.
function R4Thumb_Thread({ post, withImage = false }) {
  const v = window.R4_LIB_VISUALS[post.id] || window.R4_LIB_VISUALS['0046'];
  const handle = '@henry.dives';
  const ts = post.publishedAt;
  // Thread body — title plus a follow-up line keyed off pillar.
  const followups = {
    safety: 'The mistake people make is treating it as a one-time check. It\'s the muscle you build before anything goes wrong.',
    gear:   'Bought it twice before realising the first one was fine — I just hadn\'t learned how to read it yet.',
    story:  'Eight breaths in, the bow plate came into view. The lighting did the rest. Sometimes the dive writes itself.',
    reply:  'Three things I\'d change about the original — and one I wouldn\'t. The thread that started it is in my bio.',
  };
  const followup = followups[post.pillar] || followups.story;
  const replyCount = post.comments;
  const likeCount = post.saves * 2;
  const repostCount = Math.round(post.saves * 0.3);
  return (
    <div style={{
      width: '100%',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 6,
      padding: '12px 14px 10px',
      display: 'flex', flexDirection: 'column', gap: 8,
      boxShadow: '0 1px 2px rgba(15,14,12,0.05)',
    }}>
      {/* Header: avatar + handle + timestamp */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <R4MiniAvatar size={22} tone={v.tone} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: 'var(--fg-primary)', lineHeight: 1.1 }}>{handle.replace('@','')}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{handle} · {ts}</span>
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>···</span>
      </div>
      {/* Body — serif italic, 3-5 lines */}
      <div style={{
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: 12.5, fontWeight: 400, lineHeight: 1.42,
        color: 'var(--fg-primary)',
        letterSpacing: '-0.005em',
      }}>
        <div style={{ marginBottom: 6 }}>{post.title}.</div>
        <div style={{ color: 'var(--fg-secondary)' }}>{followup}</div>
      </div>
      {/* Optional image attachment — small rounded thumb */}
      {withImage && (
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '16 / 9',
          borderRadius: 5, overflow: 'hidden', background: '#111',
          marginTop: 2,
        }}>
          <R4ThumbBackdrop tone={v.tone}>
            <R4SceneHint pillar={post.pillar} accent="rgba(255,255,255,0.18)" muted="rgba(255,255,255,0.08)" />
          </R4ThumbBackdrop>
        </div>
      )}
      {/* Bottom strip: 4 micro glyphs + counts */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        paddingTop: 6,
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>◯</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)', letterSpacing: '0.02em' }}>{window.r4FmtViews(replyCount)}</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>⤴</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)', letterSpacing: '0.02em' }}>{window.r4FmtViews(repostCount)}</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>♡</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)', letterSpacing: '0.02em' }}>{window.r4FmtViews(likeCount)}</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>↗</span>
        </span>
        <span style={{ flex: 1 }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 8.5,
          color: 'var(--fg-tertiary)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>Threads</span>
      </div>
    </div>
  );
}

// ─── 5. YouTube thumbnail — 16:9 video card ───────────────────────────
function R4Thumb_YouTube({ post }) {
  const v = window.R4_LIB_VISUALS[post.id] || window.R4_LIB_VISUALS['0046'];
  const m = Math.floor(post.durationS / 60);
  const sec = String(post.durationS % 60).padStart(2, '0');
  const handle = '@henrymwangi';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {/* 16:9 video block */}
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '16 / 9',
        borderRadius: 6, overflow: 'hidden', background: '#111',
      }}>
        <R4ThumbBackdrop tone={v.tone}>
          {/* Cinematic horizon line — subtle two-band split */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '58%', height: 1,
            background: 'rgba(255,255,255,0.18)',
            boxShadow: '0 -10px 20px rgba(255,255,255,0.04)',
          }} />
          <R4SceneHint pillar={post.pillar} />
          {/* Duration pill — bottom-right */}
          <span style={{
            position: 'absolute', right: 6, bottom: 6,
            padding: '2px 5px',
            borderRadius: 2,
            background: 'rgba(0,0,0,0.85)',
            color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.02em',
          }}>{m}:{sec}</span>
          {/* Watermark — bottom-left */}
          <span style={{
            position: 'absolute', left: 8, bottom: 6,
            fontFamily: 'var(--font-mono)', fontSize: 8,
            color: 'rgba(255,255,255,0.62)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>YouTube</span>
        </R4ThumbBackdrop>
      </div>
      {/* Title row + handle/views */}
      <div style={{ display: 'flex', gap: 8 }}>
        <R4MiniAvatar size={22} tone={v.tone} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 700,
            color: 'var(--fg-primary)', lineHeight: 1.32, letterSpacing: '-0.005em',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{post.title}</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            color: 'var(--fg-tertiary)', letterSpacing: '0.02em',
          }}>
            <span>{handle}</span>
            <span>·</span>
            <span>{window.r4FmtViews(post.views)} views</span>
            <span>·</span>
            <span>{post.publishedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  R4ThumbBackdrop,
  R4ChromeReelIG, R4ChromeShortTT, R4ChromeLongYT, R4ChromeCarouselIG,
  R4PlatformCard,
  R4RetentionSpark, R4PillarDot, R4TrialBadge, R4ChannelChip,
  R4PerfOverlay,
  R4Chip, R4Stat,
  r4FmtViews, r4PlatformLabel, r4PlatformShort, r4CardDims, r4AspectHW,
  // E1 · platform-faithful catalog thumbnails
  R4Thumb_Reel, R4Thumb_Carousel, R4Thumb_Feed, R4Thumb_Thread, R4Thumb_YouTube,
  R4SceneHint, R4MiniAvatar, R4MetricStack,
});
