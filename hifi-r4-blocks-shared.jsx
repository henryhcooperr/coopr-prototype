/* global React, window, document */
/* hifi-r4-blocks-shared.jsx — R4 in-thread block foundation. */

var D = window.HF_DATA || {};

const BLOCK_TARGETS = {
  STUDIO: 'Studio',
  LIBRARY: 'Library',
  INBOX: 'Inbox',
  CALENDAR: 'Calendar',
  INTEL: 'Intel',
  PULSE: 'Insights',
  AUDIENCE: 'Insights · Audience',
  MEMORY: 'Intel · Memory',
  WORKSPACE: 'Studio · Workspace',
  SETTINGS: 'Settings',
  ANYWHERE: null,
};

const BLOCK_FAMILIES = {
  A: { letter: 'A', title: 'Measurement', count: 14, deck: 'Charts that say one thing each: curves, deltas, sparks, ladders.' },
  B: { letter: 'B', title: 'Comparison', count: 7, deck: 'Two things, one figure, with the delta made legible.' },
  C: { letter: 'C', title: 'Draft', count: 9, deck: 'Hooks, captions, outlines, scripts, and reply drafts.' },
  D: { letter: 'D', title: 'Audience', count: 8, deck: 'Segments, personas, top fans, geo, and overlap.' },
  E: { letter: 'E', title: 'Schedule', count: 8, deck: 'Time as a grid: week, slot, conflict, streak, and annual rhythm.' },
  F: { letter: 'F', title: 'Hook tests', count: 6, deck: 'Predictions, A/Bs, hold maps, and experiment power.' },
  G: { letter: 'G', title: 'Voice', count: 6, deck: 'Voice DNA, pinned memories, forbidden phrases, and tone controls.' },
  H: { letter: 'H', title: 'Inbox', count: 6, deck: 'Comments, DMs, sentiment, reply suggestions, and triage.' },
  I: { letter: 'I', title: 'Intel', count: 8, deck: 'Trends, peers, sources, citations, and search signals.' },
  J: { letter: 'J', title: 'Workspace', count: 7, deck: 'Projects, files, briefs, versions, assets, and notes.' },
  K: { letter: 'K', title: 'Library', count: 5, deck: 'Past posts, patterns, series, facets, and pull quotes.' },
  L: { letter: 'L', title: 'System', count: 6, deck: 'Decisions, forecasts, cost, empty states, errors, and caveats.' },
  M: { letter: 'M', title: 'Search', count: 8, deck: 'Search, source trust, facets, citation bundles, and watchlists.' },
  N: { letter: 'N', title: 'Own Content', count: 8, deck: 'Own posts, transcripts, clips, assets, quotes, patterns, and gaps.' },
  O: { letter: 'O', title: 'Social Intel', count: 8, deck: 'Platform scans, competitor profiles, peer lanes, trends, and comments.' },
  P: { letter: 'P', title: 'Imports', count: 8, deck: 'Connections, sync, uploads, transcript/OCR extraction, privacy, and retry states.' },
  Q: { letter: 'Q', title: 'Actions', count: 8, deck: 'Plans, progress, approvals, queues, packages, adaptations, and receipts.' }
};

const BLOCK_REGISTRY = window.BLOCK_REGISTRY || {};

function normalizeBlockTarget(target) {
  if (!target) return null;
  const key = String(target).toUpperCase();
  if (Object.prototype.hasOwnProperty.call(BLOCK_TARGETS, key)) return BLOCK_TARGETS[key];
  return target;
}

function registerBlock(id, meta) {
  if (!id || !meta) return null;
  const normalized = normalizeBlockTarget(meta.target);
  BLOCK_REGISTRY[id] = {
    ...meta,
    id,
    targetLabel: normalized,
    componentName: 'HF_R4B_' + id,
  };
  return BLOCK_REGISTRY[id];
}

function getBlockMeta(id) {
  return BLOCK_REGISTRY[id] || null;
}

