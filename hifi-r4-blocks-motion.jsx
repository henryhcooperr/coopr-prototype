/* global React, window, document, Eyebrow, Icon, FooterChip, performance */
/* hifi-r4-blocks-motion.jsx — R4F shared motion primitives.

   Loaded between hifi-r4-blocks-shared.jsx and the family files. Exposes
   draw-in / count-up / stagger / reveal helpers used by per-block authored
   states (loading skeletons that mirror the tool shape) and animated idle
   entries (charts that draw, numbers that tween, text that reveals).

   All primitives respect prefers-reduced-motion: if reduced, render the final
   state immediately. No runtime dependencies — Babel-standalone, exposed via
   Object.assign(window, …). */

function useReducedMotion() {
  const get = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  const [reduced, setReduced] = React.useState(get);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
    };
  }, []);
  return reduced;
}

// SVG path that strokes itself in over `duration` ms via dashoffset → 0.
// Caller passes a `d=`. We render a <path> with strokeDasharray = pathLength,
// strokeDashoffset = pathLength → 0 transition. Reduced-motion: render filled.
function R4BDrawPath({
  d,
  duration = 900,
  delay = 0,
  easing = 'ease-out',
  stroke = 'var(--accent-primary)',
  strokeWidth = 2,
  strokeDasharray,
  fill = 'none',
  onDone,
  pathLength = 1000,
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef(null);
  const [played, setPlayed] = React.useState(reduced);
  React.useEffect(() => {
    if (reduced) {
      setPlayed(true);
      if (onDone) onDone();
      return undefined;
    }
    setPlayed(false);
    const node = ref.current;
    if (!node) return undefined;
    // Force a frame so the initial dashoffset paints before we transition to 0.
    node.style.transition = 'none';
    node.style.strokeDasharray = String(pathLength);
    node.style.strokeDashoffset = String(pathLength);
    const raf = window.requestAnimationFrame(() => {
      node.style.transition = `stroke-dashoffset ${duration}ms ${easing} ${delay}ms`;
      node.style.strokeDashoffset = '0';
    });
    const t = window.setTimeout(() => {
      setPlayed(true);
      if (onDone) onDone();
    }, duration + delay + 32);
    return () => { window.cancelAnimationFrame(raf); window.clearTimeout(t); };
  }, [d, duration, delay, easing, pathLength, reduced, onDone]);
  const dashOverride = strokeDasharray && played ? { strokeDasharray } : null;
  return (
    <path
      ref={ref}
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      pathLength={pathLength}
      style={dashOverride}
      {...rest}
    />
  );
}

// Wrapper around an array of children — applies cascading delay so each child
// rises into place. Children should accept className via `r4f-stagger-item`
// or be DOM nodes that can be styled. Reduced-motion: render statically.
function R4BStaggerBars({ children, baseDelay = 40, duration = 320, className = '' }) {
  ensureMotionStyles();
  const reduced = useReducedMotion();
  const items = React.Children.toArray(children);
  if (reduced) {
    return <span className={`r4f-stagger ${className}`}>{children}</span>;
  }
  return (
    <span className={`r4f-stagger r4f-stagger--play ${className}`}>
      {items.map((child, i) => (
        <span
          key={i}
          className="r4f-stagger-item"
          style={{ animationDelay: `${i * baseDelay}ms`, animationDuration: `${duration}ms` }}
        >
          {child}
        </span>
      ))}
    </span>
  );
}

// Wraps an SVG <g> of donut segments and applies a CSS conic-style sweep mask.
// Implemented as a rotating semi-transparent overlay since CSS conic masks
// don't compose with SVG cleanly across Safari. Reduced-motion: no overlay.
function R4BSweepDonut({ duration = 800, children }) {
  ensureMotionStyles();
  const reduced = useReducedMotion();
  const [done, setDone] = React.useState(reduced);
  React.useEffect(() => {
    if (reduced) { setDone(true); return undefined; }
    setDone(false);
    const t = window.setTimeout(() => setDone(true), duration + 24);
    return () => window.clearTimeout(t);
  }, [duration, reduced]);
  return (
    <g className={`r4f-donut-sweep${done ? ' r4f-donut-sweep--done' : ''}`} style={{ transformOrigin: 'center', transformBox: 'fill-box', animationDuration: `${duration}ms` }}>
      {children}
    </g>
  );
}

// Tween a number from `from` to `to` over `duration`. Renders the formatted
// value via `format` (default: integer with comma separators).
// Reduced-motion: render `to` immediately.
function R4BCountUp({ to, from = 0, duration = 600, format, prefix = '', suffix = '' }) {
  const reduced = useReducedMotion();
  const fmt = format || ((n) => Math.round(n).toLocaleString());
  const [val, setVal] = React.useState(reduced ? to : from);
  React.useEffect(() => {
    if (reduced) { setVal(to); return undefined; }
    let raf = 0;
    const start = performance.now();
    const delta = to - from;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(from + delta * eased);
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [to, from, duration, reduced]);
  return <span className="r4f-count">{prefix}{fmt(val)}{suffix}</span>;
}

// Render `skeleton` for `swapAt` ms, then crossfade to `data`.
// Used by the per-tool loading→idle transition.
// Reduced-motion: render `data` immediately.
function R4BSkeletonToData({ skeleton, data, swapAt = 900 }) {
  ensureMotionStyles();
  const reduced = useReducedMotion();
  const [phase, setPhase] = React.useState(reduced ? 'data' : 'skel');
  React.useEffect(() => {
    if (reduced) { setPhase('data'); return undefined; }
    setPhase('skel');
    const t = window.setTimeout(() => setPhase('data'), swapAt);
    return () => window.clearTimeout(t);
  }, [swapAt, reduced]);
  return (
    <span className={`r4f-swap r4f-swap--${phase}`}>
      <span className="r4f-swap-layer r4f-swap-layer--skel" aria-hidden={phase !== 'skel'}>{skeleton}</span>
      <span className="r4f-swap-layer r4f-swap-layer--data" aria-hidden={phase !== 'data'}>{data}</span>
    </span>
  );
}

// Reveals `text` one word at a time with cascading opacity. Used by C-family
// draft-text blocks for entry. Reduced-motion: render full text immediately.
function R4BWordReveal({ text, perWordDelay = 18, duration = 320, onDone }) {
  ensureMotionStyles();
  const reduced = useReducedMotion();
  const words = React.useMemo(() => String(text || '').split(/(\s+)/), [text]);
  React.useEffect(() => {
    if (reduced) { if (onDone) onDone(); return undefined; }
    const total = words.length * perWordDelay + duration;
    const t = window.setTimeout(() => { if (onDone) onDone(); }, total + 24);
    return () => window.clearTimeout(t);
  }, [text, perWordDelay, duration, reduced, words.length, onDone]);
  if (reduced) return <span className="r4f-word-reveal">{text}</span>;
  let wordIdx = 0;
  return (
    <span className="r4f-word-reveal r4f-word-reveal--play">
      {words.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        const delay = wordIdx++ * perWordDelay;
        return (
          <span
            key={i}
            className="r4f-word"
            style={{ animationDelay: `${delay}ms`, animationDuration: `${duration}ms` }}
          >
            {tok}
          </span>
        );
      })}
    </span>
  );
}

function ensureMotionStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('r4f-motion-styles')) return;
  const style = document.createElement('style');
  style.id = 'r4f-motion-styles';
  style.textContent = `
    @keyframes r4f-bar-rise {
      from { opacity: 0; transform: translateY(6px) scaleY(0.85); transform-origin: bottom; }
      to   { opacity: 1; transform: translateY(0)  scaleY(1); }
    }
    @keyframes r4f-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes r4f-word-rise {
      from { opacity: 0; transform: translateY(2px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes r4f-donut-sweep-rot {
      from { transform: rotate(-90deg); }
      to   { transform: rotate(0deg); }
    }
    /* ─── Loading-loop keyframes (R4F polish v1) ─── */
    @keyframes r4f-stroke-loop {
      0%   { stroke-dashoffset: 100; opacity: 0.25; }
      40%  { stroke-dashoffset: 0;   opacity: 0.95; }
      75%  { stroke-dashoffset: 0;   opacity: 0.95; }
      100% { stroke-dashoffset: -100; opacity: 0.25; }
    }
    @keyframes r4f-scan-sweep {
      0%   { transform: translateX(-6%); opacity: 0; }
      8%   { opacity: 1; }
      92%  { opacity: 1; }
      100% { transform: translateX(106%); opacity: 0; }
    }
    @keyframes r4f-bar-pulse {
      0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
      50%      { transform: scaleY(1);   opacity: 0.95; }
    }
    @keyframes r4f-donut-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes r4f-tile-cascade {
      0%, 100% { opacity: 0.18; }
      50%      { opacity: 0.85; }
    }
    @keyframes r4f-progress-fill {
      0%   { transform: scaleX(0);    transform-origin: left center; }
      85%  { transform: scaleX(1);    transform-origin: left center; }
      90%  { transform: scaleX(1);    transform-origin: right center; }
      100% { transform: scaleX(0);    transform-origin: right center; }
    }
    @keyframes r4f-scatter-pop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 0.85; }
    }
    @keyframes r4f-text-stream {
      0%, 60%   { opacity: 0; transform: translateY(2px); }
      80%       { opacity: 0.95; transform: translateY(0); }
      100%      { opacity: 0; transform: translateY(-2px); }
    }
    @keyframes r4f-row-pulse {
      0%, 100% { opacity: 0.55; }
      50%      { opacity: 1; }
    }
    @keyframes r4f-stack-fill {
      0%, 100% { transform: scaleX(0.3); opacity: 0.5; }
      50%      { transform: scaleX(1);   opacity: 0.95; }
    }
    /* ─── Entrance choreographies (R4F polish v3) ─── */
    @keyframes r4f-entrance-cascade-down {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes r4f-entrance-fade-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes r4f-entrance-scale-pop {
      0%   { opacity: 0; transform: scale(0.96); }
      60%  { opacity: 1; transform: scale(1.01); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes r4f-entrance-draw-on {
      from { opacity: 0.4; }
      to   { opacity: 1; }
    }
    @keyframes r4f-entrance-count-up {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes r4f-entrance-type-in {
      from { opacity: 0; transform: translateY(2px); filter: blur(2px); }
      to   { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes r4f-entrance-scan-fill {
      from { opacity: 0; clip-path: inset(0 100% 0 0); }
      to   { opacity: 1; clip-path: inset(0 0 0 0); }
    }
    @keyframes r4f-entrance-slide-in-stack-l {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes r4f-entrance-slide-in-stack-r {
      from { opacity: 0; transform: translateX(10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .r4f-stagger { display: contents; }
    .r4f-stagger--play .r4f-stagger-item {
      display: inline-block;
      opacity: 0;
      animation-name: r4f-bar-rise;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(.2,.7,.3,1);
    }
    .r4f-donut-sweep:not(.r4f-donut-sweep--done) {
      animation-name: r4f-donut-sweep-rot;
      animation-timing-function: cubic-bezier(.4,0,.2,1);
      animation-fill-mode: both;
    }
    .r4f-count { font-variant-numeric: tabular-nums; }
    .r4f-swap { display: inline-block; position: relative; }
    .r4f-swap-layer { display: block; transition: opacity 280ms ease; }
    .r4f-swap-layer--skel { position: relative; opacity: 1; }
    .r4f-swap-layer--data { position: absolute; inset: 0; opacity: 0; pointer-events: none; }
    .r4f-swap--data .r4f-swap-layer--skel { opacity: 0; pointer-events: none; }
    .r4f-swap--data .r4f-swap-layer--data { position: relative; inset: auto; opacity: 1; pointer-events: auto; }
    .r4f-word-reveal { display: inline; }
    .r4f-word-reveal--play .r4f-word {
      display: inline-block;
      opacity: 0;
      animation-name: r4f-word-rise;
      animation-fill-mode: both;
      animation-timing-function: ease-out;
    }
    /* ─── Loop helper class hooks ─── */
    .r4f-loop-curve path { stroke-dasharray: 100; animation: r4f-stroke-loop 2400ms ease-in-out infinite; }
    .r4f-loop-curve path:nth-child(2) { animation-delay: 280ms; }
    .r4f-loop-curve path:nth-child(3) { animation-delay: 560ms; }
    .r4f-loop-scan-track { position: relative; overflow: hidden; }
    .r4f-loop-scan-bar {
      position: absolute; top: 0; bottom: 0; left: 0; width: 18%;
      background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent-primary) 18%, transparent) 50%, transparent 100%);
      animation: r4f-scan-sweep 1800ms cubic-bezier(.4,0,.2,1) infinite;
      pointer-events: none;
    }
    .r4f-loop-bars rect, .r4f-loop-bars-vert > span {
      transform-origin: bottom center;
      animation: r4f-bar-pulse 1400ms ease-in-out infinite;
    }
    .r4f-loop-donut { transform-origin: center; transform-box: fill-box; animation: r4f-donut-spin 2400ms linear infinite; }
    .r4f-loop-tile { animation: r4f-tile-cascade 1600ms ease-in-out infinite; }
    .r4f-loop-progress-bar { transform-origin: left center; animation: r4f-progress-fill 2200ms ease-in-out infinite; }
    .r4f-loop-scatter > * { animation: r4f-scatter-pop 1600ms ease-out infinite; }
    .r4f-loop-text > span { animation: r4f-text-stream 2400ms ease-in-out infinite; opacity: 0; }
    .r4f-loop-row { animation: r4f-row-pulse 1800ms ease-in-out infinite; }
    .r4f-loop-stack > span { transform-origin: left center; animation: r4f-stack-fill 1800ms ease-in-out infinite; }
    /* ─── Entrance class hooks ─── */
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] > .blk:not(.blk-lifecycle-panel) > *,
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] > .blk:not(.blk-lifecycle-panel) > * > * { will-change: opacity, transform; }
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] .blk-row,
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] [data-entry="row"] {
      animation: r4f-entrance-cascade-down 480ms cubic-bezier(.2,.7,.3,1) both;
    }
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] .blk-row:nth-child(1),
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] [data-entry="row"]:nth-child(1) { animation-delay: 0ms; }
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] .blk-row:nth-child(2),
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] [data-entry="row"]:nth-child(2) { animation-delay: 60ms; }
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] .blk-row:nth-child(3),
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] [data-entry="row"]:nth-child(3) { animation-delay: 120ms; }
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] .blk-row:nth-child(4),
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] [data-entry="row"]:nth-child(4) { animation-delay: 180ms; }
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] .blk-row:nth-child(5),
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] [data-entry="row"]:nth-child(5) { animation-delay: 240ms; }
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] .blk-row:nth-child(n+6),
    .blk-frame[data-animate-mount="1"][data-entrance="cascade-down"] [data-entry="row"]:nth-child(n+6) { animation-delay: 300ms; }
    .blk-frame[data-animate-mount="1"][data-entrance="fade-up"] > .blk:not(.blk-lifecycle-panel) {
      animation: r4f-entrance-fade-up 420ms cubic-bezier(.2,.7,.3,1) both;
    }
    .blk-frame[data-animate-mount="1"][data-entrance="scale-pop"] > .blk:not(.blk-lifecycle-panel) {
      animation: r4f-entrance-scale-pop 480ms cubic-bezier(.2,.7,.3,1) both;
    }
    .blk-frame[data-animate-mount="1"][data-entrance="draw-on"] > .blk:not(.blk-lifecycle-panel) {
      animation: r4f-entrance-draw-on 380ms ease-out both;
    }
    .blk-frame[data-animate-mount="1"][data-entrance="count-up-mount"] > .blk:not(.blk-lifecycle-panel) {
      animation: r4f-entrance-count-up 420ms cubic-bezier(.2,.7,.3,1) both;
    }
    .blk-frame[data-animate-mount="1"][data-entrance="type-in"] > .blk:not(.blk-lifecycle-panel) {
      animation: r4f-entrance-type-in 520ms cubic-bezier(.2,.7,.3,1) both;
    }
    .blk-frame[data-animate-mount="1"][data-entrance="scan-fill"] > .blk:not(.blk-lifecycle-panel) {
      animation: r4f-entrance-scan-fill 640ms cubic-bezier(.4,0,.2,1) both;
    }
    .blk-frame[data-animate-mount="1"][data-entrance="slide-in-stack"] > .blk:not(.blk-lifecycle-panel) > *:nth-child(odd) {
      animation: r4f-entrance-slide-in-stack-l 480ms cubic-bezier(.2,.7,.3,1) both;
    }
    .blk-frame[data-animate-mount="1"][data-entrance="slide-in-stack"] > .blk:not(.blk-lifecycle-panel) > *:nth-child(even) {
      animation: r4f-entrance-slide-in-stack-r 480ms cubic-bezier(.2,.7,.3,1) both;
      animation-delay: 80ms;
    }
    @media (prefers-reduced-motion: reduce) {
      .r4f-stagger--play .r4f-stagger-item,
      .r4f-donut-sweep,
      .r4f-word-reveal--play .r4f-word,
      .r4f-loop-curve path,
      .r4f-loop-scan-bar,
      .r4f-loop-bars rect, .r4f-loop-bars-vert > span,
      .r4f-loop-donut,
      .r4f-loop-tile,
      .r4f-loop-progress-bar,
      .r4f-loop-scatter > *,
      .r4f-loop-text > span,
      .r4f-loop-row,
      .r4f-loop-stack > span { animation: none !important; opacity: 0.7 !important; transform: none !important; }
      .blk-frame[data-animate-mount="1"][data-entrance] > .blk:not(.blk-lifecycle-panel),
      .blk-frame[data-animate-mount="1"][data-entrance] > .blk:not(.blk-lifecycle-panel) > *,
      .blk-frame[data-animate-mount="1"][data-entrance] [data-entry="row"] {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
        clip-path: none !important;
        filter: none !important;
      }
      .r4f-swap-layer { transition: none !important; }
    }
  `;
  document.head.appendChild(style);
}

