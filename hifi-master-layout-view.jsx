/* global React, window, DesignCanvas, DCSection, DCArtboard */
/* hifi-master-layout-view.jsx — the figma-ish "every screen at once" view.

   Reads SURFACE_REGISTRY + MASTER_WS_ORDER from window. Renders a DCSection
   per workspace (in MASTER_WS_ORDER), and a DCArtboard per subtab inside.

   v2 (coopr-master-prototype-layout-states-v1) — Layout view tells the WHOLE
   truth, not the half-truth:
     • Per-artboard state-band (4-button strip: happy / loading / empty / error)
       lets the viewer see surface state variants without leaving layout view.
       State is per-artboard, scoped via local React useState — no MasterState
       mutation, doesn't bleed into interactive view.
     • Per-artboard detail-band (when the registry entry has a `detail` field)
       lists the detail kinds + ids; clicking re-renders the artboard with
       <Comp detail={...} />.
     • New synthetic 'Modals' section after Calendar holds 1 frozen artboard per
       modal kind (ModalCompose, ModalSearch, ModalSettings, ModalSlotEdit,
       ModalNewProject, ModalNewDoc, ModalConfirm, ModalToast). Each renders
       inline (not inside MasterModalLayer) so the artboard frame is the modal.

   Active-surface treatment (preserved from v1):
     • 2px clay border on the artboard wrapper
     • clay-soft halo
     • smooth-scroll-into-view on activeSurface change

   Click on the surface body still flips mode → 'interactive' on that
   (ws, sub). State-band and detail-band controls stop propagation so they
   don't trigger the open-in-interactive route. */

const MLV_FRAME_CLAY = '2px solid color-mix(in srgb, var(--accent-primary) 56%, transparent)';
const MLV_HALO       = '0 0 0 6px color-mix(in srgb, var(--accent-primary) 12%, transparent), 0 12px 32px -10px color-mix(in srgb, var(--accent-primary) 28%, transparent)';
const MLV_SCROLL_DELAY_MS = 80;
const MLV_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const MLV_STATES = ['happy', 'loading', 'empty', 'error'];

// ─── Per-artboard state-band ─────────────────────────────────
// 4-button mono strip above every surface body. Clicking a state re-renders
// the surface with that state prop. Default 'happy'. Stops propagation so
// the click doesn't open the surface in interactive view.
function MasterArtboardStateStrip({ value, onChange }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-2)',
      }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em',
        textTransform: 'uppercase', fontWeight: 700, color: 'var(--fg-tertiary)',
      }}>State</span>
      <div style={{ display: 'inline-flex', gap: 4 }}>
        {MLV_STATES.map(s => {
          const active = s === value;
          return (
            <span key={s}
              role="button" tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onChange(s); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onChange(s); } }}
              style={{
                padding: '4px 10px', borderRadius: 999,
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
                textTransform: 'uppercase', fontWeight: 700,
                cursor: 'pointer', userSelect: 'none',
                background: active ? 'var(--accent-primary)' : 'transparent',
                color: active ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-default)'),
                transition: `background 160ms ${MLV_EASE}, color 160ms ${MLV_EASE}`,
              }}>{s}</span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Per-artboard detail-band ────────────────────────────────
