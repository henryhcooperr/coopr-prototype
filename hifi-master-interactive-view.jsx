/* global React, window */
/* hifi-master-interactive-view.jsx — the v10 chrome wrapped around master state.

   Imports the v10 chrome verbatim semantics (slim shell patch, pill, drawer,
   sliding indicators, freshness dots, ESC close, color-mix derivations) and
   wires it to MasterState instead of v10's local useState.

   v10's local state used:
     - activeWs           → MasterState.activeSurface.ws
     - activeSubByWs      → MasterState.activeSurface.sub  (1-deep, per-ws preserved
                            via the stable hash representation; no separate dict)
     - hoverWs / drawerOpen / previewSub → kept LOCAL (these are ephemeral
                            interaction state that doesn't belong in the URL).

   The slim-shell patch runs ONCE at module-load. It strips topbar/subtab
   strip from every HfShell-wrapped surface so they nest cleanly under the v10
   pill. */

if (typeof window !== 'undefined' && window.HfShell && !window.__cvMasterPatched) {
  window.__OrigHfShellMaster = window.__OrigHfShellV10 || window.__OrigHfShell || window.HfShell;
  window.HfShell = function HfShellSlimMaster({ children, style = {} }) {
    return (
      <div className="hf" style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'var(--bg-base)', fontFamily: 'var(--font-sans)',
        color: 'var(--fg-primary)', overflow: 'auto',
        ...style,
      }}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    );
  };
  window.__cvMasterPatched = true;
}

const MV_C = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const MV_EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ─── Sea lion crop (matches v10) ────────────────────────────
function MasterSeaLion({ size = 22 }) {
  return (
    <span style={{
      width: size, height: size,
      backgroundImage: 'url(coopr-logo.png)',
      backgroundSize: `${size * (1205 / 341)}px ${size}px`,
      backgroundPosition: 'left center', backgroundRepeat: 'no-repeat',
      display: 'inline-block', flexShrink: 0,
    }} />
  );
}

// ─── Brand lockup · sea-lion + COOPR wordmark ───────────────
// B1 redesign — the bare sea-lion crop floated on its own at the top-left
// and didn't read as "the brand". The lockup pairs the crop with a tight
// COOPR wordmark in Plus Jakarta Sans (matches the rest of the chrome's
// sans surface), wrapped in a button-shaped container with a subtle
// clay-soft hover tint. Click acts as a home button (jumps to home/Today).
// The whole lockup is one focusable unit so screen readers don't read
// "image, link" twice.
function MasterBrandLockup({ onHome }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span
      className="cv-master-account-button"
      role="button"
      tabIndex={0}
      aria-label="COOPR · home"
      onClick={onHome}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onHome(); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 10px 5px 8px', borderRadius: 10,
        cursor: 'pointer', userSelect: 'none',
        background: hover ? 'var(--accent-soft)' : 'transparent',
        border: '1px solid ' + (hover ? 'color-mix(in srgb, var(--accent-primary) 18%, transparent)' : 'transparent'),
        transform: hover ? 'translateY(-0.5px)' : 'translateY(0)',
        transition: `background 220ms ${MV_EASE_OUT_EXPO}, border-color 220ms ${MV_EASE_OUT_EXPO}, transform 220ms ${MV_EASE_OUT_EXPO}`,
      }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
        <MasterSeaLion size={22} />
      </span>
      <span style={{
        fontFamily: MV_C.sans,
        fontSize: 13.5, fontWeight: 700,
        letterSpacing: '-0.02em',
        color: hover ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
        textTransform: 'none',
        transition: `color 220ms ${MV_EASE_OUT_EXPO}`,
      }}>
        coopr
      </span>
    </span>
  );
}

function MasterTrendArrow({ trend }) {
  if (trend === 'up')   return <svg width="8" height="8" viewBox="0 0 8 8"><path d="M2 6 L4 2 L6 6" stroke="var(--tone-success)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (trend === 'down') return <svg width="8" height="8" viewBox="0 0 8 8"><path d="M2 2 L4 6 L6 2" stroke="var(--tone-warning)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <svg width="8" height="8" viewBox="0 0 8 8"><line x1="2" y1="4" x2="6" y2="4" stroke="var(--fg-tertiary)" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

// ─── Account glyph · chrome top-right ───────────────────────
// A tiny avatar-shaped button that opens Settings as a modal. Inline SVG
// with a small head-circle plus shoulder arc; matches the chrome's mono
// + clay vocabulary (no emoji, no library icon). Click pushes the
// 'ModalSettings' modal kind onto MasterState.modalStack.
function MasterAccountGlyph({ onOpen }) {
  const [hover, setHover] = React.useState(false);
  // A1 redesign-v1 — labeled chip ("Settings") instead of icon-only.
  // Henry walkthrough flagged Settings as not findable. The chip now reads
  // as a button: avatar circle + serif italic "Settings" label, accent-soft
  // hover, sits in the chrome top-right next to the view-toggle.
  const Tip = window.HF_Tooltip;
  const inner = (
    <span
      role="button"
      tabIndex={0}
      aria-label="Open settings"
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        height: 32, padding: '0 12px 0 6px', borderRadius: 999,
        cursor: 'pointer', userSelect: 'none',
        background: hover ? 'var(--accent-soft)' : 'var(--surface-2)',
        border: '1px solid ' + (hover ? 'color-mix(in srgb, var(--accent-primary) 28%, transparent)' : 'var(--border-subtle)'),
        color: hover ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
        transition: `background 200ms ${MV_EASE_OUT_EXPO}, color 200ms ${MV_EASE_OUT_EXPO}, border-color 200ms ${MV_EASE_OUT_EXPO}`,
      }}>
      <span style={{
        width: 22, height: 22, borderRadius: 999,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #c98b6b, #8c5a3d)',
        color: '#fbfaf6',
      }}>
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="7" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <path d="M2.8 11.6 C3.4 9.4 5.0 8.4 7 8.4 C9 8.4 10.6 9.4 11.2 11.6"
            stroke="currentColor" strokeWidth="1.3" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="cv-master-account-label" style={{
        fontFamily: MV_C.serif, fontStyle: 'italic',
        fontSize: 13, fontWeight: 500,
        letterSpacing: '-0.005em',
      }}>Settings</span>
    </span>
  );
  if (Tip) return <Tip label="Account · profile · brand voice · plan" side="bottom">{inner}</Tip>;
  return inner;
}

