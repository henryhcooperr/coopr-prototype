/* global React, window, HfShell, FreshnessPill, ChannelGlyph */
/* hifi-calendar-r2.jsx — Calendar surface set R2.
   Companion to the existing HF_Calendar (week view) in hifi-more.jsx.
   Five new surfaces, one job each: Day · Month · SlotDrawer · Conflict · Empty.
   Editorial template throughout: header band → optional KPI strip →
   1fr / 360px body with a right-rail "one thing to do" CTA. */

const CALM = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

// Channel-flavored stripe color (mirrors HF_Calendar's plat colors)
const CAL_CHAN_COLOR = {
  ig: 'var(--accent-primary)',
  yt: 'var(--tone-warning)',
  tt: 'var(--tone-info)',
  th: 'var(--fg-secondary)',
};
const CAL_CHAN_LABEL = { ig: 'IG', yt: 'YT', tt: 'TT', th: 'TH' };

// ─── Type helpers ─────────────────────────────────────────
function CalEyebrow({ children, c = 'var(--fg-tertiary)', s = 9.5, st = {} }) {
  return <span style={{
    fontFamily: CALM.sans, fontSize: s, color: c,
    fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
    ...st,
  }}>{children}</span>;
}

function CalMono({ children, c = 'var(--fg-tertiary)', s = 10.5, st = {} }) {
  return <span style={{
    fontFamily: CALM.mono, fontSize: s, color: c,
    letterSpacing: '0.04em',
    ...st,
  }}>{children}</span>;
}

function CalSerifItalic({ children, s = 30, c = 'var(--fg-primary)', st = {} }) {
  return <span style={{
    fontFamily: CALM.serif, fontStyle: 'italic',
    fontSize: s, color: c, letterSpacing: '-0.015em',
    fontWeight: 500, lineHeight: 1.08,
    ...st,
  }}>{children}</span>;
}

// ─── Editorial header band ────────────────────────────────
function CalHeader({ byline, headline, deck, right }) {
  return (
    <div style={{
      padding: '20px 28px 18px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
      display: 'flex',
      alignItems: 'flex-end',
      gap: 24,
      flexShrink: 0,
    }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <CalEyebrow>{byline}</CalEyebrow>
        <CalSerifItalic s={32}>{headline}</CalSerifItalic>
        {deck && (
          <span style={{
            fontFamily: CALM.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.5, maxWidth: 760,
          }}>{deck}</span>
        )}
      </div>
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{right}</div>}
    </div>
  );
}

