/* global React, window, HfShell, Icon, getBlockMeta, Eyebrow */
/* global R4BStreamingText, R4BReasoningTrail, R4BToolRun, R4BDemoControls, R4BComposer, R4BDataEntryState, R4BLatencySteps, R4GOutcomeRail, R4GOutcomePackage, R4GOutcomeReceipt, R4GDraftReceipt */
/* global Frame, HF_R4B_RESOLVE_ENTITY */
/* hifi-r4-blocks-thread-demo.jsx — playable in-thread composition proof. */

const R4B_CHAT_BEATS = [
  { role: 'Henry', ts: '09:42', copy: 'Why did retention drop on the last six safety primers? Open the data and tell me where they leave.' },
  {
    role: 'Coopr',
    ts: '+0:03',
    beforeText: 'The drop happens at {{EM:0:03}} and again at {{EM:0:14}}. The first cuts {{ACC:−14% vs your benchmark}}. The second is normal mid-attention.',
    afterText: 'Hooks above {{EM:1.8s}} correlate. Your last six averaged {{NUM:1.96|accent}}s. The two posts that held attention opened in under {{NUM:1.2|accent}}s.',
    tool: { name: 'Charting', target: 'retention · last 6 safety' },
    reasoningSteps: [
      { label: 'Reading 6 safety posts', detail: 'retention curves', sources: 6 },
      { label: 'Querying audience', detail: 'last 30 days', sources: 1 },
      { label: 'Comparing to top quartile', detail: 'n=12', sources: 1 },
    ],
    blockGroups: [{ mode: 'single', ids: ['A01'] }],
    chips: ['Save chart', 'Open in Audience', 'Draft a fix', 'More'],
  },
  { role: 'Henry', ts: '09:45', copy: 'Compare that against the closest thing that worked.' },
  {
    role: 'Coopr',
    ts: '+0:04',
    beforeText: 'The closest winner is shorter, clearer, and gives the viewer one promise before the chart starts.',
    afterText: 'The rewrite should keep the opening under {{NUM:1.2|accent}}s, then move into the caveat after the first visual proof.',
    tool: { name: 'Comparison pack', target: 'Library · Studio' },
    reasoningSteps: [
      { label: 'Pairing nearest winner', detail: 'same format', sources: 2 },
      { label: 'Measuring deltas', detail: 'hold and save', sources: 1 },
      { label: 'Drafting rewrite direction', detail: 'one action', sources: 0 },
    ],
    blockGroups: [
      { mode: 'compare', ids: ['B01', 'B02'] },
      { mode: 'single', ids: ['B07'] },
    ],
    chips: ['Save comparison', 'Open in Studio', 'Use rewrite'],
  },
  { role: 'Henry', ts: '09:52', copy: 'Give me copy options I can ship without making it sound generic.' },
  {
    role: 'Coopr',
    ts: '+0:05',
    beforeText: 'I drafted from the current voice memory first, then narrowed the options to the ones that make a clear promise.',
    afterText: 'Use option two for the opener, keep the caption plain, and send the reply only after the chart lands.',
    tool: { name: 'Draft generator', target: 'Studio · Memory' },
    reasoningSteps: [
      { label: 'Reading voice memory', detail: 'pinned rules', sources: 3 },
      { label: 'Drafting hooks', detail: 'three options', sources: 0 },
      { label: 'Checking reply tone', detail: 'inbox fit', sources: 1 },
    ],
    blockGroups: [
      { mode: 'stack', ids: ['C01', 'C02', 'C05'] },
      { mode: 'single', ids: ['C06'] },
    ],
    chips: ['Save drafts', 'Open in Studio', 'Queue reply'],
  },
  { role: 'Henry', ts: '10:01', copy: 'Who is this actually for?' },
  {
    role: 'Coopr',
    ts: '+0:04',
    beforeText: 'Two audience groups are driving the question: returning learners and high-intent commenters who ask for safer process.',
    afterText: 'The safest framing is practical, not dramatic: show the failure mode, then give the repeatable check.',
    tool: { name: 'Audience merge', target: 'Insights · Audience' },
    reasoningSteps: [
      { label: 'Grouping commenters', detail: 'intent', sources: 2 },
      { label: 'Checking affinity', detail: 'returning viewers', sources: 1 },
      { label: 'Mapping tone', detail: 'comment language', sources: 1 },
    ],
    blockGroups: [
      { mode: 'stack', ids: ['D01', 'D02', 'D08'] },
      { mode: 'single', ids: ['D04'] },
    ],
    chips: ['Save audience read', 'Open Audience', 'Apply tone'],
  },
  { role: 'Henry', ts: '10:06', copy: 'Find a clean slot and flag schedule risk.' },
  {
    role: 'Coopr',
    ts: '+0:04',
    beforeText: 'The best slot is open, but there is one nearby collision and one cadence risk if this moves later.',
    afterText: 'Ship the read in the open evening window, then hold the heavier follow-up for the next clean day.',
    tool: { name: 'Schedule model', target: 'Calendar' },
    reasoningSteps: [
      { label: 'Reading cadence', detail: 'last 8 weeks', sources: 1 },
      { label: 'Testing slots', detail: 'audience open rate', sources: 1 },
      { label: 'Checking conflicts', detail: 'week view', sources: 0 },
    ],
    blockGroups: [{ mode: 'grid', ids: ['E01', 'E02', 'E05', 'E08'] }],
    chips: ['Save slot', 'Open Calendar', 'Resolve collision'],
  },
  { role: 'Henry', ts: '10:10', copy: 'Can we test the opener instead of guessing?' },
  {
    role: 'Coopr',
    ts: '+0:04',
    beforeText: 'Yes. The B variant has the stronger first promise, and the hold map gives you a clean early read.',
    afterText: 'Run the hook test first; if early hold beats forecast, ship the longer version into the same audience segment.',
    tool: { name: 'Hook experiment', target: 'Studio' },
    reasoningSteps: [
      { label: 'Sizing sample', detail: 'forecast', sources: 1 },
      { label: 'Ranking variants', detail: 'hook strength', sources: 0 },
      { label: 'Selecting hold map', detail: 'primary readout', sources: 0 },
    ],
    blockGroups: [{ mode: 'stack', ids: ['F01', 'F03', 'F06'] }],
    chips: ['Start test', 'Save variants', 'Open Studio'],
  },
  { role: 'Henry', ts: '10:14', copy: 'Make sure the final answer still sounds like me.' },
  {
    role: 'Coopr',
    ts: '+0:03',
    beforeText: 'The voice memory rules are clear: concrete, low-drama, and never over-selling the lesson.',
    afterText: 'Keep the final line as a field note, not a slogan. That preserves the voice while still making the fix obvious.',
    tool: { name: 'Voice guardrails', target: 'Intel · Memory' },
    reasoningSteps: [
      { label: 'Reading pinned facts', detail: 'memory', sources: 4 },
      { label: 'Checking forbidden phrases', detail: 'guardrails', sources: 1 },
      { label: 'Sampling style lines', detail: 'current draft', sources: 0 },
    ],
    blockGroups: [{ mode: 'grid', ids: ['G01', 'G02', 'G04', 'G06'] }],
    chips: ['Lock voice', 'Open Memory', 'Patch draft'],
  },
  { role: 'Henry', ts: '10:18', copy: 'What should I answer in the inbox?' },
  {
    role: 'Coopr',
    ts: '+0:05',
    beforeText: 'The inbox has one urgent cluster and one reply you can bank for the next post.',
    afterText: 'Answer the question cluster now; save the lighter reply bank for the follow-up thread.',
    tool: { name: 'Inbox triage', target: 'Inbox' },
    reasoningSteps: [
      { label: 'Clustering replies', detail: 'intent groups', sources: 2 },
      { label: 'Ranking urgency', detail: 'high value', sources: 1 },
      { label: 'Drafting response', detail: 'voice match', sources: 0 },
    ],
    blockGroups: [{ mode: 'grid', ids: ['H01', 'H02', 'H05', 'H06'] }],
    chips: ['Save replies', 'Open Inbox', 'Send later'],
  },
  { role: 'Henry', ts: '10:24', copy: 'What external intel supports the angle?' },
  {
    role: 'Coopr',
    ts: '+0:07',
    beforeText: 'The outside signal is strong enough to cite, but the useful framing is still your own library pattern.',
    afterText: 'Use one external reference as context, then return to the internal retention proof so the post stays grounded.',
    tool: { name: 'Intel sweep', target: 'Intel' },
    reasoningSteps: [
      { label: 'Reading trend radar', detail: 'rising topics', sources: 2 },
      { label: 'Checking peer posts', detail: 'velocity', sources: 3 },
      { label: 'Attaching references', detail: 'source list', sources: 4 },
    ],
    blockGroups: [{ mode: 'grid', ids: ['I01', 'I02', 'I04', 'I08'] }],
    chips: ['Save sources', 'Open Intel', 'Attach citation'],
  },
  { role: 'Henry', ts: '10:31', copy: 'File this with the project and show the caveats.' },
  {
    role: 'Coopr',
    ts: '+0:04',
    beforeText: 'I filed the project read, attached the strongest library hit, and wrote the caveats beside the decision.',
    afterText: 'The launch-ready read is now in the workspace with its decision, checklist, source post, and disclosure attached.',
    tool: { name: 'Workspace save', target: 'Studio · Workspace' },
    reasoningSteps: [
      { label: 'Creating project note', detail: 'workspace', sources: 0 },
      { label: 'Pulling library hit', detail: 'source post', sources: 1 },
      { label: 'Writing caveats', detail: 'disclosure', sources: 0 },
    ],
    blockGroups: [
      { mode: 'grid', ids: ['J01', 'J03', 'K01', 'L01'] },
      { mode: 'stack', ids: ['J06', 'K03', 'L06'] },
    ],
    chips: ['Save read', 'Open Workspace', 'Export summary'],
  },
  { role: 'Henry', ts: '10:38', copy: 'Now make that a launch-ready package. Pull my own proof, check outside signal, and stop before anything schedules.' },
  {
    role: 'Coopr',
    ts: '+0:06',
    entryState: {
      title: 'Building the outcome loop',
      source: 'thread / library / social / imports / actions',
      detail: 'I am reading the thread, pulling own proof, checking public social signal, and keeping the external action behind an approval gate.',
      items: [
        { label: 'Thread scope', meta: 'current conversation and branch chips', state: 'done', pct: 100 },
        { label: 'Own content', meta: '404 library posts ranked', state: 'active', pct: 68, live: true },
        { label: 'External intel', meta: 'public sources only', state: 'pending', pct: 0 },
      ],
    },
    latencyTitle: 'Visible run phases',
    latencySteps: [
      { label: 'Context read', meta: 'thread + memory', state: 'done', pct: 100 },
      { label: 'Tool runs', meta: 'library and social', state: 'active', pct: 62 },
      { label: 'Stream answer', meta: 'reasoning first', state: 'pending', pct: 0 },
      { label: 'Render blocks', meta: 'materialize package', state: 'pending', pct: 0 },
      { label: 'Queue action', meta: 'approval only', state: 'approval', pct: 0 },
    ],
    beforeText: 'I found two own-content proofs and one public social pattern. I am using your library as the anchor and the outside signal only as context.',
    afterText: 'The draft is ready to edit before the action queue. It has a selected variant, source trace, revision patch, and a schedule hold that still needs approval.',
    tool: {
      name: 'Outcome loop run',
      target: 'Library · Intel · Studio',
      steps: [
        { label: 'Own proof', meta: '0042 and 0045 selected', state: 'done', pct: 100 },
        { label: 'Social scan', meta: 'public peer profiles', state: 'done', pct: 100 },
        { label: 'Draft', meta: 'variant and revision', state: 'active', pct: 72 },
        { label: 'Approval', meta: 'schedule hold after review', state: 'approval', pct: 0 },
      ],
    },
    reasoningSteps: [
      { label: 'Pulling own proof', detail: 'similar posts', sources: 12 },
      { label: 'Checking public profile signal', detail: 'peers and comments', sources: 6 },
      { label: 'Separating draft from schedule', detail: 'approval boundary', sources: 0 },
    ],
    blockGroups: [
      { mode: 'grid', ids: ['M01', 'N01', 'O01', 'P03'] },
      { mode: 'grid', ids: ['C10', 'C11', 'C12', 'C13'] },
      { mode: 'grid', ids: ['Q01', 'Q05', 'Q06', 'Q08'] },
    ],
    chips: [
      { label: 'Tighten', icon: 'pencil', branchId: 'tighten', openLabel: 'Tightened' },
      { label: 'More proof', icon: 'plus', branchId: 'proof', openLabel: 'Proof added' },
      { label: 'Save to Studio', icon: 'arrow-up-right', branchId: 'studio', openLabel: 'Studio saved' },
      { label: 'Approve hold', icon: 'warning', branchId: 'approval', openLabel: 'Hold approved' },
    ],
    branches: [
      {
        id: 'tighten',
        title: 'Revision applied',
        kicker: 'DRAFT EDIT',
        copy: 'The draft now leads with proof, names the caveat, and leaves scheduling behind the approval gate.',
        blockGroups: [{ mode: 'grid', ids: ['C12', 'C13'] }],
      },
      {
        id: 'proof',
        title: 'More proof added',
        kicker: 'OWN PROOF',
        copy: 'The bundle keeps the text-thread post as primary proof and the feed post as native framing. Both still route to full detail views.',
        blockGroups: [{ mode: 'grid', ids: ['N02', 'N03', 'C13'] }],
      },
      {
        id: 'studio',
        title: 'Saved to Studio',
        kicker: 'DRAFT ARTIFACT',
        copy: 'The editable draft, source chips, and revision status are now visible in Studio Docs. The action queue still waits.',
        blockGroups: [{ mode: 'grid', ids: ['C10', 'Q06'] }],
      },
      {
        id: 'approval',
        title: 'Approval hold queued',
        kicker: 'NO PUBLISH',
        copy: 'The schedule hold is reversible and does not publish. The receipt records the draft, revision, proofs, and manual boundary.',
        blockGroups: [{ mode: 'grid', ids: ['Q04', 'Q08'] }],
      },
    ],
  },
];