// ─── Render the active surface, or a placeholder ────────────
// `detail` is optional ({ kind, id } | null). When set AND the registry
// entry declares a matching detail.kind + detail.component, render that
// detail component (e.g. HF_R4_LibraryDetail) with kind-specific props
// (postId for kind='post'). Otherwise, fall through to the index
// component — surfaces that opt into drill-in via props still receive
// `detail` for backwards compatibility, index-only surfaces ignore it.
function MasterActiveSurface({ ws, sub, detail }) {
  const meta = window.SURFACE_REGISTRY[ws];
  if (!meta) return <MasterNotBuilt label={ws + ' · ' + sub} />;
  const item = meta.subs.find(s => s.id === sub);
  if (!item) return <MasterNotBuilt label={meta.label + ' · ' + sub} />;

  // Detail dispatch · registry-driven. When the active surface has a
  // detail descriptor whose kind matches the registry's declared kind,
  // mount the registry's detail.component with kind-specific props.
  if (detail && detail.kind && item.detail && item.detail.kind === detail.kind) {
    // kind='step' (D2): registry holds a `steps` map keyed by id; resolve
    // the per-step component from that map. Used by Clip Lab to expose
    // its 5-step state machine (empty/import/auto/review/export) at
    // #interactive/studio/Clip Lab/step/<id>.
    if (detail.kind === 'step' && item.detail.steps) {
      const stepCompName = item.detail.steps[detail.id];
      const StepComp = stepCompName ? window[stepCompName] : null;
      if (StepComp) return <StepComp />;
    }
    const DetailComp = item.detail.component ? window[item.detail.component] : null;
    if (DetailComp) {
      // Per-kind prop name map. Kinds without a registered prop name fall
      // through to `id` so future kinds (e.g. 'series', 'pattern') still
      // mount with a generic id descriptor. D1 registers 'post' →
      // `postId`; D5 registers 'thread' → `commentId`.
      let detailProps;
      if (detail.kind === 'post')        detailProps = { postId: detail.id };
      else if (detail.kind === 'thread') detailProps = { commentId: detail.id };
      else                                detailProps = { id: detail.id };
      return <DetailComp {...detailProps} />;
    }
  }

  const Comp = item.component ? window[item.component] : null;
  if (!Comp) return <MasterNotBuilt label={meta.label + ' · ' + sub} />;
  return <Comp detail={detail || null} />;
}

