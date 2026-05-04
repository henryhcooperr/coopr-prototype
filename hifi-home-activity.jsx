/* global React, window */
/* hifi-home-activity.jsx — Home / Activity surface.
   A chronological feed of recent app events: what Coopr did and what Henry did.
   Wraps in <HfShell workspace="home" subtab="Activity"> per IA contract.
   Single component, single useState (filter pill). */

const HA_SANS = 'var(--font-sans)';
const HA_SERIF = 'var(--font-serif)';
const HA_MONO = 'var(--font-mono)';

// ─── Activity rows ─────────────────────────────────────────
// actor: 'agent' | 'creator'
// kind:  'normal' | 'error'
// Bolded entity references use **double-asterisks** in body and are split below.
const HA_ROWS = [
  // ─── TODAY · Wed Apr 29 ───────────────────────────────────
  { day: 'today',     time: '11:42a', actor: 'agent',   kind: 'normal',
    body: 'Coopr drafted 4 hook variants for **d012 · Fiji wreck series**.',
    where: 'in Studio · d012' },
  { day: 'today',     time: '11:08a', actor: 'creator', kind: 'normal',
    body: 'You shipped **0046 · Three things I check before every wreck dive** to Instagram.',
    where: 'in Library · 0046' },
  { day: 'today',     time: '10:51a', actor: 'agent',   kind: 'normal',
    body: 'Coopr summarized 12 new comments on **0042** into 4 clusters.',
    where: 'in Inbox · 0042' },
  { day: 'today',     time: '10:34a', actor: 'agent',   kind: 'error',
    body: "Coopr couldn't reach Instagram analytics — retrying in 4m.",
    where: 'Insights sync · auto' },
  { day: 'today',     time: '10:12a', actor: 'creator', kind: 'normal',
    body: 'You moved **d011** from rewrite to voice pass.',
    where: 'in Studio · d011' },
  { day: 'today',     time: '09:48a', actor: 'agent',   kind: 'normal',
    body: 'Coopr flagged a safety-correction comment on **0044** for your review.',
    where: 'in Inbox · 0044' },
  { day: 'today',     time: '09:21a', actor: 'agent',   kind: 'normal',
    body: 'Coopr suggested a different opener for **0041** — mistake-first hook.',
    where: 'in Studio · 0041' },
  { day: 'today',     time: '08:55a', actor: 'creator', kind: 'normal',
    body: 'You pinned a thread: **Re: Truk Lagoon · Fujikawa Maru episode**.',
    where: 'in Inbox · DMs' },

  // ─── YESTERDAY · Tue Apr 28 ───────────────────────────────
  { day: 'yesterday', time: '06:14p', actor: 'agent',   kind: 'normal',
    body: 'Coopr generated 3 cover-frame options for **d010 · Reef ID primer**.',
    where: 'in Studio · d010' },
  { day: 'yesterday', time: '05:32p', actor: 'creator', kind: 'normal',
    body: 'You approved Coopr’s reply on **0039** — captain-credit thread.',
    where: 'in Inbox · 0039' },
  { day: 'yesterday', time: '04:18p', actor: 'agent',   kind: 'normal',
    body: 'Coopr clipped 2 short-form cuts from **0045 · Fujikawa walkaround**.',
    where: 'in Studio · Clip Lab' },
  { day: 'yesterday', time: '03:47p', actor: 'agent',   kind: 'normal',
    body: 'Coopr noted a voice drift on **0043** — third occurrence of the word "simply" this week.',
    where: 'in Intel · Memory' },
  { day: 'yesterday', time: '02:55p', actor: 'creator', kind: 'normal',
    body: 'You scheduled **0046** for Wed 11a Instagram via Buffer.',
    where: 'in Calendar · Wed' },
  { day: 'yesterday', time: '02:08p', actor: 'agent',   kind: 'normal',
    body: 'Coopr surfaced a competitor pattern: **scubajake** posted 3 wreck shorts in 48h.',
    where: 'in Intel · Radar' },
  { day: 'yesterday', time: '01:24p', actor: 'agent',   kind: 'normal',
    body: 'Coopr drafted a caption rewrite for **0044** — added reserve-pressure callout.',
    where: 'in Library · 0044' },
  { day: 'yesterday', time: '12:50p', actor: 'creator', kind: 'normal',
    body: 'You declined Coopr’s suggested sponsor copy on **d009** — brand-alignment flag.',
    where: 'in Studio · d009' },
  { day: 'yesterday', time: '11:33a', actor: 'agent',   kind: 'normal',
    body: 'Coopr promoted "no sponsored gear teardowns" to a hard rule in **Memory**.',
    where: 'in Intel · Memory' },

  // ─── MON · Apr 27 ─────────────────────────────────────────
  { day: 'monday',    time: '08:12p', actor: 'agent',   kind: 'normal',
    body: 'Coopr ran the weekly retention sweep — 4 posts dipped between minute 2 and 3.',
    where: 'in Insights · Retention' },
  { day: 'monday',    time: '06:40p', actor: 'creator', kind: 'normal',
    body: 'You renamed **d008** to **d008 · Liveaboard gear primer**.',
    where: 'in Studio · d008' },
  { day: 'monday',    time: '05:17p', actor: 'agent',   kind: 'normal',
    body: 'Coopr matched **0040** to the "mistake-first hook" pattern in your Format DNA.',
    where: 'in Insights · Format DNA' },
  { day: 'monday',    time: '03:55p', actor: 'creator', kind: 'normal',
    body: 'You shipped **0045 · Fujikawa walkaround** to Instagram.',
    where: 'in Library · 0045' },
  { day: 'monday',    time: '02:22p', actor: 'agent',   kind: 'normal',
    body: 'Coopr drafted DM replies for 6 brand inquiries — 4 declined, 2 staged for review.',
    where: 'in Inbox · DMs' },
  { day: 'monday',    time: '11:58a', actor: 'agent',   kind: 'normal',
    body: 'Coopr opened **d011 · Truk Lagoon CCR primer** from your voice memo.',
    where: 'in Studio · d011' },
  { day: 'monday',    time: '09:14a', actor: 'creator', kind: 'normal',
    body: 'You added a reference clip to **d010** — rebreather buoyancy demo.',
    where: 'in Studio · d010' },
];

