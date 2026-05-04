/* global React, window, document, Icon, getBlockMeta, Eyebrow, R4BDataEntryState, R4BLatencySteps */
/* hifi-r4-chat-demo-primitives.jsx — Claude Design chat choreography, master-safe. */

function ensureR4BDemoStyles() {
  if (typeof document === 'undefined' || document.getElementById('r4bd-demo-styles')) return;
  const style = document.createElement('style');
  style.id = 'r4bd-demo-styles';
  style.textContent = `
    @keyframes r4bd-word-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes r4bd-caret-blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
    @keyframes r4bd-materialize { from { opacity: 0; transform: scale(0.985); } to { opacity: 1; transform: scale(1); } }
    @keyframes r4bd-skel { 0%, 100% { background: var(--surface-2); } 50% { background: var(--surface-3); } }
    @keyframes r4bd-sweep { from { transform: translateX(-100%); } to { transform: translateX(0); } }
    @keyframes r4bd-save-flash { 0% { border-color: var(--border-subtle); box-shadow: 0 0 0 0 rgba(90,55,31,0); } 30% { border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-soft); } 100% { border-color: var(--border-subtle); box-shadow: 0 0 0 0 rgba(90,55,31,0); } }
    .r4bd-word { display: inline-block; white-space: pre; animation: r4bd-word-in 220ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .r4bd-caret { display: inline-block; width: 1px; height: 1.05em; margin-left: 2px; background: var(--accent-primary); vertical-align: -2px; animation: r4bd-caret-blink 1s steps(1, end) infinite; }
    .r4bd-materialize { animation: r4bd-materialize 220ms cubic-bezier(0.2, 0.7, 0.2, 1) both; transform-origin: center top; }
    .r4bd-save-flash, .r4bd-block-shell.r4bd-save-flash .blk { animation: r4bd-save-flash 480ms ease-out both; }
    .r4bd-control-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .r4bd-control-btn, .r4bd-speed-btn { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: 999px; background: var(--surface-1); color: var(--fg-secondary); font-family: var(--font-sans); font-size: 11.5px; font-weight: 600; cursor: pointer; transition: background 100ms ease, color 100ms ease, border-color 100ms ease, transform 100ms ease; }
    .r4bd-control-btn:hover, .r4bd-speed-btn:hover { background: var(--surface-2); color: var(--fg-primary); border-color: var(--border-strong); }
    .r4bd-control-btn:active, .r4bd-speed-btn:active { transform: scale(0.98); }
    .r4bd-control-btn.primary { background: var(--fg-primary); color: var(--bg-base); border-color: var(--fg-primary); }
    .r4bd-speed-group { display: inline-flex; align-items: center; gap: 2px; padding: 2px; border: 1px solid var(--border-subtle); border-radius: 999px; background: var(--surface-2); }
    .r4bd-speed-btn { height: 22px; padding: 0 8px; border: 0; background: transparent; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; }
    .r4bd-speed-btn[data-active="1"] { background: var(--fg-primary); color: var(--bg-base); }
    .r4bd-step-meter { font-family: var(--font-mono); font-size: 10px; color: var(--fg-tertiary); letter-spacing: 0.08em; text-transform: uppercase; }
    .r4bd-composer { position: relative; width: 100%; max-width: 760px; padding-bottom: 4px; }
    .r4bd-composer-eyebrow { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 4px 6px; }
    .r4bd-eyebrow-btn { display: inline-flex; align-items: center; gap: 5px; border: 0; background: transparent; color: var(--accent-primary); font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
    .r4bd-model-cluster { display: inline-flex; align-items: center; height: 22px; border-radius: 999px; background: var(--surface-2); overflow: hidden; flex-shrink: 0; }
    .r4bd-model-cluster button { height: 100%; border: 0; background: transparent; padding: 0 8px; color: var(--fg-secondary); font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .r4bd-model-cluster button[data-active="1"] { background: var(--accent-primary); color: var(--fg-on-accent); }
    .r4bd-composer-bar { position: relative; display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 0 4px; border-bottom: 2px solid var(--accent-primary); }
    .r4bd-add-pill { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 11px 0 9px; border: 0; border-radius: 999px; background: var(--surface-2); color: var(--fg-secondary); font-family: var(--font-mono); font-size: 10px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; flex-shrink: 0; }
    .r4bd-composer textarea { position: relative; z-index: 1; flex: 1; width: 100%; min-height: 38px; max-height: 112px; padding: 8px 0; border: 0; outline: none; resize: none; background: transparent; color: var(--fg-primary); font-family: var(--font-serif); font-size: 16.5px; line-height: 1.4; }
    .r4bd-composer textarea::placeholder { color: var(--fg-tertiary); font-style: italic; }
    .r4bd-send-btn { width: 30px; height: 30px; border: 0; border-radius: 999px; background: var(--accent-primary); color: var(--fg-on-accent); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background 100ms ease, transform 100ms ease; flex-shrink: 0; }
    .r4bd-send-btn:hover { background: var(--accent-primary-hover); }
    .r4bd-send-btn:active { transform: scale(0.96); }
    .r4bd-send-btn[disabled] { background: var(--surface-2); color: var(--fg-tertiary); cursor: default; }
    .r4bd-composer[data-sending="1"] .r4bd-send-btn:not([disabled]) { background: var(--accent-primary-hover); animation: r4bd-send-pulse 900ms ease-in-out infinite; }
    .r4bd-composer-banner { display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
    .r4bd-composer-banner[data-kind="queued"] { background: var(--surface-2); color: var(--fg-secondary); border-bottom: 1px solid var(--border-subtle); }
    .r4bd-composer-banner[data-kind="queued"] span { display: inline-flex; align-items: center; gap: 6px; }
    .r4bd-composer-banner[data-kind="queued"] button { background: transparent; border: 0; color: var(--fg-secondary); font-family: inherit; font-size: inherit; cursor: pointer; padding: 0; text-transform: uppercase; }
    .r4bd-composer-banner[data-kind="queued"] button:hover { color: var(--fg-primary); }
    .r4bd-composer-banner[data-kind="error"] { background: color-mix(in srgb, var(--tone-danger) 8%, transparent); color: var(--tone-danger); border-bottom: 1px solid color-mix(in srgb, var(--tone-danger) 24%, transparent); }
    .r4bd-composer-banner[data-kind="error"] span { display: inline-flex; align-items: center; gap: 6px; }
    @keyframes r4bd-send-pulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-primary) 40%, transparent); } 50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent-primary) 0%, transparent); } }
    @media (prefers-reduced-motion: reduce) { .r4bd-composer[data-sending="1"] .r4bd-send-btn { animation: none !important; } }
    .r4bd-pop { position: absolute; bottom: calc(100% + 8px); width: 308px; z-index: 8; background: var(--surface-1); border: 1px solid var(--border-default); border-radius: 10px; padding: 10px 0 6px; box-shadow: var(--shadow-soft, 0 14px 30px rgba(37, 28, 20, 0.12)); animation: r4bd-materialize 140ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .r4bd-pop.right { right: 0; } .r4bd-pop.left { left: 0; }
    .r4bd-pop-label { display: block; padding: 0 13px 8px; font-family: var(--font-mono); font-size: 9.5px; color: var(--fg-tertiary); font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    .r4bd-pop button { width: 100%; display: flex; align-items: center; gap: 9px; border: 0; background: transparent; padding: 8px 13px; color: var(--fg-primary); text-align: left; cursor: pointer; }
    .r4bd-pop button:hover { background: var(--surface-2); }
    .r4bd-pop-check { width: 14px; height: 14px; border-radius: 4px; border: 1px solid var(--border-default); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .r4bd-pop-check[data-active="1"] { background: var(--accent-primary); color: var(--fg-on-accent); border-color: var(--accent-primary); }
    .r4bd-pop-title { flex: 1; font-family: var(--font-sans); font-size: 12.5px; font-weight: 600; }
    .r4bd-pop-meta { font-family: var(--font-mono); font-size: 9.5px; color: var(--fg-tertiary); text-transform: uppercase; }
    .r4bd-trail { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; min-height: 28px; padding: 0 10px; border: 1px solid var(--border-subtle); border-radius: 999px; background: var(--surface-2); color: var(--fg-secondary); font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    .r4bd-trail-pulse { width: 8px; height: 8px; border-radius: 999px; background: var(--accent-primary); animation: r4bd-skel 900ms ease-in-out infinite; flex-shrink: 0; }
    .r4bd-tool { border: 1px solid var(--border-subtle); border-radius: 8px; background: var(--surface-1); padding: 12px 14px 0; overflow: hidden; animation: r4bd-materialize 220ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .r4bd-tool-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 10px; font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-secondary); }
    .r4bd-tool-status { display: inline-flex; align-items: center; gap: 7px; color: var(--accent-primary); }
    .r4bd-tool-skel { display: flex; flex-direction: column; gap: 8px; padding-bottom: 13px; }
    .r4bd-tool-skel span { height: 8px; border-radius: 3px; background: var(--surface-2); animation: r4bd-skel 1.2s ease-in-out infinite; }
    .r4bd-tool-skel span:nth-child(1) { width: 88%; } .r4bd-tool-skel span:nth-child(2) { width: 64%; } .r4bd-tool-skel span:nth-child(3) { width: 100%; height: 54px; border-radius: 6px; } .r4bd-tool-skel span:nth-child(4) { width: 40%; }
    .r4bd-tool-skel-chart, .r4bd-tool-skel-list, .r4bd-tool-skel-text { padding-bottom: 13px; }
    .r4bd-tool-skel-chart svg path { animation: r4bd-skel-stroke 1.4s ease-in-out infinite; }
    .r4bd-tool-skel-list { display: flex; flex-direction: column; gap: 6px; }
    .r4bd-trail-label { display: inline-block; animation: r4bd-fade 280ms ease-out; }
    @keyframes r4bd-fade { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes r4bd-skel-stroke { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      .r4bd-trail-label, .r4bd-tool-skel-chart svg path { animation: none !important; opacity: 1 !important; transform: none !important; }
    }
    .r4bd-tool-sweep { height: 1px; margin: 0 -14px; background: var(--border-subtle); overflow: hidden; }
    .r4bd-tool-sweep i { display: block; height: 100%; background: var(--accent-primary); transform: translateX(-100%); animation: r4bd-sweep 1300ms linear infinite; }
    .r4bd-tool.done { padding-bottom: 11px; }
    .r4bd-tool.done .r4bd-tool-head { margin-bottom: 0; }
    .r4bd-thread-demo { padding: 26px 42px 40px; max-width: 1180px; margin: 0 auto; min-height: 100%; display: flex; flex-direction: column; gap: 18px; }
    .r4bd-thread-head { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: end; padding-bottom: 18px; border-bottom: 3px solid var(--fg-primary); }
    .r4bd-thread-head h1 { margin: 0; font-family: var(--font-serif); font-style: italic; font-size: 46px; font-weight: 600; letter-spacing: -0.035em; line-height: 0.98; }
    .r4bd-thread-head p { margin: 8px 0 0; max-width: 650px; font-family: var(--font-serif); font-style: italic; color: var(--fg-secondary); line-height: 1.45; }
    .r4bd-thread-panel { border: 1px solid var(--border-subtle); border-radius: 10px; background: color-mix(in srgb, var(--surface-1) 82%, var(--bg-base)); overflow: hidden; display: flex; flex-direction: column; min-height: 560px; height: clamp(560px, calc(100vh - 235px), 720px); }
    .r4bd-thread-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 14px 16px; border-bottom: 1px solid var(--border-subtle); background: var(--surface-1); }
    .r4bd-thread-meta { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .r4bd-thread-title { font-family: var(--font-serif); font-style: italic; font-size: 18px; font-weight: 600; letter-spacing: -0.015em; color: var(--fg-primary); }
    .r4bd-thread-sub { font-family: var(--font-mono); font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4bd-thread-scroll { flex: 1; min-height: 0; overflow: auto; padding: 0 26px 18px; scroll-behavior: smooth; }
    .r4bd-turn { display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 18px; padding: 16px 0; border-bottom: 1px solid var(--border-subtle); }
    .r4bd-turn:last-child { border-bottom: 0; }
    .r4bd-turn-role { position: relative; padding-top: 3px; font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4bd-turn-role::after { content: ""; position: absolute; right: -6px; top: 9px; width: 8px; height: 1px; background: var(--fg-tertiary); }
    .r4bd-turn[data-role="Coopr"] .r4bd-turn-role { color: var(--accent-primary); }
    .r4bd-turn[data-role="Coopr"] .r4bd-turn-role::after { background: var(--accent-primary); }
    .r4bd-turn-body { min-width: 0; display: flex; flex-direction: column; gap: 11px; }
    .r4bd-turn-copy { margin: 0; font-family: var(--font-serif); font-style: italic; font-size: 16px; line-height: 1.5; color: var(--fg-secondary); }
    .r4bd-turn-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 16px; align-items: start; }
    .r4bd-turn-grid[data-mode="single"] { grid-template-columns: repeat(12, minmax(0, 1fr)); max-width: 760px; }
    .r4bd-turn-grid[data-mode="stack"] { grid-template-columns: repeat(6, minmax(0, 1fr)); max-width: 780px; }
    .r4bd-turn-grid[data-mode="compare"] { grid-template-columns: repeat(12, minmax(0, 1fr)); max-width: 860px; }
    .r4bd-turn-grid[data-mode="grid"] { grid-template-columns: repeat(12, minmax(0, 1fr)); max-width: 920px; }
    .r4bd-turn-grid[data-mode="single"] .r4bd-block-shell, .r4bd-turn-grid[data-mode="stack"] .r4bd-block-shell { grid-column: 1 / -1; }
    .r4bd-block-shell { animation: r4bd-materialize 220ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .r4bd-block-shell .blk-footer { gap: 5px; padding-top: 7px; }
    .r4bd-block-shell .blk-footer .blk-chip[data-kind="discard"], .r4bd-block-shell .blk-footer .blk-chip[data-kind="more"] { display: none; }
    .r4bd-block-shell .blk-chip { max-width: 190px; min-width: 0; overflow: hidden; }
    .r4bd-block-shell .blk-chip span:not(.blk-chip-spinner) { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .r4bd-chip-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px; }
    .r4bd-action-chip { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border-radius: 999px; border: 1px solid var(--border-default); background: var(--surface-1); color: var(--fg-primary); font-family: var(--font-sans); font-size: 11.5px; font-weight: 600; cursor: pointer; }
    .r4bd-action-chip:hover { background: var(--surface-2); border-color: var(--border-strong); }
    .r4bd-action-chip[data-saved="1"] { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; }
    .r4bd-action-chip[data-branch-open="1"] { background: var(--fg-primary); color: var(--bg-base); border-color: var(--fg-primary); }
    .r4bd-branch-panel { max-width: 780px; border: 1px solid var(--border-subtle); border-radius: 9px; background: color-mix(in srgb, var(--surface-1) 86%, var(--accent-soft)); padding: 12px; display: flex; flex-direction: column; gap: 10px; animation: r4bd-materialize 180ms cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    .r4bd-branch-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-bottom: 7px; border-bottom: 1px solid var(--border-subtle); }
    .r4bd-branch-title { font-family: var(--font-serif); font-style: italic; font-size: 15px; font-weight: 700; color: var(--fg-primary); letter-spacing: -0.01em; }
    .r4bd-branch-kicker { font-family: var(--font-mono); font-size: 9px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4bd-compose-dock { padding: 14px 18px 16px; border-top: 1px solid var(--border-subtle); background: var(--surface-1); display: flex; justify-content: center; }
    @media (max-width: 900px) { .r4bd-thread-demo { padding: 24px 18px 48px; } .r4bd-thread-head { grid-template-columns: 1fr; } .r4bd-thread-panel { height: auto; min-height: 620px; } .r4bd-thread-toolbar { align-items: flex-start; flex-direction: column; } .r4bd-thread-scroll { padding: 0 16px 16px; } .r4bd-turn { grid-template-columns: 1fr; gap: 8px; } .r4bd-turn-role::after { display: none; } .r4bd-turn-grid, .r4bd-turn-grid[data-mode] { grid-template-columns: repeat(6, minmax(0, 1fr)); max-width: none; } }
  `;
  document.head.appendChild(style);
}