// Tool-shape skeleton primitives — small composable pieces W2 arms and W3
// can drop into renderLoading callbacks. They stay visually neutral and
// inherit the existing blk-skel styling from hifi-r4-blocks-shared.jsx.
function R4FSkelLine({ width = '70%', height = 10, accent = false }) {
  return <span className="blk-skel" style={{ width, height, display: 'block' }} data-accent={accent ? '1' : '0'} />;
}
function R4FSkelBars({ count = 7, w = 100, h = 60 }) {
  ensureMotionStyles();
  const arr = Array.from({ length: count });
  return (
    <svg className="r4f-loop-bars" width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {arr.map((_, i) => {
        const bw = (w - count * 2) / count;
        const bh = 8 + (i % 4) * 10;
        return (
          <rect
            key={i}
            x={i * (bw + 2)}
            y={h - bh}
            width={bw}
            height={bh}
            fill="var(--surface-3)"
            opacity="0.85"
            style={{ animationDelay: `${(i % count) * 90}ms` }}
          />
        );
      })}
    </svg>
  );
}
function R4FSkelCurve({ w = 200, h = 60, count = 1, dashed = false, variant = 'default' }) {
  ensureMotionStyles();
  // Variant changes the path shape so retention vs growth vs delta vs forecast
  // are visually distinguishable even at skeleton stage.
  const buildPath = (idx) => {
    const yOff = idx * 10 - (count - 1) * 5;
    if (variant === 'retention') {
      // steep early drop, leveling off — classic retention curve
      return `M 0,${h * 0.18 + yOff} L ${w * 0.12},${h * 0.34 + yOff} L ${w * 0.28},${h * 0.52 + yOff} L ${w * 0.46},${h * 0.66 + yOff} L ${w * 0.66},${h * 0.74 + yOff} L ${w},${h * 0.78 + yOff}`;
    }
    if (variant === 'growth') {
      // monotonic rising
      return `M 0,${h * 0.82 + yOff} L ${w * 0.18},${h * 0.74 + yOff} L ${w * 0.36},${h * 0.6 + yOff} L ${w * 0.55},${h * 0.46 + yOff} L ${w * 0.74},${h * 0.32 + yOff} L ${w},${h * 0.18 + yOff}`;
    }
    if (variant === 'delta') {
      // first curve dips low, second rides high — overlay pair
      const sign = idx === 0 ? 1 : -1;
      return `M 0,${h * 0.5 + yOff} L ${w * 0.2},${h * (0.5 + 0.18 * sign)} L ${w * 0.4},${h * (0.5 - 0.1 * sign)} L ${w * 0.6},${h * (0.5 + 0.22 * sign)} L ${w * 0.8},${h * (0.5 - 0.04 * sign)} L ${w},${h * (0.5 + 0.12 * sign)}`;
    }
    if (variant === 'forecast') {
      // smooth gentle rise — used with dashed for forward projection
      return `M 0,${h * 0.7 + yOff} L ${w * 0.25},${h * 0.55 + yOff} L ${w * 0.5},${h * 0.45 + yOff} L ${w * 0.75},${h * 0.38 + yOff} L ${w},${h * 0.34 + yOff}`;
    }
    // default — gently undulating
    return `M 0,${h * 0.7 + yOff} L ${w * 0.18},${h * 0.55 + yOff} L ${w * 0.36},${h * 0.4 + yOff} L ${w * 0.55},${h * 0.5 + yOff} L ${w * 0.74},${h * 0.32 + yOff} L ${w},${h * 0.25 + yOff}`;
  };
  const paths = Array.from({ length: count }).map((_, i) => buildPath(i));
  const useDashed = dashed || variant === 'forecast';
  return (
    <svg className="r4f-loop-curve" width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }} data-variant={variant}>
      <line x1="0" x2={w} y1={h - 1} y2={h - 1} stroke="var(--border-subtle)" />
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={i === 0 ? 1.8 : 1.4}
          pathLength={100}
          strokeDasharray={useDashed ? '3 3' : '100'}
        />
      ))}
    </svg>
  );
}
function R4FSkelRows({ count = 4, gap = 8 }) {
  ensureMotionStyles();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="r4f-loop-row" style={{ display: 'flex', gap: 10, alignItems: 'center', animationDelay: `${i * 140}ms` }}>
          <span className="blk-skel" style={{ width: 24, height: 24, borderRadius: '50%' }} />
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="blk-skel" style={{ width: `${72 - i * 6}%`, height: 9 }} />
            <span className="blk-skel" style={{ width: `${42 + (i % 3) * 8}%`, height: 7, opacity: 0.65 }} />
          </span>
        </span>
      ))}
    </div>
  );
}
function R4FSkelTiles({ rows = 3, cols = 4, h = 22 }) {
  ensureMotionStyles();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          className="r4f-loop-tile blk-skel"
          style={{
            height: h,
            animationDelay: `${(i * 70) % 1200}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ─── New shape-specific looped skeletons (R4F polish v1) ──────────────────

function R4FSkelDonut({ size = 80, segments = 4 }) {
  ensureMotionStyles();
  // Three concentric arcs sweeping continuously.
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const arcs = Array.from({ length: segments }).map((_, i) => {
    const start = (i / segments) * Math.PI * 2;
    const end = start + (Math.PI * 2 / segments) * 0.7;
    const x0 = cx + r * Math.cos(start);
    const y0 = cy + r * Math.sin(start);
    const x1 = cx + r * Math.cos(end);
    const y1 = cy + r * Math.sin(end);
    const large = (end - start) > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  });
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g className="r4f-loop-donut" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {arcs.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="var(--surface-3)"
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.4 + (i / segments) * 0.5}
            />
          ))}
        </g>
        <circle cx={cx} cy={cy} r={size * 0.22} fill="var(--surface-1)" />
      </svg>
    </div>
  );
}

function R4FSkelScanCurve({ w = 200, h = 60, count = 1, dashed = false, variant = 'default' }) {
  ensureMotionStyles();
  return (
    <div className="r4f-loop-scan-track" style={{ position: 'relative', width: '100%', height: h }}>
      <R4FSkelCurve w={w} h={h} count={count} dashed={dashed} variant={variant} />
      <span className="r4f-loop-scan-bar" />
    </div>
  );
}

function R4FSkelHeatmap({ rows = 7, cols = 8, h = 18 }) {
  ensureMotionStyles();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2 }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const delay = (r * 90) + (c * 60);
        return (
          <span
            key={i}
            className="r4f-loop-tile"
            style={{
              height: h,
              background: 'var(--accent-primary)',
              opacity: 0.18,
              animationDelay: `${delay % 1800}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

function R4FSkelCohort({ size = 8, h = 16 }) {
  ensureMotionStyles();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size + 1}, 1fr)`, gap: 2 }}>
      {Array.from({ length: size }).map((_, row) => (
        <React.Fragment key={row}>
          <span className="mono" style={{ fontSize: 8, color: 'var(--fg-tertiary)', textAlign: 'right', paddingRight: 4, lineHeight: `${h}px` }}>W{row + 1}</span>
          {Array.from({ length: size }).map((_, col) => {
            const inCohort = col >= row;
            const delay = (row * 110) + (col * 80);
            return (
              <span
                key={col}
                className={inCohort ? 'r4f-loop-tile' : ''}
                style={{
                  height: h,
                  background: inCohort ? 'var(--accent-primary)' : 'var(--surface-2)',
                  opacity: inCohort ? 0.18 : 0.4,
                  animationDelay: inCohort ? `${delay % 2200}ms` : '0ms',
                }}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

function R4FSkelFunnel({ steps = 4, h = 16, gap = 6 }) {
  ensureMotionStyles();
  const widths = [100, 60, 28, 12, 6, 4];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: steps }).map((_, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: 8 }}>
          <span className="blk-skel" style={{ height: 8, width: '80%' }} />
          <span
            className="r4f-loop-progress-bar"
            style={{
              height: h,
              width: `${widths[i] || 6}%`,
              background: 'var(--surface-3)',
              opacity: 0.85,
              animationDelay: `${i * 220}ms`,
              animationDuration: '2400ms',
            }}
          />
        </div>
      ))}
    </div>
  );
}

function R4FSkelScatter({ w = 200, h = 100, count = 12 }) {
  ensureMotionStyles();
  // Pseudo-random but deterministic point placement.
  const pts = Array.from({ length: count }).map((_, i) => ({
    x: 18 + ((i * 17) % (w - 36)),
    y: 14 + ((i * 23) % (h - 28)),
    delay: (i * 130) % 1600,
  }));
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <line x1="14" y1="6" x2="14" y2={h - 8} stroke="var(--border-subtle)" />
      <line x1="14" y1={h - 8} x2={w - 4} y2={h - 8} stroke="var(--border-subtle)" />
      <g className="r4f-loop-scatter">
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="var(--surface-3)"
            opacity={0.85}
            style={{ animationDelay: `${p.delay}ms`, transformOrigin: `${p.x}px ${p.y}px`, transformBox: 'fill-box' }}
          />
        ))}
      </g>
    </svg>
  );
}

function R4FSkelTextStream({ lines = 3, perLineDelay = 700 }) {
  ensureMotionStyles();
  // Rolling 3-line text reveal — placeholder words each line cycles.
  return (
    <div className="r4f-loop-text" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            background: 'var(--surface-3)',
            height: 9,
            borderRadius: 2,
            width: `${88 - i * 12}%`,
            animationDelay: `${i * perLineDelay}ms`,
          }}
        />
      ))}
    </div>
  );
}

function R4FSkelProgress({ h = 14 }) {
  ensureMotionStyles();
  return (
    <div style={{ position: 'relative', height: h, background: 'var(--surface-2)', overflow: 'hidden', borderRadius: 2 }}>
      <span
        className="r4f-loop-progress-bar"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          background: 'var(--accent-primary)',
          opacity: 0.7,
        }}
      />
    </div>
  );
}

function R4FSkelProgressList({ count = 4, h = 10, gap = 8 }) {
  ensureMotionStyles();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 40px', alignItems: 'center', gap: 10 }}>
          <span className="blk-skel" style={{ height: 8, width: '85%' }} />
          <div style={{ position: 'relative', height: h, background: 'var(--surface-2)', overflow: 'hidden', borderRadius: 2 }}>
            <span
              className="r4f-loop-progress-bar"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                background: 'var(--surface-3)',
                opacity: 0.85,
                animationDelay: `${i * 280}ms`,
              }}
            />
          </div>
          <span className="blk-skel" style={{ height: 8, width: '70%' }} />
        </div>
      ))}
    </div>
  );
}

function R4FSkelStackBar({ h = 28 }) {
  ensureMotionStyles();
  // Channel split — 3 colored segments filling left to right.
  return (
    <div className="r4f-loop-stack" style={{ display: 'flex', height: h, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      <span style={{ flex: 64, background: 'var(--surface-3)', opacity: 0.85, animationDelay: '0ms' }} />
      <span style={{ flex: 26, background: 'var(--surface-3)', opacity: 0.65, animationDelay: '180ms' }} />
      <span style={{ flex: 10, background: 'var(--surface-3)', opacity: 0.45, animationDelay: '360ms' }} />
    </div>
  );
}

function R4FSkelComparePair({ rowsEach = 4 }) {
  ensureMotionStyles();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <R4FSkelRows count={rowsEach} gap={6} />
      <R4FSkelRows count={rowsEach} gap={6} />
    </div>
  );
}

// ─── R4F polish v3 — row sub-shapes (replaces generic rows-pulse) ────────
// Each primitive composes the same blk-skel atoms but in a layout that mirrors
// the actual block output shape. Continuous looping via .r4f-loop-row class.

// Comments / replies: round avatar + 2 text lines + sentiment pip on right.
function R4FSkelCommentRows({ count = 4, gap = 10 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-comment" style={{ display: 'grid', gap }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 140}ms`, display: 'grid', gridTemplateColumns: '20px 1fr 12px', gap: 10, alignItems: 'center' }}>
          <span className="blk-skel" style={{ width: 20, height: 20, borderRadius: '50%' }} />
          <span style={{ display: 'grid', gap: 4 }}>
            <span className="blk-skel" style={{ width: '74%', height: 8 }} />
            <span className="blk-skel" style={{ width: '52%', height: 8 }} />
          </span>
          <span className="blk-skel" style={{ width: 8, height: 8, borderRadius: '50%' }} data-accent="1" />
        </div>
      ))}
    </div>
  );
}

