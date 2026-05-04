/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Stat, ProgressBar, ChannelChip, AvatarDisc, registerBlock,
   R4BDrawPath, R4BStaggerBars, R4BSweepDonut, R4BCountUp, R4BWordReveal,
   R4FSkelLine, R4FSkelBars, R4FSkelCurve, R4FSkelRows, R4FSkelTiles,
   R4FToolEmpty, R4FToolError, R4FToolLoading,
   R4BLatencySteps, R4BDataEntryState, R4BStateStrip,
   R4GOutcomeRail, R4GOutcomePackage, R4GOutcomeReceipt, R4GDraftApprovalPackage, R4GDraftReceipt */
/* hifi-r4-blocks-Q.jsx - R4D capability blocks: Actions. */

// ─── Q · per-tool state stubs (Q is the "real-time-feeling" family — animate-on-mount priority) ─
function Q01Loading({ onCancel }) { return <R4FToolLoading id="Q01" eyebrow="PLAN PREVIEW · LOADING" caption="Drafting 4-step agent plan before acting…" shape="step-rows" shapeProps={{ count: 4 }} onCancel={onCancel} />; }
function Q01Empty({ onAsk }) { return <R4FToolEmpty id="Q01" eyebrow="PLAN PREVIEW · EMPTY" body="No plan yet. Ask the agent to plan first." ctas={[{ label: 'Plan now', onClick: onAsk }]} />; }
function Q01Error({ onRetry }) { return <R4FToolError id="Q01" eyebrow="PLAN PREVIEW · ERROR" body="Plan invalid — references a tool that's offline." ctas={[{ label: 'Skip that step', onClick: onRetry }]} />; }

function Q02Loading({ onCancel }) { return <R4FToolLoading id="Q02" eyebrow="MULTI-TOOL · LOADING" caption="Running 4-tool chain · 3 of 4 done…" shape="progress-list" shapeProps={{ count: 4 }} onCancel={onCancel} />; }
function Q02Empty({ onAsk }) { return <R4FToolEmpty id="Q02" eyebrow="MULTI-TOOL · EMPTY" body="Tool chain not started. Run the plan." ctas={[{ label: 'Run plan', onClick: onAsk }]} />; }
function Q02Error({ onRetry }) { return <R4FToolError id="Q02" eyebrow="MULTI-TOOL · ERROR" body="One tool in chain timed out — chain paused." ctas={[{ label: 'Skip and continue', onClick: onRetry }, { label: 'Retry tool', onClick: onRetry }]} />; }