ensureR4BDemoStyles();

function r4bTokenize(src) {
  const out = [];
  const re = /\{\{(NUM|EM|ACC):([^}]+)\}\}|\s+|[^\s{]+/g;
  let m;
  while ((m = re.exec(src || ''))) {
    const tok = m[0];
    if (/^\s+$/.test(tok)) { out.push({ kind: 'space', text: tok }); continue; }
    if (m[1] === 'NUM') {
      const [value, mod] = m[2].split('|');
      out.push({ kind: 'num', text: value, accent: mod === 'accent' });
      continue;
    }
    if (m[1] === 'EM') { out.push({ kind: 'em', text: m[2] }); continue; }
    if (m[1] === 'ACC') { out.push({ kind: 'em', text: m[2], accent: true }); continue; }
    out.push({ kind: 'word', text: tok });
  }
  return out;
}

function R4BToken({ atom, animated, index }) {
  const style = animated ? { animationDelay: `${Math.min(index * 18, 360)}ms` } : null;
  if (atom.kind === 'space') return <span>{atom.text}</span>;
  if (atom.kind === 'num') return <span className={animated ? 'r4bd-word num' : 'num'} style={{ ...style, fontFamily: 'var(--font-mono)', fontWeight: 700, color: atom.accent ? 'var(--accent-primary)' : 'inherit' }}>{atom.text}</span>;
  if (atom.kind === 'em') return <span className={animated ? 'r4bd-word' : ''} style={{ ...style, fontWeight: 700, color: atom.accent ? 'var(--accent-primary)' : 'inherit' }}>{atom.text}</span>;
  return <span className={animated ? 'r4bd-word' : ''} style={style}>{atom.text}</span>;
}

