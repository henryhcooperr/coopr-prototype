/* global React, window, HfShell */
/* hifi-settings-r2.jsx — Settings R2.
   Six full surfaces extending the R1 Connections-only artboard (HF_Settings in hifi-more.jsx).
   Settings is NOT a workspace — IA contract keeps it accessed from the avatar dropdown.
   These surfaces are explored as a Settings DCSection in app-hifi-r4.jsx.

   Editorial cue: thinner header band (kicker + serif-italic title only, no deck),
   then dense form rows on the 8pt grid. Two-column body grid: 1fr / 280px sidebar. */

const S2M = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

// Mono uppercase eyebrow (kicker), like ML in hifi-more.jsx but local.
function S2Kicker({ children, c = 'var(--fg-tertiary)', s = 9.5, st = {} }) {
  return (
    <span style={{
      fontFamily: S2M.sans, fontSize: s, color: c, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase', ...st,
    }}>{children}</span>
  );
}

// Tabular mono caption.
function S2Mono({ children, c = 'var(--fg-tertiary)', s = 10.5, st = {} }) {
  return (
    <span className="hf-num" style={{
      fontFamily: S2M.mono, fontSize: s, color: c, letterSpacing: '0.04em', ...st,
    }}>{children}</span>
  );
}

// Form row — left-aligned label/help, right-aligned control. 8pt-grid spacing.
function S2Row({ label, help, children, last = false }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32,
      padding: '16px 0',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: last ? '1px solid var(--border-subtle)' : 'none',
      alignItems: 'baseline',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: S2M.sans, fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)' }}>{label}</span>
        {help && <span style={{ fontFamily: S2M.sans, fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>{help}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

// Text-input atom — borderless underline style fitting the editorial paper aesthetic.
function S2Input({ value, mono = false, type = 'text', placeholder = '', readOnly = true, w = 320 }) {
  return (
    <input
      type={type} defaultValue={value} placeholder={placeholder} readOnly={readOnly}
      style={{
        width: w, height: 32, padding: '0 12px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        fontFamily: mono ? S2M.mono : S2M.sans,
        fontSize: 13, color: 'var(--fg-primary)',
        letterSpacing: mono ? '0.02em' : 'normal',
        outline: 'none',
      }}
    />
  );
}

// Inline toggle pill (visual only — no state).
function S2Toggle({ on = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      width: 34, height: 18, borderRadius: 999,
      background: on ? 'var(--accent-primary)' : 'var(--surface-3)',
      border: '1px solid ' + (on ? 'var(--accent-primary-press)' : 'var(--border-default)'),
      padding: 1, transition: 'background 120ms', flexShrink: 0,
      cursor: 'default',
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: '50%',
        background: 'var(--surface-1)',
        boxShadow: '0 1px 2px rgba(26,24,21,0.18)',
        transform: on ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform 120ms',
      }} />
    </span>
  );
}

// Pill button — primary, secondary, or destructive.
function S2Btn({ children, kind = 'secondary', size = 'md' }) {
  const base = {
    fontFamily: S2M.sans, fontWeight: 600,
    fontSize: size === 'sm' ? 11.5 : 12.5,
    padding: size === 'sm' ? '5px 10px' : '7px 14px',
    borderRadius: 6, cursor: 'default',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: '1px solid transparent',
    letterSpacing: '-0.005em',
  };
  const k = {
    primary:  { background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', borderColor: 'var(--accent-primary-press)' },
    secondary:{ background: 'var(--surface-1)', color: 'var(--fg-primary)', borderColor: 'var(--border-default)' },
    ghost:    { background: 'transparent', color: 'var(--fg-secondary)', borderColor: 'transparent' },
    danger:   { background: 'var(--surface-1)', color: 'var(--tone-danger)', borderColor: 'var(--tone-danger)' },
    dangerSolid: { background: 'var(--tone-danger)', color: 'var(--fg-on-accent)', borderColor: 'var(--tone-danger)' },
  }[kind];
  return <span style={{ ...base, ...k }}>{children}</span>;
}

// Filled chip (for forbidden-tones list, scope tags).
function S2Chip({ children, removable = false, tone = 'default' }) {
  const palette = {
    default: { bg: 'var(--surface-2)', fg: 'var(--fg-secondary)', bd: 'var(--border-subtle)' },
    danger:  { bg: 'var(--tone-danger-bg)', fg: 'var(--tone-danger)', bd: 'var(--tone-danger)' },
    success: { bg: 'var(--tone-success-bg)', fg: 'var(--tone-success)', bd: 'var(--tone-success)' },
    warning: { bg: 'var(--tone-warning-bg)', fg: 'var(--tone-warning)', bd: 'var(--tone-warning)' },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999,
      background: palette.bg, color: palette.fg,
      border: '1px solid ' + palette.bd,
      fontFamily: S2M.sans, fontSize: 11.5, fontWeight: 500,
    }}>
      {children}
      {removable && <span style={{ fontFamily: S2M.mono, fontSize: 9, opacity: 0.7, marginLeft: 2 }}>×</span>}
    </span>
  );
}