function MasterNotBuilt({ label }) {
  return (
    <div style={{
      flex: 1, minHeight: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: 64, background: 'var(--bg-base)',
    }}>
      <span style={{ fontFamily: MV_C.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>
        SURFACE NOT YET BUILT
      </span>
      <h2 style={{ margin: 0, fontFamily: MV_C.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.022em', textAlign: 'center', lineHeight: 1.15 }}>
        {label}
      </h2>
      <p style={{ margin: 0, fontFamily: MV_C.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 480, textAlign: 'center', lineHeight: 1.55 }}>
        The drawer routes here; the surface itself hasn’t been drafted yet. The chrome and the navigation are real — only the destination is empty.
      </p>
    </div>
  );
}

// ─── Drawer body (list + preview) ───────────────────────────
// Drawer body height is controlled by --mv-drawer-h so tweaks.html can compare
// dossier density without editing JSX. The value below is the canonical default
// set on .cv-master-root; the drawer's body reads the CSS variable directly.
const MV_DRAWER_BODY_H = 252;

function masterFmtNum(value) {
  if (window.HF_DATA && window.HF_DATA.fmtNum) return window.HF_DATA.fmtNum(value);
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(value);
}

function masterFmtPct(value) {
  return Math.round((Number(value) || 0) * 100) + '%';
}

function masterPreviewRows(rows) {
  return (rows || []).slice(0, 3).filter(Boolean);
}

function masterPageDossier(wsId, previewItem) {
  const data = window.HF_DATA || {};
  const registry = window.SURFACE_REGISTRY || {};
  const stats = previewItem.stats || [];
  const topPost = data.posts && data.posts[0];
  const topDraft = data.drafts && data.drafts[0];
  const topThread = data.threads && data.threads[0];
  const topTrend = data.trends && data.trends[0];
  const topInbox = data.inbox && data.inbox[0];
  const topSlot = data.schedule && data.schedule[0];
  const metricA = stats[0] || { l: 'Views', v: 'Ready', t: 'flat' };
  const metricB = stats[1] || { l: 'Open', v: 'Now', t: 'flat' };

  if (wsId === 'home') {
    return {
      now: topThread ? topThread.snippet : 'Today briefing, open threads, and next work in one place.',
      evidence: [
        { label: metricA.l, value: metricA.v, trend: metricA.t },
        { label: 'Drafts', value: data.drafts ? String(data.drafts.length) : metricB.v, trend: 'up' },
        { label: 'Due', value: data.schedule ? String(data.schedule.filter(s => s.state !== 'empty').length) : '2', trend: 'flat' },
      ],
      rows: masterPreviewRows((data.threads || []).map(t => ({ label: t.title, meta: t.m, detail: t.snippet, trend: t.signal === 'charts' ? 'up' : 'flat' }))),
      action: previewItem.id === 'Today' ? 'Open briefing and composer' : 'Review ' + previewItem.id.toLowerCase(),
    };
  }

  if (wsId === 'blocks') {
    const subs = (registry.blocks && registry.blocks.subs) || [];
    const family = previewItem.id.replace(/^[A-Z]\s*·\s*/, '');
    return {
      now: previewItem.descriptor,
      evidence: [
        { label: metricA.l, value: metricA.v, trend: metricA.t },
        { label: 'Families', value: String(Math.max(0, subs.length - 1)), trend: 'flat' },
        { label: 'Demo', value: '33 blocks', trend: 'up' },
      ],
      rows: masterPreviewRows([
        { label: family, meta: 'target family', detail: previewItem.kicker, trend: metricA.t },
        { label: 'Thread Demo', meta: 'conversation proof', detail: 'Blocks rendered inside a realistic multi-turn thread.', trend: 'up' },
        { label: 'Registry', meta: subs.length + ' destinations', detail: 'Families stay discoverable from this nav surface.', trend: 'flat' },
      ]),
      action: 'Open block family',
    };
  }

  if (wsId === 'studio') {
    return {
      now: topDraft ? topDraft.title + ' is in ' + topDraft.stage + ' with score ' + topDraft.score : previewItem.descriptor,
      evidence: [
        { label: metricA.l, value: metricA.v, trend: metricA.t },
        { label: 'Drafts', value: data.drafts ? String(data.drafts.length) : metricB.v, trend: 'flat' },
        { label: 'Next due', value: topDraft ? topDraft.dueIn : 'now', trend: topDraft && topDraft.dueIn === 'now' ? 'down' : 'flat' },
      ],
      rows: masterPreviewRows((data.drafts || []).map(d => ({ label: d.title, meta: d.stage + ' · ' + d.lastEdit, detail: d.notes + ' notes · ' + d.charts + ' charts', trend: d.dueIn === 'now' ? 'down' : 'flat' }))),
      action: previewItem.id === 'Clip Lab' ? 'Open clip workflow' : 'Continue studio work',
    };
  }

  if (wsId === 'library') {
    return {
      now: topPost ? topPost.title + ' · ' + masterFmtNum(topPost.views) + ' views' : previewItem.descriptor,
      evidence: [
        { label: metricA.l, value: metricA.v, trend: metricA.t },
        { label: 'Watch', value: topPost ? masterFmtPct(topPost.watchPct) : metricB.v, trend: 'up' },
        { label: 'Saves', value: topPost ? masterFmtNum(topPost.saves) : 'ready', trend: 'up' },
      ],
      rows: masterPreviewRows((data.posts || []).map(p => ({ label: p.title, meta: p.channel.toUpperCase() + ' · ' + p.publishedAt, detail: masterFmtNum(p.views) + ' views · ' + masterFmtPct(p.watchPct) + ' watch', trend: p.watchPct >= 0.6 ? 'up' : 'flat' }))),
      action: previewItem.id === 'Catalog' ? 'Browse post archive' : 'Open ' + previewItem.id.toLowerCase(),
    };
  }

  if (wsId === 'insights') {
    const summary = data.insights30d || {};
    return {
      now: '30-day read: saves ' + (summary.savesDelta ? '+' + summary.savesDelta.toFixed(1) + '%' : metricA.v) + ', retention ' + (summary.avgRetention ? masterFmtPct(summary.avgRetention) : 'ready') + '.',
      evidence: [
        { label: 'Views', value: summary.views ? masterFmtNum(summary.views) : metricA.v, trend: 'up' },
        { label: 'Saves', value: summary.saves ? masterFmtNum(summary.saves) : metricB.v, trend: 'up' },
        { label: 'Retain', value: summary.avgRetention ? masterFmtPct(summary.avgRetention) : '64%', trend: 'up' },
      ],
      rows: masterPreviewRows((data.formats || []).map(f => ({ label: f.name, meta: f.posts + ' posts', detail: f.signature + ' · lift ' + (f.lift > 0 ? '+' : '') + Math.round(f.lift * 100) + '%', trend: f.lift > 0 ? 'up' : 'down' }))),
      action: 'Open ' + previewItem.id.toLowerCase() + ' analysis',
      spark: data.heatmap && data.heatmap[0],
    };
  }

  if (wsId === 'intel') {
    return {
      now: topTrend ? topTrend.topic + ' is accelerating +' + topTrend.acceleration + '%' : previewItem.descriptor,
      evidence: [
        { label: metricA.l, value: metricA.v, trend: metricA.t },
        { label: 'Fit', value: topTrend ? masterFmtPct(topTrend.fit) : metricB.v, trend: 'up' },
        { label: 'Mentions', value: topTrend ? masterFmtNum(topTrend.mentions7d) : 'new', trend: 'up' },
      ],
      rows: masterPreviewRows((data.trends || []).map(t => ({ label: t.topic, meta: t.channel.toUpperCase() + ' · ' + t.peakIn, detail: t.example, trend: t.acceleration > 0 ? 'up' : 'down' }))),
      action: 'Open signal file',
    };
  }

  if (wsId === 'inbox') {
    return {
      now: topInbox ? topInbox.author + ': ' + topInbox.body : previewItem.descriptor,
      evidence: [
        { label: metricA.l, value: metricA.v, trend: metricA.t },
        { label: 'Clusters', value: data.inboxClusters ? String(data.inboxClusters.length) : metricB.v, trend: 'flat' },
        { label: 'Priority', value: topInbox ? topInbox.priority : 'high', trend: topInbox && topInbox.priority === 'high' ? 'up' : 'flat' },
      ],
      rows: masterPreviewRows((data.inbox || []).map(m => ({ label: m.author, meta: m.kind + ' · ' + m.ts, detail: m.body, trend: m.priority === 'high' ? 'up' : 'flat' }))),
      action: 'Triage messages',
    };
  }

  if (wsId === 'calendar') {
    return {
      now: topSlot ? topSlot.day + ' ' + topSlot.slot + ' · ' + topSlot.title : previewItem.descriptor,
      evidence: [
        { label: metricA.l, value: metricA.v, trend: metricA.t },
        { label: 'Queued', value: data.schedule ? String(data.schedule.filter(s => s.state === 'queued').length) : metricB.v, trend: 'up' },
        { label: 'Open', value: data.schedule ? String(data.schedule.filter(s => s.state === 'empty').length) : '0', trend: 'flat' },
      ],
      rows: masterPreviewRows((data.schedule || []).map(s => ({ label: s.title, meta: s.day + ' · ' + s.slot, detail: s.channel.toUpperCase() + ' · ' + s.state, trend: s.state === 'empty' ? 'down' : 'flat' }))),
      action: 'Open schedule view',
    };
  }

  return {
    now: previewItem.descriptor,
    evidence: stats.map(s => ({ label: s.l, value: s.v, trend: s.t })),
    rows: [],
    action: 'Open ' + previewItem.id,
  };
}

function MasterDossierSpark({ values }) {
  if (!values || values.length < 2) return null;
  const w = 88, h = 22;
  const max = Math.max(...values), min = Math.min(...values);
  const path = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / Math.max(0.001, max - min)) * h;
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink: 0 }}>
      <path d={path} stroke="var(--accent-primary)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Drawer preview · page dossier ─────────────────────────
// The drawer preview is now a dossier for the hovered page: current signal,
// three evidence numbers, source rows, and the next action. It is registry-led
// and enriches from HF_DATA when that data exists.
function MasterDrawerPreview({ wsId, previewItem }) {
  const dossier = masterPageDossier(wsId, previewItem);
  return (
    <div className="cv-master-dossier" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) 174px',
      gap: 'calc(12px * var(--mv-preview-scale))',
      marginTop: 'calc(8px * var(--mv-preview-scale))',
      minHeight: 0,
    }}>
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'calc(8px * var(--mv-preview-scale))' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: dossier.spark ? '88px minmax(0, 1fr)' : 'minmax(0, 1fr)',
          alignItems: 'center', gap: 12,
          padding: 'calc(8px * var(--mv-preview-scale)) calc(10px * var(--mv-preview-scale))',
          border: '1px solid var(--border-subtle)', borderRadius: 8,
          background: 'var(--surface-2)',
        }}>
          {dossier.spark && <MasterDossierSpark values={dossier.spark} />}
          <span style={{
            fontFamily: MV_C.serif, fontStyle: 'italic',
            fontSize: 'calc(12.5px * var(--mv-preview-scale))',
            color: 'var(--fg-secondary)', lineHeight: 1.35,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            <span style={{
              fontFamily: MV_C.mono, fontStyle: 'normal',
              fontSize: 'calc(8.5px * var(--mv-preview-scale))',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--fg-tertiary)', fontWeight: 700,
              marginRight: 8,
            }}>Now</span>
            {dossier.now}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
          {dossier.evidence.slice(0, 3).map((item, i) => (
            <span key={`${item.label}-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontFamily: MV_C.mono, fontSize: 'calc(8.5px * var(--mv-preview-scale))', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 650, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
                <MasterTrendArrow trend={item.trend} />
                <span style={{ fontFamily: MV_C.mono, fontSize: 'calc(12px * var(--mv-preview-scale))', fontWeight: 650, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.value}</span>
              </span>
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          {dossier.rows.map((row, i) => (
            <div key={`${row.label}-${row.meta}-${i}`} style={{
              display: 'grid', gridTemplateColumns: 'minmax(132px, 0.55fr) minmax(0, 1fr) auto',
              alignItems: 'baseline', gap: 8, minWidth: 0,
              fontFamily: MV_C.sans, fontSize: 'calc(11.5px * var(--mv-preview-scale))',
              color: 'var(--fg-secondary)',
            }}>
              <span style={{ color: 'var(--fg-primary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.label}</span>
              <span style={{ color: 'var(--fg-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.detail}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: MV_C.mono, fontSize: 'calc(9.5px * var(--mv-preview-scale))', color: 'var(--fg-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                <MasterTrendArrow trend={row.trend} />
                {row.meta}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        borderLeft: '1px solid var(--border-subtle)',
        paddingLeft: 'calc(14px * var(--mv-preview-scale))',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: 116,
      }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ fontFamily: MV_C.mono, fontSize: 'calc(8.5px * var(--mv-preview-scale))', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>Next action</span>
          <span style={{ fontFamily: MV_C.serif, fontStyle: 'italic', fontSize: 'calc(13px * var(--mv-preview-scale))', color: 'var(--fg-primary)', lineHeight: 1.3 }}>{dossier.action}</span>
        </span>
        <span style={{ fontFamily: MV_C.mono, fontSize: 'calc(9px * var(--mv-preview-scale))', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {previewItem.id} dossier
        </span>
      </div>
    </div>
  );
}

function MasterDrawerBody({ wsId, previewSub, onSubHover, onSubCommit }) {
  const meta = window.SURFACE_REGISTRY[wsId];
  const subs = meta.subs;
  const previewItem = subs.find(s => s.id === previewSub) || subs[0];
  return (
    <div style={{ display: 'flex', height: 'var(--mv-drawer-h)', flexShrink: 0 }}>
      <div style={{
        width: 320, padding: '12px 0 0 0',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        minHeight: 0,
      }}>
        <span style={{ fontFamily: MV_C.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700, padding: '0 16px 6px', flexShrink: 0 }}>
          {meta.label.toUpperCase()} · {subs.length} VIEW{subs.length === 1 ? '' : 'S'}
        </span>
        <div className="cv-master-list" style={{
          flex: 1, minHeight: 0,
          overflowY: 'auto', overflowX: 'hidden',
          padding: '0 16px 12px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
        {/* opening div for the inner scroll container — closed below */}
        {subs.map((s, i) => {
          const a = s.id === previewSub;
          return (
            <span key={s.id}
              onMouseEnter={() => onSubHover(s.id)}
              onClick={() => onSubCommit(s.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', borderRadius: 6,
                background: a ? 'var(--accent-soft)' : 'transparent',
                cursor: 'pointer', userSelect: 'none',
                transition: `background 200ms ${MV_EASE_OUT_EXPO}`,
                opacity: 0,
                animation: `cv-master-list-in 360ms ${MV_EASE_OUT_EXPO} ${120 + i * 45}ms forwards`,
              }}>
              <span style={{
                fontFamily: MV_C.sans, fontStyle: 'normal',
                fontSize: 13, fontWeight: a ? 650 : 500,
                color: a ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
              }}>{s.id}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: MV_C.mono, fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>
                <MasterTrendArrow trend={s.stats[0].t} />
                {s.stats[0].v} {s.stats[0].l.toLowerCase()}
              </span>
            </span>
          );
        })}
        </div>
      </div>
      <div key={previewItem.id} style={{
        flex: 1, padding: '14px 24px 14px 24px',
        display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0,
        animation: `cv-master-preview-in 360ms ${MV_EASE_OUT_EXPO} 280ms backwards`,
        overflow: 'hidden',
      }}>
        <span style={{ fontFamily: MV_C.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>{previewItem.kicker}</span>
        <span style={{ fontFamily: MV_C.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.2 }}>{previewItem.descriptor}</span>
        <div style={{ display: 'flex', gap: 22, marginTop: 2, alignItems: 'flex-end' }}>
          {previewItem.stats.map((stat, i) => (
            <span key={`${stat.l}-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: MV_C.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>{stat.l}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MasterTrendArrow trend={stat.t} />
                <span style={{ fontFamily: MV_C.mono, fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums' }}>{stat.v}</span>
              </span>
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => onSubCommit(previewItem.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 7,
              background: 'var(--surface-2)',
              border: '1px solid color-mix(in srgb, var(--accent-primary) 24%, var(--border-subtle))',
              color: 'var(--accent-primary-press)',
              fontFamily: MV_C.sans, fontSize: 11.5, fontWeight: 650,
              cursor: 'pointer', userSelect: 'none',
              boxShadow: 'none',
              transition: `transform 160ms ease, background 180ms ${MV_EASE_OUT_EXPO}`,
              flexShrink: 0,
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Open
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        {/* Per-workspace preview block · adds richer context (composer +
            threads / project chips / mini-thumb strip / sparkline + KPIs /
            trending topics / unread chips / upcoming slots) so the drawer
            answers "what is in this destination" before the user clicks. */}
        <MasterDrawerPreview wsId={wsId} previewItem={previewItem} />
      </div>
    </div>
  );
}

// ─── Back-chevron · only visible when activeSurface.detail is set ───
// Lives inside the chrome row's leading group, after the sea-lion
// divider, so the centered workspace pills stay anchored. Tokens-only:
// idle uses --fg-primary, hover uses --accent-primary. The breadcrumb
// reads as "← {ws} / {sub} · {kind} {id}" in serif italic, which
// matches the chrome's drawer-preview descriptor typography.
function MasterDetailBackChevron({ wsLabel, subLabel, detail, onBack }) {
  const [hover, setHover] = React.useState(false);
  const color = hover ? 'var(--accent-primary)' : 'var(--fg-primary)';
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={'Back to ' + wsLabel + ' ' + subLabel}
      onClick={onBack}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onBack(); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '4px 10px', borderRadius: 999,
        cursor: 'pointer', userSelect: 'none',
        color,
        transition: `color 200ms ${MV_EASE_OUT_EXPO}, background 200ms ${MV_EASE_OUT_EXPO}`,
        background: hover ? 'var(--accent-soft)' : 'transparent',
      }}>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M7 2 L3 5 L7 8 M3 5 L8 5"
          stroke="currentColor" strokeWidth="1.4" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{
        fontFamily: MV_C.serif, fontStyle: 'italic',
        fontSize: 13.5, fontWeight: 500,
        letterSpacing: '-0.005em',
        color,
      }}>
        {wsLabel} / {subLabel}
        <span style={{
          fontFamily: MV_C.mono, fontStyle: 'normal', fontWeight: 600,
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--fg-tertiary)',
          marginLeft: 10, marginRight: 6,
        }}>·</span>
        <span style={{
          fontFamily: MV_C.mono, fontStyle: 'normal', fontWeight: 600,
          fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--fg-secondary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {detail.kind} {detail.id}
        </span>
      </span>
    </span>
  );
}

// ─── Keyboard hint strip · in-chrome compact ────────────────
// B1 redesign — previously a separate absolute-positioned strip below the
// chrome, which felt cluttered next to the account chip. Now lives INSIDE
// the chrome row, between workspace pills and the account chip, rendered
// as a single tight mono group with key + glyph (no labels) and a single
// tooltip on the wrapper that documents all four hotkeys. Faded by default
// so it's there for power users without screaming. Hover lifts opacity and
// the tooltip exposes the full hint table.
function MasterKeyboardHintStrip() {
  const [hover, setHover] = React.useState(false);
  const Tip = (typeof window !== 'undefined' && window.HF_Tooltip) ? window.HF_Tooltip : null;
  const hints = [
    { keys: '⌘K',  tip: '⌘K · Search' },
    { keys: '⌘N',  tip: '⌘N · Compose' },
    { keys: 'Esc', tip: 'Esc · Close' },
  ];
  const summaryTip = '⌘K Search   ⌘N Compose   Esc Close   L Layout';
  const inner = (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 8px', borderRadius: 999,
        background: hover ? 'var(--surface-2)' : 'transparent',
        border: '1px solid ' + (hover ? 'var(--border-subtle)' : 'transparent'),
        opacity: hover ? 1 : 0.6,
        transition: `opacity 220ms ${MV_EASE_OUT_EXPO}, background 220ms ${MV_EASE_OUT_EXPO}, border-color 220ms ${MV_EASE_OUT_EXPO}`,
        cursor: 'help',
        userSelect: 'none',
      }}>
      {hints.map((h, i) => (
        <React.Fragment key={h.keys}>
          <span style={{
            fontFamily: MV_C.mono, fontSize: 10, fontWeight: 600,
            color: 'var(--fg-tertiary)',
            letterSpacing: '0.04em',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}>{h.keys}</span>
          {i < hints.length - 1 && (
            <span style={{
              width: 2, height: 2, borderRadius: 999,
              background: 'var(--fg-tertiary)', opacity: 0.45,
            }} />
          )}
        </React.Fragment>
      ))}
    </span>
  );
  if (Tip) return <Tip label={summaryTip} side="bottom">{inner}</Tip>;
  return inner;
}

// ─── Modal layer ────────────────────────────────────────────
// Renders the top entry of MasterState.modalStack as a centered card
// over a clay-tinted scrim. zIndex 12 — above the chrome (zIndex 10) so
// modals are correctly interrupting; while a modal is open the chrome
// is intentionally blocked.
//
// Lookup convention: stack entry { kind, props } resolves to
// window['HF_' + kind] at render time. C2 registers ZERO kinds; F1 and
// the D-arms register them. If the kind is missing from window, we render
// an empty card (the scrim + dismiss affordances still work) so the
// dispatch contract is observable end-to-end before any kind exists.
//
// Dismissal:
//   - Click on the scrim (event target === currentTarget) pops one.
//   - ESC pops one (handled in HF_MasterInteractiveCanvas keydown effect
//     with priority modal > detail > drawer).
//   - Stack supports 3+ deep — popping one reveals the next.
function MasterModalLayer() {
  const { state, popModal } = window.useMasterState();
  const stack = state.modalStack || [];
  if (stack.length === 0) return null;
  const top = stack[stack.length - 1];
  const ModalComp = top && top.kind ? window['HF_' + top.kind] : null;

  // E2 special-case: ModalToast renders without scrim and without a pointer
  // trap so it cannot block clicks on the underlying surface. The toast
  // component (HF_ModalToast) self-positions fixed bottom-center and self-
  // dismisses via setTimeout → popModal(). We render it bare here so it
  // shares the modal stack but skips every other modal-shell convention.
  if (top && top.kind === 'ModalToast') {
    return ModalComp ? <ModalComp {...(top.props || {})} /> : null;
  }

  function onScrimClick(e) {
    if (e.target === e.currentTarget) popModal();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onScrimClick}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 12, pointerEvents: 'auto',
        background: 'color-mix(in srgb, var(--fg-primary) 28%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32, boxSizing: 'border-box',
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 640, width: '100%',
          padding: 32,
          borderRadius: 16,
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 36px 72px -28px rgba(26,24,21,0.32), 0 8px 18px -8px rgba(26,24,21,0.14), 0 1px 0 rgba(253,252,249,0.7) inset',
          maxHeight: 'calc(100vh - 64px)', overflow: 'auto',
          boxSizing: 'border-box',
        }}>
        {ModalComp ? <ModalComp {...(top.props || {})} /> : null}
      </div>
    </div>
  );
}