function Icon({ name, size = 12, stroke = 'currentColor' }) {
  const common = { fill: 'none', stroke, strokeWidth: 1.55, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const filled = { fill: stroke, stroke: 'none' };
  let body;
  switch (name) {
    case 'arrow-up-right': body = <path {...common} d="M4 3.5 H8.5 V8 M8.2 3.8 L3.4 8.6" />; break;
    case 'pencil': body = <path {...common} d="M3 8.8 L3.4 6.8 L7.9 2.3 L9.7 4.1 L5.2 8.6 L3 8.8 Z M7.1 3.1 L8.9 4.9" />; break;
    case 'retry': body = <path {...common} d="M8.7 4.1 A3.4 3.4 0 1 0 9 7.4 M8.7 4.1 V2.2 M8.7 4.1 H6.8" />; break;
    case 'play': body = <path {...filled} d="M4 2.8 L9 6 L4 9.2 Z" />; break;
    case 'pause': body = <g><rect {...filled} x="3.4" y="2.8" width="1.6" height="6.4" rx="0.3" /><rect {...filled} x="7" y="2.8" width="1.6" height="6.4" rx="0.3" /></g>; break;
    case 'step': body = <g><path {...filled} d="M3.3 2.9 L7.7 6 L3.3 9.1 Z" /><path {...common} d="M8.8 3.2 V8.8" /></g>; break;
    case 'square': body = <rect {...filled} x="3.4" y="3.4" width="5.2" height="5.2" rx="0.7" />; break;
    case 'arrow-up': body = <path {...common} d="M6 9 V3 M3.8 5.2 L6 3 L8.2 5.2" />; break;
    case 'arrow-down': body = <path {...common} d="M6 3 V9 M3.8 6.8 L6 9 L8.2 6.8" />; break;
    case 'arrow-right': body = <path {...common} d="M3 6 H9 M6.8 3.8 L9 6 L6.8 8.2" />; break;
    case 'cross': body = <path {...common} d="M3.5 3.5 L8.5 8.5 M8.5 3.5 L3.5 8.5" />; break;
    case 'pin': body = <path {...common} d="M4.4 2.4 H8.4 L7.5 5.6 L9 7.1 H6.5 L5.4 9.7 L4.9 7.1 H3.1 L4.7 5.6 Z" />; break;
    case 'dot': body = <circle {...filled} cx="6" cy="6" r="2.2" />; break;
    case 'warning': body = <path {...common} d="M6 2.4 L10 9.3 H2 Z M6 4.8 V6.7 M6 8.2 V8.25" />; break;
    case 'arrows-h': body = <path {...common} d="M2.5 6 H9.5 M4.2 4.3 L2.5 6 L4.2 7.7 M7.8 4.3 L9.5 6 L7.8 7.7" />; break;
    case 'box-x': body = <g><rect {...common} x="2.6" y="2.6" width="6.8" height="6.8" rx="1.1" /><path {...common} d="M4.4 4.4 L7.6 7.6 M7.6 4.4 L4.4 7.6" /></g>; break;
    case 'check': body = <path {...common} d="M3 6.2 L5.1 8.2 L9 3.8" />; break;
    case 'star': body = <path {...common} d="M6 2.4 L6.8 5.1 L9.5 6 L6.8 6.9 L6 9.6 L5.2 6.9 L2.5 6 L5.2 5.1 Z" />; break;
    case 'dots': body = <g><circle {...filled} cx="3.4" cy="6" r="0.8" /><circle {...filled} cx="6" cy="6" r="0.8" /><circle {...filled} cx="8.6" cy="6" r="0.8" /></g>; break;
    case 'plus': body = <path {...common} d="M6 3 V9 M3 6 H9" />; break;
    case 'circle': body = <circle {...common} cx="6" cy="6" r="3.3" />; break;
    default: body = <circle {...filled} cx="6" cy="6" r="1.8" />;
  }
  return <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" focusable="false">{body}</svg>;
}

function FooterChip({ kind, icon, label, target, muted = false, accent = false, danger = false, onClick, disabled = false }) {
  const [state, setState] = React.useState('idle');
  let nextIcon = icon;
  let nextLabel = label;
  if (kind === 'save') { nextIcon = 'plus'; nextLabel = 'Save'; }
  if (kind === 'open-in') { nextIcon = 'arrow-up-right'; nextLabel = 'Open in ' + target; }
  if (kind === 'discard') { nextIcon = 'cross'; nextLabel = 'Discard'; muted = true; }
  if (kind === 'more') { nextIcon = 'dots'; nextLabel = 'More'; muted = true; }
  if (state === 'busy') {
    nextIcon = null;
    nextLabel = kind === 'open-in' ? 'Opening' : kind === 'save' ? 'Saving' : 'Working';
  }
  if (state === 'done') {
    nextIcon = 'check';
    nextLabel = kind === 'save' ? 'Saved' : kind === 'discard' ? 'Discarded' : nextLabel;
  }
  const cls = ['blk-chip'];
  if (muted) cls.push('muted');
  if (accent) cls.push('accent');
  if (danger) cls.push('danger');
  function handleClick(e) {
    if (disabled || state === 'busy') return;
    if (onClick) onClick(e);
    setState('busy');
    window.setTimeout(() => {
      setState('done');
      if (kind !== 'save') window.setTimeout(() => setState('idle'), 800);
    }, kind === 'save' ? 420 : 280);
  }
  return (
    <button type="button" className={cls.join(' ')} data-state={state} disabled={disabled} onClick={handleClick}>
      {state === 'busy' ? <span className="blk-chip-spinner" /> : nextIcon && <Icon name={nextIcon} />}
      {nextLabel && <span>{nextLabel}</span>}
    </button>
  );
}

function BlockLifecycleBody({ id, name, state, onState }) {
  if (state === 'running') {
    return <RunningPanel id={id} name={name} jobId={`job-${id}`} onState={onState} />;
  }
  if (state === 'loading') {
    return (
      <div className="blk blk-lifecycle-panel" data-lifecycle="loading">
        <Eyebrow left="FIG · LOADING" right={id} />
        <div className="blk-skel-stack" aria-label={`${name} loading`}>
          <span className="blk-skel w-84" />
          <span className="blk-skel w-62" />
          <span className="blk-skel chart" />
          <span className="blk-skel w-38" />
        </div>
        <div className="blk-footer">
          <FooterChip icon="cross" label="Cancel" muted onClick={() => onState('idle')} />
        </div>
      </div>
    );
  }
  if (state === 'empty') {
    return (
      <div className="blk blk-lifecycle-panel" data-lifecycle="empty">
        <Eyebrow left="FIG · EMPTY" right={id} />
        <div className="blk-state-empty">
          <Icon name="circle" size={18} />
          <p className="serif-it">No result yet. Add context or ask a narrower follow-up.</p>
        </div>
        <div className="blk-footer">
          <FooterChip icon="plus" label="Ask follow-up" accent onClick={() => onState('loading')} />
        </div>
      </div>
    );
  }
  if (state === 'error') {
    const job = (window.JOB_REGISTRY && window.JOB_REGISTRY.get(`job-${id}`)) || null;
    const failedIdx = job ? job.steps.findIndex((s) => s.state === 'error') : -1;
    return (
      <div className="blk blk-lifecycle-panel" data-lifecycle="error">
        <Eyebrow left={`${id} · ERROR`} right={job && failedIdx >= 0 ? `step ${failedIdx + 1} of ${job.steps.length}` : ''} />
        <div className="blk-state-error">
          <Icon name="warning" size={18} />
          <p className="serif-it">{job && job.errorMessage ? job.errorMessage : 'This block could not load from the current thread context.'}</p>
        </div>
        {job && (
          <>
            <StepJournal steps={job.steps} />
            <div className="blk-progress" data-tone="danger"><div style={{ width: `${Math.round((job.steps.filter((s) => s.state === 'done').length / job.steps.length) * 100)}%` }} /></div>
          </>
        )}
        <div className="blk-footer">
          <FooterChip icon="retry" label={failedIdx >= 0 ? `Retry from step ${failedIdx + 1}` : 'Retry'} accent onClick={() => onState('running')} />
          {job && job.steps.some((s) => s.state === 'done') && <FooterChip icon="box-x" label="Use partial" muted />}
          <FooterChip icon="cross" label="Discard run" muted onClick={() => onState('idle')} />
        </div>
      </div>
    );
  }
  if (state === 'cancelled') {
    return <CancelledStrip id={id} jobId={`job-${id}`} onState={onState} />;
  }
  return null;
}

function StepJournal({ steps }) {
  function fmt(ms) {
    if (ms == null || isNaN(ms)) return '—';
    const s = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(s / 60);
    const r = s - m * 60;
    return `${m}:${r < 10 ? '0' : ''}${r}`;
  }
  function liveDuration(step) {
    if (step.state === 'pending') return null;
    if (step.startedAt == null) return null;
    const end = step.state === 'active' ? Date.now() : (step.endedAt || step.startedAt);
    return end - step.startedAt;
  }
  return (
    <ul className="blk-step-list" role="list">
      {steps.map((step, i) => (
        <li key={i} className="blk-step" data-state={step.state}>
          <span className="blk-step-marker" aria-hidden="true" />
          <span className="blk-step-name">{step.name}</span>
          <span className="blk-step-meta">{fmt(liveDuration(step))}</span>
        </li>
      ))}
    </ul>
  );
}

function RunningPanel({ id, name, jobId, onState }) {
  const [job, setJob] = React.useState(() => (window.JOB_REGISTRY ? window.JOB_REGISTRY.get(jobId) : null));
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!window.JOB_REGISTRY) return;
    const unsub = window.JOB_REGISTRY.subscribe(jobId, (j) => setJob(j));
    return unsub;
  }, [jobId]);

  React.useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 500);
    return () => window.clearInterval(t);
  }, []);

  React.useEffect(() => {
    if (!job && window.JOB_REGISTRY) {
      window.JOB_REGISTRY.start(jobId, name, [
        { name: 'Tracked competitor',           simDurationMs: 4000 },
        { name: 'Resolved profile metadata',    simDurationMs: 7000 },
        { name: 'Pulling last 90d of reels',    simDurationMs: 240000 },
        { name: 'Scoring against your library', simDurationMs: 18000 },
        { name: 'Building comparison',          simDurationMs: 9000 },
      ]);
    }
  }, [job, jobId, name]);

  if (!job) {
    return (
      <div className="blk blk-lifecycle-panel" data-lifecycle="running">
        <Eyebrow left={`${id} · STARTING`} right="—" />
      </div>
    );
  }
  if (job.state === 'done')      onState && window.setTimeout(() => onState('idle'), 0);
  if (job.state === 'cancelled') onState && window.setTimeout(() => onState('cancelled'), 0);
  if (job.state === 'error')     onState && window.setTimeout(() => onState('error'), 0);

  const elapsedMs = job.startedAt ? (Date.now() - job.startedAt) : 0;
  const total = job.steps.length;
  const doneCount = job.steps.filter((s) => s.state === 'done').length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  function fmt(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(s / 60);
    const r = s - m * 60;
    return `${m}:${r < 10 ? '0' : ''}${r}`;
  }

  return (
    <div className="blk blk-lifecycle-panel" data-lifecycle="running">
      <Eyebrow left={`${id} · RUNNING · ${fmt(elapsedMs)}`} right={`step ${job.activeStep + 1} of ${total}`} />
      <StepJournal steps={job.steps} />
      <div className="blk-progress"><div style={{ width: `${pct}%` }} /></div>
      <div className="blk-footer">
        <FooterChip kind="discard" muted onClick={() => window.JOB_REGISTRY.cancel(jobId)} />
        <FooterChip kind="more" />
      </div>
    </div>
  );
}

