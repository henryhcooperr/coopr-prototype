/* global React, HfStat, HfMiniBars, HfSparkline */
// hifi-tokens.jsx — token proposals + component inventory.

function HF_TokenProposals() {
  return (
    <div className="hf" style={{ width: 1440, padding: '32px 40px', background: 'var(--bg-base)' }}>
      <div style={{ marginBottom: 24 }}>
        <div className="hf-card-eyebrow" style={{ marginBottom: 6 }}>Round 1 · token proposals</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)', marginBottom: 8 }}>
          Two proposed deltas from the current baseline
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-secondary)', maxWidth: 720, lineHeight: 1.55 }}>
          The hi-fi screens above use the proposals applied. Each is shown current-vs-proposed below; the rest of the system rides the baseline in <span style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>04-design-system.md</span>.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* PROPOSAL 1 — accent */}
        <div className="hf-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div className="hf-card-eyebrow" style={{ marginBottom: 4 }}>Proposal · accent color</div>
              <div className="hf-card-title" style={{ fontSize: 17 }}>Warm clay over warm muted</div>
            </div>
            <span className="hf-tag hf-tag-warning">proposed — not yet approved</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55, marginBottom: 16 }}>
            The current baseline reads as undifferentiated brown at small sizes — particularly on chips and buttons. <span style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>Clay (#b6532b)</span> stays warm, harmonizes with the off-white surfaces, and reads as intentional rather than safe. It also gives more room for the moss-success and amber-warning tones to feel like a coherent palette.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {/* Current */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.04em' }}>CURRENT · #8a6a47</div>
              <SwatchRow accent="#8a6a47" hover="#785a3b" press="#664a2f" soft="#ede4d6" />
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button style={{ height: 30, padding: '0 12px', borderRadius: 8, background: '#8a6a47', color: '#fdfcf9', border: 'none', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit' }}>Schedule post</button>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 4, background: '#ede4d6', color: '#664a2f', fontSize: 11, fontWeight: 500 }}>2 charts · 1 draft</span>
              </div>
            </div>
            {/* Proposed */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--accent-primary)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.04em' }}>PROPOSED · #b6532b</div>
              <SwatchRow accent="#b6532b" hover="#a14622" press="#8c3a1c" soft="#f3e3d8" />
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button className="hf-btn hf-btn-primary hf-btn-sm">Schedule post</button>
                <span className="hf-tag hf-tag-accent">2 charts · 1 draft</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 8, padding: 12, background: 'var(--surface-2)', borderRadius: 8, fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            <span style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>Tone harmony.</span> Moss success <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--tone-success)', verticalAlign: 'middle', borderRadius: 2, marginLeft: 4 }} />, amber warning <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--tone-warning)', verticalAlign: 'middle', borderRadius: 2, marginLeft: 4 }} />, slate-blue info <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--tone-info)', verticalAlign: 'middle', borderRadius: 2, marginLeft: 4 }} />, restrained red <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--tone-danger)', verticalAlign: 'middle', borderRadius: 2, marginLeft: 4 }} />.
          </div>
        </div>

        {/* PROPOSAL 2 — type pairing */}
        <div className="hf-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div className="hf-card-eyebrow" style={{ marginBottom: 4 }}>Proposal · type pairing</div>
              <div className="hf-card-title" style={{ fontSize: 17 }}>Source Serif 4 paired with Plus Jakarta</div>
            </div>
            <span className="hf-tag hf-tag-warning">proposed — not yet approved</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55, marginBottom: 16 }}>
            Plus Jakarta stays for body, UI, numerics. Source Serif 4 is added for editorial moments — Studio greeting, Pulse story headlines, empty-state copy. The serif anchors COOPR as a creative tool (not a SaaS dashboard) and earns warmth without resorting to handwritten or display fonts.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em' }}>CURRENT · Plus Jakarta only</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.2, marginBottom: 8 }}>What are you making today?</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55, marginBottom: 8 }}>Drafts and charts created here auto-save to Library.</div>
              <div className="hf-num" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-tertiary)' }}>12,438 followers · 52% retention · Apr 24</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--accent-primary)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em' }}>PROPOSED · pair with Source Serif 4</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.18, marginBottom: 8 }}>What are you making today?</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55, marginBottom: 8 }}>Drafts and charts created here auto-save to Library.</div>
              <div className="hf-num" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-tertiary)' }}>12,438 followers · 52% retention · Apr 24</div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: 'var(--surface-2)', borderRadius: 8, fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
            <span style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>Where the serif appears.</span> Studio greeting · Pulse story headlines · Insights empty-state headlines · Decisions ledger entries. Everywhere else stays Jakarta. Numerics stay tabular Jakarta — never the serif.
          </div>
        </div>
      </div>
    </div>
  );
}