// Sidebar callout card — for "danger zone" or contextual help on the right rail.
function S2SideCard({ kicker, title, children, tone = 'neutral' }) {
  const t = {
    neutral: { bg: 'var(--surface-1)', bd: 'var(--border-default)', accent: 'var(--fg-primary)' },
    accent:  { bg: 'var(--accent-soft)', bd: 'var(--accent-primary)', accent: 'var(--accent-primary-press)' },
    danger:  { bg: 'var(--tone-danger-bg)', bd: 'var(--tone-danger)', accent: 'var(--tone-danger)' },
    success: { bg: 'var(--tone-success-bg)', bd: 'var(--tone-success)', accent: 'var(--tone-success)' },
  }[tone];
  return (
    <div style={{
      padding: 16, borderRadius: 10,
      background: t.bg, border: '1px solid ' + t.bd,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {kicker && <S2Kicker s={9} c={t.accent}>{kicker}</S2Kicker>}
      {title && (
        <span style={{
          fontFamily: S2M.serif, fontStyle: 'italic', fontSize: 18, fontWeight: 500,
          color: 'var(--fg-primary)', letterSpacing: '-0.01em', lineHeight: 1.3,
        }}>{title}</span>
      )}
      {children}
    </div>
  );
}

// Editorial header band — thinner than feature surfaces.
// kicker (mono uppercase) + serif-italic title. NO deck.
function S2Header({ kicker, title }) {
  return (
    <div style={{
      padding: '24px 0 18px',
      borderBottom: '1px solid var(--fg-primary)',
      marginBottom: 24,
    }}>
      <div style={{ marginBottom: 6 }}><S2Kicker>{kicker}</S2Kicker></div>
      <h1 style={{
        margin: 0,
        fontFamily: S2M.serif, fontStyle: 'italic',
        fontSize: 28, fontWeight: 500,
        color: 'var(--fg-primary)',
        letterSpacing: '-0.018em', lineHeight: 1.15,
      }}>{title}</h1>
    </div>
  );
}

// Six-section nav rail — local to Settings R2 surfaces. Mirrors HF_Settings's aside
// but with the full 6-section list.
const S2_SECTIONS = [
  { id: 'account',     label: 'Account' },
  { id: 'brandvoice',  label: 'Brand voice' },
  { id: 'connections', label: 'Connections' },
  { id: 'plan',        label: 'Plan & billing' },
  { id: 'notif',       label: 'Notifications' },
  { id: 'data',        label: 'Data & privacy' },
];

function S2Aside({ active }) {
  return (
    <aside style={{
      width: 220, padding: '24px 14px',
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)', flexShrink: 0,
    }}>
      <div style={{ padding: '0 10px 12px' }}>
        <span style={{
          fontFamily: S2M.serif, fontStyle: 'italic',
          fontSize: 22, fontWeight: 500,
          color: 'var(--fg-primary)', letterSpacing: '-0.015em',
        }}>Settings</span>
      </div>
      {S2_SECTIONS.map(s => {
        const isActive = s.id === active;
        return (
          <div key={s.id} style={{
            padding: '8px 12px',
            borderRadius: 6,
            fontFamily: S2M.sans, fontSize: 13,
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--fg-primary)' : 'var(--fg-secondary)',
            background: isActive ? 'var(--surface-2)' : 'transparent',
            borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
            marginLeft: -2,
            cursor: 'default',
          }}>{s.label}</div>
        );
      })}
      <div style={{
        marginTop: 18, padding: '12px 10px', borderTop: '1px solid var(--border-subtle)',
      }}>
        <S2Kicker s={9}>Signed in as</S2Kicker>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: S2M.sans, fontSize: 10, fontWeight: 700,
          }}>H</span>
          <S2Mono s={11} c="var(--fg-secondary)">henry@dives.studio</S2Mono>
        </div>
      </div>
    </aside>
  );
}

// Shared shell + body wrapper.
function S2Surface({ active, kicker, title, children }) {
  return (
    <HfShell workspace="home" topbarRight={
      <>
        <S2Mono s={11}>← back to Home</S2Mono>
        <span style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: S2M.sans, fontSize: 11, fontWeight: 700,
        }}>H</span>
      </>
    }>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <S2Aside active={active} />
        <div style={{
          flex: 1, minWidth: 0, overflow: 'auto',
          padding: '0 40px 60px',
        }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <S2Header kicker={kicker} title={title} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40 }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 1. ACCOUNT
