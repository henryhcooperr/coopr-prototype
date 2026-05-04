/* global React, window */
/* hifi-studio-r5-home.jsx — Studio · Docs landing page.

   Lists every active and recently-shipped doc as full-width editorial cards.
   Click a card → onOpen(docId) — shell switches to doc view. Owns no doc
   content beyond fixture cards.
*/

const R5H = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function R5H_ML({ children, s = 9.5, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R5H.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...st }}>{children}</span>;
}
function R5H_MM({ children, s = 11, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: R5H.mono, fontSize: s, color: c, ...st }}>{children}</span>;
}

const R5H_DOCS = [
  {
    id: 'truk-lagoon-ep-1',
    eyebrow: 'Truk Lagoon · ep. 1 hook',
    title: 'The Fujikawa',
    italicTail: 'in eight breaths.',
    status: 'drafting', statusVersion: 'v3',
    words: 1842, target: 2400,
    target_when: 'Tue 6:30 PM',
    channel: 'YouTube · 11-min',
    agent: { name: 'Coopr', when: '14m ago', body: 'three edits — hook tightened, two shots added, caption drafted' },
    section: 'active',
  },
  {
    id: 'carousel-instructor-mistakes',
    eyebrow: 'Carousel · 5 instructor mistakes',
    title: 'Five instructor',
    italicTail: 'mistakes.',
    status: 'drafting', statusVersion: 'v2',
    words: 312, target: 600,
    target_when: 'Sat 9:00 AM',
    channel: 'IG · carousel',
    agent: { name: 'Coopr', when: '6m ago', body: 'Tightened hook 3 — kept the picks alone' },
    section: 'active',
  },
  {
    id: 'la-jolla-scout',
    eyebrow: 'La Jolla scout · loose',
    title: 'La Jolla',
    italicTail: 'scout.',
    status: 'notes',
    words: 184, target: null,
    target_when: 'Thu morning',
    channel: 'Backup · b-roll',
    agent: { name: 'Coopr', when: '9:02 am', body: "Indexed for retrieval — won't shape it unless asked" },
    section: 'active',
  },
  {
    id: 'channel-intro-2026',
    eyebrow: 'Channel intro · 2026 refresh',
    title: 'Begin again,',
    italicTail: 'again.',
    status: 'reviewing', statusVersion: 'v4',
    words: 720, target: 800,
    target_when: 'Apr 28',
    channel: 'YouTube · 90-sec',
    agent: { name: 'Mara', when: '1h ago', body: "rhythm comment — ‘eight breaths’ should land twice" },
    section: 'active',
  },
  {
    id: 'wreck-dive-ep-2',
    eyebrow: 'Wreck dive series · ep. 2 hook',
    title: 'What 50 feet teaches',
    italicTail: "that 30 won't.",
    status: 'drafting', statusVersion: 'v1',
    words: 96, target: 2400,
    target_when: 'May 6',
    channel: 'YouTube · 12-min',
    agent: null,
    section: 'active',
  },
  {
    id: 'gear-pillar-regulator',
    eyebrow: 'Gear pillar · regulator deep-dive',
    title: 'How to listen to',
    italicTail: 'a regulator.',
    status: 'locked', statusVersion: 'v6',
    words: 2204, target: 2200,
    target_when: 'Apr 25',
    channel: 'YouTube · 14-min',
    agent: null,
    section: 'active',
  },
  {
    id: 'cold-open-template-v3',
    eyebrow: 'Cold-open template · v3',
    title: 'The breath',
    italicTail: "you didn't take.",
    status: 'shipped', statusVersion: 'apr 18',
    words: null, target: null,
    target_when: 'Apr 18 · live',
    channel: 'YouTube · 47k views',
    agent: { name: 'Coopr', when: '3d ago', body: 'Drafted next-7-days followups from this hook shape' },
    section: 'shipped',
  },
];