// Renders only when the registry entry has a `detail` field. Lists the
// detail kinds + ids. Clicking switches the artboard's render to the detail
// surface (with the kind-specific prop). 'index' resets to the index surface.
function MasterArtboardDetailStrip({ detailMeta, value, onChange }) {
  if (!detailMeta) return null;
  // Build the option list from the detail meta. Two shapes supported:
  //   single-kind: { kind: 'post', component: 'HF_X' }     — one example id
  //   multi-kind:  { kind: 'step', steps: { id: 'HF_X' } } — N step ids
  const options = [];
  options.push({ key: 'index', label: 'Index', kind: null, id: null });
  if (detailMeta.steps) {
    for (const stepId of Object.keys(detailMeta.steps)) {
      options.push({ key: detailMeta.kind + '/' + stepId, label: detailMeta.kind + ' · ' + stepId, kind: detailMeta.kind, id: stepId });
    }
  } else if (detailMeta.component) {
    // Surface a single example id by kind. Future arms can populate an
    // `examples` array on the detail meta if multiple ids should appear.
    const exampleId = detailMeta.exampleId || (detailMeta.kind === 'post' ? '0046' : detailMeta.kind === 'thread' ? 'c-2417' : 'sample');
    options.push({ key: detailMeta.kind + '/' + exampleId, label: detailMeta.kind + ' · ' + exampleId, kind: detailMeta.kind, id: exampleId });
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-1)',
      }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em',
        textTransform: 'uppercase', fontWeight: 700, color: 'var(--fg-tertiary)',
      }}>Detail</span>
      <div style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
        {options.map(opt => {
          const active = opt.key === value;
          return (
            <span key={opt.key}
              role="button" tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onChange(opt); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onChange(opt); } }}
              style={{
                padding: '3px 8px', borderRadius: 4,
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
                textTransform: 'uppercase', fontWeight: 600,
                cursor: 'pointer', userSelect: 'none',
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-subtle)'),
                transition: `background 160ms ${MLV_EASE}`,
              }}>{opt.label}</span>
          );
        })}
      </div>
    </div>
  );
}

function MasterActiveFrame({ active, children }) {
  if (!active) return children;
  return (
    <div style={{
      position: 'relative',
      borderRadius: 12,
      outline: MLV_FRAME_CLAY,
      outlineOffset: 0,
      boxShadow: MLV_HALO,
      transition: `outline 240ms ${MLV_EASE}, box-shadow 240ms ${MLV_EASE}`,
    }}>
      {children}
    </div>
  );
}

// Renders the surface with state + detail props. Detail is null when the
// option key is 'index'; otherwise an object {kind, id} that the surface
// component looks at (kind === 'post' / 'step' / 'thread' switches to the
// detail render path inside the surface or in MasterActiveSurface).
function MasterSurfaceSlot({ ws, sub, surfaceState, detailDescriptor }) {
  const meta = window.SURFACE_REGISTRY[ws];
  if (!meta) return <MasterPlaceholder kicker="UNKNOWN WORKSPACE" title={ws + ' · ' + sub} />;
  const item = meta.subs.find(s => s.id === sub);
  if (!item) return <MasterPlaceholder kicker="UNKNOWN SUBTAB" title={meta.label + ' · ' + sub} />;
  // Resolve detail-aware component when descriptor is set.
  let CompName = item.component;
  let detailProps = {};
  if (detailDescriptor && item.detail) {
    if (item.detail.steps && item.detail.steps[detailDescriptor.id]) {
      CompName = item.detail.steps[detailDescriptor.id];
    } else if (item.detail.component) {
      CompName = item.detail.component;
      if (item.detail.kind === 'post')   detailProps = { postId: detailDescriptor.id };
      else if (item.detail.kind === 'thread') detailProps = { commentId: detailDescriptor.id };
    }
  }
  const Comp = CompName ? window[CompName] : null;
  if (!Comp) {
    return (
      <MasterPlaceholder
        kicker="DRAFT THIS SURFACE"
        title={meta.label + ' · ' + sub}
        descriptor={item.descriptor}
      />
    );
  }
  return <Comp state={surfaceState} {...detailProps} />;
}

function MasterPlaceholder({ kicker, title, descriptor }) {
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: 480,
      background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 14, padding: 56,
      border: '1px dashed var(--border-default)',
      borderRadius: 8,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700,
      }}>{kicker}</span>
      <h2 style={{
        margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)',
        letterSpacing: '-0.022em', lineHeight: 1.15, textAlign: 'center',
      }}>{title}</h2>
      {descriptor && (
        <p style={{
          margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 520,
          textAlign: 'center', lineHeight: 1.55,
        }}>{descriptor}</p>
      )}
    </div>
  );
}

function MasterArtboardOverlay() {
  return (
    <span style={{
      position: 'absolute', top: 10, right: 12, zIndex: 4,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: 'color-mix(in srgb, var(--accent-primary) 8%, var(--surface-1))',
      border: '1px solid color-mix(in srgb, var(--accent-primary) 22%, transparent)',
      color: 'var(--accent-primary-press)',
      fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      boxShadow: '0 4px 10px -6px color-mix(in srgb, var(--accent-primary) 28%, transparent)',
      pointerEvents: 'none',
    }}>
      OPEN · L
    </span>
  );
}