function Q03Loading({ onCancel }) { return <R4FToolLoading id="Q03" eyebrow="PARALLEL · LOADING" caption="Tracking 3 jobs running in parallel…" shape="progress-list" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function Q03Empty({ onAsk }) { return <R4FToolEmpty id="Q03" eyebrow="PARALLEL · EMPTY" body="No parallel jobs. Queue more jobs." ctas={[{ label: 'Open queue', icon: 'arrow-up-right', onClick: onAsk }]} />; }
function Q03Error({ onRetry }) { return <R4FToolError id="Q03" eyebrow="PARALLEL · ERROR" body="One job blocked on missing input — others continue." ctas={[{ label: 'Resolve blocker', onClick: onRetry }]} />; }

function Q04Loading({ onCancel }) { return <R4FToolLoading id="Q04" eyebrow="APPROVAL · LOADING" caption="Loading approval request before publish…" shape="step-rows" shapeProps={{ count: 2 }} onCancel={onCancel} />; }
function Q04Empty({ onAsk }) { return <R4FToolEmpty id="Q04" eyebrow="APPROVAL · EMPTY" body="No pending approvals." ctas={[{ label: 'Show recent approvals', onClick: onAsk }]} />; }
function Q04Error({ onRetry }) { return <R4FToolError id="Q04" eyebrow="APPROVAL · ERROR" body="Approval target service offline — can't proceed." ctas={[{ label: 'Wait', onClick: onRetry }, { label: 'Cancel action', onClick: onRetry }]} />; }

function Q05Loading({ onCancel }) { return <R4FToolLoading id="Q05" eyebrow="QUEUE · LOADING" caption="Loading 5 queued actions with sequence + state…" shape="step-rows" shapeProps={{ count: 5 }} onCancel={onCancel} />; }
function Q05Empty({ onAsk }) { return <R4FToolEmpty id="Q05" eyebrow="QUEUE · EMPTY" body="Queue empty. Queue an action to get started." ctas={[{ label: 'Queue action', icon: 'plus', onClick: onAsk }]} />; }
function Q05Error({ onRetry }) { return <R4FToolError id="Q05" eyebrow="QUEUE · ERROR" body="Queue stuck — first item blocked." ctas={[{ label: 'Skip blocked', onClick: onRetry }, { label: 'Retry first', onClick: onRetry }]} />; }

function Q06Loading({ onCancel }) { return <R4FToolLoading id="Q06" eyebrow="DRAFT PACKAGE · LOADING" caption="Packaging caption, sources, revision, and schedule hold…" shape="progress-list" shapeProps={{ count: 4 }} onCancel={onCancel} />; }
function Q06Empty({ onAsk }) { return <R4FToolEmpty id="Q06" eyebrow="DRAFT PACKAGE · EMPTY" body="No reviewable artifact yet. Pick a draft first." ctas={[{ label: 'Pick draft', onClick: onAsk }]} />; }
function Q06Error({ onRetry }) { return <R4FToolError id="Q06" eyebrow="DRAFT PACKAGE · ERROR" body="Package validation failed — source trace missing." ctas={[{ label: 'Attach source', onClick: onRetry }]} />; }

function Q07Loading({ onCancel }) { return <R4FToolLoading id="Q07" eyebrow="ADAPTATION · LOADING" caption="Adapting one idea for YouTube, IG, TikTok…" shape="adapt-stream" shapeProps={{ blocks: 3 }} onCancel={onCancel} />; }
function Q07Empty({ onAsk }) { return <R4FToolEmpty id="Q07" eyebrow="ADAPTATION · EMPTY" body="Source idea not specified. Pick source post." ctas={[{ label: 'Pick source', onClick: onAsk }]} />; }
function Q07Error({ onRetry }) { return <R4FToolError id="Q07" eyebrow="ADAPTATION · ERROR" body="One channel's tone constraint conflicts with the source." ctas={[{ label: 'Drop that channel', onClick: onRetry }]} />; }

function Q08Loading({ onCancel }) { return <R4FToolLoading id="Q08" eyebrow="RECEIPT · LOADING" caption="Logging 4 changes from the agent action…" shape="step-rows" shapeProps={{ count: 4 }} onCancel={onCancel} />; }
function Q08Empty({ onAsk }) { return <R4FToolEmpty id="Q08" eyebrow="RECEIPT · EMPTY" body="No recent agent actions." ctas={[{ label: 'Show last 7 days', onClick: onAsk }]} />; }
function Q08Error({ onRetry }) { return <R4FToolError id="Q08" eyebrow="RECEIPT · ERROR" body="Action log truncated — older entries purged." ctas={[{ label: 'Show last 30 days', onClick: onRetry }]} />; }


function QActionRow({ label, meta, pct, state = 'ready', detail }) {
  const hot = state === 'done' || state === 'active';
  const warn = state === 'blocked' || state === 'approval';
  const icon = state === 'done' ? 'check' : state === 'active' ? 'play' : warn ? 'warning' : 'circle';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr) 82px', gap: 10, alignItems: 'center', padding: '8px 0', borderTop: '1px dotted var(--border-subtle)' }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, background: hot ? 'var(--accent-primary)' : warn ? 'var(--tone-warning-bg)' : 'var(--surface-2)', color: hot ? 'var(--fg-on-accent)' : warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={9} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div className="serif-it" style={{ fontSize: 14.5, color: 'var(--fg-primary)', fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
        <div className="mono" style={{ marginTop: 3, fontSize: 9, color: warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{meta}</div>
        {detail && <div className="serif" style={{ marginTop: 4, fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.35 }}>{detail}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <span className="num mono" style={{ fontSize: 9, fontWeight: 800, color: hot ? 'var(--accent-primary)' : warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)', textAlign: 'right' }}>{pct}%</span>
        <ProgressBar pct={pct} accent={hot} fill={warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)'} />
      </div>
    </div>
  );
}

function QPill({ label, active = false, warn = false, muted = false }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 22,
      padding: '0 9px',
      borderRadius: 999,
      border: active ? 0 : '1px solid var(--border-default)',
      background: active ? 'var(--accent-soft)' : warn ? 'var(--tone-warning-bg)' : muted ? 'var(--surface-2)' : 'var(--surface-1)',
      color: active ? 'var(--accent-primary-press)' : warn ? 'var(--tone-warning)' : muted ? 'var(--fg-tertiary)' : 'var(--fg-secondary)',
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

function QStatusCard({ label, state, pct, meta }) {
  const done = state === 'done';
  const active = state === 'active';
  const warn = state === 'blocked';
  return (
    <div style={{ padding: 10, background: done ? 'var(--accent-soft)' : warn ? 'var(--tone-warning-bg)' : 'var(--surface-2)', borderRadius: 7, border: active ? '1px solid var(--accent-ring)' : '1px solid transparent', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span className="mono" style={{ fontSize: 9, fontWeight: 800, color: done ? 'var(--accent-primary)' : warn ? 'var(--tone-warning)' : 'var(--fg-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
        <Icon name={done ? 'check' : active ? 'play' : warn ? 'warning' : 'circle'} size={10} />
      </div>
      <div className="num serif-it" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, margin: '8px 0 7px', color: warn ? 'var(--tone-warning)' : 'var(--fg-primary)' }}>{pct}%</div>
      <ProgressBar pct={pct} accent={done || active} fill={warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)'} />
      <div className="mono" style={{ marginTop: 7, fontSize: 8.5, color: 'var(--fg-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</div>
    </div>
  );
}

function QSmallRow({ left, main, right, state = 'ready' }) {
  const hot = state === 'done' || state === 'active';
  const warn = state === 'blocked' || state === 'approval';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr) 78px', gap: 9, padding: '7px 0', borderTop: '1px dotted var(--border-subtle)', alignItems: 'center' }}>
      <span className="num mono" style={{ fontSize: 10, color: hot ? 'var(--accent-primary)' : warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)', fontWeight: 800 }}>{left}</span>
      <span className="serif-it" style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.25, minWidth: 0 }}>{main}</span>
      <span className="mono" style={{ fontSize: 9, color: warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'right' }}>{right}</span>
    </div>
  );
}

function HF_R4B_Q01() {
  return (
    <Frame id="Q01" name="Tool plan preview" purpose="Show the plan before the agent acts." target="WORKSPACE" span={6}
      renderLoading={(s) => <Q01Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <Q01Empty onAsk={() => s('loading')} />} renderError={(s) => <Q01Error onRetry={() => s('loading')} />}
      animateOnMount entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="FIG · TOOL PLAN / PREVIEW" right="5 STEPS / 1 APPROVAL" />
        {window.R4GOutcomeRail && <R4GOutcomeRail active="package" compact title="Plan is part of the outcome loop" right="draft before action" />}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 92px', gap: 12, alignItems: 'start' }}>
          <div className="serif-it" style={{ fontSize: 18.5, fontWeight: 600, lineHeight: 1.16 }}>I can gather proof, draft the package, adapt it, and stop before any scheduled action.</div>
          <div style={{ padding: 9, borderRadius: 7, background: 'var(--accent-soft)', textAlign: 'center' }}>
            <div className="num serif-it" style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1 }}>4m</div>
            <div className="mono" style={{ marginTop: 3, fontSize: 8.5, color: 'var(--accent-primary-press)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>est run</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <QPill label="read only" active />
          <QPill label="draft only" active />
          <QPill label="schedule gate" warn />
          <QPill label="no publish" muted />
        </div>
        <R4BStateStrip
          title="Action boundary states"
          right="plan / run / approval / receipt"
          items={[
            { label: 'Plan', meta: 'preview first', state: 'ready' },
            { label: 'Run', meta: 'tool chain', state: 'active' },
            { label: 'Queue', meta: 'ordered jobs', state: 'processing' },
            { label: 'Approve', meta: 'you decide', state: 'approval' },
            { label: 'Receipt', meta: 'saved trace', state: 'done' },
          ]}
        />
        <R4BLatencySteps
          title="Plan lifecycle"
          compact
          steps={[
            { label: 'Read ask', meta: 'scope and source limits', state: 'done', pct: 100 },
            { label: 'Plan tools', meta: '5 steps drafted', state: 'active', pct: 72 },
            { label: 'Gate action', meta: 'approval required', state: 'approval', pct: 0 },
            { label: 'Run after click', meta: 'waiting on user', state: 'pending', pct: 0 },
          ]}
        />
        <QActionRow label="Search outside signals" meta="Intel tools / read only" pct={100} state="done" detail="Rank fresh sources and public conversations by fit." />
        <QActionRow label="Retrieve own proof" meta="Library / compare posts" pct={100} state="done" detail="Pull the closest prior examples and their performance context." />
        <QActionRow label="Draft package" meta="Studio workspace / writing" pct={68} state="active" detail="Create a reviewable caption, source bundle, and asset list." />
        <QActionRow label="Ask before scheduling" meta="approval gate / required" pct={0} state="approval" detail="Queueing stays locked until you approve the exact slot." />
        <Footer openIn="Workspace" extra={<FooterChip icon="play" label="Run plan" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_Q02() {
  return (
    <Frame id="Q02" name="Multi-tool progress" purpose="One compact progress card for a tool chain." target="WORKSPACE" span={6}
      renderLoading={(s) => <Q02Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <Q02Empty onAsk={() => s('loading')} />} renderError={(s) => <Q02Error onRetry={() => s('loading')} />}
      animateOnMount entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="FIG · RUNNING / RESEARCH TO PACKAGE" right="3 OF 5 DONE" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 84px', gap: 12, alignItems: 'center' }}>
          <div>
            <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.18 }}>The chain is past retrieval and is now writing the variants.</div>
            <div className="mono" style={{ marginTop: 5, fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>ACTIVE TOOL / DRAFT VARIANTS</div>
          </div>
          <Stat label="RUN" val="72%" accent />
        </div>
        <R4BLatencySteps
          title="Running chain"
          compact
          steps={[
            { label: 'Retrieve', meta: 'sources and library', state: 'done', pct: 100 },
            { label: 'Draft', meta: 'streaming variants', state: 'active', pct: 58 },
            { label: 'Package', meta: 'waiting on draft', state: 'pending', pct: 0 },
            { label: 'Receipt', meta: 'after save', state: 'pending', pct: 0 },
          ]}
        />
        {[
          ['Search sources', '18 results ranked', 100, 'done', 'Freshness, source type, and reuse value scored.'],
          ['Read own library', '12 posts compared', 100, 'done', 'Closest proof posts added to the working set.'],
          ['Scan comments', '812 comments grouped', 100, 'done', 'Questions and objections collapsed into themes.'],
          ['Draft variants', 'writing hooks', 58, 'active', 'Three openings are being shaped for channel fit.'],
          ['Build publish package', 'waiting on draft', 0, 'ready', 'Sources, assets, and caveats will be assembled next.'],
        ].map(([label, meta, pct, state, detail]) => <QActionRow key={label} label={label} meta={meta} pct={pct} state={state} detail={detail} />)}
        <Footer openIn="Workspace" extra={<FooterChip icon="square" label="Stop run" muted />} />
      </div>
    </Frame>
  );
}

function HF_R4B_Q03() {
  return (
    <Frame id="Q03" name="Parallel run status" purpose="Several jobs running at once, with blockers visible." target="WORKSPACE" span={6}
      renderLoading={(s) => <Q03Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <Q03Empty onAsk={() => s('loading')} />} renderError={(s) => <Q03Error onRetry={() => s('loading')} />}
      animateOnMount entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="FIG · PARALLEL RUN / 4 JOBS" right="ETA 0:38" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            ['Search', 'done', 100, 'ranked'],
            ['Library', 'done', 100, 'matched'],
            ['Social', 'active', 72, 'grouping'],
            ['Import', 'blocked', 34, 'retrying'],
          ].map(([label, state, pct, meta]) => <QStatusCard key={label} label={label} state={state} pct={pct} meta={meta} />)}
        </div>
        <R4BDataEntryState
          title="Parallel jobs are not equally ready"
          source="search / library / social / import"
          state="partial"
          detail="The run continues because completed jobs are usable while import carries a lower-confidence caveat."
          items={[
            { label: 'Search + library', meta: 'usable now', state: 'ready', pct: 100 },
            { label: 'Social scan', meta: 'grouping public examples', state: 'active', pct: 72, live: true },
            { label: 'Import job', meta: 'retrying missing input', state: 'retry', pct: 34 },
          ]}
          compact
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 106px', gap: 12, alignItems: 'center' }}>
          <div className="serif-it" style={{ fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.4 }}>Import is slow. The package can proceed if the receipt carries a lower-confidence caveat.</div>
          <QPill label="safe to draft" active />
        </div>
        <Footer openIn="Workspace" />
      </div>
    </Frame>
  );
}

function HF_R4B_Q04() {
  return (
    <Frame id="Q04" name="Approval request" purpose="Ask before an external or irreversible action." target="ANYWHERE" span={6}
      renderLoading={(s) => <Q04Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <Q04Empty onAsk={() => s('loading')} />} renderError={(s) => <Q04Error onRetry={() => s('loading')} />}
      entrance="fade-up"
    >
      <div className="blk" style={{ borderColor: 'var(--accent-primary)' }}>
        <Eyebrow left="FIG · APPROVAL NEEDED / SCHEDULE" right="NO PUBLISH WITHOUT YOU" />
        <div style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 12, alignItems: 'start' }}>
          <span style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--tone-warning-bg)', color: 'var(--tone-warning)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="warning" size={22} />
          </span>
          <div>
            <div className="serif-it" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.2 }}>Queue the package for Wednesday at 18:30?</div>
            <p className="serif" style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.45 }}>This creates a scheduled draft in Calendar and Studio. It does not publish to any platform.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <Stat label="SLOT" val="18:30" accent />
          <Stat label="ASSETS" val="3" />
          <Stat label="CHECKS" val="4" />
        </div>
        <QActionRow label="External effect" meta="Calendar queue / reversible" pct={0} state="approval" detail="Creates a hold with draft metadata attached." />
        <QActionRow label="Still locked" meta="platform publish / blocked" pct={0} state="blocked" detail="Publishing remains unavailable until a separate approval." />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <FooterChip icon="check" label="Approve" accent />
          <FooterChip icon="pencil" label="Edit first" />
          <FooterChip icon="cross" label="Decline" muted />
        </div>
      </div>
    </Frame>
  );
}