function R4BStreamingText({ text, active = false, paused = false, speed = 1, onDone }) {
  const atoms = React.useMemo(() => r4bTokenize(text), [text]);
  const [count, setCount] = React.useState(active ? 0 : atoms.length);
  const doneRef = React.useRef(false);

  React.useEffect(() => {
    doneRef.current = false;
    setCount(active ? 0 : atoms.length);
  }, [active, atoms.length, text]);

  React.useEffect(() => {
    if (!active || paused || count >= atoms.length) {
      if (active && count >= atoms.length && !doneRef.current) {
        doneRef.current = true;
        if (onDone) onDone();
      }
      return undefined;
    }
    const atom = atoms[count];
    const delay = atom && atom.kind === 'space' ? 4 : Math.max(8, 34 / speed);
    const id = window.setTimeout(() => setCount(v => Math.min(atoms.length, v + 1)), delay);
    return () => window.clearTimeout(id);
  }, [active, paused, count, atoms, speed, onDone]);

  const visible = atoms.slice(0, count);
  const streaming = active && count < atoms.length;
  return (
    <>
      {visible.map((atom, index) => <R4BToken key={index} atom={atom} index={index} animated={active} />)}
      {streaming && <span className="r4bd-caret" />}
    </>
  );
}

function R4BReasoningTrail({ steps = [], active = false, complete = false }) {
  const [idx, setIdx] = React.useState(0);
  const reduced = typeof window !== 'undefined' && window.useReducedMotion ? window.useReducedMotion() : false;
  React.useEffect(() => {
    if (!active) { setIdx(0); return undefined; }
    const id = window.setInterval(() => setIdx(i => (i + 1) % Math.max(1, steps.length)), reduced ? 1100 : 520);
    return () => window.clearInterval(id);
  }, [active, steps.length, reduced]);
  if (!active && !complete) return null;
  const totalSources = steps.reduce((sum, step) => sum + (step.sources || 0), 0);
  const current = steps[idx] || steps[0] || { label: 'Reading context' };
  return (
    <div className="r4bd-trail" data-active={active ? '1' : '0'}>
      {complete ? <Icon name="check" size={10} /> : <span className="r4bd-trail-pulse" />}
      <span key={idx} className="r4bd-trail-label">{complete ? `Reasoned · ${totalSources} sources` : current.label}</span>
      {active && current.detail && <span key={`d-${idx}`} className="r4bd-trail-label" style={{ color: 'var(--fg-tertiary)' }}>· {current.detail}</span>}
    </div>
  );
}

