/* global React, window, document, Icon, R4BStatePill, R4GOutcomeRail */
/* hifi-r4-draft-edit-loop.jsx - shared draft/edit loop primitives for R4G. */

function ensureR4GDraftStyles() {
  if (typeof document === 'undefined' || document.getElementById('r4g-draft-edit-loop-styles')) return;
  const style = document.createElement('style');
  style.id = 'r4g-draft-edit-loop-styles';
  style.textContent = `
    .r4g-draft-card { border: 1px solid var(--border-subtle); border-radius: 8px; background: color-mix(in srgb, var(--surface-1) 90%, var(--accent-soft)); padding: 10px; display: flex; flex-direction: column; gap: 9px; min-width: 0; }
    .r4g-draft-card[data-compact="1"] { padding: 8px; gap: 7px; }
    .r4g-draft-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; min-width: 0; }
    .r4g-draft-title { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .r4g-draft-title strong { font-family: var(--font-serif); font-style: italic; font-size: 15.5px; font-weight: 700; line-height: 1.15; color: var(--fg-primary); letter-spacing: -0.01em; }
    .r4g-draft-title span { font-family: var(--font-mono); font-size: 8.5px; font-weight: 800; letter-spacing: .07em; line-height: 1.35; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4g-draft-copy { margin: 0; padding: 9px; border: 1px solid var(--border-subtle); border-radius: 7px; background: var(--surface-1); font-family: var(--font-serif); font-size: 13.4px; line-height: 1.5; color: var(--fg-primary); }
    .r4g-draft-copy[data-revised="1"] { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; }
    .r4g-draft-actions { display: flex; flex-wrap: wrap; gap: 6px; }
    .r4g-draft-btn { height: 24px; display: inline-flex; align-items: center; gap: 6px; padding: 0 9px; border: 1px solid var(--border-default); border-radius: 999px; background: var(--surface-1); color: var(--fg-primary); font-family: var(--font-sans); font-size: 11px; font-weight: 650; cursor: pointer; white-space: nowrap; }
    .r4g-draft-btn:hover { background: var(--surface-2); border-color: var(--border-strong); }
    .r4g-draft-btn[data-primary="1"] { background: var(--surface-ink); color: var(--fg-on-ink); border-color: var(--surface-ink); }
    .r4g-draft-btn[data-active="1"] { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; }
    .r4g-draft-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; min-width: 0; }
    .r4g-draft-source-card, .r4g-draft-variant, .r4g-draft-revision { min-width: 0; border: 1px solid var(--border-subtle); border-radius: 7px; background: var(--surface-1); padding: 8px; display: flex; flex-direction: column; gap: 6px; }
    .r4g-draft-source-card[data-selected="1"], .r4g-draft-variant[data-selected="1"], .r4g-draft-revision[data-state="accepted"] { background: var(--accent-soft); border-color: transparent; }
    .r4g-draft-meta-row { display: grid; grid-template-columns: 58px minmax(0, 1fr) auto; gap: 8px; align-items: baseline; padding-top: 6px; border-top: 1px dotted var(--border-subtle); }
    .r4g-draft-meta-row:first-child { border-top: 0; padding-top: 0; }
    .r4g-draft-meta-row span { font-family: var(--font-mono); font-size: 8.5px; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4g-draft-meta-row strong { font-family: var(--font-serif); font-style: italic; font-size: 13px; line-height: 1.25; color: var(--fg-primary); }
    .r4g-draft-diff { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; min-width: 0; }
    .r4g-draft-diff-box { min-width: 0; border: 1px solid var(--border-subtle); border-radius: 7px; background: var(--surface-1); padding: 8px; }
    .r4g-draft-diff-box[data-kind="after"] { background: var(--accent-soft); border-color: transparent; }
    .r4g-draft-diff-box span { display: block; font-family: var(--font-mono); font-size: 8px; font-weight: 900; letter-spacing: .07em; text-transform: uppercase; color: var(--fg-tertiary); margin-bottom: 5px; }
    .r4g-draft-diff-box p { margin: 0; font-family: var(--font-serif); font-size: 12.8px; line-height: 1.45; color: var(--fg-primary); }
    .r4g-draft-receipt { border: 1px solid var(--border-subtle); border-radius: 8px; background: var(--surface-1); padding: 10px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .r4g-draft-receipt-row { display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; gap: 8px; align-items: center; padding-top: 7px; border-top: 1px dotted var(--border-subtle); }
    .r4g-draft-receipt-row:first-child { border-top: 0; padding-top: 0; }
    .r4g-draft-receipt-row strong { font-family: var(--font-serif); font-style: italic; font-size: 13.4px; color: var(--fg-primary); line-height: 1.22; }
    .r4g-draft-receipt-row span { font-family: var(--font-mono); font-size: 8.5px; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-tertiary); }
    @media (max-width: 900px) {
      .r4g-draft-grid, .r4g-draft-diff { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

ensureR4GDraftStyles();

const R4G_DRAFT_EDIT_LOOP = {
  slug: 'r4g-draft-edit-loop-v1',
  title: 'Source-backed draft loop',
  routes: {
    thread: '#interactive/blocks/thread-demo',
    draft: '#interactive/blocks/c-draft',
    studio: '#interactive/studio/docs',
    actions: '#interactive/blocks/q-actions',
    sourceThread: '#interactive/library/catalog/post/0042~thread',
    sourceFeed: '#interactive/library/catalog/post/0045~feed',
  },
  sources: [
    { id: '0042', route: '0042~thread', label: 'Primary proof', meta: 'text-thread / own library', match: 94 },
    { id: '0045', route: '0045~feed', label: 'Native framing', meta: 'feed post / own library', match: 84 },
    { id: 'peer', route: 'social', label: 'Outside signal', meta: 'public profile pattern', match: 76 },
  ],
  variants: [
    { id: 'tight', label: 'Tight caption', meta: 'best first pass', score: 92, copy: 'Lead with proof, name the caveat, then ask for the next source.' },
    { id: 'story', label: 'Story thread', meta: 'slower but clearer', score: 86, copy: 'Open with the mistake, then show the repeatable check.' },
    { id: 'script', label: 'Short script', meta: 'needs one more asset', score: 79, copy: 'Turn the proof into a 28 second clip with a source card.' },
  ],
  receipt: [
    { n: '01', label: 'Draft created', meta: 'Studio v1' },
    { n: '02', label: 'Revision applied', meta: 'tightened ask' },
    { n: '03', label: 'Proofs attached', meta: '0042 and 0045' },
    { n: '04', label: 'Approval held', meta: 'schedule only' },
    { n: '05', label: 'Publish blocked', meta: 'manual gate' },
  ],
};

function r4gDraftNavigate(key) {
  const route = (R4G_DRAFT_EDIT_LOOP.routes || {})[key] || key;
  if (!route) return;
  window.location.hash = String(route).replace(/^#/, '#');
}

function r4gDraftRecord(action, patch = {}) {
  if (typeof window === 'undefined') return;
  const detail = { action: String(action || 'Draft updated'), at: Date.now(), ...patch };
  try {
    window.localStorage.setItem('r4g-draft-edit-loop-last-action', JSON.stringify(detail));
  } catch (err) {}
  window.dispatchEvent(new CustomEvent('r4g-draft-edit-loop-action', { detail }));
}

function useR4GDraftAction(defaultAction = null) {
  const [lastAction, setLastAction] = React.useState(defaultAction);
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem('r4g-draft-edit-loop-last-action');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.action) setLastAction(parsed.action);
      }
    } catch (err) {}
    function onAction(e) {
      setLastAction(e.detail && e.detail.action ? e.detail.action : 'Draft updated');
    }
    window.addEventListener('r4g-draft-edit-loop-action', onAction);
    return () => window.removeEventListener('r4g-draft-edit-loop-action', onAction);
  }, []);
  return lastAction;
}

function R4GDraftButton({ children, icon = 'check', primary = false, active = false, onClick }) {
  return (
    <button type="button" className="r4g-draft-btn" data-primary={primary ? '1' : '0'} data-active={active ? '1' : '0'} onClick={onClick}>
      <Icon name={icon} size={9} />{children}
    </button>
  );
}

function R4GDraftSourceTrace({ compact = false, selected = '0042~thread' }) {
  const [active, setActive] = React.useState(selected);
  return (
    <div className="r4g-draft-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-draft-head">
        <div className="r4g-draft-title">
          <strong>Source trace</strong>
          <span>{active} / clickable proof chain</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label="traceable" state="ready" /> : null}
      </div>
      <div className="r4g-draft-grid">
        {R4G_DRAFT_EDIT_LOOP.sources.map(source => (
          <div key={source.route} className="r4g-draft-source-card" data-selected={active === source.route ? '1' : '0'}>
            <div className="r4g-draft-meta-row">
              <span>{source.id}</span>
              <strong>{source.label}</strong>
              <span className="num">{source.match}</span>
            </div>
            <div className="r4g-draft-title">
              <span>{source.meta}</span>
            </div>
            <div className="r4g-draft-actions">
              <R4GDraftButton icon={active === source.route ? 'check' : 'plus'} active={active === source.route} onClick={() => { setActive(source.route); r4gDraftRecord('source kept', { source: source.route }); }}>Use</R4GDraftButton>
              <R4GDraftButton icon="arrow-up-right" onClick={() => source.route === 'social' ? r4gDraftNavigate('actions') : r4gDraftNavigate(`#interactive/library/catalog/post/${source.route}`)}>Preview</R4GDraftButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function R4GDraftRevisionControls({ compact = false }) {
  const [state, setState] = React.useState('clean');
  const lastAction = useR4GDraftAction();
  const status = state === 'saved' ? 'saved' : state === 'proof' ? 'proof added' : state === 'tight' ? 'tightened' : 'draft ready';
  return (
    <div className="r4g-draft-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-draft-head">
        <div className="r4g-draft-title">
          <strong>Revision controls</strong>
          <span>{lastAction || status}</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label={status} state={state === 'saved' ? 'done' : 'active'} live={state !== 'saved'} /> : null}
      </div>
      <div className="r4g-draft-actions">
        <R4GDraftButton primary icon="pencil" active={state === 'tight'} onClick={() => { setState('tight'); r4gDraftRecord('tightened draft'); }}>Tighten</R4GDraftButton>
        <R4GDraftButton icon="plus" active={state === 'proof'} onClick={() => { setState('proof'); r4gDraftRecord('added more proof'); }}>More proof</R4GDraftButton>
        <R4GDraftButton icon="arrow-up-right" active={state === 'saved'} onClick={() => { setState('saved'); r4gDraftRecord('saved to Studio'); r4gDraftNavigate('studio'); }}>Save to Studio</R4GDraftButton>
        <R4GDraftButton icon="warning" onClick={() => { setState('approval'); r4gDraftRecord('approval hold queued'); }}>Approve hold</R4GDraftButton>
      </div>
    </div>
  );
}