function HF_R4B_Q05() {
  return (
    <Frame id="Q05" name="Action queue" purpose="Queued actions with sequence, owner, and state." target="WORKSPACE" span={6}
      renderLoading={(s) => <Q05Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <Q05Empty onAsk={() => s('loading')} />} renderError={(s) => <Q05Error onRetry={() => s('loading')} />}
      animateOnMount entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="FIG · ACTION QUEUE / THIS THREAD" right="6 ITEMS" />
        {window.R4GOutcomeRail && <R4GOutcomeRail active="approval" compact title="Queue waits at approval" right="no publish action" />}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ padding: 10, borderRadius: 7, background: 'var(--accent-soft)' }}>
            <div className="mono" style={{ fontSize: 8.5, color: 'var(--accent-primary-press)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>Now</div>
            <div className="serif-it" style={{ marginTop: 5, fontSize: 15, fontWeight: 600 }}>Attach source bundle</div>
          </div>
          <div style={{ padding: 10, borderRadius: 7, background: 'var(--surface-2)' }}>
            <div className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>Next gate</div>
            <div className="serif-it" style={{ marginTop: 5, fontSize: 15, fontWeight: 600 }}>Wait for approval</div>
          </div>
        </div>
        <R4BLatencySteps
          title="Queue state"
          compact
          steps={[
            { label: 'Done', meta: '2 saved actions', state: 'done', pct: 100 },
            { label: 'Running', meta: 'attach quote and clip', state: 'active', pct: 56 },
            { label: 'Approval', meta: 'you decide slot', state: 'approval', pct: 0 },
            { label: 'Blocked', meta: 'publish hold locked', state: 'pending', pct: 0 },
          ]}
        />
        {[
          ['01', 'Create Studio draft', 'done', 'agent'],
          ['02', 'Apply revision patch', 'done', 'agent'],
          ['03', 'Attach source bundle', 'active', 'agent'],
          ['04', 'Prepare schedule hold', 'ready', 'calendar'],
          ['05', 'Wait for approval', 'approval', 'you'],
          ['06', 'Keep publish locked', 'blocked', 'manual'],
        ].map(([n, label, state, owner]) => (
          <QSmallRow key={n} left={n} main={label} right={owner} state={state} />
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <QPill label="2 done" active />
          <QPill label="1 running" active />
          <QPill label="1 approval" warn />
          <QPill label="1 blocked" muted />
        </div>
        <Footer openIn="Workspace" extra={<FooterChip icon="arrow-up-right" label="Open queue" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_Q06() {
  return (
    <Frame id="Q06" name="Draft package review" purpose="One consolidated draft package ready for review before approval." target="STUDIO" span={6}
      renderLoading={(s) => <Q06Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <Q06Empty onAsk={() => s('loading')} />} renderError={(s) => <Q06Error onRetry={() => s('loading')} />}
      animateOnMount entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="FIG · DRAFT PACKAGE / READY" right="REVIEW BEFORE HOLD" />
        {window.R4GDraftApprovalPackage ? <R4GDraftApprovalPackage compact /> : (window.R4GOutcomePackage && <R4GOutcomePackage active="approval" compact />)}
        <div className="serif-it" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.12 }}>The strongest version leads with proof, applies the revision, then waits for a schedule hold approval.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <Stat label="HOOK" val="0.9s" accent />
          <Stat label="SOURCES" val="7" />
          <Stat label="ASSETS" val="3" />
        </div>
        <R4BDataEntryState
          title="Package readiness"
          source="caption / clip / sources / caveat"
          state="ready"
          detail="The package is reviewable; scheduling and publishing remain separate approval states."
          items={[
            { label: 'Draft v2', meta: 'voice guardrails applied', state: 'ready', pct: 100 },
            { label: 'Source bundle', meta: '7 citations attached', state: 'ready', pct: 100 },
            { label: 'Approval hold', meta: 'manual schedule gate', state: 'approval', pct: 0 },
          ]}
          compact
        />
        <div style={{ padding: 10, borderRadius: 7, background: 'var(--surface-2)' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>Package contents</div>
          {[
            ['Draft v2', 'ready'],
            ['Revision patch', 'applied'],
            ['Source bundle', 'attached'],
          ].map(([main, right], i) => <QSmallRow key={main} left={String(i + 1).padStart(2, '0')} main={main} right={right} state={i < 2 ? 'done' : 'ready'} />)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <QPill label="draft v2" active />
          <QPill label="revision" active />
          <QPill label="sources" active />
          <QPill label="approval hold" warn />
        </div>
        <Footer openIn="Studio" extra={<FooterChip icon="check" label="Review draft" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_Q07() {
  return (
    <Frame id="Q07" name="Cross-platform adaptation" purpose="Adapt one idea for several channels." target="STUDIO" span={6}
      renderLoading={(s) => <Q07Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <Q07Empty onAsk={() => s('loading')} />} renderError={(s) => <Q07Error onRetry={() => s('loading')} />}
      animateOnMount entrance="slide-in-stack"
    >
      <div className="blk">
        <Eyebrow left="FIG · ADAPTATION / ONE IDEA" right="YT / IG / TT" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 12, alignItems: 'start' }}>
          <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.18 }}>Same thesis, three shapes. Each channel keeps the proof but changes pacing and ask.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <QPill label="thesis locked" active />
            <QPill label="3 drafts" />
          </div>
        </div>
        {[
          ['YT', 'Longer proof, caveat after the first evidence point', '8:40'],
          ['IG', 'One clip, caption carries the field note', '0:42'],
          ['TT', 'Mistake-first hook, explain with one concrete beat', '0:27'],
        ].map(([ch, copy, dur], i) => (
          <div key={ch} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr) 46px', gap: 10, padding: '8px 0', borderTop: i ? '1px dotted var(--border-subtle)' : 0, alignItems: 'baseline' }}>
            <ChannelChip channel={ch} />
            <span className="serif-it" style={{ fontSize: 14.5, color: 'var(--fg-primary)', lineHeight: 1.3 }}>{copy}</span>
            <span className="num mono" style={{ fontSize: 10, color: 'var(--fg-tertiary)', textAlign: 'right' }}>{dur}</span>
          </div>
        ))}
        <Footer openIn="Studio" extra={<FooterChip icon="pencil" label="Edit variants" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_Q08() {
  return (
    <Frame id="Q08" name="Completion receipt and changelog" purpose="Show what changed after an agent action." target="WORKSPACE" span={6}
      renderLoading={(s) => <Q08Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <Q08Empty onAsk={() => s('loading')} />} renderError={(s) => <Q08Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="FIG · RECEIPT / RUN COMPLETE" right="4 CHANGES SAVED" />
        {window.R4GOutcomeRail && <R4GOutcomeRail active="receipt" compact title="Receipt closes the loop" right="trace saved" />}
        <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={26} />
          </div>
          <div>
            <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>Draft package saved to Studio and linked back to this thread.</div>
            <div className="mono" style={{ marginTop: 5, fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>RUN ID R4D-Q08 / DRAFT REVIEW / NO PUBLISH</div>
          </div>
        </div>
        <R4BLatencySteps
          title="Receipt lifecycle"
          compact
          steps={[
            { label: 'Create draft', meta: 'Studio v1', state: 'done', pct: 100 },
            { label: 'Revise', meta: 'tightened ask', state: 'done', pct: 100 },
            { label: 'Attach', meta: 'sources and assets', state: 'done', pct: 100 },
            { label: 'Hold', meta: 'approval only', state: 'done', pct: 100 },
          ]}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <Stat label="DRAFTS" val="3" accent />
          <Stat label="SOURCES" val="7" />
          <Stat label="QUEUE" val="1" />
          <Stat label="COST" val="0.04" />
        </div>
        {[
          ['01', 'Created draft', 'done'],
          ['02', 'Applied revision', 'done'],
          ['03', 'Attached proofs', 'done'],
          ['04', 'Held approval', 'done'],
        ].map(([left, main, state]) => <QSmallRow key={left} left={left} main={main} right="saved" state={state} />)}
        {window.R4GDraftReceipt ? <R4GDraftReceipt compact /> : (window.R4GOutcomeReceipt && <R4GOutcomeReceipt compact />)}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <QPill label="trace saved" active />
          <QPill label="no publish" muted />
          <QPill label="approval required" warn />
        </div>
        <Footer openIn="Workspace" extra={<FooterChip icon="arrow-up-right" label="Open receipt" />} />
      </div>
    </Frame>
  );
}

const FAMILY_Q_META = [
  { id: 'Q01', name: 'Tool plan preview', purpose: 'Show the plan before the agent acts.', target: 'WORKSPACE', span: 6, family: 'Q', familyTitle: 'Actions', component: HF_R4B_Q01 },
  { id: 'Q02', name: 'Multi-tool progress', purpose: 'One compact progress card for a tool chain.', target: 'WORKSPACE', span: 6, family: 'Q', familyTitle: 'Actions', component: HF_R4B_Q02 },
  { id: 'Q03', name: 'Parallel run status', purpose: 'Several jobs running at once, with blockers visible.', target: 'WORKSPACE', span: 6, family: 'Q', familyTitle: 'Actions', component: HF_R4B_Q03 },
  { id: 'Q04', name: 'Approval request', purpose: 'Ask before an external or irreversible action.', target: 'ANYWHERE', span: 6, family: 'Q', familyTitle: 'Actions', component: HF_R4B_Q04 },
  { id: 'Q05', name: 'Action queue', purpose: 'Queued actions with sequence, owner, and state.', target: 'WORKSPACE', span: 6, family: 'Q', familyTitle: 'Actions', component: HF_R4B_Q05 },
  { id: 'Q06', name: 'Draft package review', purpose: 'One consolidated draft package ready for review before approval.', target: 'STUDIO', span: 6, family: 'Q', familyTitle: 'Actions', component: HF_R4B_Q06 },
  { id: 'Q07', name: 'Cross-platform adaptation', purpose: 'Adapt one idea for several channels.', target: 'STUDIO', span: 6, family: 'Q', familyTitle: 'Actions', component: HF_R4B_Q07 },
  { id: 'Q08', name: 'Completion receipt and changelog', purpose: 'Show what changed after an agent action.', target: 'WORKSPACE', span: 6, family: 'Q', familyTitle: 'Actions', component: HF_R4B_Q08 },
];

registerBlock('Q01', FAMILY_Q_META[0]);
registerBlock('Q02', FAMILY_Q_META[1]);
registerBlock('Q03', FAMILY_Q_META[2]);
registerBlock('Q04', FAMILY_Q_META[3]);
registerBlock('Q05', FAMILY_Q_META[4]);
registerBlock('Q06', FAMILY_Q_META[5]);
registerBlock('Q07', FAMILY_Q_META[6]);
registerBlock('Q08', FAMILY_Q_META[7]);

Object.assign(window, {
  HF_R4B_Q01,
  HF_R4B_Q02,
  HF_R4B_Q03,
  HF_R4B_Q04,
  HF_R4B_Q05,
  HF_R4B_Q06,
  HF_R4B_Q07,
  HF_R4B_Q08,
  FAMILY_Q: { Q01: HF_R4B_Q01, Q02: HF_R4B_Q02, Q03: HF_R4B_Q03, Q04: HF_R4B_Q04, Q05: HF_R4B_Q05, Q06: HF_R4B_Q06, Q07: HF_R4B_Q07, Q08: HF_R4B_Q08 },
});
