/* global React, window */
/* hifi-modal-new-project.jsx — F1 · New project modal.

   Pushed from Studio "+ New project" affordances. Faked submit:
     console.log({ kind: 'new-project', name, pillar }) + popModal() + pushToast.

   Pillars are creator-agnostic: Origin Story / Live Build / Reaction / Field Notes.
   No dive niche. ESC + scrim handled by MasterModalLayer. */

const MNP_M = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const MNP_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const MNP_PILLARS = [
  { id: 'origin',    label: 'Origin Story', kicker: 'STORY' },
  { id: 'live',      label: 'Live Build',   kicker: 'PROCESS' },
  { id: 'reaction',  label: 'Reaction',     kicker: 'TAKE' },
  { id: 'notes',     label: 'Field Notes',  kicker: 'OBSERVED' },
];

function MNP_CloseGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function HF_ModalNewProject() {
  const [name, setName]       = React.useState('');
  const [pillar, setPillar]   = React.useState('origin');
  const inputRef = React.useRef(null);

  const ctx       = window.useMasterState ? window.useMasterState() : null;
  const popModal  = ctx && ctx.popModal  ? ctx.popModal  : function () {};
  const pushToast = ctx && ctx.pushToast ? ctx.pushToast : function () {};

  React.useEffect(() => {
    if (inputRef.current) { try { inputRef.current.focus(); } catch (e) { /* ignore */ } }
  }, []);

  const canCreate = name.trim().length > 0;

  function onCreate() {
    if (!canCreate) return;
    const payload = { kind: 'new-project', name: name.trim(), pillar };
    // eslint-disable-next-line no-console
    console.log(payload);
    popModal();
    pushToast('Project created.');
  }

  return (
    <div style={{
      width: 520, maxWidth: '100%',
      display: 'flex', flexDirection: 'column',
      margin: '-32px',
      background: 'var(--surface-1)',
      borderRadius: 16, overflow: 'hidden',
    }}>
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 14px 22px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: MNP_M.mono, fontSize: 9.5,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontWeight: 700, color: 'var(--fg-tertiary)',
          }}>New project</span>
          <span style={{
            fontFamily: MNP_M.serif, fontStyle: 'italic',
            fontSize: 16, fontWeight: 500,
            color: 'var(--fg-primary)', letterSpacing: '-0.012em',
          }}>What are you building?</span>
        </div>
        <span
          role="button" tabIndex={0} aria-label="Close"
          onClick={popModal}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); popModal(); } }}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, borderRadius: 6,
            cursor: 'pointer', userSelect: 'none', color: 'var(--fg-secondary)',
          }}>
          <MNP_CloseGlyph />
        </span>
      </div>

      <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* NAME */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            fontFamily: MNP_M.mono, fontSize: 9.5,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontWeight: 700, color: 'var(--fg-tertiary)',
          }}>Project name</span>
          <input
            ref={inputRef} value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && canCreate) { e.preventDefault(); onCreate(); } }}
            placeholder="e.g. The day I broke the lens"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '11px 14px',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              background: 'var(--surface-2)',
              color: 'var(--fg-primary)',
              fontFamily: MNP_M.sans, fontSize: 14, fontWeight: 500,
              letterSpacing: '-0.005em',
              outline: 'none',
            }} />
        </label>

        {/* PILLAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{
            fontFamily: MNP_M.mono, fontSize: 9.5,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontWeight: 700, color: 'var(--fg-tertiary)',
          }}>Pillar</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MNP_PILLARS.map((p) => {
              const active = pillar === p.id;
              return (
                <span key={p.id}
                  role="button" tabIndex={0}
                  onClick={() => setPillar(p.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPillar(p.id); } }}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 2,
                    padding: '10px 12px',
                    border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-default)'),
                    borderRadius: 8,
                    background: active ? 'var(--accent-soft)' : 'var(--surface-2)',
                    cursor: 'pointer', userSelect: 'none',
                    transition: `background 160ms ${MNP_EASE}`,
                  }}>
                  <span style={{
                    fontFamily: MNP_M.mono, fontSize: 9,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    fontWeight: 700,
                    color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)',
                  }}>{p.kicker}</span>
                  <span style={{
                    fontFamily: active ? MNP_M.serif : MNP_M.sans,
                    fontStyle: active ? 'italic' : 'normal',
                    fontSize: 13.5, fontWeight: active ? 600 : 500,
                    color: 'var(--fg-primary)', letterSpacing: '-0.005em',
                  }}>{p.label}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--surface-2)',
      }}>
        <span style={{ flex: 1 }} />
        <span
          role="button" tabIndex={0} onClick={popModal}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); popModal(); } }}
          style={{
            padding: '7px 14px', borderRadius: 6,
            background: 'transparent', color: 'var(--fg-secondary)',
            border: '1px solid var(--border-default)',
            fontFamily: MNP_M.sans, fontSize: 12.5, fontWeight: 600,
            letterSpacing: '-0.005em', cursor: 'pointer', userSelect: 'none',
          }}>Cancel</span>
        <span
          role="button" tabIndex={0} aria-disabled={!canCreate}
          onClick={() => { if (canCreate) onCreate(); }}
          onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && canCreate) { e.preventDefault(); onCreate(); } }}
          style={{
            padding: '7px 14px', borderRadius: 6,
            background: canCreate ? 'var(--accent-primary)' : 'var(--surface-1)',
            color: canCreate ? 'var(--fg-on-accent)' : 'var(--fg-tertiary)',
            border: '1px solid ' + (canCreate ? 'var(--accent-primary)' : 'var(--border-default)'),
            fontFamily: MNP_M.sans, fontSize: 12.5, fontWeight: 600,
            letterSpacing: '-0.005em',
            cursor: canCreate ? 'pointer' : 'not-allowed', userSelect: 'none',
            transition: `background 160ms ${MNP_EASE}`,
          }}>Create project</span>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ModalNewProject });