function CancelledStrip({ jobId, onState }) {
  const job = (window.JOB_REGISTRY && window.JOB_REGISTRY.get(jobId)) || null;
  const elapsed = job && job.endedAt && job.startedAt ? Math.floor((job.endedAt - job.startedAt) / 1000) : 0;
  const m = Math.floor(elapsed / 60); const r = elapsed - m * 60;
  const stepLabel = job ? `step ${job.activeStep + 1} of ${job.steps.length}` : '';
  return (
    <div className="blk-cancelled-strip" data-lifecycle="cancelled">
      <span className="blk-cancelled-dot" aria-hidden="true" />
      <span className="blk-cancelled-text">Cancelled · {`${m}:${r < 10 ? '0' : ''}${r}`} · {stepLabel}</span>
      <span className="blk-cancelled-actions">
        <button type="button" className="blk-cancelled-action" onClick={() => onState('running')}>expand</button>
        <span className="blk-cancelled-sep">·</span>
        <button type="button" className="blk-cancelled-action accent" onClick={() => onState('running')}>re-run</button>
      </span>
    </div>
  );
}

function Frame({ id, name, purpose, target, span = 6, children, initialState = 'idle' }) {
  const [blockState, setBlockState] = React.useState(initialState);
  const targetLabel = normalizeBlockTarget(target);
  const states = ['idle', 'loading', 'empty', 'error', 'running', 'cancelled'];
  return (
    <div className={`blk-frame cell-${span}`} id={id} data-block-id={id} data-block-state={blockState}>
      <div className="blk-tag">
        <span className="blk-id">{id}</span>
        <span className="blk-name">{name}</span>
        <span className="blk-tag-side">
          <span className="blk-target">{targetLabel ? <><Icon name="arrow-up-right" size={10} />{targetLabel}</> : 'No destination'}</span>
          <span className="blk-state-control" aria-label={`${id} state controls`}>
            {states.map(state => (
              <button
                key={state}
                type="button"
                className="blk-state-btn"
                data-active={blockState === state ? '1' : '0'}
                data-state-option={state}
                onClick={() => setBlockState(state)}
              >
                {state === 'idle' ? 'Idle' : state === 'loading' ? 'Load' : state === 'empty' ? 'Empty' : state === 'error' ? 'Error' : state === 'running' ? 'Run' : 'Cancel'}
              </button>
            ))}
          </span>
        </span>
      </div>
      <span className="blk-purpose">{purpose}</span>
      {blockState === 'idle' ? children : <BlockLifecycleBody id={id} name={name} state={blockState} onState={setBlockState} />}
    </div>
  );
}