function r4bBeatBlocks(beat) {
  return (beat.blockGroups || []).flatMap(group => group.ids || []);
}

function makeR4BDemoEvents(beats) {
  const events = [];
  beats.forEach((beat, turnIndex) => {
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

const R4B_THREAD_TURNS = R4B_CHAT_BEATS.map(beat => ({
  role: beat.role,
  ts: beat.ts,
  copy: beat.copy || beat.beforeText || '',
  reasoning: beat.reasoningSteps ? 'Reasoning trail' : null,
  tool: beat.tool || null,
  steps: beat.reasoningSteps || [],
  blocks: r4bBeatBlocks(beat),
}));

const R4B_DEMO_EVENTS = makeR4BDemoEvents(R4B_CHAT_BEATS);

function R4BBeatState(turnIndex, step, status) {
  const visible = { copy: false, entry: false, latency: false, reasoning: false, before: false, tool: false, groups: [], after: false, chips: false };
  for (let i = 0; i < Math.min(step, R4B_DEMO_EVENTS.length); i++) {
    const event = R4B_DEMO_EVENTS[i];
    if (event.turnIndex !== turnIndex) continue;
    if (event.type === 'group') visible.groups[event.groupIndex] = true;
    else visible[event.type] = true;
  }
  const active = status === 'playing' ? R4B_DEMO_EVENTS[Math.max(0, step - 1)] : null;
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
          <div className="blk"><Eyebrow left="FIG · MISSING BLOCK" right={id} /><p className="serif-it" style={{ margin: 0 }}>Block not registered.</p></div>
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

function r4bChipItem(raw, index) {
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
        const item = r4bChipItem(raw, index);
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
            key={label}
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
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="r4bd-turn-grid" data-mode={group.mode || 'single'} data-block-count={(group.ids || []).length}>
          {(group.ids || []).map(id => <R4BBlockMount key={id} id={id} active />)}
        </div>
      ))}
      {branch.note && <p className="r4bd-turn-copy" style={{ margin: 0 }}>{branch.note}</p>}
    </div>
  );
}