// DM thread: alternating message bubbles with timestamps.
function R4FSkelDmRows({ count = 4 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-dm" style={{ display: 'grid', gap: 10 }}>
      {rows.map((_, i) => {
        const incoming = i % 2 === 0;
        const widths = ['66%', '78%', '54%', '70%'];
        return (
          <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 160}ms`, display: 'flex', justifyContent: incoming ? 'flex-start' : 'flex-end' }}>
            <span style={{ display: 'grid', gap: 4, width: widths[i % widths.length] }}>
              <span className="blk-skel" style={{ width: '100%', height: 18, borderRadius: 10 }} data-accent={incoming ? '0' : '1'} />
              <span className="blk-skel" style={{ width: 32, height: 6, marginLeft: incoming ? 0 : 'auto' }} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Notifications: type-icon square + bold line + meta + status dot.
function R4FSkelNotifRows({ count = 4 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-notif" style={{ display: 'grid', gap: 8 }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 120}ms`, display: 'grid', gridTemplateColumns: '14px 1fr 8px', gap: 10, alignItems: 'center' }}>
          <span className="blk-skel" style={{ width: 14, height: 14, borderRadius: 3 }} data-accent="1" />
          <span style={{ display: 'grid', gap: 3 }}>
            <span className="blk-skel" style={{ width: ['64%', '80%', '56%', '72%'][i % 4], height: 9 }} />
            <span className="blk-skel" style={{ width: '36%', height: 6 }} />
          </span>
          <span className="blk-skel" style={{ width: 6, height: 6, borderRadius: '50%' }} />
        </div>
      ))}
    </div>
  );
}