// ────────────────────────────────────────────────────────────────────────
function HF_SettingsAccount() {
  return (
    <S2Surface active="account" kicker="Account · identity" title="Who you are to COOPR.">
      <div>
        <S2Row label="Email" help="Used for sign-in and receipts. Verified.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <S2Input value="henry@dives.studio" mono w={320} />
            <S2Chip tone="success">verified</S2Chip>
          </div>
        </S2Row>
        <S2Row label="Display handle" help="Shown on your published checklist exports and shareable cards.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <S2Input value="Henry Mwangi" w={320} />
            <S2Btn kind="ghost" size="sm">Change</S2Btn>
          </div>
        </S2Row>
        <S2Row label="Username" help="Lowercase. 3–24 chars. Visible in shared links.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <S2Mono c="var(--fg-tertiary)">getcoopr.com/</S2Mono>
            <S2Input value="henrydives" mono w={220} />
          </div>
        </S2Row>
        <S2Row label="Timezone" help="When daily briefing fires and posting windows render.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', height: 32,
              border: '1px solid var(--border-default)', borderRadius: 6,
              background: 'var(--surface-1)',
              fontFamily: S2M.sans, fontSize: 13, color: 'var(--fg-primary)', minWidth: 320,
            }}>
              <span style={{ flex: 1 }}>Africa/Nairobi · UTC +03:00</span>
              <S2Mono s={10}>▾</S2Mono>
            </span>
            <S2Mono s={11}>auto-detected</S2Mono>
          </div>
        </S2Row>
        <S2Row label="Language" help="Briefing voice and prompt language. Library copy stays per-platform.">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', height: 32,
            border: '1px solid var(--border-default)', borderRadius: 6,
            background: 'var(--surface-1)',
            fontFamily: S2M.sans, fontSize: 13, color: 'var(--fg-primary)', minWidth: 220,
          }}>
            <span style={{ flex: 1 }}>English (US)</span>
            <S2Mono s={10}>▾</S2Mono>
          </span>
        </S2Row>
        <S2Row label="Password">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <S2Input value="••••••••••••" mono w={220} />
            <S2Btn kind="secondary" size="sm">Change password</S2Btn>
            <S2Mono s={11}>last changed Mar 14</S2Mono>
          </div>
        </S2Row>
        <S2Row label="Two-factor" help="Authenticator app. Adds a 6-digit step to new sign-ins.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <S2Toggle on />
            <S2Mono s={11.5} c="var(--fg-secondary)">on · authenticator app</S2Mono>
            <span style={{ flex: 1 }} />
            <S2Btn kind="ghost" size="sm">Recovery codes</S2Btn>
          </div>
        </S2Row>
        <S2Row label="Active sessions" help="Each device keeps its own session. Sign others out anytime." last>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['MacBook · Safari',  'Nairobi · 4 min ago',  true],
              ['iPhone · COOPR app','Nairobi · 1 day ago',  false],
              ['iPad · Chrome',     'Mombasa · 6 days ago', false],
            ].map(([who, where, current], i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, alignItems: 'center',
                padding: '8px 12px', borderRadius: 6,
                background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
              }}>
                <div>
                  <div style={{ fontFamily: S2M.sans, fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 500 }}>{who}</div>
                  <S2Mono s={10.5}>{where}</S2Mono>
                </div>
                {current ? <S2Chip tone="success">this device</S2Chip> : <span />}
                {!current && <S2Btn kind="ghost" size="sm">Sign out</S2Btn>}
              </div>
            ))}
          </div>
        </S2Row>
      </div>

      {/* Right rail — danger zone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <S2SideCard kicker="The basics" title="Things you change once.">
          <p style={{
            margin: 0, fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.55,
          }}>
            Email, handle, and timezone are stable identity. Touch them rarely. COOPR threads
            them into every shareable export — change here, it propagates everywhere.
          </p>
        </S2SideCard>
        <S2SideCard kicker="Danger zone" title="Delete this account." tone="danger">
          <p style={{
            margin: 0, fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.55,
          }}>
            Removes your library, drafts, voice profile, and all linked-account tokens.
            Irreversible after 14 days. Connected platforms keep your posts.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <S2Btn kind="danger" size="sm">Export then delete</S2Btn>
            <S2Btn kind="ghost" size="sm">Learn more</S2Btn>
          </div>
        </S2SideCard>
      </div>
    </S2Surface>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 2. BRAND VOICE
// ────────────────────────────────────────────────────────────────────────
function HF_SettingsBrandVoice() {
  const samples = [
    { id: 1, src: '0042 · long-form opener', weight: 92, snippet: '"There is a moment, just before the first frame finishes rendering, where the light decides what the rest of the post is going to feel like."' },
    { id: 2, src: '0046 · checklist intro',  weight: 80, snippet: '"This is the order I run it in. Three steps, ninety seconds. If anything in the first two fails, the third one does not happen."' },
    { id: 3, src: '0039 · short-form hook',  weight: 64, snippet: '"Watch the hand. Not the gauge — the hand. The gauge tells you a number; the hand tells you whether the number is real."' },
    { id: 4, src: '0058 · reflective close', weight: 58, snippet: '"I do not think I would teach this the same way I learned it. I would slow the third minute down and let the breathing carry."' },
    { id: 5, src: '0063 · gear teardown',    weight: 41, snippet: '"The seal is fine. The spring is fine. What is not fine is the fact that the spring is doing the seal’s job, and nobody packaged it that way."' },
  ];
  const pillars = [
    { name: 'Pillar A · technique',   weight: 36, color: 'var(--accent-primary)' },
    { name: 'Pillar B · gear & tools',weight: 24, color: 'var(--tone-info)' },
    { name: 'Pillar C · field story', weight: 28, color: 'var(--tone-success)' },
    { name: 'Pillar D · reply / Q&A', weight: 12, color: 'var(--tone-warning)' },
  ];
  const forbidden = [
    'over-promising superlatives',
    'AI-poetic metaphor stacks',
    'corporate hype openers',
    'fear-of-missing-out closers',
    'punctuation-as-energy (!!!)',
    'emoji as filler',
  ];

  return (
    <S2Surface active="brandvoice" kicker="Brand voice · tuning" title="How COOPR sounds when it speaks for you.">
      <div>
        {/* Credibility band */}
        <div style={{
          padding: '14px 16px', marginBottom: 24,
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent-primary)',
          borderRadius: 10,
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center',
        }}>
          <div>
            <S2Kicker s={9} c="var(--accent-primary-press)">Voice profile · v4 · last re-learned 3d ago</S2Kicker>
            <div style={{ marginTop: 4 }}>
              <span style={{
                fontFamily: S2M.serif, fontStyle: 'italic',
                fontSize: 17, fontWeight: 500, color: 'var(--fg-primary)',
                letterSpacing: '-0.01em', lineHeight: 1.4,
              }}>
                Coopr studied <span className="hf-num" style={{ fontFamily: S2M.mono, fontSize: 16, fontWeight: 600 }}>412</span> of your posts across <span className="hf-num" style={{ fontFamily: S2M.mono, fontSize: 16, fontWeight: 600 }}>18</span> months and three platforms.
              </span>
            </div>
          </div>
          <S2Btn kind="secondary" size="sm">Re-learn now</S2Btn>
        </div>

        <S2Row label="Voice samples" help="Five anchors COOPR weighs when generating. Tune the slider to push the model toward or away from each.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {samples.map(s => (
              <div key={s.id} style={{
                padding: 12, borderRadius: 8,
                background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
                display: 'grid', gridTemplateColumns: '1fr 200px', gap: 16, alignItems: 'center',
              }}>
                <div>
                  <S2Mono s={10}>{s.src}</S2Mono>
                  <p style={{
                    margin: '4px 0 0', fontFamily: S2M.serif, fontStyle: 'italic',
                    fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.5,
                  }}>{s.snippet}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <S2Kicker s={9}>weight</S2Kicker>
                    <S2Mono s={11} c="var(--fg-primary)" st={{ fontWeight: 600 }}>{s.weight}</S2Mono>
                  </div>
                  <div style={{ position: 'relative', height: 4, background: 'var(--surface-3)', borderRadius: 999 }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: s.weight + '%',
                      background: 'var(--accent-primary)', borderRadius: 999,
                    }} />
                    <div style={{
                      position: 'absolute', left: `calc(${s.weight}% - 6px)`, top: -4,
                      width: 12, height: 12, borderRadius: '50%',
                      background: 'var(--surface-1)',
                      border: '2px solid var(--accent-primary)',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </S2Row>

        <S2Row label="Pillar weights" help="The shape of your library. COOPR balances generations and suggestions toward this distribution.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pillars.map(p => (
              <div key={p.name} style={{
                display: 'grid', gridTemplateColumns: '180px 1fr 60px', gap: 14, alignItems: 'center',
              }}>
                <span style={{ fontFamily: S2M.sans, fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 500 }}>{p.name}</span>
                <div style={{ position: 'relative', height: 6, background: 'var(--surface-3)', borderRadius: 999 }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: p.weight + '%', background: p.color, borderRadius: 999,
                  }} />
                </div>
                <S2Mono s={11.5} c="var(--fg-primary)" st={{ textAlign: 'right', fontWeight: 600 }}>{p.weight}%</S2Mono>
              </div>
            ))}
          </div>
        </S2Row>

        <S2Row label="Forbidden tones" help="Patterns COOPR will not generate. Drop a phrase here when you hear it back and don't want to hear it again.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {forbidden.map(f => <S2Chip key={f} tone="warning" removable>{f}</S2Chip>)}
            <S2Chip>+ add a pattern</S2Chip>
          </div>
        </S2Row>

        <S2Row label="Reading level" help="Where COOPR aims its first draft. You can always edit up or down." last>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['Plainspoken','Reflective','Editorial','Technical'].map((lvl, i) => (
              <S2Chip key={lvl} tone={i === 1 ? 'success' : 'default'}>{lvl}</S2Chip>
            ))}
          </div>
        </S2Row>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <S2SideCard kicker="Why this matters" title="Voice is the moat." tone="accent">
          <p style={{
            margin: 0, fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.55,
          }}>
            Templates and prompts converge. The thing that does not converge is how you, specifically,
            phrase the third sentence. COOPR studies your library so the assistant sounds like the
            you you wrote yesterday — not a generic creator voice.
          </p>
        </S2SideCard>
        <S2SideCard kicker="Last re-learn" title="3 days ago — 12 new posts since.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <S2Chip tone="success">v4 · 412 posts</S2Chip>
          </div>
          <S2Btn kind="primary" size="sm">Re-learn voice</S2Btn>
        </S2SideCard>
      </div>
    </S2Surface>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 3. PLAN & BILLING