// ─── One artboard with state + detail bands ──────────────────
function MasterArtboardWithControls({ ws, sub, item, isActive, openSurface }) {
  const [surfaceState, setSurfaceState] = React.useState('happy');
  const [detailValue, setDetailValue]   = React.useState('index'); // option key
  const [detailDescriptor, setDetailDescriptor] = React.useState(null);

  function handleDetailChange(opt) {
    setDetailValue(opt.key);
    setDetailDescriptor(opt.kind ? { kind: opt.kind, id: opt.id } : null);
  }

  return (
    <div
      data-mlv-slot={ws + '/' + sub}
      onClick={() => openSurface(ws, sub)}
      style={{
        position: 'relative', width: '100%', height: '100%',
        cursor: 'pointer',
        transition: `transform 220ms ${MLV_EASE}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <MasterArtboardOverlay />
      <MasterActiveFrame active={isActive}>
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
          <MasterArtboardStateStrip value={surfaceState} onChange={setSurfaceState} />
          {item.detail ? (
            <MasterArtboardDetailStrip
              detailMeta={item.detail}
              value={detailValue}
              onChange={handleDetailChange}
            />
          ) : null}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <MasterSurfaceSlot
              ws={ws} sub={sub}
              surfaceState={surfaceState}
              detailDescriptor={detailDescriptor}
            />
          </div>
        </div>
      </MasterActiveFrame>
    </div>
  );
}

// ─── Modals · Overlays section ───────────────────────────────
// Frozen modal artboards rendered inline (NOT through MasterModalLayer) so
// the artboard frame contains the modal body. Each entry names a kind +
// optional props (e.g. ModalConfirm needs title + body).
const MLV_MODALS_LIST = [
  { kind: 'ModalCompose',    label: 'Compose',          dim: { w: 720, h: 520 }, props: {} },
  { kind: 'ModalSearch',     label: 'Search · ⌘K',      dim: { w: 720, h: 600 }, props: {} },
  { kind: 'ModalSettings',   label: 'Settings',         dim: { w: 880, h: 620 }, props: {} },
  { kind: 'ModalSlotEdit',   label: 'Slot edit',        dim: { w: 720, h: 560 }, props: { slotId: 'thu-1830-ig' } },
  { kind: 'ModalNewProject', label: 'New project',      dim: { w: 600, h: 440 }, props: {} },
  { kind: 'ModalNewDoc',     label: 'New doc',          dim: { w: 600, h: 440 }, props: {} },
  { kind: 'ModalConfirm',    label: 'Confirm · destructive', dim: { w: 540, h: 360 }, props: {
      title: 'Discard this draft?', body: 'You haven’t shipped this. The text will be archived for 30 days, then removed.',
      confirmLabel: 'Discard', dangerLabel: true,
  } },
  { kind: 'ModalToast',      label: 'Toast pill',       dim: { w: 520, h: 200 }, props: { text: 'Sent.' } },
];

function MasterModalArtboardBody({ kind, props }) {
  const Comp = window['HF_' + kind];
  if (!Comp) {
    return <MasterPlaceholder kicker="MODAL NOT REGISTERED" title={kind} />;
  }
  // Modals are normally rendered inside MasterModalLayer with margin: -32px
  // and a centered card. In the artboard we render them inline against a
  // soft scrim background so the frame reads as "this is the modal".
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32, boxSizing: 'border-box',
      background: 'color-mix(in srgb, var(--fg-primary) 14%, var(--surface-2))',
    }}>
      <div style={{
        background: 'var(--surface-1)',
        padding: 32, borderRadius: 16,
        boxShadow: '0 24px 64px -16px color-mix(in srgb, var(--fg-primary) 32%, transparent)',
        maxWidth: '100%', maxHeight: '100%', overflow: 'auto',
      }}>
        <Comp {...(props || {})} />
      </div>
    </div>
  );
}

function HF_MasterLayoutView() {
  const { state, openSurfaceInInteractive } = window.useMasterState();
  const { ws: activeWs, sub: activeSub } = state.activeSurface;

  React.useEffect(() => {
    if (!activeWs || !activeSub) {
      const id = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.querySelectorAll('.design-canvas').forEach((el) => {
          el.scrollTop = 0;
          el.scrollLeft = 0;
        });
      }, MLV_SCROLL_DELAY_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      const sel = `[data-mlv-slot="${activeWs}/${activeSub}"]`;
      const el = document.querySelector(sel);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, MLV_SCROLL_DELAY_MS);
    return () => clearTimeout(id);
  }, [activeWs, activeSub]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Page header */}
      <div style={{ padding: '24px 32px 18px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
        <div style={{ maxWidth: 1488, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600,
            }}>COOPR · MASTER · LAYOUT VIEW · EVERY SURFACE, EVERY STATE, EVERY DETAIL</span>
          </div>
          <h1 style={{
            margin: '0 0 4px', fontFamily: 'var(--font-serif)', fontWeight: 500,
            fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.018em',
            lineHeight: 1.1,
          }}>
            Every screen we have. <span style={{ fontStyle: 'italic' }}>Every state. Every drill-in.</span>
          </h1>
          <p style={{
            margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 980, lineHeight: 1.45,
          }}>
            One DCSection per workspace, plus a Modals section at the end. The state-band on each artboard flips between happy / loading / empty / error without leaving layout. The detail-band lists the registered detail kinds — click a kind to render that drill-in inside the same frame. Click the surface body to step inside via the v10 chrome.
          </p>
        </div>
      </div>

      <DesignCanvas>
        {window.MASTER_WS_ORDER.map(w => {
          const meta = window.SURFACE_REGISTRY[w.id];
          if (!meta) return null;
          return (
            <DCSection
              key={w.id}
              id={'mlv-' + w.id}
              title={meta.label + ' · ' + meta.subs.length + ' surfaces'}
              subtitle={'Workspace · ' + meta.subs.map(s => s.id).join(' · ')}
            >
              {meta.subs.map(s => {
                const isActive = w.id === activeWs && s.id === activeSub;
                return (
                  <DCArtboard
                    key={w.id + '/' + s.id}
                    id={w.id + '__' + s.id.toLowerCase().replace(/\s+/g, '-')}
                    label={meta.label + ' · ' + s.id + (isActive ? ' · active' : '')}
                    width={s.dimensions.w}
                    height={s.dimensions.h + 80 /* room for state + detail bands */}
                  >
                    <MasterArtboardWithControls
                      ws={w.id}
                      sub={s.id}
                      item={s}
                      isActive={isActive}
                      openSurface={openSurfaceInInteractive}
                    />
                  </DCArtboard>
                );
              })}
            </DCSection>
          );
        })}

        {/* Synthetic Modals · Overlays section */}
        <DCSection
          id="mlv-modals"
          title={'Modals · Overlays · ' + MLV_MODALS_LIST.length + ' kinds'}
          subtitle={'Frozen previews · ' + MLV_MODALS_LIST.map(m => m.label).join(' · ')}
        >
          {MLV_MODALS_LIST.map(m => (
            <DCArtboard
              key={m.kind}
              id={'modal__' + m.kind.toLowerCase()}
              label={'Modal · ' + m.label}
              width={m.dim.w}
              height={m.dim.h}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <span style={{
                  position: 'absolute', top: 10, right: 12, zIndex: 4,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 999,
                  background: 'color-mix(in srgb, var(--accent-primary) 8%, var(--surface-1))',
                  border: '1px solid color-mix(in srgb, var(--accent-primary) 22%, transparent)',
                  color: 'var(--accent-primary-press)',
                  fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  pointerEvents: 'none',
                }}>{'HF_' + m.kind}</span>
                <MasterModalArtboardBody kind={m.kind} props={m.props} />
              </div>
            </DCArtboard>
          ))}
        </DCSection>
      </DesignCanvas>
    </div>
  );
}

Object.assign(window, {
  HF_MasterLayoutView,
  MasterPlaceholder,
  MasterSurfaceSlot,
  MasterArtboardStateStrip,
  MasterArtboardDetailStrip,
  MasterArtboardWithControls,
});