// Pick a skeleton shape based on the tool name. Tools that produce charts get
// a curve skeleton, tools that produce lists get row skeletons, the rest get
// the original 4-bar shimmer. Keeps the running state visually honest.
function r4bToolSkeletonShape(name) {
  const n = String(name || '').toLowerCase();
  if (/(retention|forecast|curve|trend|sparkline|growth|histogram|heatmap|scatter|cohort)/.test(n)) return 'chart';
  if (/(search|comments|inbox|references|posts|library|results|fans|segment|queue|notifications|reels|peers|sources|citations)/.test(n)) return 'list';
  if (/(draft|caption|hook|outline|script|reply|description|brief)/.test(n)) return 'text';
  return 'bars';
}

function R4BToolRun({ name, target, active = false, complete = false, steps = [] }) {
  if (!active && !complete) return null;
  if (complete) {
    return (
      <div className="r4bd-tool done">
        <div className="r4bd-tool-head">
          <span className="r4bd-tool-status"><Icon name="check" size={10} />Ready · {name}</span>
          <span>{target}</span>
        </div>
        {steps.length > 0 && window.R4BLatencySteps && (
          <div style={{ marginTop: 10 }}>
            <R4BLatencySteps steps={steps} complete compact />
          </div>
        )}
      </div>
    );
  }
  const shape = r4bToolSkeletonShape(name);
  let skel;
  if (shape === 'chart') skel = <div className="r4bd-tool-skel-chart"><svg width="100%" height="34" viewBox="0 0 200 34" preserveAspectRatio="none"><path d="M 0,28 L 30,22 L 60,16 L 90,18 L 130,10 L 170,8 L 200,4" fill="none" stroke="var(--surface-3)" strokeWidth="1.6" /></svg></div>;
  else if (shape === 'list') skel = <div className="r4bd-tool-skel-list">{[0, 1, 2].map(i => (<span key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span className="blk-skel" style={{ width: 14, height: 14, borderRadius: '50%' }} /><span className="blk-skel" style={{ flex: 1, height: 7 }} /></span>))}</div>;
  else if (shape === 'text') skel = <div className="r4bd-tool-skel-text"><span className="blk-skel" style={{ width: '92%', height: 8, display: 'block', marginBottom: 4 }} /><span className="blk-skel" style={{ width: '78%', height: 8, display: 'block', marginBottom: 4 }} /><span className="blk-skel" style={{ width: '60%', height: 8, display: 'block' }} /></div>;
  else skel = <div className="r4bd-tool-skel"><span /><span /><span /><span /></div>;
  return (
    <div className="r4bd-tool" data-skel-shape={shape}>
      <div className="r4bd-tool-head">
        <span className="r4bd-tool-status"><span className="r4bd-trail-pulse" />Running · {name}</span>
        <span>{target}</span>
      </div>
      {skel}
      {steps.length > 0 && window.R4BLatencySteps && (
        <div style={{ paddingBottom: 12 }}>
          <R4BLatencySteps steps={steps} active compact />
        </div>
      )}
      <div className="r4bd-tool-sweep"><i /></div>
    </div>
  );
}