// Fans / persona / overlap: avatar + name line + metric bar.
function R4FSkelFansRows({ count = 4 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-fans" style={{ display: 'grid', gap: 10 }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 130}ms`, display: 'grid', gridTemplateColumns: '24px 1fr 64px', gap: 12, alignItems: 'center' }}>
          <span className="blk-skel" style={{ width: 24, height: 24, borderRadius: '50%' }} data-accent={i === 0 ? '1' : '0'} />
          <span style={{ display: 'grid', gap: 3 }}>
            <span className="blk-skel" style={{ width: ['58%', '66%', '48%', '72%', '54%'][i % 5], height: 9 }} />
            <span className="blk-skel" style={{ width: '34%', height: 6 }} />
          </span>
          <span style={{ position: 'relative', height: 6, background: 'var(--surface-soft)', borderRadius: 4, overflow: 'hidden' }}>
            <span className="r4f-loop-progress-bar" style={{ position: 'absolute', inset: 0, background: 'var(--accent-primary)', animationDelay: `${i * 200}ms`, opacity: 0.55 }} />
          </span>
        </div>
      ))}
    </div>
  );
}

// Files: file-type tile + filename + path/size meta line.
function R4FSkelFileRows({ count = 3 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-file" style={{ display: 'grid', gap: 8 }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 110}ms`, display: 'grid', gridTemplateColumns: '22px 1fr 36px', gap: 10, alignItems: 'center' }}>
          <span className="blk-skel" style={{ width: 22, height: 26, borderRadius: 3 }} data-accent={i === 0 ? '1' : '0'} />
          <span style={{ display: 'grid', gap: 3 }}>
            <span className="blk-skel" style={{ width: ['64%', '78%', '56%', '70%'][i % 4], height: 10 }} />
            <span className="blk-skel mono" style={{ width: '44%', height: 7 }} />
          </span>
          <span className="blk-skel" style={{ width: 36, height: 7 }} />
        </div>
      ))}
    </div>
  );
}