function SwatchRow({ accent, hover, press, soft }) {
  const items = [
    { label: 'primary', color: accent },
    { label: 'hover',   color: hover },
    { label: 'pressed', color: press },
    { label: 'soft',    color: soft },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
      {items.map(s => (
        <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ height: 36, borderRadius: 6, background: s.color, border: '1px solid rgba(0,0,0,0.06)' }} />
          <span style={{ fontSize: 10, color: 'var(--fg-tertiary)' }}>{s.label}</span>
          <span className="hf-num" style={{ fontSize: 10, color: 'var(--fg-secondary)', fontFamily: 'var(--font-mono)' }}>{s.color}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Chart palette pressure-test ────────────────────────────
function HF_ChartVariant() {
  const data = [68, 72, 64, 58, 71, 55, 49, 52, 47, 51, 54, 58];
  const variants = [
    { id: 'monochrome', label: 'Warm-monochrome', sub: 'Single hue, opacity carries value. Calmest read.' },
    { id: 'mono',       label: 'Single accent',   sub: 'Flat clay. Default — used on the hi-fi screens.' },
    { id: 'two-tone',   label: 'Two-tone',        sub: 'Clay alternating with ink. Reads as comparison.' },
  ];
  return (
    <div className="hf" style={{ width: 1440, padding: '32px 40px', background: 'var(--bg-base)' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="hf-card-eyebrow" style={{ marginBottom: 6 }}>Pressure-test · chart palette</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, letterSpacing: '-0.005em', color: 'var(--fg-primary)' }}>
          Three options for the retention bar chart
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-secondary)', maxWidth: 720, marginTop: 6 }}>
          One axis only — chart palette. Density and empty-state held for round 2.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {variants.map(v => (
          <div key={v.id} className="hf-card">
            <div className="hf-card-head" style={{ marginBottom: 8 }}>
              <div>
                <div className="hf-card-eyebrow" style={{ marginBottom: 4 }}>{v.label}</div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-secondary)' }}>{v.sub}</div>
              </div>
              {v.id === 'mono' && <span className="hf-tag hf-tag-success">applied to round 1</span>}
            </div>
            <div style={{ paddingTop: 12 }}>
              <HfMiniBars data={data} width={380} height={140} palette={v.id} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-tertiary)', paddingTop: 10, borderTop: '1px solid var(--border-subtle)', marginTop: 10 }}>
              <span>Mar 8</span><span>Apr 5</span><span>Apr 24</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component inventory ────────────────────────────────────
function HF_Inventory() {
  const newCmpts = [
    { name: 'HfStat',          purpose: 'KPI block — label, tabular value, optional unit, restrained delta. No green pills.' },
    { name: 'HfSparkline',     purpose: 'Thin polyline (no fill) for KPI cards. Accent or fg-secondary stroke.' },
    { name: 'HfMiniBars',      purpose: 'Bar chart with mono · two-tone · warm-monochrome palettes (chart variant axis).' },
    { name: 'HfPillComposer',  purpose: 'Floating chat pill on analytical surfaces — ⌘L expands to scoped composer.' },
    { name: 'HfComposerHero',  purpose: 'Studio-landing hero composer — 720px, suggestions row beneath.' },
    { name: 'HfComposerBar',   purpose: 'Inline scoped composer above content on Audience and Library.' },
    { name: 'Pulse story row', purpose: 'Editorial-feeling feed item — eyebrow / serif headline / sans body / single action.' },
  ];
  const modified = [
    { name: 'Topbar',           change: 'Restored 28px gap between tabs · added "7 scheduled" status with success dot · ⌘K chip moved into surface-2 with mono keys.' },
    { name: 'Sub-tab row',      change: 'Replaced ink-heavy underline with 2px ink underline on active only · right-side accessory slot for filters.' },
    { name: 'Side rail',        change: 'Added section labels (WORKSPACE / VIEWS / LENSES) · numeric counts right-aligned tabular.' },
    { name: 'Library row',      change: 'KIND tag becomes mono uppercase on tinted bg per kind · ◉ chat badge becomes filled accent-soft circle.' },
    { name: 'KPI card',         change: 'Stat → label → tabular value → restrained delta + sub. No "+12.3%" pills.' },
  ];
  const deprecated = [
    { name: 'Kalam handwritten annotations', replaced: 'Removed entirely — they belonged to wireframe vocabulary, not hi-fi.' },
    { name: 'Hard 1.5px black borders',      replaced: 'border-subtle / border-default tokens; no card has a 1.5px ink edge anymore.' },
    { name: 'Wireframe accent (teal)',       replaced: 'Replaced with proposed clay accent + soft tint surface.' },
  ];

  return (
    <div className="hf" style={{ width: 1440, padding: '32px 40px 48px', background: 'var(--bg-base)' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="hf-card-eyebrow" style={{ marginBottom: 6 }}>Component inventory</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, letterSpacing: '-0.005em', color: 'var(--fg-primary)' }}>
          What's new, modified, deprecated
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <InventoryCol title="New" tone="var(--tone-success)" items={newCmpts.map(i => ({ name: i.name, body: i.purpose }))} />
        <InventoryCol title="Modified" tone="var(--tone-warning)" items={modified.map(i => ({ name: i.name, body: i.change }))} />
        <InventoryCol title="Deprecated" tone="var(--tone-danger)" items={deprecated.map(i => ({ name: i.name, body: i.replaced }))} />
      </div>
    </div>
  );
}

function InventoryCol({ title, tone, items }) {
  return (
    <div className="hf-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="hf-dot" style={{ background: tone }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
        <span className="hf-num" style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginLeft: 'auto' }}>{items.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((it, i) => (
          <div key={i}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 4 }}>{it.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{it.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HF_TokenProposals, HF_ChartVariant, HF_Inventory });