// ─── Cohesion R9 · chrome corner menu ───────────────────────
// Compact ⋯ button that opens a popover anchored below itself. Lives in the
// chrome's right anchor next to the labeled Settings chip. Surfaces:
//   · Switch to Layout view  → setMode('layout')
//   · Toggle live mode · ⌘\  → toggleMode()
//   · Tweaks                 → tweaks.html
//   · Press ? for shortcuts  → static text (R8 discoverability binds ?)
// Closes on click-outside or Esc. The Esc handling is local — the
// canvas-level Esc ladder runs only when this popover isn't open
// (we mark the event as handled before the canvas listener runs).
function MasterCornerMenu() {
  const { setMode, toggleMode } = window.useMasterState();
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (wrapRef.current.contains(e.target)) return;
      setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        e.stopPropagation();
        e.preventDefault();
      }
    }
    document.addEventListener('mousedown', onDocClick);
    // Capture so we close before the canvas-level Esc ladder runs.
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  function MenuItem({ label, hint, onClick, isStatic, icon }) {
    const [h, setH] = React.useState(false);
    const tone = isStatic ? 'var(--fg-tertiary)' : (h ? 'var(--accent-primary-press)' : 'var(--fg-primary)');
    return (
      <div
        role={isStatic ? undefined : 'menuitem'}
        tabIndex={isStatic ? -1 : 0}
        onMouseEnter={() => !isStatic && setH(true)}
        onMouseLeave={() => setH(false)}
        onClick={() => {
          if (isStatic) return;
          if (typeof onClick === 'function') onClick();
          setOpen(false);
        }}
        onKeyDown={(e) => {
          if (isStatic) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (typeof onClick === 'function') onClick();
            setOpen(false);
          }
        }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14,
          padding: '8px 12px',
          borderRadius: 8,
          cursor: isStatic ? 'default' : 'pointer',
          background: h && !isStatic ? 'var(--accent-soft)' : 'transparent',
          color: tone,
          fontFamily: MV_C.sans,
          fontSize: 12.5,
          fontWeight: 500,
          letterSpacing: '0.005em',
          transition: `background 180ms ${MV_EASE_OUT_EXPO}, color 180ms ${MV_EASE_OUT_EXPO}`,
        }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {icon ? icon : null}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        </span>
        {hint ? (
          <span style={{
            fontFamily: MV_C.mono,
            fontSize: 9.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--fg-tertiary)',
            fontWeight: 600,
          }}>{hint}</span>
        ) : null}
      </div>
    );
  }

  return (
    <span ref={wrapRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <span
        role="button"
        tabIndex={0}
        aria-label="Chrome menu"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o); }
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 999,
          cursor: 'pointer', userSelect: 'none',
          background: open || hover ? 'var(--accent-soft)' : 'transparent',
          border: '1px solid ' + (open || hover ? 'color-mix(in srgb, var(--accent-primary) 22%, transparent)' : 'var(--border-subtle)'),
          color: open || hover ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
          transition: `background 180ms ${MV_EASE_OUT_EXPO}, border-color 180ms ${MV_EASE_OUT_EXPO}, color 180ms ${MV_EASE_OUT_EXPO}`,
        }}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="3" cy="7" r="1.2" fill="currentColor" />
          <circle cx="7" cy="7" r="1.2" fill="currentColor" />
          <circle cx="11" cy="7" r="1.2" fill="currentColor" />
        </svg>
      </span>
      {open ? (
        <div
          role="menu"
          aria-label="Chrome menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)', right: 0,
            minWidth: 232,
            padding: 6,
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            boxShadow: '0 18px 36px -16px rgba(26,24,21,0.28), 0 6px 14px -6px rgba(26,24,21,0.14), 0 1px 0 rgba(253,252,249,0.7) inset',
            zIndex: 30,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
          <MenuItem label="Switch to Layout view" onClick={() => setMode('layout')} />
          <MenuItem label="Toggle live mode" hint="⌘\\" onClick={() => toggleMode()} />
          <MenuItem label="Tweaks" onClick={() => { window.location.href = 'tweaks.html'; }} />
          <MenuItem
            label="Design System · reference"
            icon={(
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" style={{ flexShrink: 0 }}>
                <rect x="2" y="2" width="3" height="3" fill="currentColor" fillOpacity="0.7" />
                <rect x="7" y="2" width="3" height="3" fill="currentColor" fillOpacity="0.7" />
                <rect x="2" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.7" />
                <rect x="7" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.7" />
              </svg>
            )}
            onClick={() => {
              if (window.HF_DesignSystemOverlay && typeof window.HF_DesignSystemOverlay.open === 'function') {
                window.HF_DesignSystemOverlay.open();
              }
            }}
          />
          <span style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 4px' }} />
          <MenuItem label="Press ? for shortcuts" isStatic />
        </div>
      ) : null}
    </span>
  );
}