function Eyebrow({ left, right }) {
  return (
    <div className="blk-eyebrow">
      <span className="l">{left}</span>
      <span className="r">{right}</span>
    </div>
  );
}

function Footer({ openIn = 'Studio', extra, children }) {
  const target = normalizeBlockTarget(openIn);
  return (
    <div className="blk-footer">
      <FooterChip kind="save" />
      {target && <FooterChip kind="open-in" target={target} />}
      {extra}
      {children}
      <FooterChip kind="discard" />
      <FooterChip kind="more" />
    </div>
  );
}

function Spark({ vals = [], height = 28, accent = false, dashed = false, w = 120 }) {
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const range = max - min || 1;
  const step = w / Math.max(1, vals.length - 1);
  const d = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={w} height={height} style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={accent ? 'var(--accent-primary)' : 'var(--fg-primary)'} strokeWidth={accent ? 1.6 : 1.2} strokeDasharray={dashed ? '3 3' : '0'} />
    </svg>
  );
}

function Bars({ vals = [], height = 36, accent = false, w = 120 }) {
  const max = Math.max(...vals) || 1;
  const bw = (w / vals.length) - 2;
  return (
    <svg width={w} height={height} style={{ display: 'block' }}>
      {vals.map((v, i) => (
        <rect key={i} x={i * (bw + 2)} y={height - (v / max) * height} width={bw} height={(v / max) * height} fill={accent ? 'var(--accent-primary)' : 'var(--fg-primary)'} opacity={accent ? 1 : 0.85} />
      ))}
    </svg>
  );
}

function Hairline() {
  return <div style={{ height: 1, background: 'var(--border-subtle)' }} />;
}

function DashedHRule() {
  return <div style={{ height: 1, borderTop: '1px dotted var(--border-subtle)' }} />;
}