function R4GDraftCanvas({ compact = false }) {
  const [revised, setRevised] = React.useState(false);
  const copy = revised
    ? 'The usable version leads with one proof point, names the caveat, then asks for the next source. It stays grounded in your own library and keeps the schedule behind approval.'
    : 'The package can become a post, but the draft needs one tighter promise and a visible proof chain before anything moves into the queue.';
  return (
    <div className="r4g-draft-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-draft-head">
        <div className="r4g-draft-title">
          <strong>Source-backed draft</strong>
          <span>{revised ? 'revision v2 / source trace attached' : 'draft v1 / review required'}</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label={revised ? 'v2 ready' : 'review'} state={revised ? 'ready' : 'approval'} live={!revised} /> : null}
      </div>
      <p className="r4g-draft-copy" data-revised={revised ? '1' : '0'}>{copy}</p>
      <R4GDraftSourceTrace compact />
      <div className="r4g-draft-actions">
        <R4GDraftButton primary icon="pencil" active={revised} onClick={() => { setRevised(true); r4gDraftRecord('tightened draft'); }}>Tighten</R4GDraftButton>
        <R4GDraftButton icon="arrow-up-right" onClick={() => { r4gDraftRecord('saved to Studio'); r4gDraftNavigate('studio'); }}>Save to Studio</R4GDraftButton>
      </div>
    </div>
  );
}

