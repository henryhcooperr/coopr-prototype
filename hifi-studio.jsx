/* global React, window, HfShell */
/* hifi-studio.jsx — Studio · UNIFIED DOC model.
   A project is one long scrollable document. No stages. No kanban.
   Coopr lives in the right-side chat as orchestrator. Templates
   (/opener, /script, /list, /brief, /ship) are content shortcuts that
   insert formatted blocks — they are NOT workflow phases.
   Visual system: hi-fi tokens (clay accent, Newsreader serif, Plus Jakarta sans). */

const SD = window.HF_DATA;

// ─── Local helpers (hi-fi flavor) ─────────────────────────
const I = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

function MetaLabel({ children, color = 'var(--fg-tertiary)', size = 10, style = {} }) {
  return <span style={{ fontFamily: I.sans, fontSize: size, color, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', ...style }}>{children}</span>;
}
function Mono({ children, color = 'var(--fg-secondary)', size = 11, style = {} }) {
  return <span style={{ fontFamily: I.mono, fontSize: size, color, ...style }}>{children}</span>;
}
function Sparkle({ size = 11, color = 'var(--accent-primary)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ flexShrink: 0, color }}>
      <path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" />
    </svg>
  );
}
function Thumb({ w = 60, h = 60, label, tint = 'var(--surface-2)' }) {
  return (
    <div style={{ width: w, height: h, border: '1px dashed var(--border-default)', borderRadius: 4, background: tint, position: 'relative', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={Math.min(w, h) * 0.32} height={Math.min(w, h) * 0.32} viewBox="0 0 20 20" style={{ opacity: 0.32 }}>
        <path d="M2 18 L8 10 L12 14 L18 6" stroke="var(--fg-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15" cy="5" r="1.5" fill="var(--fg-primary)" />
      </svg>
      {label && <div style={{ position: 'absolute', bottom: 4, left: 6, fontFamily: I.mono, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>{label}</div>}
    </div>
  );
}

// ─── Doc-shell sidebar (left rail) ────────────────────────
function DocSidebar({ activeDoc }) {
  const inPlay = [
    { id: 'p1', t: 'Truk Lagoon · Ep. 1 hook', pillar: 'story' },
    { id: 'p2', t: 'Replacement opener for 0041', pillar: 'safety' },
    { id: 'p3', t: 'Reg-first-stage teardown 2', pillar: 'gear' },
    { id: 'p4', t: 'Reply to @marina.k', pillar: 'reply' },
    { id: 'p5', t: 'La Jolla shot list', pillar: 'story' },
  ];
  const parked = ['Komodo cold-open · alt cut', 'Q&A · doubles vs sidemount', 'Why I retired my old BCD'];
  return (
    <div style={{ width: 220, background: 'var(--surface-1)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
      {/* Brand */}
      <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 4, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: I.serif, fontStyle: 'italic', fontSize: 14, lineHeight: 1 }}>C</div>
        <span style={{ fontFamily: I.sans, fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)' }}>Coopr</span>
        <div style={{ flex: 1 }} />
        <Mono size={10} color="var(--fg-tertiary)">⇤</Mono>
      </div>

      {/* Today */}
      <div style={{ padding: '4px 8px', margin: '0 6px 2px', borderRadius: 5, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: I.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>◎</span>
        <span style={{ fontFamily: I.sans, fontSize: 12.5, color: 'var(--fg-secondary)' }}>Today</span>
      </div>

      {/* Docs · in play */}
      <div style={{ padding: '14px 14px 6px' }}><MetaLabel size={9}>Docs</MetaLabel></div>
      <div style={{ padding: '0 6px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: I.mono, fontSize: 9, color: 'var(--fg-tertiary)' }}>▾</span>
          <span style={{ fontFamily: I.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>In play</span>
          <div style={{ flex: 1 }} />
          <Mono size={9} color="var(--fg-tertiary)">5</Mono>
        </div>
        {inPlay.map(d => {
          const active = d.t === activeDoc;
          return (
            <div key={d.id} style={{
              padding: '4px 8px 4px 22px',
              background: active ? 'var(--accent-soft)' : 'transparent',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 6,
              borderLeft: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
              marginLeft: active ? -2 : 0,
            }}>
              <span style={{ fontFamily: I.mono, fontSize: 9, color: active ? 'var(--accent-primary)' : 'var(--fg-tertiary)' }}>◆</span>
              <span style={{ fontFamily: I.sans, fontSize: 12, fontWeight: active ? 600 : 400, color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{d.t}</span>
            </div>
          );
        })}

        <div style={{ padding: '10px 8px 3px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: I.mono, fontSize: 9, color: 'var(--fg-tertiary)' }}>▾</span>
          <span style={{ fontFamily: I.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>Parked</span>
        </div>
        {parked.map(t => (
          <div key={t} style={{ padding: '4px 8px 4px 22px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: I.mono, fontSize: 9, color: 'var(--fg-tertiary)' }}>◇</span>
            <span style={{ fontFamily: I.sans, fontSize: 12, color: 'var(--fg-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{t}</span>
          </div>
        ))}
        <div style={{ padding: '10px 8px 3px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: I.mono, fontSize: 9, color: 'var(--fg-tertiary)' }}>▸</span>
          <span style={{ fontFamily: I.sans, fontSize: 12, color: 'var(--fg-tertiary)' }}>Shipped</span>
          <div style={{ flex: 1 }} />
          <Mono size={9} color="var(--fg-tertiary)">42</Mono>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* User */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: I.sans, fontSize: 11, fontWeight: 600 }}>H</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: I.sans, fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>Henry</div>
          <Mono size={9} color="var(--fg-tertiary)">pro plan</Mono>
        </div>
        <div style={{ flex: 1 }} />
        <Mono size={11} color="var(--fg-tertiary)">⋯</Mono>
      </div>
    </div>
  );
}

// ─── Top breadcrumb ───────────────────────────────────────
function DocCrumb({ crumbs, right = 'autosaved · share' }) {
  return (
    <div style={{ height: 38, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
      <MetaLabel size={9.5}>{crumbs}</MetaLabel>
      <div style={{ flex: 1 }} />
      <Mono size={10} color="var(--fg-tertiary)">{right}</Mono>
    </div>
  );
}

// ─── Floating TOC ─────────────────────────────────────────
function FloatingTOC({ sections = [], active = 0 }) {
  return (
    <div style={{ position: 'absolute', top: 28, right: 28, width: 178, padding: '12px 0', background: 'rgba(253,252,249,0.86)', backdropFilter: 'blur(6px)', border: '1px solid var(--border-subtle)', borderRadius: 6, zIndex: 3 }}>
      <div style={{ padding: '0 14px 8px' }}><MetaLabel size={9}>On this page</MetaLabel></div>
      <div>
        {sections.map((s, i) => (
          <div key={s} style={{
            padding: '4px 14px',
            borderLeft: i === active ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: i === active ? 'var(--accent-soft)' : 'transparent',
          }}>
            <span style={{ fontFamily: I.sans, fontSize: 11.5, color: i === active ? 'var(--fg-primary)' : 'var(--fg-secondary)', fontWeight: i === active ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Side chat (orchestrator) ─────────────────────────────
function SideChat({ messages = [], suggestions = [] }) {
  return (
    <div style={{ width: 320, borderLeft: '1px solid var(--border-subtle)', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkle size={12} color="var(--fg-on-accent)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontFamily: I.sans, fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)' }}>Coopr</span>
          <Mono size={9} color="var(--fg-tertiary)">scoped to this doc</Mono>
        </div>
        <div style={{ flex: 1 }} />
        <Mono size={11} color="var(--fg-tertiary)">✕</Mono>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '14px 12px 6px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {m.from === 'coopr' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 2 }}>
                  <MetaLabel size={9}>Coopr</MetaLabel>
                  <Mono size={9} color="var(--fg-tertiary)">· {m.time}</Mono>
                </div>
                <div style={{
                  padding: '10px 12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  borderTopLeftRadius: 3,
                  maxWidth: '96%',
                  fontFamily: I.sans,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--fg-primary)',
                }}>
                  {m.text}
                </div>
                {m.actions && m.actions.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4, paddingLeft: 2 }}>
                    {m.actions.map((a, j) => (
                      <div key={j} style={{
                        padding: '4px 10px',
                        background: j === 0 ? 'var(--accent-primary)' : 'transparent',
                        border: j === 0 ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                        borderRadius: 999,
                        fontFamily: I.sans, fontSize: 11, fontWeight: 600,
                        color: j === 0 ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                      }}>{a}</div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ alignSelf: 'flex-end', maxWidth: '85%', padding: '8px 12px', background: 'var(--surface-3)', borderRadius: 10, borderTopRightRadius: 3, fontFamily: I.sans, fontSize: 12.5, color: 'var(--fg-primary)' }}>{m.text}</div>
            )}
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ padding: '6px 10px 4px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{ padding: '3px 9px', border: '1px solid var(--border-subtle)', borderRadius: 999, background: 'var(--surface-1)' }}>
              <Mono size={9.5} color="var(--fg-secondary)">{s}</Mono>
            </div>
          ))}
        </div>
      )}

      {/* Composer */}
      <div style={{ padding: 10 }}>
        <div style={{ padding: '10px 12px', background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: I.sans, fontSize: 12.5, color: 'var(--fg-tertiary)' }}>Ask about this doc, or /opener, /script…</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 6px', border: '1px solid var(--border-subtle)', borderRadius: 5 }}>
              <Mono size={10} color="var(--fg-secondary)">@</Mono>
              <Mono size={10} color="var(--fg-secondary)">doc</Mono>
            </div>
            <Mono size={9} color="var(--fg-tertiary)">⌘↵ to send</Mono>
            <div style={{ flex: 1 }} />
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--surface-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="11" height="11" viewBox="0 0 14 14"><path d="M7 2 L7 12 M3 6 L7 2 L11 6" stroke="var(--fg-on-ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Doc shell wrapper ────────────────────────────────────
function DocShell({ activeDoc, crumbs, chat, children }) {
  // Studio is a workspace under the new top-nav. The old DocSidebar (in-play /
  // parked tree) is gone — that file-tree affordance moved into a Docs index
  // accessed via the "Docs" sub-tab. What you see when you're IN a doc is just
  // the doc, with the per-doc breadcrumb and chat companion.
  return (
    <HfShell workspace="studio" subtab="Docs">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <DocCrumb crumbs={crumbs} />
          <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>{children}</div>
        </div>
        {chat}
      </div>
    </HfShell>
  );
}

// ─── Studio · default unified doc ─────────────────────────
function HF_StudioDoc() {
  const sections = ['Opening', 'Script', 'Shot list', 'Prep', 'Caption', 'Notes'];
  return (
    <DocShell
      activeDoc="Truk Lagoon · Ep. 1 hook"
      crumbs="Studio › In play › Truk Lagoon · Ep. 1 hook"
      chat={<SideChat
        messages={[
          { from: 'coopr', time: '7:12 am', text: "Morning. I drafted the script and shot list overnight from your Apr 19 voice memo. Opening hook pulls a line you said three times — replace anything that sounds off." },
          { from: 'you', text: 'tighten the hook' },
          { from: 'coopr', time: '7:14 am', text: "Three tighter openers, all under 12 words. I dropped #2 inline as a suggestion — accept with tab, or see all three.", actions: ['see all 3', 'swap #2'] },
          { from: 'coopr', time: 'just now', text: "No caption yet. Want me to draft one matched to your Tue 6:30 PM IG slot?", actions: ['draft caption', 'not yet'] },
        ]}
        suggestions={['/opener', '/script', '/list', '/brief', '/ship']}
      />}
    >
      <FloatingTOC sections={sections} active={1} />
      <div style={{ height: '100%', overflow: 'auto', padding: '44px 96px 60px 80px', position: 'relative' }}>

        {/* Title */}
        <Mono size={11} color="var(--fg-tertiary)">truk lagoon · apr 19 · single tank</Mono>
        <div style={{ marginTop: 4 }}>
          <span style={{ fontFamily: I.serif, fontSize: 64, fontWeight: 400, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.04 }}>The Fujikawa </span>
          <span style={{ fontFamily: I.serif, fontSize: 64, fontWeight: 400, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.04 }}>in eight breaths</span>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {[['Status', 'drafting · v3'], ['Format', '11-min YT'], ['Channel', 'YouTube'], ['Target', 'Tue 6:30 PM']].map(([k, v], i) => (
            <div key={i}>
              <MetaLabel size={9}>{k}</MetaLabel>
              <div style={{ marginTop: 2, fontFamily: I.sans, fontSize: 12.5, fontWeight: 500, color: 'var(--fg-primary)' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Lede */}
        <div style={{ marginTop: 28, maxWidth: 640 }}>
          <p style={{ margin: 0, fontFamily: I.sans, fontSize: 15.5, color: 'var(--fg-primary)', lineHeight: 1.65 }}>
            Filmed Apr 19 in Truk Lagoon. Eight-breath rule the whole dive — descend, hover, exhale, count. Writing this episode to feel like the rhythm of the dive, not narrate it.
            The hook needs to do the work in the first three seconds: <span style={{ background: 'rgba(182,83,43,0.14)', padding: '0 3px', borderRadius: 2 }}>most viewers leave by second four if it's just B-roll</span>.
          </p>
        </div>

        {/* Section: Opening */}
        <div style={{ marginTop: 44, maxWidth: 720 }}>
          <MetaLabel>01 · Opening</MetaLabel>
          <div style={{ marginTop: 6, fontFamily: I.serif, fontSize: 32, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>The hook</div>
          <div style={{ marginTop: 14 }}>
            <p style={{ margin: 0, fontFamily: I.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.7 }}>
              I dropped onto the deck of the Fujikawa Maru at 95 feet, and counted my breaths to eight before I moved.
            </p>
            <div style={{ marginTop: 10, paddingLeft: 14, borderLeft: '2px solid var(--accent-primary)' }}>
              <p style={{ margin: 0, fontFamily: I.serif, fontSize: 14.5, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55 }}>
                Eighty-one years ago this hold held bombs. Today it holds soft coral and a turtle that doesn't know any of that.
              </p>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <Sparkle size={10} />
                <Mono size={9.5} color="var(--accent-primary)">coopr suggested · just now</Mono>
                <div style={{ flex: 1 }} />
                <Mono size={9.5} color="var(--fg-tertiary)">tab to accept</Mono>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Script */}
        <div style={{ marginTop: 40, maxWidth: 720 }}>
          <MetaLabel>02 · Script</MetaLabel>
          <div style={{ marginTop: 6, fontFamily: I.serif, fontSize: 32, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>Eleven minutes</div>
          <div style={{ marginTop: 16 }}>
            {[
              ['0:00–0:08', "I dropped onto the deck of the Fujikawa Maru at 95 feet, and counted my breaths to eight before I moved.", 'HOOK'],
              ['0:08–0:42', "There's a thing wreck divers do that I never explain on camera, and it's the reason I'm still diving wrecks at 38. It's called the eight-breath rule.", 'SETUP'],
              ['0:42–4:10', "You stop. You count. You let your eyes finish dilating. You let the silt settle. Most importantly, you let your buddy catch up — the wreck isn't going anywhere.", 'BODY'],
              ['4:10–9:30', "The Fujikawa is the wreck I trust most to teach this. Open holds, predictable swim-throughs, and the kind of soft-coral overgrowth that punishes you for kicking too fast.", 'BODY'],
              ['9:30–11:00', "If you're heading to Truk this season, do me a favor: count to eight on the deck before you swim into hold three. Tell me what you see in the comments.", 'CTA'],
            ].map(([t, line, tag], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', gap: 16, padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                <Mono size={10.5} color="var(--fg-secondary)">{t}</Mono>
                <p style={{ margin: 0, fontFamily: I.serif, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.6 }}>{line}</p>
                <MetaLabel size={9} style={{ textAlign: 'right' }}>{tag}</MetaLabel>
              </div>
            ))}
          </div>
        </div>

        {/* Inline images */}
        <div style={{ marginTop: 28, display: 'flex', gap: 10, maxWidth: 720 }}>
          <Thumb w={232} h={144} label="fuji-deck.jpg" />
          <Thumb w={232} h={144} label="hold-3.jpg" />
          <Thumb w={232} h={144} label="turtle.jpg" />
        </div>

        {/* Section: Shot list */}
        <div style={{ marginTop: 40, maxWidth: 720 }}>
          <MetaLabel>03 · Shot list</MetaLabel>
          <div style={{ marginTop: 6, fontFamily: I.serif, fontSize: 32, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>14 shots, 6 keepers</div>
          <div style={{ marginTop: 14 }}>
            {[
              ['01', 'Wide — Fujikawa deck from above, descend POV', '0:00–0:08', true],
              ['02', 'Medium — gauges, breaths counting on screen', '0:08–0:30', true],
              ['03', 'Close — soft coral overgrowth on rail',         '0:30–1:00', true],
              ['04', 'POV — swim into hold three, slow',              '4:10–4:40', true],
              ['05', 'Macro — turtle eye, single breath',             '6:00–6:08', true],
              ['06', 'Wide — silhouette ascending past mast',         '9:30–9:50', true],
              ['07', 'Insert — boat deck back-roll (alt opener)',     null,         false],
            ].map(([n, t, time, keep], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 80px 50px', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                <Mono size={10.5} color={keep ? 'var(--accent-primary)' : 'var(--fg-tertiary)'}>{n}</Mono>
                <span style={{ fontFamily: I.sans, fontSize: 13.5, color: keep ? 'var(--fg-primary)' : 'var(--fg-tertiary)' }}>{t}</span>
                <Mono size={9.5} color="var(--fg-tertiary)" style={{ textAlign: 'right' }}>{time || '—'}</Mono>
                <Mono size={9.5} color={keep ? 'var(--tone-success)' : 'var(--fg-tertiary)'} style={{ textAlign: 'right' }}>{keep ? 'keep' : 'spare'}</Mono>
              </div>
            ))}
            <div style={{ padding: '10px 0' }}>
              <span style={{ fontFamily: I.sans, fontSize: 12.5, color: 'var(--fg-tertiary)' }}>+ 7 more</span>
            </div>
          </div>
        </div>

        {/* Section: Prep */}
        <div style={{ marginTop: 40, maxWidth: 720 }}>
          <MetaLabel>04 · Prep</MetaLabel>
          <div style={{ marginTop: 6, fontFamily: I.serif, fontSize: 32, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>Before publish</div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 28px' }}>
            {[
              ['Color graded · LUT v2', true],
              ['Dive computer overlays added', true],
              ['Audio · noise floor at -42db', true],
              ['Captions · pass 2 done', true],
              ['Thumbnail · A/B variants', true],
              ['Description · gear links', false],
              ['Cards & end screen', false],
              ['Cross-post short to IG', false],
            ].map(([t, d], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="13" height="13" viewBox="0 0 14 14">
                  <rect x="1" y="1" width="12" height="12" rx="2" fill={d ? 'var(--accent-primary)' : 'none'} stroke="var(--border-default)" strokeWidth="1.2" />
                  {d && <path d="M3.5 7 L6 9.5 L10.5 4" stroke="var(--fg-on-accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                </svg>
                <span style={{ fontFamily: I.sans, fontSize: 13, color: d ? 'var(--fg-tertiary)' : 'var(--fg-primary)', textDecoration: d ? 'line-through' : 'none', textDecorationColor: 'var(--border-default)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slash hint */}
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: '1px dashed var(--border-default)', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 720 }}>
          <span style={{ width: 2, height: 18, background: 'var(--fg-primary)' }} />
          <span style={{ fontFamily: I.sans, fontSize: 13, color: 'var(--fg-tertiary)' }}>
            Type <Mono size={11} color="var(--accent-primary)">/</Mono> for templates · or ask Coopr in the side panel →
          </span>
        </div>
      </div>
    </DocShell>
  );
}

// ─── Studio · slash menu open ─────────────────────────────
// Block-first slash menu. Atoms grouped by how the user thinks (Write / Plan /
// Schedule / Drop in / Ask Coopr). NOT a linear template menu — none of these
// imply order or stages. The user composes whatever shape they want.
function HF_StudioSlash() {
  // Each row = block atom. The "ask coopr" atoms route through the agent rather
  // than inserting an empty primitive.
  const groups = [
    {
      label: 'Write',
      items: [
        { cmd: '/h1',       desc: 'Heading',                         hint: 'big',           kind: 'block' },
        { cmd: '/h2',       desc: 'Subheading',                      hint: 'medium',        kind: 'block' },
        { cmd: '/text',     desc: 'Paragraph',                       hint: '',              kind: 'block' },
        { cmd: '/quote',    desc: 'Pull quote',                      hint: 'serif italic',  kind: 'block' },
        { cmd: '/callout',  desc: 'Highlighted note',                hint: 'tinted',        kind: 'block' },
      ],
    },
    {
      label: 'Plan',
      items: [
        { cmd: '/hook',     desc: 'Hook (one line, ≤1.4s)',           hint: '',              kind: 'block' },
        { cmd: '/scene',    desc: 'Scene · time + sentence',          hint: '',              kind: 'block', selected: true },
        { cmd: '/beat',     desc: 'Story beat',                       hint: 'in a script',   kind: 'block' },
        { cmd: '/shot',     desc: 'Shot · type + subject + duration', hint: '',              kind: 'block' },
        { cmd: '/checklist',desc: 'Checklist · prep / gear / safety', hint: '',              kind: 'block' },
      ],
    },
    {
      label: 'Schedule',
      items: [
        { cmd: '/caption',  desc: 'Caption draft',                   hint: 'platform-aware', kind: 'block' },
        { cmd: '/slot',     desc: 'Post slot · channel + time',      hint: '',              kind: 'block' },
      ],
    },
    {
      label: 'Drop in',
      items: [
        { cmd: '/image',    desc: 'Image',                            hint: 'paste or pick', kind: 'block' },
        { cmd: '/clip',     desc: 'Video clip',                       hint: '',              kind: 'block' },
        { cmd: '/voice',    desc: 'Voice note',                       hint: 'transcribed',   kind: 'block' },
        { cmd: '/post',     desc: 'Pull from Library',                hint: '@-mention',     kind: 'block' },
      ],
    },
    {
      label: 'Ask Coopr',
      items: [
        { cmd: '/draft',    desc: 'Write something here',             hint: 'rewrite, expand, tighten', kind: 'agent' },
        { cmd: '/edit',     desc: 'Edit this section',                hint: 'inline diff',   kind: 'agent' },
        { cmd: '/brainstorm',desc: 'Five takes on this idea',         hint: '',              kind: 'agent' },
        { cmd: '/extract',  desc: 'Extract caption / hook / quote',   hint: 'from selection',kind: 'agent' },
      ],
    },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <HF_StudioDoc />
      <div style={{
        position: 'absolute',
        left: 144, top: 380,
        width: 360,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        boxShadow: '0 14px 40px rgba(15,14,12,0.20)',
        padding: '6px 0 8px',
        zIndex: 20,
        maxHeight: 540,
        overflow: 'auto',
      }}>
        {/* Header / search affordance */}
        <div style={{ padding: '8px 14px 6px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mono size={10} color="var(--accent-primary)" style={{ fontWeight: 700 }}>/</Mono>
          <span style={{ fontFamily: I.sans, fontSize: 12.5, color: 'var(--fg-tertiary)', flex: 1 }}>Insert a block · type to filter</span>
          <Mono size={9} color="var(--fg-tertiary)">esc</Mono>
        </div>

        {groups.map((g, gi) => (
          <div key={g.label} style={{ padding: gi === 0 ? '6px 0 2px' : '4px 0 2px' }}>
            <div style={{ padding: '6px 14px 3px' }}>
              <MetaLabel size={9}>{g.label}</MetaLabel>
            </div>
            {g.items.map((it, i) => (
              <div key={i} style={{
                margin: '0 5px',
                padding: '7px 10px',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 12,
                background: it.selected ? 'var(--accent-soft)' : 'transparent',
                cursor: 'pointer',
              }}>
                {it.kind === 'agent' ? (
                  <Sparkle size={10} />
                ) : (
                  <span style={{ width: 10, height: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 1, background: 'var(--fg-tertiary)' }} />
                  </span>
                )}
                <span style={{ fontFamily: I.mono, fontSize: 11, fontWeight: 500, color: it.kind === 'agent' ? 'var(--accent-primary-press)' : 'var(--fg-secondary)', minWidth: 76 }}>{it.cmd}</span>
                <span style={{ fontFamily: I.sans, fontSize: 12, color: 'var(--fg-primary)', flex: 1 }}>{it.desc}</span>
                {it.hint && <Mono size={9} color="var(--fg-tertiary)" style={{ fontStyle: 'italic', fontFamily: I.serif, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>{it.hint}</Mono>}
                {it.selected && <Mono size={9} color="var(--accent-primary)" style={{ fontWeight: 700 }}>↵</Mono>}
              </div>
            ))}
          </div>
        ))}

        {/* Footer · agent prompt fall-through */}
        <div style={{ marginTop: 4, padding: '8px 14px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkle size={10} />
          <span style={{ fontFamily: I.sans, fontSize: 11.5, color: 'var(--fg-secondary)', flex: 1, fontStyle: 'italic' }}>
            Type anything · Coopr will do its best
          </span>
          <Mono size={9} color="var(--fg-tertiary)">↵</Mono>
        </div>
      </div>
    </div>
  );
}

// ─── Studio · short doc (proves adaptive shape) ───────────
function HF_StudioShortDoc() {
  return (
    <DocShell
      activeDoc="La Jolla shot list"
      crumbs="Studio › In play › La Jolla shot list"
      chat={<SideChat
        messages={[
          { from: 'coopr', time: '9:02 am', text: "This doc is just a shot list — that's fine. Want me to expand it into a full project when you're back from the dive?" },
          { from: 'you', text: 'nah, keep as notes' },
          { from: 'coopr', time: '9:03 am', text: "Got it. I'll leave the shape alone. Ping me when you want to expand.", actions: [] },
        ]}
        suggestions={['/script', '/ship', '+ expand to full project']}
      />}
    >
      <div style={{ height: '100%', overflow: 'auto', padding: '44px 96px 60px 80px' }}>
        <Mono size={11} color="var(--fg-tertiary)">la jolla · apr 24 · scouting</Mono>
        <div style={{ marginTop: 4 }}>
          <span style={{ fontFamily: I.serif, fontSize: 56, fontWeight: 400, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>La Jolla </span>
          <span style={{ fontFamily: I.serif, fontSize: 56, fontWeight: 400, fontStyle: 'italic', color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>shot list</span>
        </div>
        <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', border: '1px solid var(--border-default)', borderRadius: 999 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--fg-tertiary)' }} />
          <Mono size={10} color="var(--fg-secondary)">loose notes · no structure yet</Mono>
        </div>

        <div style={{ marginTop: 30, maxWidth: 640 }}>
          <p style={{ margin: 0, fontFamily: I.sans, fontSize: 15, color: 'var(--fg-primary)', lineHeight: 1.65 }}>
            Scouting Thursday morning before the leopard-shark spawn. Banking b-roll in case the main Truk shoot gets weathered out. Loose list, not matched to a script — Coopr offered to add structure, said no.
          </p>
        </div>

        <div style={{ marginTop: 32, maxWidth: 640 }}>
          {[
            'Leopard shark aggregation at shoreline · golden hour',
            'Garibaldi territorial display — single subject',
            'Kelp holdfast detail · backlit',
            'Sea hare close-up · slow push',
            'Sand divers emerging at dusk',
            'Surface silhouettes from 20ft',
            'Anemone cluster · macro',
            'Moray peek · tight frame',
          ].map((t, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <Mono size={10.5} color="var(--fg-tertiary)">{String(i + 1).padStart(2, '0')}</Mono>
              <span style={{ fontFamily: I.sans, fontSize: 14, color: 'var(--fg-primary)' }}>{t}</span>
            </div>
          ))}
          <div style={{ padding: '10px 0' }}>
            <span style={{ fontFamily: I.sans, fontSize: 12.5, color: 'var(--fg-tertiary)' }}>+ add shot</span>
          </div>
        </div>

        <div style={{ marginTop: 36, paddingTop: 18, borderTop: '1px dashed var(--border-default)', maxWidth: 640 }}>
          <p style={{ margin: 0, fontFamily: I.serif, fontSize: 14, fontStyle: 'italic', color: 'var(--fg-tertiary)', lineHeight: 1.55 }}>
            Channel ferry Thu/Sat only. If conditions tank push to Sat &amp; double up with the kelp scout for ep. 2.
          </p>
        </div>
      </div>
    </DocShell>
  );
}

Object.assign(window, { HF_StudioDoc, HF_StudioSlash, HF_StudioShortDoc });