function ProgressBar({ pct = 0, fill = 'var(--accent-primary)', accent = false }) {
  return (
    <div className="blk-progress">
      <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: accent ? 'var(--accent-primary)' : fill }} />
    </div>
  );
}

function AvatarDisc({ size = 24, label = '', accent = false }) {
  return (
    <span className="blk-avatar-disc" style={{ width: size, height: size, background: accent ? 'var(--accent-soft)' : 'var(--surface-2)', color: accent ? 'var(--accent-primary-press)' : 'var(--fg-secondary)' }}>
      {label ? String(label).slice(0, 1).toUpperCase() : <Icon name="dot" size={8} />}
    </span>
  );
}

function ChannelChip({ channel }) {
  const c = String(channel || '').toUpperCase();
  const cls = c === 'YT' ? 'yt' : c === 'IG' ? 'ig' : c === 'TT' ? 'tt' : 'neutral';
  return <span className={`blk-channel-chip ${cls}`}>{c}</span>;
}

function DonutSegments({ values = [], size = 80 }) {
  const total = values.reduce((s, v) => s + Math.max(0, v.value || v), 0) || 1;
  let acc = 0;
  const cx = size / 2, cy = size / 2, r = size * 0.44;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {values.map((raw, i) => {
        const val = Math.max(0, raw.value || raw);
        const start = acc / total;
        acc += val;
        const end = acc / total;
        const a0 = start * 2 * Math.PI - Math.PI / 2;
        const a1 = end * 2 * Math.PI - Math.PI / 2;
        const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        const large = end - start > 0.5 ? 1 : 0;
        const fill = raw.color || `color-mix(in srgb, var(--accent-primary) ${95 - i * 13}%, var(--surface-1))`;
        return <path key={i} d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={fill} />;
      })}
      <circle cx={cx} cy={cy} r={size * 0.26} fill="var(--surface-1)" />
    </svg>
  );
}

function RetentionCurve({ series = [], bench = [], w = 360, h = 120 }) {
  const toD = (vals) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / Math.max(1, vals.length - 1)) * w},${h - v * h}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map(y => <line key={y} x1="0" x2={w} y1={h * y} y2={h * y} stroke="var(--border-subtle)" />)}
      {bench.length > 0 && <path d={toD(bench)} fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.2" strokeDasharray="3 3" />}
      {series.length > 0 && <path d={toD(series)} fill="none" stroke="var(--accent-primary)" strokeWidth="2" />}
    </svg>
  );
}

function TimeAxis({ ticks = [] }) {
  return (
    <div className="blk-time-axis">
      {ticks.map(t => <span key={t}>{t}</span>)}
    </div>
  );
}

function DeltaText({ value, sign }) {
  const raw = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  const up = sign ? sign === 'up' : raw >= 0;
  const text = typeof value === 'number' ? `${value > 0 ? '+' : ''}${value}` : value;
  return <span className="mono num" style={{ color: up ? 'var(--accent-primary)' : 'var(--tone-danger)', fontWeight: 700 }}>{text}</span>;
}

function Stat({ label, val, sub, accent = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>{label}</span>
      <span className="num" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1, color: accent ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>{val}</span>
      {sub && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)' }}>{sub}</span>}
    </div>
  );
}