const R5H_STATUS = {
  drafting:  { label: 'drafting',  bg: 'var(--accent-soft)',     fg: 'var(--accent-primary-press)', dot: 'var(--accent-primary)' },
  reviewing: { label: 'reviewing', bg: 'var(--tone-warning-bg)', fg: 'var(--tone-warning)',         dot: 'var(--tone-warning)' },
  locked:    { label: 'locked',    bg: 'var(--surface-2)',       fg: 'var(--fg-secondary)',         dot: 'var(--fg-tertiary)' },
  shipped:   { label: 'shipped',   bg: 'var(--tone-success-bg)', fg: 'var(--tone-success)',         dot: 'var(--tone-success)' },
  notes:     { label: 'notes',     bg: 'var(--surface-2)',       fg: 'var(--fg-secondary)',         dot: 'var(--fg-tertiary)' },
};

function R5H_StatusPill({ status, version }) {
  const s = R5H_STATUS[status] || R5H_STATUS.drafting;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px',
      background: s.bg,
      borderRadius: 999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
      <span style={{ fontFamily: R5H.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: s.fg }}>
        {s.label}{version ? ' · ' + version : ''}
      </span>
    </span>
  );
}

function R5H_DocCard({ doc, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const pct = doc.target && doc.words ? Math.min(100, Math.round((doc.words / doc.target) * 100)) : null;

  return (
    <article
      onClick={() => onOpen(doc.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '24px 28px',
        background: hover ? 'var(--surface-1)' : 'transparent',
        borderTop: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
    >
      <R5H_ML s={9.5} st={{ display: 'block', marginBottom: 8 }}>{doc.eyebrow}</R5H_ML>
      <h2 style={{ margin: 0, fontFamily: R5H.serif, fontSize: 32, fontWeight: 400, color: 'var(--fg-primary)', letterSpacing: '-0.012em', lineHeight: 1.1 }}>
        <span>{doc.title} </span>
        <span style={{ fontStyle: 'italic' }}>{doc.italicTail}</span>
      </h2>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <R5H_StatusPill status={doc.status} version={doc.statusVersion} />
        {doc.words != null && (
          <R5H_MM s={10.5} c="var(--fg-secondary)" st={{ fontVariantNumeric: 'tabular-nums' }}>
            {doc.words.toLocaleString()}{doc.target ? ' / ' + doc.target.toLocaleString() : ''} words
          </R5H_MM>
        )}
        {pct != null && (
          <span style={{ width: 80, height: 2, background: 'var(--border-subtle)', borderRadius: 999, overflow: 'hidden' }}>
            <span style={{ display: 'block', width: pct + '%', height: '100%', background: 'var(--accent-primary)' }} />
          </span>
        )}
        <R5H_MM s={10}>{doc.target_when}</R5H_MM>
        <R5H_MM s={10}>· {doc.channel}</R5H_MM>
      </div>

      {doc.agent && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: doc.agent.name === 'Coopr' ? 'var(--accent-primary)' : 'var(--tone-warning)', flexShrink: 0, alignSelf: 'center' }} aria-hidden="true">
            <path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" />
          </svg>
          <span style={{ fontFamily: R5H.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{doc.agent.name}</span>
          <R5H_MM s={9.5}>· {doc.agent.when}</R5H_MM>
          <span style={{ fontFamily: R5H.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)' }}>· {doc.agent.body}</span>
        </div>
      )}

      <span style={{
        position: 'absolute', top: 28, right: 28,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        opacity: hover ? 1 : 0,
        transition: 'opacity 120ms ease',
      }}>
        <R5H_MM s={9.5} c="var(--fg-tertiary)" st={{ fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Open</R5H_MM>
        <svg width="11" height="11" viewBox="0 0 12 12" style={{ color: 'var(--fg-tertiary)' }} aria-hidden="true"><path d="M4 2 L8 6 L4 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </article>
  );
}

function R5H_FilterChip({ label, count, active, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 6,
        padding: '5px 12px',
        background: active ? 'var(--fg-primary)' : 'transparent',
        color: active ? 'var(--surface-1)' : 'var(--fg-secondary)',
        border: '1px solid ' + (active ? 'var(--fg-primary)' : 'var(--border-subtle)'),
        borderRadius: 999,
        cursor: 'pointer',
        fontFamily: R5H.mono, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}
    >
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', opacity: active ? 0.85 : 0.65 }}>{count}</span>
    </span>
  );
}

function HF_R5DocsHome({ onOpen = () => {} }) {
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx ? masterCtx.pushToast : (() => {});
  const pushModal = masterCtx && masterCtx.pushModal ? masterCtx.pushModal : null;

  const [filter, setFilter] = React.useState('all');

  const counts = {
    all:       R5H_DOCS.length,
    drafting:  R5H_DOCS.filter(d => d.status === 'drafting').length,
    reviewing: R5H_DOCS.filter(d => d.status === 'reviewing').length,
    locked:    R5H_DOCS.filter(d => d.status === 'locked').length,
    shipped:   R5H_DOCS.filter(d => d.status === 'shipped').length,
    notes:     R5H_DOCS.filter(d => d.status === 'notes').length,
  };

  const visible = filter === 'all'
    ? R5H_DOCS
    : R5H_DOCS.filter(d => d.status === filter);

  const active = visible.filter(d => d.section === 'active');
  const shipped = visible.filter(d => d.section === 'shipped');

  function newDoc() {
    if (pushModal) {
      pushModal('ModalNewDoc', {});
    } else {
      pushToast('Open · New doc modal');
    }
  }

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--surface-1)' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '56px 60px 120px' }}>

        <header style={{ marginBottom: 32 }}>
          <R5H_ML s={9.5} st={{ display: 'block', marginBottom: 14 }}>Studio · Docs</R5H_ML>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <h1 style={{ margin: 0, fontFamily: R5H.serif, fontSize: 56, fontWeight: 400, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1, fontStyle: 'italic' }}>
              Docs.
            </h1>
            <span style={{ flex: 1 }} />
            <span
              onClick={newDoc}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px',
                background: 'var(--fg-primary)',
                color: 'var(--surface-1)',
                borderRadius: 999,
                fontFamily: R5H.mono, fontSize: 10.5, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2 V10 M2 6 H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              New doc
            </span>
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <R5H_MM s={11} c="var(--fg-secondary)" st={{ fontVariantNumeric: 'tabular-nums' }}>
              {counts.drafting} drafting · {counts.reviewing} reviewing · {counts.locked} locked · {counts.shipped} shipped
            </R5H_MM>
          </div>

          <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <R5H_FilterChip label="All"        count={counts.all}       active={filter === 'all'}       onClick={() => setFilter('all')} />
            <R5H_FilterChip label="Drafting"   count={counts.drafting}  active={filter === 'drafting'}  onClick={() => setFilter('drafting')} />
            <R5H_FilterChip label="Reviewing"  count={counts.reviewing} active={filter === 'reviewing'} onClick={() => setFilter('reviewing')} />
            <R5H_FilterChip label="Locked"     count={counts.locked}    active={filter === 'locked'}    onClick={() => setFilter('locked')} />
            <R5H_FilterChip label="Shipped"    count={counts.shipped}   active={filter === 'shipped'}   onClick={() => setFilter('shipped')} />
            <R5H_FilterChip label="Notes"      count={counts.notes}     active={filter === 'notes'}     onClick={() => setFilter('notes')} />
          </div>

          <div style={{ marginTop: 28, height: 1, background: 'var(--border-subtle)' }} />
        </header>

        {active.length > 0 && (
          <section>
            <div style={{ padding: '0 28px 8px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <R5H_ML s={9}>Active</R5H_ML>
              <R5H_MM s={9.5}>· {active.length}</R5H_MM>
            </div>
            <div>
              {active.map((d) => <R5H_DocCard key={d.id} doc={d} onOpen={onOpen} />)}
            </div>
          </section>
        )}

        {shipped.length > 0 && (
          <section style={{ marginTop: 32 }}>
            <div style={{ padding: '0 28px 8px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <R5H_ML s={9}>Shipped · 30 days</R5H_ML>
              <R5H_MM s={9.5}>· {shipped.length}</R5H_MM>
            </div>
            <div>
              {shipped.map((d) => <R5H_DocCard key={d.id} doc={d} onOpen={onOpen} />)}
            </div>
          </section>
        )}

        {visible.length === 0 && (
          <div style={{ padding: '60px 28px', textAlign: 'center' }}>
            <R5H_MM s={11}>No docs match this filter.</R5H_MM>
          </div>
        )}

      </div>
    </div>
  );
}

Object.assign(window, {
  HF_R5DocsHome,
  R5H_DocCard, R5H_FilterChip, R5H_StatusPill,
  R5H_DOCS,
});