// ────────────────────────────────────────────────────────────────────────
function HF_SettingsPlan() {
  const usage = [
    { label: 'Posts analyzed',      used: 412, cap: 600,  unit: '/ mo',  pct: 68.7 },
    { label: 'Voice generations',   used: 1842,cap: 5000, unit: '/ mo',  pct: 36.8 },
    { label: 'Connected accounts',  used: 5,   cap: 8,    unit: 'slots', pct: 62.5 },
    { label: 'API calls (external)',used: 31200, cap: 100000, unit: '/ mo', pct: 31.2 },
  ];
  const invoices = [
    { id: 'INV-2026-04', date: 'Apr 1, 2026',  amount: '$48.00', status: 'paid' },
    { id: 'INV-2026-03', date: 'Mar 1, 2026',  amount: '$48.00', status: 'paid' },
    { id: 'INV-2026-02', date: 'Feb 1, 2026',  amount: '$48.00', status: 'paid' },
    { id: 'INV-2026-01', date: 'Jan 1, 2026',  amount: '$48.00', status: 'paid' },
    { id: 'INV-2025-12', date: 'Dec 1, 2025',  amount: '$48.00', status: 'paid' },
  ];
  return (
    <S2Surface active="plan" kicker="Plan · billing" title="Pro · billed monthly · renews May 1.">
      <div>
        {/* Plan summary card */}
        <div style={{
          padding: 20, marginBottom: 24,
          background: 'var(--surface-ink)',
          color: 'var(--fg-on-ink)',
          borderRadius: 12,
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
        }}>
          <div>
            <S2Kicker s={9} c="rgba(253,252,249,0.55)">Current plan</S2Kicker>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{
                fontFamily: S2M.serif, fontStyle: 'italic',
                fontSize: 32, fontWeight: 500,
                letterSpacing: '-0.018em',
              }}>Pro</span>
              <span className="hf-num" style={{
                fontFamily: S2M.mono, fontSize: 14,
                color: 'rgba(253,252,249,0.7)',
              }}>$48 / mo · renews May 1</span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Unlimited library', '5 connected accounts', 'Voice re-learning', 'Priority sync'].map(b => (
                <span key={b} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 9px', borderRadius: 999,
                  background: 'rgba(253,252,249,0.08)',
                  border: '1px solid rgba(253,252,249,0.18)',
                  fontFamily: S2M.sans, fontSize: 11, color: 'rgba(253,252,249,0.85)',
                }}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <S2Btn kind="primary" size="sm">Upgrade to Studio</S2Btn>
            <S2Btn kind="ghost" size="sm">Switch to annual · save 17%</S2Btn>
          </div>
        </div>

        <S2Row label="Usage this period" help="Resets May 1. Approaching a cap will not interrupt — COOPR will queue and tell you.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {usage.map(u => (
              <div key={u.label} style={{
                display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16, alignItems: 'center',
                padding: '8px 0',
              }}>
                <div>
                  <span style={{ fontFamily: S2M.sans, fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 500 }}>{u.label}</span>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <S2Mono s={13} c="var(--fg-primary)" st={{ fontWeight: 600 }}>{u.used.toLocaleString()}</S2Mono>
                    <S2Mono s={11}>{u.unit === 'slots' ? '/ ' + u.cap + ' ' + u.unit : 'of ' + u.cap.toLocaleString() + ' ' + u.unit}</S2Mono>
                  </div>
                </div>
                <div style={{ position: 'relative', height: 6, background: 'var(--surface-3)', borderRadius: 999 }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: u.pct + '%',
                    background: u.pct > 80 ? 'var(--tone-warning)' : 'var(--accent-primary)',
                    borderRadius: 999,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </S2Row>

        <S2Row label="Payment method" help="One card on file. Receipts go to your account email.">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 8,
            background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
            maxWidth: 420,
          }}>
            <span style={{
              width: 36, height: 24, borderRadius: 4,
              background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: S2M.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
            }}>VISA</span>
            <div style={{ flex: 1 }}>
              <S2Mono s={12} c="var(--fg-primary)" st={{ fontWeight: 600 }}>···· ···· ···· 4204</S2Mono>
              <div><S2Mono s={10}>exp 09 / 28 · Henry Mwangi</S2Mono></div>
            </div>
            <S2Btn kind="ghost" size="sm">Update</S2Btn>
          </div>
        </S2Row>

        <S2Row label="Billing email" help="Where invoices and receipts arrive. Independent of your sign-in email.">
          <S2Input value="billing@dives.studio" mono w={320} />
        </S2Row>

        <S2Row label="Invoices" help="Last twelve months. Tap any row to download a PDF." last>
          <div style={{
            border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden',
          }}>
            {invoices.map((inv, i) => (
              <div key={inv.id} style={{
                display: 'grid', gridTemplateColumns: '180px 1fr 100px 100px', gap: 14, alignItems: 'center',
                padding: '10px 14px',
                borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                background: 'var(--surface-1)',
              }}>
                <S2Mono s={11.5} c="var(--fg-primary)">{inv.id}</S2Mono>
                <span style={{ fontFamily: S2M.sans, fontSize: 12.5, color: 'var(--fg-secondary)' }}>{inv.date}</span>
                <S2Mono s={12} c="var(--fg-primary)" st={{ fontWeight: 600 }}>{inv.amount}</S2Mono>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <S2Chip tone="success">{inv.status}</S2Chip>
                </div>
              </div>
            ))}
          </div>
        </S2Row>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <S2SideCard kicker="Compare" title="What Studio adds." tone="accent">
          <ul style={{
            margin: 0, padding: '0 0 0 16px',
            fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.6,
          }}>
            <li>Unlimited connected accounts</li>
            <li>Team seats (3 included)</li>
            <li>Custom voice retraining cadence</li>
            <li>Export to BI tools</li>
          </ul>
          <S2Btn kind="primary" size="sm">See Studio plan</S2Btn>
        </S2SideCard>
        <S2SideCard kicker="Cancel anytime" title="No claw-back of your library.">
          <p style={{
            margin: 0, fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.55,
          }}>
            Downgrading keeps every analysis you have already run. New analyses pause until the next paid period.
          </p>
          <S2Btn kind="ghost" size="sm">Downgrade to free</S2Btn>
        </S2SideCard>
      </div>
    </S2Surface>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 4. NOTIFICATIONS