// ─── Main interactive prototype, master-state-aware ─────────
function HF_MasterInteractiveCanvas() {
  const { state, setActiveSurface, clearDetail, popModal, pushModal, toggleMode } = window.useMasterState();
  const { ws: activeWs, sub: activeSub } = state.activeSurface;
  const activeDetail = state.activeSurface.detail || null;
  const modalDepth = (state.modalStack || []).length;

  // Cohesion R9 · publish current mode to <body data-cohesion-mode="...">
  // so the standalone livemode helper (hifi-cohesion-r9-livemode.jsx) can
  // read it without subscribing to React context. Also expose
  // window.cohesionR9ToggleViewMode + listen for the cohesion-r9-toggle-view-mode
  // custom event so the helper's ⌘\ keystroke can flip modes.
  React.useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    document.body.setAttribute('data-cohesion-mode', state.mode);
    return () => {
      // Leaving the interactive canvas — clear the marker so the helper
      // reports false from isLiveMode().
      document.body.removeAttribute('data-cohesion-mode');
    };
  }, [state.mode]);

  React.useEffect(() => {
    window.cohesionR9ToggleViewMode = () => toggleMode();
    function onCustom() { toggleMode(); }
    window.addEventListener('cohesion-r9-toggle-view-mode', onCustom);
    return () => {
      window.removeEventListener('cohesion-r9-toggle-view-mode', onCustom);
      if (window.cohesionR9ToggleViewMode) {
        try { delete window.cohesionR9ToggleViewMode; } catch (_) { window.cohesionR9ToggleViewMode = undefined; }
      }
    };
  }, [toggleMode]);

  const [hoverWs, setHoverWs] = React.useState(activeWs);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [previewSub, setPreviewSub] = React.useState(activeSub);
  const [justOpened, setJustOpened] = React.useState(false);
  const closeTimerRef = React.useRef(null);

  // Reset hoverWs when activeWs changes from outside (e.g. layout-view click).
  React.useEffect(() => {
    setHoverWs(activeWs);
    setPreviewSub(activeSub);
  }, [activeWs, activeSub]);

  const tabsRowRef = React.useRef(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ x: 0, w: 0, ready: false });
  const [hoverIndicator, setHoverIndicator] = React.useState({ x: 0, w: 0, ready: false });

  React.useLayoutEffect(() => {
    if (!tabsRowRef.current) return;
    const el = tabsRowRef.current.querySelector(`[data-ws="${activeWs}"]`);
    if (!el) return;
    const elRect = el.getBoundingClientRect();
    const containerRect = tabsRowRef.current.getBoundingClientRect();
    setIndicatorStyle({ x: elRect.left - containerRect.left, w: elRect.width, ready: true });
  }, [activeWs]);

  React.useLayoutEffect(() => {
    if (!tabsRowRef.current || !drawerOpen || hoverWs === activeWs) {
      setHoverIndicator(prev => ({ ...prev, ready: false }));
      return;
    }
    const el = tabsRowRef.current.querySelector(`[data-ws="${hoverWs}"]`);
    if (!el) return;
    const elRect = el.getBoundingClientRect();
    const containerRect = tabsRowRef.current.getBoundingClientRect();
    setHoverIndicator({ x: elRect.left - containerRect.left, w: elRect.width, ready: true });
  }, [hoverWs, drawerOpen, activeWs]);

  React.useEffect(() => {
    if (drawerOpen) {
      setJustOpened(true);
      const id = setTimeout(() => setJustOpened(false), 800);
      return () => clearTimeout(id);
    }
  }, [drawerOpen]);

  React.useEffect(() => {
    function onKey(e) {
      // Single hotkey ladder — ESC, then Cmd/Ctrl+K (search), and future
      // global hotkeys (e.g. Cmd/Ctrl+N for compose) sit as additional
      // `else if` branches below. Keep this as one ladder so future arms
      // append cleanly without fragmenting keyboard handling.
      const isMod = e.metaKey || e.ctrlKey;

      if (e.key === 'Escape') {
        // Priority order: modal first, then detail drill-in, then drawer.
        // Modals are interrupting overlays at zIndex 12 — they sit above
        // the chrome and block it on purpose, so ESC must address them
        // before reaching detail or drawer state.
        if (modalDepth > 0) {
          popModal();
          e.preventDefault();
          return;
        }
        if (activeDetail) {
          clearDetail();
          e.preventDefault();
          return;
        }
        if (drawerOpen) {
          setDrawerOpen(false);
          setHoverWs(activeWs);
        }
      } else if (isMod && (e.key === 'k' || e.key === 'K')) {
        // Cmd/Ctrl+K opens the global search modal from any surface.
        // Always pushes — if a modal is already open, search stacks on
        // top (the modal stack supports 3+ deep, ESC pops one at a time).
        e.preventDefault();
        pushModal('ModalSearch');
      } else if (isMod && (e.key === 'n' || e.key === 'N')) {
        // Cmd/Ctrl+N opens the global compose modal from any surface
        // (F1). Same stacking semantics as Cmd+K.
        e.preventDefault();
        pushModal('ModalCompose');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, activeWs, activeDetail, clearDetail, modalDepth, popModal, pushModal]);

  const meta = window.SURFACE_REGISTRY[activeWs];
  const drawerWs = window.SURFACE_REGISTRY[hoverWs] || meta;
  const drawerHasSubs = drawerWs.subs.length > 0;

  function handleChromeEnter() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    const m = window.SURFACE_REGISTRY[hoverWs] || window.SURFACE_REGISTRY[activeWs];
    if (m && m.subs.length > 0) setDrawerOpen(true);
  }

  function handleChromeLeave() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setDrawerOpen(false);
      setHoverWs(activeWs);
    }, 240);
  }

  function handleWsHover(id) {
    setHoverWs(id);
    const m = window.SURFACE_REGISTRY[id];
    if (m && m.subs.length > 0) {
      setDrawerOpen(true);
      // Default the previewSub to the first sub of this hovered ws.
      setPreviewSub(m.subs[0].id);
    }
  }

  function handleWsClick(id) {
    const m = window.SURFACE_REGISTRY[id];
    if (!m) return;
    const firstSub = m.subs[0] ? m.subs[0].id : activeSub;
    setActiveSurface(id, firstSub);
    setHoverWs(id);
  }

  function handleSubCommit(subId) {
    setActiveSurface(hoverWs, subId);
    setDrawerOpen(false);
  }

  return (
    <div className="cv-master-root" style={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .cv-master-root {
          --mv-chrome-top: 12px;
          --mv-chrome-gutter: 24px;
          --mv-chrome-max-w: 1240px;
          --mv-chrome-row-h: 48px;
          --mv-drawer-h: ${MV_DRAWER_BODY_H}px;
          --mv-surface-top: calc(var(--mv-chrome-top) + var(--mv-chrome-row-h) + 12px);
          --mv-nav-gap: 18px;
          --mv-nav-pad-x: 8px;
          --mv-nav-font-family: var(--font-sans);
          --mv-nav-active-font-family: var(--font-sans);
          --mv-nav-font-style: normal;
          --mv-nav-active-font-style: normal;
          --mv-nav-font-size: 13px;
          --mv-nav-font-weight: 540;
          --mv-nav-active-font-weight: 680;
          --mv-nav-letter-spacing: 0.01em;
          --mv-active-marker-h: 2px;
          --mv-active-marker-top: calc(var(--mv-chrome-row-h) - 7px);
          --mv-active-marker-bg: var(--accent-primary);
          --mv-active-marker-border: 0 solid transparent;
          --mv-active-marker-radius: 0;
          --mv-active-marker-shadow: none;
          --mv-hover-marker-h: 1px;
          --mv-hover-marker-top: calc(var(--mv-chrome-row-h) - 7px);
          --mv-hover-marker-bg: var(--border-strong);
          --mv-hover-marker-border: 0 solid transparent;
          --mv-hover-marker-radius: 0;
          --mv-hover-marker-shadow: none;
          --mv-preview-scale: 1;
        }
        .cv-master-canvas .hf-topbar, .cv-master-canvas .hf-subtabs { display: none !important; }
        .cv-master-canvas .hf { height: 100% !important; }
        .cv-master-chrome-host {
          position: absolute;
          top: var(--mv-chrome-top);
          left: var(--mv-chrome-gutter);
          right: var(--mv-chrome-gutter);
          z-index: 10;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }
        .cv-master-chrome-shell {
          width: min(calc(100vw - (var(--mv-chrome-gutter) * 2)), var(--mv-chrome-max-w));
          pointer-events: auto;
        }
        @media (max-width: 1500px) {
          .cv-master-account-button {
            width: 32px !important;
            padding: 0 5px !important;
            gap: 0 !important;
            justify-content: center !important;
          }
          .cv-master-account-label { display: none !important; }
        }
        @keyframes cv-master-list-in {
          0%   { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes cv-master-preview-in {
          0%   { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        /* Slim scrollbar for the drawer's list pane — only visible when needed,
           tinted clay so it reads as part of the design language. */
        .cv-master-list { scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--accent-primary) 22%, transparent) transparent; }
        .cv-master-list::-webkit-scrollbar { width: 6px; }
        .cv-master-list::-webkit-scrollbar-track { background: transparent; }
        .cv-master-list::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--accent-primary) 18%, transparent); border-radius: 999px; }
        .cv-master-list::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--accent-primary) 32%, transparent); }
      ` }} />

      {/* Cast-shadow at top of surface */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 36,
        background: drawerOpen
          ? 'linear-gradient(to bottom, rgba(26,24,21,0.10), transparent)'
          : 'linear-gradient(to bottom, rgba(26,24,21,0.06), transparent)',
        transition: 'background 360ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none', zIndex: 5,
      }} />

      {/* Surface body */}
      <div className="cv-master-canvas" style={{
        position: 'absolute',
        top: 'var(--mv-surface-top)', left: 0, right: 0, bottom: 0,
        overflow: 'auto',
        zIndex: 4,
      }}>
        <MasterActiveSurface ws={activeWs} sub={activeSub} detail={activeDetail} />
      </div>

      {/* Floating chrome */}
      <div
        className="cv-master-chrome-host"
        onMouseEnter={handleChromeEnter}
        onMouseLeave={handleChromeLeave}>
        <div className="cv-master-chrome-shell" style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: 0,
          height: drawerOpen && drawerHasSubs ? 'calc(var(--mv-chrome-row-h) + var(--mv-drawer-h))' : 'var(--mv-chrome-row-h)',
          display: 'flex', flexDirection: 'column',
          boxShadow: drawerOpen
            ? '0 28px 56px -22px rgba(26,24,21,0.26), 0 6px 14px -6px rgba(26,24,21,0.12), 0 1px 0 rgba(253,252,249,0.7) inset'
            : '0 16px 32px -18px rgba(26,24,21,0.18), 0 2px 6px -3px rgba(26,24,21,0.08), 0 1px 0 rgba(253,252,249,0.7) inset',
          transition: `height 360ms ${MV_EASE_OUT_EXPO}, box-shadow 360ms ${MV_EASE_OUT_EXPO}`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* TOP ZONE · pill */}
          <div ref={tabsRowRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '8px 20px', height: 'var(--mv-chrome-row-h)', flexShrink: 0, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <MasterBrandLockup onHome={() => setActiveSurface('home', 'Today')} />
              <span style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
              {activeDetail && (
                <MasterDetailBackChevron
                  wsLabel={(window.SURFACE_REGISTRY[activeWs] && window.SURFACE_REGISTRY[activeWs].label) || activeWs}
                  subLabel={activeSub}
                  detail={activeDetail}
                  onBack={() => clearDetail()}
                />
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--mv-nav-gap)', minWidth: 0 }}>
              {window.MASTER_WS_ORDER.map(w => {
                const isActive = w.id === activeWs;
                const isHovered = drawerOpen && w.id === hoverWs && !isActive;
                return (
                  <span key={w.id}
                    data-ws={w.id}
                    onMouseEnter={() => handleWsHover(w.id)}
                    onClick={() => handleWsClick(w.id)}
                    style={{
                      position: 'relative', zIndex: 1,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: isActive ? 'var(--mv-nav-active-font-family)' : 'var(--mv-nav-font-family)',
                      fontStyle: isActive ? 'var(--mv-nav-active-font-style)' : 'var(--mv-nav-font-style)',
                      fontSize: 'var(--mv-nav-font-size)',
                      fontWeight: isActive ? 'var(--mv-nav-active-font-weight)' : 'var(--mv-nav-font-weight)',
                      color: isActive
                        ? 'var(--accent-primary-press)'
                        : isHovered
                          ? 'var(--fg-primary)'
                          : 'var(--fg-secondary)',
                      cursor: 'pointer', userSelect: 'none',
                      padding: '7px var(--mv-nav-pad-x)',
                      letterSpacing: 'var(--mv-nav-letter-spacing)',
                      transition: `color 280ms ${MV_EASE_OUT_EXPO}`,
                    }}>
                    {w.label}
                    {w.fresh && !isActive && (
                      <span style={{
                        width: 5, height: 5, borderRadius: 999,
                        background: 'var(--accent-primary)',
                        boxShadow: '0 0 0 3px color-mix(in srgb, var(--accent-primary) 14%, transparent)',
                        flexShrink: 0,
                      }} />
                    )}
                  </span>
                );
              })}
            </div>

            {/* RIGHT ANCHOR · keyboard hints + account chip + view-toggle slot.
                The keyboard hint strip moved INSIDE the chrome (was a separate
                absolute strip below the chrome — felt cluttered next to the
                account chip). It's a faded mono group with a tooltip that
                exposes the full hint table; ⌘K / ⌘N / Esc are visible at low
                opacity for power users without competing with the pills. */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <MasterKeyboardHintStrip />
              <span style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
              <MasterAccountGlyph onOpen={() => pushModal('ModalSettings')} />
              <MasterCornerMenu />
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }} id="cv-master-toggle-slot" />
            </div>

            {/* HOVER preview indicator */}
            <span style={{
              position: 'absolute',
              left: hoverIndicator.x, top: 'var(--mv-hover-marker-top)',
              transform: 'none',
              width: hoverIndicator.w, height: 'var(--mv-hover-marker-h)',
              background: 'var(--mv-hover-marker-bg)',
              border: 'var(--mv-hover-marker-border)',
              borderRadius: 'var(--mv-hover-marker-radius)',
              boxShadow: 'var(--mv-hover-marker-shadow)',
              opacity: hoverIndicator.ready ? 1 : 0,
              transition: `left 320ms ${MV_EASE_OUT_EXPO}, width 320ms ${MV_EASE_OUT_EXPO}, opacity 200ms ease`,
              pointerEvents: 'none', willChange: 'left, width', zIndex: 0,
            }} />

            {/* ACTIVE indicator */}
            <span style={{
              position: 'absolute',
              left: indicatorStyle.x, top: 'var(--mv-active-marker-top)',
              transform: 'none',
              width: indicatorStyle.w, height: 'var(--mv-active-marker-h)',
              background: 'var(--mv-active-marker-bg)',
              border: 'var(--mv-active-marker-border)',
              borderRadius: 'var(--mv-active-marker-radius)',
              boxShadow: 'var(--mv-active-marker-shadow)',
              opacity: indicatorStyle.ready ? 1 : 0,
              transition: `left 480ms ${MV_EASE_OUT_EXPO}, width 480ms ${MV_EASE_OUT_EXPO}, opacity 320ms ease`,
              pointerEvents: 'none', willChange: 'left, width', zIndex: 0,
            }} />
          </div>

          {/* SEAM */}
          <span style={{
            position: 'absolute', left: 12, right: 12, top: 'var(--mv-chrome-row-h)', height: 1,
            background: justOpened
              ? 'linear-gradient(to right, transparent, var(--accent-primary), transparent)'
              : 'linear-gradient(to right, transparent, var(--accent-soft), transparent)',
            opacity: drawerOpen && drawerHasSubs ? 1 : 0,
            transform: drawerOpen && drawerHasSubs ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            transition: `opacity 280ms ${MV_EASE_OUT_EXPO}, transform 360ms ${MV_EASE_OUT_EXPO}, background 800ms ease`,
            pointerEvents: 'none',
            boxShadow: justOpened ? '0 0 8px 0 color-mix(in srgb, var(--accent-primary) 32%, transparent)' : 'none',
          }} />

          {/* BOTTOM ZONE · drawer */}
          <div style={{
            opacity: drawerOpen && drawerHasSubs ? 1 : 0,
            transform: drawerOpen && drawerHasSubs ? 'translateY(0)' : 'translateY(-4px)',
            transition: `opacity 320ms ${MV_EASE_OUT_EXPO} 60ms, transform 360ms ${MV_EASE_OUT_EXPO} 60ms`,
            pointerEvents: drawerOpen && drawerHasSubs ? 'auto' : 'none',
          }}>
            {drawerHasSubs && (
              <MasterDrawerBody
                wsId={hoverWs}
                previewSub={previewSub}
                onSubHover={setPreviewSub}
                onSubCommit={handleSubCommit}
              />
            )}
          </div>

          <span style={{ position: 'absolute', left: 12, right: 12, bottom: -1, height: 1, background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Modal layer · zIndex 12, above the chrome (zIndex 10). Renders
          state.modalStack top entry as a centered card over a clay-tinted
          scrim. Renders nothing when the stack is empty. */}
      <MasterModalLayer />
    </div>
  );
}

function HF_MasterInteractiveView() {
  return <HF_MasterInteractiveCanvas />;
}

Object.assign(window, { HF_MasterInteractiveView, HF_MasterInteractiveCanvas, MasterActiveSurface, MasterDetailBackChevron, MasterModalLayer, MasterAccountGlyph, MasterCornerMenu, MasterKeyboardHintStrip, MasterBrandLockup, MasterDrawerPreview, masterPageDossier });