// Search hits: favicon + title (bold) + url + 2-line snippet.
function R4FSkelSearchHitRows({ count = 4 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-hit" style={{ display: 'grid', gap: 12 }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 130}ms`, display: 'grid', gridTemplateColumns: '14px 1fr', gap: 10 }}>
          <span className="blk-skel" style={{ width: 14, height: 14, borderRadius: 3, marginTop: 3 }} />
          <span style={{ display: 'grid', gap: 4 }}>
            <span className="blk-skel" style={{ width: ['72%', '64%', '78%', '58%'][i % 4], height: 11 }} data-accent="1" />
            <span className="blk-skel mono" style={{ width: '48%', height: 7 }} />
            <span className="blk-skel" style={{ width: '92%', height: 7 }} />
            <span className="blk-skel" style={{ width: '76%', height: 7 }} />
          </span>
        </div>
      ))}
    </div>
  );
}

// Posts: thumbnail rect + title + metric chip.
function R4FSkelPostRows({ count = 3 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-post" style={{ display: 'grid', gap: 10 }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 140}ms`, display: 'grid', gridTemplateColumns: '34px 1fr 44px', gap: 12, alignItems: 'center' }}>
          <span className="blk-skel" style={{ width: 34, height: 44, borderRadius: 4 }} data-accent={i === 0 ? '1' : '0'} />
          <span style={{ display: 'grid', gap: 4 }}>
            <span className="blk-skel" style={{ width: ['74%', '62%', '80%', '58%', '70%'][i % 5], height: 10 }} />
            <span className="blk-skel" style={{ width: '46%', height: 7 }} />
            <span className="blk-skel mono" style={{ width: '32%', height: 6 }} />
          </span>
          <span className="blk-skel" style={{ width: 44, height: 16, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}

// Steps / queue / receipt: numbered badge + step text + status pip.
function R4FSkelStepRows({ count = 4 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-step" style={{ display: 'grid', gap: 8 }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 150}ms`, display: 'grid', gridTemplateColumns: '14px 1fr 14px', gap: 10, alignItems: 'center' }}>
          <span className="blk-skel mono" style={{ width: 14, height: 14, borderRadius: 3 }} data-accent={i < 2 ? '1' : '0'} />
          <span style={{ display: 'grid', gap: 3 }}>
            <span className="blk-skel" style={{ width: ['60%', '74%', '50%', '66%', '58%'][i % 5], height: 9 }} />
            <span className="blk-skel" style={{ width: '34%', height: 6 }} />
          </span>
          <span className="blk-skel" style={{ width: 8, height: 8, borderRadius: '50%' }} data-accent={i === 0 ? '1' : '0'} />
        </div>
      ))}
    </div>
  );
}

// Sources / citations: domain pill + claim line + 2-line excerpt.
function R4FSkelSourceRows({ count = 3 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-source" style={{ display: 'grid', gap: 12 }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 130}ms`, display: 'grid', gap: 5 }}>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className="blk-skel mono" style={{ width: 44, height: 12, borderRadius: 6 }} data-accent="1" />
            <span className="blk-skel" style={{ width: 28, height: 6 }} />
          </span>
          <span className="blk-skel" style={{ width: ['82%', '74%', '88%', '70%'][i % 4], height: 10 }} />
          <span className="blk-skel" style={{ width: '92%', height: 7 }} />
          <span className="blk-skel" style={{ width: '64%', height: 7 }} />
        </div>
      ))}
    </div>
  );
}