function R4BDemoControls({ status, step, total, speed, onPlay, onPause, onStep, onRestart, onSpeed }) {
  const isPlaying = status === 'playing';
  return (
    <div className="r4bd-control-row" data-demo-status={status}>
      {isPlaying ? (
        <button type="button" className="r4bd-control-btn primary" data-demo-control="pause" onClick={onPause}><Icon name="pause" />Pause</button>
      ) : (
        <button type="button" className="r4bd-control-btn primary" data-demo-control="play" onClick={onPlay}><Icon name="play" />Play</button>
      )}
      <button type="button" className="r4bd-control-btn" data-demo-control="step" onClick={onStep}><Icon name="step" />Step</button>
      <button type="button" className="r4bd-control-btn" data-demo-control="restart" onClick={onRestart}><Icon name="retry" />Restart</button>
      <span className="r4bd-speed-group" aria-label="Playback speed">
        {[1, 2, 4].map(v => (
          <button key={v} type="button" className="r4bd-speed-btn" data-active={speed === v ? '1' : '0'} onClick={() => onSpeed(v)}>{v}x</button>
        ))}
      </span>
      <span className="r4bd-step-meter"><span className="num">{Math.min(step, total)}</span> / <span className="num">{total}</span> events</span>
    </div>
  );
}