const HA_DAY_LABEL = {
  today:     'Today · Wed Apr 29',
  yesterday: 'Yesterday · Tue Apr 28',
  monday:    'Mon · Apr 27',
};

// ─── Inline icons ──────────────────────────────────────────
function HaCaret() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M3 2 L7 5 L3 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HaErrorDot() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <circle cx="5" cy="5" r="3.4" fill="var(--tone-danger)" />
    </svg>
  );
}

// ─── Bolded body text splitter ─────────────────────────────
function HaBody({ text }) {
  // Split on **...** and render the captured parts as bolded entity refs.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span style={{ fontFamily: HA_SERIF, fontSize: 16, color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <span key={i} style={{ fontFamily: HA_SANS, fontWeight: 600, fontSize: 14.5, color: 'var(--fg-primary)' }}>
              {p.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}

// ─── Actor pill ────────────────────────────────────────────
function HaActorPill({ actor }) {
  const isAgent = actor === 'agent';
  return (
    <span style={{
      width: 26, height: 26, borderRadius: 6,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: isAgent
        ? 'color-mix(in srgb, var(--accent-primary) 14%, transparent)'
        : 'var(--surface-ink)',
      color: isAgent ? 'var(--accent-primary-press)' : 'var(--fg-on-ink)',
      fontFamily: HA_SERIF, fontStyle: 'italic', fontSize: 14, fontWeight: 500, lineHeight: 1,
      border: isAgent ? '1px solid color-mix(in srgb, var(--accent-primary) 22%, transparent)' : '1px solid var(--surface-ink)',
      flexShrink: 0,
    }}>
      {isAgent ? 'C' : 'H'}
    </span>
  );
}

// ─── Filter pill ───────────────────────────────────────────
function HaFilterPill({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        height: 30, padding: '0 14px',
        borderRadius: 999,
        background: active ? 'var(--surface-ink)' : 'var(--surface-1)',
        color: active ? 'var(--fg-on-ink)' : 'var(--fg-secondary)',
        border: active ? '1px solid var(--surface-ink)' : '1px solid var(--border-default)',
        fontFamily: HA_SANS, fontSize: 12.5, fontWeight: active ? 600 : 500,
        letterSpacing: '-0.005em',
        cursor: 'pointer',
      }}
    >
      <span>{label}</span>
      <span style={{
        fontFamily: HA_MONO, fontSize: 11, fontVariantNumeric: 'tabular-nums',
        color: active ? 'var(--fg-on-ink)' : 'var(--fg-tertiary)',
        opacity: active ? 0.85 : 1,
      }}>{count}</span>
    </button>
  );
}