// Channels / connections: platform hex + handle + scope chips.
function R4FSkelChannelRows({ count = 3 }) {
  ensureMotionStyles();
  const rows = Array.from({ length: count });
  return (
    <div className="r4f-sub-channel" style={{ display: 'grid', gap: 8 }}>
      {rows.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 140}ms`, display: 'grid', gridTemplateColumns: '18px 1fr', gap: 10, alignItems: 'center' }}>
          <span className="blk-skel" style={{ width: 18, height: 18, clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)' }} data-accent={i === 0 ? '1' : '0'} />
          <span style={{ display: 'grid', gap: 4 }}>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="blk-skel" style={{ width: ['44%', '54%', '38%'][i % 3], height: 9 }} />
              <span className="blk-skel" style={{ width: 32, height: 12, borderRadius: 6 }} />
              <span className="blk-skel" style={{ width: 24, height: 12, borderRadius: 6 }} />
            </span>
            <span className="blk-skel mono" style={{ width: '34%', height: 6 }} />
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── R4F polish v3 — text sub-shapes (replaces generic text-stream) ──────

// Caption / description: paragraph with varied line widths and gap.
function R4FSkelCaptionStream({ lines = 4 }) {
  ensureMotionStyles();
  const widths = ['96%', '88%', '92%', '74%', '94%', '60%'];
  const items = Array.from({ length: lines });
  return (
    <div className="r4f-sub-caption r4f-loop-text" style={{ display: 'grid', gap: 6 }}>
      {items.map((_, i) => (
        <span key={i} style={{ display: 'block', animationDelay: `${i * 280}ms` }}>
          <span className="blk-skel" style={{ display: 'block', width: widths[i % widths.length], height: 9 }} />
        </span>
      ))}
    </div>
  );
}

// Hooks / titles: short staccato lines, varied widths max ~50% width each.
function R4FSkelHooksStream({ lines = 4 }) {
  ensureMotionStyles();
  const widths = ['44%', '58%', '36%', '62%', '50%'];
  const items = Array.from({ length: lines });
  return (
    <div className="r4f-sub-hooks r4f-loop-text" style={{ display: 'grid', gap: 8 }}>
      {items.map((_, i) => (
        <span key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', animationDelay: `${i * 320}ms` }}>
          <span className="blk-skel mono" style={{ width: 12, height: 8 }} data-accent="1" />
          <span className="blk-skel" style={{ flex: 'none', width: widths[i % widths.length], height: 11 }} data-accent={i === 0 ? '1' : '0'} />
        </span>
      ))}
    </div>
  );
}

// Outline / beat-sheet: numbered hierarchical list with indent.
function R4FSkelOutlineStream({ lines = 6 }) {
  ensureMotionStyles();
  const items = Array.from({ length: lines });
  return (
    <div className="r4f-sub-outline r4f-loop-text" style={{ display: 'grid', gap: 7 }}>
      {items.map((_, i) => {
        const indent = (i % 3 === 1) ? 14 : (i % 3 === 2) ? 28 : 0;
        const widths = ['72%', '62%', '54%', '80%', '60%', '68%'];
        return (
          <span key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', paddingLeft: indent, animationDelay: `${i * 240}ms` }}>
            <span className="blk-skel mono" style={{ width: 12, height: 8 }} data-accent="1" />
            <span className="blk-skel" style={{ flex: 'none', width: widths[i % widths.length], height: 9 }} />
          </span>
        );
      })}
    </div>
  );
}

// Reply / patch: small bubble with 2-3 lines.
function R4FSkelReplyStream({ lines = 3 }) {
  ensureMotionStyles();
  const widths = ['82%', '64%', '54%', '72%'];
  const items = Array.from({ length: lines });
  return (
    <div className="r4f-sub-reply r4f-loop-text" style={{ display: 'grid', gap: 5, padding: '10px 12px', borderRadius: 12, border: '1px dashed var(--rule-soft)', background: 'color-mix(in srgb, var(--surface-elevated) 50%, transparent)' }}>
      {items.map((_, i) => (
        <span key={i} style={{ display: 'block', animationDelay: `${i * 280}ms` }}>
          <span className="blk-skel" style={{ display: 'block', width: widths[i % widths.length], height: 9 }} />
        </span>
      ))}
    </div>
  );
}

// Quote: quoted block with " marks + citation line.
function R4FSkelQuoteStream({ lines = 2 }) {
  ensureMotionStyles();
  const widths = ['86%', '72%', '64%'];
  const items = Array.from({ length: lines });
  return (
    <div className="r4f-sub-quote r4f-loop-text" style={{ display: 'grid', gap: 6, paddingLeft: 12, borderLeft: '2px solid color-mix(in srgb, var(--accent-primary) 35%, transparent)' }}>
      {items.map((_, i) => (
        <span key={i} className="serif-it" style={{ display: 'block', animationDelay: `${i * 280}ms` }}>
          <span className="blk-skel" style={{ display: 'block', width: widths[i % widths.length], height: 11 }} />
        </span>
      ))}
      <span className="blk-skel mono" style={{ width: '36%', height: 7, marginTop: 2 }} />
    </div>
  );
}

// Transcript: [mm:ss] timestamp prefix + line.
function R4FSkelTranscriptStream({ lines = 3 }) {
  ensureMotionStyles();
  const widths = ['78%', '66%', '82%', '54%'];
  const items = Array.from({ length: lines });
  return (
    <div className="r4f-sub-transcript r4f-loop-text" style={{ display: 'grid', gap: 6 }}>
      {items.map((_, i) => (
        <span key={i} style={{ display: 'grid', gridTemplateColumns: '38px 1fr', gap: 8, alignItems: 'center', animationDelay: `${i * 320}ms` }}>
          <span className="blk-skel mono" style={{ width: 38, height: 8 }} data-accent="1" />
          <span className="blk-skel" style={{ width: widths[i % widths.length], height: 9 }} />
        </span>
      ))}
    </div>
  );
}

// Adapt: 3 mini-blocks side-by-side (multi-channel adaptation).
function R4FSkelAdaptStream({ blocks = 3 }) {
  ensureMotionStyles();
  const items = Array.from({ length: blocks });
  return (
    <div className="r4f-sub-adapt" style={{ display: 'grid', gridTemplateColumns: `repeat(${blocks}, 1fr)`, gap: 8 }}>
      {items.map((_, i) => (
        <div key={i} className="r4f-loop-row" style={{ animationDelay: `${i * 200}ms`, display: 'grid', gap: 4, padding: '8px 10px', border: '1px solid var(--rule-soft)', borderRadius: 8 }}>
          <span className="blk-skel mono" style={{ width: '46%', height: 7 }} data-accent="1" />
          <span className="blk-skel" style={{ width: '88%', height: 9 }} />
          <span className="blk-skel" style={{ width: '70%', height: 8 }} />
          <span className="blk-skel" style={{ width: '62%', height: 8 }} />
        </div>
      ))}
    </div>
  );
}

// Shape dispatcher — caller can pass a shape key instead of constructing
// a skeleton manually. Used by R4FToolLoading's `shape` prop.
function R4FSkel({ shape, ...props }) {
  switch (shape) {
    case 'curve-loop':       return <R4FSkelCurve {...props} />;
    case 'curve-scan':       return <R4FSkelScanCurve {...props} />;
    case 'bars-pulse':       return <R4FSkelBars {...props} />;
    case 'donut-spin':       return <R4FSkelDonut {...props} />;
    case 'heatmap-cascade':  return <R4FSkelHeatmap {...props} />;
    case 'cohort-fill':      return <R4FSkelCohort {...props} />;
    case 'funnel-stair':     return <R4FSkelFunnel {...props} />;
    case 'scatter-pop':      return <R4FSkelScatter {...props} />;
    case 'text-stream':      return <R4FSkelTextStream {...props} />;
    case 'progress-loop':    return <R4FSkelProgress {...props} />;
    case 'progress-list':    return <R4FSkelProgressList {...props} />;
    case 'tile-cascade':     return <R4FSkelTiles {...props} />;
    case 'rows-pulse':       return <R4FSkelRows {...props} />;
    case 'stack-fill':       return <R4FSkelStackBar {...props} />;
    case 'compare-pair':     return <R4FSkelComparePair {...props} />;
    // v3 row sub-shapes
    case 'comment-rows':     return <R4FSkelCommentRows {...props} />;
    case 'dm-rows':          return <R4FSkelDmRows {...props} />;
    case 'notif-rows':       return <R4FSkelNotifRows {...props} />;
    case 'fans-rows':        return <R4FSkelFansRows {...props} />;
    case 'file-rows':        return <R4FSkelFileRows {...props} />;
    case 'search-hit-rows':  return <R4FSkelSearchHitRows {...props} />;
    case 'post-rows':        return <R4FSkelPostRows {...props} />;
    case 'step-rows':        return <R4FSkelStepRows {...props} />;
    case 'source-rows':      return <R4FSkelSourceRows {...props} />;
    case 'channel-rows':     return <R4FSkelChannelRows {...props} />;
    // v3 text sub-shapes
    case 'caption-stream':   return <R4FSkelCaptionStream {...props} />;
    case 'hooks-stream':     return <R4FSkelHooksStream {...props} />;
    case 'outline-stream':   return <R4FSkelOutlineStream {...props} />;
    case 'reply-stream':     return <R4FSkelReplyStream {...props} />;
    case 'quote-stream':     return <R4FSkelQuoteStream {...props} />;
    case 'transcript-stream': return <R4FSkelTranscriptStream {...props} />;
    case 'adapt-stream':     return <R4FSkelAdaptStream {...props} />;
    default:                 return <R4FSkelRows {...(props.count ? props : { count: 3 })} />;
  }
}

// Per-tool empty / error containers. These are OPTIONAL — W2 arms can compose
// directly with Eyebrow + Icon + FooterChip if they prefer. They exist so
// repeated patterns (caption + body line + CTA chip) stay visually consistent.
function R4FToolEmpty({ id, eyebrow, body, ctas = [] }) {
  return (
    <div className="blk blk-lifecycle-panel" data-lifecycle="empty">
      {eyebrow && <Eyebrow left={eyebrow} right={id} />}
      <div className="blk-state-empty">
        <Icon name="circle" size={18} />
        <p className="serif-it">{body}</p>
      </div>
      <div className="blk-footer">
        {ctas.map((c, i) => (
          <FooterChip
            key={i}
            icon={c.icon || (i === 0 ? 'plus' : 'arrow-right')}
            label={c.label}
            accent={i === 0}
            muted={i > 0}
            onClick={c.onClick}
          />
        ))}
      </div>
    </div>
  );
}
function R4FToolError({ id, eyebrow, body, ctas = [] }) {
  return (
    <div className="blk blk-lifecycle-panel" data-lifecycle="error">
      {eyebrow && <Eyebrow left={eyebrow} right={id} />}
      <div className="blk-state-error">
        <Icon name="warning" size={18} />
        <p className="serif-it">{body}</p>
      </div>
      <div className="blk-footer">
        {ctas.map((c, i) => (
          <FooterChip
            key={i}
            icon={c.icon || (i === 0 ? 'retry' : 'arrow-right')}
            label={c.label}
            accent={i === 0}
            muted={i > 0}
            onClick={c.onClick}
          />
        ))}
      </div>
    </div>
  );
}
function R4FToolLoading({ id, eyebrow, caption, skeleton, shape, shapeProps, onCancel }) {
  // If a `shape` key is passed, dispatch to R4FSkel for a shape-specific
  // looped skeleton. Falls back to the explicit `skeleton` prop or rows.
  const body = skeleton || (shape ? <R4FSkel shape={shape} {...(shapeProps || {})} /> : <R4FSkelRows count={3} />);
  return (
    <div className="blk blk-lifecycle-panel" data-lifecycle="loading" data-loading-shape={shape || (skeleton ? 'custom' : 'rows-pulse')}>
      {eyebrow && <Eyebrow left={eyebrow} right={id} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {body}
        {caption && (
          <span className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>
            {caption}
          </span>
        )}
      </div>
      {onCancel && (
        <div className="blk-footer">
          <FooterChip icon="cross" label="Cancel" muted onClick={onCancel} />
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  useReducedMotion,
  R4BDrawPath,
  R4BStaggerBars,
  R4BSweepDonut,
  R4BCountUp,
  R4BSkeletonToData,
  R4BWordReveal,
  R4FSkel,
  R4FSkelDonut,
  R4FSkelScanCurve,
  R4FSkelHeatmap,
  R4FSkelCohort,
  R4FSkelFunnel,
  R4FSkelScatter,
  R4FSkelTextStream,
  R4FSkelProgress,
  R4FSkelProgressList,
  R4FSkelStackBar,
  R4FSkelComparePair,
  R4FSkelLine,
  R4FSkelBars,
  R4FSkelCurve,
  R4FSkelRows,
  R4FSkelTiles,
  // v3 row sub-shapes
  R4FSkelCommentRows,
  R4FSkelDmRows,
  R4FSkelNotifRows,
  R4FSkelFansRows,
  R4FSkelFileRows,
  R4FSkelSearchHitRows,
  R4FSkelPostRows,
  R4FSkelStepRows,
  R4FSkelSourceRows,
  R4FSkelChannelRows,
  // v3 text sub-shapes
  R4FSkelCaptionStream,
  R4FSkelHooksStream,
  R4FSkelOutlineStream,
  R4FSkelReplyStream,
  R4FSkelQuoteStream,
  R4FSkelTranscriptStream,
  R4FSkelAdaptStream,
  R4FToolEmpty,
  R4FToolError,
  R4FToolLoading,
});
