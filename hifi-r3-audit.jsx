/* global React, window, HfShell */
/* hifi-r3-audit.jsx — round 3 cover + chrome audit
   - HF_R3Cover    : the round-3 brief (replaces Headline)
   - HF_ChromeAudit: every workspace's chrome side-by-side · proves IA consistency
   - HF_R3IATable  : explicit IA decisions table (workspace · sub-tabs · primary surface)
*/

const A = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function A_ML({ children, s = 9.5, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: A.sans, fontSize: s, color: c, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...st }}>{children}</span>;
}
function A_MM({ children, s = 11, c = 'var(--fg-tertiary)', st = {} }) {
  return <span style={{ fontFamily: A.mono, fontSize: s, color: c, ...st }}>{children}</span>;
}

// ───────────────────────────────────────────────────────────
// ROUND 3 COVER · what changed from round 2
// ───────────────────────────────────────────────────────────
function HF_R3Cover() {
  const decisions = [
    { num: '01', t: 'Studio doc is shape-adaptive', d: "A project doc isn't a fixed template anymore. It can be just hooks, just notes, or a full script + shot list. Sections add and remove inline. Three doc shapes shown to prove the range." },
    { num: '02', t: 'Studio is a workspace, not a pipeline', d: "Workspace is the gallery of projects (free-form, status as tag, not stage). Docs is the open doc with block-based content + agent co-editing. List is a sortable index for triage. Calendar is project-due-dates. Shipped stays the closed file." },
    { num: '03', t: 'Two calendars, distinct surfaces', d: "Top-level Calendar = cross-platform post scheduling (drag from Library). Studio · Calendar = project due-dates only. Each linked from the other." },
    { num: '04', t: 'Sub-tab order locked, left = primary', d: "Studio: Workspace · Clip Lab · Docs · List · Calendar · Shipped. Library, Insights, Intel, Inbox unchanged from round 2 but now formally ratified." },
    { num: '05', t: 'Chrome audit page', d: "Every workspace's topbar + sub-tab strip rendered side-by-side at the front of the doc — so you can confirm IA consistency at a glance before reviewing individual screens." },
    { num: '06', t: 'Clip Lab is a Studio sub-tab, not a peer workspace', d: "Raw footage triage lives upstream of Docs — drop a take, Coopr proposes vertical cuts, send picks to a draft or ship them. Five surfaces (Empty / Import / Auto-Clips / Review / Export) reuse R6 agent vocabulary. Search stays overlay-only (Cmd-K from any surface) — no workspace tab." },
  ];

  return (
    <div className="hf" style={{ padding: '32px 40px 28px', maxWidth: 1440, background: 'var(--bg-base)' }}>
      <A_ML>Hi-fi · round 3 · the IA holds</A_ML>
      <h1 style={{ margin: '12px 0 14px', fontFamily: A.serif, fontWeight: 500, fontSize: 44, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, maxWidth: 1100 }}>
        Studio is the project surface — and the project surface is whatever the project actually <span style={{ fontStyle: 'italic' }}>is</span>.
      </h1>
      <p style={{ margin: '0 0 22px', fontFamily: A.sans, fontSize: 14.5, color: 'var(--fg-secondary)', maxWidth: 880, lineHeight: 1.6 }}>
        Round 2 closed the IA gaps — Inbox, Calendar, Settings, Onboarding all on the page. Round 3 redesigns the largest weak spot that was left: a Studio doc that pretended every project had the same shape. Plus a chrome audit so you can verify nav consistency before walking the screens.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
        {decisions.map(d => (
          <div key={d.num} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 14, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: A.mono, fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600 }}>{d.num}</span>
            <div>
              <span style={{ fontFamily: A.serif, fontSize: 19, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.3 }}>{d.t}</span>
              <p style={{ margin: '6px 0 0', fontFamily: A.sans, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{d.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// CHROME AUDIT · 7 mini-shells, each at scaled-down size
// ───────────────────────────────────────────────────────────
function MiniShell({ workspace, label, subtab = null, subtabs = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: A.serif, fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.012em' }}>{label}</span>
        <A_MM s={10.5}>{subtabs.length > 0 ? `${subtabs.length} sub-tabs` : 'no sub-tabs'}</A_MM>
      </div>
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-base)' }}>
        {/* Topbar */}
        <div style={{ height: 48, padding: '0 18px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: A.serif, fontStyle: 'italic', fontSize: 13 }}>C</span>
            <span style={{ fontFamily: A.sans, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em' }}>COOPR</span>
          </div>
          <span style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 16 }}>
            {['Home', 'Studio', 'Library', 'Insights', 'Intel', 'Inbox', 'Calendar'].map((w, i) => {
              const active = w.toLowerCase() === workspace;
              return (
                <span key={w} style={{
                  fontFamily: A.sans,
                  fontSize: 12,
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                  borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  paddingBottom: 2,
                }}>{w}</span>
              );
            })}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 8px', background: 'var(--surface-2)', borderRadius: 5, border: '1px solid var(--border-subtle)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', fontFamily: A.mono, fontSize: 7, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Ig</span>
            <A_MM s={9.5} c="var(--fg-primary)">@henry.dives</A_MM>
          </span>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-primary)' }} />
        </div>
        {/* Sub-tabs */}
        {subtabs.length > 0 ? (
          <div style={{ height: 36, padding: '0 18px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-base)', gap: 18 }}>
            {subtabs.map(t => {
              const active = t === subtab;
              return (
                <span key={t} style={{
                  fontFamily: A.sans,
                  fontSize: 11.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                  borderBottom: active ? '2px solid var(--fg-primary)' : '2px solid transparent',
                  paddingBottom: 2,
                }}>{t}</span>
              );
            })}
          </div>
        ) : (
          <div style={{ height: 18, background: 'var(--bg-base)' }} />
        )}
        {/* Body placeholder */}
        <div style={{ height: 110, background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <A_MM s={11} c="var(--fg-tertiary)">{subtab ? `${label} · ${subtab}` : label} body</A_MM>
        </div>
      </div>
    </div>
  );
}

function HF_ChromeAudit() {
  const shells = [
    { workspace: 'home',     label: 'Home',     subtab: null,         subtabs: [] },
    { workspace: 'studio',   label: 'Studio',   subtab: 'Docs',       subtabs: ['Workspace', 'Clip Lab', 'Docs', 'List', 'Calendar', 'Shipped'] },
    { workspace: 'library',  label: 'Library',  subtab: 'Catalog',    subtabs: ['Catalog', 'Series', 'Patterns', 'Timeline', 'Pairings', 'Compare'] },
    { workspace: 'insights', label: 'Insights', subtab: 'Overview',   subtabs: ['Overview', 'Retention', 'Formats', 'Audience', 'Posting'] },
    { workspace: 'intel',    label: 'Intel',    subtab: 'Trends',     subtabs: ['Trends', 'Radar', 'Inspiration', 'DNA', 'Memory', 'Studies'] },
    { workspace: 'inbox',    label: 'Inbox',    subtab: 'Comments',   subtabs: ['Comments', 'DMs', 'Mentions', 'Replies'] },
    { workspace: 'calendar', label: 'Calendar', subtab: null,         subtabs: [] },
  ];

  return (
    <div className="hf" style={{ padding: '32px 40px 40px', width: 1440, background: 'var(--bg-base)' }}>
      <A_ML>Chrome audit · 7 workspaces · IA at a glance</A_ML>
      <h1 style={{ margin: '10px 0 8px', fontFamily: A.serif, fontWeight: 500, fontSize: 32, color: 'var(--fg-primary)', letterSpacing: '-0.018em' }}>
        Same chrome, every workspace. The only thing that moves is the underline and the sub-tabs.
      </h1>
      <p style={{ margin: '0 0 28px', fontFamily: A.sans, fontSize: 13.5, color: 'var(--fg-secondary)', maxWidth: 820, lineHeight: 1.6 }}>
        One topbar (brand · workspaces · linked-account chip · avatar). One sub-tab strip — same height, same typography, primary on the left. No side rails. Home and Calendar have no sub-tabs because they don't need them.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 24px' }}>
        {shells.map(s => <MiniShell key={s.workspace} {...s} />)}
      </div>

      <div style={{ marginTop: 28, padding: 18, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 10, display: 'grid', gridTemplateColumns: '160px 1fr', gap: 18 }}>
        <A_ML c="var(--accent-primary-press)">What's missing</A_ML>
        <div style={{ fontFamily: A.serif, fontStyle: 'italic', fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>
          The avatar dropdown isn't on the chrome surface — it's a triggered overlay (see Switcher · option B). Same with ⌘K. Search is universal but lives in the topbar across all workspaces (chip, far right, before the linked-account chip).
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// IA TABLE · explicit ratification
// ───────────────────────────────────────────────────────────
function HF_R3IATable() {
  const rows = [
    { ws: 'Home',     primary: 'chat',                     subtabs: '—',                                                                purpose: 'where the day begins · briefing · ask anything' },
    { ws: 'Studio',   primary: 'project doc',              subtabs: 'Workspace · Clip Lab · Docs · List · Calendar · Shipped',           purpose: 'make the thing · footage triage in Clip Lab · free-form gallery · block-doc + agent co-editor' },
    { ws: 'Library',  primary: 'catalog · sectioned by rhythm',  subtabs: 'Catalog · Series · Patterns · Timeline · Pairings · Compare',      purpose: 'everything you have made · grouped by rhythm not date · with performance baked in' },
    { ws: 'Insights', primary: 'overview · scoreboard',    subtabs: 'Overview · Retention · Formats · Audience · Posting',              purpose: 'own performance · what is working and why' },
    { ws: 'Intel',    primary: 'trends broadsheet',        subtabs: 'Trends · Radar · Inspiration · DNA · Memory · Studies',            purpose: 'outward · what the world is doing and what coopr learned' },
    { ws: 'Inbox',    primary: 'intent-grouped messages',  subtabs: 'Comments · DMs · Mentions · Replies',                              purpose: 'reply triage · sentiment + intent + voice-matched draft' },
    { ws: 'Calendar', primary: 'week grid',                subtabs: '—',                                                                purpose: 'cross-platform schedule · drag from library · post slot view' },
  ];
  return (
    <div className="hf" style={{ padding: '32px 40px', width: 1440, background: 'var(--bg-base)' }}>
      <A_ML>IA table · ratified</A_ML>
      <h1 style={{ margin: '10px 0 8px', fontFamily: A.serif, fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>
        Workspace · primary surface · sub-tabs · purpose.
      </h1>
      <p style={{ margin: '0 0 24px', fontFamily: A.sans, fontSize: 13.5, color: 'var(--fg-secondary)', maxWidth: 820, lineHeight: 1.6 }}>
        Below is the contract. If a screen lands somewhere not in this table, it doesn't ship. New surfaces require a new column.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 200px 1fr 1fr', gap: 0, border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}><A_ML s={9}>Workspace</A_ML></div>
        <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}><A_ML s={9}>Primary surface</A_ML></div>
        <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}><A_ML s={9}>Sub-tabs (left → right)</A_ML></div>
        <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}><A_ML s={9}>Purpose</A_ML></div>
        {rows.map((r, i) => (
          <React.Fragment key={r.ws}>
            <div style={{ padding: '14px', background: i % 2 === 0 ? 'var(--surface-1)' : 'transparent', borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <span style={{ fontFamily: A.serif, fontSize: 16, fontWeight: 500, color: 'var(--fg-primary)' }}>{r.ws}</span>
            </div>
            <div style={{ padding: '14px', background: i % 2 === 0 ? 'var(--surface-1)' : 'transparent', borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <span style={{ fontFamily: A.sans, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 500 }}>{r.primary}</span>
            </div>
            <div style={{ padding: '14px', background: i % 2 === 0 ? 'var(--surface-1)' : 'transparent', borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <span style={{ fontFamily: A.mono, fontSize: 11.5, color: r.subtabs === '—' ? 'var(--fg-tertiary)' : 'var(--fg-secondary)' }}>{r.subtabs}</span>
            </div>
            <div style={{ padding: '14px', background: i % 2 === 0 ? 'var(--surface-1)' : 'transparent', borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <span style={{ fontFamily: A.serif, fontSize: 13.5, fontStyle: 'italic', color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{r.purpose}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* R7 retirements footnote — keeps the IA proof honest about what no longer ships in Round 4. */}
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 18, padding: 16, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
        <A_ML s={9} c="var(--accent-primary-press)">R7 retirements</A_ML>
        <div style={{ fontFamily: A.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
          Library · Round 3 (grid · detail modal · archive · table) is unwired from Round 4. Library now ships only the Round 4 stack: Catalog · Series · Patterns · Timeline · Pairings · Compare. Settings · R1 connections-only artboard is unwired; the six R2 surfaces below carry the full settings IA.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HF_R3Cover, HF_ChromeAudit, HF_R3IATable,
});