function blockFamilyList(letter) {
  return Object.values(BLOCK_REGISTRY)
    .filter(m => m.family === letter)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function BlockFamilyPage({ family }) {
  const meta = BLOCK_FAMILIES[family];
  const blocks = blockFamilyList(family);
  const subtab = meta ? `${family} · ${meta.title}` : family;
  const [stateLab, setStateLab] = React.useState(false);
  return (
    <HfShell workspace="blocks" subtab={subtab}>
      <div className="r4b-surface" data-state-lab={stateLab ? '1' : '0'}>
        <div className="r4b-catalog-head">
          <div>
            <div className="r4b-kicker">BLOCK CATALOG · FAMILY {family}</div>
            <h1>{meta ? meta.title : 'Blocks'}</h1>
            <p>{meta ? meta.deck : 'Registered in-thread blocks.'}</p>
          </div>
          <div className="r4b-head-actions">
            <button type="button" className="r4b-state-lab-btn" data-active={stateLab ? '1' : '0'} onClick={() => setStateLab(v => !v)}>
              State lab
            </button>
            <div className="r4b-count"><strong>{blocks.length}</strong><span>blocks</span></div>
          </div>
        </div>
        <div className="r4b-grid">
          {blocks.map(item => {
            const Comp = item.component || window[item.componentName];
            return Comp ? <Comp key={item.id} /> : null;
          })}
        </div>
      </div>
    </HfShell>
  );
}

function HF_R4B_BlockFamilyA() { return <BlockFamilyPage family="A" />; }
function HF_R4B_BlockFamilyB() { return <BlockFamilyPage family="B" />; }
function HF_R4B_BlockFamilyC() { return <BlockFamilyPage family="C" />; }
function HF_R4B_BlockFamilyD() { return <BlockFamilyPage family="D" />; }
function HF_R4B_BlockFamilyE() { return <BlockFamilyPage family="E" />; }
function HF_R4B_BlockFamilyF() { return <BlockFamilyPage family="F" />; }
function HF_R4B_BlockFamilyG() { return <BlockFamilyPage family="G" />; }
function HF_R4B_BlockFamilyH() { return <BlockFamilyPage family="H" />; }
function HF_R4B_BlockFamilyI() { return <BlockFamilyPage family="I" />; }
function HF_R4B_BlockFamilyJ() { return <BlockFamilyPage family="J" />; }
function HF_R4B_BlockFamilyK() { return <BlockFamilyPage family="K" />; }
function HF_R4B_BlockFamilyL() { return <BlockFamilyPage family="L" />; }
function HF_R4B_BlockFamilyM() { return <BlockFamilyPage family="M" />; }
function HF_R4B_BlockFamilyN() { return <BlockFamilyPage family="N" />; }
function HF_R4B_BlockFamilyO() { return <BlockFamilyPage family="O" />; }
function HF_R4B_BlockFamilyP() { return <BlockFamilyPage family="P" />; }
function HF_R4B_BlockFamilyQ() { return <BlockFamilyPage family="Q" />; }

function ensureR4BStyles() {
  if (typeof document === 'undefined' || document.getElementById('r4b-block-styles')) return;
  const style = document.createElement('style');
  style.id = 'r4b-block-styles';
  style.textContent = `
    .r4b-surface { padding: 44px 52px 96px; max-width: 1440px; min-height: 100%; margin: 0 auto; background: var(--bg-base); color: var(--fg-primary); }
    .r4b-catalog-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; padding-bottom: 24px; border-bottom: 3px solid var(--fg-primary); margin-bottom: 28px; }
    .r4b-catalog-head h1 { margin: 0; font-family: var(--font-serif); font-style: italic; font-size: 52px; font-weight: 600; letter-spacing: -0.035em; line-height: 0.95; }
    .r4b-catalog-head p { margin: 10px 0 0; max-width: 620px; font-family: var(--font-serif); font-style: italic; font-size: 16px; color: var(--fg-secondary); line-height: 1.4; }
    .r4b-kicker { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-tertiary); font-weight: 700; margin-bottom: 8px; }
    .r4b-count { text-align: right; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4b-count strong { display: block; font-family: var(--font-serif); font-style: italic; font-size: 34px; line-height: 1; letter-spacing: -0.03em; color: var(--accent-primary); }
    .r4b-head-actions { display: flex; align-items: flex-end; gap: 14px; }
    .r4b-state-lab-btn { height: 28px; padding: 0 10px; border: 1px solid var(--border-default); border-radius: 999px; background: var(--surface-1); color: var(--fg-secondary); font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
    .r4b-state-lab-btn:hover { background: var(--surface-2); color: var(--fg-primary); border-color: var(--border-strong); }
    .r4b-state-lab-btn[data-active="1"] { background: var(--fg-primary); color: var(--bg-base); border-color: var(--fg-primary); }
    .r4b-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 28px 24px; align-items: start; }
    .cell-12 { grid-column: span 12; } .cell-8 { grid-column: span 8; } .cell-6 { grid-column: span 6; } .cell-5 { grid-column: span 5; } .cell-4 { grid-column: span 4; } .cell-3 { grid-column: span 3; }
    .blk-frame { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
    .blk-tag { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-bottom: 6px; border-bottom: 1px solid var(--border-subtle); }
    .blk-id { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; color: var(--accent-primary); font-weight: 700; }
    .blk-name { font-family: var(--font-serif); font-style: italic; font-weight: 600; font-size: 16px; letter-spacing: -0.015em; flex: 1; min-width: 0; }
    .blk-tag-side { display: inline-flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
    .blk-target { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.08em; color: var(--fg-tertiary); text-transform: uppercase; white-space: nowrap; }
    .blk-state-control { display: inline-flex; align-items: center; gap: 2px; padding: 2px; border: 1px solid var(--border-subtle); border-radius: 999px; background: var(--surface-2); opacity: 0; pointer-events: none; transform: translateY(-1px); transition: opacity 120ms ease, transform 120ms ease; }
    .blk-frame:hover .blk-state-control, .blk-frame:focus-within .blk-state-control, .r4b-surface[data-state-lab="1"] .blk-state-control, .r4bd-thread-demo[data-state-lab="1"] .blk-state-control { opacity: 1; pointer-events: auto; transform: translateY(0); }
    .blk-state-btn { height: 18px; border: 0; border-radius: 999px; padding: 0 6px; background: transparent; color: var(--fg-tertiary); font-family: var(--font-mono); font-size: 8.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; }
    .blk-state-btn:hover { color: var(--fg-primary); background: var(--surface-1); }
    .blk-state-btn[data-active="1"] { background: var(--fg-primary); color: var(--bg-base); }
    .blk-purpose { font-family: var(--font-serif); font-style: italic; font-size: 12.5px; color: var(--fg-tertiary); margin-top: -4px; }
    .blk { background: var(--surface-1); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
    .blk-eyebrow { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
    .blk-eyebrow .l, .blk-eyebrow .r { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
    .blk-eyebrow .l { color: var(--fg-secondary); } .blk-eyebrow .r { color: var(--fg-tertiary); text-align: right; }
    .blk-footer { display: flex; gap: 6px; padding-top: 8px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; }
    .blk-chip { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: 999px; border: 1px solid var(--border-default); background: var(--surface-1); font-family: var(--font-sans); font-size: 10.5px; font-weight: 500; color: var(--fg-primary); white-space: nowrap; cursor: pointer; transition: background 100ms ease, border-color 100ms ease, color 100ms ease, transform 100ms ease; }
    button.blk-chip { appearance: none; }
    .blk-chip:hover { background: var(--surface-2); border-color: var(--border-strong); }
    .blk-chip:active { transform: scale(0.98); }
    .blk-chip[disabled] { opacity: 0.55; cursor: default; }
    .blk-chip[data-state="busy"] { color: var(--fg-secondary); }
    .blk-chip[data-state="done"] { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; }
    .blk-chip.muted { color: var(--fg-tertiary); } .blk-chip.accent { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; } .blk-chip.danger { color: var(--tone-danger); }
    .blk-chip-spinner { width: 9px; height: 9px; border: 1.5px solid currentColor; border-top-color: transparent; border-radius: 999px; animation: blk-spin 720ms linear infinite; }
    @keyframes blk-spin { to { transform: rotate(360deg); } }
    @keyframes blk-skel-pulse { 0%, 100% { background: var(--surface-2); } 50% { background: var(--surface-3); } }
    .blk-lifecycle-panel { min-height: 170px; justify-content: space-between; }
    .blk-skel-stack { display: flex; flex-direction: column; gap: 8px; padding: 2px 0 4px; }
    .blk-skel { display: block; height: 8px; border-radius: 3px; background: var(--surface-2); animation: blk-skel-pulse 1.2s ease-in-out infinite; }
    .blk-skel.w-84 { width: 84%; } .blk-skel.w-62 { width: 62%; } .blk-skel.w-38 { width: 38%; }
    .blk-skel.chart { width: 100%; height: 72px; border-radius: 6px; }
    .blk-state-empty, .blk-state-error { display: flex; align-items: flex-start; gap: 10px; color: var(--fg-secondary); min-height: 84px; padding-top: 4px; }
    .blk-state-error { color: var(--tone-danger); }
    .blk-state-empty p, .blk-state-error p { margin: 0; color: var(--fg-secondary); font-size: 14px; line-height: 1.45; }
    .blk-state-error p { color: var(--tone-danger); }
    .blk-progress { position: relative; height: 6px; background: var(--surface-2); border-radius: 2px; overflow: hidden; }
    .blk-progress > div { height: 100%; background: var(--accent-primary); border-radius: 2px; }
    .blk-progress[data-tone="danger"] > div { background: var(--tone-danger); }
    .blk-progress[data-tone="success"] > div { background: var(--tone-success); }
    [data-lifecycle="error"] .blk-eyebrow .l { color: var(--tone-danger); }
    [data-lifecycle="success"] .blk-eyebrow .l { color: var(--tone-success); }
    [data-lifecycle="warn"] .blk-eyebrow .l { color: var(--tone-warning); }
    .blk-avatar-disc { border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 10px; font-weight: 700; }
    .blk-channel-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 22px; height: 16px; border-radius: 3px; font-family: var(--font-mono); font-size: 9px; font-weight: 800; letter-spacing: 0.04em; border: 1px solid var(--border-subtle); color: var(--fg-primary); }
    .blk-channel-chip.yt { background: var(--tone-danger-bg); } .blk-channel-chip.ig { background: var(--accent-soft); } .blk-channel-chip.tt { background: var(--surface-ink); color: var(--fg-on-ink); } .blk-channel-chip.neutral { background: var(--surface-2); }
    .blk-time-axis { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: var(--fg-tertiary); }
    .blk-step-list { display: flex; flex-direction: column; gap: 6px; padding: 0; margin: 4px 0 0; list-style: none; }
    .blk-step { display: grid; grid-template-columns: 14px 1fr auto; gap: 8px; align-items: baseline; font-family: var(--font-serif); font-style: italic; font-size: 13.5px; line-height: 1.4; }
    .blk-step-marker { width: 10px; height: 10px; border-radius: 50%; align-self: center; }
    .blk-step[data-state="done"] { color: var(--fg-secondary); }
    .blk-step[data-state="done"] .blk-step-marker { background: var(--accent-primary); }
    .blk-step[data-state="active"] .blk-step-marker { background: var(--surface-1); border: 2px solid var(--accent-primary); animation: blk-step-pulse 1.4s ease-in-out infinite; }
    .blk-step[data-state="active"] { color: var(--fg-primary); font-weight: 500; }
    .blk-step[data-state="pending"] .blk-step-marker { background: var(--surface-3); }
    .blk-step[data-state="pending"] { color: var(--fg-tertiary); }
    .blk-step[data-state="error"] .blk-step-marker { background: var(--tone-danger); }
    .blk-step[data-state="error"] { color: var(--tone-danger); }
    .blk-step[data-state="skipped"] .blk-step-marker { background: transparent; border: 1.5px dashed var(--fg-tertiary); }
    .blk-step[data-state="skipped"] { color: var(--fg-tertiary); text-decoration: line-through; }
    .blk-step-meta { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-tertiary); font-weight: 600; }
    @keyframes blk-step-pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
    .blk-cancelled-strip { display: grid; grid-template-columns: 14px 1fr auto; gap: 10px; align-items: center; padding: 10px 14px; background: var(--surface-2); border: 1px solid var(--border-subtle); border-radius: 6px; }
    .blk-cancelled-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--fg-tertiary); justify-self: center; }
    .blk-cancelled-text { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--fg-secondary); font-weight: 700; }
    .blk-cancelled-actions { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--fg-tertiary); font-weight: 700; }
    .blk-cancelled-action { background: transparent; border: 0; padding: 2px 4px; cursor: pointer; color: var(--fg-tertiary); font: inherit; letter-spacing: inherit; text-transform: inherit; font-weight: inherit; }
    .blk-cancelled-action.accent { color: var(--accent-primary); }
    .blk-cancelled-sep { color: var(--fg-tertiary); }
    .blk-frame .mono, .r4b-thread-demo .mono { font-family: var(--font-mono); } .blk-frame .serif-it, .r4b-thread-demo .serif-it { font-family: var(--font-serif); font-style: italic; } .blk-frame .serif, .r4b-thread-demo .serif { font-family: var(--font-serif); } .blk-frame .num, .r4b-thread-demo .num { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
    .r4b-thread-demo { padding: 34px 48px 96px; max-width: 1180px; margin: 0 auto; }
    .r4b-thread-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; border-bottom: 3px solid var(--fg-primary); padding-bottom: 22px; margin-bottom: 28px; }
    .r4b-thread-head h1 { margin: 0; font-family: var(--font-serif); font-style: italic; font-size: 46px; letter-spacing: -0.035em; line-height: 0.98; }
    .r4b-thread-head p { margin: 8px 0 0; font-family: var(--font-serif); font-style: italic; color: var(--fg-secondary); max-width: 620px; }
    .r4b-turn { display: grid; grid-template-columns: 92px 1fr; gap: 18px; padding: 18px 0; border-bottom: 1px solid var(--border-subtle); }
    .r4b-turn-role { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-tertiary); font-weight: 700; padding-top: 6px; }
    .r4b-turn-body { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
    .r4b-turn-copy { margin: 0; font-family: var(--font-serif); font-style: italic; font-size: 16px; line-height: 1.45; color: var(--fg-secondary); }
    .r4b-turn-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 18px; align-items: start; }
    .r4b-reasoning { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; height: 26px; padding: 0 10px; border: 1px solid var(--border-subtle); border-radius: 999px; background: var(--surface-2); font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-secondary); font-weight: 700; }
    .r4b-caret { display: inline-block; width: 1px; height: 1em; background: var(--accent-primary); margin-left: 2px; vertical-align: -1px; animation: r4b-caret-blink 1s steps(1, end) infinite; }
    @keyframes r4b-caret-blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
    @media (max-width: 900px) { .r4b-surface { padding: 28px 20px 72px; } .r4b-grid, .r4b-turn-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); } .cell-12, .cell-8, .cell-6 { grid-column: span 6; } .cell-5, .cell-4, .cell-3 { grid-column: span 3; } .r4b-turn { grid-template-columns: 1fr; gap: 8px; } }
  `;
  document.head.appendChild(style);
}

ensureR4BStyles();

Object.assign(window, {
  BLOCK_REGISTRY,
  BLOCK_FAMILIES,
  registerBlock,
  getBlockMeta,
  normalizeBlockTarget,
  Frame,
  Eyebrow,
  Footer,
  FooterChip,
  Icon,
  Spark,
  Bars,
  Hairline,
  Stat,
  ProgressBar,
  DashedHRule,
  AvatarDisc,
  ChannelChip,
  DonutSegments,
  RetentionCurve,
  TimeAxis,
  DeltaText,
  BlockFamilyPage,
  HF_R4B_BlockFamilyA,
  HF_R4B_BlockFamilyB,
  HF_R4B_BlockFamilyC,
  HF_R4B_BlockFamilyD,
  HF_R4B_BlockFamilyE,
  HF_R4B_BlockFamilyF,
  HF_R4B_BlockFamilyG,
  HF_R4B_BlockFamilyH,
  HF_R4B_BlockFamilyI,
  HF_R4B_BlockFamilyJ,
  HF_R4B_BlockFamilyK,
  HF_R4B_BlockFamilyL,
  HF_R4B_BlockFamilyM,
  HF_R4B_BlockFamilyN,
  HF_R4B_BlockFamilyO,
  HF_R4B_BlockFamilyP,
  HF_R4B_BlockFamilyQ,
});