// ────────────────────────────────────────────────────────────────────────
function HF_SettingsNotifications() {
  const channels = [
    { id: 'email', label: 'Email' },
    { id: 'push',  label: 'Push' },
    { id: 'inapp', label: 'In-app' },
  ];
  // 8 categories × 3 channels matrix. Each cell is a toggle state.
  const rows = [
    { cat: 'Daily briefing',         help: 'Morning summary of overnight activity.', on: [true,  true,  true ] },
    { cat: 'New comment threads',    help: 'When a reply needs your voice.',         on: [false, true,  true ] },
    { cat: 'Audience milestones',    help: 'Followers, watch hours, save records.',  on: [true,  false, true ] },
    { cat: 'Library analysis ready', help: 'When a long-form post finishes ingesting.', on: [false, false, true ] },
    { cat: 'Voice re-learn done',    help: 'When the model finishes a re-train.',    on: [true,  false, true ] },
    { cat: 'Sync errors',            help: 'A connected account needs re-auth.',     on: [true,  true,  true ] },
    { cat: 'Weekly retrospective',   help: 'Friday digest with what shifted.',       on: [true,  false, false] },
    { cat: 'Product updates',        help: 'New surfaces, breaking changes.',        on: [false, false, false] },
  ];

  return (
    <S2Surface active="notif" kicker="Notifications · channels" title="When and where COOPR finds you.">
      <div>
        {/* Matrix — 3 channels × 8 categories */}
        <div style={{
          border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden',
          marginBottom: 24,
        }}>
          {/* Matrix header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr repeat(3, 100px)',
            padding: '10px 16px',
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--border-default)',
            alignItems: 'center', gap: 12,
          }}>
            <S2Kicker s={9}>Category</S2Kicker>
            {channels.map(c => (
              <div key={c.id} style={{ textAlign: 'center' }}>
                <S2Kicker s={9}>{c.label}</S2Kicker>
              </div>
            ))}
          </div>
          {rows.map((r, i) => (
            <div key={r.cat} style={{
              display: 'grid', gridTemplateColumns: '1fr repeat(3, 100px)',
              padding: '14px 16px',
              borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
              alignItems: 'center', gap: 12,
              background: 'var(--surface-1)',
            }}>
              <div>
                <span style={{ fontFamily: S2M.sans, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>{r.cat}</span>
                <div><S2Mono s={10.5}>{r.help}</S2Mono></div>
              </div>
              {r.on.map((isOn, ci) => (
                <div key={ci} style={{ display: 'flex', justifyContent: 'center' }}>
                  <S2Toggle on={isOn} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Quiet hours band */}
        <div style={{
          padding: 18, borderRadius: 10,
          background: 'var(--surface-1)', border: '1px solid var(--border-default)',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
        }}>
          <div>
            <S2Kicker s={9}>Quiet hours · push</S2Kicker>
            <div style={{ marginTop: 4 }}>
              <span style={{
                fontFamily: S2M.serif, fontStyle: 'italic',
                fontSize: 17, fontWeight: 500, color: 'var(--fg-primary)',
                letterSpacing: '-0.01em',
              }}>Hold push between <span className="hf-num" style={{ fontFamily: S2M.mono, fontSize: 16, fontWeight: 600 }}>22:00</span> and <span className="hf-num" style={{ fontFamily: S2M.mono, fontSize: 16, fontWeight: 600 }}>07:30</span>.</span>
            </div>
            <div style={{ marginTop: 4 }}>
              <S2Mono s={11}>Sync errors still ring through.</S2Mono>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <S2Toggle on />
            <S2Btn kind="ghost" size="sm">Edit window</S2Btn>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <S2Kicker s={10}>Bulk</S2Kicker>
          <S2Btn kind="secondary" size="sm">Mute all push for a week</S2Btn>
          <S2Btn kind="ghost" size="sm">Reset to defaults</S2Btn>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <S2SideCard kicker="Presets" title="Three opinionated defaults." tone="accent">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['Focus mode',    'Briefing + sync errors only',   true ],
              ['Default',       'A balanced mix · 6 categories', false],
              ['Everything on', 'For coordinators and teams',    false],
            ].map(([n, sub, active], i) => (
              <div key={i} style={{
                padding: '8px 10px', borderRadius: 6,
                background: active ? 'var(--surface-1)' : 'transparent',
                border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-subtle)'),
                cursor: 'default',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: S2M.sans, fontSize: 12.5, fontWeight: active ? 600 : 500, color: 'var(--fg-primary)' }}>{n}</span>
                  {active && <S2Mono s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>active</S2Mono>}
                </div>
                <S2Mono s={10.5}>{sub}</S2Mono>
              </div>
            ))}
          </div>
        </S2SideCard>
        <S2SideCard kicker="Note" title="What never gets muted.">
          <p style={{
            margin: 0, fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.55,
          }}>
            Sign-in alerts, payment failures, and connected-account re-auth requests ignore both
            the matrix and quiet hours. Three categories, opt-out blocked.
          </p>
        </S2SideCard>
      </div>
    </S2Surface>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 5. CONNECTIONS · R2