// ─── Stat strip block ──────────────────────────────────────
function HaStat({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 28, borderRight: '1px solid var(--border-subtle)' }}>
      <span style={{ fontFamily: HA_MONO, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>{label}</span>
      <span style={{ fontFamily: HA_SANS, fontSize: 24, fontWeight: 700, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</span>
      {sub ? <span style={{ fontFamily: HA_SANS, fontSize: 11.5, color: 'var(--fg-tertiary)' }}>{sub}</span> : null}
    </div>
  );
}

// ─── One activity row ──────────────────────────────────────
function HaRow({ row }) {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const isError = row.kind === 'error';
  const onOpen = () => ms.pushToast && ms.pushToast('Open ' + (row.where || 'activity'));
  return (
    <div
      onClick={onOpen}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 220px',
        gap: 18,
        alignItems: 'baseline',
        padding: '16px 0',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'transform 120ms ease',
      }}>
      {/* Left gutter · actor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <HaActorPill actor={row.actor} />
      </div>

      {/* Center · body */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        {isError ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 4, background: 'var(--tone-danger-bg)', color: 'var(--tone-danger)', fontFamily: HA_MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>
            <HaErrorDot />
            <span>retry</span>
          </span>
        ) : null}
        <HaBody text={row.body} />
      </div>

      {/* Right · time + where + caret */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: HA_MONO, fontSize: 11.5, color: 'var(--fg-tertiary)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{row.time}</span>
        <span style={{ fontFamily: HA_SANS, fontSize: 11.5, color: 'var(--fg-secondary)', textDecoration: 'underline', textDecorationColor: 'var(--border-default)', textUnderlineOffset: 3 }}>
          {row.where}
        </span>
        <span style={{ color: 'var(--fg-tertiary)', display: 'inline-flex', alignItems: 'center', height: 10 }}>
          <HaCaret />
        </span>
      </div>
    </div>
  );
}

// ─── Day group header ──────────────────────────────────────
function HaDayHeader({ label, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 14,
      padding: '24px 0 10px',
      borderBottom: '1px solid var(--border-default)',
      marginTop: 12,
    }}>
      <span style={{ fontFamily: HA_SERIF, fontStyle: 'italic', fontSize: 20, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{label}</span>
      <span style={{ fontFamily: HA_MONO, fontSize: 11, color: 'var(--fg-tertiary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {count} {count === 1 ? 'event' : 'events'}
      </span>
    </div>
  );
}

// ─── Surface ───────────────────────────────────────────────
function HF_HomeActivity({ state = 'happy' }) {
  // R10 · state variants — hooks BEFORE the early returns to keep rules-of-hooks intact.
  const ovr = window.useSurfaceState && window.useSurfaceState('home', 'Activity');
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  const [filter, setFilter] = React.useState('all');
  if (s === 'loading') {
    return <HfShell workspace="home" subtab="Activity"><window.HF_SkeletonHero shape="feed" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="home" subtab="Activity"><window.HF_EmptyHero
      eyebrow="Activity · 0 events"
      title="Quiet so far. Activity fills in as Coopr works."
      caption="Every action by you and the agent — drafts, edits, posts — lands here in order."
      ctaLabel="Open Today"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="home" subtab="Activity"><window.HF_ErrorHero
      title="Couldn't load the activity feed."
      body="The audit log timed out. Retry, or refresh the session."
    /></HfShell>;
  }

  // Count helpers
  const counts = {
    all:     HA_ROWS.length,
    agent:   HA_ROWS.filter(r => r.actor === 'agent').length,
    creator: HA_ROWS.filter(r => r.actor === 'creator').length,
    errors:  HA_ROWS.filter(r => r.kind === 'error').length,
  };

  const visibleRows = HA_ROWS.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'agent') return r.actor === 'agent';
    if (filter === 'creator') return r.actor === 'creator';
    if (filter === 'errors') return r.kind === 'error';
    return true;
  });

  // Group by day, preserving HA_ROWS order
  const order = ['today', 'yesterday', 'monday'];
  const grouped = order.map(day => ({
    day,
    rows: visibleRows.filter(r => r.day === day),
  }));

  // Right side of subtab strip — small "today" indicator
  const subtabRight = (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: HA_MONO, fontSize: 11, color: 'var(--fg-tertiary)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tone-success)' }} />
      <span>Live · synced 12s ago</span>
    </span>
  );

  return (
    <HfShell workspace="home" subtab="Activity" subtabRight={subtabRight}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 48px 56px' }}>

          {/* ─── Header band ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'end', borderBottom: '1px solid var(--border-default)', paddingBottom: 24 }}>
            <div>
              <span style={{ fontFamily: HA_MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary-press)' }}>
                Recent activity
              </span>
              <h1 style={{
                margin: '10px 0 6px',
                fontFamily: HA_SERIF,
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 38,
                lineHeight: 1.1,
                letterSpacing: '-0.015em',
                color: 'var(--fg-primary)',
              }}>
                Today, what moved
              </h1>
              <p style={{ margin: 0, fontFamily: HA_SERIF, fontSize: 15, color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 540 }}>
                Everything Coopr did and everything you did, in one ledger. Click any row to open the surface where it happened.
              </p>
            </div>

            {/* Stat strip */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
              <HaStat label="Today"     value="24"  sub="events" />
              <HaStat label="This week" value="187" sub="events" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 4 }}>
                <span style={{ fontFamily: HA_MONO, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>By agent</span>
                <span style={{ fontFamily: HA_SANS, fontSize: 24, fontWeight: 700, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>64<span style={{ fontSize: 16, color: 'var(--fg-tertiary)', marginLeft: 2 }}>%</span></span>
                <span style={{ fontFamily: HA_SANS, fontSize: 11.5, color: 'var(--fg-tertiary)' }}>of last 7d</span>
              </div>
            </div>
          </div>

          {/* ─── Filter rail ─── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0 4px' }}>
            <HaFilterPill label="All"      count={counts.all}     active={filter === 'all'}     onClick={() => setFilter('all')} />
            <HaFilterPill label="By agent" count={counts.agent}   active={filter === 'agent'}   onClick={() => setFilter('agent')} />
            <HaFilterPill label="By you"   count={counts.creator} active={filter === 'creator'} onClick={() => setFilter('creator')} />
            <HaFilterPill label="Errors"   count={counts.errors}  active={filter === 'errors'}  onClick={() => setFilter('errors')} />

            <div style={{ flex: 1 }} />

            <span style={{ fontFamily: HA_SANS, fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
              Showing <span style={{ fontFamily: HA_MONO, color: 'var(--fg-secondary)', fontVariantNumeric: 'tabular-nums' }}>{visibleRows.length}</span> of <span style={{ fontFamily: HA_MONO, color: 'var(--fg-secondary)', fontVariantNumeric: 'tabular-nums' }}>{counts.all}</span>
            </span>
          </div>

          {/* ─── Timeline body ─── */}
          <div style={{ marginTop: 8 }}>
            {grouped.map(g => (
              g.rows.length === 0 ? null : (
                <div key={g.day}>
                  <HaDayHeader label={HA_DAY_LABEL[g.day]} count={g.rows.length} />
                  <div>
                    {g.rows.map((row, i) => <HaRow key={`${g.day}-${i}`} row={row} />)}
                  </div>
                </div>
              )
            ))}

            {visibleRows.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: HA_SERIF, fontSize: 16, fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>
                Nothing here under this filter. Try a different lens.
              </div>
            ) : null}
          </div>

          {/* ─── Footer note ─── */}
          <div style={{ marginTop: 36, paddingTop: 18, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: HA_SANS, fontSize: 12, color: 'var(--fg-tertiary)' }}>
              Activity older than 30 days is rolled up into Insights · Posting.
            </span>
            <span
              onClick={() => ms.pushToast && ms.pushToast('Export ledger as CSV')}
              style={{ fontFamily: HA_SANS, fontSize: 12, color: 'var(--fg-secondary)', textDecoration: 'underline', textDecorationColor: 'var(--border-default)', textUnderlineOffset: 3, cursor: 'pointer' }}>
              Export ledger as CSV
            </span>
          </div>

        </div>
      </div>
    </HfShell>
  );
}

Object.assign(window, { HF_HomeActivity });