function R4BBeatBlocks(beat) {
  return (beat.blockGroups || []).flatMap(group => group.ids || []);
}

function R4BMakeEvents(beats) {
  const events = [];
  (beats || []).forEach((beat, turnIndex) => {
    events.push({ turnIndex, type: 'copy' });
    if (beat.entryState) events.push({ turnIndex, type: 'entry' });
    if (beat.latencySteps) events.push({ turnIndex, type: 'latency' });
    if (beat.reasoningSteps) events.push({ turnIndex, type: 'reasoning' });
    if (beat.beforeText) events.push({ turnIndex, type: 'before' });
    if (beat.tool) events.push({ turnIndex, type: 'tool' });
    (beat.blockGroups || []).forEach((group, groupIndex) => {
      events.push({ turnIndex, type: 'group', groupIndex });
    });
    if (beat.afterText) events.push({ turnIndex, type: 'after' });
    if (beat.chips) events.push({ turnIndex, type: 'chips' });
  });
  return events;
}

function R4BBeatState(turnIndex, step, status, events) {
  const visible = { copy: false, entry: false, latency: false, reasoning: false, before: false, tool: false, groups: [], after: false, chips: false };
  const allEvents = events || [];
  for (let i = 0; i < Math.min(step, allEvents.length); i++) {
    const event = allEvents[i];
    if (event.turnIndex !== turnIndex) continue;
    if (event.type === 'group') visible.groups[event.groupIndex] = true;
    else visible[event.type] = true;
  }
  const active = status === 'playing' ? allEvents[Math.max(0, step - 1)] : null;
  const activeForTurn = active && active.turnIndex === turnIndex ? active : null;
  return {
    ...visible,
    activeType: activeForTurn ? activeForTurn.type : null,
    activeGroup: activeForTurn && activeForTurn.type === 'group' ? activeForTurn.groupIndex : -1,
  };
}

function R4BBlockMount({ id, active }) {
  const meta = getBlockMeta && getBlockMeta(id);
  const Comp = meta ? meta.component || window[meta.componentName] : window['HF_R4B_' + id];
  const span = meta && meta.span ? meta.span : 4;
  if (!Comp) {
    return (
      <div className={`r4bd-block-shell cell-${span}`} data-demo-block-id={id}>
        <div className="blk-frame">
          <div className="blk">
            <Eyebrow left="FIG · MISSING BLOCK" right={id} />
            <p className="serif-it" style={{ margin: 0 }}>Block not registered.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`r4bd-block-shell cell-${span}${active ? ' r4bd-save-flash' : ''}`} data-demo-block-id={id}>
      <Comp />
    </div>
  );
}

function R4BChipItem(raw, index) {
  if (typeof raw === 'string') return { label: raw, key: raw.toLowerCase().replace(/\s+/g, '-'), index };
  const label = raw.label || raw.title || `Action ${index + 1}`;
  return { ...raw, label, key: raw.key || raw.id || label.toLowerCase().replace(/\s+/g, '-'), index };
}

function R4BActionChips({ items = [], visible, onBranch, revealedBranches = {} }) {
  const [saved, setSaved] = React.useState({});
  if (!visible || !items.length) return null;
  return (
    <div className="r4bd-chip-row">
      {items.map((raw, index) => {
        const item = R4BChipItem(raw, index);
        const key = item.key;
        const label = item.label;
        const branchId = item.branchId || item.branch;
        const branchOpen = branchId && revealedBranches[branchId];
        const isSave = /^save/i.test(label);
        const isSaved = saved[key];
        const icon = item.icon || (branchOpen ? 'check' : isSave ? (isSaved ? 'check' : 'plus') : index === 1 ? 'arrow-up-right' : index === items.length - 1 ? 'dots' : 'pencil');
        return (
          <button
            type="button"
            key={key}
            className="r4bd-action-chip"
            data-saved={isSaved ? '1' : '0'}
            data-branch-id={branchId || undefined}
            data-branch-open={branchOpen ? '1' : '0'}
            onClick={() => {
              if (isSave) setSaved(s => ({ ...s, [key]: true }));
              if (branchId && onBranch) onBranch(branchId);
              if (item.onClick) item.onClick();
            }}
          >
            <Icon name={icon} size={10} />
            {isSaved ? 'Saved' : branchOpen && item.openLabel ? item.openLabel : label}
          </button>
        );
      })}
    </div>
  );
}

function R4BBranchPanel({ branch }) {
  if (!branch) return null;
  const groups = branch.blockGroups || (branch.blocks ? [{ mode: branch.mode || 'single', ids: branch.blocks }] : []);
  return (
    <div className="r4bd-branch-panel" data-branch-panel={branch.id}>
      <div className="r4bd-branch-head">
        <span className="r4bd-branch-title">{branch.title || 'Branch detail'}</span>
        <span className="r4bd-branch-kicker">{branch.kicker || 'ON DEMAND'}</span>
      </div>
      {branch.copy && (
        <p className="r4bd-turn-copy" style={{ color: 'var(--fg-primary)', fontStyle: 'normal', margin: 0 }}>
          <R4BStreamingText text={branch.copy} active={false} />
        </p>
      )}
      {branch.tool && <R4BToolRun name={branch.tool.name} target={branch.tool.target} steps={branch.tool.steps || branch.toolSteps || []} complete />}
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="r4bd-turn-grid" data-mode={group.mode || 'single'} data-block-count={(group.ids || []).length}>
          {(group.ids || []).map(id => <R4BBlockMount key={id} id={id} active />)}
        </div>
      ))}
      {branch.note && <p className="r4bd-turn-copy" style={{ margin: 0 }}>{branch.note}</p>}
    </div>
  );
}