function R4BTurn({ beat, index, state, status, speed, onBranch, revealedBranches = {} }) {
  if (!state.copy) return null;
  const role = beat.role === 'Coopr' ? 'Coopr' : 'Henry';
  const anyGroupVisible = state.groups.some(Boolean);
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
            data-mode={group.mode || 'stack'}
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

function HF_R4B_ThreadDemo() {
  const total = R4B_DEMO_EVENTS.length;
  const distinct = Array.from(new Set(R4B_CHAT_BEATS.flatMap(r4bBeatBlocks)));
  const [status, setStatus] = React.useState('idle');
  const [step, setStep] = React.useState(0);
  const [speed, setSpeed] = React.useState(2);
  const [composerValue, setComposerValue] = React.useState('Build me the launch-ready read from this thread.');
  const [queuedPrompt, setQueuedPrompt] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [revealedBranches, setRevealedBranches] = React.useState({});
  const scrollRef = React.useRef(null);
  const scrollTargetRef = React.useRef(null);

  React.useEffect(() => {
    if (status !== 'playing') return undefined;
    if (step >= total) {
      setStatus('done');
      return undefined;
    }
    const delay = Math.max(320, 1180 / speed);
    const id = window.setTimeout(() => {
      setStep(current => Math.min(total, current + 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [status, step, total, speed]);

  React.useEffect(() => {
    if (status === 'playing' && step >= total) setStatus('done');
  }, [status, step, total]);

  React.useEffect(() => {
    if (!scrollRef.current) return;
    const target = scrollTargetRef.current;
    if (target) {
      const selector = target === 'receipt' ? '[data-demo-receipt="1"]' : target === 'draft' ? '[data-demo-block-id="C10"]' : `[data-turn="${target}"]`;
      const el = scrollRef.current.querySelector(selector);
      scrollTargetRef.current = null;
      if (el) {
        try {
          const scrollToTarget = () => {
            if (!scrollRef.current) return;
            const top = el.getBoundingClientRect().top - scrollRef.current.getBoundingClientRect().top + scrollRef.current.scrollTop - 12;
            const previousBehavior = scrollRef.current.style.scrollBehavior;
            scrollRef.current.style.scrollBehavior = 'auto';
            scrollRef.current.scrollTop = Math.max(0, top);
            scrollRef.current.style.scrollBehavior = previousBehavior;
          };
          scrollToTarget();
          window.setTimeout(scrollToTarget, 260);
          return;
        } catch (err) {}
      }
    }
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [step]);

  function stepForOutcomeGroup(groupIndex = 1) {
    const outcomeTurn = R4B_CHAT_BEATS.length - 1;
    const index = R4B_DEMO_EVENTS.findIndex(event => event.turnIndex === outcomeTurn && event.type === 'group' && event.groupIndex === groupIndex);
    if (index >= 0) return Math.min(total, index + 1);
    return Math.max(0, total - 8);
  }

  function play() {
    if (step >= total) setStep(0);
    setStatus('playing');
    setStep(current => current === 0 || current >= total ? 1 : current);
  }

  function pause() {
    setStatus('paused');
  }

  function stepOnce() {
    setStatus('paused');
    setStep(current => Math.min(total, current + 1));
  }

  function restart() {
    setStatus('idle');
    setStep(0);
    setComposerValue('Build me the launch-ready read from this thread.');
    setQueuedPrompt(false);
    setErrorMsg(null);
    setRevealedBranches({});
  }

  function jumpOutcome() {
    setStatus('paused');
    setQueuedPrompt(false);
    setErrorMsg(null);
    scrollTargetRef.current = 'draft';
    setStep(stepForOutcomeGroup(1));
    if (window.r4gOutcomeRecord) window.r4gOutcomeRecord('jumped to outcome run');
    if (window.r4gDraftRecord) window.r4gDraftRecord('jumped to draft edit loop');
  }

  function jumpReceipt() {
    setStatus('done');
    setQueuedPrompt(false);
    setErrorMsg(null);
    scrollTargetRef.current = 'receipt';
    setStep(total);
    if (window.r4gOutcomeRecord) window.r4gOutcomeRecord('jumped to receipt');
    if (window.r4gDraftRecord) window.r4gDraftRecord('receipt opened');
  }

  function sendPrompt() {
    if (status === 'playing') {
      setQueuedPrompt(true);
      setErrorMsg(null);
      return;
    }
    if (/publish/i.test(composerValue)) {
      setErrorMsg('Publish requires approval. Queue a schedule hold instead.');
      setQueuedPrompt(false);
      return;
    }
    setQueuedPrompt(false);
    setErrorMsg(null);
    setStatus('playing');
    setStep(1);
  }

  function revealBranch(branchId) {
    setRevealedBranches(current => ({ ...current, [branchId]: true }));
    if (window.r4gOutcomeRecord) window.r4gOutcomeRecord(`thread branch ${branchId}`);
    if (window.r4gDraftRecord) window.r4gDraftRecord(`thread branch ${branchId}`);
  }

  return (
    <HfShell workspace="blocks" subtab="Thread Demo">
      <div className="r4bd-thread-demo" data-demo-status={status}>
        <div className="r4bd-thread-head">
          <div>
            <div className="r4b-kicker">BLOCK CATALOG · PLAYABLE THREAD DEMO</div>
            <h1>Blocks materialize inside the conversation.</h1>
            <p>Composer, reasoning, tool runs, source previews, branch choices, queued follow-ups, and action receipts in one runnable loop.</p>
          </div>
          <div className="r4b-count"><strong>{distinct.length}</strong><span>distinct blocks</span></div>
        </div>

        <div className="r4bd-thread-panel">
          <div className="r4bd-thread-toolbar">
            <div className="r4bd-thread-meta">
              <span className="r4bd-thread-title">Launch read · retention, audience, schedule, caveats</span>
              <span className="r4bd-thread-sub"><span className="num">{R4B_CHAT_BEATS.length}</span> turns · <span className="num">{distinct.length}</span> blocks · status {status}</span>
            </div>
            <R4BDemoControls
              status={status}
              step={step}
              total={total}
              speed={speed}
              onPlay={play}
              onPause={pause}
              onStep={stepOnce}
              onRestart={restart}
              onSpeed={setSpeed}
            />
            <button type="button" className="r4bd-control-btn" onClick={jumpOutcome}><Icon name="arrow-right" />Outcome run</button>
            <button type="button" className="r4bd-control-btn" onClick={jumpReceipt}><Icon name="check" />Receipt</button>
          </div>

          <div className="r4bd-thread-scroll" ref={scrollRef}>
            {step === 0 && (
              <section className="r4bd-turn" data-role="Coopr">
                <div className="r4bd-turn-role">
                  <div>Coopr</div>
                  <div className="num" style={{ marginTop: 5, fontSize: 9 }}>ready</div>
                </div>
                <div className="r4bd-turn-body">
                  <p className="r4bd-turn-copy">Press Play or send the composer prompt to watch reasoning, streamed prose, one tool run, inline blocks, and action chips.</p>
                  {window.R4GOutcomeRail && <R4GOutcomeRail active="ask" compact title="Runnable outcome loop" right="ask to receipt" />}
                  <R4BToolRun name="Demo queue" target="Block registry" active />
                </div>
              </section>
            )}
            {R4B_CHAT_BEATS.map((beat, index) => (
              <R4BTurn
                key={index}
                beat={beat}
                index={index}
                state={R4BBeatState(index, step, status)}
                status={status}
                speed={speed}
                revealedBranches={revealedBranches}
                onBranch={revealBranch}
              />
            ))}
            {step >= total && window.R4GOutcomeReceipt && (
              <section className="r4bd-turn" data-role="Coopr" data-demo-receipt="1">
                <div className="r4bd-turn-role">
                  <div>Coopr</div>
                  <div className="num" style={{ marginTop: 5, fontSize: 9 }}>receipt</div>
                </div>
                <div className="r4bd-turn-body">
                  <R4GOutcomeRail active="receipt" compact title="Outcome complete" right="receipt saved" />
                  {window.R4GDraftReceipt ? <R4GDraftReceipt compact /> : <R4GOutcomeReceipt compact />}
                </div>
              </section>
            )}
            {step >= total && window.HF_R4B_RESOLVE_ENTITY && window.Frame && (
              <section className="r4bd-turn" data-role="Coopr" data-demo-lifecycle="1">
                <div className="r4bd-turn-role">
                  <div>Coopr</div>
                  <div className="num" style={{ marginTop: 5, fontSize: 9 }}>lifecycle</div>
                </div>
                <div className="r4bd-turn-body">
                  <p className="r4bd-turn-copy" style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                    Resolving the account, then I'll pull their last 90 days. Composer locks while the run is in flight.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <Frame
                      id="RES-01"
                      name="Sync · @chilis.creations"
                      purpose="Pulling profile + last 90 days of reels."
                      target="LIBRARY"
                      span={12}
                      initialState="running"
                    />
                    <HF_R4B_RESOLVE_ENTITY />
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="r4bd-compose-dock">
            <R4BComposer
              value={composerValue}
              setValue={setComposerValue}
              onSend={sendPrompt}
              sending={status === 'playing'}
              queued={queuedPrompt}
              errorMsg={errorMsg}
              onCancelQueue={() => setQueuedPrompt(false)}
              placeholder="Ask for a launch-ready read across Library, Insights, Memory."
            />
          </div>
        </div>
      </div>
    </HfShell>
  );
}

Object.assign(window, { R4B_CHAT_BEATS, R4B_THREAD_TURNS, R4B_DEMO_EVENTS, HF_R4B_ThreadDemo });