// ────────────────────────────────────────────────────────────────────────
function HF_SettingsConnections_R2() {
  const conns = [
    {
      plat: 'Instagram', glyph: 'Ig',
      handle: '@henry.dives', followers: '98.3k',
      lastSync: '12 min ago', state: 'connected', primary: true,
      scopeLabels: ['Posts read', 'Insights read', 'Comments read', 'Comments reply'],
      scopeNote: 'No DM access · no posting permission',
      reauth: false,
    },
    {
      plat: 'YouTube', glyph: 'Yt',
      handle: '@henrymwangi', followers: '287.4k',
      lastSync: '2 min ago', state: 'connected', primary: true,
      scopeLabels: ['Videos read', 'Analytics read', 'Comments read', 'Comments reply'],
      scopeNote: 'Read-only · COOPR will never publish on your behalf',
      reauth: false,
    },
    {
      plat: 'YouTube', glyph: 'Yt',
      handle: '@henrymwangi.tutorials', followers: '12.1k',
      lastSync: '4 hr ago', state: 'reauth', primary: false,
      scopeLabels: ['Videos read', 'Analytics read'],
      scopeNote: 'Token expired Apr 26 · re-authorize to resume sync',
      reauth: true,
    },
    {
      plat: 'TikTok', glyph: 'Tt',
      handle: '@henrymwangi', followers: '24.8k',
      lastSync: '1 hr ago', state: 'connected', primary: false,
      scopeLabels: ['Posts read', 'Insights read'],
      scopeNote: 'Comments and replies require a second app review · pending',
      reauth: false,
    },
    {
      plat: 'Threads', glyph: 'Th',
      handle: '@henry.dives', followers: '12.4k',
      lastSync: '1 day ago', state: 'connected', primary: false,
      scopeLabels: ['Posts read'],
      scopeNote: 'Insights read pending platform rollout',
      reauth: false,
    },
  ];

  return (
    <S2Surface active="connections" kicker="Connections · linked accounts" title="What COOPR can see, and how often.">
      <div>
        <S2Row label="Linked platforms" help="Mark one per platform as primary — that's the account that loads first in topbar, Library, and Insights.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conns.map((c, i) => (
              <div key={i} style={{
                padding: 14, borderRadius: 10,
                background: 'var(--surface-1)',
                border: '1px solid ' + (c.reauth ? 'var(--tone-warning)' : 'var(--border-subtle)'),
              }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 14, alignItems: 'center',
                }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 7,
                    background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: S2M.mono, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                  }}>{c.glyph}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: S2M.sans, fontSize: 13.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{c.plat}</span>
                      <S2Mono s={11.5} c="var(--fg-secondary)">{c.handle}</S2Mono>
                      {c.primary && <S2Chip tone="success">primary</S2Chip>}
                      {c.reauth && <S2Chip tone="warning">re-auth needed</S2Chip>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                      <S2Mono s={10.5}>last sync · {c.lastSync}</S2Mono>
                      <S2Mono s={10.5}>followers · {c.followers}</S2Mono>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {c.reauth
                      ? <S2Btn kind="primary" size="sm">Re-authorize</S2Btn>
                      : <S2Btn kind="secondary" size="sm">Manage</S2Btn>}
                    <S2Btn kind="ghost" size="sm">···</S2Btn>
                  </div>
                </div>

                {/* Scope detail */}
                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border-subtle)',
                  display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16, alignItems: 'flex-start',
                }}>
                  <div>
                    <S2Kicker s={9}>What COOPR can see</S2Kicker>
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {c.scopeLabels.map(s => <S2Chip key={s}>{s}</S2Chip>)}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: S2M.serif, fontStyle: 'italic',
                    fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55,
                  }}>{c.scopeNote}</div>
                </div>
              </div>
            ))}

            {/* Add another */}
            <div style={{
              padding: '14px 16px', borderRadius: 10,
              border: '1px dashed var(--border-default)',
              background: 'transparent',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 6,
                background: 'var(--surface-2)', color: 'var(--fg-tertiary)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: S2M.mono, fontSize: 14, fontWeight: 700,
              }}>+</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: S2M.sans, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>Connect another account</span>
                <div><S2Mono s={10.5}>YouTube · Instagram · TikTok · Threads · LinkedIn (soon)</S2Mono></div>
              </div>
              <S2Btn kind="secondary" size="sm">Choose platform</S2Btn>
            </div>
          </div>
        </S2Row>

        <S2Row label="Sync schedule" help="Background pulls. Faster cadence costs more API quota.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              ['Continuous', 'every 5 min',  false],
              ['Hourly',     'on the hour',  true ],
              ['Daily',      '04:00 local',  false],
              ['Manual',     'pull on open', false],
            ].map(([n, sub, active], i) => (
              <div key={i} style={{
                padding: '10px 14px', borderRadius: 8,
                background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
                border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-subtle)'),
                minWidth: 160,
              }}>
                <div style={{ fontFamily: S2M.sans, fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: active ? 600 : 500 }}>{n}</div>
                <div><S2Mono s={10.5}>{sub}</S2Mono></div>
              </div>
            ))}
          </div>
        </S2Row>

        <S2Row label="Disconnected accounts" help="Tokens revoked. Their library stays read-only in COOPR for 30 days." last>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <S2Chip tone="default">@henry.test · IG · revoked Mar 22</S2Chip>
            <S2Chip tone="default">@henry-photo · YT · revoked Feb 11</S2Chip>
          </div>
        </S2Row>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <S2SideCard kicker="What COOPR pulls" title="Posts, captions, comments — that's it." tone="accent">
          <p style={{
            margin: 0, fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.55,
          }}>
            COOPR reads your published posts, captions, and public comment threads. We do not read DMs,
            we do not post on your behalf, and we never see follower contact information.
          </p>
          <S2Btn kind="ghost" size="sm">Read the full disclosure</S2Btn>
        </S2SideCard>
        <S2SideCard kicker="Re-auth windows" title="Tokens last 60 days.">
          <p style={{
            margin: 0, fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.55,
          }}>
            Each platform issues short-lived tokens. COOPR refreshes silently when it can. When the
            platform forces a fresh login, you'll see a re-auth chip and a notification.
          </p>
        </S2SideCard>
      </div>
    </S2Surface>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 6. DATA & PRIVACY
