/* global React, window, document, Icon, ProgressBar, R4BStatePill, R4BPostHitCard, R4BSocialProfileCard, R4BMediaTransferCard, ChannelChip */
/* hifi-r4-outcome-loop.jsx - shared R4G outcome-loop scenario and workflow primitives. */

function ensureR4GOutcomeStyles() {
  if (typeof document === 'undefined' || document.getElementById('r4g-outcome-loop-styles')) return;
  const style = document.createElement('style');
  style.id = 'r4g-outcome-loop-styles';
  style.textContent = `
    .r4g-outcome-card { border: 1px solid var(--border-subtle); border-radius: 8px; background: color-mix(in srgb, var(--surface-1) 88%, var(--accent-soft)); padding: 10px; display: flex; flex-direction: column; gap: 9px; min-width: 0; }
    .r4g-outcome-card[data-compact="1"] { padding: 8px; gap: 7px; }
    .r4g-outcome-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; min-width: 0; }
    .r4g-outcome-title { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .r4g-outcome-title strong { font-family: var(--font-serif); font-style: italic; font-size: 15.4px; font-weight: 700; line-height: 1.15; color: var(--fg-primary); letter-spacing: -0.01em; }
    .r4g-outcome-title span { font-family: var(--font-mono); font-size: 8.5px; font-weight: 800; letter-spacing: .07em; line-height: 1.35; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4g-outcome-step-row { display: grid; grid-template-columns: repeat(var(--r4g-outcome-count, 6), minmax(0, 1fr)); gap: 6px; min-width: 0; }
    .r4g-outcome-step { min-width: 0; border: 1px solid var(--border-subtle); border-radius: 7px; background: var(--surface-1); padding: 7px; display: flex; flex-direction: column; gap: 5px; }
    .r4g-outcome-step[data-state="done"] { background: var(--accent-soft); border-color: transparent; }
    .r4g-outcome-step[data-state="active"] { background: color-mix(in srgb, var(--accent-soft) 74%, var(--surface-1)); border-color: var(--accent-ring); }
    .r4g-outcome-step[data-state="approval"] { background: var(--tone-warning-bg); border-color: transparent; }
    .r4g-outcome-step strong { font-family: var(--font-mono); font-size: 8px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-outcome-step span { font-family: var(--font-serif); font-size: 11px; line-height: 1.2; color: var(--fg-secondary); overflow-wrap: anywhere; }
    .r4g-outcome-step[data-state="active"] strong, .r4g-outcome-step[data-state="done"] strong { color: var(--accent-primary-press); }
    .r4g-outcome-actions { display: flex; flex-wrap: wrap; gap: 6px; }
    .r4g-outcome-btn { height: 24px; display: inline-flex; align-items: center; gap: 6px; padding: 0 9px; border: 1px solid var(--border-default); border-radius: 999px; background: var(--surface-1); color: var(--fg-primary); font-family: var(--font-sans); font-size: 11px; font-weight: 650; cursor: pointer; white-space: nowrap; }
    .r4g-outcome-btn:hover { background: var(--surface-2); border-color: var(--border-strong); }
    .r4g-outcome-btn[data-primary="1"] { background: var(--surface-ink); color: var(--fg-on-ink); border-color: var(--surface-ink); }
    .r4g-outcome-btn[data-active="1"] { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; }
    .r4g-outcome-source-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; min-width: 0; }
    .r4g-outcome-source-grid[data-compact="1"] { grid-template-columns: 1fr; }
    .r4g-outcome-receipt { border: 1px solid var(--border-subtle); border-radius: 8px; background: var(--surface-1); padding: 10px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .r4g-outcome-receipt-row { display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; gap: 8px; align-items: center; padding-top: 7px; border-top: 1px dotted var(--border-subtle); }
    .r4g-outcome-receipt-row:first-child { border-top: 0; padding-top: 0; }
    .r4g-outcome-receipt-row strong { font-family: var(--font-serif); font-style: italic; font-size: 13.5px; color: var(--fg-primary); line-height: 1.22; }
    .r4g-outcome-receipt-row span { font-family: var(--font-mono); font-size: 8.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4g-outcome-package { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; min-width: 0; }
    .r4g-outcome-package-item { min-width: 0; border: 1px solid var(--border-subtle); border-radius: 7px; background: var(--surface-2); padding: 8px; }
    .r4g-outcome-package-item strong { display: block; font-family: var(--font-mono); font-size: 8.4px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4g-outcome-package-item span { display: block; margin-top: 5px; font-family: var(--font-serif); font-style: italic; font-size: 13px; line-height: 1.22; color: var(--fg-primary); }
    @media (max-width: 900px) {
      .r4g-outcome-step-row, .r4g-outcome-source-grid, .r4g-outcome-package { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

ensureR4GOutcomeStyles();

const R4G_OUTCOME_LOOP = {
  slug: 'r4g-outcome-loop-v1',
  title: 'Launch-ready read',
  prompt: 'Build the launch-ready read from my library, outside signal, and source media.',
  routes: {
    thread: '#interactive/blocks/thread-demo',
    library: '#interactive/blocks/n-own-content',
    social: '#interactive/blocks/o-social-intel',
    imports: '#interactive/blocks/p-imports',
    actions: '#interactive/blocks/q-actions',
    sourceThread: '#interactive/library/catalog/post/0042~thread',
    sourceFeed: '#interactive/library/catalog/post/0045~feed',
  },
  steps: [
    { id: 'ask', label: 'Ask', meta: 'thread scope' },
    { id: 'library', label: 'Own proof', meta: '0042 / 0045' },
    { id: 'social', label: 'Outside signal', meta: 'public peers' },
    { id: 'preview', label: 'Preview', meta: 'source detail' },
    { id: 'package', label: 'Package', meta: 'draft + assets' },
    { id: 'approval', label: 'Approve', meta: 'schedule gate' },
    { id: 'receipt', label: 'Receipt', meta: 'trace saved' },
  ],
  sources: [
    { postId: '0042', variant: 'thread', route: '0042~thread', match: 94, reason: 'best internal proof', role: 'text-thread proof' },
    { postId: '0045', variant: 'feed', route: '0045~feed', match: 84, reason: 'native feed framing', role: 'feed post proof' },
    { postId: '0044', variant: 'youtube', route: '0044~youtube', match: 88, reason: 'horizontal proof shape', role: 'YouTube proof' },
  ],
  package: [
    { label: 'Draft', value: '3 channel variants' },
    { label: 'Sources', value: '7 attached proofs' },
    { label: 'Gate', value: 'schedule approval' },
  ],
};

function r4gOutcomeStepState(stepId, activeId) {
  const ids = R4G_OUTCOME_LOOP.steps.map(s => s.id);
  const index = ids.indexOf(stepId);
  const activeIndex = ids.indexOf(activeId || 'ask');
  if (index < activeIndex) return 'done';
  if (index === activeIndex) return activeId === 'approval' ? 'approval' : 'active';
  return 'pending';
}

function r4gOutcomeNavigate(key) {
  const route = (R4G_OUTCOME_LOOP.routes || {})[key] || key;
  if (!route) return;
  window.location.hash = String(route).replace(/^#/, '#');
}

function r4gOutcomeRecord(action) {
  if (typeof window === 'undefined') return;
  const detail = { action: String(action || 'Updated'), at: Date.now() };
  try {
    window.localStorage.setItem('r4g-outcome-loop-last-action', JSON.stringify(detail));
  } catch (err) {}
  window.dispatchEvent(new CustomEvent('r4g-outcome-loop-action', { detail }));
}

function R4GOutcomeRail({ active = 'ask', compact = false, title = 'Outcome loop', right = 'one runnable path' }) {
  const [lastAction, setLastAction] = React.useState(null);
  React.useEffect(() => {
    function onAction(e) {
      setLastAction(e.detail && e.detail.action ? e.detail.action : 'Updated');
    }
    window.addEventListener('r4g-outcome-loop-action', onAction);
    return () => window.removeEventListener('r4g-outcome-loop-action', onAction);
  }, []);
  return (
    <div className="r4g-outcome-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-outcome-head">
        <div className="r4g-outcome-title">
          <strong>{title}</strong>
          <span>{lastAction ? `last action: ${lastAction}` : right}</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label={active} state={active === 'approval' ? 'approval' : 'active'} live={active !== 'receipt'} /> : null}
      </div>
      <div className="r4g-outcome-step-row" style={{ '--r4g-outcome-count': R4G_OUTCOME_LOOP.steps.length }}>
        {R4G_OUTCOME_LOOP.steps.map(step => (
          <div key={step.id} className="r4g-outcome-step" data-state={r4gOutcomeStepState(step.id, active)}>
            <strong>{step.label}</strong>
            <span>{step.meta}</span>
          </div>
        ))}
      </div>
      <div className="r4g-outcome-actions">
        <button type="button" className="r4g-outcome-btn" data-primary="1" onClick={() => r4gOutcomeNavigate('thread')}><Icon name="arrow-up-right" size={9} />Thread</button>
        <button type="button" className="r4g-outcome-btn" onClick={() => r4gOutcomeNavigate('library')}><Icon name="arrow-up-right" size={9} />Own proof</button>
        <button type="button" className="r4g-outcome-btn" onClick={() => r4gOutcomeNavigate('actions')}><Icon name="arrow-up-right" size={9} />Actions</button>
      </div>
    </div>
  );
}

function R4GOutcomeSourceTray({ compact = false, activeRoute = '0042~thread', onSelect }) {
  const [selected, setSelected] = React.useState(activeRoute);
  function choose(source) {
    setSelected(source.route);
    r4gOutcomeRecord(`selected ${source.route}`);
    if (onSelect) onSelect(source);
  }
  return (
    <div className="r4g-outcome-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-outcome-head">
        <div className="r4g-outcome-title">
          <strong>Selected evidence</strong>
          <span>{selected} / routes to library detail</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label="usable" state="ready" /> : null}
      </div>
      <div className="r4g-outcome-source-grid" data-compact={compact ? '1' : '0'}>
        {R4G_OUTCOME_LOOP.sources.map(source => (
          <div key={source.route} style={{ outline: selected === source.route ? '2px solid var(--accent-ring)' : 0, borderRadius: 8 }}>
            <R4BPostHitCard {...source} size={compact ? 'compact' : 'gallery'} />
            <div className="r4g-outcome-actions" style={{ marginTop: 6 }}>
              <button type="button" className="r4g-outcome-btn" data-active={selected === source.route ? '1' : '0'} onClick={() => choose(source)}><Icon name={selected === source.route ? 'check' : 'plus'} size={9} />Use</button>
              <button type="button" className="r4g-outcome-btn" onClick={() => r4gOutcomeNavigate(`#interactive/library/catalog/post/${source.route}`)}><Icon name="arrow-up-right" size={9} />Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function R4GOutcomePackage({ active = 'package', compact = false }) {
  return (
    <div className="r4g-outcome-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-outcome-head">
        <div className="r4g-outcome-title">
          <strong>Draft package</strong>
          <span>draft / sources / approval gate</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label={active === 'approval' ? 'needs approval' : 'ready'} state={active === 'approval' ? 'approval' : 'ready'} /> : null}
      </div>
      <div className="r4g-outcome-package">
        {R4G_OUTCOME_LOOP.package.map(item => (
          <div key={item.label} className="r4g-outcome-package-item">
            <strong>{item.label}</strong>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
      <div className="r4g-outcome-actions">
        <button type="button" className="r4g-outcome-btn" data-primary="1" onClick={() => r4gOutcomeRecord('package reviewed')}><Icon name="check" size={9} />Mark reviewed</button>
        <button type="button" className="r4g-outcome-btn" onClick={() => r4gOutcomeNavigate('actions')}><Icon name="arrow-up-right" size={9} />Open queue</button>
      </div>
    </div>
  );
}

function R4GOutcomeReceipt({ compact = false }) {
  const rows = [
    { n: '01', label: 'Draft created', meta: 'Studio v1' },
    { n: '02', label: 'Revision applied', meta: 'tightened ask' },
    { n: '03', label: 'Proofs attached', meta: '0042 and 0045' },
    { n: '04', label: 'Approval held', meta: 'schedule only' },
    { n: '05', label: 'Publish blocked', meta: 'manual gate' },
  ];
  return (
    <div className="r4g-outcome-receipt" data-compact={compact ? '1' : '0'}>
      {rows.map(row => (
        <div key={row.n} className="r4g-outcome-receipt-row">
          <span className="num mono" style={{ color: 'var(--accent-primary)', fontWeight: 900 }}>{row.n}</span>
          <strong>{row.label}</strong>
          <span>{row.meta}</span>
        </div>
      ))}
    </div>
  );
}

function R4GOutcomeMediaStack() {
  return (
    <div className="r4g-outcome-card">
      <div className="r4g-outcome-head">
        <div className="r4g-outcome-title">
          <strong>Import enters the same run</strong>
          <span>entry / upload / processing / ready / retry</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label="partial usable" state="partial" /> : null}
      </div>
      <R4BMediaTransferCard
        title="Source media for this answer"
        subtitle="source-clip.mp4 / transcript.vtt / screenshot.png"
        state="partial"
        pct={78}
        files={[
          { name: 'source-clip.mp4', meta: 'uploaded and parsed', pct: 100, state: 'done' },
          { name: 'transcript.vtt', meta: 'aligned to 96%', pct: 96, state: 'done' },
          { name: 'screenshot.png', meta: 'OCR masked 2 fields', pct: 42, state: 'partial' },
        ]}
        stages={[
          { label: 'Entry', meta: 'dropped', state: 'done' },
          { label: 'Upload', meta: 'copied', state: 'done' },
          { label: 'Parse', meta: 'moments ready', state: 'done' },
          { label: 'OCR', meta: 'partial', state: 'partial' },
          { label: 'Use', meta: 'with caveat', state: 'approval' },
        ]}
        note="Partial import can still contribute to the package when the receipt carries the caveat."
      />
    </div>
  );
}

Object.assign(window, {
  R4G_OUTCOME_LOOP,
  R4GOutcomeRail,
  R4GOutcomeSourceTray,
  R4GOutcomePackage,
  R4GOutcomeReceipt,
  R4GOutcomeMediaStack,
  r4gOutcomeNavigate,
  r4gOutcomeRecord,
});