// ─── KPI strip ────────────────────────────────────────────
function CalKpiStrip({ items }) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
      flexShrink: 0,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          flex: 1,
          padding: '12px 22px',
          borderRight: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0,
        }}>
          <CalEyebrow s={9}>{it.label}</CalEyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="hf-num" style={{
              fontFamily: CALM.serif, fontSize: 22, fontWeight: 600,
              color: it.accent ? 'var(--accent-primary)' : 'var(--fg-primary)',
              letterSpacing: '-0.01em', lineHeight: 1,
            }}>{it.value}</span>
            {it.sub && <CalMono s={10}>{it.sub}</CalMono>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Right rail · One thing to do ─────────────────────────
function CalOneThing({ kicker, headline, body, ctaLabel, secondaryLabel, accent = 'clay', extra }) {
  const accentBg = accent === 'clay' ? 'var(--accent-soft)' : 'var(--surface-1)';
  const accentBorder = accent === 'clay' ? 'var(--accent-primary)' : 'var(--border-subtle)';
  return (
    <aside style={{
      width: 360, flexShrink: 0,
      padding: '22px 22px 18px',
      borderLeft: '1px solid var(--border-subtle)',
      background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column', gap: 14,
      overflow: 'auto',
    }}>
      <CalEyebrow s={9}>ONE THING TO DO</CalEyebrow>
      <div style={{
        padding: '16px 18px 18px',
        background: accentBg,
        border: `1px solid ${accentBorder}`,
        borderRadius: 8,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <CalMono s={9} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>{kicker}</CalMono>
        <CalSerifItalic s={22}>{headline}</CalSerifItalic>
        <span style={{
          fontFamily: CALM.sans, fontSize: 12,
          color: 'var(--fg-secondary)', lineHeight: 1.55,
        }}>{body}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            height: 32, padding: '0 14px',
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            border: '1px solid var(--accent-primary-press)',
            borderRadius: 6,
            fontFamily: CALM.sans, fontSize: 12, fontWeight: 600,
            letterSpacing: '-0.005em',
          }}>{ctaLabel}</span>
          {secondaryLabel && (
            <span style={{
              fontFamily: CALM.mono, fontSize: 10.5,
              color: 'var(--fg-tertiary)', letterSpacing: '0.04em',
            }}>{secondaryLabel}</span>
          )}
        </div>
      </div>
      {extra}
    </aside>
  );
}

// ─── Library drawer (vertical, 280px) ─────────────────────
function CalLibraryDrawer({ items, kicker = 'Library · drag to schedule', meta }) {
  return (
    <aside style={{
      width: 280, flexShrink: 0,
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
        <CalEyebrow>{kicker}</CalEyebrow>
        {meta && <CalMono s={10} st={{ display: 'block', marginTop: 4 }}>{meta}</CalMono>}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(l => (
          <div key={l.id} style={{
            display: 'flex', gap: 10, padding: 8,
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 7, cursor: 'grab',
          }}>
            <div style={{
              width: l.ratio === '9:16' ? 30 : l.ratio === '1:1' ? 42 : 54,
              height: 44,
              background: l.tone || 'repeating-linear-gradient(45deg, var(--surface-2) 0 6px, var(--surface-3) 6px 12px)',
              borderRadius: 4, flexShrink: 0,
              border: '1px solid var(--border-subtle)',
            }} />
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <span style={{
                fontFamily: CALM.sans, fontSize: 12, fontWeight: 600,
                color: 'var(--fg-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{l.t}</span>
              <CalMono s={9.5}>{l.ratio} · {l.plat}</CalMono>
              <CalMono s={9} c={
                l.status === 'edited' ? 'var(--tone-success)' :
                l.status === 'draft'  ? 'var(--accent-primary)' :
                'var(--fg-tertiary)'
              }>{l.status}</CalMono>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// Library-drawer fixture (dive-flavored, niche-agnostic chrome)
const CAL_LIB_ITEMS = [
  { id: 'L1', t: 'Pre-dive checklist · alt cut', ratio: '9:16', plat: 'IG Reel',     status: 'edited', tone: 'linear-gradient(135deg, #c47a5a 0%, #6e3a2a 100%)' },
  { id: 'L2', t: 'Fujikawa teaser · 0:08',       ratio: '9:16', plat: 'TikTok',      status: 'draft',  tone: 'linear-gradient(180deg, #6a8290 0%, #2a3a48 100%)' },
  { id: 'L3', t: 'SPG vs computer · carousel',   ratio: '1:1',  plat: 'IG carousel', status: 'edited', tone: 'linear-gradient(135deg, #d4b576 0%, #6e5a2c 100%)' },
  { id: 'L4', t: 'La Jolla scout · still',       ratio: '9:16', plat: 'IG Story',    status: 'raw',    tone: 'linear-gradient(180deg, #7e9b8c 0%, #2a4032 100%)' },
  { id: 'L5', t: '8-second rule · b-roll',       ratio: '9:16', plat: 'TikTok',      status: 'edited', tone: 'linear-gradient(180deg, #5a7488 0%, #1a2a36 100%)' },
  { id: 'L6', t: 'Truk · ep. 2 hook',            ratio: '16:9', plat: 'YouTube',     status: 'draft',  tone: 'linear-gradient(135deg, #4a6678 0%, #1c2a34 100%)' },
];

// ──────────────────────────────────────────────────────────
// SURFACE 1 · HF_CalendarDay
// vertical hour spine 06:00-22:00 · 280 drawer left · 360 rail right
// ──────────────────────────────────────────────────────────
function HF_CalendarDay({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after. Note the prop is named
  // `state` while local event objects also use a `state` key; they don't collide
  // because the event-state lives on each event object, not in this scope.
  const ovr = window.useSurfaceState && window.useSurfaceState('calendar', 'Day');
  // D5 · pull pushModal off the master state so hour-spine events can open
  // the slot-edit modal. useMasterState is a real hook → must be called at
  // the top of the component. When the surface is rendered outside the
  // MasterStateProvider (e.g. layout view, R3 IA preview), useMasterState
  // throws — guard with try/catch so the surface still mounts standalone.
  let ms = null;
  try { ms = window.useMasterState && window.useMasterState(); } catch (_e) { ms = null; }
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="calendar"><window.HF_SkeletonHero shape="card-row" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="calendar"><window.HF_EmptyHero
      eyebrow="Day · 0 scheduled"
      title="Nothing on the day yet. Drop a post into a slot to begin."
      caption="Hour-by-hour view with a now-line — distinct from the project Calendar in Studio."
      ctaLabel="Open Calendar"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="calendar"><window.HF_ErrorHero
      title="Couldn't load the day view."
      body="The schedule index timed out. Retry, or check the platform connections."
    /></HfShell>;
  }
  const HOURS = Array.from({ length: 17 }, (_, i) => 6 + i); // 6..22
  const HOUR_PX = 44;
  const events = [
    { id: 'wed-0700-yt', time: 7.5,  dur: 0.5, title: 'Fujikawa primer · long YT post-up',  chan: 'yt', state: 'queued', caption: 'Auto-publishing on the schedule channel · 7:30 AM PT.' },
    { id: 'tue-1200-ig', time: 12.0, dur: 0.5, title: 'SPG vs computer · carousel',         chan: 'ig', state: 'queued', caption: 'Six frames · cap 142 chars · alt-text added.' },
    { id: 'thu-1830-ig', time: 18.5, dur: 0.5, title: 'Pre-dive checklist · Reel',           chan: 'ig', state: 'ready',  caption: 'Caption needs a final pass · auto-skip if not approved by 6:00 PM.' },
    { id: 'tue-2100-tt', time: 21.0, dur: 0.5, title: '8-second rule · alt cut',             chan: 'tt', state: 'draft',  caption: 'Sound trending up · safe to ship.' },
  ];
  const fmtH = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    const ampm = hh < 12 ? 'AM' : 'PM';
    const hh12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${hh12}:${String(mm).padStart(2, '0')} ${ampm}`;
  };
  const NOW = 11 + 18 / 60; // 11:18 AM

  return (
    <HfShell workspace="calendar">
      <CalHeader
        byline="TUE · APR 23 · 2026 · TODAY"
        headline="Today on the schedule"
        deck="Four posts queued across three channels. One needs a final caption pass before 6:00 PM or it auto-skips. Nothing past 9:00 PM."
        right={<FreshnessPill at="2 min ago" state="fresh" />}
      />
      <CalKpiStrip items={[
        { label: 'SCHEDULED', value: '4',    sub: 'POSTS' },
        { label: 'CHANNELS',  value: '3',    sub: 'IG · YT · TT' },
        { label: 'EARLIEST',  value: '7:30', sub: 'AM' },
        { label: 'LATEST',    value: '9:00', sub: 'PM' },
        { label: 'NEEDS APPROVAL', value: '1', sub: 'BY 6:00 PM', accent: true },
      ]} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <CalLibraryDrawer items={CAL_LIB_ITEMS} meta="6 ready · 14 drafts · drag onto a slot" />

        {/* Hour spine */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: '20px 28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <CalEyebrow>Hour spine · 06 → 22</CalEyebrow>
            <CalMono s={10.5}>option-drag to copy · ⌘ click to mute</CalMono>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', columnGap: 14 }}>
            {/* hour ticks */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {HOURS.map(h => (
                <div key={h} style={{ height: HOUR_PX, display: 'flex', justifyContent: 'flex-end' }}>
                  <CalMono s={10} st={{ fontVariantNumeric: 'tabular-nums' }}>{fmtH(h)}</CalMono>
                </div>
              ))}
            </div>
            {/* spine track */}
            <div style={{ position: 'relative', borderLeft: '1px solid var(--border-default)' }}>
              {HOURS.map((h, i) => (
                i === 0 ? null : (
                  <div key={h} style={{
                    position: 'absolute', top: i * HOUR_PX, left: 0, right: 0, height: 0,
                    borderTop: '1px dashed var(--border-subtle)',
                  }} />
                )
              ))}
              {/* now line */}
              <div style={{
                position: 'absolute', top: (NOW - 6) * HOUR_PX, left: -8, right: 0,
                display: 'flex', alignItems: 'center', gap: 8,
                pointerEvents: 'none', zIndex: 3,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                <span style={{ flex: 1, height: 1, background: 'var(--accent-primary)' }} />
                <CalMono s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>NOW · 11:18 AM</CalMono>
              </div>
              {/* events */}
              <div style={{ position: 'relative', height: HOURS.length * HOUR_PX }}>
                {events.map((e, i) => {
                  const top = (e.time - 6) * HOUR_PX;
                  const height = Math.max(e.dur * HOUR_PX, 64);
                  const c = CAL_CHAN_COLOR[e.chan] || 'var(--fg-tertiary)';
                  const isReady = e.state === 'ready';
                  // D5: click an hour-spine event to open the slot-edit modal.
                  // Routes through the master state — no-op when MasterState
                  // is absent (e.g. layout view) so the surface stays usable.
                  const onSlotClick = () => {
                    if (ms && ms.pushModal) ms.pushModal('ModalSlotEdit', { slotId: e.id });
                  };
                  return (
                    <div key={e.id} onClick={onSlotClick} style={{
                      position: 'absolute', top, left: 12, right: 28,
                      height,
                      padding: '10px 14px',
                      background: isReady ? 'var(--accent-soft)' : 'var(--surface-1)',
                      border: `1px solid ${isReady ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      borderLeft: `4px solid ${c}`,
                      borderRadius: 7,
                      display: 'flex', flexDirection: 'column', gap: 4,
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer', userSelect: 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ChannelGlyph id={e.chan} size={16} />
                        <CalMono s={10} c="var(--fg-secondary)" st={{ fontWeight: 600 }}>{fmtH(e.time)}</CalMono>
                        <span style={{ flex: 1 }} />
                        <CalMono s={9} c={isReady ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'} st={{ fontWeight: 600 }}>{e.state.toUpperCase()}</CalMono>
                      </div>
                      <span style={{
                        fontFamily: CALM.sans, fontSize: 12.5, fontWeight: 600,
                        color: 'var(--fg-primary)', lineHeight: 1.3,
                      }}>{e.title}</span>
                      <span style={{
                        fontFamily: CALM.sans, fontSize: 11,
                        color: 'var(--fg-secondary)', lineHeight: 1.4,
                      }}>{e.caption}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <CalOneThing
          kicker="APPROVE BY 6:00 PM"
          headline="Pre-dive checklist · Reel"
          body="Caption needs a final pass before the 6:30 PM IG slot. If you don't approve, the slot opens up and the post moves to drafts."
          ctaLabel="Open the post"
          secondaryLabel="OR · skip the slot"
          extra={
            <div style={{ paddingTop: 4, borderTop: '1px solid var(--border-subtle)', marginTop: 6, paddingBottom: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CalEyebrow s={9} st={{ paddingTop: 14 }}>UP NEXT · TODAY</CalEyebrow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {events.slice(1).map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CalMono s={10} st={{ width: 64, fontWeight: 600 }}>{fmtH(e.time)}</CalMono>
                    <ChannelGlyph id={e.chan} size={14} />
                    <span style={{
                      flex: 1, fontFamily: CALM.sans, fontSize: 11.5,
                      color: 'var(--fg-secondary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{e.title}</span>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>
    </HfShell>
  );
}

// ──────────────────────────────────────────────────────────
// SURFACE 2 · HF_CalendarMonth
// 5x7 month grid · today highlighted · weekend tinted · count + top slot per cell
// ──────────────────────────────────────────────────────────
function HF_CalendarMonth({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('calendar', 'Month');
  // D5 · pull pushModal / pushToast off the master state so populated month
  // cells are clickable. Standalone preview contexts (layout view, R3 IA
  // preview) don't have a MasterStateProvider — guard with try/catch.
  let ms = null;
  try { ms = window.useMasterState && window.useMasterState(); } catch (_e) { ms = null; }
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="calendar"><window.HF_SkeletonHero shape="calendar-week" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="calendar"><window.HF_EmptyHero
      eyebrow="Month · 0 scheduled"
      title="Nothing on the month yet. The grid fills as you queue posts."
      caption="Daily counts and the top slot per cell — a quick read on coverage."
      ctaLabel="Open Calendar"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="calendar"><window.HF_ErrorHero
      title="Couldn't load the month view."
      body="The schedule index timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  // April 2026 · build 5 weeks starting Mon · Mar 30
  const startMon = new Date(Date.UTC(2026, 2, 30));
  const cells = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(startMon.getTime() + i * 24 * 3600 * 1000);
    const dom = d.getUTCDate();
    const month = d.getUTCMonth(); // 0=Jan
    const inMonth = month === 3;   // April
    const day = d.getUTCDay();     // 0=Sun..6=Sat
    const isWeekend = day === 0 || day === 6;
    const isToday = inMonth && dom === 23;
    cells.push({ date: dom, inMonth, isToday, isWeekend });
  }
  // Schedule data keyed by April day. `conflict` is set on days where two posts
  // collide on the same channel within a 30-minute window — surfaces a clay
  // marker dot in the cell header and is the entry point to HF_CalendarConflict.
  const schedule = {
    1:  { count: 1, top: { title: 'Re-edit announcement · YT', chan: 'yt' } },
    2:  { count: 2, top: { title: 'La Jolla scout · IG Story', chan: 'ig' } },
    4:  { count: 1, top: { title: 'Saturday b-roll teaser',    chan: 'tt' } },
    7:  { count: 3, top: { title: 'Truk · ep. 1 launch',       chan: 'yt' } },
    8:  { count: 2, top: { title: 'SPG carousel · part 1',     chan: 'ig' } },
    10: { count: 1, top: { title: 'Friday check-in',           chan: 'tt' } },
    14: { count: 2, top: { title: 'Truk · ep. 1 part 2',       chan: 'yt' } },
    15: { count: 1, top: { title: 'Mid-month recap',           chan: 'ig' } },
    17: { count: 1, top: { title: 'Friday cut · short',        chan: 'tt' } },
    21: { count: 2, top: { title: 'Truk · ep. 2 hook',         chan: 'yt' } },
    22: { count: 1, top: { title: 'SPG carousel · part 2',     chan: 'ig' } },
    23: { count: 4, top: { title: 'Pre-dive checklist · IG',   chan: 'ig' }, conflict: 'IG · 6:30 PM and 6:50 PM collide' },
    24: { count: 2, top: { title: 'Fujikawa primer · YT',      chan: 'yt' } },
    25: { count: 1, top: { title: '8-second rule · alt cut',   chan: 'tt' } },
    28: { count: 2, top: { title: 'Older divers Q&A · YT',     chan: 'yt' }, conflict: 'YT · two long posts within an hour' },
    29: { count: 1, top: { title: 'Truk · ep. 2 part 2',       chan: 'yt' } },
  };
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <HfShell workspace="calendar">
      <CalHeader
        byline="MONTH · APRIL · 2026"
        headline="April"
        deck="Forty-seven posts scheduled across three channels. Tuesday and Friday are the heaviest days; weekends carry one slot at most. Six days remain after today."
        right={<FreshnessPill at="just now" state="fresh" />}
      />
      <CalKpiStrip items={[
        { label: 'SCHEDULED',   value: '47', sub: 'POSTS' },
        { label: 'CHANNELS',    value: '3',  sub: 'IG · YT · TT' },
        { label: 'POSTED',      value: '32', sub: 'OF 47' },
        { label: 'REMAINING',   value: '15', sub: '6 DAYS LEFT' },
        { label: 'BUSIEST DAY', value: '4',  sub: 'TUE · APR 23', accent: true },
      ]} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0, padding: '18px 24px 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* DOW header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 6 }}>
            {dayNames.map(d => (
              <div key={d} style={{ padding: '6px 10px' }}>
                <CalEyebrow s={9.5}>{d}</CalEyebrow>
              </div>
            ))}
          </div>
          {/* 5x7 grid */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(5, 1fr)',
            gap: 1,
            background: 'var(--border-subtle)',
            border: '1px solid var(--border-subtle)',
          }}>
            {cells.map((c, i) => {
              const sch = c.inMonth ? schedule[c.date] : null;
              const cellBg = c.isToday   ? 'var(--accent-soft)' :
                             !c.inMonth  ? 'var(--surface-2)'   :
                             c.isWeekend ? 'var(--surface-1)'   :
                                           'var(--bg-base)';
              // D5 · click a populated cell to drop into the day view; click an
              // empty cell to surface a "drag a draft here" toast. Conflict
              // cells route to the conflict surface message instead.
              const onCellClick = sch
                ? (sch.conflict
                    ? () => { if (ms && ms.pushToast) ms.pushToast('Resolve conflict · Apr ' + c.date + ' · ' + sch.conflict); }
                    : () => { if (ms && ms.pushToast) ms.pushToast('Open day view · Apr ' + c.date + ' · ' + sch.count + ' scheduled'); })
                : (c.inMonth
                    ? () => { if (ms && ms.pushToast) ms.pushToast('Drop a draft on Apr ' + c.date); }
                    : null);
              return (
                <div key={i} onClick={onCellClick} style={{
                  background: cellBg,
                  padding: '10px 12px',
                  display: 'flex', flexDirection: 'column', gap: 6,
                  minWidth: 0, overflow: 'hidden',
                  opacity: c.inMonth ? 1 : 0.55,
                  cursor: c.inMonth ? 'pointer' : 'default',
                  userSelect: 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span className="hf-num" style={{
                      fontFamily: CALM.serif, fontSize: 22, fontWeight: 500,
                      color: c.isToday ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
                      letterSpacing: '-0.01em', lineHeight: 1,
                    }}>{c.date}</span>
                    {c.isToday && <CalMono s={9} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>TODAY</CalMono>}
                    {sch && sch.conflict && (
                      <span title={sch.conflict} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '1px 5px', borderRadius: 3,
                        background: 'var(--accent-soft)',
                        border: '1px solid var(--accent-primary)',
                        fontFamily: CALM.mono, fontSize: 8.5, fontWeight: 700,
                        color: 'var(--accent-primary-press)',
                        letterSpacing: '0.1em',
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                        CONFLICT
                      </span>
                    )}
                    {sch && (
                      <CalMono s={9.5} c="var(--fg-tertiary)" st={{ marginLeft: 'auto', fontWeight: 600 }}>
                        {sch.count}
                      </CalMono>
                    )}
                  </div>
                  {sch && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '4px 6px',
                        background: 'var(--surface-1)',
                        border: '1px solid var(--border-subtle)',
                        borderLeft: `3px solid ${CAL_CHAN_COLOR[sch.top.chan]}`,
                        borderRadius: 4,
                      }}>
                        <span style={{
                          fontFamily: CALM.sans, fontSize: 10.5,
                          color: 'var(--fg-primary)', fontWeight: 500, lineHeight: 1.25,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{sch.top.title}</span>
                      </div>
                      {sch.count > 1 && (
                        <CalMono s={9} c="var(--fg-tertiary)">+{sch.count - 1} more</CalMono>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <CalOneThing
          kicker="LIGHT THE GAPS"
          headline="Friday · Apr 24 has only 1 slot."
          body="The last three Fridays you posted twice. Drop the SPG carousel into the 6:30 PM slot and the alt-cut into 9:00 PM to keep the rhythm."
          ctaLabel="Schedule into Friday"
          secondaryLabel="OR · let it ride"
          extra={
            <div style={{ paddingTop: 14, marginTop: 6, borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <CalEyebrow s={9}>CHANNEL MIX · APRIL</CalEyebrow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { chan: 'yt', name: 'YouTube',   count: 14, share: 0.30 },
                  { chan: 'ig', name: 'Instagram', count: 21, share: 0.45 },
                  { chan: 'tt', name: 'TikTok',    count: 12, share: 0.25 },
                ].map(c => (
                  <div key={c.chan} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ChannelGlyph id={c.chan} size={14} />
                    <span style={{
                      flex: 1, fontFamily: CALM.sans, fontSize: 11.5,
                      color: 'var(--fg-secondary)',
                    }}>{c.name}</span>
                    <CalMono s={10} st={{ width: 22, textAlign: 'right' }}>{c.count}</CalMono>
                    <div style={{ width: 76, height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${c.share * 100}%`, height: '100%',
                        background: CAL_CHAN_COLOR[c.chan], borderRadius: 2,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>
    </HfShell>
  );
}

// ──────────────────────────────────────────────────────────
// Mini week view — reused by SlotDrawer + Conflict
// ──────────────────────────────────────────────────────────
function CalMiniWeek({ highlightDayIdx = 1, highlightTimeIdx = 0, conflictDayIdx = -1, conflictTimeIdxs = [] }) {
  const days = ['Mon · 22', 'Tue · 23', 'Wed · 24', 'Thu · 25', 'Fri · 26', 'Sat · 27', 'Sun · 28'];
  const events = {
    'Mon · 22': [{ time: '6:30 PM', t: 'SPG carousel · part 1', chan: 'ig' }],
    'Tue · 23': [
      { time: '7:30 AM',  t: 'Fujikawa primer',         chan: 'yt' },
      { time: '12:00 PM', t: 'SPG · carousel',          chan: 'ig' },
      { time: '6:30 PM',  t: 'Pre-dive checklist',      chan: 'ig' },
      { time: '6:50 PM',  t: 'SPG vs computer · carousel', chan: 'ig' },
      { time: '9:00 PM',  t: '8-second rule · alt cut', chan: 'tt' },
    ],
    'Wed · 24': [
      { time: '7:00 AM',  t: 'Fujikawa primer · YT', chan: 'yt' },
      { time: '6:00 PM',  t: 'La Jolla scout',       chan: 'ig' },
    ],
    'Thu · 25': [{ time: '6:30 PM', t: 'Pre-dive checklist · Reel', chan: 'ig' }],
    'Fri · 26': [{ time: '6:30 PM', t: 'open slot', chan: null, open: true }],
    'Sat · 27': [],
    'Sun · 28': [{ time: '9:00 AM', t: 'open slot', chan: null, open: true }],
  };
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '14px 24px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'baseline', gap: 14,
        flexShrink: 0,
      }}>
        <CalSerifItalic s={24}>April · week of 22</CalSerifItalic>
        <CalMono>‹ prev · this week · next ›</CalMono>
        <span style={{ flex: 1 }} />
        <CalMono s={10.5}>Click a slot to edit · drag from library to schedule</CalMono>
      </div>
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        background: 'var(--border-subtle)',
        overflow: 'auto',
      }}>
        {days.map((d, di) => {
          const isToday = di === 1;
          return (
            <div key={d} style={{
              background: isToday ? 'var(--accent-soft)' : 'var(--surface-1)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                padding: '10px 12px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'baseline', gap: 6,
              }}>
                <CalEyebrow s={9.5} c={isToday ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)'}>{d.split(' · ')[0]}</CalEyebrow>
                <span style={{
                  fontFamily: CALM.serif, fontSize: 16, color: 'var(--fg-primary)', fontWeight: 500,
                }}>{d.split(' · ')[1]}</span>
                {isToday && <CalMono s={9} c="var(--accent-primary-press)" st={{ marginLeft: 'auto', fontWeight: 600 }}>TODAY</CalMono>}
              </div>
              <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 320 }}>
                {(events[d] || []).map((e, i) => {
                  const isHighlight = di === highlightDayIdx && i === highlightTimeIdx;
                  const isConflict  = di === conflictDayIdx  && conflictTimeIdxs.includes(i);
                  const stripe = !e.open ? (CAL_CHAN_COLOR[e.chan] || 'var(--fg-tertiary)') : 'transparent';
                  return (
                    <div key={i} style={{
                      padding: 8,
                      background: isHighlight ? 'var(--accent-soft)'
                                : isConflict  ? 'var(--accent-soft)'
                                : e.open      ? 'var(--surface-2)'
                                              : 'var(--surface-1)',
                      border: isHighlight ? '2px solid var(--accent-primary)'
                            : isConflict  ? '2px solid var(--accent-primary)'
                            : e.open      ? '1px dashed var(--border-default)'
                                          : '1px solid var(--border-subtle)',
                      borderLeft: !e.open ? `3px solid ${stripe}` : '1px dashed var(--border-default)',
                      borderRadius: 6,
                      display: 'flex', flexDirection: 'column', gap: 3,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalMono s={9.5} c={(isHighlight || isConflict) ? 'var(--accent-primary-press)' : 'var(--fg-secondary)'} st={{ fontWeight: 600 }}>{e.time}</CalMono>
                        {isConflict && <CalMono s={9} c="var(--accent-primary-press)" st={{ marginLeft: 'auto', fontWeight: 700 }}>CONFLICT</CalMono>}
                      </div>
                      <span style={{
                        fontFamily: CALM.sans, fontSize: 11.5,
                        color: 'var(--fg-primary)', fontWeight: 500, lineHeight: 1.3,
                      }}>{e.t}</span>
                      {e.chan && <CalMono s={9} c="var(--fg-tertiary)">{CAL_CHAN_LABEL[e.chan]}</CalMono>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// SURFACE 3 · HF_CalendarSlotDrawer
// week view in bg + 480px right drawer editing one slot
// ──────────────────────────────────────────────────────────
function HF_CalendarSlotDrawer() {
  return (
    <HfShell workspace="calendar">
      <CalHeader
        byline="EDIT · ONE SLOT"
        headline="Thursday · 6:30 PM"
        deck="Pre-dive checklist · Reel. The asset is approved; the caption needs a final pass. Approve to lock the slot, skip to free it for something else."
      />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <CalMiniWeek highlightDayIdx={3} highlightTimeIdx={0} />

        {/* Drawer · 480px */}
        <aside style={{
          width: 480, flexShrink: 0,
          borderLeft: '1px solid var(--border-default)',
          background: 'var(--surface-1)',
          display: 'flex', flexDirection: 'column',
          overflow: 'auto',
          boxShadow: '-2px 0 14px rgba(26,24,21,0.05)',
        }}>
          <div style={{
            padding: '20px 22px 14px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'baseline', gap: 10,
          }}>
            <CalEyebrow>EDITING · THU · APR 25</CalEyebrow>
            <span style={{ flex: 1 }} />
            <CalMono s={10}>esc · close</CalMono>
          </div>

          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Asset preview */}
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{
                width: 96, height: 170,
                background: 'linear-gradient(135deg, #c47a5a 0%, #6e3a2a 100%)',
                borderRadius: 6, flexShrink: 0,
                border: '1px solid var(--border-subtle)',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', top: 6, left: 6,
                  fontFamily: CALM.mono, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#fdfcf9', background: 'rgba(0,0,0,0.42)',
                  padding: '2px 5px', borderRadius: 3,
                }}>9:16</span>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <CalEyebrow s={9}>ASSET</CalEyebrow>
                <CalSerifItalic s={18}>Pre-dive checklist · Reel</CalSerifItalic>
                <CalMono s={10}>0:42 · 9:16 · safe area · clean audio</CalMono>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--tone-success)' }} />
                  <CalMono s={9.5} c="var(--tone-success)" st={{ fontWeight: 600 }}>EDITED · READY</CalMono>
                </div>
              </div>
            </div>

            {/* Channel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CalEyebrow s={9}>CHANNEL</CalEyebrow>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'ig', name: 'Instagram · Reel', active: true },
                  { id: 'tt', name: 'TikTok',           active: false },
                  { id: 'yt', name: 'YT Shorts',        active: false },
                ].map(c => (
                  <span key={c.id} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    height: 30, padding: '0 12px',
                    background: c.active ? 'var(--accent-soft)' : 'var(--surface-2)',
                    border: c.active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    fontFamily: CALM.sans, fontSize: 11.5,
                    color: c.active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                    fontWeight: c.active ? 600 : 500,
                  }}>
                    <ChannelGlyph id={c.id} size={14} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Time */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CalEyebrow s={9}>TIME · LOCAL · PT</CalEyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  height: 34, padding: '0 14px',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-default)', borderRadius: 6,
                  fontFamily: CALM.mono, fontSize: 13, fontWeight: 600,
                  color: 'var(--fg-primary)', letterSpacing: '0.04em',
                }}>Thu · Apr 25 · 6:30 PM</span>
                <CalMono s={10.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>BEST FOR YOU · 6 → 7 PM</CalMono>
              </div>
            </div>

            {/* Caption */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <CalEyebrow s={9}>CAPTION</CalEyebrow>
                <CalMono s={9.5}>118 / 220</CalMono>
                <span style={{ flex: 1 }} />
                <CalMono s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>NEEDS A PASS</CalMono>
              </div>
              <div style={{
                padding: '12px 14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                fontFamily: CALM.sans, fontSize: 12.5,
                color: 'var(--fg-primary)', lineHeight: 1.55,
                minHeight: 96,
              }}>
                Run this list once. Out loud. Every dive. This is the one I do at the surface — gear, gas, plan, exit. If any item gets a "maybe", you postpone.
              </div>
              <CalMono s={10} c="var(--fg-tertiary)">Coopr suggests · "Tighten the open by 1.2s · keep the exit beat."</CalMono>
            </div>

            {/* CTA row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                height: 36, padding: '0 18px',
                background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
                border: '1px solid var(--accent-primary-press)',
                borderRadius: 7,
                fontFamily: CALM.sans, fontSize: 13, fontWeight: 600,
                letterSpacing: '-0.005em',
              }}>Approve · lock the slot</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                height: 36, padding: '0 14px',
                background: 'var(--surface-1)',
                border: '1px solid var(--border-default)', borderRadius: 7,
                fontFamily: CALM.sans, fontSize: 12.5,
                color: 'var(--fg-secondary)', fontWeight: 500,
              }}>Skip · open the slot</span>
              <span style={{ flex: 1 }} />
              <CalMono s={10} c="var(--fg-tertiary)">⌘ ↵</CalMono>
            </div>
          </div>
        </aside>
      </div>
    </HfShell>
  );
}

// ──────────────────────────────────────────────────────────
// MODAL · HF_ModalSlotEdit
// Modal-shaped wrapper around the slot drawer body. Loads inside
// MasterModalLayer's centered 640-wide card; click on a Calendar week
// slot or Day hour event pushes ('ModalSlotEdit', { slotId }). The slot
// fixture is keyed by id; falls back to a generic record so the modal
// is observable even without a registered slot.
// ──────────────────────────────────────────────────────────
const CAL_SLOT_FIXTURES = {
  'thu-1830-ig': {
    when: 'Thu · Apr 25 · 6:30 PM',
    eyebrow: 'EDITING · THU · APR 25',
    asset: 'Pre-dive checklist · Reel',
    assetMeta: '0:42 · 9:16 · safe area · clean audio',
    assetState: 'EDITED · READY',
    channels: [
      { id: 'ig', name: 'Instagram · Reel', active: true },
      { id: 'tt', name: 'TikTok',           active: false },
      { id: 'yt', name: 'YT Shorts',        active: false },
    ],
    bestWindow: 'BEST FOR YOU · 6 → 7 PM',
    captionLen: '118 / 220',
    captionState: 'NEEDS A PASS',
    caption: "Run this list once. Out loud. Every dive. This is the one I do at the surface — gear, gas, plan, exit. If any item gets a \"maybe\", you postpone.",
    suggestion: "Coopr suggests · \"Tighten the open by 1.2s · keep the exit beat.\"",
  },
  'wed-0700-yt': {
    when: 'Wed · Apr 24 · 7:00 AM',
    eyebrow: 'EDITING · WED · APR 24',
    asset: 'Fujikawa primer · long YT post-up',
    assetMeta: '8:12 · 16:9 · graded · captions baked',
    assetState: 'PUBLISHED-READY',
    channels: [
      { id: 'yt', name: 'YouTube',          active: true },
      { id: 'ig', name: 'Instagram · Reel', active: false },
      { id: 'tt', name: 'TikTok',           active: false },
    ],
    bestWindow: 'BEST FOR YOU · 7 → 9 AM',
    captionLen: '184 / 220',
    captionState: 'READY',
    caption: "The first time I dropped on the Fujikawa I held my breath at the rail. This is the long version of why that hold-of-breath matters — and why eight breaths is the right unit for this dive.",
    suggestion: "Coopr suggests · \"Pin the SAC line as the first comment.\"",
  },
  'fri-1830-open': {
    when: 'Fri · Apr 26 · 6:30 PM',
    eyebrow: 'OPEN SLOT · FRI · APR 26',
    asset: '— empty slot',
    assetMeta: 'no asset attached · drag from Library',
    assetState: 'OPEN',
    channels: [
      { id: 'ig', name: 'Instagram · Reel', active: true },
      { id: 'tt', name: 'TikTok',           active: false },
      { id: 'yt', name: 'YT Shorts',        active: false },
    ],
    bestWindow: 'BEST FOR YOU · 6 → 7 PM',
    captionLen: '0 / 220',
    captionState: 'EMPTY',
    caption: "",
    suggestion: "Coopr suggests · \"Pair an 8-second hook with the Reel; carousel goes to Saturday.\"",
  },
};

function HF_ModalSlotEdit({ slotId }) {
  // Fallback fixture so the modal renders even when slotId is missing
  // or unknown — the dispatch contract stays observable end-to-end.
  const slot = (slotId && CAL_SLOT_FIXTURES[slotId])
    || CAL_SLOT_FIXTURES['thu-1830-ig'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0 }}>
      <div style={{
        paddingBottom: 14, marginBottom: 18,
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'baseline', gap: 10,
      }}>
        <CalEyebrow>{slot.eyebrow}</CalEyebrow>
        <span style={{ flex: 1 }} />
        <CalMono s={10}>esc · close</CalMono>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <CalEyebrow s={9}>SLOT</CalEyebrow>
          <CalSerifItalic s={26}>{slot.when}</CalSerifItalic>
        </div>

        {/* Asset preview */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{
            width: 88, height: 156,
            background: 'linear-gradient(135deg, #c47a5a 0%, #6e3a2a 100%)',
            borderRadius: 6, flexShrink: 0,
            border: '1px solid var(--border-subtle)',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute', top: 6, left: 6,
              fontFamily: CALM.mono, fontSize: 9, fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#fdfcf9', background: 'rgba(0,0,0,0.42)',
              padding: '2px 5px', borderRadius: 3,
            }}>9:16</span>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <CalEyebrow s={9}>ASSET</CalEyebrow>
            <CalSerifItalic s={18}>{slot.asset}</CalSerifItalic>
            <CalMono s={10}>{slot.assetMeta}</CalMono>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--tone-success)' }} />
              <CalMono s={9.5} c="var(--tone-success)" st={{ fontWeight: 600 }}>{slot.assetState}</CalMono>
            </div>
          </div>
        </div>

        {/* Channel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CalEyebrow s={9}>CHANNEL</CalEyebrow>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {slot.channels.map(c => (
              <span key={c.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 30, padding: '0 12px',
                background: c.active ? 'var(--accent-soft)' : 'var(--surface-2)',
                border: c.active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 6,
                fontFamily: CALM.sans, fontSize: 11.5,
                color: c.active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                fontWeight: c.active ? 600 : 500,
              }}>
                <ChannelGlyph id={c.id} size={14} />
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Time */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CalEyebrow s={9}>TIME · LOCAL · PT</CalEyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              height: 34, padding: '0 14px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)', borderRadius: 6,
              fontFamily: CALM.mono, fontSize: 13, fontWeight: 600,
              color: 'var(--fg-primary)', letterSpacing: '0.04em',
            }}>{slot.when}</span>
            <CalMono s={10.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>{slot.bestWindow}</CalMono>
          </div>
        </div>

        {/* Caption */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <CalEyebrow s={9}>CAPTION</CalEyebrow>
            <CalMono s={9.5}>{slot.captionLen}</CalMono>
            <span style={{ flex: 1 }} />
            <CalMono s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>{slot.captionState}</CalMono>
          </div>
          <div style={{
            padding: '12px 14px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            fontFamily: CALM.sans, fontSize: 12.5,
            color: 'var(--fg-primary)', lineHeight: 1.55,
            minHeight: 88,
          }}>
            {slot.caption || (
              <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>
                No caption yet. Drop an asset or write one in place.
              </span>
            )}
          </div>
          <CalMono s={10} c="var(--fg-tertiary)">{slot.suggestion}</CalMono>
        </div>

        {/* CTA row · primary + duplicate + publish-now + skip + delete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            height: 36, padding: '0 18px',
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            border: '1px solid var(--accent-primary-press)',
            borderRadius: 7,
            fontFamily: CALM.sans, fontSize: 13, fontWeight: 600,
            letterSpacing: '-0.005em',
            cursor: 'pointer', userSelect: 'none',
          }}>Approve · lock the slot</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            height: 36, padding: '0 14px',
            background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
            borderRadius: 7,
            fontFamily: CALM.sans, fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer', userSelect: 'none',
          }}>Publish now</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            height: 36, padding: '0 12px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-default)', borderRadius: 7,
            fontFamily: CALM.sans, fontSize: 12,
            color: 'var(--fg-secondary)', fontWeight: 500,
            cursor: 'pointer', userSelect: 'none',
          }}>Duplicate</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            height: 36, padding: '0 12px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-default)', borderRadius: 7,
            fontFamily: CALM.sans, fontSize: 12,
            color: 'var(--fg-secondary)', fontWeight: 500,
            cursor: 'pointer', userSelect: 'none',
          }}>Skip · open the slot</span>
          <span style={{ flex: 1 }} />
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            height: 36, padding: '0 12px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)', borderRadius: 7,
            fontFamily: CALM.sans, fontSize: 12,
            color: 'var(--tone-danger, #b04a3a)', fontWeight: 500,
            cursor: 'pointer', userSelect: 'none',
          }}>Delete slot</span>
          <CalMono s={10} c="var(--fg-tertiary)">cmd ret</CalMono>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// SURFACE 4 · HF_CalendarConflict
// week view + clay alert band + 360 drawer with 3 resolutions
// ──────────────────────────────────────────────────────────
function HF_CalendarConflict({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  // Note: the happy path of this surface is itself a conflict, so 'empty' here
  // means "no conflicts to resolve" — a positive state, framed as success.
  const ovr = window.useSurfaceState && window.useSurfaceState('calendar', 'Conflicts');
  // D5 · pull pushModal/pushToast off the master state so resolve CTAs and
  // colliding slots are clickable. useMasterState throws outside the
  // MasterStateProvider — guard with try/catch so the surface still mounts
  // standalone (layout view, R3 IA preview).
  let ms = null;
  try { ms = window.useMasterState && window.useMasterState(); } catch (_e) { ms = null; }
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="calendar"><window.HF_SkeletonHero shape="card-row" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="calendar"><window.HF_EmptyHero
      eyebrow="Conflicts · 0 active"
      title="No conflicts to resolve. The schedule is clean."
      caption="Overlap and same-channel collisions show up here when they happen, ordered by date."
      ctaLabel="Open Calendar"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="calendar"><window.HF_ErrorHero
      title="Couldn't load conflicts."
      body="The conflict checker timed out. Retry, or open the week view instead."
    /></HfShell>;
  }
  // Three active conflicts on the week. Each entry: a date, the two colliding
  // slots (channel + time + asset), the recommended resolution + an alt, and
  // the slot ids so a click can route to the slot-edit modal.
  const conflicts = [
    {
      id: 'C-tue-ig-evening',
      day: 'Tue · Apr 23',
      chan: 'ig',
      headline: 'Two Instagram posts inside thirty minutes.',
      summary: 'IG · 6:30 PM Reel and 6:50 PM carousel both land in the same window.',
      slots: [
        { id: 'thu-1830-ig', time: '6:30 PM', t: 'Pre-dive checklist · Reel',  chan: 'ig' },
        { id: 'tue-1850-ig', time: '6:50 PM', t: 'SPG vs computer · carousel', chan: 'ig' },
      ],
      recommend: 'Re-time the carousel to 9:00 PM',
      recommendBody: 'IG · 9:00 PM is your second-best window after 6 → 7 PM. Keeps both posts at full reach.',
      altLabel: 'Push to Wed · 6:30 PM',
      severity: 'high',
    },
    {
      id: 'C-thu-tt-overlap',
      day: 'Thu · Apr 25',
      chan: 'tt',
      headline: 'Two TikTok cuts share an audio loop.',
      summary: 'TT · 8:30 PM and 9:10 PM both ride the same trending sound on the same day.',
      slots: [
        { id: 'thu-2030-tt', time: '8:30 PM', t: 'Reef pointer · alt cut',     chan: 'tt' },
        { id: 'thu-2110-tt', time: '9:10 PM', t: '8-second rule · re-edit',    chan: 'tt' },
      ],
      recommend: 'Move the re-edit to Friday 12:00 PM',
      recommendBody: 'Friday lunch is the quietest TT slot of the week. Spaces the audio twin out by 16 hours.',
      altLabel: 'Swap audio · use second-pick sound',
      severity: 'medium',
    },
    {
      id: 'C-sun-yt-stack',
      day: 'Sun · Apr 28',
      chan: 'yt',
      headline: 'Two long-form YouTube posts stack within an hour.',
      summary: 'YT · 11:00 AM and 11:50 AM both go long. The algorithm caps recommendation surface for the second.',
      slots: [
        { id: 'sun-1100-yt', time: '11:00 AM', t: 'Older divers Q&A · long', chan: 'yt' },
        { id: 'sun-1150-yt', time: '11:50 AM', t: 'Truk · ep. 2 part 2',     chan: 'yt' },
      ],
      recommend: 'Push the Q&A to Mon · 7:00 AM',
      recommendBody: 'Q&A typically pulls a Monday-morning audience anyway. Frees Sunday for the Truk drop.',
      altLabel: 'Demote Q&A to a Short',
      severity: 'medium',
    },
  ];

  const onSlotClick = (slotId) => () => {
    if (ms && ms.pushModal) ms.pushModal('ModalSlotEdit', { slotId });
  };
  const onResolveClick = (cf, kind) => () => {
    if (!ms || !ms.pushToast) return;
    ms.pushToast(
      kind === 'recommend'
        ? 'Resolve · ' + cf.day + ' · ' + cf.recommend
        : 'Resolve · ' + cf.day + ' · ' + cf.altLabel
    );
  };
  const onIgnore = (cf) => () => {
    if (ms && ms.pushToast) ms.pushToast('Ignore conflict · ' + cf.day + ' · Coopr will not warn again');
  };

  return (
    <HfShell workspace="calendar">
      <CalHeader
        byline="CONFLICTS · WEEK OF APR 22"
        headline="Three collisions to resolve."
        deck="Two posts on the same channel inside a tight window dilute reach. Each row below shows the colliding slots and the recommended fix. Resolve them in any order."
        right={
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 30, padding: '0 12px',
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 6,
            fontFamily: CALM.mono, fontSize: 10, fontWeight: 600,
            color: 'var(--accent-primary-press)',
            letterSpacing: '0.08em',
          }}>● 3 CONFLICTS FLAGGED</span>
        }
      />
      <CalKpiStrip items={[
        { label: 'ACTIVE',        value: '3',  sub: 'CONFLICTS', accent: true },
        { label: 'CHANNELS HIT',  value: '3',  sub: 'IG · YT · TT' },
        { label: 'EARLIEST',      value: 'TUE', sub: 'APR 23' },
        { label: 'AUTO-RESOLVED', value: '14', sub: 'THIS MONTH' },
        { label: 'IGNORED',       value: '1',  sub: 'STILL SHIPPED' },
      ]} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <CalMiniWeek
          highlightDayIdx={-1}
          highlightTimeIdx={-1}
          conflictDayIdx={1}
          conflictTimeIdxs={[2, 3]}
        />

        {/* Resolve drawer · 360 — one card per conflict */}
        <aside style={{
          width: 360, flexShrink: 0,
          borderLeft: '1px solid var(--border-subtle)',
          background: 'var(--bg-base)',
          display: 'flex', flexDirection: 'column', gap: 14,
          padding: '20px 22px 18px',
          overflow: 'auto',
        }}>
          <CalEyebrow>RESOLVE · BY DATE</CalEyebrow>

          {conflicts.map((cf, idx) => {
            const isPrimary = idx === 0;
            return (
              <div key={cf.id} style={{
                padding: '14px 16px',
                background: isPrimary ? 'var(--accent-soft)' : 'var(--surface-1)',
                border: isPrimary ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 8,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {/* Conflict header · date + channel + severity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ChannelGlyph id={cf.chan} size={14} />
                  <CalMono s={9.5} c={isPrimary ? 'var(--accent-primary-press)' : 'var(--fg-secondary)'} st={{ fontWeight: 600 }}>
                    {cf.day.toUpperCase()}
                  </CalMono>
                  <span style={{ flex: 1 }} />
                  {isPrimary
                    ? <CalMono s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>RECOMMENDED FIRST</CalMono>
                    : <CalMono s={9.5} c="var(--fg-tertiary)" st={{ fontWeight: 600 }}>{cf.severity === 'high' ? 'HIGH' : 'MEDIUM'}</CalMono>}
                </div>

                <CalSerifItalic s={17}>{cf.headline}</CalSerifItalic>
                <span style={{
                  fontFamily: CALM.sans, fontSize: 11.5,
                  color: 'var(--fg-secondary)', lineHeight: 1.5,
                }}>{cf.summary}</span>

                {/* Two colliding slots · clickable */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cf.slots.map((sl) => (
                    <div key={sl.id} onClick={onSlotClick(sl.id)} style={{
                      padding: '6px 10px',
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderLeft: `3px solid ${CAL_CHAN_COLOR[sl.chan] || 'var(--fg-tertiary)'}`,
                      borderRadius: 5,
                      display: 'flex', alignItems: 'center', gap: 8,
                      cursor: 'pointer', userSelect: 'none',
                    }}>
                      <CalMono s={10} st={{ width: 64, fontWeight: 600 }}>{sl.time}</CalMono>
                      <span style={{
                        flex: 1, minWidth: 0,
                        fontFamily: CALM.sans, fontSize: 11.5,
                        color: 'var(--fg-primary)', fontWeight: 500, lineHeight: 1.3,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{sl.t}</span>
                      <CalMono s={9} c="var(--fg-tertiary)">{CAL_CHAN_LABEL[sl.chan]}</CalMono>
                    </div>
                  ))}
                </div>

                <span style={{
                  fontFamily: CALM.sans, fontSize: 11,
                  color: 'var(--fg-secondary)', lineHeight: 1.5,
                  fontStyle: 'italic',
                }}>{cf.recommendBody}</span>

                {/* Resolve CTA · primary + alt + ignore */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                  <span onClick={onResolveClick(cf, 'recommend')} style={{
                    display: 'inline-flex', alignItems: 'center',
                    height: 30, padding: '0 12px',
                    background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
                    border: '1px solid var(--accent-primary-press)',
                    borderRadius: 6,
                    fontFamily: CALM.sans, fontSize: 11.5, fontWeight: 600,
                    cursor: 'pointer', userSelect: 'none',
                  }}>{cf.recommend}</span>
                  <span onClick={onResolveClick(cf, 'alt')} style={{
                    display: 'inline-flex', alignItems: 'center',
                    height: 28, padding: '0 10px',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-default)', borderRadius: 6,
                    fontFamily: CALM.sans, fontSize: 11,
                    color: 'var(--fg-secondary)', fontWeight: 500,
                    cursor: 'pointer', userSelect: 'none',
                  }}>{cf.altLabel}</span>
                  <span onClick={onIgnore(cf)} style={{
                    fontFamily: CALM.mono, fontSize: 9.5,
                    color: 'var(--fg-tertiary)', fontWeight: 600,
                    letterSpacing: '0.06em',
                    cursor: 'pointer', userSelect: 'none',
                  }}>IGNORE</span>
                </div>
              </div>
            );
          })}

          <div style={{
            marginTop: 'auto', paddingTop: 14,
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <CalMono s={10} c="var(--fg-tertiary)">
              Or · ignore each pair and ship both posts. Coopr will not warn again on a dismissed conflict.
            </CalMono>
          </div>
        </aside>
      </div>
    </HfShell>
  );
}

// ──────────────────────────────────────────────────────────
// SURFACE 5 · HF_CalendarEmpty
// day-one state · empty grid + central pull-quote + connect-channel CTA
// ──────────────────────────────────────────────────────────
function HF_CalendarEmpty() {
  const days = ['Mon · 22', 'Tue · 23', 'Wed · 24', 'Thu · 25', 'Fri · 26', 'Sat · 27', 'Sun · 28'];
  return (
    <HfShell workspace="calendar">
      <CalHeader
        byline="DAY ONE · CALENDAR"
        headline="Nothing is scheduled yet."
        deck="Connect a channel and Coopr will read your last 30 days of posts and propose three slots for the week. The grid stays empty until then."
      />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative' }}>
        {/* Background grid · faded */}
        <div style={{
          flex: 1, minWidth: 0,
          padding: '18px 24px 24px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          opacity: 0.45, filter: 'saturate(0.6)',
        }}>
          <div style={{ padding: '0 0 12px', display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <CalSerifItalic s={22}>April · week of 22</CalSerifItalic>
            <CalMono>‹ prev · this week · next ›</CalMono>
          </div>
          <div style={{
            flex: 1,
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
            background: 'var(--border-subtle)',
            border: '1px solid var(--border-subtle)',
          }}>
            {days.map(d => (
              <div key={d} style={{ background: 'var(--surface-1)', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'baseline', gap: 6,
                }}>
                  <CalEyebrow s={9.5}>{d.split(' · ')[0]}</CalEyebrow>
                  <span style={{ fontFamily: CALM.serif, fontSize: 16, color: 'var(--fg-primary)', fontWeight: 500 }}>{d.split(' · ')[1]}</span>
                </div>
                <div style={{ padding: 8, minHeight: 320 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Centered hero CTA · overlaid */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(620px, calc(100% - 96px))',
          padding: '36px 44px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', gap: 18,
          textAlign: 'center', alignItems: 'center',
        }}>
          <CalEyebrow s={9.5}>BEFORE THE FIRST POST</CalEyebrow>
          <span style={{
            fontFamily: CALM.serif, fontStyle: 'italic',
            fontSize: 32, color: 'var(--fg-primary)',
            letterSpacing: '-0.02em', lineHeight: 1.18, fontWeight: 500,
            maxWidth: 480,
          }}>
            "A schedule is a promise to your audience.<br />
            Make the first one tonight."
          </span>
          <span style={{
            fontFamily: CALM.sans, fontSize: 13,
            color: 'var(--fg-secondary)', lineHeight: 1.6,
            maxWidth: 480,
          }}>
            Connect at least one channel — Coopr reads your last thirty days of posts and proposes three slots for this week. Edit them, drop them, or approve all three.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 38, padding: '0 20px',
              background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
              border: '1px solid var(--accent-primary-press)',
              borderRadius: 7,
              fontFamily: CALM.sans, fontSize: 13.5, fontWeight: 600,
              letterSpacing: '-0.005em',
            }}>
              <span style={{
                width: 14, height: 14,
                border: '1.5px solid currentColor', borderRadius: 3,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: CALM.mono, fontSize: 10, fontWeight: 700,
              }}>+</span>
              Connect a channel to schedule
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              height: 38, padding: '0 14px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-default)', borderRadius: 7,
              fontFamily: CALM.sans, fontSize: 12.5,
              color: 'var(--fg-secondary)', fontWeight: 500,
            }}>Or · pick a placeholder week</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
            paddingTop: 14, marginTop: 8,
            borderTop: '1px solid var(--border-subtle)',
            width: '100%',
          }}>
            {[
              { id: 'ig', name: 'Instagram' },
              { id: 'yt', name: 'YouTube' },
              { id: 'tt', name: 'TikTok' },
            ].map(c => (
              <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ChannelGlyph id={c.id} size={16} />
                <span style={{ fontFamily: CALM.sans, fontSize: 11.5, color: 'var(--fg-tertiary)' }}>{c.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </HfShell>
  );
}

Object.assign(window, {
  HF_CalendarDay,
  HF_CalendarMonth,
  HF_CalendarSlotDrawer,
  HF_ModalSlotEdit,
  HF_CalendarConflict,
  HF_CalendarEmpty,
});