function R4BTurn({ beat, index, state, speed, onBranch, revealedBranches = {} }) {
  if (!state.copy) return null;
  const role = beat.role === 'Coopr' ? 'Coopr' : 'Henry';
  return (
    <section className="r4bd-turn" data-turn={index + 1} data-role={role}>
      <div className="r4bd-turn-role">
        <div>{role}</div>
        <div className="num" style={{ marginTop: 5, fontSize: 9 }}>{beat.ts}</div>
      </div>
      <div className="r4bd-turn-body">
        {beat.copy && (
          <p className="r4bd-turn-copy">
            <R4BStreamingText text={beat.copy} active={state.activeType === 'copy'} speed={speed} />
          </p>
        )}
        {beat.entryState && state.entry && window.R4BDataEntryState && (
          <R4BDataEntryState
            {...beat.entryState}
            state={beat.entryState.state || (state.activeType === 'entry' ? 'active' : 'ready')}
            compact
          />
        )}
        {beat.latencySteps && state.latency && window.R4BLatencySteps && (
          <R4BLatencySteps
            title={beat.latencyTitle || ''}
            steps={beat.latencySteps}
            active={state.activeType === 'latency'}
            complete={state.latency && state.activeType !== 'latency'}
            compact
          />
        )}
        {beat.reasoningSteps && (
          <R4BReasoningTrail
            steps={beat.reasoningSteps}
            active={state.activeType === 'reasoning'}
            complete={state.reasoning && state.activeType !== 'reasoning'}
          />
        )}
        {state.before && beat.beforeText && (
          <p className="r4bd-turn-copy" style={{ color: 'var(--fg-primary)', fontStyle: 'normal' }}>
            <R4BStreamingText text={beat.beforeText} active={state.activeType === 'before'} speed={speed} />
          </p>
        )}
        {state.tool && beat.tool && (
          <R4BToolRun
            name={beat.tool.name}
            target={beat.tool.target}
            steps={beat.tool.steps || beat.toolSteps || []}
            active={state.activeType === 'tool'}
            complete={state.activeType !== 'tool'}
          />
        )}
        {(beat.blockGroups || []).map((group, groupIndex) => state.groups[groupIndex] ? (
          <div
            key={groupIndex}
            className="r4bd-turn-grid"
            data-mode={group.mode || 'single'}
            data-block-count={(group.ids || []).length}
          >
            {(group.ids || []).map(id => (
              <R4BBlockMount key={id} id={id} active={state.activeType === 'group' && state.activeGroup === groupIndex} />
            ))}
          </div>
        ) : null)}
        {state.after && beat.afterText && (
          <p className="r4bd-turn-copy" style={{ color: 'var(--fg-primary)', fontStyle: 'normal' }}>
            <R4BStreamingText text={beat.afterText} active={state.activeType === 'after'} speed={speed} />
          </p>
        )}
        <R4BActionChips items={beat.chips} visible={state.chips} onBranch={onBranch} revealedBranches={revealedBranches} />
        {(beat.branches || []).map(branch => revealedBranches[branch.id] ? <R4BBranchPanel key={branch.id} branch={branch} /> : null)}
      </div>
    </section>
  );
}

function R4BThreadPlayer({ beats = [], events, step = 0, status = 'idle', speed = 2, emptyState = null, scrollRef, revealedBranches = {}, onBranch }) {
  const allEvents = events || R4BMakeEvents(beats);
  return (
    <div className="r4bd-thread-scroll" ref={scrollRef}>
      {step === 0 && emptyState}
      {beats.map((beat, index) => (
        <R4BTurn
          key={index}
          beat={beat}
          index={index}
          state={R4BBeatState(index, step, status, allEvents)}
          speed={speed}
          revealedBranches={revealedBranches}
          onBranch={onBranch}
        />
      ))}
    </div>
  );
}