// ────────────────────────────────────────────────────────────────────────
function HF_SettingsData() {
  return (
    <S2Surface active="data" kicker="Data · privacy" title="Your library, on your terms.">
      <div>
        <S2Row label="Export" help="Everything COOPR has on file: library rows, voice samples, settings, invoices.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <S2Btn kind="primary" size="sm">Request full export · ZIP</S2Btn>
            <S2Btn kind="secondary" size="sm">CSV — library only</S2Btn>
            <S2Btn kind="secondary" size="sm">JSON — voice profile</S2Btn>
          </div>
          <div style={{ marginTop: 8 }}>
            <S2Mono s={11}>Last export · Mar 11 · 2026 · 142 MB · downloaded</S2Mono>
          </div>
        </S2Row>

        <S2Row label="Retention window" help="How long raw transcripts and analysis snapshots stay on file. Aggregates and your library remain regardless.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                ['90 days',  false],
                ['180 days', false],
                ['12 months',true ],
                ['Indefinite', false],
              ].map(([n, active], i) => (
                <S2Chip key={i} tone={active ? 'success' : 'default'}>{n}</S2Chip>
              ))}
            </div>
            <S2Mono s={11}>Currently · 12 months · ~2.4 GB raw transcripts</S2Mono>
          </div>
        </S2Row>

        <S2Row label="Privacy toggles" help="Three things COOPR will not do without explicit opt-in.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { k: 'Use my library to improve COOPR globally',  sub: 'Anonymized · helps the model see more creator voices.', on: false },
              { k: 'Show my account as a public case study',    sub: 'Marketing pages, with your handle and stats.',         on: false },
              { k: 'Allow team-mate read access (when invited)', sub: 'Anyone you invite sees Library and Insights.',         on: true  },
              { k: 'Background voice re-learn on new posts',     sub: 'Re-trains weekly when you publish.',                   on: true  },
              { k: 'Share aggregate metrics with platform partners', sub: 'Counts only · no captions or transcripts.',        on: false },
            ].map((t, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center',
                padding: '12px 14px', borderRadius: 8,
                background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
              }}>
                <div>
                  <div style={{ fontFamily: S2M.sans, fontSize: 13, color: 'var(--fg-primary)', fontWeight: 600 }}>{t.k}</div>
                  <div><S2Mono s={10.5}>{t.sub}</S2Mono></div>
                </div>
                <S2Toggle on={t.on} />
              </div>
            ))}
          </div>
        </S2Row>

        <S2Row label="Storage" help="Where your data lives. COOPR runs on EU and US regions; choose the one closer to your audience.">
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 520,
          }}>
            {[
              ['EU · Frankfurt', '14 ms median latency', false],
              ['US · Virginia', '128 ms median latency', true ],
            ].map(([n, sub, active], i) => (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 8,
                background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
                border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-subtle)'),
              }}>
                <div style={{ fontFamily: S2M.sans, fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: active ? 600 : 500 }}>{n}</div>
                <div><S2Mono s={10.5}>{sub}</S2Mono></div>
                {active && <div style={{ marginTop: 4 }}><S2Mono s={9.5} c="var(--accent-primary-press)" st={{ fontWeight: 600 }}>current</S2Mono></div>}
              </div>
            ))}
          </div>
        </S2Row>

        <S2Row label="Activity log" help="Every settings change, export, and connection event. Audit-grade.">
          <div style={{
            border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden',
            maxWidth: 520,
          }}>
            {[
              ['Apr 28 · 09:14', 'Added voice sample · 0042'],
              ['Apr 27 · 18:02', 'Re-authorized YouTube · @henrymwangi.tutorials'],
              ['Apr 25 · 11:30', 'Exported library CSV · 142 MB'],
              ['Apr 23 · 07:48', 'Toggled forbidden tone · "AI-poetic metaphor stacks"'],
            ].map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '160px 1fr', gap: 14, alignItems: 'baseline',
                padding: '8px 14px',
                borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                background: 'var(--surface-1)',
              }}>
                <S2Mono s={11}>{row[0]}</S2Mono>
                <span style={{ fontFamily: S2M.sans, fontSize: 12.5, color: 'var(--fg-secondary)' }}>{row[1]}</span>
              </div>
            ))}
          </div>
        </S2Row>

        <S2Row label="Erase library data" help="Removes ingested posts, transcripts, voice samples, and analysis. Your connected accounts are not touched." last>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <S2Btn kind="danger" size="sm">Erase analyzed library</S2Btn>
            <S2Mono s={11}>14-day grace · reversible</S2Mono>
          </div>
        </S2Row>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <S2SideCard kicker="Plain language" title="Three rules COOPR follows." tone="accent">
          <ul style={{
            margin: 0, padding: '0 0 0 16px',
            fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.6,
          }}>
            <li>Your library is yours. We do not relicense it.</li>
            <li>Aggregates only leave the account if you opt in.</li>
            <li>Disconnect ends ingestion; existing analyses stay readable for 30 days.</li>
          </ul>
        </S2SideCard>
        <S2SideCard kicker="Delete everything" title="Full account erase." tone="danger">
          <p style={{
            margin: 0, fontFamily: S2M.sans, fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.55,
          }}>
            Different from "erase analyzed library." This wipes account, voice profile, billing
            history, and tokens. 14-day grace, then irreversible.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <S2Btn kind="dangerSolid" size="sm">Begin deletion</S2Btn>
          </div>
        </S2SideCard>
      </div>
    </S2Surface>
  );
}

Object.assign(window, {
  HF_SettingsAccount,
  HF_SettingsBrandVoice,
  HF_SettingsPlan,
  HF_SettingsNotifications,
  HF_SettingsConnections_R2,
  HF_SettingsData,
});