function R4GDraftVariantStack({ compact = false }) {
  const [selected, setSelected] = React.useState('tight');
  return (
    <div className="r4g-draft-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-draft-head">
        <div className="r4g-draft-title">
          <strong>Variant decision</strong>
          <span>{selected} selected / draft can still revise</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label="choose" state="active" live /> : null}
      </div>
      <div className="r4g-draft-grid">
        {R4G_DRAFT_EDIT_LOOP.variants.map(variant => (
          <button key={variant.id} type="button" className="r4g-draft-variant" data-selected={selected === variant.id ? '1' : '0'} onClick={() => { setSelected(variant.id); r4gDraftRecord(`selected ${variant.id} variant`); }}>
            <div className="r4g-draft-meta-row">
              <span>{variant.id}</span>
              <strong>{variant.label}</strong>
              <span className="num">{variant.score}</span>
            </div>
            <div className="r4g-draft-copy" style={{ padding: 0, border: 0, background: 'transparent' }}>{variant.copy}</div>
            <div className="r4g-draft-title"><span>{variant.meta}</span></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function R4GDraftInlinePatch({ compact = false }) {
  const [state, setState] = React.useState('pending');
  return (
    <div className="r4g-draft-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-draft-head">
        <div className="r4g-draft-title">
          <strong>Inline revision patch</strong>
          <span>{state === 'accepted' ? 'accepted / v2' : state === 'reverted' ? 'reverted / v1' : 'pending review'}</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label={state} state={state === 'accepted' ? 'done' : state === 'reverted' ? 'idle' : 'approval'} /> : null}
      </div>
      <div className="r4g-draft-diff">
        <div className="r4g-draft-diff-box">
          <span>Before</span>
          <p>The angle is good, but the first line asks the audience to trust the conclusion before seeing the proof.</p>
        </div>
        <div className="r4g-draft-diff-box" data-kind="after">
          <span>After</span>
          <p>Lead with the proof first, then name the caveat. The ask comes after the viewer can see why it matters.</p>
        </div>
      </div>
      <div className="r4g-draft-actions">
        <R4GDraftButton primary icon="check" active={state === 'accepted'} onClick={() => { setState('accepted'); r4gDraftRecord('revision applied'); }}>Accept patch</R4GDraftButton>
        <R4GDraftButton icon="retry" active={state === 'reverted'} onClick={() => { setState('reverted'); r4gDraftRecord('revision reverted'); }}>Restore v1</R4GDraftButton>
      </div>
    </div>
  );
}

function R4GDraftApprovalPackage({ compact = false }) {
  const [held, setHeld] = React.useState(false);
  return (
    <div className="r4g-draft-card" data-compact={compact ? '1' : '0'}>
      <div className="r4g-draft-head">
        <div className="r4g-draft-title">
          <strong>Approval after draft review</strong>
          <span>{held ? 'schedule hold approved / no publish' : 'waiting on draft approval'}</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label={held ? 'hold approved' : 'needs review'} state={held ? 'done' : 'approval'} live={!held} /> : null}
      </div>
      {window.R4GOutcomeRail && <R4GOutcomeRail active="approval" compact title="Draft review gates the action" right="schedule stays manual" />}
      <div className="r4g-draft-grid">
        {[
          ['Draft', 'v2 selected', 'done'],
          ['Sources', '0042 / 0045 attached', 'done'],
          ['Revision', 'tightened ask applied', 'done'],
          ['Schedule', 'hold only', held ? 'done' : 'approval'],
        ].map(([left, main, state]) => (
          <div key={left} className="r4g-draft-revision" data-state={state === 'done' ? 'accepted' : 'pending'}>
            <div className="r4g-draft-meta-row">
              <span>{left}</span>
              <strong>{main}</strong>
              <span>{state}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="r4g-draft-actions">
        <R4GDraftButton primary icon="warning" active={held} onClick={() => { setHeld(true); r4gDraftRecord('approval hold approved'); }}>Approve hold</R4GDraftButton>
        <R4GDraftButton icon="pencil" onClick={() => r4gDraftRecord('revision requested')}>Request revision</R4GDraftButton>
        <R4GDraftButton icon="arrow-up-right" onClick={() => r4gDraftNavigate('actions')}>Open queue</R4GDraftButton>
      </div>
    </div>
  );
}

function R4GDraftReceipt({ compact = false }) {
  return (
    <div className="r4g-draft-receipt" data-compact={compact ? '1' : '0'}>
      {R4G_DRAFT_EDIT_LOOP.receipt.map(row => (
        <div key={row.n} className="r4g-draft-receipt-row">
          <span className="num mono" style={{ color: 'var(--accent-primary)', fontWeight: 900 }}>{row.n}</span>
          <strong>{row.label}</strong>
          <span>{row.meta}</span>
        </div>
      ))}
    </div>
  );
}

function R4GDraftStudioArtifact({ compact = false, onOpenDoc }) {
  const [status, setStatus] = React.useState('saved');
  const lastAction = useR4GDraftAction('saved to Studio');
  return (
    <div className="r4g-draft-card" data-compact={compact ? '1' : '0'} data-studio-artifact="1">
      <div className="r4g-draft-head">
        <div className="r4g-draft-title">
          <strong>Chat-created draft package</strong>
          <span>{lastAction || status} / source trace preserved</span>
        </div>
        {window.R4BStatePill ? <R4BStatePill label={status} state={status === 'revision' ? 'approval' : 'done'} live={status === 'revision'} /> : null}
      </div>
      <div className="r4g-draft-grid">
        <div className="r4g-draft-source-card" data-selected="1">
          <div className="r4g-draft-meta-row"><span>v2</span><strong>Tight caption package</strong><span>saved</span></div>
          <p className="r4g-draft-copy" style={{ padding: 0, border: 0, background: 'transparent' }}>Draft, source chips, and schedule hold came from the active thread.</p>
        </div>
        <div className="r4g-draft-source-card">
          <div className="r4g-draft-meta-row"><span>Gate</span><strong>Schedule approval only</strong><span>manual</span></div>
          <p className="r4g-draft-copy" style={{ padding: 0, border: 0, background: 'transparent' }}>The saved artifact can queue a hold, but cannot publish without approval.</p>
        </div>
      </div>
      <div className="r4g-draft-actions">
        <R4GDraftButton primary icon="arrow-up-right" onClick={() => { r4gDraftRecord('opened Studio draft'); if (onOpenDoc) onOpenDoc(); }}>Open draft</R4GDraftButton>
        <R4GDraftButton icon="arrow-up-right" onClick={() => r4gDraftNavigate('sourceThread')}>0042 proof</R4GDraftButton>
        <R4GDraftButton icon="arrow-up-right" onClick={() => r4gDraftNavigate('sourceFeed')}>0045 proof</R4GDraftButton>
        <R4GDraftButton icon="pencil" active={status === 'revision'} onClick={() => { setStatus('revision'); r4gDraftRecord('revision requested from Studio'); }}>Request revision</R4GDraftButton>
        <R4GDraftButton icon="retry" onClick={() => { setStatus('restored'); r4gDraftRecord('restored v1'); }}>Restore v1</R4GDraftButton>
      </div>
    </div>
  );
}

Object.assign(window, {
  R4G_DRAFT_EDIT_LOOP,
  R4GDraftSourceTrace,
  R4GDraftRevisionControls,
  R4GDraftCanvas,
  R4GDraftVariantStack,
  R4GDraftInlinePatch,
  R4GDraftApprovalPackage,
  R4GDraftReceipt,
  R4GDraftStudioArtifact,
  r4gDraftNavigate,
  r4gDraftRecord,
});
