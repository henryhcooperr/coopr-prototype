/* global React, window */
/* hifi-modal-settings.jsx — D3 · Settings as a modal.

   Wraps the six R2 sub-pages (HF_SettingsAccount, HF_SettingsBrandVoice,
   HF_SettingsPlan, HF_SettingsNotifications, HF_SettingsConnections_R2,
   HF_SettingsData) into a single modal with its own left nav. Switching
   between sub-pages happens by re-rendering the right pane — no extra
   pushModal calls. ESC + scrim click are handled by MasterModalLayer.

   Each R2 sub-page already brings its own S2Aside (decorative, cursor:
   default). To avoid a doubled-aside, the modal renders the chosen
   sub-page inside a wrapper that hides any nested <aside> via a scoped
   CSS rule. The sub-page's body content is what surfaces. */

const MS_M = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

const MS_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const MS_SECTIONS = [
  { id: 'account',     label: 'Account',         component: 'HF_SettingsAccount',        kicker: 'identity' },
  { id: 'brandvoice',  label: 'Brand voice',     component: 'HF_SettingsBrandVoice',     kicker: 'tone & samples' },
  { id: 'connections', label: 'Connections',     component: 'HF_SettingsConnections_R2', kicker: 'linked accounts' },
  { id: 'plan',        label: 'Plan & billing',  component: 'HF_SettingsPlan',           kicker: 'usage & invoices' },
  { id: 'notif',       label: 'Notifications',   component: 'HF_SettingsNotifications',  kicker: 'channels & cadence' },
  { id: 'data',        label: 'Data & privacy',  component: 'HF_SettingsData',           kicker: 'exports & control' },
];

function MS_CloseGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 3 L9 9 M9 3 L3 9"
        stroke="currentColor" strokeWidth="1.4"
        fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Hides the inner S2Aside that each sub-page brings, so only its body
// renders inside the right pane. Scoped via the wrapper className. */
const MS_SCOPED_CSS = `
  .cv-modal-settings-body aside {
    display: none !important;
  }
  .cv-modal-settings-body > div > div {
    /* The slim HfShell wraps everything in a flex column → flex row. */
    /* Removing the inner aside leaves a single content column; let it
       fill the pane comfortably. */
    height: auto;
    min-height: 0;
  }
  .cv-modal-settings-body .hf {
    height: auto !important;
    overflow: visible !important;
  }
`;

function HF_ModalSettings(props) {
  const initial = (props && props.initialSection) || 'account';
  const [active, setActive] = React.useState(initial);
  const ctx = window.useMasterState ? window.useMasterState() : null;
  const popModal = ctx && ctx.popModal ? ctx.popModal : function () {};

  const section = MS_SECTIONS.find(s => s.id === active) || MS_SECTIONS[0];
  const SubComp = section && section.component ? window[section.component] : null;

  return (
    <div style={{
      width: 880, maxWidth: '100%',
      height: 560, maxHeight: '100%',
      display: 'flex', flexDirection: 'column',
      margin: '-32px',
      /* Cancel out MasterModalLayer's inner padding so we control the
         full card surface. The layer's card already provides background,
         border, shadow, radius. */
    }}>
      <style>{MS_SCOPED_CSS}</style>

      {/* HEADER STRIP ─────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 14px 22px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-1)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: MS_M.mono, fontSize: 9.5,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontWeight: 700, color: 'var(--fg-tertiary)',
          }}>Settings</span>
          <span style={{
            fontFamily: MS_M.serif, fontStyle: 'italic',
            fontSize: 16, fontWeight: 500,
            color: 'var(--fg-primary)', letterSpacing: '-0.012em',
          }}>{section.label}</span>
          <span style={{
            fontFamily: MS_M.mono, fontSize: 9,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--fg-tertiary)', fontWeight: 600,
          }}>· {section.kicker}</span>
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label="Close settings"
          onClick={popModal}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); popModal(); } }}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, borderRadius: 6,
            cursor: 'pointer', userSelect: 'none',
            color: 'var(--fg-secondary)',
            transition: `background 160ms ${MS_EASE}, color 160ms ${MS_EASE}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface-2)';
            e.currentTarget.style.color = 'var(--fg-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--fg-secondary)';
          }}>
          <MS_CloseGlyph />
        </span>
      </div>

      {/* BODY ─────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, minHeight: 0, display: 'flex',
        background: 'var(--surface-1)',
        borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
      }}>
        {/* LEFT NAV — interactive, drives section switching */}
        <aside style={{
          width: 220, flexShrink: 0,
          padding: '18px 12px',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--surface-2)',
          display: 'flex', flexDirection: 'column', gap: 2,
          borderBottomLeftRadius: 16,
        }}>
          {MS_SECTIONS.map(s => {
            const isActive = s.id === active;
            return (
              <span key={s.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(s.id)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 1,
                  padding: '8px 12px', borderRadius: 6,
                  cursor: 'pointer', userSelect: 'none',
                  background: isActive ? 'var(--surface-1)' : 'transparent',
                  borderLeft: isActive
                    ? '2px solid var(--accent-primary)'
                    : '2px solid transparent',
                  marginLeft: -2,
                  transition: `background 180ms ${MS_EASE}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'var(--surface-1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}>
                <span style={{
                  fontFamily: MS_M.mono, fontSize: 8.5,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--fg-tertiary)', fontWeight: 600,
                }}>{s.kicker}</span>
                <span style={{
                  fontFamily: isActive ? MS_M.serif : MS_M.sans,
                  fontStyle: isActive ? 'italic' : 'normal',
                  fontSize: isActive ? 14 : 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive
                    ? 'var(--accent-primary-press)'
                    : 'var(--fg-primary)',
                  letterSpacing: isActive ? '-0.005em' : '0',
                }}>{s.label}</span>
              </span>
            );
          })}
          <span style={{ flex: 1 }} />
          <div style={{
            padding: '12px 10px', borderTop: '1px solid var(--border-subtle)',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <span style={{
              fontFamily: MS_M.mono, fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--fg-tertiary)', fontWeight: 600,
            }}>Signed in as</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: MS_M.sans, fontSize: 9.5, fontWeight: 700,
              }}>H</span>
              <span className="hf-num" style={{
                fontFamily: MS_M.mono, fontSize: 10.5,
                color: 'var(--fg-secondary)', letterSpacing: '0.04em',
              }}>henry@dives.studio</span>
            </div>
          </div>
        </aside>

        {/* RIGHT PANE — renders the chosen sub-page; inner aside hidden */}
        <div
          key={active}
          className="cv-modal-settings-body"
          style={{
            flex: 1, minWidth: 0, minHeight: 0,
            overflow: 'auto',
            background: 'var(--bg-base)',
            borderBottomRightRadius: 16,
          }}>
          {SubComp ? <SubComp /> : (
            <div style={{
              padding: 40,
              fontFamily: MS_M.serif, fontStyle: 'italic',
              fontSize: 14, color: 'var(--fg-tertiary)',
            }}>
              Section not yet wired.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HF_ModalSettings });