function R4BComposer({ value, setValue, onSend, sending = false, queued = false, errorMsg = null, onCancelQueue, placeholder = 'Ask Coopr to build the next blocks.' }) {
  const [scope, setScope] = React.useState(['library', 'insights', 'memory']);
  const [scopeOpen, setScopeOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [modelOpen, setModelOpen] = React.useState(false);
  const [model, setModel] = React.useState('sonnet');
  const [thinking, setThinking] = React.useState(true);
  const scopeItems = [
    { id: 'library', label: 'Library', meta: '404 posts' },
    { id: 'insights', label: 'Insights', meta: '30d window' },
    { id: 'memory', label: 'Memory', meta: 'voice on' },
    { id: 'inbox', label: 'Inbox', meta: 'viewer response' },
  ];
  const addItems = [
    { id: 'upload', label: 'Upload file', meta: 'PDF MP4 DOCX' },
    { id: 'clip', label: 'Attach clip', meta: 'source video' },
    { id: 'post', label: 'Attach post', meta: 'library item' },
  ];
  const models = [
    { id: 'haiku', label: 'Haiku', meta: 'fast' },
    { id: 'sonnet', label: 'Sonnet', meta: 'balanced' },
    { id: 'opus', label: 'Opus', meta: 'deep' },
  ];
  const scopeLabel = scope.map(id => ({ library: 'Library', insights: 'Insights', memory: 'Memory', inbox: 'Inbox' }[id])).filter(Boolean).join(' · ').toUpperCase();
  const filled = value && value.trim();
  function send() {
    if (!filled) return;
    onSend(value.trim());
  }
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
  return (
    <div className="r4bd-composer" data-sending={sending ? '1' : '0'} data-queued={queued ? '1' : '0'} data-error={errorMsg ? '1' : '0'}>
      {queued && (
        <div className="r4bd-composer-banner" data-kind="queued">
          <span><span className="r4bd-trail-pulse" />Queued behind current turn</span>
          {onCancelQueue && <button type="button" onClick={onCancelQueue}>Cancel</button>}
        </div>
      )}
      {errorMsg && (
        <div className="r4bd-composer-banner" data-kind="error">
          <span><Icon name="warning" size={10} />{errorMsg}</span>
        </div>
      )}
      <div className="r4bd-composer-eyebrow">
        <button type="button" className="r4bd-eyebrow-btn" onClick={() => { setScopeOpen(v => !v); setAddOpen(false); setModelOpen(false); }}>
          <span>@ {scopeLabel || 'NO SCOPE'}</span><Icon name="arrow-down" size={9} />
        </button>
        <span className="r4bd-model-cluster">
          <button type="button" onClick={() => { setModelOpen(v => !v); setScopeOpen(false); setAddOpen(false); }}>{models.find(m => m.id === model).label}<Icon name="arrow-down" size={9} /></button>
          <button type="button" data-active={thinking ? '1' : '0'} onClick={() => setThinking(v => !v)}><Icon name="star" size={9} />Think</button>
        </span>
      </div>
      <div className="r4bd-composer-bar">
        <button type="button" className="r4bd-add-pill" onClick={() => { setAddOpen(v => !v); setScopeOpen(false); setModelOpen(false); }}><Icon name="plus" size={11} />Add</button>
        <textarea rows={1} value={value} onChange={e => setValue(e.target.value)} onKeyDown={onKeyDown} placeholder={placeholder} />
        <button type="button" className="r4bd-send-btn" disabled={!filled} onClick={send} aria-label="Send"><Icon name="arrow-up" size={13} /></button>
      </div>
      {scopeOpen && (
        <div className="r4bd-pop left">
          <span className="r4bd-pop-label">Reading from</span>
          {scopeItems.map(item => {
            const active = scope.includes(item.id);
            return (
              <button type="button" key={item.id} onClick={() => setScope(s => active ? s.filter(x => x !== item.id) : [...s, item.id])}>
                <span className="r4bd-pop-check" data-active={active ? '1' : '0'}>{active && <Icon name="check" size={9} />}</span>
                <span className="r4bd-pop-title">{item.label}</span>
                <span className="r4bd-pop-meta">{item.meta}</span>
              </button>
            );
          })}
        </div>
      )}
      {addOpen && (
        <div className="r4bd-pop left">
          <span className="r4bd-pop-label">Add context</span>
          {addItems.map(item => (
            <button type="button" key={item.id} onClick={() => setAddOpen(false)}>
              <span className="r4bd-pop-check"><Icon name="plus" size={9} /></span>
              <span className="r4bd-pop-title">{item.label}</span>
              <span className="r4bd-pop-meta">{item.meta}</span>
            </button>
          ))}
        </div>
      )}
      {modelOpen && (
        <div className="r4bd-pop right">
          <span className="r4bd-pop-label">Model</span>
          {models.map(item => {
            const active = model === item.id;
            return (
              <button type="button" key={item.id} onClick={() => { setModel(item.id); setModelOpen(false); }}>
                <span className="r4bd-pop-check" data-active={active ? '1' : '0'}>{active && <Icon name="check" size={9} />}</span>
                <span className="r4bd-pop-title">{item.label}</span>
                <span className="r4bd-pop-meta">{item.meta}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  r4bTokenize,
  R4BStreamingText,
  R4BReasoningTrail,
  R4BToolRun,
  R4BDemoControls,
  R4BBeatBlocks,
  R4BMakeEvents,
  R4BBeatState,
  R4BBlockMount,
  R4BChipItem,
  R4BActionChips,
  R4BBranchPanel,
  R4BTurn,
  R4BThreadPlayer,
  R4BComposer,
});
